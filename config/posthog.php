<?php

return [
    'api_key' => env('POSTHOG_PROJECT_TOKEN'),
    'host' => env('POSTHOG_HOST'),
    'disabled' => (bool) env('POSTHOG_DISABLED', false),

    // Attached to every event this project sends, so all clients sharing the
    // PBM Agency PostHog project can be told apart. client_type is fixed for
    // this project's funnel (form checkout + payment), unlike client_id which
    // changes per client deployment of this codebase.
    'client_id' => env('POSTHOG_CLIENT_ID', 'pbm-webinar'),
    'client_type' => 'form_with_payment',
];
