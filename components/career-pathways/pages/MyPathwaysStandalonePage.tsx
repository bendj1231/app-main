import React from 'react';
import { CareerPathwaysNavbar } from '../layout/CareerPathwaysNavbar';
import { MyPathwaysPage } from './MyPathwaysPage';

interface MyPathwaysStandalonePageProps {
  onLogin?: () => void;
}

export const MyPathwaysStandalonePage: React.FC<MyPathwaysStandalonePageProps> = ({
  onLogin,
}) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <CareerPathwaysNavbar onLogin={onLogin} />
      <div className="pt-24">
        <MyPathwaysPage />
      </div>
    </div>
  );
};
