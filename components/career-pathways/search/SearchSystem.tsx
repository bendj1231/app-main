import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { SearchBar } from './SearchBar';
import { SearchSurface } from './SearchSurface';
import { useRecentSearches } from './useRecentSearches';
import { type SearchFilterId } from './searchData';

interface SearchSystemProps {
  className?: string;
}

export const SearchSystem: React.FC<SearchSystemProps> = ({ className = '' }) => {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<SearchFilterId>('all');
  const [isOpen, setIsOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const { recent, add, remove, clear } = useRecentSearches();

  const handleOpen = useCallback(() => {
    setIsOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  }, []);

  const handleClose = useCallback(() => {
    setIsOpen(false);
    inputRef.current?.blur();
  }, []);

  const handleSubmit = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed) {
      navigate('/type-ratings');
    } else {
      add(trimmed);
      navigate(`/type-ratings?search=${encodeURIComponent(trimmed)}`);
    }
    handleClose();
  }, [query, navigate, add, handleClose]);

  const handleClear = useCallback(() => {
    setQuery('');
    inputRef.current?.focus();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isModifier = e.metaKey || e.ctrlKey;
      if (isModifier && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (isOpen) {
          handleClose();
        } else {
          handleOpen();
        }
      }
      if (e.key === 'Escape' && isOpen) {
        e.preventDefault();
        handleClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, handleOpen, handleClose]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        handleClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, handleClose]);

  return (
    <div ref={containerRef} className={`relative w-full ${className}`}>
      <SearchBar
        inputRef={inputRef}
        value={query}
        onChange={(value) => {
          setQuery(value);
          if (!isOpen) setIsOpen(true);
        }}
        onSubmit={handleSubmit}
        onClear={handleClear}
        onFocus={() => setIsOpen(true)}
        isOpen={isOpen}
      />

      <AnimatePresence>
        {isOpen && (
          <SearchSurface
            query={query}
            filter={filter}
            onChangeFilter={setFilter}
            onChangeQuery={(value) => {
              setQuery(value);
              if (!isOpen) setIsOpen(true);
            }}
            onClose={handleClose}
            recentSearches={recent}
            onAddRecent={add}
            onClearRecent={clear}
            onRemoveRecent={remove}
          />
        )}
      </AnimatePresence>
    </div>
  );
};
