import React from 'react';
import { Shield, Target, GraduationCap, Plane, Cpu, Briefcase, Award, FileText, LayoutGrid, ChevronRight, Globe, Layers, Navigation, Zap } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface ProgramsPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ProgramsPathwaysPage: React.FC<ProgramsPathwaysPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const corePrograms = [
        {
            title: "Foundational Program",
            desc: "The literal foundation of our pilot organization. Bridging the gap from 'I have a license' to 'I am a professional'.",
            target: "foundational-program",
            icon: GraduationCap,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Transition Program",
            desc: "Designed for instructors and low-timers seeking to transition into multi-crew and jet environments.",
            target: "transition-program",
            icon: Target,
            color: "text-red-600",
            bg: "bg-red-50"
        },
        {
            title: "Emirates ATPL Pathway",
            desc: "A specialized track for pilots seeking an Emirates‑standard ATPL and GCAA licensing standards.",
            target: "emirates-atpl",
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    const pathways = [
        {
            title: "Air Taxi & eVTOL",
            desc: "Preparing pilots for the emerging eVTOL and Urban Air Mobility (UAM) sectors.",
            target: "emerging-air-taxi",
            icon: Zap,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Private Charter",
            desc: "Direct links to private jet operators and specialized business aviation training.",
            target: "private-charter-pathways",
            icon: Briefcase,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Seaplane & Float Ops",
            desc: "Specialized training for island transfers and amphibious flight deck handling.",
            target: "about_programs",
            icon: Navigation,
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            title: "Unmanned Systems",
            desc: "Focusing on large-scale BVLOS operations and heavy-lift unmanned logistics.",
            target: "piloted-drones",
            icon: Cpu,
            color: "text-slate-600",
            bg: "bg-slate-50"
        },
        {
            title: "Cargo Transportation",
            desc: "Supply chain resilience and heavy logistics for the global feeder network.",
            target: "about_programs",
            icon: Layers,
            color: "text-zinc-600",
            bg: "bg-zinc-50"
        }
    ];

    const systems = [
        {
            title: "Pilot Recognition",
            desc: "The industry's first Competency Assurance Network. Your skills, verified and recognized.",
            target: "pilot-recognition",
            icon: Award,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "ATLAS CV Systems",
            desc: "Modernizing pilot profiles to meet manufacturer and recruiter data-driven standards.",
            target: "atlas-cv",
            icon: FileText,
            color: "text-sky-600",
            bg: "bg-sky-50"
        },
        {
            title: "EBT & CBTA Programs",
            desc: "Evidence-Based Training familiarization using integrated Airbus and Hinfact analytics.",
            target: "ebt-cbta",
            icon: LayoutGrid,
            color: "text-rose-600",
            bg: "bg-rose-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Directory
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Programs & Pathways
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            A comprehensive ecosystem designed to bridge the pilot gap. Explore our core foundational training,
                            specialized career pathways, and industry-leading recognition systems.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Programs Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl font-serif text-slate-900 mb-4 px-2">Core Programs</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {corePrograms.map((prog, idx) => (
                        <ProgramCard key={idx} {...prog} onClick={() => onNavigate(prog.target)} />
                    ))}
                </div>
            </div>

            {/* Pathways Section */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <h2 className="text-3xl font-serif text-white mb-4">Aviation Pathways</h2>
                        <div className="w-20 h-1 bg-blue-500"></div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                        {pathways.map((prog, idx) => (
                            <div
                                key={idx}
                                onClick={() => onNavigate(prog.target)}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                                    <prog.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-sans">{prog.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">{prog.desc}</p>
                                <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-widest gap-2 font-sans">
                                    Explore Pathway <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Systems Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <h2 className="text-3xl font-serif text-slate-900 mb-4 px-2">Ecosystem Systems</h2>
                    <div className="w-20 h-1 bg-blue-600 mx-2"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {systems.map((prog, idx) => (
                        <ProgramCard key={idx} {...prog} onClick={() => onNavigate(prog.target)} />
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Ready to Start Your Journey?</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">Join our global network of verified pilots and gain access to the industry's most specialized mentorship and tools.</p>
                    <button
                        onClick={() => onNavigate('become-member')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                    >
                        Apply for Enrollment
                    </button>
                </div>
            </div>
        </div>
    );
};

const ProgramCard = ({ title, desc, icon: Icon, color, bg, onClick }: any) => (
    <div
        onClick={onClick}
        className="group bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer"
    >
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 ${color} group-hover:rotate-6 transition-all`}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans">{desc}</p>
        <div className={`flex items-center ${color} text-sm font-bold uppercase tracking-widest gap-2 font-sans`}>
            Learn More <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);
