import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface CookiePolicyPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export default function CookiePolicyPage({ onBack, onNavigate, onLogin }: CookiePolicyPageProps) {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div className="pt-32 pb-12 px-6 max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl mb-8"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-8">
                    Cookie Policy
                </h1>
                <p className="text-sm text-slate-500 mb-8">Last updated: April 2024</p>

                <div className="space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. What Are Cookies</h2>
                        <p>Cookies are small text files that are placed on your device when you visit our website. They are widely used to make websites work more efficiently and to provide information to website owners.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Cookies</h2>
                        <p className="mb-4">We use cookies for the following purposes:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Essential Cookies:</strong> Required for the website to function properly</li>
                            <li><strong>Authentication Cookies:</strong> Keep you logged in during your session</li>
                            <li><strong>Preference Cookies:</strong> Remember your settings and preferences</li>
                            <li><strong>Analytics Cookies:</strong> Help us understand how you use our platform</li>
                            <li><strong>Marketing Cookies:</strong> Track your interactions with our marketing content</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Types of Cookies We Use</h2>
                        <div className="space-y-4">
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Session Cookies</h3>
                                <p>Temporary cookies that expire when you close your browser. These are essential for maintaining your session and security.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Persistent Cookies</h3>
                                <p>Cookies that remain on your device for a set period or until you delete them. These remember your preferences and settings.</p>
                            </div>
                            <div>
                                <h3 className="text-xl font-semibold text-slate-900 mb-2">Third-Party Cookies</h3>
                                <p>Cookies set by third-party services we use for analytics, marketing, and functionality.</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Managing Cookies</h2>
                        <p className="mb-4">You can control and manage cookies in various ways:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use your browser settings to accept, reject, or delete cookies</li>
                            <li>Use our cookie consent banner to manage your preferences</li>
                            <li>Clear cookies from your browser at any time</li>
                            <li>Note that disabling certain cookies may affect website functionality</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Third-Party Services</h2>
                        <p className="mb-4">We use the following third-party services that may set cookies:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li><strong>Google Analytics:</strong> For website analytics and user behavior tracking</li>
                            <li><strong>Sentry:</strong> For error monitoring and performance tracking</li>
                            <li><strong>Payment Processors:</strong> For secure payment processing</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Cookie Consent</h2>
                        <p>When you first visit our platform, you will see a cookie consent banner where you can choose which types of cookies you consent to. You can change your preferences at any time through your account settings or by revisiting this policy.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Updates to This Policy</h2>
                        <p>We may update this Cookie Policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new policy on this page.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Contact Us</h2>
                        <p>If you have any questions about our use of cookies, please contact us at:</p>
                        <p className="mt-2">privacy@pilotrecognition.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
