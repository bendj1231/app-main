import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { safeRedirect } from '@/lib/url-validator';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { useAuth } from '@/contexts/AuthContext';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import ProfileImage from '@/components/ProfileImage';
import { MessagesPanel } from '@/components/website/components/unified-platform/MessagesPanel';
import { NotificationsFeedPanel } from '@/components/website/components/unified-platform/shared';
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
  MessageSquare,
  Home,
  LogOut,
  ChevronRight,
  Shield,
  Map,
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
  isVerified = false
}) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { currentUser, userProfile, logout } = useAuth();
  const { user: auth0User } = useAuth0();
  const { callApi } = useWorkerAuth();
  const displayName = userProfile?.display_name || userProfile?.full_name || currentUser?.email?.split('@')[0] || 'Pilot';
  const profileImageUrl = userProfile?.profile_image_url || auth0User?.picture || undefined;
  const profileImagePublicId = userProfile?.profile_image_public_id || undefined;

  const [isScrolled, setIsScrolled] = useState(false);
  const [isEnterpriseModalOpen, setIsEnterpriseModalOpen] = useState(false);

  const [chatOpen, setChatOpen] = useState(false);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tcUpdatePending, setTcUpdatePending] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const chatRef = useRef<HTMLDivElement>(null);
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setEmailVerified(!!auth0User?.email_verified);
  }, [auth0User?.email_verified]);

  useEffect(() => {
    const CURRENT_TC_VERSION = 'v2-2026';
    if (userProfile?.consent_version && userProfile.consent_version !== CURRENT_TC_VERSION) {
      setTcUpdatePending(true);
    }
  }, [userProfile?.consent_version]);

  useEffect(() => {
    const profileId = userProfile?.id;
    if (!profileId) return;
    const fetchNotifs = async () => {
      const allNotifs = await callApi<Record<string, unknown>[]>('queryTable', {
        table: 'pilot_notifications',
        operation: 'select',
        where: { pilot_id: profileId },
        limit: 500,
      });
      const unread = (allNotifs || []).filter((n: any) => !n.is_read);
      const sorted = (allNotifs || []).sort((a: any, b: any) => {
        const ca = a.created_at || '';
        const cb = b.created_at || '';
        return cb.localeCompare(ca);
      }).slice(0, 10);
      setNotifCount(unread.length);
      setNotifications(sorted);
    };
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [userProfile?.id]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (chatRef.current && !chatRef.current.contains(e.target as Node)) setChatOpen(false);
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileDropOpen(false);
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)) setHamburgerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    const toPlatform = (tab: string) => {
      localStorage.removeItem('careerpathways_mode');
      window.location.href = `${window.location.origin}/platform?tab=${tab}`;
    };
    if (id === 'home') toPlatform('home');
    else if (id === 'profile') toPlatform('profile');
    else if (id === 'logbook') toPlatform('logbook');
    else if (id === 'bookmarks') toPlatform('bookmarks');
    else if (id === 'recognition-plus') toPlatform('recognition-plus');
    else if (id === 'settings') toPlatform('settings');
    else if (id === 'notifications') navigate('/notifications');
    else navigate(id);
  };

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { label: 'Home', path: '/', icon: Home, tier: 'public', external: '/platform?tab=home' },
    { label: 'Expectations', path: '/airline-expectations', icon: Building2, tier: 'public' },
    { label: 'type-ratings', path: '/type-ratings', icon: Target, tier: 'public' },
    { label: 'pathways', path: '/discover', icon: Target, tier: 'public' },
    { label: 'Recognition+', path: '/authorities', icon: Building2, tier: 'public', external: '/platform?tab=recognition-plus-tab' },
  ];

  const isActive = (path: string) => {
    if (path === '/') {
      // Home is an external link to the unified platform — never "active" here
      return false;
    }
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
            {navLinks.map((link, index) => {
              const active = isActive(link.path);
              const baseClass = `relative px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all select-none flex items-center gap-1.5 ${
                active
                  ? 'text-white bg-white/10'
                  : 'text-white/60 hover:text-white hover:bg-white/5'
              }`;

              return (
                <React.Fragment key={link.path}>
                  {index === 1 && (
                    <div
                      className="w-px h-5 self-center mx-1"
                      style={{
                        background: 'linear-gradient(to bottom, transparent, rgba(255,255,255,0.25), transparent)',
                      }}
                    />
                  )}
                  {link.external ? (
                    <a
                      href={link.external.startsWith('/') ? `${window.location.origin}${link.external}` : link.external}
                      onClick={(e) => {
                        e.preventDefault();
                        localStorage.removeItem('careerpathways_mode');
                        const url = link.external!.startsWith('/') ? `${window.location.origin}${link.external}` : link.external;
                        window.location.href = url;
                      }}
                      className={baseClass}
                    >
                      {link.label}
                    </a>
                  ) : (
                    <Link
                      to={link.path}
                      className={baseClass}
                    >
                      {link.label}
                      {active && (
                        <span className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full bg-red-500" />
                      )}
                    </Link>
                  )}
                </React.Fragment>
              );
            })}
          </nav>

          {/* Right — MSFS-style square tile icon toolbar (mirrors PlatformNavbar exactly) */}
          <div className="flex items-center gap-2 flex-shrink-0" style={{ transform: 'translateY(-2px)' }}>
            {currentUser ? (
              <>
                <div className="flex items-center gap-2">
                  {/* Messages tile */}
                  <button
                    onClick={() => { setChatOpen(v => !v); setBellOpen(false); setProfileDropOpen(false); setHamburgerOpen(false); }}
                    onMouseDown={(e) => e.stopPropagation()}
                    title="Messages"
                    className="relative group transition-all duration-150"
                    style={{
                      width: 44, height: 44,
                      background: chatOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                      border: chatOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={e => { if (!chatOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                    onMouseLeave={e => { if (!chatOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
                  >
                    <MessageSquare size={20} className="text-white" strokeWidth={2} />
                  </button>

                  <div ref={chatRef}>
                    <MessagesPanel isOpen={chatOpen} onClose={() => setChatOpen(false)} />
                  </div>

                  {/* Notification bell tile */}
                  <div className="relative" ref={bellRef}>
                    <button
                      title="Notifications"
                      onClick={() => { setBellOpen(v => !v); setProfileDropOpen(false); setHamburgerOpen(false); setChatOpen(false); }}
                      className="relative transition-all duration-150"
                      style={{
                        width: 44, height: 44,
                        background: bellOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                        border: bellOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                        borderRadius: 10,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}
                      onMouseEnter={e => { if (!bellOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                      onMouseLeave={e => { if (!bellOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
                    >
                      <Bell size={20} className="text-white" strokeWidth={2} />
                      {(notifCount > 0 || tcUpdatePending || !emailVerified) && (
                        <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: '#f59e0b', border: '1.5px solid rgba(15,22,35,0.9)' }}>
                          {notifCount > 0 ? (notifCount > 9 ? '9+' : notifCount) : '!'}
                        </span>
                      )}
                    </button>
                    <AnimatePresence>
                      {bellOpen && (
                        <>
                          <motion.div
                            className="fixed inset-0 z-[60]"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2 }}
                            style={{ background: 'rgba(2,6,23,0.35)' }}
                            onClick={() => setBellOpen(false)}
                          />
                          <motion.div
                            className="absolute right-0 top-12 w-[24rem] z-[70] shadow-2xl rounded-2xl overflow-hidden"
                            initial={{ opacity: 0, scale: 0.92, y: -8, filter: 'blur(8px)' }}
                            animate={{ opacity: 1, scale: 1, y: 0, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, scale: 0.95, y: -4, filter: 'blur(6px)' }}
                            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                            style={{
                              background: 'rgba(255,255,255,0.92)',
                              border: '1px solid rgba(255,255,255,0.6)',
                              backdropFilter: 'blur(32px) saturate(1.6)',
                              WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
                              boxShadow: '0 24px 64px -12px rgba(0,0,0,0.25), 0 0 0 1px rgba(255,255,255,0.4)',
                            }}
                          >
                            <NotificationsFeedPanel
                              profileId={userProfile?.id}
                              profile={userProfile as any}
                              onClose={() => setBellOpen(false)}
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Settings tile */}
                  <button
                    onClick={() => handleNavClick('settings')}
                    title="Settings"
                    className="transition-all duration-150"
                    style={{
                      width: 44, height: 44,
                      background: 'rgba(55,65,81,0.85)',
                      border: '2px solid rgba(255,255,255,0.12)',
                      borderRadius: 10,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}
                  >
                    <Settings size={20} className="text-white" strokeWidth={2} />
                  </button>

                  {/* Avatar + Hamburger unified island */}
                  <div className="relative flex items-center" ref={profileRef} onMouseDown={(e) => e.stopPropagation()}>
                    <div
                      className="flex items-center transition-all duration-150 overflow-hidden"
                      style={{
                        height: 44,
                        background: profileDropOpen || hamburgerOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                        border: profileDropOpen || hamburgerOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                        borderRadius: 10,
                      }}
                      onMouseEnter={(e) => {
                        if (!profileDropOpen && !hamburgerOpen) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)';
                        }
                      }}
                      onMouseLeave={(e) => {
                        if (!profileDropOpen && !hamburgerOpen) {
                          (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)';
                          (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)';
                        }
                      }}
                    >
                      {/* Profile side */}
                      <button
                        onClick={() => { setProfileDropOpen((v) => !v); setBellOpen(false); setHamburgerOpen(false); setChatOpen(false); }}
                        className="flex items-center gap-2 px-2 h-full transition-colors hover:bg-white/5"
                      >
                        <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
                          <ProfileImage url={profileImageUrl} publicId={profileImagePublicId} name={displayName} size={28} className="w-full h-full" fallbackClassName="rounded-full text-[10px]" />
                        </div>
                        <span className="hidden sm:block text-xs font-bold text-white truncate max-w-[72px]">{displayName.split(' ')[0]}</span>
                      </button>

                      {/* Divider */}
                      <div className="w-px h-5" style={{ background: 'rgba(255,255,255,0.15)' }} />

                      {/* Hamburger side */}
                      <button
                        onClick={() => { setHamburgerOpen((v) => !v); setBellOpen(false); setProfileDropOpen(false); setChatOpen(false); }}
                        className="px-2 h-full transition-colors hover:bg-white/5 flex items-center justify-center"
                        style={{ width: 40 }}
                      >
                        <Menu size={20} className="text-white" strokeWidth={2} />
                      </button>
                    </div>

                    {/* Profile dropdown */}
                    {profileDropOpen && (
                      <div className="absolute right-0 top-12 w-72 z-50 shadow-2xl overflow-hidden rounded-xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                        <div className="px-4 pt-3 pb-2.5 border-b border-white/5">
                          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Account</p>
                          <p className="text-sm font-black text-white truncate">{displayName}</p>
                          <p className="text-[10px] text-white/40 truncate leading-relaxed">{userProfile?.email || currentUser?.email}</p>
                        </div>
                        <div className="py-1">
                          {[
                            { label: 'Edit Profile', tab: 'profile', icon: User },
                            { label: 'Logbook', tab: 'logbook', icon: Shield },
                            { label: 'Bookmarks', tab: 'bookmarks', icon: Map },
                            { label: 'Recognition+', tab: 'recognition-plus', icon: Settings },
                            { label: 'Settings', tab: 'settings', icon: Settings },
                          ].map(({ label, tab, icon: Icon }) => (
                            <button key={tab} onClick={() => { handleNavClick(tab); setProfileDropOpen(false); }} className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/5 transition-colors group">
                              <div className="flex items-center gap-3">
                                <Icon size={13} className="text-white/40 group-hover:text-white/70 transition-colors" />
                                <span className="text-[11px] font-black text-white/70 group-hover:text-white tracking-wide transition-colors">{label.toUpperCase()}</span>
                              </div>
                              <ChevronRight size={12} className="text-white/20 group-hover:text-white/50 transition-colors" />
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-white/5 py-1">
                          <button onClick={() => { setProfileDropOpen(false); logout(); handleNavClick('home'); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                            <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                            <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Hamburger dropdown */}
                    {hamburgerOpen && (
                      <div className="absolute right-0 top-12 w-56 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                        <div className="px-4 pt-3 pb-2 border-b border-white/5">
                          <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Navigation</p>
                        </div>
                        <div className="py-1">
                          {navLinks.map(link => (
                            <button key={link.path} onClick={() => { link.external ? window.location.href = link.external : navigate(link.path); setHamburgerOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                              <span className="text-[11px] font-black text-white/60 group-hover:text-white tracking-wide transition-colors">{link.label.toUpperCase()}</span>
                            </button>
                          ))}
                        </div>
                        <div className="border-t border-white/5 py-1">
                          <button onClick={() => { setHamburgerOpen(false); logout(); handleNavClick('home'); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                            <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                            <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : (
              <>
                <button
                  onClick={() => window.dispatchEvent(new CustomEvent('open-login-modal'))}
                  className="px-4 py-1.5 text-xs font-bold tracking-wider text-white rounded-lg transition-all"
                  style={{ background: 'rgba(59,130,246,0.8)', border: '1px solid rgba(59,130,246,0.5)' }}
                >
                  LOGIN
                </button>
                <button
                  onClick={() => { safeRedirect('/become-member'); }}
                  className="px-4 py-1.5 text-xs font-bold tracking-wider text-white rounded-lg transition-all"
                  style={{ background: 'rgba(239,68,68,0.8)', border: '1px solid rgba(239,68,68,0.5)' }}
                >
                  BECOME A MEMBER
                </button>
              </>
            )}
          </div>
        </div>
      </div>

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
