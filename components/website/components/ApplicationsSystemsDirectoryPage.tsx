import React from 'react';
import { Shield, AppWindow, Tablet, Book, LayoutGrid, Award, FileText, Cpu, Database, ChevronRight, Zap, Boxes, Terminal } from 'lucide-react';
import { PathwaysHeader } from './PathwaysHeader';
import { RevealOnScroll } from '../RevealOnScroll';

interface ApplicationsSystemsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const ApplicationsSystemsDirectoryPage: React.FC<ApplicationsSystemsPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const digitalEcosystem = [
        {
            title: "WingMentor W1000 Suite",
            desc: "Our flagship ecosystem featuring the Examination Terminal, Black Box, and IFR Simulator tools.",
            target: "w1000-suite",
            icon: AppWindow,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "EFB Hub & Apps",
            desc: "Digitized weight & balance, flight planning, and performance tools for the modern cockpit.",
            target: "pilot_apps",
            icon: Tablet,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "AIRBUS Integrated Suite",
            desc: "Human Factors Analytics and Performance Monitoring via Hinfact and Airbus digital systems.",
            target: "airbus",
            icon: LayoutGrid,
            color: "text-sky-600",
            bg: "bg-sky-50"
        },
        {
            title: "Pilot Handbook",
            desc: "The definitive Operating Handbook and knowledge base for WingMentor program standards.",
            target: "handbook",
            icon: Book,
            color: "text-slate-600",
            bg: "bg-slate-50"
        }
    ];

    const recognitionSystems = [
        {
            title: "ATLAS CV Systems",
            desc: "AI-driven CV modernization designed to meet global airline and recruiter data standards.",
            target: "atlas-cv",
            icon: FileText,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Pilot Recognition Badge",
            desc: "Credentialing and credibility scoring via our unified Competency Assurance Network.",
            target: "pilot-recognition",
            icon: Award,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "Global Talent Registry",
            desc: "A verified database connecting high-potential pilots directly with the aviation industry.",
            target: "pilot-recognition",
            icon: Database,
            color: "text-rose-600",
            bg: "bg-rose-50"
        }
    ];

    const accessPortal = [
        {
            title: "Foundational Application",
            desc: "Start your journey in the global registry through the core foundational tier.",
            target: "become-member",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Transition Portal",
            desc: "Direct applications for experienced instructors seeking multi-crew jet pathways.",
            target: "become-member",
            icon: Boxes,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <PathwaysHeader onBack={onBack} onNavigate={onNavigate} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://res.cloudinary.com/dridtecu6/image/upload/v1776997648/general/efqjszksldcdm6kbnzoq.png"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Technology
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Applications & Systems
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            The technological infrastructure of WingMentor. From AI-driven recruitment tools
                            to EBT-integrated flight deck software and our secure global talent registry.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Digital Ecosystem Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <Terminal className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-serif text-slate-900">The Digital Ecosystem</h2>
                    </div>
                    <div className="w-20 h-1 bg-blue-600"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {digitalEcosystem.map((item, idx) => (
                        <SystemCard key={idx} {...item} onClick={() => onNavigate(item.target)} />
                    ))}
                </div>
            </div>

            {/* Recognition Systems (Dark) */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16 text-left">
                        <div className="flex items-center gap-4 mb-4">
                            <Cpu className="w-6 h-6 text-blue-400" />
                            <h2 className="text-3xl font-serif text-white">Verification & Recognition</h2>
                        </div>
                        <div className="w-20 h-1 bg-blue-500"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
                        {recognitionSystems.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => onNavigate(item.target)}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-sans">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans">{item.desc}</p>
                                <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-widest gap-2 font-sans">
                                    Launch Suite <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Program Access Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-serif text-slate-900">Authorized Access</h2>
                    </div>
                    <div className="w-20 h-1 bg-blue-600"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {accessPortal.map((item, idx) => (
                        <SystemCard key={idx} {...item} onClick={() => onNavigate(item.target)} />
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Secured Portal Access</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">Already enrolled? Access your personalized dashboard, flight hour logs, and real-time competency analytics.</p>
                    <button
                        onClick={() => onNavigate('sign_in')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                    >
                        Sign In to Portal
                    </button>
                </div>
            </div>
        </div>
    );
};

const SystemCard = ({ title, desc, icon: Icon, color, bg, onClick }: any) => (
    <div
        onClick={onClick}
        className="group bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer flex flex-col text-left"
    >
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 ${color} group-hover:rotate-6 transition-all`}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans flex-grow">{desc}</p>
        <div className={`flex items-center ${color} text-sm font-bold uppercase tracking-widest gap-2 font-sans`}>
            Launch System <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);
