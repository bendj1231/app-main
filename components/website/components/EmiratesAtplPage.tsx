import React from 'react';
import { ArrowLeft, Rocket, Shield, Award, Zap, CheckCircle2, ChevronRight, GraduationCap, Users, Target, Globe, BookOpen } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface EmiratesAtplPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const EmiratesAtplPage: React.FC<EmiratesAtplPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const pathwayFeatures = [
        {
            title: "Global Strategic Positioning",
            desc: "Passing GCAA exams in the UAE clears the hardest conversion hurdle for international pilots seeking GCC roles.",
            icon: Globe,
            bullets: ["Regional Authority", "Conversion Advantage", "UAE Ready"]
        },
        {
            title: "Frozen ATPL Credits",
            desc: "Credits that signal to airlines worldwide that you can handle rigorous, international-standard theoretical training.",
            icon: Award,
            bullets: ["Emirates Standard", "Worldwide Trust", "Career Utility"]
        },
        {
            title: "Accelerated Earning Power",
            desc: "Theory completed early ensures you move faster through seniority lists and command upgrades when hours are met.",
            icon: TrendingUp => <Zap className="w-7 h-7 text-blue-600 group-hover:text-white" />,
            bullets: ["Command Track", "Seniority Advantage", "Faster ROI"]
        },
        {
            title: "Gold-Standard Delivery",
            desc: "Powered by Fujairah Aviation Academy and Bristol Ground School, the global benchmark for ATPL materials.",
            icon: BookOpen,
            bullets: ["Bristol Materials", "FAA/GCAA Audit", "Security Cleared"]
        }
    ];

    const pipelineSteps = [
        { title: "Theory Enrollment", value: "Secure your place in the Fujairah Aviation Academy (approx. AED 18,000).", icon: CheckCircle2 },
        { title: "Material Mastery", value: "Study using the premium Bristol Ground School distance-learning system.", icon: BookOpen },
        { title: "GCAA Assessment", value: "Sit and pass the official UAE GCAA theoretical exams in person.", icon: Shield },
        { title: "Global Recognition", value: "Earn theoretical credits benchmarked against Emirates hiring standards.", icon: Globe }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <Rocket className="w-12 h-12 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            Global GCAA Theoretical Credits
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Emirates <br />ATPL Pathway
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            A strategic theoretical upgrade for pilots worldwide. Secure the GCAA ATPL credits
                            recognized by regulators and airlines as the global benchmark for professional excellence.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Core Features Grid */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {pathwayFeatures.map((item, idx) => (
                        <div key={idx} className="p-10 bg-white border border-slate-200 rounded-[2.5rem] hover:shadow-2xl transition-all group flex flex-col items-start">
                            <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center mb-8 group-hover:bg-blue-600 group-hover:scale-110 transition-all">
                                {typeof item.icon === 'function' ? item.icon({}) : <item.icon className="w-7 h-7 text-blue-600 group-hover:text-white transition-colors" />}
                            </div>
                            <h3 className="text-2xl font-serif text-slate-900 mb-4">{item.title}</h3>
                            <p className="text-slate-600 mb-8 leading-relaxed text-sm font-sans">{item.desc}</p>
                            <div className="space-y-3 mt-auto w-full">
                                {item.bullets.map((bullet, i) => (
                                    <div key={i} className="flex items-center gap-2 text-xs font-bold text-slate-400 tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                        {bullet}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Cinematic Section (Dark) */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <RevealOnScroll>
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">UAE Strategic Hurdle</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    Theory First: Clearing <br />the GCC Hurdle
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "A CPL alone keeps you competing in local markets. GCAA ATPL theoretical credits globalize your profile."
                                </p>
                                <p className="text-base text-slate-400 leading-relaxed mb-8 font-sans">
                                    Because many regional licenses cannot be directly converted, passing GCAA exams early is the
                                    ultimate differentiator. WingMentor and Fujairah Aviation Academy provide the infrastructure
                                    to secure these credits while you continue your training or work abroad.
                                </p>
                                <div className="space-y-4">
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">Bristol Ground School Material Access</span>
                                    </div>
                                    <div className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                                        <span className="text-slate-300 text-sm font-sans">UAE Security Clearance Support</span>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-square bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl relative">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1Ars9ou0JcoloGv-W18gvJ1G0eWrdFNAu"
                                    alt="Global ATPL Pathways"
                                    className="w-full h-full object-cover opacity-80"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Globe className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-200 tracking-wider uppercase">Region</p>
                                            <p className="text-white font-bold">UAE / Global Credits</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Pathway Pipeline */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Pathway Pipeline</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {pipelineSteps.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group relative">
                            <div className="absolute top-6 right-8 font-serif text-4xl text-slate-200 group-hover:text-blue-50 transition-colors">0{idx + 1}</div>
                            <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 uppercase tracking-widest">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6 leading-tight">Secure Your Global Future</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto">
                            Don't wait for your license to expire or your local market to saturate. Clear the GCAA
                            theoretical hurdles today and globalize your career recognition.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Enroll in Pathway
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Return to Insight
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
