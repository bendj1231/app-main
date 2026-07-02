import React from 'react';
import { useSearchParams } from 'react-router-dom';
import ReactDOM from 'react-dom';
import { motion } from 'framer-motion';
import {
  ShieldCheck, AlertCircle, Clock, CheckCircle2, ArrowRight,
  Award, Settings,
  BookOpen,
  Flag, MinusCircle, Camera,
  FileText, TrendingUp,
  Sparkles, UserCheck, User, Plane, Briefcase, ChevronRight
} from 'lucide-react';
import { uploadProfileImage } from '@/lib/cloudinaryClient';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { safeRedirect } from '@/lib/url-validator';
import type { TabId } from '../types';
import { CockpitFlightHoursDashboard } from '../CockpitFlightHoursDashboard';

// ─── DASHBOARD LEGEND BANNER ────────────────────────────────────────────────
const DashboardLegendBanner: React.FC<{ isFreeUser: boolean }> = ({ isFreeUser }) => {
  const [showModal, setShowModal] = React.useState(false);

  return (
    <>
      <div className="flex items-center justify-between gap-3">
        <span className="text-[10px] font-black tracking-[0.25em] uppercase text-white/90 whitespace-nowrap">
          Dashboard
        </span>
        <button
          onClick={() => setShowModal(true)}
          className="text-[10px] font-bold tracking-wider uppercase text-white/70 hover:text-white transition-colors"
        >
          Learn more
        </button>
      </div>
      <div
        className="w-full h-px rounded-full"
        style={{
          background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.65) 20%, rgba(255,255,255,0.85) 50%, rgba(255,255,255,0.65) 80%, transparent 100%)',
          boxShadow: '0 0 8px rgba(255,255,255,0.25), 0 1px 2px rgba(255,255,255,0.15)',
        }}
      />

      {showModal && ReactDOM.createPortal(
        <div
          className="fixed inset-0 z-[999] flex items-center justify-center px-4"
          onClick={() => setShowModal(false)}
        >
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
          <div
            className="relative z-10 w-full max-w-2xl rounded-2xl p-5 md:p-6"
            style={{
              background: 'linear-gradient(135deg, rgba(15,23,42,0.95), rgba(0,0,0,0.9))',
              border: '1px solid rgba(255,255,255,0.12)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
              boxShadow: '0 24px 60px rgba(0,0,0,0.5)',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="text-xs font-black uppercase tracking-wider text-white/90">Dashboard Overview</p>
              <button
                onClick={() => setShowModal(false)}
                className="w-7 h-7 flex items-center justify-center rounded-full text-white/60 hover:text-white hover:bg-white/10 transition-colors text-sm"
              >
                ×
              </button>
            </div>

            <p className="text-[11px] text-white/70 leading-relaxed mb-4">
              This panel gives you a real-time overview of your pilot licenses and credentials.
              You can see what is currently valid, what is under review, and if anything has been flagged or expired.
            </p>

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
        </div>,
        document.body,
      )}
    </>
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

  const [showLogbookModal, setShowLogbookModal] = React.useState(false);
  const [selectedProvider, setSelectedProvider] = React.useState<string | null>(null);
  const [expandedCats, setExpandedCats] = React.useState<Record<string, boolean>>({});
  const [tooltip, setTooltip] = React.useState<{ title: string; items: any[]; x: number; y: number; w: number } | null>(null);
  const catRefs = React.useRef<Record<string, HTMLDivElement | null>>({});

  const logbookConnected = !!profile?.logbook_sync_valid;

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
      <motion.div variants={itemVariants} className="relative overflow-hidden rounded-2xl px-6 pt-3 pb-9 pr-8 md:pr-10" style={{ background: '#ffffff', border: '1px solid rgba(0,0,0,0.08)' }}>
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
              <div className="flex items-center gap-3">
                <a
                  href={`https://checkout.dodopayments.com/buy/pdt_0NhgDLaiGjWD45S1gJmng?return_url=${encodeURIComponent(returnUrl)}&cancel_url=${encodeURIComponent(cancelUrl)}`}
                  className="inline-flex px-5 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 items-center gap-2 no-underline w-fit"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)', boxShadow: '0 4px 20px rgba(220,38,38,0.35)' }}
                >
                  GET RECOGNITION+ <ArrowRight size={14} />
                </a>
                <button
                  type="button"
                  onClick={() => onNavigate('/get-started')}
                  className="text-[11px] font-bold text-gray-500 hover:text-gray-800 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-600 transition-colors"
                >
                  Skip to get started →
                </button>
              </div>
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
              onClick={() => setTab('profile')}
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
              Edit Public Profile
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
          {isFreeUser ? (
            /* ─── FREE USER: clean list, no status column ─── */
            <div className="space-y-2">
              {[
                { label: 'Pilot License', value: profile?.license_type },
                { label: 'Medical Class', value: profile?.medical_class },
                { label: 'ICAO ELP', value: profile?.elp_level },
                { label: 'Radio License', value: profile?.other_licence },
              ].map(({ label, value }) => (
                <div
                  key={label}
                  className="flex items-center justify-between px-4 py-3 rounded-xl"
                  style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}
                >
                  <span className="text-[11px] font-bold text-white/70 leading-tight">{label}</span>
                  <span className={`text-[11px] font-bold leading-tight ${value ? 'text-emerald-400' : 'text-white/25'}`}>
                    {value || 'Not provided'}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* ─── RECOGNITION+ MEMBER: full status UI ─── */
            (() => {
              const now = Date.now();
              const findCredential = (type: string) => credentials.find(c => String(c?.credential_type || '').toLowerCase() === type);
              const licenseCred = findCredential('license');
              const medicalCred = findCredential('medical');
              const elpCred = findCredential('english_proficiency') || findCredential('elp');
              const radioCred = findCredential('radio_license');

              const statusBadge = (cred: any) => {
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
                    const badge = statusBadge(cred);
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
            })()
          )}
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

      {/* Recency & Currency Tracker moved to Licensure & Currency tab */}


      {/* Digital Dashboard — cockpit 6-pack style */}
      <CockpitFlightHoursDashboard
        userId={profile?.id as string | undefined}
        profile={profile as Record<string, unknown> | undefined}
        isFreeUser={isFreeUser}
        logbookConnected={logbookConnected}
        onCompleteProfile={() => setTab('advanced-profile')}
        onConnectLogbook={() => setShowLogbookModal(true)}
      />

      {/* Shortcut to Logbook tab */}
      <button
        onClick={() => setTab('logbook')}
        className="w-full flex items-center justify-center gap-2.5 px-6 py-[18px] text-[10px] font-black tracking-wider uppercase text-white/50 transition-all hover:bg-white/5 leading-none"
        style={{ background: 'rgba(0,0,0,0.55)', border: '1px solid rgba(255,255,255,0.08)' }}
      >
        <BookOpen size={16} className="text-white/40 block" />
        <span className="leading-none">GO TO LOGBOOK →</span>
      </button>

      {/* Logbook Provider Modal */}
      {showLogbookModal && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center px-4" onClick={() => setShowLogbookModal(false)}>
          <motion.div
            className="absolute inset-0 bg-black/70 backdrop-blur-xl"
            style={{ backdropFilter: 'blur(28px)', WebkitBackdropFilter: 'blur(28px)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.25 }}
          />
          <motion.div
            className="relative z-10 w-full max-w-lg border rounded-2xl p-6 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            style={{
              background: 'linear-gradient(160deg, rgba(20,20,28,0.92) 0%, rgba(12,12,18,0.96) 100%)',
              borderColor: 'rgba(220,38,38,0.25)',
              boxShadow: '0 0 0 1px rgba(220,38,38,0.08), 0 32px 64px -12px rgba(0,0,0,0.5), 0 0 40px -10px rgba(220,38,38,0.15)',
              backdropFilter: 'blur(20px)',
              WebkitBackdropFilter: 'blur(20px)',
            }}
          >
            {/* Ambient glow top */}
            <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-40 h-40 rounded-full opacity-30 pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(220,38,38,0.4) 0%, transparent 70%)', filter: 'blur(30px)' }} />

            {/* Header */}
            <div className="relative flex items-center justify-between mb-6">
              <div>
                <h3 className="text-white font-black text-base tracking-tight">Connect Logbook</h3>
                <p className="text-white/35 text-xs mt-0.5">Select your digital logbook provider</p>
              </div>
              <button
                onClick={() => setShowLogbookModal(false)}
                className="w-8 h-8 flex items-center justify-center rounded-full transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}
                onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(220,38,38,0.15)'; e.currentTarget.style.borderColor = 'rgba(220,38,38,0.35)'; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.08)'; }}
              >
                <svg width="14" height="14" viewBox="0 0 14 14" fill="none"><path d="M1 1l12 12M13 1L1 13" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round"/></svg>
              </button>
            </div>

            {/* Provider list */}
            <div className="space-y-2.5 mb-5">
              {[
                { id: 'myflightbook', name: 'MyFlightBook', region: 'Global', logo: '📘', logoImg: 'https://myflightbook.com/logbook/Images/mfblogonew.png', badge: 'Free', status: 'available', method: 'OAuth 2.0', methodColor: '#38bdf8' },
                { id: 'foreflight', name: 'ForeFlight', region: 'Global', logo: '✈️', status: 'coming_soon', method: 'API', methodColor: '#a78bfa' },
                { id: 'garmin', name: 'Garmin Pilot', region: 'Global', logo: '📍', status: 'coming_soon', method: 'API', methodColor: '#fb923c' },
                { id: 'logten', name: 'LogTen Pro', region: 'Global', logo: '📓', status: 'coming_soon', method: 'CSV', methodColor: '#4ade80' },
              ].map((p) => (
                <button
                  key={p.id}
                  disabled={p.status === 'coming_soon'}
                  onClick={() => {
                    if (p.id === 'myflightbook') {
                      const redirectUri = 'https://pilotrecognition.com/auth/logbook/callback';
                      const clientId = (import.meta as any).env?.VITE_MFB_CLIENT_ID || 'PilotRecognition';
                      const url = `https://myflightbook.com/logbook/mvc/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=totals`;
                      safeRedirect(url);
                    } else {
                      setSelectedProvider(p.name);
                    }
                  }}
                  className="group relative flex items-center gap-3.5 px-4 py-3.5 rounded-xl border transition-all text-left w-full cursor-pointer"
                  style={{
                    background: selectedProvider === p.name
                      ? 'rgba(220,38,38,0.08)'
                      : p.status === 'coming_soon'
                      ? 'rgba(255,255,255,0.02)'
                      : 'rgba(255,255,255,0.04)',
                    borderColor: selectedProvider === p.name
                      ? 'rgba(220,38,38,0.45)'
                      : 'rgba(255,255,255,0.06)',
                    boxShadow: selectedProvider === p.name ? '0 0 20px -8px rgba(220,38,38,0.35), inset 0 1px 0 rgba(255,255,255,0.04)' : 'none',
                    opacity: p.status === 'coming_soon' ? 0.5 : 1,
                    cursor: p.status === 'coming_soon' ? 'not-allowed' : 'pointer',
                  }}
                  onMouseEnter={(e) => {
                    if (p.status !== 'coming_soon' && selectedProvider !== p.name) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedProvider !== p.name) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.06)';
                    }
                  }}
                >
                  <span className="flex-shrink-0 w-11 h-11 flex items-center justify-center rounded-lg" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)' }}>
                    {p.logoImg ? <img src={p.logoImg} alt={p.name} className="w-8 h-8 object-contain" /> : <span className="text-lg">{p.logo}</span>}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className={`text-sm font-bold leading-tight ${selectedProvider === p.name ? 'text-white' : 'text-white/80'}`}>{p.name}</span>
                      {p.badge && (
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-full" style={{ background: 'rgba(34,197,94,0.12)', color: '#4ade80', border: '1px solid rgba(34,197,94,0.2)' }}>{p.badge}</span>
                      )}
                    </div>
                    <span className={`text-[11px] ${selectedProvider === p.name ? 'text-white/50' : 'text-white/35'}`}>
                      {p.region}{p.id === 'myflightbook' ? ' · Default' : ''}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className="text-[10px] font-semibold" style={{ color: p.methodColor }}>{p.method}</span>
                    {selectedProvider === p.name && (
                      <div className="w-5 h-5 rounded-full flex items-center justify-center" style={{ background: '#dc2626' }}>
                        <svg width="12" height="12" viewBox="0 0 12 12" fill="none"><path d="M2.5 6L5 8.5L9.5 4" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                      </div>
                    )}
                  </div>
                  {p.status === 'coming_soon' && (
                    <div className="absolute inset-0 rounded-xl flex items-center justify-center pointer-events-none" style={{ background: 'rgba(12,12,18,0.35)', backdropFilter: 'blur(1px)' }}>
                      <span className="text-[10px] font-bold tracking-wider uppercase px-3 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.4)', border: '1px solid rgba(255,255,255,0.1)' }}>Coming Soon</span>
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
                  const clientId = (import.meta as any).env?.VITE_MFB_CLIENT_ID || 'PilotRecognition';
                  const url = `https://myflightbook.com/logbook/mvc/oauth/authorize?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=totals`;
                  safeRedirect(url);
                } else {
                  setShowLogbookModal(false);
                }
              }}
              disabled={!selectedProvider}
              className="w-full py-3 text-white font-black rounded-xl transition-all text-sm tracking-wide"
              style={{
                background: selectedProvider ? 'linear-gradient(135deg, #dc2626, #b91c1c)' : 'rgba(255,255,255,0.06)',
                border: `1px solid ${selectedProvider ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.08)'}`,
                boxShadow: selectedProvider ? '0 8px 24px -6px rgba(220,38,38,0.4), inset 0 1px 0 rgba(255,255,255,0.1)' : 'none',
                cursor: selectedProvider ? 'pointer' : 'not-allowed',
                opacity: selectedProvider ? 1 : 0.35,
              }}
            >
              {selectedProvider ? `Sync with ${selectedProvider}` : 'Select a provider'}
            </button>

            <div className="flex flex-wrap gap-x-2.5 gap-y-1 mt-3.5 mb-1 justify-center">
              <span className="text-[9px] font-medium" style={{ color: '#38bdf8' }}>● OAuth 2.0</span>
              <span className="text-[9px] font-medium" style={{ color: '#a78bfa' }}>● API Passkey</span>
              <span className="text-[9px] font-medium" style={{ color: '#4ade80' }}>● Direct API</span>
              <span className="text-[9px] font-medium" style={{ color: '#fb923c' }}>● CSV Import</span>
            </div>
            <p className="text-[10px] text-center leading-relaxed mt-1" style={{ color: 'rgba(255,255,255,0.25)' }}>
              Read-only access only. We never modify your logbook data.
            </p>
          </motion.div>
        </div>,
        document.body
      )}

      {/* Recognition+ CTA */}
      <motion.div
        variants={itemVariants}
        className="rounded-2xl p-6"
        style={{
          background: 'linear-gradient(135deg, rgba(220,38,38,0.22) 0%, rgba(15,23,42,0.95) 100%)',
          border: '1px solid rgba(220,38,38,0.25)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)' }}>
              <Sparkles size={18} className="text-red-400 block" />
            </div>
            <div>
              <p className="text-[10px] font-black tracking-wider uppercase text-red-400 mb-1">Recognition+</p>
              <p className="text-sm font-black text-white">Unlock Your Full Career Potential</p>
            </div>
          </div>

          <ul className="space-y-2">
            {[
              'Access Recognition AI',
              'Track Pathways',
              'Check Recurrencies',
              'Align your profile with manufacturer expectations and requirements',
              'Find out what you\'re missing in your aviation career profile',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2 text-xs text-white/70">
                <span className="text-red-400 mt-0.5 flex-shrink-0">●</span>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setTab('recognition-plus')}
            className="w-full py-3 rounded-xl text-xs font-black tracking-wider text-red-600 transition-all hover:brightness-105"
            style={{ background: '#ffffff', border: '1px solid rgba(220,38,38,0.3)' }}
          >
            GET RECOGNITION+ →
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};
