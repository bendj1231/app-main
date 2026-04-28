import React from 'react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';
import { CheckCircle2, Download, Monitor, Apple } from 'lucide-react';

interface DownloadPageProps {
    onNavigate: (page: string) => void;
    onLogin: () => void;
    onBack: () => void;
}

export const DownloadPage: React.FC<DownloadPageProps> = ({ onNavigate, onLogin, onBack }) => {
    return (
        <div className="relative min-h-screen font-sans bg-slate-50 overflow-x-hidden">
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isDark={false}
            />

            <div className="pt-32 pb-20 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <RevealOnScroll delay={100}>
                            <div>
                                <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-500/10 rounded-full border border-blue-400/20 mb-8">
                                    <div className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></div>
                                    <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-700">Official Portal App</span>
                                </div>

                                <h1 className="text-5xl md:text-7xl font-serif text-slate-900 leading-tight mb-6">
                                    PilotRecognition <br />
                                    <span className="text-blue-600">Portal</span>
                                </h1>

                                <p className="text-lg text-slate-600 leading-relaxed mb-10 max-w-xl">
                                    The complete pilot career management suite. Access your ATLAS profile, network with industry mentors, and manage your pathway applications directly from your desktop.
                                </p>

                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <button className="flex items-center justify-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-lg hover:bg-slate-800 transition-all shadow-xl hover:scale-[1.02] min-w-[200px] border border-slate-800">
                                            <Apple className="w-5 h-5" />
                                            <div className="text-left">
                                                <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                                                <div className="font-bold">macOS</div>
                                            </div>
                                        </button>

                                        <button className="flex items-center justify-center gap-3 bg-white text-slate-900 px-8 py-4 rounded-lg hover:bg-slate-50 transition-all shadow-lg hover:scale-[1.02] min-w-[200px] border border-slate-200">
                                            <Monitor className="w-5 h-5 text-blue-600" />
                                            <div className="text-left">
                                                <div className="text-[10px] uppercase tracking-wider opacity-70">Download for</div>
                                                <div className="font-bold">Windows</div>
                                            </div>
                                        </button>
                                    </div>
                                    <p className="text-xs text-slate-400 italic pl-2">
                                        Version 2.4.0 • Requires macOS 11+ or Windows 10+
                                    </p>
                                </div>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll delay={300}>
                            <div className="relative">
                                <div className="absolute inset-0 bg-blue-600/5 rounded-3xl transform rotate-3 scale-95 blur-xl"></div>
                                <div className="relative bg-white border border-slate-200 rounded-2xl shadow-2xl p-8 overflow-hidden">
                                    <div className="absolute top-0 right-0 p-32 bg-blue-50 rounded-full blur-3xl opacity-50 -mr-16 -mt-16"></div>

                                    <h3 className="text-xl font-bold text-slate-900 mb-6 relative z-10">System Capabilities</h3>

                                    <ul className="space-y-4 relative z-10">
                                        {[
                                            "Secure ATLAS Profile Management",
                                            "Real-time Application Tracking",
                                            "Direct Mentor Messaging Protocol",
                                            "Document Verification Vault",
                                            "Offline Mode Support"
                                        ].map((item, i) => (
                                            <li key={i} className="flex items-center gap-3">
                                                <div className="bg-blue-50 p-1 rounded-full">
                                                    <CheckCircle2 className="w-4 h-4 text-blue-600" />
                                                </div>
                                                <span className="text-slate-600 font-medium">{item}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <div className="mt-8 pt-8 border-t border-slate-100 relative z-10">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 flex items-center justify-center bg-green-50 rounded-full border border-green-100">
                                                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-bold uppercase tracking-wider text-slate-500">System Status</div>
                                                <div className="text-sm font-bold text-slate-900">Operational</div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            <div className="bg-slate-900 py-12 border-t border-slate-800">
                <div className="max-w-7xl mx-auto px-6 text-center">
                    <p className="text-slate-500 text-sm">© 2026 PilotRecognition. EBT CBTA guidance provided under advisory relationship. All secure systems operational.</p>
                </div>
            </div>
        </div>
    );
};
