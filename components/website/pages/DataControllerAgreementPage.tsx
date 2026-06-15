'use client';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MeshGradient } from '@paper-design/shaders-react';

interface CollapsibleSectionProps {
    title: string;
    children: React.ReactNode;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({ title, children }) => {
    const [isOpen, setIsOpen] = useState(false);
    return (
        <section className="border-b border-slate-200">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between py-3 text-left text-slate-900 font-semibold text-sm hover:bg-slate-50 rounded-lg px-2"
            >
                {title}
                <span className={`text-slate-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}>▼</span>
            </button>
            {isOpen && (
                <div className="pb-4 px-2 text-slate-600 text-xs leading-relaxed">
                    {children}
                </div>
            )}
        </section>
    );
};

interface DataControllerAgreementPageProps {
    _onBack?: () => void;
    _onNavigate?: (page: string) => void;
}

export const DataControllerAgreementPage: React.FC<DataControllerAgreementPageProps> = ({ _onBack, _onNavigate }) => {
    const navigate = useNavigate();
    const handleBackToSignup = () => {
        navigate('/become-member');
    };

    return (
        <div className="relative min-h-screen flex items-center justify-center px-4 py-12">
            {/* Shader background matching BecomeMemberPage */}
            <div className="fixed inset-0 z-0">
                <MeshGradient
                    className="w-full h-full"
                    colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                    speed={0.22}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/50 to-slate-950/70" />
            </div>

            {/* Content card */}
            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden">
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Data Controller Agreement</h1>
                            <p className="text-xs text-slate-500 mt-1">PR-DCA-001 v3.0 · Effective: 02 June 2026</p>
                        </div>
                        <button
                            onClick={() => navigate(-1)}
                            className="text-slate-500 hover:text-slate-700 text-sm font-medium"
                        >
                            ← Back
                        </button>
                    </div>

                    <div className="text-slate-600 text-sm leading-relaxed mb-6">
                        <p>
                            This agreement is entered into by the Registrant (the <strong className="text-slate-800">Credential Custodian</strong>) and the <strong className="text-slate-800">Promoters of Aviation Pathways Ltd</strong>.
                        </p>
                    </div>

                    {/* Collapsible sections */}
                    <div className="border border-slate-200 rounded-lg overflow-hidden mb-6">
                        <CollapsibleSection title="Article 1: Decentralized Trust Architecture & Roles">
                            <p className="mb-3">This platform operates strictly as a cryptographic Trust Broker using a Self-Sovereign Identity (SSI) framework with W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs).</p>
                            <div className="space-y-2">
                                <p><strong>1. Infrastructure Controller — The Platform</strong></p>
                                <p>Acts as an Independent Data Controller strictly for platform uptime, subscription billing orchestration, and ecosystem routing gates. The Platform does not collect, host, store, or parse raw pilot credentials.</p>
                                <p><strong>2. Credential Custodian — You</strong></p>
                                <p>You natively hold and control your own identity. You are the primary Data Controller of your personal records and must explicitly initiate all verification and sharing actions.</p>
                                <p><strong>3. Verification Controllers — Regional Third-Party Providers</strong></p>
                                <p>Independent entities (e.g., Veremark Ltd.) that you contract with directly under their independent Terms & Conditions to verify your physical documents.</p>
                                <p><strong>4. Ecosystem Operators & Airlines</strong></p>
                                <p>Third-party aviation entities that become independent Data Controllers the moment you explicitly route your verified badge to them.</p>
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Article 2: Recognition+ Verification & Subscription Flow">
                            <p className="mb-3">The Platform operates on a pure signal-and-response routing architecture:</p>
                            <ol className="space-y-2">
                                <li><strong>1. Document Upload:</strong> Upload documents directly to the verification provider's portal. The Platform never touches these documents.</li>
                                <li><strong>2. Subscription Invoice Trigger:</strong> Upon secure notification, the Platform activates Recognition+ status and processes the $100/year subscription fee.</li>
                                <li><strong>3. The Status Signal:</strong> The verification provider transmits a detailed verification report and passes a binary all-clear signal to the Platform.</li>
                                <li><strong>4. VC Issuance:</strong> Upon receiving the all-clear, the Platform cryptographically signs your account with a VC badge.</li>
                            </ol>
                        </CollapsibleSection>

                        <CollapsibleSection title="Article 3: Zero-Data Posture & Liabilities">
                            <p>
                                Because the Platform maintains a <strong>zero-data posture</strong> regarding raw aviation credentials, the Platform accepts no technical or legal liability for data breaches, leaks, or processing errors occurring within the networks of regional verification providers, civil aviation authorities, or destination airlines.
                            </p>
                        </CollapsibleSection>

                        <CollapsibleSection title="Article 4: Domain Deployment & Routing Pathways">
                            <p className="mb-3">The Platform functions strictly as a professional networking infrastructure and strategic corporate advisory utility.</p>
                            <div className="space-y-2">
                                <p><strong>1. The Identity Layer — pilotrecognition.com</strong></p>
                                <p>The secure interface where you trigger regional verification requests, manage your subscription billing, and hold your issued cryptographic VC badges.</p>
                                <p><strong>2. The Routing Layer — pilotcareerpathways.com</strong></p>
                                <p>The network directory interface hosting career milestones and airline connection gates, divided into Open Pathway Tier (self-declared) and International Standards Tier (verified baseline).</p>
                            </div>
                        </CollapsibleSection>

                        <CollapsibleSection title="Article 5: Passkey & Credential Custody">
                            <p>
                                Account access is secured via hardware-backed passkeys and federated authentication routers (Auth0). <strong>The Platform does not have custody of, access to, or the ability to replicate or reset any private cryptographic keys or master security credentials.</strong>
                            </p>
                        </CollapsibleSection>

                        <CollapsibleSection title="Article 6: Subscription Renewals, Cancellations & Audit Refunds">
                            <p className="mb-3">Rights under the Mauritius Data Protection Act 2017 and GDPR are natively integrated:</p>
                            <ul className="space-y-1.5">
                                <li><strong>Right to Erasure:</strong> Permanent deletion of your account footprint and subscription record.</li>
                                <li><strong>Right to Portability:</strong> Exportable W3C Verifiable Credential badge to any compatible external SSI wallet.</li>
                                <li><strong>Right of Access & Rectification:</strong> Real-time visibility and management via the user dashboard.</li>
                                <li><strong>Right to Object:</strong> Withdrawal of consent for non-essential processing at any time.</li>
                                <li><strong>Right to Restriction:</strong> Suspension of active processing pending dispute resolution.</li>
                            </ul>
                            <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                                <p className="font-bold text-amber-800 text-xs uppercase">Audit Non-Compliance — Failed Verification Fee Split</p>
                                <p className="text-xs mt-2">
                                    If verification fails, you receive a <strong>65% refund ($65.00)</strong>. The remaining 35% is retained — 20% ($20.00) to the verification provider for the audit, and 15% ($15.00) to the Platform for processing and overhead.
                                </p>
                            </div>
                        </CollapsibleSection>
                    </div>

                    <button
                        onClick={handleBackToSignup}
                        className="w-full py-3 px-4 bg-slate-800 hover:bg-slate-900 text-white font-bold rounded-lg transition-colors text-sm tracking-wide shadow-lg"
                    >
                        ← Back to Sign Up
                    </button>
                </div>
            </div>
        </div>
    );
};