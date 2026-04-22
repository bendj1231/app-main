'use client';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Plane, Lock, Mail, AlertCircle, ArrowRight, Building2 } from 'lucide-react';
import { useEnterpriseAuth } from './hooks/useEnterpriseAuth';

const LOGO = 'https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR';

export function EnterpriseLoginPage() {
  const { login, loading, error } = useEnterpriseAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const ok = await login(email, password);
    setSubmitting(false);
    if (ok) window.location.href = '/enterprise/dashboard';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background grid */}
      <div className="absolute inset-0 opacity-10"
        style={{ backgroundImage: 'linear-gradient(rgba(59,130,246,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.3) 1px, transparent 1px)', backgroundSize: '60px 60px' }} />

      {/* Ambient glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-blue-600/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        {/* Card */}
        <div className="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-8 shadow-2xl">
          {/* Header */}
          <div className="flex flex-col items-center mb-8">
            <img src={LOGO} alt="PilotRecognition" className="h-12 w-auto object-contain mb-4" />
            <div className="flex items-center gap-2 px-3 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full mb-3">
              <Building2 className="w-3.5 h-3.5 text-blue-400" />
              <span className="text-blue-300 text-xs font-semibold uppercase tracking-wider">Enterprise Portal</span>
            </div>
            <h1 className="text-2xl font-bold text-white">Airline Partner Login</h1>
            <p className="text-slate-400 text-sm mt-1.5 text-center">
              Access your enterprise dashboard to manage pathway cards, job listings and airline expectations.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="flex items-start gap-3 bg-red-500/10 border border-red-500/30 rounded-xl px-4 py-3 mb-6">
              <AlertCircle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
              <p className="text-red-300 text-sm">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  placeholder="airline@company.com"
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-slate-300 text-sm font-medium mb-1.5">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full bg-slate-800/60 border border-slate-700/50 text-white placeholder-slate-500 rounded-xl pl-10 pr-4 py-3 text-sm focus:outline-none focus:border-blue-500/60 focus:ring-2 focus:ring-blue-500/20 transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-semibold rounded-xl py-3 flex items-center justify-center gap-2 transition-all mt-2"
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
            <div className="flex-1 h-px bg-slate-700/50" />
            <span className="text-slate-600 text-xs">Don't have access?</span>
            <div className="flex-1 h-px bg-slate-700/50" />
          </div>

          {/* Request access */}
          <a
            href="/enterprise-access"
            className="block w-full text-center border border-slate-600/50 hover:border-blue-500/50 text-slate-300 hover:text-white font-medium rounded-xl py-2.5 text-sm transition-all"
          >
            Request Enterprise Access
          </a>

          {/* Back to site */}
          <p className="text-center mt-5">
            <a href="/" className="text-slate-500 hover:text-slate-400 text-xs transition-colors">
              ← Back to PilotRecognition.com
            </a>
          </p>
        </div>

        {/* Stats strip */}
        <div className="grid grid-cols-3 gap-3 mt-4">
          {[
            { label: 'Airline Partners', value: '72+' },
            { label: 'Pathways Listed', value: '400+' },
            { label: 'Pilot Profiles', value: '1,000+' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900/50 border border-slate-800 rounded-xl p-3 text-center">
              <div className="text-blue-400 font-bold text-lg">{s.value}</div>
              <div className="text-slate-500 text-xs">{s.label}</div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}

export default EnterpriseLoginPage;
