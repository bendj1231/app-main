'use client';

import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const PROFILE_CATEGORIES = [
    {
        id: 'digital-logbook',
        icon: '📘',
        label: 'Digital Logbook',
        color: 'blue',
        tagline: 'Modern flight logging that automatically verifies hours and connects to your Recognition Profile.',
        pain: 'Traditional paper logbooks are prone to errors, damage, and loss. Manual hour calculations are tedious and error-prone. When applying to airlines, pilots must manually transcribe hundreds of flight entries, wasting hours and risking mistakes that could cost them opportunities.',
        solution: 'Our digital logbook automatically imports flight data from airline systems, training providers, and major electronic logbook apps. Hours are instantly calculated, categorized by aircraft type, and verified through our authentication network — giving airlines confidence in your experience claims.',
        benefits: [
            'Auto flight import from airline systems',
            'Aircraft type tracking and categorization',
            'Route logging with airport databases',
            'Weather condition integration',
            'Airline partnership verification',
            'Training provider sync capabilities',
            'Fraud prevention through authentication',
            'Instant validation for employers',
        ],
        pilots: [
            'Save hours of manual data entry every month',
            'Never worry about losing your flight records',
            'Get automatic verification that airlines trust',
            'Track progress toward rating requirements',
        ],
    },
    {
        id: 'flight-hours-verification',
        icon: '✅',
        label: 'Flight Hours Verification',
        color: 'teal',
        tagline: 'Independent third-party verification of flight hours that airlines can trust instantly.',
        pain: 'Flight hours are the most critical metric for pilot hiring, yet they are also the most frequently falsified credentials. Airlines spend thousands on background checks and weeks waiting for verification from previous employers. Unverified hour claims create hiring risks and delay career progression for honest pilots.',
        solution: 'Our verification network connects directly with airline crew management systems, training organizations, and logbook apps to authenticate flight hours in real-time. Third-party verification badges on your profile provide instant credibility, eliminating the need for airlines to conduct lengthy manual checks.',
        benefits: [
            'Direct airline system integration',
            'Crew management database verification',
            'Training organization hour confirmation',
            'Electronic logbook app syncing',
            'Third-party verification badges',
            'Real-time authentication status',
            'Hour breakdown by aircraft type',
            'PIC, SIC, and night hours categorization',
        ],
        pilots: [
            'Prove your hours with instant verification',
            'Stand out from unverified candidates',
            'Get hired faster without manual checks',
            'Build trust with verified hour badges',
        ],
    },
    {
        id: 'examination-results',
        icon: '📝',
        label: 'Examination Results',
        color: 'amber',
        tagline: 'Verified test scores and assessments that demonstrate your knowledge and competency.',
        pain: 'Aviation examinations are scattered across multiple authorities, training providers, and time periods. Pilots struggle to maintain comprehensive records of all their certifications, and airlines have no easy way to verify claimed qualifications without lengthy checks.',
        solution: 'All your examination results in one authenticated repository. Tests from aviation authorities, training providers, and internal assessments are automatically verified and displayed with issuing authority confirmation — creating an instant trust signal for employers.',
        benefits: [
            'Aviation authority score verification',
            'Automated score authentication',
            'Instant credibility with employers',
            'No manual result entry required',
            'Foundation program progress tracking',
            'Transition program assessments',
            'Instructor evaluation integration',
            'Skill assessment documentation',
        ],
        pilots: [
            'Prove your knowledge with verified scores',
            'Track progress through training programs',
            'Show continuous learning to employers',
            'Build confidence with authenticated results',
        ],
    },
    {
        id: 'pilot-recognition-profile',
        icon: '👤',
        label: 'Pilot Recognition Profile',
        color: 'emerald',
        tagline: 'Your digital identity in aviation. A live, verified profile that replaces traditional CVs.',
        pain: 'Traditional pilot CVs are static documents that become outdated immediately. Pilots spend countless hours updating PDFs, and airlines receive unverified claims they must manually check. The result is a broken hiring process that frustrates both sides.',
        solution: 'Your Recognition Profile is a living document that combines logbook data, exam results, ratings, and professional background into one unified digital identity. Always current, automatically updated, and instantly verifiable by any airline worldwide.',
        benefits: [
            'Unified single profile for everything',
            'Always current with auto-updates',
            'Multi-device access anywhere',
            'Secure encrypted data storage',
            'Authority-verified credentials only',
            'Fraud-proof authentication system',
            'Trusted by major airlines globally',
            'Instant screening capabilities',
        ],
        pilots: [
            'Replace your CV with something better',
            'Never update a PDF again',
            'Be discovered by airlines worldwide',
            'Prove your qualifications instantly',
        ],
    },
    {
        id: 'type-ratings',
        icon: '✈️',
        label: 'Type Ratings & Endorsements',
        color: 'violet',
        tagline: 'Track and verify every aircraft type rating and special endorsement in your career.',
        pain: 'Type ratings are significant career investments, but tracking them across multiple certificates and jurisdictions is complex. Pilots often discover expired ratings only when applying for jobs, missing opportunities that require specific aircraft qualifications.',
        solution: 'Comprehensive type rating tracking with expiration alerts and renewal reminders. Every rating is verified with training providers, linked to your logbook hours on that type, and visible to airlines searching for specific aircraft experience.',
        benefits: [
            'Complete type rating inventory',
            'Expiration date monitoring',
            'Renewal reminder system',
            'Training provider verification',
            'Logbook hours linked by aircraft',
            'Recency requirement tracking',
            'Cross-jurisdiction validity checks',
            'Currency status dashboard',
        ],
        pilots: [
            'Never miss a rating renewal deadline',
            'Track progress toward new type ratings',
            'Match to jobs requiring your experience',
            'Maintain currency for all aircraft types',
        ],
    },
    {
        id: 'training-records',
        icon: '🎓',
        label: 'Training Records',
        color: 'orange',
        tagline: 'Complete history of all aviation training, from initial license to recurrent checks.',
        pain: 'Training records are scattered across flight schools, training centers, and online platforms. When employers ask for specific training documentation, pilots waste hours searching through emails, filing cabinets, and old certificates.',
        solution: 'Centralized repository for all training records with automatic import from partner schools and training providers. From private pilot license through ATP, every course, check ride, and recurrent training is documented and verified.',
        benefits: [
            'Complete training history in one place',
            'Partner school automatic imports',
            'Course completion verification',
            'Check ride documentation',
            'Recurrent training tracking',
            'Simulator session records',
            'Ground school completion proof',
            'Instructor endorsement logs',
        ],
        pilots: [
            'Find any training record instantly',
            'Prove qualifications to employers fast',
            'Track progress toward career goals',
            'Never lose another certificate',
        ],
    },
    {
        id: 'career-timeline',
        icon: '📈',
        label: 'Career Timeline',
        color: 'cyan',
        tagline: 'Visual journey of your aviation career with milestones, achievements, and progression.',
        pain: 'Pilots build impressive careers over years, but the progression story gets lost in scattered documents. When interviewing, articulating career growth and key milestones requires digging through old records and memory.',
        solution: 'Beautiful visual timeline showing your entire aviation journey. From first solo to airline command, every milestone is captured with dates, verification, and context — ready to share with employers or reflect on your progress.',
        benefits: [
            'Visual career progression display',
            'Key milestone documentation',
            'First solo and check ride dates',
            'Command upgrade tracking',
            'Airline employment history',
            'Achievement date preservation',
            'Professional development logging',
            'Shareable career story format',
        ],
        pilots: [
            'See your entire career at a glance',
            'Share your journey with employers',
            'Track progress toward command',
            'Celebrate milestones along the way',
        ],
    },
    {
        id: 'document-vault',
        icon: '📁',
        label: 'Document Vault',
        color: 'indigo',
        tagline: 'Secure storage for all aviation documents with instant access when you need them.',
        pain: 'Aviation requires constant document access — licenses, medicals, certificates, insurance, contracts. Pilots carry folders of paperwork or scramble through digital files when airlines, authorities, or employers request documentation.',
        solution: 'Military-grade encrypted storage for all aviation documents with intelligent categorization and instant retrieval. Medical certificates, licenses, insurance policies, and employment contracts organized and accessible from any device.',
        benefits: [
            'Encrypted secure cloud storage',
            'Document categorization system',
            'Instant search and retrieval',
            'Mobile access from anywhere',
            'License and certificate storage',
            'Insurance policy documentation',
            'Employment contract archives',
            'Sharing controls for privacy',
        ],
        pilots: [
            'Access any document in seconds',
            'Never carry paper files again',
            'Share securely with employers',
            'Protect important documents safely',
        ],
    },
    {
        id: 'skills-competencies',
        icon: '🎯',
        label: 'Skills & Competencies',
        color: 'rose',
        tagline: 'Detailed breakdown of pilot skills with proficiency ratings and verification.',
        pain: 'Beyond flight hours, pilots develop specific skills — instrument proficiency, crosswind landing expertise, high-altitude operations, CRM abilities. These competencies are invisible on traditional CVs but critical to employers.',
        solution: 'Granular skills tracking with self-assessment, instructor validation, and automated detection from logbook data. Build a comprehensive competency profile that shows employers exactly what you can do beyond just hours flown.',
        benefits: [
            'Granular skill categorization',
            'Self-assessment tools',
            'Instructor validation system',
            'Logbook-derived skill detection',
            'Instrument proficiency tracking',
            'Operation type expertise logging',
            'CRM competency documentation',
            'Proficiency rating visualization',
        ],
        pilots: [
            'Show employers your true capabilities',
            'Identify skills to improve',
            'Get validated by instructors',
            'Stand out with detailed competencies',
        ],
    },
];

const COLOR_CLASSES: Record<string, { eyebrow: string; badge: string; border: string; bg: string }> = {
    blue: { eyebrow: 'text-blue-600', badge: 'bg-blue-100 text-blue-700 border-blue-200', border: 'border-blue-200', bg: 'bg-blue-50' },
    teal: { eyebrow: 'text-teal-600', badge: 'bg-teal-100 text-teal-700 border-teal-200', border: 'border-teal-200', bg: 'bg-teal-50' },
    amber: { eyebrow: 'text-amber-600', badge: 'bg-amber-100 text-amber-700 border-amber-200', border: 'border-amber-200', bg: 'bg-amber-50' },
    emerald: { eyebrow: 'text-emerald-600', badge: 'bg-emerald-100 text-emerald-700 border-emerald-200', border: 'border-emerald-200', bg: 'bg-emerald-50' },
    violet: { eyebrow: 'text-violet-600', badge: 'bg-violet-100 text-violet-700 border-violet-200', border: 'border-violet-200', bg: 'bg-violet-50' },
    orange: { eyebrow: 'text-orange-600', badge: 'bg-orange-100 text-orange-700 border-orange-200', border: 'border-orange-200', bg: 'bg-orange-50' },
    cyan: { eyebrow: 'text-cyan-600', badge: 'bg-cyan-100 text-cyan-700 border-cyan-200', border: 'border-cyan-200', bg: 'bg-cyan-50' },
    indigo: { eyebrow: 'text-indigo-600', badge: 'bg-indigo-100 text-indigo-700 border-indigo-200', border: 'border-indigo-200', bg: 'bg-indigo-50' },
    rose: { eyebrow: 'text-rose-600', badge: 'bg-rose-100 text-rose-700 border-rose-200', border: 'border-rose-200', bg: 'bg-rose-50' },
};

export default function ProfessionalProfilePage() {
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
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">Profile</span>
                            </button>
                        </div>

                        {/* Desktop nav */}
                        <nav className="hidden lg:flex items-center gap-1">
                            {PROFILE_CATEGORIES.slice(0, 5).map(cat => (
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
                                Build Your Profile
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
                            {PROFILE_CATEGORIES.map(cat => (
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
                                    Build Your Profile
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
                        <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Professional Identity</p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 mb-5 leading-tight">
                            Professional Profile
                        </h1>
                        <p className="text-slate-600 text-lg md:text-xl leading-relaxed mb-6 max-w-2xl">
                            Build your comprehensive digital pilot identity with verified credentials, digital logbook, examination results, type ratings, training records, and much more — all in one unified profile that airlines trust.
                        </p>
                        <div className="flex flex-wrap gap-3">
                            <button
                                onClick={() => scrollTo('digital-logbook')}
                                className="bg-red-600 hover:bg-red-500 text-white font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Explore Features
                            </button>
                            <button
                                onClick={() => navigate('/become-member')}
                                className="bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 font-semibold px-6 py-3 rounded-xl transition-all"
                            >
                                Create Your Profile
                            </button>
                        </div>
                    </div>

                    {/* Stat strip */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-12 pt-8 border-t border-slate-200">
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">9</p>
                            <p className="text-sm text-slate-500">Profile components</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Verified</p>
                            <p className="text-sm text-slate-500">Credentials</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Live</p>
                            <p className="text-sm text-slate-500">Auto-updates</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-slate-900 mb-1">Global</p>
                            <p className="text-sm text-slate-500">Visibility</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ─── CATEGORY GRID ─── */}
            <section className="py-16 px-6 border-b border-slate-200 bg-white">
                <div className="max-w-6xl mx-auto">
                    <p className="text-[11px] uppercase tracking-[0.3em] text-red-600 font-semibold mb-3">Profile Components</p>
                    <h2 className="text-3xl md:text-4xl font-bold mb-4 text-slate-900">Everything In One Place.</h2>
                    <p className="text-slate-600 text-lg max-w-2xl mb-10">Eight comprehensive components that create your complete professional pilot identity — from logbook to skills, all verified and always current.</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                        {PROFILE_CATEGORIES.map(cat => (
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
            {PROFILE_CATEGORIES.map((cat, idx) => (
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
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">Build Your Profile Today</h2>
                    <p className="text-slate-300 text-lg mb-8 max-w-2xl mx-auto">
                        Create your comprehensive professional profile and start building your verified pilot identity that airlines worldwide can discover and trust.
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <button
                            onClick={() => navigate('/become-member')}
                            className="bg-red-600 hover:bg-red-500 text-white font-semibold px-8 py-4 rounded-xl transition-all"
                        >
                            Create Your Profile
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
