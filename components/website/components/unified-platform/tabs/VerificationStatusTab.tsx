import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertCircle, Clock, CheckCircle2, ArrowRight,
  Award, Settings,
  BookOpen, ChevronDown, ChevronUp, Download,
  Flag, MinusCircle, Info, Camera,
  FileText, TrendingUp,
  Sparkles, UserCheck, Plane, Briefcase, ChevronRight
} from 'lucide-react';
import { uploadProfileImage } from '@/src/lib/cloudinaryClient';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import { supabase } from '@/shared/lib/supabase';
import { safeRedirect } from '@/src/lib/url-validator';
import type { TabId } from '../types';
import VerificationDashboardGrid from '../VerificationDashboardGrid';

// ─── DASHBOARD LEGEND BANNER ────────────────────────────────────────────────
const DashboardLegendBanner: React.FC<{ isFreeUser: boolean }> = ({ isFreeUser }) => {
  return (
    <div
      className="rounded-2xl p-4 md:p-5"
      style={{ background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))', border: '1px solid rgba(255,255,255,0.12)', backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)' }}
    >
      <div className="flex items-center gap-3 mb-3">
        <Info size={16} className="text-sky-400 flex-shrink-0" />
        <div>
          <p className="text-[11px] font-black uppercase tracking-wider text-white/80">Dashboard Overview</p>
          <p className="text-[11px] text-white/70 mt-1 leading-relaxed max-w-2xl">
            This panel gives you a real-time overview of your pilot licenses and credentials.
            You can see what is currently valid, what is under review, and if anything has been flagged or expired.
          </p>
        </div>
      </div>

      {isFreeUser && (
        <div className="mb-4 rounded-xl p-3 flex items-center gap-2" style={{ background: 'rgba(107,114,128,0.12)', border: '1px solid rgba(107,114,128,0.25)' }}>
          <MinusCircle size={14} className="text-gray-400 flex-shrink-0" />
          <p className="text-[11px] text-white/60 leading-relaxed">
            <span className="font-bold text-white/80">Free tier:</span> Credential statuses are hidden. Upgrade to <span style={{ color: '#dc2626' }}>Recognition+</span> to view live validity tracking.
          </p>
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)' }}>
          <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 leading-tight">Valid</p>
            <p className="text-[9px] text-white/60 leading-tight mt-0.5">Credential is active</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)' }}>
          <Flag size={14} className="text-amber-400 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 leading-tight">Under Review</p>
            <p className="text-[9px] text-white/60 leading-tight mt-0.5">Check your email</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'rgba(220,38,38,0.08)', border: '1px solid rgba(220,38,38,0.2)' }}>
          <Flag size={14} className="text-red-500 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-red-400 leading-tight">Flagged / Expired</p>
            <p className="text-[9px] text-white/60 leading-tight mt-0.5">Fraud suspicion or expired</p>
          </div>
        </div>
        <div className="flex items-center gap-2 rounded-xl px-3 py-3" style={{ background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.2)' }}>
          <MinusCircle size={14} className="text-gray-400 flex-shrink-0" />
          <div className="flex flex-col justify-center">
            <p className="text-[10px] font-black uppercase tracking-wider text-gray-400 leading-tight">N/A</p>
            <p className="text-[9px] text-white/60 leading-tight mt-0.5">Not verified or free tier</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ─── TAB: VERIFICATION STATUS ───────────────────────────────────────────────
export const VerificationStatusTab: React.FC<{
  profile: any;
  walletChecks: any[];
  credentials?: any[];
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
  onProfileImageUpdate?: (url: string, publicId?: string) => void;
}> = ({ profile, walletChecks, credentials = [], setTab, onNavigate, onProfileImageUpdate }) => {
  const isFreeUser = profile?.subscription_tier !== 'plus' && profile?.subscription_tier !== 'enterprise';
  const hours = profile?.total_flight_hours ?? 0;
  const verifiedHours = profile?.verified_flight_hours ?? hours * 0.6;
  const unverifiedHours = Math.max(0, hours - verifiedHours);
  const verificationStatus = walletChecks.some(c => c.status === 'verified')
    ? 'verified'
    : walletChecks.some(c => c.status === 'pending' || c.status === 'in_review')
    ? 'in_progress'
    : 'not_started';

  const [avatarHover, setAvatarHover] = React.useState(false);
  const [avatarUploading, setAvatarUploading] = React.useState(false);
  const avatarInputRef = React.useRef<HTMLInputElement>(null);
  const { callApi } = useWorkerAuth();

  const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profile?.id) return;
    if (!file.type.startsWith('image/')) return;
    setAvatarUploading(true);
    try {
      const result = await uploadProfileImage(file, profile.id);
      if (result.success && result.url) {
        // Update local profile state immediately for instant feedback
        (profile as any).profile_image_url = result.url;
        if (result.publicId) (profile as any).profile_image_public_id = result.publicId;

        // Persist to D1 via worker
        await callApi('updateProfile', {
          id: profile.id,
          profile_image_url: result.url,
          profile_image_public_id: result.publicId || null,
        });

        // Sync parent state so nav bar and home tab update immediately
        onProfileImageUpdate?.(result.url, result.publicId);
      }
    } catch (err) {
      console.error('[VerificationStatusTab] Avatar upload failed:', err);
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };

  const [searchParams] = useSearchParams();
  const checkoutSuccess = searchParams.get('checkout') === 'success';
  const checkoutCancelled = searchParams.get('checkout') === 'cancelled';

  const baseUrl = `${window.location.origin}`;
  const returnUrl = `${baseUrl}/get-started`;
  const cancelUrl = `${baseUrl}/platform?tab=verification&checkout=cancelled`;

  const [logsExpanded, setLogsExpanded] = React.useState(false);
  const [logbookFormatsExpanded, setLogbookFormatsExpanded] = React.useState(false);
  const [logbook, setLogbook] = React.useState<any[]>([]);
  const [logbookLoading, setLogbookLoading] = React.useState(false);
  const [showLogbookModal, setShowLogbookModal] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [expandedCats, setExpandedCats] = React.useState<Record<string, boolean>>({});
  const [tooltip, setTooltip] = React.useState<{ title: string; items: any[]; x: number; y: number; w: number } | null>(null);
  const catRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  React.useEffect(() => {
    const id = profile?.id;
    if (!id) return;
    let active = true;
    setLogbookLoading(true);
    supabase.from('pilot_flight_logs').select('id, date, hours, aircraft_type, registration, pic_hours, cross_country_hours, dual_hours, night_hours, simulated_instrument_hours, actual_instrument_hours, simulator_hours, landings, route').eq('user_id', id).order('date', { ascending: false }).limit(50).then(({ data, error }) => {
      if (!active) return;
      if (error) console.error('[logbook] fetch error:', error);
      setLogbook(data ?? []);
      setLogbookLoading(false);
    });
    return () => { active = false; };
  }, [profile?.id]);

  const logbookConnected = !!profile?.logbook_sync_valid;

  // Format decimal hours as aviation H+MM (e.g. 2.5 → "2+30", 0 → "0+00")
  const fmtHrs = (decimalHours: number): string => {
    const h = Math.floor(decimalHours);
    const m = Math.round((decimalHours - h) * 60);
    return `${h}+${m.toString().padStart(2, '0')}`;
  };

  const totalTime = logbook.reduce((sum, l) => sum + (l.hours || 0), hours || (profile?.total_hours || 0));
  const picTime = logbook.reduce((sum, l) => sum + (l.pic_hours || l.pic || 0), profile?.pic_hours || 0);
  const xcTime = logbook.reduce((sum, l) => sum + (l.cross_country_hours || l.xc || 0), profile?.cross_country_hours || 0);
  const dualTime = logbook.reduce((sum, l) => sum + (l.dual_hours || l.dual || 0), profile?.dual_hours || 0);
  const nightTime = logbook.reduce((sum, l) => sum + (l.night_hours || l.night || 0), profile?.night_hours || 0);
  const simInstTime = logbook.reduce((sum, l) => sum + (l.simulated_instrument_hours || l.simulated_instrument || 0), profile?.simulated_instrument_hours || 0);
  const actualInstTime = logbook.reduce((sum, l) => sum + (l.actual_instrument_hours || l.actual_instrument || 0), profile?.actual_instrument_hours || 0);
  const simTime = logbook.reduce((sum, l) => sum + (l.simulator_hours || l.sim || 0), profile?.simulator_hours || 0);
  const landings = logbook.reduce((sum, l) => sum + (l.landings || l.total_landings || 0), profile?.landings || 0);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95, filter: 'blur(10px)' },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      filter: 'blur(0px)',
      transition: { duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
    },
  };

  return (
    <motion.div variants={containerVariants} initial="hidden" animate="visible" className="max-w-4xl mx-auto space-y-5 pb-10">

      {/* Get Started Page — disabled for now */}
      {/*
      {checkoutSuccess && (
        <motion.div variants={itemVariants} className="rounded-2xl overflow-hidden" style={{ background: 'linear-gradient(135deg, #0f172a, #1e293b)', border: '1px solid rgba(255,255,255,0.1)' }}>
          ...get started content...
        </motion.div>
      )}
      */}

      {/* Checkout Cancelled Banner — disabled for now */}
      {/*
      {checkoutCancelled && (
        <div className="rounded-xl p-4 flex items-center gap-3" style={{ background: 'rgba(245,158,11,0.12)', border: '1px solid rgba(245,158,11,0.3)' }}>
          <AlertCircle size={20} className="text-amber-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-bold text-amber-400">Payment Cancelled</p>
            <p className="text-xs text-white/60">No worries — you can upgrade to Recognition+ anytime.</p>
          </div>
        </div>
      )}
      */}

      {/* Advert / upgrade banner */}
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl px-6 pt-6 pb-9 pr-8 md:pr-10" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
        <div className="absolute bottom-5 right-5 text-right z-10">
          <p className="text-[9px] font-black uppercase tracking-wider" style={{ color: '#111827' }}>supported by Pilot<span style={{ color: '#dc2626' }}>shortage</span>.org</p>
          <p className="text-[9px] font-medium tracking-wide" style={{ color: '#6b7280' }}>recognition · pathways · advocacy · mission</p>
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl font-black tracking-tighter leading-none">
              <span style={{ color: '#000000' }}>P</span>
              <span style={{ color: '#dc2626' }}>R<sup style={{ fontSize: '0.3em', verticalAlign: 'super', lineHeight: 0, position: 'relative', top: '-3px' }}>®</sup></span>
            </span>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-[0.15em] uppercase" style={{ color: '#dc2626' }}>Recognition+</span>
              <span className="text-sm font-bold tracking-wider" style={{ color: '#6b7280' }}>— Pilot Verification</span>
            </div>
          </div>
          {verificationStatus === 'not_started' ? (
            <>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: '#111827' }}>
                You're one step away from being <span style={{ color: '#dc2626' }}>internationally verified</span>.
              </h1>
              <p className="text-sm max-w-xl leading-relaxed mb-5" style={{ color: '#4b5563' }}>
                We contact your ATO through authorized verification providers to ensure your profile is up-to-date. Verified profiles gain exclusive access to pathways held by charter and confidential operators.
              </p>
              <a
                href={`https://checkout.dodopayments.com/buy/pdt_0NhgDLaiGjWD45S1gJmng?return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`}
                className="inline-flex px-5 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 items-center gap-2 no-underline w-fit"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 4px 20px rgba(220,38,38,0.35)' }}
              >
                GET RECOGNITION+ <ArrowRight size={14} />
              </a>
            </>
          ) : verificationStatus === 'in_progress' ? (
            <>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: '#111827' }}>
                Verification <span style={{ color: '#dc2626' }}>in progress</span>.
              </h1>
              <p className="text-sm max-w-xl leading-relaxed mb-5" style={{ color: '#4b5563' }}>
                Your documents are being reviewed. We'll notify you once your international verification is complete.
              </p>
              <div className="flex items-center gap-2 text-[11px] font-bold tracking-wide" style={{ color: '#dc2626' }}>
                <Clock size={14} /> Estimated review: 2–5 business days
              </div>
            </>
          ) : (
            <>
              <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3" style={{ color: '#111827' }}>
                You are <span style={{ color: '#dc2626' }}>internationally verified</span>.
              </h1>
              <p className="text-sm max-w-xl leading-relaxed" style={{ color: '#4b5563' }}>
                Your pilot credentials and flight hours have been verified. Airlines and operators can trust your profile.
              </p>
            </>
          )}
        </div>
      </motion.div>

      {/* Dashboard legend banner */}
      <motion.div variants={itemVariants}>
        <DashboardLegendBanner isFreeUser={isFreeUser} />
      </motion.div>

      {/* Verification dashboard summary row */}
      <motion.div variants={itemVariants} className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Pilot Profile — Profile Card Style */}
        <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          {/* Banner */}
          <div className="relative px-5 pt-6 pb-4" style={{ background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,58,95,0.9) 50%, rgba(15,23,42,0.95) 100%)' }}>
            {/* Gold stripes — rank based on license type */}
            {(() => {
              const lt = String(profile?.license_type || '').toLowerCase();
              const stripes = lt.includes('atpl') || lt.includes('airline transport') ? 4
                : lt.includes('cpl') || lt.includes('commercial') ? 3
                : lt.includes('ppl') || lt.includes('private') ? 2
                : lt.includes('spl') || lt.includes('student') ? 1
                : 0;
              return (
                <div className="absolute top-0 left-0 right-0 z-20 flex flex-col" style={{ gap: '2px' }}>
                  {Array.from({ length: stripes }).map((_, i) => (
                    <div key={i} className="h-[2px] w-full" style={{ background: 'linear-gradient(90deg, #ca8a04 0%, #fbbf24 30%, #fbbf24 70%, #ca8a04 100%)' }} />
                  ))}
                </div>
              );
            })()}
            <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 30% 50%, rgba(56,189,248,0.15) 0%, transparent 60%)' }} />
            <div className="relative z-10">
              <p className="text-[9px] font-black tracking-[0.2em] uppercase text-cyan-400">Pilot Platform</p>
              <p className="text-sm font-black text-white mt-0.5">Profile Card</p>
            </div>
          </div>

          {/* Avatar + Info */}
          <div className="px-5 pb-5 -mt-8 relative z-10">
            <div className="flex justify-center">
              <div
                className="relative w-20 h-20 rounded-full cursor-pointer group"
                onMouseEnter={() => setAvatarHover(true)}
                onMouseLeave={() => setAvatarHover(false)}
                onClick={() => !avatarUploading && avatarInputRef.current?.click()}
                style={{
                  background: profile?.profile_image_url ? `url(${profile.profile_image_url}) center/cover no-repeat` : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
                  border: '3px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                }}
              >
                {!profile?.profile_image_url && !avatarUploading && (
                  <span className="absolute inset-0 flex items-center justify-center text-2xl font-black text-white pointer-events-none">
                    {profile?.display_name?.charAt(0) || profile?.full_name?.charAt(0) || 'P'}
                  </span>
                )}

                {/* Hover overlay */}
                {(avatarHover || avatarUploading) && (
                  <div
                    className="absolute inset-0 rounded-full flex flex-col items-center justify-center transition-all duration-200"
                    style={{ background: avatarUploading ? 'rgba(0,0,0,0.7)' : 'rgba(0,0,0,0.55)' }}
                  >
                    {avatarUploading ? (
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    ) : (
                      <>
                        <Camera size={18} className="text-white mb-0.5" />
                        <span className="text-[9px] font-black text-white/90 uppercase tracking-wider">Upload</span>
                      </>
                    )}
                  </div>
                )}

                <input
                  ref={avatarInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleAvatarChange}
                />
              </div>
            </div>

            {(() => {
              const rawDisplay = profile?.display_name || profile?.full_name;
              const cleanName = typeof rawDisplay === 'string' && rawDisplay.includes('@')
                ? rawDisplay.split('@')[0].replace(/[._]/g, ' ').replace(/\b\w/g, c => c.toUpperCase())
                : rawDisplay;
              const displayName = cleanName || profile?.full_name || 'Pilot';
              const handleSource = (profile?.display_name || '');
              const handle = handleSource.includes('@')
                ? handleSource.split('@')[0].replace(/[^a-z0-9]/gi, '').toLowerCase()
                : handleSource.toLowerCase().replace(/\s+/g, '');
              return (
                <div className="text-center mt-3">
                  <p className="text-base font-black text-white truncate px-2">{displayName}</p>
                  <p className="text-[11px] text-white/60 truncate px-2">@{handle || 'pilot'}</p>
                  <p className="text-[10px] font-black tracking-wider uppercase text-white/50 mt-1 truncate px-2">{profile?.license_type || 'Commercial Pilot (CPL)'}</p>
                </div>
              );
            })()}

            {/* Social Icons */}
            <div className="flex justify-center gap-3 mt-4">
              {/* LinkedIn */}
              <a
                href={profile?.linkedin_url || '#'}
                onClick={e => { if (!profile?.linkedin_url) e.preventDefault(); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${profile?.linkedin_url ? 'hover:scale-110 hover:bg-white/10' : ''}`}
                style={{
                  border: `1.5px solid ${profile?.linkedin_url ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  background: 'rgba(255,255,255,0.03)',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={profile?.linkedin_url ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                  <rect x="2" y="9" width="4" height="12" />
                  <circle cx="4" cy="4" r="2" />
                </svg>
              </a>
              {/* Instagram */}
              <a
                href={profile?.instagram_url || '#'}
                onClick={e => { if (!profile?.instagram_url) e.preventDefault(); }}
                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${profile?.instagram_url ? 'hover:scale-110 hover:bg-white/10' : ''}`}
                style={{
                  border: `1.5px solid ${profile?.instagram_url ? 'rgba(255,255,255,0.25)' : 'rgba(255,255,255,0.08)'}`,
                  background: 'rgba(255,255,255,0.03)',
                }}
                target="_blank"
                rel="noopener noreferrer"
              >
                <svg className="block" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={profile?.instagram_url ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.2)'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                </svg>
              </a>
            </div>

            {/* Edit Button */}
            <button
              onClick={() => onNavigate('profile')}
              className="mt-3 w-full group flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg text-[10px] font-black tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
              style={{
                background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                border: '1px solid rgba(255,255,255,0.12)',
                boxShadow: '0 2px 16px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.08)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                color: '#ffffff',
              }}
            >
              <Settings size={13} className="text-sky-400 transition-transform duration-300 group-hover:rotate-90" />
              Edit About Page
              <ArrowRight size={13} className="text-white/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" />
            </button>

            {/* Hours Grid */}
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div className="rounded-lg p-3 flex items-center justify-center" style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', minHeight: '70px' }}>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-emerald-400 leading-tight">Total Hours</p>
                  <p className="text-lg font-black text-white leading-tight mt-1">{hours.toFixed(1)}</p>
                </div>
              </div>
              <div className="rounded-lg p-3 flex items-center justify-center" style={{ background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.2)', minHeight: '70px' }}>
                <div className="text-center">
                  <p className="text-[10px] font-black uppercase tracking-wider text-amber-400 leading-tight">{isFreeUser ? 'UNVERIFIED' : 'Unverified Hours'}</p>
                  <p className="text-lg font-black text-white leading-tight mt-1">{isFreeUser ? hours.toFixed(1) : unverifiedHours.toFixed(1)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Current Credentials Validity */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)' }}>
          <div className="flex items-center gap-2 mb-4">
            <ShieldCheck size={16} className="text-sky-400" />
            <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Current Credentials Validity</span>
          </div>
          {(() => {
            const now = Date.now();
            const findCredential = (type: string) => credentials.find(c => String(c?.credential_type || '').toLowerCase() === type);
            const licenseCred = findCredential('license');
            const medicalCred = findCredential('medical');
            const elpCred = findCredential('english_proficiency') || findCredential('elp');
            const radioCred = findCredential('radio_license');

            const statusBadge = (cred: any, claimed: any) => {
              if (isFreeUser) {
                if (claimed) {
                  return {
                    icon: <Clock size={14} className="text-amber-400" />,
                    label: 'UNVERIFIED',
                    color: '#d97706',
                    bg: 'rgba(245,158,11,0.08)',
                    border: 'rgba(245,158,11,0.2)',
                  };
                }
                return {
                  icon: <MinusCircle size={14} className="text-gray-400" />,
                  label: 'NOT PROVIDED',
                  color: '#6b7280',
                  bg: 'rgba(107,114,128,0.08)',
                  border: 'rgba(107,114,128,0.2)',
                };
              }
              if (!cred) {
                return {
                  icon: <MinusCircle size={14} className="text-gray-400" />,
                  label: 'NOT VERIFIED',
                  color: '#6b7280',
                  bg: 'rgba(107,114,128,0.08)',
                  border: 'rgba(107,114,128,0.2)',
                };
              }
              const status = String(cred.status || '').toLowerCase();
              const expires = cred.expires_at ? new Date(cred.expires_at).getTime() : null;
              const daysLeft = expires ? Math.ceil((expires - now) / (1000 * 60 * 60 * 24)) : null;

              if (status === 'expired' || status === 'revoked') {
                return {
                  icon: <Flag size={14} className="text-red-500" />,
                  label: 'EXPIRED',
                  color: '#dc2626',
                  bg: 'rgba(220,38,38,0.08)',
                  border: 'rgba(220,38,38,0.2)',
                };
              }
              if (status === 'flagged' || status === 'suspicious' || status === 'fraudulent') {
                return {
                  icon: <Flag size={14} className="text-red-500" />,
                  label: 'FLAGGED',
                  color: '#dc2626',
                  bg: 'rgba(220,38,38,0.08)',
                  border: 'rgba(220,38,38,0.2)',
                };
              }
              if (expires && daysLeft !== null && daysLeft <= 30) {
                return {
                  icon: <Flag size={14} className="text-white/50" />,
                  label: `EXPIRES IN ${daysLeft}D`,
                  color: 'rgba(255,255,255,0.55)',
                  bg: 'rgba(255,255,255,0.04)',
                  border: 'rgba(255,255,255,0.12)',
                };
              }
              if (status === 'active' || status === 'verified' || status === 'valid') {
                return {
                  icon: <CheckCircle2 size={14} className="text-emerald-400" />,
                  label: 'VALID',
                  color: '#16a34a',
                  bg: 'rgba(16,185,129,0.08)',
                  border: 'rgba(16,185,129,0.2)',
                };
              }
              return {
                icon: <Flag size={14} className="text-white/50" />,
                label: 'UNDER REVIEW',
                color: 'rgba(255,255,255,0.55)',
                bg: 'rgba(255,255,255,0.04)',
                border: 'rgba(255,255,255,0.12)',
              };
            };

            const items = [
              { label: 'Pilot License', claimed: profile?.license_type, cred: licenseCred },
              { label: 'Class 1 Medical', claimed: profile?.medical_class, cred: medicalCred },
              { label: 'ICAO ELP', claimed: profile?.elp_level, cred: elpCred },
              { label: 'Radio License', claimed: profile?.other_licence, cred: radioCred },
            ];

            return (
              <div className="space-y-2">
                {items.map(({ label, claimed, cred }) => {
                  const badge = statusBadge(cred, claimed);
                  return (
                    <div
                      key={label}
                      className="flex items-center justify-between px-4 py-3 rounded-xl"
                      style={{ background: badge.bg, border: `1px solid ${badge.border}` }}
                    >
                      <div className="flex flex-col min-w-0 flex-1 mr-3">
                        <span className="text-[11px] font-bold text-white leading-tight">{label}</span>
                        {claimed && (
                          <span className="text-[10px] font-bold text-emerald-400 leading-tight mt-0.5">{claimed}</span>
                        )}
                      </div>
                      <div className="flex items-center gap-1.5 flex-shrink-0">
                        {badge.icon}
                        <span className="text-[9px] font-black tracking-wider whitespace-nowrap" style={{ color: badge.color }}>{badge.label}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            );
          })()}
          {isFreeUser && (
            <div className="mt-5 rounded-xl p-4 text-center" style={{ background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.2)' }}>
              <p className="text-[11px] text-white/80 leading-relaxed">
                Upgrade to{' '}<span className="font-black" style={{ color: '#dc2626' }}>Recognition+</span>{' '}to view real-time credential validity, international compliance alerts, and automatic renewal reminders.
              </p>
            </div>
          )}
        </div>

        {/* Profile Strength Score */}
        <div className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          {(() => {
            const categories = [
              {
                title: 'Identity & Account',
                items: [
                  { key: 'license_type', label: 'Pilot License', weight: 8 },
                  { key: 'medical_class', label: 'Medical Certificate', weight: 8 },
                  { key: 'elp_level', label: 'ICAO English Level', weight: 8 },
                  { key: 'date_of_birth', label: 'Date of Birth', weight: 6 },
                  { key: 'nationality', label: 'Nationality', weight: 6 },
                  { key: 'profile_image_url', label: 'Profile Photo', weight: 4 },
                  { key: 'bio', label: 'Bio / About', weight: 4 },
                  { key: '__social', label: 'Social Media Accounts', weight: 6, check: () => !!(profile?.linkedin_url || profile?.instagram_url) },
                ],
              },
              {
                title: 'Flight Log & Ratings',
                items: [
                  { key: 'total_flight_hours', label: 'Flight Hours', weight: 10, check: (v: any) => (v ?? 0) > 0 },
                  { key: '__logbook', label: 'Logbook Sync', weight: 8, check: () => logbookConnected },
                  { key: '__advanced', label: 'Ratings / Aircraft / Domicile', weight: 8, check: () => !!(profile?.ratings || profile?.aircraft_types || profile?.type_ratings || profile?.domicile) },
                ],
              },
              {
                title: 'Career & Pathways',
                items: [
                  { key: 'current_occupation', label: 'Current Occupation', weight: 8 },
                  { key: '__interests', label: 'Career Goal & Stage', weight: 6, check: () => !!(profile?.career_goal || profile?.pilot_stage || profile?.employment_status || profile?.current_job) },
                ],
              },
              {
                title: 'Recognition+ Verification',
                items: [
                  { key: '__verified', label: 'Credential Verification', weight: 14, check: () => verificationStatus === 'verified' },
                  { key: '__recency', label: 'Recency & Currency Tracker', weight: 10, check: () => !isFreeUser },
                ],
              },
            ];

            let score = 0;
            let maxPossible = 0;
            const missingItems: { label: string; weight: number }[] = [];
            categories.forEach(cat => {
              cat.items.forEach(item => {
                const val = profile?.[item.key];
                const filled = item.check ? item.check(val) : !!val;
                maxPossible += item.weight;
                if (filled) score += item.weight;
                else missingItems.push({ label: item.label, weight: item.weight });
              });
            });

            const pct = maxPossible > 0 ? Math.round((score / maxPossible) * 100) : 0;
            const meterColor = pct >= 80 ? '#16a34a' : pct >= 50 ? 'rgba(255,255,255,0.7)' : '#dc2626';
            const meterBg = pct >= 80 ? 'rgba(16,185,129,0.12)' : pct >= 50 ? 'rgba(255,255,255,0.06)' : 'rgba(220,38,38,0.12)';
            const meterBorder = pct >= 80 ? 'rgba(16,185,129,0.25)' : pct >= 50 ? 'rgba(255,255,255,0.15)' : 'rgba(220,38,38,0.25)';
            const nextStep = missingItems[0];

            return (
              <>
                <div className="flex items-center gap-2 mb-4">
                  <Award size={16} className="text-sky-400" />
                  <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Profile Strength</span>
                </div>
                <div className="flex items-center gap-4 mb-4">
                  <div className="relative w-16 h-16 flex-shrink-0">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <path className="text-white/10" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" />
                      <path className="transition-all duration-700 ease-out" stroke={meterColor} d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" strokeWidth="3" strokeDasharray={`${pct}, 100`} strokeLinecap="round" />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-sm font-black" style={{ color: meterColor }}>{pct}%</span>
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-bold text-white leading-tight">
                      {pct >= 80 ? 'Strong profile — ready for verification' : pct >= 50 ? 'Good start — a few fields left' : 'Profile needs attention'}
                    </p>
                    {nextStep && (
                      <p className="text-[10px] text-white/50 mt-1 leading-tight">
                        Add <span className="font-bold text-white/70">{nextStep.label}</span> to reach {Math.min(100, pct + nextStep.weight)}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="rounded-xl p-3 mb-4" style={{ background: meterBg, border: `1px solid ${meterBorder}` }}>
                  <p className="text-[10px] text-white/90 leading-relaxed">
                    <span className="font-bold text-white">Verification unlocks expiry tracking.</span> Complete your profile, then start verification to see license and medical expiration dates, renewal alerts, and international compliance status.
                  </p>
                </div>
                <div className="space-y-2">
                  {categories.map(cat => {
                    const filledCount = cat.items.filter(item => {
                      const val = profile?.[item.key];
                      return item.check ? item.check(val) : !!val;
                    }).length;
                    const allFilled = filledCount === cat.items.length;
                    return (
                      <div
                        key={cat.title}
                        ref={el => { catRefs.current[cat.title] = el; }}
                        onMouseEnter={() => {
                          const el = catRefs.current[cat.title];
                          if (!el) return;
                          const rect = el.getBoundingClientRect();
                          setTooltip({ title: cat.title, items: cat.items, x: rect.left, y: rect.bottom + 6, w: rect.width });
                        }}
                        onMouseLeave={() => setTooltip(null)}
                        className="rounded-xl px-3 py-2.5 cursor-help"
                        style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {allFilled ? (
                              <CheckCircle2 size={12} className="text-emerald-400 flex-shrink-0" />
                            ) : (
                              <div className="w-3 h-3 rounded-full flex-shrink-0" style={{ border: `1.5px solid ${filledCount > 0 ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.2)'}` }} />
                            )}
                            <span className={`text-[11px] font-black ${allFilled ? 'text-white/60' : 'text-white/80'}`}>{cat.title}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-black px-2 py-0.5 rounded-full" style={{ background: allFilled ? 'rgba(16,185,129,0.15)' : filledCount > 0 ? 'rgba(255,255,255,0.1)' : 'rgba(255,255,255,0.06)', color: allFilled ? '#16a34a' : filledCount > 0 ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.35)' }}>
                              {filledCount}/{cat.items.length}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                {/* Fixed tooltip overlay — portal to body to escape all stacking contexts */}
                {tooltip && ReactDOM.createPortal(
                  <div
                    className="fixed z-[9999] rounded-xl p-3"
                    style={{ left: tooltip.x, top: tooltip.y, width: tooltip.w, background: 'rgba(0,0,0,0.92)', border: '1px solid rgba(255,255,255,0.15)', backdropFilter: 'blur(16px)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}
                    onMouseEnter={() => {}}
                    onMouseLeave={() => setTooltip(null)}
                  >
                    <p className="text-[10px] font-black text-white/40 mb-1.5 uppercase tracking-wider">{tooltip.title}</p>
                    <div className="space-y-1">
                      {tooltip.items.map(item => {
                        const val = profile?.[item.key];
                        const filled = item.check ? item.check(val) : !!val;
                        return (
                          <div key={item.key} className="flex items-center gap-2">
                            <span className={`text-[9px] ${filled ? 'text-emerald-400' : 'text-white/20'}`}>{filled ? '●' : '○'}</span>
                            <span className={`text-[10px] font-bold ${filled ? 'text-white/80' : 'text-white/30'}`}>{item.label}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>,
                  document.body
                )}
              </>
            );
          })()}
        </div>
      </motion.div>

      {/* Recency & Currency Tracker — Recognition+ feature */}
      <motion.div variants={itemVariants} className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
        <div className="flex items-center gap-2 mb-4">
          <Award size={16} className="text-sky-400 mt-[2px]" />
          <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Recency & Currency Tracker</span>
        </div>
        {isFreeUser ? (
          <>
            {(() => {
              const parseArr = (raw: any) => {
                if (!raw) return [];
                try { return JSON.parse(raw); } catch { return [raw]; }
              };
              const typeRatings = parseArr(profile?.type_ratings).filter((a: string) => a && !a.startsWith('__'));

              // ── Parse aircraft ratings from profile (advanced profile form) ──
              const rawProfileRatings = profile?.aircraft_ratings || [];
              const profileRatings: Array<{
                id: string; aircraftClass: string; aircraftType: string;
                manufacturer: string; model: string; tailNumber: string;
                ratingDate: string; isCurrent: boolean; lastFlown: string;
              }> = Array.isArray(rawProfileRatings) ? rawProfileRatings : (
                typeof rawProfileRatings === 'string' ? (() => { try { return JSON.parse(rawProfileRatings); } catch { return []; } })() : []
              );
              const profileRatingsByType = new Map<string, typeof profileRatings[0]>();
              profileRatings.forEach((r: any) => {
                if (r?.aircraftType) profileRatingsByType.set(r.aircraftType.toLowerCase(), r);
              });

              // ── Aircraft classifier ──
              function classifyAircraft(t: string): 'sel' | 'mel' | 'unknown' {
                const type = t.toLowerCase();
                const sel = ['cessna 17', 'cessna 15', 'cessna 182', 'cessna 206', 'cessna 210', 'piper pa-28', 'piper pa-38', 'piper j-3', 'piper cub', 'diamond da20', 'diamond da40', 'cirrus sr22', 'mooney m20', 'beechcraft bonanza', 'maule', 'cherokee', 'warrior', 'archer', 'tomahawk', 'robin', 'pa-28', 'pa-38', 'skyhawk', 'skylane', 'cub'];
                const mel = ['tecnam p2006t', 'beechcraft baron', 'beechcraft duke', 'beechcraft king air', 'piper pa-34', 'piper pa-44', 'piper seneca', 'diamond da42', 'cessna 310', 'cessna 340', 'cessna 414', 'cessna 421', 'king air', 'baron', 'duke', 'seneca', 'pa-34', 'pa-44', 'da42'];
                if (sel.some(s => type.includes(s))) return 'sel';
                if (mel.some(s => type.includes(s))) return 'mel';
                return 'unknown';
              }

              // ── Build stats per aircraft type from logbook ──
              const aircraftByType = new Map<string, { total: number; lastDate: string | null; tailNumbers: Set<string> }>();
              logbook.forEach((entry: any) => {
                const type = String(entry?.aircraft_type || '').trim();
                if (!type) return;
                const hrs = Number(entry?.hours || 0);
                const date = entry?.date;
                const reg = String(entry?.registration || '').trim();
                if (!aircraftByType.has(type)) {
                  aircraftByType.set(type, { total: 0, lastDate: null, tailNumbers: new Set() });
                }
                const s = aircraftByType.get(type)!;
                s.total += hrs;
                if (date && (!s.lastDate || date > s.lastDate)) s.lastDate = date;
                if (reg) s.tailNumbers.add(reg);
              });

              // ── Also aggregate for type ratings (legacy route-match fallback) ──
              const typeRatingStats = new Map<string, { total: number; lastDate: string | null }>();
              typeRatings.forEach((type: string) => typeRatingStats.set(type, { total: 0, lastDate: null }));
              logbook.forEach((entry: any) => {
                const route = String(entry?.route || '');
                const hrs = Number(entry?.hours || 0);
                const date = entry?.date;
                typeRatings.forEach((type: string) => {
                  const key = type.toLowerCase();
                  if (route.toLowerCase().includes(key) || String(entry?.aircraft_type || '').toLowerCase().includes(key)) {
                    const s = typeRatingStats.get(type)!;
                    s.total += hrs;
                    if (date && (!s.lastDate || date > s.lastDate)) s.lastDate = date;
                  }
                });
              });

              const selAircraft: { type: string; total: number; lastDate: string | null; tailNumbers: string[] }[] = [];
              const melAircraft: { type: string; total: number; lastDate: string | null; tailNumbers: string[] }[] = [];
              const unknownAircraft: { type: string; total: number; lastDate: string | null; tailNumbers: string[] }[] = [];

              aircraftByType.forEach((stats, type) => {
                const cat = classifyAircraft(type);
                const entry = { type, total: stats.total, lastDate: stats.lastDate, tailNumbers: Array.from(stats.tailNumbers) };
                if (cat === 'sel') selAircraft.push(entry);
                else if (cat === 'mel') melAircraft.push(entry);
                else unknownAircraft.push(entry);
              });

              // ── Sub-row component for aircraft under SEL/MEL ──
              const AircraftSubRow = ({ aircraft }: { aircraft: { type: string; total: number; lastDate: string | null; tailNumbers: string[] } }) => {
                const daysSince = aircraft.lastDate ? Math.floor((Date.now() - new Date(aircraft.lastDate).getTime()) / (1000 * 60 * 60 * 24)) : null;
                const isCurrent = daysSince !== null && daysSince <= 90;
                const [selectedTail, setSelectedTail] = React.useState(aircraft.tailNumbers[0] || '');
                const profileRating = profileRatingsByType.get(aircraft.type.toLowerCase());
                const profileLastFlown = profileRating?.lastFlown;
                const profileDaysSince = profileLastFlown ? Math.floor((Date.now() - new Date(profileLastFlown).getTime()) / (1000 * 60 * 60 * 24)) : null;
                const isProfileCurrent = profileDaysSince !== null && profileDaysSince <= 90;

                return (
                  <div className="flex items-center gap-4 px-4 py-2.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)', marginLeft: '1.5rem' }}>
                    {/* Aircraft name */}
                    <div className="min-w-[100px]">
                      <span className="text-[10px] font-black text-white/80">{aircraft.type}</span>
                    </div>

                    {/* Logbook Entry (tail number + hours + profile details) */}
                    <div className="flex items-center gap-1.5 flex-1 flex-wrap">
                      {aircraft.tailNumbers.length > 0 ? (
                        <select
                          value={selectedTail}
                          onChange={(e) => setSelectedTail(e.target.value)}
                          className="text-[9px] font-bold rounded px-1.5 py-0.5 outline-none"
                          style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.12)' }}
                        >
                          {aircraft.tailNumbers.map(tail => (
                            <option key={tail} value={tail} style={{ background: '#1a1a2e', color: '#fff' }}>{tail}</option>
                          ))}
                        </select>
                      ) : (
                        <span className="text-[9px] text-white/30">No tail #</span>
                      )}
                      <span className="text-[9px] font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(16,185,129,0.15)', color: '#16a34a' }}>
                        {aircraft.total.toFixed(1)}h
                      </span>
                      {profileRating && (
                        <span className="text-[9px] text-white/50">
                          {profileRating.manufacturer} {profileRating.model}
                          {profileRating.ratingDate && ` · ${profileRating.ratingDate}`}
                        </span>
                      )}
                    </div>

                    {/* Currency Tracker */}
                    <div className="min-w-[110px] text-right">
                      {profileLastFlown ? (
                        <>
                          <span className="text-[9px] text-white/50">{profileDaysSince}d ago</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1" style={{ background: isProfileCurrent ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)', color: isProfileCurrent ? '#16a34a' : '#ef4444' }}>
                            {isProfileCurrent ? 'Current' : 'Recurrency'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-white/40">N/A</span>
                      )}
                    </div>

                    {/* Verified Hours Total */}
                    <div className="min-w-[130px] text-right pr-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full cursor-pointer" style={{ background: 'rgba(220,38,38,0.15)', color: '#ef4444' }}>
                        Get Verified
                      </span>
                    </div>
                  </div>
                );
              };

              // ── Type Rating row (simplified, no verification check) ──
              const TypeRatingRow = ({ type }: { type: string }) => {
                const stats = typeRatingStats.get(type)!;
                const hasLogbook = stats.total > 0;
                const logbookDaysSince = stats.lastDate ? Math.floor((Date.now() - new Date(stats.lastDate).getTime()) / (1000 * 60 * 60 * 24)) : null;
                const profileRating = profileRatingsByType.get(type.toLowerCase());
                const profileLastFlown = profileRating?.lastFlown;
                const profileDaysSince = profileLastFlown ? Math.floor((Date.now() - new Date(profileLastFlown).getTime()) / (1000 * 60 * 60 * 24)) : null;
                const isProfileCurrent = profileDaysSince !== null && profileDaysSince <= 90;
                return (
                  <div className="flex items-center gap-4 px-4 py-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {/* Type */}
                    <div className="min-w-[100px]">
                      <span className="text-[11px] font-black text-white">{type}</span>
                    </div>
                    {/* Logbook Entry */}
                    <div className="flex items-center gap-2 flex-1">
                      {hasLogbook ? (
                        <>
                          <Clock size={12} className="text-sky-400 flex-shrink-0" />
                          <span className="text-[10px] font-bold text-white/60">{logbookDaysSince !== null ? `${logbookDaysSince} days ago` : 'Date unknown'}</span>
                        </>
                      ) : profileRating ? (
                        <>
                          <FileText size={12} className="text-sky-400 flex-shrink-0" />
                          <span className="text-[10px] font-bold text-white/60">
                            {profileRating.manufacturer} {profileRating.model}
                            {profileRating.tailNumber && ` · ${profileRating.tailNumber}`}
                            {profileRating.ratingDate && ` · ${profileRating.ratingDate}`}
                          </span>
                        </>
                      ) : (
                        <div className="flex items-center gap-2 flex-1">
                          <MinusCircle size={12} className="text-gray-400 flex-shrink-0" />
                          <span className="text-[10px] font-bold text-gray-400">No logbook entry</span>
                          <button
                            onClick={() => setShowLogbookModal(true)}
                            className="ml-1 px-2.5 py-1 rounded-md text-[9px] font-black tracking-wide transition-all hover:opacity-80 self-center"
                            style={{ background: '#000000', color: '#ffffff' }}
                          >
                            Connect Digital Logbook
                          </button>
                        </div>
                      )}
                    </div>
                    {/* Currency Tracker */}
                    <div className="min-w-[110px] text-right">
                      {profileLastFlown ? (
                        <>
                          <span className="text-[9px] text-white/50">{profileDaysSince}d ago</span>
                          <span className="text-[8px] font-bold px-1.5 py-0.5 rounded-full ml-1" style={{ background: isProfileCurrent ? 'rgba(16,185,129,0.15)' : 'rgba(220,38,38,0.15)', color: isProfileCurrent ? '#16a34a' : '#ef4444' }}>
                            {isProfileCurrent ? 'Current' : 'Recurrency'}
                          </span>
                        </>
                      ) : (
                        <span className="text-[10px] font-bold text-white/40">N/A</span>
                      )}
                    </div>
                    {/* Verified Hours Total */}
                    <div className="min-w-[130px] text-right pr-2">
                      <span className="text-[9px] font-black px-2 py-0.5 rounded-full cursor-pointer" style={{ background: 'rgba(220,38,38,0.15)', color: '#ef4444' }}>
                        Get Verified
                      </span>
                    </div>
                  </div>
                );
              };

              return (
                <div className="space-y-5">
                  {/* Type Ratings */}
                  {typeRatings.length > 0 && (
                    <div className="space-y-3">
                      <p className="text-[10px] font-black tracking-wider uppercase text-white/40">Type Ratings</p>
                      {/* Column headers */}
                      <div className="flex items-center gap-4 px-4 pb-1">
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[100px]">Type</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/25 flex-1">Logbook Entry</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[110px] text-right">Currency Tracker</span>
                        <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[130px] text-right">Verified Hours Total</span>
                      </div>
                      <div className="space-y-2">
                        {typeRatings.map((type: string) => (
                          <TypeRatingRow key={type} type={type} />
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Class Ratings — hierarchical SEL / MEL */}
                  <div className="space-y-4">
                    {/* SEL */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-wider uppercase text-white/40">Single Engine Land (SEL)</p>
                      {selAircraft.length > 0 ? (
                        <>
                          <div className="flex items-center gap-4 px-4 pb-1" style={{ marginLeft: '1.5rem' }}>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[100px]">Aircraft</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 flex-1">Logbook Entry</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[110px] text-right">Currency Tracker</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[130px] text-right">Verified Hours Total</span>
                          </div>
                          <div className="space-y-1.5">
                            {selAircraft.map(a => (
                              <AircraftSubRow key={a.type} aircraft={a} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="px-4 py-2 rounded-2xl text-[10px] text-white/40 italic" style={{ background: 'transparent', marginLeft: '1.5rem' }}>
                          No SEL aircraft logged
                        </div>
                      )}
                    </div>

                    {/* MEL */}
                    <div className="space-y-2">
                      <p className="text-[10px] font-black tracking-wider uppercase text-white/40">Multi-Engine Land (MEL)</p>
                      {melAircraft.length > 0 ? (
                        <>
                          <div className="flex items-center gap-4 px-4 pb-1" style={{ marginLeft: '1.5rem' }}>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[100px]">Aircraft</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 flex-1">Logbook Entry</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[110px] text-right">Currency Tracker</span>
                            <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[130px] text-right">Verified Hours Total</span>
                          </div>
                          <div className="space-y-1.5">
                            {melAircraft.map(a => (
                              <AircraftSubRow key={a.type} aircraft={a} />
                            ))}
                          </div>
                        </>
                      ) : (
                        <div className="px-4 py-2 rounded-2xl text-[10px] text-white/40 italic" style={{ background: 'transparent', marginLeft: '1.5rem' }}>
                          No MEL aircraft logged
                        </div>
                      )}
                    </div>

                    {/* Unknown / unclassified aircraft (if any) */}
                    {unknownAircraft.length > 0 && (
                      <div className="space-y-2">
                        <p className="text-[10px] font-black tracking-wider uppercase text-white/40">Other Aircraft</p>
                        <div className="flex items-center gap-4 px-4 pb-1" style={{ marginLeft: '1.5rem' }}>
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[100px]">Aircraft</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/25 flex-1">Logbook Entry</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[110px] text-right">Currency Tracker</span>
                          <span className="text-[9px] font-black uppercase tracking-wider text-white/25 min-w-[130px] text-right">Verified Hours Total</span>
                        </div>
                        <div className="space-y-1.5">
                          {unknownAircraft.map(a => (
                            <AircraftSubRow key={a.type} aircraft={a} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })()}
          </>
        ) : (
          (() => {
            const lastLogbookEntry = logbook[0];
            const lastFlight = lastLogbookEntry?.date || profile?.last_flown || profile?.last_flight_date;
            const lastFlightHours = lastLogbookEntry?.hours || profile?.last_flight_hours || null;
            const daysSinceFlight = lastFlight ? Math.floor((Date.now() - new Date(lastFlight).getTime()) / (1000 * 60 * 60 * 24)) : null;
            const lastInstrument = profile?.last_instrument_flight || profile?.last_ifr_flight;
            const daysSinceInstrument = lastInstrument ? Math.floor((Date.now() - new Date(lastInstrument).getTime()) / (1000 * 60 * 60 * 24)) : null;
            const instrumentCurrency = daysSinceInstrument !== null ? Math.max(0, 90 - daysSinceInstrument) : null;
            const lastCheckride = profile?.last_checkride || profile?.last_proficiency_check;
            const daysSinceCheckride = lastCheckride ? Math.floor((Date.now() - new Date(lastCheckride).getTime()) / (1000 * 60 * 60 * 24)) : null;
            const nextCheckrideDays = daysSinceCheckride !== null ? Math.max(0, 365 - daysSinceCheckride) : null;
            const lastFlightValue = daysSinceFlight === null
              ? 'No flights logged'
              : lastFlightHours !== null
                ? `${Number(lastFlightHours).toFixed(1)}h · ${daysSinceFlight} days ago`
                : `${daysSinceFlight} days ago`;
            const items = [
              { label: 'Last Flight Logged', value: lastFlightValue, warning: daysSinceFlight !== null && daysSinceFlight > 30 },
              { label: 'Last Checkride / Proficiency', value: daysSinceCheckride === null ? 'No record' : `${daysSinceCheckride} days ago`, warning: daysSinceCheckride !== null && daysSinceCheckride > 300 },
              { label: 'Next Proficiency Check', value: nextCheckrideDays === null ? 'N/A' : `${nextCheckrideDays} days remaining`, warning: nextCheckrideDays !== null && nextCheckrideDays <= 60 },
              { label: 'Instrument Currency (90-day)', value: instrumentCurrency === null ? 'No IFR flights logged' : `${instrumentCurrency} days left`, warning: instrumentCurrency !== null && instrumentCurrency <= 14 },
              { label: 'Last Recurrency', value: profile?.last_recurrency ? `${Math.floor((Date.now() - new Date(profile.last_recurrency).getTime()) / (1000 * 60 * 60 * 24))} days ago` : 'No record' },
            ];
            return (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {items.map(({ label, value, warning }) => (
                  <div key={label} className="flex flex-col gap-1 px-4 py-3 rounded-xl" style={{ background: warning ? 'rgba(245,158,11,0.08)' : 'rgba(255,255,255,0.04)', border: `1px solid ${warning ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)'}` }}
                  >
                    <span className="text-[10px] font-black uppercase tracking-wider text-white/50">{label}</span>
                    <div className="flex items-center gap-2">
                      {warning && <AlertCircle size={12} className="text-amber-400" />}
                      <span className={`text-[12px] font-bold ${warning ? 'text-amber-400' : 'text-white'}`}>{value}</span>
                    </div>
                  </div>
                ))}
              </div>
            );
          })()
        )}
        {isFreeUser && (
          <>
            <div className="mt-4 flex items-center justify-center">
              <button
                onClick={() => setTab('advanced-profile')}
                className="group flex items-center gap-2.5 px-5 py-3 rounded-xl text-[11px] font-black tracking-wider uppercase transition-all duration-300 hover:scale-[1.02] active:scale-[0.98]"
                style={{
                  background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, rgba(255,255,255,0.03) 100%)',
                  border: '1px solid rgba(255,255,255,0.15)',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  color: '#ffffff',
                }}
              >
                <Settings size={14} className="text-sky-400 transition-transform duration-300 group-hover:rotate-90" />
                Complete Advanced Profile
                <ArrowRight size={14} className="text-white/40 transition-all duration-300 group-hover:text-white group-hover:translate-x-0.5" style={{ transform: 'translateY(-1px)' }} />
              </button>
            </div>
            <div className="mt-4 rounded-xl p-4 text-center" style={{ background: 'rgba(107,114,128,0.08)', border: '1px solid rgba(107,114,128,0.2)' }}>
              <p className="text-[11px] text-white/60 leading-relaxed">
                Upgrade to{' '}<span className="font-black" style={{ color: '#dc2626' }}>Recognition+</span>{' '}to unlock recency tracking, proficiency check countdown, and international compliance alerts.
              </p>
            </div>
          </>
        )}
      </motion.div>

      {/* Endorsements, employment, operational status, approach certifications, visibility banner */}
      <motion.div variants={itemVariants}>
        <VerificationDashboardGrid profile={profile} setTab={setTab} />
      </motion.div>

      {/* Digital Dashboard */}
      <motion.div variants={itemVariants} className="space-y-5 max-w-3xl mx-auto">
        {/* Header text bar */}
        <div className="flex items-center justify-between rounded-xl px-4 py-3" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
          <div className="flex items-center gap-2.5">
            <BookOpen size={20} className="text-sky-400" />
            <span className="text-xs font-black tracking-widest uppercase text-white">Digital Dashboard</span>
          </div>
          <span className="text-[11px] font-black text-amber-400 pr-1">{logbookConnected ? `${logbook.length} entries synced` : 'Not connected'}</span>
        </div>

        {/* Floating hours cards with collapse reveal */}
        <div className="relative mb-4">
          <div className={`overflow-hidden transition-all duration-500 ease-in-out ${logsExpanded ? 'max-h-[600px]' : 'max-h-[110px]'}`}>
            {/* High-level telemetry — always visible */}
            <div className="grid grid-cols-3 gap-3 mb-3">
              {[
                { label: 'Total Time', value: fmtHrs(totalTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : 'unverified' },
                { label: 'PIC', value: fmtHrs(picTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'DUAL', value: fmtHrs(dualTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="rounded-xl p-4 text-center flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  <p className="text-3xl font-black text-white text-center w-full" style={{ color }}>{value}</p>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-wider mt-1 text-center w-full">{label}</p>
                  {sub && <p className="text-[9px] font-black text-white/50 uppercase tracking-wider mt-0.5 underline decoration-white/20 underline-offset-2 text-center w-full">{sub}</p>}
                </div>
              ))}
            </div>

            {/* Detailed telemetry — revealed on View More */}
            <div className="grid grid-cols-3 gap-3">
              {[
                { label: 'Cross Country', value: fmtHrs(xcTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'Night Time', value: fmtHrs(nightTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'Simulated Instrument', value: fmtHrs(simInstTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'Total Landings', value: landings, color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'SIM Time', value: fmtHrs(simTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
                { label: 'Actual Instrument', value: fmtHrs(actualInstTime), color: '#ffffff', sub: isFreeUser ? 'UNVERIFIED' : '' },
              ].map(({ label, value, color, sub }) => (
                <div key={label} className="rounded-xl p-4 text-center flex flex-col items-center justify-center" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
                  <p className="text-2xl font-black text-white text-center w-full" style={{ color }}>{value}</p>
                  <p className="text-[9px] font-black text-white/50 uppercase tracking-wider mt-1 text-center w-full">{label}</p>
                  {sub && <p className="text-[9px] font-black text-white/50 uppercase tracking-wider mt-0.5 underline decoration-white/20 underline-offset-2 text-center w-full">{sub}</p>}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Free user sync prompt */}
        {isFreeUser && !logbookConnected && (
          <div className="rounded-xl p-4 text-center mb-3" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.35)' }}>
            <p className="text-[10px] text-white/90 leading-relaxed">
              <span className="font-black text-white">UNVERIFIED</span> — Hours pulled from profile. Please sync a logbook to confirm total count and ensure it is ready for verification.
            </p>
          </div>
        )}

        {/* Floating View More button */}
        <button
          onClick={() => setLogsExpanded(v => !v)}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl text-[10px] font-black tracking-wider text-white/60 transition-all hover:bg-white/10"
          style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}
        >
          {logsExpanded ? 'SHOW LESS' : 'VIEW MORE'} <span className="inline-flex items-center justify-center ml-2 leading-none">{logsExpanded ? <ChevronUp size={12} className="block" /> : <ChevronDown size={12} className="block" />}</span>
        </button>

        {/* Floating Access Logbook — only visible when synced */}
        {logbookConnected && (
          <div className="rounded-2xl p-6" style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)', backdropFilter: 'blur(12px)', WebkitBackdropFilter: 'blur(12px)' }}>
            <button
              onClick={() => setLogbookFormatsExpanded(v => !v)}
              className="w-full flex items-center justify-between mb-3"
            >
              <div className="flex items-center gap-2">
                <Download size={14} className="text-white/50" />
                <span className="text-[10px] font-black tracking-wider uppercase text-white/50">Access Logbook</span>
              </div>
              {logbookFormatsExpanded ? <ChevronUp size={14} className="text-white/40" /> : <ChevronDown size={14} className="text-white/40" />}
            </button>
            {logbookFormatsExpanded && (
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {['EASA', 'CAAP', 'FAA', 'ICAO'].map(format => (
                  <button
                    key={format}
                    className="py-2.5 rounded-xl text-[10px] font-black tracking-wider text-white transition-all hover:bg-white/10"
                    style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                    onClick={() => { /* export handler placeholder */ }}
                  >
                    {format}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* Connect a digital logbook */}
      <button
        onClick={() => { setSelectedProvider(null); setShowLogbookModal(true); }}
        className="w-full flex items-center justify-center gap-2.5 px-6 py-[18px] text-[10px] font-black tracking-wider uppercase text-white/50 transition-all hover:bg-white/5 leading-none"
        style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <BookOpen size={16} className="text-white/40 block" />
        <span className="leading-none">Connect digital logbook</span>
      </button>

      {/* Logbook Provider Modal */}
      {showLogbookModal && (
        <div className="fixed inset-0 z-[999] flex items-center justify-center px-4 overflow-y-hidden" onClick={() => setShowLogbookModal(false)}>
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
          <div className="relative z-10 w-full max-w-4xl bg-white border border-gray-200 rounded-3xl p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-gray-900 font-black text-lg">Connect Logbook Provider</h3>
                <p className="text-gray-400 text-sm mt-0.5">Select your digital logbook to verify flight hours</p>
              </div>
              <button onClick={() => setShowLogbookModal(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 text-gray-400 hover:bg-gray-200 hover:text-gray-600 text-xl leading-none transition-all">×</button>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-5">
              {[
                { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png', badge: 'Free', status: 'available', method: 'OAuth 2.0', methodColor: 'text-sky-500' },
                { id: 'foreflight', name: 'ForeFlight', region: 'Global', logo: '✈️', status: 'coming_soon', method: 'API', methodColor: 'text-purple-500' },
                { id: 'garmin', name: 'Garmin Pilot', region: 'Global', logo: '📍', status: 'coming_soon', method: 'API', methodColor: 'text-orange-500' },
                { id: 'logten', name: 'LogTen Pro', region: 'Global', logo: '📓', status: 'coming_soon', method: 'CSV', methodColor: 'text-green-500' },
              ].map((p) => (
                <button
                  key={p.id}
                  disabled={p.status === 'coming_soon'}
                  onClick={() => setSelectedProvider(p.name)}
                  className={`group relative flex flex-row items-center gap-4 px-5 py-5 rounded-2xl border transition-all text-left w-full cursor-pointer ${
                    selectedProvider === p.name
                      ? 'border-blue-500 bg-blue-50/60 ring-1 ring-blue-500/20'
                      : p.status === 'coming_soon'
                      ? 'border-gray-100 bg-gray-50/50 cursor-not-allowed'
                      : 'border-gray-200 bg-gray-50 hover:bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                >
                  <span className="flex-shrink-0 w-14 h-14 flex items-center justify-center rounded-xl bg-white shadow-sm border border-gray-100">
                    {p.logoImg ? <img src={p.logoImg} alt={p.name} className="w-10 h-10 object-contain" /> : <span className="text-2xl">{p.logo}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-[15px] font-bold leading-tight ${selectedProvider === p.name ? 'text-gray-900' : 'text-gray-700'}`}>{p.name}</span>
                      {p.badge && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-600">{p.badge}</span>
                      )}
                    </div>
                    <span className={`text-[11px] ${selectedProvider === p.name ? 'text-gray-500' : 'text-gray-400'}`}>
                      {p.region}{p.id === 'myflightbook' ? ' · Default logbook' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-[11px] font-semibold ${p.methodColor}`}>{p.method}</span>
                    {selectedProvider === p.name && (
                      <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center">
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                  {p.status === 'coming_soon' && (
                    <div className="absolute inset-0 rounded-2xl bg-white/70 backdrop-blur-[2px] flex items-center justify-center pointer-events-none">
                      <span className="text-[11px] font-bold text-gray-500 tracking-widest uppercase">Coming Soon</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
            <button
              onClick={() => {
                if (!selectedProvider) return;
                const providerName = selectedProvider.toLowerCase();
                if (providerName.includes('myflightbook')) {
                  const redirectUri = 'https://pilotrecognition.com/auth/logbook/callback';
                  const clientId = import.meta.env.VITE_MFB_CLIENT_ID || 'PilotRecognition';
                  const url = `https://myflightbook.com/logbook/mvc/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=totals`;
                  safeRedirect(url);
                } else {
                  setShowLogbookModal(false);
                }
              }}
              disabled={!selectedProvider}
              className="w-full py-3.5 bg-gray-900 hover:bg-gray-800 disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-gray-900 text-white font-black rounded-2xl transition-all text-sm tracking-wide"
            >
              {selectedProvider ? `Sync with ${selectedProvider}` : 'Select a provider'}
            </button>
            <div className="flex flex-wrap gap-x-3 gap-y-1 mt-4 mb-1 justify-center">
              <span className="text-[10px] text-sky-500 font-medium">● OAuth 2.0</span>
              <span className="text-[10px] text-purple-500 font-medium">● API Passkey</span>
              <span className="text-[10px] text-green-500 font-medium">● Direct API</span>
              <span className="text-[10px] text-orange-500 font-medium">● CSV Import</span>
            </div>
            <p className="text-gray-300 text-[11px] text-center leading-relaxed mt-1">
              Read-only access only. We never modify your logbook data.
            </p>
          </div>
        </div>
      )}

      {/* Career Progress Dashboard CTA */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6 cursor-pointer group"
        style={{
          background: 'linear-gradient(135deg, rgba(37,99,235,0.18), rgba(15,23,42,0.92))',
          border: '1px solid rgba(255,255,255,0.12)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
        onClick={() => onNavigate('platform/career-progress')}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: 'rgba(56,189,248,0.15)', border: '1px solid rgba(56,189,248,0.3)' }}>
              <TrendingUp size={18} className="text-sky-400 block" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-wider uppercase text-sky-400 mb-1">Career Progress</p>
              <p className="text-sm font-black text-white">View Career Progress Dashboard</p>
              <p className="text-xs text-white/80 mt-0.5">Track your pathway to airline readiness</p>
            </div>
          </div>
          <ArrowRight size={18} className="text-white/30 group-hover:text-white transition-colors" />
        </div>
      </motion.div>
    </motion.div>
  );
};
