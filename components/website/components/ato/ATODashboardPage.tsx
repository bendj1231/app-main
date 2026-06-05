import React, { useEffect, useState, useCallback } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import {
  ArrowLeft, CheckCircle2, XCircle, Clock, ShieldCheck, Users,
  Award, AlertTriangle, Loader2, ChevronDown, ChevronUp, RefreshCw, Plus, CreditCard, Send
} from 'lucide-react';
import { supabase } from '../../../../src/lib/supabase';
import { useAuth } from '../../../../src/contexts/AuthContext';
import { CSVUploadBox } from './CSVUploadBox';

/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL as string;

interface Props {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Graduate {
  id: string;
  display_name: string | null;
  full_name: string | null;
  email: string | null;
  total_flight_hours: number | null;
  overall_recognition_score: number | null;
  pathway_interests: string[] | null;
  verified_hours: number | null;
  last_request_status: string | null;
}

interface ATOInstitution {
  id: string;
  institution_name: string;
  tier: string;
  status: string;
  onboarding_status: string;
  verified_issuer: boolean;
  recognition_ready: boolean;
  total_graduates_linked: number;
  total_tokens_issued: number;
  placement_rate_pct: number | null;
  referral_dividend_balance_usd: number;
  country: string;
  stripe_subscription_id: string | null;
}

interface VerificationRequest {
  id: string;
  created_at: string;
  pilot_id: string;
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
}

interface IssuedToken {
  id: string;
  created_at: string;
  token_type: string;
  token_label: string;
  pilot_id: string;
  total_hours_verified: number | null;
  status: string;
  graduation_date: string | null;
  aircraft_ratings: string[] | null;
  signature_hash: string | null;
  signature_algorithm: string | null;
  revoked_at: string | null;
}

const dark: React.CSSProperties = { minHeight: '100vh', background: '#0f172a', color: '#ffffff', fontFamily: 'system-ui, sans-serif' };
const card: React.CSSProperties = { background: 'rgba(15,23,42,0.8)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '1.25rem' };

const STATUS_COLORS: Record<string, string> = {
  pending: '#f59e0b', confirmed: '#10b981', amended: '#0ea5e9',
  rejected: '#ef4444', expired: '#64748b', active: '#10b981',
  revoked: '#ef4444', submitted: '#60a5fa',
};

const TOKEN_LABELS: Record<string, string> = {
  cpl_complete: 'CPL-Complete',
  aam_ready: 'AAM-Ready',
  operator_specific: 'Operator-Specific',
  custom: 'Custom',
};

export function ATODashboardPage({ onBack, onNavigate }: Props) {
  const { currentUser } = useAuth();
  const [ato, setAto]         = useState<ATOInstitution | null>(null);
  const [requests, setRequests] = useState<VerificationRequest[]>([]);
  const [tokens, setTokens]   = useState<IssuedToken[]>([]);
  const [loading, setLoading] = useState(true);
  const [noATO, setNoATO]     = useState(false);
  const [activeTab, setActiveTab] = useState<'requests' | 'tokens' | 'issue' | 'graduates'>('requests');
  const [graduates, setGraduates] = useState<Graduate[]>([]);
  const [billingLoading, setBillingLoading] = useState(false);
  const [viewCredentialId, setViewCredentialId] = useState<string | null>(null);

  // Issue token form
  async function handleUpgrade(tier: 'analytics' | 'enterprise') {
    if (!ato || billingLoading) return;
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ato-stripe-checkout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({
          atoInstitutionId: ato.id,
          tier,
        }),
      });
      const data = await res.json();
      if (data.url) {
        safeRedirect(data.url);
      } else {
        alert(data.error || 'Failed to start checkout');
      }
    } catch (e: any) {
      alert(e?.message || 'Checkout failed');
    } finally {
      setBillingLoading(false);
    }
  }

  async function handleCancel() {
    if (!ato || billingLoading) return;
    if (!window.confirm('Cancel your subscription? You will keep access until the end of the billing period.')) return;
    setBillingLoading(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(`${SUPABASE_URL}/functions/v1/ato-stripe-cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${session?.access_token ?? ''}`,
        },
        body: JSON.stringify({ atoInstitutionId: ato.id }),
      });
      const data = await res.json();
      if (data.success) {
        await load();
      } else {
        alert(data.error || 'Failed to cancel');
      }
    } catch (e: any) {
      alert(e?.message || 'Cancel failed');
    } finally {
      setBillingLoading(false);
    }
  }

  const [issueForm, setIssueForm] = useState({
    pilot_id: '', token_type: 'cpl_complete', token_label: '',
    total_hours_verified: '', graduation_date: '', aircraft_ratings: '',
  });
  const [issuing, setIssuing] = useState(false);
  const [issueError, setIssueError] = useState<string | null>(null);
  const [issueSuccess, setIssueSuccess] = useState(false);

  // Responding to a request
  const [respondingId, setRespondingId] = useState<string | null>(null);
  const [respondForm, setRespondForm]   = useState({ confirmed_hours: '', note: '', outcome: 'confirmed' });
  const [responding, setResponding]     = useState(false);

  const load = useCallback(async () => {
    if (!currentUser?.id) return;
    setLoading(true);
    try {
      const { data: atoData } = await supabase
        .from('ato_institutions')
        .select('*')
        .eq('admin_user_id', currentUser.id)
        .maybeSingle();

      if (!atoData) { setNoATO(true); setLoading(false); return; }
      setAto(atoData);

      const [{ data: reqs }, { data: toks }, { data: grads }] = await Promise.all([
        supabase.from('ato_verification_requests').select('*').eq('ato_id', atoData.id).order('created_at', { ascending: false }).limit(50),
        supabase.from('ato_issued_tokens').select('*').eq('ato_id', atoData.id).order('created_at', { ascending: false }).limit(50),
        // Fetch graduates: pilots who've made verification requests to this ATO
        supabase.from('ato_verification_requests')
          .select('pilot_id, status, ato_confirmed_hours, profiles(id, display_name, full_name, email, total_flight_hours, overall_recognition_score, pathway_interests)')
          .eq('ato_id', atoData.id)
          .order('created_at', { ascending: false }),
      ]);
      setRequests(reqs ?? []);
      setTokens(toks ?? []);

      // Deduplicate graduates by pilot_id, keep most recent request details
      const gradMap = new Map<string, Graduate>();
      (grads ?? []).forEach((g: any) => {
        const pilotId = g.pilot_id;
        const prof = g.profiles;
        if (!gradMap.has(pilotId)) {
          gradMap.set(pilotId, {
            id: pilotId,
            display_name: prof?.display_name ?? null,
            full_name: prof?.full_name ?? null,
            email: prof?.email ?? null,
            total_flight_hours: prof?.total_flight_hours ?? null,
            overall_recognition_score: prof?.overall_recognition_score ?? null,
            pathway_interests: prof?.pathway_interests ?? null,
            verified_hours: g.ato_confirmed_hours ?? null,
            last_request_status: g.status,
          });
        }
      });
      setGraduates(Array.from(gradMap.values()));
    } finally {
      setLoading(false);
    }
  }, [currentUser?.id]);

  useEffect(() => { load(); }, [load]);

  async function issueToken() {
    if (!ato || !issueForm.pilot_id || !issueForm.token_label) return;
    setIssuing(true); setIssueError(null);
    try {
      const ratings = issueForm.aircraft_ratings.split(',').map(s => s.trim()).filter(Boolean);
      const hours = issueForm.total_hours_verified ? parseFloat(issueForm.total_hours_verified) : null;

      // Generate tamper-evident SHA-256 hash of token payload
      const payload = JSON.stringify({
        ato_id: ato.id,
        pilot_id: issueForm.pilot_id,
        token_type: issueForm.token_type,
        token_label: issueForm.token_label,
        total_hours_verified: hours,
        graduation_date: issueForm.graduation_date || null,
        aircraft_ratings: ratings,
        issued_at: new Date().toISOString(),
      });
      const encoder = new TextEncoder();
      const hashBuffer = await crypto.subtle.digest('SHA-256', encoder.encode(payload));
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const signatureHash = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

      const { error } = await supabase.from('ato_issued_tokens').insert({
        ato_id:              ato.id,
        pilot_id:            issueForm.pilot_id,
        issued_by_user_id:   currentUser?.id,
        token_type:          issueForm.token_type,
        token_label:         issueForm.token_label,
        total_hours_verified: hours,
        graduation_date:     issueForm.graduation_date || null,
        aircraft_ratings:    ratings.length ? ratings : null,
        status:              'active',
        signature_hash:      signatureHash,
        signature_algorithm: 'SHA-256',
      });
      if (error) throw error;
      setIssueSuccess(true);
      setIssueForm({ pilot_id: '', token_type: 'cpl_complete', token_label: '', total_hours_verified: '', graduation_date: '', aircraft_ratings: '' });
      await load();
      setTimeout(() => setIssueSuccess(false), 3000);
    } catch (e: any) {
      setIssueError(e?.message ?? 'Issue failed.');
    } finally {
      setIssuing(false);
    }
  }

  async function respondToRequest(reqId: string) {
    setResponding(true);
    try {
      // Get the request details first
      const { data: reqData } = await supabase
        .from('ato_verification_requests')
        .select('pilot_id, claimed_total_hours')
        .eq('id', reqId)
        .single();

      const confirmedHours = respondForm.confirmed_hours ? parseFloat(respondForm.confirmed_hours) : null;

      const { error } = await supabase.from('ato_verification_requests').update({
        status:               respondForm.outcome,
        ato_confirmed_hours:  confirmedHours,
        ato_response_note:    respondForm.note || null,
        responded_at:         new Date().toISOString(),
        responded_by:         currentUser?.id,
      }).eq('id', reqId);
      if (error) throw error;

      // Step 26: On confirm, auto-update pilot profile hours
      if (respondForm.outcome === 'confirmed' && reqData?.pilot_id && confirmedHours) {
        await supabase.from('profiles').update({
          total_flight_hours: confirmedHours,
          updated_at: new Date().toISOString(),
        }).eq('id', reqData.pilot_id);
      }

      // Step 29: Log to user_activity_log
      await supabase.from('user_activity_log').insert({
        user_id: reqData?.pilot_id,
        action: `ato_verification_${respondForm.outcome}`,
        details: {
          request_id: reqId,
          ato_id: ato?.id,
          ato_name: ato?.institution_name,
          outcome: respondForm.outcome,
          confirmed_hours: confirmedHours,
          note: respondForm.note,
        },
        created_at: new Date().toISOString(),
      });

      setRespondingId(null);
      await load();
    } finally {
      setResponding(false);
    }
  }

  async function revokeToken(tokenId: string) {
    if (!window.confirm('Revoke this credential? This action is permanent and visible in the audit trail.')) return;
    await supabase.from('ato_issued_tokens').update({
      status: 'revoked', revoked_at: new Date().toISOString(), revoked_by: currentUser?.id,
    }).eq('id', tokenId);
    await load();
  }

  if (loading) return (
    <div style={{ ...dark, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>
      <Loader2 size={28} color="#94a3b8" style={{ animation: 'spin 1s linear infinite' }} />
      <style>{`@keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }`}</style>
    </div>
  );

  if (noATO) return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
      </div>
      <div style={{ maxWidth: '600px', margin: '4rem auto', padding: '0 1.5rem', textAlign: 'center' }}>
        <p style={{ fontSize: '0.7rem', letterSpacing: '0.25em', color: '#64748b', textTransform: 'uppercase', marginBottom: '1rem' }}>Pillar 5 — ATO Network</p>
        <h2 style={{ fontFamily: 'Georgia, serif', fontWeight: 'normal', fontSize: '1.5rem', marginBottom: '1rem' }}>No Institution Found</h2>
        <p style={{ color: '#64748b', fontSize: '0.9rem', lineHeight: 1.6, marginBottom: '1.5rem' }}>
          Your account is not linked to an ATO institution. Apply to register your flight school or training organization to access the admin dashboard.
        </p>
        <button
          onClick={() => onNavigate('ato-register')}
          style={{ padding: '0.85rem 1.75rem', borderRadius: '12px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: '0.9rem', cursor: 'pointer' }}
        >
          Register Your Institution →
        </button>
      </div>
    </div>
  );

  const pendingCount = requests.filter(r => r.status === 'pending').length;

  return (
    <div style={dark}>
      <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', padding: '1rem 1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <button onClick={onBack} style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.85rem' }}>
          <ArrowLeft size={16} /> Back
        </button>
        <button onClick={load} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem', fontSize: '0.78rem' }}>
          <RefreshCw size={13} /> Refresh
        </button>
      </div>

      <div style={{ maxWidth: '900px', margin: '0 auto', padding: '2rem 1.5rem' }}>

        {/* Institution header */}
        <div style={{ ...card, marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.2em', color: '#64748b', textTransform: 'uppercase' }}>ATO Admin Dashboard</p>
              <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.4rem', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>{ato!.institution_name}</h2>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.8rem', color: '#64748b' }}>{ato!.country}</p>
              <p style={{ margin: '0.5rem 0 0', fontSize: '0.72rem', color: '#475569', maxWidth: '480px', lineHeight: 1.5 }}>
                PilotRecognition verifies pilot regulatory credentials and background checks internationally. You attest to training hours — accuracy is your responsibility.
              </p>
            </div>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', alignItems: 'center' }}>
              <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '999px', border: '1px solid rgba(14,165,233,0.3)', color: '#38bdf8', background: 'rgba(14,165,233,0.06)', textTransform: 'capitalize' }}>
                {ato!.tier}
              </span>
              {ato!.verified_issuer && (
                <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '999px', border: '1px solid rgba(16,185,129,0.3)', color: '#34d399', background: 'rgba(16,185,129,0.06)' }}>
                  ✓ Verified Issuer
                </span>
              )}
              {ato!.recognition_ready && (
                <span style={{ fontSize: '0.72rem', padding: '0.25rem 0.7rem', borderRadius: '999px', border: '1px solid rgba(245,158,11,0.3)', color: '#fcd34d', background: 'rgba(245,158,11,0.06)' }}>
                  ★ Recognition-Ready
                </span>
              )}

              {/* Billing actions */}
              {ato!.tier === 'basic' && (
                <button
                  onClick={() => handleUpgrade('enterprise')}
                  disabled={billingLoading}
                  style={{ fontSize: '0.72rem', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(16,185,129,0.4)', background: 'transparent', color: '#34d399', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.35rem' }}
                >
                  {billingLoading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={12} />} Upgrade to Operator — $1,000/yr
                </button>
              )}
              {ato!.tier === 'enterprise' && (
                <>
                  <span style={{ fontSize: '0.68rem', color: '#64748b', textTransform: 'capitalize' }}>
                    {ato!.onboarding_status}
                  </span>
                  {ato!.stripe_subscription_id && (
                    <button
                      onClick={handleCancel}
                      disabled={billingLoading}
                      style={{ fontSize: '0.72rem', padding: '0.35rem 0.8rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', cursor: 'pointer' }}
                    >
                      {billingLoading ? <Loader2 size={12} style={{ animation: 'spin 1s linear infinite' }} /> : 'Cancel Subscription'}
                    </button>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Stats row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem', marginTop: '1.25rem' }}>
            {[
              { label: 'Graduates Linked', value: ato!.total_graduates_linked, color: '#60a5fa' },
              { label: 'Tokens Issued', value: ato!.total_tokens_issued, color: '#a78bfa' },
              { label: 'Placement Rate', value: ato!.placement_rate_pct != null ? `${ato!.placement_rate_pct}%` : '—', color: '#34d399' },
              { label: 'Pending Requests', value: pendingCount, color: pendingCount > 0 ? '#f59e0b' : '#64748b' },
            ].map(s => (
              <div key={s.label} style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
                <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: s.color, fontFamily: 'monospace' }}>{s.value}</p>
                <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.label}</p>
              </div>
            ))}
            {/* Dividend Balance with Payout */}
            <div style={{ background: 'rgba(30,41,59,0.5)', borderRadius: '10px', padding: '0.75rem', textAlign: 'center' }}>
              <p style={{ margin: 0, fontSize: '1.2rem', fontWeight: 700, color: '#fcd34d', fontFamily: 'monospace' }}>${ato!.referral_dividend_balance_usd.toFixed(2)}</p>
              <p style={{ margin: '0.2rem 0 0', fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Dividend Balance</p>
              {ato!.referral_dividend_balance_usd > 0 && (
                <button
                  onClick={() => {
                    const subject = encodeURIComponent(`Payout Request — ${ato!.institution_name}`);
                    const body = encodeURIComponent(
                      `Institution: ${ato!.institution_name}\nATO ID: ${ato!.id}\nRequested Payout: $${ato!.referral_dividend_balance_usd.toFixed(2)}\nAdmin Email: ${currentUser?.email || ''}`
                    );
                    window.open(`mailto:support@pilotrecognition.com?subject=${subject}&body=${body}`, '_blank', 'noopener,noreferrer');
                  }}
                  style={{ marginTop: '0.5rem', padding: '0.25rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(252,211,77,0.3)', background: 'transparent', color: '#fcd34d', fontSize: '0.65rem', cursor: 'pointer' }}
                >
                  Request Payout
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0' }}>
          {([
            { key: 'requests', label: `Verification Requests${pendingCount > 0 ? ` (${pendingCount})` : ''}` },
            { key: 'tokens',   label: `Issued Tokens (${tokens.length})` },
            ...(ato!.verified_issuer ? [{ key: 'issue' as const, label: '+ Issue New Token' }] : []),
            { key: 'graduates', label: `Graduates${ato!.tier !== 'basic' ? ` (${graduates.length})` : ''}` },
          ] as const).map(tab => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              style={{
                background: 'none', border: 'none', cursor: 'pointer',
                padding: '0.65rem 1rem',
                borderBottom: `2px solid ${activeTab === tab.key ? '#0ea5e9' : 'transparent'}`,
                color: activeTab === tab.key ? '#38bdf8' : '#64748b',
                fontSize: '0.82rem', fontWeight: activeTab === tab.key ? 700 : 400,
                transition: 'all 0.15s ease',
              }}
            >
              {tab.label}
              {tab.key === 'graduates' && ato!.tier === 'basic' && (
                <span style={{ marginLeft: '0.35rem', fontSize: '0.6rem', padding: '0.05rem 0.35rem', borderRadius: '999px', background: 'rgba(245,158,11,0.15)', color: '#f59e0b' }}>Operator</span>
              )}
            </button>
          ))}
        </div>

        {/* ── REQUESTS TAB ── */}
        {activeTab === 'requests' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {requests.length === 0 && (
              <div style={{ ...card, textAlign: 'center', padding: '3rem' }}>
                <Clock size={28} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>No verification requests yet.</p>
                <p style={{ margin: '0.5rem 0 0', color: '#334155', fontSize: '0.8rem' }}>When pilots select your institution and request hour verification, requests will appear here.</p>
              </div>
            )}
            {requests.map(req => (
              <div key={req.id} style={{ ...card, borderColor: req.status === 'pending' ? 'rgba(245,158,11,0.25)' : 'rgba(255,255,255,0.08)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: STATUS_COLORS[req.status] ?? '#94a3b8', background: 'rgba(0,0,0,0.3)', border: `1px solid ${STATUS_COLORS[req.status] ?? '#475569'}40`, borderRadius: '4px', padding: '0.1rem 0.45rem', textTransform: 'uppercase' }}>
                        {req.status}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>{req.request_type.replace(/_/g, ' ')}</span>
                    </div>
                    <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>Pilot: {req.pilot_id.slice(0, 8)}…</p>
                    {req.claimed_total_hours && (
                      <p style={{ margin: '0.25rem 0 0', fontSize: '0.82rem', color: '#cbd5e1' }}>
                        Claimed: <strong>{req.claimed_total_hours} hrs total</strong>
                        {req.claimed_pic_hours ? ` · ${req.claimed_pic_hours} PIC` : ''}
                        {req.claimed_period_from ? ` · ${req.claimed_period_from} → ${req.claimed_period_to}` : ''}
                      </p>
                    )}
                    {req.pilot_message && (
                      <p style={{ margin: '0.35rem 0 0', fontSize: '0.78rem', color: '#64748b', fontStyle: 'italic' }}>"{req.pilot_message}"</p>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.68rem', color: '#475569' }}>{new Date(req.created_at).toLocaleDateString()}</span>
                    {req.status === 'pending' && (
                      <button
                        onClick={() => { setRespondingId(respondingId === req.id ? null : req.id); setRespondForm({ confirmed_hours: req.claimed_total_hours?.toString() ?? '', note: '', outcome: 'confirmed' }); }}
                        style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.3)', background: 'transparent', color: '#38bdf8', fontSize: '0.75rem', cursor: 'pointer' }}
                      >
                        {respondingId === req.id ? 'Cancel' : 'Respond'}
                      </button>
                    )}
                  </div>
                </div>

                {/* Respond form */}
                {respondingId === req.id && (
                  <div style={{ marginTop: '1rem', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.06)', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Outcome</label>
                        <select value={respondForm.outcome} onChange={e => setRespondForm(f => ({ ...f, outcome: e.target.value }))} style={{ width: '100%', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none' }}>
                          <option value="confirmed">Confirm — hours verified</option>
                          <option value="amended">Amend — corrected hours below</option>
                          <option value="rejected">Reject — cannot verify</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Confirmed Hours</label>
                        <input type="number" value={respondForm.confirmed_hours} onChange={e => setRespondForm(f => ({ ...f, confirmed_hours: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
                      </div>
                    </div>
                    <div>
                      <label style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block', marginBottom: '0.3rem', fontWeight: 600 }}>Response Note (optional)</label>
                      <input type="text" placeholder="e.g. Verified against training records dated…" value={respondForm.note} onChange={e => setRespondForm(f => ({ ...f, note: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.55rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.8)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
                    </div>
                    <button
                      onClick={() => respondToRequest(req.id)}
                      disabled={responding}
                      style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: '#10b981', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', alignSelf: 'flex-start' }}
                    >
                      {responding ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CheckCircle2 size={14} />} Submit Response
                    </button>
                  </div>
                )}

                {req.status !== 'pending' && req.ato_response_note && (
                  <p style={{ margin: '0.5rem 0 0', fontSize: '0.75rem', color: '#475569', fontStyle: 'italic' }}>
                    Response: "{req.ato_response_note}" — {req.responded_at ? new Date(req.responded_at).toLocaleDateString() : ''}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── TOKENS TAB ── */}
        {activeTab === 'tokens' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            {tokens.length === 0 && (
              <div style={{ ...card, textAlign: 'center', padding: '3rem' }}>
                <Award size={28} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, color: '#475569' }}>No tokens issued yet.</p>
              </div>
            )}
            {tokens.map(tok => (
              <div key={tok.id} style={{ ...card, display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.3rem' }}>
                    <span style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: STATUS_COLORS[tok.status] ?? '#94a3b8', textTransform: 'uppercase' }}>{tok.status}</span>
                    <span style={{ fontSize: '0.72rem', color: '#60a5fa', background: 'rgba(96,165,250,0.08)', border: '1px solid rgba(96,165,250,0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>{TOKEN_LABELS[tok.token_type] ?? tok.token_type}</span>
                    {tok.signature_hash && (
                      <span style={{ fontSize: '0.6rem', color: '#34d399', background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.2)', borderRadius: '4px', padding: '0.1rem 0.4rem' }}>Signed</span>
                    )}
                  </div>
                  <p style={{ margin: 0, fontWeight: 600, color: '#ffffff', fontSize: '0.88rem' }}>{tok.token_label}</p>
                  <p style={{ margin: '0.2rem 0 0', fontSize: '0.72rem', color: '#64748b', fontFamily: 'monospace' }}>Pilot: {tok.pilot_id.slice(0, 8)}…</p>
                  {tok.total_hours_verified && <p style={{ margin: '0.15rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{tok.total_hours_verified} hrs verified</p>}
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  {/* QR Code */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=64x64&data=${encodeURIComponent(`${SUPABASE_URL}/functions/v1/verify-token?tokenId=${tok.id}`)}`}
                    alt="Verify QR"
                    style={{ width: 32, height: 32, borderRadius: 4, opacity: 0.8 }}
                    title="Scan to verify credential"
                  />
                  <span style={{ fontSize: '0.68rem', color: '#334155' }}>{new Date(tok.created_at).toLocaleDateString()}</span>
                  <button
                    onClick={() => setViewCredentialId(tok.id)}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(148,163,184,0.3)', background: 'transparent', color: '#94a3b8', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    View Credential
                  </button>
                  <button
                    onClick={() => {
                      const url = `${SUPABASE_URL}/functions/v1/verify-token?tokenId=${tok.id}`;
                      window.open(url, '_blank', 'noopener,noreferrer');
                    }}
                    style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(14,165,233,0.3)', background: 'transparent', color: '#38bdf8', fontSize: '0.72rem', cursor: 'pointer' }}
                  >
                    Verify
                  </button>
                  {tok.status === 'active' && (
                    <button
                      onClick={() => revokeToken(tok.id)}
                      style={{ padding: '0.35rem 0.75rem', borderRadius: '8px', border: '1px solid rgba(239,68,68,0.3)', background: 'transparent', color: '#f87171', fontSize: '0.72rem', cursor: 'pointer' }}
                    >
                      Revoke
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ── ISSUE RECORD TAB ── */}
        {activeTab === 'issue' && (
          <div style={{ ...card }}>
            <p style={{ margin: '0 0 1.25rem', fontSize: '0.8rem', color: '#94a3b8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Issue Credential Record</p>

            {issueSuccess && (
              <div style={{ background: 'rgba(16,185,129,0.08)', border: '1px solid rgba(16,185,129,0.25)', borderRadius: '10px', padding: '0.85rem', marginBottom: '1rem', display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
                <CheckCircle2 size={15} color="#10b981" />
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#34d399' }}>Record issued successfully.</p>
              </div>
            )}

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Pilot User ID <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="Pilot's Supabase user ID (UUID)" value={issueForm.pilot_id} onChange={e => setIssueForm(f => ({ ...f, pilot_id: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Record Type</label>
                <select value={issueForm.token_type} onChange={e => setIssueForm(f => ({ ...f, token_type: e.target.value }))} style={{ width: '100%', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none', appearance: 'none' }}>
                  <option value="cpl_complete">CPL-Complete</option>
                  <option value="aam_ready">AAM-Ready</option>
                  <option value="operator_specific">Operator-Specific</option>
                  <option value="custom">Custom</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Record Label <span style={{ color: '#ef4444' }}>*</span></label>
                <input type="text" placeholder="e.g. CPL-Complete — WCC Aviation 2025" value={issueForm.token_label} onChange={e => setIssueForm(f => ({ ...f, token_label: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Total Hours Verified</label>
                <input type="number" placeholder="e.g. 210.5" value={issueForm.total_hours_verified} onChange={e => setIssueForm(f => ({ ...f, total_hours_verified: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Graduation Date</label>
                <input type="date" value={issueForm.graduation_date} onChange={e => setIssueForm(f => ({ ...f, graduation_date: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={{ display: 'block', fontSize: '0.72rem', color: '#94a3b8', marginBottom: '0.3rem', fontWeight: 600 }}>Aircraft Ratings (comma-separated)</label>
                <input type="text" placeholder="e.g. C152, C172, P200JF" value={issueForm.aircraft_ratings} onChange={e => setIssueForm(f => ({ ...f, aircraft_ratings: e.target.value }))} style={{ width: '100%', boxSizing: 'border-box', padding: '0.65rem', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }} />
              </div>
            </div>

            {issueError && (
              <p style={{ fontSize: '0.78rem', color: '#f87171', marginBottom: '0.75rem' }}>{issueError}</p>
            )}

            <button
              onClick={issueToken}
              disabled={!issueForm.pilot_id || !issueForm.token_label || issuing}
              style={{
                padding: '0.85rem 1.75rem', borderRadius: '12px', border: 'none',
                background: issueForm.pilot_id && issueForm.token_label && !issuing ? '#0ea5e9' : '#1e293b',
                color: issueForm.pilot_id && issueForm.token_label && !issuing ? '#fff' : '#475569',
                fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', gap: '0.5rem',
              }}
            >
              {issuing ? <Loader2 size={15} style={{ animation: 'spin 1s linear infinite' }} /> : <ShieldCheck size={15} />}
              Issue Credential Record
            </button>
          </div>
        )}

        {/* ── GRADUATES TAB ── */}
        {activeTab === 'graduates' && (
          <div>
            {/* Tier gate for Basic */}
            {ato!.tier === 'basic' && (
              <div style={{ ...card, textAlign: 'center', padding: '2.5rem' }}>
                <Users size={28} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
                <p style={{ margin: 0, fontSize: '0.9rem', color: '#94a3b8', fontWeight: 700 }}>Graduate Tracking is an Operator Feature</p>
                <p style={{ margin: '0.5rem 0 1.25rem', fontSize: '0.82rem', color: '#64748b' }}>
                  Upgrade to Operator Access to view your graduate pool, track placements, issue credentials, and get contacted by airlines.
                </p>
                <button
                  onClick={() => handleUpgrade('enterprise')}
                  disabled={billingLoading}
                  style={{ padding: '0.65rem 1.25rem', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
                >
                  {billingLoading ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : <CreditCard size={14} />}
                  Upgrade to Operator — $1,000/yr
                </button>
              </div>
            )}

            {/* Operator full view */}
            {ato!.tier !== 'basic' && (
              <>
                {/* Placement Rate Calculator */}
                <div style={{ ...card, marginBottom: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Placement Rate</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#34d399' }}>
                        {ato!.placement_rate_pct != null ? `${ato!.placement_rate_pct}%` : '—'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <label style={{ fontSize: '0.72rem', color: '#94a3b8' }}>Placed graduates (last 12 mo):</label>
                      <input
                        type="number"
                        min={0}
                        placeholder="0"
                        onChange={async (e) => {
                          const placed = parseInt(e.target.value) || 0;
                          const total = graduates.length || 1;
                          const pct = Math.round((placed / total) * 100);
                          await supabase.from('ato_institutions').update({ placement_rate_pct: pct }).eq('id', ato!.id);
                          setAto({ ...ato!, placement_rate_pct: pct });
                        }}
                        style={{ width: '80px', padding: '0.4rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(30,41,59,0.6)', color: '#fff', fontSize: '0.82rem', outline: 'none' }}
                      />
                      <span style={{ fontSize: '0.72rem', color: '#64748b' }}>/ {graduates.length} total</span>
                    </div>
                  </div>
                </div>

                {/* Bulk CSV Import */}
                <div style={{ ...card, marginBottom: '1.25rem' }}>
                  <p style={{ margin: '0 0 0.75rem', fontSize: '0.7rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>Bulk Student Import</p>
                  <CSVUploadBox atoName={ato!.institution_name} onInvited={load} />
                </div>

                {/* Graduate Table */}
                {graduates.length === 0 ? (
                  <div style={{ ...card, textAlign: 'center', padding: '2.5rem' }}>
                    <Users size={28} color="#334155" style={{ margin: '0 auto 0.75rem' }} />
                    <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>No graduates linked yet.</p>
                    <p style={{ margin: '0.5rem 0 0', color: '#334155', fontSize: '0.8rem' }}>Pilots who verify hours with your institution will appear here.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                    {graduates.map(g => (
                      <div key={g.id} style={{ ...card, padding: '1rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.75rem' }}>
                          <div style={{ flex: 1, minWidth: '200px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.3rem' }}>
                              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: '#ffffff' }}>
                                {g.display_name || g.full_name || `Pilot ${g.id.slice(0, 8)}`}
                              </span>
                              {g.last_request_status === 'confirmed' && (
                                <span style={{ fontSize: '0.6rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 700 }}>Attested</span>
                              )}
                            </div>
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', fontSize: '0.78rem', color: '#94a3b8' }}>
                              <span>Hours: <strong style={{ color: '#cbd5e1' }}>{g.total_flight_hours ?? '—'}</strong></span>
                              <span>Score: <strong style={{ color: '#cbd5e1' }}>{g.overall_recognition_score ?? '—'}</strong></span>
                              {g.verified_hours && <span style={{ color: '#34d399' }}>Verified: {g.verified_hours} hrs</span>}
                            </div>
                            {g.pathway_interests && g.pathway_interests.length > 0 && (
                              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem', marginTop: '0.4rem' }}>
                                {g.pathway_interests.slice(0, 3).map(p => (
                                  <span key={p} style={{ fontSize: '0.65rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(14,165,233,0.08)', color: '#38bdf8' }}>{p}</span>
                                ))}
                              </div>
                            )}
                          </div>
                          <div style={{ display: 'flex', gap: '0.4rem', flexShrink: 0 }}>
                            <button
                              onClick={() => {
                                const email = g.email;
                                if (email) {
                                  window.open(`mailto:${email}?subject=Join PilotRecognition&body=Hi ${g.display_name || 'there'},\n\nYour flight school ${ato!.institution_name} is on PilotRecognition. Join to get verified and unlock pathways.\n\nhttps://pilotrecognition.com`, '_blank', 'noopener,noreferrer');
                                } else {
                                  alert('No email on file for this pilot.');
                                }
                              }}
                              style={{ padding: '0.4rem 0.85rem', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#94a3b8', fontSize: '0.75rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <Send size={12} /> Invite
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* ── CREDENTIAL CARD MODAL ── */}
      {viewCredentialId && (() => {
        const tok = tokens.find(t => t.id === viewCredentialId);
        if (!tok) return null;
        const verifyUrl = `${SUPABASE_URL}/functions/v1/verify-token?tokenId=${tok.id}`;
        return (
          <div style={{ position: 'fixed', inset: 0, zIndex: 200, background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }} onClick={(e) => { if (e.target === e.currentTarget) setViewCredentialId(null); }}>
            <div style={{ background: '#0f172a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '16px', maxWidth: '480px', width: '100%', padding: '2rem', position: 'relative' }}>
              <button onClick={() => setViewCredentialId(null)} style={{ position: 'absolute', top: '1rem', right: '1rem', background: 'none', border: 'none', color: '#64748b', fontSize: '1.2rem', cursor: 'pointer' }}>×</button>

              {/* Credential Card */}
              <div id="credential-card" style={{ background: 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '12px', padding: '1.5rem', marginBottom: '1.25rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.15em' }}>ATO-Issued Credential via PilotRecognition</p>
                    <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.1rem', color: '#ffffff', fontWeight: 700 }}>{ato?.institution_name}</h3>
                  </div>
                  {tok.signature_hash && (
                    <span style={{ fontSize: '0.6rem', padding: '0.15rem 0.45rem', borderRadius: '4px', background: 'rgba(16,185,129,0.1)', color: '#34d399', fontWeight: 700, border: '1px solid rgba(16,185,129,0.2)' }}>Signed</span>
                  )}
                </div>
                <p style={{ margin: '0 0 1rem', fontSize: '0.68rem', color: '#475569', fontStyle: 'italic' }}>
                  Training hours attested by {ato?.institution_name}. PilotRecognition verifies regulatory credentials and background checks internationally. Hours are not independently verified by the platform.
                </p>

                <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '1rem 0', marginBottom: '1rem' }}>
                  <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Credential</p>
                  <p style={{ margin: '0.25rem 0 0', fontSize: '1rem', color: '#ffffff', fontWeight: 600 }}>{tok.token_label}</p>
                  <p style={{ margin: '0.15rem 0 0', fontSize: '0.78rem', color: '#94a3b8' }}>{TOKEN_LABELS[tok.token_type] ?? tok.token_type}</p>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Hours Verified</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: '#ffffff', fontWeight: 600 }}>{tok.total_hours_verified ?? '—'}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Status</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.95rem', color: tok.status === 'active' ? '#34d399' : '#f87171', fontWeight: 600, textTransform: 'capitalize' }}>{tok.status}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Issued</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.85rem', color: '#94a3b8' }}>{new Date(tok.created_at).toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>Pilot ID</p>
                    <p style={{ margin: '0.2rem 0 0', fontSize: '0.78rem', color: '#94a3b8', fontFamily: 'monospace' }}>{tok.pilot_id.slice(0, 8)}…</p>
                  </div>
                </div>

                {tok.aircraft_ratings && tok.aircraft_ratings.length > 0 && (
                  <div style={{ marginBottom: '1rem' }}>
                    <p style={{ margin: '0 0 0.35rem', fontSize: '0.7rem', color: '#64748b' }}>Ratings</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.3rem' }}>
                      {tok.aircraft_ratings.map((r: string) => (
                        <span key={r} style={{ fontSize: '0.68rem', padding: '0.1rem 0.4rem', borderRadius: '4px', background: 'rgba(96,165,250,0.08)', color: '#60a5fa' }}>{r}</span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=${encodeURIComponent(verifyUrl)}`} alt="Verify QR" style={{ width: 60, height: 60, borderRadius: 6 }} />
                  <div>
                    <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b' }}>Verify at</p>
                    <p style={{ margin: '0.15rem 0 0', fontSize: '0.68rem', color: '#94a3b8', fontFamily: 'monospace', wordBreak: 'break-all' }}>{verifyUrl}</p>
                  </div>
                </div>
              </div>

              <button
                onClick={() => window.print()}
                style={{ width: '100%', padding: '0.75rem', borderRadius: '10px', border: 'none', background: '#0ea5e9', color: '#fff', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer' }}
              >
                Print / Save as PDF
              </button>
            </div>
          </div>
        );
      })()}

      <style>{`
        @keyframes spin { from{transform:rotate(0deg)}to{transform:rotate(360deg)} }
        input::placeholder { color: #475569; }
        select option { background: #1e293b; }
        select { color: #ffffff; }
        @media print {
          body > * { display: none !important; }
          #credential-card { display: block !important; position: fixed; inset: 0; background: #0f172a !important; }
        }
      `}</style>
    </div>
  );
}
