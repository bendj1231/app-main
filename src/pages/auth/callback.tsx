import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { extractCodeFromUrl } from '../../lib/google-oauth';
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
      try {
        // Extract authorization code from URL
        const code = searchParams.get('code');
        const error = searchParams.get('error');
        const errorDescription = searchParams.get('error_description');

        // Handle OAuth errors from Google
        if (error) {
          console.error('OAuth error:', error, errorDescription);
          setErrorMessage(errorDescription || error || 'Authentication failed');
          setStatus('error');
          return;
        }

        // Check if authorization code is present
        if (!code) {
          console.error('No authorization code found in URL');
          setErrorMessage('No authorization code received');
          setStatus('error');
          return;
        }

        console.log('Authorization code received:', code.substring(0, 10) + '...');

        // Call Agent 2's token exchange function
        const redirectUri = `${window.location.origin}/auth/callback`;
        const { data: sessionData } = await exchangeCodeForSupabaseSession(code, redirectUri);

        console.log('Supabase session created successfully:', sessionData.user?.id);

        // Success - redirect to home page
        setStatus('success');
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 500);

      } catch (err) {
        console.error('Error processing OAuth callback:', err);
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
            onClick={() => navigate('/', { replace: true })}
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
