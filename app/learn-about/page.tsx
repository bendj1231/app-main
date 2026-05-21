'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { BookOpen, Target, Zap, Users, Plane, CheckCircle, ArrowRight, Database, RefreshCw, Award, Building2 } from 'lucide-react';

const LEARN_CATEGORIES = [
    {
        id: 'what-is-recognition',
        icon: '📚',
        label: 'What is Pilot Recognition?',
        color: 'blue',
        tagline: 'A comprehensive platform that transforms how pilots manage their careers.',
        pain: 'Traditional pilot career management involves scattered documents, outdated CVs, and applying blindly to airlines without knowing if you\'re even qualified. Pilots spend hours maintaining paperwork while opportunities pass them by.',
        solution: 'Pilot Recognition is a digital ecosystem where pilots build live profiles, access career pathways, and get discovered by airlines through a pulling system rather than traditional applications. Your profile becomes your career passport.',
        benefits: [
            'Live real-time profile updates',
            'Digital logbook integration',
            'Verified credentials system',
            'Public pilot registry access',
            'Profile auto-updates with new data',
            'Recognition Score calculation',
            'Airline pulling system access',
            'Smart pathway matching',
        ],
        pilots: [
            'Stop applying blindly to airlines',
            'Get discovered by operators seeking your skills',
            'Build a portable professional reputation',
            'Maintain career transparency with verified data',
        ],
    },
    {
        id: 'recognition-score-guide',
        icon: '🏆',
        label: 'Recognition Score Explained',
        color: 'amber',
        tagline: 'Your professional reputation quantified — understand your career currency.',
        pain: 'Pilots struggle to understand their market value and how they compare to other candidates. Without objective metrics, career progression feels arbitrary and opaque.',
        solution: 'The Recognition Score (0-100) is a comprehensive metric representing your professional standing, experience, recency, and verified achievements. It becomes your career currency that airlines trust.',
        benefits: [
            '0-100 comprehensive scoring scale',
            'Industry benchmark comparison',
            'Dynamic score updates as you progress',
            'Public visibility to airlines',
            'Flight hours weighting in score',
            'Type rating bonus points',
            'Recency factor calculations',
            'Exam score integration',
        ],
        pilots: [
            'Understand your true market value',
            'See exactly how you compare to peers',
            'Know what qualifications you need next',
            'Let your score speak for you to airlines',
        ],
    },
    {
        id: 'pulling-system',
        icon: '🔄',
        label: 'The Pulling System',
        color: 'emerald',
        tagline: 'No more applications — airlines come to you based on verified data.',
        pain: 'The traditional job application process is broken. Pilots send CVs into black holes, wait months for responses, and compete against thousands of applicants with no feedback or visibility.',
        solution: 'The pulling system inverts the hiring model. Airlines use our platform to search, filter, and pull pilot profiles based on specific requirements. Your live, verified profile does the work for you.',
        benefits: [
            'Zero applications needed',
            'Passive job matching system',
            'Profile works for you 24/7',
            'Always visible to hiring airlines',
            'Advanced airline filtering tools',
            'Real-time availability status',
            'Ranked by Recognition Score',
            'Direct airline contact enabled',
        ],
        pilots: [
            'Stop sending CVs into black holes',
            'Let airlines find and contact you directly',
            'Get matched to roles that fit your skills',
            'Enjoy higher response rates from operators',
        ],
    },
    {
        id: 'recognition-vs-traditional',
        icon: '⚡',
        label: 'Recognition vs Traditional',
        color: 'violet',
        tagline: 'See how the modern approach to pilot careers compares to outdated methods.',
        pain: 'Traditional career tools — static CVs, manual applications, unverified claims — no longer serve modern pilots or airlines. The industry needs verified, real-time data.',
        solution: 'Pilot Recognition replaces outdated methods with verified, dynamic systems. Live profiles instead of PDFs, pulling instead of applying, and verified data instead of unverified claims.',
        benefits: [
            'Live profiles vs static PDFs',
            'Always current information',
            'Verified data only',
            'Interactive multimedia content',
            'Passive opportunity generation',
            'Targeted role matching',
            'Higher response rates guaranteed',
            'Better role fit assurance',
        ],
        pilots: [
            'Replace outdated CVs with live profiles',
            'Move from applying to being discovered',
            'Build trust with verified credentials',
            'Reduce screening time with authenticated data',
        ],
    },
    {
        id: 'dead-data-resumes',
        icon: '📄',
        label: 'Why Resumes Are Dead Data',
        color: 'red',
        tagline: 'Static CVs are outdated the moment they are sent — live profiles are the future.',
        pain: 'Traditional resumes and CVs are static documents that become outdated immediately after creation. Pilots spend hours crafting the perfect PDF only to have their flight hours, new ratings, or recent exam results become outdated within weeks. Airlines receive thousands of these stale documents and must manually verify every claim, wasting countless hours on authentication while making hiring decisions based on potentially false or outdated information.',
        solution: 'Live digital profiles replace dead CVs with dynamic, verified data that updates automatically. Your flight hours sync from your logbook, new type ratings appear instantly upon verification, and examination results populate automatically — creating a real-time career passport that airlines can trust without manual verification.',
        benefits: [
            'Real-time profile updates vs static PDFs',
            'Automatic flight hour synchronization',
            'Instant credential verification on entry',
            'No manual CV updates ever again',
            'Always-current availability status',
            'Verified data eliminates fraud risk',
            'Multimedia profile enhancements',
            'One profile replaces hundreds of CVs',
        ],
        pilots: [
            'Never update a CV PDF again',
            'Your profile stays current automatically',
            'Stand out with verified vs claimed data',
            'Be confident airlines see your latest achievements',
        ],
    },
    {
        id: 'for-airlines',
        icon: '✈️',
        label: 'For Airlines & Operators',
        color: 'slate',
        tagline: 'How carriers find, verify, and hire qualified pilots faster.',
        pain: 'Airlines waste thousands of hours screening fake resumes, verifying questionable claims, and dealing with outdated candidate data. The hiring process is expensive and inefficient.',
        solution: 'Our platform provides airlines with verified pilot profiles containing authenticated flight hours, confirmed type ratings, and validated exam scores — all pre-screened and ranked by Recognition Score.',
        benefits: [
            'No fake resumes to filter',
            'Verified flight hours only',
            'Confirmed type ratings data',
            'Trusted single data source',
            'Score-based candidate ranking',
            'Recency-weighted results',
            'Custom hiring filters',
            'Priority pipeline access',
        ],
        pilots: [
            'Airlines see your verified data instantly',
            'Pre-verified docs speed up onboarding',
            'Current medical status is always visible',
            'Background checks accelerate hiring',
        ],
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    violet: { eyebrow: 'text-violet-600', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200', bg: 'bg-violet-50' },
    red: { eyebrow: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-red-200', bg: 'bg-red-50' },
    slate: { eyebrow: 'text-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200', border: 'border-slate-200', bg: 'bg-slate-50' },
};

export default function LearnAboutPage() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [scrolled, setScrolled] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);

    useEffect(() => {
        window.scrollTo(0, 0);
        const section = searchParams.get('section');
        if (section) {
            const element = document.getElementById(section);
            if (element) {
                setTimeout(() => element.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
            }
        }
    }, [searchParams]);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return (
        {/* Coded by Benjamin Bowler */}) => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id: string) => {
        setMobileNav(false);
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    return (
        <div className="min-h-screen bg-white text-slate-900">
            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <div className="flex items-center gap-4">
                            <button
                                onClick={() => navigate('/')}
                                className="flex items-center gap-2 text-slate-600 hover:text-red-600 transition-colors"
                            >
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                </svg>
                                <span className="text-sm font-medium">Home</span>
                            </button>
                            <button onClick={() => navigate('/')} className="flex items-center gap-3 group">
                                <span className="text-xl font-bold tracking-tight">
                                    <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                                </span>
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Learn</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {LEARN_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => scrollTo(cat.id)}
                                    className="px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg transition-colors"
                                >
                                    {cat.label}
                                </button>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="hidden lg:flex items-center gap-3">
                            <button
                                onClick={() => navigate('/become-member')}
                                className="bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors"
                            >
                                Create Free Profile
                            </button>
                        </div>

                        {/* Mobile menu button */}
                        <button
                            className="lg:hidden p-2 text-slate-600 hover:text-slate-900"
                            onClick={() => setMobileNav(!mobileNav)}
                        >
                            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {mobileNav ? (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                ) : (
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                )}
                            </svg>
                        </button>
                    </div>
                </div>

                {/* Mobile nav */}
                {mobileNav && (
                    <div className="lg:hidden border-t border-slate-200 bg-white">
                        <div className="px-4 py-3 space-y-1">
                            {LEARN_CATEGORIES.map(cat => (
                                <button
                                    key={cat.id}
                                    onClick={() => scrollTo(cat.id)}
                                    className="block w-full text-left px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-slate-50 rounded-lg"
                                >
                                    {cat.icon} {cat.label}
                                </button>
                            ))}
                            <div className="pt-2 border-t border-slate-100 mt-2">
                                <button
                                    onClick={() => navigate('/become-member')}
                                    className="w-full bg-red-600 hover:bg-red-500 text-white text-sm font-semibold px-4 py-2 rounded-lg"
                                >
                                    Create Free Profile
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </header>

            {/* ─── HERO ─── */}
            <section className="relative bg-slate-50 border-b border-slate-200">
                <div className="max-w-6xl mx-auto px-6 pt-16 pb-12">
                    <div className="max-w-3xl">
                        <button
                            onClick={() => navigate('/')}
                            className="flex items-center gap-2 text-slate-500 hover:text-red-600 transition-colors mb-4"
                        >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="text-sm font-medium">Back to Home</span>
                        </button>
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Learning Center</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            Learn About
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Discover how Pilot Recognition transforms aviation careers through verified profiles, the pulling system, and your Recognition Score.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => scrollTo('what-is-recognition')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Start Learning
                            </button>
                            <button
                                onClick={() => navigate('/become-member')}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Create Profile
                            </button>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
                            <p className="text-sm text-slate-500">Profile data</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">0-100</p>
                            <p className="text-sm text-slate-500">Recognition Score</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Pulling</p>
                            <p className="text-sm text-slate-500">Hiring system</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Live</p>
                            <p className="text-sm text-slate-500">Auto-updates</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Topics</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Explore the Platform.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">Learn how Pilot Recognition works and why it matters for your aviation career.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {LEARN_CATEGORIES.map(cat => (
                            <button
                                key={cat.id}
                                onClick={() => scrollTo(cat.id)}
                                className="group text-left bg-slate-50 hover:bg-white border border-slate-200 hover:border-slate-300 rounded-2xl p-6 transition-all shadow-sm hover:shadow-md"
                            >
                                <div className="text-3xl mb-3">{cat.icon}</div>
                                <h3 className="text-slate-900 font-semibold text-lg mb-1.5 group-hover:text-red-600 transition-colors">{cat.label}</h3>
                                <p className="text-slate-600 text-sm leading-relaxed">{cat.tagline}</p>
                                <p className="mt-4 text-red-600 text-xs font-semibold flex items-center gap-1">Learn more <span className="group-hover:translate-x-1 transition-transform">→</span></p>
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* ─── DEEP-DIVE SECTIONS ─── */}
            {LEARN_CATEGORIES.map((cat, idx) => (
                <section key={cat.id} id={cat.id} className={`py-16 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Left: intro */}
                            <div className="lg:col-span-5">
                                <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'}`}>{cat.label}</p>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-slate-900">{cat.tagline}</h2>

                                <div className={`${COLOR_CLASSES[cat.color]?.bg ?? 'bg-red-50'} border ${COLOR_CLASSES[cat.color]?.border ?? 'border-red-200'} rounded-xl p-4 mb-5`}>
                                    <p className={`${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'} text-[10px] uppercase tracking-widest font-bold mb-2`}>The Challenge</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{cat.pain}</p>
                                </div>

                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                                    <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">The Solution</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{cat.solution}</p>
                                </div>
                            </div>

                            {/* Right: benefits */}
                            <div className="lg:col-span-7">
                                <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">Key Benefits</p>
                                <ul className="grid sm:grid-cols-2 gap-3">
                                    {cat.benefits.map((b, i) => (
                                        <li key={i} className="flex items-start gap-3 bg-white border border-slate-200 rounded-xl p-3">
                                            <div className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${COLOR_CLASSES[cat.color]?.badge ?? 'bg-red-100 text-red-700'}`}>
                                                <span className="text-xs">✓</span>
                                            </div>
                                            <p className="text-slate-700 text-sm leading-relaxed">{b}</p>
                                        </li>
                                    ))}
                                </ul>

                                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6 mt-6">
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">For Pilots</p>
                                    <ul className="space-y-3">
                                        {cat.pilots.map((p, i) => (
                                            <li key={i} className="flex items-start gap-3">
                                                <div className="w-6 h-6 bg-red-600 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                                                    <span className="text-white text-xs">✓</span>
                                                </div>
                                                <p className="text-slate-700 leading-relaxed">{p}</p>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            ))}

            {/* ─── CTA SECTION ─── */}
            <section className="py-16 px-6 bg-slate-900 text-white">
                <div className="max-w-4xl mx-auto text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start?</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Create your free profile and join thousands of pilots using Pilot Recognition to advance their careers.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/become-member')}
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            Create Free Profile
                        </button>
                        <button
                            onClick={() => navigate('/recognition-plus')}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            Explore Recognition+
                        </button>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-white border-t border-slate-200 py-8 px-6">
                <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <span className="text-lg font-bold">
                            <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                        </span>
                    </div>
                    <p className="text-slate-500 text-sm">&copy; 2024 PilotRecognition. All rights reserved.</p>
                </div>
            </footer>
        </div>
    );
}
