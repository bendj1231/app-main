import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
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
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Airline Transition Program
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Shifting from Flight School to Airline Mindset
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        A structured bridge from fresh graduate to airline‑industry‑ready pilot. The Transition Program walks you through all nine EBT/CBTA core competencies using industry‑standard tools such as Airbus‑recommended HINFACT, aligns you with real airline expectations, and gives type‑rating insight before you commit tens of thousands to training.
                    </p>
                </div>
            </div>

            {/* Main Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1 - The Gap */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="order-2 md:order-1">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Reality Check
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            We transition you from graduate to aviation industry ready
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            There is a massive gap between a CPL/IR holder and a First Officer. Airlines don't just want stick-and-rudder skills; they want pilots who can manage automation, make data-driven decisions, and exhibit the KSA (Knowledge, Skills, and Attitudes) defined by ICAO's EBT standards.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our program doesn't reteach you how to land; it teaches you how to think, prioritize, and manage resources like an airline Captain from day one.
                        </p>
                    </div>
                </div>

                {/* Section 2 – Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center">
                    <div className="md:pl-8">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Tools of the Trade
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Industry-Standard Tech
                        </h2>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-slate-900 block">HINFACT (Industry-Standard EBT CBTA Tool)</span>
                                    <span className="text-slate-600 text-sm">Train with the exact competency-based assessment tools used by major carriers to evaluate their own crews.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-slate-900 block">Emirates-Standard GCAA ATPL</span>
                                    <span className="text-slate-600 text-sm">Align your theoretical knowledge with the high standards of Middle Eastern flag carriers.</span>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <CheckCircle2 className="w-6 h-6 text-blue-600 flex-shrink-0 mt-0.5" />
                                <div>
                                    <span className="font-bold text-slate-900 block">Type Rating Insight</span>
                                    <span className="text-slate-600 text-sm">Preview the demands of a B737 or A320 type rating before you invest, saving you from costly surprises.</span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Section 2.5 – The 9 Core Competencies */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            The Real Requirements
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What Airlines Look For (It's Not Just Hours)
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Yes, you need 1,500 hours to apply to most airlines. But what are they <em>really</em> evaluating when they review your application and assess you during training? Our connections with Airbus and Etihad have revealed the truth: <strong>it's about competency, not just time logged</strong>.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Airlines want pilots who demonstrate mastery of the <strong>9 core competencies</strong> defined by ICAO and adopted by EBT/CBTA frameworks worldwide. These competencies are what separate a pilot with 1,500 hours of pattern work from one with 1,500 hours of meaningful, competency-building experience.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="bg-slate-50 rounded-3xl p-6 border border-slate-100">
                            {/* Airbus × WingMentor Recognition */}
                            <div className="flex flex-col items-center mb-6 pb-6 border-b border-slate-200">
                                <div className="flex items-center gap-3 mb-3">
                                    <img
                                        src="/images/accreditation-4.png"
                                        alt="Airbus"
                                        className="h-10 w-auto object-contain"
                                    />
                                    <span className="text-2xl font-light text-slate-400">×</span>
                                    <img
                                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                                        alt="WingMentor"
                                        className="h-10 w-auto object-contain"
                                    />
                                </div>
                                <p className="text-xs text-center text-slate-600 leading-relaxed">
                                    <strong>Recognized and in collaboration with AIRBUS</strong><br />
                                    with integrated HINFACT applications
                                </p>
                            </div>

                            <h3 className="text-lg font-bold text-slate-900 mb-4">The 9 Core Competencies</h3>
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

                {/* Section 3 – Program Components */}
                <div className="bg-gradient-to-br from-slate-50 to-blue-50 rounded-3xl p-8 md:p-12 border border-slate-200">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Explore the Program
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 text-center">
                        Program Components & Resources
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8 text-center max-w-3xl mx-auto">
                        The Transition Program integrates multiple pathways and tools to prepare you for airline operations. Explore each component to understand how we bridge the gap from flight school to airline-ready pilot.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* EBT/CBTA */}
                        <div
                            onClick={() => onNavigate('ebt-cbta')}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="aspect-video bg-slate-100 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2940&auto-format&fit=crop"
                                    alt="EBT/CBTA Training"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    EBT/CBTA Preparation
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Learn the 9 core competencies airlines assess and understand what Airbus and Etihad training leadership expect from pilot candidates. Prepare for the mental shift from general aviation to airline operations.
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                    <span>Learn More</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Airline Expectations */}
                        <div
                            onClick={() => onNavigate('airline-expectations')}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="aspect-video bg-slate-100 overflow-hidden">
                                <img
                                    src="/images/airline-operations.png"
                                    alt="Airline Operations"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    Airline Expectations
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Understand what airlines really look for in pilot candidates beyond the 1,500-hour requirement. Learn about assessment criteria, interview preparation, and the competencies that set successful candidates apart.
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                    <span>Learn More</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* Emirates ATPL Pathways */}
                        <div
                            onClick={() => onNavigate('emirates-atpl')}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="aspect-video bg-slate-100 overflow-hidden">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu"
                                    alt="Emirates ATPL"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    Emirates ATPL Pathways
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Explore the structured pathway to an Emirates-standard GCAA ATPL license through partner schools like Fujairah Aviation. Learn about EASA conversion, training costs, and positioning yourself for Middle Eastern carriers.
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                    <span>Learn More</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>

                        {/* ATLAS CV */}
                        <div
                            onClick={() => onNavigate('atlas-cv')}
                            className="bg-white rounded-2xl overflow-hidden shadow-sm border border-slate-200 hover:shadow-lg transition-all cursor-pointer group"
                        >
                            <div className="aspect-video bg-slate-100 overflow-hidden">
                                <img
                                    src="/images/atlas_wallpaper_regular.png"
                                    alt="ATLAS Aviation CV"
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                            </div>
                            <div className="p-6">
                                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-blue-600 transition-colors">
                                    ATLAS Aviation CV
                                </h3>
                                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                    Create a globally recognized, AI-optimized aviation CV using the ATLAS format. Present your experience, competencies, and qualifications in the standardized format preferred by international airlines and recruiters.
                                </p>
                                <div className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                    <span>Learn More</span>
                                    <ArrowLeft className="w-4 h-4 rotate-180 group-hover:translate-x-1 transition-transform" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4 – Career Advantage */}
                <div className="bg-slate-900 rounded-3xl text-white p-8 md:p-12 text-center">
                    <h2 className="text-2xl md:text-4xl font-bold mb-6">
                        A Decisive Advantage
                    </h2>
                    <p className="text-lg text-slate-300 max-w-3xl mx-auto leading-relaxed mb-8">
                        Combined with our accreditation partners, this program gives you a visible edge when presenting yourself to cadet programs, ATOs, and early first‑officer opportunities. You won't just be another applicant with a license; you'll be a candidate with a professional operator's mindset.
                    </p>
                    <div className="flex flex-col md:flex-row gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('contact-support')}
                            className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 transition-colors"
                        >
                            Enroll in Transition Program
                            <ArrowLeft className="w-5 h-5 rotate-180" />
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
