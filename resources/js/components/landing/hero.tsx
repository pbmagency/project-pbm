import { PlayCircle, Shield, Sparkles, TrendingUp, Users } from 'lucide-react';
import { CtaButton } from '@/components/landing/cta-button';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

const CHART_BARS = [38, 52, 44, 68, 58, 82, 72, 96, 88, 108];

export function Hero() {
    const ref = useSectionView<HTMLElement>('hero');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-lp-border-soft"
        >
            {/* Atmospheric backdrop */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                <div className="absolute inset-0 bg-lp-grid opacity-70" />
                <div className="absolute -top-40 left-1/4 h-[520px] w-[520px] animate-lp-aurora rounded-full bg-lp-primary/25 blur-[140px]" />
                <div className="absolute top-1/3 -right-32 h-[440px] w-[440px] animate-lp-aurora-alt rounded-full bg-lp-primary-2/35 blur-[140px]" />
                <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-lp-bg" />
            </div>

            <div className="relative mx-auto flex max-w-6xl flex-wrap items-center gap-10 px-4 py-14 sm:px-6 sm:py-20 lg:gap-16 lg:py-32">
                <div className="min-w-0 flex-1 basis-[460px]">
                    <Eyebrow>2X Your Conversion Webinar</Eyebrow>

                    <h1 className="mt-6 font-display text-[42px] leading-[1.04] font-extrabold tracking-[-0.02em] text-lp-text sm:text-6xl">
                        Belajar Strategi Tingkatkan Closing{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-ink bg-clip-text text-transparent">
                            Landing Page
                        </span>
                        <br />
                        Hingga{' '}
                        <span className="relative inline-block">
                            <span className="bg-gradient-to-r from-lp-primary via-lp-primary-ink to-lp-primary-2 bg-clip-text text-transparent">
                                2X Lipat
                            </span>
                            <span className="absolute -bottom-2 left-0 h-[3px] w-full rounded-full bg-gradient-to-r from-lp-primary to-lp-primary-2 opacity-70" />
                        </span>
                    </h1>

                    <p className="mt-7 max-w-[46ch] text-lg font-light sm:text-xl">
                        Iklan udah bagus, tapi kenapa closing masih seret?
                        Kenali blind spot pada landing page yang membuat audiens
                        kabur sebelum checkout
                    </p>

                    <div className="mt-10 flex flex-col items-start gap-5">
                        <div className="relative">
                            <span className="pointer-events-none absolute -inset-1 rounded-2xl bg-gradient-to-r from-lp-primary to-lp-primary-2 opacity-40 blur-lg" />
                            <CtaButton
                                location="hero_primary"
                                isPricingCta={false}
                                className="relative w-full overflow-hidden text-lg shadow-[0_20px_50px_-12px_oklch(0.62_0.20_224/0.7)] sm:w-auto"
                            >
                                <span className="relative z-10">
                                    Amankan Seat Sekarang
                                </span>
                                <span className="pointer-events-none absolute -inset-x-1 inset-y-0 z-0 flex">
                                    <span className="h-full w-1/3 animate-lp-shimmer bg-gradient-to-r from-transparent via-white/25 to-transparent" />
                                </span>
                            </CtaButton>
                        </div>

                        {/* Social Proof Bar under CTA */}
                        <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-lp-text-dim sm:gap-x-4">
                            <div className="flex items-center gap-1.5">
                                <div className="flex items-center gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <svg
                                            key={i}
                                            className="h-4 w-4 text-lp-amber"
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                            aria-hidden="true"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    ))}
                                </div>
                                <span>
                                    <span className="font-normal text-lp-text">
                                        4.9 / 5 Rating
                                    </span>
                                </span>
                            </div>

                            <span
                                className="hidden h-3 w-px bg-lp-border-soft sm:block"
                                aria-hidden="true"
                            />

                            <div className="flex items-center gap-1.5">
                                <Users className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="font-normal text-lp-text">
                                    100+ Bisnis
                                </span>
                            </div>

                            <span
                                className="hidden h-3 w-px bg-lp-border-soft sm:block"
                                aria-hidden="true"
                            />

                            <div className="flex items-center gap-1.5">
                                <Shield className="h-4 w-4 shrink-0 text-lp-primary-ink" />
                                <span className="font-normal text-lp-text">
                                    Garansi 100%
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Mock analytics preview, hidden on mobile to keep the fold focused on the CTA */}
                <div className="relative hidden w-full max-w-[440px] flex-1 basis-[380px] md:block">
                    <div className="lp-gradient-border-inner lp-gradient-border relative rounded-[24px] bg-gradient-to-br from-lp-bg-elevated to-lp-bg-elevated-2 p-4 lp-glow">
                        <div className="mb-3.5 flex items-center justify-between px-1">
                            <div className="flex gap-1.5">
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-primary shadow-[0_0_8px_oklch(0.68_0.19_232/0.8)]" />
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-amber" />
                                <span className="h-2.5 w-2.5 rounded-full bg-lp-border" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-lp-pulse-ring rounded-full bg-lp-primary" />
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-lp-primary-ink" />
                                </span>
                                <span className="font-mono text-[10.5px] tracking-[0.18em] text-lp-text-dim">
                                    LIVE WEBINAR
                                </span>
                            </div>
                        </div>

                        <div className="relative aspect-4/3 overflow-hidden rounded-2xl bg-gradient-to-br from-lp-bg-elevated-2 to-lp-bg p-5">
                            <div className="pointer-events-none absolute inset-0 bg-lp-dots opacity-40" />

                            <div className="relative flex items-center justify-between">
                                <div>
                                    <div className="font-mono text-[9.5px] tracking-wider text-lp-text-dim uppercase">
                                        Conversion Rate
                                    </div>
                                    <div className="mt-1 flex items-baseline gap-2">
                                        <span className="font-display text-2xl font-extrabold text-lp-text">
                                            2,6%
                                        </span>
                                        <span className="rounded-md bg-lp-primary/20 px-1.5 py-0.5 font-mono text-[10px] font-semibold text-lp-primary-ink">
                                            +75%
                                        </span>
                                    </div>
                                </div>
                                <div className="rounded-lg border border-lp-border-soft bg-lp-bg/60 px-2.5 py-1 font-mono text-[9.5px] tracking-wide text-lp-text-dim">
                                    30D
                                </div>
                            </div>

                            <div className="relative mt-5 flex h-[92px] items-end gap-1.5">
                                {CHART_BARS.map((h, i) => (
                                    <div
                                        key={i}
                                        className="flex-1 animate-lp-bar rounded-[3px] bg-gradient-to-t from-lp-primary/40 via-lp-primary to-lp-primary-ink"
                                        style={{
                                            height: `${h}%`,
                                            animationDelay: `${i * 60}ms`,
                                        }}
                                    />
                                ))}
                            </div>

                            <div className="absolute inset-x-5 bottom-5 flex justify-between font-mono text-[8.5px] tracking-wider text-lp-text-dim uppercase">
                                <span>Wk 1</span>
                                <span>Wk 4</span>
                            </div>

                            <div className="absolute top-1/2 right-6 flex h-9 w-9 -translate-y-3 items-center justify-center rounded-full bg-lp-bg/80 ring-1 ring-white/10 backdrop-blur-sm">
                                <PlayCircle
                                    className="h-6 w-6 text-lp-primary-ink"
                                    strokeWidth={1.5}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="absolute bottom-11 -left-3 flex animate-lp-float items-center gap-2 rounded-xl border border-lp-border bg-lp-bg-elevated-2/90 px-3.5 py-2.5 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md">
                        <span className="relative flex h-2 w-2">
                            <span className="absolute inline-flex h-full w-full animate-lp-pulse-ring rounded-full bg-lp-primary-ink" />
                            <span className="relative inline-flex h-2 w-2 rounded-full bg-lp-primary-ink" />
                        </span>
                        <span className="text-xs font-semibold whitespace-nowrap text-lp-text">
                            90 Menit Live
                        </span>
                    </div>
                    <div className="absolute top-9 -right-2.5 flex animate-lp-float-alt items-center gap-2 rounded-xl border border-lp-border bg-lp-bg-elevated-2/90 px-3.5 py-2.5 shadow-[0_14px_28px_-10px_rgba(0,0,0,0.6)] backdrop-blur-md">
                        <span className="text-xs font-semibold whitespace-nowrap text-lp-text">
                            Ebook Otomatis
                        </span>
                    </div>
                    <div className="absolute -right-2 -bottom-4 rounded-xl border border-lp-amber bg-lp-amber-soft px-4 py-2.5 lp-glow-amber">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] tracking-wide text-lp-amber-ink uppercase">
                            <Sparkles className="h-3 w-3" />
                            Bonus
                        </div>
                        <div className="mt-0.5 text-xs font-bold whitespace-nowrap text-lp-text">
                            Audit Personal Gratis
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
