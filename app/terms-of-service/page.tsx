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
    governingLaw: 'the laws of the Republic of Singapore, including the Personal Data Protection Act 2012 (PDPA)',
    dataAuthority: 'Personal Data Protection Commission (PDPC) of Singapore',
    electronicConsentLaw: 'Electronic Transactions Act (Cap. 88)',
    aviationAuthority: 'your regional Civil Aviation Authority (CAA)',
    privacyFramework: 'Singapore PDPA 2012 (primary) / applicable regional data protection regulations',
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
            {/* Coded by Benjamin Bowler */}
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
                <p className="text-sm text-slate-500 mb-2">Last updated: May 21, 2026</p>
                <p className="text-sm text-slate-500 mb-1">Governing Jurisdiction: Republic of Singapore</p>
                <p className="text-sm text-slate-500 mb-1">Statutory Baseline: Personal Data Protection Act 2012 (PDPA) · Electronic Transactions Act (Cap. 88)</p>
                {!loading && (
                    <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-300 rounded-lg px-4 py-2 mb-8">
                        <span className="text-slate-500 text-xs font-bold uppercase tracking-wider">Active Regulatory Module:</span>
                        <span className="text-slate-800 text-sm font-semibold">{jurisdiction.country}</span>
                        <span className="text-slate-500 text-xs">— {jurisdiction.privacyFramework}</span>
                    </div>
                )}

                <div className="space-y-8 text-slate-700">
                    {/* ── PREAMBLE ── */}
                    <section>
                        <div className="bg-slate-900 text-white rounded-xl p-5 mb-6">
                            <p className="text-red-400 text-xs font-black uppercase tracking-wider mb-1">Platform Classification</p>
                            <p className="font-bold text-base mb-1">Client-Side Cryptographic Container Orchestrator · Multi-Engine Infrastructure Provider · Neutral Technical Intermediary</p>
                            <p className="text-slate-300 text-xs leading-relaxed mb-2">Controls the processing environment and access permission matrices. Does not control or own data content (credentials, verification outcomes, logbook records). Verified Credential Tokens are issued into the User's client-side decentralized container — not stored on platform servers.</p>
                            <p className="text-slate-400 text-xs"><span className="text-slate-300 font-semibold">THE ISOLATION MANDATE:</span> The Platform Operator controls the processing environment and access permission matrices only. It does not control, manage, or own the underlying data content (including but not limited to credentials, verification outcomes, or logbook records). All verified tokens are issued directly into the User's sovereign client-side decentralized container and remain structurally inaccessible to the Platform Operator at the server layer.</p>
                        </div>
                        <p className="mb-4 text-sm">
                            This Terms of Service and Privacy Agreement (“Agreement”) defines the architecture, data ownership parameters, and system boundary constraints of the web venue and software wires operating at pilotrecognition.com (collectively designated as “the Platform”). By executing an account creation sequence and checking the designated assent box, you explicitly execute an unalterable electronic signature, bound by the provisions herein.
                        </p>
                        <p className="mb-3 text-sm"><strong>The Platform Neutrality Guarantee:</strong> The Platform Operator does not adjudicate, verify, interpret, or validate the content of the data transactions routing through its conduits. It merely provides the secure cryptographic infrastructure through which independent third-party verification partners authenticate and issue credential tokens. Every verification outcome is the exclusive, autonomous product of an independent verification partner operating within their own data domain.</p>
                        <p className="mb-3 text-sm"><strong>Infrastructure Scope Limitation:</strong> For the purposes of this Agreement, “Infrastructure” is restricted to the software conduits, multi-engine distributed database synchronization layers, and application programming interface (API) gateways facilitating the flow of tokenized metadata between the User and independent third-party integration networks. The Platform Operator’s operational and statutory duty of care is limited exclusively to the technical availability and structural integrity of this infrastructure layer.</p>
                        <p className="mb-4 text-sm"><strong>In-Browser Security Constraint:</strong> The security and decryption of the identity interface is fundamentally contingent upon the hygiene of the User’s local computing environment. The Platform Operator holds absolute immunity regarding client-side script injection attacks, unauthorized browser extension interference, device-level keyloggers, or malicious software payloads present on the User’s local device. The User’s explicit client-side security obligations are set forth in full within Section 10.</p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 1 — STRUCTURAL DEFINITIONS & ONBOARDING
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Structural Definitions &amp; Onboarding Protocol</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">1.1 Ultimate Data Sovereignty &amp; Client-Side Decentralized Container</h3>
                        <p className="mb-3 text-sm">Upon onboarding, the User acknowledges and agrees that they are the <strong>sole Data Controller of their own identity, credentials, and Decentralized Identifier (DID) configuration</strong>. The Platform Operator does not act as a custodian, escrow agent, or manager of master identity records.</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">The Client-Side Cryptographic Container Interface</p>
                            <p className="text-blue-900 text-xs leading-relaxed mb-2">The platform deploys an embedded, client-side <strong>decentralized cryptographic container</strong> directly inside the user’s browser runtime. This container reads self-claimed or verified datasets structured by the platform’s distributed database synchronisation layer, presenting them as standardized <strong>W3C Verifiable Credentials</strong>. When an independent verification partner completes their audit, they append a cryptographically signed <strong>Verifiable Presentation (VP)</strong> directly into the browser-managed container session.</p>
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1 mt-2">Interoperable Container Syncing</p>
                            <p className="text-blue-900 text-xs leading-relaxed mb-3">The User may elect to <strong>instantiate a native decentralized container</strong> via the Platform terminal, or <strong>synchronise a pre-existing, W3C-compliant external DID container</strong>. During an external sync, the Platform infrastructure reads only the public DID descriptor string — leaving absolute control of the private keys in the sovereign possession of the User. Any historical credential claims nested inside an externally synced container are flagged as <strong>“Pending Read”</strong> until processed through the platform’s independent verification ecosystem.</p>
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">Infrastructure-to-Container State Sync Boundary</p>
                            <p className="text-blue-900 text-xs leading-relaxed">The User acknowledges that the platform’s distributed database caching layers function strictly as an <strong>infrastructure staging layer</strong> for raw data entry. The conversion of this data into cryptographically signed Verifiable Credentials occurs exclusively when the client-side decentralized container queries and commits these entries. If a user modifies their profile or flight hours within the database layer, those changes are <strong>completely invalid for verification or operator pathway matching</strong> until the user executes a manual or session-based “Container Sync” to update the client-side presentation layer. The Platform Operator holds no liability for mismatched data states caused by a user’s failure to synchronise their container.</p>
                        </div>

                        <p className="mb-4 text-sm">The Platform Operator’s distributed database caching infrastructure does not constitute a <strong>Personal Data Repository</strong> under the PDPA, but rather an ephemeral staging layer for encrypted, non-identifiable credential fragments. The actual Personal Data — in the sense contemplated by the PDPA — remains solely under the technical and legal control of the User’s client-side decentralized container, outside the Platform Operator’s custody, access, or processing jurisdiction.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">1.2 Cryptographic Key Custody (Passkeys / Hardware Keychain)</h3>
                        <p className="mb-3 text-sm">The master cryptographic access keys required to decrypt, sign, and unlock the client-side container layers are held exclusively by the User via localised hardware-tied authentication protocols:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['OS Passkeys', 'Cryptographic key pairs secured inside the User\'s localised hardware environment via native device hardware authentication infrastructure.'],
                                        ['Zero Knowledge Architecture', 'The Platform Operator never possesses, transits, receives, or has the technical capability to reset private cryptographic keys.'],
                                        ['Irrecoverable Loss Acknowledgement', 'Loss of access to your device-level passkey architecture results in an unrecoverable loss of the associated client-side container data layer.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">1.3 Electronic Assent &amp; Consent Timestamp</h3>
                        <p className="mb-4 text-sm">In accordance with the Electronic Transactions Act (Cap. 88) of Singapore, checking the designated assent box during account creation constitutes an unalterable electronic signature. At the moment of execution, the Platform records an automated system timestamp mapped to an anonymous authentication token. These ledger entries constitute a non-discretionary regulatory audit trail, satisfying all statutory requirements for a binding legal agreement under the Electronic Transactions Act (Cap. 88), and are sufficient for the purposes of regulatory reporting and enforcement proceedings.</p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 2 — THREE-TERMINAL INFRASTRUCTURE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">2. The Three-Terminal Infrastructure Ecosystem</h2>
                        <p className="mb-4 text-sm">To satisfy civil aviation licensing realities, the Platform enforces an automated, permissions-based routing topology divided into three distinct operational Zones ("Terminals"):</p>

                        <div className="overflow-x-auto mb-5">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700 w-36">Terminal</th>
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700">Zone Classification &amp; Permissions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="bg-slate-50">
                                        <td className="px-4 py-3 border border-slate-200 align-top">
                                            <p className="font-black text-slate-900 text-xs">Terminal 1</p>
                                            <p className="text-slate-500 text-[10px] font-semibold uppercase">Administrative</p>
                                        </td>
                                        <td className="px-4 py-3 border border-slate-200 text-xs text-slate-600">Platform Operator. Internal infrastructure, data routing, systemic nodes, and permission matrix management.</td>
                                    </tr>
                                    <tr className="bg-amber-50">
                                        <td className="px-4 py-3 border border-amber-200 align-top">
                                            <p className="font-black text-amber-800 text-xs">Terminal 2</p>
                                            <p className="text-amber-600 text-[10px] font-semibold uppercase">Exploratory</p>
                                        </td>
                                        <td className="px-4 py-3 border border-amber-200 text-xs text-slate-600">
                                            <p className="mb-1">Unverified public ecosystem. Free-tier, read-only display.</p>
                                            <ul className="list-disc pl-4 space-y-0.5 text-slate-500">
                                                <li><strong>SPL Limits:</strong> Algorithmically restricted to ATO educational pathways only.</li>
                                                <li><strong>Submission Gating:</strong> SPL/PPL profiles blocked from career pathway submissions below statutory age or rating limits.</li>
                                                <li><strong>PDPA Lawful Basis:</strong> Evaluating age and licence class to configure Terminal 2 access is a legitimate operational necessity — not arbitrary profiling.</li>
                                            </ul>
                                        </td>
                                    </tr>
                                    <tr className="bg-emerald-50">
                                        <td className="px-4 py-3 border border-emerald-200 align-top">
                                            <p className="font-black text-emerald-800 text-xs">Terminal 3</p>
                                            <p className="text-emerald-600 text-[10px] font-semibold uppercase">Verified</p>
                                        </td>
                                        <td className="px-4 py-3 border border-emerald-200 text-xs text-slate-600">Strictly regulated verified domain. Authenticated via third-party secure APIs against sovereign civil aviation registries. Only active, validated, and compliant flight crew members possess routing clearance.</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <div className="border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl px-5 py-3 mb-3">
                            <p className="text-emerald-800 text-xs font-bold uppercase tracking-wide mb-1">Terminal 3 Gatekeeper — Compliance Assertion</p>
                            <p className="text-emerald-900 text-xs leading-relaxed">Transition between Terminal 2 and Terminal 3 is not user-selectable. It is triggered exclusively by the successful completion of an independent cryptographic handshake with a registered civil aviation verification partner. The Platform Operator holds no manual override authority to grant Terminal 3 access outside of this cryptographic verification pathway.</p>
                        </div>
                        <div className="border-l-4 border-slate-300 bg-slate-50 rounded-r-xl px-5 py-3 mb-2">
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-1">Regulatory Neutrality — Terminal 3 Status</p>
                            <p className="text-slate-600 text-xs leading-relaxed">Terminal 3 status does not certify airworthiness, medical fitness, or regulatory compliance for any civil aviation purpose. It serves exclusively as a visual beacon of third-party credential verification, provided for informational purposes to facilitate institutional workflows. The sole authoritative source for any airworthiness or licensing determination remains the issuing Civil Aviation Authority (see Section 8).</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 3 — MULTI-ENGINE VAULT ARCHITECTURE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">3. The Multi-Engine Vault Architecture &amp; Security Telemetry</h2>
                        <p className="mb-4 text-sm">The Platform Operator acts as an <strong>Infrastructure Controller</strong>, providing a secure, dual-redundant processing venue designed for continuous flight-critical availability.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="border border-slate-300 rounded-lg px-4 py-2 bg-white text-center mx-auto w-48">
                                    <p className="font-bold text-slate-700">Hardware Passkey</p>
                                    <p className="text-slate-500 text-[10px]">User-held private key</p>
                                </div>
                                <div className="text-center text-slate-400">↓</div>
                                <div className="border-2 border-red-300 rounded-lg px-4 py-2 bg-red-50 text-center mx-auto w-56">
                                    <p className="font-black text-red-700">Platform Infrastructure Node</p>
                                </div>
                                <div className="text-center text-slate-400">↓ splits ↓</div>
                                <div className="flex gap-6 justify-center">
                                    <div className="border border-blue-300 rounded-lg px-3 py-2 bg-blue-50 text-center w-44">
                                        <p className="font-bold text-blue-700">Engine Alpha</p>
                                        <p className="text-blue-600 text-[10px]">Primary Database Engine</p>
                                        <p className="text-blue-600 text-[10px]">Credential Status Store</p>
                                    </div>
                                    <div className="border border-purple-300 rounded-lg px-3 py-2 bg-purple-50 text-center w-44">
                                        <p className="font-bold text-purple-700">Engine Beta</p>
                                        <p className="text-purple-600 text-[10px]">Secondary Synchronisation Engine</p>
                                        <p className="text-purple-600 text-[10px]">Real-time Redundancy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">3.1 Dual-Engine High Availability</h3>
                        <p className="mb-4 text-sm">Account states and tokenised routing tables are synchronised across the Primary Database Engine (Engine Alpha) and the Secondary Synchronisation Engine (Engine Beta). In the event of a primary engine failure, the secondary engine automatically sustains active session routing.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">3.2 Asymmetric Cryptographic Vault</h3>
                        <p className="mb-3 text-sm">The Platform Operator functions as an infrastructure vault manager. All verified credentials, DID data, and identity records are cryptographically hashed and written to the credential status store within the primary database engine as an encrypted string. The Platform Operator maintains infrastructure-level monitoring over public keys only. The User’s hardware passkey signature is required to unlock the rendering pipeline. The <strong>Isolated Instrument Principle</strong> ensures verified credentials are decoded client-side only — fundamentally invisible to external network actors and structurally inaccessible to the Platform Operator.</p>
                        <p className="mb-4 text-sm">All data residing within the multi-engine distributed storage layers is encrypted at rest using AES-256 standard encryption. The Platform Operator possesses no decryption keys for the credential payloads; the decryption entropy is held exclusively within the User’s device-bound hardware passkey and is never transmitted to or accessible by the Platform Operator’s server-side infrastructure.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">3.3 Browser Local Cache &amp; Runtime Security Boundaries</h3>
                        <p className="mb-3 text-sm">Because the client-side decentralized container executes within the user’s browser, certain session payloads, keys, and decrypted credentials may temporarily reside in the browser’s local volatile memory, IndexedDB, or localised cache storage to maintain session continuity.</p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4">
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-2">User Volatile Environment Responsibility</p>
                            <p className="text-amber-900 text-xs leading-relaxed">The User is uniquely responsible for securing their physical device and browser environment. If the User accesses the Platform via a <strong>shared, public, or unencrypted corporate terminal</strong> and fails to log out or clear the browser’s application cache, unauthorized third parties may intercept the active session state. The Platform Operator <strong>explicitly disclaims liability</strong> for local client-side memory scraping, unauthorized terminal access, or browser storage compromises resulting from the User’s failure to secure their device environment.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">3.4 Account Erasure &amp; Sovereign Data Deletion</h3>
                        <p className="mb-3 text-sm">Pursuant to Singapore PDPA 2012, upon account deletion the Platform Operator executes a <strong>destructive erase sequence</strong>, permanently scrubbing the encrypted identifier string from all multi-engine synchronisation logs within <strong>30 business days</strong>.</p>
                        <div className="overflow-x-auto mb-2">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Key-Pair Erasure Effect', 'Deleting the infrastructure entry breaks the asymmetric key pairing, rendering any lingering backup hashes permanently unrecoverable — even if a forensic copy were obtained.'],
                                        ['Container Session Deletion', 'The User retains the independent right to clear or delete their browser-resident client-side container at any time via their device\'s browser settings, independently of platform-level account deletion.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <p className="text-sm mt-3">This destructive erase sequence fulfils the Platform Operator's obligations under the Singapore PDPA 2012 regarding the retention of personal data. Once the erasure sequence is initiated and confirmed, the Pilot acknowledges and accepts that recovery of any deleted data is technically impossible by design, and the Platform Operator bears no obligation to restore, reconstruct, or compensate for any data loss resulting from a User-initiated deletion request.</p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 4 — FMS BROADCAST ENGINE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">4. Contextual Environment Broadcast Engine (FMS Protocol)</h2>
                        <p className="mb-4 text-sm">The Platform implements a <strong>one-way telemetry broadcast system</strong>, modelled after an aviation Flight Management System (FMS) utilising ADS-B concepts.</p>

                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="border-2 border-slate-400 rounded-lg px-4 py-3 bg-white mx-auto max-w-md">
                                    <p className="font-black text-slate-700 text-xs uppercase tracking-wide text-center mb-1">Public Operator Broadcast Tower</p>
                                    <p className="text-slate-500 text-[10px] text-center">ATO / Flight School posts Pathway Requirements</p>
                                    <p className="text-slate-500 text-[10px] text-center">Transmits: Hour minimums · Expectations · Target Scores</p>
                                </div>
                                <div className="text-center text-slate-400 font-bold">↓ One-Way Public Broadcast ↓</div>
                                <div className="border-2 border-blue-400 rounded-lg px-4 py-3 bg-blue-50 mx-auto max-w-md">
                                    <p className="font-black text-blue-800 text-xs uppercase tracking-wide text-center mb-1">Pilot Terminal Private Dashboard</p>
                                    <p className="text-blue-600 text-[10px] text-center">Receives public broadcast · Executes local alignment processing</p>
                                    <p className="text-red-600 text-[10px] text-center font-black mt-1">Platform Operator Vision Boundary: ABSOLUTE ZERO-SIGHT</p>
                                </div>
                            </div>
                        </div>

                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['One-Way Criteria Broadcasting', 'ATOs and flight school operators broadcast training pathways publicly: statutory hour prerequisites, operational experience expectations, and preferred target capability scores.'],
                                        ['Local Environment-Aware Alignment', 'The pilot\'s private dashboard locally evaluates these public criteria against the user\'s encrypted, tokenised container data — processed strictly inside the client-side browser runtime space.'],
                                        ['Zero Platform Visibility', 'The Platform Operator cannot view, track, log, or scrape comparative alignment results or internal performance analytics. The Platform broadcasts targets; the pilot\'s instrument panel registers the trajectory in complete privacy.'],
                                        ['Anti-Profiling Shield', 'Because automated matching occurs locally and not on Platform servers, the Platform bypasses "automated profiling" compliance burdens under PDPA and GDPR-equivalent frameworks.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-l-4 border-blue-400 bg-blue-50 rounded-r-xl px-5 py-3 mb-2">
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">Technical Assertion — Client-Side Execution Isolation</p>
                            <p className="text-blue-900 text-xs leading-relaxed">The Platform Operator employs a client-side execution container (the designated decentralized client-side cryptographic container) that structurally isolates the pilot's local alignment processing from the server-side API layer. This container corresponds to the <strong>Pilot Terminal</strong> node defined in the Section 6 topology. There is no technical path for unencrypted comparative data to egress the Pilot's Terminal during the alignment calculation. The server-side API layer receives only the pilot's anonymous token identifier — never the alignment result, the wallet payload, or the credential claim content.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 5 — ENTERPRISE GATEWAY & DUAL-CONSENT
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Commercial Enterprise Dashboard &amp; Dual-Consent Handshake</h2>
                        <p className="mb-4 text-sm">The interaction between pilots and subscribing aviation enterprises is governed by a strict, multi-stage <strong>Cryptographic Consent Handshake</strong>. No pilot data crosses from the Private Vault to an Operator's dashboard without an explicit, user-initiated consent action.</p>

                        <h3 className="font-semibold text-slate-800 mb-3">5.1 The Pilot Onboarding &amp; Verification Lifecycle</h3>
                        <p className="mb-3 text-sm">The framework does not enforce artificial rating or experience barriers to initiate verification. The protocol serves to audit and cryptographically stamp the <strong>factual truth of whatever specific operational tier the pilot currently claims</strong> within their container environment. All profiles transit a strict progression sequence:</p>

                        {/* Lifecycle progression */}
                        <div className="space-y-2 mb-4">
                            {[
                                { step: '1', label: 'Profile Creation & Initial Claims', tier: 'Terminal 1 · Free Tier', color: 'slate', desc: 'The pilot initialises their non-custodial decentralized container. The platform\'s distributed data synchronisation layer populates basic database tables with self-claimed aviation metadata (e.g., educational status, estimated flight hours, training records). The container tokenises these records into standardised cryptographic credential format inside the browser environment. This profile resides entirely within an unverified, complimentary baseline tier.' },
                                { step: '2', label: 'Pre-Verification Regional Routing & Self-Audit Notice', tier: 'User-Initiated Trigger', color: 'blue', desc: 'The pilot elects to initiate an infrastructure upgrade by settling the then-current non-refundable validation processing fee. The system requests the pilot\'s operational region and assigns the designated independent third-party verification partner.' },
                                { step: '3', label: 'Consensual DID Read & Verification Profile Execution', tier: 'Adaptive Regional Verification', color: 'amber', desc: '' },
                                { step: '4', label: 'Credential Issuance & Platform Triangulation', tier: 'Terminal 3 Clearance', color: 'emerald', desc: 'Upon validation, the independent verification entity issues a permanent Verified Credential Token directly into the pilot\'s decentralized container and transmits a binary confirmation signal to the platform. The platform reads this signal, cryptographically signs a Terminal 3 Access Token, and unlocks the respective verified pathway registries matching the pilot\'s verified tier.' },
                            ].map(({ step, label, tier, color, desc }) => (
                                <div key={step} className={`border rounded-xl px-4 py-3 ${ color === 'slate' ? 'bg-slate-50 border-slate-200' : color === 'blue' ? 'bg-blue-50 border-blue-200' : color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200' }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${ color === 'slate' ? 'bg-slate-600' : color === 'blue' ? 'bg-blue-600' : color === 'amber' ? 'bg-amber-600' : 'bg-emerald-600' }`}>{step}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-xs">{label}</p>
                                            <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${ color === 'slate' ? 'text-slate-500' : color === 'blue' ? 'text-blue-600' : color === 'amber' ? 'text-amber-600' : 'text-emerald-600' }`}>{tier}</p>
                                            {step === '3' ? (
                                                <div className="text-xs text-slate-600">
                                                    <p className="mb-2">The designated independent verification partner receives user-initiated consent to access and read the token profiles via secure API handshake. The screening matrix adapts dynamically to the pilot\'s claimed tier:</p>
                                                    <div className="space-y-1.5">
                                                        <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                                                            <p className="font-bold text-amber-800 text-[10px] uppercase mb-0.5">Licensed Tier (Commercial / Airline Transport)</p>
                                                            <p className="text-slate-600 text-[10px]">Validates active licenses, medical ratings, and type certifications directly against live data streams maintained by applicable civil aviation authorities and sovereign registries.</p>
                                                        </div>
                                                        <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                                                            <p className="font-bold text-amber-800 text-[10px] uppercase mb-0.5">Student / Cadet Tier</p>
                                                            <p className="text-slate-600 text-[10px]">Executes an academic and institutional enrollment audit directly with the nominated flight school or training organization to verify active enrollment windows and tracking metrics.</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            ) : (
                                                <p className="text-xs text-slate-600">{desc}</p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Pre-Verification Warning */}
                        <div className="bg-red-50 border-2 border-red-300 rounded-xl px-5 py-4 mb-5">
                            <p className="text-red-700 text-xs font-black uppercase tracking-wide mb-2">⚠ Mandatory Pre-Verification Notice to Users</p>
                            <p className="text-red-800 text-xs leading-relaxed mb-2">You are strictly required to audit, verify, and guarantee the absolute accuracy of your self-claimed data — including expiration frequencies, certificate validation bounds, and licensing operational constraints — <strong>prior to authorising the regional verification partner transmission</strong>.</p>
                            <p className="text-red-800 text-xs leading-relaxed mb-2">The platform provides data diagnostics to capture formatting inconsistencies within your uploaded logbooks; however, <strong>the verification process incurs immediate operational costs</strong>. If your screening reveals revoked licences, lapsed medical checks, or invalid certifications, <strong>the verification fee will be fully processed and is non-refundable</strong>. Your submission will return a failed verification status, preventing access to Terminal 3, due to discrepancies you failed to resolve prior to submission.</p>
                            <p className="text-red-800 text-xs leading-relaxed"><strong>Hardware Authentication Requirement:</strong> The use of hardware-based cryptographic authentication architectures (such as native device keychains or operating-system-level hardware passkeys) is the mandatory standard for Terminal 3 access. Software-simulated credentials or password-only authentication vectors are structurally blocked from exercising the cryptographic consent handshake.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">5.2 Premium &amp; Restricted Pathway Channels</h3>
                        <p className="mb-3 text-sm">Subscribing aviation enterprises use the platform's environment-aware framework to target exact talent brackets while maintaining operational confidentiality.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Exclusive Cadet & Training Pathways', 'Operators posting specialised cadet tracks, airline sponsorship programmes, or flight-school pathways may flag their entries to require Verified Credentials Only. This ensures their posting, criteria, and branding are visible only to student pilots whose enrollment and training metrics have been independently authenticated through the regional verification partner.'],
                                        ['Charter & Corporate Pathways', 'Premium flight operators — luxury private jet networks, corporate flight departments, and business aviation charters — may flag postings as Charter Pathways. These are visible exclusively to pilots holding an active, stamped Recognition+ verification beacon.'],
                                        ['Unverified Noise Mitigation', 'Unverified profiles are structurally restricted from viewing or interacting with restricted pathway channels. This eliminates speculative applications, preserving the operational integrity of the operator\'s dashboard and guaranteeing that any pilot submitting interest is actively enrolled or independently verified at their stated tier.'],
                                        ['Universal Fairness Principle', 'The Platform does not lock users out based on age or lack of commercial hours. Verification gates confirm pilots against their own current, real-world milestones — educational enrollment for students, active licences for commercial pilots.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>

                            </table>
                        </div>

                        {/* Operator Dashboard View Matrix */}
                        <h3 className="font-semibold text-slate-800 mb-2">5.3 Operator Dashboard Visibility Matrix</h3>
                        <div className="overflow-x-auto mb-5">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700 w-40">Structural Element</th>
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700">Operator Visibility Bound</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Pilot Name', 'Exposed only upon deliberate "Submit Interest" action by the pilot.'],
                                        ['Total Flight Hours', 'Exposed as a macro-metric summary block only.'],
                                        ['Full Logbook Data', 'ABSOLUTE REDACTION. Platform infrastructure denies raw logbook browsing to operators at all times.'],
                                        ['Verification State', 'Renders binary "Verified" or "Unverified" beacon via the Platform\'s independent verification integration signal. No raw credential data visible.'],
                                        ['Charter Pathways', 'Completely hidden from unverified (Terminal 2) accounts. Visible only to pilots holding an active Recognition+ cryptographic stamp.'],
                                    ].map(([element, bound], i) => (
                                        <tr key={String(element)} className={i === 2 ? 'bg-red-50' : i === 4 ? 'bg-amber-50' : i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className={`px-4 py-3 border font-semibold text-xs align-top ${ i === 2 ? 'border-red-200 text-red-800' : i === 4 ? 'border-amber-200 text-amber-800' : 'border-slate-200 text-slate-700' }`}>{element}</td>
                                            <td className={`px-4 py-3 border text-xs ${ i === 2 ? 'border-red-200 text-red-700 font-bold' : i === 4 ? 'border-amber-200 text-amber-700 font-semibold' : 'border-slate-200 text-slate-600' }`}>{bound}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className="border-l-4 border-slate-300 bg-slate-50 rounded-r-xl px-4 py-3 mb-5">
                            <p className="text-slate-600 text-xs leading-relaxed">The Platform Operator has no visibility into the comparative data evaluated within a pilot's local browser session. Operator pathway criteria are broadcast publicly; the matching computation occurs entirely client-side. This distribution of data processing responsibility is governed by the Controller Framework in Section 17, ensuring each party retains sole accountability for their specific data stream.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">5.4 Bring Your Own Verification (BYOV) &amp; External Sync Protocol</h3>
                        <p className="mb-3 text-sm">The platform recognises that advanced pilots may possess pre-existing verification records, background clearance tokens, or fully initialised identity payloads stored within an existing external decentralized container. To maintain the absolute cryptographic integrity of Terminal 3, <strong>these external datasets must undergo automated protocol alignment</strong> before any access grant is signed:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Container Sync Sequence', 'When a pilot connects a pre-existing external decentralized container, the platform\'s multi-engine distributed infrastructure registers the public descriptor string. Any historical verification claims nested inside that container remain flagged as \'Pending Read\' until processed by the platform\'s independent verification ecosystem.'],
                                        ['Verification-of-Verifier Workflow', 'If a pilot declares a third-party verification credential within their synced container, the underlying data payload is securely routed to the platform\'s designated independent verification partner. The partner actively audits and cross-references the external issuer\'s cryptographic signatures, authority roots, and registry timestamps against live civil aviation records. The platform does not accept external badges, document uploads, or digital certificates at face value.'],
                                        ['Token Bridge Issuance & Fee', 'Because the independent verification partner must perform an active, live audit on the external provider\'s historical payload, the then-current validation processing fee applies without exception. Once validated, they execute a trust-anchor handshake, bridging the record into a native Verified Credential Token stamped directly into the pilot\'s synced decentralized container, delivering the required confirmation signal to unlock Terminal 3 pathways.'],
                                        ['Stale & Decayed Data Defense', 'A prior verification by an external provider does not guarantee current compliance. The re-verification requirement forces the independent partner to validate the live status of any historical token before the platform cryptographically signs a Terminal 3 Access Token, preventing data decay or injection attacks.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* BYOV / DID Sync flow diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-5 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-3">
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="border border-slate-300 rounded-lg px-3 py-2 bg-white text-center w-44">
                                        <p className="font-bold text-slate-700 text-[10px] uppercase">External / Synced Decentralized Container</p>
                                        <p className="text-slate-500 text-[10px]">Pre-existing credentials flagged</p>
                                        <p className="text-slate-400 text-[10px] font-semibold">“Pending Read”</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-amber-300 rounded-lg px-3 py-2 bg-amber-50 text-center w-48">
                                        <p className="font-bold text-amber-800 text-[10px] uppercase">Independent Verification Partner</p>
                                        <p className="text-amber-600 text-[10px]">Live CAA registry re-check</p>
                                        <p className="text-amber-700 text-[10px] font-black">Trust Anchor Handshake</p>
                                        <p className="text-amber-600 text-[10px]">Applicable validation processing fee applies</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-emerald-300 rounded-lg px-3 py-2 bg-emerald-50 text-center w-44">
                                        <p className="font-bold text-emerald-800 text-[10px] uppercase">Native Token Bridged</p>
                                        <p className="text-emerald-600 text-[10px]">Stamped into synced decentralized container</p>
                                        <p className="text-emerald-600 text-[10px] font-black">Terminal 3 Unlocked</p>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] text-red-600 font-bold">All paths — native, external, or synced — route through independent partner live audit before Terminal 3 access is signed</p>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">5.5 User-Initiated Handshake &amp; Sovereign Container Portability</h3>
                        <p className="mb-3 text-sm">To investigate a pilot's specific sub-credentials beyond the macro dashboard metrics, the Operator must request an active initiation handshake through the platform:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Granular Handshake Activation', 'The request alerts the Pilot via a secure platform notification. The Pilot must explicitly authorise via their hardware passkey signature. No passive or automatic access is possible.'],
                                        ['Strict Read-Only Execution', 'Upon explicit user-initiated passkey approval, the Operator is granted a limited, time-bound, strictly read-only cryptographic lens to view the specific verified credentials required for that pathway. No ownership transfer or raw file extraction occurs.'],
                                        ['Zero-Persistence Caching Block', 'The platform programmatically prevents the Operator from caching, storing, downloading, or replicating the decrypted payload. Once the session closes or consent is revoked, the Operator\'s cryptographic lens immediately de-authorises and shatters.'],
                                        ['Sovereign Exportability & Deletion', 'Because all verification and presentation tokens are stored directly within the pilot\'s non-custodial decentralized container, the User maintains absolute ownership over the asset. The User preserves the unbound right to download, export, or migrate their complete container to alternative third-party container systems, or delete their profile state from the platform entirely, erasing all network data trails outside their localised device.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Consent handshake diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="border-2 border-blue-400 rounded-lg px-4 py-2 bg-blue-50 text-center w-52">
                                        <p className="font-black text-blue-800 text-[10px] uppercase">Pilot Private Dashboard</p>
                                        <p className="text-blue-600 text-[10px]">Click "Submit Interest"</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-slate-300 rounded-lg px-4 py-2 bg-white text-center w-52">
                                        <p className="font-black text-slate-700 text-[10px] uppercase">System</p>
                                        <p className="text-slate-500 text-[10px]">Anonymous token only routed</p>
                                    </div>
                                </div>
                                <div className="text-center text-slate-400 font-bold">↓ Operator requests deep access ↓</div>
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="border-2 border-emerald-400 rounded-lg px-4 py-2 bg-emerald-50 text-center w-52">
                                        <p className="font-black text-emerald-800 text-[10px] uppercase">Enterprise Operator</p>
                                        <p className="text-emerald-600 text-[10px]">Initiates Wallet Query Request</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-amber-400 rounded-lg px-4 py-2 bg-amber-50 text-center w-52">
                                        <p className="font-black text-amber-800 text-[10px] uppercase">Pilot Signs with Passkey</p>
                                        <p className="text-red-600 text-[10px] font-black">Read-Only · Time-Bound · Revocable</p>
                                        <p className="text-amber-600 text-[10px]">Zero-Persistence · Shatters on close</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 5.6 — ASYMMETRIC ENTERPRISE VAULT
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h3 className="font-semibold text-slate-800 mb-2">5.6 The Asymmetric Enterprise Vault &amp; Confidential Contractual Handshake</h3>
                        <p className="mb-3 text-sm">Following the initial User-initiated submission under Section 5.5, a subscribing aviation enterprise may escalate engagement to a private, isolated negotiation layer designated as <strong>Stage 2: Operational &amp; Financial Evaluation</strong>. This layer operates under heightened confidentiality controls and zero-sight vaulting architecture.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['(a) The Phase 2 Invitation Model', 'Following an initial user-initiated submission under Section 5.5, a subscribing aviation enterprise may issue an operational request to advance the User to the private negotiation layer, designated as "Stage 2: Operational & Financial Evaluation." The Platform infrastructure routes an automated system notification alerting the User of the enterprise\'s targeted interest. No content from the enterprise\'s private payload is exposed to the User until an affirmative acknowledgement action is executed.'],
                                        ['(b) Restricted Document Ingestion & Zero-Sight Vaulting', 'Subscribing aviation enterprises may upload highly confidential, non-public operational parameters — including localised financial packages, layover structures, contract durations, and training bond covenants — directly into an isolated session vault. The Platform Operator functions strictly as a neutral technical conduit for this payload and possesses zero technical capability, access rights, or administrative keys to read, audit, or scrape the contents of these private enterprise documents.'],
                                        ['(c) Affirmative Read-Receipt Verification', 'Access to the enterprise\'s private Stage 2 documentation is completely blocked until the User explicitly clicks the designated acknowledgement prompt. Executing this prompt generates a cryptographically secured, timestamped read-receipt transmitted back to the initiating enterprise. This receipt serves as irrefutable technical confirmation that the User has actively accessed and engaged with the confidential document payload, constituting a valid electronic acknowledgement under the Electronic Transactions Act (Cap. 88).'],
                                        ['(d) Mandatory Non-Disclosure & Anti-Leakage Bound', 'All documentation exposed within Stage 2 is explicitly deemed Proprietary Intellectual Property of the issuing aviation enterprise. The User is structurally barred from extracting, downloading, copying, or screenshotting the Stage 2 interface payload. Any unauthorised disclosure, public dissemination, or competitive leakage of these financial terms by the User constitutes a material breach of these Terms, resulting in immediate infrastructure termination and absolute legal liability localised strictly between the User and the affected enterprise. The Platform Operator bears zero liability for any downstream contractual, labour, or bond-enforcement dispute arising between the User and the enterprise from the contents of Stage 2 documentation.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Stage 2 flow diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="border-2 border-emerald-400 rounded-lg px-4 py-2 bg-emerald-50 text-center w-52">
                                        <p className="font-black text-emerald-800 text-[10px] uppercase">Terminal 3 Recruiter</p>
                                        <p className="text-emerald-600 text-[10px]">Reviews S5.5 read-only preview</p>
                                        <p className="text-emerald-700 text-[10px] font-black">Executes "Advance to Stage 2"</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-blue-300 rounded-lg px-4 py-2 bg-blue-50 text-center w-52">
                                        <p className="font-black text-blue-800 text-[10px] uppercase">System Notification</p>
                                        <p className="text-blue-600 text-[10px]">Routes invitation to User</p>
                                        <p className="text-blue-500 text-[10px]">Zero document content exposed</p>
                                    </div>
                                </div>
                                <div className="text-center text-slate-400 font-bold">↓ User affirmative click ↓</div>
                                <div className="flex items-center gap-3 justify-center">
                                    <div className="border-2 border-amber-400 rounded-lg px-4 py-2 bg-amber-50 text-center w-52">
                                        <p className="font-black text-amber-800 text-[10px] uppercase">Cryptographic Timestamp</p>
                                        <p className="text-amber-600 text-[10px]">Read-receipt issued to enterprise</p>
                                        <p className="text-amber-700 text-[10px] font-black">ETA Cap. 88 audit trail locked</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-red-400 rounded-lg px-4 py-2 bg-red-50 text-center w-52">
                                        <p className="font-black text-red-800 text-[10px] uppercase">Private Stage 2 Lens</p>
                                        <p className="text-red-600 text-[10px]">Financial terms · Bond covenants</p>
                                        <p className="text-red-700 text-[10px] font-black">Download / Screenshot Blocked</p>
                                        <p className="text-red-500 text-[10px]">Platform Operator: Zero visibility</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="border-l-4 border-red-500 bg-red-50 rounded-r-xl px-5 py-3 mb-2">
                            <p className="text-red-800 text-xs font-bold uppercase tracking-wide mb-1">Platform Zero-Sight Assertion — Stage 2 Vault</p>
                            <p className="text-red-900 text-xs leading-relaxed">The Platform Operator is architecturally barred from reading, auditing, or storing the contents of any Stage 2 enterprise document payload. All liability for the contractual terms, financial obligations, training bond enforceability, and downstream labour disputes arising from Stage 2 documentation rests exclusively between the issuing aviation enterprise and the User as independent parties. The Platform's role is limited strictly to routing the encrypted notification, generating the timestamped read-receipt, and enforcing the zero-extraction caching block.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 6 — COMPREHENSIVE TOPOLOGY
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">6. Comprehensive Topology of Platform Data Control</h2>
                        <p className="mb-4 text-sm">To ensure absolute clarity during systemic audits, operational responsibilities and data boundaries across all platform stakeholders are strictly defined:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-900 text-white">
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700">Structural Component</th>
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700">Primary Legal Status</th>
                                        <th className="text-left px-4 py-3 font-bold text-xs uppercase tracking-wide border border-slate-700">Legal Bounds &amp; Operational Scope</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Identity Keys & Tokenized Data', 'The Individual User — Sovereign Data Controller', 'Holds exclusive possession of private cryptographic keys via localised hardware authenticators or native device keychains. Retains the absolute right to delete or export container states to alternative third-party systems.'],
                                        ['System Framework & Infrastructure', 'The Platform Operator — Neutral Technical Intermediary', 'Manages the software environment, multi-engine database synchronisation, and automated Terminal permission gates. Issues Terminal 3 access tokens solely based on independent verification signals.'],
                                        ['Broadcast Pathway Criteria', 'Subscribing Aviation Enterprise — Independent Data Controller', 'Broadcasts recruitment, training, and operational prerequisites. Evaluates candidate profiles exclusively via user-initiated, read-only cryptographic handshakes.'],
                                        ['Live Validation Streams', 'Independent Integration Partners — Authoritative Issuing Controllers', 'Independently processes raw validation payloads, authenticates status with applicable civil registries, and issues verified cryptographic tokens directly to the user\'s container.'],
                                    ].map(([component, status, scope], i) => (
                                        <tr key={String(component)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-800 text-xs align-top">{component}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-xs text-slate-700 font-medium align-top">{status}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-xs text-slate-600 align-top">{scope}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-emerald-50 border border-emerald-200 rounded-xl px-5 py-4">
                            <p className="text-emerald-800 text-xs font-black uppercase tracking-wide mb-2">Cumulative Legal Effect</p>
                            <ul className="space-y-1 text-xs text-emerald-900">
                                <li><strong>No automated profiling liability:</strong> Matching happens locally in the pilot's browser — the Platform never sees or processes the comparison.</li>
                                <li><strong>Mere conduit confirmed:</strong> The Platform operates the broadcast tower and the vault. It does not perform sorting, screening, or scoring on its own servers.</li>
                                <li><strong>Four-party liability distribution:</strong> Data liability is structurally distributed across the Pilot, the Platform Operator (infrastructure only), Subscribing Aviation Enterprises, and Independent Integration Partners — eliminating single-point regulatory exposure.</li>
                            </ul>
                            <p className="text-emerald-900 text-xs mt-3 pt-3 border-t border-emerald-200">The Platform Operator's systemic role is strictly limited to the provision of the digital communication infrastructure. It lacks the technical capability, access rights, and legal mandate to view, manipulate, or adjudicate the encrypted credential data flowing through its conduits.</p>
                            <p className="text-emerald-700 text-xs mt-2 italic">This distribution of liability is governed by the Controller Framework established in Section 17, and the data sovereignty obligations set out in Section 13, ensuring that each party retains sole accountability for their specific data stream.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 7 — LIMITATION OF LIABILITY
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">7. Limitation of Liability &amp; Non-Refundability of Processing Fees</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">7.1 Non-Refundability of Verification Processing Fees</h3>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4">
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-2">Fee Covers Process Execution — Not Guaranteed Outcome</p>
                            <p className="text-amber-900 text-xs leading-relaxed">The then-current validation processing fee covers the operational cost of initiating and executing the background check protocol via the Platform's designated independent third-party verification partners. The User explicitly acknowledges that this transaction <strong>pays for the execution of the screening process, not a guaranteed clearance outcome</strong>.</p>
                        </div>
                        <p className="mb-4 text-sm">In the event that a regional screening provider discovers discrepancies, expired credentials, or administrative flags that result in a denial of Terminal 3 access, <strong>the processing fee remains fully processed, non-refundable, and non-creditable</strong>. The Platform Operator shall not be held liable for fees forfeited due to a pilot's failure to properly self-audit their wallet data prior to submission.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.2 Verification &amp; Screening Outcomes</h3>
                        <p className="mb-4 text-sm">The Platform Operator provides the secure technical venue for the validation interface. The actual background checks, credential sourcing, and verification results are executed entirely by <strong>independent third-party regional screening providers</strong>. The Platform Operator disclaims all legal liability for processing delays, negative screening matches, registry access outages, or data discrepancies generated by external providers that result in an onboarding failure into Terminal 3.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.3 Match Optimisation Disclaimer</h3>
                        <p className="mb-4 text-sm">The Platform Operator provides the infrastructure wires and broadcast towers to facilitate connection. The Platform Operator does not adjudicate, influence, or guarantee employment outcomes, training acceptances, or operational placements. The alignment score displayed on a pilot's panel is a localised mathematical calculation based purely on matching user-input values against an operator's public requirements template.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.4 Liability Valuation Cap</h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4">
                            <p className="text-red-800 text-xs font-black uppercase tracking-wide mb-2">Maximum Aggregate Liability</p>
                            <p className="text-red-900 text-sm font-bold">USD $50.00</p>
                            <p className="text-red-700 text-xs mt-1">To the maximum extent permitted by applicable law (including the Singapore Unfair Contract Terms Act), the Platform Operator shall not be held liable for any loss of profits, lost training fees, missed corporate charter contracts, career delays, data access disruptions during an active cryptographic handshake, fees forfeited due to failed verification outcomes, or losses arising from a pilot withholding verification consent. The Platform Operator's maximum aggregate liability for any claim arising out of this ecosystem shall not exceed <strong>USD $50.00</strong>.</p>
                            <p className="text-red-700 text-xs mt-2">The parties acknowledge that this Liability Valuation Cap is a material inducement for the provision of the Platform at its current price point, and that the risk allocation herein is commercially reasonable under the circumstances of digital-only verification services, consistent with the reasonableness test under the Singapore Unfair Contract Terms Act.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">7.5 Payment Routing Architecture &amp; Non-Custodial Status</h3>
                        <p className="mb-3 text-sm">All financial transactions are processed through independent, third-party, non-custodial decentralized payment gateways and distributed via automated routing infrastructure directly to the integration partners executing the verification function. The Platform Operator does not hold, manage, escrow, or maintain custody of user funds or digital assets at any point in the payment lifecycle.</p>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-3 mb-4">
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-1">MAS Payment Services Act — Non-Custodial Disclaimer</p>
                            <p className="text-slate-600 text-xs leading-relaxed">The Platform Operator is not a licensed financial institution, money transmitter, or payment services provider under the Payment Services Act 2019 of Singapore (as amended), and requires no licensure thereunder for the facilitation of these automated transactions. The immutable distributed ledger maintained by the payment routing architecture provides a transparent audit trail satisfying international AML traceability standards. Any disputes regarding screening results are legally attributable to the applicable integration partner layer, not to the Platform Operator.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">7.6 Enterprise Member — Time-Limited Activation Credit</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-2">
                            <p className="text-blue-900 text-xs leading-relaxed">When a verification event involves an ATO or aviation enterprise, a time-limited activation credit at the then-current published rate is automatically reserved for that organisation. The organisation has a defined business-day window to activate an Enterprise membership to claim this credit as an onboarding discount. If the window expires, the credit lapses to the platform infrastructure pool. Verification proceeds regardless of membership status.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 8 — GOVERNING LAW & CONTACT
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law, Venue &amp; Regulatory Independence</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-5">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Governing Jurisdiction — Immutable</p>
                            <p className="text-slate-900 font-semibold">Republic of Singapore</p>
                            <p className="text-slate-500 text-xs mt-1">This designation is an immutable legal clause and is not determined by, nor subject to alteration by, the User’s network routing configuration, IP origin, or geographic location at the time of access. Applicable data protection framework: Singapore PDPA 2012 (as amended).</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">8.1 Governing Law and Exclusive Jurisdiction</h3>
                        <p className="mb-4 text-sm">This Agreement, its multi-engine structural configurations, and any disputes arising from the Terminal permission matrices shall be governed strictly by, and construed in accordance with, the <strong>laws of the Republic of Singapore</strong>. Any dispute, controversy, or claim arising out of or in connection with this Agreement, including any question regarding its existence, validity, or termination, shall be referred to and finally resolved by the exclusive jurisdiction of the courts of the Republic of Singapore. Any data handling inquiries or complaints may be directed to the <strong>Personal Data Protection Commission (PDPC)</strong> of Singapore. For users in other jurisdictions, data protection rights may also be directed to the <strong>{jurisdiction.dataAuthority}</strong>; however, the Platform Operator’s obligations are assessed under Singapore PDPA 2012 as the primary statutory baseline.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">8.2 Absolute Regulatory Independence</h3>
                        <p className="mb-4 text-sm">The Platform Operator functions completely independently of all civil state organs, licensing bodies, and government ministries. It maintains no formal corporate joint venture, legal partnership, or agency relationship with any sovereign civil aviation authority (CAA). Profile data, verification badges, and status indicators rendered via third-party application programming interfaces (APIs) are purely informational snapshots and do not constitute official regulatory documentation or licensing authorisation.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">8.3 No Agency and Informational Snapshot Shield</h3>
                        <p className="mb-4 text-sm">The Platform Operator, its officers, and its infrastructure agents expressly disclaim any authority to act on behalf of, represent, or bind any sovereign civil aviation authority. Any reliance on the Platform by a User or third-party enterprise to satisfy statutory airworthiness, medical fitness, or regulatory licensing requirements is at the sole risk and responsibility of the User.</p>
                        <p className="text-sm">Verification outputs are strictly non-binding, represent only a transient data state at the exact time of query, and cannot replace formal credentials issued directly by a governing civil aviation registry. No verification output produced by this Platform constitutes legal proof of airworthiness, medical fitness, or regulatory compliance for the purposes of any civil aviation regulatory requirement. For users in {jurisdiction.country}, the sole regulatory authority for aviation licensing is the <strong>{jurisdiction.aviationAuthority}</strong>; the Platform Operator maintains no formal relationship with this authority.</p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 9 — CROSS-BORDER DATA ORCHESTRATION
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Cross-Border Data Orchestration &amp; Sovereignty (PDPA Section 26)</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">9.1 Extraterritorial Data Transfer Protocol</h3>
                        <p className="mb-3 text-sm">The Platform functions as a distributed regional orchestrator. While the multi-engine data storage infrastructure is primarily anchored in the Republic of Singapore, independent verification partners and subscribing aviation enterprises operate globally across varying national jurisdictions.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Sovereign Consent for Cross-Border Egress', 'Pursuant to Section 26 of the Singapore PDPA 2012, the User explicitly acknowledges that initiating a Regional Verification Sequence or executing a User-Initiated Handshake with an overseas Operator constitutes an unalterable direction to transmit tokenized identity metadata across international borders.'],
                                        ['Comparable Protection Standard', 'The Platform Operator enforces data protection requirements through its service agreements, ensuring that any overseas recipient provides a standard of protection to the transferred personal data that is comparable to the protection under the PDPA. The Platform Operator\'s obligation is restricted to the execution of contractual transfer instruments (e.g., Data Transfer Agreements); the Platform Operator assumes no liability for the subsequent actions, omissions, or regulatory breaches committed by the overseas recipient after transfer.'],
                                        ['User-Directed Transfer', 'Because the cross-border transmission is triggered exclusively by the User\'s own consent action (passkey signature or verification trigger), the Platform Operator\'s liability as a transfer intermediary is structurally limited to the infrastructure conduit function only.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">9.2 Core Credential Anchoring &amp; Live Telemetry Broadcasting</h3>
                        <p className="mb-3 text-sm">The Platform distinguishes between two structurally separate data streams: the User's <strong>Core Regulatory Credentials</strong> (the verified anchor governing Terminal 3 access) and the User's <strong>Live Telemetry Feed</strong> (ongoing, self-asserted operational activity broadcast to subscribing enterprises). These two streams operate under distinct legal and technical rules.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['(a) Regulatory Credential Anchoring', 'Access to Terminal 3 is strictly bound to the active, validated currency of the User\'s Core Regulatory Credentials (including but not limited to pilot licenses, medical certificates, and specific type ratings). Once verified via the annual third-party check cycle, Terminal 3 status remains secure until the credential\'s explicit statutory expiration date or the next annual verification milestone — whichever occurs first. The annual re-verification cycle is the sole mechanism by which Terminal 3 status is re-confirmed or revoked for credential-related reasons.'],
                                        ['(b) Unverified Live Telemetry Feed', 'The Platform permits the User to continuously update their running flight hour metrics within the staging layer to demonstrate operational currency and recency to subscribing enterprises. The User acknowledges and agrees that these ongoing additions are broadcast strictly as "User-Asserted Live Telemetry" — meaning they are self-reported, unverified entries appended after the last formal annual audit snapshot. Subscribing aviation enterprises are explicitly notified of this classification on the corporate dashboard macro display.'],
                                        ['(c) Telemetry Drift Labelling (Not an Access Lockout)', 'If the variance between the live staging hours feed and the last verified annual snapshot exceeds twenty percent (20%), the platform infrastructure does not restrict Terminal 3 access. Instead, the system programmatically attaches a "Live Telemetry Status Indicator" to the macro hours block visible to subscribing operators. This indicator explicitly notices relying aviation enterprises that the additional hours represent unverified, ongoing flight tracking logged since the last formal annual audit. The User\'s liability for the accuracy of these self-asserted telemetry entries is absolute. The Platform Operator is fully indemnified from any reliance placed on unverified telemetry figures by any subscribing operator or third party.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-l-4 border-blue-500 bg-blue-50 rounded-r-xl px-5 py-3 mb-2">
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">Live Telemetry Display Rule — Operator Notice</p>
                            <p className="text-blue-900 text-xs leading-relaxed">Subscribing aviation enterprises viewing a User's profile on the corporate dashboard will see two distinct hour metrics: (1) <strong>Verified Hours</strong> — the cryptographically stamped total confirmed during the last annual audit cycle; and (2) <strong>User-Asserted Live Telemetry</strong> — the self-reported running total logged since that audit. Enterprises are explicitly advised under Section 18.1 that they cannot rely on unverified telemetry figures as the sole basis for any hiring, pathway, or operational decision. The Platform Operator bears zero liability for any hiring or operational decision made in reliance on the User-Asserted Live Telemetry feed.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 10 — SYSTEM VULNERABILITY & CSP DEFENCE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. System Vulnerability &amp; Client-Side Sandbox Defence</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">10.1 Browser Runtime Environment Isolation</h3>
                        <p className="mb-4 text-sm">Because the cryptographic presentation engine executes directly within the user’s localised web browser runtime, the security of the validation environment relies fundamentally on the hygiene and configuration of the user’s endpoint computing container.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">10.2 Content Security Policy (CSP) and Fail-Closed Automation</h3>
                        <p className="mb-4 text-sm">The Platform Operator deploys an aggressive, server-side Content Security Policy (CSP) designed to neutralize Cross-Site Scripting (XSS) vectors, malicious injections, and unauthorised browser extension interference. The User acknowledges that executing custom scripts, developer tools, or intrusive ad-blocking layers that alter the browser’s runtime memory space may disrupt the trust handshake between the primary database engine and the localised container. If a client-side environment alteration or CSP violation is detected, the cryptographic handshake will automatically fail closed. This is a deliberate, non-negotiable security protocol designed to protect user data from untrusted environments.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">10.3 Endpoint Liability Attribution &amp; Harmless Undertaking</h3>
                        <p className="mb-4 text-sm">If a verification failure or unauthorised credential presentation arises from a compromised user operating system, an active malware payload on the pilot’s device, or a local man-in-the-middle exploit, the incident resides entirely outside the Platform Operator’s control boundary. The User holds the Platform Operator completely harmless against any downstream regulatory exposure, career disruptions, or administrative penalties resulting from endpoint vulnerabilities — including XSS attacks, browser extension tampering, user-installed keyloggers, hardware keylogger devices, compromised passkey environments, unpatched local operating systems, or device-level malware intercepting the client-side container session. The Platform Operator is completely immune to data exposure resulting from user-installed browser extensions, keyloggers, or unpatched local operating systems. This immunity is absolute and governed by the aggregate liability valuation cap set forth in Section 7.4.</p>
                        <div className="border-l-4 border-emerald-500 bg-emerald-50 rounded-r-xl px-5 py-3 mb-3">
                            <p className="text-emerald-800 text-xs font-bold uppercase tracking-wide mb-2">Platform Safe Zone — CSP Enforcement Boundary</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Platform-deployed CSP headers block inline script injection at the server response layer</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Client-side container session integrity monitored via origin-bound cryptographic nonces</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Platform Operator fulfils its data-protection duty of care by deploying industry-standard cryptographic boundaries at the server and session layer</span></div>
                            </div>
                        </div>
                        <div className="border-l-4 border-red-500 bg-red-50 rounded-r-xl px-5 py-3 mb-2">
                            <p className="text-red-700 text-xs font-bold uppercase tracking-wide mb-2">User Liability Zone — Beyond the Browser Boundary</p>
                            <p className="text-red-800 text-xs leading-relaxed mb-2">The Platform Operator's duty of care concludes at the client-side browser interface boundary; it does not extend to the protection of the underlying local operating system, peripheral device security, or user-managed browser configurations. The Platform Operator is not an intermediary under PDPA for incidents arising entirely within the User's local device environment.</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform cannot inspect or control user-installed browser extensions or plug-ins of any kind</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform cannot protect against device-level OS compromise, hardware keyloggers, or software keyloggers installed by the User or a third party</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform bears zero liability for credential interception occurring outside the server-to-browser encrypted transport layer, including within the User\'s local device environment</span></div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 11 — CRYPTOGRAPHIC REVOCATION & RECOVERY
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Cryptographic Identity Revocation &amp; Container Recovery Boundaries</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">11.1 Absolute Non-Custodial Key Recovery Limits</h3>
                        <p className="mb-3 text-sm">The platform architecture relies on strict zero-knowledge execution. The private cryptographic keys used to sign credentials inside the localised container are structurally isolated within the User’s hardware-backed native device keychain or hardware authentication framework. The Platform Operator does not manage, store, escrow, or possess backup copies of these private keys.</p>
                        <p className="mb-4 text-sm">If a User loses access to their physical hardware authentication devices, loses control of biometric access vectors, or experiences an unrecoverable failure of their local keychain architecture, the Platform Operator cannot restore data, decrypt credentials, or regenerate the profile state. The User’s sole remedy is to request an account reset sequence. The platform will execute a destructive wipe of the public-key mapping tables within <strong>30 business days</strong> — aligned with applicable regulatory data retention guidelines. The User must then execute an entirely new onboarding sequence and settle all re-initiation costs required by independent verification partners to re-establish Terminal 3 access.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">11.2 Continuous Revocation Syncing &amp; Access Containment</h3>
                        <p className="mb-3 text-sm">If an independent verification partner or an authoritative civil aviation registry issues a signed cryptographic revocation signal regarding a user’s licence, rating, or medical certificate, the infrastructure layer will execute an automated containment sequence:</p>
                        <ul className="space-y-3 mb-4 text-sm text-slate-600">
                            <li><strong>Instantaneous Terminal 3 Egress:</strong> Upon receipt of a live API revocation or failed trust-anchor handshake callback, the infrastructure layer instantly updates the credential status to "Revoked" across all synchronised database engine layers. The corresponding Terminal 3 Access Token is cryptographically invalidated via immediate TTL zero-out, dropping the profile back to Terminal 1 (Baseline) functions within 60 seconds of the network callback event.</li>
                            <li><strong>Anti-Spoofing Isolation & Terminal 1 Containment:</strong> To prevent malicious injection attacks or spoofed civil registry callbacks, any revocation or validation signal must match the signed, public cryptographic signature of the designated authoritative verification issuer. Unsigned or invalidly signed metadata streams trigger an immediate, automated containment protocol: the associated account is isolated to Terminal 1 baseline functions indefinitely, with all Terminal 3 access revoked, pending resolution with the issuing verification partner.</li>
                        </ul>

                        {/* Revocation flow diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="border-2 border-red-300 rounded-lg px-3 py-2 bg-red-50 text-center w-44">
                                        <p className="font-bold text-red-800 text-[10px] uppercase">Civil Registry / Verification Partner</p>
                                        <p className="text-red-600 text-[10px]">Issues signed revocation signal</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-amber-300 rounded-lg px-3 py-2 bg-amber-50 text-center w-48">
                                        <p className="font-bold text-amber-800 text-[10px] uppercase">Infrastructure Controller</p>
                                        <p className="text-amber-600 text-[10px]">Validates signature · Rejects spoofs</p>
                                        <p className="text-amber-700 text-[10px] font-black">Updates credential status records → Revoked</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-center w-44">
                                        <p className="font-bold text-slate-700 text-[10px] uppercase">Terminal 3 Token Invalidated</p>
                                        <p className="text-slate-600 text-[10px]">TTL zero-out · Profile contained to Terminal 1</p>
                                        <p className="text-slate-500 text-[10px] font-bold">Within 60 seconds</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-blue-300 rounded-lg px-3 py-2 bg-blue-50 text-center w-44">
                                        <p className="font-bold text-blue-800 text-[10px] uppercase">Client-Side Container</p>
                                        <p className="text-blue-600 text-[10px]">Local credential status synchronised</p>
                                        <p className="text-blue-700 text-[10px] font-black">Status → Revoked</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 12 — LOGBOOK ANALYTICS & ANTI-FALSIFICATION
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">12. Automated Logbook Verification Analytics &amp; Anti-Falsification Safeguards</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">12.1 The Mechanical Validation Scope</h3>
                        <p className="mb-3 text-sm">The Platform utilises automated data diagnostics to analyse uploaded logbooks, check totals, and check formatting inconsistencies before routing metadata profiles to regional partners. This process functions purely as a <strong>structural syntax check</strong> — not a truth evaluation. The Platform's mechanical diagnostic engine functions as a <strong>pre-filtering structural filter</strong> designed to optimise data interoperability for downstream Verification Partners. This engine performs no qualitative assessment of record authenticity; it is explicitly restricted to syntactic schema validation and does not constitute the Platform as a Validation Partner under the tripartite framework established in Section 17.1.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Sole Responsible Party — User Data Veracity', 'The User acknowledges and agrees that the User is the sole and exclusive responsible party for the veracity, completeness, and accuracy of all data input into the Platform. The Platform provides the input interface and structural schema validation layer, but the User retains sole operational responsibility for the truthfulness of the content submitted. The Platform\'s provision of an input interface shall not be construed as an inducement, endorsement, or validation of the content entered.'],
                                        ['Falsification Detection Liability', 'The mathematical data integrity check does not evaluate the truth of the flight hours claimed. If a User manually inputs fraudulent flight hours, manipulates Cross-Country (XC) metrics, or falsifies multi-engine command logs, and this misrepresentation is subsequently flagged during an active audit by a regional screening provider or flight school, the Platform will immediately and automatically revoke the User\'s Terminal 3 access privileges.'],
                                        ['Indemnification of Placement Deficiencies', 'The User explicitly agrees to indemnify, defend, and hold harmless the Platform Operator, its underlying cloud infrastructure hosts, and subscribing aviation operators against any legal actions, regulatory investigations, or civil damages resulting from fraudulent or manipulated data payloads passing through the client-side cryptographic wallet presentation layer.'],
                                        ['Terminal 3 Access Revocation', 'Accounts confirmed to have submitted fraudulent logbook data, spoofed credential tokens, or manipulated verification payloads are subject to automatic, permanent revocation of Terminal 3 access privileges, triggered by objective algorithmic anomaly detection or an external verification partner\'s adverse finding. Access to the baseline free tier remains unaffected by this revocation. Reporting to the applicable civil aviation authority or regional verification partner is initiated automatically upon confirmation of a verifiable data integrity breach — this process is not subject to discretionary operator judgment and cannot be delayed or suppressed by any party.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-red-50 border border-red-300 rounded-xl px-5 py-3 mb-3">
                            <p className="text-red-700 text-xs font-black uppercase tracking-wide mb-1">⛔ Terminal 3 Access — Permanent Revocation on Anomaly Detection</p>
                            <p className="text-red-800 text-xs leading-relaxed">Confirmed submission of fraudulent logbook data, spoofed credential tokens, or manipulated verification payloads results in <strong>permanent, irrevocable revocation of Terminal 3 access</strong>. This revocation is triggered automatically and cannot be appealed through the Platform. The User retains access to the baseline free tier but is permanently barred from the verified, premium, and corporate-facing environments. The User is hereby placed on notice that this consequence applies regardless of the scale of falsification.</p>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2 mt-5">12.2 Conditional Access Framework &amp; Terminal 3 Operational Restrictions</h3>
                        <div className="space-y-3 mb-4">
                            <div className="border-l-4 border-slate-300 bg-slate-50 rounded-r-xl px-4 py-3">
                                <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-1">(a) The Free Tier Baseline</p>
                                <p className="text-slate-600 text-xs leading-relaxed">The Platform provides a baseline, complimentary infrastructure tier allowing basic data entry and interface utilisation. Access to this baseline tier does not grant or imply access to the Platform's secure verification, matching, or corporate-facing environments, collectively designated as <strong>Terminal 3</strong>.</p>
                            </div>
                            <div className="border-l-4 border-red-400 bg-red-50 rounded-r-xl px-4 py-3">
                                <p className="text-red-700 text-xs font-bold uppercase tracking-wide mb-1">(b) Mandatory Terminal 3 Exclusion</p>
                                <p className="text-red-800 text-xs leading-relaxed">Admission to Terminal 3 is strictly conditional upon the flawless execution of structural schema validation and successful independent verification. The detection of any data anomaly, manual manipulation of flight metrics, or external verification failure shall result in an immediate, automated, and permanent revocation of Terminal 3 access privileges.</p>
                            </div>
                            <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl px-4 py-3">
                                <p className="text-emerald-700 text-xs font-bold uppercase tracking-wide mb-1">(c) No Right of Admission</p>
                                <p className="text-emerald-800 text-xs leading-relaxed">The Platform Operator retains absolute, unilateral discretion over admission criteria to Terminal 3. Restriction from Terminal 3 does not constitute account termination from the baseline platform, but serves as an operational boundary to preserve infrastructure integrity and the safety of subscribing aviation operators. The User acknowledges that remaining in the free baseline tier provides no civil grounds for claims of commercial harm, loss of employment opportunity, or discriminatory de-platforming.</p>
                            </div>
                        </div>

                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-2">
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-2">Platform Validation Scope — What the System Checks vs. What It Cannot Guarantee</p>
                            <div className="grid grid-cols-2 gap-4 text-xs">
                                <div>
                                    <p className="font-bold text-emerald-700 mb-1">✓ Structural Checks (Automated)</p>
                                    <ul className="space-y-0.5 text-slate-600">
                                        <li>Logbook total arithmetic consistency</li>
                                        <li>Date range formatting validation</li>
                                        <li>Certificate expiry date bounds</li>
                                        <li>Field completeness & schema compliance</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-bold text-red-600 mb-1">✗ Truth Evaluation (Not Platform Scope)</p>
                                    <ul className="space-y-0.5 text-slate-600">
                                        <li>Whether flights actually occurred</li>
                                        <li>Whether claimed hours are genuine PIC time</li>
                                        <li>Whether instructor signatures are authentic</li>
                                        <li>Whether medical limitations are self-disclosed</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 13 — GLOBAL DATA SOVEREIGNTY & CROSS-BORDER TRANSFERS
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">13. Global Data Sovereignty, Cross-Border Transfers &amp; Regional Sovereignty Boundaries</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">13.1 Global CBPR &amp; Statutory Data Sovereignty Alignment</h3>
                        <p className="mb-3 text-sm">The distributed multi-engine database layer and real-time synchronisation caching arrays are designed to support <strong>formal organisational certification via accredited Accountability Agents</strong> under the <strong>Global Cross-Border Privacy Rules (Global CBPR) System</strong> and the <strong>Global Privacy Recognition for Processors (PRP) System</strong> — satisfying the Transfer Limitation Obligation under Part 4 of the Singapore Personal Data Protection Act (PDPA). These frameworks serve as active binding instruments; Accountability Agent certifications are the operative mechanism by which the Platform’s cross-border data handling posture is assessed and attested.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Sovereign Storage Isolation Protocol', 'While identity presentation occurs locally via the User\'s decentralized client-side identity container, any ancillary operational metadata, billing logs, and regional routing pointers stored server-side must reside strictly within cloud regions that match the User\'s legal jurisdiction or an approved equivalent-standard zone.'],
                                        ['The Zero-Identifiers Mandate', 'In full compliance with regulatory enforcement directives requiring private organisations to entirely cease using national identification card numbers (including but not limited to Singapore NRIC, US SSN, and equivalent national registry variants across all jurisdictions) for authentication, login, default password generation, or secondary verification flows, the Platform enforces the total elimination of national identification digits from all such infrastructure pipelines. All profile indexing across distributed database shards relies exclusively on cryptographically unique, non-associative UUIDv4 strings generated at account creation.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-amber-50 border border-amber-300 rounded-xl px-5 py-4 mb-5">
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-1">⚠ Regulatory Deadline Alignment — National Identification Elimination</p>
                            <p className="text-amber-900 text-xs leading-relaxed">The Platform operates under a strict operational ban regarding the ingestion, storage, or processing of national identification numbers for authentication or verification sequences. Non-compliance by any upstream or downstream tenant constitutes an unmitigated breach of these Terms, and access to secure network layers shall fail closed automatically to protect infrastructure integrity.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">13.2 Cross-Border Verifiable Presentation Guardrails</h3>
                        <p className="mb-3 text-sm">When a User initiates a Verifiable Presentation of their operational credentials to a foreign aviation enterprise or external regional flight training organisation located across international borders, the data transfer boundaries are subject to strict cryptographic containment:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['The Explicit Presentation Handshake', 'The transit of personal data occurs strictly on demand via a peer-to-peer, encrypted presentation channel initiated entirely by the User\'s active biometric confirmation or hardware key signature. The Platform Operator acts strictly as a neutral data intermediary, never persisting the unencrypted transit payload or maintaining a persistent cache of the decrypted credentials outside the ephemeral memory space of the localised client-side verification container.'],
                                        ['The Extraterritorial Indemnification Clause', 'The User acknowledges that once a Verifiable Presentation is successfully released to a foreign relying party, that data falls under the physical and statutory jurisdiction of the recipient\'s geographic region. Liability for downstream data handling transitions strictly under the terms of a standard Cross-Border Data Transfer Agreement or an explicit User-Consent Exception as recognised under the PDPA Transfer Limitation framework. The Platform\'s transmission mechanisms are designed to comply with the Global Cooperation Arrangement for Privacy Enforcement (CAPE) standards, ensuring that cross-border enforcement actions cannot attribute intermediary liability to the Platform Operator for misuse occurring entirely within the recipient\'s sovereign jurisdiction.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <h3 className="font-semibold text-slate-800 mb-2">13.3 Dynamic Geofencing &amp; Jurisdictional Legal Adapters</h3>
                        <p className="mb-3 text-sm">To maintain compliance across asymmetric regional regulations without mutating core schema structures, the Platform utilises a <strong>runtime edge middleware routing layer</strong> implementing a Modular Legal Adapter Architecture.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Edge-Level IP Geofencing', 'Prior to handling any cryptographic payload or authentication handshake, the Platform\'s edge routing infrastructure intercepts the incoming network request, resolving the client\'s geographic region via deterministic IP-to-location mapping before any data is committed to the core database engines.'],
                                        ['Runtime Legal Adapters', 'Based on the resolved IP jurisdiction, the platform dynamically swaps the active regulatory compliance profile inside the verification pipeline. Core structures remain immutable; only the compliance enforcement overlay is altered per session context.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide w-44">Resolved Region</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide w-44">Active Regulatory Module</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Operational Enforcement Constraint</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['Primary ASEAN Hubs', 'SG-PDPA-Baseline', 'Enforces total national ID digit exclusion from authentication strings; activates mandatory statutory data breach notification flags.'],
                                        ['European Union', 'EU-GDPR-Enforced', 'Hard-locks cryptographic tracking mechanisms; opens automated Data Portability and right-to-erase endpoints.'],
                                        ['United States', 'US-State-Federated', 'Maps data processing rules dynamically to state-level parameters (e.g., California CCPA/CPRA, Texas TDPSA).'],
                                        ['Unlisted / VPN / Proxies', 'Global-CBPR-Core', 'Defaults to the Global CBPR Core operational matrix — data handling never drops below the baseline infrastructure rules.'],
                                    ].map(([region, module_, constraint], i) => (
                                        <tr key={region} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 text-xs align-top">{region}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-xs align-top"><code className="bg-slate-100 px-1 rounded text-[10px]">{module_}</code></td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{constraint}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="border-l-4 border-amber-400 bg-amber-50 rounded-r-xl px-5 py-3 mb-4">
                            <p className="text-amber-800 text-xs font-bold uppercase tracking-wide mb-1">Network Configuration Waiver — VPN &amp; Routing Drift</p>
                            <p className="text-amber-900 text-xs leading-relaxed">Network configuration variables — including commercial VPN usage, corporate proxy routing, satellite relay services, and geographically distributed mesh networks — are the sole responsibility of the User. The Platform bears no liability for automated session invalidations, compliance re-attestation events, or temporary service interruptions resulting from IP-origin drift caused by the User's own routing architecture. Users operating via VPN or equivalent network proxies acknowledge that their resolved IP jurisdiction may trigger automated compliance module switching or re-attestation events as defined in Section 13.3, and accept this as a normal operational consequence of their chosen network configuration.</p>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-2">
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">Jurisdiction-Locked Attestation &amp; Migration Protocol</p>
                            <div className="overflow-x-auto mb-3">
                                <table className="w-full text-sm border-collapse">
                                    <tbody>
                                        {[
                                            ['Origin Jurisdiction Binding', null],
                                            ['IP-Drift Detection & Re-Attestation Trigger', null],
                                        ].map(([label], i) => (
                                            <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                                <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                                <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">
                                                    {label === 'Origin Jurisdiction Binding' ? <span>The resolved geographic jurisdiction at initial account provisioning is persisted as an immutable origin jurisdiction tag indexed to the user’s UUIDv4 profile record. This tag is set once at account creation and cannot be modified by the User without triggering a full re-attestation event.</span> : <span>In the event of a detected change in residency via persistent IP-origin drift, the platform triggers an automated compliance re-attestation event. This event invalidates existing cached credential tokens and forces the user’s decentralized container to re-verify their profile against the target jurisdiction’s specific regulatory module before re-enabling access to secure premium registries or Terminal 3 environments.</span>}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                            <div className="border-l-4 border-emerald-400 bg-emerald-50 rounded-r-xl px-4 py-3 mb-3">
                                <p className="text-emerald-800 text-xs font-bold uppercase tracking-wide mb-1">Regulatory Arbitrage Prevention — Compliance Shield</p>
                                <p className="text-emerald-900 text-xs leading-relaxed">This protocol closes the loophole where a User could register under a less restrictive jurisdiction and subsequently attempt to operate within a stricter one (e.g., Singapore PDPA zone) while still holding a compliance token issued under the original lax module. The re-attestation burden is borne exclusively by the User as Sovereign Data Controller — not the Platform Operator.</p>
                            </div>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Origin jurisdiction tag persisted against UUIDv4 at provisioning — immutable without re-attestation</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>IP-origin drift triggers automated token invalidation and decentralized container re-verification sequence</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Re-attestation event logged with timestamp — provides regulator-accessible compliance audit trail</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform Operator does not bear re-attestation burden — responsibility transitions entirely to the User (Sovereign Controller) per Section 17.1</span></div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 14 — MULTI-TENANT ISOLATION & DB SHARDING
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">14. Multi-Tenant Infrastructure Isolation &amp; Database Sharding Security</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">14.1 Tenant-Level Access Control &amp; Row-Level Security (RLS)</h3>
                        <p className="mb-3 text-sm">To guarantee multi-tenant structural integrity across commercial flight schools, independent charter operators, and regional verification agencies utilising the corporate dashboard, the backend architecture enforces <strong>absolute separation at the database engine layer</strong>.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['The Leak-Proof RLS Mandate', 'Every database table containing tenant-specific operational records, screening requests, or pilot routing logs implements cryptographic Row-Level Security (RLS) enforced natively at the primary database engine layer. RLS policies evaluate the authenticated JWT token context, filtering all queries by a strict tenant identifier claim validated at the database engine without dependency on external application-layer state. Under no circumstances shall cross-tenant joins, unindexed full-table scans, or administrative overrides bypass the RLS layer during standard runtime execution.'],
                                        ['Tenant Metadata Separation', 'Corporate administrative accounts are structurally blocked from inspecting the raw contents of individual decentralized containers or reading the underlying private metadata components of a user\'s logbook, unless the user has explicitly granted a time-bound, cryptographically signed access delegation token.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-5">
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">RLS Enforcement Architecture</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>All queries evaluated against authenticated tenant claims at the native database engine layer</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Cross-tenant joins structurally impossible during standard runtime — no human administrative override path exists</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Decentralized container contents accessible to operators only via time-bound, user-signed cryptographic delegation token</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Administrative backend maintenance access vectors are cryptographically restricted to automated infrastructure routines only — these pathways are structurally empty of unencrypted personal data payloads and cannot be exercised by any human operator or client-side code path</span></div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">14.2 Ephemeral Data Pruning &amp; Sanitisation</h3>
                        <p className="mb-3 text-sm">To limit the risk of long-term data leaks and minimise regulatory liability under global data retention limitations, the platform implements <strong>automated, destructive pruning routines</strong> within its multi-engine synchronisation loop.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Transient Payload Discard Protocol', 'All intermediate screening payloads, unverified file uploads, and webhook callbacks received from independent third-party verification networks are retained in an encrypted, volatile, in-memory caching space for a maximum duration of 72 hours via deterministic Time-To-Live (TTL) key expiration. If a verification lifecycle fails to reach a definitive terminal state within this window due to timeout or formatting errors, the transient data is subject to explicit memory deallocation commands, rendering it completely irrecoverable upon eviction cycle completion.'],
                                        ['Anonymisation of Abandoned Profiles', 'Following an account termination event or the catastrophic key-loss scenario outlined in Section 11.1, database pruning scripts execute a cascade delete across all relational child records. Any residual telemetry data retained for internal diagnostic analytics must be fully aggregated and stripped of all unique longitudinal indicators — including UUIDs, timestamp sequences, and geographic routing markers — prior to storage. This aggregation process meets the PDPC\'s standard for irreversible anonymisation, ensuring the output cannot be re-identified via dataset linkage, statistical inference, or combinatorial profiling attacks.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 15 — OID4VP & SELECTIVE DISCLOSURE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">15. OpenID for Verifiable Presentations (OID4VP) &amp; Selective Disclosure Compliance</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">15.1 Presentation Definitions &amp; OID4VP Protocol</h3>
                        <p className="mb-3 text-sm">The interaction between the User’s client-side decentralized container and the Platform’s Verifier API strictly adheres to standard <strong>OpenID for Verifiable Presentations (OID4VP)</strong> specifications. All requests to verify credentials utilise standardised Presentation Definitions containing explicit cryptographic constraints.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Direct Post Response Mode', 'The Platform enforces the direct_post response mode for all OID4VP flows, or any subsequent secure protocol variation universally accepted by international credential verification frameworks. The Verifier API generates an ephemeral, nonce-backed verification session mapped to a resource identifier scoped to the organisation, tenant, and verifier service. Session nonces are single-use and expire upon first consumption or a hard 5-minute timeout window.'],
                                        ['Format-Agnostic Interoperability', 'The Verifier Service is configured to accept structurally valid W3C Verifiable Credentials signed as JWTs (jwt_vc_json), ISO/IEC 18013-5 mDocs (mso_mdoc), and IETF SD-JWT VCs, or any subsequent secure credential format variations universally accepted by international civil aviation tracking frameworks — ensuring compatibility with existing civil aviation authority credential formats across applicable sovereign registries globally.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">15.2 Selective Disclosure (SD-JWT) &amp; Privacy Preservation</h3>
                        <p className="mb-3 text-sm">To enforce absolute data minimisation during background checks, the Platform defaults to requesting <strong>Selective Disclosure JWTs (SD-JWT VCs)</strong>.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Granular Payload Disclosures', 'When an aviation operator requests pilot data, the OID4VP Presentation Definition will only demand the specific disclosure hashes strictly necessary for the verification task (e.g., verifying a Medical Certificate expiration date without exposing the underlying health condition or diagnostic notes). This aligns with the data minimisation principles under Section 13.1 and Section 16.1.'],
                                        ['Subject-is-Issuer & Holder Binding', 'The verification pipeline mandates subject_is_issuer or is_holder constraints within the input descriptors. The Platform will immediately reject any verifiable presentation where the pilot\'s client-side cryptographic proof of possession (PoP) fails to match the bound credential — preventing credential theft, sybil routing, and replay attacks.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-5 py-4 mb-2">
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-2">SD-JWT Selective Disclosure — Example Aviation Use Case</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Operator requests: <code className="bg-slate-100 px-1 rounded">medical_expiry_date</code> — disclosed</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Operator requests: <code className="bg-slate-100 px-1 rounded">licence_class</code>, <code className="bg-slate-100 px-1 rounded">ratings[]</code> — disclosed</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Health condition, diagnostic notes, waivers — never disclosed; hash salted and withheld</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Full logbook raw data — structurally excluded from all SD-JWT presentation definitions to maintain strict isolation from infrastructure data caches</span></div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-blue-200">
                                <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">🔒 Cryptographic Enforcement Rule</p>
                                <p className="text-blue-900 text-xs leading-relaxed">The Platform Operator acts strictly as a transit medium for the encrypted data envelope. Decryption occurs exclusively within the client-side container runtime; the Platform’s server layer cannot structurally view, decrypt, or store unblinded selectively disclosed claims.</p>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 16 — PDPA SUB-PROCESSOR & BYZANTINE FAULT TOLERANCE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">16. Sub-Processor Transfer Limitations &amp; Engine Synchronisation</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">16.1 Transfer Limitation Obligation (Part 4 PDPA) &amp; Onward Transfers</h3>
                        <p className="mb-3 text-sm">In compliance with international data transfer limitation obligations and mandates restricting national identification usage for authentication, the Platform guarantees <strong>strict chain-of-custody oversight</strong> for all data routing.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Prohibition of Unaudited Onward Transfers', 'When intermediate verification payloads are routed via the Primary Database Engine to a recognised Independent Third-Party Verification Integration, the Platform explicitly prohibits the overseas recipient from executing secondary onward transfers to third parties without executing an automated cryptographic audit validating comparable PDPA-level protections. This restriction complies with Section 26 of the PDPA and the Personal Data Protection Regulations 2021 framework, ensuring that any cross-border cloud routing or processing preserves an equivalent standard of protection regardless of geographic residency.'],
                                        ['Encapsulation Security', 'All cross-border API transmissions are encapsulated in industry-standard encrypted transport protocols, utilising tokenised aliases rather than raw identifying telemetry. In accordance with digital trade agreement parameters for open cross-border data utility, no localised data-residency locks are enforced at the database layer; protection instead relies entirely on zero-knowledge client-side encryption bounds (Section 17.1).'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">16.2 Byzantine Fault Tolerance in Multi-Engine Arbitration</h3>
                        <p className="mb-3 text-sm">Because the system relies on a dual-redundant multi-engine architecture (Primary Database Engine as Engine Alpha, Secondary Synchronisation Engine as Engine Beta), it employs a <strong>deterministic conflict resolution protocol</strong> to prevent state corruption during intermittent regional outages.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Timestamped Vector Clocks', 'All transactional operations (e.g., appending a newly verified flight hour log to the decentralised profile) are stamped with decentralised vector clocks at the client-side container level prior to backend ingestion. This prevents out-of-order write conflicts between Engine Alpha and Engine Beta during asynchronous replication windows.'],
                                        ['Engine Out-of-Sync Arbitration', 'In the event that Engine Alpha and Engine Beta report divergent ledger states for a pilot\'s profile, the system defaults to the cryptographic truth held by the pilot\'s local hardware passkey and decentralized container. The backend engines are strictly treated as highly available caches; the client\'s cryptographically signed OpenID for Verifiable Presentations (OID4VP) history acts as the immutable master record, automatically overwriting asynchronous backend drift upon the next successful login.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-5 py-4 mb-2">
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">Multi-Engine Truth Hierarchy</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="font-black text-slate-800">1.</span><span><strong>Client-Side Decentralized Container</strong> — cryptographically signed OID4VP history = immutable master record</span></div>
                                <div className="flex gap-2"><span className="font-black text-slate-800">2.</span><span><strong>Engine Alpha (Primary Database Engine)</strong> — primary cache, vector-clock stamped writes</span></div>
                                <div className="flex gap-2"><span className="font-black text-slate-800">3.</span><span><strong>Engine Beta (Secondary Synchronisation Engine)</strong> — failover cache, real-time replication from Alpha</span></div>
                                <div className="flex gap-2"><span className="text-amber-600 font-bold">⚠</span><span>Divergence Resolution Rule: Divergence between Alpha and Beta is resolved definitively by the client wallet on the next interactive cryptographic login event — backend data drift is inherently non-authoritative and subordinate to client-side presentation states (Section 17.2)</span></div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 17 — TRIPARTITE DATA CONTROLLER FRAMEWORK
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">17. Tripartite Data Controller Framework &amp; Platform Liability Disconnection</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">17.1 Explicit Tripartite Data Controller Separation</h3>
                        <p className="mb-3 text-sm">To satisfy global privacy architectures (including the Singapore PDPA and GDPR equivalents), this ecosystem rejects both the <strong>single-controller and joint-controller paradigm</strong>. The operational environment is <strong>physically and architecturally engineered</strong> — not merely contractually declared — to establish exactly three completely independent Data Controllers, each exercising autonomous, non-overlapping determination over processing purposes and means. The Platform's zero-knowledge database architecture (Sections 3.2, 13.1, 14.1) structurally enforces this isolation: the Platform Operator cannot access unencrypted pilot credentials at the infrastructure layer, making functional joint-controller status technically impossible.</p>
                        <p className="mb-3 text-sm">Furthermore, because all pilot profile indexing across database shards relies exclusively on <strong>cryptographically unique, non-associative UUIDv4 strings</strong> to the exclusion of national registration numbers (Section 13.1), the Platform structurally lacks the telemetry required to unilaterally link, profile, or aggregate individual identities outside the active client-side wallet instance. Because the Platform is structurally barred from accessing, benefiting from, or reviewing the content of data transactions occurring between the three primary independent controllers, no action or omission by the Platform Operator can mathematically constitute systemic negligence or data mishandling — including under gross negligence or willful misconduct standards — in respect of credential content. The USD $50.00 aggregate liability cap (Section 7.4) reflects this structural impossibility and constitutes a reasonable risk allocation under applicable unfair contract terms legislation globally.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <thead>
                                    <tr className="bg-slate-800 text-white">
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide w-12">#</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide w-56">Controller</th>
                                        <th className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wide">Autonomous Control Domain</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {[
                                        ['1', 'The Individual Pilot — Sovereign Data Controller', 'Exercises exclusive, absolute controller authority over personal identity keys, client-side browser wallet states, individual profile claims, and granular selective disclosure settings. The pilot remains the sole legal controller of their data assets. The Platform Operator has no technical pathway to read, modify, or intercept these assets without explicit pilot-initiated consent.'],
                                        ['2', 'The Aviation Operator / Airline — Operational Data Controller', 'Exercises exclusive controller authority over the creation, posting, and broadcasting of operational training pathways, career prerequisites, and internal recruitment filters. Acts as an independent data consumer of validated data entirely upon pilot initiation — the Platform Operator does not facilitate, influence, or have visibility into the content of these pathway decisions.'],
                                        ['3', 'Authorised Verification Partners — Authoritative Issuers & Controllers', 'Independent Third-Party Verification Integrations and applicable sovereign civil aviation registries act as independent data controllers over their own validation processes, raw record indexing, and the cryptographic generation of verification tokens. The Platform Operator does not have read access to the raw registry data these partners query or the internal screening results they produce.'],
                                    ].map(([num, label, desc], i) => (
                                        <tr key={num} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-black text-slate-500 text-xs align-top">{num}</td>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 text-xs align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">17.2 The Platform Neutrality Mandate &amp; Zero-Liability Clause</h3>
                        <p className="mb-3 text-sm">The Platform Operator functions strictly as an <strong>Infrastructure Controller and Neutral Technical Intermediary</strong>. The platform provides the distributed cloud venue and decentralized container orchestration wires, but exercises <strong>zero control, zero insight, and zero discretionary judgment</strong> over the content of transactions passing between the three primary Data Controllers. This neutrality is not merely contractual — it is architecturally enforced via the zero-knowledge credential pipeline described in Sections 3.2 and 14.1, wherein verified credentials are decoded exclusively client-side and are structurally inaccessible to the Platform Operator at the server layer. Consistent with Section 7.4, the Platform Operator’s maximum aggregate liability for any claim is capped at <strong>USD $50.00</strong> — a ceiling sustained by this structural inability to access, control, or benefit from inter-controller data transactions. This limitation is assessed as reasonable under the Singapore Unfair Contract Terms Act given the zero-access technical architecture, the transient 72-hour limits of the ephemeral caching pruning cycle (Section 14.2), and the definitive arbitration hierarchy that establishes the client-side decentralized container as the sole master record over asynchronous backend drift (Section 16.2).</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Absolute Inter-Controller Disconnection', 'The Platform Operator assumes absolute zero liability for any legal disputes, contractual breaches, regulatory non-compliance, or structural data errors that occur between the Individual Pilot, the Aviation Operator/Airline, and the Verification Partners.'],
                                        ['Verification & Hours Liability Isolation', 'Because flight hours, licensing claims, and academic enrollment statuses are issued exclusively by Independent Verification Partners directly into the pilot\'s sovereign decentralized container, the Platform Operator explicitly disclaims all liability for fraudulent validation stamps, faulty registry queries, or delayed verification outputs.'],
                                        ['Harm Indemnification', 'If a pilot presents a cryptographically signed credential that an airline or manufacturer subsequently relies upon to their detriment (or vice versa), the resolving liability rests entirely between those independent controllers. The Platform Operator is legally insulated from all downstream indemnification, civil actions, or administrative enforcement actions arising from these independent peer-to-peer transactions.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-900 text-white rounded-xl px-5 py-4 mb-2">
                            <p className="text-red-400 text-xs font-black uppercase tracking-wider mb-3">Tripartite Liability Distribution — Absolute</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="border border-blue-400 rounded-lg px-3 py-2 bg-blue-950">
                                    <p className="text-blue-300 font-bold mb-1">Pilot</p>
                                    <p className="text-blue-200 text-[10px]">Sovereign Controller of own wallet, keys &amp; claims</p>
                                </div>
                                <div className="border border-purple-400 rounded-lg px-3 py-2 bg-purple-950">
                                    <p className="text-purple-300 font-bold mb-1">Operator / Airline</p>
                                    <p className="text-purple-200 text-[10px]">Independent Controller of pathway criteria &amp; recruitment decisions</p>
                                </div>
                                <div className="border border-emerald-400 rounded-lg px-3 py-2 bg-emerald-950">
                                    <p className="text-emerald-300 font-bold mb-1">Verification Partner</p>
                                    <p className="text-emerald-200 text-[10px]">Authoritative Issuer of credential tokens &amp; registry validation</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700 text-center">
                                <p className="text-slate-400 text-[10px]">Platform Operator = Neutral Infrastructure Controller · Zero discretionary data access · Zero liability for inter-controller transactions · Byzantine Fault Tolerant caching layer (Section 16.2) is inherently non-authoritative</p>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 18 — LIABILITY DISCONNECTION FOR VERIFICATION FAILURES
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">18. Liability Disconnection for Verification Failures</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">18.1 Verification Outcome Disclaimer — Conduit, Not Adjudicator</h3>
                        <p className="mb-3 text-sm">The Platform functions exclusively as a <strong>neutral cryptographic conduit</strong> between the Individual Pilot (Sovereign Data Controller) and Authorised Verification Partners (Authoritative Issuers). The Platform does not adjudicate, interpret, or produce verification outcomes. All pass, fail, expired, or inconclusive determinations are generated solely by the independent Verification Partner operating under its own regulatory mandate and internal methodology.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['No Adjudicator Status', 'The Platform Operator is not a licensing body, regulatory authority, or verification agency. It does not hold, assess, or certify the validity of any pilot licence, medical certificate, logbook record, or aviation qualification. The Platform\'s role is limited to routing encrypted credential presentations between the client-side decentralized container and the designated Verification Partner\'s API endpoint.'],
                                        ['Outcome Non-Reliance Clause', 'Aviation operators, flight schools, and third-party employers are explicitly advised not to rely solely on Platform-routed verification outcomes as the definitive basis for hiring, licensing, or operational decisions. Independent verification directly with the issuing civil aviation authority remains the sole legally authoritative method of credential confirmation.'],
                                        ['Intermediary Immunity', 'As a neutral data intermediary under Section 17.2 and consistent with the CAPE cross-border enforcement standards established in Section 13.2, the Platform Operator bears zero liability for any employment decision, pathway rejection, or regulatory action taken by a third party on the basis of a verification outcome produced by an independent Verification Partner.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">18.2 Force Majeure of Verification — External Partner Failure</h3>
                        <p className="mb-3 text-sm">The Platform explicitly recognises that Independent Third-Party Verification Integrations and applicable sovereign civil aviation authorities, national registries, and accredited auditing bodies may produce erroneous, delayed, or contradictory verification outputs due to causes entirely beyond the Platform's control.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['False Positive / False Negative Indemnification', 'In the event that a Verification Partner issues a false positive (incorrectly confirming a revoked or fraudulent credential) or a false negative (incorrectly rejecting a valid, current credential), the Platform Operator is wholly indemnified from any resulting legal action, regulatory investigation, or civil damages claim. Liability for erroneous verification outputs rests exclusively with the issuing Verification Partner as an independent data controller under the tripartite framework (Section 17.1).'],
                                        ['Registry Downtime & Delayed Output Disclaimer', 'If any applicable sovereign civil aviation authority, national registry, or accredited auditing body experiences an outage, data migration, or API deprecation that causes a verification delay or an inability to confirm a pilot\'s current licence status, the Platform Operator disclaims all liability for any consequential harm to the pilot\'s employment prospects, pathway eligibility, or professional standing during the period of registry unavailability.'],
                                        ['Partner API Deprecation & Transition Liability', 'If a Verification Partner modifies, deprecates, or terminates its API without prior notice, causing a temporary disruption to the Platform\'s verification routing layer, the Platform Operator will make commercially reasonable efforts to restore service via an alternative partner. No liability accrues to the Platform Operator for service gaps occurring during this transition window.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        <div className="bg-slate-900 text-white rounded-xl px-5 py-4 mb-2">
                            <p className="text-amber-400 text-xs font-black uppercase tracking-wider mb-3">Verification Liability Distribution — Section 18 Absolute Rule</p>
                            <div className="grid grid-cols-3 gap-3 text-xs">
                                <div className="border border-blue-400 rounded-lg px-3 py-2 bg-blue-950">
                                    <p className="text-blue-300 font-bold mb-1">Platform Operator</p>
                                    <p className="text-blue-200 text-[10px]">Neutral conduit · Routes encrypted presentations · Zero adjudicator status · Zero outcome liability</p>
                                </div>
                                <div className="border border-purple-400 rounded-lg px-3 py-2 bg-purple-950">
                                    <p className="text-purple-300 font-bold mb-1">Verification Partner</p>
                                    <p className="text-purple-200 text-[10px]">Independent data controller · Sole owner of outcome accuracy · Bears liability for false positives / negatives</p>
                                </div>
                                <div className="border border-emerald-400 rounded-lg px-3 py-2 bg-emerald-950">
                                    <p className="text-emerald-300 font-bold mb-1">Pilot / Operator</p>
                                    <p className="text-emerald-200 text-[10px]">Independent relying parties · Must independently confirm credentials with issuing CAA · Cannot claim platform liability for outcome reliance</p>
                                </div>
                            </div>
                            <div className="mt-3 pt-3 border-t border-slate-700 text-center">
                                <p className="text-slate-400 text-[10px]">Aggregate Platform Operator liability cap: USD $50.00 (Section 7.4) · CAPE-compliant intermediary immunity (Section 13.2) · Verification Partner as sole authoritative adjudicator (Section 17.1)</p>
                            </div>
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">Contact</h2>
                        <p className="mb-2 text-sm">For formal legal communications regarding infrastructure administration:</p>
                        <p className="font-semibold mb-3"><a href="mailto:legal@pilotrecognition.com" className="text-blue-600 hover:underline">legal@pilotrecognition.com</a></p>
                        <p className="text-sm text-slate-500">For data subject requests and privacy inquiries: <a href="mailto:privacy@pilotrecognition.com" className="text-blue-600 hover:underline">privacy@pilotrecognition.com</a></p>
                    </section>
                </div>
            </div>
        </div>
    );
}

