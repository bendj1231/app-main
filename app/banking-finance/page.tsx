'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const FINANCE_CATEGORIES = [
    {
        id: 'pilot-loans',
        icon: '💰',
        label: 'Pilot Loans',
        color: 'blue',
        tagline: 'Career-trajectory-aware lending for pilots at every stage.',
        pain: 'Pilots taking out loans for type ratings ($30K), aircraft purchase, or flight school ($100K+) are a black-box for underwriters. Credit score alone misses the picture: a 200-hour graduate with $50K debt looks risky, but a pilot with strong Recognition Score on track to a major airline is excellent collateral.',
        solution: 'Career-trajectory-aware pilot lending. PilotRecognition provides a verified employment-readiness score, hours trajectory, type rating progression, and pathway match probability — letting lenders price loans on actual aviation career risk rather than generic credit metrics.',
        benefits: [
            'Pilot Recognition Score — proprietary career-readiness indicator',
            'Hours trajectory — last 12 months progression',
            'Type rating progress — current ratings + ratings in progress',
            'Pathway match score — probability of placement at target airlines',
            'Employment verification — live link to current operator',
            'Loan-to-pathway product — type rating loans tied to specific airline pathways',
            'Default-risk reduction via career insight, not just FICO',
            'White-label "Pilot Career Loan" product for partner banks',
        ],
        pilots: [
            'Type rating loans pre-approved against specific airline pathways',
            'Lower interest rates if Recognition Score is high',
            'Aircraft & home loans without proving aviation income three times over',
        ],
        cta: 'Partner with us. Custom pilot lending programs.',
    },
    {
        id: 'mortgage-services',
        icon: '🏠',
        label: 'Mortgage Services',
        color: 'emerald',
        tagline: 'Airline staff rates, expat mortgages, relocation loans.',
        pain: 'Pilots face unique mortgage challenges: expat contracts, airline staff rates, relocation between bases, and variable income patterns. Traditional lenders struggle to assess aviation income stability and often reject qualified pilots.',
        solution: 'Aviation-specialized mortgage products that understand pilot career patterns. We verify employment status, projected career earnings, and connect pilots with lenders who offer airline staff rates and understand the aviation industry.',
        benefits: [
            'Airline staff rates — preferential rates for airline employees',
            'Expat mortgage specialists — for pilots based overseas',
            'Relocation loans — smooth transitions between bases',
            'Variable income accommodation — understands roster patterns',
            'Fast-track approval — verified employment via PilotRecognition',
            'High loan-to-value options — for high-earning career pilots',
            'Portfolio landlord options — for investment properties',
            'Currency flexibility — for expat and international pilots',
        ],
        pilots: [
            'Access airline staff mortgage rates not available to the public',
            'Simplified approval using verified Recognition profile',
            'Mortgage advisors who understand aviation careers',
        ],
        cta: 'Connect with aviation mortgage specialists.',
    },
    {
        id: 'credit-cards',
        icon: '💳',
        label: 'Credit & Cards',
        color: 'violet',
        tagline: 'Air miles programs, travel benefits, and pilot perks.',
        pain: 'Pilots spend heavily on travel expenses, training costs, and lifestyle needs but miss out on cards optimized for their spending patterns. Generic rewards cards don\'t maximize the benefits pilots could be earning.',
        solution: 'Curated credit card recommendations for pilots including airline co-branded cards, air miles maximizers, and cards with aviation lifestyle benefits like lounge access, travel insurance, and training expense rewards.',
        benefits: [
            'Air miles maximization — earn on every flight and expense',
            'Airline co-branded cards — status benefits and perks',
            'Travel insurance included — comprehensive coverage',
            'Lounge access — worldwide airport lounge networks',
            'Training expense rewards — points on type ratings, sim time',
            'No foreign transaction fees — essential for international pilots',
            'Flexible payment terms — accommodates roster gaps',
            'Elite status fast-track — accelerated airline tier benefits',
        ],
        pilots: [
            'Maximize air miles on every dollar spent on aviation',
            'Access exclusive pilot and airline staff card benefits',
            'Get travel protections designed for frequent flyers',
        ],
        cta: 'Explore pilot-optimized credit cards.',
    },
    {
        id: 'investment-planning',
        icon: '📈',
        label: 'Investment Planning',
        color: 'amber',
        tagline: 'Retirement planning, wealth management, tax optimization.',
        pain: 'Pilots have complex financial situations: high-earning but relatively short careers, international tax obligations, variable currencies, and unique retirement planning needs. Generic financial advice misses aviation-specific considerations.',
        solution: 'Aviation-specialized wealth management including retirement planning for mandatory retirement ages, tax optimization for international pilots, currency hedging, and investment strategies tailored to pilot career trajectories.',
        benefits: [
            'Pilot career trajectory planning — plan for 65+ retirement',
            'International tax optimization — multi-jurisdiction expertise',
            'Currency hedging — for pilots paid in foreign currencies',
            'Early retirement strategies — bridge mandatory retirement gap',
            'Pension optimization — maximize airline and state pensions',
            'Investment portfolio alignment — risk profile for aviation careers',
            'Estate planning — international asset structures',
            'Succession planning — for pilot business owners',
        ],
        pilots: [
            'Retirement strategies that account for mandatory retirement ages',
            'Tax-efficient structures for international and expat pilots',
            'Wealth building aligned with aviation career patterns',
        ],
        cta: 'Connect with aviation financial advisors.',
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    violet: { eyebrow: 'text-violet-600', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200', bg: 'bg-violet-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
};

export default function BankingFinancePage() {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileNav, setMobileNav] = useState(false);

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

    // Handle URL section parameter on load
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const section = params.get('section');
        if (section) {
            setTimeout(() => scrollTo(section), 100);
        }
    }, []);

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
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Banking & Finance</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {FINANCE_CATEGORIES.map(cat => (
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
                            {FINANCE_CATEGORIES.map(cat => (
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
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Financial Services</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            Banking & Finance for Pilots
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Specialized financial solutions designed for aviation professionals. From training loans to retirement planning, we connect pilots with lenders and advisors who understand your career.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => scrollTo('pilot-loans')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Explore Pilot Loans
                            </button>
                            <button 
                                onClick={() => navigate('/recognition-plus')}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                View Recognition+
                            </button>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Career</p>
                            <p className="text-sm text-slate-500">Trajectory-based lending</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
                            <p className="text-sm text-slate-500">Income & employment data</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Lower</p>
                            <p className="text-sm text-slate-500">Rates for high scorers</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
                            <p className="text-sm text-slate-500">Expat & international</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Financial Solutions</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Everything Pilots Need.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">From your first type rating loan to retirement planning — financial products designed for aviation careers.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {FINANCE_CATEGORIES.map(cat => (
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

            {/* ─── CATEGORY DEEP-DIVES ─── */}
            {FINANCE_CATEGORIES.map((cat, idx) => (
                <section key={cat.id} id={cat.id} className={`py-16 px-6 border-b border-slate-200 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}`}>
                    <div className="max-w-6xl mx-auto">
                        <div className="grid lg:grid-cols-12 gap-10">
                            {/* Left: intro */}
                            <div className="lg:col-span-5">
                                <p className={`text-[11px] uppercase tracking-[0.25em] font-semibold mb-3 ${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'}`}>{cat.label}</p>
                                <h2 className="text-3xl md:text-4xl font-bold leading-tight mb-5 text-slate-900">{cat.tagline}</h2>
                                
                                <div className={`${COLOR_CLASSES[cat.color]?.bg ?? 'bg-red-50'} border ${COLOR_CLASSES[cat.color]?.border ?? 'border-red-200'} rounded-xl p-4 mb-5`}>
                                    <p className={`${COLOR_CLASSES[cat.color]?.eyebrow ?? 'text-red-600'} text-[10px] uppercase tracking-widest font-bold mb-2`}>The Problem</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{cat.pain}</p>
                                </div>
                                
                                <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 mb-5">
                                    <p className="text-emerald-700 text-[10px] uppercase tracking-widest font-bold mb-2">Our Solution</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{cat.solution}</p>
                                </div>
                                
                                <div className="bg-slate-100 border border-slate-200 rounded-xl p-4">
                                    <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-2">Get Started</p>
                                    <p className="text-slate-700 text-sm leading-relaxed">{cat.cta}</p>
                                    <button 
                                        onClick={() => navigate('/become-member')}
                                        className="inline-flex items-center gap-1 mt-3 text-sm text-red-600 hover:text-red-500 font-semibold"
                                    >
                                        Create your profile →
                                    </button>
                                </div>
                            </div>

                            {/* Right: benefits + pilots */}
                            <div className="lg:col-span-7 space-y-6">
                                <div>
                                    <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 font-semibold mb-4">What you get</p>
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
                                </div>

                                <div className="bg-gradient-to-br from-slate-50 to-white border border-slate-200 rounded-2xl p-6">
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Access Better Finance?</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Create your free Pilot Recognition profile and unlock career-based lending rates, aviation-specialized mortgages, and wealth management designed for pilots.
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
