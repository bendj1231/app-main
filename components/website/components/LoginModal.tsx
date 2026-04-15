import React, { useState } from 'react';
import { X, ArrowRight, Eye, EyeOff } from 'lucide-react';

interface LoginModalProps {
    isOpen: boolean;
    onClose: () => void;
    onLogin: () => void;
    onNavigate: (page: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
    isOpen,
    onClose,
    onLogin,
    onNavigate
}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onLogin();
        onClose();
    };

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center">
            {/* Blur Backdrop */}
            <div 
                className="absolute inset-0 bg-black/40 backdrop-blur-xl transition-all duration-300"
                onClick={onClose}
            />
            
            {/* Modal Container */}
            <div className="relative w-full max-w-[900px] mx-4 bg-white rounded-2xl overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-300">
                {/* Glassy X Button - Top Right */}
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-50 w-10 h-10 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all duration-300 hover:scale-110"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="flex flex-col md:flex-row min-h-[550px]">
                    {/* Left Side - Dark Blue with Info */}
                    <div className="w-full md:w-[45%] bg-[#0a1628] text-white p-8 md:p-10 flex flex-col justify-center relative">
                        {/* Logo */}
                        <div className="mb-8">
                            <img
                                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                                alt="WingMentor Logo"
                                className="w-32 h-auto object-contain mx-auto md:mx-0"
                            />
                        </div>

                        {/* Mentor Network Label */}
                        <p className="text-xs font-bold tracking-[0.3em] uppercase text-blue-400 mb-3 text-center md:text-left">
                            Mentor Network
                        </p>

                        {/* Title */}
                        <h2 className="text-3xl md:text-4xl font-serif mb-4 text-center md:text-left">
                            Pilot Portal
                        </h2>

                        {/* Description */}
                        <p className="text-white/70 text-sm leading-relaxed mb-6 text-center md:text-left">
                            Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies. Explore the pilot network search for type-rating intel, airline requirements, and aircraft references.
                        </p>

                        {/* Learn More Button */}
                        <button
                            onClick={() => {
                                onNavigate('pilot-recognition');
                                onClose();
                            }}
                            className="px-6 py-2.5 border border-white/30 rounded-full text-sm font-medium hover:bg-white/10 transition-all duration-300 w-fit mx-auto md:mx-0"
                        >
                            Learn more
                        </button>
                    </div>

                    {/* Right Side - Login Form */}
                    <div className="w-full md:w-[55%] bg-gradient-to-br from-slate-100 to-slate-200 p-8 md:p-10 flex flex-col justify-center">
                        {/* Header */}
                        <div className="mb-6">
                            <h2 className="text-2xl md:text-3xl font-serif text-slate-800 mb-2">
                                Connecting pilots to the aviation industry
                            </h2>
                            <p className="text-slate-500 text-sm">
                                Sign in with your WingMentor credentials.
                            </p>
                        </div>

                        {/* Change Optimization Button */}
                        <button className="w-fit mb-6 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm font-medium transition-all duration-300">
                            Change Optimization
                        </button>

                        {/* WingMentor Account Label */}
                        <p className="text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-4">
                            WINGMENTOR ACCOUNT
                        </p>

                        {/* Login Form */}
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Email Input */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    required
                                />
                            </div>

                            {/* Password Input */}
                            <div className="relative">
                                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-3.5 bg-slate-100 border border-slate-300 rounded-xl text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>

                            {/* Forgot Password */}
                            <div className="flex justify-end">
                                <button
                                    type="button"
                                    className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Forgot Password?
                                </button>
                            </div>

                            {/* Login Button */}
                            <button
                                type="submit"
                                className="w-full py-4 bg-[#1a1f36] hover:bg-[#252b4a] text-white rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all duration-300 shadow-lg hover:shadow-xl"
                            >
                                Login
                                <ArrowRight className="w-4 h-4" />
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

                        {/* Footer Links */}
                        <div className="mt-6 pt-6 border-t border-slate-300">
                            <p className="text-sm text-slate-500 text-center">
                                Not a member?{' '}
                                <button
                                    onClick={() => {
                                        onNavigate('become-member');
                                        onClose();
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
                                >
                                    Create an account
                                </button>
                                {' • '}
                                <button
                                    onClick={() => {
                                        onNavigate('pilot-recognition');
                                        onClose();
                                    }}
                                    className="text-blue-600 hover:text-blue-700 font-medium"
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
