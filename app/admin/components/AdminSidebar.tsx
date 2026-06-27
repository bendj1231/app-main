import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const SIDEBAR_WIDTH = 260;

interface NavItem {
  label: string;
  path: string;
  icon: string;
  badge?: number;
}

interface NavCategory {
  label: string;
  items: NavItem[];
}

const navCategories: NavCategory[] = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', path: '/admin', icon: '◆' },
    ],
  },
  {
    label: 'Operations',
    items: [
      { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
      { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
      { label: 'Messages', path: '/admin/messages', icon: '◈' },
      { label: 'Support Inbox', path: '/admin/support', icon: '◉' },
      { label: 'Meetings', path: '/admin/meetings', icon: '▶', badge: 3 },
      { label: 'Planning Board', path: '/admin/planning', icon: '◐' },
      { label: 'AI Bot', path: '/admin/bot', icon: '◉' },
    ],
  },
  {
    label: 'Content',
    items: [
      { label: 'Blogs & Articles', path: '/admin/blogs', icon: '◉' },
      { label: 'Future Prospects', path: '/admin/prospects', icon: '◉' },
      { label: 'Event Management', path: '/admin/events', icon: '◈' },
    ],
  },
  {
    label: 'Revenue',
    items: [
      { label: 'Enterprise Accounts', path: '/admin/enterprises', icon: '◆' },
      { label: 'Invoice & Billing', path: '/admin/invoices', icon: '◈' },
    ],
  },
  {
    label: 'Pilots',
    items: [
      { label: 'Recognition+ Management', path: '/admin/verification', icon: '◈' },
      { label: 'APC Verifications', path: '/admin/apc-verifications', icon: '◆' },
      { label: 'Pilot Management', path: '/admin/pilots', icon: '◉' },
    ],
  },
  {
    label: 'System',
    items: [
      { label: 'System Settings', path: '/admin/settings', icon: '◉' },
    ],
  },
];

interface AdminSidebarProps {
  extraBadge?: Record<string, number>;
}

export default function AdminSidebar({ extraBadge = {} }: AdminSidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const [openCategories, setOpenCategories] = useState<Record<string, boolean>>(() => {
    // Auto-open category containing current path
    const open: Record<string, boolean> = {};
    navCategories.forEach((cat) => {
      if (cat.items.some((item) => item.path === currentPath)) {
        open[cat.label] = true;
      }
    });
    // Default open main categories
    open['Overview'] = true;
    open['Operations'] = true;
    return open;
  });

  const toggleCategory = (label: string) => {
    setOpenCategories((prev) => ({ ...prev, [label]: !prev[label] }));
  };

  return (
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
        height: '100vh',
        overflowY: 'auto',
      }}
    >
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px' }}>
        <div style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ color: '#ef4444', fontSize: 22 }}>◆</span>
          <span>
            Admin<span style={{ color: '#ef4444' }}>OS</span>
          </span>
        </div>
        <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4, letterSpacing: '0.05em' }}>
          PILOTRECOGNITION MANAGEMENT
        </div>
      </div>

      {/* Nav */}
      <nav style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 4 }}>
        {navCategories.map((category) => {
          const isOpen = openCategories[category.label] ?? false;
          const hasActive = category.items.some((item) => item.path === currentPath);
          return (
            <div key={category.label} style={{ marginBottom: 4 }}>
              <button
                onClick={() => toggleCategory(category.label)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 14px',
                  borderRadius: 8,
                  background: 'transparent',
                  border: 'none',
                  color: hasActive ? '#ef4444' : '#9ca3af',
                  fontSize: 11,
                  fontWeight: 700,
                  textTransform: 'uppercase',
                  letterSpacing: '0.08em',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>{category.label}</span>
                <span style={{ fontSize: 10, transition: 'transform 0.2s', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>
                  ▶
                </span>
              </button>
              {isOpen && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 1, paddingLeft: 4 }}>
                  {category.items.map((item) => {
                    const isActive = currentPath === item.path;
                    const badge = item.badge ?? extraBadge[item.path] ?? 0;
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
                        {badge > 0 && (
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
                            {badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* User */}
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
            <div
              style={{
                fontSize: 12,
                fontWeight: 600,
                color: '#1a1a1a',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
                whiteSpace: 'nowrap',
              }}
            >
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
  );
}
