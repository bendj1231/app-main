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
              <span className="text-slate-900">OS</span>
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
      className="w-full rounded-2xl border border-white/60 bg-slate-100/40 p-4 md:p-6 backdrop-blur-xl shadow-2xl shadow-slate-300/40 text-slate-900 overflow-hidden relative"
      style={{ minHeight: '420px' }}
    >
      <AnimatePresence>
        {isBooting && <BootScreen />}
      </AnimatePresence>

      {!isBooting && <div>
      {/* Header — clean light glass */}
      <div className="py-4 flex flex-wrap items-center justify-between gap-2 bg-white/40 backdrop-blur-md border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <Zap size={18} className="text-amber-500" />
          <ChevronsRight size={16} className="text-slate-400" />
          <p className="text-sm md:text-base font-black text-slate-900 tracking-wider uppercase">
            Quick Access
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center px-2 py-1 md:px-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}
          >
            {isVerified ? <CheckCircle size={10} className="mr-1" /> : <AlertCircle size={10} className="mr-1" />}
            {isVerified ? 'Verified' : 'Pending'}
          </span>
          <span
            className={`inline-flex items-center px-2 py-1 md:px-2.5 rounded-full text-[9px] md:text-[10px] font-bold uppercase tracking-wider border ${isPlus ? 'bg-rose-50 text-rose-600 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200'}`}
          >
            {isPlus ? 'Recognition+' : 'Free'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start pt-6">
        {/* Sidebar — clean unified menu */}
        <aside
          className="lg:col-span-3 space-y-2 bg-white/40 p-3 rounded-2xl border border-white/80 shadow-sm"
        >
          {/* Nav tabs */}
          <nav className="space-y-2">
            {TABS.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-bold transition-all text-left ${
                    isActive
                      ? 'bg-gradient-to-r from-red-600 to-rose-600 text-white shadow-md shadow-red-600/10'
                      : 'text-slate-600 hover:bg-white/60 hover:text-slate-900'
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className={isActive ? '' : 'text-slate-400'}><Icon size={18} /></span>
                    {t.label}
                  </span>
                  {isActive ? (
                    <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <ChevronRight size={14} className="text-slate-400" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Quick actions */}
          <div className="hidden md:block space-y-2">
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
                  className="w-full flex items-center justify-between p-3 rounded-xl text-slate-600 hover:bg-white/60 hover:text-slate-900 text-xs font-semibold transition-all text-left"
                >
                  <span className="flex items-center gap-2">
                    <span className="text-slate-400"><Icon size={18} /></span>
                    {link.label}
                  </span>
                  <ChevronRight size={14} className="text-slate-400" />
                </button>
              );
            })}
          </div>
        </aside>

        {/* Content */}
        <div className="lg:col-span-9 space-y-6">
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
                {/* Mini profile with verification status — clean light glass */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl border border-white bg-white/80 shadow-lg shadow-slate-200/50">
                  <div className="flex items-center gap-3 md:gap-4 min-w-0">
                    <div className="flex h-10 w-10 md:h-12 md:w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-red-600 to-rose-600 text-white font-black text-base md:text-lg shadow-md shadow-red-600/10">
                      {displayName.charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-sm md:text-base font-black text-slate-900 truncate max-w-[180px] sm:max-w-xs">{profile?.email || displayName}</h3>
                        <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold border ${isVerified ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                          {isVerified ? 'Verified' : 'Pending'}
                        </span>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-500 font-semibold mt-0.5">
                        Pilot Account ID: #{profile?.id ? String(profile.id).slice(-5).toUpperCase() : '29481'}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 md:gap-6">
                    <div className="text-left sm:text-right">
                      <div className="flex items-center gap-3 justify-start sm:justify-end">
                        <span className="text-xs font-semibold text-slate-500">Profile Strength</span>
                        <span className="text-sm font-extrabold text-slate-900">{completionPct}%</span>
                      </div>
                      <div className="w-full sm:w-40 h-2 bg-slate-200 rounded-full mt-1.5 overflow-hidden">
                        <div className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" style={{ width: `${completionPct}%` }} />
                      </div>
                    </div>
                    {!isVerified && (
                      <button
                        onClick={() => setTab?.('advanced-profile' as TabId)}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 md:px-5 py-2.5 bg-gradient-to-r from-red-600 to-rose-600 text-white text-xs font-black rounded-xl shadow-md shadow-red-600/10 hover:from-red-500 hover:to-rose-500 transition-all transform active:scale-95"
                      >
                        Verify Identity
                        <svg className="w-3.5 h-3.5 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    )}
                  </div>
                </div>

                {/* Stats grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
                  {[
                    { label: 'Total Hours', value: animatedHours, suffix: 'h', icon: Clock, color: 'text-slate-500', empty: false },
                    { label: 'License', value: license, suffix: '', icon: Shield, color: 'text-slate-500', empty: license === 'Not set' },
                    { label: 'Career', value: occupation, suffix: '', icon: Briefcase, color: 'text-slate-500', empty: occupation === 'Not set' },
                    { label: 'Tier', value: isPlus ? 'Recognition+' : 'Free', suffix: '', icon: Star, color: isPlus ? 'text-indigo-600' : 'text-slate-500', empty: false },
                  ].map((stat) => {
                    const Icon = stat.icon;
                    const isHoursCard = stat.label === 'Total Hours';
                    const showLogbookCta = isHoursCard && totalHours === 0;
                    return (
                      <div
                        key={stat.label}
                        className="bg-white/80 border border-white p-3 md:p-4 rounded-xl shadow-sm flex flex-col justify-between min-h-[90px] md:min-h-[100px]"
                      >
                        <div>
                          <p className="text-[9px] md:text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
                            <span className={stat.color}><Icon size={12} className="md:w-[14px] md:h-[14px]" /></span>
                            {stat.label}
                          </p>
                          <h4 className="text-xl md:text-2xl font-black text-slate-900 mt-2">
                            {typeof stat.value === 'number' ? stat.value.toLocaleString() : stat.value}
                            {stat.suffix && <span className="text-[10px] md:text-xs font-bold text-slate-400 ml-1">{stat.suffix.toUpperCase()}</span>}
                          </h4>
                        </div>
                        {stat.empty && (
                          <p className="text-xs md:text-sm font-bold italic text-slate-400 mt-3">Not set</p>
                        )}
                        {showLogbookCta && (
                          <button
                            onClick={() => setTab?.('logbook' as TabId)}
                            className="text-[10px] md:text-[11px] font-bold text-red-600 hover:underline mt-2 text-left flex items-center gap-1"
                          >
                            <span>Sync Logbook</span>
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {/* Recent Activity */}
                  <div className="bg-white/80 border border-white p-5 rounded-2xl shadow-md">
                    <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-4 bg-red-500 rounded-full" />
                      Recent Activity
                    </h5>
                    <div className="space-y-3.5 text-xs">
                      {recentActivity.map((item, i) => {
                        const Icon = item.icon;
                        return (
                          <div key={i} className="flex justify-between items-start border-b border-slate-100 pb-2.5">
                            <div className="flex items-start gap-2.5">
                              <div
                                className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ background: `${item.color}15` }}
                              >
                                <Icon size={12} style={{ color: item.color }} />
                              </div>
                              <div>
                                <p className="font-bold text-slate-900">{item.text}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-semibold text-slate-400 whitespace-nowrap">{item.time}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Qualifications with granular status indicators */}
                  <div className="bg-white/80 border border-white p-5 rounded-2xl shadow-md flex flex-col justify-between">
                    <div>
                      <h5 className="text-xs font-black text-slate-900 uppercase tracking-widest mb-4 flex items-center gap-2">
                        <span className="w-1.5 h-4 bg-indigo-500 rounded-full" />
                        Qualifications
                      </h5>
                      <div className="space-y-3 text-xs font-semibold">
                        {[
                          { label: 'License', value: license, status: license !== 'Not set' ? 'verified' : 'missing' as const },
                          { label: 'Medical', value: profile?.medical_class || 'Class 1', status: profile?.medical_class ? 'verified' : 'pending' as const },
                          { label: 'English (ICAO)', value: profile?.icao_english_level || 'Level 4', status: profile?.icao_english_level ? 'verified' : 'pending' as const },
                          { label: 'Type Ratings', value: (profile?.type_ratings?.length || 0) + ' held', status: (profile?.type_ratings?.length || 0) > 0 ? 'verified' : 'missing' as const },
                          { label: 'Identity (KYC)', value: isVerified ? 'Verified' : 'Pending', status: isVerified ? 'verified' : 'pending' as const },
                          { label: 'Flight Recency', value: profile?.last_flown || 'No recent flights', status: profile?.last_flown ? 'verified' : 'missing' as const },
                        ].map((cert, idx) => {
                          const StatusIcon = cert.status === 'verified' ? CheckCircle2 : cert.status === 'pending' ? Clock : AlertTriangle;
                          const statusColor = cert.status === 'verified' ? '#10b981' : cert.status === 'pending' ? '#f59e0b' : '#ef4444';
                          const isMissing = cert.status === 'missing';
                          return (
                            <div
                              key={cert.label}
                              className={`flex justify-between items-center ${idx > 0 ? 'border-t border-slate-100/70 pt-2' : ''}`}
                            >
                              <span className={`flex items-center gap-2 ${isMissing ? 'text-slate-400' : 'text-slate-900'}`}>
                                <StatusIcon size={12} style={{ color: statusColor }} />
                                {cert.label}
                              </span>
                              <span className={`text-[11px] font-bold text-right ${isMissing ? 'italic text-slate-500' : 'text-slate-900'}`}>{cert.value}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                    <button
                      onClick={() => setTab?.('advanced-profile' as TabId)}
                      className="w-full text-center mt-5 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-900 transition-colors"
                    >
                      Manage Certificates & Records →
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
                  className="rounded-xl p-4 border border-white/20 shadow-sm"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                    backdropFilter: 'blur(12px) saturate(1.1)',
                    WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                  }}
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
                      { provider: 'Delta Air Lines', type: 'Airline', pathway: 'A320 FO Pathway', logo: 'https://img.logokit.com/delta.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&h=200&fit=crop&q=80', submitted: '2h ago', deadline: 'Closes Jul 15', deadlineUrgent: false, match: 94, status: 'Interest Submitted', statusColor: '#3b82f6', statusDot: '#3b82f6', stage: 1, reqs: [{ label: 'ATPL', met: true }, { label: '1,500h', met: true }, { label: 'Class 1', met: true }] },
                      { provider: 'CAE Oxford Aviation', type: 'Flight School', pathway: 'ATPL Integrated Course', logo: 'https://img.logokit.com/cae.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1474302770737-173ee21babef?w=600&h=200&fit=crop&q=80', submitted: '1d ago', deadline: 'Closes in 3 days', deadlineUrgent: true, match: 78, status: 'Under Review', statusColor: '#f59e0b', statusDot: '#f59e0b', stage: 2, reqs: [{ label: 'PPL', met: true }, { label: 'Medical', met: false }, { label: 'English', met: true }] },
                      { provider: 'L3Harris Training', type: 'Type Rating Center', pathway: 'A320 Type Rating Program', logo: 'https://img.logokit.com/l3harris.com?key=pk_fr0929c8e806652c55521c', image: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=600&h=200&fit=crop&q=80', submitted: '3d ago', deadline: 'Closes Jul 20', deadlineUrgent: false, match: 88, status: 'Pooled', statusColor: '#10b981', statusDot: '#10b981', stage: 3, reqs: [{ label: 'CPL', met: true }, { label: 'IFR', met: true }, { label: '500h', met: true }] },
                    ].map((row, i) => {
                      const isExpanded = expandedPathway === i;
                      const actionLabel = row.status === 'Pooled' ? 'Manage Interest' : row.status === 'Under Review' ? 'Action Required' : 'View Pathway';
                      const pipeline = ['Interest Submitted', 'Under Review', 'Pooled', 'Accepted'];
                      const pipelineColors = ['#3b82f6', '#f59e0b', '#10b981', '#8b5cf6'];
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: i * 0.08 }}
                          className="border rounded-lg transition-all cursor-pointer overflow-hidden hover:shadow-md hover:border-gray-300"
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
                              <div className="relative w-8 h-8 group">
                                <svg className="w-8 h-8 -rotate-90 transition-all" viewBox="0 0 32 32">
                                  <circle cx="16" cy="16" r="13" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                                  <circle
                                    cx="16" cy="16" r="13" fill="none"
                                    stroke={row.match >= 90 ? '#10b981' : row.match >= 70 ? '#f59e0b' : '#ef4444'}
                                    strokeWidth="3"
                                    strokeDasharray={`${(row.match / 100) * 81.6} 81.6`}
                                    strokeLinecap="round"
                                    className="transition-all duration-500"
                                  />
                                </svg>
                                <span className="absolute inset-0 flex items-center justify-center text-[8px] font-black text-slate-600">{row.match}</span>
                              </div>
                              <span className="text-[8px] text-slate-400 mt-0.5">Match</span>
                            </div>
                            {/* Deadline */}
                            <div className="hidden md:flex flex-col items-end flex-shrink-0 w-20">
                              <p className="text-[10px] font-bold text-slate-500">Deadline</p>
                              <div className="flex items-center gap-1">
                                {row.deadlineUrgent && (
                                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                )}
                                <p className="text-[10px] font-semibold" style={{ color: row.deadlineUrgent ? '#ef4444' : '#94a3b8' }}>{row.deadline}</p>
                              </div>
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
                              transition={{ duration: 0.25 }}
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
                                {/* Pipeline stepper */}
                                <div className="flex items-center gap-1">
                                  {pipeline.map((stageLabel, si) => {
                                    const isActive = si + 1 === row.stage;
                                    const isCompleted = si + 1 < row.stage;
                                    return (
                                      <React.Fragment key={si}>
                                        <div className="flex flex-col items-center flex-1">
                                          <div
                                            className="w-6 h-6 rounded-full flex items-center justify-center transition-all"
                                            style={{
                                              background: isCompleted || isActive ? pipelineColors[si] + '20' : '#f1f5f9',
                                              border: `2px solid ${isCompleted || isActive ? pipelineColors[si] : '#e2e8f0'}`,
                                            }}
                                          >
                                            {isCompleted ? (
                                              <CheckCircle size={10} style={{ color: pipelineColors[si] }} />
                                            ) : (
                                              <span className="text-[8px] font-black" style={{ color: isActive ? pipelineColors[si] : '#cbd5e1' }}>{si + 1}</span>
                                            )}
                                          </div>
                                          <span
                                            className="text-[8px] font-bold mt-1 text-center leading-tight"
                                            style={{ color: isActive ? pipelineColors[si] : isCompleted ? pipelineColors[si] : '#cbd5e1' }}
                                          >
                                            {stageLabel}
                                          </span>
                                        </div>
                                        {si < pipeline.length - 1 && (
                                          <div className="w-4 h-[2px] flex-shrink-0" style={{ background: si < row.stage ? pipelineColors[row.stage - 1] : '#e2e8f0' }} />
                                        )}
                                      </React.Fragment>
                                    );
                                  })}
                                </div>
                                <div className="grid grid-cols-3 gap-2">
                                  {row.reqs.map((req, ri) => (
                                    <div key={ri} className="flex items-center gap-1.5 rounded-lg p-2" style={{ background: 'rgba(255,255,255,0.40)', border: '1px solid rgba(255,255,255,0.25)' }}>
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
                                      <motion.div
                                        initial={{ width: 0 }}
                                        animate={{ width: `${row.match}%` }}
                                        transition={{ duration: 0.6, ease: 'easeOut' }}
                                        className="h-full rounded-full"
                                        style={{ background: row.match >= 90 ? '#10b981' : row.match >= 70 ? '#f59e0b' : '#ef4444' }}
                                      />
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
                        </motion.div>
                      );
                    })}
                  </div>
                </div>

                {/* Fast-Track Match — dematerializes when any pathway is expanded */}
                <AnimatePresence>
                  {expandedPathway === null && (
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0, transition: { duration: 0.2 } }}
                      transition={{ duration: 0.25 }}
                      className="rounded-xl p-4 border border-amber-200/40 shadow-sm"
                      style={{
                        background: 'linear-gradient(135deg, rgba(245,158,11,0.10), rgba(251,191,36,0.06))',
                        backdropFilter: 'blur(12px) saturate(1.1)',
                        WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                      }}
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
                    </motion.div>
                  )}
                </AnimatePresence>
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
                    className="rounded-xl p-6 border border-white/20 shadow-sm text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                      backdropFilter: 'blur(12px) saturate(1.1)',
                      WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                    }}
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
                        className="rounded-xl p-3 border border-white/20 shadow-sm flex items-center gap-3"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                          backdropFilter: 'blur(12px) saturate(1.1)',
                          WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                        }}
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
                    className="rounded-xl p-6 border border-white/20 shadow-sm text-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                      backdropFilter: 'blur(12px) saturate(1.1)',
                      WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                      boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                    }}
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
                        className="rounded-xl p-3 border border-white/20 shadow-sm"
                        style={{
                          background: 'linear-gradient(135deg, rgba(255,255,255,0.18), rgba(255,255,255,0.06))',
                          backdropFilter: 'blur(12px) saturate(1.1)',
                          WebkitBackdropFilter: 'blur(12px) saturate(1.1)',
                          boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.15), 0 4px 12px rgba(0,0,0,0.04)',
                        }}
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
