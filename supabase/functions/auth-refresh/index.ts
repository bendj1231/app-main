import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { 
  SecurityMiddleware, 
  RATE_LIMIT_CONFIGS, 
  Logger, 
  PerformanceMonitor, 
  generateRequestId 
} from '../_shared/security-middleware.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  const requestId = generateRequestId()
  PerformanceMonitor.startTimer(requestId)
  
  try {
    Logger.info('Token refresh started', { method: req.method }, requestId)
    
    // Rate limiting check
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `refresh:${clientId}`,
      RATE_LIMIT_CONFIGS.refresh
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many refresh attempts. Please try again later.'
      }, 429, { 'Retry-After': '900' })
    }

    const cookieHeader = req.headers.get('Cookie')
    const refreshToken = cookieHeader?.match(/sb-refresh-token=([^;]+)/)?.[1]

    if (!refreshToken) {
      Logger.warn('No refresh token provided', {}, requestId)
      return SecurityMiddleware.createErrorResponse('No refresh token', 401, requestId)
    }

    // Create Supabase client with connection pooling optimization
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error) {
      Logger.warn('Token refresh failed', { error: error.message }, requestId)
      const response = SecurityMiddleware.createErrorResponse('Invalid refresh token', 401, requestId)
      // Clear invalid cookies
      response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      return response
    }

    // Check session expiration
    const expiresAt = Date.now() + (data.session.expires_in * 1000)
    if (SecurityMiddleware.isSessionExpired(expiresAt)) {
      Logger.warn('Session expired', {}, requestId)
      const response = SecurityMiddleware.createErrorResponse('Session expired', 401, requestId)
      // Clear expired cookies
      response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'csrf-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      return response
    }

    // Generate new CSRF token
    const csrfToken = SecurityMiddleware.generateCSRFToken()

    const response = SecurityMiddleware.createResponse({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      csrfToken: csrfToken
    })

    // Set new CSRF cookie
    SecurityMiddleware.setCSRFCookie(response, csrfToken)

    // Update cookies with new tokens
    response.headers.append('Set-Cookie', 
      `sb-access-token=${data.session.access_token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${15 * 60}`
    )

    response.headers.append('Set-Cookie', 
      `sb-refresh-token=${data.session.refresh_token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${30 * 24 * 60 * 60}`
    )
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))

    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.info('Token refresh successful', { userId: data.user.id, duration }, requestId)

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Token refresh error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createErrorResponse(
      SecurityMiddleware.sanitizeError(error), 
      500, 
      requestId
    )
  }
})
