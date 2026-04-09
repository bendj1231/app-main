import React from 'react';
import { Shield, Sparkles, Users, Globe, Award, Heart, MessageSquare, Zap, ChevronRight, CheckCircle2, Star, CreditCard } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface MembershipDirectoryPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const MembershipDirectoryPage: React.FC<MembershipDirectoryPageProps> = ({
    onBack,
    onNavigate,
    onLogin
}) => {
    const membershipTiers = [
        {
            title: "Free Forever Tier",
            desc: "Start your professional journey with basic profile verification and access to the public community archive.",
            target: "contact-support",
            icon: Shield,
            color: "text-slate-600",
            bg: "bg-slate-50",
            features: ["Personalized Pilot Profile", "Community Access", "Public Insight Newsletters"]
        },
        {
            title: "Foundational Member",
            desc: "Our core membership tier. Unlock full ecosystem tools, the W1000 suite, and direct mentorship pathways.",
            target: "become-member",
            icon: Zap,
            color: "text-blue-600",
            bg: "bg-blue-50",
            features: ["W1000 Suite Access", "Verified Pilot Badge", "Direct Mentorship"]
        },
        {
            title: "Executive Stewardship",
            desc: "For industry veterans and transition-ready pilots. Includes broker network entry and advisory council access.",
            target: "become-member",
            icon: Star,
            color: "text-amber-600",
            bg: "bg-amber-50",
            features: ["Broker Network Access", "Stewardship Voting", "Priority ATPL Placement"]
        }
    ];

    const communityBenefits = [
        {
            title: "Verified Pilot Registry",
            desc: "Stand out to recruiters with a verified background and credibility scoring recognized globally.",
            target: "membership-benefits",
            icon: Award,
            color: "text-indigo-600",
            bg: "bg-indigo-50"
        },
        {
            title: "The Broker Network",
            desc: "Direct visibility to private jet operators and global head of training departments.",
            target: "membership-benefits",
            icon: Globe,
            color: "text-emerald-600",
            bg: "bg-emerald-50"
        },
        {
            title: "Ecosystem Integration",
            desc: "Seamlessly link your flight logs, analytics, and performance data with airline-ready standards.",
            target: "membership-benefits",
            icon: Sparkles,
            color: "text-purple-600",
            bg: "bg-purple-50"
        }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section - matching AboutPage style */}
            <div className="pt-32 pb-12 px-6">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <img
                            src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                            alt="WingMentor Logo"
                            className="mx-auto w-64 h-auto object-contain mb-2"
                        />
                        <p className="text-sm font-bold tracking-[0.3em] uppercase text-blue-700 mb-4">
                            Strategic Stewardship
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Join the Network
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed">
                            Whether you are a student pilot starting out or a seasoned instructor transitioning
                            to the jet environment, there is a verified place for you within our global stewardship.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Membership Tiers Section */}
            <div className="py-24 px-6 max-w-7xl mx-auto">
                <div className="mb-16">
                    <div className="flex items-center gap-4 mb-4">
                        <CreditCard className="w-6 h-6 text-blue-600" />
                        <h2 className="text-3xl font-serif text-slate-900">Membership Tiers</h2>
                    </div>
                    <div className="w-20 h-1 bg-blue-600"></div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {membershipTiers.map((tier, idx) => (
                        <div
                            key={idx}
                            onClick={() => onNavigate(tier.target)}
                            className="group bg-white border border-slate-200 p-8 rounded-3xl hover:shadow-2xl hover:border-blue-200 transition-all cursor-pointer flex flex-col"
                        >
                            <div className={`w-14 h-14 rounded-2xl ${tier.bg} flex items-center justify-center mb-6 ${tier.color} group-hover:rotate-6 transition-all`}>
                                <tier.icon className="w-7 h-7" />
                            </div>
                            <h3 className="text-2xl font-bold text-slate-900 mb-4 font-sans">{tier.title}</h3>
                            <p className="text-slate-600 text-sm leading-relaxed mb-6 font-sans flex-grow">{tier.desc}</p>

                            <ul className="space-y-3 mb-8">
                                {tier.features.map((feature, fidx) => (
                                    <li key={fidx} className="flex items-center gap-2 text-sm text-slate-700 font-sans">
                                        <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <div className={`flex items-center ${tier.color} text-sm font-bold uppercase tracking-widest gap-2 font-sans`}>
                                Choose tier <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Benefits Highlight (Dark) */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-16">
                        <div className="flex items-center gap-4 mb-4">
                            <Sparkles className="w-6 h-6 text-blue-400" />
                            <h2 className="text-3xl font-serif text-white">Community & Network</h2>
                        </div>
                        <div className="w-20 h-1 bg-blue-500"></div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {communityBenefits.map((item, idx) => (
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
                                    Learn More <ChevronRight className="w-4 h-4" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Support CTA */}
            <div className="py-24 px-6 bg-white border-t border-slate-100">
                <div className="max-w-4xl mx-auto text-center">
                    <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm">
                        <MessageSquare className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 font-sans">Have Questions?</h2>
                    <p className="text-lg text-slate-600 mb-10 font-sans">Our team is available to help you choose the right tier for your career goals. Reach out for a consultation.</p>
                    <button
                        onClick={() => onNavigate('contact-support')}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                    >
                        Talk to an Advisor
                    </button>
                </div>
            </div>
        </div>
    );
};
