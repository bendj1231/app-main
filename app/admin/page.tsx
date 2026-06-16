import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';

const Background = ({ children }: { children: React.ReactNode }) => (
  <div
    style={{ minHeight: '100vh', position: 'relative', overflow: 'hidden', background: '#f8f9fa' }}
  >
    <div style={{ position: 'relative', zIndex: 1 }}>{children}</div>
  </div>
);

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const { currentUser, userProfile, login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [pwLoading, setPwLoading] = useState(false);
  const [error, setError] = useState('');

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const location = useLocation();
  const currentPath = location.pathname;

  const [stats, setStats] = useState({
    pilots: 0,
    enterprises: 0,
    verifications: 0,
    events: 0,
    loading: true,
  });

  const [dashboardData, setDashboardData] = useState({
    karlProfileId: '',
    karlInviteCode: '',
    pilotsReferred: 0,
    referralRevenue: 0,
    notifications: [] as {
      id: string;
      title: string;
      message: string;
      read: boolean;
      created_at: string;
      type: string;
    }[],
    recentMessages: [] as { id: string; sender: string; content: string; created_at: string }[],
    supportTickets: 0,
  });

  const [showNotifications, setShowNotifications] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (!currentUser || !isAdmin) return;

    const fetchStats = async () => {
      try {
        // Get current admin's profile
        const { data: adminProfile } = await supabase
          .from('profiles')
          .select('id, referral_code, display_name')
          .eq('id', currentUser?.id)
          .single();

        const adminProfileId = adminProfile?.id || '';
        const adminInviteCode = adminProfile?.referral_code || '';

        // Count pilots referred by this admin
        const { count: pilotsReferred } = await supabase
          .from('referrals')
          .select('id', { count: 'exact', head: true })
          .eq('referrer_profile_id', adminProfileId)
          .eq('status', 'credited');

        // Calculate referral revenue (assuming $50 per referred pilot who subscribed)
        // TODO: Query actual subscription payments table when available
        const referralRevenue = (pilotsReferred || 0) * 50;

        // General platform stats
        const [{ count: pilots }, { count: enterprises }, { data: notifications }] =
          await Promise.all([
            supabase.from('profiles').select('*', { count: 'exact', head: true }),
            supabase.from('enterprise_profiles').select('*', { count: 'exact', head: true }),
            supabase
              .from('admin_notifications')
              .select('*')
              .eq('admin_id', adminProfileId)
              .order('created_at', { ascending: false })
              .limit(10),
          ]);

        setStats({
          pilots: pilots || 0,
          enterprises: enterprises || 0,
          verifications: 0,
          events: 0,
          loading: false,
        });

        setDashboardData((prev) => ({
          ...prev,
          karlProfileId: adminProfileId,
          karlInviteCode: adminInviteCode,
          pilotsReferred: pilotsReferred || 0,
          referralRevenue,
          notifications:
            (notifications as {
              id: string;
              title: string;
              message: string;
              read: boolean;
              created_at: string;
              type: string;
            }[]) || [],
        }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats((s) => ({ ...s, loading: false }));
      }
    };

    fetchStats();

    // Real-time subscriptions
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        fetchStats();
      })
      .subscribe();

    const enterprisesSubscription = supabase
      .channel('enterprises-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'enterprise_profiles' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    const referralsSubscription = supabase
      .channel('referrals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => {
        fetchStats();
      })
      .subscribe();

    const notificationsSubscription = supabase
      .channel('notifications-changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_notifications' },
        () => {
          fetchStats();
        }
      )
      .subscribe();

    return () => {
      profilesSubscription.unsubscribe();
      enterprisesSubscription.unsubscribe();
      referralsSubscription.unsubscribe();
      notificationsSubscription.unsubscribe();
    };
  }, [currentUser, isAdmin]);

  const unreadNotifications = dashboardData.notifications.filter((n) => !n.read);

  const markNotificationRead = async (id: string) => {
    try {
      await supabase.from('admin_notifications').update({ read: true }).eq('id', id);

      setDashboardData((prev) => ({
        ...prev,
        notifications: prev.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)),
      }));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  const _createNotification = async (
    title: string,
    message: string,
    type: 'info' | 'success' | 'warning' | 'error' = 'info'
  ) => {
    if (!currentUser?.id) return;
    try {
      await supabase.from('admin_notifications').insert({
        admin_id: currentUser.id,
        title,
        message,
        type,
      });
    } catch (err) {
      console.error('Error creating notification:', err);
    }
  };

  const handlePasswordLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) return;
    setPwLoading(true);
    setError('');
    try {
      await login(email.trim(), password);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setPwLoading(false);
    }
  };

  // ─── Login screen ──────────────────────────────────────────
  if (!currentUser) {
    return (
      <Background>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: 24,
          }}
        >
          <div style={{ width: '100%', maxWidth: 380 }}>
            {/* Header */}
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <div style={{ fontSize: 28, fontWeight: 800, marginBottom: 6 }}>
                <span style={{ color: '#ef4444' }}>Admin</span>
                <span style={{ color: '#1a1a1a' }}> Portal</span>
              </div>
              <p style={{ color: '#6b7280', fontSize: 13, margin: 0 }}>
                Restricted access — authorized personnel only
              </p>
            </div>

            {/* Card */}
            <div
              style={{
                background: '#ffffff',
                borderRadius: 16,
                padding: '28px 24px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1), 0 2px 4px -1px rgba(0,0,0,0.06)',
              }}
            >
              <style>{`
              @keyframes fadeIn {
                from { opacity: 0; transform: translateY(4px); }
                to { opacity: 1; transform: translateY(0); }
              }
            `}</style>

              {error && (
                <div
                  style={{
                    background: '#fef2f2',
                    border: '1px solid #fecaca',
                    borderRadius: 6,
                    padding: '10px 14px',
                    marginBottom: 16,
                    color: '#dc2626',
                    fontSize: 13,
                  }}
                >
                  {error}
                </div>
              )}

              {step === 1 ? (
                /* ─── STEP 1: Email ───────────────────────────── */
                <div style={{ animation: 'fadeIn 0.3s ease' }}>
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'rgba(0,0,0,0.85)',
                        marginBottom: 6,
                      }}
                    >
                      Admin Email
                    </label>
                    <input
                      type="text"
                      inputMode="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="admin@pilotrecognition.com"
                      autoComplete="off"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && email.trim()) setStep(2);
                      }}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        color: '#1a1a1a',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      if (email.trim()) setStep(2);
                    }}
                    disabled={!email.trim()}
                    style={{
                      width: '100%',
                      padding: '11px',
                      background: !email.trim() ? '#fca5a5' : '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: !email.trim() ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s',
                      marginTop: 14,
                    }}
                  >
                    Continue →
                  </button>
                </div>
              ) : (
                /* ─── STEP 2: Password ────────────────────────── */
                <form
                  onSubmit={handlePasswordLogin}
                  style={{
                    animation: 'fadeIn 0.3s ease',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 14,
                  }}
                >
                  <div>
                    <label
                      style={{
                        display: 'block',
                        fontSize: 13,
                        fontWeight: 600,
                        color: 'rgba(0,0,0,0.85)',
                        marginBottom: 6,
                      }}
                    >
                      Password
                    </label>
                    <input
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      autoComplete="off"
                      autoFocus
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #d1d5db',
                        borderRadius: 6,
                        fontSize: 14,
                        color: '#1a1a1a',
                        background: '#ffffff',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={pwLoading || !password}
                    style={{
                      width: '100%',
                      padding: '11px',
                      background: pwLoading || !password ? '#fca5a5' : '#dc2626',
                      color: '#fff',
                      border: 'none',
                      borderRadius: 6,
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: pwLoading || !password ? 'not-allowed' : 'pointer',
                      transition: 'background 0.15s',
                      marginTop: 4,
                    }}
                  >
                    {pwLoading ? 'Signing in…' : 'Sign In →'}
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setStep(1);
                      setPassword('');
                    }}
                    style={{
                      background: 'none',
                      border: 'none',
                      color: 'rgba(0,0,0,0.4)',
                      fontSize: 12,
                      cursor: 'pointer',
                      padding: 0,
                      textAlign: 'center',
                      marginTop: 4,
                    }}
                  >
                    ← Back to email
                  </button>
                </form>
              )}
            </div>

            <button
              onClick={() => navigate('/')}
              style={{
                marginTop: 24,
                background: 'none',
                border: 'none',
                color: '#9ca3af',
                fontSize: 13,
                cursor: 'pointer',
                display: 'block',
                width: '100%',
                textAlign: 'center',
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </Background>
    );
  }

  // ─── Access denied ─────────────────────────────────────────
  if (!isAdmin) {
    return (
      <Background>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            padding: 24,
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>🚫</div>
            <h1 style={{ fontSize: 24, fontWeight: 800, color: '#ef4444', margin: '0 0 8px' }}>
              Access Denied
            </h1>
            <p style={{ color: '#6b7280', fontSize: 14, marginBottom: 24 }}>
              You do not have permission to view this page.
            </p>
            <button
              onClick={() => navigate('/')}
              style={{
                padding: '10px 20px',
                background: '#e5e7eb',
                border: '1px solid #d1d5db',
                borderRadius: 6,
                color: '#1a1a1a',
                fontSize: 14,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              ← Back to Home
            </button>
          </div>
        </div>
      </Background>
    );
  }

  // ─── Dashboard (admin only) ────────────────────────────────
  const SIDEBAR_WIDTH = 260;

  const sidebarNav = [
    { label: 'Dashboard', path: '/admin', icon: '◆' },
    { label: 'Employee Objectives', path: '/admin/objectives', icon: '◈' },
    { label: 'Email & Contacts', path: '/admin/emails', icon: '◉' },
    { label: 'Messages', path: '/admin/messages', icon: '◈' },
    {
      label: 'Support Inbox',
      path: '/admin/support',
      icon: '◉',
      badge: dashboardData.supportTickets,
    },
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

  const quickActions = [
    {
      label: 'Approve Verification',
      desc: 'Review pending pilot docs',
      path: '/admin/verification',
      color: '#f59e0b',
    },
    {
      label: 'Add Enterprise',
      desc: 'Onboard new airline partner',
      path: '/admin/enterprises',
      color: '#3b82f6',
    },
    {
      label: 'Create Event',
      desc: 'Schedule webinar or session',
      path: '/admin/events',
      color: '#10b981',
    },
    {
      label: 'Export Data',
      desc: 'Download pilot database CSV',
      path: '/admin/settings',
      color: '#8b5cf6',
    },
  ];

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
      {/* ─── Sidebar ─────────────────────────────────────── */}
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
          <div
            style={{
              fontSize: 20,
              fontWeight: 800,
              display: 'flex',
              alignItems: 'center',
              gap: 10,
            }}
          >
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
        <nav
          style={{ flex: 1, padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 2 }}
        >
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

        {/* Bottom: user + back */}
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
              {(
                (userProfile?.display_name ||
                  userProfile?.email ||
                  currentUser.email ||
                  '?') as string
              )
                .charAt(0)
                .toUpperCase()}
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
                {userProfile?.display_name || userProfile?.email || currentUser.email}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: '#10b981',
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em',
                }}
              >
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

      {/* ─── Main content ────────────────────────────────── */}
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
            padding: '0 16px',
            position: 'sticky',
            top: 0,
            zIndex: 40,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                display: isMobile ? 'flex' : 'none',
                flexDirection: 'column',
                gap: 4,
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                padding: 4,
              }}
            >
              <span style={{ width: 20, height: 2, background: '#1a1a1a', borderRadius: 1 }} />
              <span style={{ width: 20, height: 2, background: '#1a1a1a', borderRadius: 1 }} />
              <span style={{ width: 20, height: 2, background: '#1a1a1a', borderRadius: 1 }} />
            </button>
            <div>
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a' }}>
                Dashboard
              </h1>
              <p
                style={{
                  fontSize: 11,
                  color: '#9ca3af',
                  margin: '2px 0 0',
                  letterSpacing: '0.03em',
                }}
              >
                {new Date().toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            {/* Notification Bell */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                style={{
                  position: 'relative',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: 20,
                  padding: 4,
                  color: '#6b7280',
                }}
                title="Notifications"
              >
                🔔
                {unreadNotifications.length > 0 && (
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
                    {unreadNotifications.length}
                  </span>
                )}
              </button>

              {/* Notification Dropdown */}
              {showNotifications && (
                <div
                  style={{
                    position: 'absolute',
                    top: 40,
                    right: -10,
                    width: 320,
                    background: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    boxShadow: '0 10px 40px rgba(0,0,0,0.12)',
                    zIndex: 100,
                    padding: '12px 0',
                    maxHeight: 400,
                    overflowY: 'auto',
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    style={{
                      padding: '0 16px 8px',
                      fontSize: 12,
                      fontWeight: 700,
                      color: '#9ca3af',
                      textTransform: 'uppercase',
                      letterSpacing: '0.05em',
                    }}
                  >
                    Notifications
                  </div>
                  {dashboardData.notifications.length === 0 ? (
                    <div
                      style={{ padding: 20, textAlign: 'center', color: '#9ca3af', fontSize: 13 }}
                    >
                      No new notifications
                    </div>
                  ) : (
                    dashboardData.notifications.map((n) => {
                      const typeColors = {
                        info: '#3b82f6',
                        success: '#10b981',
                        warning: '#f59e0b',
                        error: '#ef4444',
                      };
                      const bgColor = n.read ? '#f9fafb' : '#fff';
                      return (
                        <button
                          key={n.id}
                          onClick={() => {
                            markNotificationRead(n.id);
                          }}
                          style={{
                            width: '100%',
                            padding: '12px 16px',
                            background: bgColor,
                            border: 'none',
                            borderBottom: '1px solid #f3f4f6',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: 4,
                            transition: 'background 0.15s',
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#f3f4f6';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = bgColor;
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <span
                              style={{
                                width: 8,
                                height: 8,
                                borderRadius: '50%',
                                background:
                                  typeColors[n.type as keyof typeof typeColors] || '#6b7280',
                              }}
                            />
                            <div
                              style={{
                                fontSize: 12,
                                fontWeight: 600,
                                color: n.read ? '#9ca3af' : '#1a1a1a',
                              }}
                            >
                              {n.title}
                            </div>
                          </div>
                          <div style={{ fontSize: 11, color: '#6b7280', marginLeft: 16 }}>
                            {n.message}
                          </div>
                          <div style={{ fontSize: 10, color: '#9ca3af', marginLeft: 16 }}>
                            {new Date(n.created_at).toLocaleString()}
                          </div>
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Profile Avatar */}
            <div
              style={{
                width: 34,
                height: 34,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #ef4444, #b91c1c)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 13,
                fontWeight: 700,
                color: '#fff',
                cursor: 'pointer',
              }}
              onClick={() => navigate('/admin/settings')}
              title="Profile Settings"
            >
              {(
                (userProfile?.display_name ||
                  userProfile?.email ||
                  currentUser.email ||
                  '?') as string
              )
                .charAt(0)
                .toUpperCase()}
            </div>

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
        <div style={{ padding: isMobile ? '20px 16px 40px' : '28px 32px 40px' }}>
          {/* Stats grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: isMobile ? '1fr' : 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
              marginBottom: 28,
            }}
          >
            {[
              {
                label: 'Your Invite Code',
                value: dashboardData.karlInviteCode || 'Loading...',
                color: '#1a1a1a',
                sub: 'Share with partners',
                copy: true,
              },
              {
                label: 'Pilots Referred',
                value: dashboardData.pilotsReferred,
                color: '#3b82f6',
                sub: 'Signed up via you',
              },
              {
                label: 'Referral Revenue',
                value: `$${dashboardData.referralRevenue}`,
                color: '#10b981',
                sub: 'From subscriptions',
              },
              {
                label: 'Total Pilots',
                value: stats.loading ? '…' : stats.pilots,
                color: '#3b82f6',
                sub: 'Platform members',
              },
              {
                label: 'Enterprises',
                value: stats.loading ? '…' : stats.enterprises,
                color: '#8b5cf6',
                sub: 'Airline partners',
              },
              {
                label: 'Support Tickets',
                value: dashboardData.supportTickets,
                color: '#ef4444',
                sub: 'Need attention',
                link: '/admin/support',
              },
            ].map((stat) => (
              <div
                key={stat.label}
                style={{
                  background: '#f9fafb',
                  border: '1px solid #e5e7eb',
                  borderRadius: 12,
                  padding: '20px',
                  transition: 'border-color 0.2s',
                  cursor: stat.link ? 'pointer' : 'default',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#d1d5db';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = '#e5e7eb';
                }}
                onClick={() => {
                  if (stat.link) navigate(stat.link);
                }}
              >
                <div
                  style={{
                    fontSize: 11,
                    fontWeight: 600,
                    color: '#9ca3af',
                    textTransform: 'uppercase',
                    letterSpacing: '0.06em',
                    marginBottom: 8,
                  }}
                >
                  {stat.label}
                </div>
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'baseline',
                    justifyContent: 'space-between',
                  }}
                >
                  <div style={{ fontSize: 22, fontWeight: 800, color: stat.color }}>
                    {stat.value}
                  </div>
                  {stat.copy && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        navigator.clipboard.writeText(dashboardData.karlInviteCode);
                      }}
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#3b82f6',
                        fontSize: 11,
                        cursor: 'pointer',
                        fontWeight: 600,
                      }}
                    >
                      Copy
                    </button>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>{stat.sub}</div>
              </div>
            ))}
          </div>

          {/* Three-column layout */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px 280px', gap: 20 }}>
            {/* Left: Activity + Messages tabs */}
            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                  Recent Activity
                </h3>
                <span style={{ fontSize: 11, color: '#9ca3af' }}>Last 24 hours</span>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {[
                  {
                    action: 'New pilot signup',
                    detail: 'benjamintigerbowler@gmail.com',
                    time: '2m ago',
                    dot: '#3b82f6',
                  },
                  {
                    action: 'Verification submitted',
                    detail: 'CAAP License + Medical',
                    time: '15m ago',
                    dot: '#f59e0b',
                  },
                  {
                    action: 'Enterprise onboarded',
                    detail: 'Cebu Pacific Air',
                    time: '1h ago',
                    dot: '#10b981',
                  },
                  {
                    action: 'Profile updated',
                    detail: 'Flight hours uploaded',
                    time: '3h ago',
                    dot: '#8b5cf6',
                  },
                  {
                    action: 'System check',
                    detail: 'All services operational',
                    time: '5h ago',
                    dot: '#64748b',
                  },
                ].map((item, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12 }}>
                    <div
                      style={{
                        width: 8,
                        height: 8,
                        borderRadius: '50%',
                        background: item.dot,
                        marginTop: 5,
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, color: '#374151' }}>
                        {item.action}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                        {item.detail}
                      </div>
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                      {item.time}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Middle: Recent Messages */}
            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '20px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: 16,
                }}
              >
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: 0 }}>
                  Messages
                </h3>
                <button
                  onClick={() => navigate('/admin/messages')}
                  style={{
                    fontSize: 11,
                    color: '#3b82f6',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontWeight: 600,
                  }}
                >
                  View All
                </button>
              </div>
              {dashboardData.recentMessages.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: 13 }}>
                  No recent messages
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {dashboardData.recentMessages.map((msg) => (
                    <div
                      key={msg.id}
                      style={{
                        padding: 10,
                        background: '#fff',
                        borderRadius: 8,
                        border: '1px solid #e5e7eb',
                      }}
                    >
                      <div style={{ fontSize: 11, fontWeight: 600, color: '#1a1a1a' }}>
                        {msg.sender}
                      </div>
                      <div
                        style={{
                          fontSize: 11,
                          color: '#6b7280',
                          marginTop: 2,
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {msg.content}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              <button
                onClick={() => navigate('/admin/messages')}
                style={{
                  width: '100%',
                  marginTop: 12,
                  padding: '8px',
                  background: '#1a1a1a',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 12,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Open Messenger
              </button>
            </div>

            {/* Right: quick actions */}
            <div
              style={{
                background: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: 12,
                padding: '20px',
              }}
            >
              <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
                Quick Actions
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {quickActions.map((action) => (
                  <button
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 12,
                      padding: '12px 14px',
                      background: '#f9fafb',
                      border: '1px solid #e5e7eb',
                      borderRadius: 8,
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#e5e7eb';
                      e.currentTarget.style.borderColor = '#d1d5db';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = '#f9fafb';
                      e.currentTarget.style.borderColor = '#e5e7eb';
                    }}
                  >
                    <div
                      style={{
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: `${action.color}15`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 14,
                        flexShrink: 0,
                        color: action.color,
                      }}
                    >
                      +
                    </div>
                    <div>
                      <div style={{ fontSize: 13, fontWeight: 600, color: '#1a1a1a' }}>
                        {action.label}
                      </div>
                      <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 1 }}>
                        {action.desc}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
