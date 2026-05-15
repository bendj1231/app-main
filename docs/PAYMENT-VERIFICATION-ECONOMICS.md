# Payment & Verification Economics
_Last updated: May 15, 2026_

---

## Layer 1 Verification — Architecture (Updated May 16, 2026)

### Pilot Registration Check (1 check only)

| # | Check | What it covers | Who pays | Cost |
|---|---|---|---|---|
| 1 | **Professional Qualification** | CAAP License + Class 1 Medical + NTC Radio License — confirmed against CAAP registry | Pilot ($100 sub) | $13 partner rate |

### Airline Profile Pull Check (triggered at shortlist)

| # | Check | What it covers | Who pays | Cost |
|---|---|---|---|---|
| 1 | **Identity Verification** | Name, DOB, nationality — confirmed against government-issued ID registry | Airline ($50 pull fee) | $9 partner rate |

**Architecture rationale:**
- Pilot only pays for the credential PilotRecognition uniquely verifies (CAAP registry)
- Identity is pulled by the airline at shortlist — this is where it belongs in the hiring workflow
- No duplication, no over-charging the pilot
- Airline gets real value from the $50 pull (live identity confirmation, not just profile view)

Fitness check removed — CAAP Class 1 Medical IS the fitness check. No duplication.

---

## Veremark — Two Pricing Workflows

### Workflow A — Data Sourcing (NOT what we do)
Veremark searches, locates, retrieves credential records independently. Full data pull. Higher cost.

### Workflow B — Data Verification (OUR model)
Pilot self-submits their credentials at registration. Veremark confirms submitted data matches the issuing authority's registry. Yes/no confirmation — not a pull.

**Confirmed by Oliver Lobb (Veremark) via email May 16, 2026** — positioned as "verification-led workflow rather than traditional data sourcing." Pricing shared is based on this model with 15% markup allowance for PilotRecognition.

**Always negotiate Workflow B pricing with Veremark explicitly.**

---

## Cost Per Pilot — Confirmed Veremark Philippines Pricing (May 16, 2026)

### Pilot Registration (1 check)

| Check | RRP | Partner Rate (−15%) | Notes |
|---|---|---|---|
| Professional Qualification | $15 | $13 | CAAP + Medical + Radio License |
| **Total at registration** | **$15** | **$13** | |

### Airline Profile Pull (1 check, billed to airline)

| Check | RRP | Partner Rate (−15%) | Airline Pays | Net Margin |
|---|---|---|---|---|
| Identity Verification | $10 | $9 | $50 | **$41** |

### Other Philippines Checks (available, not in core bundle)

| Check | RRP | Partner Rate |
|---|---|---|
| Education Check | $10 | $9 |
| Criminal Record Check | $15 | $13 |
| Employment Check | $10 | $9 |
| Right To Work | $10 | $9 |
| Social Media Check | $37 | $32 |
| Reference Check | $7 | $6 |

---

## Unit Economics — USDC Payment (Updated)

| | Amount |
|---|---|
| Subscription revenue | $100 |
| Veremark Professional Qual. check | −$13 |
| USDC network fee (~0.1%) | −$0.10 |
| Infra allocation | −$1 |
| UAE corporate tax | $0 (0% free zone) |
| **Net profit per pilot** | **~$86** |
| **Margin** | **86%** |

### Airline Profile Pull Unit Economics

| | Amount |
|---|---|
| Airline pays per pull | $50 |
| Veremark Identity check | −$9 |
| **Net per pull** | **$41** |
| **Margin** | **82%** |

---

## Scale Table — USDC + Verification Model (Updated)

| Pilots | Revenue | Veremark (Prof. Qual.) | USDC fees | **Net profit** | Margin |
|---|---|---|---|---|---|
| 100 | $10,000 | −$1,300 | −$10 | **$8,690** | 86.9% |
| 300 | $30,000 | −$3,900 | −$30 | **$26,070** | 86.9% |
| 500 | $50,000 | −$6,500 | −$50 | **$43,450** | 86.9% |
| 1,000 | $100,000 | −$13,000 | −$100 | **$86,900** | 86.9% |
| 10,000 | $1,000,000 | −$130,000 | −$1,000 | **$869,000** | 86.9% |

### + Airline Pull Revenue (additive)

| Airlines | Pulls/mo | Annual Pull Revenue | Annual Pull Cost | **Net Pull Profit** |
|---|---|---|---|---|
| 10 | 10 each | $60,000 | −$10,800 | **$49,200** |
| 25 | 10 each | $150,000 | −$27,000 | **$123,000** |
| 50 | 10 each | $300,000 | −$54,000 | **$246,000** |

---

## Payment Methods — Stripe vs USDC

| Method | Fee per $99 | At 1,000 pilots | At 10,000 pilots |
|---|---|---|---|
| Stripe card (2.9% + $0.30) | $3.17 | $3,170 | $31,700 |
| GCash / PayMongo | ~$2.43 | $2,430 | $24,300 |
| **USDC stablecoin** | **~$0.10** | **$100** | **$1,000** |

**Saving vs Stripe at 10,000 pilots: ~$30,700**

---

## USDC — Key Facts

- USDC is pegged 1:1 to USD — zero devaluation risk
- Issued by Circle, regulated, USD-backed
- Hold in Coinbase Business account (insured)
- Convert to USD anytime at ~0.1% fee
- UAE: 0% capital gains tax on crypto conversion
- **USDC = USD, without Stripe fees**

---

## Payment Stack Recommendation

| Pilot type | Recommended method |
|---|---|
| Global / UAE pilots | USDC via Coinbase Commerce |
| Philippines pilots | GCash / Maya via Stripe or PayMongo |
| Fallback | Stripe card |

---

## Alternative Verification Providers

| Provider | Specialty | Est. cost | Notes |
|---|---|---|---|
| **Veremark** | APAC, aviation-aware, Philippines office | $8–15 | Current target partner |
| **Datascore PH** | PRC, NBI, CAAP registry — direct access | $2–4 | Cheapest for CAAP checks |
| **KYC Asia** | Identity + license APAC | $3–5 | Singapore-based |
| **Jumio** | Identity only | $1–2 | Document + face match |
| **Onfido** | Identity + document | $2–3 | No CAAP coverage |
| **Certn** | Canada/APAC, fast API | $5–12 | Growing Philippines presence |

### Cheapest Split Stack
| Check | Provider | Cost |
|---|---|---|
| Identity | Jumio | $1–2 |
| Education | KYC Asia | $2–3 |
| Professional Qualification | Datascore PH | $2–4 |
| **Total** | Mixed | **$5–9** |

---

## Strategy Notes

- **Start with Veremark** — aviation-aware, fast onboarding, Philippines presence
- At **500+ pilots** — return with Datascore PH quotes and negotiate Veremark down
- **Push annual plan** as default — one Stripe fee vs 12
- **Add USDC as payment option** alongside Stripe — pilots self-select, zero fees on those
- **UAE free zone structure** — 0% corporate tax on qualifying income
- Veremark invoices **monthly** — you collect $99 upfront, pay $8 at month end

---

## Veremark Correspondence Log

### Email Sent — May 15, 2026
Re: Pricing distinction between Workflow A (data sourcing) vs Workflow B (data verification).
Requesting confirmation pricing tier for verification-only checks.
Contact: Oliver Lobb @ Veremark

### Reply Received — May 16, 2026 (Oliver Lobb, Veremark)
Key confirmations:
- Model confirmed as Workflow B (verification-led, not data sourcing)
- Pilot submits data → PilotRecognition initiates → pilot completes consent in Veremark workflow → Veremark verifies against primary sources
- Pilot receives Verepass verified record; PilotRecognition receives final verification report
- **15% markup confirmed in writing** — "Pilot Recognition to apply an approximate 15% markup on each check"
- Volume-based repricing door open — "happy to revisit pricing once volumes are increasing"
- Pricing sheet provided: Philippines Professional Qualification = $15 RRP / $13 partner rate

### Pending Confirmation
- Whether Professional Qualification check covers identity by extension (CAAP registry includes photo ID)
- Written confirmation of per-check partner rates for the 1-check bundle
