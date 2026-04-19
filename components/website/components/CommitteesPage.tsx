import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface CommitteesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const CommitteesPage: React.FC<CommitteesPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const committeeGroups = [
        {
            title: "Safety Board",
            desc: "Expert-led reviews of operational safety protocols and the integration of Hinfact human factors analytics.",
            bullets: ["Incident Analysis", "Human Factors", "Safety Culture"]
        },
        {
            title: "Curriculum Review",
            desc: "Ensuring our training pathways, from ATPL to Transition, match the latest GCAA and EASA syllabus updates.",
            bullets: ["Syllabus Mapping", "EBT Integration", "Partner Feedback"]
        },
        {
            title: "Pilot Advocacy",
            desc: "Serving as the voice for experienced and new pilots, ensuring the industry hears their needs and challenges.",
            bullets: ["Career Support", "Mental Health", "Industry Feedback"]
        },
        {
            title: "Technology Committe",
            desc: "Focusing on the advancement of the W1000 suite, ATLAS AI, and our Pilot Recognition scoring algorithms.",
            bullets: ["AI Development", "Data Security", "UI/UX Stewardship"]
        }
    ];

    const pipelineSteps = [
        { title: "Member Selection", value: "Identifying top industry experts to lead each specialized committee." },
        { title: "Monthly Review", value: "Regular board-level meetings to review committee findings and impact." },
        { title: "Strategy Updates", value: "Translating committee insights into platform and program improvements." },
        { title: "Industry Reporting", value: "Publishing anonymized findings to improve global aviation standards." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Specialized Expertise
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Committees
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Our committees bring together the industry's brightest minds to ensure safety,
                            curriculum excellence, and genuine pilot advocacy across the WingMentor ecosystem.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Committee Features Grid */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {committeeGroups.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
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
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Expert Driven</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    The Collective Voice <br />of Excellence
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "Innovation without safety is a hazard. Advocacy without expertise is a whisper. We combine them all."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    Our committees operate independently to provide unbiased oversight of WingMentor
                                    operations. This ensures that our technology remains safe, our curriculum
                                    competitive, and our advocacy genuinely helpful to the global pilot community.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 text-sm font-sans">10+ Tier-1 Airline Captain Consultants</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <span className="text-slate-300 text-sm font-sans">Direct Liaison with Airbus Human Factors Dept.</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative p-12 flex items-center justify-center bg-[#050A30]">
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <div className="text-center">
                                        <p className="text-white font-bold text-5xl mb-2 font-serif tracking-tighter">Verified</p>
                                        <p className="text-blue-400 text-xs font-bold tracking-[0.4em] uppercase">Specialist Insight</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Committee Impact Pipeline</h2>
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

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-10 leading-tight">Back to Organization</h2>
                        <div className="flex justify-center">
                            <button
                                onClick={onBack}
                                className="bg-slate-900 border border-slate-900 hover:bg-slate-800 text-white px-12 py-5 rounded-full font-bold text-lg transition-all font-sans shadow-xl"
                            >
                                Organization Overview
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
