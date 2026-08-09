<?php

use App\Models\UserAnalytic;
use App\Services\AbTestingService;
use Carbon\Carbon;

test('scroll heatmap matches root landing source and returns milestone percentages', function () {
    $eventTime = Carbon::now();

    foreach ([
        ['session_id' => 'deep-reader', 'event_type' => 'visit', 'event_data' => ['landing_source' => '/']],
        ['session_id' => 'deep-reader', 'event_type' => 'scroll', 'event_data' => ['landing_source' => '/', 'depth' => 90]],
        ['session_id' => 'casual-reader', 'event_type' => 'visit', 'event_data' => ['landing_source' => '/']],
        ['session_id' => 'casual-reader', 'event_type' => 'scroll', 'event_data' => ['landing_source' => '/', 'depth' => 50]],
    ] as $event) {
        UserAnalytic::create([
            ...$event,
            'referral_source' => 'direct',
            'created_at' => $eventTime,
        ]);
    }

    $heatmap = app(AbTestingService::class)->getScrollHeatmap(
        $eventTime->copy()->subMinute(),
        $eventTime->copy()->addMinute(),
    );

    expect($heatmap)->toHaveCount(1);

    $rootPage = $heatmap[0];
    $depths = collect($rootPage['depth_analysis'])->keyBy('depth');

    expect($rootPage['landing_source'])->toBe('/')
        ->and($rootPage['total_visits'])->toBe(2)
        ->and($depths[25]['sessions'])->toBe(2)
        ->and($depths[25]['percentage'])->toBe(100.0)
        ->and($depths[50]['sessions'])->toBe(2)
        ->and($depths[50]['percentage'])->toBe(100.0)
        ->and($depths[75]['sessions'])->toBe(1)
        ->and($depths[75]['percentage'])->toBe(50.0)
        ->and($depths[90]['sessions'])->toBe(1)
        ->and($depths[90]['percentage'])->toBe(50.0);
});

test('landing source normalization decodes MariaDB JSON escapes', function () {
    $service = app(AbTestingService::class);
    $normalizeLandingSource = new ReflectionMethod($service, 'normalizeLandingSource');

    expect($normalizeLandingSource->invoke($service, json_encode('/')))->toBe('/')
        ->and(
            $normalizeLandingSource->invoke(
                $service,
                json_encode('https://example.com/offer'),
            ),
        )->toBe('/offer')
        ->and($normalizeLandingSource->invoke($service, '/pricing'))->toBe('/pricing');
});
