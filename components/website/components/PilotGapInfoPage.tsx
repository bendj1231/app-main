import React from 'react';
import { ArrowLeft, Mail, Users, Shield, Plane, BookOpen, GraduationCap } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';

interface PilotGapInfoPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotGapInfoPage: React.FC<PilotGapInfoPageProps> = ({
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
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Understanding the Industry
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        What is the Pilot Gap?
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        The "Pilot Gap" refers to the treacherous period in an aviator's career between obtaining initial commercial licenses (around 250 hours) and achieving the experience levels required for major airline employment (often 1500+ hours).
                    </p>
                </div>
            </div>

            {/* Readable Hook Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Section 1: The Challenge */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            The Career Choke Point
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Where 85% of Pilots Exit the Profession
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            After investing significant time and capital into flight training, many pilots find themselves in a "no-man's land." They are too experienced for basic training but lack the specific multi-crew, high-performance, or operational hours that airlines demand.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="/images/pilot-gap.png"
                                alt="The Pilot Gap Challenge"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: The WingMentor Solution */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Our Strategic Bridge
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Verifying Experience, Building Readiness
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            WingMentor doesn't just acknowledge the gap; we bridge it. By providing access to professional-grade applications, structured mentorship, and a verified database, we turn "empty hours" into "verifiable operational experience."
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu"
                                alt="WingMentor Strategic Bridge"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Gated Content Container */}
            <div className="relative">
                {/* Content Sections (Blurred) */}
                <div className="blur-[12px] opacity-20 pointer-events-none select-none transition-all duration-700">
                    <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                        {/* Section 3: Professional Excellence (Extra content for blurring) */}
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                            <div className="md:w-1/2 text-center md:text-left">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                    Industry Standard Training
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                    Mastering High-Performance Operations
                                </h2>
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    We provide the framework for pilots to achieve the specific multi-crew, high-performance operational hours that major airlines demand...
                                </p>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative w-full max-w-md mx-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2940&auto=format&fit=crop"
                                        alt="High Performance Operations"
                                        className="w-full rounded-3xl shadow-lg object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA / Final Word */}
                    <div className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-slate-100 mt-16 pb-32">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Take the Next Step
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                            Don't Just Fly Hours. Build a Career.
                        </h2>
                    </div>
                </div>

                {/* The Information Gate Card */}
                <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pb-20 bg-gradient-to-t from-white via-white/80 to-transparent pt-40">
                    <div className="w-full max-w-4xl px-6">
                        <RevealOnScroll delay={100}>
                            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                                <img
                                    src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                                    alt="WingMentor Logo"
                                    className="w-40 h-auto object-contain mb-6"
                                />

                                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                    Newsletter & Hub Access
                                </p>

                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                    Unlock Full Industry <br /> Intelligence
                                </h2>

                                <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                                    Subscribe to our newsletter to unlock the full "Pilot Gap" analysis and gain access to strategic career intelligence.
                                </p>

                                <div className="flex flex-col items-center w-full max-w-xs">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-4 animate-pulse">It's free</span>
                                    <button
                                        onClick={() => onNavigate('dashboard')}
                                        className="w-full bg-[#050A30] hover:bg-[#070D3D] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                                    >
                                        Join the Pilot Network
                                    </button>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            <div className="flex justify-center pb-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
