import { Rocket, TrendingUp, Zap } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Mentor() {
    const ref = useSectionView<HTMLElement>('mentor');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-lp-amber/12 blur-[130px]" />

            <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow>Tentang Pembicara</Eyebrow>

                <div className="mt-8 flex flex-wrap items-center gap-8 sm:gap-12">
                    <div className="relative w-44 shrink-0">
                        <div className="absolute -inset-2 rounded-[24px] bg-gradient-to-br from-lp-amber via-lp-primary-2 to-lp-primary opacity-60 blur-lg" />
                        <div className="relative rounded-[22px] bg-gradient-to-br from-lp-amber/50 to-lp-primary-2/30 p-[2px]">
                            <div className="flex aspect-square items-center justify-center rounded-[20px] bg-gradient-to-br from-lp-bg-elevated-2 to-lp-bg text-4xl font-extrabold tracking-tight text-lp-text">
                                <span className="bg-gradient-to-br from-lp-amber-ink via-lp-text to-lp-primary-ink bg-clip-text text-transparent">
                                    JW
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="min-w-[260px] flex-1 basis-[320px]">
                        <h2 className="text-4xl font-extrabold tracking-tight text-lp-text sm:text-5xl">
                            Justin Wijaya
                        </h2>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] text-lp-text-muted">
                            19 tahun, mahasiswa aktif di Binus dengan latar
                            belakang IT. Justin udah terjun ke dunia digital
                            business sejak umur 14 tahun, dan lima tahun
                            terakhir berkecimpung penuh sebagai entrepreneur
                            sekaligus content creator. Dari situ, Justin paham
                            betul cara bikin landing page yang bukan cuma enak
                            dilihat, tapi juga benar benar menjual.
                        </p>

                        <div className="mt-6 flex flex-wrap gap-2.5">
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border bg-lp-bg/60 px-4 py-2.5 backdrop-blur-sm">
                                <Zap className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Latar Belakang IT
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border bg-lp-bg/60 px-4 py-2.5 backdrop-blur-sm">
                                <Rocket className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Digital Business Sejak Umur 14
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border bg-lp-bg/60 px-4 py-2.5 backdrop-blur-sm">
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Founder PBM Agency
                                </span>
                            </div>
                            <div className="lp-glow-amber flex items-center gap-2 rounded-2xl border border-lp-amber bg-gradient-to-br from-lp-amber-soft to-lp-amber-soft/50 px-4 py-2.5">
                                <TrendingUp className="h-4 w-4 shrink-0 text-lp-amber-ink" />
                                <span className="text-base font-bold text-lp-amber-ink">
                                    1,5x sampai 2x
                                </span>
                                <span className="text-[13px] text-lp-text">
                                    kenaikan konversi
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                <p className="mt-7 text-[13.5px] text-lp-text-dim">
                    Klaim umum berdasarkan rekam jejak kerja sama dengan
                    berbagai klien, sudah membantu banyak pemilik bisnis
                    menaikkan konversi 1,5 sampai 2 kali lipat, dari trafik
                    iklan berbayar maupun organik.
                </p>
            </div>
        </section>
    );
}
