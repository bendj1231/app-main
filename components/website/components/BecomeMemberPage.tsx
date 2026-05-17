
import React, { useState, useEffect } from 'react';
import { useAuth0 } from '@auth0/auth0-react';
import { MeshGradient } from '@paper-design/shaders-react';
import { TopNavbar } from './TopNavbar';
import { BreadcrumbSchema } from './seo/BreadcrumbSchema';
import { shouldEnable3DEffects } from '@/src/lib/device-detection';

interface BecomeMemberPageProps {
    onBack: () => void;
    onNavigate: (page: string) => void;
    onLogin: () => void;
}

const GoogleIcon = () => (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
        <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
        <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
        <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
    </svg>
);

export const BecomeMemberPage: React.FC<BecomeMemberPageProps> = ({ onBack, onNavigate, onLogin }) => {

    const { loginWithRedirect } = useAuth0();
    const [enableShader, setEnableShader] = useState(false);

    useEffect(() => {
        setEnableShader(shouldEnable3DEffects());
    }, []);

    const handleEmailSignup = () => {
        loginWithRedirect({
            authorizationParams: {
                screen_hint: 'signup',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
        });
    };

    const handleGoogleSignup = () => {
        loginWithRedirect({
            authorizationParams: {
                connection: 'google-oauth2',
                screen_hint: 'signup',
                redirect_uri: `${window.location.origin}/auth/callback`,
            },
        });
    };

    return (
        <>
            <BreadcrumbSchema items={[
                { name: 'Home', url: '/' },
                { name: 'Create Account', url: '/become-member' }
            ]} />
            <div className="relative h-screen overflow-hidden flex flex-col">

                {/* Background — same shader as HomePage & platform */}
                <div className="fixed inset-0 z-0">
                    {enableShader ? (
                        <MeshGradient
                            className="w-full h-full"
                            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
                            speed={0.22}
                        />
                    ) : (
                        <div className="w-full h-full" style={{ background: 'linear-gradient(160deg, #0f172a 0%, #1e3a5f 40%, #0f172a 100%)' }} />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
                    <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
                    <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
                </div>

                <div className="relative z-10">
                <TopNavbar onNavigate={onNavigate} onLogin={onLogin} onLoginModalOpen={onLogin} forceScrolled={true} />
                </div>

                <div className="relative z-10 flex-1 flex items-center justify-center px-6 md:px-12 lg:px-16 py-8">
                    <div className="w-full max-w-6xl flex flex-col md:flex-row items-center gap-8 md:gap-16">

                        {/* Left: Hero text */}
                        <div className="flex-1 text-left">
                            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black leading-[1.05] mb-3 text-white">
                                Connecting Pilots<br />
                                <span className="text-red-500">to the Industry.</span>
                            </h1>
                            <p className="text-slate-300 text-sm">Free access to Programs, Pathways &amp; Pilot Recognition</p>
                        </div>

                        {/* Right: Signup card */}
                        <div className="w-full md:w-[400px] flex-shrink-0">

                        {/* Card */}
                        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">

                            {/* Google signup */}
                            <button
                                onClick={handleGoogleSignup}
                                className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-4 shadow-sm"
                            >
                                <GoogleIcon />
                                Continue with Google
                            </button>

                            {/* Divider */}
                            <div className="relative my-5">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                                <div className="relative flex justify-center">
                                    <span className="px-3 bg-transparent text-slate-500 text-xs">or</span>
                                </div>
                            </div>

                            {/* Email/password signup via Auth0 Universal Login */}
                            <button
                                onClick={handleEmailSignup}
                                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-red-600/20"
                            >
                                Sign up with Email
                            </button>

                            {/* Divider */}
                            <div className="relative my-6">
                                <div className="absolute inset-0 flex items-center">
                                    <div className="w-full border-t border-white/10" />
                                </div>
                            </div>

                            {/* What you get */}
                            <ul className="space-y-2.5 mb-6">
                                {[
                                    'Free pilot recognition profile',
                                    'Access to airline pathway cards',
                                    'Programs & training roadmaps',
                                    'ATLAS CV builder',
                                ].map((item) => (
                                    <li key={item} className="flex items-center gap-2.5 text-sm text-white">
                                        <span className="w-4 h-4 rounded-full bg-[#00b4d8]/20 flex items-center justify-center flex-shrink-0">
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#00b4d8]" />
                                        </span>
                                        {item}
                                    </li>
                                ))}
                            </ul>

                            {/* Already have account */}
                            <p className="text-center text-sm text-slate-300">
                                Already have an account?{' '}
                                <button
                                    onClick={onLogin}
                                    className="text-[#00b4d8] hover:text-white font-semibold transition-colors"
                                >
                                    Sign in
                                </button>
                            </p>
                        </div>

                        {/* Neutral disclaimer */}
                        <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
                            By creating an account you agree to our{' '}
                            <button onClick={() => onNavigate('terms')} className="underline hover:text-white transition-colors">Terms of Service</button>
                            {' '}and{' '}
                            <button onClick={() => onNavigate('privacy')} className="underline hover:text-white transition-colors">Privacy Policy</button>.
                            No sensitive personal or aviation data is required to register.
                        </p>
                        </div>{/* end right column */}
                    </div>{/* end flex row */}
                </div>
            </div>
        </>
    );
};
