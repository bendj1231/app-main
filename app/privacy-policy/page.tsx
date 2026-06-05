import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface PrivacyPolicyPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
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
                <p className="text-sm text-slate-500 mb-2">Last updated: 02 June 2026</p>
                <p className="text-sm text-slate-500 mb-10">Effective date: 02 June 2026</p>

                <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 mb-10">
                    <p className="text-sm text-slate-700 leading-relaxed">
                        This Privacy Policy explains how <strong>PilotRecognition.com</strong> collects, uses, stores, and protects your personal information. It applies to all users of our platform, including pilots, aviation professionals, flight school administrators, and airline operators. By using PilotRecognition.com you agree to this Policy in full.
                    </p>
                </div>

                <div className="bg-amber-50 border border-amber-200 rounded-2xl p-6 mb-10">
                    <p className="text-xs text-amber-800 leading-relaxed">
                        <strong>Entity Disclosure:</strong> PilotRecognition.com is operated by <strong>Benjamin Bowler</strong> as Non-Executive Director and Sole Shareholder, pending incorporation of <strong>Aviation Pathways Ltd</strong> in the Republic of Mauritius. <strong>Marie Maureen Synthia Maya</strong> serves as Managing Director. The platform has not yet commenced user data processing. Aviation Pathways Ltd has applied for registration as a Data Controller with the Data Protection Office, Republic of Mauritius under the Data Protection Act 2017. Benjamin Bowler serves as the registered contact person for data protection matters. An independent Data Protection Officer under GDPR Article 37 will be appointed prior to processing personal data of data subjects within the European Economic Area at scale.
                    </p>
                </div>

                <div className="space-y-10 text-slate-700">

                    {/* ── SECTION 1 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">1. Who We Are — Data Controller vs. Data Owner</h2>
                        <p className="mb-3">
                            <strong>Aviation Pathways Ltd</strong> (pending incorporation, Republic of Mauritius) operates PilotRecognition.com. <strong>Benjamin Bowler</strong> serves as Non-Executive Director, Sole Shareholder, and registered contact person for data protection matters. <strong>Marie Maureen Synthia Maya</strong> serves as Managing Director. The Company has applied for registration as a Data Controller with the Data Protection Office, Republic of Mauritius under the Data Protection Act 2017. The platform has not yet commenced user data processing.
                        </p>
                        <div className="bg-indigo-50 border border-indigo-200 rounded-xl px-5 py-4 mb-4 text-sm">
                            <p className="font-semibold text-indigo-900 mb-2">Two distinct roles — both matter:</p>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div className="bg-white rounded-lg px-4 py-3 border border-indigo-100">
                                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">We are the Gateway Controller</p>
                                    <p className="text-slate-600 text-xs">We provide the technical infrastructure that routes your data to appropriate third-party processors. We store only platform preferences, verification ticket stubs (binary status, check ID, timestamp), and subscription metadata. We do NOT store your email, phone number, password, raw identity documents, medical certificates, or flight logs — these are held by Auth0, Veremark, Stripe, and your Logbook Provider respectively.</p>
                                </div>
                                <div className="bg-white rounded-lg px-4 py-3 border border-indigo-100">
                                    <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">You are the Data Owner</p>
                                    <p className="text-slate-600 text-xs">You decide what to share, with whom, and when. Your Verifiable Credentials live in your own wallet. Your sensitive identity documents are sent directly to your chosen verifier (Veremark) — we never see them. You can delete your account and personal data at any time, except where legal obligations require retention (e.g., consent records, payment history).</p>
                                </div>
                            </div>
                            <p className="text-xs text-indigo-700 mt-3">We control the gateway. You own the data. Third-party specialists handle the sensitive content. All three are true simultaneously.</p>
                        </div>
                        <p className="mb-3 text-sm">
                            <strong>Contact for data matters:</strong> <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a>
                        </p>
                        <p className="text-sm text-slate-500">
                            An independent Data Protection Officer under GDPR Article 37 will be appointed prior to processing personal data of data subjects within the European Economic Area at scale.
                        </p>
                    </section>

                    {/* ── SECTION 2 ── */}
                    <section>
                        <h2 className="text-xl font-bold text-slate-900 mb-4 pb-2 border-b border-slate-200">2. What Data We Collect and Why</h2>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2a. Account &amp; Identity Data</h3>
                        <p className="text-sm mb-3"><strong>Held by Auth0 (not PilotRecognition):</strong> Email address, password, phone number, 2FA secrets, session tokens. Auth0 encrypts this data at rest and in transit. PilotRecognition stores only your stable Auth0 user identifier (UUID) — we never see your password, email, or phone number.</p>
                        <p className="text-sm mb-3"><strong>Held by PilotRecognition:</strong> Voluntary display name, optional bio/profile description, optional profile photo, country of residence (for pathway matching), and platform preferences (settings, bookmarks).</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Display name (voluntary, user-provided)</li>
                            <li>Profile photo (optional)</li>
                            <li>Country of residence (for regional pathway matching)</li>
                            <li>Auth0 user ID reference (UUID only)</li>
                        </ul>
                        <p className="text-sm mb-4"><strong>Legal basis:</strong> Contract performance (account creation); Legitimate interest (platform security).</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2b. Aviation Credential Data</h3>
                        <p className="text-sm mb-3"><strong>Held by Veremark (not PilotRecognition):</strong> Raw passport scans, pilot licence scans, medical certificate scans, radio licence scans, employment verification documents. These are uploaded directly to Veremark's encrypted infrastructure. Veremark sends the full detailed verification receipt directly to your email. PilotRecognition never sees, stores, or processes these raw documents.</p>
                        <p className="text-sm mb-3"><strong>Held by Logbook Provider (not PilotRecognition):</strong> Total flight hours, aircraft ratings, type ratings, flight logs, ADS-B telemetry. PilotRecognition routes to your chosen Logbook Provider but does not store raw flight data.</p>
                        <p className="text-sm mb-3"><strong>Held by PilotRecognition:</strong> Minimal structured verification outcomes (status: verified/pending/expired, check ID, timestamp) received from Veremark via webhook. These are used solely to issue your Verifiable Credential access ticket and enable pathway matching.</p>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Verification status (verified / pending / expired)</li>
                            <li>Check ID reference (from Veremark)</li>
                            <li>Timestamp of verification completion</li>
                            <li>Cryptographically signed Verifiable Credential (for wallet issuance)</li>
                        </ul>
                        <p className="text-sm mb-4"><strong>Legal basis:</strong> Explicit consent (you initiate verification voluntarily; the platform only stores the binary outcome).</p>
                        <p className="text-sm mb-4 bg-emerald-50 border border-emerald-200 rounded-lg px-4 py-3">
                            <strong>Data Minimization Notice:</strong> PilotRecognition practices data minimization by design. We do not store your licence number, medical class, date of birth, or contact number. These remain with Auth0 (identity), Veremark (verification), or your Logbook Provider (flight data). The platform stores only: (a) platform preferences, (b) verification ticket stubs, (c) subscription metadata, and (d) your Auth0 UUID reference.
                        </p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-4">2c. Verifiable Credential Data</h3>
                        <ul className="list-disc pl-6 space-y-1 mb-4 text-sm">
                            <li>Cryptographically signed Verifiable Credentials (VCs) issued by the platform under <code>did:web:pilotrecognition.com</code></li>
                            <li>Minimal structured verification outcomes (status, check ID, timestamp only)</li>
                            <li>Credential status (active, revoked, expired)</li>
                            <li>Revocation registry entries</li>
                        </ul>
                        <p className="text-sm mb-4">The platform issues and stores cryptographically signed VCs as digital access tickets. These VCs are delivered to your personal Pilot Wallet and retained server-side as signed records for pathway gating and revocation purposes. The platform does not store raw verification documents or detailed receipts — only the signed VC and minimal verification outcome data (status, check ID, timestamp).</p>
                        <p className="text-sm mb-4 bg-amber-50 border border-amber-200 rounded-lg px-4 py-3">
                            <strong>Verification Receipt Notice:</strong> When you use a third-party verifier (e.g., Veremark), the verifier sends you a <strong>full detailed verification receipt</strong> directly to your email (containing PEL numbers, medical dates, license classes, examiner names, logbook audit details, etc.). The platform does <strong>not</strong> receive, view, or store this detailed receipt. We only receive a minimal structured outcome via webhook (status, check ID, timestamp) to issue your access credential.
                        </p>

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
                                        <td className="px-4 py-3 border border-slate-200">Primary database &amp; auth storage</td>
                                        <td className="px-4 py-3 border border-slate-200">Encrypted profile data, activity logs, signed VC records</td>
                                        <td className="px-4 py-3 border border-slate-200">Australia (Sydney, ap-southeast-2)</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Neon PostgreSQL</td>
                                        <td className="px-4 py-3 border border-slate-200">OEM data, pathway cards, IPFS CID index</td>
                                        <td className="px-4 py-3 border border-slate-200">Anonymised pathway data, IPFS references</td>
                                        <td className="px-4 py-3 border border-slate-200">Singapore (ap-southeast-1)</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">MongoDB Atlas</td>
                                        <td className="px-4 py-3 border border-slate-200">Raw aviation API payloads, flight telemetry, logbook JSON</td>
                                        <td className="px-4 py-3 border border-slate-200">Aviation API data, telemetry records</td>
                                        <td className="px-4 py-3 border border-slate-200">Singapore (ap-southeast-1)</td>
                                    </tr>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Auth0 (Okta)</td>
                                        <td className="px-4 py-3 border border-slate-200">Authentication</td>
                                        <td className="px-4 py-3 border border-slate-200">Email, login credentials</td>
                                        <td className="px-4 py-3 border border-slate-200">US</td>
                                    </tr>
                                    <tr>
                                        <td className="px-4 py-3 border border-slate-200 font-medium">Veremark Ltd.</td>
                                        <td className="px-4 py-3 border border-slate-200">Credential verification</td>
                                        <td className="px-4 py-3 border border-slate-200">User uploads docs directly to Veremark. Veremark sends full detailed receipt to user's email. Platform receives only minimal structured outcome (status, check ID, timestamp).</td>
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
                            <li><strong>Encryption at rest:</strong> Sensitive credential fields are encrypted using AES-256-GCM before storage in our databases.</li>
                            <li><strong>Encryption in transit:</strong> All data transmitted between your browser and our servers uses TLS 1.3.</li>
                            <li><strong>Row-Level Security:</strong> Database access controls ensure pilots can only query their own records via authenticated sessions.</li>
                            <li><strong>Vault key architecture:</strong> Your encryption key is derived from your Google identity and a server-side secret. Platform administrators cannot decrypt your data without your authenticated session.</li>
                            <li><strong>Verifiable Credentials:</strong> Your VCs are stored in your personal Pilot Wallet and retained server-side as signed records for revocation and pathway gating.</li>
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
                            <li><strong>Mauritius (primary jurisdiction):</strong> Data Protection Office of the Republic of Mauritius — Phone: (230) 210 3434 · Email: dpo@govmu.org · Website: dataprotection.govmu.org</li>
                            <li><strong>Philippines:</strong> National Privacy Commission (NPC) — <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">privacy.gov.ph</a></li>
                            <li><strong>EU/EEA:</strong> Your local Data Protection Authority (DPA)</li>
                            <li><strong>UK:</strong> Information Commissioner's Office (ICO) — <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">ico.org.uk</a></li>
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
                        <p className="text-xs text-slate-400 mb-4">Protocol Date: June 2026 · Regulatory Baseline: Mauritius Data Protection Act 2017, Electronic Transactions Act 2000, Privacy by Design Principles</p>

                        <p className="text-sm mb-4">
                            The Platform serves as the <strong>Data Controller</strong> for all personal data processed through its infrastructure. It maintains appropriate technical and organisational safeguards to protect user data while routing verification requests to third-party providers and issuing cryptographically signed Verifiable Credentials (VCs) as digital access tickets.
                        </p>

                        {/* Pipeline diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 overflow-x-auto">
                            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">Data Flow Architecture</p>
                            <div className="flex items-center gap-2 text-xs min-w-max">
                                <div className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-center">
                                    <p className="font-bold text-slate-700">The Pilot</p>
                                    <p className="text-slate-500 text-[10px]">Controls account initiation</p>
                                    <p className="text-slate-500 text-[10px]">Inputs profile metadata</p>
                                </div>
                                <div className="text-slate-400 font-bold text-base">→</div>
                                <div className="border-2 border-indigo-300 rounded-lg px-3 py-2 bg-indigo-50 text-center">
                                    <p className="font-black text-indigo-700">Pilot Recognition</p>
                                    <p className="text-indigo-500 text-[10px] font-semibold">Data Controller & VC Issuer</p>
                                </div>
                                <div className="text-slate-400 font-bold text-base">→</div>
                                <div className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-center">
                                    <p className="font-bold text-slate-700">Third-Party Verifiers</p>
                                    <p className="text-slate-500 text-[10px]">Independent verification providers</p>
                                    <p className="text-slate-500 text-[10px]">Data Issuers (CAAP, EASA, FAA)</p>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15a. Platform Data Processing Specification</h3>
                        <div className="overflow-x-auto mb-5">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Credential Issuance', 'The Platform generates cryptographically signed W3C Verifiable Credentials (VCs) under did:web:pilotrecognition.com based on minimal structured verification outcomes received from third-party verifiers.'],
                                        ['Data Routing', 'Raw credential documents uploaded by users are forwarded directly to the chosen third-party verifier and deleted from Platform infrastructure within 24 hours. The Platform does not retain raw documents.'],
                                        ['Verification Outcomes', 'The Platform receives only minimal structured data from verifiers (status, check ID, timestamp) — not detailed receipts. Full detailed receipts are sent directly to the user\'s email by the verifier.'],
                                        ['Fault Attribution', 'Liability for verification accuracy rests with the independent third-party verifier and the data-issuing aviation authority.'],
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
                        <p className="text-sm mb-3">Account authentication is managed by Auth0 by Okta. User passwords never transit or reside on Platform servers. The Platform's database stores only the Auth0 user identifier token.</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15c. Payment Processing</h3>
                        <p className="text-sm mb-3">Payment processing is handled by Stripe. The Platform does not store card numbers or bank details. We retain only transaction IDs, amounts, and subscription status for accounting and customer support purposes.</p>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15d. Mauritius Data Protection Act 2017 Compliance</h3>
                        <p className="text-sm mb-3">Benjamin Bowler, pending incorporation of Aviation Pathways Ltd in the Republic of Mauritius, is subject to the <strong>Data Protection Act 2017</strong> and shall apply for registration as a Data Controller with the Data Protection Office of Mauritius within 14 days of CBRD issuance of the Certificate of Incorporation.</p>
                        <p className="text-sm mb-3">User confirmation via interface checkboxes constitutes valid <strong>electronic consent</strong> under the Mauritius Electronic Transactions Act 2000, legally equivalent to a physical signature for contractual purposes.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-xs text-slate-600 mb-4">
                            <p className="font-semibold text-slate-700 mb-1">Consent Log Data Specification</p>
                            <p><strong>System Metadata:</strong> Timestamp + anonymous Auth0 User ID · <strong>Legal Status:</strong> Processing record under Mauritius Data Protection Act 2017 · <strong>Retention:</strong> Consent timestamps retained for legal compliance even after account deletion</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">15e. Aviation Authority Disclaimer</h3>
                        <p className="text-sm">The Platform maintains independence from national regulatory bodies. The output generated by independent third-party verification tools within the profile interface is for <strong>informational and pathway-matching purposes only</strong> and does not constitute official regulatory documentation. Total liability for licensing authentication remains strictly between the individual aviator and the competent civil aviation authority.</p>
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
