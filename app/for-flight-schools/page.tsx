import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ATOLaunchKitPage } from '@/components/website/components/ato/ATOLaunchKitPage';

export default function ForFlightSchoolsPage() {
  const navigate = useNavigate();

  const handleNavigate = (page: string) => {
    if (page === 'ato-register') {
      navigate('/enterprise/onboarding');
    } else if (page === 'ato-dashboard') {
      navigate('/enterprise/verification-dashboard');
    } else {
      navigate(`/${page}`);
    }
  };

  return (
    <ATOLaunchKitPage
      onBack={() => navigate(-1)}
      onNavigate={handleNavigate}
    />
  );
}
