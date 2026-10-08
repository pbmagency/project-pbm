import { Head } from '@inertiajs/react';
import { useState, useEffect, useCallback } from 'react';
import type { ReactNode, ChangeEvent } from 'react';
import { generateEventId, useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useSectionTracking } from '@/hooks/use-section-tracking';

interface ProjectProps {
    clientCount?: string;
}

interface Testimonial {
    quote: string;
    name: string;
    role: string;
    initials: string;
}

interface Copy {
    d: string;
    m: string;
}


interface Proof {
    src: string;
    label: string;
}

interface Pillar {
    key: string;
    rest: string;
    desc: string;
    icon: ReactNode;
}


interface Faq {
    q: string;
    a: Copy;
}

const WA_NUMBER = '6285966688711';
const wa = (text: string): string =>
    `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(text)}`;
const WA_SUPPORT = wa(
    'Halo Tim PBM, saya mau tanya tentang Audit Landing Page Gratis.',
);

const CALENDLY_URL =
    (import.meta.env.VITE_CALENDLY_URL as string) ||
    'https://calendly.com/pbm-agency/30min';

const PROGRAM_OPTIONS = [
    { value: 'belum punya', label: 'Belum punya' },
    { value: 'kelas online', label: 'Kelas Online' },
    { value: 'coaching', label: 'Coaching' },
    { value: 'bootcamp', label: 'Bootcamp' },
    { value: 'workshop', label: 'Workshop' },
    { value: 'konsultasi', label: 'Konsultasi' },
    { value: 'lainnya', label: 'Lainnya (Sebutkan jenis produk Anda)' },
];

const ALUMNI_OPTIONS = [
    { value: 'belum ada', label: 'Belum ada' },
    { value: '1–50', label: '1 – 50 Alumni / Pembeli' },
    { value: '51–200', label: '51 – 200 Alumni / Pembeli' },
    { value: '> 200', label: '> 200 Alumni / Pembeli' },
];

const REVENUE_OPTIONS = [
    { value: '< Rp10jt', label: '< Rp10 Juta / bulan' },
    { value: 'Rp10–30jt', label: 'Rp10 – 30 Juta / bulan' },
    { value: 'Rp30–100jt', label: 'Rp30 – 100 Juta / bulan' },
    { value: '> Rp100jt', label: '> Rp100 Juta / bulan' },
];

const ROLE_OPTIONS = [
    { value: 'Owner', label: 'Owner / Co-Founder' },
    { value: 'tim internal', label: 'Tim Internal (Marketing, Sales, Ops, dll)' },
    { value: 'agency atau freelancer', label: 'Agency atau Freelancer' },
];

const svgBase =
    'fill-none stroke-current [stroke-linecap:round] [stroke-linejoin:round]';

function ArrowRight({
    className = 'size-[18px]',
    sw = 2.5,
}: {
    className?: string;
    sw?: number;
}) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`${className} ${svgBase}`}
            strokeWidth={sw}
        >
            <path d="M5 12h14" />
            <path d="m12 5 7 7-7 7" />
        </svg>
    );
}

function CheckIcon({ className }: { className: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`${className} ${svgBase}`}
            strokeWidth={2.5}
        >
            <path d="M20 6 9 17l-5-5" />
        </svg>
    );
}

function CloseIcon({ className }: { className: string }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`${className} ${svgBase}`}
            strokeWidth={2.5}
        >
            <path d="M18 6 6 18" />
            <path d="m6 6 12 12" />
        </svg>
    );
}

function Chevron({ dir }: { dir: 'left' | 'right' }) {
    return (
        <svg
            viewBox="0 0 24 24"
            className={`size-[18px] ${svgBase}`}
            strokeWidth={2}
        >
            <path d={dir === 'left' ? 'm15 18-6-6 6-6' : 'm9 18 6-6-6-6'} />
        </svg>
    );
}

/** Desktop copy on md+, shorter copy below md. */
function R({ c }: { c: Copy }) {
    return (
        <>
            <span className="hidden md:inline">{c.d}</span>
            <span className="md:hidden">{c.m}</span>
        </>
    );
}

const CTA_PRIMARY =
    'inline-flex w-full md:w-auto min-h-[60px] items-center justify-center gap-2 rounded-[14px] bg-[#4f46e5] px-9 py-[14px] text-center text-[17px] font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all duration-150 hover:-translate-y-0.5 hover:bg-[#4338ca] hover:text-white';
const CTA_AMBER =
    'inline-flex w-full md:w-auto min-h-[60px] items-center justify-center gap-2 rounded-full border border-[#fcd34d] bg-[#fbbf24] px-9 py-[14px] text-center text-[17px] font-extrabold text-[#451a03] shadow-[0_0_40px_-10px_rgba(251,191,36,.5)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#f59e0b] hover:text-[#451a03]';
const CONTAINER = 'mx-auto w-full px-[clamp(20px,5vw,32px)]';
const KICKER =
    'mb-4 inline-block text-[13px] leading-4 font-bold tracking-[.2em] text-[#4f46e5] uppercase';

const PAINS: string[] = [
    'Follower ribuan, iklan jalan, klik ramai. Tapi peserta yang benar-benar transfer masih jauh dari target.',
    'Capek balas puluhan chat WA yang cuma tanya harga, bilang "nanti dulu ya kak", lalu menghilang.',
    'Omzet naik-turun tiap batch. Kemarin penuh, sekarang sepi, dan Anda tidak tahu pasti apa bedanya.',
    'Gonta-ganti iklan, desain LP, sampai harga kelas berdasarkan tebak-tebakan, tapi hasilnya tetap sama.',
];

const PILLAR_ICON = `size-6 ${svgBase}`;
const PILLARS: Pillar[] = [
    {
        key: 'APA',
        rest: 'yang Bocor',
        desc: 'Titik persis di mana calon peserta berhenti: headline, penawaran, harga, form, atau chat WA.',
        icon: (
            <svg viewBox="0 0 24 24" className={PILLAR_ICON} strokeWidth={2}>
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.3-4.3" />
            </svg>
        ),
    },
    {
        key: 'MENGAPA',
        rest: 'Itu Membunuh Konversi',
        desc: 'Berbasis data: kenapa copy, struktur halaman, atau follow-up Anda bikin peserta ragu transfer.',
        icon: (
            <svg viewBox="0 0 24 24" className={PILLAR_ICON} strokeWidth={2}>
                <path d="M3 3v18h18" />
                <path d="M18 17V9" />
                <path d="M13 17V5" />
                <path d="M8 17v-3" />
            </svg>
        ),
    },
    {
        key: 'BAGAIMANA',
        rest: 'Cara Memperbaikinya',
        desc: 'Langkah konkret yang bisa langsung dieksekusi, diurutkan dari dampak terbesar.',
        icon: (
            <svg viewBox="0 0 24 24" className={PILLAR_ICON} strokeWidth={2}>
                <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z" />
            </svg>
        ),
    },
];


const TESTIMONIALS: Testimonial[] = [
    {
        quote: 'ROAS iklan 5x, purchase dari LP langsung kerasa naik signifikan.',
        name: 'Mas Ardi',
        role: 'Fullbright · Kelas Pelatihan TOEFL/IELTS',
        initials: 'MA',
    },
    {
        quote: 'LP buatan PBM masih jadi standar dasar LP saya sampai sekarang.',
        name: 'Rashid Damanhuri',
        role: 'Kelas Belajar Bisnis',
        initials: 'MR',
    },
];


const PROOFS: Proof[] = [
    {
        src: '/assets/buktinew.webp',
        label: 'Dashboard kenaikan performa Rashid Damanhuri',
    },
    { src: '/assets/fullbright.webp', label: 'Chat Mas Ardi, Fullbright' },
    {
        src: '/assets/newtestimoni.webp',
        label: 'Testimoni WhatsApp Rashid Damanhuri',
    },
];

const FAQS: Faq[] = [
    {
        q: 'Apa yang akan saya dapatkan dari audit ini?',
        a: {
            d: 'Sesi 1-on-1 via Zoom bersama tim PBM. Kami bedah landing page, penawaran, form, dan alur follow-up WA Anda, lalu memberikan daftar titik bocor beserta langkah perbaikan yang diurutkan dari dampak terbesar. Jadwal sesi dikonfirmasi maksimal 1x24 jam setelah form diisi.',
            m: 'Sesi Zoom 1-on-1: kami bedah LP, penawaran, form & alur WA, lalu beri daftar perbaikan prioritas.',
        },
    },
    {
        q: 'Apakah audit ini benar-benar gratis?',
        a: {
            d: 'Ya, 100% gratis dan tanpa kewajiban memakai jasa kami. Kalau setelah audit Anda ingin eksekusinya dibantu tim PBM, kita bisa diskusikan. Kalau tidak, semua rekomendasi tetap bisa Anda jalankan sendiri.',
            m: 'Ya, 100% gratis tanpa kewajiban. Semua rekomendasi tetap bisa Anda jalankan sendiri.',
        },
    },
    {
        q: 'Iklan saya sudah bagus (CTR tinggi, CPC murah). Apakah audit ini masih relevan?',
        a: {
            d: 'Justru sangat relevan. CTR tinggi hanya membuktikan iklan Anda menarik perhatian. Penentu transfer ada di langkah berikutnya: halaman, penawaran, dan alur WA. Di situlah kebocoran terbesar biasanya terjadi.',
            m: 'Justru sangat relevan. CTR tinggi hanya bukti iklan menarik. Penentu transfer ada di halaman dan alur WA.',
        },
    },
    {
        q: 'Apakah audit ini cocok untuk bisnis saya?',
        a: {
            d: 'Cocok jika Anda menjual keahlian (kelas online, coaching, training, atau konsultasi), programnya sudah pernah terjual minimal 1 batch, dan sudah memiliki audience atau traffic. Jika program Anda belum pernah terjual sama sekali, kami sarankan validasi penawaran terlebih dahulu, karena audit paling berdampak saat sudah ada data untuk dibedah.',
            m: 'Cocok jika Anda menjual keahlian, sudah terjual minimal 1 batch, dan sudah punya audience atau traffic.',
        },
    },
    {
        q: 'Apakah data saya aman?',
        a: {
            d: 'Ya. Semua data, angka penjualan, dan materi yang Anda bagikan hanya digunakan untuk keperluan audit dan tidak akan dipublikasikan tanpa izin tertulis dari Anda.',
            m: 'Ya. Semua data hanya dipakai untuk audit dan tidak dipublikasikan tanpa izin tertulis dari Anda.',
        },
    },
    {
        q: 'Kenapa hanya 5 slot per minggu?',
        a: {
            d: 'Setiap audit dibedah langsung dan mendalam, bukan pakai template. Untuk menjaga kualitas rekomendasi, kami membatasi hanya 5 bisnis per minggu.',
            m: 'Setiap audit dibedah langsung dan mendalam, bukan template. Karena itu kami batasi 5 bisnis per minggu.',
        },
    },
];

function Avatars({ size }: { size: 'sm' | 'md' }) {
    const s =
        size === 'sm'
            ? 'size-9 text-[11px] -ml-2.5'
            : 'size-9 text-[11px] -ml-2.5';

    return (
        <div className="flex shrink-0">
            <img
                src="/assets/tsan-thumb-opt.webp"
                alt="Tsania Latheefa"
                width={36}
                height={36}
                loading="lazy"
                decoding="async"
                className="size-9 rounded-full border-2 border-white object-cover"
            />
            <div
                className={`${s} flex items-center justify-center rounded-full border-2 border-white bg-[#6366f1] font-bold text-white`}
            >
                MA
            </div>
            <div
                className={`${s} flex items-center justify-center rounded-full border-2 border-white bg-[#8b5cf6] font-bold text-white`}
            >
                MR
            </div>
        </div>
    );
}

function CaseStudyVideo() {
    const [playing, setPlaying] = useState(false);

    if (playing) {
        return (
            <div className="relative overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-black pt-[56.25%]">
                <iframe
                    src="https://player.mediadelivery.net/embed/701292/623975dd-1d66-41c8-8aac-07a07c141d21?autoplay=true&loop=false&muted=false&preload=true&responsive=true"
                    allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                    allowFullScreen
                    title="Video testimoni Tsania Latheefa"
                    className="absolute top-0 h-full w-full border-0"
                />
            </div>
        );
    }

    return (
        <div className="relative overflow-hidden rounded-[18px] border border-[#e2e8f0] bg-[#0f172a] pt-[56.25%]">
            <button
                type="button"
                onClick={() => setPlaying(true)}
                aria-label="Putar video studi kasus Tsania Latheefa"
                className="group absolute inset-0 flex flex-col items-center justify-center bg-gradient-to-t from-black/80 via-black/40 to-black/20 text-white transition-all hover:bg-black/40"
            >
                <div className="flex size-16 items-center justify-center rounded-full bg-[#4f46e5] text-white shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#4338ca]">
                    <svg
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        className="ml-1 size-7"
                    >
                        <path d="M8 5v14l11-7z" />
                    </svg>
                </div>
                <span className="mt-3 text-sm font-bold tracking-wide">
                    Tonton Video Studi Kasus (1 Menit)
                </span>
            </button>
        </div>
    );
}

export default function Project({ clientCount = '100+' }: ProjectProps) {
    const { track, trackVisit, trackCTA, trackConversion } = useAnalytics();
    useScrollTracking();
    useDwellTime();
    useSectionTracking();
    const [scrolled, setScrolled] = useState<boolean>(false);
    const [openFaq, setOpenFaq] = useState<Record<number, boolean>>({});
    const [slide, setSlide] = useState<number>(0);
    const [autoplay, setAutoplay] = useState<boolean>(true);
    const [lightbox, setLightbox] = useState<number | null>(null);
    const [step, setStep] = useState<number>(1);
    const [name, setName] = useState<string>('');
    const [phone, setPhone] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [websiteLink, setWebsiteLink] = useState<string>('');
    const [programType, setProgramType] = useState<string>('');
    const [otherProgram, setOtherProgram] = useState<string>('');
    const [totalBuyers, setTotalBuyers] = useState<string>('');
    const [monthlyRevenue, setMonthlyRevenue] = useState<string>('');
    const [businessRole, setBusinessRole] = useState<string>('');
    const [submitted, setSubmitted] = useState<boolean>(false);
    const [isQualified, setIsQualified] = useState<boolean | null>(null);
    const [submitting, setSubmitting] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    const trackAuditLink = (event: React.MouseEvent<HTMLElement>): void => {
        const link = (event.target as HTMLElement).closest<HTMLAnchorElement>(
            'a[href="#audit-form"]',
        );

        if (!link) {
            return;
        }

        const location =
            link.closest('section[id]')?.id ??
            (link.closest('header') ? 'header' : 'unknown');
        trackCTA(
            `${location}_cta`,
            link.textContent?.trim().replace(/\s+/g, ' ') ??
                'Klaim Audit Gratis',
            '#audit-form',
        );
    };

    // Smooth anchor scrolling
    useEffect(() => {
        const html = document.documentElement;
        const prev = html.style.scrollBehavior;
        html.style.scrollBehavior = 'smooth';

        return () => {
            html.style.scrollBehavior = prev;
        };
    }, []);

    // Header background on scroll
    useEffect(() => {
        const onScroll = (): void => setScrolled(window.scrollY > 60);
        onScroll();
        window.addEventListener('scroll', onScroll, { passive: true });

        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    // Testimonial autoplay
    useEffect(() => {
        if (!autoplay) {
            return;
        }

        const id = window.setInterval(
            () => setSlide((s) => (s + 1) % TESTIMONIALS.length),
            6000,
        );

        return () => window.clearInterval(id);
    }, [autoplay]);

    const goSlide = useCallback((i: number): void => {
        setAutoplay(false);
        setSlide(
            ((i % TESTIMONIALS.length) + TESTIMONIALS.length) %
                TESTIMONIALS.length,
        );
    }, []);

    const lbPrev = useCallback((): void => {
        setLightbox((i) =>
            i === null ? i : (i - 1 + PROOFS.length) % PROOFS.length,
        );
    }, []);
    const lbNext = useCallback((): void => {
        setLightbox((i) => (i === null ? i : (i + 1) % PROOFS.length));
    }, []);

    // Lightbox keyboard: Esc / ← / →
    useEffect(() => {
        if (lightbox === null) {
            return;
        }

        const onKey = (e: KeyboardEvent): void => {
            if (e.key === 'Escape') {
                setLightbox(null);
            } else if (e.key === 'ArrowLeft') {
                lbPrev();
            } else if (e.key === 'ArrowRight') {
                lbNext();
            }
        };
        window.addEventListener('keydown', onKey);

        return () => window.removeEventListener('keydown', onKey);
    }, [lightbox, lbPrev, lbNext]);

    const validateStep = (currentStep: number): boolean => {
        setError('');
        if (currentStep === 1) {
            if (!name.trim()) {
                setError('Mohon isi nama lengkap Anda.');
                return false;
            }
            const cleanPhone = phone.trim().replace(/[\s-]/g, '');
            if (!cleanPhone || cleanPhone.length < 8) {
                setError('Mohon isi nomor WhatsApp aktif Anda (minimal 8 digit).');
                return false;
            }
            if (!email.trim()) {
                setError('Mohon isi alamat email aktif Anda.');
                return false;
            }
            if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
                setError('Format email tidak valid.');
                return false;
            }
            return true;
        }

        if (currentStep === 2) {
            if (!websiteLink.trim()) {
                setError('Mohon isi link IG atau website program Anda.');
                return false;
            }
            return true;
        }

        if (currentStep === 3) {
            if (!programType) {
                setError('Silakan pilih salah satu opsi program yang dijual.');
                return false;
            }
            if (programType === 'lainnya' && !otherProgram.trim()) {
                setError('Mohon sebutkan jenis produk Anda.');
                return false;
            }
            return true;
        }

        if (currentStep === 4) {
            if (!totalBuyers) {
                setError('Silakan pilih total alumni / pembeli program Anda.');
                return false;
            }
            return true;
        }

        if (currentStep === 5) {
            if (!monthlyRevenue) {
                setError('Silakan pilih kisaran omzet bisnis Anda per bulan.');
                return false;
            }
            return true;
        }

        if (currentStep === 6) {
            if (!businessRole) {
                setError('Silakan pilih peran Anda dalam bisnis ini.');
                return false;
            }
            return true;
        }

        return true;
    };

    const nextStep = (): void => {
        if (validateStep(step)) {
            setStep((prev) => Math.min(prev + 1, 6));
        }
    };

    const prevStep = (): void => {
        setError('');
        setStep((prev) => Math.max(prev - 1, 1));
    };

    const resetForm = (): void => {
        setStep(1);
        setName('');
        setPhone('');
        setEmail('');
        setWebsiteLink('');
        setProgramType('');
        setOtherProgram('');
        setTotalBuyers('');
        setMonthlyRevenue('');
        setBusinessRole('');
        setSubmitted(false);
        setIsQualified(null);
        setError('');
    };

    const submit = async (): Promise<void> => {
        if (submitting) {
            return;
        }

        if (!validateStep(6)) {
            return;
        }

        // ❌ Rule Evaluasi Kualifikasi:
        // Rule 1: Gugur jika programType === 'belum punya'
        // Rule 2: Gugur jika totalBuyers === 'belum ada'
        // Rule 3: Gugur jika businessRole === 'agency atau freelancer'
        const qualified =
            programType !== 'belum punya' &&
            totalBuyers !== 'belum ada' &&
            businessRole !== 'agency atau freelancer';

        const calendlyUrl = `${CALENDLY_URL}?name=${encodeURIComponent(name.trim())}&email=${encodeURIComponent(email.trim())}&a1=${encodeURIComponent(phone.trim())}&a2=${encodeURIComponent(websiteLink.trim())}`;

        // Jika lolos kualifikasi, langsung buka tab baru ke Calendly
        if (qualified) {
            try {
                window.open(calendlyUrl, '_blank', 'noopener,noreferrer');
            } catch {
                // Fallback jika diblokir popup blocker
            }
        }

        setIsQualified(qualified);
        setError('');
        trackCTA(
            'audit_qualification_submit',
            qualified ? 'Qualified - Book Calendly' : 'Disqualified',
            'audit-form',
        );
        setSubmitting(true);

        const effectiveProgram =
            programType === 'lainnya'
                ? `lainnya: ${otherProgram.trim()}`
                : programType;

        const saved = await track({
            event_type: 'conversion',
            event_data: {
                type: 'audit_request',
                event_id: generateEventId(),
                location: 'audit_form_submit',
                landing_source: window.location.pathname,
                name: name.trim(),
                phone: phone.trim(),
                email: email.trim(),
                website_link: websiteLink.trim(),
                program_type: effectiveProgram,
                total_buyers: totalBuyers,
                monthly_revenue: monthlyRevenue,
                business_role: businessRole,
                is_qualified: qualified,
            },
        });

        setSubmitting(false);

        if (saved) {
            setSubmitted(true);
            const formEl = document.getElementById('audit-form');
            if (formEl) {
                formEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
        } else {
            setError('Permintaan belum terkirim. Silakan coba lagi.');
        }
    };

    const inputBase =
        'h-[52px] w-full rounded-xl border-[1.5px] bg-[#f8fafc] px-4 text-base text-[#0f172a] outline-hidden placeholder:text-[#94a3b8] transition-all focus:border-[#4f46e5] focus:bg-white focus:shadow-[0_0_0_4px_#e0e7ff]';

    return (
        <main
            onClickCapture={trackAuditLink}
            className="min-h-screen bg-white font-['Instrument_Sans',ui-sans-serif,system-ui,sans-serif] text-[#0f172a] antialiased selection:bg-[#e0e7ff] selection:text-[#312e81]"
        >
            <Head title="Audit Funnel Gratis - PBM Agency" />
            {/* HEADER */}
            <header
                className={`fixed top-0 right-0 left-0 z-50 transition-all duration-500 ease-in-out ${
                    scrolled
                        ? 'px-[14px] py-[10px] md:px-8 md:py-3'
                        : 'px-4 py-[14px] md:px-8 md:py-6'
                }`}
            >
                <div className="mx-auto w-full max-w-[1280px]">
                    <div
                        className={`flex items-center justify-between gap-4 rounded-2xl border transition-all duration-500 ease-in-out ${
                            scrolled
                                ? 'border-[rgba(226,232,240,0.5)] bg-white/90 px-[14px] py-[10px] shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] backdrop-blur-[24px] md:px-6 md:py-3'
                                : 'border-transparent bg-transparent p-0'
                        }`}
                    >
                        <div className="flex min-w-0 items-center gap-4">
                            <div className="flex shrink-0 items-center gap-3">
                                <img
                                    src="/assets/logo.webp"
                                    alt="PBM Logo"
                                    width={40}
                                    height={40}
                                    decoding="async"
                                    className="size-10 rounded-lg object-cover shadow-[0_1px_2px_rgba(0,0,0,.05)]"
                                />
                                <span className="text-2xl leading-8 font-extrabold tracking-[-0.025em] text-[#0f172a]">
                                    PBM
                                </span>
                            </div>
                            <span className="hidden items-center rounded-full border border-[#e0e7ff] bg-white px-[14px] py-1.5 text-xs leading-4 font-bold tracking-[.08em] whitespace-nowrap text-[#4338ca] uppercase min-[1100px]:inline-flex">
                                Khusus Pemilik Kelas Online, Coaching, Training
                                &amp; Konsultasi
                            </span>
                        </div>
                        <a
                            href="#audit-form"
                            className="flex cursor-pointer items-center justify-center rounded-lg bg-[#4f46e5] px-5 py-2 text-sm leading-5 font-semibold whitespace-nowrap text-white shadow-[0_4px_6px_-1px_rgba(79,70,229,.2),0_2px_4px_-2px_rgba(79,70,229,.2)] hover:bg-[#4338ca] hover:text-white"
                        >
                            <span className="md:hidden">Klaim Audit</span>
                            <span className="hidden md:inline">
                                Klaim Audit Gratis
                            </span>
                        </a>
                    </div>
                </div>
            </header>

            {/* HERO */}
            <div className="relative overflow-clip bg-[#f8f6fc] pb-[clamp(72px,10vw,112px)]">
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)] bg-[size:80px_80px]" />
                <div className="pointer-events-none absolute top-0 left-0 size-[600px] rounded-full bg-[rgba(165,180,252,.3)] opacity-60 mix-blend-multiply blur-[120px]" />
                <div className="pointer-events-none absolute top-1/2 right-0 size-[700px] -translate-y-1/2 rounded-full bg-[rgba(165,180,252,.3)] opacity-60 mix-blend-multiply blur-[120px]" />
                <div className="pointer-events-none absolute bottom-0 left-1/2 h-[500px] w-[800px] -translate-x-1/2 rounded-full bg-[rgba(233,213,255,.4)] blur-[100px]" />
                <div className="h-[88px]" />

                <section id="hero" className="relative z-10 pt-4 md:pt-16">
                    <div className={`${CONTAINER} max-w-[1280px]`}>
                        <div className="flex flex-wrap items-center gap-8 md:gap-12">
                            <div className="relative z-20 flex min-w-0 flex-[7_1_480px] flex-col gap-[18px] md:gap-6">
                                <span className="inline-flex max-w-full items-center self-start rounded-full border border-[#e0e7ff] bg-white px-[14px] py-1.5 text-[11px] leading-4 font-bold tracking-[.04em] text-[#4338ca] uppercase min-[1100px]:hidden">
                                    Khusus Kelas Online, Coaching &amp;
                                    Konsultasi
                                </span>
                                <span className="inline-flex max-w-full items-center gap-2 self-start rounded-full border border-[#a7f3d0] bg-[#d1fae5] px-4 py-2 text-[length:clamp(12px,3.2vw,14px)] leading-5 font-bold text-[#047857]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`size-4 shrink-0 ${svgBase}`}
                                        strokeWidth={2.5}
                                    >
                                        <polyline points="22 7 13.5 15.5 8.5 10.5 2 17" />
                                        <polyline points="16 7 22 7 22 13" />
                                    </svg>
                                    +50% Omzet Klien Tanpa Tambah Budget Iklan
                                </span>
                                <h1 className="text-[length:clamp(34px,9vw,62px)] leading-[1.1] font-extrabold tracking-[-0.03em] text-balance text-[#0f172a]">
                                    Ubah Traffic Berkualitas yang Benar-Benar
                                    Jadi{' '}
                                    <span className="text-[#4f46e5]">
                                        Potensial Pembeli
                                    </span>
                                </h1>
                                <p className="max-w-[620px] text-[17px] leading-[1.65] font-medium text-pretty text-[#475569]">
                                    Kebocoran omzet terbanyak terjadi setelah
                                    orang klik iklan tanpa membeli. Kami bangun
                                    High-Converting Landing Page yang
                                    memaksimalkan setiap pengunjung menjadi
                                    pembeli berkualitas tinggi secara konsisten.
                                </p>
                            </div>

                            <div
                                id="audit-form"
                                className="relative z-10 min-w-0 flex-[5_1_340px] scroll-mt-[120px]"
                            >
                                <div className="absolute inset-[-8px] -z-10 rotate-[-3deg] rounded-[48px] bg-[rgba(99,102,241,.12)] blur-[40px] md:inset-[-24px]" />
                                <div className="overflow-hidden rounded-[28px] border border-[#e0e7ff] bg-white shadow-[0_25px_50px_-12px_rgba(79,70,229,.25)]">
                                    <div className="flex items-center gap-4 bg-[#1E1B2E] px-7 py-5">
                                        <img
                                            src="/assets/justin.webp"
                                            alt="Justin Wijaya"
                                            width={56}
                                            height={56}
                                            decoding="async"
                                            className="size-14 shrink-0 rounded-full border-2 border-[#fbbf24] bg-[#312e81] object-cover object-top"
                                        />
                                        <div className="flex min-w-0 flex-col gap-0.5">
                                            <span className="text-lg font-extrabold text-white">
                                                Audit Funnel 1-on-1 Gratis
                                            </span>
                                            <span className="text-sm font-medium text-[#c7d2fe]">
                                                Via Zoom · 1-on-1 · bersama tim
                                                PBM
                                            </span>
                                        </div>
                                    </div>

                                    {!submitted ? (
                                        <div className="flex flex-col p-6 sm:p-7">
                                            {/* Error Alert */}
                                            {error && (
                                                <div className="mb-4 flex items-start gap-2.5 rounded-xl border border-[#fecdd3] bg-[#fff1f2] px-3.5 py-2.5 text-xs font-semibold text-[#be123c]">
                                                    <svg
                                                        viewBox="0 0 24 24"
                                                        className={`mt-0.5 size-4 shrink-0 ${svgBase}`}
                                                        strokeWidth={2}
                                                    >
                                                        <circle cx="12" cy="12" r="10" />
                                                        <line x1="12" y1="8" x2="12" y2="12" />
                                                        <line x1="12" y1="16" x2="12.01" y2="16" />
                                                    </svg>
                                                    <span>{error}</span>
                                                </div>
                                            )}

                                            {/* STEP 1: Nama & Nomor WA */}
                                            {step === 1 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Nama &amp; Nomor WhatsApp Anda
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Untuk konfirmasi dan pengiriman link sesi Zoom audit.
                                                        </p>
                                                    </div>
                                                    <label className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-bold text-[#334155]">
                                                            Nama Lengkap <span className="text-[#e11d48]">*</span>
                                                        </span>
                                                        <input
                                                            id="audit-name"
                                                            name="name"
                                                            type="text"
                                                            autoComplete="name"
                                                            value={name}
                                                            onChange={(e) => {
                                                                setName(e.target.value);
                                                                if (error) setError('');
                                                            }}
                                                            placeholder="Contoh: Budi Santoso"
                                                            className={inputBase}
                                                        />
                                                    </label>
                                                    <label className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-bold text-[#334155]">
                                                            Nomor WhatsApp <span className="text-[#e11d48]">*</span>
                                                        </span>
                                                        <input
                                                            id="audit-phone"
                                                            name="phone"
                                                            type="tel"
                                                            inputMode="numeric"
                                                            autoComplete="tel"
                                                            value={phone}
                                                            onChange={(e) => {
                                                                setPhone(e.target.value);
                                                                if (error) setError('');
                                                            }}
                                                            placeholder="Contoh: 081234567890"
                                                            className={inputBase}
                                                        />
                                                    </label>
                                                    <label className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-bold text-[#334155]">
                                                            Alamat Email <span className="text-[#e11d48]">*</span>
                                                        </span>
                                                        <input
                                                            id="audit-email"
                                                            name="email"
                                                            type="email"
                                                            autoComplete="email"
                                                            value={email}
                                                            onChange={(e) => {
                                                                setEmail(e.target.value);
                                                                if (error) setError('');
                                                            }}
                                                            placeholder="nama@email.com"
                                                            className={inputBase}
                                                        />
                                                    </label>
                                                    <button
                                                        type="button"
                                                        onClick={nextStep}
                                                        className="mt-2 flex h-[52px] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca]"
                                                    >
                                                        Klaim Sesi Audit Gratis
                                                        <ArrowRight />
                                                    </button>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}

                                            {/* STEP 2: Link IG / Website Program */}
                                            {step === 2 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Link Instagram atau Website Program
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Agar tim PBM dapat menganalisis penawaran &amp; funnel Anda sebelum sesi.
                                                        </p>
                                                    </div>
                                                    <label className="flex flex-col gap-1.5">
                                                        <span className="text-xs font-bold text-[#334155]">
                                                            Link Instagram atau Website <span className="text-[#e11d48]">*</span>
                                                        </span>
                                                        <input
                                                            id="audit-link"
                                                            name="website_link"
                                                            type="text"
                                                            value={websiteLink}
                                                            onChange={(e) => {
                                                                setWebsiteLink(e.target.value);
                                                                if (error) setError('');
                                                            }}
                                                            placeholder="misal: instagram.com/brandanda atau brandanda.com"
                                                            className={inputBase}
                                                        />
                                                    </label>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevStep}
                                                            className="flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-sm font-bold text-[#475569] transition-all hover:bg-[#f8fafc]"
                                                        >
                                                            Kembali
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={nextStep}
                                                            className="flex h-[52px] flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca]"
                                                        >
                                                            Konfirmasi Link Program
                                                            <ArrowRight />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}

                                            {/* STEP 3: Program yang dijual */}
                                            {step === 3 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Program yang Anda Jual
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Pilih jenis produk atau program utama yang sedang dipasarkan.
                                                        </p>
                                                    </div>
                                                    <div className="flex max-h-[280px] flex-col gap-2 overflow-y-auto pr-1">
                                                        {PROGRAM_OPTIONS.map((opt) => (
                                                            <label
                                                                key={opt.value}
                                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3 transition-all ${
                                                                    programType === opt.value
                                                                        ? 'border-[#4f46e5] bg-[#eef2ff] shadow-sm'
                                                                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="program_type"
                                                                    value={opt.value}
                                                                    checked={programType === opt.value}
                                                                    onChange={() => {
                                                                        setProgramType(opt.value);
                                                                        if (error) setError('');
                                                                    }}
                                                                    className="size-4 text-[#4f46e5] accent-[#4f46e5]"
                                                                />
                                                                <span className="text-sm font-semibold text-[#1e293b]">
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    {programType === 'lainnya' && (
                                                        <div className="flex flex-col gap-1.5">
                                                            <span className="text-xs font-bold text-[#334155]">
                                                                Sebutkan jenis produk Anda: <span className="text-[#e11d48]">*</span>
                                                            </span>
                                                            <input
                                                                type="text"
                                                                value={otherProgram}
                                                                onChange={(e) => {
                                                                    setOtherProgram(e.target.value);
                                                                    if (error) setError('');
                                                                }}
                                                                placeholder="Contoh: Membership, Agency Jasa, dll"
                                                                className={inputBase}
                                                            />
                                                        </div>
                                                    )}
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevStep}
                                                            className="flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-sm font-bold text-[#475569] transition-all hover:bg-[#f8fafc]"
                                                        >
                                                            Kembali
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={nextStep}
                                                            className="flex h-[52px] flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca]"
                                                        >
                                                            Konfirmasi Jenis Program
                                                            <ArrowRight />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}

                                            {/* STEP 4: Total alumni / pembeli */}
                                            {step === 4 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Total Alumni / Pembeli Saat Ini
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Akumulasi peserta atau pembeli sejak program pertama kali dirilis.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {ALUMNI_OPTIONS.map((opt) => (
                                                            <label
                                                                key={opt.value}
                                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                                                                    totalBuyers === opt.value
                                                                        ? 'border-[#4f46e5] bg-[#eef2ff] shadow-sm'
                                                                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="total_buyers"
                                                                    value={opt.value}
                                                                    checked={totalBuyers === opt.value}
                                                                    onChange={() => {
                                                                        setTotalBuyers(opt.value);
                                                                        if (error) setError('');
                                                                    }}
                                                                    className="size-4 text-[#4f46e5] accent-[#4f46e5]"
                                                                />
                                                                <span className="text-sm font-semibold text-[#1e293b]">
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevStep}
                                                            className="flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-sm font-bold text-[#475569] transition-all hover:bg-[#f8fafc]"
                                                        >
                                                            Kembali
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={nextStep}
                                                            className="flex h-[52px] flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca]"
                                                        >
                                                            Konfirmasi Total Pembeli
                                                            <ArrowRight />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}

                                            {/* STEP 5: Omzet bisnis per bulan */}
                                            {step === 5 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Estimasi Omzet Bisnis per Bulan
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Estimasi rata-rata omzet bulanan dari penjualan program Anda.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {REVENUE_OPTIONS.map((opt) => (
                                                            <label
                                                                key={opt.value}
                                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                                                                    monthlyRevenue === opt.value
                                                                        ? 'border-[#4f46e5] bg-[#eef2ff] shadow-sm'
                                                                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="monthly_revenue"
                                                                    value={opt.value}
                                                                    checked={monthlyRevenue === opt.value}
                                                                    onChange={() => {
                                                                        setMonthlyRevenue(opt.value);
                                                                        if (error) setError('');
                                                                    }}
                                                                    className="size-4 text-[#4f46e5] accent-[#4f46e5]"
                                                                />
                                                                <span className="text-sm font-semibold text-[#1e293b]">
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevStep}
                                                            className="flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-sm font-bold text-[#475569] transition-all hover:bg-[#f8fafc]"
                                                        >
                                                            Kembali
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={nextStep}
                                                            className="flex h-[52px] flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca]"
                                                        >
                                                            Konfirmasi Omzet Bisnis
                                                            <ArrowRight />
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}

                                            {/* STEP 6: Kamu siapa di bisnis ini? */}
                                            {step === 6 && (
                                                <div className="flex flex-col gap-4">
                                                    <div className="flex flex-col gap-1">
                                                        <h3 className="text-base font-extrabold text-[#0f172a]">
                                                            Peran Anda di Bisnis Ini
                                                        </h3>
                                                        <p className="text-xs text-[#64748b]">
                                                            Untuk memastikan keputusan perbaikan funnel bisa langsung dieksekusi.
                                                        </p>
                                                    </div>
                                                    <div className="flex flex-col gap-2">
                                                        {ROLE_OPTIONS.map((opt) => (
                                                            <label
                                                                key={opt.value}
                                                                className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-all ${
                                                                    businessRole === opt.value
                                                                        ? 'border-[#4f46e5] bg-[#eef2ff] shadow-sm'
                                                                        : 'border-[#e2e8f0] bg-white hover:border-[#cbd5e1] hover:bg-[#f8fafc]'
                                                                }`}
                                                            >
                                                                <input
                                                                    type="radio"
                                                                    name="business_role"
                                                                    value={opt.value}
                                                                    checked={businessRole === opt.value}
                                                                    onChange={() => {
                                                                        setBusinessRole(opt.value);
                                                                        if (error) setError('');
                                                                    }}
                                                                    className="size-4 text-[#4f46e5] accent-[#4f46e5]"
                                                                />
                                                                <span className="text-sm font-semibold text-[#1e293b]">
                                                                    {opt.label}
                                                                </span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                    <div className="mt-2 flex items-center gap-3">
                                                        <button
                                                            type="button"
                                                            onClick={prevStep}
                                                            className="flex h-[52px] flex-1 cursor-pointer items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-sm font-bold text-[#475569] transition-all hover:bg-[#f8fafc]"
                                                        >
                                                            Kembali
                                                        </button>
                                                        <button
                                                            type="button"
                                                            onClick={submit}
                                                            disabled={submitting}
                                                            className="flex h-[52px] flex-[2] cursor-pointer items-center justify-center gap-2 rounded-xl bg-[#4f46e5] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(79,70,229,.3)] transition-all hover:bg-[#4338ca] disabled:opacity-75"
                                                        >
                                                            {submitting ? 'Memproses...' : 'Kirim & Cek Kualifikasi'}
                                                            {!submitting && <ArrowRight />}
                                                        </button>
                                                    </div>
                                                    <p className="mt-1 flex items-center justify-center gap-1.5 text-center text-xs font-semibold text-[#64748b]">
                                                        <span className="text-amber-500">⚡</span> Cuma butuh 30 detik untuk mengisi
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    ) : isQualified ? (
                                        /* QUALIFIED: LANGSUNG BOOKING KALENDER CALENDLY */
                                        <div className="flex flex-col items-center gap-5 p-6 sm:p-7 text-center">
                                            <div className="flex size-16 items-center justify-center rounded-full bg-[#d1fae5] shadow-inner">
                                                <CheckIcon className="size-[32px] text-[#059669]" />
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="inline-flex items-center gap-1.5 self-center rounded-full bg-[#d1fae5] px-3 py-1 text-xs font-extrabold text-[#047857]">
                                                    ✓ MEMENUHI KUALIFIKASI AUDIT
                                                </span>
                                                <h3 className="text-[22px] font-extrabold text-[#0f172a]">
                                                    Selamat, {name}!
                                                </h3>
                                                <p className="max-w-[420px] text-sm leading-[1.6] text-[#475569]">
                                                    Bisnis Anda memenuhi kriteria untuk mengikuti <strong>Sesi Audit Funnel 1-on-1 Gratis via Zoom</strong> bersama tim PBM.
                                                </p>
                                            </div>

                                            <div className="w-full rounded-xl border border-[#bbf7d0] bg-[#f0fdf4] p-4 text-left text-xs text-[#166534]">
                                                <div className="font-bold">Langkah Terakhir: Konfirmasi Jadwal di Calendly</div>
                                                <div className="mt-1">
                                                    Halaman Calendly telah dibuka di tab baru. Silakan pilih tanggal dan jam yang sesuai untuk sesi Zoom audit Anda.
                                                </div>
                                            </div>

                                            <a
                                                href={`${CALENDLY_URL}?name=${encodeURIComponent(name)}${
                                                    email ? `&email=${encodeURIComponent(email)}` : ''
                                                }&a1=${encodeURIComponent(phone)}&a2=${encodeURIComponent(websiteLink)}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex h-[54px] w-full items-center justify-center gap-2 rounded-xl bg-[#059669] text-base font-extrabold text-white shadow-[0_10px_15px_-3px_rgba(5,150,105,.35)] transition-all hover:-translate-y-0.5 hover:bg-[#047857]"
                                            >
                                                Buka Kalender Calendly (Tab Baru)
                                                <ArrowRight />
                                            </a>

                                            <p className="text-xs text-[#64748b]">
                                                Jika tab Calendly belum terbuka otomatis, silakan klik tombol di atas.
                                            </p>
                                        </div>
                                    ) : (
                                        /* DISQUALIFIED (GUGUR) */
                                        <div className="flex flex-col items-center gap-4 p-6 sm:p-7 text-center">
                                            <div className="flex size-14 items-center justify-center rounded-full bg-[#fef3c7]">
                                                <svg
                                                    viewBox="0 0 24 24"
                                                    className={`size-7 text-[#d97706] ${svgBase}`}
                                                    strokeWidth={2.5}
                                                >
                                                    <circle cx="12" cy="12" r="10" />
                                                    <line x1="12" y1="8" x2="12" y2="12" />
                                                    <line x1="12" y1="16" x2="12.01" y2="16" />
                                                </svg>
                                            </div>
                                            <div className="flex flex-col gap-1.5">
                                                <span className="inline-flex items-center self-center rounded-full bg-[#fef3c7] px-3 py-1 text-xs font-extrabold text-[#b45309]">
                                                    STATUS KUALIFIKASI
                                                </span>
                                                <h3 className="text-[20px] font-extrabold text-[#0f172a]">
                                                    Terima kasih, {name}!
                                                </h3>
                                                <p className="max-w-[380px] text-sm leading-[1.6] text-[#475569]">
                                                    Mohon maaf, saat ini sesi audit 1-on-1 intensif dikhususkan untuk program edukasi yang sudah memiliki alumni/pembeli aktif dan dikelola oleh internal owner.
                                                </p>
                                            </div>

                                            <div className="w-full rounded-xl border border-[#fed7aa] bg-[#fff7ed] p-4 text-left text-xs leading-[1.5] text-[#9a3412]">
                                                Hal ini penting agar sesi bedah funnel bisa langsung mengevaluasi data analitik nyata dan memberikan rekomendasi yang langsung berdampak pada penjualan.
                                            </div>

                                            <div className="mt-2 flex w-full flex-col gap-2.5">
                                                <a
                                                    href={wa(
                                                        `Halo Tim PBM, saya ${name}. Saya sudah mengisi form kualifikasi di website PBM dan ingin berkonsultasi seputar funnel program saya.`
                                                    )}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex h-[52px] w-full items-center justify-center gap-2 rounded-xl bg-[#25D366] text-sm font-extrabold text-white shadow-md transition-all hover:bg-[#1eb956]"
                                                >
                                                    Tanya Tim PBM via WhatsApp
                                                </a>
                                                <button
                                                    type="button"
                                                    onClick={resetForm}
                                                    className="flex h-[44px] w-full items-center justify-center rounded-xl border border-[#cbd5e1] bg-white text-xs font-bold text-[#64748b] transition-all hover:bg-[#f8fafc]"
                                                >
                                                    Ulangi Pengisian Formulir
                                                </button>
                                            </div>
                                        </div>
                                    )}

                                    <div className="flex items-center gap-[14px] border-t border-[#f1f5f9] bg-[#f8fafc] px-7 py-[18px]">
                                        <Avatars size="sm" />
                                        <p className="text-sm leading-[1.45] font-medium text-[#475569]">
                                            Dipercaya{' '}
                                            <strong className="text-[#0f172a]">
                                                {clientCount}
                                            </strong>{' '}
                                            pemilik kelas online, coach &amp;
                                            trainer, termasuk{' '}
                                            <strong className="text-[#0f172a]">
                                                Tsania Latheefa
                                            </strong>
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>

            {/* PAIN POINTS */}
            <section id="pain" className="bg-white py-[clamp(72px,11vw,112px)]">
                <div className={`${CONTAINER} max-w-[1152px]`}>
                    <div className="mb-12">
                        <span className={KICKER}>// Pain Points</span>
                        <h2 className="text-[length:clamp(22px,5.6vw,44px)] leading-[1.2] font-extrabold tracking-[-0.025em] whitespace-nowrap text-[#0f172a]">
                            Apakah Anda Sedang Mengalami Ini?
                        </h2>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,420px),1fr))] gap-5">
                        {PAINS.map((text, i) => (
                            <div
                                key={i}
                                className="flex flex-col items-start gap-[14px] rounded-[20px] border border-[#f1f5f9] bg-[rgba(248,250,252,.7)] p-[22px] transition-all duration-300 hover:border-[#e0e7ff] hover:bg-[rgba(238,242,255,.4)] md:flex-row md:gap-5 md:p-7"
                            >
                                <div className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-[#eef2ff] text-base font-extrabold text-[#4f46e5]">
                                    0{i + 1}
                                </div>
                                <p className="text-[17px] leading-[1.65] font-medium text-[#334155]">
                                    {text}
                                </p>
                            </div>
                        ))}
                    </div>

                    <div className="relative mt-14 overflow-hidden rounded-[28px] border border-[#fecdd3] bg-[rgba(255,241,242,.6)] p-[clamp(28px,5vw,48px)]">
                        <div className="pointer-events-none absolute -top-20 -right-20 size-[280px] rounded-full bg-[rgba(254,205,211,.6)] blur-[60px]" />
                        <div className="relative flex max-w-[820px] flex-col gap-5">
                            <div className="inline-flex items-center gap-2 self-start rounded-full border border-[#fecdd3] bg-[#ffe4e6] px-[14px] py-1.5 text-xs leading-4 font-bold tracking-[.1em] text-[#be123c] uppercase">
                                <svg
                                    viewBox="0 0 24 24"
                                    className={`size-[14px] ${svgBase}`}
                                    strokeWidth={2.5}
                                >
                                    <circle cx="12" cy="12" r="10" />
                                    <line x1="12" x2="12" y1="8" y2="12" />
                                    <line x1="12" x2="12.01" y1="16" y2="16" />
                                </svg>
                                Kalau Dibiarkan Terus
                            </div>
                            <p className="text-[length:clamp(18px,2.4vw,22px)] leading-[1.6] font-semibold text-pretty text-[#0f172a]">
                                <R
                                    c={{
                                        d: 'Bayangkan jika kebocoran ini dibiarkan. Setiap launching, ratusan calon peserta yang sudah klik, baca, bahkan chat, pergi tanpa mendaftar.',
                                        m: 'Setiap launching, ratusan calon peserta yang sudah klik, baca, bahkan chat, pergi tanpa mendaftar.',
                                    }}
                                />
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <span className="inline-flex items-center gap-2 rounded-xl border border-[#fecdd3] bg-white px-4 py-2.5 text-base font-bold text-[#be123c]">
                                    Batch ini boncos{' '}
                                    <span className="text-xl font-extrabold">
                                        3 juta
                                    </span>
                                </span>
                                <span className="inline-flex items-center gap-2 rounded-xl border border-[#fecdd3] bg-white px-4 py-2.5 text-base font-bold text-[#be123c]">
                                    Batch depan{' '}
                                    <span className="text-xl font-extrabold">
                                        10 juta
                                    </span>
                                </span>
                            </div>
                            <p className="text-lg leading-[1.6] text-[#475569]">
                                <span className="hidden md:inline">
                                    Sampai kapan budget iklan dipakai menambal
                                    halaman yang bocor? Makin lama dibiarkan,
                                    makin banyak calon peserta yang{' '}
                                    <strong className="text-[#be123c]">
                                        Anda serahkan ke kompetitor.
                                    </strong>
                                </span>
                                <span className="md:hidden">
                                    Makin lama halaman bocor dibiarkan, makin
                                    banyak calon peserta yang{' '}
                                    <strong className="text-[#be123c]">
                                        Anda serahkan ke kompetitor.
                                    </strong>
                                </span>
                            </p>
                        </div>
                    </div>

                    <div className="mx-auto mt-14 flex max-w-[720px] flex-col items-center gap-7 text-center">
                        <p className="text-[length:clamp(20px,2.6vw,24px)] leading-[1.55] font-bold text-balance text-[#0f172a]">
                            <span className="text-[#4f46e5]">Tapi tenang.</span>{' '}
                            <R
                                c={{
                                    d: 'Di sesi audit ini, kami bongkar semua titik bocor di jalur penjualan Anda, lengkap dengan cara menutupnya.',
                                    m: 'Di sesi audit, kami bongkar semua titik bocor Anda, lengkap dengan cara menutupnya.',
                                }}
                            />
                        </p>
                        <a href="#audit-form" className={CTA_PRIMARY}>
                            Klaim Audit Gratis Sekarang
                            <ArrowRight />
                        </a>
                    </div>
                </div>
            </section>

            {/* BENEFIT */}
            <section
                id="benefit"
                className="bg-[#F5F3FF] py-[clamp(72px,12vw,128px)]"
            >
                <div className={`${CONTAINER} max-w-[1152px]`}>
                    <div className="mx-auto mb-14 max-w-[800px] text-center">
                        <span className={KICKER}>// Benefit</span>
                        <h2 className="text-[length:clamp(24px,6.2vw,48px)] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance text-[#0f172a]">
                            Audit Funnel 1-on-1 Gratis Untuk Bisnis Kelas &amp;
                            Coaching Anda
                        </h2>
                        <p className="mt-5 text-lg leading-[1.65] text-pretty text-[#475569]">
                            <R
                                c={{
                                    d: 'Sesi 1-on-1 via Zoom untuk membongkar seluruh jalur penjualan Anda: iklan, landing page, form, sampai follow-up WhatsApp.',
                                    m: 'Sesi Zoom 1-on-1 untuk membongkar iklan, landing page, form, sampai follow-up WA Anda.',
                                }}
                            />
                        </p>
                    </div>
                    <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,300px),1fr))] gap-6">
                        {PILLARS.map((p, i) => (
                            <div
                                key={p.key}
                                className="relative flex flex-col gap-4 overflow-hidden rounded-[28px] border border-[#e0e7ff] bg-white px-8 py-9 shadow-[0_20px_25px_-5px_rgba(224,231,255,.5)] transition-all duration-[350ms] hover:-translate-y-1.5 hover:shadow-[0_30px_50px_-15px_rgba(79,70,229,.3)]"
                            >
                                <span
                                    aria-hidden="true"
                                    className="pointer-events-none absolute top-3 right-5 text-[88px] leading-none font-extrabold text-[#eef2ff] select-none"
                                >
                                    0{i + 1}
                                </span>
                                <div className="relative flex size-[52px] items-center justify-center rounded-2xl bg-[#4f46e5] text-white shadow-[0_10px_20px_-8px_rgba(79,70,229,.6)]">
                                    {p.icon}
                                </div>
                                <h3 className="relative text-[22px] leading-[1.3] font-extrabold text-[#0f172a]">
                                    <span className="text-[#4f46e5]">
                                        {p.key}
                                    </span>{' '}
                                    {p.rest}
                                </h3>
                                <p className="relative text-base leading-[1.65] text-[#475569]">
                                    {p.desc}
                                </p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-10 flex justify-center">
                        <a href="#audit-form" className={CTA_PRIMARY}>
                            Klaim Audit Gratis Sekarang
                            <ArrowRight />
                        </a>
                    </div>
                </div>
            </section>



            {/* ABOUT */}
            <section
                id="about"
                className="relative overflow-hidden bg-[#1E1B2E] py-[clamp(72px,12vw,128px)]"
            >
                <div className="pointer-events-none absolute top-[30%] left-[-10%] h-[500px] w-[700px] rounded-full bg-[rgba(79,70,229,.22)] blur-[120px]" />
                <div className={`${CONTAINER} relative z-10 max-w-[1152px]`}>
                    <div className="mb-12">
                        <span className={`${KICKER} !text-[#fbbf24]`}>
                            // About
                        </span>
                        <h2 className="text-[length:clamp(20px,5.2vw,44px)] leading-[1.2] font-extrabold tracking-[-0.025em] whitespace-nowrap text-white">
                            Siapa yang Akan Membedah Funnel Anda?
                        </h2>
                    </div>
                    <div className="flex flex-wrap items-start gap-8 md:gap-12">
                        <div className="flex min-w-0 flex-[4_1_320px] flex-col gap-5">
                            <div className="relative flex aspect-[4/5] w-full max-w-[320px] items-end justify-center overflow-hidden rounded-[28px] border border-[rgba(99,102,241,.35)] bg-[linear-gradient(to_bottom,#312e81,#1E1B2E)] md:max-w-none">
                                <img
                                    src="/assets/justin.webp"
                                    alt="Justin Wijaya"
                                    width={300}
                                    height={375}
                                    loading="lazy"
                                    decoding="async"
                                    className="w-[92%] [mask-image:linear-gradient(to_top,transparent_0%,black_12%)] object-contain"
                                />
                            </div>
                            <div className="flex flex-col gap-1.5">
                                <h3 className="text-[26px] font-extrabold text-white">
                                    Justin Wijaya
                                </h3>
                                <p className="text-base font-semibold text-[#c7d2fe]">
                                    Founder PBM · CRO Specialist
                                </p>
                                <p className="flex items-center gap-2 text-[15px] font-semibold text-[#94a3b8]">
                                    <svg
                                        viewBox="0 0 24 24"
                                        className={`size-4 ${svgBase}`}
                                        strokeWidth={2}
                                    >
                                        <rect
                                            width="20"
                                            height="20"
                                            x="2"
                                            y="2"
                                            rx="5"
                                            ry="5"
                                        />
                                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                                        <line
                                            x1="17.5"
                                            x2="17.51"
                                            y1="6.5"
                                            y2="6.5"
                                        />
                                    </svg>
                                    @justinwijaya ·{' '}
                                    <span className="text-[#fbbf24]">
                                        213K Followers
                                    </span>
                                </p>
                            </div>
                        </div>
                        <div className="flex min-w-0 flex-[6_1_420px] flex-col gap-7">
                            <p className="text-[19px] leading-[1.7] text-pretty text-[#e2e8f0]">
                                <R
                                    c={{
                                        d: 'Setelah membangun ratusan landing page, saya melihat pola yang sama: keahlian luar biasa, audiens sudah ada, tapi omzet mentok karena iklan dan halaman berjalan sendiri-sendiri.',
                                        m: 'Dari ratusan landing page yang saya bangun, polanya sama: keahlian ada, audiens ada, tapi omzet mentok.',
                                    }}
                                />
                            </p>
                            <div className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,220px),1fr))] gap-[14px]">
                                <div className="flex flex-col gap-2 rounded-[18px] border border-[rgba(71,85,105,.5)] bg-[rgba(15,23,42,.6)] p-5">
                                    <span className="text-xs font-bold tracking-[.12em] text-[#94a3b8] uppercase">
                                        Advertiser
                                    </span>
                                    <p className="text-base leading-[1.5] font-semibold text-white">
                                        Fokus mendatangkan traffic semurah
                                        mungkin.
                                    </p>
                                </div>
                                <div className="flex flex-col gap-2 rounded-[18px] border border-[rgba(71,85,105,.5)] bg-[rgba(15,23,42,.6)] p-5">
                                    <span className="text-xs font-bold tracking-[.12em] text-[#94a3b8] uppercase">
                                        Desainer
                                    </span>
                                    <p className="text-base leading-[1.5] font-semibold text-white">
                                        Fokus membuat halaman terlihat cantik.
                                    </p>
                                </div>
                            </div>
                            <p className="text-lg leading-[1.7] text-[#cbd5e1]">
                                <strong className="text-[#fda4af]">
                                    Hasilnya?
                                </strong>{' '}
                                <R
                                    c={{
                                        d: 'Iklan ramai, halaman estetik, tapi yang transfer tetap sedikit. Tidak ada yang bertanggung jawab atas apa yang terjadi setelah orang klik.',
                                        m: 'Iklan ramai, halaman estetik, tapi yang transfer tetap sedikit. Tak ada yang urus setelah orang klik.',
                                    }}
                                />
                            </p>
                            <p className="text-lg leading-[1.7] text-[#cbd5e1]">
                                <strong className="text-white">
                                    PBM menjembatani celah itu.
                                </strong>{' '}
                                <R
                                    c={{
                                        d: 'Kami membaca data traffic sekaligus psikologi pembeli keahlian, karena membeli kelas adalah keputusan berbasis kepercayaan.',
                                        m: 'Kami membaca data traffic sekaligus psikologi orang yang membeli keahlian.',
                                    }}
                                />
                            </p>
                            <blockquote className="rounded-[20px] border border-[rgba(251,191,36,.35)] bg-[rgba(251,191,36,.08)] px-7 py-6 text-[length:clamp(19px,2.4vw,22px)] leading-[1.5] font-bold text-pretty text-white">
                                "Landing page bukan brosur digital, tapi{' '}
                                <span className="text-[#fbbf24]">
                                    mesin penjualan
                                </span>{' '}
                                yang terukur dan bisa di-scale."
                            </blockquote>
                            <p className="text-lg leading-[1.7] text-[#cbd5e1]">
                                <R
                                    c={{
                                        d: 'Di sesi audit nanti, saya akan gunakan pengalaman ini untuk membantu Anda menemukan kebocoran terbesar di funnel Anda.',
                                        m: 'Di sesi audit, saya pakai pengalaman ini untuk menemukan kebocoran terbesar di funnel Anda.',
                                    }}
                                />
                            </p>
                            <a
                                href="#audit-form"
                                className={`${CTA_AMBER} self-start`}
                            >
                                Klaim Audit Gratis Sekarang
                                <ArrowRight />
                            </a>
                        </div>
                    </div>
                </div>
            </section>

            {/* CASE STUDY */}
            <section
                id="case-study"
                className="bg-[#F9FAFB] py-[clamp(72px,12vw,128px)]"
            >
                <div className={`${CONTAINER} max-w-[1024px]`}>
                    <div className="mx-auto mb-12 max-w-[900px] text-center">
                        <div className="mb-6 inline-block rounded-full border border-[#c7d2fe] bg-[#eef2ff] px-5 py-1.5 text-xs leading-4 font-bold tracking-[.1em] text-[#4338ca] uppercase">
                            Studi Kasus
                        </div>
                        <h2 className="text-[length:clamp(22px,5.4vw,40px)] leading-[1.25] font-extrabold tracking-[-0.025em] text-balance text-[#0f172a]">
                            Traffic Deras Tapi Omzet Mentok?{' '}
                            <span className="text-[#4f46e5]">
                                Cara Tsania Naikkan Omzet 50% Tanpa Tambah
                                Budget Iklan.
                            </span>
                        </h2>
                    </div>
                    <div className="rounded-[28px] border border-[#e2e8f0] bg-white p-[clamp(20px,4vw,32px)] shadow-[0_20px_25px_-5px_rgba(0,0,0,.06)]">
                        <div className="mb-5 flex items-center gap-4">
                            <img
                                src="/assets/tsan-thumb-opt.webp"
                                alt="Tsania Latheefa"
                                width={56}
                                height={56}
                                loading="lazy"
                                decoding="async"
                                className="size-14 rounded-full border-2 border-[#eef2ff] object-cover"
                            />
                            <div>
                                <h3 className="text-[19px] font-extrabold text-[#0f172a]">
                                    Tsania Latheefa
                                </h3>
                                <p className="text-[15px] font-medium text-[#64748b]">
                                    Affiliate Jago Jualan · Kelas Belajar
                                    Affiliate &amp; Sosmed
                                </p>
                            </div>
                        </div>
                        <CaseStudyVideo />
                        <blockquote className="mt-6 text-[length:clamp(19px,2.6vw,24px)] leading-[1.45] font-bold text-pretty text-[#0f172a]">
                            <span className="text-[#94a3b8]">"</span>
                            <span className="hidden md:inline">
                                Ya Alhamdulillah sih ya, yang biasanya di
                                lynk.id kemarin itu 20 juta (per bulan), naik 10
                                juta,{' '}
                                <span className="text-[#059669]">
                                    30 juta sekarang... bahkan lebih ya
                                </span>
                            </span>
                            <span className="md:hidden">
                                Biasanya di lynk.id 20 juta per bulan,{' '}
                                <span className="text-[#059669]">
                                    sekarang naik jadi 30 juta, bahkan lebih
                                </span>
                            </span>
                            <span className="text-[#94a3b8]">"</span>
                        </blockquote>
                        <p className="mt-2.5 text-[15px] font-semibold text-[#64748b]">
                            — Tsania Latheefa, Affiliate Jago Jualan
                        </p>
                    </div>

                    <div className="relative mt-8 overflow-hidden rounded-3xl">
                        <div
                            className="flex transition-transform duration-[600ms] ease-[cubic-bezier(.4,0,.2,1)]"
                            style={{
                                transform: `translateX(-${slide * 100}%)`,
                            }}
                        >
                            {TESTIMONIALS.map((t) => (
                                <div
                                    key={t.name}
                                    className="flex-[0_0_100%] p-0.5"
                                >
                                    <div className="flex flex-col gap-5 rounded-3xl border border-[#e0e7ff] bg-[#f8f6fc] p-[clamp(22px,5.4vw,40px)]">
                                        <blockquote className="text-[length:clamp(20px,3vw,26px)] leading-[1.35] font-extrabold tracking-[-0.01em] text-balance text-[#0f172a]">
                                            "{t.quote}"
                                        </blockquote>
                                        <div className="flex items-center gap-3">
                                            <div className="flex size-11 items-center justify-center rounded-full bg-[#4f46e5] text-sm font-bold text-white">
                                                {t.initials}
                                            </div>
                                            <div>
                                                <p className="text-[17px] font-bold text-[#0f172a]">
                                                    {t.name}
                                                </p>
                                                <p className="text-[15px] font-medium text-[#64748b]">
                                                    {t.role}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className="mt-5 flex items-center justify-center gap-5">
                        <button
                            type="button"
                            onClick={() => goSlide(slide - 1)}
                            aria-label="Sebelumnya"
                            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#a5b4fc] hover:text-[#4f46e5]"
                        >
                            <Chevron dir="left" />
                        </button>
                        <div className="flex items-center gap-1">
                            {TESTIMONIALS.map((t, i) => (
                                <button
                                    key={t.name}
                                    type="button"
                                    onClick={() => goSlide(i)}
                                    aria-label={`Slide ${i + 1}`}
                                    className="flex size-8 cursor-pointer items-center justify-center p-1"
                                >
                                    <span
                                        className={`h-2.5 rounded-full transition-all duration-300 ${i === slide ? 'w-7 bg-[#4f46e5]' : 'w-2.5 bg-[#cbd5e1]'}`}
                                    />
                                </button>
                            ))}
                        </div>
                        <button
                            type="button"
                            onClick={() => goSlide(slide + 1)}
                            aria-label="Berikutnya"
                            className="flex size-11 cursor-pointer items-center justify-center rounded-full border border-[#e2e8f0] bg-white text-[#0f172a] hover:border-[#a5b4fc] hover:text-[#4f46e5]"
                        >
                            <Chevron dir="right" />
                        </button>
                    </div>
                    <div className="mt-10 flex justify-center">
                        <a href="#audit-form" className={CTA_PRIMARY}>
                            Klaim Audit Gratis Sekarang
                            <ArrowRight />
                        </a>
                    </div>
                </div>
            </section>

            {/* STORYTELLING */}
            <section
                id="story"
                className="bg-white py-[clamp(72px,12vw,128px)]"
            >
                <div className={`${CONTAINER} max-w-[1024px]`}>
                    <h3 className="mb-8 text-[length:clamp(22px,3vw,28px)] font-extrabold text-[#0f172a]">
                        Bukan cuma Tsania, ini bukti hasil klien lainnya:
                    </h3>
                        <div className="flex flex-col gap-6">
                            <div className="flex flex-col gap-[clamp(20px,3vw,28px)] rounded-[28px] border border-[#e0e7ff] bg-[#f8f6fc] p-[clamp(20px,4vw,32px)]">
                                <div className="flex flex-col gap-2.5">
                                    <span className="text-[13px] font-bold tracking-[.12em] text-[#4f46e5] uppercase">
                                        Kasus 1
                                    </span>
                                    <div>
                                        <h4 className="text-xl font-extrabold text-[#0f172a]">
                                            Rashid Damanhuri
                                        </h4>
                                        <p className="text-[15px] font-semibold text-[#64748b]">
                                            Kelas Belajar Bisnis
                                        </p>
                                    </div>
                                    <p className="text-[length:clamp(30px,4vw,40px)] leading-[1.1] font-extrabold tracking-[-0.02em] whitespace-nowrap text-[#0f172a]">
                                        3,2% → 4,1%
                                    </p>
                                    <p className="text-base leading-[1.6] text-[#475569]">
                                        Conversion rate naik, purchase naik 29%
                                        dalam 30 hari.
                                    </p>
                                </div>
                                <div className="grid grid-cols-1 items-start gap-[14px] md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)]">
                                    <button
                                        type="button"
                                        onClick={() => setLightbox(0)}
                                        aria-label="Lihat bukti performa Rashid Damanhuri"
                                        className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f1f5f9] p-0 transition-all duration-200 hover:border-[#a5b4fc] hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,.35)]"
                                    >
                                        <img
                                            src={PROOFS[0].src}
                                            alt={PROOFS[0].label}
                                            width={600}
                                            height={400}
                                            loading="lazy"
                                            decoding="async"
                                            className="block h-auto w-full"
                                        />
                                        <span className="absolute right-2.5 bottom-2.5 flex size-9 items-center justify-center rounded-full bg-[rgba(15,23,42,.7)] text-white">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={`size-4 ${svgBase}`}
                                                strokeWidth={2.5}
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                                <path d="M11 8v6" />
                                                <path d="M8 11h6" />
                                            </svg>
                                        </span>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setLightbox(2)}
                                        aria-label="Lihat testimoni WhatsApp Rashid Damanhuri"
                                        className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f1f5f9] p-0 transition-all duration-200 hover:border-[#a5b4fc] hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,.35)]"
                                    >
                                        <img
                                            src={PROOFS[2].src}
                                            alt={PROOFS[2].label}
                                            width={600}
                                            height={400}
                                            loading="lazy"
                                            decoding="async"
                                            className="block h-auto w-full"
                                        />
                                        <span className="absolute right-2.5 bottom-2.5 flex size-9 items-center justify-center rounded-full bg-[rgba(15,23,42,.7)] text-white">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={`size-4 ${svgBase}`}
                                                strokeWidth={2.5}
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                                <path d="M11 8v6" />
                                                <path d="M8 11h6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                            <div className="flex flex-col gap-[clamp(20px,3vw,28px)] rounded-[28px] border border-[#e0e7ff] bg-[#f8f6fc] p-[clamp(20px,4vw,32px)]">
                                <div className="flex flex-col gap-2.5">
                                    <span className="text-[13px] font-bold tracking-[.12em] text-[#4f46e5] uppercase">
                                        Kasus 2
                                    </span>
                                    <div>
                                        <h4 className="text-xl font-extrabold text-[#0f172a]">
                                            Mas Ardi
                                        </h4>
                                        <p className="text-[15px] font-semibold text-[#64748b]">
                                            Fullbright · Kelas Pelatihan
                                            TOEFL/IELTS
                                        </p>
                                    </div>
                                    <p className="text-[length:clamp(30px,4vw,40px)] leading-[1.1] font-extrabold tracking-[-0.02em] whitespace-nowrap text-[#0f172a]">
                                        ROAS 5x
                                    </p>
                                    <p className="text-base leading-[1.6] text-[#475569]">
                                        Dibanding periode yang sama tahun
                                        sebelumnya.
                                    </p>
                                </div>
                                <div className="w-full max-w-[480px] self-center">
                                    <button
                                        type="button"
                                        onClick={() => setLightbox(1)}
                                        aria-label="Lihat bukti chat Mas Ardi, Fullbright"
                                        className="relative block w-full cursor-zoom-in overflow-hidden rounded-2xl border border-[#e2e8f0] bg-[#f1f5f9] p-0 transition-all duration-200 hover:border-[#a5b4fc] hover:shadow-[0_10px_25px_-10px_rgba(99,102,241,.35)]"
                                    >
                                        <img
                                            src={PROOFS[1].src}
                                            alt={PROOFS[1].label}
                                            width={600}
                                            height={400}
                                            loading="lazy"
                                            decoding="async"
                                            className="block h-auto w-full"
                                        />
                                        <span className="absolute right-2.5 bottom-2.5 flex size-9 items-center justify-center rounded-full bg-[rgba(15,23,42,.7)] text-white">
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={`size-4 ${svgBase}`}
                                                strokeWidth={2.5}
                                            >
                                                <circle cx="11" cy="11" r="8" />
                                                <path d="m21 21-4.3-4.3" />
                                                <path d="M11 8v6" />
                                                <path d="M8 11h6" />
                                            </svg>
                                        </span>
                                    </button>
                                </div>
                            </div>
                        </div>

                    <div className="relative mt-14 flex flex-col items-center gap-7 overflow-hidden rounded-[28px] bg-[#1E1B2E] p-[clamp(32px,5vw,48px)] text-center">
                        <div className="pointer-events-none absolute top-1/2 left-1/2 h-[300px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(79,70,229,.25)] blur-[80px]" />
                        <p className="relative max-w-[720px] text-[length:clamp(20px,3vw,28px)] leading-[1.4] font-extrabold text-balance text-white">
                            <span className="text-[#fbbf24]">Bukti nyata.</span>{' '}
                            <R
                                c={{
                                    d: 'Traffic yang sama, dialirkan ke halaman yang berbeda, menghasilkan angka yang jauh berbeda.',
                                    m: 'Traffic sama, halaman berbeda, hasilnya jauh berbeda.',
                                }}
                            />
                        </p>
                        <a
                            href="#audit-form"
                            className={`${CTA_AMBER} relative`}
                        >
                            Klaim Audit Gratis Sekarang
                            <ArrowRight />
                        </a>
                    </div>
                </div>
            </section>

            {/* FAQ */}
            <section
                id="faq"
                className="bg-[#f8fafc] py-[clamp(72px,11vw,112px)]"
            >
                <div className={`${CONTAINER} max-w-[896px]`}>
                    <div className="mb-12 text-center">
                        <span className={KICKER}>// FAQ</span>
                        <h2 className="text-[length:clamp(24px,6vw,40px)] leading-[1.2] font-extrabold tracking-[-0.025em]">
                            Pertanyaan yang Sering Ditanyakan
                        </h2>
                    </div>
                    <div className="flex flex-col gap-[14px]">
                        {FAQS.map((f, i) => {
                            const open = !!openFaq[i];

                            return (
                                <div
                                    key={f.q}
                                    className="rounded-2xl border border-[#e2e8f0] bg-white shadow-[0_1px_2px_rgba(0,0,0,.05)]"
                                >
                                    <button
                                        type="button"
                                        onClick={() =>
                                            setOpenFaq((s) => ({
                                                ...s,
                                                [i]: !s[i],
                                            }))
                                        }
                                        aria-expanded={open}
                                        className="flex w-full cursor-pointer items-center justify-between gap-4 px-[clamp(20px,4vw,32px)] py-6 text-left text-lg leading-[1.45] font-bold text-[#0f172a]"
                                    >
                                        <span>{f.q}</span>
                                        <span
                                            className={`relative flex size-[26px] shrink-0 items-center justify-center rounded-full ${
                                                open
                                                    ? 'bg-[#eef2ff] text-[#4f46e5]'
                                                    : 'bg-[#f1f5f9] text-[#0f172a]'
                                            }`}
                                        >
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={`absolute size-4 transition-opacity duration-150 ${svgBase} ${open ? 'opacity-0' : 'opacity-100'}`}
                                                strokeWidth={3}
                                            >
                                                <path d="M12 4v16m8-8H4" />
                                            </svg>
                                            <svg
                                                viewBox="0 0 24 24"
                                                className={`absolute size-4 transition-opacity duration-150 ${svgBase} ${open ? 'opacity-100' : 'opacity-0'}`}
                                                strokeWidth={3}
                                            >
                                                <path d="M20 12H4" />
                                            </svg>
                                        </span>
                                    </button>
                                    {open && (
                                        <div className="border-t border-[#f1f5f9] px-[clamp(20px,4vw,32px)] pt-[18px] pb-[26px] text-[17px] leading-[1.65] text-[#475569]">
                                            <R c={f.a} />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </div>
                    <div className="mt-10 flex flex-col items-center gap-4 text-center">
                        <a href="#audit-form" className={CTA_PRIMARY}>
                            Klaim Audit Gratis Sekarang
                            <ArrowRight />
                        </a>
                        <p className="text-[15px] font-medium text-[#64748b]">
                            Dipercaya{' '}
                            <strong className="text-[#0f172a]">
                                {clientCount}
                            </strong>{' '}
                            pemilik kelas online, coach &amp; trainer
                        </p>
                    </div>
                </div>
            </section>

            {/* FINAL CTA */}
            <section
                id="final-cta"
                className="relative overflow-hidden bg-[#1E1B2E] py-[clamp(80px,13vw,144px)] text-center"
            >
                <div className="absolute top-0 left-1/2 h-px w-full -translate-x-1/2 bg-[linear-gradient(to_right,transparent,rgba(99,102,241,.5),transparent)]" />
                <div className="pointer-events-none absolute top-1/2 left-1/2 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[rgba(79,70,229,.22)] blur-[120px]" />
                <div
                    className={`${CONTAINER} relative z-10 flex max-w-[896px] flex-col items-center gap-9`}
                >
                    <h2 className="text-[length:clamp(28px,7vw,56px)] leading-[1.15] font-extrabold tracking-[-0.025em] text-balance text-white">
                        Siap Menutup Kebocoran Funnel Anda?
                    </h2>
                    <a
                        href="#audit-form"
                        className="inline-flex min-h-[76px] cursor-pointer items-center justify-center rounded-full border border-[#fcd34d] bg-[#fbbf24] px-[clamp(28px,5vw,52px)] py-4 text-[length:clamp(17px,2.4vw,22px)] leading-[1.3] font-extrabold tracking-[.03em] text-[#451a03] shadow-[0_0_40px_-10px_rgba(251,191,36,.45)] transition-all duration-300 hover:scale-[1.04] hover:bg-[#f59e0b] hover:text-[#451a03]"
                    >
                        KLAIM AUDIT GRATIS SEKARANG
                    </a>
                    <p className="flex flex-wrap justify-center gap-2.5 text-base font-semibold text-[#94a3b8]">
                        <span>Hanya 5 slot per minggu</span>
                        <span className="text-[#475569]">·</span>
                        <span>Gratis</span>
                        <span className="text-[#475569]">·</span>
                        <span>Tanpa kewajiban</span>
                    </p>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="border-t border-[#e2e8f0] bg-[#f8fafc] pt-16 pb-10 text-[15px] leading-[1.6] text-[#475569]">
                <div className={`${CONTAINER} max-w-[1152px]`}>
                    <div className="flex max-w-[540px] flex-col gap-[14px]">
                        <div className="flex items-center gap-3">
                            <img
                                src="/assets/logo.webp"
                                alt="PBM Logo"
                                width={36}
                                height={36}
                                loading="lazy"
                                decoding="async"
                                className="size-9 rounded-lg object-cover"
                            />
                            <span className="text-lg font-extrabold text-[#0f172a]">
                                PBM
                            </span>
                        </div>
                        <p className="font-semibold text-[#334155]">
                            Performance Business Marketing
                        </p>
                        <p>
                            Spesialis High-Converting Landing Page &amp;
                            Funnel CRO untuk Pemilik Kelas Online, Coach,
                            Trainer &amp; Konsultan.
                        </p>
                    </div>
                    <div className="mt-12 flex flex-col gap-3 border-t border-[#e2e8f0] pt-6">
                        <p className="text-sm text-[#475569]">
                            <strong className="text-[#334155]">
                                Disclaimer:
                            </strong>{' '}
                            Hasil setiap bisnis dapat bervariasi tergantung
                            kecocokan produk dengan pasar, penawaran, dan skala
                            budget iklan yang digunakan.
                        </p>
                        <p className="font-medium text-[#475569]">
                            © 2026 PBM Agency. All rights reserved.
                        </p>
                    </div>
                </div>
            </footer>

            {/* FLOATING WHATSAPP */}
            <a
                href={WA_SUPPORT}
                onClick={() => {
                    trackCTA(
                        'floating_whatsapp',
                        'Chat with us on WhatsApp',
                        WA_SUPPORT,
                    );
                    trackConversion('wa_inquiry', {
                        location: 'floating_whatsapp',
                    });
                }}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                className="fixed right-4 bottom-4 z-50 flex size-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_15px_-3px_rgba(37,211,102,.3)] transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:text-white md:right-6 md:bottom-6"
            >
                <svg
                    viewBox="0 0 24 24"
                    width="28"
                    height="28"
                    className="fill-current"
                >
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
            </a>

            {/* LIGHTBOX */}
            {lightbox !== null && (
                <div
                    onClick={() => setLightbox(null)}
                    className="fixed inset-0 z-[100] flex cursor-zoom-out items-center justify-center bg-[rgba(15,13,26,.85)] p-4 backdrop-blur-[6px] md:p-12"
                    role="dialog"
                    aria-modal="true"
                >
                    <img
                        src={PROOFS[lightbox].src}
                        alt={PROOFS[lightbox].label}
                        onClick={(e) => e.stopPropagation()}
                        className="max-h-full max-w-full cursor-default rounded-2xl object-contain shadow-[0_25px_50px_-12px_rgba(0,0,0,.5)]"
                    />
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            lbPrev();
                        }}
                        aria-label="Gambar sebelumnya"
                        className="absolute top-1/2 left-4 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0f172a] hover:bg-white md:left-6"
                    >
                        <Chevron dir="left" />
                    </button>
                    <button
                        type="button"
                        onClick={(e) => {
                            e.stopPropagation();
                            lbNext();
                        }}
                        aria-label="Gambar berikutnya"
                        className="absolute top-1/2 right-4 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/90 text-[#0f172a] hover:bg-white md:right-6"
                    >
                        <Chevron dir="right" />
                    </button>
                    <button
                        type="button"
                        onClick={() => setLightbox(null)}
                        aria-label="Tutup"
                        className="absolute top-6 right-6 flex size-12 cursor-pointer items-center justify-center rounded-full bg-white text-[#0f172a]"
                    >
                        <CloseIcon className="size-5" />
                    </button>
                </div>
            )}
        </main>
    );
}
