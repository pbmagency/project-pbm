import { Instagram, User, Zap } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Mentor() {
    const ref = useSectionView<HTMLElement>('mentor');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute top-1/2 left-0 h-96 w-96 -translate-y-1/2 rounded-full bg-lp-amber/12 blur-[130px]" />

            <div className="relative mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:py-28">
                <Eyebrow className="mx-auto flex w-fit sm:mx-0">
                    Tentang Pembicara
                </Eyebrow>

                <div className="mt-8 flex flex-col items-center gap-8 sm:flex-row sm:items-start sm:gap-12">
                    {/* Photo */}
                    <div className="relative w-52 shrink-0 sm:w-56">
                        <div className="relative overflow-hidden rounded-[26px] bg-gradient-to-br from-lp-amber/50 to-lp-primary-2/30 p-[2px]">
                            <img
                                src="/images/mentor/justin.webp"
                                alt="Justin Wijaya — Mentor"
                                className="aspect-[3/4] w-full rounded-[24px] object-cover object-top"
                                loading="lazy"
                            />
                        </div>

                        {/* Instagram handle overlay */}
                        <a
                            href="https://instagram.com/justinwijaya._"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="absolute bottom-3 left-1/2 flex -translate-x-1/2 items-center gap-1.5 rounded-full border border-lp-border bg-lp-bg-elevated-2/90 px-3 py-1.5 whitespace-nowrap backdrop-blur-md transition-opacity hover:opacity-80"
                        >
                            <Instagram className="h-3.5 w-3.5 shrink-0 text-lp-primary-ink" />
                            <span className="text-[12px] font-semibold text-lp-text">
                                @justinwijaya._
                            </span>
                        </a>
                    </div>

                    {/* Content */}
                    <div className="flex flex-1 flex-col items-center text-center sm:items-start sm:text-left">
                        <h2 className="font-display text-4xl font-extrabold tracking-tight text-lp-text sm:text-5xl">
                            Justin Wijaya
                        </h2>

                        {/* Credential tags */}
                        <div className="mt-3 flex flex-wrap justify-center gap-1 sm:justify-start">
                            <div className="flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-bg/60 px-3 py-1.5 backdrop-blur-sm">
                                <User className="h-3.5 w-3.5 shrink-0 text-lp-primary-ink" />
                                <span className="text-[12.5px] font-semibold text-lp-text">
                                    19 y.o Entrepreneur
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-bg/60 px-3 py-1.5 backdrop-blur-sm">
                                <Zap className="h-3.5 w-3.5 shrink-0 text-lp-primary-ink" />
                                <span className="text-[12.5px] font-semibold text-lp-text">
                                    5 Year Experience
                                </span>
                            </div>
                            <div className="flex items-center gap-1.5 rounded-full border border-lp-border bg-lp-bg/60 px-3 py-1.5 backdrop-blur-sm">
                                <Instagram className="h-3.5 w-3.5 shrink-0 text-lp-primary-ink" />
                                <span className="text-[12.5px] font-semibold text-lp-text">
                                    20K+ Followers
                                </span>
                            </div>
                        </div>

                        <p className="mt-4 max-w-[52ch] text-[15.5px] text-lp-text-muted">
                            5 tahun terakhir saya udah jalanin digital business
                            dan freelance bikin website. Dari situ saya sadar,
                            bikin website yang bagus diliat sama bikin website
                            yang jualan itu dua hal yang beda jauh.
                        </p>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] text-lp-text-muted">
                            Makanya sekarang saya fokus ke conversion rate
                            optimization, yaitu gimana cara bikin website yang
                            beneran menjual, dan dari situ konversi klien saya
                            rata rata naik 1,5 sampai 2 kali lipat.
                        </p>
                        <p className="mt-3 max-w-[52ch] text-[15.5px] text-lp-text-muted">
                            Framework keberhasilan & pengalaman ini yang bakal
                            saya sharing lewat sesi webinar ini.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}
