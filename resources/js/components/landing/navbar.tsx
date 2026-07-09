import { CtaButton } from '@/components/landing/cta-button';

export function Navbar() {
    return (
        <header className="sticky top-0 z-50 border-b border-lp-border-soft bg-lp-bg/85 backdrop-blur-md">
            <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6">
                <span className="text-xl font-bold tracking-tight text-lp-text">
                    PBM<span className="text-lp-primary-ink">.</span>
                </span>

                <CtaButton
                    location="navbar_primary"
                    className="px-5 py-2.5 text-sm"
                >
                    Daftar Webinar
                </CtaButton>
            </div>
        </header>
    );
}
