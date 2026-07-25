import { Head, Link } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';

export default function Terms() {
    return (
        <div className="min-h-screen bg-lp-bg px-4 py-8 sm:py-12">
            <Head title="Terms and Conditions" />
            
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
                        Terms and Conditions
                    </h1>
                    
                    <div className="space-y-6 text-lp-text-muted text-sm leading-relaxed">
                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">1. Introduction</h2>
                            <p>
                                Welcome to our website. By accessing or using our services, you agree to be bound by these Terms and Conditions. Please read them carefully. If you do not agree with any part of these terms, you must not use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">2. Intellectual Property</h2>
                            <p>
                                All content provided in our webinars, courses, and website—including but not limited to text, graphics, logos, images, video clips, digital downloads, and data compilations—is the property of PBM Agency and is protected by copyright and international intellectual property laws. You may not reproduce, distribute, or create derivative works without our explicit permission.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">3. User Conduct</h2>
                            <p>
                                You agree to use our website and services only for lawful purposes and in a way that does not infringe the rights of, restrict, or inhibit anyone else's use and enjoyment of the website. Prohibited behavior includes harassing or causing distress or inconvenience to any other user, transmitting obscene or offensive content, or disrupting the normal flow of dialogue within our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">4. Purchases and Payments</h2>
                            <p>
                                If you wish to purchase any product or service made available through our website, you may be asked to supply certain information relevant to your purchase. All payments are processed securely through our authorized payment gateway providers. We reserve the right to refuse or cancel your order at any time for reasons including but not limited to product or service availability, errors in the description or price, or suspected fraud.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">5. Disclaimer of Warranties</h2>
                            <p>
                                Our services and educational materials are provided on an "as is" and "as available" basis. PBM Agency makes no representations or warranties of any kind, express or implied, as to the operation of the services or the information, content, materials, or products included. You expressly agree that your use of our services is at your sole risk.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">6. Limitation of Liability</h2>
                            <p>
                                In no event shall PBM Agency, its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use our services.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">7. Changes to Terms</h2>
                            <p>
                                We reserve the right, at our sole discretion, to modify or replace these Terms at any time. By continuing to access or use our services after any revisions become effective, you agree to be bound by the revised terms.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-lg font-bold text-lp-text mb-2">8. Contact Us</h2>
                            <p>
                                If you have any questions about these Terms, please contact us through our official support channels.
                            </p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
}