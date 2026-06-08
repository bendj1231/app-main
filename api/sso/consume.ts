import type { VercelRequest, VercelResponse } from '@vercel/node';
import { createClient } from '@supabase/supabase-js';
import * as crypto from 'crypto';

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const COOKIE_SECRET = process.env.COOKIE_SECRET;

// CRITICAL: COOKIE_SECRET must NOT come from NEXT_PUBLIC_ (which would be public)
if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Supabase configuration missing for SSO consume function');
}

if (!COOKIE_SECRET) {
  throw new Error('COOKIE_SECRET environment variable must be set (not NEXT_PUBLIC_COOKIE_SECRET). Rotate if previously exposed.');
}

const supabase = createClient(SUPABASE_URL || '', SERVICE_ROLE_KEY || '');

// Very small helper to sign a payload using HMAC-SHA256 (no external deps)
function signPayload(payload: Record<string, any>, secret: string) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const body = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto.createHmac('sha256', secret).update(`${header}.${body}`).digest('base64url');
  return `${header}.${body}.${signature}`;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).send('Method Not Allowed');
    return;
  }

  const { access_token, redirect } = req.body || {};
  if (!access_token) {
    res.status(400).json({ error: 'missing access_token' });
    return;
  }

  try {
    // Validate token by asking Supabase for the user associated with it
    const { data: userData, error } = await supabase.auth.getUser(access_token);
    if (error || !userData?.user) {
      console.error('Supabase token validation failed', error);
      res.status(401).json({ error: 'invalid token' });
      return;
    }

    const user = userData.user;

    // Create a short-lived signed session token for pilotcareerpathways.com
    const payload = {
      sub: user.id,
      email: user.email || null,
      iat: Math.floor(Date.now() / 1000),
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7, // 7 days
    };

    const signed = signPayload(payload, COOKIE_SECRET);

    // Set HttpOnly, Secure cookie for pilotcareerpathways.com
    const cookieParts = [`pcp_sess=${signed}`];
    cookieParts.push('Path=/');
    cookieParts.push('HttpOnly');
    cookieParts.push('Secure');
    // cross-site navigation requires SameSite=None
    cookieParts.push('SameSite=None');
    // Domain should be your production domain — set to pilotcareerpathways.com
    cookieParts.push('Domain=pilotcareerpathways.com');
    cookieParts.push(`Max-Age=${60 * 60 * 24 * 7}`);

    res.setHeader('Set-Cookie', cookieParts.join('; '));

    // Validate redirect target — must be a relative path or allowlisted domain
    const REDIRECT_ALLOWLIST = ['/', '/dashboard', '/profile', '/onboarding'];
    const target = (() => {
      if (!redirect || typeof redirect !== 'string') return '/';
      
      // Only allow relative paths or allowlisted paths
      if (redirect.startsWith('/')) {
        const pathname = redirect.split('?')[0]; // strip query params
        if (REDIRECT_ALLOWLIST.includes(pathname)) {
          return redirect;
        }
      }
      
      // For any disallowed redirect, return root
      console.warn('Blocked open redirect attempt', { redirect, userAgent: req.headers.get('user-agent') });
      return '/';
    })();
    
    res.writeHead(302, { Location: target });
    res.end();
  } catch (err) {
    console.error('SSO consume error', err);
    res.status(500).json({ error: 'internal_error' });
  }
}
