import React from 'react';
import { DigitalLogbookPage } from '@/components/website/components/pilot-recognition/DigitalLogbookPage';
import { RecognitionAIChat } from '@/components/website/components/unified-platform/RecognitionAIChat';

export const LogbookTab: React.FC<{ profile: any; onNavigate: (p: string) => void }> = ({ profile }) => {
  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <RecognitionAIChat profile={profile} />
      <DigitalLogbookPage
        onBack={() => {}}
        userProfile={profile ? { id: profile.id, uid: profile.id, firstName: profile.display_name?.split(' ')[0] || '', lastName: profile.display_name?.split(' ').slice(1).join(' ') || '', email: profile.email || '' } : null}
      />
    </div>
  );
};
