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
            desc: "The executive board oversees the platform's global expansion and alignment with ICAO standards. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that strategic direction aligns with the exacting standards required by leading manufacturers worldwide. Our <strong>AI-powered pathway matching</strong> system provides data-driven insights for global expansion decisions.",
            bullets: ["Global Expansion", "Regulatory Liaison", "Financial Oversight"]
        },
        {
            name: "Airlines Advisory",
            role: "Flagship Alignment",
            desc: "Active captains and training heads from major carriers ensure our programs meet real-world entry standards. Through guidance from <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that syllabus development aligns with flagship carrier expectations. Our <strong>EBT CBTA-aligned assessment framework</strong> provides objective evaluation of pilot readiness for airline recruitment.",
            bullets: ["Etihad/Emirates Standards", "EBT Integration", "Hiring Analytics"]
        },
        {
            name: "Tech Innovators",
            role: "Digital Ecosystem",
            desc: "Visionaries in AI and data extraction who lead the development of our <strong>ATLAS AI</strong> and Pilot Recognition systems. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that technology development aligns with industry standards for competency assessment. Our <strong>blockchain-verifiable certifications</strong> and <strong>ATS-compatible ATLAS Aviation CV formatting</strong> provide pilots with cutting-edge tools for career advancement.",
            bullets: ["AI Data Extraction", "Blockchain Verification", "Mobile First"]
        },
        {
            name: "Operations Board",
            role: "Program Delivery",
            desc: "Managing the logistics of our Fujairah-based programs and global network of partner flight schools. We foster a culture of respect where every voice is heard, from the cadet to the captain. Our <strong>pathway matching system</strong> treats all pilots objectively based on verified competencies and recognition scores, ensuring fair and equitable access to career opportunities based on demonstrated professional capability rather than connections.",
            bullets: ["School Audits", "Candidate Vetting", "Resource Allocation"]
        }
    ];

    const pipelineSteps = [
        { title: "Strategic Audit", value: "Annual review of board goals against industry flight shortages and shifts." },
        { title: "Partner Selection", value: "Board-level vetting of flagship carriers and manufacturing partners." },
        { title: "Policy Formation", value: "Creating the governance frameworks for pilot data security and ethics." },
        { title: "Industry Impact", value: "Measuring the success rate of PilotRecognition members in the global market." }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Executive Leadership
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Our Board
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Strategic Direction | Industry Alignment | Global Expansion
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            PilotRecognition is guided by a diverse board of airline captains, technology pioneers,
                            and regulatory experts committed to solving the global pilot shortage. Through guidance from <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our board governance aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Board Features Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Board Structure
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Leadership Excellence
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

            {/* Cinematic Section (Dark) */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#60A5FA', fontWeight: 600 }}>
                        Global Stewardship
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        Leading the Next Era of Aviation
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div>
                        <RevealOnScroll>
                            <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                "Our board doesn't just manage a platform; we manage a promise to the next generation of aviators."
                            </p>
                            <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                Through direct consultation with Flagship Carriers and ICAO delegates, our board ensures
                                that every PilotRecognition program is legally recognized, ethically sound, and industry-aligned.
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
                </div>
            </div>

            {/* Pipeline Steps */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Governance Process
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Board Governance Pipeline
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
