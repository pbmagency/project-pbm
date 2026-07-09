import { Link } from '@inertiajs/react';
import type { ReactNode } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { cn } from '@/lib/utils';
import { checkout } from '@/routes';

interface CtaButtonProps {
    location: string;
    children: ReactNode;
    className?: string;
    /** Only the pricing section CTA should also fire the "conversion" + AddToCart event. */
    isPricingCta?: boolean;
    /** "white" is for use on top of the gradient pricing card. */
    variant?: 'gradient' | 'white';
}

export function CtaButton({
    location,
    children,
    className,
    isPricingCta = false,
    variant = 'gradient',
}: CtaButtonProps) {
    const { trackCTA, trackConversion } = useAnalytics();

    const handleClick = () => {
        trackCTA(
            location,
            typeof children === 'string' ? children : location,
            checkout().url,
        );

        if (isPricingCta) {
            trackConversion(location);
        }
    };

    return (
        <Link
            href={checkout()}
            onClick={handleClick}
            className={cn(
                'inline-flex items-center justify-center gap-2 rounded-2xl px-8 py-4 text-center text-base font-bold transition-all active:translate-y-0 active:scale-[0.98]',
                variant === 'gradient' &&
                    'bg-gradient-to-br from-lp-primary to-lp-primary-2 text-white shadow-[0_16px_32px_-12px_oklch(0.62_0.20_224/0.6)] hover:-translate-y-0.5 hover:shadow-[0_22px_44px_-12px_oklch(0.62_0.20_224/0.7)]',
                variant === 'white' &&
                    'bg-white text-lp-primary-2 hover:-translate-y-0.5',
                className,
            )}
        >
            {children}
        </Link>
    );
}
