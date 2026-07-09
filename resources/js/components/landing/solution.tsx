import { Check } from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const AFTER_SESSION = [
    'Diagnosa sendiri di titik mana funnel kamu benar benar bocor.',
    'Tahu cara membenahi titik bocor itu, bukan sekadar tahu masalahnya.',
];

const NO_MORE_WORRY = [
    'Setiap rupiah budget iklan kerja lebih efisien, gak lagi habis buat coba coba.',
    'Kamu ambil keputusan funnel dengan tenang, bukan berdasar tebakan.',
];

function ChecklistRow({
    text,
    bordered = true,
}: {
    text: string;
    bordered?: boolean;
}) {
    return (
        <div
            className={
                bordered
                    ? 'flex items-center gap-3 rounded-2xl border border-lp-border px-4.5 py-3.5'
                    : 'flex items-center gap-3'
            }
        >
            <span className="flex h-5.5 w-5.5 shrink-0 items-center justify-center rounded-full bg-lp-primary-soft">
                <Check
                    className="h-3 w-3 text-lp-primary-ink"
                    strokeWidth={3}
                />
            </span>
            <span className="text-[15px] text-lp-text">{text}</span>
        </div>
    );
}

export function Solution() {
    const ref = useSectionView<HTMLElement>('solution');

    return (
        <section ref={ref} className="border-b border-lp-border-soft bg-lp-bg">
            <div className="mx-auto max-w-2xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow className="mx-auto">Tentang Webinar</Eyebrow>

                <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl">
                    The Silent Conversion Leak
                </h2>

                <p className="mt-3 font-mono text-[13px] text-lp-text-dim">
                    16 Juli 2026 &middot; Live via Zoom{' '}
                    <span className="opacity-75">
                        (tanggal masih sementara, bisa menyesuaikan)
                    </span>
                </p>

                <p className="mx-auto mt-4 max-w-[56ch] text-lg text-lp-text-muted">
                    Sesi live 90 menit yang membahas kenapa konversi kamu masih
                    boncos padahal iklan udah bagus, dengan fokus pembahasan ke
                    landing page kamu.
                </p>

                <div className="mt-10 text-left">
                    <p className="mb-3.5 text-base font-bold text-lp-text">
                        Setelah ikut sesi ini, kamu bisa:
                    </p>
                    <div className="flex flex-col gap-3">
                        {AFTER_SESSION.map((text) => (
                            <ChecklistRow key={text} text={text} />
                        ))}
                    </div>
                </div>

                <div className="mt-7 rounded-[18px] border border-lp-border-soft bg-lp-bg-elevated p-6 text-left">
                    <p className="mb-3.5 text-base font-bold text-lp-text">
                        Sehingga kamu gak perlu pusing lagi soal penjualan yang
                        mahal:
                    </p>
                    <div className="flex flex-col gap-3">
                        {NO_MORE_WORRY.map((text) => (
                            <ChecklistRow
                                key={text}
                                text={text}
                                bordered={false}
                            />
                        ))}
                    </div>
                </div>

                <div className="mt-9 flex flex-col items-center gap-4">
                    <CtaButton location="solution_primary">
                        Amankan Kursi Kamu
                    </CtaButton>
                    <a
                        href="#module"
                        className="text-sm font-medium text-lp-text-dim transition-colors hover:text-lp-text"
                    >
                        Pelajari cara diagnosanya &darr;
                    </a>
                </div>
            </div>
        </section>
    );
}
