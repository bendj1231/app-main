import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { TrendingUp, ArrowRight, CheckCircle, Clock } from 'lucide-react';

interface FoundationalChapter2PageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

export const FoundationalChapter2Page: React.FC<FoundationalChapter2PageProps> = ({ 
  onBack, 
  onNavigate 
}) => {
  const { userProfile } = useAuth();
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  const sections = [
    {
      title: 'Understanding the Pilot Shortage',
      description: 'Deep analysis of the global pilot shortage and its implications for career progression.',
      duration: '20 min',
      completed: false,
    },
    {
      title: 'Low-Timer Challenges',
      description: 'Identifying and addressing the specific challenges faced by pilots with limited experience.',
      duration: '15 min',
      completed: false,
    },
    {
      title: 'Career Pathway Strategies',
      description: 'Strategic approaches to building a successful aviation career from a low-timer position.',
      duration: '25 min',
      completed: false,
    },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', fontFamily: 'Inter, system-ui, sans-serif', paddingTop: '0' }}>
      <div style={{ padding: '0 3rem 2rem 3rem', maxWidth: '1200px', margin: '0 auto' }}>
        {/* Single White Card Container */}
        <div
          style={{
            background: '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: '0 4px 20px rgba(15, 23, 42, 0.08), 0 1px 3px rgba(15, 23, 42, 0.05)',
            border: '1px solid rgba(226, 232, 240, 0.6)',
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
              background: 'transparent',
              border: 'none',
              color: '#1e40af',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
              zIndex: 10,
            }}
          >
            <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)', display: 'inline', marginRight: '0.25rem' }} />
            Back to Modules
          </button>

          {/* Header Section */}
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <img src="/logo.png" alt="PilotRecognition Logo" style={{ display: 'block', maxWidth: '180px', height: 'auto', objectFit: 'contain', margin: '0 auto 1rem' }} />
            <div style={{ color: '#2563eb', fontSize: '0.75rem', fontWeight: 700, letterSpacing: '0.3em', textTransform: 'uppercase', marginBottom: '0.75rem' }}>
              WINGMENTOR PROGRAMS
            </div>
            <div style={{ color: '#64748b', fontSize: '0.85rem', fontWeight: 600, marginBottom: '0.5rem' }}>
              MODULE 1 • CHAPTER 2
            </div>
            <h1 style={{ fontFamily: 'Georgia, serif', fontSize: 'clamp(2rem, 3vw, 2.5rem)', fontWeight: 400, color: '#0f172a', margin: '0 0 0.75rem 0', letterSpacing: '-0.02em' }}>
              Low-Timer & Pilot Shortage
            </h1>
            <p style={{ color: '#1d4ed8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Chapter Description */}
          <p style={{ color: '#475569', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center' }}>
            Deep dive into the pilot shortage phenomenon and how it affects low-timer pilots in the industry.
          </p>

          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#475569' }}>Chapter Progress</span>
              <span style={{ fontSize: '0.85rem', color: '#64748b' }}>0%</span>
            </div>
            <div
              style={{
                background: '#e2e8f0',
                borderRadius: '8px',
                height: '8px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  background: '#2563eb',
                  height: '100%',
                  width: '0%',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Sections List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
            {sections.map((section, index) => (
              <div
                key={index}
                style={{
                  background: '#f8fafc',
                  borderRadius: '12px',
                  padding: '1.25rem',
                  border: '1px solid #e2e8f0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                }}
              >
                <div
                  style={{
                    width: 40,
                    height: 40,
                    borderRadius: '8px',
                    background: '#eff6ff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0,
                  }}
                >
                  {section.completed ? (
                    <CheckCircle style={{ width: 20, height: 20, color: '#22c55e' }} />
                  ) : (
                    <Clock style={{ width: 20, height: 20, color: '#2563eb' }} />
                  )}
                </div>
                <div style={{ flex: 1 }}>
                  <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>
                    {section.title}
                  </h3>
                  <p style={{ margin: 0, fontSize: '0.85rem', color: '#64748b' }}>
                    {section.description}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 600 }}>
                    {section.duration}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={() => alert('Chapter content will be available soon.')}
            style={{
              width: '100%',
              background: '#2563eb',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '0.75rem 1.5rem',
              fontWeight: 600,
              cursor: 'pointer',
              fontSize: '0.95rem',
            }}
          >
            Start Chapter 2
          </button>

          {/* Footer Note */}
          <div 
            style={{ 
              borderTop: '1px solid #e2e8f0', 
              paddingTop: '1.5rem',
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#64748b' }}>
              Estimated completion time: 60 minutes
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
