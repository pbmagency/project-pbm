<?php

use App\Services\PostHogService;

it('builds client_id and client_type from config for every event', function () {
    config(['posthog.client_id' => 'test-client', 'posthog.client_type' => 'form_with_payment']);

    $service = new PostHogService;

    $method = new ReflectionMethod(PostHogService::class, 'defaultProperties');
    $method->setAccessible(true);

    expect($method->invoke($service))->toBe([
        'client_id' => 'test-client',
        'client_type' => 'form_with_payment',
    ]);
});
