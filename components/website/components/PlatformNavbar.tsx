import React, { useState, useRef, useEffect } from 'react';
import { safeRedirect } from '@/lib/url-validator';
import { useAuth } from '@/contexts/AuthContext';
import { useAuth0 } from '@auth0/auth0-react';
import { useWorkerAuth } from '@/hooks/useWorkerAuth';
import { MessageSquare, Bell, Settings, Menu, User, Shield, Map, LogOut, ChevronRight, Lock } from 'lucide-react';
import ProfileImage from '@/components/ProfileImage';

interface PlatformNavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

const NAV_ITEMS = [
  { id: 'home', label: 'Home' },
  { id: 'dashboard', label: 'Flight Deck' },
  { id: 'profile', label: 'Profile' },
  { id: 'logbook', label: 'Flight Bag' },
  { id: 'bookmarks', label: 'Bookmarks' },
  { id: 'recognition-plus', label: 'Recognition+' },
  { id: 'settings', label: 'Settings' },
];

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({ onNavigate, currentPage = '' }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const { user: auth0User } = useAuth0();
  const { callApi } = useWorkerAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tcUpdatePending, setTcUpdatePending] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const bellRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const displayName = userProfile?.display_name || userProfile?.full_name || currentUser?.email?.split('@')[0] || 'Pilot';
  const isProfileComplete = !!(userProfile?.full_name && userProfile?.current_occupation && userProfile?.license_type);

  // Check email verification status
  useEffect(() => {
    setEmailVerified(!!auth0User?.email_verified);
  }, [auth0User?.email_verified]);

  // Check if T&C version has been updated
  useEffect(() => {
    const CURRENT_TC_VERSION = 'v2-2026';
    if (userProfile?.consent_version && userProfile.consent_version !== CURRENT_TC_VERSION) {
      setTcUpdatePending(true);
    }
  }, [userProfile?.consent_version]);

  // Fetch notification count
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

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)) setHamburgerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    if (id === 'home') {
      onNavigate('access-portal-2');
    } else if (id === 'profile') {
      onNavigate('profile');
    } else if (id === 'logbook') {
      onNavigate('logbook');
    } else if (id === 'bookmarks') {
      onNavigate('bookmarks');
    } else if (id === 'recognition-plus') {
      onNavigate('/platform?tab=recognition-plus');
    } else {
      onNavigate(id);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 md:px-8 lg:px-10"
      style={{
        height: '68px',
        background: 'linear-gradient(to bottom, rgba(15,23,42,1) 0%, rgba(0,0,0,0.98) 100%)',
        borderBottom: '1px solid rgba(255,255,255,0.06)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left — wordmark */}
      <div className="flex items-center flex-shrink-0 min-w-0">
        <a
          href="/"
          className="text-sm sm:text-base md:text-lg lg:text-xl xl:text-2xl font-black cursor-pointer whitespace-nowrap inline-block pl-1 truncate"
          style={{ fontFamily: 'Arial, Helvetica Neue, sans-serif', letterSpacing: '0.05em' }}
        >
          <span className="text-white inline">pilot</span>
          <span className="text-red-500 inline">recognition</span>
          <span className="text-white inline">.com</span>
        </a>
      </div>

      {currentPage !== 'home' && (
        <React.Fragment>
          {/* Center — primary nav links (full size on lg+ only to avoid overlap) */}
      <div className="hidden lg:flex flex-1 items-center justify-center min-w-0 mx-2 md:mx-4">
        <div className="flex items-center gap-1 overflow-hidden">
          {[
            { id: 'home', label: 'Home' },
            { id: 'dashboard', label: 'Flight Deck' },
            { id: 'profile', label: 'Profile' },
            { id: 'logbook', label: 'Flight Bag' },
            { id: 'bookmarks', label: 'Bookmarks' },
            { id: 'recognition-plus', label: 'Recognition+' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`px-2 md:px-3 lg:px-4 py-2 rounded-lg text-xs md:text-sm font-semibold transition-all whitespace-nowrap ${
                currentPage === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Compact center nav for medium screens where full nav won't fit */}
      <div className="hidden md:flex lg:hidden flex-1 items-center justify-center min-w-0 mx-2">
        <div className="flex items-center gap-1 overflow-hidden">
          {[
            { id: 'home', label: 'Home' },
            { id: 'dashboard', label: 'Flight Deck' },
            { id: 'logbook', label: 'Flight Bag' },
            { id: 'recognition-plus', label: 'Recognition+' },
          ].map(({ id, label }) => (
            <button
              key={id}
              onClick={() => handleNavClick(id)}
              className={`px-3 py-2 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                currentPage === id
                  ? 'bg-white/15 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/10'
              }`}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </React.Fragment>
  )}

      {/* Right — MSFS-style square tile icon toolbar */}
      <div className="flex items-center gap-2 flex-shrink-0" style={{ transform: 'translateY(-2px)' }}>
        {currentUser ? (
          <>
            <div className="flex items-center gap-2">
              {/* Messages tile */}
              <button
                onClick={() => handleNavClick('notifications')}
                title="Messages"
                className="relative group transition-all duration-150"
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
                <MessageSquare size={20} className="text-white" strokeWidth={2} />
              </button>

              {/* Notification bell tile */}
              <div className="relative" ref={bellRef}>
                <button
                  title="Notifications"
                  onClick={() => { setBellOpen(v => !v); setHamburgerOpen(false); }}
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
                  {isProfileComplete && (notifCount > 0 || tcUpdatePending || !emailVerified) && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-black text-white" style={{ background: '#f59e0b', border: '1.5px solid rgba(15,22,35,0.9)' }}>
                      {notifCount > 0 ? (notifCount > 9 ? '9+' : notifCount) : '!'}
                    </span>
                  )}
                </button>
                {bellOpen && (
                  <div className="absolute right-0 top-12 w-80 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
                      <p className="text-sm font-black text-white">Notifications</p>
                    </div>
                    {!isProfileComplete ? (
                      <div className="px-5 py-6 text-center">
                        <div className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3" style={{ background: 'rgba(220,38,38,0.1)', border: '1px solid rgba(220,38,38,0.2)' }}>
                          <Lock size={24} className="text-red-400" />
                        </div>
                        <p className="text-sm font-black text-white mb-1">Complete Your Profile</p>
                        <p className="text-[11px] text-white/50 leading-relaxed mb-3">
                          Add your name, license type, and occupation to unlock notifications and pathway alerts.
                        </p>
                        <div className="space-y-1.5 text-left max-w-xs mx-auto">
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <span className={`text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ${userProfile?.full_name ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>{userProfile?.full_name ? '✓' : '1'}</span>
                            <span className="text-[10px] text-white/70">Full Name</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <span className={`text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ${userProfile?.current_occupation ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>{userProfile?.current_occupation ? '✓' : '2'}</span>
                            <span className="text-[10px] text-white/70">Current Occupation</span>
                          </div>
                          <div className="flex items-center gap-2 px-2.5 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.05)' }}>
                            <span className={`text-[8px] font-black w-4 h-4 rounded-full flex items-center justify-center ${userProfile?.license_type ? 'bg-emerald-500/20 text-emerald-400' : 'bg-white/10 text-white/40'}`}>{userProfile?.license_type ? '✓' : '3'}</span>
                            <span className="text-[10px] text-white/70">License Type</span>
                          </div>
                        </div>
                        <button
                          onClick={() => { setBellOpen(false); onNavigate('profile'); }}
                          className="mt-4 w-full py-2 rounded-xl text-[10px] font-black text-white transition-all hover:brightness-110"
                          style={{ background: '#dc2626' }}
                        >
                          COMPLETE ADVANCED PROFILE →
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="max-h-64 overflow-y-auto">
                          {notifications.length === 0 ? (
                            <div className="px-4 py-6 text-center">
                              <p className="text-white/40 text-sm">No new notifications</p>
                            </div>
                          ) : (
                            notifications.map((n) => (
                              <div key={n.id} className="px-4 py-3 border-b border-white/5 hover:bg-white/5 transition-colors">
                                <p className="text-white text-sm font-medium">{n.title}</p>
                                <p className="text-white/50 text-xs">{n.message}</p>
                              </div>
                            ))
                          )}
                        </div>
                        <button onClick={() => { setBellOpen(false); handleNavClick('notifications'); }} className="w-full px-4 py-2.5 text-[10px] font-black tracking-wider text-sky-400 hover:text-sky-300 border-t border-white/5 text-center transition-colors">
                          VIEW ALL NOTIFICATIONS →
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {/* Settings tile */}
              <button
                onClick={() => handleNavClick('settings')}
                title="Settings"
                className="transition-all duration-150"
                style={{
                  width: 44, height: 44,
                  background: currentPage === 'settings' ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                  border: currentPage === 'settings' ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                onMouseEnter={e => { if (currentPage !== 'settings') { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                onMouseLeave={e => { if (currentPage !== 'settings') { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
              >
                <Settings size={20} className="text-white" strokeWidth={2} />
              </button>

              {/* Avatar tile — navigates to settings */}
              <button
                onClick={() => { handleNavClick('settings'); setBellOpen(false); setHamburgerOpen(false); }}
                className="transition-all duration-150 flex items-center gap-2 px-2"
                style={{
                  height: 44,
                  background: 'rgba(55,65,81,0.85)',
                  border: '2px solid rgba(255,255,255,0.12)',
                  borderRadius: 10,
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}
              >
                <div className="w-7 h-7 rounded-full overflow-hidden flex-shrink-0" style={{ border: '1.5px solid rgba(255,255,255,0.3)' }}>
                  <ProfileImage
                    url={userProfile?.profile_image_url}
                    publicId={userProfile?.profile_image_public_id}
                    name={displayName}
                    size={28}
                    className="w-full h-full"
                    fallbackClassName="rounded-full text-[10px]"
                  />
                </div>
                <span className="hidden sm:block text-xs font-bold text-white truncate max-w-[72px]">{displayName.split(' ')[0]}</span>
              </button>
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
        {/* Hamburger dropdown */}
        <div className="relative" ref={hamburgerRef}>
          <button
            onClick={() => { setHamburgerOpen(v => !v); setBellOpen(false); }}
            className="transition-all duration-150"
            style={{
              width: 44, height: 44,
              background: hamburgerOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
              border: hamburgerOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
            onMouseEnter={e => { if (!hamburgerOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
            onMouseLeave={e => { if (!hamburgerOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
          >
            <Menu size={20} className="text-white" strokeWidth={2} />
          </button>
          {hamburgerOpen && (
            <div className="absolute right-0 top-10 w-56 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
              <div className="px-4 pt-3 pb-2 border-b border-white/5">
                <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Navigation</p>
              </div>
              <div className="py-1">
                {NAV_ITEMS.map(item => (
                  <button key={item.id} onClick={() => { handleNavClick(item.id); setHamburgerOpen(false); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors group">
                    <span className="text-[11px] font-black text-white/60 group-hover:text-white tracking-wide transition-colors">{item.label.toUpperCase()}</span>
                  </button>
                ))}
              </div>
              {currentUser && (
                <div className="border-t border-white/5 py-1">
                  <button onClick={() => { setHamburgerOpen(false); logout(); onNavigate('home'); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
                    <LogOut size={13} className="text-red-400/60 group-hover:text-red-400 transition-colors" />
                    <span className="text-[11px] font-black text-red-400/60 group-hover:text-red-400 tracking-wide transition-colors">SIGN OUT</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
</div>
);
};
