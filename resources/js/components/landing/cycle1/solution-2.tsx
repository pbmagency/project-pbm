import { usePage } from '@inertiajs/react';
import { Check } from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
const AFTER_SESSION: React.ReactNode[] = [
    'Lihat sendiri datanya dan tahu di bagian mana orang mulai ragu.',
    'Tahu bagian mana yang perlu dibenerin dulu.',
];

const NO_MORE_WORRY: React.ReactNode[] = [
    'Fokus benerin yang memang bermasalah, bukan asal ubah iklan.',
    'Ads kamu jadi lebih maksimal setelah kamu perbaiki.',
];

function ChecklistRow({
    text,
    bordered = true,
}: {
    text: React.ReactNode;
    bordered?: boolean;
}) {
    return (
        <div
            className={
                bordered
                    ? 'lp-gradient-border-inner lp-gradient-border flex items-center gap-3 rounded-2xl bg-lp-bg-elevated/50 px-4.5 py-3.5 backdrop-blur-sm'
                    : 'flex items-start gap-3 sm:items-center'
            }
        >
            <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_4px_12px_-2px_oklch(0.62_0.20_224/0.6)] sm:mt-0">
                <Check className="h-3 w-3 text-white" strokeWidth={3} />
            </span>
            <span className="text-[15px] leading-snug text-lp-text">{text}</span>
        </div>
    );
}

export function Solution() {
    const { settings } = usePage<any>().props;

    return (
        <section
            id="solution"
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg"
        >
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/4 left-1/2 h-[400px] w-[400px] -translate-x-1/2 rounded-full bg-lp-primary/15 blur-[140px]" />
            </div>

            {/* ── Header: headline + subheadline, selalu centered ── */}
            <div className="relative mx-auto max-w-2xl px-4 pt-16 text-center sm:px-6 sm:pt-24 lg:pt-28">
                <h2 className="mt-5 font-display text-4xl font-extrabold tracking-tight text-white sm:text-5xl lg:text-[56px]">
                    The{' '}
                    <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                        Silent
                    </span>
                    <br />
                    <span className="bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-primary-ink bg-clip-text text-transparent">
                        Conversion Leak
                    </span>
                </h2>

                <p className="mt-4 font-mono text-[13px] tracking-wide text-lp-text-dim uppercase">
                    {settings?.event_date || '16 JULI 2026'} &middot; LIVE VIA
                    ZOOM
                </p>
                <p className="mt-2 font-mono text-[13px] tracking-wide text-lp-text-dim uppercase">
                    {settings?.event_time || '19:00 - 20:30 WIB'}
                </p>

                <p className="mx-auto mt-6 hidden max-w-[56ch] text-lg text-lp-text-muted md:block">
                    Sesi live 90 menit yang ngebahas kenapa closing landing page kamu masih stuck, padahal kamu sudah coba perbaiki banyak hal.
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
                                alt="Poster Webinar The Silent Conversion Leak"
                                className="h-full w-full object-cover"
                                src="/images/poster/Poster.webp"
                                sizes="(max-width: 768px) 100vw, 800px"
                                fetchPriority="high"
                            />
                        </div>
                    </div>

                    {/* Value + CTA — desktop: kolom kanan */}
                    <div className="w-full text-left">
                        <p className="mx-auto mb-8 block max-w-[56ch] text-center text-lg text-lp-text-muted md:hidden">
                            Sesi live 90 menit yang ngebahas kenapa closing landing page kamu masih stuck, padahal kamu sudah coba perbaiki banyak hal.
                        </p>
                        
                        <div className="flex flex-col gap-3">
                            <p className="mb-0.5 text-[15.5px] font-bold text-lp-text">
                                Setelah ikut sesi ini, lo bisa:
                            </p>
                            {AFTER_SESSION.map((text, i) => (
                                <ChecklistRow key={i} text={text} />
                            ))}
                        </div>

                        <div className="lp-gradient-border-inner lp-gradient-border mt-6 rounded-[18px] p-6 lp-glass">
                            <p className="mb-4 text-[15.5px] font-bold text-lp-text">
                                Jadi kamu gak perlu stres coba-coba ini itu:
                            </p>
                            <div className="flex flex-col gap-3.5">
                                {NO_MORE_WORRY.map((text, i) => (
                                    <ChecklistRow
                                        key={i}
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