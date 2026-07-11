<?php

namespace App\Http\Controllers;

use App\Mail\OrderConfirmationMail;
use App\Models\Order;
use App\Models\UserAnalytic;
use App\Services\DuitkuService;
use App\Services\MetaConversionService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Mail;

class PaymentCallbackController extends Controller
{
    public function handle(
        Request $request,
        DuitkuService $duitku,
        MetaConversionService $meta,
    ): JsonResponse {
        try {
            $result = $duitku->verifyCallback($request);

            $order = Order::where('order_number', $result['order_number'])->first();

            if (! $order) {
                Log::warning('Duitku callback: order not found', $result);

                return response()->json(['message' => 'Order not found'], 200);
            }

            // Prevent duplicate callback processing
            if ($order->status === 'paid') {
                return response()->json(['message' => 'Already processed'], 200);
            }

            if ($result['status'] === 'paid') {
                DB::transaction(function () use ($order, $result) {
                    $order->update([
                        'status' => 'paid',
                        'duitku_reference' => $result['reference'],
                        'payment_method' => $result['payment_method'],
                    ]);
                });

                Mail::to($order->email)->queue(new OrderConfirmationMail($order));

                $this->fireAnalytics($request, $order, $meta);
            } elseif ($result['status'] === 'failed') {
                $order->update(['status' => 'failed']);
            }

            return response()->json(['message' => 'OK'], 200);
        } catch (\Throwable $e) {
            Log::error('Duitku callback error: ' . $e->getMessage(), $request->all());

            return response()->json(['message' => 'Error'], 500);
        }
    }

    private function fireAnalytics(Request $request, Order $order, MetaConversionService $meta): void
    {
        $eventId = 'purchase-' . $order->order_number;

        // Server-side Meta CAPI Purchase event
        $meta->sendPurchase($request, $eventId, $order->amount, $order->email);

        // Internal analytics
        UserAnalytic::create([
            'session_id' => 'server-callback-' . $order->order_number,
            'event_type' => 'payment',
            'event_data' => [
                'status' => 'success',
                'order_number' => $order->order_number,
                'amount' => $order->amount,
                'currency' => 'IDR',
                'event_id' => $eventId,
                'timestamp' => now()->toISOString(),
            ],
            'created_at' => now(),
        ]);
    }
}
