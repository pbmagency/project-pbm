import {
    BookOpen,
    MessageCircleQuestion,
    PlayCircle,
    Search,
} from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { cn } from '@/lib/utils';

interface Benefit {
    icon: React.ElementType;
    title: string;
    points: string[];
    amber?: boolean;
    image: string;
}

const BENEFITS: Benefit[] = [
    {
        icon: PlayCircle,
        title: 'Live Session & Rekaman Webinar',
        points: [
            'Sesi webinar live via zoom yang bahas strategi meningkatkan konversi landing page',
            'Rekaman webinar yang bisa kamu tonton ulang kapan aja.',
        ],
        amber: false,
        image: '/images/benefits/live-session.webp',
    },
    {
        icon: BookOpen,
        title: 'Ebook: Iklan Jalan, Tapi Kok Boncos?',
        points: [
            'Materi pelengkap: praktek memperbaiki konversi secara praktis',
        ],
        amber: false,
        image: '/images/benefits/ebook.webp',
    },
    {
        icon: MessageCircleQuestion,
        title: 'Akses Tanya Jawab Langsung',
        points: [
            'Ajukan kondisi funnel kamu sendiri langsung ke mentor.',
            'Sesi tanya jawab interaktif di akhir webinar.',
        ],
        amber: false,
        image: '/images/benefits/qna-session.webp',
    },
    {
        icon: Search,
        title: 'Kesempatan Landing Page Audit Gratis',
        points: [
            'Setelah webinar, kamu bisa booking sesi audit personal ke landing page bisnis kamu.',
            'Dapatkan rekomendasi spesifik untuk kasus di bisnis kamu, bukan lagi saran umum.',
        ],
        amber: true,
        image: '/images/benefits/audit-report.webp',
    },
];

export function Benefit() {
    return (
        <section
            id="benefit"
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute inset-0 bg-lp-grid opacity-40" />

            <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <div className="text-center">
                    <h2 className="mt-5 font-display text-3xl font-extrabold tracking-tight text-lp-text sm:text-4xl lg:text-5xl">
                        Apa Saja Yang Kamu{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Dapatkan
                        </span>
                    </h2>
                </div>

                <div className="mt-12 grid gap-6 sm:grid-cols-2">
                    {BENEFITS.map((benefit) => (
                        <div
                            key={benefit.title}
                            className={cn(
                                'group lp-gradient-border-inner lp-gradient-border relative overflow-hidden rounded-[20px] p-6 backdrop-blur-sm transition-all hover:-translate-y-1',
                                benefit.amber
                                    ? 'bg-gradient-to-br from-lp-amber-soft/80 to-lp-amber-soft/40 hover:lp-glow-amber'
                                    : 'bg-lp-bg/50 hover:lp-glow',
                            )}
                        >
                            {/* The Image */}
                            <img
                                src={benefit.image}
                                alt={benefit.title}
                                className={cn(
                                    'mb-6 aspect-[16/9] w-full rounded-xl object-cover ring-1',
                                    benefit.amber
                                        ? 'ring-lp-amber/30'
                                        : 'ring-white/10',
                                )}
                            />

                            {/* Icon + Title — 1 row */}
                            <div className="flex items-start gap-3 sm:items-center">
                                <div
                                    className={cn(
                                        'flex h-10 w-10 shrink-0 items-center justify-center rounded-xl',
                                        benefit.amber
                                            ? 'bg-gradient-to-br from-lp-amber/40 to-lp-amber/10 shadow-[0_8px_20px_-4px_oklch(0.8_0.16_78/0.5)]'
                                            : 'bg-gradient-to-br from-lp-primary/25 to-lp-primary-2/15 shadow-[0_8px_20px_-4px_oklch(0.62_0.20_224/0.5)]',
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
                                <h3 className="font-display text-[16px] font-bold leading-snug text-lp-text">
                                    {benefit.title}
                                </h3>
                            </div>

                            {/* Points */}
                            {benefit.points.length > 0 && (
                                <ul className="mt-6 flex flex-col gap-4">
                                    {benefit.points.map((point) => (
                                        <li
                                            key={point}
                                            className="flex items-start gap-2 text-sm font-medium leading-snug text-lp-text-muted"
                                        >
                                            <span
                                                className={cn(
                                                    'mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full',
                                                    benefit.amber
                                                        ? 'bg-lp-amber-ink'
                                                        : 'bg-lp-primary-ink',
                                                )}
                                            />
                                            {point}
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>

                <div className="mt-12 flex justify-center">
                    <CtaButton location="benefit_bottom" showTrustBadges>
                        Amankan Seat Saya
                    </CtaButton>
                </div>
            </div>
        </section>
    );
}