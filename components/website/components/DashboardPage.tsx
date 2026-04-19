import React, { useState } from 'react';
import {
    Briefcase,
    Zap,
    LayoutGrid,
    Activity,
    Shield,
    Users,
    ChevronDown,
    Terminal,
    Box,
    ExternalLink,
    Plane,
    Cpu,
    FileText,
    BookOpen,
    Globe,
    Award,
    Tablet,
    AppWindow,
    LayoutDashboard
} from 'lucide-react';
import PilotTerminalDashboard from '@/components/website/components/pilot-terminal/PilotTerminalDashboard';

interface DashboardPageProps {
    onNavigate: (page: string) => void;
}

interface ExpandableGlassItemProps {
    title: string;
    icon: any;
    defaultOpen?: boolean;
    children: React.ReactNode;
}

const ExpandableGlassItem: React.FC<ExpandableGlassItemProps> = ({ title, icon: Icon, defaultOpen = false, children }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="group relative overflow-hidden transition-all duration-500 mb-4">
            <div className={`absolute inset-0 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl transition-colors ${isOpen ? 'bg-white/10' : 'group-hover:bg-white/10'}`}></div>

            <div className="relative z-10">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="w-full flex items-center justify-between p-6 text-left focus:outline-none"
                >
                    <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-colors ${isOpen ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-white/5 text-slate-400 border-white/10'}`}>
                            <Icon size={24} />
                        </div>
                        <h3 className={`text-xl font-bold tracking-tight transition-colors ${isOpen ? 'text-white' : 'text-slate-200'}`}>
                            {title}
                        </h3>
                    </div>
                    <div className={`p-2 rounded-full transition-all ${isOpen ? 'bg-white/10 text-white rotate-180' : 'text-slate-500 group-hover:text-white'}`}>
                        <ChevronDown size={20} />
                    </div>
                </button>

                <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'}`}
                >
                    <div className="p-6 pt-0 border-t border-white/5">
                        <div className="pt-6 animate-in slide-in-from-top-4 fade-in duration-300">
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const DashboardPage: React.FC<DashboardPageProps> = ({ onNavigate }) => {
    const [showPilotTerminal, setShowPilotTerminal] = useState(false);

    return (
        <div className="min-h-screen p-8 text-white relative">
            {/* Background decoration */}
            <div className="fixed inset-0 bg-[#050A30] -z-10"></div>
            <div className="fixed top-0 right-0 w-[800px] h-[800px] bg-blue-600/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2 -z-10"></div>
            <div className="fixed bottom-0 left-0 w-[600px] h-[600px] bg-indigo-600/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2 -z-10"></div>

            <div className="max-w-4xl mx-auto pb-24">

                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 pt-12">
                    <p className="text-blue-400 font-bold tracking-[0.4em] uppercase text-xs mb-4">Command Center</p>
                    <h1 className="text-5xl md:text-6xl font-serif text-white tracking-tighter mb-6">
                        WingMentor Platform Overview
                    </h1>
                    <div className="inline-flex items-center gap-3 px-4 py-2 bg-white/5 backdrop-blur-md rounded-full border border-white/10">
                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                        <span className="text-xs font-medium text-slate-300 tracking-wide">System Online: 24 active sessions</span>
                    </div>
                </div>

                {/* Menu List */}
                <div className="space-y-6">

                    {/* Pathways Segment */}
                    <ExpandableGlassItem title="Pathways" icon={Globe} defaultOpen={true}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'Emirates ATPL', desc: 'GCAA Theory & Exam Prep', route: 'emirates-atpl-platform', icon: Plane },
                                { title: 'Air Taxi (eVTOL)', desc: 'Urban Air Mobility Ops', route: 'air-taxi-platform', icon: Zap },
                                { title: 'Private Charter', desc: 'VIP & Corporate Ops', route: 'private-charter-platform', icon: Briefcase },
                                { title: 'Piloted Drones', desc: 'Remote & Autonomous Ops', route: 'piloted-drones-platform', icon: Cpu },
                                { title: 'Cargo Transport', desc: 'Global Logistics', route: 'about_programs', icon: Box },
                                { title: 'Flight Instructor', desc: 'Education & Training', route: 'about_programs', icon: Users },
                                { title: 'Seaplane Ops', desc: 'Amphibious Ratings', route: 'about_programs', icon: Activity },
                                { title: 'Aerial Survey', desc: 'Mapping & Agriculture', route: 'about_programs', icon: LayoutGrid },
                            ].map((item, i) => (
                                <div key={i} onClick={() => onNavigate(item.route)} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 hover:border-blue-500/30 transition-all cursor-pointer group/card flex items-start gap-4">
                                    <div className="p-3 bg-blue-500/10 rounded-xl text-blue-400 group-hover/card:bg-blue-500/20 transition-colors">
                                        <item.icon size={20} />
                                    </div>
                                    <div>
                                        <h4 className="text-sm font-bold text-white mb-1 group-hover/card:text-blue-400 transition-colors">{item.title}</h4>
                                        <p className="text-xs text-slate-400">{item.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </ExpandableGlassItem>

                    {/* Programs Segment */}
                    <ExpandableGlassItem title="Programs" icon={BookOpen}>
                        <div className="space-y-4">
                            {[
                                { title: 'Foundational Program', desc: '20HR Guided Mentorship & Profile Build', route: 'foundational-verification', icon: Shield, color: 'blue' },
                                { title: 'Transition Program', desc: 'Airline Interview & EBT/CBTA Prep', route: 'transition-platform', icon: Zap, color: 'indigo' },
                                { title: 'EBT / CBTA Familiarization', desc: 'Competency-Based Training Standards', route: 'ebt-cbta', icon: Activity, color: 'emerald' },
                                { title: 'Airline Expectations', desc: 'Market Standards & Requirements', route: 'airline-expectations', icon: Plane, color: 'sky' },
                            ].map((prog, i) => (
                                <div key={i} onClick={() => onNavigate(prog.route)} className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer group/prog">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-xl bg-${prog.color}-500/10 flex items-center justify-center text-${prog.color}-400`}>
                                            <prog.icon size={20} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-bold text-white">{prog.title}</h4>
                                            <p className="text-xs text-slate-400">{prog.desc}</p>
                                        </div>
                                    </div>
                                    <ExternalLink size={16} className="text-slate-600 group-hover/prog:text-white transition-colors" />
                                </div>
                            ))}
                        </div>
                    </ExpandableGlassItem>

                    {/* Applications Segment */}
                    <ExpandableGlassItem title="Applications" icon={AppWindow}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {[
                                { title: 'W1000 Suite', desc: 'Simulation & Training Tools', route: 'w1000-suite', icon: Box },
                                { title: 'Electronic Flight Bag', desc: 'Pilot Utility Apps', route: 'pilot_apps', icon: Tablet },
                                { title: 'Program Handbook', desc: 'Operational Guidelines', route: 'handbook', icon: BookOpen },
                                { title: 'Airbus Software', desc: 'Fleet Operations Suite', route: 'airbus', icon: LayoutGrid },
                                { title: 'HINFACT CRM', desc: 'Human Factors Analytics', route: 'hinfact', icon: Activity },
                                { title: 'ATLAS CV', desc: 'AI-Optimized Profile', route: 'atlas-cv', icon: FileText },
                            ].map((app, i) => (
                                <div key={i} onClick={() => onNavigate(app.route)} className="p-4 bg-white/5 rounded-2xl border border-white/5 hover:bg-white/10 transition-colors cursor-pointer">
                                    <div className="flex items-center gap-3 mb-2">
                                        <app.icon size={18} className="text-indigo-400" />
                                        <span className="text-sm font-bold text-white">{app.title}</span>
                                    </div>
                                    <p className="text-xs text-slate-400">{app.desc}</p>
                                </div>
                            ))}
                        </div>
                    </ExpandableGlassItem>

                    {/* Systems Segment */}
                    <ExpandableGlassItem title="Systems" icon={Cpu}>
                        <div className="space-y-4">
                            <div className="p-4 bg-white/5 rounded-2xl border border-white/5">
                                <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm font-bold text-white">System Status</span>
                                    <span className="text-xs font-bold text-green-400 animate-pulse">All Systems Operational</span>
                                </div>
                                <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden mb-6">
                                    <div className="w-full h-full bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]"></div>
                                </div>

                                <div className="grid grid-cols-1 gap-3">
                                    <div onClick={() => onNavigate('pilot-recognition')} className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Award size={16} className="text-yellow-400" />
                                            <div>
                                                <span className="text-sm font-bold text-slate-200 block">Pilot Recognition</span>
                                                <span className="text-[10px] text-slate-500">Credibility Verification System</span>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>

                                    <div onClick={() => onNavigate('insights')} className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Globe size={16} className="text-blue-400" />
                                            <div>
                                                <span className="text-sm font-bold text-slate-200 block">Aviation Insights</span>
                                                <span className="text-[10px] text-slate-500">Global Market Intelligence</span>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500"></div>
                                    </div>

                                    <div onClick={() => setShowPilotTerminal(true)} className="p-3 bg-black/20 rounded-xl border border-white/5 hover:border-white/20 transition-all cursor-pointer flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <Terminal size={16} className="text-purple-400" />
                                            <div>
                                                <span className="text-sm font-bold text-slate-200 block">Pilot Terminal</span>
                                                <span className="text-[10px] text-slate-500">AI Agent Communication Network</span>
                                            </div>
                                        </div>
                                        <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </ExpandableGlassItem>

                </div>
            </div>

            {/* Pilot Terminal Modal */}
            {showPilotTerminal && (
                <div className="fixed inset-0 z-50 bg-black bg-opacity-50">
                    <div className="relative h-full">
                        <button 
                            onClick={() => setShowPilotTerminal(false)}
                            className="absolute top-4 right-4 z-10 text-white text-2xl hover:text-gray-300 transition-colors"
                        >
                            ✕
                        </button>
                        <PilotTerminalDashboard />
                    </div>
                </div>
            )}

            <style>{`
                @keyframes scaleUp {
                    from { opacity: 0; transform: translateY(20px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .group {
                    animation: scaleUp 0.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
                }
            `}</style>
        </div>
    );
};
