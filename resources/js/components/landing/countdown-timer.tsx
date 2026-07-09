import { useEffect, useState } from 'react';

const DURATION_MS = 8 * 60 * 60 * 1000; // 8 hours
const STORAGE_KEY = 'pricing_countdown_deadline';

function getDeadline(): number {
    if (typeof window === 'undefined') {
        return Date.now() + DURATION_MS;
    }

    const stored = Number(sessionStorage.getItem(STORAGE_KEY));

    if (stored && stored > Date.now()) {
        return stored;
    }

    const deadline = Date.now() + DURATION_MS;
    sessionStorage.setItem(STORAGE_KEY, String(deadline));

    return deadline;
}

/**
 * Purely decorative urgency element. Loops back to 8 hours whenever it hits
 * zero. No offer, price, or checkout logic depends on this ever expiring.
 */
export function CountdownTimer() {
    const [deadline, setDeadline] = useState(getDeadline);
    const [remaining, setRemaining] = useState(0);

    useEffect(() => {
        const tick = () => {
            const diff = deadline - Date.now();

            if (diff <= 0) {
                const nextDeadline = Date.now() + DURATION_MS;
                sessionStorage.setItem(STORAGE_KEY, String(nextDeadline));
                setDeadline(nextDeadline);
                setRemaining(DURATION_MS);

                return;
            }

            setRemaining(diff);
        };

        tick();
        const interval = setInterval(tick, 1000);

        return () => clearInterval(interval);
    }, [deadline]);

    const hours = Math.floor(remaining / 3_600_000);
    const minutes = Math.floor((remaining % 3_600_000) / 60_000);
    const seconds = Math.floor((remaining % 60_000) / 1000);

    const pad = (n: number) => String(n).padStart(2, '0');

    return (
        <div className="flex items-center justify-center gap-1.5 font-mono text-xl font-bold text-white sm:text-2xl">
            {[hours, minutes, seconds].map((unit, i) => (
                <span key={i} className="flex items-center gap-1.5">
                    <span className="rounded-lg bg-white/15 px-2.5 py-1.5 tabular-nums">
                        {pad(unit)}
                    </span>
                    {i < 2 && <span className="text-white/50">:</span>}
                </span>
            ))}
        </div>
    );
}
