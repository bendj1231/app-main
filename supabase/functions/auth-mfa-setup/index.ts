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
  mfaSetup: { maxRequests: 5, windowMs: 60 * 60 * 1000 }, // 5 requests per hour
}

// Generate TOTP secret (Base32 encoded)
function generateTOTPSecret(): string {
  const array = new Uint8Array(20)
  crypto.getRandomValues(array)
  return base32Encode(array)
}

// Base32 encoding
function base32Encode(data: Uint8Array): string {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < data.length; i++) {
    value = (value << 8) | data[i]
    bits += 8

    while (bits >= 5) {
      output += alphabet[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += alphabet[(value << (5 - bits)) & 31]
  }

  return output
}

// Generate QR code URL
function generateQRCodeURL(secret: string, email: string, issuer: string = 'PilotPortal'): string {
  const encodedSecret = encodeURIComponent(secret)
  const encodedIssuer = encodeURIComponent(issuer)
  const encodedEmail = encodeURIComponent(email)
  return `otpauth://totp/${encodedIssuer}:${encodedEmail}?secret=${encodedSecret}&issuer=${encodedIssuer}`
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
    console.error('MFA setup error:', error.message)
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

    const { userId, method = 'totp', phoneNumber } = await req.json()

    if (!userId) {
      return new Response(JSON.stringify({ error: 'User ID required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Rate limiting
    const clientId = getClientIdentifier(req)
    const rateLimitResult = checkRateLimit(`mfa-setup:${clientId}`, RATE_LIMIT_CONFIGS.mfaSetup)

    if (!rateLimitResult.allowed) {
      return new Response(JSON.stringify({ 
        error: 'Too many MFA setup attempts. Please try again later.' 
      }), {
        status: 429,
        headers: { 'Content-Type': 'application/json', 'Retry-After': '3600' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Check if MFA is already enabled for this user
    const { data: existingSecret } = await supabase
      .from('mfa_secrets')
      .select('*')
      .eq('user_id', userId)
      .single()

    if (existingSecret && existingSecret.is_enabled) {
      return new Response(JSON.stringify({ error: 'MFA already enabled for this user' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    // Generate TOTP secret
    const secret = generateTOTPSecret()

    // Get user email for QR code
    const { data: { user } } = await supabase.auth.admin.getUserById(userId)
    const email = user?.email || 'unknown'

    // Generate QR code URL
    const qrCodeURL = generateQRCodeURL(secret, email)

    // Store the secret (encrypted in production, plain for now - should use pgcrypto)
    const { error: insertError } = await supabase
      .from('mfa_secrets')
      .upsert({
        user_id: userId,
        secret: secret, // TODO: Encrypt this using pgcrypto in production
        method: method,
        phone_number: phoneNumber || null,
        is_enabled: false,
        verified_at: null
      })

    if (insertError) {
      console.error('Failed to store MFA secret:', insertError)
      return new Response(JSON.stringify({ error: 'Failed to setup MFA' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const response = new Response(JSON.stringify({
      success: true,
      secret: secret,
      qrCodeURL: qrCodeURL,
      message: 'Scan the QR code with your authenticator app, then verify the code to enable MFA'
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

    setSecurityHeaders(response)
    return response

  } catch (error) {
    console.error('MFA setup error:', error)
    const response = new Response(JSON.stringify({ error: sanitizeError(error) }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
    setSecurityHeaders(response)
    return response
  }
})
