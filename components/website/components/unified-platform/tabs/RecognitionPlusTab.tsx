import React from 'react';
import { motion } from 'framer-motion';
import { Star, Zap, Infinity, Target, Crown, ChevronRight, CheckCircle } from 'lucide-react';
import type { TabId } from '../types';

interface RecognitionPlusTabProps {
  setTab: (tab: TabId) => void;
  onNavigate: (page: string) => void;
}

export const RecognitionPlusTab: React.FC<RecognitionPlusTabProps> = ({ setTab, onNavigate }) => {
  const benefits = [
    {
      icon: Infinity,
      title: 'Unlimited Pathway Views',
      desc: 'Browse every airline, cargo, and private pathway without monthly caps. No restrictions.',
    },
    {
      icon: Target,
      title: 'Full Profile Comparison',
      desc: 'See exactly how you stack against every pathway requirement — every gap, every shortcut.',
    },
    {
      icon: Zap,
      title: 'Priority Matching',
      desc: 'Your profile gets surfaced first when airlines pull from the database. Early adopter advantage.',
    },
    {
      icon: Crown,
      title: 'Recognition+ Badge',
      desc: 'Verified premium status on your live profile. Airlines see you\'re serious before they even open your data.',
    },
  ];

  const tiers = [
    { label: 'Free', price: '$0', features: ['Basic profile matching (2 gaps)', '3 pathways per month', 'Platform access'] },
    { label: 'Recognition+', price: '$99/yr', featured: true, features: ['Full profile comparison', 'Unlimited pathway views', 'Priority matching', 'Recognition+ badge', 'Program participant priority'] },
  ];

  return (
    <div className="relative z-10 flex flex-col items-center min-h-screen px-4 py-8">
      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-2xl mx-auto mb-12"
      >
        <div className="flex justify-center mb-4">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center shadow-lg shadow-amber-500/20">
            <Star size={28} className="text-white" fill="white" />
          </div>
        </div>
        <p className="text-[10px] font-black tracking-[0.25em] uppercase text-amber-400 mb-3">
          Upgrade
        </p>
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight leading-tight mb-4">
          RECOGNITION<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-500">+</span>
        </h1>
        <p className="text-sm text-slate-300 leading-relaxed max-w-lg mx-auto mb-6">
          Your recognition score is your currency for pathway access. Go premium to unlock
          unlimited comparisons, priority airline matching, and a verified badge that signals
          you're ready to the industry.
        </p>
        <button
          onClick={() => onNavigate('recognition-plus')}
          className="px-8 py-3.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-xs font-black uppercase tracking-wider rounded-xl transition-all hover:brightness-110 hover:scale-105 flex items-center gap-2 mx-auto"
        >
          Get Recognition+
          <ChevronRight size={14} />
        </button>
        <p className="text-[10px] text-slate-500 mt-3">$99/year · Cancel anytime</p>
      </motion.div>

      {/* Benefits Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="w-full max-w-4xl mx-auto mb-12"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {benefits.map((b) => {
            const Icon = b.icon;
            return (
              <div
                key={b.title}
                className="group p-5 rounded-xl transition-all hover:scale-[1.02]"
                style={{
                  background: 'rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                  WebkitBackdropFilter: 'blur(12px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                }}
              >
                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center mb-3">
                  <Icon size={18} className="text-white" />
                </div>
                <h3 className="text-sm font-bold text-white mb-1">{b.title}</h3>
                <p className="text-[11px] text-slate-400 leading-relaxed">{b.desc}</p>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Pricing Tiers */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.3 }}
        className="w-full max-w-3xl mx-auto"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {tiers.map((t) => (
            <div
              key={t.label}
              className="relative p-6 rounded-2xl text-center"
              style={{
                background: t.featured
                  ? 'rgba(245,158,11,0.08)'
                  : 'rgba(255,255,255,0.04)',
                backdropFilter: 'blur(12px)',
                WebkitBackdropFilter: 'blur(12px)',
                border: t.featured
                  ? '1px solid rgba(245,158,11,0.3)'
                  : '1px solid rgba(255,255,255,0.08)',
              }}
            >
              {t.featured && (
                <div className="absolute -top-2 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider text-white" style={{ background: '#f59e0b' }}>
                  Most Popular
                </div>
              )}
              <h3 className="text-lg font-black text-white mt-2">{t.label}</h3>
              <p className="text-3xl font-black text-white mt-2">{t.price}</p>
              <div className="mt-4 space-y-2 text-left">
                {t.features.map((f) => (
                  <div key={f} className="flex items-center gap-2">
                    <CheckCircle size={12} className={t.featured ? 'text-amber-400' : 'text-slate-500'} />
                    <span className="text-[11px] text-slate-300">{f}</span>
                  </div>
                ))}
              </div>
              {t.featured && (
                <button
                  onClick={() => onNavigate('recognition-plus')}
                  className="mt-5 w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[11px] font-black uppercase tracking-wider rounded-xl transition-all hover:brightness-110"
                >
                  Get Recognition+
                </button>
              )}
            </div>
          ))}
        </div>
      </motion.div>

      {/* Program Participant Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="w-full max-w-3xl mx-auto mt-8"
      >
        <div
          className="p-4 rounded-xl text-center"
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.08)',
          }}
        >
          <p className="text-[11px] text-slate-400">
            Already enrolled in a program? Program participants receive the same priority matching as paid members — recognition is effort-based, not paywalled.
          </p>
          <button
            onClick={() => setTab('programs' as TabId)}
            className="mt-2 text-[10px] font-bold text-amber-400 hover:text-amber-300 uppercase tracking-wider transition-colors"
          >
            View Programs →
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default RecognitionPlusTab;
