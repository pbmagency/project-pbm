import { Head } from '@inertiajs/react';
import { BookOpen, Calendar, CheckCircle, MessageCircle } from 'lucide-react';
import { useEffect } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { home } from '@/routes';

interface OrderData {
    order_number: string;
    name: string;
    email: string;
    amount: number;
}

interface PaymentSuccessProps {
    order: OrderData;
}

function formatRupiah(amount: number): string {
    return 'Rp' + amount.toLocaleString('id-ID');
}

export default function PaymentSuccess({ order }: PaymentSuccessProps) {
    const { trackPayment } = useAnalytics();

    useEffect(() => {
        // Client-side Purchase pixel (deduped with CAPI via event_id)
        const eventId = 'purchase-' + order.order_number;
        window.fbq?.(
            'track',
            'Purchase',
            { value: order.amount, currency: 'IDR' },
            { eventID: eventId },
        );

        trackPayment('success', {
            order_number: order.order_number,
            amount: order.amount,
            event_id: eventId,
        });
    }, []);

    const WA_GROUP_URL = 'https://chat.whatsapp.com/PLACEHOLDER';
    const EBOOK_URL = '/PBM_Ebook_Boncos.pdf';

    return (
        <>
            <Head title="Pembayaran Berhasil — The Silent Conversion Leak" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-lp-bg px-4 py-12">
                <div className="w-full max-w-md">
                    {/* Success icon */}
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-emerald-500 shadow-[0_16px_40px_-12px_rgba(52,211,153,0.5)]">
                            <CheckCircle className="h-10 w-10 text-white" strokeWidth={2.5} />
                        </div>
                    </div>

                    <div className="mt-6 text-center">
                        <h1 className="font-display text-3xl font-extrabold text-lp-text">
                            Pembayaran Berhasil! 🎉
                        </h1>
                        <p className="mt-2 text-lp-text-muted">
                            Hai <strong className="text-lp-text">{order.name}</strong>, selamat kamu resmi terdaftar!
                        </p>
                    </div>

                    {/* Order summary */}
                    <div className="mt-8 rounded-2xl border border-lp-border bg-lp-bg-elevated p-6">
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-lp-text-dim">No. Order</span>
                                <span className="font-mono font-medium text-lp-text">{order.order_number}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-lp-text-dim">Total Bayar</span>
                                <span className="font-bold text-lp-text">{formatRupiah(order.amount)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-lp-text-dim">Konfirmasi dikirim ke</span>
                                <span className="text-lp-text">{order.email}</span>
                            </div>
                        </div>
                    </div>
                    {/* Email notice */}
                    <div className="mt-6 rounded-2xl border border-lp-border bg-lp-bg-elevated px-5 py-4 text-center">
                        <p className="text-base font-semibold text-lp-text">
                            Cek email kamu sekarang!
                        </p>
                        <p className="mt-1 text-sm text-lp-text-muted">
                            Info webinar & akses ebook bonus sudah dikirim ke{' '}
                            <strong className="text-lp-text">{order.email}</strong>
                        </p>
                    </div>
                    {/* CTAs */}
                    <div className="mt-6 space-y-3">
                        <a
                            href={WA_GROUP_URL}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#25D366] py-4 text-base font-bold text-white shadow-[0_8px_24px_-8px_rgba(37,211,102,0.5)] transition hover:-translate-y-0.5"
                        >
                            <MessageCircle className="h-5 w-5" />
                            Bergabung ke WhatsApp Group
                        </a>

                        <a
                            href={EBOOK_URL}
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lp-border bg-lp-bg-elevated py-4 text-base font-bold text-lp-text transition hover:border-lp-primary hover:-translate-y-0.5"
                        >
                            <BookOpen className="h-5 w-5 text-lp-primary-ink" />
                            Download Ebook Bonus
                        </a>

                        <a
                            href={`https://www.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Webinar: The Silent Conversion Leak')}&details=${encodeURIComponent('Order: ' + order.order_number)}&location=${encodeURIComponent('Online via Zoom')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lp-border bg-lp-bg-elevated py-3.5 text-sm font-medium text-lp-text-muted transition hover:border-lp-border hover:text-lp-text"
                        >
                            <Calendar className="h-4 w-4" />
                            Tambahkan ke Google Calendar
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
