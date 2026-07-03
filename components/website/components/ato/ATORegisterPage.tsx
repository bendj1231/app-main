import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Building2, ShieldCheck, Info } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const dark: React.CSSProperties = {
  minHeight: '100vh',
  background: '#0f172a',
  color: '#ffffff',
  fontFamily: 'system-ui, sans-serif',
};

const card: React.CSSProperties = {
  background: 'rgba(15,23,42,0.8)',
  border: '1px solid rgba(255,255,255,0.08)',
  borderRadius: '16px',
  padding: '1.5rem',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  boxSizing: 'border-box',
  padding: '0.65rem 0.9rem',
  borderRadius: '10px',
  border: '1px solid rgba(255,255,255,0.1)',
  background: 'rgba(30,41,59,0.6)',
  color: '#ffffff',
  fontSize: '0.85rem',
  outline: 'none',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.75rem',
  color: '#94a3b8',
  marginBottom: '0.35rem',
  fontWeight: 600,
};

const TIERS = [
  {
    key: 'basic',
    label: 'Basic',
    price: 'Free',
    features: ['Profile in training directory', 'Graduate linkage enabled', 'Public placement listing'],
    color: '#64748b',
  },
  {
    key: 'analytics',
    label: 'Analytics',
    price: '$500 / yr',
    features: ['Graduate tracking dashboard', 'Pathway alignment metrics', 'Audited placement rate verification'],
    color: '#0ea5e9',
  },
  {
    key: 'enterprise',
    label: 'Enterprise',
    price: '$1,000 / yr + $20/referral',
    features: ['Verified Issuer status', 'Cryptographic token issuance', 'Recognition-Ready designation', 'CRM integration', 'Co-branded graduation credentials'],
    color: '#10b981',
  },
];

const AUTHORITIES = ['CAAP', 'GCAA', 'CASA', 'CAA (UK)', 'FAA', 'EASA', 'DGCA', 'SACAA', 'JCAB', 'TCCA', 'Other'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function ATORegisterPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState('basic');

  const [form, setForm] = useState({
    institution_name: '',
    country: '',
    city: '',
    website: '',
    contact_email: '',
    contact_name: '',
    ato_certificate_number: '',
    issuing_authority: '',
    estimated_graduates_per_year: '',
    motivation: '',
  });

  function set(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  const canSubmit = form.institution_name && form.country && form.contact_email && form.contact_name;

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting');
    setError(null);

    try {
      await callApi('queryTable', {
        table: 'ato_applications',
        operation: 'insert',
        data: {
          applicant_user_id: currentUser?.id ?? null,
          institution_name: form.institution_name,
          country: form.country,
          city: form.city || null,
          website: form.website || null,
          contact_email: form.contact_email,
          contact_name: form.contact_name,
          ato_certificate_number: form.ato_certificate_number || null,
          issuing_authority: form.issuing_authority || null,
          estimated_graduates_per_year: form.estimated_graduates_per_year ? parseInt(form.estimated_graduates_per_year) : null,
          requested_tier: selectedTier,
          motivation: form.motivation || null,
          status: 'submitted',
        },
      });
      setStatus('success');
    } catch (e: any) {
      setError(e?.message ?? 'Submission failed.');
      setStatus('error');
    }
  }

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 5 — Flight Training Organizations</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Register Your ATO</h1>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Join the PilotRecognition network as a Recognition-Ready institution. Connect your graduates to verified operator pathways and become a trusted Verification Node in the aviation credential ecosystem.
          </p>
        </div>

        {/* ── SUCCESS ── */}
        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start', marginBottom: '1rem' }}>
              <CheckCircle2 size={24} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem' }}>Application Submitted</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  Your application for <strong>{form.institution_name}</strong> has been received. The PilotRecognition team will review and contact <strong>{form.contact_email}</strong> within 3 business days.
                </p>
              </div>
            </div>
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#38bdf8', lineHeight: 1.6 }}>
                Once approved, your institution will appear in the Recognition-Ready ATO directory and you'll gain access to your admin dashboard. Enterprise accounts receive Verified Issuer credentials for cryptographic token issuance.
              </p>
            </div>
          </div>
        )}

        {status !== 'success' && (
          <>
            {/* Tier selector */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Your Tier</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {TIERS.map(tier => {
                  const selected = selectedTier === tier.key;
                  return (
                    <div
                      key={tier.key}
                      onClick={() => setSelectedTier(tier.key)}
                      style={{
                        border: `1px solid ${selected ? tier.color : 'rgba(255,255,255,0.08)'}`,
                        background: selected ? `rgba(0,0,0,0.3)` : 'rgba(30,41,59,0.3)',
                        borderRadius: '12px', padding: '1rem',
                        cursor: 'pointer', transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: selected ? tier.color : '#94a3b8', fontSize: '0.9rem' }}>{tier.label}</p>
                        {selected && <CheckCircle2 size={15} color={tier.color} />}
                      </div>
                      <p style={{ margin: '0 0 0.75rem', fontSize: '0.8rem', color: selected ? '#ffffff' : '#475569', fontWeight: 600 }}>{tier.price}</p>
                      {tier.features.map(f => (
                        <p key={f} style={{ margin: '0.2rem 0', fontSize: '0.72rem', color: selected ? '#cbd5e1' : '#475569', display: 'flex', gap: '0.35rem' }}>
                          <span style={{ color: selected ? tier.color : '#334155', flexShrink: 0 }}>→</span> {f}
                        </p>
                      ))}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Institution details */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Institution Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Institution Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="e.g. WCC Aviation College" value={form.institution_name} onChange={e => set('institution_name', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Country <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="e.g. Philippines" value={form.country} onChange={e => set('country', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>City</label>
                  <input type="text" placeholder="e.g. Binalonan, Pangasinan" value={form.city} onChange={e => set('city', e.target.value)} style={inputStyle} />
                </div>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={labelStyle}>Website</label>
                  <input type="url" placeholder="https://yourschool.com" value={form.website} onChange={e => set('website', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Regulatory */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Regulatory Information</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>ATO Certificate Number</label>
                  <input type="text" placeholder="e.g. CAAP-ATO-0042" value={form.ato_certificate_number} onChange={e => set('ato_certificate_number', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Issuing Authority</label>
                  <select value={form.issuing_authority} onChange={e => set('issuing_authority', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">Select authority…</option>
                    {AUTHORITIES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Estimated Graduates / Year</label>
                  <input type="number" min={1} placeholder="e.g. 50" value={form.estimated_graduates_per_year} onChange={e => set('estimated_graduates_per_year', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Contact */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Contact</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>Contact Name <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="text" placeholder="Full name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Contact Email <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="email" placeholder="admin@yourschool.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Motivation */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <label style={labelStyle}>Why are you joining the PilotRecognition network? (optional)</label>
              <textarea
                rows={4}
                placeholder="Tell us about your institution, your graduates, and what you want to achieve through the partnership…"
                value={form.motivation}
                onChange={e => set('motivation', e.target.value)}
                style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
              />
            </div>

            {/* Ecosystem dividend callout */}
            <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
              <Info size={15} color="#10b981" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#6ee7b7', lineHeight: 1.6 }}>
                <strong>Enterprise Dividend:</strong> For every graduate who activates a Recognition+ profile, your institution earns a <strong>$20 ecosystem dividend</strong>. 50 graduates = cost-neutral. 300 graduates = $6,000 net revenue against a $1,000 annual fee.
              </p>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <AlertCircle size={15} color="#f87171" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{error}</p>
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={!canSubmit || status === 'submitting'}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                background: canSubmit && status !== 'submitting' ? '#0ea5e9' : '#1e293b',
                color: canSubmit && status !== 'submitting' ? '#ffffff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem',
                cursor: canSubmit && status !== 'submitting' ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'submitting' ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting Application…</>
              ) : (
                <><Building2 size={16} /> Submit ATO Application</>
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, textarea::placeholder { color: #475569; }
        select { color: #ffffff; }
        select option { background: #1e293b; }
      `}</style>
    </div>
  );
}
