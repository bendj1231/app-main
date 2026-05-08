/**
 * Performance Utilities
 * Hooks and functions for monitoring and optimizing performance
 */

import { useEffect, useRef, useState, useCallback } from 'react';

/**
 * Hook to measure and report component render performance
 */
export function useRenderPerformance(componentName: string) {
  const renderCount = useRef(0);
  const startTime = useRef(performance.now());

  useEffect(() => {
    renderCount.current++;
    const endTime = performance.now();
    const duration = endTime - startTime.current;

    // Log slow renders (> 16ms for 60fps)
    if (duration > 16) {
      console.warn(
        `[Performance] ${componentName} rendered in ${duration.toFixed(2)}ms (render #${renderCount.current})`
      );
    }

    startTime.current = endTime;
  });

  return {
    renderCount: renderCount.current,
    lastRenderTime: startTime.current,
  };
}

/**
 * Hook to debounce expensive operations
 */
export function useDebounce<T extends (...args: any[]) => any>(
  callback: T,
  delay: number
): (...args: Parameters<T>) => void {
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  return useCallback(
    (...args: Parameters<T>) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      timeoutRef.current = setTimeout(() => {
        callback(...args);
      }, delay);
    },
    [callback, delay]
  );
}

/**
 * Hook to throttle expensive operations
 */
export function useThrottle<T extends (...args: any[]) => any>(
  callback: T,
  limit: number
): (...args: Parameters<T>) => void {
  const inThrottle = useRef(false);

  return useCallback(
    (...args: Parameters<T>) => {
      if (!inThrottle.current) {
        callback(...args);
        inThrottle.current = true;
        setTimeout(() => {
          inThrottle.current = false;
        }, limit);
      }
    },
    [callback, limit]
  );
}

/**
 * Hook to measure Intersection Observer performance
 */
export function useIntersectionObserver(
  elementRef: React.RefObject<Element>,
  options: IntersectionObserverInit = {},
  callback?: (isIntersecting: boolean) => void
) {
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          setIsIntersecting(entry.isIntersecting);
          callback?.(entry.isIntersecting);
        });
      },
      {
        threshold: 0.1,
        rootMargin: '50px',
        ...options,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [elementRef, options, callback]);

  return isIntersecting;
}

/**
 * Measure Core Web Vitals and report to analytics
 */
export function measureCoreWebVitals() {
  if (typeof window === 'undefined') return;

  // Largest Contentful Paint (LCP)
  new PerformanceObserver((list) => {
    const entries = list.getEntries();
    const lastEntry = entries[entries.length - 1];
    console.log('[Web Vitals] LCP:', lastEntry.startTime);
    // Report to analytics: lastEntry.startTime
  }).observe({ entryTypes: ['largest-contentful-paint'] });

  // First Input Delay (FID)
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      const fidEntry = entry as PerformanceEventTiming;
      console.log('[Web Vitals] FID:', fidEntry.processingStart - fidEntry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });

  // Cumulative Layout Shift (CLS)
  let clsValue = 0;
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      if (!(entry as any).hadRecentInput) {
        clsValue += (entry as any).value;
      }
    }
    console.log('[Web Vitals] CLS:', clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
}

/**
 * Check if browser supports advanced features
 */
export function getBrowserCapabilities() {
  return {
    // CSS containment support
    supportsContainment: CSS.supports('contain', 'layout'),
    // content-visibility support
    supportsContentVisibility: CSS.supports('content-visibility', 'auto'),
    // Intersection Observer support
    supportsIntersectionObserver: 'IntersectionObserver' in window,
    // WebGL support
    supportsWebGL: !!document.createElement('canvas').getContext('webgl'),
    // WebGL 2 support
    supportsWebGL2: !!document.createElement('canvas').getContext('webgl2'),
    // Request Animation Frame
    supportsRAF: 'requestAnimationFrame' in window,
  };
}

/**
 * Utility to batch multiple DOM reads/writes for better performance
 */
export function batchDOMOperations(operations: (() => void)[]) {
  // Use requestAnimationFrame to batch DOM operations
  requestAnimationFrame(() => {
    // Use requestIdleCallback for non-critical operations if available
    if ('requestIdleCallback' in window) {
      (window as any).requestIdleCallback(() => {
        operations.forEach((op) => op());
      });
    } else {
      operations.forEach((op) => op());
    }
  });
}

/**
 * Memory management - cleanup helper for React components
 */
export function useMemoryCleanup(cleanupFn: () => void) {
  useEffect(() => {
    return () => {
      cleanupFn();
      // Force garbage collection hint (if available)
      if ('gc' in window) {
        (window as any).gc();
      }
    };
  }, [cleanupFn]);
}

export default {
  useRenderPerformance,
  useDebounce,
  useThrottle,
  useIntersectionObserver,
  measureCoreWebVitals,
  getBrowserCapabilities,
  batchDOMOperations,
  useMemoryCleanup,
};
