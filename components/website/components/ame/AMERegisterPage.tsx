import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Stethoscope } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };
const chk: React.CSSProperties = { display: 'flex', gap: '0.6rem', alignItems: 'center', fontSize: '0.82rem', color: '#94a3b8', cursor: 'pointer' };

const AUTHORITIES = ['GCAA', 'FAA', 'EASA', 'CASA', 'CAA (UK)', 'CAAP', 'TCCA', 'JCAB', 'SACAA', 'CAAS', 'Other'];
const DESIGNATIONS = ['DAME (Designated Aviation Medical Examiner)', 'AME Class 1', 'AME Class 2', 'AME Class 1 & 2', 'Senior AME', 'Chief Medical Officer (Aviation)', 'Other'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function AMERegisterPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ full_name: '', designation: '', country: '', city: '', clinic_name: '', contact_email: '', issuing_authority: '', ame_certificate_number: '', certificate_expiry: '' });
  const [classes, setClasses] = useState({ c1: false, c2: false, c3: false });
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const canSubmit = form.full_name && form.country && form.contact_email && form.issuing_authority;

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const { error: err } = await supabase.from('ame_practitioners').insert({
        admin_user_id: currentUser?.id ?? null,
        full_name: form.full_name, designation: form.designation || null,
        country: form.country, city: form.city || null,
        clinic_name: form.clinic_name || null,
        contact_email: form.contact_email,
        issuing_authority: form.issuing_authority,
        ame_certificate_number: form.ame_certificate_number || null,
        certificate_expiry: form.certificate_expiry || null,
        supports_class1: classes.c1, supports_class2: classes.c2, supports_class3: classes.c3,
        status: 'pending', verified: false,
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

      <div style={{ maxWidth: '720px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 13 — Aeromedical Examiners</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>AME / DAME Registration</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          Register as a verified Aeromedical Examiner on the PilotRecognition platform. Once verified, you can issue medical certificate records directly into pilot verification wallets — making paper medical certificates a live, queryable data point in every pilot's Professional Standing Asset.
        </p>

        {status === 'success' ? (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>Application Submitted</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <strong>{form.full_name}</strong> has been submitted for review. We will verify your {form.issuing_authority} certification and contact you at <strong>{form.contact_email}</strong>. Once approved, you can issue medical records directly into pilot profiles.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Practitioner details */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Practitioner Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Full Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="Dr. Jane Smith" value={form.full_name} onChange={e => set('full_name', e.target.value)} style={inp} /></div>
                <div>
                  <label style={lbl}>Designation</label>
                  <select value={form.designation} onChange={e => set('designation', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    <option value="">Select…</option>
                    {DESIGNATIONS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>Clinic / Organisation</label><input type="text" placeholder="e.g. Gulf Aviation Medical Center" value={form.clinic_name} onChange={e => set('clinic_name', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Country <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. UAE" value={form.country} onChange={e => set('country', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>City</label><input type="text" placeholder="e.g. Dubai" value={form.city} onChange={e => set('city', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Contact Email <span style={{ color: '#ef4444' }}>*</span></label><input type="email" placeholder="dr.name@clinic.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inp} /></div>
              </div>
            </div>

            {/* Certification */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>AME Certification</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div>
                  <label style={lbl}>Issuing Authority <span style={{ color: '#ef4444' }}>*</span></label>
                  <select value={form.issuing_authority} onChange={e => set('issuing_authority', e.target.value)} style={{ ...inp, appearance: 'none' }}>
                    <option value="">Select…</option>
                    {AUTHORITIES.map(a => <option key={a} value={a}>{a}</option>)}
                  </select>
                </div>
                <div><label style={lbl}>AME Certificate Number</label><input type="text" placeholder="e.g. GCAA-AME-0012" value={form.ame_certificate_number} onChange={e => set('ame_certificate_number', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Certificate Expiry</label><input type="date" value={form.certificate_expiry} onChange={e => set('certificate_expiry', e.target.value)} style={inp} /></div>
              </div>

              <p style={{ margin: '1.25rem 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Supported Medical Classes</p>
              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap' }}>
                {([['c1', 'Class 1 (Commercial Pilots)'], ['c2', 'Class 2 (Private Pilots)'], ['c3', 'Class 3 (Air Traffic Controllers)']] as [keyof typeof classes, string][]).map(([key, label]) => (
                  <label key={key} style={chk}>
                    <input type="checkbox" checked={classes[key]} onChange={e => setClasses(p => ({ ...p, [key]: e.target.checked }))} />
                    {label}
                  </label>
                ))}
              </div>
            </div>

            {/* What you gain */}
            <div style={{ background: 'rgba(14,165,233,0.05)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '12px', padding: '1rem 1.25rem', marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 0.6rem', fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>What You Gain as a Registered AME</p>
              {['Issue medical certificate records directly into pilot verification wallets — replacing paper', 'Your clinic profile is visible to pilots searching for Class 1-certified AMEs in your geography', 'Medical currency data automatically flags expired certificates in pilots\' profiles — reducing missed renewals', 'Airlines querying pilot profiles see real-time medical status rather than relying on pilot self-reporting'].map(f => (
                <p key={f} style={{ margin: '0.2rem 0', fontSize: '0.78rem', color: '#cbd5e1', display: 'flex', gap: '0.5rem' }}><span style={{ color: '#38bdf8', flexShrink: 0 }}>→</span>{f}</p>
              ))}
            </div>

            {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

            <button onClick={handleSubmit} disabled={!canSubmit || status === 'submitting'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: canSubmit && status !== 'submitting' ? '#0ea5e9' : '#1e293b', color: canSubmit && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: canSubmit && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Submitting…</> : <><Stethoscope size={16} />Register as AME / DAME</>}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select{color:#fff} select option{background:#1e293b}`}</style>
    </div>
  );
}
