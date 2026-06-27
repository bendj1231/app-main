
import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/shared/supabase';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


interface LineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

interface ProformaInvoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_company?: string;
  client_address?: string;
  client_tax_id?: string;
  line_items: LineItem[];
  subtotal: number;
  tax_rate: number;
  tax_amount: number;
  total: number;
  currency: string;
  status: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  invoice_type: string;
  notes?: string;
  due_date?: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  draft: '#6b7280', sent: '#3b82f6', paid: '#10b981', overdue: '#ef4444', cancelled: '#9ca3af',
};

const statusLabels: Record<string, string> = {
  draft: 'Draft', sent: 'Sent', paid: 'Paid', overdue: 'Overdue', cancelled: 'Cancelled',
};

export default function InvoicesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [invoices, setInvoices] = useState<ProformaInvoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState<ProformaInvoice | null>(null);
  const [activeTab, setActiveTab] = useState<'proforma' | 'dodo'>('proforma');
  const [dodoData, setDodoData] = useState<any>(null);
  const [dodoLoading, setDodoLoading] = useState(false);

  // Create form state
  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [clientTaxId, setClientTaxId] = useState('');
  const [invoiceType, setInvoiceType] = useState('proforma');
  const [taxRate, setTaxRate] = useState(0);
  const [dueDate, setDueDate] = useState('');
  const [notes, setNotes] = useState('');
  const [lineItems, setLineItems] = useState<LineItem[]>([
    { description: '', quantity: 1, unit_price: 0, amount: 0 },
  ]);

  useEffect(() => { if (isAdmin) fetchInvoices(); }, [isAdmin]);
  useEffect(() => { if (isAdmin && activeTab === 'dodo') fetchDodoData(); }, [isAdmin, activeTab]);

  const fetchDodoData = async () => {
    setDodoLoading(true);
    console.log('[Invoices] fetchDodoData() starting ...');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('[Invoices] Session present:', !!session);
      console.log('[Invoices] VITE_SUPABASE_URL:', import.meta.env.VITE_SUPABASE_URL);
      const edgeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-payments-proxy?detail=true`;
      console.log('[Invoices] Edge URL:', edgeUrl);

      const res = await fetch(edgeUrl, {
        headers: {
          'Authorization': `Bearer ${session?.access_token || ''}`,
          'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
        },
      });
      console.log('[Invoices] Edge response status:', res.status, res.statusText);
      if (res.ok) {
        const json = await res.json();
        console.log('[Invoices] Edge response JSON keys:', Object.keys(json));
        console.log('[Invoices] Edge source:', json.source);
        console.log('[Invoices] Payments count:', json.payments?.length);
        console.log('[Invoices] Subscriptions count:', json.subscriptions?.length);
        console.log('[Invoices] Total revenue (raw):', json.totalRevenue);
        console.log('[Invoices] MRR (raw):', json.mrr);
        setDodoData(json);
      } else {
        const errorText = await res.text().catch(() => 'no body');
        console.error('[Invoices] Dodo fetch failed:', res.status, errorText);
      }
    } catch (err) {
      console.error('[Invoices] Dodo fetch error:', err);
    } finally {
      setDodoLoading(false);
      console.log('[Invoices] fetchDodoData() done');
    }
  };

  const fetchInvoices = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('proforma_invoices').select('*').order('created_at', { ascending: false });
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) { console.error('Error fetching invoices:', err); }
    finally { setLoading(false); }
  };

  const filteredInvoices = invoices.filter((inv) => {
    const matchesStatus = filterStatus === 'all' || inv.status === filterStatus;
    const q = searchQuery.toLowerCase();
    const matchesSearch = inv.invoice_number.toLowerCase().includes(q) || inv.client_name.toLowerCase().includes(q) || inv.client_email.toLowerCase().includes(q) || (inv.client_company && inv.client_company.toLowerCase().includes(q));
    return matchesStatus && matchesSearch;
  });

  const calculateTotals = (items: LineItem[], tax: number) => {
    const subtotal = items.reduce((sum, it) => sum + it.quantity * it.unit_price, 0);
    const taxAmount = subtotal * (tax / 100);
    return { subtotal, taxAmount, total: subtotal + taxAmount };
  };

  const { subtotal, taxAmount, total } = calculateTotals(lineItems, taxRate);

  const updateLineItem = (index: number, field: keyof LineItem, value: string | number) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };
    if (field === 'quantity' || field === 'unit_price') {
      updated[index].amount = updated[index].quantity * updated[index].unit_price;
    }
    setLineItems(updated);
  };

  const addLineItem = () => {
    setLineItems([...lineItems, { description: '', quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const removeLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const handleCreate = async () => {
    if (!clientName || !clientEmail || lineItems.length === 0) return;
    try {
      const { error } = await supabase.from('proforma_invoices').insert({
        client_name: clientName,
        client_email: clientEmail,
        client_company: clientCompany || null,
        client_address: clientAddress || null,
        client_tax_id: clientTaxId || null,
        line_items: lineItems.filter((li) => li.description.trim()),
        subtotal,
        tax_rate: taxRate,
        tax_amount: taxAmount,
        total,
        currency: 'USD',
        status: 'draft',
        invoice_type: invoiceType,
        notes: notes || null,
        due_date: dueDate || null,
        created_by: currentUser?.id,
      });
      if (error) throw error;
      resetForm();
      setShowCreate(false);
      fetchInvoices();
    } catch (err) {
      console.error('Error creating invoice:', err);
      alert('Failed to create invoice');
    }
  };

  const resetForm = () => {
    setClientName('');
    setClientEmail('');
    setClientCompany('');
    setClientAddress('');
    setClientTaxId('');
    setInvoiceType('proforma');
    setTaxRate(0);
    setDueDate('');
    setNotes('');
    setLineItems([{ description: '', quantity: 1, unit_price: 0, amount: 0 }]);
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const updates: any = { status };
      if (status === 'sent') updates.sent_at = new Date().toISOString();
      if (status === 'paid') updates.paid_at = new Date().toISOString();
      const { error } = await supabase.from('proforma_invoices').update(updates).eq('id', id);
      if (error) throw error;
      fetchInvoices();
      if (selectedInvoice?.id === id) {
        setSelectedInvoice({ ...selectedInvoice, status: status as any, ...updates });
      }
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const stats = {
    revenue: invoices.reduce((s, i) => s + (i.status === 'paid' ? i.total : 0), 0),
    pending: invoices.filter((i) => i.status === 'sent' || i.status === 'draft').length,
    paid: invoices.filter((i) => i.status === 'paid').length,
    overdue: invoices.filter((i) => i.status === 'overdue').length,
  };

  const formatCurrency = (n: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(n);

  if (!currentUser || !isAdmin) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fa' }}>
        <div style={{ textAlign: 'center' }}>
          <h2 style={{ color: '#1a1a1a' }}>Access Denied</h2>
          <p style={{ color: '#6b7280' }}>You must be an admin to view this page.</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      
      <AdminSidebar />

      {/* Main Content */}
      <main style={{ marginLeft: SIDEBAR_WIDTH, flex: 1, padding: '28px 32px', minWidth: 0 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, color: '#1a1a1a', margin: '0 0 4px' }}>Invoice & Billing Management</h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>Proforma invoices, enterprise subscriptions, and recognition fees</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AdminNotificationBell />
            <button onClick={() => setShowCreate(true)} style={{ padding: '10px 20px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>
              + Create Proforma
            </button>
          </div>
        </div>

        {/* Tab Switcher */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20, borderBottom: '1px solid #e5e7eb' }}>
          <button onClick={() => setActiveTab('proforma')} style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'proforma' ? '2px solid #ef4444' : '2px solid transparent', color: activeTab === 'proforma' ? '#ef4444' : '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>
            Proforma Invoices
          </button>
          <button onClick={() => setActiveTab('dodo')} style={{ padding: '10px 16px', background: 'transparent', border: 'none', borderBottom: activeTab === 'dodo' ? '2px solid #ef4444' : '2px solid transparent', color: activeTab === 'dodo' ? '#ef4444' : '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer', marginBottom: -1 }}>
            Dodo Payments
          </button>
        </div>

        {activeTab === 'proforma' ? (
          <>
            {/* Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Revenue', value: formatCurrency(stats.revenue), color: '#10b981' },
                { label: 'Pending', value: stats.pending.toString(), color: '#3b82f6' },
                { label: 'Paid', value: stats.paid.toString(), color: '#10b981' },
                { label: 'Overdue', value: stats.overdue.toString(), color: '#ef4444' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Filters */}
            <div style={{ display: 'flex', gap: 12, marginBottom: 16, alignItems: 'center' }}>
              <input type="text" value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search invoices..." style={{ flex: 1, maxWidth: 300, padding: '8px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} />
              <div style={{ display: 'flex', gap: 6 }}>
                {['all', 'draft', 'sent', 'paid', 'overdue', 'cancelled'].map((s) => (
                  <button key={s} onClick={() => setFilterStatus(s)} style={{ padding: '6px 14px', borderRadius: 20, border: 'none', fontSize: 12, fontWeight: 600, cursor: 'pointer', background: filterStatus === s ? '#1a1a1a' : '#f3f4f6', color: filterStatus === s ? '#fff' : '#6b7280' }}>
                    {s === 'all' ? 'All' : statusLabels[s]}
                  </button>
                ))}
              </div>
            </div>

            {/* Invoice Table */}
            {loading ? (
              <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading...</div>
            ) : filteredInvoices.length === 0 ? (
              <div style={{ textAlign: 'center', padding: 60, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb' }}>
                <div style={{ fontSize: 36, marginBottom: 12 }}>📄</div>
                <div style={{ fontSize: 15, color: '#6b7280', fontWeight: 600 }}>No invoices found</div>
                <div style={{ fontSize: 13, color: '#9ca3af', marginTop: 4 }}>Create your first proforma invoice to get started</div>
              </div>
            ) : (
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Invoice #</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Client</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Type</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</th>
                      <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                      <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                      <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredInvoices.map((inv) => (
                      <tr key={inv.id} style={{ borderBottom: '1px solid #f3f4f6', cursor: 'pointer' }} onClick={() => setSelectedInvoice(inv)}>
                        <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1a1a1a' }}>{inv.invoice_number}</td>
                        <td style={{ padding: '14px 16px' }}>
                          <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{inv.client_name}</div>
                          <div style={{ fontSize: 12, color: '#9ca3af' }}>{inv.client_email}</div>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#6b7280', textTransform: 'capitalize' }}>{inv.invoice_type.replace('_', ' ')}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>{formatCurrency(inv.total)}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                          <span style={{ padding: '4px 10px', background: `${statusColors[inv.status]}15`, color: statusColors[inv.status], borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase' }}>{statusLabels[inv.status]}</span>
                        </td>
                        <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 12 }}>{new Date(inv.created_at).toLocaleDateString()}</td>
                        <td style={{ padding: '14px 16px', textAlign: 'right' }}>
                          <button onClick={(e) => { e.stopPropagation(); setSelectedInvoice(inv); }} style={{ padding: '6px 12px', background: '#f3f4f6', border: 'none', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>View</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <>
            {/* Dodo Payments Stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
              {[
                { label: 'Total Revenue', value: formatCurrency((dodoData?.totalRevenue || 0) / 100), color: '#10b981' },
                { label: 'MRR', value: formatCurrency((dodoData?.mrr || 0) / 100), color: '#3b82f6' },
                { label: 'Active Subs', value: (dodoData?.activeSubscriptions || 0).toString(), color: '#10b981' },
                { label: 'Total Payments', value: (dodoData?.totalPayments || 0).toString(), color: '#ef4444' },
              ].map((stat) => (
                <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                  <div style={{ fontSize: 24, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
                  <div style={{ fontSize: 12, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
                </div>
              ))}
            </div>

            {/* Payments Table */}
            <div style={{ marginBottom: 24 }}>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>Recent Payments</h2>
              {dodoLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading Dodo Payments...</div>
              ) : !dodoData?.payments?.length ? (
                <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#6b7280' }}>No payments found</div>
              ) : (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Payment ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Method</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dodoData.payments.map((p: any) => (
                        <tr key={p.payment_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'monospace', fontSize: 12 }}>{p.payment_id}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{p.customer?.name || '—'}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>{p.customer?.email || '—'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>{formatCurrency((p.total_amount || 0) / 100)}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                              background: p.status === 'succeeded' || p.status === 'paid' ? '#dcfce7' : p.status === 'failed' ? '#fee2e2' : '#fef9c3',
                              color: p.status === 'succeeded' || p.status === 'paid' ? '#16a34a' : p.status === 'failed' ? '#dc2626' : '#ca8a04'
                            }}>{p.status || 'pending'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 12 }}>{p.payment_method_type || p.payment_method || '—'}</td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 12 }}>{p.created_at ? new Date(p.created_at).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* Subscriptions Table */}
            <div>
              <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a', margin: '0 0 12px' }}>Subscriptions</h2>
              {dodoLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af' }}>Loading...</div>
              ) : !dodoData?.subscriptions?.length ? (
                <div style={{ textAlign: 'center', padding: 40, background: '#fff', borderRadius: 12, border: '1px solid #e5e7eb', color: '#6b7280' }}>No subscriptions found</div>
              ) : (
                <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Subscription ID</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Customer</th>
                        <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Amount</th>
                        <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Status</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Frequency</th>
                        <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Next Billing</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dodoData.subscriptions.map((s: any) => (
                        <tr key={s.subscription_id} style={{ borderBottom: '1px solid #f3f4f6' }}>
                          <td style={{ padding: '14px 16px', fontWeight: 600, color: '#1a1a1a', fontFamily: 'monospace', fontSize: 12 }}>{s.subscription_id}</td>
                          <td style={{ padding: '14px 16px' }}>
                            <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{s.customer?.name || '—'}</div>
                            <div style={{ fontSize: 12, color: '#9ca3af' }}>{s.customer?.email || '—'}</div>
                          </td>
                          <td style={{ padding: '14px 16px', textAlign: 'right', fontWeight: 700, color: '#1a1a1a' }}>{formatCurrency((s.recurring_pre_tax_amount || 0) / 100)}</td>
                          <td style={{ padding: '14px 16px', textAlign: 'center' }}>
                            <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 11, fontWeight: 700, textTransform: 'uppercase',
                              background: s.status === 'active' ? '#dcfce7' : s.status === 'cancelled' || s.status === 'expired' ? '#fee2e2' : '#fef9c3',
                              color: s.status === 'active' ? '#16a34a' : s.status === 'cancelled' || s.status === 'expired' ? '#dc2626' : '#ca8a04'
                            }}>{s.status || 'unknown'}</span>
                          </td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 12 }}>{s.payment_frequency_count || 1} {s.payment_frequency_interval || 'Month'}{s.payment_frequency_count > 1 ? 's' : ''}</td>
                          <td style={{ padding: '14px 16px', color: '#6b7280', fontSize: 12 }}>{s.next_billing_date ? new Date(s.next_billing_date).toLocaleDateString() : '—'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </>
        )}
      </main>

      {/* Create Modal */}
      {showCreate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 720, maxHeight: '90vh', overflow: 'auto' }}>
            <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 20px' }}>Create Proforma Invoice</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Client Name *</label><input value={clientName} onChange={(e) => setClientName(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Client Email *</label><input type="email" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Company</label><input value={clientCompany} onChange={(e) => setClientCompany(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Tax ID</label><input value={clientTaxId} onChange={(e) => setClientTaxId(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Address</label><input value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12, marginBottom: 16 }}>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Type</label>
                <select value={invoiceType} onChange={(e) => setInvoiceType(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a', background: '#fff' }}>
                  <option value="proforma">Proforma</option><option value="enterprise_subscription">Enterprise Subscription</option><option value="recognition_fee">Recognition Fee</option><option value="custom">Custom</option>
                </select>
              </div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Due Date</label><input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
              <div><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Tax Rate (%)</label><input type="number" value={taxRate} onChange={(e) => setTaxRate(Number(e.target.value))} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} /></div>
            </div>
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Line Items</div>
              {lineItems.map((item, i) => (
                <div key={i} style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 8 }}>
                  <input placeholder="Description" value={item.description} onChange={(e) => updateLineItem(i, 'description', e.target.value)} style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} />
                  <input type="number" placeholder="Qty" value={item.quantity} onChange={(e) => updateLineItem(i, 'quantity', Number(e.target.value))} style={{ width: 60, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} />
                  <input type="number" placeholder="Price" value={item.unit_price} onChange={(e) => updateLineItem(i, 'unit_price', Number(e.target.value))} style={{ width: 90, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a' }} />
                  <div style={{ width: 80, textAlign: 'right', fontWeight: 600, color: '#1a1a1a', fontSize: 13 }}>{formatCurrency(item.amount)}</div>
                  {lineItems.length > 1 && <button onClick={() => removeLineItem(i)} style={{ padding: '4px 8px', background: '#fee2e2', border: 'none', borderRadius: 6, color: '#ef4444', fontSize: 12, cursor: 'pointer' }}>×</button>}
                </div>
              ))}
              <button onClick={addLineItem} style={{ padding: '6px 12px', background: 'transparent', border: '1px dashed #d1d5db', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>+ Add Line Item</button>
            </div>
            <div style={{ background: '#f9fafb', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ fontSize: 13, color: '#6b7280' }}>Subtotal</span><span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{formatCurrency(subtotal)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}><span style={{ fontSize: 13, color: '#6b7280' }}>Tax ({taxRate}%)</span><span style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>{formatCurrency(taxAmount)}</span></div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid #e5e7eb', paddingTop: 8, marginTop: 8 }}><span style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>Total</span><span style={{ fontSize: 14, fontWeight: 700, color: '#ef4444' }}>{formatCurrency(total)}</span></div>
            </div>
            <div style={{ marginBottom: 16 }}><label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Notes</label><textarea value={notes} onChange={(e) => setNotes(e.target.value)} rows={3} style={{ width: '100%', padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, color: '#1a1a1a', resize: 'vertical' }} /></div>
            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => { setShowCreate(false); resetForm(); }} style={{ flex: 1, padding: '10px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              <button onClick={handleCreate} style={{ flex: 1, padding: '10px', background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Create Invoice</button>
            </div>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      {selectedInvoice && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100, padding: 24 }} onClick={() => setSelectedInvoice(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 640, maxHeight: '90vh', overflow: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>{selectedInvoice.invoice_number}</h2>
                <div style={{ fontSize: 12, color: '#9ca3af' }}>{new Date(selectedInvoice.created_at).toLocaleDateString()}</div>
              </div>
              <span style={{ padding: '4px 12px', background: `${statusColors[selectedInvoice.status]}15`, color: statusColors[selectedInvoice.status], borderRadius: 20, fontSize: 12, fontWeight: 700, textTransform: 'uppercase' }}>{statusLabels[selectedInvoice.status]}</span>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Bill To</div>
              <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 13, color: '#374151' }}>
                <div style={{ fontWeight: 600 }}>{selectedInvoice.client_name}</div>
                <div>{selectedInvoice.client_email}</div>
                {selectedInvoice.client_company && <div style={{ marginTop: 2 }}>{selectedInvoice.client_company}</div>}
                {selectedInvoice.client_address && <div style={{ marginTop: 2 }}>{selectedInvoice.client_address}</div>}
                {selectedInvoice.client_tax_id && <div style={{ marginTop: 2, color: '#6b7280' }}>Tax ID: {selectedInvoice.client_tax_id}</div>}
              </div>
            </div>
            <div style={{ marginBottom: 20 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Line Items</div>
              <div style={{ border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead><tr style={{ background: '#f9fafb' }}><th style={{ padding: '8px 12px', textAlign: 'left', fontWeight: 600, color: '#6b7280', fontSize: 11 }}>Description</th><th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11 }}>Qty</th><th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11 }}>Unit</th><th style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600, color: '#6b7280', fontSize: 11 }}>Amount</th></tr></thead>
                  <tbody>
                    {selectedInvoice.line_items.map((item: LineItem, i: number) => (
                      <tr key={i} style={{ borderTop: '1px solid #f3f4f6' }}><td style={{ padding: '8px 12px' }}>{item.description}</td><td style={{ padding: '8px 12px', textAlign: 'right' }}>{item.quantity}</td><td style={{ padding: '8px 12px', textAlign: 'right' }}>{formatCurrency(item.unit_price)}</td><td style={{ padding: '8px 12px', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(item.amount)}</td></tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 12, gap: 24 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Subtotal: {formatCurrency(selectedInvoice.subtotal)}</div>
                  <div style={{ fontSize: 12, color: '#6b7280', marginBottom: 4 }}>Tax ({selectedInvoice.tax_rate}%): {formatCurrency(selectedInvoice.tax_amount)}</div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#1a1a1a' }}>Total: {formatCurrency(selectedInvoice.total)}</div>
                </div>
              </div>
            </div>
            {selectedInvoice.notes && (
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 8 }}>Notes</div>
                <div style={{ background: '#f9fafb', borderRadius: 8, padding: 12, fontSize: 13, color: '#374151', whiteSpace: 'pre-wrap' }}>{selectedInvoice.notes}</div>
              </div>
            )}
            {/* Status Actions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {selectedInvoice.status === 'draft' && (
                <button onClick={() => updateStatus(selectedInvoice.id, 'sent')} style={{ padding: '8px 16px', background: '#3b82f6', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark as Sent</button>
              )}
              {selectedInvoice.status === 'sent' && (
                <>
                  <button onClick={() => updateStatus(selectedInvoice.id, 'paid')} style={{ padding: '8px 16px', background: '#10b981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark as Paid</button>
                  <button onClick={() => updateStatus(selectedInvoice.id, 'overdue')} style={{ padding: '8px 16px', background: '#f59e0b', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Mark Overdue</button>
                </>
              )}
              {selectedInvoice.status !== 'cancelled' && selectedInvoice.status !== 'paid' && (
                <button onClick={() => updateStatus(selectedInvoice.id, 'cancelled')} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Cancel</button>
              )}
              <button onClick={() => setSelectedInvoice(null)} style={{ marginLeft: 'auto', padding: '8px 16px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}