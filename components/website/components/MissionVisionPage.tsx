import React from 'react';
import { ArrowLeft } from 'lucide-react';
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
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="PilotRecognition Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Our Purpose & Direction
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Mission & Vision
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                            As the aviation industry's first <strong>PilotRecognition-based platform</strong>, operated by WM Pilot Group,
                            we bridge the <strong>Pilot Gap in Recognition, Experience, and Pilot Risk Management</strong> through
                            recognition-based profiling and accredited experience programs aligned with <strong>EBT CBTA AIRBUS 9 core competencies</strong>.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Mission Section */}
            <div className="py-12 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                            Our Mission
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            Bridge the Pilot Gap Through Recognition
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            To address the aviation industry's most significant challenge—professional <strong>Recognition</strong>.
                            Pilots invest <strong>$50,000 USD</strong> in training and <strong>4 years</strong> in education,
                            yet face outdated job platforms and informal searches. We provide a verified PilotRecognition platform
                            that demonstrates actual professional capabilities through <strong>EBT CBTA aligned assessments</strong>
                            and <strong>50 hours of verifiable mentorship</strong>.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Through advisory relationships with <strong>AIRBUS</strong>, <strong>Etihad</strong>, <strong>Archer</strong>,
                            and industry leaders, we deliver accredited experience programs that align with global aviation standards,
                            ensuring pilots gain the recognition they deserve and operators find candidates they can trust.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Vision Section */}
            <div className="py-20 px-6 max-w-4xl mx-auto">
                <div className="text-center">
                    <RevealOnScroll>
                        <p className="text-xs font-bold text-purple-700 uppercase tracking-[0.3em] mb-2">
                            Our Vision
                        </p>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">
                            The Global Standard for Pilot Recognition
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            To become the definitive authority in pilot verification, creating a global ecosystem where
                            <strong>ATS-compatible ATLAS Aviation CV formatting</strong>, <strong>blockchain verifiable certifications</strong>,
                            and <strong>AI-powered pathway matching</strong> replace uncertainty in aviation careers.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            We envision a future where PilotRecognition's recognition system, powered by <strong>50+ AI agents</strong>
                            providing real-time industry intelligence, becomes the universal benchmark for pilot recruitment.
                            Our <strong>Pilot Terminal</strong> social network and <strong>PilotRecogAI</strong> will connect
                            <strong>5000+ pilots</strong> directly with operators, manufacturers, and training providers worldwide.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* What We Do Section */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Comprehensive Ecosystem
                            </p>
                            <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-4">
                                How We Transform Aviation Careers
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                From foundational training to career pathways, we provide the complete infrastructure for professional pilot development
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                        {[
                            {
                                title: "Foundational Program",
                                desc: "EBT CBTA aligned training addressing the Pilot Gap through 5 modules, W1000 application access, examinations, and 50 hours of verifiable mentorship"
                            },
                            {
                                title: "PilotRecognition Profile",
                                desc: "Recognition-based flight logbooks where every hour contributes to your score, with live tracking and intelligent pathway matching based on verified competencies"
                            },
                            {
                                title: "Pathway Matching",
                                desc: "AI-powered career guidance connecting pilots to cadet programs, type ratings, business aviation, eVTOL, and specialized operations with predictive analytics"
                            },
                            {
                                title: "Pilot Terminal",
                                desc: "Professional network platform with 50+ AI agents providing real-time industry intelligence, job discovery, and direct connections with operators worldwide"
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-8 rounded-3xl border border-slate-100 hover:shadow-xl transition-all h-full">
                                    <h3 className="text-lg font-bold text-slate-900 mb-3">{item.title}</h3>
                                    <p className="text-slate-600 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Core Values Section */}
            <div className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The DNA of PilotRecognition
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
                                desc: "We believe in the power of verifiable truth. Every credential, flight hour, and achievement is cryptographically verified through blockchain technology to build trust in the aviation industry."
                            },
                            {
                                title: "Competency-Based",
                                desc: "Beyond flight hours—we measure capability. Our EBT CBTA aligned framework maps skills against AIRBUS 9 core competencies to recognize true professional readiness and behavioral competence."
                            },
                            {
                                title: "Industry Aligned",
                                desc: "EBT CBTA guidance from Airbus Head of Training and Etihad Cadet Program consultation ensures our programs align with the highest international standards. We foster a community built on verified excellence and ethical leadership."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-slate-50 p-10 rounded-3xl border border-slate-100 hover:shadow-xl transition-all h-full">
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

            {/* Industry Partners Section */}
            <div className="py-20 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.3em] mb-2">
                                Strategic Alliances
                            </p>
                            <h2 className="text-3xl md:text-5xl font-serif mb-4">
                                Industry-Aligned Standards
                            </h2>
                            <p className="text-slate-300 max-w-2xl mx-auto">
                                Our programs are developed in collaboration with global aviation leaders to ensure alignment with the highest industry standards
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        {[
                            "AIRBUS",
                            "Etihad",
                            "Archer",
                            "MLG",
                            "Cebu Pacific",
                            "WCC Pilot Academy",
                            "CAE Philippines",
                            "Envoy Air"
                        ].map((partner, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-slate-800 p-6 rounded-2xl hover:bg-slate-700 transition-all">
                                    <p className="font-bold text-lg">{partner}</p>
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
