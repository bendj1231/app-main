'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const VERIFICATION_CATEGORIES = [
    {
        id: 'background-checking',
        icon: '🛡️',
        label: 'Background Checking',
        color: 'slate',
        tagline: 'Comprehensive verification of employment history, criminal records, and professional references.',
        pain: 'Airlines face significant risk when hiring pilots based on unverified CV claims. Fake flight hours, unconfirmed type ratings, and fabricated employment history can cost carriers millions in training investments and safety incidents. Traditional background checks take weeks and cost thousands per candidate.',
        solution: 'Our integrated background verification system provides instant access to authenticated pilot credentials through partnerships with Veremark and global aviation authorities. Airlines receive pre-verified candidate data with confirmed employment history, validated flight hours, and authenticated certificates.',
        benefits: [
            'FBI criminal record checks',
            'Interpol international screening',
            'Aviation security compliance',
            'Global coverage network',
            'Airline employment confirmation',
            'Flight hours validation',
            'Tenure verification',
            'Professional reference checks',
        ],
        pilots: [
            'Get hired faster with pre-verified credentials',
            'Build trust with airlines through authenticated data',
            'Reduce hiring delays from weeks to days',
            'Stand out with verified vs unverified candidates',
        ],
    },
    {
        id: 'passport-visa',
        icon: '🌐',
        label: 'Passport & Visa Status',
        color: 'blue',
        tagline: 'Travel document verification ensuring you can operate internationally without restrictions.',
        pain: 'International flight operations require complex documentation that expires at different times. Pilots frequently discover visa or passport issues only when attempting to report for duty, causing costly flight delays and operational disruptions for airlines.',
        solution: 'Automated tracking and verification of all travel documents with predictive expiration alerts. The system monitors passport validity, work visa status, and required permits across all operating jurisdictions, alerting pilots and employers 90 days before expiration.',
        benefits: [
            'Passport validity monitoring',
            'Blank page count tracking',
            'Expiration alert system (90 days)',
            'Renewal reminder automation',
            'Work authorization verification',
            'Multi-country visa tracking',
            'Crew license validation',
            'Document renewal management',
        ],
        pilots: [
            'Never miss a flight due to expired documents',
            'Stay ahead of renewal deadlines',
            'Operate internationally with confidence',
            'Reduce stress from document management',
        ],
    },
    {
        id: 'security-clearances',
        icon: '🔐',
        label: 'Security Clearances',
        color: 'amber',
        tagline: 'Airport and facility access clearances required for flight operations.',
        pain: 'Security clearance applications are complex, time-consuming, and vary by airport and country. Pilots often face delays starting new positions because clearances take weeks to process, and maintaining multiple clearances across bases creates administrative burden.',
        solution: 'Centralized security clearance management that coordinates applications, tracks status across multiple facilities, and maintains current credentials. Integration with airport authorities streamlines renewal processes and provides real-time clearance status.',
        benefits: [
            'Airside access pass management',
            'Operating base verification',
            'Security training tracking',
            'Automated pass renewal',
            'Federal security screening',
            'Cargo clearance documentation',
            'High-security operation access',
            'Multi-facility coordination',
        ],
        pilots: [
            'Start new positions without clearance delays',
            'Manage all clearances from one dashboard',
            'Automatic renewal processing',
            'Maintain access across multiple bases',
        ],
    },
    {
        id: 'drug-alcohol-records',
        icon: '⚠️',
        label: 'Drug & Alcohol Records',
        color: 'rose',
        tagline: 'Compliance monitoring and testing record verification for aviation safety standards.',
        pain: 'Aviation regulators require strict drug and alcohol testing compliance. Pilots struggle to maintain comprehensive records of all tests across their careers, and airlines need instant verification of compliance history during hiring — delays can cost candidates opportunities.',
        solution: 'Permanent, tamper-proof record of all drug and alcohol testing with instant verification for employers. Integration with testing facilities and aviation medical examiners ensures complete compliance history is always accessible and up-to-date.',
        benefits: [
            'Pre-employment test verification',
            'Random screening documentation',
            'Post-incident test records',
            'Result authentication',
            'FAA compliance tracking',
            'DOT standards adherence',
            'Complete testing history',
            'Clean record certification',
        ],
        pilots: [
            'Prove compliance instantly to employers',
            'Maintain permanent test records',
            'Satisfy regulatory requirements easily',
            'Demonstrate professional standards',
        ],
    },
    {
        id: 'medical-certificates',
        icon: '❤️',
        label: 'Medical Certificates',
        color: 'emerald',
        tagline: 'Aviation medical certification tracking and verification for pilot fitness.',
        pain: 'Medical certificates expire without warning, and finding available Aviation Medical Examiners (AMEs) can be challenging. A lapsed medical grounds pilots immediately, causing income loss and schedule disruptions for airlines.',
        solution: 'Comprehensive medical certificate tracking with predictive expiration alerts and integrated AME booking. The system monitors Class 1, 2, and 3 medicals across all jurisdictions, finds available examiners, and books appointments automatically.',
        benefits: [
            'Class 1 medical tracking (ATP)',
            'Class 2 medical monitoring (Private)',
            'AME verification integration',
            'Expiration date tracking',
            'Global AME finder directory',
            'Booking integration system',
            'Price comparison tool',
            'Availability checking',
        ],
        pilots: [
            'Never fly with an expired medical',
            'Find AMEs quickly when needed',
            'Stay compliant across jurisdictions',
            'Avoid unexpected grounding',
        ],
    },
    {
        id: 'health-resources',
        icon: '💪',
        label: 'Health Resources',
        color: 'purple',
        tagline: 'Support for pilot health, wellness, and medical fitness for duty.',
        pain: 'Pilot health is critical to career longevity, but aviation-specific wellness resources are scarce. Mental health support carries stigma, and maintaining fitness for duty requirements is challenging without proper guidance and tracking tools.',
        solution: 'Comprehensive health and wellness ecosystem designed specifically for aviation professionals. Confidential mental health resources, fitness programs tailored to pilot schedules, and preventive care tracking help maintain medical certification and career longevity.',
        benefits: [
            'Confidential mental health support',
            'Aviation-specialized counseling',
            '24/7 resource availability',
            'Peer support programs',
            'Fitness for duty tracking',
            'Sleep optimization tools',
            'Stress management programs',
            'Preventive care monitoring',
        ],
        pilots: [
            'Access aviation-specific health resources',
            'Maintain fitness for duty standards',
            'Get confidential mental health support',
            'Extend your career through wellness',
        ],
    },
    {
        id: 'air-law-legal',
        icon: '⚖️',
        label: 'Air Law & Legal Protection',
        color: 'indigo',
        tagline: 'Specialized legal support for insurance disputes, employment issues, and regulatory defense.',
        pain: 'Pilots face unique legal challenges that general lawyers don\'t understand — insurance companies denying valid claims, employers exploiting contract loopholes, and regulatory actions threatening their licenses. Many pilots don\'t know where to turn for aviation-specialized legal help, leaving them vulnerable to predatory practices and wrongful treatment.',
        solution: 'Our network of aviation law specialists provides targeted legal support for pilot-specific issues. From disputing insurance claim denials and reviewing employment contracts to defending against regulatory actions and license threats, our verified legal partners understand aviation law and pilot career protection.',
        benefits: [
            'Insurance claim dispute resolution — fight wrongful denials',
            'Predatory policy identification — spot exploitative terms',
            'Employment contract review — protect against unfair clauses',
            'Wrongful termination defense — challenge illegal dismissals',
            'License defense specialists — protect your certificates',
            'Regulatory appeal support — fight authority actions',
            'Incident legal representation — defense during investigations',
            'Aviation law consultation — expert guidance on complex issues',
        ],
        pilots: [
            'Protect yourself from insurance company exploitation',
            'Get contracts reviewed by aviation specialists',
            'Defend your license with expert legal support',
            'Access lawyers who understand pilot careers',
        ],
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    slate: { eyebrow: 'text-slate-600', badge: 'bg-slate-100 text-slate-700 border-slate-200', border: 'border-slate-200', bg: 'bg-slate-50' },
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    rose: { eyebrow: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    purple: { eyebrow: 'text-purple-600', badge: 'bg-purple-100 text-purple-700 border-purple-200', border: 'border-purple-200', bg: 'bg-purple-50' },
    indigo: { eyebrow: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', border: 'border-indigo-200', bg: 'bg-indigo-50' },
};

export default function VerificationBackgroundPage() {
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
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Verification</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {VERIFICATION_CATEGORIES.map(cat => (
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
                                Start Verification
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
                            {VERIFICATION_CATEGORIES.map(cat => (
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
                                    Start Verification
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
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Compliance & Verification</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            Verification & Background Profiling
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Verified credentials, medical certifications, and compliance documentation that airlines require for hiring decisions. Build trust with authenticated data.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => scrollTo('background-checking')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Start Verification
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
                            <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
                            <p className="text-sm text-slate-500">Credentials</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
                            <p className="text-sm text-slate-500">Coverage</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Instant</p>
                            <p className="text-sm text-slate-500">Verification</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Airline</p>
                            <p className="text-sm text-slate-500">Trusted</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Verification Services</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Comprehensive Background Profiling.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">Six essential verification categories that airlines require for confident hiring decisions.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {VERIFICATION_CATEGORIES.map(cat => (
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
            {VERIFICATION_CATEGORIES.map((cat, idx) => (
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Get Verified Today</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Join Pilot Recognition and build your verified compliance profile that airlines trust. Start with a free profile and upgrade for full verification.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/become-member')}
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            Start Verification
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
