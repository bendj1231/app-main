/**
 * MentorMatchingPage Component
 * 
 * Page for finding and matching with mentors
 */

import React, { useState } from 'react';
import { Icons } from '../icons';
import { useMentorMatching } from '../../src/hooks/useMentorMatching';
import { useSubscriptionStatus } from '../../src/hooks/useSubscriptionStatus';
import { MentorMatchingCard } from '../../components/MentorMatchingCard';
import { Search, Filter, Crown } from 'lucide-react';

interface MentorMatchingPageProps {
  onBack: () => void;
  userProfile?: {
    id?: string;
    uid?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  } | null;
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

export const MentorMatchingPage: React.FC<MentorMatchingPageProps> = ({ onBack, userProfile }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'senior' | 'expert'>('all');
  const { status: subscriptionStatus } = useSubscriptionStatus(userProfile?.id || userProfile?.uid || null);
  const isPremium = subscriptionStatus.isPremium;

  const userId = userProfile?.id || userProfile?.uid;
  const { matches, loading, error, requestMentorship } = useMentorMatching(userId || null, isPremium);

  const filteredMatches = matches.filter(match => {
    const mentorName = match.mentor.full_name?.toLowerCase() || '';
    const matchesSearch = mentorName.includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' 
      ? true 
      : match.mentor.mentor_tier === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const handleRequestMentorship = async (mentorId: string) => {
    const message = `Hello, I would like to request mentorship. I believe your expertise would be valuable for my aviation career development.`;
    const result = await requestMentorship(mentorId, message);
    
    if (result.success) {
      alert('Mentorship request sent successfully!');
    } else {
      alert(`Failed to send request: ${result.error}`);
    }
  };

  return (
    <div className="dashboard-container animate-fade-in" style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem', minHeight: '100vh' }}>
      <main
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: '1200px',
          margin: '0 auto',
          minHeight: '100vh'
        }}
      >
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
            Back to Hub
          </button>

          <div style={{ marginBottom: '1rem', marginTop: '0.5rem' }}>
            <img src="/logo.png" alt="WingMentor Logo" style={{ height: '72px', width: 'auto' }} />
          </div>
          <p style={{ letterSpacing: '0.2em', color: '#2563eb', fontWeight: 600, fontSize: '0.75rem', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Mentorship Platform
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 600 }}>
            Find Your Mentor
          </h1>
          <p style={{ color: '#64748b', fontSize: '1rem', maxWidth: '600px' }}>
            Connect with experienced pilots who can guide your career development. Our intelligent matching system pairs you with mentors based on experience, aircraft types, and career goals.
          </p>
        </header>

        <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          {/* Premium Banner */}
          {isPremium && (
            <div style={{
              marginBottom: '2rem',
              padding: '1rem 1.5rem',
              background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
              borderRadius: '12px',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              gap: '1rem',
            }}>
              <Crown className="w-6 h-6" />
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '1rem' }}>Premium Active</p>
                <p style={{ margin: 0, fontSize: '0.875rem', opacity: 0.9 }}>
                  You have priority access to top-tier mentors and enhanced matching
                </p>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <CategorySection title="Search & Filter Mentors" description="Find the perfect mentor for your career stage">
              {/* Search and filters */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '300px', position: 'relative' }}>
                  <Search style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', width: 20, height: 20, color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search mentors by name..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '0.75rem 1rem 0.75rem 2.5rem',
                      border: '1px solid #e2e8f0',
                      borderRadius: '8px',
                      fontSize: '0.875rem'
                    }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => setSelectedFilter('all')}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedFilter === 'all' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: selectedFilter === 'all' ? '#eff6ff' : 'white',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    All Mentors
                  </button>
                  <button
                    onClick={() => setSelectedFilter('senior')}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedFilter === 'senior' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: selectedFilter === 'senior' ? '#eff6ff' : 'white',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Senior
                  </button>
                  <button
                    onClick={() => setSelectedFilter('expert')}
                    style={{
                      padding: '0.5rem 1rem',
                      border: selectedFilter === 'expert' ? '2px solid #3b82f6' : '1px solid #e2e8f0',
                      borderRadius: '8px',
                      background: selectedFilter === 'expert' ? '#eff6ff' : 'white',
                      fontSize: '0.875rem',
                      cursor: 'pointer'
                    }}
                  >
                    Expert
                  </button>
                </div>
              </div>

              {/* Loading state */}
              {loading && (
                <div style={{ textAlign: 'center', padding: '3rem' }}>
                  <div style={{ width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#3b82f6', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto' }}></div>
                  <p style={{ marginTop: '1rem', color: '#64748b' }}>Finding your perfect mentor...</p>
                </div>
              )}

              {/* Error state */}
              {error && (
                <div style={{ textAlign: 'center', padding: '3rem', backgroundColor: '#fef2f2', borderRadius: '8px', border: '1px solid #fecaca' }}>
                  <p style={{ color: '#dc2626' }}>{error}</p>
                </div>
              )}

              {/* Matches grid */}
              {!loading && !error && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))', gap: '1.5rem' }}>
                  {filteredMatches.length > 0 ? (
                    filteredMatches.map((match, index) => (
                      <MentorMatchingCard
                        key={index}
                        match={match}
                        onRequestMentorship={handleRequestMentorship}
                        isPremium={isPremium}
                      />
                    ))
                  ) : (
                    <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem' }}>
                      <p style={{ color: '#64748b', fontSize: '1rem' }}>
                        {searchQuery || selectedFilter !== 'all'
                          ? 'No mentors match your search criteria. Try adjusting your filters.'
                          : isPremium
                          ? 'No premium mentors available at this time. Check back later.'
                          : 'No mentors available. Upgrade to Premium for access to top-tier mentors.'}
                      </p>
                      {!isPremium && (
                        <button style={{
                          marginTop: '1rem',
                          padding: '0.75rem 1.5rem',
                          background: '#f59e0b',
                          color: 'white',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '1rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                        }}>
                          Upgrade to Premium
                        </button>
                      )}
                    </div>
                  )}
                </div>
              )}
            </CategorySection>
          </div>
        </section>
      </main>
    </div>
  );
};
