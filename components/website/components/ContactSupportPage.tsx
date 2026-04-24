import React from 'react';
import { ArrowLeft, Mail, Phone, Clock, Shield } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface ContactSupportPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} />

            {/* Header Section - Matching Membership Benefits style */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <img
                        src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                        alt="WingMentor Logo"
                        className="mx-auto w-64 h-auto object-contain mb-2"
                    />
                    <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                        Membership & Apps Support
                    </p>
                    <h2 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                        Contact Us Below
                    </h2>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-50 border border-amber-100 rounded-full mx-auto">
                        <Clock className="w-4 h-4 text-amber-600" />
                        <p className="text-sm font-medium text-amber-800">
                            Foundational program app is still under development
                        </p>
                    </div>
                </div>
            </div>

            {/* Contact Cards Section */}
            <div className="py-12 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center md:text-left">
                    {/* Email Support */}
                    <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 space-y-8">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto md:mx-0">
                            <Mail className="w-8 h-8 text-blue-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Email Inquiry</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">In regards to the Program</p>
                                    <a href="mailto:wingmentorprogram@gmail.com" className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors break-words">
                                        wingmentorprogram@gmail.com
                                    </a>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Wingmentor Founders & Team</p>
                                    <a href="mailto:wmpilotgroup@gmail.com" className="text-xl font-medium text-blue-600 hover:text-blue-800 transition-colors break-words">
                                        wmpilotgroup@gmail.com
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Phone Support */}
                    <div className="p-10 bg-slate-50 rounded-3xl border border-slate-100 space-y-8">
                        <div className="w-16 h-16 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto md:mx-0">
                            <Phone className="w-8 h-8 text-emerald-600" />
                        </div>
                        <div>
                            <h3 className="text-2xl font-bold mb-6">Regional Phone Numbers & WhatsApp</h3>
                            <div className="space-y-6">
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Philippines Region</p>
                                    <p className="text-xl font-medium text-slate-900">
                                        +63 967 048 1890
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">European Region</p>
                                    <p className="text-xl font-medium text-slate-900">
                                        +49 1525 9057144
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">UAE Region</p>
                                    <p className="text-xl font-medium text-slate-900">
                                        +971 55 519 5391
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Back Button */}
            <div className="py-12 flex justify-center">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            {/* Shield Icon Decoration (Consistent with About Page) */}
            <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
                    <Shield className="w-6 h-6 text-slate-300" />
                </div>
            </div>
        </div>
    );
};
