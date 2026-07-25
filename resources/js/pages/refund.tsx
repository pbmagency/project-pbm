import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Refund() {
    return (
        <div className="min-h-screen bg-lp-bg px-4 py-8 sm:py-12">
            <Head title="Refund Policy" />
            
            <div className="mx-auto max-w-4xl">
                <Link
                    href="/"
                    className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-lp-text-dim transition-colors hover:text-lp-text"
                >
                    <ArrowLeft className="h-4 w-4" />
                    Back to home
                </Link>

                <div className="rounded-2xl border border-lp-border bg-lp-bg-elevated p-7 sm:p-9">
                    <h1 className="font-display text-3xl font-bold text-lp-text mb-8">
                        Refund Policy
                    </h1>
                    
                    <div className="space-y-6 text-lp-text-muted text-sm leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">1. General Refund Policy</h2>
                            <p>
                                Thank you for purchasing our digital products and services. We strive to provide high-quality educational content and webinars. However, because our products are digital and instantly accessible, we generally offer a limited refund policy. Please review the details below.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">2. Digital Products and Webinars</h2>
                            <p>
                                Due to the nature of digital goods and live events, all sales of tickets, eBooks, and recorded sessions are generally considered final. Once you have been granted access to the digital content or the webinar link, we cannot revoke that knowledge or access. 
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">3. Exceptions and Guarantees</h2>
                            <p>
                                We stand by the quality of our services. If you attend our live webinar and feel that you received absolutely no value, you may request a refund within 24 hours after the live session has concluded. To be eligible for this exception, you must:
                            </p>
                            <ul className="list-disc pl-5 mt-2 space-y-1">
                                <li>Have attended the live session for its full duration.</li>
                                <li>Contact our support team within 24 hours of the session's end.</li>
                                <li>Provide a valid reason outlining why the material did not meet your expectations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">4. Processing Refunds</h2>
                            <p>
                                If your refund request is approved, we will initiate a refund to your original method of payment. You will receive the credit within a certain amount of days, depending on your card issuer's or payment provider's policies. Please note that administrative or gateway fees may be non-refundable.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">5. Cancellations</h2>
                            <p>
                                If you purchase a ticket for a live event and cannot attend, you will still receive the recorded session and all bonus materials. Therefore, we do not offer refunds for "no-shows" or schedule conflicts, as the value is still delivered digitally.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">6. Contact Us</h2>
                            <p>
                                If you have any questions or need to request a refund, please contact our support team immediately. We are here to help and ensure you have a satisfactory experience.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}