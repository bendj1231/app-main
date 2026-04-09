import React from 'react';
import { ArrowLeft, Monitor, Database, Radio, BookOpen, UserCheck, Shield, Zap, CheckCircle2, ChevronRight, Cpu, Layout, Layers, BarChart3, Globe } from 'lucide-react';
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
            icon: Monitor,
            bullets: ["Custom Exam Mockups", "Performance Analytics", "GCAA/EASA Alignment"]
        },
        {
            title: "The Black Box",
            desc: "Your digital career vault. A centralized logbook and competency tracker that verifies your experience for industry recruiters.",
            icon: Database,
            bullets: ["Verifiable Experience", "Recruiter-Ready Data", "Career Timeline"]
        },
        {
            title: "IFR Simulator",
            desc: "High-fidelity procedural training focus on instrument flight rules and multi-engine coordination.",
            icon: Radio,
            bullets: ["Procedural Mastery", "Cockpit Familiarization", "Emergency Protocols"]
        },
        {
            title: "Program Handbook",
            desc: "The definitive guide to your aviation journey. Structured roadmaps, technical data, and professional standards.",
            icon: BookOpen,
            bullets: ["Ecosystem Navigation", "Regulatory Reference", "Performance Benchmarks"]
        }
    ];

    const ecosystemFeatures = [
        { title: "Single Sign-On", value: "Access all W1000 tools through a unified, secure portal interface.", icon: Shield },
        { title: "AI Optimised", value: "Every piece of data is formatted to be parsed by legacy airline HR systems.", icon: Cpu },
        { title: "Cross-Platform", value: "Seamless transition between tablet, desktop, and mobile operations.", icon: Layers },
        { title: "Verified Assets", value: "Digital certificates and badges anchored to your professional identity.", icon: UserCheck }
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
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            The Digital Ecosystem | Command & Control
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-8">
                            W1000 WingMentor Suite
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            A high-connectivity ecosystem designed to bridge the gap between initial license
                            and the professional cockpit. Your centralized hub for training verification,
                            digital compliance, and career advancement.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Suite - Magazine Layout */}
            <div className="py-24 px-6 max-w-6xl mx-auto space-y-32">
                {/* Row 1: Examination Terminal (Text left, image right) */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-[10px] font-bold text-blue-700 uppercase tracking-[0.4em] mb-4">
                                Standards Assessment
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                Examination Terminal
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                                A rigorous, airline-standard assessment environment designed to test theoretical knowledge and practical decision-making.
                                Our mocked-up profiles align directly with GCAA/EASA and internal airline recruitment benchmarks.
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
                    <div className="md:w-1/2">
                        <RevealOnScroll delay={200}>
                            <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[2.5rem]">
                                <div className="absolute inset-0 bg-blue-100/20 blur-3xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src="https://lh3.googleusercontent.com/d/1waom5qY_plA5lA_gWvhlQOx0A8_YcPpg"
                                    alt="Examination Terminal"
                                    className="relative w-full h-auto rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Row 2: The Black Box (Image left, text right) */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.4em] mb-4">
                                Career Intelligence
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                The Black Box
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                                Your digital career vault. A centralized logbook and competency tracker that verifies your experience for industry recruiters.
                                The Black Box transforms raw hours into data-driven competency markers.
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
                    <div className="md:w-1/2">
                        <RevealOnScroll delay={200}>
                            <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[2.5rem]">
                                <div className="absolute inset-0 bg-blue-100/20 blur-3xl rounded-[2.5rem] opacity-0 group-hover:opacity-100 transition-opacity"></div>
                                <img
                                    src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                    alt="The Black Box"
                                    className="relative w-full h-auto rounded-[2.5rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02] bg-white p-20"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Secondary Suite Features */}
            <div className="py-24 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-serif text-slate-900 mb-4">Tactical Tools & Resources</h2>
                        <p className="text-slate-500 font-sans">Complementary resources for professional development</p>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="p-12 bg-white border border-slate-200 rounded-[3rem] hover:shadow-2xl transition-all group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                                <Radio className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">IFR Simulator</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-sans">High-fidelity procedural training focusing on instrument flight rules and multi-engine coordination for advanced fleet transitions.</p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Mastery</div>
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Procedures</div>
                            </div>
                        </div>
                        <div className="p-12 bg-white border border-slate-200 rounded-[3rem] hover:shadow-2xl transition-all group">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8">
                                <BookOpen className="w-7 h-7 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">Program Handbook</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed font-sans">The definitive guide to your aviation journey. Structured roadmaps, technical data, and professional standards for the modern pilot.</p>
                            <div className="flex gap-4">
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Roadmaps</div>
                                <div className="px-4 py-2 bg-slate-50 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest">Standards</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stewardship Section (Dark Glassmorphism) */}
            <div className="py-24 px-6 bg-[#050A30] text-white overflow-hidden relative border-y border-white/5">
                <div className="absolute top-0 right-0 w-1/3 h-full bg-blue-600/5 skew-x-12 translate-x-20"></div>
                <div className="max-w-7xl mx-auto relative z-10">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <RevealOnScroll>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-400/10 rounded-full border border-blue-400/20 mb-6">
                                    <Zap className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Masterclass Integration</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    The Pilot <br />Masterclass
                                </h2>
                                <p className="text-lg text-slate-300 mb-8 leading-relaxed font-sans italic opacity-80">
                                    "Making the connection between pilot & Industry Expectations, demands & Pilot Recognition easier like never before."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed font-sans mb-10">
                                    Beyond technical tools, the W1000 Suite provides direct access to the Pilot Masterclass—a mentorship
                                    journey led by industry veterans. Learn the 'hidden' protocols of airline interviews, corporate
                                    networking, and professional stewardship.
                                </p>
                                <button
                                    onClick={() => onNavigate('airline-expectations')}
                                    className="flex items-center gap-2 text-blue-400 font-bold tracking-widest uppercase text-xs hover:text-white transition-all group"
                                >
                                    Explore the Syllabus <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                                </button>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <RevealOnScroll delay={200}>
                                <div className="bg-white/5 backdrop-blur-3xl border border-white/10 rounded-[3rem] p-8 md:p-12 shadow-2xl relative overflow-hidden group">
                                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                                    <div className="flex flex-col gap-6 relative z-10">
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
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>
            </div>

            {/* Ecosystem Features */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Unified Platform Infrastructure</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {ecosystemFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
                            <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:rotate-6" />
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
