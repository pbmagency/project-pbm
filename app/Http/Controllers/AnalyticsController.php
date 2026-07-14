<?php

namespace App\Http\Controllers;

use App\Models\UserAnalytic;
use App\Services\MetaConversionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
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

        $engagedUsers = UserAnalytic::where('event_type', 'engagement')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $ctaClicks = UserAnalytic::where('event_type', 'cta_click')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $conversions = UserAnalytic::where('event_type', 'conversion')
            ->where('created_at', '>=', $startDate)
            ->distinct('session_id')
            ->count('session_id');

        $paymentAnalytics = UserAnalytic::where('event_type', 'payment')
            ->where('created_at', '>=', $startDate)
            ->whereRaw("json_extract(event_data, '$.status') = 'success'")
            ->get();

        $payments = $paymentAnalytics->count();
        $revenue = $paymentAnalytics->sum(fn ($analytic) => (float) ($analytic->event_data['amount'] ?? 0));

        return [
            'total_visits' => $totalVisits,
            'unique_visitors' => $uniqueVisitors,
            'engagement_rate' => $uniqueVisitors > 0 ? round(($engagedUsers / $uniqueVisitors) * 100, 2) : 0,
            'engaged_users' => $engagedUsers,
            'intent_rate' => $engagedUsers > 0 ? round(($ctaClicks / $engagedUsers) * 100, 2) : 0,
            'cta_clicks' => $ctaClicks,
            'add_to_cart_rate' => $uniqueVisitors > 0 ? round(($ctaClicks / $uniqueVisitors) * 100, 2) : 0,
            'conversion_rate' => $ctaClicks > 0 ? round(($conversions / $ctaClicks) * 100, 2) : 0,
            'conversions' => $conversions,
            'conversion_to_payment_rate' => $conversions > 0 ? round(($payments / $conversions) * 100, 2) : 0,
            'payment_rate' => $totalVisits > 0 ? round(($payments / $totalVisits) * 100, 2) : 0,
            'total_revenue' => $revenue,
            'payments' => $payments,
        ];
    }

    private function getChartData(Carbon $startDate)
    {
        return UserAnalytic::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(*) as total'),
            'event_type'
        )
            ->where('created_at', '>=', $startDate)
            ->whereIn('event_type', ['visit', 'engagement', 'conversion', 'payment'])
            ->groupBy(['date', 'event_type'])
            ->orderBy('date')
            ->get()
            ->groupBy('event_type');
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
        $engaged = UserAnalytic::where('event_type', 'engagement')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $ctaClicks = UserAnalytic::where('event_type', 'cta_click')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $conversions = UserAnalytic::where('event_type', 'conversion')->where('created_at', '>=', $startDate)->distinct('session_id')->count('session_id');
        $payments = UserAnalytic::where('event_type', 'payment')->where('created_at', '>=', $startDate)->whereRaw("json_extract(event_data, '$.status') = 'success'")->distinct('session_id')->count('session_id');

        return [
            ['stage' => 'Visits', 'count' => $visits, 'percentage' => 100],
            ['stage' => 'Engaged', 'count' => $engaged, 'percentage' => $visits > 0 ? round(($engaged / $visits) * 100, 1) : 0],
            ['stage' => 'CTA Clicks', 'count' => $ctaClicks, 'percentage' => $visits > 0 ? round(($ctaClicks / $visits) * 100, 1) : 0],
            ['stage' => 'Conversions', 'count' => $conversions, 'percentage' => $visits > 0 ? round(($conversions / $visits) * 100, 1) : 0],
            ['stage' => 'Payments', 'count' => $payments, 'percentage' => $visits > 0 ? round(($payments / $visits) * 100, 1) : 0],
        ];
    }
}
