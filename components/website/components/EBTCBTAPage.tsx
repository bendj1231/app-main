import React from 'react';
import { ArrowLeft, GraduationCap, Brain, Users, Target, Award, CheckCircle2, Lightbulb, TrendingUp, Plane, Zap, Globe, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface EBTCBTAPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const EBTCBTAPage: React.FC<EBTCBTAPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const coreElements = [
        {
            title: "Evidence-Based Training",
            desc: "Evaluation based on real-world data and operational risks rather than repetitive mechanical maneuvers. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our programs align with the exacting standards required by leading manufacturers worldwide. Our <strong>data-driven approach</strong> focuses on identifying and mitigating operational risks through targeted program interventions.",
            bullets: ["Data-Driven Programs", "Risk Mitigation", "Operational Context"]
        },
        {
            title: "CBTA Framework",
            desc: "Assessment of 9 core competencies including decision-making, situational awareness, and workload management. Our <strong>EBT CBTA-aligned assessment framework</strong> specifically evaluates cognitive and behavioral markers that modern airlines demand. The <strong>AIRBUS 9 core competencies</strong> framework provides a comprehensive structure for evaluating pilot readiness across technical and non-technical domains.",
            bullets: ["Competency Based", "Holistic Grading", "Behavioral Markers"]
        },
        {
            title: "Airbus Integration",
            desc: "Direct alignment with the program methodologies used by the Head of EBT/CBTA at Airbus. Our partnership ensures that pilots who complete our programs are prepared for the exacting standards of A320/A350 operations and manufacturer-specific procedures. This alignment provides a competitive advantage for pilots seeking careers with Airbus operators worldwide.",
            bullets: ["A320/A350 SOPs", "Manufacturer Standards", "Global Best Practice"]
        },
        {
            title: "Etihad Standards",
            desc: "Insights into the competency expectations of one of the world's premier cadet programs. Through our strategic partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we provide direct access to flagship carrier expectations and program standards. This collaboration ensures our pilots are prepared for the exacting requirements of major carriers, with pathway matching that aligns verified competencies with cadet program opportunities.",
            bullets: ["Carrier Specific", "High Performance", "Recruitment Edge"]
        }
    ];

    const competencies = [
        { title: "Application of Procedures", value: "Following SOPs and checklists precisely and in a timely manner.", icon: CheckCircle2 },
        { title: "Communication", value: "Providing and receiving clear, concise information in a multi-crew setting.", icon: Zap },
        { title: "Flight Path Mgmt", value: "Mastery of automation and manual handling across all flight phases.", icon: Target },
        { title: "Situational Awareness", value: "Developing a complete mental picture of the aircraft and environment.", icon: Globe }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Modern Pilot Training Standards
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            EBT/CBTA Preparation
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Evidence-Based Training | Competency-Based Assessment
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            The new standard for airline pilot evaluation. We provide the bridge from pattern flying
                            to the competency-based performance required by flagship carriers. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our programs align with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Elements Grid */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Program Framework
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Core Elements
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {coreElements.map((item, idx) => (
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
                        Mental Transition
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif', color: 'white' }}>
                        From Cessnas to Airlines: The Shift
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <RevealOnScroll>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "The challenge isn't the aircraft systems—it's the mental shift into a multicrew, multicompetency environment."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    Traditional flight training focused on stick-and-rudder maneuvers. Modern airlines assess
                                    how you manage the flight deck. Through our collaboration with <strong>Airbus Head of Training</strong> and <strong>Etihad Cadet Program</strong>,
                                    we prepare you for the mindset shift required for airline success.
                                </p>
                                <div className="p-8 bg-white/5 border border-white/10 rounded-3xl">
                                    <h4 className="text-white font-bold mb-4">
                                        Insight Advantage
                                    </h4>
                                    <p className="text-sm text-slate-400 leading-relaxed font-sans">
                                        Know what the Head of Cadet Training at Etihad actually evaluates during a sim check—before you ever apply.
                                    </p>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>
            </div>

            {/* Core Competencies Pipeline */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Assessment Framework
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Foundational Competency Pipeline
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {competencies.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative overflow-hidden">
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
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Build Airline-Level Competency</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans leading-relaxed">
                            Don't wait until your airline assessment. Start developing the EBT/CBTA mindset
                            today and position yourself as a high-potential professional pilot.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Return to Insight
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
