export { SearchSystem } from './SearchSystem';
export { SearchBar } from './SearchBar';
export { SearchSurface } from './SearchSurface';
export { QuickJumpCards } from './QuickJumpCards';
export { FilterPills } from './FilterPills';
export {
  useSearchEngine,
  useGroupedResults,
  scoreMatch,
  highlightMatch,
} from './useSearchEngine.tsx';
export { useRecentSearches } from './useRecentSearches';
export {
  searchDataIndex,
  searchFilters,
  quickJumpItems,
  platformTabs,
  pathwayPages,
  trainingPrograms,
  searchActions,
  searchUpdates,
  TRENDING_SEARCHES,
  SEARCH_EXAMPLES,
} from './searchData';
export type {
  SearchResult,
  SearchFilterId,
  SearchResultType,
  SearchFilter,
  QuickJumpItem,
  PlatformTab,
  PathwayPage,
  TrainingProgram,
  SearchAction,
  SearchUpdate,
  SearchDataIndex,
} from './searchData';
