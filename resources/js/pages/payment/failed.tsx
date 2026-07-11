import { Head } from '@inertiajs/react';
import { AlertCircle, ArrowLeft, MessageCircle } from 'lucide-react';
import { home } from '@/routes';

interface PaymentFailedProps {
    order_number?: string;
}

const WA_SUPPORT = 'https://wa.me/6285931018333?text=' + encodeURIComponent('Halo, saya mengalami masalah pembayaran untuk webinar The Silent Conversion Leak.');

export default function PaymentFailed({ order_number }: PaymentFailedProps) {
    return (
        <>
            <Head title="Pembayaran Gagal — The Silent Conversion Leak" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-lp-bg px-4 py-12">
                <div className="w-full max-w-md text-center">
                    <div className="flex justify-center">
                        <div className="flex h-20 w-20 items-center justify-center rounded-full bg-lp-danger-soft">
                            <AlertCircle className="h-10 w-10 text-lp-danger" />
                        </div>
                    </div>

                    <h1 className="mt-6 font-display text-3xl font-extrabold text-lp-text">
                        Pembayaran Gagal
                    </h1>
                    <p className="mt-3 text-lp-text-muted">
                        Maaf, pembayaranmu tidak berhasil diproses.
                        Jangan khawatir — kamu bisa mencoba lagi atau hubungi kami untuk bantuan.
                    </p>

                    {order_number && (
                        <p className="mt-2 font-mono text-sm text-lp-text-dim">
                            No. Order: {order_number}
                        </p>
                    )}

                    <div className="mt-8 space-y-3">
                        <a
                            href="/checkout"
                            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-lp-primary to-lp-primary-2 py-4 text-base font-bold text-white shadow-[0_16px_32px_-12px_oklch(0.62_0.20_224/0.5)] transition hover:-translate-y-0.5"
                        >
                            Coba Lagi
                        </a>

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
                            href={home().url}
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
