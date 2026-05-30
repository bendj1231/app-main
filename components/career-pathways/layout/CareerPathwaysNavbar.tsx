import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Route, 
  Compass, 
  Plane, 
  BookOpen, 
  User, 
  Menu, 
  X,
  ChevronDown,
  ArrowRight,
  Target
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
  const [isProgramsOpen, setIsProgramsOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { 
      label: 'Explore', 
      path: '/',
      icon: Route,
      description: 'Browse all pathways'
    },
    { 
      label: 'Programs', 
      path: '/programs',
      icon: BookOpen,
      hasDropdown: true,
      dropdownItems: [
        { label: 'Foundation Program', path: '/programs/foundation', desc: 'Build core skills' },
        { label: 'Transition Program', path: '/programs/transition', desc: 'Airline readiness' },
        { label: 'Certification Prep', path: '/programs/certification', desc: 'Exam preparation' },
      ]
    },
    { 
      label: 'Discovery', 
      path: '/discover',
      icon: Compass,
      description: 'AI-powered matching'
    },
    { 
      label: 'For Airlines', 
      path: '/airlines',
      icon: Plane,
      description: 'Enterprise solutions'
    },
  ];

  const isActive = (path: string) => location.pathname === path || location.pathname.startsWith(path + '/');

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled 
          ? 'bg-slate-950/95 backdrop-blur-lg border-b border-slate-800/50 shadow-lg shadow-black/20' 
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center gap-2.5 cursor-pointer group"
            onClick={() => navigate('/')}
          >
            <div className="relative">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all">
                <Route className="w-5 h-5 text-white" />
              </div>
              <div className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-slate-950" />
            </div>
            <div className="hidden sm:block">
              <h1 className="text-lg font-bold text-white tracking-tight leading-none">
                Career<span className="text-indigo-400">Pathways</span>
              </h1>
              <p className="text-[10px] text-slate-400 tracking-wider uppercase">by PilotRecognition</p>
            </div>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <div key={link.path} className="relative">
                {link.hasDropdown ? (
                  <div
                    className="relative"
                    onMouseEnter={() => setIsProgramsOpen(true)}
                    onMouseLeave={() => setIsProgramsOpen(false)}
                  >
                    <button
                      className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                        isActive(link.path)
                          ? 'text-indigo-400 bg-indigo-500/10'
                          : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                      }`}
                    >
                      <link.icon className="w-4 h-4" />
                      <span>{link.label}</span>
                      <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isProgramsOpen ? 'rotate-180' : ''}`} />
                    </button>
                    
                    {/* Dropdown */}
                    {isProgramsOpen && (
                      <div className="absolute top-full left-0 mt-1 w-64 bg-slate-900 border border-slate-800 rounded-xl shadow-xl shadow-black/30 overflow-hidden">
                        {link.dropdownItems?.map((item, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              navigate(item.path);
                              setIsProgramsOpen(false);
                            }}
                            className="w-full px-4 py-3 text-left hover:bg-slate-800/50 transition-colors group"
                          >
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-slate-200 group-hover:text-white">
                                {item.label}
                              </span>
                              <ArrowRight className="w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors" />
                            </div>
                            <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => navigate(link.path)}
                    className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isActive(link.path)
                        ? 'text-indigo-400 bg-indigo-500/10'
                        : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                    }`}
                    title={link.description}
                  >
                    <link.icon className="w-4 h-4" />
                    <span>{link.label}</span>
                  </button>
                )}
              </div>
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
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path);
                  setIsMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                  isActive(link.path)
                    ? 'text-indigo-400 bg-indigo-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <link.icon className="w-5 h-5" />
                <div className="text-left">
                  <div>{link.label}</div>
                  <div className="text-xs text-slate-500">{link.description}</div>
                </div>
              </button>
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
