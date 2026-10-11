<?php

namespace App\Services;

use App\Models\UserAnalytic;
use Carbon\Carbon;
use Illuminate\Support\Facades\DB;

class OpsAnalyticsFeedDetails
{
    public function build($chartGroups, $referrals, Carbon $startDate, Carbon $endDate): array
    {
        $days = [];
        for ($day = $startDate->copy(); $day->lte($endDate); $day->addDay()) {
            $key = $day->toDateString();
            $days[$key] = [
                'date' => $day->format('d M'),
                'raw_date' => $key,
                'visits' => 0,
                'engaged' => 0,
                'intent' => 0,
                'leads' => 0,
            ];
        }

        foreach ($chartGroups as $eventType => $rows) {
            $field = match ($eventType) {
                'visit' => 'visits',
                'engagement' => 'engaged',
                'cta_click' => 'intent',
                'total_lead', 'conversion', 'payment' => 'leads',
                default => null,
            };
            if ($field === null || ($field === 'leads' && $eventType !== 'total_lead' && isset($chartGroups['total_lead']))) {
                continue;
            }
            foreach ($rows as $row) {
                $date = $row->date;
                if (isset($days[$date])) {
                    $days[$date][$field] += (int) $row->total;
                }
            }
        }

        $utmCampaigns = UserAnalytic::query()
            ->select('utm_campaign', DB::raw('COUNT(DISTINCT session_id) as count'))
            ->whereBetween('created_at', [$startDate, $endDate])
            ->whereNotNull('utm_campaign')
            ->where('utm_campaign', '!=', '')
            ->groupBy('utm_campaign')
            ->orderByDesc('count')
            ->limit(8)
            ->get();

        $recentEvents = UserAnalytic::query()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->latest('created_at')
            ->limit(20)
            ->get(['id', 'session_id', 'event_type', 'referral_source', 'utm_source', 'utm_campaign', 'event_data', 'created_at'])
            ->map(fn ($event) => [
                'id' => $event->id,
                'session_id' => $event->session_id,
                'event_type' => $event->event_type,
                'referral_source' => $event->referral_source,
                'utm_source' => $event->utm_source,
                'utm_campaign' => $event->utm_campaign,
                'event_data' => [
                    'landing_source' => data_get($event->event_data, 'landing_source'),
                    'page' => data_get($event->event_data, 'page'),
                ],
                'occurred_at' => $event->created_at?->toIso8601String(),
            ])
            ->values();

        return [
            'chart_data' => array_values($days),
            'referral_data' => $referrals,
            'utm_campaign_data' => $utmCampaigns,
            'recent_events' => $recentEvents,
        ];
    }
}
