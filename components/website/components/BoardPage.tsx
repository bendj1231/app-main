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
            desc: "The executive team oversees platform development, program alignment with EBT CBTA international standards, and long-term roadmap planning. We review curriculum against industry competency frameworks and ensure our verification systems maintain integrity. We are actively seeking advisory input from airline training professionals to strengthen program alignment.",
            bullets: ["Program Governance", "Curriculum Oversight", "Financial Oversight"]
        },
        {
            name: "Industry Advisory",
            role: "Program Alignment",
            desc: "We seek input from active captains, training captains, and aviation professionals to ensure our programs reflect real-world competency requirements. Our assessment framework is aligned with EBT CBTA standards used in aviation training worldwide—not tied to any single carrier. We welcome feedback from training professionals to refine syllabus development.",
            bullets: ["EBT CBTA Standards", "Competency Framework", "Industry Feedback"]
        },
        {
            name: "Technology & Operations",
            role: "Platform Development",
            desc: "The tech team builds and maintains the PilotRecognition platform, including profile systems, pathway matching, verification workflows, and ATLAS Aviation CV formatting. We prioritize data security, two-step verification for mentorship hours, and systems that give pilots control over their own data.",
            bullets: ["Platform Development", "Data Security", "Verification Systems"]
        },
        {
            name: "Program Delivery",
            role: "Operations",
            desc: "The operations team manages program logistics, mentor verification, examination administration, and pilot support. Every mentorship hour is verified through our two-step confirmation process. Every examination result is recorded and auditable. We treat all pilots objectively based on verified competencies and recognition scores.",
            bullets: ["Mentor Verification", "Examination Integrity", "Pilot Support"]
        }
    ];

    const pipelineSteps = [
        { title: "Program Review", value: "Annual review of curriculum against EBT CBTA standards and industry competency requirements." },
        { title: "Advisory Input", value: "Seeking feedback from aviation training professionals and active pilots on program relevance and gaps." },
        { title: "Policy Formation", value: "Creating governance frameworks for pilot data security, verification integrity, and ethical standards." },
        { title: "Impact Tracking", value: "Tracking program completion rates, competency score distributions, and pilot pathway engagement." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Our Organization
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Leadership & Governance
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            PilotRecognition is built by a team of aviation professionals, educators, and technology
                            specialists committed to transparent competency assessment. Our governance focuses on
                            program integrity, data security, and honest representation of what we deliver.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Board Features Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Team Structure
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        How We Operate
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
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

            {/* Stewardship Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Our Commitment
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Governance Principles
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                "We don't claim authority we haven't earned. We build tools, verify data, and let pilots prove what they can do."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                Our governance is straightforward: honest representation of what we deliver, transparent
                                pricing with no hidden fees, verified data that pilots own and control, and continuous
                                improvement based on pilot feedback and industry standards—not fictional partnerships
                                or inflated claims.
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-300 text-sm font-sans">Honest Program Claims</span>
                                </div>
                                <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                    <span className="text-slate-300 text-sm font-sans">Pilot Data Ownership</span>
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
                        Governance Process
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        How We Review & Improve
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
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
