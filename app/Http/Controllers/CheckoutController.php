<?php

namespace App\Http\Controllers;

use App\Http\Requests\CheckoutRequest;
use App\Models\Order;
use App\Models\UserAnalytic;
use App\Services\DuitkuService;
use App\Services\MetaConversionService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
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

    public function store(CheckoutRequest $request, DuitkuService $duitku, MetaConversionService $meta): \Symfony\Component\HttpFoundation\Response
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

        // Fallback to the latest visit event in this session if the frontend
        // fails to send tracking data (e.g. adblockers blocking the JS transform).
        $visitEvent = UserAnalytic::where('session_id', $request->session()->getId())
            ->where('event_type', 'visit')
            ->latest('created_at')
            ->first();

        $landingSource = $request->input('landing_source');
        if (empty($landingSource) || $landingSource === 'unknown') {
            $landingSource = $visitEvent?->event_data['landing_source'] ?? 'unknown';
        }

        $referralSource = $request->input('referral_source') ?? $visitEvent?->referral_source;
        $utmSource = $request->input('utm_source') ?? $visitEvent?->utm_source;
        $utmMedium = $request->input('utm_medium') ?? $visitEvent?->utm_medium;
        $utmCampaign = $request->input('utm_campaign') ?? $visitEvent?->utm_campaign;

        // NOTE: this response ends in Inertia::location() below, which the
        // Inertia client intercepts via a raw window.location redirect —
        // it never resolves as a normal Inertia "success" visit. Any
        // client-side onSuccess handler after this POST will NEVER fire.
        // That's why 'conversion' tracking happens here, server-side, where
        // it's actually guaranteed to run — not in pricing.tsx's onSuccess.
        //
        // Wrapped in try/catch: a failure in analytics/CAPI must never be
        // able to block the actual checkout/payment redirect. Losing a
        // tracking event is recoverable; losing a sale is not.
        try {
            $eventId = 'conversion-' . $order->order_number;

            $meta->sendInitiateCheckout($request, $eventId);

            UserAnalytic::create([
                'session_id' => $request->session()->getId(),
                'event_type' => 'conversion',
                'event_data' => [
                    'order_number' => $order->order_number,
                    'name' => $order->name,
                    'email' => $order->email,
                    'landing_source' => $landingSource,
                    'event_id' => $eventId,
                    'timestamp' => now()->toISOString(),
                ],
                'referral_source' => $referralSource,
                'utm_source' => $utmSource,
                'utm_medium' => $utmMedium,
                'utm_campaign' => $utmCampaign,
                'created_at' => now(),
            ]);
        } catch (\Throwable $e) {
            Log::error('Checkout conversion tracking failed (order still proceeds): ' . $e->getMessage(), [
                'order_number' => $order->order_number,
            ]);
        }

        $paymentUrl = $duitku->createInvoice($order);

        return Inertia::location($paymentUrl);
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