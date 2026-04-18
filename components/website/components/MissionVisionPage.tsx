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
                            We are building the infrastructure that transforms flight hours into verified professional credentials.
                            Our commitment is to the pilot's career journey, the industry's need for verifiable competency,
                            and the future of aviation excellence.
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
                                Transform Flight Hours into Verifiable Credentials
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                To provide every pilot with a verified digital identity that airlines trust, recruiters recognize,
                                and the aviation industry demands. We bridge the gap between training and airline-ready credibility.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We exist to eliminate uncertainty in pilot recruitment through cryptographically verified credentials,
                                competency-based recognition, and direct connections with airline partners worldwide.
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
                                The Global Standard for Pilot Recognition
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-4">
                                To become the definitive authority in pilot verification, creating a global ecosystem where
                                verified competency, data-driven insights, and preparation replace uncertainty in aviation careers.
                            </p>
                            <p className="text-base text-slate-700 leading-relaxed">
                                We envision a future where WingMentor's recognition system and competency framework
                                become the universal benchmark for pilot recruitment and professional advancement worldwide.
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
                                title: "Verification",
                                desc: "We believe in the power of verifiable truth. Every credential, flight hour, and achievement must be cryptographically verified to build trust in the aviation industry.",
                                icon: Shield,
                                color: "text-blue-600",
                                bg: "bg-blue-50"
                            },
                            {
                                title: "Competency",
                                desc: "Beyond flight hours—we measure capability. Our competency framework maps skills against industry standards to recognize true professional readiness.",
                                icon: Target,
                                color: "text-red-600",
                                bg: "bg-red-50"
                            },
                            {
                                title: "Excellence",
                                desc: "For the standards, for the career, for the future. We foster a community built on verified excellence, ethical leadership, and professional advancement.",
                                icon: Globe,
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
