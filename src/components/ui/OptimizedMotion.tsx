/**
 * OptimizedMotion Component
 * Wrapper around framer-motion that respects reduced motion preferences
 * Disables animations for low-end devices and users who prefer reduced motion
 */

import React from 'react';
import { motion, Variants, Transition, TargetAndTransition, VariantLabels, ViewportOptions } from 'framer-motion';
import { shouldReduceMotion, getDevicePerformanceTier } from '@/src/lib/device-detection';

type MotionValue = VariantLabels | TargetAndTransition | undefined;

interface OptimizedMotionProps {
  children: React.ReactNode;
  className?: string;
  initial?: MotionValue;
  animate?: MotionValue;
  exit?: MotionValue;
  variants?: Variants;
  transition?: Transition;
  whileHover?: MotionValue;
  whileTap?: MotionValue;
  whileInView?: MotionValue;
  viewport?: ViewportOptions;
  style?: React.CSSProperties;
  id?: string;
}

export const OptimizedMotion: React.FC<OptimizedMotionProps> = ({
  children,
  className,
  initial,
  animate,
  exit,
  variants,
  transition,
  whileHover,
  whileTap,
  whileInView,
  viewport,
  style,
  id,
}) => {
  const reduceMotion = shouldReduceMotion();
  const tier = getDevicePerformanceTier();
  const isLowEnd = tier === 'low';

  // For low-end or reduced motion, render static div with minimal styles
  if (reduceMotion || isLowEnd) {
    return (
      <div className={className} style={style} id={id}>
        {children}
      </div>
    );
  }

  // For medium tier, simplify transitions
  const optimizedTransition: Transition = isLowEnd
    ? { duration: 0 }
    : {
        ...transition,
        // Reduce duration on medium devices
        duration: transition?.duration
          ? Math.min(transition.duration, 0.3)
          : 0.3,
      };

  return (
    <motion.div
      className={className}
      initial={initial}
      animate={animate}
      exit={exit}
      variants={variants}
      transition={optimizedTransition}
      whileHover={whileHover}
      whileTap={whileTap}
      whileInView={whileInView}
      viewport={viewport}
      style={style}
      id={id}
    >
      {children}
    </motion.div>
  );
};

// Predefined animation variants for common use cases
export const fadeInUp = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export const fadeIn = {
  hidden: { opacity: 0 },
  visible: { opacity: 1 },
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

// Optimized reveal animation with GPU acceleration hints
export const OptimizedReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  delay?: number;
}> = ({ children, className, delay = 0 }) => {
  const reduceMotion = shouldReduceMotion();
  const tier = getDevicePerformanceTier();

  if (reduceMotion || tier === 'low') {
    return <div className={className}>{children}</div>;
  }

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-50px' }}
      transition={{
        duration: tier === 'medium' ? 0.4 : 0.6,
        delay,
        ease: [0.25, 0.1, 0.25, 1],
      }}
      style={{ willChange: 'transform, opacity' }}
    >
      {children}
    </motion.div>
  );
};

export default OptimizedMotion;
