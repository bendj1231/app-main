import React, { useEffect, useState } from 'react';
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

export const WalletViewPage: React.FC<WalletViewPageProps> = ({ userId, onBack }) => {
  const [profile, setProfile] = useState<any>(null);
  const [checks, setChecks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeSlot, setActiveSlot] = useState<string | null>(null);

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

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#f8fafc', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '3px solid #fecaca', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#f8fafc', fontFamily: 'system-ui, -apple-system, sans-serif', zIndex: 9998, overflowY: 'auto' }}>
      <style>{`
        @keyframes fadeUp { from { opacity:0; transform:translateY(10px); } to { opacity:1; transform:translateY(0); } }
        .wv-card { animation: fadeUp 0.35s ease both; }
        .wv-sleeve:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(0,0,0,0.09); }
        .wv-sleeve { transition: transform 0.2s, box-shadow 0.2s; }
      `}</style>

      {/* ── TOP BAR ── */}
      <div style={{ background: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '14px 24px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          {onBack && (
            <button onClick={onBack} style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'none', border: '1px solid #e2e8f0', borderRadius: 8, padding: '5px 10px', cursor: 'pointer', color: '#64748b', fontSize: 11, fontWeight: 600 }}>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5"/><polyline points="12 19 5 12 12 5"/></svg>
              Back
            </button>
          )}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/>
            </svg>
            <div>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#0f172a', letterSpacing: '-0.01em' }}>
                {safe(profile?.display_name) || safe(profile?.full_name) || 'Pilot Wallet'}
              </span>
              <span style={{ fontSize: 10, color: '#94a3b8', marginLeft: 8, fontFamily: 'monospace' }}>
                {profile?.id ? `DID:0x${profile.id.replace(/-/g,'').slice(0,8).toUpperCase()}` : ''}
              </span>
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '4px 12px', borderRadius: 20, border: '1px solid',
            ...(allVerified
              ? { background: '#f0fdf4', color: '#16a34a', borderColor: '#bbf7d0' }
              : hasExpired
              ? { background: '#fef2f2', color: '#dc2626', borderColor: '#fecaca' }
              : { background: '#f8fafc', color: '#64748b', borderColor: '#e2e8f0' })
          }}>
            {allVerified ? '● Pre-Cleared' : hasExpired ? '● Action Required' : checks.length > 0 ? `● ${checks.length} Credentials` : '● No credentials yet'}
          </span>
          <span style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace' }}>AES-256-GCM</span>
        </div>
      </div>

      {/* ── BODY ── */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: '28px 24px' }}>

        {/* ── CREDENTIAL SLEEVES ── */}
        <div className="wv-card" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Credential Sleeves</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
            {SLEEVE_CONFIG.map(slot => {
              const val   = safe(profile?.[slot.profileKey]);
              const sub   = slot.subKey ? safe(profile?.[slot.subKey]) : null;
              const exp   = safe(profile?.[slot.expiryKey]);
              const days  = daysUntil(exp);
              const check = checks.find(c => c.check_type === slot.checkType);
              const st    = check?.status ? STATUS_CONFIG[check.status] : null;
              const isActive = activeSlot === slot.key;

              return (
                <div
                  key={slot.key}
                  className="wv-sleeve"
                  onClick={() => setActiveSlot(isActive ? null : slot.key)}
                  style={{
                    background: '#ffffff', border: `1px solid ${isActive ? '#dc2626' : '#e2e8f0'}`,
                    borderRadius: 14, padding: '16px', cursor: 'pointer',
                    boxShadow: isActive ? '0 0 0 3px rgba(220,38,38,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                  }}
                >
                  <div style={{ fontSize: 22, marginBottom: 8 }}>{slot.icon}</div>
                  <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.12em', textTransform: 'uppercase', margin: '0 0 4px' }}>{slot.label}</p>
                  <p style={{ fontSize: 13, fontWeight: 700, color: val ? '#0f172a' : '#cbd5e1', margin: '0 0 2px', lineHeight: 1.3 }}>
                    {val || '— Not entered'}
                  </p>
                  {sub && <p style={{ fontSize: 10, color: '#94a3b8', fontFamily: 'monospace', margin: '0 0 6px' }}>{sub}</p>}
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }}>
                    {st ? (
                      <span style={{ fontSize: 9, fontWeight: 700, color: st.text, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 10, padding: '2px 7px' }}>
                        ● {st.label}
                      </span>
                    ) : (
                      <span style={{ fontSize: 9, color: '#cbd5e1', fontWeight: 600 }}>Unverified</span>
                    )}
                    {exp && days !== null && (
                      <span style={{ fontSize: 9, fontWeight: 700, color: expiryColor(days) }}>
                        {days < 0 ? `${Math.abs(days)}d ago` : `${days}d`}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── VERIFICATION CHECKS ── */}
        {checks.length > 0 && (
          <div className="wv-card" style={{ animationDelay: '0.05s', marginBottom: 24 }}>
            <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Verification Record</p>
            <div style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 14, overflow: 'hidden' }}>
              {checks.map((c, i) => {
                const st = STATUS_CONFIG[c.status] || STATUS_CONFIG.pending;
                const days = daysUntil(c.expires_at);
                return (
                  <div key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderBottom: i < checks.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: st.dot, flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: 12, fontWeight: 600, color: '#0f172a', margin: 0 }}>{CHECK_LABELS[c.check_type] || c.check_type}</p>
                        {c.provider && <p style={{ fontSize: 10, color: '#94a3b8', margin: 0 }}>via {c.provider}</p>}
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: st.text, background: st.bg, border: `1px solid ${st.border}`, borderRadius: 10, padding: '2px 8px' }}>
                        {st.label}
                      </span>
                      {days !== null && (
                        <p style={{ fontSize: 9, color: expiryColor(days), margin: '3px 0 0', fontWeight: 600 }}>
                          {days < 0 ? `Expired ${Math.abs(days)}d ago` : `Expires in ${days}d`}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* ── FLIGHT HOURS ── */}
        <div className="wv-card" style={{ animationDelay: '0.1s', marginBottom: 24 }}>
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Flight Hours</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(130px, 1fr))', gap: 10 }}>
            {[
              { label: 'Total Hours',   value: totalHours || 0,                                   verified: checks.some(c => c.check_type === 'professional_qualification' && c.status === 'verified') },
              { label: 'PIC Hours',     value: safe(profile?.pic_hours) || 0,                     verified: false },
              { label: 'Instrument',    value: safe(profile?.instrument_hours) || 0,               verified: false },
              { label: 'Multi-Engine',  value: safe(profile?.multi_engine_hours) || 0,             verified: false },
              { label: 'Night Hours',   value: safe(profile?.night_hours) || 0,                   verified: false },
            ].map(row => (
              <div key={row.label} style={{ background: '#ffffff', border: '1px solid #e2e8f0', borderRadius: 12, padding: '14px 14px 12px' }}>
                <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.1em', textTransform: 'uppercase', margin: '0 0 6px' }}>{row.label}</p>
                <p style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
                  {Number(row.value) > 0 ? Number(row.value).toLocaleString() : '—'}
                </p>
                <p style={{ fontSize: 9, marginTop: 4, fontWeight: 600, color: row.verified ? '#16a34a' : '#94a3b8' }}>
                  {row.verified ? '✓ Verified' : 'Self-reported'}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* ── WALLET FOOTER ── */}
        <div className="wv-card" style={{ animationDelay: '0.15s', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 0' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#334155" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
            </svg>
            <span style={{ fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
              <span style={{ color: '#dc2626' }}>wallet.</span><span style={{ color: '#334155' }}>pilotrecognition.com</span>
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <span style={{ fontSize: 9, color: '#94a3b8' }}>Powered by</span>
            <span style={{ fontSize: 9, fontWeight: 800, color: '#dc2626' }}>walt.id</span>
            <span style={{ fontSize: 8, fontWeight: 700, color: '#1e293b', background: '#f1f5f9', border: '1px solid #cbd5e1', borderRadius: 3, padding: '1px 4px' }}>wallet</span>
          </div>
        </div>

      </div>
    </div>
  );
};
