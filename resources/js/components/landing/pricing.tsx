import { useForm, usePage } from '@inertiajs/react';
import { AlertCircle, Check, Lock } from 'lucide-react';
import { useRef } from 'react';
import { CountdownTimer } from '@/components/landing/countdown-timer';
import { Eyebrow } from '@/components/landing/eyebrow';
import { getLandingSource, useAnalytics } from '@/hooks/use-analytics';
import { useSectionView } from '@/hooks/use-section-view';

const INCLUDES = [
    'Live Session & Rekaman Webinar "The Silent Conversion Leak"',
    'Bonus: Ebook "Iklan Sudah Jalan, Tapi Kok Tetap Boncos?"',
    'Bonus: Akses Tanya Jawab Langsung Dengan Mentor',
    'Bonus: Kesempatan Funnel Audit Gratis',
];

export function Pricing() {
    const ref = useSectionView<HTMLElement>('pricing');
    const { settings } = usePage<any>().props;
    const { trackInitiateCheckout } = useAnalytics();
    const hasTrackedIntent = useRef(false);

    const { data, setData, post, processing, errors, transform } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    const handleBlur = () => {
        if (!hasTrackedIntent.current && data.name.trim() !== '' && data.email.trim() !== '' && data.phone.trim() !== '') {
            hasTrackedIntent.current = true;
            trackInitiateCheckout('pricing_form');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        transform((data) => ({
            ...data,
            landing_source: getLandingSource(),
        }));
        post('/checkout', {
            preserveScroll: true,
            onSuccess: (page) => {
                const redirectUrl = (page.props as { redirect_url?: string }).redirect_url;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            },
        });
    };

    return (
        <section
            ref={ref}
            id="pricing"
            className="relative overflow-hidden bg-lp-bg"
        >
            <div className="relative mx-auto max-w-lg px-4 pt-16 pb-10 sm:px-6 sm:pt-24 sm:pb-12 lg:pt-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto" tone="amber">
                        Early Bird
                    </Eyebrow>

                    <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-[38px]">
                        Investasi Terbaik Untuk{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Perubahan
                        </span>
                    </h2>
                </div>

                <div className="relative mt-10">
                    <div className="absolute -inset-3 rounded-[28px] bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-amber opacity-40 blur-2xl" />

                    <div className="lp-gradient-border-inner lp-gradient-border relative overflow-hidden rounded-[24px] bg-lp-bg-elevated shadow-[0_40px_80px_-20px_rgba(0,0,0,0.7)]">
                        <div className="border-b border-white/5 p-7 sm:p-9 pb-6">
                            <h3 className="text-base font-bold text-lp-primary-2">
                                Live Webinar: The Silent Conversion Leak
                            </h3>
                            <p className="mt-1.5 text-[14px] text-lp-text-muted">
                                Online, Zoom Meeting
                            </p>
                            <p className="mt-0.5 text-[14px] text-lp-text-muted">
                                {settings?.event_date || '16 JULI 2026'}, {settings?.event_time || '19:00 - 20:30 WIB'}
                            </p>
                        </div>

                        <div className="p-7 pt-6 sm:p-9 sm:pt-6">
                            <p className="font-mono text-[11px] tracking-[0.16em] text-lp-text-dim uppercase">
                                Yang Lo Dapatkan
                            </p>
                            <ul className="mt-5 flex flex-col gap-1">
                                {INCLUDES.map((item) => (
                                    <li
                                        key={item}
                                        className="flex gap-3 py-2.5 text-[15px] text-lp-text"
                                    >
                                        <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2 shadow-[0_4px_10px_-2px_oklch(0.62_0.20_224/0.6)]">
                                            <Check
                                                className="h-3 w-3 text-white"
                                                strokeWidth={3}
                                            />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="relative overflow-hidden bg-gradient-to-br from-lp-primary via-lp-primary-2 to-lp-primary-2 p-7 sm:p-9">
                            <div
                                className="pointer-events-none absolute inset-0 opacity-40"
                                style={{
                                    backgroundImage:
                                        'radial-gradient(circle at 20% 30%, rgba(255,255,255,0.25), transparent 50%), radial-gradient(circle at 80% 70%, rgba(255,255,255,0.18), transparent 50%)',
                                }}
                            />

                            <div className="relative">
                                <p className="text-center text-[13px] text-white/80 line-through">
                                    Harga Normal Rp299.000
                                </p>
                                <p className="mt-1.5 text-center font-mono text-[11px] tracking-[0.18em] text-white/90 uppercase">
                                    Harga Early Bird
                                </p>
                                <p className="mt-2 text-center font-display text-6xl font-extrabold tracking-tight text-white drop-shadow-[0_4px_20px_rgba(0,0,0,0.3)]">
                                    Rp129.000
                                </p>

                                <div className="mt-6 border-t border-white/25 pt-5">
                                    <p className="text-center font-mono text-[10.5px] tracking-[0.14em] text-white/80 uppercase">
                                        Harga early bird berakhir dalam
                                    </p>
                                    <div className="mt-3">
                                        <CountdownTimer />
                                    </div>
                                </div>

                                <form onSubmit={handleSubmit} className="mt-7 space-y-3">
                                    <div>
                                        <input
                                            type="text"
                                            value={data.name}
                                            onChange={(e) => setData('name', e.target.value)}
                                            onBlur={handleBlur}
                                            placeholder="Nama Lengkap"
                                            className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition focus:border-white/70 focus:bg-white/20"
                                        />
                                        {errors.name && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-white/90">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.name}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="email"
                                            value={data.email}
                                            onChange={(e) => setData('email', e.target.value)}
                                            onBlur={handleBlur}
                                            placeholder="Email"
                                            className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition focus:border-white/70 focus:bg-white/20"
                                        />
                                        {errors.email && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-white/90">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.email}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <input
                                            type="tel"
                                            value={data.phone}
                                            onChange={(e) => setData('phone', e.target.value)}
                                            onBlur={handleBlur}
                                            placeholder="Nomor WhatsApp"
                                            className="w-full rounded-xl border border-white/30 bg-white/15 px-4 py-3 text-sm text-white placeholder-white/60 outline-none transition focus:border-white/70 focus:bg-white/20"
                                        />
                                        {errors.phone && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-white/90">
                                                <AlertCircle className="h-3 w-3" />
                                                {errors.phone}
                                            </p>
                                        )}
                                    </div>

                                    <button
                                        type="submit"
                                        disabled={processing}
                                        className="mt-1 w-full rounded-2xl bg-white px-8 py-4 text-base font-bold text-lp-primary-2 shadow-[0_16px_40px_-14px_rgba(255,255,255,0.55)] transition hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] disabled:opacity-70"
                                    >
                                        {processing ? 'Memproses...' : 'Amankan Seat Saya'}
                                    </button>
                                </form>

                                <p className="mt-3.5 flex items-center justify-center gap-1.5 text-xs text-white/80">
                                    <Lock className="h-3 w-3" />
                                    Pembayaran aman, konfirmasi otomatis lewat email.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}