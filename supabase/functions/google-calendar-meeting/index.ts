/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { getCorsHeaders } from '../_shared/cors.ts';

/**
 * Google Calendar Meeting Creator
 * Uses a Service Account to create Google Calendar events with auto-generated Meet links.
 *
 * Required env vars (set via Supabase secrets):
 *   GOOGLE_SERVICE_ACCOUNT_JSON — full service account JSON key content
 *
 * The service account must have Google Calendar API enabled and calendar sharing
 * (or domain-wide delegation for Workspace accounts).
 */

const GOOGLE_TOKEN_URI = 'https://oauth2.googleapis.com/token'
const GOOGLE_CALENDAR_BASE = 'https://www.googleapis.com/calendar/v3'
const CALENDAR_SCOPE = 'https://www.googleapis.com/auth/calendar'

// Decode base64url to Uint8Array
function base64urlDecode(str: string): Uint8Array {
  const base64 = str.replace(/-/g, '+').replace(/_/g, '/')
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=')
  const binary = atob(padded)
  const bytes = new Uint8Array(binary.length)
  for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i)
  return bytes
}

// Encode Uint8Array to base64url string
function base64urlEncode(buf: Uint8Array): string {
  const binary = Array.from(buf).map((b) => String.fromCharCode(b)).join('')
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '')
}

async function importPrivateKey(pem: string): Promise<CryptoKey> {
  const pemContents = pem
    .replace('-----BEGIN PRIVATE KEY-----', '')
    .replace('-----END PRIVATE KEY-----', '')
    .replace(/\s/g, '')
  const keyData = base64urlDecode(pemContents)
  return crypto.subtle.importKey(
    'pkcs8',
    keyData,
    { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
    false,
    ['sign']
  )
}

async function getAccessToken(serviceAccountJson: any): Promise<string> {
  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: serviceAccountJson.client_email,
    scope: CALENDAR_SCOPE,
    aud: GOOGLE_TOKEN_URI,
    iat: now,
    exp: now + 3600,
  }

  const header = { alg: 'RS256', typ: 'JWT' }
  const encodedHeader = base64urlEncode(new TextEncoder().encode(JSON.stringify(header)))
  const encodedClaim = base64urlEncode(new TextEncoder().encode(JSON.stringify(claim)))
  const signatureInput = `${encodedHeader}.${encodedClaim}`

  const privateKey = await importPrivateKey(serviceAccountJson.private_key)
  const signature = await crypto.subtle.sign(
    'RSASSA-PKCS1-v1_5',
    privateKey,
    new TextEncoder().encode(signatureInput)
  )
  const jwt = `${signatureInput}.${base64urlEncode(new Uint8Array(signature))}`

  const tokenRes = await fetch(GOOGLE_TOKEN_URI, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'urn:ietf:params:oauth:grant-type:jwt-bearer',
      assertion: jwt,
    }),
  })

  const tokenData = await tokenRes.json()
  if (!tokenRes.ok || !tokenData.access_token) {
    throw new Error(`Token exchange failed: ${JSON.stringify(tokenData)}`)
  }
  return tokenData.access_token as string
}

interface CreateMeetingRequest {
  title: string
  description?: string
  start_time: string   // ISO 8601
  end_time: string     // ISO 8601
  attendees?: string[] // emails
  calendar_id?: string // defaults to 'primary'
  time_zone?: string   // e.g. 'Asia/Dubai'
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req)
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  try {
    const rawJson = Deno.env.get('GOOGLE_SERVICE_ACCOUNT_JSON')
    if (!rawJson) {
      return new Response(
        JSON.stringify({ error: 'GOOGLE_SERVICE_ACCOUNT_JSON not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    let serviceAccount: any
    try {
      serviceAccount = JSON.parse(rawJson)
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid GOOGLE_SERVICE_ACCOUNT_JSON format' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const body: CreateMeetingRequest = await req.json()
    const {
      title,
      description = '',
      start_time,
      end_time,
      attendees = [],
      calendar_id = 'primary',
      time_zone = 'UTC',
    } = body

    if (!title || !start_time || !end_time) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: title, start_time, end_time' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const accessToken = await getAccessToken(serviceAccount)

    const eventPayload: any = {
      summary: title,
      description,
      start: { dateTime: start_time, timeZone: time_zone },
      end: { dateTime: end_time, timeZone: time_zone },
      attendees: attendees.map((email) => ({ email })),
      conferenceData: {
        createRequest: {
          requestId: crypto.randomUUID(),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
      reminders: {
        useDefault: false,
        overrides: [
          { method: 'email', minutes: 30 },
          { method: 'popup', minutes: 10 },
        ],
      },
    }

    const createRes = await fetch(
      `${GOOGLE_CALENDAR_BASE}/calendars/${encodeURIComponent(calendar_id)}/events?conferenceDataVersion=1`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventPayload),
      }
    )

    const eventData = await createRes.json()
    if (!createRes.ok) {
      return new Response(
        JSON.stringify({ error: 'Calendar API error', details: eventData }),
        { status: 502, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const meetLink = eventData.conferenceData?.entryPoints?.find(
      (ep: any) => ep.entryPointType === 'video'
    )?.uri || eventData.hangoutLink || ''

    return new Response(
      JSON.stringify({
        success: true,
        eventId: eventData.id,
        meetLink,
        htmlLink: eventData.htmlLink,
        start: eventData.start,
        end: eventData.end,
        attendees: eventData.attendees,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err)
    return new Response(
      JSON.stringify({ error: message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
