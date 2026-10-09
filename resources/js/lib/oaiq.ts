/**
 * OpenAI Ads (ChatGPT Ads) Measurement Pixel Helper
 */

declare global {
    interface Window {
        oaiq?: (action: string, ...args: unknown[]) => void;
    }
}

/**
 * Send a measurement event to OpenAI Ads Pixel
 */
export function oaiqTrack(
    eventName: string,
    data: Record<string, unknown> = { type: 'contents' },
    options?: Record<string, unknown>,
): void {
    if (typeof window === 'undefined') {
        return;
    }

    if (typeof window.oaiq === 'function') {
        try {
            if (options) {
                window.oaiq('measure', eventName, data, options);
            } else {
                window.oaiq('measure', eventName, data);
            }
        } catch (e) {
            console.debug('OpenAI pixel measurement error:', e);
        }
    }
}

/**
 * 1. Track Page Visit
 */
export function trackOpenAiPageVisit(): void {
    // Standard event: page_viewed
    oaiqTrack('page_viewed', { type: 'contents' });
    // Also track custom page_visit
    oaiqTrack('custom', { type: 'custom' }, { custom_event_name: 'page_visit' });
}

/**
 * 2. Track Form Start Input
 */
export function trackOpenAiFormStartInput(): void {
    // Custom event: form_start_input
    oaiqTrack('custom', { type: 'custom' }, { custom_event_name: 'form_start_input' });
    oaiqTrack('form_start_input', { type: 'contents' });
}

/**
 * 3. Track Form Submit (Conversion Event)
 */
export function trackOpenAiFormSubmit(data?: Record<string, unknown>): void {
    // Primary conversion event configured: order_created
    oaiqTrack('order_created', { type: 'contents', ...data });
    // Standard lead event: lead_created
    oaiqTrack('lead_created', { type: 'customer_action', ...data });
    // Custom event: form_submit
    oaiqTrack('custom', { type: 'custom', ...data }, { custom_event_name: 'form_submit' });
}
