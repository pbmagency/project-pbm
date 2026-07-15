/**
 * SocialProofBar — strip logo brand di bawah hero.
 * Isi 4 logo dengan placeholder; ganti src ke path asli saat aset tersedia.
 */
export function SocialProofBar() {
    const LOGOS = [
        { id: 'brand-1', src: '/images/brands/brand12.webp', alt: 'Brand 1' },
        { id: 'brand-2', src: '/images/brands/brand6.webp', alt: 'Brand 2' },
        { id: 'brand-3', src: '/images/brands/brand3.webp', alt: 'Brand 3' },
        { id: 'brand-4', src: '/images/brands/brand5.webp', alt: 'Brand 4' },
    ];

    return (
        <section className="relative border-b border-lp-border-soft py-8 sm:py-10">
            <div className="relative mx-auto max-w-5xl px-4 sm:px-6">
                {/* Label */}
                <p className="mb-8 text-center font-mono text-[11px] tracking-[0.2em] text-lp-text-dim uppercase">
                    Dipercaya oleh business owner
                </p>

                {/* Logo flex container (centers exactly 4 logos beautifully) */}
                <div className="flex flex-wrap items-center justify-center gap-x-10 gap-y-8 sm:gap-x-16 md:gap-x-20">
                    {LOGOS.map((logo) => (
                        <div
                            key={logo.id}
                            className="flex items-center justify-center opacity-60 grayscale transition-all duration-300 hover:opacity-100 hover:grayscale-0"
                        >
                            <img
                                src={logo.src}
                                alt={logo.alt}
                                className="h-10 max-w-[120px] object-contain sm:h-12 sm:max-w-[150px]"
                                loading="lazy"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}