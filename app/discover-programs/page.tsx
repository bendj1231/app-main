"use client";

import React from 'react';
import { useNavigate } from 'react-router-dom';
import { TopNavbar } from '@/components/website/components/TopNavbar';

export default function DiscoverProgramsPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white discover-light">
      <TopNavbar
        onNavigate={(page) => navigate(`/${page}`)}
        onLogin={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
        currentPage="programs"
        isLight={true}
      />
      {/* Page intentionally blank except for navbar per request */}
    </div>
  );
}
