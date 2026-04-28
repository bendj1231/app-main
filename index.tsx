/**
 * PilotRecognition - Main Entry Point
 * Refactored for performance with lazy loading and modular architecture
 */

import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
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

import { Styles } from '@/src/components/ui/Styles';
import { AuthProvider } from '@/src/contexts/AuthContext';
import { ToastProvider } from '@/src/components/ui/toast';
import { AppRoutes } from '@/src/routes/AppRoutes';
import { App } from '@/src/components/App';

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
    <AuthProvider>
      <ToastProvider>
        <Styles />
        <AppRoutes />
      </ToastProvider>
    </AuthProvider>
  </BrowserRouter>
);
