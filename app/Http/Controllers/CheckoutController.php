<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Services\DuitkuService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Inertia\Response;

class CheckoutController extends Controller
{
    public function show(): Response
    {
        $price = (int) config('services.meta.course_price', 129000);
        $originalPrice = 299000;

        return Inertia::render('checkout', [
            'price' => $price,
            'originalPrice' => $originalPrice,
        ]);
    }

    public function store(CheckoutRequest $request, DuitkuService $duitku): JsonResponse|RedirectResponse
    {
        $price = (int) config('services.meta.course_price', 129000);

        $order = DB::transaction(function () use ($request, $price) {
            return Order::create([
                'order_number' => 'PBM-' . strtoupper(Str::random(8)),
                'name' => $request->name,
                'email' => $request->email,
                'phone' => $request->phone,
                'amount' => $price,
                'status' => 'pending',
            ]);
        });

        $paymentUrl = $duitku->createInvoice($order);

        if ($request->header('X-Inertia')) {
            return response()->json(['redirect_url' => $paymentUrl]);
        }

        return redirect()->away($paymentUrl);
    }

    public function returnPage(Request $request): Response
    {
        $orderNumber = $request->query('order');
        $order = Order::where('order_number', $orderNumber)->first();

        if (! $order) {
            return Inertia::render('payment/pending');
        }

        return match ($order->status) {
            'paid' => Inertia::render('payment/success', ['order' => [
                'order_number' => $order->order_number,
                'name' => $order->name,
                'email' => $order->email,
                'amount' => $order->amount,
            ]]),
            'failed' => Inertia::render('payment/failed', ['order_number' => $order->order_number]),
            default => Inertia::render('payment/pending', ['order_number' => $order->order_number]),
        };
    }
}