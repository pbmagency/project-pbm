import { Check } from 'lucide-react';
import { CountdownTimer } from '@/components/landing/countdown-timer';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const INCLUDES = [
    'Live Session & Rekaman Webinar "The Silent Conversion Leak"',
    'Ebook "Iklan Sudah Jalan, Tapi Kok Tetap Boncos?"',
    'Kesempatan Tanya Jawab Langsung dengan Justin Wijaya',
    'Personal Funnel Audit Gratis Setelah Webinar',
];

export function Pricing() {
    const ref = useSectionView<HTMLElement>('pricing');

    return (
        <section
            ref={ref}
            id="pricing"
            className="relative overflow-hidden bg-lp-bg"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-lp-primary-2/25 blur-[150px]" />
                <div className="absolute inset-0 bg-lp-grid opacity-40" />
            </div>

            <div className="relative mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto" tone="amber">
                        Early Bird
                    </Eyebrow>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-[38px]">
                        Investasi Terbaik buat{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Funnel Kamu
                        </span>
                    </h2>
                </div>

                <div className="relative mt-10">
                    <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-amber opacity-40 blur-2xl" />

                    <div className="lp-gradient-border lp-gradient-border-inner relative overflow-hidden rounded-[24px] bg-lp-bg-elevated shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
                        <div className="p-7 sm:p-9">
                            <p className="font-mono text-[11px] tracking-[0.16em] text-lp-text-dim uppercase">
                                Yang Kamu Dapatkan
                            </p>
                            <ul className="mt-5 flex flex-col gap-1">
                                {INCLUDES.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 py-2.5 text-[15px] text-lp-text"
                                    >
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_4px_10px_-2px_oklch(0.62_0.20_224/0.6)]">
                                            <Check
                                                className="h-3 w-3 text-white"
                                                strokeWidth={3}
                                            />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative overflow-hidden bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-primary-2 p-7 text-center sm:p-9">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-40"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.18), transparent 50%)',
                                }}
                            />

                            <div className="relative">
                                <p className="text-[13px] text-white/80 line-through">
                                    Harga Normal Rp399.000
                                </p>
                                <p className="mt-1.5 font-mono text-[11px] tracking-[0.18em] text-white/90 uppercase">
                                    Harga Early Bird
                                </p>
                                <p className="mt-2 text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                    Rp129.000
                                </p>

                                <div className="mt-6 border-t border-white/25 pt-5">
                                    <p className="font-mono text-[10.5px] tracking-[0.14em] text-white/80 uppercase">
                                        Harga early bird ini terasa lebih
                                        mendesak dalam
                                    </p>
                                    <div className="mt-3">
                                        <CountdownTimer />
                                    </div>
                                </div>

                                <div className="mt-7">
                                    <CtaButton
                                        location="pricing_cta"
                                        isPricingCta
                                        variant="white"
                                        className="w-full"
                                    >
                                        Amankan Harga Early Bird, Rp129.000
                                    </CtaButton>
                                </div>
                                <p className="mt-3.5 text-xs text-white/80">
                                    Pembayaran aman, konfirmasi otomatis lewat
                                    email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-6 text-center text-[13.5px] text-lp-text-dim">
                    Audit personal ini juga bisa jadi langkah awal kalau kamu
                    butuh bantuan lebih lanjut menggarap funnel kamu.
                </p>
            </div>
        </section>
    );
}
