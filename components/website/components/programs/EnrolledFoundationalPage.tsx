import React from 'react';
import { useAuth } from '@/src/contexts/AuthContext';
import {
  ClipboardList,
  TrendingUp,
  BookOpen,
  ExternalLink,
  ArrowRight,
} from 'lucide-react';

interface EnrolledFoundationalPageProps {
  onBack: () => void;
  onNavigate: (page: string) => void;
}

const foundationModules = [
  {
    id: 'foundation-01',
    title: 'Modules',
    description:
      'Access the Foundational syllabus modules including Pilot Gap Module and Pilot Gap Module 2. Continue your mentorship journey.',
    icon: BookOpen,
    action: 'View Details',
  },
  {
    id: 'foundation-02',
    title: 'Progress & Examination Board',
    description:
      'Track your journey through the Foundational Program. View completed modules, upcoming milestones, and your overall advancement in the PilotRecognition mentorship flow.',
    icon: TrendingUp,
    action: 'View Progress',
  },
  {
    id: 'foundation-03',
    title: 'Mentorship Logbook',
    description:
      'Record and track your mentorship sessions, hours, 50hrs certification progress tracking, and program milestones in your personalized digital logbook.',
    icon: ClipboardList,
    action: 'Open Logbook',
  },
];

export const EnrolledFoundationalPage: React.FC<EnrolledFoundationalPageProps> = ({
  onBack,
  onNavigate,
}) => {
  const { userProfile } = useAuth();

  const displayName =
    userProfile?.firstName ||
    userProfile?.displayName ||
    userProfile?.email ||
    'Pilot';

  return (
    <div
      style={{
        position: 'relative',
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        overflow: 'hidden',
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
      <div style={{ position: 'relative', zIndex: 2, padding: '1rem', maxWidth: '800px', margin: '0 auto' }}>
      {/* Back Navigation */}
      <button
        onClick={onBack}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#60a5fa',
          fontWeight: 600,
          marginBottom: '1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '8px',
          padding: '0.5rem 1rem',
          cursor: 'pointer',
          fontSize: '0.75rem',
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
        <ArrowRight style={{ width: 14, height: 14, transform: 'rotate(180deg)' }} />
        Back to Program Directory
      </button>

      {/* Program Header */}
      <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
        <img
          src="/logo.png"
          alt="Wing Mentor Logo"
          style={{
            width: '120px',
            height: 'auto',
            display: 'block',
            margin: '0 auto 1rem',
            filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3))',
          }}
        />
        <div
          style={{
            color: '#60a5fa',
            fontSize: '0.65rem',
            fontWeight: 700,
            letterSpacing: '0.25em',
            textTransform: 'uppercase',
            marginBottom: '0.5rem',
          }}
        >
          WINGMENTOR PROGRAMS
        </div>
        <h1
          style={{
            fontFamily: 'Georgia, serif',
            fontSize: 'clamp(1.25rem, 2.5vw, 1.5rem)',
            fontWeight: 400,
            color: '#f1f5f9',
            margin: '0 0 0.5rem 0',
            letterSpacing: '-0.02em',
          }}
        >
          Foundation Program Platform
        </h1>
        <p style={{ color: '#94a3b8', fontWeight: 500, margin: 0, fontSize: '0.8rem' }}>
          Welcome back, {displayName}
        </p>
      </div>

      {/* Program Description */}
      <p
        style={{
          textAlign: 'center',
          color: '#cbd5e1',
          fontSize: '0.85rem',
          maxWidth: '600px',
          margin: '0 auto 1.5rem',
          lineHeight: 1.5,
        }}
      >
        Your central hub for the Foundation Program. Track your progress through structured modules, complete assessments, access your pilot portfolio, and connect with mentorship resources all in one place.
      </p>

      {/* Module Cards Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem',
        }}
      >
        {foundationModules.map((module) => {
          const IconComponent = module.icon;
          return (
            <div
              key={module.id}
              style={{
                display: 'flex',
                flexDirection: 'column',
                background: 'rgba(255, 255, 255, 0.05)',
                backdropFilter: 'blur(20px)',
                borderRadius: '12px',
                padding: '1.25rem',
                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease',
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-2px)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 12px 40px rgba(0, 0, 0, 0.4)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLDivElement).style.boxShadow =
                  '0 8px 32px rgba(0, 0, 0, 0.3)';
                (e.currentTarget as HTMLDivElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
                  <div
                    style={{
                      width: 32,
                      height: 32,
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
                    <IconComponent style={{ width: 16, height: 16 }} />
                  </div>
                  <h3
                    style={{
                      margin: 0,
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      color: '#f1f5f9',
                    }}
                  >
                    {module.title}
                  </h3>
                </div>
                <p
                  style={{
                    color: '#cbd5e1',
                    fontSize: '0.75rem',
                    lineHeight: 1.5,
                    marginBottom: '1rem',
                  }}
                >
                  {module.description}
                </p>
              </div>
              <button
                onClick={() => {
                  if (module.id === 'foundation-01') {
                    onNavigate('foundational-modules');
                  } else if (module.id === 'foundation-02') {
                    onNavigate('foundational-progress');
                  } else if (module.id === 'foundation-03') {
                    onNavigate('foundational-logbook');
                  }
                }}
                style={{
                  width: '100%',
                  padding: '0.6rem 0.8rem',
                  background: 'rgba(37, 99, 235, 0.8)',
                  backdropFilter: 'blur(10px)',
                  color: 'white',
                  border: '1px solid rgba(37, 99, 235, 0.5)',
                  borderRadius: '6px',
                  fontWeight: 600,
                  fontSize: '0.75rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  marginTop: 'auto',
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
                {module.action}
              </button>
            </div>
          );
        })}
      </div>

      {/* W1000 Directory */}
      <a
        href="https://w1000.vercel.app"
        target="_blank"
        rel="noopener noreferrer"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.75rem',
          padding: '0.875rem 1rem',
          background: 'rgba(255, 255, 255, 0.05)',
          backdropFilter: 'blur(20px)',
          borderRadius: '10px',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          textDecoration: 'none',
          color: 'inherit',
          marginBottom: '1rem',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(-1px)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255, 255, 255, 0.2)';
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.transform = 'translateY(0)';
          (e.currentTarget as HTMLAnchorElement).style.borderColor = 'rgba(255, 255, 255, 0.1)';
          (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255, 255, 255, 0.05)';
        }}
      >
        <div
          style={{
            width: 36,
            height: 36,
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
          <ExternalLink style={{ width: 16, height: 16, color: '#60a5fa' }} />
        </div>
        <div>
          <h4 style={{ margin: 0, fontSize: '0.8rem', fontWeight: 600, color: '#f1f5f9' }}>
            W1000 Directory
          </h4>
          <p style={{ margin: 0, fontSize: '0.7rem', color: '#cbd5e1' }}>
            Launch the W1000 logbook, mentorship assignments, and reference materials
          </p>
        </div>
      </a>

      {/* Program Details Directory Link */}
      <button
        onClick={() => onNavigate('foundational-program')}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          color: '#60a5fa',
          fontWeight: 600,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontSize: '0.75rem',
          padding: 0,
        }}
      >
        Directory for the program details to the enrollment page
        <ArrowRight style={{ width: 14, height: 14 }} />
      </button>
      </div>
      </div>
  );
};
