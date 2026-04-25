/**
 * MentorProfilePage Component
 * 
 * Detailed mentor profile page with expertise areas, stats, and reviews
 */

import React, { useState, useEffect } from 'react';
import { Icons } from '../icons';
import { User, MapPin, Clock, Award, Star, Mail, Plane, GraduationCap, Briefcase, MessageSquare, CheckCircle } from 'lucide-react';
import { useMentorshipTracking } from '../../src/hooks/useMentorshipTracking';

interface MentorProfilePageProps {
  onBack: () => void;
  mentorId: string;
  isCurrentUser?: boolean;
}

interface MentorProfile {
  id: string;
  full_name: string;
  email: string;
  profile_image_url?: string;
  total_flight_hours: number;
  aircraft_rated_on?: string;
  experience_description?: string;
  mentor_tier?: string;
  mentorship_hours: number;
  mentorship_endorsement: number;
  country?: string;
  ratings?: string[];
  program_interests?: string[];
  pathway_interests?: string[];
  job_experiences?: any[];
}

const CategorySection: React.FC<{ title: string; description?: string; children: React.ReactNode }> = ({ title, description, children }) => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
    <div>
      <p style={{ margin: 0, fontSize: '0.8rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#94a3b8', fontWeight: 600 }}>{title}</p>
      {description && <p style={{ margin: '0.25rem 0 0', color: '#475569', fontSize: '0.9rem' }}>{description}</p>}
    </div>
    {children}
  </div>
);

const Icon: React.FC<{ name: keyof typeof Icons; style?: React.CSSProperties }> = ({ name, style }) => {
  try {
    const IconComponent = Icons[name];
    if (IconComponent) {
      return <IconComponent style={style} />;
    }
  } catch (error) {
    console.warn(`Icon ${name} failed:`, error);
  }
  const fallbacks: Record<string, string> = {
    ArrowLeft: '←', ArrowRight: '→', Award: '🏆', CheckCircle: '✓',
    Activity: '📊', Clock: '⏱', BookOpen: '📖', FileText: '📄',
    ChevronRight: '›', TrendingUp: '📈', MessageSquare: '💬',
    Clipboard: '📋', Users: '👥'
  };
  return <span style={style}>{fallbacks[name] || '•'}</span>;
};

export const MentorProfilePage: React.FC<MentorProfilePageProps> = ({ onBack, mentorId, isCurrentUser = false }) => {
  const [mentor, setMentor] = useState<MentorProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'sessions' | 'reviews'>('overview');

  const { stats } = useMentorshipTracking(mentorId, 'mentor');

  useEffect(() => {
    fetchMentorProfile();
  }, [mentorId]);

  const fetchMentorProfile = async () => {
    try {
      setLoading(true);
      const { supabase } = await import('../lib/supabase-auth');
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', mentorId)
        .single();

      if (error) throw error;
      setMentor(data as MentorProfile);
    } catch (error) {
      console.error('Error fetching mentor profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', backgroundColor: '#eef4fb' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
      </div>
    );
  }

  if (!mentor) {
    return (
      <div style={{ padding: '2rem', textAlign: 'center', backgroundColor: '#eef4fb', minHeight: '100vh' }}>
        <p style={{ color: '#64748b' }}>Mentor profile not found</p>
        <button onClick={onBack} style={{ marginTop: '1rem', padding: '0.5rem 1rem', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
          Go Back
        </button>
      </div>
    );
  }

  const getTierBadge = (tier?: string) => {
    if (!tier) return null;
    const colors = {
      senior: 'bg-purple-100 text-purple-700',
      expert: 'bg-blue-100 text-blue-700',
      standard: 'bg-gray-100 text-gray-700',
    };
    return (
      <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium ${colors[tier as keyof typeof colors] || colors.standard}`}>
        <Award className="w-4 h-4" />
        {tier.charAt(0).toUpperCase() + tier.slice(1)} Mentor
      </span>
    );
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem', minHeight: '100vh' }}>
      <main style={{ position: 'relative', width: '100%', maxWidth: '1200px', margin: '0 auto', minHeight: '100vh' }}>
        {/* Header */}
        <header style={{
          padding: '3rem 4rem',
          background: 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
          position: 'relative',
          borderBottom: '1px solid #e2e8f0'
        }}>
          <button
            onClick={onBack}
            style={{
              position: 'absolute',
              top: '2rem',
              left: '2rem',
              padding: '0.5rem 1rem',
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: 500,
              color: '#475569'
            }}
          >
            <Icon name="ArrowLeft" style={{ width: 16, height: 16 }} />
            Back
          </button>

          <div style={{ display: 'flex', alignItems: 'start', gap: '2rem', marginTop: '2rem' }}>
            {/* Profile Image */}
            <div style={{
              width: '120px',
              height: '120px',
              borderRadius: '50%',
              background: mentor.profile_image_url
                ? `url(${mentor.profile_image_url}) center/cover`
                : 'linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '2.5rem',
              fontWeight: 700,
              color: 'white',
              flexShrink: 0,
              border: '4px solid white',
              boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)'
            }}>
              {!mentor.profile_image_url && mentor.full_name?.split(' ').map(n => n[0]).join('')}
            </div>

            {/* Profile Info */}
            <div style={{ flex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
                <h1 style={{ fontSize: '2rem', margin: 0, color: '#0f172a', fontWeight: 600 }}>
                  {mentor.full_name}
                </h1>
                {getTierBadge(mentor.mentor_tier)}
              </div>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '2rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Clock className="w-4 h-4" />
                  <span>{mentor.total_flight_hours?.toFixed(0) || 0} hours</span>
                </div>
                {mentor.country && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                    <MapPin className="w-4 h-4" />
                    <span>{mentor.country}</span>
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#64748b' }}>
                  <Star className="w-4 h-4" />
                  <span>{mentor.mentorship_endorsement?.toFixed(1) || 'N/A'}/5.0</span>
                </div>
              </div>

              {mentor.experience_description && (
                <p style={{ color: '#475569', fontSize: '1rem', lineHeight: 1.6, maxWidth: '700px' }}>
                  {mentor.experience_description}
                </p>
              )}
            </div>

            {/* Action Button */}
            {!isCurrentUser && (
              <button style={{
                padding: '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                whiteSpace: 'nowrap'
              }}>
                Request Mentorship
              </button>
            )}
          </div>
        </header>

        <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          {/* Tabs */}
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '2px solid #e2e8f0' }}>
            <button
              onClick={() => setActiveTab('overview')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === 'overview' ? '#3b82f6' : '#64748b',
                borderBottom: activeTab === 'overview' ? '2px solid #3b82f6' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('sessions')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === 'sessions' ? '#3b82f6' : '#64748b',
                borderBottom: activeTab === 'sessions' ? '2px solid #3b82f6' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              Sessions
            </button>
            <button
              onClick={() => setActiveTab('reviews')}
              style={{
                padding: '0.75rem 1.5rem',
                border: 'none',
                background: 'transparent',
                fontSize: '1rem',
                fontWeight: 600,
                cursor: 'pointer',
                color: activeTab === 'reviews' ? '#3b82f6' : '#64748b',
                borderBottom: activeTab === 'reviews' ? '2px solid #3b82f6' : '2px solid transparent',
                marginBottom: '-2px'
              }}
            >
              Reviews
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            {activeTab === 'overview' && (
              <>
                <CategorySection title="Mentorship Statistics" description="Track mentor impact and engagement">
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
                        <Clock className="w-5 h-5" />
                        <span style={{ fontSize: '0.875rem' }}>Total Hours</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {stats?.totalHours.toFixed(0) || mentor.mentorship_hours?.toFixed(0) || 0}
                      </p>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
                        <User className="w-5 h-5" />
                        <span style={{ fontSize: '0.875rem' }}>Sessions</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {stats?.totalSessions || 0}
                      </p>
                    </div>
                    <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#64748b' }}>
                        <Star className="w-5 h-5" />
                        <span style={{ fontSize: '0.875rem' }}>Avg Rating</span>
                      </div>
                      <p style={{ fontSize: '2rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>
                        {stats?.averageRating.toFixed(1) || mentor.mentorship_endorsement?.toFixed(1) || 'N/A'}
                      </p>
                    </div>
                  </div>
                </CategorySection>

                <CategorySection title="Expertise Areas" description="Aircraft types and specializations">
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    {mentor.aircraft_rated_on && (
                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <Plane className="w-5 h-5 text-blue-600" />
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            Aircraft Expertise
                          </h3>
                        </div>
                        <p style={{ color: '#475569', fontSize: '1rem' }}>{mentor.aircraft_rated_on}</p>
                      </div>
                    )}

                    {mentor.ratings && mentor.ratings.length > 0 && (
                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <GraduationCap className="w-5 h-5 text-purple-600" />
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            Ratings & Certifications
                          </h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {mentor.ratings.map((rating, index) => (
                            <span key={index} style={{ padding: '0.5rem 1rem', background: '#f1f5f9', borderRadius: '8px', fontSize: '0.875rem', color: '#475569' }}>
                              {rating}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {mentor.program_interests && mentor.program_interests.length > 0 && (
                      <div style={{ background: 'white', padding: '1.5rem', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                          <Briefcase className="w-5 h-5 text-green-600" />
                          <h3 style={{ fontSize: '1.125rem', fontWeight: 600, color: '#0f172a', margin: 0 }}>
                            Program Interests
                          </h3>
                        </div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                          {mentor.program_interests.map((interest, index) => (
                            <span key={index} style={{ padding: '0.5rem 1rem', background: '#ecfdf5', borderRadius: '8px', fontSize: '0.875rem', color: '#166534' }}>
                              {interest}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CategorySection>
              </>
            )}

            {activeTab === 'sessions' && (
              <CategorySection title="Recent Sessions" description="Latest mentorship sessions and activities">
                {stats?.recentSessions && stats.recentSessions.length > 0 ? (
                  <div style={{ display: 'grid', gap: '1rem' }}>
                    {stats.recentSessions.map((session, index) => (
                      <div key={index} style={{ background: 'white', padding: '1rem', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div>
                            <p style={{ fontWeight: 600, color: '#0f172a', margin: '0 0 0.25rem 0' }}>
                              {session.topic || 'Mentorship Session'}
                            </p>
                            <p style={{ fontSize: '0.875rem', color: '#64748b', margin: 0 }}>
                              {new Date(session.session_date).toLocaleDateString()} • {session.duration_hours}h
                            </p>
                          </div>
                          <span style={{ padding: '0.25rem 0.75rem', background: '#f1f5f9', borderRadius: '12px', fontSize: '0.75rem', color: '#64748b' }}>
                            {session.session_type}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                    <MessageSquare className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                    <p style={{ color: '#64748b' }}>No sessions recorded yet</p>
                  </div>
                )}
              </CategorySection>
            )}

            {activeTab === 'reviews' && (
              <CategorySection title="Mentee Reviews" description="Feedback from mentees">
                <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <Star className="w-12 h-12 text-gray-300 mx-auto mb-2" />
                  <p style={{ color: '#64748b' }}>Reviews coming soon</p>
                </div>
              </CategorySection>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};
