<?php

namespace App\Services;

use Closure;
use Illuminate\Http\Request;
use LogicException;
use PostHog\PostHog;

class PostHogService
{
    private static bool $initialized = false;

    public function __construct()
    {
        if (config('posthog.disabled')) {
            return;
        }

        $apiKey = config('posthog.api_key');
        $host = config('posthog.host');

        if (! filled($apiKey)) {
            $this->throwIfDebug('POSTHOG_PROJECT_TOKEN');

            return;
        }

        if (! filled($host)) {
            $this->throwIfDebug('POSTHOG_HOST');

            return;
        }

        if (! self::$initialized) {
            PostHog::init($apiKey, ['host' => $host]);
            self::$initialized = true;
        }
    }

    public function withRequestContext(Request $request, Closure $callback): mixed
    {
        if (! self::$initialized) {
            return $callback();
        }

        $context = PostHog::contextFromHeaders($request->headers->all());
        $user = $request->user();

        if ($user !== null) {
            $context['distinctId'] = (string) $user->getAuthIdentifier();
        }

        return PostHog::withContext($context, $callback, ['fresh' => true]);
    }

    /** @param array<string, mixed> $properties */
    public function capture(string $event, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::capture([
            'event' => $event,
            'properties' => [...$this->defaultProperties(), ...$properties],
        ]);
    }

    /** @param array<string, mixed> $properties */
    public function captureWithContext(string $distinctId, string $event, array $properties = []): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::capture([
            'distinctId' => $distinctId,
            'event' => $event,
            'properties' => [...$this->defaultProperties(), ...$properties],
        ]);
    }

    public function captureException(\Throwable $exception, ?string $distinctId = null): void
    {
        if (! self::$initialized) {
            return;
        }

        PostHog::captureException($exception, $distinctId, $this->defaultProperties());
    }

    /** @return array{client_id: string, client_type: string} */
    private function defaultProperties(): array
    {
        return [
            'client_id' => (string) config('posthog.client_id'),
            'client_type' => (string) config('posthog.client_type'),
        ];
    }

    private function throwIfDebug(string $variable): void
    {
        if (app()->hasDebugModeEnabled()) {
            throw new LogicException("{$variable} variable required by PostHog is missing or un-configured, this causes events to be silently missed. This error stops appearing once {$variable} is configured");
        }
    }
}
