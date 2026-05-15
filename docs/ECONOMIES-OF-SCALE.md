# Economies of Scale — PilotRecognition.com
_Last updated: May 15, 2026_

---

## The Fixed Cost Base

| Fixed Cost | Monthly | Annual |
|---|---|---|
| Platform hosting (Vercel/Supabase) | ~$150 | ~$1,800 |
| Supabase Pro + DB | ~$100 | ~$1,200 |
| Firebase functions | ~$50 | ~$600 |
| Domain + email (Resend) | ~$30 | ~$360 |
| **Total infra (lean)** | **~$330/mo** | **~$4,000/yr** |

Founder-only operation = ~$4–6k/year in fixed costs. This is the leverage point.

---

## Unit Economics — Philippines Baseline (Confirmed May 16, 2026)

| | Per Pilot |
|---|---|
| Subscription | $100/yr |
| Veremark — Prof. Qualification check (1 check) | −$13 |
| USDC payment fee (~0.1%) | −$0.10 |
| Infra allocation | −$1 |
| **Net per pilot** | **~$86** |
| **Margin** | **86%** |

**Architecture:** Pilot pays for 1 check (Professional Qualification — covers CAAP license, Class 1 Medical, NTC Radio License). Identity check is triggered separately by the airline at shortlist, billed to the airline at $50 ($9 cost = $41 net margin per pull).

---

## The Scale Thresholds

### Threshold 1 — Break Even: ~47 pilots

```
47 × $86 = $4,042 net/yr
Fixed costs = $4,000/yr
──────────────────────
Net profit  = ~$42
```

Break even at **~47 paying pilots**. Barely changed from original model.

---

### Threshold 2 — Ramen Profitable (founder salary): ~300–500 pilots

```
300 pilots × $86 = $25,800 net
500 pilots × $86 = $43,000 net
```

At 300–500 pilots a single founder is covering a modest salary in a low-cost base (Philippines/UAE). This is the "prove the model" zone.

---

### Threshold 3 — True Economies of Scale: 1,000–2,000 pilots

| Pilots | Revenue | Veremark (Prof. Qual.) | Net Profit | Per-Pilot Infra Cost |
|---|---|---|---|---|
| 100 | $10,000 | −$1,300 | $8,690 | $40 |
| 500 | $50,000 | −$6,500 | $43,450 | $8 |
| 1,000 | $100,000 | −$13,000 | $86,900 | $4 |
| 2,000 | $200,000 | −$26,000 | $173,800 | $2 |
| 10,000 | $1,000,000 | −$130,000 | $869,000 | $0.40 |

At 1,000 pilots: infra cost per pilot is $4. At 10,000 it's $0.40. Marginal cost approaches zero while revenue scales linearly.

---

### Threshold 4 — Enterprise + Airline Revenue Kicks In: ~500 pilots

| Airlines on Enterprise | Monthly | Annual |
|---|---|---|
| 1 airline | $1,000/mo | $12,000 |
| 3 airlines | $3,000/mo | $36,000 |
| 5 airlines | $5,000/mo | $60,000 |
| 10 airlines | $10,000/mo | $120,000 |

At 500 verified pilots you have a demo-able product. One airline contract at $1,000/mo equals ~133 pilot subscriptions in revenue.

**Combined model at 500 pilots + 3 airlines:**
```
500 × $90.90 = $45,450 (pilots)
3 × $12,000  = $36,000 (airlines)
───────────────────────
Total net    = $81,450/yr
```

---

### Threshold 5 — Operator Profile Pulls (passive income layer)

- **$50 per pull** (airline pays), **$9 to Veremark** (Identity check) = **$41 margin per pull**
- 10 pilots shortlisted per month per airline = **$410 passive/mo per airline**
- 10 airlines = **$4,100/mo = $49,200/yr** from zero additional work

_Margin revised upward: identity check is $9 (not $25 as previously modelled) because it's a single Workflow B confirmation, not a full data pull._

---

## Multi-Market Multiplier

Regional pricing tiers are the real economies of scale engine:

| Market | Subscription | Veremark Cost | Net Margin |
|---|---|---|---|
| 🇵🇭 Philippines | $100 | $13 | ~$86 (86%) |
| 🇬🇧 UK | $239 | $48 (DBS) | ~$191 (79.9%) |
| 🇦🇪 UAE | $389 | $93 | ~$296 (76%) |
| 🇸🇬 Singapore | $189 | $22 | ~$167 (88%) |

A UAE pilot is worth 3× a Philippines pilot. A UK pilot is worth 2×. Geographic expansion is a revenue multiplication event, not a cost problem.

---

## Summary — Scale Milestone Table

| Milestone | Pilots Needed | Why It Matters |
|---|---|---|
| **Break even** | 50 | Cover infra |
| **Ramen profitable** | 300–500 | Founder salary |
| **True EoS begins** | **1,000** | Marginal cost ~$4/pilot, Veremark negotiation leverage |
| **Veremark price drop** | 5,000 | Wholesale drops from $25 → $15 (partnership model) |
| **Series A narrative** | 10,000 | $909k net, proven multi-market, 5+ airline contracts |
| **Full EoS** | **10,000+** | $0.40 infra/pilot, $12 Veremark/pilot, 91%+ net margin |

---

## The Critical Insight

**The bottleneck is not cost — it's pilot acquisition.** Fixed cost base is $330/month. Break-even is 50 pilots. Every pilot after that is ~$91 net profit with near-zero marginal cost.

### Customer Acquisition Cost (CAC) Analysis

| Channel | CAC | Payback Period |
|---|---|---|
| College partnership | ~$0 | Immediate |
| Organic referral / Peer Chain | ~$0 | Immediate |
| Paid social ads | $20–50 | 2–6 months |

At $30 CAC, a pilot pays back acquisition cost in year 1 and renews for near-free in year 2. The cohort model means year 3 revenue is nearly pure profit.

### The Renewal Compounding Effect

```
Year 1 cohort (300 pilots):  $27,270 net  (after CAC ~$9,000)  → $18,270
Year 2 same cohort renews:   $27,270 net  (CAC = $0)           → $27,270
Year 3 same cohort renews:   $27,270 net  (CAC = $0)           → $27,270
+ Year 2 new cohort added:   $27,270 net                       → stacks
```

Recurring SaaS cohort compounding is the true economies of scale engine — not the Veremark pricing.

---

## Sources

- `/docs/PAYMENT-VERIFICATION-ECONOMICS.md` — Veremark Workflow B pricing, USDC model, scale table
- `/docs/veremark-partnership/commercial-framework-proposal.md` — co-investment model, volume tiers
- `/app/ucf/official-release/page.tsx` — global Veremark RRP pricing (PH, SG, UK, UAE, IN), white-label arbitrage logic
- Veremark communication: Oliver @ Veremark, May 14–15 2026

---

# Full Expanded Revenue Model
_Updated: May 15, 2026 — All streams included_

---

## Revenue Stream Map

### 1. Pilot Subscriptions — $100/yr
Includes verification (Veremark Workflow B), storage, zero-liability token architecture.

| | Amount |
|---|---|
| Retail to pilot | $100/yr |
| Veremark 3-check cost | −$8 |
| Storage/infra allocation | −$1 |
| **Net per pilot** | **$91/yr** |
| **Margin** | **91%** |

---

### 2. Operator Access — $1,000/yr each

Every operator category pays $1,000/yr for platform access + pilot pool visibility:

| Operator Type | Expectations Page ($100/yr) | Pathway Posting ($1,000/yr) | Notes |
|---|---|---|---|
| Airlines | ✅ | ✅ | Per pathway posted |
| eVTOL operators | ✅ | ✅ | |
| Private jet / charter | ✅ | ✅ | |
| Cargo operators | ✅ | ✅ | + pull access |
| MAF / humanitarian missions | ✅ | ✅ | Mission postings |
| Manufacturers | ✅ | ✅ | Pathway to type rating |
| Flight schools | ❌ | ✅ | Need pilots for training — no expectations page |
| Type rating centers | ❌ | ✅ | Need candidates — no expectations page |

**Expectations page** = operator publishes what they require from pilots. Visible to all pilots on platform. $100/yr per operator. Flight schools and training organisations excluded (they recruit, not select).

---

### 3. Profile Pulls — $25 net margin per pull

| | Amount |
|---|---|
| Operator pays per pull | $50 |
| Veremark wholesale | −$25 |
| **Net margin** | **$25** |

Applies to: airlines, cargo, charter, eVTOL, MAF, manufacturers. Not flight schools.

---

### 4. Referral System — $20 per successful invite

Any person with an invite code — pilot, airline staff, influencer, training org, flight school, YouTube creator, cadet coordinator — earns $20 when a referred pilot pays the $100 subscription.

| | Amount |
|---|---|
| Pilot pays | $100 |
| Referral payout | −$20 |
| Veremark cost | −$8 |
| **Net on referred pilot** | **$72** |
| **Margin** | **72%** |

Referral channels: pilots, airlines, influencers, training orgs, flight schools, content creators, cadet program coordinators.

---

### 5. Programs Revenue

| Program | Price | Delivery Cost | Net | Notes |
|---|---|---|---|---|
| Certification modules | $50/cert | ~$5 | **$45** | Per certification completed |
| EBT Video Alignment | $50 | ~$10 | **$40** | Behavioural scoring — proprietary IP |
| **Transition Program** | **$299** | ~$30 | **$269** | Full 9-pillar, all stakeholders, EBT included |
| Foundation Program | Free | $0 | **$0 direct** | Missionary/Peer Chain model — organic acquisition engine |

**Foundation Program logic:** Pilots help other pilots for free via Peer Chain. No direct revenue — every pilot it touches is a conversion target for the $100 subscription. CAC = $0. It is the organic flywheel.

---

### 6. Manufacturer Access — $1,000/yr + $100 expectations page

Manufacturers (Airbus, Boeing, Textron, Pipistrel, Joby, etc.) pay:
- **$1,000/yr** — pathway access (e.g. "become a test pilot", "type rating pathway for our aircraft")
- **$100/yr** — expectations page (what they look for in pilots interacting with their products)

---

## Full Unit Economics Per 1,000-Pilot Cohort
_(mixed acquisition: 70% organic/college, 30% via referral code)_

| Stream | Calculation | Annual |
|---|---|---|
| Pilot subs (700 organic) | 700 × $91 | $63,700 |
| Pilot subs (300 via referral) | 300 × $72 | $21,600 |
| Referral payouts | 300 × $20 | −$6,000 |
| **Pilot sub net total** | | **$79,300** |

---

## Full Combined Model at Scale

| Metric | 500 pilots | 1,000 pilots | 2,000 pilots | 5,000 pilots | 10,000 pilots |
|---|---|---|---|---|---|
| **Pilot subs net** | $45,500 | $85,300 | $170,600 | $426,500 | $853,000 |
| **Operator access** (×operators) | 10 × $1k = $10k | 20 × $1k = $20k | 35 × $1k = $35k | 60 × $1k = $60k | 100 × $1k = $100k |
| **Expectations pages** | 10 × $100 = $1k | 20 × $100 = $2k | 35 × $100 = $3.5k | 60 × $100 = $6k | 100 × $100 = $10k |
| **Pathway postings** | 15 × $1k = $15k | 30 × $1k = $30k | 50 × $1k = $50k | 80 × $1k = $80k | 150 × $1k = $150k |
| **Profile pulls** | 10ops×10×$25=$30k | $60k | $105k | $180k | $360k |
| **Cert programs ($50)** | 200×$45=$9k | $18k | $36k | $90k | $180k |
| **Transition Program ($299)** | 50×$269=$13.5k | $26.9k | $53.8k | $134.5k | $269k |
| **Manufacturers** | 5×$1,100=$5.5k | $8.8k | $13.2k | $22k | $44k |
| **Infra fixed cost** | −$4k | −$4k | −$4k | −$5k | −$6k |
| **TOTAL NET** | **~$125,500** | **~$246,000** | **~$463,100** | **~$994,000** | **~$1,960,000** |

---

## Revised Economies of Scale Milestones (Full Model)

| Milestone | Pilots | Operators | Total Net/yr | Notes |
|---|---|---|---|---|
| **Break even** | 45 | 1 | ~$4,000 | Cover infra alone |
| **Ramen profitable** | 200 | 5 | ~$30,000 | Founder salary |
| **True EoS begins** | **500** | 15 | **~$125k** | Programs + pulls + operators compound |
| **Self-sustaining** | 1,000 | 30 | **~$246k** | Multi-staff, marketing budget unlocked |
| **Series A territory** | 2,000 | 50 | **~$463k** | Proven multi-stream, multi-market |
| **Scale** | 5,000 | 80 | **~$994k** | Near $1M net, <$1 infra/pilot |
| **Full EoS** | **10,000** | 150 | **~$1.96M** | Referral flywheel self-funding growth |

**Key shift from previous model:** True EoS moves from 1,000 pilots to **500 pilots** — because programs, pathway postings, and profile pulls add ~$80k on top of pilot subs at that level.

---

## The Compounding Flywheel

```
Foundation Program (free, missionary / Peer Chain)
        ↓ pulls in pilots organically — CAC $0
Pilot pays $100 → verified, stored, zero-liability token issued
        ↓
Operator sees verified pilot pool → pays $1,000/yr access
Operator posts expectations page → pays $100/yr
Operator posts pathway → pays $1,000/pathway
        ↓
Pilot applies → operator pulls profile → $50 charge → $25 net margin
        ↓
Pilot completes Transition Program → $299 → $269 net
Pilot refers 3 friends via invite code → 3 × $20 payout
3 new pilots enter pool → cycle repeats
        ↓
Recognition Score rises → pilot visible to more operators
More operators join → more pathway + expectations + pull revenue
        ↓
Manufacturers list pathways → type rating centers fill seats
Flight schools recruit from pool → pay $1,000/yr access
```

**Every part of the model feeds every other part. No stream is isolated.**

---

## Operator Category Summary

| Category | Access Fee | Expectations | Pathway | Profile Pull | Referral Eligible |
|---|---|---|---|---|---|
| Airlines | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| eVTOL | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| Private jet / charter | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| Cargo | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| MAF / humanitarian | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| Manufacturers | $1,000/yr | $100/yr | $1,000/pathway | $50/pull | ✅ |
| Flight schools | $1,000/yr | ❌ | $1,000/pathway | ❌ | ✅ |
| Type rating centers | $1,000/yr | ❌ | $1,000/pathway | ❌ | ✅ |
