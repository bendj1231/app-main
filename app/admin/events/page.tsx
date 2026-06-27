import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/shared/supabase';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


export default function EventManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newEvent, setNewEvent] = useState({
    title: '',
    start_date: '',
    end_date: '',
    start_time: '',
    end_time: '',
    location: '',
    description: '',
    virtual_event_url: '',
    event_type: 'webinar',
  });

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
        start_date: newEvent.start_date,
        end_date: newEvent.end_date || newEvent.start_date,
        start_time: newEvent.start_time || null,
        end_time: newEvent.end_time || null,
        venue_name: newEvent.location,
        description: newEvent.description,
        virtual_event_url: newEvent.virtual_event_url || null,
        event_type: newEvent.event_type,
        status: 'planning',
        timezone: 'UTC',
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setShowCreateModal(false);
      setNewEvent({
        title: '',
        start_date: '',
        end_date: '',
        start_time: '',
        end_time: '',
        location: '',
        description: '',
        virtual_event_url: '',
        event_type: 'webinar',
      });
      fetchEvents();
    } catch (err) {
      console.error('Error creating event:', err);
      alert('Failed to create event: ' + (err as Error).message);
    }
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
      
      <AdminSidebar />

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
            <AdminNotificationBell />
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
                        {event.start_date} · {event.venue_name || event.location}
                        {event.virtual_event_url && <span> · Virtual</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    {event.virtual_event_url && (
                      <a
                        href={event.virtual_event_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{ fontSize: 11, fontWeight: 600, padding: '4px 10px', borderRadius: 20, background: '#dbeafe', color: '#2563eb', textDecoration: 'none', textTransform: 'uppercase' }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        Join
                      </a>
                    )}
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
                      {event.status || 'Upcoming'}
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
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Start Date</label>
                  <input
                    type="date"
                    value={newEvent.start_date}
                    onChange={(e) => setNewEvent({ ...newEvent, start_date: e.target.value })}
                    required
                    style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>End Date</label>
                  <input
                    type="date"
                    value={newEvent.end_date}
                    onChange={(e) => setNewEvent({ ...newEvent, end_date: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                  />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Start Time</label>
                  <input
                    type="time"
                    value={newEvent.start_time}
                    onChange={(e) => setNewEvent({ ...newEvent, start_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>End Time</label>
                  <input
                    type="time"
                    value={newEvent.end_time}
                    onChange={(e) => setNewEvent({ ...newEvent, end_time: e.target.value })}
                    style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                  />
                </div>
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Location / Venue</label>
                <input
                  type="text"
                  value={newEvent.location}
                  onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                  placeholder="Venue name or 'Virtual'"
                  style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                />
              </div>
              <div>
                <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: '#6b7280', marginBottom: 6 }}>Virtual Event URL (Google Meet)</label>
                <div style={{ display: 'flex', gap: 8 }}>
                  <input
                    type="url"
                    value={newEvent.virtual_event_url}
                    onChange={(e) => setNewEvent({ ...newEvent, virtual_event_url: e.target.value })}
                    placeholder="https://meet.google.com/..."
                    style={{ flex: 1, padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, color: '#1a1a1a', fontSize: 14 }}
                  />
                  <button
                    type="button"
                    onClick={generateMeetLink}
                    style={{ padding: '10px 14px', background: '#0a66c2', border: 'none', borderRadius: 8, color: '#fff', fontSize: 13, fontWeight: 600, cursor: 'pointer', whiteSpace: 'nowrap' }}
                  >
                    New Meet
                  </button>
                </div>
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