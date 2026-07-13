import { Head, useForm } from '@inertiajs/react';
import {
    AlertCircle,
    ArrowLeft,
    CheckCircle,
    Lock,
    MessageCircle,
    Shield,
    Star,
    Users,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/use-analytics';
import { home } from '@/routes';

interface CheckoutProps {
    price: number;
    originalPrice: number;
}

function formatRupiah(amount: number): string {
    return 'Rp' + amount.toLocaleString('id-ID');
}

export default function Checkout({ price, originalPrice }: CheckoutProps) {
    const { trackLeadConversion } = useAnalytics();

    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        phone: '',
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        post('/checkout', {
            onSuccess: (page) => {
                trackLeadConversion();
                const redirectUrl = (page.props as { redirect_url?: string }).redirect_url;
                if (redirectUrl) {
                    window.location.href = redirectUrl;
                }
            },
        });
    };

    const discount = originalPrice - price;
    const discountPct = Math.round((discount / originalPrice) * 100);

    return (
        <>
            <Head title="Checkout — The Silent Conversion Leak" />

            <div className="min-h-screen bg-lp-bg px-4 py-8 sm:py-12">
                <div className="mx-auto max-w-5xl">
                    {/* Back link */}
                    <a
                        href={home().url}
                        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-lp-text-dim transition-colors hover:text-lp-text"
                    >
                        <ArrowLeft className="h-4 w-4" />
                        Kembali ke halaman utama
                    </a>

                    <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
                        {/* Left: Form */}
                        <div className="rounded-2xl border border-lp-border bg-lp-bg-elevated p-7 sm:p-9">
                            <h1 className="font-display text-2xl font-bold text-lp-text">
                                Lengkapi Data Diri
                            </h1>
                            <p className="mt-1 text-sm text-lp-text-muted">
                                Detail event & akses digital dikirim otomatis ke email setelah pembayaran.
                            </p>

                            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-lp-text">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        value={data.name}
                                        onChange={(e) => setData('name', e.target.value)}
                                        placeholder="Nama kamu"
                                        className="w-full rounded-xl border border-lp-border bg-lp-bg px-4 py-3 text-sm text-lp-text placeholder-lp-text-dim outline-none transition focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/20"
                                    />
                                    {errors.name && (
                                        <p className="mt-1 flex items-center gap-1 text-xs text-lp-danger">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.name}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-lp-text">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        value={data.email}
                                        onChange={(e) => setData('email', e.target.value)}
                                        placeholder="email@kamu.com"
                                        className="w-full rounded-xl border border-lp-border bg-lp-bg px-4 py-3 text-sm text-lp-text placeholder-lp-text-dim outline-none transition focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/20"
                                    />
                                    {errors.email && (
                                        <p className="mt-1 flex items-center gap-1 text-xs text-lp-danger">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.email}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="mb-1.5 block text-sm font-medium text-lp-text">
                                        Nomor WhatsApp
                                    </label>
                                    <input
                                        type="tel"
                                        value={data.phone}
                                        onChange={(e) => setData('phone', e.target.value)}
                                        placeholder="08xxxxxxxxxx"
                                        className="w-full rounded-xl border border-lp-border bg-lp-bg px-4 py-3 text-sm text-lp-text placeholder-lp-text-dim outline-none transition focus:border-lp-primary focus:ring-2 focus:ring-lp-primary/20"
                                    />
                                    {errors.phone && (
                                        <p className="mt-1 flex items-center gap-1 text-xs text-lp-danger">
                                            <AlertCircle className="h-3 w-3" />
                                            {errors.phone}
                                        </p>
                                    )}
                                </div>

                                <Button
                                    type="submit"
                                    disabled={processing}
                                    className="mt-2 h-auto w-full rounded-2xl bg-gradient-to-br from-lp-primary to-lp-primary-2 py-4 text-base font-bold text-white shadow-[0_16px_32px_-12px_oklch(0.62_0.20_224/0.5)] transition hover:-translate-y-0.5 disabled:opacity-70"
                                >
                                    {processing ? 'Memproses...' : `Bayar Sekarang — ${formatRupiah(price)}`}
                                </Button>

                                <div className="flex items-center justify-center gap-1.5 text-xs text-lp-text-dim">
                                    <Lock className="h-3 w-3" />
                                    Pembayaran aman & terenkripsi
                                </div>
                            </form>
                        </div>

                        {/* Right: Order Summary */}
                        <div className="space-y-4">
                            {/* Product card */}
                            <div className="rounded-2xl border border-lp-border bg-lp-bg-elevated p-6">
                                <p className="font-mono text-[10px] tracking-widest text-lp-text-dim uppercase">
                                    Ringkasan Pesanan
                                </p>
                                <h2 className="mt-3 font-display text-lg font-bold leading-snug text-lp-text">
                                    Webinar The Silent Conversion Leak
                                </h2>

                                <ul className="mt-4 space-y-2">
                                    {[
                                        'Live Session & Rekaman Webinar',
                                        'Ebook Bonus: Iklan Sudah Jalan, Tapi Kok Tetap Boncos?',
                                        'Akses Tanya Jawab Langsung',
                                        'Kesempatan Funnel Audit Gratis',
                                    ].map((item) => (
                                        <li key={item} className="flex items-start gap-2 text-sm text-lp-text-muted">
                                            <CheckCircle className="mt-0.5 h-4 w-4 shrink-0 text-lp-primary-ink" />
                                            {item}
                                        </li>
                                    ))}
                                </ul>

                                <div className="mt-5 border-t border-lp-border pt-5">
                                    <div className="flex items-center justify-between text-sm text-lp-text-dim">
                                        <span>Harga normal</span>
                                        <span className="line-through">{formatRupiah(originalPrice)}</span>
                                    </div>
                                    <div className="mt-1 flex items-center justify-between text-sm text-green-400">
                                        <span>Diskon early bird</span>
                                        <span>-{formatRupiah(discount)} ({discountPct}%)</span>
                                    </div>
                                    <div className="mt-3 flex items-center justify-between font-display font-bold">
                                        <span className="text-lp-text">Total</span>
                                        <span className="text-xl text-lp-text">{formatRupiah(price)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Trust badges */}
                            <div className="rounded-2xl border border-lp-border bg-lp-bg-elevated p-5 space-y-3">
                                {[
                                    { icon: Users, label: 'Dipercaya 100+ Bisnis' },
                                    { icon: Star, label: 'Rating 4.9/5 dari peserta' },
                                    { icon: Shield, label: 'Garansi kepuasan 100%' },
                                    { icon: MessageCircle, label: 'Detail event dikirim otomatis via email' },
                                ].map(({ icon: Icon, label }) => (
                                    <div key={label} className="flex items-center gap-3 text-sm text-lp-text-muted">
                                        <Icon className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                        {label}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}