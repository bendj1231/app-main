import React from 'react';
import { Shield, Globe, Plane, Zap, Briefcase, Anchor, GraduationCap, HardHat, Settings, LineChart, ChevronRight, BarChart3, Search, Lightbulb } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface AviationInsightsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AviationInsightsDirectoryPage: React.FC<AviationInsightsPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const sectorInsights = [
        {
            title: "Airline Expectations",
            desc: "Understand the cultural and operational benchmarks set by flagship carriers like Delta, Emirates, and British Airways.",
            target: "airline-expectations",
            icon: Globe,
            color: "text-blue-600",
            bg: "bg-blue-50"
        },
        {
            title: "Corporate & VIP Jet",
            desc: "Elite service standards and global mission profiles for private flight departments and business aviation.",
            target: "insights",
            icon: Briefcase,
            color: "text-amber-600",
            bg: "bg-amber-50"
        },
        {
            title: "UAM & Air Taxis",
            desc: "Deep dives into Urban Air Mobility, battery technology, and vertical infrastructure navigation.",
            target: "emerging-air-taxi",
            icon: Zap,
            color: "text-purple-600",
            bg: "bg-purple-50"
        },
        {
            title: "Global Cargo Logistics",
            desc: "Analyzing the feeder network and automation trends within global air freight and supply chains.",
            target: "insights",
            icon: BoxIcon,
            color: "text-zinc-600",
            bg: "bg-zinc-50"
        }
    ];

    const operationalIntelligence = [
        {
            title: "Float & Amphibious Ops",
            desc: "Mastering water runways, tidal navigation, and corrosion management for specialized seaplane operations.",
            target: "insights",
            icon: Anchor,
            color: "text-cyan-600",
            bg: "bg-cyan-50"
        },
        {
            title: "Flight Instruction",
            desc: "Strategic guidance for marketing flight schools and mastering student psychology in professional training.",
            target: "insights",
            icon: GraduationCap,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "Specialized Aerial Work",
            desc: "Protocols and requirements for aerial firefighting, search & rescue, and external load operations.",
            target: "insights",
            icon: HardHat,
            color: "text-orange-600",
            bg: "bg-orange-50"
        }
    ];

    const innovationOwnership = [
        {
            title: "Aircraft Management",
            desc: "Strategic oversight on registration options, maintenance costs, and hangarage for owners and operators.",
            target: "insights",
            icon: Settings,
            color: "text-slate-600",
            bg: "bg-slate-50"
        },
        {
            title: "Precision Agriculture",
            desc: "Exploring hyperspectral imaging and crop yield analysis using next-gen aerial surveying tools.",
            target: "insights",
            icon: BarChart3,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-6"
                        />
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Intelligence
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Aviation Insights
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            Industry intelligence curated for the modern aviator. Navigate entry requirements,
                            operational standards, and future innovations across the global aerospace sector.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Sector Insights Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <Search className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-serif text-slate-900">Sector Insights</h2>
                    </div>
                    <div className="w-20 h-1 bg-blue-600"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {sectorInsights.map((item, idx) => (
                        <InsightCard key={idx} {...item} onClick={() => onNavigate(item.target)} />
                    ))}
                </div>
            </div>

            {/* Operational Intelligence (Dark) */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <Lightbulb className="w-6 h-6 text-blue-400" />
                            <h2 className="text-3xl font-serif text-white text-left">Operational Intelligence</h2>
                        </div>
                        <div className="w-20 h-1 bg-blue-500"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {operationalIntelligence.map((item, idx) => (
                            <div
                                key={idx}
                                onClick={() => onNavigate(item.target)}
                                className="group bg-white/5 backdrop-blur-sm border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all cursor-pointer"
                            >
                                <div className={`w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6 text-white group-hover:scale-110 transition-transform`}>
                                    <item.icon className="w-7 h-7" />
                                </div>
                                <h3 className="text-xl font-bold mb-4 font-sans text-left">{item.title}</h3>
                                <p className="text-slate-400 text-sm leading-relaxed mb-6 font-sans text-left">{item.desc}</p>
                                <div className="flex items-center text-blue-400 text-sm font-bold uppercase tracking-widest gap-2 font-sans">
                                    View Report <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Innovation & Ownership Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <LineChart className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-serif text-slate-900">Innovation & Ownership</h2>
                    </div>
                    <div className="w-20 h-1 bg-blue-600"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {innovationOwnership.map((item, idx) => (
                        <InsightCard key={idx} {...item} onClick={() => onNavigate(item.target)} />
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Contribute to the Archive?</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">Are you an industry veteran with insights to share? Join our stewardship board and help guide the next generation of aviators.</p>
                    <button
                        onClick={() => onNavigate('contact-support')}
                        className="bg-slate-900 hover:bg-black text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-slate-500/20 font-sans"
                    >
                        Contact Stewardship Board
                    </button>
                </div>
            </div>
        </div>
    );
};

const InsightCard = ({ title, desc, icon: Icon, color, bg, onClick }: any) => (
    <div
        onClick={onClick}
        className="group bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer flex flex-col"
    >
        <div className={`w-14 h-14 rounded-2xl ${bg} flex items-center justify-center mb-6 ${color} group-hover:rotate-6 transition-all`}>
            <Icon className="w-7 h-7" />
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-4 font-sans text-left">{title}</h3>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans flex-grow text-left">{desc}</p>
        <div className={`flex items-center ${color} text-sm font-bold uppercase tracking-widest gap-2 font-sans`}>
            Explore Report <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </div>
    </div>
);

const BoxIcon = ({ className }: { className?: string }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16Z" />
        <path d="m3.3 7 8.7 5 8.7-5" />
        <path d="M12 22V12" />
    </svg>
);
