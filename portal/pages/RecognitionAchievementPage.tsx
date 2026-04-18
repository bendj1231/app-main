import React, { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase-auth';
import { Icons } from '../icons';




interface RecognitionAchievementPageProps {
  onBack: () => void;
  onViewExams?: () => void;
  onViewAtlas?: () => void;
  onViewLicensureExperience?: () => void;
  userProfile?: { id?: string; uid?: string; email?: string; firstName?: string; lastName?: string } | null;
  preloadedAchievements?: any[];
  preloadedPortfolio?: any;
  onNavigateToDirectory?: () => void;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  date: string;
  icon: string;
  color: string;
  category: string;
}

const renderCard = (card: {
  title: string;
  description: string;
  cta?: string;
  filled?: boolean;
  progress?: number;
  onClick?: (() => void) | undefined;
}) => (
  <div key={card.title} className="recognition-glass-card" style={{
    background: 'rgba(255, 255, 255, 0.9)',
    borderRadius: '24px',
    padding: '1.75rem',
    boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
    display: 'grid',
    gridTemplateColumns: '1fr auto',
    gap: '1.5rem',
    alignItems: 'center'
  }}>
    <div>
      <h3 style={{ margin: '0 0 0.5rem', fontWeight: 700, fontSize: '1.25rem', color: '#0f172a' }}>{card.title}</h3>
      <p style={{ margin: 0, color: '#475569', fontSize: '0.95rem', lineHeight: 1.5 }}>{card.description}</p>
      {card.progress !== undefined && (
        <div style={{ marginTop: '1rem' }}>
          <div style={{ height: '6px', borderRadius: '999px', background: '#e2e8f0', overflow: 'hidden' }}>
            <div style={{ width: `${card.progress}%`, height: '100%', background: 'linear-gradient(90deg, #34d399, #0ea5e9)' }} />
          </div>
          <p style={{ margin: '0.4rem 0 0', fontSize: '0.8rem', color: '#475569', fontWeight: 600 }}>{card.progress}% complete</p>
        </div>
      )}
    </div>
    {card.cta && (
      <button
        style={{
          padding: '0.65rem 1.75rem',
          borderRadius: '999px',
          border: card.filled ? 'none' : '1px solid #cbd5e1',
          background: card.filled ? '#0ea5e9' : 'transparent',
          color: card.filled ? '#fff' : '#0f172a',
          fontWeight: 600,
          cursor: 'pointer'
        }}
        onClick={card.onClick}
      >
        {card.cta}
      </button>
    )}
  </div>
);

export const RecognitionAchievementPage: React.FC<RecognitionAchievementPageProps> = ({ 
  onBack, 
  onViewExams, 
  onViewAtlas, 
  onViewLicensureExperience,
  userProfile, 
  preloadedAchievements,
  preloadedPortfolio,
  onNavigateToDirectory
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>(preloadedAchievements || []);
  const [stats, setStats] = useState({ awards: preloadedPortfolio?.awards_count || 0, hours: preloadedPortfolio?.total_hours || 0, skills: preloadedPortfolio?.skills?.length || 0, certifications: preloadedPortfolio?.certifications_count || 0 });
  const [progress, setProgress] = useState({ foundational: preloadedPortfolio?.pilot_gap_module_completion?.foundational || 0 });
  const [loading, setLoading] = useState(!preloadedAchievements);
  const [mentorshipHours, setMentorshipHours] = useState<number>(0);
  const [enrolledPrograms, setEnrolledPrograms] = useState<string[]>([]);
  const [examData, setExamData] = useState<any>(null);
  const [licensureData, setLicensureData] = useState<any>(null);

  // Fetch mentorship hours from Supabase
  const fetchMentorshipHours = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('study_sessions')
        .select('duration')
        .eq('user_id', uid)
        .eq('session_type', 'mentorship');

      if (error) {
        console.warn('Unable to fetch mentor hours:', error);
        return 0;
      }

      if (data && data.length > 0) {
        const totalMinutes = data.reduce((sum, session) => sum + (session.duration || 0), 0);
        return Math.round(totalMinutes / 60);
      }

      return 0;
    } catch (error) {
      console.warn('Error fetching mentorship hours:', error);
      return 0;
    }
  };

  // Fetch enrollment status from Supabase
  const fetchEnrollmentStatus = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('enrolled_programs')
        .eq('id', uid)
        .maybeSingle();

      if (error) {
        console.warn('Unable to fetch enrollment status:', error);
        return [];
      }

      if (data && data.enrolled_programs) {
        return data.enrolled_programs;
      }

      return [];
    } catch (error) {
      console.warn('Error fetching enrollment status:', error);
      return [];
    }
  };

  // Fetch exam data from Supabase
  const fetchExamData = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('exam_results')
        .select('*')
        .eq('user_id', uid)
        .order('exam_date', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) {
        console.warn('Unable to fetch exam data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error fetching exam data:', error);
      return null;
    }
  };

  // Fetch licensure data from Supabase
  const fetchLicensureData = async (uid: string) => {
    try {
      const { data, error } = await supabase
        .from('pilot_licensure_experience')
        .select('*')
        .eq('user_id', uid)
        .maybeSingle();

      if (error) {
        console.warn('Unable to fetch licensure data:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.warn('Error fetching licensure data:', error);
      return null;
    }
  };

  // Fetch program progress from Supabase
  useEffect(() => {
    const fetchProgramProgress = async () => {
      if (!userProfile?.uid) return;
      
      try {
        if (!db) {
          console.error('Firestore not initialized');
          setLoading(false);
          return;
        }
        const achievementsRef = collection(db, 'achievements');
        const userId = userProfile?.id || userProfile?.uid;
        const { data, error } = await supabase
          .from('program_progress')
          .select('*')
          .eq('user_id', userId)
          .eq('program_type', 'Foundational')
          .maybeSingle();

        if (error) {
          console.log('No program progress found, using defaults');
        } else if (data) {
          // Update progress with real data from Supabase
          setProgress({
            foundational: data.completion_percentage || 0
          });
        }
      } catch (err) {
        console.error('Error fetching program progress:', err);
      }
    };

    fetchProgramProgress();
  }, [userProfile?.uid]);

  useEffect(() => {
    if (preloadedAchievements && preloadedPortfolio) {
      // Use preloaded data
      processAchievementData(preloadedAchievements, preloadedPortfolio);
    } else if (userProfile?.uid) {
      loadRecognitionData();
    }
  }, [userProfile?.id || userProfile?.uid, preloadedAchievements, preloadedPortfolio]);

  // Fetch mentorship hours when user profile loads
  useEffect(() => {
    if (userProfile?.uid) {
      fetchMentorshipHours(userProfile.uid).then(hours => {
        setMentorshipHours(hours);
      });
    }
  }, [userProfile?.uid]);

  // Fetch enrollment status, exam data, and licensure data when user profile loads
  useEffect(() => {
    if (userProfile?.uid) {
      fetchEnrollmentStatus(userProfile.uid).then(programs => {
        setEnrolledPrograms(programs);
      });
      fetchExamData(userProfile.uid).then(data => {
        setExamData(data);
      });
      fetchLicensureData(userProfile.uid).then(data => {
        setLicensureData(data);
      });
    }
  }, [userProfile?.uid]);

  const processAchievementData = (achievementData: any[], portfolioData: any) => {
    const parsedAchievements: Achievement[] = [];
    let awards = portfolioData?.awards_count || 0;
    let certifications = portfolioData?.certifications_count || 0;
    let skillsMastered = portfolioData?.skills?.length || 0;
    let milestones = 0;

    if (achievementData) {
      achievementData.forEach((achievement: any) => {
        parsedAchievements.push({
          id: achievement.id,
          title: achievement.title || achievement.name,
          description: achievement.description,
          date: achievement.achievement_date || achievement.date,
          icon: achievement.icon || 'award',
          color: achievement.color || '#3b82f6',
          category: achievement.category
        });

        // Count categories
        if (achievement.category === 'award') awards++;
        if (achievement.category === 'certification') certifications++;
        if (achievement.category === 'skill') skillsMastered++;
        if (achievement.category === 'milestone') milestones++;
      });
    }

    setAchievements(parsedAchievements);
    setStats({
      awards,
      hours: portfolioData?.total_hours || 0,
      skills: skillsMastered,
      certifications
    });
    setProgress({
      foundational: portfolioData?.pilot_gap_module_completion?.foundational || 0
    });
    setLoading(false);
  };

  const loadRecognitionData = async () => {
    if (!userProfile?.uid) return;

    try {
      setLoading(true);
      
      // Fetch achievements from Supabase
      const { data: achievementData, error: achievementError } = await supabase
        .from('achievements')
        .select('*')
        .eq('user_id', userProfile.uid)
        .order('achievement_date', { ascending: false });

      if (achievementError) {
        throw achievementError;
      }

      // Fetch portfolio for stats
      const { data: portfolioData } = await supabase
        .from('pilot_portfolio_data')
        .select('*')
        .eq('user_id', userProfile.uid)
        .maybeSingle();

      processAchievementData(achievementData || [], portfolioData || {});
    } catch (error) {
      console.error('Failed to load recognition data:', error);
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-y-auto" style={{ padding: '0.4rem', maxWidth: '1200px', margin: '0 auto', minHeight: 'auto' }}>
      <main className="w-full max-w-5xl mx-auto min-h-full bg-white shadow-sm" style={{ position: 'relative', padding: '1rem' }}>
        <button
          onClick={onBack}
          style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.5rem 1rem',
            border: 'none',
            background: 'transparent',
            cursor: 'pointer',
            fontSize: '0.875rem',
            color: '#475569',
            fontWeight: 500,
            transition: 'all 0.2s ease'
          }}
          onMouseOver={(e) => {
            e.currentTarget.style.color = '#0f172a';
            e.currentTarget.style.transform = 'translateX(-4px)';
          }}
          onMouseOut={(e) => {
            e.currentTarget.style.color = '#475569';
            e.currentTarget.style.transform = 'translateX(0)';
          }}
        >
          <span style={{ fontSize: '16px' }}>←</span> Back to Hub
        </button>

        {/* Centered Header with Logo */}
        <div className="dashboard-header" style={{ marginBottom: '2rem', textAlign: 'center', paddingTop: '1rem' }}>
          <div style={{ marginBottom: '1rem' }}>
            <img src="/logo.png" alt="WingMentor" style={{ height: '48px', margin: '0 auto' }} />
          </div>
          <div className="dashboard-subtitle" style={{ letterSpacing: '0.3em', color: '#2563eb', fontWeight: 700, fontSize: '0.75rem', marginBottom: '0.75rem', textTransform: 'uppercase' }}>
            Your Pilot Digital Footprint to Pathways
          </div>
          <h1 className="dashboard-title" style={{ margin: '0 0 0.5rem', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.02em', fontFamily: 'Georgia, serif' }}>
            Pilot Recognition & Achievements
          </h1>
          <p style={{ margin: '1rem auto 0', color: '#64748b', lineHeight: 1.7, fontSize: '0.95rem', maxWidth: '36rem' }}>
            View your awards, flight hours, certifications, and professional milestones earned through your training journey.
          </p>
        </div>
        {/* Section Header with Two-Column Layout */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Pilot Recognition Credentials</h2>
          <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Awards, Certifications & Achievements</span>
        </div>

        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Programs Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Programs</h2>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Training Progress & Resources</span>
            </div>
            {enrolledPrograms.map(program => {
              if (program === 'Foundational') {
                return renderCard({
                  title: 'Foundation Program',
                  description: 'Track your current completion progress synced directly from the foundational program dashboard.',
                  progress: progress.foundational,
                  filled: true
                });
              } else if (program === 'Mentorship') {
                return renderCard({
                  title: 'Mentorship Logbook Directory',
                  description: 'Access your verified mentorship sessions, mentor feedback, and 50-hour certification progress.',
                  progress: Math.min(100, Math.round((mentorshipHours / 50) * 100)),
                  filled: true
                });
              }
              return null;
            })}
            {enrolledPrograms.length === 0 && (
              <p style={{ color: '#64748b', fontSize: '0.9rem', fontStyle: 'italic' }}>No enrolled programs</p>
            )}

            {/* Official Documentation Section */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem', marginTop: '1.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Official Documentation</h2>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Verification & Resumes</span>
            </div>
            {[{
              title: 'Examination Results',
              description: 'Dive into your latest verified exam scores and subcategory breakdowns.',
              cta: 'View Examination Directory',
              filled: true,
              onClick: onViewExams
            }, {
              title: 'Digital Flight Logbook',
              description: 'View your complete collection of licenses, flight hours, certifications, and professional milestones.',
              cta: 'View Logbook',
              filled: false,
              onClick: onViewAtlas
             }, {
              title: 'Pilot Licensure & Experience Data Entry',
              description: 'Access your comprehensive digital flight log with detailed flight records, aircraft types, and operational experience.',
              cta: 'Open Data Entry',
              filled: true,
              onClick: onViewLicensureExperience
            }].map(card => renderCard(card))}
          </div>
        </section>

        {/* Achievements Grid */}
        <section className="dashboard-section">
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Your Achievements</h2>
            <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Atlas Resume Directory</span>
          </div>
          
          {/* Atlas Resume Section - New Layout */}
          <div style={{ marginBottom: '2rem' }}>
            {/* Section Header */}
            <div style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
              <h2 style={{ fontFamily: 'Georgia, serif', margin: '0 0 0.5rem', fontSize: 'clamp(1.5rem, 4vw, 2.5rem)', fontWeight: 400, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Atlas Resume
              </h2>
              <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                ATS - (AI screening) ATLAS CV Format
              </p>
              <p style={{ margin: '0', color: '#64748b', lineHeight: 1.6, fontSize: '0.9rem', maxWidth: '600px' }}>
                The Atlas CV format is the industry-standard resume format used across aviation. Airlines and recruiters use AI-powered ATS (Applicant Tracking Systems) to screen candidates automatically—your experience matters, but if your CV isn't ATS-optimized, you may never be seen.
              </p>
            </div>

            {/* Candidate Info Card */}
            <section style={{ marginBottom: '1.5rem' }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '1.75rem',
                boxShadow: '0 20px 45px rgba(15, 23, 42, 0.08)',
                border: '1px solid rgba(226,232,240,0.8)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div>
                    <div style={{ fontSize: '0.8rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Candidate</div>
                    <h2 style={{ margin: '0.35rem 0 0', fontSize: '1.75rem', color: '#0f172a' }}>{userProfile?.firstName || 'Benjamin'} {userProfile?.lastName || 'Bowler'}</h2>
                    <p style={{ margin: '0.2rem 0 0', color: '#64748b', fontSize: '0.9rem' }}>WingMentor Recognition Portfolio</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Share link</div>
                    <button style={{
                      padding: '0.6rem 1.2rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: 'transparent',
                      color: '#0f172a',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                      onClick={() => navigator.clipboard.writeText('https://wingmentor.app/resume/' + (userProfile?.uid || 'demo'))}
                    >
                      Copy shareable resume URL
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* Three Column Cards */}
            <section style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.25rem' }}>
                {/* Pilot Credentials Card */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1.1rem', color: '#0f172a', marginBottom: '0.25rem', fontWeight: 700 }}>Pilot Credentials</h3>
                  <p style={{ margin: '0 0 1rem', fontSize: '0.9rem', color: '#64748b' }}>Licensing, hours, and access pass</p>
                  
                  {/* Stats Grid */}
                  <div style={{ 
                    display: 'grid', 
                    gridTemplateColumns: 'repeat(2, 1fr)', 
                    gap: '0.75rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Dual XC hrs</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.dual_xc_hours || 0}</p>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>Dual LOC</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.dual_loc || 0}</p>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>PIC LOC</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.pic_loc || 0}</p>
                    </div>
                    <div style={{
                      background: '#f8fafc',
                      borderRadius: '12px',
                      padding: '1rem',
                      textAlign: 'center'
                    }}>
                      <p style={{ margin: 0, fontSize: '0.75rem', color: '#64748b' }}>LOC XC</p>
                      <p style={{ margin: '0.25rem 0 0', fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.loc_xc || 0}</p>
                    </div>
                  </div>
                  
                  {/* Type & Status */}
                  <div style={{
                    background: '#f8fafc',
                    borderRadius: '12px',
                    padding: '1rem',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Type</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.pilot_type || 'Not specified'}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Status</span>
                      <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{licensureData?.status || 'Not specified'}</span>
                    </div>
                  </div>
                  
                  {/* Link */}
                  <button
                    onClick={onViewAtlas}
                    style={{
                      background: 'transparent',
                      border: 'none',
                      color: '#2563eb',
                      fontSize: '0.9rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                  >
                    View Flight Digital Logbook →
                  </button>
                </div>

                {/* Training Card */}
                <div style={{
                  background: 'white',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e2e8f0'
                }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a', marginBottom: '0.75rem', fontWeight: 700 }}>Training</h3>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>License</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.current_license?.join(', ') || 'Not specified'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>License Country</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.license_country_of_issue || 'Not specified'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>Medical</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.medical_class || 'Not specified'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>Aircraft Ratings</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.aircraft_ratings?.map((r: any) => r.aircraftType).join(', ') || 'None added'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>English Proficiency</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.english_proficiency || 'Not specified'}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', color: '#475569' }}>
                      <span>Languages</span>
                      <strong style={{ color: '#0f172a' }}>{licensureData?.languages || 'Not specified'}</strong>
                    </div>
                  </div>
                </div>

                {/* Readiness Snapshot Card */}
                <div style={{
                  background: '#f8fafc',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  border: '1px solid #e2e8f0'
                }}>
                  <p style={{ margin: '0 0 0.5rem', fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Readiness Snapshot</p>
                  <h3 style={{ margin: '0 0 1rem', fontSize: '1rem', color: '#0f172a', fontWeight: 700 }}>Resource & Availability</h3>
                  
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Medical Certificate</span>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', textAlign: 'right' }}>{licensureData?.medical_expiry || 'Not specified'}</strong>
                    </div>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Radio License</span>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', textAlign: 'right' }}>{licensureData?.radio_license_expiry || 'Not specified'}</strong>
                    </div>
                    <div style={{
                      background: 'white',
                      borderRadius: '12px',
                      padding: '1rem',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}>
                      <span style={{ fontSize: '0.9rem', color: '#64748b' }}>License Expiry</span>
                      <strong style={{ fontSize: '0.9rem', color: '#0f172a', textAlign: 'right' }}>{licensureData?.license_expiry || 'Not specified'}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Job Experience Section */}
            <section style={{ marginBottom: '2rem' }}>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Recent Job Experience & Industry Aligned Accredited Programs</h3>
                  <button
                    onClick={onViewAtlas}
                    style={{
                      fontSize: '0.75rem',
                      color: '#2563eb',
                      background: '#eff6ff',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '0.25rem 0.5rem',
                      cursor: 'pointer',
                      fontWeight: 600
                    }}
                  >
                    Edit Experience →
                  </button>
                </div>
                
                <div>
                  <p style={{ margin: '0 0 0.75rem', color: '#64748b', fontSize: '0.9rem' }}>
                    No job experience data added yet.
                  </p>
                  <button
                    onClick={onViewAtlas}
                    style={{
                      fontSize: '0.85rem',
                      color: '#2563eb',
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      textDecoration: 'underline',
                      padding: 0
                    }}
                  >
                    Add your job experience →
                  </button>
                </div>
              </div>
            </section>

            {/* Export & Verification */}
            <section>
              <div style={{
                background: 'white',
                borderRadius: '24px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.75rem'
              }}>
                <h3 style={{ margin: 0, fontSize: '1rem', color: '#0f172a' }}>Export & Verification</h3>
                <p style={{ margin: 0, color: '#475569', fontSize: '0.9rem' }}>
                  Download a PDF copy of your Atlas-formatted resume or share the verification link directly with airline recruiters.
                </p>
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  <button
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: 'none',
                      background: '#0ea5e9',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={onViewAtlas}
                  >
                    Access Full ATLAS Resume
                  </button>
                  <button
                    style={{
                      padding: '0.75rem 1.5rem',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      background: 'transparent',
                      color: '#0f172a',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                    onClick={() => alert('Live verification feed coming soon')}
                  >
                    Share verification
                  </button>
                </div>
              </div>
            </section>
          </div>
          
          {/* Achievement Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            {achievements.map((achievement) => (
              <div key={achievement.id} className="recognition-achievement-card" style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                borderLeft: `4px solid ${achievement.color}`,
                display: 'flex',
                gap: '1rem',
                alignItems: 'flex-start'
              }}>
                <div style={{
                  fontSize: '2.5rem',
                  lineHeight: 1
                }}>
                  {achievement.icon}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontSize: '0.625rem', 
                    color: achievement.color, 
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    marginBottom: '0.25rem'
                  }}>
                    {achievement.category}
                  </div>
                  <h3 style={{ 
                    fontSize: '1.125rem', 
                    fontWeight: 700, 
                    color: '#1e293b', 
                    marginBottom: '0.5rem' 
                  }}>
                    {achievement.title}
                  </h3>
                  <p style={{ 
                    fontSize: '0.875rem', 
                    color: '#64748b', 
                    marginBottom: '0.75rem',
                    lineHeight: 1.5
                  }}>
                    {achievement.description}
                  </p>
                  <div style={{ 
                    fontSize: '0.75rem', 
                    color: '#94a3b8' 
                  }}>
                    Earned on {new Date(achievement.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* WingMentor Directory Button */}
        {onNavigateToDirectory && (
          <section style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>WingMentor Directory</h2>
              <span style={{ fontSize: '0.75rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Connect with Mentors & Mentees</span>
            </div>
            <div
              onClick={onNavigateToDirectory}
              style={{
                background: 'white',
                borderRadius: '12px',
                padding: '1.5rem',
                boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.borderColor = '#0ea5e9';
                e.currentTarget.style.boxShadow = '0 8px 12px rgba(14, 165, 233, 0.15)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.borderColor = '#e2e8f0';
                e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)';
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Icons.MessageSquare style={{ width: 24, height: 24, color: 'white' }} />
                </div>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                    WingMentor Chat
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#64748b' }}>
                    {mentorshipHours >= 20 ? 'Mentor' : `${mentorshipHours} / 20 hrs to Mentor`}
                  </div>
                </div>
              </div>
              <Icons.ArrowRight style={{ width: 20, height: 20, color: '#94a3b8' }} />
            </div>
          </section>
        )}

      </main>
    </div>
  );
};
