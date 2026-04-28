import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../../RevealOnScroll';

interface ATLASCVPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ATLASCVPage: React.FC<ATLASCVPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            Professional Aviation Standardization
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            The ATLAS Aviation CV
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Global Recognition | ATS Optimization | Competency-Based
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            The globally recognized, AI-optimized format that presents your experience, competencies, and qualifications in the standardized structure preferred by international airlines. Through guidance from <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Main Content Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Competitive Advantage
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Why the ATLAS Format Sets You Apart
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-24">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            The ATLAS format bridges the gap between pilot application and airline expectation. It is recognized by recruitment agencies and aviation organizations worldwide as the professional standard for presenting pilot credentials. Through advisory input from <strong>Airbus Head of Training</strong>, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>

                        <div className="space-y-6 text-left max-w-2xl mx-auto">
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Global Recognition</h4>
                                    <p className="text-sm text-slate-600">Accepted by major carriers and preferred by international recruiters.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">ATS Optimization</h4>
                                    <p className="text-sm text-slate-600">Keywords and structure designed to pass automated AI screening filters.</p>
                                </div>
                            </div>
                            <div className="flex gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                </div>
                                <div>
                                    <h4 className="font-bold text-slate-900 mb-1">Competency-Based</h4>
                                    <p className="text-sm text-slate-600">Aligns with EBT/CBTA frameworks, highlighting capability beyond hours.</p>
                                </div>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>

                {/* Row 2: CV Components */}
                <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                    <RevealOnScroll>
                        <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                            CV Components
                        </p>
                        <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                            Comprehensive Documentation
                        </h2>
                    </RevealOnScroll>
                </div>

                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                            The ATLAS format is comprehensive yet concise, presenting all critical information in a standardized structure that airlines expect and understand. Through our partnership with <strong>Airbus Head of Training</strong>, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>

                        <div className="grid grid-cols-1 gap-3 max-w-2xl mx-auto">
                            {[
                                { title: "Personal Information", desc: "Professional details, licenses, ratings, medical status" },
                                { title: "Flight Experience", desc: "Total hours, PIC, multi-engine, type-specific breakdown" },
                                { title: "Competencies & Skills", desc: "EBT/CBTA competencies, languages, technical skills" },
                                { title: "Education & History", desc: "Academic qualifications, employment history, achievements" }
                            ].map((item, idx) => (
                                <div key={idx} className="flex items-start gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 hover:border-blue-100 transition-colors">
                                    <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center shrink-0 shadow-sm text-blue-600 font-bold text-sm">
                                        {idx + 1}
                                    </div>
                                    <div className="text-left">
                                        <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                        <p className="text-xs text-slate-500">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </RevealOnScroll>
                </div>

            </div>

            {/* Member Access Gateway */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Member Access
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Unlock the Full ATLAS Standard
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                            Detailed documentation standards, builder access, and full competency breakdowns are reserved for verified members. Through guidance from <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="px-8 py-4 bg-[#050A30] hover:bg-[#070D3D] text-white font-bold rounded-xl transition-colors shadow-lg uppercase tracking-wider text-xs"
                            >
                                Become a Member
                            </button>
                            <button
                                onClick={onLogin}
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-colors border border-slate-200 uppercase tracking-wider text-xs"
                            >
                                Login to Read More
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Footer CTA - Clean & Simple */}
            <div className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                        Ready to Professionalize Your Profile?
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
                        Stop using generic CVs that get filtered out. Switch to the industry standard.
                    </p>
                </div>
            </div>
        </div>
    );
};
