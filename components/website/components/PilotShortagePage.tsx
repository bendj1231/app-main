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

            {/* Hero Section */}
            <div className="pt-32 pb-16 px-6 bg-gradient-to-b from-slate-900 to-slate-800">
                <div className="max-w-6xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
                        <AlertTriangle className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">The Reality Check</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
                        The Truth About the<br />
                        <span className="text-red-500">"Pilot Shortage"</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-300 leading-relaxed">
                        Everyone talks about a shortage, but the truth is different: Airlines aren't looking for pilots; 
                        they are looking for <strong className="text-white">certainty</strong>.
                    </p>
                </div>
            </div>

            {/* The Problem */}
            <div className="py-16 px-6 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="max-w-3xl mx-auto text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            Thousands of Applications Sit Unread
                        </h2>
                        <p className="text-lg text-slate-600">
                            Airlines can't risk hiring the wrong person. Without a PR Score, 
                            you are just a number in a stack.
                        </p>
                    </div>
                    
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 md:p-12">
                        <div className="flex items-start gap-4 mb-6">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                                <Target className="w-6 h-6 text-red-600" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold text-slate-900 mb-2">
                                    Pilot Recognition Is the Only Way to Break Through
                                </h3>
                                <p className="text-slate-600">
                                    Prove you are the solution they are desperate for.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Three Audience Sections */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    {/* Students */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                                <GraduationCap className="w-6 h-6 text-blue-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">For Students: Escape the "Low-Hour" Trap</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <h4 className="text-lg font-bold text-red-600 mb-3">The Reality</h4>
                                <p className="text-slate-600">
                                    Flight schools are churning out graduates, but airlines are picky. 
                                    Your 200-hour license looks identical to 500 other applications.
                                </p>
                            </div>
                            <div className="bg-blue-600 rounded-2xl p-8 text-white">
                                <h4 className="text-lg font-bold mb-3">The Need</h4>
                                <p className="text-blue-100 mb-4">
                                    For <strong className="text-white">$50</strong>, our Industry Experience programs give you 
                                    the "vetted" status that puts you ahead of the 200 other students graduating this month.
                                </p>
                                <p className="text-white font-semibold">
                                    Without this, your license is just a piece of paper; with it, you are an industry-aligned asset.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Hobbyists */}
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-amber-100 rounded-xl flex items-center justify-center">
                                <Plane className="w-6 h-6 text-amber-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">For Hobbyists: Information is Survival</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <h4 className="text-lg font-bold text-red-600 mb-3">The Reality</h4>
                                <p className="text-slate-600">
                                    The rules change every week—Type Ratings, ICAO standards, and battery tech are moving targets. 
                                    Yesterday's currency is today's obsolescence.
                                </p>
                            </div>
                            <div className="bg-amber-500 rounded-2xl p-8 text-white">
                                <h4 className="text-lg font-bold mb-3">The Need</h4>
                                <p className="text-amber-100 mb-4">
                                    You can't fly safely or competently on old info. You need the 
                                    <strong className="text-white"> W1000 application</strong> and our real-time pathway updates to stay relevant.
                                </p>
                                <p className="text-white font-semibold">
                                    If you aren't comparing your profile to current airline expectations, 
                                    you're flying blind in a professional world.
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Veterans/Connected */}
                    <div>
                        <div className="flex items-center gap-4 mb-6">
                            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                                <Users className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900">For the "Connected" & Veterans: The Respect Tax</h3>
                        </div>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="bg-white rounded-2xl p-8 border border-slate-200">
                                <h4 className="text-lg font-bold text-red-600 mb-3">The Reality</h4>
                                <p className="text-slate-600">
                                    Even with a "hookup," the HR department still needs to check a box. 
                                    Your referral can get you in the door, but it won't get you respect in the cockpit.
                                </p>
                            </div>
                            <div className="bg-emerald-600 rounded-2xl p-8 text-white">
                                <h4 className="text-lg font-bold mb-3">The Need</h4>
                                <p className="text-emerald-100 mb-4">
                                    A referral gets you a look, but a <strong className="text-white">Top PR Score</strong> gets you the respect. 
                                    In the modern cockpit, pilots respect those who have been interviewed, vetted, and recognized.
                                </p>
                                <p className="text-white font-semibold">
                                    Don't just rely on who you know—brag about the fact that 
                                    you've been mathematically proven to be elite.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA Section */}
            <div className="py-20 px-6 bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-600/20 border border-red-500/30 rounded-full mb-6">
                        <BadgeCheck className="w-4 h-4 text-red-400" />
                        <span className="text-sm font-semibold text-red-400 uppercase tracking-wider">The Truth</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-5xl font-serif text-white leading-tight mb-6">
                        Stop Being an Applicant.<br />
                        <span className="text-red-500">Start Being a Candidate.</span>
                    </h2>
                    
                    <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
                        The "shortage" is a <strong className="text-white">Fugazzi</strong> if you're on the outside looking in. 
                        Pilot Recognition puts you on the inside.
                    </p>
                    
                    <p className="text-lg text-slate-400 mb-12">
                        If you aren't vetted, you don't exist.
                    </p>
                    
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button 
                            onClick={() => onNavigate('become-member')}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 hover:scale-105 transition-all shadow-xl"
                        >
                            <TrendingUp className="w-5 h-5" />
                            Join the Global Registry
                        </button>
                        <button 
                            onClick={() => onNavigate('recognition-plus')}
                            className="group flex items-center justify-center gap-3 px-8 py-4 bg-white text-slate-900 font-bold rounded-xl hover:bg-slate-100 hover:scale-105 transition-all shadow-xl"
                        >
                            <BadgeCheck className="w-5 h-5" />
                            Get the Score. Get the Job.
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
