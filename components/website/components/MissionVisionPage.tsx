import React from 'react';
import { ArrowLeft, Target, Eye, Heart, Shield, Users, Globe } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface MissionVisionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const MissionVisionPage: React.FC<MissionVisionPageProps> = ({
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
                            Our Purpose & Direction
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Mission & Vision
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                            We are not just building a platform; we are constructing the bridge that spans the
                            most critical gap in modern aviation. Our commitment is to the pilot, the industry,
                            and the future of flight safety.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Target className="w-8 h-8 text-blue-600" />
                            </div>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Our Mission
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                Bridging the Competency Gap
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                To provide every aspiring pilot with the mentorship, tools, and industry pathways needed
                                to transition from a licensed aviator to an airline-ready professional.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We exist to eliminate the "low-timer" bottleneck by verifying competency, standardizing reports,
                                and connecting talent directly with the operators who need them.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <img
                                    src="https://images.unsplash.com/photo-1542296332-2e44a99cfef0?auto=format&fit=crop&q=80&w=1600"
                                    alt="Pilot Mentorship"
                                    className="w-full rounded-[2.5rem] shadow-2xl object-cover aspect-[4/3]"
                                />
                                <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden md:block">
                                    <p className="text-3xl font-bold text-blue-600 font-serif">100%</p>
                                    <p className="text-xs uppercase tracking-widest text-slate-500">Commitment</p>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Vision Section */}
            <div className="py-20 px-6 max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <RevealOnScroll>
                            <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center mb-6 mx-auto md:mx-0">
                                <Eye className="w-8 h-8 text-purple-600" />
                            </div>
                            <p className="text-xs font-bold text-purple-700 uppercase tracking-[0.3em] mb-2">
                                Our Vision
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                                A Unified Global Standard
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                To become the global authority in pilot verification and career progression, creating
                                an ecosystem where merit, data, and preparation replace uncertainty in the hiring process.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We visualize a future where the seamless integration of our ATLAS system and Foundational Program
                                becomes the industry benchmark for pilot recruitment worldwide.
                            </p>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <div className="relative w-full max-w-md mx-auto">
                                <img
                                    src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&q=80&w=1600"
                                    alt="Global Aviation Vision"
                                    className="w-full rounded-[2.5rem] shadow-2xl object-cover aspect-[4/3]"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The DNA of WingMentor
                            </p>
                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900">
                                Our Core Values
                            </h2>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            {
                                title: "Connection",
                                desc: "We believe in the power of the network. Every pilot is one introduction away from their dream career, and we facilitate that link.",
                                icon: Users,
                                color: "text-blue-600",
                                bg: "bg-blue-50"
                            },
                            {
                                title: "Attitude",
                                desc: "Professionalism isn't just a behavior; it's a mindset. We cultivate the resilience and discipline required for the flight deck.",
                                icon: Heart,
                                color: "text-red-600",
                                bg: "bg-red-50"
                            },
                            {
                                title: "Respect",
                                desc: "For the uniform, for the standards, and for each other. We foster a community built on mutual support and ethical leadership.",
                                icon: Shield,
                                color: "text-emerald-600",
                                bg: "bg-emerald-50"
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all h-full">
                                    <div className={`w-14 h-14 ${item.bg} rounded-2xl flex items-center justify-center mb-6`}>
                                        <item.icon className={`w-7 h-7 ${item.color}`} />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
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
