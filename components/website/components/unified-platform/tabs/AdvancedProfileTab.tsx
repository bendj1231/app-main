import React, { useState } from 'react';
import {
  LayoutDashboard, User, BookOpen, FileText, Shield, Star, ChevronRight
} from 'lucide-react';
import { PilotLicensureExperiencePage } from '../../pilot-recognition/PilotLicensureExperiencePage';
import { LogbookHub } from '../../pilot-recognition/LogbookHub';
import type { TabId } from '../types';

type SidebarSection =
  | 'profile-information'
  | 'personal-details'
  | 'license-medical'
  | 'aircraft-ratings'
  | 'endorsements'
  | 'experience-career'
  | 'flight-logbooks'
  | 'documents'
  | 'vault';

const SECTIONS: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'profile-information',  label: 'Introduction',      icon: LayoutDashboard },
  { id: 'personal-details',     label: 'Personal Details',         icon: User },
  { id: 'license-medical',      label: 'License & Medical',        icon: Shield },
  { id: 'aircraft-ratings',     label: 'Aircraft Ratings',         icon: Star },
  { id: 'endorsements',         label: 'Endorsements',             icon: BookOpen },
  { id: 'experience-career',    label: 'Experience & Career',      icon: FileText },
  { id: 'flight-logbooks',      label: 'Flight Logbooks',          icon: BookOpen },
  { id: 'documents',            label: 'Documents',                icon: FileText },
  { id: 'vault',                label: 'Public Profile',           icon: Shield },
];

interface AdvancedProfileTabProps {
  setTab: (tab: TabId) => void;
  profile?: any;
}

export const AdvancedProfileTab: React.FC<AdvancedProfileTabProps> = ({ setTab, profile }) => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('profile-information');

  const userProfile = profile
    ? {
        id: profile.id,
        uid: profile.uid || profile.auth0_id,
        firstName: profile.first_name || '',
        lastName: profile.last_name || '',
        email: profile.email || '',
      }
    : null;

  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 relative h-screen flex overflow-hidden">
      {/* ─── Sidebar — old card style ─── */}
      <aside
        className="hidden md:flex flex-col flex-shrink-0 sticky top-0 h-screen overflow-hidden"
        style={{
          width: '280px',
          padding: '5rem 1rem 2rem 1.5rem',
          background: 'transparent',
          borderRight: 'none',
          gap: '0.75rem',
        }}
      >
        {/* Header with chevron */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          marginBottom: '1.5rem',
          paddingLeft: '0.25rem',
          overflow: 'hidden',
          width: '100%',
        }}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#ffffff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
          <div style={{ overflow: 'hidden', minWidth: 0 }}>
            <p style={{ margin: 0, fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500 }}>Pilot profile</p>
            <p style={{ margin: '2px 0 0', fontSize: '1.5rem', fontWeight: 400, color: '#ffffff', fontFamily: 'Georgia, "Times New Roman", serif', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>My Profile</p>
          </div>
        </div>

        {/* Navigation Items — card style */}
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', flexShrink: 0 }}>
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            const isVaultItem = section.id === 'vault';
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                style={{
                  position: 'relative',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.875rem 1rem',
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
                  minWidth: 0,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    if (isVaultItem) {
                      e.currentTarget.style.background = '#ffffff';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.25) 0%, rgba(29, 78, 216, 0.2) 100%)';
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.2)';
                    }
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    if (isVaultItem) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.92)';
                    } else {
                      e.currentTarget.style.background = 'linear-gradient(135deg, rgba(59, 130, 246, 0.15) 0%, rgba(29, 78, 216, 0.1) 100%)';
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
                    }
                  }
                }}
              >
                {isVaultItem ? (
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', minWidth: 0 }}>
                    <Icon size={16} style={{ color: '#dc2626', flexShrink: 0 }} />
                    <div style={{ overflow: 'hidden', minWidth: 0 }}>
                      <p style={{ margin: 0, fontSize: '0.8rem', fontWeight: 700, color: '#111827', lineHeight: 1.2, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        <span style={{ color: '#111827' }}>Public </span>
                        <span style={{ color: '#dc2626' }}>profile</span>
                      </p>
                      <p style={{ margin: '1px 0 0', fontSize: '0.55rem', color: '#6b7280', fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>Operator-facing profile view</p>
                    </div>
                  </div>
                ) : (
                  <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block', minWidth: 0 }}>{section.label}</span>
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
      </aside>

      {/* ─── Mobile section selector ─── */}
      <div className="md:hidden w-full px-4 pt-4 pb-2 overflow-x-auto flex gap-2" style={{ background: 'rgba(8,10,18,0.95)' }}>
        {SECTIONS.map((section) => {
          const Icon = section.icon;
          const isActive = activeSection === section.id;
          return (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg whitespace-nowrap transition-all"
              style={{
                background: isActive ? 'rgba(220,38,38,0.12)' : 'rgba(255,255,255,0.04)',
                border: isActive ? '1px solid rgba(220,38,38,0.3)' : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              <Icon size={14} style={{ color: isActive ? '#ef4444' : 'rgba(255,255,255,0.4)' }} />
              <span className="text-[11px] font-bold" style={{ color: isActive ? '#fff' : 'rgba(255,255,255,0.55)' }}>
                {section.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* ─── Content Area ─── */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        {(activeSection === 'profile-information' ||
          activeSection === 'personal-details' ||
          activeSection === 'license-medical' ||
          activeSection === 'aircraft-ratings' ||
          activeSection === 'endorsements' ||
          activeSection === 'experience-career') && (
          <PilotLicensureExperiencePage
            onBack={() => setTab('verification')}
            userProfile={userProfile}
            embedded={true}
            onGetStarted={() => setActiveSection('personal-details')}
            visibleSection={
              activeSection === 'personal-details' ? 'personal' :
              activeSection === 'license-medical' ? 'license-medical' :
              activeSection === 'aircraft-ratings' ? 'aircraft-ratings' :
              activeSection === 'endorsements' ? 'endorsements' :
              activeSection === 'experience-career' ? 'experience-career' :
              undefined
            }
            onNavigateSection={(section) => {
              if (section === 'personal') setActiveSection('personal-details');
              else if (section === 'license-medical') setActiveSection('license-medical');
              else if (section === 'aircraft-ratings') setActiveSection('aircraft-ratings');
              else if (section === 'endorsements') setActiveSection('endorsements');
              else if (section === 'experience-career') setActiveSection('experience-career');
            }}
          />
        )}

        {activeSection === 'flight-logbooks' && (
          <div className="p-6 lg:p-10">
            <LogbookHub
              profile={profile}
              onNavigate={(path) => {
                if (path.includes('recognition-plus')) setTab('recognition-plus' as TabId);
                else if (path.includes('logbook')) setTab('logbook' as TabId);
              }}
              onCompleteProfile={() => setTab('advanced-profile' as TabId)}
            />
          </div>
        )}

        {activeSection === 'documents' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Documents</h3>
            <p className="text-white/40 text-sm mb-8">Upload and manage your certificates and endorsements.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Document upload is available in the Profile Information tab.</p>
              <button
                onClick={() => setActiveSection('profile-information')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO PROFILE INFORMATION →
              </button>
            </div>
          </div>
        )}

        {activeSection === 'vault' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Public Profile</h3>
            <p className="text-white/40 text-sm mb-8">Control what airlines and operators see when they view your profile.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Public profile settings are available in the Profile Information tab.</p>
              <button
                onClick={() => setActiveSection('profile-information')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO PROFILE INFORMATION →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
