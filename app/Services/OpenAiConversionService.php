<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class OpenAiConversionService
{
    private const BASE_URL = 'https://bzr.openai.com/v1/events';

    private string $pixelId;
    private string $apiKey;

    public function __construct()
    {
        $this->pixelId = config('services.openai.pixel_id', env('OPENAI_PIXEL_ID', 'NsMWNPQbe457nNFiQrq6NX'));
        $this->apiKey  = config('services.openai.api_key', env('OPENAI_CAPI_KEY', ''));
    }

    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->apiKey !== '';
    }

    /**
     * Send conversion event to OpenAI Bazaar CAPI endpoint
     */
    public function sendEvent(string $type, string $eventId, ?string $sourceUrl = null, array $data = ['type' => 'contents']): bool
    {
        if (! $this->isConfigured()) {
            return false;
        }

        try {
            $payload = [
                'validate_only' => false,
                'events' => [
                    [
                        'id' => $eventId,
                        'type' => $type,
                        'timestamp_ms' => (int) round(microtime(true) * 1000),
                        'source_url' => $sourceUrl ?: url()->current(),
                        'action_source' => 'web',
                        'data' => $data,
                    ],
                ],
            ];

            $response = Http::withToken($this->apiKey)
                ->timeout(5)
                ->post(self::BASE_URL . '?pid=' . urlencode($this->pixelId), $payload);

            if (! $response->successful()) {
                Log::warning('OpenAI CAPI event delivery failed', [
                    'status' => $response->status(),
                    'body' => $response->body(),
                    'type' => $type,
                    'event_id' => $eventId,
                ]);

                return false;
            }

            return true;
        } catch (\Throwable $e) {
            Log::error('OpenAI CAPI exception: ' . $e->getMessage(), [
                'type' => $type,
                'event_id' => $eventId,
            ]);

            return false;
        }
    }
}
