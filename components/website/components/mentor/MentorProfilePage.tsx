import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, AlertCircle, Loader2, Users, Plus, X } from 'lucide-react';
import { supabase } from '../../@/lib/supabase';
import { useAuth } from '../../@/contexts/AuthContext';

interface Props { onBack: () => void; onNavigate: (page: string) => void; }

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#fff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.5rem' };
const inp: React.CSSProperties = { width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.9rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.85rem', outline: 'none' };
const lbl: React.CSSProperties = { display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 };

const ROLE_TYPES = [
  { key: 'mentor', label: 'Pilot Mentor', desc: 'Guide junior pilots through career development' },
  { key: 'instructor', label: 'Flight Instructor', desc: 'Share training expertise and hours-building advice' },
  { key: 'union_rep', label: 'Union Representative', desc: 'Contribute collective agreement data and advocacy insights' },
  { key: 'contributor', label: 'Platform Contributor', desc: 'Contribute knowledge, leadership initiatives, content' },
];

const SPECIALISATIONS = [
  'Airline Transition', 'Type Rating Prep', 'EBT / CBTA', 'CRM & Leadership',
  'Low-Hour Career Strategy', 'Military Transition', 'Interview Preparation',
  'Career Change into Aviation', 'First Officer → Captain Upgrade', 'International Licencing',
];

const FORMATS = [
  { key: 'video_call', label: 'Video Call' },
  { key: 'async_chat', label: 'Async Chat / Messaging' },
  { key: 'in_person', label: 'In Person' },
  { key: 'async_review', label: 'Document / CV Review' },
];

type Status = 'idle' | 'loading' | 'submitting' | 'success' | 'error';

export function MentorProfilePage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [status, setStatus] = useState<Status>('loading');
  const [error, setError] = useState<string | null>(null);
  const [existingId, setExistingId] = useState<string | null>(null);

  const [form, setForm] = useState({
    display_name: '', role_type: 'mentor', current_airline: '', rank: '',
    total_hours: '', years_experience: '', base_country: '',
    hours_per_month: '', bio: '', linkedin_url: '',
    is_available: true, public_profile: true,
  });
  const [specs, setSpecs] = useState<string[]>([]);
  const [aircraft, setAircraft] = useState<string[]>([]);
  const [newAircraft, setNewAircraft] = useState('');
  const [formats, setFormats] = useState<string[]>(['video_call', 'async_chat']);
  const set = (f: string, v: string | boolean) => setForm(p => ({ ...p, [f]: v }));

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    const { data } = await supabase.from('mentor_profiles').select('*').eq('user_id', currentUser.id).maybeSingle();
    if (data) {
      setExistingId(data.id);
      setForm({
        display_name: data.display_name ?? '', role_type: data.role_type ?? 'mentor',
        current_airline: data.current_airline ?? '', rank: data.rank ?? '',
        total_hours: data.total_hours?.toString() ?? '', years_experience: data.years_experience?.toString() ?? '',
        base_country: data.base_country ?? '', hours_per_month: data.hours_per_month?.toString() ?? '',
        bio: data.bio ?? '', linkedin_url: data.linkedin_url ?? '',
        is_available: data.is_available ?? true, public_profile: data.public_profile ?? true,
      });
      setSpecs(data.specialisations ?? []);
      setAircraft(data.aircraft_types ?? []);
      setFormats(data.format ?? ['video_call', 'async_chat']);
    }
    setStatus('idle');
  }, [currentUser?.id]);

  useEffect(() => { load(); }, [load]);

  function toggleSpec(s: string) { setSpecs(p => p.includes(s) ? p.filter(x => x !== s) : [...p, s]); }
  function toggleFormat(f: string) { setFormats(p => p.includes(f) ? p.filter(x => x !== f) : [...p, f]); }

  async function handleSubmit() {
    if (!form.display_name || !form.role_type || status === 'submitting') return;
    setStatus('submitting'); setError(null);
    try {
      const payload = {
        user_id: currentUser!.id,
        display_name: form.display_name, role_type: form.role_type,
        current_airline: form.current_airline || null, rank: form.rank || null,
        total_hours: form.total_hours ? parseFloat(form.total_hours) : null,
        years_experience: form.years_experience ? parseInt(form.years_experience) : null,
        base_country: form.base_country || null,
        hours_per_month: form.hours_per_month ? parseInt(form.hours_per_month) : null,
        bio: form.bio || null, linkedin_url: form.linkedin_url || null,
        specialisations: specs.length ? specs : null,
        aircraft_types: aircraft.length ? aircraft : null,
        format: formats.length ? formats : null,
        is_available: form.is_available,
        public_profile: form.public_profile,
      };
      if (existingId) {
        const { error: err } = await supabase.from('mentor_profiles').update(payload).eq('id', existingId);
        if (err) throw err;
      } else {
        const { error: err } = await supabase.from('mentor_profiles').insert(payload);
        if (err) throw err;
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
        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Pillar 14 — Mentors, Contributors & Unions</p>
        <h1 style={{ margin: '0.5rem 0 0.75rem', fontSize: '1.6rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>
          {existingId ? 'Update Mentor Profile' : 'Become a Mentor / Contributor'}
        </h1>
        <p style={{ margin: 0, fontSize: '0.9rem', color: '#64748b', lineHeight: 1.6, marginBottom: '2rem' }}>
          A 15,000-hour Captain retiring from a major carrier carries knowledge no simulator can replicate. Log it here. Junior pilots who complete your mentorship hours earn a Recognition Score multiplier. You earn one too — for every hour you give, the platform records it as a verified contribution to the industry.
        </p>

        {status === 'success' && (
          <div style={{ ...card, borderColor: 'rgba(16,185,129,0.3)', marginBottom: '1.5rem', display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
            <CheckCircle2 size={22} color="#10b981" style={{ flexShrink: 0 }} />
            <div>
              <p style={{ margin: 0, fontWeight: 700 }}>Profile Saved</p>
              <p style={{ margin: '0.3rem 0 0', fontSize: '0.82rem', color: '#94a3b8', lineHeight: 1.6 }}>
                Your mentor profile is {form.public_profile ? 'publicly visible' : 'private'}. Junior pilots searching for mentors in your specialisation will now find you.
              </p>
            </div>
          </div>
        )}

        {/* Role type */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Role Type</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.65rem' }}>
            {ROLE_TYPES.map(r => {
              const sel = form.role_type === r.key;
              return (
                <div key={r.key} onClick={() => set('role_type', r.key)} style={{ border: `1px solid ${sel ? 'rgba(99,102,241,0.5)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(99,102,241,0.08)' : 'transparent', borderRadius: '10px', padding: '0.85rem', cursor: 'pointer' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <p style={{ margin: 0, fontWeight: 700, fontSize: '0.82rem', color: sel ? '#a5b4fc' : '#94a3b8' }}>{r.label}</p>
                    {sel && <CheckCircle2 size={13} color="#a5b4fc" />}
                  </div>
                  <p style={{ margin: 0, fontSize: '0.7rem', color: sel ? '#6366f1' : '#334155' }}>{r.desc}</p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Identity */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Profile</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>Display Name <span style={{ color: '#ef4444' }}>*</span></label><input type="text" placeholder="e.g. Capt. John Smith (B777)" value={form.display_name} onChange={e => set('display_name', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Current / Last Airline</label><input type="text" placeholder="e.g. Emirates, Retired" value={form.current_airline} onChange={e => set('current_airline', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Rank / Role</label><input type="text" placeholder="e.g. Captain, Senior FO" value={form.rank} onChange={e => set('rank', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Total Hours</label><input type="number" placeholder="e.g. 15000" value={form.total_hours} onChange={e => set('total_hours', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Years Experience</label><input type="number" placeholder="e.g. 22" value={form.years_experience} onChange={e => set('years_experience', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Base Country</label><input type="text" placeholder="e.g. UAE" value={form.base_country} onChange={e => set('base_country', e.target.value)} style={inp} /></div>
            <div><label style={lbl}>Mentorship Hours / Month</label><input type="number" placeholder="e.g. 4" value={form.hours_per_month} onChange={e => set('hours_per_month', e.target.value)} style={inp} /></div>
            <div style={{ gridColumn: 'span 2' }}><label style={lbl}>LinkedIn URL</label><input type="url" placeholder="https://linkedin.com/in/…" value={form.linkedin_url} onChange={e => set('linkedin_url', e.target.value)} style={inp} /></div>
          </div>
        </div>

        {/* Aircraft */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Aircraft Types Flown</p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '0.65rem' }}>
            {aircraft.map(a => (
              <span key={a} style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', padding: '0.2rem 0.6rem', borderRadius: '999px', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', fontSize: '0.72rem', background: 'rgba(96,165,250,0.07)' }}>
                {a}<button onClick={() => setAircraft(p => p.filter(x => x !== a))} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#475569', display: 'flex', padding: 0 }}><X size={10} /></button>
              </span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <input type="text" placeholder="e.g. B777, A320" value={newAircraft} onChange={e => setNewAircraft(e.target.value)} onKeyDown={e => { if (e.key === 'Enter' && newAircraft.trim()) { setAircraft(p => [...p, newAircraft.trim()]); setNewAircraft(''); } }} style={{ ...inp, flex: 1 }} />
            <button onClick={() => { if (newAircraft.trim()) { setAircraft(p => [...p, newAircraft.trim()]); setNewAircraft(''); } }} style={{ padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid rgba(96,165,250,0.3)', background: 'transparent', color: '#60a5fa', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.8rem' }}><Plus size={13} /> Add</button>
          </div>
        </div>

        {/* Specialisations */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Specialisations</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {SPECIALISATIONS.map(s => {
              const sel = specs.includes(s);
              return (
                <button key={s} onClick={() => toggleSpec(s)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: `1px solid ${sel ? 'rgba(167,139,250,0.4)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(167,139,250,0.1)' : 'transparent', color: sel ? '#c4b5fd' : '#475569', fontSize: '0.72rem', cursor: 'pointer' }}>
                  {sel ? '✓ ' : ''}{s}
                </button>
              );
            })}
          </div>
        </div>

        {/* Format & availability */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <p style={{ margin: '0 0 0.75rem', fontSize: '0.75rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Mentorship Format</p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '1rem' }}>
            {FORMATS.map(f => {
              const sel = formats.includes(f.key);
              return (
                <button key={f.key} onClick={() => toggleFormat(f.key)} style={{ padding: '0.3rem 0.75rem', borderRadius: '999px', border: `1px solid ${sel ? 'rgba(52,211,153,0.4)' : 'rgba(255,255,255,0.07)'}`, background: sel ? 'rgba(52,211,153,0.08)' : 'transparent', color: sel ? '#34d399' : '#475569', fontSize: '0.72rem', cursor: 'pointer' }}>
                  {sel ? '✓ ' : ''}{f.label}
                </button>
              );
            })}
          </div>
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
            <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
              <input type="checkbox" checked={form.is_available} onChange={e => set('is_available', e.target.checked)} />
              Currently available for mentees
            </label>
            <label style={{ display: 'flex', gap: '0.6rem', alignItems: 'center', cursor: 'pointer', fontSize: '0.82rem', color: '#94a3b8' }}>
              <input type="checkbox" checked={form.public_profile} onChange={e => set('public_profile', e.target.checked)} />
              List publicly in mentor directory
            </label>
          </div>
        </div>

        {/* Bio */}
        <div style={{ ...card, marginBottom: '1.25rem' }}>
          <label style={lbl}>Bio (optional)</label>
          <textarea rows={4} placeholder="Briefly describe your aviation career, what you offer mentees, and the kind of pilots you work best with…" value={form.bio} onChange={e => set('bio', e.target.value)} style={{ ...inp, resize: 'vertical', lineHeight: 1.5 }} />
        </div>

        {/* Recognition callout */}
        <div style={{ background: 'rgba(99,102,241,0.05)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: '10px', padding: '0.85rem 1rem', marginBottom: '1.25rem' }}>
          <p style={{ margin: 0, fontSize: '0.78rem', color: '#a5b4fc', lineHeight: 1.6 }}>
            <strong>Recognition Multiplier:</strong> Every logged mentorship hour earns you a platform contribution multiplier applied to your Recognition Score. Senior pilots who give back to the pipeline receive verified, permanent recognition on the platform — not just goodwill. The platform records what you gave. The industry sees what you built.
          </p>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem', alignItems: 'center' }}><AlertCircle size={14} color="#f87171" /><p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p></div>}

        <button onClick={handleSubmit} disabled={!form.display_name || status === 'submitting'} style={{ width: '100%', padding: '1rem', borderRadius: '12px', border: 'none', background: form.display_name && status !== 'submitting' ? '#6366f1' : '#1e293b', color: form.display_name && status !== 'submitting' ? '#fff' : '#475569', fontWeight: 700, fontSize: '0.9rem', cursor: form.display_name && status !== 'submitting' ? 'pointer' : 'not-allowed', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
          {status === 'submitting' ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />Saving…</> : <><Users size={16} />{existingId ? 'Update Mentor Profile' : 'Create Mentor Profile'}</>}
        </button>
      </div>
      <style>{`@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}} input::placeholder,textarea::placeholder{color:#475569} select option{background:#1e293b}`}</style>
    </div>
  );
}
