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

            await fetch('/analytics/track', {
                method: 'POST',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json',
                    'X-CSRF-TOKEN':
                        document
                            .querySelector('meta[name="csrf-token"]')
                            ?.getAttribute('content') || '',
                },
                body: JSON.stringify(eventData),
            });
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

/** Checkout form submit: fires InitiateCheckout Meta + tracks conversion backend event */
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

    /** Checkout form submit → InitiateCheckout pixel + conversion event in DB */
    const trackCheckoutSubmit = useCallback(() => {
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
            },
        });
    }, [track, coursePrice]);

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
        trackCheckoutSubmit,
        trackPayment,
        trackSectionView,
    };
}