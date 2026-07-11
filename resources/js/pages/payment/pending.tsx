import { Head } from '@inertiajs/react';
import { ArrowLeft, Clock, MessageCircle } from 'lucide-react';
import { home } from '@/routes';

interface PaymentPendingProps {
    order_number?: string;
}

const WA_SUPPORT = 'https://wa.me/628XXXXXXXXXX?text=' + encodeURIComponent('Halo, pembayaran saya untuk webinar The Silent Conversion Leak masih pending.');

export default function PaymentPending({ order_number }: PaymentPendingProps) {
    return (
        <>
            <Head title="Pembayaran Diproses — The Silent Conversion Leak" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-lp-bg px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lp-amber-soft">
                            <Clock className="h-10 w-10 text-lp-amber" />
                        </div>
                    </div>

                    <h1 className="mt-6 font-display text-3xl font-extrabold text-lp-text">
                        Pembayaran Sedang Diproses
                    </h1>
                    <p className="mt-3 text-lp-text-muted">
                        Pembayaranmu sedang dalam proses verifikasi.
                        Konfirmasi akan dikirim ke email kamu setelah berhasil.
                    </p>

                    {order_number && (
                        <p className="mt-2 font-mono text-sm text-lp-text-dim">
                            No. Order: {order_number}
                        </p>
                    )}

                    <div className="mt-8 space-y-3">
                        <a
                            href={WA_SUPPORT}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl border border-lp-border bg-lp-bg-elevated py-4 text-base font-bold text-lp-text transition hover:border-[#25D366] hover:-translate-y-0.5"
                        >
                            <MessageCircle className="h-5 w-5 text-[#25D366]" />
                            Hubungi Support WhatsApp
                        </a>

                        <a
                            href={home() as string}
                            className="flex w-full items-center justify-center gap-2 py-3 text-sm text-lp-text-dim transition hover:text-lp-text"
                        >
                            <ArrowLeft className="h-4 w-4" />
                            Kembali ke beranda
                        </a>
                    </div>
                </div>
            </div>
        </>
    );
}
