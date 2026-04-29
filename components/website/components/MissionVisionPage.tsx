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
                            Pilots invest $50,000 and 4 years in training. The industry lacks a standardized way to recognize professional capabilities beyond flight hours and type ratings. This creates a gap between training investment and career opportunity. PilotRecognition provides the recognition framework the industry lacks.
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
                            Pilots invest <strong>$50,000 USD</strong> and <strong>4 years</strong> in training. The industry has no way to recognize professional capabilities beyond flight hours and type ratings. This is the recognition gap. We provide a verified platform that demonstrates actual professional capabilities through <strong>EBT CBTA aligned assessments</strong> and <strong>50 hours of verifiable mentorship</strong>.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            Built through advisory relationships with <strong>AIRBUS</strong>, <strong>Etihad</strong>, <strong>Archer</strong>, and industry leaders. Our programs align with global aviation standards. Pilots gain the recognition they deserve. Operators find candidates they can trust.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Four-Floor Tower Narrative */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Problem We Solve
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                The Clogged Pipeline
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                The aviation career pipeline is broken at every level
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {[
                            {
                                floor: "0",
                                title: "Graduates",
                                desc: "200 hours, promised airline jobs that never materialize. Line to instructor positions backed up 2-3 years. Batch of 2015 still waiting. $50,000 investment sits unused."
                            },
                            {
                                floor: "1",
                                title: "Flight Instructors",
                                desc: "5,000-6,000 hours, 15 years experience. Stuck because nobody's leaving Floor 2. Want recognition for what they've built. Some try to jump ahead, realize requirements differ, get sent back."
                            },
                            {
                                floor: "2",
                                title: "The Recognition Gap",
                                desc: "This is the collapse point. Everyone fighting for recognition, pathways, expectations. Industry lacks communication. Pilots don't know what's required. They fly blind. This is where we provide the framework."
                            },
                            {
                                floor: "3",
                                title: "Airline Pilots",
                                desc: "12+ years, bored, want change but trapped by seniority sacrifice. Captain goes back to First Officer. Recognition score becomes portable—capabilities travel, not airline seniority."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className={`w-12 h-12 ${item.floor === '2' ? 'bg-orange-100 text-orange-700' : item.floor === '3' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'} rounded-full flex items-center justify-center font-bold text-xl`}>
                                            {item.floor}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900">{item.title}</h3>
                                    </div>
                                    <p className="text-slate-700 leading-relaxed text-sm">
                                        {item.desc}
                                    </p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-lg font-medium">
                            Module 1 teaches you the industry reality. Your examination creates your baseline recognition score. Mentorship builds recognized experience. Every hour logged contributes to your recognition profile. Pathway matching connects you to opportunities.
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
                                title: "Pathway Cards",
                                desc: "Not job listings—pathway cards showing requirements and what you're missing. Pulling system: pilots submit interest, airlines pull from database with live real-time profiles, not static CVs"
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

            {/* Context Banner */}
            <div className="py-8 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-lg font-medium">
                            Your recognition score is your currency. Pathways are where you spend it. We bridge the gap between training investment and career opportunity.
                        </p>
                    </RevealOnScroll>
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
