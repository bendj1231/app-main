import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, ShieldCheck, RefreshCw, Info, Monitor } from 'lucide-react';
import { useSimSessionUpload, SimSessionFormData, EMPTY_SIM_FORM, ICAO_COMPETENCIES, SESSION_TYPES } from '../../../../src/hooks/useSimSessionUpload';

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

const SIM_PLATFORMS = [
  'Microsoft Flight Simulator 2024',
  'Microsoft Flight Simulator 2020',
  'X-Plane 12',
  'X-Plane 11',
  'Prepar3D v6',
  'VATSIM Session',
  'IVAO Session',
  'Redbird FMX',
  'Elite BATD',
  'Other / Manual',
];

export function SimSessionUploadPage({ onBack, onNavigate }: Props) {
  const { status, uploadError, tokenId, submit, reset } = useSimSessionUpload();
  const [form, setForm] = useState<SimSessionFormData>({ ...EMPTY_SIM_FORM });
  const [consented, setConsented] = useState(false);

  function set(field: keyof SimSessionFormData, value: string | number | string[]) {
    setForm(prev => ({ ...prev, [field]: value }));
  }

  function toggleCompetency(code: string) {
    const current = form.competency_tags;
    set('competency_tags', current.includes(code)
      ? current.filter(c => c !== code)
      : [...current, code]
    );
  }

  const canSubmit = consented && form.session_date && form.duration_minutes > 0 && status !== 'uploading';

  return (
    <div style={dark}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button
          onClick={status === 'success' ? () => onNavigate('pilot-recognition-profile') : onBack}
          style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Title */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 12 — Simulation Integration</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Log Simulation Session</h1>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Record a simulation session and tag it to ICAO CBTA competencies. Sessions create <strong style={{ color: '#94a3b8' }}>Level 2 tokens</strong>. An ATO instructor can countersign to elevate to Level 3 — making the session visible as evidence in your competency profile.
          </p>
        </div>

        {/* ── SUCCESS STATE ── */}
        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <CheckCircle2 size={26} color="#10b981" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>Simulation Session Token Created</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Level 2 token saved · {form.competency_tags.length} competency tag{form.competency_tags.length !== 1 ? 's' : ''} recorded
                </p>
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>Token ID: {tokenId}</p>
            </div>
            {form.competency_tags.length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem' }}>
                {form.competency_tags.map(code => {
                  const comp = ICAO_COMPETENCIES.find(c => c.code === code);
                  return (
                    <span key={code} style={{ fontSize: '0.72rem', color: '#a78bfa', background: 'rgba(167,139,250,0.1)', border: '1px solid rgba(167,139,250,0.25)', borderRadius: '6px', padding: '0.2rem 0.55rem', fontFamily: 'monospace' }}>
                      {code} — {comp?.label}
                    </span>
                  );
                })}
              </div>
            )}
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#38bdf8', lineHeight: 1.6 }}>
                <strong>Next step:</strong> Request an ATO instructor to countersign this session via <strong>ATO Attestation</strong> to elevate from Level 2 → Level 3.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                onClick={() => onNavigate('ato-attestation')}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Request Countersignature
              </button>
              <button
                onClick={() => { reset(); setForm({ ...EMPTY_SIM_FORM }); setConsented(false); }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={13} /> Log Another Session
              </button>
            </div>
          </div>
        )}

        {status !== 'success' && (
          <>
            {/* Session details */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Session Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                {/* Platform */}
                <div>
                  <label style={labelStyle}>Simulation Platform</label>
                  <select value={form.provider_name} onChange={e => set('provider_name', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    <option value="">Select platform…</option>
                    {SIM_PLATFORMS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                {/* Session type */}
                <div>
                  <label style={labelStyle}>Session Type</label>
                  <select value={form.session_type} onChange={e => set('session_type', e.target.value)} style={{ ...inputStyle, appearance: 'none' }}>
                    {SESSION_TYPES.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
                  </select>
                </div>
                {/* Aircraft */}
                <div>
                  <label style={labelStyle}>Aircraft Type (optional)</label>
                  <input type="text" placeholder="e.g. A320, B737, C172" value={form.aircraft_type} onChange={e => set('aircraft_type', e.target.value)} style={inputStyle} />
                </div>
                {/* Date */}
                <div>
                  <label style={labelStyle}>Session Date <span style={{ color: '#ef4444' }}>*</span></label>
                  <input type="date" value={form.session_date} onChange={e => set('session_date', e.target.value)} style={inputStyle} />
                </div>
                {/* Duration */}
                <div>
                  <label style={labelStyle}>Duration (minutes) <span style={{ color: '#ef4444' }}>*</span></label>
                  <input
                    type="number" min={1} placeholder="e.g. 90"
                    value={form.duration_minutes || ''}
                    onChange={e => set('duration_minutes', parseInt(e.target.value) || 0)}
                    style={inputStyle}
                  />
                </div>
              </div>
              {/* Scenario description */}
              <div style={{ marginTop: '1rem' }}>
                <label style={labelStyle}>Scenario Description (optional)</label>
                <textarea
                  rows={3}
                  placeholder="e.g. IFR departure from RPLL, diversion to RPMD due to weather, ILS CAT I approach…"
                  value={form.scenario_description}
                  onChange={e => set('scenario_description', e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.5 }}
                />
              </div>
            </div>

            {/* ICAO Competency Tags */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <div style={{ marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>ICAO CBTA Competency Tags</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#475569' }}>Select all competencies this session evidenced. These tags are used to map your sim evidence to the 9 ICAO core competencies.</p>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.6rem' }}>
                {ICAO_COMPETENCIES.map(comp => {
                  const selected = form.competency_tags.includes(comp.code);
                  return (
                    <div
                      key={comp.code}
                      onClick={() => toggleCompetency(comp.code)}
                      style={{
                        padding: '0.7rem 0.9rem',
                        borderRadius: '10px',
                        border: `1px solid ${selected ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.08)'}`,
                        background: selected ? 'rgba(167,139,250,0.08)' : 'rgba(30,41,59,0.4)',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.65rem',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      <div style={{
                        width: '18px', height: '18px', borderRadius: '5px', flexShrink: 0,
                        background: selected ? '#a78bfa' : 'transparent',
                        border: `2px solid ${selected ? '#a78bfa' : '#334155'}`,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        transition: 'all 0.15s ease',
                      }}>
                        {selected && <CheckCircle2 size={11} color="#fff" />}
                      </div>
                      <div style={{ minWidth: 0 }}>
                        <p style={{ margin: 0, fontSize: '0.72rem', fontFamily: 'monospace', color: selected ? '#c4b5fd' : '#64748b', fontWeight: 700 }}>{comp.code}</p>
                        <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: selected ? '#e2d9f3' : '#94a3b8', lineHeight: 1.3 }}>{comp.label}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              {form.competency_tags.length > 0 && (
                <p style={{ margin: '0.75rem 0 0', fontSize: '0.75rem', color: '#a78bfa' }}>
                  {form.competency_tags.length} competenc{form.competency_tags.length !== 1 ? 'ies' : 'y'} tagged
                </p>
              )}
            </div>

            {/* L2 notice */}
            <div style={{ background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
              <Info size={15} color="#60a5fa" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#93c5fd', lineHeight: 1.6 }}>
                Simulation sessions are saved as <strong>Level 2 — Device-Verified</strong> tokens. To count as formal CBTA evidence for airline applications, request an ATO instructor countersignature to elevate to Level 3.
              </p>
            </div>

            {/* Consent */}
            <div
              onClick={() => setConsented(v => !v)}
              style={{
                background: consented ? 'rgba(16,185,129,0.06)' : 'rgba(30,41,59,0.6)',
                border: `1px solid ${consented ? 'rgba(16,185,129,0.3)' : 'rgba(255,255,255,0.1)'}`,
                borderRadius: '12px', padding: '1rem 1.25rem', cursor: 'pointer',
                display: 'flex', alignItems: 'flex-start', gap: '0.85rem',
                marginBottom: '1.25rem', transition: 'all 0.2s ease',
              }}
            >
              <div style={{
                width: '20px', height: '20px', borderRadius: '6px', flexShrink: 0, marginTop: '0.1rem',
                background: consented ? '#10b981' : 'transparent',
                border: `2px solid ${consented ? '#10b981' : '#475569'}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s ease',
              }}>
                {consented && <CheckCircle2 size={13} color="#fff" />}
              </div>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: 1.6, userSelect: 'none' }}>
                I confirm this simulation session data is accurate. I authorise this record to be stored in my Pillar 12 credential wallet and used as CBTA competency evidence in my professional profile.
              </p>
            </div>

            {!form.session_date && form.session_type && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: '0.75rem' }}>Session date is required.</p>
            )}

            {uploadError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <AlertCircle size={15} color="#f87171" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{uploadError}</p>
              </div>
            )}

            <button
              onClick={() => submit(form)}
              disabled={!canSubmit}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                background: canSubmit ? '#0ea5e9' : '#1e293b',
                color: canSubmit ? '#ffffff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem',
                cursor: canSubmit ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'uploading' ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving Session…</>
              ) : (
                <><ShieldCheck size={16} /> Save Simulation Session Token</>
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder { color: #475569; }
        textarea::placeholder { color: #475569; }
        select { color: #ffffff; }
        select option { background: #1e293b; }
      `}</style>
    </div>
  );
}
