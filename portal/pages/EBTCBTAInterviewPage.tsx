import React, { useState } from 'react';
import { Icons } from '../icons';

interface EBTCBTAInterviewPageProps {
  onBack: () => void;
  isDarkMode?: boolean;
}

export const EBTCBTAInterviewPage: React.FC<EBTCBTAInterviewPageProps> = ({ 
  onBack, 
  isDarkMode = false 
}) => {
  const [currentSection, setCurrentSection] = useState(0);
  const [showStartScreen, setShowStartScreen] = useState(true);
  const [answers, setAnswers] = useState<Record<number, any>>({});

  const sections = [
    {
      id: 0,
      title: 'Introduction to EBT CBTA',
      description: 'Understanding Evidence-Based Training and Competency-Based Training & Assessment principles',
      content: 'EBT CBTA is a modern training methodology that focuses on developing core competencies through evidence-based assessment. This approach emphasizes scenario-based training, continuous assessment, and data-driven improvement of pilot skills.'
    },
    {
      id: 1,
      title: 'Core Competencies',
      description: 'Essential competencies for modern pilots',
      content: 'The EBT CBTA framework identifies 9 core competencies including communication, situational awareness, problem-solving, workload management, and leadership. These competencies are assessed through realistic flight scenarios.'
    },
    {
      id: 2,
      title: 'Assessment Methodology',
      description: 'How pilots are evaluated using EBT CBTA',
      content: 'Assessment is continuous and occurs during training scenarios. Instructors use behavioral markers to evaluate performance across competency areas. This provides a comprehensive view of pilot readiness beyond traditional check rides.'
    },
    {
      id: 3,
      title: 'Industry Alignment',
      description: 'AIRBUS standards and airline requirements',
      content: 'This interview is aligned with AIRBUS EBT standards and meets the requirements of major airlines worldwide. Successful completion demonstrates readiness for airline recruitment and type rating programs.'
    }
  ];

  const handleStart = () => {
    setShowStartScreen(false);
  };

  const handleNext = () => {
    if (currentSection < sections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevious = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  const handleComplete = () => {
    // Handle completion - could save results to Supabase or trigger callback
    onBack();
  };

  if (showStartScreen) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: isDarkMode ? '#0f172a' : '#f8fafc', 
        fontFamily: 'Inter, system-ui, sans-serif' 
      }}>
        <div style={{ padding: '2rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
          <button
            onClick={onBack}
            style={{
              marginBottom: '1.25rem',
              background: 'transparent',
              border: 'none',
              color: isDarkMode ? '#38bdf8' : '#1e40af',
              fontSize: '0.95rem',
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            ← Back to Dashboard
          </button>

          <div
            style={{
              background: isDarkMode 
                ? 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9))'
                : '#fff',
              borderRadius: '24px',
              padding: '3rem',
              boxShadow: isDarkMode 
                ? '0 20px 60px rgba(0,0,0,0.4)'
                : '0 4px 20px rgba(15, 23, 42, 0.08)',
              border: isDarkMode 
                ? '1px solid rgba(71,85,105,0.5)'
                : '1px solid rgba(226, 232, 240, 0.6)',
              textAlign: 'center',
            }}
          >
            <div
              style={{
                width: '100px',
                height: '100px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 2rem',
                fontSize: '3rem',
              }}
            >
              ✈️
            </div>

            <h1 style={{ 
              fontSize: '2.5rem', 
              color: isDarkMode ? '#f8fafc' : '#0f172a', 
              marginBottom: '1rem',
              fontWeight: 700 
            }}>
              AIRBUS ALIGNED EBT CBTA
            </h1>
            <h2 style={{ 
              fontSize: '1.5rem', 
              color: isDarkMode ? '#cbd5e1' : '#64748b', 
              marginBottom: '1.5rem',
              fontWeight: 500 
            }}>
              Initial Pilot Recognition Interview
            </h2>
            
            <p style={{ 
              color: isDarkMode ? '#94a3b8' : '#64748b', 
              marginBottom: '2rem',
              lineHeight: 1.6,
              fontSize: '1.1rem',
              maxWidth: '600px',
              margin: '0 auto 2rem'
            }}>
              AIRBUS-aligned Evidence-Based Training and Competency-Based Training & Assessment interview for initial pilot recognition and industry placement readiness.
            </p>

            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(2, 1fr)',
              gap: '1rem',
              marginBottom: '2rem',
              textAlign: 'left'
            }}>
              <div style={{
                padding: '1rem',
                background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '0.5rem' }}>
                  Duration
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  ~45 minutes
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '0.5rem' }}>
                  Sections
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  4 modules
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '0.5rem' }}>
                  Format
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  Interactive
                </div>
              </div>
              <div style={{
                padding: '1rem',
                background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid #e2e8f0'
              }}>
                <div style={{ fontSize: '0.875rem', color: isDarkMode ? '#94a3b8' : '#64748b', marginBottom: '0.5rem' }}>
                  Certification
                </div>
                <div style={{ fontSize: '1.125rem', fontWeight: 600, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  AIRBUS Aligned
                </div>
              </div>
            </div>

            <button
              onClick={handleStart}
              style={{
                padding: '1rem 2.5rem',
                borderRadius: '999px',
                border: 'none',
                background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: '#fff',
                fontWeight: 600,
                fontSize: '1.1rem',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.75rem',
                boxShadow: '0 4px 15px rgba(14, 165, 233, 0.4)',
                transition: 'all 0.2s ease',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(14, 165, 233, 0.5)';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 15px rgba(14, 165, 233, 0.4)';
              }}
            >
              Access Interview
              <Icons.ArrowRight style={{ width: 20, height: 20 }} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentSectionData = sections[currentSection];
  const progress = ((currentSection + 1) / sections.length) * 100;

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: isDarkMode ? '#0f172a' : '#f8fafc', 
      fontFamily: 'Inter, system-ui, sans-serif' 
    }}>
      <div style={{ padding: '2rem 3rem', maxWidth: '900px', margin: '0 auto' }}>
        <button
          onClick={onBack}
          style={{
            marginBottom: '1.25rem',
            background: 'transparent',
            border: 'none',
            color: isDarkMode ? '#38bdf8' : '#1e40af',
            fontSize: '0.95rem',
            fontWeight: 600,
            cursor: 'pointer',
          }}
        >
          ← Back to Dashboard
        </button>

        <div
          style={{
            background: isDarkMode 
              ? 'linear-gradient(135deg, rgba(30,41,59,0.95), rgba(15,23,42,0.9))'
              : '#fff',
            borderRadius: '24px',
            padding: '2.5rem',
            boxShadow: isDarkMode 
              ? '0 20px 60px rgba(0,0,0,0.4)'
              : '0 4px 20px rgba(15, 23, 42, 0.08)',
            border: isDarkMode 
              ? '1px solid rgba(71,85,105,0.5)'
              : '1px solid rgba(226, 232, 240, 0.6)',
          }}
        >
          {/* Progress Bar */}
          <div style={{ marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
              <span style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: '0.875rem', fontWeight: 600 }}>
                Section {currentSection + 1} of {sections.length}
              </span>
              <span style={{ color: isDarkMode ? '#38bdf8' : '#0ea5e9', fontSize: '0.875rem', fontWeight: 600 }}>
                {Math.round(progress)}%
              </span>
            </div>
            <div
              style={{
                width: '100%',
                height: '8px',
                background: isDarkMode ? 'rgba(255,255,255,0.1)' : '#e2e8f0',
                borderRadius: '4px',
                overflow: 'hidden',
              }}
            >
              <div
                style={{
                  width: `${progress}%`,
                  height: '100%',
                  background: 'linear-gradient(90deg, #0ea5e9, #0284c7)',
                  borderRadius: '4px',
                  transition: 'width 0.3s ease',
                }}
              />
            </div>
          </div>

          {/* Section Content */}
          <div style={{ marginBottom: '2.5rem' }}>
            <div style={{ 
              display: 'inline-block', 
              background: isDarkMode ? 'rgba(14, 165, 233, 0.15)' : '#eff6ff', 
              color: '#0ea5e9', 
              padding: '0.35rem 0.75rem', 
              borderRadius: '999px', 
              fontSize: '0.75rem', 
              fontWeight: 600,
              marginBottom: '1rem'
            }}>
              Module {currentSection + 1}
            </div>
            <h2 style={{ 
              fontSize: '1.75rem', 
              color: isDarkMode ? '#f8fafc' : '#0f172a', 
              marginBottom: '0.5rem',
              fontWeight: 700 
            }}>
              {currentSectionData.title}
            </h2>
            <p style={{ 
              fontSize: '1rem', 
              color: isDarkMode ? '#94a3b8' : '#64748b', 
              marginBottom: '1.5rem',
              fontWeight: 500 
            }}>
              {currentSectionData.description}
            </p>
            <div style={{
              padding: '1.5rem',
              background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#f8fafc',
              borderRadius: '16px',
              border: isDarkMode ? '1px solid rgba(71,85,105,0.4)' : '1px solid #e2e8f0',
              lineHeight: 1.7,
              color: isDarkMode ? '#cbd5e1' : '#475569',
              fontSize: '1rem'
            }}>
              {currentSectionData.content}
            </div>
          </div>

          {/* Navigation */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <button
              onClick={handlePrevious}
              disabled={currentSection === 0}
              style={{
                padding: '0.75rem 1.5rem',
                borderRadius: '12px',
                border: isDarkMode ? '1px solid rgba(71,85,105,0.5)' : '1px solid #e2e8f0',
                background: isDarkMode ? 'rgba(30,41,59,0.6)' : '#fff',
                color: currentSection === 0 ? (isDarkMode ? '#475569' : '#94a3b8') : (isDarkMode ? '#cbd5e1' : '#64748b'),
                cursor: currentSection === 0 ? 'not-allowed' : 'pointer',
                fontWeight: 600,
                transition: 'all 0.2s ease',
              }}
            >
              Previous
            </button>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              {sections.map((_, index) => (
                <div
                  key={index}
                  style={{
                    width: '10px',
                    height: '10px',
                    borderRadius: '50%',
                    background: index <= currentSection ? '#0ea5e9' : (isDarkMode ? 'rgba(255,255,255,0.2)' : '#e2e8f0'),
                    transition: 'background 0.3s ease',
                  }}
                />
              ))}
            </div>

            {currentSection === sections.length - 1 ? (
              <button
                onClick={handleComplete}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                Complete
                <Icons.Check style={{ width: 16, height: 16 }} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                style={{
                  padding: '0.75rem 1.5rem',
                  borderRadius: '12px',
                  border: 'none',
                  background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                  color: '#fff',
                  cursor: 'pointer',
                  fontWeight: 600,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  boxShadow: '0 4px 15px rgba(14, 165, 233, 0.3)',
                  transition: 'all 0.2s ease',
                }}
              >
                Next
                <Icons.ArrowRight style={{ width: 16, height: 16 }} />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EBTCBTAInterviewPage;
