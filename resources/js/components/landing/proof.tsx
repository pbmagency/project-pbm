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
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
        >
            <div className="pointer-events-none absolute top-1/2 right-0 h-96 w-96 -translate-y-1/2 rounded-full bg-lp-primary-2/15 blur-[140px]" />

            <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto">Studi Kasus Nyata</Eyebrow>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                        Bukan Sekadar{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Teori
                        </span>
                    </h2>
                    <p className="mx-auto mt-5 max-w-[58ch] text-lg text-lp-text-muted">
                        Metodologi yang dibahas di webinar ini bukan teori di
                        atas kertas. Ini yang dipakai langsung ke klien kami
                        sendiri, diuji lewat split test yang berjalan bersamaan,
                        bukan cuma gonta ganti halaman satu per satu.
                    </p>
                </div>

                <div className="lp-gradient-border lp-gradient-border-inner mt-12 rounded-[24px] bg-lp-bg-elevated/70 p-5 backdrop-blur-sm sm:p-7">
                    <p className="font-mono text-[11.5px] tracking-[0.15em] text-lp-text-dim uppercase">
                        Studi Kasus &middot; Industri Edukasi (Identitas
                        Dirahasiakan)
                    </p>

                    <div className="mt-5 flex items-center gap-3.5">
                        <div className="min-w-0 flex-1">
                            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-lp-border bg-lp-bg-elevated-2/60 text-center">
                                <ImageIcon className="h-7 w-7 text-lp-text-dim" />
                                <span className="px-2 text-xs text-lp-text-dim">
                                    Landing page sebelum
                                </span>
                            </div>
                            <p className="mt-2 text-center font-mono text-[11px] tracking-[0.14em] text-lp-text-dim uppercase">
                                Sebelum
                            </p>
                        </div>
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_8px_24px_-4px_oklch(0.62_0.20_224/0.7)]">
                            <ArrowRight
                                className="h-5 w-5 text-white"
                                strokeWidth={2.5}
                            />
                        </div>
                        <div className="min-w-0 flex-1">
                            <div className="flex aspect-4/3 flex-col items-center justify-center gap-2 rounded-[14px] border-2 border-dashed border-lp-primary/40 bg-lp-primary-soft/40 text-center">
                                <ImageIcon className="h-7 w-7 text-lp-primary-ink" />
                                <span className="px-2 text-xs text-lp-text-dim">
                                    Landing page sesudah
                                </span>
                            </div>
                            <p className="mt-2 text-center font-mono text-[11px] tracking-[0.14em] text-lp-primary-ink uppercase">
                                Sesudah
                            </p>
                        </div>
                    </div>

                    <div className="mt-7 flex flex-wrap justify-center gap-3">
                        {STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className={
                                    stat.highlight
                                        ? 'lp-glow relative flex-1 basis-[140px] overflow-hidden rounded-[16px] border border-lp-primary/60 bg-gradient-to-br from-lp-primary/25 to-lp-primary-2/15 p-4 text-center font-mono'
                                        : 'flex-1 basis-[140px] rounded-[16px] border border-lp-border bg-lp-bg/60 p-4 text-center font-mono'
                                }
                            >
                                <div className="text-[11px] tracking-[0.14em] text-lp-text-dim uppercase">
                                    {stat.label}
                                </div>
                                <div
                                    className={
                                        stat.highlight
                                            ? 'mt-1.5 bg-gradient-to-br from-white to-lp-primary-ink bg-clip-text text-3xl font-extrabold text-transparent'
                                            : 'mt-1.5 text-2xl font-bold text-lp-text'
                                    }
                                >
                                    {stat.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mx-auto mt-4 max-w-[60ch] text-center text-[13px] text-lp-text-dim">
                        Diuji lewat split test yang berjalan bersamaan. Pola
                        konsisten, bukan jaminan hasil untuk setiap bisnis.
                        Sampel studi kasus ini masih terbatas.
                    </p>
                </div>

                <div className="lp-gradient-border lp-gradient-border-inner mt-7 rounded-[22px] bg-lp-bg-elevated/70 p-3 backdrop-blur-sm">
                    <div className="relative flex aspect-video items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-br from-lp-bg-elevated-2 to-lp-bg">
                        <div className="pointer-events-none absolute inset-0 bg-lp-dots opacity-30" />
                        <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_16px_40px_-8px_oklch(0.62_0.20_224/0.7)] ring-4 ring-white/10">
                            <Play
                                className="ml-1 h-6 w-6 text-white"
                                fill="currentColor"
                            />
                        </div>
                    </div>
                </div>
                <p className="mt-3 text-center font-mono text-[11.5px] tracking-[0.15em] text-lp-text-dim uppercase">
                    Video Testimoni &middot; Menyusul
                </p>
            </div>
        </section>
    );
}
