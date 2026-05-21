import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const WALT_WALLET_API = Deno.env.get('WALT_WALLET_API') || 'http://localhost:7001'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
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
      .select('walt_wallet_id')
      .eq('id', profile_id)
      .single()

    if (existing?.walt_wallet_id) {
      return new Response(JSON.stringify({
        success: true,
        walletId: existing.walt_wallet_id,
        alreadyExists: true
      }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })
    }

    // Deterministic password from auth0_id — never stored in plain text
    const waltPassword = `PR-${auth0_id.replace(/\|/g, '-')}-${profile_id.slice(0, 8)}`
    const waltEmail = `${profile_id}@wallet.pilotrecognition.com`
    const waltName = name || `Pilot-${profile_id.slice(0, 8)}`

    // Step 1: Register with walt.id Wallet API
    const regRes = await fetch(`${WALT_WALLET_API}/wallet-api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', name: waltName, email: waltEmail, password: waltPassword }),
    })

    if (!regRes.ok && regRes.status !== 409) {
      const err = await regRes.text()
      throw new Error(`Walt register failed: ${regRes.status} — ${err}`)
    }

    // Step 2: Login to get token
    const loginRes = await fetch(`${WALT_WALLET_API}/wallet-api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type: 'email', email: waltEmail, password: waltPassword }),
    })
    if (!loginRes.ok) throw new Error(`Walt login failed: ${loginRes.status}`)
    const loginData = await loginRes.json()
    const waltToken = loginData.token

    // Step 3: Get wallet ID
    const walletsRes = await fetch(`${WALT_WALLET_API}/wallet-api/wallet/accounts/wallets`, {
      headers: { 'Authorization': `Bearer ${waltToken}` },
    })
    if (!walletsRes.ok) throw new Error(`Get wallets failed: ${walletsRes.status}`)
    const walletsData = await walletsRes.json()
    const walletId = walletsData.wallets?.[0]?.id
    if (!walletId) throw new Error('No wallet returned after registration')

    // Step 4: Store in Supabase profiles
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        walt_wallet_id: walletId,
        walt_account_email: waltEmail,
      })
      .eq('id', profile_id)

    if (updateError) throw new Error(`Supabase update failed: ${updateError.message}`)

    console.log(`[wallet-provision] Wallet created for profile ${profile_id}: ${walletId}`)

    return new Response(JSON.stringify({
      success: true,
      walletId,
      waltEmail,
    }), { headers: { ...corsHeaders, 'Content-Type': 'application/json' } })

  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    console.error('[wallet-provision] Error:', message)
    return new Response(JSON.stringify({ success: false, error: message }), {
      status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }
})
