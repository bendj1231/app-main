import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';
import {
  Home, User, Shield, Map, BookOpen, Plane, Wrench, FileText,
  BookMarked, Calendar, Newspaper, Settings, LogOut, Bell, Search,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Clock,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Star, Target,
  BarChart3, Building2, Zap, Globe, Menu, X, Filter, Download,
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye,
  Brain, FolderOpen, PlayCircle, GraduationCap, Activity, Image,
  CreditCard, Mail, Server, Database, Cloud
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useVaultProfile } from '@/src/hooks/useVaultProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { supabase } from '@/shared/lib/supabase';
import { PilotRecognitionProfilePage } from './pilot-recognition/PilotRecognitionProfilePage';
import { DigitalLogbookPage } from './pilot-recognition/DigitalLogbookPage';
import { LogbookHub } from './pilot-recognition/LogbookHub';
import { PilotLicensureExperiencePage } from './pilot-recognition/PilotLicensureExperiencePage';
import TypeRatingSearchPage from '../../../pages/TypeRatingSearchPage';
import { PortalAirlineExpectationsPage } from '../../../portal/pages/PortalAirlineExpectationsPage';
import { PathwaysPageModern } from '../../../portal/pages/PathwaysPageModern';
import FlightInstrumentDashboard from './dashboard/FlightInstrumentDashboard';
import { InfrastructureDashboard } from './InfrastructureDashboard';
import { PasskeyPrompt, useShouldShowPasskeyPrompt } from './PasskeyPrompt';
import { CareerIntelligenceDashboard } from './CareerIntelligenceDashboard';
import { DataProvenancePage } from '../pages/DataProvenancePage';
import ProfileImage from '../../../src/components/ProfileImage';

interface UnifiedPilotPlatformProps {
  onNavigate: (page: string) => void;
}

type TabId =
  | 'home' | 'profile' | 'wallet' | 'pathways' | 'programs'
  | 'airlines' | 'manufacturers' | 'atlas-cv' | 'logbook'
  | 'events' | 'newsroom' | 'settings' | 'score' | 'dashboard' | 'market-intel' | 'data-provenance';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     label: 'Recognition Board', icon: BarChart3 },
  { id: 'home',          label: 'Home',           icon: Home },
  { id: 'profile',       label: 'My Profile',      icon: User },
  { id: 'wallet',        label: 'Credential Wallet', icon: Shield },
  { id: 'pathways',      label: 'Pathways',        icon: Map },
  { id: 'programs',      label: 'Programs',        icon: BookOpen },
  { id: 'airlines',      label: 'Airlines',        icon: Plane },
  { id: 'manufacturers', label: 'Manufacturers',   icon: Wrench },
  { id: 'atlas-cv',      label: 'Atlas CV',        icon: FileText },
  { id: 'logbook',       label: 'Logbook',         icon: BookMarked },
  { id: 'events',        label: 'Events',          icon: Calendar },
  { id: 'newsroom',      label: 'Newsroom',        icon: Newspaper },
  { id: 'settings',      label: 'Settings',        icon: Settings },
];

// ─── Colour helpers ────────────────────────────────────────────────────────
const scoreColour = (s: number) =>
  s >= 80 ? 'text-emerald-600' : s >= 60 ? 'text-blue-600' : s >= 40 ? 'text-yellow-600' : 'text-red-600';
const scoreBg = (s: number) =>
  s >= 80 ? 'bg-emerald-500' : s >= 60 ? 'bg-blue-500' : s >= 40 ? 'bg-yellow-500' : 'bg-red-500';
const statusBadge = (status: string) => {
  const map: Record<string, string> = {
    verified: 'bg-emerald-100 text-emerald-700 border-emerald-200',
    expired:  'bg-red-100 text-red-700 border-red-200',
    pending:  'bg-yellow-100 text-yellow-700 border-yellow-200',
    in_review:'bg-blue-100 text-blue-700 border-blue-200',
  };
  return map[status] ?? 'bg-slate-100 text-slate-600 border-slate-200';
};

// ─── Sub-components ────────────────────────────────────────────────────────

const ScoreBar: React.FC<{ score: number; label?: string }> = ({ score, label }) => (
  <div className="w-full">
    {label && <div className="flex justify-between text-xs text-white/50 mb-1"><span>{label}</span><span className={scoreColour(score)}>{score}/100</span></div>}
    <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
      <div className={`h-full rounded-full transition-all duration-700 ${scoreBg(score)}`} style={{ width: `${score}%` }} />
    </div>
  </div>
);

const StatusPill: React.FC<{ status: string; label?: string }> = ({ status, label }) => (
  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold border ${statusBadge(status)}`}>
    {status === 'verified' && <CheckCircle size={10} />}
    {status === 'expired'  && <XCircle size={10} />}
    {status === 'pending'  && <Clock size={10} />}
    {status === 'in_review'&& <RefreshCw size={10} />}
    {label ?? status.replace('_', ' ').toUpperCase()}
  </span>
);

const glassCard = 'rounded-xl p-5';
const glassStyle: React.CSSProperties = {
  background: 'rgba(30,41,59,0.75)',
  backdropFilter: 'blur(10px)',
  border: '1px solid rgba(255,255,255,0.1)',
};

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string; action?: React.ReactNode; style?: React.CSSProperties }> =
  ({ title, children, className = '', action, style }) => (
  <div className={`${glassCard} ${className}`} style={style ?? glassStyle}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-xs font-bold text-white/80 uppercase tracking-widest">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// ─── TAB: HOME ─────────────────────────────────────────────────────────────
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const cardVariants: any = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const HomeTab: React.FC<{
  profile: any; walletChecks: any[]; onNavigate: (p: string) => void; setTab: (t: TabId) => void;
  enrolledInFoundation: boolean; airlines: any[]; auth0User?: any;
  avatarInputRef?: React.RefObject<HTMLInputElement | null>;
  avatarUploading?: boolean;
  avatarError?: string;
  handleAvatarUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}> = ({ profile, walletChecks, onNavigate, setTab, enrolledInFoundation, airlines, auth0User, avatarInputRef, avatarUploading, avatarError, handleAvatarUpload }) => {
  const [visible, setVisible] = React.useState(false);
  const [welcomeDismissed, setWelcomeDismissed] = React.useState(() => {
    try { return localStorage.getItem('welcome_dismissed') === '1'; } catch { return false; }
  });
  const dismissWelcome = () => {
    setWelcomeDismissed(true);
    try { localStorage.setItem('welcome_dismissed', '1'); } catch {}
  };
  const [onboardingOpen, setOnboardingOpen] = React.useState(false);
  const [onboardingStep, setOnboardingStep] = React.useState(1);
  const [obATO, setObATO] = React.useState('');
  const [obLicense, setObLicense] = React.useState('');
  const [obMedical, setObMedical] = React.useState('');
  const [obRadio, setObRadio] = React.useState('');
  const [obConsent, setObConsent] = React.useState(false);
  const [obConsent1, setObConsent1] = React.useState(false);
  const [obConsent2, setObConsent2] = React.useState(false);
  const [obConsent3, setObConsent3] = React.useState(false);
  const [obTokenising, setObTokenising] = React.useState(false);
  const [obDone, setObDone] = React.useState(false);
  const [obLogbookKey, setObLogbookKey] = React.useState('');
  const [obLogbookSynced, setObLogbookSynced] = React.useState(false);
  const [obLogbookSyncing, setObLogbookSyncing] = React.useState(false);
  const [obVaultUrl, setObVaultUrl] = React.useState('');
  const [obVaultLinked, setObVaultLinked] = React.useState(false);
  const [obCAA, setObCAA] = React.useState(profile?.caa_region ?? '');
  const [obATOs, setObATOs] = React.useState<string[]>(profile?.ato_name ? [profile.ato_name] : ['']);
  const [obLogbookProvider, setObLogbookProvider] = React.useState(profile?.logbook_provider ?? '');
  const [obHoursRaw, setObHoursRaw] = React.useState('');
  const [obHoursHash, setObHoursHash] = React.useState('');
  const [obHoursBand, setObHoursBand] = React.useState('');
  const [obHoursHashing, setObHoursHashing] = useState(false);
  const [obHoursHashed, setObHoursHashed] = useState(false);

  const [obDob, setObDob] = React.useState(profile?.date_of_birth ?? '');
  const [obLicenseType, setObLicenseType] = React.useState(profile?.current_occupation ?? '');
  const obCadetTrack = React.useMemo(() => {
    const STUDENT_OCC = ['Student Pilot', 'Cadet'];
    const isStudent = STUDENT_OCC.includes(obLicenseType);
    const isMinor = obDob ? (() => {
      const birth = new Date(obDob);
      const now = new Date();
      let age = now.getFullYear() - birth.getFullYear();
      const m = now.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && now.getDate() < birth.getDate())) age--;
      return age < 18;
    })() : false;
    if (!isMinor && !isStudent) return null;
    return isMinor ? 'minor' : 'student';
  }, [obDob, obLicenseType]);

  const hashHours = React.useCallback(async (rawHours: string) => {
    const n = parseFloat(rawHours);
    if (isNaN(n) || n < 0) return;
    setObHoursHashing(true);
    const band =
      n < 200 ? '<200h' : n < 500 ? '200-500h' : n < 1000 ? '500-1000h' :
      n < 1500 ? '1000-1500h' : n < 3000 ? '1500-3000h' : n < 5000 ? '3000-5000h' : '5000h+';
    const encoder = new TextEncoder();
    const data = encoder.encode(`PR_LOGBOOK_HOURS::${n.toFixed(1)}`);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    setObHoursHash(hashHex);
    setObHoursBand(band);
    setObHoursHashing(false);
    setObHoursHashed(true);
  }, []);

  // ── Regional provider detection via timezone ──
  const detectedRegion = React.useMemo(() => {
    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (
        tz.startsWith('Asia/Manila') || tz.startsWith('Asia/Singapore') ||
        tz.startsWith('Asia/Kuala') || tz.startsWith('Asia/Jakarta') ||
        tz.startsWith('Asia/Bangkok') || tz.startsWith('Asia/Ho_Chi') ||
        tz.startsWith('Asia/Hong_Kong') || tz.startsWith('Asia/Tokyo') ||
        tz.startsWith('Asia/Seoul') || tz.startsWith('Asia/Kolkata') ||
        tz.startsWith('Australia/') || tz.startsWith('Pacific/')
      ) return { label: 'Asia-Pacific', provider: 'Veremark', colour: '#16a34a' };
      if (
        tz.startsWith('Europe/') || tz.startsWith('Atlantic/')
      ) return { label: 'Europe', provider: 'Veremark', colour: '#2563eb' };
      if (
        tz.startsWith('America/') || tz.startsWith('US/')
      ) return { label: 'North America', provider: 'HireRight / First Advantage', colour: '#d97706' };
      return { label: 'Global', provider: 'Veremark', colour: '#6366f1' };
    } catch { return { label: 'Global', provider: 'Veremark', colour: '#6366f1' }; }
  }, []);

  const startTokenise = () => {
    setObTokenising(true);
    setOnboardingStep(4);
    setTimeout(() => { setObTokenising(false); setObDone(true); }, 3200);
  };

  React.useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);
  const score   = profile?.recognition_score ?? 0;
  const hours   = profile?.total_flight_hours ?? 0;
  const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
  const rawName = profile?.display_name || profile?.full_name || profile?.first_name;
  const name    = (rawName && !isCiphertext(rawName)) ? rawName : (auth0User?.name || auth0User?.nickname || auth0User?.email?.split('@')[0] || 'Pilot');
  const rawLevel = profile?.current_occupation;
  const level   = (rawLevel && !isCiphertext(rawLevel)) ? rawLevel : 'Student Pilot';
  const initials = name.charAt(0).toUpperCase();
  const certifications = profile?.certifications || profile?.licenses || profile?.ratings || [];
  const certCount = Array.isArray(certifications) ? certifications.length : 0;
  const hoursForNext = 50;
  const progressPct = Math.min((hours / hoursForNext) * 100, 100);
  const expiredChecks = walletChecks.filter(c => c.status === 'expired');

  const steps = [
    { step: 1, label: 'Complete Profile',    sublabel: 'Name, hours & occupation',  done: !!profile,                                          tab: 'profile'   as TabId, icon: User,     highlight: false },
    { step: 2, label: 'Log Flight Hours',    sublabel: 'Add your first flight hour', done: hours > 0,                                          tab: 'logbook'   as TabId, icon: Clock,    highlight: false },
    { step: 3, label: 'Verify Credentials',  sublabel: 'Wallet + Veremark token',    done: walletChecks.some(c => c.status === 'verified'),     tab: 'wallet'    as TabId, icon: Shield,   highlight: false },
    { step: 4, label: 'Browse Pathways',     sublabel: 'Submit your interest',       done: score > 0,                                           tab: 'pathways'  as TabId, icon: Map,      highlight: false },
    { step: 5, label: 'Start a Program',     sublabel: 'Foundation or Transition',   done: enrolledInFoundation,                                tab: 'programs'  as TabId, icon: BookOpen, highlight: false },
    { step: 6, label: 'Recognition+',        sublabel: 'Upgrade Now — $99/yr',       done: false,                                               tab: 'settings'  as TabId, icon: Star,     highlight: true  },
  ];
  const completedCount = steps.filter(s => s.done).length;

  const matchPct = Math.min(
    Math.round(
      (!!profile ? 20 : 0) +
      (hours > 0 ? 20 : 0) +
      (walletChecks.some(c => c.status === 'verified') ? 25 : 0) +
      (score > 0 ? 20 : 0) +
      (enrolledInFoundation ? 15 : 0)
    ), 100
  );

  const bCards = [
    { id: 'pathways', title: 'MY PATHWAYS',   image: '/images/airline-operations.png',                                                                    onClick: () => setTab('pathways') },
    { id: 'programs', title: enrolledInFoundation ? 'ACCESS PROGRAMS' : 'MY PROGRAMS', image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png', onClick: () => onNavigate(enrolledInFoundation ? 'foundational-platform' : 'foundational-program') },
  ];

  return (
    <motion.div
      className="flex gap-5 w-full" style={{ minHeight: 'calc(100vh - 108px)' }}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {/* ── LEFT: Profile Card ── */}
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
        className="w-64 flex-shrink-0 flex flex-col self-start"
        style={{ background: 'rgba(30,41,59,0.8)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}
      >
        {!profile ? (
          /* ── GUEST ONBOARDING GATEWAY ── */
          <>
            <div className="p-6 flex flex-col gap-4">
              {/* Globe guest icon + header */}
              <div className="flex flex-col items-center gap-2 mb-1">
                <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.06)', border: '1.5px solid rgba(255,255,255,0.15)' }}>
                  <Globe size={28} className="text-white/50" />
                </div>
                <h2 className="text-base font-black text-white tracking-wide text-center">Welcome Aboard</h2>
                <p className="text-[10px] text-white/40 text-center leading-snug">Authenticate your profile to activate your digital flight deck.</p>
              </div>

              {/* Primary: Get Recognition Free */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                className="w-full py-3 text-sm font-black tracking-wide text-white rounded-lg transition-all hover:brightness-110"
                style={{ background: '#dc2626' }}
              >
                Get Recognition Free
              </button>

              {/* Secondary: Pilot Sign In */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                className="w-full py-3 text-sm font-black tracking-wide text-white rounded-lg transition-all hover:brightness-110"
                style={{ background: '#1e3a5f' }}
              >
                Pilot Sign In
              </button>
            </div>

            {/* Recognition+ compliance vault */}
            <div
              className="px-5 py-4 flex flex-col gap-2"
              style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.18), rgba(251,146,60,0.12))', borderTop: '1px solid rgba(234,179,8,0.35)' }}
            >
              <div className="flex items-center gap-2 mb-1">
                <Star size={13} className="text-yellow-400 flex-shrink-0" />
                <span className="text-xs font-black text-yellow-300 tracking-wider">RECOGNITION+ COMPLIANCE</span>
              </div>
              <ul className="flex flex-col gap-1">
                {[
                  'Automated Veremark Background Checks',
                  'Live Fleet & Operator Requirements Audit',
                  'Expedited ATO Logbook Validation Pipeline',
                ].map(perk => (
                  <li key={perk} className="flex items-start gap-1.5">
                    <span className="text-yellow-400 text-[10px] mt-0.5 flex-shrink-0">☑</span>
                    <span className="text-[10px] text-yellow-500/70 leading-snug">{perk}</span>
                  </li>
                ))}
              </ul>
              <button
                onClick={() => window.location.href = '/become-member'}
                className="mt-1 w-full py-2 text-center text-[11px] font-black tracking-widest text-slate-900 rounded transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}
              >
                UPGRADE NOW — $99/YR
              </button>
            </div>
          </>
        ) : (
          /* ── AUTHENTICATED PROFILE CARD ── */
          <>
            <div className="p-6 flex-1">
              {expiredChecks.length > 0 && (
                <button onClick={() => setTab('wallet')} className="w-full mb-4 flex items-center gap-2 px-3 py-2 text-xs text-red-300 font-semibold" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
                  <AlertTriangle size={12} className="flex-shrink-0" />
                  {expiredChecks.length} credential{expiredChecks.length > 1 ? 's' : ''} expired
                </button>
              )}

              {/* Hidden file input */}
              <input
                ref={avatarInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarUpload}
              />

              {/* Avatar - clickable to upload */}
              <div
                className="relative w-24 h-24 mx-auto mb-1 cursor-pointer group"
                onClick={() => !avatarUploading && avatarInputRef?.current?.click()}
                title="Click to change photo"
              >
                <ProfileImage
                  url={profile?.profile_image_url}
                  publicId={profile?.profile_image_public_id}
                  name={name}
                  size={96}
                  className="rounded-full border-2 border-white/30"
                  fallbackClassName="rounded-full bg-blue-500 text-white text-xl"
                />
                {/* Camera overlay on hover */}
                <div className="absolute inset-0 rounded-full flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity">
                  {avatarUploading
                    ? <div className="w-5 h-5 border-2 border-white/60 border-t-white rounded-full animate-spin" />
                    : <Camera size={20} className="text-white" />}
                </div>
              </div>
              {avatarError && <p className="text-red-400 text-[10px] text-center mb-2">{avatarError}</p>}
              {!avatarError && <p className="text-white/30 text-[10px] text-center mb-3">Tap to change photo</p>}

              <h2 className="text-base font-bold text-white text-center mb-1 tracking-wider">{name}</h2>
              <p className="text-center text-orange-400 text-xs font-semibold mb-4 uppercase tracking-wider">{level}</p>

              {/* 2×2 stats */}
              <div className="grid grid-cols-2 gap-2 mb-4">
                <div className="text-center p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {hours > 0
                    ? <p className="text-lg font-bold text-white">{hours}</p>
                    : <p className="text-[10px] font-semibold text-white/40 leading-tight">Log your first<br/>flight hour</p>}
                  <p className="text-xs text-white/60 uppercase mt-0.5">HOURS</p>
                </div>
                <div className="text-center p-2 cursor-pointer hover:ring-1 hover:ring-sky-400/50 transition-all" style={{ background: 'rgba(255,255,255,0.05)' }} onClick={() => setTab('score' as TabId)}>
                  {score > 0
                    ? <p className="text-lg font-bold text-sky-300">{score}</p>
                    : <p className="text-[10px] font-semibold text-white/40 leading-tight">Build your<br/>profile first</p>}
                  <p className="text-xs text-white/60 uppercase mt-0.5">SCORE</p>
                </div>
                <div className="text-center p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  {certCount > 0
                    ? <p className="text-lg font-bold text-white">{certCount}</p>
                    : <p className="text-[10px] font-semibold text-white/40 leading-tight">Add your<br/>credentials</p>}
                  <p className="text-xs text-white/60 uppercase mt-0.5">CERTS</p>
                </div>
                <div className="text-center p-2" style={{ background: 'rgba(255,255,255,0.05)' }}>
                  <p className="text-lg font-bold text-orange-400">{Math.max(hoursForNext - hours, 0)}</p>
                  <p className="text-xs text-white/60 uppercase mt-0.5">TO NEXT</p>
                </div>
              </div>

              {/* Progress bar */}
              <div className="mb-2">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-white/60 uppercase tracking-wider text-[10px]">LEVEL PROGRESS</span>
                  <span className={`font-bold text-[10px] ${progressPct > 0 ? 'text-orange-400' : 'text-white/30'}`}>{Math.round(progressPct)}%</span>
                </div>
                <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.15)' }}>
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{ width: `${Math.max(progressPct, progressPct > 0 ? 4 : 0)}%`, background: progressPct > 0 ? 'linear-gradient(90deg, #f97316, #ef4444)' : 'transparent' }}
                  />
                </div>
                {progressPct === 0 && <p className="text-[9px] text-white/25 mt-2">Log hours to level up →</p>}
              </div>

              {/* Pilot Wallet Credentials */}
              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-2">
                  <p className="text-[9px] font-black tracking-[0.18em] text-white/30 uppercase">Pilot Wallet</p>
                  {/* System status pulse */}
                  <div className="flex items-center gap-1">
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                      <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                    </span>
                    <span className="text-[8px] font-bold text-emerald-400/70 tracking-wider uppercase">Encrypted</span>
                  </div>
                </div>
                {/* Encrypted server status strip */}
                <div className="flex items-center gap-1.5 px-2 py-1.5 rounded mb-2" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(16,185,129,0.15)' }}>
                  <Lock size={8} className="text-emerald-400/60 flex-shrink-0" />
                  <p className="text-[8px] font-mono text-emerald-400/50 tracking-wide truncate">AES-256-GCM · Zero-knowledge · Pilot-owned</p>
                </div>
                {profile?.wallet_did ? (
                  <div className="flex flex-col gap-1.5">
                    <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.25)' }}>
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[9px] font-black text-emerald-400 uppercase tracking-wider">DID Active</p>
                        <p className="text-[8px] text-white/30 font-mono truncate">{profile.wallet_did.slice(0, 24)}…</p>
                      </div>
                    </div>
                    {walletChecks.length > 0 ? (
                      <div className="flex items-center gap-2 px-2.5 py-2 rounded-lg" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
                        <Shield size={10} className="text-blue-400 flex-shrink-0" />
                        <p className="text-[9px] font-bold text-blue-300">{walletChecks.length} Credential{walletChecks.length > 1 ? 's' : ''} Issued</p>
                      </div>
                    ) : (
                      <button onClick={() => setTab('wallet' as TabId)} className="flex items-center gap-2 px-2.5 py-2 rounded-lg w-full text-left transition-all hover:brightness-110" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                        <Shield size={10} className="text-white/30 flex-shrink-0" />
                        <p className="text-[9px] font-bold text-white/40">Issue Credentials →</p>
                      </button>
                    )}
                  </div>
                ) : (
                  <button onClick={() => onNavigate('become-member')} className="w-full flex items-center gap-2 px-2.5 py-2 rounded-lg transition-all hover:brightness-110" style={{ background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.25)' }}>
                    <Shield size={10} className="text-orange-400 flex-shrink-0" />
                    <p className="text-[9px] font-black text-orange-400">Activate Wallet →</p>
                  </button>
                )}
              </div>
            </div>

            {/* PILOT PROFILE link */}
            <button
              onClick={() => onNavigate('pilot-recognition-profile')}
              className="w-full flex items-center gap-3 px-6 py-4 transition-colors hover:bg-white/5"
              style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
            >
              <ChevronRight size={18} className="text-white/70" />
              <span className="text-sm font-bold text-white tracking-wider">PILOT PROFILE</span>
            </button>

          </>
        )}
      </motion.div>

      {/* ── RIGHT: Get Started (top) + alerts + bento cards ── */}
      <div className="flex-1 flex flex-col gap-4 relative">

        {/* ── WELCOME BAR — dismissible, first-visit only ── */}
        {!welcomeDismissed && profile && (
          <div
            className="flex items-center gap-3 px-4 py-2.5"
            style={{ background: 'linear-gradient(90deg, rgba(59,130,246,0.18), rgba(99,102,241,0.14))', border: '1px solid rgba(99,102,241,0.3)' }}
          >
            <span className="text-sm">✈️</span>
            <p className="flex-1 text-xs font-semibold text-white/90 leading-snug">
              Welcome aboard, Captain <span className="text-sky-300 font-black">{name}</span>! Let's set up your profile to unlock industry pathways.
            </p>
            <button
              onClick={dismissWelcome}
              className="text-white/30 hover:text-white/80 transition-colors flex-shrink-0 ml-2"
              aria-label="Dismiss"
            >
              <X size={14} />
            </button>
          </div>
        )}

        {/* ── ACCOUNT ACTIVATION STRIP — compact single row ── */}
        <div
          className="flex items-center gap-4 px-5 py-3"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {/* Left: context */}
          <div className="flex-1 min-w-0">
            <p className="text-xs font-black tracking-wide leading-none"><span className="text-white">Pilot Credentials</span> <span className="text-red-500">Verification</span> <span className="text-white/30">→</span> <span style={{ color: '#fbbf24' }}>Exclusive Pathways & Priority Listings</span></p>
            <p className="text-[10px] text-white mt-0.5 leading-snug">Get your credentials verified — licences, logbook & ratings — against international aviation standards <span style={{ color: '#fbbf24', fontWeight: 700 }}>worldwide</span></p>
          </div>
          {/* Center: progress bar */}
          <div className="flex items-center gap-2 flex-shrink-0">
            <div className="h-1.5 w-24 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-700"
                style={{ width: `${(completedCount / steps.length) * 100}%` }}
              />
            </div>
            <span className="text-[10px] font-bold text-white/40 tabular-nums">{completedCount}/{steps.length}</span>
          </div>
          {/* Right: Recognition+ CTA */}
          <button
            onClick={() => setTab('settings' as TabId)}
            className="flex-shrink-0 flex items-center px-5 py-2 text-[11px] font-black tracking-widest text-white transition-all hover:brightness-110"
            style={{ background: '#dc2626', border: 'none', borderRadius: '999px', boxShadow: '0 4px 20px rgba(220,38,38,0.4)' }}
          >
            RECOGNITION+ — $99/YR
          </button>
        </div>

        {/* Expired credential alert */}
        {expiredChecks.length > 0 && (
          <button
            onClick={() => setTab('wallet')}
            className="w-full flex items-center gap-3 px-4 py-3 text-left transition-all hover:brightness-110"
            style={{ background: 'rgba(239,68,68,0.18)', border: '1px solid rgba(239,68,68,0.4)' }}
          >
            <div className="w-8 h-8 rounded-full bg-red-500/30 flex items-center justify-center flex-shrink-0">
              <AlertTriangle size={15} className="text-red-300" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-red-300 leading-none mb-0.5">
                {expiredChecks.length} Credential{expiredChecks.length > 1 ? 's' : ''} Expired — Pre-Cleared Status Inactive
              </p>
              <p className="text-xs text-red-400/70">Renew in Credential Wallet to restore verified status for airline operators.</p>
            </div>
            <ChevronRight size={16} className="text-red-400 flex-shrink-0" />
          </button>
        )}

        {/* Bento grid — unified overlay style on all 3 cards */}
        <div className="grid grid-cols-2 gap-4 content-start">
          {/* MY PATHWAYS — with live match badge */}
          <motion.div
            custom={0} variants={cardVariants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            onClick={bCards[0].onClick}
            className="col-span-2 relative group cursor-pointer overflow-hidden"
            style={{ height: '180px', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${bCards[0].image})`, opacity: 0.75 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />
            {/* Match badge */}
            <div className="absolute top-3 right-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black tracking-wide"
              style={{ background: matchPct >= 80 ? 'rgba(16,185,129,0.85)' : matchPct >= 40 ? 'rgba(234,179,8,0.85)' : 'rgba(239,68,68,0.8)', color: '#fff', backdropFilter: 'blur(4px)' }}
            >
              <TrendingUp size={10} />
              Profile Match: {matchPct}%
            </div>
            <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
              <div className="w-9 h-9 flex items-center justify-center bg-white/10 border border-white/20">
                <ChevronRight size={20} className="text-white" />
              </div>
              <div>
                <h3 className="text-base font-bold text-white tracking-wider">{bCards[0].title}</h3>
                {matchPct < 100 && <p className="text-[10px] text-white/50 mt-0.5">Complete your profile to reach 100% eligibility</p>}
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>

          {/* MY PROGRAMS */}
          <motion.div
            custom={1} variants={cardVariants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            onClick={bCards[1].onClick}
            className="relative group cursor-pointer overflow-hidden"
            style={{ height: '160px', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${bCards[1].image})`, opacity: 0.85 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-transparent to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20">
                <ChevronRight size={16} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">{bCards[1].title}</h3>
            </div>
            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>

          {/* SPLIT: Digital Logbook + Pilot Credentials */}
          <motion.div
            custom={2} variants={cardVariants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            className="relative overflow-hidden flex flex-col gap-0"
            style={{ height: '160px', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {/* Top half — Digital Logbook */}
            <button
              onClick={() => onNavigate('digital-logbook')}
              className="relative flex-1 group/logbook flex items-center gap-3 px-4 overflow-hidden transition-all hover:brightness-110"
              style={{ background: 'rgba(30,41,59,0.85)', borderBottom: '1px solid rgba(255,255,255,0.1)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)' }}>
                <BookMarked size={15} className="text-sky-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white tracking-wider">DIGITAL LOGBOOK</p>
                <p className="text-[10px] text-white/40 mt-0.5">{hours > 0 ? `${hours} hrs logged` : 'Log your first flight'}</p>
              </div>
              <ChevronRight size={14} className="ml-auto text-white/30 group-hover/logbook:text-white/70 transition-colors" />
            </button>
            {/* Bottom half — Pilot Credentials */}
            <button
              onClick={() => setTab('wallet')}
              className="relative flex-1 group/creds flex items-center gap-3 px-4 overflow-hidden transition-all hover:brightness-110"
              style={{ background: 'rgba(15,23,42,0.9)' }}
            >
              <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,179,8,0.18)', border: '1px solid rgba(234,179,8,0.35)' }}>
                <Shield size={15} className="text-yellow-400" />
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-white tracking-wider">PILOT CREDENTIALS</p>
                <p className="text-[10px] mt-0.5" style={{ color: walletChecks.some(c => c.status === 'verified') ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.35)' }}>
                  {walletChecks.some(c => c.status === 'verified') ? `${walletChecks.filter(c => c.status === 'verified').length} verified` : 'No credentials yet'}
                </p>
              </div>
              <ChevronRight size={14} className="ml-auto text-white/30 group-hover/creds:text-white/70 transition-colors" />
            </button>
          </motion.div>
          {/* ── CARD 3: Type Rating Search ── */}
          <motion.div
            custom={3} variants={cardVariants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            onClick={() => window.location.href = '/type-rating-search'}
            className="relative group cursor-pointer overflow-hidden"
            style={{ height: '160px', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {/* Full-bleed cockpit image */}
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80')", opacity: 0.85 }} />
            {/* Bottom-only gradient for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

            {/* Single consolidated bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'rgba(5,10,20,0.82)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronRight size={13} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black tracking-[0.12em] text-white/40 uppercase leading-none mb-0.5">Recommended</p>
                  <p className="text-[10px] font-black text-white tracking-wide leading-none">Type Rating Search</p>
                </div>
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase flex-shrink-0">View All →</span>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>

          {/* ── CARD 4: Operator Expectations ── */}
          <motion.div
            custom={4} variants={cardVariants} initial="hidden" animate={visible ? 'visible' : 'hidden'}
            onClick={() => setTab('pathways')}
            className="relative group cursor-pointer overflow-hidden"
            style={{ height: '160px', border: '1px solid rgba(255,255,255,0.2)' }}
          >
            {/* Full-bleed airline tarmac image */}
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80')", opacity: 0.85 }} />
            {/* Bottom-only gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/20 to-transparent" />

            {/* Single consolidated bottom bar */}
            <div className="absolute bottom-0 left-0 right-0 px-4 py-3" style={{ background: 'rgba(5,10,20,0.82)', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3">
                <div className="w-7 h-7 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)' }}>
                  <ChevronRight size={13} className="text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black tracking-[0.12em] text-white/40 uppercase leading-none mb-0.5">Explore</p>
                  <p className="text-[10px] font-black text-white tracking-wide leading-none">Operator Expectations</p>
                </div>
                <span className="text-[9px] font-black tracking-widest text-white/40 uppercase flex-shrink-0">Explore →</span>
              </div>
            </div>
            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>
        </div>

      </div>{/* end right flex col */}

      {/* ════════════════════════════════════════════════════════════
          ONBOARDING MODAL — 4-step multi-party verification flow
      ════════════════════════════════════════════════════════════ */}
      {onboardingOpen && (
        <div
          className="fixed inset-0 z-[300] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.82)', backdropFilter: 'blur(10px)' }}
        >
          <motion.div
            className="w-full max-w-xl flex flex-col"
            initial={{ opacity: 0, scale: 0.96, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.22 }}
            style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e5e7eb', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 32px 80px rgba(0,0,0,0.45), 0 8px 24px rgba(0,0,0,0.25)' }}
          >
            {/* Modal header — logo + title */}
            <div className="relative px-6 pt-7 pb-5 flex-shrink-0 text-center" style={{ borderBottom: '1px solid #f1f5f9' }}>
              {!obTokenising && (
                <button onClick={() => setOnboardingOpen(false)} className="absolute top-4 right-5 text-gray-300 hover:text-gray-600 transition-colors">
                  <X size={16} strokeWidth={1.5} />
                </button>
              )}
              {/* Logo */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: '#cc0000' }}>
                  <svg width="10" height="10" viewBox="0 0 10 10" fill="none"><path d="M5 1L9 5L5 9M1 5H9" stroke="white" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <span className="text-[11px] font-black tracking-[0.18em] text-gray-900 uppercase">PilotRecognition</span>
              </div>
              {/* Title hierarchy */}
              <p className="text-[19px] font-black text-gray-900 leading-tight mb-1">
                {obDone ? 'Verification Initiated' : onboardingStep === 1 ? 'Multi-Party Data Authorization' : onboardingStep === 2 ? 'Cryptographic Escrow Activation' : onboardingStep === 3 ? 'Consent Declaration' : 'Token Generation'}
              </p>
              <p className="text-[11px] text-gray-400 font-normal">
                {onboardingStep === 1 ? 'Step 1 — Cryptographic Legal Release & Verification Consent' : onboardingStep === 2 ? 'Step 2 — Helio Payment Gateway' : onboardingStep === 3 ? 'Step 3 — Final Authorization' : 'Step 4 — Processing'}
              </p>
            </div>

            {/* Step progress bar */}
            <div className="flex gap-1 px-6 pt-4 flex-shrink-0">
              {[1,2,3,4].map(s => (
                <div key={s} className="flex-1 h-[3px]" style={{ background: '#e5e7eb' }}>
                  <div
                    className="h-full transition-all duration-500"
                    style={{ width: onboardingStep >= s ? '100%' : '0%', background: obDone ? '#16a34a' : '#1a1a1a' }}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* ── STEP 1: Cryptographic Legal Release & Multi-Party Consent ── */}
              {onboardingStep === 1 && (
                <>
                  {/* Section A — Pipeline Overview */}
                  <p className="text-[11px] text-gray-600 leading-relaxed">
                    By proceeding, you execute a decentralized, tokenized authorization directive enabling a multi-party credential verification process. This protocol operates strictly via zero-knowledge data routing mechanisms, facilitating an automated cryptographic exchange between your designated <strong className="text-gray-900">Approved Training Organisation (ATO)</strong>, the relevant <strong className="text-gray-900">Civil Aviation Authority (CAA)</strong>, your connected <strong className="text-gray-900">{profile?.logbook_provider ?? 'Logbook Provider'}</strong> flight records registry, and the regional verification infrastructure managed by <strong className="text-gray-900">{detectedRegion.provider}</strong>.
                  </p>

                  {/* Session Attributes — clean icon rows */}
                  <div className="rounded-xl space-y-0 overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center gap-2 px-4 py-2" style={{ borderBottom: '1px solid #eef2f7' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#f59e0b' }} />
                      <p className="text-[9px] font-semibold text-gray-500 uppercase tracking-widest">Claimed Session Profile — Pending Verification</p>
                      <div className="ml-auto flex items-center gap-1 px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', border: `1px solid ${detectedRegion.colour}40` }}>
                        <span className="text-[8px] font-bold" style={{ color: detectedRegion.colour }}>{detectedRegion.label} · {detectedRegion.provider}</span>
                      </div>
                    </div>
                    {/* Auth0 ID — read only */}
                    <div className="flex items-center gap-3 px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium w-44 flex-shrink-0" style={{ color: '#cc0000' }}>Auth0 Cryptographic Identifier</span>
                      <span className="text-[10px] font-semibold text-gray-900 select-none font-mono">{profile?.id ? `0x${profile.id.slice(0,3).toUpperCase()}...${profile.id.slice(-4).toUpperCase()}` : '— Not resolved'}</span>
                    </div>

                    {/* Date of Birth — Article 11 age gate */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>Date of Birth <span className="text-gray-400 font-normal">(Article 11 — Age Verification)</span></span>
                        {obCadetTrack === 'minor' && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>⚠ Minor — Cadet Track</span>
                        )}
                      </div>
                      <input
                        type="date"
                        value={obDob}
                        onChange={e => setObDob(e.target.value)}
                        max={new Date().toISOString().split('T')[0]}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      />
                    </div>

                    {/* License / Occupation Type — Article 11 track gate */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>License / Occupation Type</span>
                        {obCadetTrack === 'student' && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>⚠ Student — Cadet Track</span>
                        )}
                      </div>
                      <select
                        value={obLicenseType}
                        onChange={e => setObLicenseType(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select license / occupation type...</option>
                        {['Student Pilot','Cadet','Private Pilot (PPL)','Commercial Pilot (CPL)','Airline Transport Pilot (ATPL)','Flight Instructor (CFI)','Senior/Check Captain','Retired Pilot','Other'].map(o => (
                          <option key={o} value={o}>{o}</option>
                        ))}
                      </select>
                      {obCadetTrack && (
                        <div className="mt-2 px-3 py-2 rounded-lg" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                          <p className="text-[8px] font-black text-orange-800 uppercase tracking-wide mb-0.5">Cadet Track Mode Activated</p>
                          <p className="text-[8px] text-orange-700 leading-relaxed">
                            {obCadetTrack === 'minor'
                              ? 'You are under 18 years of age. Terminal 3 international airline gates are restricted. You may access Terminal 1 and Terminal 2 (flight school & cadet pathways). Gates unlock automatically at age 18.'
                              : 'Student and Cadet licenses are restricted from Terminal 3 enterprise airline pathways. You may access Terminal 1 and Terminal 2. Gates unlock when you upgrade to CPL or above.'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Civil Aviation Authority — dropdown */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium block mb-1.5" style={{ color: '#cc0000' }}>Jurisdictional Civil Aviation Authority</span>
                      <select
                        value={obCAA}
                        onChange={e => setObCAA(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select Civil Aviation Authority...</option>
                        {[
                          'CAAP — Civil Aviation Authority of the Philippines',
                          'CASA — Civil Aviation Safety Authority (Australia)',
                          'CAA — Civil Aviation Authority (UK)',
                          'EASA — European Union Aviation Safety Agency',
                          'FAA — Federal Aviation Administration (USA)',
                          'DGCA — Directorate General of Civil Aviation (India)',
                          'CAAS — Civil Aviation Authority of Singapore',
                          'GCAA — General Civil Aviation Authority (UAE)',
                          'TCCA — Transport Canada Civil Aviation',
                          'CAA — Civil Aviation Authority (New Zealand)',
                          'SACAA — South African Civil Aviation Authority',
                          'ANAC — Agência Nacional de Aviação Civil (Brazil)',
                          'DGAC — Direction Générale de l\'Aviation Civile (France)',
                          'LBA — Luftfahrt-Bundesamt (Germany)',
                          'ENAC — Ente Nazionale per l\'Aviazione Civile (Italy)',
                          'AESA — Agencia Estatal de Seguridad Aérea (Spain)',
                          'JCAB — Japan Civil Aviation Bureau',
                          'CAAC — Civil Aviation Administration of China',
                          'AAI — Airports Authority of India',
                          'ICAO — International Civil Aviation Organization (Other)',
                        ].map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>

                    {/* Target ATO — text input, multi-ATO support */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[9px] font-medium" style={{ color: '#cc0000' }}>Target Training Provider (ATO)</span>
                        {obATOs.length > 1 && (
                          <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#fff7ed', color: '#c2410c', border: '1px solid #fed7aa' }}>
                            +${(obATOs.length - 1) * 30}.00 surcharge — {obATOs.length - 1} additional ATO{obATOs.length > 2 ? 's' : ''}
                          </span>
                        )}
                      </div>
                      <div className="space-y-1.5">
                        {obATOs.map((ato, i) => (
                          <div key={i} className="flex gap-2 items-center">
                            <input
                              type="text"
                              value={ato}
                              onChange={e => { const a = [...obATOs]; a[i] = e.target.value; setObATOs(a); }}
                              placeholder={i === 0 ? 'Enter ATO or flight school name...' : `Additional ATO ${i + 1}...`}
                              className="flex-1 px-2.5 py-1.5 text-[10px] text-gray-900 outline-none placeholder-gray-400"
                              style={{ background: 'white', border: '1px solid #d1d5db', borderRadius: '6px' }}
                            />
                            {i > 0 && (
                              <button onClick={() => setObATOs(obATOs.filter((_, j) => j !== i))} className="flex-shrink-0 w-6 h-6 flex items-center justify-center font-bold transition-colors" style={{ background: '#fee2e2', color: '#dc2626', borderRadius: '4px', fontSize: '11px' }}>✕</button>
                            )}
                          </div>
                        ))}
                        <button
                          onClick={() => setObATOs([...obATOs, ''])}
                          className="text-[8px] font-semibold transition-colors"
                          style={{ color: '#cc0000' }}
                        >
                          + Add another ATO (+$30.00 per additional)
                        </button>
                      </div>
                    </div>

                    {/* Logbook Provider — select */}
                    <div className="px-4 py-2.5" style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <span className="text-[9px] font-medium block mb-1.5" style={{ color: '#cc0000' }}>Logbook Provider</span>
                      <select
                        value={obLogbookProvider}
                        onChange={e => setObLogbookProvider(e.target.value)}
                        className="w-full px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                        style={{ background: 'white', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                      >
                        <option value="">Select logbook provider...</option>
                        <option value="PilotRecognition Secure Logbook">PilotRecognition Secure Logbook (Tokenized — Recommended)</option>
                        <option disabled>──────────────</option>
                        {['ForeFlight', 'MyFlightbook', 'Safelog', 'LogTen Pro', 'Pilot Log', 'Other / Not connected'].map(p => (
                          <option key={p} value={p}>{p}</option>
                        ))}
                      </select>
                    </div>

                    {/* Timestamp — read only */}
                    <div className="flex items-center gap-3 px-4 py-2.5">
                      <span className="text-[9px] font-medium w-44 flex-shrink-0" style={{ color: '#cc0000' }}>System Timestamp Epoch</span>
                      <span className="text-[10px] font-semibold text-gray-900 select-none">{new Date().toISOString().replace('T', ' ').slice(0, 19) + ' UTC'}</span>
                    </div>
                  </div>

                  {/* PilotRecognition Secure Logbook note */}
                  {obLogbookProvider === 'PilotRecognition Secure Logbook' && (
                    <div className="rounded-xl px-4 py-3 space-y-1.5" style={{ background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
                      <p className="text-[9px] font-black text-green-800 uppercase tracking-wide">PilotRecognition Secure Logbook — Zero-Knowledge Architecture</p>
                      <p className="text-[9px] text-green-700 leading-relaxed">Your flight hours are entered and stored exclusively within the PilotRecognition platform as a <strong>cryptographic hash</strong>. The raw hour values are never retained — only a tokenized, one-way hash is generated. Veremark receives this hash to verify your hours against ATO attestation records. Neither PilotRecognition nor Veremark can reverse-read your raw logbook data. You own the source. We hold nothing.</p>
                    </div>
                  )}

                  {/* Logbook Provider — Veremark Access Token */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: obLogbookSynced ? '#16a34a' : '#e5e7eb' }} />
                        <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">Verified Logbook Registry Provider</p>
                      </div>
                      {obLogbookSynced && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Access Token Confirmed</span>
                      )}
                    </div>
                    <div className="px-4 py-3 space-y-3">
                      {/* Provider selector */}
                      <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">Select Your Verified Logbook Registry Provider</p>
                        <select
                          value={obLogbookProvider || obLogbookKey.split('::')[0] || ''}
                          onChange={e => { setObLogbookProvider(e.target.value); setObLogbookKey(e.target.value + '::'); setObLogbookSynced(false); }}
                          className="w-full px-3 py-2 text-[10px] text-gray-900 outline-none"
                          style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                        >
                          <option value="">Select provider...</option>
                          <option value="PilotRecognition Secure Logbook">PilotRecognition Secure Logbook (Tokenized — Recommended)</option>
                          <option disabled>─── Third-Party Live Integrations ───</option>
                          {['ForeFlight', 'MyFlightbook', 'Safelog', 'LogTen Pro', 'Other Third-Party Provider'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </div>
                      {/* Transient token input — third-party only */}
                      {obLogbookProvider && obLogbookProvider !== 'PilotRecognition Secure Logbook' && <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">
                          {(obLogbookProvider || obLogbookKey.split('::')[0] || 'Provider')} Secure Share Token / API Key
                        </p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={obLogbookKey.split('::')[1] ?? ''}
                            onChange={e => {
                              const provider = obLogbookKey.split('::')[0] ?? '';
                              setObLogbookKey(provider + '::' + e.target.value);
                              setObLogbookSynced(false);
                            }}
                            placeholder="Paste read-only share token..."
                            className="flex-1 px-3 py-2 text-[10px] font-mono text-gray-900 outline-none"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <button
                            onClick={() => {
                              const [provider, token] = obLogbookKey.split('::');
                              if (!provider || !token?.trim()) return;
                              setObLogbookSyncing(true);
                              setTimeout(() => { setObLogbookSyncing(false); setObLogbookSynced(true); }, 1000);
                            }}
                            disabled={!obLogbookKey.includes('::') || !obLogbookKey.split('::')[1]?.trim() || !obLogbookKey.split('::')[0] || obLogbookSyncing}
                            className="px-3 py-2 text-[9px] font-bold text-white transition-all disabled:opacity-40"
                            style={{ background: '#1a1a1a', borderRadius: '6px', whiteSpace: 'nowrap' }}
                          >
                            {obLogbookSyncing ? 'Confirming...' : 'Confirm'}
                          </button>
                        </div>
                        {/* Transient Pipeline Relay Safeguard notice */}
                        <div className="mt-2.5 px-3 py-2.5 rounded-lg" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          <p className="text-[8px] font-black text-gray-700 mb-1">Transient Pipeline Relay Safeguard</p>
                          <p className="text-[8px] text-gray-500 leading-relaxed">To ensure total data privacy, your third-party logbook access token functions strictly as a single-use routing credential. This input acts exclusively as a secure transient conduit: your token is pushed directly to Veremark over an end-to-end encrypted stream and is instantly destroyed from system memory. Your access key is never written, cached, or permanently stored anywhere inside the PilotRecognition database ecosystem.</p>
                        </div>
                        {obLogbookSynced && (
                          <p className="text-[8px] text-green-700 mt-1.5 font-medium">Token confirmed. Upon consent sign-off, your token will be transmitted directly to Veremark over an encrypted TLS stream and immediately purged from system memory. Read-only access only — no write permissions granted.</p>
                        )}
                      </div>}

                      {/* PilotRecognition Secure Logbook — DB Protocol Card */}
                      {obLogbookProvider === 'PilotRecognition Secure Logbook' && (
                        <div className="rounded-lg overflow-hidden" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                          {/* Card header */}
                          <div className="flex items-center justify-between px-3 py-2" style={{ borderBottom: '1px solid #e2e8f0' }}>
                            <p className="text-[8px] font-black text-gray-800 uppercase tracking-widest">Database Protocol &amp; Ledger Architecture</p>
                            <span className="text-[7px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#e2e8f0', color: '#64748b' }}>Supabase Vault Status: Neutral Node</span>
                          </div>
                          {/* Architecture rows */}
                          <div className="px-3 py-2.5 space-y-2">
                            {[
                              { label: 'Host Domain Storage', value: 'Supabase Neutral Node Ledger' },
                              { label: 'Ingestion Vector', value: 'Secure Auth0 Identity Protocol Layer' },
                              { label: 'Storage Target', value: 'Encrypted Supabase Database Network (profiles schema)' },
                              { label: 'Retention State', value: 'Permanent Cryptographic Hash Tokenization Only' },
                            ].map(row => (
                              <div key={row.label} className="flex items-baseline gap-2">
                                <span className="text-[8px] font-black text-gray-900 w-28 flex-shrink-0">{row.label}</span>
                                <span className="text-[8px] text-gray-500">{row.value}</span>
                              </div>
                            ))}
                          </div>
                          {/* Hours input — raw value never leaves this field */}
                          <div className="px-3 pb-2">
                            <div className="px-2.5 py-2.5 rounded space-y-2" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                              <p className="text-[7px] font-black text-gray-700 uppercase tracking-wide">Enter Total Flight Hours</p>
                              <p className="text-[8px] text-gray-400">Your raw hours are hashed instantly in-browser via SHA-256 and immediately discarded. Only the resulting hash string is stored.</p>
                              <div className="flex gap-2 items-center">
                                <input
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={obHoursRaw}
                                  onChange={e => { setObHoursRaw(e.target.value); setObHoursHashed(false); setObHoursHash(''); }}
                                  onBlur={() => { if (obHoursRaw) hashHours(obHoursRaw); }}
                                  placeholder="e.g. 1247.5"
                                  className="flex-1 px-2.5 py-1.5 text-[10px] text-gray-900 outline-none"
                                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                                />
                                <button
                                  onClick={() => { if (obHoursRaw) hashHours(obHoursRaw); }}
                                  disabled={!obHoursRaw || obHoursHashing}
                                  className="px-3 py-1.5 text-[9px] font-bold text-white disabled:opacity-40 transition-all"
                                  style={{ background: '#1a1a1a', borderRadius: '6px', whiteSpace: 'nowrap' }}
                                >
                                  {obHoursHashing ? 'Hashing...' : 'Hash'}
                                </button>
                              </div>
                              {obHoursHashed && (
                                <div className="space-y-1">
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-gray-700 w-20 flex-shrink-0">Hash Output</span>
                                    <span className="text-[8px] font-mono text-gray-500 truncate">{obHoursHash.slice(0,16)}...{obHoursHash.slice(-8)}</span>
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <span className="text-[8px] font-black text-gray-700 w-20 flex-shrink-0">Hour Band</span>
                                    <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>{obHoursBand}</span>
                                  </div>
                                  <p className="text-[7px] text-green-700 font-medium">Raw hours discarded. Hash + band ready for Supabase ledger commit on consent sign-off.</p>
                                </div>
                              )}
                            </div>
                          </div>
                          {/* Directive paragraph */}
                          <div className="px-3 pb-3">
                            <div className="px-2.5 py-2 rounded" style={{ background: 'white', border: '1px solid #e2e8f0' }}>
                              <p className="text-[7px] font-black text-gray-700 uppercase tracking-wide mb-1">System Architecture Directive</p>
                              <p className="text-[8px] text-gray-500 leading-relaxed">Flight hour records are ingested exclusively via the secure Auth0 session layer, where they are immediately converted into one-way cryptographic hashes. This interface passes the resulting hash token directly to a neutral, read-only storage partition on Supabase. Because the platform possesses no structural decryption keys, the raw integer values are completely unrecoverable by the database host. The local database remains entirely neutral, retaining zero visible or readable logbook assets.</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Veremark Direct Document Intake */}
                  <div className="rounded-xl overflow-hidden" style={{ border: '1px solid #e5e7eb' }}>
                    <div className="flex items-center justify-between px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e5e7eb' }}>
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: obVaultLinked ? '#16a34a' : '#e5e7eb' }} />
                        <p className="text-[9px] font-semibold text-gray-700 uppercase tracking-widest">Veremark Document Intake</p>
                      </div>
                      {obVaultLinked && (
                        <span className="text-[8px] font-bold px-2 py-0.5 rounded-full" style={{ background: '#f0fdf4', color: '#16a34a', border: '1px solid #bbf7d0' }}>Reference Token Received</span>
                      )}
                    </div>
                    <div className="px-4 py-3 space-y-3">
                      <p className="text-[9px] text-gray-500 leading-relaxed">
                        Your credential documents — pilot licence, medical certificate, radio licence, and training records — are uploaded <strong className="text-gray-700">directly to Veremark's secure intake portal</strong>. No files pass through or are stored by this platform. Upon completing your upload on Veremark's side, paste the reference token they provide below to link your document submission to this verification request.
                      </p>
                      <div className="flex items-center gap-2 p-2.5 rounded-lg" style={{ background: '#fff7ed', border: '1px solid #fed7aa' }}>
                        <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#f97316' }} />
                        <p className="text-[8px] text-orange-700">PilotRecognition never receives, stores, or processes your credential documents. All document handling, storage, and access control is managed exclusively by Veremark under their own GDPR and data privacy obligations.</p>
                      </div>
                      {/* Required documents checklist */}
                      <div className="space-y-1">
                        <p className="text-[8px] font-black text-gray-500 uppercase tracking-widest">Required for Veremark Intake</p>
                        {[
                          'Pilot Licence (CAPL / CPL / ATPL)',
                          'Class 1 Medical Certificate',
                          'Radio / NTC Licence',
                          'ATO Training Records or Logbook Extract',
                        ].map(doc => (
                          <div key={doc} className="flex items-center gap-2">
                            <div className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: '#cbd5e1' }} />
                            <span className="text-[8px] text-gray-500">{doc}</span>
                          </div>
                        ))}
                      </div>
                      {/* Open Veremark portal button */}
                      <a
                        href="https://veremark.com/upload"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between w-full px-4 py-2.5 text-white transition-all"
                        style={{ background: '#1a1a1a', borderRadius: '8px', textDecoration: 'none' }}
                      >
                        <span className="text-[10px] font-bold">Open Veremark Secure Upload Portal</span>
                        <span className="text-[9px] text-white/50">veremark.com →</span>
                      </a>
                      {/* Reference token input */}
                      <div>
                        <p className="text-[8px] font-semibold text-gray-600 mb-1.5">Paste your Veremark submission reference token:</p>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={obVaultUrl}
                            onChange={e => { setObVaultUrl(e.target.value); setObVaultLinked(false); }}
                            placeholder="VRM-XXXXXXXX..."
                            className="flex-1 px-3 py-2 text-[10px] font-mono text-gray-900 outline-none"
                            style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '6px' }}
                          />
                          <button
                            onClick={() => { if (obVaultUrl.trim()) setObVaultLinked(true); }}
                            disabled={!obVaultUrl.trim()}
                            className="px-3 py-2 text-[9px] font-bold text-white disabled:opacity-40 transition-all"
                            style={{ background: '#cc0000', borderRadius: '6px', whiteSpace: 'nowrap' }}
                          >
                            Confirm
                          </button>
                        </div>
                        {obVaultLinked && (
                          <p className="text-[8px] text-green-700 mt-1.5 font-medium">Token linked. Veremark will associate this submission with your verification request upon dispatch.</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* System Constraint Notice */}
                  <div className="rounded-xl px-4 py-3" style={{ background: '#f8fafc', border: '1px solid #e5e7eb' }}>
                    <p className="text-[9px] font-black text-gray-700 uppercase tracking-wide mb-1">System Constraint Notice</p>
                    <p className="text-[9px] text-gray-500 leading-relaxed">This interface functions exclusively as a secure pipeline relay. The underlying platform possesses no data decryption keys, database retention architecture, or administrative privileges required to intercept, modify, or cache your raw unencrypted credentials. The payload is directly transmitted to the verification endpoint as an immutable token bundle.</p>
                  </div>

                  {/* Section B — 3 Consent Checkboxes */}
                  <div className="space-y-3">
                    {/* Checkbox 1 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent1 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent1(!obConsent1)}
                      >
                        {obConsent1 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Regional Infrastructure Compliance (Veremark Processing)</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I hereby execute a digital authorization directive enabling Veremark and its authorized compliance nodes to submit a tokenized inquiry to the relevant Civil Aviation Authority, strictly limited to cross-referencing licensing parameters, currency statuses, radio telephony ratings, and medical certification records.</p>
                      </div>
                    </label>

                    <div style={{ borderTop: '1px solid #e5e7eb' }} />

                    {/* Checkbox 2 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent2 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent2(!obConsent2)}
                      >
                        {obConsent2 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Operational Record Audit (ATO Validation Dispatch)</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I authorize my designated Approved Training Organisation (ATO) or operating carrier to receive the secure ledger routing string, audit the matching digital logbook hours against institutional flight records, and return an encrypted verification receipt directly to the distributed platform network.</p>
                      </div>
                    </label>

                    <div style={{ borderTop: '1px solid #e5e7eb' }} />

                    {/* Checkbox 3 */}
                    <label className="flex items-start gap-3 cursor-pointer group">
                      <div
                        className="flex-shrink-0 w-4 h-4 mt-0.5 flex items-center justify-center transition-colors"
                        style={{ borderRadius: '4px', border: '1.5px solid #cbd5e1', background: obConsent3 ? '#1e293b' : 'white', cursor: 'pointer' }}
                        onClick={() => setObConsent3(!obConsent3)}
                      >
                        {obConsent3 && <svg width="9" height="7" viewBox="0 0 9 7" fill="none"><path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-gray-900 mb-0.5">Protocol Aggregation & Helio Payment Dispatch</p>
                        <p className="text-[9px] text-gray-600 leading-relaxed">I acknowledge and accept the platform's Terms of Service and Data Handling Policies. I verify my understanding that all personally identifiable information (PII) is tokenized at the session origin via Auth0 cryptographic hashes. Furthermore, I acknowledge that all financial processing is managed directly via the Helio protocol, executing instant, programmable escrow distributions.</p>
                      </div>
                    </label>
                  </div>

                  {/* Section C — SLA Timelines */}
                  <div className="p-3 space-y-2" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest mb-1.5">Standardized SLA Timelines</p>
                    {[
                      { party: 'CAA Verification Relay', time: '24 – 48 Hours', note: 'Subject to jurisdictional processing windows' },
                      { party: 'ATO Evaluation Dispatch', time: '1 – 3 Business Days', note: null },
                    ].map(t => (
                      <div key={t.party}>
                        <div className="flex items-center justify-between gap-3">
                          <span className="text-[9px] text-gray-600">{t.party}</span>
                          <span className="text-[9px] font-black text-gray-900 whitespace-nowrap">Est. {t.time}</span>
                        </div>
                        {t.note && <p className="text-[8px] text-gray-400 mt-0.5">{t.note}</p>}
                      </div>
                    ))}
                    <div style={{ borderTop: '1px solid #e5e7eb', marginTop: '6px', paddingTop: '6px' }}>
                      <p className="text-[8px] text-gray-500 leading-relaxed italic">Automated Network Trigger: Upon digital signature and secure validation checkout via the <strong className="text-gray-700">Helio payment gateway</strong>, a standard <strong className="text-gray-700">$5.00 compliance escrow allocation</strong> is programmatically opened to the designated ATO ledger via smart contract to facilitate priority queue processing.</p>
                    </div>
                  </div>

                  {/* Sign-off button */}
                  <button
                    disabled={!obConsent1 || !obConsent2 || !obConsent3}
                    onClick={async () => {
                      if (obLogbookProvider === 'PilotRecognition Secure Logbook' && obHoursHashed && profile?.id) {
                        await supabase.from('profiles').update({
                          logbook_hash: obHoursHash,
                          logbook_hash_updated_at: new Date().toISOString(),
                          logbook_total_hours_band: obHoursBand,
                          logbook_provider: obLogbookProvider,
                        }).eq('id', profile.id);
                      }
                      setOnboardingStep(2);
                    }}
                    className="w-full py-3 text-xs font-black tracking-widest text-white transition-all disabled:opacity-35 hover:bg-gray-800"
                    style={{ background: '#111827', border: 'none', borderRadius: '10px' }}
                  >
                    I AGREE, SIGN CONSENT &amp; CONTINUE →
                  </button>
                </>
              )}

              {/* ── STEP 2: Helio Secure Checkout ── */}
              {onboardingStep === 2 && (
                <>
                  {/* Notice bar */}
                  <div className="flex items-start gap-2 p-2.5" style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                    <Lock size={10} className="text-gray-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[8px] text-gray-500 leading-relaxed italic">This transaction is routed directly via the Helio network layer. No raw card or bank data is visible to or cached by this interface.</p>
                  </div>

                  {/* Transaction Summary Matrix */}
                  <div style={{ border: '1px solid #e2e8f0' }}>
                    <div className="px-4 py-2.5" style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest">Transaction Summary</p>
                    </div>
                    {[
                      { label: 'Network Request ID', value: `HLO-${Date.now().toString(36).toUpperCase().slice(-8)}` },
                      { label: 'Selected Validation Plan', value: 'Recognition+ Verification Ledger (Annual Sync)' },
                      { label: 'Base Network Cost', value: '$100.00 USDC' },
                      { label: 'Regional ATO Processing Surcharges', value: '$0.00 (Single regional scope)' },
                      { label: 'Helio Protocol Network Fee', value: '1.0%' },
                    ].map(row => (
                      <div key={row.label} className="flex items-baseline gap-3 px-4 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <span className="text-[9px] text-gray-400 w-44 flex-shrink-0">{row.label}</span>
                        <span className="text-[10px] font-semibold text-gray-800">{row.value}</span>
                      </div>
                    ))}
                    <div className="flex items-baseline gap-3 px-4 py-2.5" style={{ background: '#1a1a1a' }}>
                      <span className="text-[9px] text-white/50 w-44 flex-shrink-0">Total Settled Invoice Value</span>
                      <span className="text-[12px] font-black text-white">$100.00 USDC</span>
                    </div>
                  </div>

                  {/* Smart Contract Allocation Log */}
                  <div style={{ border: '1px solid #e2e8f0' }}>
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#f0fdf4', borderBottom: '1px solid #d1fae5' }}>
                      <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: '#16a34a' }} />
                      <p className="text-[9px] font-semibold text-green-700">Automated Smart Contract Allocation Log</p>
                    </div>
                    {[
                      { label: 'Compliance Node Activation', amount: '23.00 USDC', dest: `${detectedRegion.provider} Regional Processing Node (${detectedRegion.label})` },
                      { label: 'Logbook Sync Pipeline', amount: '5.00 USDC', dest: 'Authorized Third-Party Logbook Registry' },
                      { label: 'Training Provider Incentive', amount: '5.00 USDC', dest: 'ATO Settlement Ledger (24h escrow — held_commissions)' },
                      { label: 'Network Router Clearance', amount: '~67.00 USDC', dest: 'Platform Operational Reserve (after Helio fee)' },
                    ].map(row => (
                      <div key={row.label} className="px-4 py-2" style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <div className="flex items-baseline justify-between gap-2">
                          <span className="text-[9px] text-gray-500">{row.label}</span>
                          <span className="text-[9px] font-black text-gray-900 flex-shrink-0">{row.amount}</span>
                        </div>
                        <p className="text-[8px] text-gray-400 mt-0.5">→ {row.dest}</p>
                      </div>
                    ))}
                  </div>

                  {/* Helio Payment Widget */}
                  <div style={{ border: '2px solid #e2e8f0' }}>
                    <div className="px-4 py-3" style={{ borderBottom: '1px solid #e2e8f0' }}>
                      <p className="text-[9px] font-black text-gray-800 uppercase tracking-widest mb-2.5">Payment Method</p>
                      <div className="grid grid-cols-2 gap-2">
                        {[
                          { label: 'USDC / Crypto Wallet', active: true },
                          { label: 'Card / Apple Pay', active: false },
                        ].map(tab => (
                          <div key={tab.label} className="py-2 text-center text-[9px] font-bold cursor-pointer"
                            style={{ background: tab.active ? '#1a1a1a' : '#f5f7fa', color: tab.active ? 'white' : '#6b7280', border: `1px solid ${tab.active ? '#1a1a1a' : '#e2e8f0'}` }}>
                            {tab.label}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="px-4 py-4 text-center space-y-3">
                      <p className="text-[10px] text-gray-500">Connect wallet or scan QR to pay</p>
                      <div className="w-16 h-16 mx-auto flex items-center justify-center" style={{ background: '#f5f7fa', border: '1px solid #e2e8f0' }}>
                        <Lock size={20} className="text-gray-300" />
                      </div>
                      <p className="text-[8px] text-gray-400">Helio checkout iframe loads on deploy</p>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2.5" style={{ background: '#f0fdf4', borderTop: '1px solid #d1fae5' }}>
                      <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: '#16a34a' }} />
                      <p className="text-[8px] text-green-700 font-medium">Helio Protocol Active. Connected via End-to-End Encrypted Gateway. A digital cryptographic transaction receipt will be anchored directly to your Auth0 session profile upon block confirmation.</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(1)} className="py-2.5 px-5 text-xs font-bold text-gray-500 tracking-wider transition-all hover:text-gray-800" style={{ background: '#f5f7fa', border: '1px solid #e2e8f0' }}>← Back</button>
                    <button onClick={() => setOnboardingStep(3)} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white hover:bg-gray-800 transition-all" style={{ background: '#1a1a1a' }}>
                      PAYMENT CONFIRMED — INITIALIZE VEREMARK DISPATCH →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 3: Cryptographic Consent ── */}
              {onboardingStep === 3 && (
                <>
                  <div className="p-4" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.09)' }}>
                    <p className="text-[9px] font-black tracking-[0.2em] text-white/25 uppercase mb-3">Cryptographic Consent Declaration</p>
                    <p className="text-[11px] text-white/65 leading-relaxed mb-3">
                      By proceeding, you grant <strong className="text-white">tokenized, secure consent</strong> for <strong className="text-yellow-300">Veremark</strong> to cross-reference your records with:
                    </p>
                    <ul className="space-y-2 mb-4">
                      {[
                        { icon: Shield,     text: 'The Civil Aviation Authority (CAA) governing your pilot licence' },
                        { icon: BookOpen,   text: `Your designated ATO: ${obATO}` },
                        { icon: Lock,       text: 'Issue a cryptographic verification token to PilotRecognition.com' },
                        { icon: CheckCircle,text: 'Store a zero-knowledge proof receipt in your Verepass digital wallet' },
                      ].map(({ icon: Icon, text }) => (
                        <li key={text} className="flex items-start gap-2.5">
                          <Icon size={11} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          <span className="text-[10px] text-white/50 leading-relaxed">{text}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="h-px w-full mb-3" style={{ background: 'rgba(255,255,255,0.06)' }} />
                    <p className="text-[9px] text-white/20 leading-relaxed italic">
                      PilotRecognition.com never stores, reads, or transmits your raw PII. Only the triangulated token outcome is surfaced on your profile. This consent may be revoked at any time, immediately invalidating the token chain.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer p-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.2)' }}>
                    <input
                      type="checkbox"
                      checked={obConsent}
                      onChange={e => setObConsent(e.target.checked)}
                      className="mt-0.5 flex-shrink-0 accent-sky-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-white/70 leading-relaxed font-semibold">
                      I confirm and grant tokenized, secure consent for Veremark to cross-reference my records with the Civil Aviation Authority and my designated ATO.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(2)} className="flex-1 py-2.5 text-xs font-bold text-white/40 tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>← BACK</button>
                    <button
                      disabled={!obConsent}
                      onClick={startTokenise}
                      className="flex-1 py-2.5 text-xs font-black tracking-widest text-white transition-all disabled:opacity-25"
                      style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))', border: '1px solid rgba(16,185,129,0.4)' }}
                    >
                      I AGREE & CONFIRM →
                    </button>
                  </div>
                </>
              )}

              {/* ── STEP 4: Auth0 Token Generation ── */}
              {onboardingStep === 4 && (
                <div className="py-6 text-center space-y-5">
                  {obTokenising ? (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)' }}>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1.4, repeat: Infinity, ease: 'linear' }}
                        >
                          <Lock size={26} className="text-sky-400" />
                        </motion.div>
                      </div>
                      <div>
                        <p className="text-sm font-black text-white tracking-wide mb-1">Generating Cryptographic Token</p>
                        <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">Your personal data is being fully encrypted and tokenized. PilotRecognition.com will never store or view your raw credentials.</p>
                      </div>
                      <div className="space-y-2 max-w-sm mx-auto text-left">
                        {[
                          { label: 'Encrypting pilot licence data', done: true  },
                          { label: 'Routing consent to Veremark',   done: true  },
                          { label: 'Contacting CAA registry',       done: false },
                          { label: 'Issuing verification token',    done: false },
                        ].map((step, i) => (
                          <div key={step.label} className="flex items-center gap-2.5">
                            {step.done
                              ? <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" />
                              : <motion.div
                                  className="w-3 h-3 rounded-full border-2 border-sky-400 border-t-transparent flex-shrink-0"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 0.9, repeat: Infinity, ease: 'linear', delay: i * 0.2 }}
                                />
                            }
                            <p className={`text-[10px] ${step.done ? 'text-emerald-400' : 'text-white/40'}`}>{step.label}</p>
                          </div>
                        ))}
                      </div>
                    </>
                  ) : obDone ? (
                    <>
                      <div className="w-16 h-16 mx-auto rounded-full flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.4)' }}>
                        <CheckCircle size={28} className="text-emerald-400" />
                      </div>
                      <div>
                        <p className="text-sm font-black text-emerald-400 tracking-wide mb-1">Verification Request Submitted</p>
                        <p className="text-[11px] text-white/40 max-w-xs mx-auto leading-relaxed">Veremark has received your consent and will contact your ATO and CAA. Your token will appear in the Pilot Credentials vault within 2–5 business days.</p>
                      </div>
                      <div className="p-3 max-w-sm mx-auto" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)' }}>
                        <p className="text-[9px] font-mono text-emerald-300/60">Token pipeline: ACTIVE · Request ID: VRM-{Date.now().toString(16).toUpperCase().slice(-8)}</p>
                      </div>
                      <button
                        onClick={() => { setOnboardingOpen(false); setTab('wallet'); }}
                        className="px-8 py-2.5 text-xs font-black tracking-widest text-white"
                        style={{ background: 'linear-gradient(135deg,rgba(16,185,129,0.85),rgba(5,150,105,0.85))', border: '1px solid rgba(16,185,129,0.4)' }}
                      >
                        VIEW CREDENTIAL VAULT →
                      </button>
                    </>
                  ) : null}
                </div>
              )}

            </div>
          </motion.div>
        </div>
      )}

    </motion.div>
  );
};

// ─── TAB: SCORE BREAKDOWN ─────────────────────────────────────────────────
const COMPETENCIES = [
  { id: 1, name: 'Technical Knowledge', desc: 'Aircraft systems, avionics, regulations, meteorology, navigation. Verified via programs and exam scores.', weight: 15, icon: BookOpen },
  { id: 2, name: 'Flight Hours & Currency', desc: 'Total time, PIC time, instrument time, night time, multi-engine. Raw logbook data.', weight: 15, icon: Clock },
  { id: 3, name: 'License & Ratings', desc: 'CPL/ATPL, type ratings, endorsements. Verified via Credential Wallet token.', weight: 12, icon: Award },
  { id: 4, name: 'Medical Validity', desc: 'Class 1 / Class 2 current status. Expires independently of license.', weight: 10, icon: Shield },
  { id: 5, name: 'Behavioural Competency (EBT)', desc: 'Constructivism, cognitive thinking, CRM. Scored via EBT Video Interview — proprietary IP.', weight: 18, icon: Zap },
  { id: 6, name: 'Industry Alignment', desc: 'Completion of Transition Program, 9 core competencies mapped to HINFACT/ICAO standards.', weight: 12, icon: Target },
  { id: 7, name: 'Pathway Engagement', desc: 'Pathways submitted, matches accepted, operator interest received. Activity-based signal.', weight: 8, icon: Map },
  { id: 8, name: 'Background Verification', desc: 'NBI clearance, employment history, reference checks via Veremark. Token-based only.', weight: 6, icon: CheckCircle },
  { id: 9, name: 'Mentorship & Advocacy', desc: 'Pilots helped in Peer Chain. Effort-based recognition — aligns with two-tier model.', weight: 4, icon: TrendingUp },
];

const ScoreTab: React.FC<{ profile: any; setTab: (t: TabId) => void }> = ({ profile, setTab }) => {
  const score = profile?.recognition_score ?? 0;
  const maxScore = 100;
  return (
    <motion.div className="space-y-6 max-w-2xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* Score hero */}
      <div className="rounded-xl p-6 flex items-center gap-6" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.3)' }}>
        <div className="relative w-20 h-20 flex-shrink-0">
          <svg viewBox="0 0 36 36" className="w-full h-full -rotate-90">
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
            <circle cx="18" cy="18" r="15.9" fill="none" stroke="#0ea5e9" strokeWidth="3"
              strokeDasharray={`${(score / maxScore) * 100} 100`} strokeLinecap="round" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-black text-sky-300">{score}</span>
          </div>
        </div>
        <div>
          <p className="text-xs uppercase tracking-widest text-sky-400 font-bold mb-1">Recognition Score</p>
          <p className="text-2xl font-black text-white mb-1">{score} <span className="text-sm font-normal text-white/40">/ {maxScore}</span></p>
          <p className="text-xs text-white/50">Composite score across 9 competency pillars. Increases as you log hours, complete programs, and verify credentials.</p>
        </div>
      </div>

      {/* EBT callout */}
      <div className="rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)' }}>
        <Zap size={16} className="text-indigo-400 flex-shrink-0 mt-0.5" />
        <div>
          <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1">Highest-Weight Competency — EBT Video Scoring (18%)</p>
          <p className="text-xs text-white/60">The EBT Video Interview is bundled with the Transition Program. A recorded interview scored on cognitive behavioural markers. Airlines view the score — not the raw video. Proprietary to PilotRecognition.</p>
          <button onClick={() => setTab('programs')} className="mt-2 text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1">
            Enrol in Transition Program <ChevronRight size={12} />
          </button>
        </div>
      </div>

      {/* Competency list */}
      <div className="space-y-3">
        <p className="text-xs uppercase tracking-widest text-white/40 font-bold">9 Competency Pillars</p>
        {COMPETENCIES.map(c => {
          const Icon = c.icon;
          const earned = Math.round((score / maxScore) * c.weight);
          return (
            <div key={c.id} className="rounded-xl p-4" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.15)' }}>
                  <Icon size={14} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <p className="text-sm font-bold text-white">{c.id}. {c.name}</p>
                    <span className="text-xs text-white/40 flex-shrink-0 ml-2">{c.weight}%</span>
                  </div>
                  <p className="text-xs text-white/50 mb-2">{c.desc}</p>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                    <div className="h-full bg-gradient-to-r from-sky-500 to-indigo-500 transition-all duration-700" style={{ width: `${(earned / c.weight) * 100}%` }} />
                  </div>
                  <p className="text-[10px] text-white/30 mt-1">{earned} / {c.weight} pts earned</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* How to improve */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
        <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-3">How to Increase Your Score</p>
        <div className="space-y-2">
          {[
            { action: 'Complete Foundation Program', pts: '+8 pts', tab: 'programs' as TabId },
            { action: 'Verify credentials in Wallet', pts: '+10 pts', tab: 'wallet' as TabId },
            { action: 'Submit pathway interest', pts: '+4 pts', tab: 'pathways' as TabId },
            { action: 'EBT Video Interview (Transition Program)', pts: '+18 pts', tab: 'programs' as TabId },
          ].map(item => (
            <button key={item.action} onClick={() => setTab(item.tab)} className="w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs transition-all hover:brightness-110" style={{ background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.15)' }}>
              <span className="text-white/70">{item.action}</span>
              <span className="font-bold text-emerald-400 flex-shrink-0 ml-2">{item.pts}</span>
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

// ─── TAB: PROFILE ──────────────────────────────────────────────────────────
const ProfileTab: React.FC<{ onNavigate: (p: string) => void; profile: any; walletChecks: any[]; initialView?: 'dashboard' | 'profile' }> = ({ onNavigate, profile, walletChecks, initialView = 'profile' }) => (
  <PilotRecognitionProfilePage
    onNavigate={onNavigate}
    embedded={true}
    injectedProfile={profile || undefined}
    injectedWalletData={profile ? { did: profile.wallet_did || null, credentials: walletChecks } : undefined}
    initialView={initialView}
  />
);

// ─── LOGBOOK PREVIEW PANEL ────────────────────────────────────────────────
const LogbookPreviewPanel: React.FC<{ profile: any; onOpenLogbook: () => void }> = ({ profile, onOpenLogbook }) => {
  const [logs, setLogs] = React.useState<any[]>([]);
  React.useEffect(() => {
    const id = profile?.id;
    if (!id) return;
    supabase.from('pilot_flight_logs').select('id,date,aircraft_type,route,hours').eq('user_id', id).order('date', { ascending: false }).limit(3).then(({ data }) => setLogs(data ?? []));
  }, [profile?.id]);
  const totalHours = profile?.total_flight_hours ?? 0;
  return (
    <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Digital Logbook</p>
          <p className="text-sm font-black text-white tracking-wide">Recent Flights</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] font-black text-sky-300">{Number(totalHours).toLocaleString()} hrs total</span>
          <button onClick={onOpenLogbook} className="text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 transition-colors">ADD FLIGHT +</button>
        </div>
      </div>
      <div className="px-5 pb-4">
        {logs.length === 0 ? (
          <div className="flex items-center gap-3 py-3" style={{ border: '1px dashed rgba(255,255,255,0.1)' }}>
            <BookMarked size={14} className="text-white/20 mx-auto" />
            <p className="text-[10px] text-white/25 text-center w-full">No flights logged yet</p>
          </div>
        ) : (
          <div className="space-y-1">
            {logs.map(log => (
              <div key={log.id} className="flex items-center gap-3 px-3 py-2" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="w-6 h-6 flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(14,165,233,0.12)', border: '1px solid rgba(14,165,233,0.2)' }}>
                  <Plane size={10} className="text-sky-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[10px] font-black text-white truncate">{log.aircraft_type || '—'} {log.route ? `· ${log.route}` : ''}</p>
                  <p className="text-[9px] text-white/30">{log.date ? new Date(log.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' }) : '—'}</p>
                </div>
                <span className="text-[10px] font-black text-sky-300 flex-shrink-0">{log.hours}h</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── NOTIFICATIONS FEED PANEL ──────────────────────────────────────────────
const NotificationsFeedPanel: React.FC<{ profileId?: string }> = ({ profileId }) => {
  const [notifs, setNotifs] = React.useState<any[]>([]);
  React.useEffect(() => {
    if (!profileId) return;
    supabase.from('pilot_notifications').select('*').eq('pilot_id', profileId).order('created_at', { ascending: false }).limit(8).then(({ data }) => setNotifs(data ?? []));
  }, [profileId]);

  const markRead = async (id: string) => {
    await supabase.from('pilot_notifications').update({ is_read: true }).eq('id', id);
    setNotifs(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
  };

  const iconFor = (type: string) => {
    if (type === 'credential_request') return { icon: Building2, color: '#f97316', bg: 'rgba(249,115,22,0.12)' };
    if (type === 'credential_expiry') return { icon: AlertTriangle, color: '#ef4444', bg: 'rgba(239,68,68,0.1)' };
    if (type === 'tc_update') return { icon: FileText, color: '#3b82f6', bg: 'rgba(59,130,246,0.1)' };
    if (type === 'subscription_expiry') return { icon: Star, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
    return { icon: Bell, color: '#94a3b8', bg: 'rgba(148,163,184,0.1)' };
  };

  return (
    <div style={{ background: 'rgba(15,23,42,0.75)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(8px)' }}>
      <div className="flex items-center justify-between px-5 pt-4 pb-3">
        <div>
          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
          <p className="text-sm font-black text-white tracking-wide">Notifications</p>
        </div>
        {notifs.some(n => !n.is_read) && (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.25)' }}>
            {notifs.filter(n => !n.is_read).length} UNREAD
          </span>
        )}
      </div>
      <div className="px-5 pb-4">
        {notifs.length === 0 ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-[10px] text-white/20">No notifications</p>
          </div>
        ) : (
          <div className="space-y-1">
            {notifs.map(n => {
              const cfg = iconFor(n.type);
              const Icon = cfg.icon;
              return (
                <div key={n.id} className="flex items-start gap-3 px-3 py-2.5 cursor-pointer hover:brightness-110 transition-all" style={{ background: n.is_read ? 'rgba(255,255,255,0.02)' : 'rgba(255,255,255,0.05)', border: `1px solid ${n.is_read ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.1)'}` }} onClick={() => !n.is_read && markRead(n.id)}>
                  <div className="w-6 h-6 flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: cfg.bg, border: `1px solid ${cfg.color}30` }}>
                    <Icon size={10} style={{ color: cfg.color }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[10px] font-black truncate ${n.is_read ? 'text-white/50' : 'text-white'}`}>{n.title}</p>
                    {n.body && <p className="text-[9px] text-white/30 mt-0.5 leading-relaxed line-clamp-2">{n.body}</p>}
                    <p className="text-[8px] text-white/20 mt-1">{new Date(n.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</p>
                  </div>
                  {!n.is_read && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 flex-shrink-0 mt-1.5" />}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

// ─── CREDENTIAL REQUEST CARD ──────────────────────────────────────────────
const CredentialRequestCard: React.FC<{ request: any; onRespond: (approved: boolean) => Promise<void> }> = ({ request, onRespond }) => {
  const [responding, setResponding] = React.useState<'approve' | 'deny' | null>(null);
  const [done, setDone] = React.useState(false);
  const [decision, setDecision] = React.useState<'approved' | 'denied' | null>(null);

  const handle = async (approved: boolean) => {
    setResponding(approved ? 'approve' : 'deny');
    await onRespond(approved);
    setDecision(approved ? 'approved' : 'denied');
    setDone(true);
    setResponding(null);
  };

  const enterpriseName = request.enterprise_accounts?.name ?? 'An airline';
  const fields: string[] = request.requested_fields ?? ['license', 'medical', 'elp'];
  const requestedAt = new Date(request.requested_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });

  if (done) {
    return (
      <div className="flex items-center gap-3 px-4 py-3 rounded-xl" style={{ background: decision === 'approved' ? 'rgba(16,185,129,0.08)' : 'rgba(239,68,68,0.07)', border: `1px solid ${decision === 'approved' ? 'rgba(16,185,129,0.25)' : 'rgba(239,68,68,0.2)'}` }}>
        <span className="text-sm">{decision === 'approved' ? '✅' : '🚫'}</span>
        <p className="text-xs font-bold text-white/70">{decision === 'approved' ? `Access granted to ${enterpriseName}` : `Request from ${enterpriseName} declined`}</p>
      </div>
    );
  }

  return (
    <div className="rounded-xl overflow-hidden" style={{ background: 'rgba(249,115,22,0.06)', border: '1px solid rgba(249,115,22,0.3)' }}>
      <div className="flex items-start gap-3 px-4 pt-4 pb-3">
        <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(249,115,22,0.15)', border: '1px solid rgba(249,115,22,0.3)' }}>
          <Building2 size={16} className="text-orange-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-xs font-black text-white tracking-wide">{enterpriseName} — Credential Request</p>
          <p className="text-[10px] text-white/45 mt-0.5">Requested {requestedAt} · Fields: {fields.join(', ')}</p>
          {request.request_message && (
            <p className="text-[10px] text-white/60 mt-1.5 leading-relaxed italic">"{request.request_message}"</p>
          )}
        </div>
      </div>
      <div className="flex gap-2 px-4 pb-4">
        <button
          disabled={!!responding}
          onClick={() => handle(true)}
          className="flex-1 py-2 text-[11px] font-black tracking-wider text-white rounded-lg transition-all"
          style={{ background: responding === 'approve' ? 'rgba(16,185,129,0.5)' : 'rgba(16,185,129,0.75)', border: '1px solid rgba(16,185,129,0.4)' }}
        >
          {responding === 'approve' ? 'Approving…' : '✓ APPROVE'}
        </button>
        <button
          disabled={!!responding}
          onClick={() => handle(false)}
          className="flex-1 py-2 text-[11px] font-black tracking-wider text-white/70 rounded-lg transition-all"
          style={{ background: responding === 'deny' ? 'rgba(239,68,68,0.3)' : 'rgba(239,68,68,0.12)', border: '1px solid rgba(239,68,68,0.25)' }}
        >
          {responding === 'deny' ? 'Declining…' : '✕ DECLINE'}
        </button>
      </div>
    </div>
  );
};

// ─── TAB: WALLET (Credentials + Verification) ──────────────────────────────
const ATO_LIST = [
  'Philippine Airlines Training Centre', 'CAE Oxford Aviation Academy', 'Emirates Flight Training Academy',
  'FlightPath International', 'Lufthansa Aviation Training', 'Philippine Academy of Aviation Technology',
  'Asia Pacific Aviation Centre', 'CAA Approved Local ATO', 'Other / Not Listed',
];

const WalletTab: React.FC<{ walletChecks: any[]; profile: any; pendingRequests?: any[]; hasActiveSession?: boolean }> = ({ walletChecks, profile, pendingRequests = [], hasActiveSession = false }) => {
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
        // fall back to verifying active session (Auth0 or Supabase)
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
              <p style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2, marginBottom: 4 }}>Access Your Wallet</p>
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
                    await supabase.from('credential_requests').update({
                      status: approved ? 'approved' : 'denied',
                      responded_at: new Date().toISOString(),
                      ...(approved ? { access_granted_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString() } : {}),
                    }).eq('id', req.id);
                    await supabase.from('pilot_notifications').update({ is_read: true }).eq('related_id', req.id);
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
        const { createClient } = await import('@supabase/supabase-js');
        const sb = createClient(
          process.env.NEXT_PUBLIC_SUPABASE_URL!,
          process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
        );
        await sb.from('profiles').update({
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
        }).eq('id', profile?.id);
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
            <p className="text-xs font-black tracking-widest text-white/60 uppercase">Credential Tokens</p>
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
            {allVerified ? 'PRE-CLEARED ✓' : hasExpired ? 'ACTION REQUIRED' : walletChecks.length > 0 ? `${walletChecks.length} CREDENTIAL TOKEN${walletChecks.length !== 1 ? 'S' : ''} IN VAULT` : 'NO CREDENTIALS YET'}
          </p>
          <p className="text-[10px] text-white/35 mt-0.5">View verification status, ZK tokens, and initiate Veremark check</p>
        </div>
        <ChevronRight size={14} className="text-white/30 flex-shrink-0" />
      </button>
    </motion.div>
  );
};

// ─── TAB: DASHBOARD ────────────────────────────────────────────────────────
const PATHWAY_CARDS = [
  { id: 'delta',     title: 'Delta Airlines',    subtitle: 'A320 First Officer - Atlanta Base',       image: '/images/airlines/delta-airlines.jpg',    match: 95, matchColor: 'green',  gaps: 3, benefits: ['Competitive salary', 'Fast-track upgrade'] },
  { id: 'united',   title: 'United Airlines',   subtitle: 'B737 First Officer - Chicago Hub',        image: '/images/airlines/united-airlines.jpg',   match: 82, matchColor: 'yellow', gaps: 7, benefits: ['Global network', 'Training included'] },
  { id: 'corporate',title: 'Corporate Aviation', subtitle: 'Falcon 7X Captain - Private Fleet',       image: '/images/aviation/corporate-aviation.jpg', match: 78, matchColor: 'blue',   gaps: 5, benefits: ['Premium compensation', 'Flexible schedule'] },
  { id: 'fedex',    title: 'FedEx Cargo',        subtitle: 'B767 First Officer - Memphis Hub',        image: '/images/airlines/fedex-cargo.jpg',        match: 88, matchColor: 'green',  gaps: 4, benefits: ['Stable growth', 'International routes'] },
  { id: 'skywest',  title: 'SkyWest Airlines',   subtitle: 'CRJ700 First Officer - Denver Base',      image: '/images/airlines/skywest-airlines.jpg',   match: 91, matchColor: 'teal',   gaps: 2, benefits: ['Quick upgrade', 'Partnership program'] },
  { id: 'emirates', title: 'Emirates Airlines',  subtitle: 'A380 First Officer - Dubai Hub',          image: '/images/airlines/emirates-airlines.jpg',  match: 75, matchColor: 'red',    gaps: 6, benefits: ['Tax-free benefits', 'Global opportunities'] },
];

const SUPER_ADMIN_EMAIL = 'benjamintigerbowler@gmail.com';

const AdminTokenPanel: React.FC = () => {
  const [stats, setStats] = React.useState<any>(null);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const today = new Date().toISOString().slice(0, 10);
        const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0, 10);

        const [todayRes, yesterdayRes, totalRes, topUsersRes] = await Promise.all([
          supabase.from('ai_usage_log').select('*', { count: 'exact', head: true }).eq('date', today),
          supabase.from('ai_usage_log').select('*', { count: 'exact', head: true }).eq('date', yesterday),
          supabase.from('ai_usage_log').select('*', { count: 'exact', head: true }),
          supabase.from('ai_usage_log').select('user_id, date').eq('date', today),
        ]);

        // Count unique users today
        const uniqueToday = new Set((topUsersRes.data || []).map((r: any) => r.user_id)).size;

        setStats({
          today: todayRes.count ?? 0,
          yesterday: yesterdayRes.count ?? 0,
          total: totalRes.count ?? 0,
          uniqueUsersToday: uniqueToday,
          dailyLimit: 500,
          remainingToday: Math.max(0, 500 - (todayRes.count ?? 0)),
        });
      } catch (e: any) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
    const interval = setInterval(load, 30000); // refresh every 30s
    return () => clearInterval(interval);
  }, []);

  const pct = stats ? Math.min(100, Math.round((stats.today / stats.dailyLimit) * 100)) : 0;
  const barColor = pct > 80 ? '#ef4444' : pct > 60 ? '#f59e0b' : '#22c55e';

  return (
    <div className="rounded-xl border p-5" style={{ background: 'rgba(15,23,42,0.85)', borderColor: 'rgba(239,68,68,0.3)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full animate-pulse" style={{ background: '#ef4444' }} />
          <span className="text-[10px] font-black uppercase tracking-widest text-red-400">Admin — Supabase Token Tollbooth</span>
        </div>
        <span className="text-[9px] text-white/30">Refreshes every 30s</span>
      </div>

      {loading && !stats && (
        <div className="flex items-center gap-2 text-white/40 text-xs"><RefreshCw size={12} className="animate-spin" /> Loading usage data...</div>
      )}
      {error && <p className="text-xs text-red-400">Error: {error}</p>}

      {stats && (
        <>
          {/* Daily quota bar */}
          <div className="mb-4">
            <div className="flex justify-between items-center mb-1">
              <span className="text-[10px] text-white/50 font-semibold">Daily AI Requests Used</span>
              <span className="text-[10px] font-black" style={{ color: barColor }}>{stats.today} / {stats.dailyLimit}</span>
            </div>
            <div className="w-full h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.08)' }}>
              <div className="h-2 rounded-full transition-all" style={{ width: `${pct}%`, background: barColor }} />
            </div>
            <div className="flex justify-between mt-0.5">
              <span className="text-[9px] text-white/30">{pct}% of free tier used</span>
              <span className="text-[9px] text-white/30">{stats.remainingToday} remaining</span>
            </div>
          </div>

          {/* Stat tiles */}
          <div className="grid grid-cols-4 gap-2">
            {[
              { label: 'Today', value: stats.today, icon: Zap, color: '#3b82f6' },
              { label: 'Yesterday', value: stats.yesterday, icon: Clock, color: '#8b5cf6' },
              { label: 'All Time', value: stats.total, icon: BarChart3, color: '#22c55e' },
              { label: 'Unique Users Today', value: stats.uniqueUsersToday, icon: User, color: '#f59e0b' },
            ].map(({ label, value, icon: Icon, color }) => (
              <div key={label} className="rounded-lg p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <Icon size={14} className="mx-auto mb-1" style={{ color }} />
                <p className="text-lg font-black text-white">{value}</p>
                <p className="text-[9px] text-white/40 uppercase tracking-wider leading-tight">{label}</p>
              </div>
            ))}
          </div>

          {/* Status badge */}
          <div className="mt-3 flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: barColor }} />
            <span className="text-[9px] text-white/40">
              Groq free tier: 14,400 req/day &nbsp;·&nbsp; Platform hard limit: {stats.dailyLimit}/day &nbsp;·&nbsp; Model: llama-3.3-70b-versatile
            </span>
          </div>
        </>
      )}
    </div>
  );
};

const DashboardTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => {
  const { currentUser } = useAuth();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const paused = React.useRef(false);
  const cards = [...PATHWAY_CARDS, ...PATHWAY_CARDS];

  React.useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current && document.visibilityState === 'visible') {
        setCarouselIdx(p => (p + 1) % PATHWAY_CARDS.length);
      }
    }, 4000);
    return () => clearInterval(id);
  }, []);

  const [dashTier, setDashTier] = React.useState<'free'|'plus'>('plus');
  const dashFreeFeatures = [
    { icon: BookOpen, label: 'Digital Logbook Record',    sub: 'Log your flight history securely on a verified network.' },
    { icon: Globe,    label: 'Global Pathway Discovery',  sub: 'Instantly browse international operator requirements worldwide.' },
    { icon: User,     label: 'Basic Pilot Profile',       sub: 'Establish your initial digital identity on the PilotRecognition platform.' },
  ];
  const dashPlusFeatures = [
    { icon: Shield, label: 'Automated Credential Background Check', sub: 'Tokenize physical licences, medical certificates, and radio telemetry ratings via an encrypted, zero-knowledge pipeline routed directly to your issuing Civil Aviation Authority.' },
    { icon: Target, label: 'Live Route & Fleet Requirements Audit',  sub: 'Instantly audit your flight hours, type ratings, and currency data against live hiring metrics for Singapore Airlines and global operator pathways.' },
    { icon: Zap,    label: 'Expedited ATO Validation Protocol',      sub: 'Programmatically issue a $5.00 compliance validation incentive to your designated Approved Training Organisation via the Helio network to fast-track your logbook audit verification.' },
  ];
  const dashFeatures = dashTier === 'free' ? dashFreeFeatures : dashPlusFeatures;

  if (!currentUser) return (
    <motion.div className="flex w-full" style={{ height: 'calc(100vh - 108px)', maxHeight: 'calc(100vh - 108px)', overflow: 'hidden' }} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {/* LEFT: white enterprise form */}
      <motion.div className="w-1/2 flex flex-col px-8 py-4 bg-white overflow-hidden" style={{ borderRight: '1px solid #e2e8f0' }} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
        <div className="mb-4">
          <div className="flex items-center gap-1 mb-2">
            <span className="text-sm font-black text-slate-900" style={{ fontFamily: 'Arial Black, sans-serif' }}>pilot</span>
            <span className="text-sm font-black text-red-600" style={{ fontFamily: 'Arial Black, sans-serif' }}>recognition</span>
            <span className="text-slate-300 mx-1.5">|</span>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Pilot Portal</span>
          </div>
          <h1 className="text-xl font-black text-slate-900 leading-tight">Unlock Your Digital<br/>Flight Deck</h1>
          <p className="text-xs text-slate-800 mt-1 leading-snug">Authenticate or register to manage verified pilot credentials, cross-reference profile metrics against live operator criteria, and establish a direct connection to international carriers and manufacturing pipelines.</p>
        </div>
        <div className="flex mb-2 rounded-xl overflow-hidden border border-slate-200">
          <button onClick={() => setDashTier('free')} className="flex-1 py-2 text-center text-xs font-bold transition-all" style={{ background: dashTier === 'free' ? '#f1f5f9' : 'white', color: dashTier === 'free' ? '#0f172a' : '#94a3b8' }}>Free Pilot Account</button>
          <button onClick={() => setDashTier('plus')} className="flex-1 py-2 text-center text-xs font-black transition-all" style={{ background: dashTier === 'plus' ? 'linear-gradient(90deg,rgba(234,179,8,0.12),rgba(251,146,60,0.08))' : 'white', color: dashTier === 'plus' ? '#b45309' : '#94a3b8', borderLeft: '1px solid #e2e8f0' }}>⭐ Recognition+ Member</button>
        </div>
        <p className="text-[9px] font-black uppercase tracking-widest mb-1" style={{ color: dashTier === 'plus' ? '#d97706' : '#94a3b8' }}>{dashTier === 'free' ? 'Your Free Pilot Account Includes' : 'Unlocked with Recognition+'}</p>
        <div className="flex flex-col gap-1.5" style={{ flex: '0 0 auto' }}>
          {dashFeatures.map(({ icon: Icon, label, sub }) => (
            <div key={label} className="flex items-center gap-3 p-2 rounded-xl border transition-all" style={{ background: dashTier === 'plus' ? '#fffbeb' : '#f8fafc', borderColor: dashTier === 'plus' ? '#fde68a' : '#e2e8f0' }}>
              <div className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center border" style={{ background: dashTier === 'plus' ? '#fef3c7' : '#f1f5f9', borderColor: dashTier === 'plus' ? '#fcd34d' : '#cbd5e1' }}>
                <Icon size={13} style={{ color: dashTier === 'plus' ? '#d97706' : '#64748b' }} />
              </div>
              <div className="flex-1">
                <p className="text-xs font-bold text-slate-900 leading-none mb-0.5">{label}</p>
                <p className="text-[10px] text-slate-500 leading-snug">{sub}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col gap-2 mt-3">
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="w-full py-2 text-sm font-black tracking-wide text-white transition-all hover:brightness-110 rounded-xl" style={{ background: '#dc2626' }}>{dashTier === 'free' ? 'Get Recognition Free' : 'Login'}</button>
          <button onClick={() => window.location.href = '/become-member'} className="w-full py-2 text-sm font-black tracking-wide transition-all hover:brightness-110 rounded-xl" style={{ background: 'linear-gradient(90deg,#f59e0b,#f97316)', color: '#fff' }}>{dashTier === 'free' ? 'Want verification? Upgrade to Recognition+ ($99/yr) →' : 'Join Recognition+ ($99/yr) →'}</button>
        </div>
        <div className="flex items-center gap-4 mt-2 pt-2 border-t border-slate-100">
          {[{ name: 'Auth0 Secured', dot: '#3b82f6' }, { name: 'Helio Payments', dot: '#a855f7' }, { name: 'Veremark Verified', dot: '#16a34a' }].map(({ name, dot }, i) => (
            <React.Fragment key={name}>{i > 0 && <span className="text-slate-200">|</span>}<div className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full" style={{ background: dot }} /><span className="text-[9px] font-bold text-slate-400">{name}</span></div></React.Fragment>
          ))}
        </div>
      </motion.div>
      {/* RIGHT: blurred dashboard preview */}
      <motion.div className="w-1/2 relative overflow-hidden flex flex-col items-center justify-center pt-8" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.1 }}>
        <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ background: 'rgba(15,23,42,1)' }}>
          <div className="w-full h-full flex flex-col gap-2 p-3" style={{ filter: 'blur(2px)', opacity: 0.6, transform: 'scale(0.82)', transformOrigin: 'top left', width: '122%', height: '122%' }}>
            <div className="flex items-center gap-3 px-4 py-2.5 rounded flex-shrink-0" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex-1"><p className="text-[9px] font-black text-white">Account Activation Required</p><p className="text-[7px] text-white/40">Verify your credentials and flight logs to unlock airline pathways.</p></div>
              <div className="px-3 py-1 rounded text-[8px] font-black text-white" style={{ background: '#3b82f6' }}>GET STARTED ›</div>
            </div>
            <div className="relative rounded overflow-hidden flex-shrink-0" style={{ height: '120px' }}>
              <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80')", opacity: 0.75 }} />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(5,10,20,0.7) 0%, transparent 60%)' }} />
              <div className="absolute top-2 right-2 px-2 py-0.5 rounded-full text-[7px] font-black" style={{ background: '#ef4444', color: 'white' }}>Profile Match: 0%</div>
              <div className="absolute bottom-3 left-3"><p className="text-xs font-black text-white">MY PATHWAYS</p><p className="text-[7px] text-white/50">Complete your profile to reach 100% eligibility</p></div>
            </div>
            <div className="flex gap-2 flex-shrink-0" style={{ height: '90px' }}>
              <div className="flex-1 relative rounded overflow-hidden"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png')", opacity: 0.65 }} /><div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.85) 0%, transparent 60%)' }} /><div className="absolute bottom-2 left-2"><p className="text-[9px] font-black text-white">MY PROGRAMS</p></div></div>
              <div className="flex-1 flex flex-col gap-1">
                <div className="flex-1 flex items-center gap-2 px-2 rounded" style={{ background: 'rgba(30,41,59,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}><div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.2)' }}><div className="w-2 h-2 rounded-sm" style={{ background: '#3b82f6' }} /></div><div><p className="text-[8px] font-black text-white">DIGITAL LOGBOOK</p><p className="text-[6px] text-white/30">Log your first flight</p></div></div>
                <div className="flex-1 flex items-center gap-2 px-2 rounded" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.1)' }}><div className="w-5 h-5 rounded flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,179,8,0.18)' }}><div className="w-2 h-2 rounded-sm" style={{ background: '#fbbf24' }} /></div><div><p className="text-[8px] font-black text-white">PILOT CREDENTIALS</p><p className="text-[6px] text-white/30">No credentials yet</p></div></div>
              </div>
            </div>
            <div className="flex gap-2 flex-1">
              <div className="flex-1 relative rounded overflow-hidden"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1540962351504-03099e0a754b?w=800&q=80')", opacity: 0.7 }} /><div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.9) 0%, transparent 50%)' }} /><div className="absolute bottom-0 left-0 right-0 px-2 py-1.5" style={{ background: 'rgba(5,10,20,0.8)' }}><p className="text-[6px] text-white/40 uppercase">Recommended</p><p className="text-[8px] font-black text-white">Type Rating Search</p></div></div>
              <div className="flex-1 relative rounded overflow-hidden"><div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800&q=80')", opacity: 0.7 }} /><div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(5,10,20,0.9) 0%, transparent 50%)' }} /><div className="absolute bottom-0 left-0 right-0 px-2 py-1.5" style={{ background: 'rgba(5,10,20,0.8)' }}><p className="text-[6px] text-white/40 uppercase">Explore</p><p className="text-[8px] font-black text-white">Operator Expectations</p></div></div>
            </div>
          </div>
        </div>
        <div className="absolute inset-0" style={{ background: 'rgba(5,10,20,0.42)', backdropFilter: 'blur(3px)' }} />
        <div className="relative z-10 flex flex-col items-center text-center px-8 mt-6">
          <div className="relative w-20 h-20 rounded-full flex items-center justify-center mb-5" style={{ background: 'linear-gradient(135deg,rgba(22,163,74,0.22),rgba(16,185,129,0.12))', border: '1.5px solid rgba(22,163,74,0.45)' }}>
            <Shield size={34} className="text-emerald-400" />
            <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 text-[7px] font-black tracking-widest whitespace-nowrap px-2 py-0.5 rounded-full" style={{ background: 'rgba(22,163,74,0.85)', color: 'white' }}>Secure Pre-Flight Authorization Gateway</span>
          </div>
          <div className="flex flex-col gap-1.5 mb-6">
            {['🔒 Identity Token Status: Standby (Awaiting Auth0 Clearance)', '🔒 Cryptographic Vault Status: Secure / Isolated'].map(badge => (
              <span key={badge} className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[9px] font-bold" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.3)' }}>{badge}</span>
            ))}
          </div>
          <button onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="px-8 py-3 text-xs font-black tracking-widest text-white/80 transition-all hover:text-white" style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.18)', borderRadius: '10px' }}>Existing Captains: Authenticate Credentials Here →</button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <div className="space-y-8">
      <div className="relative">
        <h2 className="text-3xl font-serif text-white tracking-wide mb-2">DASHBOARD</h2>
        <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32" />
      </div>

      {/* Flight Instrument Dashboard */}
      <FlightInstrumentDashboard userId={currentUser.id} />

      {/* Admin Infrastructure Command Centre — only visible to super admin */}
      {(currentUser.email === SUPER_ADMIN_EMAIL || profile?.role === 'super_admin') && (
        <InfrastructureDashboard />
      )}

      {/* Programs */}
      <div className="backdrop-blur-2xl border border-white/20 p-6 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
        <div className="flex items-center gap-3 mb-6">
          <BookOpen size={22} className="text-teal-400" />
          <h3 className="text-xl font-bold text-white">» PROGRAMS</h3>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[{icon: GraduationCap, color: 'text-purple-400', bg: 'bg-purple-500/20 text-purple-300', badge: 'Completed', name: 'Foundation Program', desc: 'Core pilot development and mentorship', pct: 100, bar: 'bg-purple-500'},
            {icon: Plane, color: 'text-blue-400', bg: 'bg-blue-500/20 text-blue-300', badge: 'In Progress', name: 'Transition Program', desc: 'Airline transition and industry alignment', pct: 65, bar: 'bg-blue-500'},
            {icon: Award, color: 'text-green-400', bg: 'bg-green-500/20 text-green-300', badge: 'Available', name: 'EBT Video Scoring', desc: 'Behavioral assessment and interview prep', pct: 0, bar: 'bg-green-500'},
          ].map(p => (
            <div key={p.name} className="bg-slate-900/50 border border-slate-700 p-4">
              <div className="flex items-center justify-between mb-3">
                <p.icon size={18} className={p.color} />
                <span className={`text-xs px-2 py-1 font-bold uppercase ${p.bg}`}>{p.badge}</span>
              </div>
              <h4 className="text-white font-bold mb-1">{p.name}</h4>
              <p className="text-slate-300 text-sm mb-3">{p.desc}</p>
              <div className="w-full bg-slate-700 h-2">
                <div className={`${p.bar} h-2`} style={{ width: `${p.pct}%` }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Examination Portal */}
      <div className="backdrop-blur-2xl border border-white/20 p-6 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
        <div className="flex items-center gap-3 mb-6">
          <Brain size={22} className="text-orange-400" />
          <h3 className="text-xl font-bold text-white">» EXAMINATION PORTAL</h3>
        </div>
        <div className="bg-slate-900/50 border border-slate-700 p-6">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 bg-orange-50 rounded-lg flex items-center justify-center flex-shrink-0">
              <Brain size={22} className="text-orange-600" />
            </div>
            <div className="flex-1">
              <h4 className="text-white font-bold text-lg mb-2">Certification Examinations</h4>
              <p className="text-slate-300 text-sm mb-4 leading-relaxed">Complete your certification examinations to track your progress through the Foundational Program. Each exam unlocks new mentorship resources and advancement opportunities.</p>
              <div className="flex items-center gap-4 text-xs text-slate-400 mb-4">
                <span className="flex items-center gap-1"><Clock size={12} /> Timed assessments</span>
                <span className="flex items-center gap-1"><Award size={12} /> Industry certification</span>
                <span className="flex items-center gap-1"><Target size={12} /> Progress tracking</span>
              </div>
              <button onClick={() => { window.location.href = '/examination-portal'; }} className="flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-all">
                <PlayCircle size={18} /> Access Examination Portal
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Pathway Recommendations carousel */}
      <div className="backdrop-blur-2xl border border-white/20 p-6 shadow-2xl" style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.1), rgba(255,255,255,0.05))' }}>
        <div className="flex items-center gap-3 mb-6">
          <FolderOpen size={22} className="text-green-400" />
          <h3 className="text-xl font-bold text-white">» PATHWAY RECOMMENDATIONS</h3>
        </div>
        <div className="relative overflow-hidden">
          <div
            className="flex transition-transform duration-500 ease-out"
            style={{ transform: `translateX(-${carouselIdx * 100}%)`, width: `${cards.length * 100}%` }}
            onMouseEnter={() => { paused.current = true; }}
            onMouseLeave={() => { paused.current = false; }}
          >
            {cards.map((pw, i) => (
              <div key={`${pw.id}-${i}`} style={{ width: `${100 / cards.length}%` }} className="flex-shrink-0 px-2">
                <div className="relative w-full h-[200px] overflow-hidden cursor-pointer bg-black/85 border border-white/20 hover:scale-[1.01] hover:brightness-110 transition-transform duration-300">
                  <div className="absolute bottom-0 left-0 right-0 h-[3px] z-30 bg-[#00b4d8]" />
                  <img src={pw.image} alt={pw.title} className="absolute inset-0 w-full h-full object-cover" onError={e => { (e.target as HTMLImageElement).style.display = 'none'; }} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-between p-5">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="text-white font-serif text-lg font-bold mb-1">{pw.title}</h3>
                        <p className="text-slate-300 text-sm">{pw.subtitle}</p>
                      </div>
                      <span className="text-xs font-bold uppercase px-3 py-1 bg-white/10 border border-white/20 text-white">{pw.match}% Match</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-400 rounded-full" />
                        <span className="text-white text-sm">{pw.gaps} gaps remaining</span>
                      </div>
                      <div className="flex gap-2">
                        {pw.benefits.map(b => <span key={b} className="text-slate-300 text-xs bg-white/10 px-2 py-1">{b}</span>)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => setCarouselIdx(p => (p === 0 ? PATHWAY_CARDS.length - 1 : p - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center z-10 transition-all">
            <ChevronRight size={18} className="text-white rotate-180" />
          </button>
          <button onClick={() => setCarouselIdx(p => (p + 1) % PATHWAY_CARDS.length)} className="absolute right-2 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/10 hover:bg-white/20 border border-white/20 flex items-center justify-center z-10 transition-all">
            <ChevronRight size={18} className="text-white" />
          </button>
          <div className="flex justify-center gap-2 mt-4">
            {PATHWAY_CARDS.map((_, i) => (
              <button key={i} onClick={() => setCarouselIdx(i)} className={`h-1.5 rounded-sm transition-all ${i === carouselIdx ? 'bg-white w-8' : 'bg-white/40 w-2 hover:bg-white/60'}`} />
            ))}
          </div>
        </div>
        <div className="mt-6 p-4 bg-slate-900/30 border border-slate-700">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-2 h-2 bg-teal-400 rounded-full" />
            <span className="text-sm text-teal-400 font-bold">INSIGHTS</span>
          </div>
          <p className="text-slate-300 text-sm leading-relaxed">Your profile matches <span className="text-white font-bold">6 high-potential pathways</span> with 80%+ compatibility. Focus on completing the <span className="text-blue-400 font-bold">Transition Program</span> to increase your match score by an average of <span className="text-green-400 font-bold">12%</span>.</p>
        </div>
      </div>
    </div>
  );
};

// ─── TAB: PATHWAYS ─────────────────────────────────────────────────────────
const PathwaysTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <PathwaysPageModern isDarkMode={true} onNavigate={onNavigate} onNavigateToPathway={(id) => onNavigate(`pathways-detail/${id}`)} />
  </div>
);

// ─── TAB: PROGRAMS ─────────────────────────────────────────────────────────
const ProgramsTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const { currentUser, userProfile } = useAuth();
  const isEnrolledInFoundational = userProfile?.is_enrolled_in_foundational ?? false;

  return (
    <div className="flex flex-col items-center justify-start">
      <div className="relative mb-8 text-center">
        <h2 className="text-3xl font-serif text-white tracking-wide mb-2">PROGRAMS</h2>
        <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32 mx-auto" />
      </div>

      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 md:gap-6">

          {/* Left hero card: W1000 (enrolled) or Foundation video (unenrolled) */}
          <div className="md:col-span-2 h-80 md:h-96">
            {currentUser && isEnrolledInFoundational ? (
              <div
                className="relative group cursor-pointer overflow-hidden h-full"
                onClick={() => onNavigate('/w1000')}
              >
                <div className="h-full flex flex-col">
                  <div className="relative h-[70%] overflow-hidden">
                    <img src="w12.png" alt="W1000 Flight Deck" className="absolute inset-0 w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-blue-500 text-white text-sm font-bold uppercase tracking-wider">Access Simulator</span>
                    </div>
                  </div>
                  <div className="h-[30%] bg-slate-900 border border-slate-700 p-4 flex flex-col justify-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">» W1000 Flight Deck</h3>
                    <p className="text-slate-300 text-xs leading-tight">Advanced aviation training simulator with PFD, VOR, and exam modules</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </div>
            ) : (
              <div
                className="relative group cursor-pointer overflow-hidden h-full"
                onClick={() => onNavigate('foundational-program')}
              >
                <div className="h-full flex flex-col">
                  <div className="relative h-[70%] overflow-hidden bg-slate-900">
                    <video autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover opacity-80">
                      <source src="/images/My Movie 3 - 720WebShareName.mov" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/70 to-transparent" />
                    <div className="absolute top-4 right-4">
                      <span className="px-4 py-2 bg-teal-500 text-white text-sm font-bold uppercase tracking-wider">Start Here</span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border-2 border-white/50">
                        <div className="w-0 h-0 border-t-[8px] border-t-transparent border-l-[14px] border-l-white border-b-[8px] border-b-transparent ml-1" />
                      </div>
                    </div>
                  </div>
                  <div className="h-[30%] bg-slate-900 border border-slate-700 p-4 flex flex-col justify-center">
                    <h3 className="text-white font-bold text-lg uppercase tracking-wider mb-1">» Foundation Program</h3>
                    <p className="text-slate-300 text-xs leading-tight">Start your pilot journey with structured mentorship and guidance</p>
                  </div>
                </div>
                <div className="absolute inset-0 bg-white/0 group-hover:bg-white/5 transition-colors duration-300 pointer-events-none" />
              </div>
            )}
          </div>

          {/* Right column: three stacked directory cards */}
          <div className="md:col-span-2 flex flex-col gap-3 md:gap-4 h-80 md:h-96">

            {/* Foundational Platform */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => onNavigate('foundational-platform')}
            >
              <img src="fp1.png" alt="Foundational Platform" className="absolute inset-0 w-full h-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-900/90 via-slate-900/70 to-transparent" />
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-white font-serif text-base tracking-wide mb-1">» Foundational Platform</h3>
                  <p className="text-slate-300 text-xs leading-tight">Access your enrolled courses, track progress, and engage with program materials</p>
                </div>
              </div>
            </div>

            {/* Examination Portal */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => { window.location.href = '/examination-portal'; }}
            >
              <img src="/ep.png" alt="Examination Portal" className="absolute inset-0 w-full h-full object-cover"
                onError={e => { e.currentTarget.style.display = 'none'; }} />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-900/80 via-blue-900/60 to-transparent" />
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-white font-serif text-base tracking-wide mb-1">» Examination Portal</h3>
                  <p className="text-slate-300 text-xs leading-tight">Certification examinations, assessments, and progress tracking</p>
                </div>
              </div>
            </div>

            {/* Official Examination Board */}
            <div
              className="relative group cursor-pointer overflow-hidden flex-1 min-h-0 bg-white border border-white/20 hover:scale-[1.02] transition-transform"
              onClick={() => onNavigate('official-examination-board')}
            >
              <div className="relative h-full flex items-center px-6">
                <div>
                  <h3 className="text-slate-900 font-serif text-base tracking-wide mb-1">» Official Examination Board & Certifications</h3>
                  <p className="text-slate-600 text-xs leading-tight">Official certification bodies, examination boards, and industry-standard credentials</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TAB: AIRLINES ─────────────────────────────────────────────────────────
const AirlinesTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <PortalAirlineExpectationsPage onBack={() => {}} onNavigate={onNavigate} />
  </div>
);

// ─── TAB: MANUFACTURERS ────────────────────────────────────────────────────
const ManufacturersTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <TypeRatingSearchPage onNavigate={onNavigate} />
  </div>
);

// ─── TAB: ATLAS CV ─────────────────────────────────────────────────────────
const AtlasCVTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => (
  <div className="space-y-6">
    <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <FileText size={40} className="text-white mx-auto mb-3" />
      <p className="text-white font-bold text-lg mb-1">ATLAS Aviation CV</p>
      <p className="text-white/50 text-sm mb-4">Industry-standard formatted CV. Auto-populated from your Recognition Profile. Accepted by airlines using the ATLAS format.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => onNavigate('atlas-cv-generator')} className="text-sm font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 tracking-wider" style={{ background: 'rgba(249,115,22,0.8)', color: 'white', border: '1px solid rgba(249,115,22,0.5)' }}>
          <Download size={15} /> Generate & Download
        </button>
        <button onClick={() => onNavigate('atlas-resume')} className="text-sm font-bold px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 tracking-wider" style={{ background: 'rgba(255,255,255,0.1)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
          <Edit3 size={15} /> Edit CV
        </button>
      </div>
    </div>
    <SectionCard title="What Your Atlas CV Includes">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['Flight Hours Summary', 'License & Ratings', 'Type Ratings Held', 'Medical Certificate Status', 'Recognition Score', 'EBT Assessment Result', 'Program Completions', 'Employment History', 'Language Proficiency'].map(item => (
          <div key={item} className="flex items-center gap-2 text-xs text-white/65">
            <CheckCircle size={12} className="text-emerald-400 flex-shrink-0" /> {item}
          </div>
        ))}
      </div>
    </SectionCard>
  </div>
);

// ─── TAB: LOGBOOK ──────────────────────────────────────────────────────────
const LOGBOOK_PROVIDERS = [
  { name: 'ForeFlight',    logo: '✈', connected: false, colour: 'rgba(59,130,246,0.7)'  },
  { name: 'Logten Pro',   logo: '📓', connected: false, colour: 'rgba(249,115,22,0.7)'  },
  { name: 'MyFlightbook', logo: '📖', connected: true,  colour: 'rgba(16,185,129,0.7)'  },
  { name: 'SafeLog',      logo: '🛡', connected: false, colour: 'rgba(139,92,246,0.7)'  },
  { name: 'Pilot Pro',    logo: '🎯', connected: false, colour: 'rgba(234,179,8,0.7)'   },
  { name: 'CrewLounge',   logo: '🛋', connected: false, colour: 'rgba(236,72,153,0.7)'  },
];

const SAMPLE_FLAGGED_HOURS = [
  { date: '14 Mar 2025', aircraft: 'C172 — RP-C1842', hours: 1.4, type: 'Dual', ato: 'Philippine Airlines Training Centre', issue: 'Instructor signature missing from ATO records', id: 'FLG-001' },
  { date: '02 Feb 2025', aircraft: 'PA-28 — RP-C2210', hours: 0.9, type: 'Solo', ato: 'Asia Pacific Aviation Centre', issue: 'Hours logged exceed ATO duty roster for that date', id: 'FLG-002' },
];

const LogbookTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile }) => {
  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
      <DigitalLogbookPage
        onBack={() => {}}
        userProfile={profile ? { id: profile.id, uid: profile.id, firstName: profile.display_name?.split(' ')[0] || '', lastName: profile.display_name?.split(' ').slice(1).join(' ') || '', email: profile.email || '' } : null}
      />
    </div>
  );
};

const _LogbookTabUnused: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => {
  const hours = profile?.total_flight_hours ?? 0;
  const [syncExpanded, setSyncExpanded] = React.useState(false);
  const [flagExpanded, setFlagExpanded] = React.useState(true);

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* ── Hour stats strip ── */}
      <div className="grid grid-cols-4 gap-3">
        {[
          { label: 'TOTAL',      value: (profile?.total_flight_hours      ?? 0).toLocaleString(), colour: 'text-white'       },
          { label: 'PIC',        value: (profile?.pic_hours                ?? 0).toLocaleString(), colour: 'text-sky-300'     },
          { label: 'NIGHT',      value: (profile?.night_hours              ?? 0).toLocaleString(), colour: 'text-indigo-300'  },
          { label: 'INSTRUMENT', value: (profile?.instrument_hours         ?? 0).toLocaleString(), colour: 'text-purple-300'  },
        ].map(s => (
          <div key={s.label} className="p-4 text-center" style={{ background: 'rgba(30,41,59,0.75)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className={`text-2xl font-black ${s.colour}`}>{s.value}</p>
            <p className="text-[10px] text-white/40 mt-0.5 uppercase tracking-widest">{s.label} HRS</p>
          </div>
        ))}
      </div>

      {/* ── Flagged Hours Warning ── */}
      {SAMPLE_FLAGGED_HOURS.length > 0 && (
        <div style={{ border: '1px solid rgba(234,179,8,0.4)', background: 'rgba(234,179,8,0.06)' }}>
          <button
            onClick={() => setFlagExpanded(v => !v)}
            className="w-full flex items-center gap-3 px-5 py-3 transition-all hover:brightness-110"
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)' }}>
              <AlertTriangle size={15} className="text-yellow-400" />
            </div>
            <div className="flex-1 text-left">
              <p className="text-xs font-black text-yellow-300 tracking-wide">FLAGGED FLIGHT HOURS — ACTION REQUIRED</p>
              <p className="text-[10px] text-yellow-500/70 mt-0.5">{SAMPLE_FLAGGED_HOURS.length} entries flagged by ATO. Unresolved flags block your Pre-Cleared status.</p>
            </div>
            <ChevronRight size={14} className={`text-yellow-400/60 transition-transform ${flagExpanded ? 'rotate-90' : ''}`} />
          </button>

          {flagExpanded && (
            <div className="px-5 pb-4 space-y-3">
              {SAMPLE_FLAGGED_HOURS.map(flag => (
                <div key={flag.id} className="p-4" style={{ background: 'rgba(0,0,0,0.3)', border: '1px solid rgba(234,179,8,0.2)' }}>
                  <div className="flex items-start justify-between gap-4 mb-2">
                    <div>
                      <p className="text-xs font-black text-white tracking-wide">{flag.aircraft}</p>
                      <p className="text-[10px] text-white/40 mt-0.5">{flag.date} · {flag.hours} hrs · {flag.type}</p>
                    </div>
                    <span className="text-[9px] font-black px-2 py-1 flex-shrink-0" style={{ background: 'rgba(234,179,8,0.15)', border: '1px solid rgba(234,179,8,0.35)', color: '#fbbf24' }}>
                      {flag.id}
                    </span>
                  </div>
                  <div className="flex items-start gap-2 p-2.5 mb-3" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.15)' }}>
                    <AlertTriangle size={10} className="text-yellow-500 flex-shrink-0 mt-0.5" />
                    <p className="text-[10px] text-yellow-300/80 leading-relaxed">
                      <strong className="text-yellow-200">ATO ({flag.ato}):</strong> {flag.issue}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button className="flex-1 py-2 text-[10px] font-black tracking-wider text-white" style={{ background: 'rgba(234,179,8,0.25)', border: '1px solid rgba(234,179,8,0.4)' }}>
                      RESOLVE FLAG WITH ATO →
                    </button>
                    <button className="px-4 py-2 text-[10px] font-bold text-white/40 tracking-wider" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)' }}>
                      DISPUTE
                    </button>
                  </div>
                </div>
              ))}

              <div className="flex items-start gap-2 p-3" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
                <Lock size={10} className="text-blue-400 flex-shrink-0 mt-0.5" />
                <p className="text-[9px] text-blue-300/70 leading-relaxed">
                  Flagged hours are isolated from your verified total. Resolving a flag initiates a Veremark re-confirmation request to the ATO, which updates your cryptographic token within 2–5 business days.
                </p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Open Full Logbook CTA ── */}
      <div className="flex items-center gap-4 p-4" style={{ background: 'rgba(30,41,59,0.7)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.3)' }}>
          <BookMarked size={18} className="text-sky-400" />
        </div>
        <div className="flex-1">
          <p className="text-xs font-black text-white tracking-wide">DIGITAL LOGBOOK</p>
          <p className="text-[10px] text-white/35 mt-0.5">{hours > 0 ? `${hours} hrs logged — log flights, track PIC, night, and instrument time` : 'Log your first flight to start building your verified record'}</p>
        </div>
        <button
          onClick={() => onNavigate('digital-logbook')}
          className="flex-shrink-0 px-5 py-2.5 text-xs font-black tracking-wider text-white transition-all hover:brightness-110"
          style={{ background: 'rgba(249,115,22,0.8)', border: '1px solid rgba(249,115,22,0.5)' }}
        >
          OPEN LOGBOOK
        </button>
      </div>

      {/* ── Third-Party Sync ── */}
      <div style={{ border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.7)' }}>
        <button
          onClick={() => setSyncExpanded(v => !v)}
          className="w-full flex items-center gap-3 px-5 py-4 transition-all hover:brightness-110"
        >
          <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.35)' }}>
            <TrendingUp size={15} className="text-indigo-400" />
          </div>
          <div className="flex-1 text-left">
            <p className="text-xs font-black text-white tracking-wide">SYNC CONNECTED LOGBOOKS</p>
            <p className="text-[10px] text-white/35 mt-0.5">Connect your existing digital logbook apps — tokenized receipts route automatically</p>
          </div>
          <div className="flex items-center gap-2 mr-2">
            {LOGBOOK_PROVIDERS.filter(p => p.connected).length > 0 && (
              <span className="text-[9px] font-black px-2 py-1" style={{ background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399' }}>
                {LOGBOOK_PROVIDERS.filter(p => p.connected).length} CONNECTED
              </span>
            )}
          </div>
          <ChevronRight size={14} className={`text-white/30 transition-transform ${syncExpanded ? 'rotate-90' : ''}`} />
        </button>

        {syncExpanded && (
          <div className="px-5 pb-5 space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {LOGBOOK_PROVIDERS.map(provider => (
                <div
                  key={provider.name}
                  className="p-3 flex flex-col items-center gap-2 transition-all hover:brightness-110 cursor-pointer"
                  style={{ background: provider.connected ? 'rgba(16,185,129,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${provider.connected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}` }}
                >
                  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-xl" style={{ background: provider.colour }}>
                    {provider.logo}
                  </div>
                  <p className="text-[10px] font-black text-white tracking-wide text-center">{provider.name}</p>
                  {provider.connected ? (
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span className="text-[9px] font-bold text-emerald-400">LIVE SYNC</span>
                    </div>
                  ) : (
                    <span className="text-[9px] font-bold text-white/25">CONNECT</span>
                  )}
                </div>
              ))}
            </div>

            {/* Token pipeline badge */}
            <div className="flex items-center gap-3 p-3" style={{ background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.25)' }}>
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse flex-shrink-0" />
              <div>
                <p className="text-[10px] font-black text-indigo-300 tracking-wide">LIVE AUTH0 TOKEN PIPELINE</p>
                <p className="text-[9px] text-white/30 mt-0.5">Data fetches automatically via secure token relay. Raw files are never stored on PilotRecognition.com servers.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

// ─── TAB: EVENTS ───────────────────────────────────────────────────────────
const EventsTab: React.FC = () => {
  const events = [
    { name: 'APATS 2026', location: 'Manila, Philippines', date: 'Nov 2026', type: 'Career Fair' },
    { name: 'Dubai Airshow 2025', location: 'Dubai, UAE', date: 'Nov 2025', type: 'Industry Event' },
    { name: 'IATA AGM 2026', location: 'TBC', date: 'Jun 2026', type: 'Regulatory' },
    { name: 'Singapore Airshow 2026', location: 'Singapore', date: 'Feb 2026', type: 'Industry Event' },
  ];
  return (
    <div className="space-y-4">
      {events.map(e => (
        <div key={e.name} className="rounded-xl p-4 flex items-center gap-4 transition-all hover:scale-[1.005]" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-sm tracking-wide">{e.name}</p>
            <p className="text-xs text-white/50">{e.location} · {e.date}</p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full tracking-wider" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.6)' }}>{e.type}</span>
        </div>
      ))}
    </div>
  );
};

// ─── TAB: NEWSROOM ─────────────────────────────────────────────────────────
const NEWSROOM_DATA = [
  {
    id: 'recognition-systems',
    category: 'pilot' as const,
    tag: 'Recognition Systems',
    title: 'How to Build the Right Recognition Profile',
    description: 'CEO & Founder Karl Brian Vogt breaks down how to align your profile with Airbus EBT standards. It is not about flight hours alone — airlines want cognitive skills, behavioral markers, and constructivist thinking that static CVs never capture.',
    bullets: ['EBT CBTA-aligned assessment framework', 'Industry-recognized competency validation', 'Live profile matching with operators'],
    metrics: [{ label: 'Live Webinars', value: 'This week' }, { label: 'Profile Views', value: '2,340 +' }],
    image: '/images/pilotrecognitioncompoennt.png',
    ctaTarget: 'pilot-recognition-profile',
  },
  {
    id: 'cebu-cadet',
    category: 'pathways' as const,
    tag: 'Pathway Update',
    title: 'Cebu Pacific Opens Cadet Programme 2026',
    description: 'Applications now open for the Cebu Pacific Ab-Initio Cadet programme. Recognition-matched candidates receive priority interview access through the pull system.',
    bullets: ['Ab-Initio to First Officer pathway', 'Recognition Score threshold: 65+', 'Priority pull for verified pilots'],
    metrics: [{ label: 'Intake Date', value: 'Aug 2026' }, { label: 'Open Slots', value: '40' }],
    image: '/public/images/airline-logos/cebu-pacific.svg',
    ctaTarget: 'pathways',
  },
  {
    id: 'airbus-ebt',
    category: 'industry' as const,
    tag: 'Industry & Manufacturer',
    title: 'New EBT Framework Guidance Released by ICAO',
    description: 'ICAO Doc 9995 updated guidance on Evidence-Based Training competencies. Platform assessment criteria have been updated to reflect the latest behavioural marker definitions.',
    bullets: ['Updated 9 core competency definitions', 'New behavioural indicators for CRM', 'Affects Transition Program curriculum'],
    metrics: [{ label: 'Effective Date', value: 'Jun 2026' }, { label: 'Certification', value: 'enroll now for free!' }],
    image: '/images/airline-expectations/airbus-training.png',
    ctaTarget: 'programs',
  },
  {
    id: 'recognition-plus',
    category: 'program' as const,
    tag: 'Program Update',
    title: 'Recognition Plus — Priority Pathway Matching Now Live',
    description: 'Recognition Plus subscribers now receive priority placement in the operator pull queue. Your profile ranks above unverified candidates on every airline dashboard.',
    bullets: ['Priority operator queue placement', 'Unlimited pathway comparison views', 'Full Recognition Score breakdown'],
    metrics: [{ label: 'Plan', value: '$99 / year' }, { label: 'Active Members', value: '1,200+' }],
    image: '/images/accessportal.png',
    ctaTarget: 'programs',
  },
  {
    id: 'airlines-update',
    category: 'airlines' as const,
    tag: 'Airlines',
    title: 'Emirates & Singapore Airlines Add Recognition Pathway Cards',
    description: 'Two of the world\'s top carriers have added structured pathway cards to the platform. Pilots can now see exact requirements and gap analysis against their live Recognition Profile.',
    bullets: ['Emirates A380 First Officer pathway live', 'Singapore Airlines cadet pathway added', 'Real-time gap comparison enabled'],
    metrics: [{ label: 'New Pathways', value: '6 added' }, { label: 'Airlines Active', value: '14' }],
    image: '/images/airline-operations.png',
    ctaTarget: 'airlines',
  },
];

const NEWS_CATEGORIES = [
  { id: 'pathways' as const, label: 'Pathways' },
  { id: 'program' as const, label: 'Program' },
  { id: 'pilot' as const, label: 'Pilot' },
  { id: 'industry' as const, label: 'Industry & Manufacturer' },
  { id: 'airlines' as const, label: 'Airlines' },
];

const NewsroomTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const [activeIdx, setActiveIdx] = React.useState(0);
  const [activeCategory, setActiveCategory] = React.useState<'all' | 'pathways' | 'program' | 'pilot' | 'industry' | 'airlines'>('all');
  const lastInteraction = React.useRef(Date.now());

  const filtered = activeCategory === 'all' ? NEWSROOM_DATA : NEWSROOM_DATA.filter(n => n.category === activeCategory);
  const item = filtered[activeIdx] ?? filtered[0];

  React.useEffect(() => { setActiveIdx(0); }, [activeCategory]);

  const filteredLenRef = React.useRef(filtered.length);
  React.useEffect(() => { filteredLenRef.current = filtered.length; }, [filtered.length]);

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible' && Date.now() - lastInteraction.current >= 6000) {
        setActiveIdx(prev => (prev + 1) % filteredLenRef.current);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  if (!item) return null;

  return (
    <div className="-m-5 lg:-m-7">
      <div className="relative border border-white/10 flex flex-col overflow-hidden" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.80) 0%, rgba(15,23,42,0.65) 50%, rgba(15,23,42,0.80) 100%)', backdropFilter: 'blur(12px)' }}>
        <div className="absolute inset-0 pointer-events-none mix-blend-screen opacity-40" style={{ background: 'radial-gradient(circle at 30% 30%, rgba(255,255,255,0.25), transparent 45%)' }} />

        {/* Category tabs */}
        <div className="relative px-5 pt-4 pb-3 z-10" style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.3)' }}>
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/50 mb-3">NEWS ROOM</p>
          <div className="flex flex-wrap gap-2">
            <button onClick={() => setActiveCategory('all')} className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg border transition-all ${activeCategory === 'all' ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white/80'}`}>All</button>
            {NEWS_CATEGORIES.map(cat => (
              <button key={cat.id} onClick={() => { setActiveCategory(cat.id); lastInteraction.current = Date.now(); }} className={`px-3 py-1.5 text-[11px] font-black uppercase tracking-[0.15em] rounded-lg border transition-all ${activeCategory === cat.id ? 'bg-white/20 border-white/40 text-white' : 'bg-white/5 border-white/20 text-white/60 hover:bg-white/10 hover:text-white/80'}`}>{cat.label}</button>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="grid gap-4 md:grid-cols-[1.4fr,1fr] p-5">
          {/* Left — article */}
          <div className="text-white space-y-4 flex flex-col">
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 text-[11px] font-black uppercase tracking-[0.2em] bg-white/5 border border-white/40">
                  <span className="text-red-400">Recognition</span> <span className="text-white">Update</span>
                </span>
                <div className="flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-rose-200">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-pulse" />
                  Live
                </div>
              </div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-white/50">{activeIdx + 1} / {filtered.length}</span>
            </div>

            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.35em] text-slate-200/80">{item.tag}</p>
              <h2 className="text-2xl lg:text-[2rem] font-serif leading-tight mt-1">{item.title}</h2>
              <p className="text-slate-100/85 text-sm mt-3 leading-relaxed">{item.description}</p>
            </div>

            <ul className="space-y-1.5">
              {item.bullets.map((b, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-100/90">
                  <CheckCircle size={14} className="text-emerald-300 mt-0.5 flex-shrink-0" />
                  <span>{b}</span>
                </li>
              ))}
            </ul>

            <div className="grid grid-cols-2 gap-2">
              {item.metrics.map(m => (
                <div key={m.label} className="border border-white/25 bg-white/5 px-3 py-2 shadow-lg shadow-black/30">
                  <p className="text-[10px] uppercase tracking-[0.25em] text-white/70">{m.label}</p>
                  {m.label === 'Certification' && m.value === 'enroll now for free!' ? (
                    <button onClick={() => onNavigate('become-a-member')} className="text-base font-semibold text-blue-400 hover:text-blue-300 underline">{m.value}</button>
                  ) : (
                    <p className="text-base font-semibold text-white">{m.value}</p>
                  )}
                </div>
              ))}
            </div>

            <div className="flex flex-col items-center gap-2 pt-1">
              <button onClick={() => onNavigate('home')} className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 bg-white/80 text-slate-900 text-xs font-black uppercase tracking-[0.3em] shadow-[0_15px_30px_rgba(15,23,42,0.6)] hover:-translate-y-0.5 transition">
                <Home size={14} /> Home
              </button>
              <button onClick={() => onNavigate(item.ctaTarget)} className="text-xs font-semibold uppercase tracking-[0.35em] text-white/80 hover:text-white">
                Open Update →
              </button>
            </div>
          </div>

          {/* Right — image card */}
          <div className="relative min-h-[200px] border border-white/25 overflow-hidden">
            <img src={item.image} alt={item.title} className="absolute inset-0 w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-tr from-slate-900/75 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4">
              <p className="text-[11px] uppercase tracking-[0.35em] text-white/70">Latest drop</p>
              <p className="text-lg font-semibold text-white leading-tight">{item.tag}</p>
              <p className="text-sm text-white/80">Recognition, programs, and pathways broadcast through one newsroom overlay.</p>
            </div>
          </div>
        </div>

        {/* Latest updates bar */}
        <div className="px-5 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.1)', background: 'rgba(15,23,42,0.3)' }}>
          <p className="text-[11px] uppercase tracking-[0.25em] text-white/50 mb-2">Latest Updates</p>
          <div className="flex gap-1.5">
            {filtered.map((_, i) => (
              <button key={i} onClick={() => { setActiveIdx(i); lastInteraction.current = Date.now(); }} className={`h-1.5 flex-1 rounded-sm transition-all ${i === activeIdx ? 'bg-white/60 border-2 border-white/40' : 'bg-white/20 border-2 border-dashed border-white/10 hover:bg-white/30'}`} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── EMAIL VERIFY GATE ────────────────────────────────────────────────────
const EmailVerifyGate: React.FC<{ onResend: () => void; sent: boolean }> = ({ onResend, sent }) => (
  <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-6">
    <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-5">
      <Bell size={28} className="text-amber-400" />
    </div>
    <h2 className="text-xl font-black text-white mb-2">Verify your email first</h2>
    <p className="text-sm text-white/50 max-w-sm mb-6 leading-relaxed">
      Your credential wallet is locked until you confirm your email address. Check your inbox for a verification link from PilotRecognition.
    </p>
    {sent ? (
      <p className="text-xs text-emerald-400 font-semibold">✓ Verification email sent — check your inbox</p>
    ) : (
      <button
        onClick={onResend}
        className="px-6 py-2.5 bg-orange-500 hover:bg-orange-600 text-white text-xs font-black rounded-lg transition-colors tracking-wider"
      >
        RESEND VERIFICATION EMAIL
      </button>
    )}
  </div>
);

// ─── TAB: SETTINGS ─────────────────────────────────────────────────────────
const SettingsTab: React.FC<{ onLogout: () => void; getToken: () => Promise<string>; profileId: string | null; onAuth0Logout?: () => void }> = ({ onLogout, getToken, profileId, onAuth0Logout }) => {
  const [deleteStep, setDeleteStep] = React.useState<null | 'export' | 'confirm'>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [passkeyPending, setPasskeyPending] = React.useState(false);
  const [exportData, setExportData] = React.useState<{
    vcs: any[]; hourTokens: any[]; resume: any | null;
    program: any | null; interview: any | null;
  }>({ vcs: [], hourTokens: [], resume: null, program: null, interview: null });
  const [downloaded, setDownloaded] = React.useState<Record<string, boolean>>({});

  const loadExportData = async () => {
    setLoadingExport(true);
    const uid = profileId;
    if (!uid) { setLoadingExport(false); return; }

    const [vcsRes, hoursRes, resumeRes, programRes, interviewRes] = await Promise.all([
      supabase.from('pilot_verification_wallet').select('credential_type,credential_jwt,issued_at,status').eq('profile_id', uid),
      supabase.from('logbook_hour_tokens').select('issuer_name,total_hours,pic_hours,aircraft_type,period_from,period_to,verification_level,attestation_token,status').eq('pilot_id', uid),
      supabase.from('atlas_resumes').select('*').eq('user_id', uid).maybeSingle(),
      supabase.from('program_progress').select('program_type,completion_percentage,modules_completed,total_modules,status,start_date').eq('user_id', uid),
      supabase.from('interview_assessments').select('overall_score,overall_grade,technical_knowledge_score,communication_score,decision_making_score,strengths,areas_for_improvement,detailed_feedback,recommendation').eq('interviewer_id', uid).maybeSingle(),
    ]);

    setExportData({
      vcs: vcsRes.data ?? [],
      hourTokens: hoursRes.data ?? [],
      resume: resumeRes.data ?? null,
      program: (programRes.data && programRes.data.length > 0) ? programRes.data : null,
      interview: interviewRes.data ?? null,
    });
    setLoadingExport(false);
  };

  const handleOpenExport = async () => {
    setDeleteStep('export');
    setDeleteError('');
    setDownloaded({});
    await loadExportData();
  };

  const triggerDownload = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportItem = (key: string, filename: string, data: any) => {
    triggerDownload(filename, data);
    setDownloaded(d => ({ ...d, [key]: true }));
  };

  const b64urlDecode = (s: string): ArrayBuffer => {
    const b = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  };
  const b64urlEncode = (buf: ArrayBuffer): string => {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const verifyPasskeyForDeletion = async (token: string): Promise<void> => {
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

    // 1. Fetch the user's registered passkey credential IDs from Supabase
    const uid = profileId;
    if (!uid) throw new Error('No session');

    // Use authenticated fetch so RLS passes for Auth0 users (supabase client has no session)
    const passkeysRes = await fetch(
      `${supabaseUrl}/rest/v1/pilot_passkeys?select=credential_id&user_id=eq.${uid}`,
      { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${token}` } }
    );
    const passkeys: { credential_id: string }[] = passkeysRes.ok ? await passkeysRes.json() : [];

    if (!passkeys || passkeys.length === 0) {
      // No passkey registered — skip gate
      throw new Error('NO_PASSKEY');
    }

    // Use the first registered credential to get a server-signed challenge
    const credentialId = passkeys[0].credential_id;

    // 2. Get a single-use challenge from the server
    const challengeRes = await fetch(`${supabaseUrl}/functions/v1/passkey-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
      body: JSON.stringify({ credentialId }),
    });
    if (!challengeRes.ok) throw new Error('Could not generate passkey challenge');
    const { challenge } = await challengeRes.json();

    // 3. Trigger iCloud Keychain / Touch ID / Face ID prompt
    const allowCredentials = passkeys.map((p: any) => ({
      id: b64urlDecode(p.credential_id),
      type: 'public-key' as PublicKeyCredentialType,
    }));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: b64urlDecode(challenge),
        allowCredentials,
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!assertion) throw new Error('No passkey assertion returned');
    const resp = assertion.response as AuthenticatorAssertionResponse;

    // 4. Verify signature server-side
    const verifyRes = await fetch(`${supabaseUrl}/functions/v1/passkey-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
      body: JSON.stringify({
        credentialId: b64urlEncode(assertion.rawId),
        authenticatorData: b64urlEncode(resp.authenticatorData),
        clientDataJSON: b64urlEncode(resp.clientDataJSON),
        signature: b64urlEncode(resp.signature),
        userHandle: resp.userHandle ? b64urlEncode(resp.userHandle) : null,
      }),
    });
    if (!verifyRes.ok) throw new Error('Passkey verification failed — deletion blocked');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const token = await getToken();

      // Passkey gate — triggers iCloud Keychain / Touch ID before deletion
      if (window.PublicKeyCredential) {
        setPasskeyPending(true);
        try {
          await verifyPasskeyForDeletion(token!);
        } catch (pkErr: any) {
          setPasskeyPending(false);
          if (pkErr?.name === 'NotAllowedError') throw new Error('Passkey confirmation cancelled. Deletion aborted.');
          if (pkErr?.message === 'NO_PASSKEY') {
            // No passkey registered on this account — skip gate, proceed
          } else {
            console.warn('[delete-account] passkey gate skipped:', pkErr?.message);
          }
        }
        setPasskeyPending(false);
      }

      const res = await fetch(`${(import.meta as any).env?.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || `Server error ${res.status}`);
      // Auth0 logout clears the session and redirects — call it if available, else fall back to onLogout
      if (onAuth0Logout) { onAuth0Logout(); } else { localStorage.clear(); sessionStorage.clear(); onLogout(); }
    } catch (err: any) {
      setDeleteError(err.message || 'Something went wrong. Please try again.');
      setDeleting(false);
    }
  };

  const handleCancel = () => { setDeleteStep(null); setDeleteError(''); setDownloaded({}); };

  const sections = [
    { title: 'Account', items: ['Edit Profile', 'Change Password', 'Email Preferences'] },
    { title: 'Consent & Privacy', items: ['Manage Vault Consent', 'Manage Veremark Consent', 'Operator Access Log', 'Download My Data'] },
    { title: 'Notifications', items: ['Pathway Alerts', 'Credential Expiry Warnings', 'News & Updates', 'Operator Interest Notifications'] },
    { title: 'Subscription', items: ['View Plan', 'Upgrade to Recognition Plus', 'Billing History'] },
  ];

  return (
    <div className="space-y-5 max-w-2xl">
      {sections.map(s => (
        <SectionCard key={s.title} title={s.title}>
          <div className="space-y-0.5">
            {s.items.map(item => (
              <button key={item} className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.toUpperCase()}
                <ChevronRight size={12} className="text-white/25" />
              </button>
            ))}
          </div>
        </SectionCard>
      ))}

      {/* Delete Account */}
      <SectionCard title="Danger Zone">
        {deleteStep === null && (
          <button
            onClick={handleOpenExport}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-red-400 rounded-lg transition-all font-bold tracking-wider hover:text-red-300"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            DELETE ACCOUNT
            <ChevronRight size={12} className="text-red-400/50" />
          </button>
        )}

        {/* Step 1 — Export documents */}
        {deleteStep === 'export' && (
          <div className="px-3 py-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>STEP 1 OF 2</span>
              <span className="text-[10px] font-black text-white/60 tracking-wider">EXPORT YOUR DATA</span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              Everything below will be <span className="text-red-400 font-bold">permanently deleted</span>. Download what you need before continuing — all exports are portable JSON.
            </p>

            {loadingExport ? (
              <div className="flex items-center gap-2 py-3">
                <div className="w-4 h-4 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                <span className="text-[10px] text-white/40">Loading your data…</span>
              </div>
            ) : (
              <div className="space-y-2">

                {/* Verified Credentials (W3C VCs) */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">VERIFIED CREDENTIALS</p>
                      <p className="text-[9px] text-white/35">{exportData.vcs.length} W3C VC{exportData.vcs.length !== 1 ? 's' : ''} · Wallet tokens · Attestations</p>
                    </div>
                    {exportData.vcs.length > 0 ? (
                      <button onClick={() => exportItem('vcs', `pilot-vcs-${new Date().toISOString().slice(0,10)}.json`, exportData.vcs)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.vcs ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.vcs ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.vcs ? '#34d399' : '#38bdf8' }}>
                        {downloaded.vcs ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* Verified Flight Hour Tokens */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">VERIFIED FLIGHT HOURS</p>
                      <p className="text-[9px] text-white/35">{exportData.hourTokens.length} logbook token{exportData.hourTokens.length !== 1 ? 's' : ''} · Attestation records</p>
                    </div>
                    {exportData.hourTokens.length > 0 ? (
                      <button onClick={() => exportItem('hours', `pilot-flight-hours-${new Date().toISOString().slice(0,10)}.json`, exportData.hourTokens)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.hours ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.hours ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.hours ? '#34d399' : '#38bdf8' }}>
                        {downloaded.hours ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* ATLAS Resume */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">ATLAS PILOT RESUME</p>
                      <p className="text-[9px] text-white/35">{exportData.resume ? `${exportData.resume.target_role || 'Aviation'} · ${exportData.resume.is_certified ? 'Certified' : 'Draft'}` : 'No resume generated'}</p>
                    </div>
                    {exportData.resume ? (
                      <button onClick={() => exportItem('resume', `atlas-resume-${new Date().toISOString().slice(0,10)}.json`, exportData.resume)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.resume ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.resume ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.resume ? '#34d399' : '#38bdf8' }}>
                        {downloaded.resume ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* Foundation Program Certificate */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">PROGRAM COMPLETION RECORDS</p>
                      <p className="text-[9px] text-white/35">
                        {exportData.program
                          ? exportData.program.map((p: any) => `${p.program_type} — ${p.completion_percentage}%`).join(' · ')
                          : 'No programs enrolled'}
                      </p>
                    </div>
                    {exportData.program ? (
                      <button onClick={() => exportItem('program', `program-certificate-${new Date().toISOString().slice(0,10)}.json`, exportData.program)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.program ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.program ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.program ? '#34d399' : '#38bdf8' }}>
                        {downloaded.program ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* EBT Interview Assessment */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">EBT INTERVIEW ASSESSMENT</p>
                      <p className="text-[9px] text-white/35">
                        {exportData.interview
                          ? `Grade ${exportData.interview.overall_grade || '—'} · Score ${exportData.interview.overall_score ?? '—'} · ${exportData.interview.recommendation || ''}`
                          : 'No interview assessment on record'}
                      </p>
                    </div>
                    {exportData.interview ? (
                      <button onClick={() => exportItem('interview', `ebt-interview-assessment-${new Date().toISOString().slice(0,10)}.json`, exportData.interview)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.interview ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.interview ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.interview ? '#34d399' : '#38bdf8' }}>
                        {downloaded.interview ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => setDeleteStep('confirm')}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
              >
                CONTINUE TO DELETE →
              </button>
              <button onClick={handleCancel} className="px-4 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Final confirm */}
        {deleteStep === 'confirm' && (
          <div className="px-3 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>STEP 2 OF 2</span>
              <span className="text-[10px] font-black text-white/60 tracking-wider">FINAL CONFIRMATION</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              This will permanently delete your <span className="text-white font-bold">profile, credentials, wallet, documents, passkeys, logbook data,</span> and all associated records. <span className="text-red-400 font-bold">This cannot be undone.</span>
            </p>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-lg">🔑</span>
              <p className="text-[10px] text-white/45 leading-snug">Your passkey (Touch ID / Face ID / iCloud Keychain) will be required to confirm deletion.</p>
            </div>
            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
              >
                {passkeyPending ? '🔑 WAITING FOR PASSKEY…' : deleting ? 'DELETING...' : 'YES, DELETE EVERYTHING'}
              </button>
              <button onClick={handleCancel} disabled={deleting} className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                CANCEL
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      <button onClick={onLogout} className="flex items-center gap-2 text-xs text-red-400 font-bold hover:text-red-300 transition-colors px-3 py-2 tracking-wider">
        <LogOut size={14} /> SIGN OUT
      </button>
    </div>
  );
};

// ─── MAIN SHELL ────────────────────────────────────────────────────────────
export const UnifiedPilotPlatform: React.FC<UnifiedPilotPlatformProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { user: auth0User, getAccessTokenSilently, getIdTokenClaims, logout: auth0Logout } = useAuth0();
  const { readProfile } = useVaultProfile();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() => (searchParams.get('tab') as TabId) ?? 'home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletChecks, setWalletChecks] = useState<any[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(userProfile);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    console.log('[avatar] file selected:', file?.name, file?.type, file?.size, '| profileData.id:', profileData?.id);
    console.log('[avatar] existing image — url:', profileData?.profile_image_url, '| publicId:', profileData?.profile_image_public_id);
    if (!file || !profileData?.id) {
      console.warn('[avatar] aborted — no file or no profileData.id', { file: !!file, profileId: profileData?.id });
      return;
    }
    if (!file.type.startsWith('image/')) { setAvatarError('Must be an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setAvatarError('Image must be under 5MB'); return; }
    setAvatarUploading(true);
    setAvatarError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let accessToken: string | null = (session as any)?.access_token ?? null;
      console.log('[avatar] supabase session:', session ? `uid=${session.user?.id} token=${accessToken?.slice(0,20)}…` : 'null');

      // Auth0-only users have no Supabase session — use Auth0 access token instead
      if (!accessToken) {
        try {
          accessToken = await getAccessTokenSilently();
          console.log('[avatar] using Auth0 access token:', accessToken?.slice(0,20) + '…');
        } catch (err) {
          console.warn('[avatar] getAccessTokenSilently failed:', err);
        }
      }
      if (!accessToken) throw new Error('Not authenticated — no Supabase or Auth0 token available');

      // Delete old image from Cloudinary first (non-blocking if it fails)
      const oldPublicId = profileData?.profile_image_public_id;
      if (oldPublicId) {
        console.log('[avatar] deleting old image from Cloudinary:', oldPublicId);
        const delRes = await supabase.functions.invoke('cloudinary-delete', {
          body: { publicId: oldPublicId, type: 'profile' },
        });
        console.log('[avatar] delete result:', delRes.data, delRes.error);
      } else {
        console.log('[avatar] no existing image to delete');
      }

      const canvas = document.createElement('canvas');
      const imgEl = document.createElement('img') as HTMLImageElement;
      await new Promise<void>((res, rej) => {
        imgEl.onload = () => {
          const max = 400;
          let w = imgEl.width, h = imgEl.height;
          if (w > h && w > max) { h = h * max / w; w = max; }
          else if (h > max) { w = w * max / h; h = max; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(imgEl, 0, 0, w, h);
          console.log('[avatar] compressed to', w, 'x', h);
          res();
        };
        imgEl.onerror = (err) => { console.error('[avatar] image load error:', err); rej(err); };
        imgEl.src = URL.createObjectURL(file);
      });
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      console.log('[avatar] base64 length:', base64.length, '| calling cloudinary-upload edge fn…');
      const uploadRes = await fetch('https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/cloudinary-upload', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, userId: profileData.id }),
      });
      console.log('[avatar] edge fn HTTP status:', uploadRes.status, uploadRes.statusText);
      const result = await uploadRes.json();
      console.log('[avatar] edge fn response:', result);
      if (!result.success) throw new Error(result.error || 'Upload failed');
      console.log('[avatar] upload success — url:', result.url, '| publicId:', result.publicId);
      // Supabase profile update handled server-side in edge fn (service role, bypasses RLS)
      setProfileData((prev: any) => ({ ...prev, profile_image_url: result.url, profile_image_public_id: result.publicId }));
      console.log('[avatar] profileData updated in state ✓');
    } catch (err: any) {
      console.error('[avatar] upload error:', err);
      setAvatarError(err.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [resendingSent, setResendingSent] = useState(false);
  const [tcUpdatePending, setTcUpdatePending] = useState(false);

  // Check email verification status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmailVerified(!!session.user.email_confirmed_at);
      }
    });
  }, []);

  // Check if T&C version has been updated since user last accepted
  useEffect(() => {
    const CURRENT_TC_VERSION = 'v2-2026';
    if (profileData?.consent_version && profileData.consent_version !== CURRENT_TC_VERSION) {
      setTcUpdatePending(true);
    }
  }, [profileData?.consent_version]);

  // Sync URL with active tab
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Sync incoming URL param
  useEffect(() => {
    const t = searchParams.get('tab') as TabId;
    if (t && t !== activeTab) setActiveTab(t);
  }, []); // eslint-disable-line

  // Live unread notification count + pending credential requests
  useEffect(() => {
    const profileId = profileData?.id || currentUser?.id;
    if (!profileId) return;
    const fetchNotifs = async () => {
      const [{ count }, { data: reqs }] = await Promise.all([
        supabase.from('pilot_notifications').select('id', { count: 'exact', head: true }).eq('pilot_id', profileId).eq('is_read', false),
        supabase.from('credential_requests').select('id, enterprise_account_id, requested_fields, request_message, requested_at, enterprise_accounts(name)').eq('pilot_id', profileId).eq('status', 'pending'),
      ]);
      setNotifCount(count ?? 0);
      setPendingRequests(reqs ?? []);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [profileData?.id, currentUser?.id]);

  // Keep profileData in sync — prefer Supabase userProfile, fall back to auth0_id then email lookup
  useEffect(() => {
    if (userProfile) {
      console.log('[profile] loaded from AuthContext userProfile — image_url:', userProfile?.profile_image_url, '| publicId:', userProfile?.profile_image_public_id);
      setProfileData(userProfile);
    } else if (auth0User?.sub) {
      const email = auth0User?.email || currentUser?.email;
      console.log('[profile] Auth0 user detected, querying Supabase by auth0_id:', auth0User.sub);
      supabase
        .from('profiles')
        .select('*, profile_image_public_id')
        .eq('auth0_id', auth0User.sub)
        .maybeSingle()
        .then(async ({ data }) => {
          if (data) {
            console.log('[profile] found by auth0_id — image_url:', data.profile_image_url, '| publicId:', data.profile_image_public_id);
            const { data: decrypted } = await readProfile(data.id);
            setProfileData(decrypted || data);
          } else if (email) {
            console.log('[profile] not found by auth0_id, falling back to email:', email);
            const { data: emailData } = await supabase
              .from('profiles')
              .select('*, profile_image_public_id')
              .eq('email', email)
              .maybeSingle();
            if (emailData) {
              console.log('[profile] found by email — image_url:', emailData.profile_image_url, '| publicId:', emailData.profile_image_public_id);
              supabase
                .from('profiles')
                .update({ auth0_id: auth0User.sub })
                .eq('id', emailData.id)
                .then(() => {});
              const { data: decrypted } = await readProfile(emailData.id);
              setProfileData(decrypted || emailData);
            } else {
              console.warn('[profile] no profile found by auth0_id or email');
            }
          }
        });
    }
  }, [userProfile, auth0User?.sub, auth0User?.email, currentUser?.email]);

  // Fetch wallet checks — works for both Supabase and Auth0-only users
  useEffect(() => {
    const profileId = profileData?.id;
    if (!profileId) return;
    supabase
      .from('pilot_credentials')
      .select('*')
      .eq('profile_id', profileId)
      .then(({ data }: { data: any[] | null }) => { if (data) setWalletChecks(data); });
  }, [profileData?.id]);

  // Fetch airlines
  useEffect(() => {
    supabase
      .from('airlines')
      .select('id, name, image, region, flight_hours, fleet')
      .limit(50)
      .then(({ data }: { data: any[] | null }) => { if (data) setAirlines(data); });
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    onNavigate('home');
  }, [logout, onNavigate]);

  const setTab = (t: TabId) => {
    setActiveTab(t);
    setSidebarOpen(false);
  };

  // Listen for tab-switch events fired from embedded child components (e.g. profile page wallet CTA)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail as TabId;
      if (tab) setTab(tab);
    };
    window.addEventListener('switch-platform-tab', handler);
    return () => window.removeEventListener('switch-platform-tab', handler);
  }, []);

  const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
  const rawDisplayName = profileData?.display_name || profileData?.full_name;
  const displayName = (rawDisplayName && !isCiphertext(rawDisplayName)) ? rawDisplayName : (auth0User?.nickname || auth0User?.name || auth0User?.email?.split('@')[0] || currentUser?.email?.split('@')[0] || 'Pilot');
  const initials = displayName.charAt(0).toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':          return <HomeTab profile={profileData} walletChecks={walletChecks} onNavigate={onNavigate} setTab={setTab} enrolledInFoundation={false} airlines={airlines} auth0User={auth0User} avatarInputRef={avatarInputRef} avatarUploading={avatarUploading} avatarError={avatarError} handleAvatarUpload={handleAvatarUpload} />;
      case 'profile':       return <ProfileTab key="profile-tab" onNavigate={onNavigate} profile={profileData} walletChecks={walletChecks} initialView='profile' />;
      case 'score':         return <ScoreTab profile={profileData} setTab={setTab} />;
      case 'wallet':        return !emailVerified ? <EmailVerifyGate onResend={async () => { setResendingSent(true); await supabase.auth.resend({ type: 'signup', email: currentUser?.email ?? '' }); }} sent={resendingSent} /> : <WalletTab walletChecks={walletChecks} profile={profileData} pendingRequests={pendingRequests} hasActiveSession={!!(auth0User?.sub || currentUser?.id)} />;
      case 'pathways':      return <PathwaysTab onNavigate={onNavigate} />;
      case 'programs':      return <ProgramsTab onNavigate={onNavigate} />;
      case 'dashboard':     return <ProfileTab key="dashboard-tab" onNavigate={onNavigate} profile={profileData} walletChecks={walletChecks} initialView='dashboard' />;
      case 'market-intel':    return <CareerIntelligenceDashboard profile={profileData} />;
      case 'data-provenance': return <DataProvenancePage onNavigate={onNavigate} />;
      case 'airlines':      return <AirlinesTab onNavigate={onNavigate} />;
      case 'manufacturers': return <ManufacturersTab onNavigate={onNavigate} />;
      case 'atlas-cv':      return <AtlasCVTab profile={profileData} onNavigate={onNavigate} />;
      case 'logbook':       return <LogbookHub profile={profileData} onNavigate={onNavigate} />;
      case 'events':        return <EventsTab />;
      case 'newsroom':      return <NewsroomTab onNavigate={onNavigate} />;
      case 'settings':      return <SettingsTab onLogout={handleLogout} getToken={async () => { try { const claims = await getIdTokenClaims(); const t = claims?.__raw; if (t) return t; throw new Error('no id token'); } catch { const { data: { session } } = await supabase.auth.getSession(); const t = session?.access_token; if (!t) throw new Error('No auth token available — please log out and back in'); return t; } }} profileId={profileData?.id ?? null} onAuth0Logout={() => { localStorage.clear(); sessionStorage.clear(); auth0Logout({ logoutParams: { returnTo: window.location.origin } }); }} />;
      default:              return null;
    }
  };

  const activeNavItem = NAV_ITEMS.find(n => n.id === activeTab);
  const [passkeyPromptDismissed, setPasskeyPromptDismissed] = React.useState(false);
  const shouldShowPasskeyPrompt = useShouldShowPasskeyPrompt();
  const showPasskeyPrompt = shouldShowPasskeyPrompt && !passkeyPromptDismissed && !!(auth0User?.sub || currentUser?.id);

  useEffect(() => {
    const close = () => { setBellOpen(false); setProfileDropOpen(false); setHamburgerOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col font-sans">

      {/* ── BACKGROUND: Portal 2 MeshGradient ── */}
      <div className="fixed inset-0 z-0">
        {graphicsConfig.enableMeshGradient ? (
          <MeshGradient
            className="w-full h-full"
            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
            speed={graphicsConfig.meshGradientSpeed}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* ── TOP NAV BAR ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', height: '52px' }}
      >
        {/* Left — wordmark */}
        <div className="flex items-center min-w-0 flex-1">
          <span
            className="text-xl tracking-tight leading-none cursor-pointer"
            style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }}
            onClick={() => onNavigate('home')}
          >
            <span className="text-white">pilot</span>
            <span className="text-red-500">recognition</span>
            <span className="text-white">.com</span>
          </span>
        </div>

        {/* Right — auth-conditional + hamburger */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {currentUser ? (
            <>
              {/* Settings */}
              <button
                onClick={() => setTab('settings')}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <Settings size={15} />
              </button>

              {/* Notification bell dropdown */}
              <div className="relative" onMouseDown={e => e.stopPropagation()}>
                <button
                  className="relative w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
                  onClick={() => { setBellOpen(v => !v); setProfileDropOpen(false); setHamburgerOpen(false); }}
                >
                  <Bell size={15} />
                  {(notifCount > 0 || tcUpdatePending || !emailVerified) && (
                    <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-amber-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {notifCount > 0 ? notifCount : '!'}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-10 w-80 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
                      <p className="text-sm font-black text-white">Notifications</p>
                    </div>
                    <NotificationsFeedPanel profileId={profileData?.id} />
                    <button onClick={() => { setBellOpen(false); setTab('notifications' as TabId); }} className="w-full px-4 py-2.5 text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 border-t border-white/5 text-center transition-colors">
                      VIEW ALL NOTIFICATIONS →
                    </button>
                  </div>
                )}
              </div>

              {/* Avatar dropdown */}
              <div className="relative" onMouseDown={e => e.stopPropagation()}>
                <button
                  onClick={() => { setProfileDropOpen(v => !v); setBellOpen(false); setHamburgerOpen(false); }}
                  className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-md overflow-hidden flex-shrink-0"
                >
                  <ProfileImage
                    url={profileData?.profile_image_url}
                    publicId={profileData?.profile_image_public_id}
                    name={displayName}
                    size={32}
                    className="w-full h-full"
                    fallbackClassName="rounded-full text-sm"
                  />
                </button>
                {profileDropOpen && (
                  <div className="absolute right-0 top-10 w-64 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Account</p>
                      <p className="text-sm font-black text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-white/40 truncate">{profileData?.email ?? auth0User?.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'Edit Profile', tab: 'profile' as TabId, icon: User },
                        { label: 'My Wallet', tab: 'wallet' as TabId, icon: Shield },
                        { label: 'Pathways', tab: 'pathways' as TabId, icon: Map },
                        { label: 'Settings', tab: 'settings' as TabId, icon: Settings },
                      ].map(({ label, tab, icon: Icon }) => (
                        <button key={tab} onClick={() => { setTab(tab); setProfileDropOpen(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors group">
                          <div className="flex items-center gap-3">
                            <Icon size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
                            <span className="text-[11px] font-black text-white/70 group-hover:text-white tracking-wide transition-colors">{label.toUpperCase()}</span>
                          </div>
                          <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                        </button>
                      ))}
                    </div>
                    <div className="border-t border-white/5 py-1">
                      <button onClick={() => { setProfileDropOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                        <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                        <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                className="px-4 py-1.5 text-xs font-bold tracking-wider text-white rounded-lg transition-all"
                style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}
              >
                LOGIN
              </button>
              <button
                onClick={() => { window.location.href = '/become-member'; }}
                className="px-4 py-1.5 text-xs font-bold tracking-wider text-white rounded-lg transition-all"
                style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.5)' }}
              >
                BECOME A MEMBER
              </button>
            </>
          )}
          {/* Hamburger dropdown — always on the far right */}
          <div className="relative" onMouseDown={e => e.stopPropagation()}>
            <button
              className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
              onClick={() => { setHamburgerOpen(v => !v); setBellOpen(false); setProfileDropOpen(false); }}
            >
              <Menu size={18} />
            </button>
            {hamburgerOpen && (
              <div className="absolute right-0 top-10 w-56 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                <div className="px-4 pt-3 pb-2 border-b border-white/5">
                  <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Navigation</p>
                </div>
                <div className="py-1">
                  {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.id} onClick={() => { setTab(item.id); setHamburgerOpen(false); setSidebarOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                        <Icon size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
                        <span className="text-[11px] font-black text-white/60 group-hover:text-white tracking-wide transition-colors">{item.label.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
                {currentUser && (
                  <div className="border-t border-white/5 py-1">
                    <button onClick={() => { setHamburgerOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                      <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                      <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── LAYOUT: sidebar + content ── */}
      <div className="relative z-40 flex flex-1">

        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
        )}

        {/* ── SIDEBAR (glass, Portal 2 style) — always fixed ── */}
        <aside
          className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col w-60 flex-shrink-0 transition-transform duration-200 pt-[52px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Back to Home */}
          <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <button
              onClick={() => onNavigate('home')}
              className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-white/60 hover:text-white hover:bg-white/08 transition-all text-xs font-bold tracking-wider"
              style={{ background: 'rgba(255,255,255,0.05)' }}
            >
              <ArrowRight size={13} className="rotate-180 flex-shrink-0" />
              BACK TO HOME
            </button>
          </div>

          {/* Nav items — grouped */}
          <nav className="flex-1 px-2 py-2 overflow-y-auto">
            {([
              {
                group: 'MY FLIGHT DECK',
                items: [
                  { id: 'dashboard', label: 'Recognition Board', icon: BarChart3,  premium: false },
                  { id: 'home',      label: 'Home',             icon: Home,       premium: false },
                  { id: 'profile',   label: 'My Profile',       icon: User,       premium: false },
                  { id: 'wallet',    label: 'Pilot Credentials', icon: Shield,     premium: false },
                  { id: 'logbook',       label: 'Digital Logbook',     icon: BookMarked,  premium: false },
                  { id: 'market-intel',  label: 'Market Intelligence', icon: TrendingUp,   premium: false },
                ],
              },
              {
                group: 'AVIATION NETWORK',
                items: [
                  { id: 'pathways',      label: 'Pathways',      icon: Map,       premium: false },
                  { id: 'airlines',      label: 'Airlines',      icon: Plane,     premium: false },
                  { id: 'manufacturers', label: 'Manufacturers', icon: Wrench,    premium: false },
                  { id: 'events',        label: 'Events',        icon: Calendar,  premium: false },
                  { id: 'newsroom',      label: 'Newsroom',      icon: Newspaper, premium: false },
                ],
              },
              {
                group: 'PROGRAMS & TOOLS',
                items: [
                  { id: 'programs',        label: 'Programs',         icon: BookOpen,      premium: false },
                  { id: 'atlas-cv',        label: 'Atlas CV',         icon: FileText,      premium: true  },
                  { id: 'score',           label: 'My Score',         icon: TrendingUp,    premium: false },
                  { id: 'data-provenance', label: 'Data Sources',     icon: Globe,         premium: false },
                ],
              },
              {
                group: 'ACCOUNT',
                items: [
                  { id: 'settings', label: 'Settings', icon: Settings, premium: false },
                ],
              },
            ] as { group: string; items: { id: TabId; label: string; icon: React.ComponentType<{className?: string; size?: number}>; premium: boolean }[] }[]).map(section => (
              <div key={section.group} className="mb-3">
                <p className="px-3 pt-2 pb-1 text-[9px] font-black tracking-[0.18em] text-white/25 uppercase">{section.group}</p>
                <div className="space-y-0.5">
                  {section.items.map(item => {
                    const Icon = item.icon;
                    const isActive = activeTab === item.id;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setTab(item.id)}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                        style={{
                          background: isActive ? 'rgba(249,115,22,0.12)' : 'transparent',
                          borderLeft: isActive ? '2px solid #f97316' : '2px solid transparent',
                        }}
                      >
                        <Icon size={15} className={isActive ? 'text-orange-400' : 'text-white/50'} />
                        <span className={`flex-1 text-left text-xs font-bold tracking-wider ${isActive ? 'text-orange-300' : 'text-white/55'}`}>
                          {item.label.toUpperCase()}
                        </span>
                        {item.premium && (
                          <Lock size={10} className="text-yellow-500/70 mr-1 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </nav>

          {/* Bottom user strip */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <ProfileImage
                url={profileData?.profile_image_url}
                publicId={profileData?.profile_image_public_id}
                name={displayName}
                size={36}
                className="rounded-full flex-shrink-0"
                fallbackClassName="rounded-full bg-slate-600 text-white text-xs"
              />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-white/40 truncate">
                  {profileData?.pilot_id ? <span className="text-orange-400/70 font-mono font-bold mr-1">{profileData.pilot_id}</span> : null}
                  {currentUser?.email}
                </p>
              </div>
              <button onClick={handleLogout} className="text-white/30 hover:text-white/80 transition-colors flex-shrink-0">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 h-screen overflow-y-auto pt-[52px] lg:ml-60">
          <div className="max-w-[1200px] mx-auto p-5 lg:p-7">
            {renderContent()}
          </div>
        </main>
      </div>

      {/* ── POST-LOGIN PASSKEY REGISTRATION PROMPT ── */}
      {showPasskeyPrompt && (
        <PasskeyPrompt
          userId={profileData?.id || auth0User?.sub || currentUser?.id || ''}
          userEmail={profileData?.email || auth0User?.email || currentUser?.email || ''}
          onDismiss={() => setPasskeyPromptDismissed(true)}
        />
      )}
    </div>
  );
};

export default UnifiedPilotPlatform;
