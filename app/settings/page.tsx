'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { SettingsDirectoryPage } from '../../components/website/components/SettingsDirectoryPage';

export default function SettingsPage() {
  const router = useRouter();

  return (
    <SettingsDirectoryPage
      onBack={() => router.back()}
      onNavigate={(page: string) => {
        if (page === 'portal') {
          router.push('/portal');
        } else if (page === 'subscription') {
          router.push('/subscription');
        } else if (page === 'notifications') {
          router.push('/notifications');
        } else if (page === 'privacy') {
          router.push('/privacy-policy');
        } else if (page === 'appearance') {
          router.push('/appearance');
        } else if (page === 'language') {
          router.push('/language');
        } else if (page === 'pilot-terminal-settings') {
          router.push('/pilot-terminal');
        } else if (page === 'contact-support') {
          router.push('/contact');
        } else {
          router.push(`/${page}`);
        }
      }}
      onLogin={() => router.push('/login')}
    />
  );
}
