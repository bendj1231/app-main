/**
 * Cloudinary Upload Edge Function (Multi-Account)
 * 
 * Supports multiple Cloudinary accounts:
 * - PROFILE: User profile photos (account: drcfmairy)
 * - CONTENT: Pathway images, airline logos (can be separate account)
 * 
 * Required env vars:
 * Profile Uploads:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY  
 * - CLOUDINARY_API_SECRET
 * 
 * Content Uploads (optional - can use same account):
 * - CONTENT_CLOUDINARY_CLOUD_NAME
 * - CONTENT_CLOUDINARY_API_KEY
 * - CONTENT_CLOUDINARY_API_SECRET
 */

/// <reference lib="deno.ns" />
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';
import { getCorsHeaders } from '../_shared/cors.ts';

const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY') || '';

// Cloudinary signature generation
async function generateSignature(params: Record<string, string>, apiSecret: string): Promise<string> {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${key}=${params[key]}`)
    .join('&');
  
  const encoder = new TextEncoder();
  const data = encoder.encode(paramString + apiSecret);
  const hashBuffer = await crypto.subtle.digest('SHA-1', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Authenticate caller
    const authHeader = req.headers.get('Authorization') || '';
    const jwt = authHeader.replace(/^Bearer\s+/i, '');
    if (!jwt) {
      return new Response(JSON.stringify({ error: 'Unauthorized' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey, {
      global: { headers: { Authorization: `Bearer ${jwt}` } }
    });
    const { data: { user }, error: authErr } = await supabaseAuth.auth.getUser();
    if (authErr || !user) {
      return new Response(JSON.stringify({ error: 'Invalid or expired token' }), {
        status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    // Parse request
    const { file, userId, type = 'profile' } = await req.json();

    // Ensure user can only upload for themselves
    const callerId = user.id;
    if (userId !== callerId) {
      return new Response(JSON.stringify({ error: 'Forbidden: can only upload for own account' }), {
        status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Select Cloudinary account based on type
    let cloudName: string | undefined;
    let apiKey: string | undefined;
    let apiSecret: string | undefined;
    let folder: string;
    
    if (type === 'profile') {
      // Profile images - user uploads
      cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME') || 'drcfmairy';
      apiKey = Deno.env.get('CLOUDINARY_API_KEY');
      apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
      folder = 'profiles';
    } else if (type === 'content') {
      // Content images - pathways, logos, etc.
      // MUST use different account from drcfmairy (profiles only)
      cloudName = Deno.env.get('CONTENT_CLOUDINARY_CLOUD_NAME');
      apiKey = Deno.env.get('CONTENT_CLOUDINARY_API_KEY');
      apiSecret = Deno.env.get('CONTENT_CLOUDINARY_API_SECRET');
      folder = 'content';
      
      // Prevent using drcfmairy for content
      if (!cloudName || cloudName === 'drcfmairy') {
        return new Response(
          JSON.stringify({ error: 'Content uploads require separate Cloudinary account. drcfmairy is reserved for profile images only.' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
    } else {
      return new Response(
        JSON.stringify({ error: 'Invalid type. Use "profile" or "content"' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!cloudName || !apiKey || !apiSecret) {
      return new Response(
        JSON.stringify({ error: `Cloudinary not configured for type: ${type}` }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!file || !userId) {
      return new Response(
        JSON.stringify({ error: 'Missing file or userId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate timestamp and signature
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const publicId = `${folder}/${type}_${userId}_${timestamp}`;
    
    const params: Record<string, string> = {
      timestamp,
      public_id: publicId,
    };
    
    const signature = await generateSignature(params, apiSecret);

    // Prepare upload to Cloudinary
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', apiKey);
    formData.append('timestamp', timestamp);
    formData.append('signature', signature);
    formData.append('public_id', publicId);

    // Upload to Cloudinary
    const uploadResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!uploadResponse.ok) {
      const error = await uploadResponse.text();
      return new Response(
        JSON.stringify({ error: 'Cloudinary upload failed', details: error }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const result = await uploadResponse.json();

    return new Response(
      JSON.stringify({
        success: true,
        url: result.secure_url,
        publicId: result.public_id,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('[cloudinary-upload] Error:', error);
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
