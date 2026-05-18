import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export default function TermsOfServicePage({ onBack, onNavigate, onLogin }: TermsOfServicePageProps) {
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
                    Terms of Service and Privacy Agreement
                </h1>
                <p className="text-sm text-slate-500 mb-8">Last updated: May 18, 2026</p>

                <div className="space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement Between Private Individuals</h2>
                        <p className="mb-4">
                            This Agreement is entered into by and between <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong> (collectively, "the Developers") and you ("the User"). By creating an account on pilotrecognition.com, you explicitly agree to the following terms. This is a person-to-person contract under the Civil Code of the Philippines. We operate as individual developers, not through a registered corporation or business entity.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Consent to Data Processing</h2>
                        <p className="mb-4">
                            By creating an account, you provide your explicit, informed consent to <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong>, operating as the developers of pilotrecognition.com. You authorize us to store your anonymous user identifier and your estimated flight hours (user-declared metadata) in our Supabase database strictly for the purpose of displaying your pilot profile.
                        </p>
                        <p className="mb-4">
                            <strong>Authentication Proxy:</strong> Login and account security on this platform are independently managed by <strong>Auth0</strong> by Okta, a third-party authentication proxy service. When you enter your email and password, that data is sent directly to Auth0's secure servers — it never touches our own servers or database. Auth0 validates your credentials and returns a cryptographically secure token (JSON Web Token) to our application. Our Supabase database stores only an anonymous User ID token (e.g., auth0|12345...), not your email or password. We do not have the ability to view, access, or store your login credentials.
                        </p>
                        <p className="mb-4 mt-4">
                            <strong>Data Limitation and Non-Verification Disclaimer:</strong> pilotrecognition.com displays only user-declared aviation metadata, such as estimated flight hours and general license ratings, based entirely on explicit user input. This platform does not collect, store, or verify official government-issued license numbers, logs, or legal credentials. Legal authentication of certifications remains strictly between the user, the relevant aviation Data Issuer, and authorized verification providers.
                        </p>
                        <p className="mb-4 mt-4">
                            <strong>Third-Party Verification Disclaimer:</strong> pilotrecognition.com does not collect or store official government license documents or sensitive identification numbers on its own servers. Professional credential verification is securely offloaded to Veremark, an independent, third-party screening provider. By initiating a verification check, you consent to sharing your basic contact information with Veremark to process your credentials. Your verified achievements will be managed via your independent Verepass wallet.
                        </p>

                        <h2 className="text-2xl font-bold text-slate-900 mb-4 mt-8">2. Data Collection and Purpose</h2>
                        <p className="mb-4">The Developers collect the following data solely to create and display your pilot profile on this platform:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your anonymous User ID (provided via JWT token from Auth0)</li>
                            <li>Your estimated total flight hours (user-declared metadata)</li>
                            <li>Your general license ratings and type ratings (user-declared)</li>
                            <li>Your pathway interests and program preferences</li>
                        </ul>
                        <p className="mt-4">We do <strong>not</strong> collect, store, or process your email address, password, or any login credentials. Authentication is handled entirely by Auth0, our third-party authentication proxy. We do <strong>not</strong> collect, store, or verify official government-issued license numbers, medical certificate numbers, logbook serial numbers, or any other sensitive personal identification data. Legal authentication of all certifications remains strictly between the user, the relevant aviation Data Issuer (e.g., CAAP, FAA, EASA), and authorized third-party verification providers. We do not collect passport data, financial account details, or any information not directly related to your pilot profile display.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Storage and Security</h2>
                        <p>Your profile data (anonymous User ID and estimated flight hours) is stored securely in our Supabase database. Your login credentials (email and password) are stored exclusively by Auth0, Inc. While the Developers implement standard digital security measures, you acknowledge that no online database is 100% secure against unauthorized breaches. We are personally responsible for the protection of your profile data as Joint Personal Information Controllers under the Data Privacy Act of 2012. Auth0 is solely responsible for the security of your authentication credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Account Deletion and Data Retention</h2>
                        <p>You retain the right to delete your profile at any time. Upon your request or account deletion, the Developers will permanently erase your email, license information, flight hours, and all associated personal data from the active database within 30 days. Your consent timestamp (recorded at account creation) serves as legal proof of when you accepted these terms.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Account Registration</h2>
                        <p className="mb-4">To use certain features of the platform, you must register for an account. You agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate, current, and complete information</li>
                            <li>Maintain and update your account information</li>
                            <li>Keep your password secure and confidential</li>
                            <li>Notify us immediately of unauthorized access</li>
                            <li>Accept responsibility for all activities under your account</li>
                            <li>Accept these Terms of Service and Privacy Agreement before any data is submitted</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. User Conduct</h2>
                        <p className="mb-4">You agree not to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Use the platform for any illegal purpose</li>
                            <li>Impersonate any person or entity</li>
                            <li>Interfere with or disrupt the platform</li>
                            <li>Upload malicious code or viruses</li>
                            <li>Violate any applicable laws or regulations</li>
                            <li>Harass, abuse, or harm other users</li>
                            <li>Post false or misleading information about your credentials or flight hours</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. PilotRecognition Profile</h2>
                        <p className="mb-4">By creating a PilotRecognition Profile, you agree to:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Provide accurate and verifiable information</li>
                            <li>Allow verification of your credentials and certifications (through Recognition+)</li>
                            <li>Accept that your recognition score is based on objective criteria</li>
                            <li>Understand that false information may result in account termination</li>
                            <li>Acknowledge that free-tier profile data is self-claimed and unverified until the verification workflow is completed</li>
                        </ul>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Electronic Consent</h2>
                        <p>Under the Electronic Commerce Act (R.A. 8792), clicking the "I Agree" checkbox or button during signup is legally binding — equivalent to signing a paper contract with a pen. We record a timestamp in our database at the moment you create your account, which serves as legal proof that you accepted these terms on that specific date and time.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Intellectual Property</h2>
                        <p>All content, features, and functionality of the PilotRecognition platform are owned by the Developers and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Limitation of Liability</h2>
                        <p>This website is a private project provided "as-is" without any warranties. The Developers are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including data leaks, server downtimes, or inaccuracies in user-declared flight hours.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account at any time for violation of these Terms of Service or for any other reason at our sole discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Governing Law</h2>
                        <p>These Terms of Service shall be governed by and construed in accordance with the laws of the Republic of the Philippines, specifically the Civil Code of the Philippines and the Data Privacy Act of 2012.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Payment Processing, Anti-Money Laundering &amp; Fee Distribution</h2>
                        <p className="mb-4">
                            All subscription and verification fees processed through this platform are routed exclusively via a decentralized payment gateway operating as a neutral, automated conduit. Pilot Recognition does not hold, accumulate, or retain the full value of any transaction in its own accounts. At the moment a payment clears, the gateway automatically distributes the transaction on-chain to the respective integration partners responsible for the corresponding service layer:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li><strong>5% — Regional Civil Aviation Authority (CAA/ATO framework):</strong> Compensates the relevant regulatory body for licensing registry access and authority handling.</li>
                            <li><strong>5% — Regional Flight Logbook Provider:</strong> Covers the cost of raw logbook data ingestion and flight-hour stream processing.</li>
                            <li><strong>13% — Background Verification Provider:</strong> Compensates the independent third-party screening provider for executing credential vetting and background auditing.</li>
                            <li><strong>77% — Platform Infrastructure:</strong> The remaining balance is designated exclusively for platform infrastructure operational costs, including but not limited to: authentication token management (Auth0), secure database tiers (Supabase), and hosting infrastructure (Vercel).</li>
                        </ul>
                        <p className="mb-4">
                            <strong>Anti-Money Laundering (AML) Compliance:</strong> Because Pilot Recognition never holds 100% of any transaction in a single account, it cannot be classified as a centralized financial entity or data reseller. The on-chain split architecture provides a transparent, immutable ledger demonstrating that all funds flow directly and immediately to verified institutional recipients. This structure is designed to satisfy AML compliance requirements by ensuring full traceability of every transaction. The decentralized gateway's automated systems log each distribution event, creating an auditable trail that identifies the exact parties compensated, the amount, and the corresponding service rendered.
                        </p>
                        <p className="mb-4">
                            <strong>Liability Attribution:</strong> The on-chain payment record constitutes an irrefutable, time-stamped receipt. It identifies which entity was paid to perform each verification function, thereby establishing that any data processing errors, credential disputes, or service failures are attributable to the respective integration partner responsible for that layer — not to Pilot Recognition as the neutral display interface.
                        </p>
                        <p>
                            By purchasing a Recognition+ subscription or initiating any verification workflow, you explicitly authorize this automated, split-payment distribution model and acknowledge that the funds are being allocated to the parties responsible for providing the underlying data services.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Contact Us</h2>
                        <p>If you have any questions about these Terms of Service, please contact us at:</p>
                        <p className="mt-2">legal@pilotrecognition.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
