import React from 'react';
import { CareerPathwaysNavbar } from '../layout/CareerPathwaysNavbar';
import { MyPathwaysPage } from './MyPathwaysPage';
import { SafeMeshGradient } from '@/components/ui/SafeMeshGradient';

interface MyPathwaysStandalonePageProps {
  onLogin?: () => void;
}

export const MyPathwaysStandalonePage: React.FC<MyPathwaysStandalonePageProps> = ({ onLogin }) => {
  return (
    <div className="relative min-h-screen overflow-hidden bg-slate-950">
      {/* MeshGradient background - same shader used in the platform home tab */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-slate-900" />
        <SafeMeshGradient
          className="w-full h-full"
          colors={[
            '#dbeafe',
            '#94a3b8',
            '#64748b',
            '#475569',
            '#334155',
            '#1e3a5f',
            '#1e3a8a',
            '#0f172a',
          ]}
          speed={0.22}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)',
          }}
        />
      </div>

      <CareerPathwaysNavbar onLogin={onLogin} />
      <div className="relative z-10 pt-24">
        <MyPathwaysPage />
      </div>
    </div>
  );
};
