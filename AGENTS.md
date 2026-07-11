# AGENTS.md — Pilot Career Pathways

## Project commands

- `npm run dev` — start Vite dev server (falls back to next port if 3000 is busy)
- `npm run build` — production build (runs `prebuild` to generate framework HTML)
- `npm run lint` — ESLint across the whole repo (many pre-existing warnings/errors)
- `npm run test` — run Vitest test suite
- `npx vitest run <path>` — run a specific test file

## Search system

The global search UI lives in `components/career-pathways/search/` and is wired into the `/pathways` hub via `CareerPathwaysHomePage`.

### Files

- `SearchSystem.tsx` — top-level container with focus state, keyboard shortcut (Cmd/Ctrl+K), and click-outside handling
- `SearchBar.tsx` — input with clear button, Cmd+K hint, and Esc-to-clear
- `SearchSurface.tsx` — dropdown / mobile full-screen surface with sections, filters, quick jumps, recents, trending, updates, and grouped results
- `FilterPills.tsx` — animated filter chips (All, Aircraft, Airlines, ATOs, Programs, Pages, Updates)
- `QuickJumpCards.tsx` — category/action shortcut cards
- `useSearchEngine.tsx` — ranking and filtering logic; exports `scoreMatch` and `highlightMatch`
- `useRecentSearches.ts` — recent query persistence in `localStorage`
- `searchData.ts` — unified index: aircraft, manufacturers, airlines, ATOs, programs, pathway pages, platform tabs, actions, updates
- `searchIcons.tsx` — icon mapping for quick-jump and result cards
- `useSearchEngine.test.ts` — Vitest tests for search scoring and filtering

### Data sources queried

- Aircraft type ratings (`aircraftTypeRatings`)
- Manufacturers (`manufacturers`)
- Airlines (`airlines`)
- Approved training organizations (`DUMMY_FLIGHT_SCHOOLS`)
- Training programs
- Pathway pages (`/pathways`, `/discover`, `/type-ratings`, `/programs`, etc.)
- Unified platform tabs (`/platform?tab=...`)
- Quick actions (login, create account, etc.)
- Type-rating news and latest changes (`newsService`)

### Keyboard shortcuts

- `Cmd/Ctrl + K` — open/close the search surface
- `Enter` — submit the current query to `/type-ratings`
- `Esc` — close the surface or clear the query

### Adding the search system to another page

```tsx
import { SearchSystem } from '@/components/career-pathways/search';

// In the page JSX:
<SearchSystem className="max-w-4xl mx-auto" />;
```

The component is self-contained (state, keyboard shortcut, dropdown, and navigation) and works inside any page that uses `react-router-dom`.
