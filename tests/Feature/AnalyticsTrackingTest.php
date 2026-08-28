<?php

use App\Models\UserAnalytic;
use App\Services\MetaConversionService;

test('a visitor can post a visit event', function () {
    $this->mock(MetaConversionService::class, function ($mock) {
        $mock->shouldReceive('sendPageView')
            ->once()
            ->withArgs(fn ($request, string $eventId) => $eventId === 'abc123');
    });

    $response = $this->postJson('/analytics/track', [
        'event_type' => 'visit',
        'event_data' => ['landing_source' => '/', 'event_id' => 'abc123'],
        'referral_source' => 'direct',
    ]);

    $response->assertOk()->assertJson(['success' => true]);

    expect(UserAnalytic::where('event_type', 'visit')->count())->toBe(1);
});

test('an add to cart event is stored and forwarded to Meta CAPI', function () {
    $this->mock(MetaConversionService::class, function ($mock) {
        $mock->shouldReceive('sendAddToCart')
            ->once()
            ->withArgs(fn ($request, string $eventId, array $data) => $eventId === 'atc-123' && $data['value'] === 129000
            );
    });

    $this->postJson('/analytics/track', [
        'event_type' => 'add_to_cart',
        'event_data' => [
            'event_id' => 'atc-123',
            'content_ids' => ['silent-conversion-leak-webinar'],
            'content_name' => 'The Silent Conversion Leak Webinar',
            'content_type' => 'product',
            'value' => 129000,
            'currency' => 'IDR',
        ],
    ])->assertOk();

    expect(UserAnalytic::where('event_type', 'add_to_cart')->count())->toBe(1);
});

test('the pricing cta click fires both cta_click and conversion events', function () {
    $this->postJson('/analytics/track', [
        'event_type' => 'cta_click',
        'event_data' => ['location' => 'pricing_cta', 'landing_source' => '/'],
    ])->assertOk();

    $this->postJson('/analytics/track', [
        'event_type' => 'conversion',
        'event_data' => ['location' => 'pricing_cta', 'event_id' => 'evt-1', 'landing_source' => '/'],
    ])->assertOk();

    expect(UserAnalytic::where('event_type', 'cta_click')->count())->toBe(1)
        ->and(UserAnalytic::where('event_type', 'conversion')->count())->toBe(1);
});

test('an unknown event type is rejected', function () {
    $response = $this->postJson('/analytics/track', [
        'event_type' => 'not_a_real_event',
    ]);

    $response->assertStatus(422);
});

test('a section_view event is accepted and populates the generated section_id column', function () {
    $this->postJson('/analytics/track', [
        'event_type' => 'section_view',
        'event_data' => ['section' => 'hero', 'landing_source' => '/'],
    ])->assertOk();

    $row = UserAnalytic::where('event_type', 'section_view')->first();

    expect($row)->not->toBeNull()
        ->and($row->section_id)->toBe('hero')
        ->and($row->landing_source)->toBe('/');
});
