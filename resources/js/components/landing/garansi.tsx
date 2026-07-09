import { ShieldCheck } from 'lucide-react';
import { Eyebrow } from '@/components/landing/eyebrow';
import { useSectionView } from '@/hooks/use-section-view';

export function Garansi() {
    const ref = useSectionView<HTMLElement>('garansi');

    return (
        <section
            ref={ref}
            className="border-b border-lp-border-soft bg-lp-bg-elevated"
        >
            <div className="mx-auto max-w-xl px-4 py-14 text-center sm:px-6 sm:py-20">
                <Eyebrow className="mx-auto">Komitmen Kami</Eyebrow>

                <div className="mt-7 rounded-[22px] border border-lp-border bg-lp-bg p-7 sm:p-10">
                    <div className="mx-auto flex h-13 w-13 items-center justify-center rounded-2xl bg-lp-primary-soft">
                        <ShieldCheck className="h-6 w-6 text-lp-primary-ink" />
                    </div>

                    <h2 className="mt-5 text-2xl font-extrabold tracking-tight text-lp-text sm:text-[28px]">
                        Bukan Garansi Uang Kembali. Ini Lebih dari Itu.
                    </h2>

                    <p className="mx-auto mt-4 max-w-[52ch] text-base text-lp-text-muted">
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
