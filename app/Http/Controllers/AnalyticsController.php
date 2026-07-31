<?php

namespace App\Http\Controllers;

use App\Models\UserAnalytic;
use App\Services\MetaConversionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    /**
     * All event_type values that represent a lead (form submission).
     * Mirrors AbTestingService::LEAD_EVENT_TYPES — keep them in sync.
     */
    private const LEAD_EVENT_TYPES = ['conversion', 'conversions', 'lead', 'leads'];

    public function index(Request $request): Response
    {
        $dateRange = $request->get('range', '30');
        $startDate = Carbon::now()->subDays((int) $dateRange);

        return Inertia::render('admin/analytics', [
            'stats' => $this->getAnalyticsStats($startDate),
            'chartData' => $this->getChartData($startDate),
            'referralData' => $this->getReferralData($startDate),
            'conversionFunnel' => $this->getConversionFunnel($startDate),
            'dateRange' => $dateRange,
        ]);
    }

public function track(Request $request, MetaConversionService $metaService): JsonResponse
{
    $validated = $request->validate([
        'event_type' => 'required|string|in:visit,scroll,engagement,cta_click,initiate_checkout,conversion,payment,section_view',
        'event_data' => 'nullable|array',
        'referral_source' => 'nullable|string|max:255',
        'utm_source' => 'nullable|string|max:255',
        'utm_medium' => 'nullable|string|max:255',
        'utm_campaign' => 'nullable|string|max:255',
        'utm_content' => 'nullable|string|max:255',
        'utm_term' => 'nullable|string|max:255',
    ]);

    if ($validated['event_type'] === 'payment') {
        $incomingEventId = $validated['event_data']['event_id'] ?? null;

        if ($incomingEventId) {
            $alreadyRecorded = UserAnalytic::where('event_type', 'payment')
                ->whereRaw("json_extract(event_data, '$.event_id') = ?", [$incomingEventId])
                ->exists();

            if ($alreadyRecorded) {
                // Same payment event_id already logged — most likely a
                // refresh of the success page. Meta dedupes this on its own
                // side via event_id, but our own UserAnalytic table has no
                // such protection, so without this check every refresh would
                // inflate payments/total_revenue on the internal dashboard.
                return response()->json(['success' => true, 'duplicate' => true]);
            }
        }
    }

    UserAnalytic::create([
        'session_id' => $request->session()->getId(),
        'event_type' => $validated['event_type'],
        'event_data' => $validated['event_data'] ?? [],
        'referral_source' => $validated['referral_source'] ?? null,
        'utm_source' => $validated['utm_source'] ?? null,
        'utm_medium' => $validated['utm_medium'] ?? null,
        'utm_campaign' => $validated['utm_campaign'] ?? null,
        'utm_content' => $validated['utm_content'] ?? null,
        'utm_term' => $validated['utm_term'] ?? null,
        'ip_hash' => hash('sha256', $request->ip().config('app.key')),
        'user_agent' => $request->userAgent(),
        'user_id' => $request->user()?->id,
        'created_at' => now(),
    ]);

    $eventId = $request->input('event_data.event_id');

    if ($eventId) {
        if ($validated['event_type'] === 'visit') {
            $metaService->sendPageView($request, $eventId);
        }

        if ($validated['event_type'] === 'initiate_checkout') {
            $metaService->sendAddToCart($request, $eventId);
        }

        if ($validated['event_type'] === 'conversion') {
            $metaService->sendInitiateCheckout($request, $eventId);
        }

        if ($validated['event_type'] === 'payment' && ($validated['event_data']['status'] ?? null) === 'success') {
            $email = $validated['event_data']['email'] ?? null;
            $phone = $validated['event_data']['phone'] ?? null;
            $name  = $validated['event_data']['name'] ?? null;

            if (! $email || ! $phone) {
                // The checkout form already collected PII at the conversion step —
                // fall back to the most recent conversion event in this session.
                // ASSUMPTION: payment success page loads in the same browser session
                // as checkout (gateway redirect). Server-to-server callbacks use the
                // webhook path (PaymentCallbackController) which already carries Order PII.
                $conversionEvent = UserAnalytic::where('session_id', $request->session()->getId())
                    ->where('event_type', 'conversion')
                    ->latest('created_at')
                    ->first();

                $email ??= $conversionEvent?->event_data['email'] ?? null;
                $phone ??= $conversionEvent?->event_data['phone'] ?? null;
                $name  ??= $conversionEvent?->event_data['name'] ?? null;
            }

            if ($email) {
                $metaService->sendPurchase(
                    $request,
                    $eventId,
                    (int) ($validated['event_data']['amount'] ?? 0),
                    $email,
                    $phone,
                    $name,
                );
            } else {
                // sendPurchase()'s $email param is non-nullable — calling it
                // without one would throw a TypeError, not fail quietly.
                Log::warning('Skipped Meta Purchase CAPI: no email found for payment event', [
                    'session_id' => $request->session()->getId(),
                ]);
            }
        }
    }

    return response()->json(['success' => true]);
}

    public function export(Request $request): StreamedResponse
    {
        $dateRange = $request->get('range', '30');
        $startDate = Carbon::now()->subDays((int) $dateRange);

        $data = UserAnalytic::where('created_at', '>=', $startDate)
            ->orderBy('created_at', 'desc')
            ->get();

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="analytics-export.csv"',
        ];

        $callback = function () use ($data) {
            $file = fopen('php://output', 'w');

            if ($file === false) {
                return;
            }

            fputcsv($file, ['Date', 'Event Type', 'Referral Source', 'Event Data', 'User ID']);

            foreach ($data as $row) {
                fputcsv($file, [
                    $row->created_at->format('Y-m-d H:i:s'),
                    $row->event_type,
                    $row->referral_source,
                    json_encode($row->event_data),
                    $row->user_id,
                ]);
            }
            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    private function getAnalyticsStats(Carbon $startDate): array
    {
        $totalVisits = UserAnalytic::where('event_type', 'visit')
            ->where('created_at', '>=', $startDate)
            ->count();

        $uniqueVisitors = UserAnalytic::where('event_type', 'visit')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        // Engaged = exact inverse of Bounced — same three-condition logic as
        // AbTestingService::batchBouncedCounts() and the Split Funnel:
        //   A session is Bounced only if it had NONE of:
        //     1. a dwell_ping engagement event  (stayed < 15 s active)
        //     2. a scroll event with depth >= 25%
        //     3. any funnel action (cta_click / initiate_checkout / conversion / payment)
        //   => Engaged = uniqueVisitors - bouncedSessions
        $bouncedSessions = DB::table('user_analytics as v')
            ->where('v.event_type', 'visit')
            ->where('v.created_at', '>=', $startDate)
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as e')
                    ->whereColumn('e.session_id', 'v.session_id')
                    ->where('e.event_type', 'engagement')
                    ->whereRaw("json_extract(e.event_data, '$.type') = 'dwell_ping'")
                    ->where('e.created_at', '>=', $startDate);
            })
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as s')
                    ->whereColumn('s.session_id', 'v.session_id')
                    ->where('s.event_type', 'scroll')
                    ->whereRaw("CAST(json_extract(s.event_data, '$.depth') AS DECIMAL(10,2)) >= 25")
                    ->where('s.created_at', '>=', $startDate);
            })
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as f')
                    ->whereColumn('f.session_id', 'v.session_id')
                    ->whereIn('f.event_type', array_merge(['cta_click', 'initiate_checkout', 'payment'], self::LEAD_EVENT_TYPES))
                    ->where('f.created_at', '>=', $startDate);
            })
            ->distinct('v.session_id')
            ->count('v.session_id');

        $engagedUsers = max(0, $uniqueVisitors - $bouncedSessions);

        $ctaClicks = UserAnalytic::where('event_type', 'cta_click')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $addToCart = UserAnalytic::where('event_type', 'initiate_checkout')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $leads = UserAnalytic::whereIn('event_type', self::LEAD_EVENT_TYPES)
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $paymentAnalytics = UserAnalytic::where('event_type', 'payment')
            ->where('created_at', '>=', $startDate)
            ->whereRaw("json_extract(event_data, '$.status') = 'success'")
            ->get();

        $payments = $paymentAnalytics->pluck('session_id')->unique()->count();
        $revenue = $paymentAnalytics->sum(fn ($analytic) => (float) ($analytic->event_data['amount'] ?? 0));

        return [
            'total_visits' => $totalVisits,
            'unique_visitors' => $uniqueVisitors,
            'engagement_rate' => $uniqueVisitors > 0 ? round(($engagedUsers / $uniqueVisitors) * 100, 2) : 0,
            'engaged_users' => $engagedUsers,
            'intent_rate' => $uniqueVisitors > 0 ? round(($ctaClicks / $uniqueVisitors) * 100, 2) : 0,
            'cta_clicks' => $ctaClicks,
            'add_to_cart' => $addToCart,
            'add_to_cart_rate' => $uniqueVisitors > 0 ? round(($addToCart / $uniqueVisitors) * 100, 2) : 0,
            'lead_rate' => $uniqueVisitors > 0 ? round(($leads / $uniqueVisitors) * 100, 2) : 0,
            'leads' => $leads,
            'lead_to_payment_rate' => $leads > 0 ? round(($payments / $leads) * 100, 2) : 0,
            'payment_rate' => $uniqueVisitors > 0 ? round(($payments / $uniqueVisitors) * 100, 2) : 0,
            'total_revenue' => $revenue,
            'payments' => $payments,
        ];
    }

    private function getChartData(Carbon $startDate)
    {
        $eventData = UserAnalytic::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total'),
            'event_type'
        )
            ->where('created_at', '>=', $startDate)
            ->whereIn('event_type', ['visit', 'cta_click', 'initiate_checkout', 'payment'])
            ->groupBy(['date', 'event_type'])
            ->orderBy('date')
            ->get()
            ->groupBy('event_type');

        // Per-day engaged sessions using the same three-condition OR logic as
        // getAnalyticsStats() and AbTestingService::getSplitFunnel().
        // A session counts as engaged for a given day if that day it had AT LEAST ONE of:
        //   • a dwell_ping engagement event
        //   • a scroll event with depth >= 25%
        //   • any funnel action (cta_click / initiate_checkout / conversion / payment)
        $engagedPerDay = DB::table('user_analytics')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT session_id) as total'),
            )
            ->where('created_at', '>=', $startDate)
            ->where(function ($q) {
                $q->where(function ($sub) {
                    $sub->where('event_type', 'engagement')
                        ->whereRaw("json_extract(event_data, '$.type') = 'dwell_ping'");
                })
                ->orWhere(function ($sub) {
                    $sub->where('event_type', 'scroll')
                        ->whereRaw("CAST(json_extract(event_data, '$.depth') AS DECIMAL(10,2)) >= 25");
                })
                ->orWhereIn('event_type', array_merge(['cta_click', 'initiate_checkout', 'payment'], self::LEAD_EVENT_TYPES));
            })
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($row) => ['date' => $row->date, 'total' => $row->total]);

        // Per-day leads: aggregate all LEAD_EVENT_TYPES into a single 'leads' series.
        // Using a separate query (instead of adding them to the main whereIn) avoids
        // creating 4 separate event_type buckets that the frontend can't merge.
        $leadsPerDay = DB::table('user_analytics')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT session_id) as total'),
            )
            ->where('created_at', '>=', $startDate)
            ->whereIn('event_type', self::LEAD_EVENT_TYPES)
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get()
            ->map(fn($row) => ['date' => $row->date, 'total' => $row->total]);

        $eventData['leads'] = $leadsPerDay;
        $eventData['engagement'] = $engagedPerDay;

        return $eventData;
    }

    private function getReferralData(Carbon $startDate)
    {
        return UserAnalytic::select('referral_source', DB::raw('COUNT(*) as count'))
            ->where('event_type', 'visit')
            ->where('created_at', '>=', $startDate)
            ->whereNotNull('referral_source')
            ->groupBy('referral_source')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
    }

    private function getConversionFunnel(Carbon $startDate): array
    {
        $visits = UserAnalytic::where('event_type', 'visit')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');

        // Engaged = visits - bounced (same three-condition NOT EXISTS logic as getAnalyticsStats)
        $bouncedCount = DB::table('user_analytics as v')
            ->where('v.event_type', 'visit')
            ->where('v.created_at', '>=', $startDate)
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as e')
                    ->whereColumn('e.session_id', 'v.session_id')
                    ->where('e.event_type', 'engagement')
                    ->whereRaw("json_extract(e.event_data, '$.type') = 'dwell_ping'")
                    ->where('e.created_at', '>=', $startDate);
            })
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as s')
                    ->whereColumn('s.session_id', 'v.session_id')
                    ->where('s.event_type', 'scroll')
                    ->whereRaw("CAST(json_extract(s.event_data, '$.depth') AS DECIMAL(10,2)) >= 25")
                    ->where('s.created_at', '>=', $startDate);
            })
            ->whereNotExists(function ($sub) use ($startDate) {
                $sub->from('user_analytics as f')
                    ->whereColumn('f.session_id', 'v.session_id')
                    ->whereIn('f.event_type', array_merge(['cta_click', 'initiate_checkout', 'payment'], self::LEAD_EVENT_TYPES))
                    ->where('f.created_at', '>=', $startDate);
            })
            ->distinct('v.session_id')
            ->count('v.session_id');

        $engaged   = max(0, $visits - $bouncedCount);
        $intent    = UserAnalytic::where('event_type', 'cta_click')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $addToCart = UserAnalytic::where('event_type', 'initiate_checkout')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $leads     = UserAnalytic::whereIn('event_type', self::LEAD_EVENT_TYPES)->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $payments  = UserAnalytic::where('event_type', 'payment')->where('created_at', '>=', $startDate)->whereRaw("json_extract(event_data, '$.status') = 'success'")->distinct('session_id')->count('session_id');

        // percentage  = % of total visits (drives the bar width — classic funnel shape).
        // transition_pct = A→B retention rate, the primary metric shown between stages.
        $ofVisits   = fn ($n) => $visits > 0 ? round($n / $visits * 100, 1) : 0.0;
        $transition = fn ($n, $prev) => $prev > 0 ? round($n / $prev * 100, 1) : 0.0;

        return [
            ['stage' => 'Visits',      'count' => $visits,    'percentage' => 100.0,                 'transition_pct' => null,                            'from_stage' => null],
            ['stage' => 'Engaged',     'count' => $engaged,   'percentage' => $ofVisits($engaged),   'transition_pct' => $transition($engaged, $visits),  'from_stage' => 'Visits'],
            ['stage' => 'Intent',      'count' => $intent,    'percentage' => $ofVisits($intent),    'transition_pct' => $transition($intent, $engaged),  'from_stage' => 'Engaged'],
            ['stage' => 'Add to Cart', 'count' => $addToCart, 'percentage' => $ofVisits($addToCart), 'transition_pct' => $transition($addToCart, $intent), 'from_stage' => 'Intent'],
            ['stage' => 'Leads',       'count' => $leads,     'percentage' => $ofVisits($leads),     'transition_pct' => $transition($leads, $addToCart), 'from_stage' => 'Add to Cart'],
            ['stage' => 'Payments',    'count' => $payments,  'percentage' => $ofVisits($payments),  'transition_pct' => $transition($payments, $leads),  'from_stage' => 'Leads'],
        ];
    }
}