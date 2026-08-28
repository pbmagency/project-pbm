<?php

namespace App\Services;

use FacebookAds\Api;
use FacebookAds\Object\ServerSide\ActionSource;
use FacebookAds\Object\ServerSide\Content;
use FacebookAds\Object\ServerSide\CustomData;
use FacebookAds\Object\ServerSide\Event;
use FacebookAds\Object\ServerSide\EventRequest;
use FacebookAds\Object\ServerSide\UserData;
use Illuminate\Http\Request;
use Log;

class MetaConversionService
{
    private string $pixelId;

    private string $accessToken;

    private bool $sdkAvailable;

    public function __construct()
    {
        $this->pixelId = config('services.meta.pixel_id', '');
        $this->accessToken = config('services.meta.access_token', '');
        $this->sdkAvailable = class_exists('\FacebookAds\Api');

        if ($this->isConfigured() && $this->sdkAvailable) {
            Api::init(null, null, $this->accessToken, false);
        }
    }

    public function isConfigured(): bool
    {
        return $this->pixelId !== '' && $this->accessToken !== '';
    }

    public function sendPageView(Request $request, string $eventId): void
    {
        if (! $this->isConfigured() || ! $this->sdkAvailable) {
            return;
        }

        $userData = $this->buildUserData($request);

        $event = (new Event)
            ->setEventName('PageView')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData);

        $this->sendEvents([$event]);
    }

    public function sendAddToCart(Request $request, string $eventId, array $eventData = []): void
    {
        if (! $this->isConfigured() || ! $this->sdkAvailable) {
            return;
        }

        $userData = $this->buildUserData($request);

        $price = (int) ($eventData['value'] ?? config('services.meta.course_price', 129000));
        $productId = $eventData['content_ids'][0] ?? 'silent-conversion-leak-webinar';
        $contentName = $eventData['content_name'] ?? 'The Silent Conversion Leak Webinar';

        $content = (new Content)
            ->setProductId($productId)
            ->setQuantity(1);

        $customData = (new CustomData)
            ->setContentName($contentName)
            ->setContentType('product')
            ->setValue($price)
            ->setCurrency('IDR')
            ->setContents([$content]);

        $event = (new Event)
            ->setEventName('AddToCart')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

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

    private function sendEvents(array $events): void
    {
        try {
            $eventRequest = (new EventRequest($this->pixelId))
                ->setEvents($events);

            $response = $eventRequest->execute();

            // Log::debug('Meta CAPI response', [
            //     'events_received' => $response->getEventsReceived(),
            //     'messages'        => $response->getMessages(),
            // ]);
        } catch (\Throwable $e) {
            Log::warning('Meta CAPI request failed', ['error' => $e->getMessage()]);
        }
    }
}
