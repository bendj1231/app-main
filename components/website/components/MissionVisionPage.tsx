import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface MissionVisionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const MissionVisionPage: React.FC<MissionVisionPageProps> = ({
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
                            Our Purpose & Direction
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Mission & Vision
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                            We provide verified competency assessment through EBT CBTA aligned programs. Pilots demonstrate capabilities through 50 hours of mentorship and behavioral assessment. When operators join the platform, they can pull verified profiles based on competency scores, not just hours. Recognition improves your matching priority with operators. We are actively recruiting operator partners.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Our Mission
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            Bridge the Pilot Gap Through Recognition
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We deliver verified competency assessment through <strong>EBT CBTA aligned programs</strong>
                            and 50 hours of evidence-based mentorship. Pilots demonstrate actual capabilities—not just credentials.
                            Recognition becomes portable professional value that travels across operators and career paths.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our programs are aligned with EBT CBTA international standards used by airlines worldwide.
                            Pilots get verified recognition based on demonstrated competencies.
                            When operators join, they can pull verified candidate profiles they can trust.
                            The industry gets a framework focused on competency over credentials alone.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Strategic Pillars */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Our Strategic Approach
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Four Pillars of Recognition
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                How we transform training investment into career opportunity
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                title: "Recognition as Currency",
                                desc: "The aviation industry lacks a standardized way to measure professional capability. Hours and type ratings indicate technical qualification, not readiness. We're changing that. Recognition improves your matching priority with operators. Pathways are available to all users."
                            },
                            {
                                title: "Competency-Based Assessment",
                                desc: "We measure what matters: the 9 EBT CBTA core competencies that airlines actually assess. Not just flight hours—situational awareness, decision making, communication, leadership, workload management, procedures, flight path management, knowledge, automation management."
                            },
                            {
                                title: "Verified Experience",
                                desc: "50 hours of mentorship. EBT CBTA video assessment. ATLAS Aviation CV formatting. Every credential verified. Every achievement documented. When operators join, they can trust what they see because it's verified. Recognition becomes portable professional value."
                            },
                            {
                                title: "Real-Time Intelligence",
                                desc: "Our platform tracks industry changes through community-submitted updates and operator-reported requirements. Pilots access current pathway data. When operators join, they can pull from verified profiles. The system stays current as the community and operator network grows."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                                            <span className="font-bold text-xl">0{idx + 1}</span>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-lg font-medium">
                            Your recognition score improves your matching priority with operators. Pathways are available to all users. We bridge the gap between training investment and career opportunity.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Vision Section */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-[0.3em] mb-2">
                            Our Vision
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            The Global Standard for Pilot Recognition
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We aim to become the global standard for pilot recognition by 2027. <strong>ATS-compatible ATLAS Aviation CV formatting</strong>,
                            verified competency certifications, and intelligent pathway matching replace uncertainty in aviation careers.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our platform tracks requirements as operators publish changes and our community reports updates.
                            <strong>Pilot Terminal</strong> connects pilots with industry resources and training providers.
                            Intelligent pathway matching based on verified competencies helps pilots find the right opportunities.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* What We Do Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Comprehensive Ecosystem
                            </p>
                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                                How We Transform Aviation Careers
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                From foundational training to career pathways, we provide the complete infrastructure for professional pilot development
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Foundational Program",
                                desc: "EBT CBTA aligned training addressing the Pilot Gap through 5 modules, W1000 application access, examinations, and 50 hours of verifiable mentorship"
                            },
                            {
                                title: "PilotRecognition Profile",
                                desc: "Recognition-based flight logbooks where every hour contributes to your score, with verified tracking and intelligent pathway matching based on competencies"
                            },
                            {
                                title: "Pathway Cards",
                                desc: "Not job listings—pathway cards showing requirements and what you're missing. Pilots submit interest; when operators join, they can pull from verified profiles, not static CVs"
                            },
                            {
                                title: "Pilot Terminal",
                                desc: "Professional network platform providing industry intelligence, job discovery, and direct connections with operators worldwide. We are actively building the operator network."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all h-full">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-lg font-medium">
                            Your recognition score improves your matching priority with operators. Pathways are available to all users. We bridge the gap between training investment and career opportunity.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The DNA of PilotRecognition
                            </p>
                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900">
                                Our Core Values
                            </h2>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Verification",
                                desc: "We believe in the power of verifiable truth. Every credential, flight hour, and achievement is verified through our two-step confirmation process to build trust in the aviation industry."
                            },
                            {
                                title: "Competency-Based",
                                desc: "Beyond flight hours—we measure capability. Our EBT CBTA aligned framework maps skills against the 9 core competencies used in aviation training worldwide to recognize true professional readiness and behavioral competence."
                            },
                            {
                                title: "Industry Aligned",
                                desc: "Our programs are aligned with EBT CBTA international standards used by airlines worldwide. We foster a community built on verified excellence and ethical leadership."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all h-full">
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
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
