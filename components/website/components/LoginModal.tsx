import React, { useState, useEffect, useRef } from 'react';
import { X, ArrowRight, Eye, EyeOff } from 'lucide-react';
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

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onNavigate: (page: string) => void;
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
    const [oauthLoading, setOAuthLoading] = useState(false);
    const { addToast } = useToast();
    const { login, loginWithOAuth } = useAuth();
    const modalRef = useRef<HTMLDivElement>(null);
    const emailInputRef = useRef<HTMLInputElement>(null);

    // Handle ESC key to close modal
    useEffect(() => {
        const handleEscape = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onClose();
            }
        };

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

            addToast('success', 'Login Successful', 'Welcome back to WingMentor!');
            onNavigate('home');
            onClose();
        } catch (err: any) {
            console.error('Login failed:', err);
            setError(err.message || 'Login failed. Please check your credentials and try again.');
            addToast('error', 'Login Failed', err.message || 'Login failed. Please check your credentials and try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setOAuthLoading(true);
        setError('');
        try {
            await loginWithOAuth('google');
            // OAuth will redirect, so we don't need to close modal here
        } catch (err: any) {
            console.error('Google Sign-In failed:', err);
            setError(err.message || 'Google Sign-In failed. Please try again.');
            addToast('error', 'Google Sign-In Failed', err.message || 'Google Sign-In failed. Please try again.');
            setOAuthLoading(false);
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
            
            {/* Modal Container */}
            <div 
                ref={modalRef}
                className="relative z-10 w-full max-w-[900px] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl animate-fadeInUp max-h-[90vh] overflow-y-auto"
                role="document"
            >
                {/* Glassy X Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-12 h-12 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                    aria-label="Close modal"
                >
                    <X className="w-6 h-6" />
                </button>

                <div className="flex flex-col md:flex-row min-h-[550px]">
                    {/* Left Side - Dark Blue with Info */}
                    <div className="w-full md:w-[45%] bg-[#0a1628] text-white p-6 md:p-10 flex flex-col relative order-2 md:order-1">
                        {/* Logo - Centered, larger, and positioned lower */}
                        <div className="mt-8 mb-6 flex justify-center">
                            <img
                                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                alt="WingMentor Logo"
                                className="w-48 h-auto object-contain"
                            />
                        </div>

                        {/* Content - Centered in remaining space */}
                        <div className="flex-1 flex flex-col justify-center items-center">

                        {/* Mentor Network Label */}
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-400 mb-3 text-center">
                            Mentor Network
                        </p>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-serif mb-4 text-center">
                            Pilot Portal
                        </h2>

                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed mb-6 text-center max-w-sm">
                            Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies. Explore the pilot network search for type-rating intel, airline requirements, and aircraft references.
                        </p>

                        {/* Learn More Button */}
                        <button
                            onClick={() => {
                                onNavigate('pilot-recognition');
                                onClose();
                            }}
                            className="px-6 py-2.5 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300"
                            aria-label="Learn more about Pilot Portal"
                        >
                            Learn more
                        </button>
                        </div>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-[55%] bg-gradient-to-br from-slate-100 to-slate-200 p-6 md:p-10 flex flex-col justify-center order-1 md:order-2">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 id="login-modal-title" className="text-xl md:text-2xl lg:text-3xl font-serif text-slate-800 mb-2">
                                Connecting pilots to the aviation industry
                            </h2>
                            <p id="login-modal-description" className="text-slate-500 text-sm md:text-base">
                                Sign in with your WingMentor credentials.
                            </p>
                        </div>

                        {/* WingMentor Account Label */}
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">
                            WINGMENTOR ACCOUNT
                        </p>

                        {/* Error Message */}
                        {error && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-600 text-sm" role="alert" aria-live="assertive">
                                {error}
                            </div>
                        )}

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    ref={emailInputRef}
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 min-h-[52px] bg-slate-100 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                                    required
                                    aria-label="Email address"
                                    aria-invalid={!!error}
                                    aria-describedby={error ? 'login-error' : undefined}
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-14 py-4 min-h-[52px] bg-slate-100 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all text-base"
                                    required
                                    aria-label="Password"
                                    aria-invalid={!!error}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-2"
                                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm md:text-base text-blue-600 hover:text-blue-700 font-medium py-2"
                                    aria-label="Reset password"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 min-h-[52px] bg-[#1a1f36] hover:bg-[#252b4a] text-white rounded-xl font-semibold text-sm md:text-base flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-busy={loading}
                            >
                                {loading ? 'Logging in...' : 'Login'}
                                {!loading && <ArrowRight className="w-4 h-4" />}
                            </button>

                            {/* Divider */}
                            <div className="relative my-4">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-slate-300"></div>
                                </div>
                                <div className="relative flex justify-center text-sm">
                                    <span className="px-4 bg-slate-100 text-slate-500">or continue with</span>
                                </div>
                            </div>

                            {/* Google Sign-In Button */}
                            <button
                                type="button"
                                onClick={handleGoogleSignIn}
                                disabled={oauthLoading}
                                className="w-full py-4 min-h-[52px] bg-white hover:bg-gray-50 text-gray-700 border border-gray-300 rounded-xl font-semibold text-sm md:text-base flex items-center justify-center gap-3 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
                                aria-busy={oauthLoading}
                            >
                                {oauthLoading ? 'Signing in with Google...' : (
                                    <>
                                        <GoogleIcon />
                                        Sign in with Google
                                    </>
                                )}
                            </button>

                            {/* Remember Me */}
                            <div className="flex items-center gap-3">
                                <input
                                    type="checkbox"
                                    id="remember"
                                    checked={rememberMe}
                                    onChange={(e) => setRememberMe(e.target.checked)}
                                    className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                                />
                                <label htmlFor="remember" className="text-sm md:text-base text-slate-600">
                                    Remember me
                                </label>
                            </div>
                        </form>

                        {/* Footer Links */}
                        <div className="mt-6 pt-6 border-t border-slate-300">
                            <p className="text-sm md:text-base text-slate-500 text-center">
                                Not a member?{' '}
                                <button
                                    onClick={() => {
                                        onNavigate('become-member');
                                        onClose();
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium py-2"
                                    aria-label="Create a new account"
                                >
                                    Create an account
                                </button>
                                {' • '}
                                <button
                                    onClick={() => {
                                        onNavigate('pilot-recognition');
                                        onClose();
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium py-2"
                                    aria-label="Visit Pilot Network"
                                >
                                    Visit Pilot Network
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
