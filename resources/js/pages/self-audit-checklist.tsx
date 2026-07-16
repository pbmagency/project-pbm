import FooterSection from '@/components/mini-audit/FooterSection';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    AlertTriangle,
    Award,
    BadgeCheck,
    BarChart3,
    CheckCircle,
    ChevronDown,
    Download,
    FileText,
    LayoutGrid,
    Lock,
    ShieldCheck,
    Target,
    Zap,
} from 'lucide-react';
import { useState } from 'react';

const CHECKOUT_URL = 'https://lynk.id/jraei/x1r1llz9vjkk/checkout';

const VALUE_PROPS = [
    {
        icon: Award,
        title: 'Framework Terbukti',
        desc: 'Gunakan framework yang sama yang kami pakai untuk menaikkan konversi hingga 2X lipat bagi klien High-Ticket.',
    },
    {
        icon: Zap,
        title: 'Anti-Ribet',
        desc: 'Anda tidak perlu belajar coding atau desain dari nol. Cukup ikuti checklist, langsung perbaiki.',
    },
    {
        icon: Target,
        title: 'To-the-Point',
        desc: 'Checklist ini membongkar bagian mana yang bikin pengunjung kabur dan cara memperbaikinya dalam hitungan menit.',
    },
];

const CHECKLIST_ITEMS = [
    {
        icon: FileText,
        title: 'Audit Copywriting',
        desc: 'Headline, subheadline, dan CTA yang memicu action',
    },
    {
        icon: LayoutGrid,
        title: 'Layout & Hierarchy',
        desc: 'Struktur visual yang mengarahkan mata ke konversi',
    },
    {
        icon: BadgeCheck,
        title: 'Trust Signals',
        desc: 'Testimoni, badge, dan elemen kepercayaan yang wajib ada',
    },
    {
        icon: BarChart3,
        title: 'CRO Checklist',
        desc: 'Conversion Rate Optimization dari A sampai Z',
    },
];

const FAQ_ITEMS = [
    {
        q: 'Apa itu Self-Audit Checklist?',
        a: 'Panduan langkah demi langkah untuk mengaudit dan memperbaiki landing page secara mandiri menggunakan framework internal PBM Agency yang biasa dipakai untuk klien High-Ticket.',
    },
    {
        q: 'Apakah saya perlu skill coding atau desain?',
        a: 'Tidak. Checklist ini dirancang agar bisa diikuti siapa saja tanpa latar belakang teknis. Anda cukup mengikuti poin-poin yang ada dan langsung perbaiki landing page Anda.',
    },
    {
        q: 'Bagaimana cara mengakses checklist setelah pembayaran?',
        a: 'Setelah pembayaran berhasil, Anda akan langsung mendapatkan akses download secara instan. Tidak perlu menunggu.',
    },
    {
        q: 'Apa bedanya dengan layanan konsultasi Bedah Landing Page?',
        a: 'Konsultasi adalah sesi 1-on-1 di mana tim kami yang menganalisis website Anda secara langsung. Checklist ini adalah versi Do It Yourself (DIY) — Anda yang melakukan audit sendiri menggunakan framework yang sama.',
    },
    {
        q: 'Apakah checklist ini cocok untuk semua jenis bisnis?',
        a: 'Ya. Prinsip optimasi konversi bersifat universal dan berlaku untuk semua niche, baik itu jasa, produk fisik, maupun digital.',
    },
];

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: {
        opacity: 1,
        y: 0,
        transition: { duration: 0.5, ease: 'easeOut' as const },
    },
};

export default function SelfAuditChecklist() {
    const [openFaq, setOpenFaq] = useState<number | null>(null);

    return (
        <>
            <Head title="Self-Audit Checklist">
                <meta
                    name="description"
                    content="Dapatkan Self-Audit Checklist dari PBM Agency untuk memperbaiki Landing Page Anda secara mandiri. Hanya Rp 79.000."
                />
            </Head>

            <div className="mini-audit-page font-sans relative min-h-screen overflow-hidden bg-lp-bg text-lp-text">
                <div className="bg-grid absolute inset-0 opacity-40" />
                <div className="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-lp-primary/5 blur-[120px]" />

                {/* Alert Bar */}
                <div className="sticky top-0 z-50 w-full border-b border-lp-danger/30 bg-lp-danger-soft backdrop-blur-sm">
                    <div className="mx-auto flex max-w-2xl items-center justify-center gap-2 px-4 py-2.5 text-sm">
                        <AlertTriangle className="h-4 w-4 shrink-0 text-lp-danger" />
                        <span className="font-medium text-lp-danger">
                            Slot Konsultasi Bedah Landing Page Penuh Per Hari
                            Ini
                        </span>
                    </div>
                </div>

                <div className="relative z-10">
                    {/* Hero */}
                    <motion.section
                        className="mx-auto max-w-2xl space-y-6 px-4 pt-12 pb-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h1 className="text-2xl leading-tight font-bold sm:text-3xl lg:text-4xl">
                            Mohon Maaf, Slot Konsultasi{' '}
                            <span className="text-gradient">
                                Bedah Landing Page
                            </span>{' '}
                            Kami Sedang Penuh...
                        </h1>
                        <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Untuk menjaga kualitas hasil bagi klien yang sudah
                            masuk, kami terpaksa menutup sementara pendaftaran
                            sesi Zoom minggu ini. Namun, kami{' '}
                            <strong className="text-foreground">
                                tidak ingin membiarkan Landing Page Anda terus
                                bocor tanpa solusi.
                            </strong>
                        </p>
                        <div className="border-t border-border/30 pt-6">
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Banyak yang bertanya,{' '}
                                <em>
                                    "Gimana cara saya benerin web sendiri kalau
                                    nggak dapet slot Zoom?"
                                </em>{' '}
                                Akhirnya, saya memutuskan untuk merangkum{' '}
                                <strong className="text-foreground">
                                    SOP &amp; Checklist Internal
                                </strong>{' '}
                                yang biasa PBM Agency gunakan untuk mengaudit
                                klien{' '}
                                <span className="text-gradient">
                                    High-Ticket
                                </span>{' '}
                                kami.
                            </p>
                        </div>
                    </motion.section>

                    {/* Value Props */}
                    <motion.section
                        className="mx-auto max-w-2xl px-4 py-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <div className="grid gap-4 sm:grid-cols-3">
                            {VALUE_PROPS.map((vp) => (
                                <div
                                    key={vp.title}
                                    className="glass border-glow space-y-3 rounded-2xl p-5 text-center"
                                >
                                    <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-xl border border-primary/20 bg-primary/10">
                                        <vp.icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="font-semibold text-foreground">
                                        {vp.title}
                                    </h3>
                                    <p className="text-xs leading-relaxed text-muted-foreground">
                                        {vp.desc}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    {/* Checklist Preview */}
                    <motion.section
                        className="mx-auto max-w-2xl space-y-6 px-4 py-8"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="text-center text-xl font-bold sm:text-2xl">
                            Apa yang Ada di Dalam{' '}
                            <span className="text-gradient">Checklist</span>?
                        </h2>
                        <div className="space-y-3">
                            {CHECKLIST_ITEMS.map((item) => (
                                <div
                                    key={item.title}
                                    className="flex items-start gap-3 rounded-xl border border-border/30 bg-muted/10 px-4 py-3"
                                >
                                    <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-primary/20 bg-primary/10">
                                        <item.icon className="h-4 w-4 text-primary" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground">
                                            {item.title}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {item.desc}
                                        </p>
                                    </div>
                                    <CheckCircle className="mt-1 ml-auto h-4 w-4 shrink-0 text-primary/60" />
                                </div>
                            ))}
                        </div>

                        <div className="overflow-hidden rounded-xl border border-border/20 bg-muted/30">
                            <img
                                src="/storage/checklist.webp"
                                alt="Preview checklist"
                                className="aspect-video w-full object-contain"
                                loading="lazy"
                            />
                        </div>
                    </motion.section>

                    {/* Price Anchor */}
                    <motion.section
                        className="mx-auto max-w-2xl space-y-4 px-4 py-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <p className="text-sm text-muted-foreground line-through">
                            Kerugian iklan boncos per bulan: Rp 1.000.000+
                        </p>
                        <p className="text-gradient text-4xl font-bold sm:text-5xl">
                            Rp 79.000
                        </p>
                        <p className="mx-auto max-w-md text-sm leading-relaxed text-muted-foreground sm:text-base">
                            Hanya seharga sekali makan siang, Anda bisa
                            mengamankan budget iklan{' '}
                            <strong className="text-foreground">
                                jutaan rupiah
                            </strong>{' '}
                            yang selama ini terbuang percuma gara-gara website
                            yang tidak teroptimasi.
                        </p>
                        <div className="flex items-center justify-center gap-2">
                            <Badge variant="secondary" className="gap-1">
                                <Download className="h-3 w-3" /> Instant
                                Download
                            </Badge>
                            <Badge variant="secondary" className="gap-1">
                                <ShieldCheck className="h-3 w-3" /> Akses
                                Selamanya
                            </Badge>
                        </div>
                    </motion.section>

                    {/* CTA Button + Trust Badges */}
                    <motion.section
                        className="mx-auto max-w-2xl space-y-4 px-4 py-8 text-center"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <Button
                            asChild
                            className="glow-sm h-12 w-full max-w-md bg-primary text-base font-semibold"
                            size="lg"
                        >
                            <a
                                href={CHECKOUT_URL}
                                target="_blank"
                                rel="noopener noreferrer"
                            >
                                Dapatkan Checklist Sekarang
                            </a>
                        </Button>
                        <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1">
                                <ShieldCheck className="h-3.5 w-3.5" />
                                Support 24/7
                            </span>
                            <span className="flex items-center gap-1">
                                <Lock className="h-3.5 w-3.5" /> Pembayaran Aman
                            </span>
                        </div>
                    </motion.section>

                    {/* FAQ Section */}
                    <motion.section
                        className="mx-auto max-w-2xl space-y-6 px-4 py-16"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeUp}
                    >
                        <h2 className="text-center text-xl font-bold sm:text-2xl">
                            Pertanyaan yang{' '}
                            <span className="text-gradient">
                                Sering Ditanyakan
                            </span>
                        </h2>
                        <div className="space-y-2">
                            {FAQ_ITEMS.map((item, i) => (
                                <div
                                    key={i}
                                    className="rounded-xl border border-border/30 bg-muted/10"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq(openFaq === i ? null : i)
                                        }
                                        className="flex w-full items-center justify-between gap-3 px-4 py-3.5 text-left text-sm font-medium text-foreground"
                                    >
                                        {item.q}
                                        <ChevronDown
                                            className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 ${openFaq === i ? 'rotate-180' : ''}`}
                                        />
                                    </button>
                                    <AnimatePresence>
                                        {openFaq === i && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: 'auto',
                                                    opacity: 1,
                                                }}
                                                exit={{ height: 0, opacity: 0 }}
                                                transition={{
                                                    duration: 0.2,
                                                    ease: 'easeOut',
                                                }}
                                                className="overflow-hidden"
                                            >
                                                <p className="px-4 pb-4 text-xs leading-relaxed text-muted-foreground">
                                                    {item.a}
                                                </p>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            ))}
                        </div>
                    </motion.section>

                    <FooterSection />
                </div>
            </div>
        </>
    );
}
