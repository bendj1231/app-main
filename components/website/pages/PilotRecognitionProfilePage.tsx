'use client';
import React from 'react';
import { MeshGradient } from '@paper-design/shaders-react';

interface PilotRecognitionProfilePageProps {
    onNavigate?: (page: string) => void;
}

export const PilotRecognitionProfilePage: React.FC<PilotRecognitionProfilePageProps> = () => {
    return (
        <div className="relative min-h-screen flex items-start justify-center px-4 py-12">
            <div className="fixed inset-0 z-0">
                <MeshGradient
                    className="w-full h-full"
                    colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                    speed={0.22}
                />
                <div className="absolute inset-0 bg-gradient-to-b from-slate-900/40 via-slate-800/50 to-slate-950/70" />
            </div>

            <div className="relative z-10 w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ animation: 'glassMaterialize 0.8s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                <div className="p-6 md:p-8">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-2xl font-bold text-slate-900">Pilot Recognition Profile</h1>
                            <p className="text-xs text-slate-500 mt-1">Verified pilots. Real pathways. Industry trust.</p>
                        </div>
                        <a href="/become-member?setup=1" className="text-slate-400 hover:text-slate-600 text-sm font-medium">← Back to setup</a>
                    </div>

                    <div className="space-y-6 text-slate-600 text-sm leading-relaxed">
                        <section>
                            <h2 className="text-base font-bold text-slate-900 mb-2">The Industry Is at a Bottleneck</h2>
                            <p>
                                The aviation industry is collapsing at its base. Flight schools send out pilots, but the real shortage lies within the industry's blindspot: well-qualified pilots are being overlooked, stuck in backlogged instructor pipelines, or leaving the industry entirely.
                            </p>
                            <p className="mt-2">
                                Over <strong>2,000 flight instructor applicants</strong> are backlogged worldwide. The traditional path is clogged. Pilots with 1500+ hours face impossible bars. Many shift careers not because they lack skill, but because they lack <strong>direction, recognition, and a direct line to operators</strong>.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-bold text-slate-900 mb-2">What We're Building</h2>
                            <p>
                                <strong>pilotrecognition.com</strong> is the first industry infrastructure where pilots gain verified recognition for their training and investments. Operated by pilots who face the exact same problems, we're building a verified pool that the industry desperately needs.
                            </p>
                            <p className="mt-2">
                                In partnership with <strong>pilotcareerpathways.com</strong> and <strong>pilotshortage.org</strong>, we connect qualified pilots directly to operator pathways — not job placements, but <strong>career-aligned discovery connections</strong> where operators pull from a verified, vetted pilot pool.
                            </p>
                        </section>

                        <section>
                            <h2 className="text-base font-bold text-slate-900 mb-2">How Recognition Works</h2>
                            <ul className="list-disc pl-5 space-y-1">
                                <li><strong>Free Profile:</strong> Build your pilot profile with licence, hours, and aircraft ratings.</li>
                                <li><strong>Recognition+ ($99/year):</strong> Upload documents for verification. Get the ✓ Verified badge. Gain international recognition and exposure to life-changing pathways.</li>
                                <li><strong>Direct Pathways:</strong> Operators post pathway cards — you align your profile. No resumes. No PDFs. Just verified credentials meeting operator expectations.</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-base font-bold text-slate-900 mb-2">Safety, Compliance & Trust</h2>
                            <p>
                                We follow strict aviation protocol standards. Student pilots may observe and align profiles but cannot submit to ATOs per FAR/PCAR compliance. We are not a recruitment agency — we are <strong>the infrastructure for recognition and connection</strong>.
                            </p>
                            <p className="mt-2 text-xs text-slate-500">
                                pilotrecognition.com, pilotshortage.org, and pilotcareerpathways.com do not hold liability for placements, job offers, or industry-pilot relations. We provide verified profile infrastructure, career alignment direction, and trust in the industry.
                            </p>
                        </section>

                        <div className="pt-4 border-t border-slate-200">
                            <a
                                href="https://pilotshortage.org"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg text-sm transition-colors"
                            >
                                Learn more at pilotshortage.org →
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
