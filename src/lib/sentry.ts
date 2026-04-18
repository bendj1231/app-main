/**
 * Sentry Error Tracking Configuration
 * 
 * This module provides comprehensive error tracking using Sentry:
 * - JavaScript error tracking
 * - Performance monitoring
 * - Release tracking
 * - User context
 */

import * as Sentry from '@sentry/react';

export interface SentryConfig {
  dsn: string;
  enabled: boolean;
  environment: string;
  release: string;
  tracesSampleRate: number;
  replaysSessionSampleRate: number;
  replaysOnErrorSampleRate: number;
}

export interface UserContext {
  id?: string;
  email?: string;
  username?: string;
  userType?: string;
  enrollmentStatus?: string;
}

class SentryTracker {
  private config: SentryConfig;
  private initialized: boolean = false;

  constructor(config: SentryConfig) {
    this.config = config;
  }

  initialize(): void {
    if (this.initialized || !this.config.enabled) {
      return;
    }

    Sentry.init({
      dsn: this.config.dsn,
      environment: this.config.environment,
      release: this.config.release,
      integrations: [
        Sentry.browserTracingIntegration(),
      ],
      tracesSampleRate: this.config.tracesSampleRate,
      beforeSend(event, hint) {
        // Filter out certain errors if needed
        if (event.exception) {
          const error = hint.originalException;
          // Example: Filter out script loading errors
          if (error instanceof Error && error.message.includes('Script error')) {
            return null;
          }
        }
        return event;
      },
      beforeBreadcrumb(breadcrumb, hint) {
        // Filter breadcrumbs if needed
        return breadcrumb;
      },
    });

    this.initialized = true;
    console.log('[Sentry] Error tracking initialized');
  }

  setUser(user: UserContext): void {
    if (!this.initialized) return;

    Sentry.setUser({
      id: user.id,
      email: user.email,
      username: user.username,
      userType: user.userType,
      enrollmentStatus: user.enrollmentStatus
    });
  }

  clearUser(): void {
    if (!this.initialized) return;
    Sentry.setUser(null);
  }

  captureException(error: Error, context?: Record<string, any>): void {
    if (!this.initialized) {
      console.error('[Sentry] Not initialized, error:', error);
      return;
    }

    Sentry.captureException(error, {
      extra: context
    });
  }

  captureMessage(message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>): void {
    if (!this.initialized) {
      console.log(`[Sentry] Not initialized, message: ${message}`);
      return;
    }

    Sentry.captureMessage(message, {
      level,
      extra: context
    });
  }

  addBreadcrumb(breadcrumb: {
    category?: string;
    message?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }): void {
    if (!this.initialized) return;

    Sentry.addBreadcrumb(breadcrumb);
  }

  setTag(key: string, value: string): void {
    if (!this.initialized) return;

    Sentry.setTag(key, value);
  }

  setContext(key: string, context: Record<string, any>): void {
    if (!this.initialized) return;

    Sentry.setContext(key, context);
  }

  isEnabled(): boolean {
    return this.config.enabled && this.initialized;
  }
}

// Default instance
let sentryInstance: SentryTracker | null = null;

export function initSentry(config: SentryConfig): SentryTracker {
  if (!sentryInstance) {
    sentryInstance = new SentryTracker(config);
    sentryInstance.initialize();
  }
  return sentryInstance;
}

export function getSentry(): SentryTracker | null {
  return sentryInstance;
}

