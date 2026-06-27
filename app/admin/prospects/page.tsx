import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


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

  const [prospects, setProspects] = useState<Prospect[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProspect, setSelectedProspect] = useState<Prospect | null>(null);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newCompany, setNewCompany] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'in_progress' | 'completed' | 'on_hold'>('all');
  const [authorFilter, setAuthorFilter] = useState<'all' | string>('all');

  // LinkedIn lookup state
  const [linkedinOrgId, setLinkedinOrgId] = useState('');
  const [linkedinLoading, setLinkedinLoading] = useState(false);
  const [linkedinResult, setLinkedinResult] = useState<any>(null);

  const fetchProspects = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('prospects')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) {
      console.error('Error fetching prospects:', error);
    } else {
      setProspects(
        (data || []).map((row: any) => ({
          id: row.id,
          title: row.title,
          description: row.description,
          author: row.author,
          status: row.status,
          created_at: row.created_at,
          updated_at: row.updated_at,
        }))
      );
    }
    setLoading(false);
  };

  useEffect(() => {
    if (isAdmin) fetchProspects();
  }, [isAdmin]);

  const allAuthors = Array.from(new Set(prospects.map((p) => p.author))).sort();

  const filteredProspects = prospects.filter((prospect) => {
    if (statusFilter !== 'all' && prospect.status !== statusFilter) return false;
    if (authorFilter !== 'all' && prospect.author !== authorFilter) return false;
    return true;
  });

  const handleAddProspect = async () => {
    if (!newTitle.trim() || !newDescription.trim()) return;
    const author = userProfile?.display_name || currentUser?.email?.split('@')[0] || 'Other';
    const { data, error } = await supabase.from('prospects').insert({
      title: newTitle.trim(),
      description: newDescription.trim(),
      author,
      status: 'active',
      company_name: newCompany.trim() || null,
      created_by: currentUser?.id,
    }).select().single();

    if (error) {
      console.error('Error adding prospect:', error);
      alert('Failed to add prospect');
      return;
    }

    setProspects((prev) => [
      {
        id: data.id,
        title: data.title,
        description: data.description,
        author: data.author,
        status: data.status,
        created_at: data.created_at,
        updated_at: data.updated_at,
      },
      ...prev,
    ]);
    setNewTitle('');
    setNewDescription('');
    setNewCompany('');
  };

  const handleUpdateStatus = async (id: string, status: Prospect['status']) => {
    const { error } = await supabase.from('prospects').update({ status, updated_at: new Date().toISOString() }).eq('id', id);
    if (error) {
      console.error('Error updating prospect:', error);
      return;
    }
    setProspects((prev) => prev.map((p) => (p.id === id ? { ...p, status, updated_at: new Date().toISOString() } : p)));
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('prospects').delete().eq('id', id);
    if (error) {
      console.error('Error deleting prospect:', error);
      return;
    }
    setProspects((prev) => prev.filter((p) => p.id !== id));
    setSelectedProspect(null);
  };

  const lookupLinkedInCompany = async () => {
    if (!linkedinOrgId.trim()) return;
    setLinkedinLoading(true);
    setLinkedinResult(null);
    try {
      const res = await fetch(`https://api.linkedin.com/v2/organizations/${linkedinOrgId.trim()}`, {
        headers: { 'X-Restli-Protocol-Version': '2.0.0' },
      });
      // LinkedIn API requires OAuth, so this will likely fail in browser.
      // Fallback: show a message directing to use the MCP server or manual entry.
      setLinkedinResult({ note: 'LinkedIn API requires OAuth. Use the LinkedIn MCP server or enter company details manually.', orgId: linkedinOrgId.trim() });
    } catch {
      setLinkedinResult({ error: 'LinkedIn lookup failed. Enter company details manually.' });
    } finally {
      setLinkedinLoading(false);
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
            <h1 style={{ fontSize: 24, fontWeight: 800, margin: '0 0 6px', color: '#1a1a1a' }}>Future Prospects</h1>
            <p style={{ fontSize: 13, color: '#6b7280', margin: 0 }}>Track potential partnerships, deals, and outreach opportunities</p>
          </div>
          <AdminNotificationBell />
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
            {['all', ...allAuthors].map((author) => (
              <button
                key={author}
                onClick={() => setAuthorFilter(author)}
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
          <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
            <input
              type="text"
              value={newCompany}
              onChange={(e) => setNewCompany(e.target.value)}
              placeholder="Company name (optional)"
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

        {/* LinkedIn Lookup */}
        <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20, marginBottom: 24 }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>LinkedIn Company Lookup</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              type="text"
              value={linkedinOrgId}
              onChange={(e) => setLinkedinOrgId(e.target.value)}
              placeholder="LinkedIn Organization ID (numeric)"
              style={{ flex: 1, padding: '10px 12px', background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, color: '#1a1a1a' }}
            />
            <button
              onClick={lookupLinkedInCompany}
              disabled={linkedinLoading || !linkedinOrgId.trim()}
              style={{ padding: '10px 16px', background: linkedinLoading || !linkedinOrgId.trim() ? '#e5e7eb' : '#0a66c2', border: 'none', borderRadius: 8, color: linkedinLoading || !linkedinOrgId.trim() ? '#9ca3af' : '#fff', fontSize: 13, fontWeight: 600, cursor: linkedinLoading || !linkedinOrgId.trim() ? 'not-allowed' : 'pointer' }}
            >
              {linkedinLoading ? 'Looking up...' : 'Lookup'}
            </button>
          </div>
          {linkedinResult && (
            <div style={{ marginTop: 12, padding: 12, background: '#f9fafb', borderRadius: 8, fontSize: 13, color: linkedinResult.error ? '#ef4444' : '#6b7280' }}>
              {linkedinResult.note || linkedinResult.error}
            </div>
          )}
        </div>

        {/* Prospects List */}
        <div style={{ display: 'grid', gap: 16 }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading prospects...</div>
          ) : filteredProspects.map((prospect) => (
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
          {filteredProspects.length === 0 && !loading && (
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