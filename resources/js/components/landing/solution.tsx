import { usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { useSectionView } from '@/hooks/use-section-view';

const AFTER_SESSION = [
    'Diagnosa sendiri di bagian mana conversion lo benar benar bocor.',
    'Tahu cara membenahi titik bocor itu, bukan sekadar tahu masalahnya.',
];

const NO_MORE_WORRY = [
    'Budget iklan lebih efisien, gak lagi habis buat coba coba.',
    'Lo bisa perbaiki dengan akurat, bukan nebak lagi. Jadi penjualan beneran naik',
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
                    ? 'lp-gradient-border-inner lp-gradient-border flex items-center gap-3 rounded-2xl bg-lp-bg-elevated/50 px-4.5 py-3.5 backdrop-blur-sm'
                    : 'flex items-center gap-3'
            }
        >
            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_4px_12px_-2px_oklch(0.62_0.20_224/0.6)]">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span className="text-[15px] text-lp-text">{text}</span>
        </div>
    );
}

export function Solution() {
    const ref = useSectionView<HTMLElement>('solution');
    const { settings } = usePage<any>().props;

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-lp-primary/15 blur-[140px]" />
            </div>

            {/* ── Header: headline + subheadline, selalu centered ── */}
            <div className="relative mx-auto max-w-2xl px-4 pt-16 text-center sm:px-6 sm:pt-24 lg:pt-28">
                {/* <Eyebrow className="mx-auto">Tentang Webinar</Eyebrow> */}
                <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-lp-text sm:text-5xl lg:text-[56px]">
                    <span className="bg-gradient-to-br from-lp-text via-lp-primary-ink to-lp-primary bg-clip-text text-transparent">
                        The Silent
                    </span>
                    <br />
                    <span className="bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-primary-ink bg-clip-text text-transparent">
                        Conversion Leak
                    </span>
                </h2>

                <p className="mt-4 font-mono text-[13px] tracking-wide text-lp-text-dim">
                    {settings?.event_date || '16 JULI 2026'} &middot; LIVE VIA ZOOM
                </p>
                <p className="mt-2 font-mono text-[13px] tracking-wide text-lp-text-dim">
                    {settings?.event_time || '19:00 - 20:30 WIB'}
                </p>

                <p className="mx-auto mt-5 hidden max-w-[56ch] text-lg text-lp-text-muted md:block">
                    Sesi live 90 menit yang ngebahas kenapa landing page kamu
                    masih boncos padahal iklannya udah jalan bagus.
                </p>
            </div>

            {/* ── Body: poster + value, grid 50/50 di desktop ── */}
            <div className="relative mx-auto max-w-5xl px-4 pt-8 pb-16 sm:px-6 sm:pb-24 lg:pb-28">
                <div className="flex flex-col items-center gap-8 lg:grid lg:grid-cols-2 lg:items-center lg:gap-12">
                    {/* Poster — mobile: di atas body, desktop: kolom kiri */}
                    <div className="w-full max-w-sm lg:max-w-none">
                        <div className="lp-gradient-border-inner lp-gradient-border aspect-square overflow-hidden rounded-[24px]">
                            {/* TODO: ganti src dengan URL poster webinar yang asli */}
                            <img
                                src="https://placehold.co/600x600/0f0f1a/7c8cf8?text=Poster+Webinar"
                                alt="Poster Webinar The Silent Conversion Leak"
                                className="h-full w-full object-cover"
                            />
                        </div>
                    </div>

                    {/* Value + CTA — desktop: kolom kanan */}
                    <div className="w-full text-left">
                        <p className="mx-auto mb-6 block max-w-[56ch] text-lg text-lp-text-muted md:hidden">
                            Sesi live 90 menit yang ngebahas kenapa landing page
                            kamu masih boncos padahal iklannya udah jalan bagus.
                        </p>
                        <div className="flex flex-col gap-3">
                            <p className="mb-0.5 text-base font-bold text-lp-text">
                                Setelah ikut sesi ini, lo bisa:
                            </p>
                            {AFTER_SESSION.map((text) => (
                                <ChecklistRow key={text} text={text} />
                            ))}
                        </div>

                        <div className="lp-gradient-border-inner lp-gradient-border mt-6 rounded-[18px] p-6 lp-glass">
                            <p className="mb-3.5 text-base font-bold text-lp-text">
                                Sehingga lo gak perlu pusing lagi soal penjualan
                                yang mahal:
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
                    </div>
                </div>
                <div className="mt-8 flex flex-col items-center gap-4 lg:items-center">
                    <CtaButton location="solution_primary" showTrustBadges>
                        Amankan Seat Saya
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}