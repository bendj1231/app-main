/**
 * PilotRecognition - Main Entry Point
 * Refactored for performance with lazy loading and modular architecture
 */

// Buffer polyfill for gray-matter (browser compatibility)
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  (window as any).Buffer = Buffer;
}

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Styles } from '@/src/components/ui/Styles';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ToastProvider } from '@/src/components/ui/toast';
import { AppRoutes } from '@/src/routes/AppRoutes';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import './index.css';

const Auth0ProviderWithNavigate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();
  
  // Single Auth0 Application for ALL domains
  // pilotrecognition.com manages pilot profiles across all properties
  const auth0Config = {
    domain: 'dev-ir828tguibp1dh5f.eu.auth0.com',
    clientId: 'FSW7zJxyBNJRvZGxN2xGH2bAQxwzHVmb', // PilotRecognition Application
    audience: 'https://dev-ir828tguibp1dh5f.eu.auth0.com/api/v2/'
  };
  
  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/auth/callback`,
        audience: auth0Config.audience,
        scope: 'openid profile email'
      }}
      onRedirectCallback={() => {
        navigate('/auth/callback', { replace: true });
      }}
      skipRedirectCallback={
        window.location.pathname === '/auth/logbook/callback' ||
        (window.location.search.includes('code=') && !window.location.search.includes('state='))
      }
    >
      {children}
    </Auth0Provider>
  );
};

// Suppress specific benign ResizeObserver loop warning from framer-motion
const resizeObserverErrorHandler = (e: ErrorEvent) => {
  if (
    e.message &&
    typeof e.message === 'string' &&
    e.message.includes('ResizeObserver loop completed with undelivered notifications')
  ) {
    e.stopImmediatePropagation();
    e.preventDefault();
  }
};

window.addEventListener('error', resizeObserverErrorHandler);

// Clear explicit logout flag when returning from MFB logbook OAuth callback
if (window.location.pathname === '/auth/logbook/callback') {
  localStorage.removeItem('explicitLogout');
}

// Check if root already exists to prevent duplicate createRoot calls
const rootElement = document.getElementById('root');
let root;
if (rootElement && !(rootElement as any)._reactRoot) {
  root = createRoot(rootElement);
  (rootElement as any)._reactRoot = root;
} else if (rootElement && (rootElement as any)._reactRoot) {
  root = (rootElement as any)._reactRoot;
} else {
  root = createRoot(document.getElementById('root')!);
}

root.render(
  <BrowserRouter>
    <Auth0ProviderWithNavigate>
      <AuthProvider>
        <ToastProvider>
          <Styles />
          <ErrorBoundary>
            <AppRoutes />
          </ErrorBoundary>
        </ToastProvider>
      </AuthProvider>
    </Auth0ProviderWithNavigate>
  </BrowserRouter>
);
