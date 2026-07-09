import { useCallback, useEffect, useRef } from 'react';
import { useAnalytics } from './use-analytics';

const INITIAL_THRESHOLD = 15000; // 15 seconds for the first "engaged" ping
const HEARTBEAT_INTERVAL = 30000; // every 30 seconds after that
const TICK_INTERVAL = 1000;

export function useDwellTime() {
    const { trackEngagement } = useAnalytics();

    const timeActive = useRef(0);
    const lastPingTime = useRef(0);
    const hasInitialTracked = useRef(false);
    const isVisible = useRef(!document.hidden);
    const tickerRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const sendPing = useCallback(
        (duration: number, isInitial: boolean) => {
            trackEngagement(duration, isInitial);
        },
        [trackEngagement],
    );

    useEffect(() => {
        const handleVisibilityChange = () => {
            isVisible.current = !document.hidden;
        };

        const tick = () => {
            if (!isVisible.current) {
                return;
            }

            timeActive.current += TICK_INTERVAL;

            if (
                !hasInitialTracked.current &&
                timeActive.current >= INITIAL_THRESHOLD
            ) {
                hasInitialTracked.current = true;
                lastPingTime.current = timeActive.current;
                sendPing(INITIAL_THRESHOLD, true);

                return;
            }

            if (hasInitialTracked.current) {
                const timeSinceLastPing =
                    timeActive.current - lastPingTime.current;

                if (timeSinceLastPing >= HEARTBEAT_INTERVAL) {
                    lastPingTime.current = timeActive.current;
                    sendPing(HEARTBEAT_INTERVAL, false);
                }
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        tickerRef.current = setInterval(tick, TICK_INTERVAL);

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange,
            );

            if (tickerRef.current) {
                clearInterval(tickerRef.current);
                tickerRef.current = null;
            }
        };
    }, [sendPing]);
}
