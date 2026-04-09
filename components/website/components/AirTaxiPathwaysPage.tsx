import React from 'react';
import { ArrowLeft, Rocket, Shield, Award, Zap, CheckCircle2, ChevronRight, Briefcase, Users, Target, Globe, Plane, Building2, Cpu } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface AirTaxiPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AirTaxiPathwaysPage: React.FC<AirTaxiPathwaysPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const industryElements = [
        {
            title: "eVTOL Revolution",
            desc: "Direct involvement with Archer and Joby Aviation to define the next generation of urban pilot requirements.",
            icon: Rocket,
            bullets: ["Electric Propulsion", "Vertical Ops", "Simplified Control"]
        },
        {
            title: "Drone Logistics (MLG)",
            desc: "Pathway into high-value cargo and logistics drone operations through our partnership with MLG leadership.",
            icon: Building2,
            bullets: ["Remote Pilotage", "Autonomous Systems", "Strategic Delivery"]
        },
        {
            title: "Urban Air Mobility",
            desc: "Specialized training in the high-density, low-altitude airspace management required for city-center hubs.",
            icon: Globe,
            bullets: ["UAM Corridors", "Vertiport SOPs", "Urban Navigation"]
        },
        {
            title: "Direct Recruitment",
            desc: "WingMentor serves as a primary verification layer for air taxi operators looking for ready-to-deploy pilots.",
            icon: Target,
            bullets: ["Partner Referrals", "Verified Profiles", "Early Access"]
        }
    ];

    const pipelineSteps = [
        { title: "Sector Audit", value: "A review of your current ratings against emerging air mobility requirements.", icon: Shield },
        { title: "Competency Mapping", value: "Aligning your flight experience with eVTOL and remote-pilot behaviors.", icon: Cpu },
        { title: "Partner Referral", value: "Deployment of your profile to our network of air taxi and logistics operators.", icon: Briefcase },
        { title: "Fleet Activation", value: "Final selection and training for next-generation aircraft operations.", icon: Plane }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <Zap className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Emerging Air Mobility
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Air Taxi <br />Pathways
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Urban air mobility is no longer science fiction. WingMentor provides the bridge to careers
                            with Archer, MLG, and Joby Aviation—the titans of the eVTOL revolution.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Industry Features Grid */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {industryElements.map((item, idx) => (
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
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Vertical Integration</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    The Future of Flight <br />is Sustainable
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "We are connecting traditional pilot skills with the future of electric vertical mobility."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    The air taxi sector requires a new kind of professional. It's about systems management,
                                    urban situational awareness, and extreme precision. WingMentor is the only platform
                                    legally recognized for its contribution to next-generation pilot recognition.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">Direct Registry with eVTOL Partners</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">Specialized UAM Competency Training</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1rZLzWxCpouDAIoNRFxeli5GDa3lhGyr2"
                                    alt="Air Taxi Pathway"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                                <div className="absolute top-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-right">
                                    <p className="text-xs font-bold text-blue-200 tracking-wider uppercase">Active Fleet</p>
                                    <p className="text-white font-bold">Archer Midnight</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">UAM Pathway Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pipelineSteps.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />
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
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Join the Revolution</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto leading-relaxed">
                            Be part of the specialized cohort that will lead the urban skies. Your career in
                            emerging air mobility starts with a verified WingMentor profile.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Apply for Pathway
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
