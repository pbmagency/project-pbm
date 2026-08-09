import { CtaButton } from '@/components/landing/cta-button';
import { cn } from '@/lib/utils';

const MODULES = [
    {
        id: '01',
        label: 'MODUL 1',
        title: 'Cara Membaca Letak Masalah',
        amber: false,
        topics: [
            {
                eyebrow: '1.1 - CEK KUALITAS TRAFFIC',
                title: 'Audit Kualitas Traffic Sebelum Masuk Funnel',
                desc: 'Pelajari cara membedakan orang yang emang niat beli dari yang cuma iseng klik.',
            },
            {
                eyebrow: '1.2 - TEMUKAN TITIK BOCORNYA',
                title: 'Petakan Persis Titik Funnel yang Bocor',
                desc: 'Lacak langkah demi langkah dari klik pertama sampai checkout, biar ketahuan persis di mana orang keluar.',
            },
        ],
    },
    {
        id: '02',
        label: 'MODUL 2',
        title: 'Cara Efektif Perbaiki Kebocoran',
        amber: false,
        topics: [
            {
                eyebrow: '2.1 - BEDAH LANDING PAGE KAMU',
                title: 'Bedah Elemen yang Diam Diam Menahan Closing',
                desc: 'Cek bagian atas halaman (above-the-fold) dan elemen elemen yang diam diam bikin orang ragu buat lanjut.',
            },
            {
                eyebrow: '2.2 - SESUAIKAN DENGAN PENAWARAN KAMU',
                title: 'Kalibrasi Ulang Penawaran ke Ekspektasi Audiens',
                desc: 'Sesuaikan harga dan bentuk penawaran biar cocok sama ekspektasi calon pembeli.',
            },
        ],
    },
    {
        id: '03',
        label: 'MODUL 3 \u2022 BONUS',
        title: 'Studi Kasus & Tools Diagnosis',
        amber: true,
        topics: [
            {
                eyebrow: '3.1 - STUDI KASUS KLIEN KAMI',
                title: 'Cara Kami Optimasi & Tools Diagnosa yang Dipakai',
                desc: 'Lihat langsung proses optimasi landing page klien PBM, dan titik bocornya ketahuan sampai tools yang dipakai buat diagnosa.',
            },
            {
                eyebrow: '3.2 - BEDAH LANDING PAGE PESERTA WEBINAR',
                title: 'Landing Page Peserta Dibedah Langsung',
                desc: 'Landing page dari peserta webinar akan dibedah live, biar kamu lihat langsung cara diagnosanya diterapkan ke kasus nyata.',
            },
        ],
    },
];

export function Curriculum() {
    return (
        <section
            id="curriculum"
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            {/* Background Effects */}
            <div className="pointer-events-none absolute inset-0 bg-lp-grid opacity-30" />
            <div className="pointer-events-none absolute top-1/4 left-1/2 h-96 w-96 -translate-x-1/2 rounded-full bg-lp-primary/5 blur-[120px]" />

            <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto inline-flex items-center rounded-full border border-lp-amber/30 bg-lp-amber-soft/20 px-3 py-1 font-mono text-[11px] font-bold tracking-wider text-lp-amber sm:text-xs">
                        DI DALAM WEBINAR
                    </div>

                    <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                        Apa yang Bakal{' '}
                        <span className="bg-gradient-to-r from-lp-primary via-lp-primary-ink to-lp-primary-2 bg-clip-text text-transparent">
                            Dibongkar
                        </span>
                    </h2>
                </div>

                {/* Timeline */}
                <div className="mt-16 flex flex-col sm:mt-20">
                    {MODULES.map((mod, index) => (
                        <div key={mod.id} className="flex gap-4 sm:gap-7">
                            
                            {/* Left Column: Number Badge & Connecting Line */}
                            <div className="flex shrink-0 flex-col items-center">
                                <div
                                    className={cn(
                                        'flex h-11 w-11 items-center justify-center rounded-xl font-mono text-[15px] font-bold sm:h-12 sm:w-12 sm:text-[16px]',
                                        mod.amber
                                            ? 'bg-gradient-to-br from-lp-amber to-lp-amber/80 text-lp-amber-ink shadow-[0_8px_20px_-6px_oklch(0.8_0.16_78/0.5)]'
                                            : 'bg-gradient-to-br from-lp-primary to-lp-primary-2 text-white shadow-[0_8px_20px_-6px_oklch(0.62_0.20_224/0.5)]',
                                    )}
                                >
                                    {mod.id}
                                </div>
                                
                                {/* Vertical Line (except for the last item) */}
                                {index !== MODULES.length - 1 && (
                                    <div
                                        className={cn(
                                            'my-3 flex-1 w-[2px] rounded-full',
                                            index === 1
                                                ? 'bg-gradient-to-b from-lp-primary/80 to-lp-amber/80' // Gradient transition to module 3
                                                : 'bg-lp-primary/60',
                                        )}
                                    />
                                )}
                            </div>

                            {/* Right Column: Module Content */}
                            <div
                                className={cn(
                                    'flex-1',
                                    index !== MODULES.length - 1
                                        ? 'pb-12 sm:pb-16' // Spacing to the next module
                                        : '',
                                )}
                            >
                                <p
                                    className={cn(
                                        'font-mono text-xs font-bold tracking-wider uppercase',
                                        mod.amber
                                            ? 'text-lp-amber'
                                            : 'text-lp-primary-3',
                                    )}
                                >
                                    {mod.label}
                                </p>
                                <h3 className="mt-1.5 font-display text-xl font-bold text-lp-text sm:text-2xl">
                                    {mod.title}
                                </h3>

                                {/* Module Topics (Cards) */}
                                <div className="mt-6 flex flex-col gap-3.5">
                                    {mod.topics.map((topic) => (
                                        <div
                                            key={topic.title}
                                            className={cn(
                                                'group lp-gradient-border-inner lp-gradient-border relative overflow-hidden rounded-[16px] bg-lp-bg/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5',
                                                mod.amber
                                                    ? 'hover:lp-glow-amber'
                                                    : 'hover:lp-glow',
                                            )}
                                        >
                                            <p
                                                className={cn(
                                                    'font-mono text-[11px] font-bold tracking-wider sm:text-xs',
                                                    mod.amber
                                                        ? 'text-lp-amber/90'
                                                        : 'text-lp-primary/90',
                                                )}
                                            >
                                                {topic.eyebrow}
                                            </p>
                                            <h4 className="mt-2 text-[15px] font-bold leading-snug text-lp-text">
                                                {topic.title}
                                            </h4>
                                            <p className="mt-1.5 text-[14px] leading-snug text-lp-text-muted">
                                                {topic.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-16 flex justify-center sm:mt-20">
                    <CtaButton location="curriculum_bottom" showTrustBadges>
                        Amankan Seat Sekarang
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}