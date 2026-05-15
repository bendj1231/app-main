import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
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
    {label && <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{label}</span><span className={scoreColour(score)}>{score}/100</span></div>}
    <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
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

const SectionCard: React.FC<{ title: string; children: React.ReactNode; className?: string; action?: React.ReactNode }> =
  ({ title, children, className = '', action }) => (
  <div className={`bg-white border border-slate-200 rounded-xl p-5 ${className}`}>
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest">{title}</h3>
      {action}
    </div>
    {children}
  </div>
);

// ─── TAB: HOME ─────────────────────────────────────────────────────────────
const HomeTab: React.FC<{
  profile: any; walletChecks: any[]; pathways: any[]; setTab: (t: TabId) => void;
}> = ({ profile, walletChecks, pathways, setTab }) => {
  const score = profile?.recognition_score ?? 0;
  const hours = profile?.total_flight_hours ?? 0;
  const name = profile?.full_name || profile?.first_name || 'Pilot';
  const level = profile?.current_occupation || 'Student Pilot';
  const initials = name.charAt(0).toUpperCase();

  const expiredChecks = walletChecks.filter(c => c.status === 'expired');
  const verifiedChecks = walletChecks.filter(c => c.status === 'verified');
  const allVerified = walletChecks.length > 0 && walletChecks.every(c => c.status === 'verified');

  const topPathways = pathways.slice(0, 3);

  const shortcuts = [
    { label: 'Pathways',      icon: Map,       tab: 'pathways'      as TabId, colour: 'bg-blue-50 text-blue-600 border-blue-100' },
    { label: 'Wallet',        icon: Shield,    tab: 'wallet'        as TabId, colour: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
    { label: 'Programs',      icon: BookOpen,  tab: 'programs'      as TabId, colour: 'bg-purple-50 text-purple-600 border-purple-100' },
    { label: 'Atlas CV',      icon: FileText,  tab: 'atlas-cv'      as TabId, colour: 'bg-orange-50 text-orange-600 border-orange-100' },
    { label: 'Airlines',      icon: Plane,     tab: 'airlines'      as TabId, colour: 'bg-sky-50 text-sky-600 border-sky-100' },
    { label: 'Manufacturers', icon: Wrench,    tab: 'manufacturers' as TabId, colour: 'bg-slate-50 text-slate-600 border-slate-200' },
    { label: 'Events',        icon: Calendar,  tab: 'events'        as TabId, colour: 'bg-pink-50 text-pink-600 border-pink-100' },
    { label: 'Logbook',       icon: BookMarked,tab: 'logbook'       as TabId, colour: 'bg-yellow-50 text-yellow-600 border-yellow-100' },
  ];

  const gapActions = [
    expiredChecks.length > 0 && { label: `Renew expired credential${expiredChecks.length > 1 ? 's' : ''}`, tab: 'wallet' as TabId, urgent: true },
    score < 60 && { label: 'Complete Foundation Program to increase score', tab: 'programs' as TabId, urgent: false },
    hours < 250 && { label: 'Log more flight hours in your Logbook', tab: 'logbook' as TabId, urgent: false },
    !allVerified && walletChecks.length === 0 && { label: 'Set up your Credential Wallet', tab: 'wallet' as TabId, urgent: false },
    topPathways.length === 0 && { label: 'Explore pathway matches', tab: 'pathways' as TabId, urgent: false },
  ].filter(Boolean) as { label: string; tab: TabId; urgent: boolean }[];

  return (
    <div className="space-y-6">
      {/* Expiry alert banner */}
      {expiredChecks.length > 0 && (
        <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-5 py-3">
          <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
          <p className="text-sm text-red-700 font-medium">
            {expiredChecks.length} credential{expiredChecks.length > 1 ? 's' : ''} expired —{' '}
            <button className="underline font-bold" onClick={() => setTab('wallet')}>view wallet</button>
          </p>
        </div>
      )}

      {/* Top row: profile card + shortcuts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Profile card */}
        <SectionCard title="Recognition Profile" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-4">
            <div className="w-16 h-16 rounded-full bg-slate-900 flex items-center justify-center text-white text-xl font-bold mb-3">
              {profile?.profile_image_url
                ? <img src={profile.profile_image_url} alt={name} className="w-16 h-16 rounded-full object-cover" />
                : initials}
            </div>
            <p className="font-bold text-slate-900 text-base">{name}</p>
            <p className="text-xs text-slate-500 mt-0.5">{level}</p>
            <div className="flex items-center gap-2 mt-2">
              {allVerified
                ? <span className="bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1"><CheckCircle size={10}/>PRE-CLEARED</span>
                : <span className="bg-slate-100 text-slate-500 border border-slate-200 text-xs font-bold px-2 py-0.5 rounded-full">NOT YET VERIFIED</span>}
            </div>
          </div>
          <div className="space-y-3">
            <ScoreBar score={score} label="Recognition Score" />
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{hours.toLocaleString()}</p>
                <p className="text-xs text-slate-500">Flight Hours</p>
              </div>
              <div className="bg-slate-50 rounded-lg p-3 text-center">
                <p className="text-lg font-bold text-slate-900">{verifiedChecks.length}/{walletChecks.length || '—'}</p>
                <p className="text-xs text-slate-500">Verified Credentials</p>
              </div>
            </div>
          </div>
          <button onClick={() => setTab('profile')} className="w-full mt-4 text-xs text-slate-500 hover:text-slate-800 flex items-center justify-center gap-1 transition-colors">
            View full profile <ChevronRight size={12} />
          </button>
        </SectionCard>

        {/* Shortcuts grid */}
        <SectionCard title="Quick Access" className="lg:col-span-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {shortcuts.map(s => {
              const Icon = s.icon;
              return (
                <button
                  key={s.tab}
                  onClick={() => setTab(s.tab)}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border transition-all hover:scale-105 hover:shadow-sm ${s.colour}`}
                >
                  <Icon size={20} />
                  <span className="text-xs font-semibold">{s.label}</span>
                </button>
              );
            })}
          </div>
        </SectionCard>
      </div>

      {/* Middle row: pathways + gap actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Recommended pathways */}
        <SectionCard title="Recommended Pathways" action={
          <button onClick={() => setTab('pathways')} className="text-xs text-red-600 font-semibold flex items-center gap-1 hover:underline">
            View all <ChevronRight size={12} />
          </button>
        }>
          {topPathways.length === 0 ? (
            <div className="text-center py-8">
              <Map size={32} className="text-slate-300 mx-auto mb-2" />
              <p className="text-sm text-slate-500">No pathways matched yet.</p>
              <button onClick={() => setTab('pathways')} className="mt-3 text-xs text-red-600 font-semibold underline">Browse pathways</button>
            </div>
          ) : (
            <div className="space-y-3">
              {topPathways.map((p: any, i: number) => (
                <div key={p.id ?? i} className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer" onClick={() => setTab('pathways')}>
                  <div className="w-9 h-9 rounded-lg bg-white border border-slate-200 flex items-center justify-center flex-shrink-0">
                    <Plane size={16} className="text-slate-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate">{p.airline_name ?? p.name ?? 'Pathway'}</p>
                    <p className="text-xs text-slate-500 truncate">{p.position ?? p.type ?? 'First Officer'}</p>
                  </div>
                  <div className="flex-shrink-0 text-right">
                    <p className={`text-sm font-bold ${scoreColour(p.match_percent ?? 60)}`}>{p.match_percent ?? '—'}%</p>
                    <p className="text-xs text-slate-400">match</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </SectionCard>

        {/* Gap actions */}
        <SectionCard title="Action Items" action={
          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-bold">{gapActions.length} to-do</span>
        }>
          {gapActions.length === 0 ? (
            <div className="text-center py-8">
              <CheckCircle size={32} className="text-emerald-400 mx-auto mb-2" />
              <p className="text-sm text-slate-500 font-medium">All actions complete — great work.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {gapActions.map((a, i) => (
                <button
                  key={i}
                  onClick={() => setTab(a.tab)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${a.urgent ? 'bg-red-50 hover:bg-red-100 border border-red-100' : 'bg-slate-50 hover:bg-slate-100'}`}
                >
                  {a.urgent
                    ? <AlertTriangle size={14} className="text-red-500 flex-shrink-0" />
                    : <Target size={14} className="text-slate-400 flex-shrink-0" />}
                  <span className={`text-xs font-medium flex-1 ${a.urgent ? 'text-red-700' : 'text-slate-600'}`}>{a.label}</span>
                  <ArrowRight size={12} className="text-slate-300 flex-shrink-0" />
                </button>
              ))}
            </div>
          )}
        </SectionCard>
      </div>

      {/* News feed */}
      <SectionCard title="Recognition Feed">
        <div className="space-y-3">
          {[
            { icon: TrendingUp, colour: 'text-emerald-500', msg: 'Cebu Pacific posted a new A320 First Officer pathway' },
            { icon: Award,      colour: 'text-yellow-500', msg: 'Your Recognition Score updated — complete EBT to increase it' },
            { icon: Globe,      colour: 'text-blue-500',   msg: 'APATS 2026 career fair registration now open — Manila, November' },
            { icon: Zap,        colour: 'text-purple-500', msg: 'New Foundation Program cohort opens June 1 — limited spots' },
          ].map((item, i) => {
            const Icon = item.icon;
            return (
              <div key={i} className="flex items-start gap-3 py-2 border-b border-slate-100 last:border-0">
                <Icon size={15} className={`mt-0.5 flex-shrink-0 ${item.colour}`} />
                <p className="text-sm text-slate-700">{item.msg}</p>
              </div>
            );
          })}
        </div>
      </SectionCard>
    </div>
  );
};

// ─── TAB: PROFILE ──────────────────────────────────────────────────────────
const ProfileTab: React.FC<{ profile: any; onRefresh: () => void }> = ({ profile, onRefresh }) => {
  const name = profile?.full_name || profile?.first_name || 'Pilot';
  const score = profile?.recognition_score ?? 0;
  const hours = profile?.total_flight_hours ?? 0;
  const level = profile?.current_occupation || 'Student Pilot';
  const email = profile?.email || '—';
  const license = profile?.license_number || '—';

  const scoreBreakdown = [
    { label: 'Flight Hours', weight: '35%', value: Math.min(100, Math.round((hours / 3000) * 100)) },
    { label: 'Verified Credentials', weight: '25%', value: score > 0 ? Math.min(100, score + 10) : 0 },
    { label: 'Program Completion', weight: '20%', value: profile?.programs_completed ? 60 : 0 },
    { label: 'EBT Assessment', weight: '10%', value: profile?.ebt_completed ? 80 : 0 },
    { label: 'Recency & Activity', weight: '5%', value: 40 },
    { label: 'Peer Endorsements', weight: '5%', value: profile?.endorsements ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Identity card */}
        <SectionCard title="Pilot Identity" className="lg:col-span-1">
          <div className="flex flex-col items-center text-center mb-5">
            <div className="relative mb-3">
              <div className="w-20 h-20 rounded-full bg-slate-900 flex items-center justify-center text-white text-2xl font-bold">
                {profile?.profile_image_url
                  ? <img src={profile.profile_image_url} alt={name} className="w-20 h-20 rounded-full object-cover" />
                  : name.charAt(0).toUpperCase()}
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center hover:bg-slate-50">
                <Camera size={10} className="text-slate-600" />
              </button>
            </div>
            <p className="font-bold text-slate-900 text-lg">{name}</p>
            <p className="text-sm text-slate-500">{level}</p>
            <p className="text-xs text-slate-400 mt-1">{email}</p>
          </div>
          <div className="space-y-2 text-sm">
            {[
              { label: 'License', value: license },
              { label: 'Total Hours', value: `${hours.toLocaleString()} hrs` },
              { label: 'Level', value: level },
            ].map(row => (
              <div key={row.label} className="flex justify-between py-1.5 border-b border-slate-100">
                <span className="text-slate-500 text-xs">{row.label}</span>
                <span className="font-semibold text-slate-800 text-xs">{row.value}</span>
              </div>
            ))}
          </div>
          <button onClick={onRefresh} className="w-full mt-4 flex items-center justify-center gap-2 text-xs text-slate-500 hover:text-slate-800 transition-colors">
            <RefreshCw size={12} /> Refresh profile
          </button>
        </SectionCard>

        {/* Recognition Score breakdown */}
        <SectionCard title="Recognition Score Breakdown" className="lg:col-span-2">
          <div className="flex items-center gap-4 mb-5 p-4 bg-slate-50 rounded-xl">
            <div className={`text-5xl font-black ${scoreColour(score)}`}>{score}</div>
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-widest mb-1">Overall Score</p>
              <ScoreBar score={score} />
              <p className="text-xs text-slate-400 mt-1">
                {score < 40 ? 'Build fundamentals first' : score < 60 ? 'Good progress — keep going' : score < 80 ? 'Strong profile — nearly there' : 'Excellent — you are airline-ready'}
              </p>
            </div>
          </div>
          <div className="space-y-4">
            {scoreBreakdown.map(item => (
              <div key={item.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-slate-600 font-medium">{item.label}</span>
                  <span className="text-slate-400">{item.weight} weight · <span className={scoreColour(item.value)}>{item.value}/100</span></span>
                </div>
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBg(item.value)}`} style={{ width: `${item.value}%` }} />
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      </div>

      {/* Live profile note */}
      <div className="bg-slate-900 rounded-xl p-4 flex items-start gap-3">
        <Zap size={16} className="text-yellow-400 flex-shrink-0 mt-0.5" />
        <p className="text-sm text-slate-300"><strong className="text-white">Live Real-Time Profile — Not a Static CV.</strong> Your profile updates as you log hours, complete programs, and get verified. Airlines see your current status, not a document you last edited 6 months ago.</p>
      </div>
    </div>
  );
};

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
    <div className="space-y-6">

      {/* Pre-Cleared status */}
      <div className={`rounded-xl p-5 border ${allVerified ? 'bg-emerald-50 border-emerald-200' : hasExpired ? 'bg-red-50 border-red-200' : 'bg-slate-50 border-slate-200'}`}>
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center ${allVerified ? 'bg-emerald-500' : hasExpired ? 'bg-red-400' : 'bg-slate-300'}`}>
            <Shield size={22} className="text-white" />
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest font-bold text-slate-500 mb-0.5">Wallet Status</p>
            <p className={`text-xl font-black ${allVerified ? 'text-emerald-700' : hasExpired ? 'text-red-700' : 'text-slate-600'}`}>
              {allVerified ? 'PRE-CLEARED' : hasExpired ? 'ACTION REQUIRED' : 'PENDING VERIFICATION'}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">
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
      <div className="bg-slate-900 rounded-xl p-4">
        <p className="text-xs text-emerald-400 font-bold uppercase tracking-widest mb-2">Triangulation Architecture</p>
        <div className="grid grid-cols-3 gap-3 text-center text-xs">
          {[
            { label: 'Third-Party Vault', colour: 'text-blue-400', desc: 'Holds your raw documents' },
            { label: 'Veremark', colour: 'text-yellow-400', desc: 'Independently verifies' },
            { label: 'PilotRecognition', colour: 'text-emerald-400', desc: 'Displays token only' },
          ].map(c => (
            <div key={c.label} className="bg-slate-800 rounded-lg p-3">
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
            <Lock size={36} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium mb-2">Wallet not yet set up</p>
            <p className="text-slate-400 text-xs max-w-xs mx-auto">Initiate verification to connect your vault provider and Veremark. Your credentials stay with them — you get the token.</p>
            <button className="mt-4 bg-slate-900 text-white text-xs font-bold px-5 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
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
                <div key={check.id} className={`border rounded-xl p-4 ${check.status === 'expired' ? 'border-red-200 bg-red-50' : isExpiringSoon ? 'border-yellow-200 bg-yellow-50' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-start justify-between mb-2">
                    <p className="text-sm font-bold text-slate-800">{label}</p>
                    <StatusPill status={check.status} />
                  </div>
                  {expiry && (
                    <p className={`text-xs ${check.status === 'expired' ? 'text-red-600 font-semibold' : isExpiringSoon ? 'text-yellow-700 font-semibold' : 'text-slate-400'}`}>
                      {check.status === 'expired' ? '⚠ Expired: ' : 'Expires: '}
                      {expiry.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  )}
                  <div className="mt-3 flex gap-2 items-center">
                    <div className="flex-1 h-px bg-slate-100" />
                    <div className="flex gap-2 text-[10px] text-slate-400">
                      <span className="flex items-center gap-0.5"><Eye size={9}/> Token only stored</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </SectionCard>

      {/* Consent note */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-100 rounded-xl p-4">
        <Lock size={14} className="text-blue-500 flex-shrink-0 mt-0.5" />
        <p className="text-xs text-blue-700">
          <strong>Your data. Your control.</strong> You manage three separate consent relationships: vault provider, Veremark, and PilotRecognition. Revoke any one and the token chain immediately invalidates.
        </p>
      </div>
    </div>
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
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search airlines…"
            className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200"
          />
        </div>
        <div className="flex gap-2">
          {['all', 'commercial', 'cargo', 'charter'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors ${filter === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}
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
            <div key={p.id} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                    {p.logo
                      ? <img src={p.logo} alt={p.name} className="w-8 h-8 object-contain" />
                      : <Plane size={16} className="text-slate-400" />}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-sm">{p.name}</p>
                    <p className="text-xs text-slate-500">{p.position} · {p.type}</p>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`text-lg font-black ${scoreColour(p.match)}`}>{p.match}%</p>
                  <p className="text-[10px] text-slate-400">match</p>
                </div>
              </div>

              {/* Score bar */}
              <div className="mb-3">
                <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${scoreBg(p.match)}`} style={{ width: `${p.match}%` }} />
                </div>
              </div>

              {/* Gaps */}
              {p.gaps.length > 0 && (
                <div className="mb-4 space-y-1">
                  {p.gaps.map((gap, gi) => (
                    <p key={gi} className="text-xs text-slate-500 flex items-center gap-1.5">
                      <XCircle size={10} className="text-red-400 flex-shrink-0" /> {gap}
                    </p>
                  ))}
                </div>
              )}

              <div className="flex gap-2">
                <button className="flex-1 bg-slate-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-slate-700 transition-colors">
                  Express Interest
                </button>
                <button className="px-3 py-2 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors">
                  <ChevronRight size={14} className="text-slate-400" />
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
        <div key={prog.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden flex flex-col">
          <div className="bg-slate-900 px-5 py-4">
            <div className="flex items-center justify-between mb-1">
              <p className="text-white font-bold">{prog.name}</p>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${prog.badgeColour}`}>{prog.badge}</span>
            </div>
            <p className="text-2xl font-black text-white">{prog.price}</p>
            {prog.discount && <p className="text-xs text-slate-400 mt-0.5">{prog.discount}</p>}
          </div>
          <div className="p-5 flex flex-col flex-1">
            <p className="text-sm text-slate-600 mb-4 leading-relaxed">{prog.desc}</p>
            <ul className="space-y-2 mb-5 flex-1">
              {prog.features.map(f => (
                <li key={f} className="flex items-center gap-2 text-xs text-slate-700">
                  <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" /> {f}
                </li>
              ))}
            </ul>
            <button
              onClick={() => onNavigate(prog.route)}
              className="w-full bg-slate-900 text-white text-xs font-bold py-2.5 rounded-lg hover:bg-slate-700 transition-colors"
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
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search airlines…"
          className="w-full pl-9 pr-4 py-2 text-sm border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-red-200" />
      </div>
      {filtered.length === 0 ? (
        <div className="text-center py-16"><Plane size={40} className="text-slate-300 mx-auto mb-3" /><p className="text-slate-500 text-sm">No airlines found.</p></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((a: any, i: number) => (
            <div key={a.id ?? i} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 rounded-lg bg-slate-100 flex items-center justify-center flex-shrink-0">
                  {a.logo_url
                    ? <img src={a.logo_url} alt={a.name} className="w-8 h-8 object-contain" />
                    : <Plane size={16} className="text-slate-400" />}
                </div>
                <div>
                  <p className="font-bold text-slate-900 text-sm">{a.name ?? a.airline_name}</p>
                  <p className="text-xs text-slate-500">{a.country ?? a.headquarters ?? '—'}</p>
                </div>
              </div>
              {a.minimum_hours && (
                <p className="text-xs text-slate-500"><span className="font-semibold text-slate-700">Min hours:</span> {a.minimum_hours.toLocaleString()}</p>
              )}
              {a.fleet_type && (
                <p className="text-xs text-slate-500 mt-1"><span className="font-semibold text-slate-700">Fleet:</span> {a.fleet_type}</p>
              )}
              <button className="mt-3 w-full text-xs text-red-600 font-semibold border border-red-100 rounded-lg py-1.5 hover:bg-red-50 transition-colors flex items-center justify-center gap-1">
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
        <div key={m.name} className="bg-white border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center">
              <span className="text-white text-xs font-black">{m.name.slice(0, 2).toUpperCase()}</span>
            </div>
            <p className="font-bold text-slate-900">{m.name}</p>
          </div>
          <p className="text-xs text-slate-500 mb-3 leading-relaxed">{m.desc}</p>
          <div className="flex flex-wrap gap-1 mb-4">
            {m.aircraft.map(ac => (
              <span key={ac} className="bg-slate-100 text-slate-600 text-[10px] font-semibold px-2 py-0.5 rounded-full">{ac}</span>
            ))}
          </div>
          <button onClick={() => onNavigate('type-rating-search')} className="w-full text-xs text-red-600 font-semibold border border-red-100 rounded-lg py-1.5 hover:bg-red-50 transition-colors">
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
    <div className="bg-slate-900 rounded-xl p-6 text-center">
      <FileText size={40} className="text-white mx-auto mb-3" />
      <p className="text-white font-bold text-lg mb-1">ATLAS Aviation CV</p>
      <p className="text-slate-400 text-sm mb-4">Industry-standard formatted CV. Auto-populated from your Recognition Profile. Accepted by airlines using the ATLAS format.</p>
      <div className="flex gap-3 justify-center">
        <button onClick={() => onNavigate('atlas-cv-generator')} className="bg-white text-slate-900 text-sm font-bold px-6 py-2.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-2">
          <Download size={15} /> Generate & Download
        </button>
        <button onClick={() => onNavigate('atlas-resume')} className="border border-slate-600 text-white text-sm font-bold px-6 py-2.5 rounded-lg hover:border-slate-400 transition-colors flex items-center gap-2">
          <Edit3 size={15} /> Edit CV
        </button>
      </div>
    </div>
    <SectionCard title="What Your Atlas CV Includes">
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {['Flight Hours Summary', 'License & Ratings', 'Type Ratings Held', 'Medical Certificate Status', 'Recognition Score', 'EBT Assessment Result', 'Program Completions', 'Employment History', 'Language Proficiency'].map(item => (
          <div key={item} className="flex items-center gap-2 text-sm text-slate-700">
            <CheckCircle size={12} className="text-emerald-500 flex-shrink-0" /> {item}
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
        <div key={stat.label} className="bg-white border border-slate-200 rounded-xl p-4 text-center">
          <p className="text-2xl font-black text-slate-900">{stat.value}</p>
          <p className="text-xs text-slate-500 mt-1">{stat.label}</p>
        </div>
      ))}
    </div>
    <div className="bg-white border border-slate-200 rounded-xl p-6 text-center">
      <BookMarked size={36} className="text-slate-300 mx-auto mb-3" />
      <p className="text-slate-600 font-semibold text-sm mb-2">Digital Logbook</p>
      <p className="text-slate-400 text-xs mb-4">Log flights, track hours by category, and sync with your Recognition Score automatically.</p>
      <button onClick={() => onNavigate('digital-logbook')} className="bg-slate-900 text-white text-xs font-bold px-6 py-2.5 rounded-lg hover:bg-slate-700 transition-colors">
        Open Full Logbook
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
        <div key={e.name} className="bg-white border border-slate-200 rounded-xl p-4 flex items-center gap-4 hover:shadow-sm transition-shadow">
          <div className="w-12 h-12 rounded-xl bg-slate-900 flex flex-col items-center justify-center flex-shrink-0">
            <Calendar size={18} className="text-white" />
          </div>
          <div className="flex-1">
            <p className="font-bold text-slate-900 text-sm">{e.name}</p>
            <p className="text-xs text-slate-500">{e.location} · {e.date}</p>
          </div>
          <span className="text-[10px] font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">{e.type}</span>
        </div>
      ))}
    </div>
  );
};

// ─── TAB: NEWSROOM ─────────────────────────────────────────────────────────
const NewsroomTab: React.FC = () => {
  const news = [
    { title: 'Cebu Pacific opens cadet programme applications for 2026', date: 'May 14, 2026', tag: 'Pathways' },
    { title: 'CAAP renews bilateral agreement with GCAA for license conversion', date: 'May 12, 2026', tag: 'Regulatory' },
    { title: 'Airbus delivers 1000th A321neo — type rating demand at record high', date: 'May 10, 2026', tag: 'Industry' },
    { title: 'New EBT framework guidance released by ICAO — what pilots need to know', date: 'May 8, 2026', tag: 'Training' },
    { title: 'Recognition Plus subscribers now get priority pathway matching', date: 'May 6, 2026', tag: 'Platform' },
  ];
  return (
    <div className="space-y-4">
      {news.map(n => (
        <div key={n.title} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-sm transition-shadow cursor-pointer">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="font-semibold text-slate-900 text-sm leading-snug mb-1">{n.title}</p>
              <p className="text-xs text-slate-400">{n.date}</p>
            </div>
            <span className="text-[10px] font-bold bg-red-100 text-red-700 px-2 py-0.5 rounded-full flex-shrink-0">{n.tag}</span>
          </div>
        </div>
      ))}
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
    <div className="space-y-6 max-w-2xl">
      {sections.map(s => (
        <SectionCard key={s.title} title={s.title}>
          <div className="space-y-1">
            {s.items.map(item => (
              <button key={item} className="w-full flex items-center justify-between px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50 rounded-lg transition-colors">
                {item}
                <ChevronRight size={14} className="text-slate-300" />
              </button>
            ))}
          </div>
        </SectionCard>
      ))}
      <button onClick={onLogout} className="flex items-center gap-2 text-sm text-red-600 font-semibold hover:text-red-800 transition-colors px-3 py-2">
        <LogOut size={15} /> Sign Out
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
      case 'home':          return <HomeTab profile={profileData} walletChecks={walletChecks} pathways={[]} setTab={setTab} />;
      case 'profile':       return <ProfileTab profile={profileData} onRefresh={() => setProfileData({ ...profileData })} />;
      case 'wallet':        return <WalletTab walletChecks={walletChecks} />;
      case 'pathways':      return <PathwaysTab profile={profileData} airlines={airlines} onNavigate={onNavigate} />;
      case 'programs':      return <ProgramsTab onNavigate={onNavigate} />;
      case 'airlines':      return <AirlinesTab airlines={airlines} />;
      case 'manufacturers': return <ManufacturersTab onNavigate={onNavigate} />;
      case 'atlas-cv':      return <AtlasCVTab profile={profileData} onNavigate={onNavigate} />;
      case 'logbook':       return <LogbookTab profile={profileData} onNavigate={onNavigate} />;
      case 'events':        return <EventsTab />;
      case 'newsroom':      return <NewsroomTab />;
      case 'settings':      return <SettingsTab onLogout={handleLogout} />;
      default:              return null;
    }
  };

  const activeNavItem = NAV_ITEMS.find(n => n.id === activeTab);

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden font-sans">

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/40 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* ── SIDEBAR ── */}
      <aside className={`fixed lg:static inset-y-0 left-0 z-40 flex flex-col w-60 bg-white border-r border-slate-200 transition-transform duration-200 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>

        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-slate-100">
          <div className="w-7 h-7 bg-slate-900 rounded-lg flex items-center justify-center flex-shrink-0">
            <Plane size={14} className="text-white" />
          </div>
          <div>
            <p className="text-xs font-black text-slate-900 leading-none">PILOT</p>
            <p className="text-xs font-black text-red-600 leading-none">RECOGNITION</p>
          </div>
          <button className="ml-auto lg:hidden" onClick={() => setSidebarOpen(false)}><X size={16} className="text-slate-400" /></button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-3 overflow-y-auto space-y-0.5">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setTab(item.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-colors ${isActive ? 'bg-slate-900 text-white font-semibold' : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'}`}
              >
                <Icon size={16} className={isActive ? 'text-white' : 'text-slate-400'} />
                <span className="flex-1 text-left">{item.label}</span>
                {item.badge ? <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        {/* Bottom user card */}
        <div className="border-t border-slate-100 px-4 py-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
              {profileData?.profile_image_url
                ? <img src={profileData.profile_image_url} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
                : initials}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-800 truncate">{displayName}</p>
              <p className="text-[10px] text-slate-400 truncate">{currentUser?.email}</p>
            </div>
            <button onClick={handleLogout} className="text-slate-400 hover:text-slate-700 transition-colors flex-shrink-0">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* Top bar */}
        <header className="flex items-center gap-4 bg-white border-b border-slate-200 px-5 py-3 flex-shrink-0">
          <button className="lg:hidden text-slate-500 hover:text-slate-800" onClick={() => setSidebarOpen(true)}>
            <Menu size={20} />
          </button>

          <div>
            <p className="text-base font-bold text-slate-900">{activeNavItem?.label ?? 'Platform'}</p>
            <p className="text-xs text-slate-400 hidden sm:block">pilotrecognition.com</p>
          </div>

          <div className="flex-1" />

          {/* Search */}
          <div className="hidden md:flex items-center gap-2 bg-slate-100 rounded-lg px-3 py-1.5 w-48">
            <Search size={13} className="text-slate-400" />
            <input placeholder="Search…" className="bg-transparent text-xs text-slate-700 outline-none placeholder:text-slate-400 w-full" />
          </div>

          {/* Notifications */}
          <button className="relative text-slate-500 hover:text-slate-800 transition-colors">
            <Bell size={18} />
            {notifCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">{notifCount}</span>
            )}
          </button>

          {/* Avatar */}
          <button onClick={() => setTab('profile')} className="w-8 h-8 rounded-full bg-slate-900 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
            {profileData?.profile_image_url
              ? <img src={profileData.profile_image_url} alt={displayName} className="w-8 h-8 rounded-full object-cover" />
              : initials}
          </button>
        </header>

        {/* Content */}
        <main className="flex-1 overflow-y-auto p-5 lg:p-7">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default UnifiedPilotPlatform;
