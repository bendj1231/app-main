import React from 'react';
import { TopNavbar } from './TopNavbar';
import { ArrowLeft, GraduationCap, Plane, BadgeCheck, Globe, TrendingUp, Award } from 'lucide-react';

interface WhyRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

export const WhyRecognitionPage: React.FC<WhyRecognitionPageProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Digital Professional Identity
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                        Why Every Pilot Needs a Recognition Profile
                    </h1>
                    <span className="text-xl md:text-2xl text-slate-500 leading-none block mb-8">
                        Your Reputation and Logbook—Digitized and Validated
                    </span>

                    <div className="max-w-3xl mx-auto text-base text-slate-700 leading-relaxed text-left space-y-6">
                        <p>
                            In aviation, your reputation and your logbook are everything. Pilot Recognition digitizes and validates both. This isn't a job board—it's the <strong>global infrastructure for your professional recognition</strong>. If you aren't recognized, vetted, and scored, you aren't just behind. You're off the radar.
                        </p>

                        {/* For Students */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                For Students: The Unfair Advantage
                            </h3>
                            <p className="text-red-600 font-semibold mb-4">
                                Don't graduate into a vacuum.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">The Gap Is Real</p>
                                    <p className="text-slate-600">
                                        The distance between flight school and a flight deck is huge. Our <strong>$50 Industry Experience Programs</strong> are the only way to put "Professional Alignment" on your resume before you even have your commercial license.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">The Cost of Invisibility</p>
                                    <p className="text-slate-600">
                                        If you aren't on the registry, you're <strong>invisible to the airlines currently scouting the next generation of cadets</strong>. While others wait, you'll already be vetted, tracked, and recognized.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* For Hobbyists */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <Plane className="w-4 h-4" />
                                For Hobbyists: Fly with the Data of a Captain
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Professional-Grade Knowledge</p>
                                    <p className="text-slate-600">
                                        Aviation doesn't stand still. Master the glass cockpit with our <strong>W1000 application</strong>, designed to bring G1000-inspired precision to your flight prep.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Stay Airline-Ready</p>
                                    <p className="text-slate-600">
                                        Compare your profile against actual airline type-rating requirements—not because you're applying today, but because <strong>staying "airline-ready" is the mark of a true aviator</strong>.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* For Active Pilots */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <BadgeCheck className="w-4 h-4" />
                                For Active Pilots: The Gold Standard of Proof
                            </h3>
                            <p className="text-red-600 font-semibold mb-4">
                                Don't just say you're good—prove it.
                            </p>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">The "Blue Checkmark" of Aviation</p>
                                    <p className="text-slate-600">
                                        In an industry built on trust, your network gets you the interview—but your <strong>Recognition Profile closes the deal</strong>. Even with a referral, airlines want to see you've been vetted and ranked.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-slate-900 mb-1">Verified High-Performance Data</p>
                                    <p className="text-slate-600">
                                        A high PR Score is the <strong>"Blue Checkmark" of the aviation world</strong>. It turns your history into a verified, high-performance data set that earns instant respect from peers and recruiters alike.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* The Global Registry */}
                        <div className="bg-slate-900 rounded-xl p-6 text-white">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-4 flex items-center gap-2">
                                <Globe className="w-4 h-4" />
                                The Global Registry: Where Careers Are Made
                            </h3>
                            <p className="text-lg mb-4">
                                In the past, you were just a name on a PDF. Today, <span className="text-blue-400 font-semibold">you are a PR Score</span>.
                            </p>
                            <p className="text-slate-300 text-sm mb-6">
                                Pilot Recognition is the global infrastructure for your career. If you aren't recognized, vetted, and scored—you aren't just behind. <strong>You're off the radar.</strong>
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => onNavigate('become-member')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Join the Global Registry
                                </button>
                                <button 
                                    onClick={() => onNavigate('become-member')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <Award className="w-4 h-4" />
                                    Build Your Profile
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="py-12 px-6 bg-white">
                <div className="flex justify-center">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                    >
                        <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                </div>
            </div>
        </div>
    );
};
