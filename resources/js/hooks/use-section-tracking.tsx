import { useEffect, useRef } from 'react';
import { getLandingSource, useAnalytics } from '@/hooks/use-analytics';

// v2 forces browsers that cached a failed/stripped section event to retry once.
const SECTION_SEEN_PREFIX = 'section_seen_v2_';
const pendingSectionKeys = new Set<string>();

/**
 * Minimum continuous visibility duration (ms) required to count a section as "seen".
 * 500ms filters fast-scrolls while capturing genuine pauses.
 */
const DWELL_MS = 500;

/**
 * Automatically track all <section> elements that have an `id` attribute.
 *
 * No predefined list needed — the hook scans the DOM on mount and observes
 * every matching element. New sections added to the page are picked up
 * automatically without updating any config.
 *
 * Strategy:
 *  - querySelectorAll('section[id]') discovers sections dynamically.
 *  - IntersectionObserver with threshold:0.2 detects entry/exit for sections
 *    of any height (tall sections can never achieve 50% simultaneous visibility).
 *  - A 500ms dwell timer is started on entry and cancelled on exit, so
 *    fast-scrolls do NOT trigger an event — only genuine pauses count.
 *  - Each section fires exactly once per session (deduplicated via sessionStorage).
 */
export function useSectionTracking() {
    const { trackSectionView } = useAnalytics();
    const observerRef = useRef<IntersectionObserver | null>(null);
    // Map of sectionId → pending dwell timer
    const dwellTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(
        new Map(),
    );

    useEffect(() => {
        if (
            typeof window === 'undefined' ||
            !('IntersectionObserver' in window)
        ) {
            return;
        }

        const activeTimers = dwellTimers.current;

        // Clean up previous observer and any pending timers
        observerRef.current?.disconnect();
        activeTimers.forEach(clearTimeout);
        activeTimers.clear();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id;

                    if (!sectionId) {
                        return;
                    }

                    const storageKey = `${SECTION_SEEN_PREFIX}${getLandingSource()}:${sectionId}`;

                    if (entry.isIntersecting) {
                        // Section entered viewport — start dwell timer if not already seen
                        if (
                            !sessionStorage.getItem(storageKey) &&
                            !activeTimers.has(sectionId)
                        ) {
                            const timer = setTimeout(() => {
                                activeTimers.delete(sectionId);

                                // Guard: don't double-fire if somehow already tracked
                                if (
                                    sessionStorage.getItem(storageKey) ||
                                    pendingSectionKeys.has(storageKey)
                                ) {
                                    return;
                                }

                                pendingSectionKeys.add(storageKey);

                                void trackSectionView(sectionId).then(
                                    (success) => {
                                        pendingSectionKeys.delete(storageKey);

                                        if (!success) {
                                            return;
                                        }

                                        sessionStorage.setItem(storageKey, '1');
                                        observer.unobserve(entry.target);
                                    },
                                );
                            }, DWELL_MS);

                            activeTimers.set(sectionId, timer);
                        }
                    } else {
                        // Section left viewport — cancel pending timer (fast-scroll → no event)
                        const timer = activeTimers.get(sectionId);

                        if (timer !== undefined) {
                            clearTimeout(timer);
                            activeTimers.delete(sectionId);
                        }
                    }
                });
            },
            {
                // threshold: 0.2 — fires when 20% of the section enters the viewport.
                // Data quality is maintained by the DWELL_MS timer above.
                threshold: 0.2,
            },
        );

        observerRef.current = observer;

        /**
         * Scan the DOM for any <section id="..."> elements that haven't been
         * seen yet and start observing them. Called on initial paint AND every
         * time the MutationObserver detects new nodes (e.g. lazy-loaded sections).
         */
        const scanAndObserve = () => {
            document
                .querySelectorAll<HTMLElement>('section[id]')
                .forEach((el) => {
                    const storageKey = `${SECTION_SEEN_PREFIX}${getLandingSource()}:${el.id}`;

                    if (!sessionStorage.getItem(storageKey)) {
                        observer.observe(el);
                    }
                });
        };

        // Initial scan after first paint
        requestAnimationFrame(scanAndObserve);

        // Watch for lazy-loaded sections being inserted into the DOM so they
        // are picked up without requiring a full re-mount of this hook.
        const mutationObserver = new MutationObserver(scanAndObserve);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            // Cancel all pending dwell timers on unmount
            activeTimers.forEach(clearTimeout);
            activeTimers.clear();
        };
    }, [trackSectionView]); // no sectionIds dependency — DOM is the source of truth
}
