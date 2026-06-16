import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/shared/lib/supabase';

export default function EmployeeObjectivesPage() {
  const navigate = useNavigate();
  const [objectives, setObjectives] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [newObjective, setNewObjective] = useState({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    fetchObjectives();
    fetchTeamMembers();
  }, []);

  const fetchTeamMembers = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, display_name, email')
        .in('role', ['super_admin', 'admin'])
        .order('display_name', { ascending: true });
      if (error) throw error;
      setTeamMembers(data || []);
    } catch (err) {
      console.error('Error fetching team members:', err);
    }
  };

  const fetchObjectives = async () => {
    try {
      const { data, error } = await supabase
        .from('employee_objectives')
        .select('*')
        .order('created_at', { ascending: false });
      if (error) throw error;
      setObjectives(data || []);
    } catch (err) {
      console.error('Error fetching objectives:', err);
    } finally {
      setLoading(false);
    }
  };

  const createObjective = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { error } = await supabase.from('employee_objectives').insert([{
        title: newObjective.title,
        description: newObjective.description,
        priority: newObjective.priority,
        assignee: newObjective.assignee,
        due_date: newObjective.dueDate,
        status: 'pending',
        created_at: new Date().toISOString(),
      }]);
      if (error) throw error;
      setShowModal(false);
      setNewObjective({ title: '', description: '', priority: 'medium', assignee: '', dueDate: '' });
      fetchObjectives();
    } catch (err) {
      console.error('Error creating objective:', err);
    }
  };

  const updateStatus = async (id: string, status: string) => {
    try {
      const { error } = await supabase.from('employee_objectives').update({ status }).eq('id', id);
      if (error) throw error;
      fetchObjectives();
    } catch (err) {
      console.error('Error updating status:', err);
    }
  };

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#10b981',
  };

  const statusColors = {
    pending: '#f59e0b',
    in_progress: '#3b82f6',
    completed: '#10b981',
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1121', color: '#e2e8f0', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif', padding: '32px' }}>
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: 32, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: 28, fontWeight: 800, margin: '0 0 8px', color: '#e2e8f0' }}>
              Employee Objectives
            </h1>
            <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.4)', margin: 0 }}>
              Track and manage team objectives and deliverables
            </p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: '10px 20px',
              background: '#ef4444',
              color: '#fff',
              border: 'none',
              borderRadius: 8,
              fontSize: 14,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            + New Objective
          </button>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 32 }}>
          {[
            { label: 'Total', value: objectives.length, color: '#3b82f6' },
            { label: 'Pending', value: objectives.filter(o => o.status === 'pending').length, color: '#f59e0b' },
            { label: 'In Progress', value: objectives.filter(o => o.status === 'in_progress').length, color: '#3b82f6' },
            { label: 'Completed', value: objectives.filter(o => o.status === 'completed').length, color: '#10b981' },
          ].map((stat) => (
            <div
              key={stat.label}
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: 12,
                padding: 20,
              }}
            >
              <div style={{ fontSize: 32, fontWeight: 800, color: stat.color, marginBottom: 4 }}>{stat.value}</div>
              <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Objectives List */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: 40, color: 'rgba(255,255,255,0.4)' }}>Loading...</div>
        ) : objectives.length === 0 ? (
          <div style={{ textAlign: 'center', padding: 60, background: '#0f172a', borderRadius: 12, border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>📋</div>
            <div style={{ fontSize: 16, color: 'rgba(255,255,255,0.6)', marginBottom: 8 }}>No objectives yet</div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>Create your first objective to get started</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {objectives.map((objective) => (
              <div
                key={objective.id}
                style={{
                  background: '#0f172a',
                  border: '1px solid rgba(255,255,255,0.06)',
                  borderRadius: 12,
                  padding: 20,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                    <span
                      style={{
                        padding: '4px 10px',
                        background: `${priorityColors[objective.priority]}20`,
                        color: priorityColors[objective.priority],
                        borderRadius: 20,
                        fontSize: 11,
                        fontWeight: 600,
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em',
                      }}
                    >
                      {objective.priority}
                    </span>
                    <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#e2e8f0' }}>{objective.title}</h3>
                  </div>
                  <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: '0 0 12px' }}>{objective.description}</p>
                  <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>
                    <span>👤 {objective.assignee || 'Unassigned'}</span>
                    <span>📅 {objective.due_date ? new Date(objective.due_date).toLocaleDateString() : 'No due date'}</span>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <select
                    value={objective.status}
                    onChange={(e) => updateStatus(objective.id, e.target.value)}
                    style={{
                      padding: '6px 12px',
                      background: `${statusColors[objective.status]}20`,
                      color: statusColors[objective.status],
                      border: `1px solid ${statusColors[objective.status]}40`,
                      borderRadius: 6,
                      fontSize: 12,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    <option value="pending">Pending</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Modal */}
        {showModal && (
          <div
            style={{
              position: 'fixed',
              inset: 0,
              background: 'rgba(0,0,0,0.7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 100,
            }}
            onClick={() => setShowModal(false)}
          >
            <div
              style={{
                background: '#0f172a',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: 16,
                padding: 28,
                width: '100%',
                maxWidth: 480,
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2 style={{ fontSize: 20, fontWeight: 700, margin: '0 0 20px', color: '#e2e8f0' }}>New Objective</h2>
              <form onSubmit={createObjective} style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Title</label>
                  <input
                    type="text"
                    value={newObjective.title}
                    onChange={(e) => setNewObjective({ ...newObjective, title: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Description</label>
                  <textarea
                    value={newObjective.description}
                    onChange={(e) => setNewObjective({ ...newObjective, description: e.target.value })}
                    required
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                      resize: 'vertical',
                    }}
                  />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Priority</label>
                    <select
                      value={newObjective.priority}
                      onChange={(e) => setNewObjective({ ...newObjective, priority: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0b1121',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 14,
                      }}
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Due Date</label>
                    <input
                      type="date"
                      value={newObjective.dueDate}
                      onChange={(e) => setNewObjective({ ...newObjective, dueDate: e.target.value })}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        background: '#0b1121',
                        border: '1px solid rgba(255,255,255,0.1)',
                        borderRadius: 8,
                        color: '#e2e8f0',
                        fontSize: 14,
                      }}
                    />
                  </div>
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.6)', marginBottom: 6 }}>Assignee</label>
                  <select
                    value={newObjective.assignee}
                    onChange={(e) => setNewObjective({ ...newObjective, assignee: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '10px 12px',
                      background: '#0b1121',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: '#e2e8f0',
                      fontSize: 14,
                    }}
                  >
                    <option value="">Unassigned</option>
                    {teamMembers.map((member) => (
                      <option key={member.id} value={member.display_name || member.email}>
                        {member.display_name || member.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                  <button
                    type="button"
                    onClick={() => setShowModal(false)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: 'transparent',
                      border: '1px solid rgba(255,255,255,0.1)',
                      borderRadius: 8,
                      color: 'rgba(255,255,255,0.6)',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    style={{
                      flex: 1,
                      padding: '10px',
                      background: '#ef4444',
                      border: 'none',
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 14,
                      fontWeight: 600,
                      cursor: 'pointer',
                    }}
                  >
                    Create Objective
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
