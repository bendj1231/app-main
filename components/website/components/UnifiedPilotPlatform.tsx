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
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye,
  Brain, FolderOpen, PlayCircle, GraduationCap
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { PilotRecognitionProfilePage } from './pilot-recognition/PilotRecognitionProfilePage';
import TypeRatingSearchPage from '../../../pages/TypeRatingSearchPage';
import { PortalAirlineExpectationsPage } from '../../../portal/pages/PortalAirlineExpectationsPage';
import { PathwaysPageModern } from '../../../portal/pages/PathwaysPageModern';
import FlightInstrumentDashboard from './dashboard/FlightInstrumentDashboard';

interface UnifiedPilotPlatformProps {
  onNavigate: (page: string) => void;
}

type TabId =
  | 'home' | 'profile' | 'wallet' | 'pathways' | 'programs'
  | 'airlines' | 'manufacturers' | 'atlas-cv' | 'logbook'
  | 'events' | 'newsroom' | 'settings' | 'score' | 'dashboard';

interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { id: 'dashboard',     label: 'Dashboard',       icon: BarChart3 },
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
  enrolledInFoundation: boolean; airlines: any[];
}> = ({ profile, walletChecks, onNavigate, setTab, enrolledInFoundation, airlines }) => {
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
  const [obTokenising, setObTokenising] = React.useState(false);
  const [obDone, setObDone] = React.useState(false);

  const startTokenise = () => {
    setObTokenising(true);
    setOnboardingStep(4);
    setTimeout(() => { setObTokenising(false); setObDone(true); }, 3200);
  };

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
        <div className="p-6 flex-1">
          {expiredChecks.length > 0 && (
            <button onClick={() => setTab('wallet')} className="w-full mb-4 flex items-center gap-2 px-3 py-2 text-xs text-red-300 font-semibold" style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              <AlertTriangle size={12} className="flex-shrink-0" />
              {expiredChecks.length} credential{expiredChecks.length > 1 ? 's' : ''} expired
            </button>
          )}

          {/* Avatar */}
          <div className="relative w-24 h-24 mx-auto mb-4">
            {profile?.profile_image_url
              ? <img src={profile.profile_image_url} alt={name} className="w-full h-full object-cover rounded-full border-2 border-white/30" />
              : <div className="w-full h-full rounded-full flex items-center justify-center text-white font-bold text-xl" style={{ backgroundColor: '#3b82f6' }}>{initials}</div>}
          </div>

          <h2 className="text-base font-bold text-white text-center mb-1 tracking-wider">{name}</h2>
          <p className="text-center text-orange-400 text-xs font-semibold mb-4 uppercase tracking-wider">{level}</p>

          {/* 2×2 stats — gamified empty states */}
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

          {/* Progress bar — visible track */}
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

        {/* Recognition+ upgrade tile — gold accent */}
        <button
          onClick={() => setTab('settings' as TabId)}
          className="w-full flex flex-col gap-1 px-5 py-4 transition-all hover:brightness-110"
          style={{ background: 'linear-gradient(135deg, rgba(234,179,8,0.18), rgba(251,146,60,0.12))', borderTop: '1px solid rgba(234,179,8,0.35)' }}
        >
          <div className="flex items-center gap-2">
            <Star size={13} className="text-yellow-400 flex-shrink-0" />
            <span className="text-xs font-black text-yellow-300 tracking-wider">RECOGNITION+</span>
          </div>
          <p className="text-[10px] text-yellow-500/80 font-semibold leading-snug">Priority pipeline access, unlimited pathway views & AI coach</p>
          <div className="mt-1 w-full py-1.5 text-center text-[11px] font-black tracking-widest text-slate-900 rounded" style={{ background: 'linear-gradient(90deg, #fbbf24, #f97316)' }}>
            UPGRADE NOW — $99/YR
          </div>
        </button>
      </motion.div>

      {/* ── RIGHT: Get Started (top) + alerts + bento cards ── */}
      <div className="flex-1 flex flex-col gap-4">

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
            <p className="text-xs font-black text-white tracking-wide leading-none">Account Activation Required</p>
            <p className="text-[10px] text-white/35 mt-0.5 leading-snug">Verify your credentials and flight logs to unlock airline pathways.</p>
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
          {/* Right: master CTA */}
          <button
            onClick={() => { setOnboardingOpen(true); setOnboardingStep(1); setObDone(false); }}
            className="flex-shrink-0 flex items-center gap-2 px-5 py-2.5 text-xs font-black tracking-widest text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.85), rgba(99,102,241,0.85))', border: '1px solid rgba(99,102,241,0.5)' }}
          >
            GET STARTED <ChevronRight size={13} />
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
            style={{ background: 'rgba(10,18,36,0.98)', border: '1px solid rgba(255,255,255,0.1)', maxHeight: '90vh', overflowY: 'auto' }}
          >
            {/* Modal header */}
            <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase mb-0.5">Multi-Party Verification</p>
                <p className="text-sm font-black text-white tracking-wide">
                  {obDone ? 'Verification Initiated' : onboardingStep === 1 ? 'Step 1 — Training Details' : onboardingStep === 2 ? 'Step 2 — Processing Notice' : onboardingStep === 3 ? 'Step 3 — Cryptographic Consent' : 'Step 4 — Token Generation'}
                </p>
              </div>
              {!obTokenising && (
                <button onClick={() => setOnboardingOpen(false)} className="text-white/25 hover:text-white/70 transition-colors">
                  <X size={18} />
                </button>
              )}
            </div>

            {/* Step progress bar */}
            <div className="flex gap-1.5 px-6 pt-4 flex-shrink-0">
              {[1,2,3,4].map(s => (
                <div key={s} className="flex-1 h-1 overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
                  <div
                    className="h-full transition-all duration-600"
                    style={{ width: onboardingStep >= s ? '100%' : '0%', background: obDone ? '#34d399' : 'linear-gradient(90deg,#3b82f6,#6366f1)' }}
                  />
                </div>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4">

              {/* ── STEP 1: ATO Selection + Pilot Details ── */}
              {onboardingStep === 1 && (
                <>
                  <p className="text-[11px] text-white/45 leading-relaxed">
                    Select your primary Approved Training Organisation and provide your pilot licence details. Veremark will contact these parties to issue your cryptographic verification token.
                  </p>
                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-white/35 uppercase block mb-1.5">Primary ATO / Flight School *</label>
                      <select
                        value={obATO}
                        onChange={e => setObATO(e.target.value)}
                        className="w-full px-3 py-2.5 text-xs font-semibold text-white outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                      >
                        <option value="" style={{ background: '#0a1224' }}>— Select ATO —</option>
                        {ATO_LIST.map(a => <option key={a} value={a} style={{ background: '#0a1224' }}>{a}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-black tracking-widest text-white/35 uppercase block mb-1.5">Pilot Licence No. *</label>
                        <input
                          type="text"
                          value={obLicense}
                          onChange={e => setObLicense(e.target.value)}
                          placeholder="e.g. 155660-CPL"
                          className="w-full px-3 py-2.5 text-xs text-white placeholder-white/20 outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-black tracking-widest text-white/35 uppercase block mb-1.5">Medical Class *</label>
                        <select
                          value={obMedical}
                          onChange={e => setObMedical(e.target.value)}
                          className="w-full px-3 py-2.5 text-xs font-semibold text-white outline-none"
                          style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                          <option value="" style={{ background: '#0a1224' }}>— Select Class —</option>
                          {['Class 1 (Commercial)', 'Class 2 (Private)', 'Class 3 (ATCO)'].map(c => <option key={c} value={c} style={{ background: '#0a1224' }}>{c}</option>)}
                        </select>
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black tracking-widest text-white/35 uppercase block mb-1.5">Radio Certificate / NTC Reg. No.</label>
                      <input
                        type="text"
                        value={obRadio}
                        onChange={e => setObRadio(e.target.value)}
                        placeholder="e.g. 22 RANCR-22517 (optional)"
                        className="w-full px-3 py-2.5 text-xs text-white placeholder-white/20 outline-none"
                        style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.12)' }}
                      />
                    </div>
                  </div>
                  <div className="flex items-start gap-2 p-3" style={{ background: 'rgba(59,130,246,0.07)', border: '1px solid rgba(59,130,246,0.18)' }}>
                    <Lock size={10} className="text-blue-400 flex-shrink-0 mt-0.5" />
                    <p className="text-[9px] text-blue-300/60 leading-relaxed">These details are used only to initiate verification. PilotRecognition.com never stores your raw licence number — only the cryptographic token result is retained.</p>
                  </div>
                  <button
                    disabled={!obATO || !obLicense || !obMedical}
                    onClick={() => setOnboardingStep(2)}
                    className="w-full py-3 text-xs font-black tracking-widest text-white transition-all disabled:opacity-25"
                    style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.85),rgba(99,102,241,0.85))', border: '1px solid rgba(99,102,241,0.4)' }}
                  >
                    CONTINUE →
                  </button>
                </>
              )}

              {/* ── STEP 2: Surcharge Transparency ── */}
              {onboardingStep === 2 && (
                <>
                  <div className="p-4 space-y-3" style={{ background: 'rgba(234,179,8,0.07)', border: '1px solid rgba(234,179,8,0.28)' }}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-yellow-300 tracking-wide mb-1.5">EXTERNAL PROCESSING NOTICE</p>
                        <p className="text-[11px] text-yellow-200/65 leading-relaxed">
                          <strong className="text-white">Recognition+ includes 1 standard regional ATO verification per year.</strong> Selecting multiple ATOs or requesting verifications across different civil aviation regions will incur an external regional processing surcharge charged directly by our verification provider, Veremark.
                        </p>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-1">
                      {[
                        { tier: 'Standard (1 ATO)', note: 'Included in Recognition+', colour: 'text-emerald-400', bg: 'rgba(16,185,129,0.1)', border: 'rgba(16,185,129,0.25)' },
                        { tier: 'Additional ATO',   note: 'Regional surcharge applies', colour: 'text-yellow-400', bg: 'rgba(234,179,8,0.1)',   border: 'rgba(234,179,8,0.25)'   },
                      ].map(t => (
                        <div key={t.tier} className="p-2.5" style={{ background: t.bg, border: `1px solid ${t.border}` }}>
                          <p className={`text-[10px] font-black ${t.colour}`}>{t.tier}</p>
                          <p className="text-[9px] text-white/35 mt-0.5">{t.note}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <p className="text-[10px] text-white/30 uppercase tracking-widest font-black mb-2">Selected ATO</p>
                    <p className="text-xs text-white font-semibold">{obATO}</p>
                    <div className="flex items-center gap-1.5 mt-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <p className="text-[9px] text-white/35">Standard regional verification — covered by your plan</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <button onClick={() => setOnboardingStep(1)} className="flex-1 py-2.5 text-xs font-bold text-white/40 tracking-wider transition-all hover:text-white/70" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>← BACK</button>
                    <button onClick={() => setOnboardingStep(3)} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white" style={{ background: 'linear-gradient(135deg,rgba(59,130,246,0.85),rgba(99,102,241,0.85))', border: '1px solid rgba(99,102,241,0.4)' }}>UNDERSTOOD, PROCEED →</button>
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
const ProfileTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <PilotRecognitionProfilePage onNavigate={onNavigate} embedded={true} />
);

// ─── TAB: WALLET ───────────────────────────────────────────────────────────
const ATO_LIST = [
  'Philippine Airlines Training Centre', 'CAE Oxford Aviation Academy', 'Emirates Flight Training Academy',
  'FlightPath International', 'Lufthansa Aviation Training', 'Philippine Academy of Aviation Technology',
  'Asia Pacific Aviation Centre', 'CAA Approved Local ATO', 'Other / Not Listed',
];

const WalletTab: React.FC<{ walletChecks: any[] }> = ({ walletChecks }) => {
  const allVerified = walletChecks.length > 0 && walletChecks.every(c => c.status === 'verified');
  const hasExpired  = walletChecks.some(c => c.status === 'expired');
  const hasFlagged  = walletChecks.some(c => c.status === 'flagged');

  const [wizardOpen, setWizardOpen]   = React.useState(false);
  const [wizardStep, setWizardStep]   = React.useState(1);
  const [selectedATO, setSelectedATO] = React.useState('');
  const [consentSigned, setConsentSigned] = React.useState(false);

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

  return (
    <motion.div className="space-y-5 max-w-4xl" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>

      {/* ── Pre-Cleared status banner ── */}
      <div className="p-5 flex items-center gap-5"
        style={{ background: allVerified ? 'rgba(16,185,129,0.12)' : hasFlagged ? 'rgba(234,179,8,0.12)' : hasExpired ? 'rgba(239,68,68,0.12)' : 'rgba(255,255,255,0.05)', border: `1px solid ${allVerified ? 'rgba(16,185,129,0.3)' : hasFlagged ? 'rgba(234,179,8,0.3)' : hasExpired ? 'rgba(239,68,68,0.3)' : 'rgba(255,255,255,0.1)'}` }}
      >
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
        {!allVerified && (
          <button
            onClick={() => { setWizardOpen(true); setWizardStep(1); }}
            className="flex-shrink-0 px-5 py-2.5 text-xs font-black tracking-wider text-white transition-all hover:brightness-110"
            style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}
          >
            INITIATE VERIFICATION
          </button>
        )}
      </div>

      {/* ── Zero-knowledge architecture strip ── */}
      <div className="p-4" style={{ background: 'rgba(15,23,42,0.95)', border: '1px solid rgba(255,255,255,0.07)' }}>
        <p className="text-[10px] font-black tracking-[0.2em] text-emerald-400 uppercase mb-3">Zero-Knowledge Triangulation — How It Works</p>
        <div className="grid grid-cols-5 gap-0 items-center text-center text-[10px]">
          {[
            { label: 'YOUR VAULT', sub: 'Holds raw documents', colour: 'text-sky-400', border: 'rgba(56,189,248,0.3)' },
            { arrow: true },
            { label: 'VEREMARK', sub: 'Independently verifies', colour: 'text-yellow-400', border: 'rgba(234,179,8,0.3)' },
            { arrow: true },
            { label: 'PILOTRECOGNITION', sub: 'Token display only — zero raw data', colour: 'text-emerald-400', border: 'rgba(16,185,129,0.3)' },
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
        <p className="text-[9px] text-white/20 mt-2 text-center">We never store, read, or transmit your raw PII. Only a cryptographic hash is surfaced here.</p>
      </div>

      {/* ── Credential cards ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-xs font-black tracking-widest text-white/60 uppercase">Credential Vault</p>
          {walletChecks.length > 0 && (
            <button
              onClick={() => { setWizardOpen(true); setWizardStep(1); }}
              className="text-[10px] font-bold px-3 py-1.5 tracking-wider text-white/70 hover:text-white transition-colors"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)' }}
            >
              + ADD CREDENTIAL
            </button>
          )}
        </div>

        {walletChecks.length === 0 ? (
          <div className="text-center py-14" style={{ background: 'rgba(255,255,255,0.03)', border: '1px dashed rgba(255,255,255,0.1)' }}>
            <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <Lock size={28} className="text-white/20" />
            </div>
            <p className="text-white/50 text-sm font-bold mb-1 tracking-wide">NO CREDENTIALS YET</p>
            <p className="text-white/25 text-xs max-w-xs mx-auto mb-5">Initiate verification to connect your vault provider and Veremark. Your documents stay with them — you receive a cryptographic token.</p>
            <button
              onClick={() => { setWizardOpen(true); setWizardStep(1); }}
              className="text-xs font-black px-6 py-3 tracking-widest text-white transition-all hover:brightness-110"
              style={{ background: 'linear-gradient(135deg, rgba(59,130,246,0.8), rgba(99,102,241,0.8))', border: '1px solid rgba(99,102,241,0.4)' }}
            >
              INITIATE VERIFICATION
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {walletChecks.map((check: any) => {
              const label  = checkLabels[check.check_type] ?? check.check_type.replace(/_/g, ' ').toUpperCase();
              const expiry = check.expiry_date ? new Date(check.expiry_date) : null;
              const isExpiringSoon = expiry && (expiry.getTime() - Date.now()) < 30 * 24 * 60 * 60 * 1000;
              const st = statusConfig[(check.status as keyof typeof statusConfig)] ?? statusConfig.pending;
              return (
                <div key={check.id} className="p-4" style={{ background: st.bg, border: `1px solid ${st.border}` }}>
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-xs font-black text-white tracking-wider">{label}</p>
                      {/* Masked token */}
                      <p className="text-[10px] font-mono mt-0.5" style={{ color: 'rgba(255,255,255,0.3)' }}>
                        {check.id ? maskToken(check.id) : '• • • • • • • • •'}
                      </p>
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
                    {check.status === 'flagged' && (
                      <button className="text-[9px] font-black px-2.5 py-1 tracking-wider" style={{ background: 'rgba(234,179,8,0.2)', border: '1px solid rgba(234,179,8,0.4)', color: '#fbbf24' }}>
                        RESOLVE FLAG WITH ATO →
                      </button>
                    )}
                    {check.status === 'expired' && (
                      <button onClick={() => { setWizardOpen(true); setWizardStep(1); }} className="text-[9px] font-black px-2.5 py-1 tracking-wider" style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}>
                        RE-VERIFY →
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* ── Consent note ── */}
      <div className="flex items-start gap-3 p-4" style={{ background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.2)' }}>
        <Lock size={13} className="text-blue-400 flex-shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-200 leading-relaxed">
          <strong className="text-white">Your data. Your control.</strong> You manage three separate consent chains: your vault provider, Veremark, and PilotRecognition.com. Revoking any one immediately invalidates the cryptographic token and removes operator access.
        </p>
      </div>

      {/* ── VERIFICATION WIZARD MODAL ── */}
      {wizardOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(8px)' }}>
          <motion.div
            className="w-full max-w-lg"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            style={{ background: 'rgba(15,23,42,0.98)', border: '1px solid rgba(255,255,255,0.12)' }}
          >
            {/* Wizard header */}
            <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
              <div>
                <p className="text-xs font-black tracking-widest text-white/40 uppercase">Credential Verification</p>
                <p className="text-sm font-black text-white tracking-wide mt-0.5">
                  {wizardStep === 1 ? 'Step 1 — Select Your ATO' : wizardStep === 2 ? 'Step 2 — Surcharge Notice' : 'Step 3 — Consent Sign-Off'}
                </p>
              </div>
              <button onClick={() => setWizardOpen(false)} className="text-white/30 hover:text-white transition-colors"><X size={18} /></button>
            </div>

            {/* Step indicators */}
            <div className="flex px-6 pt-4 gap-2">
              {[1, 2, 3].map(s => (
                <div key={s} className="flex-1 h-1 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                  <div className={`h-full transition-all duration-500 ${wizardStep >= s ? 'bg-sky-500' : 'bg-transparent'}`} style={{ width: wizardStep >= s ? '100%' : '0%' }} />
                </div>
              ))}
            </div>

            <div className="px-6 py-5 space-y-4">
              {/* Step 1 — ATO Selector */}
              {wizardStep === 1 && (
                <>
                  <p className="text-xs text-white/50 leading-relaxed">Select the Approved Training Organisation (ATO) or flight school whose records will be contacted during verification. This allows Veremark to securely request confirmation of your logged hours.</p>
                  <div>
                    <label className="text-[10px] font-black tracking-widest text-white/40 uppercase block mb-2">Your Flight School / ATO</label>
                    <select
                      value={selectedATO}
                      onChange={e => setSelectedATO(e.target.value)}
                      className="w-full px-3 py-2.5 text-xs font-semibold text-white rounded-none outline-none"
                      style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.15)' }}
                    >
                      <option value="" style={{ background: '#0f172a' }}>— Select an ATO —</option>
                      {ATO_LIST.map(a => <option key={a} value={a} style={{ background: '#0f172a' }}>{a}</option>)}
                    </select>
                  </div>
                  <button
                    disabled={!selectedATO}
                    onClick={() => setWizardStep(2)}
                    className="w-full py-3 text-xs font-black tracking-widest text-white transition-all disabled:opacity-30"
                    style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}
                  >
                    CONTINUE →
                  </button>
                </>
              )}

              {/* Step 2 — Surcharge notice */}
              {wizardStep === 2 && (
                <>
                  <div className="p-4" style={{ background: 'rgba(234,179,8,0.08)', border: '1px solid rgba(234,179,8,0.3)' }}>
                    <div className="flex items-start gap-3">
                      <AlertTriangle size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-xs font-black text-yellow-300 tracking-wide mb-1">VERIFICATION SURCHARGE NOTICE</p>
                        <p className="text-[11px] text-yellow-200/70 leading-relaxed">
                          <strong className="text-white">Recognition+ includes 1 standard regional ATO verification per year.</strong> Adding multiple training organisations (ATOs) or requesting verifications outside your home region will incur an external regional processing surcharge from our verification provider, Veremark.
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    <p className="text-[10px] text-white/40 uppercase tracking-widest font-bold mb-2">Selected ATO</p>
                    <p className="text-xs text-white font-semibold">{selectedATO}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <div className="w-2 h-2 rounded-full bg-emerald-400" />
                      <p className="text-[10px] text-white/40">1 standard regional verification — included in your plan</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <button onClick={() => setWizardStep(1)} className="flex-1 py-2.5 text-xs font-bold text-white/50 tracking-wider" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>← BACK</button>
                    <button onClick={() => setWizardStep(3)} className="flex-1 py-2.5 text-xs font-black tracking-widest text-white" style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}>PROCEED →</button>
                  </div>
                </>
              )}

              {/* Step 3 — Consent sign-off */}
              {wizardStep === 3 && (
                <>
                  <div className="p-4 space-y-2" style={{ background: 'rgba(15,23,42,0.9)', border: '1px solid rgba(255,255,255,0.1)' }}>
                    <p className="text-[10px] font-black tracking-widest text-white/30 uppercase mb-3">Cryptographic Consent Declaration</p>
                    <p className="text-[11px] text-white/70 leading-relaxed">
                      By continuing, you grant <strong className="text-white">tokenized cryptographic consent</strong> to <strong className="text-yellow-300">Veremark</strong> to:
                    </p>
                    <ul className="space-y-1.5 mt-2">
                      {[
                        'Contact the Civil Aviation Authority (CAA) on your behalf',
                        `Request hour confirmation from: ${selectedATO}`,
                        'Issue a cryptographic verification token to PilotRecognition.com',
                        'Store a zero-knowledge proof receipt in your Verepass wallet',
                      ].map(item => (
                        <li key={item} className="flex items-start gap-2 text-[10px] text-white/50">
                          <CheckCircle size={10} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                    <p className="text-[9px] text-white/25 mt-3 leading-relaxed">
                      No raw PII is transmitted to or stored by PilotRecognition.com. This consent can be revoked at any time from your vault settings, which immediately invalidates the token chain.
                    </p>
                  </div>

                  <label className="flex items-start gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentSigned}
                      onChange={e => setConsentSigned(e.target.checked)}
                      className="mt-0.5 flex-shrink-0 accent-sky-500 w-4 h-4"
                    />
                    <span className="text-[11px] text-white/60 leading-relaxed">
                      I understand and grant cryptographic consent to Veremark to contact the CAA and my selected ATO on my behalf.
                    </span>
                  </label>

                  <div className="flex gap-3">
                    <button onClick={() => setWizardStep(2)} className="flex-1 py-2.5 text-xs font-bold text-white/50 tracking-wider" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>← BACK</button>
                    <button
                      disabled={!consentSigned}
                      onClick={() => { setWizardOpen(false); setWizardStep(1); setConsentSigned(false); }}
                      className="flex-1 py-2.5 text-xs font-black tracking-widest text-white transition-all disabled:opacity-30"
                      style={{ background: 'linear-gradient(135deg, rgba(16,185,129,0.8), rgba(5,150,105,0.8))', border: '1px solid rgba(16,185,129,0.4)' }}
                    >
                      ✓ SUBMIT CONSENT & INITIATE
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        </div>
      )}
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

const DashboardTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => {
  const { currentUser } = useAuth();
  const [carouselIdx, setCarouselIdx] = useState(0);
  const paused = React.useRef(false);
  const cards = [...PATHWAY_CARDS, ...PATHWAY_CARDS];

  React.useEffect(() => {
    const id = setInterval(() => {
      if (!paused.current) setCarouselIdx(p => (p + 1) % PATHWAY_CARDS.length);
    }, 4000);
    return () => clearInterval(id);
  }, []);

  if (!currentUser) return (
    <div className="text-center py-20">
      <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-slate-700 flex items-center justify-center">
        <BarChart3 size={40} className="text-slate-400" />
      </div>
      <h2 className="text-2xl font-bold text-white mb-3 tracking-wider">Login to View Your Dashboard</h2>
      <p className="text-slate-300 mb-8 max-w-md mx-auto">Sign in to view real-time data from your Recognition Profile</p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))} className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white text-sm font-bold tracking-wider rounded-lg transition-all">LOGIN</button>
        <button onClick={() => { window.location.href = '/become-member'; }} className="px-8 py-4 bg-red-500 hover:bg-red-600 text-white text-sm font-bold tracking-wider rounded-lg transition-all">BECOME A MEMBER</button>
      </div>
      <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
        {[{icon: BarChart3, color: 'text-teal-400', title: 'Flight Analytics', desc: 'Track your flight hours and progress'}, {icon: GraduationCap, color: 'text-purple-400', title: 'Program Progress', desc: 'Monitor your training completion'}, {icon: Plane, color: 'text-blue-400', title: 'Pathway Insights', desc: 'Discover career opportunities'}].map(({icon: Icon, color, title, desc}) => (
          <div key={title} className="text-center">
            <div className="w-12 h-12 mx-auto mb-3 rounded-full bg-slate-700 flex items-center justify-center"><Icon size={20} className={color} /></div>
            <h3 className="text-white font-semibold mb-1">{title}</h3>
            <p className="text-slate-400 text-sm">{desc}</p>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <div className="relative">
        <h2 className="text-3xl font-serif text-white tracking-wide mb-2">DASHBOARD</h2>
        <div className="h-1 bg-gradient-to-r from-teal-500 to-blue-500 w-32" />
      </div>

      {/* Flight Instrument Dashboard */}
      <FlightInstrumentDashboard userId={currentUser.id} />

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

const LogbookTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile, onNavigate }) => {
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
      .then(({ data }: { data: any[] | null }) => { if (data) setWalletChecks(data); });
  }, [currentUser]);

  // Fetch airlines
  useEffect(() => {
    supabase
      .from('airlines')
      .select('id, name, logo_url, country, minimum_hours, fleet_type')
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

  const displayName = profileData?.full_name || profileData?.first_name || currentUser?.email?.split('@')[0] || 'Pilot';
  const initials = displayName.charAt(0).toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':          return <HomeTab profile={profileData} walletChecks={walletChecks} onNavigate={onNavigate} setTab={setTab} enrolledInFoundation={false} airlines={airlines} />;
      case 'profile':       return <ProfileTab onNavigate={onNavigate} />;
      case 'score':         return <ScoreTab profile={profileData} setTab={setTab} />;
      case 'wallet':        return <WalletTab walletChecks={walletChecks} />;
      case 'pathways':      return <PathwaysTab onNavigate={onNavigate} />;
      case 'programs':      return <ProgramsTab onNavigate={onNavigate} />;
      case 'dashboard':     return <DashboardTab profile={profileData} onNavigate={onNavigate} />;
      case 'airlines':      return <AirlinesTab onNavigate={onNavigate} />;
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
              {/* Search */}
              <div className="hidden md:flex items-center gap-2 bg-white/10 rounded-lg px-3 py-1.5 w-40">
                <Search size={12} className="text-white/50" />
                <input placeholder="Search…" className="bg-transparent text-xs text-white outline-none placeholder:text-white/40 w-full" />
              </div>

              {/* Settings */}
              <button
                onClick={() => setTab('settings')}
                className="w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all"
              >
                <Settings size={15} />
              </button>

              {/* Notification bell */}
              <button className="relative w-8 h-8 rounded-lg bg-white/10 hover:bg-white/20 flex items-center justify-center text-white/70 hover:text-white transition-all">
                <Bell size={15} />
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
                )}
              </button>

              {/* Avatar */}
              <button
                onClick={() => setTab('profile')}
                className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-all hover:scale-105 shadow-md overflow-hidden flex-shrink-0"
              >
                {profileData?.profile_image_url
                  ? <img src={profileData.profile_image_url} alt={displayName} className="w-full h-full object-cover" />
                  : <span className="text-sm font-bold text-slate-700">{initials}</span>}
              </button>
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
          {/* Hamburger — always on the far right */}
          <button
            className="w-8 h-8 flex items-center justify-center rounded-lg text-white/70 hover:text-white hover:bg-white/10 transition-all flex-shrink-0"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            <Menu size={18} />
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
                  { id: 'dashboard', label: 'Dashboard',        icon: BarChart3,  premium: false },
                  { id: 'home',      label: 'Home',             icon: Home,       premium: false },
                  { id: 'profile',   label: 'My Profile',       icon: User,       premium: false },
                  { id: 'wallet',    label: 'Pilot Credentials', icon: Shield,     premium: false },
                  { id: 'logbook',   label: 'Digital Logbook',   icon: BookMarked, premium: false },
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
                  { id: 'programs',  label: 'Programs',  icon: BookOpen,  premium: false },
                  { id: 'atlas-cv',  label: 'Atlas CV',  icon: FileText,  premium: true  },
                  { id: 'score',     label: 'My Score',  icon: TrendingUp, premium: false },
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
        <main className="flex-1 h-screen overflow-y-auto pt-[52px] lg:ml-60">
          <div className="max-w-[1200px] mx-auto p-5 lg:p-7">
            {renderContent()}
          </div>
        </main>
      </div>
    </div>
  );
};

export default UnifiedPilotPlatform;
