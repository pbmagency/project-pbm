import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Benefit } from '@/components/landing/benefit';
import { Faq } from '@/components/landing/faq';
import { Footer } from '@/components/landing/footer';
import { Garansi } from '@/components/landing/garansi';
import { Hero } from '@/components/landing/hero';
import { Mentor } from '@/components/landing/mentor';
import { Module } from '@/components/landing/module';
import { Navbar } from '@/components/landing/navbar';
import { Pricing } from '@/components/landing/pricing';
import { Problem } from '@/components/landing/problem';
import { Proof } from '@/components/landing/proof';
import { Solution } from '@/components/landing/solution';
import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';

export default function Landing() {
    const { trackVisit } = useAnalytics();
    useScrollTracking();
    useDwellTime();

    useEffect(() => {
        trackVisit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <>
            <Head title="The Silent Conversion Leak, Webinar oleh Justin Wijaya">
                <meta
                    name="description"
                    content="CTR bagus, CPC oke, tapi kenapa closing kamu masih flat? Webinar berbayar bersama Justin Wijaya, PBM Agency, membedah persis di mana funnel kamu bocor."
                />
            </Head>

            <div className="min-h-screen bg-lp-bg font-sans">
                <Navbar />
                <main>
                    <Hero />
                    <Problem />
                    <Solution />
                    <Benefit />
                    <Proof />
                    <Mentor />
                    <Pricing />
                    <Garansi />
                    <Module />
                    <Faq />
                </main>
                <Footer />
            </div>
        </>
    );
}
