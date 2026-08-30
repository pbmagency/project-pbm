<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaConversionService
{
    private const GRAPH_API_VERSION = 'v21.0';
    private const GRAPH_API_BASE    = 'https://graph.facebook.com';

    private string $pixelId;

    private string $accessToken;

    /** Non-null only when META_TEST_EVENT_CODE is set and non-empty in .env. */
    private ?string $testEventCode;

    public function __construct()
    {
        $this->pixelId       = config('services.meta.pixel_id', '');
        $this->accessToken   = config('services.meta.access_token', '');
        $testCode            = config('services.meta.test_event_code');
        $this->testEventCode = ($testCode !== '' && $testCode !== null) ? $testCode : null;
    }

    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->accessToken !== '';
    }

    public function sendPageView(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $this->sendEvents([
            $this->buildEvent('PageView', $eventId, $request),
        ]);
    }

    public function sendAddToCart(Request $request, string $eventId, array $eventData = []): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $price       = (int) ($eventData['value'] ?? config('services.meta.course_price', 129000));
        $productId   = $eventData['content_ids'][0] ?? 'silent-conversion-leak-webinar';
        $contentName = $eventData['content_name'] ?? 'The Silent Conversion Leak Webinar';

        $customData = [
            'value'        => $price,
            'currency'     => 'IDR',
            'content_name' => $contentName,
            'content_type' => 'product',
            'contents'     => [
                ['id' => $productId, 'quantity' => 1],
            ],
        ];

        $this->sendEvents([
            $this->buildEvent('AddToCart', $eventId, $request, $customData),
        ]);
    }

    /**
     * Send a Contact event to Meta CAPI.
     *
     * Triggered when a visitor clicks the floating WhatsApp button or any
     * WhatsApp-based registration link, to signal a contact / lead intent.
     */
    public function sendContact(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $this->sendEvents([
            $this->buildEvent('Contact', $eventId, $request),
        ]);
    }

    // -------------------------------------------------------------------------
    // Internals
    // -------------------------------------------------------------------------

    /**
     * Build a single event payload array for the Meta Conversions API.
     *
     * @param  string       $eventName  e.g. 'PageView', 'AddToCart', 'Contact'
     * @param  string       $eventId    UUID used for browser Pixel deduplication
     * @param  array<string,mixed>|null $customData  Optional custom_data block
     */
    private function buildEvent(
        string $eventName,
        string $eventId,
        Request $request,
        ?array $customData = null,
    ): array {
        $event = [
            'event_name'       => $eventName,
            'event_time'       => time(),
            'event_id'         => $eventId,
            'event_source_url' => $request->header('Referer', $request->url()),
            'action_source'    => 'website',
            'user_data'        => $this->buildUserData($request),
        ];

        if ($customData !== null) {
            $event['custom_data'] = $customData;
        }

        return $event;
    }

    /**
     * Build the user_data block from the incoming request.
     *
     * _fbp / _fbc are read from the request payload first (forwarded by the
     * frontend hook), then fall back to the raw cookie header.
     *
     * @return array<string,string>
     */
    private function buildUserData(Request $request): array
    {
        $userData = [
            'client_ip_address' => $request->ip(),
            'client_user_agent' => $request->userAgent(),
        ];

        $fbp = $request->input('event_data._fbp') ?? $request->cookie('_fbp');
        if ($fbp) {
            $userData['fbp'] = $fbp;
        }

        $fbc = $request->input('event_data._fbc') ?? $request->cookie('_fbc');
        if ($fbc) {
            $userData['fbc'] = $fbc;
        }

        return $userData;
    }

    /**
     * POST events to the Meta Graph API Conversions endpoint.
     *
     * Endpoint: POST /{graph_api_version}/{pixel_id}/events
     * Docs: https://developers.facebook.com/docs/marketing-api/conversions-api/using-the-api
     *
     * test_event_code is included in the payload only when META_TEST_EVENT_CODE
     * is configured in .env — omitting it makes this a production send.
     *
     * @param  array<int,array<string,mixed>>  $events
     */
    private function sendEvents(array $events): void
    {
        try {
            $url = sprintf(
                '%s/%s/%s/events',
                self::GRAPH_API_BASE,
                self::GRAPH_API_VERSION,
                $this->pixelId,
            );

            $payload = [
                'data'         => $events,
                'access_token' => $this->accessToken,
            ];

            // Only include test_event_code when META_TEST_EVENT_CODE is set.
            // Remove the env key (or leave it blank) for production sends.
            if ($this->testEventCode !== null) {
                $payload['test_event_code'] = $this->testEventCode;
            }

            $response = Http::post($url, $payload);

            // Log::debug('Meta CAPI response', [
            //     'status'          => $response->status(),
            //     'body'            => $response->json(),
            //     'test_event_code' => $this->testEventCode,
            // ]);

            if ($response->failed()) {
                Log::warning('Meta CAPI request returned error', [
                    'status' => $response->status(),
                    'body'   => $response->json(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed', ['error' => $e->getMessage()]);
        }
    }
}
