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
        <section ref={ref} id="pricing" className="bg-lp-bg">
            <div className="mx-auto max-w-lg px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto" tone="amber">
                        Early Bird
                    </Eyebrow>

                    <h2 className="mt-4 text-3xl font-extrabold tracking-tight text-lp-text sm:text-[34px]">
                        Investasi Terbaik buat Funnel Kamu
                    </h2>
                </div>

                <div className="mt-8 overflow-hidden rounded-[22px] border border-lp-border bg-lp-bg-elevated">
                    <div className="p-7 sm:p-9">
                        <p className="font-mono text-[11px] tracking-widest text-lp-text-dim uppercase">
                            Yang Kamu Dapatkan
                        </p>
                        <ul className="mt-4.5 flex flex-col gap-1">
                            {INCLUDES.map((item) => (
                                <li
                                    key={item}
                                    className="flex gap-3 py-2.5 text-[15px] text-lp-text"
                                >
                                    <Check
                                        className="mt-0.5 h-4 w-4 shrink-0 text-lp-primary-ink"
                                        strokeWidth={3}
                                    />
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="bg-gradient-to-br from-lp-primary to-lp-primary-2 p-7 text-center sm:p-9">
                        <p className="text-[13px] text-white/85 line-through">
                            Harga Normal Rp399.000
                        </p>
                        <p className="mt-1.5 text-[13px] text-white/90">
                            Harga Early Bird
                        </p>
                        <p className="mt-1 text-5xl font-extrabold text-white">
                            Rp129.000
                        </p>

                        <div className="mt-5 border-t border-white/25 pt-5">
                            <p className="font-mono text-[10.5px] tracking-wide text-white/80 uppercase">
                                Harga early bird ini terasa lebih mendesak dalam
                            </p>
                            <div className="mt-2.5">
                                <CountdownTimer />
                            </div>
                        </div>

                        <div className="mt-6">
                            <CtaButton
                                location="pricing_cta"
                                isPricingCta
                                variant="white"
                                className="w-full"
                            >
                                Amankan Harga Early Bird, Rp129.000
                            </CtaButton>
                        </div>
                        <p className="mt-3.5 text-xs text-white/75">
                            Pembayaran aman, konfirmasi otomatis lewat email.
                        </p>
                    </div>
                </div>

                <p className="mt-5 text-center text-[13.5px] text-lp-text-dim">
                    Audit personal ini juga bisa jadi langkah awal kalau kamu
                    butuh bantuan lebih lanjut menggarap funnel kamu.
                </p>
            </div>
        </section>
    );
}
