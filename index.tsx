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
import { BrowserRouter } from 'react-router-dom';
import { Auth0Provider } from '@auth0/auth0-react';
import { Styles } from '@/src/components/ui/Styles';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ToastProvider } from '@/src/components/ui/toast';
import { AppRoutes } from '@/src/routes/AppRoutes';
import './index.css';

// Suppress ResizeObserver loop warning (benign framer-motion issue)
const resizeObserverErrorHandler = (e: ErrorEvent) => {
  if (e.message === 'ResizeObserver loop completed with undelivered notifications.') {
    e.stopImmediatePropagation();
    e.preventDefault();
    e.stopPropagation();
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
  <Auth0Provider
    domain={import.meta.env.VITE_AUTH0_DOMAIN || 'dev-ir828tguibp1dh5f.eu.auth0.com'}
    clientId={import.meta.env.VITE_AUTH0_CLIENT_ID || 'FSW7zJxyBNJRvZGxN2xGH2bAQxwzHVmb'}
    authorizationParams={{
      redirect_uri: `${window.location.origin}/auth/callback`,
      scope: 'openid profile email'
    }}
    onRedirectCallback={(appState) => {
      const returnTo = appState?.returnTo || '/';
      window.history.replaceState({}, document.title, returnTo);
      window.location.replace(returnTo);
    }}
    skipRedirectCallback={
      window.location.pathname === '/auth/logbook/callback' ||
      (window.location.search.includes('code=') && !window.location.search.includes('state='))
    }
  >
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Styles />
          <AppRoutes />
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  </Auth0Provider>
);
