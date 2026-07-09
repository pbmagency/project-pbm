import { X } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const PAIN_POINTS = [
    {
        lead: 'Udah coba ganti banyak hal.',
        detail: 'Ganti kreatif, ganti angle, ganti landing page, CPAnya tetap di angka yang sama.',
    },
    {
        lead: 'Closing seret, budget jalan terus.',
        detail: 'Makin lama iklan jalan, makin gak jelas di mana titik masalahnya.',
    },
    {
        lead: 'Gak tahu mulai benerin dari mana.',
        detail: 'Tiap orang kasih saran beda beda, tapi gak ada yang nunjuk akar masalahnya.',
    },
];

const CAUSES = [
    {
        title: 'Iklan belum benar benar tervalidasi',
        detail: 'Belum jelas kreatif atau angle mana yang benar benar menarik orang yang tepat.',
    },
    {
        title: 'Landing page menahan, bukan mendorong',
        detail: 'Halaman kamu bisa jadi titik orang ragu buat lanjut, bukan titik mereka yakin buat beli.',
    },
    {
        title: 'Penawaran belum pas',
        detail: 'Harga atau bentuk offer belum sesuai ekspektasi audiens yang datang.',
    },
    {
        title: 'Kualitas traffic menurun',
        detail: 'Yang klik makin banyak, yang benar benar butuh makin sedikit.',
    },
];

export function Problem() {
    const ref = useSectionView<HTMLElement>('problem');

    return (
        <section
            ref={ref}
            className="border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="mx-auto max-w-3xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow>Pernah Ngerasain Ini?</Eyebrow>

                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl">
                    Iklan Udah Oke,
                    <br />
                    <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                        Tapi Kok Biaya per Pembelian Masih Mahal?
                    </span>
                </h2>

                <p className="mt-5 text-lg text-lp-text-muted">
                    Kamu udah ngerasa iklannya jalan dengan baik, CTR sehat, CPC
                    wajar. Tapi setiap kali cek CPA, angkanya bikin mikir dua
                    kali. Ini yang bikin makin pusing.
                </p>

                <div className="mt-7 flex flex-col gap-3">
                    {PAIN_POINTS.map((point) => (
                        <div
                            key={point.lead}
                            className="rounded-2xl bg-lp-danger-soft p-4.5"
                        >
                            <span className="mr-1 inline-flex h-5.5 w-5.5 items-center justify-center rounded-full bg-lp-danger/25 align-middle">
                                <X
                                    className="h-2.5 w-2.5 text-lp-danger"
                                    strokeWidth={3}
                                />
                            </span>
                            <strong className="text-[15.5px] text-lp-text">
                                {point.lead}
                            </strong>{' '}
                            <span className="text-[15.5px] text-lp-text-muted">
                                {point.detail}
                            </span>
                        </div>
                    ))}
                </div>

                <p className="mt-7 text-base font-bold text-lp-text">
                    Titik bocornya emang gak kelihatan, sampai kamu tahu persis
                    harus cek di mana.
                </p>

                <div className="mt-11 border-t border-lp-border-soft pt-9">
                    <h3 className="text-center text-xl font-extrabold tracking-tight text-lp-text sm:text-2xl">
                        Faktanya, Ada 4 Penyebab yang Bikin Closing Jadi Mahal
                    </h3>

                    <div className="mt-7 flex flex-col gap-3.5">
                        {CAUSES.map((cause, index) => (
                            <div
                                key={cause.title}
                                className="rounded-2xl border border-lp-border p-5 transition-colors hover:border-lp-primary"
                            >
                                <div className="flex items-center gap-3">
                                    <span className="flex h-7.5 w-7.5 shrink-0 items-center justify-center rounded-lg bg-lp-primary font-mono text-[13px] font-bold text-white">
                                        {String(index + 1).padStart(2, '0')}
                                    </span>
                                    <strong className="text-[15.5px] text-lp-text">
                                        {cause.title}
                                    </strong>
                                </div>
                                <p className="mt-2 ml-10.5 text-sm text-lp-text-muted">
                                    {cause.detail}
                                </p>
                            </div>
                        ))}
                    </div>

                    <p className="mt-7 text-center text-base font-bold text-lp-text">
                        Begitu kamu tahu penyebab mana yang terjadi di bisnismu,
                        kamu bisa mulai benerin di titik yang tepat,{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            dan itu yang webinar ini bantu kamu temukan.
                        </span>
                    </p>
                </div>
            </div>
        </section>
    );
}
