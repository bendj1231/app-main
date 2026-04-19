import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface GovernancePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const GovernancePage: React.FC<GovernancePageProps> = ({
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
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Integrity & Compliance
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Governance
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Compliance | Ethics | Transparency
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            Our governance framework is the backbone of trust within the WingMentor ecosystem.
                            We are committed to regulatory compliance, data ethics, and absolute transparency
                            in all our partnerships.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 1: Regulatory Compliance */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Universal Standards
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '4rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Regulatory Compliance
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Our curriculum and reporting structures are built to align with ICAO, EASA, and GCAA
                            standards. We don't just "teach" flying; we document competency in a language that
                            global regulators and airlines understand.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This ensures that your WingMentor profile is a recognized asset, whether you are
                            applying to a carrier in the UAE, Europe, or beyond.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Section 2: Data Ethics */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Privacy First
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '4rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Data Ethics & Privacy
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                            Data Security
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Your flight records and career data are sensitive assets. We employ bank-grade
                            encryption and strict access controls to ensure your information is only seen by
                            the recruiters you authorize.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            We never sell your data to third parties. Our business model is built on your career
                            success, not on monetizing your personal information.
                        </p>
                    </div>
                </RevealOnScroll>
            </div>

            {/* Section 3: Partner Transparency */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Clear Agreements
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '4rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Partner Transparency
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-4">
                            Transparency
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We maintain clear, published agreements with all our airline and ATO partners. Key
                            terms regarding hiring pathways, discount structures, and data usage are open for
                            review.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            This transparency ensures that when we recommend a pathway, it is because it is the
                            best option for your career, not because of a hidden incentive.
                        </p>
                    </div>
                </RevealOnScroll>
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
