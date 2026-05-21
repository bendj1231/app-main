import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Eye, EyeOff, Fingerprint } from 'lucide-react';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/components/ui/toast';
import { validateEmail, validateSimplePassword } from '@/src/lib/validation';

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
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.72 8.65c-.13 0-.26 0-.39.03-.65.17-1.28.6-1.73.95-.45.36-1.15.66-1.83.58-.1-.01-.21-.03-.31-.07-.6-.24-1.3-.37-2.04-.35-.95.02-1.86.28-2.56.74-.03.02-.05.04-.08.06-.03.02-.06.04-.09.07-.2.17-.38.35-.54.55-.14.18-.27.37-.39.57-.58.97-.87 2.12-.81 3.32.04.75.24 1.49.58 2.16.3.59.7 1.12 1.18 1.56.46.42 1 .75 1.58.97.58.22 1.2.33 1.82.32.39-.01.78-.08 1.15-.21.46-.16.93-.24 1.41-.24.48 0 .95.08 1.41.24.37.13.76.2 1.15.21.62.01 1.24-.1 1.82-.32.58-.22 1.12-.55 1.58-.97.48-.44.88-.97 1.18-1.56.34-.67.54-1.41.58-2.16.05-.88-.1-1.75-.42-2.55-.33-.82-.84-1.54-1.48-2.11-.66-.59-1.47-.98-2.33-1.12z" fill="currentColor"/>
        <path d="M14.57 6.33c.73-.88 1.18-2 1.18-3.22 0-.16-.01-.32-.04-.48-.78.04-1.52.31-2.13.77-.63.48-1.1 1.13-1.35 1.88-.25.74-.32 1.54-.19 2.31.23-.02.46-.07.68-.15.56-.18 1.06-.5 1.47-.9.38-.37.68-.81.88-1.29.15-.36.26-.74.33-1.13-.01.4-.09.79-.24 1.16-.18.44-.44.84-.78 1.17-.33.32-.72.57-1.15.73-.43.16-.88.24-1.34.23-.1 0-.2-.01-.3-.03.59-.36 1.05-.9 1.3-1.53.25-.63.28-1.33.08-1.98-.1-.33-.25-.64-.45-.92-.2-.27-.45-.51-.73-.7.66.21 1.25.6 1.69 1.11.45.52.76 1.15.89 1.82z" fill="currentColor" opacity="0"/>
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
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);
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

        // Validate password
        const passwordValidation = validateSimplePassword(password);
        if (!passwordValidation.isValid) {
            setError(passwordValidation.error || 'Invalid password');
            addToast('error', 'Invalid Password', passwordValidation.error || 'Please enter a valid password');
            return;
        }

        setLoading(true);
        try {
            await login(email, password);

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
            
            {/* Modal Container - Modern Centered Design */}
            <div 
                ref={modalRef}
                className="relative z-10 w-full max-w-[420px] mx-4 bg-white rounded-2xl shadow-2xl animate-fadeInUp"
                role="document"
            >
                {/* Close Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 p-2 text-slate-400 hover:text-slate-600 rounded-full transition-all duration-300"
                    aria-label="Close login modal"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8 md:p-10">
                    {/* Logo */}
                    <div className="flex justify-center mb-8">
                        <h1 className="text-xl font-bold tracking-tight">
                            <span className="text-slate-900">PILOT</span>
                            <span className="text-red-500">RECOGNITION</span>
                        </h1>
                    </div>

                    {/* Header */}
                    <div className="text-center mb-8">
                        <h2 id="login-modal-title" className="text-2xl font-semibold text-slate-900 mb-2">
                            Welcome back
                        </h2>
                        <p id="login-modal-description" className="text-slate-500 text-sm">
                            Sign in to access your pilot profile
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
                            <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Email
                            </label>
                            <input
                                id="email"
                                ref={emailInputRef}
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="name@example.com"
                                className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                                aria-label="Email address"
                                aria-required="true"
                                autoComplete="email"
                                required
                                aria-invalid={!!error}
                                aria-describedby={error ? 'login-error' : undefined}
                            />
                        </div>

                        {/* Password Input */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    id="password"
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 bg-white border border-slate-300 rounded-lg text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                                    required
                                    aria-label="Password"
                                    aria-invalid={!!error}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                </button>
                            </div>
                        </div>

                        {/* Forgot Password */}
                        <div className="flex justify-end">
                            <button
                                type="button"
                                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                aria-label="Reset password"
                            >
                                Forgot password?
                            </button>
                        </div>

                        {/* Login Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-lg font-semibold text-base transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            aria-busy={loading}
                        >
                            {loading ? 'Signing in...' : 'Sign in'}
                        </button>

                        {/* Remember Me */}
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                id="remember"
                                checked={rememberMe}
                                onChange={(e) => setRememberMe(e.target.checked)}
                                className="w-4 h-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                            />
                            <label htmlFor="remember" className="text-sm text-slate-600">
                                Remember me
                            </label>
                        </div>
                    </form>

                    {/* Divider */}
                    <div className="relative my-6">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-slate-200"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-white text-slate-500">Or continue with</span>
                        </div>
                    </div>

                    {/* Passkey Sign In — shown only when registered on this device */}
                    {hasPasskey && (
                        <button
                            type="button"
                            onClick={handlePasskeyLogin}
                            disabled={passkeyLoading}
                            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-all duration-200 flex items-center justify-center gap-3 mb-3"
                        >
                            <Fingerprint className="w-5 h-5" />
                            {passkeyLoading ? 'Verifying...' : 'Sign in with Passkey'}
                        </button>
                    )}

                    {/* Google Sign In */}
                    <button
                        type="button"
                        onClick={() => loginWithRedirect({
                            authorizationParams: { connection: 'google-oauth2' }
                        })}
                        className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-3 mb-3"
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
                        <p className="text-sm text-slate-500">
                            Don't have an account?{' '}
                            <button
                                onClick={() => {
                                    onNavigate('become-member');
                                    onClose();
                                }}
                                className="text-blue-600 hover:text-blue-700 font-semibold"
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
