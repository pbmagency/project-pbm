import CtaButton from '@/components/mini-audit/CtaButton';
import { motion } from 'framer-motion';
import { XCircle } from 'lucide-react';

const PROBLEMS = [
    {
        title: 'Frustrasi melihat budget iklan ratusan ribu hingga jutaan rupiah ludes setiap hari, tapi ROAS terus nyungsep dan WA tetap sepi.',
    },
    {
        title: 'Bingung kenapa traffic website sudah tinggi, tapi ujung-ujungnya pengunjung cuma numpang lewat tanpa melakukan pembelian.',
    },
    {
        title: 'Kesal meladeni banyak chat yang masuk ke WA, tapi ujung-ujungnya cuma tanya-tanya doang tanpa pernah ada closing sama sekali.',
    },
    {
        title: 'Stres menebak-nebak bagian mana dari landing page Anda yang salah, sampai-sampai calon pembeli malah lari ke kompetitor.',
    },
];

const AGITATION_TEXT = {
    intro: 'Bayangkan jika "kebocoran" ini terus Anda biarkan.',
    body: 'Bulan ini boncos',
    amount1: '2 juta',
    mid: '... Bulan depan',
    amount2: '10 juta',
    question:
        '... Sampai kapan Anda mau bertaruh dan membuang-buang peluru untuk eksperimen iklan yang gagal?',
    closing:
        'Semakin lama Anda membiarkan landing page yang buruk, semakin banyak calon pembeli yang Anda serahkan ke tangan kompetitor.',
};

const BRIDGING_TEXT = {
    intro: 'Tapi tenang... Anda tidak perlu lagi menguras isi rekening dan menebak-nebak letak kesalahannya!',
    body: 'Semua kebocoran fatal di website Anda akan',
    highlight: 'SAYA BONGKAR',
    bodyEnd: 'dan berikan solusinya di sesi audit kali ini!',
};

export default function BleedingNeckSection() {
    return (
        <section className="w-full max-w-5xl px-4 py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <span className="mb-3 inline-block font-mono text-xs tracking-widest text-lp-danger uppercase">
                    // PAIN POINTS
                </span>
                <h2 className="text-2xl font-bold text-lp-text sm:text-3xl lg:text-4xl">
                    Apakah Anda Sedang Mengalami Ini?
                </h2>
            </motion.div>

            <div className="grid gap-4 sm:grid-cols-2">
                {PROBLEMS.map((problem, i) => (
                    <motion.div
                        key={i}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-30px' }}
                        transition={{ duration: 0.4, delay: i * 0.15 }}
                        className="flex items-center gap-4 rounded-xl border border-lp-danger/20 bg-lp-danger/5 p-6"
                    >
                        <XCircle className="h-8 w-8 shrink-0 text-lp-danger" />

                        <h3 className="text-sm leading-relaxed text-lp-text">
                            {problem.title}
                        </h3>
                    </motion.div>
                ))}
            </div>

            {/* Agitasi */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mt-10 rounded-r-xl border-l-4 border-lp-danger/60 bg-lp-danger/5 px-6 py-5"
            >
                <p className="text-sm leading-relaxed text-lp-text-muted italic md:text-base">
                    {AGITATION_TEXT.intro} {AGITATION_TEXT.body}{' '}
                    <span className="font-bold text-lp-danger">
                        {AGITATION_TEXT.amount1}
                    </span>
                    {AGITATION_TEXT.mid}{' '}
                    <span className="font-bold text-lp-danger">
                        {AGITATION_TEXT.amount2}
                    </span>
                    {AGITATION_TEXT.question}
                </p>
                <p className="mt-3 text-sm leading-relaxed font-bold text-lp-text md:text-base">
                    {AGITATION_TEXT.closing}
                </p>
            </motion.div>

            {/* Bridging */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="mt-6 rounded-r-xl border-l-4 border-lp-primary/60 bg-lp-primary/5 px-6 py-5"
            >
                <p className="text-sm leading-relaxed text-lp-text-muted md:text-base">
                    {BRIDGING_TEXT.intro} {BRIDGING_TEXT.body}{' '}
                    <span className="font-bold text-lp-primary uppercase">
                        {BRIDGING_TEXT.highlight}
                    </span>{' '}
                    {BRIDGING_TEXT.bodyEnd}
                </p>
            </motion.div>

            <CtaButton className="mt-10" />
        </section>
    );
}
