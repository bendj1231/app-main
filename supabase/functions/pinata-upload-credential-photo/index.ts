import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const PINATA_UPLOAD_URL = 'https://uploads.pinata.cloud/v3/files';
const PINATA_GATEWAY    = Deno.env.get('PINATA_GATEWAY') || 'ipfs.io';

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } });
  }
  if (req.method !== 'POST') return new Response('Method not allowed', { status: 405 });

  // Auth — require valid Supabase JWT
  const authHeader = req.headers.get('Authorization') || '';
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!,
  );
  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return new Response(JSON.stringify({ error: 'Unauthorized' }), { status: 401, headers: { 'Content-Type': 'application/json' } });
  }

  const jwt = Deno.env.get('PINATA_JWT');
  if (!jwt) return new Response(JSON.stringify({ error: 'PINATA_JWT not configured' }), { status: 500, headers: { 'Content-Type': 'application/json' } });

  try {
    // Expect multipart/form-data with: file (the image), credentialType (license|medical|ntc|elp)
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const credentialType = (formData.get('credentialType') as string) || 'credential';

    if (!file) return new Response(JSON.stringify({ error: 'No file provided' }), { status: 400, headers: { 'Content-Type': 'application/json' } });

    // Validate file type — images only
    if (!file.type.startsWith('image/') && file.type !== 'application/pdf') {
      return new Response(JSON.stringify({ error: 'Only images and PDFs are accepted' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    // Max 10MB
    if (file.size > 10 * 1024 * 1024) {
      return new Response(JSON.stringify({ error: 'File too large — max 10MB' }), { status: 400, headers: { 'Content-Type': 'application/json' } });
    }

    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `credential-${credentialType}-${user.id}-${Date.now()}.${ext}`;

    // Upload to Pinata v3 Files API
    const pinataForm = new FormData();
    pinataForm.append('file', file, filename);
    pinataForm.append('name', filename);
    pinataForm.append('network', 'public');

    const pinataRes = await fetch(PINATA_UPLOAD_URL, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jwt}` },
      body: pinataForm,
    });

    if (!pinataRes.ok) {
      const errText = await pinataRes.text();
      console.error('Pinata upload error:', errText);
      return new Response(JSON.stringify({ error: `Pinata upload failed: ${errText}` }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const pinataData = await pinataRes.json();
    const cid = pinataData?.data?.cid;
    if (!cid) {
      return new Response(JSON.stringify({ error: 'No CID returned from Pinata', raw: pinataData }), { status: 502, headers: { 'Content-Type': 'application/json' } });
    }

    const gatewayUrl = `https://${PINATA_GATEWAY}/ipfs/${cid}`;
    const ipfsUrl    = `https://ipfs.io/ipfs/${cid}`;

    // Store photo URL on profiles or pilot_credentials
    const photoField = `${credentialType}_photo_url`;
    await supabase.from('profiles').update({ [photoField]: gatewayUrl }).eq('id', user.id);

    return new Response(JSON.stringify({ cid, gatewayUrl, ipfsUrl, filename }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    });
  } catch (err: any) {
    console.error('pinata-upload-credential-photo error:', err);
    return new Response(JSON.stringify({ error: err.message }), { status: 500, headers: { 'Content-Type': 'application/json' } });
  }
});
