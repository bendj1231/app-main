/**
 * Performance Optimization Components
 * CSS containment, will-change hints, and other performance-focused utilities
 */

import React from 'react';

interface ContainedSectionProps {
  children: React.ReactNode;
  className?: string;
  id?: string;
  /** CSS containment type - 'layout' is safest, 'paint' for graphics-heavy sections */
  contain?: 'layout' | 'paint' | 'content' | 'strict';
  /** Add will-change for animated elements */
  willChange?: 'transform' | 'opacity' | 'transform, opacity' | 'auto';
}

/**
 * ContainedSection - Uses CSS containment for better performance
 * Isolates layout/paint to prevent full-page recalculations
 */
export const ContainedSection: React.FC<ContainedSectionProps> = ({
  children,
  className = '',
  id,
  contain = 'layout',
  willChange,
}) => {
  const style: React.CSSProperties = {
    contain,
    willChange: willChange === 'auto' ? undefined : willChange,
    contentVisibility: 'auto', // New CSS property for off-screen content
    containIntrinsicSize: '0 500px', // Reserve space for content-visibility
  };

  return (
    <section id={id} className={className} style={style}>
      {children}
    </section>
  );
};

interface OptimizedImageProps {
  src: string;
  alt: string;
  className?: string;
  width?: number;
  height?: number;
  /** Enable lazy loading (default: true for below-fold images) */
  lazy?: boolean;
  /** Preload critical images (default: false) */
  preload?: boolean;
  /** Responsive srcset for different screen densities */
  srcSet?: string;
  sizes?: string;
}

/**
 * OptimizedImage - Image component with lazy loading and performance hints
 */
export const OptimizedImage: React.FC<OptimizedImageProps> = ({
  src,
  alt,
  className = '',
  width,
  height,
  lazy = true,
  preload = false,
  srcSet,
  sizes,
}) => {
  // For preloaded images, render immediately without lazy loading
  if (preload) {
    return (
      <img
        src={src}
        alt={alt}
        className={className}
        width={width}
        height={height}
        srcSet={srcSet}
        sizes={sizes}
        decoding="async"
        style={{ contentVisibility: 'auto' }}
      />
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      width={width}
      height={height}
      loading={lazy ? 'lazy' : 'eager'}
      decoding="async"
      srcSet={srcSet}
      sizes={sizes}
      style={{ contentVisibility: 'auto' }}
    />
  );
};

interface PreloadResourcesProps {
  /** URLs of critical fonts to preload */
  fonts?: string[];
  /** URLs of critical CSS to preload */
  stylesheets?: string[];
  /** URLs of critical images to preload */
  images?: string[];
}

/**
 * PreloadResources - Component to add resource hints to document head
 * Use in layout or page component to preload critical resources
 */
export const PreloadResources: React.FC<PreloadResourcesProps> = ({
  fonts = [],
  stylesheets = [],
  images = [],
}) => {
  React.useEffect(() => {
    const head = document.head;

    // Preload fonts
    fonts.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'font';
      link.type = 'font/woff2';
      link.crossOrigin = 'anonymous';
      head.appendChild(link);
    });

    // Preload stylesheets
    stylesheets.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'style';
      head.appendChild(link);
    });

    // Preload images
    images.forEach((href) => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.href = href;
      link.as = 'image';
      head.appendChild(link);
    });

    return () => {
      // Cleanup - remove preloaded resources on unmount
      const preloads = head.querySelectorAll('link[rel="preload"]');
      preloads.forEach((el) => {
        if (
          fonts.includes((el as HTMLLinkElement).href) ||
          stylesheets.includes((el as HTMLLinkElement).href) ||
          images.includes((el as HTMLLinkElement).href)
        ) {
          head.removeChild(el);
        }
      });
    };
  }, [fonts, stylesheets, images]);

  return null;
};

export default {
  ContainedSection,
  OptimizedImage,
  PreloadResources,
};
