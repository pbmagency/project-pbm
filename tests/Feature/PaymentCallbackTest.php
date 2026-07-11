<?php

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\UserAnalytic;
use Illuminate\Support\Facades\Mail;

function duitkuSignature(string $merchantCode, string $amount, string $orderId, string $serverKey): string
{
    return md5($merchantCode . $amount . $orderId . $serverKey);
}

it('verifies callback signature and marks order as paid', function () {
    Mail::fake();

    config(['services.duitku.server_key' => 'test-server-key', 'services.duitku.merchant_code' => 'TEST123']);

    $order = Order::factory()->create(['amount' => 129000]);

    $merchantCode = 'TEST123';
    $amount = '129000';
    $signature = duitkuSignature($merchantCode, $amount, $order->order_number, 'test-server-key');

    $response = $this->post('/payment/callback', [
        'merchantCode' => $merchantCode,
        'amount' => $amount,
        'merchantOrderId' => $order->order_number,
        'signature' => $signature,
        'resultCode' => '00',
        'reference' => 'REF-123',
        'paymentCode' => 'BC',
    ]);

    $response->assertStatus(200);
    $response->assertJson(['message' => 'OK']);

    $this->assertDatabaseHas('orders', [
        'order_number' => $order->order_number,
        'status' => 'paid',
        'duitku_reference' => 'REF-123',
    ]);

    Mail::assertQueued(OrderConfirmationMail::class, fn ($mail) => $mail->order->email === $order->email);
});

it('rejects callback with invalid signature', function () {
    config(['services.duitku.server_key' => 'test-server-key', 'services.duitku.merchant_code' => 'TEST123']);

    $order = Order::factory()->create();

    $response = $this->post('/payment/callback', [
        'merchantCode' => 'TEST123',
        'amount' => '129000',
        'merchantOrderId' => $order->order_number,
        'signature' => 'invalid-signature',
        'resultCode' => '00',
    ]);

    $response->assertStatus(500);

    $this->assertDatabaseHas('orders', [
        'order_number' => $order->order_number,
        'status' => 'pending',
    ]);
});

it('prevents duplicate callback processing', function () {
    Mail::fake();

    config(['services.duitku.server_key' => 'test-server-key', 'services.duitku.merchant_code' => 'TEST123']);

    $order = Order::factory()->paid()->create(['amount' => 129000]);

    $merchantCode = 'TEST123';
    $amount = '129000';
    $signature = duitkuSignature($merchantCode, $amount, $order->order_number, 'test-server-key');

    $response = $this->post('/payment/callback', [
        'merchantCode' => $merchantCode,
        'amount' => $amount,
        'merchantOrderId' => $order->order_number,
        'signature' => $signature,
        'resultCode' => '00',
    ]);

    $response->assertStatus(200);
    $response->assertJson(['message' => 'Already processed']);

    Mail::assertNothingQueued();
});

it('marks order as failed for failed payment', function () {
    config(['services.duitku.server_key' => 'test-server-key', 'services.duitku.merchant_code' => 'TEST123']);

    $order = Order::factory()->create(['amount' => 129000]);

    $merchantCode = 'TEST123';
    $amount = '129000';
    $signature = duitkuSignature($merchantCode, $amount, $order->order_number, 'test-server-key');

    $response = $this->post('/payment/callback', [
        'merchantCode' => $merchantCode,
        'amount' => $amount,
        'merchantOrderId' => $order->order_number,
        'signature' => $signature,
        'resultCode' => '01',
    ]);

    $response->assertStatus(200);

    $this->assertDatabaseHas('orders', [
        'order_number' => $order->order_number,
        'status' => 'failed',
    ]);
});
