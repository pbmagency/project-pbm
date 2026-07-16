import CtaButton from '@/components/mini-audit/CtaButton';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

const FAQ_ITEMS = [
    {
        id: 'what',
        question: 'Apa yang akan saya dapatkan?',
        answer: 'Anda akan menerima konsultasi 1-on-1 untuk bedah landing page anda secara gratis via zoom. Konsultasi berdurasi maksimal 30 menit. Tim kami akan tunjukkan Kebocoran Fatal pada Landing Page Anda, serta saran perbaikan sehingga conversion anda bisa langsung naik.',
    },
    {
        id: 'free',
        question: 'Apakah audit ini benar-benar gratis?',
        answer: 'Ya, 100% gratis tanpa biaya tersembunyi. Kami memberikan konsultasi bedah landing page secara personal sebagai bentuk komitmen kami membantu bisnis Anda berkembang.',
    },
    {
        id: 'duration',
        question: 'Berapa lama hasil audit akan saya terima?',
        answer: 'Tim kami akan menghubungi anda melalui whatsapp untuk buat jadwal konsultasi dalam waktu 1x24 jam setelah form dikirim.',
    },
    {
        id: 'data',
        question: 'Apakah data saya aman?',
        answer: 'Tentu saja. Data Anda hanya digunakan untuk keperluan audit dan tidak akan dibagikan ke pihak ketiga. Kami menjaga privasi Anda dengan serius.',
    },
    {
        id: 'after',
        question: 'Apakah audit ini cocok untuk niche bisnis saya?',
        answer: 'Ya, tehnik optimasi konversi berlaku universal. Kami sudah membedah berbagai jenis landing page mulai dari e-commerce, produk digital, B2B & B2C, online course, hingga properti. Selama Anda punya traffic tapi konversinya belum optimal, audit ini relevan untuk Anda.',
    },
    {
        id: 'slot',
        question: 'Kenapa hanya 5 slot per minggu?',
        answer: 'Kami membatasi jumlah audit agar bisa memberikan analisis mendalam dan personal untuk setiap website. Kualitas adalah prioritas kami.',
    },
    {
        id: 'service',
        question:
            'Apakah Anda akan langsung memperbaiki (mengedit) website saya?',
        answer: 'Konsultasi ini sifatnya adalah Diagnosa Strategis, bukan jasa perbaikan langsung. Anda akan mendapatkan panduan "Apa" yang salah dan "Bagaimana" cara memperbaikinya. Namun jika setelah konsultasi, Anda ingin kami yang membereskannya sampai tuntas, kami memiliki layanan khusus untuk itu.',
    },
    {
        id: 'result',
        question: 'Hasil apa yang bisa saya harapkan setelah audit?',
        answer: 'Banyak klien kami kaget bahwa hanya dengan mengubah 1 Headline atau memindahkan posisi tombol CTA (berdasarkan saran audit), konversi mereka bisa naik signifikan. Tujuannya adalah menghentikan budget iklan Anda yang boncos secepat mungkin.',
    },
];

export default function MiniAuditFAQ() {
    const [openFaqId, setOpenFaqId] = useState<string | null>(null);

    return (
        <section className="w-full max-w-3xl px-4 py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <span className="mb-3 inline-block font-mono text-xs tracking-widest text-lp-primary uppercase">
                    // FAQ
                </span>
                <h2 className="text-2xl font-bold text-lp-text sm:text-3xl lg:text-4xl">
                    Pertanyaan yang Sering Ditanyakan
                </h2>
            </motion.div>

            <div className="space-y-3">
                {FAQ_ITEMS.map((faq) => (
                    <motion.div
                        key={faq.id}
                        initial={{ opacity: 0, y: 10 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3 }}
                        className="rounded-xl border border-lp-border-soft bg-lp-bg-elevated/30 backdrop-blur-sm"
                    >
                        <button
                            type="button"
                            onClick={() =>
                                setOpenFaqId(
                                    openFaqId === faq.id ? null : faq.id,
                                )
                            }
                            className="flex w-full items-center justify-between px-5 py-4 text-left"
                        >
                            <span className="pr-4 text-sm font-medium text-lp-text">
                                {faq.question}
                            </span>
                            <motion.div
                                animate={{
                                    rotate: openFaqId === faq.id ? 180 : 0,
                                }}
                                transition={{ duration: 0.2 }}
                            >
                                <ChevronDown className="h-4 w-4 shrink-0 text-lp-text-muted" />
                            </motion.div>
                        </button>
                        <AnimatePresence>
                            {openFaqId === faq.id && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <p className="px-5 pb-4 text-sm text-lp-text-muted">
                                        {faq.answer}
                                    </p>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </motion.div>
                ))}
            </div>

            <CtaButton className="mt-10" />
        </section>
    );
}
