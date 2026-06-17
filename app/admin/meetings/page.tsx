import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';

const SIDEBAR_WIDTH = 260;

const sidebarNav: { label: string; path: string; icon: string; badge?: number }[] = [
  { label: 'Dashboard', path: '/admin', icon: '◆' },
  { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
  { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
  { label: 'Messages', path: '/admin/messages', icon: '◈' },
  { label: 'Support Inbox', path: '/admin/support', icon: '◉' },
  { label: 'Blogs & Articles', path: '/admin/blogs', icon: '◉' },
  { label: 'Future Prospects', path: '/admin/prospects', icon: '◉' },
  { label: 'Meetings', path: '/admin/meetings', icon: '▶' },
  { label: 'Planning Board', path: '/admin/planning', icon: '◐' },
  { label: 'AI Bot', path: '/admin/bot', icon: '◉' },
  { label: 'Recognition+ Management', path: '/admin/verification', icon: '◈' },
  { label: 'Pilot Management', path: '/admin/pilots', icon: '◉' },
  { label: 'Enterprise Accounts', path: '/admin/enterprises', icon: '◆' },
  { label: 'Event Management', path: '/admin/events', icon: '◈' },
  { label: 'System Settings', path: '/admin/settings', icon: '◉' },
];

interface Meeting {
  id: string;
  title: string;
  description?: string;
  meeting_type: string;
  status: string;
  start_time: string;
  end_time?: string;
  meet_link?: string;
  attendees?: string[];
  created_at: string;
}

export default function MeetingsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [loading, setLoading] = useState(true);
  const [typeFilter, setTypeFilter] = useState<'all' | 'B2B' | 'B2G' | 'B2O' | 'B2C'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'upcoming' | 'scheduled' | 'completed'>('all');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);

  const [newMeeting, setNewMeeting] = useState({
    title: '',
    description: '',
    meeting_type: 'B2B' as 'B2B' | 'B2G' | 'B2O' | 'B2C',
    start_time: '',
    end_time: '',
    meet_link: '',
    attendees: '',
  });

  const loadMeetings = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('meetings')
      .select('*')
      .order('start_time', { ascending: true });

    if (error) {
      console.error('Error loading meetings:', error);
    } else {
      setMeetings(data || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) loadMeetings();
  }, [isAdmin]);

  const createMeeting = async () => {
    if (!newMeeting.title || !newMeeting.start_time) return;
    setCreating(true);

    const { error } = await supabase.from('meetings').insert({
      title: newMeeting.title,
      description: newMeeting.description || null,
      meeting_type: newMeeting.meeting_type,
      status: 'scheduled',
      start_time: new Date(newMeeting.start_time).toISOString(),
      end_time: newMeeting.end_time ? new Date(newMeeting.end_time).toISOString() : null,
      meet_link: newMeeting.meet_link || null,
      attendees: newMeeting.attendees ? newMeeting.attendees.split(',').map((s) => s.trim()) : [],
      created_by: currentUser?.id,
    });

    setCreating(false);
    if (error) {
      alert('Failed to create meeting: ' + error.message);
      return;
    }

    setShowCreateModal(false);
    setNewMeeting({
      title: '',
      description: '',
      meeting_type: 'B2B',
      start_time: '',
      end_time: '',
      meet_link: '',
      attendees: '',
    });
    loadMeetings();
  };

  const deleteMeeting = async (id: string) => {
    if (!confirm('Delete this meeting?')) return;
    const { error } = await supabase.from('meetings').delete().eq('id', id);
    if (error) {
      alert('Failed to delete: ' + error.message);
      return;
    }
    loadMeetings();
  };

  const generateMeetLink = () => {
    window.open('https://meet.google.com/new', '_blank', 'noopener,noreferrer');
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

  const formatTime = (iso: string) => {
    const d = new Date(iso);
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const isTomorrow = new Date(now.getTime() + 86400000).toDateString() === d.toDateString();
    const timeStr = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const dateStr = d.toLocaleDateString([], { month: 'short', day: 'numeric' });
    if (isToday) return `Today, ${timeStr}`;
    if (isTomorrow) return `Tomorrow, ${timeStr}`;
    return `${dateStr}, ${timeStr}`;
  };

  const renderMeetingCard = (m: Meeting) => (
    <div
      key={m.id}
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
            background: m.meeting_type === 'B2B' ? '#dbeafe' : m.meeting_type === 'B2G' ? '#fef3c7' : m.meeting_type === 'B2O' ? '#fce7f3' : '#f0fdf4',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: 18,
          }}
        >
          {m.meeting_type === 'B2B' ? '🤝' : m.meeting_type === 'B2G' ? '🏛️' : m.meeting_type === 'B2O' ? '🏢' : '👥'}
        </div>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 2 }}>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>{m.title}</div>
            <span style={{ padding: '2px 6px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: '#f3f4f6', color: '#6b7280' }}>
              {m.meeting_type}
            </span>
          </div>
          <div style={{ fontSize: 12, color: '#6b7280' }}>
            {formatTime(m.start_time)} · {m.attendees?.join(', ') || 'No attendees'}
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
          onClick={() => { if (m.meet_link) window.open(m.meet_link, '_blank'); }}
          disabled={!m.meet_link}
          style={{
            padding: '6px 14px',
            background: m.meet_link ? '#ef4444' : '#e5e7eb',
            color: m.meet_link ? '#fff' : '#9ca3af',
            border: 'none',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: m.meet_link ? 'pointer' : 'not-allowed',
          }}
        >
          Join
        </button>
        <button
          onClick={() => {
            if (m.meet_link) {
              navigator.clipboard.writeText(m.meet_link);
              alert('Link copied to clipboard!');
            }
          }}
          disabled={!m.meet_link}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            color: m.meet_link ? '#6b7280' : '#d1d5db',
            border: '1px solid #e5e7eb',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: m.meet_link ? 'pointer' : 'not-allowed',
          }}
          title="Copy link"
        >
          📋
        </button>
        <button
          onClick={() => deleteMeeting(m.id)}
          style={{
            padding: '6px 10px',
            background: 'transparent',
            color: '#ef4444',
            border: '1px solid #fecaca',
            borderRadius: 6,
            fontSize: 12,
            fontWeight: 600,
            cursor: 'pointer',
          }}
          title="Delete meeting"
        >
          �️
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

          {/* Create Meeting Button */}
          <div style={{ marginBottom: 20 }}>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '10px 20px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Create Meeting
            </button>
          </div>

          {/* Meeting list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 }}>Loading meetings...</div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {meetings
                .filter((m) => {
                  if (typeFilter !== 'all' && m.meeting_type !== typeFilter) return false;
                  if (statusFilter !== 'all' && m.status !== statusFilter) return false;
                  return true;
                })
                .map((m) => renderMeetingCard(m))}
              {meetings.length === 0 && (
                <div style={{ textAlign: 'center', padding: 40, color: '#9ca3af', fontSize: 13 }}>No meetings scheduled</div>
              )}
            </div>
          )}

          {/* Quick Stats */}
          <div style={{ marginTop: 28, display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16 }}>
            {[
              { label: 'Total', value: meetings.length, color: '#1a1a1a' },
              { label: 'Upcoming', value: meetings.filter((m) => m.status === 'upcoming').length, color: '#ef4444' },
              { label: 'Scheduled', value: meetings.filter((m) => m.status === 'scheduled').length, color: '#f59e0b' },
              { label: 'Completed', value: meetings.filter((m) => m.status === 'completed').length, color: '#10b981' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

          {/* Create Meeting Modal */}
          {showCreateModal && (
            <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowCreateModal(false)}>
              <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Create Meeting</h2>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Title</label>
                    <input
                      type="text"
                      value={newMeeting.title}
                      onChange={(e) => setNewMeeting({ ...newMeeting, title: e.target.value })}
                      placeholder="e.g. Weekly Sync"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Type</label>
                      <select
                        value={newMeeting.meeting_type}
                        onChange={(e) => setNewMeeting({ ...newMeeting, meeting_type: e.target.value as any })}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a', background: '#fff' }}
                      >
                        {['B2B', 'B2G', 'B2O', 'B2C'].map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Start Time</label>
                      <input
                        type="datetime-local"
                        value={newMeeting.start_time}
                        onChange={(e) => setNewMeeting({ ...newMeeting, start_time: e.target.value })}
                        style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>End Time</label>
                    <input
                      type="datetime-local"
                      value={newMeeting.end_time}
                      onChange={(e) => setNewMeeting({ ...newMeeting, end_time: e.target.value })}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Attendees (comma separated)</label>
                    <input
                      type="text"
                      value={newMeeting.attendees}
                      onChange={(e) => setNewMeeting({ ...newMeeting, attendees: e.target.value })}
                      placeholder="e.g. keiv@pilotrecognition.com, karl@pilotrecognition.com"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                    />
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                      <label style={{ fontSize: 12, fontWeight: 600, color: '#6b7280' }}>Google Meet Link</label>
                      <button
                        onClick={generateMeetLink}
                        type="button"
                        style={{ fontSize: 11, color: '#ef4444', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}
                      >
                        + Generate New Link
                      </button>
                    </div>
                    <input
                      type="text"
                      value={newMeeting.meet_link}
                      onChange={(e) => setNewMeeting({ ...newMeeting, meet_link: e.target.value })}
                      placeholder="https://meet.google.com/..."
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
                    />
                    <p style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Click "Generate New Link" to open Google Meet, then paste the URL here.</p>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Description</label>
                    <textarea
                      value={newMeeting.description}
                      onChange={(e) => setNewMeeting({ ...newMeeting, description: e.target.value })}
                      rows={3}
                      placeholder="Meeting agenda..."
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a', resize: 'vertical' }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                    <button
                      onClick={() => setShowCreateModal(false)}
                      style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}
                    >
                      Cancel
                    </button>
                    <button
                      onClick={createMeeting}
                      disabled={creating || !newMeeting.title || !newMeeting.start_time}
                      style={{ flex: 1, padding: 10, background: newMeeting.title && newMeeting.start_time && !creating ? '#ef4444' : '#e5e7eb', border: 'none', borderRadius: 8, color: newMeeting.title && newMeeting.start_time && !creating ? '#fff' : '#9ca3af', fontSize: 14, fontWeight: 600, cursor: newMeeting.title && newMeeting.start_time && !creating ? 'pointer' : 'not-allowed' }}
                    >
                      {creating ? 'Creating...' : 'Create Meeting'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
