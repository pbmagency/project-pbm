import { useEffect, useRef } from 'react';
import { useAnalytics } from './use-analytics';

const MILESTONES = [25, 50, 75, 90];

export function useScrollTracking() {
    const { trackScroll } = useAnalytics();
    const scrollDepths = useRef(new Set<number>());
    const lastScrollTime = useRef(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();

            if (now - lastScrollTime.current < 200) {
                return;
            }

            lastScrollTime.current = now;

            const scrollHeight =
                document.documentElement.scrollHeight - window.innerHeight;

            if (scrollHeight <= 0) {
                return;
            }

            const scrollPercent = Math.round(
                (window.scrollY / scrollHeight) * 100,
            );

            MILESTONES.forEach((milestone) => {
                if (
                    scrollPercent >= milestone &&
                    !scrollDepths.current.has(milestone)
                ) {
                    scrollDepths.current.add(milestone);
                    trackScroll(milestone);
                }
            });
        };

        window.addEventListener('scroll', handleScroll, { passive: true });

        return () => window.removeEventListener('scroll', handleScroll);
    }, [trackScroll]);
}
