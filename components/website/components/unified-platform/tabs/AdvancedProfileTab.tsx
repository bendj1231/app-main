import React from 'react';
import { PilotLicensureExperiencePage } from '../../pilot-recognition/PilotLicensureExperiencePage';
import type { TabId } from '../types';

interface AdvancedProfileTabProps {
  setTab: (tab: TabId) => void;
  profile?: any;
}

export const AdvancedProfileTab: React.FC<AdvancedProfileTabProps> = ({ setTab, profile }) => {
  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7 relative min-h-screen">
      <PilotLicensureExperiencePage
        onBack={() => setTab('verification')}
        userProfile={profile ? {
          id: profile.id,
          uid: profile.uid || profile.auth0_id,
          firstName: profile.first_name || '',
          lastName: profile.last_name || '',
          email: profile.email || ''
        } : null}
        embedded={true}
      />
    </div>
  );
};
