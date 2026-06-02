import React from 'react';
import { motion } from 'framer-motion';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  isDarkMode?: boolean;
}

export const GlassCard: React.FC<GlassCardProps> = ({ 
  children, 
  className = '', 
  onClick,
  isDarkMode = true 
}) => (
  <motion.div
    className={`backdrop-blur-xl rounded-2xl overflow-hidden ${
      isDarkMode 
        ? 'bg-slate-900/40 border border-slate-700/50' 
        : 'bg-white/70 border border-slate-200/50 shadow-lg'
    } ${className}`}
    onClick={onClick}
    whileHover={{ scale: onClick ? 1.01 : 1, borderColor: isDarkMode ? 'rgba(148, 163, 184, 0.3)' : 'rgba(148, 163, 184, 0.5)' }}
    transition={{ duration: 0.2 }}
  >
    {children}
  </motion.div>
);
