import React from 'react';
import { Loader2, ShieldCheck, ShieldAlert, ShieldOff, Clock, CheckCircle2, XCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useVerificationWallet, CheckStatus, VerificationCheck } from '../../../../src/hooks/useVerificationWallet';

interface Props {
  profileData: any;
  isPremium: boolean;
  onNavigate: (page: string) => void;
}

const STATUS_CONFIG: Record<CheckStatus, { label: string; color: string; bgColor: string; borderColor: string; Icon: React.ElementType }> = {
  pending:      { label: 'Not Started',  color: '#94a3b8', bgColor: 'rgba(30,41,59,0.6)',         borderColor: 'rgba(255,255,255,0.08)', Icon: ShieldOff },
  in_review:    { label: 'In Review',    color: '#f59e0b', bgColor: 'rgba(245,158,11,0.08)',       borderColor: 'rgba(245,158,11,0.25)',  Icon: Clock },
  verified:     { label: 'Verified',     color: '#10b981', bgColor: 'rgba(16,185,129,0.08)',       borderColor: 'rgba(16,185,129,0.25)', Icon: CheckCircle2 },
  failed:       { label: 'Action Needed',color: '#ef4444', bgColor: 'rgba(239,68,68,0.08)',        borderColor: 'rgba(239,68,68,0.25)',   Icon: XCircle },
  expired:      { label: 'Expired',      color: '#f97316', bgColor: 'rgba(249,115,22,0.08)',       borderColor: 'rgba(249,115,22,0.25)', Icon: AlertCircle },
  not_required: { label: 'Not Required', color: '#64748b', bgColor: 'rgba(30,41,59,0.4)',          borderColor: 'rgba(255,255,255,0.05)', Icon: ShieldOff },
};

const CHECK_META: Record<string, { icon: string; label: string }> = {
  identity:                 { icon: '🆔', label: 'Identity' },
  education:                { icon: '🎓', label: 'Education' },
  professional_qualification: { icon: '📜', label: 'License & Medical' },
};

function CheckTile({ check }: { check: VerificationCheck }) {
  const cfg = STATUS_CONFIG[check.status] ?? STATUS_CONFIG.pending;
  const meta = CHECK_META[check.check_type] ?? { icon: '🔒', label: check.check_type };
  const Ic = cfg.Icon as React.FC<{ size?: number; color?: string }>;
  return (
    <div style={{
      background: cfg.bgColor,
      borderRadius: '12px',
      padding: '1rem',
      border: `1px solid ${cfg.borderColor}`,
      display: 'flex',
      alignItems: 'center',
      gap: '0.75rem',
    }}>
      <span style={{ fontSize: '1.4rem' }}>{meta.icon}</span>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>{meta.label}</p>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.2rem' }}>
          <Ic size={11} color={cfg.color} />
          <p style={{ margin: 0, fontSize: '0.7rem', color: cfg.color, fontWeight: 500 }}>{cfg.label}</p>
        </div>
        {check.verified_at && (
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#475569' }}>
            {new Date(check.verified_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>
        )}
        {check.notes && (
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#f97316', lineHeight: 1.4 }}>{check.notes}</p>
        )}
      </div>
    </div>
  );
}

const baseCardStyle: React.CSSProperties = {
  background: 'rgba(15, 23, 42, 0.8)',
  borderRadius: '20px',
  padding: '1.5rem',
  border: '1px solid rgba(255,255,255,0.08)',
};

export function VerificationWalletSection({ profileData, isPremium, onNavigate }: Props) {
  const { wallet, loading, initiating, error, refetch, initiateVerification } = useVerificationWallet();

  const walletStatus = wallet?.wallet_status ?? 'not_started';
  const isPreCleared = wallet?.is_pre_cleared ?? false;
  const completeness = wallet?.wallet_completeness_pct ?? 0;
  const checks = wallet?.checks ?? [];
  const hasWallet = wallet !== null;

  const circumference = 163.36;
  const strokeDash = (completeness / 100) * circumference;

  const canStart = !hasWallet || walletStatus === 'not_started';
  const inProgress = walletStatus === 'in_progress';
  const isVerified = walletStatus === 'verified';
  const isPartial = walletStatus === 'partially_verified';

  if (loading) {
    return (
      <div style={{ ...baseCardStyle, display: 'flex', alignItems: 'center', gap: '0.75rem', justifyContent: 'center', padding: '2rem' }}>
        <Loader2 size={18} color="#94a3b8" className="animate-spin" style={{ animation: 'spin 1s linear infinite' }} />
        <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Loading verification wallet…</p>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      {/* Wallet Header Card */}
      <div style={{ ...baseCardStyle }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 11</p>
            <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Verification Wallet</h3>
            <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.82rem', maxWidth: '500px', lineHeight: 1.5 }}>
              {canStart
                ? 'Complete Layer 1 checks once. Your cryptographic attestation tokens are stored in your wallet and shared only with operators you authorise.'
                : inProgress
                ? 'Verification is in progress. Results are returned directly to your wallet. You will receive a notification when each check completes.'
                : isVerified
                ? 'All checks passed. Your wallet is active. Airlines see your Pre-Cleared status on pathway cards.'
                : 'One or more checks require attention. Review the status below and resubmit if required.'}
            </p>
          </div>

          {/* Completeness ring */}
          <div style={{ textAlign: 'center', minWidth: '80px' }}>
            <div style={{ position: 'relative', width: '64px', height: '64px', margin: '0 auto' }}>
              <svg width="64" height="64" viewBox="0 0 64 64" style={{ transform: 'rotate(-90deg)' }}>
                <circle cx="32" cy="32" r="26" fill="none" stroke="#1e293b" strokeWidth="5" />
                <circle cx="32" cy="32" r="26" fill="none"
                  stroke={isVerified ? '#10b981' : isPartial ? '#f59e0b' : inProgress ? '#60a5fa' : '#334155'}
                  strokeWidth="5"
                  strokeDasharray={`${strokeDash} ${circumference}`}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-dasharray 0.5s ease' }}
                />
              </svg>
              <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                {completeness}%
              </div>
            </div>
            <p style={{ margin: '0.4rem 0 0', fontSize: '0.62rem', color: '#94a3b8' }}>Complete</p>
          </div>
        </div>

        {error && (
          <div style={{ marginTop: '1rem', padding: '0.6rem 0.9rem', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px' }}>
            <p style={{ margin: 0, fontSize: '0.78rem', color: '#f87171' }}>{error}</p>
          </div>
        )}
      </div>

      {/* Pre-Cleared Banner */}
      <div style={{
        background: isPreCleared ? 'rgba(16,185,129,0.1)' : inProgress ? 'rgba(96,165,250,0.08)' : 'rgba(30,41,59,0.6)',
        borderRadius: '16px',
        padding: '1.25rem',
        border: `1px solid ${isPreCleared ? 'rgba(16,185,129,0.3)' : inProgress ? 'rgba(96,165,250,0.2)' : 'rgba(255,255,255,0.1)'}`,
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
      }}>
        <div style={{
          width: '48px', height: '48px', borderRadius: '12px',
          background: isPreCleared ? 'rgba(16,185,129,0.2)' : 'rgba(148,163,184,0.1)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0,
        }}>
          {isPreCleared ? <ShieldCheck size={24} color="#10b981" /> : inProgress ? <Clock size={24} color="#60a5fa" /> : <ShieldOff size={24} color="#64748b" />}
        </div>
        <div>
          <p style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>
            {isPreCleared
              ? 'Pre-Cleared Status Active'
              : inProgress
              ? 'Verification In Progress'
              : isPartial
              ? 'Partially Verified — Action Required'
              : 'Pre-Cleared Status Not Yet Active'}
          </p>
          <p style={{ margin: '0.3rem 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.4 }}>
            {isPreCleared
              ? `Airlines see you as Pre-Cleared. 80% faster screening. Wallet activated ${wallet?.pre_cleared_at ? new Date(wallet.pre_cleared_at).toLocaleDateString('en-GB') : ''}.`
              : inProgress
              ? 'Checks are running. You will be notified when results are returned. This typically takes 24–72 hours.'
              : isPartial
              ? 'Some checks passed. Review failed items below and contact support if you believe there is an error.'
              : 'Complete all 3 Layer 1 checks to activate Pre-Cleared status and appear prioritised on pathway cards.'}
          </p>
        </div>
      </div>

      {/* Check Tiles — only show if wallet exists */}
      {hasWallet && checks.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
          {checks.map(check => <CheckTile key={check.id} check={check} />)}
        </div>
      )}

      {/* Quick Links */}
      <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
        <button
          onClick={() => onNavigate('ato-attestation')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          🎓 ATO Attestation
        </button>
        <button
          onClick={() => onNavigate('logbook-upload')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          📋 Import Logbook
        </button>
        <button
          onClick={() => onNavigate('efb-upload')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          🗺 Log EFB Data
        </button>
        <button
          onClick={() => onNavigate('sim-session')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          🖥 Log Sim Session
        </button>
        <button
          onClick={() => onNavigate('verification-conflicts')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.35)', background: 'rgba(245,158,11,0.06)', color: '#f59e0b', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ⚠ Conflict Resolution
        </button>
        <button
          onClick={() => onNavigate('military-transition')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.03)', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ✈ Military Record
        </button>
        <button
          onClick={() => onNavigate('medical-certificate')}
          style={{ padding: '0.55rem 1rem', borderRadius: '999px', border: '1px solid rgba(52,211,153,0.25)', background: 'rgba(52,211,153,0.04)', color: '#6ee7b7', fontSize: '0.78rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
        >
          ♥ Medical Certificate
        </button>
      </div>

      {/* CTA Row */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>

        {/* Insurance Risk Profile */}
        <div style={{ ...baseCardStyle }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Insurance Risk Profile</p>
          <h3 style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
            {(() => {
              const medical = profileData?.medical_status?.toLowerCase() || '';
              const hours = profileData?.total_hours || 0;
              const incidents = profileData?.incident_count || 0;
              const suspensions = profileData?.license_suspension_count || 0;
              if (incidents >= 2 || suspensions >= 1 || medical.includes('special')) return 'High Risk Tier';
              if (incidents === 1 || hours < 250 || !medical.includes('valid')) return 'Moderate Risk Tier';
              if (isPreCleared && hours >= 500) return 'Low Risk Tier';
              return 'Risk Profile Pending';
            })()}
          </h3>
          <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
            {isPreCleared
              ? 'Verified wallet active. Operators and underwriters can evaluate your risk profile based on confirmed credentials.'
              : 'Self-declared data only — unverified fallback placement. Complete cryptographic validation to clear risk flags and unlock lower fleet insurance profile rates.'}
          </p>
        </div>

        {/* Verification CTA */}
        <div style={{ ...baseCardStyle, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Background Screening</p>
            <h3 style={{ margin: '0.5rem 0 0', fontSize: '1rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
              {canStart ? 'Start Verification' : inProgress ? 'Checks In Progress' : isVerified ? 'Verification Complete' : 'Resubmit Checks'}
            </h3>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.8rem', color: '#64748b', lineHeight: 1.5 }}>
              {canStart
                ? `Layer 1 bundle: Identity, Education, and License & Medical. Turnaround: 24–72 hours.${isPremium ? ' Expedited 4–24h available.' : ''}`
                : inProgress
                ? 'Results are being returned by the verification provider. No action required.'
                : isVerified
                ? `Wallet verified. Pre-Cleared since ${wallet?.pre_cleared_at ? new Date(wallet.pre_cleared_at).toLocaleDateString('en-GB') : '—'}.`
                : 'One or more checks failed or expired. Review, then resubmit to restore Pre-Cleared status.'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
            {/* Primary action */}
            {!inProgress && (
              <button
                onClick={() => onNavigate('verification')}
                disabled={initiating}
                style={{
                  padding: '0.7rem 1.4rem',
                  borderRadius: '999px',
                  border: 'none',
                  background: isVerified ? '#334155' : 'linear-gradient(135deg,#e53e3e,#9b1c1c)',
                  boxShadow: isVerified ? 'none' : '0 4px 15px rgba(229,62,62,0.35)',
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '0.82rem',
                  cursor: initiating ? 'not-allowed' : 'pointer',
                  opacity: initiating ? 0.7 : 1,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                {isVerified ? 'Update Verification' : canStart ? 'Begin Verification' : 'Resubmit Checks'}
              </button>
            )}

            {/* Refresh */}
            {hasWallet && (
              <button
                onClick={refetch}
                style={{
                  padding: '0.7rem 1rem',
                  borderRadius: '999px',
                  border: '1px solid rgba(255,255,255,0.1)',
                  background: 'transparent',
                  color: '#94a3b8',
                  fontSize: '0.82rem',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                }}
              >
                <RefreshCw size={13} /> Refresh
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
