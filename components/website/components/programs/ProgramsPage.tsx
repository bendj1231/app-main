import React from 'react';
import { GraduationCap, Target, Globe, ChevronRight } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface ProgramsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ProgramsPage: React.FC<ProgramsPageProps> = ({
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

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section with Hero Image */}
            <div className="relative pt-32 pb-20 px-6">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g"
                        alt="Programs"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-400 mb-6 font-sans">
                            Programs
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-white leading-tight mb-8">
                            Foundation Program
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed font-sans">
                            Structured training pathways from flight school to airline-ready professional.
                            Explore our core foundational training and specialized career tracks.
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
