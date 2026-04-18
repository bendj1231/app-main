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
    Logger.info('Signup request started', { method: req.method }, requestId)
    
    // Rate limiting check
    const clientId = SecurityMiddleware.getClientIdentifier(req)
    const rateLimitResult = SecurityMiddleware.checkRateLimit(
      `signup:${clientId}`,
      RATE_LIMIT_CONFIGS.signup
    )

    if (!rateLimitResult.allowed) {
      Logger.warn('Rate limit exceeded', { clientId }, requestId)
      return SecurityMiddleware.createResponse({
        error: 'Too many signup attempts. Please try again later.',
        retryAfter: rateLimitResult.resetTime
      }, 429, { 'Retry-After': '3600' })
    }

    // CSRF protection for POST requests
    if (req.method === 'POST') {
      if (!SecurityMiddleware.validateCSRFToken(req)) {
        Logger.warn('Invalid CSRF token', {}, requestId)
        return SecurityMiddleware.createErrorResponse('Invalid CSRF token', 403, requestId)
      }
    }

    const { email, password, userData } = await req.json()

    // Input validation
    if (!email || !password) {
      Logger.warn('Missing credentials', {}, requestId)
      return SecurityMiddleware.createErrorResponse('Email and password required', 400, requestId)
    }

    if (!SecurityMiddleware.isValidEmail(email)) {
      Logger.warn('Invalid email format', { email }, requestId)
      return SecurityMiddleware.createErrorResponse('Invalid email format', 400, requestId)
    }

    // Password strength validation
    const passwordCheck = SecurityMiddleware.validatePasswordStrength(password)
    if (!passwordCheck.valid) {
      Logger.warn('Password validation failed', { reason: passwordCheck.reason }, requestId)
      return SecurityMiddleware.createErrorResponse(passwordCheck.reason || 'Invalid password', 400, requestId)
    }

    // Create Supabase client with connection pooling optimization
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData || {}
      }
    })

    if (error) {
      Logger.warn('Signup failed', { error: error.message }, requestId)
      return SecurityMiddleware.createErrorResponse(
        'Unable to create account. Please try again or contact support if the issue persists.', 
        400, 
        requestId
      )
    }

    const response = SecurityMiddleware.createResponse({
      success: true,
      user: { id: data.user?.id, email: data.user?.email },
      message: data.session ? 'Account created successfully' : 'Please check your email to verify your account'
    })

    // Set HTTP-only cookies if session exists (auto-confirmed)
    if (data.session) {
      const csrfToken = SecurityMiddleware.generateCSRFToken()
      SecurityMiddleware.setCSRFCookie(response, csrfToken)

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
    }
    
    // Add rate limit headers
    response.headers.set('X-RateLimit-Remaining', String(rateLimitResult.remaining))

    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.info('Signup successful', { userId: data.user?.id, duration }, requestId)

    return response
  } catch (error) {
    PerformanceMonitor.recordError()
    const duration = PerformanceMonitor.endTimer(requestId)
    Logger.error('Signup error', error instanceof Error ? error : new Error(String(error)), { duration }, requestId)
    
    return SecurityMiddleware.createErrorResponse(
      SecurityMiddleware.sanitizeError(error), 
      500, 
      requestId
    )
  }
})
