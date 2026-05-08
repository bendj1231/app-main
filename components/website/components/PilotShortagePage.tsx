import React from 'react';
import { TopNavbar } from './TopNavbar';
import { ArrowLeft, AlertTriangle, Target, GraduationCap, Plane, Users, BadgeCheck, TrendingUp } from 'lucide-react';

interface PilotShortagePageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotShortagePage: React.FC<PilotShortagePageProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        The Reality Check
                    </p>
                    <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                        The Truth About the "Pilot Shortage"
                    </h1>
                    <span className="text-xl md:text-2xl text-slate-500 leading-none block mb-8">
                        Airlines Aren't Looking for Pilots—They're Looking for Certainty
                    </span>

                    <div className="max-w-3xl mx-auto text-base text-slate-700 leading-relaxed text-left space-y-6">
                        <p>
                            Everyone talks about a pilot shortage, but the truth is different. Airlines receive thousands of applications that sit unread because they can't risk hiring the wrong person. Without a PR Score, you are just a number in a stack. Pilot Recognition is the only way to break through the noise and prove you are the solution they are desperate for.
                        </p>

                        {/* For Students */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <GraduationCap className="w-4 h-4" />
                                For Students: Escape the "Low-Hour" Trap
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-red-600 mb-1">The Reality</p>
                                    <p className="text-slate-600">
                                        Flight schools are churning out graduates, but airlines are picky. Your 200-hour license looks identical to 500 other applications.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-blue-600 mb-1">The Solution</p>
                                    <p className="text-slate-600">
                                        For $50, our Industry Experience programs give you the "vetted" status that puts you ahead of other graduates. Without this, your license is just a piece of paper; with it, you are an industry-aligned asset.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* For Hobbyists */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <Plane className="w-4 h-4" />
                                For Hobbyists: Information is Survival
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-red-600 mb-1">The Reality</p>
                                    <p className="text-slate-600">
                                        Aviation regulations, Type Rating requirements, and ICAO standards evolve constantly. Yesterday's currency is today's obsolescence. Without current data, you're flying on outdated assumptions.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-amber-600 mb-1">The Solution</p>
                                    <p className="text-slate-600">
                                        You can't fly safely on old info. The W1000 application and real-time pathway updates keep you current on airspace changes, medical requirements, and operator expectations. Compare your profile to live airline standards—stay professionally relevant even if you're flying for recreation.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* For Veterans */}
                        <div className="bg-slate-50 rounded-xl p-6 border border-slate-200">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4" />
                                For the "Connected" & Veterans: The Respect Tax
                            </h3>
                            <div className="grid md:grid-cols-2 gap-6 text-sm">
                                <div>
                                    <p className="font-semibold text-red-600 mb-1">The Reality</p>
                                    <p className="text-slate-600">
                                        Even with a "hookup," the HR department still needs to check a box. Your referral can get you in the door, but it won't get you respect in the cockpit.
                                    </p>
                                </div>
                                <div>
                                    <p className="font-semibold text-emerald-600 mb-1">The Solution</p>
                                    <p className="text-slate-600">
                                        A referral gets you a look, but a Top PR Score gets you the respect. Don't just rely on who you know—brag about the fact that you've been mathematically proven to be elite.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* The Bottom Line */}
                        <div className="bg-slate-900 rounded-xl p-6 text-white">
                            <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-400 mb-4 flex items-center gap-2">
                                <Target className="w-4 h-4" />
                                The Bottom Line
                            </h3>
                            <p className="text-lg mb-4">
                                Stop Being an Applicant. <span className="text-red-400 font-semibold">Start Being a Candidate.</span>
                            </p>
                            <p className="text-slate-300 text-sm mb-6">
                                The "shortage" is a Fugazzi if you're on the outside looking in. Pilot Recognition puts you on the inside. If you aren't vetted, you don't exist.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <button 
                                    onClick={() => onNavigate('become-member')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    <TrendingUp className="w-4 h-4" />
                                    Join the Global Registry
                                </button>
                                <button 
                                    onClick={() => onNavigate('recognition-plus')}
                                    className="flex items-center justify-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold rounded-lg hover:bg-slate-100 transition-colors"
                                >
                                    <BadgeCheck className="w-4 h-4" />
                                    Get the Score. Get the Job.
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
