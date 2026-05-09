'use client';

import { motion } from 'framer-motion';

const LearnMorePage = () => {
    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* Header */}
            <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 lg:px-6 h-16 flex items-center justify-between">
                    <a href="/enterprise-access" className="flex items-center gap-3">
                        <span className="text-xl font-bold tracking-tight">
                            <span className="text-slate-900">Pilot</span>
                            <span className="text-red-600">Recognition</span>
                        </span>
                        <span className="text-sm font-semibold text-slate-900 tracking-wide">Enterprise</span>
                    </a>
                    <a href="/enterprise-access" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                        ← Back to Enterprise
                    </a>
                </div>
            </header>

            {/* Hero */}
            <section className="py-20 px-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-4">Pricing & Pathways</p>
                    <h1 className="text-4xl md:text-5xl font-bold mb-6 text-slate-900">
                        Recruitment Infrastructure.<br />
                        <span className="text-red-600">Not Just a Job Board.</span>
                    </h1>
                    <p className="text-slate-600 text-lg max-w-2xl mx-auto mb-10">
                        Stop paying "bounty hunter" prices for essential hiring. 
                        PilotRecognition provides the structural layer the aviation industry has been missing—
                        aligning pilot readiness with operator demand through Pull-Based Recruitment.
                    </p>
                    <img 
                        src="/recogntion.png" 
                        alt="Pilot Recognition Framework" 
                        className="mx-auto max-w-3xl w-full rounded-2xl shadow-lg"
                    />
                    <p className="text-slate-500 text-sm mt-4 max-w-2xl mx-auto">
                        The paradox of modern aviation recruitment: pilots with thousands of hours stand unrecognized outside, 
                        while operators inside struggle to find qualified candidates. The Recognition Gap costs the industry 
                        millions in lost talent and misplaced opportunities.
                    </p>
                </div>
            </section>

            {/* Pricing Comparison */}
            <section className="py-20 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">The Cost Shift</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Infrastructure vs. Intermediaries</h2>
                    <p className="text-slate-600 mb-8 max-w-3xl text-lg">
                        We don't just find a pilot; we build your pipeline. While traditional agencies are useful for executive-level headhunting, they are an expensive way to fill a flight deck. PilotRecognition is designed to be your permanent recruitment utility.
                    </p>
                    
                    {/* Feature Comparison Table */}
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden mb-8">
                        <div className="grid grid-cols-3 bg-slate-100 border-b border-slate-200">
                            <div className="p-4 font-semibold text-slate-900">Feature</div>
                            <div className="p-4 font-semibold text-slate-700">Traditional Agency (Search)</div>
                            <div className="p-4 font-semibold text-red-600">PilotRecognition (Infrastructure)</div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-200">
                            <div className="p-4 font-medium text-slate-900 bg-slate-50">Pricing Model</div>
                            <div className="p-4 text-slate-700">15% – 25% of annual salary</div>
                            <div className="p-4 text-slate-900 font-medium">$1,000/mo + $500 success fee</div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-200">
                            <div className="p-4 font-medium text-slate-900 bg-slate-50">G650 Captain Cost</div>
                            <div className="p-4 text-slate-700">$50,000 (Average)</div>
                            <div className="p-4 text-red-600 font-medium">$3,500 (Quarterly Total)</div>
                        </div>
                        <div className="grid grid-cols-3 border-b border-slate-200">
                            <div className="p-4 font-medium text-slate-900 bg-slate-50">Placement Speed</div>
                            <div className="p-4 text-slate-700">60–90 days (Reactive)</div>
                            <div className="p-4 text-slate-900 font-medium">30–45 days (Proactive)</div>
                        </div>
                        <div className="grid grid-cols-3">
                            <div className="p-4 font-medium text-slate-900 bg-slate-50">Vetting</div>
                            <div className="p-4 text-slate-700">Manual / One-off</div>
                            <div className="p-4 text-slate-900 font-medium">Automated / Verification-ready</div>
                        </div>
                    </div>
                    
                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6 mb-8">
                        <p className="text-slate-800 text-lg">
                            <span className="font-semibold text-emerald-700">The Result:</span> A 90% reduction in placement costs and a permanent, pre-aligned interest pool that stays active even when you aren't hiring.
                        </p>
                    </div>

                </div>
            </section>

            {/* From a Pilot's Perspective */}
            <section className="py-20 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-4">Understanding the Pilot Experience</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                        From a Pilot's Perspective: How the Industry Looks from the Cockpit
                    </h2>
                    <p className="text-slate-600 text-lg mb-12 max-w-3xl">
                        Here's what pilots actually experience in today's recruitment system—and why your Pathway Card changes everything for them.
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 mb-12">
                        {/* The Problem */}
                        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                The Problem (As Pilots See It)
                            </h3>
                            <div className="space-y-4">
                                <div className="flex gap-3">
                                    <span className="text-slate-400 font-bold">1.</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">You Guess</p>
                                        <p className="text-sm text-slate-600">You see a job ad that says "500 hours," but you don't know if they really want 1,000 hours, or if they only care about turbine time.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-slate-400 font-bold">2.</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">You Apply to Silence</p>
                                        <p className="text-sm text-slate-600">You send a CV and never hear back. No feedback. No clarity on why.</p>
                                    </div>
                                </div>
                                <div className="flex gap-3">
                                    <span className="text-slate-400 font-bold">3.</span>
                                    <div>
                                        <p className="font-semibold text-slate-900">You Cold Call</p>
                                        <p className="text-sm text-slate-600">You email operators asking, "What are you guys actually looking for?" only to get ignored because they're too busy.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-200">
                                <p className="font-semibold text-slate-900 mb-3">The Deeper Problem: A Broken System</p>
                                <div className="space-y-3 text-sm text-slate-600">
                                    <p>
                                        <span className="font-medium text-slate-800">The $50,000 Investment:</span> Pilots have already invested heavily in training, yet are labeled "inexperienced" despite their qualifications. This is a shock to an industry that desperately needs talent.
                                    </p>
                                    <p>
                                        <span className="font-medium text-slate-800">The Toxic Culture:</span> "You know the hours — 1,500 hours. Come back to me when you have those." This dismissive attitude ignores the reality of what pilots have already achieved.
                                    </p>
                                    <p>
                                        <span className="font-medium text-slate-800">The Forgotten Instructors:</span> Flight instructors with 3,000 or 5,000 hours aren't getting the recognition they deserve. Their dedication to training the next generation counts for nothing in the eyes of many operators.
                                    </p>
                                    <p className="text-slate-700 italic">
                                        Every profession deserves respect. The loss of progression and talent is happening at every stage — and it's the industry's own fault.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* How It Changes */}
                        <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-6">
                                How This Changes Everything
                            </h3>
                            <p className="text-slate-700 mb-4">
                                Instead of you chasing them, they tell you exactly how to get hired <span className="font-semibold">before you even apply</span>.
                            </p>
                            <div className="space-y-4">
                                <div>
                                    <p className="font-semibold text-slate-900">The Pathway Card is Your Cheat Sheet</p>
                                    <p className="text-sm text-slate-600">Think of it like a syllabus for a flight test. It tells you exactly what that specific airline or charter company values.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">The Recognition Score</p>
                                    <p className="text-sm text-slate-600">As you log more hours or get new ratings, your score goes up. When an operator looks for a pilot, you "pop up" at the top because you're a perfect match.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">No More Blind Applying</p>
                                    <p className="text-sm text-slate-600">You only spend your time on companies where you know you meet their specific "hidden" requirements.</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900">Verification = Trust</p>
                                    <p className="text-sm text-slate-600">If you choose to get background checked, you get a "verified" badge. To an airline, this means you're "de-risked" — not just a random person from the internet.</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* In Short */}
                    <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                        <p className="text-lg mb-4">
                            <span className="font-semibold text-red-400">In short:</span> It turns the job hunt from <span className="italic">"I hope they like my CV"</span> into <span className="font-semibold">"I have exactly what they asked for, and they can see it."</span>
                        </p>
                        <p className="text-slate-400 text-sm">
                            It's a way to make sure your hard work and specific experience actually get noticed by the people who make the hiring decisions.
                        </p>
                    </div>
                </div>
            </section>

            {/* Gulfstream G650 Pathway Card */}
            <section className="py-20 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">The Pathway Card</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Precision Matching for the G650 Fleet</h2>
                    <p className="text-slate-600 text-lg max-w-3xl mb-12">
                        The "Recognition Gap" disappears when expectations are public. Below is how we surface the specific "ready-to-fly" metrics for a Gulfstream G650 (Part 135) Captain.
                    </p>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Hard Competencies */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Hard Competencies
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">The "Must-Haves"</p>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Total Time</p>
                                    <p className="text-sm text-slate-600">3,500+ Hours | PIC: 3,000+ Hours</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Asset Specifics</p>
                                    <p className="text-sm text-slate-600">Current G650 Type Rating with 200+ hours in type</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Tech Stack</p>
                                    <p className="text-sm text-slate-600">Mastery of EFVS (Enhanced Flight Vision System) and Gulfstream MATRIX software</p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Compliance</p>
                                    <p className="text-sm text-slate-600">Immediate 90-day currency and Part 135 Subpart E mastery</p>
                                </div>
                            </div>
                        </div>

                        {/* Soft Competencies */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-xl font-bold text-slate-900 mb-2">
                                Soft Competencies
                            </h3>
                            <p className="text-sm text-slate-500 mb-6">The "Hidden Context"</p>
                            <div className="space-y-6">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">UHNW Service</p>
                                    <p className="text-sm text-slate-600">
                                        Polished, high-discretion communication for elite corporate travelers.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Global Reach</p>
                                    <p className="text-sm text-slate-600">
                                        Proven experience in oceanic crossings and international ETOPS routing.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Charter Agility</p>
                                    <p className="text-sm text-slate-600">
                                        Mental readiness for the ad-hoc, short-notice nature of Part 135 ops.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Immediate Availability</p>
                                    <p className="text-sm text-slate-600">
                                        Ready to fly today. No 30-day notice periods. For charter operators, a pilot who is "Ready to Fly Today" is worth more than a pilot who is "Better but 30 days away."
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Recognition Score Weighting */}
                    <div className="mt-8 bg-white border border-slate-200 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-2">
                            The G650 Recognition Score
                        </h3>
                        <p className="text-sm text-slate-500 mb-6">Candidates are automatically ranked based on your weighted priorities:</p>
                        <div className="grid sm:grid-cols-4 gap-4">
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-3xl font-bold text-red-600">40%</p>
                                <p className="text-sm text-slate-600 mt-1">Type Rating & Experience</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-3xl font-bold text-red-600">25%</p>
                                <p className="text-sm text-slate-600 mt-1">Avionics & Tech Proficiency</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-3xl font-bold text-red-600">20%</p>
                                <p className="text-sm text-slate-600 mt-1">International Operations</p>
                            </div>
                            <div className="text-center p-4 bg-slate-50 rounded-xl">
                                <p className="text-3xl font-bold text-red-600">15%</p>
                                <p className="text-sm text-slate-600 mt-1">CRM & Service Profile</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-20 px-6 bg-gradient-to-b from-white to-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-4">Integrate Your Pipeline</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">
                        Don't wait for a vacancy to start looking.
                    </h2>
                    <p className="text-slate-600 text-lg mb-8 max-w-2xl mx-auto">
                        Build your Pathway Card today and let the right pilots align themselves to you before you ever need them.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <a 
                            href="/enterprise-access#contact" 
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-colors"
                        >
                            Request Enterprise Access →
                        </a>
                    </div>
                    <p className="text-slate-500 text-sm mt-4">
                        Syncs with your existing ATS and recruitment workflow.
                    </p>
                    <p className="text-slate-500 text-sm mt-2">
                        Join the operators moving from "Push" to "Pull" recruitment.
                    </p>
                </div>
            </section>

            {/* Footer */}
            <footer className="bg-white border-t border-slate-200 py-10 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-slate-500">
                    <div className="flex items-center gap-3">
                        <span className="font-bold">
                            <span className="text-slate-900">Pilot</span>
                            <span className="text-red-600">Recognition</span>
                        </span>
                        <span className="text-[10px] uppercase tracking-widest border border-slate-300 px-1.5 py-0.5 rounded">Enterprise</span>
                    </div>
                    <p className="text-slate-600">Connecting Pilots to the Industry.</p>
                    <a href="https://pilotrecognition.com" className="text-red-600 hover:text-red-500">← pilotrecognition.com</a>
                </div>
            </footer>
        </div>
    );
};

export default LearnMorePage;
