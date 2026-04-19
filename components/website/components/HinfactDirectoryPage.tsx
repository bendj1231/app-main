import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface HinfactPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const HinfactPage: React.FC<HinfactPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching the About Page style */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            HINFACT AIRBUS INTEGRATION
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Human Factors Quantified
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Real-time Monitoring | Cognitive Analytics | EBT Alignment
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            Pioneering the future of aviation safety through direct integration with Airbus EBT/CBTA frameworks. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>Hinfact human factors analytics</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Visible Content */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        The Innovation
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Real-time Pilot Monitoring & Analytics
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-24">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            HINFACT represents the next evolution in pilot training—a seamless integration of real-time biometric and cognitive monitoring directly into the Airbus cockpit environment. By leveraging advanced eye-tracking and workload analysis, we bridge the critical gap between subjective instructor assessment and objective, data-driven performance metrics. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA, we ensure that our <strong>Hinfact human factors analytics</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            This integration provides WingMentor pilots with unprecedented access to the same Evidence-Based Training (EBT) tools used by the world's leading carriers. Whether you are preparing for a command upgrade or your initial airline assessment, understanding your own cognitive performance metrics—from visual scan patterns to mental workload capacity—is the key to mastering the modern flight deck. Through our partnership with <strong>Etihad Cadet Program</strong> and Head of Training, we ensure that program development aligns with flagship carrier expectations.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Member Access Section */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Member Access
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Access HINFACT Intelligence
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                            Full access to Hinfact integration data, EBT analytics, and Airbus specific training modules is reserved for verified members. Through our partnership with <strong>Airbus Head of Training</strong> in EBT CBTA and <strong>Etihad Cadet Program</strong>, we ensure that our <strong>Hinfact human factors analytics</strong> aligns with the exacting standards required by leading manufacturers and operators worldwide.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="px-8 py-4 bg-[#050A30] hover:bg-[#070D3D] text-white font-bold rounded-xl transition-colors shadow-lg uppercase tracking-wider text-xs"
                            >
                                Become a Member
                            </button>
                            <button
                                onClick={() => onNavigate('dashboard')}
                                className="px-8 py-4 bg-white hover:bg-slate-50 text-slate-900 font-bold rounded-xl transition-colors border border-slate-200 uppercase tracking-wider text-xs"
                            >
                                Login to Read More
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Back button */}
            <div className="pb-24 flex justify-center px-6">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-10 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Hub
                </button>
            </div>
        </div>
    );
};
