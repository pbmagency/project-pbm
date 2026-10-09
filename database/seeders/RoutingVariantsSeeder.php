<?php

namespace Database\Seeders;

use App\Models\UserAnalytic;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class RoutingVariantsSeeder extends Seeder
{
    public function run(): void
    {
        $variants = [
            [
                'route' => '/c13-lp',
                'visits' => 97,
                'engaged_pct' => 39,
                'direct_checkout_count' => 3,
                'whatsapp_count' => 6,
            ],
            [
                'route' => '/c12-price',
                'visits' => 89,
                'engaged_pct' => 34,
                'direct_checkout_count' => 1,
                'whatsapp_count' => 3,
            ],
            [
                'route' => '/c2-design-1',
                'visits' => 42,
                'engaged_pct' => 28,
                'direct_checkout_count' => 0,
                'whatsapp_count' => 1,
            ],
        ];

        $now = Carbon::now();

        foreach ($variants as $v) {
            $route = $v['route'];
            $visits = $v['visits'];
            $directLeft = $v['direct_checkout_count'];
            $waLeft = $v['whatsapp_count'];

            for ($i = 0; $i < $visits; $i++) {
                $sessionId = Str::uuid()->toString();
                $date = $now->copy()->subDays(rand(0, 14))->subHours(rand(0, 23))->subMinutes(rand(0, 59));

                // 1. Visit
                UserAnalytic::create([
                    'session_id' => $sessionId,
                    'event_type' => 'visit',
                    'event_data' => [
                        'landing_source' => $route,
                        'page' => $route,
                    ],
                    'referral_source' => (rand(0, 1) === 0 ? 'meta_ads' : 'google'),
                    'utm_source' => 'meta_ads',
                    'utm_campaign' => 'scaling_campaign',
                    'user_agent' => 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X)',
                    'created_at' => $date,
                ]);

                // 2. Engagement
                $isEngaged = ($i < ($visits * ($v['engaged_pct'] / 100)));
                if ($isEngaged) {
                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'engagement',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'duration' => rand(15, 90),
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(10, 30)),
                    ]);

                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'scroll',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'depth' => rand(40, 85),
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(12, 35)),
                    ]);
                }

                // 3. CTA Click & Conversions
                if ($directLeft > 0 && rand(1, 4) === 1) {
                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'cta_click',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'text' => 'Beli Sekarang',
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(40, 60)),
                    ]);

                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'payment',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'type' => 'checkout_redirect',
                            'amount' => 500000,
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(70, 120)),
                    ]);
                    $directLeft--;
                } elseif ($waLeft > 0 && rand(1, 3) === 1) {
                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'cta_click',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'text' => 'Konsultasi via WhatsApp',
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(35, 50)),
                    ]);

                    UserAnalytic::create([
                        'session_id' => $sessionId,
                        'event_type' => 'conversion',
                        'event_data' => [
                            'landing_source' => $route,
                            'page' => $route,
                            'type' => 'wa_inquiry',
                        ],
                        'created_at' => $date->copy()->addSeconds(rand(60, 100)),
                    ]);
                    $waLeft--;
                }
            }
        }
    }
}
