import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MousePointer2, ArrowRight, Lock, User, ChevronRight } from 'lucide-react';

interface MemberJourneyAnimationProps {
  isHovered: boolean;
}

export const MemberJourneyAnimation: React.FC<MemberJourneyAnimationProps> = ({ isHovered }) => {
  const [scene, setScene] = useState<'search' | 'warp' | 'portal' | 'member'>('search');
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const [isTyping, setIsTyping] = useState(false);

  const targetText = 'pilotrecognition.com';

  // Reset animation when hover starts
  useEffect(() => {
    if (isHovered) {
      setScene('search');
      setTypedText('');
      setIsTyping(false);
    }
  }, [isHovered]);

  // Typing animation
  useEffect(() => {
    if (scene === 'search' && isHovered && !isTyping) {
      setIsTyping(true);
      let index = 0;
      const typeInterval = setInterval(() => {
        if (index <= targetText.length) {
          setTypedText(targetText.slice(0, index));
          index++;
        } else {
          clearInterval(typeInterval);
          // Wait a moment then transition to warp
          setTimeout(() => setScene('warp'), 500);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [scene, isHovered, isTyping]);

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
      setTimeout(() => setScene('portal'), 800);
    } else if (scene === 'portal') {
      setTimeout(() => setScene('member'), 2000);
    }
  }, [scene]);

  return (
    <div className="absolute inset-0 overflow-hidden rounded-xl bg-white">
      <AnimatePresence mode="wait">
        {/* Scene 1: Search Page */}
        {scene === 'search' && (
          <motion.div
            key="search"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.5, filter: 'blur(20px)' }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-white flex flex-col items-center justify-center p-6"
          >
            {/* Browser Chrome */}
            <div className="w-full max-w-md bg-slate-100 rounded-t-lg p-2 flex items-center gap-2 border-b border-slate-200">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 bg-white rounded-md px-3 py-1 text-xs text-slate-400 text-center">
                Search or enter address
              </div>
            </div>

            {/* Search Bar Area */}
            <div className="w-full max-w-md bg-white rounded-b-lg shadow-lg p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-slate-800 mb-2 font-serif">
                  Pilot Recognition
                </h1>
                <p className="text-slate-500 text-sm">Your Aviation Career Starts Here</p>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                  <Search className="w-5 h-5" />
                </div>
                <div className="w-full pl-12 pr-4 py-3 bg-slate-100 border-2 border-blue-500 rounded-full text-slate-700 font-mono text-sm">
                  {typedText}
                  <motion.span
                    animate={{ opacity: showCursor ? 1 : 0 }}
                    className="inline-block w-0.5 h-5 bg-blue-500 ml-0.5"
                  />
                </div>

                {/* Animated Mouse */}
                <motion.div
                  className="absolute -right-4 -bottom-8 pointer-events-none"
                  initial={{ x: -50, y: -30 }}
                  animate={{ x: 0, y: 0 }}
                  transition={{ delay: 0.5, duration: 0.5, ease: 'easeOut' }}
                >
                  <MousePointer2 className="w-6 h-6 text-slate-700 fill-slate-700" />
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: [0, 1, 0] }}
                    transition={{ delay: 1, duration: 0.3 }}
                    className="absolute top-0 left-0 w-6 h-6 rounded-full bg-blue-500/30"
                  />
                </motion.div>
              </div>

              <div className="mt-4 text-center">
                <p className="text-xs text-slate-400">Press Enter to navigate</p>
              </div>
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
            className="absolute inset-0 bg-gradient-to-br from-slate-900 to-slate-800 flex"
          >
            {/* Left Side - Dark */}
            <div className="w-1/2 bg-[#0a1628] p-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center"
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-white/10 rounded-full flex items-center justify-center">
                  <Lock className="w-10 h-10 text-white" />
                </div>
                <h2 className="text-2xl font-serif text-white mb-2">Pilot Portal</h2>
                <p className="text-white/60 text-xs">Mentor Network</p>
              </motion.div>
            </div>

            {/* Right Side - Form */}
            <div className="w-1/2 bg-gradient-to-br from-slate-100 to-slate-200 p-6 flex flex-col justify-center">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5 }}
                className="space-y-4"
              >
                <h3 className="text-lg font-semibold text-slate-800">Connecting pilots to aviation</h3>
                
                <div className="space-y-3">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.7, duration: 0.5 }}
                    className="h-10 bg-white rounded-lg border border-slate-300 flex items-center px-3 overflow-hidden"
                  >
                    <User className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-400 text-sm">demo@pilot.com</span>
                  </motion.div>
                  
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ delay: 0.9, duration: 0.5 }}
                    className="h-10 bg-white rounded-lg border border-slate-300 flex items-center px-3 overflow-hidden"
                  >
                    <Lock className="w-4 h-4 text-slate-400 mr-2" />
                    <span className="text-slate-400 text-sm">••••••••</span>
                  </motion.div>

                  <motion.button
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.1 }}
                    className="w-full py-2.5 bg-[#1a1f36] text-white rounded-lg text-sm font-semibold flex items-center justify-center gap-2"
                  >
                    Login
                    <ArrowRight className="w-4 h-4" />
                  </motion.button>
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.3 }}
                  className="flex gap-2 justify-center"
                >
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
                  <div className="w-2 h-2 rounded-full bg-blue-500" />
                  <div className="w-2 h-2 rounded-full bg-slate-300" />
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
