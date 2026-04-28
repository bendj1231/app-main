import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '@/src/contexts/AuthContext';

const safeRedirect = (path: string) => {
  window.location.href = path;
};

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { currentUser, loading } = useAuth();

  useEffect(() => {
    if (!loading && !currentUser) {
      safeRedirect('/');
    }
  }, [currentUser, loading]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Checking authentication...</div>
      </div>
    );
  }

  if (!currentUser) {
    return null;
  }

  return <>{children}</>;
};
