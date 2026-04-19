import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface BoardPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const BoardPage: React.FC<BoardPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const boardMembers = [
        {
            name: "Executive Leadership",
            role: "Strategic Direction",
            desc: "The executive board oversees the platform's global expansion and alignment with ICAO standards.",
            bullets: ["Global Expansion", "Regulatory Liaison", "Financial Oversight"]
        },
        {
            name: "Airlines Advisory",
            role: "Flagship Alignment",
            desc: "Active captains and training heads from major carriers ensure our syllabus meets real-world entry standards.",
            bullets: ["Etihad/Emirates Standards", "EBT Integration", "Hiring Analytics"]
        },
        {
            name: "Tech Innovators",
            role: "Digital Ecosystem",
            desc: "Visionaries in AI and data extraction who lead the development of our ATLAS and Pilot Recognition systems.",
            bullets: ["AI Data Extraction", "Blockchain Verification", "Mobile First"]
        },
        {
            name: "Operations Board",
            role: "Program Delivery",
            desc: "Managing the logistics of our Fujairah-based ATPL and global network of partner flight schools.",
            bullets: ["School Audits", "Candidate Vetting", "Resource Allocation"]
        }
    ];

    const pipelineSteps = [
        { title: "Strategic Audit", value: "Annual review of board goals against industry flight shortages and shifts." },
        { title: "Partner Selection", value: "Board-level vetting of flagship carriers and manufacturing partners." },
        { title: "Policy Formation", value: "Creating the governance frameworks for pilot data security and ethics." },
        { title: "Industry Impact", value: "Measuring the success rate of WingMentor members in the global market." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Executive Leadership
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Our Board
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            WingMentor is guided by a diverse board of airline captains, technology pioneers,
                            and regulatory experts committed to solving the global pilot shortage.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Board Features Grid */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {boardMembers.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
                            <div className="flex flex-col mb-4">
                                <span className="text-xs font-bold text-blue-600 uppercase tracking-widest mb-1">{item.role}</span>
                                <h3 className="text-2xl font-serif text-slate-900">{item.name}</h3>
                            </div>
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
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Global Stewardship</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    Leading the Next <br />Era of Aviation
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "Our board doesn't just manage a platform; we manage a promise to the next generation of aviators."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    Through direct consultation with Flagship Carriers and ICAO delegates, our board ensures
                                    that every WingMentor program is legally recognized, ethically sound, and industry-aligned.
                                    We are the voice of the pilot inside the boardroom.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 text-sm font-sans">Strategic 2030 Vision Alignment</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 text-sm font-sans">Industry-Wide Advocacy Network</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-video bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-white/10 flex items-center justify-center p-12">
                                <div className="absolute inset-0 bg-blue-900/20 mix-blend-overlay"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Board Governance Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pipelineSteps.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Back button */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-10 leading-tight">Ready to Return?</h2>
                        <div className="flex justify-center">
                            <button
                                onClick={onBack}
                                className="bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-full font-bold text-lg transition-all font-sans shadow-xl"
                            >
                                Back to Organization
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
