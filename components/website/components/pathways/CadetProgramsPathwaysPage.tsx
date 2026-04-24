import React from 'react';
import { ArrowLeft, GraduationCap, Award, TrendingUp, Building2, CheckCircle2, Plane, BookOpen } from 'lucide-react';
import { TopNavbar } from '../TopNavbar';

interface CadetProgramsPathwaysPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const CadetProgramsPathwaysPage: React.FC<CadetProgramsPathwaysPageProps> = ({ onBack, onNavigate, onLogin }) => {

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-10 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-emerald-700 mb-4">
                        Career Pathways
                    </p>
                    <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Cadet Programs
                    </h1>
                    <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700">
                        Structured training pathways from zero to airline-ready. WingMentor connects aspiring pilots with world-class cadet programs offered by leading airlines and training organizations worldwide.
                    </p>
                </div>
            </div>

            {/* Main Content Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-16">

                {/* Section 1: What are Cadet Programs */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2">
                            The Foundation
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            Your Pathway to the Flight Deck
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cadet programs provide a structured pathway from ab initio training to airline employment. These comprehensive programs combine ground school, flight training, and airline-specific preparation to produce well-rounded, employment-ready pilots.
                        </p>
                        <p className="text-base text-slate-700 leading-relaxed">
                            WingMentor partners with leading airlines and training academies to offer our members access to premier cadet programs. We guide you through the selection process, help you prepare for assessments, and ensure you're positioned for success in these competitive programs.
                        </p>
                    </div>
                    <div className="md:w-1/2">
                        <div className="relative w-full mx-auto">
                            <div className="aspect-video bg-slate-100 rounded-3xl overflow-hidden shadow-lg relative group">
                                <img
                                    src="https://res.cloudinary.com/dridtecu6/image/upload/v1776690048/pathways/cadet-programs.jpg"
                                    alt="Cadet Training"
                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                            </div>
                            <p className="text-xs text-slate-500 mt-3 text-center italic">
                                Professional flight training environment
                            </p>
                        </div>
                    </div>
                </div>

                {/* Section 2: Program Partners */}
                <div className="bg-slate-50 rounded-3xl p-8 md:p-12 border border-slate-100">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2 text-center">
                        Our Partners
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-8 text-center">
                        World-Class Training Organizations
                    </h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Major Airlines */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
                                <Plane className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Major Airlines</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Flag carriers and major airlines operate comprehensive cadet programs that provide direct pathway to employment upon successful completion.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Zero to ATPL integrated training</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Guaranteed interviews upon completion</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Airline-specific type ratings</span>
                                </div>
                            </div>
                        </div>

                        {/* Flight Academies */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center mb-4">
                                <BookOpen className="w-6 h-6 text-purple-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Flight Academies</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Premium training academies offer world-class facilities and instruction with strong airline placement networks.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Modern training fleets and simulators</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Experienced instructor cadre</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Global airline partnerships</span>
                                </div>
                            </div>
                        </div>

                        {/* Regional Carriers */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                            <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center mb-4">
                                <Building2 className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Regional Carriers</h3>
                            <p className="text-sm text-slate-600 leading-relaxed mb-4">
                                Regional airlines provide excellent entry points with cadet programs designed for rapid career progression to major carriers.
                            </p>
                            <div className="space-y-2">
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Fast-track to command opportunities</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Competitive sponsorship packages</span>
                                </div>
                                <div className="flex items-start gap-2">
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                                    <span className="text-xs text-slate-700">Clear advancement pathways</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 3: What They Look For */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2 text-center md:text-left">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                            Selection Criteria
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4">
                            What Cadet Programs Seek
                        </h2>
                        <p className="text-base text-slate-700 leading-relaxed mb-4">
                            Cadet programs are competitive and selective. Through our partnerships and experience, we've identified the key attributes successful cadet candidates demonstrate during selection.
                        </p>
                        <ul className="mt-2 space-y-2 text-base text-slate-700 list-disc list-inside md:list-outside md:pl-5 text-left">
                            <li><strong>Academic Excellence:</strong> Strong educational background and aptitude for technical subjects</li>
                            <li><strong>Dedication:</strong> Commitment to intensive training schedules and self-directed study</li>
                            <li><strong>Team Skills:</strong> Demonstrated ability to work effectively in team environments</li>
                            <li><strong>Communication:</strong> Clear verbal and written communication abilities</li>
                            <li><strong>Situational Awareness:</strong> Natural aptitude for multi-tasking and decision-making</li>
                        </ul>
                    </div>
                    <div className="md:w-1/2">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <GraduationCap className="w-10 h-10 text-emerald-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Academic</h3>
                                <p className="text-xs text-slate-500 mt-2">Strong foundation in math and science.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center">
                                <Award className="w-10 h-10 text-blue-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Dedication</h3>
                                <p className="text-xs text-slate-500 mt-2">Commitment to training excellence.</p>
                            </div>
                            <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 flex flex-col items-center text-center col-span-2">
                                <TrendingUp className="w-10 h-10 text-purple-600 mb-3" />
                                <h3 className="font-bold text-slate-900">Growth Mindset</h3>
                                <p className="text-xs text-slate-500 mt-2">Continuous improvement and adaptability.</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Section 4: WingMentor Foundation Program Access */}
                <div className="bg-gradient-to-br from-emerald-900 to-slate-900 rounded-3xl p-8 md:p-12 text-white">
                    <div className="max-w-4xl mx-auto">
                        <p className="text-xs font-bold text-emerald-300 uppercase tracking-[0.3em] mb-2 text-center">
                            Start Here
                        </p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">
                            Your Pathway Through WingMentor
                        </h2>
                        <p className="text-base md:text-lg text-slate-200 leading-relaxed mb-8 text-center">
                            The <strong>WingMentor Foundation Program</strong> provides the ideal preparation for cadet program selection. We build the core competencies, knowledge, and confidence that cadet programs seek in successful candidates.
                        </p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">What You Get</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Comprehensive assessment preparation for cadet programs</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Ground school foundation aligned with industry standards</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Interview skills and psychometric test preparation</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Direct introductions to partner training organizations</span>
                                    </li>
                                </ul>
                            </div>

                            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                                <h3 className="text-lg font-bold mb-3">Program Benefits</h3>
                                <ul className="space-y-2 text-sm text-slate-200">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Early access to cadet program application windows</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Mentorship from cadet program graduates</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Application guidance and support throughout selection</span>
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-400 mt-0.5 flex-shrink-0" />
                                        <span>Networking with training organization representatives</span>
                                    </li>
                                </ul>
                            </div>
                        </div>

                        <div className="text-center">
                            <button
                                onClick={() => onNavigate('foundational-program')}
                                className="inline-flex items-center gap-2 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 transition-colors shadow-xl group"
                            >
                                Learn About the Foundation Program
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>
                    </div>
                </div>

                {/* Section 5: Timeline & Next Steps */}
                <div className="text-center max-w-4xl mx-auto">
                    <p className="text-xs font-bold text-emerald-700 uppercase tracking-[0.3em] mb-2">
                        Getting Started
                    </p>
                    <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-6">
                        Your Journey to the Flight Deck
                    </h2>
                    <p className="text-base text-slate-700 leading-relaxed mb-8">
                        Cadet programs offer the most direct pathway to airline employment. WingMentor's Foundation Program prepares you for selection success and positions you for the best opportunities available.
                    </p>

                    <div className="bg-emerald-50 rounded-2xl p-8 border border-emerald-100">
                        <h3 className="text-lg font-bold text-slate-900 mb-4">Ready to Begin Your Journey?</h3>
                        <p className="text-base text-slate-700 leading-relaxed mb-6">
                            Join the WingMentor Foundation Program today and gain access to premier cadet program opportunities. Our network of partner airlines and training academies means you'll be positioned for success from day one.
                        </p>
                        <button
                            onClick={() => onNavigate('contact-support')}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-500 transition-colors shadow-lg"
                        >
                            Contact Us to Get Started
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
};
