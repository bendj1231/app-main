import React from 'react';
import { Zap, Briefcase, Navigation, Cpu, Layers, ChevronRight } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { AirlineExpectationsCarousel } from '../AirlineExpectationsCarousel';
import { BreadcrumbSchema } from '../seo/BreadcrumbSchema';

interface PathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PathwaysPage: React.FC<PathwaysPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
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

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Pathways', url: '/discover-pathways' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section with Hero Image */}
            <div className="relative pt-32 pb-20 px-6">
                {/* Background Image */}
                <div className="absolute inset-0 z-0">
                    <img
                        src="/images/pathways-image.png"
                        alt="Pathways"
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/60" />
                </div>
                
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-400 mb-6 font-sans">
                            Pathways
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-white leading-tight mb-8">
                            Aviation Pathways
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-white/80 leading-relaxed font-sans">
                            Airline, charter, cargo, and emerging aviation sector opportunities.
                            Explore specialized career pathways across the aviation industry.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Airline Expectations 3D Carousel */}
            <AirlineExpectationsCarousel onNavigate={onNavigate} onLogin={onLogin} />

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
        </>
    );
};
