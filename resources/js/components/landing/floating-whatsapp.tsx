import { usePage } from '@inertiajs/react';
import { MessageCircle } from 'lucide-react';

export function FloatingWhatsApp() {
    const { settings } = usePage<any>().props;
    const waNumber = settings?.wa_support_number || '6285931018333';
    
    // Default message when they click the WhatsApp button
    const WA_LINK = `https://wa.me/${waNumber}?text=${encodeURIComponent('Halo Tim PBM Agency, saya mau tanya tentang Webinar The Silent Conversion Leak.')}`;

    return (
        <a
            href={WA_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40"
            aria-label="Chat with us on WhatsApp"
        >
            {/* Ping animation effect */}
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#25D366] opacity-30 group-hover:hidden"></span>
            
            {/* WhatsApp Icon */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="relative z-10"
            >
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        </a>
    );
}