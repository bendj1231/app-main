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
    Logger.info('Login request started', { method: req.method }, requestId)
    
    // Rate limiting check
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `login:${clientId}`,
      RATE_LIMIT_CONFIGS.login
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many login attempts. Please try again later.',
        retryAfter: rateLimitResult.resetTime
      }, 429, { 'Retry-After': '900' })
    }

    // CSRF protection is skipped for login since there's no session yet
    // CSRF will be enforced after login for subsequent requests

    const { email, password } = await req.json()

    // Input validation
    if (!email || !password) {
      Logger.warn('Missing credentials', {}, requestId)
      return SecurityMiddleware.createErrorResponse('Email and password required', 400, requestId)
    }

    if (!SecurityMiddleware.isValidEmail(email)) {
      Logger.warn('Invalid email format', { email }, requestId)
      return SecurityMiddleware.createErrorResponse('Invalid email format', 400, requestId)
    }

    // Create Supabase client with connection pooling optimization
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    })

    if (error) {
      Logger.warn('Login failed', { error: error.message }, requestId)
      return SecurityMiddleware.createErrorResponse('Invalid credentials', 401, requestId)
    }

    // Generate new CSRF token
    const csrfToken = SecurityMiddleware.generateCSRFToken()

    const response = SecurityMiddleware.createResponse({
      success: true,
      user: { id: data.user.id, email: data.user.email },
      csrfToken: csrfToken
    })

    // Set CSRF cookie
    SecurityMiddleware.setCSRFCookie(response, csrfToken)

    // Set access token cookie (short-lived - 15 minutes)
    response.headers.append('Set-Cookie', 
      `sb-access-token=${data.session.access_token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${15 * 60}`
    )

    // Set refresh token cookie (long-lived - 30 days)
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
    Logger.info('Login successful', { userId: data.user.id, duration }, requestId)

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Login error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createErrorResponse(
      SecurityMiddleware.sanitizeError(error), 
      500, 
      requestId
    )
  }
})
