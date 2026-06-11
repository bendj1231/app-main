import React, { useState, useEffect } from 'react';
import { ShieldCheck, Clock, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { TopNavbar } from './TopNavbar';
import { LoginModal } from './LoginModal';

interface WhatIsPilotRecognitionPageProps {
    onNavigate: (page: string) => void;
    onLogin?: () => void;
    onJoinUs: () => void;
}

const SERVICES = [
    {
        number: '01',
        tag: 'Credential Verification',
        title: 'Aviation Verification Providers',
        body: 'Your licences, medicals, and logbooks are independently verified by regional aviation authorities through our network of approved verification providers. Every credential is checked against live civil aviation databases — not just reviewed, but confirmed.',
        img: 'https://images.unsplash.com/photo-1583202735974-b4a6f49b8e5c?w=900&q=80&fit=crop',
    },
    {
        number: '02',
        tag: 'Cryptographic Identity',
        title: 'W3C Verifiable Credential Badge',
        body: 'Once verification passes, we issue a cryptographically signed W3C Verifiable Credential to your Pilot Identity Credential (PIC) wallet. This badge cannot be faked, copied, or transferred — it is mathematically tied to your identity.',
        img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&q=80&fit=crop',
    },
    {
        number: '03',
        tag: 'Pathway Activation',
        title: 'Unlock International Airline Gates',
        body: 'Verified pilots gain access to Terminal 3 — our firewalled international standards zone. Premium airline gates, cargo operators, charter companies, and eVTOL operators can only be reached with a confirmed VC badge.',
        img: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=900&q=80&fit=crop',
    },
    {
        number: '04',
        tag: 'Career Intelligence',
        title: 'Recognition+ Score & AI Matching',
        body: 'Your verified profile feeds our AI career matching engine which scores your readiness against live operator requirements. Airlines and operators can scout you before you apply. You stop chasing jobs — they start finding you.',
        img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80&fit=crop',
    },
];

const WHY_POINTS = [
    {
        title: 'Independent, Not Internal',
        body: 'We never touch your documents. Your credentials go directly to the verification provider. We receive only a pass/fail signal — so there is no platform data breach that can compromise your paperwork.',
    },
    {
        title: 'Globally Recognised Standards',
        body: 'Our verification framework aligns with ICAO Annex 1, EASA Part-FCL, FAA 14 CFR Part 61, CAAP Philippines, and GCAA UAE. Your badge carries weight in every jurisdiction.',
    },
    {
        title: 'One Verification, All Pathways',
        body: 'Verify once and your badge opens every airline gate, cargo pathway, charter route, and eVTOL operator in the network simultaneously. No re-submitting to individual airlines.',
    },
    {
        title: 'Annual Refresh Cycle',
        body: 'Verification is renewed each year alongside your licence currency. Your badge stays valid, your profile stays discoverable, and operators always know your credentials are current.',
    },
];

const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1600&q=85&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1600&q=85&fit=crop',
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1600&q=85&fit=crop',
];

const WhatIsPilotRecognitionPage: React.FC<WhatIsPilotRecognitionPageProps> = ({ onNavigate, onLogin, onJoinUs }) => {
    const { currentUser } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
    const [heroIndex, setHeroIndex] = useState(0);
    const [mockTab, setMockTab] = useState<'profile' | 'pathways' | 'verification'>('verification');

    useEffect(() => {
        const t = setInterval(() => setHeroIndex(i => (i + 1) % HERO_IMAGES.length), 5000);
        return () => clearInterval(t);
    }, []);

    return (
        <div className="relative bg-black min-h-screen overflow-x-hidden font-sans">
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isLight={false}
                onLoginModalOpen={() => setIsLoginModalOpen(true)}
            />

            {/* ── HERO ── */}
            <div className="relative z-30 w-full min-h-[600px] md:h-[680px] lg:h-[740px] overflow-hidden flex pt-16">
                <div className="relative z-10 w-full md:w-1/2 flex items-center bg-slate-950 px-8 md:px-14 lg:px-20 py-16 md:py-0">
                    <div className="max-w-lg">
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-5">
                            PilotRecognition · Verification unlocks pathways
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
                            Connecting <span className="text-red-500">pilots</span><br />
                            to the <span className="text-red-500">industry</span> —<br />
                            credential first.
                        </h1>
                        <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
                            Verification is the <span className="text-white font-semibold">first step</span>. One independently audited credential that opens every <span className="text-white font-semibold">airline gate</span>, cargo route, and operator pathway — simultaneously.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <button
                                onClick={onJoinUs}
                                className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg uppercase tracking-wider transition-colors shadow-lg"
                            >
                                Start Verification
                            </button>
                            <button
                                onClick={() => onNavigate('recognition-plus')}
                                className="px-6 py-3 border border-white/30 hover:border-white/60 text-white font-bold text-sm rounded-lg uppercase tracking-wider transition-all hover:bg-white/10"
                            >
                                View Recognition+
                            </button>
                        </div>
                        <div className="flex gap-8 mt-10 pt-8 border-t border-white/10">
                            {[
                                ['3rd-Party Audit', 'Every credential independently verified'],
                                ['W3C Standard', 'Cryptographically signed VC badge'],
                                ['1 Credential', 'All pathways unlocked simultaneously'],
                            ].map(([stat, label]) => (
                                <div key={stat}>
                                    <p className="text-white font-bold text-sm mb-0.5">{stat}</p>
                                    <p className="text-slate-500 text-[10px] leading-tight">{label}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
                <div className="hidden md:block relative w-1/2">
                    {HERO_IMAGES.map((src, i) => (
                        <img key={src} src={src} alt="" className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000" style={{ opacity: i === heroIndex ? 1 : 0 }} />
                    ))}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #020617 0%, rgba(2,6,23,0.55) 28%, transparent 65%)' }} />
                    <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-green-400 text-xs font-bold tracking-wide">VC Badge Issued</p>
                        </div>
                        <p className="text-white/40 text-[10px]">W3C Verifiable Credential · pilotrecognition.com</p>
                    </div>
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {HERO_IMAGES.map((_, i) => (
                            <span key={i} className={`block h-0.5 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MARQUEE TICKER ── */}
            <div className="relative z-30 w-full bg-slate-950 border-y border-white/5 py-4 overflow-hidden">
                <div className="flex gap-10 whitespace-nowrap text-slate-400 text-xs font-medium" style={{ animation: 'ticker 35s linear infinite' }}>
                    {[...Array(2)].flatMap(() => [
                        'Verification unlocks pathways',
                        'W3C Verifiable Credential',
                        'ICAO · EASA · FAA · CAAP · GCAA',
                        'Aviation Verification Providers',
                        'One credential · All airline gates',
                        'Connecting pilots to the industry',
                        'Recognition+ — verified priority pipeline',
                        'Annual credential refresh cycle',
                    ]).map((t, i) => (
                        <span key={i} className="inline-flex items-center gap-4">
                            <span className="w-1 h-1 rounded-full bg-red-500 flex-shrink-0" />
                            {t}
                        </span>
                    ))}
                </div>
                <style>{`@keyframes ticker { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }`}</style>
            </div>

            {/* ── MISSION — white ── */}
            <div className="relative z-30 w-full bg-white px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto">
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-10">Our Mission</p>
                    <div className="grid md:grid-cols-2 gap-16 items-start">
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] mb-8">
                                The aviation industry has always required pilots to prove themselves through <span className="text-red-500">paperwork</span>.
                            </h2>
                            <div className="w-12 h-0.5 bg-red-500 mb-8" />
                            <p className="text-slate-600 text-lg leading-relaxed mb-5">
                                We replaced the paperwork with a <span className="text-slate-900 font-semibold">cryptographic truth</span> — a badge that every airline, every operator, and every authority can verify in seconds without calling anyone.
                            </p>
                            <p className="text-slate-500 text-base leading-relaxed mb-10">
                                When your licence, medical, and logbook hours are independently confirmed and issued as a <span className="text-slate-900 font-semibold">W3C Verifiable Credential</span>, you stop being a candidate on a PDF and start being a verified professional in a live, searchable network.
                            </p>
                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={() => onNavigate('recognition-plus')}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg uppercase tracking-wider transition-colors"
                                >
                                    See Recognition+ Plans
                                </button>
                                <button
                                    onClick={onJoinUs}
                                    className="px-6 py-3 border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm rounded-lg uppercase tracking-wider transition-colors"
                                >
                                    Create Free Account
                                </button>
                            </div>
                        </div>
                        <div className="flex flex-col gap-5">
                            {[
                                { number: '01', title: 'One credential, every gate', body: 'Verify once and your badge opens every airline gate, cargo pathway, charter route, and eVTOL operator in the network simultaneously.' },
                                { number: '02', title: 'We never see your documents', body: 'Your credentials go directly to the independent verification provider. We receive only a pass/fail signal — zero document exposure on our side.' },
                                { number: '03', title: 'Aligned with global standards', body: 'ICAO Annex 1 · EASA Part-FCL · FAA 14 CFR Part 61 · CAAP Philippines · GCAA UAE. Your badge carries weight in every jurisdiction we operate in.' },
                            ].map((card) => (
                                <div key={card.number} className="flex gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-red-100 hover:shadow-sm transition-all">
                                    <span className="text-[10px] font-black text-red-500 tracking-[0.15em] pt-0.5 flex-shrink-0">{card.number}</span>
                                    <div>
                                        <h4 className="text-slate-900 font-bold text-sm mb-1.5">{card.title}</h4>
                                        <p className="text-slate-500 text-sm leading-relaxed">{card.body}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* ── PLATFORM UI MOCK — mirrors HomePage recog6 section ── */}
            <div className="relative z-10 bg-white w-full py-12 md:py-16 overflow-hidden border-t border-slate-100">
                {/* Right-side background mock */}
                <div className="absolute inset-y-0 right-0 hidden md:block w-[48vw] lg:w-[50vw] xl:w-[52vw]">
                    <div
                        className="absolute inset-0 bg-contain bg-right bg-no-repeat"
                        style={{ backgroundImage: "url('/recog6.png')", backgroundColor: '#ffffff' }}
                    />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-[minmax(0,42%)_minmax(0,58%)] gap-8 md:gap-12 items-start">
                        {/* Left — text */}
                        <div className="relative z-10">
                            <p className="text-[12px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">Recognition Dashboard</p>
                            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 mb-4 leading-tight">
                                Keeping your profile <span className="text-red-500">compliant, current,</span> and <span className="text-red-500">operator-ready</span>
                            </h2>
                            <p className="text-slate-600 text-sm md:text-base mb-8 leading-relaxed">
                                This live pilot profile tracks your <span className="font-semibold text-slate-800">last flown time</span>, synced logbook hours, and <span className="font-semibold text-slate-800">credential expiry</span> so your profile stays safe and operator-ready at all times.
                            </p>

                            {/* Mobile mock */}
                            <div className="md:hidden mb-6 w-full h-[200px] overflow-hidden rounded-[28px] bg-slate-100">
                                <img src="/recog6.png" alt="Recognition dashboard" className="w-full h-full object-cover" />
                            </div>

                            <div className="space-y-4 mb-8">
                                {[
                                    { icon: <ShieldCheck className="w-5 h-5 md:w-6 md:h-6" />, title: 'Verification Status', body: 'Real-time status for your credentials, last flown hours, and logbook sync so you always know when your profile is ready for operator review.' },
                                    { icon: <Clock className="w-5 h-5 md:w-6 md:h-6" />, title: 'Gap Analysis', body: 'See where your synced logbook hours, expiring licences, and training credentials align with airline pathways so you can fix gaps before operators evaluate you.' },
                                    { icon: <CheckCircle2 className="w-5 h-5 md:w-6 md:h-6" />, title: 'Operator Pull', body: 'Operators with enterprise access pull directly from the verified system. Submissions are automatically restricted when credentials are about to expire.' },
                                ].map((f) => (
                                    <div key={f.title} className="flex gap-3 items-start rounded-3xl bg-slate-100/80 border border-slate-200 p-4 md:p-5">
                                        <div className="flex-shrink-0 w-11 h-11 md:w-14 md:h-14 rounded-3xl bg-slate-900/5 border border-slate-200 shadow-sm flex items-center justify-center text-slate-900">
                                            {f.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-slate-900 text-base mb-1">{f.title}</h3>
                                            <p className="text-sm text-slate-600 leading-snug">{f.body}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                                <button
                                    onClick={onJoinUs}
                                    className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold text-sm rounded-lg uppercase tracking-wider transition-colors"
                                >
                                    Build Your Profile
                                </button>
                                <button
                                    onClick={() => onNavigate('pilot-recognition')}
                                    className="px-6 py-3 border border-slate-300 hover:border-slate-900 text-slate-900 font-bold text-sm rounded-lg uppercase tracking-wider transition-colors"
                                >
                                    Learn More
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── OUR SERVICES — white ── */}
            <div className="relative z-30 w-full bg-white px-4 md:px-8 py-16 md:py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-4">Our Services</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight max-w-2xl">
                            What <span className="text-red-500">verification</span> actually gives you
                        </h2>
                        <p className="text-slate-500 text-base mt-3 max-w-xl">
                            Four things happen the moment your credentials are confirmed. Each one builds your <span className="font-semibold text-slate-700">visibility inside the industry</span>.
                        </p>
                    </div>
                    <div className="space-y-4">
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.number}
                                className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-2xl flex border border-slate-100 shadow-sm"
                                style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}
                            >
                                <div className="w-full md:w-1/2 flex items-center bg-white px-8 md:px-14 py-10 flex-shrink-0">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-black text-[10px] tracking-[0.2em]">{s.number}</span>
                                            <span className="text-slate-400 text-[10px] uppercase tracking-widest">{s.tag}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-slate-900 mb-3 leading-tight">{s.title}</h3>
                                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">{s.body}</p>
                                    </div>
                                </div>
                                <div className="hidden md:block relative w-1/2 flex-shrink-0">
                                    <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: i % 2 === 1
                                                ? 'linear-gradient(to left, #ffffff 0%, rgba(255,255,255,0.4) 30%, transparent 65%)'
                                                : 'linear-gradient(to right, #ffffff 0%, rgba(255,255,255,0.4) 30%, transparent 65%)',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── WHY VERIFY — white ── */}
            <div className="relative z-30 w-full bg-white px-4 md:px-8 py-16 md:py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-4">Why PilotRecognition</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                                Why verify <span className="text-red-500">with us</span>?
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Not every verification platform is built for pilots. Ours is — built around <span className="font-semibold text-slate-700">protecting you</span>, not just ticking a compliance box for an airline.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                        {WHY_POINTS.map((p, i) => (
                            <div key={p.title} className="border border-slate-100 hover:border-red-100 hover:shadow-md rounded-2xl p-8 transition-all bg-slate-50">
                                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">0{i + 1}</span>
                                <h3 className="text-lg font-bold text-slate-900 mb-3">{p.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {[
                            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80&fit=crop',
                            'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=800&q=80&fit=crop',
                            'https://images.unsplash.com/photo-1602452920335-6a132309c7c8?w=800&q=80&fit=crop',
                        ].map((src, i) => (
                            <div key={i} className="relative rounded-2xl overflow-hidden h-36 md:h-52">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── PATHWAY FLOW — white ── */}
            <div className="relative z-30 w-full bg-white px-4 md:px-8 py-16 md:py-24 border-t border-slate-100">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-4">The Journey</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                            <span className="text-red-500">Verification</span> unlocks pathways
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
                            Every step builds on the last. Verification is the <span className="font-semibold text-slate-700">foundation</span> — everything else sits on top.
                        </p>
                    </div>
                    <div className="grid md:grid-cols-4 gap-4 relative">
                        <div className="hidden md:block absolute top-12 left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-red-400/40 to-transparent" />
                        {[
                            { step: '1', label: 'Create Profile', sub: 'Free account, basic info, flight hours', img: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400&q=80&fit=crop', active: false },
                            { step: '2', label: 'Verify Credentials', sub: 'Licence, medical & logbook independently audited', img: 'https://images.unsplash.com/photo-1583202735974-b4a6f49b8e5c?w=400&q=80&fit=crop', active: true },
                            { step: '3', label: 'VC Badge Issued', sub: 'Cryptographic identity confirmed', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80&fit=crop', active: false },
                            { step: '4', label: 'Pathways Open', sub: 'Airlines, cargo, charter & eVTOL', img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80&fit=crop', active: false },
                        ].map((item) => (
                            <div key={item.step} className={`relative rounded-2xl overflow-hidden border transition-all ${item.active ? 'border-red-200 shadow-lg shadow-red-100' : 'border-slate-100 shadow-sm'}`}>
                                <div className="h-36 relative">
                                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                                    <div className={`absolute inset-0 ${item.active ? 'bg-red-600/20' : 'bg-black/30'}`} />
                                    <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${item.active ? 'bg-red-600 text-white' : 'bg-white text-slate-700'}`}>
                                        {item.step}
                                    </div>
                                    {item.active && (
                                        <span className="absolute top-3 right-3 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Key step</span>
                                    )}
                                </div>
                                <div className={`p-5 ${item.active ? 'bg-red-50' : 'bg-white'}`}>
                                    <h4 className={`font-bold text-sm mb-1 ${item.active ? 'text-red-700' : 'text-slate-900'}`}>{item.label}</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA ── */}
            <div className="relative z-30 w-full px-4 md:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div className="relative overflow-hidden shadow-xl rounded-2xl" style={{ backgroundColor: '#0d1b3e' }}>
                        <div className="absolute inset-0 hidden md:block">
                            <img src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1400&q=80&fit=crop" alt="" className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30" />
                            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, #0d1b3e 45%, rgba(13,27,62,0.6) 70%, transparent 100%)' }} />
                        </div>
                        <div className="relative px-8 py-10 md:px-14 md:py-14 min-h-[280px] flex items-center">
                            <div className="w-full lg:w-7/12">
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-400 mb-4">Your verified career starts here</p>
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight" style={{ color: '#ffffff' }}>
                                    Join the pilots connecting to the industry through <span style={{ color: '#dc2626' }}>verification</span>.
                                </h2>
                                <p className="text-sm md:text-base leading-relaxed max-w-xl mb-6" style={{ color: '#ffffff', opacity: 0.85 }}>
                                    Create your pilot profile for free, verify your credentials with <span style={{ color: '#dc2626' }}>Recognition+</span>, and let the industry find you.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={onJoinUs}
                                        className="px-7 py-3 rounded-xl font-semibold text-sm transition-all hover:opacity-90 text-left"
                                        style={{ backgroundColor: '#ffffff', color: '#0d1b3e' }}
                                    >
                                        <span className="block">Create free account</span>
                                        <span className="block text-xs font-normal mt-1" style={{ color: '#475569' }}>
                                            Get <span style={{ color: '#dc2626' }}>Recognition+</span> verified
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('recognition-plus')}
                                        className="inline-flex items-center justify-center px-7 py-3 rounded-xl font-semibold text-sm transition-all border hover:bg-white/10 text-white"
                                        style={{ border: '1px solid rgba(255,255,255,0.35)' }}
                                    >
                                        View Recognition+ Plans
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onNavigate={onNavigate}
            />
        </div>
    );
};

export default WhatIsPilotRecognitionPage;
