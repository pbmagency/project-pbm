<?php

namespace App\Services;

use Illuminate\Http\Request;
use Log;

class MetaConversionService
{
    private string $pixelId;
    private string $accessToken;
    private bool $sdkAvailable;

    public function __construct()
    {
        $this->pixelId      = config('services.meta.pixel_id', '');
        $this->accessToken  = config('services.meta.access_token', '');
        $this->sdkAvailable = class_exists('\FacebookAds\Api');

        if ($this->isConfigured() && $this->sdkAvailable) {
            \FacebookAds\Api::init(null, null, $this->accessToken, false);
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

        $event = (new \FacebookAds\Object\ServerSide\Event)
            ->setEventName('PageView')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(\FacebookAds\Object\ServerSide\ActionSource::WEBSITE)
            ->setUserData($userData);

        $this->sendEvents([$event]);
    }

    public function sendAddToCart(Request $request, string $eventId, array $eventData = []): void
    {
        if (! $this->isConfigured() || ! $this->sdkAvailable) {
            return;
        }

        $userData = $this->buildUserData($request);

        $level       = $eventData['level'] ?? 'Starter';
        $price       = match ($level) {
            'Intermediate' => 350000,
            'Bundling'     => 375000,
            default        => 250000,
        };
        $productId   = 'toefl-' . strtolower($level);
        $contentName = "TOEFL Full Bright Level {$level}";

        $content = (new \FacebookAds\Object\ServerSide\Content)
            ->setProductId($productId)
            ->setQuantity(1);

        $customData = (new \FacebookAds\Object\ServerSide\CustomData)
            ->setContentName($contentName)
            ->setContentType('product')
            ->setValue($price)
            ->setCurrency('IDR')
            ->setContents([$content]);

        $event = (new \FacebookAds\Object\ServerSide\Event)
            ->setEventName('AddToCart')
            ->setEventTime(time())
            ->setEventId($eventId)
            ->setEventSourceUrl($request->header('Referer', $request->url()))
            ->setActionSource(\FacebookAds\Object\ServerSide\ActionSource::WEBSITE)
            ->setUserData($userData)
            ->setCustomData($customData);

        $this->sendEvents([$event]);
    }

    private function buildUserData(Request $request): \FacebookAds\Object\ServerSide\UserData
    {
        $userData = (new \FacebookAds\Object\ServerSide\UserData)
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
            $eventRequest = (new \FacebookAds\Object\ServerSide\EventRequest($this->pixelId))
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
