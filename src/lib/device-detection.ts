/**
 * Device Detection and Performance Tier Classification
 * Used to adapt UI performance based on device capabilities
 */

export type PerformanceTier = 'low' | 'medium' | 'high';

/**
 * Detects if device is an older iOS device with limited performance
 * iPhone 8, iPhone 8 Plus, iPhone X (A11 chip), iPad Pro 12.9" 2015 (A9X)
 * These devices struggle with WebGL shaders and heavy animations
 */
export function isLegacyIOSDevice(): boolean {
  const ua = navigator.userAgent;

  // iPhone 8, 8 Plus, X (A11 chip - 2017)
  const isIPhone8OrX = /iPhone10,[1-6]/.test(ua);

  // iPad Pro 12.9" 2015 (A9X - iPad6,7 and iPad6,8)
  const isIPadPro2015 = /iPad6,[78]/.test(ua);

  // iPad Pro 9.7" 2016 (A9X - iPad6,3 and iPad6,4)
  const isIPadPro2016 = /iPad6,[34]/.test(ua);

  // iPhone 7/7 Plus (A10 - 2016)
  const isIPhone7 = /iPhone9,[1-4]/.test(ua);

  // iPhone 6s/6s Plus/SE 1st gen (A9 - 2015)
  const isIPhone6s = /iPhone8,[1-4]/.test(ua);

  return isIPhone8OrX || isIPadPro2015 || isIPadPro2016 || isIPhone7 || isIPhone6s;
}

/**
 * Detects if device is any iOS device (for general iOS optimizations)
 */
export function isIOS(): boolean {
  return /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
}

/**
 * Determines the performance tier of the current device
 * Based on hardware concurrency, memory, device type, and specific legacy device detection
 * Respects manual override from graphics settings modal
 */
export function getDevicePerformanceTier(): PerformanceTier {
  // Check for manual override from graphics settings
  const manualOverride = localStorage.getItem('graphicsQuality') as PerformanceTier | 'auto' | null;
  if (manualOverride && manualOverride !== 'auto') {
    return manualOverride;
  }

  // Legacy iOS devices get lowest performance settings
  if (isLegacyIOSDevice()) {
    return 'low';
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
 * Properly cleans up the canvas context to avoid WebGL context limit issues
 * Cached to prevent multiple context creations
 */
let cachedGPUResult: boolean | null = null;
export function hasGPU(): boolean {
  if (cachedGPUResult !== null) {
    return cachedGPUResult;
  }
  
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
  const hasWebGL = !!gl;
  
  // Clean up the context and canvas to avoid WebGL context limit
  if (gl) {
    const loseContext = (gl as any).getExtension('WEBGL_lose_context');
    if (loseContext) {
      loseContext.loseContext();
    }
  }
  canvas.remove();
  
  cachedGPUResult = hasWebGL;
  return hasWebGL;
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
 * Ultra aggressive mode for legacy iOS devices (iPhone 8, iPad Pro 2015, etc.)
 * Completely disables animations, shaders, and uses static backgrounds
 */
export function isUltraLowPerformanceMode(): boolean {
  return isLegacyIOSDevice() || (getDevicePerformanceTier() === 'low' && isIOS());
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
