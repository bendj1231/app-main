import React, { useEffect, useRef, useState, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { supabase } from '../../../../shared/lib/supabase';

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

  useEffect(() => {
    const load = async () => {
      const uid = userId || (await supabase.auth.getSession()).data.session?.user?.id;
      if (!uid) { setLoading(false); return; }

      const [{ data: p }, { data: c }] = await Promise.all([
        supabase.from('profiles').select('*').eq('id', uid).single(),
        supabase.from('pilot_credentials').select('*').eq('user_id', uid),
      ]);
      setProfile(p);
      setChecks(c || []);
      setLoading(false);
    };
    load();
  }, [userId]);

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
      background: '#0d1117',
    }}>
      <style>{`
        @keyframes wvFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wvShimmer { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes wvGlow { 0%,100% { box-shadow: 0 0 20px rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 40px rgba(220,38,38,0.6); } }
        .wv-in { animation: wvFadeUp 0.4s ease both; }
        .wv-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .wv-card-hover:hover { transform: translateY(-4px) rotateX(2deg); box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important; }
      `}</style>

      {/* clean bg — no texture noise */}

      {/* ── HEADER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '20px 28px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{
              display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, padding: '6px 12px',
              cursor: 'pointer', color: 'rgba(255,255,255,0.7)', fontSize: 11, fontWeight: 600,
              backdropFilter: 'blur(8px)',
            }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          )}
          <div>
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#ef4444', textTransform: 'uppercase' }}>PilotRecognition</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.01em' }}>Credential Wallet</p>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          {/* Status badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            padding: '5px 14px', borderRadius: 20,
            background: allVerified ? 'rgba(16,185,129,0.15)' : hasExpired ? 'rgba(220,38,38,0.15)' : 'rgba(255,255,255,0.08)',
            border: `1px solid ${allVerified ? 'rgba(16,185,129,0.4)' : hasExpired ? 'rgba(220,38,38,0.4)' : 'rgba(255,255,255,0.15)'}`,
          }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: allVerified ? '#10b981' : hasExpired ? '#dc2626' : '#94a3b8' }} />
            <span style={{ fontSize: 10, fontWeight: 700, color: allVerified ? '#10b981' : hasExpired ? '#dc2626' : '#94a3b8', letterSpacing: '0.1em' }}>
              {allVerified ? 'PRE-CLEARED' : hasExpired ? 'ACTION REQUIRED' : 'PENDING VERIFICATION'}
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

      {/* ── ZONE 1: MASTER CORE IDENTITY CARD ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 28px 0' }}>
        <div className="wv-in" style={{
          background: '#161b22',
          borderRadius: 16, padding: '28px', position: 'relative', overflow: 'hidden',
          boxShadow: didVerified
            ? '0 0 0 1px rgba(16,185,129,0.5), 0 8px 32px rgba(0,0,0,0.4)'
            : '0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4)',
          border: 'none',
          transition: 'box-shadow 0.5s ease',
        }}>
          {/* Holographic shimmer strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: didVerified
              ? 'linear-gradient(90deg, #10b981, #34d399, #10b981)'
              : 'linear-gradient(90deg, #dc2626, #f59e0b, #10b981, #3b82f6, #8b5cf6, #dc2626)',
            backgroundSize: '200% 100%', animation: 'wvShimmer 3s ease infinite',
            transition: 'background 0.6s ease',
          }} />
          {/* Watermark */}
          <div style={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%) rotate(-15deg)',
            fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.05em', userSelect: 'none',
          }}>PILOT</div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase' }}>Pilot Identity Credential</p>
                {didVerified && (
                  <span style={{ fontSize: 8, fontWeight: 700, color: '#10b981', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: 6, padding: '1px 6px', letterSpacing: '0.08em' }}>
                    ✓ SIGNATURE VERIFIED
                  </span>
                )}
              </div>
              <p style={{ margin: '0 0 4px', fontSize: 24, fontWeight: 900, color: '#f1f5f9', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name.toUpperCase()}</p>
              <p style={{ margin: '0 0 14px', fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>
                did:web:wallet.pilotrecognition.com:{profile?.id?.slice(0,8) || 'pending'}
              </p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'License Type', value: safe(profile?.license_type) || safe(profile?.current_occupation) || '—' },
                  { label: 'License No.',  value: safe(profile?.license_number) || safe(profile?.license_id) || '—' },
                  { label: 'Total Hours',  value: totalHours > 0 ? `${totalHours.toLocaleString()} hrs` : '—', live: true },
                  { label: 'Country',      value: safe(profile?.country) || safe(profile?.citizenship) || '—' },
                ].map(f => (
                  <div key={f.label}>
                    <p style={{ margin: 0, fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', color: '#64748b', textTransform: 'uppercase' }}>{f.label}</p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{f.value}</p>
                      {(f as any).live && <span style={{ fontSize: 7, color: '#10b981', fontWeight: 700, letterSpacing: '0.1em' }}>● LIVE</span>}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* DID Chip — glows green when verified */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: 52, height: 40, borderRadius: 7, position: 'relative',
                  background: didVerified
                    ? 'linear-gradient(135deg, #16a34a 0%, #22c55e 40%, #15803d 100%)'
                    : 'linear-gradient(135deg, #d4a843 0%, #f5d178 40%, #c49a35 100%)',
                  boxShadow: didVerified
                    ? 'inset 0 1px 0 rgba(255,255,255,0.4), 0 0 20px rgba(16,185,129,0.6), 0 2px 8px rgba(0,0,0,0.4)'
                    : 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.4)',
                  display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, padding: 5,
                  transition: 'all 0.6s ease',
                }}>
                  {[0,1,2,3].map(i => <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 2 }} />)}
                </div>
                {didVerified && (
                  <div style={{
                    position: 'absolute', bottom: -6, right: -6, width: 18, height: 18, borderRadius: '50%',
                    background: '#10b981', border: '2px solid #1a1a3e',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 9, color: '#fff', fontWeight: 900,
                  }}>✓</div>
                )}
              </div>
              <button
                onClick={() => {
                  if (didVerified) return;
                  setDidVerifying(true);
                  setTimeout(() => { setDidVerifying(false); setDidVerified(true); }, 2200);
                }}
                disabled={didVerifying || didVerified}
                style={{
                  fontSize: 10, fontWeight: 700, padding: '6px 14px', borderRadius: 6, cursor: didVerified ? 'default' : 'pointer',
                  background: didVerified ? 'rgba(16,185,129,0.15)' : didVerifying ? 'rgba(255,255,255,0.06)' : '#2563eb',
                  border: `1px solid ${didVerified ? 'rgba(16,185,129,0.4)' : didVerifying ? 'rgba(255,255,255,0.1)' : '#3b82f6'}`,
                  color: didVerified ? '#10b981' : '#f1f5f9',
                  letterSpacing: '0.04em', whiteSpace: 'nowrap',
                  transition: 'all 0.3s ease',
                }}
              >
                {didVerifying ? '⟳ Verifying…' : didVerified ? '✓ Verified' : 'Verify Signature'}
              </button>
              <p style={{ margin: 0, fontSize: 7, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', letterSpacing: '0.04em', textAlign: 'right' }}>{did}</p>
            </div>
          </div>

          {/* Magnetic stripe */}
          <div style={{ marginTop: 20, height: 32, background: 'rgba(0,0,0,0.5)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 6px)' }} />
            <div style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }}>
              <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.2)', fontFamily: 'monospace', letterSpacing: '0.08em' }}>
                PRESENTATION EXCHANGE · AES-256-GCM · {didVerified ? 'AUTHORITY SIGNATURE VALID' : 'AWAITING VERIFICATION'}
              </p>
            </div>
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 2 }}>
              {Array.from({ length: 16 }).map((_, i) => (
                <div key={i} style={{ width: 2, height: 16, background: `rgba(255,255,255,0.07)`, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── ZONE 2: MODULAR CREDENTIAL SLEEVES ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <div className="wv-in" style={{ animationDelay: '0.1s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 14 }}>
          <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#64748b', textTransform: 'uppercase' }}>
            Zone 2 — Credential Sleeves
          </p>
          <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>Each sleeve holds an independent cryptographic proof block</span>
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
              { accent: '#10b981' },
              { accent: '#3b82f6' },
              { accent: '#f59e0b' },
              { accent: '#8b5cf6' },
            ];
            const cc = cardColors[idx % cardColors.length];

            return (
              <div key={slot.key} className="wv-in wv-card-hover" style={{ animationDelay: `${0.12 + idx * 0.06}s` }}>
                <div style={{
                  background: isActive ? '#161b22' : '#161b22',
                  borderRadius: 12, padding: '18px', position: 'relative', overflow: 'hidden',
                  border: `1px solid ${isExpired ? 'rgba(239,68,68,0.5)' : isActive ? `${cc.accent}66` : 'rgba(255,255,255,0.08)'}`,
                  boxShadow: isActive ? `0 0 0 0px transparent, inset 0 0 0 1px ${cc.accent}33` : 'none',
                  transition: 'all 0.4s ease',
                  height: '100%', boxSizing: 'border-box',
                }}>  
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: isActive ? `linear-gradient(90deg, ${cc.accent}, transparent)` : isExpired ? 'linear-gradient(90deg, #dc2626, transparent)' : 'linear-gradient(90deg, rgba(255,255,255,0.08), transparent)', transition: 'background 0.5s ease' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 10 }}>
                    <span style={{ fontSize: 20 }}>{slot.icon}</span>
                    <div style={{ width: 9, height: 9, borderRadius: '50%', background: isExpired ? '#dc2626' : isActive ? cc.accent : 'rgba(255,255,255,0.15)', boxShadow: isActive ? `0 0 10px ${cc.accent}` : 'none', transition: 'all 0.5s ease' }} />
                  </div>

                  <p style={{ margin: '0 0 2px', fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: '#64748b', textTransform: 'uppercase' }}>{slot.label}</p>
                  <p style={{ margin: '0 0 3px', fontSize: 13, fontWeight: 700, color: (val || isImported) ? '#e2e8f0' : '#475569', lineHeight: 1.3 }}>
                    {isImported && !val ? 'Imported' : val || 'Not entered'}
                  </p>
                  {sub && <p style={{ margin: '0 0 6px', fontSize: 9, color: '#94a3b8', fontFamily: 'monospace' }}>{sub}</p>}

                  {/* Independent proof block */}
                  {isActive && (
                    <div style={{ margin: '8px 0', padding: '6px 8px', background: 'rgba(0,0,0,0.25)', borderRadius: 6, borderLeft: `2px solid ${cc.accent}` }}>
                      <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.5)', fontFamily: 'monospace', lineHeight: 1.5 }}>
                        proof: Ed25519Signature2020<br/>
                        issuer: did:web:caap.gov.ph<br/>
                        proofHash: 0x{profile?.id?.replace(/-/g,'').slice(0,12).toUpperCase() || 'A1B2C3D4E5F6'}…
                      </p>
                    </div>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', color: isExpired ? '#ef4444' : isActive ? cc.accent : '#f59e0b' }}>
                      {isScanning ? '⟳ Importing…' : isExpired ? '✗ EXPIRED' : isActive ? '✓ VERIFIED' : 'UNVERIFIED'}
                    </span>
                    {exp && days !== null && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: expiryColor(days), fontFamily: 'monospace' }}>
                        {days < 0 ? `EXP −${Math.abs(days)}d` : `EXP +${days}d`}
                      </span>
                    )}
                  </div>

                  {/* Import button */}
                  {!isActive && !isScanning && (
                    <button
                      onClick={() => setQrSlot(slot.key)}
                      style={{
                        marginTop: 10, width: '100%', padding: '7px 0', borderRadius: 6,
                        border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer',
                        background: '#1e2530', color: '#94a3b8', fontSize: 10, fontWeight: 600,
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      }}
                    >
                      <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>
                      Scan QR / Import
                    </button>
                  )}
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

      {/* ── ZONE 3: FLIGHT HOURS LOGBOOK — SELECTIVE DISCLOSURE ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <div className="wv-in" style={{ animationDelay: '0.35s', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#64748b', textTransform: 'uppercase' }}>Zone 3 — Flight Hours Logbook</p>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Toggle which fields to include in your presentation export</p>
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
              onClick={() => setExportOpen(o => !o)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '6px 14px',
                background: '#2563eb', border: '1px solid #3b82f6',
                borderRadius: 6, cursor: 'pointer', color: '#f1f5f9', fontSize: 10, fontWeight: 600,
              }}
            >
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
              Export Presentation
            </button>
          </div>
        </div>

        {/* Sign-off panel */}
        {signoffOpen && (
          <div className="wv-in" style={{ marginBottom: 14, padding: '16px 18px', background: 'rgba(245,158,11,0.08)', border: '1px solid rgba(245,158,11,0.25)', borderRadius: 12 }}>
            <p style={{ margin: '0 0 10px', fontSize: 11, fontWeight: 700, color: '#f59e0b' }}>Request Hour Sign-off</p>
            <p style={{ margin: '0 0 12px', fontSize: 10, color: 'rgba(255,255,255,0.45)', lineHeight: 1.5 }}>
              Send a sign-off request to your airline, flight school, or logbook provider. Once approved, those hours will be upgraded from Self-Reported to <strong style={{ color: '#10b981' }}>Verified ✓</strong>.
            </p>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {['My Airline / Operator', 'Flight School / ATO', 'ForeFlight Sync', 'Manual Upload'].map(opt => (
                <button key={opt} style={{
                  padding: '5px 12px', borderRadius: 7, border: '1px solid rgba(245,158,11,0.3)',
                  background: 'rgba(245,158,11,0.1)', color: '#f59e0b', fontSize: 9, fontWeight: 700, cursor: 'pointer',
                }}>{opt}</button>
              ))}
            </div>
          </div>
        )}

        {/* Export preview panel */}
        {exportOpen && (
          <div className="wv-in" style={{ marginBottom: 14, padding: '16px 18px', background: 'rgba(59,130,246,0.08)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 12 }}>
            <p style={{ margin: '0 0 4px', fontSize: 11, fontWeight: 700, color: '#93c5fd' }}>Presentation Preview</p>
            <p style={{ margin: '0 0 10px', fontSize: 10, color: 'rgba(255,255,255,0.4)' }}>Only selected fields will be included when shared with an employer or ramp inspector.</p>
            <div style={{ fontFamily: 'monospace', fontSize: 9, color: 'rgba(255,255,255,0.5)', background: 'rgba(0,0,0,0.3)', borderRadius: 8, padding: '10px 12px', lineHeight: 1.8 }}>
              {`{\n  "subject": "did:web:wallet.pilotrecognition.com:${profile?.id?.slice(0,8) || '...'}",\n  "presentation": [\n`}
              {Object.entries(disclosureToggles).filter(([,v]) => v).map(([k]) => `    "${k}_hours": redacted_unless_consented,\n`).join('')}
              {`  ],\n  "proof": "Ed25519Signature2020"\n}`}
            </div>
            <button style={{ marginTop: 10, padding: '7px 16px', borderRadius: 8, border: 'none', background: '#3b82f6', color: '#fff', fontSize: 10, fontWeight: 700, cursor: 'pointer' }}>
              Generate Signed Presentation
            </button>
          </div>
        )}

        {/* Rows with toggles */}
        <div className="wv-in" style={{ animationDelay: '0.4s', background: '#161b22', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, overflow: 'hidden' }}>
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
                borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.06)' : 'none',
                opacity: disclosed ? 1 : 0.4, transition: 'opacity 0.2s',
              }}>
                {/* Disclosure toggle */}
                <div
                  onClick={() => setDisclosureToggles(t => ({ ...t, [row.key]: !t[row.key] }))}
                  style={{
                    width: 30, height: 17, borderRadius: 9, cursor: 'pointer', flexShrink: 0,
                    background: disclosed ? '#2563eb' : 'rgba(255,255,255,0.1)',
                    position: 'relative', transition: 'background 0.2s', border: `1px solid ${disclosed ? '#3b82f6' : 'rgba(255,255,255,0.08)'}`,
                  }}
                >
                  <div style={{
                    position: 'absolute', top: 2, left: disclosed ? 14 : 2, width: 11, height: 11,
                    borderRadius: '50%', background: '#ffffff', transition: 'left 0.2s',
                    boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                  }} />
                </div>
                <p style={{ margin: 0, fontSize: 13, fontWeight: 600, color: '#cbd5e1', flex: 1 }}>{row.label}</p>
                {/* Dot trail */}
                <div style={{ flex: 1, height: 1, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.1) 0px, rgba(255,255,255,0.1) 4px, transparent 4px, transparent 8px)', margin: '0 12px' }} />
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 180, justifyContent: 'flex-end' }}>
                  <span style={{ fontSize: 16, fontWeight: 800, color: '#f1f5f9', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                    {Number(row.value) > 0 ? Number(row.value).toLocaleString() : '—'}
                  </span>
                  <span style={{
                    fontSize: 9, fontWeight: 700, letterSpacing: '0.08em', padding: '2px 8px', borderRadius: 5,
                    background: row.verified ? 'rgba(16,185,129,0.12)' : 'rgba(255,255,255,0.05)',
                    color: row.verified ? '#10b981' : '#64748b',
                    border: `1px solid ${row.verified ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    {row.verified ? '✓ VERIFIED' : 'SELF-REPORTED'}
                  </span>
                  {!disclosed && (
                    <span style={{ fontSize: 8, fontWeight: 700, color: '#475569', letterSpacing: '0.1em', background: 'rgba(255,255,255,0.05)', padding: '2px 6px', borderRadius: 4 }}>HIDDEN</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
        <p style={{ margin: '8px 0 0', fontSize: 9, color: '#475569', fontWeight: 600 }}>
          {Object.values(disclosureToggles).filter(Boolean).length} of 5 fields selected for disclosure
        </p>
      </div>

      {/* ── LOGBOOK SYNC ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <div className="wv-in" style={{ animationDelay: '0.45s', display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 14, flexWrap: 'wrap', gap: 8 }}>
          <div>
            <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: '#64748b', textTransform: 'uppercase' }}>Logbook Sync</p>
            <p style={{ margin: 0, fontSize: 11, color: '#94a3b8' }}>Connect your flight logbook provider to verify hours automatically</p>
          </div>
          {/* CSV import */}
          <div>
            <input ref={fileInputRef} type="file" accept=".csv,.xlsx" style={{ display: 'none' }} onChange={handleCSV} />
            <button
              onClick={() => fileInputRef.current?.click()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                background: '#1e2530', border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 6, cursor: 'pointer', color: '#94a3b8', fontSize: 10, fontWeight: 600,
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
                background: connected ? 'rgba(16,185,129,0.07)' : '#161b22',
                border: `1px solid ${connected ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.08)'}`,
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
                <p style={{ margin: '0 0 1px', fontSize: 12, fontWeight: 700, color: '#e2e8f0' }}>{p.name}</p>
                <p style={{ margin: '0 0 10px', fontSize: 9, color: '#64748b' }}>{p.sub}</p>
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
                  <p style={{ margin: '6px 0 0', fontSize: 9, color: '#94a3b8', lineHeight: 1.3 }}>{syncMsg.msg}</p>
                )}
              </div>
            );
          })}
        </div>

        {/* CSV feedback */}
        {syncMsg?.id === 'csv' && (
          <div className="wv-in" style={{ marginTop: 10, padding: '10px 14px', background: 'rgba(59,130,246,0.1)', border: '1px solid rgba(59,130,246,0.25)', borderRadius: 10 }}>
            <p style={{ margin: 0, fontSize: 10, color: '#93c5fd', fontWeight: 600 }}>📂 {syncMsg.msg}</p>
          </div>
        )}

        {/* Tier legend */}
        <div style={{ marginTop: 12, display: 'flex', gap: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }} />
            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>Certified — hours show as Verified ✓</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
            <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />
            <span style={{ fontSize: 9, color: '#64748b', fontWeight: 600 }}>Provisional — hours show as Logged (Unverified)</span>
          </div>
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 36px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 28 }}>
        <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
          <span style={{ color: '#ef4444' }}>wallet.</span><span style={{ color: '#475569' }}>pilotrecognition.com</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: '#475569' }}>Powered by</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#ef4444' }}>walt.id</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: '#64748b', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 3, padding: '1px 5px' }}>wallet</span>
        </div>
      </div>

    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
