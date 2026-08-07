import { X } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const PAIN_POINTS = [
    {
        lead: 'Udah coba banyak cara, hasilnya zonk.',
        detail: 'Ganti-ganti strategi, tapi angka closing-nya tetap stuck di kisaran yang sama.',
    },
    {
        lead: 'Mulai nyerah dengan dunia ads.',
        detail: 'Padahal ads potensi terbesar buat bisnis saya kalau berhasil.',
    },
    {
        lead: 'Waktu, tenaga, dan uang',
        detail: 'makin habis buat coba-coba terus. Stres banget rasanya gak nemu-nemu solusinya.',
    },
];

const CAUSES = [
    {
        title: 'Ganti kreatif cuma ubah siapa yang klik, bukan yang bikin mereka gak jadi beli',
    },
    {
        title: 'Potensi besar buat adsnya sukses masih ada, cuma belum ketahuan di mana macetnya',
    },
    {
        title: 'Kamu jadi keluar banyak waktu dan uang cuma buat coba-coba',
    },
    {
        title: 'Jawabannya sebenarnya udah ada, cuma selama ini belum kamu lihat',
    },
];

export function Problem() {
    const ref = useSectionView<HTMLElement>('problem');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute top-0 left-1/2 h-64 w-64 -translate-x-1/2 rounded-full bg-lp-danger/20 blur-[120px]" />

            <div className="relative mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow>Stres Banget!</Eyebrow>

                <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                    Udah Coba Semua Hal,
                    <br />
                    <span className="bg-gradient-to-r from-lp-primary via-lp-primary-ink to-lp-primary-2 bg-clip-text text-transparent">
                        Tapi Closingnya Tetap Stuck?
                    </span>
                </h2>

                <div className="mt-6 flex flex-col gap-4 text-lg text-lp-text-muted">
                    <p>
                        Kamu udah <strong className="font-bold text-lp-text">ganti kreatif</strong>, <strong className="font-bold text-lp-text">ganti angle</strong>, bahkan udah <strong className="font-bold text-lp-text">ganti harga</strong>. Tapi <strong className="font-bold text-lp-text">closingnya tetap stuck</strong>.
                    </p>
                    <p>
                        Akhirnya mulai muncul pikiran:{' '}
                        <strong className="font-bold text-lp-text">
                            jangan-jangan saya gak ditakdirkan buat jualan pakai ads.
                        </strong>
                        <br className="hidden sm:block" />
                        <span className="mt-1 block sm:mt-0 sm:inline">
                            Kalau kamu ngerasain ini, kamu gak sendirian :
                        </span>
                    </p>
                </div>

                <div className="mt-8 flex flex-col gap-3">
                    {PAIN_POINTS.map((point) => (
                        <div
                            key={point.lead}
                            className="group relative overflow-hidden rounded-2xl border border-lp-danger/25 bg-lp-danger-soft/60 p-5 backdrop-blur-sm transition-all hover:border-lp-danger/50"
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-lp-danger to-transparent opacity-70" />
                            <span className="mr-3 inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-lp-danger/25 align-middle ring-1 ring-lp-danger/40">
                                <X
                                    className="h-2.5 w-2.5 text-lp-danger"
                                    strokeWidth={3}
                                />
                            </span>
                            <strong className="text-[15.5px] font-bold text-lp-text">
                                {point.lead}
                            </strong>{' '}
                            <span className="text-[15.5px] text-lp-text-muted/90">
                                {point.detail}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-base font-bold text-lp-text">
                    Kalau gini terus, lama-lama kamu kehabisan uang, akhirnya kamu nyerah dan kehilangan potensi buat bisnismu bisa scale di dunia ads
                </p>

                <div className="lp-divider-glow mt-14 pt-11">
                    <h3 className="text-center font-display text-2xl font-extrabold tracking-tight text-lp-text sm:text-3xl">
                        Faktanya, Ada 4 Penyebab yang Bikin Closing-nya Stuck
                    </h3>

                    <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                        {CAUSES.map((cause, index) => (
                            <div
                                key={cause.title}
                                className="group lp-gradient-border-inner lp-gradient-border relative flex items-center overflow-hidden rounded-2xl bg-lp-bg/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-4">
                                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lp-primary to-lp-primary-2 font-mono text-[13px] font-bold text-white shadow-[0_8px_20px_-6px_oklch(0.62_0.20_224/0.6)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <strong className="text-[14.5px] font-medium leading-snug text-lp-text">
                                        {cause.title}
                                    </strong>
                                </div>
                            </div>
                        ))}
                    </div>

                    <p className="mt-9 text-center text-base font-bold uppercase text-lp-text">
                        4 PENYEBAB INI BISA DIKETAHUI DARI DATA DI LANDING PAGE
                        KAMU
                    </p>
                    <p className="mt-9 text-center text-base font-bold text-lp-text">
                        Begitu kamu tahu penyebab mana yang terjadi, kamu bisa
                        mulai benerin di titik yang tepat sehingga{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            penjualan bisnis bisa langsung naik, dan{' '}
                            <span className="uppercase underline">
                                ITU YANG WEBINAR INI BANTU TEMUKAN.
                            </span>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}