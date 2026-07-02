import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import type { UserProfile } from '../types/user';

interface MentorRecognitionSystemPageProps {
  onBack: () => void;
  userProfile?: UserProfile | null;
}

interface MentorProfile {
  id: string;
  user_id: string;
  mentor_level: 'foundation' | 'advanced' | 'master';
  recognition_status: 'pending' | 'initial_recognition' | 'advanced_recognition' | 'master_recognition';
  initial_recognition_date?: string;
  advanced_recognition_date?: string;
  master_recognition_date?: string;
  total_mentees_helped: number;
  mentorship_hours: number;
  airbus_interview_date?: string;
  airbus_interview_score?: number;
  airline_interview_date?: string;
  airline_interview_score?: number;
  psychological_change_score?: number;
  cognitive_thinking_score?: number;
  constructivism_score?: number;
  behavioral_assessment: any;
}

interface CompetencyEvaluation {
  id: string;
  competency_name: string;
  competency_code: string;
  category: string;
  description: string;
  weight_factor?: number;
  measurement_criteria?: string[];
  evaluation_methods?: string[];
  score?: number;
  evidence?: string;
  feedback?: string;
}

interface MentorSession {
  id: string;
  session_date: string;
  session_type: 'prescription' | 'problem_solving' | 'assessment' | 'consultation' | 'evaluation';
  duration_minutes: number;
  topic: string;
  session_notes: string;
  outcomes: string[];
}

interface MenteeProgress {
  id: string;
  mentee_name: string;
  start_date: string;
  current_status: 'active' | 'completed' | 'paused' | 'dropped';
  completion_percentage: number;
  total_session_hours: number;
  achievements: string[];
  challenges: string[];
}

export const MentorRecognitionSystemPage: React.FC<MentorRecognitionSystemPageProps> = ({ onBack, userProfile }) => {
  const [mentorProfile, setMentorProfile] = useState<MentorProfile | null>(null);
  const [competencies, setCompetencies] = useState<CompetencyEvaluation[]>([]);
  const [recentSessions, setRecentSessions] = useState<MentorSession[]>([]);
  const [mentees, setMentees] = useState<MenteeProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTab, setSelectedTab] = useState<'overview' | 'competencies' | 'sessions' | 'mentees'>('overview');

  useEffect(() => {
    if (userProfile?.uid) {
      fetchMentorData();
    }
  }, [userProfile?.uid]);

  const { callApi } = useWorkerAuth();

  const fetchMentorData = async () => {
    try {
      setLoading(true);

      // Fetch mentor profile
      const mentorRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentor_profiles',
        operation: 'select',
        where: { user_id: userProfile?.uid },
        limit: 1,
      });
      let mentorData: any = mentorRows?.[0];

      // Create mentor profile if it doesn't exist
      if (!mentorData) {
        const newMentor = await callApi('queryTable', {
          table: 'mentor_profiles',
          operation: 'insert',
          data: {
            user_id: userProfile?.uid,
            mentor_level: 'foundation',
            recognition_status: 'pending'
          },
        });
        mentorData = newMentor;
        setMentorProfile(mentorData);
      } else {
        setMentorProfile(mentorData);
      }

      // Fetch EBT CBTA competencies
      const competencyRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'ebt_cbta_competencies',
        operation: 'select',
        limit: 500,
      });
      const competencyData = (competencyRows || []).sort((a: any, b: any) => (a.category || '').localeCompare(b.category || ''));
      setCompetencies(competencyData as any);

      // Fetch recent mentor sessions
      const sessionRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentor_sessions',
        operation: 'select',
        where: { mentor_id: mentorData?.id || '' },
        limit: 10,
      });
      const sessionData = (sessionRows || []).sort((a: any, b: any) => (b.session_date || '').localeCompare(a.session_date || ''));
      setRecentSessions(sessionData as any);

      // Fetch mentee progress
      const menteeRows = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'mentee_progress',
        operation: 'select',
        where: { mentor_id: mentorData?.id || '' },
        limit: 500,
      });
      const menteeData = (menteeRows || []).sort((a: any, b: any) => (b.start_date || '').localeCompare(a.start_date || ''));

      // Fetch users for mentee names
      const userIds = menteeData.map((m: any) => m.mentee_id).filter(Boolean);
      let usersMap = new Map<string, any>();
      if (userIds.length > 0) {
        const userRows = await callApi<Record<string, unknown>[]>('queryTable', {
          table: 'profiles',
          operation: 'select',
          limit: 500,
        });
        (userRows || []).forEach((u: any) => { if (u.id) usersMap.set(u.id, u); });
      }

      const menteeProgress = menteeData.map((mp: any) => {
        const user = usersMap.get(mp.mentee_id);
        return {
          ...mp,
          mentee_name: user ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'Unknown Mentee'
        };
      });
      setMentees(menteeProgress);

    } catch (error) {
      console.error('Error fetching mentor data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getRecognitionStatusColor = (status: string) => {
    switch (status) {
      case 'master_recognition': return '#10b981';
      case 'advanced_recognition': return '#3b82f6';
      case 'initial_recognition': return '#f59e0b';
      case 'pending': return '#6b7280';
      default: return '#6b7280';
    }
  };

  const getRecognitionStatusText = (status: string) => {
    switch (status) {
      case 'master_recognition': return 'Master Recognition';
      case 'advanced_recognition': return 'Advanced Recognition';
      case 'initial_recognition': return 'Initial Recognition';
      case 'pending': return 'Pending Recognition';
      default: return 'Unknown Status';
    }
  };

  const getCompetencyScoreColor = (score: number) => {
    if (score >= 9) return '#10b981';
    if (score >= 8) return '#3b82f6';
    if (score >= 7) return '#f59e0b';
    if (score >= 6) return '#f97316';
    return '#ef4444';
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'prescription': return '📋';
      case 'problem_solving': return '🔧';
      case 'assessment': return '📊';
      case 'consultation': return '💬';
      case 'evaluation': return '⭐';
      default: return '📝';
    }
  };

  if (loading) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center' }}>
        <div style={{ fontSize: '1.2rem', color: '#6b7280' }}>Loading Mentor Recognition System...</div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
        <button
          onClick={onBack}
          style={{
            padding: '0.5rem 1rem',
            background: 'white',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}
        >
          <Icons.ArrowLeft style={{ width: 16, height: 16 }} />
          Back
        </button>
        <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: 'bold', color: '#1f2937' }}>
          Mentor Recognition System
        </h1>
      </div>

      {/* Recognition Status Overview */}
      {mentorProfile && (
        <div style={{
          background: 'white',
          border: '1px solid #e2e8f0',
          borderRadius: '12px',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <div>
              <h2 style={{ margin: '0 0 0.5rem 0', fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                Your Recognition Status
              </h2>
              <div style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                padding: '0.5rem 1rem',
                background: getRecognitionStatusColor(mentorProfile.recognition_status),
                color: 'white',
                borderRadius: '20px',
                fontSize: '0.9rem',
                fontWeight: '500'
              }}>
                {getRecognitionStatusText(mentorProfile.recognition_status)}
              </div>
            </div>
            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '2rem', fontWeight: 'bold', color: getRecognitionStatusColor(mentorProfile.recognition_status) }}>
                {mentorProfile.total_mentees_helped}
              </div>
              <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>Mentees Helped</div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Mentorship Hours</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mentorProfile.mentorship_hours}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Airbus Interview</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mentorProfile.airbus_interview_score || 'Not Completed'}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Airline Interview</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mentorProfile.airline_interview_score || 'Not Completed'}
              </div>
            </div>
            <div style={{ padding: '1rem', background: '#f9fafb', borderRadius: '8px' }}>
              <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>Behavioral Change</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                {mentorProfile.psychological_change_score ? 
                  `${mentorProfile.psychological_change_score}/10` : 'Not Assessed'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Navigation Tabs */}
      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e2e8f0' }}>
        {['overview', 'competencies', 'sessions', 'mentees'].map((tab) => (
          <button
            key={tab}
            onClick={() => setSelectedTab(tab as any)}
            style={{
              padding: '1rem 1.5rem',
              border: 'none',
              borderBottom: selectedTab === tab ? '2px solid #3b82f6' : '2px solid transparent',
              background: selectedTab === tab ? '#f8fafc' : 'white',
              color: selectedTab === tab ? '#3b82f6' : '#6b7280',
              cursor: 'pointer',
              fontWeight: selectedTab === tab ? '600' : '400',
              textTransform: 'capitalize'
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div>
        {selectedTab === 'overview' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            {/* EBT CBTA Framework Overview */}
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                EBT CBTA Core Competencies
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
                {competencies.slice(0, 6).map((competency) => (
                  <div key={competency.id} style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                      {competency.competency_name}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                      {competency.category}
                    </div>
                    <div style={{ fontSize: '0.9rem', color: '#475569', lineHeight: 1.4 }}>
                      {competency.description}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                Recent Mentor Sessions
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentSessions.slice(0, 5).map((session) => (
                  <div key={session.id} style={{
                    padding: '1rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}>
                    <div style={{ fontSize: '1.5rem' }}>
                      {getSessionTypeIcon(session.session_type)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', color: '#1f2937' }}>
                        {session.topic || 'Session'}
                      </div>
                      <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                        {new Date(session.session_date).toLocaleDateString()} • {session.duration_minutes} minutes
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: '#e0f2fe',
                      color: '#0284c7',
                      borderRadius: '12px',
                      fontSize: '0.8rem',
                      fontWeight: '500'
                    }}>
                      {session.session_type.replace('_', ' ')}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'competencies' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                EBT CBTA Competency Framework
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {competencies.map((competency) => (
                  <div key={competency.id} style={{
                    padding: '1.5rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>
                          {competency.competency_name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '0.5rem' }}>
                          {competency.competency_code} • {competency.category}
                        </div>
                      </div>
                      <div style={{
                        padding: '0.25rem 0.75rem',
                        background: '#e0f2fe',
                        color: '#0284c7',
                        borderRadius: '12px',
                        fontSize: '0.8rem',
                        fontWeight: '500'
                      }}>
                        Weight: {competency.weight_factor}
                      </div>
                    </div>
                    <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                      {competency.description}
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Measurement Criteria</div>
                        <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                          {competency.measurement_criteria?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Evaluation Methods</div>
                        <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                          {competency.evaluation_methods?.slice(0, 3).join(', ')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'sessions' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                Mentor Session History
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {recentSessions.map((session) => (
                  <div key={session.id} style={{
                    padding: '1.5rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ fontSize: '2rem' }}>
                          {getSessionTypeIcon(session.session_type)}
                        </div>
                        <div>
                          <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>
                            {session.topic || 'Mentor Session'}
                          </div>
                          <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                            {new Date(session.session_date).toLocaleDateString()} • {session.duration_minutes} minutes
                          </div>
                        </div>
                      </div>
                      <div style={{
                        padding: '0.5rem 1rem',
                        background: '#e0f2fe',
                        color: '#0284c7',
                        borderRadius: '12px',
                        fontSize: '0.9rem',
                        fontWeight: '500'
                      }}>
                        {session.session_type.replace('_', ' ')}
                      </div>
                    </div>
                    {session.session_notes && (
                      <div style={{ color: '#475569', lineHeight: 1.6, marginBottom: '1rem' }}>
                        {session.session_notes}
                      </div>
                    )}
                    {session.outcomes && session.outcomes.length > 0 && (
                      <div>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          Session Outcomes:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {session.outcomes.map((outcome, index) => (
                            <span key={index} style={{
                              padding: '0.25rem 0.75rem',
                              background: '#dcfce7',
                              color: '#166534',
                              borderRadius: '12px',
                              fontSize: '0.8rem'
                            }}>
                              {outcome}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {selectedTab === 'mentees' && (
          <div style={{ display: 'grid', gap: '1.5rem' }}>
            <div style={{
              background: 'white',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '1.5rem'
            }}>
              <h3 style={{ margin: '0 0 1rem 0', fontSize: '1.2rem', fontWeight: '600', color: '#1f2937' }}>
                Mentee Progress Tracking
              </h3>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {mentees.map((mentee) => (
                  <div key={mentee.id} style={{
                    padding: '1.5rem',
                    background: '#f9fafb',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                      <div>
                        <div style={{ fontWeight: '600', color: '#1f2937', fontSize: '1.1rem' }}>
                          {mentee.mentee_name}
                        </div>
                        <div style={{ fontSize: '0.9rem', color: '#6b7280' }}>
                          Started: {new Date(mentee.start_date).toLocaleDateString()}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{
                          padding: '0.5rem 1rem',
                          background: mentee.current_status === 'active' ? '#dcfce7' : '#fef3c7',
                          color: mentee.current_status === 'active' ? '#166534' : '#92400e',
                          borderRadius: '12px',
                          fontSize: '0.9rem',
                          fontWeight: '500'
                        }}>
                          {mentee.current_status}
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
                            {mentee.completion_percentage}%
                          </div>
                          <div style={{ fontSize: '0.8rem', color: '#6b7280' }}>Complete</div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Progress Bar */}
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{ height: '8px', background: '#e5e7eb', borderRadius: '4px', overflow: 'hidden' }}>
                        <div style={{
                          height: '100%',
                          width: `${mentee.completion_percentage}%`,
                          background: '#10b981',
                          transition: 'width 0.3s ease'
                        }} />
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Session Hours</div>
                        <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1f2937' }}>
                          {mentee.total_session_hours}
                        </div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.8rem', color: '#6b7280', marginBottom: '0.25rem' }}>Achievements</div>
                        <div style={{ fontSize: '0.9rem', color: '#1f2937' }}>
                          {mentee.achievements?.length || 0} completed
                        </div>
                      </div>
                    </div>

                    {mentee.achievements && mentee.achievements.length > 0 && (
                      <div style={{ marginTop: '1rem' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.5rem' }}>
                          Recent Achievements:
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                          {mentee.achievements.slice(0, 3).map((achievement, index) => (
                            <span key={index} style={{
                              padding: '0.25rem 0.75rem',
                              background: '#dbeafe',
                              color: '#1e40af',
                              borderRadius: '12px',
                              fontSize: '0.8rem'
                            }}>
                              {achievement}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
