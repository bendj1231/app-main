import React, { useMemo, useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion, AnimatePresence } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';
import { supabase } from '@/shared/lib/supabase';
import {
  ArrowRight, UserCheck, ShieldCheck, Plane, Briefcase, BadgeCheck
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.12, duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1, delayChildren: 0.3 },
  },
};

type Step = 'welcome' | 'provider' | 'copilot';

export default function GetStartedPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user: auth0User } = useAuth0();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);
  const [step, setStep] = useState<Step>('welcome');
  const [userName, setUserName] = useState<string>('Pilot');

  // If returning from APC verification page, auto-advance to copilot
  useEffect(() => {
    if (location.state?.fromApcVerification) {
      setStep('copilot');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  useEffect(() => {
    // Try Auth0 name first, then Supabase profile
    if (auth0User?.name) {
      setUserName(auth0User.name.split(' ')[0].trim());
    } else if (auth0User?.given_name) {
      setUserName(auth0User.given_name.trim());
    } else if (auth0User?.nickname) {
      setUserName(auth0User.nickname.trim());
    } else {
      // Fallback to Supabase profile
      supabase.auth.getUser().then(({ data }) => {
        const meta = data.user?.user_metadata;
        const name = meta?.full_name || meta?.first_name || meta?.display_name;
        if (name) setUserName(name.split(' ')[0].trim());
      });
    }
  }, [auth0User]);


  const steps = [
    {
      icon: <ShieldCheck size={20} className="text-emerald-400" />,
      title: 'Pilot Verification',
      desc: 'Verify your license, medical, ratings, and flight logbook with your regional aviation authority.',
      url: 'https://pilotrecognition.com',
    },
    {
      icon: <Plane size={20} className="text-sky-400" />,
      title: 'Priority Matching',
      desc: 'See which airlines and operators match your verified qualifications and experience.',
      url: 'https://pilotcareerpathways.com',
    },
    {
      icon: <Plane size={20} className="text-red-400" />,
      title: 'Career Alignment AI CO-PILOT',
      desc: 'Set your target airline and timeline with personalized recommendations.',
    },
    {
      icon: <BadgeCheck size={20} className="text-amber-400" />,
      title: 'Programs Access',
      desc: 'Unlock exclusive training programs, mentorship, and recognition opportunities.',
      url: 'https://pilotshortage.org',
    },
  ];

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 py-12 overflow-hidden">
      {/* ── BACKGROUND: MeshGradient ── */}
      <div className="fixed inset-0 z-0">
        {graphicsConfig.enableMeshGradient ? (
          <MeshGradient
            className="w-full h-full"
            colors={['#dbeafe','#94a3b8','#64748b','#475569','#334155','#1e3a5f','#1e3a8a','#0f172a']}
            speed={graphicsConfig.meshGradientSpeed}
          />
        ) : (
          <div className="w-full h-full" style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f172a 100%)' }} />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* ── CARD ── */}
      <motion.div
        className="relative z-10 max-w-2xl w-full rounded-3xl p-6 md:p-8"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div
              key="welcome"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Logo mark */}
              <motion.div className="mb-4" variants={fadeUp} custom={0}>
                <span className="text-2xl font-black tracking-tighter">
                  <span className="text-gray-900">P</span>
                  <span className="text-red-600">R</span>
                </span>
              </motion.div>

              <motion.h1
                className="text-2xl font-black tracking-tight mb-3"
                variants={fadeUp}
                custom={1}
              >
                <span className="text-gray-900">Welcome {userName.trim()}, to{' '}</span>
                <span style={{ color: '#dc2626' }}>Recognition+</span>
              </motion.h1>

              <motion.p
                className="text-sm text-gray-500 mb-5 max-w-lg mx-auto leading-relaxed"
                variants={fadeUp}
                custom={2}
              >
                Your account is now active across our platforms: <span className="text-gray-700 font-semibold">Profile</span>, <span className="text-gray-700 font-semibold">Verification</span>, <span className="text-gray-700 font-semibold">Pathways</span>, and <span className="text-gray-700 font-semibold">Programs</span>. Here's how to get the most out of your verified pilot profile.
              </motion.p>

              {/* Hero Image */}
              <motion.div
                className="mb-5 mx-auto w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                variants={fadeUp}
                custom={3}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(226,232,240,1) 0%, rgba(241,245,249,1) 100%)' }}>
                  <Plane size={40} className="text-gray-300" />
                </div>
              </motion.div>

              {/* Steps */}
              <motion.div className="grid grid-cols-2 gap-4 mb-6 text-left" variants={staggerContainer}>
                {steps.map((s, i) => {
                  const Card = s.url ? motion.a : motion.div;
                  return (
                    <Card
                      key={i}
                      href={s.url}
                      target={s.url ? '_blank' : undefined}
                      rel={s.url ? 'noopener noreferrer' : undefined}
                      className="flex flex-col p-4 rounded-xl transition-all hover:brightness-95 cursor-pointer"
                      style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.06)' }}
                      variants={fadeUp}
                      custom={4 + i}
                    >
                      <div>
                        <p className="text-xs font-bold text-gray-900">{s.title}</p>
                        <p className="text-[10px] text-gray-500 leading-snug">{s.desc}</p>
                        {s.url && (
                          <p className="text-[9px] text-gray-600 mt-1 truncate">
                            {(() => {
                              const domain = s.url!.replace('https://', '');
                              const parts = domain.split(/(recognition|pathways|shortage)/);
                              return parts.map((part, idx) =>
                                ['recognition', 'pathways', 'shortage'].includes(part) ? (
                                  <span key={idx} className="text-slate-700">{part}</span>
                                ) : (
                                  <span key={idx}>{part}</span>
                                )
                              );
                            })()}
                          </p>
                        )}
                      </div>
                    </Card>
                  );
                })}
              </motion.div>

              {/* CTA */}
              <motion.div
                className="flex justify-center"
                variants={fadeUp}
                custom={8}
              >
                <motion.button
                  onClick={() => setStep('provider')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-[11px] rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 leading-none"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  GET STARTED <ArrowRight size={14} />
                </motion.button>
              </motion.div>

              <motion.p
                className="text-[10px] text-gray-400 mt-4 uppercase tracking-widest"
                variants={fadeUp}
                custom={9}
              >
                pilotrecognition.com
              </motion.p>
            </motion.div>
          )}

          {step === 'provider' && (
            <motion.div
              key="provider"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep('welcome')}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider transition-colors leading-none"
                >
                  ← Back
                </button>
                <div className="flex-1 h-[2px] rounded-full self-center" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <div className="h-[2px] rounded-full" style={{ width: '33%', background: 'linear-gradient(90deg, #dc2626, #ef4444)' }} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider leading-none">Step 2 of 3</span>
              </div>

              <motion.div
                className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(59,130,246,0.10)', border: '1px solid rgba(59,130,246,0.20)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <ShieldCheck size={22} className="text-blue-500" />
              </motion.div>

              <motion.h2
                className="text-2xl font-black tracking-tight text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Prepare for Verification
              </motion.h2>

              <motion.p
                className="text-sm text-gray-500 mb-5 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
              >
                Verification confirms your pilot credentials with <span className="font-bold text-gray-700">Aviation Pathways Consultancy (APC)</span>, unlocking priority matching with airlines and operators who only consider verified pilots.
              </motion.p>

              {/* What to prepare */}
              <motion.div
                className="rounded-xl p-4 mb-5 text-left"
                style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <p className="text-xs font-bold text-gray-900 mb-3 uppercase tracking-wider">Have these ready</p>
                <div className="space-y-2">
                  {[
                    { text: 'SPL, PPL, CPL, or ATPL License (front and back)', optional: false },
                    { text: 'Medical Certificate (Class 1, 2, or 3)', optional: false },
                    { text: 'Radio License', optional: false },
                    { text: 'Pilot Logbook (all pages)', optional: false },
                    { text: 'Type Ratings / Endorsements', optional: true },
                    { text: 'Additional Ratings — IR, ME, Night, Seaplane, Tailwheel, etc.', optional: true },
                    { text: 'ATO Name & Location (for training records)', optional: false },
                    { text: 'Signed ATO Consent Form', link: '/consent-form', label: 'Download / Print', optional: false },
                    { text: 'License Verification Consent', link: '/license-verification-consent', label: 'Download / Print', optional: false },
                    { text: 'Logbook Audit Consent', link: '/logbook-consent', label: 'Download / Print', optional: false },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-[5px] ${item.optional ? 'bg-gray-400' : 'bg-red-500'}`} />
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <p className="text-xs text-gray-600">{item.text}{item.optional && <span className="text-[10px] text-gray-400 ml-1">(optional)</span>}</p>
                        {item.link && (
                          <button
                            type="button"
                            onClick={() => navigate(item.link!)}
                            className="text-[10px] font-semibold text-amber-600 hover:text-amber-700 underline cursor-pointer"
                          >
                            {item.label}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* What to expect */}
              <motion.div
                className="rounded-xl p-4 mb-6 text-left"
                style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <p className="text-xs font-bold text-gray-900 mb-2 uppercase tracking-wider">What to expect</p>
                <p className="text-[10px] text-gray-700 leading-relaxed mb-2">
                  APC will contact your issuing aviation authority and your named ATO to verify your credentials, flight hours, and training records. A formal third-party authorization with your signed consent is required for the ATO to release records.
                </p>
                <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
                  <span className="font-semibold text-gray-700">Note on archived records:</span> Many ATOs archive older records. Response times can range from 3 to 14 business days, and some institutions may charge a processing fee to extract logbooks or simulator profiles.
                </p>
                <p className="text-[10px] text-gray-600 leading-relaxed">
                  <span className="font-semibold text-gray-700">ATO internal forms:</span> Some ATOs may reject our consent template and require you to sign their specific institutional release form instead. If this happens, APC will notify you immediately.
                </p>
              </motion.div>

              {/* Action buttons */}
              <div className="flex items-center justify-center gap-4">
                <motion.button
                  onClick={() => navigate('/get-started/verify-apc')}
                  className="inline-flex items-center justify-center gap-2 px-6 py-[11px] rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 leading-none"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  START VERIFICATION <ArrowRight size={14} />
                </motion.button>

                <motion.button
                  onClick={() => setStep('copilot')}
                  className="inline-flex items-center justify-center gap-2 px-5 py-[11px] rounded-full text-xs font-bold tracking-wider text-gray-500 transition-all hover:text-gray-900 hover:bg-black/5 underline underline-offset-2 decoration-gray-300 hover:decoration-gray-600 leading-none"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                >
                  Verify Later
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 'copilot' && (
            <motion.div
              key="copilot"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
            >
              {/* Step indicator */}
              <div className="flex items-center gap-2 mb-6">
                <button
                  onClick={() => setStep('provider')}
                  className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider transition-colors"
                >
                  ← Back
                </button>
                <div className="flex-1 h-[2px] rounded-full" style={{ background: 'rgba(0,0,0,0.08)' }}>
                  <div className="h-full rounded-full" style={{ width: '66%', background: 'linear-gradient(90deg, #dc2626, #ef4444)' }} />
                </div>
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Step 3 of 3</span>
              </div>

              <motion.div
                className="mx-auto w-12 h-12 rounded-full flex items-center justify-center mb-4"
                style={{ background: 'rgba(139,92,246,0.10)', border: '1px solid rgba(139,92,246,0.20)' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.1 }}
              >
                <Briefcase size={22} className="text-violet-500" />
              </motion.div>

              <motion.h2
                className="text-2xl font-black tracking-tight text-gray-900 mb-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.15 }}
              >
                Career Alignment AI CO-PILOT
              </motion.h2>

              <motion.p
                className="text-sm text-gray-500 mb-5 text-left"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                Set your target airline and timeline with personalized recommendations. Our AI CO-PILOT analyzes your verified profile to match you with the best career opportunities.
              </motion.p>

              {/* Image placeholder */}
              <motion.div
                className="mb-5 mx-auto w-full max-w-sm aspect-[16/10] rounded-2xl overflow-hidden"
                style={{ border: '1px solid rgba(0,0,0,0.08)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.22 }}
              >
                <div className="w-full h-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, rgba(226,232,240,1) 0%, rgba(241,245,249,1) 100%)' }}>
                  <Plane size={48} className="text-gray-300" />
                </div>
              </motion.div>

              {/* AI CO-PILOT Card */}
              <motion.div
                className="rounded-xl p-4 mb-6 text-left"
                style={{ background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.15)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(139,92,246,0.10)' }}>
                    <Briefcase size={18} className="text-violet-500" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-gray-900">AI CO-PILOT</p>
                    <p className="text-[10px] text-gray-500 leading-snug">Get personalized career recommendations based on your verified pilot profile and target airlines.</p>
                  </div>
                </div>
              </motion.div>

              {/* CTA */}
              <motion.div
                className="flex justify-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <motion.button
                  onClick={() => navigate('/platform?tab=career')}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110"
                  style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.98 }}
                >
                  GET STARTED <ArrowRight size={14} />
                </motion.button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

    </div>
  );
}
