import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from './components/AdminSidebar';
import AdminNotificationBell from './components/AdminNotificationBell';
import { cachedFetch, invalidateCache } from './lib/cache';

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

  const isAdmin = (() => {
    if (userProfile?.role === 'super_admin' || userProfile?.role === 'admin') return true;
    // Fallback: check admin fallback login stored in localStorage
    try {
      const fallback = JSON.parse(localStorage.getItem('adminFallbackLogin') || '{}');
      if (fallback.role === 'super_admin' || fallback.role === 'admin') return true;
    } catch { /* ignore */ }
    return false;
  })();

  const [stats, setStats] = useState({
    pilots: 0,
    enterprises: 0,
    verifications: 0,
    events: 0,
    loading: true,
  });

  const [overviewCounts, setOverviewCounts] = useState({
    blogs: 0,
    prospects: 0,
    objectives: 0,
    upcomingEvents: 0,
    adminUsers: 0,
    unreadMessages: 0,
    emailCampaigns: 0,
    aiConversations: 0,
    planningTasks: 0,
  });

  const [dodoStats, setDodoStats] = useState({
    totalRevenue: 0,
    revenueThisMonth: 0,
    revenueLastMonth: 0,
    mrr: 0,
    activeSubscriptions: 0,
    totalPayments: 0,
    failedPayments: 0,
    customers: 0,
    products: 0,
    loading: true,
    source: 'supabase_fallback' as string,
  });

  const [inviteCodes, setInviteCodes] = useState<
    { code: string; used_by: string | null; created_at: string; status: string }[]
  >([]);
  const [inviteCodeInput, setInviteCodeInput] = useState('');
  const [showInviteManager, setShowInviteManager] = useState(false);

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
      source: string;
    }[],
    recentMessages: [] as { id: string; sender: string; content: string; created_at: string }[],
    supportTickets: 0,
    pendingVerifications: 0,
  });

  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const hasFetchedRef = useRef(false);

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    if (hasFetchedRef.current) return;
    hasFetchedRef.current = true;

    const fetchStats = async () => {
      console.log('[AdminDashboard] fetchStats() starting...');
      try {
        // Get current admin's profile (wrapped — profiles table sometimes 500s)
        let adminProfileId = '';
        let adminInviteCode = '';
        try {
          console.log('[AdminDashboard] Calling supabase.from(profiles).select() for admin profile...');
          const { data: adminProfile } = await supabase
            .from('profiles')
            .select('id, referral_code, display_name')
            .eq('id', currentUser?.id)
            .single();
          adminProfileId = adminProfile?.id || '';
          adminInviteCode = adminProfile?.referral_code || '';
          console.log('[AdminDashboard] adminProfile:', adminProfile);
        } catch { console.log('[AdminDashboard] profiles query failed (timeout)'); }

        // Count pilots referred by this admin (isolated catch)
        let pilotsReferred = 0;
        if (adminProfileId) {
          try {
            console.log('[AdminDashboard] Calling supabase.from(referrals).select(count)...');
            const { count, error } = await supabase
              .from('referrals')
              .select('id', { count: 'exact', head: true })
              .eq('referrer_profile_id', adminProfileId)
              .eq('status', 'credited');
            pilotsReferred = count || 0;
            console.log('[AdminDashboard] referrals count:', count, 'error:', error?.message);
          } catch (e) { console.log('[AdminDashboard] referrals query failed:', (e as Error).message); }
        } else {
          console.log('[AdminDashboard] Skipping referrals query — no adminProfileId');
        }

        // Calculate referral revenue (assuming $50 per referred pilot who subscribed)
        const referralRevenue = pilotsReferred * 50;

        // Fetch each stat independently so one missing table doesn't break everything
        // Wrapped with 2-minute localStorage cache to reduce Supabase I/O
        let pilots = 0;
        try {
          pilots = await cachedFetch('count_profiles', async () => {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] profiles count query failed'); }

        let enterprises = 0;
        try {
          enterprises = await cachedFetch('count_enterprise_profiles', async () => {
            const { count } = await supabase.from('enterprise_profiles').select('*', { count: 'exact', head: true });
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] enterprise_profiles query failed'); }

        let verifiedPilots = 0;
        try {
          verifiedPilots = await cachedFetch('count_verified_profiles', async () => {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('verified_account', true);
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] verified profiles query failed'); }

        let pendingDocs = 0;
        try {
          pendingDocs = await cachedFetch('count_pending_docs', async () => {
            const { count } = await supabase.from('pilot_documents').select('*', { count: 'exact', head: true }).eq('status', 'pending_review');
            return count || 0;
          }, undefined, 0);
        } catch { console.log('[AdminDashboard] pilot_documents query failed'); }

        let openTickets = 0;
        try {
          openTickets = await cachedFetch('count_open_tickets', async () => {
            const { count } = await supabase.from('support_enquiries').select('*', { count: 'exact', head: true }).neq('status', 'resolved');
            return count || 0;
          }, undefined, 0);
        } catch { console.log('[AdminDashboard] support_enquiries query failed'); }

        let upcomingMeetings = 0;
        try {
          upcomingMeetings = await cachedFetch('count_upcoming_meetings', async () => {
            const { count } = await supabase.from('meetings').select('*', { count: 'exact', head: true }).neq('status', 'completed');
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] meetings query failed'); }

        setStats({
          pilots,
          enterprises,
          verifications: verifiedPilots,
          events: upcomingMeetings,
          loading: false,
        });
        console.log('[AdminDashboard] setStats:', { pilots, enterprises, verifications: verifiedPilots, events: upcomingMeetings });

        // Fetch Dodo Payments revenue stats
        try {
          console.log('[AdminDashboard] Fetching Dodo Payments via edge function...');
          const { data: { session } } = await supabase.auth.getSession();
          const edgeUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/dodo-payments-proxy`;
          console.log('[AdminDashboard] Edge function URL:', edgeUrl);
          const dodoRes = await fetch(edgeUrl, {
            headers: {
              'Authorization': `Bearer ${session?.access_token || ''}`,
              'apikey': import.meta.env.VITE_SUPABASE_ANON_KEY || '',
            },
          });
          console.log('[AdminDashboard] Dodo edge response status:', dodoRes.status, dodoRes.statusText);
          if (dodoRes.ok) {
            const dodo = await dodoRes.json();
            console.log('[AdminDashboard] Dodo data:', dodo);
            setDodoStats({
              totalRevenue: dodo.totalRevenue || 0,
              revenueThisMonth: dodo.revenueThisMonth || 0,
              revenueLastMonth: dodo.revenueLastMonth || 0,
              mrr: dodo.mrr || 0,
              activeSubscriptions: dodo.activeSubscriptions || 0,
              totalPayments: dodo.totalPayments || 0,
              failedPayments: dodo.failedPayments || 0,
              customers: dodo.customers || 0,
              products: dodo.products || 0,
              loading: false,
              source: dodo.source || 'supabase_fallback',
            });
            console.log('[AdminDashboard] setDodoStats from source:', dodo.source);
          } else {
            const text = await dodoRes.text();
            console.log('[AdminDashboard] Dodo edge error response:', dodoRes.status, text);
          }
        } catch (dodoErr) {
          console.log('[AdminDashboard] Dodo fetch threw:', dodoErr);
          setDodoStats((s) => ({ ...s, loading: false }));
        }

        // Fetch invite codes used by this admin's referrals
        if (adminProfileId) {
          try {
            console.log('[AdminDashboard] Calling supabase.from(referrals).select(*) for invite codes...');
            const { data: referralsData, error } = await supabase
              .from('referrals')
              .select('pilot_email, status, created_at, referrer_profile_id')
              .eq('referrer_profile_id', adminProfileId)
              .order('created_at', { ascending: false });
            console.log('[AdminDashboard] referrals rows:', (referralsData || []).length, 'error:', error?.message);
            setInviteCodes(
              (referralsData || []).map((r: any) => ({
                code: dashboardData.karlInviteCode || adminInviteCode,
                used_by: r.pilot_email,
                created_at: r.created_at,
                status: r.status,
              }))
            );
          } catch (refErr) {
            console.log('[AdminDashboard] referrals invite fetch threw:', refErr);
          }
        } else {
          console.log('[AdminDashboard] Skipping invite codes query — no adminProfileId');
        }

        // ─── Overview counts for all admin sub-pages ───
        let blogPosts = 0;
        try {
          blogPosts = await cachedFetch('count_blog_posts', async () => {
            const { count } = await supabase.from('blog_posts').select('*', { count: 'exact', head: true });
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] blog_posts query failed'); }

        let prospects = 0;
        try {
          prospects = await cachedFetch('count_prospects', async () => {
            const { count } = await supabase.from('prospects').select('*', { count: 'exact', head: true });
            return count || 0;
          }, undefined, 0);
        } catch { console.log('[AdminDashboard] prospects query failed'); }

        let objectives = 0;
        try {
          objectives = await cachedFetch('count_objectives', async () => {
            const { count } = await supabase.from('employee_objectives').select('*', { count: 'exact', head: true });
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] employee_objectives query failed'); }

        let upcomingEvents = 0;
        try {
          upcomingEvents = await cachedFetch('count_upcoming_events', async () => {
            const { count } = await supabase.from('events').select('*', { count: 'exact', head: true }).gte('start_date', new Date().toISOString());
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] events query failed'); }

        let adminUsers = 0;
        try {
          adminUsers = await cachedFetch('count_admin_users', async () => {
            const { count } = await supabase.from('profiles').select('*', { count: 'exact', head: true }).in('role', ['admin', 'super_admin']);
            return count || 0;
          });
        } catch { console.log('[AdminDashboard] admin users query failed'); }

        setOverviewCounts({
          blogs: blogPosts,
          prospects,
          objectives,
          upcomingEvents,
          adminUsers,
          unreadMessages: 0,
          emailCampaigns: 0,
          aiConversations: 0,
          planningTasks: 0,
        });
        console.log('[AdminDashboard] setOverviewCounts:', { blogs: blogPosts, prospects, objectives, upcomingEvents, adminUsers });

        console.log('[AdminDashboard] Setting dashboard data...');
        setDashboardData((prev) => ({
          ...prev,
          karlProfileId: adminProfileId,
          karlInviteCode: adminInviteCode,
          pilotsReferred: pilotsReferred || 0,
          referralRevenue,
          supportTickets: openTickets || 0,
          pendingVerifications: pendingDocs || 0,
        }));
      } catch (err) {
        console.error('Error fetching stats:', err);
        setStats((s) => ({ ...s, loading: false }));
      }
    };

    fetchStats();

    // Real-time subscriptions — invalidate cache on data changes instead of blind refetch
    const profilesSubscription = supabase
      .channel('profiles-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'profiles' }, () => {
        void invalidateCache('count_profiles');
        void invalidateCache('count_verified_profiles');
        void invalidateCache('count_admin_users');
      })
      .subscribe();

    const enterprisesSubscription = supabase
      .channel('enterprises-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'enterprise_profiles' }, () => {
        void invalidateCache('count_enterprise_profiles');
      })
      .subscribe();

    const referralsSubscription = supabase
      .channel('referrals-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'referrals' }, () => {
        void invalidateCache(); // Clear all since referrals affects multiple counts
      })
      .subscribe();

    const meetingsSubscription = supabase
      .channel('meetings-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'meetings' }, () => { void invalidateCache('count_upcoming_meetings'); })
      .subscribe();

    return () => {
      profilesSubscription.unsubscribe();
      enterprisesSubscription.unsubscribe();
      referralsSubscription.unsubscribe();
      meetingsSubscription.unsubscribe();
    };
  }, [currentUser, isAdmin]);

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
      <AdminSidebar extraBadge={{ '/admin/support': dashboardData.supportTickets }} />

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
              <h1 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#1a1a1a', display: 'flex', alignItems: 'center', gap: 10 }}>
                Dashboard
                <button
                  onClick={async () => {
                    await invalidateCache();
                    hasFetchedRef.current = false;
                    window.location.reload();
                  }}
                  title="Refresh all data"
                  style={{
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: 14,
                    color: '#9ca3af',
                    padding: 2,
                  }}
                >
                  ↻
                </button>
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
            <AdminNotificationBell />

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
              {
                label: 'Total Revenue',
                value: dodoStats.loading ? '…' : `$${(dodoStats.totalRevenue / 100).toFixed(0)}`,
                color: '#059669',
                sub: dodoStats.source === 'dodo_api' ? 'Live from Dodo' : 'From subscriptions table',
              },
              {
                label: 'MRR',
                value: dodoStats.loading ? '…' : `$${(dodoStats.mrr / 100).toFixed(0)}`,
                color: '#0891b2',
                sub: 'Monthly recurring revenue',
              },
              {
                label: 'Active Subs',
                value: dodoStats.loading ? '…' : dodoStats.activeSubscriptions,
                color: '#7c3aed',
                sub: 'Paying customers',
              },
              {
                label: 'This Month',
                value: dodoStats.loading ? '…' : `$${(dodoStats.revenueThisMonth / 100).toFixed(0)}`,
                color: '#2563eb',
                sub: 'Revenue this month',
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

          {/* ─── Page Overview Grid ─── */}
          <div style={{ marginTop: 4 }}>
            <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 16px' }}>
              Portal Overview
            </h3>
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))',
                gap: 16,
              }}
            >
              {[
                {
                  title: 'Recognition+ Management',
                  path: '/admin/verification',
                  metrics: [
                    { label: 'Active Subs', value: dodoStats.activeSubscriptions },
                    { label: 'Total Revenue', value: `$${(dodoStats.totalRevenue / 100).toFixed(0)}` },
                  ],
                  color: '#f59e0b',
                  icon: '◈',
                },
                {
                  title: 'Pilot Management',
                  path: '/admin/pilots',
                  metrics: [
                    { label: 'Total', value: stats.pilots },
                    { label: 'Verified', value: stats.verifications },
                  ],
                  color: '#3b82f6',
                  icon: '◉',
                },
                {
                  title: 'Enterprise Accounts',
                  path: '/admin/enterprises',
                  metrics: [
                    { label: 'Partners', value: stats.enterprises },
                    { label: 'Revenue', value: `$${(dodoStats.totalRevenue / 100).toFixed(0)}` },
                  ],
                  color: '#8b5cf6',
                  icon: '◆',
                },
                {
                  title: 'Support Inbox',
                  path: '/admin/support',
                  metrics: [
                    { label: 'Open Tickets', value: dashboardData.supportTickets },
                    { label: 'Resolved', value: '—' },
                  ],
                  color: '#ef4444',
                  icon: '◉',
                },
                {
                  title: 'Employee Roster',
                  path: '/admin/objectives',
                  metrics: [
                    { label: 'Team Members', value: overviewCounts.adminUsers },
                    { label: 'Total Referrals', value: overviewCounts.objectives },
                  ],
                  color: '#10b981',
                  icon: '◈',
                },
                {
                  title: 'Email & Contacts',
                  path: '/admin/emails',
                  metrics: [
                    { label: 'Campaigns', value: overviewCounts.emailCampaigns || '—' },
                    { label: 'Contacts', value: '—' },
                  ],
                  color: '#0891b2',
                  icon: '◉',
                },
                {
                  title: 'Messages',
                  path: '/admin/messages',
                  metrics: [
                    { label: 'Unread', value: overviewCounts.unreadMessages || '—' },
                    { label: 'Total', value: '—' },
                  ],
                  color: '#6366f1',
                  icon: '◈',
                },
                {
                  title: 'Blogs & Articles',
                  path: '/admin/blogs',
                  metrics: [
                    { label: 'Posts', value: overviewCounts.blogs },
                    { label: 'Drafts', value: '—' },
                  ],
                  color: '#ec4899',
                  icon: '◉',
                },
                {
                  title: 'Future Prospects',
                  path: '/admin/prospects',
                  metrics: [
                    { label: 'Prospects', value: overviewCounts.prospects },
                    { label: 'Qualified', value: '—' },
                  ],
                  color: '#f97316',
                  icon: '◉',
                },
                {
                  title: 'Meetings',
                  path: '/admin/meetings',
                  metrics: [
                    { label: 'Upcoming', value: stats.events },
                    { label: 'This Week', value: '—' },
                  ],
                  color: '#14b8a6',
                  icon: '▶',
                },
                {
                  title: 'Planning Board',
                  path: '/admin/planning',
                  metrics: [
                    { label: 'Tasks', value: overviewCounts.planningTasks || '—' },
                    { label: 'Done', value: '—' },
                  ],
                  color: '#64748b',
                  icon: '◐',
                },
                {
                  title: 'AI Bot',
                  path: '/admin/bot',
                  metrics: [
                    { label: 'Conversations', value: overviewCounts.aiConversations || '—' },
                    { label: 'Today', value: '—' },
                  ],
                  color: '#a855f7',
                  icon: '◉',
                },
                {
                  title: 'Event Management',
                  path: '/admin/events',
                  metrics: [
                    { label: 'Upcoming', value: overviewCounts.upcomingEvents },
                    { label: 'Past', value: '—' },
                  ],
                  color: '#06b6d4',
                  icon: '◈',
                },
                {
                  title: 'System Settings',
                  path: '/admin/settings',
                  metrics: [
                    { label: 'Admins', value: overviewCounts.adminUsers },
                    { label: 'Version', value: '1.0.0' },
                  ],
                  color: '#475569',
                  icon: '◉',
                },
              ].map((card) => (
                <div
                  key={card.path}
                  style={{
                    background: '#f9fafb',
                    border: '1px solid #e5e7eb',
                    borderRadius: 12,
                    padding: '16px 18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 10,
                    transition: 'border-color 0.15s, box-shadow 0.15s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = card.color;
                    e.currentTarget.style.boxShadow = `0 0 0 1px ${card.color}20`;
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb';
                    e.currentTarget.style.boxShadow = 'none';
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                      <span style={{ fontSize: 14, color: card.color }}>{card.icon}</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: '#1a1a1a' }}>
                        {card.title}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate(card.path)}
                      style={{
                        fontSize: 11,
                        color: card.color,
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        fontWeight: 600,
                        padding: '2px 6px',
                        borderRadius: 4,
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = `${card.color}15`;
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'none';
                      }}
                    >
                      View →
                    </button>
                  </div>
                  <div style={{ display: 'flex', gap: 16 }}>
                    {card.metrics.map((m) => (
                      <div key={m.label}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: card.color }}>
                          {m.value}
                        </div>
                        <div style={{ fontSize: 10, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          {m.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Invite Code Management */}
          <div style={{ marginTop: 28, background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: '20px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a', margin: '0 0 4px' }}>Invite Code Management</h3>
                <p style={{ fontSize: 11, color: '#9ca3af', margin: 0 }}>Track referrals and manage partner invite codes</p>
              </div>
              <button
                onClick={() => setShowInviteManager(!showInviteManager)}
                style={{ padding: '6px 14px', background: '#1a1a1a', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
              >
                {showInviteManager ? 'Collapse' : 'Manage'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 16 }}>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Your Code</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#1a1a1a' }}>{dashboardData.karlInviteCode || '—'}</div>
                <button
                  onClick={() => { if (dashboardData.karlInviteCode) navigator.clipboard.writeText(dashboardData.karlInviteCode); }}
                  style={{ marginTop: 8, padding: '4px 10px', background: 'none', border: '1px solid #e5e7eb', borderRadius: 4, fontSize: 11, color: '#3b82f6', fontWeight: 600, cursor: 'pointer' }}
                >
                  Copy Code
                </button>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Signups</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#3b82f6' }}>{dashboardData.pilotsReferred}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Via your code</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Conversion</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#10b981' }}>
                  {dashboardData.pilotsReferred > 0 && dodoStats.totalPayments > 0
                    ? `${((dodoStats.totalPayments / dashboardData.pilotsReferred) * 100).toFixed(1)}%`
                    : '—'}
                </div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>Paid / referred</div>
              </div>
              <div style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 10, padding: 16 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Est. Revenue</div>
                <div style={{ fontSize: 20, fontWeight: 800, color: '#059669' }}>${dashboardData.referralRevenue}</div>
                <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 4 }}>From referrals</div>
              </div>
            </div>

            {showInviteManager && (
              <div style={{ marginTop: 16 }}>
                <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                  <input
                    value={inviteCodeInput}
                    onChange={(e) => setInviteCodeInput(e.target.value)}
                    placeholder="Enter custom invite code (e.g. PR-CebuPacific)"
                    style={{ flex: 1, padding: '8px 12px', border: '1px solid #e5e7eb', borderRadius: 6, fontSize: 13 }}
                  />
                  <button
                    onClick={async () => {
                      if (!inviteCodeInput.trim() || !currentUser?.id) return;
                      try {
                        await supabase.from('profiles').update({ referral_code: inviteCodeInput.trim() }).eq('id', currentUser.id);
                        setDashboardData((prev) => ({ ...prev, karlInviteCode: inviteCodeInput.trim() }));
                        setInviteCodeInput('');
                      } catch (err) {
                        console.error('Error updating invite code:', err);
                      }
                    }}
                    style={{ padding: '8px 16px', background: '#1a1a1a', border: 'none', borderRadius: 6, color: '#fff', fontSize: 12, fontWeight: 600, cursor: 'pointer' }}
                  >
                    Update Code
                  </button>
                </div>

                <h4 style={{ fontSize: 12, fontWeight: 700, color: '#1a1a1a', margin: '0 0 8px' }}>Referral History</h4>
                {inviteCodes.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: 20, color: '#9ca3af', fontSize: 13 }}>No referrals yet</div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {inviteCodes.map((ref, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '8px 12px', background: '#fff', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                          <span style={{ fontSize: 11, fontWeight: 700, color: '#6b7280', background: '#f3f4f6', padding: '2px 8px', borderRadius: 4 }}>{ref.code}</span>
                          <span style={{ fontSize: 12, color: '#1a1a1a' }}>{ref.used_by}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <span style={{ fontSize: 11, color: '#9ca3af' }}>{new Date(ref.created_at).toLocaleDateString()}</span>
                          <span style={{
                            fontSize: 10, fontWeight: 700, textTransform: 'uppercase', padding: '2px 8px', borderRadius: 10,
                            background: ref.status === 'credited' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)',
                            color: ref.status === 'credited' ? '#10b981' : '#f59e0b',
                          }}>
                            {ref.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
