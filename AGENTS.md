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

## Pilot Personas (User Pain Point Reference)

Comprehensive persona simulations live in `.devin/personas/`. Each file contains 100 questions from a specific pilot archetype's perspective, covering day-to-day problems and career challenges.

**Use these when:**
- Planning product features — read the relevant persona(s) before designing
- Writing content — use questions as FAQ or content prompts
- Identifying gaps — if a persona's questions can't be answered by the app, that's a gap
- UX testing — walk through the app as each persona and note friction

**Key personas include:** student pilots, CPL students, CFI candidates, ATPL students, 200hr no-experience/no-degree pilots, career shifters, Daniel Doyle (founder), 5-year stuck CFIs, 12-year bored captains, 15-year sim instructors, cadets who got in, first-year regional FOs, expat Middle East pilots, cargo feeder pilots, retiring captains, AOM pilot-wannabes, 15-year waiting pilots, 2-year waiting pilots, blindly optimistic students, Karl (co-founder), and the founder's consultancy perspective.

Start with `.devin/personas/README.md` for the full index and usage guide.

## Solution Catalogs (Feature & Revenue Roadmap)

Solution catalogs mapping persona pain points to proposed features, content, pricing, and build priorities live in `.devin/catalogs/`. Each catalog takes a persona's 100 questions and maps them to solutions with category (Product/Service/Community/Platform), price (Free/Pack/Recognition+), and status (Existing/Gap).

**Use these when:**
- Planning features — each catalog's "Highest-Priority Builds" section tells you what to build first
- Writing content — the questions serve as FAQ and content prompts
- Identifying gaps — solutions marked "Gap — propose" are features the app doesn't have yet
- Pricing products — each catalog includes a 3-tier pricing structure
- Prioritizing development — catalogs with the most "Gap — propose" entries = highest priority

**22 catalogs cover the complete pilot career arc:** Daniel Doyle (700hrs, walked away), founder strategy, stuck CFIs, career shifters, AOM pilot-wannabes, student pilots (general/PPL/CPL/CFI/ATPL), 200hr no-experience/no-degree, Crisostomo (12yr captain), Captain Neeraj (15yr CFI), blindly optimistic students, 2yr/15yr waiting pilots, internship trust infrastructure, cadets who got in, first-year regional FOs, expat Middle East pilots, cargo feeder pilots, and retiring captains.

Start with `.devin/catalogs/README.md` for the full index, cross-catalog themes, and build priority across all personas.

## Helicopter Operator Pathways System

**Location:** `lib/pathways/helicopterOperators/` (6,179 lines, 11 files)

**Asset source:** `public/images/Pathways/Helicopter Operators/APAC/` — contains 137 operator logos, `manifest.json`, `apac-region.json`, `country-info.json`. The manifest is the source of truth for operator names, countries, categories, and file paths.

### Product Philosophy

This is NOT a job board. NOT a recruiting platform. It is a **career alignment platform** built on a **pilot value** thesis:

> "Can I get the job?" is the wrong question.
> "Do I have value in myself?" is the right question.
> We find the value in you so that you can be prepared for any job.

The platform tells pilots whether they're a fit before they apply, then redirects to the original job posting on external boards (pilotcareercenter.com, betterjobs, airline career pages). We aggregate jobs, parse requirements, align against the pilot's verified profile, and redirect — we do not host applications.

### Architecture (6 layers, bottom to top)

```
Layer 1: PILOT VALUE ASSESSMENT
  "What are you worth, right now, independent of any job?"
  → 6 dimensions: verified, market, career, transferable, gap, recognition
  → 14 pilot archetypes auto-detected from profile
  → Market value estimates (current / projected / peak salary)
  → Value gaps with cost-to-close and value-increase estimates
  → Transferable skills across categories
  → Value narrative (written articulation)

Layer 2: PERSONA CONTEXT
  "What does this operator mean for someone like you?"
  → Every operator recontextualized for every pilot archetype
  → Relevance: aspirational / bridge / destination / lateral / exit / recovery
  → Hook, meaning, action items, warnings, distance, perspective per archetype
  → A student sees aspiration, a lapsed pilot sees recovery, a captain sees lateral

Layer 3: GAP ANALYSIS
  "What's between you and this operator?"
  → Requirement-by-requirement comparison
  → Per-gap severity (critical/major/minor/advisory/met)
  → Time and cost estimates to close each gap
  → Eligible / near-eligible / not-eligible classification
  → Similar operators as alternatives

Layer 4: MARKET INTELLIGENCE
  "Is this operator hiring? Are other pilots interested?"
  → Market status: open / accepting / paused / closed / coming_soon
  → Pilot interest tracking (submit/withdraw) — the "watchlist" action
  → Demand signals with trend (rising/stable/declining)
  → Market overview (index-level stats)
  → Trending operators, hot categories, hot countries
  → Screener (filter by status, category, country, match, eligible, interested)

Layer 5: JOB ALIGNMENT
  "Should you apply for this specific job?"
  → Adapts existing 168 jobs scraped from pilotcareercenter.com
  → Alignment score (0-100) — weighted blend of requirements + experience
  → Blind spot detection (jobs you wouldn't search for but are a good fit)
  → Recommendation: apply_now / apply_with_caveats / close_gaps_first / not_eligible
  → Redirect to original posting (we don't host applications)

Layer 6: REDIRECT
  "Apply on the original job board"
  → Pilot goes to pilotcareercenter.com/redirect/job/... to submit application
```

### File Map

| File | Lines | Purpose |
|---|---|---|
| `types.ts` | 432 | All operator types: manifest, pathway, profile, enrichment, market, gap, requirements, training, lifestyle, progression, quality. Imports `JobAlignmentResult` and `PersonaOperatorContext` |
| `operatorEnrichment.ts` | 1,297 | MCP-sourced data for 5 operators (RFDS, Pawan Hans, CITIC Offshore, MHS Aviation, The Helicopter Line) with full hiring/requirements/training/lifestyle/progression/quality + `aiHiringSummary` |
| `pilotValue.ts` | 1,170 | 6-dimension value assessment. `assessPilotValue()` is the core function. Detects 14 archetypes, scores each dimension, estimates market value, identifies value gaps, generates value narrative |
| `personaContext.ts` | 531 | Recontextualizes every operator for every archetype. `generatePersonaContext()` produces hook, meaning, action items, warnings, distance, perspective. `generateAllPersonaContexts()` for all archetypes at once |
| `gapAnalysis.ts` | 530 | `analyzeGap()` compares pilot profile vs operator requirements. `batchAnalyzeGaps()` for all operators. Produces per-gap severity, time/cost estimates, eligible/near-eligible status, similar operators |
| `jobAlignment.ts` | 579 | `alignJob()` — the "should I apply?" engine. Checks hours, license, type rating, medical, English. Produces alignment score, gap analysis, blind spot detection, recommendation, next steps |
| `jobAlignmentTypes.ts` | 247 | `JobListing`, `JobRequirements`, `JobAlignmentResult`, `PilotJobProfile`, `JobFeed`, `JobFeedFilter`, `JobFeedStats` |
| `jobAggregator.ts` | 357 | `adaptRawJobs()` converts existing 168 jobs from `PilotJobDatabasePage.tsx` into structured `JobListing[]`. `useJobAlignment()` hook. Stub fetchers for pilotcareercenter/betterjobs/airline direct |
| `marketIntelligence.ts` | 355 | `submitInterest()`/`withdrawInterest()` (localStorage-persisted). `computeMarketSignal()`, `computeMarketOverview()`, `screenOperators()`, `findSimilarOperators()` |
| `useHelicopterOperators.ts` | 492 | Main hook. Fetches manifest, builds pathways, attaches enrichment + gap analysis + market signals + persona context + pilot value. Returns everything the UI needs |
| `HelicopterOperatorsContext.tsx` | 80 | React context provider exposing the full system |
| `index.ts` | 109 | Barrel export for all types, functions, hooks, and components |

### The 5 Enriched Operators (MCP-sourced)

Each has full hiring/requirements/training/lifestyle/progression/quality data:

1. **Royal Flying Doctor Service** (Australia) — air_ambulance, EC145/H145 + PC-12/PC-24, Jandakot base, 1,500-2,500h minimums, RAMP cadet program
2. **Pawan Hans Limited** (India) — helicopter, 47+ aircraft, 7-tier career structure (Fresh Pilot 150h → Captain C 5,000h), 10-year bond, IAF MoU
3. **CITIC Offshore Helicopter** (China) — helicopter, 80+ aircraft (largest in Asia), S-92/AW139, 28/28 rotation, IOGP 690 compliant
4. **MHS Aviation Berhad** (Malaysia) — helicopter, 70% market share Malaysian offshore, H175/AS332, 28/28 FIFO, international deployments
5. **The Helicopter Line** (New Zealand) — helicopter, scenic/glacier operations, AS350/H130, seasonal (Oct-April), 500h minimum

132 more operators in the manifest are not yet enriched — they show up with basic data only.

### The 14 Pilot Archetypes

Auto-detected from profile (hours, licenses, role, age, currency):

| Archetype | Hours | Description |
|---|---|---|
| `student_pre_cpl` | 0-250 | In training, building toward first qualification |
| `fresh_cpl_no_experience` | 200-250 | Qualified on paper, no operational experience |
| `cfi_instructor_track` | 250-5000 | Building hours through instruction |
| `atpl_aspirant` | 250+ | Working toward ATPL exams |
| `regional_fo` | 800-2000 | First airline job, low pay, reserve |
| `cargo_charter_specialist` | 2500+ | Niche experience, may not transfer |
| `airline_captain` | 4000+ | High value, seniority constrained |
| `expat_international` | 4000+ | Premium salary, lifestyle costs |
| `retiring_senior` | 20000+ | Maximum experience, time-limited |
| `lapsed_returning` | varies | Was qualified, lapsed, wants to return |
| `career_shifter` | 0-150 | Transitioning from another career |
| `industry_professional` | varies | Works in aviation, not a pilot |
| `founder_builder` | varies | Building in aviation |
| `unknown` | — | Insufficient profile data |

### How Persona Context Works

Every operator is recontextualized for every archetype. Same operator, different meaning:

- **Student (0h) sees RFDS:** "Aspirational target — here's what you're working toward"
- **Fresh CPL (200h) sees MHS Aviation:** "Longer-term target — you need to build hours first"
- **CFI track (800h) sees MHS Aviation:** "Realistic target — you are within striking distance"
- **Airline captain (12,000h) sees MHS Aviation:** "Lateral move — rotary could be a fresh start or a step back"
- **Lapsed returning sees RFDS:** "Recovery target — if you restore your qualifications"
- **Retiring senior sees RFDS:** "Post-retirement role — training, consulting, or part-time"

### Existing Job Data Integration

The codebase already has 168 jobs scraped from pilotcareercenter.com in `portal/pages/PilotJobDatabasePage.tsx` (10,416 lines). These have:
- Job title, company, aircraft, location, role
- Requirements (flightTime, picTime, typeRating, license, medicalClass, icaoElpLevel)
- Redirect URLs back to pilotcareercenter.com
- A Firebase function `pathways_getJobMatches` doing server-side matching

Our `jobAggregator.ts` provides `adaptRawJobs()` to convert these into structured `JobListing[]` objects, and `useJobAlignment()` to run client-side alignment (replacing the Firebase call). The existing `JobListingsPage.tsx` already has "blind spot picks" — our system enriches this with structured reasoning.

### Related Existing Systems (in `lib/`)

These pre-date the helicopter operator system but are related:

- `lib/utils/careerScoreCalculator.ts` — scores aircraft type ratings against pilot profile (aircraft-centric, not pilot-centric)
- `lib/ai-career-coaching.ts` — AI-powered career coaching with skill gap analysis, certification roadmap, interview prep, salary guidance
- `lib/social-proof-matching.ts` — "pilots like you chose this pathway" peer validation
- `lib/predictive-career-pathing.ts` — AI predicts career trajectory with salary projections
- `lib/pathways/pathwayMatchingEngine.ts` — uses `recognition_score` as core matching input (airline pathways, not helicopter)
- `lib/pathway-matching-engine.ts` — older version of the matching engine

The helicopter operator system is the first to put **pilot value** (not job matching) at the top of the stack. The existing systems are all downstream of the job — they ask "can you get this job?" The new system asks "what is your value?" first.

### What the Hook Returns

```typescript
const {
  // --- Pathways (all 137 operators) ---
  pathways,           // with enrichment + gaps + signals + personaContext attached
  recommended,        // curated recommended set
  featured,           // featured countries
  enriched,           // only operators with MCP enrichment (5 so far)
  byCategory,         // grouped by category
  byCountry,          // grouped by country

  // --- Market intelligence ---
  marketOverview,     // index-level stats
  openOperators,      // market is "open" or "accepting"
  trending,           // top 10 by pilot interest

  // --- Gap analysis ---
  gapAnalyses,        // all gap analyses sorted by match
  eligibleOperators,  // pilot meets all minimums
  nearEligibleOperators, // close to meeting minimums

  // --- Pilot value (independent of any job) ---
  pilotValue,         // full 6-dimension assessment or null
  pilotArchetype,     // auto-detected archetype

  // --- Status ---
  loading,
  total,
} = useHelicopterOperators(pilotProfile);
```

### What's Next (Build Priorities)

1. **UI pages** — no UI has been built yet for this system. Need: pilot value dashboard, operator detail page with persona context, job alignment feed, market intelligence view
2. **Enrich more operators** — 132 of 137 operators have no MCP enrichment data. Each needs Wikipedia + Google AI Mode + hiring data research
3. **Backend job scraper** — Cloud Functions to periodically scrape pilotcareercenter.com and betterjobs.com, cache in Firestore/KV
4. **Pilot profile enrichment** — pull logbook data, verify hours/ratings, compute career stage automatically
5. **Progress tracking** — when a pilot logs new hours/ratings, recompute all gap analyses and notify of newly-eligible operators
6. **Training referrals** — when gap analysis says "you need an IFR rating," recommend specific ATOs (revenue opportunity)
7. **Operator profiles** — let operators maintain their own enrichment data (hiring status, requirements, fleet, lifestyle)

### Key Decisions Made

- **Not a job board** — we aggregate and align, we don't host applications. Pilots redirect to original postings.
- **Not a recruiter** — we don't place pilots or charge per placement. We build pilot value.
- **Pilot value first** — the assessment comes before job matching. Value exists independent of any job.
- **Persona context** — every operator is recontextualized for every archetype. Same data, different meaning.
- **Client-side alignment** — the job alignment engine runs client-side, replacing the Firebase `pathways_getJobMatches` function.
- **localStorage for interest tracking** — pilot interest (watchlist) is stored locally. In production, this would sync to a backend.
- **MCP for enrichment** — operator data was enriched using MCP tools (google-ai-mode, wikipedia-mcp, wikimedia-image-search). 5 operators done, 132 remaining.
