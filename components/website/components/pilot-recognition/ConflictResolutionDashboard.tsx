import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, AlertTriangle, CheckCircle2, Clock, XCircle, Loader2, Upload, Send, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '../../@/lib/supabase';
import { useAuth } from '../../@/contexts/AuthContext';

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Conflict {
  id: string;
  conflict_type: string;
  declared_value: string | null;
  returned_value: string | null;
  source_authority: string | null;
  status: 'open' | 'pilot_responded' | 'under_review' | 'resolved' | 'dismissed';
  pilot_explanation: string | null;
  pilot_responded_at: string | null;
  resolution: string | null;
  resolution_notes: string | null;
  evidence_url: string | null;
  created_at: string;
  updated_at: string;
}

const CONFLICT_TYPE_LABELS: Record<string, string> = {
  hours_mismatch: 'Flight Hours Mismatch',
  license_mismatch: 'License / Qualification Mismatch',
  medical_mismatch: 'Medical Certificate Mismatch',
  identity_mismatch: 'Identity Verification Failed',
  name_mismatch: 'Name Discrepancy',
  other: 'Other Discrepancy',
};

const STATUS_CFG = {
  open:             { label: 'Action Required',  color: '#ef4444', bg: 'rgba(239,68,68,0.08)',   border: 'rgba(239,68,68,0.3)',   Icon: AlertTriangle },
  pilot_responded:  { label: 'Response Sent',    color: '#f59e0b', bg: 'rgba(245,158,11,0.08)',  border: 'rgba(245,158,11,0.25)', Icon: Clock },
  under_review:     { label: 'Under Review',     color: '#60a5fa', bg: 'rgba(96,165,250,0.08)',  border: 'rgba(96,165,250,0.25)', Icon: Clock },
  resolved:         { label: 'Resolved',         color: '#10b981', bg: 'rgba(16,185,129,0.08)', border: 'rgba(16,185,129,0.25)', Icon: CheckCircle2 },
  dismissed:        { label: 'Dismissed',        color: '#64748b', bg: 'rgba(30,41,59,0.5)',     border: 'rgba(255,255,255,0.08)', Icon: XCircle },
};

const RESOLUTION_LABELS: Record<string, string> = {
  accept_declared:  'Accepted your declared data',
  accept_returned:  'Accepted registry data',
  inconclusive:     'Inconclusive — manual review needed',
  dismissed:        'Dismissed',
};

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
  resize: 'vertical' as const,
};

function ConflictCard({ conflict, onRespond }: { conflict: Conflict; onRespond: (c: Conflict) => void }) {
  const cfg = STATUS_CFG[conflict.status] ?? STATUS_CFG.open;
  const Ic = cfg.Icon;
  const canRespond = conflict.status === 'open';

  return (
    <div style={{ ...base, background: cfg.bg, border: `1px solid ${cfg.border}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          {/* Status badge */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', marginBottom: '0.5rem' }}>
            <Ic size={14} color={cfg.color} />
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: cfg.color, textTransform: 'uppercase', letterSpacing: '0.1em' }}>{cfg.label}</span>
          </div>

          <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.95rem' }}>
            {CONFLICT_TYPE_LABELS[conflict.conflict_type] ?? conflict.conflict_type}
          </p>
          <p style={{ margin: '0.2rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>
            Source: {conflict.source_authority ?? 'Verification Provider'} · Raised {new Date(conflict.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
          </p>

          {/* What was returned */}
          {conflict.returned_value && (
            <div style={{ marginTop: '0.85rem', background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Registry Returned</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#fca5a5' }}>{conflict.returned_value}</p>
            </div>
          )}

          {conflict.declared_value && (
            <div style={{ marginTop: '0.5rem', background: 'rgba(96,165,250,0.06)', border: '1px solid rgba(96,165,250,0.15)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Declared Value</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#93c5fd' }}>{conflict.declared_value}</p>
            </div>
          )}

          {/* Pilot explanation (already submitted) */}
          {conflict.pilot_explanation && (
            <div style={{ marginTop: '0.75rem' }}>
              <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Your Response</p>
              <p style={{ margin: 0, fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.5 }}>{conflict.pilot_explanation}</p>
              {conflict.pilot_responded_at && (
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#475569' }}>Submitted {new Date(conflict.pilot_responded_at).toLocaleDateString('en-GB')}</p>
              )}
            </div>
          )}

          {/* Resolution */}
          {conflict.resolution && (
            <div style={{ marginTop: '0.75rem', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '8px', padding: '0.65rem 0.85rem' }}>
              <p style={{ margin: 0, fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Resolution</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.82rem', color: '#6ee7b7' }}>{RESOLUTION_LABELS[conflict.resolution] ?? conflict.resolution}</p>
              {conflict.resolution_notes && <p style={{ margin: '0.25rem 0 0', fontSize: '0.75rem', color: '#64748b' }}>{conflict.resolution_notes}</p>}
            </div>
          )}
        </div>

        {/* CTA */}
        {canRespond && (
          <button
            onClick={() => onRespond(conflict)}
            style={{ padding: '0.6rem 1.1rem', borderRadius: '999px', border: 'none', background: '#ef4444', color: '#fff', fontWeight: 600, fontSize: '0.78rem', cursor: 'pointer', whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            Respond
          </button>
        )}
      </div>
    </div>
  );
}

export function ConflictResolutionDashboard({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState<Conflict | null>(null);
  const [explanation, setExplanation] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  const loadConflicts = useCallback(async () => {
    if (!currentUser?.id) { setLoading(false); return; }
    setLoading(true);
    const { data, error } = await supabase
      .from('verification_conflicts')
      .select('*')
      .eq('pilot_id', currentUser.id)
      .order('created_at', { ascending: false });
    if (!error) setConflicts(data ?? []);
    setLoading(false);
  }, [currentUser?.id]);

  useEffect(() => { loadConflicts(); }, [loadConflicts]);

  const open = conflicts.filter(c => c.status === 'open');
  const active = conflicts.filter(c => c.status === 'pilot_responded' || c.status === 'under_review');
  const closed = conflicts.filter(c => c.status === 'resolved' || c.status === 'dismissed');

  async function handleSubmitResponse() {
    if (!selected || !currentUser?.id || !explanation.trim()) return;
    setSubmitting(true);
    setSubmitError(null);

    const { error } = await supabase
      .from('verification_conflicts')
      .update({
        status: 'pilot_responded',
        pilot_explanation: explanation.trim(),
        pilot_responded_at: new Date().toISOString(),
      })
      .eq('id', selected.id)
      .eq('pilot_id', currentUser.id);

    if (error) {
      setSubmitError(error.message);
    } else {
      setSubmitSuccess(true);
      setSelected(null);
      setExplanation('');
      await loadConflicts();
    }
    setSubmitting(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' }}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back to Profile
        </button>
        <button onClick={loadConflicts} style={{ background: 'none', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.78rem', padding: '0.4rem 0.75rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ maxWidth: '760px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Header */}
        <div style={{ marginBottom: '2rem' }}>
          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Verification Wallet</p>
          <h1 style={{ margin: '0.5rem 0 0', fontSize: '1.5rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Conflict Resolution</h1>
          <p style={{ margin: '0.6rem 0 0', fontSize: '0.85rem', color: '#64748b', lineHeight: 1.6 }}>
            When a verification check returns data that conflicts with your profile, a case is raised here. Respond with your explanation and supporting evidence. Our team reviews and resolves each case within 2–5 business days.
          </p>
        </div>

        {/* Success flash */}
        {submitSuccess && (
          <div style={{ ...base, background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', display: 'flex', gap: '0.85rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <CheckCircle2 size={18} color="#10b981" />
            <p style={{ margin: 0, fontSize: '0.85rem', color: '#d1fae5' }}>Response submitted. Our team will review within 2–5 business days and update the status.</p>
          </div>
        )}

        {/* Response modal */}
        {selected && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '540px', maxHeight: '90vh', overflow: 'auto' }}>
              <p style={{ margin: '0 0 0.25rem', fontSize: '0.7rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Respond to Conflict</p>
              <h2 style={{ margin: '0 0 1rem', fontSize: '1.1rem', fontFamily: 'Georgia, serif', fontWeight: 'normal', color: '#ffffff' }}>
                {CONFLICT_TYPE_LABELS[selected.conflict_type] ?? selected.conflict_type}
              </h2>

              {selected.returned_value && (
                <div style={{ background: 'rgba(239,68,68,0.06)', border: '1px solid rgba(239,68,68,0.18)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1rem' }}>
                  <p style={{ margin: '0 0 0.2rem', fontSize: '0.7rem', color: '#94a3b8' }}>Registry returned:</p>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#fca5a5' }}>{selected.returned_value}</p>
                </div>
              )}

              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.4rem' }}>Your Explanation *</label>
                <textarea
                  rows={5}
                  style={inputStyle}
                  placeholder="Explain the discrepancy. E.g. 'My medical was renewed on 15 May 2026 — renewal number 26-001234. The registry may not have updated yet.'"
                  value={explanation}
                  onChange={e => setExplanation(e.target.value)}
                />
              </div>

              <div style={{ background: 'rgba(14,165,233,0.06)', border: '1px solid rgba(14,165,233,0.15)', borderRadius: '8px', padding: '0.75rem 1rem', marginBottom: '1.25rem' }}>
                <p style={{ margin: 0, fontSize: '0.78rem', color: '#38bdf8', lineHeight: 1.5 }}>
                  <strong>Tip:</strong> Provide certificate numbers, renewal dates, or contact details for your issuing authority. The more detail, the faster we can resolve this.
                </p>
              </div>

              {submitError && (
                <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '8px', padding: '0.65rem 0.9rem', marginBottom: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <AlertCircle size={14} color="#f87171" style={{ flexShrink: 0 }} />
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#f87171' }}>{submitError}</p>
                </div>
              )}

              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <button
                  onClick={handleSubmitResponse}
                  disabled={submitting || !explanation.trim()}
                  style={{ flex: 1, padding: '0.75rem', borderRadius: '10px', border: 'none', background: (submitting || !explanation.trim()) ? '#1e293b' : '#0ea5e9', color: (submitting || !explanation.trim()) ? '#475569' : '#fff', fontWeight: 600, fontSize: '0.85rem', cursor: (submitting || !explanation.trim()) ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.4rem' }}
                >
                  {submitting ? <><Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> Submitting…</> : <><Send size={14} /> Submit Response</>}
                </button>
                <button
                  onClick={() => { setSelected(null); setExplanation(''); setSubmitError(null); }}
                  style={{ padding: '0.75rem 1.25rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.85rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {loading ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '2rem 0' }}>
            <Loader2 size={18} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
            <p style={{ margin: 0, color: '#64748b' }}>Loading conflicts…</p>
          </div>
        ) : conflicts.length === 0 ? (
          <div style={{ ...base, textAlign: 'center', padding: '3rem 2rem' }}>
            <ShieldCheck size={40} color="#10b981" style={{ margin: '0 auto 1rem' }} />
            <p style={{ margin: 0, fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>No Conflicts</p>
            <p style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', color: '#64748b' }}>All your verification checks are consistent with your profile data. No discrepancies detected.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>

            {/* Open — action required */}
            {open.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <AlertTriangle size={14} color="#ef4444" />
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Action Required ({open.length})</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {open.map(c => <ConflictCard key={c.id} conflict={c} onRespond={setSelected} />)}
                </div>
              </div>
            )}

            {/* In progress */}
            {active.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <Clock size={14} color="#60a5fa" />
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#60a5fa', textTransform: 'uppercase', letterSpacing: '0.12em' }}>In Progress ({active.length})</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {active.map(c => <ConflictCard key={c.id} conflict={c} onRespond={setSelected} />)}
                </div>
              </div>
            )}

            {/* Resolved / dismissed */}
            {closed.length > 0 && (
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.85rem' }}>
                  <CheckCircle2 size={14} color="#64748b" />
                  <p style={{ margin: 0, fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.12em' }}>Closed ({closed.length})</p>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {closed.map(c => <ConflictCard key={c.id} conflict={c} onRespond={setSelected} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
      <style>{`@keyframes spin { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }`}</style>
    </div>
  );
}
