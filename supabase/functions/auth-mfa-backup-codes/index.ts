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
  mfaBackupCodes: { maxRequests: 3, windowMs: 24 * 60 * 60 * 1000 }, // 3 requests per day
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
    console.error('MFA backup codes error:', error.message)
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

    const { userId, action = 'generate', codeCount = 10 } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'generate' && (codeCount < 1 || codeCount > 20)) {
      return new Response(JSON.stringify({ error: 'Code count must be between 1 and 20' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimitResult = checkRateLimit(`mfa-backup-codes:${clientId}`, RATE_LIMIT_CONFIGS.mfaBackupCodes)

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many backup code generation attempts. Please try again later.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '86400' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if MFA is enabled for this user
    const { data: mfaSecret } = await supabase
      .from('mfa_secrets')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (!mfaSecret || !mfaSecret.is_enabled) {
      return new Response(JSON.stringify({ error: 'MFA must be enabled to generate backup codes' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    if (action === 'generate') {
      // Generate new backup codes
      const { data: backupCodes, error: generateError } = await supabase.rpc('generate_backup_codes', {
        p_user_id: userId,
        p_count: codeCount
      })

      if (generateError) {
        console.error('Failed to generate backup codes:', generateError)
        return new Response(JSON.stringify({ error: 'Failed to generate backup codes' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const response = new Response(JSON.stringify({
        success: true,
        message: 'Backup codes generated successfully. Save these codes in a secure location.',
        backupCodes: backupCodes,
        warning: 'These codes will not be shown again. Save them now.'
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

      setSecurityHeaders(response)
      return response
    }

    if (action === 'list') {
      // List remaining unused backup codes (for user reference)
      const { data: backupCodes, error: listError } = await supabase
        .from('mfa_backup_codes')
        .select('created_at')
        .eq('user_id', userId)
        .eq('is_used', false)

      if (listError) {
        console.error('Failed to list backup codes:', listError)
        return new Response(JSON.stringify({ error: 'Failed to retrieve backup code information' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      const response = new Response(JSON.stringify({
        success: true,
        remainingCount: backupCodes.length,
        message: `${backupCodes.length} unused backup codes remaining`
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

      setSecurityHeaders(response)
      return response
    }

    return new Response(JSON.stringify({ error: 'Invalid action. Use "generate" or "list"' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    })

  } catch (error) {
    console.error('MFA backup codes error:', error)
    const response = new Response(JSON.stringify({ error: sanitizeError(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
    setSecurityHeaders(response)
    return response
  }
})
