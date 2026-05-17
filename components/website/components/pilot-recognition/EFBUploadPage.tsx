import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, BarChart2, ShieldCheck, RefreshCw, Info } from 'lucide-react';
import { useEFBUpload, EFBFormData, EMPTY_EFB_FORM } from '../../../../src/hooks/useEFBUpload';

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

function NumField({ label, value, onChange, hint }: { label: string; value: number; onChange: (v: number) => void; hint?: string }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {hint && <p style={{ margin: '0 0 0.35rem', fontSize: '0.68rem', color: '#475569' }}>{hint}</p>}
      <input
        type="number"
        min={0}
        value={value || ''}
        onChange={e => onChange(parseFloat(e.target.value) || 0)}
        style={inputStyle}
      />
    </div>
  );
}

const EFB_PROVIDERS = ['ForeFlight', 'Garmin Pilot', 'Jeppesen FliteDeck', 'Naviator', 'AvPlan EFB', 'OzRunways', 'Other / Manual'];

export function EFBUploadPage({ onBack, onNavigate }: Props) {
  const { status, uploadError, tokenId, complexityIndex, previewComplexity, submit, reset } = useEFBUpload();
  const [form, setForm] = useState<EFBFormData>({ ...EMPTY_EFB_FORM });
  const [consented, setConsented] = useState(false);

  function set(field: keyof EFBFormData, value: string | number) {
    const updated = { ...form, [field]: value };
    setForm(updated);
    previewComplexity(updated);
  }

  const totalApproaches = form.ils_approaches + form.rnav_approaches + form.vor_approaches + form.visual_approaches;
  const totalAirspace   = form.class_a_entries + form.class_b_entries + form.class_c_entries + form.oceanic_entries;

  const complexityColor = complexityIndex >= 7 ? '#10b981' : complexityIndex >= 4 ? '#f59e0b' : complexityIndex >= 1 ? '#60a5fa' : '#475569';
  const complexityLabel = complexityIndex >= 7 ? 'High Complexity' : complexityIndex >= 4 ? 'Moderate Complexity' : complexityIndex >= 1 ? 'Low Complexity' : 'No Data';

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
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 12 — EFB Integration</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Log EFB Complexity Data</h1>
          <p style={{ margin: '0.75rem 0 0', fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6 }}>
            Enter operational data from your Electronic Flight Bag. This generates a <strong style={{ color: '#94a3b8' }}>Complexity Index token</strong> that multiplies your verified hours in the UCF proficiency score — rewarding pilots who operate in demanding environments.
          </p>
        </div>

        {/* ── SUCCESS STATE ── */}
        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', background: 'rgba(16,185,129,0.06)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <CheckCircle2 size={26} color="#10b981" />
              <div>
                <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: '#ffffff' }}>EFB Complexity Token Created</p>
                <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8' }}>
                  Complexity Index: <strong style={{ color: complexityColor }}>{complexityIndex}</strong> / 10.0 — {complexityLabel}
                </p>
              </div>
            </div>
            <div style={{ background: 'rgba(15,23,42,0.6)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.72rem', color: '#475569', fontFamily: 'monospace' }}>Token ID: {tokenId}</p>
            </div>
            <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '10px', padding: '0.85rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#38bdf8', lineHeight: 1.6 }}>
                This token is pending plausibility validation. Once cross-referenced against airspace records, the index becomes part of your <strong>UCF Weighted Proficiency Score</strong> on your profile.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
              <button
                onClick={() => onNavigate('pilot-recognition-profile')}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer' }}
              >
                Back to Profile
              </button>
              <button
                onClick={() => { reset(); setForm({ ...EMPTY_EFB_FORM }); setConsented(false); }}
                style={{ padding: '0.65rem 1.25rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}
              >
                <RefreshCw size={13} /> Log Another Period
              </button>
            </div>
          </div>
        )}

        {status !== 'success' && (
          <>
            {/* Live complexity preview */}
            <div style={{ ...card, marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <BarChart2 size={20} color={complexityColor} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 600 }}>Live Complexity Preview</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '1.4rem', fontWeight: 700, color: complexityColor, fontFamily: 'monospace' }}>
                    {complexityIndex.toFixed(1)} <span style={{ fontSize: '0.8rem', color: '#64748b' }}>/ 10.0</span>
                  </p>
                </div>
              </div>
              <span style={{ fontSize: '0.78rem', color: complexityColor, background: `rgba(0,0,0,0.3)`, border: `1px solid ${complexityColor}40`, borderRadius: '999px', padding: '0.3rem 0.85rem' }}>
                {complexityLabel}
              </span>
            </div>

            {/* Provider + Period */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Source & Period</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={labelStyle}>EFB Provider</label>
                  <select
                    value={form.provider_name}
                    onChange={e => set('provider_name', e.target.value)}
                    style={{ ...inputStyle, appearance: 'none' }}
                  >
                    <option value="">Select provider…</option>
                    {EFB_PROVIDERS.map(p => <option key={p} value={p}>{p}</option>)}
                  </select>
                </div>
                <div>
                  <label style={labelStyle}>Period From</label>
                  <input type="date" value={form.period_from} onChange={e => set('period_from', e.target.value)} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Period To</label>
                  <input type="date" value={form.period_to} onChange={e => set('period_to', e.target.value)} style={inputStyle} />
                </div>
              </div>
            </div>

            {/* Approach diversity */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Approach Diversity</p>
                {totalApproaches > 0 && <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>{totalApproaches} total approaches</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <NumField label="ILS Approaches" value={form.ils_approaches} onChange={v => set('ils_approaches', v)} />
                <NumField label="RNAV / GPS Approaches" value={form.rnav_approaches} onChange={v => set('rnav_approaches', v)} />
                <NumField label="VOR Approaches" value={form.vor_approaches} onChange={v => set('vor_approaches', v)} />
                <NumField label="Visual Approaches" value={form.visual_approaches} onChange={v => set('visual_approaches', v)} />
                <NumField label="CAT I Minima Operations" value={form.cat1_minima_operations} onChange={v => set('cat1_minima_operations', v)} hint="Approaches flown at or near decision height" />
              </div>
            </div>

            {/* Airspace exposure */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Airspace Exposure</p>
                {totalAirspace > 0 && <span style={{ fontSize: '0.72rem', color: '#60a5fa' }}>{totalAirspace} entries</span>}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <NumField label="Class A Entries" value={form.class_a_entries} onChange={v => set('class_a_entries', v)} />
                <NumField label="Class B Entries" value={form.class_b_entries} onChange={v => set('class_b_entries', v)} />
                <NumField label="Class C Entries" value={form.class_c_entries} onChange={v => set('class_c_entries', v)} />
                <NumField label="Oceanic / MNPS Entries" value={form.oceanic_entries} onChange={v => set('oceanic_entries', v)} />
              </div>
            </div>

            {/* Weather & route */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Weather & Route Complexity</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
                <NumField label="IMC Hours" value={form.imc_hours} onChange={v => set('imc_hours', v)} />
                <NumField label="Adverse Weather Decisions" value={form.adverse_weather_decisions} onChange={v => set('adverse_weather_decisions', v)} hint="Go-arounds, diversions, or weather holds" />
                <NumField label="Avg Route Waypoints" value={form.avg_route_waypoints} onChange={v => set('avg_route_waypoints', v)} />
                <NumField label="Max Route Distance (NM)" value={form.max_route_distance_nm} onChange={v => set('max_route_distance_nm', v)} />
              </div>
            </div>

            {/* L1 notice */}
            <div style={{ background: 'rgba(245,158,11,0.06)', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
              <Info size={15} color="#f59e0b" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#fcd34d', lineHeight: 1.6 }}>
                This creates a <strong>pending complexity token</strong>. PilotRecognition will cross-reference your approach types and airspace entries against aeronautical chart databases during plausibility validation. Tokens that pass validation become active in your UCF score.
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
                I confirm this EFB data accurately reflects my operational history. I authorise this complexity record to be stored in my Pillar 12 credential wallet and used to calculate my UCF Weighted Proficiency Score.
              </p>
            </div>

            {uploadError && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <AlertCircle size={15} color="#f87171" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#f87171' }}>{uploadError}</p>
              </div>
            )}

            <button
              onClick={() => submit(form)}
              disabled={!consented || status === 'uploading'}
              style={{
                width: '100%', padding: '1rem', borderRadius: '12px', border: 'none',
                background: consented && status !== 'uploading' ? '#0ea5e9' : '#1e293b',
                color: consented && status !== 'uploading' ? '#ffffff' : '#475569',
                fontWeight: 700, fontSize: '0.9rem',
                cursor: consented && status !== 'uploading' ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                transition: 'all 0.2s ease',
              }}
            >
              {status === 'uploading' ? (
                <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Saving Token…</>
              ) : (
                <><ShieldCheck size={16} /> Save EFB Complexity Token</>
              )}
            </button>
          </>
        )}
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        input::placeholder, select option[value=""] { color: #475569; }
        select { color: #ffffff; }
        select option { background: #1e293b; }
      `}</style>
    </div>
  );
}
