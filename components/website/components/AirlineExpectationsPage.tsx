import React from 'react';
import { ArrowLeft, Target, Users, Brain, Award, CheckCircle2, Briefcase, Shield, Search, Zap, Globe, Cpu } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface AirlineExpectationsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AirlineExpectationsPage: React.FC<AirlineExpectationsPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const coreExpectations = [
        {
            title: "Technical Mastery",
            desc: "Beyond handling skills, airlines assess your mastery of automation, systems logic, and manual flight path management.",
            icon: Cpu,
            bullets: ["Automation Logic", "Manual Precision", "Systems Mastery"]
        },
        {
            title: "Behavioral Competency",
            desc: "Evaluations focus on your ability to work within a crew, demonstrating CRM, leadership, and effective communication.",
            icon: Users,
            bullets: ["CRM Excellence", "Decision Making", "Balanced Leadership"]
        },
        {
            title: "Cognitive Resilience",
            desc: "Assessment of situational awareness, workload management, and the ability to solve complex problems under pressure.",
            icon: Brain,
            bullets: ["Mental Math", "Situational Awareness", "Workload Management"]
        },
        {
            title: "Professional Persona",
            desc: "Your commitment to the airline's values, safety culture, and long-term professional development/career stewardship.",
            icon: Shield,
            bullets: ["Safety Culture", "Company Fit", "Ethics & Integrity"]
        }
    ];

    const assessmentPipeline = [
        { title: "Screening", value: "Initial digital audit of your ATLAS CV and minimum legal credentials.", icon: Search },
        { title: "Psychometrics", value: "Advanced testing of cognitive ability, spatial awareness, and personality fit.", icon: target => <Target className="w-5 h-5 text-blue-600" /> },
        { title: "Technical/HR", value: "Multi-stage interviews focusing on competency-based responses and SOP knowledge.", icon: Briefcase },
        { title: "Simulator Audit", value: "Practical demonstration of EBT/CBTA competencies in a multi-crew environment.", icon: Zap }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching AboutPage style */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Strategic Career Guidance
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Airline Expectations
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                            Understanding what airlines really look for in pilot candidates—beyond the 1,500-hour requirement.
                            We bridge the gap between "having the hours" and "being the right candidate."
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Visible Content - 2 Paragraphs (Magazine Style) */}
            <div className="py-12 px-6 max-w-4xl mx-auto space-y-8">
                <div className="text-center mb-12">
                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                        Industry Intelligence
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        What Airlines Really Look For
                    </h2>
                </div>

                <p className="text-base md:text-lg text-slate-700 leading-relaxed mb-6 font-sans">
                    The aviation industry has evolved beyond the traditional "1,500 hours and a clean record" hiring model.
                    Modern airlines—especially major carriers like Emirates, Qatar Airways, and Etihad—now employ sophisticated
                    screening processes that evaluate candidates through Evidence-Based Training (EBT) and Competency-Based Training
                    & Assessment (CBTA) frameworks. These systems assess not just your flight hours, but your demonstrated competency
                    across nine core performance areas.
                </p>

                <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                    WingMentor bridges this gap by providing direct insight from training captains and recruitment specialists at
                    global carriers. Our program prepares you for the modern assessment pipeline: from initial ATLAS CV screening
                    and psychometric testing, through competency-based interviews, to the final simulator evaluation. Understanding
                    these expectations before you apply is the difference between being "qualified on paper" and being "the right
                    candidate for the flight deck."
                </p>
            </div>

            {/* Information Gate Container */}
            <div className="relative">
                {/* Gated Sections (Blurred) */}
                <div className="blur-[12px] opacity-20 pointer-events-none select-none transition-all duration-700">
                    {/* Core Expectations Grid */}
                    <div className="py-12 px-6 max-w-7xl mx-auto">
                        <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">The Four Pillars of Assessment</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            {coreExpectations.map((item, idx) => (
                                <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start min-h-[350px]">
                                    <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                                        {typeof item.icon === 'function' ? item.icon({}) : <item.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />}
                                    </div>
                                    <h3 className="text-2xl font-serif text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 mb-8 leading-relaxed text-sm font-sans">{item.desc}</p>
                                    <div className="space-y-3 mt-auto w-full">
                                        {item.bullets.map((bullet, i) => (
                                            <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider">
                                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                {bullet}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Cinematic Section (Dark) */}
                    <div className="py-24 px-6 bg-[#050A30] text-white">
                        <div className="max-w-7xl mx-auto">
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                                <div>
                                    <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Real-World Assessment</p>
                                    <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                        Beyond the 1,500 Hours: <br />The Evidence Filter
                                    </h2>
                                    <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                        "Meeting the minimum is the entry ticket. Competency is the invitation to the flight deck."
                                    </p>
                                    <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                        Airlines are moving toward Evidence-Based Training (EBT) screening. Our insight from
                                        training leadership at global carriers ensures you understand the 9 core competencies
                                        before you ever walk into the assessment center.
                                    </p>
                                </div>
                                <div className="relative">
                                    <div className="aspect-[4/3] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                        <img
                                            src="https://images.unsplash.com/photo-1520437358207-323b43b50729?q=80&w=2940&auto=format&fit=crop"
                                            alt="Airline Flight Deck Assessment"
                                            className="w-full h-full object-cover"
                                        />
                                        <div className="absolute inset-0 bg-blue-900/30 mix-blend-multiply"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                </div>

                {/* Article Section 1 */}
                <div className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="order-2 md:order-1">
                        <img
                            src="https://images.unsplash.com/photo-1559628376-f3fe5f782a2e?q=80&w=2000&auto=format&fit=crop"
                            alt="Airline Culture"
                            className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                        />
                    </div>
                    <div className="order-1 md:order-2">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">Cultural Fit Assessment</p>
                        <h2 className="text-3xl font-serif text-slate-900 mb-6">Beyond The Cockpit:<br />Flagship Carrier Culture</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            Airlines aren't just hiring pilots; they're hiring future captains and brand ambassadors. Major carriers invest heavily in their corporate identity, and they expect their flight deck crew to embody these values. Our assessment preparation goes beyond technical skills to ensure you demonstrate the professional persona, leadership qualities, and cultural alignment that recruiters at top-tier airlines effectively mandate.
                        </p>
                    </div>
                </div>

                {/* Article Section 2 */}
                <div className="py-12 px-6 max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center mb-24">
                    <div>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">Technical vs. Non-Technical</p>
                        <h2 className="text-3xl font-serif text-slate-900 mb-6">The Competency Balance</h2>
                        <p className="text-slate-600 text-lg leading-relaxed">
                            While technical proficiency is non-negotiable, the deciding factor in modern airline recruitment often lies in non-technical competencies. Decision-making, situational awareness, and communication are scrutinized under the microscope of EBT frameworks. We provide the strategies to articulate your experience in the language of these competencies, turning your flight hours into a compelling narrative of safety and leadership.
                        </p>
                    </div>
                    <div>
                        <img
                            src="https://images.unsplash.com/photo-1483450389192-3d3a4d715df9?q=80&w=2000&auto=format&fit=crop"
                            alt="Cockpit Teamwork"
                            className="rounded-3xl shadow-2xl w-full h-[400px] object-cover"
                        />
                    </div>
                </div>

                {/* Gated Content Blur Wrapper */}
                <div className="relative">
                    <div className="absolute inset-0 z-20 bg-gradient-to-t from-white via-white/95 to-transparent h-full backdrop-blur-[2px] pointer-events-none"></div>

                    {/* Blurred Content */}
                    <div className="opacity-30 blur-sm pointer-events-none select-none grayscale-[50%]">
                        {/* Assessment Pipeline (Visual Placeholder for Gated Content) */}
                        <div className="py-24 px-6 max-w-7xl mx-auto">
                            <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center font-bold">Modern Assessment Stages</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                                {assessmentPipeline.map((item, idx) => (
                                    <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] min-h-[300px]">
                                        <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200">0{idx + 1}</div>
                                        {typeof item.icon === 'function' ? item.icon({}) : <item.icon className="w-8 h-8 text-blue-600 mb-8" />}
                                        <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Newsletter / Unlock Card - Positioned over the blur */}
                    <div className="absolute inset-0 z-30 flex items-center justify-center pt-20">
                        <div className="w-full max-w-4xl px-6">
                            <RevealOnScroll delay={100}>
                                <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center shadow-2xl">
                                    <img
                                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                        alt="WingMentor Logo"
                                        className="w-40 h-auto object-contain mb-6"
                                    />

                                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                        Newsletter & Hub Access
                                    </p>

                                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                        Unlock Full Industry <br /> Intelligence
                                    </h2>

                                    <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                                        Subscribe to our newsletter to unlock the full "Airline Expectations" analysis and gain access to strategic career intelligence.
                                    </p>

                                    <div className="flex w-full max-w-md gap-4">
                                        <input
                                            type="email"
                                            placeholder="Enter your email address"
                                            className="flex-1 px-6 py-4 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600/20 focus:border-blue-600 transition-all"
                                        />
                                        <button className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-600/20 active:scale-95">
                                            Subscribe
                                        </button>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>

                {/* Back button and small decoration (from AboutPage) */}
                <div className="py-12 flex flex-col items-center gap-12">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>

                    <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                        <Shield className="w-6 h-6 text-slate-300" />
                    </div>
                </div>
            </div>
        </div>
    );
};
