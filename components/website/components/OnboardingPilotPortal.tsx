import React from 'react';
import { ArrowRight, LayoutDashboard, MessageSquare, Newspaper, AlertTriangle, Headphones, Sparkles } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingPilotPortalProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const OnboardingPilotPortal: React.FC<OnboardingPilotPortalProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-center">
                        <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
                        Welcome to Your Pilot Portal
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Your central hub to access programs, pathways, pilot recognition profile, and comprehensive aviation resources.
                    </p>
                    
                    <div className="flex flex-col gap-4 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">Examination Terminal</h3>
                            <p className="text-sm text-slate-600">Access through programs or dashboard page</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">Pilot Terminal</h3>
                            <p className="text-sm text-slate-600">Chat with fellow members and discuss aviation</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">Industry News</h3>
                            <p className="text-sm text-slate-600">Stay updated on AIRBUS aligned updates and airline expectations</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">Job Requirements</h3>
                            <p className="text-sm text-slate-600">Notices of job requirement changes and updates</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">WingMentor Support</h3>
                            <p className="text-sm text-slate-600">Contact us for any issues or assistance</p>
                        </div>
                        <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-6 border-2 border-violet-200 shadow-md">
                            <h3 className="font-semibold text-slate-900 mb-1">PilotRecognition.ai</h3>
                            <p className="text-sm text-slate-600">Upcoming AI for performance tracking and score management</p>
                        </div>
                    </div>
                    
                    <div className="bg-violet-50/80 backdrop-blur-sm border border-violet-200 rounded-2xl p-6 mb-8">
                        <p className="text-sm text-violet-900 mb-2">
                            <strong>Coming Soon:</strong> PilotRecognition.ai will track your performance, provide job requirements, notify you when you haven't flown for a while, and advise on keeping your pilot recognition score up.
                        </p>
                    </div>
                    
                    <div className="flex justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-programs')}
                            className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                        >
                            Next: Programs
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
