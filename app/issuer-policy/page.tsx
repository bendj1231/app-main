import React from 'react';
import { TopNavbar } from '../../components/website/components/TopNavbar';
import { ArrowLeft, Shield, CheckCircle, AlertTriangle, Globe, FileText } from 'lucide-react';

interface IssuerPolicyPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export default function IssuerPolicyPage({ onBack, onNavigate, onLogin }: IssuerPolicyPageProps) {
    const lastUpdated = 'May 19, 2026';

    return (
        <div className="min-h-screen bg-[#0a0f1e] text-white">
            {/* Coded by Benjamin Bowler */}
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} onJoinUs={() => {}} onLoginModalOpen={() => {}} />

            <div className="max-w-3xl mx-auto px-6 py-24">
                {/* Back */}
                <button onClick={onBack} className="flex items-center gap-2 text-white/40 hover:text-white text-sm mb-10 transition-colors">
                    <ArrowLeft size={14} /> Back
                </button>

                {/* Header */}
                <div className="mb-12">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-[#00b4d8]/10 border border-[#00b4d8]/20 flex items-center justify-center">
                            <Shield size={18} className="text-[#00b4d8]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-black tracking-tight">Credential Issuer Policy</h1>
                            <p className="text-white/30 text-xs mt-0.5">PilotRecognition — Attestation Service Declaration</p>
                        </div>
                    </div>
                    <p className="text-white/40 text-xs">Last updated: {lastUpdated} · Effective immediately</p>
                </div>

                {/* Key callout */}
                <div className="rounded-2xl bg-[#00b4d8]/5 border border-[#00b4d8]/20 px-6 py-5 mb-10">
                    <p className="text-white/80 text-sm leading-relaxed">
                        PilotRecognition (operated by WM Pilot Group) issues <strong className="text-white">digital attestation credentials</strong> in the W3C Verifiable Credentials (VC) standard. These credentials attest that PilotRecognition has verified specific pilot data through authorised third-party sources. They do <strong className="text-white">not</strong> replace, supersede, or constitute official aviation authority documents.
                    </p>
                </div>

                <div className="flex flex-col gap-8">

                    {/* Section 1 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                            <CheckCircle size={15} className="text-green-400" /> 1. What We Issue
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed mb-4">
                            PilotRecognition issues the following types of attestation credentials, each corresponding to a verified data source:
                        </p>
                        <div className="flex flex-col gap-2">
                            {[
                                { type: 'FlightHoursVC', source: 'MyFlightBook, ForeFlight, other connected logbook providers', desc: 'Attests total verified flight hours as reported by the pilot\'s digital logbook provider.' },
                                { type: 'PilotLicenseVC', source: 'Veremark — CAAP, FAA, CAA, GCAA records', desc: 'Attests that a pilot licence number was verified against the issuing civil aviation authority\'s database.' },
                                { type: 'MedicalCertVC', source: 'Veremark — Designated Medical Examiner records', desc: 'Attests medical certificate class and expiry date as verified through authorised channels.' },
                                { type: 'TypeRatingVC', source: 'Approved Training Organisation (ATO) attestation', desc: 'Attests aircraft type rating as signed off by a verified ATO member on the PilotRecognition network.' },
                            ].map(item => (
                                <div key={item.type} className="rounded-xl bg-white/3 border border-white/8 px-4 py-3">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="text-[#00b4d8] text-xs font-mono font-semibold">{item.type}</span>
                                    </div>
                                    <p className="text-white/60 text-xs leading-relaxed">{item.desc}</p>
                                    <p className="text-white/25 text-[10px] mt-1">Source: {item.source}</p>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 2 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                            <AlertTriangle size={15} className="text-yellow-400" /> 2. What We Are Not
                        </h2>
                        <div className="flex flex-col gap-2 text-sm text-white/50 leading-relaxed">
                            {[
                                'We are not a civil aviation authority and do not issue official pilot licences or medical certificates.',
                                'Our credentials do not satisfy any regulatory requirement that mandates presentation of an original government-issued document.',
                                'We do not make employment decisions. Credentials are provided to facilitate airline and operator hiring workflows.',
                                'We are not a regulated financial institution, identity authority, or government-recognised trust service provider under eIDAS 2.0 (QEAA status not claimed).',
                            ].map((item, i) => (
                                <div key={i} className="flex items-start gap-2.5 rounded-xl bg-yellow-500/5 border border-yellow-500/10 px-4 py-2.5">
                                    <span className="text-yellow-400/60 text-xs mt-0.5 flex-shrink-0">—</span>
                                    <span>{item}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    {/* Section 3 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                            <Globe size={15} className="text-[#00b4d8]" /> 3. Issuer Identity (DID)
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed mb-3">
                            All credentials are cryptographically signed by PilotRecognition using a Decentralised Identifier (DID) anchored to this domain:
                        </p>
                        <div className="rounded-xl bg-black/40 border border-white/10 px-4 py-3 font-mono text-xs text-[#00b4d8]">
                            did:web:pilotrecognition.com
                        </div>
                        <p className="text-white/30 text-xs mt-3">
                            Verifiers can resolve this DID at <span className="text-white/50">https://pilotrecognition.com/.well-known/did.json</span> to confirm the signing key and issuer identity without contacting PilotRecognition directly.
                        </p>
                    </section>

                    {/* Section 4 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                            <FileText size={15} className="text-white/40" /> 4. Verification Process
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Before issuing any credential, PilotRecognition performs at least one of the following verification steps:
                        </p>
                        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/50">
                            {[
                                'OAuth-authenticated data pull from a connected logbook provider (e.g. MyFlightBook)',
                                'Third-party background verification via Veremark against authoritative civil aviation authority databases',
                                'Signed attestation from a verified Approved Training Organisation (ATO) on the PilotRecognition network',
                                'Document upload reviewed against issuing authority records',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-[#00b4d8] flex-shrink-0 mt-0.5">·</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 5 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3 flex items-center gap-2">
                            <Shield size={15} className="text-white/40" /> 5. Credential Validity & Revocation
                        </h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Credentials are issued with a validity period. PilotRecognition reserves the right to revoke any credential if:
                        </p>
                        <ul className="mt-3 flex flex-col gap-1.5 text-sm text-white/50">
                            {[
                                'The underlying data source reports a change (e.g. licence suspended, medical expired)',
                                'Fraudulent or inaccurate information is discovered',
                                'The pilot requests revocation',
                                'The third-party verification partner withdraws their verification result',
                            ].map((item, i) => (
                                <li key={i} className="flex items-start gap-2">
                                    <span className="text-white/20 flex-shrink-0 mt-0.5">·</span>
                                    {item}
                                </li>
                            ))}
                        </ul>
                    </section>

                    {/* Section 6 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3">6. Governing Law</h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            This policy and all credentials issued under it are governed by the laws of the United Arab Emirates (UAE), the domicile of WM Pilot Group operations. For pilots in regulated jurisdictions (EU, UK, US, AU), applicable local privacy and data protection laws also apply as described in our <button onClick={() => onNavigate('terms-of-service')} className="text-[#00b4d8] hover:underline">Terms of Service</button>.
                        </p>
                    </section>

                    {/* Section 7 */}
                    <section>
                        <h2 className="text-base font-bold text-white mb-3">7. Contact</h2>
                        <p className="text-white/50 text-sm leading-relaxed">
                            Questions about this policy or a specific credential: <span className="text-[#00b4d8]">verify@pilotrecognition.com</span>
                        </p>
                    </section>

                </div>

                {/* Footer note */}
                <div className="mt-16 pt-8 border-t border-white/5 text-center">
                    <p className="text-white/20 text-xs">
                        PilotRecognition · WM Pilot Group · Dubai, UAE<br />
                        Credential Issuer Policy v1.0 · {lastUpdated}
                    </p>
                </div>
            </div>
        </div>
    );
}
