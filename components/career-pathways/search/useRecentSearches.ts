import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'pcp_search_recent';
const MAX_RECENT = 10;

const readRecent = (): string[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as string[];
      return Array.isArray(parsed) ? parsed.slice(0, MAX_RECENT) : [];
    }
  } catch {
    // ignore storage errors
  }
  return [];
};

export const useRecentSearches = () => {
  const [recent, setRecent] = useState<string[]>(readRecent);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(recent.slice(0, MAX_RECENT)));
    } catch {
      // ignore storage errors
    }
  }, [recent]);

  const add = useCallback((query: string) => {
    const trimmed = query.trim();
    if (!trimmed) return;
    setRecent((prev) => {
      const next = prev.filter((q) => q.toLowerCase() !== trimmed.toLowerCase());
      return [trimmed, ...next].slice(0, MAX_RECENT);
    });
  }, []);

  const remove = useCallback((query: string) => {
    setRecent((prev) => prev.filter((q) => q !== query));
  }, []);

  const clear = useCallback(() => setRecent([]), []);

  return { recent, add, remove, clear };
};
