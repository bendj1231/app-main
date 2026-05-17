import React from 'react';

export const MoaExecutiveSummary: React.FC = () => {
    return (
        <div className="admin-strategy-page">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">CAAP MOA Executive Summary</h1>
                
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                        <strong>Admin Access Only:</strong> This document contains the official Memorandum of Agreement (MOA) executive summary for presentation to CAAP legal and licensing committees.
                    </p>
                </div>

                <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">Memorandum of Agreement</h2>
                    <p className="text-gray-700 mb-4">
                        <strong>BETWEEN</strong><br/>
                        The Civil Aviation Authority of the Philippines (CAAP)<br/>
                        <strong>AND</strong><br/>
                        PilotRecognition.com / WM Pilot Group
                    </p>
                    
                    <h3 className="text-xl font-bold text-gray-900 mt-6 mb-3">Executive Summary</h3>
                    
                    <div className="space-y-4">
                        <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                            <h4 className="font-bold text-green-800 mb-2">Zero-Cost Digital Modernization</h4>
                            <ul className="text-green-700 space-y-1 text-sm">
                                <li>• Traditional model: $2-5M upfront + $500K/year maintenance</li>
                                <li>• Our PPP model: $0 CAAP capital expenditure</li>
                                <li>• Ongoing maintenance: $0 CAAP operational cost</li>
                                <li>• Manual verification backlog: Eliminated</li>
                                <li>• Data breach liability: Zero-knowledge architecture</li>
                                <li>• Passive revenue: 5% ($5.00 per verification)</li>
                            </ul>
                        </div>

                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                            <h4 className="font-bold text-blue-800 mb-2">The 5% Digital Modernization Grant</h4>
                            <ul className="text-blue-700 space-y-1 text-sm">
                                <li>• <strong>Structure:</strong> $5.00 USD per transaction (5% "Infrastructure Utilization Fee")</li>
                                <li>• <strong>Payment:</strong> Automated via Landbank Link.BizPortal API integration</li>
                                <li>• <strong>Legal:</strong> RA 11966 § 5.2 (Government may charge fees for digital services)</li>
                                <li>• <strong>What CAAP Receives:</strong> Passive revenue, IT modernization fund, automated treasury deposit</li>
                                <li>• <strong>Legal Safeguards:</strong> Administrative cost-recovery, transparent pricing, COA compliance</li>
                            </ul>
                        </div>

                        <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                            <h4 className="font-bold text-purple-800 mb-2">What PilotRecognition Provides (At Zero Cost to CAAP)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="font-bold text-purple-700">Technical Infrastructure:</p>
                                    <ul className="text-purple-600 space-y-1">
                                        <li>• 8-Stage Cryptographic Verification Chain</li>
                                        <li>• Veremark Integration (automated verification)</li>
                                        <li>• Zero-Knowledge Architecture (no PII storage)</li>
                                        <li>• Verepass Digital Wallet (blockchain tokens)</li>
                                        <li>• Real-Time Dashboard (CAAP view)</li>
                                    </ul>
                                </div>
                                <div>
                                    <p className="font-bold text-purple-700">Operational Support:</p>
                                    <ul className="text-purple-600 space-y-1">
                                        <li>• 24/7 Platform Monitoring (99.9% uptime SLA)</li>
                                        <li>• Customer Support (English/Tagalog)</li>
                                        <li>• Fraud Protection (automated detection)</li>
                                        <li>• Compliance Updates (regulatory changes)</li>
                                        <li>• Security & Maintenance</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="bg-orange-50 border border-orange-300 rounded-lg p-4">
                            <h4 className="font-bold text-orange-800 mb-2">Government Endorsement & Promotion</h4>
                            <ul className="text-orange-700 space-y-1 text-sm">
                                <li>• <strong>Official Recognition:</strong> "CAAP-Approved Digital Verification Partner"</li>
                                <li>• <strong>Portal Integration:</strong> Banner on CAAP e-Licensing portal</li>
                                <li>• <strong>Advisory to ATOs:</strong> Memorandum Circular recommending platform</li>
                                <li>• <strong>Regulatory Support:</strong> Fast-track verification requests</li>
                                <li>• <strong>API Access:</strong> Secure, read-only API to registry database</li>
                            </ul>
                        </div>

                        <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                            <h4 className="font-bold text-red-800 mb-2">Legal Protections & Liability Shield</h4>
                            <ul className="text-red-700 space-y-1 text-sm">
                                <li>• <strong>Data Privacy:</strong> Philippines DPA compliance (zero PII storage)</li>
                                <li>• <strong>Fraud Prevention:</strong> Blockchain tokens = tamper-proof credentials</li>
                                <li>• <strong>Insurance:</strong> $5M cybersecurity insurance</li>
                                <li>• <strong>Indemnification:</strong> CAAP indemnified for platform breaches</li>
                                <li>• <strong>Zero Liability:</strong> Zero-knowledge model protects CAAP</li>
                            </ul>
                        </div>

                        <div className="bg-gray-50 border border-gray-300 rounded-lg p-4">
                            <h4 className="font-bold text-gray-800 mb-2">Financial Projections (Conservative)</h4>
                            <div className="overflow-x-auto">
                                <table className="min-w-full text-sm">
                                    <thead>
                                        <tr className="border-b">
                                            <th className="text-left py-2">Metric</th>
                                            <th className="text-center py-2">Year 1</th>
                                            <th className="text-center py-2">Year 3</th>
                                            <th className="text-center py-2">Year 5</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        <tr className="border-b">
                                            <td className="py-2">Active Pilots (CAAP registered)</td>
                                            <td className="text-center">12,000</td>
                                            <td className="text-center">12,000</td>
                                            <td className="text-center">12,000</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2">Annual Verification Rate</td>
                                            <td className="text-center">40%</td>
                                            <td className="text-center">60%</td>
                                            <td className="text-center">80%</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2">Gross Revenue</td>
                                            <td className="text-center">$480K</td>
                                            <td className="text-center">$720K</td>
                                            <td className="text-center">$960K</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2"><strong>CAAP Revenue (5%)</strong></td>
                                            <td className="text-center font-bold text-green-600">$24K</td>
                                            <td className="text-center font-bold text-green-600">$36K</td>
                                            <td className="text-center font-bold text-green-600">$48K</td>
                                        </tr>
                                        <tr className="border-b">
                                            <td className="py-2">Platform Margin (68%)</td>
                                            <td className="text-center">$326K</td>
                                            <td className="text-center">$490K</td>
                                            <td className="text-center">$653K</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>

                        <div className="bg-indigo-50 border border-indigo-300 rounded-lg p-4">
                            <h4 className="font-bold text-indigo-800 mb-2">Implementation Timeline</h4>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-indigo-700 font-medium">Phase 1: Agreement</span>
                                    <span className="text-indigo-600">Week 1-2</span>
                                </div>
                                <p className="text-indigo-600 text-xs">MOA signed, Landbank integration initiated</p>
                                
                                <div className="flex justify-between">
                                    <span className="text-indigo-700 font-medium">Phase 2: Technical</span>
                                    <span className="text-indigo-600">Week 3-6</span>
                                </div>
                                <p className="text-indigo-600 text-xs">API integration, testing, security audit</p>
                                
                                <div className="flex justify-between">
                                    <span className="text-indigo-700 font-medium">Phase 3: Pilot</span>
                                    <span className="text-indigo-600">Week 7-10</span>
                                </div>
                                <p className="text-indigo-600 text-xs">Soft launch with 5 partner ATOs</p>
                                
                                <div className="flex justify-between">
                                    <span className="text-indigo-700 font-medium">Phase 4: Rollout</span>
                                    <span className="text-indigo-600">Week 11-14</span>
                                </div>
                                <p className="text-indigo-600 text-xs">Full launch, CAAP portal integration live</p>
                                
                                <div className="flex justify-between">
                                    <span className="text-indigo-700 font-medium">Phase 5: Scale</span>
                                    <span className="text-indigo-600">Month 4-12</span>
                                </div>
                                <p className="text-indigo-600 text-xs">Nationwide adoption, revenue optimization</p>
                            </div>
                        </div>
                    </div>

                    <div className="mt-8 p-4 bg-gray-100 rounded-lg">
                        <h4 className="font-bold text-gray-800 mb-2">Next Actions</h4>
                        <ol className="text-gray-700 space-y-1 text-sm">
                            <li>1. Schedule meeting with CAAP Director General</li>
                            <li>2. Present MOA executive summary and technical demonstration</li>
                            <li>3. Address legal and compliance questions</li>
                            <li>4. Sign MOA and begin Phase 1 implementation</li>
                            <li>5. Launch pilot program with selected ATOs</li>
                        </ol>
                    </div>
                </div>
            </div>
        </div>
    );
};
