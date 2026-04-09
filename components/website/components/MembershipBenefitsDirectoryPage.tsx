import React from 'react';
import { ArrowLeft, Star, Shield, Network, Zap, CheckCircle2, ChevronRight, Globe, Lock, UserCheck, Briefcase, Award, Users } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';

interface MembershipBenefitsPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const MembershipBenefitsPage: React.FC<MembershipBenefitsPageProps> = ({ onBack, onNavigate, onLogin }) => {
    const mainBenefits = [
        {
            title: "Broker Network Access",
            desc: "Direct visibility to private jet owners, aircraft brokers, and executive flight departments worldwide.",
            icon: Network,
            bullets: ["Priority Recruitment", "Global Job Feed", "Direct Messaging"]
        },
        {
            title: "Verified Pilot Badge",
            desc: "A digital seal of credibility representing your verified background, training, and competency standards.",
            icon: Award,
            bullets: ["Blockchain Verified", "Recruiter Trust", "Profile Distinction"]
        },
        {
            title: "Ecosystem Integration",
            desc: "Full access to the W1000 Suite, including the Black Box logbook and Examination Terminal.",
            icon: Zap,
            bullets: ["W1000 Access", "Data Connectivity", "AI CV Formatting"]
        },
        {
            title: "Industry Advocacy",
            desc: "We speak for the pilot. Benefit from our direct relations with airlines, manufacturers, and regulators.",
            icon: Shield,
            bullets: ["Policy Influence", "Group Representation", "Legal Guidance"]
        }
    ];

    const professionalGrowth = [
        { title: "Mentorship", value: "Connect with seasoned captains and industry veterans for career guidance.", icon: UserCheck },
        { title: "GCAA/EASA Links", value: "Direct pathways for licensing and conversion in key global markets.", icon: Globe },
        { title: "VIP Networking", value: "Exclusive entry into the high-net-worth corporate aviation community.", icon: Briefcase },
        { title: "Career Security", value: "Proactive monitoring of industry trends to keep your career ahead.", icon: Lock }
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
                            Programs | Specializations | Pathways
                        </p>
                        <h1 className="text-4xl md:text-6xl font-serif text-slate-900 leading-tight mb-6">
                            Join the Network
                        </h1>
                        <p className="max-w-3xl mx-auto text-base md:text-lg text-slate-700 leading-relaxed font-sans">
                            WingMentor is more than a platform—it's a professional pilot network designed to
                            enhance your credibility, automate your compliance, and accelerate your pathway into the global flight deck.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Magazine-style content rows */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">
                {/* Row 1: Programs (Text left, image right) */}
                <div className="flex flex-col md:flex-row items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                                Strategic Programs
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                From Foundational Standards to Type Familiarization
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                                Our mentoring tracks are divided into strategic tiers designed to meet the evolving demands of the aviation industry.
                                We take pilots beyond the license, focusing on the Evidence-Based Training (EBT) and Competency-Based Training & Assessment (CBTA)
                                frameworks used by major manufacturers and airlines.
                            </p>
                            <div className="grid grid-cols-1 gap-6">
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-2">Foundational Tier</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">High-impact recognition for Leadership, CRM, and Flight Instructor Readiness, establishing a verified baseline for recruitment.</p>
                                </div>
                                <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                                    <h4 className="font-bold text-slate-900 uppercase tracking-widest text-sm mb-2">Transition Tier</h4>
                                    <p className="text-slate-600 text-sm leading-relaxed">Advanced EBT familiarization, aligning your performance metrics to the global standards demanded by Airbus and Boeing operators.</p>
                                </div>
                            </div>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll delay={200}>
                            <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[2rem]">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1K2CccSObEUsvy6unD8iqWjSjn-Zcw08g"
                                    alt="WingMentor Programs"
                                    className="w-full h-auto rounded-[2rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>

                {/* Row 2: Pathways (Image left, text right) */}
                <div className="flex flex-col md:flex-row-reverse items-center gap-10 md:gap-16">
                    <div className="md:w-1/2">
                        <RevealOnScroll>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">
                                Global Pathways
                            </p>
                            <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                Direct-to-Industry <br />Placement & Scouting
                            </h2>
                            <p className="text-base text-slate-700 leading-relaxed mb-8 font-sans">
                                We bridge the "Experience Gap" by facilitating transitions across Commercial Airlines, Corporate VIP sectors,
                                and the emerging Air Taxi (eVTOL) industry. Our network allows manufacturers and fleet managers to scout
                                pilots based on verified competency data rather than just raw hour counts.
                            </p>
                            <div className="space-y-4">
                                {[
                                    { icon: Globe, title: "Universal Mobility", text: "Verified credentials recognized by GCAA, FAA, and EASA operators." },
                                    { icon: Users, title: "Scouted Recruitment", text: "Be seen by brokers and recruiters in the hidden VIP job market." }
                                ].map((item, i) => (
                                    <div key={i} className="flex gap-4 items-start">
                                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center shrink-0">
                                            <item.icon className="w-5 h-5 text-blue-600" />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-slate-900 text-sm">{item.title}</h4>
                                            <p className="text-slate-600 text-sm leading-relaxed">{item.text}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </RevealOnScroll>
                    </div>
                    <div className="md:w-1/2">
                        <RevealOnScroll delay={200}>
                            <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[2rem]">
                                <img
                                    src="https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?q=80&w=2940&auto-format&fit=crop"
                                    alt="Pilot Pathways"
                                    className="w-full h-auto rounded-[2rem] shadow-2xl transition-all duration-700 group-hover:scale-[1.02]"
                                />
                            </div>
                        </RevealOnScroll>
                    </div>
                </div>
            </div>

            {/* ATLAS CV & Recognition Section */}
            <div className="py-24 px-6 bg-[#050A30] text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <RevealOnScroll>
                                <div className="inline-flex items-center gap-2 px-3 py-1 bg-blue-400/10 rounded-full border border-blue-400/20 mb-6">
                                    <Shield className="w-3 h-3 text-blue-400" />
                                    <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Industry Standard</span>
                                </div>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    The ATLAS-Compliant <br />AI CV & Recognition
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans">
                                    Standard resumes fail modern AI screening. We help you build an <strong className="text-white">ATLAS-Compliant Profile</strong>
                                    specifically optimized for airline internal scanners and manufacturer assessment protocols.
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        <Award className="w-6 h-6 text-blue-400 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-white text-base mb-1">Pilot Recognition System</h4>
                                            <p className="text-slate-300 text-sm font-sans leading-relaxed">
                                                Our scoring system translates your training performance into verifiable data markers that recruiters actually use to filter candidates.
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        <Zap className="w-6 h-6 text-blue-400 shrink-0" />
                                        <div>
                                            <h4 className="font-bold text-white text-base mb-1">Automated Compliance</h4>
                                            <p className="text-slate-300 text-sm font-sans leading-relaxed">
                                                Your W1000 flight data and program completions automatically sync with your profile, keeping your career status "ready for hire" 24/7.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <RevealOnScroll delay={200}>
                                <div className="aspect-[4/5] bg-slate-900 rounded-[3rem] overflow-hidden shadow-2xl border border-white/10 relative group">
                                    <img
                                        src="https://lh3.googleusercontent.com/d/1waom5qY_plA5lA_gWvhlQOx0A8_YcPpg"
                                        alt="ATLAS System Overview"
                                        className="w-full h-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-105"
                                    />
                                    <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                                    <div className="absolute inset-0 flex items-center justify-center p-12">
                                        <div className="p-8 bg-black/40 backdrop-blur-xl border border-white/10 rounded-3xl text-center">
                                            <img src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR" alt="Logo" className="w-20 mx-auto mb-4 opacity-50" />
                                            <p className="text-blue-400 font-bold uppercase tracking-[0.3em] text-[10px] mb-2">Verified Profile</p>
                                            <p className="text-white font-serif text-2xl">ATLAS COMPLIANT</p>
                                        </div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                </div>
            </div>

            {/* Benefits Comparison Table */}
            <div className="py-24 px-6 max-w-6xl mx-auto">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-4">Program Comparative Overview</p>
                    <h2 className="text-3xl md:text-5xl font-serif text-slate-900">Curriculum & Access</h2>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="border-b border-slate-100">
                                <th className="py-8 px-6 text-left text-xs font-bold uppercase tracking-widest text-slate-400 w-1/3">Professional Access</th>
                                <th className="py-8 px-6 text-center text-xs font-bold uppercase tracking-widest text-slate-900 w-1/3">Foundation Program</th>
                                <th className="py-8 px-6 text-center text-xs font-bold uppercase tracking-widest text-blue-700 w-1/3 bg-blue-50/50 rounded-t-3xl">Transition Program</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm">
                            {[
                                {
                                    label: "W1000 Suite & 50hr Certification",
                                    foundation: true,
                                    transition: true,
                                    pillar: "Accredited Experience",
                                    detail: "Core systems engineering & foundational certification"
                                },
                                {
                                    label: "Foundational Knowledge Examination",
                                    foundation: true,
                                    transition: true,
                                    pillar: "Accredited Experience",
                                    detail: "Standardized competency testing"
                                },
                                {
                                    label: "Mentee & Mentor Network Access",
                                    foundation: true,
                                    transition: true,
                                    pillar: "Leadership Skills",
                                    detail: "Direct connection to the WingMentor Network"
                                },
                                {
                                    label: "Professional Forum Communication",
                                    foundation: true,
                                    transition: true,
                                    pillar: "Leadership Skills",
                                    detail: "Encrypted peer-to-peer intelligence sharing"
                                },
                                {
                                    label: "EBT CBTA Familiarization (HINFACT)",
                                    foundation: false,
                                    transition: true,
                                    pillar: "Pilot Recognition",
                                    detail: "Airbus Integrated applications & technical proficiency"
                                },
                                {
                                    label: "Airline Expectations prior Apply",
                                    foundation: false,
                                    transition: true,
                                    pillar: "Pilot Recognition",
                                    detail: "Etihad, SkyPasada, FlyDubai, Air Asia, and more"
                                },
                                {
                                    label: "GCAA ATPL Pathway (UAE)",
                                    foundation: false,
                                    transition: true,
                                    pillar: "Unity & Support",
                                    detail: "Direct GCAA licensure and regional licensing support"
                                },
                                {
                                    label: "Private Jet Sector Rating Discovery",
                                    foundation: false,
                                    transition: true,
                                    pillar: "Unity & Support",
                                    detail: "Direct intel from Brokers and Operators"
                                }
                            ].map((row, i) => (
                                <tr key={i} className="group/row border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors relative">
                                    <td className="py-6 px-6 relative">
                                        <div className="flex flex-col">
                                            <span className="font-bold text-slate-700 group-hover/row:text-blue-700 transition-colors">{row.label}</span>
                                            {/* Fade-in Description Box */}
                                            <div className="absolute left-6 top-full mt-[-10px] z-30 w-72 p-4 bg-white border border-slate-100 rounded-2xl shadow-2xl opacity-0 translate-y-4 group-hover/row:opacity-100 group-hover/row:translate-y-0 transition-all duration-300 pointer-events-none">
                                                <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-50">
                                                    <div className="w-1.5 h-1.5 rounded-full bg-blue-600"></div>
                                                    <span className="text-[10px] font-bold text-blue-700 uppercase tracking-widest">{row.pillar}</span>
                                                </div>
                                                <p className="text-[10px] text-slate-500 leading-relaxed font-sans">{row.detail}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-6 px-6 text-center">
                                        {row.foundation ? <CheckCircle2 className="w-5 h-5 text-slate-300 mx-auto" /> : <span className="text-slate-200">—</span>}
                                    </td>
                                    <td className="py-6 px-6 text-center bg-blue-50/30">
                                        {row.transition ? <CheckCircle2 className="w-5 h-5 text-blue-600 mx-auto" /> : <span className="text-slate-200">—</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot>
                            <tr>
                                <td></td>
                                <td></td>
                                <td className="bg-blue-50/50 rounded-b-3xl"></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

            {/* Growth Pillars */}
            {/* Growth Pillars - matching AboutPage styles */}
            <div className="py-24 px-6 max-w-7xl mx-auto border-t border-slate-50">
                <h2 className="text-3xl font-serif text-slate-900 mb-16 text-center">Pillars of Professional Growth</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {professionalGrowth.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
                            <item.icon className="w-8 h-8 text-blue-600 mb-8 transition-transform group-hover:scale-110" />
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 tracking-wide uppercase">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6">Explore the programs available within our unified membership</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans">
                            Whether you are building your foundation or transitioning to flagship carriers, WingMentor provides the specialized intelligence you need.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Get Started
                            </button>
                            <button
                                onClick={() => onNavigate('membership')}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Back to Membership
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
