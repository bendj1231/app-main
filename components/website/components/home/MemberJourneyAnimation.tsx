import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MousePointer2, ArrowRight, Lock, User, ChevronRight } from 'lucide-react';

interface MemberJourneyAnimationProps {
  isHovered?: boolean;
}

export const MemberJourneyAnimation: React.FC<MemberJourneyAnimationProps> = () => {
  const [scene, setScene] = useState<'search' | 'registration' | 'portal' | 'programs' | 'member'>('search');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTypingRef = useRef(false);
  const isCompleteRef = useRef(false);

  const targetText = 'pilotrecognition.com';

  // Auto-start animation on mount
  useEffect(() => {
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

    return () => {
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
      // Give time for login animation then go to programs scene
      const portalTimeout = setTimeout(() => setScene('programs'), 3500);
      return () => clearTimeout(portalTimeout);
    } else if (scene === 'programs') {
      // Show programs scene for 6 seconds then loop back to search
      const programsTimeout = setTimeout(() => {
        setScene('search');
        setTypedText('');
        hasStartedTypingRef.current = false;
        isCompleteRef.current = false;
      }, 6000);
      return () => clearTimeout(programsTimeout);
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
            {/* Simple Blue Gradient Background */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-400 via-blue-500 to-indigo-600" />
            
            {/* Portal Modal - Compact square/rectangular */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="relative w-[95%] max-w-[400px] aspect-[4/3] bg-white rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col md:flex-row scale-[0.75]"
          >
            {/* Left Side - Dark Blue with Info */}
            <div className="w-full md:w-[45%] bg-[#0a1628] text-white p-2 md:p-3 flex flex-col relative">
              {/* Logo - Centered */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="mt-1 mb-1 flex justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                  alt="WingMentor Logo"
                  className="w-10 md:w-12 h-auto object-contain"
                />
              </motion.div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="flex-1 flex flex-col justify-center items-center"
              >
                {/* Mentor Network Label */}
                <p className="text-[5px] md:text-[6px] font-bold tracking-[0.15em] uppercase text-blue-400 mb-0.5 text-center">
                  Mentor Network
                </p>

                {/* Title */}
                <h2 className="text-[10px] md:text-sm font-serif mb-1 text-center">
                  Pilot Portal
                </h2>

                {/* Description */}
                <p className="text-white/70 text-[6px] md:text-[8px] leading-tight mb-1 text-center max-w-[110px]">
                  Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data—covering flight experience, assessments, and ATS-ready records shared with approved aviation bodies.
                </p>

                {/* Learn More Button */}
                <button className="px-2 py-0.5 border border-white/30 rounded-full text-[6px] md:text-[8px] font-medium hover:bg-white/10 transition-all duration-300">
                  Learn more
                </button>
              </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-[55%] bg-gradient-to-br from-slate-100 to-slate-200 p-2 md:p-3 flex flex-col">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.1 }}
              >
                {/* Header */}
                <div className="mb-1 md:mb-2 mt-0">
                  <h2 className="text-[8px] md:text-[10px] font-serif text-slate-800 mb-0.5 leading-tight">
                    Connecting pilots to the aviation industry
                  </h2>
                  <p className="text-slate-500 text-[6px] md:text-[8px]">
                    Sign in with credentials.
                  </p>
                </div>

                {/* WingMentor Account Label */}
                <p className="text-[5px] md:text-[6px] font-bold tracking-[0.08em] uppercase text-slate-400 mb-1">
                  WINGMENTOR ACCOUNT
                </p>
                
                <div className="space-y-1.5 md:space-y-2">
                  {/* Email Input - visible immediately, typing starts after */}
                  <div className="h-5 md:h-6 bg-slate-100 border border-slate-300 rounded-lg flex items-center px-1.5 md:px-2 overflow-hidden relative">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    <span className="text-slate-600 text-[7px] md:text-[8px] font-mono">
                      {'demo@pilot.com'.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 0.5 + i * 0.05 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                    {/* Mouse cursor moves to email and clicks */}
                    <motion.div
                      className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: 50, y: -15 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [50, 0, 0, 0, 0], y: [-15, 0, 0, 0, 0] }}
                      transition={{ delay: 0.3, duration: 1.0, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-2.5 h-2.5 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 0.5, duration: 0.3 }}
                        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </div>
                  
                  {/* Password Input - visible immediately, typing starts after */}
                  <div className="h-5 md:h-6 bg-slate-100 border border-slate-300 rounded-lg flex items-center px-1.5 md:px-2 overflow-hidden relative">
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400 mr-1 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                    </svg>
                    <span className="text-slate-600 text-[7px] md:text-[8px] font-mono tracking-widest">
                      {'••••••••'.split('').map((char, i) => (
                        <motion.span
                          key={i}
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ delay: 1.5 + i * 0.04 }}
                        >
                          {char}
                        </motion.span>
                      ))}
                    </span>
                    {/* Eye icon for password */}
                    <svg className="w-2.5 h-2.5 md:w-3 md:h-3 text-slate-400 ml-auto flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    {/* Mouse cursor moves to password and clicks */}
                    <motion.div
                      className="absolute left-14 md:left-16 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: -30, y: -30 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [-30, 0, 0, 0, 0], y: [-30, 0, 0, 0, 0] }}
                      transition={{ delay: 1.3, duration: 1.0, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-2.5 h-2.5 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 1.5, duration: 0.3 }}
                        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </div>

                  {/* Remember Me & Forgot Password */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 2.5, duration: 0.3 }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded border border-slate-300 bg-white" />
                      <span className="text-[6px] md:text-[8px] text-slate-600">Remember me</span>
                    </div>
                    <span className="text-[6px] md:text-[8px] text-blue-600 hover:text-blue-700 font-medium">
                      Forgot Password?
                    </span>
                  </motion.div>

                  {/* Login Button - render immediately */}
                  <motion.div className="relative">
                    <button className="w-full py-1.5 md:py-2 bg-[#1a1f36] text-white rounded-lg text-[6px] md:text-[8px] font-semibold flex items-center justify-center gap-0.5 shadow-lg hover:shadow-xl">
                      Login
                      <ArrowRight className="w-1.5 h-1.5 md:w-2 md:h-2" />
                    </button>
                    {/* Mouse cursor moves to login button and clicks */}
                    <motion.div
                      className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10"
                      initial={{ opacity: 0, x: -40, y: 15 }}
                      animate={{ opacity: [0, 1, 1, 1, 0], x: [-40, 0, 0, 0, 0], y: [15, 0, 0, 0, 0] }}
                      transition={{ delay: 2.6, duration: 1.0, times: [0, 0.3, 0.5, 0.8, 1] }}
                    >
                      <MousePointer2 className="w-2.5 h-2.5 text-slate-700 fill-slate-700" />
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 0, 1, 0, 0] }}
                        transition={{ delay: 2.9, duration: 0.3 }}
                        className="absolute top-0 left-0 w-2.5 h-2.5 rounded-full bg-blue-500/30"
                      />
                    </motion.div>
                  </motion.div>
                </div>

                {/* Footer Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 3.2, duration: 0.3 }}
                  className="mt-1 md:mt-2 pt-1 md:pt-2 border-t border-slate-300 text-center"
                >
                  <p className="text-[6px] md:text-[8px] text-slate-500">
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

        {/* Scene 4: Access Programs / Pilot Recognition / Pathways */}
        {scene === 'programs' && (
          <motion.div
            key="programs"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center p-8 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Three words centered - fade out as logo fades in */}
            <motion.div
              className="flex flex-col items-center justify-center gap-3"
              initial={{ opacity: 1, scale: 1 }}
              animate={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: 2.5, duration: 0.8, ease: "easeInOut" }}
            >
              {/* Programs */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="font-serif text-slate-900 text-xl md:text-3xl tracking-wide">Programs</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
              </motion.div>

              {/* Pilot Recognition */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="flex items-center gap-2"
              >
                <span className="font-serif text-slate-900 text-xl md:text-3xl tracking-wide">Pilot Recognition</span>
                <ChevronRight className="w-5 h-5 md:w-6 md:h-6 text-slate-400" />
              </motion.div>

              {/* Pathways */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.3, duration: 0.6 }}
              >
                <span className="font-serif text-slate-900 text-xl md:text-3xl tracking-wide">Pathways</span>
              </motion.div>
            </motion.div>

            {/* Logo with slogan - fades in as text fades out */}
            <motion.div
              className="absolute inset-0 flex flex-col items-center justify-center bg-white"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.0, duration: 1.5 }}
            >
              <img
                src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                alt="WingMentor Logo"
                className="w-28 md:w-36 h-auto object-contain mb-3"
              />
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 4.0, duration: 0.8 }}
                className="font-serif text-slate-700 text-base md:text-lg tracking-wide"
              >
                Bridging the pilot gap
              </motion.p>
            </motion.div>
          </motion.div>
        )}
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
