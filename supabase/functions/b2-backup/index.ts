/**
 * b2-backup — Cold storage backup to Backblaze B2
 * Backs up Neon DB dump + Supabase pilot profile export
 * Endpoint: POST /b2-backup  { "target": "neon" | "supabase" | "all" }
 * Auth: service role only (called by cron or admin)
 */

const B2_KEY_ID     = Deno.env.get('B2_KEY_ID')!;
const B2_APP_KEY    = Deno.env.get('B2_APP_KEY')!;
const B2_BUCKET     = Deno.env.get('B2_BUCKET_NAME')!;
const B2_ENDPOINT   = Deno.env.get('B2_ENDPOINT')!;
const NEON_URL      = Deno.env.get('NEON_DATABASE_URL')!;
const SERVICE_KEY   = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const SUPABASE_URL  = Deno.env.get('SUPABASE_URL')!;

const CORS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
};

// ─── B2 S3-compatible upload ─────────────────────────────────────────────────

async function b2Upload(key: string, body: string, contentType = 'application/json'): Promise<string> {
  const url = `https://${B2_ENDPOINT}/${B2_BUCKET}/${key}`;
  const credentials = btoa(`${B2_KEY_ID}:${B2_APP_KEY}`);

  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Authorization': `Basic ${credentials}`,
      'Content-Type': contentType,
      'X-Bz-Server-Side-Encryption': 'AES256',
    },
    body,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`B2 upload failed [${res.status}]: ${err}`);
  }

  return url;
}

// ─── Backup: Supabase pilot profiles (non-PII summary) ───────────────────────

async function backupSupabaseProfiles(): Promise<{ count: number; key: string; url: string }> {
  const { createClient } = await import('https://esm.sh/@supabase/supabase-js@2');
  const supabase = createClient(SUPABASE_URL, SERVICE_KEY);

  const { data, error } = await supabase
    .from('profiles')
    .select('id, pilot_id, account_tier, total_flight_hours, last_flown, created_at, recognition_plus');

  if (error) throw new Error(`Supabase export failed: ${error.message}`);

  const timestamp = new Date().toISOString().slice(0, 10);
  const key = `supabase/profiles-${timestamp}.json`;
  const payload = JSON.stringify({ exported_at: new Date().toISOString(), count: data.length, records: data }, null, 2);
  const url = await b2Upload(key, payload);

  return { count: data.length, key, url };
}

// ─── Backup: Neon aviation_api_cache table ───────────────────────────────────

async function backupNeonCache(): Promise<{ count: number; key: string; url: string }> {
  const { Pool } = await import('https://deno.land/x/postgres@v0.17.0/mod.ts');
  const pool = new Pool(NEON_URL, 1, true);
  const conn = await pool.connect();

  try {
    const result = await conn.queryObject(
      `SELECT provider, airline_iata, aircraft_family, fleet_age, data_quality, fetched_at, expires_at
       FROM aviation_api_cache ORDER BY fetched_at DESC`,
    );

    const timestamp = new Date().toISOString().slice(0, 10);
    const key = `neon/aviation-cache-${timestamp}.json`;
    const payload = JSON.stringify({
      exported_at: new Date().toISOString(),
      count: result.rows.length,
      records: result.rows,
    }, null, 2);

    const url = await b2Upload(key, payload);
    return { count: result.rows.length, key, url };
  } finally {
    conn.release();
    await pool.end();
  }
}

// ─── Router ──────────────────────────────────────────────────────────────────

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  }

  const authHeader = req.headers.get('Authorization') || '';
  if (!authHeader.includes(SERVICE_KEY.slice(0, 20))) {
    return new Response(JSON.stringify({ error: 'Unauthorized — service role only' }), { status: 401, headers: CORS });
  }

  try {
    const body = await req.json().catch(() => ({ target: 'all' }));
    const target = body.target || 'all';
    const results: Record<string, any> = {};

    if (target === 'supabase' || target === 'all') {
      results.supabase = await backupSupabaseProfiles();
    }

    if (target === 'neon' || target === 'all') {
      results.neon = await backupNeonCache();
    }

    return new Response(JSON.stringify({
      success: true,
      backed_up_at: new Date().toISOString(),
      bucket: B2_BUCKET,
      results,
    }), { status: 200, headers: CORS });

  } catch (err: any) {
    console.error('b2-backup error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: CORS });
  }
});
