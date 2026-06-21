
import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { createPortal } from 'react-dom';
import { MeshGradient } from '@paper-design/shaders-react';
// TopNavbar removed for a focused create-account experience
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '../../../src/lib/device-detection';
import { useAuth0 } from '@auth0/auth0-react';
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
    const [aircraftTypes, setAircraftTypes] = useState<string[]>([]);
    const [ratings, setRatings] = useState<string[]>([]);
    const [issuingAuthority, setIssuingAuthority] = useState('');
    const [aircraftCategory, setAircraftCategory] = useState('');
    const [typeRatings, setTypeRatings] = useState<string[]>([]);
    const [typeRatingInput, setTypeRatingInput] = useState('');
    const [elpLevel, setElpLevel] = useState('');
    const [medicalClass, setMedicalClass] = useState('');
    const [otherLicence, setOtherLicence] = useState('');
    const [showMoreClasses, setShowMoreClasses] = useState(false);
    const [showMoreCategories, setShowMoreCategories] = useState(false);
    const [showAircraftSection, setShowAircraftSection] = useState(false);
    const [showRatingsSection, setShowRatingsSection] = useState(false);
    const [saving, setSaving] = useState(false);

    // ── Pilot Career Status (pilotshortage.org compliant) ──
    const [employmentStatus, setEmploymentStatus] = useState<'employed' | 'instructor' | 'transitioning' | 'graduate' | 'unemployed' | 'shifted_career' | 'exploring' | ''>('');
    const [unemployedDuration, setUnemployedDuration] = useState('');
    const [currentJob, setCurrentJob] = useState('');
    const [careerGoal, setCareerGoal] = useState('');
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
    ];

    useEffect(() => {
        setEnableShader(shouldEnable3DEffects());
    }, []);

    // ── Detect Auth0 user and pre-populate display name ──
    useEffect(() => {
        if (isSetup && auth0User) {
            const name = auth0User.name || auth0User.email?.split('@')[0] || '';
            setDisplayName(name);
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
                total_flight_hours: hours || null,
                hours_whole: hoursWhole || null,
                hours_minutes: hoursMinutes || null,
                aircraft_types: aircraftTypes.length > 0 ? aircraftTypes : null,
                aircraft_rated_on: aircraftTypes.length > 0 ? aircraftTypes.join(', ') : null,
                aircraft_category: aircraftCategory || null,
                license_issuing_authority: issuingAuthority || null,
                country_of_license: issuingAuthority || null,
                origin_jurisdiction: issuingAuthority || null,
                ratings: ratings.length > 0 ? ratings : null,
                type_ratings: typeRatings.length > 0 ? typeRatings : (occupation ? [occupation] : null),
                type_rating_input: typeRatingInput || null,
                elp_level: elpLevel || null,
                medical_class: medicalClass || null,
                employment_status: employmentStatus || null,
                unemployed_duration: unemployedDuration || null,
                current_job: currentJob || null,
                career_goal: careerGoal || null,
                pilot_stage: pilotStage || null,
                show_aircraft_section: showAircraftSection,
                show_ratings_section: showRatingsSection,
                show_more_classes: showMoreClasses,
                show_more_categories: showMoreCategories,
                dca_agreed: dcaAgreed ? 1 : 0,
                dca_agreed_at: dcaAgreedAt,
            };
            console.log('[DEBUG][Worker] Full profile save payload:', JSON.stringify(workerPayload, null, 2));

            const result = await callWorker('upsertProfile', workerPayload);
            console.log('[BecomeMember] Profile saved:', result);
            onNavigate('platform');
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
                            <p style={{ fontSize: '15px', color: 'rgba(255,255,255,0.4)', margin: 0 }}>Set up your profile to unlock pathway access</p>
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
                            .fic-input {
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
                            .fic-input:focus {
                                border-color: #334155;
                                box-shadow: 0 0 0 3px rgba(51,65,85,0.08);
                                background: #ffffff;
                            }
                            .fic-input::placeholder { color: #94a3b8; }
                            .fic-select {
                                width: 100%;
                                appearance: none;
                                -webkit-appearance: none;
                                background: rgba(255,255,255,0.7) url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2364748b' d='M6 8L1 3h10z'/%3E%3C/svg%3E") no-repeat right 16px center;
                                border: 1px solid rgba(255,255,255,0.8);
                                border-radius: 14px;
                                padding: 13px 44px 13px 18px;
                                color: #0f172a;
                                font-size: 14px;
                                font-weight: 500;
                                letter-spacing: -0.01em;
                                outline: none;
                                cursor: pointer;
                                transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
                                box-sizing: border-box;
                                backdrop-filter: blur(20px) saturate(180%);
                                -webkit-backdrop-filter: blur(20px) saturate(180%);
                                box-shadow: 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6);
                            }
                            .fic-select:hover {
                                background: rgba(255,255,255,0.85);
                                border-color: rgba(200,210,230,0.8);
                                box-shadow: 0 4px 16px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6);
                                transform: translateY(-1px);
                            }
                            .fic-select:focus {
                                border-color: rgba(100,120,160,0.5);
                                box-shadow: 0 0 0 4px rgba(100,120,160,0.08), 0 4px 20px rgba(0,0,0,0.08);
                                background: rgba(255,255,255,0.9);
                            }
                            .fic-select option {
                                font-size: 14px;
                                font-weight: 500;
                                color: #0f172a;
                                background: #ffffff;
                                padding: 10px 14px;
                            }
                            .fic-select optgroup {
                                font-size: 11px;
                                font-weight: 700;
                                text-transform: uppercase;
                                letter-spacing: 0.08em;
                                color: #94a3b8;
                                background: #f8fafc;
                            }
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

                        {/* Unified Profile Card */}
                        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden" style={{ maxWidth: '720px', margin: '0 auto' }}>
                            <div className="p-6 md:p-8">
                                {/* Stage indicator */}
                                <div className="mb-6">
                                    <div className="flex gap-2 mb-3">
                                        {[1, 2, 3, 4, 5, 6].map(s => (
                                            <div key={s} className={`flex-1 h-1.5 rounded-full transition-all duration-300 ${setupStage >= s ? 'bg-red-500' : 'bg-slate-200'}`} />
                                        ))}
                                    </div>
                                    <div className="flex justify-between items-center">
                                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Step {setupStage} of 6</span>
                                        <span className="text-xs font-medium text-slate-400">
                                            {setupStage === 1 ? 'Identity' : setupStage === 2 ? 'Classification' : setupStage === 3 ? 'Licensure and Type Ratings' : setupStage === 4 ? 'Pilot Status' : setupStage === 5 ? 'Flight Hours' : 'Create Profile'}
                                        </span>
                                    </div>
                                </div>

                                {setupStage === 1 && (
                                <>
                                {/* ── SECTION 1: Identity ── */}
                                <div className="border-b border-slate-200 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-0">Identity</h3>
                                    <div style={{ display: 'flex', gap: '8px' }}>
                                        <input className="fic-input" type="text" value={firstName} onChange={e => setFirstName(e.target.value)} placeholder="First name" />
                                        <input className="fic-input" type="text" value={lastName} onChange={e => setLastName(e.target.value)} placeholder="Last name" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            Callsign / Nickname
                                        </div>
                                        <input className="fic-input" type="text" value={displayName} onChange={e => setDisplayName(e.target.value)} placeholder="e.g. Skyhawk" />
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '8px' }}>
                                            Date of Birth
                                        </div>
                                        <input type="text" value={dob} onChange={e => { const raw = e.target.value.replace(/\D/g, '').slice(0, 8); let fmt = raw; if (raw.length >= 4) fmt = raw.slice(0, 2) + '/' + raw.slice(2, 4) + '/' + raw.slice(4); else if (raw.length >= 2) fmt = raw.slice(0, 2) + '/' + raw.slice(2); setDob(fmt); }} placeholder="DD/MM/YYYY" style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: `1px solid ${dob && (() => { const parts = dob.split('/'); if (parts.length !== 3) return false; const d = parseInt(parts[0]), m = parseInt(parts[1]), y = parseInt(parts[2]); if (isNaN(d) || isNaN(m) || isNaN(y)) return false; const birth = new Date(y, m - 1, d); const today = new Date(); let age = today.getFullYear() - birth.getFullYear(); const mo = today.getMonth() - birth.getMonth(); if (mo < 0 || (mo === 0 && today.getDate() < birth.getDate())) age--; return age < 18; })() ? '#fca5a5' : '#cbd5e1'}`, borderRadius: '8px', fontSize: '13px', color: '#0f172a', boxSizing: 'border-box' }} />
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
                                                    <a href="/data-controller-agreement#article-11" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', fontWeight: 600, textDecoration: 'underline', cursor: 'pointer', whiteSpace: 'nowrap' }}>Learn more →</a>
                                                </p>
                                            );
                                        })()}
                                    </div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Nationality</div>
                                        <select value={nationality} onChange={e => setNationality(e.target.value)} style={{ width: '100%', padding: '10px 12px', background: '#f8fafc', border: '1px solid #cbd5e1', borderRadius: '8px', fontSize: '13px', color: nationality ? '#0f172a' : '#94a3b8', colorScheme: 'light', boxSizing: 'border-box', appearance: 'none', backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 12 12'%3E%3Cpath fill='%2394a3b8' d='M6 8L1 3h10z'/%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 12px center' }}>
                                            <option value="" disabled>Select nationality...</option>
                                            {COUNTRIES.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', padding: '10px 12px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', flexShrink: 0 }}>🔓</span>
                                            <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Callsign is <strong>public</strong> and visible to other operators.</span>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                            <span style={{ fontSize: '12px', flexShrink: 0 }}>🔒</span>
                                            <span style={{ fontSize: '11px', color: '#64748b', lineHeight: 1.5 }}>Real name, date of birth, and nationality are stored under your full sovereign control as the data controller record on pilotrecognition.com, used solely for verification, and can be deleted or exported at any time under our GDPR-compliant process. <a href="/data-controller-agreement#article-2" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>Article 2</a>.</span>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4, marginTop: '2px', paddingLeft: '18px' }}>
                                            Notice: account information will be displayed across pilotrecognition.com, pilotcareerpathways.com, pilotshortage.org
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#3b82f6', lineHeight: 1.4, marginTop: '4px', paddingLeft: '18px' }}>
                                            <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" style={{ color: '#3b82f6', textDecoration: 'underline' }}>📄 Data Controller Agreement</a>
                                        </div>
                                        <div style={{ fontSize: '10px', color: '#94a3b8', lineHeight: 1.4, marginTop: '4px', paddingLeft: '18px' }}>
                                            Aviation Pathways Ltd will not sell or transfer this information outside the agreed jurisdiction, except as required for verification with approved providers under the Data Controller Agreement.
                                        </div>
                                    </div>
                                </div>{/* end Section 1 */}
                                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '8px' }}>
                                    <button
                                        type="button"
                                        onClick={() => setSetupStage(2)}
                                        disabled={!firstName.trim() || !lastName.trim() || !dob || !nationality}
                                        className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-slate-900"
                                    >Next →</button>
                                </div>
                                </>
                                )}

                                {setupStage === 2 && (
                                <>
                                {/* ── SECTION 2: Classification ── */}
                                <div className="border-b border-slate-200 pb-6 mb-6">

                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Classification</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* ── LICENCE DETAILS ── */}
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9' }}>Licence Details</div>
                                    {/* Pilot licence */}
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Current Pilot Licence</div>
                                        <select
                                            className="fic-select"
                                            value={occupation === 'None / No Licence' ? '' : occupation}
                                            onChange={e => setOccupation(e.target.value)}
                                            disabled={occupation === 'None / No Licence'}
                                            style={{ opacity: occupation === 'None / No Licence' ? 0.5 : 1, cursor: occupation === 'None / No Licence' ? 'not-allowed' : 'pointer' }}
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
                                                    style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', marginTop: '10px', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                        {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                    </span>
                                                    <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I don't hold a pilot licence</span>
                                                </button>
                                            );
                                        })()}
                                        {(occupation === 'Student Pilot' || occupation === 'Cadet') && (
                                            <div style={{ marginTop: '10px', padding: '14px 16px', background: 'rgba(255,255,255,0.55)', border: '1px solid rgba(255,255,255,0.6)', borderRadius: '14px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                                                    <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', background: 'rgba(15,23,42,0.85)', borderRadius: '5px', color: '#fff', fontSize: '10px', fontWeight: 700 }}>✓</span>
                                                    <span style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', letterSpacing: '0.04em' }}>Cadet Track Active</span>
                                                </div>
                                                <p style={{ margin: 0, fontSize: '11px', color: '#475569', lineHeight: 1.55 }}>
                                                    Your profile is optimised for Terminal 2 regional operators, flight instructors, and flight school pathways. Premium Terminal 3 gates will remain locked until CPL/ATPL milestones are claimed.
                                                </p>
                                            </div>
                                        )}
                                    </div>
                                    {/* Pilot licence upload slot */}

                                    {/* ── PILOT GATE ── */}
                                    {occupation && occupation !== 'None / No Licence' && (
                                    <>
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9', marginTop: '4px' }}>Training Stage</div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>What stage are you at?</div>
                                        <select className="fic-select" value={pilotStage} onChange={e => { const val = e.target.value; setPilotStage(val); setShowRedirect(NON_PILOT_STAGES.includes(val)); }}>
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
                                    <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9', marginTop: '4px' }}>Training Stage</div>
                                    <div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>What stage are you at?</div>
                                        <select className="fic-select" value={pilotStage} onChange={e => { const val = e.target.value; setPilotStage(val); setShowRedirect(NON_PILOT_STAGES.includes(val)); }}>
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
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '12px 14px', background: 'rgba(255,255,255,0.55)', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.6)', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                    <div style={{ fontSize: '11px', color: '#1e293b', lineHeight: 1.6 }}>
                                        <strong>Verified pilots deserve recognition.</strong> We're connecting qualified pilots to operators through trust, transparency, and career-aligned pathways — not stacks of resumes.{' '}
                                        <a href="/pilot-recognition-profile" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline', whiteSpace: 'nowrap' }}>Learn more →</a>
                                    </div>
                                </div>
                                </div>{/* end Section 2 */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(1)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(occupation && occupation !== 'None / No Licence' ? 3 : 4)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                )}

                                {setupStage === 3 && (
                                <>
                                {/* ── SECTION 3: Licensure and Type Ratings ── */}
                                <div className="border-b border-slate-200 pb-6 mb-6">
                                    <h3 className="text-lg font-bold text-slate-900 mb-4">Licensure and Type Ratings</h3>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {/* ── AIRCRAFT & PRIVILEGES — progressive disclosure ── */}
                                    {occupation !== 'None / No Licence' && (
                                        <>
                                        <div style={{ fontSize: '9px', fontWeight: 700, color: 'rgba(100,116,139,0.5)', letterSpacing: '0.18em', textTransform: 'uppercase', paddingBottom: '4px', borderBottom: '1px solid #f1f5f9', marginTop: '4px' }}>Aircraft &amp; Privileges</div>

                                        {/* Aircraft Class / Type — always visible */}
                                        {(() => {
                                            const PRIMARY = ['Single Engine Land (SEL)', 'Multi-Engine Land (MEL)', 'Rotorcraft — Helicopter', 'Multi-Engine Sea (MES)'];
                                            const EXTENDED = ['Single Engine Sea (SES)', 'Rotorcraft — Gyroplane', 'Glider', 'Powered Lift', 'Light Sport (LSA)', 'eVTOL / Powered Lift', 'Lighter-Than-Air', 'UAS / Drone', 'Turboprop', 'Experimental / Homebuilt'];
                                            const visible = showMoreClasses ? [...PRIMARY, ...EXTENDED] : PRIMARY;
                                            const selectedCount = aircraftTypes.filter(t => t !== '__none__').length;
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aircraft Class / Type</div>
                                                        {selectedCount > 0 && <span style={{ fontSize: '10px', color: '#0f172a', fontWeight: 700, background: 'rgba(15,23,42,0.08)', padding: '2px 8px', borderRadius: '10px' }}>{selectedCount} selected</span>}
                                                    </div>
                                                    {/* None required checkbox */}
                                                    {occupation !== 'None / No Licence' && (() => {
                                                        const isNone = aircraftTypes.includes('__none__');
                                                        return (
                                                            <button key="none" type="button"
                                                                onClick={() => setAircraftTypes(isNone ? [] : ['__none__'])}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                                </span>
                                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I'm not yet operating aircraft</span>
                                                            </button>
                                                        );
                                                    })()}
                                                    {/* Pill grid */}
                                                    {!aircraftTypes.includes('__none__') && (
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {visible.map(cls => {
                                                                const isSel = aircraftTypes.includes(cls);
                                                                return (
                                                                    <button key={cls} type="button"
                                                                        onClick={() => setAircraftTypes(prev => isSel ? prev.filter(t => t !== cls) : [...prev, cls])}
                                                                        style={{ padding: '6px 14px', background: isSel ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.6)', border: `1px solid ${isSel ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.7)'}`, borderRadius: '20px', color: isSel ? '#fff' : '#475569', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px', boxShadow: isSel ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                                                                        {isSel && <span style={{ fontSize: '10px', opacity: 0.9 }}>✓</span>}{cls}
                                                                    </button>
                                                                );
                                                            })}
                                                            <button type="button" onClick={() => setShowMoreClasses(p => !p)}
                                                                style={{ padding: '6px 14px', background: 'rgba(255,255,255,0.3)', border: '1px dashed rgba(148,163,184,0.4)', borderRadius: '20px', color: '#94a3b8', fontSize: '11px', fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap', transition: 'all 0.15s' }}>
                                                                {showMoreClasses ? '↑ Less' : `+ ${EXTENDED.length} more`}
                                                            </button>
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}

                                        {/* Operational Ratings — Apple checklist style */}
                                        {(() => {
                                            const OPS_RATINGS = [
                                                'Instrument Rating (IR)', 'Night Rating', 'Multi-Engine Rating (ME)',
                                                'Seaplane Rating', 'Aerobatic Rating', 'Mountain Rating',
                                                'Flight Instructor (CFI)', 'Check Airman', 'ATPL Frozen',
                                                'EBT Qualified', 'Type Rating Instructor (TRI)', 'Type Rating Examiner (TRE)',
                                            ];
                                            const selectedCount = ratings.filter(r => r !== '__none__').length;
                                            return (
                                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Operational Ratings</div>
                                                        {selectedCount > 0 && <span style={{ fontSize: '10px', color: '#0f172a', fontWeight: 700, background: 'rgba(15,23,42,0.08)', padding: '2px 8px', borderRadius: '10px' }}>{selectedCount} selected</span>}
                                                    </div>
                                                    {/* None required checkbox */}
                                                    {occupation !== 'None / No Licence' && (() => {
                                                        const isNone = ratings.includes('__none__');
                                                        return (
                                                            <button key="none" type="button"
                                                                onClick={() => setRatings(isNone ? [] : ['__none__'])}
                                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                                </span>
                                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I don't hold any ratings yet</span>
                                                            </button>
                                                        );
                                                    })()}
                                                    {/* Pill grid */}
                                                    {!ratings.includes('__none__') && (
                                                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                                                            {OPS_RATINGS.map(rating => {
                                                                const isSel = ratings.includes(rating);
                                                                return (
                                                                    <button key={rating} type="button"
                                                                        onClick={() => setRatings(prev => isSel ? prev.filter(r => r !== rating) : [...prev, rating])}
                                                                        style={{ padding: '6px 14px', background: isSel ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.6)', border: `1px solid ${isSel ? 'rgba(15,23,42,0.9)' : 'rgba(255,255,255,0.7)'}`, borderRadius: '20px', color: isSel ? '#fff' : '#475569', fontSize: '11px', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s cubic-bezier(0.4,0,0.2,1)', whiteSpace: 'nowrap', display: 'inline-flex', alignItems: 'center', gap: '5px', boxShadow: isSel ? '0 2px 8px rgba(0,0,0,0.12)' : '0 1px 3px rgba(0,0,0,0.04)' }}>
                                                                        {isSel && <span style={{ fontSize: '10px', opacity: 0.9 }}>✓</span>}{rating}
                                                                    </button>
                                                                );
                                                            })}
                                                        </div>
                                                    )}
                                                </div>
                                            );
                                        })()}
                                        {/* Type Ratings — conditional for licensed pilots, inside progressive disclosure */}
                                        {['Private Pilot (PPL)', 'Commercial Pilot (CPL)', 'Airline Pilot (ATPL)', 'First Officer', 'Captain', 'Flight Instructor (CFI)'].includes(occupation) && (
                                        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Type Ratings Held <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                                {typeRatings.filter(r => r !== '__none__').length > 0 && <span style={{ fontSize: '10px', color: '#0f172a', fontWeight: 700, background: 'rgba(15,23,42,0.08)', padding: '2px 8px', borderRadius: '10px' }}>{typeRatings.filter(r => r !== '__none__').length} selected</span>}
                                            </div>
                                            {/* None required checkbox */}
                                            {occupation !== 'None / No Licence' && (() => {
                                                const isNone = typeRatings.includes('__none__');
                                                return (
                                                    <button key="none" type="button"
                                                        onClick={() => setTypeRatings(isNone ? [] : ['__none__'])}
                                                        style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                        <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                            {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                        </span>
                                                        <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I don't hold any type ratings</span>
                                                    </button>
                                                );
                                            })()}
                                            {!typeRatings.includes('__none__') && (
                                            <>
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
                                            {typeRatings.filter(r => r !== '__none__').length > 0 && (
                                                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                                                    {typeRatings.filter(r => r !== '__none__').map(tr => (
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
                                            </>
                                            )}
                                        </div>
                                    )}
                                        </>
                                    )}
                                </div>
                                {occupation && occupation !== 'None / No Licence' && (
                                <>
                                {/* ELP Level */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>English Language Proficiency <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                        {elpLevel && elpLevel !== '__none__' && <span style={{ fontSize: '10px', color: '#0f172a', fontWeight: 700, background: 'rgba(15,23,42,0.08)', padding: '2px 8px', borderRadius: '10px' }}>Selected</span>}
                                    </div>
                                    {/* None required checkbox */}
                                    {occupation !== 'None / No Licence' && (() => {
                                        const isNone = elpLevel === '__none__';
                                        return (
                                            <button key="none" type="button"
                                                onClick={() => setElpLevel(isNone ? '' : '__none__')}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I don't hold an ELP certification</span>
                                            </button>
                                        );
                                    })()}
                                    {elpLevel !== '__none__' && (
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
                                    )}
                                </div>
                                {/* Aeromedical Class */}
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '14px', background: 'rgba(255,255,255,0.45)', border: '1px solid rgba(255,255,255,0.55)', borderRadius: '16px', boxShadow: '0 2px 12px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.6)', backdropFilter: 'blur(20px) saturate(180%)', WebkitBackdropFilter: 'blur(20px) saturate(180%)' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>Aeromedical Class <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none' }}>(optional)</span></div>
                                        {medicalClass && medicalClass !== '__none__' && <span style={{ fontSize: '10px', color: '#0f172a', fontWeight: 700, background: 'rgba(15,23,42,0.08)', padding: '2px 8px', borderRadius: '10px' }}>Selected</span>}
                                    </div>
                                    {/* None required checkbox */}
                                    {occupation !== 'None / No Licence' && (() => {
                                        const isNone = medicalClass === '__none__';
                                        return (
                                            <button key="none" type="button"
                                                onClick={() => setMedicalClass(isNone ? '' : '__none__')}
                                                style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', width: '100%', background: isNone ? 'rgba(15,23,42,0.06)' : 'transparent', border: `1px solid ${isNone ? 'rgba(15,23,42,0.15)' : 'rgba(226,232,240,0.6)'}`, borderRadius: '10px', cursor: 'pointer', transition: 'all 0.2s' }}>
                                                <span style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '18px', height: '18px', borderRadius: '5px', border: `1.5px solid ${isNone ? '#0f172a' : '#cbd5e1'}`, background: isNone ? '#0f172a' : 'transparent', transition: 'all 0.15s', flexShrink: 0 }}>
                                                    {isNone && <span style={{ color: '#fff', fontSize: '11px', fontWeight: 700 }}>✓</span>}
                                                </span>
                                                <span style={{ fontSize: '12px', fontWeight: isNone ? 600 : 500, color: isNone ? '#0f172a' : '#64748b', transition: 'all 0.15s' }}>None required — I don't hold a medical certificate</span>
                                            </button>
                                        );
                                    })()}
                                    {medicalClass !== '__none__' && (
                                    <select
                                        value={medicalClass}
                                        onChange={e => setMedicalClass(e.target.value)}
                                        style={{ width: '100%', padding: '9px 10px', border: '1px solid #e2e8f0', borderRadius: '8px', fontSize: '12px', color: medicalClass ? '#0f172a' : '#94a3b8', background: '#fff', appearance: 'auto' }}
                                    >
                                        <option value="">Select aeromedical class...</option>
                                        <option value="Class 1">Class 1 — Airline Transport Pilots (ATPs). Most stringent standards: comprehensive vision, cardiovascular, and neurological evaluations. Valid 12 months (6 months if age 40+).</option>
                                        <option value="Class 2">Class 2 — Commercial pilots, flight engineers, navigators. Thorough physical exam for commercial duties. Valid 12 months.</option>
                                        <option value="Class 3">Class 3 — Student, recreational, and private pilots. Basic medical standard for safe flight. Valid 60 months under 40; 24 months if 40+.</option>
                                    </select>
                                    )}
                                </div>
                                {/* ELP upload slot — Radio/NTC licence */}
                                {/* Single eligibility notice */}
                                {occupation === 'None / No Licence' ? (
                                    <div style={{ padding: '12px 14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0c4a6e', margin: '0 0 4px 0' }}>Discover pathways into aviation</p>
                                        <p style={{ fontSize: '10px', color: '#0369a1', margin: 0, lineHeight: 1.6 }}>
                                            Not a pilot yet? Visit <a href="https://pilotshortage.org" target="_blank" rel="noopener noreferrer" style={{ color: '#dc2626', fontWeight: 700, textDecoration: 'underline' }}>pilotshortage.org</a> to learn about the global demand for pilots, training routes, and how you can build a career in aviation. Your journey starts with understanding the industry.
                                        </p>
                                    </div>
                                ) : (
                                    <div style={{ padding: '10px 12px', background: '#fafafa', border: '1px solid #f1f5f9', borderRadius: '8px', textAlign: 'center' }}>
                                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#0f172a', margin: '0 0 4px 0' }}>Unlock document verification with <span style={{ color: '#ef4444' }}>Recognition+</span></p>
                                        <p style={{ fontSize: '10px', color: '#64748b', margin: 0, lineHeight: 1.6 }}>
                                            Complete your free profile first — then upgrade to <strong style={{ color: '#0f172a' }}>Recognition+</strong> to upload your licence documents for verification. Operators and airlines will see a <strong style={{ color: '#16a34a' }}>✓ Verified</strong> badge on your profile, confirming your credentials are current and authentic.
                                        </p>
                                    </div>
                                )}
                                </>)}
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(2)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(4)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                )}

                                
                                {setupStage === 4 && (
                                <>
                                {occupation === 'None / No Licence' ? (
                                <>
                                <div className="border-b border-slate-200 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">PilotCareerPathways.com</h3>
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
                                    <button type="button" onClick={() => setSetupStage(2)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(5)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                ) : (
                                <>
                                <div className="border-b border-slate-200 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Pilot Status &amp; Interests</h3>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Aviation Industry Occupation</div>
                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '6px' }}>Are you currently in the aviation industry?</div>
                                    <select className="fic-select" value={employmentStatus} onChange={e => setEmploymentStatus(e.target.value as any)}>
                                        <option value="">Select your current status...</option>
                                        <option value="employed">Actively flying — employed as a pilot</option>
                                        <option value="instructor">Flight instructor — building hours</option>
                                        <option value="transitioning">Looking to transition — ready for next role</option>
                                        <option value="graduate">Recent graduate — seeking first airline opportunity</option>
                                        <option value="unemployed">Between roles — open to new opportunities</option>
                                        <option value="shifted_career">Shifted career due to industry uncertainty — your story matters</option>
                                        <option value="exploring">Exploring pathways — not sure what's next</option>
                                    </select>
                                    <div style={{ marginTop: '8px', padding: '10px 12px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '8px' }}>
                                        <p style={{ margin: 0, fontSize: '11px', color: '#166534', lineHeight: 1.5 }}>
                                            <strong>In compliance with pilotshortage.org</strong> — Every pilot's journey is unique. Whether you're actively flying, instructing, or navigating a career shift, your experience contributes to the broader aviation story. We make sure pilots get heard and receive the recognition they deserve.
                                        </p>
                                    </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(3)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(5)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                )}
                                </>
                                )}

                                {setupStage === 5 && (
                                <>
                                {occupation === 'None / No Licence' ? (
                                <>
                                <div className="border-b border-slate-200 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">PilotShortage.org</h3>
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
                                    <button type="button" onClick={() => setSetupStage(4)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(6)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                ) : (
                                <>
                                {/* ── SECTION 3: Flight Hours & Logbook ── */}
                                <div className="border-b border-slate-200 pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 className="text-lg font-bold text-slate-900 mb-2">Flight Hours &amp; Logbook</h3>

                                    <div style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: '4px' }}>Estimated Total Flight Hours <span style={{ color: '#cbd5e1', fontWeight: 400, textTransform: 'none', fontSize: '10px' }}>(optional — you can skip)</span></div>
                                <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                                    <input className="fic-input" type="number" min="0" max="99999" value={hoursWhole} onChange={e => setHoursWhole(e.target.value)} placeholder="250" />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>HRS</span>
                                    <input className="fic-input" type="number" min="0" max="59" value={hoursMinutes} onChange={e => setHoursMinutes(e.target.value)} placeholder="00" style={{ maxWidth: '70px', textAlign: 'center' }} />
                                    <span style={{ color: 'rgba(100,116,139,0.6)', fontSize: '11px', fontFamily: 'monospace', flexShrink: 0 }}>MIN</span>
                                </div>
                                {/* Claim disclaimer */}
                                <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '12px 14px', display: 'flex', gap: '10px', alignItems: 'flex-start' }}>
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
                                        style={{ width: '100%', padding: '9px 8px', background: providerConnected ? '#f0fdf4' : '#f8fafc', border: `1px solid ${providerConnected ? '#86efac' : '#cbd5e1'}`, borderRadius: '8px', color: providerConnected ? '#16a34a' : '#475569', fontSize: '12px', fontWeight: 600, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s' }}>
                                        {providerConnected ? '✓ Logbook Connected' : 'Connect Digital Logbook'}
                                    </button>
                                </div>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(4)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button type="button" onClick={() => setSetupStage(6)} className="px-6 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors">Next →</button>
                                </div>
                                </>
                                )}
                                </>
                                )}

                                {setupStage === 6 && (
                                <>
                                <div className="pb-6 mb-6" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    {occupation === 'None / No Licence' ? (
                                    <>
                                    <h3 className="text-lg font-bold text-slate-900 mb-0">Create Visitor Account</h3>
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
                                    <h3 className="text-lg font-bold text-slate-900 mb-0">Create Your Profile</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', lineHeight: 1.6, margin: 0 }}>
                                        Confirm your details to activate your verified pilot profile. Operators and airlines can then discover your credentials instantly.
                                    </p>
                                    <div style={{ padding: '14px', background: '#f0f9ff', border: '1px solid #bae6fd', borderRadius: '10px' }}>
                                        <p style={{ fontSize: '12px', color: '#0369a1', margin: 0, lineHeight: 1.5 }}>
                                            <strong>Secure digital ID:</strong> Your profile includes a passkey-secured credential wallet. Save it to your device when prompted — this is your login key.
                                        </p>
                                    </div>
                                    {/* Passkey warning */}
                                    <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid rgba(226,232,240,0.8)', borderRadius: '12px', padding: '16px', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                                        <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', marginBottom: '12px' }}>
                                            <span style={{ fontSize: '16px', lineHeight: 1, flexShrink: 0 }}>🔐</span>
                                            <div>
                                                <p style={{ fontSize: '12px', fontWeight: 700, color: '#dc2626', margin: '0 0 6px' }}>Your browser will prompt you to save a passkey</p>
                                                <p style={{ fontSize: '11px', color: '#64748b', margin: 0, lineHeight: 1.5 }}>
                                                    Without this key you will lose access to your profile credentials. Save it to Touch ID, Face ID, or Google Password Manager when prompted.
                                                </p>
                                            </div>
                                        </div>
                                        <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                                            <img src="/PASS.png" alt="Safari passkey prompt" style={{ width: '50%', maxWidth: '220px', aspectRatio: '4/5', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
                                            <img src="/CHROME.png" alt="Chrome passkey prompt" style={{ width: '50%', maxWidth: '220px', aspectRatio: '4/5', objectFit: 'contain', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
                                        </div>
                                    </div>
                                    </>
                                    )}

                                    <button
                                        type="button"
                                        disabled={walletCreating === 'generating' || walletCreating === 'syncing'}
                                        onClick={async () => {
                                            if (walletConnected && !showPasskeyCancelled) { setShowResourceSelector(true); return; }
                                            const sbUserId = auth0User?.sub || null;
                                            if (!sbUserId) { setSaveError('Authentication error. Please sign in again.'); return; }
                                            const cleanFirst = firstName.trim().replace(/<[^>]*>/g, '').slice(0, 50);
                                            const cleanLast = lastName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
                                            const cleanName = displayName.trim().replace(/<[^>]*>/g, '').slice(0, 80);
                                            const hrs = parseFloat(hoursWhole) + (parseFloat(hoursMinutes || '0') / 60);
                                            const walletPayload = {
                                                auth0_id: sbUserId,
                                                email: auth0User?.email || '',
                                                display_name: cleanName,
                                                first_name: cleanFirst,
                                                last_name: cleanLast,
                                                current_occupation: occupation,
                                                license_type: occupation || null,
                                                other_licence: otherLicence || null,
                                                date_of_birth: dob || null,
                                                nationality: nationality || null,
                                                total_flight_hours: hrs,
                                                hours_whole: hoursWhole || null,
                                                hours_minutes: hoursMinutes || null,
                                                aircraft_types: aircraftTypes.length > 0 ? aircraftTypes : null,
                                                aircraft_category: aircraftCategory || null,
                                                license_issuing_authority: issuingAuthority || null,
                                                type_ratings: typeRatings.length > 0 ? typeRatings : (occupation ? [occupation] : null),
                                                type_rating_input: typeRatingInput || null,
                                                ratings: ratings.filter(r => r !== '__none__').length > 0 ? ratings.filter(r => r !== '__none__') : null,
                                                elp_level: elpLevel || null,
                                                medical_class: medicalClass || null,
                                                employment_status: employmentStatus || null,
                                                unemployedDuration: unemployedDuration || null,
                                                current_job: currentJob || null,
                                                career_goal: careerGoal || null,
                                                pilot_stage: pilotStage || null,
                                                role: isVisitor ? 'visitor' : 'pilot',
                                                is_visitor: isVisitor,
                                                showAircraftSection,
                                                showRatingsSection,
                                                showMoreClasses,
                                                showMoreCategories,
                                                walletStorageChoice: walletStorageChoice || 'supabase',
                                                requestToken: (() => { const s = `${sbUserId}:ts:${Date.now()}`; const b = new Uint8Array([...s].map(c => c.charCodeAt(0))); let bin = ''; b.forEach(byte => bin += String.fromCharCode(byte)); return window.btoa(bin); })(),
                                            };
                                            console.log('[DEBUG][Worker] Full account creation payload:', JSON.stringify(walletPayload, null, 2));
                                            try {
                                                setWalletCreating('generating');
                                                setSaveError('');
                                                await new Promise(r => setTimeout(r, 900));
                                                setWalletCreating('syncing');
                                                setSaving(true);
                                                const result = await callWorker('upsertProfile', walletPayload);
                                                console.log('[DEBUG][Worker] Profile saved:', result);
                                                sessionStorage.setItem('wallet_claimed_provider', 'PilotRecognition');
                                                sessionStorage.setItem('pr_user_id', sbUserId);
                                                setWalletCreating('active');
                                                setSelectedWallet('Pilot Wallet');
                                                setWalletConnected(true);
                                                setSaving(false);
                                                onNavigate('platform');
                                            } catch (e) {
                                                console.error('[DEBUG][Worker] Profile creation error:', e);
                                                setWalletCreating('idle');
                                                setSaving(false);
                                                setSaveError('Failed to create profile. Please try again.');
                                            }
                                        }}
                                        className="w-full px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-lg text-sm transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {walletCreating === 'generating' && '⏳ Generating Secure Keys...'}
                                        {walletCreating === 'syncing' && '🔄 Registering Account...'}
                                        {(walletCreating === 'active' || walletConnected) && '🎉 Profile Created — Entering...'}
                                        {walletCreating === 'idle' && (occupation === 'None / No Licence' ? 'Create Visitor Account →' : 'Create Profile →')}
                                    </button>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }}>
                                    <button type="button" onClick={() => setSetupStage(5)} className="px-6 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg text-sm transition-colors">← Back</button>
                                    <button
                                        type="button"
                                        onClick={handleSaveProfile}
                                        disabled={saving}
                                        className="px-6 py-2.5 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-semibold rounded-lg text-sm transition-colors"
                                    >
                                        {saving ? 'Creating...' : (occupation === 'None / No Licence' ? 'Create Visitor Account →' : 'Create Profile →')}
                                    </button>
                                </div>
                                </>
                                )}
                            </div>{/* end card inner */}
                        </div>{/* end card outer */}

                        {saveError && <p style={{ color: '#dc2626', fontSize: '11px', margin: '8px 0 0', textAlign: 'center' }}>{saveError}</p>}

                        {/* Footer */}
                        <div style={{ marginTop: '48px', paddingTop: '24px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', marginBottom: '12px' }}>
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#4ade80" strokeWidth="2.5"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                                <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>Secure Connection</span>
                                <span style={{ color: 'rgba(255,255,255,0.2)' }}>·</span>
                                <span style={{ color: '#7dd3fc', fontSize: '11px', fontWeight: 600 }}>Powered by Cloudflare</span>
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
                        <div className="flex-1 text-left" style={{ animation: 'glassMaterialize 0.7s cubic-bezier(0.22, 1, 0.36, 1) forwards' }}>
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
                                className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-blue-600/20"
                            >
                                Sign up with Email
                            </button>

                            {/* Passive consent statement */}
                            <p className="text-white/40 text-[11px] text-center mt-3 leading-relaxed">
                                By continuing you confirm you are 16+ and agree to our{' '}
                                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70 transition-colors">Terms of Service</a>,{' '}
                                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70 transition-colors">Privacy Policy</a>, and{' '}
                                <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="underline hover:text-white/70 transition-colors">Data Controller Agreement</a>.
                            </p>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                            </div>

                            {/* What you get */}
                            <ul className="space-y-2.5 mb-6">
                                {[
                                    { label: 'Verified Recognition Profile', tip: 'Authenticate your flight hours, licenses, and credentials to establish a high-trust professional identity.' },
                                    { label: 'Pathway Alignment & Mapping', tip: 'Align your profile with active industry pathways to signal your readiness and career availability.' },
                                    { label: 'Direct Network Connections', tip: 'Allow verified network partners to request direct professional contact with your profile.' },
                                    { label: 'ATLAS Professional CV Builder', tip: 'Standardize your aviation metrics and competencies into a clean, consultant-grade portfolio.' },
                                ].map((item) => (
                                    <li key={item.label} className="group relative flex items-center gap-2.5 text-sm text-white cursor-default">
                                        <span className="w-4 h-4 rounded-full bg-[#00b4d8]/20 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
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
                        <div style={{ display: 'flex', alignItems: 'center', gap: '14px', marginBottom: '20px' }}>
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
                        <p style={{ fontSize: '11px', fontWeight: 600, color: 'rgba(255,255,255,0.35)', letterSpacing: '0.08em', textTransform: 'uppercase', margin: '0 0 10px' }}>Your browser will show one of these:</p>
                        <div style={{ display: 'flex', gap: '10px', marginBottom: '24px' }}>
                            <img src="/PASS.png" alt="Safari passkey prompt" style={{ width: '50%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
                            <img src="/CHROME.png" alt="Chrome passkey prompt" style={{ width: '50%', borderRadius: '10px', boxShadow: '0 4px 20px rgba(0,0,0,0.4)' }} />
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
