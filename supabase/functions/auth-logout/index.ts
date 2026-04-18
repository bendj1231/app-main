import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { 
  SecurityMiddleware, 
  RATE_LIMIT_CONFIGS, 
  Logger, 
  PerformanceMonitor, 
  generateRequestId 
} from '../_shared/security-middleware.ts'

serve(async (req) => {
  const requestId = generateRequestId()
  PerformanceMonitor.startTimer(requestId)

  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    const response = new Response(null, { status: 204 })
    response.headers.set('Access-Control-Allow-Origin', '*')
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS')
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-CSRF-Token, apikey, x-client-info')
    response.headers.set('Access-Control-Max-Age', '86400')
    SecurityMiddleware.setSecurityHeaders(response)
    return response
  }

  try {
    Logger.info('Logout request started', { method: req.method }, requestId)
    
    // Rate limiting check
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `logout:${clientId}`,
      RATE_LIMIT_CONFIGS.logout
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many requests. Please try again later.'
      }, 429, { 'Retry-After': '900' })
    }

    // CSRF protection for POST requests
    if (req.method === 'POST') {
      if (!SecurityMiddleware.validateCSRFToken(req)) {
        Logger.warn('Invalid CSRF token', {}, requestId)
        return SecurityMiddleware.createErrorResponse('Invalid CSRF token', 403, requestId)
      }
    }

    const response = SecurityMiddleware.createResponse({ success: true })

    // Clear all auth cookies
    response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
    response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
    response.headers.append('Set-Cookie', 'csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))

    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.info('Logout successful', { duration }, requestId)

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Logout error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createErrorResponse(
      SecurityMiddleware.sanitizeError(error), 
      500, 
      requestId
    )
  }
})
