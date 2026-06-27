import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/lib/shared/supabase';
import { uploadProfileImage, type CloudinaryUploadResult } from '@/lib/cloudinaryClient';
import { logAuditAction } from '@/lib/auditLog';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

const SIDEBAR_WIDTH = 260;


export default function PlanningBoardPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any | null>(null);
  const [uploadingScreenshot, setUploadingScreenshot] = useState(false);
  const [activeTab, setActiveTab] = useState<string>('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [newObjective, setNewObjective] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium' as 'low' | 'medium' | 'high',
    status: 'pending' as 'pending' | 'in_progress' | 'completed' | 'future',
    due_date: '',
    collaborators: '',
  });
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('cards');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editDraft, setEditDraft] = useState<any>(null);
  const [updating, setUpdating] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [teamMembers, setTeamMembers] = useState<string[]>([]);

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchBoardData();

    // Real-time subscription for employee_objectives
    const objectivesSubscription = supabase
      .channel('planning-objectives-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'employee_objectives' }, () => {
        fetchBoardData();
      })
      .subscribe();

    return () => {
      objectivesSubscription.unsubscribe();
    };
  }, [currentUser, isAdmin]);

  const fetchBoardData = async () => {
    try {
      const [{ data: objectivesData, error: objectivesError }, { data: profilesData, error: profilesError }] = await Promise.all([
        supabase.from('employee_objectives').select('*').order('created_at', { ascending: false }),
        supabase.from('profiles').select('display_name, full_name, email, role').not('email', 'is', null).limit(200),
      ]);

      if (objectivesError) throw objectivesError;
      setObjectives(objectivesData || []);

      // Build team member list from profiles + existing assignees
      const fromProfiles = (profilesData || [])
        .map((p: any) => p.display_name || p.full_name || p.email?.split('@')[0])
        .filter(Boolean);
      const fromObjectives = (objectivesData || [])
        .map((o: any) => o.assignee)
        .filter(Boolean);
      const allMembers = Array.from(new Set([...fromProfiles, ...fromObjectives]))
        .map((n) => String(n).trim())
        .sort((a, b) => a.toLowerCase().localeCompare(b.toLowerCase()));
      setTeamMembers(allMembers);

      // Default active tab if unset or no longer valid
      setActiveTab((prev) => {
        if (prev && allMembers.includes(prev)) return prev;
        return allMembers[0] || '';
      });
    } catch (err) {
      console.error('Error fetching board data:', err);
    } finally {
      setLoading(false);
    }
  };

  const createObjective = async () => {
    if (!newObjective.title.trim() || !currentUser) return;
    setCreating(true);
    try {
      const payload = {
        title: newObjective.title.trim(),
        description: newObjective.description.trim() || null,
        assignee: newObjective.assignee,
        priority: newObjective.priority,
        status: newObjective.status,
        due_date: newObjective.due_date ? new Date(newObjective.due_date).toISOString() : null,
        collaborators: newObjective.collaborators.trim() || null,
        employee_id: currentUser.id,
        created_by: currentUser.id,
      };
      const { data, error } = await supabase.from('employee_objectives').insert(payload).select().single();
      if (error) throw error;
      if (data) {
        setObjectives((prev) => [data, ...prev]);
        setShowCreateModal(false);
        setNewObjective({
          title: '',
          description: '',
          assignee: 'ben',
          priority: 'medium',
          status: 'pending',
          due_date: '',
          collaborators: '',
        });
      }
    } catch (err) {
      console.error('Error creating objective:', err);
      alert('Failed to create objective. Please try again.');
    } finally {
      setCreating(false);
    }
  };

  const updateObjective = async (id: string, updates: any) => {
    if (!currentUser) return;
    setUpdating(true);
    try {
      const { data, error } = await supabase
        .from('employee_objectives')
        .update({
          title: updates.title,
          description: updates.description,
          assignee: updates.assignee,
          priority: updates.priority,
          status: updates.status,
          due_date: updates.due_date ? new Date(updates.due_date).toISOString() : null,
          collaborators: updates.collaborators || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      if (data) {
        setObjectives((prev) => prev.map((o) => (o.id === id ? data : o)));
        setEditingId(null);
        setEditDraft(null);
      }
    } catch (err) {
      console.error('Error updating objective:', err);
      alert('Failed to update objective.');
    } finally {
      setUpdating(false);
    }
  };

  const deleteObjective = async (id: string) => {
    if (!currentUser) return;
    if (!window.confirm('Delete this objective?')) return;
    setDeletingId(id);
    try {
      const { error } = await supabase.from('employee_objectives').delete().eq('id', id);
      if (error) throw error;
      setObjectives((prev) => prev.filter((o) => o.id !== id));
      if (selectedItem?.id === id) setSelectedItem(null);
    } catch (err) {
      console.error('Error deleting objective:', err);
      alert('Failed to delete objective.');
    } finally {
      setDeletingId(null);
    }
  };

  const startEdit = (item: any) => {
    setEditingId(item.id);
    setEditDraft({ ...item });
  };

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || !e.target.files[0] || !selectedItem || !currentUser) return;

    const file = e.target.files[0];
    setUploadingScreenshot(true);

    const result: CloudinaryUploadResult = await uploadProfileImage(
      file,
      currentUser.id
    );

    setUploadingScreenshot(false);

    if (result.success && result.url) {
      const screenshots = selectedItem.screenshots || [];
      const updatedScreenshots = [...screenshots, result.url];
      
      // Update database
      await supabase
        .from('employee_objectives')
        .update({ screenshots: updatedScreenshots })
        .eq('id', selectedItem.id);

      // Log audit action
      await logAuditAction({
        actionType: 'upload',
        targetTable: 'employee_objectives',
        targetId: selectedItem.id,
        oldValues: { screenshots },
        newValues: { screenshots: updatedScreenshots },
        description: `Screenshot uploaded for objective: ${selectedItem.title}`,
      });
      
      setObjectives((prev) =>
        prev.map((o) =>
          o.id === selectedItem.id
            ? { ...o, screenshots: updatedScreenshots }
            : o
        )
      );
      setSelectedItem((prev) => (prev ? { ...prev, screenshots: updatedScreenshots } : null));
    } else {
      alert(`Upload failed: ${result.error}`);
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

  const accomplished = objectives.filter((o) => o.status === 'completed');
  const active = objectives.filter((o) => o.status === 'pending' || o.status === 'in_progress');
  const future = objectives.filter((o) => o.status === 'future' || o.status === 'idea');

  // Filter objectives by assignee for each tab
  const getTabObjectives = (assignee: string) => {
    const search = assignee.toLowerCase();
    return objectives.filter((o) => {
      const assigneeLower = o.assignee?.toLowerCase() || '';
      return assigneeLower.includes(search);
    });
  };

  const getTabStats = (objs: any[]) => {
    const completed = objs.filter((o) => o.status === 'completed').length;
    const todo = objs.filter((o) => o.status !== 'completed').length;
    return { completed, todo };
  };

  const tabData = teamMembers.map((member) => {
    const objs = getTabObjectives(member);
    return { key: member, label: member.charAt(0).toUpperCase() + member.slice(1), stats: getTabStats(objs), objectives: objs };
  });

  const renderPersonObjectives = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 16, color: '#6b7280' }}>No objectives assigned</div>
        </div>
      );
    }

    return items.map((item) => {
      const isCompleted = item.status === 'completed';
      const isInProgress = item.status === 'in_progress';
      const isTodo = !isCompleted && !isInProgress;
      const isJoint = item.collaborators && item.collaborators.trim().length > 0;

      let bgColor = '#f9fafb';
      let borderColor = '#e5e7eb';
      let textColor = '#1a1a1a';
      let opacity = 1;

      if (isJoint) {
        // Joint assignment - blue highlight
        bgColor = '#eff6ff';
        borderColor = '#3b82f6';
        textColor = '#1e40af';
      } else if (isCompleted) {
        bgColor = '#f3f4f6';
        borderColor = '#d1d5db';
        textColor = '#9ca3af';
        opacity = 0.6;
      } else if (isInProgress) {
        bgColor = '#f0fdf4';
        borderColor = '#22c55e';
        textColor = '#166534';
      } else if (isTodo) {
        bgColor = '#fef2f2';
        borderColor = '#ef4444';
        textColor = '#991b1b';
      }

      return (
        <div
          key={item.id}
          onClick={() => setSelectedItem(item)}
          style={{
            padding: '16px 20px',
            background: bgColor,
            borderRadius: 10,
            border: `2px solid ${borderColor}`,
            cursor: 'pointer',
            transition: 'all 0.15s',
            opacity,
          }}
          onMouseEnter={(e) => { if (!isCompleted) e.currentTarget.style.transform = 'translateX(4px)'; }}
          onMouseLeave={(e) => { if (!isCompleted) e.currentTarget.style.transform = 'translateX(0)'; }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12 }}>
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                {isCompleted && <span style={{ fontSize: 16 }}>✓</span>}
                {isInProgress && <span style={{ fontSize: 16 }}>●</span>}
                {isTodo && <span style={{ fontSize: 16 }}>○</span>}
                <div style={{ fontSize: 15, fontWeight: 600, color: textColor }}>{item.title}</div>
              </div>
              {item.description && (
                <div style={{ fontSize: 13, color: isCompleted ? '#9ca3af' : '#6b7280', marginTop: 6, lineHeight: 1.5 }}>
                  {item.description}
                </div>
              )}
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 10 }}>
                {item.due_date && (
                  <span style={{ fontSize: 11, color: isCompleted ? '#9ca3af' : '#6b7280' }}>
                    Due: {new Date(item.due_date).toLocaleDateString()}
                  </span>
                )}
                {item.collaborators && (
                  <span style={{ fontSize: 11, color: '#3b82f6', fontWeight: 500 }}>
                    + {item.collaborators}
                  </span>
                )}
              </div>
            </div>
            <span
              style={{
                fontSize: 10,
                fontWeight: 700,
                padding: '4px 10px',
                borderRadius: 20,
                background: item.priority === 'high' ? '#fef2f2' : item.priority === 'medium' ? '#fffbeb' : '#f0fdf4',
                color: item.priority === 'high' ? '#ef4444' : item.priority === 'medium' ? '#f59e0b' : '#10b981',
                textTransform: 'uppercase',
                whiteSpace: 'nowrap',
              }}
            >
              {item.priority}
            </span>
          </div>
        </div>
      );
    });
  };

  const renderEditableTable = (items: any[]) => {
    if (items.length === 0) {
      return (
        <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
          <div style={{ fontSize: 16, color: '#6b7280' }}>No objectives assigned</div>
        </div>
      );
    }

    const isEditing = (id: string) => editingId === id;

    const statusBadge = (status: string) => {
      const colors: Record<string, [string, string]> = {
        completed: ['#f3f4f6', '#9ca3af'],
        in_progress: ['#f0fdf4', '#166534'],
        pending: ['#fef2f2', '#991b1b'],
        future: ['#eff6ff', '#1e40af'],
      };
      const [bg, color] = colors[status] || ['#f9fafb', '#6b7280'];
      return (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: bg, color, textTransform: 'uppercase' }}>
          {status.replace('_', ' ')}
        </span>
      );
    };

    const priorityBadge = (priority: string) => {
      const colors: Record<string, [string, string]> = {
        high: ['#fef2f2', '#ef4444'],
        medium: ['#fffbeb', '#f59e0b'],
        low: ['#f0fdf4', '#10b981'],
      };
      const [bg, color] = colors[priority] || ['#f9fafb', '#6b7280'];
      return (
        <span style={{ fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 10, background: bg, color, textTransform: 'uppercase' }}>
          {priority}
        </span>
      );
    };

    return (
      <div style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
          <thead>
            <tr style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Title</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Assignee</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Status</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Priority</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Due</th>
              <th style={{ textAlign: 'left', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Collaborators</th>
              <th style={{ textAlign: 'right', padding: '10px 14px', fontWeight: 600, color: '#6b7280', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.03em' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid #f3f4f6', background: isEditing(item.id) ? '#fffbeb' : '#fff' }}>
                {/* Title */}
                <td style={{ padding: '8px 14px', maxWidth: 280 }}>
                  {isEditing(item.id) ? (
                    <input
                      type="text"
                      value={editDraft?.title || ''}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, title: e.target.value }))}
                      style={{ width: '100%', padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, outline: 'none' }}
                    />
                  ) : (
                    <div>
                      <div style={{ fontWeight: 600, color: '#1a1a1a' }}>{item.title}</div>
                      {item.description && <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{item.description}</div>}
                    </div>
                  )}
                </td>
                {/* Assignee */}
                <td style={{ padding: '8px 14px' }}>
                  {isEditing(item.id) ? (
                    <select
                      value={editDraft?.assignee || ''}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, assignee: e.target.value }))}
                      style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
                    >
                      <option value="">Select…</option>
                      {teamMembers.map((m) => (
                        <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                      ))}
                    </select>
                  ) : (
                    <span style={{ textTransform: 'capitalize', color: '#374151' }}>{item.assignee}</span>
                  )}
                </td>
                {/* Status */}
                <td style={{ padding: '8px 14px' }}>
                  {isEditing(item.id) ? (
                    <select
                      value={editDraft?.status || 'pending'}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, status: e.target.value }))}
                      style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
                    >
                      <option value="pending">Pending</option>
                      <option value="in_progress">In Progress</option>
                      <option value="completed">Completed</option>
                      <option value="future">Future</option>
                    </select>
                  ) : (
                    statusBadge(item.status)
                  )}
                </td>
                {/* Priority */}
                <td style={{ padding: '8px 14px' }}>
                  {isEditing(item.id) ? (
                    <select
                      value={editDraft?.priority || 'medium'}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, priority: e.target.value }))}
                      style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  ) : (
                    priorityBadge(item.priority)
                  )}
                </td>
                {/* Due Date */}
                <td style={{ padding: '8px 14px', whiteSpace: 'nowrap' }}>
                  {isEditing(item.id) ? (
                    <input
                      type="date"
                      value={editDraft?.due_date ? new Date(editDraft.due_date).toISOString().split('T')[0] : ''}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, due_date: e.target.value }))}
                      style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
                    />
                  ) : (
                    <span style={{ color: '#6b7280' }}>{item.due_date ? new Date(item.due_date).toLocaleDateString() : '—'}</span>
                  )}
                </td>
                {/* Collaborators */}
                <td style={{ padding: '8px 14px' }}>
                  {isEditing(item.id) ? (
                    <input
                      type="text"
                      value={editDraft?.collaborators || ''}
                      onChange={(e) => setEditDraft((p: any) => ({ ...p, collaborators: e.target.value }))}
                      placeholder="e.g. Karl, Keiv"
                      style={{ padding: '6px 8px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13, width: 120 }}
                    />
                  ) : (
                    <span style={{ color: '#6b7280' }}>{item.collaborators || '—'}</span>
                  )}
                </td>
                {/* Actions */}
                <td style={{ padding: '8px 14px', textAlign: 'right' }}>
                  {isEditing(item.id) ? (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => updateObjective(item.id, editDraft)}
                        disabled={updating}
                        style={{ padding: '4px 10px', background: '#22c55e', color: '#fff', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: updating ? 'not-allowed' : 'pointer' }}
                      >
                        {updating ? '…' : 'Save'}
                      </button>
                      <button
                        onClick={() => { setEditingId(null); setEditDraft(null); }}
                        style={{ padding: '4px 10px', background: '#f3f4f6', color: '#6b7280', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', gap: 6, justifyContent: 'flex-end' }}>
                      <button
                        onClick={() => startEdit(item)}
                        style={{ padding: '4px 10px', background: '#eff6ff', color: '#2563eb', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => deleteObjective(item.id)}
                        disabled={deletingId === item.id}
                        style={{ padding: '4px 10px', background: '#fef2f2', color: '#ef4444', border: 'none', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: deletingId === item.id ? 'not-allowed' : 'pointer' }}
                      >
                        {deletingId === item.id ? '…' : 'Delete'}
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

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
              Company Planning Board
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Accomplishments · Objectives · Future Prospects
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
                display: 'flex',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <span style={{ fontSize: 16 }}>+</span> New Objective
            </button>
            <AdminNotificationBell />
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
          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px 0', color: '#9ca3af' }}>Loading board data…</div>
          ) : (
            <>
              {/* Tab Navigation + View Toggle */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  {tabData.map((tab) => (
                    <button
                      key={tab.key}
                      onClick={() => setActiveTab(tab.key)}
                      style={{
                        padding: '10px 20px',
                        background: activeTab === tab.key ? 'rgba(239,68,68,0.08)' : 'transparent',
                        color: activeTab === tab.key ? '#ef4444' : '#6b7280',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 14,
                        fontWeight: activeTab === tab.key ? 600 : 500,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 8,
                      }}
                    >
                      {tab.label}
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: 2 }}>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>{tab.stats.todo}</span>
                        <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af' }}>{tab.stats.completed}</span>
                      </div>
                    </button>
                  ))}
                  {tabData.length === 0 && !loading && (
                    <div style={{ padding: '10px 20px', color: '#9ca3af', fontSize: 14 }}>No team members found</div>
                  )}
                </div>

                {/* View Mode Toggle */}
                <div style={{ display: 'flex', gap: 4, background: '#f3f4f6', borderRadius: 8, padding: 4 }}>
                  <button
                    onClick={() => setViewMode('cards')}
                    style={{
                      padding: '6px 12px',
                      background: viewMode === 'cards' ? '#fff' : 'transparent',
                      color: viewMode === 'cards' ? '#1a1a1a' : '#6b7280',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: viewMode === 'cards' ? 600 : 500,
                      cursor: 'pointer',
                      boxShadow: viewMode === 'cards' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Cards
                  </button>
                  <button
                    onClick={() => setViewMode('table')}
                    style={{
                      padding: '6px 12px',
                      background: viewMode === 'table' ? '#fff' : 'transparent',
                      color: viewMode === 'table' ? '#1a1a1a' : '#6b7280',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: viewMode === 'table' ? 600 : 500,
                      cursor: 'pointer',
                      boxShadow: viewMode === 'table' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none',
                    }}
                  >
                    Table
                  </button>
                </div>
              </div>

              {/* Objectives for selected tab */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {(() => {
                  const currentTab = tabData.find((t) => t.key === activeTab);
                  if (!currentTab) return <div style={{ textAlign: 'center', padding: 60, color: '#6b7280' }}>Select a team member to view objectives</div>;
                  return viewMode === 'cards'
                    ? renderPersonObjectives(currentTab.objectives)
                    : renderEditableTable(currentTab.objectives);
                })()}
              </div>
            </>
          )}
        </div>
      </main>

      {/* Item Detail Modal */}
      {selectedItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setSelectedItem(null)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 600, maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: selectedItem.priority === 'high' ? '#fef2f2' : selectedItem.priority === 'medium' ? '#fffbeb' : '#f0fdf4', color: selectedItem.priority === 'high' ? '#ef4444' : selectedItem.priority === 'medium' ? '#f59e0b' : '#10b981' }}>
                    {selectedItem.priority}
                  </span>
                  <span style={{ padding: '2px 8px', borderRadius: 10, fontSize: 10, fontWeight: 700, textTransform: 'uppercase', background: '#f3f4f6', color: '#6b7280' }}>
                    {selectedItem.status}
                  </span>
                </div>
                <h2 style={{ fontSize: 20, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>{selectedItem.title}</h2>
              </div>
            </div>

            {selectedItem.description && (
              <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20, fontSize: 14, color: '#374151', lineHeight: 1.7 }}>
                {selectedItem.description}
              </div>
            )}

            <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
              {selectedItem.assignee && (
                <span style={{ fontSize: 12, color: '#6b7280' }}>Assigned: {selectedItem.assignee}</span>
              )}
              {selectedItem.due_date && (
                <span style={{ fontSize: 12, color: '#6b7280' }}>Due: {new Date(selectedItem.due_date).toLocaleDateString()}</span>
              )}
            </div>

            {/* Screenshots Section */}
            <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: 16, marginBottom: 20 }}>
              <h3 style={{ fontSize: 14, fontWeight: 700, margin: '0 0 12px', color: '#1a1a1a' }}>Work Screenshots</h3>
              <label style={{ padding: '6px 12px', background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 6, color: '#6b7280', fontSize: 12, fontWeight: 600, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 4, marginBottom: 12 }}>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleScreenshotUpload}
                  disabled={uploadingScreenshot}
                  style={{ display: 'none' }}
                />
                {uploadingScreenshot ? 'Uploading...' : 'Upload Screenshot'}
              </label>
              {selectedItem.screenshots && selectedItem.screenshots.length > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                  {selectedItem.screenshots.map((url: string, idx: number) => (
                    <div key={idx} style={{ position: 'relative' }}>
                      <img src={url} alt={`Screenshot ${idx + 1}`} style={{ width: '100%', borderRadius: 6, border: '1px solid #e5e7eb' }} />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div style={{ marginTop: 20, display: 'flex', gap: 12 }}>
              <button onClick={() => setSelectedItem(null)} style={{ flex: 1, padding: 10, background: 'transparent', border: '1px solid #e5e7eb', borderRadius: 8, color: '#6b7280', fontSize: 14, fontWeight: 600, cursor: 'pointer' }}>Close</button>
            </div>
          </div>
        </div>
      )}

      {/* Create Objective Modal */}
      {showCreateModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 100 }} onClick={() => setShowCreateModal(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 28, width: '100%', maxWidth: 520, maxHeight: '90vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 20px', color: '#1a1a1a' }}>New Objective</h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Title */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Title *</label>
                <input
                  type="text"
                  value={newObjective.title}
                  onChange={(e) => setNewObjective((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Complete Veremark API integration"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>

              {/* Description */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Description</label>
                <textarea
                  value={newObjective.description}
                  onChange={(e) => setNewObjective((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Add details about this objective..."
                  rows={3}
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', resize: 'vertical', boxSizing: 'border-box', fontFamily: 'inherit' }}
                />
              </div>

              {/* Row: Assignee + Status */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Assignee</label>
                  {teamMembers.length > 0 ? (
                    <select
                      value={newObjective.assignee}
                      onChange={(e) => setNewObjective((p) => ({ ...p, assignee: e.target.value }))}
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' }}
                    >
                      <option value="">Select team member…</option>
                      {teamMembers.map((m) => (
                        <option key={m} value={m}>{m.charAt(0).toUpperCase() + m.slice(1)}</option>
                      ))}
                      <option value="__custom__">+ Add new…</option>
                    </select>
                  ) : (
                    <input
                      type="text"
                      value={newObjective.assignee}
                      onChange={(e) => setNewObjective((p) => ({ ...p, assignee: e.target.value.toLowerCase().trim() }))}
                      placeholder="e.g. ben"
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                    />
                  )}
                  {newObjective.assignee === '__custom__' && (
                    <input
                      type="text"
                      value={''}
                      onChange={(e) => setNewObjective((p) => ({ ...p, assignee: e.target.value.toLowerCase().trim() }))}
                      placeholder="Enter name…"
                      autoFocus
                      style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box', marginTop: 8 }}
                    />
                  )}
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Status</label>
                  <select
                    value={newObjective.status}
                    onChange={(e) => setNewObjective((p) => ({ ...p, status: e.target.value as any }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="future">Future / Idea</option>
                  </select>
                </div>
              </div>

              {/* Row: Priority + Due Date */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Priority</label>
                  <select
                    value={newObjective.priority}
                    onChange={(e) => setNewObjective((p) => ({ ...p, priority: e.target.value as any }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, background: '#fff', cursor: 'pointer' }}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Due Date</label>
                  <input
                    type="date"
                    value={newObjective.due_date}
                    onChange={(e) => setNewObjective((p) => ({ ...p, due_date: e.target.value }))}
                    style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                  />
                </div>
              </div>

              {/* Collaborators */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#374151', marginBottom: 6, display: 'block' }}>Collaborators</label>
                <input
                  type="text"
                  value={newObjective.collaborators}
                  onChange={(e) => setNewObjective((p) => ({ ...p, collaborators: e.target.value }))}
                  placeholder="e.g. Karl, Keiv"
                  style={{ width: '100%', padding: '10px 12px', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 14, outline: 'none', boxSizing: 'border-box' }}
                />
              </div>
            </div>

            {/* Actions */}
            <div style={{ marginTop: 24, display: 'flex', gap: 12 }}>
              <button
                onClick={createObjective}
                disabled={creating || !newObjective.title.trim()}
                style={{
                  flex: 1,
                  padding: 12,
                  background: creating || !newObjective.title.trim() ? '#fca5a5' : '#ef4444',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 8,
                  fontSize: 14,
                  fontWeight: 600,
                  cursor: creating || !newObjective.title.trim() ? 'not-allowed' : 'pointer',
                }}
              >
                {creating ? 'Creating…' : 'Create Objective'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                style={{
                  flex: 1,
                  padding: 12,
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
            </div>
          </div>
        </div>
      )}
    </div>
  );
}