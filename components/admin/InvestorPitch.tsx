import React from 'react';

export const InvestorPitch: React.FC = () => {
    return (
        <div className="admin-strategy-page">
            <div className="max-w-6xl mx-auto px-6 py-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-6">Investor Pitch - 5% Government Deal = Market Monopoly</h1>
                
                <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-4 mb-6">
                    <p className="text-yellow-800 text-sm">
                        <strong>Admin Access Only:</strong> This document contains the complete investor pitch narrative showing how the 5% government deal creates an unassailable market monopoly.
                    </p>
                </div>

                <div className="space-y-8">
                    {/* Slide 1: The Problem */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 1: The Problem (Government Pain)</h2>
                        <h3 className="text-xl font-bold text-red-600 mb-4">"Governments Are Stuck with 1980s Verification Systems"</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="bg-red-50 border border-red-300 rounded-lg p-4">
                                <h4 className="font-bold text-red-800 mb-2">Current Reality</h4>
                                <ul className="text-red-700 space-y-1 text-sm">
                                    <li>• Aviation authorities process 10,000+ license verifications manually</li>
                                    <li>• Average verification time: 7-14 days per request</li>
                                    <li>• Data breach risk: Physical files = liability</li>
                                    <li>• Cost: $500K/year in staff time, $2M to modernize (no budget)</li>
                                </ul>
                            </div>
                            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                <h4 className="font-bold text-green-800 mb-2">Our Solution</h4>
                                <ul className="text-green-700 space-y-1 text-sm">
                                    <li>• Automated 8-stage verification chain</li>
                                    <li>• Instant verification: 24-48 hours</li>
                                    <li>• Zero-knowledge architecture = no data breach risk</li>
                                    <li>• Government gets passive revenue stream</li>
                                </ul>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-4 italic">"They're drowning in paperwork while pilots wait weeks for jobs."</p>
                    </div>

                    {/* Slide 2: The Solution */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 2: The Solution (Our PPP Framework)</h2>
                        <h3 className="text-xl font-bold text-green-600 mb-4">"We Hand Governments a Revenue Stream + Modern Infrastructure at Zero Cost"</h3>
                        
                        <div className="bg-green-50 border border-green-300 rounded-lg p-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-bold text-green-800 mb-2">Zero Cost</h4>
                                    <ul className="text-green-700 space-y-1 text-sm">
                                        <li>• Government pays $0 for IT infrastructure</li>
                                        <li>• Passive revenue: 5% ($5.00) per verification</li>
                                        <li>• Zero liability: Zero-knowledge architecture</li>
                                        <li>• Instant modernization: 90 days to go live</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-bold text-green-800 mb-2">What We Provide</h4>
                                    <ul className="text-green-700 space-y-1 text-sm">
                                        <li>• Higher Security: Blockchain-backed credentials</li>
                                        <li>• Operational Efficiency: Eliminate manual requests</li>
                                        <li>• Guaranteed Funding: Predictable revenue stream</li>
                                        <li>• Legal Compliance: RA 11966 PPP Code</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-4 italic">"We don't ask governments to spend money. We hand them money."</p>
                    </div>

                    {/* Slide 3: The 5% Monopoly Mechanism */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 3: The 5% Monopoly Mechanism</h2>
                        <h3 className="text-xl font-bold text-purple-600 mb-4">"Why This 5% Deal Creates an Unbreakable Monopoly"</h3>
                        
                        <div className="bg-purple-50 border border-purple-300 rounded-lg p-6">
                            <div className="space-y-4">
                                <div className="flex items-center space-x-2">
                                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">1</div>
                                    <span className="text-purple-700 font-medium">Government Accepts 5% Deal</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">2</div>
                                    <span className="text-purple-700">Government promotes platform as "official" (law, not app)</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">3</div>
                                    <span className="text-purple-700">Pilots treat it as mandatory (government endorsement)</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <div className="bg-purple-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">4</div>
                                    <span className="text-purple-700">Competitors locked out (can't offer government revenue)</span>
                                </div>
                                <div className="ml-10 flex items-center space-x-2">
                                    <div className="bg-green-600 text-white rounded-full w-8 h-8 flex items-center justify-center text-sm font-bold">✓</div>
                                    <span className="text-green-700 font-bold">MARKET MONOPOLY ACHIEVED</span>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 overflow-x-auto">
                            <table className="min-w-full text-sm border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-2">Factor</th>
                                        <th className="text-center p-2">Us</th>
                                        <th className="text-center p-2">Competitors (Persona, etc.)</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b">
                                        <td className="p-2">Government Revenue Share</td>
                                        <td className="text-center p-2 text-green-600">✅ 5% to treasury</td>
                                        <td className="text-center p-2 text-red-600">❌ $0</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2">Official Endorsement</td>
                                        <td className="text-center p-2 text-green-600">✅ CAAP-approved</td>
                                        <td className="text-center p-2 text-red-600">❌ Commercial only</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2">Portal Integration</td>
                                        <td className="text-center p-2 text-green-600">✅ On CAAP website</td>
                                        <td className="text-center p-2 text-red-600">❌ No access</td>
                                    </tr>
                                    <tr className="border-b">
                                        <td className="p-2">Marketing Cost</td>
                                        <td className="text-center p-2 text-green-600">✅ $0 (gov promotes)</td>
                                        <td className="text-center p-2 text-red-600">❌ $$$ paid ads</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-gray-700 mt-4 italic">"Once CAAP says 'this is the official system,' no pilot will trust a competitor."</p>
                    </div>

                    {/* Slide 4: The Flywheel */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 4: The Flywheel (Self-Sustaining Growth)</h2>
                        <h3 className="text-xl font-bold text-blue-600 mb-4">"Government Promotion = Zero-Cost Customer Acquisition"</h3>
                        
                        <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                            <div className="text-center space-y-4">
                                <div className="bg-blue-600 text-white rounded-lg p-4">
                                    <p className="font-bold">Government Promotes</p>
                                    <p className="text-sm">(via portal, ATO mandates, SMS alerts)</p>
                                </div>
                                <div className="text-2xl">↓</div>
                                <div className="bg-blue-600 text-white rounded-lg p-4">
                                    <p className="font-bold">Pilots Buy $100 Verification</p>
                                    <p className="text-sm">(perceived as mandatory/official)</p>
                                </div>
                                <div className="text-2xl">↓</div>
                                <div className="bg-blue-600 text-white rounded-lg p-4">
                                    <p className="font-bold">Platform Distributes Payouts</p>
                                    <p className="text-sm">$5 CAAP, $5 ATO, $5 Logbook, etc.</p>
                                </div>
                                <div className="text-2xl">↓</div>
                                <div className="bg-green-600 text-white rounded-lg p-4">
                                    <p className="font-bold">Government Gets Revenue</p>
                                    <p className="text-sm">→ Incentivized to promote HARDER</p>
                                </div>
                                <div className="text-2xl">↺</div>
                                <div className="bg-purple-600 text-white rounded-lg p-4">
                                    <p className="font-bold">CYCLE REPEATS</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div className="bg-green-50 border border-green-300 rounded-lg p-4">
                                <h4 className="font-bold text-green-800">Unit Economics</h4>
                                <ul className="text-green-700 text-sm space-y-1">
                                    <li>• CAC: $0 (government does it)</li>
                                    <li>• LTV: $100/year (recurring)</li>
                                    <li>• Gross Margin: 68-73%</li>
                                    <li>• Payback: Instant</li>
                                </ul>
                            </div>
                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-4">
                                <h4 className="font-bold text-blue-800">Growth Levers</h4>
                                <ul className="text-blue-700 text-sm space-y-1">
                                    <li>• Government mandates</li>
                                    <li>• ATO requirements</li>
                                    <li>• Airline preferences</li>
                                    <li>• Pilot network effects</li>
                                </ul>
                            </div>
                            <div className="bg-purple-50 border border-purple-300 rounded-lg p-4">
                                <h4 className="font-bold text-purple-800">The Punchline</h4>
                                <p className="text-purple-700 text-sm italic">"Our best salesperson is the government itself. And we pay them 5% commission."</p>
                            </div>
                        </div>
                    </div>

                    {/* Slide 5: Market Size */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 5: Market Size & Monopoly Potential</h2>
                        <h3 className="text-xl font-bold text-orange-600 mb-4">"Philippines First. Then Replicate Globally."</h3>
                        
                        <div className="bg-orange-50 border border-orange-300 rounded-lg p-6">
                            <h4 className="font-bold text-orange-800 mb-4">PHILIPPINES (Beachhead Market)</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <ul className="text-orange-700 text-sm space-y-1">
                                        <li>• 12,000 active pilots</li>
                                        <li>• 40% annual verification rate</li>
                                        <li>• Year 1 Revenue: $480K</li>
                                        <li>• Year 3 Revenue: $1M+</li>
                                        <li>• Monopoly Status: 80%+ expected</li>
                                    </ul>
                                </div>
                                <div>
                                    <h5 className="font-bold text-orange-800 mb-2">EXPANSION PIPELINE:</h5>
                                    <ul className="text-orange-700 text-sm space-y-1">
                                        <li>• Indonesia: 18,000 pilots → $90K/year</li>
                                        <li>• Malaysia: 15,000 pilots → $75K/year</li>
                                        <li>• Thailand: 14,000 pilots → $70K/year</li>
                                        <li>• Vietnam: 10,000 pilots → $50K/year</li>
                                        <li>• ASEAN Total: 69,000 pilots → $335K/year</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
                            <h4 className="font-bold text-gray-800 mb-2">GLOBAL BLUEPRINT:</h4>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2 text-sm">
                                <div className="bg-white border rounded p-2">
                                    <p className="font-bold">Middle East</p>
                                    <p>GCAA, GACA</p>
                                </div>
                                <div className="bg-white border rounded p-2">
                                    <p className="font-bold">Africa</p>
                                    <p>KCAA, NCAA</p>
                                </div>
                                <div className="bg-white border rounded p-2">
                                    <p className="font-bold">Latin America</p>
                                    <p>ANAC, DGAC</p>
                                </div>
                                <div className="bg-white border rounded p-2">
                                    <p className="font-bold">Europe</p>
                                    <p>EASA partners</p>
                                </div>
                            </div>
                        </div>
                        <p className="text-gray-700 mt-4 italic">"Each country = new 5% deal = new government sales team = new monopoly."</p>
                    </div>

                    {/* Slide 6: Competitive Moat */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 6: Competitive Moat</h2>
                        <h3 className="text-xl font-bold text-red-600 mb-4">"Persona Can't Compete. They Have No Government Deal."</h3>
                        
                        <div className="overflow-x-auto">
                            <table className="min-w-full text-sm border">
                                <thead>
                                    <tr className="bg-gray-100">
                                        <th className="text-left p-3">Competitive Advantage</th>
                                        <th className="text-center p-3">PilotRecognition.com</th>
                                        <th className="text-center p-3">Persona</th>
                                        <th className="text-center p-3">HireRight</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Government Revenue Share</td>
                                        <td className="text-center p-3 text-green-600">✅ 5% to treasury</td>
                                        <td className="text-center p-3 text-red-600">❌ No</td>
                                        <td className="text-center p-3 text-red-600">❌ No</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Official Endorsement</td>
                                        <td className="text-center p-3 text-green-600">✅ CAAP-approved</td>
                                        <td className="text-center p-3 text-red-600">❌ Commercial only</td>
                                        <td className="text-center p-3 text-red-600">❌ Enterprise only</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Zero Marketing Cost</td>
                                        <td className="text-center p-3 text-green-600">✅ Gov promotes</td>
                                        <td className="text-center p-3 text-red-600">❌ $$$ paid ads</td>
                                        <td className="text-center p-3 text-red-600">❌ Sales teams</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">ATO Integration</td>
                                        <td className="text-center p-3 text-green-600">✅ Mandated</td>
                                        <td className="text-center p-3 text-red-600">❌ Optional</td>
                                        <td className="text-center p-3 text-red-600">⚠️ Limited</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Real-Time API</td>
                                        <td className="text-center p-3 text-green-600">✅ CAAP registry</td>
                                        <td className="text-center p-3 text-red-600">❌ Manual checks</td>
                                        <td className="text-center p-3 text-red-600">⚠️ Limited</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Blockchain Tokens</td>
                                        <td className="text-center p-3 text-green-600">✅ Verepass</td>
                                        <td className="text-center p-3 text-red-600">❌ No</td>
                                        <td className="text-center p-3 text-red-600">❌ No</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Philippines Focus</td>
                                        <td className="text-center p-3 text-green-600">✅ Designed for CAAP</td>
                                        <td className="text-center p-3 text-red-600">❌ US-centric</td>
                                        <td className="text-center p-3 text-red-600">❌ Generic</td>
                                    </tr>
                                    <tr className="border-b bg-green-50">
                                        <td className="p-3 font-medium">Pricing</td>
                                        <td className="text-center p-3 text-green-600">✅ $100 (affordable)</td>
                                        <td className="text-center p-3 text-red-600">❌ $500+</td>
                                        <td className="text-center p-3 text-red-600">❌ Enterprise $$$</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                        <p className="text-gray-700 mt-4 italic">"We don't compete on features. We compete on 'this is the law.'"</p>
                    </div>

                    {/* Slide 7: Financial Projections */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 7: Financial Projections & Exit Strategy</h2>
                        <h3 className="text-xl font-bold text-green-600 mb-4">"68-73% Margins. $500M Exit. Here's How."</h3>
                        
                        <div className="space-y-6">
                            <div className="bg-green-50 border border-green-300 rounded-lg p-6">
                                <h4 className="font-bold text-green-800 mb-4">PHILIPPINES FINANCIALS:</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Year</th>
                                                <th className="text-center p-2">Verifications</th>
                                                <th className="text-center p-2">Gross Revenue</th>
                                                <th className="text-center p-2">CAAP 5%</th>
                                                <th className="text-center p-2">Platform Margin (68%)</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-2">Year 1</td>
                                                <td className="text-center p-2">4,800</td>
                                                <td className="text-center p-2">$480K</td>
                                                <td className="text-center p-2 text-green-600">$24K</td>
                                                <td className="text-center p-2">$326K</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-2">Year 2</td>
                                                <td className="text-center p-2">8,000</td>
                                                <td className="text-center p-2">$800K</td>
                                                <td className="text-center p-2 text-green-600">$40K</td>
                                                <td className="text-center p-2">$544K</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-2">Year 3</td>
                                                <td className="text-center p-2">10,000</td>
                                                <td className="text-center p-2">$1M</td>
                                                <td className="text-center p-2 text-green-600">$50K</td>
                                                <td className="text-center p-2">$680K</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-2">Year 5</td>
                                                <td className="text-center p-2">15,000</td>
                                                <td className="text-center p-2">$1.5M</td>
                                                <td className="text-center p-2 text-green-600">$75K</td>
                                                <td className="text-center p-2">$1.02M</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-300 rounded-lg p-6">
                                <h4 className="font-bold text-blue-800 mb-4">EXPANSION FINANCIALS (5 Markets):</h4>
                                <div className="overflow-x-auto">
                                    <table className="min-w-full text-sm">
                                        <thead>
                                            <tr className="border-b">
                                                <th className="text-left p-2">Year</th>
                                                <th className="text-center p-2">Total Pilots</th>
                                                <th className="text-center p-2">Gross Revenue</th>
                                                <th className="text-center p-2">Platform Margin</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr className="border-b">
                                                <td className="p-2">Year 3</td>
                                                <td className="text-center p-2">35,000</td>
                                                <td className="text-center p-2">$3.5M</td>
                                                <td className="text-center p-2">$2.38M</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-2">Year 5</td>
                                                <td className="text-center p-2">60,000</td>
                                                <td className="text-center p-2">$6M</td>
                                                <td className="text-center p-2">$4.08M</td>
                                            </tr>
                                            <tr className="border-b">
                                                <td className="p-2">Year 7</td>
                                                <td className="text-center p-2">100,000</td>
                                                <td className="text-center p-2">$10M</td>
                                                <td className="text-center p-2">$6.8M</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div className="bg-purple-50 border border-purple-300 rounded-lg p-6">
                                <h4 className="font-bold text-purple-800 mb-4">EXIT STRATEGY:</h4>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <div className="bg-white border rounded p-4">
                                        <h5 className="font-bold text-purple-700 mb-2">Option A: Strategic Acquisition</h5>
                                        <ul className="text-purple-600 text-sm space-y-1">
                                            <li>• Buyer: Veremark, HireRight, First Advantage</li>
                                            <li>• Valuation: $100-150M (Year 5)</li>
                                            <li>• Why: Lock in government relationships</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border rounded p-4">
                                        <h5 className="font-bold text-purple-700 mb-2">Option B: IPO</h5>
                                        <ul className="text-purple-600 text-sm space-y-1">
                                            <li>• Timing: Year 7, 5+ countries</li>
                                            <li>• Valuation: $200-500M</li>
                                            <li>• Positioning: Global aviation monopoly</li>
                                        </ul>
                                    </div>
                                    <div className="bg-white border rounded p-4">
                                        <h5 className="font-bold text-purple-700 mb-2">Option C: Continued Operation</h5>
                                        <ul className="text-purple-600 text-sm space-y-1">
                                            <li>• Revenue: $10M+ by Year 7</li>
                                            <li>• Margin: 68% sustained</li>
                                            <li>• Dividends: Founder cash-out</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Slide 8: The Ask */}
                    <div className="bg-white border border-gray-300 rounded-lg p-8 shadow-sm">
                        <h2 className="text-2xl font-bold text-gray-900 mb-4">Slide 8: The Ask</h2>
                        <h3 className="text-xl font-bold text-red-600 mb-4">"$500K to Lock Down the Philippines Monopoly"</h3>
                        
                        <div className="bg-red-50 border border-red-300 rounded-lg p-6">
                            <h4 className="font-bold text-red-800 mb-4">USE OF FUNDS:</h4>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">CAAP Integration:</span>
                                        <span className="text-red-800 font-bold">$100K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">API development, legal fees, MOA negotiation</p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Veremark Contract:</span>
                                        <span className="text-red-800 font-bold">$150K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">Wholesale verification credits + Verepass setup</p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">ATO Onboarding:</span>
                                        <span className="text-red-800 font-bold">$75K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">10 pilot flight schools integration</p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Platform Development:</span>
                                        <span className="text-red-800 font-bold">$100K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">8-Stage verification chain completion</p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Marketing/Growth:</span>
                                        <span className="text-red-800 font-bold">$50K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">Initial pilot acquisition (pre-gov promotion)</p>
                                </div>
                                <div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-red-700">Operations/Buffer:</span>
                                        <span className="text-red-800 font-bold">$25K</span>
                                    </div>
                                    <p className="text-red-600 text-xs">6-month runway</p>
                                </div>
                            </div>
                            <div className="mt-4 pt-4 border-t border-red-300">
                                <div className="flex justify-between">
                                    <span className="text-red-700 font-bold">TOTAL:</span>
                                    <span className="text-red-800 font-bold text-lg">$500K</span>
                                </div>
                                <p className="text-red-600 text-sm mt-2">Philippines market domination</p>
                            </div>
                        </div>

                        <div className="mt-6 bg-gray-50 border border-gray-300 rounded-lg p-4">
                            <h4 className="font-bold text-gray-800 mb-2">INVESTMENT TERMS:</h4>
                            <ul className="text-gray-700 text-sm space-y-1">
                                <li>• <strong>Round:</strong> Seed</li>
                                <li>• <strong>Amount:</strong> $500K USD</li>
                                <li>• <strong>Valuation:</strong> $2M pre-money (20% equity)</li>
                                <li>• <strong>Instrument:</strong> SAFE or Equity</li>
                                <li>• <strong>Timeline:</strong> 18 months to profitability</li>
                            </ul>
                        </div>

                        <div className="mt-6 bg-green-50 border border-green-300 rounded-lg p-4">
                            <h4 className="font-bold text-green-800 mb-2">INVESTOR PROTECTIONS:</h4>
                            <ul className="text-green-700 text-sm space-y-1">
                                <li>• Board seat</li>
                                <li>• Information rights (monthly metrics)</li>
                                <li>• Pro-rata rights (Series A participation)</li>
                                <li>• Liquidation preference (1x)</li>
                            </ul>
                        </div>

                        <div className="mt-6 bg-purple-50 border border-purple-300 rounded-lg p-4">
                            <h4 className="font-bold text-purple-800 mb-2">THE PITCH:</h4>
                            <p className="text-purple-700 text-sm italic">"$500K closes the Philippines. Join us."</p>
                        </div>

                        <div className="mt-6 bg-yellow-50 border border-yellow-300 rounded-lg p-4">
                            <h4 className="font-bold text-yellow-800 mb-2">NEXT STEPS:</h4>
                            <ol className="text-yellow-700 text-sm space-y-1">
                                <li>1. Term sheet discussion</li>
                                <li>2. CAAP introduction (advisor facilitates)</li>
                                <li>3. Due diligence (technical, legal, financial)</li>
                                <li>4. Funding close</li>
                                <li>5. MOA signing with CAAP</li>
                            </ol>
                        </div>
                    </div>

                    {/* Summary */}
                    <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg p-8">
                        <h2 className="text-2xl font-bold mb-4">THE CLOSE</h2>
                        <h3 className="text-xl font-bold mb-4">"One Government Deal = Monopoly. We're Closing It."</h3>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-bold mb-2">SUMMARY BULLETS:</h4>
                                <ul className="space-y-1 text-sm">
                                    <li>• Problem: Governments can't afford modern verification</li>
                                    <li>• Solution: We build it free, give them 5% revenue</li>
                                    <li>• Monopoly: Government endorsement locks out competitors</li>
                                    <li>• Unit Economics: 68% margins, $0 CAC (gov does marketing)</li>
                                    <li>• Scale: Philippines first, then 10+ countries</li>
                                    <li>• Exit: $100-500M strategic acquisition or IPO</li>
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-bold mb-2">THE ASK:</h4>
                                <p className="text-2xl font-bold mb-4">$500K closes the Philippines. Join us.</p>
                                <div className="bg-white bg-opacity-20 rounded p-4">
                                    <h4 className="font-bold mb-2">READY TO PRESENT:</h4>
                                    <ul className="space-y-1 text-sm">
                                        <li>• CAAP meetings scheduled</li>
                                        <li>• Veremark contract ready</li>
                                        <li>• Technical MVP 80% complete</li>
                                        <li>• 3 ATOs committed to pilot</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
