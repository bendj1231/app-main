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
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4 font-sans">
                            HINFACT AIRBUS INTEGRATED APPLICATIONS
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Human Factors Analytics
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Data-Driven Competency Development
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans mt-6">
                            The integration of Hinfact human factors analytics with Airbus and flagship carriers like Etihad marks a shift from subjective instruction to objective, data-driven competency development. By quantifying cognitive performance, this technology provides WingMentor pilots with the same high-level Evidence-Based Training (EBT) tools used at major global training centers.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 1: Key Research & Innovations */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Hinfact Airbus Integration
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Key Research & Innovations
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-12">
                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Airbus Strategic Partnership</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Airbus has signed a major agreement with Hinfact to offer a complete CBTA/EBT (Competency-Based Training and Assessment / Evidence-Based Training) solution. This partnership integrates Airbus-specific data and configuration directly into the Hinfact software, which is now implemented in flagship Airbus Training Centers worldwide.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Cognitive & Biometric Analytics</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            The core innovation is the use of eye-tracking technology and flight data to analyze non-technical behaviors. This detects "hidden" issues, such as a pilot losing vital instrument scan patterns during high-stress situations—a factor in nearly 48% of aviation incidents.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Etihad Cadet Program Synergy</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            The technology is designed to meet the exacting standards of the Etihad Cadet Pilot Programme, which utilizes the latest aircraft models and technologies to prepare the next generation of pilots for modern aviation.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Predictive Safety KPIs</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Hinfact acts as a "Certified Human Sensor," identifying signs of fatigue, stress, and attention levels in real-time. This allows instructors to move beyond standard grading toward facilitated debriefing focused on a pilot's specific cognitive workload capacity.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 2: Why WingMentor Pilots Need Hinfact Intelligence */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        WingMentor Advantage
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Why WingMentor Pilots Need Hinfact Intelligence
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto space-y-12">
                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Objective Benchmarking</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Bridge the gap between "how you felt" during a sim session and objective visual path data.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Customized Training Paths</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Automatically identify individual weaknesses to create personalized training modules that ensure regulatory compliance with IATA and ICAO standards.
                        </p>
                    </RevealOnScroll>
                </div>

                <div className="text-left">
                    <RevealOnScroll>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 font-serif">Command Readiness</h3>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Prepare for command upgrades by mastering non-technical competencies—teamwork, communication, and decision-making—quantified through biometric evidence.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Section 3: Member Access & Verification */}
            <div style={{ width: '100vw', marginLeft: 'calc(-50vw + 50%)', paddingLeft: '1.5rem', paddingRight: '1.5rem', marginTop: '2rem', marginBottom: '4rem', textAlign: 'center' }}>
                <RevealOnScroll>
                    <p style={{ margin: 0, fontSize: '0.9rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#2563eb', fontWeight: 600 }}>
                        Member Access
                    </p>
                    <h2 style={{ margin: '0.5rem 0 0', fontSize: '2.5rem', fontWeight: 'normal', fontFamily: 'Georgia, serif' }}>
                        Member Access & Verification
                    </h2>
                </RevealOnScroll>
            </div>

            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            Verified members of Pilot Recognition gain exclusive access to full Hinfact EBT analytics and training material designed by global leaders in pilot education.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Member Access CTA */}
            <div className="py-24 px-6 bg-slate-50 border-y border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                            Full access to Hinfact integration data, EBT analytics, and Airbus specific training modules is reserved for verified members.
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
                                Login to Access
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Sample Report CTA */}
            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-base md:text-lg text-slate-700 leading-relaxed font-sans italic">
                            Would you like to see a sample Pilot Performance Report showing how eye-tracking data is visualized for a missed approach scenario?
                        </p>
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
