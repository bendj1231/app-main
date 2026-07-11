import React, { useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  Flame,
  TrendingUp,
  Bell,
  Search,
  X,
  ChevronRight,
  Sparkles,
  Command,
  CornerDownLeft,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { FilterPills } from './FilterPills';
import { QuickJumpCards } from './QuickJumpCards';
import {
  useSearchEngine,
  useGroupedResults,
  groupOrder,
  groupLabels,
  highlightMatch,
} from './useSearchEngine';
import { SearchIcon } from './searchIcons';
import { resultTypeIcon } from './searchData';
import {
  type SearchFilterId,
  TRENDING_SEARCHES,
  SEARCH_EXAMPLES,
  searchUpdates,
  type SearchResult,
} from './searchData';

interface SearchSurfaceProps {
  query: string;
  filter: SearchFilterId;
  onChangeFilter: (filter: SearchFilterId) => void;
  onChangeQuery: (query: string) => void;
  onClose: () => void;
  recentSearches: string[];
  onAddRecent: (query: string) => void;
  onClearRecent: () => void;
  onRemoveRecent: (query: string) => void;
}

const surfaceVariants = {
  hidden: { opacity: 0, y: -8, scale: 0.98 },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { duration: 0.2, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
  exit: { opacity: 0, y: -8, scale: 0.98, transition: { duration: 0.15 } },
};

export const SearchSurface: React.FC<SearchSurfaceProps> = ({
  query,
  filter,
  onChangeFilter,
  onChangeQuery,
  onClose,
  recentSearches,
  onAddRecent,
  onClearRecent,
  onRemoveRecent,
}) => {
  const navigate = useNavigate();
  const trimmedQuery = query.trim();
  const hasQuery = trimmedQuery.length > 0;
  const { results } = useSearchEngine({ query, filter, limit: 40 });
  const grouped = useGroupedResults({ query, filter, limit: 40 });

  const handleResultClick = (result: SearchResult) => {
    onAddRecent(trimmedQuery || result.title);
    navigate(result.route);
    onClose();
  };

  const handleTrendingClick = (term: string) => {
    onChangeQuery(term);
    onAddRecent(term);
  };

  const handleExampleClick = (term: string) => {
    const clean = term.replace(/^Try "|"$/g, '');
    onChangeQuery(clean);
    onAddRecent(clean);
  };

  const showEmpty = hasQuery && results.length === 0;
  const showResults = hasQuery && results.length > 0;
  const showDiscovery = !hasQuery;

  const updateItems = useMemo(() => searchUpdates.slice(0, 4), []);

  return (
    <motion.div
      variants={surfaceVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-x-0 bottom-0 top-0 md:absolute md:top-full md:bottom-auto md:left-0 md:right-0 md:mt-3 z-50 md:rounded-2xl border border-slate-700 bg-slate-950/95 backdrop-blur-xl shadow-2xl overflow-hidden flex flex-col"
    >
      <div className="flex md:hidden items-center justify-between p-4 border-b border-slate-800">
        <p className="text-sm font-semibold text-white">Search</p>
        <button
          type="button"
          onClick={onClose}
          className="p-2 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          aria-label="Close search"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
      <div className="hidden md:block p-4 border-b border-slate-800">
        <FilterPills active={filter} onChange={onChangeFilter} />
      </div>
      <div className="md:hidden p-4 border-b border-slate-800">
        <FilterPills active={filter} onChange={onChangeFilter} />
      </div>

      <div className="flex-1 md:max-h-[70vh] overflow-y-auto p-4 space-y-6">
        <AnimatePresence mode="wait">
          {showResults && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                  Suggested pathways
                </p>
                <button
                  type="button"
                  onClick={onClose}
                  className="text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  Close
                </button>
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white">
                Matches for <span className="text-indigo-400">&quot;{query}&quot;</span>
              </h2>

              {groupOrder.map((type) => {
                const items = grouped[type];
                if (!items || items.length === 0) return null;
                return (
                  <div key={type} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400">
                        {groupLabels[type] || type}
                      </p>
                      <span className="text-xs text-slate-500">{items.length}</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {items.slice(0, 6).map((item) => (
                        <ResultCard
                          key={`${item.type}-${item.id}`}
                          item={item}
                          query={query}
                          onClick={() => handleResultClick(item)}
                        />
                      ))}
                    </div>
                  </div>
                );
              })}
            </motion.div>
          )}

          {showEmpty && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex flex-col items-center justify-center text-center py-12"
            >
              <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center mb-4">
                <Search className="w-7 h-7 text-slate-500" />
              </div>
              <p className="text-lg font-semibold text-white mb-2">No pathways found</p>
              <p className="text-sm text-slate-400 max-w-md mb-6">
                Try searching for an aircraft model like &quot;A320&quot;, a manufacturer like
                &quot;Airbus&quot;, an airline like &quot;Emirates&quot;, or a school like &quot;WCC
                aviation college&quot;.
              </p>
              <div className="flex flex-wrap justify-center gap-2">
                {SEARCH_EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => handleExampleClick(example)}
                    className="px-3 py-1.5 text-sm text-slate-300 bg-slate-900 border border-slate-800 rounded-full hover:border-indigo-500/50 hover:text-white transition-colors"
                  >
                    {example}
                  </button>
                ))}
              </div>
            </motion.div>
          )}

          {showDiscovery && (
            <motion.div
              key="discovery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="space-y-6"
            >
              <QuickJumpCards
                onNavigate={(route) => {
                  navigate(route);
                  onClose();
                }}
              />

              {recentSearches.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                      <Clock className="w-3.5 h-3.5" />
                      Recent searches
                    </p>
                    <button
                      type="button"
                      onClick={onClearRecent}
                      className="text-xs text-slate-500 hover:text-white transition-colors"
                    >
                      Clear
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <div
                        key={term}
                        className="group flex items-center gap-2 px-3 py-1.5 text-sm text-slate-300 bg-slate-900/60 border border-slate-800 rounded-full hover:border-slate-600 transition-colors"
                      >
                        <button
                          type="button"
                          onClick={() => onChangeQuery(term)}
                          className="flex items-center gap-1.5"
                        >
                          <Clock className="w-3.5 h-3.5 text-slate-500" />
                          <span>{term}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onRemoveRecent(term)}
                          className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-slate-700 text-slate-500 hover:text-white transition-all"
                          aria-label={`Remove ${term}`}
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Flame className="w-3.5 h-3.5" />
                  Trending now
                </p>
                <div className="flex flex-wrap gap-2">
                  {TRENDING_SEARCHES.map((term) => (
                    <button
                      key={term}
                      type="button"
                      onClick={() => handleTrendingClick(term)}
                      className="px-3 py-1.5 text-sm text-slate-300 bg-slate-900/60 border border-slate-800 rounded-full hover:border-indigo-500/50 hover:text-white transition-colors flex items-center gap-1.5"
                    >
                      <TrendingUp className="w-3.5 h-3.5 text-indigo-400" />
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-400 flex items-center gap-2">
                  <Bell className="w-3.5 h-3.5" />
                  Updates & news
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {updateItems.map((update) => (
                    <button
                      key={update.id}
                      type="button"
                      onClick={() => {
                        navigate(update.route);
                        onClose();
                      }}
                      className="group text-left p-3 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-slate-600 hover:bg-slate-800/40 transition-all"
                    >
                      <div className="flex items-center gap-2 mb-2">
                        <span className="px-2 py-0.5 text-[0.65rem] font-bold uppercase tracking-wider rounded bg-indigo-600/20 text-indigo-300 border border-indigo-500/20">
                          {update.tag}
                        </span>
                        <span className="text-xs text-slate-500">{update.date}</span>
                      </div>
                      <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
                        {update.title}
                      </p>
                      <p className="text-xs text-slate-400 line-clamp-2 mt-1">{update.subtitle}</p>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="px-4 py-2.5 border-t border-slate-800 bg-slate-950/80 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1">
            <Command className="w-3 h-3" />K to open
          </span>
          <span className="flex items-center gap-1">
            <CornerDownLeft className="w-3 h-3" /> to select
          </span>
          <span className="hidden sm:inline-flex items-center gap-1">
            <span className="px-1 rounded bg-slate-800 border border-slate-700">esc</span> to close
          </span>
        </div>
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3 h-3 text-indigo-400" />
          <span className="text-indigo-400">Search across all tabs & pages</span>
        </div>
      </div>
    </motion.div>
  );
};

const ResultCard: React.FC<{ item: SearchResult; query: string; onClick: () => void }> = ({
  item,
  query,
  onClick,
}) => {
  const iconName = resultTypeIcon[item.type] || 'Search';
  return (
    <button
      type="button"
      onClick={onClick}
      className="group flex items-start gap-3 p-3 rounded-xl bg-slate-900/40 border border-slate-800 hover:border-indigo-500/30 hover:bg-slate-800/40 transition-all text-left"
    >
      {item.image ? (
        <div className="relative shrink-0 w-12 h-12 rounded-lg overflow-hidden bg-slate-800">
          <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
          <span className="absolute top-1 right-1 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase tracking-wider rounded bg-slate-950/70 text-white border border-white/10">
            {item.badge}
          </span>
        </div>
      ) : (
        <div className="shrink-0 w-12 h-12 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400">
          <SearchIcon name={iconName} size={22} />
        </div>
      )}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-white group-hover:text-indigo-300 transition-colors line-clamp-1">
          {highlightMatch(item.title, query)}
        </p>
        <p className="text-xs text-slate-400 line-clamp-2 mt-0.5">
          {highlightMatch(item.subtitle, query)}
        </p>
      </div>
      <ChevronRight className="shrink-0 w-4 h-4 text-slate-600 group-hover:text-indigo-400 transition-colors mt-1" />
    </button>
  );
};
