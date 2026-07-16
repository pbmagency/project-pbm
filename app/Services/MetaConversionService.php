<?php

namespace App\Services;

use FacebookAds\Api;
use FacebookAds\Object\ServerSide\ActionSource;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class MetaConversionService
{
    private string $pixelId;

    private string $accessToken;

    public function __construct()
    {
        $this->pixelId = config('services.meta.pixel_id', '');
        $this->accessToken = config('services.meta.access_token', '');

        if ($this->isConfigured()) {
            Api::init(null, null, $this->accessToken, false);
        }
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

        $event = (new Event)
            ->setEventName('PageView')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($request));

        $this->sendEvents([$event]);
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

        $customData = (new CustomData)
            ->setContentName('The Silent Conversion Leak')
            ->setContentType('product')
            ->setContentIds(['webinar-scl'])
            ->setNumItems(1)
            ->setValue((float) config('services.meta.course_price', 129000))
            ->setCurrency('IDR');

        $event = (new Event)
            ->setEventName('AddToCart')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($request))
            ->setCustomData($customData);

        $this->sendEvents([$event]);
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

        $customData = (new CustomData)
            ->setContentName('The Silent Conversion Leak')
            ->setContentType('product')
            ->setContentIds(['webinar-scl'])
            ->setNumItems(1)
            ->setValue((float) config('services.meta.course_price', 129000))
            ->setCurrency('IDR');

        $event = (new Event)
            ->setEventName('InitiateCheckout')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($request, $email, $phone, $firstName, $lastName))
            ->setCustomData($customData);

        $this->sendEvents([$event]);
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

        $customData = (new CustomData)
            ->setContentName('The Silent Conversion Leak')
            ->setContentType('product')
            ->setContentIds(['webinar-scl'])
            ->setNumItems(1)
            ->setValue((float) $amount)
            ->setCurrency('IDR');

        $event = (new Event)
            ->setEventName('Purchase')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl(config('app.url'))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($request, $email, $phone, $firstName, $lastName))
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

    /**
     * Build UserData from the HTTP request with browser cookie matching.
     *
     * All PII fields are hashed with SHA-256. The Facebook Business SDK will
     * hash them again if they appear to be plain-text, but we pre-hash here
     * so we never send raw PII over the wire.
     *
     * @param  string|null  $email       Plain-text email address
     * @param  string|null  $phone       Plain-text phone (any local Indonesian format)
     * @param  string|null  $firstName   Plain-text first name
     * @param  string|null  $lastName    Plain-text last name
     */
    private function buildUserData(
        Request $request,
        ?string $email = null,
        ?string $phone = null,
        ?string $firstName = null,
        ?string $lastName = null,
    ): UserData {
        $userData = (new UserData)
            ->setClientIpAddress($request->ip())
            ->setClientUserAgent($request->userAgent())
            ->setCountry(hash('sha256', 'id')); // Indonesia — stable, boosts EMQ

        // ----- Browser-signal cookies (from browser-originating requests) -----
        $fbp = $request->input('event_data._fbp') ?? $request->cookie('_fbp');
        if ($fbp) {
            $userData->setFbp($fbp);
        }

        $fbc = $request->input('event_data._fbc') ?? $request->cookie('_fbc');
        if ($fbc) {
            $userData->setFbc($fbc);
        }

        // ----- Deterministic PII (hashed before sending) -----
        if ($email) {
            $hashedEmail = hash('sha256', strtolower(trim($email)));
            $userData->setEmail($hashedEmail);

            // Stable cross-event identifier — allows Meta to stitch PageView →
            // AddToCart → Purchase for the same person into a single journey.
            $userData->setExternalId(hash('sha256', strtolower(trim($email))));
        }

        if ($phone) {
            $normalised = $this->normalizePhone($phone);
            if ($normalised) {
                $userData->setPhone(hash('sha256', $normalised));
            }
        }

        if ($firstName) {
            $userData->setFirstName(hash('sha256', strtolower(trim($firstName))));
        }

        if ($lastName) {
            $userData->setLastName(hash('sha256', strtolower(trim($lastName))));
        }

        return $userData;
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

    /**
     * @param  array<Event>  $events
     */
    private function sendEvents(array $events): void
    {
        try {
            $response = (new EventRequest($this->pixelId))
                ->setEvents($events)
                ->execute();

            Log::debug('Meta CAPI response', [
                'events_received' => $response->getEventsReceived(),
                'messages' => $response->getMessages(),
            ]);
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed', [
                'error' => $e->getMessage(),
            ]);
        }
    }
}
