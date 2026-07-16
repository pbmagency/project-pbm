import CtaButton from '@/components/mini-audit/CtaButton';
import { motion } from 'framer-motion';
import { Instagram } from 'lucide-react';

/* ─── Copy Constants ─── */

const AUTHOR_NAME = 'Justin Wijaya';
const AUTHOR_TITLE = 'Tech Entrepreneur & Content Creator';
const AUTHOR_IG = '@justinwijaya._';
const AUTHOR_FOLLOWERS = '21.3K Followers';

const PARAGRAPHS = [
    <>
        Selama 5 tahun di industri digital dan membuat hampir ratusan website,
        saya melihat pola yang sama berulang kali:{' '}
        <strong className="text-lp-text">
            Banyak pebisnis boncos miliaran rupiah karena memisahkan dua hal
            yang seharusnya menyatu.
        </strong>
    </>,
    <>
        <span className="font-semibold text-lp-danger">Web Developer</span>{' '}
        biasanya cuma peduli membuat website terlihat cantik.
    </>,
    <>
        <span className="font-semibold text-lp-danger">Advertiser</span>{' '}
        biasanya cuma peduli mencari traffic semurah mungkin.
    </>,
    <>
        Hasilnya? Website estetik, traffic ramai, tapi{' '}
        <strong className="text-lp-danger">
            konversi (sales) NOL besar.
        </strong>
    </>,
    <>
        Saya hadir untuk menjembatani jurang tersebut. Saya memahami{' '}
        <span className="text-gradient font-semibold">Bahasa Coding</span>{' '}
        sekaligus{' '}
        <span className="text-gradient font-semibold">Bahasa Penjualan</span>.
    </>,
    <>
        Bagi saya, Landing Page bukan sekadar brosur digital, melainkan sebuah
        Marketing Funnel (Mesin Sales). Di sesi audit nanti, saya akan gunakan
        pengalaman saya untuk bantu optimalkan konversi website Anda
    </>,
];

export default function AuthoritySection() {
    return (
        <section className="w-full max-w-5xl px-4 py-16 md:py-24">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mb-10 text-center"
            >
                <span className="mb-3 inline-block font-mono text-xs tracking-widest text-lp-primary uppercase">
                    // ABOUT
                </span>
                <h2 className="text-2xl font-bold text-lp-text sm:text-3xl lg:text-4xl">
                    Siapa yang Akan Membedah Website Anda?
                </h2>
            </motion.div>

            <div className="grid items-center gap-8 md:grid-cols-[350px_1fr] lg:grid-cols-[380px_1fr]">
                {/* Avatar Image */}
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5 }}
                    className="mx-auto w-full max-w-[350px] md:mx-0"
                >
                    <img
                        src="/storage/mentor/justin.jpg"
                        alt={AUTHOR_NAME}
                        loading="lazy"
                        width={350}
                        height={350}
                        className="aspect-square w-full rounded-2xl border border-lp-border-soft object-cover"
                    />
                </motion.div>

                {/* Copy */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.15 }}
                >
                    <h3 className="mb-1 text-xl font-bold text-lp-text sm:text-2xl">
                        {AUTHOR_NAME}
                    </h3>
                    <p className="mb-3 text-sm font-medium text-lp-primary">
                        {AUTHOR_TITLE}
                    </p>
                    <div className="mb-5 flex items-center gap-2 text-sm text-lp-text-muted">
                        <Instagram className="h-4 w-4 text-lp-primary" />
                        <span>{AUTHOR_IG}</span>
                        <span className="text-xs font-semibold text-lp-primary">
                            · {AUTHOR_FOLLOWERS}
                        </span>
                    </div>

                    <div className="mb-6 space-y-4 border-l-2 border-lp-primary/50 pl-5">
                        {PARAGRAPHS.map((p, i) => (
                            <p
                                key={i}
                                className="text-sm leading-relaxed text-lp-text-muted sm:text-base"
                            >
                                {p}
                            </p>
                        ))}
                    </div>
                </motion.div>
            </div>

            <CtaButton className="mt-10" />
        </section>
    );
}
