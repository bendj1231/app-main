import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MousePointer2, ArrowRight, Lock, User, ChevronRight } from 'lucide-react';

interface MemberJourneyAnimationProps {
  isHovered: boolean;
}

export const MemberJourneyAnimation: React.FC<MemberJourneyAnimationProps> = ({ isHovered }) => {
  const [scene, setScene] = useState<'search' | 'warp' | 'portal' | 'member'>('search');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const typingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const warpTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const hasStartedTypingRef = useRef(false);
  const isCompleteRef = useRef(false);

  const targetText = 'pilotrecognition.com';

  // Reset animation when hover starts
  useEffect(() => {
    if (isHovered) {
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
    }
  }, [isHovered]);

  // Typing animation
  useEffect(() => {
    if (scene === 'search' && isHovered && !hasStartedTypingRef.current && !isCompleteRef.current) {
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
            // Quick click effect then transition to warp
            warpTimeoutRef.current = setTimeout(() => setScene('warp'), 300);
          }
        }
      }, 50);

      return () => {
        // Don't clear on re-render, only clear on unmount or scene change
      };
    }
  }, [scene, isHovered, targetText]);

  // Cursor blink
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor(prev => !prev);
    }, 530);
    return () => clearInterval(cursorInterval);
  }, []);

  // Scene transitions
  useEffect(() => {
    if (scene === 'warp') {
      const warpTimeout = setTimeout(() => setScene('portal'), 800);
      return () => clearTimeout(warpTimeout);
    } else if (scene === 'portal') {
      // Give more time for the login form animation to complete
      const portalTimeout = setTimeout(() => setScene('member'), 4000);
      return () => clearTimeout(portalTimeout);
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

              {/* Animated Mouse */}
              <motion.div
                className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none z-10"
                initial={{ x: -100, y: 0 }}
                animate={{ x: 0, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5, ease: 'easeOut' }}
              >
                <MousePointer2 className="w-6 h-6 text-slate-700 fill-slate-700" />
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1, 0] }}
                  transition={{ delay: 0.8, duration: 0.3 }}
                  className="absolute top-0 left-0 w-6 h-6 rounded-full bg-blue-500/30"
                />
              </motion.div>
            </div>
          </motion.div>
        )}

        {/* Scene 2: Warp Transition */}
        {scene === 'warp' && (
          <motion.div
            key="warp"
            className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800"
          >
            <motion.div
              className="w-full h-full relative"
              initial={{ scale: 1, opacity: 1 }}
              animate={{ scale: [1, 0.1, 10], opacity: [1, 1, 0] }}
              transition={{ duration: 0.8, ease: 'easeInOut' }}
            >
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-2 h-2 bg-white rounded-full"
                  initial={{ x: '-50%', y: '-50%', scale: 0 }}
                  animate={{
                    x: `${Math.cos(i * 18 * Math.PI / 180) * 200 - 50}%`,
                    y: `${Math.sin(i * 18 * Math.PI / 180) * 200 - 50}%`,
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 0.6, delay: i * 0.02 }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}

        {/* Scene 3: Portal Login Page */}
        {scene === 'portal' && (
          <motion.div
            key="portal"
            initial={{ opacity: 0, scale: 1.2 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-4 bg-white flex flex-col md:flex-row rounded-xl overflow-hidden shadow-2xl"
          >
            {/* Left Side - Dark Blue with Info */}
            <div className="w-full md:w-[45%] bg-[#0a1628] text-white p-6 md:p-8 flex flex-col relative">
              {/* Logo - Centered */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="mt-2 mb-2 flex justify-center"
              >
                <img
                  src="https://lh3.googleusercontent.com/d/1U7pwMY1-ZsvNYC0Np3fVw5OhW3rTD5DR"
                  alt="WingMentor Logo"
                  className="w-24 h-auto object-contain"
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
                <p className="text-[8px] font-bold tracking-[0.3em] uppercase text-blue-400 mb-1 text-center">
                  Mentor Network
                </p>

                {/* Title */}
                <h2 className="text-xl md:text-2xl font-serif mb-2 text-center">
                  Pilot Portal
                </h2>

                {/* Description */}
                <p className="text-white/70 text-[10px] leading-relaxed mb-3 text-center max-w-[200px]">
                  Access personalized program enrollment, pathway briefs, and WingMentor Pilot Portfolio data.
                </p>

                {/* Learn More Button */}
                <button className="px-4 py-1.5 border border-white/30 rounded-full text-[10px] font-medium hover:bg-white/10 transition-all duration-300">
                  Learn more
                </button>
              </motion.div>
            </div>

            {/* Right Side - Login Form */}
            <div className="w-full md:w-[55%] bg-gradient-to-br from-slate-100 to-slate-200 p-4 md:p-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 }}
              >
                {/* Header */}
                <div className="mb-3">
                  <h2 className="text-base md:text-lg font-serif text-slate-800 mb-1">
                    Connecting pilots to the aviation industry
                  </h2>
                  <p className="text-slate-500 text-[10px]">
                    Sign in with your WingMentor credentials.
                  </p>
                </div>

                {/* WingMentor Account Label */}
                <p className="text-[8px] font-bold tracking-[0.2em] uppercase text-slate-400 mb-2">
                  WINGMENTOR ACCOUNT
                </p>
                
                <div className="space-y-2">
                  {/* Email Input */}
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ delay: 0.5, duration: 0.4 }}
                    className="h-8 bg-slate-100 border border-slate-300 rounded-lg flex items-center px-2 overflow-hidden relative"
                  >
                    <User className="w-3 h-3 text-slate-400 mr-2" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.9, duration: 0.3 }}
                      className="text-slate-400 text-xs"
                    >
                      demo@pilot.com
                    </motion.span>
                    {/* Mouse click on email field */}
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 0, 0] }}
                      transition={{ delay: 0.6, duration: 0.5 }}
                    >
                      <MousePointer2 className="w-4 h-4 text-slate-600 fill-slate-600" />
                    </motion.div>
                  </motion.div>
                  
                  {/* Password Input */}
                  <motion.div
                    initial={{ opacity: 0, width: 0 }}
                    animate={{ opacity: 1, width: '100%' }}
                    transition={{ delay: 1.2, duration: 0.4 }}
                    className="h-8 bg-slate-100 border border-slate-300 rounded-lg flex items-center px-2 overflow-hidden relative"
                  >
                    <Lock className="w-3 h-3 text-slate-400 mr-2" />
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1.6, duration: 0.3 }}
                      className="text-slate-400 text-xs tracking-widest"
                    >
                      ••••••••
                    </motion.span>
                    {/* Mouse click on password field */}
                    <motion.div
                      className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: [0, 1, 1, 0], x: [0, 0, 0, 0] }}
                      transition={{ delay: 1.3, duration: 0.5 }}
                    >
                      <MousePointer2 className="w-4 h-4 text-slate-600 fill-slate-600" />
                    </motion.div>
                  </motion.div>

                  {/* Login Button */}
                  <motion.button
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1.6, duration: 0.3 }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full py-2 bg-[#1a1f36] hover:bg-[#252b4a] text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1 transition-all shadow-md"
                  >
                    Login
                    <ArrowRight className="w-3 h-3" />
                  </motion.button>
                </div>

                {/* Footer Links */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 2.0 }}
                  className="mt-3 pt-2 border-t border-slate-300 text-center"
                >
                  <p className="text-[10px] text-slate-500">
                    Not a member?{' '}
                    <span className="text-blue-600 font-medium">Create an account</span>
                  </p>
                </motion.div>
              </motion.div>
            </div>
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
        {['search', 'warp', 'portal', 'member'].map((s, i) => (
          <motion.div
            key={s}
            className={`w-2 h-2 rounded-full transition-colors ${
              ['search', 'warp', 'portal', 'member'].indexOf(scene) >= i
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
