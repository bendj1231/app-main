import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface CoreValuesPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const CoreValuesPage: React.FC<CoreValuesPageProps> = ({
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
                            What We Expect From Every Pilot
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-4">
                            Core Values
                        </h1>
                        <span className="text-3xl md:text-4xl mt-1 leading-none block mb-6" style={{ color: '#DAA520', fontFamily: 'Georgia, serif' }}>
                            Connection | Attitude | Respect
                        </span>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            These aren't slogans. They're behavioral markers we verify through assessment and expect in every interaction.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Value 1: Connection */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Deliverable
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Connection
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Pilots connect with mentors who've been where they're going. 50 hours of verified mentorship is mandatory in the Foundational Program. Mentees receive verified logbook entries. Mentors build leadership credentials. Both get documented proof of the exchange.
                                </p>
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Through Pilot Terminal, operators post pathways with competency requirements. Pilots see match indicators against their verified profile. Connections lead to actual opportunities, not social interactions. Your network becomes your pathway access.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Value 2: Attitude */}
            <div className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Behavioral Marker
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Attitude
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100 space-y-4">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Skills can be developed, but attitude is chosen. Our EBT CBTA assessment framework measures behavioral markers: decision making, communication, leadership, workload management, and situational awareness. These are scored, not subjective. Operators see objective behavioral data alongside technical hours.
                                </p>
                                <p className="text-base text-slate-700 leading-relaxed">
                                    The 9 core competencies in our Foundational Program specifically assess attitude markers. Pilots who demonstrate humility, resilience, and ownership of mistakes score higher. These scores determine pathway access and matching priority. Attitude isn't a feeling—it's a measurable competency that affects your recognition score.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Value 3: Respect */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Verified Standard
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Respect
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200 space-y-4">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Every pilot in our network has verified credentials, documented hours, and assessed competencies. No self-reported claims. No unverified resumes. We enforce professional standards through verified documentation before any pilot appears in pathway matching or operator searches.
                                </p>
                                <p className="text-base text-slate-700 leading-relaxed">
                                    CRM competency assessments measure respectful communication, active listening, and constructive contribution to crew decisions. These are scored behavioral markers, not subjective impressions. The pathway matching system treats all pilots objectively based on verified competencies and recognition scores. Fair access to opportunities based on demonstrated capability—not background, connections, or unverified claims.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
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
