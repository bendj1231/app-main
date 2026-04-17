import React from 'react';
import { ArrowLeft, Mail, Users, Shield, Zap, Activity, CheckCircle2, BarChart3, Brain, Globe } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface HinfactPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const HinfactPage: React.FC<HinfactPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching the About Page style */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <div className="flex justify-center items-center gap-4 mb-4">
                        <img src="/images/accreditation-4.png" alt="Airbus" className="h-6 w-auto opacity-70" />
                        <div className="w-px h-6 bg-slate-300"></div>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700">
                            HINFACT AIRBUS INTEGRATION
                        </p>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Human Factors Quantified
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                        Pioneering the future of aviation safety through direct integration with Airbus EBT/CBTA frameworks.
                        We provide the data-driven blueprint for pilot competency and human factors analytics.
                    </p>
                </div>
            </div>

            {/* Visible Content - Magazine Hook (Alternating Rows) */}
            <div className="py-12 px-6 max-w-7xl mx-auto space-y-24">
                {/* Row 1: Intro + Cockpit Integration */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    <div className="md:w-1/2 space-y-8 text-left md:text-justify order-2 md:order-1">
                        <div className="hidden md:block mb-8">
                            <img src="/images/accreditation-4.png" alt="Airbus" className="h-16 w-auto opacity-90" />
                        </div>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans first-letter:text-5xl first-letter:font-serif first-letter:text-slate-900 first-letter:mr-3 first-letter:float-left">
                            HINFACT represents the next evolution in pilot training—a seamless integration of real-time biometric and cognitive monitoring directly into the Airbus cockpit environment. By leveraging advanced eye-tracking and workload analysis, we bridge the critical gap between subjective instructor assessment and objective, data-driven performance metrics.
                        </p>
                    </div>
                    <div className="md:w-1/2 order-1 md:order-2">
                        <RevealOnScroll>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-blue-600 rounded-[2rem] translate-x-4 translate-y-4 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2940&auto-format&fit=crop"
                                    alt="Airbus Cockpit Integration"
                                    className="w-full h-auto object-cover rounded-[2rem] shadow-2xl aspect-[4/3]"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <Activity className="w-4 h-4 text-blue-600" />
                                        Cockpit Integration
                                    </h3>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Row 2: Analytics + EBT Context */}
                <div className="flex flex-col md:flex-row items-center gap-12 md:gap-24">
                    <div className="md:w-1/2 order-1">
                        <RevealOnScroll delay={200}>
                            <div className="relative group">
                                <div className="absolute inset-0 bg-slate-900 rounded-[2rem] -translate-x-4 translate-y-4 -z-10 group-hover:-translate-x-2 group-hover:translate-y-2 transition-transform duration-500"></div>
                                <img
                                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto-format&fit=crop"
                                    alt="Data Analytics"
                                    className="w-full h-auto object-cover rounded-[2rem] shadow-2xl aspect-[4/3]"
                                />
                                <div className="absolute bottom-6 left-6 right-6 p-4 bg-white/95 backdrop-blur-md rounded-xl shadow-lg border border-white/50">
                                    <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                                        <BarChart3 className="w-4 h-4 text-blue-600" />
                                        Performance Analytics
                                    </h3>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2 space-y-8 text-left md:text-justify order-2">
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            This integration provides WingMentor pilots with unprecedented access to the same Evidence-Based Training (EBT) tools used by the world's leading carriers. Whether you are preparing for a command upgrade or your initial airline assessment, understanding your own cognitive performance metrics—from visual scan patterns to mental workload capacity—is the key to mastering the modern flight deck.
                        </p>
                        <div className="flex items-center gap-4 pt-4 border-t border-slate-200">
                            <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Validated By</div>
                            <img src="/images/accreditation-4.png" alt="Airbus" className="h-6 w-auto opacity-60 mix-blend-multiply" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gated Sections (Blurred) */}
            <div className="relative">
                <div className="blur-[12px] opacity-30 pointer-events-none select-none transition-all duration-700">
                    {/* Content Sections - magazine layout */}
                    <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">

                        {/* Row 1: Technology - text left, image right */}
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                            <div className="md:w-1/2 text-center md:text-left">
                                <RevealOnScroll>
                                    <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                        The Innovation
                                    </p>
                                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6 leading-tight">
                                        Real-time Pilot Monitoring & Analytics
                                    </h2>
                                    <p className="text-base text-slate-700 leading-relaxed mb-6">
                                        HINFACT is more than just a monitoring tool; it's a revolutionary way to understand pilot performance.
                                        By tracking cognitive load, visual scanning patterns, and decision-making efficiency, we provide an objective
                                        baseline for Evidence-Based Training (EBT).
                                    </p>
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
                                        {[
                                            { icon: BarChart3, label: "Eye-Tracking Analytics" },
                                            { icon: Brain, label: "Cognitive Load Mapping" },
                                            { icon: Activity, label: "Workload Assessment" },
                                            { icon: Shield, label: "SOP Compliance" }
                                        ].map((item, idx) => (
                                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                                                <item.icon className="w-4 h-4 text-blue-600" />
                                                <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">{item.label}</span>
                                            </div>
                                        ))}
                                    </div>
                                </RevealOnScroll>
                            </div>
                            <div className="md:w-1/2">
                                <RevealOnScroll>
                                    <div className="relative w-full max-w-md mx-auto">
                                        <img
                                            src="https://images.unsplash.com/photo-1559136555-9303baea8ebd?q=80&w=2940&auto-format&fit=crop"
                                            alt="Airbus Cockpit Integration"
                                            className="w-full rounded-[2.5rem] shadow-2xl object-cover aspect-[4/5]"
                                        />
                                        <div className="absolute top-6 right-6 p-4 bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-white/50">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Activity className="w-4 h-4 text-green-500 animate-pulse" />
                                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sync Status</span>
                                            </div>
                                            <div className="text-lg font-bold text-slate-900">ACTIVE</div>
                                        </div>
                                    </div>
                                </RevealOnScroll>
                            </div>
                        </div>

                        {/* Integration Summary Section */}
                        <div className="py-24 bg-slate-50 border-y border-slate-100 px-6 rounded-[3rem]">
                            <div className="max-w-4xl mx-auto text-center">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                                    Data Intelligence
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-8 leading-tight">
                                    Bridging Subjectivity with Objective Performance
                                </h2>
                                <p className="text-base md:text-lg text-slate-700 leading-relaxed max-w-2xl mx-auto">
                                    WingMentor leverages the Hinfact Airbus applications to transform subjective instructor observations into
                                    objective, actionable data points.
                                </p>
                            </div>
                        </div>

                        {/* Support section */}
                        <div className="py-16 px-6 max-w-6xl mx-auto">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="p-10 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center md:items-start text-center md:text-left">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8">
                                        <Mail className="w-8 h-8 text-blue-600" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900">Technical Support</h3>
                                </div>

                                <div className="p-10 bg-slate-50 border border-slate-100 rounded-3xl flex flex-col items-center md:items-start text-center md:text-left">
                                    <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mb-8">
                                        <Users className="w-8 h-8 text-slate-900" />
                                    </div>
                                    <h3 className="text-2xl font-bold mb-4 text-slate-900">EBT Consultation</h3>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Gateway Card (Shifted Up for immediate impact) */}
                <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pb-32 bg-gradient-to-t from-white via-white/80 to-transparent pt-32 h-full justify-center">
                    <div className="w-full max-w-4xl px-6 -mt-32">
                        <RevealOnScroll delay={100}>
                            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                                <div className="flex flex-col md:flex-row items-center justify-center gap-6 mb-8">
                                    <img
                                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                        alt="WingMentor Logo"
                                        className="h-12 w-auto object-contain"
                                    />
                                    <div className="hidden md:block w-px h-8 bg-slate-300"></div>
                                    <div className="flex items-center gap-3 opacity-80">
                                        <img src="/images/accreditation-4.png" alt="Airbus" className="h-6 w-auto mix-blend-multiply" />
                                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Integration</span>
                                    </div>
                                </div>

                                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                    Member Application Status
                                </p>

                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                    Access HINFACT <br /> Intelligence
                                </h2>

                                <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                                    Full access to Hinfact integration data, EBT analytics, and Airbus specific training modules is reserved for verified members.
                                </p>

                                <div className="flex flex-col items-center w-full max-w-sm gap-4">
                                    <button
                                        onClick={() => onNavigate('become-member')}
                                        className="w-full bg-[#050A30] hover:bg-[#070D3D] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                                    >
                                        Become a Member
                                    </button>
                                    <button
                                        onClick={() => onNavigate('dashboard')}
                                        className="w-full bg-white hover:bg-slate-50 text-slate-900 py-4 rounded-xl font-bold uppercase tracking-widest transition-all border border-slate-200 hover:border-blue-200 hover:text-blue-700"
                                    >
                                        Login to Read More
                                    </button>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="pb-24 flex justify-center px-6">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </button>
            </div>
        </div>
    );
};
