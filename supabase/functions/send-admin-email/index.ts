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
    const { recipient, subject, body, from_name, from_email, email_id } = await req.json()

    if (!recipient || !subject || !body) {
      return new Response(
        JSON.stringify({ error: 'Recipient, subject, and body are required' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      )
    }

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

    const from = from_email || 'noreply@pilotrecognition.com'
    const fromName = from_name || 'Pilot Recognition'

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${resendApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: `"${fromName}" <${from}>`,
        to: [recipient],
        subject,
        html: body,
      }),
    })

    const result = await res.json()
    if (!res.ok) {
      console.error('Resend send error:', result)
      return new Response(
        JSON.stringify({ error: 'Resend API error', details: result }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: res.status }
      )
    }

    // Update admin_emails table if email_id provided
    if (email_id) {
      try {
        const { error: updateError } = await supabase
          .from('admin_emails')
          .update({
            status: 'sent',
            resend_message_id: result.id,
            sent_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('id', email_id)
        if (updateError) console.error('Failed to update admin_emails:', updateError)
      } catch (e) {
        console.error('Error updating admin_emails:', e)
      }
    }

    return new Response(
      JSON.stringify({ message_id: result.id, status: 'sent' }),
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
