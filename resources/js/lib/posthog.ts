import posthog from 'posthog-js';

const apiKey = import.meta.env.VITE_POSTHOG_KEY;
const apiHost = import.meta.env.VITE_POSTHOG_HOST;

if (apiKey && apiHost) {
    posthog.init(apiKey, {
        api_host: apiHost,
        defaults: '2026-05-30',
    });
}

export default posthog;
