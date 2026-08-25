import { useCallback, useEffect } from 'react';

const LANDING_SOURCE_KEY = 'landing_source';
const REFERRAL_SOURCE_KEY = 'referral_source';
const VISIT_TRACKED_PREFIX = 'analytics_visit_tracked:';
const pendingVisitKeys = new Set<string>();

export type AnalyticsEventType =
    | 'visit'
    | 'scroll'
    | 'engagement'
    | 'cta_click'
    | 'initiate_checkout'
    | 'conversion'
    | 'payment'
    | 'section_view';

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

export function getLandingSource(): string {
    if (typeof window === 'undefined') {
        return 'unknown';
    }

    return (
        sessionStorage.getItem(LANDING_SOURCE_KEY) || window.location.pathname
    );
}

export function useAnalytics() {
    const coursePrice = import.meta.env.VITE_COURSE_PRICE;

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

        if (!sessionStorage.getItem(REFERRAL_SOURCE_KEY)) {
            const urlParams = new URLSearchParams(window.location.search);
            let externalReferrer = '';

            if (document.referrer) {
                try {
                    externalReferrer =
                        new URL(document.referrer).hostname ===
                        window.location.hostname
                            ? ''
                            : document.referrer;
                } catch {
                    externalReferrer = '';
                }
            }

            sessionStorage.setItem(
                REFERRAL_SOURCE_KEY,
                urlParams.get('ref') || externalReferrer || 'direct',
            );
        }
    }, []);

    const track = useCallback(
        async (event: AnalyticsEvent): Promise<boolean> => {
            try {
                const urlParams = new URLSearchParams(window.location.search);
                const payload = {
                    ...event,
                    event_data: {
                        ...event.event_data,
                        landing_source: getLandingSource(),
                    },
                    referral_source:
                        event.referral_source ||
                        sessionStorage.getItem(REFERRAL_SOURCE_KEY) ||
                        'direct',
                    utm_source: event.utm_source || urlParams.get('utm_source'),
                    utm_medium: event.utm_medium || urlParams.get('utm_medium'),
                    utm_campaign:
                        event.utm_campaign || urlParams.get('utm_campaign'),
                    utm_content:
                        event.utm_content || urlParams.get('utm_content'),
                    utm_term: event.utm_term || urlParams.get('utm_term'),
                };

                const response = await fetch('/analytics/track', {
                    method: 'POST',
                    credentials: 'same-origin',
                    keepalive: true,
                    headers: {
                        'Content-Type': 'application/json',
                        'X-CSRF-TOKEN':
                            document
                                .querySelector('meta[name=csrf-token]')
                                ?.getAttribute('content') || '',
                    },
                    body: JSON.stringify(payload),
                });

                if (!response.ok) {
                    console.debug(
                        `Analytics tracking rejected (${response.status})`,
                    );

                    return false;
                }

                return true;
            } catch (error) {
                console.debug('Analytics tracking failed:', error);

                return false;
            }
        },
        [],
    );

    const trackVisit = useCallback(() => {
        const landingSource = getLandingSource();
        const visitKey = `${VISIT_TRACKED_PREFIX}${landingSource}`;

        if (
            sessionStorage.getItem(visitKey) === 'tracked' ||
            pendingVisitKeys.has(visitKey)
        ) {
            return;
        }

        pendingVisitKeys.add(visitKey);

        const eventId =
            ((window as unknown as Record<string, unknown>)
                .__META_PAGE_VIEW_EVENT_ID as string) || generateEventId();

        void track({
            event_type: 'visit',
            event_data: {
                page: window.location.pathname,
                timestamp: new Date().toISOString(),
                event_id: eventId,
                _fbp: getCookieValue('_fbp'),
                _fbc: getCookieValue('_fbc'),
            },
        }).then((success) => {
            pendingVisitKeys.delete(visitKey);

            if (success) {
                sessionStorage.setItem(visitKey, 'tracked');

                return;
            }

            sessionStorage.removeItem(visitKey);
        });
    }, [track]);

    const trackScroll = useCallback(
        (depth: number) => {
            void track({
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
        (duration: number, isInitial = false) => {
            void track({
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
        (location: string, text: string, destination = 'unknown') => {
            void track({
                event_type: 'cta_click',
                event_data: {
                    location,
                    text,
                    destination,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                },
            });
        },
        [track],
    );

    const trackInitiateCheckout = useCallback(
        (
            location: string,
            data?: Record<string, unknown>,
            eventId = generateEventId(),
        ) => {
            void track({
                event_type: 'initiate_checkout',
                event_data: {
                    type: 'external_payment_redirect',
                    location,
                    event_id: eventId,
                    _fbp: getCookieValue('_fbp'),
                    _fbc: getCookieValue('_fbc'),
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    const trackConversion = useCallback(
        (type: string, data?: Record<string, unknown>) => {
            void track({
                event_type: 'conversion',
                event_data: {
                    type,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    const trackPayment = useCallback(
        (status: string, data?: Record<string, unknown>) => {
            void track({
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

    const trackSectionView = useCallback(
        (sectionId: string, data?: Record<string, unknown>) => {
            return track({
                event_type: 'section_view',
                event_data: {
                    section: sectionId,
                    page: window.location.pathname,
                    timestamp: new Date().toISOString(),
                    ...data,
                },
            });
        },
        [track],
    );

    return {
        track,
        trackVisit,
        trackScroll,
        trackEngagement,
        trackCTA,
        trackInitiateCheckout,
        trackConversion,
        trackPayment,
        trackSectionView,
    };
}
