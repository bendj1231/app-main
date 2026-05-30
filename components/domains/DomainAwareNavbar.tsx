'use client';

import { useState, useEffect } from 'react';

export default function DomainAwareNavbar() {
  const [brand, setBrand] = useState<'shortage' | 'recognition'>('recognition');
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    // Detect domain from window.location
    const domain = window.location.hostname;
    if (domain.includes('pilotshortage.org')) {
      setBrand('shortage');
    } else {
      setBrand('recognition');
    }

    // Check for localStorage override (for testing)
    const override = localStorage.getItem('brand_override');
    if (override === 'shortage' || override === 'recognition') {
      setBrand(override);
    }

    // Scroll handler
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isShortage = brand === 'shortage';

  const navItems = isShortage 
    ? [
        { label: 'About', href: '/about' },
        { label: 'Membership', href: '/membership' },
        { label: 'Pathways', href: '/pathways' },
        { label: 'Community', href: '/community' },
        { label: 'Contact', href: '/contact' },
      ]
    : [
        { label: 'Blog', href: '/blog' },
        { label: 'Store', href: '/store' },
        { label: 'About', href: '/about' },
        { label: 'Programs', href: '/programs' },
        { label: 'Pathways', href: '/pathways' },
        { label: 'Recognition', href: '/pilot-recognition' },
        { label: 'Contact', href: '/contact' },
        { label: 'Enterprise', href: '/enterprise' },
      ];

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled 
          ? (isShortage ? 'bg-blue-700 shadow-lg' : 'bg-gray-900/95 backdrop-blur-sm shadow-lg')
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-2">
            {isShortage ? (
              <>
                <span className="text-2xl font-bold text-white">
                  pilotshortage<span className="text-yellow-400">.org</span>
                </span>
                <span className="hidden md:inline text-xs text-blue-200 bg-blue-800 px-2 py-1 rounded">
                  Philippines
                </span>
              </>
            ) : (
              <>
                <span className="text-2xl font-bold text-white">
                  pilotrecognition<span className="text-amber-400">.com</span>
                </span>
                <span className="hidden md:inline text-xs text-gray-400 bg-gray-800 px-2 py-1 rounded">
                  Global
                </span>
              </>
            )}
          </div>

          {/* Nav Items */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className={`text-sm font-medium transition-colors hover:opacity-80 ${
                  isShortage ? 'text-white' : 'text-gray-300 hover:text-white'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>

          {/* CTA Button */}
          <div className="flex items-center gap-4">
            {isShortage ? (
              <a
                href="/signup"
                className="bg-yellow-400 text-blue-900 px-4 py-2 rounded-lg font-semibold text-sm hover:bg-yellow-300 transition-colors"
              >
                Join ₱1,500/yr
              </a>
            ) : (
              <>
                <a
                  href="/signup"
                  className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold text-sm hover:bg-red-500 transition-colors"
                >
                  Get Recognition Free
                </a>
                <a
                  href="/login"
                  className="border border-gray-500 text-gray-300 px-4 py-2 rounded-lg font-medium text-sm hover:border-white hover:text-white transition-colors"
                >
                  Login
                </a>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Domain Switcher - Dev Only */}
      {process.env.NODE_ENV === 'development' && (
        <div className="absolute bottom-0 right-0 bg-black/80 text-white text-xs px-2 py-1">
          <span className="text-gray-400">Dev:</span>{' '}
          <button 
            onClick={() => {
              localStorage.setItem('brand_override', isShortage ? 'recognition' : 'shortage');
              window.location.reload();
            }}
            className="underline hover:text-yellow-400"
          >
            Switch to {isShortage ? 'recognition.com' : 'shortage.org'}
          </button>
        </div>
      )}
    </nav>
  );
}
