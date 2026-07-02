import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { useAuth0 } from '@auth0/auth0-react';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


interface SupportTicket {
  id: string;
  user_id: string;
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  program_type: string;
  admin_notes?: string;
  created_at: string;
  updated_at: string;
}

export default function SupportInboxPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [tickets, setTickets] = useState<SupportTicket[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sendingReply, setSendingReply] = useState(false);

  const statusColors: Record<string, string> = {
    open: '#ef4444',
    in_progress: '#f59e0b',
    resolved: '#10b981',
    escalated: '#8b5cf6',
  };

  const priorityColors: Record<string, string> = {
    low: '#6b7280',
    medium: '#3b82f6',
    high: '#f59e0b',
    urgent: '#ef4444',
  };

  const { callApi } = useWorkerAuth();
  const { getIdTokenClaims } = useAuth0();

  const loadTickets = async () => {
    setLoading(true);
    try {
      const rows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'support_enquiries',
        operation: 'select',
        limit: 500,
      });
      const data = (rows || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      });

      // Fetch profiles separately for manual join
      const userIds = [...new Set(data.map((r: any) => r.user_id).filter(Boolean))];
      let profilesMap: Record<string, any> = {};
      if (userIds.length > 0) {
        const profileRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          where: { id: userIds[0] },
          limit: 500,
        });
        (profileRows || []).forEach((p: any) => {
          profilesMap[p.id] = p;
        });
      }

      const mapped = data.map((row: any) => {
        const profile = profilesMap[row.user_id];
        return {
          id: row.id,
          user_id: row.user_id,
          user_email: profile?.email || 'unknown@pilotrecognition.com',
          user_name: profile?.display_name || profile?.full_name || 'Unknown Pilot',
          subject: row.subject,
          message: row.message,
          status: (row.status || 'open') as SupportTicket['status'],
          priority: (row.priority || 'medium') as SupportTicket['priority'],
          program_type: row.program_type || 'General',
          admin_notes: row.admin_notes,
          created_at: row.created_at,
          updated_at: row.updated_at,
        };
      });

      setTickets(mapped);
    } catch (err) {
      console.error('Error loading tickets:', err);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadTickets();
  }, [isAdmin]);

  const filteredTickets = statusFilter === 'all' ? tickets : tickets.filter((t) => t.status === statusFilter);

  const handleReply = async () => {
    if (!replyText.trim() || !selectedTicket) return;
    setSendingReply(true);

    try {
      const claims = await getIdTokenClaims();
      const token = claims?.__raw || '';
      const res = await fetch(`${import.meta.env.VITE_PILOT_API_URL}/api/send-support-reply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          ticket_id: selectedTicket.id,
          reply_text: replyText.trim(),
          admin_id: currentUser?.id,
        }),
      });

      const result = await res.json();
      if (!res.ok) {
        console.error('Reply failed:', result);
        alert('Failed to send reply: ' + (result.error || 'Unknown error'));
        setSendingReply(false);
        return;
      }

      setReplyText('');
      setSelectedTicket(null);
      await loadTickets();
    } catch (err) {
      console.error('Reply error:', err);
      alert('Failed to send reply');
    } finally {
      setSendingReply(false);
    }
  };

  const handleResolve = async (id: string) => {
    try {
      await callApi('queryTable', {
        table: 'support_enquiries',
        operation: 'update',
        id,
        data: { status: 'resolved', updated_at: new Date().toISOString() },
      });
      setSelectedTicket(null);
      await loadTickets();
    } catch (err) {
      console.error('Resolve error:', err);
      alert('Failed to resolve ticket');
    }
  };

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
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, padding: '32px', minHeight: '100vh' }}>
        <div style={{ marginBottom: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#1a1a1a' }}>Support Inbox</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Customer troubleshooting and user support requests</p>
          </div>
          <AdminNotificationBell />
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Open', value: tickets.filter((t) => t.status === 'open').length, color: '#ef4444' },
            { label: 'In Progress', value: tickets.filter((t) => t.status === 'in_progress').length, color: '#f59e0b' },
            { label: 'Resolved', value: tickets.filter((t) => t.status === 'resolved').length, color: '#10b981' },
            { label: 'Urgent', value: tickets.filter((t) => t.priority === 'urgent').length, color: '#8b5cf6' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
          {['all', 'open', 'in_progress', 'resolved', 'escalated'].map((status) => (
            <button
              key={status}
              onClick={() => setStatusFilter(status)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                border: '1px solid',
                borderColor: statusFilter === status ? '#ef4444' : '#e5e7eb',
                background: statusFilter === status ? 'rgba(239,68,68,0.08)' : '#fff',
                color: statusFilter === status ? '#ef4444' : '#6b7280',
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                textTransform: 'capitalize',
              }}
            >
              {status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Tickets Table */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #e5e7eb', display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 120px', gap: 16, fontSize: 11, fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            <div>Subject / User</div>
            <div>Program</div>
            <div>Priority</div>
            <div>Status</div>
            <div>Time</div>
          </div>
          {loading ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>Loading tickets...</div>
          ) : filteredTickets.length === 0 ? (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No tickets found</div>
          ) : (
            <>
              {filteredTickets.map((ticket) => (
                <div
                  key={ticket.id}
                  onClick={() => setSelectedTicket(ticket)}
                  style={{
                    padding: '14px 20px',
                    borderBottom: '1px solid #f3f4f6',
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 120px',
                    gap: 16,
                    alignItems: 'center',
                    cursor: 'pointer',
                    transition: 'background 0.15s',
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = '#f9fafb'; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = '#fff'; }}
                >
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a', marginBottom: 2 }}>{ticket.subject}</div>
                    <div style={{ fontSize: 11, color: '#9ca3af' }}>{ticket.user_name} — {ticket.user_email}</div>
                  </div>
                  <div style={{ fontSize: 12, color: '#6b7280' }}>{ticket.program_type}</div>
                  <div>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: `${priorityColors[ticket.priority]}15`, color: priorityColors[ticket.priority] }}>
                      {ticket.priority}
                    </span>
                  </div>
                  <div>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: `${statusColors[ticket.status]}15`, color: statusColors[ticket.status] }}>
                      {ticket.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div style={{ fontSize: 11, color: '#9ca3af' }}>
                    {new Date(ticket.created_at).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </>
          )}
        </div>
      </main>

      {/* Ticket Detail Modal */}
      {selectedTicket && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedTicket(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 6px', color: '#1a1a1a' }}>{selectedTicket.subject}</h2>
                <div style={{ fontSize: 12, color: '#6b7280' }}>From: {selectedTicket.user_name} ({selectedTicket.user_email})</div>
              </div>
              <span style={{ padding: '4px 10px', borderRadius: 20, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: `${priorityColors[selectedTicket.priority]}15`, color: priorityColors[selectedTicket.priority] }}>
                {selectedTicket.priority}
              </span>
            </div>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 14, color: '#374151', lineHeight: 1.6 }}>
              {selectedTicket.message}
            </div>

            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Reply</label>
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder="Type your response..."
                style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a', resize: 'vertical' }}
              />
            </div>

            <div style={{ display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedTicket(null)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
              <button onClick={handleReply} disabled={!replyText.trim() || sendingReply} style={{ flex: 1, padding: 10, background: replyText.trim() && !sendingReply ? '#3b82f6' : '#e5e7eb', border: 'none', borderRadius: 8, color: replyText.trim() && !sendingReply ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 600, cursor: replyText.trim() && !sendingReply ? 'pointer' : 'not-allowed' }}>{sendingReply ? 'Sending...' : 'Reply'}</button>
              <button onClick={() => handleResolve(selectedTicket.id)} style={{ flex: 1, padding: 10, background: '#10b981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}