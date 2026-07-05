import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Route, Bookmark, BarChart3, ChevronRight, ChevronsRight, Plane, Award,
  Clock, TrendingUp, Shield, Star, BookOpen, Target, Zap, FolderOpen,
  GraduationCap, MapPin, Briefcase, Bell, FileText, CheckCircle2,
  AlertCircle, ArrowUpRight, Layers, Compass, CheckCircle, AlertTriangle
} from 'lucide-react';
import type { TabId } from './types';

type PreviewTab = 'overview' | 'pathways' | 'bookmarks' | 'comparisons';

interface ProfileData {
  id?: string;
  display_name?: string;
  full_name?: string;
  email?: string;
  avatar_url?: string;
  current_occupation?: string;
  license_type?: string;
  total_flight_hours?: number;
  last_flown?: string;
  last_flight_date?: string;
  subscription_tier?: string;
  recognition_tier?: string;
  verification_status?: string | Record<string, unknown>;
  role?: string;
  ratings?: string[];
  type_ratings?: string[];
  medical_class?: string;
  medical_expiry?: string;
  icao_english_level?: string;
  country?: string;
  city?: string;
  bio?: string;
}

interface InteractiveProfilePreviewProps {
  profile: ProfileData | null;
  setTab?: (tab: TabId) => void;
  onNavigate?: (path: string) => void;
}

const TABS: { id: PreviewTab; label: string; icon: React.ComponentType<any> }[] = [
  { id: 'overview', label: 'Overview', icon: User },
  { id: 'pathways', label: 'Pathways', icon: Route },
  { id: 'bookmarks', label: 'Bookmarks', icon: Bookmark },
  { id: 'comparisons', label: 'Compare', icon: BarChart3 },
];

export const InteractiveProfilePreview: React.FC<InteractiveProfilePreviewProps> = ({
  profile,
  setTab,
  onNavigate,
}) => {
  const [activeTab, setActiveTab] = useState<PreviewTab>('overview');
  const [pathwayMatches, setPathwayMatches] = useState<any[]>([]);
  const [bookmarks, setBookmarks] = useState<any[]>([]);
  const [comparisons, setComparisons] = useState<any[]>([]);
  const [animatedHours, setAnimatedHours] = useState(0);
  const [isBooting, setIsBooting] = useState(true);
  const [bootProgress, setBootProgress] = useState(0);
  const [expandedPathway, setExpandedPathway] = useState<number | null>(null);

  const displayName = profile?.display_name || profile?.full_name || 'Captain';
  const totalHours = profile?.total_flight_hours || 0;
  const license = profile?.license_type || 'Not set';
  const occupation = profile?.current_occupation || 'Not set';
  const tier = (profile?.subscription_tier || profile?.recognition_tier || 'free').toString().toLowerCase();
  const isPlus = tier !== 'free' && tier !== 'bronze';
  const verifStatus = (profile?.verification_status as Record<string, unknown>)?.status || (profile?.verification_status as string) || 'unverified';
  const isVerified = verifStatus === 'verified' || verifStatus === 'approved';

  // Simple smooth boot progress
  useEffect(() => {
    const duration = 5000;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setBootProgress(Math.round(p * 100));
      if (p < 1) {
        raf = requestAnimationFrame(tick);
      } else {
        setTimeout(() => setIsBooting(false), 500);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  // Load cached data from localStorage
  useEffect(() => {
    try {
      const matches = localStorage.getItem('pathway_matches_cache');
      if (matches) setPathwayMatches(JSON.parse(matches).data?.slice(0, 4) || []);
    } catch { /* ignore */ }

    try {
      const behavior = localStorage.getItem('pathwayBehaviorTracking');
      if (behavior) {
        const parsed = JSON.parse(behavior);
        const viewed = Object.entries(parsed)
          .filter(([_, v]: [string, any]) => v?.viewed || v?.clicked)
          .slice(0, 4)
          .map(([k, v]: [string, any]) => ({ id: k, name: v.name || k, type: 'pathway', date: v.lastViewed }));
        setPathwayMatches(viewed);
      }
    } catch { /* ignore */ }

    try {
      const aircraftBookmarks = localStorage.getItem('bookmarkedAircraft');
      const bmList: any[] = [];
      if (aircraftBookmarks) {
        const ids = JSON.parse(aircraftBookmarks);
        ids.slice(0, 4).forEach((id: string, i: number) => {
          bmList.push({ id, name: `Aircraft ${id.slice(0, 8)}`, type: 'aircraft', date: new Date().toISOString() });
        });
      }
      setBookmarks(bmList.length ? bmList : []);
    } catch { /* ignore */ }

    try {
      const comp = localStorage.getItem('comparedPathways');
      if (comp) setComparisons(JSON.parse(comp).slice(0, 3));
    } catch { /* ignore */ }
  }, []);

  // Animate flight hours
  useEffect(() => {
    if (!totalHours) return;
    const target = totalHours;
    const duration = 1200;
    const start = performance.now();
    let raf: number;
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      setAnimatedHours(Math.round(target * p));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [totalHours]);

  const completionPct = Math.round(([
    !!profile?.full_name,
    !!profile?.current_occupation,
    !!profile?.license_type,
    !!profile?.total_flight_hours,
    !!profile?.last_flown,
  ].filter(Boolean).length / 5) * 100);

  const recentActivity = [
    { icon: CheckCircle2, text: 'Profile completion updated', time: '2h ago', color: '#34d399' },
    { icon: Route, text: 'Pathway match: Delta Airlines A320 FO', time: '1d ago', color: '#818cf8' },
    { icon: Bookmark, text: 'Bookmarked Boeing 737 type rating', time: '2d ago', color: '#f59e0b' },
    { icon: Award, text: 'Medical certificate expiring soon', time: '3d ago', color: '#ef4444' },
  ];

  const BootScreen = () => {
    return (
      <motion.div
        className="absolute inset-0 z-50 flex flex-col items-center justify-center rounded-2xl overflow-hidden"
        style={{
          minHeight: '420px',
          background: 'linear-gradient(135deg, rgba(255,255,255,0.22), rgba(255,255,255,0.08))',
          backdropFilter: 'blur(40px) saturate(1.2)',
          WebkitBackdropFilter: 'blur(40px) saturate(1.2)',
          border: '1px solid rgba(255,255,255,0.25)',
          boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.1)',
        }}
        exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Frost radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: 'radial-gradient(circle at 50% 40%, rgba(255,255,255,0.04), transparent 60%)',
          }}
        />

        {/* RecognitionOS Logo */}
        <div className="relative mb-10 w-full flex flex-col items-center text-center">
          <div
            className="absolute inset-0 -m-6 rounded-3xl"
            style={{
              border: '1px solid rgba(255,255,255,0.08)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.06), transparent)',
            }}
          />
          <div className="relative px-8 py-6">
            <p
              className="text-3xl md:text-4xl font-black tracking-tight"
              style={{ textShadow: '0 1px 4px rgba(0,0,0,0.35), 0 0 12px rgba(0,0,0,0.15)' }}
            >
              <span style={{ color: '#dc2626' }}>Recognition</span>
              <span style={{ color: '#ffffff' }}>OS</span>
            </p>
            <p
              className="text-[10px] font-bold tracking-[0.3em] mt-2"
              style={{ color: 'rgba(15,23,42,0.5)' }}
            >
              PILOT COMMAND CENTRE
            </p>
          </div>
        </div>

        {/* Glass progress bar */}
        <div
          className="w-64 h-1.5 rounded-full overflow-hidden relative"
          style={{ background: 'rgba(15,23,42,0.08)', border: '1px solid rgba(15,23,42,0.12)' }}
        >
          <div
            className="absolute inset-y-0 left-0 rounded-full transition-all"
            style={{
              width: `${bootProgress}%`,
              background: 'linear-gradient(90deg, #dc2626, #ef4444, #f87171)',
              boxShadow: '0 0 12px rgba(239,68,68,0.35), 0 0 4px rgba(239,68,68,0.5)',
            }}
          />
        </div>

        {/* Percentage */}
        <p
          className="text-[10px] font-black mt-2 tabular-nums"
          style={{ color: 'rgba(15,23,42,0.35)' }}
        >
          {bootProgress}%
        </p>

        {/* Bottom dots */}
        <div className="flex items-center gap-1.5 mt-6">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full transition-all"
              style={{
                background: bootProgress >= 30 + i * 30 ? '#ef4444' : 'rgba(15,23,42,0.15)',
                opacity: bootProgress >= 30 + i * 30 ? 1 : 0.5,
              }}
            />
          ))}
        </div>
      </motion.div>
    );
  };

  return (
    <div
      className="rounded-2xl border border-white/25 overflow-hidden relative"
      style={{
        background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
        backdropFilter: 'blur(40px) saturate(1.2)',
        WebkitBackdropFilter: 'blur(40px) saturate(1.2)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), 0 8px 32px rgba(0,0,0,0.08)',
        minHeight: '420px',
      }}
    >
      <AnimatePresence>
        {isBooting && <BootScreen />}
      </AnimatePresence>

      {!isBooting && <div>
      {/* Header */}
      <div
        className="px-5 py-4 flex items-center justify-between"
        style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
      >
        <div className="flex items-center gap-2">
          <Zap size={18} style={{ color: '#ffffff' }} />
          <ChevronsRight size={16} style={{ color: 'rgba(255,255,255,0.7)' }} />
          <p className="text-base font-black text-white tracking-wider uppercase">
            Quick Access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full border"
            style={{
              background: isVerified ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            {isVerified ? '✓ VERIFIED' : '⚠ PENDING'}
          </span>
          <span
            className="text-[10px] font-black px-2 py-0.5 rounded-full border"
            style={{
              background: isPlus ? 'rgba(255,255,255,0.2)' : 'rgba(255,255,255,0.15)',
              color: '#ffffff',
              borderColor: 'rgba(255,255,255,0.3)',
            }}
          >
            {isPlus ? 'RECOGNITION+' : 'FREE'}
          </span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside
          className="md:w-56 flex-shrink-0 border-b md:border-b-0 md:border-r border-white/10 p-4"
          style={{
            background: 'linear-gradient(180deg, rgba(59,130,246,0.08), rgba(99,102,241,0.04))',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
          }}
        >
          {/* Nav tabs */}
          <nav className="flex md:flex-col gap-1.5">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-[13px] font-medium transition-all flex-1 md:flex-none text-left w-full"
                  style={{
                    background: isActive
                      ? 'linear-gradient(135deg, #3b82f6, #2563eb)'
                      : 'rgba(59,130,246,0.12)',
                    color: '#ffffff',
                    boxShadow: isActive
                      ? '0 4px 12px rgba(59,130,246,0.35)'
                      : '0 1px 2px rgba(0,0,0,0.04)',
                    border: isActive ? 'none' : '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <span style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)' }}><Icon size={18} /></span>
                  <span className="hidden md:inline">{t.label}</span>
                  {isActive && (
                    <svg className="ml-auto w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick actions */}
          <div className="mt-3 hidden md:block">
            <div className="flex flex-col gap-1.5">
              {[
                { label: 'Edit Profile', tab: 'advanced-profile' as TabId, icon: User },
                { label: 'Flight Bag', tab: 'logbook' as TabId, icon: Briefcase },
                { label: 'Recognition+', tab: 'recognition' as TabId, icon: Star },
              ].map((link) => {
                const Icon = link.icon;
                return (
                  <button
                    key={link.tab}
                    onClick={() => setTab?.(link.tab)}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-lg text-[13px] font-medium transition-all text-left w-full"
                    style={{
                      background: 'rgba(59,130,246,0.12)',
                      color: '#ffffff',
                      border: '1px solid rgba(255,255,255,0.08)',
                      boxShadow: '0 1px 2px rgba(0,0,0,0.04)',
                    }}
                  >
                    <span style={{ color: 'rgba(255,255,255,0.7)' }}><Icon size={18} /></span>
                    <span>{link.label}</span>
                    <ChevronRight size={14} className="ml-auto" style={{ color: 'rgba(255,255,255,0.4)' }} />
                  </button>
                );
              })}
            </div>
          </div>
        </aside>

        {/* Content */}
        <div className="flex-1 p-4 md:p-5 min-h-[420px]">
          <AnimatePresence mode="wait">
            {activeTab === 'overview' && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Mini profile with verification status */}
                <div className="flex items-start gap-3">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-base font-black flex-shrink-0"
                    style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', color: '#fff' }}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-sm font-bold text-slate-800 truncate">{displayName}</p>
                      <span
                        className="text-[9px] font-black px-1.5 py-0.5 rounded-full border flex items-center gap-1"
                        style={{
                          background: isVerified ? 'rgba(16,185,129,0.12)' : 'rgba(245,158,11,0.12)',
                          color: isVerified ? '#059669' : '#d97706',
                          borderColor: isVerified ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.3)',
                        }}
                      >
                        {isVerified ? <CheckCircle size={10} /> : <Clock size={10} />}
                        {isVerified ? 'VERIFIED' : 'PENDING'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 truncate">{profile?.email || 'No email'}</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <div className="h-1.5 rounded-full overflow-hidden flex-1" style={{ background: 'rgba(0,0,0,0.06)' }}>
                        <div
                          className="h-full rounded-full transition-all"
                          style={{ width: `${completionPct}%`, background: '#10b981' }}
                        />
                      </div>
                      <span className="text-[10px] text-slate-400">{completionPct}% complete</span>
                    </div>
                    {!isVerified && (
                      <button
                        onClick={() => setTab?.('advanced-profile' as TabId)}
                        className="mt-2 px-3 py-1 rounded-full text-[10px] font-black tracking-wider text-white bg-red-600 hover:bg-red-700 transition-all shadow-sm"
                      >
                        Verify Identity →
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Hours', value: animatedHours, suffix: 'h', icon: Clock, color: '#38bdf8' },
                    { label: 'License', value: license, suffix: '', icon: Shield, color: '#34d399' },
                    { label: 'Career', value: occupation, suffix: '', icon: Briefcase, color: '#f59e0b' },
                    { label: 'Tier', value: isPlus ? 'Recognition+' : 'Free', suffix: '', icon: Star, color: isPlus ? '#f472b6' : '#94a3b8' },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    const isHoursCard = stat.label === 'Total Hours';
                    const showLogbookCta = isHoursCard && totalHours === 0;
                    return (
                      <div
                        key={stat.label}
                        className="rounded-xl p-3 border border-gray-100 shadow-sm flex flex-col"
                        style={{ background: '#ffffff' }}
                      >
                        <div className="flex items-center gap-2 mb-2">
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center"
                            style={{ background: `${stat.color}15` }}
                          >
                            <Icon size={14} style={{ color: stat.color }} />
                          </div>
                          <span className="text-[10px] font-bold text-slate-500 uppercase">{stat.label}</span>
                        </div>
                        <p className="text-lg font-black text-slate-800">
                          {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                          <span className="text-xs text-slate-400 ml-0.5">{stat.suffix}</span>
                        </p>
                        {showLogbookCta && (
                          <button
                            onClick={() => setTab?.('logbook' as TabId)}
                            className="mt-auto pt-2 text-[10px] font-black tracking-wider text-blue-600 hover:text-blue-700 transition-all text-left"
                          >
                            Sync Logbook →
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Activity */}
                  <div
                    className="rounded-xl p-4 border border-gray-100 shadow-sm"
                    style={{ background: '#ffffff' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Zap size={14} className="text-amber-500" />
                      <p className="text-xs font-bold text-slate-800">Recent Activity</p>
                    </div>
                    <div className="space-y-2.5">
                      {recentActivity.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex items-start gap-2.5">
                            <div
                              className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                              style={{ background: `${item.color}15` }}
                            >
                              <Icon size={12} style={{ color: item.color }} />
                            </div>
                            <div className="min-w-0">
                              <p className="text-[11px] text-slate-700 truncate">{item.text}</p>
                              <p className="text-[10px] text-slate-400">{item.time}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Qualifications with granular status indicators */}
                  <div
                    className="rounded-xl p-4 border border-gray-100 shadow-sm"
                    style={{ background: '#ffffff' }}
                  >
                    <div className="flex items-center gap-2 mb-3">
                      <Award size={14} className="text-emerald-500" />
                      <p className="text-xs font-bold text-slate-800">Qualifications</p>
                    </div>
                    <div className="space-y-2">
                      {[
                        { label: 'License', value: license, status: license !== 'Not set' ? 'verified' : 'missing' as const },
                        { label: 'Medical', value: profile?.medical_class || 'Class 1', status: profile?.medical_class ? 'verified' : 'pending' as const },
                        { label: 'English (ICAO)', value: profile?.icao_english_level || 'Level 4', status: profile?.icao_english_level ? 'verified' : 'pending' as const },
                        { label: 'Type Ratings', value: (profile?.type_ratings?.length || 0) + ' held', status: (profile?.type_ratings?.length || 0) > 0 ? 'verified' : 'missing' as const },
                        { label: 'Identity (KYC)', value: isVerified ? 'Verified' : 'Pending', status: isVerified ? 'verified' : 'pending' as const },
                        { label: 'Flight Recency', value: profile?.last_flown || 'No recent flights', status: profile?.last_flown ? 'verified' : 'missing' as const },
                      ].map((cert) => {
                        const StatusIcon = cert.status === 'verified' ? CheckCircle2 : cert.status === 'pending' ? Clock : AlertTriangle;
                        const statusColor = cert.status === 'verified' ? '#10b981' : cert.status === 'pending' ? '#f59e0b' : '#ef4444';
                        return (
                          <div key={cert.label} className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <StatusIcon size={12} style={{ color: statusColor }} />
                              <span className="text-[11px] text-slate-600">{cert.label}</span>
                            </div>
                            <span className="text-[11px] font-bold text-slate-700">{cert.value}</span>
                          </div>
                        );
                      })}
                    </div>
                    <button
                      onClick={() => setTab?.('advanced-profile' as TabId)}
                      className="mt-3 w-full py-2 rounded-lg text-[10px] font-black tracking-wider text-slate-500 hover:text-slate-700 transition-all border border-gray-100 hover:border-gray-200"
                      style={{ background: '#f8fafc' }}
                    >
                      Manage Certificates →
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === 'pathways' && (
              <motion.div
                key="pathways"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {/* Submitted Pathways — interactive dense tracker */}
                <div
                  className="rounded-xl p-4 border border-gray-100 shadow-sm"
                  style={{ background: '#ffffff' }}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <FolderOpen size={14} className="text-blue-500" />
                      <p className="text-xs font-bold text-slate-800">Submitted Pathways</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-500" />
                        <span className="text-[9px] text-slate-400">Submitted</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-2" />
                        <span className="text-[9px] text-slate-400">Review</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 ml-2" />
                        <span className="text-[9px] text-slate-400">Pooled</span>
                      </div>
                      <span className="text-[10px] font-bold text-blue-500 bg-blue-50 px-2 py-0.5 rounded-full">3</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    {[
                      { provider: 'Delta Air Lines', type: 'Airline', pathway: 'A320 FO Pathway', logo: 'https://img.logokit.com/delta.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=200&fit=crop&q=80', submitted: '2h ago', deadline: 'Closes Jul 15', deadlineUrgent: false, match: 94, status: 'Interest Submitted', statusColor: '#3b82f6', statusDot: '#3b82f6', reqs: [{ label: 'ATPL', met: true }, { label: '1,500h', met: true }, { label: 'Class 1', met: true }] },
                      { provider: 'CAE Oxford Aviation', type: 'Flight School', pathway: 'ATPL Integrated Course', logo: 'https://img.logokit.com/cae.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1474302770737-173ee21babef?w=600&h=200&fit=crop&q=80', submitted: '1d ago', deadline: 'Closes in 3 days', deadlineUrgent: true, match: 78, status: 'Under Review', statusColor: '#f59e0b', statusDot: '#f59e0b', reqs: [{ label: 'PPL', met: true }, { label: 'Medical', met: false }, { label: 'English', met: true }] },
                      { provider: 'L3Harris Training', type: 'Type Rating Center', pathway: 'A320 Type Rating Program', logo: 'https://img.logokit.com/l3harris.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=200&fit=crop&q=80', submitted: '3d ago', deadline: 'Closes Jul 20', deadlineUrgent: false, match: 88, status: 'Pooled', statusColor: '#10b981', statusDot: '#10b981', reqs: [{ label: 'CPL', met: true }, { label: 'IFR', met: true }, { label: '500h', met: true }] },
                    ].map((row, i) => {
                      const isExpanded = expandedPathway === i;
                      const actionLabel = row.status === 'Pooled' ? 'Manage Interest' : row.status === 'Under Review' ? 'Action Required' : 'View Pathway';
                      return (
                        <div
                          key={i}
                          className="border border-gray-200 rounded-lg transition-all cursor-pointer overflow-hidden"
                          style={{
                            background: isExpanded ? '#f8fafc' : '#ffffff',
                            borderColor: isExpanded ? '#cbd5e1' : '#e2e8f0',
                          }}
                        >
                          {/* Main row */}
                          <div
                            className="flex items-center gap-3 p-3"
                            onClick={() => setExpandedPathway(isExpanded ? null : i)}
                          >
                            {/* Left: Logo + Provider */}
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              <img
                                src={row.logo}
                                alt={row.provider}
                                className="w-9 h-9 rounded-lg object-contain flex-shrink-0 border border-gray-100"
                                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                              />
                              <div className="min-w-0">
                                <p className="text-[11px] font-bold text-slate-800 truncate">{row.provider}</p>
                                <div className="flex items-center gap-1.5">
                                  <span className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">{row.type}</span>
                                  <span className="text-[10px] text-slate-400 truncate">{row.pathway}</span>
                                </div>
                              </div>
                            </div>
                            {/* Match % mini ring */}
                            <div className="hidden sm:flex flex-col items-center flex-shrink-0 w-14">
                              <div className="relative w-8 h-8">
                                <svg className="w-8 h-8 -rotate-90" viewBox="0 0 32 32">
                                  <circle cx="16" cy="16" r="13" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                  <circle
                                    cx="16" cy="16" r="13" fill="none"
                                    stroke={row.match >= 90 ? '#10b981' : row.match >= 70 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${(row.match / 100) * 81.6} 81.6`}
                                    strokeLinecap="round"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-600">{row.match}</span>
                              </div>
                              <span className="text-[8px] text-slate-400 mt-0.5">Match</span>
                            </div>
                            {/* Deadline */}
                            <div className="hidden md:flex flex-col items-end flex-shrink-0 w-20">
                              <p className="text-[10px] font-bold text-slate-500">Deadline</p>
                              <p className="text-[10px] font-semibold" style={{ color: row.deadlineUrgent ? '#ef4444' : '#94a3b8' }}>{row.deadline}</p>
                            </div>
                            {/* Status badge with dot */}
                            <div className="hidden md:block flex-shrink-0">
                              <span className="inline-flex items-center gap-1 text-[9px] font-black px-2 py-1 rounded-full border"
                                style={{
                                  color: row.statusColor,
                                  background: row.statusColor + '15',
                                  borderColor: row.statusColor + '30',
                                }}
                              >
                                <span className="w-1.5 h-1.5 rounded-full" style={{ background: row.statusDot }} />
                                {row.status}
                              </span>
                            </div>
                            {/* Expand chevron */}
                            <ChevronRight size={14} className="text-slate-300 flex-shrink-0 transition-transform" style={{ transform: isExpanded ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                          </div>
                          {/* Expanded detail panel */}
                          {isExpanded && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: 'auto', opacity: 1 }}
                              transition={{ duration: 0.2 }}
                              className="border-t border-gray-100"
                            >
                              {/* Hero pathway image */}
                              <div className="relative w-full h-28 overflow-hidden">
                                <img
                                  src={row.image}
                                  alt={row.pathway}
                                  className="w-full h-full object-cover"
                                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                                <div className="absolute bottom-2 left-3 right-3 flex items-center justify-between">
                                  <div>
                                    <p className="text-[11px] font-bold text-white">{row.pathway}</p>
                                    <p className="text-[9px] text-white/70">Submitted {row.submitted}</p>
                                  </div>
                                  <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-white/20 text-white backdrop-blur-sm border border-white/20">{row.match}% match</span>
                                </div>
                              </div>
                              <div className="px-3 pb-3 pt-3 space-y-3">
                                <div className="grid grid-cols-3 gap-2">
                                  {row.reqs.map((req, ri) => (
                                    <div key={ri} className="flex items-center gap-1.5 rounded-lg bg-white border border-gray-100 p-2">
                                      {req.met ? (
                                        <CheckCircle size={12} className="text-emerald-500" />
                                      ) : (
                                        <AlertCircle size={12} className="text-amber-500" />
                                      )}
                                      <span className={`text-[10px] font-semibold ${req.met ? 'text-slate-700' : 'text-amber-700'}`}>{req.label}</span>
                                    </div>
                                  ))}
                                </div>
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <div className="h-1.5 w-24 rounded-full bg-gray-100 overflow-hidden">
                                      <div className="h-full rounded-full transition-all" style={{ width: `${row.match}%`, background: row.match >= 90 ? '#10b981' : row.match >= 70 ? '#f59e0b' : '#ef4444' }} />
                                    </div>
                                    <span className="text-[10px] text-slate-500">Profile match {row.match}%</span>
                                  </div>
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setTab?.('pathways' as TabId); }}
                                    className="px-4 py-1.5 rounded-lg text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110"
                                    style={{ background: row.status === 'Pooled' ? '#10b981' : row.status === 'Under Review' ? '#f59e0b' : '#3b82f6' }}
                                  >
                                    {actionLabel} →
                                  </button>
                                </div>
                              </div>
                            </motion.div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Fast-Track Match — prominent match card */}
                <div
                  className="rounded-xl p-4 border border-amber-200 shadow-sm"
                  style={{ background: 'linear-gradient(135deg, rgba(245,158,11,0.04), rgba(251,191,36,0.04))' }}
                >
                  <div className="flex items-center gap-2 mb-4">
                    <Star size={14} className="text-amber-500" />
                    <p className="text-xs font-bold text-slate-800">Fast-Track Match</p>
                    <span className="ml-auto text-[9px] font-black px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 border border-amber-200">RECOMMENDED</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="relative w-14 h-14 flex-shrink-0">
                      <svg className="w-14 h-14 -rotate-90" viewBox="0 0 56 56">
                        <circle cx="28" cy="28" r="24" fill="none" stroke="#f1f5f9" strokeWidth="4" />
                        <circle cx="28" cy="28" r="24" fill="none" stroke="#f59e0b" strokeWidth="4" strokeDasharray="141.3 150.8" strokeLinecap="round" />
                      </svg>
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-base font-black text-amber-700">94</span>
                        <span className="text-[8px] text-amber-500 font-bold">%</span>
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-[11px] font-bold text-slate-800">Delta Air Lines — A320 FO Pathway</p>
                      <p className="text-[10px] text-slate-500 mt-0.5">License and hours align · Priority pool access</p>
                      <div className="flex items-center gap-1.5 mt-2">
                        {['ATPL', '1,500h', 'Class 1'].map((tag) => (
                          <span key={tag} className="text-[9px] font-semibold px-1.5 py-0.5 rounded bg-emerald-50 text-emerald-600 border border-emerald-100">{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setTab?.('pathways' as TabId)}
                    className="mt-4 w-full py-2.5 rounded-lg text-[10px] font-black tracking-wider text-white transition-all hover:brightness-110 bg-amber-600 hover:bg-amber-700"
                  >
                    Submit Interest →
                  </button>
                </div>
              </motion.div>
            )}

            {activeTab === 'bookmarks' && (
              <motion.div
                key="bookmarks"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">Saved Items</p>
                  <button
                    onClick={() => onNavigate?.('/aircraft')}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                  >
                    Browse <ArrowUpRight size={10} />
                  </button>
                </div>
                {bookmarks.length === 0 ? (
                  <div
                    className="rounded-xl p-6 border border-gray-100 shadow-sm text-center"
                    style={{ background: '#ffffff' }}
                  >
                    <Bookmark size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">No bookmarks yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Bookmark aircraft, programs, or airlines while browsing.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {bookmarks.map((bm, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3 border border-gray-100 shadow-sm flex items-center gap-3"
                        style={{ background: '#ffffff' }}
                      >
                        <div
                          className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                          style={{ background: 'rgba(245,158,11,0.1)' }}
                        >
                          <Bookmark size={16} style={{ color: '#d97706' }} />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-[11px] font-bold text-slate-800 truncate">{bm.name}</p>
                          <p className="text-[10px] text-slate-400 capitalize">{bm.type}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'comparisons' && (
              <motion.div
                key="comparisons"
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-bold text-slate-800">Compared Profiles</p>
                  <button
                    onClick={() => setTab?.('pathways' as TabId)}
                    className="text-[10px] font-bold text-slate-400 hover:text-slate-600 transition-colors flex items-center gap-1"
                  >
                    New Comparison <ArrowUpRight size={10} />
                  </button>
                </div>
                {comparisons.length === 0 ? (
                  <div
                    className="rounded-xl p-6 border border-gray-100 shadow-sm text-center"
                    style={{ background: '#ffffff' }}
                  >
                    <BarChart3 size={24} className="text-slate-300 mx-auto mb-2" />
                    <p className="text-sm font-bold text-slate-600">No comparisons yet</p>
                    <p className="text-[11px] text-slate-400 mt-1">Compare pathways side-by-side to see them here.</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {comparisons.map((comp, i) => (
                      <div
                        key={i}
                        className="rounded-xl p-3 border border-gray-100 shadow-sm"
                        style={{ background: '#ffffff' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <p className="text-[11px] font-bold text-slate-800">Comparison #{i + 1}</p>
                          <span className="text-[10px] text-slate-400">{comp.date || 'Recently'}</span>
                        </div>
                        <div className="flex gap-2">
                          {(comp.items || []).map((item: any, j: number) => (
                            <span
                              key={j}
                              className="text-[10px] px-2 py-1 rounded-md border border-gray-100 text-slate-600"
                              style={{ background: '#f8fafc' }}
                            >
                              {item.name || item}
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      </div>}
    </div>
  );
};
