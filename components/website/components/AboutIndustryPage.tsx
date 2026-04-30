import React from 'react';
import { ArrowLeft, Briefcase, TrendingDown, Database, Users, CheckCircle } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from './RevealOnScroll';

interface AboutIndustryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const AboutIndustryPage: React.FC<AboutIndustryPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            For Airlines & Operators
                        </p>
                        <h1 className="text-4xl md:text-5xl font-serif text-slate-900 leading-tight mb-4">
                            Recruitment Through Competency
                        </h1>
                        <span className="text-xl md:text-2xl text-slate-500 leading-none block mb-8">
                            Pull verified candidates. Reduce training failures. Cut recruitment costs.
                        </span>

                        <div className="max-w-3xl mx-auto text-base text-slate-700 leading-relaxed text-left space-y-6">
                            <p>
                                PilotRecognition provides operators with verified competency data on pilot candidates—not just hours and type ratings. Our EBT CBTA aligned assessment framework maps candidates against the 9 core competencies airlines actually evaluate: situational awareness, decision making, communication, leadership, workload management, procedures, flight path management, knowledge, and automation management.
                            </p>
                            <p>
                                The pulling system replaces push applications. Pilots indicate interest in your pathway; when operators join the platform, they can pull candidates from the database based on verified competency scores, mentorship completion, and EBT assessment data. Every profile updates automatically as pilots log hours, certifications, mentorship progress, and examination results—feeding directly into the competency score operators use to filter candidates.
                            </p>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* The Problem */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Problem
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Current Recruitment Is Broken
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Hours don't indicate competency. Resumes don't update. Training failures are expensive.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {[
                            {
                                icon: <TrendingDown className="w-8 h-8 text-red-600" />,
                                title: "High Training Failure Rates",
                                desc: "Candidates with 2,000 hours fail type rating programs because hours don't measure competency readiness. Each failure costs $15,000–$50,000 in sunk training investment."
                            },
                            {
                                icon: <Briefcase className="w-8 h-8 text-orange-600" />,
                                title: "Static, Unverified Resumes",
                                desc: "CVs are snapshots in time. Flight hours are self-reported. Type ratings don't indicate current proficiency. You hire based on outdated or unverified data."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-slate-600" />,
                                title: "Volume Over Quality",
                                desc: "2,000 applications for 12 positions. Sorting by hours filters out qualified candidates and surfaces unverified ones. Recruitment teams waste time on the wrong profiles."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                    <div className="mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Context Banner */}
            <div className="py-8 px-6 bg-blue-900 text-white">
                <div className="max-w-6xl mx-auto text-center">
                    <RevealOnScroll>
                        <p className="text-lg font-medium">
                            Competency-based assessment reduces training failure rates by identifying candidates who can actually perform, not just candidates who have logged hours.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* The Solution */}
            <div className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Solution
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Pull Verified Candidates
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Verified competencies. Dynamic profiles that update as pilots progress. Competency-based filtering. When operators join, they pull the right candidates—no more sorting through unqualified applications.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        {[
                            {
                                icon: <Database className="w-8 h-8 text-blue-700" />,
                                title: "Dynamic Verified Profiles",
                                desc: "Pilot profiles update as pilots log hours, certifications, mentorship completion, and examination results—all verified and current. No more outdated CVs or self-reported data."
                            },
                            {
                                icon: <CheckCircle className="w-8 h-8 text-blue-700" />,
                                title: "EBT CBTA Verified Competencies",
                                desc: "Candidates are assessed against the 9 EBT CBTA core competencies. You see behavioral markers, cognitive indicators, and competency scores—not just flight hours and type ratings."
                            },
                            {
                                icon: <Users className="w-8 h-8 text-blue-700" />,
                                title: "Pulling System",
                                desc: "Pilots indicate interest in your pathway. Operators pull candidates from the database based on competency scores, verified hours, and assessment data. No more push applications clogging your inbox."
                            },
                            {
                                icon: <Briefcase className="w-8 h-8 text-blue-700" />,
                                title: "Reduced Training Failures",
                                desc: "Filter candidates by competency readiness before investing in type ratings and line training. Know who can perform before you spend $15,000–$50,000 on training."
                            }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                    <div className="mb-4">{item.icon}</div>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">{item.title}</h3>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* Enterprise Pricing */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                Enterprise Access
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Pricing for Operators
                            </h2>
                            <p className="text-slate-600 max-w-2xl mx-auto">
                                Post pathways for free. Pay only when you pull data or hire candidates.
                            </p>
                        </RevealOnScroll>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border border-slate-200">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-slate-500 mb-4">Free</h3>
                                <div className="text-3xl font-bold text-slate-900 mb-6">$0</div>
                                <p className="text-sm text-slate-500 mb-4">See the quality. Upgrade when you're ready.</p>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Post up to 3 pathways
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        View 20 pilot profiles/month
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Basic filtering (hours, license)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Standard support
                                    </li>
                                </ul>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border-2 border-blue-200 shadow-xl">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-600 mb-4">Growth</h3>
                                <div className="text-3xl font-bold text-slate-900 mb-2">$499<span className="text-lg font-normal text-slate-500">/month</span></div>
                                <p className="text-sm text-slate-500 mb-6">For operators hiring 2-5 pilots/year</p>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Unlimited pathways
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        200 profile views/month
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Advanced competency filtering
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        EBT video assessment access
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Priority matching
                                    </li>
                                </ul>
                            </div>
                        </RevealOnScroll>

                        <RevealOnScroll>
                            <div className="bg-white p-8 rounded-2xl border-2 border-blue-900 shadow-xl">
                                <h3 className="text-sm font-bold tracking-[0.2em] uppercase text-blue-900 mb-4">Enterprise</h3>
                                <div className="text-3xl font-bold text-slate-900 mb-2">$1,000<span className="text-lg font-normal text-slate-500">/month</span></div>
                                <p className="text-sm text-slate-500 mb-6">+$500 per hire. Capped at $5,000/month.</p>
                                <ul className="space-y-3 text-sm text-slate-600">
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Unlimited everything
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Pull API access
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Dedicated account manager
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        Custom integration support
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <CheckCircle className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                                        White-glove onboarding
                                    </li>
                                </ul>
                            </div>
                        </RevealOnScroll>
                    </div>

                    <div className="text-center mt-8">
                        <p className="text-sm text-slate-500 max-w-2xl mx-auto">
                            Free tier shows you the pilot quality. Growth tier gives you volume. Enterprise gives you integration. Success fee capped at $5,000/month—predictable costs even at scale.
                        </p>
                    </div>
                </div>
            </div>

            {/* ROI Section */}
            <div className="py-16 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">
                                The Economics
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-4">
                                Return on Investment
                            </h2>
                        </RevealOnScroll>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 text-center">
                        {[
                            { value: "$15K–$50K", label: "Industry training failure cost per candidate", desc: "Based on industry estimates for type rating and line training failures. Competency filtering identifies ready candidates before training investment." },
                            { value: "2,000→12", label: "Typical applications to positions ratio", desc: "Industry data shows overwhelming application volumes. The pulling system delivers pre-qualified candidates based on verified competencies." },
                            { value: "3x", label: "Projected screening efficiency", desc: "Competency scores replace manual resume review. Projected to reduce screening time from weeks to minutes once operator volume is established." }
                        ].map((item, idx) => (
                            <RevealOnScroll key={idx}>
                                <div className="bg-slate-50 p-8 rounded-2xl border border-slate-100">
                                    <div className="text-3xl md:text-4xl font-bold text-blue-700 mb-2">{item.value}</div>
                                    <div className="text-sm font-bold text-slate-900 mb-2">{item.label}</div>
                                    <p className="text-slate-600 text-sm leading-relaxed">{item.desc}</p>
                                </div>
                            </RevealOnScroll>
                        ))}
                    </div>
                </div>
            </div>

            {/* How It Works */}
            <div className="py-16 px-6 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-2">How It Works</p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900">Three Steps to Better Recruitment</h2>
                        </RevealOnScroll>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Briefcase className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">01</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Post Your Pathway</h3>
                            <p className="text-slate-600">List your requirements. Define the competencies, hours, and certifications you need. Pilots indicate interest.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <Database className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">02</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Pull Verified Profiles</h3>
                            <p className="text-slate-600">Access verified profiles with competencies, EBT scores, mentorship completion, and current certifications that update automatically.</p>
                        </div>
                        <div className="text-center">
                            <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="w-10 h-10 text-blue-700" />
                            </div>
                            <div className="text-4xl font-bold text-slate-900 mb-2">03</div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Hire With Confidence</h3>
                            <p className="text-slate-600">Make hiring decisions based on verified competency data, not just hours. Reduce training failures.</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* CTA */}
            <div className="py-16 px-6 bg-blue-900 text-white text-center">
                <div className="max-w-3xl mx-auto">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-serif mb-4">Start Pulling Verified Candidates</h2>
                        <p className="text-blue-200 mb-8">
                            Post your pathway for free. Upgrade to Enterprise when you're ready to pull verified competency data.
                        </p>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button
                                onClick={() => onNavigate('contact-support')}
                                className="px-8 py-4 bg-white text-blue-900 font-bold rounded-xl hover:bg-blue-50 transition-all shadow-xl"
                            >
                                Contact Enterprise Sales
                            </button>
                            <button
                                onClick={() => onNavigate('about')}
                                className="px-8 py-4 border-2 border-white text-white font-bold rounded-xl hover:bg-white/10 transition-all"
                            >
                                View Pilot-Facing Platform
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Back button */}
            <div className="py-12 flex justify-center bg-white">
                <button
                    onClick={onBack}
                    className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white font-bold rounded-xl hover:scale-105 transition-all shadow-xl"
                >
                    <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </button>
            </div>
        </div>
    );
};
