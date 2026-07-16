import CtaButton from '@/components/mini-audit/CtaButton';
import YouTubeEmbed from '@/components/mini-audit/YouTubeEmbed';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';
import {
    AlertTriangle,
    Play,
    Search,
    TrendingDown,
    TrendingUp,
    Trophy,
    User,
    Wrench,
} from 'lucide-react';
import type { ReactNode } from 'react';

/* ─── Data Constants ─── */

const CLIENT_NAME = 'Tsania Latheefa';
const CLIENT_TITLE = 'Canvassador & Impactful Digital Creator';
const CLIENT_AVATAR = '/storage/testimonials/tsan-thumb.png';
const CLIENT_STATS = [
    { value: '13+', label: 'Tahun Praktisi' },
    { value: '1.200+', label: 'Murid Aktif' },
    { value: '52.8K', label: 'Followers IG' },
];
const CLIENT_QUOTE =
    'Ya Alhamdulillah sih ya, yang biasanya di lynk.id kemarin itu 20 juta (per bulan), naik 10 juta, 30 juta sekarang di gumpreneur.id.. bahkan lebih ya';

const REVENUE_BEFORE = 'Rp 15 - 20 Juta';
const REVENUE_AFTER = 'Rp 30 Juta++';
const REVENUE_MULTIPLIER = '50%';

const PROOF_CAPTION =
    'Bukti nyata. Traffic yang sama, dialirkan ke halaman yang berbeda, menghasilkan angka yang jauh berbeda.';

const IMAGE_BEFORE = '/storage/study-case/before.webp';
const IMAGE_AFTER = '/storage/study-case/after.webp';

const VIDEO_ID = 'oH9KY_M8KQY';
const VIDEO_CTA_TEXT = 'Ini Cerita Langsung dari Tsania:';

interface TimelineItem {
    label: string;
    icon: LucideIcon;
    dotColor: string;
    iconColor: string;
    title: string;
    paragraphs: ReactNode[];
}

const TIMELINE_ITEMS: TimelineItem[] = [
    {
        label: 'CHAPTER 1',
        icon: AlertTriangle,
        dotColor: ' border-lp-danger',
        iconColor: 'text-lp-danger',
        title: 'Masalahnya',
        paragraphs: [
            <>
                Kenalkan, ini {CLIENT_NAME}. Seorang content creator Instagram
                yang rajin membangun audiens hingga mencapai{' '}
                <strong className="text-lp-primary">52.8K followers</strong>.
                Secara logika, dengan followers sebanyak itu, jualan apa pun
                harusnya laris manis, bukan?
            </>,
            <>
                Tapi realitanya jauh dari kata manis. Hampir setiap hari pusing
                memikirkan ide konten. Tiap postingan dan story selalu
                mengarahkan audiens untuk klik link di bio. Klik yang masuk?
                Banyak banget. Traffic-nya deras.
            </>,
            <>
                <strong className="text-lp-danger">
                    TAPI, pas buka dashboard penjualan... angkanya stuck di Rp
                    15–20 Juta per bulan.
                </strong>{' '}
                Frustrasi? Jelas. Rasanya capek bikin konten mati-matian,
                traffic masuk belasan ribu, tapi ujung-ujungnya pengunjung cuma
                numpang lewat tanpa mentransfer uang sepeser pun.
            </>,
        ],
    },
    {
        label: 'CHAPTER 2',
        icon: Search,
        dotColor: ' border-lp-primary',
        iconColor: 'text-lp-primary',
        title: 'Kebocoran Fatal',
        paragraphs: [
            <>
                Tsania datang kepada kami. Setelah kami analisis, ternyata
                masalahnya{' '}
                <strong className="text-lp-primary">BUKAN pada produknya</strong>
                , dan{' '}
                <strong className="text-lp-primary">
                    BUKAN pada kurangnya traffic
                </strong>
                .
            </>,
            <>
                Masalahnya murni ada di{' '}
                <strong className="text-lp-primary">"Wadah"-nya</strong>. Halaman
                link-in-bio yang ia gunakan terlalu kaku, tidak punya alur
                copywriting yang menggiring emosi, dan gagal meyakinkan
                pengunjung di detik-detik kritis sebelum checkout.
            </>,
        ],
    },
    {
        label: 'CHAPTER 3',
        icon: Wrench,
        dotColor: ' border-lp-primary',
        iconColor: 'text-lp-primary',
        title: 'Proses Bedah Total',
        paragraphs: [
            <>
                Kami bongkar halaman penawaran Tsania. Kami rapikan strukturnya,
                kami percepat loading-nya, dan kami tanamkan{' '}
                <strong className="text-lp-primary">
                    copywriting yang membuat penawarannya mustahil untuk ditolak
                </strong>
                .
            </>,
        ],
    },
    {
        label: 'CHAPTER 4',
        icon: Trophy,
        dotColor: ' border-green-500',
        iconColor: 'text-green-500',
        title: 'Hasilnya? Angka yang Bicara.',
        paragraphs: [
            <>
                Tanpa menambah jumlah followers, tanpa mengubah produk, dan
                tanpa ngiklan gila-gilaan... persentase konversinya meledak.
            </>,
            <>
                Hanya dalam hitungan minggu, omsetnya meroket hingga menembus{' '}
                <span className="text-gradient font-bold">
                    {REVENUE_AFTER} per Bulan
                </span>
                , dan bahkan lebih! Naik Lebih Dari{' '}
                <span className="text-gradient font-bold">
                    {REVENUE_MULTIPLIER}
                </span>{' '}
                hanya dengan membenahi satu hal:{' '}
                <strong className="text-lp-primary">Landing Page</strong>.
            </>,
        ],
    },
];

/* ─── Component ─── */

export default function TestimoniSection() {
    return (
        <section className="w-full max-w-4xl px-4 py-16 md:py-24">
            {/* ── A. Header ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="text-center"
            >
                <span className="mb-3 inline-block font-mono text-xs tracking-widest text-lp-primary uppercase">
                    // CASE STUDY
                </span>
                <h2 className="mb-12 text-2xl leading-snug font-bold text-lp-text sm:text-3xl lg:text-4xl">
                    Followers 52 Ribu &amp; Traffic Deres, Tapi Omset Mentok?
                    Ini Rahasia Tsania Melipatgandakan Omsetnya{' '}
                    <span className="text-gradient">
                        Tanpa Nambah Budget Iklan Sama Sekali.
                    </span>
                </h2>
            </motion.div>

            {/* ── B. Client Intro Card ── */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-30px' }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="glass border-glow mb-12 flex flex-col gap-5 rounded-xl p-5 sm:flex-row sm:items-start"
            >
                {/* Avatar */}
                <div className="flex h-45 w-45 shrink-0 items-center justify-center self-center rounded-lg bg-lp-bg-elevated/30 sm:self-start">
                    {CLIENT_AVATAR ? (
                        <img
                            src={CLIENT_AVATAR}
                            alt={CLIENT_NAME}
                            loading="lazy"
                            width={180}
                            height={180}
                            className="h-full w-full rounded-lg object-cover"
                        />
                    ) : (
                        <User className="h-9 w-9 text-lp-text-muted" />
                    )}
                </div>

                {/* Info */}
                <div className="flex flex-col items-center sm:items-start">
                    <p className="text-lg font-bold text-lp-text">
                        {CLIENT_NAME} | @
                        {CLIENT_NAME.toLowerCase().replace(/\s+/g, '')}
                    </p>
                    <p className="mt-0.5 text-sm text-lp-text-muted">
                        {CLIENT_TITLE}
                    </p>
                    <div className="mt-3 flex gap-2">
                        {CLIENT_STATS.map((stat) => (
                            <div
                                key={stat.label}
                                className="flex flex-col items-center rounded-lg border border-lp-border-soft bg-lp-bg-elevated/50 px-3 py-2"
                            >
                                <span className="text-lg font-bold text-lp-primary">
                                    {stat.value}
                                </span>
                                <span className="text-[10px] text-lp-text-muted">
                                    {stat.label}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* ── E. Video Testimoni ── */}
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mt-8 mb-12"
            >
                <p className="mb-4 text-center text-sm font-semibold text-lp-text sm:text-base">
                    {VIDEO_CTA_TEXT}
                </p>
                <div className="glass border-glow relative flex aspect-video w-full overflow-hidden rounded-xl">
                    {VIDEO_ID ? (
                        <YouTubeEmbed
                            videoId={VIDEO_ID}
                            title="Testimoni Tsania Latheefa"
                        />
                    ) : (
                        <div className="flex w-full items-center justify-center bg-lp-bg-elevated/20">
                            <button
                                type="button"
                                className="flex flex-col items-center gap-3 text-lp-text-muted transition-colors hover:text-lp-primary"
                            >
                                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-lp-primary/20 sm:h-20 sm:w-20">
                                    <Play className="h-8 w-8 fill-lp-primary text-lp-primary sm:h-10 sm:w-10" />
                                </div>
                                <span className="text-xs sm:text-sm">
                                    Video Testimoni
                                </span>
                            </button>
                        </div>
                    )}
                </div>
                <blockquote className="mt-6 border-l-2 border-lp-primary/50 pl-4 text-sm text-lp-text-muted italic sm:text-base">
                    "{CLIENT_QUOTE}"
                    <footer className="mt-2 text-xs font-semibold text-lp-text not-italic">
                        – {CLIENT_NAME},{' '}
                        <span className="font-normal text-lp-text-muted">
                            Content Creator, 52.8K Followers
                        </span>
                    </footer>
                </blockquote>
            </motion.div>

            {/* ── C. Vertical Timeline ── */}
            <div className="relative ml-6 sm:ml-10">
                <div className="absolute top-0 bottom-0 left-0 w-px bg-lp-border-soft" />

                {/* Gradient line overlay */}
                <div className="absolute top-0 bottom-0 left-0 w-px bg-gradient-to-b from-lp-danger via-lp-primary to-green-500 opacity-60" />

                {TIMELINE_ITEMS.map((item, i) => {
                    const Icon = item.icon;
                    return (
                        <motion.div
                            key={item.label}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true, margin: '-30px' }}
                            transition={{
                                duration: 0.5,
                                delay: i * 0.12,
                            }}
                            className="relative mb-14 pl-10 last:mb-0 sm:pl-12"
                        >
                            <div
                                className={`absolute top-0 left-0 flex h-9 w-9 -translate-x-1/2 items-center justify-center rounded-full border-2 bg-lp-bg ${item.dotColor}`}
                            >
                                <Icon className={`h-4 w-4 ${item.iconColor}`} />
                            </div>

                            {/* Content */}
                            <span className="mb-1 block font-mono text-[10px] tracking-widest text-lp-text-muted uppercase">
                                {item.label}
                            </span>
                            <h3 className="mb-3 text-lg font-bold text-lp-text sm:text-xl">
                                {item.title}
                            </h3>
                            <div className="space-y-3 text-sm leading-relaxed text-lp-text-muted sm:text-base">
                                {item.paragraphs.map((p, j) => (
                                    <p key={j}>{p}</p>
                                ))}
                            </div>
                        </motion.div>
                    );
                })}
            </div>

            {/* ── D. Before vs After ── */}
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-50px' }}
                transition={{ duration: 0.5 }}
                className="mt-16"
            >
                <div className="grid gap-4 sm:grid-cols-2">
                    {/* Before */}
                    <div className="glass flex flex-col items-center gap-3 rounded-xl border border-lp-danger/30 p-6">
                        <span className="font-mono text-xs tracking-widest text-lp-danger uppercase">
                            Before
                        </span>
                        <TrendingDown className="h-8 w-8 text-lp-danger" />
                        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-lp-bg-elevated/30">
                            <img
                                src={IMAGE_BEFORE}
                                alt="Before - Omset sebelum optimasi"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p className="text-xl font-bold text-lp-danger">
                            {REVENUE_BEFORE}
                            <span className="text-sm font-normal text-lp-text-muted">
                                /bln
                            </span>
                        </p>
                    </div>

                    {/* After */}
                    <div className="glass glow-sm flex flex-col items-center gap-3 rounded-xl border border-green-500/30 p-6">
                        <span className="font-mono text-xs tracking-widest text-green-500 uppercase">
                            After
                        </span>
                        <TrendingUp className="h-8 w-8 text-green-500" />
                        <div className="flex aspect-[4/3] w-full items-center justify-center overflow-hidden rounded-lg bg-lp-bg-elevated/30">
                            <img
                                src={IMAGE_AFTER}
                                alt="After - Omset setelah optimasi"
                                loading="lazy"
                                className="h-full w-full object-cover"
                            />
                        </div>
                        <p className="text-xl font-bold text-green-500">
                            {REVENUE_AFTER}
                            <span className="text-sm font-normal text-lp-text-muted">
                                /bln
                            </span>
                        </p>
                    </div>
                </div>
                <p className="mt-4 text-center text-xs text-lp-text-muted italic sm:text-sm">
                    {PROOF_CAPTION}
                </p>
            </motion.div>

            {/* ── F. CTA ── */}
            <CtaButton className="mt-12" />
        </section>
    );
}
