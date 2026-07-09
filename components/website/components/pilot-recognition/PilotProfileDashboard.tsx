import React from 'react';
import { DashboardTab, type DashboardProfile } from '../unified-platform/tabs/DashboardTab';

interface PilotProfileDashboardProps {
  profile?: DashboardProfile;
  onNavigate?: (page: string) => void;
  onSetActiveSection?: (section: string) => void;
}

export const PilotProfileDashboard: React.FC<PilotProfileDashboardProps> = ({
  profile,
  onNavigate,
}) => {
  return (
    <div style={{ width: '100%', minHeight: '100%' }}>
      <DashboardTab
        profile={profile ?? {}}
        onNavigate={onNavigate ?? (() => {})}
      />
    </div>
  );
};
