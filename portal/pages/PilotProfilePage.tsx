import React, { useEffect, useMemo, useState } from 'react';
import { Icons } from '../icons';
import { useAirlinePassport } from '../hooks/useAirlinePassport';
import { usePilotPortfolio } from '../hooks/usePilotPortfolio';
import { supabase } from '../lib/supabase-auth';
import { RecognitionScoreCard } from '../../components/RecognitionScoreCard';
import { useRecognitionScore } from '../../src/hooks/useRecognitionScore';

interface PilotProfilePageProps {
  onBack: () => void;
  onViewLogbook?: () => void;
  onViewDigitalLogbook?: () => void;
  onViewMentorLogbook?: () => void;
  onViewAtlas?: () => void;
  onViewRecognition?: () => void;
  userProfile?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    role?: string;
    licenseType?: string;
    licenseStatus?: string;
    totalHours?: number;
    uid?: string;
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

// Icon wrapper for safety
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

// Airline Passport Component - Now with Supabase integration
interface AirlinePassportProps {
  userId?: string;
}

const AirlinePassport: React.FC<AirlinePassportProps> = ({ userId }) => {
  const { connections, loading, error, refreshConnections, connectAirline, syncAirlineData } = useAirlinePassport(userId);

  // Default airlines to show if no connections exist
  const defaultAirlines = [
    { id: 'etihad', name: 'Etihad Airways', code: 'EY', logo: 'https://logo.clearbit.com/etihad.com', domain: 'etihad.com' },
    { id: 'airbus', name: 'Airbus', code: 'AB', logo: 'https://logo.clearbit.com/airbus.com', domain: 'airbus.com' },
    { id: 'emirates', name: 'Emirates', code: 'EK', logo: 'https://logo.clearbit.com/emirates.com', domain: 'emirates.com' },
    { id: 'flydubai', name: 'flydubai', code: 'FZ', logo: 'https://logo.clearbit.com/flydubai.com', domain: 'flydubai.com' }
  ];

  const handleConnect = async (airline: typeof defaultAirlines[0]) => {
    await connectAirline(airline.id, airline.name, airline.code, airline.logo);
  };

  const handleSync = async (connectionId: string) => {
    await syncAirlineData(connectionId);
  };

  // Combine real connections with default airlines for display
  const displayAirlines = defaultAirlines.map(airline => {
    const connection = connections.find(c => c.airline_id === airline.id);
    return {
      ...airline,
      status: connection?.status || 'available',
      lastSynced: connection?.last_synced_at 
        ? formatTimeAgo(connection.last_synced_at)
        : undefined,
      matchPercentage: connection?.match_percentage || 0,
      connectionId: connection?.id
    };
  });

  function formatTimeAgo(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} min ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  }
  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(15,23,42,0.95) 0%, rgba(30,41,59,0.95) 100%)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(0,0,0, 0.3)',
      border: '1px solid rgba(255,255,255,0.1)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
        <div style={{
          width: '48px',
          height: '48px',
          borderRadius: '12px',
          background: 'linear-gradient(135deg, #f59e0b, #d97706)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '1.5rem'
        }}>
          🛂
        </div>
        <div>
          <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#f1f5f9' }}>
            Airline Passport
          </h3>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#94a3b8' }}>
            One-tap sync to recruitment portals
          </p>
        </div>
      </div>

      <p style={{ fontSize: '1rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1.5rem' }}>
        Share your verified WingMentor Network data directly with airline recruiters. Sync flight hours, competencies, and achievements instantly.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
        {displayAirlines.map((airline) => (
          <div key={airline.id} style={{
            background: airline.status === 'connected' ? 'rgba(16, 185, 129, 0.1)' : 'linear-gradient(135deg, rgba(30,41,59,0.9), rgba(51,65,85,0.8))',
            borderRadius: '16px',
            padding: '1.25rem',
            border: airline.status === 'connected' ? '2px solid #10b981' : '1px solid rgba(255,255,255,0.1)',
            boxShadow: airline.status === 'connected' ? '0 4px 12px rgba(16, 185, 129, 0.2)' : '0 2px 8px rgba(0,0,0,0.3)',
            transition: 'all 0.3s ease'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
              <div style={{
                width: '48px',
                height: '48px',
                borderRadius: '12px',
                background: airline.status === 'connected'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : 'linear-gradient(135deg, #64748b, #475569)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden'
              }}>
                {airline.logo ? (
                  <img 
                    src={airline.logo} 
                    alt={airline.name}
                    style={{ width: '70%', height: '70%', objectFit: 'contain' }}
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <span style={{ color: 'white', fontSize: '1.25rem', fontWeight: 700 }}>{airline.code}</span>
                )}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '1.125rem', fontWeight: 700, color: '#f1f5f9' }}>{airline.name}</div>
                <div style={{ fontSize: '0.75rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: airline.status === 'connected' ? '#34d399' : airline.status === 'pending' ? '#fbbf24' : '#94a3b8' }}>
                  {airline.status === 'connected' ? '✓ Connected' : airline.status === 'pending' ? '⏳ Pending' : '○ Available'}
                </div>
              </div>
            </div>

            {airline.status === 'connected' && airline.lastSynced && (
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#34d399' }} />
                Last synced {airline.lastSynced}
              </div>
            )}

            {airline.matchPercentage > 0 && (
              <div style={{ fontSize: '0.75rem', color: '#34d399', marginBottom: '0.75rem', fontWeight: 600 }}>
                {airline.matchPercentage}% Profile Match
              </div>
            )}

            <button
              onClick={() => airline.connectionId ? handleSync(airline.connectionId) : handleConnect(airline)}
              disabled={airline.status === 'pending' || loading}
              style={{
                width: '100%',
                padding: '0.75rem',
                borderRadius: '12px',
                border: 'none',
                background: airline.status === 'connected'
                  ? 'linear-gradient(135deg, #10b981, #059669)'
                  : airline.status === 'pending'
                    ? '#e2e8f0'
                    : 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                color: airline.status === 'pending' ? '#94a3b8' : 'white',
                fontWeight: 600,
                cursor: airline.status === 'pending' || loading ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem',
                transition: 'all 0.2s ease',
                opacity: loading ? 0.6 : 1
              }}
            >
              {loading ? (
                <span>⟳ Syncing...</span>
              ) : airline.status === 'connected' ? (
                <>
                  <span>↻</span> Re-sync Data
                </>
              ) : airline.status === 'pending' ? (
                <>
                  <span>⏳</span> Verification Pending
                </>
              ) : (
                <>
                  <span>⚡</span> Connect & Sync
                </>
              )}
            </button>

            {airline.status === 'connected' && (
              <div style={{ marginTop: '0.75rem', padding: '0.5rem', background: 'rgba(16, 185, 129, 0.15)', borderRadius: '8px', fontSize: '0.75rem', color: '#34d399', textAlign: 'center' }}>
                Flight hours auto-synced to recruitment portal
              </div>
            )}
          </div>
        ))}
      </div>

      <div style={{
        marginTop: '1.5rem',
        padding: '1rem',
        background: 'rgba(30, 41, 59, 0.6)',
        borderRadius: '16px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          <div style={{ fontSize: '0.875rem', fontWeight: 600, color: '#f1f5f9' }}>Verified Data Passport</div>
          <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            {displayAirlines.filter(a => a.status === 'connected').length} of {displayAirlines.length} airlines connected
          </div>
        </div>
        <div style={{ padding: '0.5rem 1rem', background: 'linear-gradient(135deg, #0f172a, #1e293b)', borderRadius: '999px', fontSize: '0.75rem', fontWeight: 600, color: 'white' }}>
          ✓ Verified by WingMentor
        </div>
      </div>
      
      {error && (
        <div style={{ marginTop: '1rem', padding: '0.75rem', background: 'rgba(220, 38, 38, 0.2)', borderRadius: '8px', color: '#f87171', fontSize: '0.875rem' }}>
          Error: {error}
        </div>
      )}
    </div>
  );
};

// Competency Compass Component
const CompetencyCompass: React.FC<{ scores: {
  knowledge: number;
  recency: number;
  exams: number;
  progress: number;
  interview: number;
  resilience: number;
  awareness: number;
} }> = ({ scores }) => {
  const competencies = [
    { label: 'Knowledge Depth', score: scores.knowledge, color: '#0ea5e9' },
    { label: 'Recency of Training', score: scores.recency, color: '#10b981' },
    { label: 'Exam Performance', score: scores.exams, color: '#f59e0b' },
    { label: 'Program Progress', score: scores.progress, color: '#8b5cf6' },
    { label: 'Interview Impression', score: scores.interview, color: '#ef4444' },
    { label: 'Situational Awareness', score: scores.awareness, color: '#fb7185' },
    { label: 'Resilience', score: scores.resilience, color: '#f97316' }
  ];

  const centerX = 150;
  const centerY = 150;
  const radius = 100;
  const angleStep = (2 * Math.PI) / competencies.length;

  // Calculate polygon points based on scores (0-100)
  const getPoint = (index: number, score: number) => {
    const angle = index * angleStep - Math.PI / 2;
    const r = (score / 100) * radius;
    return {
      x: centerX + r * Math.cos(angle),
      y: centerY + r * Math.sin(angle)
    };
  };

  // Generate data polygon points
  const dataPoints = competencies.map((comp, i) => getPoint(i, comp.score));
  const dataPolygon = dataPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate background pentagon points (max score)
  const bgPoints = Array.from({ length: competencies.length }, (_, i) => getPoint(i, 100));
  const bgPolygon = bgPoints.map(p => `${p.x},${p.y}`).join(' ');

  // Generate intermediate grid lines (25%, 50%, 75%)
  const gridLevels = [25, 50, 75];
  const gridPolygons = gridLevels.map(level => {
    const points = Array.from({ length: competencies.length }, (_, i) => getPoint(i, level));
    return points.map(p => `${p.x},${p.y}`).join(' ');
  });

  // Calculate average score
  const avgScore = Math.round(
    (scores.knowledge + scores.recency + scores.exams + scores.progress + scores.interview + scores.awareness + scores.resilience) /
    competencies.length
  );

  return (
    <div style={{
      background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(248,250,252,0.95) 100%)',
      borderRadius: '24px',
      padding: '2rem',
      boxShadow: '0 20px 60px rgba(15, 23, 42, 0.12)',
      border: '1px solid rgba(255,255,255,0.8)',
      backdropFilter: 'blur(20px)'
    }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 300px', gap: '2rem', alignItems: 'center' }}>
        {/* Left side - Info */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '1.5rem'
            }}>
              ★
            </div>
            <div>
              <h3 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 700, color: '#0f172a' }}>
                Competency Compass
              </h3>
              <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#64748b' }}>
                Verified Competency Score
              </p>
            </div>
          </div>

          <p style={{ fontSize: '1rem', color: '#475569', lineHeight: 1.6, marginBottom: '1.5rem' }}>
            Just as Uber shows your driver's rating, this radar now blends knowledge depth, training recency, exam performance,
            overall program progress, and interview impressions into a single recruiter-facing score.
          </p>

          {/* Score Breakdown */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.75rem' }}>
            {competencies.map((comp) => (
              <div key={comp.label} style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.75rem',
                padding: '0.75rem',
                background: 'rgba(255,255,255,0.8)',
                borderRadius: '12px',
                border: '1px solid rgba(226,232,240,0.8)'
              }}>
                <div style={{
                  width: '10px',
                  height: '10px',
                  borderRadius: '50%',
                  background: comp.color
                }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {comp.label}
                  </div>
                  <div style={{ fontSize: '1.125rem', fontWeight: 700, color: comp.color }}>
                    {comp.score}%
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Score Badge */}
          <div style={{
            marginTop: '1.5rem',
            padding: '1rem',
            background: 'linear-gradient(135deg, #0f172a, #1e293b)',
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Overall Verified Score
              </div>
              <div style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '0.25rem' }}>
                Visible to recruiters and airlines
              </div>
            </div>
            <div style={{
              fontSize: '2.5rem',
              fontWeight: 700,
              color: avgScore >= 90 ? '#10b981' : avgScore >= 75 ? '#0ea5e9' : '#f59e0b'
            }}>
              {avgScore}
            </div>
          </div>
        </div>

        {/* Right side - Radar Chart */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <svg width="300" height="300" viewBox="0 0 300 300">
            {/* Background circles */}
            <defs>
              <linearGradient id="radarGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#0ea5e9" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#0ea5e9" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            
            {/* Grid lines */}
            {gridPolygons.map((polygon, i) => (
              <polygon
                key={i}
                points={polygon}
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="1"
                opacity="0.5"
              />
            ))}
            
            {/* Background pentagon */}
            <polygon
              points={bgPolygon}
              fill="none"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            
            {/* Data polygon */}
            <polygon
              points={dataPolygon}
              fill="url(#radarGradient)"
              stroke="#0ea5e9"
              strokeWidth="2"
            />
            
            {/* Labels */}
            {competencies.map((comp, i) => {
              const labelPoint = getPoint(i, 115);
              return (
                <g key={comp.label}>
                  <circle
                    cx={labelPoint.x}
                    cy={labelPoint.y}
                    r="4"
                    fill={comp.color}
                  />
                  <text
                    x={labelPoint.x}
                    y={labelPoint.y - 10}
                    textAnchor="middle"
                    fontSize="11"
                    fill="#475569"
                    fontWeight="600"
                  >
                    {comp.label}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
};

type FlightLogEntry = {
  id: string;
  date?: string;
  aircraft?: string;
  route?: string;
  hours?: number;
  remarks?: string;
};

// Pilot Recognition Ticker Component - Shows actual airline readiness based on real pilot data
interface AirlineReadiness {
  airline: string;
  status: 'eligible' | 'developing' | 'not-ready';
  matchScore: number;
  requirements: string[];
  metRequirements: string[];
}

const PilotRecognitionTicker: React.FC<{ 
  flightHours: number; 
  examPassRate: string;
  licenseType: string;
  airlineConnections: { name: string; status: string }[];
}> = ({ flightHours, examPassRate, licenseType, airlineConnections }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Calculate readiness based on actual pilot data
  const calculateReadiness = (): AirlineReadiness[] => {
    const passRateNum = parseInt(examPassRate) || 0;
    const hours = flightHours || 0;
    
    return airlineConnections.map(conn => {
      const requirements: string[] = [];
      const met: string[] = [];
      let score = 0;
      
      // Base requirements for any airline
      if (conn.name === 'Emirates') {
        requirements.push('3500+ flight hours', 'ATPL License', '90%+ exam scores', 'Type Rating');
        if (hours >= 3500) { met.push('Flight hours'); score += 25; }
        if (licenseType.includes('ATPL')) { met.push('ATPL License'); score += 25; }
        if (passRateNum >= 90) { met.push('Exam scores'); score += 25; }
        score += 25; // Assume type rating in progress
      } else if (conn.name === 'Etihad') {
        requirements.push('2000+ flight hours', 'CPL License', '85%+ exam scores');
        if (hours >= 2000) { met.push('Flight hours'); score += 33; }
        if (licenseType.includes('CPL') || licenseType.includes('ATPL')) { met.push('License'); score += 33; }
        if (passRateNum >= 85) { met.push('Exam scores'); score += 34; }
      } else if (conn.name === 'Fly Dubai') {
        requirements.push('1500+ flight hours', 'CPL License', '80%+ exam scores');
        if (hours >= 1500) { met.push('Flight hours'); score += 33; }
        if (licenseType.includes('CPL') || licenseType.includes('ATPL')) { met.push('License'); score += 33; }
        if (passRateNum >= 80) { met.push('Exam scores'); score += 34; }
      } else {
        requirements.push('1000+ flight hours', 'Valid License', '75%+ exam scores');
        if (hours >= 1000) { met.push('Flight hours'); score += 33; }
        if (!licenseType.includes('Student')) { met.push('License'); score += 33; }
        if (passRateNum >= 75) { met.push('Exam scores'); score += 34; }
      }
      
      let status: AirlineReadiness['status'] = 'not-ready';
      if (score >= 85) status = 'eligible';
      else if (score >= 60) status = 'developing';
      
      return {
        airline: conn.name,
        status,
        matchScore: Math.min(score, 100),
        requirements,
        metRequirements: met
      };
    });
  };
  
  const readinessData = calculateReadiness();
  
  useEffect(() => {
    if (readinessData.length === 0) return;
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % readinessData.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [readinessData.length]);

  if (readinessData.length === 0) {
    return (
      <div style={{
        background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        borderRadius: '20px',
        padding: '1.25rem 1.75rem',
        display: 'flex',
        alignItems: 'center',
        gap: '1rem',
        boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
        border: '1px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ color: '#94a3b8', fontSize: '0.9rem' }}>
          No airline connections. Add airlines to your profile to see recognition status.
        </div>
      </div>
    );
  }

  const current = readinessData[currentIndex];
  
  const statusConfig = {
    eligible: { color: '#22c55e', bgColor: 'rgba(34, 197, 94, 0.15)', label: 'Eligible' },
    developing: { color: '#f59e0b', bgColor: 'rgba(245, 158, 11, 0.15)', label: 'Developing' },
    'not-ready': { color: '#ef4444', bgColor: 'rgba(239, 68, 68, 0.15)', label: 'Building' }
  };
  
  const statusStyle = statusConfig[current.status];

  return (
    <div style={{
      background: 'linear-gradient(90deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
      borderRadius: '20px',
      padding: '1.25rem 1.75rem',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      boxShadow: '0 15px 35px rgba(15, 23, 42, 0.2)',
      border: '1px solid rgba(255,255,255,0.08)'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        padding: '0.5rem 0.9rem',
        background: statusStyle.bgColor,
        borderRadius: '999px',
        border: `1px solid ${statusStyle.color}40`
      }}>
        <span style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          background: statusStyle.color,
          animation: 'pulse 2s infinite'
        }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 600, color: statusStyle.color, textTransform: 'uppercase', letterSpacing: '0.08em' }}>
          {statusStyle.label}
        </span>
      </div>

      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div key={currentIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', animation: 'slideIn 0.5s ease' }}>
          <span style={{ fontSize: '1.3rem' }}>🏆</span>
          <span style={{ fontSize: '1rem', fontWeight: 600, color: 'white' }}>{current.airline}:</span>
          <span style={{ fontSize: '1rem', color: '#cbd5f5' }}>
            {current.metRequirements.length}/{current.requirements.length} requirements met
          </span>
          <span style={{
            marginLeft: 'auto',
            padding: '0.25rem 0.9rem',
            background: current.matchScore >= 85 ? 'rgba(34, 197, 94, 0.2)' : current.matchScore >= 60 ? 'rgba(245, 158, 11, 0.2)' : 'rgba(239, 68, 68, 0.2)',
            borderRadius: '999px',
            fontSize: '0.75rem',
            fontWeight: 600,
            color: current.matchScore >= 85 ? '#22c55e' : current.matchScore >= 60 ? '#f59e0b' : '#ef4444'
          }}>
            {current.matchScore}% Match
          </span>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.25rem' }}>
        {readinessData.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentIndex(i)}
            style={{
              width: '6px',
              height: '6px',
              borderRadius: '50%',
              border: 'none',
              padding: 0,
              background: i === currentIndex ? '#38bdf8' : 'rgba(255,255,255,0.3)',
              cursor: 'pointer'
            }}
          />
        ))}
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export const PilotProfilePage: React.FC<PilotProfilePageProps> = ({ onBack, onViewLogbook, onViewDigitalLogbook, onViewMentorLogbook, onViewAtlas, onViewRecognition, userProfile }) => {
  const [competencyScores] = useState({
    knowledge: 86,
    recency: 73,
    exams: 92,
    progress: 68,
    interview: 81,
    awareness: 88,
    resilience: 84
  });
  const [airlineAffiliations, setAirlineAffiliations] = useState([
    { id: 'etihad', name: 'Etihad Airways', logo: 'EY', status: 'connected' as const, lastSynced: '2 hours ago' },
    { id: 'airbus', name: 'Airbus', logo: 'AB', status: 'connected' as const, lastSynced: '1 day ago' },
    { id: 'emirates', name: 'Emirates', logo: 'EK', status: 'pending' as const },
    { id: 'flydubai', name: 'flydubai', logo: 'FZ', status: 'available' as const }
  ]);
  const baseCardStyle: React.CSSProperties = {
    background: 'linear-gradient(135deg, rgba(255,255,255,0.88), rgba(241,245,249,0.75))',
    borderRadius: '20px',
    padding: '1.5rem',
    boxShadow: '0 20px 45px rgba(15,23,42,0.08)',
    border: '1px solid rgba(255,255,255,0.45)',
    backdropFilter: 'blur(14px)',
    WebkitBackdropFilter: 'blur(14px)'
  };
  const [pilotData, setPilotData] = useState({
    name: `${userProfile?.firstName || 'Benjamin'} ${userProfile?.lastName || 'Bowler'}`,
    initials: `${(userProfile?.firstName || 'Benjamin')[0]}${(userProfile?.lastName || 'Bowler')[0]}`.toUpperCase(),
    role: 'STUDENT PILOT',
    base: 'EGLL (London Heathrow)',
    studyHours: 2,
    examHours: 0,
    totalHours: 0,
    picHours: 0,
    licenseType: 'Student Pilot',
    licenseStatus: 'Pending Verification',
    avgRating: '0%',
    passRate: '0%',
    interviewCount: 0,
    flightLogbookHours: 0,
    mentorHours: 'UNENROLLED / N/A',
    foundationalProgress: 'FOUNDATIONAL PROGRAM IN PROGRESS',
    radioLicenseNumber: 'N/A',
    radioLicenseExpiry: 'TBD',
    lastFlownDate: 'Not yet logged'
  });
  const [flightLogs, setFlightLogs] = useState<FlightLogEntry[]>([]);
  const [flightLogsLoading, setFlightLogsLoading] = useState(false);
  const [mentorHoursLabel, setMentorHoursLabel] = useState('Unenrolled');
  const [latestLogbookHours, setLatestLogbookHours] = useState(0);
  const { portfolio, updatePortfolio } = usePilotPortfolio(userProfile?.uid);
  const { score: recognitionScore, rank: recognitionRank, loading: scoreLoading } = useRecognitionScore();

  useEffect(() => {
    const fetchFirebaseData = async () => {
      if (!userProfile?.uid) {
        return;
      }

      let updatedRadioNumber = pilotData.radioLicenseNumber;
      let updatedRadioExpiry = pilotData.radioLicenseExpiry;
      let lastEntryDate = pilotData.lastFlownDate;

      try {
        // Fetch study sessions from Supabase
        const { data: studyData, error: studyError } = await supabase
          .from('study_sessions')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('session_date', { ascending: false });

        if (studyError) {
          throw studyError;
        }

        let totalStudyMinutes = 0;
        (studyData || []).forEach((session) => {
          totalStudyMinutes += session.duration || 0;
        });
        const studyHours = Math.round(totalStudyMinutes / 60);

        // Fetch exam results from Supabase
        const { data: examData, error: examError } = await supabase
          .from('pilot_exams')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('exam_date', { ascending: false });

        if (examError) {
          throw examError;
        }

        let examHours = 0;
        let totalScore = 0;
        let examCount = 0;
        let passedCount = 0;
        (examData || []).forEach((exam) => {
          examHours += exam.duration || 0;
          if (exam.score !== undefined) {
            totalScore += Number(exam.score);
            examCount++;
          }
          if (exam.passed) passedCount++;
        });
        
        const avgRating = examCount > 0 ? `${Math.round(totalScore / examCount)}%` : '0%';
        const passRate = examCount > 0 ? `${Math.round((passedCount / examCount) * 100)}%` : '0%';

        // Fetch flight logbook hours from Supabase
        setFlightLogsLoading(true);
        const { data: logbookData, error: logbookError } = await supabase
          .from('pilot_flight_logs')
          .select('*')
          .eq('user_id', userProfile.uid)
          .order('date', { ascending: false });

        if (logbookError) {
          throw logbookError;
        }

        let totalFlightHours = 0;
        const entries: FlightLogEntry[] = (logbookData || []).map((log) => {
          totalFlightHours += Number(log.hours) || 0;
          return {
            id: log.id,
            date: log.date,
            aircraft: log.aircraft_type || log.aircraft,
            route: log.route,
            hours: Number(log.hours),
            remarks: log.remarks || ''
          };
        });

        if (entries[0]?.date) {
          lastEntryDate = new Date(entries[0].date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' });
        }

        let licenseType = pilotData.licenseType;
        let licenseStatus = pilotData.licenseStatus;
        let totalHoursOverride = pilotData.totalHours;
        let picHoursOverride = pilotData.picHours;
        let foundationalProgress = pilotData.foundationalProgress;

        try {
          const { data: profileData, error: profileError } = await supabase
            .from('pilot_profiles')
            .select('*')
            .eq('user_id', userProfile.uid)
            .single();

          if (profileError && profileError.code !== 'PGRST116') {
            throw profileError;
          }

          if (profileData) {
            licenseType = profileData.license_type || licenseType;
            licenseStatus = profileData.license_status || licenseStatus;
            totalHoursOverride = profileData.total_hours ?? totalHoursOverride;
            picHoursOverride = profileData.pic_hours ?? picHoursOverride;
            updatedRadioNumber = profileData.radio_license_number || updatedRadioNumber;
            updatedRadioExpiry = profileData.radio_license_expiry || updatedRadioExpiry;
          }
        } catch (profileError) {
          console.warn('Unable to load pilot profile license info:', profileError);
        }

        try {
          const { data: progressData, error: progressError } = await supabase
            .from('program_progress')
            .select('*')
            .eq('user_id', userProfile.uid)
            .eq('program_type', 'foundational')
            .single();

          if (progressError && progressError.code !== 'PGRST116') {
            throw progressError;
          }

          if (progressData) {
            const percent = Math.round(progressData.completion_percentage ?? 0);
            foundationalProgress = `${percent}% complete`;
          }
        } catch (progressError) {
          console.warn('Unable to load foundational progress:', progressError);
        }

        // Fetch mentor hours from study_sessions for mentorship entries
        let totalMentorHours = 0;
        try {
          const { data: mentorData, error: mentorError } = await supabase
            .from('study_sessions')
            .select('*')
            .eq('user_id', userProfile.uid)
            .eq('session_type', 'mentorship')
            .order('session_date', { ascending: false });

          if (mentorError) {
            console.warn('Unable to fetch mentor hours:', mentorError);
          } else if (mentorData && mentorData.length > 0) {
            let mentorMinutes = 0;
            mentorData.forEach((session) => {
              mentorMinutes += session.duration || 0;
            });
            totalMentorHours = Math.round(mentorMinutes / 60 * 10) / 10; // Round to 1 decimal
            setMentorHoursLabel(`${totalMentorHours} hr`);
          }
        } catch (mentorError) {
          console.warn('Unable to load mentor hours:', mentorError);
        }

        const logbookHoursRounded = parseFloat(totalFlightHours.toFixed(1));

        setPilotData((prev) => ({
          ...prev,
          studyHours,
          examHours: Math.round(examHours / 60),
          avgRating,
          passRate,
          flightLogbookHours: logbookHoursRounded,
          licenseType,
          licenseStatus,
          totalHours: logbookHoursRounded,
          picHours: picHoursOverride,
          foundationalProgress,
          radioLicenseNumber: updatedRadioNumber,
          radioLicenseExpiry: updatedRadioExpiry,
          lastFlownDate: lastEntryDate
        }));
        setLatestLogbookHours(logbookHoursRounded);
        setFlightLogs(entries);
        setFlightLogsLoading(false);
      } catch (error) {
        console.error('Error fetching pilot data:', error);
        setFlightLogsLoading(false);
      }
    };

    fetchFirebaseData();
  }, [userProfile?.uid]);

  return (
    <div className="dashboard-container animate-fade-in pilot-profile-page" style={{ backgroundColor: '#eef4fb', paddingBottom: '4rem' }}>
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
        <header className="pilot-profile-header" style={{
          padding: '3rem 4rem',
          background: 'linear-gradient(180deg, #fff 0%, #f0f4fb 100%)',
          position: 'relative',
          textAlign: 'center',
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
            Pilot Recognition Profile
          </p>
          <h1 style={{ fontSize: '2rem', marginTop: '0.5rem', marginBottom: '0.5rem', color: '#0f172a', fontWeight: 600 }}>
            Pilot Profile
          </h1>
        </header>

        <section style={{ padding: '2rem clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
            <CategorySection title="Pilot Data" description="Identity, credentials, flight activity, and core hour summaries">
              {(() => {
                const quickStatCards = [
                  { title: 'Total Flight Hours', value: `${pilotData.flightLogbookHours.toFixed(1)} hr`, subtitle: 'Logged via WingMentor', accent: '#0ea5e9' },
                  { title: 'Mentor Hours', value: mentorHoursLabel, subtitle: 'Mentor engagement', accent: '#f97316' },
                  { title: 'Study Hours', value: `${pilotData.studyHours}`, subtitle: 'Focused study time', accent: '#2563eb' },
                  { title: 'Exam Hours', value: `${pilotData.examHours}`, subtitle: 'Assessment prep', accent: '#6366f1' }
                ];

                return (
                  <>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', alignItems: 'stretch' }}>
                      <div className="pilot-profile-glass-card" style={{ ...baseCardStyle, textAlign: 'center', display: 'flex', flexDirection: 'column', gap: '1.25rem', justifyContent: 'space-between' }}>
                        <div>
                          <div style={{
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#0f172a',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            margin: '0 auto 1rem',
                            fontSize: '2rem',
                            fontWeight: 600,
                            color: 'white',
                            boxShadow: '0 15px 35px rgba(15, 23, 42, 0.25)'
                          }}>
                            {pilotData.initials}
                          </div>
                          <h2 style={{ fontSize: '1.4rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.25rem' }}>{pilotData.name}</h2>
                          <p style={{ fontSize: '0.75rem', color: '#2563eb', fontWeight: 600, letterSpacing: '0.18em', marginBottom: '0.2rem' }}>{pilotData.role}</p>
                          <p style={{ fontSize: '0.8rem', color: '#64748b' }}>Base: {pilotData.base}</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem', width: '100%' }}>
                          {[{ label: 'TTL Flight Time', value: pilotData.flightLogbookHours.toFixed(1) }, { label: 'TTL Mentor Hours', value: pilotData.studyHours }].map(tile => (
                            <div key={tile.label} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)' }}>
                              <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.12em', color: '#94a3b8', textTransform: 'uppercase' }}>{tile.label}</p>
                              <p style={{ margin: '0.35rem 0 0', fontSize: '1.35rem', fontWeight: 700, color: '#0f172a' }}>{tile.value}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ textAlign: 'center', marginTop: '0.75rem' }}>
                          <span
                            onClick={onViewRecognition}
                            style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                          >
                            View Recognition & Achievements →
                          </span>
                        </div>
                      </div>

                      <div className="pilot-profile-glass-card" style={{ ...baseCardStyle, display: 'flex', flexDirection: 'column', gap: '1.1rem' }}>
                        <div>
                          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Pilot Credentials</h3>
                          <p style={{ margin: '0.35rem 0 0', color: '#64748b', fontSize: '0.85rem' }}>Licensing, hours, and access pass</p>
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                          {[{ label: 'Dual XC hrs', value: 0 }, { label: 'Dual LOC', value: 0 }, { label: 'PIC LOC', value: pilotData.picHours }, { label: 'LOC XC', value: pilotData.totalHours }].map(tile => (
                            <div key={tile.label} style={{ background: 'rgba(255,255,255,0.9)', borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', textAlign: 'center' }}>
                              <p style={{ margin: 0, fontSize: '0.65rem', color: '#6b7280', letterSpacing: '0.1em' }}>{tile.label}</p>
                              <p style={{ margin: '0.35rem 0 0', fontSize: '1.3rem', fontWeight: 700, color: '#0f172a' }}>{tile.value}</p>
                            </div>
                          ))}
                        </div>
                        <div style={{ borderRadius: '12px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)' }}>
                          {[
                            { label: 'Type', value: pilotData.licenseType },
                            { label: 'Status', value: pilotData.licenseStatus }
                          ].map(row => (
                            <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#475569', marginTop: row.label === 'Type' ? 0 : '0.35rem' }}>
                              <span>{row.label}</span>
                              <strong style={{ color: '#0f172a' }}>{row.value}</strong>
                            </div>
                          ))}
                        </div>
                        <div style={{ marginTop: '0.25rem', textAlign: 'center' }}>
                          <span
                            onClick={onViewDigitalLogbook}
                            style={{ fontSize: '0.75rem', color: '#2563eb', cursor: 'pointer', textDecoration: 'underline', fontWeight: 500 }}
                          >
                            View Flight Digital Logbook →
                          </span>
                        </div>
                      </div>

                      <div className="pilot-profile-glass-card" style={{ ...baseCardStyle, minHeight: '100%' }}>
                        <div style={{ marginBottom: '0.75rem' }}>
                          <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.25em', color: '#94a3b8', textTransform: 'uppercase' }}>Readiness Snapshot</p>
                          <h3 style={{ margin: '0.35rem 0 0', fontSize: '1rem', fontWeight: 600, color: '#0f172a' }}>Resource & Availability</h3>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                          {[
                            { label: 'Medical Certificate', value: 'Valid - 06/2025' },
                            { label: 'Radio License', value: `${pilotData.radioLicenseNumber} · Expires ${pilotData.radioLicenseExpiry}` },
                            { label: 'Last Flown', value: pilotData.lastFlownDate }
                          ].map(item => (
                            <div key={item.label} style={{ borderRadius: '14px', padding: '0.85rem', border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.9)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                              <div style={{ color: '#475569', fontSize: '0.8rem', fontWeight: 600 }}>{item.label}</div>
                              <div style={{ color: '#0f172a', fontWeight: 700, fontSize: '0.85rem', textAlign: 'right' }}>{item.value}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="pilot-profile-summary-card" style={{
                        gridColumn: '1 / -1',
                        background: 'white',
                        borderRadius: '26px',
                        padding: '1.5rem',
                        border: '1px solid rgba(226,232,240,0.9)',
                        boxShadow: '0 20px 45px rgba(15,23,42,0.08)'
                      }}>
                        <div style={{
                          display: 'grid',
                          gridTemplateColumns: `repeat(${quickStatCards.length}, minmax(0, 1fr))`,
                          gap: '0.35rem'
                        }}>
                          {quickStatCards.map((stat, index) => (
                            <div
                              key={stat.title}
                              style={{
                                padding: '0.4rem 0.75rem',
                                textAlign: 'center',
                                position: 'relative'
                              }}
                            >
                              {index < quickStatCards.length - 1 && (
                                <span
                                  aria-hidden
                                  style={{
                                    position: 'absolute',
                                    top: '20%',
                                    right: 0,
                                    width: '1px',
                                    height: '60%',
                                    background: 'linear-gradient(180deg, transparent, rgba(148,163,184,0.5), transparent)'
                                  }}
                                />
                              )}
                              <p style={{ margin: 0, fontSize: '0.6rem', letterSpacing: '0.18em', color: '#94a3b8', textTransform: 'uppercase' }}>{stat.title}</p>
                              <p style={{ margin: '0.35rem 0 0', fontSize: '1.85rem', fontWeight: 700, color: stat.accent }}>{stat.value}</p>
                              <p style={{ margin: '0.1rem 0 0', fontSize: '0.75rem', color: '#94a3b8' }}>{stat.subtitle}</p>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Pilot Portfolio - Full width rectangular card */}
                      <div style={{
                        gridColumn: '1 / -1',
                        background: 'white',
                        borderRadius: '16px',
                        padding: '1.25rem 2rem',
                        border: '1px solid rgba(226,232,240,0.9)',
                        boxShadow: '0 10px 30px rgba(15,23,42,0.06)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: '1.5rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                          <div style={{
                            width: '48px',
                            height: '48px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #0ea5e9, #0284c7)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.5rem'
                          }}>
                            📄
                          </div>
                          <div>
                            <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.2em', color: '#94a3b8', textTransform: 'uppercase' }}>Pilot Portfolio</p>
                            <h3 style={{ margin: '0.2rem 0', fontSize: '1.1rem', fontWeight: 600, color: '#0f172a' }}>Atlas Formatted Resume</h3>
                            <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem' }}>Preview the recruiter-ready resume on Recognition & Achievements</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                          <button
                            style={{
                              padding: '0.75rem 1.5rem',
                              borderRadius: '10px',
                              border: 'none',
                              background: '#0ea5e9',
                              color: '#fff',
                              fontWeight: 600,
                              cursor: 'pointer',
                              fontSize: '0.9rem'
                            }}
                            onClick={() => {
                              if (onViewAtlas) {
                                onViewAtlas();
                              } else {
                                window.location.href = '/atlas-resume';
                              }
                            }}
                          >
                            View Atlas Resume
                          </button>
                        </div>
                      </div>
                      
                      {/* Recognition Score Card */}
                      <div className="pilot-profile-glass-card" style={{ ...baseCardStyle }}>
                        <RecognitionScoreCard
                          score={recognitionScore?.total_score || 0}
                          tier={recognitionScore?.score_tier}
                          rank={recognitionRank || undefined}
                          showRank={true}
                          showShare={true}
                          compact={false}
                        />
                      </div>
                    </div>

                  </>
                );
              })()}
            </CategorySection>

            <CategorySection title="Pilot Logbooks" description="Verified flight records, digital access, and mentor logbook links">
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
                <div className="pilot-profile-glass-card" style={{ ...baseCardStyle, borderRadius: '24px', padding: '1.75rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
                    <div>
                      <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase' }}>Flight Logbook</p>
                      <h3 style={{ margin: '0.35rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Recent Hours</h3>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Total</div>
                      <div style={{ fontSize: '1.75rem', fontWeight: 700, color: '#0ea5e9' }}>{pilotData.flightLogbookHours.toFixed(1)}</div>
                    </div>
                  </div>

                  {flightLogsLoading ? (
                    <div style={{ textAlign: 'center', color: '#94a3b8', padding: '1rem 0' }}>Loading...</div>
                  ) : flightLogs.length === 0 ? (
                    <div style={{
                      padding: '1.25rem',
                      borderRadius: '14px',
                      border: '1px dashed rgba(148, 163, 184, 0.4)',
                      textAlign: 'center',
                      color: '#94a3b8',
                      fontSize: '0.9rem'
                    }}>
                      No recent flights logged
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      {flightLogs.slice(0, 3).map((log) => (
                        <div
                          key={log.id}
                          style={{
                            borderRadius: '12px',
                            border: '1px solid rgba(226,232,240,0.6)',
                            padding: '0.85rem 1rem',
                            background: 'rgba(255,255,255,0.6)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.75rem', color: '#94a3b8' }}>{log.date}</div>
                            <div style={{ fontSize: '0.95rem', fontWeight: 600, color: '#0f172a' }}>{log.route}</div>
                          </div>
                          <div style={{ fontWeight: 700, color: '#0ea5e9', fontSize: '1.1rem' }}>{(log.hours || 0).toFixed(1)}h</div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pilot-profile-glass-card" style={{ ...baseCardStyle, borderRadius: '24px', padding: '1.75rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div>
                    <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase' }}>Mentor Engagement</p>
                    <h3 style={{ margin: '0.35rem 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>Recent Mentor Hours</h3>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 600, marginTop: '0.5rem', color: '#0f172a' }}>
                      <span>{pilotData.studyHours} hr mentorship</span>
                      <span>{mentorHoursLabel}</span>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b', fontSize: '0.85rem', marginTop: '0.35rem' }}>
                      <span>Observations: {pilotData.examHours}</span>
                      <span>Cases: {pilotData.interviewCount}</span>
                    </div>
                  </div>
                  <button
                    style={{
                      borderRadius: '999px',
                      border: 'none',
                      padding: '0.75rem 2rem',
                      background: '#0ea5e9',
                      color: '#fff',
                      fontWeight: 600,
                      cursor: 'pointer',
                      fontSize: '0.95rem'
                    }}
                    onClick={onViewLogbook}
                  >
                    View Mentor Logbook
                  </button>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
                <div className="pilot-profile-glass-card" style={{ background: 'white', borderRadius: '22px', padding: '1.25rem', border: '1px solid rgba(226,232,240,0.9)', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                  <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#94a3b8' }}>Logbook</p>
                  <h3 style={{ margin: '0.35rem 0 0.75rem', fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>Digital Logbook Access</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', minHeight: '2.25rem' }}>Verified flight record history</p>
                  <button
                    style={{
                      marginTop: '1rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '0.65rem 1.4rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#0f172a',
                      background: 'rgba(15,23,42,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15,23,42,0.12)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(15,23,42,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={() => {
                      console.log('Digital Logbook clicked, handler:', onViewDigitalLogbook);
                      onViewDigitalLogbook?.();
                    }}
                  >
                    Open Logbook
                  </button>
                </div>

                <div style={{ background: 'white', borderRadius: '22px', padding: '1.25rem', border: '1px solid rgba(226,232,240,0.9)', boxShadow: '0 10px 30px rgba(15,23,42,0.04)' }}>
                  <p style={{ margin: 0, fontSize: '0.65rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: '#94a3b8' }}>Logbook</p>
                  <h3 style={{ margin: '0.35rem 0 0.75rem', fontSize: '1.2rem', fontWeight: 600, color: '#0f172a' }}>Foundational Program Mentor Logbook</h3>
                  <p style={{ margin: 0, color: '#64748b', fontSize: '0.85rem', minHeight: '2.25rem' }}>Linked to portal in future</p>
                  <button
                    style={{
                      marginTop: '1rem',
                      borderRadius: '999px',
                      border: '1px solid rgba(0,0,0,0.12)',
                      padding: '0.65rem 1.4rem',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      color: '#047857',
                      background: 'rgba(15,23,42,0.06)',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = 'rgba(15,23,42,0.12)';
                      e.currentTarget.style.transform = 'translateY(-1px)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'rgba(15,23,42,0.06)';
                      e.currentTarget.style.transform = 'translateY(0)';
                    }}
                    onClick={() => {
                      console.log('Mentor Logbook clicked, handler:', onViewMentorLogbook);
                      onViewMentorLogbook?.();
                    }}
                  >
                    Open Logbook
                  </button>
                </div>
              </div>
            </CategorySection>

            <CategorySection title="Pilot Status" description="Live job alignment, readiness metrics, and mentor touchpoints">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div className="pilot-profile-glass-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                      <div>
                        <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase' }}>Performance Statistics</p>
                        <h3 style={{ margin: '0.4rem 0 0', fontSize: '1.1rem', fontWeight: 600 }}>Unified Tracking & Progress</h3>
                      </div>
                      <span style={{ fontSize: '0.7rem', fontWeight: 600, color: '#0ea5e9', padding: '0.25rem 0.85rem', borderRadius: '999px', border: '1px solid rgba(14, 165, 233, 0.3)' }}>{pilotData.avgRating}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                      {[{ title: 'Exam Progress', subtitle: 'Historical Scores & Subject Mastery' }, { title: 'Study Tracking', subtitle: 'Distribution Analysis & Clock Time' }].map(card => (
                        <div key={card.title} className="pilot-profile-glass-card" style={{ flex: '1 1 240px', background: '#f8fafc', borderRadius: '14px', padding: '1rem', border: '1px solid #e2e8f0' }}>
                          <p style={{ margin: 0, fontSize: '0.75rem', letterSpacing: '0.08em', textTransform: 'uppercase', color: '#94a3b8' }}>{card.title}</p>
                          <p style={{ margin: '0.5rem 0 0', color: '#0f172a' }}>{card.subtitle}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase' }}>Official Results</p>
                    <h3 style={{ margin: '0.4rem 0 1rem', fontSize: '1rem', fontWeight: 600 }}>Foundational Program Progress</h3>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '0.75rem' }}>
                      <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Pass Rate</p>
                        <p style={{ margin: '0.35rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{pilotData.passRate}</p>
                      </div>
                      <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '0.85rem', textAlign: 'center' }}>
                        <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Interview</p>
                        <p style={{ margin: '0.35rem 0 0', fontSize: '1.25rem', fontWeight: 700, color: '#0f172a' }}>{pilotData.interviewCount}</p>
                      </div>
                    </div>
                    <div style={{ background: '#fef3c7', borderRadius: '12px', padding: '0.9rem', textAlign: 'center', fontWeight: 600, color: '#92400e', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
                      {pilotData.foundationalProgress}
                    </div>
                  </div>

                  <div className="pilot-profile-glass-card" style={{ background: 'white', borderRadius: '20px', padding: '1.5rem', boxShadow: '0 18px 50px rgba(15, 23, 42, 0.06)', border: '1px solid rgba(226, 232, 240, 0.8)' }}>
                    <p style={{ margin: 0, fontSize: '0.7rem', letterSpacing: '0.3em', color: '#94a3b8', textTransform: 'uppercase' }}>Mentor Feedback</p>
                    <p style={{ fontSize: '0.9rem', color: '#64748b', textAlign: 'center', padding: '1.5rem 0', margin: 0 }}>No mentor feedback available yet.</p>
                  </div>

                </div>
                <div>
                  <PilotRecognitionTicker 
                    flightHours={latestLogbookHours} 
                    examPassRate={pilotData.passRate}
                    licenseType={pilotData.licenseType}
                    airlineConnections={airlineAffiliations.map(a => ({ name: a.name, status: a.status }))}
                  />
                </div>
              </div>
            </CategorySection>
          </div>
        </section>

        {/* Airline Passport + Competency Compass */}
        <section style={{ padding: '0 clamp(1.5rem, 4vw, 3.5rem) 3rem' }}>
          <CategorySection title="Recruiter Visibility" description="Sync your verified data with partner airlines and showcase competency scores">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
              <AirlinePassport userId={userProfile?.uid} />
              <CompetencyCompass scores={competencyScores} />
            </div>
          </CategorySection>
        </section>
      </main>
    </div>
  );
};
