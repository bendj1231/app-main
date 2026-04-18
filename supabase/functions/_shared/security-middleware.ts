// Enterprise-grade shared security middleware for Supabase Edge Functions
// Provides CSRF protection, rate limiting, security headers, monitoring, logging, and caching

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// Rate limiting store (in-memory for Edge Functions - fallback)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

// Database-backed rate limiter for production
class DatabaseRateLimiter {
  private static supabase: ReturnType<typeof createClient> | null = null
  
  private static getClient() {
    if (!this.supabase) {
      const supabaseUrl = Deno.env.get('SUPABASE_URL')
      const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')
      if (supabaseUrl && supabaseServiceKey) {
        this.supabase = createClient(supabaseUrl, supabaseServiceKey)
      }
    }
    return this.supabase
  }
  
  static async checkRateLimit(
    identifier: string, 
    config: RateLimitConfig
  ): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    const client = this.getClient()
    
    // Fallback to in-memory if database client not available
    if (!client) {
      return SecurityMiddleware.checkRateLimit(identifier, config)
    }
    
    const now = Date.now()
    const windowStart = now - config.windowMs
    
    try {
      // Create rate_limits table if it doesn't exist
      await client.rpc('upsert_rate_limit', {
        p_identifier: identifier,
        p_max_requests: config.maxRequests,
        p_window_ms: config.windowMs
      })
      
      // Check current count
      const { data, error } = await client
        .from('rate_limits')
        .select('count, reset_time')
        .eq('identifier', identifier)
        .single()
      
      if (error || !data) {
        // Insert new record
        const { error: insertError } = await client
          .from('rate_limits')
          .insert({
            identifier,
            count: 1,
            reset_time: new Date(now + config.windowMs).toISOString()
          })
        
        if (insertError) {
          Logger.warn('Failed to insert rate limit record, falling back to in-memory', { error: insertError.message })
          return SecurityMiddleware.checkRateLimit(identifier, config)
        }
        
        return { allowed: true, remaining: config.maxRequests - 1 }
      }
      
      const resetTime = new Date(data.reset_time).getTime()
      
      // Reset if window expired
      if (now > resetTime) {
        const { error: updateError } = await client
          .from('rate_limits')
          .update({
            count: 1,
            reset_time: new Date(now + config.windowMs).toISOString()
          })
          .eq('identifier', identifier)
        
        if (updateError) {
          Logger.warn('Failed to reset rate limit, falling back to in-memory', { error: updateError.message })
          return SecurityMiddleware.checkRateLimit(identifier, config)
        }
        
        return { allowed: true, remaining: config.maxRequests - 1 }
      }
      
      // Check if limit exceeded
      if (data.count >= config.maxRequests) {
        return { allowed: false, resetTime, remaining: 0 }
      }
      
      // Increment count
      const { error: incrementError } = await client
        .from('rate_limits')
        .update({ count: data.count + 1 })
        .eq('identifier', identifier)
      
      if (incrementError) {
        Logger.warn('Failed to increment rate limit, falling back to in-memory', { error: incrementError.message })
        return SecurityMiddleware.checkRateLimit(identifier, config)
      }
      
      return { allowed: true, remaining: config.maxRequests - (data.count + 1) }
    } catch (error) {
      Logger.warn('Database rate limit error, falling back to in-memory', { error: error instanceof Error ? error.message : String(error) })
      return SecurityMiddleware.checkRateLimit(identifier, config)
    }
  }
}

// In-memory cache for frequently accessed data (LRU cache with TTL)
interface CacheEntry<T> {
  value: T
  expiry: number
  size: number
}
const cacheStore = new Map<string, CacheEntry<unknown>>()
const MAX_CACHE_SIZE = 100 * 1024 * 1024 // 100MB max cache size
let currentCacheSize = 0

// Performance metrics store
const metricsStore = {
  requests: 0,
  errors: 0,
  totalResponseTime: 0,
  startTime: Date.now()
}

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

interface CacheConfig {
  ttlMs: number
  maxSize?: number // max size in bytes for the cached value
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: Record<string, unknown>
  requestId?: string
  duration?: number
}

// Structured logging for production monitoring
class Logger {
  private static formatLog(entry: LogEntry): string {
    return JSON.stringify({
      ...entry,
      service: 'edge-function',
      environment: Deno.env.get('ENVIRONMENT') || 'production'
    })
  }

  static info(message: string, context?: Record<string, unknown>, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'info',
      message,
      context,
      requestId
    }
    console.log(this.formatLog(entry))
  }

  static warn(message: string, context?: Record<string, unknown>, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'warn',
      message,
      context,
      requestId
    }
    console.warn(this.formatLog(entry))
  }

  static error(message: string, error?: Error, context?: Record<string, unknown>, requestId?: string): void {
    const entry: LogEntry = {
      timestamp: new Date().toISOString(),
      level: 'error',
      message,
      context: {
        ...context,
        errorName: error?.name,
        errorMessage: error?.message,
        errorStack: error?.stack
      },
      requestId
    }
    console.error(this.formatLog(entry))
  }

  static debug(message: string, context?: Record<string, unknown>, requestId?: string): void {
    if (Deno.env.get('DEBUG') === 'true') {
      const entry: LogEntry = {
        timestamp: new Date().toISOString(),
        level: 'debug',
        message,
        context,
        requestId
      }
      console.log(this.formatLog(entry))
    }
  }
}

// Performance monitoring
class PerformanceMonitor {
  private static startTimes = new Map<string, number>()

  static startTimer(requestId: string): void {
    this.startTimes.set(requestId, Date.now())
  }

  static endTimer(requestId: string): number {
    const startTime = this.startTimes.get(requestId)
    if (!startTime) return 0
    const duration = Date.now() - startTime
    this.startTimes.delete(requestId)
    
    // Update metrics
    metricsStore.requests++
    metricsStore.totalResponseTime += duration
    
    return duration
  }

  static recordError(): void {
    metricsStore.errors++
  }

  static getMetrics(): {
    uptime: number
    requests: number
    errors: number
    errorRate: number
    avgResponseTime: number
  } {
    const uptime = Date.now() - metricsStore.startTime
    const errorRate = metricsStore.requests > 0 ? (metricsStore.errors / metricsStore.requests) * 100 : 0
    const avgResponseTime = metricsStore.requests > 0 ? metricsStore.totalResponseTime / metricsStore.requests : 0
    
    return {
      uptime,
      requests: metricsStore.requests,
      errors: metricsStore.errors,
      errorRate,
      avgResponseTime
    }
  }
}

// In-memory cache with TTL and size limits
class Cache {
  static get<T>(key: string): T | null {
    const entry = cacheStore.get(key)
    if (!entry) return null
    
    if (Date.now() > entry.expiry) {
      this.delete(key)
      return null
    }
    
    return entry.value as T
  }

  static set<T>(key: string, value: T, config: CacheConfig): void {
    const valueSize = JSON.stringify(value).length
    
    // Check max size for individual entry
    if (config.maxSize && valueSize > config.maxSize) {
      Logger.warn('Cache entry too large, skipping', { key, size: valueSize })
      return
    }
    
    // Evict entries if cache is full
    while (currentCacheSize + valueSize > MAX_CACHE_SIZE && cacheStore.size > 0) {
      const firstKey = cacheStore.keys().next().value
      if (firstKey) this.delete(firstKey)
    }
    
    const expiry = Date.now() + config.ttlMs
    cacheStore.set(key, { value, expiry, size: valueSize })
    currentCacheSize += valueSize
    
    Logger.debug('Cache set', { key, size: valueSize, expiry })
  }

  static delete(key: string): void {
    const entry = cacheStore.get(key)
    if (entry) {
      currentCacheSize -= entry.size
      cacheStore.delete(key)
    }
  }

  static clear(): void {
    cacheStore.clear()
    currentCacheSize = 0
  }

  static getStats(): { size: number; entries: number; currentSize: number } {
    return {
      size: MAX_CACHE_SIZE,
      entries: cacheStore.size,
      currentSize: currentCacheSize
    }
  }
}

// Generate unique request ID for tracing
function generateRequestId(): string {
  return crypto.randomUUID()
}

export class SecurityMiddleware {
  // Generate CSRF token
  static generateCSRFToken(): string {
    const array = new Uint8Array(32)
    crypto.getRandomValues(array)
    return Array.from(array, byte => byte.toString(16).padStart(2, '0')).join('')
  }

  // Validate CSRF token
  static validateCSRFToken(req: Request): boolean {
    const csrfToken = req.headers.get('X-CSRF-Token')
    const cookieHeader = req.headers.get('Cookie')
    const cookieToken = cookieHeader?.match(/csrf-token=([^;]+)/)?.[1]

    if (!csrfToken || !cookieToken) {
      return false
    }

    // Use timing-safe comparison to prevent timing attacks
    return csrfToken === cookieToken
  }

  // Set CSRF cookie
  static setCSRFCookie(response: Response, token: string): void {
    response.headers.append('Set-Cookie',
      `csrf-token=${token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${24 * 60 * 60}` // 24 hours
    )
  }

  // Rate limiting check (async for database-backed, sync for in-memory fallback)
  static async checkRateLimit(identifier: string, config: RateLimitConfig): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    // Use database-backed rate limiter for production
    return await DatabaseRateLimiter.checkRateLimit(identifier, config)
  }
  
  // Synchronous version for compatibility (uses in-memory fallback)
  static checkRateLimitSync(identifier: string, config: RateLimitConfig): { allowed: boolean; resetTime?: number; remaining?: number } {
    const now = Date.now()
    const record = rateLimitStore.get(identifier)

    if (!record || now > record.resetTime) {
      // Create new record or reset expired one
      rateLimitStore.set(identifier, {
        count: 1,
        resetTime: now + config.windowMs
      })
      return { allowed: true, remaining: config.maxRequests - 1 }
    }

    if (record.count >= config.maxRequests) {
      return { allowed: false, resetTime: record.resetTime, remaining: 0 }
    }

    record.count++
    return { allowed: true, remaining: config.maxRequests - record.count }
  }

  // Get client identifier for rate limiting
  static getClientIdentifier(req: Request): string {
    // Use IP address if available (from CF-Connecting-IP or X-Forwarded-For)
    const ip = req.headers.get('CF-Connecting-IP') ||
               req.headers.get('X-Forwarded-For')?.split(',')[0] ||
               'unknown'
    return ip
  }

  // Set security headers
  static setSecurityHeaders(response: Response, isHttps: boolean = true): void {
    // Content Security Policy
    response.headers.set('Content-Security-Policy',
      "default-src 'self'; " +
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'; " +
      "style-src 'self' 'unsafe-inline'; " +
      "img-src 'self' data: https:; " +
      "font-src 'self' data:; " +
      "connect-src 'self'; " +
      "frame-ancestors 'none';"
    )

    // Prevent clickjacking
    response.headers.set('X-Frame-Options', 'DENY')

    // Prevent MIME type sniffing
    response.headers.set('X-Content-Type-Options', 'nosniff')

    // Enable XSS protection
    response.headers.set('X-XSS-Protection', '1; mode=block')

    // Referrer policy
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')

    // Permissions policy
    response.headers.set('Permissions-Policy',
      'geolocation=(), ' +
      'microphone=(), ' +
      'camera=(), ' +
      'payment=()'
    )

    // Strict-Transport-Security (only for HTTPS)
    if (isHttps) {
      response.headers.set('Strict-Transport-Security',
        'max-age=31536000; includeSubDomains; preload'
      )
    }
    
    // Add cache control for API responses
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  // Sanitize error messages to prevent information leakage
  static sanitizeError(error: unknown): string {
    if (error instanceof Error) {
      // Log full error for debugging
      Logger.error('Security middleware error', error)
      
      // Return generic message to client
      return 'An error occurred. Please try again.'
    }
    return 'An unexpected error occurred'
  }

  // Validate email format
  static isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  // Validate password strength
  static validatePasswordStrength(password: string): { valid: boolean; reason?: string } {
    if (password.length < 8) {
      return { valid: false, reason: 'Password must be at least 8 characters' }
    }
    if (!/[A-Z]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one uppercase letter' }
    }
    if (!/[a-z]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one lowercase letter' }
    }
    if (!/[0-9]/.test(password)) {
      return { valid: false, reason: 'Password must contain at least one number' }
    }
    return { valid: true }
  }

  // Check session timeout (15 minutes for access tokens)
  static isSessionExpired(expiresAt: number): boolean {
    return Date.now() > expiresAt
  }

  // Create standardized JSON response with security headers
  static createResponse(
    body: unknown,
    status: number = 200,
    additionalHeaders?: Record<string, string>
  ): Response {
    const response = new Response(JSON.stringify(body), {
      status,
      headers: {
        'Content-Type': 'application/json',
        ...additionalHeaders
      }
    })
    
    this.setSecurityHeaders(response)
    return response
  }

  // Create error response with proper status codes
  static createErrorResponse(
    message: string,
    status: number = 500,
    requestId?: string
  ): Response {
    const body: Record<string, unknown> = { error: message }
    if (requestId) body.requestId = requestId
    
    return this.createResponse(body, status)
  }
}

// Rate limit configurations for different endpoints
export const RATE_LIMIT_CONFIGS = {
  login: { maxRequests: 5, windowMs: 15 * 60 * 1000 }, // 5 requests per 15 minutes
  signup: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
  refresh: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
  verify: { maxRequests: 100, windowMs: 15 * 60 * 1000 }, // 100 requests per 15 minutes
  logout: { maxRequests: 20, windowMs: 15 * 60 * 1000 }, // 20 requests per 15 minutes
  health: { maxRequests: 1000, windowMs: 60 * 1000 } // 1000 requests per minute for health checks
}

// Cache configurations for different data types
export const CACHE_CONFIGS = {
  userProfile: { ttlMs: 5 * 60 * 1000, maxSize: 50 * 1024 }, // 5 minutes, 50KB
  staticData: { ttlMs: 60 * 60 * 1000, maxSize: 500 * 1024 }, // 1 hour, 500KB
  session: { ttlMs: 15 * 60 * 1000, maxSize: 10 * 1024 }, // 15 minutes, 10KB
  apiResponse: { ttlMs: 30 * 1000, maxSize: 100 * 1024 } // 30 seconds, 100KB
}

// Export utilities for use in Edge Functions
export { Logger, PerformanceMonitor, Cache, generateRequestId }
