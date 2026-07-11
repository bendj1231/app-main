# Pathways System Memory — For Other Agents

## What We Built

A complete **career alignment platform** for helicopter pilots in `lib/pathways/helicopterOperators/`. 6,179 lines across 11 files. Zero TypeScript errors.

## The Product Thesis (Read This First)

This is NOT a job board. NOT a recruiting platform. It is a **pilot value platform**:

> "Can I get the job?" is the wrong question.
> "Do I have value in myself?" is the right question.
> We find the value in you so that you can be prepared for any job.

The platform:
1. Assesses pilot value (6 dimensions, independent of any job)
2. Recontextualizes every operator for the pilot's specific archetype
3. Analyzes gaps between pilot and operator requirements
4. Tracks market intelligence (who's hiring, who's trending)
5. Aligns pilot to specific job listings (scraped from pilotcareercenter.com)
6. Redirects to the original job board to apply

We aggregate jobs, parse requirements, align against the pilot's verified profile, and redirect. We do NOT host applications.

## Architecture (6 Layers)

```
Layer 1: PILOT VALUE       — pilotValue.ts (1,170 lines)
  assessPilotValue() → 6 dimensions, 14 archetypes, market value, gaps, narrative

Layer 2: PERSONA CONTEXT   — personaContext.ts (531 lines)
  generatePersonaContext() → recontextualizes operator for each archetype

Layer 3: GAP ANALYSIS      — gapAnalysis.ts (530 lines)
  analyzeGap() → requirement-by-requirement comparison with time/cost

Layer 4: MARKET INTEL      — marketIntelligence.ts (355 lines)
  submitInterest() → pilot watchlist, demand signals, trending, screener

Layer 5: JOB ALIGNMENT     — jobAlignment.ts + jobAggregator.ts (836 lines)
  alignJob() → "should I apply?" engine, blind spots, redirect to apply

Layer 6: REDIRECT          — pilot goes to pilotcareercenter.com to apply
```

## File Map

```
lib/pathways/helicopterOperators/
├── types.ts                          (432)  All operator types
├── operatorEnrichment.ts            (1297)  MCP data for 5 operators
├── pilotValue.ts                    (1170)  6-dimension value assessment
├── personaContext.ts                 (531)  Per-archetype operator context
├── gapAnalysis.ts                    (530)  Pilot vs operator requirements
├── jobAlignment.ts                   (579)  "Should I apply?" engine
├── jobAlignmentTypes.ts              (247)  Job listing + alignment types
├── jobAggregator.ts                  (357)  Adapt existing jobs, useJobAlignment hook
├── marketIntelligence.ts             (355)  Market open/close, demand signals
├── useHelicopterOperators.ts         (492)  Main hook (wires everything)
├── HelicopterOperatorsContext.tsx     (80)  React context provider
└── index.ts                          (109)  Barrel exports
```

## The 5 Enriched Operators

1. Royal Flying Doctor Service (Australia) — air ambulance, EC145
2. Pawan Hans Limited (India) — 47+ aircraft, 7-tier career structure
3. CITIC Offshore Helicopter (China) — 80+ aircraft, largest in Asia
4. MHS Aviation Berhad (Malaysia) — 70% market share, offshore O&G
5. The Helicopter Line (New Zealand) — scenic/glacier operations

132 more operators in manifest are NOT yet enriched.

## The 14 Pilot Archetypes

student_pre_cpl, fresh_cpl_no_experience, cfi_instructor_track, atpl_aspirant,
regional_fo, cargo_charter_specialist, airline_captain, expat_international,
retiring_senior, lapsed_returning, career_shifter, industry_professional,
founder_builder, unknown

## Existing Job Data

- 168 jobs scraped from pilotcareercenter.com in `portal/pages/PilotJobDatabasePage.tsx`
- `adaptRawJobs()` converts them to structured `JobListing[]`
- `useJobAlignment()` hook runs client-side alignment (replaces Firebase `pathways_getJobMatches`)
- `JobListingsPage.tsx` already has blind spot picks UI

## Related Existing Systems (pre-date this work)

- `lib/utils/careerScoreCalculator.ts` — aircraft-centric scoring
- `lib/ai-career-coaching.ts` — AI career coaching
- `lib/social-proof-matching.ts` — peer validation
- `lib/predictive-career-pathing.ts` — career trajectory prediction
- `lib/pathways/pathwayMatchingEngine.ts` — airline pathway matching

These are all job-downstream. The new system puts pilot value upstream.

## What's NOT Built Yet

1. **UI pages** — no UI exists for this system yet
2. **More operator enrichment** — 132 of 137 operators need MCP research
3. **Backend job scraper** — Cloud Functions for periodic pilotcareercenter scraping
4. **Pilot profile enrichment** — auto-verify hours/ratings from logbook
5. **Progress tracking** — recompute gaps when profile changes
6. **Training referrals** — recommend ATOs for gap closure (revenue)

## Key Decisions

- Not a job board — we align and redirect, don't host applications
- Not a recruiter — we build pilot value, not placements
- Pilot value first — assessment before job matching
- Persona context — same operator, different meaning per archetype
- Client-side alignment — replaces Firebase function
- localStorage for interest tracking — would sync to backend in production
- MCP for enrichment — google-ai-mode, wikipedia-mcp, wikimedia-image-search

## How to Use

```typescript
import { useHelicopterOperatorsContext } from '@/lib/pathways/helicopterOperators';

// Or directly:
import { useHelicopterOperators, assessPilotValue, generatePersonalContext } from '@/lib/pathways/helicopterOperators';

const {
  pathways,           // all operators with enrichment + gaps + personaContext
  pilotValue,         // 6-dimension assessment
  pilotArchetype,     // auto-detected archetype
  marketOverview,     // index-level stats
  openOperators,      // hiring now
  eligibleOperators,  // pilot meets minimums
  trending,           // top by pilot interest
} = useHelicopterOperators(pilotProfile);
```

## Full Documentation

Complete architecture, philosophy, and API details are in `AGENTS.md` under "Helicopter Operator Pathways System".
