import React, { useState } from 'react';
import {
  LayoutDashboard, User, BookOpen, FileText, Shield, ChevronRight
} from 'lucide-react';
import { PilotLicensureExperiencePage } from '../../pilot-recognition/PilotLicensureExperiencePage';
import type { TabId } from '../types';

type SidebarSection =
  | 'overview'
  | 'statistics'
  | 'logbook'
  | 'photos'
  | 'identity'
  | 'vault';

const SECTIONS: { id: SidebarSection; label: string; icon: React.ComponentType<{ size?: number; className?: string }> }[] = [
  { id: 'overview',     label: 'Overview',             icon: LayoutDashboard },
  { id: 'statistics',   label: 'Licensure & Currency', icon: FileText },
  { id: 'logbook',      label: 'Flight Logbooks',      icon: BookOpen },
  { id: 'photos',       label: 'Certificates',         icon: FileText },
  { id: 'identity',     label: 'About & Experience',   icon: User },
  { id: 'vault',        label: 'Public Profile',       icon: Shield },
];

interface AdvancedProfileTabProps {
  setTab: (tab: TabId) => void;
  profile?: any;
}

export const AdvancedProfileTab: React.FC<AdvancedProfileTabProps> = ({ setTab, profile }) => {
  const [activeSection, setActiveSection] = useState<SidebarSection>('overview');

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
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 relative min-h-screen flex">
      {/* ─── Sidebar ─── */}
      <aside
        className="hidden md:flex flex-col w-64 flex-shrink-0 sticky top-0 h-screen overflow-y-auto"
        style={{
          background: 'linear-gradient(180deg, rgba(15,23,42,0.98) 0%, rgba(8,10,18,0.98) 100%)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
        }}
      >
        {/* Header */}
        <div className="px-5 pt-6 pb-4">
          <p className="text-[10px] font-black tracking-[0.2em] uppercase text-white/30">Pilot Profile</p>
          <h2 className="text-lg font-black text-white tracking-tight mt-1">My Profile</h2>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 pb-4 space-y-0.5">
          {SECTIONS.map((section) => {
            const Icon = section.icon;
            const isActive = activeSection === section.id;
            return (
              <button
                key={section.id}
                onClick={() => setActiveSection(section.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left transition-all group"
                style={{
                  background: isActive ? 'rgba(220,38,38,0.10)' : 'transparent',
                  border: isActive ? '1px solid rgba(220,38,38,0.25)' : '1px solid transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.8)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive) {
                    e.currentTarget.style.background = 'transparent';
                    e.currentTarget.style.color = 'rgba(255,255,255,0.55)';
                  }
                }}
              >
                <Icon
                  size={16}
                  className="flex-shrink-0 transition-colors"
                  style={{ color: isActive ? '#ef4444' : 'rgba(255,255,255,0.35)' }}
                />
                <span
                  className="text-[13px] font-bold flex-1 transition-colors"
                  style={{ color: isActive ? '#ffffff' : 'rgba(255,255,255,0.55)' }}
                >
                  {section.label}
                </span>
                {isActive && (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 6 9 17 4 12"></polyline>
                  </svg>
                )}
              </button>
            );
          })}
        </nav>

        {/* Collapse button */}
        <div className="px-5 py-4 mt-auto" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            className="w-full flex items-center justify-center gap-2 py-2 rounded-lg text-[11px] font-bold transition-all"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)', color: 'rgba(255,255,255,0.4)' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="9 18 15 12 9 6"></polyline>
            </svg>
            Collapse
          </button>
        </div>
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
      <main className="flex-1 min-w-0">
        {activeSection === 'overview' && (
          <PilotLicensureExperiencePage
            onBack={() => setTab('verification')}
            userProfile={userProfile}
            embedded={true}
          />
        )}

        {activeSection === 'statistics' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Licensure & Currency</h3>
            <p className="text-white/40 text-sm mb-8">View your license status, ratings, and currency information.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Licensure details are available in the Overview tab.</p>
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO OVERVIEW →
              </button>
            </div>
          </div>
        )}

        {activeSection === 'photos' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Certificates</h3>
            <p className="text-white/40 text-sm mb-8">Upload and manage your certificates and endorsements.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Certificate upload is available in the Overview tab.</p>
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO OVERVIEW →
              </button>
            </div>
          </div>
        )}

        {activeSection === 'identity' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">About & Experience</h3>
            <p className="text-white/40 text-sm mb-8">Manage your personal information and flight experience.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Profile editing is available in the Overview tab.</p>
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO OVERVIEW →
              </button>
            </div>
          </div>
        )}

        {activeSection === 'vault' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Public Profile</h3>
            <p className="text-white/40 text-sm mb-8">Control what airlines and operators see when they view your profile.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Public profile settings are available in the Overview tab.</p>
              <button
                onClick={() => setActiveSection('overview')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO OVERVIEW →
              </button>
            </div>
          </div>
        )}

        {activeSection === 'logbook' && (
          <div className="p-6 lg:p-10 max-w-3xl">
            <h3 className="text-white font-black text-xl tracking-tight mb-2">Flight Logbook</h3>
            <p className="text-white/40 text-sm mb-8">Sync and manage your digital flight logbooks.</p>
            <div className="rounded-2xl p-6 space-y-4" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
              <p className="text-white/30 text-sm">Connect your logbook provider to sync flight hours.</p>
              <button
                onClick={() => setTab('logbook')}
                className="px-4 py-2 rounded-lg text-xs font-black text-white transition-all hover:brightness-110"
                style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
              >
                GO TO LOGBOOK TAB →
              </button>
            </div>
          </div>
        )}

      </main>
    </div>
  );
};
