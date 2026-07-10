import { ChevronDown, MessageCircle } from 'lucide-react';
import { useState } from 'react';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { useSectionView } from '@/hooks/use-section-view';
import { cn } from '@/lib/utils';

const FAQS = [
    {
        question:
            'Iklan saya udah jalan bagus, CTR tinggi, CPC rendah, ini relevan buat saya?',
        answer: 'Justru itu targetnya. Webinar ini dibuat khusus untuk lo yang iklannya sudah jalan dengan baik, tapi closingnya masih tertahan. Kalau lo ngerasa masalahnya ada di iklan itu sendiri, ini mungkin bukan tempat yang tepat dulu.',
    },
    {
        question: 'Traffic saya udah ramai, kenapa closing masih rendah?',
        answer: 'Karena ramai dan closing itu dua hal berbeda. Traffic ramai cuma menunjukkan iklan lo berhasil menarik perhatian. Yang menentukan closing ada di lapisan lapisan setelahnya, dari halaman sampai penawaran, yang kita bedah tuntas di webinar ini.',
    },
    {
        question: 'Apa saja yang saya dapat kalau daftar?',
        answer: 'Akses penuh webinar live bareng Justin Wijaya, bonus ebook yang otomatis dikirim setelah daftar, dan kesempatan audit personal gratis setelah webinar selesai.',
    },
    {
        question: 'Webinarnya kapan, dan platformnya apa?',
        answer: 'Jadwal lengkap dan link platform dikirim lewat email setelah lo daftar. Pastikan email yang lo masukkan aktif.',
    },
    {
        question: 'Audit personal setelah webinar itu ngapain aja?',
        answer: 'Funnel lo ditinjau langsung, dicari titik titik yang berpotensi bocor. Ini juga jadi kesempatan buat kami mengenal bisnis lo lebih jauh, kalau ke depannya lo butuh bantuan lebih lanjut.',
    },
    {
        question:
            'Saya baru mulai jalanin iklan dan belum yakin iklannya sendiri bagus, cocok gak?',
        answer: 'Belum tentu. Webinar ini fokus untuk lo yang iklannya sudah menunjukkan hasil baik, CTR dan CPC sehat, tapi closingnya belum ikut naik. Kalau iklan lo sendiri yang masih dicari formulanya, ini bukan prioritas pertama lo.',
    },
];

export function Faq() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);
    const ref = useSectionView<HTMLElement>('faq');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute inset-0 bg-lp-grid opacity-30" />

            <div className="relative mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto">Sebelum Lo Daftar</Eyebrow>
                    <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                        Pertanyaan yang{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Sering Muncul
                        </span>
                    </h2>
                </div>

                <div className="mt-10 flex flex-col gap-2.5">
                    {FAQS.map((faq, index) => {
                        const isOpen = openIndex === index;

                        return (
                            <Collapsible
                                key={faq.question}
                                open={isOpen}
                                onOpenChange={() =>
                                    setOpenIndex(isOpen ? null : index)
                                }
                            >
                                <div
                                    className={cn(
                                        'lp-gradient-border-inner lp-gradient-border overflow-hidden rounded-2xl bg-lp-bg/70 backdrop-blur-sm transition-all',
                                        isOpen && 'lp-glow',
                                    )}
                                >
                                    <CollapsibleTrigger className="flex w-full items-center justify-between gap-4 px-5.5 py-4.5 text-left">
                                        <span className="text-[15.5px] font-semibold text-lp-text">
                                            {faq.question}
                                        </span>
                                        <span
                                            className={cn(
                                                'flex h-7 w-7 shrink-0 items-center justify-center rounded-full transition-all',
                                                isOpen
                                                    ? 'bg-gradient-to-br from-lp-primary to-lp-primary-2'
                                                    : 'bg-lp-bg-elevated-2',
                                            )}
                                        >
                                            <ChevronDown
                                                className={cn(
                                                    'h-4 w-4 shrink-0 transition-transform',
                                                    isOpen
                                                        ? 'rotate-180 text-white'
                                                        : 'text-lp-primary-ink',
                                                )}
                                                strokeWidth={2.5}
                                            />
                                        </span>
                                    </CollapsibleTrigger>
                                    <CollapsibleContent className="px-5.5 pb-5 text-[15px] text-lp-text-muted">
                                        {faq.answer}
                                    </CollapsibleContent>
                                </div>
                            </Collapsible>
                        );
                    })}
                </div>

                <div className="mt-11 flex flex-col items-center gap-4">
                    <CtaButton location="faq_primary" showTrustBadges>
                        Amankan Seat Sekarang
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}
