import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import { BookOpen, TrendingUp, Shield, ArrowRight } from 'lucide-react';
import PilotGapModulePage from './PilotGapModulePage';

interface FoundationalModulesPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const syllabusModules = [
  {
    id: 'chapter-1',
    title: 'Chapter 1: Industry Familiarization & Indoctrination',
    description: 'Introduction to the pilot gap analysis framework. Understand your current position and identify key areas for development in your aviation career.',
    icon: BookOpen,
    status: 'available',
    duration: '45 min',
  },
  {
    id: 'chapter-2',
    title: 'Chapter 2: Low-Timer & Pilot Shortage',
    description: 'Deep dive into the pilot shortage phenomenon and how it affects low-timer pilots in the industry.',
    icon: TrendingUp,
    status: 'available',
    duration: '60 min',
  },
  {
    id: 'chapter-3',
    title: 'Chapter 3: Pilot Risk Management',
    description: 'Comprehensive understanding of pilot risk management, health, and decision-making processes.',
    icon: Shield,
    status: 'available',
    duration: '75 min',
  },
];

export const FoundationalModulesPage: React.FC<FoundationalModulesPageProps> = ({ 
  onBack, 
  onNavigate
}) => {
  const { userProfile } = useAuth();
  const displayName = userProfile?.firstName || userProfile?.displayName || userProfile?.email || 'Pilot';

  const handleLaunchModule = (moduleId: string) => {
    // Navigate to the Pilot Gap Module page with the initial chapter
    if (moduleId === 'chapter-1') {
      onNavigate('pilot-gap-module');
    } else if (moduleId === 'chapter-2') {
      onNavigate('pilot-gap-module');
    } else if (moduleId === 'chapter-3') {
      onNavigate('pilot-gap-module');
    }
  };

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
              Modules
            </h1>
            <p style={{ color: '#94a3b8', fontWeight: 500, margin: 0, fontSize: '0.95rem' }}>
              Welcome back, {displayName}
            </p>
          </div>

          {/* Description */}
          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '2rem', textAlign: 'center' }}>
            Access your Foundational Program syllabus modules. Complete Pilot Gap Module and Pilot Gap Module 2 to continue your mentorship journey.
          </p>

          {/* Module Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '1.5rem',
              maxWidth: '1200px',
              margin: '0 auto',
            }}
          >
            {syllabusModules.map((module) => {
              const IconComponent = module.icon;
              return (
                <div
                  key={module.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    backdropFilter: 'blur(20px)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    display: 'flex',
                    flexDirection: 'column',
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
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                      <div
                        style={{
                          width: 20,
                          height: 20,
                          borderRadius: '4px',
                          background: 'rgba(37, 99, 235, 0.2)',
                          backdropFilter: 'blur(10px)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: '#60a5fa',
                          border: '1px solid rgba(37, 99, 235, 0.3)',
                        }}
                      >
                        <IconComponent style={{ width: 12, height: 12, color: '#60a5fa' }} />
                      </div>
                      <h3 style={{ margin: 0, fontSize: '1rem', color: '#f1f5f9', fontWeight: 600 }}>
                        {module.title}
                      </h3>
                    </div>
                    <p style={{ margin: 0, color: '#cbd5e1', fontSize: '0.85rem', lineHeight: 1.5, marginBottom: '1rem' }}>
                      {module.description}
                    </p>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                      <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>{module.duration}</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleLaunchModule(module.id)}
                    style={{
                      width: '100%',
                      background: 'rgba(37, 99, 235, 0.8)',
                      backdropFilter: 'blur(10px)',
                      color: 'white',
                      border: '1px solid rgba(37, 99, 235, 0.5)',
                      borderRadius: '8px',
                      padding: '0.6rem 1rem',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.85rem',
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
                    Launch Module
                  </button>
                </div>
              );
            })}
          </div>

          {/* Footer Note */}
          <div 
            style={{ 
              borderTop: '1px solid rgba(255, 255, 255, 0.1)', 
              paddingTop: '1.5rem',
              marginTop: '2rem',
              textAlign: 'center',
            }}
          >
            <span style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
              Complete both modules to unlock additional mentorship resources and certification.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
