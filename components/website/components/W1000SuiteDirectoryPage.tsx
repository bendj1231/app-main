import React from 'react';
import { ArrowLeft, ChevronRight } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface W1000SuitePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const W1000SuitePage: React.FC<W1000SuitePageProps> = ({ onBack, onNavigate, onLogin }) => {
    const suiteItems = [
        {
            title: "Examination Terminal",
            desc: "A rigorous, airline-standard assessment environment designed to test theoretical knowledge and practical decision-making.",
            bullets: ["Custom Exam Mockups", "Performance Analytics", "GCAA/EASA Alignment"]
        },
        {
            title: "The Black Box",
            desc: "Your digital career vault. A centralized logbook and competency tracker that verifies your experience for industry recruiters.",
            bullets: ["Verifiable Experience", "Recruiter-Ready Data", "Career Timeline"]
        },
        {
            title: "IFR Simulator",
            desc: "High-fidelity procedural training focus on instrument flight rules and multi-engine coordination.",
            bullets: ["Procedural Mastery", "Cockpit Familiarization", "Emergency Protocols"]
        },
        {
            title: "Program Handbook",
            desc: "The definitive guide to your aviation journey. Structured roadmaps, technical data, and professional standards.",
            bullets: ["Ecosystem Navigation", "Regulatory Reference", "Performance Benchmarks"]
        }
    ];

    const ecosystemFeatures = [
        { title: "Single Sign-On", value: "Access all W1000 tools through a unified, secure portal interface." },
        { title: "AI Optimised", value: "Every piece of data is formatted to be parsed by legacy airline HR systems." },
        { title: "Cross-Platform", value: "Seamless transition between tablet, desktop, and mobile operations." },
        { title: "Verified Assets", value: "Digital certificates and badges anchored to your professional identity." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            {/* Header Section - matching AboutPage style */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            The Digital Ecosystem | Command & Control
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            W1000 PilotRecognition Suite
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Digital Ecosystem | Career Intelligence | Unified Platform
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            A high-connectivity ecosystem designed to bridge the gap between initial license and the professional cockpit. Your centralized hub for training verification, digital compliance, and career advancement. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>AI-powered pathway matching</strong> system aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Suite - Magazine Layout */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Core Suite
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Digital Ecosystem Tools
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-6xl mx-auto space-y-32">
                {/* Row 1: Examination Terminal */}
                <div className="text-center max-w-4xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            Examination Terminal
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            A rigorous, airline-standard assessment environment designed to test theoretical knowledge and practical decision-making. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>custom exam mockups</strong> align directly with GCAA/EASA and internal airline recruitment benchmarks.
                        </p>
                        <ul className="space-y-4">
                            {[
                                "Custom Exam Mockups for major carriers",
                                "Real-time performance analytics",
                                "Cognitive and decision-making feedback"
                            ].map((bullet, i) => (
                                <li key={i} className="flex items-center gap-3 text-sm text-slate-600 font-sans">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                    {bullet}
                                </li>
                            ))}
                        </ul>
                    </RevealOnScroll>
                </div>

                {/* Row 2: The Black Box */}
                <div className="text-center max-w-4xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                            The Black Box
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            Your digital career vault. A centralized logbook and competency tracker that verifies your experience for industry recruiters. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> transforms raw hours into data-driven competency markers.
                        </p>
                        <div className="flex flex-col gap-4">
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Recruiter-Ready Data</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">Verified operational history formatted for airline HR and AI scanners.</p>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Digital Compliance</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">Automated status tracking for medicals, LPCs, and certifications.</p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Secondary Suite Features */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Tactical Tools
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Tactical Tools & Resources
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-12 bg-white border border-slate-200 rounded-[3rem] hover:shadow-2xl transition-all group">
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">IFR Simulator</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-sans">High-fidelity procedural training focusing on instrument flight rules and multi-engine coordination for advanced fleet transitions. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>procedural mastery</strong> aligns with manufacturer standards for specialized operations.</p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery</div>
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedures</div>
                            </div>
                        </div>
                        <div className="p-12 bg-white border border-slate-200 rounded-[3rem] hover:shadow-2xl transition-all group">
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">Program Handbook</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-sans">The definitive guide to your aviation journey. Structured roadmaps, technical data, and professional standards for the modern pilot. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that program development aligns with flagship carrier expectations.</p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roadmaps</div>
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stewardship Section (Dark Glassmorphism) */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Mentorship Integration
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        The Pilot Masterclass
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white overflow-hidden relative border-y border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-300 mb-8 leading-relaxed font-sans italic opacity-80 text-center max-w-3xl mx-auto">
                                "Making the connection between pilot & Industry Expectations, demands & Pilot Recognition easier like never before."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed font-sans mb-10 text-center max-w-3xl mx-auto">
                                Beyond technical tools, the W1000 Suite provides direct access to the Pilot Masterclass—a mentorship journey led by industry veterans. Learn the 'hidden' protocols of airline interviews, corporate networking, and professional stewardship. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>AI-powered pathway matching</strong> system provides pilots with cutting-edge tools for career advancement.
                            </p>
                            <div className="flex flex-col gap-6 max-w-2xl mx-auto">
                                {[
                                    { title: "Carrier Alignment", text: "Curated insights specifically for pilots targeting majors like Emirates, Etihad, and Qatar.", highlight: false },
                                    { title: "Corporate Standards", text: "Understanding the unique demands of VIP aviation, non-scheduled ops, and high-net-worth brokering.", highlight: false },
                                    { title: "The Digital Blueprint", text: "Converting your flight school graduate mindset into a professional aviation stewardship profile.", highlight: true }
                                ].map((card, i) => (
                                    <div key={i} className={`p-6 rounded-2xl border transition-all duration-500 ${card.highlight ? 'bg-blue-600/20 border-blue-500/30' : 'bg-white/5 border-white/10 hover:bg-white/10'}`}>
                                        <h4 className={`${card.highlight ? 'text-white' : 'text-blue-400'} font-bold text-sm mb-2 uppercase tracking-widest`}>{card.title}</h4>
                                        <p className={`${card.highlight ? 'text-slate-200' : 'text-slate-300'} text-xs leading-relaxed font-sans font-light`}>{card.text}</p>
                                    </div>
                                ))}
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Ecosystem Features */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Platform Infrastructure
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Unified Platform Infrastructure
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ecosystemFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
                            <h3 className="text-lg font-bold mb-3 font-sans uppercase tracking-wider text-slate-700">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Begin Your Digital Transformation</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans leading-relaxed">
                            Access to the W1000 Suite is included in Foundational and Executive Stewardship memberships.
                            Start building your verified pilot profile today.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-[#050A30] hover:bg-[#070D3D] text-white px-12 py-5 rounded-2xl font-bold text-lg transition-all shadow-xl shadow-blue-900/10 hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-98 border border-white/10 font-sans uppercase tracking-[0.1em]"
                            >
                                Join the Pilot Network
                            </button>
                            <button
                                onClick={onLogin}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-2xl font-bold text-lg transition-all font-sans uppercase tracking-[0.1em]"
                            >
                                Portal Sign In
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
