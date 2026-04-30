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
    const buildAreas = [
        {
            title: "Safety & Competency",
            desc: "Our programs integrate EBT CBTA safety competencies into every module. We review curriculum against the 9 core competency areas—situational awareness, decision making, communication, leadership, workload management, procedures, flight path management, knowledge, and automation management—to ensure pilots develop the skills that matter on the flight deck.",
            bullets: ["Competency Mapping", "Risk Assessment", "Safety Culture"]
        },
        {
            title: "Curriculum Development",
            desc: "We build our Foundation and Transition programs by aligning with EBT CBTA international standards used in aviation training worldwide. Curriculum is reviewed against regulatory frameworks and updated as standards evolve. We identify gaps between pilot preparation and pathway requirements, then build targeted content to close them.",
            bullets: ["Standard Alignment", "Gap Analysis", "Content Review"]
        },
        {
            title: "Pilot Feedback",
            desc: "Pilots using the platform provide direct feedback on program content, pathway accuracy, and usability. We track completion rates, competency score distributions, and support requests to identify what works and what needs improvement. Every program iteration is driven by actual pilot experience, not assumptions.",
            bullets: ["User Feedback", "Completion Tracking", "Iterative Improvement"]
        },
        {
            title: "Technology & Security",
            desc: "The platform is built with pilot data ownership as a priority. Profiles, verification workflows, and pathway matching systems are designed to keep pilots in control of their information. Two-step verification for mentorship hours, secure examination recording, and transparent data practices are core to how we build—not afterthoughts.",
            bullets: ["Data Security", "Verification Systems", "Platform Development"]
        }
    ];

    const processSteps = [
        { title: "Identify Need", value: "Pilots report gaps in pathway data, program content, or platform features. We track support requests and user behavior to find what is missing." },
        { title: "Review & Design", value: "Curriculum is mapped against EBT CBTA standards. Technology changes are scoped for security and usability. Safety considerations are built in from the start." },
        { title: "Build & Test", value: "Programs are piloted with early users. Platform features are tested for data integrity and verification accuracy. Feedback is collected before full release." },
        { title: "Measure & Iterate", value: "Completion rates, competency score trends, and pilot feedback determine what gets improved next. We ship updates based on measurable impact, not assumptions." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Our Process
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            How We Build
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            We build programs and platform features by aligning with industry standards, listening to pilot feedback,
                            and iterating based on measurable outcomes. No committees. No fictional partnerships.
                            Just a team focused on building tools that actually help pilots prove what they can do.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Build Areas Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        What We Focus On
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Build Areas
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {buildAreas.map((item, idx) => (
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
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        How We Work
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Built on Feedback, Not Fiction
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                "We don't build what sounds impressive. We build what pilots actually need, then improve it based on what they tell us."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                Our development process is straightforward: identify real pilot problems, align solutions
                                with EBT CBTA and regulatory standards, build and test with early users, then iterate
                                based on measurable outcomes. No fictional committees. No unverified partnerships.
                                Just a team focused on delivering verified competency tools that pilots can trust.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-300 text-sm font-sans">Pilot Feedback Drives Every Decision</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-300 text-sm font-sans">EBT CBTA Standards, Not Marketing Claims</span>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Pipeline Steps */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Our Process
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        How We Build & Improve
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {processSteps.map((item, idx) => (
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
