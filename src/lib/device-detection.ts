/**
 * Device Detection and Performance Tier Classification
 * Used to adapt UI performance based on device capabilities
 */

export type PerformanceTier = 'low' | 'medium' | 'high';

/**
 * Detects if device is an older iOS device with limited performance
 * Covers iPhone 4 through iPhone X (A4–A11 chips), early iPads
 */
export function isLegacyIOSDevice(): boolean {
  const ua = navigator.userAgent;
  // iPhone 4 (A4): iPhone3,[123]
  // iPhone 4S (A5): iPhone4,1
  // iPhone 5/5C (A6): iPhone5,[1234]
  // iPhone 5S (A7): iPhone6,[12]
  // iPhone 6/6+ (A8): iPhone7,[12]
  // iPhone 6s/SE1 (A9): iPhone8,[1-4]
  // iPhone 7/7+ (A10): iPhone9,[1-4]
  // iPhone 8/8+/X (A11): iPhone10,[1-6]
  // iPad Pro 2015/2016 (A9X): iPad6,[3-8]
  // Old iPads (iPad1-4 era): iPad[1-4],[12]
  return /iPhone([3-9]|10),[1-9]/.test(ua)
    || /iPad6,[3-8]/.test(ua)
    || /iPad[1-4],[12]/.test(ua);
}

/** Returns a friendly iPhone model name from the User-Agent string */
function getIPhoneModelLabel(ua: string): string {
  if (/iPhone3,[123]/.test(ua))  return 'iPhone 4';
  if (/iPhone4,1/.test(ua))      return 'iPhone 4S';
  if (/iPhone5,[12]/.test(ua))   return 'iPhone 5';
  if (/iPhone5,[34]/.test(ua))   return 'iPhone 5C';
  if (/iPhone6,[12]/.test(ua))   return 'iPhone 5S';
  if (/iPhone7,2/.test(ua))      return 'iPhone 6';
  if (/iPhone7,1/.test(ua))      return 'iPhone 6 Plus';
  if (/iPhone8,1/.test(ua))      return 'iPhone 6s';
  if (/iPhone8,2/.test(ua))      return 'iPhone 6s Plus';
  if (/iPhone8,4/.test(ua))      return 'iPhone SE (1st gen)';
  if (/iPhone9,[13]/.test(ua))   return 'iPhone 7';
  if (/iPhone9,[24]/.test(ua))   return 'iPhone 7 Plus';
  if (/iPhone10,[13]/.test(ua))  return 'iPhone 8';
  if (/iPhone10,[24]/.test(ua))  return 'iPhone 8 Plus';
  if (/iPhone10,[56]/.test(ua))  return 'iPhone X';
  if (/iPhone11,2/.test(ua))     return 'iPhone XS';
  if (/iPhone11,[46]/.test(ua))  return 'iPhone XS Max';
  if (/iPhone11,8/.test(ua))     return 'iPhone XR';
  if (/iPhone12,1/.test(ua))     return 'iPhone 11';
  if (/iPhone12,3/.test(ua))     return 'iPhone 11 Pro';
  if (/iPhone12,5/.test(ua))     return 'iPhone 11 Pro Max';
  if (/iPhone12,8/.test(ua))     return 'iPhone SE (2nd gen)';
  if (/iPhone13,1/.test(ua))     return 'iPhone 12 Mini';
  if (/iPhone13,2/.test(ua))     return 'iPhone 12';
  if (/iPhone13,3/.test(ua))     return 'iPhone 12 Pro';
  if (/iPhone13,4/.test(ua))     return 'iPhone 12 Pro Max';
  if (/iPhone14,[45]/.test(ua))  return 'iPhone 13 Mini / 13';
  if (/iPhone14,[23]/.test(ua))  return 'iPhone 13 Pro / Pro Max';
  if (/iPhone14,[67]/.test(ua))  return 'iPhone 14 / Plus';
  if (/iPhone15,[23]/.test(ua))  return 'iPhone 14 Pro / Pro Max';
  if (/iPhone15,[45]/.test(ua))  return 'iPhone 15 / Plus';
  if (/iPhone16,[12]/.test(ua))  return 'iPhone 15 Pro / Pro Max';
  if (/iPhone17,[12]/.test(ua))  return 'iPhone 16 / Plus';
  if (/iPhone17,[34]/.test(ua))  return 'iPhone 16 Pro / Pro Max';
  return 'iPhone';
}

/** Returns a friendly iPad model name from the User-Agent string */
function getIPadModelLabel(ua: string): string {
  if (/iPad2,[1-4]/.test(ua))    return 'iPad 2 (A5)';
  if (/iPad3,[1-3]/.test(ua))    return 'iPad 3rd gen (A5X)';
  if (/iPad3,[4-6]/.test(ua))    return 'iPad 4th gen (A6X)';
  if (/iPad4,[1-3]/.test(ua))    return 'iPad Air 1 (A7)';
  if (/iPad5,[3-4]/.test(ua))    return 'iPad Air 2 (A8X)';
  if (/iPad6,[3-4]/.test(ua))    return 'iPad Pro 9.7" 2016 (A9X)';
  if (/iPad6,[7-8]/.test(ua))    return 'iPad Pro 12.9" 2015 (A9X)';
  if (/iPad7,[1-2]/.test(ua))    return 'iPad Pro 12.9" 2nd gen (A10X)';
  if (/iPad7,[3-4]/.test(ua))    return 'iPad Pro 10.5" (A10X)';
  if (/iPad7,[5-6]/.test(ua))    return 'iPad 6th gen (A10)';
  if (/iPad8,[1-4]/.test(ua))    return 'iPad Pro 11" 1st gen (A12X)';
  if (/iPad8,[5-8]/.test(ua))    return 'iPad Pro 12.9" 3rd gen (A12X)';
  if (/iPad8,(9|10)/.test(ua))   return 'iPad Pro 11" 2nd gen (A12Z)';
  if (/iPad11,[1-2]/.test(ua))   return 'iPad Mini 5 (A12)';
  if (/iPad11,[3-4]/.test(ua))   return 'iPad Air 3 (A12)';
  if (/iPad11,[6-7]/.test(ua))   return 'iPad 8th gen (A12)';
  if (/iPad12,[1-2]/.test(ua))   return 'iPad 9th gen (A13)';
  if (/iPad13,[1-2]/.test(ua))   return 'iPad Air 4 (A14)';
  if (/iPad13,[4-9]/.test(ua))   return 'iPad Pro 11" / 12.9" 5th gen (M1)';
  if (/iPad13,1[6-9]/.test(ua))  return 'iPad 10th gen / Air 5 (M1)';
  if (/iPad14,[1-2]/.test(ua))   return 'iPad Mini 6 (A15)';
  if (/iPad14,[3-4]/.test(ua))   return 'iPad Pro 11" 4th gen (M2)';
  if (/iPad14,[5-6]/.test(ua))   return 'iPad Pro 12.9" 6th gen (M2)';
  if (/iPad16,[3-4]/.test(ua))   return 'iPad Pro 11" (M4)';
  if (/iPad16,[5-6]/.test(ua))   return 'iPad Pro 13" (M4)';
  return 'iPad';
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
 * Cached to prevent WebGL context exhaustion from repeated calls
 */
let cachedPerformanceTier: PerformanceTier | null = null;
export function getDevicePerformanceTier(): PerformanceTier {
  if (cachedPerformanceTier !== null) {
    return cachedPerformanceTier;
  }
  // Check for manual override from graphics settings
  const manualOverride = localStorage.getItem('graphicsQuality') as PerformanceTier | 'auto' | null;
  if (manualOverride && manualOverride !== 'auto') {
    cachedPerformanceTier = manualOverride;
    return manualOverride;
  }

  // Legacy iOS devices get lowest performance settings
  if (isLegacyIOSDevice()) {
    cachedPerformanceTier = 'low';
    return 'low';
  }

  const ua = navigator.userAgent;
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
  const hardwareConcurrency = navigator.hardwareConcurrency || 2;
  // Safari caps deviceMemory at 8; undefined means unknown, assume 4GB
  const deviceMemory = (navigator as any).deviceMemory ?? 4;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    cachedPerformanceTier = 'low';
    return 'low';
  }
  if (isMobile) {
    cachedPerformanceTier = 'low';
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
          cachedPerformanceTier = 'high';
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
    cachedPerformanceTier = 'low';
    return 'low';
  }
  // Medium: < 6 cores or < 8GB — 2019 MBA class hardware
  if (hardwareConcurrency < 6 || deviceMemory < 8) {
    cachedPerformanceTier = 'medium';
    return 'medium';
  }

  cachedPerformanceTier = 'high';
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
    const rawUA = navigator.userAgent;
    let mobileLabel = 'Mobile Device';
    if (/iphone/i.test(rawUA)) {
      mobileLabel = getIPhoneModelLabel(rawUA);
    } else if (/android/i.test(rawUA)) {
      if (/samsung/i.test(rawUA))           mobileLabel = 'Samsung Android';
      else if (/huawei/i.test(rawUA))       mobileLabel = 'Huawei Android';
      else if (/xiaomi|redmi/i.test(rawUA)) mobileLabel = 'Xiaomi Android';
      else if (/oppo/i.test(rawUA))         mobileLabel = 'OPPO Android';
      else if (/vivo/i.test(rawUA))         mobileLabel = 'Vivo Android';
      else if (/pixel/i.test(rawUA))        mobileLabel = 'Google Pixel';
      else                                  mobileLabel = 'Android Phone';
    }
    return {
      tier: 'low', enableMeshGradient: false, meshGradientSpeed: 0,
      enableBackdropBlur: false, enableHoverScale: true,
      deviceLabel: mobileLabel,
      reason: 'Mobile phones use low graphics to preserve battery and prevent overheating',
    };
  }

  // 3b. Tablets — iPads get low or medium depending on age
  if (isTablet) {
    const rawUA = navigator.userAgent;
    const ipadLabel = /ipad/i.test(rawUA) ? getIPadModelLabel(rawUA) : 'Tablet';
    const isLegacyIPad = isLegacyIOSDevice();
    return {
      tier: isLegacyIPad ? 'low' : 'medium',
      enableMeshGradient: !isLegacyIPad,
      meshGradientSpeed: isLegacyIPad ? 0 : 0.08,
      enableBackdropBlur: !isLegacyIPad,
      enableHoverScale: true,
      deviceLabel: ipadLabel,
      reason: isLegacyIPad
        ? 'Legacy iPad — shader disabled for smooth scrolling'
        : 'iPad — balanced graphics mode',
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
    // Most Windows browsers don't expose brand in the UA string,
    // but some OEM builds do. GPU string is more reliable for branding clues.
    let brand = 'Windows PC';
    if (ua.includes('dell'))                          brand = 'Dell PC';
    else if (ua.includes('hp') || ua.includes('hewlett-packard')) brand = 'HP PC';
    else if (ua.includes('lenovo'))                   brand = 'Lenovo PC';
    else if (ua.includes('asus'))                     brand = 'ASUS PC';
    else if (ua.includes('acer'))                     brand = 'Acer PC';
    else if (ua.includes('sony'))                     brand = 'Sony VAIO';
    else if (ua.includes('toshiba'))                  brand = 'Toshiba PC';
    else if (ua.includes('samsung'))                  brand = 'Samsung PC';
    else if (ua.includes('huawei') || ua.includes('matebook')) brand = 'Huawei MateBook';
    else if (ua.includes('surface'))                  brand = 'Microsoft Surface';
    // GPU string fallback if UA has no brand
    if (brand === 'Windows PC') {
      if (gpuLower.includes('geforce') || gpuLower.includes('rtx') || gpuLower.includes('gtx')) brand = 'Windows PC (NVIDIA)';
      else if (gpuLower.includes('radeon') || gpuLower.includes('rx '))                         brand = 'Windows PC (AMD)';
    }
    deviceLabel = `${brand} · ${cores} threads · ${memory}GB`;
  } else if (ua.includes('linux')) {
    let linuxBrand = 'Linux PC';
    if (ua.includes('ubuntu'))      linuxBrand = 'Ubuntu Linux';
    else if (ua.includes('fedora')) linuxBrand = 'Fedora Linux';
    else if (ua.includes('debian')) linuxBrand = 'Debian Linux';
    else if (ua.includes('cros'))   linuxBrand = 'Chromebook';
    deviceLabel = `${linuxBrand} · ${cores} threads · ${memory}GB`;
  }

  const tierReasons: Record<PerformanceTier, string> = {
    low:    `Low-end hardware detected (score ${score}/14) — shader disabled for smooth performance`,
    medium: `Mid-range hardware detected (score ${score}/14) — shader disabled on Intel Macs for smooth performance`,
    high:   `High-end hardware detected (score ${score}/14) — full visual quality enabled`,
  };

  // Disable MeshGradient for Intel Macs in medium tier (2019 MBA class hardware)
  // Intel Iris Plus/UHD graphics struggle with continuous WebGL fragment shaders
  const isIntelMac = ua.includes('mac') && !gpuLower.includes('apple') && !gpuLower.includes('metal');
  const enableMeshGradient = tier === 'high' || (tier === 'medium' && !isIntelMac);

  return {
    tier,
    enableMeshGradient,
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
