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

interface Prospect {
  id: string;
  title: string;
  description: string;
  author: string;
  status: 'active' | 'in_progress' | 'completed' | 'on_hold';
  created_at: string;
  updated_at: string;
}

const userColors: Record<string, string> = {
  Benjamin: '#3b82f6',
  Karl: '#8b5cf6',
  Keiv: '#10b981',
  Other: '#6b7280',
};

const mockProspects: Prospect[] = [
  {
    id: '1',
    title: 'Contacting Airbus',
    description: 'Reach out to Airbus regarding pathway card integration and potential partnership for verified pilot data access.',
    author: 'Benjamin',
    status: 'active',
    created_at: new Date(Date.now() - 2 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: '2',
    title: 'European Flight Academy Partnership',
    description: 'Follow up on partnership outreach for flight academy affiliation program.',
    author: 'Karl',
    status: 'in_progress',
    created_at: new Date(Date.now() - 5 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 2 * 86400000).toISOString(),
  },
  {
    id: '3',
    title: 'Dubai Civil Aviation Authority Meeting',
    description: 'Schedule meeting with DCAA regarding regulatory approval for pilot verification system.',
    author: 'Keiv',
    status: 'active',
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
  {
    id: '4',
    title: 'Fly Dubai Enterprise Deal',
    description: 'Negotiate enterprise subscription deal for pilot data pull API access.',
    author: 'Benjamin',
    status: 'completed',
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date(Date.now() - 3 * 86400000).toISOString(),
  },
];

export default function ProspectsPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [prospects, setProspects] = useState<Prospect[]>(mockProspects);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_progress' | 'completed' | 'on_hold'>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | 'Benjamin' | 'Karl' | 'Keiv'>('all');

  const filteredProspects = prospects.filter((prospect) => {
    if (statusFilter !== 'all' && prospect.status !== statusFilter) return false;
    if (authorFilter !== 'all' && prospect.author !== authorFilter) return false;
    return true;
  });

  const handleAddProspect = () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    const author = userProfile?.display_name || currentUser?.email?.split('@')[0] || 'Other';
    const newProspect: Prospect = {
      id: `p${Date.now()}`,
      title: newTitle,
      description: newDescription,
      author,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };
    setProspects((prev) => [newProspect, ...prev]);
    setNewTitle('');
    setNewDescription('');
  };

  const handleUpdateStatus = (id: string, status: Prospect['status']) => {
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p
      )
    );
  };

  const handleDelete = (id: string) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProspect(null);
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
          <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#1a1a1a' }}>Future Prospects</h1>
          <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Track potential partnerships, deals, and outreach opportunities</p>
        </div>

        {/* Filters */}
        <div style={{ display: 'flex', gap: 12, marginBottom: 24, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'active', 'in_progress', 'completed', 'on_hold'].map((status) => (
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
                {status.replace('_', ' ')}
              </button>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            {['all', 'Benjamin', 'Karl', 'Keiv'].map((author) => (
              <button
                key={author}
                onClick={() => setAuthorFilter(author as typeof authorFilter)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 20,
                  border: '1px solid',
                  borderColor: authorFilter === author ? '#ef4444' : '#e5e7eb',
                  background: authorFilter === author ? 'rgba(239,68,68,0.08)' : '#fff',
                  color: authorFilter === author ? '#ef4444' : '#6b7280',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                {author === 'all' ? 'All Authors' : author}
              </button>
            ))}
          </div>
        </div>

        {/* Add New Prospect */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Add New Prospect</h3>
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Prospect title (e.g., Contacting Airbus)"
              style={{ flex: 1, padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Description of the prospect..."
              rows={3}
              style={{ width: '100%', padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a', resize: 'vertical' }}
            />
          </div>
          <button onClick={handleAddProspect} disabled={!newTitle.trim() || !newDescription.trim()} style={{ padding: '8px 16px', background: newTitle.trim() && newDescription.trim() ? '#3b82f6' : '#e5e7eb', border: 'none', borderRadius: 8, color: newTitle.trim() && newDescription.trim() ? '#fff' : '#9ca3af', fontSize: 13, fontWeight: 600, cursor: newTitle.trim() && newDescription.trim() ? 'pointer' : 'not-allowed' }}>
            Add Prospect
          </button>
        </div>

        {/* Prospects List */}
        <div style={{ display: 'grid', gap: 16 }}>
          {filteredProspects.map((prospect) => (
            <div
              key={prospect.id}
              onClick={() => setSelectedProspect(prospect)}
              style={{
                background: '#fff',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: 20,
                cursor: 'pointer',
                transition: 'all 0.15s',
              }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = '#ef4444'; e.currentTarget.style.boxShadow = '0 4px 12px rgba(239,68,68,0.1)'; }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = '#e5e7eb'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: `${userColors[prospect.author] || userColors.Other}15`, color: userColors[prospect.author] || userColors.Other }}>
                      {prospect.author}
                    </span>
                    <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: prospect.status === 'active' ? 'rgba(16,185,129,0.1)' : prospect.status === 'in_progress' ? 'rgba(59,130,246,0.1)' : prospect.status === 'completed' ? 'rgba(107,114,128,0.1)' : 'rgba(245,158,11,0.1)', color: prospect.status === 'active' ? '#10b981' : prospect.status === 'in_progress' ? '#3b82f6' : prospect.status === 'completed' ? '#6b7280' : '#f59e0b' }}>
                      {prospect.status.replace('_', ' ')}
                    </span>
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{prospect.title}</h3>
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(prospect.updated_at).toLocaleDateString()}</div>
              </div>
              <p style={{ fontSize: 13, color: '#6b7280', margin: 0, lineHeight: 1.5 }}>{prospect.description}</p>
            </div>
          ))}
          {filteredProspects.length === 0 && (
            <div style={{ padding: 40, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}>No prospects match this filter</div>
          )}
        </div>
      </main>

      {/* Prospect Detail Modal */}
      {selectedProspect && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedProspect(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: `${userColors[selectedProspect.author] || userColors.Other}15`, color: userColors[selectedProspect.author] || userColors.Other }}>
                    {selectedProspect.author}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: selectedProspect.status === 'active' ? 'rgba(16,185,129,0.1)' : selectedProspect.status === 'in_progress' ? 'rgba(59,130,246,0.1)' : selectedProspect.status === 'completed' ? 'rgba(107,114,128,0.1)' : 'rgba(245,158,11,0.1)', color: selectedProspect.status === 'active' ? '#10b981' : selectedProspect.status === 'in_progress' ? '#3b82f6' : selectedProspect.status === 'completed' ? '#6b7280' : '#f59e0b' }}>
                    {selectedProspect.status.replace('_', ' ')}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{selectedProspect.title}</h2>
              </div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>
                <div>Created: {new Date(selectedProspect.created_at).toLocaleDateString()}</div>
                <div>Updated: {new Date(selectedProspect.updated_at).toLocaleDateString()}</div>
              </div>
            </div>

            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
              {selectedProspect.description}
            </div>

            {/* Status Actions */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
              {selectedProspect.status !== 'active' && (
                <button onClick={() => handleUpdateStatus(selectedProspect.id, 'active')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Set Active</button>
              )}
              {selectedProspect.status !== 'in_progress' && (
                <button onClick={() => handleUpdateStatus(selectedProspect.id, 'in_progress')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Set In Progress</button>
              )}
              {selectedProspect.status !== 'completed' && (
                <button onClick={() => handleUpdateStatus(selectedProspect.id, 'completed')} style={{ padding: '6px 12px', background: '#10b981', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Mark Complete</button>
              )}
              {selectedProspect.status !== 'on_hold' && (
                <button onClick={() => handleUpdateStatus(selectedProspect.id, 'on_hold')} style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}>Put On Hold</button>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button onClick={() => handleDelete(selectedProspect.id)} style={{ flex: 1, padding: 10, background: '#ef4444', border: 'none', borderRadius: 8, color: '#fff', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Delete</button>
              <button onClick={() => setSelectedProspect(null)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
