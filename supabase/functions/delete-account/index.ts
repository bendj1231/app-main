import "https://deno.land/std@0.224.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceRoleKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

Deno.serve(async (req: Request) => {
  // Handle CORS preflight request
  if (req.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'DELETE, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      },
    });
  }

  if (req.method !== 'DELETE') {
    return new Response('Method not allowed', { 
      status: 405,
      headers: {
        'Access-Control-Allow-Origin': '*',
      }
    });
  }

  try {
    const { userId } = await req.json();

    if (!userId) {
      return new Response('User ID is required', { 
        status: 400,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }

    // Create Supabase client with service role key for admin operations
    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    // Get profile data to check for profile image
    const { data: profileData } = await supabase
      .from('profiles')
      .select('profile_image_url')
      .eq('id', userId)
      .single();

    // Delete profile image from storage if it exists
    if (profileData?.profile_image_url) {
      try {
        // Extract file path from URL
        const url = new URL(profileData.profile_image_url);
        const pathParts = url.pathname.split('/object/public/');
        if (pathParts.length > 1) {
          const filePath = pathParts[1];
          const { error: storageError } = await supabase
            .storage
            .from('profile pics')
            .remove([filePath]);
          
          if (storageError) {
            console.error('Error deleting profile image from storage:', storageError);
          } else {
            console.log('Profile image deleted successfully from storage');
          }
        }
      } catch (error) {
        console.error('Error processing profile image deletion:', error);
      }
    }

    // Delete user's profile and related data
    await supabase.from('user_app_access').delete().eq('user_id', userId);
    await supabase.from('enrollments').delete().eq('user_id', userId);
    await supabase.from('profiles').delete().eq('id', userId);

    // Delete the auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(userId);

    if (deleteError) {
      console.error('Error deleting auth user:', deleteError);
      return new Response(JSON.stringify({ error: deleteError.message }), {
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  } catch (error) {
    console.error('Error in delete-account function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
      }
    });
  }
});
