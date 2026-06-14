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
            <div className="relative w-full max-w-2xl bg-white border border-slate-200 shadow-2xl flex flex-col max-h-[90vh]">

                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 flex-shrink-0">
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-red-600" size={20} />
                        <div>
                            <p className="text-slate-900 font-bold text-sm tracking-tight">Terms and Conditions</p>
                            <p className="text-slate-400 text-xs">You are PIC of your data — PR-DCA-001 v2.0</p>
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
                        <strong className="text-slate-700">Data Controller Agreement (Ref: PR-DCA-001 v3.0)</strong><br />
                        Document Reference: PR-DCA-001 · Version 3.0 · Effective: 02 June 2026<br />
                        This agreement is entered into by the Registrant (hereinafter the <strong className="text-slate-700">Credential Custodian</strong>) and the <strong className="text-slate-700">Promoters of Aviation Pathways Ltd</strong> (operating provisionally via registered sole trader consultancy infrastructure in the Republic of Mauritius, pending formal corporate novation immediately upon issuance of the Certificate of Incorporation).
                    </div>

                    {/* Article 1 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 1 — Decentralized Trust Architecture & Roles</h3>
                        <p className="mb-3 text-xs leading-relaxed">
                            This platform operates strictly as a cryptographic <strong className="text-black">Trust Broker</strong> using a Self-Sovereign Identity (SSI) framework with W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs). Applicable compliance frameworks: Mauritius Data Protection Act 2017 (DPA 2017), EU GDPR, and Philippines RA 10173.
                        </p>
                        <div className="space-y-2">
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-800 font-bold text-xs mb-1">1. Infrastructure Controller — The Platform</p>
                                <p className="text-slate-500 text-xs">Acts as an Independent Data Controller strictly for platform uptime, subscription billing orchestration, and ecosystem routing gates. The Platform does not collect, host, store, or parse raw pilot credentials.</p>
                            </div>
                            <div className="bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                                <p className="text-red-700 font-bold text-xs mb-1">2. Credential Custodian — You</p>
                                <p className="text-slate-500 text-xs">You natively hold and control your own identity. You are the primary Data Controller of your personal records and must explicitly initiate all verification and sharing actions.</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-700 font-bold text-xs mb-1">3. Verification Controllers — Regional Third-Party Providers</p>
                                <p className="text-slate-500 text-xs">Independent entities (e.g., Veremark Ltd.) that you contract with directly under their independent Terms & Conditions to verify your physical documents. The Platform is not party to that relationship.</p>
                            </div>
                            <div className="bg-white border border-slate-200 rounded-lg px-3 py-2">
                                <p className="text-slate-700 font-bold text-xs mb-1">4. Ecosystem Operators & Airlines</p>
                                <p className="text-slate-500 text-xs">Third-party aviation entities that become independent Data Controllers the moment you explicitly route your verified badge to them.</p>
                            </div>
                        </div>
                    </section>

                    {/* Article 2 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 2 — The Recognition+ Verification & Subscription Flow</h3>
                        <p className="mb-2 text-xs leading-relaxed text-slate-500">The Platform operates on a pure signal-and-response routing architecture. The processing flow is defined as follows:</p>
                        <ol className="space-y-2">
                            {[
                                ['Document Upload', <>The Credential Custodian selects an approved regional verification provider via <span className="font-mono text-red-600">pilotrecognition.com</span> and uploads all required medicals, licences, and logbooks directly to that provider's secure external portal. <strong className="text-slate-700">The Platform never touches or views these documents.</strong></>],
                                ['Subscription Invoice Trigger & Fee Allocation', 'Upon secure notification from the provider that the document payload has been successfully received for auditing, the Platform activates the user\'s Recognition+ status and processes the $100/year subscription fee. This fee is immediately allocated across network infrastructure, payment processing overhead, and third-party audit reservations, rendering it subject to the structured refund provisions outlined in Article 6.'],
                                ['The Status Signal', 'The verification provider transmits a detailed verification report directly to the pilot\'s email and simultaneously passes a binary all-clear verification signal to the Platform.'],
                                ['VC Issuance', <>Upon receiving the all-clear confirmation, the Platform cryptographically signs the account with a Verifiable Credential (VC) badge, permitting the pilot to submit to premium career pathways on <span className="font-mono text-red-600">pilotcareerpathways.com</span>.</>],
                            ].map(([title, detail], i) => (
                                <li key={i} className="flex items-start gap-2 text-xs">
                                    <span className="w-4 h-4 rounded-full bg-red-100 text-red-600 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">{i + 1}</span>
                                    <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ol>
                    </section>

                    {/* Article 3 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 3 — Zero-Data Posture & Liabilities</h3>
                        <p className="text-xs leading-relaxed border border-amber-200 rounded-lg px-3 py-2 bg-amber-50 text-amber-800">
                            Because the Platform maintains a <strong className="text-amber-900">zero-data posture</strong> regarding raw aviation credentials, the Platform accepts no technical or legal liability for data breaches, leaks, or processing errors occurring within the networks of regional verification providers, civil aviation authorities, or destination airlines. All data subject rights regarding modification or deletion of raw verification documents must be executed directly with the respective third-party Verification Controller.
                        </p>
                    </section>

                    {/* Article 4 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 4 — Domain Deployment & Routing Pathways</h3>
                        <p className="mb-3 text-xs leading-relaxed text-slate-700">
                            The Platform functions strictly as a professional networking infrastructure and strategic corporate advisory utility, and does not operate as a labor placement or recruitment agency. The architecture is split across two domains:
                        </p>
                        <div className="space-y-2">
                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                                <p className="text-slate-800 font-bold text-xs mb-1">1. The Identity Layer — <span className="font-mono text-red-600">pilotrecognition.com</span></p>
                                <p className="text-slate-500 text-xs leading-relaxed">The secure interface where you trigger regional verification requests, manage your subscription billing, and hold your issued cryptographic VC badges.</p>
                            </div>
                            <div className="bg-slate-50 border border-slate-200 rounded-lg px-3 py-2.5">
                                <p className="text-slate-800 font-bold text-xs mb-1">2. The Routing Layer — <span className="font-mono text-red-600">pilotcareerpathways.com</span></p>
                                <p className="text-slate-500 text-xs leading-relaxed mb-2">The network directory interface hosting career milestones and airline connection gates, divided into two compliance tiers:</p>
                                <div className="space-y-1.5 pl-2 border-l-2 border-slate-200">
                                    <div>
                                        <p className="text-slate-700 font-semibold text-xs">Open Pathway Tier (Self-Declared)</p>
                                        <p className="text-slate-500 text-xs leading-relaxed">A pass-through corridor for routing unverified, self-declared profiles to regional flight schools or operators. The receiving entity assumes full verification liability upon receipt.</p>
                                    </div>
                                    <div>
                                        <p className="text-slate-700 font-semibold text-xs">International Standards Tier (Verified Baseline)</p>
                                        <p className="text-slate-500 text-xs leading-relaxed">A firewalled environment restricted to Recognition+ members holding a signed VC badge, allowing secure transmission of compliance status to premium international airlines and private charter companies.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>

                    {/* Article 5 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 5 — Passkey & Credential Custody</h3>
                        <p className="text-xs leading-relaxed">
                            Account access is secured via hardware-backed passkeys and federated authentication routers (Auth0). <strong className="text-slate-900">The Platform does not have custody of, access to, or the ability to replicate or reset any private cryptographic keys or master security credentials.</strong>
                        </p>
                    </section>

                    {/* Article 6 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 6 — Subscription Renewals, Cancellations & Audit Refunds</h3>
                        <p className="mb-2 text-xs text-slate-500">Rights under the Mauritius Data Protection Act 2017 and GDPR are natively integrated for self-execution:</p>
                        <ul className="space-y-1.5 mb-4">
                            {[
                                ['Right to Erasure', 'Triggers a permanent deletion of your account footprint and subscription record from the routing database.'],
                                ['Right to Portability', 'Fulfilled via the exportable nature of the W3C Verifiable Credential badge to any compatible external SSI wallet of your choice.'],
                                ['Right of Access & Rectification', 'Real-time visibility and management of your account and subscription data via the user dashboard.'],
                                ['Right to Object', 'Withdrawal of consent for non-essential processing at any time.'],
                                ['Right to Restriction', 'Suspension of active processing pending dispute resolution.'],
                            ].map(([right, detail]) => (
                                <li key={right} className="flex items-start gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <span><strong className="text-slate-800">{right}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ul>
                        <div className="bg-amber-50 border border-amber-200 rounded-lg px-3 py-3 space-y-2">
                            <p className="text-amber-800 font-bold text-xs uppercase tracking-wide">Audit Non-Compliance — Failed Verification Fee Split</p>
                            <p className="text-xs text-slate-600 leading-relaxed">
                                If the selected regional verification provider discovers structural issues, discrepancies, or safety non-compliance in the submitted documentation, a cryptographic VC badge will not be issued. In this event, the account will be temporarily downgraded and the user's processing case handled under the following remediation protocol:
                            </p>
                            <div className="space-y-1.5">
                                <div className="flex items-start gap-2 text-xs">
                                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">1</span>
                                    <span><strong className="text-slate-800">Financial Settlement:</strong> The user will receive a <strong className="text-slate-800">65% refund ($65.00)</strong>. The remaining 35% is permanently retained — 20% ($20.00) to the third-party verification provider for executing the audit, and 15% ($15.00) to the Platform for payment processing, administrative review, and network routing overhead.</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs">
                                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">2</span>
                                    <span><strong className="text-slate-800">Diagnostic Report Delivery:</strong> The Verification Controller will transmit a comprehensive audit discrepancy report directly to the pilot's secure email, explicitly outlining the precise licensing, medical, or logbook gaps that caused the non-compliance.</span>
                                </div>
                                <div className="flex items-start gap-2 text-xs">
                                    <span className="w-4 h-4 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center flex-shrink-0 mt-0.5 text-[10px]">3</span>
                                    <span><strong className="text-slate-800">Resolution & Re-Application:</strong> The Credential Custodian retains the right to resolve the identified discrepancies independently. Once rectified, the user may initiate a completely new verification round via pilotrecognition.com. Any subsequent round constitutes a fresh operational lifecycle and requires a new $100/year subscription activation.</span>
                                </div>
                            </div>
                            <p className="text-xs text-slate-500 leading-relaxed border-t border-amber-200 pt-2">
                                <strong className="text-slate-700">User Agreement to Third-Party Terms:</strong> By initiating the audit, the Credential Custodian explicitly acknowledges that the third-party verification provider's operational assessment is independent. The 35% aggregate retention applies the moment processing begins, regardless of whether the audit concludes with a pass, fail, or conditional flag.
                            </p>
                        </div>
                    </section>

                    {/* Article 7 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 7 — Aviation Safety Registry</h3>
                        <p className="text-xs leading-relaxed">
                            The Platform reserves the right to toggle a technical revocation flag on its public verification registry upon receiving an authenticated, legally binding directive from a competent civil aviation authority (CAAP, GCAA, EASA, FAA, or equivalent). <strong className="text-slate-900">This governs platform-side visibility only and does not access or alter any external third-party data records.</strong>
                        </p>
                    </section>

                    {/* Article 8 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 8 — Age & Operational Ecosystem Restrictions</h3>
                        <p className="mb-2 text-xs leading-relaxed text-slate-500">
                            Pursuant to the Mauritius DPA 2017, GDPR Art. 8, Republic Act No. 10173 (Philippines), special operational constraints apply to legal minors (under 18 years of age) and holders of a Student Pilot License:
                        </p>
                        <ul className="space-y-1.5">
                            {[
                                ['View-Only Access', <>Minor and Student Pilot accounts may navigate the public tracking frameworks of <span className="font-mono text-red-600">pilotcareerpathways.com</span>, view career roadmaps, and use unverified logbook tracking tools.</>],
                                ['Ecosystem Firewall', <>Accounts under 18 are structurally restricted from initiating third-party verification audits via <span className="font-mono text-red-600">pilotrecognition.com</span>, purchasing a Recognition+ subscription, or submitting credentials to premium international airline gates.</>],
                                ['Open Pathway Routing', <>Eligible Student Pilots may route self-declared profiles exclusively to designated flight school lounges or cadet-track pathways within the unverified tiers of <span className="font-mono text-red-600">pilotcareerpathways.com</span>.</>],
                            ].map(([title, detail]) => (
                                <li key={title as string} className="flex items-start gap-2 text-xs">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 flex-shrink-0" />
                                    <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-500">{detail}</span></span>
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Article 9 */}
                    <section>
                        <h3 className="text-red-600 font-bold text-xs mb-2 uppercase tracking-widest">Article 9 — Governing Law & Dispute Resolution</h3>
                        <p className="text-xs leading-relaxed">
                            This Agreement is governed by the laws of the <strong className="text-black">Republic of Mauritius</strong>, including the Data Protection Act 2017 and the Companies Act 2001. Any dispute shall be referred to and finally resolved by binding arbitration under the rules of the <strong className="text-black">MARC Arbitration Centre (Mauritius)</strong>, seat in Port Louis, Republic of Mauritius. Supplementary application of GDPR applies for EU/EEA residents and RA 10173 for Philippine nationals.{' '}
                            <span className="text-red-600">privacy@pilotrecognition.com</span>
                        </p>
                    </section>

                    {/* Entity disclosure */}
                    <div className="bg-amber-50 border border-amber-200 rounded-lg px-4 py-3 text-xs text-amber-800 leading-relaxed">
                        <strong>Entity Disclosure:</strong> This agreement is entered into with the Promoters of Aviation Pathways Ltd, operating provisionally via registered sole trader consultancy infrastructure in the Republic of Mauritius under the Companies Act 2001. All data controller rights, duties, and liabilities shall automatically transfer to Aviation Pathways Ltd upon CBRD issuance of its Certificate of Incorporation.
                    </div>

                    <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs text-slate-400">
                        <span>PR-DCA-001 v3.0 — 02 June 2026 — Promoters of Aviation Pathways Ltd (pre-incorporation)</span>
                        <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-red-600 hover:text-red-700 underline transition-colors">
                            Full instrument ↗
                        </a>
                    </div>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-slate-200 flex-shrink-0 space-y-3 bg-white">
                    <label className={`flex items-start gap-3 cursor-pointer group transition-opacity duration-300 ${!hasScrolledToBottom ? 'opacity-40 pointer-events-none' : 'opacity-100'}`}>
                        <input
                            type="checkbox"
                            checked={agreed}
                            onChange={e => setAgreed(e.target.checked)}
                            className="mt-0.5 w-4 h-4 border-slate-300 bg-white accent-red-600 cursor-pointer"
                        />
                        <span className="text-slate-600 text-xs leading-relaxed group-hover:text-slate-900 transition-colors">
                            I agree to the Terms and Conditions. I acknowledge that I am the Pilot in Command (PIC) of my data, and I explicitly authorize the platform to secure, host, and route my encrypted records based on the pathways I select.
                        </span>
                    </label>

                    <button
                        onClick={onAgree}
                        disabled={!agreed || !hasScrolledToBottom}
                        className="w-full py-3 font-bold text-sm tracking-wide transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed bg-red-600 hover:bg-red-700 text-white shadow-sm hover:shadow-red-200 hover:shadow-lg"
                    >
                        ACCEPT Terms and Conditions
                    </button>
                </div>
            </div>
        </div>
    );
};
