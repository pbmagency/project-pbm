import { Head } from '@inertiajs/react';
import { useEffect, useState } from 'react';
import { useAnalytics } from '@/hooks/use-analytics';
import { useScrollTracking } from '@/hooks/use-scroll-tracking';
import { useDwellTime } from '@/hooks/use-dwell-time';
import { useSectionTracking } from '@/hooks/use-section-tracking';

// UI
import { Button } from '@/components/ui/button';
import { CheckCircle2, Zap, TrendingDown, TrendingUp, BarChart3, Star, ArrowRight, ShieldCheck, Users, AlertCircle, Calendar, Clock, Search, Check, X } from 'lucide-react';

const WA_NUMBER = '6285931018333';
const WA_MESSAGE = encodeURIComponent('Halo, saya mau daftar Webinar The Silent Conversion Leak seharga Rp79.000. Bagaimana cara daftarnya?');
const WA_LINK = `https://wa.me/${WA_NUMBER}?text=${WA_MESSAGE}`;

export default function Welcome() {
    // 1. Core Tracking Hooks
    const { trackVisit, trackCTA, trackFormStart } = useAnalytics();
    
    // Register scroll and dwell time trackers globally
    useScrollTracking();
    useDwellTime();
    
    // Register section tracker for heatmap visualization
    useSectionTracking();

    useEffect(() => {
        trackVisit();
    }, [trackVisit]);

    // Sticky CTA bar visibility
    const [showStickyBar, setShowStickyBar] = useState(false);
    useEffect(() => {
        const handleScroll = () => {
            setShowStickyBar(window.scrollY > 80);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans selection:bg-indigo-100 selection:text-indigo-900" style={{ zoom: 0.75 }}>
            <Head title="The Silent Conversion Leak | Webinar by Justin Wijaya" />

            {/* ANNOUNCEMENT BAR (MARQUEE) */}
            <div className="bg-indigo-600 text-white py-2.5 overflow-hidden relative z-30 flex whitespace-nowrap">
                <div className="animate-marquee flex items-center w-max">
                    {[...Array(6)].map((_, i) => (
                        <div key={i} className="flex items-center gap-6 sm:gap-12 pl-6 sm:pl-12 shrink-0 text-sm font-medium">
                            <span className="flex items-center gap-2"><Calendar className="w-4 h-4 text-indigo-200" /> 6 September 2026</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60"></span>
                            <span className="flex items-center gap-2"><Clock className="w-4 h-4 text-indigo-200" /> 19:00 WIB - Selesai</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60"></span>
                            <span className="flex items-center gap-2 font-bold text-yellow-300">Live via Zoom</span>
                            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 opacity-60"></span>
                        </div>
                    ))}
                </div>
            </div>
            {/* NAVBAR (always visible, bg appears on scroll) */}
            <div className={`fixed left-0 right-0 z-50 py-6 px-4 sm:px-6 lg:px-8 transition-all duration-500 ease-in-out ${showStickyBar ? 'top-0 py-3' : 'top-10'}`}>
                <div className="mx-auto w-full max-w-7xl">
                    <div className={`flex items-center justify-between rounded-2xl transition-all duration-500 ease-in-out ${showStickyBar ? 'bg-white/90 backdrop-blur-xl shadow-[0_4px_30px_-8px_rgba(0,0,0,0.08)] border border-slate-200/50 px-5 sm:px-6 py-3' : 'border border-transparent'}`}>
                        <div className="flex items-center gap-3">
                            <img src="/assets/logo.webp" alt="PBM Logo" className="w-10 h-10 rounded-lg object-cover shadow-sm" loading="lazy" />
                            <span className="text-slate-900 font-extrabold text-2xl tracking-tight">PBM Agency</span>
                        </div>
                        <div>
                            <a href={WA_LINK} onClick={() => trackCTA('nav_cta', 'Daftar Sekarang', WA_LINK)} data-cta-zone="nav_cta" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                <Button className="h-auto bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg px-5 py-2 font-semibold shadow-md shadow-indigo-600/20 hidden sm:flex flex-col items-center justify-center cursor-pointer">
                                    <span>Amankan Seat</span>
                                </Button>
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* 1. HEADER & HERO SECTION */}
            <div className="relative bg-[#f8f6fc] overflow-clip selection:bg-indigo-100 selection:text-indigo-900 pb-32 sm:pb-40 lg:pb-48">
                
                {/* Subtle Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#6366f115_1px,transparent_1px),linear-gradient(to_bottom,#6366f115_1px,transparent_1px)] bg-[size:80px_80px] [mask-image:linear-gradient(to_bottom,white_40%,transparent_100%)] pointer-events-none"></div>

                {/* Abstract Background Blobs (Blueish/Purple) */}
                <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-indigo-300/30 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply"></div>
                <div className="absolute top-1/2 right-0 -translate-y-1/2 w-[700px] h-[700px] bg-indigo-300/30 rounded-full blur-[120px] opacity-60 pointer-events-none mix-blend-multiply"></div>
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-purple-200/40 rounded-full blur-[100px] pointer-events-none"></div>
                
                {/* Fun squiggles / decorative elements */}
                <div className="absolute top-40 left-10 lg:left-32 hidden md:block opacity-40 animate-pulse">
                    <svg width="60" height="60" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 50 Q 30 10, 50 50 T 90 50" stroke="#1e293b" strokeWidth="3" strokeLinecap="round" fill="none" />
                    </svg>
                </div>
                <div className="absolute bottom-64 right-1/4 hidden lg:block opacity-40">
                    <svg width="40" height="40" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M50 10 L60 40 L90 50 L60 60 L50 90 L40 60 L10 50 L40 40 Z" fill="none" stroke="#1e293b" strokeWidth="3" strokeLinejoin="round"/>
                    </svg>
                </div>
                
                {/* Spacer for fixed navbar */}
                <div className="h-20"></div>

                {/* Hero Content */}
                <section id="hero" className="relative z-10 pt-12 sm:pt-16 lg:pt-20">
                    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
                            
                            {/* Left Content (55%) */}
                            <div className="lg:col-span-6 xl:col-span-7 space-y-8 relative z-20">
                                <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-100 shadow-sm uppercase tracking-widest">
                                    UNTUK ANDA YANG IKLANNYA SUDAH JALAN TAPI BONCOS:
                                </div>
                                
                                <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl lg:text-[4rem] text-slate-900 leading-[1.1] mb-6">
                                    Iklan Udah Bagus, <br />
                                    <span className="text-indigo-600">Kok Closing <br />Tetap Seret?</span>
                                </h1>
                                
                                <p className="text-lg sm:text-xl leading-relaxed text-slate-600 max-w-xl font-medium">
                                  Hentikan 4 "kebocoran siluman" di landing page yang bikin CPA Anda mahal. Dalam Live 90 Menit, pelajari cara mendiagnosa data yang sukses membantu klien menaikkan omset dari Rp20 juta menjadi Rp30 juta per bulan.
                                </p>
                                
                                <div className="flex flex-col items-start gap-3 pt-2">
                                    <a href={WA_LINK} onClick={() => trackCTA('hero_cta', 'Amankan Seat Webinar', WA_LINK)} data-cta-zone="hero_cta" target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                                        <Button size="lg" className="h-14 px-8 text-base rounded-xl font-bold shadow-lg shadow-indigo-600/20 hover:shadow-xl hover:-translate-y-0.5 transition-all bg-indigo-600 hover:bg-indigo-700 text-white group cursor-pointer">
                                            Amankan Seat Webinar
                                            <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </Button>
                                    </a>
                                    <div className="flex items-center gap-2">
                                        <Zap className="w-4 h-4 fill-indigo-600 text-indigo-600" />
                                        <span className="text-indigo-600 text-sm font-bold">Kuota Sangat Terbatas</span>
                                    </div>
                                </div>

                                <div className="pt-8 flex items-center gap-4">
                                    <div className="flex -space-x-3">
                                        <div className="w-10 h-10 rounded-full border-2 border-[#f8f6fc] bg-slate-200 overflow-hidden shadow-sm">
                                            <img src="https://i.pravatar.cc/100?img=33" className="w-full h-full object-cover" alt="User" loading="lazy" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-2 border-[#f8f6fc] bg-slate-300 overflow-hidden shadow-sm">
                                            <img src="https://i.pravatar.cc/100?img=47" className="w-full h-full object-cover" alt="User" loading="lazy" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-2 border-[#f8f6fc] bg-slate-400 overflow-hidden shadow-sm">
                                            <img src="https://i.pravatar.cc/100?img=12" className="w-full h-full object-cover" alt="User" loading="lazy" />
                                        </div>
                                        <div className="w-10 h-10 rounded-full border-2 border-[#f8f6fc] bg-indigo-100 flex items-center justify-center shadow-sm text-indigo-600 font-bold text-xs">
                                            99+
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="flex text-yellow-400">
                                            {[...Array(5)].map((_, i) => <Star key={i} className="w-4 h-4" fill="currentColor" />)}
                                        </div>
                                        <p className="text-xs text-slate-500 font-medium mt-1 max-w-[200px] leading-tight">
                                            Bersama <strong className="text-slate-700">Justin Wijaya</strong> (CRO). Terbukti naikkan konversi 2x lipat.
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Right Visual (45%) */}
                            <div className="lg:col-span-6 xl:col-span-5 relative mt-12 lg:mt-0 z-10 flex items-center justify-center">
                                {/* The cutout image container */}
                                <div className="relative w-full lg:max-w-lg xl:max-w-xl xl:scale-110 flex justify-center">
                                    <div className="absolute inset-0 bg-indigo-500/10 rounded-[100px] rotate-12 scale-90 blur-2xl -z-10"></div>
                                    
                                    <img 
                                        src="/assets/justin.webp" 
                                        alt="Justin Wijaya" 
                                        loading="lazy"
                                        className="w-full max-w-[400px] lg:max-w-none object-contain relative z-10 drop-shadow-2xl"
                                        style={{ WebkitMaskImage: 'linear-gradient(to top, transparent 0%, black 8%)', maskImage: 'linear-gradient(to top, transparent 0%, black 8%)' }}
                                    />
                                    
                                    {/* Scattered Cards */}
                                    {/* Card 1 - Top Right */}
                                    <div className="absolute top-12 -right-4 sm:-right-10 lg:-right-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 w-44 sm:w-52 border border-white transform rotate-3 hover:rotate-0 hover:scale-105 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-full bg-[#f3eeff] flex items-center justify-center flex-shrink-0">
                                            <TrendingUp className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-extrabold text-xl sm:text-2xl leading-none mb-1">+50%</span>
                                            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Omset Naik</span>
                                        </div>
                                    </div>

                                    {/* Card 2 - Middle Left */}
                                    <div className="absolute top-1/2 -translate-y-4 -left-4 sm:-left-12 lg:-left-16 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 w-44 sm:w-52 border border-white transform -rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-full bg-[#f3eeff] flex items-center justify-center flex-shrink-0">
                                            <BarChart3 className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-extrabold text-xl sm:text-2xl leading-none mb-1">2x Lipat</span>
                                            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Konversi Naik</span>
                                        </div>
                                    </div>

                                    {/* Card 3 - Bottom Right */}
                                    <div className="absolute bottom-16 -right-2 sm:-right-8 lg:-right-10 z-20 bg-white/95 backdrop-blur-md rounded-2xl p-4 sm:p-5 shadow-xl shadow-slate-200/50 flex items-center gap-4 w-44 sm:w-52 border border-white transform rotate-2 hover:rotate-0 hover:scale-105 transition-all duration-300">
                                        <div className="w-10 h-10 rounded-full bg-[#f3eeff] flex items-center justify-center flex-shrink-0">
                                            <ShieldCheck className="w-5 h-5 text-indigo-600" />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-slate-900 font-extrabold text-xl sm:text-2xl leading-none mb-1">100%</span>
                                            <span className="text-[10px] sm:text-xs text-slate-500 font-bold uppercase tracking-wider">Metode Valid</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                
                {/* TRUST FLASH (SOCIAL PROOF) */}
                <div className="relative z-30 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 mt-6 sm:mt-8 lg:mt-12">
                    <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-[0_15px_60px_-15px_rgba(0,0,0,0.1)] border border-slate-100 text-center">
                        <p className="text-[13px] font-semibold text-slate-500 mb-6 sm:mb-8">
                            Telah dipercaya oleh berbagai bisnis dan brand di Indonesia
                        </p>
                        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20">
                            {/* Item 1 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">1,5x - 2x</span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest text-center">Kenaikan Konversi</span>
                            </div>
                            
                            {/* Item 2 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">ROAS 5</span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest text-center">Pencapaian Klien</span>
                            </div>
                            
                            {/* Item 3 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">20K+</span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest text-center">Followers IG Justin</span>
                            </div>
                            
                            {/* Item 4 */}
                            <div className="flex flex-col items-center justify-center">
                                <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">Rp 200 Juta++</span>
                                <span className="text-[11px] sm:text-xs font-bold text-slate-500 mt-1 uppercase tracking-widest text-center">Omset Skala Klien</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 2. PROBLEM SECTION */}
            <section id="problem" className="py-20 lg:py-28 bg-white">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="max-w-2xl">
                        <span className="inline-block text-xs font-bold text-indigo-600 uppercase tracking-[0.2em] mb-4">
                            Masalah Yang Sering Terjadi
                        </span>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-[2.75rem] lg:leading-tight text-slate-900">
                            Sudah Coba Segalanya, Tapi Closing Tetap Seret?
                        </h2>
                        <p className="mt-5 text-lg sm:text-xl text-slate-500 leading-relaxed">
                            Masalahnya bukan soal kurang kerja keras — tapi soal belum tahu titik bocornya ada di mana.
                        </p>
                    </div>
                    
                    {/* Problem Cards Grid */}
                    <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 gap-5 lg:gap-6">
                        {/* Card 1 */}
                        <div className="group flex items-start gap-5 bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <TrendingUp className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    Iklan berjalan bagus secara metrik, tapi CPA tetap mahal
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    CTR dan CPC wajar, tapi biaya per pembelian tetap menggerus margin keuntungan Anda.
                                </p>
                            </div>
                        </div>

                        {/* Card 2 */}
                        <div className="group flex items-start gap-5 bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <ShieldCheck className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    Landing page menahan calon pembeli, bukan mendorong mereka checkout
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    Pengunjung datang tapi bingung, ragu, atau tidak menemukan alasan kuat untuk beli sekarang.
                                </p>
                            </div>
                        </div>

                        {/* Card 3 */}
                        <div className="group flex items-start gap-5 bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <AlertCircle className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    Tidak tahu di titik mana funnel benar-benar bocor
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    Sudah ganti kreatif, angle, dan format — tapi tetap bingung harus mulai benahi dari mana.
                                </p>
                            </div>
                        </div>

                        {/* Card 4 */}
                        <div className="group flex items-start gap-5 bg-slate-50/70 rounded-2xl p-6 sm:p-7 border border-slate-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-all duration-300">
                            <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                                <TrendingDown className="w-5 h-5 text-indigo-600" />
                            </div>
                            <div>
                                <h3 className="text-base sm:text-lg font-bold text-slate-900 leading-snug">
                                    Traffic makin banyak, tapi niat beli yang sesungguhnya makin menurun
                                </h3>
                                <p className="mt-2 text-sm text-slate-500 leading-relaxed">
                                    Angka visitor naik terus, tapi konversi justru stagnan atau bahkan turun.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2.5 AGITATION SECTION */}
            <section id="agitation" className="py-24 lg:py-32 bg-rose-50/30 text-slate-900 relative overflow-hidden">
                {/* Background effects */}
                <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-rose-200 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-rose-100/50 rounded-full blur-[100px] pointer-events-none"></div>

                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="max-w-3xl mb-16">
                        <div className="inline-flex items-center rounded-full px-4 py-1.5 text-xs font-bold text-rose-600 bg-rose-100 border border-rose-200 uppercase tracking-widest mb-6 shadow-sm">
                            KALAU DIBIARKAN TERUS
                        </div>
                        <h2 className="text-4xl font-extrabold tracking-tight sm:text-5xl text-slate-900 leading-[1.2]">
                            Skala Iklan Makin Gede,<br className="hidden sm:block" />
                            Tapi Kok Margin Makin Tipis?
                        </h2>
                        <p className="mt-6 text-lg sm:text-xl text-slate-600 leading-relaxed">
                            Mendiamkan kebocoran funnel bukan cuma soal "konversi jelek". Ini adalah tentang <span className="text-rose-600 font-semibold">uang dan waktu Anda yang terus terbuang sia-sia</span> setiap hari.
                        </p>
                    </div>

                    {/* Timeline / Consequences Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 relative">
                        {/* Desktop connecting line */}
                        <div className="hidden md:block absolute top-[45px] left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-transparent via-rose-200 to-transparent -z-10"></div>

                        {/* Consequence 1 */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 group">
                            <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-100 transition-colors mb-6">
                                <TrendingDown className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Budget Iklan Terbakar</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Terus scale up iklan tanpa membenahi landing page sama dengan membuang air ke ember bocor. Budget makin bengkak, tapi ROI hancur.
                            </p>
                        </div>

                        {/* Consequence 2 */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 group md:translate-y-8">
                            <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-100 transition-colors mb-6">
                                <AlertCircle className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Waktu Habis Coba-coba</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Berapa minggu terbuang untuk ganti angle, ganti video, ganti desain LP—tanpa tahu pasti mana yang salah? Tebak-tebakan itu mahal.
                            </p>
                        </div>

                        {/* Consequence 3 */}
                        <div className="bg-white rounded-2xl p-8 sm:p-10 border border-rose-100 hover:border-rose-300 hover:shadow-lg hover:shadow-rose-100 transition-all duration-300 group md:translate-y-16">
                            <div className="w-14 h-14 rounded-xl bg-rose-50 flex items-center justify-center border border-rose-100 group-hover:bg-rose-100 transition-colors mb-6">
                                <Users className="w-6 h-6 text-rose-600" />
                            </div>
                            <h3 className="text-xl font-bold text-slate-900 mb-4">Traffic Jadi Sampah</h3>
                            <p className="text-slate-600 leading-relaxed">
                                Ribuan klik masuk tapi nggak ada yang klik tombol WA. Algoritma makin bingung mencari audiens yang tepat, CPA meroket tak terkendali.
                            </p>
                        </div>
                    </div>
                    
                    {/* Bridge to Solution */}
                    <div className="mt-24 text-center max-w-2xl mx-auto md:mt-36">
                        <p className="text-lg text-slate-600">
                            Kabar baiknya? Kebocoran ini punya <span className="text-indigo-600 font-bold italic">pola yang bisa dibaca.</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* 3. BRIDGE / SOLUTION SECTION */}
            <section id="solution" className="py-24 lg:py-32 bg-white relative">
                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    
                    {/* Visual Element: Simple Funnel / Magnifying Glass Concept */}
                    <div className="flex justify-center mb-10">
                        <div className="relative w-24 h-24 rounded-full bg-indigo-50 flex items-center justify-center border border-indigo-100 shadow-inner">
                            <Search className="w-10 h-10 text-indigo-600 relative z-10" />
                            {/* Decorative dots around representing the 4 leaks */}
                            <div className="absolute top-2 right-2 w-3 h-3 bg-rose-400 rounded-full animate-pulse"></div>
                            <div className="absolute bottom-4 right-2 w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-75"></div>
                            <div className="absolute bottom-2 left-4 w-3 h-3 bg-rose-400 rounded-full animate-pulse delay-150"></div>
                            <div className="absolute top-4 left-2 w-2 h-2 bg-rose-400 rounded-full animate-pulse delay-300"></div>
                        </div>
                    </div>

                    {/* Heading Area */}
                    <div className="inline-block rounded-full px-5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 uppercase tracking-widest mb-8">
                        ADA CARA UNTUK MENGATASINYA
                    </div>
                    
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-slate-900 leading-[1.2] mb-8">
                        Stop Tebak-tebakan. <br className="hidden sm:block" />
                        <span className="text-indigo-600">Semua Data Ada di Landing Page Anda.</span>
                    </h2>
                    
                    <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto mb-16">
                        Keempat penyebab closing mahal sebenarnya BISA dibaca polanya dari data. Begitu Anda tahu persis di mana titik bocornya, perbaikannya jadi sangat presisi dan terukur. Inilah yang akan kita bedah tuntas di Webinar <span className="font-semibold text-slate-900">"The Silent Conversion Leak"</span>.
                    </p>

                    {/* Micro CTA to scroll down */}
                    <div className="flex flex-col items-center justify-center space-y-3 animate-bounce">
                        <span className="text-sm font-semibold text-slate-400 uppercase tracking-widest">
                            Lihat cara diagnosanya di bawah
                        </span>
                        <ArrowRight className="w-5 h-5 text-indigo-400 rotate-90" />
                    </div>
                </div>
            </section>

            {/* 3.5 IMPACT / TRANSFORMATION SECTION */}
            <section id="impact" className="py-24 lg:py-32 bg-[#F5F3FF] relative">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-block rounded-full px-5 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 uppercase tracking-widest mb-6 shadow-sm">
                            SETELAH IKUT WEBINAR INI
                        </div>
                        <h2 className="text-4xl font-black tracking-tight sm:text-5xl lg:text-6xl text-slate-900 leading-[1.15] mb-6">
                            Punya Kendali <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Penuh Atas Data</span> <br className="hidden sm:block" />
                            dan Keputusan Anda
                        </h2>
                        <p className="text-lg sm:text-xl text-slate-600 leading-relaxed max-w-2xl mx-auto">
                            Webinar ini bukan sekadar solusi instan ajaib. Ini adalah tentang memberikan Anda <strong className="font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">kacamata baru</strong> untuk melihat bisnis Anda sendiri, sehingga Anda tak perlu lagi bergantung pada asumsi orang lain.
                        </p>
                    </div>

                    {/* Before-After Stack Layout */}
                    <div className="flex flex-col gap-6 lg:gap-8 max-w-5xl mx-auto">
                        
                        {/* Point 1 */}
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/40 border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 hover:-translate-y-1">
                            {/* Before Side */}
                            <div className="flex-1 p-8 sm:p-10 bg-slate-50/80 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-center relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                        <X className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sebelumnya</span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    Tebak-tebakan ganti-ganti materi kreatif, angle iklan, atau desain tanpa arah yang jelas.
                                </p>
                            </div>
                            
                            {/* After Side */}
                            <div className="flex-1 p-8 sm:p-10 relative overflow-hidden bg-white flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Nanti</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                                    Tahu persis titik mana yang bocor dan komponen apa yang perlu segera dibenahi.
                                </p>
                            </div>
                        </div>

                        {/* Point 2 */}
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/40 border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex-1 p-8 sm:p-10 bg-slate-50/80 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-center relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                        <X className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sebelumnya</span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    Bingung mendapat masukan dan saran yang berbeda-beda dari berbagai "guru" atau sumber.
                                </p>
                            </div>
                            
                            <div className="flex-1 p-8 sm:p-10 relative overflow-hidden bg-white flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Nanti</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                                    Punya <span className="text-indigo-600">framework sendiri</span> untuk menilai dan memutuskan mana yang relevan untuk bisnis Anda.
                                </p>
                            </div>
                        </div>

                        {/* Point 3 */}
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/40 border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex-1 p-8 sm:p-10 bg-slate-50/80 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-center relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                        <X className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sebelumnya</span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    Khawatir dan cemas karena budget iklan terus terbakar tanpa ROI yang sepadan.
                                </p>
                            </div>
                            
                            <div className="flex-1 p-8 sm:p-10 relative overflow-hidden bg-white flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Nanti</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                                    Tenang karena bisa mengalokasikan effort dan budget ke titik yang <span className="text-indigo-600">benar-benar berdampak.</span>
                                </p>
                            </div>
                        </div>

                        {/* Point 4 */}
                        <div className="flex flex-col sm:flex-row bg-white rounded-[2rem] overflow-hidden shadow-xl shadow-indigo-100/40 border border-slate-100 group hover:shadow-2xl hover:shadow-indigo-200/60 transition-all duration-500 hover:-translate-y-1">
                            <div className="flex-1 p-8 sm:p-10 bg-slate-50/80 border-b sm:border-b-0 sm:border-r border-slate-100 flex flex-col justify-center relative">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-rose-100 flex items-center justify-center">
                                        <X className="w-4 h-4 text-rose-600" />
                                    </div>
                                    <span className="text-sm font-bold text-slate-500 uppercase tracking-widest">Sebelumnya</span>
                                </div>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed">
                                    Landing page terasa seperti tebakan desain, tidak yakin bagian mana yang salah.
                                </p>
                            </div>
                            
                            <div className="flex-1 p-8 sm:p-10 relative overflow-hidden bg-white flex flex-col justify-center">
                                <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-indigo-50 to-transparent rounded-bl-full -z-10 group-hover:scale-125 transition-transform duration-700"></div>
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center shadow-sm">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                                    </div>
                                    <span className="text-sm font-bold text-emerald-600 uppercase tracking-widest">Nanti</span>
                                </div>
                                <p className="text-xl sm:text-2xl font-extrabold text-slate-900 leading-snug">
                                    Membangun dan mengoptimasi landing page sepenuhnya <span className="text-indigo-600">berdasarkan data audiens Anda, bukan asumsi.</span>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3.7 CASE STUDY SECTION */}
            <section id="case-study" className="py-24 lg:py-32 bg-[#F9FAFB] border-t border-slate-100">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-block rounded-full px-5 py-1.5 text-xs font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 uppercase tracking-widest mb-6 shadow-sm">
                            STUDI KASUS
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 leading-[1.2]">
                            Bukan Sekadar Teori. Ini Hasil Nyata dari Diagnosa Funnel yang Tepat.
                        </h2>
                    </div>

                    <div className="flex flex-col gap-6 max-w-5xl mx-auto">

                        {/* Row 1: Tsania Latheefa — Video Testimoni (full width) */}
                        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow">
                            <div className="flex items-center gap-4 mb-4">
                                <img 
                                    src="/assets/tsan-thumb.webp" 
                                    alt="Tsania Latheefa" 
                                    loading="lazy"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-slate-100 shadow-sm"
                                />
                                <div>
                                    <h3 className="text-lg font-bold text-slate-900">Tsania Latheefa</h3>
                                    <p className="text-sm text-slate-500 font-medium">Content Creator • 52.8K Followers</p>
                                </div>
                            </div>
                            <blockquote className="text-xl font-bold text-slate-900 leading-snug mb-4">
                                <span className="text-slate-400">"</span>
                                Omset Naik dari Rp20 Juta → <span className="text-emerald-500">Rp30 Juta</span> per bulan.
                                <span className="text-slate-400">"</span>
                            </blockquote>
                            <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-inner">
                                <div style={{ position: 'relative', paddingTop: '56.25%' }}>
                                    <iframe
                                        src="https://player.mediadelivery.net/embed/701292/623975dd-1d66-41c8-8aac-07a07c141d21?autoplay=false&loop=false&muted=false&preload=true&responsive=true"
                                        allow="accelerometer;gyroscope;autoplay;encrypted-media;picture-in-picture;fullscreen;"
                                        allowFullScreen
                                        style={{ border: 0, position: 'absolute', top: 0, height: '100%', width: '100%' }}
                                    />
                                </div>
                            </div>
                            <p className="mt-2 text-sm text-slate-500 font-medium text-center">
                                Video testimoni setelah optimasi landing page
                            </p>
                        </div>

                        {/* Row 2: 2 columns — Mas Ardi (left) + Testimoni Baru (right) */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                            {/* Card: Mas Ardi */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                                <div className="flex-1">
                                    <h3 className="text-lg font-bold text-slate-900 mb-1">Mas Ardi</h3>
                                    <p className="text-sm text-slate-500 font-medium mb-4">Klien PBM Agency</p>
                                    <blockquote className="text-xl font-bold text-slate-900 leading-snug mb-4">
                                        <span className="text-slate-400">"</span>
                                        ROAS Iklan Naik Drastis Menjadi <span className="text-indigo-600">5.0x</span>
                                        <span className="text-slate-400">"</span>
                                    </blockquote>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        Volume purchase meningkat tajam yang langsung terlihat dari metrik checkout landing page. Dikonfirmasi langsung oleh klien bahwa kenaikan ini jauh melebihi rata-rata pola musiman (seasonal) biasa.
                                    </p>
                                </div>
                                <div className="mt-5 bg-slate-100 rounded-2xl p-3 border border-slate-200 shadow-inner">
                                    <img 
                                        src="/assets/fullbright.webp" 
                                        alt="Bukti Chat Mas Ardi" 
                                        loading="lazy"
                                        className="w-full rounded-xl shadow-sm object-cover"
                                    />
                                </div>
                            </div>

                            {/* Card: Testimoni WA + Bukti (digabung) */}
                            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm hover:shadow-xl transition-shadow flex flex-col">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-9 h-9 rounded-full bg-emerald-100 flex items-center justify-center">
                                        <svg className="w-4 h-4 text-emerald-600" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>
                                    </div>
                                    <h3 className="text-base font-bold text-slate-900">Testimoni Klien via WhatsApp</h3>
                                </div>
                                <div className="flex justify-center mb-4">
                                    <img 
                                        src="/assets/newtestimoni.jpeg" 
                                        alt="Screenshot testimoni WhatsApp klien" 
                                        loading="lazy"
                                        className="w-full max-w-[280px] rounded-2xl border border-slate-200 shadow-md object-contain"
                                    />
                                </div>
                                <div className="border-t border-slate-100 pt-4 mt-auto">
                                    <div className="flex items-center gap-2 mb-3">
                                        <TrendingUp className="w-4 h-4 text-indigo-600" />
                                        <span className="text-sm font-bold text-slate-900">Bukti Hasil Kenaikan</span>
                                    </div>
                                    <img 
                                        src="/assets/buktinew.jpeg" 
                                        alt="Bukti hasil kenaikan performa" 
                                        loading="lazy"
                                        className="w-full rounded-xl border border-slate-200 shadow-sm object-contain"
                                    />
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OFFER STACK SECTION */}
            <section id="offer-stack" className="py-24 lg:py-32 bg-[#F5F3FF] relative">
                <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center max-w-3xl mx-auto mb-16">
                        <div className="inline-block rounded-full px-5 py-1.5 text-xs font-bold text-indigo-700 bg-white border border-indigo-200 uppercase tracking-widest mb-6 shadow-sm">
                            APA YANG KAMU DAPATKAN
                        </div>
                        <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 leading-[1.2]">
                            Bukan Sekadar Webinar. Ini Adalah Paket Lengkap Diagnosa Funnel Anda.
                        </h2>
                    </div>

                    {/* Benefit Cards Grid */}
                    <div className="grid gap-6 sm:grid-cols-2 max-w-5xl mx-auto">
                        {/* Card 1: Live Session */}
                        <div className="group bg-white rounded-[20px] overflow-hidden border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <img src="/images/benefits/live-session1.webp" alt="Live Session Webinar" className="w-full aspect-[16/9] object-cover" loading="lazy" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                                        <Check className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Live Session & Rekaman Webinar</h3>
                                </div>
                                <ul className="space-y-2 ml-[52px]">
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                        Sesi webinar live via zoom yang bahas strategi meningkatkan konversi landing page.</li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                        Rekaman webinar yang bisa kamu tonton ulang kapan aja.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Card 2: Ebook */}
                        <div className="group bg-white rounded-[20px] overflow-hidden border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <img src="/images/benefits/ebook1.webp" alt="Ebook Iklan Sudah Jalan Tapi Kok Boncos" className="w-full aspect-[16/9] object-cover" loading="lazy" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                                        <Check className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Ebook: Iklan Jalan, Tapi Kok Boncos?</h3>
                                </div>
                                <ul className="space-y-2 ml-[52px]">
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                        Materi pelengkap: praktek memperbaiki konversi secara praktis.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Card 3: Q&A */}
                        <div className="group bg-white rounded-[20px] overflow-hidden border border-slate-200 hover:border-indigo-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                            <img src="/images/benefits/qna-session1.webp" alt="Sesi Tanya Jawab" className="w-full aspect-[16/9] object-cover" loading="lazy" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center border border-indigo-100 group-hover:bg-indigo-600 group-hover:border-indigo-600 transition-colors">
                                        <Check className="w-5 h-5 text-indigo-600 group-hover:text-white transition-colors" />
                                    </div>
                                    <h3 className="text-lg font-bold text-slate-900">Akses Tanya Jawab Langsung</h3>
                                </div>
                                <ul className="space-y-2 ml-[52px]">
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                        Ajukan kondisi funnel kamu sendiri langsung ke mentor.</li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400"></span>
                                        Sesi tanya jawab interaktif di akhir webinar.</li>
                                </ul>
                            </div>
                        </div>

                        {/* Card 4: Audit (Bonus) */}
                        <div className="group bg-gradient-to-br from-amber-50 to-orange-50 rounded-[20px] overflow-hidden border border-amber-200 hover:border-amber-300 hover:shadow-xl hover:shadow-amber-100 transition-all duration-300 hover:-translate-y-1">
                            <img src="/images/benefits/audit-report1.webp" alt="Landing Page Audit" className="w-full aspect-[16/9] object-cover" loading="lazy" />
                            <div className="p-6">
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center border border-amber-200">
                                        <Star className="w-5 h-5 text-amber-600" />
                                    </div>
                                    <div>
                                        <span className="inline-flex items-center rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-bold text-amber-700 mb-1">BONUS SPESIAL</span>
                                        <h3 className="text-lg font-bold text-slate-900">Landing Page Audit Gratis</h3>
                                    </div>
                                </div>
                                <ul className="space-y-2 ml-[52px]">
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span>
                                        Setelah webinar, kamu bisa booking sesi audit personal ke landing page bisnis kamu.</li>
                                    <li className="flex items-start gap-2 text-sm text-slate-600 leading-relaxed">
                                        <span className="mt-[5px] h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400"></span>
                                        Dapatkan rekomendasi spesifik untuk kasus di bisnis kamu, bukan lagi saran umum.</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="mt-12 flex justify-center">
                        <a
                            href={WA_LINK}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex w-full sm:w-auto items-center justify-center px-8 py-4 text-base font-bold text-white transition-all bg-indigo-600 border border-transparent rounded-full shadow-lg shadow-indigo-600/30 hover:bg-indigo-700 hover:shadow-indigo-600/50 hover:-translate-y-0.5"
                        >
                            Amankan Kursi Anda Sekarang
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </a>
                    </div>
                </div>
            </section>


            {/* 6. PRICING SECTION */}
            <section id="pricing" className="py-24 lg:py-32 bg-slate-50 text-slate-900">
                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
                    
                    <div className="p-8 sm:p-10 lg:p-12 bg-white rounded-[2rem] border border-indigo-100 shadow-xl max-w-3xl mx-auto relative overflow-hidden">
                        {/* Glow effect */}
                        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-indigo-100 blur-[80px] pointer-events-none"></div>

                        <div className="relative z-10">
                            {/* Early Bird Badge */}
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-indigo-200 bg-indigo-50 text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8">
                                <Zap className="w-4 h-4" />
                                HARGA PROMO EARLY BIRD: HEMAT Rp220.000!
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-center gap-3 mb-3">
                                <span className="text-2xl text-slate-400 line-through font-semibold">Rp299.000</span>
                                <span className="px-3 py-1 rounded-full bg-rose-100 text-rose-600 text-xs font-extrabold tracking-wider border border-rose-200">DISKON 73%</span>
                            </div>
                            
                            <h3 className="text-6xl sm:text-7xl font-extrabold text-slate-900 mb-4 tracking-tight">Rp79.000</h3>
                            <p className="text-slate-500 text-sm sm:text-base font-medium mb-10">
                                Sekali bayar • Akses rekaman selamanya • Tanpa biaya tersembunyi
                            </p>

                            {/* Feature List */}
                            <div className="bg-slate-50 rounded-2xl border border-slate-100 p-6 sm:p-8 text-left mb-10 shadow-sm">
                                <ul className="space-y-5 text-sm sm:text-base font-medium text-slate-700">
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Live Session 90 Menit via Zoom (6 September 2026, 19:00 WIB)</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Rekaman Video HD Akses Selamanya (Bisa ditonton ulang kapan pun)</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Ebook Pelengkap: "Iklan Sudah Jalan, Tapi Kok Tetap Boncos?"</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Akses Q&A Langsung dengan Mentor (Bawa kondisi funnel bisnismu)</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Bonus Kesempatan Booking Sesi Personal Landing Page Audit (GRATIS)</span>
                                    </li>
                                    <li className="flex gap-4 items-start">
                                        <CheckCircle2 className="w-5 h-5 text-indigo-600 shrink-0 mt-0.5" />
                                        <span>Semua Bonus Terhitung Termasuk Dalam Harga Early Bird Ini</span>
                                    </li>
                                </ul>
                            </div>
                            
                            {/* CTA */}
                            <a 
                                href={WA_LINK}
                                onClick={() => trackCTA('pricing_submit', 'Daftar Sekarang', WA_LINK)}
                                data-cta-zone="pricing_submit"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="block"
                            >
                                <Button 
                                    className="w-full sm:w-auto min-w-[280px] h-16 sm:h-18 px-8 sm:px-12 text-lg sm:text-xl rounded-2xl font-bold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xl shadow-indigo-600/30 hover:shadow-indigo-600/50 hover:-translate-y-1 transition-all"
                                >
                                    Daftar Sekarang (Rp79.000)
                                    <ArrowRight className="w-6 h-6 ml-2" />
                                </Button>
                            </a>
                            
                            <div className="mt-5 flex justify-center items-center gap-2 text-xs font-semibold text-slate-500">
                                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                                <span>Pembayaran Aman • Garansi Kepuasan Sesi 100%</span>
                            </div>

                            <div className="mt-4 pt-4 border-t border-slate-100 flex justify-center items-center gap-2 text-xs sm:text-sm font-medium text-slate-500 max-w-md mx-auto text-center">
                                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                                <span>Garansi kepuasan 100% — materi praktis teruji dari pengalaman 100+ projek CRO</span>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 7. FAQ SECTION */}
            <section id="faq" className="py-20 lg:py-28 bg-slate-50">
                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-bold tracking-tight sm:text-4xl">Pertanyaan yang Sering Diajukan</h2>
                    </div>

                    <div className="space-y-4">
                        {[
                            {
                                q: 'Iklan saya udah jalan bagus, CTR tinggi, CPC rendah, ini relevan buat saya?',
                                a: 'Sangat cocok. Webinar ini dibuat khusus untuk kamu yang iklannya sudah jalan dengan baik, tapi closingnya masih tertahan. Kalau kamu ngerasa masalahnya ada di iklan itu sendiri, ini mungkin bukan tempat yang tepat.',
                            },
                            {
                                q: 'Traffic saya udah ramai, kenapa closing masih rendah?',
                                a: 'Karena ramai dan closing itu dua hal berbeda. Traffic ramai cuma menunjukkan iklan kamu berhasil menarik perhatian. Yang menentukan closing ada di langkah setelahnya, dari halaman sampai penawaran, yang kita bedah tuntas di webinar ini.',
                            },
                            {
                                q: 'Apa saja yang saya dapat kalau daftar?',
                                a: 'Akses penuh webinar live bareng Justin Wijaya, bonus ebook yang otomatis dikirim setelah daftar, dan kesempatan audit personal gratis setelah webinar selesai.',
                            },
                            {
                                q: 'Webinarnya kapan, dan platformnya apa?',
                                a: 'Kami menggunakan platform zoom, untuk Jadwal lengkap dikirim lewat email setelah kamu daftar. Pastikan email yang kamu masukkan aktif.',
                            },
                            {
                                q: 'Audit personal setelah webinar itu ngapain aja?',
                                a: 'Landing page dan funnel kamu akan ditinjau langsung, dicari titik titik yang berpotensi bocor. Ini juga jadi kesempatan buat kami mengenal bisnis kamu lebih jauh, kalau ke depannya kamu butuh bantuan lebih lanjut.',
                            },
                            {
                                q: 'Saya baru mulai jalanin iklan dan belum yakin iklannya sendiri bagus, cocok gak?',
                                a: 'Belum tentu. Webinar ini fokus untuk kamu yang iklannya sudah menunjukkan hasil baik, CTR dan CPC sehat, tapi closingnya belum ikut naik. Kalau iklan kamu sendiri yang masih dicari formulanya, ini bukan prioritas pertama kamu.',
                            },
                        ].map((faq) => (
                            <details key={faq.q} className="group bg-white rounded-2xl border border-slate-200 shadow-sm [&_summary::-webkit-details-marker]:hidden">
                                <summary className="flex cursor-pointer items-center justify-between gap-1.5 p-6 sm:p-8 font-bold text-lg text-slate-900">
                                    {faq.q}
                                    <span className="relative size-6 shrink-0 bg-slate-100 rounded-full flex items-center justify-center group-open:bg-indigo-50 group-open:text-indigo-600">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4 opacity-100 group-open:opacity-0 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="absolute size-4 opacity-0 group-open:opacity-100 transition-opacity" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M20 12H4" />
                                        </svg>
                                    </span>
                                </summary>
                                <div className="px-6 sm:px-8 pb-6 sm:pb-8 text-slate-600 text-lg leading-relaxed border-t border-slate-100 pt-6 mt-2">
                                    {faq.a}
                                </div>
                            </details>
                        ))}
                    </div>
                </div>
            </section>

            {/* 8. FINAL CTA SECTION */}
            <section id="final-cta" className="relative py-28 lg:py-40 text-center bg-[#1E1B2E] overflow-hidden">
                {/* Background Glows */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent"></div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8 relative z-10">
                    <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl lg:text-5xl text-white leading-[1.2]">
                        4 Titik Kebocoran Ini Nggak Akan <br className="hidden md:block" />
                        Ketemu Sendiri Kalau Terus Ditebak-tebak
                    </h2>
                    
                    <p className="mt-6 text-xl sm:text-2xl text-indigo-200/90 font-medium max-w-2xl mx-auto leading-relaxed mb-12">
                        Berhenti buang waktu dan budget iklan. <br className="hidden sm:block" />
                        Daftar sekarang sebelum harga <span className="text-white font-bold">Early Bird</span> ditutup.
                    </p>

                    {/* Urgency Box */}
                    <div className="inline-block bg-slate-900/60 border border-slate-700/50 backdrop-blur-sm rounded-2xl px-6 py-4 mb-10 shadow-2xl">
                        <div className="flex items-center gap-3">
                            <Clock className="w-5 h-5 text-amber-400" />
                            <p className="text-slate-300 font-medium">
                                Harga <span className="text-white font-bold">Rp79.000</span> berlaku sampai pendaftaran ditutup.
                            </p>
                        </div>
                    </div>

                    {/* CTA Area */}
                    <div className="flex flex-col items-center space-y-5">
                        <a href="#pricing" onClick={() => trackCTA('final_cta', 'Ikut Webinar', '#pricing')} data-cta-zone="final_cta" className="w-full sm:w-auto cursor-pointer">
                            <Button size="lg" className="w-full sm:w-auto h-20 px-14 text-2xl rounded-full font-extrabold shadow-[0_0_40px_-10px_rgba(251,191,36,0.4)] hover:shadow-[0_0_60px_-10px_rgba(251,191,36,0.6)] hover:scale-105 transition-all duration-300 bg-amber-400 hover:bg-amber-500 text-amber-950 border border-amber-300 cursor-pointer">
                                Ikut Webinar — Rp79.000
                            </Button>
                        </a>
                        
                        <div className="flex items-center gap-2 text-slate-400">
                            <span>Harga Normal:</span>
                            <span className="line-through decoration-slate-500 text-slate-500 font-semibold">Rp299.000</span>
                        </div>
                    </div>

                    {/* Micro-trust */}
                    <div className="mt-16 pt-10 border-t border-slate-800/50 flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="flex -space-x-2">
                            <div className="w-10 h-10 rounded-full border-2 border-[#1E1B2E] bg-indigo-900 flex items-center justify-center overflow-hidden">
                                <span className="text-xs font-bold text-indigo-300">JW</span>
                            </div>
                        </div>
                        <p className="text-sm font-medium text-slate-400 text-left">
                            Dibawakan langsung oleh <strong className="text-slate-200">Justin Wijaya</strong><br className="hidden sm:block" />
                            <span className="opacity-80">CRO Specialist, klien naik konversi 1,5–2x</span>
                        </p>
                    </div>
                </div>
            </section>

            {/* FOOTER */}
            <footer className="py-12 text-center border-t border-slate-200 bg-slate-50 text-slate-500 text-sm pb-28 sm:pb-12">
                <div className="mx-auto w-full max-w-6xl px-4 sm:px-6 lg:px-8">
                    <p className="font-medium">© 2026 PBM Agency. All rights reserved.</p>
                </div>
            </footer>


        </div>
    );
}
