<?php

namespace App\Services;

use App\Models\Order;
use Duitku\Config;
use Duitku\Pop;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class DuitkuService
{
    private Config $config;

    public function __construct()
    {
        $apiKey = config('services.duitku.server_key');
        $merchantCode = config('services.duitku.merchant_code');
        $sandbox = (bool) config('services.duitku.sandbox', true);

        $this->config = new Config($apiKey, $merchantCode, $sandbox, true, false);
    }

    /**
     * Create a Duitku payment invoice and return the payment URL.
     */
    public function createInvoice(Order $order): string
    {
        $params = [
            'paymentAmount' => $order->amount,
            'merchantOrderId' => $order->order_number,
            'productDetails' => 'Webinar The Silent Conversion Leak',
            'email' => $order->email,
            'callbackUrl' => route('payment.callback'),
            'returnUrl' => route('payment.return', ['order' => $order->order_number]),
        ];

        Log::info('Duitku create invoice', ['order_number' => $order->order_number, 'amount' => $order->amount]);

        $response = Pop::createInvoice($params, $this->config);
        $data = json_decode($response);

        if (! $data || empty($data->paymentUrl)) {
            throw new \RuntimeException('Duitku did not return a payment URL.');
        }

        return $data->paymentUrl;
    }

    /**
     * Verify the Duitku callback signature and return parsed result.
     *
     * @return array{status: string, order_number: string, reference: string}
     */
    public function verifyCallback(Request $request): array
    {
        $merchantCode = $request->input('merchantCode');
        $amount = $request->input('amount');
        $merchantOrderId = $request->input('merchantOrderId');
        $signature = $request->input('signature');

        $serverKey = config('services.duitku.server_key');
        $expected = md5($merchantCode . $amount . $merchantOrderId . $serverKey);

        if (! hash_equals($expected, (string) $signature)) {
            Log::error('Duitku signature mismatch', [
                'expected' => $expected,
                'received' => $signature,
            ]);
            throw new \RuntimeException('Invalid Duitku signature.');
        }

        $resultCode = $request->input('resultCode');
        $status = match ($resultCode) {
            '00' => 'paid',
            '01' => 'failed',
            default => 'pending',
        };

        return [
            'status' => $status,
            'order_number' => $merchantOrderId,
            'reference' => $request->input('reference', ''),
            'payment_method' => $request->input('paymentCode', ''),
        ];
    }
}
