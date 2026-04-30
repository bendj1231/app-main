import React from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2, Brain, Plane, Globe, FileText } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface TransitionProgramPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const TransitionProgramPage: React.FC<TransitionProgramPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Programs', url: '/programs' },
                { name: 'Transition Program', url: '/transition-program' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Airline Transition Program
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Shifting from Flight School to Airline Mindset
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 mb-6">
                        A structured bridge from fresh graduate to airline‑industry‑ready pilot. The Transition Program walks you through all nine EBT/CBTA core competencies using competency‑based assessment tools, aligns you with real airline expectations, and gives type‑rating insight before you commit tens of thousands to training.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="bg-blue-50 border border-blue-100 rounded-xl px-6 py-3">
                            <span className="text-2xl font-bold text-blue-700">$299</span>
                            <span className="text-sm text-slate-600 ml-2 whitespace-nowrap">one-time</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl px-6 py-3">
                            <span className="text-sm text-slate-600"><strong className="text-slate-900">Foundation graduates:</strong> $149 (50% discount applied)</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1 - The Gap */}
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        The Reality Check
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        From Graduate to Industry-Ready
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-4">
                        There is a massive gap between a CPL/IR holder and a First Officer. Airlines don't just want stick-and-rudder skills; they want pilots who can manage automation, exercise sound judgment, and exhibit the KSA (Knowledge, Skills, and Attitudes) defined by ICAO's EBT standards.
                    </p>
                    <p className="text-base text-slate-700 leading-relaxed mb-6">
                        Our program doesn't reteach you how to land; it teaches you how to think, prioritize, and manage resources like an airline Captain from day one.
                    </p>
                    <div className="bg-blue-50 rounded-xl p-4 border border-blue-100 inline-block text-left">
                        <p className="text-sm text-slate-700">
                            <strong className="text-blue-700">Already completed the Foundation Program?</strong> Your verified profile and mentorship hours carry forward. Transition Program is $149 for graduates — your competency record speaks for itself.
                        </p>
                    </div>
                </div>

                {/* Section 2 – Features */}
                <div className="max-w-3xl mx-auto text-center">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        Tools of the Trade
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                        Industry-Standard Tech
                    </h2>
                    <ul className="space-y-4 text-left">
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900 block">EBT/CBTA Competency Assessment (Aligned with HINFACT Framework)</span>
                                <span className="text-slate-600 text-sm">Train with our own competency-based assessment framework built to align with HINFACT and ICAO EBT/CBTA standards. Evaluate your own readiness without needing direct HINFACT access.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900 block">GCAA ATPL Pathway</span>
                                <span className="text-slate-600 text-sm">Align your theoretical knowledge with GCAA ATPL standards used by carriers in the Middle East.</span>
                            </div>
                        </li>
                        <li className="flex items-start gap-3">
                            <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                            <div>
                                <span className="font-bold text-slate-900 block">Type Rating Insight</span>
                                <span className="text-slate-600 text-sm">Preview the demands of a B737 or A320 type rating before you invest, so you know what to expect.</span>
                            </div>
                        </li>
                    </ul>
                </div>

                {/* Section 2.5 – The 9 Core Competencies */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Real Requirements
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What Airlines Look For (It's Not Just Hours)
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Yes, you need 1,500 hours to apply to most airlines. But what are they <em>really</em> evaluating when they review your application and assess you during training? Industry data shows a clear pattern: <strong>it's about competency, not just time logged</strong>.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Airlines want pilots who demonstrate mastery of the <strong>9 core competencies</strong> defined by ICAO and adopted by EBT/CBTA frameworks worldwide. These competencies are what separate a pilot with 1,500 hours of pattern work from one with 1,500 hours of meaningful, competency-building experience.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                            <h3 className="text-lg font-bold text-slate-900 mb-4 text-center md:text-left">The 9 Core Competencies</h3>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">1</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Application of Procedures</strong>
                                        <p className="text-xs text-slate-600">Following SOPs and checklists correctly</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">2</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Communication</strong>
                                        <p className="text-xs text-slate-600">Clear, concise, and effective information exchange</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">3</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Aircraft Flight Path Management (Automation)</strong>
                                        <p className="text-xs text-slate-600">Managing automated systems and flight path</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">4</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Aircraft Flight Path Management (Manual)</strong>
                                        <p className="text-xs text-slate-600">Hand-flying skills and manual control</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">5</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Leadership &amp; Teamwork</strong>
                                        <p className="text-xs text-slate-600">CRM and crew coordination</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">6</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Problem Solving &amp; Decision Making</strong>
                                        <p className="text-xs text-slate-600">Analytical thinking under pressure</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">7</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Situational Awareness</strong>
                                        <p className="text-xs text-slate-600">Maintaining the big picture</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">8</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Workload Management</strong>
                                        <p className="text-xs text-slate-600">Prioritizing tasks and managing time</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <span className="text-sm font-bold text-blue-700">9</span>
                                    </div>
                                    <div>
                                        <strong className="text-sm text-slate-900">Knowledge</strong>
                                        <p className="text-xs text-slate-600">Technical understanding and systems knowledge</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3 – Program Pillars */}
                <div className="text-center mb-10">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                        WHAT YOU'LL MASTER
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
                        4 Core Pillars
                    </h2>
                    <p className="text-base text-slate-700 max-w-xl mx-auto leading-relaxed">
                        Every module maps directly to what airlines evaluate. No filler, no fluff.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {/* Pillar 1 – EBT/CBTA */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => onNavigate('ebt-cbta')}>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                            <Brain className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">EBT/CBTA Competencies</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">The 9 core competencies and the mental shift from GA to airline ops.</p>
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-900">Learn more <ArrowRight className="w-3 h-3" /></span>
                    </div>
                    {/* Pillar 2 – GCAA ATPL */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => onNavigate('gcaa-atpl')}>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                            <Globe className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">GCAA ATPL Pathway</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">GCAA licensing structure, EASA conversion, and positioning for Middle East carriers.</p>
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-900">Learn more <ArrowRight className="w-3 h-3" /></span>
                    </div>
                    {/* Pillar 3 – ATLAS CV */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => onNavigate('atlas-cv')}>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                            <FileText className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">ATLAS Aviation CV</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">Structured CV format designed specifically for airline recruiters.</p>
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-900">Learn more <ArrowRight className="w-3 h-3" /></span>
                    </div>
                    {/* Pillar 4 – Airline Operations */}
                    <div className="bg-slate-50 rounded-xl p-5 border border-slate-100 hover:border-blue-200 hover:shadow-md transition-all group cursor-pointer" onClick={() => onNavigate('airline-operations')}>
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center mb-3 group-hover:bg-blue-600 transition-colors">
                            <Plane className="w-5 h-5 text-blue-600 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="text-sm font-bold text-slate-900 mb-1">Airline Operations</h3>
                        <p className="text-xs text-slate-600 leading-relaxed mb-3">Assessment criteria, interview prep, and what separates successful candidates.</p>
                        <span className="text-xs font-bold text-blue-700 flex items-center gap-1 group-hover:text-blue-900">Learn more <ArrowRight className="w-3 h-3" /></span>
                    </div>
                </div>

                {/* Section 4 – What's Included */}
                <div className="bg-slate-900 rounded-3xl text-white p-8 md:p-12 text-center">
                    <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">
                        What's Included
                    </p>
                    <h2 className="text-2xl md:text-4xl font-bold mb-6">
                        Transition Program — $299
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-8">
                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="text-3xl font-bold text-blue-400 mb-2">9</div>
                            <p className="text-sm text-slate-300">Core Competency Modules with EBT/CBTA alignment</p>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="text-3xl font-bold text-blue-400 mb-2">1</div>
                            <p className="text-sm text-slate-300">ATLAS-format CV ready for airline recruiters</p>
                        </div>
                        <div className="bg-slate-800 rounded-xl p-6">
                            <div className="text-3xl font-bold text-blue-400 mb-2">∞</div>
                            <p className="text-sm text-slate-300">Lifetime access to program updates and community</p>
                        </div>
                    </div>
                    <p className="text-slate-400 text-sm mb-6 max-w-2xl mx-auto">
                        Foundation Program graduates pay $149. No hidden fees. No recurring charges. One payment, full access.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('contact-support')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Start Transition Program
                            <ArrowLeft className="w-5 h-5 rotate-180" />
                        </button>
                        <button
                            onClick={() => onNavigate('foundational-program')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-700 text-white font-bold rounded-xl hover:bg-slate-600 transition-colors"
                        >
                            View Foundation Program First
                        </button>
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
        </div>
        </>
    );
};
