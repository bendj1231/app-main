/**
 * Device Detection and Performance Tier Classification
 * Used to adapt UI performance based on device capabilities
 */

export type PerformanceTier = 'low' | 'medium' | 'high';

/**
 * Determines the performance tier of the current device
 * Based on hardware concurrency, memory, and device type
 * Respects manual override from graphics settings modal
 */
export function getDevicePerformanceTier(): PerformanceTier {
  // Check for manual override from graphics settings
  const manualOverride = localStorage.getItem('graphicsQuality') as PerformanceTier | 'auto' | null;
  if (manualOverride && manualOverride !== 'auto') {
    return manualOverride;
  }

  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
  const hardwareConcurrency = navigator.hardwareConcurrency || 4;
  const deviceMemory = (navigator as any).deviceMemory || 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return 'low';
  }
  if (isMobile) {
    return 'low';
  }
  if (deviceMemory < 4 || hardwareConcurrency < 4) {
    return 'low';
  }
  if (deviceMemory < 6 || hardwareConcurrency < 6) {
    return 'low';
  }
  if (deviceMemory < 8 || hardwareConcurrency < 8) {
    return 'medium';
  }

  return 'high';
}

/**
 * Checks if the user prefers reduced motion
 */
export function shouldReduceMotion(): boolean {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * Checks if the device has a GPU (basic check)
 */
export function hasGPU(): boolean {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  return !!gl;
}

/**
 * Gets the appropriate pixel ratio for the current device
 * Lower for low-end devices to improve performance
 */
export function getOptimalPixelRatio(): number {
  const tier = getDevicePerformanceTier();
  
  switch (tier) {
    case 'low':
      return 0.5; // Half resolution for better performance
    case 'medium':
      return 1; // Standard resolution
    case 'high':
      return Math.min(window.devicePixelRatio, 2); // Up to 2x for high-DPI displays
    default:
      return 1;
  }
}

/**
 * Determines if heavy animations should be enabled
 */
export function shouldEnableHeavyAnimations(): boolean {
  const tier = getDevicePerformanceTier();
  return tier === 'high' && !shouldReduceMotion();
}

/**
 * Determines if 3D/shader effects should be enabled
 */
export function shouldEnable3DEffects(): boolean {
  const tier = getDevicePerformanceTier();
  return tier !== 'low' && hasGPU() && !shouldReduceMotion();
}

/**
 * Gets animation duration multiplier based on device tier
 * Used to speed up/slow down animations
 */
export function getAnimationDurationMultiplier(): number {
  const tier = getDevicePerformanceTier();
  
  switch (tier) {
    case 'low':
      return 0.5; // Faster animations
    case 'medium':
      return 0.75; // Slightly faster
    case 'high':
      return 1; // Full duration
    default:
      return 1;
  }
}

/**
 * Performance configuration object for easy access
 */
export const performanceConfig = {
  tier: getDevicePerformanceTier(),
  reduceMotion: shouldReduceMotion(),
  hasGPU: hasGPU(),
  pixelRatio: getOptimalPixelRatio(),
  enableHeavyAnimations: shouldEnableHeavyAnimations(),
  enable3DEffects: shouldEnable3DEffects(),
  animationMultiplier: getAnimationDurationMultiplier(),
} as const;
