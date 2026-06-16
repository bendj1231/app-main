import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { uploadProfileImage, type CloudinaryUploadResult } from '@/src/lib/cloudinaryClient';
import { logAuditAction } from '@/src/lib/auditLog';

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
  const [activeTab, setActiveTab] = useState<'ben' | 'karl' | 'keiv'>('ben');

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
      const { data, error } = await supabase
        .from('employee_objectives')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setObjectives(data || []);
    } catch (err) {
      console.error('Error fetching board data:', err);
    } finally {
      setLoading(false);
    }
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
    return objectives.filter((o) => {
      const assigneeLower = o.assignee?.toLowerCase() || '';
      return assigneeLower.includes(assignee);
    });
  };

  const benObjectives = getTabObjectives('ben');
  const karlObjectives = getTabObjectives('karl');
  const keivObjectives = getTabObjectives('keiv');

  const getTabStats = (objs: any[]) => {
    const completed = objs.filter((o) => o.status === 'completed').length;
    const todo = objs.filter((o) => o.status !== 'completed').length;
    return { completed, todo };
  };

  const benStats = getTabStats(benObjectives);
  const karlStats = getTabStats(karlObjectives);
  const keivStats = getTabStats(keivObjectives);

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
              Company Planning Board
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Accomplishments · Objectives · Future Prospects
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <button
              onClick={() => navigate('/admin/meetings')}
              style={{
                position: 'relative',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                fontSize: 20,
                padding: 4,
                color: '#6b7280',
              }}
              title="Meetings & Notifications"
            >
              🔔
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
                3
              </span>
            </button>
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
              {/* Tab Navigation */}
              <div style={{ display: 'flex', gap: 4, marginBottom: 24, borderBottom: '1px solid #e5e7eb', paddingBottom: 16 }}>
                {[
                  { key: 'ben', label: 'Ben', stats: benStats },
                  { key: 'karl', label: 'Karl', stats: karlStats },
                  { key: 'keiv', label: 'Keiv', stats: keivStats },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => setActiveTab(tab.key as 'ben' | 'karl' | 'keiv')}
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
                    {/* Stacked count - todo above, completed below */}
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', lineHeight: 1, gap: 2 }}>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#ef4444' }}>{tab.stats.todo}</span>
                      <span style={{ fontSize: 10, fontWeight: 700, color: '#9ca3af' }}>{tab.stats.completed}</span>
                    </div>
                  </button>
                ))}
              </div>

              {/* Objectives for selected tab */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {activeTab === 'ben' && renderPersonObjectives(benObjectives)}
                {activeTab === 'karl' && renderPersonObjectives(karlObjectives)}
                {activeTab === 'keiv' && renderPersonObjectives(keivObjectives)}
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
    </div>
  );
}
