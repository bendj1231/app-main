import React, { useState, useEffect } from 'react';
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

            {/* ── HERO: left text / right image — mirrors HomePage split ── */}
            <div className="relative z-30 w-full min-h-[600px] md:h-[680px] lg:h-[740px] overflow-hidden flex pt-16">

                {/* Left — text */}
                <div className="relative z-10 w-full md:w-1/2 flex items-center bg-slate-950 px-8 md:px-14 lg:px-20 py-16 md:py-0">
                    <div className="max-w-lg">
                        <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-5">
                            PilotRecognition · Verification unlocks pathways
                        </p>
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white leading-[1.05] mb-6 tracking-tight">
                            Connecting pilots<br />
                            to the industry —<br />
                            <span className="text-red-500">credential first.</span>
                        </h1>
                        <p className="text-slate-300 text-base leading-relaxed mb-8 max-w-md">
                            Verification is the first step. One independently audited credential that opens every airline gate, cargo route, and operator pathway in the network — simultaneously.
                        </p>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                            <button
                                onClick={onJoinUs}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-slate-900 font-semibold text-sm rounded-full hover:bg-slate-100 transition-colors shadow-lg group"
                            >
                                <span>Start Verification</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h4m0 0l-2-2m2 2l-2 2" />
                                </svg>
                            </button>
                            <button
                                onClick={() => onNavigate('recognition-plus')}
                                className="inline-flex items-center gap-2 px-6 py-3 text-white text-sm font-semibold rounded-full transition-all hover:bg-white/20"
                                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.18)' }}
                            >
                                View Recognition+
                            </button>
                        </div>

                        {/* Stats row */}
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

                {/* Right — cycling aviation image */}
                <div className="hidden md:block relative w-1/2">
                    {HERO_IMAGES.map((src, i) => (
                        <img
                            key={src}
                            src={src}
                            alt=""
                            className="absolute inset-0 w-full h-full object-cover transition-opacity duration-1000"
                            style={{ opacity: i === heroIndex ? 1 : 0 }}
                        />
                    ))}
                    {/* Gradient fade from left */}
                    <div
                        className="absolute inset-0"
                        style={{ background: 'linear-gradient(to right, #020617 0%, rgba(2,6,23,0.55) 28%, transparent 65%)' }}
                    />
                    {/* VC badge chip */}
                    <div className="absolute bottom-8 right-8 bg-black/70 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-4">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                            <p className="text-green-400 text-xs font-bold tracking-wide">VC Badge Issued</p>
                        </div>
                        <p className="text-white/40 text-[10px]">W3C Verifiable Credential · pilotrecognition.com</p>
                    </div>
                    {/* Image counter */}
                    <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex gap-1.5">
                        {HERO_IMAGES.map((_, i) => (
                            <span key={i} className={`block h-0.5 rounded-full transition-all duration-500 ${i === heroIndex ? 'w-6 bg-white' : 'w-2 bg-white/30'}`} />
                        ))}
                    </div>
                </div>
            </div>

            {/* ── MARQUEE TICKER — mirrors HomePage ── */}
            <div className="relative z-30 w-full bg-slate-950 border-y border-white/5 py-4 overflow-hidden">
                <div className="flex gap-10 whitespace-nowrap text-slate-400 text-xs font-medium" style={{ animation: 'ticker 35s linear infinite' }}>
                    {[...Array(2)].flatMap(() => [
                        'Verification unlocks pathways',
                        'W3C Verifiable Credential',
                        'ICAO · EASA · FAA · CAAP · GCAA',
                        'Third-party document audit',
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

            {/* ── MISSION STATEMENT — white section ── */}
            <div className="relative z-30 w-full bg-white px-4 md:px-8 py-16 md:py-24">
                <div className="max-w-7xl mx-auto">

                    {/* Top label */}
                    <p className="text-[11px] font-bold tracking-[0.25em] uppercase text-red-500 mb-10">Our Mission</p>

                    <div className="grid md:grid-cols-2 gap-16 items-start">

                        {/* Left — headline + body */}
                        <div>
                            <h2 className="text-4xl md:text-5xl font-bold text-slate-900 leading-[1.1] mb-8">
                                The aviation industry has always required pilots to prove themselves through paperwork.
                            </h2>

                            {/* Divider */}
                            <div className="w-12 h-0.5 bg-red-500 mb-8" />

                            <p className="text-slate-600 text-lg leading-relaxed mb-5">
                                We replaced the paperwork with a cryptographic truth — a badge that every airline, every operator, and every authority can verify in seconds without calling anyone.
                            </p>
                            <p className="text-slate-500 text-base leading-relaxed mb-10">
                                When your licence, medical, and logbook hours are independently confirmed and issued as a W3C Verifiable Credential, you stop being a candidate on a PDF and start being a verified professional in a live, searchable network.
                            </p>

                            <button
                                onClick={() => onNavigate('recognition-plus')}
                                className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-sm rounded-full transition-colors group"
                            >
                                <span>See Recognition+ Plans</span>
                                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <circle cx="12" cy="12" r="10" strokeWidth="2" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 12h4m0 0l-2-2m2 2l-2 2" />
                                </svg>
                            </button>
                        </div>

                        {/* Right — 3 stat/fact cards + quote */}
                        <div className="flex flex-col gap-5">
                            {[
                                {
                                    number: '01',
                                    title: 'One credential, every gate',
                                    body: 'Verify once and your badge opens every airline gate, cargo pathway, charter route, and eVTOL operator in the network simultaneously.',
                                },
                                {
                                    number: '02',
                                    title: 'We never see your documents',
                                    body: 'Your credentials go directly to the independent verification provider. We receive only a pass/fail signal — zero document exposure on our side.',
                                },
                                {
                                    number: '03',
                                    title: 'Aligned with global standards',
                                    body: 'ICAO Annex 1 · EASA Part-FCL · FAA 14 CFR Part 61 · CAAP Philippines · GCAA UAE. Your badge carries weight in every jurisdiction we operate in.',
                                },
                            ].map((card) => (
                                <div key={card.number} className="flex gap-5 p-6 rounded-2xl border border-slate-100 bg-slate-50 hover:border-slate-200 transition-all">
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

            {/* ── OUR SERVICES — alternating split layout ── */}
            <div className="relative z-30 w-full bg-slate-950 px-4 md:px-8 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-12">
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">Our Services</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
                            What verification actually gives you
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.number}
                                className="relative w-full h-[280px] md:h-[320px] overflow-hidden rounded-2xl flex"
                                style={{ flexDirection: i % 2 === 1 ? 'row-reverse' : 'row' }}
                            >
                                {/* Text half */}
                                <div className="w-full md:w-1/2 flex items-center bg-slate-900 px-8 md:px-14 py-10 flex-shrink-0">
                                    <div>
                                        <div className="flex items-center gap-3 mb-4">
                                            <span className="text-red-500 font-black text-[10px] tracking-[0.2em]">{s.number}</span>
                                            <span className="text-white/25 text-[10px] uppercase tracking-widest">{s.tag}</span>
                                        </div>
                                        <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-tight">{s.title}</h3>
                                        <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{s.body}</p>
                                    </div>
                                </div>
                                {/* Image half */}
                                <div className="hidden md:block relative w-1/2 flex-shrink-0">
                                    <img src={s.img} alt={s.title} className="absolute inset-0 w-full h-full object-cover" />
                                    <div
                                        className="absolute inset-0"
                                        style={{
                                            background: i % 2 === 1
                                                ? 'linear-gradient(to left, #0f172a 0%, rgba(15,23,42,0.5) 30%, transparent 65%)'
                                                : 'linear-gradient(to right, #0f172a 0%, rgba(15,23,42,0.5) 30%, transparent 65%)',
                                        }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── WHY VERIFY WITH US — dark grid ── */}
            <div className="relative z-30 w-full bg-black px-4 md:px-8 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                        <div>
                            <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">Why PilotRecognition</p>
                            <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                                Why verify with us?
                            </h2>
                        </div>
                        <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                            Not every verification platform is built for pilots. Ours is — and it's built around protecting you, not just ticking a compliance box for an airline.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4 mb-12">
                        {WHY_POINTS.map((p, i) => (
                            <div
                                key={p.title}
                                className="border border-white/5 hover:border-red-500/20 rounded-2xl p-8 transition-all"
                                style={{ background: 'rgba(255,255,255,0.03)' }}
                            >
                                <span className="inline-block text-[10px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">0{i + 1}</span>
                                <h3 className="text-lg font-bold text-white mb-3">{p.title}</h3>
                                <p className="text-slate-500 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Photo strip */}
                    <div className="grid grid-cols-3 gap-3 md:gap-4">
                        {[
                            { src: 'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80&fit=crop', span: 'col-span-1' },
                            { src: 'https://images.unsplash.com/photo-1520437358207-323b43b50729?w=800&q=80&fit=crop', span: 'col-span-1' },
                            { src: 'https://images.unsplash.com/photo-1602452920335-6a132309c7c8?w=800&q=80&fit=crop', span: 'col-span-1' },
                        ].map((img, i) => (
                            <div key={i} className={`${img.span} relative rounded-xl overflow-hidden h-36 md:h-52`}>
                                <img src={img.src} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/25" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── PATHWAY FLOW — mirrors HomePage banner style ── */}
            <div className="relative z-30 w-full bg-slate-950 px-4 md:px-8 py-16 md:py-20">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-12">
                        <p className="text-[11px] font-bold tracking-[0.2em] uppercase text-red-500 mb-4">The Journey</p>
                        <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
                            Verification unlocks pathways
                        </h2>
                        <p className="text-slate-500 text-sm mt-3 max-w-md mx-auto">
                            Every step builds on the last. Verification is the foundation — everything else sits on top.
                        </p>
                    </div>

                    {/* 4 step cards */}
                    <div className="grid md:grid-cols-4 gap-4 relative">
                        <div className="hidden md:block absolute top-12 left-[14%] right-[14%] h-px bg-gradient-to-r from-transparent via-red-600/40 to-transparent" />
                        {[
                            { step: '1', label: 'Create Profile', sub: 'Free account, basic info, flight hours', img: 'https://images.unsplash.com/photo-1569982175971-d92b01cf8694?w=400&q=80&fit=crop', active: false },
                            { step: '2', label: 'Verify Credentials', sub: 'Licence, medical & logbook independently audited', img: 'https://images.unsplash.com/photo-1583202735974-b4a6f49b8e5c?w=400&q=80&fit=crop', active: true },
                            { step: '3', label: 'VC Badge Issued', sub: 'Cryptographic identity confirmed', img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&q=80&fit=crop', active: false },
                            { step: '4', label: 'Pathways Open', sub: 'Airlines, cargo, charter & eVTOL', img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=400&q=80&fit=crop', active: false },
                        ].map((item) => (
                            <div
                                key={item.step}
                                className={`relative rounded-2xl overflow-hidden border transition-all ${item.active ? 'border-red-500/50 shadow-lg shadow-red-500/10' : 'border-white/5'}`}
                            >
                                {/* Image */}
                                <div className="h-36 relative">
                                    <img src={item.img} alt={item.label} className="w-full h-full object-cover" />
                                    <div className={`absolute inset-0 ${item.active ? 'bg-red-600/30' : 'bg-black/50'}`} />
                                    <div className={`absolute top-3 left-3 w-8 h-8 rounded-full flex items-center justify-center text-xs font-black ${item.active ? 'bg-red-600 text-white' : 'bg-slate-800 text-slate-300'}`}>
                                        {item.step}
                                    </div>
                                    {item.active && (
                                        <span className="absolute top-3 right-3 bg-red-600 text-white text-[8px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
                                            Key step
                                        </span>
                                    )}
                                </div>
                                {/* Text */}
                                <div className={`p-5 ${item.active ? 'bg-slate-900' : 'bg-slate-900/60'}`}>
                                    <h4 className="text-white font-bold text-sm mb-1">{item.label}</h4>
                                    <p className="text-slate-500 text-xs leading-relaxed">{item.sub}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── CTA — mirrors HomePage become a member banner ── */}
            <div className="relative z-30 w-full px-4 md:px-8 py-10">
                <div className="max-w-7xl mx-auto">
                    <div
                        className="relative overflow-hidden shadow-xl rounded-2xl"
                        style={{ backgroundColor: '#0d1b3e' }}
                    >
                        {/* Background image right side */}
                        <div className="absolute inset-0 hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1400&q=80&fit=crop"
                                alt=""
                                className="absolute right-0 top-0 h-full w-1/2 object-cover opacity-30"
                            />
                            <div
                                className="absolute inset-0"
                                style={{ background: 'linear-gradient(to right, #0d1b3e 45%, rgba(13,27,62,0.6) 70%, transparent 100%)' }}
                            />
                        </div>

                        <div className="relative px-8 py-10 md:px-14 md:py-14 flex flex-col lg:flex-row items-center gap-8 min-h-[280px]">
                            <div className="w-full lg:w-7/12">
                                <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-red-400 mb-4">Your verified career starts here</p>
                                <h2 className="text-2xl md:text-4xl font-bold mb-4 leading-tight text-white">
                                    Join the pilots connecting to the industry through <span className="text-red-500">verification</span>.
                                </h2>
                                <p className="text-sm md:text-base leading-relaxed max-w-xl text-white/80 mb-6">
                                    Create your pilot profile for free, verify your credentials, and let the industry find you.
                                </p>
                                <div className="flex flex-col sm:flex-row gap-3">
                                    <button
                                        onClick={onJoinUs}
                                        className="px-7 py-3 bg-white hover:bg-slate-100 text-slate-900 font-semibold text-sm rounded-full transition-all shadow-lg"
                                    >
                                        <span className="block">Create free account</span>
                                        <span className="block text-xs font-normal mt-0.5 text-slate-500">
                                            Get <span className="text-red-500">Recognition+</span> verified
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => onNavigate('recognition-plus')}
                                        className="inline-flex items-center justify-center px-7 py-3 rounded-full font-semibold text-sm transition-all border hover:bg-white/10 text-white"
                                        style={{ border: '1px solid rgba(255,255,255,0.3)' }}
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
