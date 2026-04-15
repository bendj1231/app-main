import React, { useEffect, useState } from 'react';
import { db } from '../lib/firebase';
import { collection, query, where, getDocs, getDoc, doc } from 'firebase/firestore';
import { supabase } from '../lib/supabase-auth';




interface RecognitionAchievementPageProps {
  onBack: () => void;
  onViewExams?: () => void;
  onViewAtlas?: () => void;
  userProfile?: { uid?: string; email?: string } | null;
  preloadedAchievements?: any[];
  preloadedPortfolio?: any;
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
  userProfile, 
  preloadedAchievements,
  preloadedPortfolio 
}) => {
  const [achievements, setAchievements] = useState<Achievement[]>(preloadedAchievements || []);
  const [stats, setStats] = useState({ awards: preloadedPortfolio?.awards_count || 0, hours: preloadedPortfolio?.total_hours || 0, skills: preloadedPortfolio?.skills?.length || 0, certifications: preloadedPortfolio?.certifications_count || 0 });
  const [progress, setProgress] = useState({ foundational: preloadedPortfolio?.pilot_gap_module_completion?.foundational || 0 });
  const [loading, setLoading] = useState(!preloadedAchievements);

  // Fetch program progress from Supabase
  useEffect(() => {
    const fetchProgramProgress = async () => {
      if (!userProfile?.uid) return;
      
      try {
        const { data, error } = await supabase
          .from('program_progress')
          .select('*')
          .eq('user_id', userProfile.uid)
          .eq('program_type', 'Foundational')
          .single();

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
  }, [userProfile?.uid, preloadedAchievements, preloadedPortfolio]);

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
    <div className="dashboard-container animate-fade-in recognition-page" style={{ position: 'fixed', top: '70px', left: 0, right: 0, bottom: 0, overflow: 'auto', zIndex: 10, padding: '2rem 1rem', alignItems: 'flex-start', minHeight: 'auto' }}>
      <main className="dashboard-card" style={{ position: 'relative', minHeight: 'auto' }}>
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

        <div className="dashboard-header" style={{ marginBottom: '2rem' }}>
          <div className="dashboard-logo" style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ maxWidth: '240px' }} />
          </div>
          <div className="dashboard-subtitle">CONNECTING PILOTS TO THE INDUSTRY</div>
          <h1 className="dashboard-title">Recognition & Achievements</h1>
          <p>
            View your awards, flight hours, certifications, and professional milestones earned through your training journey.
          </p>
        </div>
        {/* Stats Summary */}
        <section className="dashboard-section">
          <div className="recognition-stats-card" style={{
            background: 'white',
            borderRadius: '28px',
            padding: '1.25rem',
            marginBottom: '2rem',
            boxShadow: '0 22px 55px rgba(15,23,42,0.08)',
            border: '1px solid rgba(226,232,240,0.8)',
            overflow: 'hidden'
          }}>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, minmax(0, 1fr))',
              gap: '0.35rem'
            }}>
              {[{
                label: 'Total Awards',
                value: stats.awards,
                color: '#0ea5e9'
              }, {
                label: 'Total Hours',
                value: stats.hours,
                color: '#10b981'
              }, {
                label: 'Skills Mastered',
                value: stats.skills,
                color: '#f97316'
              }, {
                label: 'Certifications',
                value: stats.certifications,
                color: '#8b5cf6'
              }].map((tile, index, arr) => (
                <div
                  key={tile.label}
                  style={{
                    textAlign: 'center',
                    padding: '0.5rem 0.75rem',
                    position: 'relative'
                  }}
                >
                  {index < arr.length - 1 && (
                    <span
                      aria-hidden
                      style={{
                        position: 'absolute',
                        top: '18%',
                        right: 0,
                        width: '1px',
                        height: '64%',
                        background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.4), transparent)'
                      }}
                    />
                  )}
                  <div style={{ fontSize: '2.1rem', fontWeight: 700, color: '#000', marginBottom: '0.25rem' }}>{tile.value}</div>
                  <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.22em' }}>
                    {tile.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="dashboard-section" style={{ marginBottom: '2rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Programs</h2>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Training progress & resources</span>
              </div>
              {[{
                title: 'Foundation Program',
                description: 'Track your current completion progress synced directly from the foundational program dashboard.',
                progress: progress.foundational,
                filled: true
              }].map(card => renderCard(card))}
            </div>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <h2 style={{ margin: 0, fontSize: '1.2rem', color: '#0f172a' }}>Official Documentation</h2>
                <span style={{ fontSize: '0.8rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Verification & resumes</span>
              </div>
              {[{
                title: 'Examination Results',
                description: 'Dive into your latest verified exam scores and subcategory breakdowns.',
                cta: 'View Examination Directory',
                filled: true,
                onClick: onViewExams
              }, {
                title: 'Atlas-formatted Resume',
                description: 'Preview your industry-grade resume that includes recognition, certifications, and flight hours.',
                cta: 'View Atlas Resume',
                filled: false,
                onClick: onViewAtlas
              }].map(card => renderCard(card))}
            </div>
          </div>
        </section>

        {/* Achievements Grid */}
        <section className="dashboard-section">
          <h2 style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: '#1e293b', 
            marginBottom: '1.5rem',
            textTransform: 'uppercase',
            letterSpacing: '0.05em'
          }}>
            Your Achievements
          </h2>
          
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

        {/* Coming Soon Section */}
        <section className="dashboard-section" style={{ marginTop: '2rem' }}>
          <div className="recognition-coming-soon-card" style={{
            background: '#f8fafc',
            borderRadius: '12px',
            padding: '2rem',
            textAlign: 'center',
            border: '2px dashed #cbd5e1'
          }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
            <h3 style={{ 
              fontSize: '1.25rem', 
              fontWeight: 700, 
              color: '#1e293b', 
              marginBottom: '0.5rem' 
            }}>
              More Achievements Coming Soon
            </h3>
            <p style={{ 
              fontSize: '0.875rem', 
              color: '#64748b',
              maxWidth: '500px',
              margin: '0 auto'
            }}>
              Continue your training journey to unlock more badges, certifications, and recognition milestones.
            </p>
          </div>
        </section>

      </main>
    </div>
  );
};
