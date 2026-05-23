import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';

interface FlightDeckLoginPageProps {
    onNavigate: (page: string) => void;
}

export const FlightDeckLoginPage: React.FC<FlightDeckLoginPageProps> = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated } = useAuth0();
    const [email, setEmail] = useState('');
    const [emailSubmitting, setEmailSubmitting] = useState(false);
    const [hasPasskey] = useState(true);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (isAuthenticated) {
            navigate('/platform');
        }
    }, [isAuthenticated, navigate]);

    const handleEmailContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setEmailSubmitting(true);
        setError('');
        // Store email so verify page can use it before Auth0
        localStorage.setItem('pr_last_email', email.trim());
        sessionStorage.setItem('fd_pending_email', email.trim());
        sessionStorage.setItem('fd_pending_connection', email.trim().toLowerCase().endsWith('@gmail.com') ? 'google-oauth2' : 'email');
        navigate('/flight-deck-verify');
    };

    const handleGoogleLogin = () => {
        // Google goes straight to Auth0 (no pre-verify needed, passkey handled post-auth)
        loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
            appState: { returnTo: '/flight-deck-verify' },
        });
    };

    const handlePasskeyLogin = async () => {
        setPasskeyLoading(true);
        setError('');
        try {
            if (!window.PublicKeyCredential) throw new Error('WebAuthn not supported');

            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            // Empty allowCredentials = browser/iCloud Keychain auto-discovers all passkeys for this origin
            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge,
                    timeout: 120000,
                    userVerification: 'required',
                    allowCredentials: [],
                },
            }) as PublicKeyCredential | null;

            if (!assertion) throw new Error('No credential returned');

            // Try to extract the user handle (email) stored in the passkey
            let loginHint = '';
            try {
                const response = assertion.response as AuthenticatorAssertionResponse;
                if (response.userHandle) {
                    loginHint = new TextDecoder().decode(response.userHandle);
                }
            } catch { /* ignore — login_hint is optional */ }

            // Also check localStorage for a previously stored email
            if (!loginHint) {
                loginHint = localStorage.getItem('pr_last_email') || '';
            }

            // Passkey confirmed — passkey IS the verification, go straight to Auth0
            localStorage.setItem('pr_passkey_registered', 'true');
            await loginWithRedirect({
                authorizationParams: {
                    redirect_uri: `${window.location.origin}/auth/callback`,
                    ...(loginHint ? { login_hint: loginHint } : {}),
                },
                appState: { returnTo: '/platform' },
            });
        } catch (err: any) {
            if (err?.name !== 'NotAllowedError') {
                setError('Passkey sign-in failed. Try Google or email instead.');
            }
        } finally {
            setPasskeyLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
            position: 'relative',
            overflow: 'hidden',
        }}>
            {/* Same MeshGradient shader as platform */}
            <div style={{ position: 'fixed', inset: 0, zIndex: 0 }}>
                <MeshGradient
                    className="w-full h-full"
                    colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                    speed={0.4}
                />
                <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(100,116,139,0.2), rgba(15,23,42,0.35), rgba(2,6,23,0.6))' }} />
                <div style={{ position: 'absolute', inset: 0, backdropFilter: 'blur(3px)', background: 'rgba(15,23,42,0.1)' }} />
                <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
            </div>

            {/* Logo + title */}
            <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
                    <span style={{ color: '#ffffff' }}>pilot</span>
                    <span style={{ color: '#ef4444' }}>recognition</span>
                    <span style={{ color: '#ffffff' }}>.com</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>Flight Deck</p>
            </div>

            {/* Glassy card */}
            <div style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: 16,
                padding: '32px 28px',
                width: '100%',
                maxWidth: 420,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 1,
            }}>
                {error && (
                    <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: 6, padding: '10px 14px', marginBottom: 16, color: '#dc2626', fontSize: 13 }}>
                        {error}
                    </div>
                )}

                {/* Email form */}
                <form onSubmit={handleEmailContinue} style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.85)', marginBottom: 6 }}>
                        Email
                    </label>
                    <input
                        type="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="Pilot@pilotrecognition.com"
                        style={{
                            width: '100%',
                            padding: '10px 12px',
                            border: '1px solid rgba(255,255,255,0.2)',
                            borderRadius: 6,
                            fontSize: 14,
                            color: '#ffffff',
                            background: 'rgba(255,255,255,0.08)',
                            outline: 'none',
                            boxSizing: 'border-box',
                            marginBottom: 12,
                        }}
                    />
                    <button
                        type="submit"
                        disabled={emailSubmitting || !email.trim()}
                        style={{
                            width: '100%',
                            padding: '11px',
                            background: emailSubmitting || !email.trim() ? '#fca5a5' : '#dc2626',
                            color: '#fff',
                            border: 'none',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 600,
                            cursor: emailSubmitting || !email.trim() ? 'not-allowed' : 'pointer',
                            transition: 'background 0.15s',
                        }}
                    >
                        {emailSubmitting ? 'Redirecting...' : 'Continue →'}
                    </button>
                </form>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                    <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)' }}>or</span>
                    <div style={{ flex: 1, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                </div>

                {/* OAuth buttons */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    <button
                        onClick={handleGoogleLogin}
                        style={{
                            width: '100%',
                            padding: '10px 14px',
                            background: 'rgba(255,255,255,0.08)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            borderRadius: 6,
                            fontSize: 14,
                            fontWeight: 500,
                            color: 'rgba(255,255,255,0.9)',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            transition: 'border-color 0.15s, background 0.15s',
                        }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                    >
                        <svg width="18" height="18" viewBox="0 0 18 18">
                            <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"/>
                            <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"/>
                            <path fill="#FBBC05" d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"/>
                            <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"/>
                        </svg>
                        Continue with Google
                    </button>

                    {hasPasskey && (
                        <button
                            onClick={handlePasskeyLogin}
                            disabled={passkeyLoading}
                            style={{
                                width: '100%',
                                padding: '10px 14px',
                                background: 'rgba(255,255,255,0.08)',
                                border: '1px solid rgba(255,255,255,0.18)',
                                borderRadius: 6,
                                fontSize: 14,
                                fontWeight: 500,
                                color: 'rgba(255,255,255,0.9)',
                                cursor: passkeyLoading ? 'not-allowed' : 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                gap: 10,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        >
                            <svg width="16" height="20" viewBox="0 0 814 1000" fill="currentColor" style={{ flexShrink: 0 }}>
                                <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.7C55 556.8 17 429.7 17 309.2c0-190.5 123.3-291.5 245.5-291.5 63.2 0 115.9 41.7 155.5 41.7 38.3 0 98.1-44.2 170.7-44.2 26.9 0 109.1 2.6 168.4 87.3zm-180.3-141.9c30.7-36.4 52.4-86.7 52.4-136.7 0-6.8-.6-13.7-1.9-19.2-49.1 1.9-106.9 32.7-141.2 74.1-27.5 31.3-52.4 81.6-52.4 132.3 0 7.4 1.3 14.8 1.9 17.1 3.2.6 8.4 1.3 13.6 1.3 44.2 0 96.2-29.4 127.6-68.9z"/>
                            </svg>
                            {passkeyLoading ? 'Verifying...' : 'Sign in with Passkey (Touch ID)'}
                        </button>
                    )}
                </div>

                {/* Sign up link */}
                <p style={{ textAlign: 'center', fontSize: 13, color: 'rgba(255,255,255,0.45)', marginTop: 20, marginBottom: 0 }}>
                    Don't have an account?{' '}
                    <button
                        onClick={() => onNavigate('become-member')}
                        style={{ background: 'none', border: 'none', color: '#ef4444', fontWeight: 600, cursor: 'pointer', padding: 0, fontSize: 13 }}
                    >
                        Sign up
                    </button>
                </p>
            </div>

            {/* Back link */}
            <button
                onClick={() => navigate('/')}
                style={{ marginTop: 24, background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', zIndex: 1, position: 'relative' }}
            >
                ← Back to Home
            </button>

            <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
    );
};

export default FlightDeckLoginPage;
