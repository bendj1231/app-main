// Enterprise API Gateway for Supabase Edge Functions
// Provides unified entry point, routing, caching, and monitoring
// Targets: Sub-50ms cached responses, 99.9% uptime

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

// ==================== CONFIGURATION ====================
const CONFIG = {
  API_VERSION: 'v1',
  DEFAULT_CACHE_TTL: 30, // seconds for API responses
  STATIC_CACHE_TTL: 3600, // 1 hour for static data
  MAX_CACHE_SIZE: 100 * 1024 * 1024, // 100MB
  CDN_CACHE_CONTROL: 'public, max-age=30, stale-while-revalidate=300',
  BYPASS_CACHE_HEADER: 'x-bypass-cache',
  API_BASE_PATH: '/api/v1',
  MAX_REQUEST_SIZE: 10 * 1024 * 1024, // 10MB
  TIMEOUT_MS: 30000 // 30 second timeout
}

// ==================== ROUTE DEFINITIONS ====================
interface Route {
  pattern: RegExp
  target: string
  methods: string[]
  cacheable: boolean
  cacheTtl: number
  requiresAuth: boolean
  rateLimitKey: string
  rateLimitConfig: { maxRequests: number; windowMs: number }
}

const ROUTES: Route[] = [
  // Auth routes (not cached)
  {
    pattern: /^\/api\/v1\/auth\/login$/,
    target: 'auth-login',
    methods: ['POST'],
    cacheable: false,
    cacheTtl: 0,
    requiresAuth: false,
    rateLimitKey: 'login',
    rateLimitConfig: { maxRequests: 5, windowMs: 15 * 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/auth\/signup$/,
    target: 'auth-signup',
    methods: ['POST'],
    cacheable: false,
    cacheTtl: 0,
    requiresAuth: false,
    rateLimitKey: 'signup',
    rateLimitConfig: { maxRequests: 3, windowMs: 60 * 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/auth\/logout$/,
    target: 'auth-logout',
    methods: ['POST'],
    cacheable: false,
    cacheTtl: 0,
    requiresAuth: true,
    rateLimitKey: 'logout',
    rateLimitConfig: { maxRequests: 20, windowMs: 15 * 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/auth\/refresh$/,
    target: 'auth-refresh',
    methods: ['POST'],
    cacheable: false,
    cacheTtl: 0,
    requiresAuth: true,
    rateLimitKey: 'refresh',
    rateLimitConfig: { maxRequests: 10, windowMs: 15 * 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/auth\/verify$/,
    target: 'auth-verify',
    methods: ['GET', 'POST'],
    cacheable: false,
    cacheTtl: 0,
    requiresAuth: true,
    rateLimitKey: 'verify',
    rateLimitConfig: { maxRequests: 100, windowMs: 15 * 60 * 1000 }
  },
  
  // Data routes (cached)
  {
    pattern: /^\/api\/v1\/profiles(?:\/([^/]+))?$/,
    target: 'profiles',
    methods: ['GET', 'PUT', 'PATCH'],
    cacheable: true,
    cacheTtl: 300, // 5 minutes
    requiresAuth: true,
    rateLimitKey: 'profiles',
    rateLimitConfig: { maxRequests: 100, windowMs: 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/notifications$/,
    target: 'notifications',
    methods: ['GET', 'POST', 'PATCH'],
    cacheable: true,
    cacheTtl: 60, // 1 minute
    requiresAuth: true,
    rateLimitKey: 'notifications',
    rateLimitConfig: { maxRequests: 200, windowMs: 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/flight-logs$/,
    target: 'pilot-flight-logs',
    methods: ['GET', 'POST'],
    cacheable: true,
    cacheTtl: 300,
    requiresAuth: true,
    rateLimitKey: 'flight-logs',
    rateLimitConfig: { maxRequests: 50, windowMs: 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/programs(?:\/([^/]+))?$/,
    target: 'program-progress',
    methods: ['GET', 'POST'],
    cacheable: true,
    cacheTtl: 600, // 10 minutes
    requiresAuth: true,
    rateLimitKey: 'programs',
    rateLimitConfig: { maxRequests: 100, windowMs: 60 * 1000 }
  },
  {
    pattern: /^\/api\/v1\/airlines$/,
    target: 'airline-expectations',
    methods: ['GET'],
    cacheable: true,
    cacheTtl: 3600, // 1 hour - static data
    requiresAuth: false,
    rateLimitKey: 'airlines',
    rateLimitConfig: { maxRequests: 1000, windowMs: 60 * 1000 }
  },
  
  // Health check (lightly cached)
  {
    pattern: /^\/api\/v1\/health$/,
    target: 'health-check',
    methods: ['GET'],
    cacheable: true,
    cacheTtl: 10, // 10 seconds
    requiresAuth: false,
    rateLimitKey: 'health',
    rateLimitConfig: { maxRequests: 1000, windowMs: 60 * 1000 }
  }
]

// ==================== CACHE IMPLEMENTATION ====================
interface CacheEntry {
  data: unknown
  headers: Record<string, string>
  timestamp: number
  ttl: number
  size: number
  hits: number
  etag: string
}

class MultiTierCache {
  private cache = new Map<string, CacheEntry>()
  private currentSize = 0
  private metrics = { hits: 0, misses: 0, evictions: 0 }

  private generateETag(data: unknown): string {
    const str = JSON.stringify(data)
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash
    }
    return `"${hash.toString(16)}"`
  }

  private getSize(data: unknown): number {
    return JSON.stringify(data).length
  }

  private evictIfNeeded(requiredSpace: number): void {
    while (this.currentSize + requiredSpace > CONFIG.MAX_CACHE_SIZE && this.cache.size > 0) {
      const oldestKey = this.cache.keys().next().value
      if (oldestKey) {
        const entry = this.cache.get(oldestKey)
        if (entry) {
          this.currentSize -= entry.size
          this.metrics.evictions++
        }
        this.cache.delete(oldestKey)
      }
    }
  }

  get(key: string, ifNoneMatch?: string): { hit: boolean; entry?: CacheEntry; notModified?: boolean } {
    const entry = this.cache.get(key)
    
    if (!entry) {
      this.metrics.misses++
      return { hit: false }
    }

    // Check if expired
    if (Date.now() - entry.timestamp > entry.ttl * 1000) {
      this.cache.delete(key)
      this.currentSize -= entry.size
      this.metrics.misses++
      return { hit: false }
    }

    // Check ETag for conditional request
    if (ifNoneMatch && ifNoneMatch === entry.etag) {
      entry.hits++
      this.metrics.hits++
      return { hit: true, entry, notModified: true }
    }

    entry.hits++
    this.metrics.hits++
    return { hit: true, entry }
  }

  set(key: string, data: unknown, headers: Record<string, string>, ttl: number): void {
    const size = this.getSize(data)
    
    // Don't cache if too large (max 1MB per entry)
    if (size > 1024 * 1024) {
      console.log(JSON.stringify({ level: 'warn', message: 'Entry too large for cache', key, size }))
      return
    }

    this.evictIfNeeded(size)

    const entry: CacheEntry = {
      data,
      headers,
      timestamp: Date.now(),
      ttl,
      size,
      hits: 0,
      etag: this.generateETag(data)
    }

    this.cache.set(key, entry)
    this.currentSize += size
  }

  invalidate(pattern: RegExp): number {
    let count = 0
    for (const [key, entry] of this.cache.entries()) {
      if (pattern.test(key)) {
        this.cache.delete(key)
        this.currentSize -= entry.size
        count++
      }
    }
    return count
  }

  warmCache(key: string, data: unknown, headers: Record<string, string>, ttl: number): void {
    this.set(key, data, headers, ttl)
    console.log(JSON.stringify({ level: 'info', message: 'Cache warmed', key }))
  }

  getMetrics(): { hits: number; misses: number; evictions: number; size: number; entries: number; hitRate: number } {
    const total = this.metrics.hits + this.metrics.misses
    return {
      ...this.metrics,
      size: this.currentSize,
      entries: this.cache.size,
      hitRate: total > 0 ? (this.metrics.hits / total) * 100 : 0
    }
  }

  getStats(): Array<{ key: string; hits: number; age: number; size: number }> {
    const now = Date.now()
    return Array.from(this.cache.entries()).map(([key, entry]) => ({
      key,
      hits: entry.hits,
      age: Math.floor((now - entry.timestamp) / 1000),
      size: entry.size
    }))
  }
}

const cache = new MultiTierCache()

// ==================== RATE LIMITING ====================
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

async function checkRateLimit(
  identifier: string,
  config: { maxRequests: number; windowMs: number }
): Promise<{ allowed: boolean; remaining: number; resetAfter: number }> {
  const now = Date.now()
  const key = `${identifier}:${Math.floor(now / config.windowMs)}`
  const record = rateLimitStore.get(key)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(key, { count: 1, resetTime: now + config.windowMs })
    return { allowed: true, remaining: config.maxRequests - 1, resetAfter: config.windowMs }
  }

  if (record.count >= config.maxRequests) {
    return { 
      allowed: false, 
      remaining: 0, 
      resetAfter: record.resetTime - now 
    }
  }

  record.count++
  return { 
    allowed: true, 
    remaining: config.maxRequests - record.count,
    resetAfter: config.windowMs - (now - (record.resetTime - config.windowMs))
  }
}

// ==================== ROUTING ====================
function matchRoute(path: string, method: string): Route | null {
  for (const route of ROUTES) {
    if (route.pattern.test(path) && route.methods.includes(method)) {
      return route
    }
  }
  return null
}

// ==================== AUTHENTICATION ====================
async function verifyAuth(req: Request): Promise<{ valid: boolean; user?: { id: string; email: string }; error?: string }> {
  const cookieHeader = req.headers.get('Cookie')
  const accessToken = cookieHeader?.match(/sb-access-token=([^;]+)/)?.[1]

  if (!accessToken) {
    return { valid: false, error: 'No access token' }
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { autoRefreshToken: false, persistSession: false }
    })

    const { data, error } = await supabase.auth.getUser(accessToken)

    if (error || !data.user) {
      return { valid: false, error: 'Invalid token' }
    }

    return { 
      valid: true, 
      user: { id: data.user.id, email: data.user.email }
    }
  } catch (err) {
    return { valid: false, error: 'Authentication error' }
  }
}

// ==================== REQUEST HANDLING ====================
async function proxyRequest(
  req: Request,
  route: Route,
  user?: { id: string; email: string }
): Promise<Response> {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  
  try {
    // Build target URL
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const targetUrl = `${supabaseUrl}/functions/v1/${route.target}`
    
    // Clone headers and add gateway metadata
    const headers = new Headers(req.headers)
    headers.set('X-Request-ID', requestId)
    headers.set('X-API-Gateway', 'true')
    headers.set('X-API-Version', CONFIG.API_VERSION)
    
    if (user) {
      headers.set('X-User-ID', user.id)
      headers.set('X-User-Email', user.email)
    }

    // Forward request
    const response = await fetch(targetUrl, {
      method: req.method,
      headers,
      body: req.body,
      // @ts-ignore - Deno specific
      signal: AbortSignal.timeout(CONFIG.TIMEOUT_MS)
    })

    const duration = Date.now() - startTime
    
    // Log request metrics
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Request proxied',
      requestId,
      target: route.target,
      method: req.method,
      path: new URL(req.url).pathname,
      status: response.status,
      duration,
      cached: false
    }))

    return response
  } catch (error) {
    const duration = Date.now() - startTime
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Proxy error',
      requestId,
      error: error instanceof Error ? error.message : String(error),
      duration
    }))

    return new Response(JSON.stringify({ 
      error: 'Service unavailable',
      requestId 
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

// ==================== RESPONSE BUILDER ====================
function buildResponse(
  body: unknown,
  status: number,
  headers: Record<string, string>,
  route: Route,
  cacheKey?: string,
  etag?: string
): Response {
  const responseHeaders = new Headers({
    'Content-Type': 'application/json',
    'X-API-Version': CONFIG.API_VERSION,
    ...headers
  })

  // Set security headers
  responseHeaders.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  )
  responseHeaders.set('X-Frame-Options', 'DENY')
  responseHeaders.set('X-Content-Type-Options', 'nosniff')
  responseHeaders.set('X-XSS-Protection', '1; mode=block')
  responseHeaders.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  responseHeaders.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')

  // Set cache headers for CDN
  if (route.cacheable && cacheKey) {
    responseHeaders.set('Cache-Control', CONFIG.CDN_CACHE_CONTROL)
    if (etag) {
      responseHeaders.set('ETag', etag)
    }
  } else {
    responseHeaders.set('Cache-Control', 'no-store, no-cache, must-revalidate')
    responseHeaders.set('Pragma', 'no-cache')
  }

  return new Response(JSON.stringify(body), {
    status,
    headers: responseHeaders
  })
}

// ==================== MAIN HANDLER ====================
serve(async (req) => {
  const requestId = crypto.randomUUID()
  const startTime = Date.now()
  const url = new URL(req.url)
  const path = url.pathname

  try {
    // Log incoming request
    console.log(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'info',
      message: 'Request received',
      requestId,
      method: req.method,
      path,
      userAgent: req.headers.get('User-Agent'),
      ip: req.headers.get('CF-Connecting-IP') || req.headers.get('X-Forwarded-For')?.split(',')[0]
    }))

    // CORS preflight
    if (req.method === 'OPTIONS') {
      return new Response(null, {
        status: 204,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token, X-Request-ID',
          'Access-Control-Max-Age': '86400'
        }
      })
    }

    // Match route
    const route = matchRoute(path, req.method)
    if (!route) {
      return buildResponse({ error: 'Not found', requestId }, 404, {}, {
        pattern: /.*/,
        target: 'unknown',
        methods: [],
        cacheable: false,
        cacheTtl: 0,
        requiresAuth: false,
        rateLimitKey: 'unknown',
        rateLimitConfig: { maxRequests: 0, windowMs: 0 }
      })
    }

    // Check rate limit
    const clientId = req.headers.get('CF-Connecting-IP') || 
                     req.headers.get('X-Forwarded-For')?.split(',')[0] ||
                     'unknown'
    const rateLimit = await checkRateLimit(`${route.rateLimitKey}:${clientId}`, route.rateLimitConfig)
    
    if (!rateLimit.allowed) {
      return buildResponse(
        { error: 'Rate limit exceeded', retryAfter: Math.ceil(rateLimit.resetAfter / 1000) },
        429,
        { 'Retry-After': String(Math.ceil(rateLimit.resetAfter / 1000)) },
        route
      )
    }

    // Authenticate if required
    let user: { id: string; email: string } | undefined
    if (route.requiresAuth) {
      const auth = await verifyAuth(req)
      if (!auth.valid) {
        return buildResponse({ error: auth.error, requestId }, 401, {}, route)
      }
      user = auth.user
    }

    // Generate cache key
    const cacheKey = route.cacheable 
      ? `${route.target}:${path}:${user?.id || 'anon'}:${url.search}`
      : undefined

    // Check cache (unless bypass requested)
    const bypassCache = req.headers.get(CONFIG.BYPASS_CACHE_HEADER) === 'true'
    if (route.cacheable && cacheKey && !bypassCache) {
      const ifNoneMatch = req.headers.get('If-None-Match')
      const cached = cache.get(cacheKey, ifNoneMatch || undefined)
      
      if (cached.hit) {
        if (cached.notModified) {
          return new Response(null, {
            status: 304,
            headers: {
              'ETag': cached.entry!.etag,
              'X-Cache': 'HIT',
              'X-RateLimit-Remaining': String(rateLimit.remaining)
            }
          })
        }

        // Return cached response
        const duration = Date.now() - startTime
        console.log(JSON.stringify({
          timestamp: new Date().toISOString(),
          level: 'info',
          message: 'Cache hit',
          requestId,
          path,
          duration,
          cacheKey
        }))

        return buildResponse(
          cached.entry!.data,
          200,
          {
            ...cached.entry!.headers,
            'X-Cache': 'HIT',
            'X-Response-Time': `${duration}ms`,
            'X-RateLimit-Remaining': String(rateLimit.remaining)
          },
          route,
          cacheKey,
          cached.entry!.etag
        )
      }
    }

    // Proxy to target function
    const response = await proxyRequest(req, route, user)
    
    // Read response body
    const responseBody = await response.json().catch(() => null)
    const responseHeaders: Record<string, string> = {}
    response.headers.forEach((value, key) => {
      responseHeaders[key] = value
    })

    // Cache successful GET requests
    if (route.cacheable && cacheKey && response.status === 200 && req.method === 'GET') {
      cache.set(cacheKey, responseBody, responseHeaders, route.cacheTtl)
    }

    const duration = Date.now() - startTime

    // Return response
    return buildResponse(
      responseBody || { error: 'Invalid response' },
      response.status,
      {
        ...responseHeaders,
        'X-Cache': 'MISS',
        'X-Response-Time': `${duration}ms`,
        'X-RateLimit-Remaining': String(rateLimit.remaining),
        'X-Request-ID': requestId
      },
      route,
      cacheKey
    )

  } catch (error) {
    const duration = Date.now() - startTime
    console.error(JSON.stringify({
      timestamp: new Date().toISOString(),
      level: 'error',
      message: 'Gateway error',
      requestId,
      error: error instanceof Error ? error.message : String(error),
      duration
    }))

    return buildResponse(
      { error: 'Internal server error', requestId },
      500,
      { 'X-Response-Time': `${duration}ms` },
      {
        pattern: /.*/,
        target: 'error',
        methods: [],
        cacheable: false,
        cacheTtl: 0,
        requiresAuth: false,
        rateLimitKey: 'error',
        rateLimitConfig: { maxRequests: 0, windowMs: 0 }
      }
    )
  }
})

// Export for testing
export { cache, MultiTierCache, matchRoute }
