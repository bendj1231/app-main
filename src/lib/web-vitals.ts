/**
 * Web Vitals Tracking
 * 
 * This module implements Core Web Vitals tracking:
 * - LCP (Largest Contentful Paint)
 * - FID (First Input Delay)
 * - CLS (Cumulative Layout Shift)
 * - FCP (First Contentful Paint)
 * - TTFB (Time to First Byte)
 */

import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals';
import { getAnalytics } from './analytics';

export interface WebVitalsMetric {
  name: string;
  value: number;
  rating: 'good' | 'needs-improvement' | 'poor';
  id: string;
  delta: number;
  navigationType: string;
}

export interface WebVitalsConfig {
  enabled: boolean;
  reportThresholds: {
    LCP: number;
    FID: number;
    CLS: number;
    FCP: number;
    TTFB: number;
  };
}

const DEFAULT_THRESHOLDS = {
  LCP: 2500, // Good: < 2.5s
  FID: 100, // Good: < 100ms
  CLS: 0.1, // Good: < 0.1
  FCP: 1800, // Good: < 1.8s
  TTFB: 800, // Good: < 800ms
};

class WebVitalsTracker {
  private config: WebVitalsConfig;
  private metrics: WebVitalsMetric[] = [];
  private initialized: boolean = false;

  constructor(config: WebVitalsConfig) {
    this.config = {
      enabled: config.enabled,
      reportThresholds: { ...DEFAULT_THRESHOLDS, ...config.reportThresholds }
    };
  }

  initialize(): void {
    if (this.initialized || !this.config.enabled || typeof window === 'undefined') {
      return;
    }

    // Track all Core Web Vitals
    onLCP((metric) => this.handleMetric(metric));
    onINP((metric) => this.handleMetric(metric));
    onCLS((metric) => this.handleMetric(metric));
    onFCP((metric) => this.handleMetric(metric));
    onTTFB((metric) => this.handleMetric(metric));

    this.initialized = true;
    console.log('[WebVitals] Tracker initialized');
  }

  private handleMetric(metric: any): void {
    const webVitalMetric: WebVitalsMetric = {
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      id: metric.id,
      delta: metric.delta,
      navigationType: metric.navigationType || 'navigate'
    };

    this.metrics.push(webVitalMetric);

    // Report to analytics
    this.reportMetric(webVitalMetric);

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[WebVitals] ${metric.name}:`, {
        value: metric.value,
        rating: metric.rating,
        delta: metric.delta
      });
    }
  }

  private reportMetric(metric: WebVitalsMetric): void {
    const analytics = getAnalytics();
    if (!analytics) return;

    // Report as timing event
    analytics.trackTiming('web_vitals', metric.name, metric.value, metric.rating);

    // Report as custom event with detailed info
    analytics.trackEvent({
      name: 'web_vital',
      params: {
        metric_name: metric.name,
        metric_value: metric.value,
        metric_rating: metric.rating,
        metric_delta: metric.delta,
        navigation_type: metric.navigationType
      }
    });
  }

  getMetrics(): WebVitalsMetric[] {
    return [...this.metrics];
  }

  getMetricByName(name: string): WebVitalsMetric | undefined {
    return this.metrics.find(m => m.name === name);
  }

  getPerformanceScore(): number {
    if (this.metrics.length === 0) return 0;

    let score = 0;
    let count = 0;

    this.metrics.forEach(metric => {
      if (metric.rating === 'good') score += 100;
      else if (metric.rating === 'needs-improvement') score += 50;
      else score += 0;
      count++;
    });

    return Math.round(score / count);
  }

  reset(): void {
    this.metrics = [];
  }
}

// Default instance
let webVitalsInstance: WebVitalsTracker | null = null;

export function initWebVitals(config: Partial<WebVitalsConfig> = {}): WebVitalsTracker {
  if (!webVitalsInstance) {
    webVitalsInstance = new WebVitalsTracker({
      enabled: config.enabled ?? true,
      reportThresholds: config.reportThresholds ?? DEFAULT_THRESHOLDS
    });
    webVitalsInstance.initialize();
  }
  return webVitalsInstance;
}

export function getWebVitals(): WebVitalsTracker | null {
  return webVitalsInstance;
}

