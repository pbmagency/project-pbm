import { Link } from '@inertiajs/react';
import { Shield, Star, Users } from 'lucide-react';
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
    /**
     * Tampilkan trust badges di bawah button.
     * Default false — set true di semua section kecuali hero.
     */
    showTrustBadges?: boolean;
}

const TRUST_BADGES = [
    { icon: Users, label: 'Dipercaya 100+ Bisnis' },
    { icon: Star, label: 'Rating 4.9/5' },
    { icon: Shield, label: 'Garansi 100%' },
] as const;

export function CtaButton({
    location,
    children,
    className,
    isPricingCta = false,
    variant = 'gradient',
    showTrustBadges = false,
}: CtaButtonProps) {
    const { trackCTA } = useAnalytics();

    const handleClick = () => {
        const destinationStr = isPricingCta
            ? (checkout() as any).url || checkout()
            : '#pricing';
        trackCTA(
            location,
            typeof children === 'string' ? children : location,
            destinationStr,
        );
    };

    const buttonClass = cn(
        'group relative inline-flex items-center justify-center gap-2 overflow-hidden rounded-2xl px-8 py-4 text-center text-base font-bold transition-all active:translate-y-0 active:scale-[0.98]',
        variant === 'gradient' &&
            'bg-gradient-to-br from-lp-primary via-lp-primary to-lp-primary-2 text-white shadow-[0_16px_32px_-12px_oklch(0.62_0.20_224/0.6)] hover:-translate-y-0.5',
        variant === 'white' &&
            'bg-white text-lp-primary-2 shadow-[0_16px_40px_-14px_rgba(255,255,255,0.55)] hover:-translate-y-0.5',
        className,
    );

    return (
        <div className="flex flex-col items-center gap-3">
            {isPricingCta ? (
                <Link
                    href={checkout() as any}
                    onClick={handleClick}
                    className={buttonClass}
                >
                    {children}
                </Link>
            ) : (
                <a
                    href="#pricing"
                    onClick={handleClick}
                    className={buttonClass}
                >
                    {children}
                </a>
            )}

            {showTrustBadges && (
                <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5">
                    {TRUST_BADGES.map(({ icon: Icon, label }, i) => (
                        <span
                            key={label}
                            className="flex items-center gap-1.5 text-[12px] font-medium text-lp-text-dim"
                        >
                            {/* {i > 0 && (
                                <span className="h-3 w-px bg-lp-border-soft" aria-hidden="true" />
                            )} */}
                            <Icon className="h-3 w-3 shrink-0 text-lp-primary-ink" />
                            {label}
                        </span>
                    ))}
                </div>
            )}
        </div>
    );
}