import React from 'react';
import { ArrowLeft, ArrowRight, Award, Compass, ShieldCheck, Star } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingRecognitionProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const OnboardingRecognition: React.FC<OnboardingRecognitionProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)', overflowX: 'hidden' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ width: '100%', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out', overflowX: 'hidden' }}>
                <div className="max-w-4xl mx-auto w-full">
                    <div className="mb-8 flex justify-center">
                        <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
                        Pilot Recognition & Pathways
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Showcase your achievements, earn industry-recognized credentials, and follow structured pathways to your dream aviation career.
                    </p>
                    
                    <div className="flex flex-col gap-4 mb-8 w-full">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Recognition Profile</h3>
                            <p className="text-sm text-slate-600 mb-3">Document your certifications and achievements</p>
                            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">Learn More &rarr;</button>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Career Pathways</h3>
                            <p className="text-sm text-slate-600 mb-3">Guided paths to major airlines and operators</p>
                            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">Learn More &rarr;</button>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Verified Credentials</h3>
                            <p className="text-sm text-slate-600 mb-3">Industry-recognized proof of your skills</p>
                            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">Learn More &rarr;</button>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Milestone Tracking</h3>
                            <p className="text-sm text-slate-600 mb-3">Celebrate your aviation journey achievements</p>
                            <button className="text-blue-600 text-sm font-semibold hover:text-blue-700 transition-colors">Learn More &rarr;</button>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-programs')}
                            className="px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={onLogin}
                            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            Get Started
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
