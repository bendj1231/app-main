/**
 * SECURE Wallet Creation (replaces api/wallet/create.ts)
 * 
 * Requirements:
 * - TRUVERA_API_URL (e.g., https://api.truvera.com)
 * - TRUVERA_API_KEY (Truvera service account key)
 * 
 * Authentication:
 * - Requires Authorization: Bearer <supabase_jwt>
 * - Validates JWT server-side before accessing Truvera
 * - Never accepts pilotId from request body (always uses authenticated user ID)
 */

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'
import { Logger } from '../_shared/security-middleware.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
const TRUVERA_API_URL = Deno.env.get('TRUVERA_API_URL')
const TRUVERA_API_KEY = Deno.env.get('TRUVERA_API_KEY')

if (!TRUVERA_API_URL || !TRUVERA_API_KEY) {
  throw new Error('TRUVERA_API_URL and TRUVERA_API_KEY environment variables are required')
}

interface CreateWalletRequest {
  email: string;
  password: string;
  issuers?: Array<{
    name: string;
    did: string;
    approved: boolean;
  }>;
}

interface TruveraWalletResponse {
  walletId: string;
  did: string;
  createdAt: string;
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  const requestId = crypto.randomUUID()
  
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  try {
    // 1. AUTHENTICATION: Extract and validate JWT
    const authHeader = req.headers.get('Authorization')
    if (!authHeader?.startsWith('Bearer ')) {
      Logger.warn('Missing or invalid Authorization header', {}, requestId)
      return new Response(JSON.stringify({ error: 'Unauthorized: Missing or invalid Authorization header' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const token = authHeader.replace('Bearer ', '')
    const anonClient = createClient(supabaseUrl, supabaseAnonKey)
    const { data: { user }, error: authError } = await anonClient.auth.getUser(token)

    if (authError || !user?.id) {
      Logger.warn('JWT validation failed', { error: authError?.message }, requestId)
      return new Response(JSON.stringify({ error: 'Unauthorized: Invalid or expired token' }), {
        status: 401,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const authenticatedUserId = user.id
    Logger.info('Wallet creation request', { userId: authenticatedUserId }, requestId)

    // 2. INPUT VALIDATION
    const body = await req.json()
    const { email, password, issuers }: CreateWalletRequest = body

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!email || !emailRegex.test(email)) {
      Logger.warn('Invalid email', { email }, requestId)
      return new Response(JSON.stringify({ error: 'Invalid email address' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // Validate password
    if (!password || password.length < 12) {
      Logger.warn('Weak password', {}, requestId)
      return new Response(JSON.stringify({ 
        error: 'Password must be at least 12 characters. Use a strong passphrase.'
      }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    // 3. CREATE WALLET IN TRUVERA (using authenticated user ID, not request body)
    Logger.info('Creating Truvera wallet', { userId: authenticatedUserId }, requestId)

    const walletResponse = await fetch(`${TRUVERA_API_URL}/wallets`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${TRUVERA_API_KEY}`,
        // SECURITY: Use authenticated user ID, NOT from request body
        'X-Pilot-ID': authenticatedUserId,
      },
      body: JSON.stringify({
        email,
        password,
        metadata: {
          pilotId: authenticatedUserId, // Server-side derived
          platform: 'PilotRecognition',
          createdAt: new Date().toISOString()
        }
      })
    })

    if (!walletResponse.ok) {
      const errorData = await walletResponse.json().catch(() => ({}))
      Logger.error('Truvera wallet creation failed', new Error(JSON.stringify(errorData)), {}, requestId)
      return new Response(JSON.stringify({ 
        error: 'Failed to create Truvera wallet. Please try again or contact support.',
        details: process.env.DENO_ENV === 'development' ? errorData.message : undefined
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const walletData: TruveraWalletResponse = await walletResponse.json()

    // 4. CONFIGURE TRUSTED ISSUERS (optional)
    const approvedIssuers = issuers?.filter(i => i.approved) ?? []
    
    if (approvedIssuers.length > 0) {
      const issuersResponse = await fetch(
        `${TRUVERA_API_URL}/wallets/${walletData.walletId}/issuers`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${TRUVERA_API_KEY}`
          },
          body: JSON.stringify({
            issuers: approvedIssuers.map(issuer => ({
              did: issuer.did,
              name: issuer.name,
              approved: true,
              permissions: ['issue', 'view', 'verify'],
              approvedAt: new Date().toISOString()
            }))
          })
        }
      )

      if (!issuersResponse.ok) {
        Logger.warn('Failed to configure issuers (non-fatal)', { status: issuersResponse.status }, requestId)
        // Continue anyway — issuers can be added later
      }
    }

    // 5. AUDIT LOG
    Logger.info('Wallet created successfully', {
      userId: authenticatedUserId,
      walletId: walletData.walletId,
      issuers: approvedIssuers.length
    }, requestId)

    // 6. RETURN RESPONSE
    return new Response(JSON.stringify({
      success: true,
      walletId: walletData.walletId,
      did: walletData.did,
      createdAt: walletData.createdAt,
      issuersConfigured: approvedIssuers.length
    }), {
      status: 201,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })

  } catch (error) {
    Logger.error('Wallet creation error', error instanceof Error ? error : new Error(String(error)), {}, requestId)
    return new Response(JSON.stringify({
      error: 'Internal server error',
      requestId
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
