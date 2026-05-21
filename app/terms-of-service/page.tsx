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
                    <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-lg px-4 py-2 mb-8">
                        <span className="text-blue-600 text-xs font-bold uppercase tracking-wider">Jurisdiction detected:</span>
                        <span className="text-blue-800 text-sm font-semibold">{jurisdiction.country}</span>
                        <span className="text-blue-400 text-xs">— {jurisdiction.privacyFramework}</span>
                    </div>
                )}

                <div className="space-y-8 text-slate-700">
                    {/* ── PREAMBLE ── */}
                    <section>
                        <div className="bg-slate-900 text-white rounded-xl p-5 mb-6">
                            <p className="text-red-400 text-xs font-black uppercase tracking-wider mb-1">Platform Classification</p>
                            <p className="font-bold text-base mb-1">walt.id In-Browser Wallet Orchestrator · Multi-Engine Infrastructure Provider · Infrastructure Controller</p>
                            <p className="text-slate-300 text-xs leading-relaxed mb-2">Controls the processing environment and access permission matrices. Does not control or own data content (credentials, verification outcomes, logbook records). Verified Credential Tokens are issued into the pilot's client-side walt.id session — not stored on platform servers.</p>
                            <p className="text-slate-400 text-xs"><span className="text-slate-300 font-semibold">Legal Summary of Processing:</span> The Platform Controls the processing environment and access permission matrices. It does not control or own data content (credentials, verification outcomes, logbook records). Verified Credential Tokens are issued into the pilot's client-side walt.id session — not stored on platform servers.</p>
                        </div>
                        <p className="mb-4 text-sm">
                            This Terms of Service and Privacy Agreement ("Agreement") defines the architecture, data ownership parameters, and system boundary constraints of pilotrecognition.com ("the Platform"). By executing an account creation sequence, you explicitly assent to these provisions.
                        </p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 1 — STRUCTURAL DEFINITIONS & ONBOARDING
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">1. Structural Definitions &amp; Onboarding Protocol</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">1.1 Ultimate Data Sovereignty &amp; walt.id In-Browser Wallet</h3>
                        <p className="mb-3 text-sm">Upon onboarding, the User acknowledges and agrees that they are the <strong>sole Data Controller of their own identity, credentials, and Decentralized Identifier (DID) wallet</strong>. The Platform Operator does not act as a custodian of master identity records.</p>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl px-4 py-3 mb-4">
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">The walt.id Web Interface</p>
                            <p className="text-blue-900 text-xs leading-relaxed mb-2">The platform deploys an embedded, client-side <strong>walt.id Web Wallet instance</strong> directly inside the user's browser runtime. This wallet reads self-claimed or verified datasets structured by the platform's cloud database layer (Supabase & Firebase Sync), presenting them as standardized <strong>W3C Verifiable Credentials</strong>. When a regional verification partner completes their audit, they append a cryptographically signed <strong>Verifiable Presentation (VP)</strong> directly into the browser-managed walt.id session.</p>
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1 mt-2">Interoperable Wallet Syncing</p>
                            <p className="text-blue-900 text-xs leading-relaxed mb-3">The User may elect to <strong>instantiate a native walt.id wallet</strong> via the Platform terminal, or <strong>synchronise a pre-existing, W3C-compliant external DID wallet</strong>. During an external sync, the Platform infrastructure reads only the public DID descriptor string — leaving absolute control of the private keys in the sovereign possession of the User. Any historical credential claims nested inside an externally synced wallet are flagged as <strong>“Pending Read”</strong> until processed through the platform’s regional verification ecosystem.</p>
                            <p className="text-blue-800 text-xs font-bold uppercase tracking-wide mb-1">Infrastructure-to-Wallet State Sync Boundary</p>
                            <p className="text-blue-900 text-xs leading-relaxed">The User acknowledges that the platform’s cloud databases (Supabase/Firebase) function strictly as an <strong>infrastructure staging layer</strong> for raw data entry. The conversion of this data into cryptographically signed Verifiable Credentials occurs exclusively when the walt.id browser wallet queries and commits these entries. If a user modifies their profile or flight hours within the database layer, those changes are <strong>completely invalid for verification or operator pathway matching</strong> until the user executes a manual or session-based “Wallet Sync” to update the client-side walt.id presentation layer. The Platform Operator holds no liability for mismatched data states caused by a user’s failure to synchronise their browser runtime wallet.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">1.2 Cryptographic Key Custody (Passkeys / Keychain)</h3>
                        <p className="mb-3 text-sm">The master cryptographic access keys required to decrypt, sign, and unlock the walt.id profile layers are held exclusively by the User via localised hardware-tied authentication protocols:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['OS Passkeys', 'Cryptographic key pairs secured inside the User\'s localised hardware environment using Google Passkeys or Apple iCloud Keychain.'],
                                        ['Zero Knowledge Architecture', 'The Platform Operator never possesses, transits, receives, or has the technical capability to reset private cryptographic keys.'],
                                        ['Irrecoverable Loss Acknowledgement', 'Loss of access to your device-level passkey architecture results in an unrecoverable loss of the associated DID wallet data layer.'],
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
                        <p className="mb-4 text-sm">In accordance with the Electronic Transactions Act (Cap. 88), clicking the "I Agree" checkbox during account creation constitutes an unalterable electronic signature. At the moment of creation the Platform records a system timestamp (e.g., <code className="text-xs bg-slate-100 px-1 rounded">2026-05-21T03:11:56Z</code>) mapped to the anonymous Auth0 token. This constitutes a non-discretionary regulatory audit trail, not a registry of Sensitive Personal Information (SPI).</p>
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
                                        <p className="text-blue-600 text-[10px]">Supabase · Primary Storage</p>
                                        <p className="text-blue-600 text-[10px]">pilot_credentials table</p>
                                    </div>
                                    <div className="border border-purple-300 rounded-lg px-3 py-2 bg-purple-50 text-center w-44">
                                        <p className="font-bold text-purple-700">Engine Beta</p>
                                        <p className="text-purple-600 text-[10px]">Firebase · Failover Sync</p>
                                        <p className="text-purple-600 text-[10px]">Real-time Redundancy</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">3.1 Dual-Engine High Availability</h3>
                        <p className="mb-4 text-sm">Account states and tokenised routing tables are synchronised across Supabase (Engine Alpha) and Firebase (Engine Beta). In the event of a primary engine failure, the secondary engine automatically sustains active session routing.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">3.2 Asymmetric Cryptographic Vault</h3>
                        <p className="mb-4 text-sm">The Platform Operator functions as an infrastructure vault manager. All verified credentials, DID data, and identity records are cryptographically hashed and written to the <code className="bg-slate-100 px-1 rounded text-xs">pilot_credentials</code> table inside the Supabase storage layer as an encrypted string. The Platform Operator maintains infrastructure-level monitoring over public keys. The User’s hardware passkey signature is required to unlock the rendering pipeline. The <strong>Isolated Instrument Principle</strong> ensures verified credentials are decoded client-side only — fundamentally invisible to external network actors.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">3.3 Browser Local Cache &amp; Runtime Security Boundaries</h3>
                        <p className="mb-3 text-sm">Because the walt.id instance executes within the user’s browser, certain session payloads, keys, and decrypted credentials may temporarily reside in the browser’s local volatile memory, IndexedDB, or localised cache storage to maintain session continuity.</p>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl px-5 py-4 mb-4">
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-2">User Volatile Environment Responsibility</p>
                            <p className="text-amber-900 text-xs leading-relaxed">The User is uniquely responsible for securing their physical device and browser environment. If the User accesses the Platform via a <strong>shared, public, or unencrypted corporate terminal</strong> and fails to log out or clear the browser’s application cache, unauthorized third parties may intercept the active session state. The Platform Operator <strong>explicitly disclaims liability</strong> for local client-side memory scraping, unauthorized terminal access, or browser storage compromises resulting from the User’s failure to secure their device environment.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">3.4 Account Erasure &amp; Sovereign Data Deletion</h3>
                        <p className="mb-3 text-sm">Pursuant to Singapore PDPA 2012, upon account deletion the Platform Operator executes a <strong>destructive erase sequence</strong>, permanently scrubbing the encrypted identifier string from both Supabase and Firebase synchronisation logs within <strong>30 business days</strong>.</p>
                        <div className="overflow-x-auto mb-2">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Key-Pair Erasure Effect', 'Deleting the infrastructure entry breaks the asymmetric key pairing, rendering any lingering backup hashes permanently unrecoverable — even if a forensic copy were obtained.'],
                                        ['walt.id Session Deletion', 'The User retains the independent right to clear or delete their browser-resident walt.id wallet at any time via their device\'s browser settings, independently of platform-level account deletion.'],
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
                                        ['Local Environment-Aware Alignment', 'The pilot\'s dashboard locally evaluates public criteria against the user\'s encrypted, tokenised wallet data — processed strictly inside the client-side browser space.'],
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
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 5 — ENTERPRISE GATEWAY & DUAL-CONSENT
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">5. Commercial Enterprise Dashboard &amp; Dual-Consent Handshake</h2>
                        <p className="mb-4 text-sm">The interaction between pilots and subscribing aviation enterprises is governed by a strict, multi-stage <strong>Cryptographic Consent Handshake</strong>. No pilot data crosses from the Private Vault to an Operator's dashboard without an explicit, user-initiated consent action.</p>

                        <h3 className="font-semibold text-slate-800 mb-3">5.1 The Pilot Onboarding &amp; Verification Lifecycle</h3>
                        <p className="mb-3 text-sm">The framework does not enforce artificial rating or experience barriers to initiate verification. The premium protocol serves to audit and cryptographically stamp the <strong>factual truth of whatever specific operational tier the pilot currently claims</strong> within their wallet environment. All pilot profiles transit a strict progression sequence:</p>

                        {/* Lifecycle progression */}
                        <div className="space-y-2 mb-4">
                            {[
                                { step: '1', label: 'Profile Creation & Initial Claims', tier: 'Terminal 1 · Free Tier', color: 'slate', desc: 'The pilot initialises their non-custodial wallet. The platform\'s cloud database layer (Supabase & Firebase Sync) populates raw tables with self-claimed aviation metadata (e.g., current student status, estimated hours, training logs, institutional enrollment). The wallet tokenises these records into W3C Verifiable Credential format inside the browser environment. The profile resides in the unverified exploratory ecosystem.' },
                                { step: '2', label: 'Pre-Verification Regional Routing & Self-Audit Notice', tier: 'User-Initiated Trigger', color: 'blue', desc: 'The pilot elects to trigger an infrastructure upgrade for USD $100.00/year. The system requests the pilot\'s operational region and assigns the designated regional background check provider (e.g., Veremark). Mandatory Notice: The pilot must confirm that no training logs are falsified, medical certificates are valid, and current institution details are active before data handover.' },
                                { step: '3', label: 'Consensual DID Read & Verification Profile Execution', tier: 'Adaptive Regional Verification', color: 'amber', desc: '' },
                                { step: '4', label: 'Credential Issuance & Platform Triangulation', tier: 'Terminal 3 Clearance', color: 'emerald', desc: 'Upon validation, the independent verification entity issues a permanent Receipt of Validation / Verified Credential Token directly into the pilot\'s wallet and transmits a binary confirmation signal to the platform. The platform triangulates this signal, cryptographically signs a Terminal 3 Access Token, and unlocks the respective verified pathway registries matching the pilot\'s verified tier — including Charter Pathways and exclusive cadet tracks.' },
                            ].map(({ step, label, tier, color, desc }) => (
                                <div key={step} className={`border rounded-xl px-4 py-3 ${ color === 'slate' ? 'bg-slate-50 border-slate-200' : color === 'blue' ? 'bg-blue-50 border-blue-200' : color === 'amber' ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200' }`}>
                                    <div className="flex items-start gap-3">
                                        <div className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-black text-white ${ color === 'slate' ? 'bg-slate-600' : color === 'blue' ? 'bg-blue-600' : color === 'amber' ? 'bg-amber-600' : 'bg-emerald-600' }`}>{step}</div>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900 text-xs">{label}</p>
                                            <p className={`text-[10px] font-semibold uppercase tracking-wide mb-1 ${ color === 'slate' ? 'text-slate-500' : color === 'blue' ? 'text-blue-600' : color === 'amber' ? 'text-amber-600' : 'text-emerald-600' }`}>{tier}</p>
                                            {step === '3' ? (
                                                <div className="text-xs text-slate-600">
                                                    <p className="mb-2">The regional verification provider receives user-initiated consent to access and read the pilot\'s wallet token profiles via secure API handshake. The screening matrix adapts dynamically to the pilot\'s claimed tier:</p>
                                                    <div className="space-y-1.5">
                                                        <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                                                            <p className="font-bold text-amber-800 text-[10px] uppercase mb-0.5">Licensed Tier (CPL / ATPL)</p>
                                                            <p className="text-slate-600 text-[10px]">Verifies active licences, medicals, and credentials directly against civil aviation registries (e.g., CAAP, CAAS, GCAA) and Civil Aviation Authorities (CAA).</p>
                                                        </div>
                                                        <div className="bg-white border border-amber-200 rounded-lg px-3 py-2">
                                                            <p className="font-bold text-amber-800 text-[10px] uppercase mb-0.5">Student / Cadet Tier (SPL / Enrolled)</p>
                                                            <p className="text-slate-600 text-[10px]">Executes an Academic and Institution Enrollment Audit directly with the nominated flight school or ATO to verify active enrollment status, attendance windows, and cadet track placement.</p>
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
                            <p className="text-red-800 text-xs leading-relaxed">The platform provides data diagnostics to capture formatting inconsistencies within your uploaded logbooks; however, <strong>the verification process incurs immediate operational costs</strong>. If your screening reveals revoked licences, lapsed medical checks, or invalid certifications, <strong>the verification fee will be fully processed and is non-refundable</strong>. Your submission will return a failed verification status, preventing access to Terminal 3, due to discrepancies you failed to resolve prior to submission.</p>
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
                                        ['Verification State', 'Renders binary "Verified" or "Unverified" beacon via Recognition+ / Veremark API. No raw credential data visible.'],
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

                        <h3 className="font-semibold text-slate-800 mb-2">5.4 Bring Your Own Verification (BYOV) &amp; External DID Sync Protocol</h3>
                        <p className="mb-3 text-sm">The platform recognises that advanced pilots may possess pre-existing verification records, background clearance tokens, or fully initialised identity payloads stored within an existing external DID wallet. To maintain the absolute cryptographic integrity of Terminal 3, <strong>these external datasets must undergo automated protocol alignment</strong> before any access grant is signed:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Wallet Sync Sequence', 'When a pilot connects a pre-existing external DID wallet, the platform\'s multi-engine infrastructure (Supabase + Firebase Sync) registers the public DID descriptor string. Any historical verification claims nested inside that wallet remain flagged as \'Pending Read\' until processed by the platform\'s regional verification ecosystem.'],
                                        ['Verification-of-Verifier Workflow', 'If a pilot declares a third-party verification credential within their synced wallet, the underlying data payload is securely routed to the platform\'s designated regional verification partner (e.g., Veremark). The regional partner actively audits and cross-references the external issuer\'s cryptographic signatures, authority roots, and registry timestamps against live civil aviation records. The platform does not accept external badges, PDFs, or digital certificates at face value.'],
                                        ['Token Bridge Issuance & Fee', 'Because the regional partner must perform an active, live audit on the external provider\'s historical payload, the standard USD $100.00/year operational fee applies without exception. Once the regional partner validates the external credential\'s currency and authenticity, they execute a trust-anchor handshake — bridging the external record into the platform\'s native Verified Credential Token, stamping it directly into the pilot\'s synced walt.id browser environment, and delivering the required confirmation signal to unlock Terminal 3 pathways.'],
                                        ['Stale & Decayed Data Defence', 'A prior verification by an external provider does not guarantee current compliance. A licence may have been revoked by the CAA, or a medical certificate may have lapsed, since that external check was performed. The re-verification requirement forces the regional partner to validate the live status of any historical token before the platform cryptographically signs a Terminal 3 Access Token.'],
                                        ['Injection Attack Prevention', 'This protocol structurally prevents malicious or unverified actors from injecting fraudulent \'verified\' claims into Terminal 3. All access grants — whether native, externally verified, or wallet-synced — must pass through the regional partner\'s auditing lens before the platform issues the Terminal 3 Access Token.'],
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
                                        <p className="font-bold text-slate-700 text-[10px] uppercase">External / Synced DID Wallet</p>
                                        <p className="text-slate-500 text-[10px]">Pre-existing credentials flagged</p>
                                        <p className="text-slate-400 text-[10px] font-semibold">“Pending Read”</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-amber-300 rounded-lg px-3 py-2 bg-amber-50 text-center w-48">
                                        <p className="font-bold text-amber-800 text-[10px] uppercase">Regional Partner</p>
                                        <p className="text-amber-600 text-[10px]">Live CAA registry re-check</p>
                                        <p className="text-amber-700 text-[10px] font-black">Trust Anchor Handshake</p>
                                        <p className="text-amber-600 text-[10px]">USD $100.00/yr fee applies</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-emerald-300 rounded-lg px-3 py-2 bg-emerald-50 text-center w-44">
                                        <p className="font-bold text-emerald-800 text-[10px] uppercase">Native Token Bridged</p>
                                        <p className="text-emerald-600 text-[10px]">Stamped into synced DID Wallet</p>
                                        <p className="text-emerald-600 text-[10px] font-black">Terminal 3 Unlocked</p>
                                    </div>
                                </div>
                                <p className="text-center text-[10px] text-red-600 font-bold">All paths — native, external, or synced — route through regional partner live audit before Terminal 3 access is signed</p>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">5.5 User-Initiated Handshake &amp; Sovereign Wallet Portability</h3>
                        <p className="mb-3 text-sm">To investigate a pilot's specific sub-credentials beyond the macro dashboard metrics, the Operator must request an active initiation handshake through the platform:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Granular Handshake Activation', 'The request alerts the Pilot via a secure platform notification. The Pilot must explicitly authorise via their hardware passkey signature. No passive or automatic access is possible.'],
                                        ['Strict Read-Only Execution', 'Upon explicit user-initiated passkey approval, the Operator is granted a limited, time-bound, strictly read-only cryptographic lens to view the specific verified credentials required for that pathway. No ownership transfer or raw file extraction occurs.'],
                                        ['Zero-Persistence Caching Block', 'The platform programmatically prevents the Operator from caching, storing, downloading, or replicating the decrypted payload. Once the session closes or consent is revoked, the Operator\'s cryptographic lens immediately de-authorises and shatters.'],
                                        ['Sovereign Exportability & Deletion', 'Because Receipt of Validation and Verified Presentation (VP) tokens are stored directly within the pilot\'s non-custodial walt.id browser session, the User maintains absolute ownership over the asset. The User preserves the unbound right to download, export, or migrate their complete walt.id wallet to alternative third-party container systems, or delete their profile state from the platform entirely, erasing all network data trails outside their localised device.'],
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
                                        ['Identity Keys & Wallet Data', 'The Individual Pilot — Sovereign Data Controller', 'Holds private asymmetric cryptographic keys via localised Google Passkeys or Apple iCloud Keychain. Retains right of complete deletion and export from the walt.id browser runtime to alternative third-party container systems.'],
                                        ['System Rules & Core Venue', 'Pilot Recognition — Infrastructure Controller', 'Manages the software environment, multi-engine database redundancy (Supabase & Firebase Sync), Terminal permission gates, and signs Terminal 3 access grants based on regional provider signals.'],
                                        ['Public & Charter Flight Pathways', 'Flight School / Charter Operator — Independent Data Controller', 'Pays infrastructure subscription to broadcast requirements, enforce verification exclusivity gates, and access candidate investigative workflows under pilot-initiated consent only.'],
                                        ['Live Validation Streams', 'Regional Partners (e.g., Veremark) — Authoritative Verification Issuers', 'Independently audits raw data payloads under user consent, issues credential tokens directly to user wallets, and transmits binary confirmation signals to the platform.'],
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
                                <li><strong>Four-party liability distribution:</strong> Data liability is structurally distributed across the Pilot, Pilot Recognition (infrastructure only), Flight Schools/ATOs, and Veremark/Integration Partners — eliminating single-point regulatory exposure.</li>
                            </ul>
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
                            <p className="text-amber-900 text-xs leading-relaxed">The USD $100.00/year premium infrastructure fee covers the operational cost of initiating and executing the background check protocol via the Platform's regional verification partners. The User explicitly acknowledges that this transaction <strong>pays for the execution of the screening process, not a guaranteed clearance outcome</strong>.</p>
                        </div>
                        <p className="mb-4 text-sm">In the event that a regional screening provider discovers discrepancies, expired credentials, or administrative flags that result in a denial of Terminal 3 access, <strong>the fee remains fully processed and non-refundable</strong>. The Platform Operator shall not be held liable for fees forfeited due to a pilot's failure to properly self-audit their wallet data prior to submission.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.2 Verification &amp; Screening Outcomes</h3>
                        <p className="mb-4 text-sm">The Platform Operator provides the secure technical venue for the validation interface. The actual background checks, credential sourcing, and verification results are executed entirely by <strong>independent third-party regional screening providers</strong>. The Platform Operator disclaims all legal liability for processing delays, negative screening matches, registry access outages, or data discrepancies generated by external providers that result in an onboarding failure into Terminal 3.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.3 Match Optimisation Disclaimer</h3>
                        <p className="mb-4 text-sm">The Platform Operator provides the infrastructure wires and broadcast towers to facilitate connection. The Platform Operator does not adjudicate, influence, or guarantee employment outcomes, training acceptances, or operational placements. The alignment score displayed on a pilot's panel is a localised mathematical calculation based purely on matching user-input values against an operator's public requirements template.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.4 Liability Valuation Cap</h3>
                        <div className="bg-red-50 border border-red-200 rounded-xl px-5 py-4 mb-4">
                            <p className="text-red-800 text-xs font-black uppercase tracking-wide mb-2">Maximum Aggregate Liability</p>
                            <p className="text-red-900 text-sm font-bold">USD $50.00</p>
                            <p className="text-red-700 text-xs mt-1">To the maximum extent permitted by applicable law (including the Singapore Unfair Contract Terms Act), the Platform Operator shall not be held liable for any loss of profits, lost training fees, missed corporate charter contracts, career delays, data access disruptions during an active cryptographic handshake, fees forfeited due to failed verification outcomes, or losses arising from a pilot withholding verification consent. The Platform Operator's maximum aggregate liability for any claim arising out of this ecosystem shall not exceed <strong>USD $50.00</strong>.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">7.5 Payment Architecture &amp; AML Compliance</h3>
                        <p className="mb-4 text-sm">All subscription and verification fees are routed via Helio (MoonPay Commerce). The Platform operates as a neutral automated storefront. Payments are distributed on-chain at the moment of clearance directly to the independent integration partners performing verification functions. The immutable blockchain ledger provides a transparent audit trail satisfying international AML traceability standards. The on-chain receipt identifies the exact institutional partner compensated — any disputes regarding screening results are legally attributable to that specific integration partner layer, not to the Platform Operator.</p>

                        <h3 className="font-semibold text-slate-800 mb-2">7.6 Enterprise Member — 5-Day Activation Credit</h3>
                        <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-2">
                            <p className="text-blue-900 text-xs leading-relaxed">When a verification event involves an ATO or aviation enterprise, a <strong>5% credit</strong> ($4.95 per $99 verification) is automatically reserved for that organisation. The organisation has <strong>5 business days</strong> to activate an Enterprise Seat ($1,000/year) to claim this credit as an onboarding discount. If the window expires, the credit lapses to the platform infrastructure pool. Verification proceeds regardless of membership status.</p>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 8 — GOVERNING LAW & CONTACT
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">8. Governing Law &amp; Regulatory Independence</h2>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5 mb-4">
                            <p className="text-xs text-slate-500 uppercase tracking-wider font-bold mb-1">Detected Jurisdiction</p>
                            <p className="text-slate-900 font-semibold">{jurisdiction.country}</p>
                            <p className="text-slate-500 text-xs mt-1">{jurisdiction.privacyFramework}</p>
                        </div>
                        <p className="mb-4 text-sm">This Agreement, its multi-engine structural configurations, and any disputes arising from the Terminal permission matrices shall be governed strictly by the <strong>laws of the Republic of Singapore</strong>. Any data handling inquiries or complaints may be directed to the <strong>Personal Data Protection Commission (PDPC)</strong> of Singapore.</p>
                        <p className="mb-4 text-sm">For users in other jurisdictions, data protection rights and complaints may also be directed to the <strong>{jurisdiction.dataAuthority}</strong>. The Platform Operator's obligations as Infrastructure Controller are assessed under Singapore PDPA 2012 as the primary statutory baseline.</p>
                        <p className="mb-4 text-sm"><strong>Regulatory Independence:</strong> The Platform Operator functions independently of all civil state organs. It maintains no formal corporate joint venture, partnership, or agency relationship with any civil aviation authority. Profile data rendered via third-party APIs is purely informational and does not constitute official regulatory documentation or licensing authorisation.</p>
                        <p className="text-sm"><strong>Aviation Authority ({jurisdiction.aviationAuthority}):</strong> For users in {jurisdiction.country}, the sole regulatory authority for aviation licensing is the {jurisdiction.aviationAuthority}. Pilot Recognition maintains no formal relationship with this authority. Verification results are for informational purposes only.</p>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 9 — CROSS-BORDER DATA ORCHESTRATION
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">9. Cross-Border Data Orchestration &amp; Sovereignty (PDPA Section 26)</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">9.1 Extraterritorial Data Transfer Protocol</h3>
                        <p className="mb-3 text-sm">The Platform functions as a distributed regional orchestrator. While the multi-engine data storage infrastructure (Supabase &amp; Firebase Sync) is primarily anchored in the Republic of Singapore, regional verification partners (e.g., Veremark) and subscribing aviation enterprises operate globally across varying national jurisdictions (e.g., EASA, FAA, GCAA).</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Sovereign Consent for Cross-Border Egress', 'Pursuant to Section 26 of the Singapore PDPA 2012, the User explicitly acknowledges that initiating a Regional Verification Sequence or executing a User-Initiated Handshake with an overseas Operator constitutes an unalterable direction to transmit tokenized identity metadata across international borders.'],
                                        ['Comparable Protection Standard', 'The Platform Operator enforces data protection requirements through its service agreements, ensuring that any overseas recipient provides a standard of protection to the transferred personal data that is comparable to the protection under the PDPA.'],
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

                        <h3 className="font-semibold text-slate-800 mb-2">9.2 The Re-Verification Sync Loop Gating</h3>
                        <p className="mb-3 text-sm">A pilot's operational metrics (e.g., logged PIC flight hours, medical clearance statuses, type ratings) are inherently dynamic and subject to frequent alteration within the database staging layer.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Stale Token Invalidation Threshold', 'A verified cryptographic stamp issued into the client-side walt.id browser wallet features an algorithmic TTL (Time-To-Live) window of 365 days. Upon expiry, the Terminal 3 access grant is automatically revoked pending a new verification cycle.'],
                                        ['Database Drift Gating', 'If a pilot updates their unverified flight logs in the Supabase/Firebase layer by a variance greater than twenty percent (20%) of their last verified baseline value, the Platform infrastructure will programmatically flag the associated Terminal 3 status as "Out of Sync." The profile\'s verified pathway registries will remain locked to external operators until a localised wallet synchronisation occurs and a supplementary audit token is issued via the regional partner API.'],
                                        ['Drift Liability Attribution', 'Any processing friction, access delays, or pathway lockouts resulting from database drift exceeding the 20% threshold are the exclusive liability of the User. The Platform Operator shall not be held responsible for commercial opportunities missed during a drift-triggered lockout period.'],
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
                        SECTION 10 — SYSTEM VULNERABILITY & CSP DEFENCE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">10. System Vulnerability &amp; Client-Side Script Injection Defence</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">10.1 Browser Runtime Sandbox Separation</h3>
                        <p className="mb-3 text-sm">Because the walt.id orchestration engine executes directly within the user's client-side browser runtime, the integrity of the cryptographic environment relies fundamentally on the hygiene of the user's localised operating container.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Malicious Script & Extension Redaction', 'The Platform Operator deploys an aggressive Content Security Policy (CSP) designed to neutralise Cross-Site Scripting (XSS) vectors and unverified browser extension injections. The User acknowledges that running custom scripts, unauthorised developer tools, or malicious ad-blocking layers that alter the browser\'s runtime environment may break the trust-anchor handshake between Supabase and the walt.id instance.'],
                                        ['System Failure Attribution', 'If a cryptographic verification failure or unauthorised credential presentation arises from a compromised user environment, an active malicious software payload on the pilot\'s device, or a localised man-in-the-middle script injection, the incident resides fundamentally outside the Platform Operator\'s control boundary.'],
                                        ['Absolute Harmless Undertaking', 'The User holds the Platform Operator absolutely harmless against any downstream regulatory exposure, licensing denials, or administrative penalties resulting from client-side vector vulnerabilities — including XSS attacks, browser extension tampering, compromised passkey environments, or device-level malware intercepting the walt.id session.'],
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
                            <p className="text-slate-700 text-xs font-bold uppercase tracking-wide mb-2">Platform CSP Enforcement Boundary</p>
                            <div className="space-y-1 text-xs text-slate-600">
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Platform-deployed CSP headers block inline script injection at the server response layer</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>walt.id session integrity monitored via origin-bound cryptographic nonces</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform cannot inspect or control user-installed browser extensions</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>Platform cannot protect against device-level OS compromise or hardware keyloggers</span></div>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 11 — CRYPTOGRAPHIC REVOCATION & RECOVERY
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">11. Cryptographic Identity Revocation &amp; Wallet Recovery Boundaries</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">11.1 Absolute Non-Custodial Key Recovery Limits</h3>
                        <p className="mb-3 text-sm">The Platform's architectural configuration relies on zero-knowledge execution. The private cryptographic keys generated to sign W3C Verifiable Credentials inside the client-side walt.id instance are structurally isolated within the User's hardware-backed operating environment (Google Passkeys or Apple iCloud Keychain).</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['The Irrecoverable Key Clause', 'The Platform Operator does not manage, store, escrow, or possess backup copies of the User\'s private asymmetric keys. If a User loses access to their physical hardware authentication devices, loses control of their biometric access vectors, or experiences an unrecoverable failure of their localised keychain architecture, the Platform Operator cannot decrypt the associated pilot_credentials entries or regenerate the profile state.'],
                                        ['The Structural Reset Remedy', 'In the event of catastrophic key loss, the User\'s sole remedy is to request an account termination sequence. The multi-engine infrastructure (Supabase & Firebase Sync) will execute a destructive wipe of the public-key mapping table within 30 business days. The User must then execute an entirely new onboarding sequence, re-instantiate a blank walt.id browser wallet, and process an entirely new verification lifecycle — including full repayment of the USD $100.00/year regional screening fee.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">11.2 Token Revocation &amp; Sanction Gating</h3>
                        <p className="mb-3 text-sm">If a third-party regional verification provider (e.g., Veremark) or an authoritative state civil aviation registry (e.g., CAAS, FAA, CAAP) issues a cryptographic revocation signal regarding a pilot's active licence, rating, or medical certificate, the Platform's multi-engine infrastructure will execute an automated response sequence:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Instantaneous Terminal 3 Egress', 'Upon receipt of a live API revocation or failed trust-anchor handshake callback, the infrastructure layer instantly updates the pilot_credentials status to "Revoked" across both Supabase and Firebase. The corresponding Terminal 3 Access Token is algorithmically shattered, dropping the profile back to Terminal 2 (Exploratory) permissions within 60 seconds of the network callback event.'],
                                        ['Anti-Spoofing Isolation', 'To prevent malicious injection attacks or spoofed civil registry callbacks, any revocation or validation signal must match the signed, public cryptographic signature of the designated authoritative regional verification issuer. Unsigned or invalidly signed metadata streams are rejected by the infrastructure controller, and the associated account is permanently blacklisted for potential fraud.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-red-50'}>
                                            <td className={`px-4 py-3 border font-semibold text-xs whitespace-nowrap align-top ${i === 1 ? 'border-red-200 text-red-800' : 'border-slate-200 text-slate-700'} w-52`}>{label}</td>
                                            <td className={`px-4 py-3 border text-xs ${i === 1 ? 'border-red-200 text-red-700' : 'border-slate-200 text-slate-600'}`}>{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        {/* Revocation flow diagram */}
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-2 overflow-x-auto">
                            <div className="min-w-max text-xs space-y-2">
                                <div className="flex items-center gap-2 justify-center">
                                    <div className="border-2 border-red-300 rounded-lg px-3 py-2 bg-red-50 text-center w-44">
                                        <p className="font-bold text-red-800 text-[10px] uppercase">CAA / Regional Partner</p>
                                        <p className="text-red-600 text-[10px]">Issues signed revocation signal</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-amber-300 rounded-lg px-3 py-2 bg-amber-50 text-center w-48">
                                        <p className="font-bold text-amber-800 text-[10px] uppercase">Infrastructure Controller</p>
                                        <p className="text-amber-600 text-[10px]">Validates signature · Rejects spoofs</p>
                                        <p className="text-amber-700 text-[10px] font-black">Updates pilot_credentials → Revoked</p>
                                    </div>
                                    <div className="text-slate-400 font-bold">→</div>
                                    <div className="border-2 border-slate-300 rounded-lg px-3 py-2 bg-slate-100 text-center w-44">
                                        <p className="font-bold text-slate-700 text-[10px] uppercase">Terminal 3 Token Shattered</p>
                                        <p className="text-slate-600 text-[10px]">Profile drops to Terminal 2</p>
                                        <p className="text-slate-500 text-[10px] font-bold">Within 60 seconds</p>
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
                        <p className="mb-3 text-sm">The Platform utilises automated data diagnostics to analyse uploaded logbooks, check totals, and check formatting inconsistencies before routing metadata profiles to regional partners. This process functions purely as a <strong>structural syntax check</strong> — not a truth evaluation.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Falsification Detection Liability', 'The mathematical data integrity check does not evaluate the truth of the flight hours claimed. If a User manually inputs fraudulent flight hours, manipulates Cross-Country (XC) metrics, or falsifies multi-engine command logs, and this misrepresentation is subsequently flagged during an active audit by a regional screening provider or flight school, the Platform will immediately terminate the User\'s operational privileges.'],
                                        ['Indemnification of Placement Deficiencies', 'The User explicitly agrees to indemnify, defend, and hold harmless the Platform Operator, its integration partners, and subscribing aviation operators against any legal actions, regulatory investigations, or civil damages resulting from fraudulent or manipulated data payloads passing through the walt.id client-side wallet presentation layer.'],
                                        ['Permanent Account Blacklisting', 'Accounts confirmed to have submitted fraudulent logbook data, spoofed credential tokens, or manipulated verification payloads are subject to permanent infrastructure-level blacklisting. The Platform Operator reserves the right to report confirmed fraud events to the applicable civil aviation authority and regional verification partner for independent investigation.'],
                                    ].map(([label, desc], i) => (
                                        <tr key={String(label)} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                                            <td className="px-4 py-3 border border-slate-200 font-semibold text-slate-700 w-52 text-xs whitespace-nowrap align-top">{label}</td>
                                            <td className="px-4 py-3 border border-slate-200 text-slate-600 text-xs">{desc}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
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
                        <p className="mb-3 text-sm">The multi-engine infrastructure (Supabase, Firebase Sync, and regional caching arrays) is designed to support <strong>formal organisational certification via accredited Accountability Agents</strong> under the <strong>Global Cross-Border Privacy Rules (Global CBPR) System</strong> and the <strong>Global Privacy Recognition for Processors (PRP) System</strong> — satisfying the Transfer Limitation Obligation under Part 4 of the Singapore PDPA. These frameworks have transitioned from abstract alignment targets to active binding instruments: Accountability Agent certifications are the operative mechanism by which the Platform's cross-border data handling posture is assessed and attested.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Sovereign Storage Isolation Protocol', 'While identity presentation occurs locally via the User\'s client-side walt.id browser wallet, any ancillary operational metadata, billing logs, and regional routing pointers stored server-side must reside strictly within cloud regions that match the user\'s legal jurisdiction or an approved equivalent-standard zone.'],
                                        ['The Zero-Identifiers Mandate', 'In full compliance with the PDPC\'s hard enforcement directive requiring all private organisations to entirely cease using national identification card numbers (e.g., Singapore NRIC) for authentication, login, default password generation, or secondary verification flows by 31 December 2026, the Platform declares total elimination of national identification digits from all such flows effective immediately. This prohibition extends to US SSN and equivalent national registry numbers across all jurisdictions. All pilot profile indexing across Supabase database shards must rely exclusively on cryptographically unique, non-associative UUIDv4 strings generated at account creation.'],
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
                            <p className="text-amber-800 text-xs font-black uppercase tracking-wide mb-1">⚠ Regulatory Deadline — PDPC Hard Enforcement: 31 December 2026</p>
                            <p className="text-amber-900 text-xs leading-relaxed">The PDPC has confirmed that all private organisations operating in or from Singapore must entirely cease using NRIC numbers for any authentication, login, default password generation, or secondary verification flow by this date. This Platform has enacted total elimination of national identification digits from all such flows effective immediately and in advance of the statutory deadline. Non-compliance after 31 December 2026 constitutes a breach of the PDPA enforceable by the PDPC.</p>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">13.2 Cross-Border Verifiable Presentation Guardrails</h3>
                        <p className="mb-3 text-sm">When a User initiates a Verifiable Presentation of their <code className="bg-slate-100 px-1 rounded text-xs">pilot_credentials</code> to a foreign aviation operator or external regional flight school located across international borders, the data transfer boundaries are subject to strict cryptographic containment:</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['The Explicit Presentation Handshake', 'The transit of personal data occurs on demand via a peer-to-peer, TLS 1.3-encrypted presentation channel initiated entirely by the User\'s active biometric confirmation. The Platform Operator acts strictly as a data intermediary, never persisting the unencrypted transit payload or maintaining a persistent cache of the decrypted credentials outside the ephemeral memory space of the walt.id verification container.'],
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
                                        ['Edge-Level IP Geofencing', 'Prior to handling any cryptographic payload or authentication handshake, the Platform\'s edge routing infrastructure intercepts the incoming network request, resolving the client\'s geographic region via deterministic IP-to-location mapping. This resolution occurs at the edge layer before any data is committed to the Supabase or Firebase Sync engines.'],
                                        ['Runtime Legal Adapters', 'Based on the resolved IP jurisdiction, the platform dynamically swaps the active regulatory compliance profile inside the verification pipeline. Core schema structures remain immutable; only the compliance enforcement overlay is swapped per session context.'],
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
                                        ['Singapore / ASEAN', 'SG-PDPA-2026', 'Enforces total NRIC digit exclusion from auth strings; sets mandatory 3-day data breach notification flags.'],
                                        ['European Union', 'EU-GDPR-V2', 'Hard-locks cryptographic tracking mechanisms; opens automated Data Portability and right-to-erase endpoints.'],
                                        ['United States', 'US-State-Federated', 'Maps data processing rules dynamically to state-level parameters (e.g., California CCPA/CPRA, Texas TDPSA).'],
                                        ['Fallback / VPN / Unlisted', 'Global-CBPR-Core', 'Defaults to the Global CBPR Core operational matrix — data handling never drops below the baseline rules outlined in Section 13.1.'],
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
                                                    {label === 'Origin Jurisdiction Binding' ? <span>The resolved geographic jurisdiction at initial account provisioning is persisted as an immutable <code className="bg-slate-100 px-1 rounded">origin_jurisdiction</code> tag indexed to the pilot&apos;s <code className="bg-slate-100 px-1 rounded">UUIDv4</code> profile record. This tag is set once at account creation and cannot be self-modified by the User without triggering a full re-attestation event.</span> : <span>In the event of a detected change in residency via persistent IP-origin drift, the platform triggers an automated compliance re-attestation event. This event invalidates existing cached credential tokens and forces the pilot&apos;s <code className="bg-slate-100 px-1 rounded">walt.id</code> wallet to re-verify their profile against the target jurisdiction&apos;s specific regulatory module (e.g., re-evaluating consent under local GDPR/PDPA equivalents) before re-enabling access to regional flight-school dashboards.</span>}
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
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span><code className="bg-slate-100 px-1 rounded">origin_jurisdiction</code> tag persisted against UUIDv4 at provisioning — immutable without re-attestation</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>IP-origin drift triggers automated token invalidation and walt.id re-verification sequence</span></div>
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
                        <p className="mb-3 text-sm">To guarantee multi-tenant structural integrity across commercial flight schools, independent charter operators, and regional verification agencies utilising the corporate dashboard, the Supabase backend architecture enforces <strong>absolute database separation at the database engine layer</strong>.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['The Leak-Proof RLS Mandate', 'Every database table containing tenant-specific operational records, screening requests, or pilot routing logs must implement Postgres Row-Level Security (RLS). RLS policies are hard-coded to evaluate the authenticated JWT context, filtering queries by a strict tenant_id claim extracted via the Postgres session configuration function current_setting(\'request.jwt.claims\', true) — ensuring the claim is validated natively at the Supabase/Postgres engine layer without dependency on external auth state. Under no circumstances shall cross-tenant cross-joins, unindexed table scans, or administrative overrides bypass the RLS layer during standard runtime execution.'],
                                        ['Tenant Metadata Separation', 'Corporate administrative accounts are structurally blocked from inspecting the raw contents of individual pilot wallets or reading the underlying private metadata components of a pilot\'s decentralised logbook, unless the pilot has explicitly granted a time-bound, cryptographically signed access delegation token.'],
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
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>All queries evaluated against authenticated JWT <code className="bg-slate-100 px-1 rounded">tenant_id</code> claim at the Postgres engine layer</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Cross-tenant joins structurally impossible during standard runtime — no administrative override path</span></div>
                                <div className="flex gap-2"><span className="text-emerald-600 font-bold">✓</span><span>Pilot wallet contents accessible to operators only via time-bound, pilot-signed delegation token</span></div>
                                <div className="flex gap-2"><span className="text-red-500 font-bold">✗</span><span>RLS does not apply to raw Supabase service-role key usage — service-role keys are never exposed to client-side code</span></div>
                            </div>
                        </div>

                        <h3 className="font-semibold text-slate-800 mb-2">14.2 Ephemeral Data Pruning &amp; Sanitisation</h3>
                        <p className="mb-3 text-sm">To limit the risk of long-term data leaks and minimise regulatory liability under global data retention limitations, the platform implements <strong>automated, destructive pruning routines</strong> within its multi-engine synchronisation loop.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Transient Payload Discard Protocol', 'All intermediate screening payloads, unverified file uploads, and webhook callbacks received from external validation providers (e.g., Veremark) are retained in an encrypted, volatile Redis cache memory space for a maximum duration of 72 hours via deterministic TTL (Time-To-Live) key expiration. If a verification lifecycle fails to reach a definitive terminal state ("Approved" or "Rejected") within this window due to timeout or bad formatting, the transient data is subject to explicit memory deallocation via Redis DEL commands, with expired keys evicted from the memory address space and rendered irrecoverable upon eviction cycle completion.'],
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
                        <p className="mb-3 text-sm">The interaction between the User's client-side walt.id wallet and the Platform's Verifier API strictly adheres to the <strong>OpenID for Verifiable Presentations (OID4VP)</strong> specification. All requests to verify a pilot's credentials utilise standardised Presentation Definitions containing cryptographic constraints.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Direct Post Response Mode', 'The Platform enforces the direct_post response mode for all OID4VP flows. The Verifier API generates an ephemeral, nonce-backed verification session mapped to a {organizationID}.{tenantID}.{verifierServiceID} resource identifier. Session nonces are single-use and expire upon first consumption or a hard 5-minute timeout window.'],
                                        ['Format-Agnostic Interoperability', 'The Verifier Service is configured to accept structurally valid W3C Verifiable Credentials signed as JWTs (jwt_vc_json), ISO/IEC 18013-5 mDocs (mso_mdoc), and IETF SD-JWT VCs — ensuring compatibility with existing civil aviation authority credential formats across CAAP, CAAS, GCAA, FAA, and EASA-aligned registries.'],
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
                                <p className="text-blue-900 text-xs leading-relaxed">The Platform Operator acts strictly as a transit medium for the encrypted OID4VP envelope. Under Section 17.2, decryption occurs exclusively in the client-side wallet runtime; the Platform's server layer cannot structurally view or store unblinded selectively disclosed claims.</p>
                            </div>
                        </div>
                    </section>

                    {/* ══════════════════════════════════════════════
                        SECTION 16 — PDPA SUB-PROCESSOR & BYZANTINE FAULT TOLERANCE
                    ══════════════════════════════════════════════ */}
                    <section>
                        <h2 className="text-2xl font-bold text-slate-900 mb-4">16. 2026 PDPA Sub-Processor Transfer Limitations &amp; Engine Synchronisation</h2>

                        <h3 className="font-semibold text-slate-800 mb-2">16.1 Transfer Limitation Obligation (Part 4 PDPA) &amp; Onward Transfers</h3>
                        <p className="mb-3 text-sm">In direct compliance with the updated Singapore Personal Data Protection Act (PDPA) Transfer Limitation Obligations — and impending 2027 mandates banning NRIC/National ID usage for authentication — the Platform guarantees <strong>strict chain-of-custody oversight</strong> for all multi-engine data routing.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Prohibition of Unaudited Onward Transfers', 'When intermediate verification payloads are routed via Engine Alpha (Supabase) to a recognised sub-processor (e.g., Veremark), the Platform explicitly prohibits the overseas recipient from executing secondary onward transfers to third parties without executing an automated cryptographic audit validating comparable PDPA-level protections. This restriction complies with Section 26 of the PDPA and the Personal Data Protection Regulations 2021 framework, ensuring that any cross-border cloud routing or processing preserves an equivalent standard of protection regardless of geographic residency.'],
                                        ['Financial Penalties & Data Breach Extraterritoriality', 'The Platform recognises that non-compliance with Cross-Border Data Transfer guidelines or data-minimisation mandates exposes the operator to enforcement under the PDPC\'s turnover-based penalty structure, which allows for statutory fines of up to 10% of annual Singapore turnover for entities exceeding SGD $10 million, or up to SGD $1 million in all other cases. All cross-border API transmissions are encapsulated in TLS 1.3 tunnels, utilising tokenised aliases rather than raw identifying telemetry. Furthermore, in accordance with the EU-Singapore Digital Trade Agreement (EUSDTA) parameters for open cross-border data utility, no localised data-residency locks are enforced at the database layer; protection instead relies entirely on zero-knowledge client-side encryption bounds (Section 17.1).'],
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
                        <p className="mb-3 text-sm">Because the system relies on a dual-redundant multi-engine architecture (Supabase as Engine Alpha, Firebase Sync as Engine Beta), it employs a <strong>deterministic conflict resolution protocol</strong> to prevent state corruption during intermittent regional outages.</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Timestamped Vector Clocks', 'All transactional operations (e.g., appending a newly verified flight hour log to the decentralised profile) are stamped with decentralised vector clocks at the client-side wallet level prior to backend ingestion. This prevents out-of-order write conflicts between Engine Alpha and Engine Beta during asynchronous replication windows.'],
                                        ['Engine Out-of-Sync Arbitration', 'In the event that Engine Alpha and Engine Beta report divergent ledger states for a pilot\'s profile, the system defaults to the cryptographic truth held by the pilot\'s local hardware passkey/wallet. The backend engines are strictly treated as highly available caches; the client\'s cryptographically signed OpenID for Verifiable Presentations (OID4VP) history acts as the immutable master record, automatically overwriting asynchronous backend drift upon the next successful login.'],
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
                                <div className="flex gap-2"><span className="font-black text-slate-800">1.</span><span><strong>Client walt.id wallet</strong> — cryptographically signed OID4VP history = immutable master record</span></div>
                                <div className="flex gap-2"><span className="font-black text-slate-800">2.</span><span><strong>Engine Alpha (Supabase)</strong> — primary cache, vector-clock stamped writes</span></div>
                                <div className="flex gap-2"><span className="font-black text-slate-800">3.</span><span><strong>Engine Beta (Firebase Sync)</strong> — failover cache, real-time replication from Alpha</span></div>
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
                        <p className="mb-3 text-sm">Furthermore, because all pilot profile indexing across Supabase database shards relies exclusively on <strong>cryptographically unique, non-associative UUIDv4 strings</strong> to the exclusion of national registration numbers (Section 13.1), the Platform structurally lacks the telemetry required to unilaterally link, profile, or aggregate individual identities outside the active client-side walt.id instance.</p>
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
                                        ['3', 'Authorised Verification Partners — Authoritative Issuers & Controllers', 'Third-party background screening networks (e.g., Veremark) and state civil registries act as independent data controllers over their own validation processes, raw record indexing, and the cryptographic generation of verification tokens. The Platform Operator does not have read access to the raw registry data these partners query or the internal screening results they produce.'],
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
                        <p className="mb-3 text-sm">The Platform Operator functions strictly as an <strong>Infrastructure Controller and Neutral Technical Intermediary</strong>. The platform provides the cloud venue (Supabase and Firebase Sync routing pipelines) and wallet orchestration wires, but exercises <strong>zero control, zero insight, and zero discretionary judgment</strong> over the content of transactions passing between the three primary Data Controllers. This neutrality is not merely contractual — it is architecturally enforced via the zero-knowledge credential pipeline described in Sections 3.2 and 14.1, wherein verified credentials are decoded exclusively client-side and are structurally inaccessible to the Platform Operator at the server layer. Consistent with Section 7.4, the Platform Operator's maximum aggregate liability for any claim is capped at <strong>USD $50.00</strong> — a ceiling sustained by this structural inability to access, control, or benefit from inter-controller data transactions. This limitation is assessed as reasonable under the Singapore Unfair Contract Terms Act given the zero-access technical architecture, the transient 72-hour limits of the Redis cache pruning cycle (Section 14.2), and the definitive arbitration hierarchy that establishes the client-side wallet as the sole master record over asynchronous backend drift (Section 16.2).</p>
                        <div className="overflow-x-auto mb-4">
                            <table className="w-full text-sm border-collapse">
                                <tbody>
                                    {[
                                        ['Absolute Inter-Controller Disconnection', 'The Platform Operator assumes absolute zero liability for any legal disputes, contractual breaches, regulatory non-compliance, or structural data errors that occur between the Individual Pilot, the Aviation Operator/Airline, and the Verification Partners.'],
                                        ['Verification & Hours Liability Isolation', 'Because flight hours, licensing claims, and academic enrollment statuses are issued exclusively by Independent Verification Partners directly into the pilot\'s sovereign browser wallet, the Platform Operator explicitly disclaims all liability for fraudulent validation stamps, faulty registry queries, or delayed verification outputs.'],
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

