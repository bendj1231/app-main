import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { supabase } from '../../../src/lib/supabase';

interface FlightDeckLoginPageProps {
    onNavigate: (page: string) => void;
}

export const FlightDeckLoginPage: React.FC<FlightDeckLoginPageProps> = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated, isLoading } = useAuth0();
    const [email, setEmail] = useState('');
    const [emailSubmitting, setEmailSubmitting] = useState(false);
    const [hasPasskey] = useState(() => localStorage.getItem('pr_passkey_registered') === 'true');
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!isLoading && isAuthenticated) {
            navigate('/platform');
        }
    }, [isAuthenticated, isLoading, navigate]);

    const handleEmailContinue = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim()) return;
        setEmailSubmitting(true);
        setError('');
        try {
            await loginWithRedirect({
                authorizationParams: {
                    login_hint: email.trim(),
                    redirect_uri: `${window.location.origin}/auth/callback`,
                },
                appState: { returnTo: '/platform' },
            });
        } catch {
            setError('Unable to continue. Please try again.');
            setEmailSubmitting(false);
        }
    };

    const handleGoogleLogin = () => {
        loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
            appState: { returnTo: '/platform' },
        });
    };

    const handlePasskeyLogin = async () => {
        setPasskeyLoading(true);
        setError('');
        try {
            const credentialId = localStorage.getItem('pr_passkey_credential_id');
            const challengeRes = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/passkey-challenge`,
                { method: 'POST', headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_ANON_KEY } }
            );
            const { challenge } = await challengeRes.json();
            const challengeBuf = Uint8Array.from(atob(challenge.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0));

            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: challengeBuf,
                    timeout: 60000,
                    userVerification: 'required',
                    allowCredentials: credentialId
                        ? [{ id: Uint8Array.from(atob(credentialId.replace(/-/g, '+').replace(/_/g, '/')), c => c.charCodeAt(0)), type: 'public-key' }]
                        : [],
                },
            }) as PublicKeyCredential | null;

            if (!assertion) throw new Error('No assertion returned');

            const verifyRes = await fetch(
                `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/passkey-verify`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json', apikey: import.meta.env.VITE_SUPABASE_ANON_KEY },
                    body: JSON.stringify({ credentialId: assertion.id, challenge }),
                }
            );
            const verifyData = await verifyRes.json();
            if (verifyData.token) {
                const { error: signInError } = await supabase.auth.setSession({ access_token: verifyData.token, refresh_token: verifyData.refresh_token || '' });
                if (!signInError) {
                    navigate('/platform');
                    return;
                }
            }
            throw new Error('Passkey verification failed');
        } catch (err: any) {
            if (err?.name !== 'NotAllowedError') {
                setError('Passkey sign-in failed. Try Google or email instead.');
            }
        } finally {
            setPasskeyLoading(false);
        }
    };

    if (isLoading) {
        return (
            <div style={{ minHeight: '100vh', background: '#0f172a', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 32, height: 32, border: '3px solid #60a5fa', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
            </div>
        );
    }

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
                                gap: 10,
                            }}
                            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
                            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M12 10a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z"/>
                                <path d="M12 10v4m0 0-2 2m2-2 2 2"/>
                                <rect x="3" y="3" width="18" height="18" rx="2"/>
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
