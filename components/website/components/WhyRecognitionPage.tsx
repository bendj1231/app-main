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
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full mb-6">
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">The New Standard</span>
                    </div>
                    <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight mb-6">
                        Why Every Pilot Needs a<br />
                        <span className="text-blue-400">Recognition Profile</span>
                    </h1>
                    <p className="max-w-3xl mx-auto text-lg md:text-xl text-blue-100 leading-relaxed">
                        In a rapidly evolving industry, a paper logbook and a standard CV are no longer enough. 
                        Pilot Recognition is the global infrastructure for your aviation identity.
                    </p>
                    <p className="max-w-2xl mx-auto text-base text-blue-200 mt-4">
                        Whether you are flying for a career or for the love of the sky, 
                        being <strong className="text-white">"Recognized"</strong> is the new industry standard.
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
                            <h3 className="text-xl font-bold text-blue-600">Start at the Finish Line</h3>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-lg text-slate-700">
                                Don't wait until you have 1,500 hours to enter the industry.
                            </p>
                            <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Bridge the Gap</h4>
                                <p className="text-slate-600">
                                    Our <strong className="text-blue-700">$50 Industry Experience Programs</strong> provide students 
                                    with professional alignment and manufacturer-standard insights that usually take years to acquire.
                                </p>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Build Your Digital Footprint</h4>
                                <p className="text-slate-600">
                                    Start your profile today so airlines can track your growth. When you graduate, 
                                    you aren't a stranger—you're a <strong>known candidate with a proven track record</strong>.
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
                            <h3 className="text-xl font-bold text-amber-600">Pro-Level Precision</h3>
                        </div>
                        <div className="md:col-span-8 md:order-1 space-y-6">
                            <p className="text-lg text-slate-700">
                                Even if you aren't flying for an airline, you should be flying by their standards.
                            </p>
                            <div className="bg-amber-50 border-l-4 border-amber-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">The W1000 Advantage</h4>
                                <p className="text-slate-600">
                                    Master the glass cockpit with our <strong className="text-amber-700">W1000 application</strong>, 
                                    designed to bring G1000-inspired precision to your flight prep.
                                </p>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Stay Industry-Current</h4>
                                <p className="text-slate-600">
                                    Access real-time data on type rating requirements and global aviation shifts. 
                                    Compare your profile against airline expectations to see how you <strong>measure up against the world's best</strong>.
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
                            <h3 className="text-xl font-bold text-emerald-600">The "Blue Checkmark" of Aviation</h3>
                        </div>
                        <div className="md:col-span-8 space-y-6">
                            <p className="text-lg text-slate-700">
                                A referral might get you an interview, but a PR Score gets you the job.
                            </p>
                            <div className="bg-emerald-50 border-l-4 border-emerald-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Verified Authority</h4>
                                <p className="text-slate-600">
                                    In an industry built on trust, having a vetted and recognized profile is your 
                                    <strong> ultimate badge of honor</strong>. It proves you've been through the rigorous 
                                    screening process and meet the high standards of global aviation.
                                </p>
                            </div>
                            <div className="bg-slate-50 border-l-4 border-slate-600 p-6 rounded-r-xl">
                                <h4 className="font-bold text-slate-900 mb-2">Global Bragging Rights</h4>
                                <p className="text-slate-600">
                                    A top-tier PR Score is a signal to peers and recruiters that you are 
                                    <strong>"Airline Ready."</strong> It's more than a resume—it's a verified statement 
                                    of your skills, behavior, and experience.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Line CTA */}
            <div className="py-20 px-6 bg-slate-900">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/20 border border-blue-500/30 rounded-full mb-6">
                        <Award className="w-4 h-4 text-blue-400" />
                        <span className="text-sm font-semibold text-blue-400 uppercase tracking-wider">The Bottom Line</span>
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-white leading-tight mb-6">
                        If you aren't on the Global Registry,<br />
                        <span className="text-blue-400">you're flying off the radar.</span>
                    </h2>
                    
                    <p className="text-xl text-slate-300 mb-8">
                        Pilot Recognition is where the world's pilots are vetted, ranked, and respected.
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
