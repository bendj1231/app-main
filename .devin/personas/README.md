# Pilot Personas — User Pain Point Reference

This directory contains 100-question persona simulations for AI agents working on the PilotRecognition platform. Each file represents a real user archetype with real day-to-day problems.

## Purpose

Use these personas to:
- Guide product feature decisions
- Identify gaps in the app's coverage
- Write content that addresses real pain points
- Prioritize development based on user needs
- Test UX against actual user scenarios

## Persona Index

### Training Stage Pilots
| File | Persona | Hours | Situation |
|------|---------|-------|-----------|
| `01-student-pilot-general.md` | General student pilot | 0-50 | Day-to-day training problems |
| `02-ppl-student.md` | PPL student | 0-40 | Pre-solo to checkride |
| `03-cpl-student.md` | CPL student | 40-250 | Commercial training grind |
| `04-cfi-candidate.md` | CFI candidate | 250+ | Learning to teach, CFI checkride |
| `05-atpl-student.md` | ATPL student | 250+ | 14 exams, frozen ATPL, MCC/JOC |

### Career Gap & Struggle Pilots
| File | Persona | Hours | Situation |
|------|---------|-------|-----------|
| `06-200hr-no-experience.md` | 200hr CPL, no job | 200 | 1,500hr wall, no experience |
| `07-200hr-no-degree.md` | 200hr CPL, no degree | 200 | Double wall: hours + degree |
| `08-career-shifter-kiev.md` | Kiev — left at 150hrs | 150 | Saw dead end, went to construction |
| `09-daniel-doyle.md` | Daniel — 700hrs, ATR typed, AMT | 700 | $200K deep, gave up aviation |
| `10-5yr-cfi-stuck.md` | 5-year CFI, type-rated, stuck | 2000-5000 | Too many hours, no airline call |

### Airline & Mid-Career Pilots
| File | Persona | Hours | Situation |
|------|---------|-------|-----------|
| `11-crisostomo-12yr-captain.md` | 12yr A320 captain, bored | 12000 | Seniority trap, wants change |
| `12-captain-neeraj-15yr-cfi.md` | 15yr CFI, sim pilot, wants corporate | 4000 | Public lie, private dream |
| `13-cadet-who-got-in.md` | 250hr cadet, now FO | 300 | "Dream" = food stamps + crash pad |
| `14-first-year-regional-fo.md` | Year 1 regional FO | 800 | $31K, fatigue, CRJ-200 |
| `15-expat-middle-east.md` | Expat A350 pilot, Gulf | 4000+ | Golden handcuffs, loneliness |
| `16-cargo-feeder-pilot.md` | Caravan night cargo | 2500 | 3AM single-pilot IFR, $45K |
| `17-retiring-captain.md` | 64yr captain, 11 months left | 28000 | No pension, no plan, identity crisis |

### Industry & Support Roles
| File | Persona | Hours | Situation |
|------|---------|-------|-----------|
| `18-aom-pilot-wannabe.md` | Airline ops manager → pilot | 0 | Has money, same trap waiting |
| `19-15yr-waiting-pilot.md` | 15yr since graduation, cafe worker | 250 | Longest wait, deepest rot |
| `20-2yr-waiting-pilot.md` | 2yr waiting for CFI job | 250 | Bedroom, weather app, email refresh |
| `21-blindly-optimistic-student.md` | Trusts the system fully | 0-100 | No skepticism, pure faith |
| `22-karl-cofounder.md` | Karl — aviation degree, no hours | 0 | Machine operator, wants cofounder |

### App/Founder Perspective
| File | Persona | Context |
|------|---------|---------|
| `23-founder-consultancy.md` | Building the app from scars | Every persona is a wound |

## How to Use

1. **Feature planning**: Read the relevant persona(s) before designing a feature
2. **Content writing**: Use the questions as FAQ or content prompts
3. **Gap analysis**: If a persona's questions can't be answered by the app, that's a gap
4. **UX testing**: Walk through the app as each persona and note friction points
5. **Prioritization**: Personas with the most unaddressed pain points = highest priority

## Key Themes Across All Personas

- The 1,500-hour wall is the #1 barrier
- Degree requirements create a second wall
- Self-funded type ratings are a trap
- CFI is the default path but it's underpaid and undervalued
- Seniority systems trap pilots in place
- Aviation training costs vs. career earnings = negative ROI for many
- Mental health and isolation are unaddressed industry-wide
- The "pilot shortage" narrative is misleading at entry level
- Recognition and identity are tied to flying status
- The app needs pathways OUT of aviation, not just INTO it

## Solution Catalogs

Each persona has a corresponding solution catalog in `.devin/catalogs/` that maps the persona's 100 questions to proposed platform features, content, pricing, and build priorities. See `.devin/catalogs/README.md` for the full catalog index and cross-catalog build priority.
