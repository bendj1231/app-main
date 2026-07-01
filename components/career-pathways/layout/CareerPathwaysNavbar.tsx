import React, { useState, useEffect } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { useLocation, Link } from 'react-router-dom';
import {
  Target,
  User,
  Menu,
  X,
  Building2,
  ExternalLink,
  Bell,
  Settings,
  Wallet,
  ShieldCheck,
  MessageSquare
} from 'lucide-react';

interface CareerPathwaysNavbarProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
  userAvatar?: string;
  isVerified?: boolean;
}

export const CareerPathwaysNavbar: React.FC<CareerPathwaysNavbarProps> = ({
  onLogin,
  isLoggedIn = false,
  userName,
  userAvatar,
  isVerified = false
}) => {
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Expectations', path: '/airline-expectations', icon: Building2, tier: 'public' },
    { label: 'type-ratings', path: '/type-ratings', icon: Target, tier: 'public' },
    { label: 'pathways', path: '/discover', icon: Target, tier: 'public' },
    { label: 'recognition+', path: '/authorities', icon: Building2, tier: 'public', external: 'http://localhost:3000/platform?tab=recognition-plus-tab' },
  ];

  const isActive = (path: string) => {
    if (path === '/discover') {
      return location.pathname === '/discover' || location.pathname === '/' || location.pathname === '/pathways';
    }
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  return (
    <>
      {/* Cross-domain Partner Navigation — hidden when logged in */}
      {!isLoggedIn && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-10 bg-gray-900 border-b border-gray-700 flex items-center justify-center gap-8 px-4">
          {/* PilotShortage */}
          <div className="relative group">
            <a
              href="https://pilotshortage.org"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              Pilot<span className="text-red-500">Shortage</span>.org
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Industry Partner</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Working together to address the global pilot shortage. Connecting qualified pilots with airlines worldwide.
                </p>
              </div>
            </div>
          </div>
          {/* PilotRecognition */}
          <div className="relative group">
            <a
              href="https://pilotrecognition.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              pilot<span className="text-red-500">recognition</span>.com
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Verified Recognition</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Turn your logbook into a verified credential meeting international standards from operators and ATOs.
                </p>
              </div>
            </div>
          </div>
          {/* PilotTerminal */}
          <div className="relative group">
            <a
              href="https://pilotterminal.com"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-sm font-medium text-white hover:text-white transition-colors"
            >
              Pilot<span className="text-red-500">Terminal</span>.com
              <ExternalLink className="w-3 h-3 text-gray-500" />
            </a>
            <div className="absolute top-full left-1/2 -translate-x-1/2 w-64 bg-[#1a1a1b] border border-gray-800 rounded-lg shadow-xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 mt-1">
              <div className="p-3">
                <p className="text-xs text-gray-400 mb-2">Community Forum</p>
                <p className="text-xs text-gray-300 leading-relaxed">
                  Real-time discussions with verified pilots worldwide. No bots, no recruiters — just aviators.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <header
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          isLoggedIn ? 'top-0' : 'top-10'
        } ${
          isScrolled
            ? 'bg-gradient-to-b from-slate-950 via-slate-950/95 to-slate-900/90 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/20'
            : 'bg-gradient-to-b from-slate-950/90 via-slate-950/70 to-transparent backdrop-blur-md'
        }`}
      >
        <div className="w-full">
          <div className="flex items-center justify-between h-16 px-4">
          {/* Logo - Far Left */}
          <Link 
            to="/discover"
            className="flex items-center group shrink-0"
          >
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none group-hover:opacity-90 transition-opacity">
              pilotcareer<span className="text-red-500">pathways</span>.com
            </h1>
          </Link>

          {/* Desktop Navigation — center island style */}
          <nav className="hidden lg:flex items-center gap-1 rounded-2xl bg-white/5 border border-white/10 px-2 py-1.5 backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              const baseClass = `relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all select-none flex items-center gap-1.5 ${
                active
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`;

              return link.external ? (
                <a
                  key={link.path}
                  href={link.external}
                  onClick={(e) => { e.preventDefault(); window.location.href = link.external!; }}
                  className={baseClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  className={baseClass}
                >
                  {link.label}
                  {active && (
                    <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-red-500" />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* CTA / User */}
          <div className="flex items-center gap-3 shrink-0">
            {isLoggedIn ? (
              <div className="flex items-center gap-2">
                {/* Chat */}
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all">
                  <MessageSquare className="w-5 h-5" />
                </button>
                {/* Notifications */}
                <button className="relative w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all">
                  <Bell className="w-5 h-5" />
                  <span className="absolute top-2 right-2.5 w-2 h-2 bg-red-500 rounded-full" />
                </button>
                {/* Settings */}
                <button className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all">
                  <Settings className="w-5 h-5" />
                </button>
                {/* Profile */}
                <Link
                  to="/dashboard"
                  className="flex items-center gap-2 px-2 py-1.5 pr-3 rounded-xl border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white/80 hover:text-white text-sm font-medium transition-all"
                >
                  {userAvatar ? (
                    <img 
                      src={userAvatar} 
                      alt="Profile" 
                      className="w-8 h-8 rounded-full object-cover border border-white/20"
                    />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                  <span className="max-w-[100px] truncate hidden md:block">{userName || 'Pilot'}</span>
                </Link>
                {/* Hamburger */}
                <button
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  className="w-10 h-10 rounded-xl flex items-center justify-center text-white/60 hover:text-white border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 transition-all"
                >
                  {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                </button>
              </div>
            ) : (
              <>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                  className="hidden sm:block px-4 py-2 rounded-lg bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 text-slate-200 text-sm font-medium hover:bg-slate-800/70 hover:border-slate-600/50 transition-all"
                >
                  Sign In
                </button>
                <Link
                  to="/get-started"
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-red-600 hover:bg-red-700 text-white text-sm font-bold uppercase tracking-wider shadow-lg shadow-red-500/25 hover:shadow-red-500/40 transition-all"
                >
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </Link>
              </>
            )}

          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-lg border-b border-slate-800/50 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => {
              const baseClass = `block w-full px-4 py-3 rounded-lg text-sm font-medium transition-all flex items-center justify-between ${
                isActive(link.path)
                  ? 'text-white bg-blue-900/60'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`;

              return link.external ? (
                <a
                  key={link.path}
                  href={link.external}
                  onClick={(e) => { e.preventDefault(); window.location.href = link.external!; setIsMobileMenuOpen(false); }}
                  className={baseClass}
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={baseClass}
                >
                  {link.label}
                </Link>
              );
            })}
            {!isLoggedIn && (
              <div className="pt-3 border-t border-slate-800/50 mt-3">
                <button
                  onClick={() => {
                    onLogin?.();
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-800/50 transition-all"
                >
                  <User className="w-5 h-5" />
                  Sign In
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </header>

      {/* Enterprise Modal */}
      {isEnterpriseModalOpen && (
        <div
          className="fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md"
          onClick={() => setIsEnterpriseModalOpen(false)}
        >
          <div
            className="relative w-full max-w-3xl overflow-hidden rounded-2xl shadow-[0_40px_80px_rgba(0,0,0,0.5)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header bar */}
            <div className="relative bg-white border-b border-slate-200 px-8 py-6">
              <button
                onClick={() => setIsEnterpriseModalOpen(false)}
                className="absolute top-5 right-5 text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <p className="text-[10px] font-bold tracking-[0.35em] uppercase text-blue-500 mb-1.5">For Airlines, ATOs & Operators</p>
              <h2 className="text-2xl font-bold text-slate-900">
                <span className="text-slate-500 text-lg">powered by </span><span className="text-slate-900">pilot</span><span className="text-red-600">recognition</span><span className="text-slate-900"> Enterprise</span>
              </h2>
              <p className="text-slate-500 text-sm mt-1.5 max-w-lg">
                Pull verified pilots. Publish pathway requirements. Access the live recognition database.
              </p>
            </div>

            {/* Two-column panels */}
            <div className="grid grid-cols-1 md:grid-cols-2 bg-white">
              {/* Panel 1 — Read More */}
              <button
                onClick={() => {
                  setIsEnterpriseModalOpen(false);
                  window.open('https://enterprise.pilotrecognition.com', '_blank', 'noopener,noreferrer');
                }}
                className="group flex flex-col justify-between p-8 text-left hover:bg-slate-50 transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-slate-100 group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
                    <svg className="w-6 h-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 mb-2 transition-colors">Learn About Enterprise</h3>
                  <p className="text-sm text-slate-500 leading-relaxed mb-4">
                    Discover how airlines, ATOs, and aviation operators use PilotRecognition to find verified candidates, publish pathway requirements, and access the recognition database.
                  </p>
                  <ul className="space-y-2">
                    {['Pull-based verified pilot recruitment', 'Publish live pathway requirements', 'Access recognition scores & credentials', 'Enterprise API & dashboard access'].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-slate-500">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400 group-hover:text-blue-600 transition-colors">
                  <span>Read More</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>

              {/* Panel 2 — Enterprise Login */}
              <button
                onClick={() => {
                  setIsEnterpriseModalOpen(false);
                  safeRedirect('/enterprise-login');
                }}
                className="group flex flex-col justify-between p-8 text-left bg-blue-50 hover:bg-blue-100 transition-all"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 group-hover:bg-white flex items-center justify-center mb-4 transition-colors">
                    <svg className="w-6 h-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 group-hover:text-blue-700 mb-2 transition-colors">Enterprise Login</h3>
                  <p className="text-sm text-blue-700/70 leading-relaxed mb-4">
                    Already have an enterprise account? Sign in to your portal to manage pathways, view verified pilot profiles, and access your recruitment dashboard.
                  </p>
                  <ul className="space-y-2">
                    {['Manage your pathway listings', 'View matched pilot profiles', 'Access your recruitment pipeline', 'Download recognition reports'].map((item) => (
                      <li key={item} className="flex items-start gap-2 text-xs text-blue-600/70">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400 mt-1.5 flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="mt-6 flex items-center gap-2 text-sm font-medium text-blue-600/70 group-hover:text-blue-700 transition-colors">
                  <span>Sign In</span>
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </div>
              </button>
            </div>

            {/* Footer */}
            <div className="bg-slate-50 border-t border-slate-200 px-8 py-3 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                Enterprise accounts are separate from pilot accounts.
              </p>
              <button
                onClick={() => { setIsEnterpriseModalOpen(false); }}
                className="text-[11px] text-blue-500 hover:text-blue-700 font-medium transition-colors"
              >
                Contact Sales →
              </button>
            </div>
          </div>
        </div>
      )}

    </>
  );
};

export default CareerPathwaysNavbar;
