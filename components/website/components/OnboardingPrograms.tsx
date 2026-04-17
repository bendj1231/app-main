import React from 'react';
import { ArrowLeft, ArrowRight, GraduationCap, Plane, Award, TrendingUp } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface OnboardingProgramsProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const OnboardingPrograms: React.FC<OnboardingProgramsProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out', overflowX: 'hidden' }}>
                <div className="max-w-4xl mx-auto">
                    <div className="mb-8 flex justify-center">
                        <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                    </div>
                    
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4 text-center">
                        Aviation Development Programs
                    </h2>
                    
                    <p className="text-lg text-slate-600 mb-8 text-center">
                        Structured pathways designed to guide you from student to professional pilot with comprehensive training and mentorship.
                    </p>
                    
                    <div className="flex flex-col gap-4 mb-8 w-full">
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Foundation Program</h3>
                            <p className="text-sm text-slate-600">Start your journey with fundamental pilot training</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Advanced Training</h3>
                            <p className="text-sm text-slate-600">Specialized courses for career advancement</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Career Pathways</h3>
                            <p className="text-sm text-slate-600">Tailored paths to major airlines and operators</p>
                        </div>
                        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-md w-full">
                            <h3 className="font-semibold text-slate-900 mb-1">Certification Prep</h3>
                            <p className="text-sm text-slate-600">Prepare for ATPL, CPL, and other certifications</p>
                        </div>
                    </div>
                    
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={() => onNavigate('onboarding-pilot-portal')}
                            className="px-6 py-4 bg-slate-200 text-slate-700 font-semibold rounded-2xl hover:bg-slate-300 transition-all flex items-center gap-2"
                        >
                            <ArrowLeft className="w-5 h-5" />
                            Back
                        </button>
                        <button
                            onClick={() => onNavigate('onboarding-recognition')}
                            className="px-6 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                        >
                            Next: Recognition
                            <ArrowRight className="w-5 h-5" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};
