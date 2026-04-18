/**
 * Analytics React Hooks
 * 
 * Custom hooks for analytics integration:
 * - usePageViewTracking
 * - useEventTracking
 * - useConversionTracking
 * - useUserTracking
 */

import { useEffect, useCallback, useRef } from 'react';
import { getAnalytics, type PageViewEvent, type AnalyticsEvent, type ConversionEvent } from '../lib/analytics';
import { getWebVitals } from '../lib/web-vitals';
import { getSentry, type UserContext as SentryUserContext } from '../lib/sentry';
import { useAuth } from '../contexts/AuthContext';

export function usePageViewTracking() {
  useEffect(() => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    const trackPageView = () => {
      const event: PageViewEvent = {
        page_title: document.title,
        page_location: window.location.href,
        page_path: window.location.pathname + window.location.search
      };

      analytics.trackPageView(event);
    };

    // Track initial page view
    trackPageView();

    // Track page view on route changes (custom event)
    const handleRouteChange = () => {
      trackPageView();
    };

    window.addEventListener('routechange', handleRouteChange);
    return () => window.removeEventListener('routechange', handleRouteChange);
  }, []);
}

export function useEventTracking() {
  const trackEvent = useCallback((event: AnalyticsEvent) => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    analytics.trackEvent(event);
  }, []);

  return { trackEvent };
}

export function useConversionTracking() {
  const trackConversion = useCallback((event: ConversionEvent) => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    analytics.trackConversion(event);
  }, []);

  return { trackConversion };
}

export function useUserTracking() {
  const { currentUser } = useAuth();
  const trackedRef = useRef(false);

  useEffect(() => {
    if (!currentUser || trackedRef.current) return;

    const analytics = getAnalytics();
    const sentry = getSentry();

    if (analytics && analytics.isEnabled()) {
      analytics.setUserId(currentUser.uid);
      
      // Set user properties
      analytics.setUserProperties({
        user_type: 'pilot',
        email: currentUser.email || '',
        display_name: currentUser.displayName || ''
      });
    }

    if (sentry && sentry.isEnabled()) {
      const userContext: SentryUserContext = {
        id: currentUser.uid,
        email: currentUser.email || undefined,
        username: currentUser.displayName || undefined,
        userType: 'pilot'
      };
      sentry.setUser(userContext);
    }

    trackedRef.current = true;
  }, [currentUser]);

  const trackUserAction = useCallback((action: string, details?: Record<string, any>) => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    analytics.trackEvent({
      name: 'user_action',
      params: {
        action,
        ...details
      }
    });
  }, []);

  const trackFeatureUsage = useCallback((feature: string, details?: Record<string, any>) => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    analytics.trackEvent({
      name: 'feature_usage',
      params: {
        feature,
        ...details
      }
    });
  }, []);

  return { trackUserAction, trackFeatureUsage };
}

export function usePerformanceTracking() {
  useEffect(() => {
    const webVitals = getWebVitals();
    if (webVitals) {
      webVitals.initialize();
    }
  }, []);

  const trackCustomTiming = useCallback((category: string, variable: string, value: number, label?: string) => {
    const analytics = getAnalytics();
    if (!analytics || !analytics.isEnabled()) return;

    analytics.trackTiming(category, variable, value, label);
  }, []);

  return { trackCustomTiming };
}

export function useErrorTracking() {
  const sentry = getSentry();

  const trackError = useCallback((error: Error, context?: Record<string, any>) => {
    const analytics = getAnalytics();
    const sentryTracker = getSentry();

    if (analytics && analytics.isEnabled()) {
      analytics.trackError(error, context);
    }

    if (sentryTracker && sentryTracker.isEnabled()) {
      sentryTracker.captureException(error, context);
    }

    // Also log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('[ErrorTracking]', error, context);
    }
  }, []);

  const trackMessage = useCallback((message: string, level: 'info' | 'warning' | 'error' = 'info', context?: Record<string, any>) => {
    const sentryTracker = getSentry();

    if (sentryTracker && sentryTracker.isEnabled()) {
      sentryTracker.captureMessage(message, level, context);
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(`[ErrorTracking] ${level}:`, message, context);
    }
  }, []);

  const addBreadcrumb = useCallback((breadcrumb: {
    category?: string;
    message?: string;
    level?: 'info' | 'warning' | 'error';
    data?: Record<string, any>;
  }) => {
    if (sentry && sentry.isEnabled()) {
      sentry.addBreadcrumb(breadcrumb);
    }
  }, [sentry]);

  return { trackError, trackMessage, addBreadcrumb };
}

export function useFunnelTracking(funnelName: string) {
  const { trackConversion } = useConversionTracking();

  const trackFunnelStep = useCallback((step: string, value?: number, userProperties?: Record<string, any>) => {
    trackConversion({
      funnel_step: step,
      funnel_name: funnelName,
      conversion_value: value,
      user_properties: userProperties
    });
  }, [funnelName, trackConversion]);

  return { trackFunnelStep };
}

// Pre-defined funnel hooks for common conversion paths
export function useSignupFunnel() {
  const { trackFunnelStep } = useFunnelTracking('signup');

  const trackSignupStart = useCallback(() => {
    trackFunnelStep('start');
  }, [trackFunnelStep]);

  const trackSignupComplete = useCallback((userId?: string) => {
    trackFunnelStep('complete', 1, { user_id: userId });
  }, [trackFunnelStep]);

  const trackSignupStep = useCallback((step: string) => {
    trackFunnelStep(step);
  }, [trackFunnelStep]);

  return { trackSignupStart, trackSignupComplete, trackSignupStep };
}

export function useEnrollmentFunnel() {
  const { trackFunnelStep } = useFunnelTracking('enrollment');

  const trackEnrollmentStart = useCallback((programType: string) => {
    trackFunnelStep('start', undefined, { program_type: programType });
  }, [trackFunnelStep]);

  const trackEnrollmentComplete = useCallback((programType: string) => {
    trackFunnelStep('complete', 10, { program_type: programType }); // Value of 10 for enrollment
  }, [trackFunnelStep]);

  const trackEnrollmentStep = useCallback((step: string, programType?: string) => {
    trackFunnelStep(step, undefined, { program_type: programType });
  }, [trackFunnelStep]);

  return { trackEnrollmentStart, trackEnrollmentComplete, trackEnrollmentStep };
}
