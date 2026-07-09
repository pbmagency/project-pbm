import {
    BookOpen,
    MessageCircleQuestion,
    PlayCircle,
    Search,
} from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';
import { cn } from '@/lib/utils';

const BENEFITS = [
    {
        icon: PlayCircle,
        title: 'Live Session & Rekaman Webinar',
        description:
            'Ikut sesi The Silent Conversion Leak secara langsung, lengkap dengan rekamannya buat ditonton ulang.',
        amber: false,
    },
    {
        icon: BookOpen,
        title: 'Ebook Iklan Sudah Jalan, Tapi Kok Tetap Boncos?',
        description:
            'Materi pelengkap yang otomatis terkirim ke email kamu begitu pembayaran selesai.',
        amber: false,
    },
    {
        icon: MessageCircleQuestion,
        title: 'Kesempatan Tanya Jawab Langsung',
        description:
            'Ajukan kondisi funnel kamu sendiri, dan tanya langsung ke Justin Wijaya di sesi live.',
        amber: false,
    },
    {
        icon: Search,
        title: 'Personal Funnel Audit Gratis',
        description:
            'Setelah webinar, kamu berkesempatan booking sesi audit personal atas funnel kamu sendiri.',
        amber: true,
    },
];

export function Benefit() {
    const ref = useSectionView<HTMLElement>('benefit');

    return (
        <section
            ref={ref}
            className="border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <Eyebrow className="mx-auto">Yang Kamu Dapatkan</Eyebrow>

                    <h2 className="mt-5 text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl">
                        Yang Kamu Bawa Pulang dari Sesi Ini
                    </h2>
                    <p className="mx-auto mt-4 max-w-[56ch] text-[16.5px] text-lp-text-muted">
                        Satu sesi live 90 menit yang fokus bahas kenapa konversi
                        kamu masih boncos padahal iklan udah bagus, plus tiga
                        hal lain yang menyertainya.
                    </p>
                </div>

                <div className="mt-11 grid gap-5 sm:grid-cols-2">
                    {BENEFITS.map((benefit) => (
                        <div
                            key={benefit.title}
                            className={cn(
                                'rounded-[20px] border p-7 transition-all hover:-translate-y-1',
                                benefit.amber
                                    ? 'border-lp-amber bg-lp-amber-soft'
                                    : 'border-lp-border bg-lp-bg hover:border-lp-primary',
                            )}
                        >
                            <div
                                className={cn(
                                    'flex h-11 w-11 items-center justify-center rounded-xl',
                                    benefit.amber
                                        ? 'bg-lp-amber/25'
                                        : 'bg-lp-primary-soft',
                                )}
                            >
                                <benefit.icon
                                    className={cn(
                                        'h-5 w-5',
                                        benefit.amber
                                            ? 'text-lp-amber-ink'
                                            : 'text-lp-primary-ink',
                                    )}
                                />
                            </div>
                            <h3 className="mt-4.5 text-[17px] font-bold text-lp-text">
                                {benefit.title}
                            </h3>
                            <p className="mt-2 text-sm text-lp-text-muted">
                                {benefit.description}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-11 flex justify-center">
                    <CtaButton location="benefit_bottom">
                        Amankan Kursi Kamu
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}
