'use client';
import React, { useState, useRef, useEffect } from 'react';
import { safeRedirect } from '@/src/lib/url-validator';
import { motion } from 'framer-motion';
import { Lock, Mail, AlertCircle, ArrowRight, Building2, ChevronRight, ChevronDown } from 'lucide-react';
import { useEnterpriseAuth } from './hooks/useEnterpriseAuth';

const NAV_GROUPS = [
  {
    label: 'Solutions',
    items: [
      { id: 'airlines', label: 'Airlines & Operators', href: '/enterprise-access/airlines' },
      { id: 'flightschools', label: 'Flight Schools & ATOs', href: '/enterprise-access' },
      { id: 'privatejet', label: 'Private Jet & Charter', href: '/enterprise-access' },
      { id: 'evtol', label: 'Air Taxi & eVTOL', href: '/enterprise-access' },
      { id: 'military', label: 'Military & Defence', href: '/enterprise-access' },
      { id: 'manufacturers', label: 'Manufacturers & OEMs', href: '/enterprise-access/manufacturers' },
    ],
  },
  {
    label: 'Services',
    items: [
      { id: 'verification', label: 'Pilot Credential Verification', href: '/verification-service' },
      { id: 'insurance', label: 'Insurance Providers', href: '/enterprise-access' },
      { id: 'finance', label: 'Banks & Pilot Finance', href: '/enterprise-access' },
      { id: 'jobboards', label: 'Job Boards & Staffing', href: '/enterprise-access' },
      { id: 'integrations', label: 'Software & API', href: '/enterprise-access' },
    ],
  },
  {
    label: 'Pricing',
    items: [
      { id: 'pricing', label: 'Enterprise Pricing', href: '/enterprise-access' },
      { id: 'partners', label: 'Partnership Tiers', href: '/enterprise-access' },
    ],
  },
  {
    label: 'About',
    items: [
      { id: 'why', label: 'Why PilotRecognition', href: '/enterprise-access' },
      { id: 'metric', label: 'The 90-Day Metric', href: '/enterprise-access' },
      { id: 'contact', label: 'Request Access', href: '/enterprise-access' },
    ],
  },
];

export function EnterpriseLoginPage() {
  const { login, loading, error } = useEnterpriseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileNav, setMobileNav] = useState(false);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenMenu(null);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) safeRedirect('/enterprise/dashboard');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Top nav bar — matches enterprise main page exactly */}
      <header className="bg-white border-b border-slate-200 sticky top-0 z-50">
        <div className="w-full px-4 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <a href="/enterprise-access" className="flex items-baseline gap-0 flex-shrink-0">
              <span className="text-xl font-black text-slate-900" style={{ fontFamily: 'Arial Black, sans-serif' }}>pilot</span>
              <span className="text-xl font-black text-red-600" style={{ fontFamily: 'Arial Black, sans-serif' }}>recognition</span>
              <span className="text-slate-300 font-light mx-2 text-lg">|</span>
              <span className="text-sm font-bold text-slate-500 tracking-wide uppercase" style={{ fontFamily: 'Arial Black, sans-serif' }}>enterprise</span>
            </a>

            {/* Desktop dropdowns */}
            <nav className="hidden lg:flex items-center gap-1 ml-8" ref={navRef}>
              <a href="/" className="px-3 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium transition-colors rounded-lg hover:bg-slate-50">
                Home
              </a>
              {NAV_GROUPS.map(group => (
                <div
                  key={group.label}
                  className="relative"
                  onMouseEnter={() => setOpenMenu(group.label)}
                  onMouseLeave={() => setOpenMenu(null)}
                >
                  <button
                    className={`flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-lg transition-colors ${openMenu === group.label ? 'text-red-600 bg-red-50' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'}`}
                  >
                    {group.label} <ChevronDown className={`w-3.5 h-3.5 transition-transform ${openMenu === group.label ? 'rotate-180' : ''}`} />
                  </button>
                  {openMenu === group.label && (
                    <div className="absolute top-full left-0 mt-0 w-56 bg-white border border-slate-200 rounded-xl shadow-lg py-1.5 z-50">
                      {group.items.map(item => (
                        <a
                          key={item.id}
                          href={item.href || '/enterprise-access'}
                          className="block px-4 py-2.5 text-sm text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition-colors"
                        >
                          {item.label}
                        </a>
                      ))}
                    </div>
                  )}
                </div>
              ))}
              <a
                href="https://enterprise.pilotrecognition.com/ucf/official-release"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 px-3 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium rounded-lg hover:bg-slate-50 transition-colors"
              >
                UCF Document
                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-3">
              <a href="/enterprise-access" className="hidden sm:block text-sm text-slate-500 hover:text-slate-900 font-medium transition-colors">
                Learn More
              </a>
              <a href="/enterprise-access" className="bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors flex items-center gap-1">
                Request Access <ChevronRight className="w-3.5 h-3.5" />
              </a>
              <button onClick={() => setMobileNav((v: boolean) => !v)} className="lg:hidden text-slate-900 p-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={mobileNav ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
                </svg>
              </button>
            </div>
          </div>

          {/* Mobile nav */}
          {mobileNav && (
            <div className="lg:hidden border-t border-slate-200 py-4 bg-white">
              <a href="/" className="block px-2 py-2 text-sm text-slate-600 hover:text-slate-900 font-medium" onClick={() => setMobileNav(false)}>Home</a>
              {NAV_GROUPS.map(group => (
                <div key={group.label} className="mb-3">
                  <p className="text-[10px] uppercase tracking-widest text-slate-400 font-bold px-2 mb-1">{group.label}</p>
                  {group.items.map(item => (
                    <a
                      key={item.id}
                      href={item.href || '/enterprise-access'}
                      onClick={() => setMobileNav(false)}
                      className="block px-2 py-2 text-sm text-slate-600 hover:text-red-600 transition-colors"
                    >
                      {item.label}
                    </a>
                  ))}
                </div>
              ))}
              <a
                href="https://enterprise.pilotrecognition.com/ucf/official-release"
                target="_blank" rel="noreferrer"
                className="block px-2 py-2 text-sm text-slate-600 font-medium"
                onClick={() => setMobileNav(false)}
              >
                UCF Document ↗
              </a>
              <div className="mt-3 px-2">
                <a href="/enterprise-access" className="block w-full bg-red-600 hover:bg-red-700 text-white text-sm font-semibold px-4 py-3 rounded-lg text-center transition-colors">
                  Request Access →
                </a>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main content */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="w-full max-w-lg"
        >
          {/* Badge */}
          <div className="flex justify-center mb-6">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-red-50 border border-red-200 rounded-full">
              <Building2 className="w-3.5 h-3.5 text-red-600" />
              <span className="text-red-700 text-xs font-bold uppercase tracking-widest">Enterprise Portal</span>
            </div>
          </div>

          {/* Heading */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-slate-900 mb-2">Partner Login</h1>
            <p className="text-slate-500 text-sm max-w-sm mx-auto">
              Sign in to manage pathway cards, publish requirements, and access your recruitment dashboard.
            </p>
          </div>

          {/* Card */}
          <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-8">
            {/* Error */}
            {error && (
              <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 mb-6">
                <AlertCircle className="w-4 h-4 text-red-600 mt-0.5 shrink-0" />
                <p className="text-red-700 text-sm">{error}</p>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">Email address</label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                    placeholder="partner@organisation.com"
                    className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 text-sm font-semibold mb-1.5">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    className="w-full bg-white border border-slate-300 text-slate-900 placeholder-slate-400 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-500/10 transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white font-bold rounded-xl py-3.5 flex items-center justify-center gap-2 transition-all shadow-sm hover:shadow-red-200 hover:shadow-lg"
              >
                {submitting ? (
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                ) : (
                  <>Access Enterprise Portal <ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3 my-6">
              <div className="flex-1 h-px bg-slate-200" />
              <span className="text-slate-400 text-xs font-medium">Don't have access?</span>
              <div className="flex-1 h-px bg-slate-200" />
            </div>

            {/* Request access */}
            <a
              href="/enterprise-access"
              className="block w-full text-center border-2 border-slate-200 hover:border-red-300 hover:bg-red-50 text-slate-700 hover:text-red-700 font-semibold rounded-xl py-3 text-sm transition-all"
            >
              Request Enterprise Access →
            </a>
          </div>

          {/* Back link */}
          <p className="text-center mt-5">
            <a href="/" className="text-slate-400 hover:text-slate-600 text-xs transition-colors">
              ← Back to PilotRecognition.com
            </a>
          </p>
        </motion.div>
      </div>

      {/* Stats strip — matches enterprise page footer style */}
      <div className="bg-white border-t border-slate-200 py-6">
        <div className="max-w-lg mx-auto grid grid-cols-3 gap-6 px-4">
          {[
            { label: 'Airline Partners', value: '72+' },
            { label: 'Pathways Listed', value: '400+' },
            { label: 'Pilot Profiles', value: '1,000+' },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl font-black text-red-600">{s.value}</div>
              <div className="text-slate-500 text-xs font-medium mt-0.5">{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EnterpriseLoginPage;
