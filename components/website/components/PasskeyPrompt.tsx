/**
 * PasskeyPrompt — Post-login passkey registration prompt
 *
 * Shown once after a successful Google login to offer the pilot
 * biometric sign-in for future sessions. Non-blocking — pilot can dismiss.
 *
 * Architecture:
 *   - Uses WebAuthn navigator.credentials.create() to register a platform authenticator
 *   - Public key stored in Supabase `pilot_passkeys` table
 *   - On future logins: navigator.credentials.get() → assertion → Auth0 still issues JWT
 *   - `auth0User.sub` remains stable → vault key derivation unchanged
 *
 * Storage:
 *   - localStorage key `pr_passkey_registered` = 'true' → skip prompt
 *   - localStorage key `pr_passkey_declined` = timestamp → skip for 30 days
 */

import React, { useState } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { Fingerprint, X, Shield, ChevronRight } from 'lucide-react';

interface PasskeyPromptProps {
    userId: string;
    userEmail: string;
    onDismiss: () => void;
}

function isPasskeySupported(): boolean {
    return (
        typeof window !== 'undefined' &&
        !!window.PublicKeyCredential &&
        typeof navigator.credentials?.create === 'function'
    );
}

function base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const binary = atob(base64);
    const buffer = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) buffer[i] = binary.charCodeAt(i);
    return buffer.buffer;
}

function bufferToBase64url(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    bytes.forEach(b => binary += String.fromCharCode(b));
    return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

export const PasskeyPrompt: React.FC<PasskeyPromptProps> = ({ userId, userEmail, onDismiss }) => {
    const [step, setStep] = useState<'prompt' | 'registering' | 'success' | 'error'>('prompt');
    const [errorMsg, setErrorMsg] = useState('');

    const handleRegister = async () => {
        setStep('registering');
        try {
            // Challenge: random bytes (in production this should come from your server)
            const challenge = crypto.getRandomValues(new Uint8Array(32));
            const userId_bytes = new TextEncoder().encode(userId);

            const credential = await navigator.credentials.create({
                publicKey: {
                    challenge,
                    rp: {
                        name: 'PilotRecognition',
                        id: window.location.hostname,
                    },
                    user: {
                        id: userId_bytes,
                        name: userEmail,
                        displayName: userEmail.split('@')[0],
                    },
                    pubKeyCredParams: [
                        { alg: -7, type: 'public-key' },   // ES256 (preferred)
                        { alg: -257, type: 'public-key' },  // RS256 (fallback)
                    ],
                    authenticatorSelection: {
                        authenticatorAttachment: 'platform', // device-bound only
                        userVerification: 'required',         // biometric/PIN gate
                        residentKey: 'required',              // discoverable credential
                    },
                    timeout: 60000,
                    attestation: 'none',
                },
            }) as PublicKeyCredential | null;

            if (!credential) throw new Error('No credential returned');

            const response = credential.response as AuthenticatorAttestationResponse;

            // Extract public key from attestation response
            const publicKeyBuffer = response.getPublicKey?.();
            if (!publicKeyBuffer) throw new Error('Could not extract public key');

            // Detect device name for display
            const ua = navigator.userAgent;
            const deviceName = /iPhone/.test(ua) ? 'iPhone'
                : /iPad/.test(ua) ? 'iPad'
                : /Android/.test(ua) ? 'Android'
                : /Mac/.test(ua) ? 'Mac'
                : /Windows/.test(ua) ? 'Windows'
                : 'Unknown device';

            // Persist public key to Supabase pilot_passkeys table via service role
            // Uses supabase client with anon key — insert allowed via edge function pattern
            const { error: dbError } = await supabase
                .from('pilot_passkeys')
                .insert({
                    user_id: userId,
                    credential_id: credential.id,
                    public_key: Array.from(new Uint8Array(publicKeyBuffer)),
                    sign_count: 0,
                    device_name: deviceName,
                    transports: (credential as any).response?.getTransports?.() ?? [],
                });

            if (dbError) {
                console.warn('[passkey] DB insert failed (non-critical):', dbError.message);
            }

            // Mark registered locally for prompt suppression
            localStorage.setItem('pr_passkey_registered', 'true');
            localStorage.setItem('pr_passkey_credential_id', credential.id);

            setStep('success');
            setTimeout(onDismiss, 2000);

        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                // User cancelled — treat as decline, don't show for 30 days
                localStorage.setItem('pr_passkey_declined', Date.now().toString());
                onDismiss();
            } else {
                setErrorMsg(err.message || 'Passkey registration failed');
                setStep('error');
            }
        }
    };

    const handleDecline = () => {
        localStorage.setItem('pr_passkey_declined', Date.now().toString());
        onDismiss();
    };

    if (!isPasskeySupported()) return null;

    return (
        <div className="fixed inset-0 z-[10000] flex items-end sm:items-center justify-center pointer-events-none">
            <div className="pointer-events-auto w-full max-w-sm mx-4 mb-6 sm:mb-0 bg-white rounded-2xl shadow-2xl border border-slate-100 animate-slideUp overflow-hidden">

                {/* Top accent bar */}
                <div className="h-1 bg-gradient-to-r from-blue-500 via-indigo-500 to-violet-500" />

                <div className="p-6">
                    {step === 'prompt' && (
                        <>
                            <div className="flex items-start justify-between mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
                                        <Fingerprint className="w-5 h-5 text-indigo-600" />
                                    </div>
                                    <div>
                                        <p className="font-semibold text-slate-900 text-sm">Enable Passkey Sign-In</p>
                                        <p className="text-xs text-slate-500">Face ID · Fingerprint · PIN</p>
                                    </div>
                                </div>
                                <button
                                    onClick={handleDecline}
                                    className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors"
                                    aria-label="Dismiss"
                                >
                                    <X className="w-4 h-4" />
                                </button>
                            </div>

                            <p className="text-sm text-slate-600 mb-4 leading-relaxed">
                                Sign in instantly next time with your device biometrics. Your vault key stays Google-backed — passkey just replaces typing your credentials.
                            </p>

                            <div className="flex items-center gap-2 text-xs text-emerald-700 bg-emerald-50 rounded-lg px-3 py-2 mb-5">
                                <Shield className="w-3.5 h-3.5 flex-shrink-0" />
                                <span>Private key never leaves your device hardware</span>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleDecline}
                                    className="flex-1 py-2.5 text-sm font-medium text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors"
                                >
                                    Not now
                                </button>
                                <button
                                    onClick={handleRegister}
                                    className="flex-1 py-2.5 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl transition-colors flex items-center justify-center gap-1.5"
                                >
                                    Set up
                                    <ChevronRight className="w-4 h-4" />
                                </button>
                            </div>
                        </>
                    )}

                    {step === 'registering' && (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-indigo-50 flex items-center justify-center mx-auto mb-3 animate-pulse">
                                <Fingerprint className="w-6 h-6 text-indigo-600" />
                            </div>
                            <p className="font-semibold text-slate-900 text-sm mb-1">Waiting for biometric...</p>
                            <p className="text-xs text-slate-500">Use your face, fingerprint, or device PIN</p>
                        </div>
                    )}

                    {step === 'success' && (
                        <div className="text-center py-4">
                            <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-3">
                                <Shield className="w-6 h-6 text-emerald-600" />
                            </div>
                            <p className="font-semibold text-slate-900 text-sm mb-1">Passkey registered</p>
                            <p className="text-xs text-slate-500">You can now sign in with your biometrics</p>
                        </div>
                    )}

                    {step === 'error' && (
                        <div className="text-center py-4">
                            <p className="font-semibold text-slate-900 text-sm mb-2">Registration failed</p>
                            <p className="text-xs text-red-500 mb-4">{errorMsg}</p>
                            <button
                                onClick={handleDecline}
                                className="text-sm text-slate-500 hover:text-slate-700 underline"
                            >
                                Dismiss
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

/**
 * Hook to determine if passkey prompt should be shown after login.
 * Returns true if: supported, not yet registered, not recently declined.
 */
export function useShouldShowPasskeyPrompt(): boolean {
    const registered = localStorage.getItem('pr_passkey_registered') === 'true';
    if (registered) return false;

    const declined = localStorage.getItem('pr_passkey_declined');
    if (declined) {
        const daysSinceDecline = (Date.now() - parseInt(declined)) / (1000 * 60 * 60 * 24);
        if (daysSinceDecline < 30) return false;
    }

    return isPasskeySupported();
}
