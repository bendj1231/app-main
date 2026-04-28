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
            desc: "Secure your place in the PilotRecognition global talent registry, accessible by airlines and private jet brokers.",
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
        { title: "Accreditation", value: "Receive your 'Verified Pilot' status and digital PilotRecognition badge.", icon: Award },
        { title: "Activation", value: "Your profile goes live in the global database for industry visibility.", icon: CheckCircle2 }
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
                            Program Enrollment
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Foundational Program Application
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Global Registry | Verified Stewardship | Pathways Access
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            Step into the professional ecosystem. From verified logbook audits to global airline visibility, start your journey into legalized pilot recognition. Through guidance from <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>50 hours of verifiable mentorship</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Call to Action Section (Premium Grid) */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Program Benefits
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Why Join the Foundational Program
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
                        Building Credibility
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        The Voice of the Professional Pilot
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic text-center max-w-3xl mx-auto">
                                "Making the connection between pilot & Industry Expectations easier like never before."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans text-center max-w-3xl mx-auto">
                                Our application process is designed to verify your competencies and prepare you for airline recruitment. Through guidance from <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>EBT CBTA-aligned assessment framework</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                            </p>
                            <div className="space-y-4 max-w-md mx-auto">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span className="text-slate-300 text-sm font-sans">Global Registry Authentication</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                                    <span className="text-slate-300 text-sm font-sans">Verified Career Vault (The Black Box)</span>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Application Pipeline */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Your Journey
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Enrollment Process
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {applicationProcess.map((item, idx) => (
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
