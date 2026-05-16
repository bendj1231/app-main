import React, { useState } from 'react';
import { ArrowLeft, ShieldCheck, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { useVerificationWallet } from '../../../../src/hooks/useVerificationWallet';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const CHECKS = [
  {
    type: 'identity',
    icon: '🆔',
    label: 'Identity Verification',
    desc: 'Government-issued ID cross-referenced against national identity registries. Confirms full name, date of birth, and nationality.',
    dataPoints: ['Full name', 'Date of birth', 'Nationality / citizenship', 'Residential address'],
  },
  {
    type: 'education',
    icon: '🎓',
    label: 'Education & Training',
    desc: 'Confirms flight training institution attendance, course completion dates, and graduating credentials.',
    dataPoints: ['Flight school name & address', 'Enrollment and completion dates', 'Country of training'],
  },
  {
    type: 'professional_qualification',
    icon: '📜',
    label: 'License & Medical',
    desc: 'Cross-references CAAP, FAA, or issuing authority registry in real-time to confirm license validity, class ratings, and medical certificate status.',
    dataPoints: ['License number & type', 'Issuing authority (CAAP, FAA, EASA…)', 'Medical class & expiry', 'Aircraft ratings', 'Radio license number'],
  },
];

export function VerificationInitiatePage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const { wallet, loading, initiating, error, initiateVerification } = useVerificationWallet();
  const [consented, setConsented] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const walletStatus = wallet?.wallet_status;
  const alreadyActive = walletStatus === 'in_progress' || walletStatus === 'verified';

  async function handleSubmit() {
    if (!consented) return;
    await initiateVerification();
    setSubmitted(true);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>

      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={onBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 11 — Verification Wallet</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal', color: '#ffffff' }}>Layer 1 Background Screening</h1>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Layer 1 is the personal verification bundle. It runs three checks against primary source registries. Results are returned as cryptographic attestation tokens deposited directly into your Verification Wallet. No raw data is stored on PilotRecognition servers.
          </p>
        </div>

        {loading && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '1.5rem 0' }}>
            <Loader2 size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ margin: 0, color: '#64748b' }}>Loading wallet status…</p>
          </div>
        )}

        {/* Already active state */}
        {!loading && alreadyActive && !submitted && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '1.5rem', marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <ShieldCheck size={22} color="#10b981" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
            <div>
              <p style={{ margin: 0, fontWeight: 600, color: '#ffffff' }}>
                {walletStatus === 'verified' ? 'Verification Complete' : 'Verification In Progress'}
              </p>
              <p style={{ margin: '0.4rem 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {walletStatus === 'verified'
                  ? 'Your wallet is verified. All 3 Layer 1 checks passed. You can resubmit to renew checks as credentials expire.'
                  : 'Your Layer 1 checks are currently running. Results are returned directly to your wallet — no action required. Check back in 24–72 hours.'}
              </p>
              <button
                onClick={() => onNavigate('pilot-recognition-profile')}
                style={{ marginTop: '1rem', padding: '0.65rem 1.25rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Back to Profile
              </button>
            </div>
          </div>
        )}

        {/* Success state after submission */}
        {submitted && !error && (
          <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '16px', padding: '1.75rem', display: 'flex', gap: '1rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontSize: '1.05rem', fontWeight: 600, color: '#ffffff' }}>Verification Submitted</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#94a3b8', lineHeight: 1.5 }}>
                Your Layer 1 bundle has been submitted. The verification provider will query CAAP and national registries and return results to your wallet. Turnaround is typically 24–72 hours. You will receive a notification when each check completes.
              </p>
              <button
                onClick={() => onNavigate('pilot-recognition-profile')}
                style={{ marginTop: '1.25rem', padding: '0.7rem 1.4rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Return to Profile
              </button>
            </div>
          </div>
        )}

        {/* Main form — show when not submitted and not already active */}
        {!loading && !(alreadyActive && !submitted) && !submitted && (
          <>
            {/* What's included */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {CHECKS.map(check => (
                <div key={check.type} style={{ background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.85rem' }}>
                    <span style={{ fontSize: '1.5rem', flexShrink: 0 }}>{check.icon}</span>
                    <div style={{ flex: 1 }}>
                      <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{check.label}</p>
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#64748b', lineHeight: 1.5 }}>{check.desc}</p>
                      <div style={{ marginTop: '0.75rem', display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                        {check.dataPoints.map(dp => (
                          <span key={dp} style={{ fontSize: '0.7rem', color: '#94a3b8', background: 'rgba(148,163,184,0.08)', border: '1px solid rgba(148,163,184,0.15)', borderRadius: '6px', padding: '0.2rem 0.55rem' }}>{dp}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Zero-Custody Notice */}
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.75rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#38bdf8', lineHeight: 1.6 }}>
                <strong>Zero-Custody Architecture:</strong> PilotRecognition never stores your raw license files, medical certificates, or logbook data. The verification provider queries primary registries (CAAP, NBI, etc.) as an independent data controller. Only the resulting attestation token — a cryptographic confirmation of the result — is deposited into your wallet. The underlying data never leaves the registry or your device.
              </p>
            </div>

            {/* Consent Checkbox */}
            <div
              onClick={() => setConsented(v => !v)}
              style={{
                background: consented ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${consented ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px',
                padding: '1rem 1.25rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'flex-start',
                gap: '0.85rem',
                marginBottom: '1.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '0.1rem',
                background: consented ? '#10b981' : 'transparent',
                border: `2px solid ${consented ? '#10b981' : '#475569'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'all 0.2s ease',
              }}>
                {consented && <CheckCircle2 size={13} color="#fff" />}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, userSelect: 'none' }}>
                I authorise PilotRecognition to submit my profile data to the verification provider for the purpose of conducting the Layer 1 Identity, Education, and License & Medical checks. I understand that the provider will query primary registry sources directly, and that only the resulting pass/fail attestation tokens will be returned to my wallet. I can withdraw consent at any time by contacting support.
              </p>
            </div>

            {/* Error banner */}
            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <AlertCircle size={16} color="#f87171" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{error}</p>
              </div>
            )}

            {/* Submit */}
            <button
              onClick={handleSubmit}
              disabled={!consented || initiating || !currentUser}
              style={{
                width: '100%',
                padding: '1rem',
                borderRadius: '12px',
                border: 'none',
                background: consented && !initiating ? '#0ea5e9' : '#1e293b',
                color: consented && !initiating ? '#ffffff' : '#475569',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: consented && !initiating ? 'pointer' : 'not-allowed',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              {initiating ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</>
              ) : (
                <><ShieldCheck size={16} /> Submit Layer 1 Verification Bundle</>
              )}
            </button>

            {!currentUser && (
              <p style={{ marginTop: '0.75rem', fontSize: '0.78rem', color: '#f87171', textAlign: 'center' }}>
                You must be signed in to initiate verification.
              </p>
            )}
          </>
        )}

      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
