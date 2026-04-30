import React from 'react';
import { ArrowLeft } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';

interface PilotGapAboutPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotGapAboutPage: React.FC<PilotGapAboutPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'About', url: '/about' },
                { name: 'What is the Pilot Gap?', url: '/what-is-the-pilot-gap' }
            ]} />
            <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-16 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        The Problem We Solve
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-6">
                        What is the Pilot Gap?
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                        Pilots earn commercial licenses at 250 hours. Airlines require 1,500+ hours for employment. That gap is where careers stall. Training is complete, but the experience airlines demand isn't accessible. Pilots are stuck, operators can't find verified candidates, and the industry loses trained talent.
                    </p>
                </div>
            </div>

            {/* The Career Challenge */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Career Challenge
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Where Pilots Get Stuck
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Pilots complete training with 250 hours and $50,000 invested. They're qualified to fly commercially but lack the multi-crew, high-performance, or operational experience airlines require. No structured pathway exists to bridge that gap. Instructors wait years for advancement. Graduates take non-aviation jobs. The industry trains pilots it can't employ.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* The Financial Impact */}
            <div className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Financial Impact
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Investment Without Return
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    $50,000 in training. 4 years of education. Then a gap with no clear path forward. Pilots accumulate flight hours without structured mentorship or verified competency assessment. Hours alone don't indicate readiness. Airlines can't verify capability from a logbook. The result: trained pilots leave the profession, and operators waste resources on candidates who aren't ready.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* The Solution */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Solution
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Verified Competency, Not Just Hours
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    PilotRecognition bridges the gap with structured programs that turn unverified hours into demonstrated competency. The Foundation Program provides 50 hours of verified mentorship, EBT CBTA-aligned assessment, and a live profile that operators can pull. Pilots don't just log hours—they build verified professional recognition that translates directly to pathway access and operator visibility.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Industry Alignment */}
            <div className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Industry Alignment
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                What Airlines Actually Assess
                            </h2>
                        </RevealOnScroll>
                    </div>
                    <div className="max-w-4xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                <p className="text-base text-slate-700 leading-relaxed">
                                    Airlines assess 9 core competencies: decision making, communication, leadership, situational awareness, workload management, procedures, flight path management, knowledge, and automation management. Our assessment framework measures these same markers. Pilots demonstrate the competencies operators prioritize. Operators see objective behavioral data, not just flight hours. Verified competencies become the basis for pathway matching and hiring decisions.
                                </p>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Start Your Program */}
            <div className="py-16 px-6 bg-blue-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-serif mb-4">
                            Start Your Foundation Program
                        </h2>
                        <p className="max-w-2xl mx-auto text-base text-blue-200 leading-relaxed mb-8">
                            Free to enter. $49 certification at completion. 50 hours of verified mentorship. EBT CBTA-aligned assessment. A live profile that operators pull. That's how you bridge the gap.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl"
                            >
                                Start Free — $49 at Certification
                            </button>
                            <button
                                onClick={() => onNavigate('about')}
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                            >
                                Learn More About Programs
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to About
                </button>
            </div>
        </div>
        </>
    );
};
