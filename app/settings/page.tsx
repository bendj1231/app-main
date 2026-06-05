'use client';

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SettingsDirectoryPage } from '../../components/website/components/SettingsDirectoryPage';

export default function SettingsPage() {
  const navigate = useNavigate();

  return (
    <SettingsDirectoryPage
      onBack={() => navigate(-1)}
      onNavigate={(page: string) => {
        if (page === 'portal') {
          navigate('/portal');
        } else if (page === 'subscription') {
          navigate('/subscription');
        } else if (page === 'notifications') {
          navigate('/notifications');
        } else if (page === 'privacy') {
          navigate('/privacy-policy');
        } else if (page === 'appearance') {
          navigate('/appearance');
        } else if (page === 'language') {
          navigate('/language');
        } else if (page === 'pilot-terminal-settings') {
          navigate('/pilot-terminal');
        } else if (page === 'contact-support') {
          navigate('/contact');
        } else {
          navigate(`/${page}`);
        }
      }}
      onLogin={() => navigate('/login')}
    />
  );
}
