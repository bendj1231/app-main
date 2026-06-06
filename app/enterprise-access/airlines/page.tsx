'use client';

import React, { useState, useEffect } from 'react';

const AirlinesOperatorsPage = () => {
    const [openMenu, setOpenMenu] = useState<string | null>(null);
    const [mobileNav, setMobileNav] = useState(false);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', onScroll);
        return () => window.removeEventListener('scroll', onScroll);
    }, []);

    const scrollTo = (id: string) => {
        setOpenMenu(null);
        setMobileNav(false);
        const el = document.getElementById(id);
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 80;
            window.scrollTo({ top, behavior: 'smooth' });
        }
    };

    const NAV_GROUPS = [
        {
            label: 'Solutions',
            items: [
                { id: 'airlines', label: 'Airlines & Operators', href: '/enterprise-access/airlines' },
                { id: 'flightschools', label: 'Flight Schools & ATOs', href: '/enterprise-access#flightschools' },
                { id: 'privatejet', label: 'Private Jet & Charter', href: '/enterprise-access#privatejet' },
                { id: 'evtol', label: 'Air Taxi & eVTOL', href: '/enterprise-access#evtol' },
                { id: 'military', label: 'Military & Defence', href: '/enterprise-access#military' },
                { id: 'manufacturers', label: 'Manufacturers & OEMs', href: '/enterprise-access#manufacturers' },
            ],
        },
        {
            label: 'Services',
            items: [
                { id: 'recruitment', label: 'Aviation Recruitment Agencies', href: '/enterprise-access#recruitment' },
                { id: 'insurers', label: 'Insurers & Lenders', href: '/enterprise-access#insurers' },
                { id: 'atc', label: 'ATC & ANSPs', href: '/enterprise-access#atc' },
                { id: 'ground', label: 'Ground Handling & FBOs', href: '/enterprise-access#ground' },
                { id: 'maintenance', label: 'MRO & Maintenance', href: '/enterprise-access#maintenance' },
                { id: 'simulator', label: 'Simulator Training', href: '/enterprise-access#simulator' },
                { id: 'drone', label: 'RPAS & Drone Ops', href: '/enterprise-access#drone' },
            ],
        },
        {
            label: 'About',
            items: [
                { id: 'why', label: 'Why PilotRecognition', href: '/enterprise-access#why' },
                { id: 'metric', label: 'The 90-Day Metric', href: '/enterprise-access#metric' },
                { id: 'contact', label: 'Request Access', href: '/enterprise-access#contact' },
            ],
        },
    ];

    const airlinesSector = {
        id: 'airlines',
        label: 'Airlines & Operators',
        tagline: 'Close the <span class="text-red-600">recognition gap</span>.<br>Surface your <span class="text-red-600">expectations</span>. Pull <span class="text-red-600">aligned pilots</span>.',
        pain: 'The aviation industry suffers from a fundamental recognition problem. Pilots lack visibility into operator expectations — whether airlines, charter companies, private jet fleets, or corporate flight departments. Job boards list minimum requirements ("500 hours") but hide the hidden competencies operators actually value: specific jet type ratings, turbine experience, CRM skills for corporate flying, and the ability to operate with minimal additional training. This creates the "Pilot Paradox" — while there is a long-term pilot shortage, operators drown in high volumes of applicants yet face a scarcity of pilots who are fully qualified, type-rated where necessary, and ready to operate immediately. 80% of applications to general aviation and charter operators are not applications at all — they are inquiries about expectations, requirements, and pathway details. Part 135 charter operators need pilots yesterday, not time to mentor or answer career questions. Operators simply do not have time to respond to every single inquiry about what they are looking for. A charter operator with a specific aircraft type needs rated pilots immediately, not a pile of unqualified CVs. Meanwhile, pilots submit blind applications, hoping their profile matches, with no clear guidance on how to align their experience with specific operator needs or bridge the gap from instructing to charter roles. Traditional job boards list openings but hide the critical context: what competencies you actually value, what your pathway looks like, and how candidates should position themselves.',
        solution: 'PilotRecognition solves this by giving all operators — commercial airlines, charter services, private aviation, and corporate flight departments — a platform to publish clear, structured pathways and expectations upfront. Instead of filtering through confused inquiries and mismatched applications, you define exactly what you are looking for — hours, type ratings, aircraft-specific competencies, behavioral profiles — and pilots align their profiles to match before they ever reach you. Whether you operate an A320 fleet, a Challenger 350 charter service, or a corporate Gulfstream, you get a pipeline of pilots who already understand your needs and have positioned themselves accordingly. No more answering the same requirement questions hundreds of times. No more mismatched applications. Just pilots who recognize what you need and have prepared accordingly. You save significant time and cost by accessing only pilots who have already submitted genuine interest in your specific pathway — not a random list of candidates.',
        benefits: [
            'Pathway Cards — publish detailed expectations, requirements, and competencies publicly for any operator type',
            'Pre-qualified interest pool — access pilots who have already submitted interest in your pathway, not random candidates',
            'Time and cost savings — eliminate hours spent sifting through mismatched applications and repetitive inquiries',
            'Fair View System — free members can submit interest but are not background checked; you control the risk decision',
            'PilotRecognition+ shortlisting — paid members provide detailed profiles with background verification from trusted screening partners',
            'Aircraft-specific matching — charter operators get type-rated pilots for their specific fleet',
            'Immediate availability filters — find pilots who are current and available for ad-hoc charter demand',
            'Transparent alignment — pilots see exactly what you need before applying',
            'Profile-matched pipeline — only pilots who align with your criteria submit interest',
            'Reduced inquiry volume — expectations are public, eliminating repetitive questions',
            'Live profile data — current hours, ratings, and recency always visible',
            'Recognition Score — objective readiness metric pilots can work toward',
            'Pull-based system — you select from ranked, qualified, pre-aligned candidates',
            'Risk control — you decide whether to proceed with free members or prioritize verified PilotRecognition+ users',
            'Outcome tracking — measure placement success and pathway effectiveness',
        ],
        pilots: [
            'See exact operator expectations before investing time in applications — airlines, charter, or corporate',
            'Align your profile toward specific operator needs with clear guidance',
            'No more blind applications — know where you fit before you apply',
            'Recognition Score gives you a target to work toward',
        ],
        cta: 'Pricing: $1,000/year Enterprise flat. Absolutely no success or placement fees.',
        mission: 'For Airlines & Operators, our mission is to close the recognition gap between pilots and flight departments. We shift recruitment from a "push" model — where pilots submit applications without response or feedback — to a "pull" model where operators access pre-qualified interest. Pathway Cards force transparency, surfacing hidden competencies that generic job boards hide. The Fair View System gives you control: see broad interest from free members while prioritizing premium candidates with verified backgrounds. This is not a luxury job board — it is infrastructure. Credentials and needs are pre-aligned before the first conversation ever happens, eliminating the 80% of applications that are merely inquiries about expectations.',
    };

    return (
        <>
            <style>{`
                @media (max-width: 1024px) {
                    html, body {
                        zoom: 0.5;
                        -moz-transform: scale(0.5);
                        -moz-transform-origin: 0 0;
                        -o-transform: scale(0.5);
                        -o-transform-origin: 0 0;
                        -webkit-transform: scale(0.5);
                        -webkit-transform-origin: 0 0;
                        transform: scale(0.5);
                        transform-origin: 0 0;
                        width: 200%;
                        height: 200%;
                        overflow-x: hidden;
                    }
                }
            `}</style>
            <div className="min-h-screen bg-white text-slate-900">
            {/* ─── STICKY NAV ─── */}
            <header className={`sticky top-0 z-50 transition-all duration-200 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm' : 'bg-white/80 backdrop-blur-sm'}`}>
                <div className="max-w-7xl mx-auto px-4 lg:px-6">
                    <div className="flex items-center justify-between h-16">
                        {/* Logo */}
                        <a href="https://pilotrecognition.com" className="flex items-center gap-3 group">
                            <span className="text-xl font-bold tracking-tight">
                                <span className="text-slate-900">Pilot</span><span className="text-red-600">Recognition</span>
                            </span>
                            <span className="text-base font-semibold text-slate-900 tracking-wide">Enterprise</span>
                        </a>

                        {/* Desktop dropdowns */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {NAV_GROUPS.map(group => (
                                <div
                                    key={group.label}
                                    className="relative"
                                    onMouseEnter={() => setOpenMenu(group.label)}
                                    onMouseLeave={() => setOpenMenu(null)}
                                >
                                    <button className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-1">
                                        {group.label}
                                        <svg className={`w-3 h-3 transition-transform ${openMenu === group.label ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
                                    </button>
                                    {openMenu === group.label && (
                                        <div className="absolute top-full left-0 pt-2 min-w-[260px]">
                                            <div className="bg-white border border-slate-200 rounded-xl shadow-2xl py-2">
                                                {group.items.map(item => (
                                                    item.href ? (
                                                        <a
                                                            key={item.id}
                                                            href={item.href}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors block"
                                                        >
                                                            {item.label}
                                                        </a>
                                                    ) : (
                                                        <button
                                                            key={item.id}
                                                            onClick={() => scrollTo(item.id)}
                                                            className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                                                        >
                                                            {item.label}
                                                        </button>
                                                    )
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </nav>

                        {/* CTA */}
                        <div className="flex items-center gap-3">
                            <a href="/enterprise-access" className="text-slate-600 hover:text-slate-900 text-sm font-medium">
                                ← Back to Enterprise
                            </a>
                            <button onClick={() => window.open('https://pilotrecognition.com', '_blank', 'noopener,noreferrer')} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-5 py-2 rounded-lg text-sm transition-colors">
                                Request Access
                            </button>
                        </div>

                        {/* Mobile menu toggle */}
                        <button onClick={() => setMobileNav(!mobileNav)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100">
                            <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Mobile nav */}
                    {mobileNav && (
                        <div className="lg:hidden border-t border-slate-200 py-4 max-h-[80vh] overflow-y-auto bg-white">
                            {NAV_GROUPS.map(group => (
                                <div key={group.label} className="mb-4">
                                    <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold px-2 mb-1.5">{group.label}</p>
                                    {group.items.map(item => (
                                        item.href ? (
                                            <a
                                                key={item.id}
                                                href={item.href}
                                                className="w-full text-left px-2 py-2 text-sm text-slate-600 hover:text-slate-900 block"
                                            >
                                                {item.label}
                                            </a>
                                        ) : (
                                            <button
                                                key={item.id}
                                                onClick={() => scrollTo(item.id)}
                                                className="w-full text-left px-2 py-2 text-sm text-slate-600 hover:text-slate-900"
                                            >
                                                {item.label}
                                            </button>
                                        )
                                    ))}
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </header>

            {/* Hero - Clean and Focused */}
            <section className="py-16 px-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-4">{airlinesSector.label}</p>
                    <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-6 text-slate-900">
                        Close the <span className="text-red-600">recognition gap</span>.<br />
                        Surface your <span className="text-red-600">expectations</span>. Pull <span className="text-red-600">aligned pilots</span>.
                    </h1>
                    <p className="text-slate-600 text-base max-w-2xl mx-auto mb-8">
                        Stop drowning in mismatched applications. Build a pipeline of pilots who already understand your needs and have positioned themselves accordingly.
                    </p>
                    <div className="flex flex-wrap justify-center gap-4">
                        <button onClick={() => scrollTo('problem')} className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                            See the Problem →
                        </button>
                        <button onClick={() => scrollTo('contact')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold px-6 py-3 rounded-xl transition-colors text-sm">
                            Request Access
                        </button>
                    </div>
                </div>
            </section>

            {/* Stats Banner */}
            <section className="py-8 px-6 bg-slate-900 text-white">
                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                        <div>
                            <p className="text-3xl font-bold text-red-400">80%</p>
                            <p className="text-slate-400 text-xs mt-1">of applications are just inquiries about expectations</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-400">$50K</p>
                            <p className="text-slate-400 text-xs mt-1">average pilot training investment sitting unused</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-400">2-3yr</p>
                            <p className="text-slate-400 text-xs mt-1">instructor position backup — Batch of 2015 still waiting</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-red-400">90%</p>
                            <p className="text-slate-400 text-xs mt-1">cost reduction with pre-aligned pilot pipeline</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* PRICING - Moved to top */}
            <section id="pricing" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-8">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Enterprise Access</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Post Pathways. Gain Interest Insights. Pull <span className="text-red-600">PilotRecognition</span><span className="text-red-600">+</span> Profiles.</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto mb-8">
                            Transform how you recruit. Publish your expectations once. Receive aligned, pre-qualified pilot interest continuously.
                        </p>
                    </div>

                    {/* Value Props */}
                    <div className="grid md:grid-cols-3 gap-6 mb-12 max-w-4xl mx-auto">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Post Pathway Cards</h3>
                            <p className="text-slate-600 text-xs">Publish detailed expectations, requirements, and competencies for pilots to self-align</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Gain Interest Insights</h3>
                            <p className="text-slate-600 text-xs">See which pilots have expressed interest, their Recognition Score, and alignment metrics</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                </svg>
                            </div>
                            <h3 className="font-bold text-slate-900 text-sm mb-1">Pull Verified Profiles</h3>
                            <p className="text-slate-600 text-xs">Access <span className="text-red-600 font-semibold">PilotRecognition</span><span className="text-red-600 font-semibold">+</span> users with background verification already complete</p>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                                <p className="text-slate-500 text-sm">For operators exploring the platform</p>
                            </div>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-slate-900">$0</span>
                                <span className="text-slate-500 text-sm">/year</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Post public Pathway Cards
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    View pilot profiles
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Basic matching insights
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    See free member interest
                                </li>
                            </ul>
                            <button onClick={() => scrollTo('contact')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors">
                                Get Started Free
                            </button>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </div>
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                                <p className="text-slate-500 text-sm">For active recruitment operations</p>
                            </div>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-red-600">$1,000</span>
                                <span className="text-slate-500 text-sm">/year</span>
                            </div>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Everything in Free, plus:
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Pull API access
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Unlimited profile pulls
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Advanced filtering & analytics
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    EBT video access
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Priority support
                                </li>
                            </ul>
                            <div className="bg-slate-50 rounded-lg p-3 mb-6">
                                <p className="text-xs text-slate-600 text-center">
                                    Absolutely no success or placement fees.
                                </p>
                            </div>
                            <button onClick={() => scrollTo('contact')} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors">
                                Request Enterprise Access
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-4xl mx-auto">
                        <p className="text-slate-800 text-sm text-center">
                            <span className="font-semibold text-emerald-700">Cost Comparison:</span> Traditional agency placement for a G650 Captain averages <span className="font-semibold">$50,000</span>. With PilotRecognition Enterprise, your annual cost is just <span className="font-semibold text-red-600">$1,000</span>—a massive saving in search and networking costs.
                        </p>
                    </div>
                </div>
            </section>

            {/* 1. THE PROBLEM */}
            <section id="problem" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">01. The Problem</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">The Recognition Gap</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Pilots with thousands of hours stand unrecognized outside, while operators inside struggle to find qualified candidates.
                        </p>
                    </div>

                    <div className="mb-10">
                        <img 
                            src="/recogntion.png" 
                            alt="The Recognition Gap illustration" 
                            className="w-full max-w-xl mx-auto rounded-xl shadow-lg"
                        />
                        <p className="text-slate-500 text-xs text-center mt-3">
                            The paradox of modern aviation recruitment costs the industry millions in lost talent and misplaced opportunities.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-red-50 border border-red-200 rounded-xl p-5">
                            <p className="text-red-700 text-[10px] uppercase tracking-widest font-bold mb-2">The Pilot Paradox</p>
                            <p className="text-slate-700 text-xs leading-relaxed">
                                Job boards list "500 hours" but hide the real competencies you need: type ratings, turbine experience, CRM skills. Pilots apply blind, operators get mismatched candidates.
                            </p>
                        </div>
                        <div className="bg-orange-50 border border-orange-200 rounded-xl p-5">
                            <p className="text-orange-700 text-[10px] uppercase tracking-widest font-bold mb-2">The Time Drain</p>
                            <p className="text-slate-700 text-xs leading-relaxed">
                                80% of applications to charter operators aren't applications at all—they're questions about requirements. Part 135 operators need pilots yesterday, not time to mentor.
                            </p>
                        </div>
                        <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                            <p className="text-amber-700 text-[10px] uppercase tracking-widest font-bold mb-2">The Hidden Cost</p>
                            <p className="text-slate-700 text-xs leading-relaxed">
                                Traditional agencies charge 15-25% of annual salary ($50K+ for a G650 Captain). You pay premium prices for a reactive, manual process that repeats every hire.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 2. COMPARISON: Traditional vs Current vs Our Approach */}
            <section id="comparison" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">02. The Comparison</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Three Approaches to Pilot Recruitment</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Understanding how traditional methods, current job boards, and PilotRecognition differ in approach and outcomes.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-3 gap-6">
                        {/* Traditional Agencies */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-slate-200 rounded-lg flex items-center justify-center text-slate-600 font-bold text-sm">1</div>
                                <h3 className="text-lg font-bold text-slate-900">Traditional Agencies</h3>
                            </div>
                            <p className="text-slate-500 text-xs mb-4">Executive search for aviation</p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <span className="text-slate-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">15-25% of annual salary fee</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-slate-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">60-90 day reactive search</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-slate-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">Manual vetting, one-off process</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-slate-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">No pipeline between hires</p>
                                </div>
                            </div>
                            
                            <div className="bg-slate-100 rounded-lg p-3">
                                <p className="text-slate-700 text-xs font-semibold">Cost: $50,000+ per placement</p>
                            </div>
                        </div>

                        {/* Job Boards */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-sm">2</div>
                                <h3 className="text-lg font-bold text-slate-900">Job Boards</h3>
                            </div>
                            <p className="text-slate-500 text-xs mb-4">Post and pray model</p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <span className="text-orange-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">Generic "500 hours" listings</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-orange-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">High volume, low quality matches</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-orange-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">80% inquiries, not applications</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-orange-400 text-xs">•</span>
                                    <p className="text-slate-600 text-xs">Hidden competencies remain hidden</p>
                                </div>
                            </div>
                            
                            <div className="bg-orange-50 rounded-lg p-3">
                                <p className="text-orange-700 text-xs font-semibold">Result: Time wasted on mismatches</p>
                            </div>
                        </div>

                        {/* PilotRecognition */}
                        <div className="bg-white border-2 border-red-200 rounded-2xl p-6 relative">
                            <div className="absolute -top-3 left-6 bg-red-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                Our Approach
                            </div>
                            <div className="flex items-center gap-2 mb-4 mt-2">
                                <div className="w-8 h-8 bg-red-100 rounded-lg flex items-center justify-center text-red-600 font-bold text-sm">3</div>
                                <h3 className="text-lg font-bold text-slate-900">PilotRecognition</h3>
                            </div>
                            <p className="text-slate-500 text-xs mb-4">Permanent recruitment infrastructure</p>
                            
                            <div className="space-y-3 mb-6">
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span>
                                    <p className="text-slate-600 text-xs">$1,000/year flat</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span>
                                    <p className="text-slate-600 text-xs">30-45 day proactive pipeline</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span>
                                    <p className="text-slate-600 text-xs">Automated verification & matching</p>
                                </div>
                                <div className="flex items-start gap-2">
                                    <span className="text-emerald-500 text-xs">✓</span>
                                    <p className="text-slate-600 text-xs">Always-on pre-aligned interest pool</p>
                                </div>
                            </div>
                            
                            <div className="bg-emerald-50 rounded-lg p-3">
                                <p className="text-emerald-700 text-xs font-semibold">Cost: 90% reduction per placement</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 3. MODERN APPROACH - How We Solve It */}
            <section id="approach" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">03. The Modern Approach</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">How It Works</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            A neutral infrastructure that serves both sides of the aviation market—operators and pilots—with transparency and alignment.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-red-600">1</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Define Your Pathway</h3>
                            <p className="text-slate-600 text-xs">
                                Publish clear, structured expectations—hours, type ratings, competencies, behavioral profiles. No more hidden requirements.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-red-600">2</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Pilots Align Themselves</h3>
                            <p className="text-slate-600 text-xs">
                                Pilots see exactly what you need and position their profiles to match before they ever reach you. Self-selection reduces noise.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="w-16 h-16 bg-red-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                                <span className="text-2xl font-bold text-red-600">3</span>
                            </div>
                            <h3 className="text-lg font-bold text-slate-900 mb-2">Pull Qualified Matches</h3>
                            <p className="text-slate-600 text-xs">
                                Access pre-qualified interest from pilots who already understand your needs. Ranked by Recognition Score—objective readiness metrics.
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-6 text-center">Example: Gulfstream G650 Pathway Card</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Hard Competencies</p>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-slate-700 text-sm">Total Time</span>
                                        <span className="text-slate-900 font-semibold text-sm">3,500+ hrs | PIC: 3,000+</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-slate-700 text-sm">Type Rating</span>
                                        <span className="text-slate-900 font-semibold text-sm">G650 Current, 200+ hrs</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2 border-b border-slate-200">
                                        <span className="text-slate-700 text-sm">Tech Stack</span>
                                        <span className="text-slate-900 font-semibold text-sm">EFVS, MATRIX Software</span>
                                    </div>
                                    <div className="flex justify-between items-center py-2">
                                        <span className="text-slate-700 text-sm">Compliance</span>
                                        <span className="text-slate-900 font-semibold text-sm">90-day currency, Part 135</span>
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold mb-3">Soft Competencies</p>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 text-xs mt-1">●</span>
                                        <p className="text-slate-700 text-sm">UHNW Service: Polished, high-discretion communication</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 text-xs mt-1">●</span>
                                        <p className="text-slate-700 text-sm">Global Reach: Oceanic crossings, ETOPS routing</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 text-xs mt-1">●</span>
                                        <p className="text-slate-700 text-sm">Charter Agility: Ad-hoc, short-notice readiness</p>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-red-500 text-xs mt-1">●</span>
                                        <p className="text-slate-700 text-sm">Immediate Availability: Ready to fly today</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Airline X Cadet Program Pathway Card Example */}
                    <div className="bg-gradient-to-br from-slate-900 via-blue-950 to-slate-900 border border-blue-900/30 rounded-2xl p-8 mt-8 shadow-2xl">
                        <h3 className="text-xl font-bold text-white mb-6 text-center">Example: Airline X Cadet Program <span className="text-red-500">Pathway Card</span></h3>
                        
                        {/* Card Header with Image and Basic Info */}
                        <div className="flex flex-col md:flex-row gap-6 mb-8">
                            <div className="w-full md:w-1/3">
                                <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-xl h-48 flex items-center justify-center shadow-lg shadow-blue-900/40 border border-blue-500/30">
                                    <span className="text-white text-6xl">✈️</span>
                                </div>
                            </div>
                            <div className="w-full md:w-2/3">
                                <div className="flex items-center gap-3 mb-3">
                                    <span className="bg-blue-500/20 border border-blue-400/30 text-blue-300 px-3 py-1 rounded-full text-xs font-semibold">92% Match</span>
                                    <span className="bg-white/10 border border-white/20 text-white px-3 py-1 rounded-full text-xs font-semibold backdrop-blur-sm">PR Score: 78/100</span>
                                </div>
                                <h4 className="text-2xl font-bold text-white mb-2">Airline X <span className="text-blue-400">Cadet Program</span></h4>
                                <p className="text-slate-300 text-sm mb-4">
                                    Structured cadet pathway from zero experience to First Officer. <span className="text-red-400 font-medium">Sponsored type rating training</span>, guaranteed interview upon completion, and direct employment track to the flight deck.
                                </p>
                                <div className="flex flex-wrap gap-2">
                                    <span className="bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs backdrop-blur-sm">0-250 Hours</span>
                                    <span className="bg-white/5 border border-white/10 text-slate-300 px-3 py-1 rounded-full text-xs backdrop-blur-sm">PPL Accepted</span>
                                    <span className="bg-red-500/20 border border-red-400/30 text-red-400 px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">Sponsored TR</span>
                                </div>
                            </div>
                        </div>

                        {/* ───────────────────────────────────────────────────────────────
                            AIRLINE INPUT: What pilots need to align to
                        ─────────────────────────────────────────────────────────────── */}
                        <div className="mt-6 bg-blue-950/80 border border-blue-800/30 rounded-xl p-6 backdrop-blur-lg">
                            <div className="flex items-center gap-2 mb-4">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                                    </svg>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">How to Align Your Profile — What Airline X is Looking For</p>
                            </div>

                            <p className="text-slate-300 text-sm mb-6 bg-slate-900/60 border border-slate-700 rounded-lg p-3 backdrop-blur-sm">
                                <strong className="text-white">Pilots:</strong> Use this section to understand exactly what Airline X requires and how to position your profile for success. Meet these requirements to maximize your Recognition Score and application priority.
                            </p>

                            {/* Step 1: Meet Hard Requirements */}
                            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">1</span>
                                    <p className="text-sm font-bold text-slate-900">Meet These Hard Requirements First</p>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">These are non-negotiable minimums. Your application will be automatically filtered if you don't meet these.</p>
                                <div className="grid md:grid-cols-2 gap-3">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-700 text-sm">Flight Hours</span>
                                        <span className="text-slate-900 font-semibold text-sm">0-250 hrs</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-700 text-sm">License</span>
                                        <span className="text-slate-900 font-semibold text-sm">PPL Minimum</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-700 text-sm">Medical</span>
                                        <span className="text-slate-900 font-semibold text-sm">Class 1</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-700 text-sm">Age</span>
                                        <span className="text-slate-900 font-semibold text-sm">18-35 Years</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <span className="text-slate-700 text-sm">Education</span>
                                        <span className="text-slate-900 font-semibold text-sm">High School</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <span className="text-slate-700 text-sm">Commitment</span>
                                        <span className="text-slate-900 font-semibold text-sm">18-24 Months</span>
                                    </div>
                                </div>
                            </div>

                            {/* Step 2: Build Hard Competencies */}
                            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">2</span>
                                    <p className="text-sm font-bold text-slate-900">Build These Hard Competencies to Boost Your Score</p>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">Each competency you add increases your Recognition Score. Log these in your profile to stand out.</p>
                                <div className="grid md:grid-cols-3 gap-3">
                                    <div className="bg-slate-50 rounded-lg p-3 border border-slate-200">
                                        <p className="text-xs font-bold text-slate-900 mb-1">High Value (+5-8 Points)</p>
                                        <ul className="text-xs text-slate-700 space-y-1">
                                            <li>• Multi-Engine Rating</li>
                                            <li>• Instrument Rating (IR)</li>
                                            <li>• CPL Complete</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-100 rounded-lg p-3 border border-slate-200">
                                        <p className="text-xs font-bold text-slate-800 mb-1">Medium Value (+3-5 Points)</p>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            <li>• Night Flying 10+ hrs</li>
                                            <li>• Cross-Country Experience</li>
                                            <li>• ICAO Level 5+ English</li>
                                        </ul>
                                    </div>
                                    <div className="bg-slate-200 rounded-lg p-3 border border-slate-300">
                                        <p className="text-xs font-bold text-slate-700 mb-1">Required Base (+0, Must Have)</p>
                                        <ul className="text-xs text-slate-600 space-y-1">
                                            <li>• ICAO Level 4 English</li>
                                            <li>• Current Medical</li>
                                            <li>• PPL License</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Step 3: Demonstrate Soft Competencies */}
                            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">3</span>
                                    <p className="text-sm font-bold text-slate-900">Demonstrate These Soft Competencies</p>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">These appear in your EBT video interview and mentor evaluations. Develop these traits to score higher.</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-900 text-xs mt-1">●</span>
                                        <div>
                                            <p className="text-slate-900 text-sm font-semibold">Learning Agility</p>
                                            <p className="text-xs text-slate-500">Show rapid absorption of complex systems during training</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-900 text-xs mt-1">●</span>
                                        <div>
                                            <p className="text-slate-900 text-sm font-semibold">CRM Skills</p>
                                            <p className="text-xs text-slate-500">Collaborative communication, receptive to feedback</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <span className="text-slate-900 text-xs mt-1">●</span>
                                        <div>
                                            <p className="text-slate-900 text-sm font-semibold">Resilience</p>
                                            <p className="text-xs text-slate-500">Handle setbacks constructively during intensive phases</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 4: Hit The Profile Requirements */}
                            <div className="bg-white border border-slate-200 rounded-lg p-5 mb-4 shadow-lg">
                                <div className="flex items-center gap-2 mb-4">
                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">4</span>
                                    <p className="text-sm font-bold text-slate-900">Hit These Profile Requirements to Get Interviewed</p>
                                </div>
                                <p className="text-xs text-slate-500 mb-4">Your Recognition Profile must meet these thresholds to advance. Here's what to aim for:</p>
                                <div className="grid md:grid-cols-3 gap-4">
                                    <div className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-center">
                                        <p className="text-xs font-bold text-slate-900 mb-2">Minimum PR Score</p>
                                        <p className="text-3xl font-bold text-slate-900">72+</p>
                                        <p className="text-xs text-slate-500 mt-2">Below 72 = Waitlisted</p>
                                        <p className="text-xs text-red-600 font-semibold">Target: 75+ for priority</p>
                                    </div>
                                    <div className="bg-slate-100 border border-slate-200 rounded-lg p-4 text-center">
                                        <p className="text-xs font-bold text-slate-800 mb-2">Profile Recency</p>
                                        <p className="text-3xl font-bold text-slate-900">90 Days</p>
                                        <p className="text-xs text-slate-500 mt-2">Update hours monthly</p>
                                        <p className="text-xs text-slate-400">Stale profiles deprioritized</p>
                                    </div>
                                    <div className="bg-slate-50 border-2 border-red-300 rounded-lg p-4 text-center">
                                        <p className="text-xs font-bold text-slate-900 mb-2">Recognition+ Status</p>
                                        <p className="text-3xl font-bold text-red-600">✓ VERIFIED</p>
                                        <p className="text-xs text-slate-500 mt-2">Background check complete</p>
                                        <p className="text-xs text-slate-600 font-semibold">78% of successful cadets</p>
                                    </div>
                                </div>
                                <div className="mt-4 bg-slate-50 border border-slate-200 rounded-lg p-4">
                                    <p className="text-xs font-bold text-slate-900 mb-3">How Your Profile Score Determines Your Queue:</p>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <div>
                                                <p className="text-slate-900 font-semibold">Recognition+ Users with PR Score 75+</p>
                                                <p className="text-xs text-slate-500"><strong className="text-slate-900">Immediate interview scheduling.</strong> Background verified via Veremark. No additional screening. 60% faster onboarding.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-amber-500 mt-0.5">~</span>
                                            <div>
                                                <p className="text-slate-900 font-semibold">Free Members with PR Score 72-74</p>
                                                <p className="text-xs text-slate-500"><strong className="text-slate-700">Standard queue.</strong> Background check required before interview. 2-3 week additional processing.</p>
                                            </div>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-400 mt-0.5">○</span>
                                            <div>
                                                <p className="text-slate-900 font-semibold">Below PR Score 72</p>
                                                <p className="text-xs text-slate-500"><strong className="text-slate-400">Waitlisted.</strong> Re-apply after profile improvement or upgrade to Recognition+.</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Step 5: The Expectations */}
                            <div className="bg-slate-100 border border-slate-200 rounded-lg p-5">
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 bg-slate-900 text-white rounded-full text-xs font-bold flex items-center justify-center">5</span>
                                    <p className="text-sm font-bold text-slate-900">Understand The Airline's Mindset</p>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Airline X seeks cadets who demonstrate <strong className="text-slate-900">unwavering commitment to professional aviation standards</strong>. Show exceptional discipline, adaptability to high-tempo operations, and a collaborative mindset. Demonstrate consistent flight progression, strong academic aptitude, and resilience. If you embody these traits — and your profile reflects them — you'll transition directly to First Officer on modern narrow-body aircraft.
                                </p>
                                <div className="mt-4 flex flex-wrap gap-2">
                                    <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">Show discipline in logbook consistency</span>
                                    <span className="bg-white border border-slate-200 text-slate-700 px-3 py-1 rounded-full text-xs font-semibold shadow-sm">Demonstrate progression month-over-month</span>
                                    <span className="bg-red-50 border border-red-200 text-red-700 px-3 py-1 rounded-full text-xs font-semibold">Complete profile verification (Recognition+)</span>
                                </div>
                            </div>
                        </div>

                        {/* ───────────────────────────────────────────────────────────────
                            PILOT EXPECTATIONS: What pilots want to know
                        ─────────────────────────────────────────────────────────────── */}
                        <div className="mt-6 bg-blue-950/80 border border-blue-800/30 rounded-xl p-6 backdrop-blur-lg">
                            <div className="flex items-center gap-2 mb-6">
                                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/40">
                                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <p className="text-[10px] uppercase tracking-widest text-blue-300 font-bold">Pilot Expectations — What You Want to Know</p>
                            </div>

                            <div className="grid md:grid-cols-2 gap-6">
                                {/* Career Outcomes */}
                                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-lg">
                                    <p className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wide">Career Outcomes</p>
                                    <div className="space-y-3">
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-900 text-xs mt-1">●</span>
                                            <p className="text-slate-600 text-sm"><strong className="text-slate-900">Trajectory:</strong> Cadet → First Officer → Captain (6-8 year track)</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-900 text-xs mt-1">●</span>
                                            <p className="text-slate-600 text-sm"><strong className="text-slate-900">Captain Upgrade:</strong> Command at 4,000+ hours with airline</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-900 text-xs mt-1">●</span>
                                            <p className="text-slate-600 text-sm"><strong className="text-slate-900">Employment Rate:</strong> 90% hired upon TR completion</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-slate-900 text-xs mt-1">●</span>
                                            <p className="text-slate-600 text-sm"><strong className="text-slate-900">Airline Type:</strong> Narrow-body fleet (A320/B737)</p>
                                        </div>
                                    </div>
                                </div>

                                {/* What's Included */}
                                <div className="bg-white border border-slate-200 rounded-lg p-5 shadow-lg">
                                    <p className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wide">What's Included</p>
                                    <div className="space-y-2">
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <p className="text-slate-600 text-sm"><strong className="text-slate-900">Sponsored Type Rating</strong> ($35K value)</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <p className="text-slate-600 text-sm">Guaranteed First Officer interview</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <p className="text-slate-600 text-sm">ATP-CTP course included</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <p className="text-slate-600 text-sm">Medical insurance during training</p>
                                        </div>
                                        <div className="flex items-start gap-2">
                                            <span className="text-green-600 mt-0.5">✓</span>
                                            <p className="text-slate-600 text-sm">Accommodation assistance provided</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Your Recognition Score Target */}
                            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-5 shadow-lg">
                                <p className="text-xs font-bold text-slate-900 mb-4 uppercase tracking-wide">Your Recognition Score — Where Do You Stand?</p>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div className="bg-slate-400 h-2 rounded-full" style={{ width: '35%' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-600">0-100 Hours (Ab Initio)</span>
                                        </div>
                                        <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-semibold">PR Score: 70-75</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div className="bg-slate-500 h-2 rounded-full" style={{ width: '52%' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-600">100-200 Hours (PPL Holder)</span>
                                        </div>
                                        <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-semibold">PR Score: 75-78</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100 bg-slate-50 rounded px-2 -mx-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '70%' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-900 font-medium">200-250 Hours (CPL Ready) ← Target Zone</span>
                                        </div>
                                        <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded text-xs font-semibold">PR Score: 78-82</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2 border-b border-slate-100">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div className="bg-slate-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-600">250+ Hours (Multi/Instrument)</span>
                                        </div>
                                        <span className="bg-slate-100 border border-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-semibold">PR Score: 82-88</span>
                                    </div>
                                    <div className="flex items-center justify-between py-2">
                                        <div className="flex items-center gap-3">
                                            <div className="w-24 bg-slate-200 rounded-full h-2">
                                                <div className="bg-green-500 h-2 rounded-full" style={{ width: '95%' }}></div>
                                            </div>
                                            <span className="text-sm text-slate-600">Instructor Rating (CFI/CFII)</span>
                                        </div>
                                        <span className="bg-green-50 border border-green-200 text-green-700 px-2 py-1 rounded text-xs font-semibold">PR Score: 85-92</span>
                                    </div>
                                </div>
                                <p className="text-xs text-slate-400 mt-4 italic">
                                    Higher PR Scores = Priority interview scheduling + stronger candidacy
                                </p>
                            </div>

                            {/* Questions Pilots Ask */}
                            <div className="mt-4 bg-white border border-slate-200 rounded-lg p-5 shadow-lg">
                                <p className="text-xs font-bold text-slate-900 mb-3 uppercase tracking-wide">Common Pilot Questions — Answered</p>
                                <div className="grid md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <p className="font-semibold text-slate-700 text-xs mb-1">Q: Is the type rating sponsored or bonded?</p>
                                        <p className="text-slate-500">A: Fully sponsored. 3-year service commitment after line assignment.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-xs mb-1">Q: Can I choose my base?</p>
                                        <p className="text-slate-500">A: Bases assigned by operational need. Preferences considered.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-xs mb-1">Q: What if I fail a training phase?</p>
                                        <p className="text-slate-500">A: One remediation allowed per phase. 94% completion rate.</p>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-700 text-xs mb-1">Q: Is salary during training?</p>
                                        <p className="text-slate-500">A: Training stipend $2,500/month. Full FO salary upon completion.</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Salary Progression */}
                        <div className="mt-8 pt-8 border-t border-slate-700">
                            <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold mb-4 text-center">Salary Progression (USD)</p>
                            <div className="grid grid-cols-5 gap-4 text-center">
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-xs text-slate-400 mb-1">Year 1</p>
                                    <p className="text-lg font-bold text-white">$45K</p>
                                    <p className="text-[10px] text-slate-500">Trainee/Instructor</p>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-xs text-slate-400 mb-1">Year 3</p>
                                    <p className="text-lg font-bold text-white">$65K</p>
                                    <p className="text-[10px] text-slate-500">First Officer</p>
                                </div>
                                <div className="bg-slate-800/50 border border-slate-700 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-xs text-slate-400 mb-1">Year 5</p>
                                    <p className="text-lg font-bold text-slate-300">$95K</p>
                                    <p className="text-[10px] text-slate-500">Senior FO</p>
                                </div>
                                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-xs text-blue-300 mb-1">Year 7</p>
                                    <p className="text-lg font-bold text-blue-400">$140K</p>
                                    <p className="text-[10px] text-blue-300">Captain Upgrade</p>
                                </div>
                                <div className="bg-green-500/20 border border-green-400/30 rounded-lg p-4 backdrop-blur-sm">
                                    <p className="text-xs text-green-300 mb-1">Year 10</p>
                                    <p className="text-lg font-bold text-green-400">$200K+</p>
                                    <p className="text-[10px] text-green-300">Senior Captain</p>
                                </div>
                            </div>
                        </div>

                        {/* CTA */}
                        <div className="mt-8 text-center">
                            <p className="text-slate-400 text-sm mb-4">
                                Pilots see this complete breakdown before expressing interest. <span className="text-white font-semibold">No more "what do you require?" inquiries.</span>
                            </p>
                            <button className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-xl text-sm font-semibold transition-all shadow-lg shadow-blue-900/40">
                                View Full Pathway Template →
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* 4. OUR MISSION */}
            <section id="mission" className="py-16 px-6 border-b border-slate-200 bg-gradient-to-b from-slate-50 to-white">
                <div className="max-w-4xl mx-auto text-center">
                    <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">04. Our Mission</p>
                    <h2 className="text-2xl md:text-3xl font-bold mb-6 text-slate-900">From Push to Pull</h2>
                    <p className="text-slate-600 text-base leading-relaxed mb-8">
                        {airlinesSector.mission}
                    </p>
                    <div className="grid md:grid-cols-3 gap-6">
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-red-600 font-bold">1</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Close the Gap</h3>
                            <p className="text-slate-600 text-xs">Eliminate the recognition gap between pilots and flight departments through transparency.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-red-600 font-bold">2</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Surface Expectations</h3>
                            <p className="text-slate-600 text-xs">Force transparency with Pathway Cards that show exactly what operators value.</p>
                        </div>
                        <div className="bg-white border border-slate-200 rounded-xl p-5 text-center">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-3">
                                <span className="text-red-600 font-bold">3</span>
                            </div>
                            <h3 className="font-bold text-slate-900 mb-2">Enable Pull</h3>
                            <p className="text-slate-600 text-xs">Shift from blind applications to pre-qualified, aligned pilot interest.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* DATA-DRIVEN PROOF POINTS */}
            <section id="metrics" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Workforce Analytics</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">From "Gut Feeling" to Data-Driven Recruitment</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Modern aviation recruitment demands metrics, not intuition. Our infrastructure delivers measurable ROI.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 mb-12">
                        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                            <p className="text-5xl font-bold text-red-400 mb-2">30-45</p>
                            <p className="text-sm font-semibold mb-1">Days Time-to-Fill</p>
                            <p className="text-slate-400 text-xs">vs. 60-90 days with traditional agencies</p>
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-emerald-400 text-xs font-semibold">50% faster placement</p>
                            </div>
                        </div>
                        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                            <p className="text-5xl font-bold text-red-400 mb-2">$3,500</p>
                            <p className="text-sm font-semibold mb-1">Cost-per-Hire</p>
                            <p className="text-slate-400 text-xs">vs. $50,000 average agency fee</p>
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-emerald-400 text-xs font-semibold">93% cost reduction</p>
                            </div>
                        </div>
                        <div className="bg-slate-900 text-white rounded-2xl p-8 text-center">
                            <p className="text-5xl font-bold text-red-400 mb-2">80%</p>
                            <p className="text-sm font-semibold mb-1">Inquiry Reduction</p>
                            <p className="text-slate-400 text-xs">of "what do you require?" questions eliminated</p>
                            <div className="mt-4 pt-4 border-t border-slate-700">
                                <p className="text-emerald-400 text-xs font-semibold">Pathway Cards = clarity</p>
                            </div>
                        </div>
                    </div>

                    <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-6">
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0">
                                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                </svg>
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-900 mb-2">The Pull Model Advantage</h3>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    Traditional recruitment is reactive: post a job, wait for applications, filter through hundreds of unqualified candidates. Our infrastructure is proactive: pilots see your Pathway Card, self-align their profiles, and express interest only when qualified. The result? <span className="font-semibold text-emerald-700">Pre-qualified candidates who meet your exact specifications before they ever contact you.</span>
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* TIME-TO-FLIGHT METRIC */}
                    <div className="mt-8 bg-slate-900 rounded-2xl p-8">
                        <h3 className="text-lg font-bold text-white mb-6 text-center">Time-to-Flight: The Speed Advantage</h3>
                        <div className="grid md:grid-cols-2 gap-8">
                            <div className="border border-slate-700 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-800 rounded-full flex items-center justify-center">
                                        <span className="text-slate-400 font-bold">A</span>
                                    </div>
                                    <h4 className="font-bold text-slate-300">Traditional Agency</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Post & wait</span>
                                        <span className="text-slate-500 text-xs">Day 1-14</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Filter applications</span>
                                        <span className="text-slate-500 text-xs">Day 15-30</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Background checks</span>
                                        <span className="text-slate-500 text-xs">Day 31-60</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-slate-400 text-sm">Vetting & interviews</span>
                                        <span className="text-slate-500 text-xs">Day 61-90</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-700">
                                    <p className="text-slate-400 text-sm text-center">Total: <span className="text-slate-300 font-bold">60-90 days</span></p>
                                </div>
                            </div>

                            <div className="border-2 border-red-600 rounded-xl p-6 bg-slate-800/50">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold">PR</span>
                                    </div>
                                    <h4 className="font-bold text-white">PilotRecognition</h4>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center">
                                        <span className="text-white text-sm">Pre-aligned candidates</span>
                                        <span className="text-red-400 text-xs">Always ready</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white text-sm">Pre-verified (PR+)</span>
                                        <span className="text-red-400 text-xs">Background done</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white text-sm">Technical evaluation</span>
                                        <span className="text-red-400 text-xs">Day 1-7</span>
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-white text-sm">Ready for flight deck</span>
                                        <span className="text-red-400 text-xs">Day 8-14</span>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-red-600">
                                    <p className="text-white text-sm text-center">Total: <span className="text-red-400 font-bold">&lt;14 days</span></p>
                                </div>
                            </div>
                        </div>
                        <p className="text-slate-400 text-xs text-center mt-6">
                            The difference? <span className="text-red-400 font-semibold">PilotRecognition+ users</span> are pre-verified and pre-aligned. You skip the 60-day vetting phase entirely.
                        </p>
                    </div>
                </div>
            </section>

            {/* DE-RISKING: COMPLIANCE & VERIFICATION */}
            <section id="compliance" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Safety & Compliance</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">De-Risking Your Hiring Process</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Safety and compliance are non-negotiable. We verify what matters before pilots reach your inbox.
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8 mb-12">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">Compliance Verification Pipeline</h3>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 text-xs font-bold">1</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">TSA Background Checks</p>
                                        <p className="text-slate-600 text-xs">Secure Flight and Known Crewmember status verification</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 text-xs font-bold">2</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">FAA Medical Certification</p>
                                        <p className="text-slate-600 text-xs">Current Class 1 or 2 medical validation with expiration alerts</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 text-xs font-bold">3</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Drug & Alcohol Testing</p>
                                        <p className="text-slate-600 text-xs">DOT-compliant testing records and random program enrollment</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-red-600 text-xs font-bold">4</span>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">License & Rating Verification</p>
                                        <p className="text-slate-600 text-xs">Direct integration with FAA Airmen Database for real-time validation</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-6">The "Verified" Badge</h3>
                            <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 border border-emerald-200 rounded-xl p-6 mb-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-emerald-500 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900">Verified Pilot</p>
                                        <p className="text-slate-600 text-xs">All compliance checks complete</p>
                                    </div>
                                </div>
                                <p className="text-slate-700 text-sm leading-relaxed">
                                    When you see this badge, the pilot has completed background verification, medical certification validation, and document authentication. <span className="font-semibold text-emerald-700">You can bypass the risky initial vetting stage and move directly to technical evaluation.</span>
                                </p>
                            </div>
                            <div className="space-y-3">
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    <span>Reduce compliance verification time by 60%</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    <span>Eliminate document fraud risk</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    <span>Pre-validated candidates only</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ATS INTEGRATION */}
            <section id="integrations" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">HR Tech Stack</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Integrates With Your Existing Systems</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            No data silos. No manual exports. Connect PilotRecognition to your current ATS and HR infrastructure.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">Greenhouse</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">Lever</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">Workday</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">SAP SuccessFactors</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">BambooHR</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">iCIMS</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">Jobvite</span>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-6 flex items-center justify-center h-24">
                            <span className="font-bold text-slate-700">+ Custom API</span>
                        </div>
                    </div>

                    <div className="bg-slate-900 text-white rounded-2xl p-8">
                        <div className="grid md:grid-cols-3 gap-8">
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4" />
                                    </svg>
                                </div>
                                <h3 className="font-bold mb-2">Pull API</h3>
                                <p className="text-slate-400 text-xs">Sync qualified candidates directly into your ATS candidate pool</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold mb-2">Webhook Events</h3>
                                <p className="text-slate-400 text-xs">Real-time notifications when qualified pilots express interest</p>
                            </div>
                            <div className="text-center">
                                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                    </svg>
                                </div>
                                <h3 className="font-bold mb-2">Single Source of Truth</h3>
                                <p className="text-slate-400 text-xs">All pilot data, documents, and verification status in one connected system</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* COMPLIANCE & DATA FLOW */}
            <section id="dataflow" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Interoperability</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Verified Data Flows Directly to Your HR Systems</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            In 2026, digital identity and touchless credentials are the standard. PilotRecognition data integrates seamlessly with your existing infrastructure—no manual exports, no data re-entry, no compliance gaps.
                        </p>
                    </div>

                    <div className="bg-white border border-slate-200 rounded-2xl p-8 mb-8">
                        <h3 className="text-lg font-bold text-slate-900 mb-8 text-center">Two Tiers, Your Choice: Free Members vs. <span className="text-red-600">PilotRecognition</span><span className="text-red-600">+</span> Users</h3>
                        
                        <div className="grid md:grid-cols-2 gap-8">
                            {/* Free Tier Path */}
                            <div className="border border-slate-200 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center">
                                        <span className="text-slate-600 font-bold">F</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-slate-900">Free Member Path</h4>
                                        <p className="text-slate-500 text-xs">You control the vetting</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-slate-400 font-bold text-xs">1</span>
                                        <p className="text-slate-600 text-xs">Pilot creates profile with self-reported hours, ratings, and experience</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-slate-400 font-bold text-xs">2</span>
                                        <p className="text-slate-600 text-xs">Expresses interest in your Pathway Card based on visible requirements</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-slate-400 font-bold text-xs">3</span>
                                        <p className="text-slate-600 text-xs">You receive interest notification with profile data (hours, ratings, recency)</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-slate-400 font-bold text-xs">4</span>
                                        <p className="text-slate-600 text-xs">Your team conducts background checks and verification (you control the process)</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-slate-200">
                                    <p className="text-slate-500 text-xs italic">Best for: Operators with existing vetting infrastructure who want broader candidate reach</p>
                                </div>
                            </div>

                            {/* PilotRecognition+ Tier Path */}
                            <div className="border-2 border-red-600 bg-slate-900 rounded-xl p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-10 h-10 bg-red-600 rounded-full flex items-center justify-center">
                                        <span className="text-white font-bold text-xs">PR+</span>
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-white"><span className="text-red-500">PilotRecognition</span><span className="text-red-500">+</span> User Path</h4>
                                        <p className="text-red-400 text-xs">Pre-vetted, verified, ready to onboard</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-xs">1</span>
                                        <p className="text-white text-xs">Pilot completes background verification via screening partner network (5-year employment, identity, criminal checks)</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-xs">2</span>
                                        <p className="text-white text-xs">Digital credentials created: FAA medical, type ratings, TSA status converted to touchless-ready format</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-xs">3</span>
                                        <p className="text-white text-xs">Verified data packet auto-syncs to your ATS (Workday, iCIMS, Greenhouse) via API</p>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <span className="text-red-500 font-bold text-xs">4</span>
                                        <p className="text-white text-xs">HR receives pre-validated candidate—bypass initial vetting entirely, proceed to technical evaluation</p>
                                    </div>
                                </div>
                                <div className="mt-4 pt-4 border-t border-red-600">
                                    <p className="text-red-400 text-xs italic">Best for: Operators who want to eliminate vetting overhead and accelerate time-to-fill</p>
                                </div>
                            </div>
                        </div>

                        <div className="mt-8 pt-8 border-t border-slate-200">
                            <div className="bg-slate-100 rounded-xl p-4">
                                <p className="text-slate-700 text-sm text-center">
                                    <span className="font-semibold">You decide:</span> Access both tiers or filter to <span className="text-red-600">PilotRecognition</span><span className="text-red-600">+</span> only. Set your own risk tolerance—see all candidates or only pre-verified professionals.
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-slate-900 text-white rounded-2xl p-8">
                            <h3 className="text-lg font-bold mb-4">The <span className="text-red-400">PilotRecognition</span><span className="text-red-400">+</span> Advantage</h3>
                            <p className="text-slate-300 text-sm mb-6">
                                <span className="text-red-400">PilotRecognition</span><span className="text-red-400">+</span> users have completed the full verification stack before entering your funnel. For 2026's touchless airport environments, this means:
                            </p>
                            <ul className="space-y-3 text-sm">
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span>Pre-cleared for secure airport access on day one</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span>Digital ID credentials compatible with biometric gates</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span>5-year employment history verified via screening partner</span>
                                </li>
                                <li className="flex items-start gap-3">
                                    <span className="text-emerald-400">✓</span>
                                    <span>Zero manual vetting required by your HR team</span>
                                </li>
                            </ul>
                            <div className="mt-6 pt-6 border-t border-slate-700">
                                <p className="text-slate-400 text-xs">
                                    <span className="text-slate-400">Free tier:</span> Pilots with live profiles but unverified backgrounds. You conduct your own checks.
                                </p>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-4">Interoperability for 2026</h3>
                            <p className="text-slate-600 text-sm mb-6">
                                As airlines adopt touchless identity and digital credentials, PilotRecognition ensures your recruitment infrastructure stays ahead:
                            </p>
                            <div className="space-y-4">
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Biometric-Ready Profiles</p>
                                        <p className="text-slate-600 text-xs">Pilot data formatted for touchless ID systems and biometric access control</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Real-Time Compliance Sync</p>
                                        <p className="text-slate-600 text-xs">Medical expiry, recency, and rating changes update automatically in your HR system</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                                        <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">API-First Architecture</p>
                                        <p className="text-slate-600 text-xs">Native integrations with Workday, iCIMS, SAP—no middleware required</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* STAKEHOLDER FOCUS */}
            <section id="stakeholders" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">For Decision Makers</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Built for Every Stakeholder</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Different priorities. One platform that serves them all.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">For Chief Pilots</h3>
                            <p className="text-slate-600 text-sm mb-4">Technical competency verification and CRM assessment</p>
                            <ul className="space-y-2 text-xs text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">●</span>
                                    Aircraft-specific type rating validation
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">●</span>
                                    EBT/CBTA behavioral assessment scores
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">●</span>
                                    CRM and teamwork profile evaluation
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-blue-500">●</span>
                                    Recency and currency verification
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">For HR Managers</h3>
                            <p className="text-slate-600 text-sm mb-4">Efficiency, compliance, and reduced administrative burden</p>
                            <ul className="space-y-2 text-xs text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500">●</span>
                                    80% reduction in inquiry volume
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500">●</span>
                                    Pre-verified candidate pipeline
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500">●</span>
                                    Automated background check integration
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-emerald-500">●</span>
                                    ATS sync eliminates double data entry
                                </li>
                            </ul>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <h3 className="text-lg font-bold text-slate-900 mb-3">For CFOs</h3>
                            <p className="text-slate-600 text-sm mb-4">Predictable costs and measurable ROI</p>
                            <ul className="space-y-2 text-xs text-slate-700">
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">●</span>
                                    $1,000 vs. $50,000 per placement
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">●</span>
                                    Flat annual subscription model
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">●</span>
                                    98% cost reduction vs. agencies
                                </li>
                                <li className="flex items-start gap-2">
                                    <span className="text-amber-500">●</span>
                                    No long-term contracts required
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            {/* SUCCESS STORIES */}
            <section id="cases" className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Results</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Proven Outcomes</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Real results from operators who shifted to the Pull model.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-lg">R</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Regional Airline</p>
                                    <p className="text-slate-500 text-xs">12-aircraft fleet, Part 135</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">-18%</p>
                                    <p className="text-xs text-slate-600">Attrition</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-600">-40%</p>
                                    <p className="text-xs text-slate-600">Time-to-Fill</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">94%</p>
                                    <p className="text-xs text-slate-600">Retention</p>
                                </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                "Pathway Cards eliminated the 'what do you need?' phone calls. Pilots arrive pre-qualified and already understand our operation. First-year attrition dropped from 22% to 4%."
                            </p>
                        </div>

                        <div className="bg-gradient-to-br from-slate-50 to-slate-100 border border-slate-200 rounded-2xl p-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                    <span className="text-red-600 font-bold text-lg">P</span>
                                </div>
                                <div>
                                    <p className="font-bold text-slate-900">Private Jet Operator</p>
                                    <p className="text-slate-500 text-xs">Gulfstream & Challenger fleet</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 mb-4">
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-red-600">-45%</p>
                                    <p className="text-xs text-slate-600">Hiring Cost</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-emerald-600">22</p>
                                    <p className="text-xs text-slate-600">Days to Hire</p>
                                </div>
                                <div className="text-center">
                                    <p className="text-2xl font-bold text-blue-600">100%</p>
                                    <p className="text-xs text-slate-600">Type Rated</p>
                                </div>
                            </div>
                            <p className="text-slate-700 text-sm leading-relaxed">
                                "The Recognition Score filtering is game-changing. Every candidate we've hired through the platform already had the type rating and 500+ hours in type. Zero training delays."
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* 5. BENEFITS - What You Get */}
            <section id="benefits" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">05. Benefits</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">What You Get</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Four core capabilities that transform how you recruit pilots.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-3">Matching</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Aircraft-specific type rating matching
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Pre-qualified interest pool
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Recognition Score ranking
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Live profile data always current
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-3">Filtering</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Immediate availability filters
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Free vs verified member distinction
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Background check integration
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Risk control in your hands
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-3">Transparency</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Pathway Cards public expectations
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Reduced inquiry volume
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Clear pilot positioning guidance
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    No hidden requirements
                                </li>
                            </ul>
                        </div>
                        <div className="bg-slate-50 border border-slate-200 rounded-xl p-5">
                            <p className="text-red-600 text-[10px] uppercase tracking-widest font-bold mb-3">Control</p>
                            <ul className="space-y-2">
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    You decide free vs <span className="text-red-600">PilotRecognition</span><span className="text-red-600">+</span>
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Weighted scoring customization
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Outcome tracking & analytics
                                </li>
                                <li className="flex items-start gap-2 text-xs text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    ATS integration ready
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Why Pilots Win Too */}
                    <div className="bg-red-50 border border-red-200 rounded-2xl p-8">
                        <h3 className="text-xl font-bold text-slate-900 mb-4 text-center">Why Pilots Win Too</h3>
                        <div className="grid md:grid-cols-2 gap-6">
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2 text-sm">For Pilots, This Means:</h4>
                                <ul className="space-y-2">
                                    {airlinesSector.pilots.map((p, i) => (
                                        <li key={i} className="flex items-start gap-2 text-xs text-slate-700">
                                            <span className="text-red-500">●</span>
                                            {p}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div>
                                <h4 className="font-semibold text-slate-900 mb-2 text-sm">The Bottom Line</h4>
                                <p className="text-slate-700 text-xs leading-relaxed">
                                    When pilots know exactly what you need, they either align themselves to match—or self-select out. Either way, you waste less time on mismatches. The pilots who do reach out are already qualified, interested, and ready.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* 6. PRICING */}
            <section id="pricing" className="py-16 px-6 border-b border-slate-200 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">06. Pricing</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Simple, Transparent Pricing</h2>
                        <p className="text-slate-600 text-base max-w-2xl mx-auto">
                            Infrastructure pricing—not headhunter fees. Predictable costs, better outcomes.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Free Tier */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-8">
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Free</h3>
                                <p className="text-slate-500 text-sm">For operators exploring the platform</p>
                            </div>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-slate-900">$0</span>
                                <span className="text-slate-500 text-sm">/year</span>
                            </div>
                            <ul className="space-y-3 mb-8">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Post public Pathway Cards
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    View pilot profiles
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Basic matching insights
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    See free member interest
                                </li>
                            </ul>
                            <button onClick={() => scrollTo('contact')} className="w-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold py-3 rounded-xl transition-colors">
                                Get Started Free
                            </button>
                        </div>

                        {/* Enterprise Tier */}
                        <div className="bg-white border-2 border-red-200 rounded-2xl p-8 relative">
                            <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[10px] font-bold px-4 py-1 rounded-full uppercase tracking-wider">
                                Recommended
                            </div>
                            <div className="text-center mb-6">
                                <h3 className="text-xl font-bold text-slate-900 mb-2">Enterprise</h3>
                                <p className="text-slate-500 text-sm">For active recruitment operations</p>
                            </div>
                            <div className="text-center mb-6">
                                <span className="text-4xl font-bold text-red-600">$1,000</span>
                                <span className="text-slate-500 text-sm">/year</span>
                            </div>
                            <ul className="space-y-3 mb-4">
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Everything in Free, plus:
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Pull API access
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Unlimited profile pulls
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Advanced filtering & analytics
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    EBT video access
                                </li>
                                <li className="flex items-start gap-2 text-sm text-slate-700">
                                    <span className="text-emerald-500">✓</span>
                                    Priority support
                                </li>
                            </ul>
                            <div className="bg-slate-50 rounded-lg p-3 mb-6">
                                <p className="text-xs text-slate-600 text-center">
                                    Absolutely no success or placement fees.
                                </p>
                            </div>
                            <button onClick={() => scrollTo('contact')} className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-3 rounded-xl transition-colors">
                                Request Enterprise Access
                            </button>
                        </div>
                    </div>

                    <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-xl p-6 max-w-4xl mx-auto">
                        <p className="text-slate-800 text-sm text-center">
                            <span className="font-semibold text-emerald-700">Cost Comparison:</span> Traditional agency placement for a G650 Captain averages <span className="font-semibold">$50,000</span>. With PilotRecognition Enterprise, your annual cost is just <span className="font-semibold text-red-600">$1,000</span>—a massive saving in search and networking costs.
                        </p>
                    </div>
                </div>
            </section>

            {/* 7. CONTACT FORM */}
            <section id="contact" className="py-16 px-6 bg-white">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-10">
                        <p className="text-[10px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">07. Get Started</p>
                        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-slate-900">Request Enterprise Access</h2>
                        <p className="text-slate-600 text-base max-w-xl mx-auto">
                            Join the operators moving from "Push" to "Pull" recruitment. Build your Pathway Card today.
                        </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
                        <form className="space-y-6" onSubmit={(e) => { e.preventDefault(); alert('Thank you for your interest. Our team will contact you shortly.'); }}>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Company Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="Your airline or operator name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Fleet Type</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="e.g., A320, G650, Challenger 350" />
                                </div>
                            </div>
                            <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Your Name</label>
                                    <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="Full name" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 mb-2">Work Email</label>
                                    <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="you@company.com" />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-slate-700 mb-2">Message (Optional)</label>
                                <textarea rows={4} className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:border-red-500 focus:ring-2 focus:ring-red-200 outline-none transition-all" placeholder="Tell us about your recruitment challenges or questions..."></textarea>
                            </div>
                            <button type="submit" className="w-full bg-red-600 hover:bg-red-500 text-white font-semibold py-4 rounded-xl transition-colors text-base">
                                Submit Request →
                            </button>
                            <p className="text-slate-500 text-xs text-center">
                                Our team will respond within 24 hours. Syncs with your existing ATS and recruitment workflow.
                            </p>
                        </form>
                    </div>
                </div>
            </section>

            {/* ─── FOOTER ─── */}
            <footer className="bg-slate-900 text-white py-12 px-6">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-red-400 font-semibold mb-4">Enterprise</p>
                            <ul className="space-y-2">
                                <li><a href="/enterprise-access#solutions" className="text-slate-400 hover:text-white text-sm transition-colors">Solutions Overview</a></li>
                                <li><a href="/enterprise-access#partners" className="text-slate-400 hover:text-white text-sm transition-colors">Partnership Tiers</a></li>
                                <li><a href="/enterprise-access#why" className="text-slate-400 hover:text-white text-sm transition-colors">Why PilotRecognition</a></li>
                                <li><a href="/enterprise-access#contact" className="text-slate-400 hover:text-white text-sm transition-colors">Request Access</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-red-400 font-semibold mb-4">Solutions</p>
                            <ul className="space-y-2">
                                <li><a href="/enterprise-access/airlines" className="text-slate-400 hover:text-white text-sm transition-colors">Airlines & Operators</a></li>
                                <li><a href="/enterprise-access#flightschools" className="text-slate-400 hover:text-white text-sm transition-colors">Flight Schools & ATOs</a></li>
                                <li><a href="/enterprise-access#privatejet" className="text-slate-400 hover:text-white text-sm transition-colors">Private Jet & Charter</a></li>
                                <li><a href="/enterprise-access#evtol" className="text-slate-400 hover:text-white text-sm transition-colors">Air Taxi & eVTOL</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-red-400 font-semibold mb-4">Resources</p>
                            <ul className="space-y-2">
                                <li><a href="https://pilotrecognition.com" className="text-slate-400 hover:text-white text-sm transition-colors">Main Platform</a></li>
                                <li><a href="/enterprise-access/learn-more" className="text-slate-400 hover:text-white text-sm transition-colors">Learn More</a></li>
                                <li><a href="mailto:enterprise@pilotrecognition.com" className="text-slate-400 hover:text-white text-sm transition-colors">Contact Partnerships</a></li>
                            </ul>
                        </div>
                        <div>
                            <p className="text-[11px] uppercase tracking-[0.3em] text-red-400 font-semibold mb-4">PilotRecognition</p>
                            <p className="text-slate-400 text-sm mb-4">Connecting Pilots to the Industry. Enterprise solutions for aviation recruitment and talent management.</p>
                            <div className="flex gap-4">
                                <a href="https://pilotrecognition.com" className="text-slate-400 hover:text-white transition-colors">
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 7v10c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V7l-10-5z"/></svg>
                                </a>
                            </div>
                        </div>
                    </div>
                    <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <span className="font-bold text-white">
                                <span className="text-slate-300">Pilot</span><span className="text-red-400">Recognition</span>
                            </span>
                            <span className="text-[10px] uppercase tracking-widest border border-slate-600 px-1.5 py-0.5 rounded text-slate-400">Enterprise</span>
                        </div>
                        <p className="text-slate-400 text-sm">© 2024 PilotRecognition. All rights reserved.</p>
                        <a href="https://pilotrecognition.com" className="text-red-400 hover:text-red-300 text-sm transition-colors">← pilotrecognition.com</a>
                    </div>
                </div>
            </footer>
            </div>
        </>
    );
};

export default AirlinesOperatorsPage;
