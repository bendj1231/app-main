import React from 'react';
import { Database, Award, Shield, ChevronRight, CheckCircle2, ShieldCheck, Zap, Globe, Lock, BarChart3, Search, UserCheck } from 'lucide-react';
import { TopNavbar } from './TopNavbar';
import { RevealOnScroll } from '../RevealOnScroll';
import { IMAGES } from '../../../src/lib/website-constants';

interface PilotRecognitionPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

export const PilotRecognitionPage: React.FC<PilotRecognitionPageProps> = ({ onBack, onNavigate, onLogin }) => {
    // Magazine Rows Data
    const magazineRows = [
        {
            title: "Centralized Data Repository",
            desc: "A single, immutable source of truth for all your flight hours, certifications, and professional milestones. WingMentor acts as a secure ledger that consolidates your entire aviation career into one verified profile.",
            bullets: ["Secure Ledger", "Cloud Sync", "Immutable Records"],
            image: IMAGES.LOGBOOK_IMG,
            reverse: false
        },
        {
            title: "Verifiable Credentialing",
            desc: "Cryptographically signed records that airlines and authorities can verify instantly. We eliminate logbook fraud by creating a digital chain of custody for every flight hour and training event.",
            bullets: ["Instant Verification", "Authenticity Guaranteed", "Recruiter Trust"],
            image: IMAGES.STORY_MAP_BG,
            reverse: true
        },
        {
            title: "ATLAS Optimization",
            desc: "Your profile is automatically optimized for airline AI recruitment systems (ATLAS). We ensure your specific talents are flagged and formatted to pass through automated HR filters.",
            bullets: ["AI Screening Ready", "Global Standards", "Machine Readable"],
            image: IMAGES.ANALYST_PROFILE_IMG,
            reverse: false
        },
        {
            title: "Competency Analytics",
            desc: "Transform raw technical skill into data-driven professional competencies. We map your performance against the CBTA framework, making you visible to global manufacturers like Airbus.",
            bullets: ["Skill Mapping", "CBTA Framework", "Performance Metrics"],
            image: IMAGES.GAP_CAREER_TURBULENCE_IMG,
            reverse: true
        }
    ];

    const recognitionPillars = [
        { title: "Audited Logging", value: "Every hour logged is cross-referenced with training records for absolute accuracy.", icon: CheckCircle2 },
        { title: "Machine-Ready", value: "Your data is formatted for seamless extraction into legacy airline HR portals.", icon: (props: any) => <Zap {...props} /> },
        { title: "Verified Badge", value: "Earn the digital 'Verified Pilot' status, a gold standard for professional credibility.", icon: Award },
        { title: "Direct Pipeline", value: "Automatic visibility in the WingMentor recruiter search engine for partner airlines.", icon: Search }
    ];

    return (
        <div className="min-h-screen bg-white text-slate-900 font-sans text-left">
            <TopNavbar onNavigate={onNavigate} onLogin={onLogin} forceScrolled={true} isLight={true} />

            {/* Header Section */}
            <div className="pt-32 pb-20 px-6 bg-slate-50/50">
                <div className="max-w-6xl mx-auto text-center relative z-20">
                    <RevealOnScroll>
                        <div className="flex justify-center items-center gap-4 mb-8">
                            <Shield className="w-10 h-10 text-blue-600" />
                        </div>
                        <p className="text-sm font-bold tracking-[0.4em] uppercase text-blue-700 mb-6 font-sans">
                            RECOGNITION | ASSURANCE | SUPPORT
                        </p>
                        <h1 className="text-4xl md:text-7xl font-serif text-slate-900 leading-tight mb-8">
                            Pilot Recognition <br />Systems
                        </h1>
                        <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 leading-relaxed font-sans">
                            We transform thousands of flight hours into verifiable professional credentials.
                            Our digital recognition infrastructure is the bridge between training and airline-ready credibility.
                        </p>
                    </RevealOnScroll>
                </div>
            </div>

            {/* Magazine Content Sections */}
            <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">
                {magazineRows.map((row, idx) => (
                    <div key={idx} className={`flex flex-col ${row.reverse ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-10 md:gap-16`}>
                        <div className="md:w-1/2">
                            <RevealOnScroll>
                                <p className="text-xs font-bold text-blue-700 uppercase tracking-[0.3em] mb-4">
                                    Feature {idx + 1}
                                </p>
                                <h2 className="text-3xl md:text-4xl font-serif text-slate-900 mb-6 leading-tight">
                                    {row.title}
                                </h2>
                                <p className="text-base text-slate-700 leading-relaxed mb-6 font-sans">
                                    {row.desc}
                                </p>
                                <div className="space-y-3">
                                    {row.bullets.map((bullet, i) => (
                                        <div key={i} className="flex items-center gap-3">
                                            <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />
                                            <span className="text-sm font-bold text-slate-600 tracking-wide uppercase">{bullet}</span>
                                        </div>
                                    ))}
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="md:w-1/2">
                            <RevealOnScroll delay={200}>
                                <div className="relative group p-[1px] bg-gradient-to-b from-slate-200 to-transparent rounded-[2rem]">
                                    <div className="aspect-[4/3] w-full overflow-hidden rounded-[2rem] shadow-2xl relative">
                                        <img
                                            src={row.image}
                                            alt={row.title}
                                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                                        />
                                        <div className="absolute inset-0 bg-blue-900/10 group-hover:bg-transparent transition-colors duration-500"></div>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                    </div>
                ))}
            </div>

            {/* Cinematic Stewardship Section (Dark) */}
            <div className="py-24 px-6 bg-[#050A30] text-white mt-24">
                <div className="max-w-7xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
                        <div>
                            <RevealOnScroll>
                                <p className="text-xs font-bold tracking-[0.4em] uppercase text-blue-400 mb-6">Audited Credibility</p>
                                <h2 className="text-3xl md:text-5xl font-serif mb-8 leading-tight">
                                    Beyond the Logbook: <br />Verified Competency
                                </h2>
                                <p className="text-lg text-slate-400 mb-8 leading-relaxed font-sans italic">
                                    "Traditional logbooks only track time. Our recognition system tracks impact."
                                </p>
                                <div className="space-y-6">
                                    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        <UserCheck className="w-6 h-6 text-blue-400 shrink-0" />
                                        <p className="text-slate-300 text-sm font-sans leading-relaxed">
                                            Every mentorship session, leadership role, and technical milestone is digitally cryptographically verified.
                                        </p>
                                    </div>
                                    <div className="flex items-start gap-4 p-6 bg-white/5 rounded-2xl border border-white/10 hover:bg-white/10 transition-all">
                                        <Lock className="w-6 h-6 text-blue-400 shrink-0" />
                                        <p className="text-slate-300 text-sm font-sans leading-relaxed">
                                            Encrypted ledger technology ensures your professional data remains secure and immutable.
                                        </p>
                                    </div>
                                </div>
                            </RevealOnScroll>
                        </div>
                        <div className="relative">
                            <div className="aspect-[4/5] bg-slate-100 rounded-[3rem] overflow-hidden shadow-2xl">
                                <img
                                    src="https://lh3.googleusercontent.com/d/1lBYiMzvNPAkqmaAJjO_c1Bc3pAtLjwY1"
                                    alt="Pilot Recognition System Architecture"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-blue-900/40 mix-blend-overlay"></div>
                                <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl">
                                    <div className="flex items-center gap-4">
                                        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
                                            <Award className="w-5 h-5 text-white" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-bold text-blue-200 tracking-wider uppercase">Status</p>
                                            <p className="text-white font-bold">Verified Professional</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Recognition Pillars (System Infrastructure) - Matching "Pillars" Style */}
            <div className="py-24 px-6 max-w-7xl mx-auto bg-white">
                <div className="text-center mb-16">
                    <p className="text-[10px] font-bold tracking-[0.4em] uppercase text-blue-700 mb-4">Infrastructure</p>
                    <h2 className="text-3xl font-serif text-slate-900">System Architecture</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {recognitionPillars.map((item, idx) => (
                        <div key={idx} className="p-10 bg-slate-50/50 border border-slate-100 rounded-[2.5rem] hover:bg-white hover:shadow-xl transition-all group">
                            <div className="w-10 h-10 mb-8">
                                {typeof item.icon === 'function' ? item.icon({ className: "w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" }) : <item.icon className="w-8 h-8 text-blue-600 group-hover:scale-110 transition-transform" />}
                            </div>
                            <h3 className="text-lg font-bold mb-3 font-sans text-slate-800 tracking-widest uppercase">{item.title}</h3>
                            <p className="text-slate-500 text-sm leading-relaxed font-sans">{item.value}</p>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer CTA */}
            <div className="py-24 px-6 bg-slate-50 border-t border-slate-200">
                <div className="max-w-4xl mx-auto text-center">
                    <RevealOnScroll>
                        <h2 className="text-3xl md:text-5xl font-serif text-slate-900 mb-6">Unlock Your Digital Credibility</h2>
                        <p className="text-lg text-slate-600 mb-10 font-sans max-w-2xl mx-auto">
                            Join the global network of recognized pilots. Completion of the WingMentor programs
                            unlocks the "Verified" status across our recruiter-facing tools.
                        </p>
                        <div className="flex flex-wrap justify-center gap-6">
                            <button
                                onClick={() => onNavigate('become-member')}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-12 py-5 rounded-full font-bold text-lg transition-all shadow-xl hover:shadow-blue-500/20 font-sans"
                            >
                                Get Verified
                            </button>
                            <button
                                onClick={onBack}
                                className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-900 px-12 py-5 rounded-full font-bold text-lg transition-all font-sans"
                            >
                                Back to Directory
                            </button>
                        </div>
                    </RevealOnScroll>
                </div>
            </div>
        </div>
    );
};
