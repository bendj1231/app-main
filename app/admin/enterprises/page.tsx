import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';

const SIDEBAR_WIDTH = 260;


export default function EnterpriseManagementPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;

  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [enterprises, setEnterprises] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [stats, setStats] = useState({ total: 0, active: 0, enterprise: 0, free: 0 });

  useEffect(() => {
    if (!currentUser || !isAdmin) return;
    fetchEnterprises();
  }, [currentUser, isAdmin]);

  const fetchEnterprises = async () => {
    try {
      const { data, error } = await supabase
        .from('enterprise_accounts')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      const list = data || [];
      setEnterprises(list);
      setStats({
        total: list.length,
        active: list.filter((e: any) => e.is_active).length,
        enterprise: list.filter((e: any) => e.account_tier === 'enterprise').length,
        free: list.filter((e: any) => e.account_tier === 'free').length,
      });
    } catch (err) {
      console.error('Error fetching enterprises:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredEnterprises = enterprises.filter((ent) => {
    return (ent.airline_name || '').toLowerCase().includes(searchTerm.toLowerCase());
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
          {/* Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
            {[
              { label: 'Total', value: stats.total, color: '#1a1a1a' },
              { label: 'Active', value: stats.active, color: '#10b981' },
              { label: 'Enterprise Tier', value: stats.enterprise, color: '#3b82f6' },
              { label: 'Free Tier', value: stats.free, color: '#6b7280' },
            ].map((stat) => (
              <div key={stat.label} style={{ background: '#fff', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: stat.color }}>{stat.value}</div>
              </div>
            ))}
          </div>

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
                  <div style={{ display: 'flex', alignItems: 'center', gap: 14, flex: 1, minWidth: 0 }}>
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
                        flexShrink: 0,
                      }}
                    >
                      🏢
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#1a1a1a' }}>
                        {ent.airline_name || 'Unnamed Enterprise'}
                      </div>
                      <div style={{ fontSize: 12, color: '#6b7280', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <span>{ent.country || 'Aviation'}</span>
                        {ent.airline_iata_code && <span>· {ent.airline_iata_code}</span>}
                        {ent.billing_email && <span>· {ent.billing_email}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: ent.account_tier === 'enterprise' ? '#dbeafe' : '#f3f4f6',
                        color: ent.account_tier === 'enterprise' ? '#2563eb' : '#6b7280',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {ent.account_tier}
                    </span>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: ent.is_active ? '#f0fdf4' : '#fef2f2',
                        color: ent.is_active ? '#10b981' : '#ef4444',
                        textTransform: 'uppercase',
                        letterSpacing: '0.03em',
                      }}
                    >
                      {ent.is_active ? 'Active' : 'Inactive'}
                    </span>
                    {ent.tier_expires_at && (
                      <span style={{ fontSize: 10, color: '#9ca3af', whiteSpace: 'nowrap' }}>
                        Expires {new Date(ent.tier_expires_at).toLocaleDateString()}
                      </span>
                    )}
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