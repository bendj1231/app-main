
import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { TopNavbar } from './TopNavbar';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '@/src/lib/device-detection';
import { supabase } from '@/src/lib/supabase';

interface BecomeMemberPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

const OCCUPATIONS = [
    'Student Pilot',
    'Private Pilot (PPL)',
    'Commercial Pilot (CPL)',
    'Airline Pilot (ATPL)',
    'Flight Instructor (CFI)',
    'First Officer',
    'Captain',
    'Cadet',
    'Other',
];

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { loginWithRedirect, user, isAuthenticated, isLoading } = useAuth0();
    const [enableShader, setEnableShader] = useState(false);
    const isSetup = new URLSearchParams(window.location.search).get('setup') === '1';

    // Setup form state
    const [displayName, setDisplayName] = useState('');
    const [hoursWhole, setHoursWhole] = useState('');
    const [hoursMinutes, setHoursMinutes] = useState('');
    const [occupation, setOccupation] = useState('');
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [showLogbookModal, setShowLogbookModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [providerConnected, setProviderConnected] = useState(false);
    const [authTimedOut, setAuthTimedOut] = useState(false);
    const [vcCredentialUrl, setVcCredentialUrl] = useState<string | null>(null);
    const [showWalletSelector, setShowWalletSelector] = useState(false);
    const [activeInstrument, setActiveInstrument] = useState(1);

    const CREDENTIAL_WALLETS = [
        { id: 'walt', name: 'walt.id Wallet', logo: '🔐', desc: 'DID · W3C VC · OID4VCI · open-source', color: 'text-[#00b4d8]', border: 'border-[#00b4d8]/40', href: (url: string) => `https://wallet.walt.id/?offer=${encodeURIComponent(url)}` },
        { id: 'talao', name: 'Talao Wallet', logo: '🪪', desc: 'DID · eIDAS 2.0 · OID4VCI · SD-JWT', color: 'text-emerald-400', border: 'border-emerald-400/40', href: (url: string) => `https://app.talao.co/wallet?credential_offer=${encodeURIComponent(url)}` },
        { id: 'lissi', name: 'Lissi ID Wallet', logo: '🔵', desc: 'DID · W3C VC · OID4VCI · enterprise', color: 'text-blue-400', border: 'border-blue-400/40', href: (url: string) => `https://lissi.id/wallet?credential_offer=${encodeURIComponent(url)}` },
        { id: 'dock', name: 'Dock Wallet', logo: '⚓', desc: 'DID · W3C VC · decentralized identity', color: 'text-orange-400', border: 'border-orange-400/40', href: (url: string) => `https://certs.dock.io/claim?offer=${encodeURIComponent(url)}` },
        { id: 'iota', name: 'IOTA Identity Wallet', logo: '🌐', desc: 'DID · W3C VC · self-sovereign identity', color: 'text-purple-400', border: 'border-purple-400/40', href: (url: string) => url },
        { id: 'apple', name: 'Apple Wallet', logo: '🍎', desc: 'Coming soon', color: 'text-white/30', border: 'border-white/10', href: null },
        { id: 'google', name: 'Google Wallet', logo: '💳', desc: 'Coming soon', color: 'text-white/30', border: 'border-white/10', href: null },
    ];

    const LOGBOOK_PROVIDERS = [
        { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', status: 'available', method: 'OAuth 2.0', methodColor: 'text-[#00b4d8]' },
        { id: 'flightcrewview', name: 'Flight Crew View', region: 'Global', logo: '✈️', status: 'available', method: 'API Passkey', methodColor: 'text-purple-400' },
        { id: 'rbpilot', name: 'RB Pilot Logbook', region: 'Global', logo: '�', status: 'available', method: 'Direct API', methodColor: 'text-green-400' },
        { id: 'foreflight', name: 'ForeFlight', region: 'Global', logo: '�️', status: 'available', method: 'CSV Import', methodColor: 'text-orange-400' },
        { id: 'logten', name: 'LogTen Pro', region: 'Global', logo: '📋', status: 'available', method: 'CSV Import', methodColor: 'text-orange-400' },
        { id: 'safelog', name: 'Safelog', region: 'Global', logo: '🛡️', status: 'available', method: 'CSV Import', methodColor: 'text-orange-400' },
        { id: 'easa_logbook', name: 'EASA Digital Logbook', region: 'Europe', logo: '🇪🇺', status: 'coming_soon', method: 'OAuth 2.0', methodColor: 'text-[#00b4d8]' },
        { id: 'manual', name: 'Manual Entry', region: 'All Regions', logo: '✏️', status: 'available', method: 'Self-Reported', methodColor: 'text-white/40' },
    ];

    useEffect(() => {
        setEnableShader(shouldEnable3DEffects());
    }, []);

    useEffect(() => {
        if (isSetup && isLoading) {
            const t = setTimeout(() => setAuthTimedOut(true), 3000);
            return () => clearTimeout(t);
        }
    }, [isSetup, isLoading]);

    useEffect(() => {
        if (isSetup && user) {
            setDisplayName(user.name || user.email?.split('@')[0] || '');
        }
    }, [isSetup, user]);

    useEffect(() => {
        const mfbHours = sessionStorage.getItem('mfb_total_hours');
        const mfbProvider = sessionStorage.getItem('mfb_provider');
        if (mfbHours && mfbProvider) {
            const hrs = parseFloat(mfbHours);
            setHoursWhole(String(Math.floor(hrs)));
            setHoursMinutes(String(Math.round((hrs % 1) * 60)));
            setSelectedProvider(mfbProvider);
            setProviderConnected(true);
            const vcUrl = sessionStorage.getItem('vc_credential_offer_url');
            if (vcUrl) {
                setVcCredentialUrl(vcUrl);
                sessionStorage.removeItem('vc_credential_offer_url');
                sessionStorage.removeItem('vc_credential_id');
            }
            sessionStorage.removeItem('mfb_total_hours');
            sessionStorage.removeItem('mfb_provider');
        }
    }, []);

    const handleSaveProfile = async () => {
        const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
        if (!cleanName || cleanName.length < 2) { setSaveError('Display name is required.'); return; }
        if (!OCCUPATIONS.includes(occupation)) { setSaveError('Please select a valid role.'); return; }
        const wholeHrs = parseInt(hoursWhole);
        const mins = parseInt(hoursMinutes || '0');
        if (!hoursWhole || isNaN(wholeHrs) || wholeHrs < 0 || wholeHrs > 99999) { setSaveError('Please enter valid flight hours.'); return; }
        if (isNaN(mins) || mins < 0 || mins > 59) { setSaveError('Minutes must be between 0 and 59.'); return; }
        const hours = wholeHrs + mins / 60;
        const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');
        if (!auth0Id) { setSaveError('Authentication error. Please sign in again.'); return; }
        setSaving(true);
        setSaveError('');
        try {
            const { error } = await supabase
                .from('profiles')
                .update({ display_name: cleanName, current_occupation: occupation, total_hours: hours })
                .eq('auth0_id', auth0Id);
            if (error) throw error;
            onNavigate('platform');
        } catch {
            setSaveError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleEmailSignup = () => {
        loginWithRedirect({
            authorizationParams: {
                screen_hint: 'signup',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const handleGoogleSignup = () => {
        loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2',
                screen_hint: 'signup',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const logbookSynced = new URLSearchParams(window.location.search).get('logbook') === 'synced';

    // ── While Auth0 rehydrates session (skip wait if returning from logbook sync) ─
    if (isSetup && isLoading && !authTimedOut && !logbookSynced) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #00b4d8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── Profile setup step (redirected here after Auth0 signup or logbook sync) ──
    if (isSetup && (isAuthenticated || authTimedOut || (!isLoading && logbookSynced))) {
        return (
            <>
            <div className="relative h-screen flex flex-col">
                <div className="fixed inset-0 z-0 overflow-hidden">
                    {enableShader ? (
                        <MeshGradient className="w-full h-full" colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]} speed={0.22} />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                </div>
                <div className="relative z-[300] flex justify-end p-4">
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white/60 hover:text-white text-xs font-semibold tracking-wide backdrop-blur-sm transition-all"
                    >
                        ← Cancel Account Creation
                    </button>
                </div>
                <div className="relative z-10 flex-1 flex items-center justify-center px-4">
                    <div className="w-full max-w-md">
                        {/* Cockpit Header */}
                        <div className="text-center mb-5">
                            <p className="text-red-500 text-[10px] font-black tracking-widest uppercase mb-1">Account Created</p>
                            <h1 className="text-2xl font-black text-white mb-1 tracking-tight">Welcome aboard</h1>
                            <p className="text-slate-500 text-[10px] font-mono uppercase tracking-widest">Pilot Profile Setup — Six Instruments</p>
                        </div>

                        <style>{`
                            @keyframes gaugeFadeIn {
                                from { opacity: 0; transform: translateY(16px) scale(0.97); }
                                to   { opacity: 1; transform: translateY(0) scale(1); }
                            }
                            .gauge-card {
                                animation: gaugeFadeIn 0.5s cubic-bezier(0.16,1,0.3,1) forwards;
                                background: rgba(255,255,255,0.04);
                                backdrop-filter: blur(12px);
                                -webkit-backdrop-filter: blur(12px);
                                border: 1px solid rgba(255,255,255,0.08);
                                border-radius: 14px;
                                box-shadow: 0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
                                transition: border-color 0.3s, box-shadow 0.3s, opacity 0.4s, transform 0.4s;
                            }
                            .gauge-card.locked {
                                opacity: 0.12;
                                pointer-events: none;
                                filter: blur(1px);
                            }
                            .gauge-card.active {
                                border-color: rgba(0,180,216,0.5);
                                box-shadow: 0 8px 32px 0 rgba(0,0,0,0.35), 0 0 0 1px rgba(0,180,216,0.2), inset 0 1px 0 rgba(255,255,255,0.06);
                            }
                            .gauge-card.done {
                                border-color: rgba(52,211,153,0.4);
                                box-shadow: 0 8px 32px 0 rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.06);
                            }
                        `}</style>

                        {/* Instrument Panel Bezel */}
                        <div style={{
                            background: 'rgba(8,14,26,0.92)',
                            backdropFilter: 'blur(20px)',
                            WebkitBackdropFilter: 'blur(20px)',
                            border: '2px solid rgba(255,255,255,0.07)',
                            borderRadius: '20px',
                            boxShadow: '0 0 0 1px #1e293b, 0 0 60px rgba(0,180,216,0.06), inset 0 1px 0 rgba(255,255,255,0.04)',
                            padding: '12px',
                        }}>
                            {/* Panel header strip */}
                            <div className="flex items-center justify-between px-1 mb-3">
                                <span className="text-slate-600 text-[8px] font-mono uppercase tracking-widest">PilotRecognition · Profile Instruments</span>
                                <span className="text-[#00b4d8]/30 text-[8px] font-mono">did:web:pilotrecognition.com</span>
                            </div>

                            {/* Six-Pack 3×2 Grid */}
                            <div className="grid grid-cols-2 gap-2">

                                {/* ── Instrument 1: AIRSPEED — Callsign ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 1 ? 'active' : activeInstrument > 1 ? 'done' : 'locked'}`}
                                    style={{ animationDelay: '0.1s' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Airspeed</p>
                                            <p className="text-[9px] font-bold text-white/60">Callsign</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${activeInstrument > 1 ? 'bg-emerald-400' : activeInstrument === 1 ? 'bg-[#00b4d8] animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={e => {
                                            setDisplayName(e.target.value);
                                            if (e.target.value.trim().length >= 2) setActiveInstrument(i => Math.max(i, 2));
                                        }}
                                        placeholder="Your pilot name..."
                                        disabled={activeInstrument < 1}
                                        className="w-full bg-transparent border-b border-white/10 pb-1 text-white text-sm font-bold focus:outline-none focus:border-[#00b4d8] transition-colors placeholder-slate-700 disabled:opacity-30"
                                    />
                                    <p className="text-[8px] font-mono text-slate-700">How pilots identify you</p>
                                </div>

                                {/* ── Instrument 2: ATTITUDE — Classification ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 2 ? 'active' : activeInstrument > 2 ? 'done' : 'locked'}`}
                                    style={{ animationDelay: '0.25s' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Attitude</p>
                                            <p className="text-[9px] font-bold text-white/60">Classification</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${activeInstrument > 2 ? 'bg-emerald-400' : activeInstrument === 2 ? 'bg-[#00b4d8] animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    <select
                                        value={occupation}
                                        onChange={e => {
                                            setOccupation(e.target.value);
                                            if (e.target.value) setActiveInstrument(i => Math.max(i, 3));
                                        }}
                                        disabled={activeInstrument < 2}
                                        className="w-full bg-transparent border-b border-white/10 pb-1 text-white text-xs font-bold focus:outline-none focus:border-[#00b4d8] transition-colors appearance-none cursor-pointer disabled:opacity-30"
                                        style={{ colorScheme: 'dark' }}
                                    >
                                        <option value="" disabled>Select role...</option>
                                        {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                    </select>
                                    <p className="text-[8px] font-mono text-slate-700">Pilot classification level</p>
                                </div>

                                {/* ── Instrument 3: ALTIMETER — Flight Hours ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 3 ? 'active' : activeInstrument > 3 ? 'done' : 'locked'}`}
                                    style={{ animationDelay: '0.4s' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Altimeter</p>
                                            <p className="text-[9px] font-bold text-white/60">Flight Time</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${activeInstrument > 3 ? 'bg-emerald-400' : activeInstrument === 3 ? 'bg-[#00b4d8] animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    <div className="flex items-end gap-1.5">
                                        <input
                                            type="number" min="0" max="99999"
                                            value={hoursWhole}
                                            onChange={e => {
                                                setHoursWhole(e.target.value);
                                                if (parseInt(e.target.value) >= 0 && e.target.value !== '') setActiveInstrument(i => Math.max(i, 4));
                                            }}
                                            placeholder="250"
                                            disabled={activeInstrument < 3}
                                            className="w-full bg-transparent border-b border-white/10 pb-1 text-white text-sm font-bold focus:outline-none focus:border-[#00b4d8] transition-colors placeholder-slate-700 disabled:opacity-30"
                                        />
                                        <span className="text-slate-600 text-[8px] pb-1 font-mono shrink-0">HRS</span>
                                        <input
                                            type="number" min="0" max="59"
                                            value={hoursMinutes}
                                            onChange={e => setHoursMinutes(e.target.value)}
                                            placeholder="00"
                                            disabled={activeInstrument < 3}
                                            className="w-10 bg-transparent border-b border-white/10 pb-1 text-white text-sm font-bold focus:outline-none focus:border-[#00b4d8] transition-colors placeholder-slate-700 text-center disabled:opacity-30"
                                        />
                                        <span className="text-slate-600 text-[8px] pb-1 font-mono shrink-0">MIN</span>
                                    </div>
                                    <p className="text-[8px] font-mono text-slate-700">Total logged flight time</p>
                                </div>

                                {/* ── Instrument 4: TURN COORDINATOR — Logbook ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 4 ? 'active' : activeInstrument > 4 ? 'done' : 'locked'}`}
                                    style={{ animationDelay: '0.55s' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Turn Coord.</p>
                                            <p className="text-[9px] font-bold text-white/60">Logbook</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${providerConnected ? 'bg-emerald-400' : activeInstrument === 4 ? 'bg-amber-400 animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    <button
                                        type="button"
                                        onClick={() => { setShowLogbookModal(true); setActiveInstrument(i => Math.max(i, 5)); }}
                                        disabled={activeInstrument < 4}
                                        className="w-full border-b border-white/10 pb-1 text-left hover:border-[#00b4d8] transition-colors disabled:opacity-30"
                                    >
                                        {providerConnected
                                            ? <span className="text-emerald-400 text-xs font-bold font-mono">{selectedProvider} ✓ SYNCED</span>
                                            : <span className="text-slate-500 text-xs font-mono">Connect provider →</span>
                                        }
                                    </button>
                                    <p className="text-[8px] font-mono text-slate-700">Verified flight data source</p>
                                </div>

                                {/* ── Instrument 5: HEADING — VC Wallet ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 5 ? 'active' : activeInstrument > 5 ? 'done' : 'locked'}`}
                                    style={{ animationDelay: '0.7s' }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">Heading</p>
                                            <p className="text-[9px] font-bold text-white/60">VC Wallet</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${activeInstrument === 5 ? 'bg-[#00b4d8] animate-pulse' : activeInstrument > 5 ? 'bg-emerald-400' : 'bg-slate-700'}`} />
                                    </div>
                                    <div className="grid grid-cols-3 gap-1">
                                        {CREDENTIAL_WALLETS.slice(0, 6).map(w => (
                                            w.href ? (
                                                <a key={w.id}
                                                   href={vcCredentialUrl ? w.href(vcCredentialUrl) : 'https://wallet.walt.id'}
                                                   target="_blank" rel="noopener noreferrer"
                                                   onClick={() => setActiveInstrument(i => Math.max(i, 6))}
                                                   className={`flex flex-col items-center gap-0.5 py-1 rounded-lg border ${w.border} hover:bg-white/5 transition-all`}
                                                   title={w.name}
                                                >
                                                    <span className="text-sm leading-none">{w.logo}</span>
                                                    <span className={`text-[6px] font-bold ${w.color} leading-none text-center`}>{w.name.split(' ')[0]}</span>
                                                </a>
                                            ) : (
                                                <div key={w.id} className={`flex flex-col items-center gap-0.5 py-1 rounded-lg border ${w.border} opacity-20 cursor-not-allowed`}>
                                                    <span className="text-sm leading-none">{w.logo}</span>
                                                    <span className="text-[6px] text-white/20 leading-none">{w.name.split(' ')[0]}</span>
                                                </div>
                                            )
                                        ))}
                                    </div>
                                    <p className="text-[8px] font-mono text-slate-700">Decentralised identity wallet</p>
                                </div>

                                {/* ── Instrument 6: VSI — Commit ── */}
                                <div
                                    className={`gauge-card p-3 flex flex-col gap-2 ${activeInstrument === 6 ? 'active' : 'locked'}`}
                                    style={{ animationDelay: '0.85s', ...(activeInstrument === 6 ? { borderColor: 'rgba(220,38,38,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.35), 0 0 0 1px rgba(220,38,38,0.2), inset 0 1px 0 rgba(255,255,255,0.06)' } : {}) }}
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-[8px] font-mono text-slate-500 uppercase tracking-widest">V/S Indicator</p>
                                            <p className="text-[9px] font-bold text-white/60">Commit</p>
                                        </div>
                                        <span className={`w-2 h-2 rounded-full transition-colors ${activeInstrument === 6 ? 'bg-red-500 animate-pulse' : 'bg-slate-700'}`} />
                                    </div>
                                    {saveError && <p className="text-red-400 text-[9px] font-mono">{saveError}</p>}
                                    <button
                                        onClick={handleSaveProfile}
                                        disabled={saving || activeInstrument < 6}
                                        className="w-full py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-lg transition-all text-xs tracking-widest"
                                    >
                                        {saving ? 'ENGAGING...' : 'COMPLETE PROFILE →'}
                                    </button>
                                    <p className="text-[8px] font-mono text-slate-700">Engage pilot profile</p>
                                </div>

                            </div>{/* end six-pack grid */}

                            {/* Progress strip */}
                            <div className="flex items-center gap-1 mt-3 px-1">
                                {[1,2,3,4,5,6].map(n => (
                                    <div key={n} className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${activeInstrument > n ? 'bg-emerald-400' : activeInstrument === n ? 'bg-[#00b4d8]' : 'bg-slate-800'}`} />
                                ))}
                            </div>
                            <p className="text-center text-slate-700 text-[8px] font-mono mt-1">
                                Instrument {Math.min(activeInstrument, 6)} of 6 — {activeInstrument > 5 ? 'All Systems Go' : 'Complete each gauge to proceed'}
                            </p>

                        </div>{/* end bezel */}

                        <div className="flex items-center justify-center gap-2 pt-3">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-green-400 flex-shrink-0"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                            <span className="text-green-400 text-[10px] font-semibold tracking-wide">Secure Connection</span>
                            <span className="text-white/20 text-[10px]">·</span>
                            <span className="text-white/40 text-[10px]">Powered by</span>
                            <span className="text-white/70 text-[10px] font-bold tracking-wide">Auth0</span>
                        </div>
                        <p className="text-white/50 text-[10px] text-center leading-relaxed pt-1">
                            Pilot Recognition functions strictly as a neutral data infrastructure provider. By continuing, you authorize this read-only display and electronic consent tracking in accordance with applicable electronic commerce legislation and our{' '}
                            <button onClick={() => onNavigate('terms-of-service')} className="underline text-white/60 hover:text-white transition-colors">Terms of Service</button>.
                        </p>
                    </div>{/* end max-w-md */}
                </div>{/* end flex-1 center */}
            </div>{/* end h-screen */}

            {/* Logbook Provider Modal */}
            {showLogbookModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center px-4" onClick={() => setShowLogbookModal(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-md bg-slate-900 border border-white/10 rounded-2xl p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-white font-black text-base">Connect Logbook Provider</h3>
                                <p className="text-white/40 text-xs mt-0.5">Select your digital logbook to verify flight hours</p>
                            </div>
                            <button onClick={() => setShowLogbookModal(false)} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-2 mb-4">
                            {LOGBOOK_PROVIDERS.map((p) => (
                                <button
                                    key={p.id}
                                    disabled={p.status === 'coming_soon'}
                                    onClick={() => setSelectedProvider(p.name)}
                                    className={`relative flex flex-col items-start p-3 rounded-xl border transition-all text-left ${
                                        selectedProvider === p.name
                                            ? 'border-[#00b4d8] bg-[#00b4d8]/10'
                                            : p.status === 'coming_soon'
                                            ? 'border-white/5 bg-white/2 opacity-40 cursor-not-allowed'
                                            : 'border-white/10 bg-white/5 hover:border-white/30'
                                    }`}
                                >
                                    <span className="text-lg mb-1">{p.logo}</span>
                                    <span className="text-white text-xs font-bold leading-tight">{p.name}</span>
                                    <span className="text-white/30 text-[10px] mt-0.5">{p.region}</span>
                                    <span className={`text-[9px] font-semibold mt-1 ${p.methodColor}`}>{p.method}</span>
                                    {p.status === 'coming_soon' && (
                                        <span className="absolute top-2 right-2 text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full">Soon</span>
                                    )}
                                    {selectedProvider === p.name && (
                                        <span className="absolute top-2 right-2 w-2 h-2 rounded-full bg-[#00b4d8]" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => {
                                if (!selectedProvider) return;
                                const provider = LOGBOOK_PROVIDERS.find(p => p.name === selectedProvider);
                                if (provider?.id === 'myflightbook') {
                                    const redirectUri = 'https://pilotrecognition.com/auth/logbook/callback';
                                    const clientId = import.meta.env.VITE_MFB_CLIENT_ID || 'PilotRecognition';
                                    const url = `https://myflightbook.com/logbook/mvc/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=totals`;
                                    window.location.href = url;
                                } else {
                                    setProviderConnected(true);
                                    setShowLogbookModal(false);
                                }
                            }}
                            disabled={!selectedProvider}
                            className="w-full py-3 bg-[#00b4d8] hover:bg-[#0096b4] disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all text-sm tracking-wide"
                        >
                            {selectedProvider ? `Sync with ${selectedProvider} →` : 'Select a provider'}
                        </button>
                        <div className="flex flex-wrap gap-x-3 gap-y-1 mt-3 mb-1 justify-center">
                            <span className="text-[9px] text-[#00b4d8]">● OAuth 2.0</span>
                            <span className="text-[9px] text-purple-400">● API Passkey</span>
                            <span className="text-[9px] text-green-400">● Direct API</span>
                            <span className="text-[9px] text-orange-400">● CSV Import</span>
                        </div>
                        <p className="text-white/25 text-[10px] text-center leading-relaxed">
                            Read-only access only. We never modify your logbook data.
                        </p>
                    </div>
                </div>
            )}
            </>
        );
    }

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Create Account', url: '/become-member' }
            ]} />
            <div className="relative h-screen flex flex-col">

                {/* Background — same shader as HomePage & platform */}
                <div className="fixed inset-0 z-0 overflow-hidden">
                    {enableShader ? (
                        <MeshGradient
                            className="w-full h-full"
                            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                            speed={0.22}
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                <div className="relative z-[300]">
                <TopNavbar onNavigate={onNavigate} onLogin={onLogin} onLoginModalOpen={onLogin} forceScrolled={true} />
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-8 overflow-hidden">
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">

                        {/* Left: Hero text */}
                        <div className="flex-1 text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-3 text-white">
                                Connecting Pilots<br />
                                <span className="text-red-500">to the Industry.</span>
                            </h1>
                            <p className="text-slate-300 text-sm mb-8">Free access to Programs, Pathways &amp; Pilot Recognition</p>

                            {/* Recognition+ upsell */}
                            <div className="border border-white/20 bg-white/5 rounded-xl p-5 max-w-sm">
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="text-red-500 text-xs font-black tracking-widest uppercase">Recognition+</span>
                                </div>
                                <p className="text-white font-bold text-sm mb-1">Get the Recognition Your Training, Logbook, and Pilot Career Deserves</p>
                                <p className="text-white/75 text-xs leading-relaxed mb-3">
                                    Secure and verify your Pilot Identity Credentials (PIC) for Priority Recognition.
                                </p>
                                <ul className="space-y-2.5 mb-4">
                                    {[
                                        { bold: 'Global Standard Verification:', body: 'Direct outreach matching international standards. Full licensure and qualification audits for CPL, PPL, IR, ME, and ATPL handled seamlessly through regional verification providers.' },
                                        { bold: 'Medical & Logbook Auditing:', body: 'Comprehensive checks on Medical Class 1, 2, and 3. Rigorous flight logbook hour validation and flagged notation capture executed natively via regional flight logbook providers and civil aviation authority handling.' },
                                        { bold: 'Fast-Track Placement:', body: 'Gain an immediate competitive edge with priority listing on our automated Pathway Interest Pooling.' },
                                        { bold: 'Exclusive Tier Access:', body: 'Unlock premium, direct connections to Private Charter and Business Aviation Pathways for serious pilots.' },
                                    ].map((point) => (
                                        <li key={point.bold} className="flex items-start gap-2 text-xs text-white/90">
                                            <span className="mt-1 w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0" />
                                            <span><span className="font-bold text-red-500">{point.bold}</span> {point.body}</span>
                                        </li>
                                    ))}
                                </ul>
                                <button
                                    onClick={() => onNavigate('recognition-plus')}
                                    className="w-full py-2.5 text-xs font-black tracking-widest text-white rounded-lg bg-red-600 hover:bg-red-700 transition-all"
                                >
                                    UPGRADE NOW — $99/YEAR
                                </button>
                                <p className="text-white/40 text-[10px] text-center mt-2 leading-snug">
                                    Processing infrastructure fees are distributed securely on-chain via a decentralized gateway to our respective integration nodes.
                                </p>
                            </div>
                        </div>

                        {/* Right: Signup card */}
                        <div className="w-full md:w-[400px] flex-shrink-0">

                        <p className="text-white font-bold text-base mb-3 text-center">Create a Free Account</p>

                        {/* Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">

                            {/* Google signup */}
                            <button
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-4 shadow-sm"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-transparent text-slate-500 text-xs">or</span>
                                </div>
                            </div>

                            {/* Email/password signup via Auth0 Universal Login */}
                            <button
                                onClick={handleEmailSignup}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-blue-600/20"
                            >
                                Sign up with Email
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                            </div>

                            {/* What you get */}
                            <ul className="space-y-2.5 mb-6">
                                {[
                                    'Free pilot recognition profile',
                                    'Access to airline pathway cards',
                                    'Programs & training roadmaps',
                                    'ATLAS CV builder',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2.5 text-sm text-white">
                                        <span className="w-4 h-4 rounded-full bg-[#00b4d8]/20 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Already have account */}
                            <p className="text-center text-sm text-slate-300">
                                Already have an account?{' '}
                                <button
                                    onClick={onLogin}
                                    className="text-[#00b4d8] hover:text-white font-semibold transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>

                        {/* Neutral disclaimer */}
                        <p className="text-center text-xs text-slate-300 mt-4 leading-relaxed">
                            Pilot Recognition functions strictly as a neutral data infrastructure provider.
                            We do not control, store, or modify pilot credentials. Data ownership and control sit exclusively with the pilot
                            and our integration partners (regional verification and background check providers, data storage providers,
                            regional flight logbook providers, and civil aviation authority handling). Infrastructure processing and
                            automated fee routing are managed securely via our decentralized gateway. By continuing, you agree to these operational
                            boundaries under our{' '}
                            <button onClick={() => onNavigate('terms-of-service')} className="text-white underline hover:text-slate-200 transition-colors">Terms of Service</button>.
                        </p>
                        </div>{/* end right column */}
                    </div>{/* end flex row */}
                </div>
            </div>
        </>
    );
};
