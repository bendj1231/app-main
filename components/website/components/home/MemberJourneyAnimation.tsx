import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MousePointer2, ArrowRight, Lock, User, ChevronRight } from 'lucide-react';

interface MemberJourneyAnimationProps {
  isHovered?: boolean;
}

export const MemberJourneyAnimation: React.FC<MemberJourneyAnimationProps> = () => {
  const [scene, setScene] = useState<'search' | 'registration' | 'portal' | 'member'>('search');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTypingRef = useRef(false);
  const isCompleteRef = useRef(false);

  const targetText = 'pilotrecognition.com';

  // Auto-start animation and loop
  useEffect(() => {
    const startAnimation = () => {
      // Clear any existing intervals/timeouts
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
        typingIntervalRef.current = null;
      }
      if (warpTimeoutRef.current) {
        clearTimeout(warpTimeoutRef.current);
        warpTimeoutRef.current = null;
      }
      
      setScene('search');
      setTypedText('');
      hasStartedTypingRef.current = false;
      isCompleteRef.current = false;
    };

    // Start immediately and loop every 8.5 seconds
    startAnimation();
    const loopInterval = setInterval(startAnimation, 8500);

    return () => {
      clearInterval(loopInterval);
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (warpTimeoutRef.current) {
        clearTimeout(warpTimeoutRef.current);
      }
    };
  }, []);

  // Typing animation
  useEffect(() => {
    if (scene === 'search' && !hasStartedTypingRef.current && !isCompleteRef.current) {
      hasStartedTypingRef.current = true;
      let index = 0;
      
      typingIntervalRef.current = setInterval(() => {
        if (index <= targetText.length && !isCompleteRef.current) {
          setTypedText(targetText.slice(0, index));
          index++;
        } else {
          if (typingIntervalRef.current) {
            clearInterval(typingIntervalRef.current);
            typingIntervalRef.current = null;
          }
          if (!isCompleteRef.current) {
            isCompleteRef.current = true;
            // Go to registration page immediately after typing
            warpTimeoutRef.current = setTimeout(() => setScene('registration'), 200);
          }
        }
      }, 25);

      return () => {
        if (typingIntervalRef.current) {
          clearInterval(typingIntervalRef.current);
          typingIntervalRef.current = null;
        }
        if (warpTimeoutRef.current) {
          clearTimeout(warpTimeoutRef.current);
          warpTimeoutRef.current = null;
        }
      };
    }
  }, [scene, targetText]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Scene transitions
  useEffect(() => {
    if (scene === 'registration') {
      // Show registration page for 2.5 seconds then go to portal
      const registrationTimeout = setTimeout(() => setScene('portal'), 2500);
      return () => clearTimeout(registrationTimeout);
    } else if (scene === 'portal') {
      // Give time for login animation + loading + pathways display
      const portalTimeout = setTimeout(() => setScene('member'), 4000);
      return () => clearTimeout(portalTimeout);
    } else if (scene === 'member') {
      // Show member scene briefly then loop
      const memberTimeout = setTimeout(() => {
        setScene('search');
        setTypedText('');
        hasStartedTypingRef.current = false;
        isCompleteRef.current = false;
      }, 2000);
      return () => clearTimeout(memberTimeout);
    }
  }, [scene]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingIntervalRef.current) {
        clearInterval(typingIntervalRef.current);
      }
      if (warpTimeoutRef.current) {
        clearTimeout(warpTimeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-white">
      <AnimatePresence mode="wait">
        {/* Scene 1: Search Bar */}
        {scene === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Search Bar */}
            <div className="relative w-full max-w-md">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                <Search className="w-5 h-5" />
              </div>
              <motion.div 
                className={`w-full pl-12 pr-4 py-4 bg-slate-100 rounded-full text-slate-700 font-mono text-base transition-all ${
                  typedText.length > 0 ? 'border-2 border-blue-500 shadow-lg shadow-blue-500/20' : 'border-2 border-transparent'
                }`}
                animate={typedText.length === targetText.length ? { scale: [1, 0.98, 1] } : {}}
                transition={{ duration: 0.2 }}
              >
                {typedText}
                <motion.span
                  animate={{ opacity: showCursor ? 1 : 0 }}
                  className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5"
                />
              </motion.div>

              {/* Animated Mouse - moves in and clicks at end of typing */}
              <motion.div
                className="absolute right-8 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                initial={{ x: -80, y: 0, opacity: 0 }}
                animate={typedText.length === targetText.length ? 
                  { x: 0, y: 0, opacity: [0, 1, 1, 1, 0] } : 
                  { x: -80, y: 0, opacity: 0 }
                }
                transition={{ delay: 0, duration: 0.8, times: [0, 0.2, 0.5, 0.8, 1] }}
              >
                <MousePointer2 className="w-5 h-5 text-slate-700 fill-slate-700" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={typedText.length === targetText.length ? { scale: [0, 0, 1, 0, 0] } : { scale: 0 }}
                  transition={{ delay: 0.3, duration: 0.4 }}
                  className="absolute top-0 left-0 w-5 h-5 rounded-full bg-blue-500/30"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Scene 2: Registration Page */}
        {scene === 'registration' && (
          <motion.div
            key="registration"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-b from-slate-50 to-white flex flex-col items-center p-4 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Logo */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="mt-4 mb-2"
            >
              <img
                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                alt="WingMentor Logo"
                className="w-20 h-auto object-contain"
              />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-xl md:text-2xl font-serif text-slate-800 text-center mb-2"
            >
              First Step Towards Pilot Recognition
            </motion.h2>

            {/* Links */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-xs text-amber-500 mb-4"
            >
              Programs | Pilot Recognition | Pathways
            </motion.p>

            {/* Info Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 }}
              className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 max-w-sm text-center"
            >
              <p className="text-xs text-slate-600 leading-relaxed">
                The information provided below will be scanned and formed into a default{' '}
                <span className="font-semibold text-blue-600">ATLAS CV format</span>{' '}
                which you will be able to edit throughout your program & pathways.
              </p>
            </motion.div>

            {/* Form Card */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="w-full max-w-sm bg-white rounded-2xl shadow-xl border border-slate-100 p-5"
            >
              <h3 className="text-lg font-bold text-slate-800 mb-1">Account Credentials</h3>
              <p className="text-xs text-slate-500 mb-4">
                Think of this as the Ident of the aircraft you are flying—your unique signature in the sky. Use your Name, Personal Callsign, or a favorite Tailnumber.
              </p>

              <div className="space-y-3">
                {/* Pilot ID Field */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                    Pilot ID
                  </label>
                  <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3">
                    <span className="text-slate-400 text-xs">Pilot ID (Name, Personal Callsign, or Tailnum...</span>
                  </div>
                </div>

                {/* Email Field */}
                <div>
                  <label className="text-[10px] font-bold tracking-wider text-slate-400 uppercase mb-1 block">
                    Email Address
                  </label>
                  <div className="h-10 bg-slate-50 border border-slate-200 rounded-lg flex items-center px-3">
                    <span className="text-slate-400 text-xs">pilot@example.com</span>
                  </div>
                </div>
              </div>

              {/* Mouse cursor moves to scroll down */}
              <motion.div
                className="absolute right-4 bottom-20 pointer-events-none"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: [0, 1, 1, 0], y: [-20, 0, 10, 10] }}
                transition={{ delay: 2, duration: 1.5, times: [0, 0.3, 0.7, 1] }}
              >
                <MousePointer2 className="w-5 h-5 text-slate-600 fill-slate-600" />
              </motion.div>
            </motion.div>
          </motion.div>
        )}

        {/* Scene 3: Portal Login Page with Blue Cloud Shader Background */}
        {scene === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Blue Cloud Shader Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600">
              {/* Animated cloud layers */}
              <motion.div
                className="absolute inset-0 opacity-30"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 80% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)',
                    'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.3) 0%, transparent 50%)'
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              />
              <motion.div
                className="absolute inset-0"
                animate={{ 
                  background: [
                    'radial-gradient(circle at 50% 20%, rgba(147,197,253,0.4) 0%, transparent 40%)',
                    'radial-gradient(circle at 50% 80%, rgba(147,197,253,0.4) 0%, transparent 40%)',
                    'radial-gradient(circle at 50% 20%, rgba(147,197,253,0.4) 0%, transparent 40%)'
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              />
            </div>
            
            {/* Portal Modal - Full size matching LoginModal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="relative w-[95%] max-w-[700px] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row"
          >
            {/* Left Side - Dark Blue with Info */}
            <div className="w-full md:w-[45%] bg-[#0a1628] text-white p-6 md:p-8 flex flex-col relative">
              {/* Logo - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-4 mb-4 flex justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                  alt="WingMentor Logo"
                  className="w-32 md:w-40 h-auto object-contain"
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="flex-1 flex flex-col justify-center items-center"
              >
                {/* Mentor Network Label */}
                <p className="text-[10px] md:text-xs font-bold tracking-[0.3em] uppercase text-blue-400 mb-2 text-center">
                  Mentor Network
                </p>

                {/* Title */}
                <h2 className="text-xl md:text-3xl font-serif mb-3 text-center">
                  Pilot Portal
                </h2>

                {/* Description */}
                <p className="text-white/70 text-[10px] md:text-sm leading-relaxed mb-4 text-center max-w-[220px]">
                  Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records.
                </p>

                {/* Learn More Button */}
                <button className="px-5 py-2 border border-white/30 rounded-full text-[10px] md:text-sm font-medium hover:bg-white/10 transition-all duration-300">
                  Learn more
                </button>
              </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-[55%] bg-gradient-to-br from-slate-100 to-slate-200 p-5 md:p-8 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Header */}
                <div className="mb-4 md:mb-6">
                  <h2 className="text-lg md:text-2xl font-serif text-slate-800 mb-2">
                    Connecting pilots to the aviation industry
                  </h2>
                  <p className="text-slate-500 text-xs md:text-sm">
                    Sign in with your WingMentor credentials.
                  </p>
                </div>

                {/* WingMentor Account Label */}
                <p className="text-[10px] md:text-xs font-bold tracking-[0.2em] uppercase text-slate-400 mb-3 md:mb-4">
                  WINGMENTOR ACCOUNT
                </p>
                
                <div className="space-y-3 md:space-y-4">
                  {/* Email Input */}
                  <motion.div
                    className="h-10 md:h-12 bg-slate-100 border border-slate-300 rounded-xl flex items-center px-3 md:px-4 overflow-hidden relative"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-slate-600 text-xs md:text-sm font-mono">
                      {'demo@pilot.com'.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.8 + i * 0.06 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                    {/* Mouse cursor moves to email and clicks */}
                    <motion.div
                      className="absolute left-24 md:left-28 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: 80, y: -30 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [80, 0, 0, 0, 0], y: [-30, 0, 0, 0, 0] }}
                      transition={{ delay: 0.5, duration: 1.2, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-4 h-4 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 0.8, duration: 0.4 }}
                        className="absolute top-0 left-0 w-4 h-4 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </motion.div>
                  
                  {/* Password Input */}
                  <motion.div
                    className="h-10 md:h-12 bg-slate-100 border border-slate-300 rounded-xl flex items-center px-3 md:px-4 overflow-hidden relative"
                  >
                    <svg className="w-4 h-4 md:w-5 md:h-5 text-slate-400 mr-2 md:mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-slate-600 text-xs md:text-sm font-mono tracking-widest">
                      {'••••••••'.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 2.0 + i * 0.05 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                    {/* Mouse cursor moves to password and clicks */}
                    <motion.div
                      className="absolute left-24 md:left-28 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: -50, y: -50 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [-50, 0, 0, 0, 0], y: [-50, 0, 0, 0, 0] }}
                      transition={{ delay: 1.7, duration: 1.2, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-4 h-4 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 2.0, duration: 0.4 }}
                        className="absolute top-0 left-0 w-4 h-4 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </motion.div>

                  {/* Forgot Password Link */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                    className="flex justify-end"
                  >
                    <span className="text-[10px] md:text-sm text-blue-600 hover:text-blue-700 font-medium">
                      Forgot Password?
                    </span>
                  </motion.div>

                  {/* Login Button */}
                  <motion.div className="relative">
                    <motion.button
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 2.8, duration: 0.3 }}
                      className="w-full py-3 md:py-4 bg-[#1a1f36] text-white rounded-xl text-xs md:text-sm font-semibold flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                    >
                      Login
                      <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                    </motion.button>
                    {/* Mouse cursor moves to login button and clicks */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: -100, y: 30 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [-100, 0, 0, 0, 0], y: [30, 0, 0, 0, 0] }}
                      transition={{ delay: 2.6, duration: 1.0, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-4 h-4 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 2.9, duration: 0.3 }}
                        className="absolute top-0 left-0 w-4 h-4 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2, duration: 0.3 }}
                  className="mt-4 md:mt-6 pt-4 md:pt-6 border-t border-slate-300 text-center"
                >
                  <p className="text-[10px] md:text-sm text-slate-500">
                    Not a member?{' '}
                    <span className="text-blue-600 font-medium">Create an account</span>
                    {' • '}
                    <span className="text-blue-600 font-medium">Visit Pilot Network</span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
            </motion.div>
          </motion.div>
        )}

        {/* Scene 4: Become a Member */}
        {scene === 'member' && (
          <motion.div
            key="member"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-gradient-to-br from-blue-900 via-slate-900 to-cyan-900 flex flex-col items-center justify-center p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center mb-6 shadow-2xl"
            >
              <ChevronRight className="w-12 h-12 text-white" />
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-3xl md:text-4xl font-serif text-white mb-4"
            >
              Become a Member
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="text-white/80 text-sm md:text-base max-w-xs"
            >
              Join our aviation community and unlock exclusive benefits
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-8 flex items-center gap-2 text-cyan-400"
            >
              <span className="text-sm font-medium">Click to get started</span>
              <motion.div
                animate={{ x: [0, 5, 0] }}
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <ChevronRight className="w-5 h-5" />
              </motion.div>
            </motion.div>

            {/* Decorative elements */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-white/30 rounded-full"
                initial={{ 
                  x: Math.random() * 400 - 200, 
                  y: Math.random() * 300 - 150,
                  opacity: 0 
                }}
                animate={{ 
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{ 
                  duration: 2, 
                  delay: 0.8 + i * 0.2,
                  repeat: Infinity
                }}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress indicator */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
        {['search', 'registration', 'portal', 'member'].map((s, i) => (
          <motion.div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              ['search', 'registration', 'portal', 'member'].indexOf(scene) >= i
                ? 'bg-white'
                : 'bg-white/30'
            }`}
            animate={{
              scale: scene === s ? 1.5 : 1
            }}
          />
        ))}
      </div>
    </div>
  );
};
