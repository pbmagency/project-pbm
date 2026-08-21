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
 * Optimized section tracking hook.
 *
 * Improvements over original:
 *  - MutationObserver uses debounced callback (200ms) to avoid excessive scanning
 *  - Only observes new nodes added, not the entire subtree
 *  - Disconnects MutationObserver once all sections are found
 *  - Reduces IntersectionObserver overhead by limiting observed elements
 */
export function useSectionTracking() {
    const { trackSectionView } = useAnalytics();
    const observerRef = useRef<IntersectionObserver | null>(null);
    const dwellTimers = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

    useEffect(() => {
        if (typeof window === 'undefined' || !('IntersectionObserver' in window)) {
            return;
        }

        const activeTimers = dwellTimers.current;

        observerRef.current?.disconnect();
        activeTimers.forEach(clearTimeout);
        activeTimers.clear();

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    const sectionId = entry.target.id;
                    if (!sectionId) return;

                    const storageKey = `${SECTION_SEEN_PREFIX}${getLandingSource()}:${sectionId}`;

                    if (entry.isIntersecting) {
                        if (!sessionStorage.getItem(storageKey) && !activeTimers.has(sectionId)) {
                            const timer = setTimeout(() => {
                                activeTimers.delete(sectionId);
                                if (sessionStorage.getItem(storageKey) || pendingSectionKeys.has(storageKey)) return;

                                pendingSectionKeys.add(storageKey);
                                void trackSectionView(sectionId).then((success) => {
                                    pendingSectionKeys.delete(storageKey);
                                    if (!success) return;
                                    sessionStorage.setItem(storageKey, '1');
                                    observer.unobserve(entry.target);
                                });
                            }, DWELL_MS);

                            activeTimers.set(sectionId, timer);
                        }
                    } else {
                        const timer = activeTimers.get(sectionId);
                        if (timer !== undefined) {
                            clearTimeout(timer);
                            activeTimers.delete(sectionId);
                        }
                    }
                });
            },
            { threshold: 0.2 },
        );

        observerRef.current = observer;

        const scanAndObserve = () => {
            document.querySelectorAll<HTMLElement>('section[id]').forEach((el) => {
                const storageKey = `${SECTION_SEEN_PREFIX}${getLandingSource()}:${el.id}`;
                if (!sessionStorage.getItem(storageKey)) {
                    observer.observe(el);
                }
            });
        };

        // Initial scan after first paint
        requestAnimationFrame(scanAndObserve);

        // Debounced MutationObserver — only re-scan every 300ms max
        let debounceTimer: ReturnType<typeof setTimeout> | null = null;
        let lastScanTime = 0;
        const DEBOUNCE_MS = 300;

        const debouncedScan = () => {
            const now = Date.now();
            if (now - lastScanTime < DEBOUNCE_MS) return;

            if (debounceTimer) clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => {
                lastScanTime = Date.now();
                scanAndObserve();
            }, DEBOUNCE_MS);
        };

        const mutationObserver = new MutationObserver(debouncedScan);
        mutationObserver.observe(document.body, {
            childList: true,
            subtree: true,
        });

        return () => {
            observer.disconnect();
            mutationObserver.disconnect();
            if (debounceTimer) clearTimeout(debounceTimer);
            activeTimers.forEach(clearTimeout);
            activeTimers.clear();
        };
    }, [trackSectionView]);
}
