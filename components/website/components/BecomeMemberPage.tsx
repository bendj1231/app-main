
import React, { useState, useEffect, useRef } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { createPortal } from 'react-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
// TopNavbar removed for a focused create-account experience
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '../../../src/lib/device-detection';
import { DataControllerAgreementModal } from './DataControllerAgreementModal';
import { supabase } from '../../../src/lib/supabase';
import { WalletFirstCredentialFlow } from './WalletFirstCredentialFlow';
import { issueAndStoreCredential, issueAndStoreCredentialSelfHosted } from '../../../src/lib/wallet';
import { getVaultKeyFromAuth0Token, encryptFields } from '../../../lib/vault';
import { getRegionalSupabaseClient, getJurisdictionCode } from '../../../lib/regionalRouter';
import { getAuth0RedirectUri } from '@/src/lib/auth0';

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
    onLogin?: () => void;
}

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

const AppleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" fill="currentColor"/>
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
    'Fast Track Pilot Program',
    'Other',
];

const LockIcon = () => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
);

const FolderIcon = () => (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
    </svg>
);

const LockedUpload: React.FC<{ label: string }> = ({ label }) => (
    <div style={{ position: 'relative', width: '100%', borderRadius: '8px', overflow: 'hidden' }}>
        <button disabled style={{ width: '100%', padding: '10px 12px', background: '#f1f5f9', border: '1px dashed #cbd5e1', borderRadius: '8px', color: '#94a3b8', fontSize: '12px', fontWeight: 600, cursor: 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}>
            <FolderIcon />
            {label}
        </button>
        <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '2px', cursor: 'not-allowed', background: 'rgba(241,245,249,0.6)', backdropFilter: 'blur(1px)', borderRadius: '8px' }}>
            <LockIcon />
            <span style={{ fontSize: '10px', fontWeight: 600, color: '#64748b' }}>{label}</span>
        </div>
    </div>
);

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { loginWithRedirect, user, isAuthenticated, isLoading, getIdTokenClaims } = useAuth0();
    const [enableShader, setEnableShader] = useState(false);
    const isSetup = new URLSearchParams(window.location.search).get('setup') === '1';
    const setupInitRef = React.useRef(false);
    // Supabase session for Google-OAuth users (not Auth0)
    const [supabaseUser, setSupabaseUser] = useState<{ id: string; email: string; name: string } | null>(null);
    const [supabaseSessionLoading, setSupabaseSessionLoading] = useState(isSetup);

    // Run once on mount — clear flags that would block session restoration on OAuth redirect
    if (isSetup && !setupInitRef.current && typeof localStorage !== 'undefined') {
        setupInitRef.current = true;
        localStorage.removeItem('explicitLogout');
        sessionStorage.removeItem('wallet_claimed_provider');
        sessionStorage.removeItem('wallet_did');
    }

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
    const [issuingAuthority, setIssuingAuthority] = useState('');
    const [aircraftCategory, setAircraftCategory] = useState('');
    const [typeRatings, setTypeRatings] = useState<string[]>([]);
    const [typeRatingInput, setTypeRatingInput] = useState('');
    const [elpLevel, setElpLevel] = useState('');
    const [showMoreClasses, setShowMoreClasses] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showAircraftSection, setShowAircraftSection] = useState(false);
    const [showRatingsSection, setShowRatingsSection] = useState(false);
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
    const [showPasskeyCancelled, setShowPasskeyCancelled] = useState(false);
    const [backupRecoveryKey, setBackupRecoveryKey] = useState('');
    const [recoveryCopied, setRecoveryCopied] = useState(false);
    const [activeInstrument, setActiveInstrument] = useState(1);
    const [showWalletFirst, setShowWalletFirst] = useState(false);
    const [walletStorageChoice, setWalletStorageChoice] = useState<string>('both');
    const [showWalletStorage, setShowWalletStorage] = useState(false);
    const [walletCreating, setWalletCreating] = useState<'idle' | 'generating' | 'syncing' | 'active'>('idle');
    const [consentChecked, setConsentChecked] = useState(false);
    const [showBiometricNotice, setShowBiometricNotice] = useState(false);
    const [passkeyContext, setPasskeyContext] = useState<{ userId: string; email: string; name: string } | null>(null);
    const passkeyRegistrationRef = React.useRef<(() => Promise<void>) | null>(null);

    const CREDENTIAL_WALLETS = [
        { id: 'pilot', name: 'PilotRecognition PIC', logo: '🔐', desc: 'Pilot Identity Credentials · Secure digital verification', color: 'text-[#00b4d8]', border: 'border-[#00b4d8]/40', href: (url: string) => `${import.meta.env.VITE_PILOT_WALLET_URL}?offer=${encodeURIComponent(url)}` },
    ];

    const LOGBOOK_PROVIDERS = [
        { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png', badge: 'Free', status: 'available', method: 'OAuth 2.0', methodColor: 'text-[#00b4d8]' },
    ];

    useEffect(() => {
        setEnableShader(shouldEnable3DEffects());
    }, []);

    // ── Detect Supabase session (for Google OAuth users who bypass Auth0) ──
    useEffect(() => {
        if (!isSetup) return;
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session?.user) {
                const sbUser = {
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || '',
                };
                setSupabaseUser(sbUser);
                // Pre-populate display name from Supabase user metadata
                setDisplayName(sbUser.name);
            }
            setSupabaseSessionLoading(false);
        });
    }, [isSetup]);

    useEffect(() => {
        const ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) {
            document.cookie = `pr_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        }
    }, []);

    useEffect(() => {
        if (isSetup && isLoading) {
            const t = setTimeout(() => {
                console.warn('[DEBUG][BecomeMember] ⚠️ Auth0 timed out after 3s — forcing render with authTimedOut=true');
                setAuthTimedOut(true);
            }, 3000);
            return () => clearTimeout(t);
        }
    }, [isSetup, isLoading]);

    useEffect(() => {
        if (isSetup && user) {
            setDisplayName(user.name || user.email?.split('@')[0] || '');
            // Cache so wallet button can resolve it even if hook re-renders slowly
            if (user.sub) {
                sessionStorage.setItem('mfb_auth0_id', user.sub);
            }
        }
    }, [isSetup, user, isLoading]);


    // Issue verifiable credential via PilotRecognition issuer
    const issueFlightHoursCredential = async (hours: number, auth0Id: string) => {
        try {
            
            const PILOT_ISSUER_URL = import.meta.env.VITE_PILOT_ISSUER_URL;
            const ISSUER_DID = import.meta.env.VITE_ISSUER_DID;
            const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0Id.replace('|', '-')}`;

            const issuanceDate = new Date().toISOString();
            const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

            // Onboard issuer key (dev mode)
            const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    key: { backend: 'jwk', keyType: 'secp256r1' },
                    did: { method: 'jwk' }
                })
            });
            if (!onboardRes.ok) throw new Error('Issuer onboard failed');
            const onboardData = await onboardRes.json();

            // Save public keys for DID document
            localStorage.setItem('pilot_issuer_public_keys', JSON.stringify(onboardData.issuerKey.jwk));

            // Issue credential via OID4VCI
            const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
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
                throw new Error('Issuer signing failed');
            }
            const credentialOfferUrl = await issueRes.text();

            setVcCredentialUrl(credentialOfferUrl);

            // Open wallet with credential
            const pilotWallet = CREDENTIAL_WALLETS.find(w => w.id === 'pilot');
            if (pilotWallet && pilotWallet.href) {
                window.open(pilotWallet.href(credentialOfferUrl), '_blank', 'noopener,noreferrer');
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

        // Restore wallet state only if it belongs to the current user
        const savedWallet = sessionStorage.getItem('wallet_claimed_provider');
        const savedAuth0Id = sessionStorage.getItem('mfb_auth0_id');
        // Clear stale wallet state if a different user is now logged in
        if (auth0Id && savedAuth0Id && savedAuth0Id !== auth0Id) {
            sessionStorage.removeItem('wallet_claimed_provider');
            sessionStorage.removeItem('wallet_did');
            sessionStorage.removeItem('mfb_auth0_id');
        }
        if (savedWallet && auth0Id && savedAuth0Id === auth0Id) {
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

            // If returning from logbook OAuth, land on Wallet step (4)
            if (logbookSynced) {
                setActiveInstrument(4);
            }

            const vcUrl = sessionStorage.getItem('vc_credential_offer_url');
            if (vcUrl) {
                setVcCredentialUrl(vcUrl);
            }
            sessionStorage.removeItem('mfb_total_hours');
            sessionStorage.removeItem('mfb_provider');
        }
    }, []);

    // Silent partial save — called after each step confirm so data is never lost even if user drops off
    const savePartialProfile = async (fields: Record<string, any>) => {
        try {
            const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');
            if (!auth0Id) return;
            const { data: { session } } = await supabase.auth.getSession();
            const sbUserId = session?.user?.id;

            // Try auth0_id first
            const { data: updatedRows } = await supabase.from('profiles').update(fields)
                .eq('auth0_id', auth0Id).select('id');
            if ((!updatedRows || updatedRows.length === 0) && sbUserId) {
                await supabase.from('profiles').update({ ...fields, auth0_id: auth0Id }).eq('id', sbUserId);
            }
        } catch (e) {
            console.warn('[BecomeMember] partial save failed (non-blocking):', e);
        }
    };

    const handleSaveProfile = async () => {
        const { data: { session: dbgSession } } = await supabase.auth.getSession();
        const cleanFirst = firstName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanLast = lastName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
        if (!cleanFirst || cleanFirst.length < 1) { setSaveError('First name is required.'); return; }
        if (!cleanLast || cleanLast.length < 1) { setSaveError('Last name is required.'); return; }
        if (!cleanName || cleanName.length < 2) { setSaveError('Callsign is required.'); return; }
        if (!OCCUPATIONS.includes(occupation)) { setSaveError('Please select a valid role.'); return; }
        if (!issuingAuthority || issuingAuthority.trim() === '') { setSaveError('License issuing authority is required to determine your data residency region.'); return; }
        const wholeHrs = parseInt(hoursWhole);
        const mins = parseInt(hoursMinutes || '0');
        if (hoursWhole && (isNaN(wholeHrs) || wholeHrs < 0 || wholeHrs > 99999)) { setSaveError('Please enter valid flight hours.'); return; }
        if (isNaN(mins) || mins < 0 || mins > 59) { setSaveError('Minutes must be between 0 and 59.'); return; }
        const hours = wholeHrs + mins / 60;
        const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');
        // For Supabase Google OAuth users, auth0Id may be null — use Supabase session user id directly
        const sbUserId = dbgSession?.user?.id || supabaseUser?.id;
        if (!auth0Id && !sbUserId) { setSaveError('Authentication error. Please sign in again.'); return; }
        setSaving(true);
        setSaveError('');
        try {
            // Determine region based on license issuing authority
            const regionalSupabase = getRegionalSupabaseClient(issuingAuthority);
            const jurisdictionCode = getJurisdictionCode(issuingAuthority);

            const payload = {
                display_name: cleanName,
                full_name: `${cleanFirst} ${cleanLast}`.trim(),
                current_occupation: occupation,
                date_of_birth: dob || null,
                total_flight_hours: hours || null,
                aircraft_types: aircraftTypes.length > 0 ? aircraftTypes : null,
                aircraft_rated_on: aircraftTypes.length > 0 ? aircraftTypes.join(', ') : null,
                nationality: nationality || null,
                license_issuing_authority: issuingAuthority || null,
                country_of_license: issuingAuthority || null,
                origin_jurisdiction: jurisdictionCode,
                ratings: ratings.length > 0 ? ratings : null,
                license_types: typeRatings.length > 0 ? typeRatings : (occupation ? [occupation] : null),
            };

            // Primary: update by auth0_id (Auth0 users)
            let updatedRows: { id: string }[] | null = null;
            let updateError: unknown = null;
            if (auth0Id) {
                const { error, data } = await regionalSupabase
                    .from('profiles')
                    .update(payload)
                    .eq('auth0_id', auth0Id)
                    .select('id');
                updatedRows = data;
                updateError = error;
                if (updateError) { console.error('🔴 [handleSaveProfile] supabase error:', updateError); throw updateError; }
            }

            // Fallback: update by Supabase session user id (Supabase Google OAuth users)
            if (!updatedRows || updatedRows.length === 0) {
                if (!sbUserId) throw new Error('No Supabase session user id available');
                // Check if profile row already exists
                const { data: existing } = await regionalSupabase
                    .from('profiles')
                    .select('id')
                    .eq('id', sbUserId)
                    .maybeSingle();
                if (existing) {
                    // Update existing row
                    const { error: fbError } = await regionalSupabase
                        .from('profiles')
                        .update({ ...payload, ...(auth0Id ? { auth0_id: auth0Id } : {}) })
                        .eq('id', sbUserId);
                    if (fbError) { console.error('🔴 [handleSaveProfile] update fallback error:', fbError); throw fbError; }
                } else {
                    // Insert new profile row for new Google OAuth user
                    const userEmail = dbgSession?.user?.email || supabaseUser?.email || '';
                    const { count } = await regionalSupabase
                        .from('profiles')
                        .select('id', { count: 'exact', head: true });
                    const nextNum = (count ?? 2) + 1;
                    const autoPilotId = `PR${String(nextNum).padStart(4, '0')}`;
                    const { error: insertError } = await regionalSupabase
                        .from('profiles')
                        .insert({
                            id: sbUserId,
                            email: userEmail,
                            role: 'mentee',
                            status: 'active',
                            pilot_id: autoPilotId,
                            enrolled_programs: [],
                            created_at: new Date().toISOString(),
                            updated_at: new Date().toISOString(),
                            ...(auth0Id ? { auth0_id: auth0Id } : {}),
                            ...payload,
                        });
                    if (insertError) { console.error('🔴 [handleSaveProfile] insert error:', insertError); throw insertError; }
                }
            }

            // Issue self-hosted Verifiable Credential (Mauritius Data Controller framework)
            try {
                // Get profile ID for credential issuance
                const { data: profileData } = await supabase
                    .from('profiles')
                    .select('id, license_id, license_type, license_expiry, country_of_license')
                    .eq('auth0_id', auth0Id)
                    .single();
                
                if (profileData?.id) {
                    
                    // Use license data if available, otherwise use placeholder for demo
                    const licenseNum = profileData.license_id || `TEMP-${auth0Id.slice(-8)}`;
                    const licenseType = profileData.license_type || occupation || 'Pilot';
                    const licenseExpiry = profileData.license_expiry || null;
                    const issuingAuth = profileData.country_of_license || nationality || 'CAAP';
                    
                    const vcResult = await issueAndStoreCredentialSelfHosted(
                        auth0Id,
                        profileData.id,
                        licenseNum,
                        licenseType,
                        issuingAuth,
                        licenseExpiry,
                        hours || 0
                    );
                    
                    if (vcResult.success) {
                    } else {
                        console.warn('🟡 [VC] Self-hosted credential issuance failed:', vcResult.error);
                    }
                }
            } catch (vcErr) {
                console.error('🔴 [VC] Error during credential issuance:', vcErr);
                // Non-blocking — profile is already saved
            }

            // Passkey registration
            if (window.PublicKeyCredential) {
                try {
                    const { data: { session: sbSession } } = await supabase.auth.getSession();
                    const userId = sbSession?.user?.id || auth0Id;
                    const userEmail = sbSession?.user?.email || user?.email || auth0Id;
                    const challengeBytes = new Uint8Array(32);
                    crypto.getRandomValues(challengeBytes);
                    const userIdBytes = new TextEncoder().encode(userId);
                    const rpId = window.location.hostname === 'localhost'
                        ? 'localhost'
                        : window.location.hostname.replace('www.', '');
                    const result = await navigator.credentials.create({
                        publicKey: {
                            challenge: challengeBytes.buffer,
                            rp: { name: 'PilotRecognition', id: rpId },
                            user: { id: userIdBytes.buffer, name: userEmail, displayName: cleanName },
                            pubKeyCredParams: [
                                { type: 'public-key', alg: -7 },
                                { type: 'public-key', alg: -257 },
                            ],
                            authenticatorSelection: { userVerification: 'required', residentKey: 'required' },
                            timeout: 60000,
                        },
                    }) as PublicKeyCredential | null;
                    if (result) {
                        const attestation = result.response as AuthenticatorAttestationResponse;
                        const pubKeyBuf = attestation.getPublicKey?.();
                        // Persist credential ID to localStorage so login modal can use it
                        localStorage.setItem('pr_passkey_registered', 'true');
                        localStorage.setItem('pr_passkey_credential_id', result.id);
                        // Persist public key to Supabase pilot_passkeys for server-side verify
                        const ua = navigator.userAgent;
                        const deviceName = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Unknown';
                        await supabase.from('pilot_passkeys').upsert({
                            user_id: userId,
                            credential_id: result.id,
                            public_key: pubKeyBuf ? Array.from(new Uint8Array(pubKeyBuf)) : [],
                            sign_count: 0,
                            device_name: deviceName,
                            transports: (result as any).response?.getTransports?.() ?? [],
                        }, { onConflict: 'credential_id' });
                    } else {
                    }
                } catch (passkeyErr: any) {
                    console.error('🔴 [Passkey] credentials.create FAILED:', passkeyErr?.name, passkeyErr?.message, passkeyErr);
                }
            } else {
                console.warn('🟡 [Passkey] PublicKeyCredential not available — WebAuthn not supported');
            }

            onNavigate('platform');
        } catch (err) {
            console.error('🔴 [handleSaveProfile] outer catch:', err);
            setSaveError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const [showDCAModal, setShowDCAModal] = useState(false);
    const [pendingSignupMethod, setPendingSignupMethod] = useState<'email' | 'google' | 'apple' | null>(null);

    const handleEmailSignup = () => {
        setPendingSignupMethod('email');
        setShowDCAModal(true);
    };

    const handleGoogleSignup = () => {
        setPendingSignupMethod('google');
        setShowDCAModal(true);
    };

    const handleAppleSignup = () => {
        setPendingSignupMethod('apple');
        setShowDCAModal(true);
    };

    const handleDCAAgree = () => {
        setShowDCAModal(false);
        if (pendingSignupMethod === 'google') {
            loginWithRedirect({
                authorizationParams: {
                    connection: 'google-oauth2',
                    screen_hint: 'signup',
                    redirect_uri: getAuth0RedirectUri(),
                },
            });
        } else if (pendingSignupMethod === 'apple') {
            loginWithRedirect({
                authorizationParams: {
                    connection: 'apple',
                    screen_hint: 'signup',
                    redirect_uri: getAuth0RedirectUri(),
                },
            });
        } else {
            loginWithRedirect({
                authorizationParams: {
                    screen_hint: 'signup',
                    redirect_uri: getAuth0RedirectUri(),
                },
            });
        }
        setPendingSignupMethod(null);
    };

    const logbookSynced = new URLSearchParams(window.location.search).get('logbook') === 'synced';

    // ── While session rehydrates (skip wait if returning from logbook sync) ─
    if (isSetup && (isLoading || supabaseSessionLoading) && !authTimedOut && !logbookSynced) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #00b4d8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── Profile setup step (redirected here after Auth0 signup, Supabase OAuth, or logbook sync) ──
    if (isSetup && (isAuthenticated || !!supabaseUser || authTimedOut || (!isLoading && logbookSynced))) {
        return (
            <>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', position: 'relative' }}>

                {/* ── Shader background ── */}
                <div className="fixed inset-0 z-0">
                    {enableShader ? (
                        <MeshGradient
                            className="w-full h-full"
                            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                            speed={0.22}
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)' }} />
                    )}
                    {/* Frosted glass smoke-blur overlay */}
                    <div className="absolute inset-0" style={{ background: 'linear-gradient(to bottom, rgba(15,23,42,0.45) 0%, rgba(30,58,95,0.35) 50%, rgba(15,23,42,0.65) 100%)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }} />
                    {/* Vignette */}
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.55) 100%)' }} />
                </div>

                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 32px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
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
                <div style={{ flex: 1, overflowY: 'auto', padding: '48px 24px 64px', position: 'relative', zIndex: 10 }}>
                    <div style={{ width: '100%', maxWidth: '1100px', margin: '0 auto' }}>
                        {/* Header */}
                        <div style={{ marginBottom: '40px' }}>
                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#ef4444', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '8px' }}>Account Created</p>
                            <h2 style={{ fontSize: '32px', fontWeight: 700, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.2, margin: '0 0 8px 0' }}>Complete your pilot profile</h2>
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>4 steps — takes about 2 minutes</p>
                        </div>

                        <style>{`
                            @keyframes stepIn {
                                0%   { opacity: 0; transform: translateY(16px); }
                                100% { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes dotPulse {
                                0%, 100% { opacity: 1; }
                                50%       { opacity: 0.3; }
                            }
                            .step-card {
                                background: #ffffff;
                                border: 1px solid #e2e8f0;
                                border-radius: 16px;
                                padding: 28px 32px;
                                display: flex;
                                flex-direction: column;
                                gap: 16px;
                                position: relative;
                                animation: stepIn 0.35s cubic-bezier(0.16,1,0.3,1) forwards;
                            }
                            .step-card-active {
                                border-color: #dc2626;
                                box-shadow: 0 0 0 2px #dc2626, 0 8px 32px rgba(0,0,0,0.12);
                            }
                            .step-card-done {
                                background: #111827;
                                border-color: rgba(255,255,255,0.08);
                            }
                            .fic-title {
                                font-size: 22px;
                                font-weight: 700;
                                color: #0f172a;
                                letter-spacing: -0.02em;
                                line-height: 1.1;
                                margin: 0;
                            }
                            .fic-title-red { color: #dc2626 !important; }
                            .step-card-done .fic-title { color: #ffffff !important; }
                            .fic-input, .fic-select {
                                width: 100%;
                                background: #f8fafc;
                                border: 1px solid #e2e8f0;
                                border-radius: 10px;
                                padding: 11px 14px;
                                color: #0f172a;
                                font-size: 14px;
                                font-weight: 500;
                                outline: none;
                                transition: border-color 0.2s, box-shadow 0.2s;
                                box-sizing: border-box;
                            }
                            .fic-input:focus, .fic-select:focus {
                                border-color: #334155;
                                box-shadow: 0 0 0 3px rgba(51,65,85,0.08);
                                background: #ffffff;
                            }
                            .fic-input::placeholder { color: #94a3b8; }
                            .fic-subtext {
                                font-size: 12px;
                                color: #94a3b8;
                                letter-spacing: 0.01em;
                            }
                            .fic-status-dot {
                                position: absolute;
                                top: 18px;
                                right: 18px;
                                width: 8px;
                                height: 8px;
                                border-radius: 50%;
                                transition: background 0.4s, box-shadow 0.4s;
                            }
                            .fic-dot-idle   { background: #cbd5e1; }
                            .fic-dot-active { background: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.2); animation: dotPulse 1.4s ease-in-out infinite; }
                            .fic-dot-done   { background: #22c55e; box-shadow: 0 0 0 3px rgba(34,197,94,0.2); }
                            .fic-dot-warn   { background: #f59e0b; animation: dotPulse 0.85s ease-in-out infinite; }
                            .fic-dot-commit { background: #dc2626; box-shadow: 0 0 0 3px rgba(220,38,38,0.2); animation: dotPulse 1s ease-in-out infinite; }
                        `}</style>

                        {/* Progress strip */}
                        <div style={{ display: 'flex', gap: '6px', marginBottom: '32px' }}>
                            {[1,2,3,4].map(n => (
                                <div key={n} style={{ flex: 1, height: '3px', borderRadius: '9999px', background: activeInstrument > n ? '#22c55e' : activeInstrument === n ? '#dc2626' : 'rgba(255,255,255,0.1)', transition: 'background 0.4s' }} />
                            ))}
                        </div>

                        {/* Steps — vertical flow */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                            {/* ── STEP 1: Identity ── */}
                            {activeInstrument === 1 && (<>
                            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                            <div className="step-card step-card-active" style={{ flex: 1 }}>
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
                                    onClick={() => { if (firstName.trim().length >= 1 && lastName.trim().length >= 1 && displayName.trim().length >= 2 && dob && nationality) { setActiveInstrument(i => Math.max(i, 2)); savePartialProfile({ display_name: displayName.trim(), full_name: `${firstName.trim()} ${lastName.trim()}`.trim(), date_of_birth: dob || null, nationality: nationality || null }); } }}
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
                            {/* Step 1 right-side text */}
                            <div style={{ width: '260px', flexShrink: 0, paddingTop: '8px' }}>
                                <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>Step 1 of 6</p>
                                <p style={{ fontSize: '34px', fontWeight: 400, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 14px 0' }}>
                                    Your first step to getting{' '}
                                    <span style={{ color: '#ef4444', fontWeight: 700 }}>free recognition</span>
                                </p>
                                <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 16px 0' }}>
                                    Enter your name and callsign to begin.
                                </p>
                                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '12px 14px' }}>
                                    <p style={{ fontSize: '10px', fontWeight: 800, color: '#ef4444', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 5px 0' }}>⬆ Recognition+</p>
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, margin: 0 }}>
                                        Upgrade to <strong style={{ color: 'rgba(255,255,255,0.8)' }}>Recognition+</strong> for a detailed profile build — document uploads, license verification, medical status, and full credential issuance for airline visibility.
                                    </p>
                                </div>
                            </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button type="button" disabled style={{ flex: 1, background: 'rgba(255,255,255,0.03)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '10px 0', cursor: 'not-allowed', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.2)', letterSpacing: '0.02em' }}>← Back</button>
                                <button type="button" onClick={() => setActiveInstrument(i => Math.max(i, 2))} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>Next →</button>
                            </div>
                            </>)}{/* end step-1 */}

                            {/* ── STEP 2: Classification ── */}
                            {activeInstrument === 2 && (<>
                            <div style={{ display: 'flex', gap: '40px', alignItems: 'flex-start' }}>
                            <div className="step-card step-card-active" style={{ flex: 1, minWidth: '480px' }}>
                                <span className={`fic-status-dot ${activeInstrument > 2 ? 'fic-dot-done' : activeInstrument === 2 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div className="fic-title">ATC: Identify Yourself</div>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    {/* ── LICENCE DETAILS ── */}
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>Licence Details</div>
                                    {/* Pilot licence */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Current Pilot Licence</div>
                                        <select
                                            className="fic-select"
                                            value={occupation}
                                            onChange={e => setOccupation(e.target.value)}
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
                                    {/* Pilot licence upload slot */}
                                    <LockedUpload label="Upload Pilot Licence" />
                                    {/* Issuing Authority */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Issuing Authority / State of Issue</div>
                                        <select
                                            className="fic-select"
                                            value={issuingAuthority}
                                            onChange={e => setIssuingAuthority(e.target.value)}
                                            disabled={activeInstrument < 2}
                                            style={{ colorScheme: 'light' }}
                                        >
                                            <option value="" disabled>Select issuing authority...</option>
                                            {['CAAP (Philippines)', 'FAA (USA)', 'EASA (Europe)', 'GCAA (UAE)', 'CASA (Australia)', 'CAA (UK)', 'DGCA (India)', 'TCCA (Canada)', 'SACAA (South Africa)', 'JCAB (Japan)', 'CAAS (Singapore)', 'CAAT (Thailand)', 'DGAC (France)', 'LBA (Germany)', 'ENAC (Italy)', 'Other'].map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        {/* Medical certificate upload slot */}
                                        <div style={{ marginTop: '6px' }}><LockedUpload label="Upload Medical Certificate" /></div>
                                    </div>
                                    {/* ── AIRCRAFT & PRIVILEGES — progressive disclosure ── */}
                                    {occupation && issuingAuthority && (
                                        <>
                                        <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9', marginTop: '4px' }}>Aircraft &amp; Privileges</div>

                                        {/* Aircraft Class / Type — always visible */}
                                        {(() => {
                                            const PRIMARY = ['Single Engine Land (SEL)', 'Multi-Engine Land (MEL)', 'Rotorcraft — Helicopter', 'Multi-Engine Sea (MES)'];
                                            const EXTENDED = ['Single Engine Sea (SES)', 'Rotorcraft — Gyroplane', 'Glider', 'Powered Lift', 'Light Sport (LSA)', 'eVTOL / Powered Lift', 'Lighter-Than-Air', 'UAS / Drone', 'Turboprop', 'Experimental / Homebuilt'];
                                            const visible = showMoreClasses ? [...PRIMARY, ...EXTENDED] : PRIMARY;
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aircraft Class / Type <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(select all that apply)</span></div>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        {(occupation === 'Student Pilot' || occupation === 'Cadet') && (() => {
                                                            const isNone = aircraftTypes.includes('__none__');
                                                            return (
                                                                <button key="none" type="button"
                                                                    onClick={() => setAircraftTypes(isNone ? [] : ['__none__'])}
                                                                    style={{ padding: '5px 12px', background: isNone ? '#64748b' : '#f8fafc', border: `1px solid ${isNone ? '#64748b' : '#e2e8f0'}`, borderRadius: '20px', color: isNone ? '#fff' : '#64748b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    None required{isNone && <span style={{ opacity: 0.55 }}>×</span>}
                                                                </button>
                                                            );
                                                        })()}
                                                        {!aircraftTypes.includes('__none__') && visible.map(cls => {
                                                            const isSel = aircraftTypes.includes(cls);
                                                            return (
                                                                <button key={cls} type="button"
                                                                    onClick={() => setAircraftTypes(prev => isSel ? prev.filter(t => t !== cls) : [...prev, cls])}
                                                                    style={{ padding: '5px 12px', background: isSel ? '#0f172a' : '#f8fafc', border: `1px solid ${isSel ? '#0f172a' : '#e2e8f0'}`, borderRadius: '20px', color: isSel ? '#fff' : '#475569', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    {cls}{isSel && <span style={{ opacity: 0.5, marginLeft: '2px' }}>×</span>}
                                                                </button>
                                                            );
                                                        })}
                                                        {!aircraftTypes.includes('__none__') && (
                                                            <button type="button" onClick={() => setShowMoreClasses(p => !p)}
                                                                style={{ padding: '5px 12px', background: 'transparent', border: '1px dashed #cbd5e1', borderRadius: '20px', color: '#94a3b8', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}>
                                                                {showMoreClasses ? '↑ Less' : `+ ${EXTENDED.length} more`}
                                                            </button>
                                                        )}
                                                    </div>
                                                </div>
                                            );
                                        })()}

                                        {/* Operational Ratings — always visible, expanded list */}
                                        {(() => {
                                            const OPS_RATINGS = [
                                                'Instrument Rating (IR)', 'Night Rating', 'Multi-Engine Rating (ME)',
                                                'Seaplane Rating', 'Aerobatic Rating', 'Mountain Rating',
                                                'Flight Instructor (CFI)', 'Check Airman', 'ATPL Frozen',
                                                'EBT Qualified', 'Type Rating Instructor (TRI)', 'Type Rating Examiner (TRE)',
                                            ];
                                            const hasRatings = ratings.filter(r => r !== '__none__').length > 0;
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Operational Ratings <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(select all that apply)</span></div>
                                                        {hasRatings && <span style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700 }}>{ratings.filter(r => r !== '__none__').length} selected</span>}
                                                    </div>
                                                    <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                        {(occupation === 'Student Pilot' || occupation === 'Cadet') && (() => {
                                                            const isNone = ratings.includes('__none__');
                                                            return (
                                                                <button key="none" type="button"
                                                                    onClick={() => setRatings(isNone ? [] : ['__none__'])}
                                                                    style={{ padding: '5px 12px', background: isNone ? '#64748b' : '#f8fafc', border: `1px solid ${isNone ? '#64748b' : '#e2e8f0'}`, borderRadius: '20px', color: isNone ? '#fff' : '#64748b', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    None required{isNone && <span style={{ opacity: 0.55 }}>×</span>}
                                                                </button>
                                                            );
                                                        })()}
                                                        {!ratings.includes('__none__') && OPS_RATINGS.map(rating => {
                                                            const isSel = ratings.includes(rating);
                                                            return (
                                                                <button key={rating} type="button"
                                                                    onClick={() => setRatings(prev => isSel ? prev.filter(r => r !== rating) : [...prev, rating])}
                                                                    style={{ padding: '5px 12px', background: isSel ? '#dc2626' : '#f8fafc', border: `1px solid ${isSel ? '#dc2626' : '#e2e8f0'}`, borderRadius: '20px', color: isSel ? '#fff' : '#475569', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.15s', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                                                    {rating}{isSel && <span style={{ opacity: 0.5, marginLeft: '2px' }}>×</span>}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        {/* Type Ratings — conditional for CPL/ATPL, inside progressive disclosure */}
                                        {['Commercial Pilot (CPL)', 'Airline Pilot (ATPL)', 'First Officer', 'Captain', 'Flight Instructor (CFI)'].includes(occupation) && (
                                        <div>
                                            <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                                Type Ratings Held <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span>
                                            </div>
                                            {/* Popular type quick-select */}
                                            <div style={{ display: 'flex', gap: '5px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                                {['A320', 'B737', 'A350', 'B777', 'ATR72', 'E190', 'B787', 'A330', 'DHC-8', 'CRJ900'].map(t => {
                                                    const isSel = typeRatings.includes(t);
                                                    return (
                                                        <button key={t} type="button"
                                                            onClick={() => { if (!isSel) { setTypeRatings(prev => [...prev, t]); } else { setTypeRatings(prev => prev.filter(r => r !== t)); } }}
                                                            style={{ padding: '4px 10px', background: isSel ? '#0f172a' : '#f1f5f9', border: `1px solid ${isSel ? '#0f172a' : '#e2e8f0'}`, borderRadius: '6px', color: isSel ? '#fff' : '#64748b', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', letterSpacing: '0.02em' }}>
                                                            {t}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                            {typeRatings.length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                    {typeRatings.map(tr => (
                                                        <span key={tr} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#0f172a', color: '#fff', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                                                            {tr}
                                                            <button type="button" onClick={() => setTypeRatings(prev => prev.filter(r => r !== tr))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0', fontSize: '12px', lineHeight: 1 }}>×</button>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}
                                            <div style={{ display: 'flex', gap: '6px' }}>
                                                <input
                                                    className="fic-input"
                                                    type="text"
                                                    value={typeRatingInput}
                                                    onChange={e => setTypeRatingInput(e.target.value)}
                                                    onKeyDown={e => {
                                                        if ((e.key === 'Enter' || e.key === ',') && typeRatingInput.trim()) {
                                                            e.preventDefault();
                                                            const val = typeRatingInput.trim().toUpperCase();
                                                            if (!typeRatings.includes(val)) setTypeRatings(prev => [...prev, val]);
                                                            setTypeRatingInput('');
                                                        }
                                                    }}
                                                    placeholder="e.g. A320, B737, ATR72 — press Enter"
                                                    disabled={activeInstrument < 2}
                                                    style={{ flex: 1 }}
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        const val = typeRatingInput.trim().toUpperCase();
                                                        if (val && !typeRatings.includes(val)) { setTypeRatings(prev => [...prev, val]); setTypeRatingInput(''); }
                                                    }}
                                                    disabled={!typeRatingInput.trim()}
                                                    style={{ padding: '8px 12px', background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: typeRatingInput.trim() ? 'pointer' : 'not-allowed', opacity: typeRatingInput.trim() ? 1 : 0.4 }}
                                                >+ Add</button>
                                            </div>
                                        </div>
                                    )}
                                        </>
                                    )}
                                </div>
                                {/* ELP Level */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>English Language Proficiency <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                    <select
                                        value={elpLevel}
                                        onChange={e => setElpLevel(e.target.value)}
                                        style={{ width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '13px', color: elpLevel ? '#0f172a' : '#94a3b8', background: '#fff', appearance: 'auto' }}
                                    >
                                        <option value="">Select ICAO ELP level...</option>
                                        <option value="ELP Level 3">Level 3 — Pre-operational (minimum passing; limited phraseology, restricted ops)</option>
                                        <option value="ELP Level 4">Level 4 — Operational (ICAO standard; required for international flight ops)</option>
                                        <option value="ELP Level 5">Level 5 — Extended (above standard; handles complex ATC exchanges, non-routine)</option>
                                        <option value="ELP Level 6">Level 6 — Expert (native/near-native; no retest required, lifetime validity)</option>
                                    </select>
                                </div>
                                {/* ELP upload slot — Radio/NTC licence */}
                                <LockedUpload label="Upload Radio / NTC Licence" />
                                {/* Single eligibility notice */}
                                <div style={{ padding: '10px 12px', background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Unlock document verification with <span style={{ color: '#ef4444' }}>Recognition+</span></p>
                                    <p style={{ fontSize: '10px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                                        Complete your free profile first — then upgrade to <strong style={{ color: '#0f172a' }}>Recognition+</strong> to upload your licence documents for verification. Operators and airlines will see a <strong style={{ color: '#16a34a' }}>✓ Verified</strong> badge on your profile, confirming your credentials are current and authentic.
                                    </p>
                                </div>
                                {/* Confirm button */}
                                {(() => {
                                    const ok = !!occupation && !!issuingAuthority;
                                    return (
                                        <button
                                            type="button"
                                            onClick={() => { if (ok) { setActiveInstrument(i => Math.max(i, 3)); const cleanRatings = ratings.filter(r => r !== '__none__'); savePartialProfile({ current_occupation: occupation, license_issuing_authority: issuingAuthority || null, country_of_license: issuingAuthority || null, license_types: typeRatings.length > 0 ? typeRatings : (occupation ? [occupation] : null), aircraft_types: aircraftTypes.length > 0 ? aircraftTypes : null, ratings: cleanRatings.length > 0 ? cleanRatings : null, elp_level: elpLevel || null }); } }}
                                            disabled={!ok}
                                            style={{
                                                width: '100%', padding: '11px 16px',
                                                background: ok ? '#0f172a' : '#f1f5f9',
                                                border: 'none', borderRadius: '8px',
                                                color: ok ? '#ffffff' : '#94a3b8',
                                                fontSize: '14px', fontWeight: 600,
                                                cursor: ok ? 'pointer' : 'not-allowed',
                                                transition: 'all 0.2s',
                                            }}
                                            onMouseEnter={e => { if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#1e293b'; }}
                                            onMouseLeave={e => { if (ok) (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
                                        >
                                            {activeInstrument > 2 ? '✓ Classification Confirmed' : 'Confirm Classification →'}
                                        </button>
                                    );
                                })()}
                                {/* Security stamp */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px', padding: '8px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                    <span style={{ fontSize: '12px', flexShrink: 0 }}>🔒</span>
                                    <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Licence tier and operational capabilities are <strong>client-side encrypted</strong> before cloud routing under <a href="/data-controller-agreement#article-2" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Article 2</a>.</span>
                                </div>
                                <button type="button" onClick={() => setActiveInstrument(1)} style={{ alignSelf: 'flex-start', background: 'rgba(255,255,255,0.07)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.13)', borderRadius: '8px', padding: '6px 14px', cursor: 'pointer', fontSize: '12px', fontWeight: 500, color: 'rgba(255,255,255,0.55)', letterSpacing: '0.02em', transition: 'background 0.2s, color 0.2s' }}>← Back</button>
                            </div>
                            {/* Step 2 right-side text */}
                            {activeInstrument === 2 && (
                                <div style={{ width: '260px', flexShrink: 0, paddingTop: '8px' }}>
                                    <p style={{ fontSize: '11px', fontWeight: 700, color: 'rgba(255,255,255,0.4)', letterSpacing: '0.18em', textTransform: 'uppercase', margin: '0 0 16px 0' }}>ATC Calling…</p>
                                    <p style={{ fontSize: '30px', fontWeight: 400, color: 'rgba(255,255,255,0.95)', lineHeight: 1.2, letterSpacing: '-0.02em', margin: '0 0 14px 0' }}>
                                        Identify yourself,{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>pilot</span>
                                        {' '}— and your{' '}
                                        <span style={{ color: '#ef4444', fontWeight: 700 }}>aircraft</span>
                                    </p>
                                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, margin: '0 0 16px 0' }}>
                                        State your licence, issuing authority, and aircraft category. Squawk ident to unlock your pathway access level.
                                    </p>
                                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '10px 12px', background: 'rgba(22,163,74,0.08)', border: '1px solid rgba(22,163,74,0.25)', borderRadius: '10px', marginBottom: '16px' }}>
                                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: '1px' }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.6 }}>
                                            All uploaded documents are stored in <strong style={{ color: 'rgba(255,255,255,0.8)' }}>end-to-end encrypted storage</strong>, provisioned exclusively through your <strong style={{ color: '#ef4444' }}>Recognition+</strong> subscription. Your files are never shared without your explicit consent.
                                        </p>
                                    </div>
                                    {occupation && (() => {
                                        const msg: Record<string, { headline: string; sub: string }> = {
                                            'Student Pilot':              { headline: 'Able to submit interest to cadet & flight school pathways.', sub: 'Aimed towards active students and enrolled trainees building their first 50 hours.' },
                                            'Cadet':                      { headline: 'Able to submit interest to ab-initio and cadet programme pathways.', sub: 'Aimed towards cadets currently within a structured ab-initio programme.' },
                                            'Private Pilot (PPL)':        { headline: 'Able to submit interest to regional operator and PPL-aimed pathways.', sub: 'Aimed towards PPL holders building hours towards CPL conversion or recreational endorsements.' },
                                            'Commercial Pilot (CPL)':     { headline: 'Able to submit interest to all airline, cargo, and operator gates.', sub: 'Aimed towards CPL holders actively seeking first-officer or type-rating opportunities.' },
                                            'Airline Transport (ATPL)':   { headline: 'Able to submit interest to all airline captain and senior operator pathways.', sub: 'Aimed towards ATPL holders pursuing command upgrades or international transitions.' },
                                            'Flight Instructor (CFI/FI)': { headline: 'Able to submit interest to ATO instructor and check-airman pathways.', sub: 'Aimed towards certified instructors seeking ATO, simulator, or senior examiner roles.' },
                                        };
                                        const m = msg[occupation];
                                        if (!m) return null;
                                        return (
                                            <>
                                                <p style={{ fontSize: '14px', fontWeight: 700, color: '#ef4444', lineHeight: 1.4, margin: '0 0 8px 0' }}>{m.headline}</p>
                                                <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6, margin: 0 }}>{m.sub}</p>
                                            </>
                                        );
                                    })()}
                                </div>
                            )}
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setActiveInstrument(1)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>← Back</button>
                                <button type="button" onClick={() => setActiveInstrument(i => Math.max(i, 3))} style={{ flex: 1, background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>Next →</button>
                            </div>
                            </>)}{/* end step-2 row */}

                            {/* ── STEP 3: Flight Hours & Logbook ── */}
                            {activeInstrument === 3 && (<>
                            <div className="step-card step-card-active">
                                <span className={`fic-status-dot ${activeInstrument > 3 ? 'fic-dot-done' : activeInstrument === 3 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div className="fic-title">Flight Hours &amp; Logbook</div>
                                <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '2px' }}>Estimated Total Flight Hours <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none', fontSize: '10px' }}>(optional — you can skip)</span></div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input className="fic-input" type="number" min="0" max="99999" value={hoursWhole} onChange={e => setHoursWhole(e.target.value)} placeholder="250" disabled={activeInstrument < 3} />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>HRS</span>
                                    <input className="fic-input" type="number" min="0" max="59" value={hoursMinutes} onChange={e => setHoursMinutes(e.target.value)} placeholder="00" disabled={activeInstrument < 3} style={{ maxWidth: '70px', textAlign: 'center' }} />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>MIN</span>
                                </div>
                                {/* Claim disclaimer */}
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '8px 10px', display: 'flex', gap: '7px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '13px', flexShrink: 0 }}>⚠️</span>
                                    <span style={{ fontSize: '11px', color: '#92400e', lineHeight: 1.5 }}>
                                        Total hours entered here are a <strong>self-declared claim</strong> and are not verified. Hours will remain unverified until audit under <strong>Recognition+</strong>.
                                    </span>
                                </div>
                                {/* Logbook provider — inline */}
                                <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Logbook Provider <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                    <p style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.55, margin: 0 }}>
                                        Optionally connect your digital logbook to sync hours automatically.
                                    </p>
                                    <button
                                        type="button"
                                        onClick={() => setShowLogbookModal(true)}
                                        disabled={activeInstrument < 3}
                                        style={{ width: '100%', padding: '9px 8px', background: providerConnected ? '#f0fdf4' : '#f8fafc', border: `1px solid ${providerConnected ? '#86efac' : '#cbd5e1'}`, borderRadius: '8px', color: providerConnected ? '#16a34a' : '#475569', fontSize: '12px', fontWeight: 600, cursor: activeInstrument < 3 ? 'not-allowed' : 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                                        {providerConnected ? '✓ Logbook Connected' : 'Connect Digital Logbook'}
                                    </button>
                                    {/* Confirm — hours are optional, user can skip */}
                                    {(() => {
                                        const hasHours = !!hoursWhole && parseFloat(hoursWhole) > 0;
                                        return (
                                            <button
                                                type="button"
                                                onClick={() => setActiveInstrument(i => Math.max(i, 4))}
                                                style={{ width: '100%', padding: '10px', background: '#0f172a', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '13px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', marginTop: '4px' }}>
                                                {hasHours ? 'Confirm Flight Hours →' : 'Skip for Now →'}
                                            </button>
                                        );
                                    })()}
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setActiveInstrument(2)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>← Back</button>
                                {(() => {
                                    const ok = (selectedProvider !== null || providerConnected);
                                    return (
                                        <button type="button" onClick={() => { if (ok) setActiveInstrument(i => Math.max(i, 4)); }} style={{ flex: 1, background: ok ? 'rgba(255,255,255,0.12)' : 'rgba(255,255,255,0.04)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: `1px solid ${ok ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.07)'}`, borderRadius: '10px', padding: '10px 0', cursor: ok ? 'pointer' : 'not-allowed', fontSize: '13px', fontWeight: 500, color: ok ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>Next →</button>
                                    );
                                })()}
                            </div>
                            </>)}{/* end step-3 */}

                            {/* ── STEP 4: Your PIC ── */}
                            {activeInstrument === 4 && (<>
                            <div className="step-card step-card-active">
                                <span className={`fic-status-dot ${walletConnected ? 'fic-dot-done' : activeInstrument === 4 ? 'fic-dot-active' : 'fic-dot-idle'}`} />
                                <div className="fic-title">Your PIC</div>
                                <div style={{ fontSize: '12px', color: '#64748b', lineHeight: 1.6, marginBottom: '14px' }}>
                                    We automatically create a secure digital ID for you — like a passport that lives inside your profile. It holds your verified credentials and lets airlines confirm your qualifications instantly, with no paperwork.
                                </div>

                                {/* Passkey warning */}
                                <div style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.35)', borderRadius: '10px', padding: '12px 14px', marginBottom: '14px' }}>
                                    <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>🔐</span>
                                        <div>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#ef4444', margin: '0 0 4px' }}>Your browser will prompt you to save a passkey</p>
                                            <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.55)', margin: 0, lineHeight: 1.5 }}>
                                                Without this key you will lose access to your PIC and be unable to retrieve your data. Save it to Touch ID, Face ID, or Google Password Manager when prompted.
                                            </p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                        <img
                                            src="/PASS.png"
                                            alt="Safari passkey prompt"
                                            style={{ width: '50%', maxWidth: '220px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                                        />
                                        <img
                                            src="/CHROME.png"
                                            alt="Chrome passkey prompt"
                                            style={{ width: '50%', maxWidth: '220px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }}
                                        />
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    disabled={activeInstrument < 4 || walletCreating === 'generating' || walletCreating === 'syncing'}
                                    onClick={async () => {
                                        if (walletConnected && !showPasskeyCancelled) { onNavigate('platform'); return; }
                                        // Resolve auth0Id — try Auth0 hook, then Supabase session sub, then sessionStorage
                                        let auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id') || null;
                                        if (!auth0Id) {
                                            const { data: { session } } = await supabase.auth.getSession();
                                            auth0Id = (session?.user?.user_metadata?.sub as string) || session?.user?.id || null;
                                        }
                                        const cleanFirst = firstName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
                                        const cleanLast = lastName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
                                        const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
                                        const hrs = parseFloat(hoursWhole) + (parseFloat(hoursMinutes || '0') / 60);
                                        try {
                                            setWalletCreating('generating');
                                            await new Promise(r => setTimeout(r, 900));
                                            setWalletCreating('syncing');
                                            setSaving(true);

                                            if (!auth0Id) {
                                                console.error('[DEBUG][Wallet] ❌ auth0Id is null — cannot create wallet');
                                                setSaveError('Authentication error. Please sign in again.');
                                                setWalletCreating('idle');
                                                setSaving(false);
                                                return;
                                            }

                                            const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string;
                                            const ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY as string;

                                            // Time-bound token: base64(auth0Id + ':ts:' + timestamp) — verified server-side within 5-min window
                                            const requestToken = btoa(`${auth0Id}:ts:${Date.now()}`);

                                            // Encrypt sensitive fields client-side before sending to edge function
                                            // Edge function stores only ciphertext — unreadable server-side
                                            let encryptedPayload: Record<string, any> = {
                                                displayName: cleanName,
                                                firstName: cleanFirst,
                                                lastName: cleanLast,
                                                occupation,
                                                dob: dob || null,
                                            };
                                            try {
                                                const claims = await getIdTokenClaims?.();
                                                const idToken = claims?.__raw;
                                                if (idToken) {
                                                    const vaultKey = await getVaultKeyFromAuth0Token(auth0Id, idToken);
                                                    encryptedPayload = await encryptFields(
                                                        encryptedPayload,
                                                        ['firstName', 'lastName'],
                                                        vaultKey
                                                    );
                                                } else {
                                                    console.warn('[DEBUG][Wallet] ⚠️ No idToken — skipping vault encryption');
                                                }
                                            } catch (vaultErr) {
                                                console.warn('[vault] Encryption unavailable, proceeding with plaintext:', vaultErr);
                                            }

                                            // Edge function handles upsert — creates profile if missing, updates if exists
                                            const res = await fetch(`${SUPABASE_URL}/functions/v1/create-wallet`, {
                                                method: 'POST',
                                                headers: { 'Content-Type': 'application/json', 'apikey': ANON_KEY },
                                                body: JSON.stringify({
                                                    auth0Id,
                                                    email: user?.email || '',
                                                    ...encryptedPayload,
                                                    totalHours: hrs,
                                                    aircraftTypes,
                                                    issuingAuthority: issuingAuthority || null,
                                                    licenseTypes: typeRatings.length > 0 ? typeRatings : (occupation ? [occupation] : null),
                                                    ratings: ratings.filter(r => r !== '__none__').length > 0 ? ratings.filter(r => r !== '__none__') : null,
                                                    elpLevel: elpLevel || null,
                                                    storageBackend: walletStorageChoice || 'supabase',
                                                    requestToken,
                                                }),
                                            });
                                            const walletData = await res.json();
                                            if (!res.ok || !walletData.success) {
                                                console.error('[DEBUG][Wallet] ❌ create-wallet failed:', walletData);
                                                throw new Error(walletData.error || 'Wallet creation failed');
                                            }
                                            sessionStorage.setItem('wallet_did', walletData.did || '');
                                            sessionStorage.setItem('wallet_claimed_provider', 'PilotRecognition Wallet');

                                            setWalletCreating('active');
                                            setSelectedWallet('Pilot Wallet');
                                            setWalletConnected(true);
                                            setSaving(false);
                                            // Stash context for passkey modal — must be triggered by direct user click
                                            const { data: { session: pkSess } } = await supabase.auth.getSession();
                                            const pkCtxId = pkSess?.user?.id || user?.sub || sessionStorage.getItem('mfb_auth0_id') || 'pilot-user';
                                            const pkCtxEmail = pkSess?.user?.email || user?.email || pkCtxId;
                                            const pkCtxName = displayName.trim().slice(0, 80) || pkCtxEmail;
                                            setPasskeyContext({ userId: pkCtxId, email: pkCtxEmail, name: pkCtxName });
                                            setShowBiometricNotice(true);
                                        } catch (e) {
                                            console.error('Wallet creation error:', e);
                                            setWalletCreating('idle');
                                            setSaving(false);
                                            setSaveError('Failed to create PIC. Please try again.');
                                        }
                                    }}
                                    style={{
                                        width: '100%', padding: '14px 16px', borderRadius: '10px',
                                        fontSize: '14px', fontWeight: 600, cursor: walletCreating === 'generating' || walletCreating === 'syncing' ? 'wait' : 'pointer',
                                        textAlign: 'left', transition: 'all 0.3s',
                                        background: walletCreating === 'active' || walletConnected ? '#f0fdf4' : walletCreating === 'generating' ? '#eff6ff' : walletCreating === 'syncing' ? '#f0f9ff' : '#f8fafc',
                                        border: `1px solid ${walletCreating === 'active' || walletConnected ? '#86efac' : walletCreating === 'generating' ? '#bfdbfe' : walletCreating === 'syncing' ? '#bae6fd' : '#e2e8f0'}`,
                                        color: walletCreating === 'active' || walletConnected ? '#16a34a' : walletCreating === 'generating' ? '#1d4ed8' : walletCreating === 'syncing' ? '#0369a1' : '#475569',
                                    }}
                                >
                                    {walletCreating === 'generating' && '⏳ Generating Secure Keys...'}
                                    {walletCreating === 'syncing' && '🔄 Registering Account & Issuing Credential...'}
                                    {(walletCreating === 'active' || walletConnected) && '🎉 PIC Active — Redirecting to Dashboard...'}
                                    {walletCreating === 'idle' && '🔐 Create PIC & Enter Platform →'}
                                </button>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginTop: '8px' }}>
                                    <span style={{ fontSize: '10px', color: '#94a3b8' }}>Decentralised identity</span>
                                    <span style={{ fontSize: '10px', color: '#cbd5e1' }}>·</span>
                                    <span style={{ fontSize: '10px', color: '#00b4d8', fontWeight: 600 }}>PilotRecognition PIC</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: '10px', marginTop: '12px' }}>
                                <button type="button" onClick={() => setActiveInstrument(3)} style={{ flex: 1, background: 'rgba(255,255,255,0.06)', backdropFilter: 'blur(10px)', WebkitBackdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '10px', padding: '10px 0', cursor: 'pointer', fontSize: '13px', fontWeight: 500, color: 'rgba(255,255,255,0.5)', letterSpacing: '0.02em', transition: 'background 0.2s' }}>← Back</button>
                            </div>
                            </>)}

                            {saveError && <p style={{ color: '#dc2626', fontSize: '11px', margin: '8px 0 0', textAlign: 'center' }}>{saveError}</p>}

                        </div>{/* end steps column */}

                        {/* Footer */}
                        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Secure Connection</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                <span style={{ color: '#7dd3fc', fontSize: '11px', fontWeight: 600 }}>Powered by Auth0</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>PIC by PilotRecognition</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px' }}>
                                <button onClick={() => onNavigate('privacy-policy')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Privacy Policy</button>
                                <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '10px' }}>·</span>
                                <button onClick={() => onNavigate('terms-of-service')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Terms of Service</button>
                                <span style={{ color: 'rgba(255,255,255,0.1)', fontSize: '10px' }}>·</span>
                                <button onClick={() => onNavigate('data-controller-agreement')} style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}>Data Controller Agreement — PR-DCA-001</button>
                            </div>
                        </div>

                    </div>
                </div>{/* end scroll area */}
            </div>{/* end page */}

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
                                    safeRedirect(url);
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
                                <h3 className="text-white font-black text-base">Connect Your PIC</h3>
                                <p className="text-white/40 text-xs mt-0.5">Select your Pilot Identity Credentials provider</p>
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
                                            
                                            // For Pilot Wallet, issue + store in Supabase (hashed) — no external redirect
                                            if (w.id === 'pilot') {
                                                const auth0Id = user?.sub || sessionStorage.getItem('mfb_auth0_id');
                                                const hrs = parseFloat(hoursWhole) + (parseFloat(hoursMinutes || '0') / 60);
                                                if (auth0Id && hrs > 0) {
                                                    const { data: profile } = await supabase
                                                        .from('profiles')
                                                        .select('id')
                                                        .eq('auth0_id', auth0Id)
                                                        .maybeSingle();
                                                    const result = await issueAndStoreCredential(
                                                        auth0Id,
                                                        profile?.id || auth0Id,
                                                        hrs,
                                                        walletStorageChoice as 'supabase' | 'firebase' | 'both'
                                                    );
                                                    if (result.success) {
                                                        sessionStorage.setItem('vc_credential_hash', result.credential!.credentialHash);
                                                    }
                                                }
                                                setWalletConnected(true);
                                                return;
                                            }
                                            
                                            // For other wallets or fallback, open directly
                                            setWalletConnected(true);
                                            const walletUrl = 
                                                w.id === 'talao' ? 'https://app.talao.co/wallet' :
                                                w.id === 'lissi' ? 'https://lissi.id/wallet' :
                                                w.id === 'dock' ? 'https://certs.dock.io/wallet' : '#';
                                            
                                            window.open(walletUrl, '_blank', 'noopener,noreferrer');
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
                    <button
                        onClick={() => safeRedirect('/')}
                        aria-label="Go back to Home"
                        className="absolute top-4 left-4 z-[400] px-4 py-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20 text-white font-semibold shadow-sm hover:bg-white/20 transition-all flex items-center gap-2"
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                            <path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <span>Go back to Home</span>
                    </button>
                </div>

                <div className="relative z-10 flex-1 flex items-start justify-center px-6 md:px-12 lg:px-16 py-8 overflow-hidden">
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-start gap-8 md:gap-16">

                        {/* Left: Hero text */}
                        <div className="flex-1 text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-3 text-white">
                                Connecting Pilots<br />
                                <span className="text-red-500">to the Industry.</span>
                            </h1>
                            <p className="text-slate-300 text-sm mb-8">Free access to Programs, Pathways &amp; Pilot Recognition</p>

                            {/* Recognition+ upsell */}
                            <div className="border border-white/20 bg-white/5 rounded-xl p-5 max-w-lg">
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

                            {/* Consent checkbox */}
                            <label className="flex items-start gap-3 mb-4 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consentChecked}
                                    onChange={e => setConsentChecked(e.target.checked)}
                                    className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0 cursor-pointer"
                                />
                                <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                                    I am 16 or older and I agree to the{' '}
                                    <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-white underline">Terms of Service</a>,{' '}
                                    <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white underline">Privacy Policy</a>, and{' '}
                                    <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-white underline">Data Controller Agreement</a>.
                                </span>
                            </label>

                            {/* Google signup */}
                            <button
                                onClick={handleGoogleSignup}
                                disabled={!consentChecked}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-3 shadow-sm"
                            >
                                <GoogleIcon />
                                Sign up with Google
                            </button>

                            {/* Apple signup - DISABLED: Requires Apple Developer Program ($99/year) */}
                            {/* <button
                                onClick={handleAppleSignup}
                                disabled={!consentChecked}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-black hover:bg-slate-900 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-xl transition-all duration-200 mb-4 shadow-sm border border-white/10"
                            >
                                <AppleIcon />
                                Sign up with Apple
                            </button> */}

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
                                disabled={!consentChecked}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-blue-600/20"
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
                        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                            Your data is encrypted on your device before it reaches us. We cannot read, modify, or monetize your personal information.
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
                                        setSelectedWallet('pilot');
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

            {/* Biometric / Passkey Notice Modal */}
            {showBiometricNotice && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(6px)' }}>
                    <div style={{ width: '100%', maxWidth: '400px', background: '#fff', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 25px 60px rgba(0,0,0,0.4)' }}>
                        <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                            <span style={{ fontSize: '36px' }}>🔑</span>
                        </div>
                        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0f172a', textAlign: 'center', margin: '0 0 10px' }}>Your browser will ask to save a Passkey</h3>
                        <p style={{ fontSize: '12px', color: '#475569', lineHeight: 1.6, margin: '0 0 14px' }}>
                            A <strong>passkey</strong> uses your device's biometrics (Touch ID, Face ID, or Windows Hello) or your password manager (Google, iCloud Keychain) to securely identify you. <strong>No biometric data leaves your device.</strong>
                        </p>
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', padding: '12px', marginBottom: '18px' }}>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                                By clicking <strong>"Got it — Continue"</strong> you consent to your browser storing a passkey credential on this device. This is used solely to authenticate you to your PilotRecognition wallet.
                            </p>
                        </div>
                        <button
                            onClick={async () => {
                                setShowBiometricNotice(false);
                                const isLocalhost = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
                                if (window.PublicKeyCredential && (window.isSecureContext || isLocalhost)) {
                                    try {
                                        const pkUserId = passkeyContext?.userId || 'pilot-user';
                                        const pkEmail = passkeyContext?.email || pkUserId;
                                        const pkDisplay = passkeyContext?.name || pkEmail;
                                        const rpId = isLocalhost ? 'localhost' : window.location.hostname.replace('www.', '');
                                        const cb = new Uint8Array(32);
                                        crypto.getRandomValues(cb);
                                        const result = await navigator.credentials.create({
                                            publicKey: {
                                                challenge: cb.buffer,
                                                rp: { name: 'PilotRecognition', id: rpId },
                                                user: { id: new TextEncoder().encode(pkUserId).buffer, name: pkEmail, displayName: pkDisplay },
                                                pubKeyCredParams: [{ type: 'public-key', alg: -7 }, { type: 'public-key', alg: -257 }],
                                                authenticatorSelection: { userVerification: 'required', residentKey: 'required' },
                                                timeout: 60000,
                                            },
                                        }) as PublicKeyCredential | null;
                                        if (result) {
                                            localStorage.setItem('pr_passkey_registered', 'true');
                                            localStorage.setItem('pr_passkey_credential_id', result.id);
                                            const attestation = result.response as AuthenticatorAttestationResponse;
                                            const pubKeyBuf = attestation.getPublicKey?.();
                                            const ua = navigator.userAgent;
                                            const deviceName = /iPhone/.test(ua) ? 'iPhone' : /iPad/.test(ua) ? 'iPad' : /Android/.test(ua) ? 'Android' : /Mac/.test(ua) ? 'Mac' : /Windows/.test(ua) ? 'Windows' : 'Unknown';
                                            await supabase.from('pilot_passkeys').upsert({
                                                user_id: pkUserId,
                                                credential_id: result.id,
                                                public_key: pubKeyBuf ? Array.from(new Uint8Array(pubKeyBuf)) : [],
                                                sign_count: 0,
                                                device_name: deviceName,
                                                transports: (result as any).response?.getTransports?.() ?? [],
                                            }, { onConflict: 'credential_id' });
                                        }
                                    } catch (pe: any) {
                                        console.warn('⚠️ [Passkey] skipped:', pe?.name, pe?.message);
                                    }
                                }
                                setTimeout(() => onNavigate('platform'), 300);
                            }}
                            style={{ width: '100%', padding: '12px', borderRadius: '10px', border: 'none', background: '#0f172a', color: '#fff', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}
                        >
                            Got it — Continue
                        </button>
                        <p style={{ fontSize: '10px', color: '#94a3b8', textAlign: 'center', margin: '10px 0 0' }}>
                            Covered under GDPR Art. 9 · Illinois BIPA · PDPA
                        </p>
                    </div>
                </div>
            , document.body)}

            {/* Passkey Cancelled — Backup Recovery Key Modal (portal to body so it survives unmount) */}
            {showPasskeyCancelled && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: '100%', maxWidth: '440px', background: '#0f172a', border: '1px solid rgba(220,38,38,0.4)', borderRadius: '16px', padding: '28px 24px', boxShadow: '0 25px 60px rgba(0,0,0,0.6)' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                            <span style={{ fontSize: '22px' }}>⚠️</span>
                            <div>
                                <p style={{ fontSize: '14px', fontWeight: 800, color: '#ef4444', margin: 0 }}>Passkey not saved</p>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>You cancelled the browser prompt</p>
                            </div>
                        </div>

                        <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.6, marginBottom: '18px' }}>
                            Without a passkey, you will <strong style={{ color: '#ef4444' }}>permanently lose access</strong> to your PIC and all credentials stored inside. Copy your backup recovery key below and paste it into your Notes or a password manager before continuing.
                        </p>

                        {/* Recovery key display */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', padding: '14px 16px', marginBottom: '14px' }}>
                            <p style={{ fontSize: '10px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 8px' }}>Backup Recovery Key</p>
                            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', letterSpacing: '0.15em', fontFamily: 'monospace', margin: '0 0 12px', wordBreak: 'break-all' }}>{backupRecoveryKey}</p>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(backupRecoveryKey);
                                    setRecoveryCopied(true);
                                }}
                                style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 700, background: recoveryCopied ? 'rgba(74,222,128,0.15)' : 'rgba(255,255,255,0.08)', color: recoveryCopied ? '#4ade80' : '#fff', transition: 'all 0.2s' }}
                            >
                                {recoveryCopied ? '✓ Copied to clipboard' : 'Copy Recovery Key'}
                            </button>
                        </div>

                        <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.3)', lineHeight: 1.5, marginBottom: '18px', textAlign: 'center' }}>
                            Paste this key into Apple Notes, Google Keep, or your password manager. Store it somewhere safe — we cannot recover it for you.
                        </p>

                        <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                                onClick={() => {
                                    setShowPasskeyCancelled(false);
                                    setRecoveryCopied(false);
                                }}
                                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.12)', background: 'transparent', color: 'rgba(255,255,255,0.5)', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
                            >
                                Try Passkey Again
                            </button>
                            <button
                                disabled={!recoveryCopied}
                                onClick={() => {
                                    setShowPasskeyCancelled(false);
                                    onNavigate('platform');
                                }}
                                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: recoveryCopied ? '#dc2626' : 'rgba(255,255,255,0.05)', color: recoveryCopied ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 700, cursor: recoveryCopied ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                            >
                                I've saved it — Continue →
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}
        </>
    );
};
