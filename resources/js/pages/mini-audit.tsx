import AuthoritySection from '@/components/mini-audit/AuthoritySection';
import BleedingNeckSection from '@/components/mini-audit/BleedingNeckSection';
import FooterSection from '@/components/mini-audit/FooterSection';
import MechanismSection from '@/components/mini-audit/MechanismSection';
import MiniAuditFAQ from '@/components/mini-audit/MiniAuditFAQ';
import StepIdentity from '@/components/mini-audit/StepIdentity';
import StepQualification from '@/components/mini-audit/StepQualification';
import StepWebsite from '@/components/mini-audit/StepWebsite';
import StepWhatsApp from '@/components/mini-audit/StepWhatsApp';
import TestimoniSection from '@/components/mini-audit/TestimoniSection';
import ThankYouState from '@/components/mini-audit/ThankYouState';
import { Button } from '@/components/ui/button';
import { Head, router } from '@inertiajs/react';
import { FloatingWhatsApp } from '@/components/landing/floating-whatsapp';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Clock, Send, Shield, Star } from 'lucide-react';
import { Suspense, useRef, useState } from 'react';

interface FormData {
    website: string;
    nama: string;
    email: string;
    countryCode: string;
    whatsapp: string;
    traffic: string;
    omzet: string;
    budget_iklan: string;
    tantangan: string;
    tantangan_lainnya: string;
}

const INITIAL_DATA: FormData = {
    website: '',
    nama: '',
    email: '',
    countryCode: '+62',
    whatsapp: '',
    traffic: '',
    omzet: '',
    budget_iklan: '',
    tantangan: '',
    tantangan_lainnya: '',
};

const TOTAL_STEPS = 4;

const stripProtocol = (value: string) => value.replace(/^https?:\/\//i, '');

const normalizeWebsiteUrl = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) return '';

    const withoutProtocol = stripProtocol(trimmed);
    return `https://${withoutProtocol}`;
};

export default function MiniAudit() {
    const [step, setStep] = useState(0);
    const [data, setData] = useState<FormData>(INITIAL_DATA);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isFinished, setIsFinished] = useState(false);
    const [direction, setDirection] = useState(1);
    const testimoniRef = useRef<HTMLDivElement>(null);

    const validateStep = (): boolean => {
        const newErrors: Record<string, string> = {};

        if (step === 0) {
            const website = normalizeWebsiteUrl(data.website);

            if (!website) {
                newErrors.website = 'Link website wajib diisi';
            } else {
                let isValidUrl = true;
                try {
                    const parsed = new URL(website);
                    isValidUrl =
                        parsed.protocol === 'http:' ||
                        parsed.protocol === 'https:';
                } catch {
                    isValidUrl = false;
                }
                if (!isValidUrl) {
                    newErrors.website =
                        'Masukkan URL lengkap (contoh: https://example.com)';
                }
            }
        }

        if (step === 1) {
            if (!data.nama.trim() || data.nama.trim().length < 2) {
                newErrors.nama = 'Nama minimal 2 karakter';
            }
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!data.email.trim() || !emailRegex.test(data.email)) {
                newErrors.email = 'Email tidak valid';
            }
        }

        if (step === 2) {
            const digits = data.whatsapp.replace(/\D/g, '');
            if (!digits || digits.length < 8) {
                newErrors.whatsapp = 'Nomor WhatsApp minimal 8 digit';
            }
        }

        if (step === 3) {
            if (!data.traffic) newErrors.traffic = 'Pilih salah satu opsi';
            if (!data.omzet) newErrors.omzet = 'Pilih salah satu opsi';
            if (!data.budget_iklan)
                newErrors.budget_iklan = 'Pilih salah satu opsi';
            if (!data.tantangan) newErrors.tantangan = 'Pilih salah satu opsi';
            if (
                data.tantangan === 'lainnya' &&
                !data.tantangan_lainnya.trim()
            ) {
                newErrors.tantangan_lainnya = 'Jelaskan tantangan Anda';
            }
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (!validateStep()) return;
        setDirection(1);
        setStep((s) => Math.min(s + 1, TOTAL_STEPS - 1));
    };

    const handleBack = () => {
        setDirection(-1);
        setStep((s) => Math.max(s - 1, 0));
    };

    const handleSubmit = () => {
        if (!validateStep()) return;
        setIsSubmitting(true);

        const payload = {
            website: normalizeWebsiteUrl(data.website),
            nama: data.nama,
            email: data.email,
            whatsapp: `${data.countryCode}${data.whatsapp}`,
            traffic: data.traffic,
            omzet: data.omzet,
            budget_iklan: data.budget_iklan,
            tantangan: data.tantangan,
            tantangan_lainnya:
                data.tantangan === 'lainnya' ? data.tantangan_lainnya : '',
        };

        router.post('/mini-audit', payload, {
            onSuccess: (page: any) => {
                const flash = page.props?.flash as
                    Record<string, unknown> | undefined;
                if (flash?.qualified) {
                    setIsFinished(true);
                }
            },
            onError: (serverErrors) => {
                const typedErrors = serverErrors as Record<string, string>;
                setErrors(typedErrors);

                let targetStep: number | null = null;
                if (typedErrors.website) targetStep = 0;
                else if (typedErrors.nama || typedErrors.email) targetStep = 1;
                else if (typedErrors.whatsapp) targetStep = 2;
                else if (
                    typedErrors.traffic ||
                    typedErrors.omzet ||
                    typedErrors.budget_iklan ||
                    typedErrors.tantangan ||
                    typedErrors.tantangan_lainnya
                )
                    targetStep = 3;

                if (targetStep !== null && targetStep !== step) {
                    setDirection(targetStep > step ? 1 : -1);
                    setStep(targetStep);
                }
            },
            onFinish: () => setIsSubmitting(false),
        });
    };

    const scrollToTestimoni = () => {
        testimoniRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const isLastStep = step === TOTAL_STEPS - 1;

    const variants = {
        enter: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
        center: { x: 0, opacity: 1 },
        exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
    };

    return (
        <>
            <Head title="Personal Landing Page Audit Gratis">
                <meta
                    name="description"
                    content="Dapatkan audit website gratis dari tim ahli kami. Hanya 5 slot per minggu."
                />
            </Head>

            <div className="mini-audit-page font-sans relative min-h-screen overflow-hidden bg-lp-bg text-lp-text">
                {/* Background effects */}
                <div className="bg-grid absolute inset-0 opacity-40" />
                <div className="absolute top-0 left-1/2 h-[400px] w-[600px] -translate-x-1/2 rounded-full bg-lp-primary/5 blur-[120px]" />

                <div className="relative z-10 flex flex-col items-center">
                    {/* Hero + Form Section */}
                    <div className="flex min-h-screen flex-col items-center justify-center px-4 py-20 md:py-24">
                        {/* Header */}
                        {!isFinished && (
                            <div className="mb-8 max-w-4xl text-center md:mb-12">
                                <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/5 px-4 py-1.5">
                                    <Star className="h-3.5 w-3.5 text-primary" />
                                    <span className="text-xs font-medium text-primary">
                                        4.9/5 Client Rating
                                    </span>
                                </div>
                                <h1 className="mb-3 text-2xl font-bold text-foreground sm:text-3xl md:mb-6 lg:text-5xl">
                                    Tingkatkan Omset Anda Hingga{' '}
                                    <span className="text-gradient">
                                        2X Lipat Dalam 48 Jam{' '}
                                    </span>
                                    Dengan Konsultasi Bedah Landing Page{' '}
                                    <span className="text-gradient">
                                        Gratis
                                    </span>
                                </h1>
                                <p className="text-sm text-foreground sm:text-base lg:text-lg">
                                    Stop bakar budget iklan! Masalahnya bukan di
                                    ads, tapi web Anda yang gagal jualan. Kami
                                    bedah SELURUH Landing Page Anda & tunjukkan
                                    apa yang salah untuk tingkatkan sales bisnis
                                    anda dengan CEPAT.
                                </p>
                            </div>
                        )}

                        {/* Form Card */}
                        <div className="w-full max-w-2xl">
                            <div className="glass rounded-2xl border border-border/50 p-6 shadow-2xl sm:p-8">
                                {isFinished ? (
                                    <ThankYouState />
                                ) : (
                                    <>
                                        <AnimatePresence
                                            mode="wait"
                                            custom={direction}
                                        >
                                            <motion.div
                                                key={step}
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                transition={{
                                                    duration: 0.25,
                                                    ease: 'easeInOut',
                                                }}
                                            >
                                                {step === 0 && (
                                                    <StepWebsite
                                                        value={stripProtocol(
                                                            data.website,
                                                        )}
                                                        onChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                website:
                                                                    normalizeWebsiteUrl(
                                                                        v,
                                                                    ),
                                                            })
                                                        }
                                                        error={errors.website}
                                                    />
                                                )}
                                                {step === 1 && (
                                                    <StepIdentity
                                                        nama={data.nama}
                                                        email={data.email}
                                                        onNamaChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                nama: v,
                                                            })
                                                        }
                                                        onEmailChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                email: v,
                                                            })
                                                        }
                                                        errors={{
                                                            nama: errors.nama,
                                                            email: errors.email,
                                                        }}
                                                    />
                                                )}
                                                {step === 2 && (
                                                    <StepWhatsApp
                                                        value={data.whatsapp}
                                                        countryCode={
                                                            data.countryCode
                                                        }
                                                        onChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                whatsapp: v,
                                                            })
                                                        }
                                                        onCountryCodeChange={(
                                                            v,
                                                        ) =>
                                                            setData({
                                                                ...data,
                                                                countryCode: v,
                                                            })
                                                        }
                                                        error={errors.whatsapp}
                                                    />
                                                )}
                                                {step === 3 && (
                                                    <StepQualification
                                                        traffic={data.traffic}
                                                        omzet={data.omzet}
                                                        budgetIklan={
                                                            data.budget_iklan
                                                        }
                                                        tantangan={
                                                            data.tantangan
                                                        }
                                                        tantanganLainnya={
                                                            data.tantangan_lainnya
                                                        }
                                                        onTrafficChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                traffic: v,
                                                            })
                                                        }
                                                        onOmzetChange={(v) =>
                                                            setData({
                                                                ...data,
                                                                omzet: v,
                                                            })
                                                        }
                                                        onBudgetIklanChange={(
                                                            v,
                                                        ) =>
                                                            setData({
                                                                ...data,
                                                                budget_iklan: v,
                                                            })
                                                        }
                                                        onTantanganChange={(
                                                            v,
                                                        ) =>
                                                            setData({
                                                                ...data,
                                                                tantangan: v,
                                                            })
                                                        }
                                                        onTantanganLainnyaChange={(
                                                            v,
                                                        ) =>
                                                            setData({
                                                                ...data,
                                                                tantangan_lainnya:
                                                                    v,
                                                            })
                                                        }
                                                        errors={errors}
                                                    />
                                                )}
                                            </motion.div>
                                        </AnimatePresence>

                                        {/* Buttons */}
                                        <div className="mt-8 flex items-center justify-between">
                                            {step > 0 ? (
                                                <Button
                                                    type="button"
                                                    variant="ghost"
                                                    onClick={handleBack}
                                                    className="text-muted-foreground"
                                                >
                                                    <ArrowLeft className="mr-1 h-4 w-4" />
                                                    Kembali
                                                </Button>
                                            ) : (
                                                <div />
                                            )}

                                            {isLastStep ? (
                                                <Button
                                                    type="button"
                                                    onClick={handleSubmit}
                                                    disabled={isSubmitting}
                                                    className="glow-sm bg-primary px-6 hover:bg-primary/90"
                                                >
                                                    {isSubmitting ? (
                                                        <span className="flex items-center gap-2">
                                                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-primary-foreground border-t-transparent" />
                                                            Mengirim...
                                                        </span>
                                                    ) : (
                                                        <>
                                                            Submit
                                                            <Send className="ml-1 h-4 w-4" />
                                                        </>
                                                    )}
                                                </Button>
                                            ) : (
                                                <Button
                                                    type="button"
                                                    onClick={handleNext}
                                                    className="glow-sm bg-primary px-6 hover:bg-primary/90"
                                                >
                                                    Lanjutkan
                                                    <ArrowRight className="ml-1 h-4 w-4" />
                                                </Button>
                                            )}
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                        {/* Scarcity Info */}
                        {!isFinished && (
                            <>
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="mt-6 flex max-w-2xl items-center justify-center gap-3 rounded-xl border border-primary/20 bg-primary/5 px-5 py-3"
                                >
                                    <Shield className="h-5 w-5 shrink-0 text-primary" />
                                    <p className="text-xs text-muted-foreground sm:text-sm">
                                        Hanya menerima{' '}
                                        <strong className="text-foreground">
                                            5 website per minggu
                                        </strong>{' '}
                                        untuk menjaga kualitas audit.
                                    </p>
                                    <Clock className="h-4 w-4 shrink-0 text-muted-foreground" />
                                </motion.div>

                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.4 }}
                                    className="mt-3 text-center"
                                >
                                    <button
                                        onClick={scrollToTestimoni}
                                        className="text-sm font-medium text-primary underline transition-colors hover:cursor-pointer hover:text-primary/80"
                                    >
                                        Lihat Testimoni
                                    </button>
                                </motion.div>
                            </>
                        )}
                    </div>

                    {!isFinished && (
                        <Suspense fallback={<div className="h-32" />}>
                            <BleedingNeckSection />
                            <MechanismSection />
                            <AuthoritySection />
                            <div ref={testimoniRef}>
                                <TestimoniSection />
                            </div>
                            <MiniAuditFAQ />
                            <FooterSection />
                        </Suspense>
                    )}
                </div>
            </div>

            <FloatingWhatsApp />
        </>
    );
}
