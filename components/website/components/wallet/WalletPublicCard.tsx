import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/shared/supabase';

interface WalletProfile {
  display_name: string;
  license_id: string | null;
  license_types: string[] | null;
  license_expiry: string | null;
  country_of_license: string | null;
  medical_class: string | null;
  medical_expiry: string | null;
  total_flight_hours: number | null;
  english_proficiency_level: string | null;
  language_icao_level: string | null;
  profile_token: string | null;
  profile_token_generated_at: string | null;
  profile_image_url: string | null;
  verified_account: boolean | null;
  ratings: string[] | null;
}

const StatusBadge: React.FC<{ status: 'verified' | 'expired' | 'unset' | 'pending'; label: string }> = ({ status, label }) => {
  const config = {
    verified: { bg: '#f0fdf4', border: '#86efac', text: '#166534', dot: '#16a34a', icon: '✓' },
    expired:  { bg: '#fef2f2', border: '#fca5a5', text: '#991b1b', dot: '#dc2626', icon: '!' },
    unset:    { bg: '#f8fafc', border: '#e2e8f0', text: '#94a3b8', dot: '#cbd5e1', icon: '—' },
    pending:  { bg: '#fffbeb', border: '#fcd34d', text: '#92400e', dot: '#d97706', icon: '⏳' },
  }[status];

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 12px', background: config.bg, border: `1px solid ${config.border}`, borderRadius: 8 }}>
      <span style={{ width: 7, height: 7, borderRadius: '50%', background: config.dot, flexShrink: 0 }} />
      <span style={{ fontSize: 12, fontWeight: 700, color: config.text, letterSpacing: '0.04em' }}>{label}</span>
    </div>
  );
};

const isExpired = (dateStr: string | null) => {
  if (!dateStr) return false;
  return new Date(dateStr) < new Date();
};

const formatDate = (dateStr: string | null) => {
  if (!dateStr) return '—';
  return new Date(dateStr).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export const WalletPublicCard: React.FC<{ token: string; onManage: () => void }> = ({ token, onManage }) => {
  const [profile, setProfile] = useState<WalletProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from('profiles')
        .select('display_name, license_id, license_types, license_expiry, country_of_license, medical_class, medical_expiry, total_flight_hours, english_proficiency_level, language_icao_level, profile_token, profile_token_generated_at, profile_image_url, verified_account, ratings')
        .eq('profile_token', token)
        .maybeSingle();

      if (error || !data) {
        setNotFound(true);
      } else {
        setProfile(data as WalletProfile);
      }
      setLoading(false);
    };
    fetch();
  }, [token]);

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.15)', borderTopColor: '#dc2626', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 13 }}>Loading credential…</p>
        </div>
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (notFound || !profile) {
    return (
      <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{ fontSize: 48, marginBottom: 16 }}>🔒</div>
          <h1 style={{ color: 'white', fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Credential Not Found</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: 14, lineHeight: 1.6 }}>
            This token doesn't match any pilot on record, or the pilot has not yet generated their credential token.
          </p>
        </div>
      </div>
    );
  }

  const licenseStatus = profile.license_id
    ? isExpired(profile.license_expiry) ? 'expired' : 'verified'
    : 'unset';

  const medicalStatus = profile.medical_class
    ? isExpired(profile.medical_expiry) ? 'expired' : 'verified'
    : 'unset';

  const elpStatus = profile.language_icao_level && profile.language_icao_level !== 'None'
    ? 'verified' : 'unset';

  const initials = (profile.display_name || 'P').charAt(0).toUpperCase();

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px 16px' }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* Header bar */}
      <div style={{ width: '100%', maxWidth: 600, display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#dc2626', textTransform: 'uppercase' }}>PilotRecognition PIC</span>
        </div>
        <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.25)', letterSpacing: '0.1em' }}>READ ONLY · PUBLIC VIEW</span>
      </div>

      {/* Main card */}
      <div style={{ width: '100%', maxWidth: 600, background: 'white', borderRadius: 16, overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.5)' }}>
        {/* Red top bar */}
        <div style={{ height: 5, background: 'linear-gradient(90deg, #dc2626, #ef4444)' }} />

        {/* Pilot identity */}
        <div style={{ padding: '28px 28px 20px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: profile.profile_image_url ? 'transparent' : '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, overflow: 'hidden', border: '2px solid #e2e8f0' }}>
            {profile.profile_image_url
              ? <img src={profile.profile_image_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              : <span style={{ fontSize: 22, fontWeight: 800, color: 'white' }}>{initials}</span>
            }
          </div>
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: 20, fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {profile.display_name || 'Pilot'}
            </h1>
            <p style={{ fontSize: 12, color: '#64748b', margin: '3px 0 0', fontWeight: 500 }}>
              {profile.license_types?.join(', ') || 'Pilot'}{profile.country_of_license ? ` · ${profile.country_of_license}` : ''}
            </p>
          </div>
          {profile.verified_account && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 10px', background: '#f0fdf4', border: '1px solid #86efac', borderRadius: 20 }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
              <span style={{ fontSize: 10, fontWeight: 800, color: '#166534', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pre-Cleared</span>
            </div>
          )}
        </div>

        {/* Credential rows */}
        <div style={{ padding: '20px 28px' }}>
          <p style={{ fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase', marginBottom: 12 }}>Verified Credentials</p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {/* License */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>Pilot License</p>
                <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>
                  {profile.license_id || 'Not provided'}{profile.license_expiry ? ` · Exp ${formatDate(profile.license_expiry)}` : ''}
                </p>
              </div>
              <StatusBadge
                status={licenseStatus}
                label={licenseStatus === 'verified' ? 'Verified' : licenseStatus === 'expired' ? 'Expired' : 'Not Set'}
              />
            </div>

            {/* Medical */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>Medical Certificate</p>
                <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>
                  {profile.medical_class ? `Class ${profile.medical_class}` : 'Not provided'}{profile.medical_expiry ? ` · Exp ${formatDate(profile.medical_expiry)}` : ''}
                </p>
              </div>
              <StatusBadge
                status={medicalStatus}
                label={medicalStatus === 'verified' ? 'Valid' : medicalStatus === 'expired' ? 'Expired' : 'Not Set'}
              />
            </div>

            {/* ELP */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>English Language Proficiency</p>
                <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>
                  {profile.language_icao_level && profile.language_icao_level !== 'None' ? `ICAO ${profile.language_icao_level}` : 'Not provided'}
                </p>
              </div>
              <StatusBadge status={elpStatus} label={elpStatus === 'verified' ? 'Verified' : 'Not Set'} />
            </div>

            {/* Flight Hours */}
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: '#f8fafc', borderRadius: 10, border: '1px solid #e2e8f0' }}>
              <div>
                <p style={{ fontSize: 11, fontWeight: 700, color: '#0f172a', margin: 0 }}>Total Flight Hours</p>
                <p style={{ fontSize: 10, color: '#64748b', margin: '2px 0 0' }}>
                  {profile.ratings?.length ? profile.ratings.join(', ') : 'Ratings not listed'}
                </p>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 900, color: '#0f172a' }}>{profile.total_flight_hours ?? '—'}</span>
                <span style={{ fontSize: 10, color: '#64748b', fontWeight: 600 }}>hrs</span>
              </div>
            </div>
          </div>
        </div>

        {/* Token fingerprint footer */}
        <div style={{ padding: '14px 28px 20px', borderTop: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
          <div>
            <p style={{ fontSize: 9, fontWeight: 700, color: '#94a3b8', letterSpacing: '0.15em', textTransform: 'uppercase', margin: 0 }}>Record Fingerprint</p>
            <p style={{ fontSize: 10, fontFamily: 'monospace', color: '#475569', margin: '3px 0 0' }}>
              {token.length > 20 ? `${token.slice(0, 10)}…${token.slice(-8)}` : token}
            </p>
            {profile.profile_token_generated_at && (
              <p style={{ fontSize: 9, color: '#94a3b8', margin: '2px 0 0' }}>
                Generated {formatDate(profile.profile_token_generated_at)} · SHA-256 · AES-256-GCM
              </p>
            )}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            <span style={{ fontSize: 9, color: '#94a3b8', fontWeight: 600, letterSpacing: '0.1em' }}>PILOT-OWNED DATA</span>
          </div>
        </div>

        {/* Manage wallet CTA */}
        <div style={{ padding: '0 28px 24px' }}>
          <button
            onClick={onManage}
            style={{ width: '100%', padding: '11px 0', background: '#0f172a', color: 'white', border: 'none', borderRadius: 10, fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'background 0.15s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = '#dc2626'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = '#0f172a'; }}
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Manage My PIC — Passkey Required
          </button>
          <p style={{ textAlign: 'center', fontSize: 9, color: '#94a3b8', margin: '8px 0 0', letterSpacing: '0.05em' }}>
            Airlines and operators see only this read-only view · Your raw data is never shared
          </p>
        </div>
      </div>
    </div>
  );
};
