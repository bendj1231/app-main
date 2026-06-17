'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../../src/lib/supabase';

type AdminFlag = 'active' | 'pending' | 'suspicious' | 'contacted_support';
type SubStatus = 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing' | 'all';

interface Subscriber {
  id: string;
  user_id: string;
  email: string | null;
  display_name: string | null;
  status: string | null;
  admin_flag: AdminFlag;
  created_at: string;
  current_period_end: string | null;
  amount: number | null;
  product_name: string | null;
  dodo_customer_id: string | null;
  dodo_payment_id: string | null;
  receipt_url: string | null;
  stripe_customer_id: string | null;
  stripe_subscription_id: string | null;
}

const FLAG_STYLES: Record<AdminFlag, { bg: string; color: string; label: string }> = {
  active: { bg: '#10b98120', color: '#10b981', label: 'Active' },
  pending: { bg: '#f59e0b20', color: '#f59e0b', label: 'Pending' },
  suspicious: { bg: '#ef444420', color: '#ef4444', label: 'Suspicious' },
  contacted_support: { bg: '#3b82f620', color: '#3b82f6', label: 'Contacted' },
};

const STATUS_LABELS: Record<string, string> = {
  active: 'Active',
  canceled: 'Canceled',
  past_due: 'Past Due',
  unpaid: 'Unpaid',
  trialing: 'Trialing',
  incomplete: 'Incomplete',
};

export default function RecognitionPlusManagementPage() {
  const navigate = useNavigate();
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<SubStatus>('all');
  const [filterFlag, setFilterFlag] = useState<AdminFlag | 'all'>('all');
  const [search, setSearch] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, pending: 0, suspicious: 0, revenue: 0 });
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    try {
      let query = supabase
        .from('subscriptions')
        .select(`
          id, user_id, status, admin_flag, created_at, current_period_end,
          amount, product_name, dodo_customer_id, dodo_payment_id, receipt_url,
          stripe_customer_id, stripe_subscription_id,
          profiles!inner(email, display_name)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus !== 'all') query = query.eq('status', filterStatus);
      if (filterFlag !== 'all') query = query.eq('admin_flag', filterFlag);

      const { data, error } = await query;
      if (error) throw error;

      const rows = (data || []).map((row: any) => ({
        id: row.id,
        user_id: row.user_id,
        email: row.profiles?.email,
        display_name: row.profiles?.display_name,
        status: row.status,
        admin_flag: (row.admin_flag as AdminFlag) || 'active',
        created_at: row.created_at,
        current_period_end: row.current_period_end,
        amount: row.amount,
        product_name: row.product_name,
        dodo_customer_id: row.dodo_customer_id,
        dodo_payment_id: row.dodo_payment_id,
        receipt_url: row.receipt_url,
        stripe_customer_id: row.stripe_customer_id,
        stripe_subscription_id: row.stripe_subscription_id,
      })) as Subscriber[];

      setSubscribers(rows);

      const { data: allSubs } = await supabase.from('subscriptions').select('status, admin_flag, amount');
      if (allSubs) {
        setStats({
          total: allSubs.length,
          active: allSubs.filter((s: any) => s.status === 'active').length,
          pending: allSubs.filter((s: any) => s.admin_flag === 'pending').length,
          suspicious: allSubs.filter((s: any) => s.admin_flag === 'suspicious').length,
          revenue: allSubs
            .filter((s: any) => s.status === 'active')
            .reduce((sum: number, s: any) => sum + (s.amount || 0), 0),
        });
      }
    } catch (err) {
      console.error('[Recognition+] Error loading subscribers:', err);
    } finally {
      setLoading(false);
    }
  }, [filterStatus, filterFlag]);

  useEffect(() => { loadSubscribers(); }, [loadSubscribers]);

  const updateFlag = async (id: string, flag: AdminFlag) => {
    setUpdatingId(id);
    try {
      const { error } = await supabase
        .from('subscriptions')
        .update({ admin_flag: flag })
        .eq('id', id);
      if (error) throw error;
      setSubscribers((prev) =>
        prev.map((s) => (s.id === id ? { ...s, admin_flag: flag } : s))
      );
    } catch (err) {
      console.error('[Recognition+] Error updating flag:', err);
    } finally {
      setUpdatingId(null);
    }
  };

  const filtered = subscribers.filter(
    (s) =>
      !search.trim() ||
      (s.email || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.display_name || '').toLowerCase().includes(search.toLowerCase()) ||
      (s.dodo_customer_id || '').includes(search) ||
      (s.stripe_customer_id || '').includes(search)
  );

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e5e7eb', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Recognition+ Management</h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              Subscribers, payments, and manual account flags
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            style={{ padding: '8px 16px', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Total Subscribers', value: stats.total, sub: 'All time', color: '#1a1a1a' },
            { label: 'Active', value: stats.active, sub: 'Paying now', color: '#10b981' },
            { label: 'Pending Review', value: stats.pending, sub: 'Flagged pending', color: '#f59e0b' },
            { label: 'Suspicious', value: stats.suspicious, sub: 'Flagged suspicious', color: '#ef4444' },
            { label: 'MRR', value: `$${stats.revenue.toLocaleString()}`, sub: 'Monthly recurring', color: '#8b5cf6' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email, name, client ID..."
            style={{ flex: 1, minWidth: 240, padding: '8px 14px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13 }}
          />
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', alignSelf: 'center' }}>Status:</span>
            {[
              { key: 'all' as const, label: 'All' },
              { key: 'active' as const, label: 'Active' },
              { key: 'canceled' as const, label: 'Canceled' },
              { key: 'past_due' as const, label: 'Past Due' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterStatus(opt.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterStatus === opt.key ? '#1a1a1a' : '#fff',
                  color: filterStatus === opt.key ? '#fff' : '#6b7280',
                  borderColor: filterStatus === opt.key ? '#1a1a1a' : '#e5e7eb',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280', alignSelf: 'center' }}>Flag:</span>
            {[
              { key: 'all' as const, label: 'All' },
              { key: 'active' as const, label: 'Active' },
              { key: 'pending' as const, label: 'Pending' },
              { key: 'suspicious' as const, label: 'Suspicious' },
              { key: 'contacted_support' as const, label: 'Contacted' },
            ].map((opt) => (
              <button
                key={opt.key}
                onClick={() => setFilterFlag(opt.key)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: '1px solid',
                  background: filterFlag === opt.key ? '#1a1a1a' : '#fff',
                  color: filterFlag === opt.key ? '#fff' : '#6b7280',
                  borderColor: filterFlag === opt.key ? '#1a1a1a' : '#e5e7eb',
                }}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading subscribers...</div>
        ) : filtered.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>💳</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>No subscribers found</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Try adjusting filters or check Dodo Payments integration</div>
          </div>
        ) : (
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            {/* Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 200px',
                gap: 16,
                padding: '14px 20px',
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <div>Subscriber</div>
              <div style={{ textAlign: 'right' }}>Subscribed</div>
              <div style={{ textAlign: 'right' }}>Status</div>
              <div style={{ textAlign: 'right' }}>Product</div>
              <div style={{ textAlign: 'right' }}>Client ID / Receipt</div>
              <div style={{ textAlign: 'center' }}>Actions</div>
            </div>

            {/* Rows */}
            {filtered.map((sub) => {
              const flag = FLAG_STYLES[sub.admin_flag];
              return (
                <div
                  key={sub.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1.5fr 200px',
                    gap: 16,
                    padding: '14px 20px',
                    alignItems: 'center',
                    borderBottom: '1px solid #f3f4f6',
                    background: '#fff',
                  }}
                >
                  {/* Subscriber */}
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                      {sub.display_name || '—'}
                    </div>
                    <div style={{ fontSize: 12, color: '#9ca3af' }}>{sub.email}</div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '2px 8px',
                        borderRadius: 20,
                        background: flag.bg,
                        color: flag.color,
                      }}
                    >
                      {flag.label}
                    </span>
                  </div>

                  {/* Subscribed */}
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#6b7280' }}>
                    {new Date(sub.created_at).toLocaleDateString()}
                  </div>

                  {/* Status */}
                  <div style={{ textAlign: 'right' }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: sub.status === 'active' ? '#10b98120' : '#6b728020',
                        color: sub.status === 'active' ? '#10b981' : '#6b7280',
                      }}
                    >
                      {STATUS_LABELS[sub.status || ''] || sub.status}
                    </span>
                  </div>

                  {/* Product */}
                  <div style={{ textAlign: 'right', fontSize: 13, color: '#6b7280' }}>
                    {sub.product_name || 'Recognition+'}<br />
                    <span style={{ fontSize: 11, color: '#9ca3af' }}>
                      {sub.amount ? `$${sub.amount}` : '—'}
                    </span>
                  </div>

                  {/* Client ID / Receipt */}
                  <div style={{ textAlign: 'right', fontSize: 12 }}>
                    <div style={{ fontFamily: 'monospace', color: '#6b7280', fontSize: 11 }}>
                      {sub.dodo_customer_id || sub.stripe_customer_id || '—'}
                    </div>
                    {sub.receipt_url && (
                      <a
                        href={sub.receipt_url}
                        target="_blank"
                        rel="noreferrer"
                        style={{ color: '#3b82f6', fontSize: 11, fontWeight: 600 }}
                      >
                        Receipt ↗
                      </a>
                    )}
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', gap: 6, justifyContent: 'center' }}>
                    <button
                      onClick={() => updateFlag(sub.id, 'contacted_support')}
                      disabled={updatingId === sub.id}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: '#3b82f620',
                        color: '#3b82f6',
                        border: '1px solid #3b82f640',
                        cursor: 'pointer',
                      }}
                    >
                      {updatingId === sub.id ? '…' : 'Contact'}
                    </button>
                    <button
                      onClick={() => updateFlag(sub.id, 'suspicious')}
                      disabled={updatingId === sub.id}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: '#ef444420',
                        color: '#ef4444',
                        border: '1px solid #ef444440',
                        cursor: 'pointer',
                      }}
                    >
                      {updatingId === sub.id ? '…' : 'Suspicious'}
                    </button>
                    <button
                      onClick={() => updateFlag(sub.id, 'pending')}
                      disabled={updatingId === sub.id}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '6px 10px',
                        borderRadius: 6,
                        background: '#f59e0b20',
                        color: '#f59e0b',
                        border: '1px solid #f59e0b40',
                        cursor: 'pointer',
                      }}
                    >
                      {updatingId === sub.id ? '…' : 'Pending'}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
