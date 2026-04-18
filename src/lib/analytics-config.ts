/**
 * Analytics Configuration
 *
 * Centralized configuration for all analytics and monitoring services.
 * Environment variables should be set in .env file.
 */

import { initAnalytics, type AnalyticsConfig } from './analytics';
import { initSentry, type SentryConfig } from './sentry';
import { initWebVitals } from './web-vitals';
import { initPerformanceMonitor } from './performance-monitor';

// Analytics Configuration
export const ANALYTICS_CONFIG: AnalyticsConfig = {
  measurementId: import.meta.env.VITE_GA_MEASUREMENT_ID || 'G-XXXXXXXXXX',
  enabled: import.meta.env.VITE_ANALYTICS_ENABLED !== 'false',
  debugMode: import.meta.env.VITE_ANALYTICS_DEBUG === 'true',
  consentRequired: true
};

// Sentry Configuration
export const SENTRY_CONFIG: SentryConfig = {
  dsn: import.meta.env.VITE_SENTRY_DSN || '',
  enabled: !!import.meta.env.VITE_SENTRY_DSN,
  environment: import.meta.env.VITE_ENVIRONMENT || 'development',
  release: import.meta.env.VITE_APP_VERSION || '1.0.0',
  tracesSampleRate: parseFloat(import.meta.env.VITE_SENTRY_TRACES_SAMPLE_RATE || '0.1'),
  replaysSessionSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_SESSION_SAMPLE_RATE || '0.1'),
  replaysOnErrorSampleRate: parseFloat(import.meta.env.VITE_SENTRY_REPLAYS_ERROR_SAMPLE_RATE || '1.0')
};

// Web Vitals Configuration
export const WEB_VITALS_CONFIG = {
  enabled: import.meta.env.VITE_WEB_VITALS_ENABLED !== 'false',
  reportThresholds: {
    LCP: 2500,
    FID: 100,
    CLS: 0.1,
    FCP: 1800,
    TTFB: 800
  }
};

/**
 * Check if analytics is enabled based on user consent
 */
export function isAnalyticsEnabled(): boolean {
  const consent = localStorage.getItem('cookie-consent-preferences');
  if (!consent) return false;

  try {
    const preferences = JSON.parse(consent);
    return preferences.analytics === true;
  } catch (e) {
    console.error('Error parsing cookie preferences:', e);
    return false;
  }
}

/**
 * Initialize all analytics and monitoring services
 * Call this function in your app's entry point (index.tsx)
 */
export function initializeAnalyticsServices() {
  // Check for existing consent
  if (isAnalyticsEnabled()) {
    // User has already consented, initialize analytics
    if (ANALYTICS_CONFIG.enabled) {
      initAnalytics(ANALYTICS_CONFIG);
      console.log('[Analytics] Google Analytics 4 initialized');
    }

    if (SENTRY_CONFIG.enabled) {
      initSentry(SENTRY_CONFIG);
      console.log('[Analytics] Sentry initialized');
    }

    if (WEB_VITALS_CONFIG.enabled) {
      initWebVitals(WEB_VITALS_CONFIG);
      console.log('[Analytics] Web Vitals initialized');
    }

    initPerformanceMonitor();
    console.log('[Analytics] Performance Monitor initialized');
  } else {
    // Wait for user consent
    console.log('[Analytics] Waiting for user consent before initializing');
  }

  // Listen for consent events
  window.addEventListener('analytics-consent-granted', handleConsentGranted);
  window.addEventListener('analytics-consent-denied', handleConsentDenied);
}

function handleConsentGranted(event: CustomEvent) {
  const preferences = event.detail;

  console.log('[Analytics] Consent granted:', preferences);

  // Initialize Analytics if consented
  if (preferences.analytics && ANALYTICS_CONFIG.enabled) {
    initAnalytics(ANALYTICS_CONFIG);
    console.log('[Analytics] Google Analytics 4 initialized after consent');
  }

  // Initialize Sentry if consented (Sentry is for error tracking, not analytics)
  if (SENTRY_CONFIG.enabled) {
    initSentry(SENTRY_CONFIG);
    console.log('[Analytics] Sentry initialized after consent');
  }

  // Initialize Web Vitals if consented
  if (preferences.analytics && WEB_VITALS_CONFIG.enabled) {
    initWebVitals(WEB_VITALS_CONFIG);
    console.log('[Analytics] Web Vitals initialized after consent');
  }

  initPerformanceMonitor();
  console.log('[Analytics] Performance Monitor initialized after consent');
}

function handleConsentDenied() {
  console.log('[Analytics] Consent denied - analytics disabled');
  // Analytics remain disabled
}
