import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, CheckCircle2, XCircle, Clock, Loader2, Send, AlertCircle, ShieldCheck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/contexts/AuthContext';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface ATORequest {
  id: string;
  ato_name: string;
  course_name: string;
  course_type: string;
  completion_date: string;
  certificate_number: string | null;
  submitted_hours: number | null;
  status: 'pending' | 'under_review' | 'approved' | 'rejected' | 'expired';
  reviewer_notes: string | null;
  attestation_token: string | null;
  token_issued_at: string | null;
  created_at: string;
}

const STATUS_CONFIG = {
  pending:      { label: 'Pending Review',  color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)',  Icon: Clock },
  under_review: { label: 'Under Review',    color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)', Icon: Clock },
  approved:     { label: 'Approved',         color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', Icon: CheckCircle2 },
  rejected:     { label: 'Rejected',         color: '#ef4444', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.25)', Icon: XCircle },
  expired:      { label: 'Expired',          color: '#f97316', bg: 'rgba(249,115,22,0.08)', border: 'rgba(249,115,22,0.25)', Icon: AlertCircle },
};

const COURSE_TYPES = ['CPL','PPL','IR','MEL','MCC','TR','ATPL','OTHER'];

const base: React.CSSProperties = {
  background: 'rgba(15,23,42,0.8)',
  borderRadius: '16px',
  padding: '1.25rem',
  border: '1px solid rgba(255,255,255,0.08)',
};

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(30,41,59,0.8)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
  padding: '0.65rem 0.85rem',
  color: '#ffffff',
  fontSize: '0.85rem',
  outline: 'none',
  boxSizing: 'border-box',
};

const labelStyle: React.CSSProperties = {
  display: 'block',
  fontSize: '0.72rem',
  letterSpacing: '0.1em',
  textTransform: 'uppercase',
  color: '#94a3b8',
  marginBottom: '0.4rem',
};

export function ATOAttestationPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [requests, setRequests] = useState<ATORequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    ato_name: '',
    ato_contact_email: '',
    country: 'PH',
    course_name: '',
    course_type: 'CPL',
    completion_date: '',
    certificate_number: '',
    submitted_hours: '',
  });

  const loadRequests = useCallback(async () => {
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    const { data, error: err } = await supabase
      .from('ato_attestation_requests')
      .select('*')
      .eq('pilot_id', currentUser.id)
      .order('created_at', { ascending: false });
    if (!err) setRequests(data ?? []);
    setLoading(false);
  }, [currentUser?.id]);

  useEffect(() => { loadRequests(); }, [loadRequests]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!currentUser?.id) return;
    setSubmitting(true);
    setError(null);

    const { data: wallet } = await supabase
      .from('pilot_verification_wallet')
      .select('id')
      .eq('pilot_id', currentUser.id)
      .maybeSingle();

    if (!wallet) {
      setError('You must initiate your Verification Wallet before submitting an ATO request. Go to Verification → Begin Verification first.');
      setSubmitting(false);
      return;
    }

    const { error: insertErr } = await supabase
      .from('ato_attestation_requests')
      .insert({
        pilot_id: currentUser.id,
        wallet_id: wallet.id,
        ato_name: form.ato_name,
        ato_contact_email: form.ato_contact_email || null,
        country: form.country,
        course_name: form.course_name,
        course_type: form.course_type,
        completion_date: form.completion_date,
        certificate_number: form.certificate_number || null,
        submitted_hours: form.submitted_hours ? parseFloat(form.submitted_hours) : null,
      });

    if (insertErr) {
      setError(insertErr.message);
    } else {
      setSuccess(true);
      setShowForm(false);
      setForm({ ato_name:'', ato_contact_email:'', country:'PH', course_name:'', course_type:'CPL', completion_date:'', certificate_number:'', submitted_hours:'' });
      await loadRequests();
    }
    setSubmitting(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Profile
        </button>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
          <div>
            <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Hub A — ATO Integration</p>
            <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>ATO Attestation Requests</h1>
            <p style={{ margin: '0.6rem 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6, maxWidth: '520px' }}>
              Submit training records to your Approved Training Organisation for institutional validation. Once approved, an attestation token is issued to your Verification Wallet. This satisfies the Hub A requirement for the UCF framework.
            </p>
          </div>
          {!showForm && (
            <button
              onClick={() => { setShowForm(true); setSuccess(false); }}
              style={{ padding: '0.7rem 1.4rem', borderRadius: '999px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
            >
              + New Request
            </button>
          )}
        </div>

        {/* Success banner */}
        {success && (
          <div style={{ ...base, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#d1fae5' }}>Request submitted. Your ATO will be notified to review and approve. Check back here for status updates.</p>
          </div>
        )}

        {/* Submission form */}
        {showForm && (
          <form onSubmit={handleSubmit} style={{ ...base, marginBottom: '2rem', display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
            <div>
              <p style={{ margin: '0 0 0.5rem', fontSize: '0.95rem', fontWeight: 600, color: '#ffffff' }}>New ATO Attestation Request</p>
              <p style={{ margin: 0, fontSize: '0.78rem', color: '#64748b' }}>All fields marked * are required.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
              <div>
                <label style={labelStyle}>ATO / Flight School Name *</label>
                <input required style={inputStyle} value={form.ato_name} onChange={e => setForm(f => ({...f, ato_name: e.target.value}))} placeholder="e.g. WCC Aviation College" />
              </div>
              <div>
                <label style={labelStyle}>ATO Contact Email</label>
                <input type="email" style={inputStyle} value={form.ato_contact_email} onChange={e => setForm(f => ({...f, ato_contact_email: e.target.value}))} placeholder="registrar@ato.edu" />
              </div>
              <div>
                <label style={labelStyle}>Course Name *</label>
                <input required style={inputStyle} value={form.course_name} onChange={e => setForm(f => ({...f, course_name: e.target.value}))} placeholder="e.g. Commercial Pilot Licence Program" />
              </div>
              <div>
                <label style={labelStyle}>Course Type *</label>
                <select required style={{...inputStyle, cursor: 'pointer'}} value={form.course_type} onChange={e => setForm(f => ({...f, course_type: e.target.value}))}>
                  {COURSE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label style={labelStyle}>Completion Date *</label>
                <input required type="date" style={inputStyle} value={form.completion_date} onChange={e => setForm(f => ({...f, completion_date: e.target.value}))} />
              </div>
              <div>
                <label style={labelStyle}>Certificate / Diploma Number</label>
                <input style={inputStyle} value={form.certificate_number} onChange={e => setForm(f => ({...f, certificate_number: e.target.value}))} placeholder="e.g. L 25-052165" />
              </div>
              <div>
                <label style={labelStyle}>Hours Submitted</label>
                <input type="number" min="0" step="0.1" style={inputStyle} value={form.submitted_hours} onChange={e => setForm(f => ({...f, submitted_hours: e.target.value}))} placeholder="e.g. 200.5" />
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <input style={inputStyle} value={form.country} onChange={e => setForm(f => ({...f, country: e.target.value}))} placeholder="PH" />
              </div>
            </div>

            {error && (
              <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.25)', borderRadius: '8px', padding: '0.75rem 1rem', display: 'flex', gap: '0.5rem', alignItems: 'flex-start' }}>
                <AlertCircle size={15} color="#f87171" style={{ flexShrink: 0, marginTop: '0.1rem' }} />
                <p style={{ margin: 0, fontSize: '0.8rem', color: '#f87171' }}>{error}</p>
              </div>
            )}

            <div style={{ display: 'flex', gap: '0.75rem' }}>
              <button type="submit" disabled={submitting} style={{ padding: '0.7rem 1.5rem', borderRadius: '999px', border: 'none', background: submitting ? '#1e293b' : '#0ea5e9', color: submitting ? '#475569' : '#fff', fontWeight: 600, fontSize: '0.82rem', cursor: submitting ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {submitting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Send size={14} /> Submit Request</>}
              </button>
              <button type="button" onClick={() => setShowForm(false)} style={{ padding: '0.7rem 1.2rem', borderRadius: '999px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.82rem', cursor: 'pointer' }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Existing requests */}
        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2rem 0' }}>
            <Loader2 size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ margin: 0, color: '#64748b' }}>Loading requests…</p>
          </div>
        ) : requests.length === 0 ? (
          <div style={{ ...base, textAlign: 'center', padding: '2.5rem' }}>
            <ShieldCheck size={32} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>No ATO attestation requests yet. Submit your first training record above.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            {requests.map(req => {
              const cfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
              const Ic = cfg.Icon;
              return (
                <div key={req.id} style={{ ...base, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                        <Ic size={14} color={cfg.color} />
                        <span style={{ fontSize: '0.72rem', fontWeight: 600, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cfg.label}</span>
                      </div>
                      <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>{req.course_name}</p>
                      <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#94a3b8' }}>{req.ato_name} · {req.course_type} · Completed {new Date(req.completion_date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                      {req.submitted_hours && <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{req.submitted_hours} hours submitted</p>}
                      {req.reviewer_notes && (
                        <p style={{ margin: '0.5rem 0 0', fontSize: '0.78rem', color: req.status === 'rejected' ? '#fca5a5' : '#cbd5e1', background: 'rgba(0,0,0,0.2)', padding: '0.4rem 0.65rem', borderRadius: '6px' }}>
                          Note: {req.reviewer_notes}
                        </p>
                      )}
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ margin: 0, fontSize: '0.65rem', color: '#475569' }}>Submitted {new Date(req.created_at).toLocaleDateString('en-GB')}</p>
                      {req.attestation_token && (
                        <div style={{ marginTop: '0.5rem', background: 'rgba(16,185,129,0.15)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '6px', padding: '0.3rem 0.6rem' }}>
                          <p style={{ margin: 0, fontSize: '0.65rem', color: '#10b981', fontWeight: 600 }}>✓ Token Issued</p>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
