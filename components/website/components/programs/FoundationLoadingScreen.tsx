import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FoundationLoadingScreenProps {
  onComplete: () => void;
  duration?: number;
}

export const FoundationLoadingScreen: React.FC<FoundationLoadingScreenProps> = ({
  onComplete,
  duration = 2500,
}) => {
  const [progress, setProgress] = useState(0);
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => onCompleteRef.current(), 300);
          return 100;
        }
        return prev + 2;
      });
    }, duration / 50);

    return () => clearInterval(interval);
  }, [duration]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.4 }}
        style={{
          position: 'fixed',
          inset: 0,
          zIndex: 9999,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #0f172a 100%)',
        }}
      >
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.6, ease: 'easeOut' }}
          style={{ marginBottom: '2rem' }}
        >
          <img
            src="/logo.png"
            alt="Wing Mentor"
            style={{
              width: '120px',
              height: 'auto',
              filter: 'drop-shadow(0 4px 12px rgba(37, 99, 235, 0.3))',
            }}
          />
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          style={{ textAlign: 'center', marginBottom: '1.5rem' }}
        >
          <h1
            style={{
              fontFamily: 'Georgia, serif',
              fontSize: 'clamp(1.5rem, 4vw, 2.25rem)',
              fontWeight: 400,
              color: '#f8fafc',
              margin: '0 0 0.5rem 0',
              letterSpacing: '-0.01em',
              lineHeight: 1.3,
            }}
          >
            Foundation Program
          </h1>
          <p
            style={{
              fontFamily: 'system-ui, -apple-system, sans-serif',
              fontSize: 'clamp(0.875rem, 2vw, 1.1rem)',
              fontWeight: 400,
              color: '#94a3b8',
              margin: 0,
              letterSpacing: '0.05em',
            }}
          >
            Connecting Pilots to the Industry
          </p>
        </motion.div>

        {/* Progress Bar */}
        <motion.div
          initial={{ width: 0, opacity: 0 }}
          animate={{ width: '200px', opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.4 }}
          style={{
            width: '200px',
            height: '3px',
            background: 'rgba(255, 255, 255, 0.1)',
            borderRadius: '999px',
            overflow: 'hidden',
            position: 'relative',
          }}
        >
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #3b82f6, #60a5fa)',
              borderRadius: '999px',
              boxShadow: '0 0 10px rgba(59, 130, 246, 0.5)',
            }}
          />
        </motion.div>

        {/* Loading text */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          style={{
            marginTop: '1rem',
            fontFamily: 'system-ui, -apple-system, sans-serif',
            fontSize: '0.75rem',
            fontWeight: 400,
            color: '#64748b',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
          }}
        >
          Loading your dashboard
        </motion.p>
      </motion.div>
    </AnimatePresence>
  );
};
