import { createInertiaApp } from '@inertiajs/react';
import { lazy, Suspense } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { initializeTheme } from '@/hooks/use-appearance';

// PostHog: only load when API key is configured (skip when POSTHOG_DISABLED=true)
const apiKey = import.meta.env.VITE_POSTHOG_KEY;
if (apiKey) {
    import('@/lib/posthog').then(() => import('@/lib/posthog-tracking'));
}

// We use lazy() here so the heavy dashboard NEVER loads on the landing page!
const AppLayout = lazy(() => import('@/layouts/app-layout'));
const AuthLayout = lazy(() => import('@/layouts/auth-layout'));
const SettingsLayout = lazy(() => import('@/layouts/settings/layout'));

const appName = import.meta.env.VITE_APP_NAME || 'Laravel';

createInertiaApp({
    title: (title) => (title ? `${title}` : appName),
    layout: (name) => {
        switch (true) {
            case name.startsWith('auth/'):
                return AuthLayout;
            case name.startsWith('settings/'):
                return [AppLayout, SettingsLayout];
            default:
                return null;
        }
    },
    strictMode: true,
    withApp(app) {
        return (
            <TooltipProvider delayDuration={0}>
                {/* Suspense is required when using lazy() layout imports */}
                <Suspense fallback={null}>{app}</Suspense>
                <Toaster />
            </TooltipProvider>
        );
    },
    progress: {
        color: '#4B5563',
    },
});

initializeTheme();
