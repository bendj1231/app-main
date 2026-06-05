import React, { useEffect, useState } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { exchangeCodeForSupabaseSession } from '../../lib/supabase-oauth';

/**
 * OAuth Callback Handler
 * 
 * This page handles the redirect from Google OAuth.
 * It extracts the authorization code from the URL parameters,
 * processes the token exchange, and redirects to the home page.
 */
const OAuthCallback: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [errorMessage, setErrorMessage] = useState<string>('');

  useEffect(() => {
    const handleOAuthCallback = async () => {
      const timestamp = new Date().toISOString();

      try {
        // Extract authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');


        // Handle OAuth errors from Google
        if (error) {
          console.error(`[${timestamp}] [OAUTH CALLBACK ERROR] OAuth error from Google:`, error, errorDescription);
          setErrorMessage(errorDescription || error || 'Authentication failed');
          setStatus('error');
          return;
        }

        // Check if authorization code is present
        if (!code) {
          console.error(`[${timestamp}] [OAUTH CALLBACK ERROR] No authorization code found in URL`);
          setErrorMessage('No authorization code received');
          setStatus('error');
          return;
        }


        // Set OAuth session flag to skip CSRF validation
        sessionStorage.setItem('oauth_session', 'true');

        // Call Agent 2's token exchange function
        const redirectUri = `${window.location.origin}/auth/callback`;

        const { data: sessionData } = await exchangeCodeForSupabaseSession(code, redirectUri);

        const sessionUser = sessionData.user as { id: string; email: string; user_metadata?: { full_name?: string } } | undefined;

        // Create user profile if it doesn't exist (non-critical)
        try {
            const { supabase } = await import('../../lib/supabase');
            const { data: existingProfile, error: profileCheckError } = await supabase
                .from('profiles')
                .select('id')
                .eq('id', sessionUser?.id)
                .single();

            if (profileCheckError && profileCheckError.code !== 'PGRST116') {
                console.warn(`[${timestamp}] [OAUTH CALLBACK] Profile check error:`, profileCheckError);
            }

            if (!existingProfile) {
                const { error: profileCreateError } = await supabase
                    .from('profiles')
                    .insert({
                        id: sessionUser?.id,
                        email: sessionUser?.email,
                        display_name: sessionUser?.user_metadata?.full_name || sessionUser?.email?.split('@')[0],
                        full_name: sessionUser?.user_metadata?.full_name,
                        role: 'mentee',
                        status: 'active',
                        created_at: new Date().toISOString(),
                        updated_at: new Date().toISOString()
                    });

                if (profileCreateError) {
                    console.error(`[${timestamp}] [OAUTH CALLBACK] Profile creation error:`, profileCreateError);
                } else {
                }
            } else {
            }
        } catch (profileError) {
            console.error(`[${timestamp}] [OAUTH CALLBACK] Profile creation failed (non-critical):`, profileError);
            // Don't fail the entire OAuth flow if profile creation fails
        }

        // Success - redirect to home page
        setStatus('success');
        setTimeout(() => {
          safeRedirect(window.location.origin);
        }, 500);

      } catch (err) {
        const errorTimestamp = new Date().toISOString();
        console.error(`[${errorTimestamp}] [OAUTH CALLBACK ERROR] Error processing OAuth callback:`, err instanceof Error ? err.message : String(err));
        setErrorMessage(err instanceof Error ? err.message : 'An unexpected error occurred');
        setStatus('error');
      }
    };

    handleOAuthCallback();
  }, [searchParams, navigate]);

  // Loading state
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-blue-500 border-t-transparent mb-4"></div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Processing Authentication
          </h2>
          <p className="text-slate-600">
            Please wait while we complete your sign-in...
          </p>
        </div>
      </div>
    );
  }

  // Error state
  if (status === 'error') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center max-w-md mx-auto p-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-red-100 mb-4">
            <svg
              className="w-8 h-8 text-red-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Authentication Failed
          </h2>
          <p className="text-slate-600 mb-6">
            {errorMessage}
          </p>
          <button
            onClick={() => safeRedirect('/')}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 transition-colors"
          >
            Return to Home
          </button>
        </div>
      </div>
    );
  }

  // Success state (brief display before redirect)
  if (status === 'success') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
            <svg
              className="w-8 h-8 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-slate-800 mb-2">
            Authentication Successful
          </h2>
          <p className="text-slate-600">
            Redirecting you to the home page...
          </p>
        </div>
      </div>
    );
  }

  return null;
};

export default OAuthCallback;
