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

export default function EnterpriseManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [enterprises, setEnterprises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchEnterprises();
  }, [currentUser, isAdmin]);

  const fetchEnterprises = async () => {
    try {
      const { data, error } = await supabase
        .from('enterprise_profiles')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setEnterprises(data || []);
    } catch (err) {
      console.error('Error fetching enterprises:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnterprises = enterprises.filter((ent) => {
    return (ent.company_name || '').toLowerCase().includes(searchTerm.toLowerCase());
  });

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
              Enterprise Accounts
            </h1>
            <p style={{ fontSize: 11, color: '#9ca3af', margin: '2px 0 0', letterSpacing: '0.03em' }}>
              Manage airline and corporate partner accounts
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
              {enterprises.length} Enterprises
            </div>
          </div>
        </header>

        {/* Content body */}
        <div style={{ padding: '28px 32px 40px' }}>
          {/* Search */}
          <div style={{ marginBottom: 24 }}>
            <input
              type="text"
              placeholder="Search enterprises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{
                padding: '8px 14px',
                borderRadius: 20,
                border: '1px solid #e5e7eb',
                background: '#fff',
                color: '#1a1a1a',
                fontSize: 13,
                fontWeight: 500,
                minWidth: 300,
              }}
            />
          </div>

          {/* Enterprise list */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: 40, color: '#6b7280' }}>Loading...</div>
          ) : filteredEnterprises.length === 0 ? (
            <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
              <div style={{ fontSize: 48, marginBottom: 16 }}>🏢</div>
              <div style={{ fontSize: 16, color: '#6b7280', marginBottom: 8 }}>No enterprises found</div>
              <div style={{ fontSize: 13, color: '#9ca3af' }}>Try adjusting your search</div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {filteredEnterprises.map((ent) => (
                <div
                  key={ent.id}
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
                        background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 18,
                      }}
                    >
                      🏢
                    </div>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                        {ent.company_name || 'Unnamed Enterprise'}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280' }}>{ent.industry || 'Aviation'}</div>
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
                      Active
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
