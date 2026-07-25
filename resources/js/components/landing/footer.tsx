import { Link } from '@inertiajs/react';

export function Footer() {
    const year = new Date().getFullYear();

    return (
        <footer className="border-t border-lp-border-soft bg-lp-bg px-4 py-8 sm:px-6">
            <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 text-sm text-lp-text-dim sm:flex-row">
                <span className="font-bold text-lp-text">PBM Agency</span>

                <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
                    <Link
                        href="/terms"
                        className="transition-colors hover:text-lp-text"
                    >
                        Terms & Conditions
                    </Link>
                    <Link
                        href="/refund"
                        className="transition-colors hover:text-lp-text"
                    >
                        Refund Policy
                    </Link>
                    <a
                        href="https://pbmagency.id"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="transition-colors hover:text-lp-text"
                    >
                        pbmagency.id
                    </a>
                </div>

                <span className="font-mono text-xs">
                    &copy; {year} PBM Agency
                </span>
            </div>
        </footer>
    );
}