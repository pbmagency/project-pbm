import { useEffect, useRef } from 'react';
import { useAnalytics } from './use-analytics';

/**
 * Fires a `section_view` event the first time a section scrolls into view,
 * powering the Labs "Section Views" visibility funnel. Fires at most once
 * per section per page load.
 */
export function useSectionView<T extends HTMLElement = HTMLDivElement>(
    sectionId: string,
) {
    const ref = useRef<T | null>(null);
    const hasTracked = useRef(false);
    const { trackSectionView } = useAnalytics();

    useEffect(() => {
        const el = ref.current;

        if (!el || typeof IntersectionObserver === 'undefined') {
            return;
        }

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasTracked.current) {
                    hasTracked.current = true;
                    trackSectionView(sectionId);
                    observer.disconnect();
                }
            },
            { threshold: 0.25 },
        );

        observer.observe(el);

        return () => observer.disconnect();
    }, [sectionId, trackSectionView]);

    return ref;
}
