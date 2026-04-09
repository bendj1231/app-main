import React from 'react';
import { ArrowLeft, CheckCircle2, Cloud, Target, Shield, Users, Heart, Eye, Scale, Zap } from 'lucide-react';
import { TopNavbar } from './TopNavbar';

interface MissionVisionValuesProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const MissionVisionValues: React.FC<MissionVisionValuesProps> = ({ onBack, onNavigate, onLogin }) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} />
            {/* Header / Intro */}
            <div className="bg-slate-50 border-b border-slate-100 pt-32 pb-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <button
                        onClick={onBack}
                        className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-12 font-medium"
                    >
                        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                        Back to Home
                    </button>
                    <h1 className="text-5xl md:text-7xl font-light tracking-tight text-slate-300 mb-4">
                        Mission, Vision, And Values
                    </h1>
                </div>
            </div>

            {/* Core Content: Mission, Vision, Values */}
            <div className="py-24 px-6 max-w-6xl mx-auto">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
                    <div className="space-y-16">
                        {/* Our Mission */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Target className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold tracking-tight">Our Mission</h2>
                            </div>
                            <p className="text-lg leading-relaxed text-slate-600">
                                In the interest of public safety and in collaboration with all stakeholders, the College will oversee, maintain the calibre of, and advocate for, all Professional Pilots in Canada.
                            </p>
                        </div>

                        {/* Our Vision */}
                        <div>
                            <div className="flex items-center gap-3 mb-6">
                                <Eye className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold tracking-tight">Our Vision</h2>
                            </div>
                            <p className="text-lg leading-relaxed text-slate-600">
                                The College of Professional Pilots of Canada will be recognized world-wide for the promotion of safety, professionalism, and mentorship for all pilots in Canada.
                            </p>
                        </div>

                        {/* Our Values */}
                        <div>
                            <div className="flex items-center gap-3 mb-8">
                                <Heart className="w-6 h-6 text-blue-600" />
                                <h2 className="text-2xl font-bold tracking-tight">Our Values</h2>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                {[
                                    { name: "Safety", icon: Shield },
                                    { name: "Professionalism", icon: CheckCircle2 },
                                    { name: "Stewardship", icon: Scale },
                                    { name: "Advocacy", icon: Zap },
                                    { name: "Belonging", icon: Users },
                                    { name: "Transparency", icon: Eye },
                                    { name: "Democratic process", icon: Scale },
                                    { name: "Continuous improvement", icon: Zap }
                                ].map((value, i) => (
                                    <div key={i} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                                        <value.icon className="w-4 h-4 text-slate-400" />
                                        <span className="font-medium text-slate-700">{value.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Image Column */}
                    <div className="relative group">
                        <div className="absolute -inset-4 bg-slate-100 rounded-3xl -rotate-2 group-hover:rotate-0 transition-transform duration-500"></div>
                        <div className="relative aspect-square overflow-hidden rounded-2xl shadow-2xl">
                            <img
                                src="https://images.unsplash.com/photo-1540339832862-4745a9805ad3?auto=format&fit=crop&q=80&w=1200"
                                alt="Cockpit View"
                                className="w-full h-full object-cover transform hover:scale-105 transition-transform duration-700"
                            />
                            <div className="absolute inset-0 bg-blue-900/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                        </div>
                        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-white p-4 rounded-2xl shadow-xl hidden md:block">
                            <div className="w-full h-full rounded-xl bg-slate-100 flex items-center justify-center">
                                <Cloud className="w-12 h-12 text-slate-300" />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Shield Icon Separator */}
            <div className="flex justify-center py-12">
                <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center shadow-lg">
                    <Shield className="w-6 h-6 text-white" />
                </div>
            </div>

            {/* Initiatives Timeline */}
            <div className="py-24 px-6 bg-slate-50">
                <div className="max-w-4xl mx-auto">
                    <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-center mb-16">
                        Proposed Timeline Of Major Initiatives
                    </h2>

                    <div className="space-y-12">
                        {/* Near Term */}
                        <div className="relative pl-8 border-l-2 border-blue-200">
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-500 shadow-[0_0_0_4px_white]"></div>
                            <h3 className="text-xl font-bold mb-6 text-blue-900 uppercase tracking-wider">Near Term Items (Achievable In 2023)</h3>
                            <ul className="space-y-4">
                                {[
                                    "Recruiting and communicating the vision (ongoing)",
                                    "Creating opportunities between mentors and proteges (ongoing)",
                                    "Initiate insurance plans for members (done)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Medium Term */}
                        <div className="relative pl-8 border-l-2 border-blue-200">
                            <div className="absolute left-[-9px] top-0 w-4 h-4 rounded-full bg-blue-900 shadow-[0_0_0_4px_white]"></div>
                            <h3 className="text-xl font-bold mb-6 text-blue-900 uppercase tracking-wider">Medium Term Items (2024-2026)</h3>
                            <ul className="space-y-4">
                                {[
                                    "Refine the vision to fit members' vision for the College (ongoing through survey)",
                                    "Add content around the reference material and best practice models below (ongoing)",
                                    "Reinforce credibility through our Communications and Advocacy (ongoing)",
                                    "Explore scholarship and bursary opportunities for fledgling pilots (underway)"
                                ].map((item, i) => (
                                    <li key={i} className="flex items-start gap-3 text-slate-600">
                                        <div className="w-1.5 h-1.5 rounded-full bg-slate-300 mt-2.5"></div>
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Operational Scope */}
            <div className="py-24 px-6 max-w-4xl mx-auto">
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-8">
                    Potential Operational Scope
                </h2>
                <div className="prose prose-slate lg:prose-lg max-w-none text-slate-600">
                    <p className="mb-10 text-lg leading-relaxed">
                        The College supports a balanced approach of appropriate performance-based measures in conjunction with prescriptive based regulations. The College intends to create opportunities for industry experts to share their knowledge and experiences with the express goal of creating best practice models and reference material pertaining to:
                    </p>
                    <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 mb-12 list-none p-0">
                        {[
                            "Advances in flight training techniques, case resumes management, threat and error management, simulation technology and aircraft in-flight instruction.",
                            "Programs for alcohol and substance abuse, critical incident response protocols, and mental health support.",
                            "Maintenance of professional standards through education and effective mentoring & role-modeling.",
                            "Financial aid, scholarships, bursaries and promotional efforts to encourage new aviation professionals."
                        ].map((item, i) => (
                            <li key={i} className="m-0 flex items-start gap-3 bg-slate-50 p-6 rounded-2xl border border-slate-100">
                                <div className="w-6 h-6 flex-shrink-0 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                                    {i + 1}
                                </div>
                                <span className="text-sm leading-relaxed">{item}</span>
                            </li>
                        ))}
                    </ul>
                    <p className="mb-6">
                        The College is also working to establish a comprehensive, completely transportable group insurance plan that all members can access.
                    </p>
                    <p>
                        As can be viewed through visiting the pages of this website, some aspects of the project are established or underway and others remains to be initiated. You can help by joining the effort; first by becoming a member and then by volunteering your time.
                    </p>
                </div>
            </div>

            {/* Mini Footer / Call to Action */}
            <div className="py-24 px-6 bg-slate-900 text-white text-center relative overflow-hidden">
                <div className="absolute inset-0 opacity-20">
                    <img
                        src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?auto=format&fit=crop&q=80&w=2000"
                        alt="Aircraft Background"
                        className="w-full h-full object-cover"
                    />
                </div>
                <div className="relative z-10 max-w-2xl mx-auto">
                    <h2 className="text-3xl font-bold mb-6">Shape the Future Together</h2>
                    <p className="text-slate-400 mb-10">
                        Join an elite network of professional pilots committed to excellence, safety, and industry leadership.
                    </p>
                    <button
                        onClick={() => window.scrollTo(0, 0)}
                        className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all hover:scale-105"
                    >
                        Apply for Membership
                    </button>
                    <div className="mt-12 pt-12 border-t border-white/10 flex justify-center gap-6">
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="text-sm font-bold">fb</span>
                        </div>
                        <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-white/10 transition-colors cursor-pointer">
                            <span className="text-sm font-bold">tw</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
