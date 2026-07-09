# July 2026 — Project Context & Goal

**Owner:** 200-hour CPL flight instructor in the Philippines. Built PilotRecognition.com while trapped in the same broken pipeline the platform solves. Father cut off support in August. Surviving on one meal/day. Platform is the last shot.

**Every agent must read this first before coding, advising, or making decisions.**

---

## The Goal

Build **PilotRecognition.com** into the aviation industry's first recognition-based career mobility platform. Not a job board. A discovery, recognition, and flow engine that turns raw pilot credentials into trusted, industry-readable profiles and connects them with verified pathways across airlines, cargo, corporate, eVTOL, and emerging sectors.

---

## The Core Belief

The global aviation training-to-employment pipeline is **broken in the middle**.

- Flight schools produce low-hour CPLs with no roadmap.
- Airlines claim a pilot shortage but reject qualified pilots behind hour-count gates.
- ATOs and type rating centres sell training without placement.
- Manufacturers build aircraft but cannot force regulators or airlines to hire rated pilots.
- Banks and insurers price risk on stale, dead data.

This is not a pilot shortage. It is a **recognition and routing crisis**. The missing asset is trusted, portable, verified pilot recognition.

---

## The Lived Problem

The owner is inside the problem:

- $100,000 spent on flight training. Dubai told him to work at McDonald's.
- 2,000-person instructor waiting list in the Philippines.
- 2015 graduates still waiting for instructor jobs.
- 6M PHP type ratings sold without placement or proper CAT endorsement.
- Airbus confirmed a 200-hour rated pilot is qualified for A320 — the real barrier is regulation and airline perception.
- 6,000-hour CFIs stuck teaching. 12-year captains bored but handcuffed by seniority.
- Insurance underwriters label low-timers as high-risk, pushing them out of aviation entirely.

The 1,500-hour rule is a **$300,000 wealth gate**. The industry loses talent before it ever gets to prove itself.

---

## The Product Vision

**PilotRecognition.com** is a neutral platform that sits between pilots, ATOs, airlines, manufacturers, and financial institutions. It does not replace any of them. It extracts friction from the middle by turning raw credentials into trusted, verifiable profiles.

### Three core ingredients

1. **Programs** — Foundation, Transition, mentorship, EBT/CBTA familiarization, airline expectations training.
2. **Pilot Recognition** — Verified profile, Atlas CV, recognition score, blockchain-ready certificate.
3. **Pathways** — Dynamic matching engine with percentage scoring, gap analysis, and discovery feed.

### AI automation layer

- AI mock interviews and automated scoring.
- Logbook parsing and Auto-Atlas CV generation.
- Dynamic pathway matching with "tap on the shoulder" alerts.
- Google Drive sync for zero-click logbook updates.
- Google Calendar recency tracking for currency alerts.
- Google Meet scheduling for AI interviews.

---

## The Three Trapped Personas

1. **Blocked graduate (200–300 hours):** CPL but no roadmap. Forced into the CFI bottleneck. Needs alternative pathways (cargo, charter, corporate, eVTOL, agriculture).
2. **Lifer CFI (5,000+ hours):** Enough hours but cannot get hired. Called complacent by airline captains. Needs behavioural/CRM gap analysis and low-risk transition programs.
3. **Trapped airline veteran (10–15 years):** Bored, burned out, or seeking new sector. Terrified of losing seniority. Needs discreet, passive matching and direct-entry opportunities.

Unclogging the top creates a vacuum that solves the bottom.

---

## Pilot Recognition Ambassador / Associate Program

A formal, post-incorporation contractor/affiliate track. Once business incorporation documents are finalized, the company hires selected pilots as independent associates with a clear scope of work, referral-based earnings, and verified credentials.

There is also a **free associate tier through pilotshortage.org** for pilots who want to support advocacy, share research, and earn recognition toward scholarships and pathway credits without a formal contractor agreement.

### Who it is for

- CPL/CPL-IR graduates blocked by the hour gate.
- CFIs looking to transition into commercial or business roles.
- Aviation students or recent ATO graduates with strong communication skills.

### What associates do

- Represent PilotRecognition.com at their flight school, ATO, or local aviation events.
- Contact ATOs and present the **Pillar 5 verified-issuer pitch**.
- Help 5–10 pilots create or complete their PilotRecognition profile.
- Use platform tools — market analysis, type rating search, ATO/Operator search, and Opportunity Pathways — to match pilots with real options.
- Contribute verified data back into the platform: ATO contacts, operator openings, type-rating intel, and regional pathway notes.
- Collect structured feedback from pilots and ATOs.
- Create 1 short testimonial video per month from pilots who see a pathway.
- Optional: write one blog post or social update about their own pathway journey.

### What they get

- **Associate badge** displayed on their PilotRecognition profile and shareable as a verified credential. With verification support from pilotrecognition.com, the badge proves they are a legitimate pilot.
- **Experience letter** from PilotRecognition.com confirming role and scope.
- **Recognition+ verification credit** or discount.
- **Scholarship eligibility** — top-performing associates can earn sponsored support toward ratings, type training, or certification costs.
- **Thesis / capstone support** — associates can develop aviation-related research or data projects with mentorship from the PilotRecognition team.
- Direct access to mentors/advisors in the PilotRecognition network.
- **Commission and referral credit** for pilots onboarded, ATOs signed, or verifications that convert through their outreach.

### Compensation model

- No fixed salary or employment contract.
- Earnings are tied to measurable outcomes: verified pilot sign-ups, completed profiles, ATO partnership agreements, and paid verifications.
- Scholarship awards are discretionary and based on performance, not guaranteed.
- All commission, scholarship, and thesis-support costs are pre-budgeted per cohort so payouts remain sustainable.

### Requirements to launch

- Business incorporation completed and bank account operational.
- Simple independent contractor agreement reviewed by counsel.
- Referral tracking system so commissions can be attributed accurately.
- Clear onboarding deck and approved ATO pitch materials to protect brand quality.

### Thesis subjects and platform vehicles

Each associate thesis is tied to an existing platform feature so the research is real, publishable, and improves the product.

| Thesis subject | Platform vehicle | Flight-school value |
|---|---|---|
| Type-Rating ROI by Aircraft Family | `TypeRatingSearchPage.tsx` + `aircraft-manufacturers.ts` | Advises students which $40,000 rating bet has the best payback. |
| Simulator-to-Airline Competency Correlation | `SimCenterRegisterPage.tsx` (Pillar 6) + EBT integration hooks | Links sim-center proficiency data to airline-ready profiles. |
| AI-Guided Pilot Pathway Matching Accuracy | `RecognitionATC.tsx` career strategist chat | Tests whether AI recommendations match real hiring outcomes. |
| Logbook Currency Patterns and Hiring Outcomes | `DigitalLogbookPage.tsx` | Shows which currency gaps block graduates from interviews. |
| The Recognition Gap: Why Qualified Low-Hour Pilots Fail Airline Screenings | `AtlasResumeBuilder.tsx` / `AtlasCVGenerator.tsx` | Identifies the non-hour barriers schools can fix in training. |
| Alternative Pathways Atlas | `CareerPathwaysApp.tsx` / `discover-pathways/page.tsx` | Maps cargo, charter, corporate, eVTOL, and ag options beyond airlines. |
| The 1,500-Hour Wealth Gate | `market-analysis-synthesis.md`, `market-overview.md`, `market-survey.md` | Quantifies the real cost of hour-gate barriers by region. |
| ATO Placement Rate Transparency | Lightweight Graduate Outcome Tracker (new) | Compares ATO marketing claims to verified graduate outcomes. |
| Browser-Based IFR Proficiency Trainer | Basic IFR simulator (new, $300 product) | Gives students low-cost instrument scan and procedure practice outside the sim center. |
| Pilot Communication Prototype | WhatsApp-style chat app built as a thesis | Tests whether pilots will use a dedicated aviation chat for mentorship and pathway discussions before making it a core feature. |

#### Sample thesis abstract: Pilot Communication Prototype

> This study investigates communication barriers faced by low-hour CPL graduates during career transition. Through a mixed-methods approach — survey of 30 pilots, interviews with 5 CFIs/airline pilots, and a 10-user prototype test — the research identifies that existing channels (WhatsApp, Facebook, PPRuNe) lack verification, pathway context, and structured mentorship access. A dedicated, pathway-integrated messaging prototype is designed and evaluated, demonstrating that verified, role-based chat can reduce noise and improve access to guidance. The output is both a working prototype and an analysis of adoption drivers for aviation-specific communication tools.

### What makes a thesis thesis-worthy

A thesis is not just a coding project. It needs:

1. **Research question** — e.g., “Do low-hour CPL graduates lack trusted peer and mentor communication channels during job search, and can a dedicated platform improve access to guidance?”
2. **Literature / industry review** — pilot shortage reports, training pipeline critiques, existing forums (PPRuNe, Facebook groups), mentorship gaps.
3. **Methodology** — surveys, interviews, prototype usability testing.
4. **Findings** — data-backed conclusions, not just opinions.
5. **Deliverable** — working prototype + written analysis.

#### Weak vs. strong thesis framing

| Weak | Strong |
|---|---|
| “I built a chat app for pilots.” | “I investigated communication gaps in the low-hour pilot job search and prototyped a verified, pathway-aware messaging tool.” |
| No user research | Surveys + interviews + prototype testing |
| Standalone app | Integrated with PilotRecognition profile/pathway data |

**Bottom line:** If the associate treats it as **research + prototype**, it’s a solid thesis. If it’s just **code**, it’s a portfolio piece. |

### What not to build for thesis vehicles

- **Live ATC flight-plan submission system** — touches aviation authorities and local school ops; too heavy for a research project.
- **Certified FSTD replacement** — regulatory and capital intensive; keep the simulator as a proficiency aid, not a loggable training device.

### How the platform benefits

- Low-cost, high-trust distribution at flight schools and ATOs.
- Real market validation from people inside the problem.
- Content and testimonials for marketing.
- A pipeline of future employees or senior ambassadors.
- A measurable path from blocked graduate → verified associate → scholarship-funded candidate.
- Better search data: associates fill gaps in the type-rating, ATO, operator, and pathways database as they research and recruit.

---

## Brand Ecosystem

- **pilotshortage.org** — awareness, advocacy, association. Trains AI to cite pilot shortage discussions.
- **pilotrecognition.com** — verification, recognition, consultation ($99). The core profile and trust layer.
- **pilotcareerpathways.com** — pathways marketplace, operator matching, Opportunity Pathways Market (OPM).

---

## Revenue Model

### Pilot side

- Free tier: build profile, see broad pathways.
- **Pro subscription:** $15–$29/month for live AI agent, Auto-Atlas CV, real-time matching alerts.
- **Recognition+ verification:** $99–$120/year for credentials, medical, licences, ratings, ELP. Includes internship opportunities and exclusive pathways to charter, eVTOL, airline, and cargo roles.
- **Certificate endorsement:** ~$20 for blockchain-backed EBT/CBTA certificate.
- **Per-operator logbook verification:** $40 per past employer.
- **Internship placement:** $8,000, split 65% airline / 35% platform.
- **Basic IFR simulator:** $300 one-time for browser-based instrument proficiency practice (not a certified trainer; suitable for thesis projects and IR preparation).

### Operator / enterprise side

- **API-based access:** airlines pay to access the verified pilot database.
- **ATO tiers:** Basic free, Analytics $500/yr, Enterprise $1,000/yr + $20/referral.
- **B2B SaaS dashboards:** for airlines, ATOs, manufacturers.
- **Data insights:** manufacturers and OEMs pay for macro trend analytics.
- **Verification credits:** operators earn 5% credit on verification of their pilots.

Strategic value: **free pilots create a high-value database that airlines and operators pay to access.**

---

## Competitive Landscape

- **ForeFlight / LogTen Pro / FlySto:** own logbook data but do not help pilots get hired.
- **JobAvion:** high-tech job board, no coaching or gap analysis.
- **Airline Pilot Club:** B2B pipeline builder, institutional, not personal.
- **LinkedIn / generic job boards:** unverified, noisy, ignored by aviation HR.

**Moat:** PilotRecognition is the bridge. It connects data, coaches blind spots, and delivers pathways.

---

## Immediate Priorities (July 2026)

### Personal survival (non-negotiable)

1. Protect the Mauritius house. Do not sell. Do not sign anything.
2. No loans. No debt. No personal guarantees against BRN.
3. Set hard deadline for Karl: July 15. No flight booked, he is out.
4. Secure any paid aviation role: ground instructor, sim operator, dispatcher.
5. Talk to girlfriend and mother honestly about the August cutoff.

### Product focus

Current product is: **Create profile → Connect logbook → View pathways → Recognition+ verification via consultancy.**

1. Refactor `BecomeMemberPage.tsx` to a 2-stage gate only (~400 lines).
2. Make `getDashboardData` surface pathway matches.
3. Build consultancy intake form for Recognition+ ($120/pilot).
4. Build simple admin dashboard for manual verification workflow.
5. Add first-time welcome tour modal on home tab: 3-step guide to profile, pathways, and verification.
6. Deprioritize cryptographic VC complexity. Keep wallet shell but do not lead with it.

### Market validation

1. Get **10 pilots** to create profiles. Document their pain in their own words.
2. Get **1 pilot** to pay for Recognition+ verification.
3. Record **1 video testimonial** from a pilot who now sees a pathway.
4. Contact **3 ATOs** with the Pillar 5 verified-issuer pitch.
5. Contact **1 airline or cargo operator** and ask what they actually need to see before hiring.
6. Recruit **3 associate pilots** for the Ambassador / Associate Program with a simple application form.

---

## Strategic Documents

- `market-analysis-synthesis.md` — executive market analysis.
- `market-overview.md` — full product and market overview.
- `market-survey.md` — field survey, case studies, personas, Pillar 5.
- `universal-commercial-framework.md` — 25-pillar ecosystem blueprint.
- `universal-commercial-framework-v9.md` — 15-pillar version.
- `market.md` — three-sided pipeline analysis.
- `motivation.md` and `personal.md` — why this is being built and the owner's survival situation.

---

## What to Avoid

- Do not build another job board.
- Do not chase airline API deals before there are verified pilots.
- Do not add blockchain complexity before basic verification is working and paid.
- Do not suggest debt or loans to survive.
- Do not ignore the personal survival situation when giving advice.

---

## The North Star

Become the **information monopolist of the pilot economy**: the neutral recognition layer that every stakeholder — pilot, ATO, airline, manufacturer, bank, insurer — reads and trusts.

The first proof is simple: **10 pilots, 1 paid verification, 1 real pathway conversation.**

Everything else scales from there.
