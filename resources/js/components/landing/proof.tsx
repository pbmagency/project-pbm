import { ArrowDown, ArrowRight, Expand, X, ZoomIn } from 'lucide-react';
import { useState } from 'react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';
import { CtaButton } from '@/components/landing/cta-button';

const STATS = [
    { label: 'Conversion Rate Awal', value: '1,58%', highlight: false },
    { label: 'Setelah 1 Bulan', value: '2,91%', highlight: true },
    { label: 'Kenaikan', value: '84%', highlight: false },
];

const BEFORE_AFTER = [
    {
        id: 'before',
        label: 'Sebelum',
        // TODO: ganti src dengan screenshot before yang asli
        src: '/storage/public/study-case/before.webp',
        alt: 'Data konversi sebelum optimasi',
        labelClass: 'text-lp-text-dim',
        borderClass: 'border-lp-border',
    },
    {
        id: 'after',
        label: 'Sesudah',
        // TODO: ganti src dengan screenshot after yang asli
        src: '/storage/public/study-case/after.webp',
        alt: 'Data konversi sesudah optimasi',
        labelClass: 'text-lp-primary-ink',
        borderClass: 'border-lp-primary/50',
    },
];

function ImageCard({
    item,
    onClick,
}: {
    item: (typeof BEFORE_AFTER)[number];
    onClick: () => void;
}) {
    return (
        <div className="flex flex-col gap-2">
            <button
                type="button"
                onClick={onClick}
                className={`group lp-gradient-border-inner lp-gradient-border relative overflow-hidden rounded-[20px] p-[2px]`}
                aria-label={`Lihat fullscreen: ${item.label}`}
            >
                <div className="overflow-hidden rounded-[18px]">
                    <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                        <img
                            src={item.src}
                            alt={item.alt}
                            className="absolute inset-0 h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                            loading="lazy"
                        />
                        {/* Zoom hint overlay */}
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-200 group-hover:opacity-100">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black/60 backdrop-blur-sm">
                                <ZoomIn className="h-5 w-5 text-white" />
                            </div>
                        </div>
                    </div>
                </div>
            </button>
            {/* <p
                className={`text-center font-mono text-[11px] tracking-[0.14em] uppercase ${item.labelClass}`}
            >
                {item.label}
            </p> */}
        </div>
    );
}

export function Proof() {
    const ref = useSectionView<HTMLElement>('proof');
    const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
    const [lightboxAlt, setLightboxAlt] = useState<string>('');

    const openLightbox = (src: string, alt: string) => {
        setLightboxSrc(src);
        setLightboxAlt(alt);
    };

    const closeLightbox = () => setLightboxSrc(null);

    return (
        <>
            <section
                ref={ref}
                className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
            >
                <div className="pointer-events-none absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-lp-primary-2/15 blur-[140px]" />

                <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                    <div className="text-center">
                        <Eyebrow className="mx-auto">Studi Kasus</Eyebrow>

                        <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                            Apa Kata{' '}
                            <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                                Mereka
                            </span>
                        </h2>
                        <p className="mx-auto mt-5 max-w-[58ch] text-lg text-lp-text-muted">
                            Studi kasus di bawah ini hasil kerja PBM Agency.
                            Mindset dan strategi-nya sama persis dengan yang
                            bakal kamu dapetin di webinar ini.
                        </p>
                    </div>

                    <div className="lp-gradient-border-inner lp-gradient-border mt-7 overflow-hidden rounded-[22px] bg-lp-bg-elevated/70 p-3 backdrop-blur-sm">
                        <div
                            className="overflow-hidden rounded-[14px]"
                            style={{
                                position: 'relative',
                                paddingTop: '56.25%',
                            }}
                        >
                            <iframe
                                src="https://player.mediadelivery.net/embed/701292/9145e91d-ca23-48fc-806c-92cb383e1771?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                                loading="lazy"
                                allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                                allowFullScreen
                                style={{
                                    border: 0,
                                    position: 'absolute',
                                    top: 0,
                                    height: '100%',
                                    width: '100%',
                                }}
                            />
                        </div>
                    </div>
                    <p className="mt-3 text-center text-sm tracking-[0.15em] text-lp-text">
                        Omset Naik dari 20 juta → 30 juta per bulan setelah
                        optimasi & bedah landing page.
                    </p>
                    <p className="mt-1 text-center text-xs font-bold text-lp-text-muted">
                        Tsania Latheefa, Content Creator, 52.8K Followers
                    </p>

                    {/* ── Card Before / After ── */}
                    <div className="lp-gradient-border-inner lp-gradient-border mt-12 rounded-[24px] bg-lp-bg-elevated/70 p-3 backdrop-blur-sm sm:p-4">
                        {/* Mobile: 1 col stacked; Desktop: 2 col side by side */}
                        <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr] sm:gap-5">
                            {/* Before */}
                            <ImageCard
                                item={BEFORE_AFTER[0]}
                                onClick={() =>
                                    openLightbox(
                                        BEFORE_AFTER[0].src,
                                        BEFORE_AFTER[0].alt,
                                    )
                                }
                            />

                            {/* Arrow — bawah di mobile, kanan di desktop */}
                            <div className="flex justify-center">
                                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_8px_24px_-4px_oklch(0.62_0.20_224/0.7)]">
                                    <ArrowDown
                                        className="h-4 w-4 text-white sm:hidden"
                                        strokeWidth={2.5}
                                    />
                                    <ArrowRight
                                        className="hidden h-4 w-4 text-white sm:block"
                                        strokeWidth={2.5}
                                    />
                                </div>
                            </div>

                            {/* After */}
                            <ImageCard
                                item={BEFORE_AFTER[1]}
                                onClick={() =>
                                    openLightbox(
                                        BEFORE_AFTER[1].src,
                                        BEFORE_AFTER[1].alt,
                                    )
                                }
                            />
                        </div>
                    </div>

                    {/* ── Card Testimoni WhatsApp ── */}
                    <div className="mt-5 flex justify-center">
                        <button
                            type="button"
                            onClick={() =>
                                openLightbox(
                                    '/storage/public/testimonials/fullbright.webp',
                                    'Screenshot testimoni WhatsApp pelanggan',
                                )
                            }
                            className="group lp-gradient-border-inner lp-gradient-border w-full max-w-md rounded-[24px] bg-lp-bg-elevated/70 p-4 text-left backdrop-blur-sm transition-transform hover:-translate-y-1"
                        >
                            <div className="relative">
                                <div className="relative aspect-[3/4] overflow-hidden rounded-2xl border border-lp-border">
                                    <img
                                        src="/storage/testimonials/fullbright.jpeg"
                                        alt="Screenshot testimoni WhatsApp pelanggan"
                                        className="h-full w-full object-contain object-center"
                                        loading="lazy"
                                    />
                                </div>
                                <div className="absolute top-2 right-2 rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
                                    <Expand className="h-3.5 w-3.5 text-white/70 transition-colors group-hover:text-white" />
                                </div>
                            </div>
                            <p className="mt-3 text-center text-sm leading-snug font-semibold text-lp-text capitalize">
                                Awalnya konversi seret, setelah optimasi
                                sekarang dari Landing Page langsung checkout &
                                ROAS 5
                            </p>
                        </button>
                    </div>

                    {/* <div className="lp-gradient-border-inner lp-gradient-border mt-5 rounded-[24px] bg-lp-bg-elevated/70 p-5 backdrop-blur-sm sm:p-7">
                        <p className="font-mono text-[11.5px] tracking-[0.15em] text-lp-text-dim uppercase">
                            Studi Kasus &middot;
                        </p>

                        <div className="mt-7 flex flex-wrap justify-center gap-3">
                            {STATS.map((stat) => (
                                <div
                                    key={stat.label}
                                    className={
                                        stat.highlight
                                            ? 'relative flex-1 basis-[140px] overflow-hidden rounded-[16px] border border-lp-primary/60 bg-gradient-to-br from-lp-primary/25 to-lp-primary-2/15 p-4 text-center font-mono lp-glow'
                                            : 'flex-1 basis-[140px] rounded-[16px] border border-lp-border bg-lp-bg/60 p-4 text-center font-mono'
                                    }
                                >
                                    <div className="text-[11px] tracking-[0.14em] text-lp-text-dim uppercase">
                                        {stat.label}
                                    </div>
                                    <div
                                        className={
                                            stat.highlight
                                                ? 'mt-1.5 bg-gradient-to-br from-white to-lp-primary-ink bg-clip-text font-display text-3xl font-extrabold text-transparent'
                                                : 'mt-1.5 font-display text-2xl font-bold text-lp-text'
                                        }
                                    >
                                        {stat.value}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                    <div className="mt-8 flex flex-col items-center gap-4 lg:items-center">
                        <CtaButton location="solution_primary" showTrustBadges>
                            Amankan Seat Saya
                        </CtaButton>
                    </div>
                </div>
            </section>

            {/* ── Lightbox ── */}
            {lightboxSrc && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm"
                    onClick={closeLightbox}
                    role="dialog"
                    aria-modal="true"
                    aria-label={lightboxAlt}
                >
                    <button
                        type="button"
                        onClick={closeLightbox}
                        className="absolute top-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 focus:outline-none"
                        aria-label="Tutup"
                    >
                        <X className="h-5 w-5" />
                    </button>
                    <img
                        src={lightboxSrc}
                        alt={lightboxAlt}
                        className="max-h-[90vh] max-w-full rounded-2xl object-contain shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    />
                </div>
            )}
        </>
    );
}
