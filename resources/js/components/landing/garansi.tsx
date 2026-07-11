import { ShieldCheck } from 'lucide-react';
import { useSectionView } from '@/hooks/use-section-view';

export function Garansi() {
    const ref = useSectionView<HTMLElement>('garansi');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg pb-16 sm:pb-24"
        >
            {/* Ambient glow — sama dengan pricing */}
            <div className="pointer-events-none absolute inset-0">
                <div className="absolute top-1/3 left-1/2 h-[500px] w-[500px] -translate-x-1/2 rounded-full bg-lp-primary-2/25 blur-[150px]" />
                <div className="absolute inset-0 bg-lp-grid opacity-40" />
            </div>

            <div className="relative mx-auto max-w-lg px-4 sm:px-6">
                {/* Card garansi — layout horizontal seperti referensi */}
                <div className="lp-gradient-border-inner lp-gradient-border rounded-[24px] bg-lp-bg-elevated/80 p-6 backdrop-blur-sm sm:p-7">
                    <div className="flex gap-5">
                        {/* Icon kiri */}
                        <div className="shrink-0">
                            <div className="relative flex h-12 w-12 items-center justify-center">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-lp-primary to-lp-primary-2 opacity-25 blur-md" />
                                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-lp-primary/20 to-lp-primary-2/15 ring-1 ring-lp-primary/30">
                                    <ShieldCheck className="h-6 w-6 text-lp-primary-ink" />
                                </div>
                            </div>
                        </div>

                        {/* Konten kanan */}
                        <div className="min-w-0">
                            <h2 className="font-display text-lg font-extrabold tracking-tight text-lp-text">
                                Garansi Kepuasan
                            </h2>
                            <p className="mt-0.5 font-mono text-[11px] tracking-[0.12em] text-lp-primary-ink uppercase">
                                100% Uang Kembali
                            </p>
                            <p className="mt-3 text-[14px] leading-relaxed text-lp-text-muted">
                                Udah ikut full, tapi masih ngerasa webinar tidak
                                bermanfaat?{' '}
                                <span className="font-semibold text-lp-text">
                                    Saya refund 100% tanpa syarat ribet.
                                </span>{' '}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
