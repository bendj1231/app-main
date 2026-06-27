import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';

type Tab = 'payments' | 'team' | 'veremark';

const card: React.CSSProperties = {
    background: 'rgba(15,23,42,0.7)',
    border: '1px solid rgba(255,255,255,0.08)',
    borderRadius: '16px',
    padding: '1.25rem',
};

export function AdminDashboardPanel() {
    const [events, setEvents] = useState<any[]>([]);
    const [teamPerf, setTeamPerf] = useState<any[]>([]);
    const [checks, setChecks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [tab, setTab] = useState<Tab>('payments');
    const [refreshing, setRefreshing] = useState(false);

    const load = async () => {
        setRefreshing(true);
        try {
            const [eventsRes, perfRes, checksRes] = await Promise.all([
                supabase
                    .from('team_referral_events')
                    .select('*')
                    .order('created_at', { ascending: false })
                    .limit(50),
                supabase
                    .from('team_monthly_performance')
                    .select('*, team_members(name, referral_code, role)')
                    .order('period_start', { ascending: false })
                    .limit(30),
                supabase
                    .from('pilot_credentials')
                    .select('id, user_id, check_type, status, created_at, result_data')
                    .order('created_at', { ascending: false })
                    .limit(30),
            ]);
            setEvents(eventsRes.data || []);
            setTeamPerf(perfRes.data || []);
            setChecks(checksRes.data || []);
        } catch (e) {
            console.error('[AdminDashboard]', e);
        } finally {
            setLoading(false);
            setRefreshing(false);
        }
    };

    useEffect(() => { load(); }, []);

    const subs = events.filter(e => e.event_type === 'recognition_plus_upgrade').length;
    const veremarkTriggered = events.filter(e => e.event_type === 'verification_requested').length;
    const revenue = subs * 99;
    const cost = veremarkTriggered * 22;
    const profit = revenue - cost;
    const pendingChecks = checks.filter(c => c.status === 'pending' || c.status === 'in_progress').length;

    const statusColor = (s: string) => {
        if (s === 'verified' || s === 'paid') return { bg: 'rgba(34,197,94,0.12)', border: 'rgba(34,197,94,0.3)', text: '#22c55e' };
        if (s === 'pending' || s === 'in_progress') return { bg: 'rgba(245,158,11,0.12)', border: 'rgba(245,158,11,0.3)', text: '#f59e0b' };
        if (s === 'failed' || s === 'expired') return { bg: 'rgba(239,68,68,0.12)', border: 'rgba(239,68,68,0.3)', text: '#f87171' };
        return { bg: 'rgba(100,116,139,0.12)', border: 'rgba(100,116,139,0.3)', text: '#94a3b8' };
    };

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <div style={{ width: 32, height: 32, border: '2px solid #ef4444', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            {/* Header */}
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
                <div>
                    <p style={{ margin: 0, fontSize: '0.62rem', letterSpacing: '0.22em', color: '#ef4444', textTransform: 'uppercase', fontWeight: 700 }}>Super Admin Only</p>
                    <h2 style={{ margin: '0.3rem 0 0.4rem', fontSize: '1.6rem', color: '#ffffff', fontFamily: 'Georgia, serif', fontWeight: 'normal' }}>Operations Dashboard</h2>
                    <p style={{ margin: 0, fontSize: '0.82rem', color: '#64748b' }}>Live payments, team commissions, and Veremark check status.</p>
                </div>
                <button
                    onClick={load}
                    disabled={refreshing}
                    style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '8px 16px', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '8px', color: '#94a3b8', fontSize: '0.78rem', cursor: 'pointer', opacity: refreshing ? 0.5 : 1 }}
                >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ animation: refreshing ? 'spin 0.8s linear infinite' : 'none' }}>
                        <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                    </svg>
                    Refresh
                </button>
            </div>

            {/* KPI Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '0.75rem' }}>
                {[
                    { label: 'Total Revenue', value: `$${revenue}`, sub: `${subs} subscriptions`, accent: 'rgba(34,197,94,0.35)' },
                    { label: 'Veremark Cost', value: `$${cost}`, sub: `${veremarkTriggered} checks @ $22`, accent: 'rgba(239,68,68,0.35)' },
                    { label: 'Net Profit', value: `$${profit}`, sub: 'Revenue − Veremark', accent: 'rgba(59,130,246,0.35)' },
                    { label: 'Pending Checks', value: pendingChecks, sub: 'Awaiting result', accent: pendingChecks > 0 ? 'rgba(245,158,11,0.35)' : 'rgba(100,116,139,0.2)' },
                ].map(stat => (
                    <div key={stat.label} style={{ ...card, borderColor: stat.accent }}>
                        <p style={{ margin: 0, fontSize: '0.58rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>{stat.label}</p>
                        <p style={{ margin: '0.4rem 0 0', fontSize: '1.7rem', fontWeight: 700, color: '#ffffff' }}>{stat.value}</p>
                        <p style={{ margin: '0.2rem 0 0', fontSize: '0.68rem', color: '#64748b' }}>{stat.sub}</p>
                    </div>
                ))}
            </div>

            {/* Tabs */}
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                {(['payments', 'team', 'veremark'] as Tab[]).map(t => (
                    <button key={t} onClick={() => setTab(t)} style={{
                        padding: '0.45rem 1rem', borderRadius: '999px', border: '1px solid',
                        borderColor: tab === t ? 'rgba(239,68,68,0.55)' : 'rgba(255,255,255,0.1)',
                        background: tab === t ? 'rgba(239,68,68,0.12)' : 'transparent',
                        color: tab === t ? '#f87171' : '#94a3b8',
                        fontSize: '0.78rem', fontWeight: 600, cursor: 'pointer',
                    }}>
                        {t === 'payments' ? 'Recent Payments' : t === 'team' ? 'Team Commissions' : 'Veremark Checks'}
                    </button>
                ))}
            </div>

            {/* ── Payments Tab ── */}
            {tab === 'payments' && (
                <div style={card}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Recent Referral Events</p>
                    {events.length === 0 ? (
                        <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No payments logged yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '420px', overflowY: 'auto' }}>
                            {events.map(ev => {
                                const sc = statusColor(ev.commission_status || 'pending');
                                return (
                                    <div key={ev.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', gap: '1rem' }}>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>{(ev.event_type || '').replace(/_/g, ' ')}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.66rem', color: '#64748b' }}>
                                                Code: {ev.referral_code || '—'} · {new Date(ev.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: '2-digit' })}
                                            </p>
                                        </div>
                                        <div style={{ textAlign: 'right', flexShrink: 0 }}>
                                            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: '#22c55e' }}>${ev.commission_amount || 0}</p>
                                            <span style={{ fontSize: '0.58rem', padding: '2px 8px', borderRadius: '999px', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}` }}>
                                                {ev.commission_status || 'pending'}
                                            </span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* ── Team Tab ── */}
            {tab === 'team' && (
                <div style={card}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Monthly Team Performance</p>
                    {teamPerf.length === 0 ? (
                        <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No team data yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '420px', overflowY: 'auto' }}>
                            {teamPerf.map((row: any, i) => (
                                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr auto auto auto', gap: '0.75rem', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px' }}>
                                    <div>
                                        <p style={{ margin: 0, fontSize: '0.82rem', color: '#ffffff', fontWeight: 600 }}>{row.team_members?.name || 'Unknown'}</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '0.66rem', color: '#64748b' }}>
                                            {row.team_members?.role || '—'} · {row.team_members?.referral_code || '—'} · {new Date(row.period_start).toLocaleDateString('en-GB', { month: 'short', year: '2-digit' })}
                                        </p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b' }}>Referrals</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{row.total_referrals || 0}</p>
                                    </div>
                                    <div style={{ textAlign: 'center' }}>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b' }}>Conversions</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>{row.total_conversions || 0}</p>
                                    </div>
                                    <div style={{ textAlign: 'right' }}>
                                        <p style={{ margin: 0, fontSize: '0.65rem', color: '#64748b' }}>Earned</p>
                                        <p style={{ margin: '2px 0 0', fontSize: '1rem', fontWeight: 700, color: '#22c55e' }}>${row.total_commission_earned || 0}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* ── Veremark Tab ── */}
            {tab === 'veremark' && (
                <div style={card}>
                    <p style={{ margin: '0 0 1rem', fontSize: '0.65rem', letterSpacing: '0.15em', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Veremark Check Status</p>
                    {checks.length === 0 ? (
                        <p style={{ color: '#475569', fontSize: '0.85rem', textAlign: 'center', padding: '2rem 0' }}>No verification checks yet.</p>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '420px', overflowY: 'auto' }}>
                            {checks.map(ch => {
                                const sc = statusColor(ch.status);
                                return (
                                    <div key={ch.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.65rem 0.85rem', background: 'rgba(255,255,255,0.03)', borderRadius: '8px', gap: '1rem' }}>
                                        <div style={{ minWidth: 0, flex: 1 }}>
                                            <p style={{ margin: 0, fontSize: '0.8rem', color: '#ffffff', fontWeight: 600 }}>{(ch.check_type || '').replace(/_/g, ' ')}</p>
                                            <p style={{ margin: '2px 0 0', fontSize: '0.66rem', color: '#64748b' }}>
                                                {ch.user_id?.slice(0, 8)}… · {new Date(ch.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                                            </p>
                                        </div>
                                        <span style={{ fontSize: '0.62rem', padding: '3px 10px', borderRadius: '999px', background: sc.bg, color: sc.text, border: `1px solid ${sc.border}`, flexShrink: 0 }}>
                                            {ch.status}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}


