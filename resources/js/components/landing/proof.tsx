import { ArrowRight, ImageIcon, Play } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const STATS = [
    { label: 'Purchase Rate Awal', value: '1,48%', highlight: false },
    { label: 'Setelah ~1 Bulan', value: '2,6%', highlight: true },
    { label: 'Kenaikan Relatif', value: '~75%', highlight: false },
];

export function Proof() {
    const ref = useSectionView<HTMLElement>('proof');

    return (
        <section ref={ref} className="border-b border-lp-border-soft bg-lp-bg">
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto">Studi Kasus Nyata</Eyebrow>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl">
                        Bukan Sekadar Teori
                    </h2>
                    <p className="mx-auto mt-4 max-w-[58ch] text-lg text-lp-text-muted">
                        Metodologi yang dibahas di webinar ini bukan teori di
                        atas kertas. Ini yang dipakai langsung ke klien kami
                        sendiri, diuji lewat split test yang berjalan bersamaan,
                        bukan cuma gonta ganti halaman satu per satu.
                    </p>
                </div>

                <div className="mt-10 rounded-[22px] border border-lp-border bg-lp-bg-elevated p-5 sm:p-7">
                    <p className="font-mono text-[11.5px] tracking-wide text-lp-text-dim uppercase">
                        Studi Kasus &middot; Industri Edukasi (Identitas
                        Dirahasiakan)
                    </p>

                    <div className="mt-4.5 flex items-center gap-3.5">
                        <div className="min-w-0 flex-1">
                            {/* Placeholder: owner will supply the real before landing page screenshot. */}
                            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-lp-border bg-lp-bg-elevated-2 text-center">
                                <ImageIcon className="h-7 w-7 text-lp-text-dim" />
                                <span className="px-2 text-xs text-lp-text-dim">
                                    Landing page sebelum
                                </span>
                            </div>
                            <p className="mt-2 text-center font-mono text-[11px] tracking-wide text-lp-text-dim uppercase">
                                Sebelum
                            </p>
                        </div>
                        <ArrowRight className="h-6 w-6 shrink-0 text-lp-primary-ink" />
                        <div className="min-w-0 flex-1">
                            {/* Placeholder: owner will supply the real after landing page screenshot. */}
                            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-lp-border bg-lp-bg-elevated-2 text-center">
                                <ImageIcon className="h-7 w-7 text-lp-text-dim" />
                                <span className="px-2 text-xs text-lp-text-dim">
                                    Landing page sesudah
                                </span>
                            </div>
                            <p className="mt-2 text-center font-mono text-[11px] tracking-wide text-lp-text-dim uppercase">
                                Sesudah
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 flex flex-wrap justify-center gap-3">
                        {STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className={
                                    stat.highlight
                                        ? 'flex-1 basis-[140px] rounded-[14px] border border-lp-primary bg-lp-primary-soft p-4 text-center font-mono'
                                        : 'flex-1 basis-[140px] rounded-[14px] border border-lp-border bg-lp-bg p-4 text-center font-mono'
                                }
                            >
                                <div className="text-[11px] tracking-wide text-lp-text-dim uppercase">
                                    {stat.label}
                                </div>
                                <div className="mt-1.5 text-2xl font-bold text-lp-text">
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-3.5 max-w-[60ch] text-center text-[13px] text-lp-text-dim">
                        Diuji lewat split test yang berjalan bersamaan. Pola
                        konsisten, bukan jaminan hasil untuk setiap bisnis.
                        Sampel studi kasus ini masih terbatas.
                    </p>
                </div>

                {/* Placeholder: owner will supply the real video testimonial. */}
                <div className="mt-7 rounded-[22px] border border-lp-border bg-lp-bg-elevated p-3">
                    <div className="relative flex aspect-video items-center justify-center rounded-[14px] bg-lp-bg-elevated-2">
                        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lp-bg/70 ring-1 ring-white/20">
                            <Play
                                className="ml-1 h-6 w-6 text-white"
                                fill="currentColor"
                            />
                        </div>
                    </div>
                </div>
                <p className="mt-3 text-center font-mono text-[11.5px] tracking-wide text-lp-text-dim uppercase">
                    Video Testimoni &middot; Menyusul
                </p>
            </div>
        </section>
    );
}
