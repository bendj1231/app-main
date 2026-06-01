'use client';

import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const regions = [
  { code: 'en-ph', name: 'Philippines', flag: '🇵🇭' },
  { code: 'en-us', name: 'United States', flag: '🇺🇸' },
  { code: 'en-gb', name: 'United Kingdom', flag: '🇬🇧' },
  { code: 'en-au', name: 'Australia', flag: '🇦🇺' },
  { code: 'en-ca', name: 'Canada', flag: '🇨🇦' },
  { code: 'en-sg', name: 'Singapore', flag: '🇸🇬' },
  { code: 'en-ae', name: 'UAE', flag: '🇦🇪' },
];

const navItems = [
  { label: 'About PSA', href: '/pilotshortage/about' },
  { label: 'Member Benefits', href: '/pilotshortage/benefits' },
  { label: 'Advocacy', href: '/pilotshortage/advocacy' },
  { label: 'UCF', href: '/pilotshortage/ucf' },
  { label: 'News', href: '/pilotshortage/news' },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
    <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
    <path d="M3.964 10.706A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
    <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.962L3.964 7.294C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
  </svg>
);

export default function JoinPSAPage() {
  const [currentRegion, setCurrentRegion] = useState(regions[0]);
  const [consentChecked, setConsentChecked] = useState(false);

  const handleGoogleSignup = () => {
    console.log('Google signup clicked');
  };

  const handleEmailSignup = () => {
    console.log('Email signup clicked');
  };

  return (
    <div className="min-h-screen bg-[#0f172a] flex flex-col">
      {/* Navigation */}
      <nav className="bg-[#0f172a]/80 backdrop-blur-md text-white border-b border-white/10 sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/pilotshortage" className="text-2xl font-bold tracking-tight">
              <span className="text-white">pilot</span>
              <span className="text-red-500">shortage</span>
              <span className="text-white">.org</span>
            </a>

            <div className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="text-sm font-medium uppercase tracking-wide transition-colors text-gray-300 hover:text-white"
                >
                  {item.label}
                </a>
              ))}

              <div className="relative">
                <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition-colors text-sm">
                  <span>{currentRegion.flag}</span>
                  <span className="text-gray-300">{currentRegion.name}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                </button>
              </div>

              <span className="bg-red-500 text-white px-6 py-2.5 rounded font-bold text-sm uppercase tracking-wide">
                Join PSA
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-[400px]">

          <p className="text-white font-bold text-lg mb-3 text-center">Join the Pilot Shortage Association</p>

          {/* Card */}
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm">

            {/* Consent checkbox */}
            <label className="flex items-start gap-3 mb-4 cursor-pointer group">
              <input
                type="checkbox"
                checked={consentChecked}
                onChange={e => setConsentChecked(e.target.checked)}
                className="mt-0.5 w-4 h-4 accent-red-600 flex-shrink-0 cursor-pointer"
              />
              <span className="text-xs text-slate-400 leading-relaxed group-hover:text-slate-300 transition-colors">
                I am 16 or older and I agree to the{' '}
                <a href="/terms-of-service" target="_blank" rel="noopener noreferrer" className="text-white underline">Terms of Service</a>,{' '}
                <a href="/privacy-policy" target="_blank" rel="noopener noreferrer" className="text-white underline">Privacy Policy</a>, and{' '}
                <a href="/data-controller-agreement" target="_blank" rel="noopener noreferrer" className="text-white underline">Data Controller Agreement</a>.
              </span>
            </label>

            {/* Google signup */}
            <button
              onClick={handleGoogleSignup}
              disabled={!consentChecked}
              className="w-full flex items-center justify-center gap-3 py-3 px-4 bg-white hover:bg-slate-50 disabled:opacity-40 disabled:cursor-not-allowed text-slate-800 font-semibold rounded-xl transition-all duration-200 mb-3 shadow-sm"
            >
              <GoogleIcon />
              Sign up with Google
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

            {/* Email signup */}
            <button
              onClick={handleEmailSignup}
              disabled={!consentChecked}
              className="w-full py-3 bg-red-600 hover:bg-red-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all duration-200 text-sm tracking-wide shadow-lg shadow-red-600/20"
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
                'Free PSA membership & advocacy access',
                'Share your pilot story anonymously',
                'Access to airline pathway data',
                'Join 2,000+ verified pilots worldwide',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2.5 text-sm text-white">
                  <span className="w-4 h-4 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
                  </span>
                  {item}
                </li>
              ))}
            </ul>

            {/* Already have account */}
            <p className="text-center text-sm text-slate-300">
              Already have an account?{' '}
              <a
                href="/pilotshortage/login"
                className="text-red-400 hover:text-white font-semibold transition-colors"
              >
                Sign in
              </a>
            </p>
          </div>

          {/* Neutral disclaimer */}
          <p className="text-center text-xs text-slate-400 mt-4 leading-relaxed">
            Your data is encrypted on your device before it reaches us. We cannot read, modify, or monetize your personal information.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#0a1628] text-white py-8">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            © 2026 pilotshortage.org. All rights reserved. Run by pilots, for pilots.
          </p>
        </div>
      </footer>
    </div>
  );
}
