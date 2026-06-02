import React, { useState, useRef, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { useAuth } from '@/src/contexts/AuthContext';
import { supabase } from '@/shared/lib/supabase';
import { MessageSquare, Bell, Settings, Menu, User, Shield, Map, LogOut, ChevronRight } from 'lucide-react';
import ProfileImage from '@/src/components/ProfileImage';

interface PlatformNavbarProps {
  onNavigate: (page: string) => void;
  currentPage?: string;
}

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Recognition Board' },
  { id: 'home', label: 'Home' },
  { id: 'profile', label: 'My Profile' },
  { id: 'wallet', label: 'Credential Wallet' },
  { id: 'pathways', label: 'Pathways' },
  { id: 'programs', label: 'Programs' },
  { id: 'airlines', label: 'Airlines' },
  { id: 'manufacturers', label: 'Manufacturers' },
  { id: 'atlas-cv', label: 'Atlas CV' },
  { id: 'logbook', label: 'Logbook' },
  { id: 'events', label: 'Events' },
  { id: 'newsroom', label: 'Newsroom' },
  { id: 'settings', label: 'Settings' },
];

export const PlatformNavbar: React.FC<PlatformNavbarProps> = ({ onNavigate, currentPage = '' }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [notifCount, setNotifCount] = useState(0);
  const [bellOpen, setBellOpen] = useState(false);
  const [profileDropOpen, setProfileDropOpen] = useState(false);
  const [hamburgerOpen, setHamburgerOpen] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [tcUpdatePending, setTcUpdatePending] = useState(false);
  const [emailVerified, setEmailVerified] = useState<boolean>(true);
  const bellRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const hamburgerRef = useRef<HTMLDivElement>(null);

  const displayName = userProfile?.display_name || userProfile?.full_name || currentUser?.email?.split('@')[0] || 'Pilot';

  // Check email verification status
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: any } }) => {
      if (session?.user) {
        setEmailVerified(!!session.user.email_confirmed_at);
      }
    });
  }, []);

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
      const countResult = await supabase.from('pilot_notifications').select('id', { count: 'exact', head: true }).eq('pilot_id', profileId).eq('is_read', false);
      const dataResult = await supabase.from('pilot_notifications').select('*').eq('pilot_id', profileId).order('created_at', { ascending: false }).limit(10);

      if (countResult.count !== null) setNotifCount(countResult.count);
      if (dataResult.data) setNotifications(dataResult.data);
    };

    fetchNotifs();
    const interval = setInterval(fetchNotifs, 60000);
    return () => clearInterval(interval);
  }, [userProfile?.id]);

  // Close dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (bellRef.current && !bellRef.current.contains(e.target as Node)) setBellOpen(false);
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileDropOpen(false);
      if (hamburgerRef.current && !hamburgerRef.current.contains(e.target as Node)) setHamburgerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNavClick = (id: string) => {
    if (id === 'pathways') {
      onNavigate('pathways-modern');
    } else if (id === 'home') {
      onNavigate('access-portal-2');
    } else if (id === 'profile') {
      onNavigate('recognition-plus');
    } else if (id === 'programs') {
      onNavigate('programs');
    } else {
      onNavigate(id);
    }
  };

  return (
    <div
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4"
      style={{
        height: '68px',
        background: 'linear-gradient(to bottom, rgba(15,23,42,0.95) 0%, rgba(15,23,42,0.85) 50%, rgba(15,23,42,0.6) 80%, transparent 100%)',
        backdropFilter: 'blur(8px)',
      }}
    >
      {/* Left — wordmark */}
      <div className="flex items-center flex-shrink-0">
        <a
          href="/"
          className="text-base sm:text-lg md:text-xl lg:text-2xl font-black cursor-pointer whitespace-nowrap inline-block"
          style={{ fontFamily: 'Arial, Helvetica Neue, sans-serif', letterSpacing: '0.05em' }}
        >
          <span className="text-white inline">pilot</span>
          <span className="text-red-500 inline">recognition</span>
          <span className="text-white inline">.com</span>
        </a>
      </div>

      {/* Centre — primary nav links */}
      <div className="hidden md:flex items-center gap-1 absolute left-1/2 -translate-x-1/2">
        {[
          { id: 'home', label: 'Home' },
          { id: 'profile', label: 'Profile' },
          { id: 'pathways', label: 'Pathways' },
          { id: 'programs', label: 'Programs' },
        ].map(({ id, label }) => (
          <button
            key={id}
            onClick={() => handleNavClick(id)}
            className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all whitespace-nowrap ${
              currentPage === id
                ? 'bg-white/15 text-white'
                : 'text-white/60 hover:text-white hover:bg-white/10'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right — MSFS-style square tile icon toolbar */}
      <div className="flex items-center gap-2 flex-shrink-0">
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
                  onClick={() => { setBellOpen(v => !v); setProfileDropOpen(false); setHamburgerOpen(false); }}
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
                {bellOpen && (
                  <div className="absolute right-0 top-12 w-80 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Activity</p>
                      <p className="text-sm font-black text-white">Notifications</p>
                    </div>
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

              {/* Avatar tile + dropdown */}
              <div className="relative" ref={profileRef}>
                <button
                  onClick={() => { setProfileDropOpen(v => !v); setBellOpen(false); setHamburgerOpen(false); }}
                  className="transition-all duration-150 flex items-center gap-2 px-2"
                  style={{
                    height: 44,
                    background: profileDropOpen ? 'rgba(75,85,99,0.95)' : 'rgba(55,65,81,0.85)',
                    border: profileDropOpen ? '2px solid rgba(255,255,255,0.8)' : '2px solid rgba(255,255,255,0.12)',
                    borderRadius: 10,
                  }}
                  onMouseEnter={e => { if (!profileDropOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.7)'; (e.currentTarget as HTMLElement).style.background = 'rgba(75,85,99,0.95)'; }}}
                  onMouseLeave={e => { if (!profileDropOpen) { (e.currentTarget as HTMLElement).style.borderColor = 'rgba(255,255,255,0.12)'; (e.currentTarget as HTMLElement).style.background = 'rgba(55,65,81,0.85)'; }}}
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
                {profileDropOpen && (
                  <div className="absolute right-0 top-10 w-64 z-50 shadow-2xl" style={{ background: 'rgba(15,23,42,0.97)', border: '1px solid rgba(255,255,255,0.1)', backdropFilter: 'blur(16px)' }}>
                    <div className="px-4 pt-3 pb-2 border-b border-white/5">
                      <p className="text-[9px] font-black tracking-[0.2em] text-white/30 uppercase">Account</p>
                      <p className="text-sm font-black text-white truncate">{displayName}</p>
                      <p className="text-[10px] text-white/40 truncate">{userProfile?.email || currentUser?.email}</p>
                    </div>
                    <div className="py-1">
                      {[
                        { label: 'Edit Profile', tab: 'profile', icon: User },
                        { label: 'My Wallet', tab: 'wallet', icon: Shield },
                        { label: 'Pathways', tab: 'pathways', icon: Map },
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
                      <button onClick={() => { setProfileDropOpen(false); logout(); onNavigate('home'); }} className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-red-500/10 transition-colors group">
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
        {/* Hamburger dropdown */}
        <div className="relative" ref={hamburgerRef}>
          <button
            onClick={() => { setHamburgerOpen(v => !v); setBellOpen(false); setProfileDropOpen(false); }}
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
