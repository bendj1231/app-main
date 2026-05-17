import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Heart, AlertTriangle } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };

const AUTHORITIES = ['GCAA', 'FAA', 'EASA', 'CASA', 'CAA (UK)', 'CAAP', 'TCCA', 'JCAB', 'SACAA', 'CAAS', 'Other'];
const COMMON_LIMITATIONS = ['Corrective lenses required', 'Spectacles required', 'Valid only with Class 1 Medical', 'Hearing aid required', 'Night flying limitation', 'Copilot only'];

function daysDiff(d: string) {
  const ms = new Date(d).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
}

type Status = 'idle' | 'loading' | 'submitting' | 'success' | 'error';

interface CertRecord { id: string; medical_class: string; issuing_authority: string; certificate_number: string; date_issued: string; date_expires: string; status: string; limitations: string[]; }

export function MedicalCertUploadPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [certs, setCerts] = useState<CertRecord[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ medical_class: 'class1', issuing_authority: '', certificate_number: '', date_of_examination: '', date_issued: '', date_expires: '', visible_to_operators: false });
  const [limitations, setLimitations] = useState<string[]>([]);
  const set = (f: string, v: string | boolean) => setForm(p => ({ ...p, [f]: v }));
  const canSubmit = form.issuing_authority && form.date_issued && form.date_expires;

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    setStatus('loading');
    const { data } = await supabase.from('medical_certificate_records').select('id, medical_class, issuing_authority, certificate_number, date_issued, date_expires, status, limitations').eq('pilot_id', currentUser.id).order('date_expires', { ascending: false });
    setCerts(data ?? []);
    setStatus('idle');
  }, [currentUser?.id]);

  useEffect(() => { load(); }, [load]);

  function toggleLimitation(l: string) {
    setLimitations(prev => prev.includes(l) ? prev.filter(x => x !== l) : [...prev, l]);
  }

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const expiryDays = daysDiff(form.date_expires);
      const { error: err } = await supabase.from('medical_certificate_records').insert({
        pilot_id: currentUser!.id,
        medical_class: form.medical_class,
        issuing_authority: form.issuing_authority,
        certificate_number: form.certificate_number || null,
        date_of_examination: form.date_of_examination || form.date_issued,
        date_issued: form.date_issued,
        date_expires: form.date_expires,
        limitations: limitations.length ? limitations : null,
        status: expiryDays <= 0 ? 'expired' : 'active',
        visible_to_operators: form.visible_to_operators,
      });
      if (err) throw err;
      setStatus('success');
      await load();
      setShowForm(false);
    } catch (e: any) { setError(e?.message ?? 'Save failed.'); setStatus('error'); }
  }

  function statusColor(s: string, expiry: string) {
    const days = daysDiff(expiry);
    if (s === 'expired' || days <= 0) return '#ef4444';
    if (days <= 30) return '#f59e0b';
    return '#10b981';
  }

  function statusLabel(s: string, expiry: string) {
    const days = daysDiff(expiry);
    if (s === 'expired' || days <= 0) return `Expired ${Math.abs(days)}d ago`;
    if (days <= 30) return `Expires in ${days}d`;
    return `Valid — ${days}d remaining`;
  }

  if (status === 'loading') return (
    <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Loader2 size={26} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}><ArrowLeft size={16} /> Back</button>
        {!showForm && (
          <button onClick={() => { setShowForm(true); setError(null); }} style={{ padding: '0.5rem 1rem', borderRadius: '8px', border: 'none', background: '#0ea5e9', color: '#fff', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>+ Add Certificate</button>
        )}
      </div>

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 13 — Aeromedical</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Medical Certificates</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          Log your medical certificates into your verification wallet. The platform tracks expiry, surfaces renewal alerts, and — with your consent — makes your medical status visible to operators as a live verified data point.
        </p>

        {/* Existing certs */}
        {certs.length > 0 && (
          <div style={{ marginBottom: '1.5rem' }}>
            {certs.map(c => {
              const col = statusColor(c.status, c.date_expires);
              const expired = c.status === 'expired' || daysDiff(c.date_expires) <= 0;
              return (
                <div key={c.id} style={{ ...card, marginBottom: '0.75rem', borderColor: `${col}33` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <Heart size={14} color={col} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{c.medical_class.replace('class', 'Class ')} Medical</span>
                        {c.certificate_number && <span style={{ fontSize: '0.72rem', color: '#475569' }}>#{c.certificate_number}</span>}
                      </div>
                      <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>
                        {c.issuing_authority} · Issued {c.date_issued} · Expires {c.date_expires}
                      </p>
                      {c.limitations?.length > 0 && (
                        <p style={{ margin: '0.3rem 0 0', fontSize: '0.72rem', color: '#f59e0b' }}>Limitations: {c.limitations.join(', ')}</p>
                      )}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {expired && <AlertTriangle size={13} color="#ef4444" />}
                      <span style={{ padding: '0.2rem 0.65rem', borderRadius: '999px', border: `1px solid ${col}44`, color: col, fontSize: '0.7rem', fontWeight: 600, background: `${col}11` }}>{statusLabel(c.status, c.date_expires)}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {certs.length === 0 && !showForm && (
          <div style={{ ...card, textAlign: 'center', padding: '2.5rem 1.5rem', marginBottom: '1.5rem' }}>
            <Heart size={28} color="#334155" style={{ marginBottom: '0.75rem' }} />
            <p style={{ margin: 0, color: '#475569', fontSize: '0.88rem' }}>No medical certificates logged yet.</p>
            <p style={{ margin: '0.4rem 0 0', color: '#334155', fontSize: '0.78rem' }}>Add your current Class 1 medical to complete your verification wallet.</p>
          </div>
        )}

        {/* Add form */}
        {showForm && (
          <>
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Certificate Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={lbl}>Medical Class <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={form.medical_class} onChange={e => set('medical_class', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    <option value="class1">Class 1 (Commercial)</option>
                    <option value="class2">Class 2 (Private)</option>
                    <option value="class3">Class 3 (ATC)</option>
                  </select>
                </div>
                <div>
                  <label style={lbl}>Issuing Authority <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={form.issuing_authority} onChange={e => set('issuing_authority', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    <option value="">Select…</option>
                    {AUTHORITIES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Certificate Number</label><input type="text" placeholder="e.g. 25-023739" value={form.certificate_number} onChange={e => set('certificate_number', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Date of Examination</label><input type="date" value={form.date_of_examination} onChange={e => set('date_of_examination', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Date Issued <span style={{ color: '#ef4444' }}>*</span></label><input type="date" value={form.date_issued} onChange={e => set('date_issued', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Expiry Date <span style={{ color: '#ef4444' }}>*</span></label><input type="date" value={form.date_expires} onChange={e => set('date_expires', e.target.value)} style={inp} /></div>
              </div>
            </div>

            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Medical Limitations</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                {COMMON_LIMITATIONS.map(l => {
                  const sel = limitations.includes(l);
                  return (
                    <button key={l} onClick={() => toggleLimitation(l)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: `1px solid ${sel ? 'rgba(251,191,36,0.4)' : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(251,191,36,0.08)' : 'transparent', color: sel ? '#fbbf24' : '#64748b', fontSize: '0.72rem', cursor: 'pointer' }}>
                      {sel ? '✓ ' : ''}{l}
                    </button>
                  );
                })}
              </div>
            </div>

            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <label style={{ display: 'flex', gap: '0.75rem', alignItems: 'center', cursor: 'pointer' }}>
                <input type="checkbox" checked={form.visible_to_operators} onChange={e => set('visible_to_operators', e.target.checked)} />
                <div>
                  <p style={{ margin: 0, fontSize: '0.82rem', fontWeight: 600 }}>Share medical status with operators</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5 }}>When enabled, operators querying your profile will see your current medical class and expiry date. You can revoke this at any time.</p>
                </div>
              </label>
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button onClick={() => setShowForm(false)} style={{ flex: 1, padding: '1rem', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontWeight: 600, fontSize: '0.88rem', cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleSubmit} disabled={!canSubmit || status === 'submitting'} style={{ flex: 2, padding: '1rem', borderRadius: '12px', border: 'none', background: canSubmit && status !== 'submitting' ? '#0ea5e9' : '#1e293b', color: canSubmit && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: canSubmit && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : <><Heart size={16} />Add Medical Certificate</>}
              </button>
            </div>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select{color:#fff} select option{background:#1e293b}`}</style>
    </div>
  );
}
