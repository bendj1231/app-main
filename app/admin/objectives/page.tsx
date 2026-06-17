import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/lib/supabase';

interface Employee {
  id: string;
  display_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  referral_count: number;
  referral_revenue: number;
  performance_tier: 'top' | 'solid' | 'rising' | 'needs_attention';
}

export default function EmployeeObjectivesPage() {
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'referrals' | 'revenue' | 'name'>('revenue');

  useEffect(() => {
    fetchEmployeePerformance();
  }, []);

  const fetchEmployeePerformance = async () => {
    setLoading(true);
    try {
      // 1. Fetch all employee profiles (non-pilot roles)
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, display_name, email, role, created_at')
        .in('role', ['super_admin', 'admin', 'recruiter', 'sales', 'employee'])
        .order('created_at', { ascending: false });

      if (profilesError) {
        console.log('[EmployeeRoster] profiles error:', profilesError.message);
      }

      const employeeList: Employee[] = [];
      const baseProfiles = profiles || [];

      // 2. For each employee, count their referrals
      for (const p of baseProfiles) {
        let referralCount = 0;
        try {
          const { count, error } = await supabase
            .from('referrals')
            .select('id', { count: 'exact', head: true })
            .eq('referrer_profile_id', p.id)
            .eq('status', 'credited');
          if (!error) referralCount = count || 0;
        } catch { /* ignore */ }

        // Assume $50 revenue per credited referral
        const revenue = referralCount * 50;

        let tier: Employee['performance_tier'] = 'needs_attention';
        if (referralCount >= 20) tier = 'top';
        else if (referralCount >= 10) tier = 'solid';
        else if (referralCount >= 3) tier = 'rising';

        employeeList.push({
          id: p.id,
          display_name: p.display_name,
          email: p.email,
          role: p.role,
          created_at: p.created_at,
          referral_count: referralCount,
          referral_revenue: revenue,
          performance_tier: tier,
        });
      }

      setEmployees(employeeList);
    } catch (err) {
      console.error('[EmployeeRoster] top-level error:', err);
    } finally {
      setLoading(false);
    }
  };

  const sortedEmployees = [...employees].sort((a, b) => {
    if (sortBy === 'revenue') return b.referral_revenue - a.referral_revenue;
    if (sortBy === 'referrals') return b.referral_count - a.referral_count;
    return (a.display_name || a.email || '').localeCompare(b.display_name || b.email || '');
  });

  const totalReferrals = employees.reduce((sum, e) => sum + e.referral_count, 0);
  const totalRevenue = employees.reduce((sum, e) => sum + e.referral_revenue, 0);
  const topPerformer = sortedEmployees[0];

  const tierStyles: Record<string, { bg: string; color: string; label: string }> = {
    top: { bg: '#10b98120', color: '#10b981', label: 'Top Performer' },
    solid: { bg: '#3b82f620', color: '#3b82f6', label: 'Solid' },
    rising: { bg: '#f59e0b20', color: '#f59e0b', label: 'Rising Star' },
    needs_attention: { bg: '#ef444420', color: '#ef4444', label: 'Needs Attention' },
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    recruiter: 'Recruiter',
    sales: 'Sales',
    employee: 'Employee',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif' }}>
      {/* Header */}
      <div style={{ borderBottom: '1px solid #e5e7eb', padding: '24px 32px' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Employee Roster</h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              Performance oversight — referrals, revenue, and outsourcing velocity
            </p>
          </div>
          <button
            onClick={() => navigate('/admin')}
            style={{ padding: '8px 16px', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Team Members', value: employees.length, sub: 'Active employees', color: '#1a1a1a' },
            { label: 'Total Referrals', value: totalReferrals, sub: 'Users brought in', color: '#3b82f6' },
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'From referrals', color: '#059669' },
            { label: 'Top Performer', value: topPerformer?.display_name || topPerformer?.email || '—', sub: `${topPerformer?.referral_count || 0} referrals`, color: '#f59e0b' },
          ].map((stat) => (
            <div key={stat.label} style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, padding: 20 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{stat.label}</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: stat.color, marginBottom: 4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{stat.value}</div>
              <div style={{ fontSize: 11, color: '#9ca3af' }}>{stat.sub}</div>
            </div>
          ))}
        </div>

        {/* Sort Controls */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16, alignItems: 'center' }}>
          <span style={{ fontSize: 13, fontWeight: 600, color: '#6b7280' }}>Sort by:</span>
          {[
            { key: 'revenue' as const, label: 'Revenue' },
            { key: 'referrals' as const, label: 'Referrals' },
            { key: 'name' as const, label: 'Name' },
          ].map((option) => (
            <button
              key={option.key}
              onClick={() => setSortBy(option.key)}
              style={{
                padding: '6px 14px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
                cursor: 'pointer',
                border: '1px solid',
                background: sortBy === option.key ? '#1a1a1a' : '#fff',
                color: sortBy === option.key ? '#fff' : '#6b7280',
                borderColor: sortBy === option.key ? '#1a1a1a' : '#e5e7eb',
              }}
            >
              {option.label}
            </button>
          ))}
        </div>

        {/* Table */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 60, color: '#9ca3af' }}>Loading roster...</div>
        ) : employees.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#f9fafb', borderRadius: 12, border: '1px solid #e5e7eb' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>👥</div>
            <div style={{ fontSize: 15, fontWeight: 600, color: '#6b7280', marginBottom: 4 }}>No employees found</div>
            <div style={{ fontSize: 13, color: '#9ca3af' }}>Add team members with admin, recruiter, or sales roles</div>
          </div>
        ) : (
          <div style={{ background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden' }}>
            {/* Table Header */}
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                gap: 16,
                padding: '14px 20px',
                background: '#fff',
                borderBottom: '1px solid #e5e7eb',
                fontSize: 11,
                fontWeight: 700,
                color: '#9ca3af',
                textTransform: 'uppercase',
                letterSpacing: '0.06em',
              }}
            >
              <div>Employee</div>
              <div>Role</div>
              <div style={{ textAlign: 'right' }}>Referrals</div>
              <div style={{ textAlign: 'right' }}>Revenue</div>
              <div style={{ textAlign: 'right' }}>Since</div>
              <div>Status</div>
            </div>

            {/* Table Rows */}
            {sortedEmployees.map((emp, i) => {
              const tier = tierStyles[emp.performance_tier];
              return (
                <div
                  key={emp.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px',
                    gap: 16,
                    padding: '14px 20px',
                    background: i % 2 === 0 ? '#fff' : '#fafafa',
                    borderBottom: '1px solid #f3f4f6',
                    alignItems: 'center',
                  }}
                >
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: '#1a1a1a' }}>
                      {emp.display_name || emp.email || 'Unknown'}
                    </div>
                    <div style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>
                      {emp.email}
                    </div>
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 11,
                        fontWeight: 600,
                        padding: '3px 10px',
                        borderRadius: 20,
                        background: '#f3f4f6',
                        color: '#6b7280',
                      }}
                    >
                      {roleLabels[emp.role || ''] || emp.role || 'Employee'}
                    </span>
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#3b82f6' }}>
                    {emp.referral_count}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 14, fontWeight: 700, color: '#059669' }}>
                    ${emp.referral_revenue.toLocaleString()}
                  </div>
                  <div style={{ textAlign: 'right', fontSize: 12, color: '#9ca3af' }}>
                    {new Date(emp.created_at).toLocaleDateString()}
                  </div>
                  <div>
                    <span
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: tier.bg,
                        color: tier.color,
                      }}
                    >
                      {tier.label}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Performance Legend */}
        <div style={{ marginTop: 20, display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>Performance Tiers:</span>
          {Object.entries(tierStyles).map(([key, style]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: style.color }} />
              <span style={{ fontSize: 11, color: '#6b7280' }}>{style.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
