import React from 'react';

export type TabId =
  | 'home'
  | 'profile'
  | 'wallet'
  | 'pathways'
  | 'programs'
  | 'airlines'
  | 'manufacturers'
  | 'atlas-cv'
  | 'logbook'
  | 'events'
  | 'newsroom'
  | 'settings'
  | 'score'
  | 'dashboard'
  | 'market-intel'
  | 'data-provenance'
  | 'cockpit'
  | 'verification'
  | 'advanced-profile'
  | 'foundation-welcome'
  | 'pathways-directory'
  | 'recognition-plus-tab'
  | 'pilot-shortage-support'
  | 'inbox'
  | 'recognition-plus';

export interface NavItem {
  id: TabId;
  label: string;
  icon: React.ComponentType<{ className?: string; size?: number }>;
  badge?: number;
}

export interface UnifiedPilotPlatformProps {
  onNavigate: (page: string) => void;
}
