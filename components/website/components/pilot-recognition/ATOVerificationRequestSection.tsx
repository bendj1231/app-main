import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../../@/lib/supabase';
import { useAuth } from '../../@/contexts/AuthContext';
import { Send, Clock, CheckCircle2, XCircle, AlertCircle, Loader2, School, Calendar, MessageSquare, TrendingUp, ShieldCheck } from 'lucide-react';

interface ATOInstitution {
  id: string;
  institution_name: string;
  country: string;
  tier: string;
}

interface VerificationRequest {
  id: string;
  created_at: string;
  ato_id: string;
  request_type: string;
  claimed_total_hours: number | null;
  claimed_pic_hours: number | null;
  claimed_period_from: string | null;
  claimed_period_to: string | null;
  pilot_message: string | null;
  status: string;
  ato_confirmed_hours: number | null;
  ato_response_note: string | null;
  responded_at: string | null;
  ato?: { institution_name: string };
}

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  pending: { label: 'Pending', color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', icon: <Clock size={14} /> },
  confirmed: { label: 'Confirmed', color: '#10b981', bg: 'rgba(16,185,129,0.1)', icon: <CheckCircle2 size={14} /> },
  amended: { label: 'Amended', color: '#0ea5e9', bg: 'rgba(14,165,233,0.1)', icon: <AlertCircle size={14} /> },
  rejected: { label: 'Rejected', color: '#ef4444', bg: 'rgba(239,68,68,0.1)', icon: <XCircle size={14} /> },
};

export function ATOVerificationRequestSection() {
  const { currentUser } = useAuth();
  const [supabaseProfileId, setSupabaseProfileId] = useState<string | null>(null);
  const [atos, setAtos] = useState<ATOInstitution[]>([]);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadTimedOut, setLoadTimedOut] = useState(false);
  const loadTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({
    ato_id: '',
    claimed_total_hours: '',
    claimed_pic_hours: '',
    claimed_period_from: '',
    claimed_period_to: '',
    pilot_message: '',
  });

  const load = async () => {
    if (!currentUser?.email) return;
    setLoading(true);
    setLoadTimedOut(false);
    loadTimer.current = setTimeout(() => setLoadTimedOut(true), 2500);
    try {
      // Resolve Supabase UUID — Auth0 currentUser.id is not a UUID
      let pilotId = supabaseProfileId;
      if (!pilotId) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('id')
          .eq('email', currentUser.email)
          .single();
        pilotId = profile?.id ?? null;
        if (pilotId) setSupabaseProfileId(pilotId);
      }

      // Fetch active ATOs
      const { data: atoData } = await supabase
        .from('ato_institutions')
        .select('id, institution_name, country, tier')
        .eq('onboarding_status', 'active')
        .order('institution_name');
      setAtos(atoData ?? []);

      if (pilotId) {
        // Fetch pilot's verification requests with ATO names
        const { data: reqData } = await supabase
          .from('ato_verification_requests')
          .select('*, ato:ato_id(institution_name)')
          .eq('pilot_id', pilotId)
          .order('created_at', { ascending: false });
        setRequests(reqData ?? []);
      }
    } finally {
      if (loadTimer.current) clearTimeout(loadTimer.current);
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, [currentUser?.email]);

  const canSubmit = form.ato_id && form.claimed_total_hours && parseFloat(form.claimed_total_hours) > 0;

  async function handleSubmit() {
    if (!canSubmit || !supabaseProfileId || submitting) return;
    setSubmitting(true);
    try {
      const { data: inserted, error } = await supabase.from('ato_verification_requests').insert({
        pilot_id: supabaseProfileId,
        ato_id: form.ato_id,
        request_type: 'hour_verification',
        claimed_total_hours: parseFloat(form.claimed_total_hours),
        claimed_pic_hours: form.claimed_pic_hours ? parseFloat(form.claimed_pic_hours) : null,
        claimed_period_from: form.claimed_period_from || null,
        claimed_period_to: form.claimed_period_to || null,
        pilot_message: form.pilot_message || null,
        status: 'pending',
      }).select('id').single();
      if (error) throw error;

      // Notify ATO admin (fire-and-forget)
      try {
        const { data: { session } } = await supabase.auth.getSession();
        /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
        const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL as string;
        await fetch(`${supabaseUrl}/functions/v1/ato-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session?.access_token ?? ''}`,
          },
          body: JSON.stringify({
            atoId: form.ato_id,
            pilotName: currentUser.email,
            claimedHours: form.claimed_total_hours,
            requestId: inserted?.id,
          }),
        });
      } catch (notifyErr) {
        console.error('Notification failed:', notifyErr);
      }

      setShowModal(false);
      setForm({ ato_id: '', claimed_total_hours: '', claimed_pic_hours: '', claimed_period_from: '', claimed_period_to: '', pilot_message: '' });
      await load();
    } catch (e: any) {
      alert(e?.message ?? 'Submission failed');
    } finally {
      setSubmitting(false);
    }
  }

  const cardStyle: React.CSSProperties = {
    background: 'rgba(30, 41, 59, 0.6)',
    borderRadius: '14px',
    padding: '1.25rem',
    border: '1px solid rgba(255, 255, 255, 0.08)',
  };

  return (
    <div>
      {/* Header */}
      <div style={{ ...cardStyle, marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <School size={18} color="#38bdf8" />
              <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>ATO Attestation</p>
              {/* Step 30: Verification badges */}
              {requests.filter(r => r.status === 'confirmed').length > 0 && (
                <span style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem', borderRadius: '4px', background: 'rgba(16,185,129,0.15)', color: '#34d399', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                  <CheckCircle2 size={11} /> Attested
                </span>
              )}
            </div>
            <p style={{ margin: 0, fontSize: '0.8rem', color: '#94a3b8', lineHeight: 1.5 }}>
              Request your flight school to attest to your training hours. PilotRecognition verifies your regulatory credentials and background checks internationally. Together they boost your Recognition Score.
            </p>
            {/* Verified by list */}
            {requests.filter(r => r.status === 'confirmed').length > 0 && (
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.4rem', marginTop: '0.5rem' }}>
                {requests.filter(r => r.status === 'confirmed').map(r => (
                  <span key={r.id} style={{ fontSize: '0.68rem', padding: '0.2rem 0.55rem', borderRadius: '6px', background: 'rgba(16,185,129,0.08)', color: '#34d399', border: '1px solid rgba(16,185,129,0.2)' }}>
                    {r.ato?.institution_name ?? 'ATO'} — {r.ato_confirmed_hours ?? r.claimed_total_hours} hrs
                  </span>
                ))}
              </div>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '0.65rem 1.25rem', borderRadius: '10px',
              background: 'rgba(255,255,255,0.04)', color: '#cbd5e1', fontWeight: 600, fontSize: '0.82rem',
              border: '1px solid rgba(148,163,184,0.3)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem',
              flexShrink: 0,
            }}
          >
            <Send size={14} /> Request Verification
          </button>
        </div>
      </div>

      {/* Requests list */}
      {loading && !loadTimedOut ? (
        <div style={{ textAlign: 'center', padding: '2rem', color: '#64748b' }}>
          <Loader2 size={20} style={{ animation: 'spin 1s linear infinite', margin: '0 auto' }} />
          <p style={{ marginTop: '0.5rem', fontSize: '0.8rem' }}>Loading verification requests…</p>
        </div>
      ) : (loading && loadTimedOut) || requests.length === 0 ? (
        <div style={{ ...cardStyle, textAlign: 'center', padding: '2.5rem' }}>
          <ShieldCheck size={28} color="#475569" style={{ margin: '0 auto 0.75rem' }} />
          <p style={{ margin: 0, color: '#94a3b8', fontSize: '0.9rem' }}>No active verification requests found.</p>
          <p style={{ margin: '0.5rem 0 0', color: '#64748b', fontSize: '0.8rem' }}>
            Click &apos;Request Verification&apos; above to have your flight school attest your training hours.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
          {requests.map(req => {
            const statusCfg = STATUS_CONFIG[req.status] ?? STATUS_CONFIG.pending;
            return (
              <div key={req.id} style={{ ...cardStyle, padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
                      <span style={{
                        fontSize: '0.68rem', padding: '0.15rem 0.5rem', borderRadius: '4px',
                        color: statusCfg.color, background: statusCfg.bg,
                        display: 'flex', alignItems: 'center', gap: '0.3rem', textTransform: 'uppercase', fontWeight: 700,
                      }}>
                        {statusCfg.icon} {statusCfg.label}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{req.ato?.institution_name ?? 'Unknown ATO'}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1' }}>
                      Claimed: <strong>{req.claimed_total_hours} hrs total</strong>
                      {req.claimed_pic_hours ? ` · ${req.claimed_pic_hours} PIC` : ''}
                    </p>
                    {(req.claimed_period_from || req.claimed_period_to) && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.72rem', color: '#64748b', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                        <Calendar size={12} /> {req.claimed_period_from ?? '—'} → {req.claimed_period_to ?? '—'}
                      </p>
                    )}
                    {req.pilot_message && (
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>
                        "{req.pilot_message}"
                      </p>
                    )}
                    {req.status === 'amended' && req.ato_confirmed_hours !== null && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ margin: '0 0 0.5rem', fontSize: '0.78rem', color: '#0ea5e9' }}>
                          <AlertCircle size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                          ATO amended to <strong>{req.ato_confirmed_hours} hrs</strong>. Accept or reject:
                        </p>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={async () => {
                              await supabase.from('ato_verification_requests').update({ status: 'confirmed' }).eq('id', req.id);
                              await load();
                            }}
                            style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #10b981', background: 'transparent', color: '#34d399', fontSize: '0.75rem', cursor: 'pointer' }}
                          >Accept</button>
                          <button
                            onClick={async () => {
                              await supabase.from('ato_verification_requests').update({ status: 'rejected' }).eq('id', req.id);
                              await load();
                            }}
                            style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #ef4444', background: 'transparent', color: '#f87171', fontSize: '0.75rem', cursor: 'pointer' }}
                          >Reject</button>
                        </div>
                      </div>
                    )}
                    {req.status === 'rejected' && (
                      <div style={{ marginTop: '0.5rem' }}>
                        <p style={{ margin: '0 0 0.35rem', fontSize: '0.78rem', color: '#f87171' }}>
                          <XCircle size={12} style={{ display: 'inline', marginRight: '0.3rem' }} />
                          Rejected by ATO. You can appeal with additional documentation.
                        </p>
                        <button
                          onClick={async () => {
                            const reason = window.prompt('Enter additional details or documentation for your appeal:');
                            if (!reason) return;
                            await supabase.from('ato_verification_requests').update({
                              status: 'pending',
                              pilot_message: (req.pilot_message || '') + '\n[APPEAL]: ' + reason,
                            }).eq('id', req.id);
                            await load();
                          }}
                          style={{ padding: '0.35rem 0.8rem', borderRadius: '6px', border: '1px solid #f59e0b', background: 'transparent', color: '#fcd34d', fontSize: '0.75rem', cursor: 'pointer' }}
                        >File Appeal</button>
                      </div>
                    )}
                    {req.ato_response_note && (
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                        Response: "{req.ato_response_note}"
                      </p>
                    )}
                  </div>
                  <span style={{ fontSize: '0.68rem', color: '#475569', flexShrink: 0 }}>
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div style={{
          position: 'fixed', inset: 0, zIndex: 100,
          background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '1rem',
        }} onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{
            background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px',
            maxWidth: '520px', width: '100%', maxHeight: '90vh', overflowY: 'auto',
            padding: '1.5rem',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
              <div>
                <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase' }}>Pillar 5 — ATO Attestation</p>
                <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>Request Hour Attestation</h3>
              </div>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '1.2rem' }}>×</button>
            </div>
            <p style={{ margin: '0 0 1rem', fontSize: '0.75rem', color: '#475569', lineHeight: 1.5 }}>
              PilotRecognition verifies your regulatory credentials and background checks internationally. Training hours are attested by your ATO — not independently verified by us.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {/* ATO Select */}
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  Select Your ATO / Flight School <span style={{ color: '#ef4444' }}>*</span>
                </label>
                {atos.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: '#64748b' }}>No active ATOs available. Check back soon.</p>
                ) : (
                  <select
                    value={form.ato_id}
                    onChange={(e) => setForm(f => ({ ...f, ato_id: e.target.value }))}
                    style={{
                      width: '100%', padding: '0.65rem', borderRadius: '10px',
                      border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.8)',
                      color: '#fff', fontSize: '0.82rem', outline: 'none',
                    }}
                  >
                    <option value="">Choose an institution…</option>
                    {atos.map(ato => (
                      <option key={ato.id} value={ato.id}>{ato.institution_name} — {ato.country} ({ato.tier})</option>
                    ))}
                  </select>
                )}
              </div>

              {/* Hours */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Total Hours <span style={{ color: '#ef4444' }}>*</span>
                  </label>
                  <div style={{ position: 'relative' }}>
                    <TrendingUp size={14} color="#64748b" style={{ position: 'absolute', left: '0.65rem', top: '50%', transform: 'translateY(-50%)' }} />
                    <input
                      type="number" min={0} step={0.1}
                      placeholder="e.g. 210.5"
                      value={form.claimed_total_hours}
                      onChange={(e) => setForm(f => ({ ...f, claimed_total_hours: e.target.value }))}
                      style={{
                        width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.65rem 0.65rem 2rem',
                        borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                        background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none',
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    PIC Hours
                  </label>
                  <input
                    type="number" min={0} step={0.1}
                    placeholder="e.g. 150"
                    value={form.claimed_pic_hours}
                    onChange={(e) => setForm(f => ({ ...f, claimed_pic_hours: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '0.65rem',
                      borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Period */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Period From
                  </label>
                  <input
                    type="date"
                    value={form.claimed_period_from}
                    onChange={(e) => setForm(f => ({ ...f, claimed_period_from: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '0.65rem',
                      borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none',
                    }}
                  />
                </div>
                <div>
                  <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                    Period To
                  </label>
                  <input
                    type="date"
                    value={form.claimed_period_to}
                    onChange={(e) => setForm(f => ({ ...f, claimed_period_to: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '0.65rem',
                      borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none',
                    }}
                  />
                </div>
              </div>

              {/* Message */}
              <div>
                <label style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600, display: 'block', marginBottom: '0.3rem' }}>
                  Message to ATO (optional)
                </label>
                <div style={{ position: 'relative' }}>
                  <MessageSquare size={14} color="#64748b" style={{ position: 'absolute', left: '0.65rem', top: '0.75rem' }} />
                  <textarea
                    rows={3}
                    placeholder="Any details to help your ATO verify your hours…"
                    value={form.pilot_message}
                    onChange={(e) => setForm(f => ({ ...f, pilot_message: e.target.value }))}
                    style={{
                      width: '100%', boxSizing: 'border-box', padding: '0.65rem 0.65rem 0.65rem 2rem',
                      borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)',
                      background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none',
                      resize: 'vertical', lineHeight: 1.5,
                    }}
                  />
                </div>
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                disabled={!canSubmit || submitting || atos.length === 0}
                style={{
                  width: '100%', padding: '0.85rem', borderRadius: '12px', border: 'none',
                  background: canSubmit && !submitting && atos.length > 0 ? '#0ea5e9' : '#1e293b',
                  color: canSubmit && !submitting && atos.length > 0 ? '#fff' : '#475569',
                  fontWeight: 700, fontSize: '0.9rem', cursor: canSubmit && !submitting && atos.length > 0 ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  marginTop: '0.5rem',
                }}
              >
                {submitting ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Sending Request…</>
                ) : (
                  <><Send size={16} /> Submit Verification Request</>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
