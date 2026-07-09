import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Clock } from 'lucide-react';
import { home } from '@/routes';

export default function Checkout() {
    return (
        <>
            <Head title="Checkout, Segera Hadir" />

            <div className="flex min-h-screen flex-col items-center justify-center bg-lp-bg px-4 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gradient-to-br from-lp-primary to-lp-primary-2">
                    <Clock className="h-8 w-8 text-white" />
                </div>

                <h1 className="mt-6 text-3xl font-bold text-lp-text">
                    Halaman Checkout Segera Hadir
                </h1>
                <p className="mt-3 max-w-md text-lp-text-muted">
                    Kami sedang menyiapkan proses pembayaran untuk webinar The
                    Silent Conversion Leak. Terima kasih sudah menunjukkan minat
                    kamu.
                </p>

                <Link
                    href={home()}
                    className="mt-8 flex items-center gap-2 text-sm font-medium text-lp-primary-ink transition-colors hover:text-lp-text"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Kembali ke halaman utama
                </Link>
            </div>
        </>
    );
}
