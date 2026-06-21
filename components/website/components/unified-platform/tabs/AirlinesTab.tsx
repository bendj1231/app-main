import React from 'react';
import { PortalAirlineExpectationsPage } from '@/portal/pages/PortalAirlineExpectationsPage';

export const AirlinesTab: React.FC<{ onNavigate: (p: string) => void }> = ({ onNavigate }) => (
  <div className="-mx-5 lg:-mx-7 -mt-5 lg:-mt-7">
    <PortalAirlineExpectationsPage onBack={() => {}} onNavigate={onNavigate} />
  </div>
);
