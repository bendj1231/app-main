/// <reference lib="deno.ns" />
/**
 * r2-presign-upload
 * Issues a short-lived presigned PUT URL for direct browser → Cloudflare R2 upload.
 * The browser encrypts the file client-side BEFORE calling this function.
 * This function never sees the plaintext file.
 *
 * Request body (JSON): { credentialType: 'license'|'medical'|'ntc'|'elp', fileExt: 'jpg'|'pdf'|etc, fileSizeBytes: number }
 * Response (JSON):     { uploadUrl: string, objectKey: string, expiresAt: number }
 */

import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const R2_ACCOUNT_ID  = Deno.env.get('R2_ACCOUNT_ID')!;
const R2_ACCESS_KEY  = Deno.env.get('R2_ACCESS_KEY_ID')!;
const R2_SECRET_KEY  = Deno.env.get('R2_SECRET_ACCESS_KEY')!;
const R2_BUCKET      = Deno.env.get('R2_BUCKET_NAME') || 'pilot-encrypted-vault';
const R2_ENDPOINT    = `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;
const PRESIGN_TTL    = 300; // 5 minutes

// AWS SigV4 presigned URL for R2 (S3-compatible)
async function hmac(key: ArrayBuffer, data: string): Promise<ArrayBuffer> {
  const k = await crypto.subtle.importKey('raw', key instanceof Uint8Array ? key.buffer : key, { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
  return crypto.subtle.sign('HMAC', k, new TextEncoder().encode(data));
}

async function getSigningKey(secretKey: string, date: string, region: string, service: string): Promise<ArrayBuffer> {
  const kDate    = await hmac(new TextEncoder().encode(`AWS4${secretKey}`), date);
  const kRegion  = await hmac(kDate, region);
  const kService = await hmac(kRegion, service);
  return hmac(kService, 'aws4_request');
}

function toHex(buf: ArrayBuffer): string {
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}

async function createPresignedPutUrl(objectKey: string, ttlSeconds: number): Promise<string> {
  const now        = new Date();
  const dateStr    = now.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const dateOnly   = dateStr.slice(0, 8);
  const region     = 'auto';
  const service    = 's3';
  const host       = `${R2_BUCKET}.${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`;

  const credScope  = `${dateOnly}/${region}/${service}/aws4_request`;
  const signedHeaders = 'host';

  const queryParams = new URLSearchParams({
    'X-Amz-Algorithm':     'AWS4-HMAC-SHA256',
    'X-Amz-Credential':    `${R2_ACCESS_KEY}/${credScope}`,
    'X-Amz-Date':          dateStr,
    'X-Amz-Expires':       String(ttlSeconds),
    'X-Amz-SignedHeaders': signedHeaders,
  });

  const canonicalUri     = `/${encodeURIComponent(objectKey).replace(/%2F/g, '/')}`;
  const canonicalQuery   = queryParams.toString();
  const canonicalHeaders = `host:${host}\n`;
  const payloadHash      = 'UNSIGNED-PAYLOAD';

  const canonicalRequest = [
    'PUT',
    canonicalUri,
    canonicalQuery,
    canonicalHeaders,
    signedHeaders,
    payloadHash,
  ].join('\n');

  const canonicalHash = toHex(await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonicalRequest)));
  const stringToSign  = ['AWS4-HMAC-SHA256', dateStr, credScope, canonicalHash].join('\n');
  const signingKey    = await getSigningKey(R2_SECRET_KEY, dateOnly, region, service);
  const signature     = toHex(await hmac(signingKey, stringToSign));

  queryParams.set('X-Amz-Signature', signature);
  return `https://${host}${canonicalUri}?${queryParams.toString()}`;
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
  const corsHeaders = getCorsHeaders(req);
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': getCorsHeaders(req)['Access-Control-Allow-Origin'], 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Auth
  const supabase = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
  const token = (req.headers.get('Authorization') || '').replace('Bearer ', '');
  const { data: { user }, error: authErr } = await supabase.auth.getUser(token);
  if (authErr || !user) return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });

  try {
    const { credentialType, fileExt, fileSizeBytes } = await req.json();
    if (!credentialType || !fileExt) return new Response(JSON.stringify({ error: 'Missing credentialType or fileExt' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    if (fileSizeBytes > 50 * 1024 * 1024) return new Response(JSON.stringify({ error: 'File too large — max 50MB' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Object key scoped to userId — no cross-user access possible
    const objectKey   = `${user.id}/${credentialType}/${Date.now()}.${fileExt}.enc`;
    const uploadUrl   = await createPresignedPutUrl(objectKey, PRESIGN_TTL);
    const expiresAt   = Date.now() + PRESIGN_TTL * 1000;

    return new Response(JSON.stringify({ uploadUrl, objectKey, expiresAt }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': getCorsHeaders(req)['Access-Control-Allow-Origin'] },
    });
  } catch (err: any) {
    console.error('r2-presign-upload error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
