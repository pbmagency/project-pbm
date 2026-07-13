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
    public function sendInitiateCheckout(Request $request, string $eventId): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $customData = (new CustomData)
            ->setContentName('The Silent Conversion Leak')
            ->setContentType('product')
            ->setValue((float) config('services.meta.course_price', 129000))
            ->setCurrency('IDR');

        $event = (new Event)
            ->setEventName('InitiateCheckout')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($this->buildUserData($request))
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

    /**
     * Send a Purchase event after a confirmed payment callback.
     * Fires server-side only — browser pixel fires on the success page.
     */
    public function sendPurchase(Request $request, string $eventId, int $amount, string $email): void
    {
        if (! $this->isConfigured()) {
            return;
        }

        $userData = $this->buildUserData($request);
        $userData->setEmail(hash('sha256', strtolower(trim($email))));

        $customData = (new CustomData)
            ->setContentName('The Silent Conversion Leak')
            ->setContentType('product')
            ->setValue((float) $amount)
            ->setCurrency('IDR');

        $event = (new Event)
            ->setEventName('Purchase')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl(config('app.url'))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

    /**
     * Build UserData from the HTTP request with browser cookie matching.
     */
    private function buildUserData(Request $request): UserData
    {
        $userData = (new UserData)
            ->setClientIpAddress($request->ip())
            ->setClientUserAgent($request->userAgent());

        $fbp = $request->input('event_data._fbp') ?? $request->cookie('_fbp');
        if ($fbp) {
            $userData->setFbp($fbp);
        }

        $fbc = $request->input('event_data._fbc') ?? $request->cookie('_fbc');
        if ($fbc) {
            $userData->setFbc($fbc);
        }

        return $userData;
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
