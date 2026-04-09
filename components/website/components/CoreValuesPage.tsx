import React from 'react';
import { ArrowLeft, Users, Heart, Shield, Share2, Award, Handshake } from 'lucide-react';
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
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            The WingMentor DNA
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Core Values
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            Our values are not just words on a wall; they are the behavioral markers we expect
                            from every pilot in our network. Connection, Attitude, and Respect define who we are
                            and how we fly.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Value 1: Connection */}
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Share2 className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Power of Network
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Connection
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                Aviation is a small world, but it can feel vast and lonely when you are starting out.
                                We believe that meaningful connection is the antidote to career stagnation.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                By connecting low-timers with captains, and captains with operators, we create a
                                circular economy of mentorship where wisdom is passed down and opportunity is passed up.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-blue-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?auto=format&fit=crop&q=80&w=1600"
                                        alt="Connection"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Value 2: Attitude */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-red-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Award className="w-8 h-8 text-red-600" />
                            </div>
                            <p className="text-xs font-bold text-red-700 uppercase tracking-[0.3em] mb-2">
                                The Professional Mindset
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Attitude
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                Skills can be taught, but attitude is chosen. We champion the pilots who show up early,
                                prepare thoroughly, and own their mistakes.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                A WingMentor pilot doesn't just fly the plane; they manage the operation with
                                humility, resilience, and an unshakeable commitment to safety standards.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1517999818671-50e50882e5b8?auto=format&fit=crop&q=80&w=1600"
                                        alt="Professional Attitude"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Value 3: Respect */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Handshake className="w-8 h-8 text-emerald-600" />
                            </div>
                            <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2">
                                Mutual & Self Respect
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Respect
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                Respect for the uniform, respect for the regulations, and respect for our peers.
                                In a multi-crew environment, respect is the foundation of effective communication.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We foster a culture where every voice is heard, from the cadet to the captain,
                                creating a safer and more inclusive cockpit for everyone.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <div className="aspect-[4/3] rounded-[2.5rem] overflow-hidden shadow-2xl relative">
                                    <div className="absolute inset-0 bg-emerald-600/10 mix-blend-multiply"></div>
                                    <img
                                        src="https://images.unsplash.com/photo-1559523161-0cff43f25377?auto=format&fit=crop&q=80&w=1600"
                                        alt="Respect"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
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
