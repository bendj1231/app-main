import React, { useState } from 'react';
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
  CalendarDays,
  Award,
  GraduationCap,
  FolderOpen,
  History,
  Crosshair,
  BarChart3,
  Landmark,
  FileText,
} from 'lucide-react';
import type { TabId } from '../types';

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
  if (days === null) return { text: 'text-white/30', statusText: 'Not recorded' };
  if (days < 0) return { text: 'text-red-400', statusText: 'Expired' };
  if (days <= 30) return { text: 'text-amber-400', statusText: 'Expiring soon' };
  if (days <= 90) return { text: 'text-sky-400', statusText: 'Renewal due' };
  return { text: 'text-emerald-400', statusText: 'Valid' };
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
  icon: React.ElementType;
  title: string;
  subtitle: string;
  expiry: string | null | undefined;
  type: 'license' | 'medical' | 'english' | 'radio';
}> = ({ icon: Icon, title, subtitle, expiry, type }) => {
  const days = daysUntil(expiry);
  const st = statusColor(days);
  const pct = days !== null ? Math.max(0, Math.min(100, (days / 365) * 100)) : 0;
  const guidance = pilotAction(days, type);

  return (
    <div className="rounded-2xl p-5 border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm transition-all hover:bg-white/[0.03]">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-white/5 border border-white/[0.08]">
            <Icon size={18} className="text-white/50" />
          </div>
          <div>
            <p className="text-[10px] font-black text-white/40 uppercase tracking-wider">{subtitle}</p>
            <p className="text-sm font-black text-white">{title}</p>
          </div>
        </div>
        <span className={`text-[10px] font-black px-2 py-1 rounded-full bg-white/5 border border-white/10 ${st.text}`}>
          {st.statusText}
        </span>
      </div>

      <p className={`text-2xl font-black ${st.text} mb-1`}>{statusLabel(days)}</p>
      <p className="text-xs text-white/40 mb-3">{expiry ? `Expires ${fmtDate(expiry)}` : 'No expiry date on file'}</p>

      {/* Operational Impact */}
      <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06] mb-3">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Operational Impact</p>
        <p className="text-[11px] text-white/60 leading-relaxed">{guidance.impact}</p>
      </div>

      {/* Action Required */}
      <div className="rounded-xl p-3 bg-white/[0.04] border border-white/[0.06]">
        <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-1">Action Required</p>
        <p className="text-[11px] text-white/60 leading-relaxed">{guidance.action}</p>
      </div>

      <div className="mt-3 h-1.5 rounded-full bg-white/5 overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            days === null
              ? 'bg-white/10'
              : days < 0
                ? 'bg-red-500'
                : days <= 30
                  ? 'bg-amber-500'
                  : days <= 90
                    ? 'bg-sky-500'
                    : 'bg-emerald-500'
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
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

  const profile = MOCK_PROFILE;
  const walletChecks = MOCK_WALLET_CHECKS;
  const credentials = MOCK_CREDENTIALS;

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

  return (
    <div className="max-w-5xl mx-auto px-6 pt-24 pb-16 space-y-8">
      {/* ─── HEADER ─── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-black tracking-[0.2em] text-red-400 uppercase mb-1">Recognition+</p>
          <h1 className="text-2xl font-black text-white">Verification & Recurrency</h1>
          <p className="text-sm text-white/50 mt-1">Active compliance management and credential tracking.</p>
        </div>
        <div className="flex items-center gap-3">
          {verifiedCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 size={12} /> {verifiedCount} Verified
            </span>
          )}
          {pendingCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
              <Clock size={12} /> {pendingCount} Pending
            </span>
          )}
          {expiredCount > 0 && (
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              <AlertTriangle size={12} /> {expiredCount} Expired
            </span>
          )}
        </div>
      </div>

      {/* ─── CRITICAL ALERTS ─── */}
      {alerts.length > 0 && (
        <div className="space-y-3">
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
        </div>
      )}

      {/* ─── RECOGNITION+ UPSELL CARD ─── */}
      {!isPlus && (
        <div className="rounded-2xl bg-white p-6 sm:p-8 border border-white/10 shadow-2xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-sm font-black text-slate-900 tracking-tight">PR<sup className="text-[9px]">®</sup></span>
            <span className="text-[10px] font-black tracking-[0.15em] text-red-500 uppercase">Recognition+</span>
            <span className="text-[10px] font-bold text-slate-400">— Verification & Recurrency</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-slate-900 leading-tight mb-3">
            Stay compliant and <span className="text-red-600">never miss a deadline.</span>
          </h2>
          <p className="text-sm text-slate-500 max-w-xl leading-relaxed mb-6">
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
          <div className="mt-6 pt-5 border-t border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <p className="text-[9px] font-black tracking-[0.15em] text-slate-400 uppercase">
                matching pilot career profiles at <span className="text-red-600">pilotcareerpathways.com</span>
              </p>
              <button
                onClick={() => onNavigate('https://pilotcareerpathways.com')}
                className="px-3 py-1 rounded-full text-[9px] font-black tracking-wider text-white transition-all hover:brightness-110"
                style={{ background: '#dc2626' }}
              >
                Learn more →
              </button>
            </div>
            <p className="text-[9px] text-slate-300">verified · matched · hired</p>
          </div>
        </div>
      )}

      {/* ─── GET STARTED WITH VERIFICATION (FOLDABLE) ─── */}
      <div className="rounded-2xl border border-white/5 bg-slate-950/60 backdrop-blur-sm overflow-hidden">
        <button
          onClick={() => setFolded(!folded)}
          className="w-full flex items-center justify-between px-6 sm:px-8 py-5 text-left hover:bg-white/[0.02] transition-colors"
        >
          <div className="flex items-center gap-3">
            <p className="text-[10px] font-black tracking-[0.2em] text-sky-400 uppercase">Get Started</p>
            <h2 className="text-base sm:text-lg font-black text-white leading-tight">
              Your verification dashboard keeps you <span className="text-red-400">cleared to fly.</span>
            </h2>
          </div>
          <div className="flex items-center gap-3 flex-shrink-0">
            <span className="hidden sm:block text-[10px] font-black tracking-wide text-white px-4 py-2 rounded-full" style={{ background: '#dc2626' }}>
              {folded ? 'Expand to learn more →' : 'Click to fold ↑'}
            </span>
            {folded ? (
              <ChevronDown size={18} className="text-white/30 sm:hidden" />
            ) : (
              <ChevronUp size={18} className="text-white/30 sm:hidden" />
            )}
          </div>
        </button>

        {!folded && (
          <div className="px-6 sm:px-8 pb-8">
            <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-6 mb-8">
              <div className="max-w-lg">
                <p className="text-sm text-white/50 leading-relaxed">
                  Upload your credentials once. We track expiry dates, send renewal alerts, and share
                  your verified status with airlines looking for ready-to-hire pilots.
                </p>
              </div>
              <button
                onClick={() => onNavigate('/about-verification')}
                className="flex-shrink-0 px-6 py-3 rounded-full bg-red-600 hover:bg-red-500 text-white text-[11px] font-black tracking-wide transition-all shadow-lg shadow-red-600/20"
              >
                START VERIFICATION →
              </button>
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
                <div key={i} className="relative rounded-xl p-5 bg-slate-950/40 backdrop-blur-sm border border-white/5">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-black text-white/20">{s.step}</span>
                    <div className="p-2 rounded-lg bg-white/5">
                      <s.icon size={14} className="text-red-400" />
                    </div>
                  </div>
                  <p className="text-sm font-black text-white mb-1">{s.title}</p>
                  <p className="text-[11px] text-white/40 leading-relaxed">{s.desc}</p>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-white/5">
              <p className="text-[10px] font-black tracking-[0.15em] text-white/30 uppercase mb-4">What you unlock</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[
                  { icon: Globe, text: 'Internationally shareable verified status' },
                  { icon: TrendingUp, text: 'Priority ranking in airline searches' },
                  { icon: Clock, text: 'Automated 90/30/7 day expiry alerts' },
                  { icon: FileCheck, text: 'Batch verification for ATOs & flight schools' },
                  { icon: AlertTriangle, text: 'One-glance compliance health dashboard' },
                  { icon: ShieldCheck, text: 'Airline pre-clearance without paper chase' },
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-950/60 backdrop-blur-sm border border-white/5">
                    <item.icon size={14} className="text-red-400 flex-shrink-0" />
                    <span className="text-[11px] font-bold text-white/60">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─── CREDENTIAL COUNTDOWNS ─── */}
      <div>
        <div className="flex flex-col items-center mb-6">
          <div className="w-full h-px bg-white/10 mb-4" />
          <p className="text-[10px] font-black tracking-[0.25em] text-white/40 uppercase">Learn more about Recognition+</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <CountdownCard
            icon={FileCheck}
            title={licenseType}
            subtitle="Pilot License"
            expiry={licenseExpiry}
            type="license"
          />
          <CountdownCard
            icon={Stethoscope}
            title={`Class ${medicalClass}`}
            subtitle="Medical Certificate"
            expiry={medicalExpiry}
            type="medical"
          />
          <CountdownCard
            icon={Globe}
            title={englishLevel}
            subtitle="English Proficiency"
            expiry={undefined}
            type="english"
          />
          <CountdownCard
            icon={Radio}
            title="Radio Telephony"
            subtitle="NTC / Authority License"
            expiry={radioExpiry}
            type="radio"
          />
        </div>
      </div>

      {/* ─── BATCH OPERATIONS (ATO / Enterprise) ─── */}
      {(profile?.role === 'ato_admin' || profile?.role === 'enterprise' || profile?.subscription_tier === 'enterprise') && (
        <div className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
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
        </div>
      )}

      {/* ─── TYPE RATINGS & ENDORSEMENTS ─── */}
      <div className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <Award size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Type Ratings & Endorsements</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            { code: 'IR', name: 'Instrument Rating', expiry: new Date(Date.now() + 180 * 24 * 60 * 60 * 1000).toISOString(), status: 'current', hours: 89 },
            { code: 'ME', name: 'Multi-Engine Rating', expiry: new Date(Date.now() + 400 * 24 * 60 * 60 * 1000).toISOString(), status: 'current', hours: 124 },
            { code: 'CFI', name: 'Flight Instructor', expiry: new Date(Date.now() + 210 * 24 * 60 * 60 * 1000).toISOString(), status: 'review', hours: 312 },
          ].map((r) => {
            const d = daysUntil(r.expiry);
            const isReview = r.status === 'review';
            return (
              <div key={r.code} className="rounded-xl p-5 bg-white/[0.02] border border-white/[0.06] backdrop-blur-sm transition-all hover:bg-white/[0.03]">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-2xl font-black text-white">{r.code}</span>
                  {isReview ? (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/20">REVIEW DUE</span>
                  ) : (
                    <span className="text-[10px] font-black px-2 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">CURRENT</span>
                  )}
                </div>
                <p className="text-sm font-black text-white mb-1">{r.name}</p>
                <p className="text-[11px] text-white/40 mb-3">
                  {d !== null ? `${d} days until renewal` : 'No expiry recorded'}
                </p>
                <div className="flex items-center gap-2 pt-3 border-t border-white/5">
                  <Plane size={12} className="text-white/30" />
                  <span className="text-[11px] font-bold text-white/50">{r.hours} hrs logged</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── TRAINING CURRENCY ─── */}
      <div className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <GraduationCap size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Training Currency</p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {[
            { label: 'Instrument Approaches', value: '6', period: 'Last 90 days', target: '6', ok: true },
            { label: 'Day Landings', value: '12', period: 'Last 90 days', target: '3', ok: true },
            { label: 'Night Landings', value: '2', period: 'Last 90 days', target: '3', ok: false },
            { label: 'Simulator Events', value: '1', period: 'Last 6 months', target: '2', ok: false },
          ].map((t, i) => (
            <div key={i} className="rounded-xl p-5 bg-slate-950/40 border border-white/[0.06]">
              <div className="flex items-center gap-2 mb-3">
                {t.ok ? (
                  <CheckCircle2 size={14} className="text-emerald-400" />
                ) : (
                  <AlertCircle size={14} className="text-amber-400" />
                )}
              </div>
              <p className="text-2xl font-black text-white mb-1">{t.value}</p>
              <p className="text-xs font-bold text-white/60 mb-0.5">{t.label}</p>
              <p className="text-[10px] text-white/30">{t.period}</p>
              <div className="mt-3 flex items-center gap-1.5">
                <div className="flex-1 h-1.5 rounded-full bg-white/5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${t.ok ? 'bg-emerald-500' : 'bg-amber-500'}`}
                    style={{ width: `${Math.min(100, (parseInt(t.value) / parseInt(t.target)) * 100)}%` }}
                  />
                </div>
                <span className="text-[10px] font-bold text-white/30">{t.target}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── VERIFICATION STATUS ─── */}
      <div className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-white/40" />
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Verification Status</p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[11px] font-bold">
              <CheckCircle2 size={12} /> 2 Verified
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-[11px] font-bold">
              <Clock size={12} /> 2 Pending
            </span>
            <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-[11px] font-bold">
              <AlertTriangle size={12} /> 1 Flagged
            </span>
          </div>
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
            let badgeClass = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20';
            if (isPending) { badgeText = 'PENDING'; badgeClass = 'bg-amber-500/10 text-amber-400 border-amber-500/20'; }
            if (isFlagged) { badgeText = 'FLAGGED'; badgeClass = 'bg-red-500/15 text-red-400 border-red-500/25'; }
            if (isMissing) { badgeText = 'NEARING RECURRENCY'; badgeClass = 'bg-sky-500/10 text-sky-400 border-sky-500/20'; }

            return (
              <div key={i} className="space-y-2">
                <div
                  className={`flex items-center justify-between px-4 py-3.5 rounded-xl border backdrop-blur-sm transition-all ${
                    isFlagged
                      ? 'bg-red-500/[0.06] border-red-500/15 hover:bg-red-500/[0.08]'
                      : isMissing
                        ? 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]'
                        : 'bg-white/[0.02] border-white/[0.06] hover:bg-white/[0.03]'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    <div className="p-2 rounded-lg bg-white/5 border border-white/[0.08] flex-shrink-0">
                      <Icon size={14} className="text-white/50" />
                    </div>
                    <div className="min-w-0">
                      <p className={`text-xs font-bold truncate ${isFlagged ? 'text-red-300' : isMissing ? 'text-white/40' : 'text-white/80'}`}>{doc.name}</p>
                      <p className={`text-[10px] truncate ${isFlagged ? 'text-red-400/60' : isMissing ? 'text-white/30' : 'text-white/40'}`}>{doc.detail}</p>
                    </div>
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
      </div>

      {/* ─── PROFILE OVERVIEW (READ-ONLY FROM ADVANCED PROFILE) ─── */}
      <div className="rounded-2xl p-6 border border-white/5 bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <UserCheck size={16} className="text-white/40" />
            <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Profile Overview</p>
          </div>
          <button
            onClick={() => setTab('advanced-profile')}
            className="text-[10px] font-black text-white/30 hover:text-white/60 transition-colors flex items-center gap-1"
          >
            Edit in Advanced Profile <ChevronRight size={12} />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {/* Personal Info */}
          <ProfileField
            label="Full Name"
            value={profile?.full_name ? String(profile.full_name) : null}
            icon={UserCheck}
            verified={!!profile?.full_name}
          />
          <ProfileField
            label="Date of Birth"
            value={profile?.date_of_birth ? fmtDate(String(profile.date_of_birth)) : null}
            icon={CalendarDays}
            verified={!!profile?.date_of_birth}
          />
          <ProfileField
            label="Nationality"
            value={profile?.nationality ? String(profile.nationality) : null}
            icon={Globe}
            verified={!!profile?.nationality}
          />

          {/* License */}
          <ProfileField
            label="License Type"
            value={profile?.license_type ? String(profile.license_type) : null}
            icon={FileCheck}
            verified={!!profile?.license_type}
          />
          <ProfileField
            label="License Number"
            value={profile?.license_number ? String(profile.license_number) : null}
            icon={FileDigit}
            verified={!!profile?.license_number}
          />
          <ProfileField
            label="License Expiry"
            value={profile?.license_expiry ? fmtDate(String(profile.license_expiry)) : null}
            icon={CalendarDays}
            verified={!!profile?.license_expiry}
            expired={profile?.license_expiry ? daysUntil(String(profile.license_expiry)) !== null && daysUntil(String(profile.license_expiry))! < 0 : false}
          />

          {/* Medical */}
          <ProfileField
            label="Medical Class"
            value={profile?.medical_class ? `Class ${profile.medical_class}` : null}
            icon={Stethoscope}
            verified={!!profile?.medical_class}
          />
          <ProfileField
            label="Medical Expiry"
            value={profile?.medical_expiry ? fmtDate(String(profile.medical_expiry)) : null}
            icon={CalendarDays}
            verified={!!profile?.medical_expiry}
            expired={profile?.medical_expiry ? daysUntil(String(profile.medical_expiry)) !== null && daysUntil(String(profile.medical_expiry))! < 0 : false}
          />

          {/* English & Radio */}
          <ProfileField
            label="English Proficiency"
            value={profile?.elp_level ? String(profile.elp_level) : null}
            icon={Globe}
            verified={!!profile?.elp_level}
          />
          <ProfileField
            label="Radio License"
            value={profile?.radio_license ? 'Held' : null}
            icon={Radio}
            verified={!!profile?.radio_license}
          />

          {/* Employment */}
          <ProfileField
            label="Current Occupation"
            value={profile?.current_occupation ? String(profile.current_occupation) : null}
            icon={Briefcase}
            verified={!!profile?.current_occupation}
          />
          <ProfileField
            label="Current Employer"
            value={profile?.current_employer ? String(profile.current_employer) : null}
            icon={Landmark}
            verified={!!profile?.current_employer}
          />

          {/* Flight Hours */}
          <ProfileField
            label="Total Flight Hours"
            value={profile?.total_flight_hours ? `${profile.total_flight_hours} hrs` : null}
            icon={Plane}
            verified={!!profile?.total_flight_hours && (profile.total_flight_hours as number) > 0}
          />
          <ProfileField
            label="PIC Hours"
            value={profile?.pic_hours ? `${profile.pic_hours} hrs` : null}
            icon={BarChart3}
            verified={!!profile?.pic_hours && (profile.pic_hours as number) > 0}
          />
          <ProfileField
            label="Last Flown"
            value={profile?.last_flown ? `${Math.abs(daysUntil(String(profile.last_flown)) ?? 0)} days ago` : null}
            icon={Clock}
            verified={!!profile?.last_flown}
          />
        </div>

        {/* Endorsements summary */}
        {profile?.endorsements && (
          <div className="mt-4 pt-4 border-t border-white/5">
            <p className="text-[10px] font-black text-white/30 uppercase tracking-wider mb-2">Endorsements & Ratings</p>
            <div className="flex flex-wrap gap-2">
              {Object.entries(profile.endorsements as Record<string, boolean>)
                .filter(([, v]) => v)
                .map(([key]) => (
                  <span key={key} className="px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 text-[10px] font-black border border-emerald-500/20">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                  </span>
                ))}
              {(!profile.endorsements || Object.values(profile.endorsements as Record<string, boolean>).filter(Boolean).length === 0) && (
                <span className="text-[11px] text-white/30">No endorsements added yet.</span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* ─── COMPLIANCE TIMELINE ─── */}
      <div className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-2 mb-5">
          <History size={16} className="text-white/40" />
          <p className="text-[10px] font-black tracking-[0.2em] text-white/40 uppercase">Compliance Timeline</p>
        </div>
        <div className="relative pl-4">
          <div className="absolute left-[11px] top-2 bottom-2 w-px bg-white/10" />
          {[
            { date: 'Oct 24, 2025', title: 'CPL License Issued', desc: 'Commercial Pilot License granted by CAAP. Valid until Oct 23, 2030.', icon: FileCheck, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { date: 'May 2, 2025', title: 'Class 1 Medical Issued', desc: 'Medical certificate granted by Dr. Marlon S. Cosue. Valid until May 2, 2026.', icon: Stethoscope, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { date: 'Aug 5, 2025', title: 'Radio License Verified', desc: 'NTC Registration 22 RANCR-22517 confirmed. Valid until Jul 30, 2028.', icon: Radio, color: 'text-emerald-400', bg: 'bg-emerald-500/10' },
            { date: 'Dec 15, 2025', title: 'Instrument Rating Renewal', desc: 'Instrument Rating renewed. Next review due Jun 15, 2026.', icon: Crosshair, color: 'text-sky-400', bg: 'bg-sky-500/10' },
            { date: 'Feb 20, 2026', title: 'Logbook Sync — MyFlightBook', desc: '487 hours imported and cross-referenced. 3 discrepancies flagged for review.', icon: TrendingUp, color: 'text-amber-400', bg: 'bg-amber-500/10' },
            { date: 'Upcoming', title: 'Medical Renewal Due', desc: 'Class 1 Medical expires in 45 days. Schedule examination with DME.', icon: AlertTriangle, color: 'text-amber-400', bg: 'bg-amber-500/10' },
          ].map((evt, i) => (
            <div key={i} className="relative flex items-start gap-4 pb-6 last:pb-0">
              <div className={`relative z-10 p-2 rounded-lg ${evt.bg} flex-shrink-0`}>
                <evt.icon size={14} className={evt.color} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-[10px] font-black text-white/30 uppercase tracking-wider">{evt.date}</p>
                </div>
                <p className="text-sm font-black text-white mb-1">{evt.title}</p>
                <p className="text-[11px] text-white/40 leading-relaxed">{evt.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ─── BATCH OPERATIONS (ATO / Enterprise) ─── */}
      {(profile?.role === 'ato_admin' || profile?.role === 'enterprise' || profile?.subscription_tier === 'enterprise') && (
        <div className="rounded-2xl p-6 border border-white/[0.06] bg-slate-950/60 backdrop-blur-sm">
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
        </div>
      )}
    </div>
  );
};

