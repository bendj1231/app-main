import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Bell } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';

export default function AdminNotificationBell() {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState<
    { id: string; title: string; message: string; read: boolean; created_at: string; type: string; source: string }[]
  >([]);
  const [readNotificationIds, setReadNotificationIds] = useState<Set<string>>(() => {
    try {
      const saved = localStorage.getItem('admin_read_notification_ids');
      return new Set(saved ? JSON.parse(saved) : []);
    } catch {
      return new Set();
    }
  });

  useEffect(() => {
    localStorage.setItem('admin_read_notification_ids', JSON.stringify(Array.from(readNotificationIds)));
  }, [readNotificationIds]);

  const fetchRealNotifications = async () => {
    if (!currentUser) return;
    const all: { id: string; title: string; message: string; read: boolean; created_at: string; type: string; source: string }[] = [];

    const add = (source: string, id: string, title: string, message: string, created_at: string, type: string) => {
      const compositeId = `${source}::${id}`;
      all.push({ id: compositeId, title, message, read: readNotificationIds.has(compositeId), created_at, type, source });
    };

    try {
      const { data: meetingsData } = await supabase
        .from('meetings')
        .select('id, title, start_time, status')
        .neq('status', 'completed')
        .order('start_time', { ascending: true })
        .limit(5);
      (meetingsData || []).forEach((m: any) => {
        add('meeting', m.id, `Meeting: ${m.title || 'Untitled'}`, `Scheduled for ${new Date(m.start_time).toLocaleString()}`, m.start_time, 'info');
      });
    } catch { /* ignore */ }

    try {
      const { data: msgData } = await supabase
        .from('messages')
        .select('id, sender_id, content, created_at')
        .is('read_at', null)
        .neq('sender_id', currentUser.id)
        .order('created_at', { ascending: false })
        .limit(10);
      (msgData || []).forEach((m: any) => {
        add('message', m.id, 'New message', m.content || 'You have a new message', m.created_at, 'info');
      });
    } catch { /* ignore */ }

    try {
      const { data: emailData } = await supabase
        .from('received_emails')
        .select('id, from_email, subject, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      (emailData || []).forEach((e: any) => {
        add('email', e.id, `Email from ${e.from_email || 'unknown'}`, e.subject || 'No subject', e.created_at, 'info');
      });
    } catch { /* ignore */ }

    try {
      const { data: ticketData } = await supabase
        .from('support_enquiries')
        .select('id, name, subject, status, created_at')
        .neq('status', 'resolved')
        .order('created_at', { ascending: false })
        .limit(5);
      (ticketData || []).forEach((t: any) => {
        add('support', t.id, `Support ticket from ${t.name || 'unknown'}`, t.subject || 'No subject', t.created_at, 'warning');
      });
    } catch { /* ignore */ }

    try {
      const { data: docData } = await supabase
        .from('pilot_documents')
        .select('id, document_type, pilot_id, status, created_at')
        .eq('status', 'pending_review')
        .order('created_at', { ascending: false })
        .limit(5);
      (docData || []).forEach((d: any) => {
        add('verification', d.id, 'Document review pending', `${d.document_type || 'Document'} awaiting review`, d.created_at, 'warning');
      });
    } catch { /* ignore */ }

    try {
      const { data: prospectData } = await supabase
        .from('prospects')
        .select('id, company_name, contact_name, status, created_at')
        .order('created_at', { ascending: false })
        .limit(5);
      (prospectData || []).forEach((p: any) => {
        add('prospect', p.id, `New prospect: ${p.company_name || 'Unknown'}`, `Contact: ${p.contact_name || 'N/A'} — ${p.status || 'new'}`, p.created_at, 'success');
      });
    } catch { /* ignore */ }

    try {
      const { data: invoiceData } = await supabase
        .from('proforma_invoices')
        .select('id, invoice_number, client_name, status, created_at')
        .in('status', ['draft', 'sent'])
        .order('created_at', { ascending: false })
        .limit(5);
      (invoiceData || []).forEach((i: any) => {
        add('invoice', i.id, `Invoice ${i.invoice_number || 'draft'}`, `${i.client_name || 'Client'} — ${i.status}`, i.created_at, 'info');
      });
    } catch { /* ignore */ }

    try {
      const { data: accessData } = await supabase
        .from('enterprise_access_requests')
        .select('id, company_name, contact_email, status, created_at')
        .eq('status', 'pending')
        .order('created_at', { ascending: false })
        .limit(5);
      (accessData || []).forEach((a: any) => {
        add('enterprise', a.id, 'Enterprise access request', `${a.company_name || 'Unknown'} — ${a.contact_email || ''}`, a.created_at, 'success');
      });
    } catch { /* ignore */ }

    all.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
    setNotifications(all);
  };

  useEffect(() => {
    if (!currentUser) return;
    fetchRealNotifications();

    const subs = [
      supabase.channel('bell-meetings').on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-messages').on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-emails').on('postgres_changes', { event: '*', schema: 'public', table: 'received_emails' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-support').on('postgres_changes', { event: '*', schema: 'public', table: 'support_enquiries' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-docs').on('postgres_changes', { event: '*', schema: 'public', table: 'pilot_documents' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-prospects').on('postgres_changes', { event: '*', schema: 'public', table: 'prospects' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-invoices').on('postgres_changes', { event: '*', schema: 'public', table: 'proforma_invoices' }, () => fetchRealNotifications()).subscribe(),
      supabase.channel('bell-enterprise').on('postgres_changes', { event: '*', schema: 'public', table: 'enterprise_access_requests' }, () => fetchRealNotifications()).subscribe(),
    ];

    return () => subs.forEach((s) => s.unsubscribe());
  }, [currentUser]);

  const unreadNotifications = notifications.filter((n) => !n.read);

  const markNotificationRead = (id: string) => {
    setReadNotificationIds((prev) => new Set(prev).add(id));
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
  };

  const handleNotificationClick = (n: any) => {
    markNotificationRead(n.id);
    const routes: Record<string, string> = {
      meeting: '/admin/meetings',
      message: '/admin/messages',
      email: '/admin/emails',
      support: '/admin/support',
      verification: '/admin/verification-management',
      prospect: '/admin/prospects',
      invoice: '/admin/invoices',
      enterprise: '/admin/enterprises',
    };
    if (routes[n.source]) navigate(routes[n.source]);
    setShowNotifications(false);
  };

  const typeColors = {
    info: '#3b82f6',
    success: '#10b981',
    warning: '#f59e0b',
    error: '#ef4444',
  };

  const sourceLabels: Record<string, string> = {
    meeting: 'Meetings',
    message: 'Messages',
    email: 'Emails',
    support: 'Support',
    verification: 'Verification',
    prospect: 'Prospects',
    invoice: 'Invoices',
    enterprise: 'Enterprises',
  };

  return (
    <div style={{ position: 'relative' }}>
      <button
        onClick={() => setShowNotifications(!showNotifications)}
        style={{
          position: 'relative',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: 20,
          padding: 4,
          color: '#6b7280',
          display: 'flex',
          alignItems: 'center',
        }}
        title="Notifications"
      >
        <Bell size={20} />
        {unreadNotifications.length > 0 && (
          <span
            style={{
              position: 'absolute',
              top: -2,
              right: -2,
              width: 18,
              height: 18,
              background: '#ef4444',
              color: '#fff',
              fontSize: 10,
              fontWeight: 700,
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            {unreadNotifications.length}
          </span>
        )}
      </button>

      {showNotifications && (
        <div
          style={{
            position: 'absolute',
            top: 40,
            right: -10,
            width: 320,
            background: '#fff',
            border: '1px solid #e5e7eb',
            borderRadius: 12,
            boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
            zIndex: 100,
            padding: '12px 0',
            maxHeight: 400,
            overflowY: 'auto',
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <div
            style={{
              padding: '0 16px 8px',
              fontSize: 12,
              fontWeight: 700,
              color: '#9ca3af',
              textTransform: 'uppercase',
              letterSpacing: '0.05em',
            }}
          >
            Notifications
          </div>
          {notifications.length === 0 ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>
              No new notifications
            </div>
          ) : (
            notifications.map((n) => {
              const bgColor = n.read ? '#f9fafb' : '#fff';
              return (
                <button
                  key={n.id}
                  onClick={() => handleNotificationClick(n)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    background: bgColor,
                    border: 'none',
                    borderBottom: '1px solid #f3f4f6',
                    textAlign: 'left',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 4,
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = '#f3f4f6';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = bgColor;
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: typeColors[n.type as keyof typeof typeColors] || '#6b7280',
                      }}
                    />
                    <div
                      style={{
                        fontSize: 12,
                        fontWeight: 600,
                        color: n.read ? '#9ca3af' : '#1a1a1a',
                        flex: 1,
                      }}
                    >
                      {n.title}
                    </div>
                    {!n.read && (
                      <span style={{ fontSize: 9, color: '#ef4444', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                        New
                      </span>
                    )}
                  </div>
                  <div style={{ fontSize: 11, color: '#6b7280', marginLeft: 16 }}>{n.message}</div>
                  <div style={{ fontSize: 10, color: '#9ca3af', marginLeft: 16, display: 'flex', justifyContent: 'space-between' }}>
                    <span>{sourceLabels[n.source] || n.source}</span>
                    <span>{new Date(n.created_at).toLocaleString()}</span>
                  </div>
                </button>
              );
            })
          )}
        </div>
      )}
    </div>
  );
}
