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
            {/* Coded by Benjamin Bowler */}
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            <div className="pt-32 pb-16 px-6 max-w-4xl mx-auto">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-6 py-3 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl mb-8"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back
                </button>

                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                    Privacy Policy
                </h1>
                <p className="text-sm text-slate-500 mb-2">Last updated: 21 May 2026</p>
                <p className="text-sm text-slate-500 mb-10">Effective date: 20 May 2026</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        This Privacy Policy explains how <strong>PilotRecognition.com</strong>, operated by <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong> (together, "we", "us", "our"), collects, uses, stores, and protects your personal information. It applies to all users of our platform, including pilots, aviation professionals, flight school administrators, and airline operators. By using PilotRecognition.com you agree to this Policy in full.
                    </p>
                </div>

                <div className="space-y-10 text-slate-700">

                    {/* ── SECTION 1 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">1. Who We Are — Data Controller vs. Data Owner</h2>
                        <p className="mb-3">
                            PilotRecognition.com is operated by <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong> as joint personal information controllers under the Philippines Data Privacy Act of 2012 (RA 10173), the EU General Data Protection Regulation (GDPR), and the UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 mb-4 text-sm">
                            <p className="font-semibold text-indigo-900 mb-2">Two distinct roles — both matter:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg px-4 py-3 border border-indigo-100">
                                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">We are the Data Controller</p>
                                    <p className="text-slate-600 text-xs">We decide what infrastructure to use, which processors to engage, and how the platform operates. This is a legal role defined by GDPR — it cannot be delegated away by architecture alone.</p>
                                </div>
                                <div className="bg-white rounded-lg px-4 py-3 border border-indigo-100">
                                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">You are the Data Owner</p>
                                    <p className="text-slate-600 text-xs">You decide what to share, with whom, and when. Your Verifiable Credentials live in your own wallet. Your sensitive fields are encrypted with a key only you can derive. You can delete everything at any time.</p>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-700 mt-3">These roles are not in conflict. We control the infrastructure. You own the data. Both are true simultaneously.</p>
                        </div>
                        <p className="mb-3 text-sm">
                            <strong>Contact for data matters:</strong> <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a>
                        </p>
                        <p className="text-sm text-slate-500">
                            We do not currently operate through a registered corporate entity. All data processing decisions are made by us as individuals and we accept personal responsibility for compliance with applicable privacy laws.
                        </p>
                    </section>

                    {/* ── SECTION 2 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">2. What Data We Collect and Why</h2>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2a. Account &amp; Identity Data</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Full name, email address, date of birth, nationality, country of residence</li>
                            <li>Profile photo (optional)</li>
                            <li>Contact phone number</li>
                        </ul>
                        <p className="text-sm mb-4"><strong>Legal basis:</strong> Contract performance (account creation); Legitimate interest (platform security).</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2b. Aviation Credential Data</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Pilot licence number, issuing authority, licence type, expiry date</li>
                            <li>Medical certificate class and expiry</li>
                            <li>Radio licence details</li>
                            <li>Total flight hours, aircraft ratings, type ratings</li>
                            <li>Employment history and professional experience</li>
                        </ul>
                        <p className="text-sm mb-4"><strong>Legal basis:</strong> Explicit consent (you provide this voluntarily to build your verified profile).</p>
                        <p className="text-sm mb-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                            <strong>Encryption Notice:</strong> Sensitive credential fields (licence number, medical class, date of birth, contact number, expiry dates) are encrypted at rest using AES-256-GCM before storage. The encryption key is derived from your Google account identity and a server-side secret. We cannot read these fields without your authenticated session.
                        </p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2c. Verifiable Credential Data</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Cryptographic credential hashes stored in our revocation registry</li>
                            <li>Credential offer URLs for your Pilot Wallet</li>
                            <li>Credential status (active, revoked, expired)</li>
                        </ul>
                        <p className="text-sm mb-4">The actual Verifiable Credential (VC) is stored in your personal Pilot Wallet — not on our servers. We retain only a revocation status entry to allow airlines to verify your credential has not been revoked.</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2d. Usage &amp; Technical Data</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>IP address, browser type, device type</li>
                            <li>Pages visited, features used, session duration</li>
                            <li>Activity logs for security and fraud detection</li>
                        </ul>
                        <p className="text-sm mb-4"><strong>Legal basis:</strong> Legitimate interest (security, fraud prevention, service improvement).</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2e. Payment Data</h3>
                        <p className="text-sm mb-4">Payment processing is handled entirely by <strong>Stripe</strong>. We do not store card numbers or bank details. We retain only transaction IDs, amounts, and subscription status.</p>
                    </section>

                    {/* ── SECTION 3 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">3. Authentication — How Login Works</h2>
                        <p className="mb-3 text-sm">
                            Login and account security are managed by <strong>Auth0 by Okta</strong>, a third-party authentication provider. When you sign in with Google or email, your credentials are sent directly to Auth0's servers — they never pass through our own servers. Auth0 returns a cryptographically signed JWT token to our application. We store only your stable Auth0 user identifier (e.g., <code className="bg-slate-100 px-1 rounded text-xs">google-oauth2|12345...</code>), not your password.
                        </p>
                        <p className="text-sm mb-4">
                            Your Google account identity is also used to derive your vault encryption key (see Section 2b). This means your sensitive data is only accessible while you are actively authenticated with your Google account.
                        </p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">3a. Passkey (Biometric) Sign-In</h3>
                        <p className="text-sm mb-3">
                            After your first Google login, you may optionally register a <strong>passkey</strong> — a device-bound biometric credential (Face ID, fingerprint, or PIN). This allows future sign-ins without typing a password.
                        </p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm mb-3">
                            <p className="font-semibold text-slate-800 mb-2">What we store vs. what we never see:</p>
                            <ul className="space-y-1 text-xs text-slate-600">
                                <li><strong>Private key:</strong> Never leaves your device hardware (Secure Enclave / TPM). Synced encrypted by <strong>Google Password Manager</strong> or <strong>iCloud Keychain</strong> — not our servers.</li>
                                <li><strong>Public key:</strong> Stored in our <code className="bg-slate-100 px-1 rounded">pilot_passkeys</code> table. Used only to verify your signature — mathematically useless without the private key.</li>
                                <li><strong>Credential ID:</strong> A reference identifier stored on your device and in our database to look up the correct public key.</li>
                                <li><strong>Sign count:</strong> A replay-attack prevention counter incremented on each authentication.</li>
                            </ul>
                        </div>
                        <p className="text-xs text-slate-500">
                            Passkey registration is optional and can be revoked at any time by contacting <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a>. Even if our database is fully compromised, the public key alone cannot be used to impersonate you — the private key remains in Google's or Apple's encrypted custody.
                        </p>
                    </section>

                    {/* ── SECTION 4 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">4. Third-Party Data Processors</h2>
                        <p className="mb-4 text-sm">We use the following sub-processors. Each processes data only as instructed by us and under their respective data processing obligations.</p>

                        <div className="overflow-x-auto">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-100">
                                        <th className="text-left px-4 py-3 font-semibold text-slate-700 border border-slate-200">Processor</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-700 border border-slate-200">Purpose</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-700 border border-slate-200">Data Transferred</th>
                                        <th className="text-left px-4 py-3 font-semibold text-slate-700 border border-slate-200">Location</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Supabase</td>
                                        <td className="px-4 py-3 border border-slate-200">Database &amp; auth storage</td>
                                        <td className="px-4 py-3 border border-slate-200">Encrypted profile data, activity logs</td>
                                        <td className="px-4 py-3 border border-slate-200">US (AWS)</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Auth0 (Okta)</td>
                                        <td className="px-4 py-3 border border-slate-200">Authentication</td>
                                        <td className="px-4 py-3 border border-slate-200">Email, login credentials</td>
                                        <td className="px-4 py-3 border border-slate-200">US</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Veremark</td>
                                        <td className="px-4 py-3 border border-slate-200">Credential verification</td>
                                        <td className="px-4 py-3 border border-slate-200">Name, licence docs (verification only)</td>
                                        <td className="px-4 py-3 border border-slate-200">UK / Singapore</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Pilot Wallet</td>
                                        <td className="px-4 py-3 border border-slate-200">Verifiable Credential issuance</td>
                                        <td className="px-4 py-3 border border-slate-200">Credential subject data (for VC only)</td>
                                        <td className="px-4 py-3 border border-slate-200">Mauritius / Global CDN</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Stripe</td>
                                        <td className="px-4 py-3 border border-slate-200">Payment processing</td>
                                        <td className="px-4 py-3 border border-slate-200">Payment card data (not stored by us)</td>
                                        <td className="px-4 py-3 border border-slate-200">US</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Resend</td>
                                        <td className="px-4 py-3 border border-slate-200">Transactional email</td>
                                        <td className="px-4 py-3 border border-slate-200">Email address, name</td>
                                        <td className="px-4 py-3 border border-slate-200">US</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Cloudinary</td>
                                        <td className="px-4 py-3 border border-slate-200">Image storage (profile photos)</td>
                                        <td className="px-4 py-3 border border-slate-200">Profile images only</td>
                                        <td className="px-4 py-3 border border-slate-200">US</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Google Password Manager</td>
                                        <td className="px-4 py-3 border border-slate-200">Passkey private key sync (if opted in)</td>
                                        <td className="px-4 py-3 border border-slate-200">Passkey private key only — end-to-end encrypted, never visible to us</td>
                                        <td className="px-4 py-3 border border-slate-200">Google infrastructure</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Apple iCloud Keychain</td>
                                        <td className="px-4 py-3 border border-slate-200">Passkey private key sync on Apple devices (if opted in)</td>
                                        <td className="px-4 py-3 border border-slate-200">Passkey private key only — end-to-end encrypted, never visible to us</td>
                                        <td className="px-4 py-3 border border-slate-200">Apple infrastructure</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>

                        <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg px-4 py-3 text-sm">
                            <strong className="text-yellow-800">Veremark Retention Notice:</strong> When you initiate a verification check, your documents are processed under Veremark's own privacy policy and applicable legal data retention obligations in their operating jurisdictions (UK, Singapore, Philippines). We instruct Veremark to delete documents post-verification; however, Veremark may be subject to their own jurisdictional retention laws which are outside our control. You consent to this limited third-party processing window when you initiate a verification check.
                        </div>
                    </section>

                    {/* ── SECTION 5 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">5. How We Share Your Data</h2>
                        <p className="mb-3 text-sm">We do <strong>not</strong> sell your personal data. We share data only in the following circumstances:</p>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong>With airlines and operators:</strong> Only when you explicitly present a Verifiable Credential or authorise a pathway application. You control every disclosure.</li>
                            <li><strong>With flight schools / ATOs:</strong> Only anonymised aggregate data (e.g., number of pilots interested in a pathway) unless you explicitly grant access.</li>
                            <li><strong>For legal compliance:</strong> If required by law, court order, or government authority. We will notify you where legally permitted to do so.</li>
                            <li><strong>Business transfers:</strong> If PilotRecognition is acquired or merged, your data may transfer to the successor entity under the same privacy protections.</li>
                        </ul>
                    </section>

                    {/* ── SECTION 6 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">6. Data Security</h2>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong>Encryption at rest:</strong> Sensitive credential fields are encrypted using AES-256-GCM with per-pilot keys before reaching our database.</li>
                            <li><strong>Encryption in transit:</strong> All data transmitted between your browser and our servers uses TLS 1.2+.</li>
                            <li><strong>Row-Level Security:</strong> Database access controls ensure pilots can only query their own records.</li>
                            <li><strong>Vault key architecture:</strong> Your encryption key is derived from your Google identity and a server-side secret stored in a hardware-backed secret manager. We cannot decrypt your data without your authenticated session.</li>
                            <li><strong>Verifiable Credentials:</strong> Your actual VCs are stored in your personal Pilot Wallet. We hold only a revocation status entry.</li>
                            <li><strong>Passkey architecture:</strong> If you register a passkey, the private key is stored exclusively in your device hardware and synced end-to-end encrypted by Google or Apple. We store only your public key — a value that can verify your identity but cannot impersonate you. A full compromise of our database would not expose your private key.</li>
                        </ul>
                        <p className="mt-4 text-sm text-slate-500">No system is 100% secure. In the event of a breach affecting your personal data, we will notify you and the relevant supervisory authority within 72 hours of becoming aware, as required under GDPR Article 33.</p>
                    </section>

                    {/* ── SECTION 7 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">7. Data Retention</h2>
                        <ul className="list-disc pl-6 space-y-2 text-sm">
                            <li><strong>Active account data:</strong> Retained while your account is active.</li>
                            <li><strong>Deleted accounts:</strong> All personal data permanently erased within 30 days of account deletion request, except where legal obligations require longer retention.</li>
                            <li><strong>Activity logs:</strong> Retained for 12 months for security purposes, then automatically purged.</li>
                            <li><strong>Credential revocation registry:</strong> Retained indefinitely as a cryptographic audit trail (contains only credential IDs and status — no personal data).</li>
                            <li><strong>Payment records:</strong> Retained for 7 years as required by financial regulations.</li>
                        </ul>
                    </section>

                    {/* ── SECTION 8 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">8. Your Rights</h2>
                        <p className="mb-4 text-sm">Depending on your jurisdiction you have some or all of the following rights:</p>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                            {[
                                { right: 'Right of Access', desc: 'Request a copy of all personal data we hold about you.' },
                                { right: 'Right to Rectification', desc: 'Correct inaccurate or incomplete data.' },
                                { right: 'Right to Erasure', desc: 'Request deletion of your personal data ("right to be forgotten").' },
                                { right: 'Right to Restrict Processing', desc: 'Ask us to pause processing while a dispute is resolved.' },
                                { right: 'Right to Data Portability', desc: 'Receive your data in a machine-readable format.' },
                                { right: 'Right to Object', desc: 'Object to processing based on legitimate interests.' },
                                { right: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time without affecting prior processing.' },
                                { right: 'Right Not to be Profiled', desc: 'Object to automated decision-making that significantly affects you.' },
                            ].map(({ right, desc }) => (
                                <div key={right} className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3">
                                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">{right}</p>
                                    <p className="text-slate-600 text-xs">{desc}</p>
                                </div>
                            ))}
                        </div>
                        <p className="mt-4 text-sm">To exercise any of these rights, email <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a>. We will respond within 30 days. Identity verification may be required.</p>
                    </section>

                    {/* ── SECTION 9 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">9. International Data Transfers</h2>
                        <p className="text-sm mb-3">
                            Our platform serves pilots globally. Your data may be transferred to and processed in countries outside your own, including the United States, United Kingdom, Singapore, and EU member states. Where we transfer data outside the EEA, we rely on Standard Contractual Clauses (SCCs) or adequacy decisions as the legal transfer mechanism.
                        </p>
                        <p className="text-sm">
                            For Philippines-based users: processing by non-Philippines entities is governed by our contractual obligations with each processor and by RA 10173. We take reasonable steps to ensure equivalent protection.
                        </p>
                    </section>

                    {/* ── SECTION 10 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">10. Cookies</h2>
                        <p className="text-sm mb-3">We use strictly necessary cookies for authentication session management and CSRF protection. We do not use third-party advertising cookies. A full Cookie Policy is available at <button onClick={() => onNavigate('cookie-policy')} className="text-blue-600 hover:underline">Cookie Policy</button>.</p>
                    </section>

                    {/* ── SECTION 11 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">11. Children's Privacy</h2>
                        <p className="text-sm">PilotRecognition.com is not directed at children under 16 years of age. We do not knowingly collect personal information from children. If you believe a child has provided us with personal information, contact us at <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a> and we will delete it promptly.</p>
                    </section>

                    {/* ── SECTION 12 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">12. Supervisory Authority Complaints</h2>
                        <p className="text-sm mb-3">If you believe we have processed your data unlawfully, you have the right to lodge a complaint with the relevant supervisory authority:</p>
                        <ul className="list-disc pl-6 space-y-1 text-sm">
                            <li><strong>Philippines:</strong> National Privacy Commission (NPC) — <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">privacy.gov.ph</a></li>
                            <li><strong>EU/EEA:</strong> Your local Data Protection Authority (DPA)</li>
                            <li><strong>UK:</strong> Information Commissioner's Office (ICO) — <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ico.org.uk</a></li>
                            <li><strong>UAE:</strong> UAE Data Office — <a href="https://uaedataoffice.gov.ae" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">uaedataoffice.gov.ae</a></li>
                        </ul>
                        <p className="mt-3 text-sm">We would appreciate the opportunity to address your concern before you contact a regulator. Please email us first at <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a>.</p>
                    </section>

                    {/* ── SECTION 13 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">13. Changes to This Policy</h2>
                        <p className="text-sm">We may update this Privacy Policy from time to time. We will notify you of material changes by email or by a prominent notice on the platform at least 14 days before the change takes effect. Continued use of the platform after the effective date constitutes acceptance of the updated Policy.</p>
                    </section>

                    {/* ── SECTION 15 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">15. Architectural Neutrality &amp; Data Intermediation</h2>
                        <p className="text-xs text-slate-400 mb-4">Protocol Date: May 2026 · Regulatory Baseline: PDPA 2012 (Singapore), Electronic Transactions Act (Cap. 88), Privacy by Design Principles</p>

                        <p className="text-sm mb-4">
                            The Platform operates under a policy of <strong>absolute architectural neutrality</strong>. It does not function as an active data processor or credential-verifying authority. Instead, it serves exclusively as a <strong>stateless digital infrastructure utility</strong> — a passive pipeline designed to securely display aviation metadata without maintaining a centralised proprietary database of sensitive personal identifiers.
                        </p>

                        {/* Pipeline diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 overflow-x-auto">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">The Passive Pipeline Architecture</p>
                            <div className="flex items-center gap-2 text-xs min-w-max">
                                <div className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-center">
                                    <p className="font-bold text-slate-700">The Pilot</p>
                                    <p className="text-slate-500 text-[10px]">Controls account initiation</p>
                                    <p className="text-slate-500 text-[10px]">Inputs self-claimed metadata</p>
                                </div>
                                <div className="text-slate-400 font-bold text-base">→</div>
                                <div className="border-2 border-red-300 rounded-lg px-3 py-2 bg-red-50 text-center">
                                    <p className="font-black text-red-700">Pilot Recognition</p>
                                    <p className="text-red-500 text-[10px] font-semibold">Stateless Render Pipeline</p>
                                </div>
                                <div className="text-slate-400 font-bold text-base">→</div>
                                <div className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-center">
                                    <p className="font-bold text-slate-700">Integration Partners</p>
                                    <p className="text-slate-500 text-[10px]">Authoritative data stores (CAAS)</p>
                                    <p className="text-slate-500 text-[10px]">Independent screening providers</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15a. The Passive Pipeline Specification</h3>
                        <div className="overflow-x-auto mb-5">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Modifying Data', 'The Platform does not write, edit, generate, or alter aviation credentials.'],
                                        ['Risk Attenuation', 'Zero storage of raw credentials, government licence IDs, or logbook records.'],
                                        ['Fault Attribution', 'Liability for validation accuracy rests solely with data-originating sources.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={label} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-40 whitespace-nowrap">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15b. Authentication Isolation</h3>
                        <p className="text-sm mb-3">Account authentication is completely decoupled from Platform infrastructure via Auth0 by Okta. Credentials (passwords and emails) never transit or reside on Platform servers. The Platform's back-end database stores only a non-identifiable, alphanumeric user token string.</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15c. Decentralised Financial Settlement</h3>
                        <p className="text-sm mb-3">All financial transactions are routed via an automated, decentralised split-payment architecture (Helio / MoonPay Commerce). The Platform does not hold pooled client funds, nor does it act as a centralised data reseller or financial custodian. The on-chain transaction log serves as an unalterable audit trail establishing the exact institutional or corporate partner compensated to perform a given verification process.</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15d. Singapore PDPA &amp; ETA Compliance</h3>
                        <p className="text-sm mb-3">Under Section 2(1) of the Personal Data Protection Act 2012 (PDPA), the Platform fulfils the core definitions of a <strong>Data Intermediary</strong>. Its responsibilities are strictly restricted to maintaining appropriate technical safeguards over the active session environment and honouring account deletion workflows within 30 business days.</p>
                        <p className="text-sm mb-3">Pursuant to Singapore's Electronic Transactions Act (Cap. 88), user confirmation via interface checkboxes constitutes execution of valid <strong>electronic assent</strong>, legally equivalent to a physical signature.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 mb-4">
                            <p className="font-semibold text-slate-700 mb-1">Consent Log Data Specification</p>
                            <p><strong>System Metadata:</strong> Timestamp + anonymous Auth0 User ID · <strong>Legal Status:</strong> Non-SPI (Not Sensitive Personal Information) · <strong>Compliance Base:</strong> ETA Cap. 88 Mandated Proof of Authorised Pipeline Activation</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15e. Aviation Authority Disclaimer</h3>
                        <p className="text-sm">The Platform maintains absolute independence from national regulatory bodies. The output generated by independent third-party verification tools within the profile interface is for <strong>informational networking purposes only</strong> and possesses no formal weight as official regulatory documentation. Total liability for licensing authentication remains strictly between the individual aviator and the competent civil aviation authority.</p>
                    </section>

                    {/* ── SECTION 14 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">14. Contact Us</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-sm space-y-2">
                            <p><strong>Data Privacy Contact:</strong> <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a></p>
                            <p><strong>Data Protection Officer:</strong> <a href="/dpo" className="text-blue-600 hover:underline">pilotrecognition.com/dpo</a> — for privacy enquiries, data subject requests, and compliance matters.</p>
                            <p><strong>General Contact:</strong> <a href="mailto:contact@pilotrecognition.com" className="text-blue-600 hover:underline">contact@pilotrecognition.com</a></p>
                            <p><strong>Response time:</strong> Within 30 days of receipt for data subject requests; within 72 hours for breach notifications.</p>
                        </div>
                    </section>

                </div>
            </div>
        </div>
    );
}
