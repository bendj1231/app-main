import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { useSearchParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';
import {
  User, Shield, Map, Settings, LogOut, Bell, MessageSquare, Menu, ChevronRight
} from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useVaultProfile } from '@/src/hooks/useVaultProfile';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import { supabase } from '@/shared/lib/supabase';
import ProfileImage from '../../../src/components/ProfileImage';
import { PasskeyPrompt, useShouldShowPasskeyPrompt } from './PasskeyPrompt';
import { CareerIntelligenceDashboard } from './CareerIntelligenceDashboard';
import { DataProvenancePage } from '../pages/DataProvenancePage';
import { LogbookHub } from './pilot-recognition/LogbookHub';
import { WalletPageWithSidebar } from './wallet/WalletPageWithSidebar';

import { NAV_ITEMS, EmailVerifyGate, NotificationsFeedPanel } from './unified-platform/shared';
import type { TabId, UnifiedPilotPlatformProps } from './unified-platform/types';

import { HomeTab } from './unified-platform/tabs/HomeTab';
import { ProfileTab } from './unified-platform/tabs/ProfileTab';
import { PathwaysTab } from './unified-platform/tabs/PathwaysTab';
import { ProgramsTab } from './unified-platform/tabs/ProgramsTab';
import { DashboardTab } from './unified-platform/tabs/DashboardTab';
import { AirlinesTab } from './unified-platform/tabs/AirlinesTab';
import { ManufacturersTab } from './unified-platform/tabs/ManufacturersTab';
import { AtlasCVTab } from './unified-platform/tabs/AtlasCVTab';
import { EventsTab } from './unified-platform/tabs/EventsTab';
import { NewsroomTab } from './unified-platform/tabs/NewsroomTab';
import { SettingsTab } from './unified-platform/tabs/SettingsTab';
import { ScoreTab } from './unified-platform/tabs/ScoreTab';
import { CockpitTab } from './unified-platform/tabs/CockpitTab';

// ─── MAIN SHELL ────────────────────────────────────────────────────────────
export const UnifiedPilotPlatform: React.FC<UnifiedPilotPlatformProps> = ({ onNavigate }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { user: auth0User, getAccessTokenSilently, getIdTokenClaims, logout: auth0Logout } = useAuth0();
  const { readProfile } = useVaultProfile();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);
  const [searchParams, setSearchParams] = useSearchParams();
  const [activeTab, setActiveTab] = useState<TabId>(() => (searchParams.get('tab') as TabId) ?? 'home');
  const [walletChecks, setWalletChecks] = useState<any[]>([]);
  const [airlines, setAirlines] = useState<any[]>([]);
  const [notifCount, setNotifCount] = useState(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [profileData, setProfileData] = useState<any>(userProfile);
  const sessionInitiatedRef = useRef<string | false>(false);
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [avatarError, setAvatarError] = useState('');
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !profileData?.id) {
      console.warn('[avatar] aborted — no file or no profileData.id', { file: !!file, profileId: profileData?.id });
      return;
    }
    if (!file.type.startsWith('image/')) { setAvatarError('Must be an image file'); return; }
    if (file.size > 5 * 1024 * 1024) { setAvatarError('Image must be under 5MB'); return; }
    setAvatarUploading(true);
    setAvatarError('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      let accessToken: string | null = (session as any)?.access_token ?? null;

      // Auth0-only users have no Supabase session — use Auth0 access token instead
      if (!accessToken) {
        try {
          accessToken = await getAccessTokenSilently();
        } catch (err) {
          console.warn('[avatar] getAccessTokenSilently failed:', err);
        }
      }
      if (!accessToken) throw new Error('Not authenticated — no Supabase or Auth0 token available');

      // Delete old image from Cloudinary first (non-blocking if it fails)
      const oldPublicId = profileData?.profile_image_public_id;
      if (oldPublicId) {
        const delRes = await supabase.functions.invoke('cloudinary-delete', {
          body: { publicId: oldPublicId, type: 'profile' },
        });
      } else {
      }

      const canvas = document.createElement('canvas');
      const imgEl = document.createElement('img') as HTMLImageElement;
      await new Promise<void>((res, rej) => {
        imgEl.onload = () => {
          const max = 400;
          let w = imgEl.width, h = imgEl.height;
          if (w > h && w > max) { h = h * max / w; w = max; }
          else if (h > max) { w = w * max / h; h = max; }
          canvas.width = w; canvas.height = h;
          canvas.getContext('2d')!.drawImage(imgEl, 0, 0, w, h);
          res();
        };
        imgEl.onerror = (err) => { console.error('[avatar] image load error:', err); rej(err); };
        imgEl.src = URL.createObjectURL(file);
      });
      const base64 = canvas.toDataURL('image/jpeg', 0.8);
      const uploadRes = await fetch(`${(import.meta as any).env?.VITE_SUPABASE_URL as string}/functions/v1/cloudinary-upload`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${accessToken}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ file: base64, userId: profileData.id }),
      });
      const result = await uploadRes.json();
      if (!result.success) throw new Error(result.error || 'Upload failed');
      // Supabase profile update handled server-side in edge fn (service role, bypasses RLS)
      setProfileData((prev: any) => ({ ...prev, profile_image_url: result.url, profile_image_public_id: result.publicId }));
    } catch (err: any) {
      console.error('[avatar] upload error:', err);
      setAvatarError(err.message || 'Upload failed');
    } finally {
      setAvatarUploading(false);
      if (avatarInputRef.current) avatarInputRef.current.value = '';
    }
  };
  const { callApi, callBatch } = useWorkerAuth();
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const [resendingSent, setResendingSent] = useState(false);
  const [tcUpdatePending, setTcUpdatePending] = useState(false);

  // Check email verification status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        setEmailVerified(!!session.user.email_confirmed_at);
      }
    });
  }, []);

  // Check if T&C version has been updated since user last accepted
  useEffect(() => {
    const CURRENT_TC_VERSION = 'v2-2026';
    if (profileData?.consent_version && profileData.consent_version !== CURRENT_TC_VERSION) {
      setTcUpdatePending(true);
    }
  }, [profileData?.consent_version]);

  // Sync URL with active tab
  useEffect(() => {
    setSearchParams({ tab: activeTab }, { replace: true });
  }, [activeTab, setSearchParams]);

  // Sync incoming URL param
  useEffect(() => {
    const t = searchParams.get('tab') as TabId;
    if (t && t !== activeTab) setActiveTab(t);
  }, []); // eslint-disable-line

  // ── IndexedDB cache helper for dashboard batch ──
  const dbName = 'pr-dashboard-cache';
  const storeName = 'batch';
  const dbPromise = React.useMemo(() => {
    return new Promise<IDBDatabase>((resolve, reject) => {
      const req = indexedDB.open(dbName, 1);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => resolve(req.result);
      req.onupgradeneeded = () => {
        req.result.createObjectStore(storeName);
      };
    });
  }, []);

  const cacheBatch = async (key: string, payload: Record<string, unknown>) => {
    const db = await dbPromise;
    const tx = db.transaction(storeName, 'readwrite');
    tx.objectStore(storeName).put({ payload, cachedAt: Date.now() }, key);
  };

  const readCachedBatch = async (key: string): Promise<Record<string, unknown> | null> => {
    try {
      const db = await dbPromise;
      const tx = db.transaction(storeName, 'readonly');
      const record = await new Promise<{ payload: Record<string, unknown>; cachedAt: number } | undefined>((resolve, reject) => {
        const req = tx.objectStore(storeName).get(key);
        req.onsuccess = () => resolve(req.result as any);
        req.onerror = () => reject(req.error);
      });
      return record?.payload ?? null;
    } catch {
      return null;
    }
  };

  const clearDashboardCache = async () => {
    try {
      const db = await dbPromise;
      const tx = db.transaction(storeName, 'readwrite');
      tx.objectStore(storeName).clear();
    } catch {
      /* no-op */
    }
  };

  const [dataWarnings, setDataWarnings] = useState<string[]>([]);
  const [isRefreshing, setIsRefreshing] = useState(false);

  // ── Local stale-data scanner (zero API calls) ──
  const scanCachedData = async (): Promise<string[]> => {
    const warnings: string[] = [];
    const cached = await readCachedBatch(`dashboard:${profileData?.id}`);
    if (!cached) return warnings;

    const now = Date.now();
    const DAY = 86400000;

    const profile = profileData as Record<string, unknown> | null;
    const licensure = cached.result_0 as Record<string, unknown> | null;
    const receipts = cached.result_1 as Array<Record<string, unknown>> | null;
    const verifStatus = cached.result_3 as Record<string, unknown> | null;

    // ── 1. Role check ──
    if (!profile?.role || profile.role === 'undefined' || profile.role === '') {
      warnings.push('Role not assigned — complete onboarding');
    }

    // ── 2. Individual license validity from verification receipts ──
    // Required credentials: pilot license, medical, ELP, radio
    const requiredTypes = ['license', 'medical', 'elp', 'radio'];
    const foundTypes = new Set<string>();

    if (receipts) {
      for (const r of receipts) {
        const type = (r.credential_type as string)?.toLowerCase();
        const status = (r.status as string)?.toLowerCase();
        const expiresAt = r.expires_at ? new Date(r.expires_at as string).getTime() : null;
        const nearExpiry = r.near_expiry as boolean;

        foundTypes.add(type);

        if (status === 'expired') {
          warnings.push(`${type} expired — re-verification required`);
        } else if (nearExpiry && expiresAt && expiresAt > now) {
          const daysLeft = Math.ceil((expiresAt - now) / DAY);
          warnings.push(`${type} expires in ${daysLeft} day${daysLeft > 1 ? 's' : ''}`);
        } else if (status !== 'verified' && status !== 'valid') {
          warnings.push(`${type} status: ${status}`);
        }
      }
    }

    for (const req of requiredTypes) {
      if (!foundTypes.has(req)) {
        warnings.push(`${req} not verified — add to wallet`);
      }
    }

    // ── 3. CAAP Currency: 90-day rule ──
    // Must have 3 takeoffs/landings in same category/class/type within 90 days
    const lastFlown = profile?.last_flown as string | undefined;
    if (lastFlown) {
      const daysSinceLastFlown = Math.floor((now - new Date(lastFlown).getTime()) / DAY);
      if (daysSinceLastFlown > 90) {
        warnings.push(`Currency expired — last flown ${daysSinceLastFlown} days ago (CAAP: 90 days)`);
      } else if (daysSinceLastFlown > 75) {
        warnings.push(`Currency warning — last flown ${daysSinceLastFlown} days ago (expires at 90)`);
      }
    } else {
      warnings.push('Last flown date missing — log flight to check currency');
    }

    // ── 4. Verified vs claimed hours ──
    // Pilots fly daily — gap between verified (snapshot) and claimed (live) is NORMAL
    const claimedHours = (profile?.total_flight_hours as number) ?? 0;
    const verifiedHours = (licensure?.verified_total_hours as number) ?? 0;
    const lastVerifiedAt = licensure?.hours_verified_at ? new Date(licensure.hours_verified_at as string).getTime() : null;
    const unverifiedHours = Math.max(0, claimedHours - verifiedHours);

    if (claimedHours > 0 && verifiedHours === 0) {
      warnings.push(`${claimedHours} hours claimed but never verified — submit logbook`);
    } else if (unverifiedHours > 200) {
      // Flag if >200 unverified hours accumulated (roughly 2-3 months of flying)
      warnings.push(`${unverifiedHours} unverified hours since last check — re-verify logbook`);
    } else if (lastVerifiedAt && (now - lastVerifiedAt) / DAY > 180 && unverifiedHours > 50) {
      // If last verification was >6 months ago and they logged >50h since
      warnings.push(`Logbook stale — last verified ${Math.floor((now - lastVerifiedAt) / DAY)} days ago`);
    }

    // ── 5. License type consistency ──
    const licenseType = licensure?.license_type as string | undefined;
    const currentOccupation = profile?.current_occupation as string | undefined;
    if (licenseType && currentOccupation) {
      const occLower = currentOccupation.toLowerCase();
      const licLower = licenseType.toLowerCase();
      if (occLower.includes('commercial') && !licLower.includes('cpl') && !licLower.includes('atpl')) {
        warnings.push('Occupation claims commercial but license does not match');
      }
      if (occLower.includes('airline') && !licLower.includes('atpl')) {
        warnings.push('Occupation claims airline but no ATPL');
      }
    }

    // ── 6. Overall verification status ──
    if (verifStatus?.overall_status === 'pending') {
      warnings.push('Verification still pending');
    }
    if (verifStatus?.overall_status === 'unverified') {
      warnings.push('Profile unverified — start verification');
    }

    return warnings;
  };

  // ── Manual refresh: bust cache and re-fetch ──
  const refreshDashboard = async () => {
    setIsRefreshing(true);
    try {
      await clearDashboardCache();
      const profileId = profileData?.id;
      if (!profileId) return;

      const batch = await callBatch([
        { action: 'getLicensure', params: { user_id: profileId } },
        { action: 'getVerificationReceipts', params: { user_id: profileId } },
        { action: 'queryTable', params: { table: 'pilot_notifications', operation: 'count', where: { pilot_id: profileId, is_read: false } } },
        { action: 'getVerificationStatus', params: { user_id: profileId } },
      ]);

      await cacheBatch(`dashboard:${profileId}`, batch);

      const licensure = batch.result_0 as Record<string, unknown> | null;
      const receipts = batch.result_1 as Array<Record<string, unknown>> | null;
      const notifCountRaw = batch.result_2 as { count: number } | null;
      const verifStatus = batch.result_3 as Record<string, unknown> | null;

      if (licensure) setProfileData((prev: Record<string, unknown>) => ({ ...prev, ...licensure }));
      if (receipts) setWalletChecks(receipts);
      setNotifCount(notifCountRaw?.count ?? 0);
      if (verifStatus) setProfileData((prev: Record<string, unknown>) => ({ ...prev, verification_status: verifStatus }));

      const freshWarnings = await scanCachedData();
      setDataWarnings(freshWarnings);
    } catch (err) {
      console.error('[dashboard] manual refresh failed:', err);
    } finally {
      setIsRefreshing(false);
    }
  };

  // Unified dashboard load — one request per browser session, cached in IndexedDB
  useEffect(() => {
    const auth0Id = auth0User?.sub;
    // Skip if no auth0Id yet or if we already loaded for this exact user
    if (!auth0Id || sessionInitiatedRef.current === auth0Id) return;
    sessionInitiatedRef.current = auth0Id;

    const loadDashboard = async () => {
      try {
        const email = auth0User?.email;
        console.log('[UnifiedPilotPlatform] loadDashboard() called, auth0Id:', auth0Id, 'email:', email);

        // Check IndexedDB cache first (survives browser restarts)
        const cacheKey = `dashboard:${auth0Id}`;
        const cached = await readCachedBatch(cacheKey);
        if (cached) {
          try {
            const now = Date.now();
            const cachedAt = (cached as any).cachedAt || 0;
            const ageHours = (now - cachedAt) / (1000 * 60 * 60);
            if (ageHours < 24) {
              const payload = (cached as any).payload || cached;
              setProfileData(payload.profileData || null);
              setWalletChecks(payload.walletChecks || []);
              setNotifCount(payload.notifCount || 0);
              console.log('[dashboard] loaded from IndexedDB cache');
              return;
            }
          } catch { /* invalid cache, fetch fresh */ }
        }

        // Fetch fresh from Worker
        console.log('[UnifiedPilotPlatform] Calling getDashboardData with auth0_id:', auth0Id, 'email:', email);
        const data = await callApi('getDashboardData', { auth0_id: auth0Id, email }) as Record<string, unknown>;
        console.log('[UnifiedPilotPlatform] getDashboardData response:', { hasProfile: !!data?.profile, keys: Object.keys(data || {}) });
        if (!data?.profile) {
          console.warn('[dashboard] no profile found for auth0_id:', auth0Id, 'data:', data);
          return;
        }
        const profile = data.profile as Record<string, unknown>;
        const flightHours = data.flight_hours as Record<string, unknown> | null;
        const receipts = data.verification_receipts as Array<Record<string, unknown>> | null;

        const profileDataState = { ...profile, ...flightHours };
        setProfileData(profileDataState);
        if (receipts) setWalletChecks(receipts);
        setNotifCount(0);

        // Cache in IndexedDB (persists across browser sessions)
        await cacheBatch(cacheKey, {
          profileData: profileDataState,
          walletChecks: receipts || [],
          notifCount: 0,
          cachedAt: Date.now(),
        });
        console.log('[dashboard] fetched from Worker and cached in IndexedDB');
      } catch (err) {
        console.error('[dashboard] unified load failed:', err);
      }
    };

    loadDashboard();
  }, [auth0User?.sub, callApi]);

  // AuthContext userProfile seed — only used if passed from login flow
  useEffect(() => {
    if (userProfile && !profileData?.id) {
      setProfileData(userProfile);
    }
  }, [userProfile]);

  const handleLogout = useCallback(async () => {
    await clearDashboardCache();
    await logout();
    onNavigate('home');
  }, [logout, onNavigate]);

  const prevTabRef = useRef<TabId>('home');
  const setTab = (t: TabId) => {
    prevTabRef.current = activeTab;
    setActiveTab(t);
  };

  // Listen for tab-switch events fired from embedded child components (e.g. profile page wallet CTA)
  useEffect(() => {
    const handler = (e: Event) => {
      const tab = (e as CustomEvent<string>).detail as TabId;
      if (tab) setTab(tab);
    };
    window.addEventListener('switch-platform-tab', handler);
    return () => window.removeEventListener('switch-platform-tab', handler);
  }, []);

  const isCiphertext = (v: any) => typeof v === 'string' && v.trim().startsWith('{"iv"');
  const rawDisplayName = profileData?.display_name || profileData?.full_name;
  const displayName = (rawDisplayName && !isCiphertext(rawDisplayName)) ? rawDisplayName : (auth0User?.nickname || auth0User?.name || auth0User?.email?.split('@')[0] || currentUser?.email?.split('@')[0] || 'Pilot');
  const initials = displayName.charAt(0).toUpperCase();

  const renderContent = () => {
    switch (activeTab) {
      case 'home':          return <HomeTab profile={profileData} walletChecks={walletChecks} onNavigate={onNavigate} setTab={setTab} enrolledInFoundation={false} airlines={airlines} auth0User={auth0User} currentUser={currentUser} avatarInputRef={avatarInputRef} avatarUploading={avatarUploading} avatarError={avatarError} handleAvatarUpload={handleAvatarUpload} />;
      case 'profile':       return <ProfileTab onNavigate={onNavigate} profile={profileData} walletChecks={walletChecks} />;
      case 'score':         return <ScoreTab profile={profileData} setTab={setTab} />;
      case 'cockpit':       return <CockpitTab profile={profileData} onNavigate={onNavigate} />;
      case 'wallet':        return !emailVerified ? <EmailVerifyGate onResend={async () => { setResendingSent(true); await supabase.auth.resend({ type: 'signup', email: currentUser?.email ?? '' }); }} sent={resendingSent} /> : <WalletPageWithSidebar userId={currentUser?.id || auth0User?.sub} onNavigate={(path) => setTab(path as TabId)} />;
      case 'pathways':      return <PathwaysTab onNavigate={onNavigate} />;
      case 'programs':      return <ProgramsTab onNavigate={onNavigate} />;
      case 'dashboard':     return <DashboardTab profile={profileData} onNavigate={onNavigate} />;
      case 'market-intel':    return <CareerIntelligenceDashboard profile={profileData} />;
      case 'data-provenance': return <DataProvenancePage onNavigate={onNavigate} />;
      case 'airlines':      return <AirlinesTab onNavigate={onNavigate} />;
      case 'manufacturers': return <ManufacturersTab onNavigate={onNavigate} />;
      case 'atlas-cv':      return <AtlasCVTab profile={profileData} onNavigate={onNavigate} />;
      case 'logbook':       return <LogbookHub profile={profileData} onNavigate={onNavigate} />;
      case 'events':        return <EventsTab />;
      case 'newsroom':      return <NewsroomTab onNavigate={onNavigate} />;
      case 'settings':      return <SettingsTab onLogout={handleLogout} getToken={async () => { try { const claims = await getIdTokenClaims(); const t = claims?.__raw; if (t) return t; throw new Error('no id token'); } catch { const { data: { session } } = await supabase.auth.getSession(); const t = session?.access_token; if (!t) throw new Error('No auth token available — please log out and back in'); return t; } }} profileId={profileData?.id ?? null} onAuth0Logout={() => { localStorage.clear(); sessionStorage.clear(); auth0Logout({ logoutParams: { returnTo: window.location.origin } }); }} />;
      default:              return null;
    }
  };

  const activeNavItem = NAV_ITEMS.find(n => n.id === activeTab);
  const [passkeyPromptDismissed, setPasskeyPromptDismissed] = React.useState(false);
  const shouldShowPasskeyPrompt = useShouldShowPasskeyPrompt();
  const showPasskeyPrompt = shouldShowPasskeyPrompt && !passkeyPromptDismissed && !!(auth0User?.sub || currentUser?.id);

  useEffect(() => {
    const close = () => { setBellOpen(false); setProfileDropOpen(false); setHamburgerOpen(false); };
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);

  return (
    <div className="relative min-h-screen flex flex-col font-sans">

      {/* ── BACKGROUND: Portal 2 MeshGradient ── */}
      <div className="fixed inset-0 z-0">
        {graphicsConfig.enableMeshGradient ? (
          <MeshGradient
            className="w-full h-full"
            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
            speed={graphicsConfig.meshGradientSpeed}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* ── TOP NAV BAR ── */}
      <div
        className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
        style={{ background: 'transparent', height: '68px' }}
      >
        {/* Left — wordmark */}
        <div className="flex items-center min-w-0 flex-1">
          <span
            className="text-2xl tracking-tight leading-none cursor-pointer"
            style={{ fontFamily: 'Arial Black, Helvetica Neue, sans-serif' }}
            onClick={() => onNavigate('home')}
          >
            <span className="text-white">pilot</span>
            <span className="text-red-500">recognition</span>
            <span className="text-white">.com</span>
          </span>
        </div>

        {/* Centre — primary nav links */}
        <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
          {[
            { id: 'home',     label: 'Home' },
            { id: 'profile',  label: 'Profile' },
            { id: 'pathways', label: 'Pathways' },
            { id: 'programs', label: 'Programs' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setTab(id as TabId)}
              className={`px-5 py-2 rounded-lg text-sm font-bold tracking-wide transition-all ${
                activeTab === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right — MSFS-style square tile icon toolbar */}
        <div className="flex items-center gap-2 flex-shrink-0">
          {currentUser ? (
            <>
              <div className="flex items-center gap-2">
                {/* Messages tile */}
                <button
                  onClick={() => setTab('notifications' as TabId)}
                  title="Messages"
                  className="relative group transition-all duration-150"
                  style={{
                    width: 44, height: 44,
                    background: 'rgba(55,65,81,0.85)',
                    border: '2px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}
                >
                  <MessageSquare size={20} className="text-white" strokeWidth={2} />
                </button>

                {/* Notification bell tile */}
                <div className="relative" onMouseDown={e => e.stopPropagation()}>
                  <button
                    title="Notifications"
                    onClick={() => { setBellOpen(v => !v); setProfileDropOpen(false); setHamburgerOpen(false); }}
                    className="relative transition-all duration-150"
                    style={{
                      width: 44, height: 44,
                      background: bellOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                      border: bellOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={e => { if (!bellOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                    onMouseLeave={e => { if (!bellOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
                  >
                    <Bell size={20} className="text-white" strokeWidth={2} />
                    {(notifCount > 0 || tcUpdatePending || !emailVerified) && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: '#f59e0b', border: '1.5px solid rgba(15,22,35,0.9)' }}>
                        {notifCount > 0 ? (notifCount > 9 ? '9+' : notifCount) : '!'}
                      </span>
                    )}
                  </button>
                  {bellOpen && (
                    <div className="absolute right-0 top-12 w-80 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                      <div className="px-4 pt-3 pb-2 border-b border-white/5">
                        <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
                        <p className="text-sm font-black text-white">Notifications</p>
                      </div>
                      <NotificationsFeedPanel profileId={profileData?.id} />
                      <button onClick={() => { setBellOpen(false); setTab('notifications' as TabId); }} className="w-full px-4 py-2.5 text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 border-t border-white/5 text-center transition-colors">
                        VIEW ALL NOTIFICATIONS →
                      </button>
                    </div>
                  )}
                </div>

                {/* Settings tile */}
                <button
                  onClick={() => setTab('settings')}
                  title="Settings"
                  className="transition-all duration-150"
                  style={{
                    width: 44, height: 44,
                    background: activeTab === 'settings' ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                    border: activeTab === 'settings' ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  onMouseEnter={e => { if (activeTab !== 'settings') { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                  onMouseLeave={e => { if (activeTab !== 'settings') { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
                >
                  <Settings size={20} className="text-white" strokeWidth={2} />
                </button>

                {/* Avatar tile + dropdown */}
                <div className="relative" onMouseDown={e => e.stopPropagation()}>
                  <button
                    onClick={() => { setProfileDropOpen(v => !v); setBellOpen(false); setHamburgerOpen(false); }}
                    className="transition-all duration-150 flex items-center gap-2 px-2"
                    style={{
                      height: 44,
                      background: profileDropOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                      border: profileDropOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                      borderRadius: 10,
                    }}
                    onMouseEnter={e => { if (!profileDropOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                    onMouseLeave={e => { if (!profileDropOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
                  >
                    <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
                      <ProfileImage
                        url={profileData?.profile_image_url}
                        publicId={profileData?.profile_image_public_id}
                        name={displayName}
                        size={28}
                        className="w-full h-full"
                        fallbackClassName="rounded-full text-[10px]"
                      />
                    </div>
                    <span className="hidden sm:block text-xs font-bold text-white truncate max-w-[72px]">{displayName.split(' ')[0]}</span>
                  </button>
                  {profileDropOpen && (
                    <div className="absolute right-0 top-10 w-64 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                      <div className="px-4 pt-3 pb-2 border-b border-white/5">
                        <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Account</p>
                        <p className="text-sm font-black text-white truncate">{displayName}</p>
                        <p className="text-[10px] text-white/40 truncate">{profileData?.email ?? auth0User?.email}</p>
                      </div>
                      <div className="py-1">
                        {[
                          { label: 'Edit Profile', tab: 'profile' as TabId, icon: User },
                          { label: 'My Vault', tab: 'wallet' as TabId, icon: Shield },
                          { label: 'Pathways', tab: 'pathways' as TabId, icon: Map },
                          { label: 'Settings', tab: 'settings' as TabId, icon: Settings },
                        ].map(({ label, tab, icon: Icon }) => (
                          <button key={tab} onClick={() => { setTab(tab); setProfileDropOpen(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors group">
                            <div className="flex items-center gap-3">
                              <Icon size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
                              <span className="text-[11px] font-black text-white/70 group-hover:text-white tracking-wide transition-colors">{label.toUpperCase()}</span>
                            </div>
                            <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                          </button>
                        ))}
                      </div>
                      <div className="border-t border-white/5 py-1">
                        <button onClick={() => { setProfileDropOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                          <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                          <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
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
                onClick={() => { safeRedirect('/become-member'); }}
                className="px-4 py-1.5 text-xs font-bold tracking-wider text-white rounded-lg transition-all"
                style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.5)' }}
              >
                BECOME A MEMBER
              </button>
            </>
          )}
          {/* Hamburger dropdown — always on the far right */}
          <div className="relative" onMouseDown={e => e.stopPropagation()}>
            <button
              onClick={() => { setHamburgerOpen(v => !v); setBellOpen(false); setProfileDropOpen(false); }}
              className="transition-all duration-150"
              style={{
                width: 44, height: 44,
                background: hamburgerOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                border: hamburgerOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                borderRadius: 10,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
              onMouseEnter={e => { if (!hamburgerOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
              onMouseLeave={e => { if (!hamburgerOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
            >
              <Menu size={20} className="text-white" strokeWidth={2} />
            </button>
            {hamburgerOpen && (
              <div className="absolute right-0 top-10 w-56 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                <div className="px-4 pt-3 pb-2 border-b border-white/5">
                  <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Navigation</p>
                </div>
                <div className="py-1">
                  {NAV_ITEMS.map(item => {
                    const Icon = item.icon;
                    return (
                      <button key={item.id} onClick={() => { setTab(item.id); setHamburgerOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                        <Icon size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
                        <span className="text-[11px] font-black text-white/60 group-hover:text-white tracking-wide transition-colors">{item.label.toUpperCase()}</span>
                      </button>
                    );
                  })}
                </div>
                {currentUser && (
                  <div className="border-t border-white/5 py-1">
                    <button onClick={() => { setHamburgerOpen(false); logout(); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                      <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                      <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── MAIN CONTENT (no sidebar) ── */}
      <main className="flex-1 h-screen overflow-y-auto pt-[68px]">
        <div className="max-w-[1400px] mx-auto p-5 lg:p-7 h-full" style={{ position: 'relative' }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeTab}
              className="h-full"
              initial={{ opacity: 0, y: 18, filter: 'blur(8px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -10, filter: 'blur(6px)' }}
              transition={{
                duration: 0.28,
                ease: [0.22, 1, 0.36, 1],
                filter: { duration: 0.22 },
              }}
            >
              {renderContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* ── POST-LOGIN PASSKEY REGISTRATION PROMPT ── */}
      {showPasskeyPrompt && (
        <PasskeyPrompt
          userId={profileData?.id || auth0User?.sub || currentUser?.id || ''}
          userEmail={profileData?.email || auth0User?.email || currentUser?.email || ''}
          onDismiss={() => setPasskeyPromptDismissed(true)}
        />
      )}
    </div>
  );
};

export default UnifiedPilotPlatform;
