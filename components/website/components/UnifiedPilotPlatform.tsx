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
              { value: hours, label: 'HOURS', clickable: false, colour: undefined },
              { value: score, label: 'SCORE', clickable: true, colour: score > 0 ? 'text-sky-300' : undefined },
              { value: certCount, label: 'CERTS', clickable: false, colour: '' },
              { value: Math.max(hoursForNext - hours, 0), label: 'TO NEXT', clickable: false, colour: 'text-orange-400' },
            ].map(stat => (
              <div
                key={stat.label}
                onClick={stat.clickable ? () => setTab('score' as TabId) : undefined}
                className={`text-center p-2 rounded ${stat.clickable ? 'cursor-pointer hover:ring-1 hover:ring-sky-400/50 transition-all' : ''}`}
                style={{ background: 'rgba(255,255,255,0.05)' }}
              >
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

      {/* ── RIGHT: Alerts + cards + CTA ── */}
      <div className="flex-1 flex flex-col gap-4">

        {/* Expired credential alert */}
        {expiredChecks.length > 0 && (
          <button
            onClick={() => setTab('wallet')}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-all hover:brightness-110"
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

        {/* Bento grid */}
        <div className="grid grid-cols-2 gap-4 content-start">
        {/* Top card — MY PATHWAYS — full width */}
        <motion.div
          custom={0}
          variants={cardVariants}
          initial="hidden"
          animate={visible ? 'visible' : 'hidden'}
          onClick={dashboardCards[0].onClick}
          className="col-span-2 relative group cursor-pointer overflow-hidden"
          style={{ height: '280px', background: 'rgba(30,41,59,0.6)', backdropFilter: 'blur(10px)', border: '1px solid rgba(255,255,255,0.15)' }}
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
        </div>{/* end bento grid */}

        {/* ── Get Started — How to set up your account ── */}
        <div
          className="rounded-2xl overflow-hidden"
          style={{ background: 'rgba(255,255,255,0.04)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.1)' }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
            <div>
              <p className="text-sm font-black text-white tracking-wide">Get Started</p>
              <p className="text-[11px] text-white/40">How to set up your account</p>
            </div>
            <div className="text-[10px] font-bold px-2.5 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>
              {[!!profile, hours > 0, walletChecks.some(c => c.status === 'verified'), score > 0, enrolledInFoundation, false].filter(Boolean).length} / 6 COMPLETE
            </div>
          </div>

          <div className="grid grid-cols-6 divide-x" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            {[
              { step: 1, label: 'Complete Profile', sublabel: 'Name, hours & occupation', done: !!profile, tab: 'profile' as TabId, icon: User, highlight: false },
              { step: 2, label: 'Log Flight Hours', sublabel: 'Add your total time', done: hours > 0, tab: 'logbook' as TabId, icon: Clock, highlight: false },
              { step: 3, label: 'Verify Credentials', sublabel: 'Wallet + Veremark token', done: walletChecks.some(c => c.status === 'verified'), tab: 'wallet' as TabId, icon: Shield, highlight: false },
              { step: 4, label: 'Browse Pathways', sublabel: 'Submit your interest', done: score > 0, tab: 'pathways' as TabId, icon: Map, highlight: false },
              { step: 5, label: 'Start a Program', sublabel: 'Foundation or Transition', done: enrolledInFoundation, tab: 'programs' as TabId, icon: BookOpen, highlight: false },
              { step: 6, label: 'Recognition+', sublabel: 'Unlock full access — $99/yr', done: false, tab: 'settings' as TabId, icon: Star, highlight: true },
            ].map((item, i) => {
              const Icon = item.icon;
              const completedCount = [!!profile, hours > 0, walletChecks.some(c => c.status === 'verified'), score > 0, enrolledInFoundation, false].filter(Boolean).length;
              const isNext = i === completedCount;
              return (
                <button
                  key={item.step}
                  onClick={() => setTab(item.tab)}
                  className="flex flex-col items-center gap-2 py-4 px-1.5 transition-all hover:brightness-125"
                  style={{
                    background: item.done
                      ? 'rgba(16,185,129,0.06)'
                      : item.highlight
                        ? 'linear-gradient(180deg, rgba(14,165,233,0.08) 0%, rgba(99,102,241,0.08) 100%)'
                        : 'transparent'
                  }}
                >
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center transition-all ${
                    item.done
                      ? 'bg-emerald-500/25 ring-1 ring-emerald-500/40'
                      : item.highlight
                        ? 'bg-sky-500/20 ring-1 ring-sky-400/40'
                        : isNext
                          ? 'bg-sky-500/15 ring-1 ring-sky-400/30'
                          : 'bg-white/5'
                  }`}>
                    {item.done
                      ? <CheckCircle size={16} className="text-emerald-400" />
                      : <Icon size={15} className={item.highlight ? 'text-sky-300' : isNext ? 'text-sky-400' : 'text-white/30'} />
                    }
                  </div>
                  <div className="text-center">
                    <p className={`text-[10px] font-bold leading-tight ${
                      item.done ? 'text-emerald-400' : item.highlight ? 'text-sky-300' : 'text-white/60'
                    }`}>{item.label}</p>
                    <p className={`text-[9px] leading-tight mt-0.5 ${item.highlight ? 'text-sky-500/60' : 'text-white/25'}`}>{item.sublabel}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

      </div>{/* end right flex col */}
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
