import React from 'react';
import { ArrowLeft, Rocket, Shield, Award, Zap, CheckCircle2, ChevronRight, Briefcase, Users, Target, Globe, Star, Clock } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface PrivateCharterPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PrivateCharterPathwaysPage: React.FC<PrivateCharterPathwaysPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const charterFeatures = [
        {
            title: "The Operator Side",
            desc: "Critical insight into massive development—constant coordination and diverse missions for corporate fleets.",
            icon: Briefcase,
            bullets: ["Business Transport", "VVIP Support", "Fleet Management"]
        },
        {
            title: "The Broker Model",
            desc: "Understanding the middleman model that connects high-net-worth clients to premium aircraft operators.",
            icon: Users,
            bullets: ["Client Acquisition", "Markup Logic", "Margin Management"]
        },
        {
            title: "Absolute Discretion",
            desc: "Training on professional boundaries and confidentiality required by Fortune 500 executives and heads of state.",
            icon: Shield,
            bullets: ["Confidentiality", "Vetting Protocols", "High Stakes"]
        },
        {
            title: "Service Excellence",
            desc: "Defining success through the service mindset and flawless execution that defines successful charter crews.",
            icon: Star,
            bullets: ["VIP Hospitality", "Mission Precision", "Seamless Care"]
        }
    ];

    const pipelineSteps = [
        { title: "Industry Audit", value: "Evaluation of your professionalism and suitability for the VIP sector.", icon: target => <Target className="w-5 h-5 text-blue-600" /> },
        { title: "Model Selection", value: "Identifying your path: Corporate, Fractional, or VVIP Charter Operations.", icon: Briefcase },
        { title: "Partner Intro", value: "Direct referral to our network of brokers and operators using the ATLAS system.", icon: Globe },
        { title: "Mission Ready", value: "Final deployment into high-value flight operations for global clients.", icon: Rocket }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <Star className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Corporate & VIP Aviation
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Private Charter <br />Pathways
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Enter the world of corporate and VIP flight departments. We prepare you for the
                            professionalism, discretion, and exceptional service defining success beyond raw hours.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Features Grid */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {charterFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
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
                            <RevealOnScroll>
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Insight Advantage</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    Both Sides of the <br />Private Charter Coin
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "We provide the perspective of the operator and the broker—giving you the full picture of the business."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    WingMentor maintains active relationships with charter brokers and maintains direct
                                    connections to operators they work with, including those managed by global airlines.
                                    This perspective means we prepare you for both the mission and the business.
                                </p>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <h4 className="text-white font-bold mb-4 flex items-center gap-3">
                                        <Award className="w-5 h-5 text-blue-400" />
                                        VIP Verification
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed font-sans">
                                        Your WingMentor profile acts as a high-value verification for brokers looking
                                        to ensure the crew they hire meets the expectations of their UHNW clients.
                                    </p>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1zefsTeyIZBEeCjhgHhbgjtk5x8rvZEwU"
                                    alt="Private Charter VIP Operations"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                                <div className="absolute top-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-right">
                                    <p className="text-xs font-bold text-blue-200 tracking-wider uppercase">Sector</p>
                                    <p className="text-white font-bold">VIP & Corporate</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Charter Pathway Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pipelineSteps.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            {typeof item.icon === 'function' ? item.icon({}) : <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />}
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Elevate Your Career Path</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto leading-relaxed">
                            A CPL plus a verified WingMentor profile positions you for cross-border roles in
                            emerging aviation hubs benchmarking against the highest global standards.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Start Your Pathway
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Return to Insight
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
