<?php

test('the landing page loads successfully', function () {
    $this->get('/')
        ->assertOk()
        ->assertSee('project');
});

test('the meta-ads-2 landing page loads successfully', function () {
    $this->get('/meta-ads-2')
        ->assertOk()
        ->assertSee('project');
});

test('a visitor can submit a qualified audit request', function () {
    $response = $this->postJson('/analytics/track', [
        'event_type' => 'conversion',
        'event_data' => [
            'type' => 'audit_request',
            'landing_source' => '/meta-ads-2',
            'name' => 'John Doe',
            'phone' => '081234567890',
            'email' => 'john@example.com',
            'website_link' => 'https://instagram.com/mycourse',
            'program_type' => 'kelas online',
            'total_buyers' => '51–200',
            'monthly_revenue' => 'Rp30–100jt',
            'business_role' => 'Owner',
            'is_qualified' => true,
        ],
    ]);

    $response->assertOk()->assertJson(['success' => true]);

    $this->assertDatabaseHas('user_analytics', [
        'event_type' => 'conversion',
        'event_data->type' => 'audit_request',
        'event_data->is_qualified' => true,
        'event_data->program_type' => 'kelas online',
    ]);
});

test('the checkout placeholder page loads successfully', function () {
    $this->get('/checkout')->assertOk();
});
