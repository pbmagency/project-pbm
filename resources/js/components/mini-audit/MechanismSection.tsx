import CtaButton from '@/components/mini-audit/CtaButton';
import { motion } from 'framer-motion';
import {
    Brain,
    CheckCircle,
    Search,
    Wrench,
    type LucideIcon,
} from 'lucide-react';

const BENEFITS: { icon: LucideIcon; title: string; description: string }[] = [
    {
        icon: Search,
        title: 'APA yang Masih Kurang',
        description:
            'Saya akan tunjukkan bagian atau elemen mana yang membuat pengunjung kabur dari website Anda.',
    },
    {
        icon: Brain,
        title: 'MENGAPA Itu Membunuh Konversi',
        description:
            'Penjelasan mengapa copywriting atau desain Anda saat ini yang mungkin kurang efektif untuk calon pembeli.',
    },
    {
        icon: Wrench,
        title: 'BAGAIMANA Cara Memperbaikinya',
        description:
            'Langkah step-by-step yang praktis. Anda (atau tim developer Anda) bisa langsung mengeksekusinya HARI INI juga.',
    },
];

const DREAM_OUTCOMES: { title: string }[] = [
    {
        title: 'Omset Meroket Hingga 2X Lipat – Tanpa harus menaikkan budget iklan harian Anda sepeser pun!',
    },
    {
        title: 'Selamat Tinggal Iklan Boncos – Traffic iklan yang masuk akhirnya benar-benar berubah menjadi hot leads dan melakukan pembelian.',
    },
    {
        title: 'Biaya Iklan (CPA) Makin Murah – Konversi membaik, biaya per hasil (CPR) otomatis terjun bebas.',
    },
    {
        title: 'Kompetitor Gigit Jari – Penawaran Anda jadi terlalu menarik untuk ditolak, membuat calon pembeli berhenti membandingkan harga dengan toko sebelah.',
    },
];

export default function MechanismSection() {
    return (
        <section className="w-full max-w-5xl px-4 py-16 md:py-24">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mb-12 text-center"
            >
                <span className="mb-3 inline-block font-mono text-xs tracking-widest text-lp-primary uppercase">
                    // BENEFIT
                </span>
                <h2 className="mb-3 text-2xl font-bold text-lp-text sm:text-3xl lg:text-4xl">
                    Konsultasi 1-on-1 Gratis Untuk
                    <br />
                    <span className="text-gradient">Bedah Website Anda</span>
                </h2>
                <p className="text-sm text-lp-text-muted sm:text-base">
                    Dalam sesi konsultasi 1-on-1 berdurasi maksimal 30 menit,
                    kami akan membongkar:
                </p>
            </motion.div>

            {/* Benefit Cards */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4 }}
                className="mb-6 text-center text-lg font-semibold text-lp-text sm:text-xl"
            >
                Yang Akan Saya Bongkar di Website Anda
            </motion.h3>

            <div className="mx-auto grid max-w-4xl grid-cols-1 gap-5 md:grid-cols-3">
                {BENEFITS.map((item, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 25 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.4, delay: i * 0.12 }}
                        className="rounded-2xl border-glow bg-lp-bg-elevated/50 p-6 text-center backdrop-blur-sm"
                    >
                        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-lp-primary/10">
                            <item.icon className="h-6 w-6 text-lp-primary" />
                        </div>
                        <h4 className="mb-2 text-sm font-bold text-lp-text">
                            {item.title}
                        </h4>
                        <p className="text-xs leading-relaxed text-lp-text-muted sm:text-sm">
                            {item.description}
                        </p>
                    </motion.div>
                ))}
            </div>

            {/* Dream Outcomes */}
            <motion.h3
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.4 }}
                className="mt-14 mb-6 text-center text-lg font-semibold text-lp-text sm:text-xl"
            >
                Hasil yang Bisa Anda Raih Setelah Optimasi
            </motion.h3>

            <div className="mx-auto max-w-3xl rounded-2xl border-glow bg-lp-bg-elevated/50 p-6 backdrop-blur-sm sm:p-8">
                <div className="space-y-5">
                    {DREAM_OUTCOMES.map((item, i) => (
                        <motion.div
                            key={i}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{ duration: 0.4, delay: i * 0.1 }}
                            className="flex gap-4"
                        >
                            <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-green-500" />
                            <p className="text-sm font-medium text-lp-text md:text-base">
                                {item.title}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>

            <CtaButton className="mt-10" />
        </section>
    );
}
