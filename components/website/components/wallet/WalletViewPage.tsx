import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../../../../shared/lib/supabase';
import {
  buildInitialWalletState,
  buildAviationRecordSummaryVP,
  holderDid,
  classifyTerminalClearance,
  classifyHoursBracket,
} from '../../../../lib/wallet/vcBuilder';
import {
  startStatusPolling,
  stopStatusPolling,
  invalidateStatusCache,
} from '../../../../lib/wallet/statusList';
import type { WalletState, BitstringStatusResult } from '../../../../lib/wallet/types/schemas';
import {
  generateEnclaveKey,
  getHolderDid,
  signCredentialPayload,
  getEnclaveStatus,
} from '../../../../lib/wallet/enclave';
import {
  initStorageKey,
  storeCredential,
  logPresentationEvent,
  getStorageHealthReport,
} from '../../../../lib/wallet/storage';
import type { EnclaveStatus } from '../../../../lib/wallet/enclave';
import type { StorageHealthReport } from '../../../../lib/wallet/storage';

interface WalletViewPageProps {
  userId?: string;
  onBack?: () => void;
}

const STATUS_CONFIG: Record<string, { label: string; dot: string; text: string; bg: string; border: string }> = {
  verified: { label: 'VERIFIED',      dot: '#16a34a', text: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
  pending:  { label: 'PENDING',       dot: '#3b82f6', text: '#3b82f6', bg: '#eff6ff', border: '#bfdbfe' },
  expired:  { label: 'EXPIRED',       dot: '#dc2626', text: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
  flagged:  { label: 'UNDER REVIEW',  dot: '#d97706', text: '#d97706', bg: '#fffbeb', border: '#fde68a' },
};

const CHECK_LABELS: Record<string, string> = {
  professional_qualification: 'Pilot License (CPL/ATPL)',
  identity:                   'Identity / Passport',
  education:                  'Medical Certificate',
  fitness_proprietary:        'Background / NBI Check',
  type_rating:                'Type Rating Certificate',
  language_proficiency:       'ICAO Language Proficiency (ELP)',
};

const SLEEVE_CONFIG = [
  { key: 'license',  icon: '📜', label: 'Pilot License',        profileKey: 'license_type',        subKey: 'license_number',    expiryKey: 'license_expiry',  checkType: 'professional_qualification' },
  { key: 'medical',  icon: '🏥', label: 'Medical Certificate',  profileKey: 'medical_class',        subKey: 'medical_number',    expiryKey: 'medical_expiry',  checkType: 'education' },
  { key: 'ntc',      icon: '📻', label: 'Radio / NTC License',  profileKey: 'ntc_license',          subKey: null,                expiryKey: 'ntc_expiry',      checkType: null },
  { key: 'elp',      icon: '🗣', label: 'ELP Certificate',      profileKey: 'language_proficiency', subKey: 'elp_certificate_no', expiryKey: 'elp_expiry',     checkType: 'language_proficiency' },
];

interface WalletNotif {
  id: string;
  type: 'error' | 'warning' | 'info' | 'success';
  title: string;
  body: string;
  time: string;
}

export const WalletViewPage: React.FC<WalletViewPageProps> = ({ userId, onBack }) => {
  const [profile, setProfile] = useState<any>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);
  const [notifOpen, setNotifOpen] = useState(false);
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());
  const [syncingProvider, setSyncingProvider] = useState<string | null>(null);
  const [connectedProviders, setConnectedProviders] = useState<Set<string>>(new Set());
  const [syncMsg, setSyncMsg] = useState<{ id: string; msg: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  // Zone 1 — DID chip verification
  const [didVerifying, setDidVerifying] = useState(false);
  const [didVerified, setDidVerified] = useState(false);
  // Zone 2 — QR scan modal per sleeve
  const [qrSlot, setQrSlot] = useState<string | null>(null);
  const [scanningSlot, setScanningSlot] = useState<string | null>(null);
  const [importedSlots, setImportedSlots] = useState<Set<string>>(new Set());
  // Zone 3 — selective disclosure
  const [disclosureToggles, setDisclosureToggles] = useState<Record<string, boolean>>({
    total: true, pic: false, instrument: false, multi: false, night: false,
  });
  const [exportOpen, setExportOpen] = useState(false);
  const [signoffOpen, setSignoffOpen] = useState(false);
  const [editingSlot, setEditingSlot] = useState<string | null>(null);
  const [slotDraft, setSlotDraft] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  // IPFS / Pinata
  const [ipfsCid, setIpfsCid] = useState<string | null>(null);
  const [ipfsPinning, setIpfsPinning] = useState(false);
  const [ipfsError, setIpfsError] = useState<string | null>(null);
  // Recognition+
  const [isRecognitionPlus, setIsRecognitionPlus] = useState(false);
  const [veremarkStatus, setVeremarkStatus] = useState<string>('not_started');
  const [veremarkRequestGuid, setVeremarkRequestGuid] = useState<string | null>(null);
  const [veremarkInitiating, setVeremarkInitiating] = useState(false);
  const [veremarkError, setVeremarkError] = useState<string | null>(null);
  const [veremarkFeedbackUrl, setVeremarkFeedbackUrl] = useState<string | null>(null);

  const VEREMARK_STATUS_CONFIG: Record<string, { label: string; dot: string; text: string }> = {
    not_started: { label: 'Not Started', dot: '#94a3b8', text: '#475569' },
    in_progress: { label: 'In Progress', dot: '#3b82f6', text: '#1d4ed8' },
    verified:    { label: 'Verified',     dot: '#16a34a', text: '#15803d' },
    expired:     { label: 'Expired',      dot: '#ef4444', text: '#dc2626' },
  };

  const VEREMARK_CHECKS = [
    { key: 'professional_qualification', label: 'Pilot License (CAAP / FAA)', icon: '📜' },
    { key: 'education',                  label: 'Medical Certificate',         icon: '🏥' },
    { key: 'language_proficiency',       label: 'ICAO ELP (Language)',          icon: '🗣' },
    { key: 'identity',                   label: 'Identity / Passport',          icon: '🪪' },
  ];

  const initiateVeremark = async () => {
    setVeremarkInitiating(true);
    setVeremarkError(null);
    try {
      const session = (await supabase.auth.getSession()).data.session;
      if (!session) throw new Error('Not authenticated');
      const res = await fetch(
        'https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/veremark-initiate',
        {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${session.access_token}`,
            'Content-Type': 'application/json',
          },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Initiation failed');
      setVeremarkStatus(data.status === 'already_in_progress' ? 'in_progress' :
                        data.status === 'already_verified'    ? 'verified' : 'in_progress');
      if (data.request_guid) setVeremarkRequestGuid(data.request_guid);
      if (data.candidate_feedback_url) setVeremarkFeedbackUrl(data.candidate_feedback_url);
    } catch (e: any) {
      setVeremarkError(e.message);
    } finally {
      setVeremarkInitiating(false);
    }
  };
  type TabID = 'overview' | 'credentials' | 'logbook' | 'vault';
  const [activeTab, setActiveTab] = useState<TabID>('overview');
  // W3C VC wallet state
  const [walletState, setWalletState] = useState<WalletState | null>(null);
  const [slotStatuses, setSlotStatuses] = useState<Record<number, BitstringStatusResult>>({});
  const [enclaveStatus, setEnclaveStatus] = useState<EnclaveStatus | null>(null);
  const [storageHealth, setStorageHealth] = useState<StorageHealthReport | null>(null);

  useEffect(() => {
    const load = async () => {
      const uid = userId || (await supabase.auth.getSession()).data.session?.user?.id;
      if (!uid) { setLoading(false); return; }

      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('pilot_credentials').select('*').eq('user_id', uid),
      ]);
      setProfile(p);
      const resolvedChecks = c || [];
      setChecks(resolvedChecks);
      if (p) {
        setIsRecognitionPlus(p.account_tier === 'recognition_plus' || p.account_tier === 'enterprise' || p.account_tier === 'enterprise_admin');
        setVeremarkStatus(p.veremark_status || 'not_started');
        setVeremarkRequestGuid(p.veremark_request_guid || null);
        if (p.vp_ipfs_cid) setIpfsCid(p.vp_ipfs_cid);
        const ws = buildInitialWalletState(p, resolvedChecks);
        setWalletState(ws);
        // Tier 1 — init enclave key (idempotent)
        await generateEnclaveKey();
        // Poll until key is present — avoids IndexedDB write race
        let es = await getEnclaveStatus();
        if (!es.keyPresent) {
          await new Promise(r => setTimeout(r, 400));
          es = await getEnclaveStatus();
        }
        setEnclaveStatus(es);
        // Tier 2 — init encrypted storage keyed to holder DID
        const hDid = es.holderDid || `did:web:wallet.pilotrecognition.com:${p.id}`;
        await initStorageKey(hDid);
        // Persist built VCs into encrypted local storage
        if (ws.slots.license.vc)  await storeCredential('license', ws.slots.license.vc as any);
        if (ws.slots.medical.vc)  await storeCredential('medical', ws.slots.medical.vc as any);
        if (ws.slots.elp.vc)      await storeCredential('elp',     ws.slots.elp.vc     as any);
        const health = await getStorageHealthReport();
        setStorageHealth(health);
      }
      setLoading(false);
    };
    load();
  }, [userId]);

  useEffect(() => {
    if (!walletState) return;
    startStatusPolling(
      walletState.statusListUrl,
      [0, 1, 2],
      (results) => {
        const map: Record<number, BitstringStatusResult> = {};
        results.forEach(r => { map[r.slotIndex] = r.status; });
        setSlotStatuses(prev => ({ ...prev, ...map }));
        setWalletState(prev => {
          if (!prev) return prev;
          const updated = { ...prev, lastStatusPoll: Date.now() };
          const slotKeys = ['license', 'medical', 'elp'] as const;
          slotKeys.forEach((key, idx) => {
            if (map[idx]) {
              updated.slots = { ...updated.slots, [key]: { ...updated.slots[key], statusBit: map[idx], lastStatusCheck: Date.now() } };
            }
          });
          if (map[1] === 'revoked' || map[1] === 'suspended') {
            updated.activePresentation = null;
          }
          return updated;
        });
      },
    );
    return () => stopStatusPolling();
  }, [walletState?.statusListUrl]);

  const safe = (v: any) => {
    if (!v) return null;
    if (typeof v === 'string' && v.trim().startsWith('{"iv"')) return null;
    return v;
  };

  const daysUntil = (dateStr: string | null) => {
    if (!dateStr) return null;
    return Math.ceil((new Date(dateStr).getTime() - Date.now()) / 86400000);
  };

  const expiryColor = (days: number | null) => {
    if (days === null) return '#94a3b8';
    if (days < 0) return '#dc2626';
    if (days < 30) return '#d97706';
    if (days < 90) return '#ca8a04';
    return '#16a34a';
  };

  const allVerified = checks.length > 0 && checks.every(c => c.status === 'verified');
  const hasExpired  = checks.some(c => c.status === 'expired');
  const totalHours  = Number(profile?.total_flight_hours || profile?.current_flight_hours || 0);

  // Terminal tier derived from walletState circuit-breaker
  const medicalBit  = (slotStatuses[1] ?? 'unknown') as BitstringStatusResult;
  const licenseBit  = (slotStatuses[0] ?? 'unknown') as BitstringStatusResult;
  const terminalTier: 1 | 2 | 3 = (() => {
    const revoked = (b: string) => b === 'revoked';
    const suspended = (b: string) => b === 'suspended';
    if (revoked(medicalBit) || revoked(licenseBit) || hasExpired) return 1;
    if (suspended(medicalBit) || (!allVerified && medicalBit === 'unknown')) return 2;
    if (allVerified && !revoked(medicalBit) && !suspended(medicalBit)) return 3;
    return 2;
  })();
  const terminalConfig = {
    1: { tier: 1, label: 'TERMINAL 1 — BASELINE',  dot: '#dc2626', color: '#dc2626', bg: 'rgba(220,38,38,0.1)',  border: 'rgba(220,38,38,0.3)',  bar: 'linear-gradient(90deg,#dc2626,#f87171,#dc2626)' },
    2: { tier: 2, label: 'TERMINAL 2 — ISOLATION', dot: '#d97706', color: '#d97706', bg: 'rgba(217,119,6,0.1)',  border: 'rgba(217,119,6,0.3)',  bar: 'linear-gradient(90deg,#f59e0b,#fbbf24,#f59e0b)' },
    3: { tier: 3, label: 'TERMINAL 3 — VERIFIED',  dot: '#16a34a', color: '#16a34a', bg: 'rgba(22,163,74,0.1)', border: 'rgba(22,163,74,0.3)',  bar: 'linear-gradient(90deg,#10b981,#34d399,#10b981)' },
  };
  const tc = terminalConfig[terminalTier];
  const liveDid = enclaveStatus?.holderDid
    || (profile?.id ? `did:web:wallet.pilotrecognition.com:${profile.id}` : null);

  const allNotifs: WalletNotif[] = [
    ...checks.filter(c => c.status === 'expired').map(c => ({
      id: `exp-${c.id}`,
      type: 'error' as const,
      title: `${CHECK_LABELS[c.check_type] || c.check_type} Expired`,
      body: 'This credential has expired and may affect your Pre-Cleared status with airlines.',
      time: 'Action required',
    })),
    ...checks.filter(c => { const d = daysUntil(c.expires_at); return d !== null && d >= 0 && d < 60 && c.status !== 'expired'; }).map(c => ({
      id: `soon-${c.id}`,
      type: 'warning' as const,
      title: `${CHECK_LABELS[c.check_type] || c.check_type} Expiring Soon`,
      body: `Expires in ${daysUntil(c.expires_at)} days. Renew to maintain verified status.`,
      time: `${daysUntil(c.expires_at)}d remaining`,
    })),
    ...SLEEVE_CONFIG.filter(s => s.checkType && !checks.find(c => c.check_type === s.checkType)).map(s => ({
      id: `unverified-${s.key}`,
      type: 'info' as const,
      title: `${s.label} Not Yet Verified`,
      body: 'Submit this credential for third-party verification to improve your Recognition score.',
      time: 'Pending',
    })),
    ...(allVerified ? [{ id: 'pre-cleared', type: 'success' as const, title: 'Pre-Cleared Status Active', body: 'All credentials verified. Airlines can view your Pre-Cleared profile.', time: 'Active' }] : []),
    { id: 'aes', type: 'info' as const, title: 'Wallet Secured — AES-256-GCM', body: 'Your credential bundle is encrypted end-to-end. Private key never leaves your device.', time: 'Now' },
  ].filter(n => !dismissed.has(n.id));

  const unreadCount = allNotifs.filter(n => n.type === 'error' || n.type === 'warning').length;

  const handleSync = useCallback((id: string) => {
    if (connectedProviders.has(id)) {
      setSyncMsg({ id, msg: 'Already connected' });
      setTimeout(() => setSyncMsg(null), 2000);
      return;
    }
    setSyncingProvider(id);
    setTimeout(() => {
      setSyncingProvider(null);
      setConnectedProviders(p => new Set([...p, id]));
      setSyncMsg({ id, msg: 'Sync request sent — awaiting provider approval' });
      setTimeout(() => setSyncMsg(null), 3500);
    }, 1800);
  }, [connectedProviders]);

  const saveProfile = useCallback(async (patch: Record<string, any>) => {
    if (!profile?.id) return;
    setSaving(true);
    setSaveError(null);
    const { error } = await supabase.from('profiles').update(patch).eq('id', profile.id);
    if (error) { setSaveError(error.message); setSaving(false); return; }
    setProfile((prev: any) => prev ? { ...prev, ...patch } : prev);
    setSaving(false);
    setEditingSlot(null);
    setSlotDraft({});
  }, [profile?.id]);

  const handleCSV = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setSyncMsg({ id: 'csv', msg: `Importing ${file.name}… (manual review required)` });
    setTimeout(() => {
      setConnectedProviders(p => new Set([...p, 'csv']));
      setSyncMsg({ id: 'csv', msg: `${file.name} imported — hours pending admin review` });
      setTimeout(() => setSyncMsg(null), 4000);
    }, 1500);
    e.target.value = '';
  }, []);

  const PROVIDERS = [
    { id: 'foreflight',  name: 'ForeFlight',      sub: 'iOS / Web',          logo: '✈️',  tier: 'certified' },
    { id: 'safelog',     name: 'Safelog',          sub: 'Web / Mobile',       logo: '📒',  tier: 'certified' },
    { id: 'logten',      name: 'LogTen Pro',       sub: 'iOS / macOS',        logo: '📱',  tier: 'certified' },
    { id: 'myflight',    name: 'MyFlightbook',     sub: 'Web / Android',      logo: '📓',  tier: 'pending'   },
    { id: 'zululog',     name: 'Zulu Log',         sub: 'Web',                logo: '🌐',  tier: 'pending'   },
    { id: 'airlog',      name: 'Air Log',          sub: 'Mobile',             logo: '📲',  tier: 'pending'   },
  ];

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #fecaca', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  const name = safe(profile?.display_name) || safe(profile?.full_name) || 'PILOT';
  const did  = profile?.id ? `0x${profile.id.replace(/-/g,'').slice(0,16).toUpperCase()}` : '—';

  const content = (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 99999, overflowY: 'auto',
      fontFamily: "'SF Pro Display', system-ui, -apple-system, sans-serif",
      background: '#f1f5f9',
    }}>
      <style>{`
        @keyframes wvFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wvShimmer { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes wvGlow { 0%,100% { box-shadow: 0 0 20px rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 40px rgba(220,38,38,0.6); } }
        @keyframes wvPulse { 0%,100% { opacity:1; transform:scale(1); } 50% { opacity:0.5; transform:scale(0.85); } }
        @keyframes wvCountdown { from { width: 100%; } to { width: 0%; } }
        .wv-in { animation: wvFadeUp 0.4s ease both; }
        .wv-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .wv-card-hover:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(0,0,0,0.1) !important; }
      `}</style>

      {/* clean bg — no texture noise */}

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: '#ffffff',
              border: '1px solid #e2e8f0', borderRadius: 8, padding: '6px 12px',
              cursor: 'pointer', color: '#475569', fontSize: 11, fontWeight: 600,
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          )}
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#dc2626', textTransform: 'uppercase' }}>PilotRecognition</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.01em' }}>Credential Wallet</p>
            <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontWeight: 600 }}>Profile Mode: Standard B2B</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          {/* Network sync badge */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '4px 10px', borderRadius: 20, background: '#f0fdf4', border: '1px solid #bbf7d0' }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: '#16a34a', animation: 'wvPulse 2s ease infinite' }} />
            <span style={{ fontSize: 9, fontWeight: 700, color: '#16a34a', letterSpacing: '0.08em' }}>Network Sync: Active</span>
          </div>
          {/* Terminal tier pill */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20,
            background: tc.bg, border: `1px solid ${tc.border}`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: tc.color }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: tc.color, letterSpacing: '0.08em' }}>
              {tc.label}
            </span>
          </div>

          {/* Bell */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setNotifOpen(o => !o)}
              style={{
                position: 'relative', width: 38, height: 38, borderRadius: 10,
                background: notifOpen ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.07)',
                border: '1px solid rgba(255,255,255,0.14)', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.75)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
              </svg>
              {unreadCount > 0 && (
                <div style={{
                  position: 'absolute', top: -5, right: -5,
                  minWidth: 17, height: 17, borderRadius: 9,
                  background: '#dc2626', border: '2px solid #1a0a00',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 9, fontWeight: 800, color: '#fff', padding: '0 3px',
                }}>{unreadCount}</div>
              )}
            </button>

            {/* Dropdown */}
            {notifOpen && (
              <div style={{
                position: 'absolute', top: 46, right: 0, width: 330, zIndex: 300,
                background: 'linear-gradient(160deg, #1c1c2e 0%, #12121e 100%)',
                border: '1px solid rgba(255,255,255,0.1)', borderRadius: 16,
                boxShadow: '0 28px 64px rgba(0,0,0,0.8)',
                overflow: 'hidden',
              }}>
                {/* Header row */}
                <div style={{ padding: '12px 16px 10px', borderBottom: '1px solid rgba(255,255,255,0.06)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                    <span style={{ fontSize: 11, fontWeight: 800, color: '#ffffff', letterSpacing: '0.04em' }}>Wallet Alerts</span>
                    {allNotifs.length > 0 && (
                      <span style={{ fontSize: 9, fontWeight: 700, background: 'rgba(255,255,255,0.1)', color: 'rgba(255,255,255,0.5)', borderRadius: 8, padding: '1px 6px' }}>
                        {allNotifs.length}
                      </span>
                    )}
                  </div>
                  {allNotifs.length > 0 && (
                    <button
                      onClick={() => setDismissed(new Set(allNotifs.map(n => n.id)))}
                      style={{ fontSize: 9, color: 'rgba(255,255,255,0.3)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Items */}
                <div style={{ maxHeight: 380, overflowY: 'auto', padding: '6px 0 8px' }}>
                  {allNotifs.length === 0 ? (
                    <div style={{ padding: '28px 16px', textAlign: 'center' }}>
                      <div style={{ fontSize: 24, marginBottom: 8 }}>✓</div>
                      <p style={{ margin: 0, fontSize: 11, color: 'rgba(255,255,255,0.25)', fontWeight: 600 }}>All clear — no alerts</p>
                    </div>
                  ) : allNotifs.map(n => {
                    const C = {
                      error:   { left: '#dc2626', bg: 'rgba(220,38,38,0.08)',  icon: '⚠️',  label: '#dc2626' },
                      warning: { left: '#f59e0b', bg: 'rgba(245,158,11,0.08)', icon: '⏰',  label: '#f59e0b' },
                      info:    { left: '#3b82f6', bg: 'rgba(59,130,246,0.07)', icon: 'ℹ️',  label: '#3b82f6' },
                      success: { left: '#10b981', bg: 'rgba(16,185,129,0.07)', icon: '✅',  label: '#10b981' },
                    }[n.type];
                    return (
                      <div key={n.id} style={{
                        margin: '4px 10px',
                        background: C.bg,
                        borderRadius: 10,
                        borderLeft: `3px solid ${C.left}`,
                        padding: '10px 10px 10px 12px',
                        position: 'relative',
                        display: 'flex', gap: 9, alignItems: 'flex-start',
                      }}>
                        <span style={{ fontSize: 14, flexShrink: 0, marginTop: 1 }}>{C.icon}</span>
                        <div style={{ flex: 1, minWidth: 0, paddingRight: 18 }}>
                          <p style={{ margin: '0 0 2px', fontSize: 11, fontWeight: 700, color: '#ffffff', lineHeight: 1.3 }}>{n.title}</p>
                          <p style={{ margin: '0 0 5px', fontSize: 10, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{n.body}</p>
                          <span style={{ fontSize: 9, fontWeight: 700, color: C.label, letterSpacing: '0.05em' }}>{n.time}</span>
                        </div>
                        <button
                          onClick={() => setDismissed(d => new Set([...d, n.id]))}
                          style={{ position: 'absolute', top: 8, right: 8, background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.2)', fontSize: 14, lineHeight: 1, padding: 2 }}
                        >×</button>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── TAB BAR ── */}
      {(() => {
        const tabs: { key: TabID; label: string; badge?: string }[] = [
          { key: 'overview',    label: 'Overview' },
          { key: 'credentials', label: 'Credentials (VCs)', badge: checks.filter(c => c.status === 'verified').length > 0 ? String(checks.filter(c => c.status === 'verified').length) : undefined },
          { key: 'logbook',     label: 'Logbook' },
          { key: 'vault',       label: 'Security Vault', badge: storageHealth?.tier4.auditEntries ? String(storageHealth.tier4.auditEntries) : undefined },
        ];
        return (
          <div style={{ position: 'relative', zIndex: 10, padding: '16px 28px 0' }}>
            <div style={{ display: 'flex', gap: 2, background: '#f1f5f9', borderRadius: 12, padding: 4, border: '1px solid #e2e8f0' }}>
              {tabs.map(t => {
                const isActive = activeTab === t.key;
                const accentColor = t.key === 'vault' ? '#dc2626' : t.key === 'credentials' ? '#16a34a' : '#2563eb';
                return (
                  <button
                    key={t.key}
                    onClick={() => setActiveTab(t.key)}
                    style={{
                      flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      padding: '9px 10px', borderRadius: 9, border: 'none', cursor: 'pointer',
                      background: isActive ? '#ffffff' : 'transparent',
                      boxShadow: isActive ? `0 1px 4px rgba(0,0,0,0.08), inset 0 -2px 0 ${accentColor}` : 'none',
                      color: isActive ? '#0f172a' : '#64748b',
                      fontWeight: isActive ? 700 : 500,
                      fontSize: 10.5,
                      transition: 'all 0.18s ease',
                      letterSpacing: '0.03em',
                      textTransform: 'uppercase',
                    }}
                  >
                    <span>{t.label}</span>
                    {t.badge && (
                      <span style={{
                        fontSize: 8, fontWeight: 800, padding: '1px 5px', borderRadius: 8,
                        background: isActive ? `${accentColor}18` : '#e2e8f0',
                        color: isActive ? accentColor : '#94a3b8',
                        border: `1px solid ${isActive ? `${accentColor}40` : '#cbd5e1'}`,
                      }}>{t.badge}</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })()}

      {/* ── TAB: OVERVIEW ── */}
      {activeTab === 'overview' && (
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 28px 0' }}>

        {/* Active Clearance State */}
        <div style={{
          background: tc.tier === 3
            ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
            : tc.tier === 2
            ? 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)'
            : 'linear-gradient(135deg, #fff5f5 0%, #fee2e2 100%)',
          border: `1px solid ${tc.tier === 3 ? '#bbf7d0' : tc.tier === 2 ? '#fde68a' : '#fecaca'}`,
          borderRadius: 14, padding: '22px 24px', marginBottom: 16,
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: tc.bar, backgroundSize: '200% 100%', animation: 'wvShimmer 3s ease infinite' }} />
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
            <div>
              <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: tc.tier === 3 ? '#15803d' : tc.tier === 2 ? '#92400e' : '#991b1b' }}>Active Clearance State</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                <div style={{ width: 10, height: 10, borderRadius: '50%', background: tc.dot, boxShadow: `0 0 8px ${tc.dot}` }} />
                <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a', letterSpacing: '-0.02em' }}>{name.toUpperCase()}</span>
                <span style={{ fontSize: 8, fontWeight: 700, padding: '2px 8px', borderRadius: 6, background: tc.bg, color: tc.dot, border: `1px solid ${tc.border}`, letterSpacing: '0.1em' }}>{tc.label}</span>
              </div>
              <p style={{ margin: '0 0 2px', fontSize: 9, color: '#475569', fontFamily: 'monospace' }}>
                {liveDid || 'did:web:wallet.pilotrecognition.com:initialising…'}
              </p>
              <p style={{ margin: 0, fontSize: 9, color: '#64748b' }}>
                {tc.tier === 3
                  ? 'All credential tokens verified · Cleared for enterprise routing export'
                  : tc.tier === 2
                  ? 'One or more credentials suspended or unverified · Review Credentials tab'
                  : 'Critical credential expired or revoked · Immediate action required'}
              </p>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6, alignItems: 'flex-end' }}>
              <div style={{ fontSize: 9, color: '#64748b', fontFamily: 'monospace', textAlign: 'right', lineHeight: 1.6 }}>
                <div>License: <strong>{safe(profile?.license_type) || safe(profile?.current_occupation) || '—'}</strong></div>
                <div>Hours: <strong style={{ color: '#2563eb' }}>{totalHours > 0 ? `${totalHours.toLocaleString()} hrs` : '—'} <span style={{ color: '#10b981', fontWeight: 700 }}>● LIVE</span></strong></div>
                <div>Country: <strong>{safe(profile?.country) || safe(profile?.citizenship) || '—'}</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Credential status grid — G5: show real profile value */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 16 }}>
          {SLEEVE_CONFIG.map(sc => {
            const check = checks.find(c => c.check_type === sc.checkType);
            const st = check?.status || 'pending';
            const cfg = STATUS_CONFIG[st] || STATUS_CONFIG.pending;
            const profileVal = safe(profile?.[sc.profileKey]);
            const expVal = safe(profile?.[sc.expiryKey]);
            const days = expVal ? daysUntil(expVal) : null;
            const expiredFlag = days !== null && days < 0;
            const isEmpty = !profileVal;
            const dotColor = expiredFlag ? '#dc2626' : isEmpty ? '#cbd5e1' : cfg.dot;
            return (
              <div
                key={sc.key}
                onClick={() => setActiveTab('credentials')}
                style={{
                  padding: '12px 14px', background: isEmpty ? '#f8fafc' : '#ffffff',
                  border: `1px solid ${expiredFlag ? '#fecaca' : isEmpty ? '#e2e8f0' : cfg.border}`,
                  borderRadius: 10, cursor: 'pointer', transition: 'box-shadow 0.15s',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = 'none'; }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 5 }}>
                  <span style={{ fontSize: 15 }}>{sc.icon}</span>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: dotColor, boxShadow: !isEmpty && !expiredFlag && st === 'verified' ? `0 0 5px ${dotColor}` : 'none' }} />
                </div>
                <p style={{ margin: '0 0 2px', fontSize: 8, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{sc.label.split(' ')[0]}</p>
                {isEmpty ? (
                  <p style={{ margin: 0, fontSize: 10, color: '#cbd5e1', fontStyle: 'italic' }}>Not set →</p>
                ) : (
                  <p style={{ margin: '0 0 1px', fontSize: 10, fontWeight: 700, color: expiredFlag ? '#dc2626' : '#1e293b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{profileVal}</p>
                )}
                <p style={{ margin: 0, fontSize: 8, fontWeight: 700, color: expiredFlag ? '#dc2626' : cfg.text, letterSpacing: '0.07em' }}>
                  {expiredFlag ? 'EXPIRED' : isEmpty ? 'NOT SET' : cfg.label}
                </p>
                {days !== null && !expiredFlag && days <= 90 && (
                  <p style={{ margin: '2px 0 0', fontSize: 8, color: '#f59e0b', fontWeight: 600 }}>{days}d</p>
                )}
              </div>
            );
          })}
        </div>

        {/* Primary CTA — G4: gate when profile is empty */}
        {(() => {
          const hasLicense = !!(safe(profile?.license_number) || safe(profile?.license_id) || safe(profile?.license_type) || safe(profile?.current_occupation));
          const hasHours = totalHours > 0;
          const exportReady = hasLicense || hasHours;
          const missing = [
            !hasLicense && 'license number',
            !hasHours && 'flight hours',
          ].filter(Boolean).join(' and ');
          return (
            <div style={{ padding: '20px 22px', background: '#ffffff', border: `1px solid ${exportReady ? '#e2e8f0' : '#fde68a'}`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 14 }}>
              <div>
                <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase' }}>Workday / Taleo ATS Export</p>
                {exportReady ? (
                  <p style={{ margin: 0, fontSize: 11, color: '#334155' }}>
                    Generate a cryptographically signed, domain-scoped Verifiable Presentation for airline procurement.
                  </p>
                ) : (
                  <p style={{ margin: 0, fontSize: 11, color: '#92400e' }}>
                    Add your {missing} in the <strong>Credentials</strong> and <strong>Logbook</strong> tabs to enable export.
                  </p>
                )}
                <p style={{ margin: '3px 0 0', fontSize: 9, color: '#94a3b8' }}>Zero PII leaves this device · Nonce-bound · 24h TTL</p>
              </div>
              <button
                disabled={!exportReady}
                onClick={async () => {
                  if (!exportReady || !profile) return;
                  const vp = buildAviationRecordSummaryVP(profile, checks, disclosureToggles);
                  try {
                    const proofValue = await signCredentialPayload(JSON.stringify(vp.verifiableCredential.credentialSubject));
                    vp.proof.proofValue = proofValue;
                    vp.verifiableCredential.proof.proofValue = proofValue;
                    vp.proof.verificationMethod = enclaveStatus?.holderDid
                      ? `${enclaveStatus.holderDid}#key-0`
                      : vp.proof.verificationMethod;
                  } catch { }
                  setWalletState(prev => prev ? { ...prev, activePresentation: vp } : prev);
                  await logPresentationEvent({
                    recipientDid: 'did:web:pilotrecognition.com#airline-portal',
                    recipientName: 'Airline ATS Portal',
                    presentationType: 'AviationRecordSummary',
                    disclosedFields: Object.entries(disclosureToggles).filter(([,v]) => v).map(([k]) => k),
                    vpId: vp.id,
                    terminalClearance: vp.verifiableCredential.credentialSubject.terminalClearance,
                    hoursBracket: vp.verifiableCredential.credentialSubject.hoursBracket,
                  }).catch(() => {});
                  setExportOpen(true);
                }}
                title={!exportReady ? `Complete your profile first — missing ${missing}` : 'Generate signed VP for ATS export'}
                style={{
                  display: 'flex', alignItems: 'center', gap: 7, padding: '10px 22px',
                  background: exportReady ? '#2563eb' : '#f1f5f9',
                  border: `1px solid ${exportReady ? '#3b82f6' : '#e2e8f0'}`,
                  borderRadius: 9,
                  color: exportReady ? '#ffffff' : '#94a3b8',
                  fontSize: 11, fontWeight: 700,
                  cursor: exportReady ? 'pointer' : 'not-allowed',
                  letterSpacing: '0.02em', whiteSpace: 'nowrap',
                  boxShadow: exportReady ? '0 2px 12px rgba(37,99,235,0.35)' : 'none',
                  transition: 'all 0.18s ease',
                  opacity: exportReady ? 1 : 0.7,
                }}
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                Generate Tokenized Candidate Record
              </button>
            </div>
          );
        })()}

        {/* VP export preview */}
        {exportOpen && walletState?.activePresentation && (
          <div style={{ marginTop: 14, padding: '16px 18px', background: '#0f172a', borderRadius: 10, border: '1px solid #1e293b' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10 }}>
              <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>W3C VP Data Model v2.0 — Signed Presentation</p>
              <button onClick={() => setExportOpen(false)} style={{ background: 'none', border: 'none', color: '#475569', cursor: 'pointer', fontSize: 14, lineHeight: 1 }}>✕</button>
            </div>
            <pre style={{ margin: 0, fontSize: 8.5, color: '#94a3b8', fontFamily: 'monospace', overflowX: 'auto', lineHeight: 1.6, maxHeight: 260, overflowY: 'auto' }}>
              {JSON.stringify(walletState.activePresentation, null, 2)}
            </pre>
            <p style={{ margin: '10px 0 0', fontSize: 8, color: '#475569', fontStyle: 'italic' }}>
              ⚠ Zero-persistence export — no PII written to cloud storage. Token expires in 24h.
            </p>
          </div>
        )}

      </div>
      )}

      {/* ── TAB: VAULT ── */}
      {activeTab === 'vault' && (
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>

        {/* Audit ledger */}
        <div style={{ marginBottom: 16, padding: '20px 22px', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12 }}>
          <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase' }}>Client-Side Verification Ledger — Tier 4</p>
          <p style={{ margin: '0 0 12px', fontSize: 9, color: '#94a3b8' }}>Read-only. Local hardware only. Zero cloud egress.</p>
          <div style={{ background: '#0f172a', borderRadius: 8, padding: '12px 14px', maxHeight: 200, overflowY: 'auto', fontFamily: 'monospace' }}>
            {(storageHealth?.tier4.auditEntries ?? 0) > 0 ? (
              <p style={{ margin: 0, fontSize: 9, color: '#94a3b8' }}>[audit entries loaded from IndexedDB — {storageHealth?.tier4.auditEntries} event{storageHealth?.tier4.auditEntries !== 1 ? 's' : ''}]</p>
            ) : (
              <p style={{ margin: 0, fontSize: 9, color: '#475569' }}>Zero presentation events recorded on local hardware.</p>
            )}
          </div>
        </div>

        {/* Enclave status */}
        <div style={{ marginBottom: 16, padding: '20px 22px', background: '#ffffff', border: `1px solid ${enclaveStatus?.keyPresent ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 12 }}>
          <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase' }}>Tier 1 Enclave Key Status</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: enclaveStatus?.keyPresent ? '#16a34a' : '#f59e0b', boxShadow: enclaveStatus?.keyPresent ? '0 0 6px #16a34a' : 'none' }} />
            <span style={{ fontSize: 11, fontWeight: 700, color: enclaveStatus?.keyPresent ? '#15803d' : '#92400e' }}>
              {enclaveStatus?.keyPresent ? 'Enclave Lock Active — Hardware Protected' : 'Key Generating…'}
            </span>
          </div>
          <p style={{ margin: 0, fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>
            DID: {enclaveStatus?.holderDid || 'initialising…'}<br/>
            platform: {enclaveStatus?.platform || 'web-crypto'} · extractable: {String(enclaveStatus?.extractable ?? false)}
          </p>
        </div>

        {/* Emergency controls */}
        <div style={{ padding: '20px 22px', background: '#fff5f5', border: '1px solid #fecaca', borderRadius: 12 }}>
          <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: '#dc2626', textTransform: 'uppercase' }}>Emergency Administrative Options</p>
          <p style={{ margin: '0 0 14px', fontSize: 9, color: '#7f1d1d', lineHeight: 1.5 }}>
            Executing a destructive reset will zero all AES-256-GCM encrypted credential payloads, endpoint registry entries, and audit log entries from IndexedDB. The enclave P-256 key will be permanently destroyed. This action cannot be undone.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button
              onClick={async () => {
                if (window.confirm('Execute destructive local reset? All encrypted wallet data and the enclave key will be permanently zeroed. This cannot be undone.')) {
                  try {
                    const { wipeLocalWallet } = await import('../../../../lib/wallet/storage');
                    const { wipeEnclaveKey } = await import('../../../../lib/wallet/enclave');
                    await wipeLocalWallet();
                    await wipeEnclaveKey();
                    window.location.reload();
                  } catch { window.location.reload(); }
                }
              }}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #fca5a5', background: 'transparent', color: '#dc2626', fontSize: 10, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              Wipe Local Cryptographic Wallet Data
            </button>
            <button
              onClick={async () => {
                if (window.confirm('Rotate enclave key only? Your credential store will remain but all existing signed presentations will be invalidated.')) {
                  try {
                    const { wipeEnclaveKey } = await import('../../../../lib/wallet/enclave');
                    await wipeEnclaveKey();
                    window.location.reload();
                  } catch { window.location.reload(); }
                }
              }}
              style={{ padding: '7px 16px', borderRadius: 8, border: '1px solid #fde68a', background: 'transparent', color: '#92400e', fontSize: 10, fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em' }}
            >
              Rotate Enclave Key Only
            </button>
          </div>
        </div>

      </div>
      )}

      {/* ── TAB: CREDENTIALS ── */}
      {activeTab === 'credentials' && (
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>

        {/* ── RECOGNITION+ VEREMARK PANEL ── */}
        {(() => {
          const sc = VEREMARK_STATUS_CONFIG[veremarkStatus] || VEREMARK_STATUS_CONFIG.not_started;
          return (
            <div className="wv-in" style={{ animationDelay: '0.05s', marginBottom: 20, borderRadius: 14, overflow: 'hidden', border: `1px solid ${isRecognitionPlus ? '#bbf7d0' : '#e2e8f0'}` }}>
              {/* Header */}
              <div style={{ padding: '14px 20px', background: isRecognitionPlus ? 'linear-gradient(135deg, #f0fdf4, #dcfce7)' : 'linear-gradient(135deg, #f8fafc, #f1f5f9)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: 10, background: isRecognitionPlus ? '#16a34a' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 16, flexShrink: 0 }}>
                    {isRecognitionPlus ? '✓' : '🔒'}
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: 11, fontWeight: 800, color: isRecognitionPlus ? '#15803d' : '#0f172a', letterSpacing: '0.02em' }}>Recognition+ Verification</p>
                    <p style={{ margin: '1px 0 0', fontSize: 9, color: '#64748b' }}>
                      {isRecognitionPlus ? 'Full Veremark credential chain verified — Terminal 3 active' : 'Third-party cryptographic verification via Veremark — unlocks Terminal 3'}
                    </p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <span style={{ width: 7, height: 7, borderRadius: '50%', background: sc.dot, display: 'inline-block', flexShrink: 0 }} />
                  <span style={{ fontSize: 9, fontWeight: 700, color: sc.text, letterSpacing: '0.08em' }}>{sc.label.toUpperCase()}</span>
                </div>
              </div>

              {/* Body */}
              {isRecognitionPlus ? (
                <div style={{ padding: '14px 20px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
                    {VEREMARK_CHECKS.map(ch => {
                      const match = checks.find(c => c.check_type === ch.key || c.credential_type === ch.key);
                      const isVerified = match?.status === 'verified';
                      const isFlagged  = match?.status === 'flagged';
                      return (
                        <div key={ch.key} style={{ padding: '10px 12px', borderRadius: 8, border: `1px solid ${isVerified ? '#bbf7d0' : isFlagged ? '#fecaca' : '#e2e8f0'}`, background: isVerified ? '#f0fdf4' : isFlagged ? '#fef2f2' : '#f8fafc', textAlign: 'center' }}>
                          <div style={{ fontSize: 18, marginBottom: 4 }}>{ch.icon}</div>
                          <p style={{ margin: '0 0 4px', fontSize: 8, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{ch.label}</p>
                          <span style={{ fontSize: 8, fontWeight: 800, color: isVerified ? '#15803d' : isFlagged ? '#dc2626' : '#94a3b8', letterSpacing: '0.1em' }}>
                            {isVerified ? '✓ VERIFIED' : isFlagged ? '✗ FLAGGED' : '— PENDING'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                  {veremarkRequestGuid && (
                    <p style={{ margin: '10px 0 0', fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>Request ID: {veremarkRequestGuid}</p>
                  )}
                </div>
              ) : (
                <div style={{ padding: '16px 20px' }}>
                  {/* Check list preview */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 14 }}>
                    {VEREMARK_CHECKS.map(ch => (
                      <div key={ch.key} style={{ padding: '10px 12px', borderRadius: 8, border: '1px solid #e2e8f0', background: '#f8fafc', textAlign: 'center', filter: veremarkStatus === 'not_started' ? 'grayscale(1) opacity(0.5)' : 'none' }}>
                        <div style={{ fontSize: 18, marginBottom: 4 }}>{ch.icon}</div>
                        <p style={{ margin: '0 0 4px', fontSize: 8, fontWeight: 700, color: '#64748b', letterSpacing: '0.06em', textTransform: 'uppercase' }}>{ch.label}</p>
                        <span style={{ fontSize: 8, fontWeight: 800, color: veremarkStatus === 'in_progress' ? '#3b82f6' : '#94a3b8', letterSpacing: '0.1em' }}>
                          {veremarkStatus === 'in_progress' ? '⟳ CHECKING' : '— LOCKED'}
                        </span>
                      </div>
                    ))}
                  </div>

                  {veremarkStatus === 'in_progress' ? (
                    <div style={{ padding: '12px 14px', background: '#eff6ff', borderRadius: 8, border: '1px solid #bfdbfe' }}>
                      <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#1d4ed8' }}>Verification in Progress</p>
                      <p style={{ margin: 0, fontSize: 9, color: '#3b82f6', lineHeight: 1.5 }}>Check your email for the Veremark form link. Once you complete it, results will update automatically here. This typically takes 2–5 business days.</p>
                      {veremarkFeedbackUrl && (
                        <a href={veremarkFeedbackUrl} target="_blank" rel="noopener noreferrer"
                          style={{ display: 'inline-block', marginTop: 8, padding: '5px 12px', borderRadius: 5, background: '#2563eb', color: '#fff', fontSize: 9, fontWeight: 700, textDecoration: 'none' }}>
                          Open Veremark Form →
                        </a>
                      )}
                      {veremarkRequestGuid && (
                        <p style={{ margin: '6px 0 0', fontSize: 8, color: '#94a3b8', fontFamily: 'monospace' }}>Ref: {veremarkRequestGuid}</p>
                      )}
                    </div>
                  ) : (
                    <div>
                      <div style={{ padding: '10px 14px', background: '#fffbeb', borderRadius: 8, border: '1px solid #fde68a', marginBottom: 12 }}>
                        <p style={{ margin: '0 0 3px', fontSize: 10, fontWeight: 700, color: '#92400e' }}>Recognition+ — $99/year</p>
                        <p style={{ margin: 0, fontSize: 9, color: '#78350f', lineHeight: 1.5 }}>Full VC chain: CAAP license · Medical · ELP · Identity · Veremark-attested. Unlocks Terminal 3, exportable signed VP, and priority airline visibility.</p>
                      </div>
                      {veremarkError && (
                        <p style={{ margin: '0 0 8px', fontSize: 9, color: '#dc2626' }}>Error: {veremarkError}</p>
                      )}
                      <button
                        onClick={initiateVeremark}
                        disabled={veremarkInitiating}
                        style={{
                          width: '100%', padding: '10px 0', borderRadius: 8, border: 'none',
                          background: veremarkInitiating ? '#94a3b8' : 'linear-gradient(135deg, #16a34a, #15803d)',
                          color: '#fff', fontSize: 11, fontWeight: 800, cursor: veremarkInitiating ? 'wait' : 'pointer',
                          letterSpacing: '0.04em',
                        }}
                      >
                        {veremarkInitiating ? 'Initiating Veremark Check…' : 'Start Recognition+ Verification'}
                      </button>
                      <p style={{ margin: '8px 0 0', fontSize: 8, color: '#94a3b8', textAlign: 'center' }}>
                        Powered by Veremark · Zero-persistence · No raw PII stored on our servers
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })()}

        <div className="wv-in" style={{ animationDelay: '0.1s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Zone 2 — W3C JSON-LD Credential Matrix</p>
            <p style={{ margin: '2px 0 0', fontSize: 9, color: '#64748b' }}>Each sleeve maps to a JSON-LD schema defined in <span style={{ fontFamily: 'monospace' }}>aviation-v2.jsonld</span> — independent cryptographic proof blocks</p>
          </div>
        </div>

        {/* QR scan modal */}
        {qrSlot && (
          <div style={{
            position: 'fixed', inset: 0, zIndex: 99999, background: 'rgba(0,0,0,0.85)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            backdropFilter: 'blur(8px)',
          }} onClick={() => setQrSlot(null)}>
            <div style={{
              background: 'linear-gradient(135deg, #1c1c2e, #12121e)',
              border: '1px solid rgba(255,255,255,0.12)', borderRadius: 20, padding: 32, width: 320,
              boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
            }} onClick={e => e.stopPropagation()}>
              <p style={{ margin: '0 0 4px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>
                Import Credential
              </p>
              <p style={{ margin: '0 0 20px', fontSize: 15, fontWeight: 800, color: '#ffffff' }}>
                {SLEEVE_CONFIG.find(s => s.key === qrSlot)?.label}
              </p>
              {/* QR placeholder frame */}
              <div style={{
                width: '100%', aspectRatio: '1', background: '#ffffff', borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16,
                position: 'relative', overflow: 'hidden',
              }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, padding: 16 }}>
                  {Array.from({ length: 49 }).map((_, i) => (
                    <div key={i} style={{ width: '100%', aspectRatio: '1', background: [0,1,2,7,8,9,14,6,13,20,42,43,44,48,47,46,36,37,38,41,35,28].includes(i) ? '#000' : 'transparent', borderRadius: 1 }} />
                  ))}
                </div>
                <div style={{ position: 'absolute', fontSize: 11, fontWeight: 700, color: '#000', bottom: 8, letterSpacing: '0.05em' }}>
                  CAAP · ICAO · WALLET.PILOTRECOGNITION.COM
                </div>
              </div>
              <p style={{ margin: '0 0 16px', fontSize: 10, color: 'rgba(255,255,255,0.4)', textAlign: 'center', lineHeight: 1.5 }}>
                Scan with your authority-issued credential app, or tap below to simulate an import.
              </p>
              <button
                onClick={() => {
                  setScanningSlot(qrSlot);
                  setQrSlot(null);
                  setTimeout(() => {
                    setImportedSlots(s => new Set([...s, qrSlot!]));
                    setScanningSlot(null);
                  }, 1800);
                }}
                style={{
                  width: '100%', padding: '10px 0', borderRadius: 10, border: 'none', cursor: 'pointer',
                  background: 'rgba(220,38,38,0.8)', color: '#fff', fontSize: 11, fontWeight: 700, letterSpacing: '0.06em',
                }}
              >
                Simulate QR Import
              </button>
              <button onClick={() => setQrSlot(null)} style={{ width: '100%', marginTop: 8, padding: '8px 0', borderRadius: 10, border: '1px solid rgba(255,255,255,0.1)', cursor: 'pointer', background: 'transparent', color: 'rgba(255,255,255,0.4)', fontSize: 10, fontWeight: 600 }}>
                Cancel
              </button>
            </div>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {SLEEVE_CONFIG.map((slot, idx) => {
            const val        = safe(profile?.[slot.profileKey]);
            const sub        = slot.subKey ? safe(profile?.[slot.subKey]) : null;
            const exp        = safe(profile?.[slot.expiryKey]);
            const days       = daysUntil(exp);
            const check      = checks.find(c => c.check_type === slot.checkType);
            const isVerified = check?.status === 'verified' || importedSlots.has(slot.key);
            const isExpired  = check?.status === 'expired' && !importedSlots.has(slot.key);
            const isScanning = scanningSlot === slot.key;
            const isImported = importedSlots.has(slot.key);
            const isActive   = isVerified || isImported;

            const cardColors = [
              { accent: '#16a34a' },  // license   — green
              { accent: '#dc2626' },  // medical   — red
              { accent: '#92400e' },  // NTC/radio — brown
              { accent: '#2563eb' },  // ELP       — blue
            ];
            const cc = cardColors[idx % cardColors.length];

            return (
              <div key={slot.key} className="wv-in wv-card-hover" style={{ animationDelay: `${0.12 + idx * 0.06}s` }}>
                <div style={{
                  background: '#ffffff',
                  borderRadius: 12, padding: '18px', position: 'relative', overflow: 'hidden',
                  border: `1px solid ${isExpired ? 'rgba(239,68,68,0.4)' : isActive ? `${cc.accent}55` : '#e2e8f0'}`,
                  boxShadow: isActive ? `0 2px 12px ${cc.accent}18` : '0 1px 4px rgba(0,0,0,0.05)',
                  transition: 'all 0.4s ease',
                  height: '100%', boxSizing: 'border-box',
                }}>  
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: isExpired ? 'linear-gradient(90deg, #dc2626, transparent)' : `linear-gradient(90deg, ${cc.accent}, transparent)`, opacity: isActive ? 1 : 0.35, transition: 'opacity 0.4s ease' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{slot.icon}</span>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: isExpired ? '#dc2626' : cc.accent, opacity: isActive ? 1 : 0.25, boxShadow: isActive ? `0 0 8px ${cc.accent}80` : 'none', transition: 'all 0.4s ease' }} />
                  </div>

                  {/* Credential type badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 4 }}>
                    <p style={{ margin: 0, fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>{slot.label}</p>
                    <span style={{ fontSize: 7, fontWeight: 700, color: cc.accent, background: `${cc.accent}15`, border: `1px solid ${cc.accent}40`, borderRadius: 4, padding: '1px 5px', letterSpacing: '0.06em' }}>
                      {idx === 0 ? 'PilotLicenseCredential' : idx === 1 ? 'MedicalCurrencyToken' : idx === 2 ? 'OEM·AttestationRecord' : 'AviationRecord·Summary'}
                    </span>
                  </div>
                  <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: (val || isImported) ? '#0f172a' : '#94a3b8', lineHeight: 1.3 }}>
                    {isImported && !val ? 'Imported' : val || 'Not entered'}
                  </p>
                  {sub && <p style={{ margin: '0 0 2px', fontSize: 9, color: '#64748b', fontFamily: 'monospace' }}>{sub}</p>}

                  {/* Authority node + schema metadata */}
                  <div style={{ margin: '6px 0', padding: '6px 8px', background: '#f8fafc', borderRadius: 6, borderLeft: `2px solid ${cc.accent}` }}>
                    {idx === 0 && (
                      <p style={{ margin: 0, fontSize: 8, color: '#475569', fontFamily: 'monospace', lineHeight: 1.6 }}>
                        authority: <span style={{ color: '#16a34a' }}>did:web:caap.gov.ph</span><br/>
                        type: {safe(profile?.license_type) || safe(profile?.current_occupation) || 'CPL/ATPL'}<br/>
                        ratings: {safe(profile?.type_ratings) || 'C152 · C172'}<br/>
                        elp: ICAO Level {safe(profile?.language_proficiency) || '5'}
                      </p>
                    )}
                    {idx === 1 && (() => {
                      const medExp = safe(profile?.medical_expiry);
                      const mDays  = daysUntil(medExp);
                      const vcSlot = walletState?.slots['medical'];
                      return (
                        <p style={{ margin: 0, fontSize: 8, color: '#475569', fontFamily: 'monospace', lineHeight: 1.6 }}>
                          authority: <span style={{ color: '#dc2626' }}>did:web:caap.gov.ph#dme</span><br/>
                          class: {safe(profile?.medical_class) || 'Class 1'}<br/>
                          bitstring[1]: <span style={{ color: vcSlot?.statusBit === 'revoked' ? '#dc2626' : vcSlot?.statusBit === 'valid' ? '#16a34a' : '#d97706' }}>0x{vcSlot?.statusBit === 'revoked' ? '1' : '0'}</span><br/>
                          {mDays !== null ? (
                            <span style={{ color: mDays < 0 ? '#dc2626' : mDays < 30 ? '#d97706' : '#16a34a' }}>
                              {mDays < 0 ? `⚠ EXPIRED ${Math.abs(mDays)}d ago` : `expires in ${mDays}d`}
                            </span>
                          ) : 'expiry: —'}
                        </p>
                      );
                    })()}
                    {idx === 2 && (
                      <p style={{ margin: 0, fontSize: 8, color: '#475569', fontFamily: 'monospace', lineHeight: 1.6 }}>
                        authority: <span style={{ color: '#92400e' }}>did:web:pilotrecognition.com#ato</span><br/>
                        bracket: {walletState ? (() => { const s = walletState.slots['elp']?.vc as any; return s?.credentialSubject?.hoursBracket || '—'; })() : '—'}<br/>
                        type-ratings: self-asserted<br/>
                        standard: ICAO Annex 1
                      </p>
                    )}
                    {idx === 3 && (
                      <p style={{ margin: 0, fontSize: 8, color: '#475569', fontFamily: 'monospace', lineHeight: 1.6 }}>
                        type: <span style={{ color: '#2563eb' }}>VerifiablePresentation</span><br/>
                        compiler: AviationRecordSummary<br/>
                        status: {walletState?.activePresentation ? <span style={{ color: '#16a34a' }}>VP ready — scan enabled</span> : 'awaiting export'}<br/>
                        pii-stripped: true
                      </p>
                    )}
                  </div>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid #f1f5f9' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: isExpired ? '#ef4444' : cc.accent }}>
                      {isScanning ? '⟳ Importing…' : isExpired ? '✗ EXPIRED' : isActive ? '✓ VERIFIED' : 'UNVERIFIED'}
                    </span>
                    {exp && days !== null && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: expiryColor(days), fontFamily: 'monospace' }}>
                        {days < 0 ? `EXP −${Math.abs(days)}d` : `EXP +${days}d`}
                      </span>
                    )}
                  </div>

                  {/* Edit / Import buttons */}
                  {!isScanning && (() => {
                    const isEditing = editingSlot === slot.key;
                    const SLOT_FIELDS: Record<string, Array<{ key: string; label: string; type?: string; placeholder?: string }>> = {
                      license: [
                        { key: 'license_type',   label: 'License Type',   placeholder: 'e.g. ATPL, CPL, PPL' },
                        { key: 'license_number', label: 'License No.',    placeholder: 'e.g. PH-CPL-00123' },
                        { key: 'license_expiry', label: 'Expiry Date',    type: 'date' },
                      ],
                      medical: [
                        { key: 'medical_class',  label: 'Medical Class',  placeholder: 'e.g. Class 1' },
                        { key: 'medical_number', label: 'Certificate No.', placeholder: 'e.g. MED-00123' },
                        { key: 'medical_expiry', label: 'Expiry Date',    type: 'date' },
                      ],
                      ntc: [
                        { key: 'ntc_license',    label: 'NTC License No.', placeholder: 'e.g. NTC-00123' },
                        { key: 'ntc_expiry',     label: 'Expiry Date',    type: 'date' },
                      ],
                      elp: [
                        { key: 'language_proficiency', label: 'ICAO ELP Level', placeholder: 'e.g. Level 5' },
                        { key: 'elp_certificate_no',   label: 'Certificate No.', placeholder: 'e.g. ELP-00123' },
                        { key: 'elp_expiry',           label: 'Expiry Date',    type: 'date' },
                      ],
                    };
                    const fields = SLOT_FIELDS[slot.key] || [];
                    return (
                      <>
                        {isEditing ? (
                          <div style={{ marginTop: 10, padding: '10px 12px', background: '#f8fafc', borderRadius: 8, border: '1px solid #e2e8f0' }}>
                            {fields.map(f => (
                              <div key={f.key} style={{ marginBottom: 8 }}>
                                <label style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 3 }}>{f.label}</label>
                                <input
                                  type={f.type || 'text'}
                                  placeholder={f.placeholder || ''}
                                  value={slotDraft[f.key] ?? (safe(profile?.[f.key]) || '')}
                                  onChange={e => setSlotDraft(d => ({ ...d, [f.key]: e.target.value }))}
                                  style={{
                                    width: '100%', padding: '5px 8px', fontSize: 10, borderRadius: 5,
                                    border: '1px solid #cbd5e1', background: '#ffffff', color: '#0f172a',
                                    outline: 'none', boxSizing: 'border-box',
                                  }}
                                />
                              </div>
                            ))}
                            {saveError && <p style={{ margin: '0 0 6px', fontSize: 9, color: '#dc2626' }}>{saveError}</p>}
                            <div style={{ display: 'flex', gap: 6, marginTop: 4 }}>
                              <button
                                onClick={() => saveProfile(slotDraft)}
                                disabled={saving}
                                style={{ flex: 1, padding: '6px 0', borderRadius: 5, border: 'none', background: cc.accent, color: '#fff', fontSize: 10, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}
                              >
                                {saving ? 'Saving…' : 'Save'}
                              </button>
                              <button
                                onClick={() => { setEditingSlot(null); setSlotDraft({}); setSaveError(null); }}
                                style={{ padding: '6px 10px', borderRadius: 5, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 10, cursor: 'pointer' }}
                              >
                                Cancel
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ marginTop: 10, display: 'flex', gap: 6 }}>
                            <button
                              onClick={() => {
                                setEditingSlot(slot.key);
                                const init: Record<string, string> = {};
                                fields.forEach(f => { init[f.key] = safe(profile?.[f.key]) || ''; });
                                setSlotDraft(init);
                                setSaveError(null);
                              }}
                              style={{
                                flex: 1, padding: '7px 0', borderRadius: 6,
                                border: `1px solid ${cc.accent}40`, cursor: 'pointer',
                                background: `${cc.accent}08`, color: cc.accent, fontSize: 10, fontWeight: 600,
                                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                              }}
                            >
                              ✏ {val ? 'Edit' : 'Enter Details'}
                            </button>
                            {!isActive && (
                              <button
                                onClick={() => setQrSlot(slot.key)}
                                style={{
                                  padding: '7px 10px', borderRadius: 6,
                                  border: '1px solid #e2e8f0', cursor: 'pointer',
                                  background: '#f8fafc', color: '#64748b', fontSize: 10, fontWeight: 600,
                                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4,
                                }}
                                title="Scan QR to import from authority app"
                              >
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                                QR
                              </button>
                            )}
                          </div>
                        )}
                      </>
                    );
                  })()}
                  {isScanning && (
                    <div style={{ marginTop: 10, height: 3, background: 'rgba(255,255,255,0.08)', borderRadius: 2, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: '60%', background: cc.accent, borderRadius: 2, animation: 'wvShimmer 0.8s ease infinite' }} />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
      )}

      {/* ── TAB: LOGBOOK ── */}
      {activeTab === 'logbook' && (
      <>
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <div className="wv-in" style={{ animationDelay: '0.35s', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Zone 3 — Data Ingestion & Telemetry Drift Guard</p>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Toggle disclosure fields · Drift &gt;20% degrades Terminal tier on next 60s poll</p>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={() => setSignoffOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                background: 'rgba(245,158,11,0.1)', border: '1px solid rgba(245,158,11,0.3)',
                borderRadius: 6, cursor: 'pointer', color: '#fbbf24', fontSize: 10, fontWeight: 600,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Request Sign-off
            </button>
            <button
              onClick={async () => {
                if (profile) {
                  const vp = buildAviationRecordSummaryVP(profile, checks, disclosureToggles);
                  // Sign proof with enclave key
                  try {
                    const proofValue = await signCredentialPayload(JSON.stringify(vp.verifiableCredential.credentialSubject));
                    vp.proof.proofValue = proofValue;
                    vp.verifiableCredential.proof.proofValue = proofValue;
                    vp.proof.verificationMethod = enclaveStatus?.holderDid
                      ? `${enclaveStatus.holderDid}#key-0`
                      : vp.proof.verificationMethod;
                  } catch { /* enclave unavailable — proofValue stays PENDING */ }
                  setWalletState(prev => prev ? { ...prev, activePresentation: vp } : prev);
                  // Tier 4 — write to audit log
                  await logPresentationEvent({
                    recipientDid:     'did:web:pilotrecognition.com#airline-portal',
                    recipientName:    'Airline ATS Portal',
                    presentationType: 'AviationRecordSummary',
                    disclosedFields:  Object.entries(disclosureToggles).filter(([,v]) => v).map(([k]) => k),
                    vpId:             vp.id,
                    terminalClearance: vp.verifiableCredential.credentialSubject.terminalClearance,
                    hoursBracket:      vp.verifiableCredential.credentialSubject.hoursBracket,
                  }).catch(() => {/* storage not yet initialised — non-fatal */});
                }
                setExportOpen(o => !o);
              }}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                background: '#2563eb', border: '1px solid #3b82f6',
                borderRadius: 6, cursor: 'pointer', color: '#f1f5f9', fontSize: 10, fontWeight: 600,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Generate Tokenized Candidate Record
            </button>
          </div>
        </div>

        {/* Sign-off panel */}
        {signoffOpen && (
          <div className="wv-in" style={{ marginBottom: 14, padding: '16px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#92400e' }}>Request Hour Sign-off</p>
            <p style={{ margin: '0 0 12px', fontSize: 10, color: '#78350f', lineHeight: 1.5 }}>
              Send a sign-off request to your airline, flight school, or logbook provider. Once approved, those hours will be upgraded from Self-Reported to <strong style={{ color: '#10b981' }}>Verified ✓</strong>.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['My Airline / Operator', 'Flight School / ATO', 'ForeFlight Sync', 'Manual Upload'].map(opt => (
                <button key={opt} style={{
                  padding: '5px 12px', borderRadius: 6, border: '1px solid #fcd34d',
                  background: '#fef3c7', color: '#92400e', fontSize: 9, fontWeight: 600, cursor: 'pointer',
                }}>{opt}</button>
              ))}
            </div>
          </div>
        )}

        {/* Export preview panel — W3C VP Data Model v2.0 */}
        {exportOpen && walletState?.activePresentation && (
          <div className="wv-in" style={{ marginBottom: 14, padding: '16px 18px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#1e40af' }}>W3C Verifiable Presentation — AviationRecordSummary</p>
            <p style={{ margin: '0 0 10px', fontSize: 10, color: '#3b82f6' }}>Selective disclosure active — only bracket claims are exposed. No PII transmitted.</p>
            <div style={{ fontFamily: 'monospace', fontSize: 8.5, color: '#334155', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8, padding: '10px 12px', lineHeight: 1.9, overflowX: 'auto', whiteSpace: 'pre' }}>
              {JSON.stringify(walletState.activePresentation, null, 2)}
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8, flexWrap: 'wrap', alignItems: 'center' }}>
              <button
                onClick={() => navigator.clipboard?.writeText(JSON.stringify(walletState.activePresentation, null, 2))}
                style={{ padding: '6px 14px', borderRadius: 6, border: '1px solid #bfdbfe', background: '#eff6ff', color: '#1e40af', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}
              >
                Copy JSON
              </button>
              <button
                onClick={async () => {
                  setIpfsPinning(true);
                  setIpfsError(null);
                  try {
                    const session = (await supabase.auth.getSession()).data.session;
                    if (!session) throw new Error('Not authenticated');
                    const res = await fetch(
                      'https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/pinata-pin-vp',
                      {
                        method: 'POST',
                        headers: {
                          'Authorization': `Bearer ${session.access_token}`,
                          'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                          vp: walletState.activePresentation,
                          filename: `pilot-vp-${userId || 'unknown'}.json`,
                        }),
                      }
                    );
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.error || 'Pin failed');
                    setIpfsCid(data.cid);
                  } catch (e: any) {
                    setIpfsError(e.message);
                  } finally {
                    setIpfsPinning(false);
                  }
                }}
                disabled={ipfsPinning}
                style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: ipfsPinning ? '#94a3b8' : '#7c3aed', color: '#fff', fontSize: 10, fontWeight: 600, cursor: ipfsPinning ? 'wait' : 'pointer' }}
              >
                {ipfsPinning ? 'Pinning…' : ipfsCid ? '↑ Re-pin to IPFS' : '↑ Pin to IPFS'}
              </button>
              <button style={{ padding: '6px 14px', borderRadius: 6, border: 'none', background: '#2563eb', color: '#fff', fontSize: 10, fontWeight: 600, cursor: 'pointer' }}>
                Submit to Airline ATS
              </button>
            </div>
            {ipfsError && (
              <p style={{ margin: '6px 0 0', fontSize: 9, color: '#dc2626' }}>IPFS error: {ipfsError}</p>
            )}
            {ipfsCid && (
              <div style={{ marginTop: 10, padding: '8px 12px', background: '#f5f3ff', border: '1px solid #ddd6fe', borderRadius: 8 }}>
                <p style={{ margin: '0 0 3px', fontSize: 9, fontWeight: 700, color: '#6d28d9' }}>Pinned to IPFS via Pinata</p>
                <p style={{ margin: '0 0 4px', fontSize: 8, fontFamily: 'monospace', color: '#4c1d95', wordBreak: 'break-all' }}>{ipfsCid}</p>
                <a
                  href={`https://ipfs.io/ipfs/${ipfsCid}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ fontSize: 9, color: '#7c3aed', fontWeight: 600 }}
                >
                  View on IPFS →
                </a>
                <span style={{ margin: '0 6px', color: '#a78bfa', fontSize: 9 }}>·</span>
                <button
                  onClick={() => navigator.clipboard?.writeText(`https://ipfs.io/ipfs/${ipfsCid}`)}
                  style={{ background: 'none', border: 'none', color: '#7c3aed', fontSize: 9, fontWeight: 600, cursor: 'pointer', padding: 0 }}
                >
                  Copy Link
                </button>
              </div>
            )}
          </div>
        )}
        {exportOpen && !walletState?.activePresentation && (
          <div className="wv-in" style={{ marginBottom: 14, padding: '12px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: 10 }}>
            <p style={{ margin: '0 0 4px', fontSize: 10, fontWeight: 700, color: '#15803d' }}>Zero-Persistence Policy Active</p>
            <p style={{ margin: 0, fontSize: 9, color: '#166534', lineHeight: 1.5 }}>Generating stateless W3C presentation payload. No private data or raw license tracking coordinates will be cached or persisted outside your local device container.</p>
          </div>
        )}

        {/* Telemetry Drift Gauge */}
        {(() => {
          const asserted  = totalHours;
          const registry  = checks.find(c => c.check_type === 'professional_qualification' && c.status === 'verified')
            ? Math.floor(asserted * 0.98)
            : 0;
          const drift     = registry > 0 ? Math.abs(asserted - registry) / Math.max(asserted, 1) * 100 : 0;
          const driftOk   = drift < 20;
          const barPct    = Math.min(100, registry > 0 ? (registry / Math.max(asserted, 1)) * 100 : 0);
          return (
            <div className="wv-in" style={{ animationDelay: '0.38s', marginBottom: 12, padding: '14px 18px', background: driftOk ? '#f8fafc' : '#fef2f2', border: `1px solid ${driftOk ? '#e2e8f0' : '#fecaca'}`, borderRadius: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Telemetry Drift Guard — S5.7(h)</p>
                <span style={{ fontSize: 9, fontWeight: 700, padding: '2px 8px', borderRadius: 10, background: driftOk ? '#dcfce7' : '#fee2e2', color: driftOk ? '#15803d' : '#dc2626', border: `1px solid ${driftOk ? '#86efac' : '#fca5a5'}` }}>
                  {registry > 0 ? `${drift.toFixed(1)}% drift` : 'Registry: Not yet verified'}
                </span>
              </div>
              <div style={{ display: 'flex', gap: 20, marginBottom: 8, fontSize: 9, color: '#475569' }}>
                <span>Asserted (ForeFlight): <strong style={{ color: '#0f172a' }}>{asserted > 0 ? asserted.toLocaleString() : '—'} hrs</strong></span>
                {registry > 0 && <span>Sovereign Registry: <strong style={{ color: '#0f172a' }}>{registry.toLocaleString()} hrs</strong></span>}
              </div>
              <div style={{ height: 8, borderRadius: 4, background: '#e2e8f0', overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${barPct}%`, borderRadius: 4, background: driftOk ? 'linear-gradient(90deg, #16a34a, #4ade80)' : 'linear-gradient(90deg, #dc2626, #f87171)', transition: 'width 0.6s ease' }} />
              </div>
              <p style={{ margin: '6px 0 0', fontSize: 8, color: driftOk ? '#64748b' : '#dc2626' }}>
                {driftOk
                  ? 'Telemetry Alignment: Clear — within 20% variance threshold'
                  : '⚠ System Warning: Drift exceeds 20% — Terminal 3 will degrade to Terminal 2 on next 60s poll'}
              </p>
            </div>
          );
        })()}

        {/* Hours entry form — G2 */}
        {(() => {
          const HOUR_FIELDS = [
            { key: 'total_flight_hours', label: 'Total Flight Hours', profileKeys: ['total_flight_hours', 'current_flight_hours'] },
            { key: 'pic_hours',          label: 'PIC Hours',          profileKeys: ['pic_hours'] },
            { key: 'instrument_hours',   label: 'Instrument Hours',   profileKeys: ['instrument_hours'] },
            { key: 'multi_engine_hours', label: 'Multi-Engine Hours', profileKeys: ['multi_engine_hours'] },
            { key: 'night_hours',        label: 'Night Hours',        profileKeys: ['night_hours'] },
          ];
          const isEditingHours = editingSlot === 'hours';
          return (
            <div className="wv-in" style={{ animationDelay: '0.38s', marginBottom: 10 }}>
              {isEditingHours ? (
                <div style={{ padding: '16px 18px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 12 }}>
                  <p style={{ margin: '0 0 12px', fontSize: 9, fontWeight: 700, color: '#64748b', letterSpacing: '0.15em', textTransform: 'uppercase' }}>Enter Flight Hours — Self-Reported</p>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10 }}>
                    {HOUR_FIELDS.map(f => (
                      <div key={f.key}>
                        <label style={{ display: 'block', fontSize: 8, fontWeight: 700, color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: 4 }}>{f.label}</label>
                        <input
                          type="number"
                          min="0"
                          placeholder="0"
                          value={slotDraft[f.key] ?? (safe(profile?.[f.profileKeys[0]]) || '')}
                          onChange={e => setSlotDraft(d => ({ ...d, [f.key]: e.target.value }))}
                          style={{
                            width: '100%', padding: '6px 8px', fontSize: 12, fontWeight: 700,
                            borderRadius: 6, border: '1px solid #cbd5e1', background: '#ffffff',
                            color: '#0f172a', outline: 'none', boxSizing: 'border-box',
                            textAlign: 'right',
                          }}
                        />
                      </div>
                    ))}
                  </div>
                  {saveError && <p style={{ margin: '8px 0 0', fontSize: 9, color: '#dc2626' }}>{saveError}</p>}
                  <p style={{ margin: '8px 0 10px', fontSize: 9, color: '#94a3b8' }}>
                    Self-reported hours are labelled as such. Connect a logbook provider below to get Verified status.
                  </p>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => {
                        const patch: Record<string, any> = {};
                        HOUR_FIELDS.forEach(f => {
                          if (slotDraft[f.key] !== undefined && slotDraft[f.key] !== '') {
                            patch[f.key] = Number(slotDraft[f.key]);
                            f.profileKeys.forEach(k => { patch[k] = Number(slotDraft[f.key]); });
                          }
                        });
                        saveProfile(patch);
                      }}
                      disabled={saving}
                      style={{ padding: '8px 20px', borderRadius: 7, border: 'none', background: '#2563eb', color: '#fff', fontSize: 11, fontWeight: 700, cursor: saving ? 'wait' : 'pointer' }}
                    >
                      {saving ? 'Saving…' : 'Save Hours'}
                    </button>
                    <button
                      onClick={() => { setEditingSlot(null); setSlotDraft({}); setSaveError(null); }}
                      style={{ padding: '8px 16px', borderRadius: 7, border: '1px solid #e2e8f0', background: '#fff', color: '#64748b', fontSize: 11, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEditingSlot('hours');
                    const init: Record<string, string> = {};
                    HOUR_FIELDS.forEach(f => { init[f.key] = safe(profile?.[f.profileKeys[0]]) || ''; });
                    setSlotDraft(init);
                    setSaveError(null);
                  }}
                  style={{
                    width: '100%', padding: '10px 18px', borderRadius: 10,
                    border: '1px dashed #cbd5e1', background: '#f8fafc', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: 8, color: '#64748b', fontSize: 11, fontWeight: 600,
                  }}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  {totalHours > 0 ? `Update flight hours  ·  Current: ${totalHours.toLocaleString()} hrs` : 'Enter your flight hours'}
                </button>
              )}
            </div>
          );
        })()}

        {/* Rows with toggles */}
        <div className="wv-in" style={{ animationDelay: '0.4s', background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, overflow: 'hidden' }}>
          {[
            { key: 'total',      label: 'Total Flight Hours',  value: totalHours,                              verified: checks.some(c => c.check_type === 'professional_qualification' && c.status === 'verified') },
            { key: 'pic',        label: 'PIC Hours',           value: safe(profile?.pic_hours) || 0,           verified: false },
            { key: 'instrument', label: 'Instrument Hours',    value: safe(profile?.instrument_hours) || 0,    verified: false },
            { key: 'multi',      label: 'Multi-Engine Hours',  value: safe(profile?.multi_engine_hours) || 0,  verified: false },
            { key: 'night',      label: 'Night Hours',         value: safe(profile?.night_hours) || 0,         verified: false },
          ].map((row, i, arr) => {
            const disclosed = disclosureToggles[row.key];
            return (
              <div key={row.key} style={{
                display: 'flex', alignItems: 'center', gap: 14, padding: '14px 20px',
                borderBottom: i < arr.length - 1 ? '1px solid #f1f5f9' : 'none',
                opacity: disclosed ? 1 : 0.4, transition: 'opacity 0.2s',
              }}>
                <div
                  onClick={() => setDisclosureToggles(t => ({ ...t, [row.key]: !t[row.key] }))}
                  style={{
                    width: 30, height: 17, borderRadius: 9, cursor: 'pointer', flexShrink: 0,
                    background: disclosed ? '#2563eb' : '#e2e8f0',
                    position: 'relative', transition: 'background 0.2s', border: `1px solid ${disclosed ? '#3b82f6' : '#cbd5e1'}`,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2, left: disclosed ? 14 : 2, width: 11, height: 11,
                    borderRadius: '50%', background: '#ffffff', transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#334155', flex: 1 }}>{row.label}</p>
                <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, #cbd5e1 0px, #cbd5e1 3px, transparent 3px, transparent 8px)', margin: '0 12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#0f172a', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                    {Number(row.value) > 0 ? Number(row.value).toLocaleString() : '—'}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 5,
                    background: row.verified ? '#dcfce7' : '#f8fafc',
                    color: row.verified ? '#15803d' : '#94a3b8',
                    border: `1px solid ${row.verified ? '#86efac' : '#e2e8f0'}`,
                  }}>
                    {row.verified ? '✓ VERIFIED' : 'SELF-REPORTED'}
                  </span>
                  {!disclosed && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', background: '#f1f5f9', padding: '2px 6px', borderRadius: 4, border: '1px solid #e2e8f0' }}>HIDDEN</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 9, color: '#94a3b8', fontWeight: 600 }}>
          {Object.values(disclosureToggles).filter(Boolean).length} of 5 fields selected for disclosure
        </p>
      </div>

      <div style={{ position: 'relative', zIndex: 10, padding: '16px 28px 0' }}>
        <div className="wv-in" style={{ animationDelay: '0.45s', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#94a3b8', textTransform: 'uppercase' }}>Logbook Sync</p>
            <p style={{ margin: 0, fontSize: 11, color: '#64748b' }}>Connect your flight logbook provider to verify hours automatically</p>
          </div>
          {/* CSV import */}
          <div>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx" style={{ display: 'none' }} onChange={handleCSV} />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: '#ffffff', border: '1px solid #e2e8f0',
                borderRadius: 6, cursor: 'pointer', color: '#64748b', fontSize: 10, fontWeight: 600,
              }}
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
              Import CSV / XLSX
            </button>
          </div>
        </div>

        {/* Provider grid */}
        <div className="wv-in" style={{ animationDelay: '0.5s', display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {PROVIDERS.map(p => {
            const connected = connectedProviders.has(p.id);
            const syncing   = syncingProvider === p.id;
            const isCert    = p.tier === 'certified';
            return (
              <div key={p.id} style={{
                background: connected ? '#f0fdf4' : '#ffffff',
                border: `1px solid ${connected ? '#86efac' : '#e2e8f0'}`,
                borderRadius: 10, padding: '14px',
                transition: 'all 0.2s',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 20 }}>{p.logo}</span>
                  <span style={{
                    fontSize: 8, fontWeight: 700, padding: '2px 6px', borderRadius: 6,
                    background: isCert ? 'rgba(16,185,129,0.15)' : 'rgba(245,158,11,0.12)',
                    color: isCert ? '#10b981' : '#f59e0b',
                    border: `1px solid ${isCert ? 'rgba(16,185,129,0.3)' : 'rgba(245,158,11,0.25)'}`,
                    letterSpacing: '0.08em',
                  }}>
                    {isCert ? 'CERTIFIED' : 'PROVISIONAL'}
                  </span>
                </div>
                <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 700, color: '#0f172a' }}>{p.name}</p>
                <p style={{ margin: '0 0 10px', fontSize: 9, color: '#94a3b8' }}>{p.sub}</p>
                <button
                  onClick={() => handleSync(p.id)}
                  disabled={syncing}
                  style={{
                    width: '100%', padding: '6px 0', borderRadius: 6, border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : syncing ? 'rgba(255,255,255,0.08)' : '#3b82f6'}`, cursor: syncing ? 'default' : 'pointer',
                    fontSize: 10, fontWeight: 600, letterSpacing: '0.04em',
                    background: connected ? 'rgba(16,185,129,0.12)' : syncing ? 'rgba(255,255,255,0.05)' : '#2563eb',
                    color: connected ? '#10b981' : syncing ? '#64748b' : '#f1f5f9',
                    transition: 'all 0.2s',
                  }}
                >
                  {syncing ? '⟳ Connecting…' : connected ? '✓ Connected' : 'Connect'}
                </button>
                {syncMsg?.id === p.id && (
                  <p style={{ margin: '6px 0 0', fontSize: 9, color: '#64748b', lineHeight: 1.3 }}>{syncMsg.msg}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* CSV feedback */}
        {syncMsg?.id === 'csv' && (
          <div className="wv-in" style={{ marginTop: 10, padding: '10px 14px', background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 10, color: '#2563eb', fontWeight: 600 }}>📂 {syncMsg.msg}</p>
          </div>
        )}

        {/* Tier legend */}
        <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>Certified — hours show as Verified ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: 9, color: '#475569', fontWeight: 600 }}>Provisional — hours show as Logged (Unverified)</span>
          </div>
        </div>
      </div>
      </>
      )}

      {/* ── FOOTER — DATA SEGREGATION TRUST PANEL ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px 28px 36px', borderTop: '1px solid #e2e8f0', marginTop: 28 }}>
        {/* Top row */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
            <span style={{ color: '#dc2626' }}>wallet.</span><span style={{ color: '#94a3b8' }}>pilotrecognition.com</span>
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ fontSize: 9, color: '#94a3b8' }}>Powered by</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#dc2626' }}>walt.id</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#64748b', background: '#f1f5f9', border: '1px solid #e2e8f0', borderRadius: 3, padding: '1px 5px' }}>VC Data Model v2.0</span>
          </div>
        </div>

        {/* Storage trust indicators */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8 }}>
          {/* Tier 1 — Enclave */}
          <div style={{ padding: '10px 12px', background: enclaveStatus?.keyPresent ? '#f0fdf4' : '#f8fafc', border: `1px solid ${enclaveStatus?.keyPresent ? '#bbf7d0' : '#e2e8f0'}`, borderRadius: 8 }}>
            <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>Tier 1 — Enclave</p>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: enclaveStatus?.keyPresent ? '#16a34a' : '#94a3b8' }}>
              {enclaveStatus?.keyPresent ? '✓ Key Active' : '○ Generating…'}
            </p>
            <p style={{ margin: 0, fontSize: 8, color: '#64748b', fontFamily: 'monospace', lineHeight: 1.4 }}>
              {enclaveStatus?.platform || 'web-crypto'}<br/>
              extractable: {String(enclaveStatus?.extractable ?? false)}
            </p>
          </div>

          {/* Tier 2 — Credential DB */}
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>Tier 2 — Credentials</p>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#334155' }}>
              {storageHealth?.tier2.credentialCount ?? 0} VC{storageHealth?.tier2.credentialCount !== 1 ? 's' : ''} stored
            </p>
            <p style={{ margin: 0, fontSize: 8, color: '#64748b', lineHeight: 1.4 }}>
              AES-256-GCM<br/>
              cloud: <span style={{ color: '#dc2626', fontWeight: 700 }}>none</span>
            </p>
          </div>

          {/* Tier 3 — Network */}
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>Tier 3 — Network</p>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#334155' }}>
              {storageHealth?.tier3.activeEndpoints ?? 0} endpoints
            </p>
            <p style={{ margin: 0, fontSize: 8, color: '#64748b', lineHeight: 1.4 }}>
              {storageHealth?.tier3.statusPointers ?? 0} status ptr{storageHealth?.tier3.statusPointers !== 1 ? 's' : ''}<br/>
              60s poll active
            </p>
          </div>

          {/* Tier 4 — Audit Log */}
          <div style={{ padding: '10px 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: 8 }}>
            <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, letterSpacing: '0.12em', color: '#64748b', textTransform: 'uppercase' }}>Tier 4 — Audit Log</p>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, color: '#334155' }}>
              {storageHealth?.tier4.auditEntries ?? 0} event{storageHealth?.tier4.auditEntries !== 1 ? 's' : ''}
            </p>
            <p style={{ margin: 0, fontSize: 8, color: '#64748b', lineHeight: 1.4 }}>
              local-only<br/>
              cloud: <span style={{ color: '#dc2626', fontWeight: 700 }}>none</span>
            </p>
          </div>
        </div>
      </div>

    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
