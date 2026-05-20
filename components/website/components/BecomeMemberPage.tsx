
import React, { useState, useEffect, useRef } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { TopNavbar } from './TopNavbar';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '../../../src/lib/device-detection';
import { supabase } from '../../../src/lib/supabase';
import { WalletFirstCredentialFlow } from './WalletFirstCredentialFlow';
import { DataControllerAgreementModal } from './DataControllerAgreementModal';

const COUNTRIES = [
    'Afghanistan','Albania','Algeria','Andorra','Angola','Antigua and Barbuda','Argentina','Armenia','Australia','Austria',
    'Azerbaijan','Bahamas','Bahrain','Bangladesh','Barbados','Belarus','Belgium','Belize','Benin','Bhutan',
    'Bolivia','Bosnia and Herzegovina','Botswana','Brazil','Brunei','Bulgaria','Burkina Faso','Burundi','Cabo Verde','Cambodia',
    'Cameroon','Canada','Central African Republic','Chad','Chile','China','Colombia','Comoros','Congo (DRC)','Congo (Republic)',
    'Costa Rica','Croatia','Cuba','Cyprus','Czech Republic','Denmark','Djibouti','Dominica','Dominican Republic','Ecuador',
    'Egypt','El Salvador','Equatorial Guinea','Eritrea','Estonia','Eswatini','Ethiopia','Fiji','Finland','France',
    'Gabon','Gambia','Georgia','Germany','Ghana','Greece','Grenada','Guatemala','Guinea','Guinea-Bissau',
    'Guyana','Haiti','Honduras','Hungary','Iceland','India','Indonesia','Iran','Iraq','Ireland',
    'Israel','Italy','Jamaica','Japan','Jordan','Kazakhstan','Kenya','Kiribati','Kuwait','Kyrgyzstan',
    'Laos','Latvia','Lebanon','Lesotho','Liberia','Libya','Liechtenstein','Lithuania','Luxembourg','Madagascar',
    'Malawi','Malaysia','Maldives','Mali','Malta','Marshall Islands','Mauritania','Mauritius','Mexico','Micronesia',
    'Moldova','Monaco','Mongolia','Montenegro','Morocco','Mozambique','Myanmar','Namibia','Nauru','Nepal',
    'Netherlands','New Zealand','Nicaragua','Niger','Nigeria','North Korea','North Macedonia','Norway','Oman','Pakistan',
    'Palau','Palestine','Panama','Papua New Guinea','Paraguay','Peru','Philippines','Poland','Portugal','Qatar',
    'Romania','Russia','Rwanda','Saint Kitts and Nevis','Saint Lucia','Saint Vincent and the Grenadines','Samoa','San Marino','Sao Tome and Principe','Saudi Arabia',
    'Senegal','Serbia','Seychelles','Sierra Leone','Singapore','Slovakia','Slovenia','Solomon Islands','Somalia','South Africa',
    'South Korea','South Sudan','Spain','Sri Lanka','Sudan','Suriname','Sweden','Switzerland','Syria','Taiwan',
    'Tajikistan','Tanzania','Thailand','Timor-Leste','Togo','Tonga','Trinidad and Tobago','Tunisia','Turkey','Turkmenistan',
    'Tuvalu','Uganda','Ukraine','United Arab Emirates','United Kingdom','United States','Uruguay','Uzbekistan','Vanuatu','Vatican City',
    'Venezuela','Vietnam','Yemen','Zambia','Zimbabwe',
];

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

const LICENSE_ACCESS_MATRIX: Record<string, {
    terminal: string;
    color: string;
    dotColor: string;
    access: string[];
    restricted: string[];
}> = {
    'Student Pilot': {
        terminal: 'Terminal 2 — Cadet Track',
        color: '#f59e0b',
        dotColor: '#fbbf24',
        access: [
            'View all public pathways',
            'Browse flight school & cadet programs',
            'Submit interest to T2 cadet pathways',
            'Build recognition profile & logbook',
            'Veremark course check — Currently Enrolled, Course Completion, or Hours Verified',
            'No hours required — enrollment confirmation alone validates active student status',
            'Course completion badge — confirms finished ground school or phase milestones',
            'Verified status — confirms valid active student to operators & programs',
            'Verified status — unlocks eligibility for cadet scholarship & foundation programs',
            'ATO visibility — enrolled profile discoverable by ATOs scouting next intake pipelines',
            'Post-completion lock-in — operators can secure your interest before you finish the course',
            'Annual re-verification — refreshes enrollment, completion & hours each training year',
            'Annual re-verification — keeps profile current & visible to T2 operators year-on-year',
        ],
        restricted: ['Submit interest to T3 airline gates', 'Access enterprise operator dashboard'],
    },
    'Cadet': {
        terminal: 'Terminal 2 — Cadet Track',
        color: '#f59e0b',
        dotColor: '#fbbf24',
        access: [
            'View all public pathways',
            'Browse cadet & ab-initio programs',
            'Submit interest to T2 cadet pathways',
            'Build recognition profile & logbook',
            'Veremark course check — Currently Enrolled, Course Completion, or Hours Verified',
            'No hours required — enrollment confirmation alone validates active cadet status',
            'Course completion badge — confirms finished ground school or phase milestones',
            'Verified status — confirms valid active cadet to operators & programs',
            'Verified status — unlocks eligibility for cadet scholarship & foundation programs',
            'ATO visibility — enrolled profile discoverable by ATOs scouting next intake pipelines',
            'Post-completion lock-in — operators can secure your interest before you finish the course',
            'Annual re-verification — refreshes enrollment, completion & hours each training year',
            'Annual re-verification — keeps profile current & visible to T2 operators year-on-year',
        ],
        restricted: ['Submit interest to T3 airline gates', 'Access enterprise operator dashboard'],
    },
    'Private Pilot (PPL)': {
        terminal: 'Terminal 2 — Open Lounge',
        color: '#60a5fa',
        dotColor: '#3b82f6',
        access: [
            'View all public & T2 pathways',
            'Submit interest to T2 regional operators',
            'Build recognition profile & logbook',
            'Browse all programs',
            'Veremark annual hour verification — confirms logged hours before next currency cycle',
            'Annual re-verification — keeps profile current & visible to T2 operators year-on-year',
            'Verified hours — unlocks higher-confidence matching on T2 regional pathways',
            'Operator visibility — verified profile discoverable by regional operators & flight schools scouting active PPL holders',
            'Post-verification lock-in — operators can secure your interest ahead of next available intake',
        ],
        restricted: ['Submit interest to T3 international airline gates', 'Enterprise B2B operator dashboard'],
    },
    'Commercial Pilot (CPL)': {
        terminal: 'Terminal 3 — Full Access',
        color: '#34d399',
        dotColor: '#10b981',
        access: [
            'Full pathway access — T2 & T3',
            'Submit interest to all airline & operator gates',
            'Veremark background verification eligible',
            'Annual re-verification — confirms current hours & licence validity each year',
            'Annual re-verification — keeps verified status active for operator & airline pulls',
            'Operator & airline visibility — verified profile discoverable by T3 carriers actively scouting CPL holders',
            'Post-verification lock-in — airlines can secure your interest ahead of next available intake',
            'Recognition score & enterprise matching',
            'All programs — Foundation & Transition',
        ],
        restricted: [],
    },
    'Airline Pilot (ATPL)': {
        terminal: 'Terminal 3 — Full Access',
        color: '#34d399',
        dotColor: '#10b981',
        access: ['Full pathway access — T2 & T3', 'Submit interest to all airline & operator gates', 'Veremark background verification eligible', 'Priority recognition score matching', 'Senior/Command pathway visibility'],
        restricted: [],
    },
    'Flight Instructor (CFI)': {
        terminal: 'Terminal 3 — Full Access',
        color: '#34d399',
        dotColor: '#10b981',
        access: ['Full pathway access — T2 & T3', 'Submit interest to all airline & ATO gates', 'Instructor-track pathway visibility', 'Veremark background verification eligible', 'All programs access'],
        restricted: [],
    },
    'First Officer': {
        terminal: 'Terminal 3 — Full Access',
        color: '#34d399',
        dotColor: '#10b981',
        access: ['Full pathway access — T2 & T3', 'Submit interest to all airline gates', 'Veremark background verification eligible', 'Recognition score & priority matching'],
        restricted: [],
    },
    'Captain': {
        terminal: 'Terminal 3 — Full Access',
        color: '#a78bfa',
        dotColor: '#8b5cf6',
        access: ['Full pathway access — T2 & T3', 'Command-track & type rating pathway visibility', 'Priority enterprise matching & operator visibility', 'Veremark senior verification track', 'All programs including EBT scoring'],
        restricted: [],
    },
    'Other': {
        terminal: 'Terminal 2 — Open Lounge',
        color: '#94a3b8',
        dotColor: '#64748b',
        access: ['View all public pathways', 'Browse programs', 'Build recognition profile'],
        restricted: ['Submit interest to T3 airline gates', 'Enterprise operator dashboard'],
    },
};

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
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('');
    const [aircraftTypes, setAircraftTypes] = useState<string[]>([]);
    const [ratings, setRatings] = useState<string[]>([]);
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
    const [showWalletFirst, setShowWalletFirst] = useState(false);

    const CREDENTIAL_WALLETS = [
        { id: 'walt', name: 'walt.id Wallet', logo: '🔐', desc: 'DID · W3C VC · OID4VCI · open-source', color: 'text-[#00b4d8]', border: 'border-[#00b4d8]/40', href: (url: string) => `${import.meta.env.VITE_WALT_WALLET_URL}?offer=${encodeURIComponent(url)}` },
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

    // Issue verifiable credential directly via walt.id issuer
    const issueFlightHoursCredential = async (hours: number, auth0Id: string) => {
        try {
            console.log('Creating FlightHoursVC for', hours, 'hours');
            
            const WALT_ISSUER_URL = import.meta.env.VITE_WALT_ISSUER_URL;
            const ISSUER_DID = import.meta.env.VITE_WALT_ISSUER_DID;
            const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0Id.replace('|', '-')}`;

            const issuanceDate = new Date().toISOString();
            const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

            // Onboard issuer key (dev mode)
            const onboardRes = await fetch(`${WALT_ISSUER_URL}/onboard/issuer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: { backend: 'jwk', keyType: 'secp256r1' },
                    did: { method: 'jwk' }
                })
            });
            if (!onboardRes.ok) throw new Error('walt.id onboard failed');
            const onboardData = await onboardRes.json();

            // Save public keys for DID document
            console.log('Public keys for DID document:', onboardData.issuerKey.jwk);
            localStorage.setItem('walt_public_keys', JSON.stringify(onboardData.issuerKey.jwk));

            // Issue credential via OID4VCI
            const issueRes = await fetch(`${WALT_ISSUER_URL}/openid4vc/jwt/issue`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
                body: JSON.stringify({
                    issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
                    issuerDid: onboardData.issuerDid || ISSUER_DID,
                    credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
                    credentialData: {
                        '@context': ['https://www.w3.org/2018/credentials/v1'],
                        type: ['VerifiableCredential', 'FlightHoursVC'],
                        issuer: onboardData.issuerDid || ISSUER_DID,
                        issuanceDate: issuanceDate,
                        expirationDate: expirationDate,
                        credentialSubject: {
                            id: subjectDid,
                            flightHours: hours,
                            auth0Id: auth0Id,
                        },
                    },
                })
            });

            if (!issueRes.ok) {
                const errorText = await issueRes.text();
                console.error('Flight hours credential issue failed:', issueRes.status, errorText);
                throw new Error('walt.id issue failed');
            }
            const credentialOfferUrl = await issueRes.text();

            console.log('Raw flight hours credential offer URL:', credentialOfferUrl);
            setVcCredentialUrl(credentialOfferUrl);
            console.log('Flight hours credential created:', credentialOfferUrl);

            // Open wallet with credential
            const waltWallet = CREDENTIAL_WALLETS.find(w => w.id === 'walt');
            if (waltWallet && waltWallet.href) {
                console.log('Opening wallet with credential:', waltWallet.href(credentialOfferUrl));
                window.open(waltWallet.href(credentialOfferUrl), '_blank');
            }

        } catch (err) {
            console.error('Failed to issue flight hours credential:', err);
        }
    };

    useEffect(() => {
        const mfbHours = sessionStorage.getItem('mfb_total_hours');
        const mfbProvider = sessionStorage.getItem('mfb_provider');
        const logbookSynced = new URLSearchParams(window.location.search).get('logbook') === 'synced';
        const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');

        // Restore wallet state if returning from walt.id (stored when clicked)
        const savedWallet = sessionStorage.getItem('wallet_claimed_provider');
        if (savedWallet) {
            setWalletConnected(true);
            setSelectedWallet(savedWallet);
            // Unlock Commit card if we have logbook + wallet
            if (logbookSynced || sessionStorage.getItem('mfb_total_hours')) {
                setActiveInstrument(6);
            }
        }

        if (mfbHours && mfbProvider) {
            const hrs = parseFloat(mfbHours);
            setHoursWhole(String(Math.floor(hrs)));
            setHoursMinutes(String(Math.round((hrs % 1) * 60)));
            setSelectedProvider(mfbProvider);
            setProviderConnected(true);

            // If returning from logbook OAuth, unlock Logbook (4) and reveal next card (5)
            if (logbookSynced) {
                setActiveInstrument(5);
                // Flight data ready - user can choose to create wallet credential
                console.log('Flight data synced, ready for wallet credential creation');
            }

            const vcUrl = sessionStorage.getItem('vc_credential_offer_url');
            if (vcUrl) {
                setVcCredentialUrl(vcUrl);
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
                .update({ display_name: cleanName, first_name: cleanFirst, last_name: cleanLast, current_occupation: occupation, date_of_birth: dob || null, total_hours: hours, aircraft_types: aircraftTypes })
                .eq('auth0_id', auth0Id);
            if (error) throw error;
            onNavigate('platform');
        } catch {
            setSaveError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const [showDCAModal, setShowDCAModal] = useState(false);
    const [pendingSignupMethod, setPendingSignupMethod] = useState<'email' | 'google' | null>(null);

    const handleEmailSignup = () => {
        setPendingSignupMethod('email');
        setShowDCAModal(true);
    };

    const handleGoogleSignup = () => {
        setPendingSignupMethod('google');
        setShowDCAModal(true);
    };

    const handleDCAAgree = () => {
        setShowDCAModal(false);
        if (pendingSignupMethod === 'google') {
            loginWithRedirect({
                authorizationParams: {
                    connection: 'google-oauth2',
                    screen_hint: 'signup',
                    redirect_uri: `${window.location.origin}/auth/callback`,
                },
            });
        } else {
            loginWithRedirect({
                authorizationParams: {
                    screen_hint: 'signup',
                    redirect_uri: `${window.location.origin}/auth/callback`,
                },
            });
        }
        setPendingSignupMethod(null);
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
            <div className="relative flex flex-col" style={{ height: '100vh' }}>
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
                <div className="flex-1 flex flex-col items-center px-6 py-10" style={{ overflowY: 'auto', justifyContent: 'flex-start' }}>
                    <div className="w-full" style={{ maxWidth: '1600px' }}>
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
                                visibility: hidden;
                                pointer-events: none;
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px', padding: '0 2px' }}>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', fontWeight: 600 }}>Profile Setup · 6 Instruments</span>
                            <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.2)' }}>did:web:pilotrecognition.com</span>
                        </div>

                        {/* Step context text — above the grid, always visible */}
                        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                            {activeInstrument === 1 && (
                                <>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.15em', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Step 1 of 6</p>
                                    <p style={{ fontSize: '22px', fontWeight: 300, color: 'rgba(255,255,255,0.92)', lineHeight: 1.35, letterSpacing: '-0.02em', margin: '0 0 6px 0' }}>
                                        Your first step to getting{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>recognition</span>
                                    </p>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, margin: 0 }}>
                                        Enter your name and callsign. Your callsign will be visible to all pilots on the platform.
                                    </p>
                                </>
                            )}
                        </div>

                        {/* Grid */}
                        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 320px)', gap: '20px', alignItems: 'start', width: '1000px' }}>

                            {/* ── TOP-LEFT: Identity ── */}
                            <div style={{ position: 'relative' }}>
                            {activeInstrument === 1 && (
                                <div style={{
                                    position: 'absolute',
                                    left: 'calc(100% + 32px)',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '300px',
                                    pointerEvents: 'none',
                                }}>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>Step 1 of 6</p>
                                    <p style={{ fontSize: '32px', fontWeight: 300, color: 'rgba(255,255,255,0.95)', lineHeight: 1.25, letterSpacing: '-0.02em', margin: '0 0 14px 0' }}>
                                        Your first step to getting{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>recognition</span>
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.65, margin: 0 }}>
                                        Enter your name and callsign to begin.
                                    </p>
                                </div>
                            )}
                            {/* Circular done badge */}
                            {activeInstrument > 1 && (
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 0' }}>
                                    <div style={{ position: 'relative', width: '180px', height: '180px' }}>
                                        <svg width="180" height="180" viewBox="0 0 180 180" style={{ position: 'absolute', top: 0, left: 0 }}>
                                            <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="3" />
                                            <circle cx="90" cy="90" r="82" fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="3"
                                                strokeDasharray={`${2 * Math.PI * 82}`}
                                                strokeDashoffset="0"
                                                strokeLinecap="round"
                                                transform="rotate(-90 90 90)"
                                                style={{ transition: 'stroke-dashoffset 1s ease' }}
                                            />
                                            {/* Inner tick marks like an analog dial */}
                                            {Array.from({ length: 12 }).map((_, i) => {
                                                const angle = (i / 12) * 2 * Math.PI - Math.PI / 2;
                                                const x1 = 90 + 72 * Math.cos(angle);
                                                const y1 = 90 + 72 * Math.sin(angle);
                                                const x2 = 90 + 78 * Math.cos(angle);
                                                const y2 = 90 + 78 * Math.sin(angle);
                                                return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(255,255,255,0.3)" strokeWidth="1.5" />;
                                            })}
                                        </svg>
                                        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '3px' }}>
                                            <span style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Instrument 1</span>
                                            <span style={{ fontSize: '17px', fontWeight: 700, color: 'rgba(255,255,255,0.95)', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Identity</span>
                                            <span style={{ fontSize: '10px', fontWeight: 600, color: '#22c55e', letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: '2px' }}>● Completion</span>
                                        </div>
                                    </div>
                                </div>
                            )}
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
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        Date of Birth
                                        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '3px', background: '#dc2626', border: '1px solid #b91c1c', borderRadius: '4px', padding: '1px 5px', fontSize: '9px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🛃 Verified under Article 11</span>
                                    </div>
                                    <input
                                        type="date"
                                        value={dob}
                                        onChange={e => setDob(e.target.value)}
                                        max={new Date().toISOString().split('T')[0]}
                                        disabled={activeInstrument < 1}
                                        style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: `1px solid ${dob && (new Date().getFullYear() - new Date(dob).getFullYear() - (new Date() < new Date(new Date(dob).setFullYear(new Date(dob).getFullYear() + (new Date().getFullYear() - new Date(dob).getFullYear()))) ? 1 : 0)) < 18 ? '#fca5a5' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '13px', color: '#0f172a', colorScheme: 'light', boxSizing: 'border-box' }}
                                    />
                                    {(() => {
                                        if (!dob) return null;
                                        const today = new Date();
                                        const birth = new Date(dob);
                                        let age = today.getFullYear() - birth.getFullYear();
                                        const m = today.getMonth() - birth.getMonth();
                                        if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) age--;
                                        if (age >= 18) return null;
                                        return (
                                            <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#dc2626', fontWeight: 600, lineHeight: 1.5 }}>
                                                ⚠ You are restricted from submitting pathway applications until you reach 18 years of age. You may still build your profile and explore the platform.{' '}
                                                <a href="/data-controller-agreement#article-11" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}>Learn more →</a>
                                            </p>
                                        );
                                    })()}
                                </div>
                                <div>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Nationality</div>
                                    <select
                                        value={nationality}
                                        onChange={e => setNationality(e.target.value)}
                                        disabled={activeInstrument < 1}
                                        style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: nationality ? '#0f172a' : '#94a3b8', colorScheme: 'light', boxSizing: 'border-box', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                                    >
                                        <option value="" disabled>Select nationality...</option>
                                        {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { if (firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && dob && nationality) setActiveInstrument(i => Math.max(i, 2)); }}
                                    disabled={firstName.trim().length < 1 || lastName.trim().length < 1 || displayName.trim().length < 2 || !dob || !nationality}
                                    style={{
                                        width: '100%', padding: '12px 16px',
                                        background: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && !!dob && !!nationality ? '#0f172a' : '#f1f5f9',
                                        border: 'none', borderRadius: '8px',
                                        color: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && !!dob && !!nationality ? '#ffffff' : '#94a3b8',
                                        fontSize: '14px', fontWeight: 600,
                                        cursor: firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && !!dob && !!nationality ? 'pointer' : 'not-allowed',
                                        transition: 'all 0.2s',
                                    }}
                                    onMouseEnter={e => { const ok = firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && !!dob && !!nationality; if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
                                    onMouseLeave={e => { const ok = firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && !!dob && !!nationality; if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
                                >
                                    {activeInstrument > 1 ? '✓ Identity Confirmed' : 'Confirm Identity →'}
                                </button>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                        <span style={{ fontSize: '12px', flexShrink: 0 }}>🔓</span>
                                        <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Callsign is <strong>public</strong> and visible to other operators.</span>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                        <span style={{ fontSize: '12px', flexShrink: 0 }}>🔒</span>
                                        <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Real name, date of birth, and nationality are <strong>client-side encrypted</strong> and fully hidden under <a href="/data-controller-agreement#article-2" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Article 2</a>.</span>
                                    </div>
                                </div>
                            </div>
                            </div>{/* end position:relative wrapper */}

                            {/* ── TOP-MIDDLE: Classification ── */}
                            <div style={{ position: 'relative' }}>
                            {activeInstrument === 2 && (
                                <div style={{
                                    position: 'absolute',
                                    left: 'calc(100% + 32px)',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    width: '260px',
                                    pointerEvents: 'none',
                                }}>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 12px 0' }}>ATC Calling...</p>
                                    <p style={{ fontSize: '28px', fontWeight: 300, color: 'rgba(255,255,255,0.95)', lineHeight: 1.25, letterSpacing: '-0.02em', margin: '0 0 14px 0' }}>
                                        Identify yourself,{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>pilot</span>
                                        {' '}— and your{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>aircraft</span>
                                    </p>
                                    <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: 0 }}>
                                        Select your licence type and aircraft category to unlock your pathway access level.
                                    </p>
                                </div>
                            )}
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
                                            <option value="" disabled>Select current licence tier...</option>
                                            {OCCUPATIONS.map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        {(occupation === 'Student Pilot' || occupation === 'Cadet') && (
                                            <div style={{ marginTop: '8px', padding: '10px 12px', background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '8px' }}>
                                                <p style={{ margin: '0 0 4px 0', fontSize: '11px', fontWeight: 700, color: '#9a3412', display: 'flex', alignItems: 'center', gap: '5px' }}>
                                                    <span style={{ background: '#dc2626', color: '#fff', borderRadius: '3px', padding: '1px 5px', fontSize: '9px', letterSpacing: '0.06em', textTransform: 'uppercase' }}>🛃 Cadet Track Active</span>
                                                </p>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#7c2d12', lineHeight: 1.55 }}>
                                                    Your profile is optimised for Terminal 2 regional operators, flight instructors, and flight school pathways. Premium Terminal 3 gates will remain locked until CPL/ATPL milestones are claimed.
                                                </p>
                                            </div>
                                        )}
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
                                                            const next = selected ? aircraftTypes.filter(t => t !== type) : [...aircraftTypes, type];
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
                                    {/* Core Ratings */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Operational Ratings <span style={{ color: '#cbd5e1', fontWeight: 400 }}>(select all that apply)</span></div>
                                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                                            {['Instrument Rating (IR)', 'Multi-Engine (ME)'].map(rating => {
                                                const selected = ratings.includes(rating);
                                                return (
                                                    <button
                                                        key={rating}
                                                        type="button"
                                                        disabled={activeInstrument < 2}
                                                        onClick={() => setRatings(prev => selected ? prev.filter(r => r !== rating) : [...prev, rating])}
                                                        style={{
                                                            padding: '7px 12px',
                                                            background: selected ? '#dc2626' : '#f8fafc',
                                                            border: `1px solid ${selected ? '#dc2626' : '#cbd5e1'}`,
                                                            borderRadius: '20px',
                                                            color: selected ? '#fff' : '#475569',
                                                            fontSize: '12px', fontWeight: 600,
                                                            cursor: activeInstrument < 2 ? 'not-allowed' : 'pointer',
                                                            transition: 'all 0.2s',
                                                            whiteSpace: 'nowrap',
                                                        }}
                                                    >
                                                        {rating}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    </div>
                                </div>
                                {/* Security stamp */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '12px', flexShrink: 0 }}>🔒</span>
                                    <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Licence tier and operational capabilities are <strong>client-side encrypted</strong> before cloud routing under <a href="/data-controller-agreement#article-2" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Article 2</a>.</span>
                                </div>
                            </div>
                            </div>{/* end position:relative wrapper */}

                            {/* ── TOP-RIGHT: Flight Time ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 3 ? 'fic-active' : activeInstrument > 3 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${activeInstrument > 3 ? 'fic-dot-done' : activeInstrument === 3 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div><div className="fic-title">Flight Time</div></div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input className="fic-input" type="number" min="0" max="99999" value={hoursWhole} onChange={e => { setHoursWhole(e.target.value); if (e.target.value !== '') setActiveInstrument(i => Math.max(i, 4)); }} placeholder="250" disabled={activeInstrument < 3} />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>HRS</span>
                                    <input className="fic-input" type="number" min="0" max="59" value={hoursMinutes} onChange={e => setHoursMinutes(e.target.value)} placeholder="00" disabled={activeInstrument < 3} style={{ maxWidth: '70px', textAlign: 'center' }} />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>MIN</span>
                                </div>
                                <span className="fic-subtext">Total logged flight time</span>
                            </div>

                            {/* ── BOTTOM-LEFT: Pilot Credentials Wallet ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 4 ? 'fic-active' : activeInstrument > 4 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${walletConnected ? 'fic-dot-done' : activeInstrument === 4 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Pilot Credentials Wallet</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={() => { 
    console.log('Wallet button clicked'); 
    setShowWalletSelector(true); 
    setActiveInstrument(i => Math.max(i, 5)); 
}}
                                    disabled={activeInstrument < 4}
                                    style={{
                                        width: '100%', padding: '13px 14px',
                                        background: walletConnected ? '#f0fdf4' : '#f8fafc',
                                        border: `1px solid ${walletConnected ? '#86efac' : '#cbd5e1'}`,
                                        borderRadius: '8px', color: walletConnected ? '#16a34a' : '#475569',
                                        fontSize: '14px', fontWeight: 600, cursor: 'pointer',
                                        textAlign: 'left', transition: 'all 0.2s'
                                    }}
                                >
                                    {saving ? 'Saving...' : walletConnected ? 'Complete Profile ✓' : 'Complete Profile →'}
                                </button>
                                <span className="fic-subtext">Save profile and continue</span>
                            </div>

                            {/* ── BOTTOM-MIDDLE: Logbook ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 5 ? 'fic-active' : activeInstrument > 5 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${(providerConnected || showWalletFirst) ? 'fic-dot-done' : activeInstrument === 5 ? 'fic-dot-warn' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Logbook</div>
                                </div>
                                <div style={{ display: 'flex', gap: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setShowLogbookModal(true); setActiveInstrument(i => Math.max(i, 6)); }}
                                        disabled={activeInstrument < 5}
                                        style={{
                                            flex: 1, padding: '10px 8px',
                                            background: providerConnected ? '#f0fdf4' : '#f8fafc',
                                            border: `1px solid ${providerConnected ? '#86efac' : '#cbd5e1'}`,
                                            borderRadius: '8px', color: providerConnected ? '#16a34a' : '#475569',
                                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                            textAlign: 'center', transition: 'all 0.2s'
                                        }}
                                    >
                                        {providerConnected ? '✓ Connected' : 'Digital Logbook'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => { setShowWalletFirst(true); setActiveInstrument(i => Math.max(i, 6)); }}
                                        disabled={activeInstrument < 5}
                                        style={{
                                            flex: 1, padding: '10px 8px',
                                            background: showWalletFirst ? '#f0fdf4' : '#f8fafc',
                                            border: `1px solid ${showWalletFirst ? '#86efac' : '#cbd5e1'}`,
                                            borderRadius: '8px', color: showWalletFirst ? '#16a34a' : '#475569',
                                            fontSize: '12px', fontWeight: 600, cursor: 'pointer',
                                            textAlign: 'center', transition: 'all 0.2s'
                                        }}
                                    >
                                        {showWalletFirst ? '✓ Wallet' : 'Direct to Wallet'}
                                    </button>
                                </div>
                                {providerConnected && (
                                    <button
                                        type="button"
                                        onClick={async () => {
                                            console.log('Create credential button clicked');
                                            const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');
                                            const hrs = parseFloat(hoursWhole) + (parseFloat(hoursMinutes || '0') / 60);
                                            console.log('Auth0 ID:', auth0Id, 'Hours:', hrs);
                                            if (auth0Id && hrs > 0) {
                                                await issueFlightHoursCredential(hrs, auth0Id);
                                            } else {
                                                console.log('Missing auth0Id or hours');
                                            }
                                        }}
                                        style={{
                                            width: '100%', padding: '8px',
                                            background: '#00b4d8', border: '1px solid #00b4d8',
                                            borderRadius: '6px', color: 'white',
                                            fontSize: '11px', fontWeight: 600, cursor: 'pointer',
                                            textAlign: 'center', transition: 'all 0.2s', marginTop: '8px'
                                        }}
                                    >
                                        Create Flight Hours Credential →
                                    </button>
                                )}
                                <span className="fic-subtext">Choose verification method</span>
                            </div>

                            {/* ── BOTTOM-RIGHT: Commit ── */}
                            <div className={`floating-instrument-card ${activeInstrument === 6 ? 'fic-active' : activeInstrument > 6 ? 'fic-done' : 'fic-locked'}`}>
                                <span className={`fic-status-dot ${walletConnected ? 'fic-dot-done' : activeInstrument === 6 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div>
                                    <div className="fic-title">Commit</div>
                                </div>
                                <button
                                    type="button"
                                    onClick={handleSaveProfile}
                                    disabled={activeInstrument < 6 || saving}
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

                        </div>{/* end inner grid */}


                        {/* Access panel — flex sibling to the right of the grid, only during step 2 with licence selected */}
                        {activeInstrument === 2 && (
                            <div style={{ width: '260px', flexShrink: 0, alignSelf: 'flex-start' }}>
                                {occupation && LICENSE_ACCESS_MATRIX[occupation] ? (() => {
                                    const mx = LICENSE_ACCESS_MATRIX[occupation];
                                    return (
                                        <div style={{ background: '#ffffff', border: `1px solid ${mx.color}50`, borderRadius: '12px', overflow: 'hidden' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 16px', background: `${mx.color}12`, borderBottom: `1px solid ${mx.color}30` }}>
                                                <span style={{ width: '7px', height: '7px', borderRadius: '50%', background: mx.dotColor, flexShrink: 0, display: 'inline-block' }} />
                                                <span style={{ fontSize: '10px', fontWeight: 700, color: '#111827', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{mx.terminal}</span>
                                                <span style={{ marginLeft: 'auto', fontSize: '9px', fontWeight: 600, color: mx.color }}>{mx.restricted.length === 0 ? 'Full Access' : 'Restricted'}</span>
                                            </div>
                                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr' }}>
                                                <div style={{ borderRight: '1px solid #f1f5f9' }}>
                                                    <div style={{ padding: '6px 12px', background: '#f8faf8', borderBottom: '1px solid #e5e7eb' }}>
                                                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#15803d', textTransform: 'uppercase', letterSpacing: '0.07em' }}>✓ Access</span>
                                                    </div>
                                                    {mx.access.map(item => (
                                                        <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '5px 12px', borderBottom: '1px solid #f9fafb' }}>
                                                            <span style={{ color: '#16a34a', fontSize: '10px', marginTop: '1px', flexShrink: 0, fontWeight: 700 }}>✓</span>
                                                            <span style={{ fontSize: '11px', color: '#111827', lineHeight: 1.4 }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                                <div>
                                                    <div style={{ padding: '6px 12px', background: '#fdf8f8', borderBottom: '1px solid #e5e7eb' }}>
                                                        <span style={{ fontSize: '9px', fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em' }}>✕ Restricted</span>
                                                    </div>
                                                    {mx.restricted.length === 0 ? (
                                                        <div style={{ padding: '10px 12px' }}>
                                                            <span style={{ fontSize: '11px', color: '#6b7280', fontStyle: 'italic' }}>No restrictions — full access</span>
                                                        </div>
                                                    ) : mx.restricted.map(item => (
                                                        <div key={item} style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '5px 12px', borderBottom: '1px solid #f9fafb' }}>
                                                            <span style={{ color: '#dc2626', fontSize: '10px', marginTop: '1px', flexShrink: 0, fontWeight: 700 }}>✕</span>
                                                            <span style={{ fontSize: '11px', color: '#374151', lineHeight: 1.4 }}>{item}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })() : (
                                    <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px dashed rgba(255,255,255,0.15)', borderRadius: '12px', padding: '24px 16px', textAlign: 'center' }}>
                                        <span style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)' }}>Select a licence to see your access level</span>
                                    </div>
                                )}
                            </div>
                        )}

                        </div>{/* end outer flex wrapper */}

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

                        {/* Persistent legal footer — required by GDPR & DPA during all data collection steps */}
                        <div style={{ marginTop: '16px', paddingTop: '14px', borderTop: '1px solid rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '6px 16px' }}>
                            <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Legal</span>
                            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px' }}>·</span>
                            <button onClick={() => onNavigate('privacy-policy')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
                            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px' }}>·</span>
                            <button onClick={() => onNavigate('terms-of-service')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
                            <span style={{ color: 'rgba(255,255,255,0.12)', fontSize: '10px' }}>·</span>
                            <button onClick={() => onNavigate('data-controller-agreement')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.35)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Data Controller Agreement — PR-DCA-001</button>
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
                                    onClick={async () => {
                                        if (w.href) {
                                            setSelectedWallet(w.name);
                                            setShowWalletSelector(false);
                                            sessionStorage.setItem('wallet_claimed_provider', w.name);
                                            
                                            // For walt.id, open local mock wallet with credential offer
                                            if (w.id === 'walt') {
                                                try {
                                                    console.log('Opening local mock walt.id wallet');
                                                    
                                                    // Generate a fresh credential offer for the local wallet
                                                    const localCredentialOfferUrl = 'openid-credential-offer://?credential_offer_uri=http://localhost:8080/offer';
                                                    
                                                    setVcCredentialUrl(localCredentialOfferUrl);
                                                    setWalletConnected(true);
                                                    
                                                    // Open local mock wallet
                                                    const localWalletUrl = 'http://localhost:8080';
                                                    console.log('Opening local wallet:', localWalletUrl);
                                                    window.open(localWalletUrl, '_blank');
                                                    return;
                                                    
                                                } catch (err) {
                                                    console.error('Failed to open local wallet:', err);
                                                }
                                            }
                                            
                                            // For other wallets or fallback, open directly
                                            setWalletConnected(true);
                                            const walletUrl = 
                                                w.id === 'talao' ? 'https://app.talao.co/wallet' :
                                                w.id === 'lissi' ? 'https://lissi.id/wallet' :
                                                w.id === 'dock' ? 'https://certs.dock.io/wallet' : '#';
                                            
                                            console.log('Opening wallet directly:', walletUrl);
                                            window.open(walletUrl, '_blank');
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
                                Sign up with Google
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
                            You are the Data Controller. Your data is encrypted on your device before it reaches us.
                            We cannot read, modify, or monetize your personal information. By continuing, you agree to our{' '}
                            <a href="/terms" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-slate-200 transition-colors">Privacy Policy & Terms</a>
                            {' '}and the{' '}
                            <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-white underline hover:text-slate-200 transition-colors">Data Controller Agreement</a>.
                        </p>
                        </div>{/* end right column */}
                    </div>{/* end flex row */}
                </div>

                {/* Wallet-First Credential Modal */}
                {showWalletFirst && (
                    <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-auto">
                        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setShowWalletFirst(false)} />
                        <div className="relative z-10 w-full max-w-4xl bg-white rounded-2xl shadow-2xl max-h-[90vh] overflow-y-auto">
                            <div className="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 rounded-t-2xl">
                                <div className="flex items-center justify-between">
                                    <h3 className="text-xl font-bold text-gray-900">Create Your Digital Credential</h3>
                                    <button 
                                        onClick={() => setShowWalletFirst(false)}
                                        className="text-gray-400 hover:text-gray-600 text-2xl leading-none"
                                    >
                                        ×
                                    </button>
                                </div>
                            </div>
                            
                            <div className="p-6">
                                <WalletFirstCredentialFlow
                                    auth0Id={user?.sub || ''}
                                    onCredentialClaimed={(credentialUrl) => {
                                        setVcCredentialUrl(credentialUrl);
                                        setWalletConnected(true);
                                        setSelectedWallet('walt');
                                        setActiveInstrument(6);
                                        setShowWalletFirst(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            <DataControllerAgreementModal
                isOpen={showDCAModal}
                onClose={() => { setShowDCAModal(false); setPendingSignupMethod(null); }}
                onAgree={handleDCAAgree}
            />
        </>
    );
};
