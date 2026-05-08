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

  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  // Safari caps deviceMemory at 8; undefined means unknown, assume 4GB
  const deviceMemory = (navigator as any).deviceMemory ?? 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    return 'low';
  }
  if (isMobile) {
    return 'low';
  }

  // Apple Silicon fast-path: M1/M2/M3/M4 Macs are always high-end
  // navigator.userAgent on Apple Silicon Macs does NOT include 'Intel'
  // and platform is 'MacIntel' for compat reasons, but GPU string confirms Apple Silicon
  const isMac = /mac/i.test(ua) && !isMobile;
  if (isMac) {
    // Try WebGL GPU string to detect Apple Silicon
    try {
      const c = document.createElement('canvas');
      const gl = (c.getContext('webgl') || c.getContext('experimental-webgl')) as WebGLRenderingContext | null;
      if (gl) {
        const ext = gl.getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null;
        const renderer = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string).toLowerCase() : '';
        const loseCtx = (gl as any).getExtension('WEBGL_lose_context');
        if (loseCtx) loseCtx.loseContext();
        c.remove();
        if (renderer.includes('apple') || renderer.includes('metal')) {
          return 'high'; // M1/M2/M3/M4 Apple GPU
        }
      } else {
        c.remove();
      }
    } catch { /* continue to score-based */ }
  }

  // Score-based fallback for Intel Macs, Windows, Linux
  // Low: < 4 cores or < 4GB — truly old hardware (2-core i5, 4GB school PCs)
  if (hardwareConcurrency < 4 || deviceMemory < 4) {
    return 'low';
  }
  // Medium: < 6 cores or < 8GB — 2019 MBA class hardware
  if (hardwareConcurrency < 6 || deviceMemory < 8) {
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

/**
 * Homepage-specific graphics configuration.
 * Controls MeshGradient shader on/off, animation speed, and backdrop-blur usage.
 *
 * Device mapping (auto-detected, no external API required):
 *   low    → 2017 MacBook Air (i5 dual-core, 8GB, Intel HD 6000), school library PCs (i5-6th gen, 4-8GB), old i5 Windows laptops
 *   medium → 2019 MacBook Air (i5 1.6GHz quad-core, Intel UHD 617), mainstream 2018-2021 laptops, Chromebooks
 *   high   → 2020 M1 MacBook Air, 2021+ Intel MBP, modern desktops with discrete GPU
 *
 * Detection signals used (all built-in browser APIs, zero cost, zero external requests):
 *   navigator.hardwareConcurrency  — CPU thread count
 *   navigator.deviceMemory          — RAM in GB (Chrome/Edge; Safari reports undefined → assumed 4)
 *   navigator.userAgent             — platform family
 *   window.devicePixelRatio         — retina vs non-retina
 *   matchMedia prefers-reduced-motion — OS accessibility setting
 *   WebGL WEBGL_debug_renderer_info — GPU string (Intel HD vs Apple GPU vs Iris Plus)
 *   localStorage graphicsQuality    — manual user override ('low' | 'medium' | 'high' | 'auto')
 */
export interface HomepageGraphicsConfig {
  tier: PerformanceTier;
  enableMeshGradient: boolean;   // Whether to render the WebGL shader at all
  meshGradientSpeed: number;     // 0 = static, 0.1 = slow, 0.22 = normal
  enableBackdropBlur: boolean;   // backdrop-filter: blur() is GPU-accelerated but costly on Intel HD
  enableHoverScale: boolean;     // CSS transform scale on hover
  deviceLabel: string;           // Human-readable label shown in the settings toast
  reason: string;                // Why this tier was chosen
}

function getGPURendererString(): string | null {
  try {
    const canvas = document.createElement('canvas');
    const gl = (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')) as WebGLRenderingContext | null;
    if (!gl) return null;
    const ext = gl.getExtension('WEBGL_debug_renderer_info') as WEBGL_debug_renderer_info | null;
    const renderer = ext ? (gl.getParameter(ext.UNMASKED_RENDERER_WEBGL) as string) : null;
    const loseCtx = (gl as any).getExtension('WEBGL_lose_context');
    if (loseCtx) loseCtx.loseContext();
    canvas.remove();
    return renderer;
  } catch {
    return null;
  }
}

export function getHomepageGraphicsConfig(): HomepageGraphicsConfig {
  // 1. Manual override wins — set via settings UI, stored in localStorage
  const override = (typeof localStorage !== 'undefined' ? localStorage.getItem('graphicsQuality') : null) as PerformanceTier | 'auto' | null;
  if (override && override !== 'auto') {
    const presets: Record<PerformanceTier, Omit<HomepageGraphicsConfig, 'tier' | 'deviceLabel' | 'reason'>> = {
      low:    { enableMeshGradient: false, meshGradientSpeed: 0,    enableBackdropBlur: false, enableHoverScale: false },
      medium: { enableMeshGradient: true,  meshGradientSpeed: 0.08, enableBackdropBlur: true,  enableHoverScale: true  },
      high:   { enableMeshGradient: true,  meshGradientSpeed: 0.22, enableBackdropBlur: true,  enableHoverScale: true  },
    };
    return { tier: override, deviceLabel: 'Manual override', reason: `Graphics manually set to ${override}`, ...presets[override] };
  }

  // 2. OS accessibility — always respect prefers-reduced-motion
  if (typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    return {
      tier: 'low', enableMeshGradient: false, meshGradientSpeed: 0,
      enableBackdropBlur: false, enableHoverScale: false,
      deviceLabel: 'Reduced Motion (OS setting)',
      reason: 'prefers-reduced-motion is enabled in system settings',
    };
  }

  const cores = navigator.hardwareConcurrency || 2;
  const memory = (navigator as any).deviceMemory ?? 4; // Safari reports undefined; default 4GB
  const ua = navigator.userAgent.toLowerCase();
  const isMobile = /android|iphone|ipod/.test(ua);
  const isTablet = /ipad/.test(ua) || (navigator.maxTouchPoints > 1 && /mac/.test(ua));
  const pixelRatio = window.devicePixelRatio || 1;
  const screenPixels = window.screen.width * window.screen.height;
  const gpuRenderer = getGPURendererString() ?? '';

  // 3. Mobile phones always get low (battery + heat)
  if (isMobile) {
    return {
      tier: 'low', enableMeshGradient: false, meshGradientSpeed: 0,
      enableBackdropBlur: false, enableHoverScale: true,
      deviceLabel: 'Mobile Device',
      reason: 'Mobile phones use low graphics to preserve battery and prevent overheating',
    };
  }

  // 4. Score-based tier assignment
  let score = 0;

  // CPU cores: 2017 MBA has 2 cores / 4 threads; 2019 MBA has 4 cores; M1 has 8 cores
  if (cores >= 8)       score += 4;
  else if (cores >= 6)  score += 3;
  else if (cores >= 4)  score += 2;
  else                  score += 0; // 2-core (2017 MBA, old Celerons, old i5 dual-core)

  // RAM: school PCs often have 4GB, 2017 MBA was 8GB, M1 has 8-16GB
  if (memory >= 16)      score += 4;
  else if (memory >= 8)  score += 2;
  else if (memory >= 4)  score += 1;
  else                   score += 0;

  // GPU: Intel HD 6000 (2017 MBA) vs Intel Iris Plus (2019) vs Apple GPU (M1)
  const gpuLower = gpuRenderer.toLowerCase();
  if (gpuLower.includes('apple') || gpuLower.includes('metal')) {
    score += 4; // M1/M2/M3 Apple Silicon GPU
  } else if (gpuLower.includes('iris plus') || gpuLower.includes('iris pro')) {
    score += 2; // 2019 MBA Iris Plus 617
  } else if (gpuLower.includes('intel hd') || gpuLower.includes('hd graphics')) {
    score += 0; // 2017 MBA Intel HD 6000, school library PCs
  } else if (gpuLower.includes('amd') || gpuLower.includes('radeon') || gpuLower.includes('nvidia') || gpuLower.includes('geforce')) {
    score += 3; // Discrete GPU on Windows desktops
  } else if (gpuLower !== '') {
    score += 1; // Unknown integrated
  }

  // Screen pixels: low-res school monitors vs retina
  if (screenPixels >= 3840 * 2160)      score += 2; // 4K
  else if (screenPixels >= 2560 * 1440) score += 2; // QHD / retina
  else if (screenPixels >= 1920 * 1080) score += 1; // FHD
  else                                  score += 0; // 720p or less (old school monitors)

  // Retina / HiDPI display signals higher-end hardware
  if (pixelRatio >= 2) score += 1;

  // Determine tier
  let tier: PerformanceTier;
  if (score >= 10)      tier = 'high';
  else if (score >= 5)  tier = 'medium';
  else                  tier = 'low';

  // Build device label from signals
  let deviceLabel = 'Unknown Device';
  if (ua.includes('mac')) {
    if (gpuLower.includes('apple')) {
      // Safari doesn't expose real deviceMemory on Apple Silicon — omit to avoid misleading "4GB"
      deviceLabel = `Mac (Apple Silicon) · ${cores} cores · Apple GPU`;
    } else if (cores <= 4) {
      deviceLabel = `Mac (Intel, ${cores}-core) · ${memory}GB · Intel HD/Iris`;
    } else {
      deviceLabel = `Mac (Intel, ${cores}-core) · ${memory}GB`;
    }
  } else if (ua.includes('windows')) {
    deviceLabel = `Windows PC · ${cores} threads · ${memory}GB`;
  } else if (ua.includes('linux')) {
    deviceLabel = `Linux · ${cores} threads · ${memory}GB`;
  } else if (isTablet) {
    deviceLabel = `iPad / Tablet · ${cores} cores`;
  }

  const tierReasons: Record<PerformanceTier, string> = {
    low:    `Low-end hardware detected (score ${score}/14) — shader disabled for smooth performance`,
    medium: `Mid-range hardware detected (score ${score}/14) — reduced shader speed for balance`,
    high:   `High-end hardware detected (score ${score}/14) — full visual quality enabled`,
  };

  return {
    tier,
    enableMeshGradient: tier !== 'low',
    meshGradientSpeed: tier === 'high' ? 0.22 : tier === 'medium' ? 0.08 : 0,
    enableBackdropBlur: tier !== 'low',
    enableHoverScale: true,
    deviceLabel,
    reason: tierReasons[tier],
  };
}

/**
 * Save a manual graphics override to localStorage.
 * Pass 'auto' to clear the override and return to auto-detection.
 */
export function setGraphicsOverride(quality: PerformanceTier | 'auto'): void {
  if (typeof localStorage === 'undefined') return;
  if (quality === 'auto') {
    localStorage.removeItem('graphicsQuality');
  } else {
    localStorage.setItem('graphicsQuality', quality);
  }
}
