import React from 'react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface DigitalLogbookDirectoryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const DigitalLogbookDirectoryPage: React.FC<DigitalLogbookDirectoryPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
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
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            Career Intelligence
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Digital Logbook
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Verified Experience | Career Timeline | ATS-Ready Data
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            Your centralized digital career vault. A comprehensive logbook and competency tracker that verifies your experience for industry recruiters. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> transforms raw hours into data-driven competency markers that align with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Main Content Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Career Intelligence
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        The Black Box
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-24">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            Your digital career vault. A centralized logbook and competency tracker that verifies your experience for industry recruiters. The Black Box transforms raw hours into data-driven competency markers through automated analysis and industry-standard formatting. Through alignment with Airbus EBT CBTA standards, we ensure that our <strong>recruiter-ready data</strong> aligns with manufacturer standards for pilot assessment.
                        </p>

                        <div className="flex flex-col gap-4 max-w-2xl mx-auto">
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Recruiter-Ready Data</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">Verified operational history formatted for airline HR and AI scanners.</p>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Digital Compliance</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">Automated status tracking for medicals, LPCs, and certifications.</p>
                            </div>
                            <div className="p-5 bg-slate-50 border border-slate-100 rounded-2xl">
                                <h4 className="font-bold text-slate-900 text-sm mb-1 uppercase tracking-widest">Career Timeline</h4>
                                <p className="text-slate-500 text-xs leading-relaxed">Complete visual history of your aviation journey with competency mapping.</p>
                            </div>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Regulatory Compliance Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Global Standards
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Multi-Regulatory Support
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                            The Digital Logbook supports multiple regulatory frameworks including ANAC (Brazil), CASA (Australia), FAA (United States), QCAA (Qatar), and EASA standards. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that program development aligns with flagship carrier expectations across all regulatory jurisdictions.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {[
                                "ANAC (Brazil)",
                                "CASA (Australia)",
                                "FAA (United States)",
                                "QCAA (Qatar)",
                                "EASA Standards",
                                "Custom Formats"
                            ].map((regulation, i) => (
                                <div key={i} className="p-4 bg-slate-50 border border-slate-100 rounded-xl">
                                    <p className="text-sm font-bold text-slate-700">{regulation}</p>
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
                        Access Your Digital Logbook
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                            Full access to the Digital Logbook, including advanced analytics and recruiter-ready data export, is reserved for verified members. Through alignment with Airbus EBT CBTA standards, we ensure that our <strong>ATS-compatible ATLAS Aviation CV formatting</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
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
                                Login to Access Logbook
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 bg-slate-50 border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center px-6">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">Ready to Track Your Career?</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto">
                            Join PilotRecognition to access comprehensive digital logbook tracking and showcase your verified experience to airlines worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
