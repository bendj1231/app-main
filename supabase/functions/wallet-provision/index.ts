import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const PILOT_WALLET_API = Deno.env.get('PILOT_WALLET_API')

if (!PILOT_WALLET_API) {
  throw new Error('PILOT_WALLET_API environment variable is required')
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    // Verify the calling user's JWT
    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await createClient(supabaseUrl, Deno.env.get('SUPABASE_ANON_KEY')!)
      .auth.getUser(token)

    if (authError || !user) {
      return new Response(JSON.stringify({ error: 'Invalid token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      })
    }

    const { profile_id, auth0_id, email, name } = await req.json()

    // Check if wallet already provisioned
    const { data: existing } = await supabase
      .from('profiles')
      .select('wallet_id')
      .eq('id', profile_id)
      .single()

    if (existing?.wallet_id) {
      return new Response(JSON.stringify({
        success: true,
        walletId: existing.wallet_id,
        alreadyExists: true
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Deterministic password from auth0_id — never stored in plain text
    const walletPassword = `PR-${auth0_id.replace(/\|/g, '-')}-${profile_id.slice(0, 8)}`
    const walletEmail = `${profile_id}@wallet.pilotrecognition.com`
    const walletName = name || `Pilot-${profile_id.slice(0, 8)}`

    // Step 1: Register with Pilot Wallet API
    const regRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', name: walletName, email: walletEmail, password: walletPassword }),
    })

    if (!regRes.ok && regRes.status !== 409) {
      const err = await regRes.text()
      throw new Error(`Wallet register failed: ${regRes.status} — ${err}`)
    }

    // Step 2: Login to get token
    const loginRes = await fetch(`${PILOT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email: walletEmail, password: walletPassword }),
    })
    if (!loginRes.ok) throw new Error(`Wallet login failed: ${loginRes.status}`)
    const loginData = await loginRes.json()
    const walletToken = loginData.token

    // Step 3: Get wallet ID
    const walletsRes = await fetch(`${PILOT_WALLET_API}/wallet-api/wallet/accounts/wallets`, {
      headers: { 'Authorization': `Bearer ${walletToken}` },
    })
    if (!walletsRes.ok) throw new Error(`Get wallets failed: ${walletsRes.status}`)
    const walletsData = await walletsRes.json()
    const walletId = walletsData.wallets?.[0]?.id
    if (!walletId) throw new Error('No wallet returned after registration')

    // Step 4: Store in Supabase profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        wallet_id: walletId,
        wallet_email: walletEmail,
      })
      .eq('id', profile_id)

    if (updateError) throw new Error(`Supabase update failed: ${updateError.message}`)

    console.log(`[wallet-provision] Wallet created for profile ${profile_id}: ${walletId}`)

    return new Response(JSON.stringify({
      success: true,
      walletId,
      walletEmail,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[wallet-provision] Error:', message)
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
