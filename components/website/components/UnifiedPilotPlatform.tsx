import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import {
  Home, User, Shield, Map, BookOpen, Plane, Wrench, FileText,
  BookMarked, Calendar, Newspaper, Settings, LogOut, Bell, Search,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Clock,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Star, Target,
  BarChart3, Building2, Zap, Globe, Menu, X, Filter, Download,
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { PilotRecognitionProfilePage } from './pilot-recognition/PilotRecognitionProfilePage';

interface UnifiedPilotPlatformProps {
  onNavigate: (page: string) => void;
}

type TabId =
  | 'home' | 'profile' | 'wallet' | 'pathways' | 'programs'
  | 'airlines' | 'manufacturers' | 'atlas-cv' | 'logbook'
  | 'events' | 'newsroom' | 'settings';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
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
  enrolledInFoundation: boolean;
}> = ({ profile, walletChecks, onNavigate, setTab, enrolledInFoundation }) => {
  const [visible, setVisible] = React.useState(false);
  React.useEffect(() => { const t = setTimeout(() => setVisible(true), 80); return () => clearTimeout(t); }, []);

  const score   = profile?.recognition_score ?? 0;
  const hours   = profile?.total_flight_hours ?? 0;
  const name    = profile?.full_name || profile?.first_name || 'Pilot';
  const level   = profile?.current_occupation || 'Student Pilot';
  const initials = name.charAt(0).toUpperCase();
  const certifications = profile?.certifications || profile?.licenses || profile?.ratings || [];
  const certCount = Array.isArray(certifications) ? certifications.length : 0;
  const hoursForNext = 50;
  const progressPct = Math.min((hours / hoursForNext) * 100, 100);

  const expiredChecks = walletChecks.filter(c => c.status === 'expired');

  const dashboardCards = [
    {
      id: 'pathways',
      title: 'MY PATHWAYS',
      image: '/images/airline-operations.png',
      onClick: () => setTab('pathways'),
    },
    {
      id: 'programs',
      title: enrolledInFoundation ? 'ACCESS PROGRAMS' : 'MY PROGRAMS',
      image: 'https://res.cloudinary.com/dridtecu6/image/upload/v1776948158/sedmmczhyibdw1okfcgx.png',
      onClick: () => onNavigate(enrolledInFoundation ? 'foundational-platform' : 'foundational-program'),
    },
    {
      id: 'logbook',
      title: 'ACCESS LOGBOOK',
      image: '/images/pilotrecognitioncompoennt.png',
      onClick: () => onNavigate('digital-logbook'),
    },
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
        <div className="p-6 flex-1">
          {/* Expiry warning */}
          {expiredChecks.length > 0 && (
            <button onClick={() => setTab('wallet')} className="w-full mb-4 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-red-300 font-semibold" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={12} className="flex-shrink-0" />
              {expiredChecks.length} credential{expiredChecks.length > 1 ? 's' : ''} expired
            </button>
          )}

          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profile?.profile_image_url ? (
              <img src={profile.profile_image_url} alt={name} className="w-full h-full object-cover rounded-full border-2 border-white/30" />
            ) : (
              <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#3b82f6' }}>
                {initials}
              </div>
            )}
          </div>

          {/* Name + level */}
          <h2 className="text-base font-bold text-white text-center mb-1 tracking-wider">{name}</h2>
          <p className="text-center text-orange-400 text-xs font-semibold mb-4 uppercase tracking-wider">{level}</p>

          {/* 2×2 stats */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            {[
              { value: hours, label: 'HOURS' },
              { value: score, label: 'SCORE' },
              { value: certCount, label: 'CERTS', colour: '' },
              { value: Math.max(hoursForNext - hours, 0), label: 'TO NEXT', colour: 'text-orange-400' },
            ].map(stat => (
              <div key={stat.label} className="text-center p-2 rounded" style={{ background: 'rgba(255,255,255,0.05)' }}>
                <p className={`text-lg font-bold ${stat.colour ?? 'text-white'}`}>{stat.value}</p>
                <p className="text-xs text-white/60 uppercase">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Progress bar */}
          <div className="mb-2">
            <div className="flex justify-between text-xs text-white/60 mb-1">
              <span>LEVEL PROGRESS</span>
              <span>{Math.round(progressPct)}%</span>
            </div>
            <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full bg-gradient-to-r from-orange-500 to-red-500 transition-all duration-500" style={{ width: `${progressPct}%` }} />
            </div>
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
      </motion.div>

      {/* ── RIGHT: Image cards ── */}
      <div className="flex-1 grid grid-cols-2 gap-4 content-start">
        {/* Top card — MY PATHWAYS — full width */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
          onClick={dashboardCards[0].onClick}
          className="col-span-2 relative group cursor-pointer overflow-hidden"
          style={{ height: '200px', background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}
        >
          <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
            style={{ backgroundImage: `url(${dashboardCards[0].image})`, opacity: 0.7 }} />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-4 flex items-center gap-3">
            <div className="w-10 h-10 flex items-center justify-center bg-white/10 border border-white/20">
              <ChevronRight size={22} className="text-white" />
            </div>
            <h3 className="text-lg font-bold text-white tracking-wider">{dashboardCards[0].title}</h3>
          </div>
          <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
        </motion.div>

        {/* Bottom two cards */}
        {dashboardCards.slice(1).map((card, index) => (
          <motion.div
            key={card.id}
            custom={index + 1}
            variants={cardVariants}
            initial="hidden"
            animate={visible ? 'visible' : 'hidden'}
            onClick={card.onClick}
            className="relative group cursor-pointer overflow-hidden"
            style={{ minHeight: '160px', background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}
          >
            <div className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
              style={{ backgroundImage: `url(${card.image})`, opacity: 0.6 }} />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/50 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-3 flex items-center gap-2">
              <div className="w-8 h-8 flex items-center justify-center bg-white/10 border border-white/20">
                <ChevronRight size={18} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-white tracking-wider">{card.title}</h3>
            </div>
            <div className="absolute inset-0 border-2 border-orange-500/0 group-hover:border-orange-500/50 transition-colors duration-300 pointer-events-none" />
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
};

// ─── TAB: PROFILE ──────────────────────────────────────────────────────────
const ProfileTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-m-5 lg:-m-7">
    <PilotRecognitionProfilePage onNavigate={onNavigate} embedded={true} />
  </div>
);

// ─── TAB: WALLET ───────────────────────────────────────────────────────────
const WalletTab: React.FC<{ walletChecks: any[] }> = ({ walletChecks }) => {
  const allVerified = walletChecks.length > 0 && walletChecks.every(c => c.status === 'verified');
  const hasExpired = walletChecks.some(c => c.status === 'expired');

  const checkLabels: Record<string, string> = {
    professional_qualification: 'Pilot License (CPL/ATPL)',
    identity: 'Identity / Passport',
    education: 'Medical Certificate',
    fitness_proprietary: 'Background / NBI Check',
  };

  return (
    <motion.div className="space-y-6" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* Pre-Cleared status */}
      <div className="rounded-xl p-5" style={{ background: allVerified ? 'rgba(16,185,129,0.15)' : hasExpired ? 'rgba(239,68,68,0.15)' : 'rgba(255,255,255,0.07)', border: `1px solid ${allVerified ? 'rgba(16,185,129,0.3)' : hasExpired ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${allVerified ? 'bg-emerald-500' : hasExpired ? 'bg-red-400' : 'bg-slate-300'}`}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-0.5">Wallet Status</p>
            <p className={`text-xl font-black tracking-wider ${allVerified ? 'text-emerald-400' : hasExpired ? 'text-red-400' : 'text-white/60'}`}>
              {allVerified ? 'PRE-CLEARED' : hasExpired ? 'ACTION REQUIRED' : 'PENDING VERIFICATION'}
            </p>
            <p className="text-xs text-white/50 mt-0.5">
              {allVerified
                ? 'Both vault and Veremark signals agree. Token issued.'
                : hasExpired
                  ? 'One or more credentials have expired. Renew to restore Pre-Cleared status.'
                  : 'Verification in progress. Both vault and Veremark must confirm.'}
            </p>
          </div>
        </div>
      </div>

      {/* Architecture explanation */}
      <div className="rounded-xl p-4" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.08)' }}>
        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">Triangulation Architecture</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { label: 'Third-Party Vault', colour: 'text-blue-400', desc: 'Holds your raw documents' },
            { label: 'Veremark', colour: 'text-yellow-400', desc: 'Independently verifies' },
            { label: 'PilotRecognition', colour: 'text-emerald-400', desc: 'Displays token only' },
          ].map(c => (
            <div key={c.label} className="rounded-lg p-3" style={{ background: 'rgba(255,255,255,0.06)' }}>
              <p className={`font-bold mb-1 ${c.colour}`}>{c.label}</p>
              <p className="text-slate-400 text-[10px]">{c.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[10px] text-slate-500 mt-2 text-center italic">We never hold your credentials. We display the triangulated outcome only.</p>
      </div>

      {/* Credential checks */}
      <SectionCard title="Credential Checks">
        {walletChecks.length === 0 ? (
          <div className="text-center py-10">
            <Lock size={36} className="text-white/20 mx-auto mb-3" />
            <p className="text-white/60 text-sm font-medium mb-2">Wallet not yet set up</p>
            <p className="text-white/40 text-xs max-w-xs mx-auto">Initiate verification to connect your vault provider and Veremark. Your credentials stay with them — you get the token.</p>
            <button className="mt-4 text-xs font-bold px-5 py-2.5 rounded-lg transition-colors" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
              Initiate Verification
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {walletChecks.map((check: any) => {
              const label = checkLabels[check.check_type] ?? check.check_type.replace(/_/g, ' ').toUpperCase();
              const expiry = check.expiry_date ? new Date(check.expiry_date) : null;
              const isExpiringSoon = expiry && (expiry.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
              return (
                <div key={check.id} className="rounded-xl p-4" style={{ background: check.status === 'expired' ? 'rgba(239,68,68,0.12)' : isExpiringSoon ? 'rgba(234,179,8,0.12)' : 'rgba(255,255,255,0.06)', border: `1px solid ${check.status === 'expired' ? 'rgba(239,68,68,0.3)' : isExpiringSoon ? 'rgba(234,179,8,0.3)' : 'rgba(255,255,255,0.1)'}` }}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-white tracking-wide">{label}</p>
                    <StatusPill status={check.status} />
                  </div>
                  {expiry && (
                    <p className={`text-xs ${check.status === 'expired' ? 'text-red-400 font-semibold' : isExpiringSoon ? 'text-yellow-400 font-semibold' : 'text-white/40'}`}>
                      {check.status === 'expired' ? '⚠ Expired: ' : 'Expires: '}
                      {expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2 items-center">
                    <div className="flex-1 h-px bg-slate-100" />
                    <div className="flex gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5 text-white/30"><Eye size={9}/> Token only stored</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Consent note */}
      <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)' }}>
        <Lock size={14} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-200">
          <strong className="text-white">Your data. Your control.</strong> You manage three separate consent relationships: vault provider, Veremark, and PilotRecognition. Revoke any one and the token chain immediately invalidates.
        </p>
      </div>
    </motion.div>
  );
};

// ─── TAB: PATHWAYS ─────────────────────────────────────────────────────────
const PathwaysTab: React.FC<{ profile: any; airlines: any[]; onNavigate: (p: string) => void }> = ({ profile, airlines, onNavigate }) => {
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');

  const hours = profile?.total_flight_hours ?? 0;

  const mockPathways = airlines.slice(0, 12).map((a: any, i: number) => {
    const required = 1500 + i * 200;
    const matchPct = Math.min(100, Math.round((Math.min(hours, required) / required) * 100));
    return {
      id: a.id ?? i,
      name: a.name ?? a.airline_name ?? `Airline ${i + 1}`,
      logo: a.logo_url,
      position: i % 2 === 0 ? 'First Officer' : 'Captain',
      type: i % 3 === 0 ? 'Commercial' : i % 3 === 1 ? 'Cargo' : 'Charter',
      hours_required: required,
      match: matchPct,
      gaps: [
        hours < required && `${required - hours} more flight hours needed`,
        i % 2 === 0 && 'Type rating required',
        !profile?.recognition_score && 'Complete Recognition Profile',
      ].filter(Boolean) as string[],
    };
  });

  const filtered = mockPathways
    .filter(p => filter === 'all' || p.type.toLowerCase() === filter)
    .filter(p => !search || p.name.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => b.match - a.match);

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-3 items-center">
        <div className="relative flex-1 min-w-[180px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search airlines…"
            className="w-full pl-9 pr-4 py-2 text-sm rounded-lg text-white outline-none"
            style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }}
          />
        </div>
        <div className="flex gap-2">
          {['all', 'commercial', 'cargo', 'charter'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all tracking-wider ${filter === f ? 'text-white' : 'text-white/50 hover:text-white/80'}`}
              style={filter === f ? { background: 'rgba(249,115,22,0.25)', border: '1px solid rgba(249,115,22,0.4)' } : { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)' }}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Pathway cards grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16">
          <Map size={40} className="text-slate-300 mx-auto mb-3" />
          <p className="text-slate-500 text-sm">No pathways match your filter.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map(p => (
            <div key={p.id} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {p.logo
                      ? <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain" />
                      : <Plane size={16} className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm tracking-wide">{p.name}</p>
                    <p className="text-xs text-white/50">{p.position} · {p.type}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-black ${scoreColour(p.match)}`}>{p.match}%</p>
                  <p className="text-[10px] text-slate-400">match</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className={`h-full rounded-full ${scoreBg(p.match)}`} style={{ width: `${p.match}%` }} />
                </div>
              </div>

              {/* Gaps */}
              {p.gaps.length > 0 && (
                <div className="mb-4 space-y-1">
                  {p.gaps.map((gap, gi) => (
                    <p key={gi} className="text-xs text-white/50 flex items-center gap-1.5">
                      <XCircle size={10} className="text-red-400 flex-shrink-0" /> {gap}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 text-xs font-bold py-2 rounded-lg transition-colors tracking-wider" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.15)' }}>
                  EXPRESS INTEREST
                </button>
                <button className="px-3 py-2 rounded-lg transition-colors" style={{ border: '1px solid rgba(255,255,255,0.15)', background: 'transparent' }}>
                  <ChevronRight size={14} className="text-white/40" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TAB: PROGRAMS ─────────────────────────────────────────────────────────
const ProgramsTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const programs = [
    {
      id: 'foundation',
      name: 'Foundation Program',
      price: '$49',
      desc: 'Pilot development, leadership, cognitive skills, and mentorship. Complete 50 hours of mentorship to earn your Recognition endorsement.',
      badge: 'EFFORT-BASED',
      badgeColour: 'bg-yellow-100 text-yellow-700',
      features: ['Leadership & cognitive skills', '50-hour mentorship', 'Recognition Score boost', '50% discount on Transition'],
      cta: 'Enroll — $49',
      route: 'foundational-program',
    },
    {
      id: 'transition',
      name: 'Transition Program',
      price: '$299',
      discount: '$149 for Foundation graduates',
      desc: 'Airline transition, 9 core competencies, Airbus HINFACT, Atlas CV formatting, and industry internship placement.',
      badge: 'AIRLINE-READY',
      badgeColour: 'bg-blue-100 text-blue-700',
      features: ['9 core airline competencies', 'Airbus HINFACT alignment', 'EBT video scoring bundled', 'Atlas CV generation'],
      cta: 'Enroll — $299',
      route: 'transition-program',
    },
    {
      id: 'ebt',
      name: 'EBT Video Assessment',
      price: 'Bundled',
      desc: 'Recorded interview scored on cognitive behaviorism and constructivism. Airlines can view your EBT result as part of the pulling system.',
      badge: 'PROPRIETARY IP',
      badgeColour: 'bg-purple-100 text-purple-700',
      features: ['Recorded interview', 'Behavioural scoring', 'Airline-viewable result', 'Bundled with Transition Program'],
      cta: 'Bundled with Transition',
      route: 'transition-program',
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {programs.map(prog => (
        <div key={prog.id} className="rounded-xl overflow-hidden flex flex-col" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="px-5 py-4" style={{ background: 'rgba(15,23,42,0.8)' }}>
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-bold tracking-wider">{prog.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prog.badgeColour}`}>{prog.badge}</span>
            </div>
            <p className="text-2xl font-black text-white">{prog.price}</p>
            {prog.discount && <p className="text-xs text-white/40 mt-0.5">{prog.discount}</p>}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <p className="text-sm text-white/60 mb-4 leading-relaxed">{prog.desc}</p>
            <ul className="space-y-2 mb-5 flex-1">
              {prog.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-white/70">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate(prog.route)}
              className="w-full text-xs font-bold py-2.5 rounded-lg transition-colors tracking-wider" style={{ background: 'rgba(249,115,22,0.8)', color: 'white', border: '1px solid rgba(249,115,22,0.5)' }}
            >
              {prog.cta}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
};

// ─── TAB: AIRLINES ─────────────────────────────────────────────────────────
const AirlinesTab: React.FC<{ airlines: any[] }> = ({ airlines }) => {
  const [search, setSearch] = useState('');
  const filtered = airlines.filter(a => !search || (a.name ?? a.airline_name ?? '').toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-white/40" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search airlines…"
          className="w-full pl-9 pr-4 py-2 text-sm rounded-lg text-white outline-none"
          style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)', color: 'white' }} />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Plane size={40} className="text-slate-300 mx-auto mb-3" /><p className="text-slate-500 text-sm">No airlines found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a: any, i: number) => (
            <div key={a.id ?? i} className="rounded-xl p-4 transition-all hover:scale-[1.01]" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {a.logo_url
                    ? <img src={a.logo_url} alt={a.name} className="w-8 h-8 object-contain" />
                    : <Plane size={16} className="text-slate-400" />}
                </div>
                <div>
                  <p className="font-bold text-white text-sm tracking-wide">{a.name ?? a.airline_name}</p>
                  <p className="text-xs text-white/50">{a.country ?? a.headquarters ?? '—'}</p>
                </div>
              </div>
              {a.minimum_hours && (
                <p className="text-xs text-white/50"><span className="font-semibold text-white/70">Min hours:</span> {a.minimum_hours.toLocaleString()}</p>
              )}
              {a.fleet_type && (
                <p className="text-xs text-white/50 mt-1"><span className="font-semibold text-white/70">Fleet:</span> {a.fleet_type}</p>
              )}
              <button className="mt-3 w-full text-xs font-bold rounded-lg py-1.5 transition-colors flex items-center justify-center gap-1 tracking-wider" style={{ color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.1)' }}>
                View Pathway <ChevronRight size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

// ─── TAB: MANUFACTURERS ────────────────────────────────────────────────────
const ManufacturersTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => {
  const manufacturers = [
    { name: 'Airbus', aircraft: ['A220', 'A320neo', 'A330', 'A350', 'A380'], desc: 'European manufacturer. HINFACT EBT framework. A320 family most common type rating.' },
    { name: 'Boeing', aircraft: ['737 MAX', '747-8', '767', '777X', '787'], desc: 'US manufacturer. CAST safety standards. 737 NG/MAX most widely held type rating.' },
    { name: 'ATR', aircraft: ['ATR 42', 'ATR 72'], desc: 'Turboprop regional. Common first turboprop type rating in Southeast Asia and Africa.' },
    { name: 'Embraer', aircraft: ['E170', 'E175', 'E190', 'E195-E2'], desc: 'Brazilian manufacturer. E-Jet family dominant in regional operations.' },
    { name: 'Bombardier', aircraft: ['CRJ200', 'CRJ700', 'CRJ900', 'Q400'], desc: 'Canadian manufacturer. CRJ series dominant North American regional platform.' },
    { name: 'COMAC', aircraft: ['ARJ21', 'C919'], desc: 'Chinese state manufacturer. C919 entering service — growing demand for type ratings.' },
  ];
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
      {manufacturers.map(m => (
        <div key={m.name} className="rounded-xl p-5 transition-all hover:scale-[1.01]" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-xs font-black">{m.name.slice(0, 2).toUpperCase()}</span>
            </div>
            <p className="font-bold text-white tracking-wider">{m.name}</p>
          </div>
          <p className="text-xs text-white/55 mb-3 leading-relaxed">{m.desc}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {m.aircraft.map(ac => (
              <span key={ac} className="text-[10px] font-semibold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.65)' }}>{ac}</span>
            ))}
          </div>
          <button onClick={() => onNavigate('type-rating-search')} className="w-full text-xs font-bold rounded-lg py-1.5 transition-colors tracking-wider" style={{ color: '#fb923c', border: '1px solid rgba(249,115,22,0.3)', background: 'rgba(249,115,22,0.1)' }}>
            Find Type Rating Centres
          </button>
        </div>
      ))}
    </div>
  );
};

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
const LogbookTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => (
  <div className="space-y-5">
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {[
        { label: 'Total Hours',     value: `${(profile?.total_flight_hours ?? 0).toLocaleString()}` },
        { label: 'PIC Hours',       value: `${(profile?.pic_hours ?? 0).toLocaleString()}` },
        { label: 'Night Hours',     value: `${(profile?.night_hours ?? 0).toLocaleString()}` },
        { label: 'Instrument Hours',value: `${(profile?.instrument_hours ?? 0).toLocaleString()}` },
      ].map(stat => (
        <div key={stat.label} className="rounded-xl p-4 text-center" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <p className="text-2xl font-black text-white">{stat.value}</p>
          <p className="text-xs text-white/50 mt-1 uppercase tracking-wider">{stat.label}</p>
        </div>
      ))}
    </div>
    <div className="rounded-xl p-6 text-center" style={{ background: 'rgba(30,41,59,0.75)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <BookMarked size={36} className="text-white/20 mx-auto mb-3" />
      <p className="text-white font-bold text-sm mb-2 tracking-wider">DIGITAL LOGBOOK</p>
      <p className="text-white/40 text-xs mb-4">Log flights, track hours by category, and sync with your Recognition Score automatically.</p>
      <button onClick={() => onNavigate('digital-logbook')} className="text-xs font-bold px-6 py-2.5 rounded-lg transition-colors tracking-wider" style={{ background: 'rgba(249,115,22,0.8)', color: 'white', border: '1px solid rgba(249,115,22,0.5)' }}>
        OPEN FULL LOGBOOK
      </button>
    </div>
  </div>
);

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

  React.useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastInteraction.current >= 6000) {
        setActiveIdx(prev => (prev + 1) % filtered.length);
      }
    }, 6000);
    return () => clearInterval(interval);
  }, [filtered.length]);

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

// ─── TAB: SETTINGS ─────────────────────────────────────────────────────────
const SettingsTab: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const sections = [
    { title: 'Account', items: ['Edit Profile', 'Change Password', 'Email Preferences'] },
    { title: 'Consent & Privacy', items: ['Manage Vault Consent', 'Manage Veremark Consent', 'Operator Access Log', 'Download My Data', 'Delete Account'] },
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
      <button onClick={onLogout} className="flex items-center gap-2 text-xs text-red-400 font-bold hover:text-red-300 transition-colors px-3 py-2 tracking-wider">
        <LogOut size={14} /> SIGN OUT
      </button>
    </div>
  );
};

// ─── MAIN SHELL ────────────────────────────────────────────────────────────
export const UnifiedPilotPlatform: React.FC<UnifiedPilotPlatformProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() => (searchParams.get('tab') as TabId) ?? 'home');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [walletChecks, setWalletChecks] = useState<any[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [notifCount] = useState(0);
  const [profileData, setProfileData] = useState<any>(userProfile);

  // Sync URL with active tab
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Sync incoming URL param
  useEffect(() => {
    const t = searchParams.get('tab') as TabId;
    if (t && t !== activeTab) setActiveTab(t);
  }, []); // eslint-disable-line

  // Keep profileData in sync
  useEffect(() => { setProfileData(userProfile); }, [userProfile]);

  // Fetch wallet checks
  useEffect(() => {
    if (!currentUser) return;
    supabase
      .from('verification_checks')
      .select('*')
      .then(({ data }) => { if (data) setWalletChecks(data); });
  }, [currentUser]);

  // Fetch airlines
  useEffect(() => {
    supabase
      .from('airlines')
      .select('id, name, logo_url, country, minimum_hours, fleet_type')
      .limit(50)
      .then(({ data }) => { if (data) setAirlines(data); });
  }, []);

  const handleLogout = useCallback(async () => {
    await logout();
    onNavigate('home');
  }, [logout, onNavigate]);

  const setTab = (t: TabId) => {
    setActiveTab(t);
    setSidebarOpen(false);
  };

  const displayName = profileData?.full_name || profileData?.first_name || currentUser?.email?.split('@')[0] || 'Pilot';
  const initials = displayName.charAt(0).toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':          return <HomeTab profile={profileData} walletChecks={walletChecks} onNavigate={onNavigate} setTab={setTab} enrolledInFoundation={false} />;
      case 'profile':       return <ProfileTab onNavigate={onNavigate} />;
      case 'wallet':        return <WalletTab walletChecks={walletChecks} />;
      case 'pathways':      return <PathwaysTab profile={profileData} airlines={airlines} onNavigate={onNavigate} />;
      case 'programs':      return <ProgramsTab onNavigate={onNavigate} />;
      case 'airlines':      return <AirlinesTab airlines={airlines} />;
      case 'manufacturers': return <ManufacturersTab onNavigate={onNavigate} />;
      case 'atlas-cv':      return <AtlasCVTab profile={profileData} onNavigate={onNavigate} />;
      case 'logbook':       return <LogbookTab profile={profileData} onNavigate={onNavigate} />;
      case 'events':        return <EventsTab />;
      case 'newsroom':      return <NewsroomTab onNavigate={onNavigate} />;
      case 'settings':      return <SettingsTab onLogout={handleLogout} />;
      default:              return null;
    }
  };

  const activeNavItem = NAV_ITEMS.find(n => n.id === activeTab);

  return (
    <div className="relative min-h-screen flex flex-col font-sans">

      {/* ── BACKGROUND: Portal 2 MeshGradient ── */}
      <div className="fixed inset-0 z-0">
        <MeshGradient
          className="w-full h-full"
          colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
          speed={0.22}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* ── TOP NAV BAR (Portal 2 style) ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-2"
        style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(10px)', borderBottom: '1px solid rgba(255,255,255,0.1)', height: '48px' }}
      >
        {/* Left — hamburger + nav items */}
        <div className="flex items-center gap-0 min-w-0 flex-1 overflow-x-auto scrollbar-none">
          <button className="lg:hidden mr-2 flex-shrink-0 text-white/70 hover:text-white" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={20} />
          </button>
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className="relative flex-shrink-0 px-2 py-2 flex items-center gap-1 transition-all duration-200"
                style={{
                  background: isActive ? 'rgba(255,255,255,0.95)' : 'transparent',
                  color: isActive ? '#0f172a' : 'rgba(255,255,255,0.65)',
                  borderBottom: isActive ? '2px solid #0ea5e9' : '2px solid transparent',
                }}
              >
                <Icon size={12} />
                <span className="text-[10px] font-bold tracking-wide whitespace-nowrap">{item.label.toUpperCase()}</span>
              </button>
            );
          })}
        </div>

        {/* Right — search + bell + avatar */}
        <div className="flex items-center gap-2 flex-shrink-0 ml-2">
          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 w-40">
            <Search size={12} className="text-white/50" />
            <input placeholder="Search…" className="bg-transparent text-xs text-white outline-none placeholder:text-white/40 w-full" />
          </div>

          {/* Notification bell */}
          <button className="relative w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-all">
            <Bell size={16} />
            {notifCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
            )}
          </button>

          {/* Avatar */}
          <button
            onClick={() => setTab('profile')}
            className="w-11 h-14 bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-lg overflow-hidden"
            style={{ borderRadius: '45% / 50%' }}
          >
            {profileData?.profile_image_url
              ? <img src={profileData.profile_image_url} alt={displayName} className="w-full h-full object-cover" />
              : <span className="text-base font-bold text-slate-700">{initials}</span>}
          </button>
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
          className={`fixed top-0 left-0 bottom-0 z-40 flex flex-col w-60 flex-shrink-0 transition-transform duration-200 pt-[48px] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
          style={{ background: 'rgba(15,23,42,0.92)', backdropFilter: 'blur(12px)', borderRight: '1px solid rgba(255,255,255,0.08)' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 px-5 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="w-7 h-7 bg-orange-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Plane size={14} className="text-white" />
            </div>
            <div>
              <p className="text-[11px] font-black text-white leading-none tracking-widest">PILOT</p>
              <p className="text-[11px] font-black text-orange-400 leading-none tracking-widest">RECOGNITION</p>
            </div>
            <button className="ml-auto lg:hidden text-white/50 hover:text-white" onClick={() => setSidebarOpen(false)}><X size={15} /></button>
          </div>

          {/* Nav items */}
          <nav className="flex-1 px-2 py-3 overflow-y-auto space-y-0.5">
            {NAV_ITEMS.map(item => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setTab(item.id)}
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150"
                  style={{
                    background: isActive ? 'rgba(255,255,255,0.12)' : 'transparent',
                    color: isActive ? '#fff' : 'rgba(255,255,255,0.55)',
                    borderLeft: isActive ? '2px solid #f97316' : '2px solid transparent',
                  }}
                >
                  <Icon size={15} className={isActive ? 'text-orange-400' : ''} />
                  <span className={`flex-1 text-left text-xs font-bold tracking-wider ${isActive ? 'text-white' : ''}`}>
                    {item.label.toUpperCase()}
                  </span>
                  {item.badge ? <span className="bg-red-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
                </button>
              );
            })}
          </nav>

          {/* Bottom user strip */}
          <div className="px-4 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3">
              <div
                className="w-9 h-9 rounded-full bg-slate-600 flex items-center justify-center text-white text-xs font-bold flex-shrink-0 overflow-hidden"
              >
                {profileData?.profile_image_url
                  ? <img src={profileData.profile_image_url} alt={displayName} className="w-full h-full object-cover" />
                  : initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-white truncate">{displayName}</p>
                <p className="text-[10px] text-white/40 truncate">{currentUser?.email}</p>
              </div>
              <button onClick={handleLogout} className="text-white/30 hover:text-white/80 transition-colors flex-shrink-0">
                <LogOut size={14} />
              </button>
            </div>
          </div>
        </aside>

        {/* ── MAIN CONTENT ── */}
        <main className="flex-1 h-screen overflow-y-auto pt-12 lg:ml-60">
          <div className="max-w-[1200px] mx-auto p-5 lg:p-7">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedPilotPlatform;
