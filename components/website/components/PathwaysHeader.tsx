import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Bell, User, Settings, LogOut, Building2 } from 'lucide-react';
import { useAuth } from '../../../src/contexts/AuthContext';

interface PathwaysHeaderProps {
  onBack?: () => void;
  onNavigate?: (page: string) => void;
}

export const PathwaysHeader: React.FC<PathwaysHeaderProps> = ({ onBack, onNavigate }) => {
  const { currentUser, userProfile, logout } = useAuth();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    if (isProfileDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isProfileDropdownOpen]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      window.location.href = '/portal';
    }
  };

  const handleLogout = async () => {
    await logout();
    window.location.href = '/';
  };

  return (
    <header className="bg-white/80 border-b border-slate-200/50 backdrop-blur-sm sticky top-0 z-30">
      <div className="container mx-auto pl-2 pr-6 py-4">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-3">
              {/* Back Button */}
              <button
                onClick={handleBack}
                className="p-2 rounded-lg bg-slate-200/50 hover:bg-slate-300/50 text-slate-600 hover:text-slate-900 hover:scale-105 transition-transform"
                title="Back to Home"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
              
              {/* WingMentor Logo */}
              <img 
                src="/logo.png" 
                alt="WingMentor Logo" 
                className="h-14 w-auto object-contain"
              />
              
              <div>
                <h1 className="text-2xl font-bold text-slate-900">
                  pilotrecognition.com
                </h1>
                <p className="text-slate-500 text-sm">powered by Wingmentor</p>
              </div>
            </div>
          </div>

          {/* Right side items */}
          <div className="flex items-center gap-3">
            {/* Building Count */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-slate-100 rounded-lg">
              <Building2 className="w-4 h-4 text-slate-600" />
              <span className="text-sm font-medium text-slate-700">41</span>
              <span className="text-xs text-emerald-600 font-semibold">Stable</span>
            </div>

            <button className="p-2 rounded-lg bg-slate-200/50 hover:bg-slate-300/50 text-slate-600 hover:text-slate-900">
              <Bell className="w-5 h-5" />
            </button>
            
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-emerald-400 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform"
              >
                {userProfile?.profile_image_url ? (
                  <img 
                    src={userProfile.profile_image_url} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-white font-bold text-sm">
                    {currentUser?.email?.charAt(0) || 'U'}
                  </span>
                )}
              </button>

              {/* Profile Dropdown Menu */}
              {isProfileDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50">
                  {/* Profile Header */}
                  <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white">
                    <div className="flex flex-col items-center gap-3">
                      <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center overflow-hidden border-2 border-white/30">
                        {userProfile?.profile_image_url ? (
                          <img 
                            src={userProfile.profile_image_url} 
                            alt="Profile" 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.style.display = 'none';
                            }}
                          />
                        ) : (
                          <User className="w-6 h-6 text-white/80" />
                        )}
                      </div>
                      <div className="text-center">
                        <h3 className="font-semibold text-lg">
                          {userProfile?.pilot_id || currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Pilot'}
                        </h3>
                        <p className="text-sm text-white/80">{currentUser?.email}</p>
                      </div>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="p-4 border-b border-slate-200">
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <div className="text-lg font-bold text-slate-900">
                          {userProfile?.total_flight_hours || 0}
                        </div>
                        <div className="text-xs text-slate-500">Flight Hours</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">
                          {userProfile?.mentorship_hours || 0}
                        </div>
                        <div className="text-xs text-slate-500">Mentorship</div>
                      </div>
                      <div>
                        <div className="text-lg font-bold text-slate-900">
                          {userProfile?.foundation_progress || 0}%
                        </div>
                        <div className="text-xs text-slate-500">Foundation</div>
                      </div>
                    </div>
                  </div>

                  {/* Menu Items */}
                  <div className="p-2">
                    <button 
                      onClick={() => onNavigate?.('portal')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                    >
                      <User className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">View Profile</span>
                    </button>
                    <button 
                      onClick={() => onNavigate?.('settings')}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Settings</span>
                    </button>
                    <button 
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors text-left"
                    >
                      <LogOut className="w-4 h-4 text-slate-500" />
                      <span className="text-sm text-slate-700">Logout</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
