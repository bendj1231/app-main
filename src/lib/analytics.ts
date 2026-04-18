/**
 * Analytics Configuration and Tracking
 * 
 * This module provides comprehensive analytics tracking including:
 * - Google Analytics 4 integration
 * - Custom event tracking
 * - User behavior analytics
 * - Conversion funnel tracking
 */

// Type declarations for Google Analytics
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export interface AnalyticsConfig {
  measurementId: string;
  enabled: boolean;
  debugMode: boolean;
  consentRequired: boolean;
}

export interface AnalyticsEvent {
  name: string;
  params?: Record<string, any>;
  userId?: string;
  sessionId?: string;
}

export interface PageViewEvent {
  page_title: string;
  page_location: string;
  page_path: string;
  user_type?: string;
  enrollment_status?: string;
}

export interface ConversionEvent {
  funnel_step: string;
  funnel_name: string;
  conversion_value?: number;
  user_properties?: Record<string, any>;
}

class Analytics {
  private config: AnalyticsConfig;
  private initialized: boolean = false;
  private sessionId: string;
  private userId: string | null = null;
  private userProperties: Record<string, any> = {};

  constructor(config: AnalyticsConfig) {
    this.config = config;
    this.sessionId = this.generateSessionId();
  }

  private generateSessionId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  initialize(): void {
    if (this.initialized || !this.config.enabled) {
      return;
    }

    // Load Google Analytics 4
    this.loadGA4();
    this.initialized = true;
    
    if (this.config.debugMode) {
      console.log('[Analytics] Initialized with config:', this.config);
    }
  }

  private loadGA4(): void {
    // Create GA4 script
    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${this.config.measurementId}`;
    document.head.appendChild(script);

    // Initialize gtag
    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function() {
      window.dataLayer.push(arguments);
    };

    window.gtag('js', new Date());
    window.gtag('config', this.config.measurementId, {
      debug_mode: this.config.debugMode,
      send_page_view: false // We'll handle page views manually
    });
  }

  setUserId(userId: string): void {
    this.userId = userId;
    if (this.initialized && window.gtag) {
      window.gtag('set', 'user_id', userId);
    }
  }

  setUserProperties(properties: Record<string, any>): void {
    this.userProperties = { ...this.userProperties, ...properties };
    if (this.initialized && window.gtag) {
      window.gtag('set', 'user_properties', properties);
    }
  }

  trackPageView(event: PageViewEvent): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    const params: any = {
      page_title: event.page_title,
      page_location: event.page_location,
      page_path: event.page_path,
      session_id: this.sessionId
    };

    if (event.user_type) {
      params.user_type = event.user_type;
    }
    if (event.enrollment_status) {
      params.enrollment_status = event.enrollment_status;
    }

    window.gtag('event', 'page_view', params);

    if (this.config.debugMode) {
      console.log('[Analytics] Page view tracked:', params);
    }
  }

  trackEvent(event: AnalyticsEvent): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    const params: any = {
      ...event.params,
      session_id: this.sessionId
    };

    if (this.userId) {
      params.user_id = this.userId;
    }

    window.gtag('event', event.name, params);

    if (this.config.debugMode) {
      console.log('[Analytics] Event tracked:', event.name, params);
    }
  }

  trackConversion(event: ConversionEvent): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    const params: any = {
      funnel_step: event.funnel_step,
      funnel_name: event.funnel_name,
      session_id: this.sessionId
    };

    if (event.conversion_value) {
      params.value = event.conversion_value;
      params.currency = 'USD';
    }

    if (event.user_properties) {
      Object.assign(params, event.user_properties);
    }

    window.gtag('event', 'conversion', params);

    if (this.config.debugMode) {
      console.log('[Analytics] Conversion tracked:', params);
    }
  }

  trackError(error: Error, context?: Record<string, any>): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    const params: any = {
      error_name: error.name,
      error_message: error.message,
      error_stack: error.stack?.substring(0, 1000), // Limit stack trace length
      session_id: this.sessionId,
      ...context
    };

    window.gtag('event', 'error', params);

    if (this.config.debugMode) {
      console.log('[Analytics] Error tracked:', params);
    }
  }

  trackTiming(category: string, variable: string, value: number, label?: string): void {
    if (!this.initialized || !window.gtag) {
      return;
    }

    const params: any = {
      event_category: category,
      name: variable,
      value: Math.round(value),
      session_id: this.sessionId
    };

    if (label) {
      params.event_label = label;
    }

    window.gtag('event', 'timing_complete', params);

    if (this.config.debugMode) {
      console.log('[Analytics] Timing tracked:', params);
    }
  }

  getSessionId(): string {
    return this.sessionId;
  }

  resetSession(): void {
    this.sessionId = this.generateSessionId();
  }

  isEnabled(): boolean {
    return this.config.enabled && this.initialized;
  }
}

// Default analytics instance
let analyticsInstance: Analytics | null = null;

export function initAnalytics(config: AnalyticsConfig): Analytics {
  if (!analyticsInstance) {
    analyticsInstance = new Analytics(config);
    analyticsInstance.initialize();
  }
  return analyticsInstance;
}

export function getAnalytics(): Analytics | null {
  return analyticsInstance;
}

