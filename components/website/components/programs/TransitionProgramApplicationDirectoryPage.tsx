import React from 'react';
import { ArrowLeft, Rocket, Shield, Award, Zap, CheckCircle2, ChevronRight, Briefcase, Users, Target, BarChart3, Globe } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface TransitionProgramApplicationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const TransitionProgramApplicationPage: React.FC<TransitionProgramApplicationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const mainFeatures = [
        {
            title: "Airline Readiness",
            desc: "Bridge the gap between general aviation and the flight deck of a flagship carrier with specialized preparation.",
            icon: Rocket,
            bullets: ["EBT/CBTA Prep", "SOP Alignment", "CRM Excellence"]
        },
        {
            title: "Advanced ATLAS Profiling",
            desc: "Full AI optimization of your career data for direct injection into airline recruitment databases.",
            icon: Target,
            bullets: ["AI Screening", "Data Portability", "Recruiter Priority"]
        },
        {
            title: "Broker & Operator Links",
            desc: "Direct referrals to private jet brokers and corporate flight departments looking for transition-ready pilots.",
            icon: Users,
            bullets: ["Network Access", "Direct Messaging", "Career Placement"]
        },
        {
            title: "Verified Excellence",
            desc: "Your advanced training and milestones are audited and legalized through our global recognition systems.",
            icon: Shield,
            bullets: ["Security Audits", "Verified Experience", "Universal Credibility"]
        }
    ];

    const pipelineSteps = [
        { title: "Experience Audit", value: "A comprehensive review of your flight hours and training history by our expert panel.", icon: BarChart3 },
        { title: "Skill Analytics", value: "Direct mapping of your competencies against airline-specific entry requirements.", icon: Zap },
        { title: "Profile Optimization", value: "Conversion of your career history into the premium ATLAS CV recognition format.", icon: Globe },
        { title: "Placement Strategy", value: "Deployment of your profile to our network of partner airlines and jet operators.", icon: Briefcase }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            Advanced Career Pathway
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Transition Program Application
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Airline Readiness | Advanced ATLAS Profiling | Broker Links
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            Accelerate your evolution from flight training to the professional flight deck. Our transition program provides the legalization of recognition for advanced pilots. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>EBT CBTA-aligned assessment framework</strong> specifically evaluates the CRM and multi-crew competencies that modern airlines require.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Advantages Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Program Advantages
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Why Choose the Transition Program
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {mainFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
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
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Advanced Recognition
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Bridging the Gap to Flagship Careers
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic text-center max-w-3xl mx-auto">
                                "We make the connection between pilot performance and airline expectations easier than ever before."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans text-center max-w-3xl mx-auto">
                                The Transition Program is our most advanced recognition tier. It is designed to take pilots approaching professional minimums and provide the data-driven credibility required by modern airline HR systems. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>blockchain-verifiable certifications</strong> and <strong>ATS-compatible ATLAS Aviation CV formatting</strong> provide pilots with cutting-edge tools for career advancement.
                            </p>
                            <div className="space-y-4 max-w-md mx-auto">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span className="text-slate-300 text-sm font-sans">Direct Registry with Partner Carriers</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span className="text-slate-300 text-sm font-sans">Universal ATLAS CV Certification</span>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Your Journey
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Transition Pipeline
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pipelineSteps.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center mb-8">
                                <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                            </div>
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
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Apply for Transition Status</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto">
                            Ensure your career experience is legalized and recognized. Start the transition audit
                            today and gain the visibility your hard work deserves.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Start Transition Audit
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
