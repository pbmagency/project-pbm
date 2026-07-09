import { Eye, MousePointerClick, Radar } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';
import { cn } from '@/lib/utils';

const MODULES = [
    {
        icon: Radar,
        title: 'Modul 1',
        subtitle: 'Lapisan Akuisisi',
        metric: 'Bounce Rate',
        description:
            'Momen pertama begitu orang mendarat di halaman kamu. Kalau bermasalah di sini, biasanya karena janji di iklan gak nyambung dengan yang mereka lihat pertama kali, atau soal teknis, seperti loading yang lambat.',
        amber: false,
    },
    {
        icon: Eye,
        title: 'Modul 2',
        subtitle: 'Lapisan Engagement',
        metric: 'Scroll Depth & Dwell Time',
        description:
            'Apakah orang sungguh membaca, dicek lewat checkpoint scroll depth di 25, 50, 75, dan 90 persen. Kalau bermasalah, biasanya ada satu bagian tertentu di halaman yang bikin orang berhenti, dan perbaikannya ada di bagian itu, bukan di tempat lain.',
        amber: false,
    },
    {
        icon: MousePointerClick,
        title: 'Modul 3',
        subtitle: 'Lapisan Intent',
        metric: 'Lead Rate',
        description:
            'Apakah orang mengambil langkah, klik harga, klik WhatsApp. Kalau bermasalah, biasanya karena salah satu dari tiga hal: penawaran kurang jelas, kepercayaan belum cukup, atau tombol aksinya kurang kelihatan.',
        amber: true,
    },
];

const CYCLES = [
    {
        label: 'Cycle 1 · Uji Hero (Akuisisi)',
        bounce: '74,7% → 68,5%',
        lead: '2,5% → 2,61%',
        running: false,
    },
    {
        label: 'Cycle 2 · Uji Problem (Engagement)',
        bounce: '69,2% → 68,6%',
        lead: '2,35% → 2,84%',
        running: false,
    },
    {
        label: 'Cycle 3 · Iterasi Lanjutan (Engagement)',
        bounce: '63,6% → 61,2%',
        lead: '2,75% → 3,63%',
        running: false,
    },
    {
        label: 'Cycle 4 · Masih Berjalan',
        bounce: null,
        lead: null,
        running: true,
    },
];

export function Module() {
    const ref = useSectionView<HTMLElement>('module');

    return (
        <section
            id="module"
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
        >
            <div className="pointer-events-none absolute inset-0 bg-lp-grid opacity-30" />

            <div className="relative mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow>Di Dalam Webinar</Eyebrow>

                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                    Apa yang Sebenarnya{' '}
                    <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                        Dibedah
                    </span>
                </h2>

                <p className="mt-5 max-w-[60ch] text-lg text-lp-text-muted">
                    Closing yang rendah selalu bisa dilacak ke salah satu dari
                    tiga lapisan funnel. Ini yang kita bedah, satu per satu.
                </p>

                <div className="mt-12 grid gap-5 sm:grid-cols-3">
                    {MODULES.map((mod) => (
                        <div
                            key={mod.title}
                            className={cn(
                                'lp-gradient-border lp-gradient-border-inner group relative overflow-hidden rounded-[20px] p-6 backdrop-blur-sm transition-all hover:-translate-y-1',
                                mod.amber
                                    ? 'bg-gradient-to-br from-lp-amber-soft/80 to-lp-amber-soft/40 hover:lp-glow-amber'
                                    : 'bg-lp-bg-elevated/70 hover:lp-glow',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-12 w-12 items-center justify-center rounded-xl',
                                    mod.amber
                                        ? 'bg-gradient-to-br from-lp-amber/40 to-lp-amber/10 shadow-[0_8px_20px_-4px_oklch(0.8_0.16_78/0.5)]'
                                        : 'bg-gradient-to-br from-lp-primary/25 to-lp-primary-2/15 shadow-[0_8px_20px_-4px_oklch(0.62_0.20_224/0.5)]',
                                )}
                            >
                                <mod.icon
                                    className={cn(
                                        'h-5.5 w-5.5',
                                        mod.amber
                                            ? 'text-lp-amber-ink'
                                            : 'text-lp-primary-ink',
                                    )}
                                />
                            </div>
                            <h3 className="mt-5 text-lg font-bold text-lp-text">
                                {mod.title}
                                <span className="mx-1.5 text-lp-text-dim">
                                    &middot;
                                </span>
                                {mod.subtitle}
                            </h3>
                            <p
                                className={cn(
                                    'mt-1 font-mono text-xs tracking-[0.14em] uppercase',
                                    mod.amber
                                        ? 'text-lp-amber-ink'
                                        : 'text-lp-primary-ink',
                                )}
                            >
                                {mod.metric}
                            </p>
                            <p className="mt-3 text-sm text-lp-text-muted">
                                {mod.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="lp-gradient-border lp-gradient-border-inner mt-10 rounded-[22px] bg-lp-bg-elevated/70 p-6 backdrop-blur-sm sm:p-8">
                    <p className="font-mono text-[11px] tracking-[0.15em] text-lp-text-dim uppercase">
                        Data dari Studi Kasus, per Siklus Uji
                    </p>

                    <div className="mt-5 flex flex-col gap-3.5">
                        {CYCLES.map((cycle, index) => (
                            <div
                                key={cycle.label}
                                className={cn(
                                    'flex flex-wrap items-center gap-x-4 gap-y-1.5 pb-3.5',
                                    index < CYCLES.length - 1 &&
                                        'border-b border-lp-border-soft',
                                )}
                            >
                                <span className="flex-1 basis-[200px] font-mono text-[13px] font-medium text-lp-text">
                                    {cycle.label}
                                </span>
                                {cycle.running ? (
                                    <span className="flex items-center gap-2 rounded-full border border-lp-primary/60 bg-lp-primary-soft/60 px-3 py-1 font-mono text-[11px] tracking-[0.14em] text-lp-primary-ink uppercase">
                                        <span className="relative flex h-1.5 w-1.5">
                                            <span className="animate-lp-pulse-ring absolute inline-flex h-full w-full rounded-full bg-lp-primary-ink" />
                                            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-lp-primary-ink" />
                                        </span>
                                        Sedang Berlangsung
                                    </span>
                                ) : (
                                    <>
                                        <span className="font-mono text-[13px] text-lp-text-muted">
                                            Bounce{' '}
                                            <span className="text-lp-text">
                                                {cycle.bounce}
                                            </span>
                                        </span>
                                        <span className="font-mono text-[13px] text-lp-text-muted">
                                            Lead{' '}
                                            <span className="text-lp-primary-ink">
                                                {cycle.lead}
                                            </span>
                                        </span>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    <p className="mt-5 text-[13px] text-lp-text-dim">
                        Diuji lewat split test yang berjalan bersamaan. Sample
                        size di sejumlah cycle masih kecil, ini pola konsisten
                        dari studi kasus kami sejauh ini, bukan jaminan hasil
                        untuk setiap bisnis.
                    </p>
                </div>
            </div>
        </section>
    );
}
