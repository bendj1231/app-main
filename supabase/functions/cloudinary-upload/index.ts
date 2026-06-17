/**
 * Cloudinary Upload Edge Function (Single Account)
 * 
 * Uses single Cloudinary account for all uploads:
 * - PROFILE: User profile photos (folder: profiles)
 * - CONTENT: Pathway images, airline logos (folder: content)
 * 
 * Required env vars:
 * - CLOUDINARY_CLOUD_NAME
 * - CLOUDINARY_API_KEY  
 * - CLOUDINARY_API_SECRET
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
    
    // Select Cloudinary account and folder based on type
    // Both profile and content use the same account with different folders
    const cloudName = Deno.env.get('CLOUDINARY_CLOUD_NAME') || 'dridtecu6';
    const apiKey = Deno.env.get('CLOUDINARY_API_KEY');
    const apiSecret = Deno.env.get('CLOUDINARY_API_SECRET');
    const folder = type === 'profile' ? 'profiles' : 'content';
    
    if (type !== 'profile' && type !== 'content') {
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
