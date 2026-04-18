import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Rate limiting store (in-memory fallback)
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMIT_CONFIGS = {
  verify: { maxRequests: 100, windowMs: 15 * 60 * 1000 },
}

// Performance metrics store
const metricsStore = {
  requests: 0,
  errors: 0,
  totalResponseTime: 0,
  startTime: Date.now()
}

interface LogEntry {
  timestamp: string
  level: 'info' | 'warn' | 'error' | 'debug'
  message: string
  context?: Record<string, unknown>
  requestId?: string
  duration?: number
}

// Structured logging
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
    
    metricsStore.requests++
    metricsStore.totalResponseTime += duration
    
    return duration
  }

  static recordError(): void {
    metricsStore.errors++
  }
}

// Generate unique request ID
function generateRequestId(): string {
  return crypto.randomUUID()
}

class SecurityMiddleware {
  static async checkRateLimit(identifier: string, config: RateLimitConfig): Promise<{ allowed: boolean; resetTime?: number; remaining?: number }> {
    const now = Date.now()
    const record = rateLimitStore.get(identifier)

    if (!record || now > record.resetTime) {
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

  static getClientIdentifier(req: Request): string {
    return req.headers.get('CF-Connecting-IP') ||
           req.headers.get('X-Forwarded-For')?.split(',')[0] ||
           'unknown'
  }

  static setSecurityHeaders(response: Response): void {
    // CORS headers
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, apikey, x-client-info')
    response.headers.set('Access-Control-Max-Age', '86400')

    response.headers.set('Content-Security-Policy',
      "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
    )
    response.headers.set('X-Frame-Options', 'DENY')
    response.headers.set('X-Content-Type-Options', 'nosniff')
    response.headers.set('X-XSS-Protection', '1; mode=block')
    response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
    response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
    response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
    response.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate')
    response.headers.set('Pragma', 'no-cache')
    response.headers.set('Expires', '0')
  }

  static sanitizeError(error: unknown): string {
    if (error instanceof Error) {
      Logger.error('Security middleware error', error)
      return 'An error occurred. Please try again.'
    }
    return 'An unexpected error occurred'
  }

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

serve(async (req) => {
  const requestId = generateRequestId()
  PerformanceMonitor.startTimer(requestId)

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    const response = new Response(null, { status: 204 })
    SecurityMiddleware.setSecurityHeaders(response)
    return response
  }

  try {
    Logger.info('Token verification started', { method: req.method }, requestId)

    // CSRF protection - verify CSRF token from header matches cookie
    const csrfToken = req.headers.get('X-CSRF-Token')
    const cookieHeader = req.headers.get('Cookie')
    const cookieToken = cookieHeader?.match(/csrf-token=([^;]+)/)?.[1]
    
    if (!csrfToken || !cookieToken || csrfToken !== cookieToken) {
      Logger.warn('CSRF token validation failed', { hasHeader: !!csrfToken, hasCookie: !!cookieToken }, requestId)
      return SecurityMiddleware.createErrorResponse('Invalid CSRF token', 403, requestId)
    }
    
    // Rate limiting check (async for database-backed)
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = await SecurityMiddleware.checkRateLimit(
      `verify:${clientId}`,
      RATE_LIMIT_CONFIGS.verify
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many verification attempts. Please try again later.'
      }, 429, { 'Retry-After': '900' })
    }

    const accessToken = cookieHeader?.match(/sb-access-token=([^;]+)/)?.[1]

    if (!accessToken) {
      Logger.warn('No access token provided', {}, requestId)
      return SecurityMiddleware.createErrorResponse('No access token', 401, requestId)
    }

    // Create Supabase client with connection pooling optimization
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error || !data.user) {
      Logger.warn('Token verification failed', { error: error?.message }, requestId)
      const response = SecurityMiddleware.createErrorResponse('Invalid token', 401, requestId)
      // Clear invalid cookies
      response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      return response
    }

    const response = SecurityMiddleware.createResponse({
      success: true,
      user: { id: data.user.id, email: data.user.email }
    })
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))

    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.info('Token verification successful', { userId: data.user.id, duration }, requestId)

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Token verification error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createErrorResponse(
      SecurityMiddleware.sanitizeError(error), 
      500, 
      requestId
    )
  }
})
