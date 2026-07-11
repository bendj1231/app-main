import React from 'react';
import { motion } from 'framer-motion';
import { quickJumpItems } from './searchData';
import { SearchIcon } from './searchIcons';

interface QuickJumpCardsProps {
  onNavigate: (route: string) => void;
  className?: string;
}

export const QuickJumpCards: React.FC<QuickJumpCardsProps> = ({ onNavigate, className = '' }) => {
  return (
    <div className={`grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 ${className}`}>
      {quickJumpItems.map((item, index) => (
        <motion.button
          key={item.id}
          type="button"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.04, duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
          onClick={() => onNavigate(item.route)}
          className="group relative flex flex-col items-start gap-3 p-3 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/60 transition-all text-left"
        >
          <div
            className="p-2 rounded-lg"
            style={{ background: `${item.color}20`, color: item.color }}
          >
            <SearchIcon name={item.icon} size={20} />
          </div>
          <div>
            <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors">
              {item.title}
            </p>
            <p className="text-xs text-slate-500 leading-snug mt-0.5">{item.description}</p>
          </div>
        </motion.button>
      ))}
    </div>
  );
};
