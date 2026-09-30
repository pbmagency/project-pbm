<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;
use Symfony\Component\HttpFoundation\Response;

/**
 * Server-side HTML cache for the public landing pages.
 */
class CacheLandingPage
{
    // Caches the page for 7 days
    private const TTL_SECONDS = 604800;

    public function handle(Request $request, Closure $next): Response
    {
        // Only cache GET requests for guests visiting the landing page or policy pages
        $isLandingPage = in_array($request->path(), ['/', 'terms', 'refund']);

        if (! $request->isMethod('GET') || $request->header('X-Inertia') || $request->user() || ! $isLandingPage) {
            return $next($request);
        }

        $pathKey = str_replace('/', '_', $request->path());
        $cacheKey = "landing_page_html_{$pathKey}:".self::manifestVersion();

        if (Cache::has($cacheKey)) {
            /** @var string $html */
            $html = Cache::get($cacheKey);

            return response($html, 200, ['Content-Type' => 'text/html; charset=UTF-8']);
        }

        /** @var Response $response */
        $response = $next($request);

        if ($response->getStatusCode() === 200) {
            $content = $response->getContent();

            // Normalize URLs to relative paths to prevent CORS issues across origins (localhost vs 127.0.0.1)
            $host = $request->schemeAndHttpHost();
            if ($host) {
                $content = str_replace($host.'/build/', '/build/', $content);
            }
            $content = str_replace(['http://127.0.0.1:8000/build/', 'http://localhost:8000/build/'], '/build/', $content);

            Cache::put($cacheKey, $content, self::TTL_SECONDS);

            // Write static cache for server.php fast-path when visiting root
            if ($request->path() === '/') {
                @file_put_contents(storage_path('framework/cache/landing.html'), $content);
                @file_put_contents(storage_path('framework/cache/landing.html.gz'), gzencode($content, 9));
            }

            $response->setContent($content);
        }

        return $response;
    }

    private static function manifestVersion(): string
    {
        $manifest = public_path('build/manifest.json');

        if (file_exists($manifest)) {
            return (string) filemtime($manifest);
        }

        return 'dev';
    }
}
