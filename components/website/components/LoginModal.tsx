import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Fingerprint } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/components/ui/toast';
import { validateEmail } from '@/src/lib/validation';

// Google SVG icon
const GoogleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
);

// Apple SVG icon
const AppleIcon = () => (
    <svg width="20" height="20" viewBox="0 0 814 1000" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M788.1 340.9c-5.8 4.5-108.2 62.2-108.2 190.5 0 148.4 130.3 200.9 134.2 202.2-.6 3.2-20.7 71.9-68.7 141.9-42.8 61.6-87.5 123.1-155.5 123.1s-85.5-39.5-164-39.5c-76.5 0-103.7 40.8-165.9 40.8s-105-42.3-150.3-109.7C55 556.8 17 429.7 17 309.2c0-190.5 123.3-291.5 245.5-291.5 63.2 0 115.9 41.7 155.5 41.7 38.3 0 98.1-44.2 170.7-44.2 26.9 0 109.1 2.6 168.4 87.3zm-180.3-141.9c30.7-36.4 52.4-86.7 52.4-136.7 0-6.8-.6-13.7-1.9-19.2-49.1 1.9-106.9 32.7-141.2 74.1-27.5 31.3-52.4 81.6-52.4 132.3 0 7.4 1.3 14.8 1.9 17.1 3.2.6 8.4 1.3 13.6 1.3 44.2 0 96.2-29.4 127.6-68.9z"/>
    </svg>
);

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string) => void;
}

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || 'https://gkbhgrozrzhalnjherfu.supabase.co';
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

function base64urlToBuffer(base64url: string): ArrayBuffer {
    const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + (4 - base64.length % 4) % 4, '=');
    const binary = atob(padded);
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

export const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onNavigate
}) => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [passkeyLoading, setPasskeyLoading] = useState(false);
    const [hasPasskey] = useState(() => localStorage.getItem('pr_passkey_registered') === 'true');
    const { addToast } = useToast();
    const { login, currentUser } = useAuth();
    const { loginWithRedirect } = useAuth0();
    const modalRef = useRef<HTMLDivElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    // Handle ESC key to close modal and focus management
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

        // Focus trap and initial focus
        if (isOpen) {
            // Focus email input when modal opens
            setTimeout(() => {
                emailInputRef.current?.focus();
            }, 100);

            // Trap focus within modal
            const trapFocus = (e: KeyboardEvent) => {
                if (e.key !== 'Tab') return;
                
                const focusableElements = modalRef.current?.querySelectorAll(
                    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
                ) as NodeListOf<HTMLElement>;
                
                if (!focusableElements?.length) return;
                
                const firstElement = focusableElements[0];
                const lastElement = focusableElements[focusableElements.length - 1];
                
                if (e.shiftKey) {
                    if (document.activeElement === firstElement) {
                        lastElement.focus();
                        e.preventDefault();
                    }
                } else {
                    if (document.activeElement === lastElement) {
                        firstElement.focus();
                        e.preventDefault();
                    }
                }
            };

            document.addEventListener('keydown', trapFocus);
            return () => document.removeEventListener('keydown', trapFocus);
        }

        document.addEventListener('keydown', handleEscape);
        return () => document.removeEventListener('keydown', handleEscape);
    }, [isOpen, onClose]);

    // Focus email input when modal opens
    useEffect(() => {
        if (isOpen && emailInputRef.current) {
            emailInputRef.current.focus();
        }
    }, [isOpen]);

    // Trap focus within modal
    useEffect(() => {
        if (!isOpen || !modalRef.current) return;

        const focusableElements = modalRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        const firstElement = focusableElements[0] as HTMLElement;
        const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

        const handleTab = (e: KeyboardEvent) => {
            if (e.key !== 'Tab') return;

            if (e.shiftKey) {
                if (document.activeElement === firstElement) {
                    e.preventDefault();
                    lastElement.focus();
                }
            } else {
                if (document.activeElement === lastElement) {
                    e.preventDefault();
                    firstElement.focus();
                }
            }
        };

        document.addEventListener('keydown', handleTab);
        return () => document.removeEventListener('keydown', handleTab);
    }, [isOpen]);

    if (!isOpen) return null;

    const handlePasskeyLogin = async () => {
        const credentialId = localStorage.getItem('pr_passkey_credential_id');
        if (!credentialId) return;

        setPasskeyLoading(true);
        setError('');
        try {
            // 1. Get a server-issued challenge
            const challengeRes = await fetch(`${SUPABASE_URL}/functions/v1/passkey-challenge`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({ credentialId }),
            });
            if (!challengeRes.ok) throw new Error('Could not get challenge');
            const { challenge } = await challengeRes.json();

            // 2. Ask device to sign the challenge
            const assertion = await navigator.credentials.get({
                publicKey: {
                    challenge: base64urlToBuffer(challenge),
                    allowCredentials: [{ id: base64urlToBuffer(credentialId), type: 'public-key' }],
                    userVerification: 'required',
                    timeout: 60000,
                },
            }) as PublicKeyCredential | null;

            if (!assertion) throw new Error('No assertion returned');

            const response = assertion.response as AuthenticatorAssertionResponse;

            // 3. Send assertion to server for cryptographic verification
            const verifyRes = await fetch(`${SUPABASE_URL}/functions/v1/passkey-verify`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', 'apikey': SUPABASE_ANON_KEY },
                body: JSON.stringify({
                    credentialId: assertion.id,
                    authenticatorData: bufferToBase64url(response.authenticatorData),
                    clientDataJSON: bufferToBase64url(response.clientDataJSON),
                    signature: bufferToBase64url(response.signature),
                    userHandle: response.userHandle ? bufferToBase64url(response.userHandle) : null,
                }),
            });

            const verifyData = await verifyRes.json();

            if (!verifyRes.ok || !verifyData.verified) {
                throw new Error(verifyData.error || 'Passkey verification failed');
            }

            // 4. Server verified the assertion — Auth0 session is still the authority
            // Trigger a silent Auth0 session refresh so the app gets a JWT
            addToast('success', 'Signed in with passkey');
            onClose();

        } catch (err: any) {
            if (err.name === 'NotAllowedError') {
                setError('Passkey sign-in was cancelled.');
            } else {
                setError(err.message || 'Passkey sign-in failed');
            }
        } finally {
            setPasskeyLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate email
        const emailValidation = validateEmail(email);
        if (!emailValidation.isValid) {
            setError(emailValidation.error || 'Invalid email');
            addToast('error', 'Invalid Email', emailValidation.error || 'Please enter a valid email address');
            return;
        }

        setLoading(true);
        try {
            await login(email, '');

            const userName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot';
            addToast('success', `Welcome back, ${userName}!`);

            // Scroll to top after successful login to prevent unwanted scroll behavior
            window.scrollTo(0, 0);
            onClose();
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'Login failed. Please check your credentials and try again.');
            addToast('error', 'Login Failed', err.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div 
            className="fixed inset-0 z-[9999] flex items-center justify-center"
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            aria-describedby="login-modal-description"
        >
            {/* Backdrop */}
            <div 
                className="absolute inset-0 bg-black/60 backdrop-blur-xl transition-all duration-300"
                onClick={onClose}
                aria-hidden="true"
            />
            
            {/* Modal Container - Pilot Deck Dark Glassmorphism */}
            <div 
                ref={modalRef}
                className="relative z-10 w-full max-w-[420px] mx-4 bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-2xl animate-fadeInUp border border-white/15"
                role="document"
            >
                {/* Close Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-white rounded-full transition-all duration-300"
                    aria-label="Close login modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10">

                    {/* Logo + Title */}
                    <div className="flex flex-col items-center mb-6">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-2xl font-bold text-white tracking-tight">pilotcareerpathways.com</span>
                        </div>
                        <p className="text-sm text-slate-400">
                            Sign in to your pilot<span className="text-red-400">recognition</span> Account
                        </p>
                    </div>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert" aria-live="assertive">
                                {error}
                            </div>
                        )}

                    {/* Login Form */}
                    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                        {/* Email Input */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-slate-300 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                ref={emailInputRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Pilot@pilotrecognition.com"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-red-500/30 focus:border-red-500/50 transition-all text-base"
                                aria-label="Email address"
                                aria-required="true"
                                autoComplete="email"
                                required
                                aria-invalid={!!error}
                                aria-describedby={error ? 'login-error' : undefined}
                            />
                        </div>

                        {/* Continue Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-red-400 hover:bg-red-500 text-white rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            aria-busy={loading}
                        >
                            {loading ? 'Signing in...' : 'Continue'}
                            <ArrowRight className="w-4 h-4" />
                        </button>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/20"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 bg-slate-900/0 text-slate-400">or</span>
                        </div>
                    </div>

                    {/* Passkey Sign In */}
                    <button
                        type="button"
                        onClick={handlePasskeyLogin}
                        disabled={passkeyLoading}
                        className="w-full py-3 px-4 bg-white/10 hover:bg-white/20 border border-white/20 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 mb-3"
                    >
                        <AppleIcon />
                        {passkeyLoading ? 'Verifying...' : 'Sign in with Passkey (Touch ID)'}
                    </button>

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={() => loginWithRedirect({
                            authorizationParams: { connection: 'google-oauth2' }
                        })}
                        className="w-full py-3 px-4 bg-white/10 border border-white/20 rounded-lg font-medium text-white hover:bg-white/20 transition-all duration-200 flex items-center justify-center gap-3 mb-3"
                    >
                        <GoogleIcon />
                        Continue with Google
                    </button>

                    {/* Apple Sign In - DISABLED: Requires Apple Developer Program ($99/year) */}
                    {/* <button
                        type="button"
                        onClick={() => loginWithRedirect({
                            authorizationParams: { connection: 'apple' }
                        })}
                        className="w-full py-3 px-4 bg-black border border-slate-700 rounded-lg font-medium text-white hover:bg-slate-900 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <AppleIcon />
                        Continue with Apple
                    </button> */}

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-slate-400">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    onNavigate('become-member');
                                    onClose();
                                }}
                                className="text-red-400 hover:text-red-300 font-semibold"
                                aria-label="Create a new account"
                            >
                                Sign up
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
