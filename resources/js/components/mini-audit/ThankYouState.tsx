import { motion } from 'framer-motion';
import { CheckCircle, Clock, Mail } from 'lucide-react';

export default function ThankYouState() {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="space-y-6 py-8 text-center"
        >
            <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
                className="mx-auto flex h-20 w-20 items-center justify-center rounded-full border-2 border-lp-primary/30 bg-lp-primary/10"
            >
                <CheckCircle className="h-10 w-10 text-lp-primary" />
            </motion.div>

            <div className="space-y-2">
                <h2 className="text-2xl font-bold text-lp-text">
                    Form Anda Diterima! 🎉
                </h2>
                <p className="mx-auto max-w-md text-lp-text-muted">
                    Terima kasih telah mengisi formulir konsultasi. Website Anda
                    telah masuk ke antrian audit kami.
                </p>
            </div>

            <div className="glass mx-auto max-w-sm space-y-4 rounded-xl border border-lp-border-soft p-6">
                <div className="flex items-center gap-3 text-left">
                    <Clock className="h-5 w-5 shrink-0 text-lp-primary" />
                    <p className="text-sm text-lp-text">
                        Tim kami akan menghubungi anda melalui WhatsApp dalam{' '}
                        <strong>1x24 jam</strong> untuk buat jadwal konsultasi
                        (Google Meet/Zoom)
                    </p>
                </div>

                <div className="flex items-center gap-3 text-left">
                    <Mail className="h-5 w-5 shrink-0 text-lp-primary" />
                    <p className="text-sm text-lp-text-muted">
                        Pastikan nomor WhatsApp yang Anda berikan aktif dan
                        dapat menerima pesan.
                    </p>
                </div>
            </div>
        </motion.div>
    );
}
