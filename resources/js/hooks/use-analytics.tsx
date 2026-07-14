import { useCallback, useEffect } from 'react';
import type { AnalyticsEventType } from '@/types/analytics';

const LANDING_SOURCE_KEY = 'landing_source';
const VISIT_TRACKED_KEY = 'analytics_visit_tracked';

declare global {
    interface Window {
        fbq?: (...args: unknown[]) => void;
        __META_PAGE_VIEW_EVENT_ID?: string;
    }
}

export function generateEventId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
        return crypto.randomUUID();
    }

    return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
}

function getCookieValue(name: string): string | null {
    const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));

    return match ? decodeURIComponent(match[2]) : null;
}

interface AnalyticsEvent {
    event_type: AnalyticsEventType;
    event_data?: Record<string, unknown>;
    referral_source?: string;
    utm_source?: string;
    utm_medium?: string;
    utm_campaign?: string;
    utm_content?: string;
    utm_term?: string;
}

export function getLandingSource(): string {
    if (typeof window === 'undefined') {
        return 'unknown';
    }

    return (
        sessionStorage.getItem(LANDING_SOURCE_KEY) || window.location.pathname
    );
}

export function useAnalytics() {
    const coursePrice = Number(import.meta.env.VITE_COURSE_PRICE ?? 129000);

    useEffect(() => {
        if (typeof window === 'undefined') {
            return;
        }

        if (!sessionStorage.getItem(LANDING_SOURCE_KEY)) {
            sessionStorage.setItem(
                LANDING_SOURCE_KEY,
                window.location.pathname,
            );
        }
    }, []);

    const track = useCallback(async (event: AnalyticsEvent) => {
        try {
            const landingSource = getLandingSource();
            const urlParams = new URLSearchParams(window.location.search);

            const eventData = {
                ...event,
                event_data: {
                    ...event.event_data,
                    landing_source: landingSource,
                },
                referral_source:
                    event.referral_source ||
                    urlParams.get('ref') ||
                    document.referrer ||
                    'direct',
                utm_source: event.utm_source || urlParams.get('utm_source'),
                utm_medium: event.utm_medium || urlParams.get('utm_medium'),
                utm_campaign:
                    event.utm_campaign || urlParams.get('utm_campaign'),
                utm_content: event.utm_content || urlParams.get('utm_content'),
                utm_term: event.utm_term || urlParams.get('utm_term'),
            };

            const response = await fetch('/analytics/track', {
                method: 'POST',
                credentials: 'same-origin',
                keepalive: true, // survive navigation firing right after this call (e.g. redirect to payment gateway)
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify(eventData),
            });

            if (!response.ok) {
                // fetch() does NOT reject on 4xx/5xx — without this check,
                // a rejected event_type (422) fails completely silently.
                const body = await response.text().catch(() => '');
                console.error(
                    `Analytics tracking rejected (${response.status}) for event_type "${event.event_type}":`,
                    body,
                );
            }
        } catch (error) {
            console.debug('Analytics tracking failed:', error);
        }
    }, []);

    const trackVisit = useCallback(() => {
        if (
            typeof window === 'undefined' ||
            sessionStorage.getItem(VISIT_TRACKED_KEY)
        ) {
            return;
        }

        sessionStorage.setItem(VISIT_TRACKED_KEY, '1');

        const eventId = generateEventId();
        window.__META_PAGE_VIEW_EVENT_ID = eventId;

        if (typeof window.fbq === 'function') {
            window.fbq('track', 'PageView', {}, { eventID: eventId });
        }

        track({
            event_type: 'visit',
            event_data: {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
            },
        });
    }, [track]);

    const trackScroll = useCallback(
        (depth: number) => {
            track({
                event_type: 'scroll',
                event_data: {
                    depth,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackEngagement = useCallback(
        (duration: number, isInitial: boolean) => {
            track({
                event_type: 'engagement',
                event_data: {
                    type: 'dwell_ping',
                    duration,
                    is_initial: isInitial,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackCTA = useCallback(
        (location: string, text: string, destination?: string) => {
            track({
                event_type: 'cta_click',
                event_data: {
                    location,
                    text,
                    destination: destination || 'unknown',
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    /** Pricing CTA click → AddToCart pixel + cta_click event in DB */
/** Pricing CTA click: fires AddToCart Meta + tracks initiate_checkout backend event */
const trackInitiateCheckout = useCallback(
    (location: string) => {
        const eventId = generateEventId();

        if (typeof window.fbq === 'function') {
            window.fbq(
                'track',
                'AddToCart',
                { value: coursePrice, currency: 'IDR' },
                { eventID: eventId },
            );
        }

        track({
            event_type: 'initiate_checkout',
            event_data: {
                location,
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                meta_event: 'AddToCart',
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
            },
        });
    },
    [track, coursePrice],
);

/**
 * Checkout form submit: fires InitiateCheckout Meta pixel + tracks the
 * "conversion" backend event (spec: "submit form checkout -> conversion").
 * NOTE: this previously sent event_type 'lead', which is not in the backend's
 * validation whitelist — every call was rejected with a 422 and silently
 * dropped. Fixed to 'conversion', which the backend already accepts.
 */
const trackLeadConversion = useCallback(
    (data?: Record<string, unknown>) => {
        const eventId = generateEventId();

        if (typeof window.fbq === 'function') {
            window.fbq(
                'track',
                'InitiateCheckout',
                { value: coursePrice, currency: 'IDR' },
                { eventID: eventId },
            );
        }

        track({
            event_type: 'conversion',
            event_data: {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                meta_event: 'InitiateCheckout',
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
                ...data,
            },
        });
    },
    [track, coursePrice],
);

    const trackSectionView = useCallback(
        (sectionId: string) => {
            track({
                event_type: 'section_view',
                event_data: {
                    section: sectionId,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackPayment = useCallback(
        (status: string, data?: Record<string, unknown>) => {
            // NOTE: this does NOT fire its own browser pixel. The Meta docs
            // and this codebase's actual usage (see PaymentSuccess page)
            // expect the CALLER to fire fbq('track', 'Purchase', ...) itself
            // with a deterministic event_id (e.g. derived from order number,
            // not a fresh UUID — stable across page refreshes), and pass that
            // same event_id through `data.event_id` so the backend's
            // sendPurchase() call shares it for CAPI dedup. Firing a second,
            // independently-generated pixel here would create two
            // undeduplicated Purchase events per sale in Meta.
            track({
                event_type: 'payment',
                event_data: {
                    status,
                    amount: coursePrice,
                    currency: 'IDR',
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track, coursePrice],
    );

    return {
        track,
        trackVisit,
        trackScroll,
        trackEngagement,
        trackCTA,
        trackLeadConversion,
        trackInitiateCheckout,
        trackPayment,
        trackSectionView,
    };
}