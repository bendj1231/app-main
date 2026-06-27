import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/lib/device-detection';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import {
  ArrowRight, ShieldCheck, Briefcase, BadgeCheck, UserCheck, IdCard, Award, Radio, ExternalLink,
  Globe, Star, Lock, CheckCircle, X, BookOpen,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const COUNTRIES = [
  { code: 'PH', name: 'Philippines', flag: '🇵🇭', prefix: '+63' },
  { code: 'US', name: 'United States', flag: '🇺🇸', prefix: '+1' },
  { code: 'GB', name: 'United Kingdom', flag: '🇬🇧', prefix: '+44' },
  { code: 'AE', name: 'UAE', flag: '🇦🇪', prefix: '+971' },
  { code: 'SG', name: 'Singapore', flag: '🇸🇬', prefix: '+65' },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', prefix: '+61' },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', prefix: '+1' },
  { code: 'IN', name: 'India', flag: '🇮🇳', prefix: '+91' },
  { code: 'ZA', name: 'South Africa', flag: '🇿🇦', prefix: '+27' },
  { code: 'NG', name: 'Nigeria', flag: '🇳🇬', prefix: '+234' },
  { code: 'KE', name: 'Kenya', flag: '🇰🇪', prefix: '+254' },
  { code: 'MU', name: 'Mauritius', flag: '🇲🇺', prefix: '+230' },
];

const NATIONALITY_OPTIONS = [
  'Philippines', 'United States', 'United Kingdom', 'Canada', 'Australia', 'UAE', 'Singapore',
  'India', 'Pakistan', 'South Africa', 'Nigeria', 'Kenya', 'Ghana', 'Ethiopia', 'Uganda',
  'Afghanistan', 'Albania', 'Algeria', 'Andorra', 'Angola', 'Antigua and Barbuda',
  'Argentina', 'Armenia', 'Austria', 'Azerbaijan', 'Bahamas', 'Bahrain', 'Bangladesh',
  'Barbados', 'Belarus', 'Belgium', 'Belize', 'Benin', 'Bhutan', 'Bolivia',
  'Bosnia and Herzegovina', 'Botswana', 'Brazil', 'Brunei', 'Bulgaria', 'Burkina Faso',
  'Burundi', 'Cambodia', 'Cameroon', 'Cape Verde', 'Central African Republic', 'Chad',
  'Chile', 'China', 'Colombia', 'Comoros', 'Congo', 'Costa Rica', 'Croatia', 'Cuba',
  'Cyprus', 'Czech Republic', 'Denmark', 'Djibouti', 'Dominica', 'Dominican Republic',
  'Ecuador', 'Egypt', 'El Salvador', 'Equatorial Guinea', 'Eritrea', 'Estonia',
  'Eswatini', 'Fiji', 'Finland', 'France', 'Gabon', 'Gambia', 'Georgia', 'Germany',
  'Greece', 'Grenada', 'Guatemala', 'Guinea', 'Guinea-Bissau', 'Guyana', 'Haiti',
  'Honduras', 'Hungary', 'Iceland', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel',
  'Italy', 'Jamaica', 'Japan', 'Jordan', 'Kazakhstan', 'Kiribati', 'Kuwait', 'Kyrgyzstan',
  'Laos', 'Latvia', 'Lebanon', 'Lesotho', 'Liberia', 'Libya', 'Liechtenstein',
  'Lithuania', 'Luxembourg', 'Madagascar', 'Malawi', 'Malaysia', 'Maldives', 'Mali',
  'Malta', 'Marshall Islands', 'Mauritania', 'Mauritius', 'Mexico', 'Micronesia',
  'Moldova', 'Monaco', 'Mongolia', 'Montenegro', 'Morocco', 'Mozambique', 'Myanmar',
  'Namibia', 'Nauru', 'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Niger',
  'North Korea', 'North Macedonia', 'Norway', 'Oman', 'Palau', 'Palestine', 'Panama',
  'Papua New Guinea', 'Paraguay', 'Peru', 'Poland', 'Portugal', 'Qatar', 'Romania',
  'Russia', 'Rwanda', 'Saint Kitts and Nevis', 'Saint Lucia', 'Saint Vincent and the Grenadines',
  'Samoa', 'San Marino', 'Sao Tome and Principe', 'Saudi Arabia', 'Senegal', 'Serbia',
  'Seychelles', 'Sierra Leone', 'Slovakia', 'Slovenia', 'Solomon Islands', 'Somalia',
  'South Korea', 'South Sudan', 'Spain', 'Sri Lanka', 'Sudan', 'Suriname', 'Sweden',
  'Switzerland', 'Syria', 'Tajikistan', 'Tanzania', 'Thailand', 'Timor-Leste', 'Togo',
  'Tonga', 'Trinidad and Tobago', 'Tunisia', 'Turkey', 'Turkmenistan', 'Tuvalu',
  'Ukraine', 'Uruguay', 'Uzbekistan', 'Vanuatu', 'Vatican City', 'Venezuela', 'Vietnam',
  'Yemen', 'Zambia', 'Zimbabwe',
];

const formatDateInput = (raw: string): string => {
  const digits = raw.replace(/\D/g, '').slice(0, 8);
  if (digits.length <= 2) return digits;
  if (digits.length <= 4) return `${digits.slice(0, 2)}/${digits.slice(2)}`;
  return `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
};

const CountryPhoneInput: React.FC<{ value: string; onChange: (val: string) => void }> = ({ value, onChange }) => {
  // Parse initial value to set country and local number
  const [country, setCountry] = useState(() => {
    if (!value) return COUNTRIES[0];
    const found = COUNTRIES.find(c => value.startsWith(c.prefix));
    return found || COUNTRIES[0];
  });
  const [localNumber, setLocalNumber] = useState(() => {
    if (!value) return '';
    const found = COUNTRIES.find(c => value.startsWith(c.prefix));
    return found ? value.slice(found.prefix.length) : value;
  });

  const handleCountryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const c = COUNTRIES.find(x => x.code === e.target.value) || COUNTRIES[0];
    setCountry(c);
    onChange(c.prefix + localNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const num = e.target.value.replace(/\D/g, '');
    setLocalNumber(num);
    onChange(country.prefix + num);
  };

  return (
    <div className="w-full rounded-xl px-2 py-1.5 text-xs text-gray-900 outline-none flex items-center gap-1.5" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
      <select
        value={country.code}
        onChange={handleCountryChange}
        className="bg-transparent text-xs font-semibold outline-none cursor-pointer"
        style={{ maxWidth: '70px' }}
      >
        {COUNTRIES.map(c => (
          <option key={c.code} value={c.code}>{c.flag} {c.prefix}</option>
        ))}
      </select>
      <input
        type="tel"
        placeholder="Phone"
        value={localNumber}
        onChange={handleNumberChange}
        className="flex-1 bg-transparent text-xs text-gray-900 placeholder-gray-500 outline-none"
      />
    </div>
  );
};

export default function VerifyApcPage() {
  const navigate = useNavigate();
  const { user: auth0User } = useAuth0();
  const { callApi } = useWorkerAuth();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);

  const [apcEmail, setApcEmail] = useState('');
  const [apcLicenseFile, setApcLicenseFile] = useState<File | null>(null);
  const [apcLicenseBackFile, setApcLicenseBackFile] = useState<File | null>(null);
  const [ratingSets, setRatingSets] = useState<{ certFile: File | null; licFile: File | null; trainingCenter: string; country: string }[]>([{ certFile: null, licFile: null, trainingCenter: '', country: '' }]);
  const [apcLogbookFile, setApcLogbookFile] = useState<File | null>(null);
  const [apcMedicalFile, setApcMedicalFile] = useState<File | null>(null);
  const [apcRadioNtcFile, setApcRadioNtcFile] = useState<File | null>(null);
  const [apcConsentFile, setApcConsentFile] = useState<File | null>(null);
  const [apcConsentChecked, setApcConsentChecked] = useState(false);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({});
  const [ratingFiles, setRatingFiles] = useState<Record<string, File | null>>({});
  const [atoConsentChecked, setAtoConsentChecked] = useState(false);
  const [licenseConsentChecked, setLicenseConsentChecked] = useState(false);
  const [aircraftRatingActive, setAircraftRatingActive] = useState<Record<string, { active: boolean; recurrency: boolean }>>({});
  const [logbookConsentChecked, setLogbookConsentChecked] = useState(false);
  const [privacyConsentChecked, setPrivacyConsentChecked] = useState(false);
  const [apcFormData, setApcFormData] = useState({
    fullName: '', phone: '', nationality: '', licenseNumber: '', licenseType: 'PPL',
    issuingAuthority: 'CAAP', licenseIssueDate: '', licenseExpiryDate: '',
    totalHours: '', picHours: '', dualHours: '', dualXcHours: '', nightHours: '', instrumentSimHours: '', instrumentActualHours: '', multiEngineSimHours: '', multiEngineActualHours: '', crossCountryHours: '',
    medicalClass: 'Class 1', medicalExpiry: '',
    atoName: '', atoLocation: '',
    atoDataNeeded: 'total_flight_hours',
    additionalRatings: [] as string[],
    hasAviationDegree: false,
    aviationDegreeDetails: '',
    currentlyEnrolled: false,
    enrollmentDetails: '',
    isAbInitioPilot: false,
    abInitioDetails: '',
    homeBase: '',
    hasFlightExperience: false,
    pathwayInterest: [] as string[],
    radioLicenseExpiry: '',
    hasNoLicenseExpiry: false,
    hasNotFlown: false,
    hasNoMedical: false,
    hasRadioLicense: false,
  });
  const [additionalATOs, setAdditionalATOs] = useState<{ name: string; location: string }[]>([]);
  const [ratingInput, setRatingInput] = useState('');
  const [showRatingDropdown, setShowRatingDropdown] = useState(false);
  const [showAdvancedHours, setShowAdvancedHours] = useState(false);
  const [atoCountry, setAtoCountry] = useState('');
  const cardRef = useRef<HTMLDivElement>(null);
  const [cardScale, setCardScale] = useState(1);
  const [step, setStep] = useState(1);
  const [showLogbookModal, setShowLogbookModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const totalSteps = 8;
  const stepTitles = ['Personal Details', 'Background & Experience', 'License & Medical', 'Core Documents', 'Aircraft Ratings', 'Type Ratings & Endorsements', 'Flight Hours & Logbook', 'Authorization & Submit'];
  const stepDescriptions = [
    'Provide your identity, contact information, nationality, and home base for the verification record.',
    'Tell us about your education, flight experience, and the career pathway you are pursuing.',
    'Enter your pilot license details, medical certificate class, and select any additional aircraft ratings.',
    'Upload your license, medical certificate, radio license, and sign the document consent form.',
    'Upload certificates for each selected aircraft rating (e.g., C152, C172, P200JF).',
    'Add your type rating endorsements with certification, licensure, and training center details.',
    'Enter your flight hours summary, upload your logbook, and sign the logbook audit consent.',
    'Review all details, select your ATO, confirm privacy consent, and submit your verification request to APC.',
  ];

  // Dynamically scale card to fit viewport without scrolling
  useEffect(() => {
    const calculateScale = () => {
      if (!cardRef.current) return;
      const cardHeight = cardRef.current.scrollHeight;
      const cardWidth = cardRef.current.scrollWidth;
      const viewportHeight = window.innerHeight;
      const viewportWidth = window.innerWidth;
      const padding = 48;
      const scaleY = (viewportHeight - padding) / cardHeight;
      const scaleX = (viewportWidth - padding) / cardWidth;
      setCardScale(Math.min(1, scaleY, scaleX));
    };

    const timer = setTimeout(calculateScale, 100);
    window.addEventListener('resize', calculateScale);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', calculateScale);
    };
  }, [step]);

  const canProceed = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return !!apcFormData.fullName && !!apcEmail && !!apcFormData.phone && !!apcFormData.nationality && !!apcFormData.homeBase;
      case 2:
        return true;
      case 3:
        const hasValidLicense = !!apcFormData.licenseNumber && (apcFormData.hasNoLicenseExpiry || !!apcFormData.licenseExpiryDate);
        const hasValidMedical = !apcFormData.hasNoMedical && !!apcFormData.medicalClass && !!apcFormData.medicalExpiry;
        return hasValidLicense && (apcFormData.hasNotFlown || true) && (apcFormData.hasNoMedical || hasValidMedical);
      case 4:
      case 5:
        return true;
      case 6:
        return true;
      case 7:
        return !!apcLogbookFile && !!apcConsentFile && logbookConsentChecked;
      case 8:
        return true;
      default:
        return false;
    }
  };

  const FLIGHT_SCHOOLS: Record<string, string[]> = {
    Philippines: [
      'WCC Aviation College',
      'OMNI Aviation Corporation',
      'Alpha Aviation Group',
      'PATTS College of Aeronautics',
      'Philippine State College of Aeronautics (PhilSCA)',
      'Air Link International Aviation School',
      'Angeles City Flying Club',
      'Asian Institute of Aviation',
      'Apollo Aviation Academy',
      'Aviatour Flight School',
      'Bicol International Airport Aviation School',
      'Blue Horizon Flying School',
      'BSAU Flight School',
      'Cebu Aero Flying School',
      'Cebu Pacific Flight Academy',
      'Clark International Flight School',
      'Central Luzon Aero Sports',
      'Davao City Flying School',
      'Delta Air International Aviation Academy',
      'Eagle Air Flying School',
      'Exelinc Aviation Academy',
      'First Aviation Academy',
      'Flight Academy of the Philippines',
      'General Aviation Training Academy',
      'Global Aerospace University',
      'Goldenstate College - Aviation',
      'Iloilo Aero Club',
      'Indira Gandhi Memorial Flight School',
      'International School for Aviation Excellence',
      'Island Aviation Training Center',
      'Lancaster Aviation Training Center',
      'Lanao Aero Club',
      'Leading Edge Aviation Academy',
      'Lipatech Aviation Training Center',
      'Manila Aero Club',
      'Mindanao Flying School',
      'National Aviation Academy of the Philippines',
      'Northern Luzon Flying School',
      'Pacific Aero Flying School',
      'Palawan Aero Club',
      'Pan Pacific Aviation Training Center',
      'Parañaque Aviation School',
      'Philippine Academy of Aeronautics',
      'Philippine Airlines Aviation School',
      'Pilipinas Aero Training Center',
      'Prime Aviation Academy',
      'Sky Ranch Aviation Academy',
      'South East Asian Institute of Aviation',
      'Subic Bay Flying School',
      'Topnotch Aviation Academy',
      'Trece Aviation Training Center',
      'Unified Aviation Academy',
      'Villa Aviation Training Center',
      'Visayas Aero Club',
      'Zest Aviation Academy',
    ],
  };

  // Pre-fill from D1 profile
  useEffect(() => {
    if (!auth0User?.sub) return;
    const fetchProfile = async () => {
      try {
        const profile = await callApi<Record<string, unknown>>('getProfile', { me: 1 });
        if (!profile) return;
        if (profile.email && typeof profile.email === 'string') setApcEmail(profile.email);
        setApcFormData(prev => ({
          ...prev,
          fullName: (profile.full_name as string) || (profile.display_name as string) || prev.fullName,
          phone: (profile.phone as string) || prev.phone,
          nationality: (profile.nationality as string) || (profile.country_of_residence as string) || (profile.citizenship as string) || prev.nationality,
          licenseNumber: (profile.license_id as string) || prev.licenseNumber,
          licenseType: (profile.license_types as string) || prev.licenseType,
          issuingAuthority: (profile.license_issuing_authority as string) || (profile.country_of_license as string) || prev.issuingAuthority,
          totalHours: (profile.total_flight_hours as number)?.toString() || prev.totalHours,
        }));
      } catch (err) {
        console.warn('[VerifyAPC] Could not fetch D1 profile:', err);
      }
    };
    fetchProfile();
  }, [auth0User?.sub, callApi]);

  const VAULT_API = 'https://apc-document-vault.benjamintigerbowler.workers.dev';

  const parseHhMm = (value: string): number => {
    if (!value) return 0;
    const [h, m] = value.split('+').map(v => parseInt(v) || 0);
    return h + (m || 0) / 60;
  };

  const uploadDocument = async (file: File, docType: string, setter: (f: File | null) => void) => {
    const userId = auth0User?.sub;
    if (!userId || !file) return;
    
    setUploadStatus(prev => ({ ...prev, [docType]: 'uploading' }));
    
    try {
      const res = await fetch(`${VAULT_API}/upload/${docType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });
      
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      
      const data = await res.json();
      console.log('[Upload] Secure vault success:', data.key);
      setter(file);
      setUploadStatus(prev => ({ ...prev, [docType]: 'done' }));
    } catch (err) {
      console.error('[Upload] Vault error:', err);
      setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
      setter(null);
    }
  };

  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  const handleSubmit = async () => {
    if (!auth0User?.sub) return;
    setSubmitStatus('submitting');
    
    try {
      const docKeys: Record<string, string> = {};
      if (apcLicenseFile) docKeys['license'] = auth0User.sub + '/license';
      if (apcLicenseBackFile) docKeys['license-back'] = auth0User.sub + '/license-back';
      if (apcMedicalFile) docKeys['medical'] = auth0User.sub + '/medical';
      if (apcRadioNtcFile) docKeys['radio-ntc'] = auth0User.sub + '/radio-ntc';
      ratingSets.forEach((set, idx) => {
        if (set.certFile) docKeys[`ratings-cert-${idx}`] = auth0User.sub + `/ratings-cert-${idx}`;
        if (set.licFile) docKeys[`ratings-lic-${idx}`] = auth0User.sub + `/ratings-lic-${idx}`;
      });
      if (apcLogbookFile) docKeys['logbook'] = auth0User.sub + '/logbook';
      if (apcConsentFile) docKeys['consent'] = auth0User.sub + '/consent';

      console.log('[Frontend] Submitting verification via Worker API...');
      console.log('[Frontend] auth0Sub:', auth0User.sub);
      console.log('[Frontend] documentKeys:', docKeys);
      console.log('[Frontend] ratingSets:', ratingSets);

      const payload = {
        auth0_sub: auth0User.sub,
        email: apcEmail,
        full_name: apcFormData.fullName,
        phone: apcFormData.phone,
        nationality: apcFormData.nationality,
        license_number: apcFormData.licenseNumber,
        license_type: apcFormData.licenseType,
        license_expiry: apcFormData.licenseExpiryDate,
        total_hours: parseHhMm(apcFormData.totalHours as string),
        pic_hours: parseHhMm(apcFormData.picHours as string),
        dual_hours: parseHhMm(apcFormData.dualHours as string),
        dual_xc_hours: parseHhMm(apcFormData.dualXcHours as string),
        night_hours: parseHhMm(apcFormData.nightHours as string),
        instrument_sim_hours: parseHhMm(apcFormData.instrumentSimHours as string),
        instrument_actual_hours: parseHhMm(apcFormData.instrumentActualHours as string),
        multi_engine_sim_hours: parseHhMm(apcFormData.multiEngineSimHours as string),
        multi_engine_actual_hours: parseHhMm(apcFormData.multiEngineActualHours as string),
        cross_country_hours: parseHhMm(apcFormData.crossCountryHours as string),
        medical_class: apcFormData.medicalClass,
        medical_expiry: apcFormData.medicalExpiry,
        rating_sets: ratingSets.map((set, idx) => ({
          index: idx,
          trainingCenter: set.trainingCenter,
          country: set.country,
          hasCertFile: !!set.certFile,
          hasLicFile: !!set.licFile,
        })),
        ato_name: apcFormData.atoName,
        ato_location: apcFormData.atoLocation,
        ato_data_needed: apcFormData.atoDataNeeded,
        document_keys: docKeys,
      };

      console.log('[Frontend] Payload:', payload);

      const result = await callApi<Record<string, unknown>>('submitVerification', payload);

      console.log('[Frontend] Worker response:', result);
      console.log('[Frontend] submission_id:', result?.submission_id);
      console.log('[Frontend] account_number:', result?.account_number);
      console.log('[Frontend] consent_json_path:', result?.consent_json_path);

      if (!result || !(result.success as boolean)) {
        throw new Error(result?.error as string || 'Submit failed');
      }

      setSubmitStatus('success');
      setTimeout(() => {
        navigate('/get-started', { state: { fromApcVerification: true, status: 'submitted' } });
      }, 1500);
    } catch (err) {
      console.error('[Submit] Error:', err);
      setSubmitStatus('error');
    }
  };

  const renderHoursRow = (label: string, key: string) => (
    <tr key={key} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
      <td className="px-3 py-2 text-gray-700">{label}</td>
      <td className="px-3 py-2 text-right">
        <div className="inline-flex items-center gap-1">
          <input type="text" inputMode="numeric" placeholder="0"
            value={(() => {
              const v = apcFormData[key as keyof typeof apcFormData] as string;
              if (!v) return '';
              const [h] = v.split('+');
              return h || '';
            })()}
            onChange={(e) => {
              const h = e.target.value.replace(/\D/g, '');
              const m = (() => {
                const v = apcFormData[key as keyof typeof apcFormData] as string;
                if (!v) return '00';
                const [, mm] = v.split('+');
                return mm || '00';
              })();
              setApcFormData(p => ({ ...p, [key]: h ? `${h}+${m}` : '' }));
            }}
            className="w-10 text-center rounded-lg px-1 py-1 text-xs text-gray-900 outline-none"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
          />
          <span className="text-xs text-gray-400 font-bold">+</span>
          <input type="text" inputMode="numeric" placeholder="00" maxLength={2}
            value={(() => {
              const v = apcFormData[key as keyof typeof apcFormData] as string;
              if (!v) return '';
              const [, m] = v.split('+');
              return m || '';
            })()}
            onChange={(e) => {
              let m = e.target.value.replace(/\D/g, '').slice(0, 2);
              if (m && parseInt(m) > 59) m = '59';
              const h = (() => {
                const v = apcFormData[key as keyof typeof apcFormData] as string;
                if (!v) return '0';
                const [hh] = v.split('+');
                return hh || '0';
              })();
              setApcFormData(p => ({ ...p, [key]: `${h || '0'}+${m || '00'}` }));
            }}
            className="w-10 text-center rounded-lg px-1 py-1 text-xs text-gray-900 outline-none"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
          />
        </div>
      </td>
    </tr>
  );

  return (
    <div className="relative h-screen flex items-center justify-center px-4 py-6 overflow-hidden">
      {/* ── BACKGROUND: MeshGradient ── */}
      <div className="fixed inset-0 z-0">
        {graphicsConfig.enableMeshGradient ? (
          <MeshGradient
            className="w-full h-full"
            colors={['#dbeafe','#94a3b8','#64748b','#475569','#334155','#1e3a5f','#1e3a8a','#0f172a']}
            speed={graphicsConfig.meshGradientSpeed}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
        )}
      </div>

      <motion.div
        className="relative z-10 mx-auto"
        style={{ maxWidth: 'fit-content' }}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Card */}
        <div
          ref={cardRef}
          style={{
            transform: `scale(${cardScale})`,
            transformOrigin: 'center center',
            transition: 'transform 0.3s ease-out',
          }}
        >
          <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8" style={{ border: '1px solid rgba(255,255,255,0.3)', width: '90vw', maxWidth: '1024px' }}>
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/get-started')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 backdrop-blur-md bg-white/40 border border-white/60 shadow-sm transition-all"
          >
            ← Back to Get Started
          </button>
          <div className="flex flex-col items-end gap-1.5">
            <button
              onClick={() => navigate('/get-started')}
              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white shadow-sm transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
            >
              Initiate Verification Later <ArrowRight size={12} />
            </button>
            <button
              onClick={() => navigate('/about-verification')}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              About Verification <ExternalLink size={12} />
            </button>
          </div>
        </div>

        {!hasStarted ? (
          <motion.div
            className="text-center py-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Hero Shield */}
            <motion.div
              className="mx-auto w-20 h-20 rounded-2xl flex items-center justify-center mb-5 shadow-lg"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.1, type: 'spring', stiffness: 200 }}
            >
              <ShieldCheck size={40} className="text-white" />
            </motion.div>

            <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#dc2626' }}>
              RECOGNITION+
            </p>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
              Verify Your Pilot Credentials
            </h1>
            <p className="text-sm text-gray-500 mb-6 max-w-md mx-auto leading-relaxed">
              Get recognized by airlines and operators worldwide. Your verified profile becomes your passport to exclusive pathway opportunities.
            </p>

            {/* Benefit Cards */}
            <div className="grid grid-cols-3 gap-3 max-w-lg mx-auto mb-6">
              {[
                { icon: Globe, label: 'Global Pathways', desc: 'Unlock airline & operator opportunities' },
                { icon: Star, label: 'Airline Visibility', desc: 'Get discovered by recruiters worldwide' },
                { icon: Lock, label: 'Secure & Trusted', desc: 'Encrypted docs, 30-day auto-delete' },
              ].map((item, i) => (
                <motion.div
                  key={item.label}
                  className="rounded-xl p-3 text-left"
                  style={{ background: 'rgba(0,0,0,0.02)', border: '1px solid rgba(0,0,0,0.06)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + i * 0.1 }}
                >
                  <item.icon size={18} className="text-red-500 mb-2" />
                  <p className="text-[10px] font-bold text-gray-800">{item.label}</p>
                  <p className="text-[9px] text-gray-500 leading-snug">{item.desc}</p>
                </motion.div>
              ))}
            </div>

            {/* CTA */}
            <motion.button
              type="button"
              onClick={() => setHasStarted(true)}
              className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black tracking-wider text-white shadow-lg transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Start Verification <ArrowRight size={16} />
            </motion.button>

            {/* Trust Badges */}
            <div className="flex items-center justify-center gap-4 mt-5">
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <ShieldCheck size={12} className="text-green-500" />
                <span>256-bit Encryption</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <CheckCircle size={12} className="text-green-500" />
                <span>CAAP Compliant</span>
              </div>
              <div className="flex items-center gap-1 text-[9px] text-gray-400">
                <BadgeCheck size={12} className="text-green-500" />
                <span>5-Min Setup</span>
              </div>
            </div>
          </motion.div>
        ) : (
          <>
            <motion.div className="text-center mb-8" variants={fadeUp} custom={0}>
              <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#dc2626' }}>
                RECOGNITION+
              </p>
              <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
                Pilot Verification Form
              </h1>
              <p className="text-sm text-gray-500">
                {stepDescriptions[step - 1]}
              </p>
            </motion.div>

            {/* Progress Bar */}
            {(() => {
              const visibleStepIdxs = apcFormData.hasNotFlown ? [0, 1, 2, 3, 7] : [0, 1, 2, 3, 4, 5, 6, 7];
              const visibleTotal = visibleStepIdxs.length;
              const visualStep = apcFormData.hasNotFlown ? (step <= 4 ? step : 5) : step;
              return (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                      Step {visualStep} of {visibleTotal}: {stepTitles[step - 1]}
                    </p>
                    <p className="text-[10px] font-bold text-gray-400">{Math.round((visualStep / visibleTotal) * 100)}% complete</p>
                  </div>
                  <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500 ease-out"
                      style={{
                        width: `${(visualStep / visibleTotal) * 100}%`,
                        background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
                      }}
                    />
                  </div>
                  <div className="flex justify-between mt-2">
                    {visibleStepIdxs.map((titleIdx, vi) => {
                      const internalStep = titleIdx + 1;
                      const isDone = step > internalStep;
                      const isActive = step === internalStep;
                      return (
                        <div key={titleIdx} className="flex flex-col items-center" style={{ width: `${100 / visibleTotal}%` }}>
                          <div
                            className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all"
                            style={{
                              background: isDone ? '#dc2626' : isActive ? '#dc2626' : 'rgba(0,0,0,0.06)',
                              color: step >= internalStep ? '#fff' : '#9ca3af',
                            }}
                          >
                            {isDone ? '✓' : vi + 1}
                          </div>
                          <p className={`text-[8px] font-semibold text-center leading-tight ${step >= internalStep ? 'text-gray-800' : 'text-gray-400'}`}>{stepTitles[titleIdx]}</p>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })()}
          </>
        )}

        {hasStarted && (
        <AnimatePresence mode="wait">
        {step === 1 && (<motion.div
          key="step1"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 1: Personal Details ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={1}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">1. Personal Details</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Full Name" value={apcFormData.fullName} onChange={(e) => setApcFormData(p => ({ ...p, fullName: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="email" placeholder="Email" value={apcEmail} onChange={(e) => setApcEmail(e.target.value)} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <CountryPhoneInput
              value={apcFormData.phone}
              onChange={(value) => setApcFormData(p => ({ ...p, phone: value }))}
            />
            <select
              value={apcFormData.nationality}
              onChange={(e) => setApcFormData(p => ({ ...p, nationality: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <option value="">Select Nationality</option>
              {NATIONALITY_OPTIONS.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Home Base */}
          <div className="mt-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1">Home Base Airfield / Flight School</p>
            <input
              type="text"
              placeholder="e.g., WCC Aviation College, Clark International..."
              value={apcFormData.homeBase}
              onChange={(e) => setApcFormData(p => ({ ...p, homeBase: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            />
          </div>

          <p className="text-[10px] text-gray-500 leading-relaxed mt-2">
            This email will be the recipient for your verification report, covering account status, logbook status, and license status. This report can and will be used for international personal identification during pathway submission of interests to operators, and can also be used outside of the platform as a form of verification.
          </p>
        </motion.div>

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => canProceed(1) && setStep(2)}
            disabled={!canProceed(1)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Background & Experience <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}

        {/* ── Step 2: Background & Experience ── */}
        {step === 2 && (<motion.div
          key="step2"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">2. Background & Experience</p>

          {/* Education */}
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-2">Education</p>
            <label className="flex items-center gap-2 mb-2 cursor-pointer">
              <input type="checkbox" checked={apcFormData.hasAviationDegree} onChange={(e) => setApcFormData(p => ({ ...p, hasAviationDegree: e.target.checked }))} className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700">Do you hold an aviation degree?</span>
            </label>
            {apcFormData.hasAviationDegree && (
              <input type="text" placeholder="University / Institution, Year, Degree type..." value={apcFormData.aviationDegreeDetails} onChange={(e) => setApcFormData(p => ({ ...p, aviationDegreeDetails: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none mb-2" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            )}
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={apcFormData.currentlyEnrolled} onChange={(e) => setApcFormData(p => ({ ...p, currentlyEnrolled: e.target.checked }))} className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700">Currently enrolled</span>
            </label>
            {apcFormData.currentlyEnrolled && (
              <input type="text" placeholder="Institution / Program, Expected graduation..." value={apcFormData.enrollmentDetails} onChange={(e) => setApcFormData(p => ({ ...p, enrollmentDetails: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none mt-2" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            )}
            <label className="flex items-center gap-2 mt-2 cursor-pointer">
              <input type="checkbox" checked={apcFormData.isAbInitioPilot} onChange={(e) => setApcFormData(p => ({ ...p, isAbInitioPilot: e.target.checked }))} className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700">Fast track / Ab-initio pilot</span>
            </label>
            {apcFormData.isAbInitioPilot && (
              <input type="text" placeholder="Training program, Institution, Year..." value={apcFormData.abInitioDetails} onChange={(e) => setApcFormData(p => ({ ...p, abInitioDetails: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none mt-2" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            )}
          </div>

          {/* Flight Experience */}
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)' }}>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-2">Flight Experience</p>
            <p className="text-[10px] text-gray-700 mb-2">Do you have any flight experience?</p>
            <div className="flex gap-2 mb-2">
              <button type="button" onClick={() => setApcFormData(p => ({ ...p, hasFlightExperience: true }))} className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all" style={{ background: apcFormData.hasFlightExperience ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(0,0,0,0.03)', color: apcFormData.hasFlightExperience ? '#fff' : '#374151', border: `1px solid ${apcFormData.hasFlightExperience ? 'transparent' : 'rgba(0,0,0,0.08)'}` }}>Yes</button>
              <button type="button" onClick={() => setApcFormData(p => ({ ...p, hasFlightExperience: false, licenseType: 'SPL', hasNotFlown: true }))} className="flex-1 py-2 rounded-xl text-[10px] font-bold transition-all" style={{ background: !apcFormData.hasFlightExperience ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(0,0,0,0.03)', color: !apcFormData.hasFlightExperience ? '#fff' : '#374151', border: `1px solid ${!apcFormData.hasFlightExperience ? 'transparent' : 'rgba(0,0,0,0.08)'}` }}>No</button>
            </div>
            <p className="text-[9px] text-gray-500 leading-snug">
              {apcFormData.hasFlightExperience
                ? 'You will be asked for license details, ratings, flight hours, and logbook in upcoming stages.'
                : 'Stages for aircraft ratings, type ratings, and flight hours will be skipped. You can always update your profile later as you gain experience.'}
            </p>
          </div>

          {/* Pathway Interest */}
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-2">Career Pathway</p>
            <p className="text-[10px] text-gray-700 mb-2">What pathway do you have in mind?</p>
            <div className="flex flex-wrap gap-1.5">
              {['Airline', 'Cargo', 'Military', 'Corporate / VIP', 'Charter', 'Flight Instructor', 'Helicopter', 'Agricultural', 'Seaplane', 'Undecided'].map((path) => {
                const isSelected = apcFormData.pathwayInterest.includes(path);
                return (
                  <button
                    key={path}
                    type="button"
                    onClick={() => setApcFormData(p => ({ ...p, pathwayInterest: isSelected ? p.pathwayInterest.filter(x => x !== path) : [...p.pathwayInterest, path] }))}
                    className="px-3 py-1.5 rounded-full text-[10px] font-bold transition-all"
                    style={{
                      background: isSelected ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(0,0,0,0.03)',
                      color: isSelected ? '#fff' : '#6b7280',
                      border: `1px solid ${isSelected ? 'transparent' : 'rgba(0,0,0,0.08)'}`,
                    }}
                  >
                    {isSelected ? `${path} ✓` : path}
                  </button>
                );
              })}
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button type="button" onClick={() => setStep(1)} className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100" style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}>
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button type="button" onClick={() => canProceed(2) && setStep(3)} disabled={!canProceed(2)} className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed" style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}>
            Next: License & Medical <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}

        {step === 3 && (<motion.div
          key="step3"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 3: License Information ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. License Information</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">License Number</p>
              <input type="text" placeholder="Pilot License Number" value={apcFormData.licenseNumber} onChange={(e) => setApcFormData(p => ({ ...p, licenseNumber: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">License Expiry Date</p>
              <input
                type="text"
                placeholder="Month/Day/Year"
                value={apcFormData.licenseExpiryDate}
                onChange={(e) => setApcFormData(p => ({ ...p, licenseExpiryDate: formatDateInput(e.target.value) }))}
                disabled={apcFormData.hasNoLicenseExpiry}
                className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9 disabled:opacity-40"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
              />
              <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={apcFormData.hasNoLicenseExpiry}
                  onChange={(e) => setApcFormData(p => ({ ...p, hasNoLicenseExpiry: e.target.checked, licenseExpiryDate: e.target.checked ? '' : p.licenseExpiryDate }))}
                  className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer"
                />
                <span className="text-[9px] text-gray-600">I don't have an expiry date</span>
              </label>
            </div>
          </div>
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">License Type</p>
          <div className="flex flex-wrap gap-1.5 mb-3">
            {['PPL', 'CPL', 'ATPL', 'SPL'].map((type) => (
              <button
                key={type}
                type="button"
                onClick={() => setApcFormData(p => ({ ...p, licenseType: type }))}
                className="px-3 py-1 rounded-full text-[10px] font-bold tracking-wider transition-all"
                style={{
                  background: apcFormData.licenseType === type ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(0,0,0,0.03)',
                  color: apcFormData.licenseType === type ? '#fff' : '#6b7280',
                  border: `1px solid ${apcFormData.licenseType === type ? 'transparent' : 'rgba(0,0,0,0.08)'}`,
                }}
              >
                {type}
              </button>
            ))}
          </div>
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1">Issuing Authority / Governing Aviation Authority</p>
            <select
              value={apcFormData.issuingAuthority}
              onChange={(e) => setApcFormData(p => ({ ...p, issuingAuthority: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer h-9"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <option value="">Select Authority</option>
              <option value="CAAP">CAAP — Civil Aviation Authority of the Philippines</option>
              <option value="FAA">FAA — Federal Aviation Administration (USA)</option>
              <option value="EASA">EASA — European Union Aviation Safety Agency</option>
              <option value="CAA UK">CAA UK — Civil Aviation Authority (UK)</option>
              <option value="CASA">CASA — Civil Aviation Safety Authority (Australia)</option>
              <option value="GCAA">GCAA — General Civil Aviation Authority (UAE)</option>
              <option value="CAAS">CAAS — Civil Aviation Authority of Singapore</option>
              <option value="CAAM">CAAM — Civil Aviation Authority of Malaysia</option>
              <option value="CAAS Indonesia">CAAS Indonesia — Civil Aviation Authority (Indonesia)</option>
              <option value="DGCA India">DGCA India — Directorate General of Civil Aviation (India)</option>
              <option value="SACAA">SACAA — South African Civil Aviation Authority</option>
              <option value="NCAA">NCAA — Nigerian Civil Aviation Authority</option>
              <option value="KCAA">KCAA — Kenya Civil Aviation Authority</option>
              <option value="CAA Mauritius">CAA Mauritius — Civil Aviation Department</option>
              <option value="TC Canada">TC Canada — Transport Canada</option>
              <option value="JCAB">JCAB — Japan Civil Aviation Bureau</option>
              <option value="CAAC">CAAC — Civil Aviation Administration of China</option>
              <option value="CAA Thailand">CAA Thailand — Department of Civil Aviation</option>
              <option value="CAA Vietnam">CAA Vietnam — Civil Aviation Authority of Vietnam</option>
              <option value="CAA Saudi Arabia">CAA Saudi Arabia — General Authority of Civil Aviation</option>
              <option value="CAA Qatar">CAA Qatar — Civil Aviation Authority</option>
              <option value="CAA Oman">CAA Oman — Public Authority for Civil Aviation</option>
              <option value="CAA Kuwait">CAA Kuwait — Directorate General of Civil Aviation</option>
              <option value="Other">Other — Not listed above</option>
            </select>
          </div>
          {/* I haven't flown checkbox */}
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={apcFormData.hasNotFlown}
              onChange={(e) => setApcFormData(p => ({ ...p, hasNotFlown: e.target.checked, additionalRatings: e.target.checked ? [] : p.additionalRatings }))}
              className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-gray-700">I haven't flown yet / No ratings</span>
          </label>

          {!apcFormData.hasNotFlown && (
          <>
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">
            Aircraft Ratings & Type Ratings
            {apcFormData.additionalRatings.length > 0 && (
              <span className="ml-1.5 text-[9px] font-bold text-red-600">
                {apcFormData.additionalRatings.length} {apcFormData.additionalRatings.length === 1 ? 'rating' : 'ratings'}
              </span>
            )}
          </p>
          {/* Selected tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {apcFormData.additionalRatings.map((r) => (
              <span
                key={r}
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-white border border-transparent"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                {r}
                <button
                  type="button"
                  onClick={() => {
                    setApcFormData(p => ({ ...p, additionalRatings: p.additionalRatings.filter(x => x !== r) }));
                    setRatingFiles(prev => {
                      const next = { ...prev };
                      delete next[r];
                      return next;
                    });
                  }}
                  className="text-white/70 hover:text-white transition-colors"
                >×</button>
              </span>
            ))}
          </div>
          <div className="flex gap-2 relative">
            <input
              type="text"
              placeholder="Type to search ratings..."
              value={ratingInput}
              onChange={(e) => {
                setRatingInput(e.target.value);
                setShowRatingDropdown(true);
              }}
              onFocus={() => setShowRatingDropdown(true)}
              onBlur={() => {
                setTimeout(() => setShowRatingDropdown(false), 150);
              }}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && ratingInput.trim()) {
                  e.preventDefault();
                  const val = ratingInput.trim();
                  if (!apcFormData.additionalRatings.includes(val)) {
                    setApcFormData(p => ({ ...p, additionalRatings: [...p.additionalRatings, val] }));
                  }
                  setRatingInput('');
                  setShowRatingDropdown(false);
                }
              }}
              className="flex-1 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none h-9"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            />
            {showRatingDropdown && (
              <div className="absolute left-0 right-0 top-10 z-20 bg-white rounded-xl shadow-xl border border-gray-100 p-2 max-h-56 overflow-y-auto">
                <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-wider mb-1.5 px-1">
                  {ratingInput.trim() ? `Matching "${ratingInput.trim()}"` : 'Click to add'}
                </p>
                <div className="flex flex-wrap gap-1">
                  {[
                    'Instrument Rating',
                    'Multi-Engine Rating',
                    'Night Rating',
                    'Seaplane Rating',
                    'Tailwheel Endorsement',
                    'High Performance Aircraft Endorsement',
                    'Complex Aircraft Endorsement',
                    'Aerobatic Endorsement',
                    'B737 Type Rating',
                    'B777 Type Rating',
                    'B747 Type Rating',
                    'A320 Type Rating',
                    'A330 Type Rating',
                    'ATR42/72 Type Rating',
                    'CRJ Type Rating',
                  ]
                    .filter((rating) =>
                      rating.toLowerCase().includes(ratingInput.toLowerCase().trim())
                    )
                    .map((rating) => {
                      const isAdded = apcFormData.additionalRatings.includes(rating);
                      return (
                        <button
                          key={rating}
                          type="button"
                          disabled={isAdded}
                          onClick={() => {
                            if (!isAdded) {
                              setApcFormData(p => ({ ...p, additionalRatings: [...p.additionalRatings, rating] }));
                              setRatingInput('');
                            }
                          }}
                          className="px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all"
                          style={{
                            background: isAdded ? '#f3f4f6' : 'rgba(0,0,0,0.03)',
                            color: isAdded ? '#9ca3af' : '#374151',
                            border: `1px solid ${isAdded ? '#e5e7eb' : 'rgba(0,0,0,0.08)'}`,
                            cursor: isAdded ? 'default' : 'pointer',
                          }}
                        >
                          {isAdded ? `${rating} ✓` : rating}
                        </button>
                      );
                    })}
                </div>
                {ratingInput.trim() &&
                  ![
                    'Instrument Rating',
                    'Multi-Engine Rating',
                    'Night Rating',
                    'Seaplane Rating',
                    'Tailwheel Endorsement',
                    'High Performance Aircraft Endorsement',
                    'Complex Aircraft Endorsement',
                    'Aerobatic Endorsement',
                    'B737 Type Rating',
                    'B777 Type Rating',
                    'B747 Type Rating',
                    'A320 Type Rating',
                    'A330 Type Rating',
                    'ATR42/72 Type Rating',
                    'CRJ Type Rating',
                  ].some((r) => r.toLowerCase().includes(ratingInput.toLowerCase().trim())) && (
                    <p className="text-[9px] text-gray-400 mt-2 px-1">
                      Press <span className="font-bold text-gray-600">Enter</span> to add &quot;{ratingInput.trim()}&quot; as custom rating
                    </p>
                  )}
              </div>
            )}
          </div>
          </>
          )}
        </motion.div>

        {/* ── Section 3: Medical Certificate ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Medical Certificate</p>

          {/* I don't hold a medical checkbox */}
          <label className="flex items-center gap-2 mb-2 cursor-pointer">
            <input
              type="checkbox"
              checked={apcFormData.hasNoMedical}
              onChange={(e) => setApcFormData(p => ({ ...p, hasNoMedical: e.target.checked, medicalClass: 'Class 1', medicalExpiry: '' }))}
              className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer"
            />
            <span className="text-[10px] text-gray-700">I don't hold a medical certificate</span>
          </label>

          {!apcFormData.hasNoMedical && (
          <>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">Medical Class</p>
              <div className="flex gap-1.5">
                {['Class 1', 'Class 2', 'Class 3'].map((cls) => (
                  <button
                    key={cls}
                    type="button"
                    onClick={() => setApcFormData(p => ({ ...p, medicalClass: cls }))}
                    className="flex-1 py-1.5 rounded-full text-[10px] font-bold tracking-wider transition-all"
                    style={{
                      background: apcFormData.medicalClass === cls ? '#dc2626' : 'rgba(0,0,0,0.03)',
                      color: apcFormData.medicalClass === cls ? '#fff' : '#6b7280',
                      border: apcFormData.medicalClass === cls ? 'none' : '1px solid rgba(0,0,0,0.08)',
                    }}
                  >
                    {cls}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">Medical Expiry Date</p>
              <input type="text" placeholder="Month/Day/Year" value={apcFormData.medicalExpiry} onChange={(e) => setApcFormData(p => ({ ...p, medicalExpiry: formatDateInput(e.target.value) }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            </div>
          </div>
          </>
          )}

          {/* Radio License */}
          <div className="mt-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1">Radio License Expiry Date (NTC / RT)</p>
            <input
              type="text"
              placeholder="Month/Day/Year"
              value={apcFormData.radioLicenseExpiry}
              disabled={!apcFormData.hasRadioLicense}
              onChange={(e) => setApcFormData(p => ({ ...p, radioLicenseExpiry: formatDateInput(e.target.value) }))}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9 disabled:opacity-40"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            />
            <label className="flex items-center gap-1.5 mt-1.5 cursor-pointer">
              <input
                type="checkbox"
                checked={!apcFormData.hasRadioLicense}
                onChange={(e) => setApcFormData(p => ({ ...p, hasRadioLicense: !e.target.checked, radioLicenseExpiry: e.target.checked ? '' : p.radioLicenseExpiry }))}
                className="w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer"
              />
              <span className="text-[9px] text-gray-600">I don't hold a radio license</span>
            </label>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(2)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(3) && setStep(4)}
            disabled={!canProceed(3)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Core Documents <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}

        {step === 4 && (<motion.div
          key="step4"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 4: Core Documents ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">4. Core Documents</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'License (Front)', file: apcLicenseFile, setter: setApcLicenseFile, icon: IdCard, docType: 'license' },
              { label: 'License (Back)', file: apcLicenseBackFile, setter: setApcLicenseBackFile, icon: IdCard, docType: 'license-back' },
              !apcFormData.hasNoMedical && { label: 'Medical Certificate', file: apcMedicalFile, setter: setApcMedicalFile, icon: Award, docType: 'medical' },
              apcFormData.hasRadioLicense && { label: 'Radio License', file: apcRadioNtcFile, setter: setApcRadioNtcFile, icon: Radio, docType: 'radio-ntc' },
            ].filter(Boolean).map((item) => (
              <label key={item.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${uploadStatus[item.docType] === 'done' || item.file ? 'rgba(34,197,94,0.4)' : uploadStatus[item.docType] === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,0,0,0.2)'}` }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocument(f, item.docType, item.setter); }} />
                {uploadStatus[item.docType] === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[9px] font-medium text-gray-500">Uploading securely...</p>
                  </>
                ) : item.file ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon size={18} className="text-gray-300" />
                    <p className="text-[9px] font-medium text-gray-600">{item.label}</p>
                  </>
                )}
              </label>
            ))}
          </div>

          {/* License & Type Rating Verification Consent */}
          <div className="flex items-center gap-2 mb-2 mt-3">
            <button
              type="button"
              onClick={() => navigate('/license-verification-consent')}
              className="text-[10px] font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              Download/Print License Verification Consent Form
            </button>
            <span className="text-[9px] text-gray-400">— sign, scan, and upload above</span>
          </div>
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={licenseConsentChecked} onChange={(e) => setLicenseConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I authorize <span className="font-bold text-gray-800">APC</span> to verify my license, medical certificate, and radio license with the relevant Civil Aviation Authority. I confirm these documents are authentic and I am the legitimate holder. Falsified or tampered documents may result in profile revocation and reporting to authorities.
              </span>
            </label>
          </div>

          <div className="rounded-xl p-2 flex items-center gap-2" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.12)' }}>
            <ShieldCheck size={14} className="text-green-500 flex-shrink-0" />
            <p className="text-[9px] text-gray-600 leading-snug">
              <span className="font-semibold text-gray-700">Secure storage:</span> Documents are encrypted and automatically deleted <span className="font-bold text-gray-800">30 days</span> after verification is complete.
            </p>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(3)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(4) && setStep(apcFormData.hasNotFlown ? 8 : 5)}
            disabled={!canProceed(4)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            {apcFormData.hasNotFlown ? 'Next: Authorization & Submit' : 'Next: Aircraft Ratings'} <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}
        {step === 5 && (<motion.div
          key="step5"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 5: Aircraft Ratings ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          {/* Recurrency Info */}
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
            <p className="text-[9px] font-bold text-blue-700 mb-1">Will the aircraft be removed from my license if I don&apos;t do recurrency?</p>
            <p className="text-[9px] text-gray-600 mb-1">No. The aircraft class or type ratings will not be removed from your physical license card if you fall out of recurrency. The ratings remain printed on your license permanently, but they become inactive (un-exercisable). You are legally prohibited from acting as a pilot or crew member on those aircraft until you meet the standard Philippine Civil Aviation Regulations (PCAR) currency requirements.</p>
            <p className="text-[9px] font-bold text-gray-700 mb-0.5">The Rating (On the Card)</p>
            <p className="text-[9px] text-gray-600 mb-1">This proves you successfully passed the checkride and ground school required to fly that specific aircraft category, class, or type. It does not vanish because of time.</p>
            <p className="text-[9px] font-bold text-gray-700 mb-0.5">The Privilege (The Legality)</p>
            <p className="text-[9px] text-gray-600">To actually fly that aircraft, your rating must be &quot;current&quot;. Without recurrency, you still &quot;hold&quot; the rating, but you cannot legally use it.</p>
          </div>

          {/* Aircraft Rating Certificates */}
          {apcFormData.additionalRatings.length > 0 && (
            <div className="mt-3">
              <p className="text-[10px] font-semibold text-gray-700 mb-2">Aircraft Rating Certificates</p>
              <div className="grid grid-cols-2 gap-2">
                {apcFormData.additionalRatings.map((rating) => {
                  const docType = `rating-cert-${rating.replace(/[^a-zA-Z0-9]/g, '-')}`;
                  const file = ratingFiles[rating];
                  return (
                    <div key={rating} className="flex flex-col items-center rounded-xl p-3 transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${uploadStatus[docType] === 'done' || file ? 'rgba(34,197,94,0.4)' : uploadStatus[docType] === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,0,0,0.2)'}` }}>
                      <input id={rating} type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          uploadDocument(f, docType, () => {
                            setRatingFiles(prev => ({ ...prev, [rating]: f }));
                          });
                        }
                      }} />
                      <label htmlFor={rating} className="flex flex-col items-center justify-center gap-1 cursor-pointer w-full flex-1">
                        {uploadStatus[docType] === 'uploading' ? (
                          <>
                            <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                            <p className="text-[9px] font-medium text-gray-500">Uploading...</p>
                          </>
                        ) : file ? (
                          <>
                            <BadgeCheck size={18} className="text-green-500" />
                            <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{file.name}</p>
                          </>
                        ) : (
                          <>
                            <Award size={18} className="text-gray-300" />
                            <p className="text-[9px] font-medium text-gray-600">{rating} Certificate</p>
                          </>
                        )}
                      </label>
                      <div className="flex flex-col gap-1 mt-2 self-start w-full">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aircraftRatingActive[rating]?.active || false}
                            onChange={(e) => setAircraftRatingActive(prev => ({ ...prev, [rating]: { ...prev[rating], active: e.target.checked } }))}
                            className="w-3 h-3 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                          <span className="text-[9px] font-semibold text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={aircraftRatingActive[rating]?.recurrency || false}
                            onChange={(e) => setAircraftRatingActive(prev => ({ ...prev, [rating]: { ...prev[rating], recurrency: e.target.checked } }))}
                            className="w-3 h-3 rounded border-gray-300 text-red-600 focus:ring-red-500 cursor-pointer"
                          />
                          <span className="text-[9px] font-semibold text-gray-700">Requires Recurrency</span>
                        </label>
                        {aircraftRatingActive[rating]?.recurrency && (
                          <p className="text-[8px] text-gray-500 mt-0.5 ml-5 leading-tight">
                            Recurrency details collected next step
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}


        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(5) && setStep(6)}
            disabled={!canProceed(5)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Type Ratings & Endorsements <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}
        {step === 6 && (<motion.div
          key="step6"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 6: Type Ratings & Endorsements ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">6. Type Ratings & Endorsements</p>
          {/* Type Ratings & Endorsements */}
          <div className="mt-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-gray-700">Type Ratings & Endorsements</p>
            </div>
            {ratingSets.map((set, setIdx) => (
              <div key={setIdx} className="mb-3">
                {ratingSets.length > 1 && (
                  <p className="text-[9px] font-bold text-gray-500 mb-1">Type Rating {setIdx + 1}</p>
                )}
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { label: 'Certification of Type Rating', file: set.certFile, key: 'certFile' as const, docType: `ratings-cert-${setIdx}` },
                    { label: 'Licensure of Type Rating', file: set.licFile, key: 'licFile' as const, docType: `ratings-lic-${setIdx}` },
                  ].map((item) => (
                    <label key={item.docType} className="flex flex-col items-center justify-center gap-1 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${uploadStatus[item.docType] === 'done' || item.file ? 'rgba(34,197,94,0.4)' : uploadStatus[item.docType] === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,0,0,0.2)'}` }}>
                      <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => {
                        const f = e.target.files?.[0];
                        if (f) {
                          const updated = [...ratingSets];
                          updated[setIdx] = { ...updated[setIdx], [item.key]: f };
                          setRatingSets(updated);
                          uploadDocument(f, item.docType, (file) => {
                            const refreshed = [...ratingSets];
                            refreshed[setIdx] = { ...refreshed[setIdx], [item.key]: file };
                            setRatingSets(refreshed);
                          });
                        }
                      }} />
                      {uploadStatus[item.docType] === 'uploading' ? (
                        <>
                          <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                          <p className="text-[9px] font-medium text-gray-500">Uploading securely...</p>
                        </>
                      ) : item.file ? (
                        <>
                          <BadgeCheck size={18} className="text-green-500" />
                          <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                        </>
                      ) : (
                        <>
                          <BadgeCheck size={18} className="text-gray-300" />
                          <p className="text-[9px] font-medium text-gray-600">{item.label}</p>
                        </>
                      )}
                    </label>
                  ))}
                </div>
                <div className="mt-2">
                  <input
                    type="text"
                    list="training-centers"
                    placeholder="Type Rating Recurrency / Training Center"
                    value={set.trainingCenter}
                    onChange={(e) => {
                      const updated = [...ratingSets];
                      updated[setIdx] = { ...updated[setIdx], trainingCenter: e.target.value };
                      setRatingSets(updated);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                  />
                  <select
                    value={set.country}
                    onChange={(e) => {
                      const updated = [...ratingSets];
                      updated[setIdx] = { ...updated[setIdx], country: e.target.value };
                      setRatingSets(updated);
                    }}
                    className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer h-9 mt-2"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                  >
                    <option value="">Center Location / Country</option>
                    <option value="Afghanistan">Afghanistan</option>
                    <option value="Albania">Albania</option>
                    <option value="Algeria">Algeria</option>
                    <option value="Andorra">Andorra</option>
                    <option value="Angola">Angola</option>
                    <option value="Antigua and Barbuda">Antigua and Barbuda</option>
                    <option value="Argentina">Argentina</option>
                    <option value="Armenia">Armenia</option>
                    <option value="Australia">Australia</option>
                    <option value="Austria">Austria</option>
                    <option value="Azerbaijan">Azerbaijan</option>
                    <option value="Bahamas">Bahamas</option>
                    <option value="Bahrain">Bahrain</option>
                    <option value="Bangladesh">Bangladesh</option>
                    <option value="Barbados">Barbados</option>
                    <option value="Belarus">Belarus</option>
                    <option value="Belgium">Belgium</option>
                    <option value="Belize">Belize</option>
                    <option value="Benin">Benin</option>
                    <option value="Bhutan">Bhutan</option>
                    <option value="Bolivia">Bolivia</option>
                    <option value="Bosnia and Herzegovina">Bosnia and Herzegovina</option>
                    <option value="Botswana">Botswana</option>
                    <option value="Brazil">Brazil</option>
                    <option value="Brunei">Brunei</option>
                    <option value="Bulgaria">Bulgaria</option>
                    <option value="Burkina Faso">Burkina Faso</option>
                    <option value="Burundi">Burundi</option>
                    <option value="Cambodia">Cambodia</option>
                    <option value="Cameroon">Cameroon</option>
                    <option value="Canada">Canada</option>
                    <option value="Cape Verde">Cape Verde</option>
                    <option value="Central African Republic">Central African Republic</option>
                    <option value="Chad">Chad</option>
                    <option value="Chile">Chile</option>
                    <option value="China">China</option>
                    <option value="Colombia">Colombia</option>
                    <option value="Comoros">Comoros</option>
                    <option value="Congo">Congo</option>
                    <option value="Costa Rica">Costa Rica</option>
                    <option value="Croatia">Croatia</option>
                    <option value="Cuba">Cuba</option>
                    <option value="Cyprus">Cyprus</option>
                    <option value="Czech Republic">Czech Republic</option>
                    <option value="Denmark">Denmark</option>
                    <option value="Djibouti">Djibouti</option>
                    <option value="Dominica">Dominica</option>
                    <option value="Dominican Republic">Dominican Republic</option>
                    <option value="Ecuador">Ecuador</option>
                    <option value="Egypt">Egypt</option>
                    <option value="El Salvador">El Salvador</option>
                    <option value="Equatorial Guinea">Equatorial Guinea</option>
                    <option value="Eritrea">Eritrea</option>
                    <option value="Estonia">Estonia</option>
                    <option value="Eswatini">Eswatini</option>
                    <option value="Ethiopia">Ethiopia</option>
                    <option value="Fiji">Fiji</option>
                    <option value="Finland">Finland</option>
                    <option value="France">France</option>
                    <option value="Gabon">Gabon</option>
                    <option value="Gambia">Gambia</option>
                    <option value="Georgia">Georgia</option>
                    <option value="Germany">Germany</option>
                    <option value="Ghana">Ghana</option>
                    <option value="Greece">Greece</option>
                    <option value="Guatemala">Guatemala</option>
                    <option value="Guinea">Guinea</option>
                    <option value="Guyana">Guyana</option>
                    <option value="Haiti">Haiti</option>
                    <option value="Honduras">Honduras</option>
                    <option value="Hungary">Hungary</option>
                    <option value="Iceland">Iceland</option>
                    <option value="India">India</option>
                    <option value="Indonesia">Indonesia</option>
                    <option value="Iran">Iran</option>
                    <option value="Iraq">Iraq</option>
                    <option value="Ireland">Ireland</option>
                    <option value="Israel">Israel</option>
                    <option value="Italy">Italy</option>
                    <option value="Jamaica">Jamaica</option>
                    <option value="Japan">Japan</option>
                    <option value="Jordan">Jordan</option>
                    <option value="Kazakhstan">Kazakhstan</option>
                    <option value="Kenya">Kenya</option>
                    <option value="Kiribati">Kiribati</option>
                    <option value="Kuwait">Kuwait</option>
                    <option value="Kyrgyzstan">Kyrgyzstan</option>
                    <option value="Laos">Laos</option>
                    <option value="Latvia">Latvia</option>
                    <option value="Lebanon">Lebanon</option>
                    <option value="Lesotho">Lesotho</option>
                    <option value="Liberia">Liberia</option>
                    <option value="Libya">Libya</option>
                    <option value="Liechtenstein">Liechtenstein</option>
                    <option value="Lithuania">Lithuania</option>
                    <option value="Luxembourg">Luxembourg</option>
                    <option value="Madagascar">Madagascar</option>
                    <option value="Malawi">Malawi</option>
                    <option value="Malaysia">Malaysia</option>
                    <option value="Maldives">Maldives</option>
                    <option value="Mali">Mali</option>
                    <option value="Malta">Malta</option>
                    <option value="Marshall Islands">Marshall Islands</option>
                    <option value="Mauritania">Mauritania</option>
                    <option value="Mauritius">Mauritius</option>
                    <option value="Mexico">Mexico</option>
                    <option value="Micronesia">Micronesia</option>
                    <option value="Moldova">Moldova</option>
                    <option value="Monaco">Monaco</option>
                    <option value="Mongolia">Mongolia</option>
                    <option value="Montenegro">Montenegro</option>
                    <option value="Morocco">Morocco</option>
                    <option value="Mozambique">Mozambique</option>
                    <option value="Myanmar">Myanmar</option>
                    <option value="Namibia">Namibia</option>
                    <option value="Nauru">Nauru</option>
                    <option value="Nepal">Nepal</option>
                    <option value="Netherlands">Netherlands</option>
                    <option value="New Zealand">New Zealand</option>
                    <option value="Nicaragua">Nicaragua</option>
                    <option value="Niger">Niger</option>
                    <option value="Nigeria">Nigeria</option>
                    <option value="North Macedonia">North Macedonia</option>
                    <option value="Norway">Norway</option>
                    <option value="Oman">Oman</option>
                    <option value="Pakistan">Pakistan</option>
                    <option value="Palau">Palau</option>
                    <option value="Panama">Panama</option>
                    <option value="Papua New Guinea">Papua New Guinea</option>
                    <option value="Paraguay">Paraguay</option>
                    <option value="Peru">Peru</option>
                    <option value="Philippines">Philippines</option>
                    <option value="Poland">Poland</option>
                    <option value="Portugal">Portugal</option>
                    <option value="Qatar">Qatar</option>
                    <option value="Romania">Romania</option>
                    <option value="Russia">Russia</option>
                    <option value="Rwanda">Rwanda</option>
                    <option value="Saint Kitts and Nevis">Saint Kitts and Nevis</option>
                    <option value="Saint Lucia">Saint Lucia</option>
                    <option value="Saint Vincent and the Grenadines">Saint Vincent and the Grenadines</option>
                    <option value="Samoa">Samoa</option>
                    <option value="San Marino">San Marino</option>
                    <option value="Sao Tome and Principe">Sao Tome and Principe</option>
                    <option value="Saudi Arabia">Saudi Arabia</option>
                    <option value="Senegal">Senegal</option>
                    <option value="Serbia">Serbia</option>
                    <option value="Seychelles">Seychelles</option>
                    <option value="Sierra Leone">Sierra Leone</option>
                    <option value="Singapore">Singapore</option>
                    <option value="Slovakia">Slovakia</option>
                    <option value="Slovenia">Slovenia</option>
                    <option value="Solomon Islands">Solomon Islands</option>
                    <option value="Somalia">Somalia</option>
                    <option value="South Africa">South Africa</option>
                    <option value="South Korea">South Korea</option>
                    <option value="Spain">Spain</option>
                    <option value="Sri Lanka">Sri Lanka</option>
                    <option value="Sudan">Sudan</option>
                    <option value="Suriname">Suriname</option>
                    <option value="Sweden">Sweden</option>
                    <option value="Switzerland">Switzerland</option>
                    <option value="Syria">Syria</option>
                    <option value="Tajikistan">Tajikistan</option>
                    <option value="Tanzania">Tanzania</option>
                    <option value="Thailand">Thailand</option>
                    <option value="Timor-Leste">Timor-Leste</option>
                    <option value="Togo">Togo</option>
                    <option value="Tonga">Tonga</option>
                    <option value="Trinidad and Tobago">Trinidad and Tobago</option>
                    <option value="Tunisia">Tunisia</option>
                    <option value="Turkey">Turkey</option>
                    <option value="Turkmenistan">Turkmenistan</option>
                    <option value="Tuvalu">Tuvalu</option>
                    <option value="Uganda">Uganda</option>
                    <option value="Ukraine">Ukraine</option>
                    <option value="United Arab Emirates">United Arab Emirates</option>
                    <option value="United Kingdom">United Kingdom</option>
                    <option value="United States">United States</option>
                    <option value="Uruguay">Uruguay</option>
                    <option value="Uzbekistan">Uzbekistan</option>
                    <option value="Vanuatu">Vanuatu</option>
                    <option value="Vatican City">Vatican City</option>
                    <option value="Venezuela">Venezuela</option>
                    <option value="Vietnam">Vietnam</option>
                    <option value="Yemen">Yemen</option>
                    <option value="Zambia">Zambia</option>
                    <option value="Zimbabwe">Zimbabwe</option>
                  </select>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setRatingSets([...ratingSets, { certFile: null, licFile: null, trainingCenter: '', country: '' }])}
              className="w-full py-2 rounded-xl text-[10px] font-semibold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-1"
              style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
            >
              + Add Another Type Rating
            </button>
          </div>

        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(4)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(5) && setStep(6)}
            disabled={!canProceed(5)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Flight Hours & Logbook <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}

        {step === 7 && (<motion.div
          key="step7"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >

        {/* ── Step 7: Flight Hours & Logbook ── */}
        {/* ── Section 5: Flight Hours Summary ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={3}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">7. Flight Hours Summary</p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <th className="text-left px-3 py-2 text-gray-600 font-semibold">Category</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-semibold">Hours</th>
                </tr>
              </thead>
              <tbody>
                {renderHoursRow('Total Flight Time', 'totalHours')}
                {renderHoursRow('PIC (Pilot in Command)', 'picHours')}
                {renderHoursRow('Dual Time (LCL)', 'dualHours')}
                {renderHoursRow('Dual XC', 'dualXcHours')}
                {renderHoursRow('Cross-Country (XC)', 'crossCountryHours')}
                {showAdvancedHours && (
                  <>
                    {renderHoursRow('Night', 'nightHours')}
                    {renderHoursRow('Instrument (SIM)', 'instrumentSimHours')}
                    {renderHoursRow('Instrument (Actual)', 'instrumentActualHours')}
                    {renderHoursRow('Multi Engine (SIM)', 'multiEngineSimHours')}
                    {renderHoursRow('Multi Engine (Actual)', 'multiEngineActualHours')}
                  </>
                )}
              </tbody>
            </table>
          </div>
          <button
            type="button"
            onClick={() => setShowAdvancedHours(!showAdvancedHours)}
            className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700 transition-colors"
          >
            {showAdvancedHours ? '− Hide Advanced' : '+ Advanced (Night, Instrument, Multi Engine)'}
          </button>
        </motion.div>

        {/* ── Section 6: Logbook Upload ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={4}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">6. Logbook Upload</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Logbook — Scanned or CSV', file: apcLogbookFile, setter: setApcLogbookFile, icon: Briefcase, docType: 'logbook' },
              { label: 'Signed Consent Form', file: apcConsentFile, setter: setApcConsentFile, icon: UserCheck, docType: 'consent' },
            ].map((item) => (
              <label key={item.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${uploadStatus[item.docType] === 'done' || item.file ? 'rgba(34,197,94,0.4)' : uploadStatus[item.docType] === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,0,0,0.2)'}` }}>
                <input type="file" accept={item.docType === 'logbook' ? '.pdf,.jpg,.jpeg,.png,.csv' : '.pdf,.jpg,.jpeg,.png'} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocument(f, item.docType, item.setter); }} />
                {uploadStatus[item.docType] === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[9px] font-medium text-gray-500">Uploading securely...</p>
                  </>
                ) : item.file ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon size={18} className="text-gray-300" />
                    <p className="text-[9px] font-medium text-gray-600">{item.label}</p>
                  </>
                )}
              </label>
            ))}
          </div>
          <div className="flex justify-center mt-2">
            <button
              type="button"
              onClick={() => navigate('/logbook-consent')}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-red-500 hover:text-red-600 transition-colors"
            >
              Fill out consent form for logbook audit →
            </button>
          </div>

          {/* Logbook Consent Checkbox */}
          <div className="rounded-xl p-3 mb-3 mt-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={logbookConsentChecked} onChange={(e) => setLogbookConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I authorize <span className="font-bold text-gray-800">APC</span> to audit my flight logbook for verification of hours, training records, and endorsements. I confirm all entries are authentic and accurate. Falsified or tampered logbooks may result in profile revocation and reporting to authorities.
              </span>
            </label>
          </div>

          {/* Logbook Export Instructions Link */}
          <button
            onClick={() => setShowLogbookModal(true)}
            className="mt-3 w-full inline-flex items-center justify-center gap-1.5 rounded-xl p-2.5 text-[10px] font-bold text-blue-700 transition-all hover:bg-blue-50"
            style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}
          >
            <BookOpen size={14} />
            How to Export Your Logbook
          </button>

          {/* Logbook Export Modal */}
          <AnimatePresence>
            {showLogbookModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 flex items-center justify-center p-4"
                style={{ background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)' }}
                onClick={() => setShowLogbookModal(false)}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 10 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: 10 }}
                  transition={{ duration: 0.2 }}
                  className="relative w-full max-w-md rounded-2xl p-5 shadow-2xl"
                  style={{ background: '#fff', border: '1px solid rgba(0,0,0,0.08)' }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex items-center justify-between mb-4">
                    <p className="text-xs font-black text-gray-900 uppercase tracking-wider">How to Export Your Logbook</p>
                    <button
                      onClick={() => setShowLogbookModal(false)}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <X size={16} className="text-gray-400" />
                    </button>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-600">1</span>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-700">ForeFlight</p>
                      </div>
                      <ol className="text-[9px] text-gray-500 leading-snug ml-7 space-y-0.5">
                        <li>Open ForeFlight and tap the <span className="font-medium text-gray-700">More</span> tab at the bottom</li>
                        <li>Select <span className="font-medium text-gray-700">Logbook</span> from the menu</li>
                        <li>Tap the <span className="font-medium text-gray-700">Actions</span> button (three dots) in the top right</li>
                        <li>Choose <span className="font-medium text-gray-700">Export</span></li>
                        <li>Select <span className="font-medium text-gray-700">CSV format</span> and tap Export</li>
                        <li>Upload the downloaded .csv file here</li>
                      </ol>
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1.5">
                        <div className="flex-shrink-0 w-5 h-5 rounded-full bg-blue-500/10 flex items-center justify-center">
                          <span className="text-[8px] font-bold text-blue-600">2</span>
                        </div>
                        <p className="text-[10px] font-semibold text-gray-700">LogTen Pro</p>
                      </div>
                      <ol className="text-[9px] text-gray-500 leading-snug ml-7 space-y-0.5">
                        <li>Open LogTen Pro on your device or web browser</li>
                        <li>Go to <span className="font-medium text-gray-700">Settings</span> in the main menu</li>
                        <li>Select <span className="font-medium text-gray-700">Export Logbook</span></li>
                        <li>Choose <span className="font-medium text-gray-700">CSV (Comma Separated Values)</span> as the format</li>
                        <li>Tap Export and save the file</li>
                        <li>Upload the exported .csv file here</li>
                      </ol>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowLogbookModal(false)}
                    className="mt-4 w-full py-2.5 rounded-xl text-[10px] font-bold text-white transition-all hover:brightness-110"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  >
                    Got it
                  </button>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(6)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(7) && setStep(8)}
            disabled={!canProceed(7)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Authorization & Submit <ArrowRight size={14} />
          </button>
        </div>
        </motion.div>)}

        {step === 8 && (<motion.div
          key="step8"
          initial={{ opacity: 0, x: 40 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -40 }}
          transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
        {/* ── Step 8: ATO Authorization ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={5}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">8. ATO Authorization</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <select
              value={atoCountry}
              onChange={(e) => {
                const country = e.target.value;
                setAtoCountry(country);
                setApcFormData(p => ({ ...p, atoLocation: country, atoName: '' }));
              }}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer h-9"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <option value="">Select Country</option>
              <option value="Philippines">Philippines</option>
              <option value="United States">United States</option>
              <option value="United Kingdom">United Kingdom</option>
              <option value="Canada">Canada</option>
              <option value="Australia">Australia</option>
              <option value="United Arab Emirates">United Arab Emirates</option>
              <option value="Singapore">Singapore</option>
              <option value="South Africa">South Africa</option>
              <option value="Malaysia">Malaysia</option>
              <option value="Thailand">Thailand</option>
              <option value="Indonesia">Indonesia</option>
              <option value="India">India</option>
              <option value="New Zealand">New Zealand</option>
              <option value="Germany">Germany</option>
              <option value="France">France</option>
              <option value="Spain">Spain</option>
              <option value="Other">Other — Not Listed</option>
            </select>
            <select
              value={apcFormData.atoName}
              onChange={(e) => setApcFormData(p => ({ ...p, atoName: e.target.value }))}
              disabled={!atoCountry}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer h-9 disabled:opacity-40 disabled:cursor-not-allowed"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            >
              <option value="">
                {atoCountry ? (FLIGHT_SCHOOLS[atoCountry] ? 'Select Flight School / ATO' : 'Enter manually below') : 'Select country first'}
              </option>
              {FLIGHT_SCHOOLS[atoCountry]?.map((school) => (
                <option key={school} value={school}>{school}</option>
              ))}
              {atoCountry && !FLIGHT_SCHOOLS[atoCountry] && (
                <option value="__manual__">— Type custom name below —</option>
              )}
            </select>
          </div>
          {(!atoCountry || !FLIGHT_SCHOOLS[atoCountry] || apcFormData.atoName === '__manual__') && (
            <input
              type="text"
              placeholder="Custom ATO / Flight School Name"
              value={apcFormData.atoName === '__manual__' ? '' : apcFormData.atoName}
              onChange={(e) => setApcFormData(p => ({ ...p, atoName: e.target.value }))}
              className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9 mb-3"
              style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
            />
          )}
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1.5">What data should APC request from the ATO?</p>
            <select value={apcFormData.atoDataNeeded} onChange={(e) => setApcFormData(p => ({ ...p, atoDataNeeded: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <option value="total_flight_hours">Total Flight Hours</option>
              <option value="rating_completion_dates">Rating Completion Dates</option>
              <option value="certificate_numbers">Certificate Numbers</option>
              <option value="simulator_profiles">Simulator Training Profiles</option>
              <option value="all_records">All Available Training Records</option>
            </select>
          </div>

          {/* Additional ATOs */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              <p className="text-[10px] font-semibold text-gray-700">Additional ATO / Operator for Verification</p>
              <span className="text-[9px] font-bold text-red-500 bg-red-50 px-2 py-0.5 rounded-full">+$15 each</span>
            </div>
            {additionalATOs.map((ato, idx) => (
              <div key={idx} className="grid grid-cols-2 gap-2 mb-2">
                <input
                  type="text"
                  placeholder="ATO Name"
                  value={ato.name}
                  onChange={(e) => {
                    const updated = [...additionalATOs];
                    updated[idx].name = e.target.value;
                    setAdditionalATOs(updated);
                  }}
                  className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9"
                  style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                />
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Location / Country"
                    value={ato.location}
                    onChange={(e) => {
                      const updated = [...additionalATOs];
                      updated[idx].location = e.target.value;
                      setAdditionalATOs(updated);
                    }}
                    className="flex-1 rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9"
                    style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                  />
                  <button
                    type="button"
                    onClick={() => setAdditionalATOs(prev => prev.filter((_, i) => i !== idx))}
                    className="px-2 rounded-lg text-xs font-bold text-gray-400 hover:text-red-500 transition-colors"
                  >
                    ×
                  </button>
                </div>
              </div>
            ))}
            <button
              type="button"
              onClick={() => setAdditionalATOs(prev => [...prev, { name: '', location: '' }])}
              className="inline-flex items-center gap-1 text-[10px] font-semibold text-gray-500 hover:text-gray-700 transition-colors"
            >
              + Add another ATO
            </button>
          </div>

          <div className="flex items-center gap-2 mb-3">
            <button
              type="button"
              onClick={() => navigate('/consent-form')}
              className="text-[10px] font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
            >
              Download/Print ATO Consent Form
            </button>
            <span className="text-[9px] text-gray-400">— sign, scan, and upload above</span>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={atoConsentChecked} onChange={(e) => setAtoConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I authorize <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to contact the ATO named above and send my uploaded documents for logbook verification. I understand that the ATO will send verification results directly to my email address, and APC will receive only a confirmation that verification was completed.
              </span>
            </label>
          </div>
        </motion.div>

        {/* ── Section 7: Privacy & Data Protection ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={6}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">7. Privacy & Data Protection</p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.12)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-3">
              <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> is registered as a Data Controller with the Data Protection Office of Mauritius. Documents are encrypted, and all raw files are permanently deleted <span className="font-semibold">30 days</span> after verification is complete. For full details, see <button onClick={() => navigate('/about-verification')} className="text-red-500 hover:underline font-semibold">About Verification</button>.
            </p>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={privacyConsentChecked} onChange={(e) => setPrivacyConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-red-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I have read and agree to the Privacy Notice. I understand how APC collects, uses, and retains my data, including the 30-day purge policy.
              </span>
            </label>
          </div>
        </motion.div>

        {/* ── Section 8: Authorization & Consent ── */}
        <motion.div className="mb-6 text-left" variants={fadeUp} custom={7}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">8. Authorization & Consent</p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <label className="flex items-start gap-2 cursor-pointer mb-2">
              <input type="checkbox" checked={apcConsentChecked} onChange={(e) => setApcConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-blue-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I authorize <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to contact my issuing aviation authority and ATO to verify my pilot credentials, flight hours, and training records on my behalf. I confirm all information provided is accurate.
              </span>
            </label>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div className="flex flex-col items-center gap-2 pb-2" variants={fadeUp} custom={8}>
          {submitStatus === 'success' && (
            <p className="text-[10px] font-semibold text-green-600">Verification request submitted successfully!</p>
          )}
          {submitStatus === 'error' && (
            <p className="text-[10px] font-semibold text-red-600">Submission failed. Please try again.</p>
          )}
          <motion.button
            onClick={handleSubmit}
            disabled={submitStatus === 'submitting' || submitStatus === 'success' || !apcEmail || !apcLicenseFile || !apcLicenseBackFile || !apcRadioNtcFile || !apcLogbookFile || !apcConsentChecked || !atoConsentChecked || !licenseConsentChecked || !logbookConsentChecked || !privacyConsentChecked || !apcFormData.atoName}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: submitStatus === 'success' ? 'linear-gradient(135deg, #22c55e, #16a34a)' : 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
            whileHover={apcEmail && apcLicenseFile && apcLicenseBackFile && apcRadioNtcFile && apcLogbookFile && apcConsentChecked && atoConsentChecked && licenseConsentChecked && logbookConsentChecked && privacyConsentChecked && apcFormData.atoName && submitStatus !== 'submitting' ? { scale: 1.03 } : {}}
            whileTap={apcEmail && apcLicenseFile && apcLicenseBackFile && apcRadioNtcFile && apcLogbookFile && apcConsentChecked && atoConsentChecked && licenseConsentChecked && logbookConsentChecked && privacyConsentChecked && apcFormData.atoName && submitStatus !== 'submitting' ? { scale: 0.98 } : {}}
          >
            {submitStatus === 'submitting' ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                SUBMITTING...
              </>
            ) : submitStatus === 'success' ? (
              <>
                <BadgeCheck size={14} /> SUBMITTED
              </>
            ) : (
              <>
                SUBMIT & CONTINUE <ArrowRight size={14} />
              </>
            )}
          </motion.button>
        </motion.div>

        <div className="flex justify-start">
          <button
            type="button"
            onClick={() => setStep(apcFormData.hasNotFlown ? 4 : 7)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
        </div>
        </motion.div>)}
        </AnimatePresence>
        )}

        </div>
      </div>
      </motion.div>
    </div>
  );
}
