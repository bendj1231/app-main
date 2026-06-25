
import React, { useState, useEffect, useRef } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { createPortal } from 'react-dom';
import { MeshGradient } from '@paper-design/shaders-react';
// TopNavbar removed for a focused create-account experience
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '../../../src/lib/device-detection';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import { WalletFirstCredentialFlow } from './WalletFirstCredentialFlow';

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
    'None / No Licence',
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

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { user: auth0User, getAccessTokenSilently, loginWithRedirect } = useAuth0();
    const { callApi } = useWorkerAuth();
    const [enableShader, setEnableShader] = useState(false);
    const isSetup = new URLSearchParams(window.location.search).get('setup') === '1';
    const setupInitRef = React.useRef(false);
    const profileCheckInitiatedRef = React.useRef(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showEmailForm, setShowEmailForm] = useState(false);
    const [authError, setAuthError] = useState('');
    const [authLoading, setAuthLoading] = useState(false);

    // Run once on mount — clear flags that would block session restoration on OAuth redirect
    useEffect(() => {
        if (isSetup && !setupInitRef.current && typeof localStorage !== 'undefined') {
            setupInitRef.current = true;
            localStorage.removeItem('explicitLogout');
            sessionStorage.removeItem('wallet_claimed_provider');
            sessionStorage.removeItem('wallet_did');
        }
    }, [isSetup]);

    // Setup form state
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [hoursWhole, setHoursWhole] = useState('');
    const [hoursMinutes, setHoursMinutes] = useState('');
    const [occupation, setOccupation] = useState('');
    const [dob, setDob] = useState('');
    const [nationality, setNationality] = useState('');
    const [phone, setPhone] = useState('');
    const [aircraftTypes, setAircraftTypes] = useState<string[]>([]);
    const [ratings, setRatings] = useState<string[]>([]);
    const [issuingAuthority, setIssuingAuthority] = useState('');
    const [aircraftCategory, setAircraftCategory] = useState('');
    const [typeRatings, setTypeRatings] = useState<string[]>([]);
    const [typeRatingInput, setTypeRatingInput] = useState('');
    const [elpLevel, setElpLevel] = useState('');
    const [medicalClass, setMedicalClass] = useState('');
    const [radioLicense, setRadioLicense] = useState(false);
    const [otherLicence, setOtherLicence] = useState('');
    const [showMoreClasses, setShowMoreClasses] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showAircraftSection, setShowAircraftSection] = useState(false);
    const [showRatingsSection, setShowRatingsSection] = useState(false);
    const [showAircraftModal, setShowAircraftModal] = useState(false);
    const [showRatingsModal, setShowRatingsModal] = useState(false);
    const [showTypeRatingsModal, setShowTypeRatingsModal] = useState(false);
    const [step3Subview, setStep3Subview] = useState<'overview' | 'aircraft' | 'ratings' | 'typeRatings'>('overview');
    const [hoveredRow, setHoveredRow] = useState<'aircraft' | 'ratings' | null>(null);
    const [exitingRow, setExitingRow] = useState<'aircraft' | 'ratings' | null>(null);
    const rowExitTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
    const [stageTransition, setStageTransition] = useState<'idle' | 'exiting'>('idle');
    const [saving, setSaving] = useState(false);

    // ── Pilot Career Status (pilotshortage.org compliant) ──
    const [employmentStatus, setEmploymentStatus] = useState<'employed' | 'instructor' | 'transitioning' | 'graduate' | 'unemployed' | 'shifted_career' | 'exploring' | ''>('');
    const [unemployedDuration, setUnemployedDuration] = useState('');
    const [currentJob, setCurrentJob] = useState('');
    const [careerGoal, setCareerGoal] = useState('');
    const [totalHours, setTotalHours] = useState('');
    const [picHours, setPicHours] = useState('');
    const [currentRole, setCurrentRole] = useState('');
    const [immediateAvailable, setImmediateAvailable] = useState(false);
    const [hoursCertified, setHoursCertified] = useState(false);
    const [atoAuditRequested, setAtoAuditRequested] = useState(false);
    const [atoAuditPending, setAtoAuditPending] = useState(false);
    const [pilotStage, setPilotStage] = useState('');
    const [showRedirect, setShowRedirect] = useState(false);
    const NON_PILOT_STAGES = ['aspirant', 'student_no_license', 'ground_school'];
    const isVisitor = occupation === 'None / No Licence';
    const [saveError, setSaveError] = useState('');
    const [showLogbookModal, setShowLogbookModal] = useState(false);
    const [selectedProvider, setSelectedProvider] = useState<string | null>(null);
    const [providerConnected, setProviderConnected] = useState(false);
    const [vcCredentialUrl, setVcCredentialUrl] = useState<string | null>(null);
    const [showWalletSelector, setShowWalletSelector] = useState(false);
    const [showResourceSelector, setShowResourceSelector] = useState(false);
    const [selectedWallet, setSelectedWallet] = useState<string | null>(null);
    const [walletConnected, setWalletConnected] = useState(false);
    const [showPasskeyCancelled, setShowPasskeyCancelled] = useState(false);
    const [backupRecoveryKey, setBackupRecoveryKey] = useState('');
    const [recoveryCopied, setRecoveryCopied] = useState(false);
    const [setupStage, setSetupStage] = useState(1);
    const [showWalletFirst, setShowWalletFirst] = useState(false);
    const [walletStorageChoice, setWalletStorageChoice] = useState<string>('both');
    const [showWalletStorage, setShowWalletStorage] = useState(false);
    const [walletCreating, setWalletCreating] = useState<'idle' | 'generating' | 'syncing' | 'active'>('idle');
    const [showBiometricNotice, setShowBiometricNotice] = useState(false);
    const [passkeyContext, setPasskeyContext] = useState<{ userId: string; email: string; name: string } | null>(null);
    const passkeyRegistrationRef = React.useRef<(() => Promise<void>) | null>(null);

    const CREDENTIAL_WALLETS = [
        { id: 'pilot', name: 'PilotRecognition PIC', logo: '🔐', desc: 'Pilot Identity Credentials · Secure digital verification', color: 'text-[#00b4d8]', border: 'border-[#00b4d8]/40', href: (url: string) => `${import.meta.env.VITE_PILOT_WALLET_URL}?offer=${encodeURIComponent(url)}` },
    ];

    const LOGBOOK_PROVIDERS = [
        { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png', badge: 'Free', status: 'available', method: 'OAuth 2.0', methodColor: 'text-[#00b4d8]' },
        { id: 'foreflight', name: 'ForeFlight', region: 'Global', logo: '📗', badge: 'Professional', status: 'coming_soon', method: 'Direct API', methodColor: 'text-green-400' },
        { id: 'logtenpro', name: 'LogTen Pro', region: 'Global', logo: '📕', badge: 'Enterprise', status: 'coming_soon', method: 'API Passkey', methodColor: 'text-purple-400' },
        { id: 'garminpilot', name: 'Garmin Pilot', region: 'Global', logo: '📙', badge: 'Fleet', status: 'coming_soon', method: 'CSV Import', methodColor: 'text-orange-400' },
    ];

    useEffect(() => {
        setEnableShader(shouldEnable3DEffects());
    }, []);

    // ── Detect Auth0 user and pre-populate display name ──
    useEffect(() => {
        if (isSetup && auth0User) {
            setDisplayName(auth0User.email || '');
        }
    }, [isSetup, auth0User]);

    useEffect(() => {
        const ref = new URLSearchParams(window.location.search).get('ref');
        if (ref) {
            document.cookie = `pr_ref=${ref}; path=/; max-age=${60 * 60 * 24 * 30}; SameSite=Lax`;
        }
    }, []);

    // ── Check profile existence after authentication and redirect accordingly ──
    const [profileCheckComplete, setProfileCheckComplete] = useState(false);
    const [profileExists, setProfileExists] = useState<boolean | null>(null);

    // Check profile for Auth0 users — runs exactly once
    useEffect(() => {
        if (!isSetup || !auth0User?.sub || profileCheckInitiatedRef.current) return;
        profileCheckInitiatedRef.current = true;

        const checkProfile = async () => {
            const auth0Id = auth0User.sub;
            console.log('[DEBUG][BecomeMember] Checking profile for Auth0 user:', auth0Id);
            const exists = await checkUserProfileExists(auth0Id);
            console.log('[DEBUG][BecomeMember] Profile exists:', exists);
            setProfileExists(exists);
            setProfileCheckComplete(true);
        };

        checkProfile();
    }, [isSetup, auth0User]);

    // Redirect based on profile existence
    useEffect(() => {
        if (!profileCheckComplete || !isSetup) return;

        if (profileExists) {
            console.log('[DEBUG][BecomeMember] Profile exists, redirecting to /platform');
            window.location.href = '/platform';
        }
        // If profile doesn't exist, stay on the page to complete onboarding
    }, [profileCheckComplete, profileExists, isSetup]);

    useEffect(() => {
        if (typeof window === 'undefined') return;

        const hideBrowserUi = () => {
            if (window.scrollY <= 1) {
                window.scrollTo(0, 1);
            }
        };

        hideBrowserUi();
        const timers = [250, 500, 1000, 2000].map((delay) =>
            window.setTimeout(hideBrowserUi, delay)
        );

        window.addEventListener('resize', hideBrowserUi, { passive: true });
        window.addEventListener('orientationchange', hideBrowserUi, { passive: true });

        return () => {
            timers.forEach(window.clearTimeout);
            window.removeEventListener('resize', hideBrowserUi);
            window.removeEventListener('orientationchange', hideBrowserUi);
        };
    }, []);

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
        const sbUserId = auth0User?.sub;

        // Restore wallet state only if it belongs to the current user
        const savedWallet = sessionStorage.getItem('wallet_claimed_provider');
        const savedUserId = sessionStorage.getItem('pr_user_id');
        // Clear stale wallet state if a different user is now logged in
        if (sbUserId && savedUserId && savedUserId !== sbUserId) {
            sessionStorage.removeItem('wallet_claimed_provider');
            sessionStorage.removeItem('wallet_did');
            sessionStorage.removeItem('pr_user_id');
        }
        if (savedWallet && sbUserId && savedUserId === sbUserId) {
            setWalletConnected(true);
            setSelectedWallet(savedWallet);
            // Unlock Commit card if we have logbook + wallet
            if (logbookSynced || sessionStorage.getItem('mfb_total_hours')) {
                setSetupStage(5);
            }
        }

        if (mfbHours && mfbProvider) {
            const hrs = parseFloat(mfbHours);
            setHoursWhole(String(Math.floor(hrs)));
            setHoursMinutes(String(Math.round((hrs % 1) * 60)));
            setSelectedProvider(mfbProvider);
            setProviderConnected(true);

            // If returning from logbook OAuth, land on Stage 3 (Hours + PIC)
            if (logbookSynced) {
                setSetupStage(5);
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
            if (!auth0User?.sub) return;
            await callWorker('updateProfile', { id: auth0User.sub, ...fields });
        } catch (e) {
            console.warn('[BecomeMember] partial save failed (non-blocking):', e);
        }
    };

    const handleSaveProfile = async () => {
        if (!auth0User?.sub) { setSaveError('Authentication error. Please sign in again.'); return; }
        const cleanFirst = firstName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanLast = lastName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
        const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
        if (!cleanFirst || cleanFirst.length < 1) { setSaveError('First name is required.'); return; }
        if (!cleanLast || cleanLast.length < 1) { setSaveError('Last name is required.'); return; }
        if (!cleanName || cleanName.length < 2) { setSaveError('Callsign is required.'); return; }
        if (!OCCUPATIONS.includes(occupation)) { setSaveError('Please select a valid role.'); return; }
        if (!issuingAuthority || issuingAuthority.trim() === '') { setSaveError('License issuing authority is required.'); return; }
        const wholeHrs = parseInt(hoursWhole);
        const mins = parseInt(hoursMinutes || '0');
        if (hoursWhole && (isNaN(wholeHrs) || wholeHrs < 0 || wholeHrs > 99999)) { setSaveError('Please enter valid flight hours.'); return; }
        if (isNaN(mins) || mins < 0 || mins > 59) { setSaveError('Minutes must be between 0 and 59.'); return; }
        const hours = wholeHrs + mins / 60;
        setSaving(true);
        setSaveError('');
        try {
            const dcaAgreed = sessionStorage.getItem('dca_agreed') === 'true';
            const dcaAgreedAt = sessionStorage.getItem('dca_agreed_at') || null;

            const workerPayload = {
                email: auth0User.email || '',
                role: isVisitor ? 'visitor' : 'pilot',
                is_visitor: isVisitor,
                name: `${cleanFirst} ${cleanLast}`.trim(),
                display_name: cleanName,
                first_name: cleanFirst,
                last_name: cleanLast,
                current_occupation: occupation,
                license_type: occupation || null,
                other_licence: otherLicence || null,
                date_of_birth: dob || null,
                nationality: nationality || null,
                current_flight_hours: hours || null,
                total_flight_hours: hours || null,
                hours_whole: hoursWhole || null,
                hours_minutes: hoursMinutes || null,
                aircraft_types: aircraftTypes.length > 0 ? aircraftTypes : null,
                aircraft_rated_on: aircraftTypes.length > 0 ? aircraftTypes.join(', ') : null,
                aircraft_category: aircraftCategory || null,
                license_issuing_authority: issuingAuthority || null,
                country_of_license: issuingAuthority || null,
                origin_jurisdiction: issuingAuthority || null,
                ratings: ratings.filter(r => r !== '__none__').length > 0 ? ratings.filter(r => r !== '__none__') : null,
                type_ratings: typeRatings.filter(r => r !== '__none__').length > 0 ? typeRatings.filter(r => r !== '__none__') : (occupation ? [occupation] : null),
                type_rating_input: typeRatingInput || null,
                elp_level: elpLevel || null,
                medical_class: medicalClass || null,
                radio_license: radioLicense,
                employment_status: employmentStatus || null,
                current_job: currentRole || null,
                career_goal: careerGoal || null,
                pilot_stage: pilotStage || null,
                immediate_available: immediateAvailable,
                unemployed_duration: unemployedDuration || null,
                phone: phone || null,
                hours_certified: hoursCertified,
                data_controller_agreement_accepted: dcaAgreed ? 1 : 0,
                data_controller_agreement_accepted_at: dcaAgreedAt,
            };
            console.log('[DEBUG][Worker] Full profile save payload:', JSON.stringify(workerPayload, null, 2));

            sessionStorage.setItem('pr_profile_payload', JSON.stringify(workerPayload));
            onNavigate('recognition-profile/create');
        } catch (err) {
            console.error('🔴 [handleSaveProfile] outer catch:', err);
            setSaveError('Failed to save. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    const handleEmailSignup = () => {
        onNavigate('data-controller-agreement?signup=email');
    };

    const handleGoogleSignup = () => {
        onNavigate('data-controller-agreement?signup=google');
    };

    const handleGoogleOAuth = async () => {
        await loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2',
            },
            appState: {
                returnTo: '/data-controller-agreement?signup=google',
            },
        });
    };

    const handleAppleSignup = () => {
        onNavigate('data-controller-agreement?signup=apple');
    };

    // Worker API helper with request counting
    const WORKER_URL = 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';
    const workerRequestCountRef = React.useRef(0);
    const callWorker = async (action: string, params: Record<string, unknown>) => {
        workerRequestCountRef.current += 1;
        const count = workerRequestCountRef.current;
        console.log(`[DEBUG][Worker] Request #${count}: action="${action}"`);
        const token = await getAccessTokenSilently();
        const res = await fetch(`${WORKER_URL}/api`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
            body: JSON.stringify({ action, params }),
        });
        if (!res.ok) {
            const err = await res.json().catch(() => ({ error: 'Worker request failed' }));
            throw new Error((err as any).error || `Worker error: ${res.status}`);
        }
        const data = await res.json();
        console.log(`[DEBUG][Worker] Request #${count} complete: action="${action}"`, { hasError: !!data?.error, hasId: !!data?.id, keys: Object.keys(data || {}) });
        return data;
    };

    // Check if user has an existing profile via Worker
    const checkUserProfileExists = async (auth0Id: string): Promise<boolean> => {
        try {
            const result = await callWorker('getProfile', { auth0_id: auth0Id });
            console.log('[DEBUG][BecomeMember] checkUserProfileExists result:', { hasId: !!(result as any)?.id, id: (result as any)?.id });
            return !!(result as any)?.id;
        } catch (err: any) {
            console.warn('[DEBUG][BecomeMember] checkUserProfileExists error:', err.message);
            return false;
        }
    };

    const logbookSynced = new URLSearchParams(window.location.search).get('logbook') === 'synced';

    // ── While Auth0 session loads (skip wait if returning from logbook sync) ─
    if (isSetup && !auth0User && !logbookSynced) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #00b4d8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── While checking profile existence ─-
    if (isSetup && !profileCheckComplete && auth0User) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: '#0f172a' }}>
                <div style={{ width: 48, height: 48, border: '4px solid #00b4d8', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
                <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
            </div>
        );
    }

    // ── Profile setup step (redirected here after Auth0 signup or logbook sync) ──
    if (isSetup && (!!auth0User || logbookSynced)) {
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

                <div style={{ position: 'relative', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid rgba(255,255,255,0.07)', background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                    <h1 className="text-base font-bold tracking-tight">
                        <span className="text-white">PILOT</span><span className="text-red-400">RECOGNITION</span>
                    </h1>
                    <button
                        onClick={() => onNavigate('home')}
                        className="px-4 py-2 rounded-lg text-white/50 hover:text-white text-xs font-semibold tracking-wide transition-all mr-2"
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
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Set up your profile to unlock pathway access</p>
                        </div>

                        <style>{`
                            @keyframes stepIn {
                                0%   { opacity: 0; transform: translateY(16px); }
                                100% { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes materializeIn {
                                0%   { opacity: 0; transform: scale(0.96) translateY(12px); filter: blur(4px); }
                                60%  { opacity: 1; transform: scale(1.01) translateY(-2px); filter: blur(0px); }
                                100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
                            }
                            @keyframes dematerializeOut {
                                0%   { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
                                100% { opacity: 0; transform: scale(0.96) translateY(-6px); filter: blur(2px); }
                            }
                            @keyframes stageBlurOut {
                                0%   { opacity: 1; filter: blur(0px) brightness(1); transform: scale(1) translateX(0); }
                                50%  { opacity: 0.6; filter: blur(6px) brightness(0.8); transform: scale(0.98) translateX(-8px); }
                                100% { opacity: 0; filter: blur(12px) brightness(0.5); transform: scale(0.94) translateX(-16px); }
                            }
                            @keyframes materializeCard {
                                0%   { opacity: 0; transform: scale(0.94) translateY(24px); filter: blur(8px); }
                                100% { opacity: 1; transform: scale(1) translateY(0); filter: blur(0px); }
                            }
                            @keyframes dotPulse {
                                0%, 100% { opacity: 1; }
                                50%       { opacity: 0.3; }
                            }
                            .step-card {
                                background: rgba(255,255,255,0.04);
                                border: 1px solid rgba(255,255,255,0.1);
                                border-radius: 16px;
                                padding: 28px 32px;
                                display: flex;
                                flex-direction: column;
                                gap: 16px;
                                position: relative;
                                animation: materializeIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                                transform-origin: center top;
                            }
                            .step-card-active {
                                border-color: #dc2626;
                                box-shadow: 0 0 0 2px #dc2626, 0 8px 32px rgba(0,0,0,0.3);
                            }
                            .step-card-done {
                                background: #111827;
                                border-color: rgba(255,255,255,0.08);
                            }
                            .materialize-stage {
                                animation: materializeIn 0.45s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                                transform-origin: center top;
                            }
                            .fic-title {
                                font-size: 22px;
                                font-weight: 700;
                                color: #ffffff;
                                letter-spacing: -0.02em;
                                line-height: 1.1;
                                margin: 0;
                            }
                            .fic-title-red { color: #dc2626 !important; }
                            .step-card-done .fic-title { color: #ffffff !important; }
                            .fic-input {
                                width: 100%;
                                background: rgba(0,0,0,0.2);
                                border: 1px solid rgba(255,255,255,0.15);
                                border-radius: 14px;
                                padding: 10px 14px;
                                color: #ffffff;
                                -webkit-text-fill-color: #ffffff;
                                font-size: 13px;
                                font-weight: 500;
                                line-height: 1.5;
                                outline: none;
                                transition: border-color 0.2s, box-shadow 0.2s;
                                box-sizing: border-box;
                            }
                            .fic-input:focus {
                                border-color: rgba(255,255,255,0.4);
                                box-shadow: 0 0 0 3px rgba(255,255,255,0.08);
                                background: rgba(0,0,0,0.3);
                            }
                            .fic-input::placeholder { color: #94a3b8; }
                            .fic-input:-webkit-autofill,
                            .fic-input:-webkit-autofill:hover,
                            .fic-input:-webkit-autofill:focus {
                                -webkit-text-fill-color: #ffffff !important;
                                -webkit-box-shadow: 0 0 0px 1000px rgba(0,0,0,0.2) inset !important;
                                transition: background-color 5000s ease-in-out 0s;
                            }
                            .fic-select {
                                width: 100%;
                                appearance: none;
                                -webkit-appearance: none;
                                background: rgba(0,0,0,0.2) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 16px center;
                                border: 1px solid rgba(255,255,255,0.15);
                                border-radius: 14px;
                                padding: 13px 44px 13px 18px;
                                color: #ffffff;
                                font-size: 14px;
                                font-weight: 500;
                                letter-spacing: -0.01em;
                                outline: none;
                                cursor: pointer;
                                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                                box-sizing: border-box;
                                backdrop-filter: blur(20px) saturate(180%);
                                -webkit-backdrop-filter: blur(20px) saturate(180%);
                                box-shadow: 0 2px 8px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.1);
                            }
                            .fic-select:hover {
                                background: rgba(0,0,0,0.3);
                                border-color: rgba(255,255,255,0.3);
                                box-shadow: 0 4px 16px rgba(0,0,0,0.15), inset 0 1px 0 rgba(255,255,255,0.1);
                                transform: translateY(-1px);
                            }
                            .fic-select:focus {
                                border-color: rgba(255,255,255,0.4);
                                box-shadow: 0 0 0 4px rgba(255,255,255,0.08), 0 4px 20px rgba(0,0,0,0.15);
                                background: rgba(0,0,0,0.3);
                            }
                            .fic-select option {
                                font-size: 14px;
                                font-weight: 500;
                                color: #ffffff;
                                background: #1e293b;
                                padding: 10px 14px;
                            }
                            .fic-select optgroup {
                                font-size: 11px;
                                font-weight: 700;
                                text-transform: uppercase;
                                letter-spacing: 0.08em;
                                color: #94a3b8;
                                background: #0f172a;
                            }
                            .fic-subtext {
                                font-size: 12px;
                                color: rgba(255,255,255,0.5);
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
                            .pill-grid button { transition: transform 0.15s ease; }
                            .pill-grid button:hover { transform: translateY(-1px); }
                            .selection-card {
                                position: relative;
                                padding: 12px;
                                background: rgba(255,255,255,0.03);
                                border: 1px solid rgba(255,255,255,0.08);
                                border-radius: 8px;
                                cursor: pointer;
                                transition: all 0.2s ease;
                                text-align: left;
                                display: flex;
                                flex-direction: column;
                                gap: 2px;
                            }
                            .selection-card:hover {
                                background: rgba(255,255,255,0.06);
                                border-color: rgba(255,255,255,0.15);
                                transform: translateY(-1px);
                                box-shadow: 0 4px 12px rgba(0,0,0,0.2);
                            }
                            .selection-card:active {
                                transform: scale(0.97) translateY(0);
                            }
                            .selection-card.selected {
                                background: rgba(220,38,38,0.12);
                                border-color: rgba(220,38,38,0.5);
                                box-shadow: 0 0 0 1px rgba(220,38,38,0.3), 0 4px 12px rgba(220,38,38,0.15);
                            }
                            .selection-card.selected:hover {
                                background: rgba(220,38,38,0.18);
                                border-color: rgba(220,38,38,0.6);
                            }
                            .selection-card.disabled {
                                opacity: 0.4;
                                pointer-events: none;
                                cursor: not-allowed;
                            }
                            .card-check {
                                position: absolute;
                                top: 10px;
                                right: 10px;
                                width: 18px;
                                height: 18px;
                                border-radius: 50%;
                                border: 1.5px solid rgba(255,255,255,0.2);
                                display: flex;
                                align-items: center;
                                justify-content: center;
                                transition: all 0.15s ease;
                                flex-shrink: 0;
                            }
                            .selection-card.selected .card-check {
                                border-color: #dc2626;
                                background: #dc2626;
                            }

                            /* ── Materialize Animations ── */
                            @keyframes fadeInUp {
                                0%   { opacity: 0; transform: translateY(12px); }
                                100% { opacity: 1; transform: translateY(0); }
                            }
                            @keyframes scaleIn {
                                0%   { opacity: 0; transform: scale(0.92); }
                                100% { opacity: 1; transform: scale(1); }
                            }
                            @keyframes slideInRight {
                                0%   { opacity: 0; transform: translateX(20px); }
                                100% { opacity: 1; transform: translateX(0); }
                            }
                            @keyframes slideInLeft {
                                0%   { opacity: 0; transform: translateX(-20px); }
                                100% { opacity: 1; transform: translateX(0); }
                            }
                            @keyframes ripple {
                                0%   { transform: scale(0); opacity: 0.35; }
                                100% { transform: scale(2.5); opacity: 0; }
                            }
                            @keyframes glowPulse {
                                0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0); }
                                50%       { box-shadow: 0 0 0 4px rgba(220,38,38,0.15); }
                            }
                            @keyframes borderGlow {
                                0%, 100% { border-color: rgba(255,255,255,0.1); }
                                50%       { border-color: rgba(255,255,255,0.25); }
                            }

                            .materialize-child {
                                animation: fadeInUp 0.4s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
                                opacity: 0;
                            }
                            .stagger-1 { animation-delay: 0.05s; }
                            .stagger-2 { animation-delay: 0.10s; }
                            .stagger-3 { animation-delay: 0.15s; }
                            .stagger-4 { animation-delay: 0.20s; }
                            .stagger-5 { animation-delay: 0.25s; }
                            .stagger-6 { animation-delay: 0.30s; }
                            .stagger-7 { animation-delay: 0.35s; }
                            .stagger-8 { animation-delay: 0.40s; }

                            .hover-lift {
                                transition: transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.2s ease, border-color 0.2s ease;
                            }
                            .hover-lift:hover {
                                transform: translateY(-2px);
                                box-shadow: 0 8px 24px rgba(0,0,0,0.25);
                            }
                            .hover-lift:active {
                                transform: scale(0.98) translateY(0);
                            }

                            .btn-ripple {
                                position: relative;
                                overflow: hidden;
                            }
                            .btn-ripple::after {
                                content: '';
                                position: absolute;
                                top: 50%;
                                left: 50%;
                                width: 100%;
                                height: 100%;
                                background: radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%);
                                border-radius: 50%;
                                transform: translate(-50%, -50%) scale(0);
                                opacity: 0;
                                pointer-events: none;
                            }
                            .btn-ripple:active::after {
                                animation: ripple 0.5s ease-out;
                            }

                            .glow-active {
                                animation: glowPulse 2s ease-in-out infinite;
                            }
                            .border-glow {
                                animation: borderGlow 3s ease-in-out infinite;
                            }
                        `}</style>

                        {/* Unified Profile Card */}
                        <div className="bg-slate-900/40 border border-white/10 backdrop-blur-xl rounded-2xl shadow-2xl shadow-black/50" style={{ maxWidth: '720px', margin: '0 auto', height: 'auto', overflow: 'hidden', animation: 'materializeCard 0.6s cubic-bezier(0.34, 1.56, 0.64, 1) forwards' }}>
                            <div className="p-6">
                                {/* Stage indicator */}
                                <div className="mb-8">
                                    <div className="flex gap-2 mb-3">
                                        {[1, 2, 3, 4, 5, 6].map(s => (
                                            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${setupStage >= s ? 'bg-red-500' : 'bg-white/20'}`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-white/60 uppercase tracking-wider leading-none">Step {setupStage} of 6</span>
                                        <span className="text-xs font-medium text-white/40 leading-none">
                                            {setupStage === 1 ? 'Identity' : setupStage === 2 ? 'Classification' : setupStage === 3 ? 'Licensure and Type Ratings' : setupStage === 4 ? 'Pilot Status' : setupStage === 5 ? 'Flight Hours' : 'Create Profile'}
                                        </span>
                                    </div>
                                </div>

                                {/* Stage content wrapper — key forces remount + materialize animation on every stage change */}
                                <div key={setupStage} className="materialize-stage" style={{ animation: stageTransition === 'exiting' ? 'stageBlurOut 0.28s cubic-bezier(0.55, 0, 0.45, 1) forwards' : undefined }}>
                                {setupStage === 1 && (
                                <>
                                {/* ── SECTION 1: Identity ── */}
                                <div className="border-b border-white/10 pb-4 materialize-child stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                    <h3 className="text-lg font-bold text-white mb-0 materialize-child stagger-1">Identity</h3>
                                    <div className="mb-3" style={{ display: 'flex', gap: '8px' }}>
                                        <input className="fic-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                                        <input className="fic-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Email / Public Callsign
                                        </div>
                                        <input className="fic-input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="your@email.com" />
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>
                                            Date of Birth
                                        </div>
                                        <input type="text" value={dob} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 8); let fmt = raw; if (raw.length >= 4) fmt = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4); else if (raw.length >= 2) fmt = raw.slice(0, 2) + '/' + raw.slice(2); setDob(fmt); }} placeholder="DD/MM/YYYY" style={{ width: '100%', padding: '8px 14px', background: 'rgba(0,0,0,0.2)', border: `1px solid ${dob && (() => { const parts = dob.split('/'); if (parts.length !== 3) return false; const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]); if (isNaN(d) || isNaN(m) || isNaN(y)) return false; const birth = new Date(y, m - 1, d); const today = new Date(); let age = today.getFullYear() - birth.getFullYear(); const mo = today.getMonth() - birth.getMonth(); if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--; return age < 18; })() ? '#ef4444' : 'rgba(255,255,255,0.15)'}`, borderRadius: '12px', fontSize: '13px', lineHeight: '1.4', color: '#ffffff', WebkitTextFillColor: '#ffffff', boxSizing: 'border-box' }} />
                                        {(() => {
                                            if (!dob) return null;
                                            const parts = dob.split('/');
                                            if (parts.length !== 3) return null;
                                            const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]);
                                            if (isNaN(d) || isNaN(m) || isNaN(y)) return null;
                                            const birth = new Date(y, m - 1, d);
                                            if (isNaN(birth.getTime())) return null;
                                            const today = new Date();
                                            let age = today.getFullYear() - birth.getFullYear();
                                            const mo = today.getMonth() - birth.getMonth();
                                            if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--;
                                            if (age >= 18) return null;
                                            return (
                                                <p style={{ margin: '6px 0 0 0', fontSize: '11px', color: '#dc2626', fontWeight: 600, lineHeight: 1.5 }}>
                                                    ⚠ You are restricted from submitting pathway applications until you reach 18 years of age. You may still build your profile and explore the platform.{' '}
                                                    <a href="/data-controller-agreement#article-11" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}>Learn more →</a>
                                                </p>
                                            );
                                        })()}
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Nationality</div>
                                        <select value={nationality} onChange={e => setNationality(e.target.value)} style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5', color: nationality ? '#ffffff' : '#94a3b8', WebkitTextFillColor: nationality ? '#ffffff' : '#94a3b8', boxSizing: 'border-box', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 14px center' }}>
                                            <option value="" disabled>Select nationality...</option>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div className="mb-3">
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Phone <span style={{ color: 'rgba(148,163,184,0.5)', fontWeight: 400, textTransform: 'none', fontSize: '10px' }}>(optional)</span></div>
                                        <input
                                            type="tel"
                                            value={phone}
                                            onChange={e => setPhone(e.target.value)}
                                            placeholder="+971 55 123 4567"
                                            style={{ width: '100%', padding: '10px 14px', background: 'rgba(0,0,0,0.2)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px', lineHeight: '1.5', color: phone ? '#ffffff' : '#94a3b8', boxSizing: 'border-box' }}
                                        />
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', padding: '8px 12px', background: 'rgba(255,255,255,0.04)', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                            <span style={{ fontSize: '11px', flexShrink: 0 }}>🔓</span>
                                            <span style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>Email / callsign is <strong style={{ color: '#ffffff' }}>public</strong> and visible to other operators.</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                            <span style={{ fontSize: '11px', flexShrink: 0 }}>🔒</span>
                                            <span style={{ fontSize: '11px', color: '#9ca3af', lineHeight: 1.4 }}>Real name, date of birth, and nationality are stored under your full sovereign control as the data controller record on pilotrecognition.com, used solely for verification, and can be deleted or exported at any time under our GDPR-compliant process. <a href="/data-controller-agreement#article-2" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>Article 2</a>.</span>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.3, paddingLeft: '18px' }}>
                                            Notice: account information will be displayed across pilotrecognition.com, pilotcareerpathways.com, pilotshortage.org
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#38bdf8', lineHeight: 1.3, paddingLeft: '18px' }}>
                                            <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" style={{ color: '#38bdf8', textDecoration: 'underline' }}>📄 Data Controller Agreement</a>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#9ca3af', lineHeight: 1.3, paddingLeft: '18px' }}>
                                            Aviation Pathways Ltd will not sell or transfer this information outside the agreed jurisdiction, except as required for verification with approved providers under the Data Controller Agreement.
                                        </div>
                                    </div>
                                </div>{/* end Section 1 */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '12px' }}>
                                    <button
                                        type="button"
                                        onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(2); setStageTransition('idle'); }, 280); }}
                                        disabled={!firstName.trim() || !lastName.trim() || !dob || !nationality}
                                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 btn-ripple hover-lift glow-active"
                                    >Next →</button>
                                </div>
                                </>
                                )}

                                {setupStage === 2 && (
                                <>
                                {/* ── SECTION 2: Classification ── */}
                                <div className="border-b border-white/10 pb-6 mb-6 materialize-child stagger-1">

                                    <h3 className="text-lg font-bold text-white mb-4 materialize-child stagger-1">Classification</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* ── LICENCE DETAILS ── */}
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', marginTop: '16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>Licence Details</div>
                                    {/* Pilot licence */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Current Pilot Licence</div>
                                        <select
                                            className="fic-select"
                                            value={occupation === 'None / No Licence' ? '' : occupation}
                                            onChange={e => setOccupation(e.target.value)}
                                            disabled={occupation === 'None / No Licence'}
                                            style={{ opacity: occupation === 'None / No Licence' ? 0.5 : 1, cursor: occupation === 'None / No Licence' ? 'not-allowed' : 'pointer', color: occupation && occupation !== 'None / No Licence' ? '#ffffff' : '#94a3b8' }}
                                        >
                                            <option value="" disabled>Select pilot licence...</option>
                                            {OCCUPATIONS.filter(o => o !== 'None / No Licence').map(o => <option key={o} value={o}>{o}</option>)}
                                        </select>
                                        {occupation === 'Other' && (
                                            <div style={{ marginTop: '8px' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Specify licence</div>
                                                <input className="fic-input" type="text" value={otherLicence} onChange={e => setOtherLicence(e.target.value)} placeholder="e.g. Sport Pilot, Recreational Pilot" />
                                            </div>
                                        )}
                                        {/* None required checkbox */}
                                        {(() => {
                                            const isNone = occupation === 'None / No Licence';
                                            return (
                                                <button key="none" type="button"
                                                    onClick={() => { setOccupation(isNone ? '' : 'None / No Licence'); setPilotStage(''); }}
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginTop: '10px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                        {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                    </span>
                                                    <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)', transition: 'all 0.15s' }}>None required — I don't hold a pilot licence</span>
                                                </button>
                                            );
                                        })()}
                                        {(occupation === 'Student Pilot' || occupation === 'Cadet') && (
                                            <div style={{ marginTop: '10px', padding: '14px 16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', background: 'rgba(255,255,255,0.15)', borderRadius: '5px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.04em' }}>Cadet Track Active</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '12px', color: '#9ca3af', lineHeight: 1.55 }}>
                                                    Your profile is optimised for Terminal 2 regional operators, flight instructors, and flight school pathways. Premium Terminal 3 gates will remain locked until CPL/ATPL milestones are claimed.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Pilot licence upload slot */}

                                    {/* ── PILOT GATE ── */}
                                    {occupation && occupation !== 'None / No Licence' && (
                                    <>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>Training Stage</div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>What stage are you at?</div>
                                        <select className="fic-select" value={pilotStage} onChange={e => { const val = e.target.value; setPilotStage(val); setShowRedirect(NON_PILOT_STAGES.includes(val)); }} style={{ color: pilotStage ? '#ffffff' : '#94a3b8' }}>
                                            <option value="" disabled>Select your current career stage...</option>
                                            <optgroup label="✈️ Licensed Pilots">
                                                <option value="bachelor_degree">Graduated with Bachelor of Commercial Flying</option>
                                                <option value="fast_track">Completed Fast-Track Pilot Course</option>
                                                <option value="licensed_no_hours">Licensed but low/no hours (CPL/PPL)</option>
                                                <option value="current_training">Currently in flight training</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    {/* Issuing Authority */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Issuing Authority / State of Issue</div>
                                        <select
                                            className="fic-select"
                                            value={issuingAuthority}
                                            onChange={e => setIssuingAuthority(e.target.value)}
                                            style={{ color: issuingAuthority ? '#ffffff' : '#94a3b8' }}
                                        >
                                            <option value="" disabled>Select issuing authority...</option>
                                            {['CAAP (Philippines)', 'FAA (USA)', 'EASA (Europe)', 'GCAA (UAE)', 'CASA (Australia)', 'CAA (UK)', 'DGCA (India)', 'TCCA (Canada)', 'SACAA (South Africa)', 'JCAB (Japan)', 'CAAS (Singapore)', 'CAAT (Thailand)', 'DGAC (France)', 'LBA (Germany)', 'ENAC (Italy)', 'Other'].map(a => <option key={a} value={a}>{a}</option>)}
                                        </select>
                                        {/* Medical certificate upload slot */}
                                    </div>
                                    </>
                                    )}

                                    {occupation === 'None / No Licence' && (
                                    <>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(148,163,184,0.6)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>Training Stage</div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>What stage are you at?</div>
                                        <select className="fic-select" value={pilotStage} onChange={e => { const val = e.target.value; setPilotStage(val); setShowRedirect(NON_PILOT_STAGES.includes(val)); }} style={{ color: pilotStage ? '#ffffff' : '#94a3b8' }}>
                                            <option value="" disabled>Select your current career stage...</option>
                                            <optgroup label="🎓 Pre-Licensed / Aspirants">
                                                <option value="student_no_license">Student Pilot — no license yet</option>
                                                <option value="ground_school">Ground School only — no flight hours</option>
                                                <option value="aspirant">Interested in aviation — no pilot qualifications</option>
                                            </optgroup>
                                        </select>
                                    </div>

                                    </>
                                    )}

                                </div>
                                {/* Mission strip — glassmorphism */}
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(255,255,255,0.04)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 2px 12px rgba(0,0,0,0.1), inset 0 1px 0 rgba(255,255,255,0.05)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                    <div style={{ fontSize: '12px', color: 'rgba(255,255,255,0.8)', lineHeight: 1.6 }}>
                                        <strong style={{ color: '#ffffff' }}>Verified pilots deserve recognition.</strong> We're connecting qualified pilots to operators through trust, transparency, and career-aligned pathways — not stacks of resumes.{' '}
                                        <a href="/pilot-recognition-profile" target="_blank" rel="noopener noreferrer" style={{ color: '#ef4444', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}>Learn more →</a>
                                    </div>
                                </div>
                                </div>{/* end Section 2 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(1)} className="px-6 py-2.5 h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(occupation && occupation !== 'None / No Licence' ? 3 : 4); setStageTransition('idle'); }, 280); }} disabled={!occupation || !pilotStage || (occupation !== 'None / No Licence' && (!issuingAuthority || (occupation === 'Other' && !otherLicence.trim())))} className="px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>
                                )}

                                {setupStage === 3 && (
                                <>
                                {step3Subview === 'overview' && (
                                <>
                                {/* ── SECTION 3: Licensure and Type Ratings ── */}
                                <div className="border-b border-white/10 pb-3 mb-3">
                                    <h3 className="text-lg font-bold text-white mb-3">Licensure and Type Ratings</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                                    {/* ── AIRCRAFT & PRIVILEGES — progressive disclosure ── */}
                                    {occupation !== 'None / No Licence' && (
                                        <>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: '#94a3af', letterSpacing: '0.05em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid rgba(255,255,255,0.1)', marginTop: '4px' }}>Aircraft &amp; Privileges</div>

                                        {/* Aircraft Class / Type — hover expandable */}
                                        {(() => {
                                            const selectedCount = aircraftTypes.filter(t => t !== '__none__').length;
                                            const isNone = aircraftTypes.includes('__none__');
                                            const isDone = isNone || selectedCount > 0;
                                            return (
                                                <div onMouseEnter={() => { if (rowExitTimer.current) { clearTimeout(rowExitTimer.current); rowExitTimer.current = null; } setExitingRow(null); setHoveredRow('aircraft'); }} onMouseLeave={() => { setExitingRow('aircraft'); setHoveredRow(null); rowExitTimer.current = setTimeout(() => setExitingRow(null), 280); }} style={{ position: 'relative' }}>
                                                    <button type="button" onClick={() => setStep3Subview('aircraft')}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', width: '100%', background: isDone ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isDone ? '#22c55e' : 'rgba(255,255,255,0.3)'}`, background: isDone ? '#22c55e' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                {isDone && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                                                            </span>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                                                <div style={{ fontSize: '11px', fontWeight: 600, color: isDone ? '#22c55e' : '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.15s' }}>Aircraft Class / Type</div>
                                                                <div style={{ fontSize: '12px', color: isDone ? '#22c55e' : 'rgba(255,255,255,0.4)', fontWeight: 500, transition: 'all 0.15s' }}>
                                                                    {isNone ? 'None required' : selectedCount > 0 ? `${selectedCount} selected` : 'Select aircraft classes...'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '10px', color: (hoveredRow === 'aircraft' || exitingRow === 'aircraft') ? '#0f172a' : '#38bdf8', fontWeight: 700, background: (hoveredRow === 'aircraft' || exitingRow === 'aircraft') ? '#ffffff' : 'transparent', padding: (hoveredRow === 'aircraft' || exitingRow === 'aircraft') ? '4px 10px' : '0', borderRadius: '20px', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>{(hoveredRow === 'aircraft' || exitingRow === 'aircraft') ? (<>Click to edit <span style={{ fontSize: '8px' }}>▶</span></>) : 'Edit →'}</span>
                                                    </button>
                                                    {(hoveredRow === 'aircraft' || exitingRow === 'aircraft') && (
                                                        <div style={{ marginTop: '6px', padding: '14px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 10, position: 'relative', animation: exitingRow === 'aircraft' ? 'dematerializeOut 0.28s cubic-bezier(0.55, 0, 1, 0.45) forwards' : 'materializeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards', transformOrigin: 'center top' }}>
                                                            {(() => {
                                                                const isNone = aircraftTypes.includes('__none__');
                                                                return (
                                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setAircraftTypes(isNone ? [] : ['__none__']); }}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                                        </span>
                                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I'm not yet operating aircraft</span>
                                                                    </button>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* Operational Ratings — hover expandable */}
                                        {(() => {
                                            const selectedCount = ratings.filter(r => r !== '__none__').length;
                                            const isNone = ratings.includes('__none__');
                                            const isDone = isNone || selectedCount > 0;
                                            return (
                                                <div onMouseEnter={() => { if (rowExitTimer.current) { clearTimeout(rowExitTimer.current); rowExitTimer.current = null; } setExitingRow(null); setHoveredRow('ratings'); }} onMouseLeave={() => { setExitingRow('ratings'); setHoveredRow(null); rowExitTimer.current = setTimeout(() => setExitingRow(null), 280); }} style={{ position: 'relative' }}>
                                                    <button type="button" onClick={() => setStep3Subview('ratings')}
                                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', width: '100%', background: isDone ? 'rgba(34,197,94,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${isDone ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.1)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${isDone ? '#22c55e' : 'rgba(255,255,255,0.3)'}`, background: isDone ? '#22c55e' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                {isDone && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                                                            </span>
                                                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                                                <div style={{ fontSize: '11px', fontWeight: 600, color: isDone ? '#22c55e' : '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase', transition: 'all 0.15s' }}>Operational Ratings</div>
                                                                <div style={{ fontSize: '12px', color: isDone ? '#22c55e' : 'rgba(255,255,255,0.4)', fontWeight: 500, transition: 'all 0.15s' }}>
                                                                    {isNone ? 'None required' : selectedCount > 0 ? `${selectedCount} selected` : 'Select operational ratings...'}
                                                                </div>
                                                            </div>
                                                        </div>
                                                        <span style={{ fontSize: '10px', color: (hoveredRow === 'ratings' || exitingRow === 'ratings') ? '#0f172a' : '#38bdf8', fontWeight: 700, background: (hoveredRow === 'ratings' || exitingRow === 'ratings') ? '#ffffff' : 'transparent', padding: (hoveredRow === 'ratings' || exitingRow === 'ratings') ? '4px 10px' : '0', borderRadius: '20px', transition: 'all 0.15s', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap' }}>{(hoveredRow === 'ratings' || exitingRow === 'ratings') ? (<>Click to edit <span style={{ fontSize: '8px' }}>▶</span></>) : 'Edit →'}</span>
                                                    </button>
                                                    {(hoveredRow === 'ratings' || exitingRow === 'ratings') && (
                                                        <div style={{ marginTop: '6px', padding: '14px', background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', boxShadow: '0 8px 32px rgba(0,0,0,0.4)', zIndex: 10, position: 'relative', animation: exitingRow === 'ratings' ? 'dematerializeOut 0.28s cubic-bezier(0.55, 0, 1, 0.45) forwards' : 'materializeIn 0.35s cubic-bezier(0.34, 1.56, 0.64, 1) forwards', transformOrigin: 'center top' }}>
                                                            {(() => {
                                                                const isNone = ratings.includes('__none__');
                                                                return (
                                                                    <button type="button" onClick={(e) => { e.stopPropagation(); setRatings(isNone ? [] : ['__none__']); }}
                                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                                        </span>
                                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I don't hold any ratings yet</span>
                                                                    </button>
                                                                );
                                                            })()}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                        {/* Type Ratings — conditional for licensed pilots, inside progressive disclosure */}
                                        {['Private Pilot (PPL)', 'Commercial Pilot (CPL)', 'Airline Pilot (ATPL)', 'First Officer', 'Captain', 'Flight Instructor (CFI)'].includes(occupation) && (() => {
                                            const selectedCount = typeRatings.filter(r => r !== '__none__').length;
                                            const isNone = typeRatings.includes('__none__');
                                            return (
                                                <button type="button" onClick={() => setStep3Subview('typeRatings')}
                                                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', width: '100%', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', gap: '2px' }}>
                                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Type Ratings Held <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                                        <div style={{ fontSize: '12px', color: isNone ? '#ffffff' : selectedCount > 0 ? '#ffffff' : 'rgba(255,255,255,0.4)', fontWeight: 500 }}>
                                                            {isNone ? 'None required' : selectedCount > 0 ? `${selectedCount} selected` : 'Add aircraft type ratings...'}
                                                        </div>
                                                    </div>
                                                    <span style={{ fontSize: '11px', color: '#38bdf8', fontWeight: 600 }}>Edit →</span>
                                                </button>
                                            );
                                        })()}
                                        </>
                                    )}
                                </div>
                                {occupation && occupation !== 'None / No Licence' && (
                                <>
                                {/* ELP Level */}
                                <div className="mb-6">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>English Language Proficiency <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                        {elpLevel && elpLevel !== '__none__' && <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Selected</span>}
                                    </div>
                                    {/* None required checkbox */}
                                    {occupation !== 'None / No Licence' && (() => {
                                        const isNone = elpLevel === '__none__';
                                        return (
                                            <button key="none" type="button"
                                                onClick={() => setElpLevel(isNone ? '' : '__none__')}
                                                className="mb-3"
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', width: '100%', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)', transition: 'all 0.15s' }}>None required — I don't hold an ELP certification</span>
                                            </button>
                                        );
                                    })()}
                                    {elpLevel !== '__none__' && (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                    <select
                                        value={elpLevel}
                                        onChange={e => setElpLevel(e.target.value)}
                                        style={{ width: '100%', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '13px', lineHeight: '1.4', color: elpLevel ? '#ffffff' : '#94a3b8', background: 'rgba(0,0,0,0.2)', colorScheme: 'dark', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                                    >
                                        <option value="">Select ICAO ELP level...</option>
                                        <option value="ELP Level 3">Level 3 — Pre-operational (minimum passing; limited phraseology, restricted ops)</option>
                                        <option value="ELP Level 4">Level 4 — Operational (ICAO standard; required for international flight ops)</option>
                                        <option value="ELP Level 5">Level 5 — Extended (above standard; handles complex ATC exchanges, non-routine)</option>
                                        <option value="ELP Level 6">Level 6 — Expert (native/near-native; no retest required, lifetime validity)</option>
                                    </select>
                                    </div>
                                    )}
                                </div>
                                {/* Aeromedical Class */}
                                <div className="mb-6">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Aeromedical Class <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                        {medicalClass && medicalClass !== '__none__' && <span style={{ fontSize: '10px', color: '#ffffff', fontWeight: 700, background: 'rgba(255,255,255,0.1)', padding: '2px 8px', borderRadius: '10px' }}>Selected</span>}
                                    </div>
                                    {/* None required checkbox */}
                                    {occupation !== 'None / No Licence' && (() => {
                                        const isNone = medicalClass === '__none__';
                                        return (
                                            <button key="none" type="button"
                                                onClick={() => setMedicalClass(isNone ? '' : '__none__')}
                                                className="mb-3"
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 10px', width: '100%', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)', transition: 'all 0.15s' }}>None required — I don't hold a medical certificate</span>
                                            </button>
                                        );
                                    })()}
                                    {medicalClass !== '__none__' && (
                                    <div style={{ display: 'flex', alignItems: 'center', marginTop: '8px' }}>
                                    <select
                                        value={medicalClass}
                                        onChange={e => setMedicalClass(e.target.value)}
                                        style={{ width: '100%', padding: '6px 12px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '12px', fontSize: '12px', lineHeight: '1.4', color: medicalClass ? '#ffffff' : '#94a3b8', background: 'rgba(0,0,0,0.2)', colorScheme: 'dark', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}
                                    >
                                        <option value="">Select aeromedical class...</option>
                                        <option value="Class 1">Class 1 — Airline Transport Pilots (ATPs). Most stringent standards: comprehensive vision, cardiovascular, and neurological evaluations. Valid 12 months (6 months if age 40+).</option>
                                        <option value="Class 2">Class 2 — Commercial pilots, flight engineers, navigators. Thorough physical exam for commercial duties. Valid 12 months.</option>
                                        <option value="Class 3">Class 3 — Student, recreational, and private pilots. Basic medical standard for safe flight. Valid 60 months under 40; 24 months if 40+.</option>
                                    </select>
                                    </div>
                                    )}
                                </div>
                                {/* Radio License */}
                                <div className="mb-6">
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '16px', marginBottom: '8px' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 600, color: '#94a3af', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Radio License <span style={{ color: 'rgba(255,255,255,0.5)', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                    </div>
                                    <button type="button" onClick={() => setRadioLicense(!radioLicense)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', width: '100%', background: radioLicense ? 'rgba(34,197,94,0.08)' : 'transparent', border: `1px solid ${radioLicense ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${radioLicense ? '#22c55e' : 'rgba(255,255,255,0.3)'}`, background: radioLicense ? '#22c55e' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                            {radioLicense && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                                        </span>
                                        <span style={{ fontSize: '13px', fontWeight: radioLicense ? 600 : 500, color: radioLicense ? '#22c55e' : '#ffffff' }}>I hold a valid Radio Telephone Operator license</span>
                                    </button>
                                </div>
                                {/* Eligibility notice hidden on Step 3 to prevent overflow */}
                                </>)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '24px' }}>
                                    <button type="button" onClick={() => { setStep3Subview('overview'); setSetupStage(2); }} className="px-6 py-2.5 h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setStep3Subview('overview'); setSetupStage(4); setStageTransition('idle'); }, 280); }} disabled={occupation !== 'None / No Licence' && (aircraftTypes.length === 0 || ratings.length === 0)} className="px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>)}
                                {step3Subview === 'aircraft' && (
                                <>
                                {/* ── AIRCRAFT CLASS SUB-VIEW ── */}
                                <div className="border-b border-white/10 pb-3 mb-3">
                                    <div style={{ marginBottom: '12px' }}>
                                        <button type="button" onClick={() => setStep3Subview('overview')} className="text-white/60 hover:text-white text-sm font-medium transition-colors">← Back to Overview</button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Aircraft Class / Type</h3>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Select all classifications that apply to your license</p>
                                    
                                    {/* None required checkbox */}
                                    {(() => {
                                        const isNone = aircraftTypes.includes('__none__');
                                        return (
                                            <button type="button" onClick={() => setAircraftTypes(isNone ? [] : ['__none__'])}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I'm not yet operating aircraft</span>
                                            </button>
                                        );
                                    })()}
                                    
                                    {/* 2-column selection grid */}
                                    {!aircraftTypes.includes('__none__') && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                                            {['Single Engine Land (SEL)', 'Multi-Engine Land (MEL)', 'Rotorcraft — Helicopter', 'Multi-Engine Sea (MES)', 'Single Engine Sea (SES)', 'Rotorcraft — Gyroplane', 'Glider', 'Powered Lift', 'Light Sport (LSA)', 'eVTOL / Powered Lift', 'Lighter-Than-Air', 'UAS / Drone', 'Turboprop', 'Experimental / Homebuilt'].map(cls => {
                                                const isSel = aircraftTypes.includes(cls);
                                                const match = cls.match(/^(.+?)(?:\s*—\s*|\s*\()([^)]+)\)?$/);
                                                const name = match ? match[1] : cls;
                                                const abbr = match ? match[2] : '';
                                                return (
                                                    <button key={cls} type="button"
                                                        className={`selection-card ${isSel ? 'selected' : ''}`}
                                                        onClick={() => setAircraftTypes(prev => isSel ? prev.filter(t => t !== cls) : [...prev, cls])}>
                                                        <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{name}</div>
                                                        {abbr && <div style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{abbr}</div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors">← Cancel</button>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Return</button>
                                </div>
                                </>)}
                                {step3Subview === 'ratings' && (
                                <>
                                {/* ── OPERATIONAL RATINGS SUB-VIEW ── */}
                                <div className="border-b border-white/10 pb-3 mb-3">
                                    <div style={{ marginBottom: '12px' }}>
                                        <button type="button" onClick={() => setStep3Subview('overview')} className="text-white/60 hover:text-white text-sm font-medium transition-colors">← Back to Overview</button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Operational Ratings</h3>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Select all ratings that apply to your license</p>
                                    
                                    {/* None required checkbox */}
                                    {(() => {
                                        const isNone = ratings.includes('__none__');
                                        return (
                                            <button type="button" onClick={() => setRatings(isNone ? [] : ['__none__'])}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I don't hold any ratings yet</span>
                                            </button>
                                        );
                                    })()}
                                    
                                    {/* 2-column selection grid */}
                                    {!ratings.includes('__none__') && (
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '24px' }}>
                                            {['Instrument Rating (IR)', 'Night Rating', 'Multi-Engine Rating (ME)', 'Seaplane Rating', 'Aerobatic Rating', 'Mountain Rating', 'Flight Instructor (CFI)', 'Check Airman', 'ATPL Frozen', 'EBT Qualified', 'Type Rating Instructor (TRI)', 'Type Rating Examiner (TRE)'].map(rating => {
                                                const isSel = ratings.includes(rating);
                                                const match = rating.match(/^(.+?)(?:\s*\()([^)]+)\)?$/);
                                                const name = match ? match[1] : rating;
                                                const abbr = match ? match[2] : '';
                                                return (
                                                    <button key={rating} type="button"
                                                        className={`selection-card ${isSel ? 'selected' : ''}`}
                                                        onClick={() => setRatings(prev => isSel ? prev.filter(r => r !== rating) : [...prev, rating])}>
                                                        <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{name}</div>
                                                        {abbr && <div style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{abbr}</div>}
                                                    </button>
                                                );
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors">← Cancel</button>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Return</button>
                                </div>
                                </>)}
                                {step3Subview === 'typeRatings' && (
                                <>
                                {/* ── TYPE RATINGS SUB-VIEW ── */}
                                <div className="border-b border-white/10 pb-3 mb-3">
                                    <div style={{ marginBottom: '12px' }}>
                                        <button type="button" onClick={() => setStep3Subview('overview')} className="text-white/60 hover:text-white text-sm font-medium transition-colors">← Back to Overview</button>
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-1">Type Ratings Held</h3>
                                    <p style={{ fontSize: '12px', color: 'rgba(255,255,255,0.5)', marginBottom: '16px' }}>Select aircraft type ratings or add custom entries</p>
                                    
                                    {/* None required checkbox */}
                                    {(() => {
                                        const isNone = typeRatings.includes('__none__');
                                        return (
                                            <button type="button" onClick={() => setTypeRatings(isNone ? [] : ['__none__'])}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I don't hold any type ratings</span>
                                            </button>
                                        );
                                    })()}
                                    
                                    {/* 2-column selection grid */}
                                    {!typeRatings.includes('__none__') && (
                                        <>
                                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', marginBottom: '16px' }}>
                                            {['A320', 'A220', 'B737', 'B747', 'A350', 'B777', 'ATR72', 'E190', 'B787', 'A330', 'DHC-8', 'CRJ900'].map(t => {
                                                const isSel = typeRatings.includes(t);
                                                return (
                                                    <button key={t} type="button"
                                                        className={`selection-card ${isSel ? 'selected' : ''}`}
                                                        onClick={() => { if (!isSel) { setTypeRatings(prev => [...prev, t]); } else { setTypeRatings(prev => prev.filter(r => r !== t)); } }}>
                                                        <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                        <div style={{ fontSize: '12px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{t}</div>
                                                        <div style={{ fontSize: '10px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Type Rating</div>
                                                    </button>
                                                );
                                            })}
                                        </div>
                                        {/* Custom input */}
                                        <div style={{ display: 'flex', gap: '6px', marginBottom: '8px' }}>
                                            <input className="fic-input" type="text" value={typeRatingInput} onChange={e => setTypeRatingInput(e.target.value)}
                                                onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && typeRatingInput.trim()) { e.preventDefault(); const val = typeRatingInput.trim().toUpperCase(); if (!typeRatings.includes(val)) setTypeRatings(prev => [...prev, val]); setTypeRatingInput(''); } }}
                                                placeholder="e.g. A320, B737, ATR72 — press Enter" style={{ flex: 1 }} />
                                            <button type="button" onClick={() => { const val = typeRatingInput.trim().toUpperCase(); if (val && !typeRatings.includes(val)) { setTypeRatings(prev => [...prev, val]); setTypeRatingInput(''); } }}
                                                disabled={!typeRatingInput.trim()}
                                                style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: typeRatingInput.trim() ? 'pointer' : 'not-allowed', opacity: typeRatingInput.trim() ? 1 : 0.4 }}>+ Add</button>
                                        </div>
                                        </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-xl text-sm transition-colors">← Cancel</button>
                                    <button type="button" onClick={() => setStep3Subview('overview')} className="px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Return</button>
                                </div>
                                </>)}
                                </>
                                )}

                                
                                {setupStage === 4 && (
                                <>
                                {occupation === 'None / No Licence' ? (
                                <>
                                <div className="border-b border-white/10 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-white mb-2">PilotCareerPathways.com</h3>
                                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                        Your first step into aviation starts with knowing the path. PilotCareerPathways.com is a dedicated resource that breaks down exactly how to become a pilot — from zero experience to airline ready. Explore training routes, understand ATO requirements, compare costs across regions, and build a realistic timeline for your career.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', backdropFilter: 'blur(10px)' }}>
                                        <div style={{ height: '180px', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em', marginBottom: '6px' }}>pilotcareerpathways.com</div>
                                                <div style={{ fontSize: '10px', color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Homepage Preview</div>
                                            </div>
                                            <div style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Discover how to become a pilot</p>
                                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.55', margin: 0 }}>Training routes, ATOs, costs, and timelines — everything you need to plan your aviation career.</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                        <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                                            <strong>Why this matters:</strong> Before you invest $50,000+ in flight training, understand what the industry actually expects. This resource shows you the real requirements, not the marketing pitch.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(2)} className="px-6 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(5); setStageTransition('idle'); }, 280); }} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>
                                ) : (
                                <>
                                <div className="border-b border-white/10 pb-6 mb-6 materialize-child stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-white mb-2 materialize-child stagger-1">Pilot Status &amp; Interests</h3>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Are you currently in the aviation industry?</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <select className="fic-select" value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value as any)} style={{ flex: 1, lineHeight: '1.5' }}>
                                            <option value="">Select your current status...</option>
                                            <option value="employed">Actively flying — employed as a pilot</option>
                                            <option value="instructor">Flight instructor — building hours</option>
                                            <option value="transitioning">Looking to transition — ready for next role</option>
                                            <option value="graduate">Recent graduate — seeking first airline opportunity</option>
                                            <option value="unemployed">Between roles — open to new opportunities</option>
                                            <option value="shifted_career">Shifted career due to industry uncertainty — your story matters</option>
                                            <option value="exploring">Exploring pathways — not sure what's next</option>
                                        </select>
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px', marginBottom: '6px' }}>What is your primary career goal?</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <select className="fic-select" value={careerGoal} onChange={e => setCareerGoal(e.target.value)} style={{ flex: 1, color: careerGoal ? '#ffffff' : '#94a3b8', lineHeight: '1.5' }}>
                                            <option value="">Select your target path...</option>
                                            <option value="airline">Commercial Airline — Legacy or Low-Cost Carrier</option>
                                            <option value="cargo">Cargo / Freighter Operations</option>
                                            <option value="corporate">Corporate / VIP / Business Aviation</option>
                                            <option value="charter">Charter / Air Taxi / On-Demand</option>
                                            <option value="instructor">Full-Time Flight Instructor / Examiner</option>
                                            <option value="aerial">Aerial Work — Survey, Patrol, Agriculture</option>
                                            <option value="heli">Helicopter Operations — EMS, Offshore, Tourism</option>
                                            <option value="regional">Regional Airline — Short-Haul Domestic</option>
                                            <option value="expat">Expat Contract — Middle East, Asia, Africa</option>
                                            <option value="undecided">Still exploring — keeping options open</option>
                                        </select>
                                    </div>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginTop: '8px', marginBottom: '6px' }}>Current or Most Recent Role</div>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <select className="fic-select" value={currentRole} onChange={e => setCurrentRole(e.target.value)} style={{ flex: 1, color: currentRole ? '#ffffff' : '#94a3b8', lineHeight: '1.5' }}>
                                            <option value="">Select your most recent role...</option>
                                            <option value="cfi">Flight Instructor (CFI)</option>
                                            <option value="fo">First Officer (FO)</option>
                                            <option value="captain">Captain</option>
                                            <option value="military">Military Pilot</option>
                                            <option value="cadet">Cadet / Trainee</option>
                                            <option value="unemployed">Unemployed / Between Roles</option>
                                            <option value="other">Other</option>
                                        </select>
                                    </div>
                                    <div style={{ marginTop: '8px' }}>
                                        <button type="button" onClick={() => setImmediateAvailable(!immediateAvailable)}
                                            style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', width: '100%', background: immediateAvailable ? 'rgba(34,197,94,0.08)' : 'transparent', border: `1px solid ${immediateAvailable ? 'rgba(34,197,94,0.3)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                            <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '50%', border: `1.5px solid ${immediateAvailable ? '#22c55e' : 'rgba(255,255,255,0.3)'}`, background: immediateAvailable ? '#22c55e' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                {immediateAvailable && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}
                                            </span>
                                            <span style={{ fontSize: '13px', fontWeight: immediateAvailable ? 600 : 500, color: immediateAvailable ? '#22c55e' : '#ffffff' }}>Available for immediate placement</span>
                                        </button>
                                    </div>
                                    <div style={{ marginTop: '8px', padding: '10px 12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '14px' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#166534', lineHeight: 1.5 }}>
                                            <strong style={{ color: '#dc2626' }}>In compliance with pilotshortage.org</strong> — Every pilot's journey is unique. Whether you're actively flying, instructing, or navigating a career shift, your experience contributes to the broader aviation story. We make sure pilots get heard and receive the recognition they deserve.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(3)} className="px-6 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(5); setStageTransition('idle'); }, 280); }} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>
                                )}
                                </>
                                )}

                                {/* ── Modal A: Aircraft Class & Privileges ── */}
                                {showAircraftModal && (
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => setShowAircraftModal(false)} />
                                        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Aircraft Class / Type</div>
                                                <button type="button" onClick={() => setShowAircraftModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                            </div>
                                            {(() => {
                                                const isNone = aircraftTypes.includes('__none__');
                                                return (
                                                    <button type="button" onClick={() => setAircraftTypes(isNone ? [] : ['__none__'])}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I'm not yet operating aircraft</span>
                                                    </button>
                                                );
                                            })()}
                                            {!aircraftTypes.includes('__none__') && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                                    {['Single Engine Land (SEL)', 'Multi-Engine Land (MEL)', 'Rotorcraft — Helicopter', 'Multi-Engine Sea (MES)', 'Single Engine Sea (SES)', 'Rotorcraft — Gyroplane', 'Glider', 'Powered Lift', 'Light Sport (LSA)', 'eVTOL / Powered Lift', 'Lighter-Than-Air', 'UAS / Drone', 'Turboprop', 'Experimental / Homebuilt'].map(cls => {
                                                        const isSel = aircraftTypes.includes(cls);
                                                        const match = cls.match(/^(.+?)(?:\s*—\s*|\s*\()([^)]+)\)?$/);
                                                        const name = match ? match[1] : cls;
                                                        const abbr = match ? match[2] : '';
                                                        return (
                                                            <button key={cls} type="button"
                                                                className={`selection-card ${isSel ? 'selected' : ''}`}
                                                                onClick={() => setAircraftTypes(prev => isSel ? prev.filter(t => t !== cls) : [...prev, cls])}>
                                                                <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{name}</div>
                                                                {abbr && <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{abbr}</div>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <button type="button" onClick={() => setShowAircraftModal(false)} className="mt-4 px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Close</button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Modal B: Operational Ratings ── */}
                                {showRatingsModal && (
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => setShowRatingsModal(false)} />
                                        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Operational Ratings</div>
                                                <button type="button" onClick={() => setShowRatingsModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                            </div>
                                            {(() => {
                                                const isNone = ratings.includes('__none__');
                                                return (
                                                    <button type="button" onClick={() => setRatings(isNone ? [] : ['__none__'])}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I don't hold any ratings yet</span>
                                                    </button>
                                                );
                                            })()}
                                            {!ratings.includes('__none__') && (
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                                    {['Instrument Rating (IR)', 'Night Rating', 'Multi-Engine Rating (ME)', 'Seaplane Rating', 'Aerobatic Rating', 'Mountain Rating', 'Flight Instructor (CFI)', 'Check Airman', 'ATPL Frozen', 'EBT Qualified', 'Type Rating Instructor (TRI)', 'Type Rating Examiner (TRE)'].map(rating => {
                                                        const isSel = ratings.includes(rating);
                                                        const match = rating.match(/^(.+?)(?:\s*\()([^)]+)\)?$/);
                                                        const name = match ? match[1] : rating;
                                                        const abbr = match ? match[2] : '';
                                                        return (
                                                            <button key={rating} type="button"
                                                                className={`selection-card ${isSel ? 'selected' : ''}`}
                                                                onClick={() => setRatings(prev => isSel ? prev.filter(r => r !== rating) : [...prev, rating])}>
                                                                <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{name}</div>
                                                                {abbr && <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>{abbr}</div>}
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                            )}
                                            <button type="button" onClick={() => setShowRatingsModal(false)} className="mt-4 px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Close</button>
                                        </div>
                                    </div>
                                )}

                                {/* ── Modal C: Type Ratings Held ── */}
                                {showTypeRatingsModal && (
                                    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }}>
                                        <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(8px)', WebkitBackdropFilter: 'blur(8px)' }} onClick={() => setShowTypeRatingsModal(false)} />
                                        <div style={{ position: 'relative', width: '100%', maxWidth: '900px', maxHeight: '80vh', overflowY: 'auto', background: 'rgba(15,23,42,0.85)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', padding: '20px', display: 'flex', flexDirection: 'column', gap: '12px', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                                                <div style={{ fontSize: '12px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Type Ratings Held</div>
                                                <button type="button" onClick={() => setShowTypeRatingsModal(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', fontSize: '18px', lineHeight: 1, padding: '4px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>×</button>
                                            </div>
                                            {(() => {
                                                const isNone = typeRatings.includes('__none__');
                                                return (
                                                    <button type="button" onClick={() => setTypeRatings(isNone ? [] : ['__none__'])}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginBottom: '16px', background: isNone ? 'rgba(255,255,255,0.08)' : 'transparent', border: `1px solid ${isNone ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#ffffff' : 'rgba(255,255,255,0.3)'}`, background: isNone ? 'rgba(255,255,255,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>None required — I don't hold any type ratings</span>
                                                    </button>
                                                );
                                            })()}
                                            {!typeRatings.includes('__none__') && (
                                                <>
                                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '8px', marginTop: '16px', marginBottom: '24px' }}>
                                                    {['A320', 'A220', 'B737', 'B747', 'A350', 'B777', 'ATR72', 'E190', 'B787', 'A330', 'DHC-8', 'CRJ900'].map(t => {
                                                        const isSel = typeRatings.includes(t);
                                                        return (
                                                            <button key={t} type="button"
                                                                className={`selection-card ${isSel ? 'selected' : ''}`}
                                                                onClick={() => { if (!isSel) { setTypeRatings(prev => [...prev, t]); } else { setTypeRatings(prev => prev.filter(r => r !== t)); } }}>
                                                                <div className="card-check">{isSel && <span style={{ color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>}</div>
                                                                <div style={{ fontSize: '13px', fontWeight: 600, color: '#ffffff', lineHeight: 1.3, paddingRight: '24px' }}>{t}</div>
                                                                <div style={{ fontSize: '11px', fontWeight: 500, color: 'rgba(255,255,255,0.4)', lineHeight: 1.3 }}>Type Rating</div>
                                                            </button>
                                                        );
                                                    })}
                                                </div>
                                                {typeRatings.filter(r => r !== '__none__').length > 0 && (
                                                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                                                        {typeRatings.filter(r => r !== '__none__').map(tr => (
                                                            <span key={tr} style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: 'rgba(255,255,255,0.15)', color: '#fff', borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 600 }}>
                                                                {tr}
                                                                <button type="button" onClick={() => setTypeRatings(prev => prev.filter(r => r !== tr))} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.5)', cursor: 'pointer', padding: '0', fontSize: '12px', lineHeight: 1 }}>×</button>
                                                            </span>
                                                        ))}
                                                    </div>
                                                )}
                                                <div style={{ display: 'flex', gap: '6px' }}>
                                                    <input className="fic-input" type="text" value={typeRatingInput} onChange={e => setTypeRatingInput(e.target.value)}
                                                        onKeyDown={e => { if ((e.key === 'Enter' || e.key === ',') && typeRatingInput.trim()) { e.preventDefault(); const val = typeRatingInput.trim().toUpperCase(); if (!typeRatings.includes(val)) setTypeRatings(prev => [...prev, val]); setTypeRatingInput(''); } }}
                                                        placeholder="e.g. A320, B737, ATR72 — press Enter" style={{ flex: 1 }} />
                                                    <button type="button" onClick={() => { const val = typeRatingInput.trim().toUpperCase(); if (val && !typeRatings.includes(val)) { setTypeRatings(prev => [...prev, val]); setTypeRatingInput(''); } }}
                                                        disabled={!typeRatingInput.trim()}
                                                        style={{ padding: '8px 12px', background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '10px', color: '#fff', fontSize: '12px', fontWeight: 600, cursor: typeRatingInput.trim() ? 'pointer' : 'not-allowed', opacity: typeRatingInput.trim() ? 1 : 0.4 }}>+ Add</button>
                                                </div>
                                                </>
                                            )}
                                            <button type="button" onClick={() => setShowTypeRatingsModal(false)} className="mt-4 px-6 py-2.5 h-10 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20">Save &amp; Close</button>
                                        </div>
                                    </div>
                                )}

                                {setupStage === 5 && (
                                <>
                                {occupation === 'None / No Licence' ? (
                                <>
                                <div className="border-b border-white/10 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-white mb-2">PilotShortage.org</h3>
                                    <p style={{ fontSize: '13px', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                                        The aviation industry is facing a critical shortage of qualified pilots worldwide. PilotShortage.org explains why this gap exists, what it means for your career prospects, and how you can position yourself to meet the demand. Understanding the industry landscape before you train gives you a strategic advantage.
                                    </p>
                                    <div style={{ display: 'flex', flexDirection: 'column', background: 'rgba(255,255,255,0.5)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', backdropFilter: 'blur(10px)' }}>
                                        <div style={{ height: '180px', background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4338ca 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                                            <div style={{ textAlign: 'center' }}>
                                                <div style={{ fontSize: '16px', fontWeight: 800, color: '#fff', letterSpacing: '0.04em', marginBottom: '6px' }}>pilotshortage.org</div>
                                                <div style={{ fontSize: '10px', color: '#a5b4fc', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Homepage Preview</div>
                                            </div>
                                            <div style={{ position: 'absolute', top: '10px', right: '12px', width: '8px', height: '8px', borderRadius: '50%', background: '#22c55e' }} />
                                        </div>
                                        <div style={{ padding: '16px' }}>
                                            <p style={{ fontSize: '12px', fontWeight: 700, color: '#0f172a', marginBottom: '6px' }}>Understand the global pilot shortage</p>
                                            <p style={{ fontSize: '11px', color: '#64748b', lineHeight: '1.55', margin: 0 }}>Industry gap analysis, pipeline breakdown, and why qualified pilots are the key to solving aviation's biggest challenge.</p>
                                        </div>
                                    </div>
                                    <div style={{ padding: '12px 14px', background: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.5)', borderRadius: '12px', backdropFilter: 'blur(10px)' }}>
                                        <p style={{ fontSize: '11px', color: '#475569', lineHeight: 1.55, margin: 0 }}>
                                            <strong>Why this matters:</strong> The pilot shortage isn't just a headline — it's your opportunity. Airlines are hiring aggressively, and the demand for trained pilots will outstrip supply for decades. Train smart, and you'll enter a seller's market.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(4)} className="px-6 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(6); setStageTransition('idle'); }, 280); }} className="px-8 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-lg text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>
                                ) : (
                                <>
                                {/* ── SECTION 3: Flight Hours & Logbook ── */}
                                <div className="border-b border-white/10 pb-6 mb-6 materialize-child stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-white mb-2 materialize-child stagger-1">Flight Hours &amp; Logbook</h3>

                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px', lineHeight: '1.6', paddingBottom: '2px' }}>Estimated Total Flight Hours <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none', fontSize: '10px' }}>(optional — you can skip)</span></div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                                        <input className="fic-input" type="number" min="0" max="99999" value={hoursWhole} onChange={e => setHoursWhole(e.target.value)} placeholder="250" style={{ width: '100%', lineHeight: '1.5' }} />
                                    </div>
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0, display: 'flex', alignItems: 'center', paddingTop: '3px' }}>HRS</span>
                                    <div style={{ display: 'flex', alignItems: 'center' }}>
                                        <input className="fic-input" type="number" min="0" max="59" value={hoursMinutes} onChange={e => setHoursMinutes(e.target.value)} placeholder="00" style={{ maxWidth: '70px', textAlign: 'center', lineHeight: '1.5' }} />
                                    </div>
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0, display: 'flex', alignItems: 'center', paddingTop: '3px' }}>MIN</span>
                                </div>
                                {/* Claim disclaimer */}
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
                                    <span style={{ fontSize: '13px', flexShrink: 0 }}>⚠️</span>
                                    <span style={{ fontSize: '11px', color: '#0f172a', lineHeight: 1.5 }}>
                                        Total hours entered here are a <strong style={{ color: '#0f172a' }}>self-declared claim</strong> and are not verified. Hours will remain unverified until audit under <strong style={{ color: '#0f172a' }}>Recognition+</strong>.
                                    </span>
                                </div>
                                {/* Logbook — Recognition+ notice */}
                                <div style={{ borderTop: '1px solid rgba(255,255,255,0.08)', paddingTop: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '11px', fontWeight: 700, color: '#f59e0b', letterSpacing: '0.05em', textTransform: 'uppercase', lineHeight: '1.6', paddingBottom: '2px' }}>
                                        <span>⚠️</span>
                                        <span>Logbook Upload — Recognition+ Only</span>
                                    </div>
                                    <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.5)', lineHeight: 1.55, margin: 0 }}>
                                        Uploading your logbook is strictly reserved for <strong style={{ color: '#38bdf8' }}>Recognition+</strong> members. Public data privacy concerns restrict logbook access to pilots who have paid for storage, verification, and audit protection through our verified partner network.
                                    </p>
                                                                        {/* Glassy logbook preview table */}
                                    <div style={{ marginTop: '6px', padding: '14px 16px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '14px', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)', overflow: 'hidden' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                                            <span style={{ fontSize: '12px' }}>📘</span>
                                            <span style={{ fontSize: '10px', fontWeight: 700, color: 'rgba(148,163,184,0.7)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Typical Log Entry</span>
                                            <span style={{ marginLeft: 'auto', fontSize: '10px', fontWeight: 700, color: '#94a3b8', letterSpacing: '0.05em' }}>⚙️ AUDIT REPORT</span>
                                        </div>
                                        <div style={{ display: 'grid', gridTemplateColumns: '52px 120px 56px 56px 1fr 90px', gap: '4px', fontSize: '10px', lineHeight: 1.4 }}>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>DATE</div>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>AIRCRAFT</div>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center', whiteSpace: 'nowrap' }}>DUR</div>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>PIC</div>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>REMARKS & NOTARY</div>
                                            <div style={{ color: '#94a3b8', fontWeight: 600, letterSpacing: '0.04em', padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.06)', textAlign: 'center' }}>AUDIT STATUS</div>

                                            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>18 JUN</div>
                                            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)' }}>RPX123 · C172</div>
                                            <div style={{ color: 'rgba(255,255,255,0.85)', fontWeight: 500, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontFamily: 'monospace', whiteSpace: 'nowrap' }}>1:30</div>
                                            <div style={{ color: '#f59e0b', fontWeight: 700, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontFamily: 'monospace', background: 'rgba(255,255,255,0.06)' }}>1:30 ⚠️</div>
                                            <div style={{ color: 'rgba(255,255,255,0.6)', fontWeight: 400, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', fontSize: '9px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>Cross-country dual. Right seat entry logged.</span>
                                                <span style={{ whiteSpace: 'nowrap', color: '#22c55e', fontWeight: 700, fontSize: '9px', background: 'rgba(34,197,94,0.1)', padding: '2px 8px', borderRadius: '10px', border: '1px solid rgba(34,197,94,0.2)', display: 'flex', alignItems: 'center', gap: '4px' }}>🔔 ATO NOTARY RECEIVED</span>
                                            </div>
                                            <div style={{ color: '#f59e0b', fontWeight: 700, padding: '6px 6px', borderBottom: '1px solid rgba(255,255,255,0.04)', textAlign: 'center', fontSize: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px' }}>
                                                <span>🚩</span>
                                                <span>FLAGGED</span>
                                            </div>
                                        </div>
                                        {!atoAuditPending ? (
                                        <div style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.12)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>🚩</span>
                                                <div>
                                                    <p style={{ fontSize: '10px', color: '#ef4444', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.4 }}>Right seat discrepancy detected</p>
                                                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                                                        Our automated system flagged <strong style={{ color: '#f59e0b' }}>1:30 PIC hours</strong> logged on a dual training flight. We are cross-referencing this entry with your ATO&apos;s training records to verify if you were acting as Sole Manipulator or safety pilot.
                                                    </p>
                                                </div>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => { setAtoAuditRequested(true); setAtoAuditPending(true); }}
                                                style={{ alignSelf: 'flex-start', padding: '6px 14px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', color: '#ef4444', fontSize: '10px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: '8px' }}
                                            >
                                                <span>🔍</span>
                                                <span>Request ATO Verification</span>
                                            </button>
                                        </div>
                                        ) : (
                                        <div style={{ marginTop: '8px', padding: '10px 12px', background: 'rgba(56,189,248,0.06)', border: '1px solid rgba(56,189,248,0.15)', borderRadius: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                                                <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '2px' }}>⏳</span>
                                                <div>
                                                    <p style={{ fontSize: '10px', color: '#38bdf8', fontWeight: 700, margin: '0 0 4px', lineHeight: 1.4 }}>ATO Audit in Progress</p>
                                                    <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.5)', margin: 0, lineHeight: 1.5 }}>
                                                        Verification request sent to your ATO notary partner. We are reconciling logged PIC hours against the official training record. You will be notified once the audit completes — typically within 24-48 hours.
                                                    </p>
                                                </div>
                                            </div>
                                            <div style={{ alignSelf: 'flex-start', padding: '6px 14px', background: 'rgba(56,189,248,0.08)', border: '1px solid rgba(56,189,248,0.2)', borderRadius: '8px', color: '#38bdf8', fontSize: '10px', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                                                <span>🔄</span>
                                                <span>Pending ATO / Operator</span>
                                            </div>
                                        </div>
                                        )}
                                    </div>
                                </div>
                                <div style={{ marginTop: '8px' }}>
                                    <button type="button" onClick={() => setHoursCertified(!hoursCertified)}
                                        style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 12px', width: '100%', background: hoursCertified ? 'rgba(255,255,255,0.04)' : 'transparent', border: `1px solid ${hoursCertified ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)'}`, borderRadius: '14px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${hoursCertified ? '#dc2626' : 'rgba(255,255,255,0.3)'}`, background: hoursCertified ? 'rgba(220,38,38,0.2)' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                            {hoursCertified && <span style={{ color: '#dc2626', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                        </span>
                                        <span style={{ fontSize: '12px', fontWeight: hoursCertified ? 600 : 500, color: hoursCertified ? '#ffffff' : 'rgba(255,255,255,0.6)' }}>I certify these hours are accurate, subject to the resolution of pending ATO / operator audits</span>
                                    </button>
                                </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(4)} className="px-6 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button type="button" onClick={() => { setStageTransition('exiting'); setTimeout(() => { setSetupStage(6); setStageTransition('idle'); }, 280); }} disabled={!hoursCertified} className="px-8 py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-red-600 text-white font-bold rounded-lg text-sm tracking-wide transition-colors shadow-lg shadow-red-600/20 btn-ripple hover-lift glow-active">Next →</button>
                                </div>
                                </>
                                )}
                                </>
                                )}

                                {setupStage === 6 && (
                                <>
                                <div className="pb-6 mb-6 materialize-child stagger-1" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {occupation === 'None / No Licence' ? (
                                    <>
                                    <h3 className="text-lg font-bold text-white mb-0 materialize-child stagger-1">Create Visitor Account</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        You're registering as a <strong>Future Pilot Visitor</strong>. Explore career pathways, training routes, and industry requirements. Upgrade to a full profile once you earn your licence.
                                    </p>
                                    <div style={{ padding: '14px', background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '10px' }}>
                                        <p style={{ fontSize: '12px', color: '#92400e', margin: 0, lineHeight: 1.5 }}>
                                            <strong>What's included:</strong> Public career pathways, ATO directory, and pilot shortage insights. Full operator access requires a verified licence.
                                        </p>
                                    </div>
                                    </>
                                    ) : (
                                    <>
                                    <h3 className="text-lg font-bold text-white mb-0 materialize-child stagger-1">Create Your Profile</h3>
                                    {/* Floating passkey notice bar */}
                                    <div style={{ display: 'flex', gap: '8px', alignItems: 'flex-start', padding: '10px 12px', background: 'rgba(15,23,42,0.6)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '10px', backdropFilter: 'blur(8px)' }}>
                                        <span style={{ fontSize: '14px', lineHeight: 1, flexShrink: 0 }}>🔐</span>
                                        <div>
                                            <p style={{ fontSize: '11px', fontWeight: 700, color: '#ffffff', margin: '0 0 2px' }}>Your browser will prompt you to save a passkey</p>
                                            <p style={{ fontSize: '10px', color: '#e2e8f0', margin: 0, lineHeight: 1.4 }}>Without this key you will lose access to your profile credentials. Save it to Touch ID, Face ID, or Google Password Manager when prompted.</p>
                                        </div>
                                    </div>
                                    {/* Cinematic passkey trailer — floating on dark glass */}
                                    <div style={{ width: '100%', aspectRatio: '21 / 9', overflow: 'hidden', marginTop: '16px', marginBottom: '24px', position: 'relative', borderRadius: '12px', background: 'radial-gradient(ellipse at 50% 100%, #0f172a 0%, #020617 60%, #000000 100%)', border: '1px solid rgba(30,58,95,0.4)', boxShadow: 'inset 0 0 40px rgba(30,58,95,0.2), 0 0 20px rgba(30,58,95,0.15)' }}>
                                        {/* Radar sweep rings */}
                                        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '180px', height: '180px', borderRadius: '50%', border: '1px solid rgba(56,189,248,0.15)', boxShadow: '0 0 30px rgba(56,189,248,0.1), inset 0 0 30px rgba(56,189,248,0.05)', zIndex: 1 }} />
                                        <div style={{ position: 'absolute', top: '55%', left: '50%', transform: 'translate(-50%, -50%)', width: '260px', height: '260px', borderRadius: '50%', border: '1px solid rgba(56,189,248,0.08)', zIndex: 1 }} />
                                        {/* Subtle grid */}
                                        <div style={{ position: 'absolute', inset: 0, backgroundImage: 'linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px)', backgroundSize: '20px 20px', opacity: 0.5, zIndex: 1 }} />
                                        {/* Phone/hand image — fills container with cover crop, no black bars */}
                                        <img src="/trailer1.png" alt="Passkey setup prompt" style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'center', position: 'relative', zIndex: 2 }} />
                                    </div>
                                    <p style={{ fontSize: '14px', color: '#9ca3af', lineHeight: 1.6, margin: 0, textAlign: 'center' }}>
                                        Confirm your details to activate your verified pilot profile. Operators and airlines can then discover your credentials instantly.
                                    </p>
                                    </>
                                    )}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '16px' }}>
                                    <button type="button" onClick={() => setSetupStage(5)} className="px-6 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift">← Back</button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors btn-ripple hover-lift glow-active"
                                    >
                                        {saving ? 'Creating...' : (occupation === 'None / No Licence' ? 'Create Visitor Account →' : 'Create Profile →')}
                                    </button>
                                </div>
                                </>
                                )}
                                </div>{/* end materialize-stage wrapper */}
                            </div>{/* end card inner */}
                        </div>{/* end card outer */}

                        {saveError && <p style={{ color: '#dc2626', fontSize: '11px', margin: '8px 0 0', textAlign: 'center' }}>{saveError}</p>}

                        {/* Footer */}
                        <div style={{ marginTop: '20px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Secure Connection</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                <span style={{ color: '#7dd3fc', fontSize: '11px', fontWeight: 600 }}>Powered by Cloudflare</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                <span style={{ color: '#ef4444', fontSize: '11px', fontWeight: 600 }}>PIC by PilotRecognition</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flexWrap: 'wrap', gap: '4px 16px', marginTop: '16px' }}>
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
                    <div className="relative z-10 w-full max-w-4xl bg-slate-900 border border-white/10 rounded-2xl p-8 shadow-2xl materialize-child stagger-1" onClick={(e) => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-white font-black text-base">Connect Logbook Provider</h3>
                                <p className="text-white/40 text-xs mt-0.5">Select your digital logbook to verify flight hours</p>
                            </div>
                            <button onClick={() => setShowLogbookModal(false)} className="text-white/40 hover:text-white text-xl leading-none transition-colors">×</button>
                        </div>
                        <div className="mb-5">
                            <button
                                onClick={() => setSelectedProvider('MyFlightBook')}
                                className={`group relative flex flex-row items-center gap-4 px-4 py-4 pr-6 rounded-xl border transition-all duration-200 text-left w-full cursor-pointer ${
                                    selectedProvider === 'MyFlightBook'
                                        ? 'bg-white shadow-lg shadow-red-500/20'
                                        : 'border-white/10 bg-white/[0.03] backdrop-blur-sm hover:bg-white/[0.06] hover:border-white/25'
                                }`}
                                style={selectedProvider === 'MyFlightBook' ? { borderColor: '#dc2626' } : {}}
                            >
                                <span className="flex-shrink-0 w-12 h-12 flex items-center justify-center">
                                    <img src="https://myflightbook.com/logbook/Images/mfblogonew.png" alt="MyFlightBook" className="w-12 h-12 object-contain rounded" />
                                </span>
                                <div className="flex-1 min-w-0 flex flex-col justify-center">
                                    <div className="flex items-center gap-1.5">
                                        <span className={`text-sm font-bold leading-relaxed ${selectedProvider === 'MyFlightBook' ? 'text-slate-800' : 'text-white group-hover:text-slate-800'}`}>MyFlightBook</span>
                                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500/30">Free</span>
                                    </div>
                                    <span className={`text-[10px] leading-relaxed ${selectedProvider === 'MyFlightBook' ? 'text-slate-400' : 'text-white/40 group-hover:text-slate-400'}`}>
                                        Global · Default logbook
                                    </span>
                                </div>
                                <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
                                    <span className={`text-[10px] font-semibold ${selectedProvider === 'MyFlightBook' ? 'text-slate-500' : 'text-[#00b4d8]'}`}>OAuth 2.0</span>
                                    {selectedProvider === 'MyFlightBook' && (
                                        <span className="w-2.5 h-2.5 rounded-full bg-[#00b4d8]" />
                                    )}
                                </div>
                            </button>
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
                            className={`w-full py-3 rounded-xl font-black text-sm tracking-wide transition-all ${
                                selectedProvider
                                    ? 'bg-[#dc2626] hover:bg-[#b91c1c] text-white shadow-lg shadow-red-600/20'
                                    : 'bg-white/5 border border-white/10 text-white/30 cursor-not-allowed'
                            }`}
                        >
                            {selectedProvider ? 'Connect via MyFlightBook →' : 'Select MyFlightBook'}
                        </button>
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
                                            
                                            // For Pilot Wallet — VC issuance is post-verification (Dodo + Veremark pipeline)
                                            if (w.id === 'pilot') {
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
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 15%, rgba(30,58,95,0.35) 0%, transparent 60%)' }} />
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                <style>{`
                    @keyframes glassMaterialize {
                        0% {
                            opacity: 0;
                            transform: scale(0.92) translateY(20px);
                            filter: blur(12px);
                        }
                        60% {
                            opacity: 1;
                            transform: scale(1.01) translateY(-2px);
                            filter: blur(2px);
                        }
                        100% {
                            opacity: 1;
                            transform: scale(1) translateY(0);
                            filter: blur(0px);
                        }
                    }
                    @keyframes borderGlow {
                        0% {
                            box-shadow: 0 0 0 rgba(255,255,255,0), inset 0 1px 0 rgba(255,255,255,0);
                            border-color: rgba(255,255,255,0.05);
                        }
                        100% {
                            box-shadow: 0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1);
                            border-color: rgba(255,255,255,0.15);
                        }
                    }
                `}</style>

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

                <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-8 overflow-hidden" style={{ minHeight: 'calc(100vh + 1px)' }}>
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">

                        {/* Left: Hero text */}
                        <div className="flex-1 text-left md:pt-12" style={{ animation: 'glassMaterialize 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-3 text-white">
                                Connecting Pilots<br />
                                <span className="text-red-500">to the Industry.</span>
                            </h1>
                            <p className="text-white/70 text-sm font-light mb-6">One <span className="text-red-500">account</span> across all platforms. Access your pilot profile, pathways, and recognition credentials wherever you fly.</p>

                            {/* Platform bullets */}
                            <div className="flex flex-col gap-3 mb-8">
                                <div>
                                    <p className="text-white text-base font-bold leading-tight">
                                        pilot<span className="text-red-500">career</span>pathways.com
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">Career Recognition</p>
                                </div>
                                <div>
                                    <p className="text-white text-base font-bold leading-tight">
                                        pilot<span className="text-red-500">shortage</span>.org
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">Association</p>
                                </div>
                                <div>
                                    <p className="text-white text-base font-bold leading-tight">
                                        pilot<span className="text-red-500">recognition</span>.com
                                    </p>
                                    <p className="text-slate-400 text-sm mt-1">Verification</p>
                                </div>
                            </div>

                        </div>

                        {/* Right: Signup card */}
                        <div className="w-full md:w-[400px] flex-shrink-0" style={{ animation: 'glassMaterialize 0.9s cubic-bezier(0.22, 1, 0.36, 1) 0.15s forwards', opacity: 0 }}>

                        <p className="text-white font-bold text-base mb-3 text-center">Create a Free Account</p>

                        {/* Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm" style={{ animation: 'borderGlow 1.2s ease-out 0.3s forwards' }}>

                            {/* Google signup */}
                            <button
                                onClick={handleGoogleOAuth}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-3 shadow-sm"
                            >
                                <GoogleIcon />
                                <span>Sign up with Google</span>
                                <span className="w-[18px] flex-shrink-0" aria-hidden="true" />
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
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 py-0.5 bg-[#0f172a] text-slate-400 text-xs rounded-full border border-white/10">or</span>
                                </div>
                            </div>

                            {/* Email/password signup via Auth0 Universal Login */}
                            <button
                                onClick={handleEmailSignup}
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-blue-600/20"
                            >
                                Sign up with Email
                            </button>

                            {/* Passive consent statement */}
                            <p className="text-[#d1d5db] text-[11px] text-center mt-3 leading-relaxed">
                                By continuing you confirm you are 16+ and agree to our{' '}
                                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Terms of Service</a>,{' '}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Privacy Policy</a>, and{' '}
                                <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">Data Controller Agreement</a>.
                            </p>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                            </div>

                            {/* What you get */}
                            <ul className="space-y-2.5 mb-6 px-1">
                                {[
                                    { label: 'Verified Recognition Profile', tip: 'Authenticate your flight hours, licenses, and credentials to establish a high-trust professional identity.' },
                                    { label: 'Pathway Alignment & Mapping', tip: 'Align your profile with active industry pathways to signal your readiness and career availability.' },
                                    { label: 'Direct Network Connections', tip: 'Allow verified network partners to request direct professional contact with your profile.' },
                                    { label: 'ATLAS Professional CV Builder', tip: 'Standardize your aviation metrics and competencies into a clean, consultant-grade portfolio.' },
                                ].map((item) => (
                                    <li key={item.label} className="group relative flex items-center gap-2.5 text-sm text-white cursor-default">
                                        <span className="w-4 h-4 flex items-center justify-center flex-shrink-0 text-emerald-400">
                                            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <path d="M2.5 7.5L5.5 10.5L11.5 4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                                            </svg>
                                        </span>
                                        {item.label}
                                        {/* Tooltip */}
                                        <div className="pointer-events-none absolute left-0 bottom-full mb-2 w-64 bg-slate-800 border border-white/10 rounded-lg px-3 py-2 text-xs text-white/70 leading-relaxed shadow-xl opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
                                            {item.tip}
                                            <div className="absolute left-3 top-full w-2 h-2 bg-slate-800 border-r border-b border-white/10 rotate-45 -translate-y-1" />
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            {/* Already have account */}
                            <p className="text-center text-sm text-[#d1d5db]">
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
                        <p className="text-center text-xs text-[#9ca3af] mt-4 leading-relaxed">
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
                                    auth0Id={auth0User?.sub || ''}
                                    onCredentialClaimed={(credentialUrl) => {
                                        setVcCredentialUrl(credentialUrl);
                                        setWalletConnected(true);
                                        setSelectedWallet('pilot');
                                        setSetupStage(5);
                                        setShowWalletFirst(false);
                                    }}
                                />
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Passkey Save Modal */}
            {showBiometricNotice && createPortal(
                <div style={{ position: 'fixed', inset: 0, zIndex: 9998, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
                    <div style={{ width: '100%', maxWidth: '420px', background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px 28px', boxShadow: '0 32px 80px rgba(0,0,0,0.6)' }}>
                        {/* Header */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '16px' }}>
                            <div style={{ width: '48px', height: '48px', borderRadius: '14px', background: 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <span style={{ fontSize: '22px' }}>🔑</span>
                            </div>
                            <div>
                                <p style={{ fontSize: '17px', fontWeight: 800, color: '#ffffff', margin: 0, lineHeight: 1.2 }}>Save your Passkey</p>
                                <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.4)', margin: '3px 0 0' }}>Used for identification &amp; login</p>
                            </div>
                        </div>

                        {/* What it is */}
                        <p style={{ fontSize: '13px', color: 'rgba(255,255,255,0.65)', lineHeight: 1.65, margin: '0 0 16px' }}>
                            Your passkey is how you'll <strong style={{ color: '#fff' }}>identify yourself and log back in</strong> to your PilotRecognition account. It uses your device's biometrics — Touch ID, Face ID, or Windows Hello — so no password is ever needed.
                        </p>

                        {/* How it works bullets */}
                        <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            {[
                                ['🛡', 'Replaces your password — no credentials to forget or leak'],
                                ['✈️', 'Tied to your Pilot Identity Credential (PIC)'],
                                ['🔒', 'No biometric data leaves your device — ever'],
                            ].map(([icon, text]) => (
                                <div key={text} style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                                    <span style={{ fontSize: '14px', flexShrink: 0, marginTop: '1px' }}>{icon}</span>
                                    <span style={{ fontSize: '12px', color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>{text}</span>
                                </div>
                            ))}
                        </div>

                        {/* Browser prompt preview */}
                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Your browser will show a prompt like this:</p>
                        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                            <img src="/passkey-preview.png" alt="Passkey setup prompt" style={{ width: '100%', maxWidth: '380px', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
                        </div>

                        {/* CTA */}
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
                                            await callApi('registerPasskey', {
                                                user_id: pkUserId,
                                                credential_id: result.id,
                                                public_key: pubKeyBuf ? Array.from(new Uint8Array(pubKeyBuf)) : [],
                                                sign_count: 0,
                                                device_name: deviceName,
                                                transports: (result as any).response?.getTransports?.() ?? [],
                                            });
                                        }
                                    } catch (pe: any) {
                                        console.warn('⚠️ [Passkey] skipped:', pe?.name, pe?.message);
                                    }
                                }
                                window.location.href = '/platform';
                            }}
                            style={{ width: '100%', padding: '14px', borderRadius: '12px', border: 'none', background: '#dc2626', color: '#fff', fontSize: '15px', fontWeight: 700, cursor: 'pointer', letterSpacing: '-0.01em' }}
                        >
                            Save Passkey &amp; Enter Platform →
                        </button>
                        <button
                            onClick={() => { setShowBiometricNotice(false); window.location.href = '/platform'; }}
                            style={{ width: '100%', marginTop: '10px', padding: '11px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: 'rgba(255,255,255,0.35)', fontSize: '12px', fontWeight: 500, cursor: 'pointer' }}
                        >
                            Skip for now — I'll save it later
                        </button>
                        <p style={{ fontSize: '10px', color: 'rgba(255,255,255,0.2)', textAlign: 'center', margin: '12px 0 0' }}>
                            GDPR Art. 9 · Illinois BIPA · PDPA · No biometric data stored server-side
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
                                    window.location.href = '/platform';
                                }}
                                style={{ flex: 1, padding: '11px', borderRadius: '10px', border: 'none', background: recoveryCopied ? '#dc2626' : 'rgba(255,255,255,0.05)', color: recoveryCopied ? '#fff' : 'rgba(255,255,255,0.2)', fontSize: '12px', fontWeight: 700, cursor: recoveryCopied ? 'pointer' : 'not-allowed', transition: 'all 0.2s' }}
                            >
                                I've saved it — Continue →
                            </button>
                        </div>
                    </div>
                </div>
            , document.body)}

            {/* Resource Selector — shown after profile creation */}
            {showResourceSelector && (
                <div style={{ position: 'fixed', inset: 0, background: '#fff', zIndex: 100, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px' }}>
                    <div style={{ maxWidth: '560px', width: '100%', textAlign: 'center' }}>
                        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#0f172a', marginBottom: '8px' }}>Welcome aboard</h2>
                        <p style={{ fontSize: '14px', color: '#64748b', marginBottom: '32px', lineHeight: 1.5 }}>Your profile is ready. Where would you like to go next?</p>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <button
                                type="button"
                                onClick={() => window.open('https://pilotcareerpathways.com', '_blank')}
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #0f172a, #334155)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontSize: '20px' }}>🛫</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>PilotCareerPathways.com</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Training routes, ATOs, costs, and timelines</div>
                                </div>
                                <span style={{ marginLeft: 'auto', fontSize: '18px', color: '#94a3b8' }}>→</span>
                            </button>
                            <button
                                type="button"
                                onClick={() => window.open('https://pilotshortage.org', '_blank')}
                                style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '20px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s', width: '100%' }}
                            >
                                <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'linear-gradient(135deg, #1e1b4b, #4338ca)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                    <span style={{ fontSize: '20px' }}>📊</span>
                                </div>
                                <div>
                                    <div style={{ fontSize: '15px', fontWeight: 700, color: '#0f172a', marginBottom: '2px' }}>PilotShortage.org</div>
                                    <div style={{ fontSize: '12px', color: '#64748b' }}>Global shortage data and industry insights</div>
                                </div>
                                <span style={{ marginLeft: 'auto', fontSize: '18px', color: '#94a3b8' }}>→</span>
                            </button>
                        </div>
                        <button
                            type="button"
                            onClick={() => onNavigate('platform')}
                            style={{ marginTop: '24px', fontSize: '13px', color: '#94a3b8', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
                        >
                            Skip and enter platform →
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};
