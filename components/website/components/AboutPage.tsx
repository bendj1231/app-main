import React from 'react';
import { ArrowLeft, Shield, Mail, Users, BookOpen } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { sanitizeHtml } from '../@/lib/sanitize-html';

interface AboutPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {




    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        About Us
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                        PilotRecognition Platform
                    </h1>
                    <span className="text-xl md:text-2xl text-slate-500 leading-none block mb-4">
                        Programs · Recognition · Pathways
                    </span>
                    
                    <p className="text-slate-900 font-black text-base md:text-lg max-w-2xl mx-auto mb-8 leading-relaxed">
                        Not a job board. Not a recruitment agency. A recognition platform — pilots get verified, operators see real proof, and every engagement requires your consent.
                    </p>

                    <div className="max-w-3xl mx-auto text-base text-slate-700 leading-relaxed text-left space-y-6">
                        <p>
                            Aviation's first pilot-owned career platform. The industry has never given pilots the infrastructure to prove who they are — only the paperwork to survive audits. PilotRecognition fixes that. You sync your logbook, verify your license, medical, and credentials through international verification providers, and build a recognition profile that reflects what you've actually done — not just what you claim. Your credentials are issued as sovereign W3C Verified Credential tokens to your own cryptographic wallet. The platform never retains your documents after verification. We receive the confirmation — not the paper.
                        </p>
                        <p>
                            It is not a job board but a professional networking platform—similar to LinkedIn for the aviation industry. Instead of pilots sending CVs into a void, operators post pathway cards showing exactly what they need: hours, ratings, nationality requirements, type rating preferences, experience level. You align your profile against those requirements and submit interest. If an operator wants to move forward, they send you a consent message — free. They may include a confidential offer document that self-destructs within 5 days of inactivity. You read it, negotiate if needed, and decide. Operators pay a flat annual subscription for advanced search tools; there are absolutely no success, connection, or placement fees for either side.
                        </p>
                        <p>
The Foundation Program builds the verified competency record operators look for. It covers 50 hours of logged mentorship, EBT CBTA-aligned industry education, type rating investment risk management, and a practical mentorship interview. Free to enter. Certification is $49 at completion. Everything you complete is appended to your profile and made available to operators with your consent.
                        </p>

                        {/* Pricing Section */}
                        <div className="mt-4">
                            <p className="text-red-500 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-2">Pricing</p>
                            <h3 className="text-2xl font-black text-slate-900 mb-1">Choose Your Plan.</h3>
                            <p className="text-sm text-slate-500 mb-8">Start with a free trial. Upgrade to Recognition Plus for priority matching and AI-powered career tools.</p>

                            <div className="grid md:grid-cols-2 gap-6 mb-8">
                                {/* Free Plan */}
                                <div className="bg-white border border-slate-200 rounded-2xl p-8 flex flex-col">
                                    <p className="text-slate-500 text-sm font-medium mb-1">Free</p>
                                    <p className="text-5xl font-black text-slate-900 mb-1">$0<span className="text-lg font-medium text-slate-400">/year</span></p>
                                    <p className="text-xs text-slate-400 mb-6">Basic access</p>
                                    <p className="text-xs font-semibold text-green-600 mb-6">Get started today</p>
                                    <ul className="space-y-2 text-sm text-slate-600 mb-8 flex-1">
                                        {['Basic profile', '2 pathway submissions/month', '3 profile comparisons/month', '5 AI chats/month', 'General pool visibility'].map(f => (
                                            <li key={f} className="flex items-center gap-2"><span className="text-slate-400">✓</span>{f}</li>
                                        ))}
                                        {['Priority matching', 'Exclusive pathways', 'Verified credentials'].map(f => (
                                            <li key={f} className="flex items-center gap-2 text-slate-300"><span>—</span>{f}</li>
                                        ))}
                                    </ul>
                                    <button onClick={() => onLogin()} className="w-full py-3 rounded-xl border-2 border-slate-900 text-slate-900 font-bold text-sm hover:bg-slate-900 hover:text-white transition-colors">Get Started Free</button>
                                </div>

                                {/* Recognition+ Verified Plan */}
                                <div className="bg-red-600 rounded-2xl p-8 flex flex-col relative">
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-400 text-yellow-900 text-[10px] font-black uppercase tracking-widest px-4 py-1 rounded-full">Best Value</div>
                                    <p className="text-red-200 text-sm font-medium mb-1">Recognition+ Verified</p>
                                    <p className="text-5xl font-black text-white mb-1">$100<span className="text-lg font-medium text-red-300">/year</span></p>
                                    <p className="text-xs text-red-300 mb-1">Annual membership</p>
                                    <p className="text-xs font-semibold text-red-200 mb-6">✓ 3-day free trial</p>
                                    <ul className="space-y-2 text-sm text-white mb-8 flex-1">
                                        {['Full profile comparison', 'Unlimited pathway submissions', 'Priority matching', 'AI career strategist', 'EBT CBTA Fast-Track', 'Exclusive pathways (Private Jet, eVTOL)', 'Verified flight hours & credentials', '50% off Foundation & Transition'].map(f => (
                                            <li key={f} className="flex items-center gap-2"><span className="text-red-300">✓</span>{f}</li>
                                        ))}
                                    </ul>
                                    <button onClick={() => onLogin()} className="w-full py-3 rounded-xl bg-white text-red-600 font-bold text-sm hover:bg-red-50 transition-colors">Get Annual Plan</button>
                                </div>
                            </div>

                            {/* Full Feature Details */}
                            <div className="bg-slate-900 rounded-2xl p-8">
                                <p className="text-slate-400 text-[0.65rem] font-black uppercase tracking-[0.3em] mb-1">Full Feature Details</p>
                                <h4 className="text-white text-xl font-black mb-1">Everything that's included</h4>
                                <p className="text-slate-400 text-sm mb-6">Recognition+ Verified <span className="bg-red-500 text-white text-xs font-bold px-2 py-0.5 rounded-full ml-1">$100/yr</span></p>
                                <ul className="space-y-3 text-sm text-slate-300">
                                    {[
                                        'Live real-time profile — not a PDF. When you fly and log hours, your profile updates instantly. Airlines pull your current data, not a snapshot from months ago.',
                                        'Background screening — verified badge attached to your profile in the pulling system',
                                        'Recognition Score — scored on recency, hours flown, type rating, completeness & background check status',
                                        'Recognition+ Verified badge — airlines filter for this first: background checked, preferred tier',
                                        "Submit pathway interest — your profile enters the airline's ranked bulletin with background check attached",
                                        "Airlines don't get random CVs — they pull a scored shortlist of interested pilots. You rank highest.",
                                    ].map(f => (
                                        <li key={f} className="flex items-start gap-3"><span className="text-red-400 mt-0.5 shrink-0">✓</span><span>{f}</span></li>
                                    ))}
                                </ul>
                                <p className="text-slate-500 text-xs mt-6">+ 8 more features</p>
                                <div className="mt-6 pt-6 border-t border-slate-700">
                                    <p className="text-slate-400 text-sm">Are you an airline, operator, or training organization?</p>
                                    <button onClick={() => onNavigate('enterprise')} className="text-blue-400 text-sm font-semibold hover:text-blue-300 transition-colors mt-1">Click here for enterprise access →</button>
                                </div>
                            </div>

                            <p className="text-xs text-slate-400 text-center mt-4">Cancel anytime. No hidden fees. Free trial included.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Four-Floor Tower Narrative - The Clogged Pipeline */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Problem
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            The Clogged Pipeline
                        </h2>
                        <p className="text-slate-600 max-w-2xl mx-auto">
                            Four floors. Four failures. One system to fix them.
                        </p>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Floor 0 - Top (Entry Point) */}
                        <div className="bg-white p-8 rounded-t-2xl border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">0</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 0: Graduates</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>200 hours. $50,000 spent. Promised airline jobs never materialize.</p>
                                <p>Instructor queue: 2–3 years. Batch of 2015 still waiting.</p>
                                <p>Work outside aviation to cover costs. Flight training investment unused.</p>
                                <p>Competencies unrecognized.</p>
                            </div>
                        </div>

                        {/* Floor 1 */}
                        <div className="bg-white p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">1</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 1: Flight Instructors</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>5,000 hours. 15 years instructing. No formal system recognizes instructional expertise as a pathway to advancement.</p>
                                <p>Trained pilots who advanced. Competencies built. No system to recognize them.</p>
                            </div>
                        </div>

                        {/* Floor 2 */}
                        <div className="bg-white p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">2</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 2: The Competency Gap</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>2,000 applications. 12 positions. 6 months wasted. No feedback on rejection.</p>
                                <p>Half the line asks for outdated A330 requirements. Requirements changed 3 months ago.</p>
                                <p>Operators don't update demands. Manufacturers don't publish changes.</p>
                                <p>The industry operates on stale data. Pilots apply to the wrong requirements.</p>
                            </div>
                        </div>

                        {/* Floor 3 - Bottom (End Point) */}
                        <div className="bg-white p-8 rounded-b-2xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-slate-100 rounded-full flex items-center justify-center text-slate-700 font-bold text-xl">3</div>
                                <h3 className="text-xl font-bold text-slate-900">Floor 3: Airline Pilots</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>12+ years. Captain experience. Bored. Trapped.</p>
                                <p>Change airlines? Reset to First Officer. Seniority sacrificed.</p>
                                <p>Your flight hours transfer. Your type ratings transfer. But your seniority stays with the airline.</p>
                                <p>Your competencies are documented. Proof of what you can do, not just hours logged.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-lg font-medium">
                        Operator requirements are verified by our pilot community and operator-submitted data. Real pilots check every posting. Requirements are updated as operators publish changes and our community reports updates. Stop applying blind. Apply with verified information.
                    </p>
                </div>
            </div>

            {/* Solution Tower */}
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Solution
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            How PilotRecognition Unclogs the Pipeline
                        </h2>
                    </div>

                    <div className="max-w-3xl mx-auto">
                        {/* Solution Floor 0 */}
                        <div className="bg-slate-50 p-8 rounded-t-2xl border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">0</div>
                                <h3 className="text-xl font-bold text-slate-900">Foundation Program</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Foundation Program — free to enter, $49 certification at completion. Scholarship seats for verified low-income applicants.</p>
                                <p>Build baseline competency. Get verified. Access pathway cards.</p>
                                <p>Build verified competency. Access pathways that match your skills.</p>
                            </div>
                        </div>

                        {/* Solution Floor 1 */}
                        <div className="bg-slate-50 p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">1</div>
                                <h3 className="text-xl font-bold text-slate-900">Verified Competency Assessment</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>EBT-aligned evaluation. Behavioral markers and cognitive indicators.</p>
                                <p>15 years of experience gets recognized. Not just hours.</p>
                                <p>Document your instructional expertise. Airlines value structured training experience.</p>
                            </div>
                        </div>

                        {/* Solution Floor 2 */}
                        <div className="bg-slate-50 p-8 border border-slate-200 border-b-0 relative">
                            <div className="absolute left-1/2 transform -translate-x-1/2 -bottom-6 w-0.5 h-6 bg-slate-300"></div>
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">2</div>
                                <h3 className="text-xl font-bold text-slate-900">Real-Time Industry Data</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Operator requirements verified by our pilot community and operator-submitted data.</p>
                                <p>Requirements updated as operators publish changes. No more stale information.</p>
                                <p>Align with the right requirements. Get feedback on why you match or don't.</p>
                            </div>
                        </div>

                        {/* Solution Floor 3 */}
                        <div className="bg-slate-50 p-8 rounded-b-2xl border border-slate-200">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-700 font-bold text-xl">3</div>
                                <h3 className="text-xl font-bold text-slate-900">Portable Competency Score</h3>
                            </div>
                            <div className="text-slate-700 space-y-1">
                                <p>Your documented competencies travel with you.</p>
                                <p>New employers see verified proof of what you can do.</p>
                                <p>Your competencies are portable. Your seniority stays with the airline. But you have proof.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-12">
                        <button
                            onClick={() => onNavigate('foundation-program')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-xl"
                        >
                            Start at Floor 0. Build Your Solution.
                        </button>
                    </div>
                </div>
            </div>

            {/* Technical Documentation Link */}
            <div className="py-12 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto text-center">
                    <p className="text-sm text-slate-600 mb-4">For detailed program specifications, technical documentation, and operational details</p>
                    <button
                        onClick={() => onNavigate('technical-index')}
                        className="inline-flex items-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:scale-105 transition-all shadow-xl border border-slate-200"
                    >
                        <BookOpen className="w-5 h-5" />
                        View Technical Index
                    </button>
                </div>
            </div>

            {/* How It Works - 3 Steps */}
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            How It Works
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900">
                            Three Steps to Your Aviation Career
                        </h2>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Step 1 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Users className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">01</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Create Your Profile</h3>
                            <p className="text-slate-600">Build your Initial Competency Profile with flight experience, certifications, and training history.</p>
                        </div>

                        {/* Step 2 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <BookOpen className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">02</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Complete Foundation Program</h3>
                            <p className="text-slate-600">Build baseline competency across 9 EBT CBTA areas through structured coursework and 50-hour mentorship.</p>
                        </div>

                        {/* Step 3 */}
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Shield className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">03</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Access Pathways & Get Recognized</h3>
                            <p className="text-slate-600">When operators join, they pull verified profiles based on competency alignment. Your Recognition Score makes you visible to airlines, cargo operators, and specialized pathways as the network grows.</p>
                        </div>
                    </div>

                    <div className="text-center mt-12 space-y-4">
                        <button
                            onClick={() => onNavigate('foundation-program')}
                            className="inline-flex items-center gap-3 px-8 py-4 bg-blue-700 text-white font-bold rounded-xl hover:bg-blue-800 transition-all shadow-xl"
                        >
                            Become a Member
                        </button>
                        <div className="flex items-center justify-center gap-4 text-sm text-slate-600">
                            <button onClick={() => onNavigate('foundation-program')} className="hover:text-blue-700 transition-colors">Enroll in Foundation Program</button>
                            <span>•</span>
                            <button onClick={() => onNavigate('recognition-career-matches')} className="hover:text-blue-700 transition-colors">Discover Pathways</button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mission & Vision */}
            <div id="mission" className="py-16 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">Our Purpose & Direction</p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Mission & Vision</h2>
                        <p className="text-base text-slate-700 leading-relaxed max-w-3xl mx-auto">
                            We provide verified competency assessment through EBT CBTA aligned programs. Pilots demonstrate capabilities through 50 hours of mentorship and behavioral assessment. When operators join the platform, they can pull verified profiles based on competency scores — not just hours. Recognition improves your matching priority with operators.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-white rounded-2xl p-8 border border-slate-200">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-3">Our Mission</p>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">Bridge the Pilot Gap Through Recognition</h3>
                            <p className="text-slate-700 text-sm leading-relaxed">We deliver verified competency assessment through EBT CBTA aligned programs and 50 hours of evidence-based mentorship. Pilots demonstrate actual capabilities — not just credentials. Operators access a pulling system built on real proof.</p>
                        </div>
                        <div className="bg-white rounded-2xl p-8 border border-slate-200">
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-3">Our Vision</p>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">Recognition as the Industry Standard</h3>
                            <p className="text-slate-700 text-sm leading-relaxed">A world where pilots own sovereign, portable proof of their competencies — and operators can access verified talent without wading through stale CVs. Recognition Score becomes the industry currency. Static resumes become obsolete.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Why Recognition */}
            <div id="why-recognition" className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">Why It Matters</p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">Why Recognition</h2>
                        <p className="text-base text-slate-700 leading-relaxed max-w-2xl mx-auto">
                            Recognition isn't a word. It's an infrastructure problem the industry has never solved.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {[
                            { label: 'For Students', text: 'You spent $50K training. A recognition profile means operators see verified proof of what you can do before you apply — not after 6 months of silence.' },
                            { label: 'For Instructors', text: '15 years building other pilots\' careers. The platform gives you the infrastructure to document instructional expertise as a pathway asset, not just a time-filler.' },
                            { label: 'For Active Pilots', text: 'Your credentials are sovereign. Operators request access. You consent. No one holds your career data hostage — and your Recognition Score travels with you when you change operators.' },
                        ].map(({ label, text }) => (
                            <div key={label} className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.25em] mb-2">{label}</p>
                                <p className="text-slate-700 text-sm leading-relaxed">{text}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Industry Stewardship */}
            <div id="stewardship" className="py-16 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">Industry Stewardship</p>
                    <h2 className="text-3xl md:text-4xl font-serif mb-6">How We Operate</h2>
                    <p className="text-slate-300 text-base leading-relaxed max-w-2xl mx-auto mb-10">
                        PilotRecognition is pilot-owned infrastructure. We don't sell data. We don't push applications. We built a consent-based system where the pilot controls every engagement.
                    </p>
                    <div className="grid md:grid-cols-3 gap-6 text-left">
                        {[
                            { title: 'EBT Alignment', body: 'Our competency framework is aligned with ICAO Evidence-Based Training standards and Airbus HINFACT methodology. Assessments are documented, not self-reported.' },
                            { title: 'Pilot Advocacy', body: 'Pre-employment verification costs belong to the employer, not the pilot. The $500 recognition fee is paid by operators. Pilots on the free tier are never charged for checks that benefit the hiring party.' },
                            { title: '2030 Vision', body: 'By 2030, PilotRecognition aims to be the global clearinghouse for verified pilot data — replacing static CVs with live credential chains that meet ICAO, FAA, EASA, and CAAP standards.' },
                        ].map(({ title, body }) => (
                            <div key={title} className="bg-white/10 rounded-xl p-6 border border-white/10">
                                <h3 className="font-bold text-white mb-2">{title}</h3>
                                <p className="text-slate-300 text-sm leading-relaxed">{body}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <div className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <h3 className="font-bold text-lg mb-4">PilotRecognition</h3>
                            <p className="text-slate-400 text-sm">A pilot recognition platform built on verified competency data</p>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Platform</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a onClick={() => onNavigate('recognition-plus')} className="hover:text-white cursor-pointer transition-colors">Pilot Recognition</a></li>
                                <li><a onClick={() => onNavigate('recognition-score-info')} className="hover:text-white cursor-pointer transition-colors">Recognition Score</a></li>
                                <li><a onClick={() => onNavigate('recognition-career-matches')} className="hover:text-white cursor-pointer transition-colors">Pathways</a></li>
                                <li><a href="https://pilotterminal.com" target="_blank" rel="noopener noreferrer" className="hover:text-white cursor-pointer transition-colors">Pilot Terminal</a></li>
                                <li><a onClick={() => onNavigate('foundation-program')} className="hover:text-white cursor-pointer transition-colors">Foundation Program</a></li>
                                <li><a onClick={() => onNavigate('pilot-gap-about')} className="hover:text-white cursor-pointer transition-colors">What is the Pilot Gap?</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Contact</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="mailto:contact@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">contact@pilotrecognition.com</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="hover:text-white cursor-pointer transition-colors">enterprise@pilotrecognition.com</a></li>
                            </ul>
                        </div>
                        <div>
                            <h3 className="font-bold text-lg mb-4">Legal</h3>
                            <ul className="space-y-2 text-slate-400 text-sm">
                                <li><a href="/privacy-policy" className="hover:text-white cursor-pointer transition-colors">Privacy Policy</a></li>
                                <li><a href="/terms-of-service" className="hover:text-white cursor-pointer transition-colors">Terms of Service</a></li>
                                <li><a href="/cookie-policy" className="hover:text-white cursor-pointer transition-colors">Cookie Policy</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400 text-sm">
                        <p>&copy; 2024 PilotRecognition - Benjamin Bowler (pending Aviation Pathways Ltd). All rights reserved.</p>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            <div className="flex justify-center pb-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
