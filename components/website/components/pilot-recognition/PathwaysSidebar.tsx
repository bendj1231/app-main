import React from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { motion } from 'framer-motion';
import { useAuth } from '../../@/contexts/AuthContext';
import { Target, TrendingUp, Award, Compass, Zap, BarChart3, Route, Star } from 'lucide-react';

export interface PathwaysSidebarProps {
  activeSection: 'airline-expectations' | 'type-ratings' | 'pilot-pathways' | 'aviation-authorities' | 'wallet';
  onNavigate: (page: string) => void;
  prScore?: number;
  matchPercentage?: number;
  topPathway?: string;
  topAirline?: string;
}

export const PathwaysSidebar: React.FC<PathwaysSidebarProps> = ({ 
  activeSection, 
  onNavigate,
  prScore = 72,
  matchPercentage = 68,
  topPathway = 'Commercial Pilot',
  topAirline = 'Qatar Airways'
}) => {
  const { currentUser } = useAuth();

  // Mock profile data - replace with real data from auth/profile
  const profileData = {
    name: (currentUser as any)?.user_metadata?.full_name || 'Benjamin Bowler',
    totalHours: '1,247',
    photoUrl: (currentUser as any)?.user_metadata?.avatar_url || null,
    initials: 'BB'
  };

  const navItems = [
    { id: 'airline-expectations' as const, label: 'Airline Expectations', page: currentUser ? 'portal-airline-expectations' : 'airline-expectations' },
    { id: 'type-ratings' as const, label: 'Aircraft Type-Ratings', page: 'type-rating-search' },
    { id: 'pilot-pathways' as const, label: 'Pilot Pathways', page: 'pathways-modern' },
    { id: 'aviation-authorities' as const, label: 'Global Aviation Authorities', page: 'global-aviation-authorities' },
  ];

  // Calculate score color
  const getScoreColor = (score: number) => {
    if (score >= 80) return '#10b981'; // emerald
    if (score >= 60) return '#3b82f6'; // blue
    if (score >= 40) return '#f59e0b'; // amber
    return '#ef4444'; // red
  };

  const scoreColor = getScoreColor(prScore);

  return (
    <motion.aside
      initial={{ opacity: 0, x: -32 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
      style={{
        width: '340px',
        flexShrink: 0,
        padding: '4.5rem 1rem 1rem 1.5rem',
        display: 'flex',
        flexDirection: 'column',
        gap: '0.75rem',
        background: 'rgba(5, 10, 20, 0.9)',
        backdropFilter: 'blur(16px)',
        position: 'fixed',
        left: 0,
        top: 0,
        height: '100vh',
        overflowY: 'hidden',
        overflowX: 'hidden',
        boxSizing: 'border-box',
        zIndex: 50,
        borderRight: '1px solid rgba(255,255,255,0.08)'
      }}
    >
      {/* Header with chevron like MSFS */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '0.5rem',
        paddingLeft: '0.25rem',
        overflow: 'hidden',
        width: '100%'
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
          <polyline points="9 18 15 12 9 6"></polyline>
        </svg>
        <div style={{ overflow: 'hidden', minWidth: 0 }}>
          <p style={{ margin: 0, fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Discover</p>
        </div>
      </div>

      {/* Navigation Items - Directory (Moved to top) */}
      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem', flexShrink: 0 }}>
        {navItems.map((item) => {
          const isVaultItem = 'isVault' in item && item.isVault;
          const isActive = isVaultItem 
            ? activeSection === 'wallet' 
            : activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => {
                if (onNavigate) {
                  onNavigate(item.page);
                } else {
                  safeRedirect(`/${item.page}`);
                }
              }}
              style={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '0.625rem 0.875rem',
                borderRadius: '4px',
                background: isVaultItem
                  ? (isActive ? '#ffffff' : 'rgba(255,255,255,0.92)')
                  : isActive
                  ? 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)'
                  : 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%)',
                border: isVaultItem ? `2px solid ${isActive ? '#dc2626' : 'rgba(220,38,38,0.4)'}` : 'none',
                color: isVaultItem ? '#111827' : '#ffffff',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                textAlign: 'left',
                fontSize: '0.85rem',
                fontWeight: 500,
                boxShadow: isVaultItem
                  ? (isActive ? '0 4px 20px rgba(220,38,38,0.4)' : '0 4px 20px rgba(0,0,0,0.3)')
                  : isActive
                  ? '0 4px 15px rgba(59, 130, 246, 0.4), inset 0 1px 0 rgba(255,255,255,0.2)'
                  : '0 2px 8px rgba(0,0,0,0.2)',
                overflow: 'hidden',
                width: '100%',
                minWidth: 0
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.2) 100%)';
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                }
              }}
            >
              {isVaultItem ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', minWidth: 0 }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="1" y="4" width="22" height="16" rx="2" ry="2"/><line x1="1" y1="10" x2="23" y2="10"/></svg>
                  <div style={{ overflow: 'hidden', minWidth: 0 }}>
                    <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}><span style={{ color: '#111827' }}>Access </span><span style={{ color: '#dc2626' }}>Wallet</span></p>
                    <p style={{ margin: '1px 0 0', fontSize: '0.55rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pilot Credential Wallet</p>
                  </div>
                </div>
              ) : (
                <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', minWidth: 0 }}>{item.label}</span>
              )}
              {isActive && (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={isVaultItem ? '#dc2626' : 'currentColor'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12"></polyline>
                </svg>
              )}
            </button>
          );
        })}
      </nav>

      {/* Profile Header Card */}
      <div style={{
        background: 'rgba(30, 41, 59, 0.8)',
        border: '1px solid rgba(255, 255, 255, 0.15)',
        borderRadius: '10px',
        padding: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.875rem' }}>
          {/* Profile Photo / Initials */}
          <div style={{
            width: '48px',
            height: '48px',
            borderRadius: '50%',
            background: profileData.photoUrl 
              ? 'transparent' 
              : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            border: '2px solid rgba(59, 130, 246, 0.3)',
            flexShrink: 0
          }}>
            {profileData.photoUrl ? (
              <img 
                src={profileData.photoUrl} 
                alt={profileData.name}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <span style={{ fontSize: '1.1rem', fontWeight: 600, color: '#ffffff' }}>{profileData.initials}</span>
            )}
          </div>
          
          {/* Name and Hours */}
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <p style={{ 
              margin: '0 0 2px', 
              fontSize: '1rem', 
              fontWeight: 600, 
              color: '#ffffff',
              whiteSpace: 'nowrap',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {profileData.name}
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#10b981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span style={{ fontSize: '0.8rem', color: '#10b981', fontWeight: 500 }}>
                {profileData.totalHours} hrs
              </span>
            </div>
          </div>
        </div>

        {/* Access Wallet Button - Under Profile */}
        <button
          onClick={() => onNavigate('wallet')}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
            width: '100%',
            marginTop: '0.75rem',
            padding: '0.5rem 0.75rem',
            background: 'rgba(255, 255, 255, 0.92)',
            border: '2px solid rgba(220, 38, 38, 0.4)',
            borderRadius: '6px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#ffffff';
            e.currentTarget.style.borderColor = '#dc2626';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(255, 255, 255, 0.92)';
            e.currentTarget.style.borderColor = 'rgba(220, 38, 38, 0.4)';
          }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#dc2626" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <rect x="1" y="4" width="22" height="16" rx="2" ry="2"/>
            <line x1="1" y1="10" x2="23" y2="10"/>
          </svg>
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              <span style={{ color: '#111827' }}>Access </span>
              <span style={{ color: '#dc2626' }}>Wallet</span>
            </p>
            <p style={{ margin: '1px 0 0', fontSize: '0.55rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Pilot Credential Wallet</p>
          </div>
        </button>
      </div>

      {/* Career Alignment Tools Section */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.08) 100%)',
        border: '1px solid rgba(59, 130, 246, 0.25)',
        borderRadius: '10px',
        padding: '0.75rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <Compass size={16} style={{ color: '#3b82f6' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: '#3b82f6', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Career Alignment</span>
        </div>

        {/* PR Score */}
        <div style={{ marginBottom: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.375rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <Award size={14} style={{ color: scoreColor }} />
              <span style={{ fontSize: '0.8rem', color: '#cbd5e1', fontWeight: 500 }}>Recognition Score</span>
            </div>
            <span style={{ fontSize: '0.9rem', fontWeight: 700, color: scoreColor }}>{prScore}</span>
          </div>
          <div style={{ 
            height: '6px', 
            background: 'rgba(255,255,255,0.1)', 
            borderRadius: '3px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${prScore}%`, 
              height: '100%', 
              background: `linear-gradient(90deg, ${scoreColor} 0%, ${scoreColor}dd 100%)`,
              borderRadius: '3px',
              transition: 'width 0.5s ease'
            }} />
          </div>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#64748b' }}>
            {prScore >= 80 ? 'Excellent standing for top airlines' : 
             prScore >= 60 ? 'Good match for major carriers' : 
             'Build experience to improve ranking'}
          </p>
        </div>

        {/* Match Pathway */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '6px', 
          padding: '0.5rem',
          marginBottom: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <Route size={14} style={{ color: '#10b981' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Top Pathway Match</span>
          </div>
          <p style={{ margin: '0 0 0.25rem', fontSize: '0.9rem', fontWeight: 600, color: '#ffffff' }}>{topPathway}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ 
              background: 'rgba(16, 185, 129, 0.2)', 
              color: '#10b981', 
              fontSize: '0.7rem', 
              fontWeight: 600, 
              padding: '0.125rem 0.5rem', 
              borderRadius: '4px' 
            }}>
              {matchPercentage}% Match
            </div>
            <Star size={12} style={{ color: '#f59e0b' }} />
          </div>
        </div>

        {/* Top Airline Target */}
        <div style={{ 
          background: 'rgba(255,255,255,0.05)', 
          borderRadius: '6px', 
          padding: '0.5rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.375rem', marginBottom: '0.375rem' }}>
            <Target size={14} style={{ color: '#f59e0b' }} />
            <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Target Airline</span>
          </div>
          <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 500, color: '#ffffff' }}>{topAirline}</p>
          <p style={{ margin: '0.25rem 0 0', fontSize: '0.65rem', color: '#64748b' }}>Based on your profile alignment</p>
        </div>
      </div>

      {/* Quick Actions */}
      <div style={{ display: 'flex', gap: '0.5rem' }}>
        <button
          onClick={() => onNavigate('pilot-compass')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            background: 'rgba(245, 158, 11, 0.15)',
            border: '1px solid rgba(245, 158, 11, 0.3)',
            borderRadius: '8px',
            color: '#f59e0b',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(245, 158, 11, 0.15)';
          }}
        >
          <TrendingUp size={14} />
          Analyze
        </button>
        <button
          onClick={() => onNavigate('become-member')}
          style={{
            flex: 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.375rem',
            padding: '0.5rem',
            background: 'rgba(59, 130, 246, 0.15)',
            border: '1px solid rgba(59, 130, 246, 0.3)',
            borderRadius: '8px',
            color: '#3b82f6',
            fontSize: '0.75rem',
            fontWeight: 600,
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.25)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(59, 130, 246, 0.15)';
          }}
        >
          <Zap size={14} />
          Boost
        </button>
      </div>
    </motion.aside>
  );
};

export default PathwaysSidebar;
