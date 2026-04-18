import React from 'react';
import { ArrowLeft, Award, Shield, CheckCircle2, Zap, Search, UserCheck, Lock } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface PilotRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotRecognitionPage: React.FC<PilotRecognitionPageProps> = ({
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
                        src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Professional Identity
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Pilot Recognition
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        The biggest problem in the aviation industry is recognition. A pilot spends $50,000 USD on training and 4 grueling years of a university degree, only to end up looking at job application sites that haven't been updated since 2007, or desperately job hunting on Facebook, which crosses the line of professionalism. This is the hard truth, and it's why PilotRecognition.com was established. After direct talks with AIRBUS, Etihad, and Archer, there is no denying the facts: what about pilots who just graduated and are unable to find a job after earning a degree due to the 1500-hour barrier? What about flight instructors who barely managed to reach those hours and are still stuck in the same flight school for more than 10 years? What about airline pilots flying international long-haul flights who are looking for a career change but are time-constrained? You have come to the right place. Welcome to the future of aviation, where communication between the industry and the pilot profession bridges the gap.
                    </p>
                </div>
            </div>

            {/* Readable Content */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">
                {/* Section 1: Unified Aviation Identity */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Single Source of Truth
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Unified Aviation Identity
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Your complete aviation journey in one verified digital profile. WingMentor consolidates flight hours, certifications, mentorship, and career milestones into a single source of truth that travels with you throughout your professional life.
                        </p>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Single Profile</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Career Timeline</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Cross-Platform</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1556388158-158ea5ccacbd?q=80&w=2940&auto=format&fit=crop"
                                alt="Unified Aviation Identity"
                                className="w-full rounded-3xl shadow-lg object-cover"
                            />
                        </div>
                    </div>
                </div>

                {/* Section 2: Verified Professional Standing */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Cryptographic Proof
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Verified Professional Standing
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Every credential, flight hour, and achievement is cryptographically verified. Our blockchain-backed verification system creates an unbreakable chain of custody that airlines and regulatory bodies trust implicitly.
                        </p>
                        <div className="flex flex-col gap-2 mt-4">
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Cryptographic Proof</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Real-Time Verification</span>
                            </div>
                            <div className="flex items-center gap-2">
                                <CheckCircle2 className="w-5 h-5 text-blue-600" />
                                <span className="text-sm font-bold uppercase tracking-wider text-slate-600">Industry Trust</span>
                            </div>
                        </div>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full max-w-md mx-auto">
                            <img
                                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=2940&auto=format&fit=crop"
                                alt="Verified Professional Standing"
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
                        {/* Section 3: AI-Native Career Intelligence */}
                        <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                            <div className="md:w-1/2 text-center md:text-left">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                    AI Integration
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                    AI-Native Career Intelligence
                                </h2>
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    Your profile is optimized for modern airline recruitment AI systems. We translate your experience into structured data that automated screening systems recognize, prioritize, and rank at the top of candidate pools.
                                </p>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative w-full max-w-md mx-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=2940&auto=format&fit=crop"
                                        alt="AI-Native Career Intelligence"
                                        className="w-full rounded-3xl shadow-lg object-cover"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Section 4: Competency-Based Recognition */}
                        <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                            <div className="md:w-1/2 text-center md:text-left">
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                    Skill Analytics
                                </p>
                                <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                                    Competency-Based Recognition
                                </h2>
                                <p className="text-base text-slate-700 leading-relaxed mb-4">
                                    Beyond flight hours—we measure capability. Our competency framework maps your skills against industry standards like CBTA, highlighting strengths that matter to airlines: decision-making, leadership, technical expertise, and adaptability.
                                </p>
                            </div>
                            <div className="md:w-1/2">
                                <div className="relative w-full max-w-md mx-auto">
                                    <img
                                        src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2940&auto=format&fit=crop"
                                        alt="Competency-Based Recognition"
                                        className="w-full rounded-3xl shadow-lg object-cover"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* CTA / Final Word */}
                    <div className="py-16 px-6 max-w-4xl mx-auto text-center border-t border-slate-100 mt-16 pb-32">
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Build Your Verified Identity
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                            Don't Just Log Hours. Build a Career.
                        </h2>
                    </div>
                </div>

                {/* The Information Gate Card */}
                <div className="absolute inset-x-0 bottom-0 z-30 flex flex-col items-center pb-20 bg-gradient-to-t from-white via-white/80 to-transparent pt-40">
                    <div className="w-full max-w-4xl px-6">
                        <RevealOnScroll delay={100}>
                            <div className="relative bg-white border border-slate-200 rounded-3xl p-8 md:p-16 flex flex-col items-center text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)]">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                    alt="WingMentor Logo"
                                    className="w-40 h-auto object-contain mb-6"
                                />

                                <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-2">
                                    Pilot Recognition System
                                </p>

                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                    Unlock Your Verified <br /> Aviation Identity
                                </h2>

                                <p className="text-slate-600 text-base max-w-md mb-8 leading-relaxed">
                                    Join the Pilot Recognition system to access comprehensive profile verification, career matching, and industry recognition.
                                </p>

                                <div className="flex flex-col items-center w-full max-w-xs">
                                    <span className="text-[9px] font-bold uppercase tracking-[0.4em] text-blue-600 mb-4 animate-pulse">It's free</span>
                                    <button
                                        onClick={() => onNavigate('become-member')}
                                        className="w-full bg-[#050A30] hover:bg-[#070D3D] text-white py-4 rounded-xl font-bold uppercase tracking-widest transition-all shadow-lg hover:shadow-blue-900/30 hover:scale-[1.02] active:scale-95 border border-white/10"
                                    >
                                        Get Recognized
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
