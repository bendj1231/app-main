/**
 * LazyInView Component
 * Uses Intersection Observer to render children only when in viewport
 * Significantly improves initial page load by deferring off-screen content
 */

import React, { useEffect, useRef, useState } from 'react';

interface LazyInViewProps {
  children: React.ReactNode;
  className?: string;
  placeholder?: React.ReactNode;
  rootMargin?: string; // e.g., '200px' to load before entering viewport
  threshold?: number; // 0-1, percentage of element visible
  triggerOnce?: boolean; // if true, keeps element rendered after first view
}

export const LazyInView: React.FC<LazyInViewProps> = ({
  children,
  className = '',
  placeholder,
  rootMargin = '100px',
  threshold = 0.1,
  triggerOnce = true,
}) => {
  const [isInView, setIsInView] = useState(false);
  const [hasTriggered, setHasTriggered] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = elementRef.current;
    if (!element) return;

    // Skip if already triggered and triggerOnce is true
    if (triggerOnce && hasTriggered) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            setHasTriggered(true);
            
            if (triggerOnce) {
              observer.unobserve(element);
            }
          } else if (!triggerOnce) {
            setIsInView(false);
          }
        });
      },
      {
        rootMargin,
        threshold,
      }
    );

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [rootMargin, threshold, triggerOnce, hasTriggered]);

  return (
    <div ref={elementRef} className={className}>
      {isInView ? children : placeholder || <div className="min-h-[100px]" />}
    </div>
  );
};

export default LazyInView;
