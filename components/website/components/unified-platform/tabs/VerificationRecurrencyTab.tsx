import React, { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  ShieldCheck,
  AlertTriangle,
  AlertCircle,
  CheckCircle2,
  Clock,
  Plane,
  Stethoscope,
  Radio,
  Globe,
  Upload,
  FileCheck,
  FileDigit,
  UserCheck,
  Users,
  Briefcase,
  TrendingUp,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  X,
  CalendarDays,
  Award,
  GraduationCap,
  FolderOpen,
  History,
  Crosshair,
  BarChart3,
  Landmark,
  FileText,
  Zap,
  Target,
  Link,
  Sparkles,
  Bot,
  Building2,
  Brain,
  BookOpen,
  HelpCircle,
} from 'lucide-react';
import type { TabId } from '../types';
import { RecognitionAIChat } from '../RecognitionAIChat';

const TooltipCol: React.FC<{ label: string; tip: string }> = ({ label, tip }) => {
  const [show, setShow] = useState(false);
  return (
    <div
      className="relative flex items-center gap-1 cursor-help"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      <span>{label}</span>
      <HelpCircle size={10} className="text-white/20" />
      {show && (
        <div
          className="absolute bottom-full left-0 mb-2 w-56 px-3 py-2 rounded-lg text-[10px] font-medium text-white shadow-xl z-50"
          style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          {tip}
          <div className="absolute top-full left-3 w-2 h-2 rotate-45" style={{ background: 'rgba(15,23,42,0.98)', borderRight: '1px solid rgba(255,255,255,0.1)', borderBottom: '1px solid rgba(255,255,255,0.1)' }} />
        </div>
      )}
    </div>
  );
};

interface WalletCheck {
  status?: string;
  credential_type?: string;
  expiry_date?: string;
  verified_at?: string;
  [key: string]: unknown;
}

interface Credential {
  credential_type?: string;
  status?: string;
  issued_at?: string;
  expiry_date?: string;
  total_hours?: number;
  [key: string]: unknown;
}

interface Props {
  profile: Record<string, unknown> | null;
  walletChecks: WalletCheck[];
  credentials: Credential[];
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

function daysUntil(dateStr: string | null | undefined): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  const diff = target.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

function fmtDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '—';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusColor(days: number | null): { text: string; statusText: string } {
  if (days === null) return { text: 'text-slate-400', statusText: 'Not recorded' };
  if (days < 0) return { text: 'text-red-500', statusText: 'Expired' };
  if (days <= 30) return { text: 'text-amber-500', statusText: 'Expiring soon' };
  if (days <= 90) return { text: 'text-sky-500', statusText: 'Renewal due' };
  return { text: 'text-emerald-500', statusText: 'Valid' };
}

function statusLabel(days: number | null): string {
  if (days === null) return 'Not recorded';
  if (days < 0) return `Expired ${Math.abs(days)} days ago`;
  if (days === 0) return 'Expires today';
  if (days === 1) return '1 day left';
  if (days <= 30) return `${days} days left`;
  if (days <= 90) return `${days} days left`;
  return `${days} days left`;
}

function pilotAction(days: number | null, type: 'license' | 'medical' | 'english' | 'radio'): { impact: string; action: string } {
  if (type === 'medical') {
    if (days === null) return { impact: 'Cannot exercise CPL privileges without valid medical.', action: 'Book Class 1 medical exam with a DME immediately.' };
    if (days < 0) return { impact: 'Medical expired. You are NOT cleared to fly commercially.', action: 'Schedule renewal medical before next flight duty.' };
    if (days <= 14) return { impact: 'Medical expiring soon. Commercial ops at risk.', action: `Schedule Class 1 renewal within ${days} days.` };
    if (days <= 90) return { impact: 'Medical valid. Plan renewal exam in the next 3 months.', action: 'Book renewal appointment to avoid last-minute gaps.' };
    return { impact: 'Medical valid. Cleared for commercial operations.', action: 'No action required. Next renewal due in ' + days + ' days.' };
  }
  if (type === 'radio') {
    if (days === null) return { impact: 'Cannot operate in controlled airspace or IFR without radio license.', action: 'Apply for NTC radio telephony license.' };
    if (days < 0) return { impact: 'Radio license expired. Cannot use ATC frequencies.', action: 'Renew NTC radio license before next IFR flight.' };
    return { impact: 'Radio license valid. Cleared for IFR and controlled airspace.', action: 'No action required. Renewal due in ' + days + ' days.' };
  }
  if (type === 'english') {
    return { impact: 'ICAO Level 5 valid indefinitely. Cleared for international ops.', action: 'No renewal required. Level 5 has no expiry.' };
  }
  // license
  if (days === null) return { impact: 'No valid license on file. Cannot act as pilot.', action: 'Upload your CPL or ATPL license for verification.' };
  if (days < 0) return { impact: 'License expired. All flying privileges suspended.', action: 'Contact CAAP immediately for license renewal.' };
  if (days <= 90) return { impact: 'License valid but renewal window approaching.', action: 'Begin renewal paperwork to avoid operational gaps.' };
  return { impact: 'License valid. All ratings and privileges current.', action: 'No action required. Monitor upcoming recurrencies.' };
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08, delayChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 24, scale: 0.96, filter: 'blur(8px)' },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  },
};

const cardGlow = (type: 'license' | 'medical' | 'english' | 'radio') => {
  const colors = {
    license:  'rgba(16,185,129,0.08)',
    medical:  'rgba(56,189,248,0.08)',
    english:  'rgba(168,162,158,0.06)',
    radio:    'rgba(16,185,129,0.08)',
  };
  return colors[type] || colors.license;
};

const ProfileField: React.FC<{
  label: string;
  value: string | null;
  icon: React.ElementType;
  verified: boolean;
  expired?: boolean;
}> = ({ label, value, icon: Icon, verified, expired }) => {
  return (
    <div className={`rounded-xl p-3.5 border backdrop-blur-sm transition-all ${
      expired
        ? 'bg-red-500/[0.04] border-red-500/15'
        : verified
          ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]'
          : 'bg-white/[0.01] border-white/[0.04]'
    }`}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5 min-w-0 flex-1">
          <div className="p-1.5 rounded-lg bg-white/5 border border-white/[0.08] flex-shrink-0">
            <Icon size={13} className={expired ? 'text-red-400' : verified ? 'text-white/40' : 'text-white/20'} />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-wider">{label}</p>
            <p className={`text-xs font-bold truncate ${expired ? 'text-red-300' : verified ? 'text-white/80' : 'text-white/25'}`}>
              {value ?? '—'}
            </p>
          </div>
        </div>
        {expired ? (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0 ml-1">EXPIRED</span>
        ) : verified ? (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 ml-1">VERIFIED</span>
        ) : (
          <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-white/5 text-white/25 border border-white/10 flex-shrink-0 ml-1">MISSING</span>
        )}
      </div>
    </div>
  );
};

const CountdownCard: React.FC<{
  title: string;
  subtitle: string;
  expiry: string | null | undefined;
  type: 'license' | 'medical' | 'english' | 'radio';
}> = ({ title, subtitle, expiry, type }) => {
  const days = daysUntil(expiry);
  const st = statusColor(days);
  const guidance = pilotAction(days, type);

  const statusDot = days === null ? 'bg-white/20' : days < 0 ? 'bg-red-500' : days <= 30 ? 'bg-amber-500' : days <= 90 ? 'bg-sky-400' : 'bg-emerald-500';
  const statusBg = days === null ? 'bg-white/5 text-white/25 border-white/10' : days < 0 ? 'bg-red-500/10 text-red-400 border-red-500/20' : days <= 30 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : days <= 90 ? 'bg-sky-400/10 text-sky-400 border-sky-400/20' : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';

  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-2xl p-4 transition-all hover:-translate-y-0.5"
      style={{
        background: 'linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(0,0,0,0.35) 100%)',
        border: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(14px)',
        WebkitBackdropFilter: 'blur(14px)',
        boxShadow: '0 8px 32px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.04)',
      }}
    >
      {/* Header row */}
      <div className="flex items-start justify-between mb-3">
        <div className="min-w-0 flex-1">
          <p className="text-[9px] font-black text-white/30 uppercase tracking-[0.2em] leading-tight">{subtitle}</p>
          <p className="text-[12px] font-black text-red-500 truncate leading-tight mt-1">{title}</p>
        </div>
        <span className={`text-[9px] font-black px-2 py-0.5 rounded-full border flex-shrink-0 ml-2 ${statusBg}`}>
          <span className={`inline-block w-1 h-1 rounded-full mr-1 ${statusDot}`} />
          {st.statusText}
        </span>
      </div>

      {/* Days + date */}
      <div className="mb-3">
        <p className="text-lg font-black text-white leading-none">{statusLabel(days)}</p>
        <p className="text-[10px] text-white/30 mt-1">{expiry ? `Expires ${fmtDate(expiry)}` : 'No expiry date on file'}</p>
      </div>

      {/* Compact guidance row */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div
          className="rounded-lg p-2"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mb-0.5">Status</p>
          <p className="text-[10px] text-white/60 leading-snug line-clamp-2">{guidance.impact}</p>
        </div>
        <div
          className="rounded-lg p-2"
          style={{ background: 'rgba(0,0,0,0.35)', border: '1px solid rgba(255,255,255,0.06)' }}
        >
          <p className="text-[8px] font-black text-white/30 uppercase tracking-wider mb-0.5">Report</p>
          <p className="text-[10px] text-white/60 leading-snug line-clamp-2">{guidance.action}</p>
        </div>
      </div>
    </motion.div>
  );
};

// ─── MOCK DATA FOR DEMO ───
const MOCK_PROFILE: Record<string, unknown> = {
  subscription_tier: 'free',
  verified_account: false,
  total_flight_hours: 487,
  pic_hours: 312,
  night_hours: 58,
  last_flown: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(), // 12 days ago
  license_type: 'Commercial Pilot License (CPL)',
  license_expiry: new Date(Date.now() + 820 * 24 * 60 * 60 * 1000).toISOString(), // ~2.2 years
  medical_class: '1',
  medical_expiry: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), // 45 days
  english_proficiency: 'Level 5 (ICAO)',
  radio_license_expiry: new Date(Date.now() + 920 * 24 * 60 * 60 * 1000).toISOString(),
  ratings: 'Instrument Rating (IR),Multi-Engine Rating (ME),Flight Instructor (CFI)',
  role: 'pilot',
};

const MOCK_WALLET_CHECKS: WalletCheck[] = [
  { credential_type: 'License', status: 'verified', expiry_date: new Date(Date.now() + 820 * 24 * 60 * 60 * 1000).toISOString(), verified_at: new Date().toISOString() },
  { credential_type: 'Medical', status: 'verified', expiry_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString(), verified_at: new Date().toISOString() },
  { credential_type: 'English Proficiency', status: 'verified', expiry_date: undefined, verified_at: new Date().toISOString() },
  { credential_type: 'Radio Telephony', status: 'verified', expiry_date: new Date(Date.now() + 920 * 24 * 60 * 60 * 1000).toISOString(), verified_at: new Date().toISOString() },
  { credential_type: 'Type Rating — A320', status: 'pending', expiry_date: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString() },
  { credential_type: 'Logbook Cross-Check', status: 'pending', expiry_date: undefined },
  { credential_type: 'Previous Medical', status: 'expired', expiry_date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(), verified_at: new Date(Date.now() - 425 * 24 * 60 * 60 * 1000).toISOString() },
];

const MOCK_CREDENTIALS: Credential[] = [
  { credential_type: 'License', status: 'verified', issued_at: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(), expiry_date: new Date(Date.now() + 820 * 24 * 60 * 60 * 1000).toISOString() },
  { credential_type: 'Medical', status: 'verified', issued_at: new Date(Date.now() - 320 * 24 * 60 * 60 * 1000).toISOString(), expiry_date: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000).toISOString() },
  { credential_type: 'Radio', status: 'verified', issued_at: new Date(Date.now() - 500 * 24 * 60 * 60 * 1000).toISOString(), expiry_date: new Date(Date.now() + 920 * 24 * 60 * 60 * 1000).toISOString() },
];

export const VerificationRecurrencyTab: React.FC<Props> = ({
  profile: realProfile,
  walletChecks: realWalletChecks,
  credentials: realCredentials,
  setTab,
  onNavigate,
}) => {
  // Always show mock/demo data for this page
  const [folded, setFolded] = useState(true);
  const [selectedRating, setSelectedRating] = useState<null | { code: string; name: string; expiry: string; status: string; hours: number }>(null);
  const [subTab, setSubTab] = useState<'verification' | 'ai-tools' | 'pathways'>('verification');
  const [reportOpen, setReportOpen] = useState(false);
  const [docPopupOpen, setDocPopupOpen] = useState(false);

  const profile = MOCK_PROFILE;
  const walletChecks = MOCK_WALLET_CHECKS;
  const credentials = MOCK_CREDENTIALS;

  const baseUrl = typeof window !== 'undefined' ? window.location.origin : '';
  const returnUrl = `${baseUrl}/get-started`;
  const cancelUrl = `${baseUrl}/platform?tab=verification&checkout=cancelled`;
  const dodoCheckoutUrl = `https://checkout.dodopayments.com/buy/pdt_0NhgDLaiGjWD45S1gJmng?return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`;

  const isPlus =
    profile?.subscription_tier === 'plus' ||
    profile?.subscription_tier === 'enterprise' ||
    profile?.verified_account === true;

  const totalHours = (profile?.total_flight_hours as number) || 0;
  const lastFlown = (profile?.last_flown as string) || null;
  const lastFlownDays = lastFlown ? daysUntil(lastFlown) : null;
  const licenseType = (profile?.license_type as string) || '—';
  const licenseExpiry = (profile?.license_expiry as string) || null;
  const medicalClass = (profile?.medical_class as string) || '—';
  const medicalExpiry = (profile?.medical_expiry as string) || null;
  const englishLevel = (profile?.english_proficiency as string) || '—';
  const radioExpiry = (profile?.radio_license_expiry as string) || null;
  const ratings = ((profile?.ratings as string) || '').split(',').filter(Boolean);

  // Derive credential statuses from walletChecks + credentials
  const credMap: Record<string, { status: string; expiry?: string; days?: number }> = {};
  walletChecks.forEach((w) => {
    const type = String(w.credential_type || '').toLowerCase();
    const days = w.expiry_date ? daysUntil(w.expiry_date) : undefined;
    credMap[type] = { status: w.status || 'unknown', expiry: w.expiry_date, days };
  });
  credentials.forEach((c) => {
    const type = String(c.credential_type || '').toLowerCase();
    const days = c.expiry_date ? daysUntil(c.expiry_date) : undefined;
    if (!credMap[type]) credMap[type] = { status: c.status || 'unknown', expiry: c.expiry_date, days };
  });

  const licenseStatus = credMap['license'] || { status: licenseExpiry ? 'unknown' : 'missing' };
  const medicalStatus = credMap['medical'] || { status: medicalExpiry ? 'unknown' : 'missing' };
  const elpStatus = credMap['english_proficiency'] || credMap['elp'] || { status: 'unknown' };
  const radioStatus = credMap['radio'] || { status: radioExpiry ? 'unknown' : 'missing' };

  const alerts: { severity: 'critical' | 'warning' | 'info'; message: string; action: string; onClick?: () => void }[] = [];

  if (medicalStatus.days !== null && medicalStatus.days < 0) {
    alerts.push({
      severity: 'critical',
      message: `Class ${medicalClass} Medical expired ${Math.abs(medicalStatus.days)} days ago. Your license is invalid for commercial operations.`,
      action: 'Schedule Renewal',
      onClick: () => onNavigate('/get-started/verify-apc'),
    });
  } else if (medicalStatus.days !== null && medicalStatus.days <= 30) {
    alerts.push({
      severity: 'warning',
      message: `Medical expires in ${medicalStatus.days} days.`,
      action: 'Renew Now',
    });
  }

  if (licenseStatus.days !== null && licenseStatus.days <= 90 && licenseStatus.days >= 0) {
    alerts.push({ severity: 'info', message: `License expires in ${licenseStatus.days} days.`, action: 'View Details' });
  }

  const verifiedCount = walletChecks.filter((w) => w.status === 'verified').length;
  const pendingCount = walletChecks.filter((w) => w.status === 'pending').length;
  const expiredCount = walletChecks.filter((w) => w.status === 'expired').length;

  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <>
      {/* ═══════════════════════════════════════════════════
          HERO — Full-width cinematic hero for Recognition+
      ═══════════════════════════════════════════════════ */}
      <section
        ref={heroRef}
        className="relative flex items-center justify-center overflow-hidden"
        style={{
          minHeight: 'clamp(320px, 50vh, 480px)',
          width: '100vw',
          left: '50%',
          transform: 'translateX(-50%)',
        }}
      >
        {/* Background image with dark overlay */}
        <img
          src="/universal-pilot-gap.jpg"
          alt="Universal pilot gap"
          className="absolute w-full h-full object-cover"
          style={{ top: 0, left: 0, right: 0, bottom: 0 }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(2,6,23,0.55) 0%, rgba(2,6,23,0.70) 40%, rgba(2,6,23,0.88) 100%)',
          }}
        />

        {/* Hero content */}
        <div className="relative z-10 flex flex-col items-center text-center px-6 max-w-5xl mx-auto w-full">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={heroInView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className="w-full"
          >
            {/* Label */}
            <p className="text-sm font-black tracking-[0.25em] uppercase mb-3">
              <span className="text-white">RECOGNITION</span><span className="text-red-400">+</span>
            </p>

            {/* Massive headline */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white tracking-tighter leading-[0.9] mb-4">
              VERIFICATION
              <span className="block text-transparent bg-clip-text"
                style={{
                  backgroundImage: 'linear-gradient(135deg, #fbbf24 0%, #f59e0b 50%, #ea580c 100%)',
                }}
              >
                & RECURRENCY
              </span>
            </h1>

            {/* Subhead */}
            <p className="text-sm sm:text-base text-slate-300 font-light tracking-wide max-w-xl mx-auto mb-6 leading-relaxed">
              Your license is your leverage. Track expiry, verify credentials, and stay
              cleared to fly — all in one place.
            </p>

            {/* Status badges */}
            <div className="flex flex-wrap items-center justify-center gap-3">
              {verifiedCount > 0 && (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-black backdrop-blur-sm">
                  <CheckCircle2 size={14} /> {verifiedCount} Verified
                </span>
              )}
              {pendingCount > 0 && (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-black backdrop-blur-sm">
                  <Clock size={14} /> {pendingCount} Pending
                </span>
              )}
              {expiredCount > 0 && (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-black backdrop-blur-sm">
                  <AlertTriangle size={14} /> {expiredCount} Expired
                </span>
              )}
              {verifiedCount === 0 && pendingCount === 0 && expiredCount === 0 && (
                <span className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/40 text-xs font-black backdrop-blur-sm">
                  <ShieldCheck size={14} /> No credentials on file
                </span>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      <motion.div
        className="max-w-5xl mx-auto px-6 pt-8 pb-16 space-y-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >

      {/* ─── CRITICAL ALERTS ─── */}
      {alerts.length > 0 && (
        <motion.div variants={itemVariants} className="space-y-3">
          {alerts.map((a, i) => (
            <div
              key={i}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded-2xl px-5 py-4 border ${
                a.severity === 'critical'
                  ? 'bg-red-500/5 border-red-500/20'
                  : a.severity === 'warning'
                    ? 'bg-amber-500/5 border-amber-500/20'
                    : 'bg-sky-500/5 border-sky-500/20'
              }`}
            >
              <div className="flex items-start gap-3">
                {a.severity === 'critical' && <AlertTriangle size={18} className="text-red-400 mt-0.5 flex-shrink-0" />}
                {a.severity === 'warning' && <AlertCircle size={18} className="text-amber-400 mt-0.5 flex-shrink-0" />}
                {a.severity === 'info' && <ShieldCheck size={18} className="text-sky-400 mt-0.5 flex-shrink-0" />}
                <p
                  className={`text-sm font-bold leading-relaxed ${
                    a.severity === 'critical' ? 'text-red-300' : a.severity === 'warning' ? 'text-amber-300' : 'text-sky-300'
                  }`}
                >
                  {a.message}
                </p>
              </div>
              {a.action && (
                <button
                  onClick={a.onClick}
                  className={`flex-shrink-0 px-4 py-2 rounded-xl text-[11px] font-black tracking-wide transition-all hover:brightness-110 ${
                    a.severity === 'critical'
                      ? 'bg-red-600 text-white'
                      : a.severity === 'warning'
                        ? 'bg-amber-600 text-white'
                        : 'bg-sky-600 text-white'
                  }`}
                >
                  {a.action}
                </button>
              )}
            </div>
          ))}
        </motion.div>
      )}

      {/* ─── GET STARTED WITH VERIFICATION (FOLDABLE) ─── */}
      <motion.div variants={itemVariants} className="rounded-2xl border border-white/20 bg-red-600 overflow-hidden shadow-lg shadow-red-600/20">
        <button
          onClick={() => setFolded(!folded)}
          className="w-full flex items-center justify-between px-6 sm:px-8 py-5 text-left hover:bg-red-700 transition-colors"
        >
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black tracking-[0.2em] text-white uppercase">Get Started</p>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              Your verification dashboard keeps you <span className="text-white/90">cleared to fly.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:block text-[10px] font-black tracking-wide text-red-600 px-4 py-2 rounded-full bg-white hover:bg-white/90 transition-colors">
              {folded ? 'Expand to learn more →' : 'Click to fold ↑'}
            </span>
            {folded ? (
              <ChevronDown size={18} className="text-white/40 sm:hidden" />
            ) : (
              <ChevronUp size={18} className="text-white/40 sm:hidden" />
            )}
          </div>
        </button>

        {!folded && (
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="max-w-lg">
                <p className="text-sm text-white/80 leading-relaxed">
                  Upload your credentials once. We track expiry dates, send renewal alerts, and share
                  your verified status with airlines looking for ready-to-hire pilots.
                </p>
              </div>
              <a
                href={dodoCheckoutUrl}
                className="flex-shrink-0 px-6 py-3 rounded-full bg-white hover:bg-white/90 text-red-600 text-[11px] font-black tracking-wide transition-all shadow-lg inline-flex items-center no-underline"
              >
                START VERIFICATION →
              </a>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              {[
                {
                  step: '01',
                  icon: Upload,
                  title: 'Upload Credentials',
                  desc: 'License, medical, radio, and English proficiency certificates.',
                },
                {
                  step: '02',
                  icon: ShieldCheck,
                  title: 'Authority Check',
                  desc: 'We cross-reference with CAAP, FAA, or your issuing authority.',
                },
                {
                  step: '03',
                  icon: CheckCircle2,
                  title: 'Stay Compliant',
                  desc: 'Get alerts before expiry and keep your profile airline-ready.',
                },
              ].map((s, i) => (
                <div key={i} className="relative rounded-xl p-5 bg-white/10 backdrop-blur-sm border border-white/20">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-white/40">{s.step}</span>
                    <div className="p-2 rounded-lg bg-white/10">
                      <s.icon size={14} className="text-white" />
                    </div>
                  </div>
                  <p className="text-sm font-black text-white mb-1">{s.title}</p>
                  <p className="text-[11px] text-white/60 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/20">
              <p className="text-[10px] font-black tracking-[0.15em] text-white/60 uppercase mb-4">What you unlock</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Globe, text: 'Internationally shareable verified status' },
                  { icon: TrendingUp, text: 'Priority ranking in airline searches' },
                  { icon: Clock, text: 'Automated 90/30/7 day expiry alerts' },
                  { icon: FileCheck, text: 'Batch verification for ATOs & flight schools' },
                  { icon: AlertTriangle, text: 'One-glance compliance health dashboard' },
                  { icon: ShieldCheck, text: 'Airline pre-clearance without paper chase' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-white/10 backdrop-blur-sm border border-white/20">
                    <item.icon size={14} className="text-white flex-shrink-0" />
                    <span className="text-[11px] font-bold text-white/80">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </motion.div>

      {/* ─── SUB-TABS ─── */}
      <div className="flex gap-1 mb-6 bg-white/[0.04] border border-white/[0.08] rounded-xl p-1">
        <button
          onClick={() => setSubTab('verification')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-[11px] font-black tracking-wide transition-all ${
            subTab === 'verification'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
          }`}
        >
          Verification & Recurrency
        </button>
        <button
          onClick={() => setSubTab('pathways')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-[11px] font-black tracking-wide transition-all ${
            subTab === 'pathways'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
          }`}
        >
          Exclusive Pathways
        </button>
        <button
          onClick={() => setSubTab('ai-tools')}
          className={`flex-1 px-4 py-2.5 rounded-lg text-[11px] font-black tracking-wide transition-all ${
            subTab === 'ai-tools'
              ? 'bg-red-600 text-white shadow-lg shadow-red-600/20'
              : 'text-white/40 hover:text-white/70 hover:bg-white/[0.04]'
          }`}
        >
          Recognition AI
        </button>
      </div>

      {subTab === 'verification' && (
        <>
          {/* ─── RECOGNITION+ UPSELL CARD ─── */}
          {!isPlus && (
            <motion.div variants={itemVariants} className="rounded-2xl bg-white border border-white/10 shadow-2xl overflow-hidden">
              <div className="flex flex-col md:flex-row">
                {/* Left: Text content */}
                <div className="flex-1 p-6 sm:p-8">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-sm font-black text-slate-900 tracking-tight">PR<sup className="text-[9px]">®</sup></span>
                    <span className="text-[10px] font-black tracking-[0.15em] text-red-500 uppercase">Recognition+</span>
                    <span className="text-[10px] font-bold text-slate-400">— Verification & Recurrency</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
                    Stay compliant and <span className="text-red-600">never miss a deadline.</span>
                  </h2>
                  <p className="text-sm text-slate-500 max-w-lg leading-relaxed mb-6">
                    Automated credential tracking, expiry alerts, and recurrency reminders. Verified profiles get
                    priority pathway access and are visible to airline recruiters looking for cleared-to-hire pilots.
                  </p>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <button
                      onClick={() => onNavigate('/recognition-plus')}
                      className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black tracking-wide transition-all shadow-lg shadow-red-600/20"
                    >
                      GET RECOGNITION+ →
                    </button>
                    <button
                      onClick={() => onNavigate('/recognition-plus/free')}
                      className="text-[11px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                    >
                      Skip to get started →
                    </button>
                  </div>
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <p className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                      matching pilot career profiles at <span className="text-red-600">pilotcareerpathways.com</span>
                    </p>
                    <button
                      onClick={() => onNavigate('https://pilotcareerpathways.com')}
                      className="px-8 py-2.5 rounded-full text-[11px] font-black tracking-wider text-white transition-all hover:brightness-110 w-full sm:w-auto"
                      style={{ background: '#dc2626' }}
                    >
                      Learn more →
                    </button>
                  </div>
                </div>

                {/* Right: Photo with left gradient fade into white */}
                <div className="relative hidden md:block w-64 lg:w-80 flex-shrink-0">
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: 'url(/verified.png)' }}
                  />
                  {/* Left gradient fade into white */}
                  <div
                    className="absolute inset-y-0 left-0 w-24"
                    style={{
                      background: 'linear-gradient(to right, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.3) 70%, transparent 100%)',
                    }}
                  />
                </div>
              </div>
            </motion.div>
          )}

          {/* ─── CREDENTIAL COUNTDOWNS ─── */}
          <motion.div variants={itemVariants}>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase">Learn more about Recognition+</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CountdownCard
            title={licenseType}
            subtitle="Pilot License"
            expiry={licenseExpiry}
            type="license"
          />
          <CountdownCard
            title={`Class ${medicalClass}`}
            subtitle="Medical Certificate"
            expiry={medicalExpiry}
            type="medical"
          />
          <CountdownCard
            title={englishLevel}
            subtitle="English Proficiency"
            expiry={undefined}
            type="english"
          />
          <CountdownCard
            title="Radio Telephony"
            subtitle="NTC / Authority License"
            expiry={radioExpiry}
            type="radio"
          />
        </div>

        {/* View Full Report CTA */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setReportOpen(true)}
            className="px-8 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black tracking-wide transition-all shadow-lg shadow-red-600/20"
          >
            View Full Report →
          </button>
        </div>
      </motion.div>

      {/* ─── BATCH OPERATIONS (ATO / Enterprise) ─── */}
      {(profile?.role === 'ato_admin' || profile?.role === 'enterprise' || profile?.subscription_tier === 'enterprise') && (
        <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} className="text-white/40" />
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Batch Operations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Verify Student Batch', desc: 'Submit alumni logbooks for verification', count: 0 },
              { label: 'Pending Reviews', desc: 'Awaiting authority response', count: pendingCount },
              { label: 'Completed This Month', desc: 'Successfully verified', count: verifiedCount },
            ].map((b) => (
              <div key={b.label} className="rounded-xl p-4 bg-slate-950/40 backdrop-blur-sm border border-white/5">
                <p className="text-lg font-black text-white">{b.count}</p>
                <p className="text-xs font-bold text-white/60 mt-1">{b.label}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('/admin/verification')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
          >
            <Upload size={14} className="text-white/40" />
            <span className="text-xs font-bold text-white/60">Open Verification Management</span>
            <ChevronRight size={14} className="text-white/20" />
          </button>
        </motion.div>
      )}

      {/* ─── TYPE RATINGS & ENDORSEMENTS ─── */}
      <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <Award size={16} className="text-white/40" />
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Type Ratings & Endorsements</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-white/40">FTL Compliant</span>
            <span className="w-2 h-2 rounded-full bg-amber-500 ml-2" />
            <span className="text-[10px] text-white/40">Review Due</span>
          </div>
        </div>

        {/* Header row */}
        <div className="hidden md:grid grid-cols-12 gap-4 px-4 py-2 text-[9px] font-black tracking-wider text-white/25 uppercase">
          <TooltipCol label="Rating" tip="Type rating or endorsement held on your license (e.g., IR = Instrument Rating, ME = Multi-Engine)." />
          <TooltipCol label="Status" tip="Current validity of the rating. 'Current' means valid; 'Review Due' means recurrency action is required." />
          <TooltipCol label="Next CAA Check" tip="The next mandatory check required by the Civil Aviation Authority (e.g., Proficiency Check, LPC, OPC, FIRC)." />
          <TooltipCol label="Latest Flight" tip="The most recent flight logged under this specific rating or endorsement." />
          <TooltipCol label="FTL Compliance" tip="Flight Time Limitations — hours flown vs. maximum allowed in the current regulatory period (typically 28 or 90 days)." />
          <div className="col-span-2 text-right">Action</div>
        </div>

        {/* Data rows */}
        {[
          {
            code: 'IR',
            name: 'Instrument Rating',
            expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'current',
            hours: 89,
            lastFlight: '12 Jun 2026',
            lastFlightHours: 2.4,
            ftlUsed: 18,
            ftlLimit: 100,
            ftlPeriod: '28 days',
            caaCheck: 'Proficiency Check',
            nextCheckDate: new Date(Date.now() + 165 * 24 * 60 * 60 * 1000).toISOString(),
            recurrency: '6 instrument approaches, holding procedures, and 3 hours under actual or simulated IFR within preceding 6 months (FAR 61.57(c)).',
          },
          {
            code: 'ME',
            name: 'Multi-Engine Rating',
            expiry: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'current',
            hours: 124,
            lastFlight: '25 Jun 2026',
            lastFlightHours: 2.5,
            ftlUsed: 32,
            ftlLimit: 100,
            ftlPeriod: '28 days',
            caaCheck: 'LPC + OPC',
            nextCheckDate: new Date(Date.now() + 380 * 24 * 60 * 60 * 1000).toISOString(),
            recurrency: 'Proficiency check or training flight in multi-engine aircraft within preceding 12 months. Vmc demo and engine-out procedures must be current.',
          },
          {
            code: 'CFI',
            name: 'Flight Instructor',
            expiry: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(),
            status: 'review',
            hours: 312,
            lastFlight: '28 Jun 2026',
            lastFlightHours: 3.2,
            ftlUsed: 45,
            ftlLimit: 100,
            ftlPeriod: '28 days',
            caaCheck: 'FIRC + Practical Test',
            nextCheckDate: new Date(Date.now() + 195 * 24 * 60 * 60 * 1000).toISOString(),
            recurrency: 'Renewal due every 24 months via FIRC (Flight Instructor Refresher Course) or practical test. Must log 15 hours of flight instruction within preceding 12 months.',
          },
        ].map((r) => {
          const d = daysUntil(r.expiry);
          const checkDays = daysUntil(r.nextCheckDate);
          const isReview = r.status === 'review';
          const ftlPct = Math.round((r.ftlUsed / r.ftlLimit) * 100);
          const ftlWarning = ftlPct >= 80;
          return (
            <div
              key={r.code}
              className="rounded-xl p-4 md:px-4 md:py-3 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.03] mb-2"
            >
              {/* Mobile: stacked layout */}
              <div className="md:hidden space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-lg font-black text-white">{r.code}</p>
                    <p className="text-xs font-bold text-white/70">{r.name}</p>
                  </div>
                  {isReview ? (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">REVIEW DUE</span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CURRENT</span>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-2 text-[11px]">
                  <div className="rounded-lg p-2 bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">Next CAA Check</p>
                    <p className="text-white font-bold">{r.caaCheck}</p>
                    <p className={`text-[10px] ${checkDays !== null && checkDays <= 30 ? 'text-amber-400' : 'text-white/40'}`}>
                      {checkDays !== null ? `${checkDays} days` : '—'}
                    </p>
                  </div>
                  <div className="rounded-lg p-2 bg-white/[0.03] border border-white/[0.06]">
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">Latest Flight</p>
                    <p className="text-white font-bold">{r.lastFlight}</p>
                    <p className="text-white/40 text-[10px]">{r.lastFlightHours}h logged</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-white/30 text-[9px] uppercase tracking-wider">FTL — {r.ftlPeriod}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                        <div
                          className={`h-full rounded-full ${ftlWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                          style={{ width: `${ftlPct}%` }}
                        />
                      </div>
                      <span className={`text-[10px] font-bold ${ftlWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {r.ftlUsed}/{r.ftlLimit}h
                      </span>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedRating(r)}
                    className="px-4 py-2 rounded-lg text-[10px] font-black text-white transition-all hover:brightness-110"
                    style={{ background: isReview ? '#d97706' : '#059669' }}
                  >
                    {isReview ? 'Action Required →' : 'Details →'}
                  </button>
                </div>
              </div>

              {/* Desktop: row layout */}
              <div className="hidden md:grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2">
                  <p className="text-lg font-black text-white">{r.code}</p>
                  <p className="text-[11px] font-bold text-white/60">{r.name}</p>
                </div>
                <div className="col-span-2">
                  {isReview ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                      REVIEW DUE
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-black px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      CURRENT
                    </span>
                  )}
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-white">{r.caaCheck}</p>
                  <p className={`text-[10px] ${checkDays !== null && checkDays <= 30 ? 'text-amber-400 font-bold' : 'text-white/40'}`}>
                    {checkDays !== null ? `${checkDays} days remaining` : '—'}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-[11px] font-bold text-white">{r.lastFlight}</p>
                  <p className="text-[10px] text-white/40">{r.lastFlightHours}h logged</p>
                </div>
                <div className="col-span-2">
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-1.5 rounded-full bg-white/10 overflow-hidden">
                      <div
                        className={`h-full rounded-full ${ftlWarning ? 'bg-amber-500' : 'bg-emerald-500'}`}
                        style={{ width: `${ftlPct}%` }}
                      />
                    </div>
                    <span className={`text-[10px] font-black ${ftlWarning ? 'text-amber-400' : 'text-emerald-400'}`}>
                      {r.ftlUsed}/{r.ftlLimit}h
                    </span>
                  </div>
                  <p className="text-[9px] text-white/30 mt-0.5">{r.ftlPeriod}</p>
                </div>
                <div className="col-span-2 text-right">
                  <button
                    onClick={() => setSelectedRating(r)}
                    className="px-4 py-2 rounded-lg text-[10px] font-black text-white transition-all hover:brightness-110"
                    style={{ background: isReview ? '#d97706' : '#059669' }}
                  >
                    {isReview ? 'Action Required →' : 'Details →'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </motion.div>

      {/* ─── RATING DETAIL MODAL ─── */}
      {selectedRating && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => setSelectedRating(null)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-md rounded-2xl border border-white/[0.08] overflow-hidden"
            style={{
              background: 'linear-gradient(165deg, rgba(15,23,42,0.98) 0%, rgba(2,6,23,0.98) 100%)',
              boxShadow: '0 24px 64px -16px rgba(0,0,0,0.6), inset 0 1px 0 0 rgba(255,255,255,0.06)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top accent */}
            <div className="absolute top-0 left-0 right-0 h-1"
              style={{
                background: selectedRating.status === 'review'
                  ? 'linear-gradient(90deg, #d97706, #f59e0b)'
                  : 'linear-gradient(90deg, #059669, #10b981)',
              }}
            />

            {/* Header */}
            <div className="px-6 pt-6 pb-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg text-white"
                    style={{ background: selectedRating.status === 'review' ? 'rgba(217,119,6,0.15)' : 'rgba(5,150,105,0.15)' }}
                  >
                    {selectedRating.code}
                  </div>
                  <div>
                    <p className="text-sm font-black text-white">{selectedRating.name}</p>
                    <p className="text-[10px] text-white/40 uppercase tracking-wider">
                      {selectedRating.status === 'review' ? 'Recurrency Action Required' : 'Current & Valid'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="p-2 rounded-lg hover:bg-white/10 transition-colors"
                >
                  <X size={16} className="text-white/40" />
                </button>
              </div>

              {/* Quick stats row */}
              <div className="grid grid-cols-2 gap-3 mb-4">
                <div className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[9px] font-black text-white/25 uppercase tracking-wider mb-1">Days Until Renewal</p>
                  <p className={`text-lg font-black ${selectedRating.status === 'review' ? 'text-amber-400' : 'text-emerald-400'}`}>
                    {daysUntil(selectedRating.expiry) ?? '—'}
                  </p>
                </div>
                <div className="rounded-xl p-3 bg-white/[0.03] border border-white/[0.06]">
                  <p className="text-[9px] font-black text-white/25 uppercase tracking-wider mb-1">Hours Logged</p>
                  <p className="text-lg font-black text-white">{selectedRating.hours}</p>
                </div>
              </div>

              {/* Recurrency requirements */}
              <div className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.06] mb-4">
                <p className="text-[9px] font-black text-white/30 uppercase tracking-wider mb-2">Recurrency Requirements</p>
                <p className="text-[12px] text-white/70 leading-relaxed">{selectedRating.recurrency}</p>
              </div>

              {/* Action buttons */}
              <div className="flex flex-col gap-2">
                <button
                  onClick={() => onNavigate('/about-verification')}
                  className="w-full py-3 rounded-xl text-[11px] font-black tracking-wide text-white transition-all hover:brightness-110"
                  style={{ background: selectedRating.status === 'review' ? '#d97706' : '#059669' }}
                >
                  {selectedRating.status === 'review' ? 'Schedule Recurrency Check →' : 'Log Training Flight →'}
                </button>
                <button
                  onClick={() => setSelectedRating(null)}
                  className="w-full py-2.5 rounded-xl text-[11px] font-bold text-white/40 hover:text-white/60 hover:bg-white/5 transition-all"
                >
                  Close
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── TRAINING CURRENCY ─── */}
      <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Training Currency</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[
            {
              id: 'ifr',
              category: 'Instrument Currency',
              title: 'IFR Recency',
              provider: 'WCC Aviation — Cessna 172S',
              lastDone: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: new Date(Date.now() + 78 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'current',
              detail: '6 approaches, 2 holds, intercept & tracking',
              instructor: 'Capt. Reyes, CFI-I',
            },
            {
              id: 'bfr',
              category: 'Flight Review',
              title: 'Biennial Flight Review',
              provider: 'WCC Aviation Flight School',
              lastDone: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: new Date(Date.now() + 550 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'current',
              detail: 'Aircraft: Cessna 172 | Oral + flight portion complete',
              instructor: 'Capt. Dela Cruz, CFI',
            },
            {
              id: 'type',
              category: 'Type Rating Recurrency',
              title: 'B737 NG LPC',
              provider: 'CAE Aviation Training Centre',
              lastDone: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'warning',
              detail: 'License Proficiency Check — next OPC due',
              instructor: 'CAE Instructor #4821',
            },
            {
              id: 'night',
              category: 'Landing Currency',
              title: 'Night Landing Recency',
              provider: 'WCC Aviation — Cessna 172',
              lastDone: new Date(Date.now() - 65 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'warning',
              detail: '3 full-stop night landings required within 90 days',
              instructor: 'Solo — logged via MyFlightBook',
            },
            {
              id: 'se',
              category: 'Endorsement',
              title: 'High Performance / Complex',
              provider: 'WCC Aviation',
              lastDone: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: null,
              status: 'current',
              detail: 'One-time endorsement — no expiry. Last training: PA-28R Arrow.',
              instructor: 'Capt. Santos, MEI',
            },
            {
              id: 'crm',
              category: 'Airline Prep',
              title: 'CRM / Human Factors',
              provider: 'PilotRecognition Foundation Program',
              lastDone: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
              nextDue: new Date(Date.now() + 320 * 24 * 60 * 60 * 1000).toISOString(),
              status: 'current',
              detail: 'Crew Resource Management & Threat Error Management',
              instructor: 'Online — Module 4 of 9',
            },
          ].map((item) => {
            const d = item.nextDue ? daysUntil(item.nextDue) : null;
            const isReview = item.status === 'warning';
            const isExpired = item.status === 'expired';
            return (
              <div
                key={item.id}
                className="group relative rounded-xl p-4 border border-white/[0.06] backdrop-blur-xl transition-all hover:border-white/[0.12] hover:-translate-y-0.5 flex flex-col cursor-pointer"
                style={{
                  background: `linear-gradient(145deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)`,
                  boxShadow: 'inset 0 1px 0 0 rgba(255,255,255,0.04), 0 4px 24px -8px rgba(0,0,0,0.4)',
                }}
                onClick={() => setSelectedRating({
                  code: item.id.toUpperCase(),
                  name: item.title,
                  expiry: item.nextDue || '',
                  status: item.status,
                  hours: 0,
                  recurrency: `${item.detail}\n\nLast completed: ${item.lastDone ? fmtDate(item.lastDone) : '—'}\nTraining provider: ${item.provider}\nInstructor: ${item.instructor}`,
                })}
              >
                {/* Top accent */}
                <div className="absolute top-0 left-4 right-4 h-px"
                  style={{
                    background: isExpired
                      ? 'linear-gradient(90deg, transparent, rgba(239,68,68,0.5), transparent)'
                      : isReview
                        ? 'linear-gradient(90deg, transparent, rgba(245,158,11,0.5), transparent)'
                        : 'linear-gradient(90deg, transparent, rgba(16,185,129,0.5), transparent)',
                  }}
                />

                <div className="flex items-start justify-between mb-2.5">
                  <div className="min-w-0">
                    <p className="text-[9px] font-black text-white/35 uppercase tracking-[0.15em] leading-tight">{item.category}</p>
                    <p className="text-[11px] font-black text-white/90 truncate leading-tight mt-0.5">{item.title}</p>
                  </div>
                  {isExpired ? (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 flex-shrink-0 ml-2">EXPIRED</span>
                  ) : isReview ? (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20 flex-shrink-0 ml-2">ACTION DUE</span>
                  ) : (
                    <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 flex-shrink-0 ml-2">CURRENT</span>
                  )}
                </div>

                <p className="text-[10px] text-white/40 leading-snug mb-3 line-clamp-2">{item.detail}</p>

                <div className="mt-auto space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] text-white/30">{item.provider}</span>
                    <span className="text-[9px] text-white/30">{item.lastDone ? fmtDate(item.lastDone) : '—'}</span>
                  </div>

                  {d !== null && (
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1 rounded-full bg-white/[0.04] overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-700 ${
                            isExpired ? 'bg-red-500' : isReview ? 'bg-amber-500' : 'bg-emerald-500'
                          }`}
                          style={{ width: `${Math.min(100, Math.max(5, (d / 180) * 100))}%` }}
                        />
                      </div>
                      <span className={`text-[9px] font-black ${isExpired ? 'text-red-400' : isReview ? 'text-amber-400' : 'text-emerald-400'}`}>
                        {d < 0 ? `${Math.abs(d)}d ago` : `${d}d left`}
                      </span>
                    </div>
                  )}

                  <button
                    className="w-full py-2 rounded-full text-[10px] font-black tracking-wide text-slate-900 transition-all hover:scale-[1.02] opacity-0 group-hover:opacity-100"
                    style={{
                      background: 'linear-gradient(135deg, #ffffff 0%, #f5f5f5 100%)',
                      boxShadow: '0 2px 12px rgba(255,255,255,0.12), 0 1px 3px rgba(0,0,0,0.08)',
                    }}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedRating({
                        code: item.id.toUpperCase(),
                        name: item.title,
                        expiry: item.nextDue || '',
                        status: item.status,
                        hours: 0,
                        recurrency: `${item.detail}\n\nLast completed: ${item.lastDone ? fmtDate(item.lastDone) : '—'}\nTraining provider: ${item.provider}\nInstructor: ${item.instructor}`,
                      });
                    }}
                  >
                    {isExpired ? 'Renew Now →' : isReview ? 'Schedule Recurrency →' : 'View Details →'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── VERIFICATION STATUS ─── */}
      <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <ShieldCheck size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Verification Status</p>
        </div>
        <div className="space-y-2">
          {[
            { name: 'CAAP CPL License', detail: 'Submitted Oct 24, 2025', status: 'pending', icon: FileCheck },
            { name: 'Class 1 Medical Certificate', detail: 'Verified May 2, 2025', status: 'verified', icon: Stethoscope },
            { name: 'English Proficiency Assessment', detail: 'Verified Aug 12, 2025', status: 'verified', icon: Globe },
            { name: 'NTC Radio License', detail: 'Submitted Aug 5, 2025', status: 'pending', icon: Radio },
            { name: 'Type Rating Certificate — A320', detail: 'Not uploaded', status: 'missing', icon: Award },
            { name: 'Logbook Export (MyFlightBook)', detail: 'Dual log detected — contact ATO', status: 'flagged', icon: TrendingUp, note: 'Right seat hours flagged. Dual entry found in MyFlightBook. Contact your ATO immediately to resolve discrepancy before verification can proceed.' },
          ].map((doc, i) => {
            const Icon = doc.icon;
            const isVerified = doc.status === 'verified';
            const isPending = doc.status === 'pending';
            const isFlagged = doc.status === 'flagged';
            const isMissing = doc.status === 'missing';

            let badgeText = 'VERIFIED';
            let badgeClass = 'bg-emerald-100 text-emerald-700 border-emerald-200';
            if (isPending) { badgeText = 'PENDING'; badgeClass = 'bg-amber-100 text-amber-700 border-amber-200'; }
            if (isFlagged) { badgeText = 'FLAGGED'; badgeClass = 'bg-red-100 text-red-700 border-red-200'; }
            if (isMissing) { badgeText = 'NEARING RECURRENCY'; badgeClass = 'bg-sky-100 text-sky-700 border-sky-200'; }

            return (
              <div key={i} className="space-y-2">
                <div
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border transition-all ${
                    isFlagged
                      ? 'bg-red-50 border-red-200 hover:bg-red-100/60'
                      : 'bg-white border-slate-200 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold truncate text-slate-900">{doc.name}</p>
                    <p className="text-[10px] truncate text-red-500 mt-0.5">{doc.detail}</p>
                  </div>
                  <span className={`text-[10px] font-black px-3 py-1.5 rounded-full border flex-shrink-0 ml-2 ${badgeClass}`}>{badgeText}</span>
                </div>
                {doc.note && (
                  <div className="mx-4 rounded-xl p-3.5 bg-red-500/[0.08] border border-red-500/15 backdrop-blur-sm">
                    <div className="flex items-start gap-2.5">
                      <div className="p-1 rounded-md bg-red-500/10 flex-shrink-0">
                        <AlertTriangle size={12} className="text-red-400" />
                      </div>
                      <div>
                        <p className="text-[10px] font-black text-red-400 uppercase tracking-wider mb-1">ATO Note</p>
                        <p className="text-[11px] text-red-300/80 leading-relaxed">{doc.note}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* ─── VERIFICATION TIMELINE ─── */}
      <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <History size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Verification Timeline</p>
        </div>
        <div className="relative pl-4">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
          {[
            {
              step: '01',
              title: 'Submit Documents & Consent',
              desc: 'You upload your license, medical, and logbook summary — then sign consent and authorization forms giving PilotRecognition.com permission to verify your credentials.',
              icon: FileCheck,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
            {
              step: '02',
              title: 'ATO / Operator Verification',
              desc: 'We contact your ATO or operator directly to cross-reference and verify your flight hours, training records, and instructor sign-offs.',
              icon: Building2,
              color: 'text-sky-400',
              bg: 'bg-sky-500/10',
            },
            {
              step: '03',
              title: 'Authority License Check',
              desc: 'Your pilot license is verified with the designated governing aviation authority (CAAP, FAA, EASA, etc.) to confirm validity, ratings, and standing.',
              icon: ShieldCheck,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
            {
              step: '04',
              title: 'Regulatory Compliance Review',
              desc: 'Regulatory compliance review with aviation bodies takes several weeks. We reconcile any discrepancies and keep you informed throughout.',
              icon: Clock,
              color: 'text-amber-400',
              bg: 'bg-amber-500/10',
            },
            {
              step: '05',
              title: 'Recognition+ Verified Profile',
              desc: 'Once cleared, your profile receives the Recognition+ badge — making you visible to operators, airlines, and cadet programs as a pre-cleared pilot.',
              icon: Award,
              color: 'text-emerald-400',
              bg: 'bg-emerald-500/10',
            },
          ].map((evt, i) => (
            <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
              <div className={`relative z-10 p-2 rounded-lg ${evt.bg} flex-shrink-0`}>
                <evt.icon size={14} className={evt.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-wider">Step {evt.step}</p>
                </div>
                <p className="text-sm font-black text-white mb-1">{evt.title}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{evt.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Planning notice */}
        <div
          className="mt-5 rounded-xl p-4"
          style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.15)' }}
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={16} className="text-red-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-red-400 uppercase tracking-wider mb-1">Plan 3 Months in Advance</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                If you are targeting an exclusive pathway posted by an operator, airline, or cadet program,
                start your Recognition+ verification at least <span className="text-white font-bold">3 months before</span> the application deadline.
                Verified pilots receive priority placement — but regulatory compliance takes time.
              </p>
            </div>
          </div>
        </div>

        {/* After verification — credential & data policy */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.12)' }}
        >
          <div className="flex items-start gap-3">
            <ShieldCheck size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-emerald-400 uppercase tracking-wider mb-1">Verified Credential Issued</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Upon successful verification, the platform issues you a verified credential badge.
                <span className="text-white font-bold"> All uploaded documents are automatically deleted within 30 days.</span>{' '}
                Only your verification status and attestable credential record are retained.
              </p>
            </div>
          </div>
        </div>

        {/* Verification liability & legal binding */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.12)' }}
        >
          <div className="flex items-start gap-3">
            <FileText size={16} className="text-sky-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-sky-400 uppercase tracking-wider mb-1">Verification Liability & Legal Binding</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                PilotRecognition.com holds the contractual framework between your ATO or operator and the platform.
                Your ATO or operator <span className="text-white font-bold">solely attests</span> that your flight hours have been verified against their registry and are true and accurate.
                The platform holds accountability for providing verified pilots access to pathways posted by operators,
                with a legal binding between the ATO, operator, and PilotRecognition to certify your recognition
                and compliance with international aviation standards.
              </p>
            </div>
          </div>
        </div>

        {/* What verified pilots unlock */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.12)' }}
        >
          <div className="flex items-start gap-3">
            <Award size={16} className="text-violet-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-violet-400 uppercase tracking-wider mb-1">What Recognition+ Unlocks</p>
              <p className="text-[11px] text-white/60 leading-relaxed">
                As a verified pilot, you gain access to{' '}
                <span className="text-white font-bold">Recognition AI</span> for career strategy,
                pathway matching with bookmarked airlines, manufacturers for type ratings, and operators posting exclusive cadet programs.
                Connect with fellow pilots on the platform and receive{' '}
                <span className="text-white font-bold">priority placement</span>{' '}
                in pathway pooling posted by operators who specifically seek verified candidates.
              </p>
            </div>
          </div>
        </div>

        {/* Platform disclaimer */}
        <div
          className="mt-4 rounded-xl p-4"
          style={{ background: 'rgba(107,114,128,0.06)', border: '1px solid rgba(107,114,128,0.12)' }}
        >
          <div className="flex items-start gap-3">
            <AlertCircle size={16} className="text-gray-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-wider mb-1">Platform Scope & Liability</p>
              <p className="text-[11px] text-white/50 leading-relaxed">
                PilotRecognition.com is a platform that connects pilots to the aviation industry.
                We are not responsible for job placements, hiring decisions, or any interpersonal conduct between pilots and operators, airlines, flight schools, or type rating centers.
                Any relationship between you and an operator is solely between those parties.
                We provide the recognition, the direction, and the career-aligning AI so you know where you stand,
                what you are missing, and how to network with the industry.
              </p>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ─── BATCH OPERATIONS (ATO / Enterprise) ─── */}
      {(profile?.role === 'ato_admin' || profile?.role === 'enterprise' || profile?.subscription_tier === 'enterprise') && (
        <motion.div variants={itemVariants} className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5">
            <Users size={16} className="text-white/40" />
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Batch Operations</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Verify Student Batch', desc: 'Submit alumni logbooks for verification', count: 0 },
              { label: 'Pending Reviews', desc: 'Awaiting authority response', count: pendingCount },
              { label: 'Completed This Month', desc: 'Successfully verified', count: verifiedCount },
            ].map((b) => (
              <div key={b.label} className="rounded-xl p-4 bg-slate-950/40 border border-white/[0.06]">
                <p className="text-lg font-black text-white">{b.count}</p>
                <p className="text-xs font-bold text-white/60 mt-1">{b.label}</p>
                <p className="text-[11px] text-white/30 mt-0.5">{b.desc}</p>
              </div>
            ))}
          </div>
          <button
            onClick={() => onNavigate('/admin/verification')}
            className="mt-4 w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl bg-white/5 hover:bg-white/10 border border-white/5 hover:border-white/10 transition-all"
          >
            <Upload size={14} className="text-white/40" />
            <span className="text-xs font-bold text-white/60">Open Verification Management</span>
            <ChevronRight size={14} className="text-white/20" />
          </button>
        </motion.div>
      )}

      </>
      )}

      {subTab === 'pathways' && (
        <motion.div variants={itemVariants} className="space-y-8">
          {/* ─── PATHWAYS HEADER ─── */}
          <div className="text-center space-y-3">
            <p className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase">Career Alignment</p>
            <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
              Exclusive Pathways <span className="text-red-400">Matched to You.</span>
            </h2>
            <p className="text-sm text-white/50 max-w-2xl mx-auto leading-relaxed">
              Verified pilots gain priority access to private charter, eVTOL, and corporate aviation pathways. 
              Your Recognition Score travels with you — reducing friction and eliminating placement scams.
            </p>
          </div>

          {/* ─── WHY VERIFIED PILOTS GET HIRED ─── */}
          <div className="rounded-2xl p-6 border border-gray-200 bg-white">
            <div className="flex items-center gap-2 mb-5">
              <ShieldCheck size={16} className="text-gray-400" />
              <p className="text-[10px] font-black tracking-[0.2em] text-gray-400 uppercase">Why Operators Choose Verified Pilots</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {[
                {
                  title: 'Fraud Prevention',
                  desc: 'Operators lose millions to fake credentials. Verified profiles eliminate resume fraud and credential tampering.',
                  icon: FileCheck,
                },
                {
                  title: 'Zero Paper Chase',
                  desc: 'No more chasing PDFs and scans. One verified profile shared with consent replaces endless document requests.',
                  icon: Globe,
                },
                {
                  title: 'Confidential Matching',
                  desc: 'Private jet and charter clients demand discretion. Verified pilots are matched without public exposure.',
                  icon: Briefcase,
                },
                {
                  title: 'Instant Clearance',
                  desc: 'Cleared-to-hire status means operators can pull your profile and extend an offer within hours, not weeks.',
                  icon: Zap,
                },
                {
                  title: 'Portable Recognition',
                  desc: 'Your Recognition Score and verified status travel outside our platform — accepted by partner ATOs and airlines.',
                  icon: Award,
                },
                {
                  title: 'Scam-Free Hiring',
                  desc: 'Placement scams target unverified pilots. Verification creates a trust layer that protects both pilots and operators.',
                  icon: AlertTriangle,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="rounded-xl p-4 bg-gray-50 border border-gray-100 transition-all hover:bg-gray-100 flex flex-col"
                >
                  <div className="flex items-center gap-2 mb-2.5">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                      style={{ background: '#dc2626', border: '1px solid #dc2626' }}
                    >
                      <item.icon size={14} className="text-white" />
                    </div>
                    <p className="text-xs font-black text-gray-900">{item.title}</p>
                  </div>
                  <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* ─── EXCLUSIVE PATHWAY CATEGORIES ─── Glassy Carousel */}
          <div className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
            <div className="flex items-center gap-2 mb-5">
              <Plane size={16} className="text-white/40" />
              <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Exclusive Pathway Categories</p>
            </div>

            {/* Pathway carousel */}
            <div className="relative overflow-hidden py-2">
              <style>{`
                @keyframes pathwayScroll {
                  0% { transform: translateX(0); }
                  100% { transform: translateX(-50%); }
                }
                .pathway-carousel {
                  animation: pathwayScroll 50s linear infinite;
                }
                .pathway-carousel:hover {
                  animation-play-state: paused;
                }
              `}</style>
              <div className="pathway-carousel flex gap-3" style={{ width: 'max-content' }}>
                {[
                  {
                    name: 'Private Jet Charter',
                    type: 'Gulfstream · Falcon · Challenger',
                    img: 'https://images.unsplash.com/photo-1540962351504-03099e0a759b?w=400&h=300&fit=crop&q=80',
                    tag: 'Confidential',
                    tagColor: '#6366f1',
                    grade: 'A',
                    gradeColor: '#6366f1',
                    reqs: { license: 'CPL / ATPL', hours: '2,500+', medical: 'Class 1' },
                    desc: 'Client-confidential placements with ultra-high-net-worth operators.',
                    baseMatch: 94,
                    aiNote: 'Your type-rated profile aligns perfectly with confidential charter demand.',
                  },
                  {
                    name: 'Corporate Aviation',
                    type: 'Fortune 500 Flight Departments',
                    img: 'https://images.unsplash.com/photo-1474302770737-17369821f0a3?w=400&h=300&fit=crop&q=80',
                    tag: 'Direct Hire',
                    tagColor: '#10b981',
                    grade: 'A+',
                    gradeColor: '#10b981',
                    reqs: { license: 'ATPL', hours: '3,000+', medical: 'Class 1' },
                    desc: 'Schedule stability, competitive pay, and global routing networks.',
                    baseMatch: 91,
                    aiNote: 'High hour count makes you a strong candidate for direct-hire corporate roles.',
                  },
                  {
                    name: 'eVTOL & Air Mobility',
                    type: 'Joby · Archer · Lilium',
                    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop&q=80',
                    tag: 'Emerging',
                    tagColor: '#00b4d8',
                    grade: 'B+',
                    gradeColor: '#00b4d8',
                    reqs: { license: 'PPL / CPL', hours: '500+', medical: 'Class 2+' },
                    desc: 'Early-advantage pathways for next-generation urban air mobility.',
                    baseMatch: 87,
                    aiNote: 'Emerging sector — your CPL gives you a first-mover advantage here.',
                  },
                  {
                    name: 'Helicopter VIP',
                    type: 'Offshore · HEMS · VIP Charter',
                    img: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?w=400&h=300&fit=crop&q=80',
                    tag: 'Elite',
                    tagColor: '#a78bfa',
                    grade: 'A-',
                    gradeColor: '#a78bfa',
                    reqs: { license: 'CPL-H', hours: '1,500+', medical: 'Class 1' },
                    desc: 'High-rotation roles in offshore, medical evac, and executive transport.',
                    baseMatch: 82,
                    aiNote: 'Helicopter pathway requires rotary endorsement — consider adding CPL-H.',
                  },
                  {
                    name: 'Type Rating Fast-Track',
                    type: 'Boeing · Airbus · Embraer',
                    img: 'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=400&h=300&fit=crop&q=80',
                    tag: 'High Demand',
                    tagColor: '#f59e0b',
                    grade: 'A',
                    gradeColor: '#f59e0b',
                    reqs: { license: 'ATPL', hours: '1,500+', medical: 'Class 1' },
                    desc: 'Airline-sponsored type rating placements with bonded contracts.',
                    baseMatch: 96,
                    aiNote: 'Excellent match — your ATPL and hour threshold exceed airline minimums.',
                  },
                ].map((pw, i) => {
                  const profileHours = totalHours || 0;
                  const profileLicense = (licenseType || '').toLowerCase();
                  let match = pw.baseMatch;
                  if (profileHours >= 1500) match = Math.min(98, match + 2);
                  if (profileLicense.includes('atpl')) match = Math.min(98, match + 2);
                  return (
                    <div
                      key={i}
                      className="flex-shrink-0 w-[28rem] h-52 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer relative flex"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      {/* Left: Aircraft image */}
                      <div className="relative w-[45%] h-full flex-shrink-0">
                        <img src={pw.img} alt={pw.type} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-y-0 right-0 w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.95))' }} />
                      </div>

                      {/* Right: Glassmorphism pathway data */}
                      <div
                        className="flex-1 h-full p-4 flex flex-col justify-between relative"
                        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                      >
                        {/* Top: Name + tag + grade */}
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-white leading-tight">{pw.name}</p>
                            <p className="text-[10px] text-white/40">{pw.type}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${pw.tagColor}15`, color: pw.tagColor, border: `1px solid ${pw.tagColor}30` }}>
                              {pw.tag}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${pw.gradeColor}15`, color: pw.gradeColor, border: `1px solid ${pw.gradeColor}30` }}>
                              {pw.grade}
                            </span>
                          </div>
                        </div>

                        {/* Middle: Requirements row */}
                        <div className="flex items-center gap-3 mt-2">
                          <div>
                            <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">License</p>
                            <p className="text-[10px] font-bold text-white/70">{pw.reqs.license}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Hours</p>
                            <p className="text-[10px] font-bold text-white/70">{pw.reqs.hours}</p>
                          </div>
                          <div>
                            <p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Medical</p>
                            <p className="text-[10px] font-bold text-white/70">{pw.reqs.medical}</p>
                          </div>
                        </div>

                        {/* Description */}
                        <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2 mt-1">{pw.desc}</p>

                        {/* AI Note */}
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <Sparkles size={10} className="text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[9px] text-amber-400/80 leading-relaxed">{pw.aiNote}</p>
                        </div>

                        {/* Match progress bar */}
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-black tracking-wider text-white/30 uppercase">Match Score</span>
                            <span className="text-[10px] font-black text-emerald-400">{match}%</span>
                          </div>
                          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${match}%`, background: match >= 90 ? '#10b981' : match >= 80 ? '#00b4d8' : '#f59e0b' }} />
                          </div>
                        </div>

                        {/* Blinking explore indicator */}
                        <div className="absolute bottom-2 right-3">
                          <span className="text-[8px] font-black tracking-wider text-red-400 uppercase animate-pulse">Explore →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
                {/* Duplicate for seamless loop */}
                {[
                  {
                    name: 'Private Jet Charter',
                    type: 'Gulfstream · Falcon · Challenger',
                    img: 'https://images.unsplash.com/photo-1540962351504-03099e0a759b?w=400&h=300&fit=crop&q=80',
                    tag: 'Confidential',
                    tagColor: '#6366f1',
                    grade: 'A',
                    gradeColor: '#6366f1',
                    reqs: { license: 'CPL / ATPL', hours: '2,500+', medical: 'Class 1' },
                    desc: 'Client-confidential placements with ultra-high-net-worth operators.',
                    baseMatch: 94,
                    aiNote: 'Your type-rated profile aligns perfectly with confidential charter demand.',
                  },
                  {
                    name: 'Corporate Aviation',
                    type: 'Fortune 500 Flight Departments',
                    img: 'https://images.unsplash.com/photo-1474302770737-17369821f0a3?w=400&h=300&fit=crop&q=80',
                    tag: 'Direct Hire',
                    tagColor: '#10b981',
                    grade: 'A+',
                    gradeColor: '#10b981',
                    reqs: { license: 'ATPL', hours: '3,000+', medical: 'Class 1' },
                    desc: 'Schedule stability, competitive pay, and global routing networks.',
                    baseMatch: 91,
                    aiNote: 'High hour count makes you a strong candidate for direct-hire corporate roles.',
                  },
                  {
                    name: 'eVTOL & Air Mobility',
                    type: 'Joby · Archer · Lilium',
                    img: 'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=400&h=300&fit=crop&q=80',
                    tag: 'Emerging',
                    tagColor: '#00b4d8',
                    grade: 'B+',
                    gradeColor: '#00b4d8',
                    reqs: { license: 'PPL / CPL', hours: '500+', medical: 'Class 2+' },
                    desc: 'Early-advantage pathways for next-generation urban air mobility.',
                    baseMatch: 87,
                    aiNote: 'Emerging sector — your CPL gives you a first-mover advantage here.',
                  },
                  {
                    name: 'Helicopter VIP',
                    type: 'Offshore · HEMS · VIP Charter',
                    img: 'https://images.unsplash.com/photo-1605289355680-75fb41239154?w=400&h=300&fit=crop&q=80',
                    tag: 'Elite',
                    tagColor: '#a78bfa',
                    grade: 'A-',
                    gradeColor: '#a78bfa',
                    reqs: { license: 'CPL-H', hours: '1,500+', medical: 'Class 1' },
                    desc: 'High-rotation roles in offshore, medical evac, and executive transport.',
                    baseMatch: 82,
                    aiNote: 'Helicopter pathway requires rotary endorsement — consider adding CPL-H.',
                  },
                  {
                    name: 'Type Rating Fast-Track',
                    type: 'Boeing · Airbus · Embraer',
                    img: 'https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=400&h=300&fit=crop&q=80',
                    tag: 'High Demand',
                    tagColor: '#f59e0b',
                    grade: 'A',
                    gradeColor: '#f59e0b',
                    reqs: { license: 'ATPL', hours: '1,500+', medical: 'Class 1' },
                    desc: 'Airline-sponsored type rating placements with bonded contracts.',
                    baseMatch: 96,
                    aiNote: 'Excellent match — your ATPL and hour threshold exceed airline minimums.',
                  },
                ].map((pw, i) => {
                  const profileHours = totalHours || 0;
                  const profileLicense = (licenseType || '').toLowerCase();
                  let match = pw.baseMatch;
                  if (profileHours >= 1500) match = Math.min(98, match + 2);
                  if (profileLicense.includes('atpl')) match = Math.min(98, match + 2);
                  return (
                    <div
                      key={`dup-${i}`}
                      className="flex-shrink-0 w-[28rem] h-52 rounded-xl overflow-hidden transition-transform hover:scale-[1.02] cursor-pointer relative flex"
                      style={{ border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <div className="relative w-[45%] h-full flex-shrink-0">
                        <img src={pw.img} alt={pw.type} className="w-full h-full object-cover" loading="lazy" />
                        <div className="absolute inset-y-0 right-0 w-16" style={{ background: 'linear-gradient(to right, transparent, rgba(15,23,42,0.95))' }} />
                      </div>
                      <div
                        className="flex-1 h-full p-4 flex flex-col justify-between relative"
                        style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.9) 0%, rgba(30,41,59,0.85) 100%)', backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)' }}
                      >
                        <div className="flex items-start justify-between">
                          <div className="min-w-0">
                            <p className="text-sm font-black text-white leading-tight">{pw.name}</p>
                            <p className="text-[10px] text-white/40">{pw.type}</p>
                          </div>
                          <div className="flex flex-col items-end gap-1">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${pw.tagColor}15`, color: pw.tagColor, border: `1px solid ${pw.tagColor}30` }}>
                              {pw.tag}
                            </span>
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: `${pw.gradeColor}15`, color: pw.gradeColor, border: `1px solid ${pw.gradeColor}30` }}>
                              {pw.grade}
                            </span>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 mt-2">
                          <div><p className="text-[8px] font-black tracking-wider text-white/30 uppercase">License</p><p className="text-[10px] font-bold text-white/70">{pw.reqs.license}</p></div>
                          <div><p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Hours</p><p className="text-[10px] font-bold text-white/70">{pw.reqs.hours}</p></div>
                          <div><p className="text-[8px] font-black tracking-wider text-white/30 uppercase">Medical</p><p className="text-[10px] font-bold text-white/70">{pw.reqs.medical}</p></div>
                        </div>
                        <p className="text-[10px] text-white/50 leading-relaxed line-clamp-2 mt-1">{pw.desc}</p>
                        <div className="flex items-start gap-1.5 mt-1.5">
                          <Sparkles size={10} className="text-amber-400 flex-shrink-0 mt-0.5" />
                          <p className="text-[9px] text-amber-400/80 leading-relaxed">{pw.aiNote}</p>
                        </div>
                        <div className="mt-2">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[8px] font-black tracking-wider text-white/30 uppercase">Match Score</span>
                            <span className="text-[10px] font-black text-emerald-400">{match}%</span>
                          </div>
                          <div className="w-full h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
                            <div className="h-full rounded-full transition-all" style={{ width: `${match}%`, background: match >= 90 ? '#10b981' : match >= 80 ? '#00b4d8' : '#f59e0b' }} />
                          </div>
                        </div>
                        <div className="absolute bottom-2 right-3">
                          <span className="text-[8px] font-black tracking-wider text-red-400 uppercase animate-pulse">Explore →</span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recognition AI recommendation banner */}
            <div className="mt-4 rounded-xl p-4 flex items-start gap-3" style={{ background: 'rgba(220,38,38,0.06)', border: '1px solid rgba(220,38,38,0.15)' }}>
              <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                <Bot size={14} className="text-red-400" />
              </div>
              <div>
                <p className="text-[11px] font-black text-red-400 uppercase tracking-wider mb-0.5">Recognition AI — Pathway Match</p>
                <p className="text-[11px] text-white/60 leading-relaxed">
                  Based on your {licenseType} with {(totalHours || 0).toLocaleString()} hours and {ratings.length} active rating{ratings.length !== 1 ? 's' : ''}, the <span className="text-white font-bold">Type Rating Fast-Track</span> and <span className="text-white font-bold">Private Jet Charter</span> pathways are your strongest matches. Your ATPL profile exceeds airline minimums and your hour count places you in the top tier for confidential charter placements.
                </p>
              </div>
            </div>
          </div>

          {/* ─── HOW ALIGNMENT WORKS — Editorial / Newspaper style ─── */}
          <div className="rounded-2xl overflow-hidden border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
            {/* Hero image strip */}
            <div className="relative h-48 w-full overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1474302770737-17369821f0a3?w=1200&h=400&fit=crop&q=80"
                alt="Aviation career pathways"
                className="w-full h-full object-cover"
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to bottom, rgba(15,23,42,0.2) 0%, rgba(15,23,42,0.85) 70%, rgba(15,23,42,1) 100%)',
                }}
              />
              <div className="absolute bottom-0 left-0 right-0 px-6 pb-4">
                <p className="text-[9px] font-black tracking-[0.25em] text-red-400 uppercase mb-1">Industry Intelligence</p>
                <h3 className="text-xl sm:text-2xl font-black text-white leading-tight">
                  Why the Industry Is Moving to Recognition-First Hiring
                </h3>
              </div>
            </div>

            <div className="p-6 space-y-5">
              {/* Intro paragraph */}
              <p className="text-sm text-white/60 leading-relaxed">
                The old model is broken. Airlines and operators used to trust self-reported logbooks and paper resumes.
                Today, one fraudulent credential can cost a carrier millions in liability. The industry is shifting to
                <span className="text-white font-bold"> verified-first recruitment</span> — where only attested flight hours,
                ratings, and medical records open the door to an interview.
              </p>

              {/* Two-column article grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden h-32">
                    <img
                      src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=300&fit=crop&q=80"
                      alt="Flight deck verification"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-wider text-red-400 uppercase mb-1">The Problem</p>
                    <p className="text-sm font-black text-white mb-1.5">Paper Logbooks Are a Liability</p>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Underwriters and risk departments can no longer accept unverified hour claims. When an insurer
                      prices a fleet policy, they need attested pilot data — not a PDF scan. Verified profiles reduce
                      premium uncertainty and speed hiring approvals.
                    </p>
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div className="rounded-xl overflow-hidden h-32">
                    <img
                      src="https://images.unsplash.com/photo-1559060017-445fb9722f2a?w=600&h=300&fit=crop&q=80"
                      alt="Airline operations center"
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-black tracking-wider text-red-400 uppercase mb-1">The Solution</p>
                    <p className="text-sm font-black text-white mb-1.5">Recognition AI Does the Heavy Lifting</p>
                    <p className="text-[11px] text-white/40 leading-relaxed">
                      Recognition AI cross-references your verified credentials against live pathway requirements.
                      It calculates gap analysis, risk scores for underwriters, and real-time match scores. When a pathway
                      opens or closes, your profile is instantly re-evaluated against every operator in the network.
                    </p>
                  </div>
                </div>
              </div>

              {/* Divider quote */}
              <div className="flex items-center gap-4 py-3 border-y border-white/[0.06]">
                <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                  <Sparkles size={16} className="text-red-400" />
                </div>
                <p className="text-[11px] text-white/50 leading-relaxed italic">
                  "Verified pilots get pulled first. Unverified pilots get buried in a stack of PDFs that nobody reads."
                  <span className="text-white/30 not-italic ml-1">— Recognition AI, pathway matching analysis</span>
                </p>
              </div>

              {/* Bottom CTA row */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <p className="text-xs font-black text-white">Exclusive Pathways Are Opening Now</p>
                  <p className="text-[10px] text-white/40">
                    Private charter, eVTOL, corporate aviation, and type-rating fast-track placements.
                  </p>
                </div>
                <button
                  onClick={() => onNavigate('/pathways')}
                  className="flex-shrink-0 px-6 py-3 rounded-full text-[11px] font-black tracking-wide text-white transition-all hover:brightness-110"
                  style={{ background: '#dc2626' }}
                >
                  Learn More About Exclusive Pathways →
                </button>
              </div>
            </div>
          </div>

          {/* ─── RECOGNITION PROGRAMS — WINGMENTOR — Programs Page Aesthetic ─── */}
          <div className="rounded-2xl overflow-hidden" style={{ background: '#0f0f0f' }}>
            {/* Cinematic hero — pilot left, text right */}
            <div className="relative min-h-[320px] flex items-end">
              <img
                src="https://images.unsplash.com/photo-1540962351504-03099e0a759b?w=1400&h=700&fit=crop&q=80"
                alt="WingMentor"
                className="absolute inset-0 w-full h-full object-cover"
                style={{ filter: 'brightness(0.55) contrast(1.05)' }}
              />
              <div
                className="absolute inset-0"
                style={{
                  background: 'linear-gradient(to right, rgba(15,15,15,0.7) 0%, rgba(15,15,15,0.3) 45%, rgba(15,15,15,0.85) 100%)',
                }}
              />
              <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(15,15,15,1) 0%, transparent 40%)' }} />

              {/* Content overlay */}
              <div className="relative z-10 w-full p-6 sm:p-8">
                <div className="flex flex-col sm:flex-row items-start sm:items-end gap-6">
                  {/* Left: Logo badge */}
                  <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div
                      className="w-16 h-16 rounded-xl flex items-center justify-center p-2"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                      <img src="/logo.png" alt="WingMentor" className="w-full h-full object-contain" />
                    </div>
                    <span className="text-[8px] font-black tracking-[0.2em] text-white/40 uppercase">WING MENTOR</span>
                  </div>

                  {/* Right: Headline + CTAs */}
                  <div className="flex-1 min-w-0">
                    <p className="text-[9px] font-black tracking-[0.25em] text-red-400 uppercase mb-2">Foundation Program</p>
                    <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-[1.05] mb-3">
                      Your CPL Is<br />Not Enough
                    </h2>
                    <p className="text-[11px] text-white/50 leading-relaxed max-w-md mb-4">
                      Airlines hire on judgment, leadership, and CRM. Skills flight school never taught.
                      WingMentor builds the pilot the industry actually wants.
                    </p>
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => onNavigate('/wingmentor')}
                        className="px-6 py-2.5 rounded-full text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
                        style={{ background: '#dc2626' }}
                      >
                        ENROLL NOW
                      </button>
                      <a
                        href={`${window.location.origin}/platform?tab=foundation-welcome`}
                        className="px-6 py-2.5 rounded-full text-[10px] font-black tracking-wider text-white/60 transition-all hover:text-white hover:bg-white/10 inline-flex items-center no-underline"
                        style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)' }}
                      >
                        LEARN MORE
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Stacked program cards */}
            <div className="p-5 space-y-3" style={{ background: '#0f0f0f' }}>
              {/* Card 1 */}
              <div className="flex gap-4 items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=300&h=200&fit=crop&q=80" alt="Transition" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black tracking-wider text-red-400 uppercase">Transition Program</p>
                  <p className="text-sm font-black text-white leading-tight">Airline Ready in 12 Weeks</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Structured pathway from CPL to airline-ready with simulator assessment prep and interview coaching.</p>
                </div>
                <button
                  onClick={() => setTab('programs')}
                  className="flex-shrink-0 text-[9px] font-black tracking-wider text-white/40 hover:text-white transition-colors uppercase hidden sm:block"
                >
                  Explore →
                </button>
              </div>

              {/* Card 2 */}
              <div className="flex gap-4 items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=300&h=200&fit=crop&q=80" alt="Type Rating" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black tracking-wider text-amber-400 uppercase">Type Rating Academy</p>
                  <p className="text-sm font-black text-white leading-tight">Prove Your Competency</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">Boeing and Airbus type-rating fast-track with bonded placement agreements and airline sponsorship.</p>
                </div>
                <button
                  onClick={() => setTab('programs')}
                  className="flex-shrink-0 text-[9px] font-black tracking-wider text-white/40 hover:text-white transition-colors uppercase hidden sm:block"
                >
                  Explore →
                </button>
              </div>

              {/* Card 3 */}
              <div className="flex gap-4 items-center p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)' }}>
                <div className="w-24 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <img src="https://images.unsplash.com/photo-1605289355680-75fb41239154?w=300&h=200&fit=crop&q=80" alt="Leadership" className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[9px] font-black tracking-wider text-sky-400 uppercase">Leadership Track</p>
                  <p className="text-sm font-black text-white leading-tight">Mentorship & Crew Command</p>
                  <p className="text-[10px] text-white/40 leading-relaxed">50+ hours of peer mentorship. EBT/CBTA aligned behavioral assessment with tri-panel industry interview.</p>
                </div>
                <button
                  onClick={() => setTab('programs')}
                  className="flex-shrink-0 text-[9px] font-black tracking-wider text-white/40 hover:text-white transition-colors uppercase hidden sm:block"
                >
                  Explore →
                </button>
              </div>
            </div>

            {/* Bottom bar */}
            <div className="px-5 pb-5">
              <div className="flex items-center justify-between pt-4 border-t border-white/[0.06]">
                <div className="flex items-center gap-3">
                  <span className="text-[9px] font-black text-white/30 uppercase tracking-wider">Verified by</span>
                  {['pilotshortage.org', 'Aviation Pathways', 'pilotrecognition.com'].map((p) => (
                    <span
                      key={p}
                      className="text-[9px] font-bold px-2 py-1 rounded"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.35)' }}
                    >
                      {p}
                    </span>
                  ))}
                </div>
                <button
                  onClick={() => setTab('programs')}
                  className="text-[9px] font-black tracking-wider text-white/40 hover:text-white transition-colors uppercase"
                >
                  View All Programs →
                </button>
              </div>
            </div>
          </div>

          {/* ─── CTA BANNER ─── */}
          <div
            className="rounded-2xl p-6 sm:p-8 text-center space-y-4"
            style={{
              background: 'linear-gradient(135deg, rgba(220,38,38,0.15) 0%, rgba(220,38,38,0.05) 100%)',
              border: '1px solid rgba(220,38,38,0.2)',
            }}
          >
            <p className="text-lg sm:text-xl font-black text-white">Your Career Does Not Stop at the Airline Gate.</p>
            <p className="text-sm text-white/50 max-w-xl mx-auto leading-relaxed">
              Private aviation, eVTOL, and charter operators are actively looking for verified pilots who are cleared to hire. 
              Submit your profile to the Priority Pooling List and let opportunities find you.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('https://pilotcareerpathways.com')}
                className="px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black tracking-wide transition-all shadow-lg shadow-red-600/20"
              >
                Join Priority Pooling List →
              </button>
              <button
                onClick={() => onNavigate('/recognition-plus')}
                className="px-6 py-3 rounded-full text-[11px] font-black tracking-wide text-white transition-all hover:bg-white/10"
                style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}
              >
                Upgrade to Recognition+ →
              </button>
            </div>
          </div>
        </motion.div>
      )}

      {subTab === 'ai-tools' && (
        <motion.div variants={itemVariants} className="space-y-6">
          {/* ─── RECOGNITION AI CHAT ─── */}
          <RecognitionAIChat profile={profile} />

          {/* ─── WHAT YOU CAN ASK ─── */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              {
                title: 'Your Profile',
                desc: 'What is my Recognition Score? Am I missing any requirements for my target airline?',
              },
              {
                title: 'Pathways',
                desc: 'What is the best pathway for my hours and experience? Which airlines am I eligible for today?',
              },
              {
                title: 'Recurrencies',
                desc: 'When is my medical due? What do I need to stay current on my instrument rating?',
              },
              {
                title: 'Type Ratings',
                desc: 'What are the recurrency requirements for the A320? How much does an initial type rating cost?',
              },
              {
                title: 'Airline Expectations',
                desc: 'What does Emirates look for in a First Officer? How do I prepare for an airline assessment?',
              },
              {
                title: 'Industry Shortage',
                desc: 'Where are pilots most needed right now? How does the shortage affect my bargaining power?',
              },
            ].map((card, i) => (
              <div
                key={i}
                className="rounded-xl p-4 bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm transition-all hover:bg-white/[0.05] hover:border-white/[0.12]"
              >
                <p className="text-xs font-black text-white mb-1.5">{card.title}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{card.desc}</p>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* ─── GOVERNMENT VERIFICATION REPORT MODAL ─── */}
      {reportOpen && (
        <div
          className="fixed inset-0 z-[100] flex items-start justify-center p-4 overflow-y-auto"
          style={{ background: 'rgba(2,6,23,0.85)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
          onClick={() => { setReportOpen(false); setDocPopupOpen(false); }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="relative w-full max-w-3xl rounded-lg border-2 border-red-600 overflow-hidden my-8"
            style={{ background: '#ffffff', boxShadow: '0 24px 80px -16px rgba(0,0,0,0.5)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Red header bar */}
            <div className="bg-red-600 px-6 py-4 flex items-center justify-between">
              <div>
                <p className="text-[10px] font-black text-white/70 uppercase tracking-[0.2em]">Official Verification Report</p>
                <p className="text-lg font-black text-white leading-tight">Pilot Credential Verification Summary</p>
              </div>
              <button
                onClick={() => { setReportOpen(false); setDocPopupOpen(false); }}
                className="p-2 rounded hover:bg-white/20 transition-colors"
              >
                <X size={18} className="text-white" />
              </button>
            </div>

            {/* Report body */}
            <div className="p-6 space-y-6">
              {/* Document metadata */}
              <div className="flex items-center justify-between border-b border-slate-200 pb-4">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Report Reference</p>
                  <p className="text-sm font-black text-slate-900">PR-VER-2026-0428-PM</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Date Issued</p>
                  <p className="text-sm font-black text-slate-900">{fmtDate(new Date().toISOString())}</p>
                </div>
              </div>

              {/* Pilot identity */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-2">Pilot Under Verification</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-slate-900 flex items-center justify-center text-white font-black text-sm">
                    PM
                  </div>
                  <div>
                    <p className="text-sm font-black text-slate-900">Pete Mitchell</p>
                    <p className="text-[11px] text-slate-500">PEL 123456 | CAAP Philippines | CPL Airplane Single Engine Land</p>
                  </div>
                </div>
              </div>

              {/* Credential table */}
              <div>
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3">Credential Verification Results</p>
                <div className="border border-slate-200 rounded-lg overflow-hidden">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="px-4 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Credential</th>
                        <th className="px-4 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Authority</th>
                        <th className="px-4 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Status</th>
                        <th className="px-4 py-2.5 text-[10px] font-black text-slate-500 uppercase tracking-wider">Expiry</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-900">Commercial Pilot License</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">CAAP</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Valid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">Oct 23, 2030</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-900">Class 1 Medical</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">CAAP / Dr. M.S. Cosue</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-amber-600 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                            Renewal Due
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">Aug 15, 2026</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-900">English Proficiency (ICAO)</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">CAAP</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Valid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">No expiry</td>
                      </tr>
                      <tr className="border-t border-slate-100">
                        <td className="px-4 py-3 text-[11px] font-bold text-slate-900">Radio Telephony License</td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">NTC Philippines</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            Valid
                          </span>
                        </td>
                        <td className="px-4 py-3 text-[11px] text-slate-600">Jul 30, 2028</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Discrepancies */}
              <div className="rounded-lg border border-amber-200 bg-amber-50 p-4">
                <div className="flex items-start gap-3">
                  <div className="p-1.5 rounded bg-amber-200 flex-shrink-0">
                    <AlertTriangle size={14} className="text-amber-700" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-amber-700 uppercase tracking-wider mb-1">Minor Discrepancies Identified</p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Logbook cross-check detected 3 dual-entry hours between MyFlightBook and manual entry.
                      Night landing currency shows 2 landings in preceding 90 days (requirement: 3). CFI authorization
                      notes minor variance in tail number recording (N172-SFA vs N172SFA). All items reviewed and
                      acknowledged by Skyward Fast Academy verification officer.
                    </p>
                  </div>
                </div>
              </div>

              {/* Notary / ATO Auditing Section */}
              <div className="rounded-lg border-2 border-slate-200 p-5">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-3">Notary & ATO Audit</p>
                <div className="flex items-start gap-4">
                  <div className="p-3 rounded-lg bg-slate-100 border border-slate-200 flex-shrink-0">
                    <Landmark size={24} className="text-slate-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-black text-slate-900 mb-1">Skyward Fast Academy — ATO Verification Node</p>
                    <p className="text-[11px] text-slate-600 leading-relaxed mb-3">
                      Independent audit conducted under CAAP-approved ATO framework. Flight hours cross-referenced
                      against training records, aircraft dispatch logs, and instructor sign-off sheets. This report
                      constitutes a pre-clearance statement subject to airline final review.
                    </p>
                    <div className="flex items-center gap-2 mb-3">
                      <span className="inline-flex items-center gap-1 text-[10px] font-black text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                        ATO Audit Passed
                      </span>
                      <span className="text-[10px] text-slate-400">Operator No. ATO-PH-2847</span>
                    </div>
                    <button
                      onClick={() => setDocPopupOpen(true)}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-500 text-white text-[10px] font-black tracking-wide transition-all"
                    >
                      <FileText size={12} />
                      View CFI Authorization Document →
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer signature */}
              <div className="border-t border-slate-200 pt-4 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Certified By</p>
                  <p className="text-sm font-black text-slate-900">Capt. Roberto Dela Cruz, CFI-I</p>
                  <p className="text-[10px] text-slate-500">Flight Instructor — Skyward Fast Academy</p>
                  <p className="text-[10px] text-slate-400">CAFI License No. 2847-2025-RC</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider">Verification Stamp</p>
                  <div className="mt-1 inline-flex items-center gap-1.5 px-3 py-1.5 rounded border-2 border-emerald-500 bg-emerald-50">
                    <CheckCircle2 size={14} className="text-emerald-600" />
                    <span className="text-[10px] font-black text-emerald-700">CLEARED FOR PATHWAY ACCESS</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* ─── CFI AUTHORIZATION DOCUMENT POPUP (nested) ─── */}
      {docPopupOpen && (
        <div
          className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}
          onClick={() => setDocPopupOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="relative w-full max-w-lg rounded-lg border border-slate-300 overflow-hidden"
            style={{ background: '#ffffff', boxShadow: '0 24px 64px -16px rgba(0,0,0,0.4)' }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="border-b border-slate-200 px-5 py-3 flex items-center justify-between bg-slate-50">
              <p className="text-xs font-black text-slate-900">CFI Written Authorization</p>
              <button
                onClick={() => setDocPopupOpen(false)}
                className="p-1.5 rounded hover:bg-slate-200 transition-colors"
              >
                <X size={14} className="text-slate-500" />
              </button>
            </div>

            {/* Document body */}
            <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
              <div className="text-center border-b border-slate-200 pb-3">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Skyward Fast Academy</p>
                <p className="text-sm font-black text-slate-900">Flight Hours Verification — CFI Authorization</p>
                <p className="text-[10px] text-slate-400 mt-1">Ref: SFA-CFI-2026-0312 | Date: Mar 12, 2026</p>
              </div>

              <div className="space-y-3 text-[11px] text-slate-700 leading-relaxed">
                <p>
                  <strong className="text-slate-900">TO WHOM IT MAY CONCERN:</strong>
                </p>
                <p>
                  This letter certifies that I have personally reviewed and verified the flight training
                  records of <strong className="text-slate-900">Pete Mitchell</strong> (PEL 123456), a student
                  under my instruction at <strong className="text-slate-900">Skyward Fast Academy</strong>, Brgy
                  Carnarvacan, Binalonan, Pangasinan, Philippines.
                </p>
                <p>
                  Having reviewed the aircraft dispatch logs, instructor sign-off sheets, and MyFlightBook
                  entries, I confirm the following:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-slate-600">
                  <li>Total logged flight hours: <strong className="text-slate-900">487.2 hrs</strong> (as of Feb 20, 2026)</li>
                  <li>PIC time: <strong className="text-slate-900">312.0 hrs</strong></li>
                  <li>Dual instruction received: <strong className="text-slate-900">175.2 hrs</strong></li>
                  <li>Night hours: <strong className="text-slate-900">58.0 hrs</strong></li>
                  <li>Instrument hours: <strong className="text-slate-900">89.0 hrs</strong></li>
                </ul>
                <p>
                  <strong className="text-slate-900">Minor discrepancies noted:</strong> Three (3) dual-entry
                  hours were identified between MyFlightBook and manual logbook entries. These have been
                  reconciled and adjusted. One (1) tail number variance (N172-WCC vs N172WCC) was corrected
                  in the digital record. Night landing currency shows 2 of 3 required landings in the preceding
                  90 days; the pilot has been advised to complete the third landing before next IFR flight.
                </p>
                <p>
                  Based on my professional assessment as a Certificated Flight Instructor (CAFI 2847-2025-RC),
                  I hereby authorize and endorse the above flight hours as accurate and legitimate for the purposes
                  of airline pathway applications and verification through the PilotRecognition platform.
                </p>
              </div>

              {/* Signature block */}
              <div className="border-t border-slate-200 pt-4 mt-4">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-black text-slate-900 mb-4" style={{ fontFamily: 'cursive' }}>
                      R. Dela Cruz
                    </p>
                    <p className="text-[10px] font-black text-slate-800">Capt. Roberto Dela Cruz</p>
                    <p className="text-[10px] text-slate-500">Certificated Flight Instructor — Instrument</p>
                    <p className="text-[10px] text-slate-500">Skyward Fast Academy</p>
                    <p className="text-[10px] text-slate-400">CAFI License No. 2847-2025-RC</p>
                  </div>
                  <div className="text-right">
                    <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded border border-slate-200 bg-slate-50 mb-2">
                      <CheckCircle2 size={12} className="text-emerald-600" />
                      <span className="text-[9px] font-black text-slate-600">Digitally Signed</span>
                    </div>
                    <p className="text-[9px] text-slate-400">Operator: ATO-PH-2847</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
    </>
  );
};

