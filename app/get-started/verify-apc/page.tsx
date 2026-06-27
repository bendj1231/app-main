import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import {
  ArrowRight, ShieldCheck, Briefcase, BadgeCheck, UserCheck, IdCard, Award, Radio, ExternalLink,
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
  const [atoConsentChecked, setAtoConsentChecked] = useState(false);
  const [licenseConsentChecked, setLicenseConsentChecked] = useState(false);
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
  });
  const [additionalATOs, setAdditionalATOs] = useState<{ name: string; location: string }[]>([]);
  const [ratingInput, setRatingInput] = useState('');
  const [showAdvancedHours, setShowAdvancedHours] = useState(false);
  const [atoCountry, setAtoCountry] = useState('');
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const stepTitles = ['Personal Details', 'License & Medical', 'Documents & Logbook', 'Authorization & Submit'];

  const canProceed = (currentStep: number) => {
    switch (currentStep) {
      case 1:
        return !!apcFormData.fullName && !!apcEmail && !!apcFormData.phone && !!apcFormData.nationality;
      case 2:
        return !!apcFormData.licenseNumber && !!apcFormData.licenseExpiryDate && !!apcFormData.medicalClass && !!apcFormData.medicalExpiry;
      case 3:
        return !!apcLicenseFile && !!apcLicenseBackFile && !!apcRadioNtcFile && !!apcLogbookFile && licenseConsentChecked && logbookConsentChecked;
      case 4:
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
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
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
        className="relative z-10 max-w-5xl mx-auto w-full"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Card */}
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-8" style={{ border: '1px solid rgba(255,255,255,0.3)' }}>
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

        <motion.div className="text-center mb-8" variants={fadeUp} custom={0}>
          <p className="text-xs font-black tracking-widest mb-2" style={{ color: '#dc2626' }}>
            RECOGNITION+
          </p>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
            Pilot Verification Form
          </h1>
          <p className="text-sm text-gray-500">
            Complete your verification with <span className="font-semibold text-gray-700">Aviation Pathways Consultancy (APC)</span>
          </p>
        </motion.div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
              Step {step} of {totalSteps}: {stepTitles[step - 1]}
            </p>
            <p className="text-[10px] font-bold text-gray-400">{Math.round((step / totalSteps) * 100)}% complete</p>
          </div>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500 ease-out"
              style={{
                width: `${(step / totalSteps) * 100}%`,
                background: 'linear-gradient(135deg, #dc2626, #b91c1c)',
              }}
            />
          </div>
          <div className="flex justify-between mt-2">
            {stepTitles.map((title, i) => (
              <div key={title} className="flex flex-col items-center" style={{ width: `${100 / totalSteps}%` }}>
                <div
                  className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mb-1 transition-all"
                  style={{
                    background: step > i + 1 ? '#dc2626' : step === i + 1 ? '#dc2626' : 'rgba(0,0,0,0.06)',
                    color: step >= i + 1 ? '#fff' : '#9ca3af',
                  }}
                >
                  {step > i + 1 ? '✓' : i + 1}
                </div>
                <p className={`text-[8px] font-semibold text-center leading-tight ${step >= i + 1 ? 'text-gray-800' : 'text-gray-400'}`}>{title}</p>
              </div>
            ))}
          </div>
        </div>

        {step === 1 && (<>
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
            <input type="text" placeholder="Nationality" value={apcFormData.nationality} onChange={(e) => setApcFormData(p => ({ ...p, nationality: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
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
            Next: License & Medical <ArrowRight size={14} />
          </button>
        </div>
        </>)}

        {step === 2 && (<>
        {/* ── Step 2: License Information ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">2. License Information</p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">License Number</p>
              <input type="text" placeholder="Pilot License Number" value={apcFormData.licenseNumber} onChange={(e) => setApcFormData(p => ({ ...p, licenseNumber: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-500 outline-none h-9" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-gray-700 mb-1">License Expiry Date</p>
              <input type="date" value={apcFormData.licenseExpiryDate} onChange={(e) => setApcFormData(p => ({ ...p, licenseExpiryDate: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none h-9 leading-none appearance-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
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
          <p className="text-[10px] font-semibold text-gray-700 mb-1.5">Additional Ratings & Type Ratings</p>
          {/* Selected tags */}
          <div className="flex flex-wrap gap-1.5 mb-2">
            {apcFormData.additionalRatings.map((r) => (
              <span key={r} className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-semibold text-gray-700 bg-gray-100 border border-gray-200">
                {r}
                <button
                  type="button"
                  onClick={() => setApcFormData(p => ({ ...p, additionalRatings: p.additionalRatings.filter(x => x !== r) }))}
                  className="text-gray-400 hover:text-red-500"
                >×</button>
              </span>
            ))}
          </div>
          <input
            type="text"
            placeholder="Type and press Enter (e.g. Instrument Rating, B737, B777...)"
            value={ratingInput}
            onChange={(e) => setRatingInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && ratingInput.trim()) {
                e.preventDefault();
                const val = ratingInput.trim();
                if (!apcFormData.additionalRatings.includes(val)) {
                  setApcFormData(p => ({ ...p, additionalRatings: [...p.additionalRatings, val] }));
                }
                setRatingInput('');
              }
            }}
            list="rating-suggestions"
            className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none h-9"
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
          />
          <datalist id="rating-suggestions">
            <option value="Instrument Rating" />
            <option value="Multi-Engine Rating" />
            <option value="High Performance Aircraft Endorsement" />
            <option value="Seaplane Rating" />
            <option value="Tailwheel Endorsement" />
            <option value="B737 Type Rating" />
            <option value="B777 Type Rating" />
            <option value="B747 Type Rating" />
            <option value="A320 Type Rating" />
            <option value="A330 Type Rating" />
            <option value="ATR42/72 Type Rating" />
            <option value="CRJ Type Rating" />
          </datalist>
        </motion.div>

        {/* ── Section 3: Medical Certificate ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Medical Certificate</p>
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
              <input type="date" value={apcFormData.medicalExpiry} onChange={(e) => setApcFormData(p => ({ ...p, medicalExpiry: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none h-9 leading-none appearance-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            </div>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
          <button
            type="button"
            onClick={() => canProceed(2) && setStep(3)}
            disabled={!canProceed(2)}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Next: Documents & Logbook <ArrowRight size={14} />
          </button>
        </div>
        </>)}

        {step === 3 && (<>
        {/* ── Step 3: Pilot Documents & Ratings ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Pilot Documents & Ratings</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'License (Front)', file: apcLicenseFile, setter: setApcLicenseFile, icon: IdCard, docType: 'license' },
              { label: 'License (Back)', file: apcLicenseBackFile, setter: setApcLicenseBackFile, icon: IdCard, docType: 'license-back' },
              { label: 'Medical Certificate', file: apcMedicalFile, setter: setApcMedicalFile, icon: Award, docType: 'medical' },
              { label: 'Radio License', file: apcRadioNtcFile, setter: setApcRadioNtcFile, icon: Radio, docType: 'radio-ntc' },
            ].map((item) => (
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
                The pilot authorizes <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to use the pilot's license, type ratings, medical certificate, and related documents for verification with the designated Civil Aviation Authority (CAA). The pilot confirms these documents are authentic and the pilot is the legitimate holder. The pilot understands that submitting falsified, fraudulent, expired, blacklisted, missing, stolen, or tampered documents is a criminal offense and will result in immediate revocation of the pilot's PilotRecognition profile and wallet credentials, and may be reported to regulatory and law enforcement authorities by APC, the governing <span className="font-bold text-gray-800">Approved Aviation Body</span>. The pilot acknowledges that if discrepancies are found — including documents identified as falsified, expired, blacklisted, missing, stolen, or tampered by the <span className="font-bold text-gray-800">Approved Aviation Body</span> — the pilot's account will be flagged for review for 30 days to fix necessary issues, and a <span className="font-bold text-gray-800">$50 reverification fee</span> applies for manual re-review. While under review the pilot may still submit to pathways, but the pilot's profile will carry a verification flag visible to <span className="font-bold text-gray-800">Approved Aviation Bodies</span> and airlines for safety and compliance. After 30 days, unresolved issues may restrict pathway submissions. To fully clear the pilot's account of all flags and restrictions, the pilot is required to pay the full verification fee again for a complete clean re-verification; upon re-uploading corrected documents and declaring all issues resolved, the pilot's account will be cleared, subject to successful verification. The <span className="font-bold text-gray-800">Approved Aviation Body</span> responsible for conducting or reviewing the verification will receive a <span className="font-bold text-gray-800">10% incentive on verification fees</span> when the pilot achieves full verification compliance across all submitted documents, as a reward for clean, accurate verification outcomes.
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

        {/* ── Section 5: Flight Hours Summary ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={3}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">5. Flight Hours Summary</p>
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
                The pilot authorizes <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to audit the pilot's flight logbook and submit it to the designated ATO and CAA for verification of flight hours, training records, and endorsements. The pilot confirms the logbook entries are authentic and accurate. The pilot understands that submitting falsified, fraudulent, expired, blacklisted, missing, stolen, or tampered logbook entries or documents is a criminal offense and will result in immediate revocation of the pilot's PilotRecognition profile and wallet credentials, and may be reported to regulatory and law enforcement authorities by APC, the governing <span className="font-bold text-gray-800">Approved Aviation Body</span>. The pilot acknowledges that if discrepancies are found — including logbook entries identified as falsified, expired, blacklisted, missing, stolen, or tampered by the <span className="font-bold text-gray-800">Approved Aviation Body</span> — the pilot's account will be flagged for review for 30 days, and a <span className="font-bold text-gray-800">$50 reverification fee</span> applies for manual re-review. While under review the pilot may still submit to pathways, but the pilot's profile will carry a verification flag visible to <span className="font-bold text-gray-800">Approved Aviation Bodies</span> and airlines. To fully clear the pilot's account of all flags, the pilot is required to pay the full verification fee again for a complete clean re-verification; upon re-uploading corrected documents and declaring all issues resolved, the pilot's account will be cleared, subject to successful verification. The <span className="font-bold text-gray-800">Approved Aviation Body</span> responsible for conducting or reviewing the verification will receive a <span className="font-bold text-gray-800">10% incentive on verification fees</span> when the pilot achieves full verification compliance across all submitted documents, as a reward for clean, accurate verification outcomes.
              </span>
            </label>
          </div>

          {/* Logbook Export Instructions */}
          <div className="mt-3 rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <p className="text-[10px] font-black text-gray-900 uppercase tracking-wider mb-2">How to Export Your Logbook</p>
            <div className="space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-1">
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
                <div className="flex items-center gap-2 mb-1">
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
            Next: Authorization & Submit <ArrowRight size={14} />
          </button>
        </div>
        </>)}

        {step === 4 && (<>
        {/* ── Step 4: ATO Authorization ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={5}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">4. ATO Authorization</p>
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
            onClick={() => setStep(3)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold tracking-wider text-gray-600 transition-all hover:bg-gray-100"
            style={{ background: 'rgba(0,0,0,0.04)', border: '1px solid rgba(0,0,0,0.08)' }}
          >
            <ArrowRight size={14} className="rotate-180" /> Back
          </button>
        </div>
        </>)}

        </div>
      </motion.div>
    </div>
  );
}
