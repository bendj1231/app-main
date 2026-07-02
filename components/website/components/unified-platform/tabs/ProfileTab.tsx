import React from 'react';
import { PilotRecognitionProfilePage } from '@/components/website/components/pilot-recognition/PilotRecognitionProfilePage';

export const ProfileTab: React.FC<{ onNavigate: (page: string) => void; profile: any; walletChecks: any[] }> = ({ onNavigate, profile, walletChecks }) => (
  <div>
    <PilotRecognitionProfilePage
      onNavigate={onNavigate}
      embedded={false}
      injectedWalletData={profile ? { did: profile.wallet_did || null, credentials: walletChecks } : undefined}
    />
  </div>
);
