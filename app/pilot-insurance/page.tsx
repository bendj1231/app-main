'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const INSURANCE_CATEGORIES = [
    {
        id: 'loss-of-license',
        icon: '🛡️',
        label: 'Loss of License Cover',
        color: 'blue',
        tagline: 'Income protection when medical issues ground your career.',
        pain: 'A pilot\'s career can end overnight due to a medical issue. Loss of license insurance is supposed to protect against this, but traditional policies often have gaps: they may not cover partial medical downgrades, mental health conditions, or the gap between losing your medical and finding alternative employment.',
        solution: 'Comprehensive loss of license coverage designed for aviation professionals. Our partner policies cover full and partial medical certificate loss, including mental health conditions, with faster payouts and career transition support built in.',
        benefits: [
            'Full medical certificate loss — 100% payout on permanent loss',
            'Partial downgrade coverage — proportional payout for reduced class',
            'Mental health inclusion — depression, anxiety, PTSD covered',
            'Temporary loss coverage — income protection during medical suspension',
            'Fast-track claims — verified medical data speeds payouts',
            'Career transition support — funding for alternative aviation careers',
            'Worldwide coverage — protects regardless of where medical issued',
            'Tax-efficient structures — optimize payout for your jurisdiction',
        ],
        pilots: [
            'Protect your income if medical issues end your flying career',
            'Get faster payouts with verified medical data from your profile',
            'Coverage that understands aviation medical requirements',
        ],
        cta: 'Get a personalized loss of license quote.',
    },
    {
        id: 'life-insurance',
        icon: '❤️',
        label: 'Life Insurance',
        color: 'rose',
        tagline: 'Family protection with pilot-aware underwriting.',
        pain: 'Pilots often face higher life insurance premiums due to perceived occupational risk. Traditional underwriters don\'t understand that commercial aviation is statistically safe, and they may not account for your health, experience level, or the type of flying you do.',
        solution: 'Life insurance from providers who understand aviation. We connect pilots with underwriters who use actual flight data, Recognition Scores, and verified health metrics to offer fair premiums based on real risk, not stereotypes.',
        benefits: [
            'Aviation-aware underwriting — fair assessment of actual risk',
            'Recognition Score integration — high scores mean better rates',
            'Flexible coverage amounts — from family protection to estate planning',
            'Term and whole life options — match your career stage',
            'Accelerated underwriting — verified data speeds approval',
            'Multi-jurisdiction policies — for expat and international pilots',
            'Spouse and family coverage — comprehensive protection',
            'Business protection — key person coverage for flight school owners',
        ],
        pilots: [
            'Life insurance priced on your actual aviation risk profile',
            'Better rates for pilots with strong Recognition Scores',
            'Underwriters who understand commercial aviation safety',
        ],
        cta: 'Compare pilot-optimized life insurance.',
    },
    {
        id: 'disability-coverage',
        icon: '🏥',
        label: 'Disability Coverage',
        color: 'amber',
        tagline: 'Short and long-term protection for illness and injury.',
        pain: 'Pilots need specialized disability coverage because a non-aviation injury can still end a flying career. Standard disability policies may not account for the unique medical requirements of holding a Class 1 Medical, leaving gaps in protection.',
        solution: 'Disability insurance that understands the link between general health and aviation medical certification. Coverage bridges the gap between general disability and loss of license, protecting income during any health-related career interruption.',
        benefits: [
            'Short-term disability — 3-6 months income replacement',
            'Long-term disability — extended protection for career impact',
            'Own-occupation coverage — protects your specific ability to fly',
            'Medical certificate bridge — covers gap between general disability and license loss',
            'Rehabilitation support — funding to return to flying fitness',
            'Partial disability options — proportional payout for reduced capacity',
            'Non-aviation injury coverage — protects even if not flying-related',
            'Coordination with loss of license — seamless coverage stacking',
        ],
        pilots: [
            'Protection for any health issue affecting your ability to fly',
            'Coverage that understands Class 1 Medical requirements',
            'Income security during recovery and rehabilitation',
        ],
        cta: 'Explore disability protection options.',
    },
    {
        id: 'professional-liability',
        icon: '⚖️',
        label: 'Professional Liability',
        color: 'violet',
        tagline: 'Legal protection for regulatory defense and incidents.',
        pain: 'Pilots can face legal action from incidents, regulatory enforcement, or allegations of professional error. Legal defense costs can be devastating even when you\'re not at fault. Standard professional liability may not cover aviation-specific situations like regulatory proceedings.',
        solution: 'Professional liability coverage designed for pilots including legal defense for regulatory actions, incident investigations, and professional negligence claims. Protection extends to both employed and freelance/contract pilots.',
        benefits: [
            'Legal defense costs — covers lawyer fees and expert witnesses',
            'Regulatory defense — protects during authority investigations',
            'Incident coverage — legal support for accident investigations',
            'Negligence allegations — defense against professional error claims',
            'License defense — protects your certificate during proceedings',
            'Global coverage — protects regardless of jurisdiction',
            'Contractor coverage — essential for freelance pilots',
            'Settlement coverage — includes damages if required',
        ],
        pilots: [
            'Legal protection during regulatory investigations',
            'Defense coverage even when not at fault',
            'Protection for both employed and freelance pilots',
        ],
        cta: 'Get professional liability coverage.',
    },
    {
        id: 'insurance-providers',
        icon: '🏢',
        label: 'Pilot Insurance Providers',
        color: 'emerald',
        tagline: 'Curated network of aviation-specialized insurance partners.',
        pain: 'Finding insurance providers who truly understand aviation is challenging. Most brokers offer generic policies that don\'t address pilot-specific risks, and comparing options across multiple providers is time-consuming and confusing.',
        solution: 'We\'ve partnered with leading aviation insurance specialists worldwide who understand the unique needs of pilots. Our curated network includes providers offering tailored coverage for loss of license, life, disability, and professional liability with competitive rates.',
        benefits: [
            'Aviation-specialized underwriters only',
            'Pre-negotiated group rates for members',
            'Multi-jurisdiction coverage options',
            'Fast-track claims processing',
            'Verified provider credentials',
            'Policy comparison tools',
            'Member-exclusive discounts',
            'Dedicated aviation claims teams',
        ],
        pilots: [
            'Access insurers who understand your career',
            'Compare quotes from verified providers',
            'Get member-exclusive premium discounts',
            'Work with aviation-specialized claims teams',
        ],
        cta: 'Explore our insurance provider network.',
    },
    {
        id: 'personal-accident',
        icon: '🚑',
        label: 'Personal Accident Cover',
        color: 'orange',
        tagline: '24/7 worldwide protection against accidents and injuries.',
        pain: 'Accidents can happen anywhere — at home, on vacation, or commuting. Standard health insurance may not cover all costs, and recovery from serious injuries can involve expenses that traditional policies miss, like home modifications or long-term care.',
        solution: 'Comprehensive personal accident coverage that pays lump sums for injuries, disabilities, or death resulting from accidents. Covers medical expenses, rehabilitation, and provides financial support during recovery regardless of whether the accident is aviation-related.',
        benefits: [
            'Accidental death benefit — lump sum payout to beneficiaries',
            'Permanent disability coverage — proportional payout for impairment',
            'Temporary disability income — weekly payments during recovery',
            'Medical expense reimbursement — covers deductibles and co-pays',
            'Rehabilitation costs — physical therapy and recovery programs',
            'Home modification coverage — accessibility adaptations',
            '24/7 worldwide protection — covers accidents anywhere',
            'No-fault claims — paid regardless of accident cause',
        ],
        pilots: [
            'Financial protection for any accident, anywhere',
            'Lump sum payments for serious injuries',
            'Coverage for non-aviation accidents too',
            'Support during rehabilitation and recovery',
        ],
        cta: 'Get personal accident coverage.',
    },
    {
        id: 'critical-illness',
        icon: '⚕️',
        label: 'Critical Illness Cover',
        color: 'red',
        tagline: 'Lump sum protection against cancer, heart disease, and serious conditions.',
        pain: 'A critical illness diagnosis can be devastating financially even with health insurance. Out-of-pocket costs, experimental treatments, time off work, and lifestyle changes create massive expenses that traditional medical insurance doesn\'t fully address.',
        solution: 'Critical illness insurance pays a tax-free lump sum upon diagnosis of covered conditions like cancer, heart attack, stroke, and other serious illnesses. Use the funds for anything — medical costs, mortgage payments, experimental treatments, or time off to recover.',
        benefits: [
            'Lump sum payout on diagnosis — immediate financial support',
            'Cancer coverage — all stages and types included',
            'Heart attack and stroke protection — major cardiac events covered',
            'Multiple conditions covered — 30+ critical illnesses included',
            'Survival period waived — paid immediately after diagnosis',
            'Tax-free benefits — full amount received',
            'Use for any purpose — medical bills, mortgage, lifestyle',
            'Family history considerations — tailored for your risk profile',
        ],
        pilots: [
            'Financial security if diagnosed with serious illness',
            'Cover costs health insurance doesn\'t address',
            'Focus on recovery, not finances',
            'Protect your family\'s lifestyle during treatment',
        ],
        cta: 'Explore critical illness options.',
    },
    {
        id: 'travel-insurance',
        icon: '✈️',
        label: 'Pilot Travel Insurance',
        color: 'cyan',
        tagline: 'Specialized coverage for non-duty travel and positioning flights.',
        pain: 'Pilots travel frequently for work and pleasure, but standard travel insurance often excludes aviation professionals or has gaps when traveling on duty, positioning, or commuting to base. Finding comprehensive coverage is frustrating.',
        solution: 'Travel insurance designed for aviation professionals that covers personal trips, positioning flights, and commuting. Includes medical evacuation, trip cancellation, and baggage protection with no aviation exclusions for personal travel.',
        benefits: [
            'No pilot occupation exclusions — coverage for personal travel',
            'Positioning flight protection — covered when commuting to base',
            'Medical evacuation — emergency transport from anywhere',
            'Trip cancellation — reimbursed for covered cancellations',
            'Baggage and equipment — protect personal and professional gear',
            'Rental car coverage — included for destination transport',
            'Adventure sports — optional coverage for active pilots',
            'Annual multi-trip options — frequent traveler savings',
        ],
        pilots: [
            'Travel with confidence for work and leisure',
            'No exclusions for aviation professionals',
            'Coverage during positioning and commuting',
            'Protect your gear and equipment while traveling',
        ],
        cta: 'Get pilot-optimized travel insurance.',
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    rose: { eyebrow: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    violet: { eyebrow: 'text-violet-600', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200', bg: 'bg-violet-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    orange: { eyebrow: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-orange-200', bg: 'bg-orange-50' },
    red: { eyebrow: 'text-red-600', badge: 'bg-red-100 text-red-700 border-red-200', border: 'border-red-200', bg: 'bg-red-50' },
    cyan: { eyebrow: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200', border: 'border-cyan-200', bg: 'bg-cyan-50' },
};

export default function PilotInsurancePage() {
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
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Insurance</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {INSURANCE_CATEGORIES.map(cat => (
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
                            {INSURANCE_CATEGORIES.map(cat => (
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
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Insurance Solutions</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            Pilot Insurance
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Specialized insurance solutions designed for aviation professionals. Protect your career, your income, and your family with coverage that understands the unique risks pilots face.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button 
                                onClick={() => scrollTo('loss-of-license')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Explore Coverage
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
                            <p className="text-sm text-slate-500">Loss protection</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Family</p>
                            <p className="text-sm text-slate-500">Life coverage</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
                            <p className="text-sm text-slate-500">Faster claims</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
                            <p className="text-sm text-slate-500">Worldwide coverage</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Insurance Products</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Complete Protection for Pilots.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">From career-ending medical issues to family protection — insurance designed for the unique risks aviation professionals face.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {INSURANCE_CATEGORIES.map(cat => (
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
            {INSURANCE_CATEGORIES.map((cat, idx) => (
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Protect Your Aviation Career</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Create your free Pilot Recognition profile and access insurance products designed for pilots — with verified data for faster claims and better rates.
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
