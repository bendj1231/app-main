import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export default function PrivacyPolicyPage({ onBack, onNavigate, onLogin }: PrivacyPolicyPageProps) {
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
                    Privacy Policy
                </h1>
                <p className="text-sm text-slate-500 mb-8">Last updated: May 2026</p>

                <div className="space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Consent to Data Processing</h2>
                        <p className="mb-4">
                            By creating an account, you provide your explicit, informed consent to <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong>, operating as the developers of pilotrecognition.com. You authorize us to store your anonymous user identifier and your estimated flight hours (user-declared metadata) in our Supabase database strictly for the purpose of displaying your pilot profile.
                        </p>
                        <p className="mb-4">
                            <strong>Authentication Proxy:</strong> Login and account security on this platform are independently managed by <strong>Auth0</strong> by Okta, a third-party authentication proxy service. When you enter your email and password, that data is sent directly to Auth0's secure servers — it never touches our own servers or database. Auth0 validates your credentials and returns a cryptographically secure token (JSON Web Token) to our application. Our Supabase database stores only an anonymous User ID token (e.g., auth0|12345...), not your email or password. We do not have the ability to view, access, or store your login credentials.
                        </p>
                        <p className="mb-4">
                            <strong>Data Limitation and Non-Verification Disclaimer:</strong> pilotrecognition.com displays only user-declared aviation metadata, such as estimated flight hours and general license ratings, based entirely on explicit user input. This platform does not collect, store, or verify official government-issued license numbers, logs, or legal credentials. Legal authentication of certifications remains strictly between the user, the relevant aviation Data Issuer, and authorized verification providers.
                        </p>
                        <p className="mb-4">
                            <strong>Third-Party Verification Disclaimer:</strong> pilotrecognition.com does not collect or store official government license documents or sensitive identification numbers on its own servers. Professional credential verification is securely offloaded to Veremark, an independent, third-party screening provider. By initiating a verification check, you consent to sharing your basic contact information with Veremark to process your credentials. Your verified achievements will be managed via your independent Verepass wallet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Data Controller</h2>
                        <p className="mb-4">
                            pilotrecognition.com is a private aviation project developed and operated by <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong> as individual developers. We act as Joint Personal Information Controllers (PICs) under the Data Privacy Act of 2012. We do not operate through a registered business entity. All data processing decisions are made by us as individuals, and we are personally responsible for compliance with applicable data privacy laws.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Information We Collect</h2>
                        <p className="mb-4">PilotRecognition collects information you provide directly to us, including:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your anonymous User ID (provided via JWT token from Auth0)</li>
                            <li>User-declared aviation metadata (estimated flight hours, general license ratings, type ratings)</li>
                            <li>PilotRecognition Profile data (recognition scores, pathway interests)</li>
                            <li>Communication data (messages, inquiries)</li>
                            <li>Payment information (processed securely through third-party providers)</li>
                            <li>Terms acceptance timestamp (legal proof of consent)</li>
                        </ul>
                        <p className="mt-4">We do <strong>not</strong> collect, store, or process your email address, password, or any login credentials. Authentication is handled entirely by Auth0, our third-party authentication proxy. We do <strong>not</strong> collect, store, or verify official government-issued license numbers, medical certificate numbers, logbook serial numbers, or any other sensitive personal identification data. Legal authentication of all certifications remains strictly between the user, the relevant aviation Data Issuer (e.g., CAAP, FAA, EASA), and authorized third-party verification providers.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. How We Use Your Information</h2>
                        <p className="mb-4">We use the information we collect to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide and maintain our Pilot Recognition platform</li>
                            <li>Process applications and pathway recommendations</li>
                            <li>Send you technical notices and support messages</li>
                            <li>Respond to your comments and questions</li>
                            <li>Monitor and analyze trends, usage, and activities</li>
                            <li>Detect, prevent, and address technical issues and fraud</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Information Sharing</h2>
                        <p className="mb-4">We may share information we collect with:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Airlines, operators, and training providers (only with your explicit consent)</li>
                            <li>Service providers who perform services on our behalf</li>
                            <li>Business partners (only with your explicit consent)</li>
                            <li>Law enforcement or government authorities (when required by law)</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Data Security</h2>
                        <p>Your data is stored securely using Supabase infrastructure. While we implement standard digital security measures, you acknowledge that no online database is 100% secure against unauthorized breaches.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Data Retention and Deletion</h2>
                        <p className="mb-4">You retain the right to delete your profile at any time. Upon your request or account deletion, we will permanently erase your email, license information, flight hours, and all associated personal data from the active database within 30 days.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Your Rights</h2>
                        <p className="mb-4">You have the right to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Access your personal information</li>
                            <li>Correct inaccurate information</li>
                            <li>Request deletion of your personal information</li>
                            <li>Opt-out of marketing communications</li>
                            <li>Object to processing of your personal information</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Contact Us</h2>
                        <p>If you have any questions about this Privacy Policy, please contact us at:</p>
                        <p className="mt-2">privacy@pilotrecognition.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
