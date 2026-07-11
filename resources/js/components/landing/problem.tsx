import { X } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const PAIN_POINTS = [
    {
        lead: 'Kamu udah coba ganti semuanya,',
        detail: 'ganti kreatif, ganti angle, ganti landing page, CPA nya masih tinggi juga',
    },
    {
        lead: 'Closing seret, budget jalan terus.',
        detail: 'Makin lama iklan jalan, makin gak jelas di mana titik masalahnya',
    },
    {
        lead: 'Gak tahu mulai benerin dari mana.',
        detail: 'Tiap orang kasih saran beda beda, tapi sebenarnya kamu bingung dimana akar masalahnya',
    },
];

const CAUSES = [
    {
        title: 'Iklan belum benar benar tervalidasi',
        detail: 'Belum jelas kreatif atau angle mana yang benar benar menarik orang yang tepat.',
    },
    {
        title: 'Landing page menahan, bukan mendorong',
        detail: 'Halaman kamu bisa jadi titik orang ragu buat lanjut, bukan yakin buat beli.',
    },
    {
        title: 'Penawaran belum pas',
        detail: 'Harga atau bentuk offer belum sesuai ekspektasi audiens yang datang.',
    },
    {
        title: 'Kualitas traffic menurun',
        detail: 'Yang klik makin banyak, yang benar benar merasa butuh makin sedikit.',
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
                <Eyebrow>Pernah Ngerasain Ini?</Eyebrow>

                <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                    Iklan Udah Oke,
                    <br />
                    <span className="bg-gradient-to-r from-lp-primary via-lp-primary-ink to-lp-primary-2 bg-clip-text text-transparent">
                        Tapi Kok Biaya per Pembelian Masih Mahal?
                    </span>
                </h2>

                <p className="mt-6 text-lg text-lp-text-muted">
                    Kamu udah ngerasa iklannya jalan dengan baik, CTR sehat, CPC
                    wajar. Tapi setiap kali cek CPA, angkanya bikin mikir dua
                    kali. Ini yang bikin makin pusing :
                </p>

                <div className="mt-8 flex flex-col gap-3">
                    {PAIN_POINTS.map((point) => (
                        <div
                            key={point.lead}
                            className="group relative overflow-hidden rounded-2xl border border-lp-danger/25 bg-lp-danger-soft/60 p-5 backdrop-blur-sm transition-all hover:border-lp-danger/50"
                        >
                            <div className="absolute inset-y-0 left-0 w-1 bg-gradient-to-b from-lp-danger to-transparent opacity-70" />
                            <span className="mr-2 inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-lp-danger/25 align-middle ring-1 ring-lp-danger/40">
                                <X
                                    className="h-2.5 w-2.5 text-lp-danger"
                                    strokeWidth={3}
                                />
                            </span>
                            <strong className="text-[15.5px] font-medium">
                                {point.lead}
                            </strong>{' '}
                            <span className="text-[15.5px] font-medium">
                                {point.detail}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-8 text-base font-bold text-lp-text">
                    Titik bocornya emang gak kelihatan, sampai kamu tahu persis
                    harus cek di mana.
                </p>

                <div className="lp-divider-glow mt-14 pt-11">
                    <h3 className="text-center font-display text-2xl font-extrabold tracking-tight text-lp-text sm:text-3xl">
                        Faktanya, Ada 4 Penyebab yang Bikin Closing Jadi Mahal
                    </h3>

                    <div className="mt-8 grid gap-3.5 sm:grid-cols-2">
                        {CAUSES.map((cause, index) => (
                            <div
                                key={cause.title}
                                className="group lp-gradient-border-inner lp-gradient-border relative overflow-hidden rounded-2xl bg-lp-bg/40 p-5 backdrop-blur-sm transition-all hover:-translate-y-0.5"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lp-primary to-lp-primary-2 font-mono text-[13px] font-bold text-white shadow-[0_8px_20px_-6px_oklch(0.62_0.20_224/0.6)]">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <strong className="text-[15.5px] text-lp-text">
                                        {cause.title}
                                    </strong>
                                </div>
                                <p className="mt-2.5 ml-12 text-sm text-lp-text-muted">
                                    {cause.detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-9 text-center text-base font-bold text-lp-text uppercase">
                        4 penyebab ini bisa diketahui dari data di landing page
                        kamu
                    </p>
                    <p className="mt-9 text-center text-base font-bold text-lp-text">
                        Begitu kamu tahu penyebab mana yang terjadi, kamu bisa
                        mulai benerin di titik yang tepat sehingga{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            penjualan bisnis bisa langsung naik, dan{' '}
                            <span className="uppercase underline">
                                itu yang webinar ini bantu temukan.
                            </span>
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
