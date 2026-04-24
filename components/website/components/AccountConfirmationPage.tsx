import React from 'react';
import { ArrowLeft, CheckCircle2 } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface AccountConfirmationPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AccountConfirmationPage: React.FC<AccountConfirmationPageProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f0f9ff 0%, #e0f2fe 100%)' }}>
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />
            
            <div style={{ maxWidth: '800px', margin: '0 auto', padding: '4rem 2rem', animation: 'fadeIn 0.5s ease-in-out', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div className="bg-white/90 backdrop-blur-xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/50 overflow-hidden p-12 md:p-20 text-center">
                    <div className="max-w-2xl mx-auto">
                        <div className="mb-8 flex justify-center">
                            <img src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png" alt="WingMentor Logo" style={{ maxWidth: '200px', height: 'auto', objectFit: 'contain' }} />
                        </div>
                        
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                            Welcome to PilotRecognition.com
                        </h2>
                        
                        <p className="text-lg text-slate-600 mb-6">
                            Thank you for successfully creating your account!
                        </p>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-2xl p-6 mb-8">
                            <p className="text-sm text-slate-700 mb-2">
                                <strong>Account Created</strong>
                            </p>
                            <p className="text-sm text-slate-600">
                                Your account has been created successfully. A welcome email has been sent to your inbox with details about your new account.
                            </p>
                        </div>
                        
                        <div className="space-y-4">
                            <p className="text-sm text-slate-500">
                                You can now access the Pilot Portal to view programs, pathways, and your Pilot Recognition profile.
                            </p>
                            
                            <button
                                onClick={() => onNavigate('onboarding-pilot-portal')}
                                className="px-8 py-4 bg-blue-600 text-white font-semibold rounded-2xl hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl"
                            >
                                Get Started
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
