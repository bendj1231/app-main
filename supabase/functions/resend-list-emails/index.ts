/// <reference lib="deno.ns" />
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { getCorsHeaders } from '../_shared/cors.ts';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { type, email } = await req.json()

    if (!type || !email) {
      return new Response(
        JSON.stringify({ error: 'Type and email are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

    // Verify auth token
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: authHeader } }
    })

    const { data: { user }, error: userError } = await supabase.auth.getUser()
    if (userError || !user) {
      return new Response(
        JSON.stringify({ error: 'Unauthorized' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 401 }
      )
    }

    const resendApiKey = Deno.env.get('RESEND_API_KEY')
    if (!resendApiKey) {
      return new Response(
        JSON.stringify({ error: 'Resend API key not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      )
    }

    // Call Resend API
    const resendUrl = type === 'received'
      ? 'https://api.resend.com/emails/receiving'
      : 'https://api.resend.com/emails'

    const res = await fetch(resendUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
      },
    })

    if (!res.ok) {
      const err = await res.text()
      console.error('Resend API error:', err)
      return new Response(
        JSON.stringify({ error: 'Resend API error', details: err }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: res.status }
      )
    }

    const data = await res.json()

    // Filter by user email
    let filtered = data.data || []
    if (type === 'sent') {
      filtered = filtered.filter((e: any) => e.from && e.from.includes(email))
    } else if (type === 'received') {
      filtered = filtered.filter((e: any) => e.to && e.to.includes(email))
    }

    return new Response(
      JSON.stringify({ emails: filtered }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    )
  } catch (err) {
    console.error('Edge function error:', err)
    return new Response(
      JSON.stringify({ error: err.message || 'Internal server error' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
    )
  }
})
