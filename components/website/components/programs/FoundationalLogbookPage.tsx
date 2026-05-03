import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { ClipboardList, Clock, CheckCircle, Plus, ArrowRight } from 'lucide-react';

interface FoundationalLogbookPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface MentorshipSession {
  id: string;
  date: string;
  mentorEmail: string;
  description: string;
  hours: number;
  prescription: string;
  verified: boolean;
}

export const FoundationalLogbookPage: React.FC<FoundationalLogbookPageProps> = ({ 
  onBack, 
  onNavigate 
}) => {
  const { userProfile } = useAuth();
  const [sessions, setSessions] = useState<MentorshipSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalHours, setTotalHours] = useState(0);
  const [verifiedHours, setVerifiedHours] = useState(0);
  const [showAddForm, setShowAddForm] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    mentorEmail: '',
    description: '',
    hours: '',
    prescription: ''
  });

  // 50hrs certification target
  const CERTIFICATION_TARGET = 50;

  useEffect(() => {
    fetchMentorshipSessions();
  }, [userProfile?.uid]);

  const fetchMentorshipSessions = async () => {
    if (!userProfile?.uid) {
      setLoading(false);
      return;
    }

    try {
      const userId = userProfile?.id || userProfile?.uid;
      // Fetch from Supabase study_sessions table
      const { data, error } = await supabase
        .from('study_sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('session_type', 'mentorship')
        .order('session_date', { ascending: false });

      if (error) {
        console.warn('Error fetching mentorship sessions:', error);
        // Use sample data if no data found
        const sampleSessions: MentorshipSession[] = [
          {
            id: '1',
            date: '2026-03-20',
            mentorEmail: 'captain.sarah@wingmentor.com',
            description: 'Initial mentorship session - Career pathway assessment and goal setting',
            hours: 2.5,
            prescription: 'Complete Module 1 and research cargo vs passenger pathway requirements',
            verified: true,
          },
          {
            id: '2',
            date: '2026-03-18',
            mentorEmail: 'captain.sarah@wingmentor.com',
            description: 'Risk management techniques review and CRM principles discussion',
            hours: 1.5,
            prescription: 'Practice risk assessment scenarios and log 3 case studies',
            verified: true,
          },
        ];
        setSessions(sampleSessions);
        setTotalHours(sampleSessions.reduce((sum, s) => sum + s.hours, 0));
        setVerifiedHours(sampleSessions.filter(s => s.verified).reduce((sum, s) => sum + s.hours, 0));
      } else {
        const transformedSessions: MentorshipSession[] = (data || []).map((session: any) => ({
          id: session.id,
          date: session.session_date || session.date,
          mentorEmail: session.mentor_email || session.mentorEmail || 'Mentor',
          description: session.description || session.topic || 'Session',
          hours: session.hours || session.duration || 0,
          prescription: session.prescription || session.notes || '',
          verified: session.verified || session.wingmentorVerified || false,
        }));
        setSessions(transformedSessions);
        setTotalHours(transformedSessions.reduce((sum, s) => sum + s.hours, 0));
        setVerifiedHours(transformedSessions.filter(s => s.verified).reduce((sum, s) => sum + s.hours, 0));
      }
    } catch (err) {
      console.error('Error fetching mentorship sessions:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userId = userProfile?.id || userProfile?.uid;
      
      const { error } = await supabase
        .from('study_sessions')
        .insert({
          user_id: userId,
          session_type: 'mentorship',
          session_date: formData.date,
          mentor_email: formData.mentorEmail,
          description: formData.description,
          hours: parseFloat(formData.hours),
          prescription: formData.prescription,
          verified: false,
          created_at: new Date().toISOString(),
        });

      if (error) {
        console.error('Error adding session:', error);
        alert('Failed to add session. Please try again.');
        return;
      }

      // Refresh sessions
      await fetchMentorshipSessions();
      setShowAddForm(false);
      setFormData({
        date: new Date().toISOString().split('T')[0],
        mentorEmail: '',
        description: '',
        hours: '',
        prescription: ''
      });
    } catch (err) {
      console.error('Error adding session:', err);
      alert('Failed to add session. Please try again.');
    }
  };

  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';
  const progressPercentage = Math.round((verifiedHours / CERTIFICATION_TARGET) * 100);

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        overflow: 'hidden',
        fontFamily: 'Inter, system-ui, sans-serif',
      }}
    >
      {/* Shader-like gradient overlay */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'radial-gradient(circle at 20% 30%, rgba(37, 99, 235, 0.15) 0%, transparent 50%), radial-gradient(circle at 80% 70%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />
      <div
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(180deg, rgba(15, 23, 42, 0) 0%, rgba(15, 23, 42, 0.3) 100%)',
          pointerEvents: 'none',
          zIndex: 1,
        }}
      />
      <div style={{ position: 'relative', zIndex: 2, padding: '0 3rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Glassy Card Container */}
        <div
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            backdropFilter: 'blur(20px)',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            position: 'relative',
          }}
        >
          {/* Back Button - Top Left Corner */}
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '1rem',
              left: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '8px',
              padding: '0.5rem 1rem',
              color: '#60a5fa',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 10,
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.05)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
            }}
          >
            <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)', display: 'inline', marginRight: '0.25rem' }} />
            Back to Program Platform
          </button>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img src="/logo.png" alt="PilotRecognition Logo" style={{ display: 'block', maxWidth: '180px', height: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }} />
            <div style={{ color: '#60a5fa', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WINGMENTOR PROGRAMS
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#f1f5f9', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Mentorship Logbook
            </h1>
            <p style={{ color: '#94a3b8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Progress Overview */}
          <div
            style={{
              background: 'rgba(37, 99, 235, 0.8)',
              backdropFilter: 'blur(10px)',
              borderRadius: '16px',
              padding: '1.5rem',
              marginBottom: '2rem',
              color: 'white',
              border: '1px solid rgba(37, 99, 235, 0.5)',
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, marginBottom: '0.25rem' }}>
                  50-Hour Certification Progress
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                  {verifiedHours} of {CERTIFICATION_TARGET} hours verified
                </p>
              </div>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '2rem', fontWeight: 700, lineHeight: 1 }}>
                  {progressPercentage}%
                </div>
              </div>
            </div>
            <div
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                borderRadius: '8px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: 'white',
                  height: '100%',
                  width: `${progressPercentage}%`,
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Add Session Button */}
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(37, 99, 235, 0.8)',
              backdropFilter: 'blur(10px)',
              color: 'white',
              border: '1px solid rgba(37, 99, 235, 0.5)',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.9rem',
              marginBottom: '1.5rem',
              transition: 'all 0.2s ease',
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37, 99, 235, 0.9)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37, 99, 235, 0.7)';
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37, 99, 235, 0.8)';
              (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37, 99, 235, 0.5)';
            }}
          >
            <Plus style={{ width: 18, height: 18 }} />
            Add New Session
          </button>

          {/* Add Session Form */}
          {showAddForm && (
            <form
              onSubmit={handleAddSession}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.5rem',
                marginBottom: '1.5rem',
                border: '1px solid rgba(255, 255, 255, 0.1)',
              }}
            >
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1rem', fontWeight: 600, color: '#f1f5f9' }}>
                Log New Mentorship Session
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    Date
                  </label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#f1f5f9',
                    }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                    Hours
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0.5"
                    max="8"
                    value={formData.hours}
                    onChange={(e) => setFormData({ ...formData, hours: e.target.value })}
                    required
                    style={{
                      width: '100%',
                      padding: '0.5rem',
                      background: 'rgba(255, 255, 255, 0.1)',
                      backdropFilter: 'blur(10px)',
                      border: '1px solid rgba(255, 255, 255, 0.2)',
                      borderRadius: '6px',
                      fontSize: '0.9rem',
                      color: '#f1f5f9',
                    }}
                  />
                </div>
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                  Mentor Email
                </label>
                <input
                  type="email"
                  value={formData.mentorEmail}
                  onChange={(e) => setFormData({ ...formData, mentorEmail: e.target.value })}
                  required
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#f1f5f9',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#f1f5f9',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 600, color: '#cbd5e1', marginBottom: '0.25rem' }}>
                  Prescription/Notes
                </label>
                <textarea
                  value={formData.prescription}
                  onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '0.5rem',
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    fontSize: '0.9rem',
                    color: '#f1f5f9',
                    resize: 'vertical',
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  type="submit"
                  style={{
                    background: 'rgba(37, 99, 235, 0.8)',
                    backdropFilter: 'blur(10px)',
                    color: 'white',
                    border: '1px solid rgba(37, 99, 235, 0.5)',
                    borderRadius: '6px',
                    padding: '0.6rem 1.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37, 99, 235, 0.9)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37, 99, 235, 0.7)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(37, 99, 235, 0.8)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(37, 99, 235, 0.5)';
                  }}
                >
                  Save Session
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddForm(false)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    backdropFilter: 'blur(10px)',
                    color: '#cbd5e1',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    borderRadius: '6px',
                    padding: '0.6rem 1.5rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '0.9rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.15)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = 'rgba(255, 255, 255, 0.1)';
                    (e.currentTarget as HTMLButtonElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                  }}
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Sessions List */}
          {loading ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              Loading sessions...
            </div>
          ) : sessions.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem', color: '#94a3b8' }}>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: '8px',
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                }}
              >
                <ClipboardList style={{ width: 24, height: 24, color: '#60a5fa' }} />
              </div>
              <p>No mentorship sessions recorded yet. Start by adding your first session.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {sessions.map((session) => (
                <div
                  key={session.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '12px',
                    padding: '1.25rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    gap: '1rem',
                    transition: 'all 0.2s ease',
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.08)';
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
                    (e.currentTarget as HTMLDivElement).style.background = 'rgba(255, 255, 255, 0.05)';
                  }}
                >
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: '8px',
                      background: session.verified ? 'rgba(34, 197, 94, 0.2)' : 'rgba(245, 158, 11, 0.2)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: session.verified ? '1px solid rgba(34, 197, 94, 0.5)' : '1px solid rgba(245, 158, 11, 0.5)',
                    }}
                  >
                    {session.verified ? (
                      <CheckCircle style={{ width: 20, height: 20, color: '#22c55e' }} />
                    ) : (
                      <Clock style={{ width: 20, height: 20, color: '#f59e0b' }} />
                    )}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                      <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                        {session.description}
                      </h4>
                      <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                        {session.hours}h
                      </span>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                      {session.mentorEmail} • {new Date(session.date).toLocaleDateString()}
                    </div>
                    {session.prescription && (
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', background: 'rgba(255, 255, 255, 0.05)', padding: '0.5rem', borderRadius: '6px', border: '1px solid rgba(255, 255, 255, 0.1)' }}>
                        <strong>Prescription:</strong> {session.prescription}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
