import React, { useState } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Cpu, Info } from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };

const TIERS = [
  { key: 'standard', label: 'Standard', price: '$300/mo', color: '#64748b', features: ['Type rating pathway listings', 'Linked to operator pathway cards', 'Prerequisite requirements published', 'Centre profile visible to pilots'] },
  { key: 'professional', label: 'Professional', price: '$800/mo + $30/referral', color: '#0ea5e9', features: ['API simulator data integration', 'EBT proficiency data → pilot profiles', 'Washout analytics by pilot profile type', 'Gap analysis tool integration', '$30 referral per enrolled pilot'] },
  { key: 'enterprise', label: 'Enterprise', price: '$1,500/mo', color: '#10b981', features: ['Pre-Cleared Rating status (airline-endorsed)', 'Custom EBT competency framework development', 'Priority placement in match algorithm', 'Simulator-to-airline correlation research', 'Industry advisory role'] },
];

const AUTHORITIES = ['EASA', 'FAA', 'GCAA', 'CASA', 'CAAP', 'CAA (UK)', 'TCCA', 'JCAB', 'Other'];

type Status = 'idle' | 'submitting' | 'success' | 'error';

export function SimCenterRegisterPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [tier, setTier] = useState('standard');
  const [status, setStatus] = useState<Status>('idle');
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({ center_name: '', country: '', city: '', website: '', contact_email: '', contact_name: '', regulatory_approval: '', issuing_authority: '' });
  const set = (f: string, v: string) => setForm(p => ({ ...p, [f]: v }));
  const canSubmit = form.center_name && form.country && form.contact_email && form.contact_name;

  async function handleSubmit() {
    if (!canSubmit || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const slug = form.center_name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') + '-' + Date.now();
      const { error: err } = await supabase.from('sim_centers').insert({
        admin_user_id: currentUser?.id ?? null,
        center_name: form.center_name, slug,
        country: form.country, city: form.city || null,
        website: form.website || null,
        contact_email: form.contact_email, contact_name: form.contact_name,
        regulatory_approval: form.regulatory_approval || null,
        issuing_authority: form.issuing_authority || null,
        tier, status: 'pending',
      });
      if (err) throw err;
      setStatus('success');
    } catch (e: any) { setError(e?.message ?? 'Submission failed.'); setStatus('error'); }
  }

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 6 — Type Rating & Simulator Centers</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Register Your Simulator Centre</h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          Join the PilotRecognition network. Publish type rating listings linked to operator pathway cards, integrate simulator proficiency data into pilot profiles, and earn Pre-Cleared status — the airline-endorsed designation that commands a verified premium.
        </p>

        {status === 'success' ? (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)' }}>
            <div style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <p style={{ margin: 0, fontWeight: 700 }}>Application Submitted</p>
                <p style={{ margin: '0.35rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  <strong>{form.center_name}</strong> has been submitted for review. We'll contact <strong>{form.contact_email}</strong> within 3 business days. Once approved, you'll access your admin dashboard to publish type rating listings and upload simulator data.
                </p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Tier selector */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Select Platform Tier</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.75rem' }}>
                {TIERS.map(t => {
                  const sel = tier === t.key;
                  return (
                    <div key={t.key} onClick={() => setTier(t.key)} style={{ border: `1px solid ${sel ? t.color : 'rgba(255,255,255,0.08)'}`, background: sel ? 'rgba(0,0,0,0.3)' : 'rgba(30,41,59,0.3)', borderRadius: '12px', padding: '1rem', cursor: 'pointer' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem' }}>
                        <p style={{ margin: 0, fontWeight: 700, color: sel ? t.color : '#94a3b8', fontSize: '0.88rem' }}>{t.label}</p>
                        {sel && <CheckCircle2 size={14} color={t.color} />}
                      </div>
                      <p style={{ margin: '0 0 0.65rem', fontSize: '0.75rem', color: sel ? '#fff' : '#475569', fontWeight: 600 }}>{t.price}</p>
                      {t.features.map(f => <p key={f} style={{ margin: '0.15rem 0', fontSize: '0.68rem', color: sel ? '#cbd5e1' : '#334155', display: 'flex', gap: '0.3rem' }}><span style={{ color: sel ? t.color : '#334155', flexShrink: 0 }}>→</span>{f}</p>)}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Centre details */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Centre Details</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Centre Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. CAE Melbourne Training Centre" value={form.center_name} onChange={e => set('center_name', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Country <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. Australia" value={form.country} onChange={e => set('country', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>City</label><input type="text" placeholder="e.g. Melbourne" value={form.city} onChange={e => set('city', e.target.value)} style={inp} /></div>
                <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Website</label><input type="url" placeholder="https://yourcentre.com" value={form.website} onChange={e => set('website', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Regulatory Approval</label><input type="text" placeholder="e.g. EASA FSTD Level D" value={form.regulatory_approval} onChange={e => set('regulatory_approval', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Issuing Authority</label><select value={form.issuing_authority} onChange={e => set('issuing_authority', e.target.value)} style={{ ...inp, appearance: 'none' }}><option value="">Select…</option>{AUTHORITIES.map(a => <option key={a} value={a}>{a}</option>)}</select></div>
              </div>
            </div>

            {/* Contact */}
            <div style={{ ...card, marginBottom: '1.25rem' }}>
              <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Primary Contact</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem' }}>
                <div><label style={lbl}>Contact Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="Full name" value={form.contact_name} onChange={e => set('contact_name', e.target.value)} style={inp} /></div>
                <div><label style={lbl}>Contact Email <span style={{ color: '#ef4444' }}>*</span></label><input type="email" placeholder="admin@centre.com" value={form.contact_email} onChange={e => set('contact_email', e.target.value)} style={inp} /></div>
              </div>
            </div>

            {tier === 'enterprise' && (
              <div style={{ background: 'rgba(16,185,129,0.06)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem', display: 'flex', gap: '0.65rem' }}>
                <Info size={14} color="#10b981" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#6ee7b7', lineHeight: 1.6 }}>
                  <strong>Pre-Cleared Rating status</strong> is the airline-endorsed designation that tells pilots your training produces candidates operators will consider. Enterprise centres that publish verified washout rates and integrate EBT data earn a verified 20% price premium. The centres that integrate now will be the centres airlines name on their pathway cards.
                </p>
              </div>
            )}

            {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

            <button onClick={handleSubmit} disabled={!canSubmit || status === 'submitting'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: canSubmit && status !== 'submitting' ? '#0ea5e9' : '#1e293b', color: canSubmit && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: canSubmit && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
              {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Cpu size={16} /> Register Simulator Centre</>}
            </button>
          </>
        )}
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select{color:#fff} select option{background:#1e293b}`}</style>
    </div>
  );
}
