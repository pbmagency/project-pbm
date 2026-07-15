/**
 * SocialProofBar — strip logo brand di bawah hero.
 * Isi 6 logo dengan placeholder; ganti src ke path asli saat aset tersedia.
 */
export function SocialProofBar() {
    const LOGOS = [
        { id: 'brand-1', src: '/images/brands/brand1.webp', alt: 'Brand 1' },
        { id: 'brand-2', src: '/images/brands/brand2.webp', alt: 'Brand 2' },
        { id: 'brand-3', src: '/images/brands/brand3.webp', alt: 'Brand 3' },
        { id: 'brand-4', src: '/images/brands/brand4.webp', alt: 'Brand 4' },
        { id: 'brand-5', src: '/images/brands/brand5.webp', alt: 'Brand 5' },
    ];

    return (
        <section className="relative border-b border-lp-border-soft py-8 sm:py-10">
            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                {/* Label */}
                <p className="mb-6 text-center font-mono text-[11px] tracking-[0.2em] text-lp-text-dim uppercase">
                    Dipercaya oleh business owner
                </p>

                {/* Logo grid */}
                <div className="grid grid-cols-3 items-center gap-x-6 gap-y-5 sm:grid-cols-6 sm:gap-x-8">
                    {LOGOS.map((logo) => (
                        <div
                            key={logo.id}
                            className="flex items-center justify-center opacity-50 grayscale transition-all duration-300 hover:opacity-80 hover:grayscale-0"
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-7 max-w-[90px] object-contain sm:h-8"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
