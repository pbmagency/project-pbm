<?php

use App\Models\Order;
use App\Services\DuitkuService;
use App\Services\PostHogService;

beforeEach(fn () => $this->withoutVite());

it('shows the checkout page', function () {
    $response = $this->get('/checkout');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('checkout'));
});

it('validates checkout form fields', function () {
    $response = $this->post('/checkout', []);

    $response->assertSessionHasErrors(['name', 'email', 'phone']);
});

it('validates email format', function () {
    $response = $this->post('/checkout', [
        'name' => 'Test User',
        'email' => 'not-an-email',
        'phone' => '08123456789',
    ]);

    $response->assertSessionHasErrors(['email']);
});

it('creates a pending order and redirects to duitku on valid checkout', function () {
    $this->mock(DuitkuService::class, function ($mock) {
        $mock->shouldReceive('createInvoice')->once()->andReturn('https://sandbox.duitku.com/pay/test123');
    });

    $response = $this->post('/checkout', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '08123456789',
    ]);

    $response->assertRedirect('https://sandbox.duitku.com/pay/test123');

    $this->assertDatabaseHas('orders', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '08123456789',
        'amount' => 129000,
        'status' => 'pending',
    ]);
});

it('fires a lead event under the browser distinct_id and saves it on the order', function () {
    $this->mock(DuitkuService::class, function ($mock) {
        $mock->shouldReceive('createInvoice')->once()->andReturn('https://sandbox.duitku.com/pay/test123');
    });

    $this->partialMock(PostHogService::class, function ($mock) {
        $mock->shouldReceive('captureWithContext')
            ->once()
            ->withArgs(fn (string $distinctId, string $event, array $properties) => $distinctId === 'ph-visitor-123'
                && $event === 'lead'
                && $properties['lead_type'] === 'form_submit');
    });

    $this->post('/checkout', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '08123456789',
        'distinct_id' => 'ph-visitor-123',
    ]);

    $this->assertDatabaseHas('orders', [
        'email' => 'test@example.com',
        'distinct_id' => 'ph-visitor-123',
    ]);
});

it('falls back to an anonymous lead capture when the browser sends no distinct_id', function () {
    $this->mock(DuitkuService::class, function ($mock) {
        $mock->shouldReceive('createInvoice')->once()->andReturn('https://sandbox.duitku.com/pay/test123');
    });

    $this->partialMock(PostHogService::class, function ($mock) {
        $mock->shouldReceive('capture')->once()->with('lead', Mockery::type('array'));
        $mock->shouldNotReceive('captureWithContext');
    });

    $this->post('/checkout', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'phone' => '08123456789',
    ]);
});

it('returns success page for paid order', function () {
    $order = Order::factory()->paid()->create();

    $response = $this->get('/payment/return?order='.$order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/success'));
});

it('returns failed page for failed order', function () {
    $order = Order::factory()->failed()->create();

    $response = $this->get('/payment/return?order='.$order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/failed'));
});

it('returns pending page for pending order', function () {
    $order = Order::factory()->create();

    $response = $this->get('/payment/return?order='.$order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/pending'));
});
