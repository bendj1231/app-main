import React from 'react';
import { Search, X, Command } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export interface SearchBarProps {
  inputRef?: React.RefObject<HTMLInputElement | null>;
  value: string;
  onChange: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  onFocus?: () => void;
  onBlur?: () => void;
  placeholder?: string;
  isOpen?: boolean;
  className?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  inputRef,
  value,
  onChange,
  onSubmit,
  onClear,
  onFocus,
  onBlur,
  placeholder = 'Search aircraft, airlines, ATOs, programs, tabs, or actions...',
  isOpen = false,
  className = '',
}) => {
  const hasValue = value.trim().length > 0;

  return (
    <div
      className={`group relative w-full ${className}`}
      onClick={() => inputRef?.current?.focus()}
    >
      <div
        className={`relative flex items-center gap-3 w-full bg-slate-900/80 border rounded-2xl px-4 py-3.5 shadow-2xl backdrop-blur-xl transition-all duration-200 ${
          isOpen
            ? 'border-indigo-500/50 ring-2 ring-indigo-500/20 bg-slate-900/95'
            : 'border-slate-700 hover:border-slate-500'
        }`}
      >
        <div className="absolute -inset-1 bg-indigo-500/10 rounded-2xl blur-md opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <Search className="relative z-10 w-5 h-5 text-slate-400 shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          className="relative z-10 flex-1 bg-transparent text-base text-white placeholder:text-slate-500 focus:outline-none min-w-0"
          value={value}
          autoComplete="off"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck={false}
          onChange={(e) => onChange(e.target.value)}
          onFocus={onFocus}
          onBlur={onBlur}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && onSubmit) {
              e.preventDefault();
              onSubmit();
            }
            if (e.key === 'Escape' && onClear && hasValue) {
              e.preventDefault();
              onClear();
            }
          }}
        />
        <div className="relative z-10 flex items-center gap-2 shrink-0">
          <AnimatePresence mode="wait" initial={false}>
            {hasValue ? (
              <motion.button
                key="clear"
                type="button"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onClear?.();
                  inputRef?.current?.focus();
                }}
                className="p-1.5 rounded-lg hover:bg-slate-700 text-slate-400 hover:text-white transition-colors"
                aria-label="Clear search"
              >
                <X className="w-4 h-4" />
              </motion.button>
            ) : (
              <motion.div
                key="hint"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{ duration: 0.15 }}
                className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded-lg border border-slate-700 bg-slate-800/50 text-xs text-slate-400"
              >
                <Command className="w-3 h-3" />
                <span>K</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};
