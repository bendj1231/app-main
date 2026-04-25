/**
 * MentorshipAnalyticsPage Component
 * 
 * Dedicated page for mentorship analytics
 */

import React from 'react';
import { Icons } from '../icons';
import { useMentorshipAnalytics } from '../../src/hooks/useMentorshipAnalytics';
import { MentorshipAnalyticsDashboard } from '../../components/MentorshipAnalyticsDashboard';
import { BarChart3 } from 'lucide-react';

interface MentorshipAnalyticsPageProps {
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

export const MentorshipAnalyticsPage: React.FC<MentorshipAnalyticsPageProps> = ({ onBack, userProfile }) => {
  const userId = userProfile?.id || userProfile?.uid;
  const { analytics, loading } = useMentorshipAnalytics(userId || null);

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
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginTop: '0.5rem' }}>
            <BarChart3 className="w-8 h-8 text-blue-600" />
            <h1 style={{ fontSize: '2rem', margin: 0, color: '#0f172a', fontWeight: 600 }}>
              Mentorship Analytics
            </h1>
          </div>
          <p style={{ color: '#64748b', fontSize: '1rem', marginTop: '0.5rem', maxWidth: '600px' }}>
            Track your mentorship impact, mentee progress, and overall contribution to the community.
          </p>
        </header>

        <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          <CategorySection title="Your Mentorship Impact" description="Comprehensive analytics dashboard">
            <MentorshipAnalyticsDashboard analytics={analytics} loading={loading} />
          </CategorySection>
        </section>
      </main>
    </div>
  );
};
