<?php

namespace App\Services;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class MetaConversionService
{
    private string $pixelId;

    private string $accessToken;

    private ?string $testEventCode;

    /** Meta CAPI Graph API version */
    private const API_VERSION = 'v22.0';

    public function __construct()
    {
        $this->pixelId = config('services.meta.pixel_id', '');
        $this->accessToken = config('services.meta.access_token', '');
        $this->testEventCode = config('services.meta.test_event_code') ?: null;
    }

    /**
     * CAPI only actually sends once both the pixel ID and access token are set.
     */
    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->accessToken !== '';
    }

    /**
     * Send a PageView event, sharing $eventId with the browser-side fbq('track', 'PageView')
     * call so Meta Events Manager deduplicates them into a single "Browser & Server" event.
     */
    public function sendPageView(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $this->sendEvents([
            $this->buildEvent(
                eventName: 'PageView',
                eventId: $eventId,
                sourceUrl: $request->header('Referer', $request->url()),
                userData: $this->buildUserData($request),
            ),
        ]);
    }

    /**
     * Send an AddToCart event for the pricing CTA click, sharing $eventId with the
     * browser-side fbq('track', 'AddToCart') call for the same deduplication.
     */
    public function sendAddToCart(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $this->sendEvents([
            $this->buildEvent(
                eventName: 'AddToCart',
                eventId: $eventId,
                sourceUrl: $request->header('Referer', $request->url()),
                userData: $this->buildUserData($request),
                customData: $this->buildProductCustomData((float) config('services.meta.course_price', 129000)),
            ),
        ]);
    }

    /**
     * Send an InitiateCheckout event when the user submits the checkout form,
     * sharing $eventId with the browser-side fbq('track', 'InitiateCheckout') call.
     */
    public function sendInitiateCheckout(
        Request $request,
        string $eventId,
        ?string $email = null,
        ?string $phone = null,
        ?string $firstName = null,
        ?string $lastName = null,
    ): void {
        if (! $this->isConfigured()) {
            return;
        }

        $this->sendEvents([
            $this->buildEvent(
                eventName: 'InitiateCheckout',
                eventId: $eventId,
                sourceUrl: $request->header('Referer', $request->url()),
                userData: $this->buildUserData($request, $email, $phone, $firstName, $lastName),
                customData: $this->buildProductCustomData((float) config('services.meta.course_price', 129000)),
            ),
        ]);
    }

    /**
     * Send a Purchase event after a confirmed payment callback.
     * Fires server-side only — browser pixel fires on the success page.
     *
     * @param  string  $email    Plain-text email (will be SHA-256 hashed here)
     * @param  string|null  $phone  Plain-text phone number in any local format (will be normalised & hashed)
     * @param  string|null  $name   Full name — will be split into first/last and hashed
     */
    public function sendPurchase(
        Request $request,
        string $eventId,
        int $amount,
        string $email,
        ?string $phone = null,
        ?string $name = null,
    ): void {
        if (! $this->isConfigured()) {
            return;
        }

        [$firstName, $lastName] = $this->splitName($name);

        $this->sendEvents([
            $this->buildEvent(
                eventName: 'Purchase',
                eventId: $eventId,
                sourceUrl: config('app.url'),
                userData: $this->buildUserData($request, $email, $phone, $firstName, $lastName),
                customData: $this->buildProductCustomData((float) $amount),
            ),
        ]);
    }

    // -------------------------------------------------------------------------
    // Private helpers
    // -------------------------------------------------------------------------

    /**
     * Build a single event array in Meta CAPI payload format.
     *
     * @param  array<string, mixed>  $userData
     * @param  array<string, mixed>|null  $customData
     * @return array<string, mixed>
     */
    private function buildEvent(
        string $eventName,
        string $eventId,
        string $sourceUrl,
        array $userData,
        ?array $customData = null,
    ): array {
        $event = [
            'event_name' => $eventName,
            'event_time' => time(),
            'event_id' => $eventId,
            'event_source_url' => $sourceUrl,
            'action_source' => 'website',
            'user_data' => $userData,
        ];

        if ($customData !== null) {
            $event['custom_data'] = $customData;
        }

        return $event;
    }

    /**
     * Build the user_data array from the HTTP request.
     * All PII fields are SHA-256 hashed before sending.
     *
     * @param  string|null  $email       Plain-text email address
     * @param  string|null  $phone       Plain-text phone (any local Indonesian format)
     * @param  string|null  $firstName   Plain-text first name
     * @param  string|null  $lastName    Plain-text last name
     * @return array<string, mixed>
     */
    private function buildUserData(
        Request $request,
        ?string $email = null,
        ?string $phone = null,
        ?string $firstName = null,
        ?string $lastName = null,
    ): array {
        $userData = [
            'client_ip_address' => $request->ip(),
            'client_user_agent' => $request->userAgent(),
            'country' => hash('sha256', 'id'), // Indonesia ISO code — boosts EMQ
        ];

        // ----- Browser-signal cookies (from browser-originating requests) -----
        $fbp = $request->input('event_data._fbp') ?? $request->cookie('_fbp');
        if ($fbp) {
            $userData['fbp'] = $fbp;
        }

        $fbc = $request->input('event_data._fbc') ?? $request->cookie('_fbc');
        if ($fbc) {
            $userData['fbc'] = $fbc;
        }

        // ----- Deterministic PII (hashed before sending) -----
        if ($email) {
            $hashedEmail = hash('sha256', strtolower(trim($email)));
            $userData['em'] = $hashedEmail;

            // Stable cross-event identifier — allows Meta to stitch PageView →
            // AddToCart → Purchase for the same person into a single journey.
            $userData['external_id'] = $hashedEmail;
        }

        if ($phone) {
            $normalised = $this->normalizePhone($phone);
            if ($normalised) {
                $userData['ph'] = hash('sha256', $normalised);
            }
        }

        if ($firstName) {
            $userData['fn'] = hash('sha256', strtolower(trim($firstName)));
        }

        if ($lastName) {
            $userData['ln'] = hash('sha256', strtolower(trim($lastName)));
        }

        return $userData;
    }

    /**
     * Build the custom_data payload for product events.
     *
     * @return array<string, mixed>
     */
    private function buildProductCustomData(float $value): array
    {
        return [
            'content_name' => 'The Silent Conversion Leak',
            'content_type' => 'product',
            'content_ids' => ['webinar-scl'],
            'num_items' => 1,
            'value' => $value,
            'currency' => 'IDR',
        ];
    }

    /**
     * Send events to Meta CAPI via Guzzle HTTP (bypasses the broken SDK).
     *
     * @param  array<array<string, mixed>>  $events
     */
    private function sendEvents(array $events): void
    {
        try {
            $payload = ['data' => $events];

            // Attach test event code when set — makes events appear in
            // Meta Events Manager → Test Events tab instead of production.
            if ($this->testEventCode) {
                $payload['test_event_code'] = $this->testEventCode;
            }

            $url = sprintf(
                'https://graph.facebook.com/%s/%s/events',
                self::API_VERSION,
                $this->pixelId,
            );

            $response = Http::withToken($this->accessToken)
                ->post($url, $payload);

            if ($response->successful()) {
                Log::debug('Meta CAPI response', [
                    'body' => $response->json(),
                    'test_event_code' => $this->testEventCode,
                ]);
            } else {
                Log::warning('Meta CAPI non-2xx response', [
                    'status' => $response->status(),
                    'body' => $response->json(),
                ]);
            }
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }

    /**
     * Normalise a phone number to E.164 format (digits only, no '+').
     * Handles common Indonesian formats:
     *   08xxxxxxxxxx  → 628xxxxxxxxxx
     *   628xxxxxxxxxx  → 628xxxxxxxxxx  (already correct)
     *   +628xxxxxxxxxx → 628xxxxxxxxxx
     *
     * Returns null if the number looks too short / malformed.
     */
    private function normalizePhone(string $phone): ?string
    {
        // Strip everything except digits
        $digits = preg_replace('/\D/', '', $phone);

        if (! $digits) {
            return null;
        }

        // Already has country code 62 (Indonesia)
        if (str_starts_with($digits, '62')) {
            return $digits;
        }

        // Leading 0 → replace with 62
        if (str_starts_with($digits, '0')) {
            return '62' . substr($digits, 1);
        }

        // Bare number (e.g. 8xxxxxxxxx) → prepend 62
        return '62' . $digits;
    }

    /**
     * Split a full name into [firstName, lastName].
     * If there is only one word, it becomes firstName and lastName is null.
     *
     * @return array{0: string|null, 1: string|null}
     */
    private function splitName(?string $name): array
    {
        if (! $name) {
            return [null, null];
        }

        $parts = preg_split('/\s+/', trim($name), 2);

        return [
            $parts[0] ?? null,
            $parts[1] ?? null,
        ];
    }
}
