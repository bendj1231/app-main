import React from 'react';
import { motion } from 'framer-motion';
import { searchFilters, type SearchFilterId } from './searchData';

interface FilterPillsProps {
  active: SearchFilterId;
  onChange: (filter: SearchFilterId) => void;
  className?: string;
}

export const FilterPills: React.FC<FilterPillsProps> = ({ active, onChange, className = '' }) => {
  return (
    <div className={`flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 ${className}`}>
      {searchFilters.map((filter) => {
        const isActive = filter.id === active;
        return (
          <button
            key={filter.id}
            type="button"
            onClick={() => onChange(filter.id)}
            className={`relative shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors ${
              isActive ? 'text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'
            }`}
          >
            {isActive && (
              <motion.div
                layoutId="search-filter-pill"
                className="absolute inset-0 bg-indigo-600 rounded-full"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{filter.label}</span>
          </button>
        );
      })}
    </div>
  );
};
