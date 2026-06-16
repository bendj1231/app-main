import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';

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

export default function MeetingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [typeFilter, setTypeFilter] = useState<'all' | 'B2B' | 'B2G' | 'B2O' | 'B2C'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'scheduled' | 'completed'>('all');

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

  const allMeetings = [
    { title: 'Weekly Sync — Keiv & Karl', time: 'Today, 2:00 PM', status: 'upcoming', type: 'B2B', link: '#', attendees: 'Keiv, Karl' },
    { title: 'Product Roadmap Review', time: 'Tomorrow, 10:00 AM', status: 'upcoming', type: 'B2B', link: '#', attendees: 'All team' },
    { title: 'Investor Update Call', time: 'Jun 25, 3:00 PM', status: 'scheduled', type: 'B2B', link: '#', attendees: 'Investors' },
    { title: 'All-Hands: Philippines Launch', time: 'Jun 26, 9:00 AM', status: 'upcoming', type: 'B2C', link: '#', attendees: 'All team' },
    { title: 'Veremark Integration Standup', time: 'Jun 24, 11:00 AM', status: 'upcoming', type: 'B2B', link: '#', attendees: 'Keiv, Karl, Ben' },
    { title: 'CAAP Advisory Board Briefing', time: 'Jun 28, 1:00 PM', status: 'scheduled', type: 'B2G', link: '#', attendees: 'Directors only' },
    { title: 'European Flight Academy Partnership', time: 'Jun 30, 3:00 PM', status: 'scheduled', type: 'B2B', link: '#', attendees: 'Karl, Ben' },
    { title: 'Dubai Civil Aviation Authority Meeting', time: 'Jul 2, 10:00 AM', status: 'scheduled', type: 'B2G', link: '#', attendees: 'Keiv' },
  ];

  const renderMeetingCard = (m: any) => (
    <div
      key={m.title}
      style={{
        padding: '16px',
        background: '#f9fafb',
        borderRadius: 10,
        border: '1px solid #e5e7eb',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
        <div
          style={{
            width: 40,
            height: 40,
            borderRadius: 10,
            background: m.type === 'B2B' ? '#dbeafe' : m.type === 'B2G' ? '#fef3c7' : m.type === 'B2O' ? '#fce7f3' : '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {m.type === 'B2B' ? '🤝' : m.type === 'B2G' ? '🏛️' : m.type === 'B2O' ? '🏢' : '👥'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{m.title}</div>
            <span style={{ padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: '#f3f4f6', color: '#6b7280' }}>
              {m.type}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            {m.time} · {m.attendees}
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span
          style={{
            fontSize: 11,
            fontWeight: 600,
            padding: '4px 10px',
            borderRadius: 20,
            background: m.status === 'upcoming' ? '#fef2f2' : m.status === 'scheduled' ? '#fef3c7' : '#f0fdf4',
            color: m.status === 'upcoming' ? '#ef4444' : m.status === 'scheduled' ? '#f59e0b' : '#10b981',
            textTransform: 'uppercase',
          }}
        >
          {m.status}
        </span>
        <button
          onClick={() => { if (m.link !== '#') window.open(m.link, '_blank'); }}
          style={{
            padding: '6px 14px',
            background: '#ef4444',
            color: '#fff',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          Join
        </button>
        <button
          onClick={() => {
            if (m.link !== '#') {
              navigator.clipboard.writeText(m.link);
              alert('Link copied to clipboard!');
            }
          }}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            color: '#6b7280',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Copy link"
        >
          📋
        </button>
        <button
          onClick={() => {
            const message = `Meeting Reminder: ${m.title} at ${m.time}. Join via: ${m.link}`;
            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
            window.open(whatsappUrl, '_blank');
          }}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            color: '#25D366',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Send via WhatsApp"
        >
          💬
        </button>
      </div>
    </div>
  );

  return (
    <div
      style={{
        minHeight: '100vh',
        background: '#ffffff',
        color: '#1a1a1a',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
        display: 'flex',
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: SIDEBAR_WIDTH,
          background: '#ffffff',
          borderRight: '1px solid #e5e7eb',
          display: 'flex',
          flexDirection: 'column',
          position: 'fixed',
          top: 0,
          left: 0,
          bottom: 0,
          zIndex: 50,
        }}
      >
        <div style={{ padding: '24px 20px 16px' }}>
          <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ color: '#ef4444', fontSize: 22 }}>◆</span>
            <span>Admin<span style={{ color: '#ef4444' }}>OS</span></span>
          </div>
          <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.05em' }}>
            PILOTRECOGNITION MANAGEMENT
          </div>
        </div>

        <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}>
          {sidebarNav.map((item) => {
            const isActive = currentPath === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '10px 14px',
                  borderRadius: 8,
                  background: isActive ? 'rgba(239,68,68,0.08)' : 'transparent',
                  border: 'none',
                  color: isActive ? '#ef4444' : '#6b7280',
                  fontSize: 13,
                  fontWeight: isActive ? 600 : 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'all 0.15s',
                  position: 'relative',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = '#f3f4f6';
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = 'transparent';
                }}
              >
                {isActive && (
                  <div
                    style={{
                      position: 'absolute',
                      left: 0,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 3,
                      height: 20,
                      background: '#ef4444',
                      borderRadius: '0 4px 4px 0',
                    }}
                  />
                )}
                <span style={{ fontSize: 14, opacity: isActive ? 1 : 0.6 }}>{item.icon}</span>
                <span style={{ flex: 1 }}>{item.label}</span>
                {item.badge && (
                  <span
                    style={{
                      background: '#ef4444',
                      color: '#fff',
                      fontSize: 10,
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: 10,
                      minWidth: 18,
                      textAlign: 'center',
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        <div style={{ padding: '16px 16px 20px', borderTop: '1px solid #e5e7eb' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                color: '#fff',
              }}
            >
              {((userProfile?.display_name || userProfile?.email || currentUser?.email || '?') as string).charAt(0).toUpperCase()}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#1a1a1a', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {userProfile?.display_name || userProfile?.email || currentUser?.email}
              </div>
              <div style={{ fontSize: 10, color: '#10b981', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                ● {userProfile?.role || 'admin'}
              </div>
            </div>
          </div>
          <button
            onClick={() => navigate('/')}
            style={{
              width: '100%',
              padding: '8px 0',
              background: 'none',
              border: 'none',
              color: '#9ca3af',
              fontSize: 12,
              cursor: 'pointer',
              textAlign: 'left',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            <span>←</span> Back to Home
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }}>
        {/* Top header */}
        <header
          style={{
            height: 64,
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            borderBottom: '1px solid rgba(229,231,235,0.8)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '0 32px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div>
            <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
              Meetings
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Company Meetings — B2B, B2G, B2O, B2C
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <div
              style={{
                padding: '6px 14px',
                background: 'rgba(239,68,68,0.08)',
                border: '1px solid rgba(239,68,68,0.15)',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                color: '#ef4444',
                letterSpacing: '0.03em',
              }}
            >
              LIVE
            </div>
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Filters */}
          <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'B2B', 'B2G', 'B2O', 'B2C'].map((type) => (
                <button
                  key={type}
                  onClick={() => setTypeFilter(type as typeof typeFilter)}
                  style={{
                    padding: '6px 14px',
                    borderRadius: 20,
                    border: '1px solid',
                    borderColor: typeFilter === type ? '#ef4444' : '#e5e7eb',
                    background: typeFilter === type ? 'rgba(239,68,68,0.08)' : '#fff',
                    color: typeFilter === type ? '#ef4444' : '#6b7280',
                    fontSize: 12,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  {type === 'all' ? 'All Types' : type}
                </button>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              {['all', 'upcoming', 'scheduled', 'completed'].map((status) => (
                <button
                  key={status}
                  onClick={() => setStatusFilter(status as typeof statusFilter)}
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
                  {status}
                </button>
              ))}
            </div>
          </div>

          {/* Meeting list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {allMeetings
              .filter((m) => {
                if (typeFilter !== 'all' && m.type !== typeFilter) return false;
                if (statusFilter !== 'all' && m.status !== statusFilter) return false;
                return true;
              })
              .map((m) => renderMeetingCard(m))}
          </div>

          {/* Notifications */}
          <div
            style={{
              marginTop: 28,
              padding: '20px',
              background: '#fef2f2',
              border: '1px solid #fecaca',
              borderRadius: 12,
            }}
          >
            <div style={{ fontSize: 14, fontWeight: 700, color: '#991b1b', marginBottom: 12 }}>
              🔔 Meeting Alerts (3)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { text: 'Weekly Sync starts in 30 minutes — Keiv & Karl', time: '2:00 PM' },
                { text: 'Product Roadmap Review rescheduled to tomorrow', time: 'Tomorrow' },
                { text: 'New company meeting: CAAP Advisory Board Briefing', time: 'Jun 28' },
              ].map((alert, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    padding: '10px 14px',
                    background: '#ffffff',
                    borderRadius: 8,
                    fontSize: 13,
                    color: '#374151',
                  }}
                >
                  <span>{alert.text}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>{alert.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
