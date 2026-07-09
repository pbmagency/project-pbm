import { Rocket, TrendingUp, Zap } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Mentor() {
    const ref = useSectionView<HTMLElement>('mentor');

    return (
        <section
            ref={ref}
            className="border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow>Tentang Pembicara</Eyebrow>

                <div className="mt-7 flex flex-wrap items-center gap-8 sm:gap-12">
                    <div className="w-40 shrink-0 rounded-[20px] bg-lp-amber/40 p-2.5">
                        <div className="flex aspect-square items-center justify-center rounded-[14px] bg-lp-bg-elevated-2 text-3xl font-bold text-lp-text">
                            JW
                        </div>
                    </div>

                    <div className="min-w-[260px] flex-1 basis-[320px]">
                        <h2 className="text-3xl font-extrabold text-lp-text">
                            Justin Wijaya
                        </h2>
                        <p className="mt-2.5 max-w-[52ch] text-[15.5px] text-lp-text-muted">
                            19 tahun, mahasiswa aktif di Binus dengan latar
                            belakang IT. Justin udah terjun ke dunia digital
                            business sejak umur 14 tahun, dan lima tahun
                            terakhir berkecimpung penuh sebagai entrepreneur
                            sekaligus content creator. Dari situ, Justin paham
                            betul cara bikin landing page yang bukan cuma enak
                            dilihat, tapi juga benar benar menjual.
                        </p>

                        <div className="mt-5 flex flex-wrap gap-3">
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border px-4 py-2.5">
                                <Zap className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Latar Belakang IT
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border px-4 py-2.5">
                                <Rocket className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Digital Business Sejak Umur 14
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-border px-4 py-2.5">
                                <span className="text-[13.5px] font-semibold text-lp-text">
                                    Founder PBM Agency
                                </span>
                            </div>
                            <div className="flex items-center gap-2 rounded-2xl border border-lp-amber bg-lp-amber-soft px-4 py-2.5">
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

                <p className="mt-6 text-[13.5px] text-lp-text-dim">
                    Klaim umum berdasarkan rekam jejak kerja sama dengan
                    berbagai klien, sudah membantu banyak pemilik bisnis
                    menaikkan konversi 1,5 sampai 2 kali lipat, dari trafik
                    iklan berbayar maupun organik.
                </p>
            </div>
        </section>
    );
}
