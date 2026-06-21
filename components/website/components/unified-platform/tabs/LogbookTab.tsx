import React from 'react';
import { DigitalLogbookPage } from '@/components/website/components/pilot-recognition/DigitalLogbookPage';

export const LogbookTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile }) => {
  return (
    <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
      <DigitalLogbookPage
        onBack={() => {}}
        userProfile={profile ? { id: profile.id, uid: profile.id, firstName: profile.display_name?.split(' ')[0] || '', lastName: profile.display_name?.split(' ').slice(1).join(' ') || '', email: profile.email || '' } : null}
      />
    </div>
  );
};
