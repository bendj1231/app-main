import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

// Rate limiting store
const rateLimitStore = new Map<string, { count: number; resetTime: number }>()

interface RateLimitConfig {
  maxRequests: number
  windowMs: number
}

const RATE_LIMIT_CONFIGS = {
  mfaDisable: { maxRequests: 3, windowMs: 60 * 60 * 1000 }, // 3 requests per hour
}

// Rate limiting check
function checkRateLimit(identifier: string, config: RateLimitConfig): { allowed: boolean; resetTime?: number } {
  const now = Date.now()
  const record = rateLimitStore.get(identifier)

  if (!record || now > record.resetTime) {
    rateLimitStore.set(identifier, {
      count: 1,
      resetTime: now + config.windowMs
    })
    return { allowed: true }
  }

  if (record.count >= config.maxRequests) {
    return { allowed: false, resetTime: record.resetTime }
  }

  record.count++
  return { allowed: true }
}

// Get client identifier
function getClientIdentifier(req: Request): string {
  return req.headers.get('CF-Connecting-IP') ||
         req.headers.get('X-Forwarded-For')?.split(',')[0] ||
         'unknown'
}

// Set security headers
function setSecurityHeaders(response: Response): void {
  response.headers.set('Content-Security-Policy',
    "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval'; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data:; connect-src 'self'; frame-ancestors 'none';"
  )
  response.headers.set('X-Frame-Options', 'DENY')
  response.headers.set('X-Content-Type-Options', 'nosniff')
  response.headers.set('X-XSS-Protection', '1; mode=block')
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin')
  response.headers.set('Permissions-Policy', 'geolocation=(), microphone=(), camera=(), payment=()')
  response.headers.set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains; preload')
}

// Sanitize error
function sanitizeError(error: unknown): string {
  if (error instanceof Error) {
    console.error('MFA disable error:', error.message)
    return 'An error occurred. Please try again.'
  }
  return 'An unexpected error occurred'
}

serve(async (req) => {
  try {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ error: 'Method not allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const { userId, code } = await req.json()

    if (!userId || !code) {
      return new Response(JSON.stringify({ error: 'User ID and verification code required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimitResult = checkRateLimit(`mfa-disable:${clientId}`, RATE_LIMIT_CONFIGS.mfaDisable)

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many MFA disable attempts. Please try again later.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '3600' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Get MFA secret for user
    const { data: mfaSecret, error: secretError } = await supabase
      .from('mfa_secrets')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (secretError || !mfaSecret) {
      return new Response(JSON.stringify({ error: 'MFA not set up for this user' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (!mfaSecret.is_enabled) {
      return new Response(JSON.stringify({ error: 'MFA is not enabled for this user' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Verify the code (could be TOTP or backup code)
    // Check if it's a backup code first
    const { data: backupCodeUsed } = await supabase.rpc('verify_backup_code', {
      p_user_id: userId,
      p_code: code
    })

    if (backupCodeUsed) {
      // Backup code verified, disable MFA
      const { error: deleteError } = await supabase
        .from('mfa_secrets')
        .delete()
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Failed to disable MFA:', deleteError)
        return new Response(JSON.stringify({ error: 'Failed to disable MFA' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const response = new Response(JSON.stringify({
        success: true,
        message: 'MFA disabled successfully using backup code'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

      setSecurityHeaders(response)
      return response
    }

    // If not a backup code, verify TOTP
    // Import TOTP verification logic (simplified - should use shared code)
    const { data: verifyResult } = await supabase.functions.invoke('auth-mfa-verify', {
      body: { userId, code, isSetup: false }
    })

    if (verifyResult?.success) {
      // TOTP verified, disable MFA
      const { error: deleteError } = await supabase
        .from('mfa_secrets')
        .delete()
        .eq('user_id', userId)

      if (deleteError) {
        console.error('Failed to disable MFA:', deleteError)
        return new Response(JSON.stringify({ error: 'Failed to disable MFA' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const response = new Response(JSON.stringify({
        success: true,
        message: 'MFA disabled successfully'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

      setSecurityHeaders(response)
      return response
    }

    return new Response(JSON.stringify({ error: 'Invalid verification code' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('MFA disable error:', error)
    const response = new Response(JSON.stringify({ error: sanitizeError(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
    setSecurityHeaders(response)
    return response
  }
})
