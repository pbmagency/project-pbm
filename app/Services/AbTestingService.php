<?php

namespace App\Services;

use App\Models\UserAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AbTestingService
{
    // ── Public API ────────────────────────────────────────────────────────────

    public function getPerformanceMatrix(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $counts = $this->batchEventCounts(
            $startDate,
            $endDate,
            $sourceFilter,
            ['visit', 'engagement', 'initiate_checkout', 'conversion', 'payment', 'cta_click']
        );

        if (empty($counts)) {
            return [];
        }

        $bouncedBySource = $this->batchBouncedCounts($startDate, $endDate, $sourceFilter);
        $revenueBySource = $this->batchRevenue($startDate, $endDate, $sourceFilter);

        $matrix = [];
        foreach ($counts as $source => $typeCounts) {
            $visits = $typeCounts['visit'] ?? 0;
            $engaged = $typeCounts['engagement'] ?? 0;
            $initiateCheckouts = $typeCounts['initiate_checkout'] ?? 0;
            $leads = $typeCounts['conversion'] ?? 0;
            $payments = $typeCounts['payment'] ?? 0;
            $ctaClicks = $typeCounts['cta_click'] ?? 0;

            $bounced = $bouncedBySource[$source] ?? ($visits - $engaged);
            $revenue = (float) ($revenueBySource[$source] ?? 0);

            $matrix[] = [
                'landing_source' => $source,
                'visits' => $visits,
                'bounce_rate' => round($this->safePct($bounced, $visits), 2),
                'intent_rate' => round($this->safePct($ctaClicks, $visits), 2),
                'initiate_checkout_rate' => round($this->safePct($initiateCheckouts, $visits), 2),
                'lead_cr' => round($this->safePct($leads, $visits), 2),
                'strict_cr' => round($this->safePct($payments, $visits), 2),
                'rpv' => $visits > 0 ? round($revenue / $visits, 2) : 0,
                'revenue' => $revenue,
                'initiate_checkouts' => $initiateCheckouts,
                'leads' => $leads,
                'conversions' => $leads,
                'payments' => $payments,
                'cta_clicks' => $ctaClicks,
            ];
        }

        usort($matrix, fn ($a, $b) => $b['rpv'] <=> $a['rpv']);

        return $matrix;
    }

    public function getSplitFunnel(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $counts = $this->batchEventCounts(
            $startDate,
            $endDate,
            $sourceFilter,
            ['visit', 'engagement', 'cta_click', 'initiate_checkout', 'conversion', 'payment']
        );

        if (empty($counts)) {
            return [];
        }

        $funnel = [];
        foreach ($counts as $source => $typeCounts) {
            $visits = $typeCounts['visit'] ?? 0;
            $engaged = $typeCounts['engagement'] ?? 0;
            $intent = $typeCounts['cta_click'] ?? 0;
            $initiateCheckouts = $typeCounts['initiate_checkout'] ?? 0;
            $leads = $typeCounts['conversion'] ?? 0;
            $sales = $typeCounts['payment'] ?? 0;

            $funnel[] = [
                'landing_source' => $source,
                'steps' => [
                    ['stage' => 'Visits', 'count' => $visits, 'percentage' => 100],
                    ['stage' => 'Engaged', 'count' => $engaged, 'percentage' => round($this->safePct($engaged, $visits), 1)],
                    ['stage' => 'Intent', 'count' => $intent, 'percentage' => round($this->safePct($intent, $visits), 1)],
                    ['stage' => 'Initiate Checkout', 'count' => $initiateCheckouts, 'percentage' => round($this->safePct($initiateCheckouts, $visits), 1)],
                    ['stage' => 'Leads', 'count' => $leads, 'percentage' => round($this->safePct($leads, $visits), 1)],
                    ['stage' => 'Sales', 'count' => $sales, 'percentage' => round($this->safePct($sales, $visits), 1)],
                ],
            ];
        }

        return $funnel;
    }

    public function getDevicePerformance(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $sources = $this->getValidLandingSources($startDate, $endDate, $sourceFilter);
        if ($sources->isEmpty()) {
            return [];
        }

        $visitData = $this->batchVisitSessionsWithUserAgent($startDate, $endDate, $sourceFilter);
        $leadSessions = $this->batchLeadSessionIds($startDate, $endDate, $sourceFilter);

        $performance = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $visits = $visitData[$src] ?? collect();
            $leads = $leadSessions[$src] ?? collect();

            $mobile = $visits->filter(fn ($r) => $this->isMobileDevice($r->user_agent));
            $desktop = $visits->reject(fn ($r) => $this->isMobileDevice($r->user_agent));

            $mobileIds = $mobile->pluck('session_id')->unique();
            $desktopIds = $desktop->pluck('session_id')->unique();

            $mobLeads = $leads->intersect($mobileIds)->count();
            $deskLeads = $leads->intersect($desktopIds)->count();

            $performance[] = [
                'landing_source' => $src,
                'mobile' => ['visits' => $mobileIds->count(), 'leads' => $mobLeads, 'conversion_rate' => round($this->safeDiv($mobLeads, $mobileIds->count()) * 100, 2)],
                'desktop' => ['visits' => $desktopIds->count(), 'leads' => $deskLeads, 'conversion_rate' => round($this->safeDiv($deskLeads, $desktopIds->count()) * 100, 2)],
            ];
        }

        return $performance;
    }

    public function getCtaPerformance(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $query = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                DB::raw("COALESCE(json_extract(event_data, '$.location'), 'unknown') as cta_location"),
                'session_id',
            ])
            ->where('event_type', 'cta_click')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')");

        if ($sourceFilter && $sourceFilter !== 'all') {
            $query->where('referral_source', $sourceFilter);
        }

        $ctaClicks = $query->get();

        $leadSessions = DB::table('user_analytics')
            ->where('event_type', 'conversion')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->distinct()
            ->pluck('session_id');

        return $ctaClicks->groupBy(fn ($row) => $this->normalizeLandingSource($row->landing_source))->map(function ($sourceClicks, $landingSource) use ($leadSessions) {
            $locations = $sourceClicks->groupBy('cta_location')->map(function ($locationClicks, $location) use ($leadSessions) {
                $uniqueSessions = $locationClicks->pluck('session_id')->unique();
                $leads = $uniqueSessions->intersect($leadSessions)->count();

                return [
                    'location' => $location,
                    'click_count' => $uniqueSessions->count(),
                    'leads' => $leads,
                    'lead_rate' => round($this->safeDiv($leads, $uniqueSessions->count()) * 100, 2),
                ];
            })->sortByDesc('leads')->values()->all();

            return [
                'landing_source' => $landingSource,
                'cta_locations' => $locations,
                'total_clicks' => $sourceClicks->pluck('session_id')->unique()->count(),
            ];
        })->values()->all();
    }

    public function getReaderSegmentation(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $sources = $this->getValidLandingSources($startDate, $endDate, $sourceFilter);
        if ($sources->isEmpty()) {
            return [];
        }

        $allSessions = $this->batchAllSessions($startDate, $endDate, $sourceFilter);
        $scrollDepths = $this->batchMaxScrollDepth($startDate, $endDate, $sourceFilter);
        $dwellTimes = $this->batchTotalDwellTime($startDate, $endDate, $sourceFilter);

        $segmentation = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $sessions = $allSessions[$src] ?? collect();

            if ($sessions->isEmpty()) {
                continue;
            }

            $personas = ['bouncers' => 0, 'skimmers' => 0, 'deep_readers' => 0, 'casuals' => 0];

            foreach ($sessions as $sessionId) {
                $depth = $scrollDepths[$sessionId] ?? 0;
                $dwell = $dwellTimes[$sessionId] ?? 0;

                if ($depth < 25 || $dwell < 15) {
                    $personas['bouncers']++;
                } elseif ($dwell > 120) {
                    $personas['deep_readers']++;
                } elseif ($depth > 75 && $dwell < 60) {
                    $personas['skimmers']++;
                } else {
                    $personas['casuals']++;
                }
            }

            $total = $sessions->count();
            $segmentation[] = [
                'landing_source' => $src,
                'total_sessions' => $total,
                'personas' => [
                    ['name' => 'Bouncers', 'description' => 'Not engaged (<25% scroll or <15s dwell)', 'count' => $personas['bouncers'], 'percentage' => round($this->safeDiv($personas['bouncers'], $total) * 100, 1)],
                    ['name' => 'Skimmers', 'description' => 'High scroll (>75%) but quick read (<60s)', 'count' => $personas['skimmers'], 'percentage' => round($this->safeDiv($personas['skimmers'], $total) * 100, 1)],
                    ['name' => 'Deep Readers', 'description' => 'Extended engagement (>120s)', 'count' => $personas['deep_readers'], 'percentage' => round($this->safeDiv($personas['deep_readers'], $total) * 100, 1)],
                    ['name' => 'Casuals', 'description' => 'Moderate engagement', 'count' => $personas['casuals'], 'percentage' => round($this->safeDiv($personas['casuals'], $total) * 100, 1)],
                ],
            ];
        }

        return $segmentation;
    }

    public function getScrollHeatmap(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $counts = $this->batchEventCounts($startDate, $endDate, $sourceFilter, ['visit']);
        if (empty($counts)) {
            return [];
        }

        $depthsBySource = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
                DB::raw("MAX(CAST(json_extract(event_data, '$.depth') AS DECIMAL(10,2))) as max_depth"),
            ])
            ->where('event_type', 'scroll')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy(DB::raw("json_extract(event_data, '$.landing_source')"), 'session_id')
            ->get()
            ->groupBy(fn ($row) => $this->normalizeLandingSource($row->landing_source));

        $heatmap = [];
        foreach ($counts as $source => $typeCounts) {
            $totalVisits = $typeCounts['visit'] ?? 0;
            if ($totalVisits === 0) {
                continue;
            }

            $sourceDepths = $depthsBySource[$source] ?? collect();
            $depthData = [];

            foreach ([25, 50, 75, 90] as $threshold) {
                $reaching = $sourceDepths->filter(fn ($r) => (float) $r->max_depth >= $threshold)->count();
                $depthData[] = [
                    'depth' => $threshold,
                    'sessions' => $reaching,
                    'percentage' => round($this->safeDiv($reaching, $totalVisits) * 100, 1),
                ];
            }

            $heatmap[] = [
                'landing_source' => $source,
                'total_visits' => $totalVisits,
                'depth_analysis' => $depthData,
            ];
        }

        return $heatmap;
    }

    public function getQualityAnalysis(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $sources = $this->getValidLandingSources($startDate, $endDate, $sourceFilter);
        if ($sources->isEmpty()) {
            return [];
        }

        $allSessions = $this->batchAllSessions($startDate, $endDate, $sourceFilter);
        $leadSessions = $this->batchLeadSessionIds($startDate, $endDate, $sourceFilter);
        $scrollDepths = $this->batchMaxScrollDepth($startDate, $endDate, $sourceFilter);
        $dwellTimes = $this->batchTotalDwellTime($startDate, $endDate, $sourceFilter);

        $analysis = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $sessions = $allSessions[$src] ?? collect();
            $leads = $leadSessions[$src] ?? collect();
            $nonLeads = $sessions->diff($leads);

            $analysis[] = [
                'landing_source' => $src,
                'leads' => $this->calcQualityMetrics($leads, $scrollDepths, $dwellTimes),
                'non_leads' => $this->calcQualityMetrics($nonLeads, $scrollDepths, $dwellTimes),
            ];
        }

        return $analysis;
    }

    public function getSectionHeatmap(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $labels = [
            'hero' => 'Hero',
            'success-story' => 'Success Story',
            'solusi' => 'Solution',
            'problem' => 'Problem',
            'benefits' => 'Benefits',
            'testimoni' => 'Testimonials',
            'pengajar' => 'Instructor',
            'media-features' => 'Media Features',
            'curriculum' => 'Curriculum',
            'harga' => 'Pricing',
            'faq' => 'FAQ',
        ];

        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                DB::raw("json_extract(event_data, '$.section') as section_name"),
                DB::raw('COUNT(DISTINCT session_id) as views'),
                DB::raw('MIN(created_at) as first_seen'),
            ])
            ->where('event_type', 'section_view')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy(DB::raw("json_extract(event_data, '$.landing_source')"), DB::raw("json_extract(event_data, '$.section')"))
            ->get();

        if ($rows->isEmpty()) {
            return [];
        }

        $result = [];
        foreach ($rows->groupBy('landing_source') as $source => $sourceRows) {
            $cleanSource = $this->normalizeLandingSource($source);
            $sectionRows = $sourceRows->sortBy('first_seen')->values();

            $sections = [];
            $firstViews = null;
            $prevViews = null;

            foreach ($sectionRows as $row) {
                $sectionId = trim($row->section_name, '"');
                if ($sectionId === '') {
                    continue;
                }

                $views = (int) $row->views;

                if ($firstViews === null) {
                    $firstViews = $views;
                }

                $pct = $firstViews > 0 ? round(($views / $firstViews) * 100, 1) : 0;
                $dropFromPrev = $prevViews !== null && $prevViews > 0
                    ? round((1 - $views / $prevViews) * 100, 1)
                    : 0;

                $sections[] = [
                    'id' => $sectionId,
                    'name' => $labels[$sectionId] ?? ucfirst(str_replace(['-', '_'], ' ', $sectionId)),
                    'views' => $views,
                    'pct' => $pct,
                    'drop_from_prev' => max(0, $dropFromPrev),
                ];

                $prevViews = $views;
            }

            if (! empty($sections)) {
                $result[] = [
                    'landing_source' => $cleanSource,
                    'sections' => $sections,
                ];
            }
        }

        usort($result, fn ($a, $b) => strcmp($a['landing_source'], $b['landing_source']));

        return $result;
    }

    public function getAvailableSources(Carbon $startDate, Carbon $endDate): array
    {
        return UserAnalytic::whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('referral_source')
            ->where('referral_source', '!=', '')
            ->select('referral_source')
            ->distinct()
            ->pluck('referral_source')
            ->sort()
            ->values()
            ->all();
    }

    // ── Batch query helpers ───────────────────────────────────────────────────

    private function batchEventCounts(Carbon $startDate, Carbon $endDate, ?string $sourceFilter, array $eventTypes): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'event_type',
                DB::raw('COUNT(DISTINCT session_id) as cnt'),
            ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereIn('event_type', $eventTypes)
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy(DB::raw("json_extract(event_data, '$.landing_source')"), 'event_type')
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][$row->event_type] = $row->cnt;
        }

        return $result;
    }

    private function batchBouncedCounts(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics as v')
            ->select([
                DB::raw("json_extract(v.event_data, '$.landing_source') as landing_source"),
                DB::raw('COUNT(DISTINCT v.session_id) as bounced'),
            ])
            ->where('v.event_type', 'visit')
            ->whereBetween('v.created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(v.event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(v.event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('v.referral_source', $sourceFilter))
            ->where(function ($q) use ($startDate, $endDate) {
                $q->whereNotExists(function ($sub) use ($startDate, $endDate) {
                    $sub->from('user_analytics as e')
                        ->whereColumn('e.session_id', 'v.session_id')
                        ->where('e.event_type', 'engagement')
                        ->whereRaw("json_extract(e.event_data, '$.type') = 'dwell_ping'")
                        ->whereBetween('e.created_at', [$startDate, $endDate]);
                })
                    ->orWhereNotExists(function ($sub) use ($startDate, $endDate) {
                        $sub->from('user_analytics as s')
                            ->whereColumn('s.session_id', 'v.session_id')
                            ->where('s.event_type', 'scroll')
                            ->whereRaw("CAST(json_extract(s.event_data, '$.depth') AS DECIMAL(10,2)) >= 25")
                            ->whereBetween('s.created_at', [$startDate, $endDate]);
                    });
            })
            ->groupBy(DB::raw("json_extract(v.event_data, '$.landing_source')"))
            ->get();

        return $rows->mapWithKeys(fn ($row) => [
            $this->normalizeLandingSource($row->landing_source) => $row->bounced,
        ])->all();
    }

    private function batchRevenue(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                DB::raw("SUM(CAST(json_extract(event_data, '$.amount') AS DECIMAL(20,4))) as revenue"),
            ])
            ->where('event_type', 'payment')
            ->whereRaw("json_extract(event_data, '$.status') = 'success'")
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy(DB::raw("json_extract(event_data, '$.landing_source')"))
            ->get();

        return $rows->mapWithKeys(fn ($row) => [
            $this->normalizeLandingSource($row->landing_source) => $row->revenue,
        ])->all();
    }

    private function batchAllSessions(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
            ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->distinct()
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][] = $row->session_id;
        }

        return array_map(fn ($ids) => collect(array_unique($ids)), $result);
    }

    private function batchPaymentSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
            ])
            ->where('event_type', 'payment')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->distinct()
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][] = $row->session_id;
        }

        return array_map(fn ($ids) => collect(array_unique($ids)), $result);
    }

    private function batchLeadSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
            ])
            ->where('event_type', 'conversion')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->distinct()
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][] = $row->session_id;
        }

        return array_map(fn ($ids) => collect(array_unique($ids)), $result);
    }

    private function batchVisitSessionsWithUserAgent(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
                'user_agent',
            ])
            ->where('event_type', 'visit')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][] = $row;
        }

        return array_map(fn ($rows) => collect($rows), $result);
    }

    private function batchMaxScrollDepth(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                'session_id',
                DB::raw("MAX(CAST(json_extract(event_data, '$.depth') AS DECIMAL(10,2))) as max_depth"),
            ])
            ->where('event_type', 'scroll')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy('session_id')
            ->get();

        return $rows->pluck('max_depth', 'session_id')->all();
    }

    private function batchTotalDwellTime(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                'session_id',
                DB::raw("SUM(CAST(json_extract(event_data, '$.duration') AS SIGNED)) as total_ms"),
            ])
            ->where('event_type', 'engagement')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy('session_id')
            ->get();

        return $rows->mapWithKeys(fn ($r) => [$r->session_id => (float) $r->total_ms / 1000])->all();
    }

    private function getValidLandingSources(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): Collection
    {
        return DB::table('user_analytics')
            ->select(DB::raw("json_extract(event_data, '$.landing_source') as landing_source"))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupBy(DB::raw("json_extract(event_data, '$.landing_source')"))
            ->get();
    }

    /**
     * @param  array<string, float>  $scrollDepths
     * @param  array<string, float>  $dwellTimes
     * @return array{count: int, avg_scroll_depth: float, avg_dwell_time: float}
     */
    private function calcQualityMetrics(Collection $sessionIds, array $scrollDepths, array $dwellTimes): array
    {
        if ($sessionIds->isEmpty()) {
            return ['count' => 0, 'avg_scroll_depth' => 0, 'avg_dwell_time' => 0];
        }

        $depths = $sessionIds->map(fn ($id) => (float) ($scrollDepths[$id] ?? 0));
        $dwells = $sessionIds->map(fn ($id) => (float) ($dwellTimes[$id] ?? 0));

        return [
            'count' => $sessionIds->count(),
            'avg_scroll_depth' => round($depths->avg() ?? 0, 1),
            'avg_dwell_time' => round($dwells->avg() ?? 0, 1),
        ];
    }

    private function isMobileDevice(?string $userAgent): bool
    {
        if (! $userAgent) {
            return false;
        }
        foreach (['Mobile', 'Android', 'iPhone', 'iPad', 'iPod', 'webOS', 'BlackBerry', 'Opera Mini', 'IEMobile'] as $indicator) {
            if (stripos($userAgent, $indicator) !== false) {
                return true;
            }
        }

        return false;
    }

    /**
     * Normalize a landing_source value to a consistent clean pathname.
     * SQLite json_extract() may wrap string values in double-quotes.
     * All methods must use the same format so page-filter comparisons work.
     */
    private function normalizeLandingSource(string $raw): string
    {
        $clean = trim($raw, '"');

        if (filter_var($clean, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($clean);
            $clean = $parsed['path'] ?? $clean;
        }

        if ($clean !== '' && $clean[0] !== '/') {
            $clean = '/'.$clean;
        }

        return $clean;
    }

    private function safeDiv(float $numerator, float $denominator): float
    {
        return $denominator > 0 ? $numerator / $denominator : 0;
    }

    private function safePct(float $numerator, float $denominator): float
    {
        return $this->safeDiv($numerator, $denominator) * 100;
    }
}