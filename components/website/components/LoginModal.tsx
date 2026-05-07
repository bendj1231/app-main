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
    const { addToast } = useToast();
    const { login, currentUser } = useAuth();
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

                    {/* Google Sign In */}
                    <button
                        type="button"
                        className="w-full py-3 px-4 bg-white border border-slate-300 rounded-lg font-medium text-slate-700 hover:bg-slate-50 transition-all duration-200 flex items-center justify-center gap-3"
                    >
                        <GoogleIcon />
                        Google
                    </button>

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
