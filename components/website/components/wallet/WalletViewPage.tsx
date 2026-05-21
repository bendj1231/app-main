import React, { useEffect, useState } from 'react';
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
      background: 'linear-gradient(135deg, #1a0a00 0%, #2d1a0e 30%, #1a1a2e 60%, #0f0f1a 100%)',
    }}>
      <style>{`
        @keyframes wvFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes wvShimmer { 0%,100% { opacity:0.5; } 50% { opacity:1; } }
        @keyframes wvGlow { 0%,100% { box-shadow: 0 0 20px rgba(220,38,38,0.3); } 50% { box-shadow: 0 0 40px rgba(220,38,38,0.6); } }
        .wv-in { animation: wvFadeUp 0.4s ease both; }
        .wv-card-hover { transition: transform 0.25s ease, box-shadow 0.25s ease; cursor: pointer; }
        .wv-card-hover:hover { transform: translateY(-4px) rotateX(2deg); box-shadow: 0 20px 60px rgba(0,0,0,0.5) !important; }
      `}</style>

      {/* ── LEATHER TEXTURE OVERLAY ── */}
      <div style={{
        position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0,
        backgroundImage: `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,0.015) 2px, rgba(255,255,255,0.015) 4px),
          repeating-linear-gradient(90deg, transparent, transparent 2px, rgba(255,255,255,0.01) 2px, rgba(255,255,255,0.01) 4px)`,
      }} />

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
            <p style={{ margin: 0, fontSize: 9, fontWeight: 700, letterSpacing: '0.25em', color: '#dc2626', textTransform: 'uppercase' }}>PilotRecognition</p>
            <p style={{ margin: 0, fontSize: 18, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.01em' }}>Credential Wallet</p>
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

      {/* ── MAIN PILOT ID CARD ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 28px 0' }}>
        <div className="wv-in" style={{
          background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2744 40%, #1a1a3e 100%)',
          borderRadius: 20, padding: '28px', position: 'relative', overflow: 'hidden',
          boxShadow: '0 24px 64px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.12)',
        }}>
          {/* Holographic shimmer strip */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 3,
            background: 'linear-gradient(90deg, #dc2626, #f59e0b, #10b981, #3b82f6, #8b5cf6, #dc2626)',
            backgroundSize: '200% 100%', animation: 'wvShimmer 3s ease infinite',
          }} />
          {/* Watermark */}
          <div style={{
            position: 'absolute', right: -20, top: '50%', transform: 'translateY(-50%) rotate(-15deg)',
            fontSize: 80, fontWeight: 900, color: 'rgba(255,255,255,0.03)', letterSpacing: '-0.05em', userSelect: 'none',
          }}>PILOT</div>

          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
            <div>
              <p style={{ margin: '0 0 2px', fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase' }}>Pilot Identity Credential</p>
              <p style={{ margin: '0 0 12px', fontSize: 24, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.02em', lineHeight: 1.1 }}>{name.toUpperCase()}</p>
              <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap' }}>
                {[
                  { label: 'License Type', value: safe(profile?.license_type) || safe(profile?.current_occupation) || '—' },
                  { label: 'License No.', value: safe(profile?.license_number) || safe(profile?.license_id) || '—' },
                  { label: 'Total Hours', value: totalHours > 0 ? `${totalHours.toLocaleString()} hrs` : '—' },
                  { label: 'Country', value: safe(profile?.country) || safe(profile?.citizenship) || '—' },
                ].map(f => (
                  <div key={f.label}>
                    <p style={{ margin: 0, fontSize: 8, fontWeight: 700, letterSpacing: '0.15em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{f.label}</p>
                    <p style={{ margin: '2px 0 0', fontSize: 12, fontWeight: 700, color: '#ffffff' }}>{f.value}</p>
                  </div>
                ))}
              </div>
            </div>
            {/* Chip */}
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 8 }}>
              <div style={{
                width: 44, height: 34, borderRadius: 6,
                background: 'linear-gradient(135deg, #d4a843 0%, #f5d178 40%, #c49a35 100%)',
                boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.4), 0 2px 8px rgba(0,0,0,0.4)',
                display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr', gap: 2, padding: 4,
              }}>
                {[0,1,2,3].map(i => <div key={i} style={{ background: 'rgba(0,0,0,0.2)', borderRadius: 2 }} />)}
              </div>
              <p style={{ margin: 0, fontSize: 8, color: 'rgba(255,255,255,0.3)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>{did}</p>
            </div>
          </div>

          {/* Magnetic stripe */}
          <div style={{ marginTop: 20, height: 32, background: 'rgba(0,0,0,0.5)', borderRadius: 4, position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, background: 'repeating-linear-gradient(90deg, rgba(255,255,255,0.03) 0px, rgba(255,255,255,0.03) 2px, transparent 2px, transparent 6px)' }} />
            <div style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: 2 }}>
              {Array.from({ length: 20 }).map((_, i) => (
                <div key={i} style={{ width: 2, height: 16, background: `rgba(255,255,255,${0.05 + Math.random() * 0.15})`, borderRadius: 1 }} />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ── CREDENTIAL CARD SLEEVES ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <p className="wv-in" style={{ animationDelay: '0.1s', margin: '0 0 14px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          Credential Sleeves
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 14 }}>
          {SLEEVE_CONFIG.map((slot, idx) => {
            const val   = safe(profile?.[slot.profileKey]);
            const sub   = slot.subKey ? safe(profile?.[slot.subKey]) : null;
            const exp   = safe(profile?.[slot.expiryKey]);
            const days  = daysUntil(exp);
            const check = checks.find(c => c.check_type === slot.checkType);
            const st    = check?.status ? STATUS_CONFIG[check.status] : null;
            const isVerified = check?.status === 'verified';
            const isExpired  = check?.status === 'expired';

            const cardColors = [
              { from: '#1a3a2a', to: '#0d2218', accent: '#10b981' },
              { from: '#1a1a3e', to: '#0d0d2a', accent: '#3b82f6' },
              { from: '#2a1a0e', to: '#1a0d00', accent: '#f59e0b' },
              { from: '#2a0d1a', to: '#1a0010', accent: '#8b5cf6' },
            ];
            const cc = cardColors[idx % cardColors.length];

            return (
              <div key={slot.key} className={`wv-in wv-card-hover`} style={{ animationDelay: `${0.12 + idx * 0.06}s` }}>
                <div style={{
                  background: `linear-gradient(135deg, ${cc.from} 0%, ${cc.to} 100%)`,
                  borderRadius: 16, padding: '18px', position: 'relative', overflow: 'hidden',
                  border: `1px solid rgba(255,255,255,0.1)`,
                  boxShadow: `0 8px 32px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08)`,
                }}>
                  {/* Top accent bar */}
                  <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: isVerified ? `linear-gradient(90deg, ${cc.accent}, transparent)` : isExpired ? 'linear-gradient(90deg, #dc2626, transparent)' : 'linear-gradient(90deg, rgba(255,255,255,0.1), transparent)' }} />

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                    <span style={{ fontSize: 20 }}>{slot.icon}</span>
                    {st ? (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot, boxShadow: `0 0 8px ${st.dot}` }} />
                    ) : (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'rgba(255,255,255,0.15)' }} />
                    )}
                  </div>

                  <p style={{ margin: '0 0 3px', fontSize: 8, fontWeight: 700, letterSpacing: '0.18em', color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase' }}>{slot.label}</p>
                  <p style={{ margin: '0 0 4px', fontSize: 14, fontWeight: 800, color: val ? '#ffffff' : 'rgba(255,255,255,0.2)', lineHeight: 1.2 }}>
                    {val || 'Not entered'}
                  </p>
                  {sub && (
                    <p style={{ margin: '0 0 8px', fontSize: 9, color: 'rgba(255,255,255,0.35)', fontFamily: 'monospace' }}>{sub}</p>
                  )}

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(255,255,255,0.06)' }}>
                    <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.08em',
                      color: isVerified ? '#10b981' : isExpired ? '#dc2626' : 'rgba(255,255,255,0.25)'
                    }}>
                      {isVerified ? '✓ VERIFIED' : isExpired ? '✗ EXPIRED' : st ? st.label : 'UNVERIFIED'}
                    </span>
                    {exp && days !== null && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: expiryColor(days), fontFamily: 'monospace' }}>
                        {days < 0 ? `EXP −${Math.abs(days)}d` : `EXP +${days}d`}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── FLIGHT HOURS PANEL ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '28px 28px 0' }}>
        <p className="wv-in" style={{ animationDelay: '0.35s', margin: '0 0 14px', fontSize: 9, fontWeight: 700, letterSpacing: '0.22em', color: 'rgba(255,255,255,0.3)', textTransform: 'uppercase' }}>
          Flight Hours Logbook
        </p>
        <div className="wv-in" style={{ animationDelay: '0.4s',
          background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 16, overflow: 'hidden', backdropFilter: 'blur(12px)',
        }}>
          {[
            { label: 'Total Flight Hours', value: totalHours, verified: checks.some(c => c.check_type === 'professional_qualification' && c.status === 'verified') },
            { label: 'PIC Hours',          value: safe(profile?.pic_hours) || 0,           verified: false },
            { label: 'Instrument Hours',   value: safe(profile?.instrument_hours) || 0,     verified: false },
            { label: 'Multi-Engine Hours', value: safe(profile?.multi_engine_hours) || 0,   verified: false },
            { label: 'Night Hours',        value: safe(profile?.night_hours) || 0,          verified: false },
          ].map((row, i, arr) => (
            <div key={row.label} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < arr.length - 1 ? '1px solid rgba(255,255,255,0.05)' : 'none',
            }}>
              <p style={{ margin: 0, fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)' }}>{row.label}</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <span style={{ fontSize: 16, fontWeight: 900, color: '#ffffff', fontFamily: 'monospace', letterSpacing: '-0.02em' }}>
                  {Number(row.value) > 0 ? Number(row.value).toLocaleString() : '—'}
                </span>
                <span style={{ fontSize: 9, fontWeight: 700, color: row.verified ? '#10b981' : 'rgba(255,255,255,0.2)', letterSpacing: '0.1em' }}>
                  {row.verified ? '✓ VERIFIED' : 'SELF-REPORTED'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── FOOTER ── */}
      <div style={{ position: 'relative', zIndex: 10, padding: '24px 28px 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 700 }}>
          <span style={{ color: '#dc2626' }}>wallet.</span><span style={{ color: 'rgba(255,255,255,0.3)' }}>pilotrecognition.com</span>
        </span>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.25)' }}>Powered by</span>
          <span style={{ fontSize: 9, fontWeight: 800, color: '#dc2626' }}>walt.id</span>
          <span style={{ fontSize: 8, fontWeight: 700, color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 3, padding: '1px 5px' }}>wallet</span>
        </div>
      </div>

    </div>
  );

  return ReactDOM.createPortal(content, document.body);
};
