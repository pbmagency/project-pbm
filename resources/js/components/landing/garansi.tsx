import { ShieldCheck } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Garansi() {
    const ref = useSectionView<HTMLElement>('garansi');

    return (
        <section
            ref={ref}
            className="relative overflow-hidden border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="pointer-events-none absolute top-1/2 left-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-lp-primary/15 blur-[120px]" />

            <div className="relative mx-auto max-w-xl px-4 py-14 text-center sm:px-6 sm:py-20">
                <Eyebrow className="mx-auto">Komitmen Kami</Eyebrow>

                <div className="lp-gradient-border lp-gradient-border-inner mt-8 rounded-[24px] bg-lp-bg/70 p-7 backdrop-blur-sm sm:p-10">
                    <div className="relative mx-auto flex h-16 w-16 items-center justify-center">
                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-lp-primary to-lp-primary-2 opacity-40 blur-lg" />
                        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-lp-primary/30 to-lp-primary-2/20 ring-1 ring-lp-primary/40">
                            <ShieldCheck className="h-7 w-7 text-lp-primary-ink" />
                        </div>
                    </div>

                    <h2 className="mt-6 text-2xl font-extrabold tracking-tight text-lp-text sm:text-[30px]">
                        Bukan Garansi Uang Kembali.{' '}
                        <span className="bg-gradient-to-r from-lp-primary to-lp-primary-2 bg-clip-text text-transparent">
                            Ini Lebih dari Itu.
                        </span>
                    </h2>

                    <p className="mx-auto mt-5 max-w-[52ch] text-base text-lp-text-muted">
                        Kalau kamu ikut penuh sesi live ini dan ngerasa belum
                        dapat kejelasan yang dijanjikan, kamu berhak dapat sesi
                        tambahan atau kelas pengganti. Kami percaya diri sama
                        isi webinar ini, dan itu yang bikin kami berani kasih
                        komitmen ini.
                    </p>
                </div>
            </div>
        </section>
    );
}
