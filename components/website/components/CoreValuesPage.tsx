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
            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
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
            </div>

            {/* Value 2: Attitude */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
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
            </div>

            {/* Value 3: Respect */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
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
