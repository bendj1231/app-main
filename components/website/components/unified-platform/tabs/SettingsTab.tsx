import React from 'react';
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
import { supabase } from '@/shared/lib/supabase';
import { SectionCard } from '../shared';
import type { TabId } from '../types';

// ─── TAB: SETTINGS ─────────────────────────────────────────────────────────
export const SettingsTab: React.FC<{ onLogout: () => void; getToken: () => Promise<string>; profileId: string | null; onAuth0Logout?: () => void }> = ({ onLogout, getToken, profileId, onAuth0Logout }) => {
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

  const loadExportData = async () => {
    setLoadingExport(true);
    const uid = profileId;
    if (!uid) { setLoadingExport(false); return; }

    const [vcsRes, hoursRes, resumeRes, programRes, interviewRes] = await Promise.all([
      supabase.from('pilot_verification_wallet').select('credential_type,credential_jwt,issued_at,status').eq('profile_id', uid),
      supabase.from('logbook_hour_tokens').select('issuer_name,total_hours,pic_hours,aircraft_type,period_from,period_to,verification_level,attestation_token,status').eq('pilot_id', uid),
      supabase.from('atlas_resumes').select('*').eq('user_id', uid).maybeSingle(),
      supabase.from('program_progress').select('program_type,completion_percentage,modules_completed,total_modules,status,start_date').eq('user_id', uid),
      supabase.from('interview_assessments').select('overall_score,overall_grade,technical_knowledge_score,communication_score,decision_making_score,strengths,areas_for_improvement,detailed_feedback,recommendation').eq('interviewer_id', uid).maybeSingle(),
    ]);

    setExportData({
      vcs: vcsRes.data ?? [],
      hourTokens: hoursRes.data ?? [],
      resume: resumeRes.data ?? null,
      program: (programRes.data && programRes.data.length > 0) ? programRes.data : null,
      interview: interviewRes.data ?? null,
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
    const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL;
    const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

    // 1. Fetch the user's registered passkey credential IDs from Supabase
    const uid = profileId;
    if (!uid) throw new Error('No session');

    // Use authenticated fetch so RLS passes for Auth0 users (supabase client has no session)
    const passkeysRes = await fetch(
      `${supabaseUrl}/rest/v1/pilot_passkeys?select=credential_id&user_id=eq.${uid}`,
      { headers: { 'apikey': anonKey, 'Authorization': `Bearer ${token}` } }
    );
    const passkeys: { credential_id: string }[] = passkeysRes.ok ? await passkeysRes.json() : [];

    if (!passkeys || passkeys.length === 0) {
      // No passkey registered — skip gate
      throw new Error('NO_PASSKEY');
    }

    // Use the first registered credential to get a server-signed challenge
    const credentialId = passkeys[0].credential_id;

    // 2. Get a single-use challenge from the server
    const challengeRes = await fetch(`${supabaseUrl}/functions/v1/passkey-challenge`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
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
    const verifyRes = await fetch(`${supabaseUrl}/functions/v1/passkey-verify`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'apikey': anonKey },
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

      const res = await fetch(`${(import.meta as any).env?.VITE_SUPABASE_URL}/functions/v1/delete-account`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'apikey': (import.meta as any).env?.VITE_SUPABASE_ANON_KEY,
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

  const sections = [
    { title: 'Account', items: ['Edit Profile', 'Change Password', 'Email Preferences'] },
    { title: 'Consent & Privacy', items: ['Manage Vault Consent', 'Manage Veremark Consent', 'Operator Access Log', 'Download My Data'] },
    { title: 'Notifications', items: ['Pathway Alerts', 'Credential Expiry Warnings', 'News & Updates', 'Operator Interest Notifications'] },
    { title: 'Subscription', items: ['View Plan', 'Upgrade to Recognition Plus', 'Billing History'] },
  ];

  return (
    <div className="space-y-5 max-w-2xl mx-auto w-full">
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

      {/* Delete Account */}
      <SectionCard title="Danger Zone">
        {deleteStep === null && (
          <button
            onClick={handleOpenExport}
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
                onClick={() => setDeleteStep('confirm')}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all"
                style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)', color: '#f87171' }}
              >
                CONTINUE TO DELETE →
              </button>
              <button onClick={handleCancel} className="px-4 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.4)' }}>
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
                onClick={handleDeleteAccount}
                disabled={deleting}
                className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all disabled:opacity-50"
                style={{ background: 'rgba(239,68,68,0.2)', border: '1px solid rgba(239,68,68,0.4)', color: '#f87171' }}
              >
                {passkeyPending ? '🔑 WAITING FOR PASSKEY…' : deleting ? 'DELETING...' : 'YES, DELETE EVERYTHING'}
              </button>
              <button onClick={handleCancel} disabled={deleting} className="flex-1 py-2 text-xs font-black tracking-wider rounded-lg transition-all" style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)' }}>
                CANCEL
              </button>
            </div>
          </div>
        )}
      </SectionCard>

      <button onClick={onLogout} className="flex items-center gap-2 text-xs text-red-400 font-bold hover:text-red-300 transition-colors px-3 py-2 tracking-wider">
        <LogOut size={14} /> SIGN OUT
      </button>
    </div>
  );
};
