<?php

namespace App\Http\Controllers;

use App\Models\UserAnalytic;
use App\Services\AnalyticsMetricsService;
use App\Services\MetaConversionService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Inertia\Response;
use Symfony\Component\HttpFoundation\StreamedResponse;

class AnalyticsController extends Controller
{
    public function __construct(private readonly AnalyticsMetricsService $metrics) {}

    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'range' => ['nullable', Rule::in(['7', '30', '90', '365'])],
        ]);
        $dateRange = $validated['range'] ?? '30';
        $startDate = Carbon::now()->subDays((int) $dateRange)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        return Inertia::render('admin/analytics', [
            'stats' => $this->metrics->dashboardStats($startDate, $endDate),
            'chartData' => $this->getChartData($startDate, $endDate),
            'referralData' => $this->getReferralData($startDate, $endDate),
            'conversionFunnel' => $this->metrics->dashboardFunnel($startDate, $endDate),
            'capabilities' => $this->metrics->capabilities(),
            'dateRange' => $dateRange,
        ]);
    }

    public function track(Request $request, MetaConversionService $metaService): JsonResponse
    {
        $validated = $request->validate([
            'event_type' => ['required', Rule::in([
                'visit',
                'scroll',
                'engagement',
                'cta_click',
                'initiate_checkout',
                'conversion',
                'payment',
                'section_view',
            ])],
            'event_data' => ['nullable', 'array'],
            'event_data.event_id' => ['nullable', 'string', 'max:100'],
            'event_data.landing_source' => ['nullable', 'string', 'max:255'],
            'event_data.type' => ['nullable', 'string', 'max:100'],
            'event_data.depth' => ['nullable', 'numeric', 'min:0', 'max:100'],
            'event_data.duration' => ['nullable', 'numeric', 'min:0'],
            'event_data.is_initial' => ['nullable', 'boolean'],
            'event_data.page' => ['nullable', 'string', 'max:2048'],
            'event_data.timestamp' => ['nullable', 'date'],
            'event_data.location' => ['nullable', 'string', 'max:100'],
            'event_data.text' => ['nullable', 'string', 'max:255'],
            'event_data.destination' => ['nullable', 'string', 'max:2048'],
            'event_data.section' => ['nullable', 'string', 'max:100'],
            'event_data.package' => ['nullable', 'string', 'max:100'],
            'event_data.price' => ['nullable', 'numeric', 'min:0'],
            'event_data.payment_url' => ['nullable', 'string', 'max:2048'],
            'event_data.status' => ['nullable', 'string', 'max:50'],
            'event_data.amount' => ['nullable', 'numeric', 'min:0'],
            'event_data.currency' => ['nullable', 'string', 'size:3'],
            'event_data.meta_event' => ['nullable', 'string', 'max:100'],
            'event_data._fbp' => ['nullable', 'string', 'max:255'],
            'event_data._fbc' => ['nullable', 'string', 'max:255'],
            'event_data.order_id' => ['nullable', 'string', 'max:100'],
            'event_data.email' => ['nullable', 'email', 'max:255'],
            'event_data.phone' => ['nullable', 'string', 'max:50'],
            'event_data.name' => ['nullable', 'string', 'max:255'],
            'referral_source' => ['nullable', 'string', 'max:255'],
            'utm_source' => ['nullable', 'string', 'max:255'],
            'utm_medium' => ['nullable', 'string', 'max:255'],
            'utm_campaign' => ['nullable', 'string', 'max:255'],
            'utm_content' => ['nullable', 'string', 'max:255'],
            'utm_term' => ['nullable', 'string', 'max:255'],
        ]);

        $eventData = $validated['event_data'] ?? [];
        $eventId = $eventData['event_id'] ?? null;

        if ($eventId && UserAnalytic::query()->where('event_data->event_id', $eventId)->exists()) {
            return response()->json(['success' => true, 'duplicate' => true]);
        }

        UserAnalytic::create([
            'session_id' => $request->session()->getId(),
            'event_type' => $validated['event_type'],
            'event_data' => $eventData,
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

        if ($eventId) {
            if ($validated['event_type'] === 'visit') {
                $metaService->sendPageView($request, $eventId);
            }

            if ($validated['event_type'] === 'initiate_checkout') {
                $metaService->sendAddToCart($request, $eventId, $eventData);
            }
        }

        return response()->json(['success' => true]);
    }

    public function export(Request $request): StreamedResponse
    {
        $validated = $request->validate([
            'range' => ['nullable', Rule::in(['7', '30', '90', '365'])],
        ]);
        $dateRange = $validated['range'] ?? '30';
        $startDate = Carbon::now()->subDays((int) $dateRange)->startOfDay();
        $data = UserAnalytic::where('created_at', '>=', $startDate)->latest('created_at')->get();

        return response()->stream(function () use ($data) {
            $file = fopen('php://output', 'w');
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
        }, 200, [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename=analytics-export.csv',
        ]);
    }

    private function getChartData(Carbon $startDate, Carbon $endDate)
    {
        $eventData = UserAnalytic::select(
            DB::raw('DATE(created_at) as date'),
            DB::raw('COUNT(DISTINCT session_id) as total'),
            'event_type'
        )
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('event_type', ['visit', 'cta_click', 'payment'])
            ->groupBy(['date', 'event_type'])
            ->orderBy('date')
            ->get()
            ->groupBy('event_type');

        $engagedQuery = DB::table('user_analytics')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT session_id) as total'),
            )
            ->whereBetween('created_at', [$startDate, $endDate]);
        $this->metrics->applyEngagedEventConditions($engagedQuery, $startDate, $endDate);

        $eventData->put('engagement', $engagedQuery
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get());

        $checkoutQuery = DB::table('user_analytics')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT session_id) as total'),
            )
            ->whereBetween('created_at', [$startDate, $endDate]);
        $this->metrics->applyCheckoutEventConditions($checkoutQuery);

        $directCheckoutData = $checkoutQuery
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
        $eventData->put('direct_checkout', $directCheckoutData);

        $whatsAppLeadQuery = DB::table('user_analytics')
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(DISTINCT session_id) as total'),
            )
            ->whereBetween('created_at', [$startDate, $endDate]);
        $this->metrics->applyWhatsAppLeadEventConditions($whatsAppLeadQuery);

        $whatsAppLeadData = $whatsAppLeadQuery
            ->groupBy(DB::raw('DATE(created_at)'))
            ->orderBy('date')
            ->get();
        $eventData->put('whatsapp_lead', $whatsAppLeadData);

        $totalLeadData = $directCheckoutData
            ->concat($whatsAppLeadData)
            ->groupBy('date')
            ->map(fn ($rows, $date) => (object) [
                'date' => $date,
                'total' => $rows->sum('total'),
            ])
            ->sortBy('date')
            ->values();
        $eventData->put('total_lead', $totalLeadData);

        return $eventData;
    }

    private function getReferralData(Carbon $startDate, Carbon $endDate)
    {
        return UserAnalytic::select('referral_source', DB::raw('COUNT(DISTINCT session_id) as count'))
            ->where('event_type', 'visit')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('referral_source')
            ->groupBy('referral_source')
            ->orderByDesc('count')
            ->limit(10)
            ->get();
    }
}
