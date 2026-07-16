import { usePage } from '@inertiajs/react';

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
            className="group fixed right-6 bottom-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg shadow-[#25D366]/30 transition-all duration-300 hover:-translate-y-1 hover:scale-110 hover:shadow-xl hover:shadow-[#25D366]/40"
            aria-label="Chat with us on WhatsApp"
        >
            {/* Official WhatsApp logo SVG */}
            <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="30"
                height="30"
                className="relative z-10"
                fill="currentColor"
                aria-hidden="true"
            >
                <path d="M24 4C13 4 4 13 4 24c0 3.6 1 7 2.7 9.9L4 44l10.4-2.7C17 43 20.4 44 24 44c11 0 20-9 20-20S35 4 24 4zm0 36c-3.1 0-6.1-.8-8.7-2.4l-.6-.4-6.2 1.6 1.7-6-.4-.6C8.2 29.9 7.4 27 7.4 24c0-9.1 7.4-16.6 16.6-16.6S40.6 14.9 40.6 24 33.1 40 24 40zm9.1-12.4c-.5-.2-2.9-1.4-3.4-1.6s-.8-.2-1.1.2c-.3.5-1.2 1.6-1.5 1.9-.3.3-.5.4-1 .1s-2-.7-3.8-2.3c-1.4-1.2-2.3-2.7-2.6-3.2-.3-.5 0-.7.2-1 .2-.2.5-.5.7-.8.2-.2.3-.5.4-.8.1-.3 0-.6-.1-.8-.1-.2-1.1-2.7-1.5-3.7-.4-1-.8-.8-1.1-.8h-.9c-.3 0-.8.1-1.2.6s-1.6 1.5-1.6 3.7 1.6 4.3 1.8 4.6c.2.3 3.1 4.8 7.6 6.7 1.1.5 1.9.7 2.6.9 1.1.3 2.1.3 2.9.2.9-.1 2.9-1.2 3.3-2.3.4-1.1.4-2.1.3-2.3-.1-.2-.5-.3-1-.5z" />
            </svg>
        </a>
    );
}
