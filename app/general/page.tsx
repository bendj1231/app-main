'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const GENERAL_CATEGORIES = [
    {
        id: 'free-tier',
        icon: '🎁',
        label: 'Free Tier Access',
        color: 'emerald',
        tagline: 'Start your journey with powerful features at no cost.',
        pain: 'Many pilot career platforms charge upfront fees or require credit cards just to explore opportunities. Pilots want to test a platform before committing financially, but traditional services lock basic features behind paywalls.',
        solution: 'Pilot Recognition offers a genuinely free tier with core features that remain free forever. Create your profile, access the public registry, explore pathways, and get discovered by airlines — all without paying a cent. No trials, no hidden fees, no credit card required.',
        benefits: [
            'Unlimited profile creation and edits',
            'Public visibility to airlines worldwide',
            'Digital logbook integration',
            'Secure credential storage',
            '3 career pathways per month',
            'Interest submissions to operators',
            'Basic AI matching system',
            'Global pilot registry access',
        ],
        pilots: [
            'Test the platform without financial commitment',
            'Get discovered by airlines for free',
            'Build your professional presence at no cost',
            'Upgrade only when you need premium features',
        ],
    },
    {
        id: 'priority-listings',
        icon: '⭐',
        label: 'Priority Listings',
        color: 'amber',
        tagline: 'Understand how profiles are ranked and displayed to airlines.',
        pain: 'Pilots don\'t understand why some profiles get more attention than others. Without transparency into ranking factors, career progression feels arbitrary and pilots can\'t optimize their visibility to employers.',
        solution: 'Our transparent ranking system shows exactly how profiles are ordered in airline searches. Recognition Score, recency, and relevance determine placement. Recognition+ members receive priority placement and highlighted badges that make them stand out.',
        benefits: [
            'Score-based profile ranking',
            'Recency weighting factors',
            'Activity bonus points',
            'Achievement recognition badges',
            'Standard listing for free users',
            'Priority placement for Plus members',
            'Highlighted profile badges',
            'Top of search results placement',
        ],
        pilots: [
            'Understand exactly how you rank to employers',
            'Optimize your profile for better visibility',
            'Get priority placement with Recognition+',
            'Stand out with highlighted badges',
        ],
    },
    {
        id: 'verification-levels',
        icon: '🛡️',
        label: 'Verification Levels',
        color: 'blue',
        tagline: 'Three tiers of verification that build trust with airlines.',
        pain: 'Airlines face significant risk when hiring based on unverified CV data. Fake flight hours and unconfirmed credentials cost carriers millions. Pilots need a way to prove their qualifications are legitimate.',
        solution: 'Three verification tiers that progressively build trust. Basic profiles show self-reported data. Recognition+ adds extended AI and unlimited access. Recognition+ Verified includes background checks, document screening, and top placement — giving airlines complete confidence.',
        benefits: [
            'Basic profile — free self-reported data',
            'Recognition+ — extended AI capabilities',
            'Recognition+ Verified — background checked',
            'Verified document screening',
            'Top placement in search results',
            'Screened status badge',
            'Airline trust indicators',
            'Progressive upgrade path',
        ],
        pilots: [
            'Build trust with verified credentials',
            'Stand out from unverified candidates',
            'Progress through verification tiers',
            'Show airlines your data is authentic',
        ],
    },
    {
        id: 'career-pathway-access',
        icon: '🛤️',
        label: 'Career Pathway Access',
        color: 'purple',
        tagline: 'Explore aviation career opportunities through our pathway system.',
        pain: 'Finding the right career opportunities in aviation is fragmented and time-consuming. Pilots must search dozens of airline websites, job boards, and forums — missing opportunities that match their exact qualifications.',
        solution: 'Our centralized pathway system aggregates career opportunities from airlines, cargo operators, charter companies, and flight schools. Browse all options in one place, express interest with one click, and let our AI match you to suitable roles automatically.',
        benefits: [
            'Browse airline career pathways',
            'Cargo operator opportunities',
            'Charter company listings',
            'Flight school cadet programs',
            'One-click interest submissions',
            'Profile sharing with operators',
            'Direct airline contact',
            'AI-powered pathway matching',
        ],
        pilots: [
            'Discover all aviation opportunities in one place',
            'Match to roles that fit your qualifications',
            'Submit interest with a single click',
            'Get alerts for new matching pathways',
        ],
    },
    {
        id: 'membership-benefits',
        icon: '💎',
        label: 'Membership Benefits',
        color: 'rose',
        tagline: 'Core benefits available to all Pilot Recognition members.',
        pain: 'Many subscription services trap users with contracts, hidden fees, and difficult cancellation processes. Pilots want flexibility to try features without long-term commitments.',
        solution: 'Pilot Recognition offers transparent, flexible membership with no tricks. The free tier is truly free forever. Paid subscriptions can be upgraded, downgraded, or cancelled anytime with no penalties. Your data is always preserved and you keep free access even after cancelling.',
        benefits: [
            'Core features free forever',
            'No credit card required for free tier',
            'One-click upgrade to Recognition+',
            'Instant activation of paid features',
            'Prorated billing for fair charges',
            'No long-term contracts ever',
            'Cancel anytime with no penalties',
            'Data retention after cancellation',
        ],
        pilots: [
            'Never pay for basic features you need',
            'Try premium features risk-free',
            'Stay flexible with no commitments',
            'Keep your data even if you leave',
        ],
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    purple: { eyebrow: 'text-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200', border: 'border-purple-200', bg: 'bg-purple-50' },
    rose: { eyebrow: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50' },
};

export default function GeneralPage() {
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
        return () => window.removeEventListener('scroll', onScroll);
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
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">General</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {GENERAL_CATEGORIES.map(cat => (
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
                            {GENERAL_CATEGORIES.map(cat => (
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
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Platform Overview</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            General Platform Features
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Core features available to all pilots: free tier access, verification levels, pathway exploration, and membership benefits.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => scrollTo('free-tier')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Explore Features
                            </button>
                            <button
                                onClick={() => navigate('/become-member')}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Create Free Profile
                            </button>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Free</p>
                            <p className="text-sm text-slate-500">Forever tier</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">3</p>
                            <p className="text-sm text-slate-500">Verification levels</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
                            <p className="text-sm text-slate-500">Pathway access</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Flexible</p>
                            <p className="text-sm text-slate-500">Membership</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Features</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Platform Essentials.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">Core features that power your pilot career journey — from free tier basics to premium capabilities.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {GENERAL_CATEGORIES.map(cat => (
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
            {GENERAL_CATEGORIES.map((cat, idx) => (
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
                                    <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">Our Solution</p>
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Start Your Free Profile</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of pilots on Pilot Recognition. Create your profile today at no cost.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/become-member')}
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            Create Free Account
                        </button>
                        <button
                            onClick={() => navigate('/recognition-plus')}
                            className="bg-white/10 hover:bg-white/20 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            View Recognition+
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
