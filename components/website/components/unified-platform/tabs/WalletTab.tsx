import React from 'react';
import { motion } from 'framer-motion';
import {
  Home, User, Shield, Map, BookOpen, Plane, Wrench, FileText,
  BookMarked, Calendar, Newspaper, Settings, LogOut, Bell, Search,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Clock,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Star, Target,
  BarChart3, Building2, Zap, Globe, Menu, X, Filter, Download,
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye,
  Brain, FolderOpen, PlayCircle, GraduationCap, Activity, Image,
  CreditCard, Mail, Server, Database, Cloud, MessageSquare, Users
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { safeRedirect } from '@/lib/url-validator';
import { WalletPageWithSidebar } from '../../wallet/WalletPageWithSidebar';
import { PilotLicensureExperiencePage } from '../../pilot-recognition/PilotLicensureExperiencePage';
import { LogbookPreviewPanel, CredentialRequestCard, NotificationsFeedPanel } from '../shared';
import type { TabId } from '../types';

const ATO_LIST = [
  'Philippine Airlines Training Centre', 'CAE Oxford Aviation Academy', 'Emirates Flight Training Academy',
  'FlightPath International', 'Lufthansa Aviation Training', 'Philippine Academy of Aviation Technology',
  'Asia Pacific Aviation Centre', 'CAA Approved Local ATO', 'Other / Not Listed',
];

export const WalletTab: React.FC<{ walletChecks: any[]; profile: any; pendingRequests?: any[]; hasActiveSession?: boolean }> = ({ walletChecks, profile, pendingRequests = [], hasActiveSession = false }) => {
  const { callApi } = useWorkerAuth();
  // 'landing' | 'credentials' | 'documents' | 'verification'
  const [screen, setScreen] = React.useState<'landing' | 'credentials' | 'documents' | 'verification'>('landing');
  const [vaultUnlocking, setVaultUnlocking] = React.useState(false);
  const [unlockStep, setUnlockStep] = React.useState(0);
  const unlockSteps = [
    'Authenticating pilot identity…',
    'Deriving AES-256-GCM vault key…',
    'Decrypting credential store…',
    'Loading verifiable credentials…',
  ];
  const openVault = React.useCallback(() => {
    setVaultUnlocking(true);
    setUnlockStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      if (step < unlockSteps.length) {
        setUnlockStep(step);
      } else {
        clearInterval(iv);
        setVaultUnlocking(false);
        setScreen('credentials');
      }
    }, 600);
  }, []);

  // Dashboard panels unlock state
  const [dashboardUnlocked, setDashboardUnlocked] = React.useState(false);
  const [dashboardUnlocking, setDashboardUnlocking] = React.useState(false);
  const [dashUnlockStep, setDashUnlockStep] = React.useState(0);
  const dashUnlockSteps = [
    'Verifying pilot session…',
    'Deriving AES-256-GCM key…',
    'Decrypting credential data…',
    'Ready',
  ];
  const unlockDashboard = React.useCallback(async () => {
    if (typeof window !== 'undefined' && (window as any).PublicKeyCredential) {
      const storedCredentialId = localStorage.getItem('pr_passkey_credential_id');
      try {
        const allowCredentials = storedCredentialId
          ? [{
              id: (() => {
                const base64 = storedCredentialId.replace(/-/g, '+').replace(/_/g, '/');
                const binary = atob(base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '='));
                const bytes = new Uint8Array(binary.length);
                for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
                return bytes.buffer;
              })(),
              type: 'public-key' as const,
            }]
          : []; // empty = discoverable credential — iCloud Keychain will auto-prompt if one exists
        const result = await (navigator.credentials as any).get({
          publicKey: {
            challenge: crypto.getRandomValues(new Uint8Array(32)),
            rpId: window.location.hostname === 'localhost' ? 'localhost' : window.location.hostname.replace('www.', ''),
            allowCredentials,
            userVerification: 'required',
            timeout: 60000,
          },
        });
        if (!result) {
          // No credential returned — fall back to session check below
          throw new Error('no-credential');
        }
      } catch (err: any) {
        if (err.name === 'NotAllowedError') {
          // User explicitly cancelled passkey prompt — keep locked
          return;
        }
        // NotSupportedError, no credential found, or no passkey registered yet —
        // fall back to verifying active session (Auth0)
        if (!hasActiveSession) return; // truly not authenticated
        // Session confirmed — proceed to unlock without passkey
      }
    } else {
      // WebAuthn not supported — fall back to session check
      if (!hasActiveSession) return;
    }
    setDashboardUnlocking(true);
    setDashUnlockStep(0);
    let step = 0;
    const iv = setInterval(() => {
      step++;
      setDashUnlockStep(step);
      if (step >= dashUnlockSteps.length) {
        clearInterval(iv);
        setDashboardUnlocking(false);
        setDashboardUnlocked(true);
      }
    }, 550);
  }, []);
  const [verificationOpen, setVerificationOpen] = React.useState(false);
  const [uploadedFiles, setUploadedFiles] = React.useState<{ name: string; type: string; size: number }[]>([]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const isRecognitionPlus = profile?.account_tier === 'recognition_plus' || profile?.account_tier === 'enterprise';

  const allVerified = walletChecks.length > 0 && walletChecks.every(c => c.status === 'verified');
  const hasExpired  = walletChecks.some(c => c.status === 'expired');
  const hasFlagged  = walletChecks.some(c => c.status === 'flagged');

  const [wizardOpen, setWizardOpen]   = React.useState(false);
  const [wizardStep, setWizardStep]   = React.useState(1);
  const [selectedATO, setSelectedATO] = React.useState('');
  const [consentSigned, setConsentSigned] = React.useState(false);
  const [editValues, setEditValues] = React.useState<Record<string, string>>({});
  const [saving, setSaving] = React.useState(false);
  const [saved, setSaved] = React.useState(false);
  React.useEffect(() => {
    if (!profile?.id) return;
    const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
    const safe = (v: any) => (v && !isCiphertext(v)) ? v : '';
    const init: Record<string, string> = {
      display_name: safe(profile?.display_name), license_number: safe(profile?.license_number || profile?.license_id),
      license_type: safe(profile?.current_occupation), issuing_authority: safe(profile?.license_issuing_authority || profile?.country_of_license),
      nationality: safe(profile?.nationality), medical_class: safe(profile?.medical_class), medical_expiry: safe(profile?.medical_expiry),
      medical_number: safe(profile?.medical_number), total_flight_hours: safe(profile?.total_flight_hours), pic_hours: safe(profile?.pic_hours),
      instrument_hours: safe(profile?.instrument_hours), multi_engine_hours: safe(profile?.multi_engine_hours), night_hours: safe(profile?.night_hours),
      license_expiry: safe(profile?.license_expiry), ntc_license: safe(profile?.ntc_license), ntc_expiry: safe(profile?.ntc_expiry),
      elp_level: safe(profile?.language_proficiency || profile?.elp_level), elp_certificate_no: safe(profile?.elp_certificate_no), elp_expiry: safe(profile?.elp_expiry),
      nbi_clearance_no: safe(profile?.nbi_clearance_no), nbi_clearance_date: safe(profile?.nbi_clearance_date), nbi_clearance_expiry: safe(profile?.nbi_clearance_expiry),
      prc_license_no: safe(profile?.prc_license_no), background_check_status: safe(profile?.background_check_status),
    };
    setEditValues(init);
  }, [profile?.id]);

  const checkLabels: Record<string, string> = {
    professional_qualification: 'Pilot License (CPL/ATPL)',
    identity:                   'Identity / Passport',
    education:                  'Medical Certificate',
    fitness_proprietary:        'Background / NBI Check',
    type_rating:                'Type Rating Certificate',
    language_proficiency:       'ICAO Language Proficiency',
  };

  const maskToken = (id: string) =>
    `0x${id.replace(/-/g, '').substring(0, 3).toUpperCase()}...${id.replace(/-/g, '').substring(id.length - 4).toUpperCase()}`;

  const statusConfig = {
    verified: { dot: 'bg-emerald-400', label: 'ACTIVE / VERIFIED', text: 'text-emerald-400', border: 'rgba(16,185,129,0.3)', bg: 'rgba(16,185,129,0.08)' },
    flagged:  { dot: 'bg-yellow-400',  label: 'UNDER REVIEW',      text: 'text-yellow-400',  border: 'rgba(234,179,8,0.35)',   bg: 'rgba(234,179,8,0.08)'   },
    expired:  { dot: 'bg-red-400',     label: 'EXPIRED',           text: 'text-red-400',     border: 'rgba(239,68,68,0.35)',   bg: 'rgba(239,68,68,0.08)'   },
    pending:  { dot: 'bg-blue-400',    label: 'PENDING',           text: 'text-blue-400',    border: 'rgba(59,130,246,0.3)',   bg: 'rgba(59,130,246,0.08)'  },
  };

  const userProfileProp = profile ? {
    id: profile.id, uid: profile.id,
    firstName: profile.display_name?.split(' ')[0] || '',
    lastName: profile.display_name?.split(' ').slice(1).join(' ') || '',
  } : null;

  /* ── SCREEN: WALLET LANDING ─────────────────────────────────────────── */
  if (screen === 'landing') {
    const isCipher = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
    const safe = (v: any) => (v && !isCipher(v)) ? v : null;
    const totalHours = profile?.total_flight_hours || profile?.current_flight_hours || profile?.total_hours || 0;
    const verifiedHoursCheck = walletChecks.find((c: any) => c.check_type === 'professional_qualification' && c.status === 'verified');
    const verifiedHours = verifiedHoursCheck ? Number(totalHours) : 0;
    const unverifiedHours = Number(totalHours) - verifiedHours;
    const medicalExpiry = profile?.medical_expiry;
    const medicalExpired = medicalExpiry ? new Date(medicalExpiry) < new Date() : false;
    const licenseCheck = walletChecks.find((c: any) => c.check_type === 'professional_qualification');
    const medicalCheck = walletChecks.find((c: any) => c.check_type === 'education');

    const licenseSlots = [
      {
        icon: '📜', label: 'Pilot License',
        value: safe(profile?.current_occupation || (profile?.license_types && profile?.license_types[0])),
        sub: safe(profile?.license_number || profile?.license_id),
        expiry: safe(profile?.license_expiry),
        check: licenseCheck,
        cta: 'Enter License',
      },
      {
        icon: '🏥', label: 'Medical Certificate',
        value: safe(profile?.medical_class) || (medicalExpiry ? 'Class 1' : null),
        sub: safe(profile?.medical_number),
        expiry: medicalExpiry,
        expired: medicalExpired,
        check: medicalCheck,
        cta: 'Enter Medical',
      },
      {
        icon: '📻', label: 'Radio / NTC License',
        value: safe(profile?.ntc_license),
        sub: null,
        expiry: safe(profile?.ntc_expiry),
        check: null,
        cta: 'Enter NTC',
      },
      {
        icon: '🗣', label: 'ELP Certificate',
        value: safe(profile?.language_proficiency) || safe(profile?.elp_level),
        sub: safe(profile?.elp_certificate_no),
        expiry: safe(profile?.elp_expiry),
        check: walletChecks.find((c: any) => c.check_type === 'language_proficiency'),
        cta: 'Enter ELP',
      },
    ];

    const hoursRows = [
      { label: 'Total Flight Hours', value: totalHours ? Number(totalHours).toLocaleString() : '—', verified: verifiedHours > 0, source: verifiedHours > 0 ? 'Veremark confirmed' : 'Self-reported' },
      { label: 'Verified Hours', value: verifiedHours > 0 ? verifiedHours.toLocaleString() : '—', verified: verifiedHours > 0, source: verifiedHours > 0 ? '✓ Confirmed' : 'Not yet verified' },
      { label: 'Unverified Hours', value: unverifiedHours > 0 ? unverifiedHours.toLocaleString() : '—', verified: false, source: unverifiedHours > 0 ? 'Self-reported only' : 'None' },
      { label: 'PIC Hours', value: safe(profile?.pic_hours) ? Number(profile.pic_hours).toLocaleString() : '—', verified: false, source: 'Self-reported' },
      { label: 'Instrument Hours', value: safe(profile?.instrument_hours) ? Number(profile.instrument_hours).toLocaleString() : '—', verified: false, source: 'Self-reported' },
      { label: 'Multi-Engine Hours', value: safe(profile?.multi_engine_hours) ? Number(profile.multi_engine_hours).toLocaleString() : '—', verified: false, source: 'Self-reported' },
      { label: 'Night Hours', value: safe(profile?.night_hours) ? Number(profile.night_hours).toLocaleString() : '—', verified: false, source: 'Self-reported' },
    ];

    const pilotName = safe(profile?.full_name) || safe(profile?.first_name) || 'Pilot';
    const licenseType = safe(profile?.license_type) || safe(profile?.current_occupation) || null;
    const totalHoursDisplay = totalHours > 0 ? Number(totalHours).toLocaleString() : null;
    const verifiedCount = licenseSlots.filter(s => s.check?.status === 'verified').length;
    const expiredCount = licenseSlots.filter(s => s.expired || (s.expiry && new Date(s.expiry) < new Date())).length;

    const clearanceColor = allVerified ? '#16a34a' : hasExpired ? '#dc2626' : '#f59e0b';
    const clearanceBg   = allVerified ? '#f0fdf4' : hasExpired ? '#fef2f2' : '#fffbeb';
    const clearanceBdr  = allVerified ? '#bbf7d0' : hasExpired ? '#fecaca' : '#fde68a';
    const clearanceLabel = allVerified ? 'Pre-Cleared' : hasExpired ? 'Action Required' : walletChecks.length > 0 ? 'In Review' : 'Not Started';

    if (vaultUnlocking) {
      return (
        <motion.div
          key="vault-unlock"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 380 }}
        >
          {/* Shield icon */}
          <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 28, position: 'relative' }}>
            <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            {/* Spinning ring */}
            <svg style={{ position: 'absolute', top: -4, left: -4, animation: 'spin 1.2s linear infinite' }} width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="40" r="37" stroke="rgba(220,38,38,0.3)" strokeWidth="2" strokeDasharray="60 160" strokeLinecap="round"/>
            </svg>
          </div>

          {/* Title */}
          <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 6 }}>Pilot Credential Vault</p>
          <p style={{ fontSize: 18, fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 28 }}>Unlocking Vault</p>

          {/* Step list */}
          <div style={{ width: '100%', maxWidth: 340, display: 'flex', flexDirection: 'column', gap: 10 }}>
            {unlockSteps.map((step, i) => {
              const done = i < unlockStep;
              const active = i === unlockStep;
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: active ? 'rgba(220,38,38,0.08)' : done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.03)', border: `1px solid ${active ? 'rgba(220,38,38,0.3)' : done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)'}`, transition: 'all 0.3s' }}>
                  <div style={{ width: 18, height: 18, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(220,38,38,0.2)' : done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.06)', border: `1px solid ${active ? 'rgba(220,38,38,0.5)' : done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.1)'}` }}>
                    {done
                      ? <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                      : active
                      ? <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#dc2626', animation: 'pulse 1s ease-in-out infinite' }} />
                      : <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                    }
                  </div>
                  <p style={{ fontSize: 11, fontWeight: active ? 700 : 500, color: active ? 'rgba(255,255,255,0.9)' : done ? 'rgba(16,185,129,0.8)' : 'rgba(255,255,255,0.25)', letterSpacing: '0.01em', flex: 1 }}>{step}</p>
                  {active && <div style={{ width: 16, height: 2, background: 'rgba(220,38,38,0.4)', borderRadius: 2, animation: 'pulse 0.8s ease-in-out infinite' }} />}
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <p style={{ marginTop: 24, fontSize: 9, color: 'rgba(255,255,255,0.18)', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AES-256-GCM · Zero-knowledge · Pilot-owned</p>

          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </motion.div>
      );
    }

    return (
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>

        {/* ── PILOT CREDENTIAL VAULT BANNER ── */}
        <div style={{ background: 'white', border: '1px solid #e2e8f0', overflow: 'hidden', boxShadow: '0 4px 24px rgba(0,0,0,0.06)', marginBottom: 20 }}>
          <div style={{ height: 4, background: '#dc2626' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', padding: '1.25rem 1.5rem', flexWrap: 'nowrap' }}>
            <div style={{ width: 48, height: 48, borderRadius: 12, background: '#f8fafc', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 4 }}>Pilot Credential Vault</p>
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4 }}>Access Your PIC</p>
              <p style={{ fontSize: 12, color: '#64748b', lineHeight: 1.5 }}>Enter credentials, upload verification documents, and build your Pre-Cleared profile — zero-knowledge, pilot-owned.</p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ width: 6, height: 6, borderRadius: '50%', background: allVerified ? '#16a34a' : '#94a3b8', flexShrink: 0 }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: '#64748b', letterSpacing: '0.08em', textTransform: 'uppercase' }}>{allVerified ? 'Verified' : 'Unverified'}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                <span style={{ fontSize: 10, fontWeight: 600, color: '#94a3b8', letterSpacing: '0.08em', textTransform: 'uppercase' }}>AES-256-GCM</span>
              </div>
            </div>
            <button
              onClick={() => openVault()}
              style={{ background: '#dc2626', color: 'white', border: 'none', padding: '10px 24px', fontSize: 12, fontWeight: 700, letterSpacing: '0.08em', textTransform: 'uppercase', cursor: 'pointer', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 6, transition: 'background 0.15s' }}
              onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#b91c1c'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626'; }}
            >
              Open Wallet →
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            </button>
          </div>
        </div>

        {/* ── DASHBOARD PANELS ── */}
        <div className="space-y-4">

        {/* ── LOCKED STATE ── */}
        {!dashboardUnlocked && !dashboardUnlocking && (
          <div style={{ position: 'relative', overflow: 'hidden' }}>
            {/* Blurred ghost panels */}
            <div style={{ filter: 'blur(4px)', opacity: 0.35, pointerEvents: 'none', userSelect: 'none' }} aria-hidden="true">
              <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', height: 140, marginBottom: 12 }} />
              <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', height: 160, marginBottom: 12 }} />
              <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', height: 110, marginBottom: 12 }} />
              <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', height: 130 }} />
            </div>
            {/* Lock overlay */}
            <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 16 }}>
              <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(220,38,38,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Lock size={22} className="text-red-500" />
              </div>
              <div className="text-center">
                <p className="text-sm font-black text-white tracking-wide">Dashboard Locked</p>
                <p className="text-[10px] text-white/35 mt-1">Verify your identity to view credential data</p>
              </div>
              <button
                onClick={unlockDashboard}
                className="flex items-center gap-2 px-5 py-2.5 text-[11px] font-black tracking-widest text-white transition-all hover:brightness-110"
                style={{ background: 'rgba(220,38,38,0.85)', border: '1px solid rgba(220,38,38,0.5)' }}
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
                UNLOCK WITH PASSKEY
              </button>
              <p className="text-[8px] text-white/20 tracking-widest uppercase">AES-256-GCM · Zero-knowledge</p>
            </div>
          </div>
        )}

        {/* ── UNLOCKING ANIMATION ── */}
        {dashboardUnlocking && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '48px 0 40px', gap: 0 }}>
            <div style={{ width: 56, height: 56, borderRadius: 16, background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20, position: 'relative' }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              <svg style={{ position: 'absolute', top: -4, left: -4, animation: 'spin 1.2s linear infinite' }} width="64" height="64" viewBox="0 0 64 64" fill="none">
                <circle cx="32" cy="32" r="29" stroke="rgba(220,38,38,0.35)" strokeWidth="2" strokeDasharray="48 120" strokeLinecap="round"/>
              </svg>
            </div>
            <p className="text-xs font-black text-white mb-5 tracking-wide">Decrypting your vault…</p>
            <div style={{ width: '100%', maxWidth: 300, display: 'flex', flexDirection: 'column', gap: 8 }}>
              {dashUnlockSteps.map((step, i) => {
                const done = i < dashUnlockStep;
                const active = i === dashUnlockStep;
                return (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', background: active ? 'rgba(220,38,38,0.08)' : done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', border: `1px solid ${active ? 'rgba(220,38,38,0.3)' : done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)'}`, transition: 'all 0.3s' }}>
                    <div style={{ width: 16, height: 16, borderRadius: '50%', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', background: active ? 'rgba(220,38,38,0.2)' : done ? 'rgba(16,185,129,0.2)' : 'rgba(255,255,255,0.05)', border: `1px solid ${active ? 'rgba(220,38,38,0.5)' : done ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.08)'}` }}>
                      {done
                        ? <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
                        : active
                        ? <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#dc2626', animation: 'pulse 0.9s ease-in-out infinite' }} />
                        : <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'rgba(255,255,255,0.12)' }} />
                      }
                    </div>
                    <p style={{ fontSize: 10, fontWeight: active ? 700 : 500, color: active ? 'rgba(255,255,255,0.85)' : done ? 'rgba(16,185,129,0.75)' : 'rgba(255,255,255,0.2)', flex: 1 }}>{step}</p>
                  </div>
                );
              })}
            </div>
            <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
          </div>
        )}

        {/* ── UNLOCKED CONTENT ── */}
        {dashboardUnlocked && <>

          {/* ── 1. VC STATUS STRIP ── */}
          <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-2">
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Credential Status</p>
                <p className="text-sm font-black text-white tracking-wide">Verifiable Credentials</p>
              </div>
              <button onClick={() => setScreen('credentials')} className="text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 transition-colors">MANAGE →</button>
            </div>
            <div className="grid grid-cols-4 gap-2 px-5 pb-4">
              {licenseSlots.map((slot, i) => {
                const isExpired = slot.expired || (slot.expiry && new Date(slot.expiry) < new Date());
                const isVerified = slot.check?.status === 'verified';
                const isFlagged = slot.check?.status === 'flagged';
                const isPending = slot.check?.status === 'pending';
                const isEmpty = !slot.value;
                const statusLabel = isExpired ? 'EXPIRED' : isVerified ? 'VERIFIED' : isFlagged ? 'FLAGGED' : isPending ? 'PENDING' : isEmpty ? 'NOT SET' : 'UNVERIFIED';
                const dotColor = isExpired ? '#ef4444' : isVerified ? '#10b981' : isFlagged ? '#f59e0b' : isPending ? '#3b82f6' : '#475569';
                const borderColor = isExpired ? 'rgba(239,68,68,0.3)' : isVerified ? 'rgba(16,185,129,0.3)' : isFlagged ? 'rgba(245,158,11,0.3)' : 'rgba(255,255,255,0.07)';
                const bgColor = isExpired ? 'rgba(239,68,68,0.06)' : isVerified ? 'rgba(16,185,129,0.06)' : isFlagged ? 'rgba(245,158,11,0.06)' : 'rgba(255,255,255,0.03)';
                const previewValue = slot.value || null;
                const previewSub = slot.sub || null;
                return (
                  <div key={i} className="flex flex-col justify-between p-3" style={{ background: bgColor, border: `1px solid ${borderColor}`, minHeight: 88 }}>
                    {/* Top: label + status dot */}
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-[9px] font-black text-white/40 tracking-widest uppercase">{slot.label.split(' ')[0]}</p>
                      <div className="flex items-center gap-1">
                        <span style={{ width: 5, height: 5, borderRadius: '50%', background: dotColor, display: 'inline-block', flexShrink: 0, boxShadow: isVerified ? `0 0 5px ${dotColor}` : 'none' }} />
                      </div>
                    </div>
                    {/* Middle: main data value */}
                    <div className="flex-1">
                      {previewValue ? (
                        <p className="text-sm font-black leading-tight" style={{ color: dotColor }}>{previewValue}</p>
                      ) : (
                        <p className="text-lg font-black text-white/15">—</p>
                      )}
                      {previewSub && <p className="text-[9px] text-white/30 mt-0.5 truncate">{previewSub}</p>}
                    </div>
                    {/* Bottom: status label + expiry */}
                    <div className="flex items-center justify-between mt-2">
                      <span style={{ fontSize: 8, fontWeight: 700, color: dotColor, letterSpacing: '0.1em' }}>{statusLabel}</span>
                      {slot.expiry && <span className="text-[8px] text-white/20">{new Date(slot.expiry).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}</span>}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* ── 2. HOURS BREAKDOWN ── */}
          <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
            <div className="flex items-center justify-between px-5 pt-4 pb-3">
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Flight Hours</p>
                <p className="text-sm font-black text-white tracking-wide">Hours Verification Status</p>
              </div>
              <span className="text-[10px] font-black tracking-wider" style={{ color: verifiedHours > 0 ? '#10b981' : '#f59e0b' }}>{verifiedHours > 0 ? '✓ VERIFIED' : 'UNVERIFIED'}</span>
            </div>
            <div className="px-5 pb-4 space-y-3">
              {/* Bar */}
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-[9px] text-white/40 font-bold">0</span>
                  <span className="text-[9px] text-white/40 font-bold">{Number(totalHours).toLocaleString()} hrs total</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div className="h-full flex">
                    {verifiedHours > 0 && <div style={{ width: `${Math.min(100, (verifiedHours / Math.max(Number(totalHours), 1)) * 100)}%`, background: 'linear-gradient(90deg, #10b981, #34d399)', transition: 'width 0.6s ease' }} />}
                    {unverifiedHours > 0 && <div style={{ width: `${Math.min(100, (unverifiedHours / Math.max(Number(totalHours), 1)) * 100)}%`, background: 'rgba(245,158,11,0.5)', transition: 'width 0.6s ease' }} />}
                  </div>
                </div>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-emerald-400" /><span className="text-[9px] text-white/50 font-bold">Verified {verifiedHours > 0 ? verifiedHours.toLocaleString() : '0'} hrs</span></div>
                  <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-yellow-500/50" /><span className="text-[9px] text-white/50 font-bold">Unverified {unverifiedHours > 0 ? unverifiedHours.toLocaleString() : Number(totalHours).toLocaleString()} hrs</span></div>
                </div>
              </div>
              {/* Stat grid */}
              <div className="grid grid-cols-4 gap-2">
                {[
                  { label: 'TOTAL', value: Number(totalHours).toLocaleString(), color: 'text-white' },
                  { label: 'PIC', value: (profile?.pic_hours ?? 0).toLocaleString(), color: 'text-sky-300' },
                  { label: 'NIGHT', value: (profile?.night_hours ?? 0).toLocaleString(), color: 'text-indigo-300' },
                  { label: 'INST', value: (profile?.instrument_hours ?? 0).toLocaleString(), color: 'text-purple-300' },
                ].map(s => (
                  <div key={s.label} className="text-center py-2" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <p className={`text-base font-black ${s.color}`}>{s.value}</p>
                    <p className="text-[8px] text-white/30 uppercase tracking-widest mt-0.5">{s.label}</p>
                  </div>
                ))}
              </div>
              {unverifiedHours > 0 && (
                <div className="flex items-start gap-2 p-2.5" style={{ background: 'rgba(245,158,11,0.07)', border: '1px solid rgba(245,158,11,0.2)' }}>
                  <AlertTriangle size={10} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[9px] text-yellow-300/70 leading-relaxed">Your hours are self-reported and unverified. Start a Veremark verification to get a cryptographic confirmation token.</p>
                </div>
              )}
            </div>
          </div>

          {/* ── 3. LOGBOOK PREVIEW ── */}
          <LogbookPreviewPanel profile={profile} onOpenLogbook={() => {}} />

          {/* ── 4. PENDING CREDENTIAL REQUESTS ── */}
          {pendingRequests.length > 0 && (
            <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(249,115,22,0.25)', backdropFilter: 'blur(8px)' }}>
              <div className="px-5 pt-4 pb-2">
                <p className="text-[9px] font-black tracking-[0.2em] text-orange-400/60 uppercase">Airline Requests</p>
                <p className="text-sm font-black text-white tracking-wide">Pending Credential Requests</p>
              </div>
              <div className="px-5 pb-4 space-y-3">
                {pendingRequests.map((req: any) => (
                  <CredentialRequestCard key={req.id} request={req} onRespond={async (approved: boolean) => {
                    await callApi('queryTable', {
                      table: 'credential_requests',
                      operation: 'update',
                      id: req.id,
                      data: {
                        status: approved ? 'approved' : 'denied',
                        responded_at: new Date().toISOString(),
                        ...(approved ? { access_granted_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } : {}),
                      },
                    });
                    const notifications = await callApi<Record<string, unknown>[]>('queryTable', {
                      table: 'pilot_notifications',
                      operation: 'select',
                      where: { related_id: req.id },
                      limit: 10,
                    });
                    await Promise.all((notifications || []).map((n: any) =>
                      callApi('queryTable', {
                        table: 'pilot_notifications',
                        operation: 'update',
                        id: n.id,
                        data: { is_read: true },
                      })
                    ));
                  }} />
                ))}
              </div>
            </div>
          )}

          {/* ── 5. NOTIFICATIONS FEED ── */}
          <NotificationsFeedPanel profileId={profile?.id} />

        </>}
        </div>
      </motion.div>
    );
  }

  /* ── SCREEN: DOCUMENT UPLOAD ─────────────────────────────────────────── */
  if (screen === 'documents') {
    const docTypes = [
      { id: 'license',  label: 'Pilot License',         sub: 'CPL / ATPL / PPL — front & back',       accept: 'image/*,.pdf', icon: FileText, color: 'text-indigo-400',  border: 'rgba(99,102,241,0.3)',   bg: 'rgba(99,102,241,0.08)'  },
      { id: 'medical',  label: 'Medical Certificate',    sub: 'Class 1 / 2 — issued within validity',  accept: 'image/*,.pdf', icon: Shield,   color: 'text-emerald-400', border: 'rgba(16,185,129,0.3)',   bg: 'rgba(16,185,129,0.08)'  },
      { id: 'logbook',  label: 'Logbook Pages',          sub: 'Total hours summary or recent pages',   accept: 'image/*,.pdf', icon: BookMarked,color: 'text-yellow-400', border: 'rgba(251,191,36,0.3)',   bg: 'rgba(251,191,36,0.08)'  },
      { id: 'identity', label: 'Identity / Passport',    sub: 'Photo page — data page only',           accept: 'image/*,.pdf', icon: User,     color: 'text-blue-400',    border: 'rgba(59,130,246,0.3)',   bg: 'rgba(59,130,246,0.08)'  },
    ];

    return (
      <motion.div className="max-w-4xl space-y-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen('landing')} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <div>
            <p className="text-[9px] font-black tracking-[0.2em] text-white/25 uppercase">Recognition+ Feature</p>
            <h2 className="text-lg font-black text-white tracking-wide leading-none">Upload Verification Documents</h2>
          </div>
          <div className="ml-auto px-3 py-1" style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.3)', borderRadius: '999px' }}>
            <span className="text-[10px] font-black tracking-widest text-yellow-400">RECOGNITION+</span>
          </div>
        </div>

        {/* Info bar */}
        <div className="flex items-start gap-3 px-4 py-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.2)' }}>
          <Shield size={13} className="text-indigo-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-indigo-200 leading-relaxed">
            Documents are stored in your <strong className="text-white">private vault only</strong>. Veremark independently verifies — we never read, store, or transmit your raw files. You receive a cryptographic token confirming verification.
          </p>
        </div>

        {/* Upload grid */}
        {!isRecognitionPlus ? (
          <div className="text-center py-16" style={{ background: 'rgba(255,255,255,0.02)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.3)' }}>
              <Lock size={24} className="text-yellow-400" />
            </div>
            <p className="text-white/60 text-sm font-black tracking-wide mb-1">RECOGNITION+ REQUIRED</p>
            <p className="text-white/30 text-xs max-w-xs mx-auto mb-6">Document upload and Veremark verification is a Recognition+ feature. Upgrade to unlock Pre-Cleared status.</p>
            <button className="text-xs font-black px-8 py-3 tracking-widest text-white" style={{ background: 'rgba(251,191,36,0.8)', border: '1px solid rgba(251,191,36,0.5)' }}>
              UPGRADE TO RECOGNITION+ — $99/YR
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {docTypes.map(doc => {
              const Icon = doc.icon;
              const uploaded = uploadedFiles.filter(f => f.type === doc.id);
              return (
                <div key={doc.id} className="p-5" style={{ background: doc.bg, border: `1px solid ${doc.border}` }}>
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: `1px solid ${doc.border}` }}>
                      <Icon size={16} className={doc.color} />
                    </div>
                    <div>
                      <p className="text-xs font-black text-white tracking-wide">{doc.label}</p>
                      <p className="text-[10px] text-white/35">{doc.sub}</p>
                    </div>
                    {uploaded.length > 0 && (
                      <div className="ml-auto flex items-center gap-1.5 px-2 py-1" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
                        <CheckCircle size={9} className="text-emerald-400" />
                        <span className="text-[9px] font-black text-emerald-400 tracking-wider">{uploaded.length} UPLOADED</span>
                      </div>
                    )}
                  </div>
                  <label className="flex flex-col items-center justify-center py-6 cursor-pointer transition-all hover:brightness-110" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.15)' }}>
                    <Upload size={20} className="text-white/20 mb-2" />
                    <span className="text-[10px] font-bold text-white/40 tracking-wider">CLICK OR DROP FILE</span>
                    <span className="text-[9px] text-white/20 mt-1">PDF, JPG, PNG — max 10MB</span>
                    <input
                      type="file"
                      accept={doc.accept}
                      className="hidden"
                      onChange={e => {
                        const f = e.target.files?.[0];
                        if (f) setUploadedFiles(prev => [...prev, { name: f.name, type: doc.id, size: f.size }]);
                      }}
                    />
                  </label>
                  {uploaded.map(f => (
                    <div key={f.name} className="flex items-center gap-2 mt-2 px-3 py-2" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
                      <CheckCircle size={10} className="text-emerald-400 flex-shrink-0" />
                      <span className="text-[10px] text-white/60 truncate flex-1">{f.name}</span>
                      <span className="text-[9px] text-white/25">{(f.size / 1024).toFixed(0)}kb</span>
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        )}

        {/* Bottom CTA — after upload, go to credentials or initiate verification */}
        {isRecognitionPlus && uploadedFiles.length > 0 && (
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setScreen('credentials'); }}
              className="flex-1 py-3 text-xs font-black tracking-widest text-white transition-all hover:brightness-110"
              style={{ background: 'rgba(99,102,241,0.8)', border: '1px solid rgba(99,102,241,0.5)' }}
            >
              CONTINUE — ENTER CREDENTIAL DETAILS →
            </button>
            <button
              onClick={() => { setWizardOpen(true); setWizardStep(1); }}
              className="px-6 py-3 text-xs font-black tracking-widest transition-all hover:brightness-110"
              style={{ background: 'rgba(16,185,129,0.2)', border: '1px solid rgba(16,185,129,0.4)', color: '#34d399' }}
            >
              INITIATE VERIFICATION
            </button>
          </div>
        )}

      </motion.div>
    );
  }

  /* ── SCREEN: CREDENTIALS DIRECTORY ──────────────────────────────────── */
  if (screen === 'credentials') {
    const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
    const safe = (v: any) => (v && !isCiphertext(v)) ? v : '';

    const sections = [
      {
        id: 'license',
        title: 'Pilot License',
        icon: FileText,
        color: '#3b82f6',
        fields: [
          { key: 'license_number',   label: 'License Number',    placeholder: 'e.g. 155660-CPL',         value: safe(profile?.license_number   || profile?.license_id) },
          { key: 'license_type',     label: 'License Type',      placeholder: 'e.g. CPL, ATPL, PPL',     value: safe(profile?.license_type     || profile?.current_occupation) },
          { key: 'issuing_authority',label: 'Issuing Authority', placeholder: 'e.g. CAAP, EASA, FAA',    value: safe(profile?.issuing_authority || profile?.license_issuing_authority || profile?.country_of_license) },
          { key: 'license_expiry',   label: 'Expiry Date',       placeholder: 'YYYY-MM-DD',              value: safe(profile?.license_expiry) },
          { key: 'pel_number',       label: 'PEL / Reg Number',  placeholder: 'e.g. 155660',             value: safe(profile?.pel_number) },
        ],
      },
      {
        id: 'medical',
        title: 'Medical Certificate',
        icon: Shield,
        color: '#10b981',
        fields: [
          { key: 'medical_class',    label: 'Medical Class',     placeholder: 'Class 1 / Class 2',       value: safe(profile?.medical_class    || profile?.medical_status) },
          { key: 'medical_number',   label: 'Certificate Number',placeholder: 'e.g. 25-023739',          value: safe(profile?.medical_number) },
          { key: 'medical_expiry',   label: 'Expiry Date',       placeholder: 'YYYY-MM-DD',              value: safe(profile?.medical_expiry) },
          { key: 'medical_examiner', label: 'Examiner (DME)',    placeholder: 'e.g. Dr. Marlon S. Cosue',value: safe(profile?.medical_examiner) },
          { key: 'medical_limitations', label: 'Limitations',   placeholder: 'e.g. Corrective lenses',  value: safe(profile?.medical_limitations) },
        ],
      },
      {
        id: 'hours',
        title: 'Flight Hours & Experience',
        icon: Clock,
        color: '#f59e0b',
        fields: [
          { key: 'total_flight_hours',    label: 'Total Flight Hours',   placeholder: '0',    value: safe(profile?.total_flight_hours?.toString()) },
          { key: 'pic_hours',             label: 'PIC Hours',            placeholder: '0',    value: safe(profile?.pic_hours?.toString()) },
          { key: 'instrument_hours',      label: 'Instrument Hours',     placeholder: '0',    value: safe(profile?.instrument_hours?.toString()) },
          { key: 'multi_engine_hours',    label: 'Multi-Engine Hours',   placeholder: '0',    value: safe(profile?.multi_engine_hours?.toString()) },
          { key: 'night_hours',           label: 'Night Hours',          placeholder: '0',    value: safe(profile?.night_hours?.toString()) },
        ],
      },
      {
        id: 'ratings',
        title: 'Ratings & Endorsements',
        icon: Star,
        color: '#8b5cf6',
        fields: [
          { key: 'aircraft_types',       label: 'Aircraft Type Ratings', placeholder: 'e.g. B737, A320, C172', value: Array.isArray(profile?.aircraft_types) ? profile.aircraft_types.join(', ') : safe(profile?.aircraft_types) },
          { key: 'ratings',              label: 'Ratings',               placeholder: 'e.g. ASEL, AMEL, IR',  value: Array.isArray(profile?.ratings) ? profile.ratings.join(', ') : safe(profile?.ratings) },
          { key: 'ntc_license',          label: 'NTC / Radio License',   placeholder: 'e.g. 22 RANCR-22517',  value: safe(profile?.ntc_license) },
          { key: 'ntc_expiry',           label: 'NTC Expiry',            placeholder: 'YYYY-MM-DD',           value: safe(profile?.ntc_expiry) },
        ],
      },
      {
        id: 'elp',
        title: 'ELP Certificate',
        icon: FileText,
        color: '#0ea5e9',
        fields: [
          { key: 'language_proficiency', label: 'ICAO Language Level',       placeholder: 'e.g. English Level 5',         value: safe(profile?.language_proficiency) },
          { key: 'elp_certificate_no',   label: 'ELP Certificate Number',    placeholder: 'e.g. ELP-2025-XXXXX',          value: safe(profile?.elp_certificate_no) },
          { key: 'elp_issuing_authority',label: 'Issuing Authority',         placeholder: 'e.g. CAAP, EASA, FAA',         value: safe(profile?.elp_issuing_authority) },
          { key: 'elp_date_issued',      label: 'Date Issued',               placeholder: 'YYYY-MM-DD',                   value: safe(profile?.elp_date_issued) },
          { key: 'elp_expiry',           label: 'Expiry Date',               placeholder: 'YYYY-MM-DD (Level 4: 3yr, Level 5: 6yr, Level 6: lifetime)', value: safe(profile?.elp_expiry) },
          { key: 'elp_level',            label: 'Proficiency Level',         placeholder: 'Level 4 / 5 / 6',             value: safe(profile?.elp_level) },
        ],
      },
      {
        id: 'identity',
        title: 'Personal & Identity',
        icon: User,
        color: '#ec4899',
        fields: [
          { key: 'display_name',  label: 'Full Name',         placeholder: 'Your full name',            value: safe(profile?.display_name) },
          { key: 'nationality',   label: 'Nationality',       placeholder: 'e.g. Filipino, Emirati',    value: safe(profile?.nationality) },
          { key: 'date_of_birth', label: 'Date of Birth',     placeholder: 'YYYY-MM-DD',                value: safe(profile?.date_of_birth) },
          { key: 'passport_no',   label: 'Passport Number',   placeholder: 'e.g. A1234567',             value: safe(profile?.passport_no) },
          { key: 'home_base',     label: 'Home Base / City',  placeholder: 'e.g. Dubai, UAE',           value: safe(profile?.home_base || profile?.domicile) },
        ],
      },
      {
        id: 'background',
        title: 'Background Checks',
        icon: Shield,
        color: '#dc2626',
        fields: [
          { key: 'nbi_clearance_no',    label: 'NBI Clearance Number',      placeholder: 'e.g. NBI-2025-XXXXXXXX',        value: safe(profile?.nbi_clearance_no) },
          { key: 'nbi_clearance_date',  label: 'NBI Date Issued',           placeholder: 'YYYY-MM-DD',                    value: safe(profile?.nbi_clearance_date) },
          { key: 'nbi_clearance_expiry',label: 'NBI Expiry Date',           placeholder: 'YYYY-MM-DD (valid 1 year)',     value: safe(profile?.nbi_clearance_expiry) },
          { key: 'prc_license_no',      label: 'PRC License Number',        placeholder: 'e.g. 0123456 (if applicable)',  value: safe(profile?.prc_license_no) },
          { key: 'background_check_status', label: 'Check Status',          placeholder: 'e.g. Clear / Pending / Flagged', value: safe(profile?.background_check_status) },
        ],
      },
    ];

    const handleSave = async () => {
      setSaving(true);
      try {
        await callApi('queryTable', {
          table: 'profiles',
          operation: 'update',
          id: profile?.id,
          data: {
            display_name:            editValues.display_name        || undefined,
            license_id:              editValues.license_number      || undefined,
            license_number:          editValues.license_number      || undefined,
            current_occupation:      editValues.license_type        || undefined,
            country_of_license:      editValues.issuing_authority   || undefined,
            license_issuing_authority: editValues.issuing_authority || undefined,
            nationality:             editValues.nationality         || undefined,
            medical_class:           editValues.medical_class       || undefined,
            medical_expiry:          editValues.medical_expiry      || undefined,
            current_flight_hours:    editValues.total_flight_hours ? Number(editValues.total_flight_hours) : undefined,
          },
        });
        setSaved(true);
        setTimeout(() => setSaved(false), 3000);
      } catch (err) {
        console.error('Save error', err);
      } finally {
        setSaving(false);
      }
    };

    return (
      <motion.div className="max-w-4xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

        {/* ── Header bar ── */}
        <div className="bg-white border border-slate-200 shadow-sm overflow-hidden mb-5">
          <div style={{ height: 4, background: '#dc2626' }} />
          <div className="px-6 py-5 flex items-center gap-4">
            <button
              onClick={() => setScreen('landing')}
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-slate-50 hover:bg-slate-100 transition-colors flex-shrink-0"
            >
              <ArrowRight size={14} className="rotate-180 text-slate-600" />
            </button>
            <div className="flex-1">
              <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.2em', color: '#dc2626', textTransform: 'uppercase', marginBottom: 2 }}>Pilot Credential Vault</p>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>Credential Directory</h2>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {saved && (
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle size={11} /> Saved
                </span>
              )}
              <button
                onClick={handleSave}
                disabled={saving}
                style={{ background: saving ? '#94a3b8' : '#dc2626', color: 'white', border: 'none', padding: '8px 20px', fontSize: 12, fontWeight: 700, letterSpacing: '0.05em', cursor: saving ? 'not-allowed' : 'pointer', transition: 'background 0.15s' }}
              >
                {saving ? 'SAVING…' : 'SAVE CHANGES'}
              </button>
            </div>
          </div>
        </div>

        {/* ── CREDENTIAL HEALTH CHECKUP ── */}
        {(() => {
          const isCT = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
          const sv = (v: any) => (v && !isCT(v)) ? v : null;

          const daysUntil = (dateStr: string | null | undefined) => {
            if (!dateStr) return null;
            const d = new Date(dateStr);
            return isNaN(d.getTime()) ? null : Math.floor((d.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
          };

          const licenseExpDays = daysUntil(sv(profile?.license_expiry));
          const medicalExpDays = daysUntil(sv(profile?.medical_expiry));
          const ntcExpDays     = daysUntil(sv(profile?.ntc_expiry));
          const elpExpDays     = daysUntil(sv(profile?.elp_expiry));

          const checks = [
            {
              label: 'Pilot License',
              icon: '📜',
              value: sv(profile?.license_type || profile?.current_occupation),
              days: licenseExpDays,
            },
            {
              label: 'Medical',
              icon: '🏥',
              value: sv(profile?.medical_class) || (profile?.medical_expiry ? 'Class 1' : null),
              days: medicalExpDays,
            },
            {
              label: 'NTC / Radio',
              icon: '📻',
              value: sv(profile?.ntc_license),
              days: ntcExpDays,
            },
            {
              label: 'ELP Certificate',
              icon: '🗣',
              value: sv(profile?.language_proficiency) || sv(profile?.elp_level),
              days: elpExpDays,
            },
          ].map(c => {
            const missing = !c.value;
            const expired = c.days !== null && c.days < 0;
            const warning = c.days !== null && c.days >= 0 && c.days <= 60;
            const ok      = !missing && !expired && !warning;
            return { ...c, missing, expired, warning, ok };
          });

          const anyIssue = checks.some(c => c.expired || c.warning || c.missing);
          const allOk = checks.every(c => c.ok);

          return (
            <div style={{ marginBottom: 20, padding: '14px 20px', borderRadius: 10, background: allOk ? '#f0fdf4' : anyIssue ? '#fffbeb' : '#f8fafc', border: `1px solid ${allOk ? '#bbf7d0' : anyIssue ? '#fde68a' : '#e2e8f0'}` }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ fontSize: 13 }}>{allOk ? '✅' : '🔍'}</span>
                  <p style={{ fontSize: 11, fontWeight: 800, color: allOk ? '#15803d' : '#92400e', margin: 0, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                    {allOk ? 'All Credentials Clear' : 'Credential Health Check'}
                  </p>
                </div>
                {anyIssue && (
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#b45309', background: '#fef3c7', border: '1px solid #fde68a', padding: '2px 10px', borderRadius: 20 }}>
                    Action Required
                  </span>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10 }}>
                {checks.map((c, i) => {
                  const dotColor = c.missing ? '#cbd5e1' : c.expired ? '#ef4444' : c.warning ? '#f59e0b' : '#22c55e';
                  const bgColor  = c.missing ? '#f8fafc' : c.expired ? '#fef2f2' : c.warning ? '#fffbeb' : '#f0fdf4';
                  const brColor  = c.missing ? '#e2e8f0' : c.expired ? '#fecaca' : c.warning ? '#fde68a' : '#bbf7d0';
                  const txColor  = c.missing ? '#94a3b8' : c.expired ? '#dc2626' : c.warning ? '#d97706' : '#16a34a';
                  const statusLabel = c.missing ? 'Missing' : c.expired ? `Exp ${Math.abs(c.days!)}d ago` : c.warning ? `${c.days}d left` : 'Valid';
                  return (
                    <div key={i} style={{ background: bgColor, border: `1px solid ${brColor}`, borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 5 }}>
                        <span style={{ fontSize: 14, lineHeight: 1 }}>{c.icon}</span>
                        <span style={{ fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{c.label}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: dotColor, flexShrink: 0, display: 'inline-block', ...(c.warning || c.expired ? { boxShadow: `0 0 0 3px ${dotColor}30` } : {}) }} />
                        <span style={{ fontSize: 10, fontWeight: 700, color: txColor }}>{statusLabel}</span>
                      </div>
                      {c.value && !c.missing && (
                        <p style={{ fontSize: 9, color: '#94a3b8', margin: '3px 0 0', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.value}</p>
                      )}
                    </div>
                  );
                })}
              </div>
              {checks.some(c => c.warning) && (
                <p style={{ fontSize: 10, color: '#d97706', marginTop: 10, fontWeight: 600 }}>
                  ⚠ One or more credentials expire within 60 days — renew soon to maintain Pre-Cleared status.
                </p>
              )}
              {checks.some(c => c.expired) && (
                <p style={{ fontSize: 10, color: '#dc2626', marginTop: 10, fontWeight: 700 }}>
                  ✕ Expired credential detected — your Pre-Cleared status is currently suspended.
                </p>
              )}
            </div>
          );
        })()}

        {/* ── Credential sections ── */}
        <div className="space-y-4">
          {sections.map(section => {
            const Icon = section.icon;
            return (
              <div key={section.id} className="bg-white border border-slate-200 shadow-sm overflow-hidden">

                {/* Section header */}
                <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100 bg-slate-50">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: `${section.color}18`, border: `1px solid ${section.color}30` }}>
                    <Icon size={15} style={{ color: section.color }} />
                  </div>
                  <h3 style={{ fontSize: 13, fontWeight: 700, color: '#0f172a', letterSpacing: '-0.01em' }}>{section.title}</h3>
                  <div className="ml-auto flex items-center gap-2">
                    {section.id === 'background' && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: '#dc2626', background: '#fef2f2', border: '1px solid #fecaca', padding: '2px 8px', borderRadius: 4, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                        Verified by Veremark
                      </span>
                    )}
                    {section.fields.some(f => editValues[f.key]) ? (
                      <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        {section.fields.filter(f => editValues[f.key]).length} / {section.fields.length} filled
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-slate-400 bg-slate-100 border border-slate-200 px-2 py-0.5 rounded-full">Empty</span>
                    )}
                  </div>
                </div>

                {/* Background check info banner */}
                {section.id === 'background' && (
                  <div style={{ padding: '10px 24px', background: '#fef2f2', borderBottom: '1px solid #fecaca', display: 'flex', alignItems: 'flex-start', gap: 10 }}>
                    <Shield size={13} style={{ color: '#dc2626', flexShrink: 0, marginTop: 1 }} />
                    <div>
                      <p style={{ fontSize: 11, color: '#7f1d1d', fontWeight: 600, margin: '0 0 2px' }}>NBI Police Clearance + Background Verification</p>
                      <p style={{ fontSize: 10, color: '#991b1b', margin: 0, lineHeight: 1.6 }}>
                        Enter your NBI Clearance details below. Veremark will independently verify your clearance directly with the{' '}
                        <strong>National Bureau of Investigation (Philippines)</strong> as part of the background check bundle.
                        NBI clearances are valid for <strong>1 year</strong> — keep this up to date to maintain Pre-Cleared status.
                      </p>
                    </div>
                  </div>
                )}

                {/* Fields grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0 divide-y divide-slate-50 md:divide-y-0">
                  {section.fields.map((field, fi) => (
                    <div
                      key={field.key}
                      className="px-6 py-4 flex flex-col gap-1.5"
                      style={{ borderBottom: fi < section.fields.length - 1 ? '1px solid #f8fafc' : 'none', borderRight: fi % 2 === 0 && fi < section.fields.length - 1 ? '1px solid #f1f5f9' : 'none' }}
                    >
                      <label style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                        {field.label}
                      </label>
                      <input
                        type="text"
                        value={editValues[field.key] || ''}
                        onChange={e => setEditValues(prev => ({ ...prev, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                          color: '#0f172a',
                          background: 'transparent',
                          border: 'none',
                          borderBottom: `1px solid ${editValues[field.key] ? '#e2e8f0' : '#f1f5f9'}`,
                          padding: '4px 0',
                          outline: 'none',
                          width: '100%',
                          transition: 'border-color 0.15s',
                        }}
                        onFocus={e => { e.currentTarget.style.borderBottomColor = '#dc2626'; }}
                        onBlur={e => { e.currentTarget.style.borderBottomColor = editValues[field.key] ? '#e2e8f0' : '#f1f5f9'; }}
                      />
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* ── Bottom action bar ── */}
        <div className="mt-5 bg-white border border-slate-200 shadow-sm">
          <div className="px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Lock size={11} style={{ color: '#94a3b8' }} />
              <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 500 }}>Sensitive fields are AES-256-GCM encrypted before storage</span>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => setScreen('documents')}
                style={{ fontSize: 11, fontWeight: 600, color: '#64748b', cursor: 'pointer', background: 'none', border: '1px solid #e2e8f0', padding: '8px 16px' }}
              >
                Upload Documents
              </button>
              <button
                onClick={() => setScreen('verification')}
                style={{ fontSize: 11, fontWeight: 700, color: 'white', cursor: 'pointer', background: '#dc2626', border: 'none', padding: '8px 20px', letterSpacing: '0.05em' }}
              >
                VIEW VERIFICATION STATUS →
              </button>
            </div>
          </div>
        </div>

      </motion.div>
    );
  }

  /* ── SCREEN: VERIFICATION STATUS ─────────────────────────────────────── */
  if (screen === 'verification') {
    return (
      <motion.div className="max-w-4xl space-y-5" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>

        {/* Back + header */}
        <div className="flex items-center gap-3">
          <button onClick={() => setScreen('landing')} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
            <ArrowRight size={14} className="rotate-180" />
          </button>
          <div className="flex-1">
            <p className="text-[9px] font-black tracking-[0.2em] text-white/25 uppercase">Credential Vault</p>
            <h2 className="text-lg font-black text-white tracking-wide leading-none">Verification Status</h2>
          </div>
          {!allVerified && (
            <button onClick={() => { setWizardOpen(true); setWizardStep(1); }} className="px-4 py-2 text-[10px] font-black tracking-widest text-white transition-all hover:brightness-110" style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}>
              INITIATE VERIFICATION
            </button>
          )}
        </div>

        {/* Pre-Cleared status banner */}
        <div className="p-5 flex items-center gap-5" style={{ background: allVerified ? 'rgba(16,185,129,0.12)' : hasFlagged ? 'rgba(234,179,8,0.12)' : hasExpired ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${allVerified ? 'rgba(16,185,129,0.3)' : hasFlagged ? 'rgba(234,179,8,0.3)' : hasExpired ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
          <div className={`w-14 h-14 rounded-full flex items-center justify-center flex-shrink-0 ${allVerified ? 'bg-emerald-500/20' : hasFlagged ? 'bg-yellow-500/20' : hasExpired ? 'bg-red-500/20' : 'bg-slate-700'}`}>
            <Shield size={24} className={allVerified ? 'text-emerald-400' : hasFlagged ? 'text-yellow-400' : hasExpired ? 'text-red-400' : 'text-white/30'} />
          </div>
          <div className="flex-1">
            <p className="text-[10px] uppercase tracking-widest font-bold text-white/30 mb-0.5">Vault Status</p>
            <p className={`text-xl font-black tracking-wider ${allVerified ? 'text-emerald-400' : hasFlagged ? 'text-yellow-300' : hasExpired ? 'text-red-400' : 'text-white/50'}`}>
              {allVerified ? 'PRE-CLEARED ✓' : hasFlagged ? 'REVIEW REQUIRED' : hasExpired ? 'ACTION REQUIRED' : 'PENDING VERIFICATION'}
            </p>
            <p className="text-xs text-white/40 mt-0.5">
              {allVerified ? 'Veremark + Vault + Governing body all agree. Cryptographic token active.'
                : hasFlagged ? 'An ATO has flagged a discrepancy. Resolve to restore Pre-Cleared status.'
                : hasExpired ? 'One or more credentials have expired. Re-initiate verification.'
                : 'Verification in progress. All three parties must confirm before token is issued.'}
            </p>
          </div>
        </div>

        {/* ZK architecture strip */}
        <div className="p-4" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
          <p className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-3">Zero-Knowledge Triangulation</p>
          <div className="grid grid-cols-5 gap-0 items-center text-center text-[10px]">
            {[
              { label: 'YOUR VAULT', sub: 'Holds raw documents', colour: 'text-sky-400', border: 'rgba(56,189,248,0.3)' },
              { arrow: true },
              { label: 'VEREMARK', sub: 'Independently verifies', colour: 'text-yellow-400', border: 'rgba(234,179,8,0.3)' },
              { arrow: true },
              { label: 'PILOTRECOGNITION', sub: 'Token only — zero raw data', colour: 'text-emerald-400', border: 'rgba(16,185,129,0.3)' },
            ].map((c, i) =>
              (c as any).arrow ? (
                <div key={i} className="flex items-center justify-center text-white/20 text-lg">→</div>
              ) : (
                <div key={i} className="p-2.5" style={{ background: 'rgba(255,255,255,0.04)', border: `1px solid ${(c as any).border}` }}>
                  <p className={`font-black mb-0.5 ${(c as any).colour}`}>{(c as any).label}</p>
                  <p className="text-white/30 leading-tight">{(c as any).sub}</p>
                </div>
              )
            )}
          </div>
        </div>

        {/* Credential cards */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-xs font-black tracking-widest text-white/60 uppercase">Credential Records</p>
            {walletChecks.length > 0 && (
              <button onClick={() => { setWizardOpen(true); setWizardStep(1); }} className="text-[10px] font-bold px-3 py-1.5 tracking-wider text-white/70 hover:text-white" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}>
                + ADD CREDENTIAL
              </button>
            )}
          </div>
          {walletChecks.length === 0 ? (
            <div className="text-center py-12" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
              <Lock size={28} className="text-white/20 mx-auto mb-3" />
              <p className="text-white/50 text-sm font-bold mb-1 tracking-wide">NO CREDENTIALS YET</p>
              <p className="text-white/25 text-xs max-w-xs mx-auto mb-5">Upload documents first, then initiate verification to receive cryptographic tokens.</p>
              <button onClick={() => setScreen('documents')} className="text-xs font-black px-6 py-3 tracking-widest text-white" style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(99,102,241,0.8))', border: '1px solid rgba(99,102,241,0.4)' }}>
                UPLOAD DOCUMENTS →
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {walletChecks.map((check: any) => {
                const label = checkLabels[check.check_type] ?? check.check_type.replace(/_/g, ' ').toUpperCase();
                const expiry = check.expiry_date ? new Date(check.expiry_date) : null;
                const isExpiringSoon = expiry && (expiry.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
                const st = statusConfig[(check.status as keyof typeof statusConfig)] ?? statusConfig.pending;
                return (
                  <div key={check.id} className="p-4" style={{ background: st.bg, border: `1px solid ${st.border}` }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="text-xs font-black text-white tracking-wider">{label}</p>
                        <p className="text-[10px] font-mono mt-0.5 text-white/30">{check.id ? maskToken(check.id) : '• • • • •'}</p>
                      </div>
                      <div className="flex items-center gap-1.5 px-2 py-1" style={{ background: 'rgba(0,0,0,0.3)', border: `1px solid ${st.border}` }}>
                        <div className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />
                        <span className={`text-[9px] font-black tracking-wider ${st.text}`}>{st.label}</span>
                      </div>
                    </div>
                    {expiry && (
                      <p className={`text-[10px] mb-2 ${check.status === 'expired' ? 'text-red-400 font-semibold' : isExpiringSoon ? 'text-yellow-400 font-semibold' : 'text-white/35'}`}>
                        {check.status === 'expired' ? '⚠ Expired: ' : isExpiringSoon ? '⚠ Expiring: ' : 'Valid until: '}
                        {expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                      </p>
                    )}
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] text-white/20 flex items-center gap-1"><Eye size={9} /> Token only — no raw data stored</span>
                      {check.status === 'expired' && (
                        <button onClick={() => { setWizardOpen(true); setWizardStep(1); }} className="text-[9px] font-black px-2.5 py-1 tracking-wider" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>RE-VERIFY →</button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Consent note */}
        <div className="flex items-start gap-3 p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
          <Lock size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <p className="text-[11px] text-blue-200 leading-relaxed">
            <strong className="text-white">Your data. Your control.</strong> Three separate consent chains: your vault provider, Veremark, and PilotRecognition.com. Revoking any one immediately invalidates the cryptographic token.
          </p>
        </div>

        {/* Wizard modal */}
        {wizardOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
            <motion.div className="w-full max-w-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.2 }} style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.12)' }}>
              <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                <div>
                  <p className="text-xs font-black tracking-widest text-white/40 uppercase">Credential Verification</p>
                  <p className="text-sm font-black text-white tracking-wide mt-0.5">{wizardStep === 1 ? 'Step 1 — Select Your ATO' : wizardStep === 2 ? 'Step 2 — Surcharge Notice' : 'Step 3 — Consent Sign-Off'}</p>
                </div>
                <button onClick={() => setWizardOpen(false)} className="text-white/30 hover:text-white"><X size={18} /></button>
              </div>
              <div className="flex px-6 pt-4 gap-2">
                {[1,2,3].map(s => (
                  <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <div className={`h-full transition-all duration-500 ${wizardStep >= s ? 'bg-sky-500' : 'bg-transparent'}`} style={{ width: wizardStep >= s ? '100%' : '0%' }} />
                  </div>
                ))}
              </div>
              <div className="px-6 py-5 space-y-4">
                {wizardStep === 1 && (
                  <>
                    <p className="text-xs text-white/50">Select your ATO or flight school for Veremark to contact during verification.</p>
                    <select value={selectedATO} onChange={e => setSelectedATO(e.target.value)} className="w-full px-3 py-2.5 text-xs font-semibold text-white outline-none" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}>
                      <option value="" style={{ background: '#0f172a' }}>— Select an ATO —</option>
                      {ATO_LIST.map(a => <option key={a} value={a} style={{ background: '#0f172a' }}>{a}</option>)}
                    </select>
                    <button disabled={!selectedATO} onClick={() => setWizardStep(2)} className="w-full py-3 text-xs font-black tracking-widest text-white disabled:opacity-30" style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}>CONTINUE →</button>
                  </>
                )}
                {wizardStep === 2 && (
                  <>
                    <div className="p-4" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)' }}>
                      <div className="flex items-start gap-3">
                        <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-xs font-black text-yellow-300 tracking-wide mb-1">VERIFICATION SURCHARGE NOTICE</p>
                          <p className="text-[11px] text-yellow-200/70 leading-relaxed"><strong className="text-white">Recognition+ includes 1 standard regional ATO verification per year.</strong> Additional ATOs or out-of-region verifications incur an external processing surcharge from Veremark.</p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-3">
                      <button onClick={() => setWizardStep(1)} className="flex-1 py-2.5 text-xs font-bold text-white/50" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>← BACK</button>
                      <button onClick={() => setWizardStep(3)} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white" style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}>PROCEED →</button>
                    </div>
                  </>
                )}
                {wizardStep === 3 && (
                  <>
                    <div className="p-4 space-y-2" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-3">Cryptographic Consent Declaration</p>
                      <ul className="space-y-1.5">
                        {['Contact the Civil Aviation Authority (CAA) on your behalf', `Request hour confirmation from: ${selectedATO}`, 'Issue a cryptographic verification token to PilotRecognition.com', 'Store a zero-knowledge proof receipt in your Verepass wallet'].map(item => (
                          <li key={item} className="flex items-start gap-2 text-[10px] text-white/50">
                            <CheckCircle size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                            {item}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input type="checkbox" checked={consentSigned} onChange={e => setConsentSigned(e.target.checked)} className="mt-0.5 flex-shrink-0 accent-sky-500 w-4 h-4" />
                      <span className="text-[11px] text-white/60 leading-relaxed">I understand and grant cryptographic consent to Veremark to contact the CAA and my selected ATO on my behalf.</span>
                    </label>
                    <div className="flex gap-3">
                      <button onClick={() => setWizardStep(2)} className="flex-1 py-2.5 text-xs font-bold text-white/50" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>← BACK</button>
                      <button disabled={!consentSigned} onClick={() => { setWizardOpen(false); setWizardStep(1); setConsentSigned(false); }} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white disabled:opacity-30" style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(5,150,105,0.8))', border: '1px solid rgba(16,185,129,0.4)' }}>✓ SUBMIT CONSENT & INITIATE</button>
                    </div>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}

      </motion.div>
    );
  }

  /* ── SCREEN: CREDENTIALS FORM ────────────────────────────────────────── */
  return (
    <motion.div className="space-y-4 max-w-5xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* ── BACK + HEADER ── */}
      <div className="flex items-center gap-3">
        <button onClick={() => setScreen('landing')} className="w-8 h-8 flex items-center justify-center text-white/40 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <ArrowRight size={14} className="rotate-180" />
        </button>
        <div className="flex-1">
          <p className="text-[10px] font-black tracking-[0.2em] text-white/30 uppercase">Pilot Credentials</p>
          <h2 className="text-lg font-black text-white tracking-wide mt-0.5">
            <span className="text-white">Credentials</span> <span className="text-red-500">&</span> <span style={{ color: '#fbbf24' }}>Verification</span>
          </h2>
        </div>
        {/* Wallet status badge */}
        <button
          onClick={() => setVerificationOpen(v => !v)}
          className="flex items-center gap-2 px-4 py-2 transition-all hover:brightness-110"
          style={{
            background: allVerified ? 'rgba(16,185,129,0.15)' : hasExpired ? 'rgba(239,68,68,0.15)' : 'rgba(59,130,246,0.15)',
            border: `1px solid ${allVerified ? 'rgba(16,185,129,0.4)' : hasExpired ? 'rgba(239,68,68,0.4)' : 'rgba(59,130,246,0.4)'}`,
            borderRadius: '999px',
          }}
        >
          <Shield size={12} className={allVerified ? 'text-emerald-400' : hasExpired ? 'text-red-400' : 'text-blue-400'} />
          <span className={`text-[10px] font-black tracking-wider ${allVerified ? 'text-emerald-400' : hasExpired ? 'text-red-400' : 'text-blue-300'}`}>
            {allVerified ? 'PRE-CLEARED' : hasExpired ? 'ACTION REQUIRED' : walletChecks.length > 0 ? 'VERIFYING' : 'VAULT STATUS'}
          </span>
          <ChevronRight size={10} className={`text-white/30 transition-transform ${verificationOpen ? 'rotate-90' : ''}`} />
        </button>
      </div>

      {/* ── ENCRYPTED LICENSURE FORM ── */}
      <div style={{ border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(12px)' }}>
        <div className="flex items-center justify-between px-5 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="flex items-center gap-2">
            <Lock size={12} className="text-emerald-400" />
            <span className="text-[10px] font-black tracking-[0.15em] text-emerald-400 uppercase">Encrypted Input — AES-256-GCM</span>
          </div>
          <span className="text-[8px] font-mono text-white/20">Zero-knowledge · Pilot-owned · Vault-stored</span>
        </div>
        <PilotLicensureExperiencePage
          onBack={() => setScreen('landing')}
          userProfile={userProfileProp}
        />
      </div>

      {/* ── Vault status strip with link to verification screen ── */}
      <button
        onClick={() => setScreen('verification')}
        className="w-full flex items-center gap-4 p-4 text-left transition-all hover:brightness-110"
        style={{ background: allVerified ? 'rgba(16,185,129,0.08)' : hasExpired ? 'rgba(239,68,68,0.08)' : 'rgba(59,130,246,0.08)', border: `1px solid ${allVerified ? 'rgba(16,185,129,0.25)' : hasExpired ? 'rgba(239,68,68,0.25)' : 'rgba(59,130,246,0.2)'}` }}
      >
        <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${allVerified ? 'bg-emerald-500/20' : hasExpired ? 'bg-red-500/20' : 'bg-blue-500/10'}`}>
          <Shield size={18} className={allVerified ? 'text-emerald-400' : hasExpired ? 'text-red-400' : 'text-blue-400'} />
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-xs font-black tracking-wider ${allVerified ? 'text-emerald-400' : hasExpired ? 'text-red-400' : 'text-blue-300'}`}>
            {allVerified ? 'PRE-CLEARED ✓' : hasExpired ? 'ACTION REQUIRED' : walletChecks.length > 0 ? `${walletChecks.length} CREDENTIAL RECORD${walletChecks.length !== 1 ? 'S' : ''} IN VAULT` : 'NO CREDENTIALS YET'}
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">View verification status, records, and initiate Veremark check</p>
        </div>
        <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
      </button>
    </motion.div>
  );
};
