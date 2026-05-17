import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Building2, Info } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };

const OEM_TYPES = [
  { key: 'airframe', label: 'Airframe / Aircraft Manufacturer', eg: 'Airbus, Boeing, Embraer, ATR' },
  { key: 'engine', label: 'Engine Manufacturer', eg: 'CFM, Rolls-Royce, P&W, GE' },
  { key: 'avionics', label: 'Avionics / Flight Deck Systems', eg: 'Honeywell, Garmin, Thales' },
  { key: 'simulator', label: 'Full Flight Simulator OEM', eg: 'CAE, L3Harris, TRU Simulation' },
  { key: 'maintenance', label: 'MRO / Maintenance OEM', eg: 'ST Engineering, Lufthansa Technik' },
  { key: 'other', label: 'Other Aviation Manufacturer', eg: 'Components, tooling, ground equipment' },
];

const TIERS = [
  {
    key: 'standard',
    label: 'Standard',
    price: 'Free to register',
    color: '#64748b',
    features: ['OEM company profile on platform', 'Publish type rating pathway cards', '"OEM Verified Graduate" badge on linked training centers', 'Manual pilot supply/demand reports (quarterly)'],
  },
  {
    key: 'enterprise_intel',
    label: 'Enterprise Intel',
    price: 'Custom pricing',
    color: '#0ea5e9',
    features: ['Live pilot supply/demand data by aircraft type', 'Type rating pursuit trends — 18 months forward-looking', 'Regional crew shortage heat maps', 'Anonymous EBT competency aggregates by fleet type', 'API access to platform trend data'],
  },
  {
    key: 'strategic',
    label: 'Strategic Partner',
    price: 'Enterprise agreement',
    color: '#10b981',
    features: ['All Enterprise Intel features', 'Co-develop "OEM Verified Graduate" pathway programs', 'Targeted reach to pilots actively evaluating type ratings', 'Priority OEM profile placement and fleet news distribution', 'Input to platform EBT curriculum development', 'Sim-to-airline performance correlation research access'],
  },
];

const DATA_SCOPES = [
  'type_rating_demand', 'pathway_trends', 'regional_supply',
  'ebt_competency_aggregates', 'fleet_transition_signals', 'training_pipeline_data',
];

const DATA_SCOPE_LABELS: Record<string, string> = {
  type_rating_demand: 'Type Rating Demand Signals',
  pathway_trends: 'Pathway Card Trend Data',
  regional_supply: 'Regional Pilot Supply / Demand',
  ebt_competency_aggregates: 'Anonymous EBT Competency Aggregates',
  fleet_transition_signals: 'Fleet Transition Forward Signals',
  training_pipeline_data: 'Training Pipeline Intelligence',
};

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function OEMPartnerRegisterPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [tier, setTier] = useState('standard');
  const [oemType, setOemType] = useState('');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ company_name: '', headquarters_country: '', website: '', contact_email: '', contact_name: '' });
  const [aircraftFamilies, setAircraftFamilies] = useState<string[]>([]);
  const [newFamily, setNewFamily] = useState('');
  const [dataScopes, setDataScopes] = useState<string[]>([]);
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const canSubmit = form.company_name && form.headquarters_country && form.contact_email && oemType;

  function toggleScope(s: string) { setDataScopes(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); }

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const slug = form.company_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      const { error: err } = await supabase.from('oem_partners').insert({
        admin_user_id: currentUser?.id ?? null,
        company_name: form.company_name, slug,
        headquarters_country: form.headquarters_country,
        website: form.website || null,
        contact_email: form.contact_email,
        contact_name: form.contact_name || null,
        oem_type: oemType,
        aircraft_families: aircraftFamilies.length ? aircraftFamilies : null,
        tier,
        data_access_scope: dataScopes.length ? dataScopes : null,
        status: 'pending',
      });
      if (err) throw err;
      setStatus('success');
    } catch (e: any) { setError(e?.message ?? 'Submission failed.'); setStatus('error'); }
  }

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><ArrowLeft size={16} /> Back</button>
      </div>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 15 — Manufacturers & OEMs</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>OEM & Manufacturer Partner Registration</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          When you pitch a $10 billion aircraft order, the airline's board asks one question: <em>"Do we have the crew to operate these in 24 months?"</em> PilotRecognition is the only platform that answers that question with live, verified data. Register your organisation to access the intelligence layer your sales cycle depends on.
        </p>

        {status === 'success' ? (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>Registration Submitted</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <strong>{form.company_name}</strong> has been submitted for review. We'll contact <strong>{form.contact_email}</strong> within 5 business days to discuss your data access requirements and commercial agreement.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* OEM type */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organisation Type <span style={{ color: '#ef4444' }}>*</span></p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.65rem' }}>
                {OEM_TYPES.map(t => {
                  const sel = oemType === t.key;
                  return (
                    <div key={t.key} onClick={() => setOemType(t.key)} style={{ border: `1px solid ${sel ? 'rgba(14,165,233,0.4)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(14,165,233,0.07)' : 'transparent', borderRadius: '10px', padding: '0.85rem', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.2rem' }}>
                        <p style={{ margin: 0, fontWeight: 700, fontSize: '0.8rem', color: sel ? '#38bdf8' : '#94a3b8' }}>{t.label}</p>
                        {sel && <CheckCircle2 size={13} color="#38bdf8" />}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.67rem', color: sel ? '#0ea5e9' : '#334155' }}>{t.eg}</p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Tier */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Access Tier</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '0.75rem' }}>
                {TIERS.map(t => {
                  const sel = tier === t.key;
                  return (
                    <div key={t.key} onClick={() => setTier(t.key)} style={{ border: `1px solid ${sel ? t.color : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(0,0,0,0.25)' : 'rgba(30,41,59,0.3)', borderRadius: '12px', padding: '1rem', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: sel ? t.color : '#94a3b8', fontSize: '0.85rem' }}>{t.label}</p>
                        {sel && <CheckCircle2 size={13} color={t.color} />}
                      </div>
                      <p style={{ margin: '0 0 0.65rem', fontSize: '0.72rem', color: sel ? '#fff' : '#475569', fontWeight: 600 }}>{t.price}</p>
                      {t.features.map(f => <p key={f} style={{ margin: '0.12rem 0', fontSize: '0.67rem', color: sel ? '#cbd5e1' : '#334155', display: 'flex', gap: '0.3rem' }}><span style={{ color: sel ? t.color : '#334155', flexShrink: 0 }}>→</span>{f}</p>)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Organisation details */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Organisation Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Company Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. Airbus S.A.S." value={form.company_name} onChange={e => set('company_name', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Headquarters Country <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. France" value={form.headquarters_country} onChange={e => set('headquarters_country', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Website</label><input type="url" placeholder="https://airbus.com" value={form.website} onChange={e => set('website', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Contact Name</label><input type="text" placeholder="Full name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Contact Email <span style={{ color: '#ef4444' }}>*</span></label><input type="email" placeholder="partnerships@company.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inp} /></div>
              </div>
            </div>

            {/* Aircraft families */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aircraft / Product Families</p>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#475569' }}>Used to match pilot supply/demand signals to your fleet portfolio.</p>
              <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
                {aircraftFamilies.map(a => (
                  <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8', fontSize: '0.72rem', background: 'rgba(14,165,233,0.07)' }}>
                    {a}<button onClick={() => setAircraftFamilies(p => p.filter(x => x !== a))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 0 }}><span style={{ fontSize: '0.75rem' }}>×</span></button>
                  </span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <input type="text" placeholder="e.g. A320, A350, ATR 72" value={newFamily} onChange={e => setNewFamily(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newFamily.trim()) { setAircraftFamilies(p => [...p, newFamily.trim()]); setNewFamily(''); } }} style={{ ...inp, flex: 1 }} />
                <button onClick={() => { if (newFamily.trim()) { setAircraftFamilies(p => [...p, newFamily.trim()]); setNewFamily(''); } }} style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid rgba(14,165,233,0.3)', background: 'transparent', color: '#38bdf8', cursor: 'pointer', fontSize: '0.8rem' }}>Add</button>
              </div>
            </div>

            {/* Data scope (enterprise+ only) */}
            {tier !== 'standard' && (
              <div style={{ ...card, marginBottom: '1.25rem' }}>
                <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Requested Data Access Scope</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                  {DATA_SCOPES.map(s => {
                    const sel = dataScopes.includes(s);
                    return (
                      <button key={s} onClick={() => toggleScope(s)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: `1px solid ${sel ? 'rgba(16,185,129,0.4)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(16,185,129,0.08)' : 'transparent', color: sel ? '#34d399' : '#475569', fontSize: '0.72rem', cursor: 'pointer' }}>
                        {sel ? '✓ ' : ''}{DATA_SCOPE_LABELS[s]}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Strategic callout */}
            <div style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
              <Info size={14} color="#34d399" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#6ee7b7', lineHeight: 1.6 }}>
                <strong>The connective tissue you've never had:</strong> PilotRecognition connects the planes you build to the humans who fly them — with live, verified data. If pathway data shifts toward A321XLR qualifications, you see it 18 months before the demand peak. If the B737 MAX crew shortage is most acute in Southeast Asia, you know before your airline customers do.
              </p>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

            <button onClick={handleSubmit} disabled={!canSubmit || status === 'submitting'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: canSubmit && status !== 'submitting' ? '#0ea5e9' : '#1e293b', color: canSubmit && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: canSubmit && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Submitting…</> : <><Building2 size={16} />Register as OEM Partner</>}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select option{background:#1e293b}`}</style>
    </div>
  );
}
