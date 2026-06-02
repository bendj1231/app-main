import React, { useState, useRef, useEffect } from 'react';
import { X, ShieldCheck, ChevronDown } from 'lucide-react';

interface DataControllerAgreementModalProps {
    isOpen: boolean;
    onClose: () => void;
    onAgree: () => void;
}

export const DataControllerAgreementModal: React.FC<DataControllerAgreementModalProps> = ({
    isOpen,
    onClose,
    onAgree,
}) => {
    const [hasScrolledToBottom, setHasScrolledToBottom] = useState(false);
    const [agreed, setAgreed] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isOpen) {
            setHasScrolledToBottom(false);
            setAgreed(false);
        }
    }, [isOpen]);

    const handleScroll = () => {
        const el = scrollRef.current;
        if (!el) return;
        const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 20;
        if (atBottom) setHasScrolledToBottom(true);
    };

    const handleScrollDown = () => {
        scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
            <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-2xl shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-red-600" size={20} />
                        <div>
                            <p className="text-slate-900 font-bold text-sm tracking-tight">Data Controller Agreement</p>
                            <p className="text-slate-400 text-xs">You are PIC of your data — PR-DCA-001 v1.7</p>
                        </div>
                    </div>
                    <button onClick={onClose} className="text-slate-400 hover:text-slate-900 transition-colors">
                        <X size={18} />
                    </button>
                </div>

                {/* Scroll indicator */}
                {!hasScrolledToBottom && (
                    <button
                        onClick={handleScrollDown}
                        className="absolute right-4 bottom-28 z-10 flex items-center gap-1 bg-red-600 hover:bg-red-700 text-white text-xs font-semibold px-3 py-1.5 rounded-full shadow-lg transition-all animate-bounce"
                    >
                        <ChevronDown size={14} />
                        Scroll to read
                    </button>
                )}

                {/* Scrollable content */}
                <div
                    ref={scrollRef}
                    onScroll={handleScroll}
                    className="flex-1 overflow-y-auto px-6 py-5 text-slate-600 text-sm leading-relaxed space-y-5"
                    style={{ minHeight: 0 }}
                >
                    <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-3 text-xs text-slate-500 leading-relaxed">
                        <strong className="text-slate-700">Data Controller Agreement — WM Pilot Group</strong><br />
                        Document Reference: PR-DCA-001 · Version 1.7 · Effective: 02 June 2026<br />
                        This instrument constitutes a binding infrastructure and data governance agreement between the Data Subject
                        (the Registrant, hereinafter the <em>Credential Custodian</em>) and WM Pilot Group (hereinafter the{' '}
                        <em>Infrastructure Controller</em> or <em>the Platform</em>), effective immediately upon account creation in Terminal 1.
                    </div>

                    {/* 1 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 1 — Decentralized Credential Architecture & Roles</h3>
                        <p className="mb-3 text-xs leading-relaxed">
                            Pursuant to GDPR Art. 4(7), RA 10173 s.3(h), and UAE Federal Decree-Law No. 45/2021 Art. 1,
                            this platform operates on a <strong className="text-black">Self-Sovereign Identity (SSI) framework using W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs)</strong>.
                            Data processing roles within this ecosystem are strictly bifurcated across independent parties:
                        </p>
                        <div className="space-y-2">
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-800 font-bold text-xs mb-1">1. Infrastructure Controller (The Platform) — WM Pilot Group</p>
                                <p className="text-slate-500 text-xs">WM Pilot Group acts as an <strong className="text-black">Independent Data Controller strictly for platform infrastructure, ecosystem routing, and gate governance</strong>. The Platform determines the purposes and means of processing only for: account creation, security session handling (Auth0), passkey synchronization, billing/payment orchestration, and the secure routing of encrypted API webhooks. The Platform operates as a zero-knowledge terminal — hosting only computationally infeasible ciphertext with zero technical or legal means to decrypt, read, or intercept raw credential payloads.</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <p className="text-red-700 font-bold text-xs mb-1">2. Credential Custodian — The Registrant</p>
                                <p className="text-slate-500 text-xs">The Registrant natively holds, owns, and controls their master cryptographic identity credential via their local device hardware. The Registrant acts as the primary Data Controller of their personal identity records, determines the lifecycle of their data, and must explicitly initiate all verification and sharing pathways.</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-700 font-bold text-xs mb-1">3. Verification Controllers — Veremark Ltd. & Regional IDPs</p>
                                <p className="text-slate-500 text-xs">When the Registrant initiates a verification flow to enter Terminal 3, they establish a direct, independent consent agreement with the selected third-party provider (e.g., Veremark Ltd.). These parties act as <strong className="text-black">Independent Data Controllers</strong> for the purpose of querying and verifying raw credential data against civil aviation authorities and ATOs. The Platform merely routes the user-directed transaction and accepts no liability for these external operations.</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-700 font-bold text-xs mb-1">4. Ecosystem Operators & Airlines — Destination Terminals</p>
                                <p className="text-slate-500 text-xs">When the Registrant explicitly routes their profile to an operator lounge (Terminal 2) or an enterprise airline gate (Terminal 3), the receiving airline or operator assumes the role of an <strong className="text-black">Independent Data Controller</strong> the instant they access the data. The Platform acts solely as the connecting skybridge and accepts no liability for subsequent employer processing, hiring decisions, or data retention by the destination terminal.</p>
                            </div>
                        </div>
                    </section>

                    {/* 2 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 2 — Cryptographic Isolation & Data Coupling</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            All personal data fields are subjected to <strong className="text-black">client-side AES-256-GCM encryption</strong> before
                            leaving the user's device. The resulting ciphertext is bound to the Credential Custodian's decentralized W3C credential.
                            Any attempt by the Platform or underlying servers to alter the data structure would break the cryptographic signature,
                            invalidating the credential. <strong className="text-black">The W3C VC standard — not the Platform — dictates data structure.</strong>
                        </p>
                        <p className="text-xs border border-amber-200 rounded-lg px-3 py-2 bg-amber-50 text-amber-800 leading-relaxed">
                            <strong className="text-amber-900">Zero-Knowledge Hosting:</strong> While the Platform holds administrative access to the
                            underlying cloud infrastructure accounts, the data stored within those environments exists solely as computationally infeasible ciphertext.
                            The Platform lacks the technical ability to view, alter, parse, or mine any personal data without the Credential Custodian
                            initiating an active, authenticated cryptographic session.
                        </p>
                    </section>

                    {/* 3 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 3 — Multi-Engine Storage Redundancy Configuration</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            The Platform provides two isolated, independent database environments: the <strong className="text-black">Supabase Inc.</strong> infrastructure environment
                            and the <strong className="text-black">Google LLC (Firebase)</strong> infrastructure environment (both listed as approved technical sub-processors in Article 9).
                        </p>
                        <p className="mb-2 text-xs leading-relaxed">
                            To ensure system availability and disaster recovery compliance under GDPR Article 32, the Platform provides a <strong className="text-black">"Multi-Engine" configuration</strong> enabling
                            simultaneous active-active mirroring of encrypted ciphertext to both environments. The Credential Custodian retains absolute freedom of choice to select a single-engine
                            or multi-engine configuration via their account settings.
                        </p>
                        <p className="text-xs border border-amber-200 rounded-lg px-3 py-2 bg-amber-50 text-amber-800 leading-relaxed">
                            <strong className="text-amber-900">Operational Risk Notice:</strong> If the Credential Custodian manually de-selects the recommended Multi-Engine setup and elects a
                            single-database configuration, they assume all operational risks regarding localized infrastructure vendor outages or downtime for that engine.
                        </p>
                    </section>

                    {/* 4 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 4 — User-Initiated Airspace & Routing Pathways</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            <strong className="text-slate-900">The Platform does not select, mandate, or default the Credential Custodian to any specific employment or verification pipeline.</strong>{' '}
                            The platform interface is divided into two distinct destination lanes:
                        </p>
                        <ul className="space-y-1.5 mb-2">
                            {[
                                ['Terminal 2 — The Open/Free Lounge', 'A pass-through corridor where the Credential Custodian may route unverified, self-declared digital resumes and logbooks to regional operators or flight schools. The Platform does not verify this cargo; the receiving operator assumes full Independent Controller status and sole verification liability upon receipt.'],
                                ['Terminal 3 — The International Standards Zone', 'A premium, firewalled lounge restricted to candidates with fully verified compliance profiles. To open enterprise airline gates, the Credential Custodian must issue an explicit, paid instruction to launch a verification flight via Veremark Ltd. to poll designated civil aviation authorities and ATOs. The Platform never intercepts raw data; it receives only a cryptographically signed verification status displayed as an objective profile completeness index (Pilot Miles Score).'],
                            ].map(([title, detail]) => (
                                <li key={title} className="flex items-start gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 5 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 5 — Passkey & Credential Custody (The Passport Issuer)</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            Private cryptographic keys are generated exclusively on the Credential Custodian's local device within its Trusted Platform Module (TPM) or Secure Enclave.
                            Account access and key recovery are tethered to the user's federated ecosystem provider (Google Passkey & 2-Factor Authentication via Auth0).{' '}
                            <strong className="text-slate-900">The Platform does not, at any point in the data lifecycle, have custody of, access to, or the ability to replicate or reset any private key material.</strong>
                        </p>
                        <p className="text-xs border border-slate-200 rounded-lg px-3 py-2 bg-slate-50 text-slate-500 leading-relaxed">
                            Google LLC acts as the Passport Issuer. If the Credential Custodian loses access to their federated Google account, recovery must be handled via the Issuer.
                            The Platform cannot override a cryptographic lockout.
                        </p>
                    </section>

                    {/* 6 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 6 — System Lifecycle & Data Subject Rights</h3>
                        <p className="text-xs text-slate-400 mb-2">
                            Rights under GDPR Chapter III, RA 10173 Sections 16–18, and UAE Federal Decree-Law No. 45/2021 Art. 14 are natively integrated into the user interface for self-execution.
                        </p>
                        <ul className="space-y-1.5">
                            {[
                                ['Right to Erasure (Art. 17 GDPR)', 'Triggers a permanent, unrecoverable purge of ciphertext rows from all active database engines via the user dashboard.'],
                                ['Right to Portability (Art. 20 GDPR)', 'Natively fulfilled via portability of the W3C Verifiable Credential — exportable to any compatible SSI wallet framework.'],
                                ['Right of Access & Rectification', 'Real-time visibility and management of all data holdings through the user terminal interface.'],
                                ['Right to Object (Art. 21 GDPR)', 'Withdrawal of consent for non-essential processing. Objection to essential processing results in immediate account termination.'],
                                ['Right to Restriction (Art. 18 GDPR)', 'Suspension of active processing pending dispute resolution.'],
                            ].map(([right, detail]) => (
                                <li key={right} className="flex items-start gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <span><strong className="text-slate-800">{right}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 7 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 7 — Infrastructure Liability Limitations</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            The Platform accepts liability solely for the server-side uptime of its routing code, the baseline security configuration of its database layers,
                            and the architectural correctness of its public credential verification registry.
                        </p>
                        <p className="text-xs leading-relaxed">
                            The Platform explicitly accepts <strong className="text-slate-900">no liability</strong> for:
                            (i) <strong className="text-slate-900">Infrastructure vendor breaches</strong> — global security incidents, data leaks, or outages originating within the separate networks of Supabase Inc. or Google LLC;
                            (ii) <strong className="text-slate-900">Third-party verification & IDP failures</strong> — security incidents or compliance failures within the independent networks of Veremark Ltd., civil aviation authorities, or user-nominated ATOs;
                            (iii) <strong className="text-slate-900">Employment actions</strong> — hiring decisions, data retention misconduct, or labour disputes arising after an airline or operator accesses a profile via Terminal 2 or Terminal 3.
                        </p>
                    </section>

                    {/* 8 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 8 — Mandatory Aviation Safety Registry Updates</h3>
                        <p className="text-xs leading-relaxed">
                            The Platform reserves the right to publish a technical revocation or suspension status flag on its <strong className="text-black">public verification registry</strong> upon receiving
                            an authenticated, legally binding directive from a competent civil aviation authority (CAAP, GCAA, EASA, FAA, or equivalent).
                            This is an automated aviation safety compliance obligation.{' '}
                            <strong className="text-slate-900">It does not modify, decrypt, or alter the ciphertext stored within the Credential Custodian's private, zero-knowledge database environments.</strong>
                        </p>
                    </section>

                    {/* 9 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 9 — Mauritius Data Controller Registration</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            <strong className="text-black">WM Pilot Group (Aviation Pathways Limited)</strong> is registered as a Data Controller 
                            with the Data Protection Office of Mauritius under the Data Protection Act 2017.
                        </p>
                        <div className="grid grid-cols-2 gap-2 mb-2 text-xs">
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="font-bold text-green-800">Registration</p>
                                <p className="text-slate-600">Data Protection Office, Mauritius</p>
                            </div>
                            <div className="bg-green-50 border border-green-200 rounded p-2">
                                <p className="font-bold text-green-800">Annual Fee</p>
                                <p className="text-slate-600">MUR 1,000 (~USD 22)</p>
                            </div>
                        </div>
                        <p className="text-xs text-slate-500 leading-relaxed">
                            This registration lawfully entitles the Platform to custody Verifiable Credentials (VCs) 
                            on behalf of pilots with explicit consent for infrastructure custody.
                        </p>
                    </section>

                    {/* 11 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 11 — Approved Technical Sub-Processors (GDPR Art. 28(2))</h3>
                        <p className="mb-2 text-xs text-slate-400 leading-relaxed">
                            To maintain the core routing infrastructure, the Platform utilises the following technical sub-processors:
                        </p>
                        <div className="space-y-1.5 text-xs">
                            {[
                                ['Supabase Inc. / Google LLC (Firebase)', 'Distributed database infrastructure — hosting client-side AES-256-GCM ciphertext only.'],
                                ['Auth0 by Okta Inc.', 'Identity federation and authentication routing — holds zero pilot profile payloads.'],
                                ['walt.id GmbH', 'Verifiable Credential wallet framework — private key custody remains exclusively with the local device.'],
                            ].map(([proc, role]) => (
                                <div key={proc} className="flex gap-2 items-start border-b border-slate-100 pb-1.5 last:border-0">
                                    <span className="text-red-600 font-semibold flex-shrink-0 w-44">{proc}</span>
                                    <span className="text-slate-500">{role}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* 11 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 11 — B2B Co-Marketplace Agreements</h3>
                        <p className="text-xs leading-relaxed">
                            The Credential Custodian acknowledges that third-party digital logbook providers, flight schools, and operators may function as nodes within the platform network.
                            Commercial transaction structures, gate-activation fees, or affiliation credits exchanged between the Platform and external entities
                            (e.g., a 5% integration credit for verified logbook streams) are strictly <strong className="text-black">operational B2B infrastructure agreements</strong>.
                            They do not grant third parties unauthorized access to the Credential Custodian's encrypted vault,
                            nor do they bypass the user-directed presentation model.
                        </p>
                    </section>

                    {/* 12 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 12 — Age & Operational Gate Restrictions</h3>
                        <p className="mb-2 text-xs leading-relaxed">
                            Pursuant to international aviation standards and jurisdictional child privacy statutory rules — including GDPR Art. 8, Republic Act No. 10173 s.12 (Philippines), and UAE Federal Decree-Law No. 45/2021 Art. 6 — special operational constraints apply to legal minors (under 18 years of age) and holders of a Student Pilot License (or equivalent Student Pilot Authorization):
                        </p>
                        <ul className="space-y-1.5">
                            {[
                                ['View-Only Access', 'Minor and Student Pilot accounts are fully permitted to navigate Terminal 1, view available career pathways, and utilise logbook tracking infrastructure.'],
                                ['Terminal 3 Firewall', 'Minor and Student Pilot accounts are structurally restricted from launching Veremark verification flights or submitting profiles to premium international airline gates within Terminal 3.'],
                                ['Terminal 2 Routing', 'Eligible Student Pilots may be routed to designated flight school lounges or cadet-track pathways within Terminal 2 that accept unverified or self-declared training data.'],
                            ].map(([title, detail]) => (
                                <li key={title} className="flex items-start gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* 13 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 13 — Governing Law & Dispute Resolution</h3>
                        <p className="text-xs leading-relaxed">
                            This Agreement is governed by the laws of the <strong className="text-black">United Arab Emirates</strong>,
                            with supplementary application of EU Regulation 2016/679 (GDPR) for EU/EEA residents
                            and Republic Act No. 10173 for Philippine nationals or residents.
                            Any dispute arising from this Agreement or its technical architecture shall be referred to and finally resolved
                            by binding arbitration under the DIAC Arbitration Rules, with the administrative seat in Dubai, UAE.
                            Data protection enquiries:{' '}
                            <span className="text-red-600">privacy@pilotrecognition.com</span>
                        </p>
                    </section>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                        <span>PR-DCA-001 v1.7 — 02 June 2026 — WM Pilot Group</span>
                        <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline transition-colors">
                            Full instrument ↗
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 space-y-3 bg-white rounded-b-2xl">
                    {!hasScrolledToBottom && (
                        <p className="text-red-600 text-xs text-center font-medium">
                            Please scroll to the bottom to read the full agreement before agreeing.
                        </p>
                    )}

                    <label className={`flex items-start gap-3 cursor-pointer group ${!hasScrolledToBottom ? 'opacity-40 pointer-events-none' : ''}`}>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="mt-0.5 w-4 h-4 rounded border-slate-300 bg-white accent-red-600 cursor-pointer"
                        />
                        <span className="text-slate-600 text-xs leading-relaxed group-hover:text-slate-900 transition-colors">
                            I agree to the Data Controller Agreement (Ref: PR-DCA-001, v1.7). By creating an account, I acknowledge that I am the Pilot in Command (PIC) and primary Data Controller of my personal identity records, utilizing the platform's self-sovereign cryptographic architecture. I explicitly instruct WM Pilot Group, acting as my Infrastructure Controller and platform operator, to secure, host, and route my encrypted ciphertext according to the storage engine configuration (Single or Multi-Engine) and routing pathways I select.
                        </span>
                    </label>

                    <button
                        onClick={onAgree}
                        disabled={!agreed || !hasScrolledToBottom}
                        className="w-full py-3 rounded-xl font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-red-200 hover:shadow-lg"
                    >
                        Clear for Departure — Create My Account
                    </button>
                </div>
            </div>
        </div>
    );
};
