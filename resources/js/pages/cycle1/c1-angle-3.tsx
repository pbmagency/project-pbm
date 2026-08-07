import { Head } from '@inertiajs/react';
import { useEffect, Suspense, lazy } from 'react';
import { Navbar } from '@/components/landing/navbar';
import { Hero } from '@/components/landing/hero';
import { SocialProofBar } from '@/components/landing/social-proof-bar';
import { useAnalytics } from '@/hooks/use-analytics';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';

// Lazy load everything below the fold!
const Problem = lazy(() => import('@/components/landing/cycle1/problem-2').then(m => ({ default: m.Problem })));
const Solution = lazy(() => import('@/components/landing/cycle1/solution-2').then(m => ({ default: m.Solution })));
const Benefit = lazy(() => import('@/components/landing/benefit').then(m => ({ default: m.Benefit })));
const Proof = lazy(() => import('@/components/landing/proof').then(m => ({ default: m.Proof })));
const Mentor = lazy(() => import('@/components/landing/mentor').then(m => ({ default: m.Mentor })));
const Curriculum = lazy(() => import('@/components/landing/curriculum').then(m => ({ default: m.Curriculum })));
const Pricing = lazy(() => import('@/components/landing/pricing').then(m => ({ default: m.Pricing })));
const Garansi = lazy(() => import('@/components/landing/garansi').then(m => ({ default: m.Garansi })));
const Faq = lazy(() => import('@/components/landing/cycle1/faq-2').then(m => ({ default: m.Faq })));
const Footer = lazy(() => import('@/components/landing/footer').then(m => ({ default: m.Footer })));
const FloatingWhatsApp = lazy(() => import('@/components/landing/floating-whatsapp').then(m => ({ default: m.FloatingWhatsApp })));

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
                    
                    <Suspense fallback={<div className="min-h-[200px]" />}>
                        <Problem />
                        <Solution />
                        <Benefit />
                        <Proof />
                        <Mentor />
                        <Curriculum />
                        <Pricing />
                        <Garansi />
                        <Faq />
                    </Suspense>
                </main>

                <Suspense fallback={<div className="min-h-[100px]" />}>
                    <Footer />
                </Suspense>
            </div>
        </>
    );
}