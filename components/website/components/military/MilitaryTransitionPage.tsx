import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Shield, Plus, X } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };

const BRANCHES = ['USAF', 'USN', 'USMC', 'US Army Aviation', 'RAF', 'RAAF', 'RCAF', 'PAF', 'IAF', 'SAAF', 'RSAF', 'Other'];
const DISCHARGE_TYPES = [
  { key: 'honorable', label: 'Honourable Discharge' },
  { key: 'general', label: 'General Discharge' },
  { key: 'active', label: 'Still Active Duty' },
  { key: 'reserve', label: 'Reserve / Part-time' },
];

// Approximate civilian hour conversion (simplified model)
function convertHours(military: number, branch: string, primary: string[]): number {
  const hasJet = primary.some(a => ['F-16', 'F/A-18', 'F-15', 'Typhoon', 'Rafale', 'Gripen', 'PA-11', 'T-38'].some(j => a.includes(j)));
  const multiplier = hasJet ? 1.5 : 1.2;
  return Math.round(military * multiplier * 10) / 10;
}

type Status = 'idle' | 'loading' | 'submitting' | 'success' | 'error';

const COMMON_QUALIFICATIONS = ['Instrument Rating', 'Night Vision Goggles', 'Formation Lead', 'Combat Search & Rescue', 'Air-to-Air Refuelling', 'Low-Level Navigation', 'Emergency Procedures Instructor', 'Crew Resource Management Instructor', 'Multi-engine', 'Rotary Wing'];

export function MilitaryTransitionPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const { callApi } = useWorkerAuth();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [existing, setExisting] = useState<any>(null);

  const [form, setForm] = useState({
    branch: '', country: '', rank_at_discharge: '',
    service_start_date: '', discharge_date: '', discharge_type: 'honorable',
    total_military_hours: '', total_combat_hours: '',
    total_sortie_count: '', instrument_hours: '', multi_engine_hours: '',
    pilot_statement: '',
  });
  const [aircraft, setAircraft] = useState<string[]>([]);
  const [newAircraft, setNewAircraft] = useState('');
  const [qualifications, setQualifications] = useState<string[]>([]);

  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));

  const convertedHours = form.total_military_hours
    ? convertHours(parseFloat(form.total_military_hours), form.branch, aircraft)
    : null;

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    setStatus('loading');
    const rows = await callApi<Record<string, unknown>[]>('queryTable', {
      table: 'military_service_records',
      operation: 'select',
      where: { pilot_id: currentUser.id },
      limit: 1,
    });
    const data = rows?.[0];
    if (data) {
      setExisting(data);
      setForm({ branch: data.branch as string, country: data.country as string, rank_at_discharge: (data.rank_at_discharge as string) ?? '', service_start_date: (data.service_start_date as string) ?? '', discharge_date: (data.discharge_date as string) ?? '', discharge_type: (data.discharge_type as string) ?? 'honorable', total_military_hours: (data.total_military_hours as number)?.toString() ?? '', total_combat_hours: (data.total_combat_hours as number)?.toString() ?? '', total_sortie_count: (data.total_sortie_count as number)?.toString() ?? '', instrument_hours: (data.instrument_hours as number)?.toString() ?? '', multi_engine_hours: (data.multi_engine_hours as number)?.toString() ?? '', pilot_statement: (data.pilot_statement as string) ?? '' });
      setAircraft((data.primary_aircraft as string[]) ?? []);
      setQualifications((data.qualifications as string[]) ?? []);
    }
    setStatus('idle');
  }, [currentUser?.id]);

  useEffect(() => { load(); }, [load]);

  function toggleQual(q: string) {
    setQualifications(prev => prev.includes(q) ? prev.filter(x => x !== q) : [...prev, q]);
  }

  async function handleSubmit() {
    if (!form.branch || !form.country || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const payload = {
        pilot_id: currentUser!.id,
        branch: form.branch, country: form.country,
        rank_at_discharge: form.rank_at_discharge || null,
        service_start_date: form.service_start_date || null,
        discharge_date: form.discharge_date || null,
        discharge_type: form.discharge_type,
        primary_aircraft: aircraft.length ? aircraft : null,
        total_military_hours: form.total_military_hours ? parseFloat(form.total_military_hours) : null,
        total_combat_hours: form.total_combat_hours ? parseFloat(form.total_combat_hours) : null,
        total_sortie_count: form.total_sortie_count ? parseInt(form.total_sortie_count) : null,
        instrument_hours: form.instrument_hours ? parseFloat(form.instrument_hours) : null,
        multi_engine_hours: form.multi_engine_hours ? parseFloat(form.multi_engine_hours) : null,
        qualifications: qualifications.length ? qualifications : null,
        converted_civilian_hours: convertedHours,
        pilot_statement: form.pilot_statement || null,
        verification_status: 'self_reported',
      };
      if (existing) {
        await callApi('queryTable', {
          table: 'military_service_records',
          operation: 'update',
          id: existing.id,
          data: payload,
        });
      } else {
        await callApi('queryTable', {
          table: 'military_service_records',
          operation: 'insert',
          data: payload,
        });
      }
      setStatus('success');
    } catch (e: any) { setError(e?.message ?? 'Save failed.'); setStatus('error'); }
  }

  if (status === 'loading') return (
    <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={26} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><ArrowLeft size={16} /> Back</button>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 7 — Military & Defense Commands</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Military Service Record</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          Your military flying career represents the highest-intensity operational experience in aviation. Log it here — the platform converts your service record into verified, operator-readable data that makes your decade of military service legible to the commercial sector.
        </p>

        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', marginBottom: '1.5rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>Military Record Saved</p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Your record is saved with <strong>Self-Reported</strong> status. Estimated civilian equivalent: <strong style={{ color: '#34d399' }}>{convertedHours} hrs</strong>. Submit a verification request to an ATO or operator to upgrade to Verified status.
              </p>
            </div>
          </div>
        )}

        {/* Service details */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Military Service</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div>
              <label style={lbl}>Service Branch <span style={{ color: '#ef4444' }}>*</span></label>
              <select value={form.branch} onChange={e => set('branch', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                <option value="">Select…</option>
                {BRANCHES.map(b => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Country <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. Australia" value={form.country} onChange={e => set('country', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Rank at Discharge</label><input type="text" placeholder="e.g. Squadron Leader" value={form.rank_at_discharge} onChange={e => set('rank_at_discharge', e.target.value)} style={inp} /></div>
            <div>
              <label style={lbl}>Discharge Type</label>
              <select value={form.discharge_type} onChange={e => set('discharge_type', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                {DISCHARGE_TYPES.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
              </select>
            </div>
            <div><label style={lbl}>Service Start</label><input type="date" value={form.service_start_date} onChange={e => set('service_start_date', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Discharge / Transition Date</label><input type="date" value={form.discharge_date} onChange={e => set('discharge_date', e.target.value)} style={inp} /></div>
          </div>
        </div>

        {/* Aircraft */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Aircraft Types</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.75rem' }}>
            {aircraft.map(a => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.65rem', borderRadius: '999px', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '0.75rem', background: 'rgba(96,165,250,0.08)' }}>
                {a}
                <button onClick={() => setAircraft(p => p.filter(x => x !== a))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', display: 'flex', alignItems: 'center', padding: 0 }}><X size={11} /></button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" placeholder="e.g. F/A-18, C-130, UH-60" value={newAircraft} onChange={e => setNewAircraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newAircraft.trim()) { setAircraft(p => [...p, newAircraft.trim()]); setNewAircraft(''); } }} style={{ ...inp, flex: 1 }} />
            <button onClick={() => { if (newAircraft.trim()) { setAircraft(p => [...p, newAircraft.trim()]); setNewAircraft(''); } }} style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid rgba(96,165,250,0.3)', background: 'transparent', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}><Plus size={13} /> Add</button>
          </div>
        </div>

        {/* Hours */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Flight Hours</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '1rem' }}>
            <div><label style={lbl}>Total Military Hours</label><input type="number" placeholder="e.g. 2500" value={form.total_military_hours} onChange={e => set('total_military_hours', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Combat / Operational Hours</label><input type="number" placeholder="e.g. 400" value={form.total_combat_hours} onChange={e => set('total_combat_hours', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Instrument Hours</label><input type="number" placeholder="e.g. 600" value={form.instrument_hours} onChange={e => set('instrument_hours', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Multi-Engine Hours</label><input type="number" placeholder="e.g. 1800" value={form.multi_engine_hours} onChange={e => set('multi_engine_hours', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Total Sortie Count</label><input type="number" placeholder="e.g. 800" value={form.total_sortie_count} onChange={e => set('total_sortie_count', e.target.value)} style={inp} /></div>
          </div>

          {convertedHours && (
            <div style={{ marginTop: '1rem', background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.75rem 1rem' }}>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#34d399' }}>
                Estimated civilian equivalent: <strong>{convertedHours} hrs</strong>
                <span style={{ color: '#475569', marginLeft: '0.5rem', fontSize: '0.7rem' }}>Based on aircraft type complexity multiplier. Subject to verification.</span>
              </p>
            </div>
          )}
        </div>

        {/* Qualifications */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Military Qualifications</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {COMMON_QUALIFICATIONS.map(q => {
              const sel = qualifications.includes(q);
              return (
                <button key={q} onClick={() => toggleQual(q)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: `1px solid ${sel ? 'rgba(167,139,250,0.5)' : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(167,139,250,0.12)' : 'transparent', color: sel ? '#c4b5fd' : '#64748b', fontSize: '0.72rem', cursor: 'pointer' }}>
                  {sel ? '✓ ' : ''}{q}
                </button>
              );
            })}
          </div>
        </div>

        {/* Statement */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <label style={lbl}>Pilot Statement (optional)</label>
          <textarea rows={4} placeholder="Briefly describe your military flying career, the operational context, and what you're looking for in civilian aviation…" value={form.pilot_statement} onChange={e => set('pilot_statement', e.target.value)} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} />
        </div>

        {/* Verification callout */}
        <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.18)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#38bdf8', lineHeight: 1.6 }}>
            <strong>Self-Reported Status:</strong> This record is saved as self-reported. To upgrade to Verified status, submit a request through the Verification Wallet — your ATO or a Verification Node will confirm your service record against official records.
          </p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

        <button onClick={handleSubmit} disabled={!form.branch || !form.country || status === 'submitting'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: form.branch && form.country && status !== 'submitting' ? '#0ea5e9' : '#1e293b', color: form.branch && form.country && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: form.branch && form.country && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : <><Shield size={16} />{existing ? 'Update Military Record' : 'Save Military Record'}</>}
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select{color:#fff} select option{background:#1e293b}`}</style>
    </div>
  );
}
