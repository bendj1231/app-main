import React, { useState, useEffect } from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/src/lib/supabase';
import { TrendingUp, Award, Clock, CheckCircle, ArrowRight } from 'lucide-react';

interface FoundationalProgressPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  status: 'completed' | 'in_progress' | 'pending';
  completedDate?: string;
}

export const FoundationalProgressPage: React.FC<FoundationalProgressPageProps> = ({ 
  onBack, 
  onNavigate 
}) => {
  const { userProfile } = useAuth();
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProgressData();
  }, [userProfile?.uid]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      
      // Fetch portfolio data
      const { data: portfolioData, error } = await supabase
        .from('pilot_portfolio')
        .select('*')
        .eq('user_id', userProfile?.uid)
        .maybeSingle();

      if (error && error.code !== 'PGRST116') {
        console.error('Error fetching portfolio:', error);
      }

      // Mock milestones based on portfolio data
      const mockMilestones: Milestone[] = [
        {
          id: '1',
          title: 'Foundation Program Enrollment',
          description: 'Successfully enrolled in the Foundation Program',
          status: portfolioData ? 'completed' : 'completed',
          completedDate: new Date().toISOString(),
        },
        {
          id: '2',
          title: 'Pilot Gap Module 1',
          description: 'Complete Industry Familiarization & Indoctrination',
          status: 'pending',
        },
        {
          id: '3',
          title: 'Pilot Gap Module 2',
          description: 'Complete Low-Timer & Pilot Shortage analysis',
          status: 'pending',
        },
        {
          id: '4',
          title: 'Risk Management Module',
          description: 'Complete Pilot Risk Management training',
          status: 'pending',
        },
        {
          id: '5',
          title: '50-Hour Mentorship',
          description: 'Complete 50 hours of mentorship sessions',
          status: 'in_progress',
        },
        {
          id: '6',
          title: 'Final Examination',
          description: 'Pass the Foundation Program final examination',
          status: 'pending',
        },
      ];

      setMilestones(mockMilestones);
    } catch (err) {
      console.error('Error fetching progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';
  const completedCount = milestones.filter(m => m.status === 'completed').length;
  const totalCount = milestones.length;
  const progressPercentage = Math.round((completedCount / totalCount) * 100);

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
              Progress & Examination Board
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
                  Overall Progress
                </h3>
                <p style={{ margin: 0, fontSize: '0.85rem', opacity: 0.9 }}>
                  {completedCount} of {totalCount} milestones completed
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

          {/* Milestones Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
            }}
          >
            {milestones.map((milestone) => (
              <div
                key={milestone.id}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(20px)',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
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
                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '0.75rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: '50%',
                      background: milestone.status === 'completed' ? 'rgba(34, 197, 94, 0.8)' : milestone.status === 'in_progress' ? 'rgba(245, 158, 11, 0.8)' : 'rgba(203, 213, 225, 0.8)',
                      backdropFilter: 'blur(10px)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                      border: milestone.status === 'completed' ? '1px solid rgba(34, 197, 94, 0.5)' : milestone.status === 'in_progress' ? '1px solid rgba(245, 158, 11, 0.5)' : '1px solid rgba(203, 213, 225, 0.5)',
                    }}
                  >
                    {milestone.status === 'completed' ? (
                      <CheckCircle style={{ width: 14, height: 14, color: 'white' }} />
                    ) : milestone.status === 'in_progress' ? (
                      <Clock style={{ width: 14, height: 14, color: 'white' }} />
                    ) : (
                      <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#94a3b8' }} />
                    )}
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '0.9rem', fontWeight: 600, color: '#f1f5f9' }}>
                      {milestone.title}
                    </h4>
                    <p style={{ margin: '0.25rem 0 0', fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.4 }}>
                      {milestone.description}
                    </p>
                  </div>
                </div>
                {milestone.completedDate && (
                  <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.5rem' }}>
                    Completed: {new Date(milestone.completedDate).toLocaleDateString()}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Examination Section */}
          <div
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              backdropFilter: 'blur(20px)',
              borderRadius: '12px',
              padding: '1.5rem',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
              <div
                style={{
                  width: 24,
                  height: 24,
                  borderRadius: '8px',
                  background: 'rgba(37, 99, 235, 0.2)',
                  backdropFilter: 'blur(10px)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#60a5fa',
                  border: '1px solid rgba(37, 99, 235, 0.3)',
                }}
              >
                <Award style={{ width: 16, height: 16, color: '#60a5fa' }} />
              </div>
              <h3 style={{ margin: 0, fontSize: '1.1rem', fontWeight: 600, color: '#f1f5f9' }}>
                Upcoming Examinations
              </h3>
            </div>
            <div style={{ color: '#cbd5e1', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <p style={{ margin: 0 }}>
                No upcoming examinations scheduled. Complete the required modules to unlock the Foundation Program final examination.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
