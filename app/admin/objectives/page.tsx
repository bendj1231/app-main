import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import AdminSidebar from '../components/AdminSidebar';
import AdminNotificationBell from '../components/AdminNotificationBell';

interface Employee {
  id: string;
  display_name: string | null;
  email: string | null;
  role: string | null;
  created_at: string;
  referral_count: number;
  referral_revenue: number;
  performance_tier: 'top' | 'solid' | 'rising' | 'needs_attention';
  assignments: string[];
  evaluation_status: 'none' | 'under_evaluation' | 'flagged' | 'cleared' | 'terminated';
}

const SIDEBAR_WIDTH = 260;


export default function EmployeeObjectivesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser, userProfile } = useAuth();
  const currentPath = location.pathname;
  const isAdmin = userProfile?.role === 'super_admin' || userProfile?.role === 'admin';

  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'referrals' | 'revenue' | 'name'>('revenue');
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [selectedModules, setSelectedModules] = useState<string[]>([]);
  const [evaluatingEmployee, setEvaluatingEmployee] = useState<Employee | null>(null);
  const [showEvalModal, setShowEvalModal] = useState(false);

  const MODULES = [
    'Recognition+ Management',
    'Pilot Management',
    'Enterprise Accounts',
    'Support Inbox',
    'Employee Roster',
    'Email & Contacts',
    'Messages',
    'Blogs & Articles',
    'Future Prospects',
    'Meetings',
    'Planning Board',
    'AI Bot',
    'Event Management',
    'System Settings',
    'Referral Tracking',
  ];

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

      // 2. Fetch all assignments
      let allAssignments: { employee_id: string; module: string }[] = [];
      try {
        const { data, error } = await supabase.from('employee_assignments').select('employee_id, module');
        if (!error) allAssignments = data || [];
      } catch { /* ignore */ }

      // 3. For each employee, count their referrals
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

        const empAssignments = allAssignments
          .filter((a) => a.employee_id === p.id)
          .map((a) => a.module);

        employeeList.push({
          id: p.id,
          display_name: p.display_name,
          email: p.email,
          role: p.role,
          created_at: p.created_at,
          referral_count: referralCount,
          referral_revenue: revenue,
          performance_tier: tier,
          assignments: empAssignments,
          evaluation_status: (p as any).evaluation_status || 'none',
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

  const assignedModules = new Set(employees.flatMap((e) => e.assignments));
  const modulesCovered = assignedModules.size;
  const unassignedCount = MODULES.length - modulesCovered;

  const tierStyles: Record<string, { bg: string; color: string; label: string }> = {
    top: { bg: '#10b98120', color: '#10b981', label: 'Top Performer' },
    solid: { bg: '#3b82f620', color: '#3b82f6', label: 'Solid' },
    rising: { bg: '#f59e0b20', color: '#f59e0b', label: 'Rising Star' },
    needs_attention: { bg: '#ef444420', color: '#ef4444', label: 'Needs Attention' },
  };

  const evalStyles: Record<string, { bg: string; color: string; label: string }> = {
    none: { bg: 'transparent', color: '#9ca3af', label: '—' },
    under_evaluation: { bg: '#f59e0b20', color: '#f59e0b', label: 'Under Evaluation' },
    flagged: { bg: '#ef444420', color: '#ef4444', label: 'Flagged' },
    cleared: { bg: '#10b98120', color: '#10b981', label: 'Cleared' },
    terminated: { bg: '#1a1a1a', color: '#fff', label: 'Terminated' },
  };

  const roleLabels: Record<string, string> = {
    super_admin: 'Super Admin',
    admin: 'Admin',
    recruiter: 'Recruiter',
    sales: 'Sales',
    employee: 'Employee',
  };

  const openAssignModal = (emp: Employee) => {
    setSelectedEmployee(emp);
    setSelectedModules(emp.assignments || []);
    setShowAssignModal(true);
  };

  const openEvalModal = (emp: Employee) => {
    setEvaluatingEmployee(emp);
    setShowEvalModal(true);
  };

  const saveEvaluation = async (status: Employee['evaluation_status']) => {
    if (!evaluatingEmployee) return;
    try {
      await supabase
        .from('profiles')
        .update({ evaluation_status: status })
        .eq('id', evaluatingEmployee.id);
      setEmployees((prev) =>
        prev.map((e) =>
          e.id === evaluatingEmployee.id ? { ...e, evaluation_status: status } : e
        )
      );
      setShowEvalModal(false);
      setEvaluatingEmployee(null);
    } catch (err) {
      console.error('Error saving evaluation:', err);
    }
  };

  const saveAssignments = async () => {
    if (!selectedEmployee) return;
    try {
      // Delete existing assignments for this employee
      await supabase.from('employee_assignments').delete().eq('employee_id', selectedEmployee.id);
      // Insert new ones
      if (selectedModules.length > 0) {
        const rows = selectedModules.map((module) => ({
          employee_id: selectedEmployee.id,
          module,
          role_type: 'primary',
        }));
        await supabase.from('employee_assignments').insert(rows);
      }
      setShowAssignModal(false);
      fetchEmployeePerformance();
    } catch (err) {
      console.error('Error saving assignments:', err);
    }
  };

  const toggleModule = (module: string) => {
    setSelectedModules((prev) =>
      prev.includes(module) ? prev.filter((m) => m !== module) : [...prev, module]
    );
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
    <div style={{ minHeight: '100vh', background: '#ffffff', color: '#1a1a1a', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', display: 'flex' }}>
      
      <AdminSidebar />

      {/* Main Content */}
      <main style={{ flex: 1, marginLeft: SIDEBAR_WIDTH, minHeight: '100vh' }}>
        {/* Header */}
        <div style={{ borderBottom: '1px solid #e5e7eb', padding: '24px 32px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 800, margin: '0 0 4px' }}>Employee Roster</h1>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: 0 }}>
              Performance oversight — referrals, revenue, and outsourcing velocity
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
            <AdminNotificationBell />
            <button
              onClick={() => navigate('/admin')}
            style={{ padding: '8px 16px', background: 'none', border: '1px solid #e5e7eb', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: 'pointer', color: '#6b7280' }}
          >
            ← Back to Dashboard
          </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 32px' }}>
        {/* Summary Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 16, marginBottom: 28 }}>
          {[
            { label: 'Team Members', value: employees.length, sub: 'Active employees', color: '#1a1a1a' },
            { label: 'Total Referrals', value: totalReferrals, sub: 'Users brought in', color: '#3b82f6' },
            { label: 'Total Revenue', value: `$${totalRevenue.toLocaleString()}`, sub: 'From referrals', color: '#059669' },
            { label: 'Modules Covered', value: `${modulesCovered}/${MODULES.length}`, sub: 'Have staff assigned', color: '#8b5cf6' },
            { label: 'Unassigned', value: unassignedCount, sub: 'Modules need owner', color: unassignedCount > 0 ? '#ef4444' : '#10b981' },
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
              <div>Evaluation</div>
            </div>

            {/* Table Rows */}
            {sortedEmployees.map((emp, i) => {
              const tier = tierStyles[emp.performance_tier];
              return (
                <div
                  key={emp.id}
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr 120px 120px',
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
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                        textAlign: 'center',
                      }}
                    >
                      {tier.label}
                    </span>
                    <button
                      onClick={() => openAssignModal(emp)}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: '#f3f4f6',
                        color: '#6b7280',
                        border: 'none',
                        cursor: 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                      }}
                    >
                      {emp.assignments.length > 0 ? `${emp.assignments.length} module${emp.assignments.length > 1 ? 's' : ''}` : 'Assign'}
                    </button>
                    {emp.assignments.length > 0 && (
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 3, maxWidth: 120 }}>
                        {emp.assignments.slice(0, 2).map((m) => (
                          <span key={m} style={{ fontSize: 9, color: '#9ca3af', background: '#f3f4f6', padding: '1px 6px', borderRadius: 10 }}>{m}</span>
                        ))}
                        {emp.assignments.length > 2 && (
                          <span style={{ fontSize: 9, color: '#9ca3af' }}>+{emp.assignments.length - 2}</span>
                        )}
                      </div>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                    <button
                      onClick={() => openEvalModal(emp)}
                      style={{
                        fontSize: 10,
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.04em',
                        padding: '4px 10px',
                        borderRadius: 20,
                        background: evalStyles[emp.evaluation_status].bg,
                        color: evalStyles[emp.evaluation_status].color,
                        border: emp.evaluation_status === 'none' ? '1px dashed #d1d5db' : 'none',
                        cursor: 'pointer',
                        textAlign: 'center',
                      }}
                    >
                      {evalStyles[emp.evaluation_status].label}
                    </button>
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
        <div style={{ marginTop: 12, display: 'flex', gap: 20, alignItems: 'center', justifyContent: 'center' }}>
          <span style={{ fontSize: 11, fontWeight: 600, color: '#9ca3af' }}>Evaluation:</span>
          {Object.entries(evalStyles).filter(([k]) => k !== 'none').map(([key, style]) => (
            <div key={key} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: style.color }} />
              <span style={{ fontSize: 11, color: '#6b7280' }}>{style.label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Evaluation Modal */}
      {showEvalModal && evaluatingEmployee && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowEvalModal(false)}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 380,
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>
              Evaluation Status
            </h2>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
              {evaluatingEmployee.display_name || evaluatingEmployee.email}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {([
                { key: 'under_evaluation', label: 'Under Evaluation', desc: 'Investigating performance or conduct' },
                { key: 'flagged', label: 'Flagged', desc: 'Suspicious activity or risk identified' },
                { key: 'cleared', label: 'Cleared', desc: 'Investigation complete — no action' },
                { key: 'terminated', label: 'Terminated', desc: 'Employment ended' },
                { key: 'none', label: 'Remove Status', desc: 'Clear evaluation flag' },
              ] as { key: Employee['evaluation_status']; label: string; desc: string }[]).map((opt) => (
                <button
                  key={opt.key}
                  onClick={() => saveEvaluation(opt.key)}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'flex-start',
                    padding: '12px 14px',
                    borderRadius: 10,
                    border: '1px solid',
                    background: evaluatingEmployee.evaluation_status === opt.key ? evalStyles[opt.key].bg : '#fff',
                    borderColor: evaluatingEmployee.evaluation_status === opt.key ? evalStyles[opt.key].color : '#e5e7eb',
                    color: evaluatingEmployee.evaluation_status === opt.key ? evalStyles[opt.key].color : '#1a1a1a',
                    cursor: 'pointer',
                    textAlign: 'left',
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{opt.label}</span>
                  <span style={{ fontSize: 11, color: '#9ca3af', marginTop: 2 }}>{opt.desc}</span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowEvalModal(false)}
              style={{
                width: '100%',
                padding: '10px 20px',
                background: 'transparent',
                border: '1px solid #e5e7eb',
                borderRadius: 8,
                color: '#6b7280',
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Assign Modules Modal */}
      {showAssignModal && selectedEmployee && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
          }}
          onClick={() => setShowAssignModal(false)}
        >
          <div
            style={{
              background: '#fff',
              border: '1px solid #e5e7eb',
              borderRadius: 16,
              padding: 28,
              width: '100%',
              maxWidth: 420,
              maxHeight: '80vh',
              overflow: 'auto',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2 style={{ fontSize: 18, fontWeight: 700, margin: '0 0 4px' }}>
              Assign Modules
            </h2>
            <p style={{ fontSize: 13, color: '#9ca3af', margin: '0 0 20px' }}>
              {selectedEmployee.display_name || selectedEmployee.email}
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {MODULES.map((module) => (
                <label
                  key={module}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 10,
                    padding: '10px 12px',
                    borderRadius: 8,
                    cursor: 'pointer',
                    background: selectedModules.includes(module) ? '#f0fdf4' : '#f9fafb',
                    border: `1px solid ${selectedModules.includes(module) ? '#10b981' : '#e5e7eb'}`,
                  }}
                >
                  <input
                    type="checkbox"
                    checked={selectedModules.includes(module)}
                    onChange={() => toggleModule(module)}
                    style={{ width: 16, height: 16, accentColor: '#10b981' }}
                  />
                  <span style={{ fontSize: 13, fontWeight: 500, color: '#1a1a1a' }}>{module}</span>
                </label>
              ))}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowAssignModal(false)}
                style={{
                  padding: '10px 20px',
                  background: 'transparent',
                  border: '1px solid #e5e7eb',
                  borderRadius: 8,
                  color: '#6b7280',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Cancel
              </button>
              <button
                onClick={saveAssignments}
                style={{
                  padding: '10px 20px',
                  background: '#1a1a1a',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 13,
                  fontWeight: 600,
                  cursor: 'pointer',
                }}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
      </main>
    </div>
  );
}