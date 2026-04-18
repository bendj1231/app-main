import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'

serve(async (req) => {
  try {
    const response = new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })

    // Clear cookies
    response.headers.append('Set-Cookie', 'sb-access-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')
    response.headers.append('Set-Cookie', 'sb-refresh-token=; Path=/; HttpOnly; Secure; SameSite=Strict; Max-Age=0')

    return response
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
})
