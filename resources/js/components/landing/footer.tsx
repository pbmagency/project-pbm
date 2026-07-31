import { Link, usePage } from '@inertiajs/react';

export function Footer() {
    const year = new Date().getFullYear();
    const { settings } = usePage<any>().props;

    return (
        <footer className="border-t border-lp-border-soft bg-lp-bg px-4 py-12 sm:px-6">
            <div className="mx-auto max-w-6xl">
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-12 lg:grid-cols-4">
                    {/* Brand & Address */}
                    <div className="flex flex-col gap-4 lg:col-span-2">
                        <span className="font-display text-xl font-bold text-lp-text">PBM Agency</span>
                        <p className="text-sm text-lp-text-dim max-w-xs leading-relaxed">
                            Jl. Raya Kb. Jeruk No.2, <br />
                            Kota Jakarta Barat
                        </p>
                    </div>

                    {/* Contact */}
                    <div className="flex flex-col gap-4">
                        <span className="font-semibold text-lp-text">Contact</span>
                        <div className="flex flex-col gap-2 text-sm text-lp-text-dim">
                            <a href="mailto:agencypbm@gmail.com" className="transition-colors hover:text-lp-text">
                                agencypbm@gmail.com
                            </a>
                            <a href={`https://wa.me/${settings?.wa_support_number || '6285931018333'}`} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-lp-text">
                                +{settings?.wa_support_number || '6285931018333'}
                            </a>
                        </div>
                    </div>

                    {/* Links */}
                    <div className="flex flex-col gap-4">
                        <span className="font-semibold text-lp-text">Legal</span>
                        <div className="flex flex-col gap-2 text-sm text-lp-text-dim">
                            <Link href="/terms" className="transition-colors hover:text-lp-text">
                                Terms & Conditions
                            </Link>
                            <Link href="/refund" className="transition-colors hover:text-lp-text">
                                Refund Policy
                            </Link>
                            <a href="https://pbmagency.id" target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-lp-text">
                                pbmagency.id
                            </a>
                        </div>
                    </div>
                </div>

                <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-lp-border-soft pt-8 text-sm text-lp-text-dim sm:flex-row">
                    <span className="font-mono text-xs">
                        &copy; {year} PBM Agency. All rights reserved.
                    </span>
                </div>
            </div>
        </footer>
    );
}