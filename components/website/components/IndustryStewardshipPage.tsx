import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface IndustryStewardshipPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const IndustryStewardshipPage: React.FC<IndustryStewardshipPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Our Commitment
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Building Tools for Pilots
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            We build competency-based tools and programs aligned with EBT CBTA standards.
                            Our goal is to give pilots verified data about their own capabilities, transparent
                            pathway requirements, and a platform that speaks in facts—not promises.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 1: Safety Standards */}
            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Raising Standards
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            EBT & Safety Alignment
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Our programs align with Evidence-Based Training (EBT) and Competency-Based
                            Training & Assessment (CBTA), the international standards that airlines worldwide
                            are adopting. We did not create the standard—we adopted it because it measures
                            what actually matters on the flight deck.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            By integrating these methodologies into our Foundation Program, we help low-time
                            pilots develop resilience and decision-making skills that the industry already
                            recognizes as essential.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 2: Pilot Advocacy */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-indigo-700 uppercase tracking-[0.3em] mb-2">
                            Transparency
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            Pilot Advocacy
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            In a profit-driven industry, accurate information is the pilot's best defense.
                            We build transparent pathway data and verification systems that give pilots
                            real facts about requirements, competency gaps, and what it takes to qualify.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            No false promises. No inflated requirements. Just verified competency assessment,
                            verified mentorship hours, and pathway cards that show you exactly what you are
                            missing—not what someone wants you to believe.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 3: 2030 Vision */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2">
                            Future Ready
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            Adapting With the Industry
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Aviation is changing. From sustainable fuels to evolving flight deck technology
                            and urban air mobility, the competencies pilots need will shift. Our curriculum
                            updates as the industry changes—not before it, not after it.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            We monitor regulatory shifts, operator requirements, and emerging pathways
                            through community-submitted updates and operator partnerships. When the industry
                            changes, our competency framework and pathway data change with it.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center bg-white">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Overview
                </button>
            </div>
        </div>
    );
};
