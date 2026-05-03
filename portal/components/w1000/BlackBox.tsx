import React from 'react';
import BlackBox from '../../../external-references/W12/components/BlackBox';

interface BlackBoxProps {
  isLoggedIn?: boolean;
  onLogin?: () => void;
  onLogout?: () => void;
  userProfile?: {
    displayName?: string;
    email?: string;
    avatarUrl?: string;
  };
}

const BlackBoxWrapper: React.FC<BlackBoxProps> = ({ isLoggedIn = true, onLogin, onLogout, userProfile }) => {
  return <BlackBox isLoggedIn={isLoggedIn} onLogin={onLogin || (() => {})} onLogout={onLogout || (() => {})} userProfile={userProfile} />;
};

export default BlackBoxWrapper;