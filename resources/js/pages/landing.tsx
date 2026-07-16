import { Head } from '@inertiajs/react';
import { useEffect } from 'react';
import { Benefit } from '@/components/landing/benefit';
import { Faq } from '@/components/landing/faq';
import { FloatingWhatsApp } from '@/components/landing/floating-whatsapp';
import { Footer } from '@/components/landing/footer';
import { Garansi } from '@/components/landing/garansi';
import { Hero } from '@/components/landing/hero';
import { Mentor } from '@/components/landing/mentor';
import { Module } from '@/components/landing/module';
import { Navbar } from '@/components/landing/navbar';
import { Pricing } from '@/components/landing/pricing';
import { Problem } from '@/components/landing/problem';
import { Proof } from '@/components/landing/proof';
import { SocialProofBar } from '@/components/landing/social-proof-bar';
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
            <Head title="2X Konversi Anda | Webinar The Silent Conversion Leak">
                <meta
                    name="description"
                    content="CTR bagus, CPC oke, tapi kenapa closing kamu masih flat? Webinar berbayar bersama Justin Wijaya, PBM Agency, membedah persis di mana funnel kamu bocor."
                />
            </Head>

            <div className="relative min-h-screen overflow-clip bg-lp-bg font-sans text-lp-text">
                {/* Global atmospheric layer */}
                <div className="pointer-events-none fixed inset-0 -z-10">
                    <div className="absolute top-[20%] -left-40 h-[500px] w-[500px] rounded-full bg-lp-primary/10 blur-[160px]" />
                    <div className="absolute top-[60%] -right-40 h-[500px] w-[500px] rounded-full bg-lp-primary-2/12 blur-[160px]" />
                </div>

                <Navbar />
                <main>
                    <Hero />
                    <SocialProofBar />
                    {/* <QuickProof /> */}
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
                {/* <FloatingWhatsApp /> */}
                <Footer />
            </div>
        </>
    );
}
