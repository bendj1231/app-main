import React from 'react';
import { PilotRecognitionProfilePage } from '@/components/website/components/pilot-recognition/PilotRecognitionProfilePage';
import { RecognitionAIChat } from '@/components/website/components/unified-platform/RecognitionAIChat';

export const ProfileTab: React.FC<{ onNavigate: (page: string) => void; profile: any; walletChecks: any[] }> = ({ onNavigate, profile, walletChecks }) => (
  <div className="space-y-6">
    <PilotRecognitionProfilePage
      onNavigate={onNavigate}
      embedded={false}
      injectedWalletData={profile ? { did: profile.wallet_did || null, credentials: walletChecks } : undefined}
    />
    <RecognitionAIChat profile={profile ?? null} />
  </div>
);
