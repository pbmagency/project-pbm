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
                'inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm font-semibold',
                tone === 'primary' && 'bg-lp-primary-soft text-lp-primary-ink',
                tone === 'amber' && 'bg-lp-amber-soft text-lp-amber-ink',
                className,
            )}
        >
            <span
                className={cn(
                    'h-1.5 w-1.5 shrink-0 rounded-full',
                    tone === 'primary' && 'bg-lp-primary-ink',
                    tone === 'amber' && 'bg-lp-amber-ink',
                )}
            />
            {children}
        </div>
    );
}
