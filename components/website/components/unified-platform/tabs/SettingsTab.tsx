import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import {
  Home, User, Shield, Map, BookOpen, Plane, Wrench, FileText,
  BookMarked, Calendar, Newspaper, Settings, LogOut, Bell, Search,
  ChevronRight, ChevronDown, ChevronUp, TrendingUp, Award, Clock,
  AlertTriangle, CheckCircle, XCircle, ArrowRight, Star, Target,
  BarChart3, Building2, Zap, Globe, Menu, X, Filter, Download,
  Upload, Edit3, Camera, ExternalLink, RefreshCw, Lock, Eye,
  Brain, FolderOpen, PlayCircle, GraduationCap, Activity, Image,
  CreditCard, Mail, Server, Database, Cloud, MessageSquare, Users
} from 'lucide-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { SectionCard } from '../shared';
import type { TabId } from '../types';

const PILOT_API_URL = (import.meta.env as any).VITE_PILOT_API_URL || 'https://pilotrecognition-api.benjamintigerbowler.workers.dev';

// ─── TAB: SETTINGS ─────────────────────────────────────────────────────────
export const SettingsTab: React.FC<{ onLogout: () => void; getToken: () => Promise<string>; profileId: string | null; onAuth0Logout?: () => void; profile?: Record<string, unknown> | null }> = ({ onLogout, getToken, profileId, onAuth0Logout, profile }) => {
  const { user } = useAuth0();
  const navigate = useNavigate();
  const { callApi } = useWorkerAuth();
  const [deleteStep, setDeleteStep] = React.useState<null | 'export' | 'confirm'>(null);
  const [deleting, setDeleting] = React.useState(false);
  const [deleteError, setDeleteError] = React.useState('');
  const [loadingExport, setLoadingExport] = React.useState(false);
  const [passkeyPending, setPasskeyPending] = React.useState(false);
  const [exportData, setExportData] = React.useState<{
    vcs: any[]; hourTokens: any[]; resume: any | null;
    program: any | null; interview: any | null;
  }>({ vcs: [], hourTokens: [], resume: null, program: null, interview: null });
  const [downloaded, setDownloaded] = React.useState<Record<string, boolean>>({});

  // Sub-page states
  const [activeSubPage, setActiveSubPage] = React.useState<string | null>(null);
  const [profileImage, setProfileImage] = React.useState<string | null>((profile?.profile_image_url as string) || null);
  const [uploadingPhoto, setUploadingPhoto] = React.useState(false);

  // Toggle states for notification settings
  const [notifSettings, setNotifSettings] = React.useState({
    pathwaysAlerts: true,
    pathwaysEmails: false,
    pathwaysPush: true,
    recognitionAlerts: true,
    recognitionEmails: true,
    recognitionPush: true,
    shortageAlerts: false,
    shortageEmails: false,
    shortagePush: false,
    marketingEmails: false,
  });

  const isPlus = (profile?.subscription_tier as string) === 'plus' || (profile?.subscription_tier as string) === 'enterprise';
  const hasLogbook = !!(profile?.total_flight_hours as number) || (profile?.logbook_provider as string);
  const hasProfilePhoto = !!profileImage;

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingPhoto(true);
    const reader = new FileReader();
    reader.onload = () => { setProfileImage(reader.result as string); setUploadingPhoto(false); };
    reader.readAsDataURL(file);
  };

  const loadExportData = async () => {
    setLoadingExport(true);
    const uid = profileId;
    if (!uid) { setLoadingExport(false); return; }

    const [vcsRes, hoursRes, resumeRes, programRes, interviewRes] = await Promise.all([
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_verification_wallet',
        operation: 'select',
        where: { profile_id: uid },
        limit: 500,
      }),
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'logbook_hour_tokens',
        operation: 'select',
        where: { pilot_id: uid },
        limit: 500,
      }),
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'atlas_resumes',
        operation: 'select',
        where: { user_id: uid },
        limit: 1,
      }),
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'program_progress',
        operation: 'select',
        where: { user_id: uid },
        limit: 500,
      }),
      callApi<Record<string, unknown>[]>('queryTable', {
        table: 'interview_assessments',
        operation: 'select',
        where: { interviewer_id: uid },
        limit: 1,
      }),
    ]);

    setExportData({
      vcs: vcsRes ?? [],
      hourTokens: hoursRes ?? [],
      resume: resumeRes?.[0] ?? null,
      program: (programRes && programRes.length > 0) ? programRes : null,
      interview: interviewRes?.[0] ?? null,
    });
    setLoadingExport(false);
  };

  const handleOpenExport = async () => {
    setDeleteStep('export');
    setDeleteError('');
    setDownloaded({});
    await loadExportData();
  };

  const triggerDownload = (filename: string, data: any) => {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const exportItem = (key: string, filename: string, data: any) => {
    triggerDownload(filename, data);
    setDownloaded(d => ({ ...d, [key]: true }));
  };

  const b64urlDecode = (s: string): ArrayBuffer => {
    const b = s.replace(/-/g, '+').replace(/_/g, '/');
    const bin = atob(b);
    const buf = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) buf[i] = bin.charCodeAt(i);
    return buf.buffer;
  };
  const b64urlEncode = (buf: ArrayBuffer): string => {
    const bytes = new Uint8Array(buf);
    let s = '';
    for (const b of bytes) s += String.fromCharCode(b);
    return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
  };

  const verifyPasskeyForDeletion = async (token: string): Promise<void> => {
    // 1. Fetch the user's registered passkey credential IDs from D1
    const uid = profileId;
    if (!uid) throw new Error('No session');

    const passkeysRes = await fetch(
      `${PILOT_API_URL}/api/pilot_passkeys?select=credential_id&user_id=eq.${uid}`,
      { headers: { 'Authorization': `Bearer ${token}` } }
    );
    const passkeys: { credential_id: string }[] = passkeysRes.ok ? await passkeysRes.json() : [];

    if (!passkeys || passkeys.length === 0) {
      // No passkey registered — skip gate
      throw new Error('NO_PASSKEY');
    }

    // Use the first registered credential to get a server-signed challenge
    const credentialId = passkeys[0].credential_id;

    // 2. Get a single-use challenge from the server
    const challengeRes = await fetch(`${PILOT_API_URL}/api/passkey-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ credentialId }),
    });
    if (!challengeRes.ok) throw new Error('Could not generate passkey challenge');
    const { challenge } = await challengeRes.json();

    // 3. Trigger iCloud Keychain / Touch ID / Face ID prompt
    const allowCredentials = passkeys.map((p: any) => ({
      id: b64urlDecode(p.credential_id),
      type: 'public-key' as PublicKeyCredentialType,
    }));

    const assertion = await navigator.credentials.get({
      publicKey: {
        challenge: b64urlDecode(challenge),
        allowCredentials,
        userVerification: 'required',
        timeout: 60000,
      },
    }) as PublicKeyCredential;

    if (!assertion) throw new Error('No passkey assertion returned');
    const resp = assertion.response as AuthenticatorAssertionResponse;

    // 4. Verify signature server-side
    const verifyRes = await fetch(`${PILOT_API_URL}/api/passkey-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        credentialId: b64urlEncode(assertion.rawId),
        authenticatorData: b64urlEncode(resp.authenticatorData),
        clientDataJSON: b64urlEncode(resp.clientDataJSON),
        signature: b64urlEncode(resp.signature),
        userHandle: resp.userHandle ? b64urlEncode(resp.userHandle) : null,
      }),
    });
    if (!verifyRes.ok) throw new Error('Passkey verification failed — deletion blocked');
  };

  const handleDeleteAccount = async () => {
    setDeleting(true);
    setDeleteError('');
    try {
      const token = await getToken();

      // Passkey gate — triggers iCloud Keychain / Touch ID before deletion
      if (window.PublicKeyCredential) {
        setPasskeyPending(true);
        try {
          await verifyPasskeyForDeletion(token!);
        } catch (pkErr: any) {
          setPasskeyPending(false);
          if (pkErr?.name === 'NotAllowedError') throw new Error('Passkey confirmation cancelled. Deletion aborted.');
          if (pkErr?.message === 'NO_PASSKEY') {
            // No passkey registered on this account — skip gate, proceed
          } else {
            console.warn('[delete-account] passkey gate skipped:', pkErr?.message);
          }
        }
        setPasskeyPending(false);
      }

      const res = await fetch(`${PILOT_API_URL}/api/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      const json = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(json.error || json.message || `Server error ${res.status}`);
      // Auth0 logout clears the session and redirects — call it if available, else fall back to onLogout
      if (onAuth0Logout) { onAuth0Logout(); } else { localStorage.clear(); sessionStorage.clear(); onLogout(); }
    } catch (err: any) {
      setDeleteError(err.message || 'Something went wrong. Please try again.');
      setDeleting(false);
    }
  };

  const handleCancel = () => { setDeleteStep(null); setDeleteError(''); setDownloaded({}); };

  const toggleSetting = (key: keyof typeof notifSettings) => {
    setNotifSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const NotifToggle: React.FC<{ label: string; active: boolean; onClick: () => void }> = ({ label, active, onClick }) => (
    <div className="flex items-center justify-between px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
      <span className="text-xs font-bold text-white/65 tracking-wider">{label}</span>
      <button
        onClick={onClick}
        className="relative w-10 h-5 rounded-full transition-all"
        style={{ background: active ? '#dc2626' : 'rgba(255,255,255,0.12)' }}
      >
        <span
          className="absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all"
          style={{ left: active ? '1.25rem' : '0.125rem' }}
        />
      </button>
    </div>
  );

  if (activeSubPage === 'notifications') {
    return (
      <div className="space-y-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSubPage(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors"><ChevronRight size={16} className="text-white/40 rotate-180" /></button>
          <p className="text-sm font-black text-white tracking-wide">Notification Settings</p>
        </div>
        <SectionCard title="Pathways">
          <NotifToggle label="In-app alerts" active={notifSettings.pathwaysAlerts} onClick={() => toggleSetting('pathwaysAlerts')} />
          <NotifToggle label="Email notifications" active={notifSettings.pathwaysEmails} onClick={() => toggleSetting('pathwaysEmails')} />
          <NotifToggle label="Push notifications" active={notifSettings.pathwaysPush} onClick={() => toggleSetting('pathwaysPush')} />
        </SectionCard>
        <SectionCard title="Recognition+">
          <NotifToggle label="In-app alerts" active={notifSettings.recognitionAlerts} onClick={() => toggleSetting('recognitionAlerts')} />
          <NotifToggle label="Email notifications" active={notifSettings.recognitionEmails} onClick={() => toggleSetting('recognitionEmails')} />
          <NotifToggle label="Push notifications" active={notifSettings.recognitionPush} onClick={() => toggleSetting('recognitionPush')} />
        </SectionCard>
        <SectionCard title="Shortage.org">
          <NotifToggle label="In-app alerts" active={notifSettings.shortageAlerts} onClick={() => toggleSetting('shortageAlerts')} />
          <NotifToggle label="Email notifications" active={notifSettings.shortageEmails} onClick={() => toggleSetting('shortageEmails')} />
          <NotifToggle label="Push notifications" active={notifSettings.shortagePush} onClick={() => toggleSetting('shortagePush')} />
        </SectionCard>
      </div>
    );
  }

  if (activeSubPage === 'email-preferences') {
    const userEmail = (user?.email as string) || (profile?.email as string) || 'No email on file';
    return (
      <div className="space-y-5 max-w-2xl mx-auto w-full">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={() => setActiveSubPage(null)} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <ChevronRight size={16} className="text-white/40 rotate-180" />
          </button>
          <p className="text-sm font-black text-white tracking-wide">Email Preferences</p>
        </div>

        {/* Current Email */}
        <SectionCard title="Current Email Address">
          <div className="px-3 py-4 space-y-2">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(220,38,38,0.1)' }}>
                <Mail size={16} className="text-red-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-white">{userEmail}</p>
                <p className="text-[10px] text-white/40">Primary contact email</p>
              </div>
            </div>
          </div>
        </SectionCard>

        {/* Email Settings */}
        <SectionCard title="Email Subscriptions">
          <NotifToggle label="Pathway opportunity alerts" active={notifSettings.pathwaysEmails} onClick={() => toggleSetting('pathwaysEmails')} />
          <NotifToggle label="Recognition+ updates" active={notifSettings.recognitionEmails} onClick={() => toggleSetting('recognitionEmails')} />
          <NotifToggle label="Shortage.org alerts" active={notifSettings.shortageEmails} onClick={() => toggleSetting('shortageEmails')} />
          <NotifToggle label="Marketing & promotions" active={notifSettings.marketingEmails} onClick={() => toggleSetting('marketingEmails')} />
        </SectionCard>

        {/* Verified status */}
        {user?.email_verified && (
          <div className="px-3 py-2 rounded-lg flex items-center gap-2" style={{ background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)' }}>
            <CheckCircle size={14} className="text-emerald-400" />
            <p className="text-[11px] font-bold text-emerald-400">Email verified</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-5 max-w-2xl mx-auto w-full">
      {/* Account */}
      <SectionCard title="Account">
        <div className="space-y-0.5">
          {/* Profile Photo */}
          <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/65 tracking-wider">PROFILE PHOTO</span>
              {hasProfilePhoto ? (
                <div className="flex items-center gap-2">
                  <img src={profileImage!} alt="Profile" className="w-8 h-8 rounded-full object-cover" style={{ border: '1px solid rgba(255,255,255,0.15)' }} />
                  <label className="cursor-pointer px-2 py-1 rounded-md text-[9px] font-black tracking-wider text-white/70 hover:text-white transition-colors" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)' }}>
                    REPLACE
                    <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                  </label>
                </div>
              ) : (
                <label className="cursor-pointer px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider text-white transition-colors hover:brightness-110" style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', color: '#ef4444' }}>
                  {uploadingPhoto ? 'UPLOADING…' : 'UPLOAD PHOTO'}
                  <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                </label>
              )}
            </div>
          </div>

          {/* Logbook Management */}
          <div className="px-3 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white/65 tracking-wider">LOGBOOK MANAGEMENT</span>
              {hasLogbook ? (
                <button onClick={() => console.log('[DEBUG] VIEW HISTORY clicked')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider transition-colors hover:brightness-110" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
                  <CheckCircle size={10} /> VIEW HISTORY
                </button>
              ) : (
                <button onClick={() => console.log('[DEBUG] SYNC LOGBOOK clicked')} className="flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[9px] font-black tracking-wider transition-colors hover:brightness-110" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.25)', color: '#ef4444' }}>
                  <Upload size={10} /> SYNC LOGBOOK
                </button>
              )}
            </div>
            {hasLogbook && (
              <p className="text-[10px] text-white/30 mt-1.5">
                {isPlus ? 'Recognition+ verified · Logbook synced' : 'Logbook synced · Upgrade to verify hours'}
              </p>
            )}
          </div>

          <button onClick={() => console.log('[DEBUG] Change Password clicked')} className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            CHANGE PASSWORD
            <ChevronRight size={12} className="text-white/25" />
          </button>
          <button onClick={() => { console.log('[DEBUG] Email Preferences clicked'); setActiveSubPage('email-preferences'); }} className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            EMAIL PREFERENCES
            <ChevronRight size={12} className="text-white/25" />
          </button>
        </div>
      </SectionCard>

      {/* Consent & Privacy */}
      <SectionCard title="Consent & Privacy">
        <div className="space-y-0.5">
          {['Operator Access Log', 'Download My Data'].map(item => (
            <button key={item} onClick={() => console.log(`[DEBUG] ${item} clicked`)} className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
            >
              {item.toUpperCase()}
              <ChevronRight size={12} className="text-white/25" />
            </button>
          ))}
        </div>
      </SectionCard>

      {/* Notifications */}
      <SectionCard title="Notifications">
        <button
          onClick={() => { console.log('[DEBUG] MANAGE NOTIFICATIONS clicked'); setActiveSubPage('notifications'); }}
          className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white"
          style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
          onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
          onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
        >
          MANAGE NOTIFICATIONS
          <ChevronRight size={12} className="text-white/25" />
        </button>
      </SectionCard>

      {/* Subscription */}
      <SectionCard title="Subscription">
        {isPlus ? (
          <div className="space-y-0.5">
            {['View Plan', 'Billing History'].map(item => (
              <button key={item} onClick={() => console.log(`[DEBUG] ${item} clicked`)} className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-white/65 rounded-lg transition-all font-bold tracking-wider hover:text-white" style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
                onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.06)')}
                onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
              >
                {item.toUpperCase()}
                <ChevronRight size={12} className="text-white/25" />
              </button>
            ))}
            <div className="px-3 py-3 mt-1">
              <span className="text-[9px] font-black tracking-wider px-2 py-0.5 rounded-full" style={{ background: 'rgba(52,211,153,0.12)', color: '#34d399', border: '1px solid rgba(52,211,153,0.25)' }}>
                ACTIVE · RECOGNITION+
              </span>
            </div>
          </div>
        ) : (
          <div className="p-4 space-y-4">
            <p className="text-xs text-white/50 leading-relaxed">
              Subscribe to <span className="text-red-400 font-bold">Recognition+</span> to unlock verified hours, automated credential tracking, and priority airline pathway access.
            </p>
            <div className="space-y-2">
              {[
                'Recognition AI — unlimited career strategy queries',
                'Pathways exclusive access — priority pilot pool listing',
                'Recommended in pathway submissions — operator visibility boost',
                'Priority listings — rank higher in airline recruiter pulls',
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle size={12} className="text-red-400 flex-shrink-0 mt-0.5" />
                  <p className="text-[11px] text-white/60">{f}</p>
                </div>
              ))}
            </div>
            <button
              onClick={() => { console.log('[DEBUG] SUBSCRIBE TO RECOGNITION+ clicked'); navigate('/platform?tab=recognition-plus'); }}
              className="w-full py-2.5 rounded-lg text-xs font-black tracking-wider text-white transition-all hover:brightness-110" style={{ background: '#dc2626' }}
            >
              SUBSCRIBE TO RECOGNITION+ →
            </button>
          </div>
        )}
      </SectionCard>

      {/* Contact Support */}
      <SectionCard title="Contact Support">
        <div className="p-4 space-y-3">
          <p className="text-xs text-white/50 leading-relaxed">
            Need help with your profile, verification, or subscription? Reach out to our pilot support team.
          </p>
          <div className="flex gap-2">
            <a href="mailto:support@pilotrecognition.com" className="flex-1 text-center py-2.5 rounded-lg text-xs font-black tracking-wider transition-all hover:brightness-110" style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
              EMAIL SUPPORT
            </a>
            <a href="https://wa.me/639123456789" target="_blank" rel="noopener noreferrer" className="flex-1 text-center py-2.5 rounded-lg text-xs font-black tracking-wider transition-all hover:brightness-110" style={{ background: 'rgba(52,211,153,0.1)', border: '1px solid rgba(52,211,153,0.25)', color: '#34d399' }}>
              WHATSAPP
            </a>
          </div>
        </div>
      </SectionCard>

      {/* Delete Account */}
      <SectionCard title="Danger Zone">
        {deleteStep === null && (
          <button
            onClick={() => { console.log('[DEBUG] DELETE ACCOUNT clicked'); handleOpenExport(); }}
            className="w-full flex items-center justify-between px-3 py-2.5 text-xs text-red-400 rounded-lg transition-all font-bold tracking-wider hover:text-red-300"
            style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            DELETE ACCOUNT
            <ChevronRight size={12} className="text-red-400/50" />
          </button>
        )}

        {/* Step 1 — Export documents */}
        {deleteStep === 'export' && (
          <div className="px-3 py-3 space-y-4">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(251,191,36,0.12)', color: '#fbbf24', border: '1px solid rgba(251,191,36,0.25)' }}>STEP 1 OF 2</span>
              <span className="text-[10px] font-black text-white/60 tracking-wider">EXPORT YOUR DATA</span>
            </div>
            <p className="text-xs text-white/55 leading-relaxed">
              Everything below will be <span className="text-red-400 font-bold">permanently deleted</span>. Download what you need before continuing — all exports are portable JSON.
            </p>

            {loadingExport ? (
              <div className="flex items-center gap-2 py-3">
                <div className="w-4 h-4 border-2 border-sky-400/30 border-t-sky-400 rounded-full animate-spin" />
                <span className="text-[10px] text-white/40">Loading your data…</span>
              </div>
            ) : (
              <div className="space-y-2">

                {/* Verified Credentials (W3C VCs) */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">VERIFIED CREDENTIALS</p>
                      <p className="text-[9px] text-white/35">{exportData.vcs.length} W3C VC{exportData.vcs.length !== 1 ? 's' : ''} · Wallet tokens · Attestations</p>
                    </div>
                    {exportData.vcs.length > 0 ? (
                      <button onClick={() => exportItem('vcs', `pilot-vcs-${new Date().toISOString().slice(0,10)}.json`, exportData.vcs)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.vcs ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.vcs ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.vcs ? '#34d399' : '#38bdf8' }}>
                        {downloaded.vcs ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* Verified Flight Hour Tokens */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">VERIFIED FLIGHT HOURS</p>
                      <p className="text-[9px] text-white/35">{exportData.hourTokens.length} logbook token{exportData.hourTokens.length !== 1 ? 's' : ''} · Attestation records</p>
                    </div>
                    {exportData.hourTokens.length > 0 ? (
                      <button onClick={() => exportItem('hours', `pilot-flight-hours-${new Date().toISOString().slice(0,10)}.json`, exportData.hourTokens)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.hours ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.hours ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.hours ? '#34d399' : '#38bdf8' }}>
                        {downloaded.hours ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* ATLAS Resume */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">ATLAS PILOT RESUME</p>
                      <p className="text-[9px] text-white/35">{exportData.resume ? `${exportData.resume.target_role || 'Aviation'} · ${exportData.resume.is_certified ? 'Certified' : 'Draft'}` : 'No resume generated'}</p>
                    </div>
                    {exportData.resume ? (
                      <button onClick={() => exportItem('resume', `atlas-resume-${new Date().toISOString().slice(0,10)}.json`, exportData.resume)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.resume ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.resume ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.resume ? '#34d399' : '#38bdf8' }}>
                        {downloaded.resume ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* Foundation Program Certificate */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">PROGRAM COMPLETION RECORDS</p>
                      <p className="text-[9px] text-white/35">
                        {exportData.program
                          ? exportData.program.map((p: any) => `${p.program_type} — ${p.completion_percentage}%`).join(' · ')
                          : 'No programs enrolled'}
                      </p>
                    </div>
                    {exportData.program ? (
                      <button onClick={() => exportItem('program', `program-certificate-${new Date().toISOString().slice(0,10)}.json`, exportData.program)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.program ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.program ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.program ? '#34d399' : '#38bdf8' }}>
                        {downloaded.program ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

                {/* EBT Interview Assessment */}
                <div className="rounded-lg overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
                  <div className="flex items-center justify-between px-3 py-2.5" style={{ background: 'rgba(255,255,255,0.04)' }}>
                    <div>
                      <p className="text-[10px] font-black text-white/80">EBT INTERVIEW ASSESSMENT</p>
                      <p className="text-[9px] text-white/35">
                        {exportData.interview
                          ? `Grade ${exportData.interview.overall_grade || '—'} · Score ${exportData.interview.overall_score ?? '—'} · ${exportData.interview.recommendation || ''}`
                          : 'No interview assessment on record'}
                      </p>
                    </div>
                    {exportData.interview ? (
                      <button onClick={() => exportItem('interview', `ebt-interview-assessment-${new Date().toISOString().slice(0,10)}.json`, exportData.interview)}
                        className="px-3 py-1.5 text-[9px] font-black rounded-lg tracking-wider transition-all"
                        style={{ background: downloaded.interview ? 'rgba(52,211,153,0.15)' : 'rgba(56,189,248,0.15)', border: `1px solid ${downloaded.interview ? 'rgba(52,211,153,0.3)' : 'rgba(56,189,248,0.3)'}`, color: downloaded.interview ? '#34d399' : '#38bdf8' }}>
                        {downloaded.interview ? '✓ SAVED' : 'EXPORT'}
                      </button>
                    ) : <span className="text-[9px] text-white/20">None</span>}
                  </div>
                </div>

              </div>
            )}

            <div className="flex gap-2 pt-1">
              <button
                onClick={() => { console.log('[DEBUG] CONTINUE TO DELETE clicked'); setDeleteStep('confirm'); }}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
              >
                CONTINUE TO DELETE →
              </button>
              <button onClick={() => { console.log('[DEBUG] CANCEL clicked'); handleCancel(); }} className="px-4 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
                CANCEL
              </button>
            </div>
          </div>
        )}

        {/* Step 2 — Final confirm */}
        {deleteStep === 'confirm' && (
          <div className="px-3 py-3 space-y-3">
            <div className="flex items-center gap-2">
              <span className="text-[9px] font-black tracking-widest px-2 py-0.5 rounded-full" style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', border: '1px solid rgba(239,68,68,0.3)' }}>STEP 2 OF 2</span>
              <span className="text-[10px] font-black text-white/60 tracking-wider">FINAL CONFIRMATION</span>
            </div>
            <p className="text-xs text-white/70 leading-relaxed">
              This will permanently delete your <span className="text-white font-bold">profile, credentials, wallet, documents, passkeys, logbook data,</span> and all associated records. <span className="text-red-400 font-bold">This cannot be undone.</span>
            </p>
            <div className="flex items-center gap-2 px-2 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)' }}>
              <span className="text-lg">🔑</span>
              <p className="text-[10px] text-white/45 leading-snug">Your passkey (Touch ID / Face ID / iCloud Keychain) will be required to confirm deletion.</p>
            </div>
            {deleteError && <p className="text-xs text-red-400">{deleteError}</p>}
            <div className="flex gap-2">
              <button
                onClick={() => { console.log('[DEBUG] YES, DELETE EVERYTHING clicked'); handleDeleteAccount(); }}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
              >
                {passkeyPending ? '🔑 WAITING FOR PASSKEY…' : deleting ? 'DELETING...' : 'YES, DELETE EVERYTHING'}
              </button>
              <button onClick={() => { console.log('[DEBUG] CANCEL clicked'); handleCancel(); }} disabled={deleting} className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                CANCEL
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      <button onClick={() => { console.log('[DEBUG] SIGN OUT clicked'); onLogout(); }} className="flex items-center gap-2 text-xs text-red-400 font-bold hover:text-red-300 transition-colors px-3 py-2 tracking-wider">
        <LogOut size={14} /> SIGN OUT
      </button>
    </div>
  );
};
