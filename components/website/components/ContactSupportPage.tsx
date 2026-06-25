import React, { useState } from 'react';
import { ArrowLeft, Send, CheckCircle } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface ContactSupportPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin?: () => void;
}

const DEPARTMENTS = [
    {
        icon: '⚡',
        title: 'Engineering & Platform',
        email: 'dev@pilotrecognition.com',
        desc: 'API issues, passkey bugs, and integrations'
    },
    {
        icon: '✈️',
        title: 'Airline & Corporate',
        email: 'airlines@pilotrecognition.com',
        desc: 'Pilot shortage matrix queries and enterprise hiring slots'
    },
    {
        icon: '🛡️',
        title: 'Verification & Compliance',
        email: 'compliance@pilotrecognition.com',
        desc: 'Logbook checks and ICAO validation escalations'
    },
    {
        icon: '💳',
        title: 'General & Billing',
        email: 'billing@pilotrecognition.com',
        desc: 'Pilot premium status management'
    }
];

const REGIONAL_OFFICES = [
    { region: 'Asia Pacific', flag: '🌐', phone: '+63 967 048 1890', coverage: 'Philippines & Southeast Asia' },
    { region: 'Europe', flag: '🇪🇺', phone: '+49 1525 9057144', coverage: 'Germany & European Region' },
    { region: 'Middle East', flag: '🏜️', phone: '+971 55 519 5391', coverage: 'UAE & Gulf Region' }
];

export const ContactSupportPage: React.FC<ContactSupportPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [formSubmitted, setFormSubmitted] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setFormSubmitted(true);
        setTimeout(() => {
            setFormSubmitted(false);
            setFormData({ name: '', email: '', subject: '', message: '' });
        }, 3000);
    };

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} />

            {/* Header */}
            <div className="pt-32 pb-10 px-6">
                <div className="max-w-5xl mx-auto">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-semibold uppercase tracking-wider text-emerald-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                            All systems operational
                        </span>
                        <span className="text-[10px] text-slate-400 font-medium">— response under 12h</span>
                    </div>
                    <p className="text-xs font-bold tracking-[0.3em] uppercase text-red-500 mb-3">
                        Membership & Apps Support
                    </p>
                    <h2 className="text-4xl md:text-5xl font-bold text-[#0f172a] tracking-tight mb-4">
                        Support Center
                    </h2>
                    <p className="text-sm text-slate-600 max-w-xl leading-relaxed">
                        Route directly to the team that owns your issue. For urgent operational matters, use the hotlines below.
                    </p>
                </div>
            </div>

            {/* Department Routing Matrix */}
            <div className="px-6 pb-10 max-w-5xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {DEPARTMENTS.map((dept) => (
                        <a
                            key={dept.email}
                            href={`mailto:${dept.email}`}
                            className="group p-5 bg-slate-50/50 hover:bg-white border border-slate-100 hover:border-red-300 rounded-xl transition-all"
                        >
                            <p className="text-sm font-semibold text-slate-900 group-hover:text-red-600 transition-colors">{dept.title}</p>
                            <p className="text-xs text-slate-500 mt-0.5">{dept.desc}</p>
                            <p className="text-xs font-mono text-red-500 mt-2">{dept.email}</p>
                        </a>
                    ))}
                </div>
            </div>

            {/* Regional Offices */}
            <div className="px-6 pb-10 max-w-5xl mx-auto">
                <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">Regional Offices</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {REGIONAL_OFFICES.map((office) => (
                        <div key={office.region} className="p-5 bg-slate-50/50 border border-slate-100 rounded-xl">
                            <p className="text-sm font-semibold text-slate-900 mb-3">{office.region}</p>
                            <a href={`tel:${office.phone.replace(/\s/g, '')}`} className="text-xs font-mono text-red-500 hover:text-red-700 hover:underline transition-colors">{office.phone}</a>
                            <p className="text-[11px] text-slate-500 mt-1.5">{office.coverage}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Contact Form */}
            <div className="px-6 pb-16 max-w-5xl mx-auto">
                <div className="border border-slate-100 rounded-xl bg-white shadow-sm p-8">
                    <div className="flex items-center gap-2 mb-6">
                        <div className="w-1.5 h-1.5 rounded-full bg-red-500" />
                        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-900">Open a Secure Ticket</h3>
                    </div>

                    {formSubmitted ? (
                        <div className="text-center py-12">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center mx-auto mb-4">
                                <CheckCircle className="w-6 h-6 text-emerald-600" />
                            </div>
                            <h4 className="text-sm font-bold text-slate-900 mb-1">Ticket Submitted</h4>
                            <p className="text-xs text-slate-500">We'll route this to the correct team and respond within 12 hours.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Name</label>
                                    <input
                                        type="text"
                                        required
                                        value={formData.name}
                                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                                        placeholder="Your name"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email</label>
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                                        className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                                        placeholder="your@email.com"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Subject</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.subject}
                                    onChange={(e) => setFormData({...formData, subject: e.target.value})}
                                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none"
                                    placeholder="How can we help?"
                                />
                            </div>
                            <div>
                                <label className="block text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Message</label>
                                <textarea
                                    required
                                    value={formData.message}
                                    onChange={(e) => setFormData({...formData, message: e.target.value})}
                                    rows={5}
                                    className="w-full px-3.5 py-2.5 rounded-lg bg-white border border-slate-200 text-sm text-slate-900 placeholder-slate-400 focus:border-red-500 focus:ring-1 focus:ring-red-500/20 transition-all outline-none resize-none"
                                    placeholder="Describe your issue in detail..."
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full px-6 py-3 bg-[#dc2626] hover:bg-[#b91c1c] text-white text-sm font-bold rounded-lg transition-colors flex items-center justify-center gap-2"
                            >
                                <Send className="w-4 h-4" />
                                Submit Ticket
                            </button>
                        </form>
                    )}
                </div>
            </div>

            {/* Back */}
            <div className="px-6 pb-16 max-w-5xl mx-auto">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-xs text-slate-400 hover:text-slate-900 transition-colors"
                >
                    <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-100 py-6 text-center">
                <p className="text-[11px] text-slate-400">© 2024 PilotRecognition. All rights reserved.</p>
            </div>
        </div>
    );
};
