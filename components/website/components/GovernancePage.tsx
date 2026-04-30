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
                            Our governance framework is built on honest representation of what we deliver. We are committed
                            to regulatory compliance, data ethics, and transparency in all our operations and future
                            partnerships.
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
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Regulatory Compliance
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Our curriculum and reporting structures are built to align with <strong>ICAO</strong>, <strong>EASA</strong>, and <strong>GCAA</strong>
                            standards. We document competency in a language that global regulators and airlines understand.
                            Our assessment framework is designed to translate pilot competencies into <strong>regulatory-compliant documentation</strong>
                            that facilitates seamless career progression across international jurisdictions.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            This ensures that your PilotRecognition profile is a recognized asset, whether you are
                            applying to a carrier in the UAE, Europe, or beyond. The <strong>ATS-compatible ATLAS Aviation CV</strong>
                            formatting integrated into our platform ensures your credentials are presented in the standardized
                            format preferred by major airlines and recruitment systems worldwide.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our alignment with <strong>EBT CBTA 9 core competencies</strong> used in aviation training worldwide
                            provides assurance that your documented competencies meet industry-recognized standards.
                            This regulatory alignment extends to our Foundation Program,
                            which serves as the prerequisite for our EBT CBTA-aligned Transition Program.
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
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Data Ethics & Privacy
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                            Data Security
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Your flight records and career data are sensitive assets. We employ industry-standard encryption
                            and strict access controls to ensure your information is only seen by the recruiters you authorize.
                            Our platform ensures your personal information remains protected throughout its lifecycle.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We never sell your data to third parties. Our business model is built on your career
                            success, not on monetizing your personal information. Unlike many job platforms that profit from
                            selling candidate data to recruiters, we maintain a <strong>user-centric revenue model</strong> where
                            our success is directly tied to your professional advancement and career achievements.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Your <strong>PilotRecognition Profile</strong> uses a <strong>two-step verification process</strong>
                            for mentorship hours and verified examination results, giving you confidence in the data
                            that operators see. You control what information is visible on your profile.
                            This puts you in control of your professional data throughout your aviation career journey.
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
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Partner Transparency
                    </h2>
                    <div style={{ maxWidth: '4xl', margin: '0 auto', paddingTop: '1.5rem' }}>
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-4">
                            Transparency
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            We are actively seeking partnerships with airlines and ATOs. When partnerships are established,
                            terms regarding <strong>hiring pathways</strong>, <strong>program structures</strong>, and <strong>data usage</strong> will be
                            published and transparent. Our agreements are designed to eliminate ambiguity and ensure that
                            pilots understand exactly what they're getting when they enroll in a pathway or program.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            This transparency ensures that when we recommend a pathway, it is because it is the
                            best option for your career, not because of a hidden incentive. Unlike recruitment agencies
                            that may prioritize commissions over candidate fit, our recommendations are based on
                            <strong>objective competency matching</strong> between your verified PilotRecognition profile and
                            operator requirements.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Our pathway matching system uses <strong>competency-based filtering</strong> that compares your
                            flight hours, certifications, competencies, and career goals against pathway requirements
                            to identify the most suitable opportunities. We are actively recruiting operator partners
                            to join the platform. When operators post opportunities, pathway details will be publicly
                            visible on Pilot Terminal, creating a transparent resource for aviation career opportunities.
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
