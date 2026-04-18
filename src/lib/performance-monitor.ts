/**
 * Performance Monitoring
 * 
 * This module provides comprehensive performance monitoring:
 * - API response time tracking
 * - Edge Function performance monitoring
 * - Custom performance metrics
 * - Resource loading performance
 */

export interface PerformanceMetric {
  name: string;
  duration: number;
  timestamp: number;
  metadata?: Record<string, any>;
}

export interface APIPerformanceMetric extends PerformanceMetric {
  url: string;
  method: string;
  status: number;
  success: boolean;
}

export interface EdgeFunctionMetric extends PerformanceMetric {
  functionName: string;
  region?: string;
  coldStart: boolean;
}

class PerformanceMonitor {
  private metrics: PerformanceMetric[] = [];
  private apiMetrics: APIPerformanceMetric[] = [];
  private edgeFunctionMetrics: EdgeFunctionMetric[] = [];
  private observers: PerformanceObserver[] = [];

  constructor() {
    this.initializeResourceTiming();
  }

  private initializeResourceTiming(): void {
    if (typeof window === 'undefined' || !window.PerformanceObserver) {
      return;
    }

    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach((entry: any) => {
          if (entry.entryType === 'resource') {
            this.trackResourceTiming(entry);
          }
        });
      });

      observer.observe({ entryTypes: ['resource'] });
      this.observers.push(observer);
    } catch (error) {
      console.warn('[PerformanceMonitor] Could not observe resource timing:', error);
    }
  }

  private trackResourceTiming(entry: PerformanceResourceTiming): void {
    const metric: PerformanceMetric = {
      name: entry.name,
      duration: entry.duration,
      timestamp: entry.startTime,
      metadata: {
        transferSize: entry.transferSize,
        encodedBodySize: entry.encodedBodySize,
        decodedBodySize: entry.decodedBodySize,
        initiatorType: entry.initiatorType,
        nextHopProtocol: entry.nextHopProtocol
      }
    };

    this.metrics.push(metric);

    // Report slow resources (> 2 seconds)
    if (entry.duration > 2000) {
      console.warn(`[PerformanceMonitor] Slow resource: ${entry.name} (${entry.duration.toFixed(0)}ms)`);
    }
  }

  trackAPICall(url: string, method: string, startTime: number, status: number, success: boolean, metadata?: Record<string, any>): void {
    const duration = performance.now() - startTime;
    
    const metric: APIPerformanceMetric = {
      name: 'api_call',
      duration,
      timestamp: startTime,
      url,
      method,
      status,
      success,
      metadata
    };

    this.apiMetrics.push(metric);

    // Log slow API calls
    if (duration > 1000) {
      console.warn(`[PerformanceMonitor] Slow API call: ${method} ${url} (${duration.toFixed(0)}ms)`);
    }

    // Report to analytics if available
    this.reportToAnalytics('api_performance', {
      url,
      method,
      duration,
      status,
      success
    });
  }

  trackEdgeFunction(functionName: string, startTime: number, success: boolean, coldStart: boolean = false, region?: string): void {
    const duration = performance.now() - startTime;
    
    const metric: EdgeFunctionMetric = {
      name: 'edge_function',
      duration,
      timestamp: startTime,
      functionName,
      region,
      coldStart
    };

    this.edgeFunctionMetrics.push(metric);

    // Log slow edge functions
    if (duration > 500) {
      console.warn(`[PerformanceMonitor] Slow edge function: ${functionName} (${duration.toFixed(0)}ms)`);
    }

    // Report to analytics
    this.reportToAnalytics('edge_function_performance', {
      functionName,
      duration,
      success,
      coldStart,
      region
    });
  }

  trackCustomMetric(name: string, duration: number, metadata?: Record<string, any>): void {
    const metric: PerformanceMetric = {
      name,
      duration,
      timestamp: performance.now(),
      metadata
    };

    this.metrics.push(metric);

    // Report to analytics
    this.reportToAnalytics('custom_performance', {
      metricName: name,
      duration,
      ...metadata
    });
  }

  private reportToAnalytics(category: string, data: Record<string, any>): void {
    // This will be connected to the analytics module
    // For now, just log to console
    if (process.env.NODE_ENV === 'development') {
      console.log(`[PerformanceMonitor] ${category}:`, data);
    }
  }

  getMetrics(): PerformanceMetric[] {
    return [...this.metrics];
  }

  getAPIMetrics(): APIPerformanceMetric[] {
    return [...this.apiMetrics];
  }

  getEdgeFunctionMetrics(): EdgeFunctionMetric[] {
    return [...this.edgeFunctionMetrics];
  }

  getAverageAPIDuration(): number {
    if (this.apiMetrics.length === 0) return 0;
    const total = this.apiMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.apiMetrics.length;
  }

  getAverageEdgeFunctionDuration(): number {
    if (this.edgeFunctionMetrics.length === 0) return 0;
    const total = this.edgeFunctionMetrics.reduce((sum, m) => sum + m.duration, 0);
    return total / this.edgeFunctionMetrics.length;
  }

  getSlowAPIs(threshold: number = 1000): APIPerformanceMetric[] {
    return this.apiMetrics.filter(m => m.duration > threshold);
  }

  getSlowEdgeFunctions(threshold: number = 500): EdgeFunctionMetric[] {
    return this.edgeFunctionMetrics.filter(m => m.duration > threshold);
  }

  reset(): void {
    this.metrics = [];
    this.apiMetrics = [];
    this.edgeFunctionMetrics = [];
  }

  destroy(): void {
    this.observers.forEach(observer => observer.disconnect());
    this.observers = [];
  }
}

// Default instance
let performanceMonitorInstance: PerformanceMonitor | null = null;

export function initPerformanceMonitor(): PerformanceMonitor {
  if (!performanceMonitorInstance) {
    performanceMonitorInstance = new PerformanceMonitor();
  }
  return performanceMonitorInstance;
}

export function getPerformanceMonitor(): PerformanceMonitor | null {
  return performanceMonitorInstance;
}

// Helper function to wrap API calls with performance tracking
export function withAPITracking<T>(
  url: string,
  method: string,
  apiCall: () => Promise<T>,
  metadata?: Record<string, any>
): Promise<T> {
  const monitor = getPerformanceMonitor();
  const startTime = performance.now();

  return apiCall()
    .then(result => {
      if (monitor) {
        monitor.trackAPICall(url, method, startTime, 200, true, metadata);
      }
      return result;
    })
    .catch(error => {
      if (monitor) {
        monitor.trackAPICall(url, method, startTime, 0, false, {
          ...metadata,
          error: error.message
        });
      }
      throw error;
    });
}

// Helper function to wrap edge function calls with performance tracking
export function withEdgeFunctionTracking<T>(
  functionName: string,
  functionCall: () => Promise<T>,
  coldStart: boolean = false,
  region?: string
): Promise<T> {
  const monitor = getPerformanceMonitor();
  const startTime = performance.now();

  return functionCall()
    .then(result => {
      if (monitor) {
        monitor.trackEdgeFunction(functionName, startTime, true, coldStart, region);
      }
      return result;
    })
    .catch(error => {
      if (monitor) {
        monitor.trackEdgeFunction(functionName, startTime, false, coldStart, region);
      }
      throw error;
    });
}

