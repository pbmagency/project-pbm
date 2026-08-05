// Ported from posthog-tracking.js (PBM Agency LP template).
// Covers the browser side of the funnel: engaged, intent, add_to_cart.
// 'lead' and 'payment' are captured server-side only (see CheckoutController /
// PaymentCallbackController) so they can't be spoofed or double-fired.
import posthog from '@/lib/posthog';

const CLIENT_ID = import.meta.env.VITE_POSTHOG_CLIENT_ID;
const CLIENT_TYPE = 'form_with_payment';

posthog.register({ client_id: CLIENT_ID, client_type: CLIENT_TYPE });

// ==== 1. ENGAGED ====
// Trigger: 15 detik di halaman ATAU scroll > 25%. Cuma fire sekali per kunjungan.
let engagedFired = false;
function fireEngaged() {
    if (engagedFired) {
        return;
    }

    engagedFired = true;
    posthog.capture('engaged');
}
setTimeout(fireEngaged, 15000);

window.addEventListener(
    'scroll',
    () => {
        const scrolled =
            (window.scrollY /
                (document.body.scrollHeight - window.innerHeight)) *
            100;

        if (scrolled > 25) {
            fireEngaged();
        }
    },
    { passive: true },
);

// ==== 2. INTENT dari klik CTA ====
// Tiap tombol CTA yang mau ditrack dikasih data-cta-zone="hero" / "pricing" / dst.
document.addEventListener('click', (e) => {
    const el = (e.target as HTMLElement).closest<HTMLElement>(
        '[data-cta-zone]',
    );

    if (!el) {
        return;
    }

    posthog.capture('intent', {
        cta_zone: el.getAttribute('data-cta-zone'),
        cta_label: el.innerText ? el.innerText.trim().slice(0, 50) : undefined,
    });
});

// ==== 3. ADD TO CART dari Formulir checkout ====
// Elemen <form> checkout dikasih attribute data-lp-form.
// Delegated on document (not queried once at load) because the form is
// rendered by a lazy-loaded React component that may not exist in the DOM yet
// when this module runs.
let atcFired = false;
document.addEventListener('input', (e) => {
    if (atcFired) {
        return;
    }

    if (!(e.target as HTMLElement).closest('[data-lp-form]')) {
        return;
    }

    atcFired = true;
    posthog.capture('add_to_cart');
});
