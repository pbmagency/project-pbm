import { CtaButton } from '@/components/landing/cta-button';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-lp-border-soft bg-lp-bg/70 backdrop-blur-xl">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <span className="flex items-center gap-1 font-display text-xl font-bold tracking-tight text-lp-text">
                    PBM
                    <span className="relative inline-flex h-2 w-2">
                        <span className="absolute inset-0 rounded-full bg-lp-primary-ink blur-[6px]" />
                        <span className="relative inline-flex h-2 w-2 rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2" />
                    </span>
                </span>

                <CtaButton
                    location="navbar_primary"
                    className="px-5 py-2.5 text-sm"
                >
                    Amankan Seat
                </CtaButton>
            </div>
        </header>
    );
}
