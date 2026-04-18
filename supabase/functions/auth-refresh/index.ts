import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const supabaseUrl = Deno.env.get('SUPABASE_URL')!
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!

serve(async (req) => {
  try {
    const cookieHeader = req.headers.get('Cookie')
    const refreshToken = cookieHeader?.match(/sb-refresh-token=([^;]+)/)?.[1]

    if (!refreshToken) {
      return new Response(JSON.stringify({ error: 'No refresh token' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey)

    const { data, error } = await supabase.auth.refreshSession({
      refresh_token: refreshToken
    })

    if (error) {
      const response = new Response(JSON.stringify({ error: error.message }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      })
      // Clear invalid cookies
      response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
      return response
    }

    const response = new Response(JSON.stringify({ 
      success: true,
      user: { id: data.user.id, email: data.user.email }
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

    // Update cookies with new tokens
    response.headers.append('Set-Cookie', 
      `sb-access-token=${data.session.access_token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${data.session.expires_in}`
    )

    response.headers.append('Set-Cookie', 
      `sb-refresh-token=${data.session.refresh_token}; ` +
      `Path=/; ` +
      `HttpOnly; ` +
      `Secure; ` +
      `SameSite=Strict; ` +
      `Max-Age=${30 * 24 * 60 * 60}`
    )

    return response
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
