/**
 * PilotRecognition - Main Entry Point
 * Refactored for performance with lazy loading and modular architecture
 */

// Buffer polyfill for gray-matter (browser compatibility)
import { Buffer } from 'buffer';
if (typeof window !== 'undefined') {
  window.Buffer = Buffer;
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
  }
}

import React from 'react';
import { createRoot, type Root } from 'react-dom/client';
import { BrowserRouter, useNavigate } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Styles } from '@/src/components/ui/Styles';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ToastProvider } from '@/src/components/ui/toast';
import { AppRoutes } from '@/src/routes/AppRoutes';
import { ErrorBoundary } from '@/src/components/ErrorBoundary';
import './index.css';

declare global {
  interface Window {
    Buffer?: typeof Buffer;
    _reactRoot?: Root;
  }
}

const Auth0ProviderWithNavigate: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const navigate = useNavigate();

  // Single Auth0 Application for ALL domains
  // pilotrecognition.com manages pilot profiles across all properties
  const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN;
  const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID;
  const auth0Audience = import.meta.env.VITE_AUTH0_AUDIENCE;

  if (!auth0Domain || !auth0ClientId) {
    throw new Error(
      'Missing required Auth0 environment variables: VITE_AUTH0_DOMAIN, VITE_AUTH0_CLIENT_ID'
    );
  }

  const effectiveAuth0Audience =
    auth0Audience && !auth0Audience.includes('/api/v2/') ? auth0Audience : undefined;

  const auth0Config = {
    domain: auth0Domain,
    clientId: auth0ClientId,
    audience: effectiveAuth0Audience,
  };

  return (
    <Auth0Provider
      domain={auth0Config.domain}
      clientId={auth0Config.clientId}
      authorizationParams={{
        redirect_uri: `${window.location.origin}/auth/callback`,
        ...(auth0Config.audience ? { audience: auth0Config.audience } : {}),
        scope: 'openid profile email',
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

export {};

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
let root: Root;
if (rootElement) {
  const typedRootElement = rootElement as HTMLElement & { _reactRoot?: Root };
  if (!typedRootElement._reactRoot) {
    root = createRoot(typedRootElement);
    typedRootElement._reactRoot = root;
  } else {
    root = typedRootElement._reactRoot;
  }
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
