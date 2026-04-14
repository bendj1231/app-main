import React from 'react';
import { ArrowLeft, UserPlus, Shield, Award, Zap, CheckCircle2, ChevronRight, GraduationCap, Users, Target, Search } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface FoundationalProgramApplicationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const FoundationalProgramApplicationPage: React.FC<FoundationalProgramApplicationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const mainFeatures = [
        {
            title: "Join the Global Registry",
            desc: "Secure your place in the WingMentor global talent registry, accessible by airlines and private jet brokers.",
            icon: Users,
            bullets: ["Visibility", "Professional ID", "Global Reach"]
        },
        {
            title: "Verified Stewardship",
            desc: "Formalize your leadership and mentorship activity with cryptographically verified credentials.",
            icon: Shield,
            bullets: ["Digital signatures", "Audited logs", "Recruiter trust"]
        },
        {
            title: "Pathways Access",
            desc: "Unlock direct pathways to Emirates ATPL, Private Charter, and Emerging Air Taxi operations.",
            icon: Zap,
            bullets: ["Direct Entry", "Industry Links", "Career Roadmap"]
        },
        {
            title: "ATLAS CV Formation",
            desc: "Automatically translate your training data into the industry-standard ATLAS Aviation CV format.",
            icon: Target,
            bullets: ["AI Screening", "Standardized Data", "Airline Optimized"]
        }
    ];

    const applicationProcess = [
        { title: "Registration", value: "Submit your initial pilot profile and flight credentials for verification.", icon: UserPlus },
        { title: "Verification", value: "Our AI systems audit your records against GCAA/EASA/FAA standards.", icon: Search },
        { title: "Accreditation", value: "Receive your 'Verified Pilot' status and digital WingMentor badge.", icon: Award },
        { title: "Activation", value: "Your profile goes live in the global database for industry visibility.", icon: CheckCircle2 }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <GraduationCap className="mx-auto w-12 h-12 text-blue-600 mb-8" />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Program Enrollment
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Foundational Program <br />Application
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Step into the professional ecosystem. From verified logbook audits to global
                            airline visibility, start your journey into legalized pilot recognition.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Call to Action Section (Premium Grid) */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mainFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                                <item.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />
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
                            <RevealOnScroll>
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Building Credibility</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    The Voice of the <br />Professional Pilot
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "Making the connection between pilot & Industry Expectations easier like never before."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    Our foundational program is recognized by ATLAS, AIRBUS, and Etihad Museum for its contribution
                                    to pilot career stewardship. We provide the legalization of professional recognition for all pilots.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">Global Registry Authentication</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">verified career vault (The Black Box)</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/3] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src="https://images.unsplash.com/photo-1559067515-bf7d7990494d?q=80&w=2832&auto-format&fit=crop"
                                    alt="Professional Pilot Application"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Application Pipeline */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Enrollment Process</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {applicationProcess.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer / Application Start */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">Start Your Application</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto">
                            The information provided in your application will be scanned by our AI systems
                            to form your initial ATLAS CV and baseline pilot profile.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Enroll in Foundation
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Return to Home
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
