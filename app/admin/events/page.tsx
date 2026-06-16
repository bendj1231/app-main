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

export default function EventManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ title: '', date: '', location: '', description: '' });

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchEvents();
  }, [currentUser, isAdmin]);

  const fetchEvents = async () => {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .order('date', { ascending: true });
      if (error) throw error;
      setEvents(data || []);
    } catch (err) {
      console.error('Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const createEvent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('events').insert([{
        title: newEvent.title,
        date: newEvent.date,
        location: newEvent.location,
        description: newEvent.description,
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setShowCreateModal(false);
      setNewEvent({ title: '', date: '', location: '', description: '' });
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
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
              Event Management
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Manage aviation events and conferences
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => setShowCreateModal(true)}
              style={{
                padding: '8px 16px',
                background: '#ef4444',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              + Create Event
            </button>
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Event list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading...</div>
          ) : events.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>📅</div>
              <div style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>No events yet</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>Create your first event to get started</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {events.map((event) => (
                <div
                  key={event.id}
                  style={{
                    padding: '16px 20px',
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
                        background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      📅
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                        {event.title}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>
                        {event.date} · {event.location}
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
                        background: '#f0fdf4',
                        color: '#10b981',
                        textTransform: 'uppercase',
                      }}
                    >
                      Upcoming
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Create Event Modal */}
      {showCreateModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.7)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 100,
          }}
          onClick={() => setShowCreateModal(false)}
        >
          <div
            style={{
              background: '#ffffff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 500,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>Create Event</h2>
            <form onSubmit={createEvent} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Title</label>
                <input
                  type="text"
                  value={newEvent.title}
                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Date</label>
                <input
                  type="date"
                  value={newEvent.date}
                  onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Location</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Description</label>
                <textarea
                  value={newEvent.description}
                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#1a1a1a',
                    fontSize: 14,
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: 'transparent',
                    border: '1px solid #e5e7eb',
                    borderRadius: 8,
                    color: '#6b7280',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  style={{
                    flex: 1,
                    padding: '10px',
                    background: '#ef4444',
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Create Event
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
