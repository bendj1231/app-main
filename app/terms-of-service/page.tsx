import React, { useState, useEffect } from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft } from 'lucide-react';

interface TermsOfServicePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

interface JurisdictionInfo {
    country: string;
    countryCode: string;
    governingLaw: string;
    dataAuthority: string;
    electronicConsentLaw: string;
    aviationAuthority: string;
    privacyFramework: string;
}

const JURISDICTION_MAP: Record<string, JurisdictionInfo> = {
    PH: { country: 'the Philippines', countryCode: 'PH', governingLaw: 'the Civil Code of the Philippines and the Data Privacy Act of 2012 (R.A. 10173)', dataAuthority: 'National Privacy Commission (NPC)', electronicConsentLaw: 'Electronic Commerce Act (R.A. 8792)', aviationAuthority: 'Civil Aviation Authority of the Philippines (CAAP)', privacyFramework: 'Data Privacy Act of 2012' },
    US: { country: 'the United States', countryCode: 'US', governingLaw: 'applicable federal law and the laws of the state of California, including the California Consumer Privacy Act (CCPA)', dataAuthority: 'Federal Trade Commission (FTC) and applicable state regulators', electronicConsentLaw: 'Electronic Signatures in Global and National Commerce Act (E-SIGN Act)', aviationAuthority: 'Federal Aviation Administration (FAA)', privacyFramework: 'CCPA / Federal privacy regulations' },
    GB: { country: 'the United Kingdom', countryCode: 'GB', governingLaw: 'the laws of England and Wales, including the UK GDPR and Data Protection Act 2018', dataAuthority: 'Information Commissioner\'s Office (ICO)', electronicConsentLaw: 'Electronic Communications Act 2000', aviationAuthority: 'Civil Aviation Authority (CAA UK)', privacyFramework: 'UK GDPR / Data Protection Act 2018' },
    AU: { country: 'Australia', countryCode: 'AU', governingLaw: 'the laws of the Commonwealth of Australia, including the Privacy Act 1988 and Australian Privacy Principles (APPs)', dataAuthority: 'Office of the Australian Information Commissioner (OAIC)', electronicConsentLaw: 'Electronic Transactions Act 1999', aviationAuthority: 'Civil Aviation Safety Authority (CASA)', privacyFramework: 'Privacy Act 1988 / Australian Privacy Principles' },
    AE: { country: 'the United Arab Emirates', countryCode: 'AE', governingLaw: 'the laws of the UAE, including Federal Decree-Law No. 45 of 2021 on Personal Data Protection', dataAuthority: 'UAE Data Office', electronicConsentLaw: 'Federal Decree-Law No. 46 of 2021 on Electronic Transactions', aviationAuthority: 'General Civil Aviation Authority (GCAA)', privacyFramework: 'UAE Personal Data Protection Law (PDPL)' },
    SG: { country: 'Singapore', countryCode: 'SG', governingLaw: 'the laws of the Republic of Singapore, including the Personal Data Protection Act 2012 (PDPA)', dataAuthority: 'Personal Data Protection Commission (PDPC)', electronicConsentLaw: 'Electronic Transactions Act (Cap. 88)', aviationAuthority: 'Civil Aviation Authority of Singapore (CAAS)', privacyFramework: 'Personal Data Protection Act 2012 (PDPA)' },
    DE: { country: 'Germany', countryCode: 'DE', governingLaw: 'the laws of Germany and the European Union, including the General Data Protection Regulation (GDPR) and the Bundesdatenschutzgesetz (BDSG)', dataAuthority: 'Federal Commissioner for Data Protection and Freedom of Information (BfDI)', electronicConsentLaw: 'eIDAS Regulation (EU) No 910/2014', aviationAuthority: 'Luftfahrt-Bundesamt (LBA) / EASA', privacyFramework: 'GDPR / BDSG' },
    FR: { country: 'France', countryCode: 'FR', governingLaw: 'the laws of France and the European Union, including the General Data Protection Regulation (GDPR) and the French Data Protection Act (Loi Informatique et Libertés)', dataAuthority: 'Commission Nationale de l\'Informatique et des Libertés (CNIL)', electronicConsentLaw: 'eIDAS Regulation (EU) No 910/2014', aviationAuthority: 'Direction Générale de l\'Aviation Civile (DGAC) / EASA', privacyFramework: 'GDPR / French Data Protection Act' },
    CA: { country: 'Canada', countryCode: 'CA', governingLaw: 'the laws of Canada, including the Personal Information Protection and Electronic Documents Act (PIPEDA) and applicable provincial privacy laws', dataAuthority: 'Office of the Privacy Commissioner of Canada (OPC)', electronicConsentLaw: 'Electronic Commerce Protection Act (FISA / CASL framework)', aviationAuthority: 'Transport Canada Civil Aviation (TCCA)', privacyFramework: 'PIPEDA / Bill C-27 (CPPA)' },
    IN: { country: 'India', countryCode: 'IN', governingLaw: 'the laws of India, including the Information Technology Act 2000 and the Digital Personal Data Protection Act 2023 (DPDPA)', dataAuthority: 'Data Protection Board of India', electronicConsentLaw: 'Information Technology Act 2000 (Section 10A)', aviationAuthority: 'Directorate General of Civil Aviation (DGCA)', privacyFramework: 'Digital Personal Data Protection Act 2023' },
    NZ: { country: 'New Zealand', countryCode: 'NZ', governingLaw: 'the laws of New Zealand, including the Privacy Act 2020', dataAuthority: 'Office of the Privacy Commissioner (OPC NZ)', electronicConsentLaw: 'Contract and Commercial Law Act 2017', aviationAuthority: 'Civil Aviation Authority of New Zealand (CAA NZ)', privacyFramework: 'Privacy Act 2020' },
};

const DEFAULT_JURISDICTION: JurisdictionInfo = {
    country: 'your jurisdiction',
    countryCode: 'INT',
    governingLaw: 'applicable international law and the laws of the Republic of the Philippines as the platform\'s country of development',
    dataAuthority: 'your regional data protection authority',
    electronicConsentLaw: 'applicable electronic commerce and digital signature legislation in your jurisdiction',
    aviationAuthority: 'your regional Civil Aviation Authority (CAA)',
    privacyFramework: 'applicable regional data protection regulations',
};

function getJurisdiction(countryCode: string): JurisdictionInfo {
    return JURISDICTION_MAP[countryCode.toUpperCase()] || DEFAULT_JURISDICTION;
}

export default function TermsOfServicePage({ onBack, onNavigate, onLogin }: TermsOfServicePageProps) {
    const [jurisdiction, setJurisdiction] = useState<JurisdictionInfo>(DEFAULT_JURISDICTION);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('https://ipapi.co/json/')
            .then((r) => r.json())
            .then((data) => {
                if (data?.country_code) {
                    setJurisdiction(getJurisdiction(data.country_code));
                }
            })
            .catch(() => {})
            .finally(() => setLoading(false));
    }, []);

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

                <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                    Terms of Service and Privacy Agreement
                </h1>
                <p className="text-sm text-slate-500 mb-2">Last updated: May 18, 2026</p>
                {!loading && (
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-8">
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Jurisdiction detected:</span>
                        <span className="text-blue-800 text-sm font-semibold">{jurisdiction.country}</span>
                        <span className="text-blue-400 text-xs">— {jurisdiction.privacyFramework}</span>
                    </div>
                )}

                <div className="space-y-8 text-slate-700">
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Agreement Between Private Individuals</h2>
                        <p className="mb-4">
                            This Agreement is entered into by and between <strong>Karl Brian Vogt</strong> and <strong>Andrew Bowler</strong> (collectively, "the Developers") and you ("the User"). By creating an account on pilotrecognition.com, you explicitly agree to the following terms. We operate as individual developers, not through a registered corporation or business entity.
                        </p>
                        <p className="mb-4">
                            <strong>Pre-Registration Operating Status:</strong> pilotrecognition.com is currently operating in an alpha/sandbox phase as an unincorporated development project between two private individuals. No formal business entity has been registered in connection with this platform at this stage of development. This is a standard and legally recognized operational posture for early-stage technology projects. By using this platform during this phase, you acknowledge and accept this status.
                        </p>
                        <p className="mb-4">
                            <strong>Payment Processing:</strong> All payments processed through this platform are handled via Helio (MoonPay Commerce), a third-party decentralized payment gateway. Payments are received directly into the Developers' connected wallets and are automatically split on-chain at the moment of transaction clearance to the designated integration partners. Because payments are processed via a decentralized gateway and not through a traditional corporate bank account, no formal merchant registration is required at this operational stage.
                        </p>
                        <p className="mb-4">
                            <strong>Formalization Triggers:</strong> The Developers commit to formalizing the platform's business structure — either through an existing entity (AJBowler Consult) or a newly registered business — upon reaching any of the following milestones: (a) the platform's payment gateway requires merchant KYC verification; (b) cumulative platform revenue exceeds $1,000 USD; or (c) a formal partnership or enterprise contract is executed with a third party. Until such a trigger is reached, this Agreement constitutes a valid, binding, person-to-person contract under applicable electronic commerce legislation.
                        </p>
                        <p>
                            <strong>Technical Risk Profile:</strong> Because the platform is architected as a stateless, client-side rendering interface with no central credential database, the technical risk profile of this pre-registration phase is near-zero. No raw pilot credentials, license documents, or sensitive identifiers are stored on platform infrastructure. User authentication is managed entirely by Auth0 (Okta), and profile data is stored in Supabase under standard security tiers. The absence of a proprietary data store means there is no central repository for unauthorized access during this phase.
                        </p>
                    </section>

                    <section>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-2">
                            <p className="text-blue-700 text-xs font-bold uppercase tracking-wider mb-1">Platform Classification</p>
                            <p className="text-blue-900 font-semibold text-sm">Neutral Data Infrastructure Provider — Passive Pipeline / Mere Conduit (Not a Controller or Processor)</p>
                        </div>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">0. Neutral &amp; Stateless Platform Status</h2>
                        <p className="mb-4">
                            Pilot Recognition operates exclusively as a <strong>neutral data infrastructure provider</strong> — a passive pipeline and mere conduit. This platform is not a data controller and not a data processor under any applicable data privacy framework. It functions solely as a read-only display interface that renders data originating entirely from the User, approved Aviation Training Organisations (ATOs), regional civil aviation authorities, and independent verification providers. Data ownership and control sit exclusively with the pilot and the integration partners responsible for each respective data stream.
                        </p>
                        <p className="mb-4">
                            <strong>We do not generate, write, edit, modify, or store pilot credentials, license data, logbook entries, or aviation records of any kind.</strong> All metrics, scores, and profile data displayed on this platform are rendered client-side, sourced read-only from the User's own declared inputs or from connected third-party provider data streams.
                        </p>
                        <p className="mb-4">
                            Under this classification, Pilot Recognition is legally analogous to a <em>passive pipeline</em> or neutral conduit. As the platform does not originate or alter any underlying data, liability for data accuracy, credential validity, and verification outcomes rests exclusively with the data-originating parties: the User, the relevant aviation authority, and the independent verification provider.
                        </p>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-4">
                            <p className="text-amber-800 text-xs font-bold uppercase tracking-wider mb-2">Important Legal Clarification</p>
                            <p className="text-amber-900 text-sm leading-relaxed">
                                Infrastructure classification does <strong>not</strong> exempt Pilot Recognition from the applicability of data privacy laws. No technology platform that handles personal identifiers is completely immune from legislation such as the Philippines Data Privacy Act of 2012 (RA 10173), the GDPR, or equivalent regional frameworks. However, operating strictly as a neutral data infrastructure provider — without owning, storing, editing, or making decisions about data — <strong>removes Pilot Recognition from the legal definitions of both a data controller and a data processor</strong>, reducing direct legal liability to near-zero. The burden of data compliance sits on the two active bookends of the pipeline: the Pilot (who controls the input) and the integration Partners (who control the verification and storage).
                            </p>
                        </div>

                        <p className="mb-4">
                            <strong>Processing Environment Responsibility:</strong> Under applicable data privacy legislation, the term "processing" includes any operation performed on personal data, including retrieval, consultation, and browser-side display. Because Pilot Recognition's frontend code reaches out to authentication and database providers, decodes tokens, and renders pilot profile data within the browser, the platform executes a <em>data processing event</em> as defined by law. As operators of the domain where this processing occurs, the Developers are responsible for maintaining a secure processing environment even though no raw data is stored on Pilot Recognition's own servers.
                        </p>
                        <p className="mb-4">
                            <strong>Privacy by Design — Compliance by Architecture:</strong> By building a stateless application that refuses to store or retain raw pilot credentials, Pilot Recognition satisfies the highest tier of data security mandated by applicable privacy frameworks. The absence of a central data repository eliminates the risk of a server-side data breach, which constitutes the most common and most severe form of data privacy violation. This architectural choice is not merely a technical decision — it is an active, documented compliance measure under the Privacy by Design principle recognized across all major data protection frameworks.
                        </p>
                        <p className="mb-4">
                            <strong>Transfer of Fault:</strong> By explicitly stating that data ownership and control sit with the pilot and the originating integration partners, any legal dispute regarding incorrect credentials, flight hours, or background check outcomes is automatically directed to the data-originating source network — not to Pilot Recognition as the neutral display interface. The platform's role is limited to rendering what those source networks provide.
                        </p>
                        <p className="mb-4">
                            <strong>Dispute Resolution — Consultation Fee:</strong> Any formal dispute, complaint, or data challenge directed at Pilot Recognition is subject to a <strong>non-refundable $500 USD consultation fee</strong> payable prior to any third-party redirection, investigation initiation, or formal response. This fee reflects the cost of neutral infrastructure review and does not constitute an admission of liability. By using this platform, you explicitly acknowledge and agree to this dispute resolution condition.
                        </p>
                        <p>
                            This neutral status is explicitly asserted on the platform interface and constitutes part of the binding agreement between the User and the Developers upon account creation or use of any platform feature.
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
                            <strong>Third-Party Verification Disclaimer:</strong> pilotrecognition.com does not collect or store official government license documents or sensitive identification numbers on its own servers. Professional credential verification is securely offloaded to an independent, third-party screening provider. By initiating a verification check, you consent to sharing your basic contact information with the verification provider to process your credentials. Verified achievements are managed via your independent credential wallet.
                        </p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. Data Collection and Purpose</h2>
                        <p className="mb-4">The Developers collect the following data solely to create and display your pilot profile on this platform:</p>
                        <ul className="list-disc pl-6 space-y-2">
                            <li>Your anonymous User ID (provided via JWT token from Auth0)</li>
                            <li>Your estimated total flight hours (user-declared metadata)</li>
                            <li>Your general license ratings and type ratings (user-declared)</li>
                            <li>Your pathway interests and program preferences</li>
                        </ul>
                        <p className="mt-4">We do <strong>not</strong> collect, store, or process your email address, password, or any login credentials. We do <strong>not</strong> collect, store, or verify official government-issued license numbers, medical certificate numbers, logbook serial numbers, or any other sensitive personal identification data. Legal authentication of all certifications remains strictly between the user, the relevant aviation Data Issuer, and authorized third-party verification providers. We do not collect passport data, financial account details, or any information not directly related to your pilot profile display.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. Data Storage and Security</h2>
                        <p>Your profile data (anonymous User ID and estimated flight hours) is stored securely in our Supabase database. Your login credentials (email and password) are stored exclusively by Auth0, Inc. While the Developers implement standard digital security measures, you acknowledge that no online database is 100% secure against unauthorized breaches. We are personally responsible for the protection of your profile data as Joint Personal Information Controllers under {jurisdiction.privacyFramework}. Auth0 is solely responsible for the security of your authentication credentials.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Account Deletion and Data Retention</h2>
                        <p>You retain the right to delete your profile at any time. Upon your request or account deletion, the Developers will permanently erase your email, license information, flight hours, and all associated personal data from the active database within 30 days, in accordance with {jurisdiction.privacyFramework}. Your consent timestamp (recorded at account creation) serves as legal proof of when you accepted these terms.</p>
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
                        <p>Under the <strong>{jurisdiction.electronicConsentLaw}</strong>, clicking the "I Agree" checkbox or button during signup is legally binding — equivalent to signing a paper contract with a pen. We record a timestamp in our database at the moment you create your account, which serves as legal proof that you accepted these terms on that specific date and time. This consent mechanism complies with electronic signature legislation applicable in {jurisdiction.country}.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Aviation Authority & Credential Standards</h2>
                        <p>For users located in {jurisdiction.country}, the relevant aviation regulatory authority is the <strong>{jurisdiction.aviationAuthority}</strong>. All credential verification workflows on this platform are designed to align with the licensing standards and frameworks administered by this authority. Pilot Recognition does not represent, act on behalf of, or hold any formal relationship with this authority. Verification results are for informational purposes only and do not constitute official regulatory recognition.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. Intellectual Property</h2>
                        <p>All content, features, and functionality of the PilotRecognition platform are owned by the Developers and are protected by international copyright, trademark, and other intellectual property laws.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Limitation of Liability</h2>
                        <p>This website is a private project provided "as-is" without any warranties. The Developers are not liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of the platform, including data leaks, server downtimes, or inaccuracies in user-declared flight hours. Liability is limited to the maximum extent permitted under {jurisdiction.privacyFramework}.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Termination</h2>
                        <p>We reserve the right to terminate or suspend your account at any time for violation of these Terms of Service or for any other reason at our sole discretion.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Governing Law</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Detected Jurisdiction</p>
                            <p className="text-slate-900 font-semibold">{jurisdiction.country}</p>
                        </div>
                        <p className="mb-4">These Terms of Service shall be governed by and construed in accordance with <strong>{jurisdiction.governingLaw}</strong>.</p>
                        <p className="mb-4">Data protection rights and complaints may be directed to the <strong>{jurisdiction.dataAuthority}</strong> in your jurisdiction.</p>
                        <p className="text-sm text-slate-500">Note: Regardless of your detected location, these terms are drafted in alignment with the platform's country of development (Republic of the Philippines) and comply with internationally recognized data protection principles including GDPR-equivalent standards.</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Payment Processing, Anti-Money Laundering &amp; Fee Distribution</h2>
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
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">15. Contact Us</h2>
                        <p>If you have any questions about these Terms of Service, please contact us at:</p>
                        <p className="mt-2">legal@pilotrecognition.com</p>
                    </section>
                </div>
            </div>
        </div>
    );
}
