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
  mfaVerify: { maxRequests: 10, windowMs: 15 * 60 * 1000 }, // 10 requests per 15 minutes
}

// Base32 decode
function base32Decode(str: string): Uint8Array {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  const lookup = new Map<string, number>()
  for (let i = 0; i < alphabet.length; i++) {
    lookup.set(alphabet[i], i)
  }

  let bits = 0
  let value = 0
  const output: number[] = []

  for (const char of str.toUpperCase()) {
    const charValue = lookup.get(char)
    if (charValue === undefined) continue

    value = (value << 5) | charValue
    bits += 5

    if (bits >= 8) {
      output.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return new Uint8Array(output)
}

// Verify TOTP code
async function verifyTOTP(secret: string, code: string, window: number = 1): Promise<boolean> {
  const key = base32Decode(secret)
  const timeStep = 30 // 30 second intervals
  const currentTime = Math.floor(Date.now() / 1000 / timeStep)

  for (let offset = -window; offset <= window; offset++) {
    const counter = currentTime + offset
    const counterBytes = new Uint8Array(8)
    const view = new DataView(counterBytes.buffer)
    view.setUint32(0, 0)
    view.setUint32(4, counter)

    // HMAC-SHA1 - copy key to proper ArrayBuffer
    const keyBuffer = new ArrayBuffer(key.length)
    new Uint8Array(keyBuffer).set(key)
    
    const hmacKey = await crypto.subtle.importKey(
      'raw',
      keyBuffer,
      { name: 'HMAC', hash: 'SHA-1' },
      false,
      ['sign']
    )

    const signature = await crypto.subtle.sign(
      'HMAC',
      hmacKey,
      counterBytes.buffer
    )

    const hmac = new Uint8Array(signature)
    const offsetIndex = hmac[hmac.length - 1] & 0x0f
    const binary = ((hmac[offsetIndex] & 0x7f) << 24) |
                  ((hmac[offsetIndex + 1] & 0xff) << 16) |
                  ((hmac[offsetIndex + 2] & 0xff) << 8) |
                  (hmac[offsetIndex + 3] & 0xff)

    const otp = binary % 1000000
    const otpStr = otp.toString().padStart(6, '0')

    if (otpStr === code) {
      return true
    }
  }

  return false
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
    console.error('MFA verify error:', error.message)
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

    const { userId, code, isSetup = false } = await req.json()

    if (!userId || !code) {
      return new Response(JSON.stringify({ error: 'User ID and code required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimitResult = checkRateLimit(`mfa-verify:${clientId}`, RATE_LIMIT_CONFIGS.mfaVerify)

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many verification attempts. Please try again later.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '900' }
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

    // Verify TOTP code
    const isValid = await verifyTOTP(mfaSecret.secret, code)

    if (!isValid) {
      return new Response(JSON.stringify({ error: 'Invalid code' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // If this is setup verification, enable MFA
    if (isSetup) {
      const { error: updateError } = await supabase
        .from('mfa_secrets')
        .update({
          is_enabled: true,
          verified_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (updateError) {
        console.error('Failed to enable MFA:', updateError)
        return new Response(JSON.stringify({ error: 'Failed to enable MFA' }), {
          status: 500,
          headers: { 'Content-Type': 'application/json' }
        })
      }

      // Generate backup codes
      const { data: backupCodes } = await supabase.rpc('generate_backup_codes', {
        p_user_id: userId,
        p_count: 10
      })

      const response = new Response(JSON.stringify({
        success: true,
        message: 'MFA enabled successfully',
        backupCodes: backupCodes
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      })

      setSecurityHeaders(response)
      return response
    }

    // Regular verification (during login)
    const response = new Response(JSON.stringify({
      success: true,
      message: 'MFA verified successfully'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

    setSecurityHeaders(response)
    return response

  } catch (error) {
    console.error('MFA verify error:', error)
    const response = new Response(JSON.stringify({ error: sanitizeError(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
    setSecurityHeaders(response)
    return response
  }
})
