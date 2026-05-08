import React from 'react';
import { TopNavbar } from './TopNavbar';
import { ArrowLeft, GraduationCap, Plane, BadgeCheck, Globe, TrendingUp, Award } from 'lucide-react';

interface WhyRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const WhyRecognitionPage: React.FC<WhyRecognitionPageProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 bg-gradient-to-b from-blue-900 to-blue-800">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
                        <Globe className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">Digital Professional Identity</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
                        Why Every Pilot Needs a<br />
                        <span className="text-blue-400">Recognition Profile</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed">
                        In aviation, your reputation and your logbook are everything. 
                        Pilot Recognition digitizes and validates both.
                    </p>
                    <p className="max-w-2xl mx-auto text-base text-blue-200 mt-4">
                        This isn't a job board. It's the <strong className="text-white">global infrastructure for your career</strong>. 
                        If you aren't recognized, vetted, and scored—you aren't just behind. You're off the radar.
                    </p>
                </div>
            </div>

            {/* For Students */}
            <div className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-4">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mb-6">
                                <GraduationCap className="w-10 h-10 text-blue-600" />
                            </div>
                            <h2 className="text-3xl font-serif text-slate-900 mb-2">1. For Students</h2>
                            <h3 className="text-xl font-bold text-blue-600">The Unfair Advantage</h3>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-lg text-red-600 font-semibold">
                                Don't graduate into a vacuum.
                            </p>
                            <div className="bg-red-50 border-l-4 border-red-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">The Gap Is Real</h4>
                                <p className="text-slate-600">
                                    The distance between flight school and a flight deck is huge. Our <strong className="text-red-700">$50 Industry Experience Programs</strong> are the only way to put "Professional Alignment" on your resume before you even have your commercial license.
                                </p>
                            </div>
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">The Cost of Invisibility</h4>
                                <p className="text-slate-600">
                                    If you aren't on the registry, you're <strong>invisible to the airlines currently scouting the next generation of cadets</strong>. While others wait, you'll already be vetted, tracked, and recognized.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* For Hobbyists */}
            <div className="py-20 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-4 md:order-2">
                            <div className="w-20 h-20 bg-amber-100 rounded-2xl flex items-center justify-center mb-6">
                                <Plane className="w-10 h-10 text-amber-600" />
                            </div>
                            <h2 className="text-3xl font-serif text-slate-900 mb-2">2. For Hobbyists</h2>
                            <h3 className="text-xl font-bold text-amber-600">Fly with the Data of a Captain</h3>
                        </div>
                        <div className="md:col-span-8 md:order-1 space-y-6">
                            <p className="text-lg text-slate-700">
                                Even if you aren't flying for an airline, you should be flying by their standards.
                            </p>
                            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Professional-Grade Knowledge</h4>
                                <p className="text-slate-600">
                                    Aviation doesn't stand still. Master the glass cockpit with our <strong className="text-amber-700">W1000 application</strong>, designed to bring G1000-inspired precision to your flight prep.
                                </p>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Stay Airline-Ready</h4>
                                <p className="text-slate-600">
                                    Compare your profile against actual airline type-rating requirements—not because you're applying today, but because <strong>staying "airline-ready" is the mark of a true aviator</strong>. Fly with the data. Fly with precision.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* For Active Pilots */}
            <div className="py-20 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid md:grid-cols-12 gap-12 items-center">
                        <div className="md:col-span-4">
                            <div className="w-20 h-20 bg-emerald-100 rounded-2xl flex items-center justify-center mb-6">
                                <BadgeCheck className="w-10 h-10 text-emerald-600" />
                            </div>
                            <h2 className="text-3xl font-serif text-slate-900 mb-2">3. For Active Pilots</h2>
                            <h3 className="text-xl font-bold text-emerald-600">The Gold Standard of Proof</h3>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-lg text-red-600 font-semibold">
                                Don't just say you're good—prove it.
                            </p>
                            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">The "Blue Checkmark" of Aviation</h4>
                                <p className="text-slate-600">
                                    In an industry built on trust, your network gets you the interview—but your <strong className="text-emerald-700">Recognition Profile closes the deal</strong>. Even with a referral, airlines want to see you've been vetted and ranked.
                                </p>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Verified High-Performance Data</h4>
                                <p className="text-slate-600">
                                    A high PR Score is the <strong>"Blue Checkmark" of the aviation world</strong>. It turns your history into a verified, high-performance data set that earns instant respect from peers and recruiters alike.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Line CTA */}
            <div className="py-20 px-6 bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
                        <Award className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">The Universal Truth</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-6">
                        The Global Registry:<br />
                        <span className="text-blue-400">Where Careers Are Made</span>
                    </h2>
                    
                    <p className="text-xl text-slate-300 mb-4">
                        In the past, you were just a name on a PDF. Today, <strong className="text-white">you are a PR Score</strong>.
                    </p>
                    
                    <p className="text-lg text-slate-400 mb-8">
                        Pilot Recognition is the global infrastructure for your career. If you aren't recognized, vetted, and scored—you aren't just behind. <strong className="text-white">You're off the radar.</strong>
                    </p>
                    
                    <p className="text-2xl font-bold text-white mb-12">
                        Claim your identity. Get Recognized.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => onNavigate('become-member')}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 hover:scale-105 transition-all shadow-xl"
                        >
                            <TrendingUp className="w-5 h-5" />
                            Join the Global Registry
                        </button>
                        <button 
                            onClick={() => onNavigate('recognition-plus')}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-xl"
                        >
                            <Award className="w-5 h-5" />
                            Build Your Profile
                        </button>
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
