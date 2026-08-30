<!DOCTYPE html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}" @class([
    'dark' => ($appearance ?? 'system') == 'dark',
    'scroll-smooth',
])>

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{ csrf_token() }}">

    {{-- Preload the LCP Hero Image for the landing page to boost score --}}
    @if (request()->path() === '/' || request()->routeIs('landing') || request()->routeIs('welcome'))
        <link rel="preload" as="image" href="/images/poster/Poster.webp" type="image/webp" fetchpriority="high">
    @endif

    <script>
        let trackingLoaded = false;
        window.__META_PAGE_VIEW_EVENT_ID = window.crypto?.randomUUID?.() ??
            `${Date.now()}-${Math.random().toString(36).slice(2)}`;
        @if ($metaPixelId = config('services.meta.pixel_id'))
        window.__META_PIXEL_ID = '{{ $metaPixelId }}';
        @endif

        function loadTrackingScripts() {
            if (trackingLoaded) return;
            trackingLoaded = true;

            @if ($metaPixelId = config('services.meta.pixel_id'))
                // Load FB Pixel
                ! function(f, b, e, v, n, t, s) {
                    if (f.fbq) return;
                    n = f.fbq = function() {
                        n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments)
                    };
                    if (!f._fbq) f._fbq = n;
                    n.push = n;
                    n.loaded = !0;
                    n.version = '2.0';
                    n.queue = [];
                    t = b.createElement(e);
                    t.async = !0;
                    t.src = v;
                    s = b.getElementsByTagName(e)[0];
                    s.parentNode.insertBefore(t, s)
                }(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');
                fbq('init', '{{ $metaPixelId }}');
                fbq('track', 'PageView', {}, {
                    eventID: window.__META_PAGE_VIEW_EVENT_ID
                });
            @endif

            // Load Microsoft Clarity
            (function(c, l, a, r, i, t, y) {
                c[a] = c[a] || function() {
                    (c[a].q = c[a].q || []).push(arguments)
                };
                t = l.createElement(r);
                t.async = 1;
                t.src = "https://www.clarity.ms/tag/" + i;
                y = l.getElementsByTagName(r)[0];
                y.parentNode.insertBefore(t, y);
            })(window, document, "clarity", "script", "xnf0g1adw1");
        }

        // Load scripts instantly when the user interacts with the page.
        //
        // IMPORTANT: click and touchstart use capture:true so that
        // loadTrackingScripts fires in the CAPTURE phase (window → element),
        // BEFORE any React onClick / onTouchStart handler runs on the element.
        // Without this, a user's first click fires the React handler before fbq
        // is defined, making AddToCart / Contact events silently drop.
        //
        // scroll, mousemove and keydown do not need capture because they fire
        // well before any subsequent click.
        var captureEvents = { click: true, touchstart: true };
        ['scroll', 'mousemove', 'touchstart', 'keydown', 'click'].forEach(function(e) {
            window.addEventListener(e, loadTrackingScripts, {
                once: true,
                passive: true,
                capture: !!captureEvents[e]
            });
        });

        // Expose for use inside fbqTrack — lets React components eagerly
        // initialise the pixel before firing a custom event.
        window.__initPixel = loadTrackingScripts;

        // Fallback: If they do nothing for 6 seconds, load them anyway
        setTimeout(loadTrackingScripts, 6000);
    </script>

    {{-- Inline script to detect system dark mode preference and apply it immediately --}}
    <script>
        (function() {
            const appearance = '{{ $appearance ?? 'system' }}';

            if (appearance === 'system') {
                const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

                if (prefersDark) {
                    document.documentElement.classList.add('dark');
                }
            }
        })();
    </script>

    {{-- Inline style to set the HTML background color based on our theme in app.css --}}
    <style>
        html {
            background-color: oklch(1 0 0);
        }

        html.dark {
            background-color: oklch(0.145 0 0);
        }
    </style>

    {{-- Preconnect to CDN serving Vite assets --}}
    <link rel="preconnect" href="https://pbmagency-sub3.b-cdn.net" crossorigin>
    <link rel="dns-prefetch" href="https://pbmagency-sub3.b-cdn.net">
    {{-- Preconnect to font origin (self-hosted via Bunny) --}}
    <link rel="preconnect" href="https://sub3.pbmagency.id">
    {{-- Preload main CSS to reduce render-blocking duration --}}
    <link rel="preload" href="{{ Vite::asset('resources/css/app.css') }}" as="style">
    <link rel="icon" href="/favicon.ico" sizes="any">
    <link rel="icon" href="/favicon.svg" type="image/svg+xml">
    <link rel="apple-touch-icon" href="/apple-touch-icon.png">

    @fonts

    @viteReactRefresh
    @vite(['resources/css/app.css', 'resources/js/app.tsx', "resources/js/pages/{$page['component']}.tsx"])
    <x-inertia::head>
        <title>{{ config('app.name', 'Laravel') }}</title>
    </x-inertia::head>
</head>

<body class="font-sans antialiased">
    <x-inertia::app />
</body>

</html>
