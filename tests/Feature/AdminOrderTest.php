<?php

use App\Models\Order;
use App\Models\User;

function makeAdmin(): User
{
    return User::factory()->create(['role' => 'admin', 'email_verified_at' => now()]);
}

beforeEach(fn () => $this->withoutVite());

it('shows admin orders index', function () {
    $admin = makeAdmin();
    Order::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get('/admin/orders');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/orders/index')->has('orders.data', 3));
});

it('can search orders by name', function () {
    $admin = makeAdmin();
    Order::factory()->create(['name' => 'Budi Santoso']);
    Order::factory()->create(['name' => 'Siti Rahayu']);

    $response = $this->actingAs($admin)->get('/admin/orders?search=Budi');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/orders/index')->has('orders.data', 1));
});

it('can filter orders by status', function () {
    $admin = makeAdmin();
    Order::factory()->paid()->count(2)->create();
    Order::factory()->count(3)->create();

    $response = $this->actingAs($admin)->get('/admin/orders?status=paid');

    $response->assertStatus(200);
    $response->assertInertia(fn ($page) => $page->component('admin/orders/index')->has('orders.data', 2));
});

it('can delete an order', function () {
    $admin = makeAdmin();
    $order = Order::factory()->create();

    $response = $this->actingAs($admin)->delete("/admin/orders/{$order->id}");

    $response->assertRedirect();
    $this->assertDatabaseMissing('orders', ['id' => $order->id]);
});

it('blocks non-admin from orders page', function () {
    $user = User::factory()->create(['email_verified_at' => now()]);

    $response = $this->actingAs($user)->get('/admin/orders');

    $response->assertStatus(403);
});
