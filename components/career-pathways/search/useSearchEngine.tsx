import React, { useMemo } from 'react';
import {
  searchDataIndex,
  searchFilters,
  type SearchResult,
  type SearchFilterId,
  type SearchResultType,
} from './searchData';

export interface SearchEngineOptions {
  query: string;
  filter: SearchFilterId;
  limit?: number;
}

const escapeRegExp = (str: string) => str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const scoreMatch = (text: string, query: string): number => {
  const normalized = text.toLowerCase();
  const q = query.toLowerCase().trim();
  if (!q) return 0;
  if (normalized === q) return 100;
  if (normalized.startsWith(q + ' ')) return 80;
  if (
    normalized.includes(' ' + q + ' ') ||
    normalized.includes(' ' + q) ||
    normalized.startsWith(q)
  )
    return 60;
  if (normalized.includes(q)) return 40;
  return 0;
};

export const highlightMatch = (text: string, query: string): React.ReactNode => {
  if (!query) return text;
  const q = query.toLowerCase().trim();
  if (!q) return text;
  const regex = new RegExp(`(${escapeRegExp(q)})`, 'gi');
  const parts = text.split(regex);
  return parts.map((part, i) => {
    const isMatch = regex.test(part);
    regex.lastIndex = 0;
    return isMatch ? (
      <mark key={i} className="bg-indigo-500/30 text-white rounded px-0.5">
        {part}
      </mark>
    ) : (
      <span key={i}>{part}</span>
    );
  });
};

const ATO_KEYWORDS = [
  'school',
  'college',
  'academy',
  'ato',
  'training',
  'institute',
  'university',
  'flight school',
  'aviation school',
  'aviation college',
  'pilot school',
  'flying school',
];

export const useSearchEngine = ({ query, filter, limit = 50 }: SearchEngineOptions) => {
  const trimmedQuery = query.trim().toLowerCase();
  const activeFilter = searchFilters.find((f) => f.id === filter) || searchFilters[0];

  return useMemo(() => {
    const results: SearchResult[] = [];
    if (!trimmedQuery) return { results: [], query: trimmedQuery };

    const allowedTypes = activeFilter.resultTypes;
    const includeType = (type: SearchResultType) =>
      activeFilter.id === 'all' || allowedTypes.includes(type);

    const pushUnique = (item: SearchResult) => {
      if (!results.some((r) => r.id === item.id && r.type === item.type)) {
        results.push(item);
      }
    };

    const buildScore = (texts: string[], base = 0) => {
      return texts.reduce((sum, text) => sum + scoreMatch(text, trimmedQuery), base);
    };

    if (includeType('aircraft')) {
      searchDataIndex.aircraft.forEach((aircraft) => {
        const manufacturer = searchDataIndex.manufacturers.find(
          (m) => m.id === aircraft.manufacturer_id
        );
        const score = buildScore([
          aircraft.model,
          aircraft.category,
          aircraft.subcategory || '',
          manufacturer?.name || '',
          aircraft.description || '',
        ]);
        if (score > 0) {
          pushUnique({
            id: aircraft.id,
            type: 'aircraft',
            title: aircraft.model,
            subtitle: `${manufacturer?.name || ''} · ${aircraft.category}`,
            image: aircraft.images?.[0] || aircraft.image || '/images/set-08-website/cessna.png',
            route: `/type-ratings?aircraft=${aircraft.id}`,
            score,
            badge: 'Aircraft',
          });
        }
      });
    }

    if (includeType('manufacturer')) {
      searchDataIndex.manufacturers.forEach((manufacturer) => {
        const score = buildScore([
          manufacturer.name,
          manufacturer.headquarters || '',
          manufacturer.description || '',
        ]);
        if (score > 0) {
          pushUnique({
            id: manufacturer.id,
            type: 'manufacturer',
            title: manufacturer.name,
            subtitle: manufacturer.headquarters || 'Aircraft manufacturer',
            image:
              manufacturer.heroImage || manufacturer.logo || '/images/set-08-website/cessna.png',
            route: `/type-ratings?manufacturer=${manufacturer.id}`,
            score: score + 10,
            badge: 'Manufacturer',
          });
        }
      });
    }

    if (includeType('airline')) {
      searchDataIndex.airlines.forEach((airline) => {
        const score = buildScore([airline.name, airline.location, airline.fleet || '']);
        if (score > 0) {
          pushUnique({
            id: airline.id,
            type: 'airline',
            title: airline.name,
            subtitle: airline.location,
            image: airline.image,
            route: `/airline-expectations?airline=${airline.id}`,
            score: score + 20,
            badge: 'Airline',
          });
        }
      });
    }

    if (includeType('ato')) {
      const atoKeywordHit = ATO_KEYWORDS.some((kw) => trimmedQuery.includes(kw));
      searchDataIndex.atos.forEach((school) => {
        const base = atoKeywordHit ? 30 : 0;
        const score = buildScore(
          [school.name, school.location, school.description, ...(school.offerings || [])],
          base
        );
        if (score > 0) {
          pushUnique({
            id: school.id,
            type: 'ato',
            title: school.name,
            subtitle: school.location,
            image: school.image || '/images/set-08-website/Program.png',
            route: '/pathway/ato-pathways',
            score,
            badge: 'ATO',
          });
        }
      });
    }

    if (includeType('program')) {
      searchDataIndex.programs.forEach((program) => {
        const score = buildScore([program.title, program.subtitle, ...program.keywords]);
        if (score > 0) {
          pushUnique({
            id: program.id,
            type: 'program',
            title: program.title,
            subtitle: program.subtitle,
            image: program.image,
            route: program.route,
            score,
            badge: 'Program',
          });
        }
      });
    }

    if (includeType('page')) {
      searchDataIndex.pages.forEach((page) => {
        const score = buildScore([page.title, page.description, ...page.keywords]);
        if (score > 0) {
          pushUnique({
            id: page.id,
            type: 'page',
            title: page.title,
            subtitle: page.description,
            route: page.route,
            score: score + 5,
            badge: 'Page',
          });
        }
      });
    }

    if (includeType('tab')) {
      searchDataIndex.tabs.forEach((tab) => {
        const score = buildScore([tab.label, tab.description, tab.id.replace(/-/g, ' ')]);
        if (score > 0) {
          pushUnique({
            id: `tab-${tab.id}`,
            type: 'tab',
            title: tab.label,
            subtitle: tab.description,
            route: tab.route,
            score: score + 5,
            badge: 'Tab',
          });
        }
      });
    }

    if (includeType('action')) {
      searchDataIndex.actions.forEach((action) => {
        const score = buildScore([action.title, action.subtitle, ...action.keywords]);
        if (score > 0) {
          pushUnique({
            id: action.id,
            type: 'action',
            title: action.title,
            subtitle: action.subtitle,
            route: action.route,
            score: score + 2,
            badge: 'Action',
          });
        }
      });
    }

    if (includeType('news')) {
      searchDataIndex.updates.forEach((update) => {
        const score = buildScore([update.title, update.subtitle, update.tag]);
        if (score > 0) {
          pushUnique({
            id: update.id,
            type: 'news',
            title: update.title,
            subtitle: update.subtitle,
            route: update.route,
            score,
            badge: 'Update',
            meta: { date: update.date, tag: update.tag },
          });
        }
      });
    }

    results.sort((a, b) => b.score - a.score);
    return { results: results.slice(0, limit), query: trimmedQuery };
  }, [trimmedQuery, activeFilter, limit]);
};

export const useGroupedResults = ({ query, filter, limit = 50 }: SearchEngineOptions) => {
  const { results } = useSearchEngine({ query, filter, limit });

  return useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    results.forEach((item) => {
      const key = item.type;
      if (!groups[key]) groups[key] = [];
      groups[key].push(item);
    });
    return groups;
  }, [results]);
};

export const groupLabels: Record<SearchResultType | string, string> = {
  aircraft: 'Aircraft Type Ratings',
  manufacturer: 'Manufacturers',
  airline: 'Airlines',
  ato: 'Approved Training Organizations',
  program: 'Training Programs',
  category: 'Categories',
  tab: 'Platform Tabs',
  page: 'Pathway Pages',
  action: 'Quick Actions',
  news: 'Updates & News',
};

export const groupOrder: SearchResultType[] = [
  'airline',
  'aircraft',
  'manufacturer',
  'ato',
  'program',
  'page',
  'tab',
  'action',
  'news',
];
