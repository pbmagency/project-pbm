<?php

namespace App\Services;

use Carbon\Carbon;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\DB;

class AnalyticsMetricsService
{
    public const DWELL_THRESHOLD_MS = 15000;

    public const SCROLL_THRESHOLD = 25;

    public const FUNNEL_ACTION_EVENTS = [
        'cta_click',
        'initiate_checkout',
        'payment',
    ];

    public const LEAD_CONVERSION_TYPES = [
        'wa_inquiry',
        'wa_registration',
    ];

    public const LEGACY_CHECKOUT_CONVERSION_TYPES = [
        'checkout_redirect',
    ];

    public function capabilities(): array
    {
        return config('analytics.capabilities');
    }

    public function dashboardStats(Carbon $startDate, Carbon $endDate): array
    {
        $totalVisits = $this->eventQuery('visit', $startDate, $endDate)->count();
        $uniqueVisitors = $this->eventSessions('visit', $startDate, $endDate);
        $bounces = $this->bouncedSessions($startDate, $endDate);
        $engaged = max(0, $uniqueVisitors - $bounces);
        $intent = $this->eventSessions('cta_click', $startDate, $endDate);
        $directCheckouts = $this->checkoutSessions($startDate, $endDate);
        $whatsAppLeads = $this->whatsAppLeadSessions($startDate, $endDate);
        $totalLeads = $directCheckouts + $whatsAppLeads;

        return [
            'total_visits' => $totalVisits,
            'unique_visitors' => $uniqueVisitors,
            'engaged' => $engaged,
            'engagement_rate' => round($this->safePct($engaged, $uniqueVisitors), 2),
            'intent' => $intent,
            'intent_rate' => round($this->safePct($intent, $uniqueVisitors), 2),
            'direct_checkouts' => $directCheckouts,
            'direct_checkout_rate' => round($this->safePct($directCheckouts, $uniqueVisitors), 2),
            'whatsapp_leads' => $whatsAppLeads,
            'whatsapp_lead_rate' => round($this->safePct($whatsAppLeads, $uniqueVisitors), 2),
            'total_leads' => $totalLeads,
            'total_lead_rate' => round($this->safePct($totalLeads, $uniqueVisitors), 2),
            'total_leads_from_intent_rate' => round($this->safePct($totalLeads, $intent), 2),
        ];
    }

    public function dashboardFunnel(Carbon $startDate, Carbon $endDate): array
    {
        $stats = $this->dashboardStats($startDate, $endDate);
        $visits = $stats['unique_visitors'];
        $steps = [
            ['stage' => 'Visits', 'count' => $visits, 'branch' => 'main', 'from_stage' => null],
            ['stage' => 'Engaged', 'count' => $stats['engaged'], 'branch' => 'main', 'from_stage' => 'Visits'],
            ['stage' => 'Intent', 'count' => $stats['intent'], 'branch' => 'main', 'from_stage' => 'Engaged'],
            ['stage' => 'Direct Checkout', 'count' => $stats['direct_checkouts'], 'branch' => 'checkout', 'from_stage' => 'Intent'],
            ['stage' => 'WhatsApp Leads', 'count' => $stats['whatsapp_leads'], 'branch' => 'lead', 'from_stage' => 'Intent'],
            ['stage' => 'Total Leads', 'count' => $stats['total_leads'], 'branch' => 'total', 'from_stage' => 'Intent'],
        ];
        $counts = collect($steps)->pluck('count', 'stage');

        return collect($steps)->map(function (array $step) use ($counts, $visits) {
            $fromStage = $step['from_stage'];
            $previousCount = $fromStage ? (int) $counts->get($fromStage, 0) : 0;

            return [
                ...$step,
                'percentage' => $fromStage === null ? 100 : round($this->safePct($step['count'], $visits), 1),
                'transition_percentage' => $fromStage === null
                    ? 100
                    : round($this->safePct($step['count'], $previousCount), 1),
            ];
        })->all();
    }

    public function applyEngagedEventConditions(
        Builder $query,
        ?Carbon $startDate = null,
        ?Carbon $endDate = null,
    ): Builder {
        // Engaged = Dwell ≥ 15s OR Scroll > 25% OR Funnel Action (any one is sufficient)
        return $query->where(function (Builder $events) {
            $events->where(function (Builder $dwell) {
                $dwell->where('event_type', 'engagement')
                    ->where('event_data->type', 'dwell_ping')
                    ->where('event_data->duration', '>=', self::DWELL_THRESHOLD_MS);
            })->orWhere(function (Builder $scroll) {
                $scroll->where('event_type', 'scroll')
                    ->where('event_data->depth', '>', self::SCROLL_THRESHOLD);
            })->orWhere(function (Builder $actions) {
                $this->applyFunnelActionEventConditions($actions);
            });
        });
    }

    public function applyFunnelActionEventConditions(Builder $query): Builder
    {
        return $query->where(function (Builder $events) {
            $events->whereIn('event_type', self::FUNNEL_ACTION_EVENTS)
                ->orWhere(function (Builder $conversion) {
                    $conversion->where('event_type', 'conversion')
                        ->whereIn('event_data->type', [
                            ...self::LEAD_CONVERSION_TYPES,
                            ...self::LEGACY_CHECKOUT_CONVERSION_TYPES,
                        ]);
                });
        });
    }

    /**
     * Match both the canonical checkout event and the legacy conversion subtype.
     *
     * Checkout redirects were stored as conversion.checkout_redirect before the
     * dedicated initiate_checkout event was introduced. Keeping both here makes
     * historical and current dashboard data comparable while DISTINCT session
     * counts prevent a dual-written event from being counted twice.
     */
    public function applyCheckoutEventConditions(Builder $query): Builder
    {
        return $query->where(function (Builder $events) {
            $events->where('event_type', 'initiate_checkout')
                ->orWhere(function (Builder $legacy) {
                    $legacy->where('event_type', 'conversion')
                        ->whereIn('event_data->type', self::LEGACY_CHECKOUT_CONVERSION_TYPES);
                });
        });
    }

    public function applyWhatsAppLeadEventConditions(Builder $query): Builder
    {
        return $query->where('event_type', 'conversion')
            ->whereIn('event_data->type', self::LEAD_CONVERSION_TYPES);
    }

    public function applyTotalLeadEventConditions(Builder $query): Builder
    {
        return $query->where(function (Builder $events) {
            $events->where('event_type', 'initiate_checkout')
                ->orWhere(function (Builder $legacyCheckout) {
                    $legacyCheckout->where('event_type', 'conversion')
                        ->whereIn('event_data->type', self::LEGACY_CHECKOUT_CONVERSION_TYPES);
                })
                ->orWhere(function (Builder $whatsAppLead) {
                    $whatsAppLead->where('event_type', 'conversion')
                        ->whereIn('event_data->type', self::LEAD_CONVERSION_TYPES);
                });
        });
    }

    public function bouncedSessions(Carbon $startDate, Carbon $endDate, ?string $referralSource = null): int
    {
        $query = DB::table('user_analytics as visits')
            ->where('visits.event_type', 'visit')
            ->whereBetween('visits.created_at', [$startDate, $endDate])
            ->when($referralSource && $referralSource !== 'all', fn (Builder $query) => $query->where('visits.referral_source', $referralSource));

        $this->applyBounceConditions($query, $startDate, $endDate, 'visits');

        return $query->distinct()->count('visits.session_id');
    }

    public function applyBounceConditions(Builder $query, Carbon $startDate, Carbon $endDate, string $visitAlias): Builder
    {
        // Bounce = NOT (Scroll > 25%) AND NOT (Dwell ≥ 15s) AND NOT (Funnel Action)
        // i.e. none of the three engagement signals were fired
        return $query
            ->whereNotExists(function (Builder $scroll) use ($startDate, $endDate, $visitAlias) {
                $scroll->from('user_analytics as scrolls')
                    ->whereColumn('scrolls.session_id', "{$visitAlias}.session_id")
                    ->where('scrolls.event_type', 'scroll')
                    ->where('scrolls.event_data->depth', '>', self::SCROLL_THRESHOLD)
                    ->whereBetween('scrolls.created_at', [$startDate, $endDate]);
            })
            ->whereNotExists(function (Builder $dwell) use ($startDate, $endDate, $visitAlias) {
                $dwell->from('user_analytics as dwell')
                    ->whereColumn('dwell.session_id', "{$visitAlias}.session_id")
                    ->where('dwell.event_type', 'engagement')
                    ->where('dwell.event_data->type', 'dwell_ping')
                    ->where('dwell.event_data->duration', '>=', self::DWELL_THRESHOLD_MS)
                    ->whereBetween('dwell.created_at', [$startDate, $endDate]);
            })
            ->whereNotExists(function (Builder $action) use ($startDate, $endDate, $visitAlias) {
                $action->from('user_analytics as actions')
                    ->whereColumn('actions.session_id', "{$visitAlias}.session_id")
                    ->whereBetween('actions.created_at', [$startDate, $endDate]);

                $this->applyFunnelActionEventConditions($action);
            });
    }

    private function eventSessions(string $eventType, Carbon $startDate, Carbon $endDate): int
    {
        return $this->eventQuery($eventType, $startDate, $endDate)
            ->distinct()
            ->count('session_id');
    }

    private function whatsAppLeadSessions(Carbon $startDate, Carbon $endDate): int
    {
        $query = DB::table('user_analytics')
            ->whereBetween('created_at', [$startDate, $endDate]);

        $this->applyWhatsAppLeadEventConditions($query);

        return $query->distinct()->count('session_id');
    }

    private function checkoutSessions(Carbon $startDate, Carbon $endDate): int
    {
        $query = DB::table('user_analytics')
            ->whereBetween('created_at', [$startDate, $endDate]);

        $this->applyCheckoutEventConditions($query);

        return $query->distinct()->count('session_id');
    }

    private function eventQuery(string $eventType, Carbon $startDate, Carbon $endDate): Builder
    {
        return DB::table('user_analytics')
            ->where('event_type', $eventType)
            ->whereBetween('created_at', [$startDate, $endDate]);
    }

    private function safePct(float|int $numerator, float|int $denominator): float
    {
        return $denominator > 0 ? ($numerator / $denominator) * 100 : 0;
    }
}
