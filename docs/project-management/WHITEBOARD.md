# PilotRecognition.com — WHITEBOARD
> Last updated: May 15, 2026 | Deadline: September 2026

---

## THE PROBLEM (Four-Floor Tower)

```
┌─────────────────────────────────────────────────────────┐
│  FLOOR 3 │ Airline Pilots (12+ yrs) — trapped by        │
│          │ seniority. Want change. Can't move.           │
├─────────────────────────────────────────────────────────┤
│  FLOOR 2 │ ⚡ THE GAP — Recognition Collapse            │
│          │ Everyone fighting for pathways. No framework. │
│          │ Pilots fly blind. THIS IS OUR MARKET.         │
├─────────────────────────────────────────────────────────┤
│  FLOOR 1 │ Flight Instructors (5,000–6,000 hrs)         │
│          │ 15 yrs experience. Nobody leaving Floor 2.    │
├─────────────────────────────────────────────────────────┤
│  FLOOR 0 │ Graduates (200 hrs) — $50K spent.            │
│          │ Instructor line backed up 2–3 years.          │
└─────────────────────────────────────────────────────────┘
```

---

## THE PLATFORM (Three Products)

```
┌──────────────────────────────────────────────────────────────────────┐
│                        PILOTRECOGNITION.COM                          │
│                                                                      │
│  ┌─────────────┐   ┌──────────────────────┐   ┌──────────────────┐  │
│  │  PROGRAMS   │   │  RECOGNITION PROFILE │   │    PATHWAYS      │  │
│  │             │   │                      │   │                  │  │
│  │ Foundation  │   │  Free Tier           │   │  Free Tier       │  │
│  │   $49       │   │  (3 pathways/mo)     │   │  (public only)   │  │
│  │             │   │                      │   │                  │  │
│  │ Transition  │   │  Recognition+        │   │  Premium $49 ea  │  │
│  │   $299      │   │  $99/yr              │   │  or $199/yr      │  │
│  │ ($149 w/    │   │                      │   │                  │  │
│  │  discount)  │   │  • Full comparison   │   │  • Private sector│  │
│  │             │   │  • Unlimited paths   │   │  • Corp aviation │  │
│  │ EBT Video   │   │  • Priority match    │   │  • Advanced      │  │
│  │ (bundled)   │   │  • Verification      │   │    analytics     │  │
│  └─────────────┘   │    wallet            │   └──────────────────┘  │
│                    └──────────────────────┘                          │
│                                                                      │
│  AIRLINES / OPERATORS                                                │
│  ┌──────────────────────────────────────────────────────────────┐   │
│  │  Free: post pathways, view profiles                          │   │
│  │  Enterprise: $1,000/mo — pull API, unlimited, EBT video      │   │
│  │  Success fee: $500 per pilot hired                           │   │
│  └──────────────────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────────────────┘
```

---

## VERIFICATION ENGINE (Pillar 11)

```
                    VEREMARK PARTNERSHIP
                    (15% below RRP on all checks)
                           │
          ┌────────────────┴─────────────────┐
          │                                  │
     LAYER 1                            LAYER 2
  Pilot-Initiated                  Operator-Requested
  (at profile creation)            (per candidate, per check)
          │                                  │
  Pilot pays RRP                   Operator pays RRP
  We pay partner cost              We pay partner cost
  ─────────────────                ──────────────────
  Margin: ~15%                     Margin: ~15%
          │                                  │
  Results → Pilot's                Results → Pilot's
  portable wallet                  wallet (with consent)

MARKET MARGINS (full bundle, all checks):
┌──────────────┬──────────┬──────────────┬──────────┐
│ Market       │ RRP      │ Partner Cost │ Profit   │
├──────────────┼──────────┼──────────────┼──────────┤
│ 🇮🇳 India    │ $149     │ $129         │ $20 (13%)│
│ 🇵🇭 PH       │ $96      │ $84          │ $12 (13%)│
│ 🇸🇬 SG       │ $210     │ $182         │ $28 (13%)│
│ 🇦🇪 UAE      │ $532     │ $454         │ $78 (15%)│
│ 🇬🇧 UK       │ $218     │ $188         │ $30 (14%)│
└──────────────┴──────────┴──────────────┴──────────┘
```

---

## REVENUE MODEL

```
PILOT REVENUE
  Recognition+ $99/yr × N pilots
  + Verification bundle (RRP, 15% margin)
  + Premium pathways $49–$199/yr
  + Programs $49–$299

OPERATOR REVENUE
  Enterprise API $1,000/mo × N operators
  + Success fee $500/hire
  + Layer 2 deep checks at RRP (15% margin)

YEAR 1–3 PROJECTIONS (from pitch)
  Year 1: $2–3M
  Year 2: $10–15M
  Year 3: $40–50M
  Exit:   $200–500M
```

---

## TECHNOLOGY STACK

```
Frontend:     React + TypeScript + Vite
Styling:      Tailwind CSS
Backend:      Supabase (Postgres + Auth + RLS)
Functions:    Firebase / Supabase Edge Functions
Media:        Cloudinary (cloud: WMPILOTGROUP)
Hosting:      Vercel + Netlify
Verification: Veremark API (integration pending)
ATS:          Greenhouse / Workday / Lever (webhook planned)
```

---

## SECURITY STATUS

```
✅ Code-level (15/15)     rate limiting, Zod, CSRF, headers, etc.
✅ Database-level (6/6)   RLS, search_path, pg_net, definer view
⏳ Manual infra (0/27)    Cloudflare WAF, DNSSEC, TLS 1.3, HSTS
                          → docs in /scripts/
```

---

## PARTNERSHIPS

```
✅ In-principle agreements:
   Airbus, Fly Dubai, Private Jet Co., Etihad

✅ Campus partnerships (6 secured)

⏳ Veremark — API wiring pending (week-close timeline)
⏳ US market — First Advantage / HireRight (FAA/PRD)
⏳ Philippines launch market (Veremark local infra ready)
⏳ European Flight Academy outreach
```

---

## UCF — UNIVERSAL COMMERCIAL FRAMEWORK

```
7 Hubs × 25 Pillars — the operating system blueprint

HUB A  Airlines & Commercial Operators
HUB B  Training & Education
HUB C  Regulatory & Compliance
HUB D  Insurance & Finance
HUB E  Technology & Data
HUB F  Government & International
HUB G  Digital Discovery

Key pages:
  /ucf                  — Pillar index (25 cards)
  /ucf/official-release — Full 25-pillar document
  /enterprise-access    — Enterprise landing page
  /enterprise/framework — Framework for enterprises
```

---

## WHAT NEEDS TO HAPPEN BEFORE SEPTEMBER

```
Priority  Item                               Status
────────  ─────────────────────────────────  ──────────────
🔴 HIGH   Veremark API — live backend wiring  Pending
🔴 HIGH   3+ airline pathway cards live       Pending
🔴 HIGH   Pull API for enterprise clients     Pending
🔴 HIGH   EBT video scoring system            Pending
🟡 MED    Campus contracts signed             6 in principle
🟡 MED    27 manual security/infra items      Docs ready
🟡 MED    Philippines pilot acquisition       Strategy ready
🟢 DONE   Platform security (code + DB)       Complete
🟢 DONE   UCF document (25 pillars)           Complete
🟢 DONE   Enterprise landing page             Complete
🟢 DONE   Mobile optimization                 Complete
🟢 DONE   Veremark pricing + margin model     In admin view
```

---

## CORE NARRATIVE (pitch language)

```
NOT a job board        → Pathway Cards
NOT push applications  → Pulling System
NOT static CVs         → Live Real-Time Profiles
NOT airline seniority  → Recognition Score (portable currency)
NOT one-time checks    → Verify Once, Apply Anywhere (wallet)
```

---
*File: /WHITEBOARD.md — update this as the project evolves*
