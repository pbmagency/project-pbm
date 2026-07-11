<?php

use App\Models\Order;
use App\Services\DuitkuService;

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

it('returns success page for paid order', function () {
    $order = Order::factory()->paid()->create();

    $response = $this->get('/payment/return?order=' . $order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/success'));
});

it('returns failed page for failed order', function () {
    $order = Order::factory()->failed()->create();

    $response = $this->get('/payment/return?order=' . $order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/failed'));
});

it('returns pending page for pending order', function () {
    $order = Order::factory()->create();

    $response = $this->get('/payment/return?order=' . $order->order_number);

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('payment/pending'));
});
