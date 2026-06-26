import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BecomeMemberPage } from './BecomeMemberPage';

interface BecomeMemberOverlayProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigate: (page: string) => void;
  onLogin?: () => void;
}

export const BecomeMemberOverlay: React.FC<BecomeMemberOverlayProps> = ({ isOpen, onClose, onNavigate, onLogin }) => {
  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // Close on ESC
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            overflow: 'auto',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
          }}
        >
          {/* Close button */}
          <motion.button
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.3 }}
            onClick={onClose}
            style={{
              position: 'fixed',
              top: 24,
              right: 24,
              zIndex: 10000,
              background: 'rgba(255,255,255,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              borderRadius: '50%',
              width: 40,
              height: 40,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.8)',
              fontSize: 20,
              backdropFilter: 'blur(10px)',
            }}
            whileHover={{ scale: 1.1, background: 'rgba(255,255,255,0.2)' }}
            whileTap={{ scale: 0.95 }}
          >
            &#x2715;
          </motion.button>

          {/* Render BecomeMemberPage inline */}
          <div style={{ position: 'relative', zIndex: 1 }}>
            <BecomeMemberPage
              onBack={onClose}
              onNavigate={onNavigate}
              onLogin={onLogin}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default BecomeMemberOverlay;
