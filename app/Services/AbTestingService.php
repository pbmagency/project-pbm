<?php

namespace App\Services;

use App\Models\UserAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class AbTestingService
{
    public function __construct(private readonly AnalyticsMetricsService $metrics) {}

    // ── Public API ────────────────────────────────────────────────────────────

    public function getPerformanceMatrix(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $counts = $this->batchEventCounts(
            $startDate,
            $endDate,
            $sourceFilter,
            ['visit', 'conversion', 'cta_click', 'initiate_checkout']
        );

        if (empty($counts)) {
            return [];
        }

        $bouncedBySource = $this->batchBouncedCounts($startDate, $endDate, $sourceFilter);
        $checkoutCounts = $this->batchCheckoutCounts($startDate, $endDate, $sourceFilter);

        $matrix = [];
        foreach ($counts as $source => $typeCounts) {
            $visits = $typeCounts['visit'] ?? 0;
            $whatsAppLeads = $typeCounts['conversion'] ?? 0;
            $directCheckouts = $checkoutCounts[$source] ?? 0;
            $totalLeads = $directCheckouts + $whatsAppLeads;
            $ctaClicks = $typeCounts['cta_click'] ?? 0;

            $bounced = $bouncedBySource[$source] ?? 0;

            $matrix[] = [
                'landing_source' => $source,
                'visits' => $visits,
                'bounce_rate' => round($this->safePct($bounced, $visits), 2),
                'intent_rate' => round($this->safePct($ctaClicks, $visits), 2),
                'direct_checkout_rate' => round($this->safePct($directCheckouts, $visits), 2),
                'whatsapp_lead_rate' => round($this->safePct($whatsAppLeads, $visits), 2),
                'total_lead_rate' => round($this->safePct($totalLeads, $visits), 2),
                'direct_checkouts' => $directCheckouts,
                'whatsapp_leads' => $whatsAppLeads,
                'total_leads' => $totalLeads,
                'cta_clicks' => $ctaClicks,
            ];
        }

        usort($matrix, fn ($a, $b) => $b['total_lead_rate'] <=> $a['total_lead_rate']);

        return $matrix;
    }

    public function getSplitFunnel(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        $counts = $this->batchEventCounts(
            $startDate,
            $endDate,
            $sourceFilter,
            ['visit', 'cta_click', 'initiate_checkout', 'conversion']
        );

        if (empty($counts)) {
            return [];
        }

        $bouncedBySource = $this->batchBouncedCounts($startDate, $endDate, $sourceFilter);
        $checkoutCounts = $this->batchCheckoutCounts($startDate, $endDate, $sourceFilter);
        $funnel = [];
        foreach ($counts as $source => $typeCounts) {
            $visits = $typeCounts['visit'] ?? 0;
            $engaged = max(0, $visits - ($bouncedBySource[$source] ?? 0));
            $intent = $typeCounts['cta_click'] ?? 0;
            $whatsAppLeads = $typeCounts['conversion'] ?? 0;
            $directCheckouts = $checkoutCounts[$source] ?? 0;
            $totalLeads = $directCheckouts + $whatsAppLeads;

            $funnel[] = [
                'landing_source' => $source,
                'steps' => [
                    ['stage' => 'Visits',           'count' => $visits,      'percentage' => 100],
                    ['stage' => 'Engaged',           'count' => $engaged,     'percentage' => round($this->safePct($engaged, $visits), 1)],
                    ['stage' => 'Intent',            'count' => $intent,      'percentage' => round($this->safePct($intent, $visits), 1)],
                    ['stage' => 'Direct Checkout', 'count' => $directCheckouts, 'percentage' => round($this->safePct($directCheckouts, $visits), 1)],
                    ['stage' => 'WhatsApp Leads',  'count' => $whatsAppLeads,   'percentage' => round($this->safePct($whatsAppLeads, $visits), 1)],
                    ['stage' => 'Total Leads',     'count' => $totalLeads,      'percentage' => round($this->safePct($totalLeads, $visits), 1)],
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
        $checkoutSessions = $this->batchCheckoutSessionIds($startDate, $endDate, $sourceFilter);
        $whatsAppLeadSessions = $this->batchWhatsAppLeadSessionIds($startDate, $endDate, $sourceFilter);

        $performance = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $visits = $visitData[$src] ?? collect();
            $checkoutLeads = $checkoutSessions[$src] ?? collect();
            $whatsAppLeads = $whatsAppLeadSessions[$src] ?? collect();

            $mobile = $visits->filter(fn ($r) => $this->isMobileDevice($r->user_agent));
            $desktop = $visits->reject(fn ($r) => $this->isMobileDevice($r->user_agent));

            $mobileIds = $mobile->pluck('session_id')->unique();
            $desktopIds = $desktop->pluck('session_id')->unique();

            $mobLeads = $checkoutLeads->intersect($mobileIds)->count()
                + $whatsAppLeads->intersect($mobileIds)->count();
            $deskLeads = $checkoutLeads->intersect($desktopIds)->count()
                + $whatsAppLeads->intersect($desktopIds)->count();

            $performance[] = [
                'landing_source' => $src,
                'mobile' => ['visits' => $mobileIds->count(),  'total_leads' => $mobLeads,  'total_lead_rate' => round($this->safeDiv($mobLeads, $mobileIds->count()) * 100, 2)],
                'desktop' => ['visits' => $desktopIds->count(), 'total_leads' => $deskLeads, 'total_lead_rate' => round($this->safeDiv($deskLeads, $desktopIds->count()) * 100, 2)],
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

        $checkoutSessions = $this->batchCheckoutSessionIds($startDate, $endDate, $sourceFilter);
        $whatsAppLeadSessions = $this->batchWhatsAppLeadSessionIds($startDate, $endDate, $sourceFilter);

        return $ctaClicks->groupBy(fn ($row) => $this->normalizeLandingSource($row->landing_source))->map(function ($sourceClicks, $landingSource) use ($checkoutSessions, $whatsAppLeadSessions) {
            $checkoutLeads = $checkoutSessions[$landingSource] ?? collect();
            $whatsAppLeads = $whatsAppLeadSessions[$landingSource] ?? collect();
            $locations = $sourceClicks->groupBy('cta_location')->map(function ($locationClicks, $location) use ($checkoutLeads, $whatsAppLeads) {
                $uniqueSessions = $locationClicks->pluck('session_id')->unique();
                $totalLeads = $uniqueSessions->intersect($checkoutLeads)->count()
                    + $uniqueSessions->intersect($whatsAppLeads)->count();

                return [
                    'location' => $location,
                    'click_count' => $uniqueSessions->count(),
                    'total_leads' => $totalLeads,
                    'total_lead_rate' => round($this->safeDiv($totalLeads, $uniqueSessions->count()) * 100, 2),
                ];
            })->sortByDesc('total_leads')->values()->all();

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
        $actionSessions = $this->batchActionSessionIds($startDate, $endDate, $sourceFilter);

        $segmentation = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $sessions = $allSessions[$src] ?? collect();
            $actions = $actionSessions[$src] ?? collect();

            if ($sessions->isEmpty()) {
                continue;
            }

            $personas = ['bouncers' => 0, 'skimmers' => 0, 'deep_readers' => 0, 'casuals' => 0];

            foreach ($sessions as $sessionId) {
                $depth = $scrollDepths[$sessionId] ?? 0;
                $dwell = $dwellTimes[$sessionId] ?? 0;

                // Engaged = Scroll > 25% OR Dwell ≥ 15s OR Funnel Action (any one is sufficient)
                $engaged = $depth > AnalyticsMetricsService::SCROLL_THRESHOLD
                    || $dwell >= AnalyticsMetricsService::DWELL_THRESHOLD_MS / 1000
                    || $actions->contains($sessionId);

                if (! $engaged) {
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
                    ['name' => 'Bouncers',     'description' => 'No funnel action and scroll <=25% and dwell <15s', 'count' => $personas['bouncers'],     'percentage' => round($this->safeDiv($personas['bouncers'], $total) * 100, 1)],
                    ['name' => 'Skimmers',     'description' => 'High scroll (>75%) but quick read (<60s)', 'count' => $personas['skimmers'],     'percentage' => round($this->safeDiv($personas['skimmers'], $total) * 100, 1)],
                    ['name' => 'Deep Readers', 'description' => 'Extended engagement (>120s)',              'count' => $personas['deep_readers'], 'percentage' => round($this->safeDiv($personas['deep_readers'], $total) * 100, 1)],
                    ['name' => 'Casuals',      'description' => 'Moderate engagement',                     'count' => $personas['casuals'],      'percentage' => round($this->safeDiv($personas['casuals'], $total) * 100, 1)],
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
            ->groupByRaw("json_extract(event_data, '$.landing_source'), session_id")
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
        $totalLeadSessions = $this->batchTotalLeadSessionIds($startDate, $endDate, $sourceFilter);
        $checkoutSessions = $this->batchCheckoutSessionIds($startDate, $endDate, $sourceFilter);
        $whatsAppLeadSessions = $this->batchWhatsAppLeadSessionIds($startDate, $endDate, $sourceFilter);
        $scrollDepths = $this->batchMaxScrollDepth($startDate, $endDate, $sourceFilter);
        $dwellTimes = $this->batchTotalDwellTime($startDate, $endDate, $sourceFilter);

        $analysis = [];
        foreach ($sources as $source) {
            $src = $this->normalizeLandingSource($source->landing_source);
            $sessions = $allSessions[$src] ?? collect();
            $leads = $totalLeadSessions[$src] ?? collect();
            $nonLeads = $sessions->diff($leads);
            $totalLeadCount = ($checkoutSessions[$src] ?? collect())->count()
                + ($whatsAppLeadSessions[$src] ?? collect())->count();

            $analysis[] = [
                'landing_source' => $src,
                'total_leads' => $this->calcQualityMetrics($leads, $scrollDepths, $dwellTimes, $totalLeadCount),
                'others' => $this->calcQualityMetrics($nonLeads, $scrollDepths, $dwellTimes),
            ];
        }

        return $analysis;
    }

    public function getSectionHeatmap(Carbon $startDate, Carbon $endDate, ?string $sourceFilter = null): array
    {
        // Human-readable labels for known sections (fallback to raw ID for unknowns)
        $labels = [
            'hero' => 'Hero',
            'problem' => 'The Problem',
            'agitation' => 'Agitation (Pain Points)',
            'solution' => 'The Solution',
            'impact' => 'The Impact',
            'case-study' => 'Case Study',
            'offer-stack' => 'Offer Stack',
            'pricing' => 'Pricing',
            'faq' => 'FAQ',
            'final-cta' => 'Final CTA',
        ];

        // Query: aggregate views per section AND capture earliest first_seen
        // so we can order sections by when they were first tracked (top → bottom of page)
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                DB::raw("json_extract(event_data, '$.section') as section_name"),
                DB::raw('COUNT(DISTINCT session_id) as views'),
            ])
            ->where('event_type', 'section_view')
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupByRaw("json_extract(event_data, '$.landing_source'), json_extract(event_data, '$.section')")
            ->get();

        if ($rows->isEmpty()) {
            return [];
        }

        // Group by landing source
        $grouped = $rows->groupByRaw("json_extract(event_data, '$.landing_source')");

        $result = [];
        foreach ($grouped as $source => $sourceRows) {
            $cleanSource = $this->normalizeLandingSource($source);

            // Build section data sorted by first_seen ascending
            // (sections at top of page are seen first → naturally ordered top→bottom)
            // Keep the visibility funnel monotonic and consistent with PBM.
            $sectionRows = $sourceRows->sortByDesc('views')->values();

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

        // Sort by landing_source alphabetically
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
            ->when(in_array('conversion', $eventTypes, true), function ($query) {
                $query->where(function ($events) {
                    $events->where('event_type', '!=', 'conversion')
                        ->orWhereIn('event_data->type', AnalyticsMetricsService::LEAD_CONVERSION_TYPES);
                });
            })
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->groupByRaw("json_extract(event_data, '$.landing_source'), event_type")
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
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('v.referral_source', $sourceFilter));

        $this->metrics->applyBounceConditions($rows, $startDate, $endDate, 'v');

        $rows = $rows->groupByRaw("json_extract(event_data, '$.landing_source')")->get();

        return $rows->mapWithKeys(fn ($row) => [
            $this->normalizeLandingSource($row->landing_source) => $row->bounced,
        ])->all();
    }

    private function batchCheckoutCounts(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw('json_extract(event_data, \'$.landing_source\') as landing_source'),
                DB::raw('COUNT(DISTINCT session_id) as cnt'),
            ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw('json_extract(event_data, \'$.landing_source\') IS NOT NULL')
            ->whereRaw('json_extract(event_data, \'$.landing_source\') NOT IN (\'\', \'unknown\')')
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($query) => $query->where('referral_source', $sourceFilter));

        $this->metrics->applyCheckoutEventConditions($rows);

        return $rows
            ->groupByRaw("json_extract(event_data, '$.landing_source')")
            ->get()
            ->mapWithKeys(fn ($row) => [
                $this->normalizeLandingSource($row->landing_source) => (int) $row->cnt,
            ])
            ->all();
    }

    private function batchAllSessions(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
            ])
            ->where('event_type', 'visit')
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

    private function batchTotalLeadSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        return $this->batchLeadSessionIds(
            $startDate,
            $endDate,
            $sourceFilter,
            fn ($query) => $this->metrics->applyTotalLeadEventConditions($query),
        );
    }

    private function batchCheckoutSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        return $this->batchLeadSessionIds(
            $startDate,
            $endDate,
            $sourceFilter,
            fn ($query) => $this->metrics->applyCheckoutEventConditions($query),
        );
    }

    private function batchWhatsAppLeadSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        return $this->batchLeadSessionIds(
            $startDate,
            $endDate,
            $sourceFilter,
            fn ($query) => $this->metrics->applyWhatsAppLeadEventConditions($query),
        );
    }

    private function batchLeadSessionIds(
        Carbon $startDate,
        Carbon $endDate,
        ?string $sourceFilter,
        callable $applyConditions,
    ): array {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw("json_extract(event_data, '$.landing_source') as landing_source"),
                'session_id',
            ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw("json_extract(event_data, '$.landing_source') IS NOT NULL")
            ->whereRaw("json_extract(event_data, '$.landing_source') NOT IN ('', 'unknown')")
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($q) => $q->where('referral_source', $sourceFilter))
            ->distinct();

        $applyConditions($rows);

        $rows = $rows->get();

        $result = [];
        foreach ($rows as $row) {
            $key = $this->normalizeLandingSource($row->landing_source);
            $result[$key][] = $row->session_id;
        }

        return array_map(fn ($ids) => collect(array_unique($ids)), $result);
    }

    private function batchActionSessionIds(Carbon $startDate, Carbon $endDate, ?string $sourceFilter): array
    {
        $rows = DB::table('user_analytics')
            ->select([
                DB::raw('json_extract(event_data, \'$.landing_source\') as landing_source'),
                'session_id',
            ])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereRaw('json_extract(event_data, \'$.landing_source\') IS NOT NULL')
            ->when($sourceFilter && $sourceFilter !== 'all', fn ($query) => $query->where('referral_source', $sourceFilter))
            ->distinct();

        $this->metrics->applyFunnelActionEventConditions($rows);

        $rows = $rows->get();

        $result = [];
        foreach ($rows as $row) {
            $result[$this->normalizeLandingSource($row->landing_source)][] = $row->session_id;
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
            ->groupByRaw("json_extract(event_data, '$.landing_source')")
            ->get();
    }

    private function calcQualityMetrics(
        Collection $sessionIds,
        array $scrollDepths,
        array $dwellTimes,
        ?int $count = null,
    ): array {
        if ($sessionIds->isEmpty()) {
            return ['count' => $count ?? 0, 'avg_scroll_depth' => 0, 'avg_dwell_time' => 0];
        }

        $depths = $sessionIds->map(fn ($id) => (float) ($scrollDepths[$id] ?? 0));
        $dwells = $sessionIds->map(fn ($id) => (float) ($dwellTimes[$id] ?? 0));

        return [
            'count' => $count ?? $sessionIds->count(),
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
        $decoded = json_decode($raw, true);
        $clean = is_string($decoded) ? $decoded : trim($raw, '"');

        // MySQL may return an unquoted JSON-escaped path from grouped expressions.
        $clean = str_replace('\/', '/', $clean);

        // Strip protocol + domain if someone stored a full URL
        if (filter_var($clean, FILTER_VALIDATE_URL)) {
            $parsed = parse_url($clean);
            $clean = $parsed['path'] ?? $clean;
        }

        // Ensure leading slash
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
