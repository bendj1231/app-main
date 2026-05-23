/**
 * CORS headers for Supabase Edge Functions.
 * Restricts origin to pilotrecognition.com in production.
 * Allows localhost during development (when Origin header matches).
 */

const ALLOWED_ORIGINS = [
  'https://pilotrecognition.com',
  'https://www.pilotrecognition.com',
  'https://wallet.pilotrecognition.com',
];

export function getCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('Origin') || '';
  const isLocalhost =
    origin.startsWith('http://localhost:') ||
    origin.startsWith('http://127.0.0.1:');
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || isLocalhost;

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : ALLOWED_ORIGINS[0],
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-helio-signature',
    'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
    'Access-Control-Max-Age': '86400',
    'Vary': 'Origin',
  };
}
