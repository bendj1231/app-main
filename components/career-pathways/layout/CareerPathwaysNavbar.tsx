import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Target,
  User, 
  Menu, 
  X
} from 'lucide-react';

interface CareerPathwaysNavbarProps {
  onLogin?: () => void;
  isLoggedIn?: boolean;
  userName?: string;
}

export const CareerPathwaysNavbar: React.FC<CareerPathwaysNavbarProps> = ({
  onLogin,
  isLoggedIn = false,
  userName
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    console.log('[DEBUG CareerPathwaysNavbar] Current location:', location.pathname);
  }, [location]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Sidebar navigation items moved to top navbar - cleaner single-bar design
  const navLinks = [
    { 
      label: 'Discover', 
      path: '/',
      description: 'Find your path'
    },
    { 
      label: 'Airline Expectations', 
      path: '/airline-expectations',
      description: 'What airlines want'
    },
    { 
      label: 'Type-Ratings', 
      path: '/type-ratings',
      description: 'Aircraft certifications'
    },
    { 
      label: 'Pathways', 
      path: '/pathways',
      description: 'Career routes'
    },
    { 
      label: 'Global Authorities', 
      path: '/authorities',
      description: 'Regulatory bodies'
    },
  ];

  const handleNavClick = (path: string) => {
    console.log('[DEBUG CareerPathwaysNavbar] Navigating to:', path);
    navigate(path);
  };

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-0 sm:px-2 lg:px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo - flush to left edge */}
          <div 
            className="flex items-center cursor-pointer group pl-4 sm:pl-6 lg:pl-8"
            onClick={() => navigate('/')}
          >
            <h1 className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none group-hover:opacity-90 transition-opacity">
              pilotcareer<span className="text-red-500">pathways</span>.com
            </h1>
          </div>

          {/* Desktop Navigation - Clean single-row design */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => handleNavClick(link.path)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
                title={link.description}
              >
                {link.label}
              </button>
            ))}
          </nav>

          {/* CTA / User Section */}
          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <button
                onClick={() => navigate('/dashboard')}
                className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/50 hover:bg-slate-800 text-slate-200 text-sm font-medium transition-all"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                  <User className="w-3.5 h-3.5 text-white" />
                </div>
                <span className="max-w-[100px] truncate">{userName || 'Pilot'}</span>
              </button>
            ) : (
              <>
                <button
                  onClick={onLogin}
                  className="hidden sm:block px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/get-started')}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 text-white text-sm font-medium shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40 transition-all"
                >
                  <Target className="w-4 h-4" />
                  <span className="hidden sm:inline">Get Started</span>
                  <span className="sm:hidden">Start</span>
                </button>
              </>
            )}

            {/* Mobile menu button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/50 transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 bg-slate-950/98 backdrop-blur-lg border-b border-slate-800/50 shadow-xl">
          <div className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className={`w-full px-4 py-3 rounded-lg text-sm font-medium transition-all block ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <div>{link.label}</div>
                <div className="text-xs text-slate-500">{link.description}</div>
              </Link>
            ))}
            
            <div className="pt-3 border-t border-slate-800/50 mt-3">
              {!isLoggedIn && (
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
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default CareerPathwaysNavbar;
