import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { supabase } from '../../../src/lib/supabase';

// Read pending login state set by FlightDeckLoginPage before Auth0
function getPendingEmail(): string { return sessionStorage.getItem('fd_pending_email') || ''; }
function getPendingConnection(): string { return sessionStorage.getItem('fd_pending_connection') || 'email'; }
function clearPending() { sessionStorage.removeItem('fd_pending_email'); sessionStorage.removeItem('fd_pending_connection'); }

const SUPABASE_URL = (import.meta as any).env?.VITE_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const ANON_KEY = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

interface FlightDeckVerifyPageProps {
    onNavigate: (page: string) => void;
}

type Stage = 'passkey' | 'otp-sending' | 'otp-entry' | 'success' | 'wallet-key';

export const FlightDeckVerifyPage: React.FC<FlightDeckVerifyPageProps> = ({ onNavigate }) => {
    const navigate = useNavigate();
    const { loginWithRedirect, isAuthenticated, user } = useAuth0();
    const [stage, setStage] = useState<Stage>('passkey');
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [otp, setOtp] = useState('');
    const [otpError, setOtpError] = useState('');
    const [otpVerifying, setOtpVerifying] = useState(false);
    const [statusMsg, setStatusMsg] = useState('');
    const [walletKey, setWalletKey] = useState('');
    const [walletKeyError, setWalletKeyError] = useState('');
    const [walletKeyVerifying, setWalletKeyVerifying] = useState(false);

    // If already Auth0-authenticated (e.g. came from Google login), go straight to platform
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/platform');
        }
    }, [isAuthenticated, navigate]);

    // If no pending email and not authenticated, redirect back to login
    useEffect(() => {
        if (!isAuthenticated && !getPendingEmail()) {
            navigate('/flight-deck-login');
        }
    }, []);

    // Derive display info from sessionStorage (pre-Auth0) or Auth0 user (post-Auth0)
    const pendingEmail = getPendingEmail() || user?.email || '';
    const displayName = user?.name || pendingEmail.split('@')[0] || 'Pilot';

    // After verification passes, trigger Auth0 login
    const proceedToAuth0 = async () => {
        const email = getPendingEmail();
        const connection = getPendingConnection();
        clearPending();
        localStorage.setItem('pr_passkey_registered', 'true');
        await loginWithRedirect({
            authorizationParams: {
                login_hint: email,
                redirect_uri: `${window.location.origin}/auth/callback`,
                ...(connection === 'google-oauth2' ? { connection: 'google-oauth2' } : {}),
            },
            appState: { returnTo: '/platform' },
        });
    };


    const handlePasskeySetup = async () => {
        setPasskeyLoading(true);
        setStatusMsg('');
        try {
            const email = pendingEmail;
            const name = displayName;
            const userId = pendingEmail; // use email as user id before Auth0 sub is known

            const challenge = new Uint8Array(32);
            crypto.getRandomValues(challenge);

            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge,
                    rp: { name: 'PilotRecognition', id: window.location.hostname },
                    user: {
                        id: new TextEncoder().encode(userId),
                        name: email,
                        displayName: name,
                    },
                    pubKeyCredParams: [
                        { type: 'public-key', alg: -7 },
                        { type: 'public-key', alg: -257 },
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform',
                        userVerification: 'required',
                        residentKey: 'preferred',
                    },
                    timeout: 60000,
                },
            }) as PublicKeyCredential | null;

            if (credential) {
                const attestation = credential.response as AuthenticatorAttestationResponse;
                const pubKeyBuf = attestation.getPublicKey?.();
                localStorage.setItem('pr_passkey_registered', 'true');
                localStorage.setItem('pr_passkey_credential_id', credential.id);

                // Persist to pilot_passkeys
                await supabase.from('pilot_passkeys').upsert({
                    user_id: userId,
                    credential_id: credential.id,
                    public_key: pubKeyBuf ? Array.from(new Uint8Array(pubKeyBuf)) : [],
                    sign_count: 0,
                    device_name: navigator.userAgent.includes('Mac') ? 'Mac / iCloud Keychain' : 'Device Passkey',
                    transports: (credential as any).response?.getTransports?.() ?? [],
                }, { onConflict: 'credential_id' });

                setStage('success');
                setTimeout(() => proceedToAuth0(), 1200);
            }
        } catch (err: any) {
            setPasskeyLoading(false);
            if (err?.name === 'NotAllowedError' || err?.name === 'AbortError') {
                // User cancelled — fall through to OTP
                sendOtp();
            } else {
                setStatusMsg('Passkey setup failed. Sending a verification code instead...');
                setTimeout(() => sendOtp(), 1500);
            }
        }
    };

    const sendOtp = async () => {
        setStage('otp-sending');
        const email = pendingEmail;
        if (!email) {
            setOtpError('No email found. Please go back and sign in again.');
            setStage('otp-entry');
            return;
        }
        try {
            const { error } = await supabase.auth.signInWithOtp({
                email,
                options: { shouldCreateUser: false },
            });
            if (error) throw error;
            setStage('otp-entry');
        } catch {
            setOtpError('Could not send code. Please try again.');
            setStage('otp-entry');
        }
    };

    const handleOtpVerify = async () => {
        setOtpVerifying(true);
        setOtpError('');
        const email = pendingEmail;
        try {
            const { error } = await supabase.auth.verifyOtp({
                email,
                token: otp.trim(),
                type: 'email',
            });
            if (error) throw error;
            setStage('success');
            setTimeout(() => proceedToAuth0(), 1200);
        } catch {
            setOtpError('Invalid or expired code. Please try again.');
        } finally {
            setOtpVerifying(false);
        }
    };

    const handleSkip = () => proceedToAuth0();

    // Shared shell
    const Shell = ({ children }: { children: React.ReactNode }) => (
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

            <div style={{ textAlign: 'center', marginBottom: 32, position: 'relative', zIndex: 1 }}>
                <div style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.5px', marginBottom: 6 }}>
                    <span style={{ color: '#ffffff' }}>pilot</span>
                    <span style={{ color: '#ef4444' }}>recognition</span>
                    <span style={{ color: '#ffffff' }}>.com</span>
                </div>
                <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 500 }}>Flight Deck</p>
            </div>

            <div style={{
                background: 'rgba(255,255,255,0.07)',
                backdropFilter: 'blur(24px)',
                WebkitBackdropFilter: 'blur(24px)',
                borderRadius: 16,
                padding: '36px 32px',
                width: '100%',
                maxWidth: 440,
                border: '1px solid rgba(255,255,255,0.15)',
                boxShadow: '0 8px 48px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.1)',
                position: 'relative',
                zIndex: 1,
            }}>
                {children}
            </div>

            <button
                onClick={handleSkip}
                style={{ marginTop: 20, background: 'none', border: 'none', color: 'rgba(255,255,255,0.35)', fontSize: 13, cursor: 'pointer', zIndex: 1, position: 'relative' }}
            >
                Skip for now →
            </button>
            <style>{`@keyframes spin { to { transform: rotate(360deg); } } @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.5} }`}</style>
        </div>
    );

    if (stage === 'success') {
        return (
            <Shell>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>✅</div>
                    <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Verified</h2>
                    <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: 14, margin: 0 }}>Taking you to your Flight Deck...</p>
                </div>
            </Shell>
        );
    }

    if (stage === 'otp-sending') {
        return (
            <Shell>
                <div style={{ textAlign: 'center', padding: '12px 0' }}>
                    <div style={{ width: 36, height: 36, border: '3px solid rgba(255,255,255,0.3)', borderTopColor: '#ef4444', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 20px' }} />
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: 15, margin: 0 }}>Sending verification code to<br /><strong style={{ color: '#fff' }}>{user?.email}</strong></p>
                </div>
            </Shell>
        );
    }

    if (stage === 'otp-entry') {
        return (
            <Shell>
                <div style={{ marginBottom: 24 }}>
                    <div style={{ fontSize: 32, marginBottom: 12, textAlign: 'center' }}>✉️</div>
                    <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, margin: '0 0 8px', textAlign: 'center' }}>Check your email</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, textAlign: 'center', lineHeight: 1.5 }}>
                        We sent a 6-digit code to<br /><strong style={{ color: 'rgba(255,255,255,0.8)' }}>{user?.email}</strong>
                    </p>
                </div>

                {otpError && (
                    <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, color: '#fca5a5', fontSize: 13 }}>
                        {otpError}
                    </div>
                )}

                <input
                    type="text"
                    inputMode="numeric"
                    maxLength={6}
                    value={otp}
                    onChange={e => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                    placeholder="000000"
                    style={{
                        width: '100%',
                        padding: '14px',
                        border: '1px solid rgba(255,255,255,0.2)',
                        borderRadius: 8,
                        fontSize: 24,
                        fontWeight: 700,
                        letterSpacing: '0.4em',
                        color: '#ffffff',
                        background: 'rgba(255,255,255,0.08)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        textAlign: 'center',
                        marginBottom: 14,
                    }}
                    autoFocus
                />

                <button
                    onClick={handleOtpVerify}
                    disabled={otp.length < 6 || otpVerifying}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: otp.length < 6 || otpVerifying ? 'rgba(220,38,38,0.4)' : '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: otp.length < 6 || otpVerifying ? 'not-allowed' : 'pointer',
                        marginBottom: 12,
                    }}
                >
                    {otpVerifying ? 'Verifying...' : 'Verify →'}
                </button>

                <button
                    onClick={sendOtp}
                    style={{ width: '100%', background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: '4px 0' }}
                >
                    Resend code
                </button>
            </Shell>
        );
    }

    if (stage === 'wallet-key') {
        const WALLET_KEY_RE = /^[0-9A-F]{6}(-[0-9A-F]{6}){7}$/i;

        const handleWalletKeySubmit = async () => {
            setWalletKeyError('');
            const trimmed = walletKey.trim().toUpperCase();
            if (!WALLET_KEY_RE.test(trimmed)) {
                setWalletKeyError('Invalid format. Key should look like: 9203C5-BC7511-0F3A71-...');
                return;
            }
            setWalletKeyVerifying(true);
            try {
                // 1. Fetch profile id + stored hash — use email since we're pre-Auth0
                const emailToLookup = pendingEmail || user?.email || '';
                const { data: profile } = await supabase
                    .from('profiles')
                    .select('id, vault_recovery_key_hash')
                    .eq('email', emailToLookup)
                    .maybeSingle();

                if (!profile) {
                    setWalletKeyError('Account not found. Try Google login instead.');
                    setWalletKeyVerifying(false);
                    return;
                }

                // 2. PBKDF2-hash the entered key with profile id as salt
                const enc = new TextEncoder();
                const base = await crypto.subtle.importKey('raw', enc.encode(trimmed), 'PBKDF2', false, ['deriveKey']);
                const derived = await crypto.subtle.deriveKey(
                    { name: 'PBKDF2', salt: enc.encode(`pr:wallet:recovery:${profile.id}`), iterations: 200_000, hash: 'SHA-256' },
                    base, { name: 'AES-GCM', length: 256 }, true, ['encrypt']
                );
                const raw = await crypto.subtle.exportKey('raw', derived);
                const enteredHash = Array.from(new Uint8Array(raw)).map(b => b.toString(16).padStart(2, '0')).join('');

                // 3. If no hash stored yet — first use, store it and allow through
                if (!profile.vault_recovery_key_hash) {
                    await supabase.from('profiles').update({ vault_recovery_key_hash: enteredHash }).eq('id', profile.id);
                    await proceedToAuth0();
                    return;
                }

                // 4. Compare hashes
                if (enteredHash !== profile.vault_recovery_key_hash) {
                    setWalletKeyError('Key is incorrect. Check your wallet recovery key and try again.');
                    setWalletKeyVerifying(false);
                    return;
                }

                await proceedToAuth0();
            } catch {
                setWalletKeyError('Verification failed. Try again.');
                setWalletKeyVerifying(false);
            }
        };

        return (
            <Shell>
                <div style={{ marginBottom: 24 }}>
                    <button
                        onClick={() => { setStage('passkey'); setWalletKey(''); setWalletKeyError(''); }}
                        style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.4)', fontSize: 13, cursor: 'pointer', padding: 0, marginBottom: 16 }}
                    >
                        ← Back
                    </button>
                    <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, margin: '0 0 8px' }}>Enter wallet recovery key</h2>
                    <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                        Paste the key you received when your wallet was created.<br />
                        Format: <span style={{ fontFamily: 'monospace', color: 'rgba(255,255,255,0.6)', fontSize: 11 }}>XXXXXX-XXXXXX-XXXXXX-...</span>
                    </p>
                </div>

                {walletKeyError && (
                    <div style={{ background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 14, color: '#fca5a5', fontSize: 13 }}>
                        {walletKeyError}
                    </div>
                )}

                <input
                    type="text"
                    value={walletKey}
                    onChange={e => { setWalletKey(e.target.value); setWalletKeyError(''); }}
                    onKeyDown={e => { if (e.key === 'Enter') handleWalletKeySubmit(); }}
                    placeholder="9203C5-BC7511-0F3A71-76969D-..."
                    autoFocus
                    style={{
                        width: '100%',
                        padding: '13px 14px',
                        border: `1px solid ${walletKeyError ? 'rgba(220,38,38,0.5)' : 'rgba(255,255,255,0.2)'}`,
                        borderRadius: 8,
                        fontSize: 13,
                        fontWeight: 600,
                        letterSpacing: '0.05em',
                        color: '#ffffff',
                        background: 'rgba(255,255,255,0.08)',
                        outline: 'none',
                        boxSizing: 'border-box',
                        fontFamily: 'monospace',
                        marginBottom: 14,
                    }}
                />

                <button
                    onClick={handleWalletKeySubmit}
                    disabled={!walletKey.trim() || walletKeyVerifying}
                    style={{
                        width: '100%',
                        padding: '12px',
                        background: !walletKey.trim() || walletKeyVerifying ? 'rgba(220,38,38,0.4)' : '#dc2626',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 8,
                        fontSize: 15,
                        fontWeight: 700,
                        cursor: !walletKey.trim() || walletKeyVerifying ? 'not-allowed' : 'pointer',
                    }}
                >
                    {walletKeyVerifying ? 'Verifying...' : 'Unlock with key →'}
                </button>
            </Shell>
        );
    }

    // Default: passkey stage
    return (
        <Shell>
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
                <div style={{ width: 52, height: 52, margin: '0 auto 12px', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(220,38,38,0.15)', border: '1px solid rgba(220,38,38,0.3)', borderRadius: 14 }}>
                    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>
                </div>
                <h2 style={{ color: '#ffffff', fontSize: 20, fontWeight: 700, margin: '0 0 10px' }}>
                    Secure your Flight Deck
                </h2>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, margin: 0, lineHeight: 1.6 }}>
                    Set up Touch ID or Face ID to sign in instantly<br />next time — no password needed.
                </p>
            </div>

            {statusMsg && (
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: 13, textAlign: 'center', marginBottom: 16 }}>{statusMsg}</p>
            )}

            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 10, padding: '14px 16px', marginBottom: 20 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                    <span style={{ fontSize: 24 }}>👤</span>
                    <div>
                        <p style={{ margin: 0, color: '#fff', fontSize: 14, fontWeight: 600 }}>{displayName}</p>
                        <p style={{ margin: 0, color: 'rgba(255,255,255,0.45)', fontSize: 12 }}>{pendingEmail}</p>
                    </div>
                </div>
            </div>

            <button
                onClick={handlePasskeySetup}
                disabled={passkeyLoading}
                style={{
                    width: '100%',
                    padding: '13px',
                    background: passkeyLoading ? 'rgba(220,38,38,0.5)' : '#dc2626',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontSize: 15,
                    fontWeight: 700,
                    cursor: passkeyLoading ? 'not-allowed' : 'pointer',
                    marginBottom: 12,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 8,
                }}
            >
                {passkeyLoading
                    ? <><span style={{ width: 16, height: 16, border: '2px solid rgba(255,255,255,0.4)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.7s linear infinite', display: 'inline-block' }} /> Setting up...</>
                    : <><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}><rect x="2" y="5" width="20" height="14" rx="2"/><path d="M2 10h20"/><path d="M6 15h4"/></svg>&nbsp; Authorize with Touch ID / Passkey</>
                }
            </button>

            <button
                onClick={sendOtp}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.15)',
                    borderRadius: 8,
                    fontSize: 14,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.7)',
                    cursor: 'pointer',
                    marginBottom: 8,
                }}
            >
                Use email code instead →
            </button>

            <button
                onClick={() => setStage('wallet-key')}
                style={{
                    width: '100%',
                    padding: '12px',
                    background: 'none',
                    border: 'none',
                    fontSize: 13,
                    fontWeight: 500,
                    color: 'rgba(255,255,255,0.35)',
                    cursor: 'pointer',
                }}
            >
                Enter wallet recovery key →
            </button>
        </Shell>
    );
};

export default FlightDeckVerifyPage;
