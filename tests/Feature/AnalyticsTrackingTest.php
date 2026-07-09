<?php

use App\Models\UserAnalytic;

test('a visitor can post a visit event', function () {
    $response = $this->postJson('/analytics/track', [
        'event_type' => 'visit',
        'event_data' => ['landing_source' => '/', 'event_id' => 'abc123'],
        'referral_source' => 'direct',
    ]);

    $response->assertOk()->assertJson(['success' => true]);

    expect(UserAnalytic::where('event_type', 'visit')->count())->toBe(1);
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
