import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';

const SIDEBAR_WIDTH = 260;

const sidebarNav = [
  { label: 'Dashboard', path: '/admin', icon: '◆' },
  { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
  { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
  { label: 'Messages', path: '/admin/messages', icon: '◈' },
  { label: 'Support Inbox', path: '/admin/support', icon: '◉' },
  { label: 'Blogs & Articles', path: '/admin/blogs', icon: '◉' },
  { label: 'Future Prospects', path: '/admin/prospects', icon: '◉' },
  { label: 'Meetings', path: '/admin/meetings', icon: '▶', badge: 3 },
  { label: 'Planning Board', path: '/admin/planning', icon: '◐' },
  { label: 'AI Bot', path: '/admin/bot', icon: '◉' },
  { label: 'Verification Queue', path: '/admin/verification', icon: '◈' },
  { label: 'Pilot Management', path: '/admin/pilots', icon: '◉' },
  { label: 'Enterprise Accounts', path: '/admin/enterprises', icon: '◆' },
  { label: 'Event Management', path: '/admin/events', icon: '◈' },
  { label: 'System Settings', path: '/admin/settings', icon: '◉' },
];

interface SupportTicket {
  id: string;
  user_email: string;
  user_name: string;
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved' | 'escalated';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  category: string;
  created_at: string;
  assigned_to?: string;
}

const mockTickets: SupportTicket[] = [
  { id: '1', user_email: 'pilot@example.com', user_name: 'John Doe', subject: 'Cannot verify CAAP license', message: 'My license upload keeps failing with error 500.', status: 'open', priority: 'high', category: 'Verification', created_at: new Date(Date.now() - 2 * 3600000).toISOString() },
  { id: '2', user_email: 'captain@example.com', user_name: 'Sarah Smith', subject: 'Pathway not showing', message: 'I completed the Foundation Program but my pathway is not unlocked.', status: 'in_progress', priority: 'medium', category: 'Programs', created_at: new Date(Date.now() - 5 * 3600000).toISOString() },
  { id: '3', user_email: 'student@example.com', user_name: 'Mike Chen', subject: 'Payment failed', message: 'Tried to buy Recognition Plus but card was declined.', status: 'open', priority: 'urgent', category: 'Billing', created_at: new Date(Date.now() - 8 * 3600000).toISOString() },
];

export default function SupportInboxPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [tickets, setTickets] = useState<SupportTicket[]>(mockTickets);
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(null);
  const [replyText, setReplyText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

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

  const filteredTickets = statusFilter === 'all' ? tickets : tickets.filter((t) => t.status === statusFilter);

  const handleReply = () => {
    if (!replyText.trim() || !selectedTicket) return;
    setTickets((prev) =>
      prev.map((t) => (t.id === selectedTicket.id ? { ...t, status: 'in_progress' as const } : t))
    );
    setReplyText('');
    setSelectedTicket(null);
  };

  const handleResolve = (id: string) => {
    setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: 'resolved' as const } : t)));
    setSelectedTicket(null);
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
      {/* Sidebar */}
      <aside style={{ width: SIDEBAR_WIDTH, background: '#ffffff', borderRight: '1px solid #e5e7eb', display: 'flex', flexDirection: 'column', position: 'fixed', top: 0, left: 0, bottom: 0, zIndex: 50 }}>
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#ef4444', fontSize: 22 }}>◆</span>
            <span>Admin<span style={{ color: '#ef4444' }}>OS</span></span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.05em' }}>PILOTRECOGNITION MANAGEMENT</div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sidebarNav.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button key={item.path} onClick={() => navigate(item.path)} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', borderRadius: 8, background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent', border: 'none', color: isActive ? '#ef4444' : '#6b7280', fontSize: 13, fontWeight: isActive ? 600 : 500, cursor: 'pointer', textAlign: 'left', transition: 'all 0.15s', position: 'relative' }}>
                {isActive && <div style={{ position: 'absolute', left: 0, top: '50%', transform: 'translateY(-50%)', width: 3, height: 20, background: '#ef4444', borderRadius: '0 4px 4px 0' }} />}
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge ? <span style={{ background: '#ef4444', color: '#fff', fontSize: 10, fontWeight: 700, padding: '2px 6px', borderRadius: 10, minWidth: 18, textAlign: 'center' }}>{item.badge}</span> : null}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 16px 20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'linear-gradient(135deg, #ef4444, #b91c1c)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#fff' }}>
              {((userProfile?.display_name || userProfile?.email || currentUser?.email || '?') as string).charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{userProfile?.display_name || userProfile?.email || currentUser?.email}</div>
              <div style={{ fontSize: 10, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>● {userProfile?.role || 'admin'}</div>
            </div>
          </div>
          <button onClick={() => navigate('/')} style={{ width: '100%', padding: '8px 0', background: 'none', border: 'none', color: '#9ca3af', fontSize: 12, cursor: 'pointer', textAlign: 'left', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span>←</span> Back to Home
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, padding: '32px', minHeight: '100vh' }}>
        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#1a1a1a' }}>Support Inbox</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Customer troubleshooting and user support requests</p>
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
            <div>Category</div>
            <div>Priority</div>
            <div>Status</div>
            <div>Time</div>
          </div>
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
              <div style={{ fontSize: 12, color: '#6b7280' }}>{ticket.category}</div>
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
          {filteredTickets.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No tickets match this filter</div>
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
              <button onClick={handleReply} disabled={!replyText.trim()} style={{ flex: 1, padding: 10, background: replyText.trim() ? '#3b82f6' : '#e5e7eb', border: 'none', borderRadius: 8, color: replyText.trim() ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 600, cursor: replyText.trim() ? 'pointer' : 'not-allowed' }}>Reply</button>
              <button onClick={() => handleResolve(selectedTicket.id)} style={{ flex: 1, padding: 10, background: '#10b981', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Resolve</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
