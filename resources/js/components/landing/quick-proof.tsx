import * as DialogPrimitive from '@radix-ui/react-dialog';
import { Expand, Info, MessageCircle, TrendingUp, X } from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useState } from 'react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

interface ProofCard {
    id: string;
    label: string;
    icon: LucideIcon;
    badge?: string;
    aspect: string;
    src: string;
    alt: string;
}

const CARDS: ProofCard[] = [
    {
        id: 'wa-testimoni',
        label: 'Dulu konversi seret, sekarang purchase lebih maksimal',
        icon: MessageCircle,
        aspect: 'aspect-[3/4]',
        // TODO: ganti src dengan URL screenshot testimoni WhatsApp yang asli
        src: '/public/images/testimonials/fullbright.webp',
        alt: 'Screenshot testimoni WhatsApp pelanggan',
    },
    {
        id: 'ab-labs-dashboard',
        label: 'Dashboard A/B Labs Kami',
        icon: TrendingUp,
        badge: '+32% Lead dalam 1 Minggu',
        aspect: 'aspect-[2/1]',
        // TODO: ganti src dengan URL screenshot dashboard A/B Labs yang asli
        src: '/public/images/testimonials/before-after.webp',
        alt: 'Screenshot dashboard A/B Labs sebelum dan sesudah',
    },
];

function ImageFrame({ card }: { card: ProofCard; large?: boolean }) {
    return (
        <div
            className={`relative ${card.aspect} overflow-hidden rounded-2xl border border-lp-border`}
        >
            <img
                src={card.src}
                alt={card.alt}
                className="h-full w-full object-contain object-center"
                loading="lazy"
            />
        </div>
    );
}

export function QuickProof() {
    const ref = useSectionView<HTMLElement>('trust');
    const [openId, setOpenId] = useState<string | null>(null);
    const activeCard = CARDS.find((c) => c.id === openId) ?? null;

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
        >
            <div className="pointer-events-none absolute top-0 left-1/2 h-72 w-72 -translate-x-1/2 rounded-full bg-lp-primary/10 blur-[130px]" />

            <div className="relative mx-auto max-w-4xl px-4 py-14 sm:px-6 sm:py-20">
                <div className="text-center">
                    {/* <Eyebrow className="mx-auto">Bukti Nyata</Eyebrow> */}
                    <h2 className="mt-5 font-display text-2xl font-extrabold tracking-tight text-lp-text sm:text-3xl">
                        Materi Yang Terbukti{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Meningkatkan Konversi
                        </span>
                    </h2>
                </div>

                <div className="mt-8 grid gap-5 sm:grid-cols-2">
                    {CARDS.map((card) => (
                        <button
                            key={card.id}
                            type="button"
                            onClick={() => setOpenId(card.id)}
                            className="group lp-gradient-border-inner lp-gradient-border rounded-[24px] bg-lp-bg-elevated/70 p-4 text-left backdrop-blur-sm transition-transform hover:-translate-y-1"
                        >
                            <div className="relative">
                                <ImageFrame card={card} />
                                <div className="absolute top-2 right-2 rounded-full bg-black/40 p-1.5 backdrop-blur-sm">
                                    <Expand className="h-3.5 w-3.5 text-white/70 transition-colors group-hover:text-white" />
                                </div>
                            </div>

                            {card.badge && (
                                <div className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-lp-amber/40 bg-lp-amber-soft px-3 py-1.5 font-mono text-xs font-bold text-lp-amber-ink">
                                    <TrendingUp className="h-3 w-3" />
                                    {card.badge}
                                </div>
                            )}

                            <p className="mt-3 text-center text-sm leading-snug font-semibold text-lp-text">
                                {card.label}
                            </p>
                        </button>
                    ))}
                </div>

                {/* Info box: klarifikasi konteks bukti */}
                {/* <div className="mt-6 flex gap-3 rounded-2xl border border-lp-primary/20 bg-lp-primary/5 px-4 py-4">
                    <Info className="mt-0.5 h-4 w-4 shrink-0 text-lp-primary-ink" />
                    <p className="text-sm leading-relaxed text-lp-text-dim">
                        <span className="font-semibold text-lp-text">Ini bukan hasil alumni webinar.</span>{' '}
                        Bukti di atas adalah keberhasilan metode &amp; framework yang saya gunakan langsung
                        di client agency saya — dan inilah yang akan saya ajarkan kepada Anda di webinar ini.
                    </p>
                </div> */}
            </div>

            <DialogPrimitive.Root
                open={activeCard !== null}
                onOpenChange={(open) => !open && setOpenId(null)}
            >
                <DialogPrimitive.Portal>
                    <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:animate-in data-[state=open]:fade-in-0" />
                    <DialogPrimitive.Content className="fixed top-1/2 left-1/2 z-50 w-[calc(100%-2rem)] max-w-xl -translate-x-1/2 -translate-y-1/2 rounded-[24px] border border-lp-border bg-lp-bg-elevated p-5 shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)] duration-200 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95">
                        {activeCard && (
                            <>
                                <div className="flex items-center justify-end">
                                    <DialogPrimitive.Title className="sr-only">
                                        {activeCard.label}
                                    </DialogPrimitive.Title>
                                    <DialogPrimitive.Close className="rounded-full p-1.5 text-lp-text-dim transition-colors hover:bg-lp-bg-elevated-2 hover:text-lp-text focus:outline-none">
                                        <X className="h-4 w-4" />
                                        <span className="sr-only">Tutup</span>
                                    </DialogPrimitive.Close>
                                </div>

                                <div className="mt-2">
                                    <ImageFrame card={activeCard} large />
                                </div>

                                {activeCard.badge && (
                                    <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-lp-amber/40 bg-lp-amber-soft px-3 py-1.5 font-mono text-xs font-bold text-lp-amber-ink">
                                        <TrendingUp className="h-3 w-3" />
                                        {activeCard.badge}
                                    </div>
                                )}

                                <p className="mt-3 text-center text-sm leading-snug font-semibold text-lp-text">
                                    {activeCard.label}
                                </p>
                            </>
                        )}
                    </DialogPrimitive.Content>
                </DialogPrimitive.Portal>
            </DialogPrimitive.Root>
        </section>
    );
}
