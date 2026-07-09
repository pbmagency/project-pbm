import { cn } from '@/lib/utils';

interface EyebrowProps {
    children: string;
    className?: string;
    tone?: 'primary' | 'amber';
}

export function Eyebrow({
    children,
    className,
    tone = 'primary',
}: EyebrowProps) {
    return (
        <div
            className={cn(
                'inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-semibold backdrop-blur-sm',
                tone === 'primary' &&
                    'border-lp-primary/30 bg-lp-primary-soft/60 text-lp-primary-ink shadow-[0_0_20px_-8px_oklch(0.68_0.19_232/0.7)]',
                tone === 'amber' &&
                    'border-lp-amber/40 bg-lp-amber-soft/60 text-lp-amber-ink shadow-[0_0_20px_-8px_oklch(0.8_0.16_78/0.7)]',
                className,
            )}
        >
            <span
                className={cn(
                    'relative flex h-1.5 w-1.5 shrink-0 rounded-full',
                    tone === 'primary' && 'bg-lp-primary-ink',
                    tone === 'amber' && 'bg-lp-amber-ink',
                )}
            >
                <span
                    className={cn(
                        'animate-lp-pulse-ring absolute inset-0 rounded-full',
                        tone === 'primary' && 'bg-lp-primary-ink',
                        tone === 'amber' && 'bg-lp-amber-ink',
                    )}
                />
            </span>
            {children}
        </div>
    );
}
