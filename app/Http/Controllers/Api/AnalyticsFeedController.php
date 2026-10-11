<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Controllers\AnalyticsController;
use App\Services\OpsAnalyticsFeedDetails;
use App\Services\AbTestingService;
use App\Services\AnalyticsMetricsService;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class AnalyticsFeedController extends Controller
{
    public function __construct(
        private readonly AnalyticsMetricsService $metrics,
        private readonly AbTestingService $abTestingService
    ) {}

    public function feed(Request $request): JsonResponse
    {
        $secret = config('ops_board.secret');
        $providedSecret = $request->header('X-Ops-Secret');

        if (! is_string($secret) || $secret === '' || ! is_string($providedSecret) || ! hash_equals($secret, $providedSecret)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        $days = (int) ($request->validate(['range' => 'nullable|integer|in:7,30,90,365'])['range'] ?? 30);
        $startDate = Carbon::now()->subDays($days)->startOfDay();
        $endDate = Carbon::now()->endOfDay();

        $stats = $this->metrics->dashboardStats($startDate, $endDate);
        $rawMatrix = $this->abTestingService->getPerformanceMatrix($startDate, $endDate);
        $analytics = app(AnalyticsController::class);
        $details = app(OpsAnalyticsFeedDetails::class)->build(
            $analytics->getChartData($startDate, $endDate),
            $analytics->getReferralData($startDate, $endDate),
            $startDate,
            $endDate
        );

        $matrix = [];
        $maxTotalLeadsCr = -1;
        $winnerIndex = -1;

        foreach ($rawMatrix as $idx => $row) {
            $visits = (int) ($row['visits'] ?? 0);
            $directCheckouts = (int) ($row['direct_checkouts'] ?? 0);
            $whatsappLeads = (int) ($row['whatsapp_leads'] ?? 0);
            $totalLeads = (int) ($row['total_leads'] ?? ($directCheckouts + $whatsappLeads));

            $bounceRate = (float) ($row['bounce_rate'] ?? 0);
            $engagementRate = max(0, round(100 - $bounceRate, 2));
            $directCheckoutRate = (float) ($row['direct_checkout_rate'] ?? 0);
            $whatsappLeadRate = (float) ($row['whatsapp_lead_rate'] ?? 0);
            $totalLeadRate = (float) ($row['total_lead_rate'] ?? 0);

            $item = [
                'landing_source' => $row['landing_source'] ?? '/',
                'routing' => $row['landing_source'] ?? '/',
                'variant_label' => $row['landing_source'] ?? '/',
                'visits' => $visits,
                'bounced' => (int) ($row['bounced'] ?? 0),
                'bounce_rate' => $bounceRate,
                'engagement' => (int) ($row['engagement'] ?? 0),
                'engagement_rate' => $engagementRate,
                'direct_checkouts' => $directCheckouts,
                'direct_checkout_rate' => $directCheckoutRate,
                'whatsapp_leads' => $whatsappLeads,
                'whatsapp_lead_rate' => $whatsappLeadRate,
                'total_leads' => $totalLeads,
                'total_lead_rate' => $totalLeadRate,
                'total_leads_cr' => $totalLeadRate,
                'is_winner' => false,
            ];

            if ($totalLeadRate > $maxTotalLeadsCr && $visits > 0) {
                $maxTotalLeadsCr = $totalLeadRate;
                $winnerIndex = $idx;
            }

            $matrix[] = $item;
        }

        if ($winnerIndex >= 0 && isset($matrix[$winnerIndex])) {
            $matrix[$winnerIndex]['is_winner'] = true;
        }

        return response()->json([
            'success' => true,
            'schema_version' => 2,
            'project_key' => env('PBM_OPS_PROJECT_KEY', 'project-pbm'),
            'project_name' => config('app.name', 'Project PBM'),
            'date_range_days' => $days,
            'start_date' => $startDate->toDateString(),
            'end_date' => $endDate->toDateString(),
            'stats' => $stats,
            'performance_matrix' => $matrix,
            ...$details,
            'generated_at' => now()->toIso8601String(),
        ]);
    }
}
