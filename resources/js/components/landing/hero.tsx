import { PlayCircle, Sparkles, TrendingUp } from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Hero() {
    const ref = useSectionView<HTMLElement>('hero');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft"
        >
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute -top-32 left-1/3 h-96 w-96 rounded-full bg-lp-primary/20 blur-[120px]" />
                <div className="absolute top-1/2 -right-24 h-80 w-80 rounded-full bg-lp-primary-2/25 blur-[120px]" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:gap-16 lg:py-28">
                <div className="min-w-0 flex-1 basis-[460px]">
                    <Eyebrow>Webinar Berbayar &middot; Rp129.000</Eyebrow>

                    <h1 className="mt-6 text-4xl leading-[1.08] font-extrabold tracking-tight text-lp-text sm:text-5xl lg:text-6xl">
                        Banyak yang Klik.
                        <br />
                        Dikit yang{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Beli.
                        </span>
                    </h1>

                    <p className="mt-5 max-w-[46ch] text-lg text-lp-text-muted sm:text-xl">
                        CTR bagus, CPC oke, tapi kenapa closing kamu masih flat?
                        Webinar ini buat kamu yang iklannya sudah jalan dengan
                        baik, bukan yang iklannya baru mau dites.
                    </p>

                    <div className="mt-9 flex flex-col items-start gap-4">
                        <CtaButton
                            location="hero_primary"
                            className="w-full text-lg sm:w-auto"
                        >
                            Amankan Kursi, Rp129.000
                        </CtaButton>

                        <p className="flex items-center gap-2 text-sm text-lp-text-dim">
                            <TrendingUp className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                            Dipakai bantu pemilik bisnis lain naikkan konversi
                            1,5 sampai 2 kali lipat
                        </p>
                    </div>
                </div>

                <div className="relative w-full max-w-[440px] flex-1 basis-[380px]">
                    <div className="rounded-[20px] border border-lp-border bg-lp-bg-elevated p-4 shadow-[0_30px_60px_-24px_rgba(0,0,0,0.6)]">
                        <div className="mb-3.5 flex items-center justify-between px-1">
                            <div className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-primary" />
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-amber" />
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-border" />
                            </div>
                            <span className="font-mono text-[10.5px] tracking-wider text-lp-text-dim">
                                LIVE WEBINAR
                            </span>
                        </div>
                        <div className="flex aspect-4/3 items-center justify-center rounded-xl bg-lp-bg-elevated-2">
                            <PlayCircle
                                className="h-14 w-14 text-lp-text-dim"
                                strokeWidth={1.25}
                            />
                        </div>
                    </div>

                    <div className="absolute bottom-11 -left-3 flex items-center gap-2 rounded-xl border border-lp-border bg-lp-bg-elevated-2 px-3.5 py-2.5 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)]">
                        <span className="h-2 w-2 rounded-full bg-lp-primary-ink" />
                        <span className="text-xs font-semibold whitespace-nowrap text-lp-text">
                            90 Menit Live
                        </span>
                    </div>
                    <div className="absolute top-9 -right-2.5 flex items-center gap-2 rounded-xl border border-lp-border bg-lp-bg-elevated-2 px-3.5 py-2.5 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)]">
                        <span className="text-xs font-semibold whitespace-nowrap text-lp-text">
                            Ebook Otomatis
                        </span>
                    </div>
                    <div className="absolute -right-2 -bottom-4 rounded-xl border border-lp-amber bg-lp-amber-soft px-4 py-2.5 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)]">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-lp-amber-ink uppercase">
                            <Sparkles className="h-3 w-3" />
                            Bonus
                        </div>
                        <div className="mt-0.5 text-xs font-bold whitespace-nowrap text-lp-text">
                            Audit Personal Gratis
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
