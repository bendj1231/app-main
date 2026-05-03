/**
 * Bookmarked Pathways Component
 * 
 * Simple access button for bookmarks functionality
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bookmark, ChevronRight } from 'lucide-react';

interface BookmarkedPathwaysProps {
  className?: string;
  onNavigate?: (tab: string) => void;
}

const BookmarkedPathways: React.FC<BookmarkedPathwaysProps> = ({ className = '', onNavigate }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleAccessBookmarks = () => {
    // Navigate to bookmarks view
    if (onNavigate) {
      onNavigate('bookmarks');
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className={`bg-gradient-to-br from-slate-900/60 to-slate-800/40 backdrop-blur-2xl border border-slate-600/30 rounded-none p-3 shadow-2xl shadow-black/70 ${className}`}>
      <motion.button
        onClick={handleAccessBookmarks}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full flex items-center justify-between group cursor-pointer"
      >
        <div className="flex items-center gap-3">
          <div className="relative">
            <Bookmark className="w-5 h-5 text-white" />
            <div className="absolute -top-1 -right-1 w-2 h-2 bg-teal-400 rounded-full animate-pulse" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-bold text-white">» ACCESS BOOKMARKS</h3>
            <p className="text-xs text-slate-400">Quick access to saved pathways</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-300 bg-slate-700/50 px-2 py-1 rounded border border-slate-600/40">
            12 items
          </span>
          <div className="w-8 h-8 rounded-lg bg-slate-700/50 border border-slate-600/40 flex items-center justify-center group-hover:bg-slate-600/50 group-hover:border-slate-500/50 transition-all duration-300">
            <ChevronRight className="w-4 h-4 text-teal-400" />
          </div>
        </div>
      </motion.button>

      {/* Simple dropdown indicator */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-2 pt-2 border-t border-slate-600/30"
        >
          <div className="text-xs text-slate-400">
            Bookmarks would open here • Last updated 2 hours ago
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default BookmarkedPathways;
