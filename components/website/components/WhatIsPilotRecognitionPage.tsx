import React from 'react';
import { useAuth } from '../../../src/contexts/AuthContext';
import { TopNavbar } from './TopNavbar';
import { LoginModal } from './LoginModal';

interface WhatIsPilotRecognitionPageProps {
    onNavigate: (page: string) => void;
    onLogin?: () => void;
    onJoinUs: () => void;
}

const HERO_IMAGES = [
    'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=1800&q=80&fit=crop', // cockpit wide angle
    'https://images.unsplash.com/photo-1474302770737-173ee21bab63?w=1800&q=80&fit=crop', // runway lights
    'https://images.unsplash.com/photo-1556388158-158ea5ccacbd?w=1800&q=80&fit=crop', // pilot in cockpit
];

const SERVICES = [
    {
        number: '01',
        tag: 'Credential Verification',
        title: 'Third-Party Document Audit',
        body: 'Your licences, medicals, and logbooks are independently verified by regional aviation authorities through our network of approved verification providers. Every credential is checked against live civil aviation databases — not just reviewed, but confirmed.',
        img: 'https://images.unsplash.com/photo-1583202735974-b4a6f49b8e5c?w=900&q=80&fit=crop',
    },
    {
        number: '02',
        tag: 'Cryptographic Identity',
        title: 'W3C Verifiable Credential Badge',
        body: 'Once verification passes, we issue a cryptographically signed W3C Verifiable Credential to your Pilot Identity Credential (PIC) wallet. This badge cannot be faked, copied, or transferred — it is mathematically tied to your identity and expires with your licence.',
        img: 'https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=900&q=80&fit=crop',
    },
    {
        number: '03',
        tag: 'Pathway Activation',
        title: 'Unlock International Airline Gates',
        body: 'Verified pilots gain access to Terminal 3 — our firewalled international standards zone. Premium airline gates, cargo operators, charter companies, and eVTOL operators can only be reached with a confirmed VC badge. Verification is the key that opens the door.',
        img: 'https://images.unsplash.com/photo-1570710891163-6d3b5c47248b?w=900&q=80&fit=crop',
    },
    {
        number: '04',
        tag: 'Career Intelligence',
        title: 'Recognition+ Score & Matching',
        body: 'Your verified profile feeds our AI career matching engine which scores your readiness against live operator requirements. Airlines and operators can scout you before you apply. You stop chasing jobs — they start finding you.',
        img: 'https://images.unsplash.com/photo-1464037866556-6812c9d1c72e?w=900&q=80&fit=crop',
    },
];

const WHY_POINTS = [
    {
        icon: '🛡',
        title: 'Independent, Not Internal',
        body: 'We never touch your documents. Your credentials go directly to the verification provider. We receive only a pass/fail signal — so there is no platform data breach that can compromise your paperwork.',
    },
    {
        icon: '🌐',
        title: 'Globally Recognised Standards',
        body: 'Our verification framework aligns with ICAO Annex 1, EASA Part-FCL, FAA 14 CFR Part 61, CAAP Philippines, and GCAA UAE. Your badge carries weight in every jurisdiction we operate in.',
    },
    {
        icon: '⚡',
        title: 'One Verification, All Pathways',
        body: 'Verify once and your badge opens every airline gate, cargo pathway, charter route, and eVTOL operator in the network simultaneously. No re-submitting to individual airlines. One credential, unlimited doors.',
    },
    {
        icon: '🔄',
        title: 'Annual Refresh Cycle',
        body: 'Verification is renewed each year alongside your licence currency. Your badge stays valid, your profile stays discoverable, and operators always know your credentials are current — not two years stale on a PDF.',
    },
];

const WhatIsPilotRecognitionPage: React.FC<WhatIsPilotRecognitionPageProps> = ({ onNavigate, onLogin, onJoinUs }) => {
    const { currentUser } = useAuth();
    const [isLoginModalOpen, setIsLoginModalOpen] = React.useState(false);

    return (
        <div className="relative bg-white min-h-screen">
            <TopNavbar
                onNavigate={onNavigate}
                onLogin={onLogin}
                isLight={false}
                onLoginModalOpen={() => setIsLoginModalOpen(true)}
            />

            {/* ── HERO ── */}
            <section className="relative min-h-screen flex flex-col justify-end overflow-hidden">
                {/* Background image stack */}
                <div className="absolute inset-0">
                    <img
                        src={HERO_IMAGES[0]}
                        alt="Aviation hero"
                        className="w-full h-full object-cover"
                    />
                    {/* Deep gradient overlays */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-black/20" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-transparent to-transparent" />
                </div>

                {/* Floating image strip — top right */}
                <div className="absolute top-24 right-0 hidden lg:flex flex-col gap-3 pr-8 z-10">
                    <img
                        src={HERO_IMAGES[1]}
                        alt=""
                        className="w-56 h-32 object-cover rounded-xl opacity-70 shadow-2xl"
                    />
                    <img
                        src={HERO_IMAGES[2]}
                        alt=""
                        className="w-56 h-32 object-cover rounded-xl opacity-60 shadow-2xl"
                    />
                </div>

                {/* Hero content */}
                <div className="relative z-10 max-w-6xl mx-auto px-6 pb-24 pt-40 w-full">
                    <p className="text-red-400 text-xs font-bold tracking-[0.3em] uppercase mb-5">
                        pilotrecognition.com — verification unlocks pathways
                    </p>
                    <h1 className="text-5xl md:text-7xl font-black text-white leading-[1.0] mb-6 max-w-3xl">
                        Verification is the<br />
                        <span className="text-red-500">first step</span> to<br />
                        the industry.
                    </h1>
                    <p className="text-white/60 text-lg leading-relaxed max-w-xl mb-10">
                        We are connecting pilots to the aviation industry through a single verified identity credential — the universal key that opens airline gates, cargo routes, and operator pathways worldwide.
                    </p>
                    <div className="flex flex-wrap gap-4">
                        <button
                            onClick={onJoinUs}
                            className="px-8 py-4 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-all text-sm tracking-wide shadow-lg shadow-red-600/30"
                        >
                            Start Verification →
                        </button>
                        <button
                            onClick={() => onNavigate('recognition-plus')}
                            className="px-8 py-4 bg-white/10 hover:bg-white/20 border border-white/20 text-white font-semibold rounded-xl transition-all text-sm tracking-wide backdrop-blur-sm"
                        >
                            View Recognition+
                        </button>
                    </div>

                    {/* Stats strip */}
                    <div className="flex flex-wrap gap-10 mt-16 pt-10 border-t border-white/10">
                        {[
                            ['3-Party Audit', 'Every credential independently verified'],
                            ['W3C Standard', 'Cryptographically signed VC badge'],
                            ['1 Verification', 'Opens every airline & operator gate'],
                        ].map(([stat, label]) => (
                            <div key={stat}>
                                <p className="text-white font-black text-xl mb-1">{stat}</p>
                                <p className="text-white/40 text-xs">{label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── CONNECTING PILOTS — mission statement ── */}
            <section className="bg-black py-20 px-6">
                <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16 items-center">
                    <div>
                        <p className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">Our Mission</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6">
                            Connecting pilots<br />to the industry —<br />
                            <span className="text-red-500">credential first.</span>
                        </h2>
                        <p className="text-white/50 text-base leading-relaxed mb-6">
                            The aviation industry has always required pilots to prove themselves through paperwork. We replaced the paperwork with a cryptographic truth — a badge that every airline, every operator, and every authority can verify in seconds without calling anyone.
                        </p>
                        <p className="text-white/50 text-base leading-relaxed">
                            When your licence, medical, and logbook hours are independently confirmed and issued as a W3C Verifiable Credential, you stop being a candidate on a PDF and start being a verified professional in a live, searchable network.
                        </p>
                    </div>
                    <div className="relative">
                        <img
                            src="https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=900&q=80&fit=crop"
                            alt="Commercial aircraft on tarmac"
                            className="w-full h-80 object-cover rounded-2xl"
                        />
                        <img
                            src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80&fit=crop"
                            alt="Cockpit instruments"
                            className="absolute -bottom-8 -left-8 w-48 h-36 object-cover rounded-xl border-4 border-black shadow-2xl hidden md:block"
                        />
                        {/* Badge chip */}
                        <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm border border-white/10 rounded-xl px-4 py-3">
                            <p className="text-green-400 text-xs font-bold">✓ VC Badge Issued</p>
                            <p className="text-white/40 text-[10px] mt-0.5">Cryptographically verified</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* ── OUR SERVICES ── */}
            <section className="bg-slate-950 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16">
                        <p className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">Our Services</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-2xl">
                            What verification actually gives you
                        </h2>
                    </div>

                    <div className="space-y-6">
                        {SERVICES.map((s, i) => (
                            <div
                                key={s.number}
                                className={`group grid md:grid-cols-2 gap-0 rounded-2xl overflow-hidden border border-white/5 hover:border-red-500/30 transition-all duration-300 ${i % 2 === 1 ? 'md:[direction:rtl]' : ''}`}
                            >
                                {/* Text */}
                                <div className={`bg-slate-900 p-10 flex flex-col justify-center ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                                    <div className="flex items-center gap-3 mb-5">
                                        <span className="text-red-500 font-black text-xs tracking-[0.2em]">{s.number}</span>
                                        <span className="text-white/30 text-xs uppercase tracking-widest">{s.tag}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-4 leading-tight">{s.title}</h3>
                                    <p className="text-white/50 text-sm leading-relaxed">{s.body}</p>
                                </div>
                                {/* Image */}
                                <div className={`relative h-64 md:h-auto ${i % 2 === 1 ? 'md:[direction:ltr]' : ''}`}>
                                    <img
                                        src={s.img}
                                        alt={s.title}
                                        className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-r from-slate-900/40 to-transparent" />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── WHY VERIFY WITH US ── */}
            <section className="bg-black py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                        <div>
                            <p className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">Why PilotRecognition</p>
                            <h2 className="text-4xl md:text-5xl font-black text-white leading-tight max-w-xl">
                                Why verify<br />with us?
                            </h2>
                        </div>
                        <p className="text-white/40 text-sm leading-relaxed max-w-sm">
                            Not every verification platform is built for pilots. Ours is — and it's built around protecting you, not just ticking a compliance box for an airline.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-16">
                        {WHY_POINTS.map((p) => (
                            <div key={p.title} className="bg-slate-900 border border-white/5 hover:border-red-500/20 rounded-2xl p-8 transition-all group">
                                <span className="text-3xl mb-5 block">{p.icon}</span>
                                <h3 className="text-lg font-black text-white mb-3">{p.title}</h3>
                                <p className="text-white/45 text-sm leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>

                    {/* Photo proof strip */}
                    <div className="grid grid-cols-3 gap-4">
                        {[
                            'https://images.unsplash.com/photo-1559128010-7c1ad6e1b6a5?w=800&q=80&fit=crop',
                            'https://images.unsplash.com/photo-1611348586840-ea9872d33411?w=800&q=80&fit=crop',
                            'https://images.unsplash.com/photo-1602452920335-6a132309c7c8?w=800&q=80&fit=crop',
                        ].map((src, i) => (
                            <div key={i} className="relative rounded-xl overflow-hidden h-40">
                                <img src={src} alt="" className="w-full h-full object-cover" />
                                <div className="absolute inset-0 bg-black/30" />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ── THE PATHWAY FLOW ── */}
            <section className="bg-slate-950 py-24 px-6">
                <div className="max-w-6xl mx-auto">
                    <div className="text-center mb-16">
                        <p className="text-red-500 text-xs font-bold tracking-[0.25em] uppercase mb-4">The Journey</p>
                        <h2 className="text-4xl md:text-5xl font-black text-white leading-tight">
                            Verification unlocks pathways
                        </h2>
                        <p className="text-white/40 text-base mt-4 max-w-lg mx-auto">
                            Every step is built on the last. Verification is the foundation — everything else is built on top of it.
                        </p>
                    </div>

                    <div className="relative">
                        {/* Connector line */}
                        <div className="hidden md:block absolute top-10 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-red-600/50 to-transparent" />

                        <div className="grid md:grid-cols-4 gap-6">
                            {[
                                { step: '1', label: 'Create Profile', sub: 'Free account, basic info, flight hours', icon: '👤', active: false },
                                { step: '2', label: 'Verify Credentials', sub: 'Licence, medical & logbook audited', icon: '🔍', active: true },
                                { step: '3', label: 'VC Badge Issued', sub: 'Cryptographic identity confirmed', icon: '🛡', active: false },
                                { step: '4', label: 'Pathways Open', sub: 'Airlines, cargo, charter & eVTOL', icon: '✈️', active: false },
                            ].map((item) => (
                                <div key={item.step} className={`relative flex flex-col items-center text-center p-6 rounded-2xl border transition-all ${item.active ? 'bg-red-600/10 border-red-500/40' : 'bg-slate-900 border-white/5'}`}>
                                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl mb-4 ${item.active ? 'bg-red-600' : 'bg-slate-800'}`}>
                                        {item.icon}
                                    </div>
                                    <span className={`text-xs font-bold tracking-widest uppercase mb-2 ${item.active ? 'text-red-400' : 'text-white/30'}`}>
                                        Step {item.step}
                                    </span>
                                    <h4 className="text-white font-black text-base mb-2">{item.label}</h4>
                                    <p className="text-white/40 text-xs leading-relaxed">{item.sub}</p>
                                    {item.active && (
                                        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[9px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                                            You are here
                                        </span>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ── CTA ── */}
            <section className="relative overflow-hidden bg-black py-28 px-6">
                <img
                    src="https://images.unsplash.com/photo-1542296332-2e4473faf563?w=1800&q=80&fit=crop"
                    alt=""
                    className="absolute inset-0 w-full h-full object-cover opacity-20"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/80 to-transparent" />
                <div className="relative z-10 max-w-3xl mx-auto text-center">
                    <p className="text-red-400 text-xs font-bold tracking-[0.3em] uppercase mb-5">Ready to fly further</p>
                    <h2 className="text-4xl md:text-6xl font-black text-white leading-tight mb-6">
                        Your verified career<br />starts here.
                    </h2>
                    <p className="text-white/50 text-lg leading-relaxed mb-10 max-w-xl mx-auto">
                        Join the pilots connecting to the industry through the first — and most important — step: verification.
                    </p>
                    <div className="flex flex-wrap gap-4 justify-center">
                        <button
                            onClick={onJoinUs}
                            className="px-10 py-4 bg-red-600 hover:bg-red-500 text-white font-black rounded-xl transition-all text-base tracking-wide shadow-2xl shadow-red-600/30"
                        >
                            Create Free Account →
                        </button>
                        <button
                            onClick={() => onNavigate('recognition-plus')}
                            className="px-10 py-4 bg-white/10 hover:bg-white/15 border border-white/15 text-white font-semibold rounded-xl transition-all text-base backdrop-blur-sm"
                        >
                            Recognition+ Plans
                        </button>
                    </div>
                </div>
            </section>

            <LoginModal
                isOpen={isLoginModalOpen}
                onClose={() => setIsLoginModalOpen(false)}
                onNavigate={onNavigate}
            />
        </div>
    );
};

export default WhatIsPilotRecognitionPage;
