
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
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [hoursWhole, setHoursWhole] = useState('');
    const [hoursMinutes, setHoursMinutes] = useState('');
    const [occupation, setOccupation] = useState('');
    const [aircraftTypes, setAircraftTypes] = useState<string[]>([]);
    const [saving, setSaving] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [showLogbookModal, setShowLogbookModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [providerConnected, setProviderConnected] = useState(false);
    const [authTimedOut, setAuthTimedOut] = useState(false);
    const [vcCredentialUrl, setVcCredentialUrl] = useState<string | null>(null);
    const [showWalletSelector, setShowWalletSelector] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [walletConnected, setWalletConnected] = useState(false);
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
        { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png', badge: 'Free', status: 'available', method: 'OAuth 2.0', methodColor: 'text-[#00b4d8]' },
        { id: 'flightcrewview', name: 'Flight Crew View', region: 'Global', logo: '✈️', status: 'available', method: 'API Passkey', methodColor: 'text-purple-400' },
        { id: 'rbpilot', name: 'RB Pilot Logbook', region: 'Global', logo: '🗒️', badge: 'CAE', status: 'coming_soon', method: 'Direct API', methodColor: 'text-green-400', desc: 'Developer registration required — contact rb-support@cae.com' },
        { id: 'foreflight', name: 'ForeFlight', region: 'Global', logo: '📊', status: 'available', method: 'CSV Import', methodColor: 'text-orange-400' },
        { id: 'logten', name: 'LogTen Pro', region: 'Global', logo: '📋', badge: 'Free 50hrs', status: 'available', method: 'CSV Import', methodColor: 'text-orange-400', desc: 'API v2.0 on GitHub · Free for first 50 flight hours' },
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
        const logbookSynced = new URLSearchParams(window.location.search).get('logbook') === 'synced';

        if (mfbHours && mfbProvider) {
            const hrs = parseFloat(mfbHours);
            setHoursWhole(String(Math.floor(hrs)));
            setHoursMinutes(String(Math.round((hrs % 1) * 60)));
            setSelectedProvider(mfbProvider);
            setProviderConnected(true);

            // If returning from logbook OAuth, unlock Logbook (4) and reveal next card (5)
            if (logbookSynced) {
                setActiveInstrument(5);
            }

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
        const cleanFirst = firstName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanLast = lastName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
        if (!cleanFirst || cleanFirst.length < 1) { setSaveError('First name is required.'); return; }
        if (!cleanLast || cleanLast.length < 1) { setSaveError('Last name is required.'); return; }
        if (!cleanName || cleanName.length < 2) { setSaveError('Callsign is required.'); return; }
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
                .update({ display_name: cleanName, first_name: cleanFirst, last_name: cleanLast, current_occupation: occupation, total_hours: hours, aircraft_types: aircraftTypes })
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
            <div className="relative flex flex-col" style={{ height: '100vh', overflow: 'hidden' }}>
                <div className="fixed inset-0 z-0 overflow-hidden">
                    {enableShader ? (
                        <MeshGradient className="w-full h-full" colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]} speed={0.22} />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                </div>
                <div className="relative z-[300] flex items-center justify-between px-6 py-4 border-b border-white/10 backdrop-blur-sm bg-white/5">
                    <h1 className="text-base font-bold tracking-tight">
                        <span className="text-white">PILOT</span><span className="text-red-400">RECOGNITION</span>
                    </h1>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 rounded-lg border border-white/20 text-white/60 hover:text-white hover:border-white/40 text-xs font-semibold tracking-wide backdrop-blur-sm transition-all"
                    >
                        ← Cancel
                    </button>
                </div>
                <div className="flex-1 flex flex-col items-center justify-center px-6 py-4" style={{ overflowY: 'auto' }}>
                    <div className="w-full max-w-[1100px]">
                        {/* Header */}
                        <div className="text-center mb-5">
                            <p className="text-red-400 text-[10px] font-bold tracking-[0.3em] uppercase mb-1">Account Created</p>
                            <h2 className="text-2xl font-bold text-white mb-0.5 tracking-tight">Welcome aboard</h2>
                            <p className="text-white/50 text-xs">Complete your pilot profile to get started</p>
                        </div>

                        <style>{`
                            @keyframes cockpitPopUp {
                                0%   { opacity: 0; transform: scale(0.92) translateY(20px); }
                                100% { opacity: 1; transform: scale(1) translateY(0); }
                            }
                            @keyframes dotPulse {
                                0%, 100% { opacity: 1; }
                                50%       { opacity: 0.3; }
                            }
                            .floating-instrument-card {
                                background: #ffffff;
                                border: 1px solid #e2e8f0;
                                border-radius: 16px;
                                padding: 28px;
                                box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04);
                                display: flex;
                                flex-direction: column;
                                gap: 18px;
                                justify-content: space-between;
                                position: relative;
                                opacity: 0;
                                transform: scale(0.92) translateY(20px);
                                animation: cockpitPopUp 0.45s cubic-bezier(0.16,1,0.3,1) forwards;
                                transition: border-color 0.3s, box-shadow 0.3s;
                            }
                            .floating-instrument-card:nth-child(1) { animation-delay: 0.10s; }
                            .floating-instrument-card:nth-child(2) { animation-delay: 0.25s; }
                            .floating-instrument-card:nth-child(3) { animation-delay: 0.40s; }
                            .floating-instrument-card:nth-child(4) { animation-delay: 0.55s; }
                            .floating-instrument-card:nth-child(5) { animation-delay: 0.70s; }
                            .floating-instrument-card:nth-child(6) { animation-delay: 0.85s; }
                            .floating-instrument-card.fic-locked {
                                opacity: 0 !important;
                                pointer-events: none;
                                animation: none;
                                transform: scale(1) translateY(0);
                                visibility: hidden;
                            }
                            .floating-instrument-card.fic-active {
                                border-color: #e2e8f0;
                                border-color: #dc2626;
                                box-shadow: 0 4px 24px rgba(0,0,0,0.1), 0 0 0 2px #dc2626;
                            }
                            .floating-instrument-card.fic-done {
                                border-color: rgba(255,255,255,0.15);
                                box-shadow: 0 4px 24px rgba(0,0,0,0.15);
                                background: #0a1628;
                            }
                            .floating-instrument-card.fic-done .fic-title {
                                color: #ffffff !important;
                            }
                            .floating-instrument-card.fic-done .fic-input {
                                background: #0f1f3d;
                                border-color: #1e3a5f;
                                color: #ffffff;
                            }
                            .floating-instrument-card.fic-done .fic-input::placeholder {
                                color: #666666;
                            }
                            .floating-instrument-card.fic-done .fic-subtext {
                                color: rgba(255,255,255,0.4);
                            }
                            .fic-avionics-tag {
                                font-size: 10px;
                                font-weight: 600;
                                letter-spacing: 0.12em;
                                text-transform: uppercase;
                                color: #94a3b8;
                            }
                            .fic-title {
                                font-size: 24px;
                                font-weight: 700;
                                color: #0f172a;
                                letter-spacing: -0.02em;
                                line-height: 1.1;
                                margin-top: 2px;
                            }
                            .fic-title-red {
                                color: #dc2626 !important;
                            }
                            .fic-input, .fic-select {
                                width: 100%;
                                background: #ffffff;
                                border: 1px solid #cbd5e1;
                                border-radius: 8px;
                                padding: 11px 14px;
                                color: #0f172a;
                                font-size: 15px;
                                font-weight: 500;
                                outline: none;
                                transition: border-color 0.2s, box-shadow 0.2s;
                                box-sizing: border-box;
                            }
                            .fic-input:focus, .fic-select:focus {
                                border-color: #0f172a;
                                box-shadow: 0 0 0 3px rgba(15,23,42,0.08);
                            }
                            .fic-input::placeholder { color: #94a3b8; }
                            .fic-subtext {
                                font-size: 11px;
                                color: #94a3b8;
                                letter-spacing: 0.02em;
                            }
                            .fic-status-dot {
                                position: absolute;
                                top: 16px;
                                right: 16px;
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                transition: background 0.4s, box-shadow 0.4s;
                            }
                            .fic-dot-idle   { background: #cbd5e1; }
                            .fic-dot-active { background: #94a3b8; box-shadow: 0 0 0 3px rgba(148,163,184,0.2); animation: dotPulse 1.4s ease-in-out infinite; }
                            .fic-dot-done   { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
                            .fic-dot-warn   { background: #f59e0b; animation: dotPulse 0.85s ease-in-out infinite; }
                            .fic-dot-commit { background: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.2); animation: dotPulse 1s ease-in-out infinite; }
                        `}</style>

                        {/* Panel ID strip */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px', padding: '0 2px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Profile Setup · 6 Instruments</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>did:web:pilotrecognition.com</span>
                        </div>

                        {/* Step 1 hero message — always present, fades out after step 1 */}
                        <div style={{
                            opacity: activeInstrument === 1 ? 1 : 0,
                            transform: activeInstrument === 1 ? 'translateY(0)' : 'translateY(-8px)',
                            transition: 'opacity 0.5s ease, transform 0.5s ease',
                            pointerEvents: 'none',
                            height: activeInstrument === 1 ? 'auto' : 0,
                            overflow: 'hidden',
                            marginBottom: activeInstrument === 1 ? '32px' : '0',
                        }}>
                            <p style={{ fontSize: '28px', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.35, letterSpacing: '-0.02em', margin: 0 }}>
                                Your first step to getting{' '}
                                <span style={{ color: '#ef4444', fontWeight: 700 }}>recognition</span>
                            </p>
                        </div>

                        {/* Step 2 ATC message — above grid, same pattern as step 1 message */}
                        <div style={{
                            opacity: activeInstrument === 2 ? 1 : 0,
                            visibility: activeInstrument === 2 ? 'visible' : 'hidden',
                            transform: activeInstrument === 2 ? 'translateY(0)' : 'translateY(-8px)',
                            transition: 'opacity 0.4s ease, transform 0.4s ease',
                            pointerEvents: 'none',
                            height: activeInstrument === 2 ? 'auto' : 0,
                            overflow: 'hidden',
                            marginBottom: activeInstrument === 2 ? '28px' : '0',
                        }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>ATC Calling...</p>
                            <p style={{ fontSize: '26px', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.35, letterSpacing: '-0.02em', margin: 0 }}>
                                Identify yourself,{' '}<span style={{ color: '#ef4444', fontWeight: 700 }}>pilot</span>
                                {' '}— and your{' '}<span style={{ color: '#ef4444', fontWeight: 700 }}>aircraft</span>
                            </p>
                        </div>

                        {/* Freestanding 3×2 Floating Grid */}
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'repeat(2, auto)', gap: '20px', maxWidth: '960px', margin: '0 auto' }}>

                            {/* ── TOP-LEFT: Identity ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 1 ? 'fic-active' : activeInstrument > 1 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${activeInstrument > 1 ? 'fic-dot-done' : activeInstrument === 1 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title fic-title-red">Identity</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <input
                                        className="fic-input"
                                        type="text"
                                        value={firstName}
                                        onChange={e => setFirstName(e.target.value)}
                                        placeholder="First name"
                                        disabled={activeInstrument < 1}
                                    />
                                    <input
                                        className="fic-input"
                                        type="text"
                                        value={lastName}
                                        onChange={e => setLastName(e.target.value)}
                                        placeholder="Last name"
                                        disabled={activeInstrument < 1}
                                    />
                                </div>
                                <input
                                    className="fic-input"
                                    type="text"
                                    value={displayName}
                                    onChange={e => setDisplayName(e.target.value)}
                                    placeholder="Callsign / nickname"
                                    disabled={activeInstrument < 1}
                                />
                                <button
                                    type="button"
                                    onClick={() => { if (firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2) setActiveInstrument(i => Math.max(i, 2)); }}
                                    disabled={firstName.trim().length < 1 || lastName.trim().length < 1 || displayName.trim().length < 2}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 ? '#0f172a' : '#f1f5f9',
                                        border: 'none', borderRadius: '8px',
                                        color: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 ? '#ffffff' : '#94a3b8',
                                        fontSize: '14px', fontWeight: 600,
                                        cursor: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { const ok = firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2; if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
                                    onMouseLeave={e => { const ok = firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2; if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
                                >
                                    {activeInstrument > 1 ? '✓ Identity Confirmed' : 'Confirm Identity →'}
                                </button>
                                <span className="fic-subtext">Callsign visible to all pilots</span>
                            </div>

                            {/* ── TOP-MIDDLE: Classification ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 2 ? 'fic-active' : activeInstrument > 2 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${activeInstrument > 2 ? 'fic-dot-done' : activeInstrument === 2 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Classification</div>
                                </div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    {/* Pilot licence */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Current Pilot Licence</div>
                                        <select
                                            className="fic-select"
                                            value={occupation}
                                            onChange={e => { setOccupation(e.target.value); if (e.target.value && aircraftTypes.length > 0) setActiveInstrument(i => Math.max(i, 3)); }}
                                            disabled={activeInstrument < 2}
                                            style={{ colorScheme: 'light' }}
                                        >
                                            <option value="" disabled>Select licence holder...</option>
                                            {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                    </div>
                                    {/* Aircraft type */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Aircraft Actively Flying <span style={{ color: '#cbd5e1', fontWeight: 400 }}>(select one or both)</span></div>
                                        <div style={{ display: 'flex', gap: '8px' }}>
                                            {['Fixed Wing', 'Rotary'].map(type => {
                                                const selected = aircraftTypes.includes(type);
                                                return (
                                                    <button
                                                        key={type}
                                                        type="button"
                                                        disabled={activeInstrument < 2}
                                                        onClick={() => {
                                                            const next = selected
                                                                ? aircraftTypes.filter(t => t !== type)
                                                                : [...aircraftTypes, type];
                                                            setAircraftTypes(next);
                                                            if (occupation && next.length > 0) setActiveInstrument(i => Math.max(i, 3));
                                                        }}
                                                        style={{
                                                            flex: 1, padding: '10px 8px',
                                                            background: selected ? '#0f172a' : '#f8fafc',
                                                            border: `1px solid ${selected ? '#0f172a' : '#cbd5e1'}`,
                                                            borderRadius: '8px',
                                                            color: selected ? '#fff' : '#475569',
                                                            fontSize: '13px', fontWeight: 600,
                                                            cursor: activeInstrument < 2 ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s',
                                                            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px'
                                                        }}
                                                    >
                                                        {type}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                <span className="fic-subtext">Pilot classification · aircraft type</span>
                            </div>

                            {/* ── TOP-RIGHT: Flight Time ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 3 ? 'fic-active' : activeInstrument > 3 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${activeInstrument > 3 ? 'fic-dot-done' : activeInstrument === 3 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Flight Time</div>
                                </div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input
                                        className="fic-input"
                                        type="number" min="0" max="99999"
                                        value={hoursWhole}
                                        onChange={e => { setHoursWhole(e.target.value); if (e.target.value !== '') setActiveInstrument(i => Math.max(i, 4)); }}
                                        placeholder="250"
                                        disabled={activeInstrument < 3}
                                    />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>HRS</span>
                                    <input
                                        className="fic-input"
                                        type="number" min="0" max="59"
                                        value={hoursMinutes}
                                        onChange={e => setHoursMinutes(e.target.value)}
                                        placeholder="00"
                                        disabled={activeInstrument < 3}
                                        style={{ maxWidth: '70px', textAlign: 'center' }}
                                    />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>MIN</span>
                                </div>
                                <span className="fic-subtext">Total logged flight time</span>
                            </div>

                            {/* ── BOTTOM-LEFT: Logbook ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 4 ? 'fic-active' : activeInstrument > 4 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${providerConnected ? 'fic-dot-done' : activeInstrument === 4 ? 'fic-dot-warn' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Logbook</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setShowLogbookModal(true); setActiveInstrument(i => Math.max(i, 5)); }}
                                    disabled={activeInstrument < 4}
                                    style={{
                                        width: '100%', padding: '13px 14px',
                                        background: providerConnected ? '#f0fdf4' : '#f8fafc',
                                        border: `1px solid ${providerConnected ? '#86efac' : '#cbd5e1'}`,
                                        borderRadius: '8px', color: providerConnected ? '#16a34a' : '#475569',
                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        textAlign: 'left', transition: 'all 0.2s'
                                    }}
                                >
                                    {providerConnected ? `${selectedProvider} ✓ Synced` : 'Connect provider →'}
                                </button>
                                <span className="fic-subtext">Verified flight data source</span>
                            </div>

                            {/* ── BOTTOM-MIDDLE: Pilot Credentials Wallet ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 5 ? 'fic-active' : activeInstrument > 5 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${walletConnected ? 'fic-dot-done' : activeInstrument === 5 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Pilot Credentials Wallet</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { setShowWalletSelector(true); setActiveInstrument(i => Math.max(i, 6)); }}
                                    disabled={activeInstrument < 5}
                                    style={{
                                        width: '100%', padding: '13px 14px',
                                        background: walletConnected ? '#f0fdf4' : '#f8fafc',
                                        border: `1px solid ${walletConnected ? '#86efac' : '#cbd5e1'}`,
                                        borderRadius: '8px', color: walletConnected ? '#16a34a' : '#475569',
                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        textAlign: 'left', transition: 'all 0.2s'
                                    }}
                                >
                                    {walletConnected ? `${selectedWallet} ✓ Connected` : 'Connect to Wallet →'}
                                </button>
                                <span className="fic-subtext">Decentralised identity wallet</span>
                            </div>

                            {/* ── BOTTOM-RIGHT: Commit ── */}
                            <div className={`floating-instrument-card fic-commit ${activeInstrument >= 6 ? 'fic-active' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${activeInstrument >= 6 ? 'fic-dot-commit' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Commit</div>
                                </div>
                                {saveError && <p style={{ color: '#f87171', fontSize: '11px', fontFamily: 'monospace', margin: 0 }}>{saveError}</p>}
                                <button
                                    onClick={handleSaveProfile}
                                    disabled={saving || activeInstrument < 6}
                                    style={{
                                        width: '100%', padding: '15px',
                                        background: activeInstrument >= 6 ? '#dc2626' : '#fef2f2',
                                        border: `1px solid ${activeInstrument >= 6 ? '#dc2626' : '#fecaca'}`,
                                        borderRadius: '8px', color: activeInstrument >= 6 ? '#fff' : '#fca5a5', fontWeight: 700,
                                        fontSize: '14px', cursor: activeInstrument >= 6 ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s', opacity: activeInstrument >= 6 ? 1 : 0.5,
                                        letterSpacing: '0.04em'
                                    }}
                                    onMouseEnter={e => { if (activeInstrument >= 6) (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c'; }}
                                    onMouseLeave={e => { if (activeInstrument >= 6) (e.currentTarget as HTMLButtonElement).style.background = '#dc2626'; }}
                                >
                                    {saving ? 'ENGAGING...' : 'COMPLETE PROFILE →'}
                                </button>
                                <span className="fic-subtext">Engage pilot profile</span>
                            </div>

                        </div>{/* end freestanding grid */}

                        {/* Disclaimer — always visible below grid */}
                        <div style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '6px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Secure Connection</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '11px' }}>·</span>
                                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px' }}>Powered by</span>
                                <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '11px', fontWeight: 700 }}>Auth0</span>
                            </div>
                            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', textAlign: 'center', lineHeight: 1.6, margin: 0, maxWidth: '680px' }}>
                                Pilot Recognition functions strictly as a neutral data infrastructure provider. By continuing, you authorize this read-only display and electronic consent tracking in accordance with applicable electronic commerce legislation and our{' '}
                                <button onClick={() => onNavigate('terms-of-service')} style={{ color: 'rgba(255,255,255,0.45)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', fontSize: 'inherit' }}>Terms of Service</button>.
                            </p>
                        </div>

                        {/* Progress strip */}
                        <div style={{ display: 'flex', gap: '6px', marginTop: '24px' }}>
                            {[1,2,3,4,5,6].map(n => (
                                <div key={n} style={{ flex: 1, height: '3px', borderRadius: '9999px', background: activeInstrument > n ? '#22c55e' : activeInstrument === n ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.12)', transition: 'background 0.4s' }} />
                            ))}
                        </div>
                        <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.35)', fontSize: '11px', marginTop: '8px', letterSpacing: '0.05em' }}>
                            {activeInstrument > 6 ? 'All instruments complete — ready to commit' : `Step ${Math.min(activeInstrument, 6)} of 6 — complete each instrument to proceed`}
                        </p>

                    </div>{/* end max-w-md */}
                </div>{/* end flex-1 center */}
            </div>{/* end h-screen */}

            {/* Logbook Provider Modal */}
            {showLogbookModal && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-hidden" onClick={() => setShowLogbookModal(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
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
                                    className={`group relative flex flex-row items-center gap-5 px-5 py-5 rounded-xl border transition-all text-left w-full cursor-pointer ${
                                        selectedProvider === p.name
                                            ? 'border-white/40 bg-white'
                                            : p.status === 'coming_soon'
                                            ? 'border-white/10 bg-white/5 cursor-not-allowed'
                                            : 'border-white/10 bg-white/8 backdrop-blur-sm hover:bg-white hover:border-white/40'
                                    }`}
                                >
                                    <span className="flex-shrink-0 w-16 h-16 flex items-center justify-center">
                                        {(p as any).logoImg
                                            ? <img src={(p as any).logoImg} alt={p.name} className="w-16 h-16 object-contain rounded" />
                                            : <span className="text-3xl">{p.logo}</span>
                                        }
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-base font-bold leading-tight ${selectedProvider === p.name ? 'text-slate-800' : 'text-white group-hover:text-slate-800'}`}>{p.name}</span>
                                            {(p as any).badge && (
                                                <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30">{(p as any).badge}</span>
                                            )}
                                        </div>
                                        <span className={`text-[10px] ${selectedProvider === p.name ? 'text-slate-400' : 'text-white/40 group-hover:text-slate-400'}`}>
                                            {p.region}{p.id === 'myflightbook' ? ' · Default logbook' : ''}
                                        </span>
                                        {(p as any).desc && (
                                            <span className="text-[9px] text-white/30 group-hover:text-slate-400 leading-tight block mt-0.5 truncate">{(p as any).desc}</span>
                                        )}
                                    </div>
                                    <span className={`text-[10px] font-semibold flex-shrink-0 ${p.methodColor}`}>{p.method}</span>
                                    {p.status === 'coming_soon' && (
                                        <>
                                            <span className="text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full flex-shrink-0">Soon</span>
                                            <div className="absolute inset-0 rounded-xl bg-slate-900/60 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                                                <span className="text-[10px] font-bold text-white/60 tracking-widest uppercase">Coming Soon</span>
                                            </div>
                                        </>
                                    )}
                                    {selectedProvider === p.name && (
                                        <span className="w-2 h-2 rounded-full bg-[#00b4d8] flex-shrink-0" />
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
                            className="w-full py-3 bg-[#dc2626] hover:bg-[#b91c1c] disabled:opacity-30 disabled:cursor-not-allowed text-white font-black rounded-xl transition-all text-sm tracking-wide"
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

            {/* Wallet Selector Modal */}
            {showWalletSelector && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-hidden" onClick={() => setShowWalletSelector(false)}>
                    <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
                    <div className="relative z-10 w-full max-w-2xl bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-white font-black text-base">Connect Credentials Wallet</h3>
                                <p className="text-white/40 text-xs mt-0.5">Select your decentralized identity wallet</p>
                            </div>
                            <button onClick={() => setShowWalletSelector(false)} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            {CREDENTIAL_WALLETS.slice(0, 6).map((w) => (
                                <button
                                    key={w.id}
                                    disabled={!w.href}
                                    onClick={() => {
                                        if (w.href) {
                                            setSelectedWallet(w.name);
                                            setWalletConnected(true);
                                            setShowWalletSelector(false);
                                            window.open(vcCredentialUrl ? w.href(vcCredentialUrl) : 'https://wallet.walt.id', '_blank');
                                        }
                                    }}
                                    className={`group relative flex flex-row items-center gap-4 px-4 py-4 rounded-xl border transition-all text-left w-full ${
                                        selectedWallet === w.name
                                            ? 'border-[#00b4d8] bg-[#00b4d8]/10'
                                            : !w.href
                                            ? 'border-white/10 bg-white/5 opacity-40 cursor-not-allowed'
                                            : 'border-white/10 bg-white/8 backdrop-blur-sm hover:bg-white hover:border-white/40'
                                    }`}
                                >
                                    <span className="text-2xl flex-shrink-0 w-10 text-center">{w.logo}</span>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`text-sm font-bold leading-tight ${selectedWallet === w.name ? 'text-white' : 'text-white group-hover:text-slate-800'}`}>{w.name}</span>
                                        </div>
                                        <span className={`text-[10px] ${selectedWallet === w.name ? 'text-white/50' : 'text-white/40 group-hover:text-slate-400'}`}>{w.desc}</span>
                                    </div>
                                    {!w.href && (
                                        <span className="text-[9px] bg-white/10 text-white/40 px-1.5 py-0.5 rounded-full flex-shrink-0">Soon</span>
                                    )}
                                    {selectedWallet === w.name && (
                                        <span className="w-2 h-2 rounded-full bg-[#00b4d8] flex-shrink-0" />
                                    )}
                                </button>
                            ))}
                        </div>
                        <button
                            onClick={() => setShowWalletSelector(false)}
                            className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl transition-all text-sm tracking-wide"
                        >
                            Cancel
                        </button>
                        <p className="text-white/25 text-[10px] text-center leading-relaxed mt-3">
                            W3C Verifiable Credentials · DID · Decentralized Identity
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
