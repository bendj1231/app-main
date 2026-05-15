# Payment & Verification Economics
_Last updated: May 15, 2026_

---

## Layer 1 Verification — 3 Checks

| # | Check | What it covers |
|---|---|---|
| 1 | **Identity** | Name, DOB, nationality — confirmed against government-issued ID registry |
| 2 | **Education** | Flight school, certificate issuance — confirmed against institutional records |
| 3 | **Professional Qualification** | CAAP License + Class 1 Medical + NTC Radio License — confirmed against CAAP registry |

Fitness check removed — CAAP Class 1 Medical IS the fitness check. No duplication.

---

## Veremark — Two Pricing Workflows

### Workflow A — Data Sourcing (NOT what we do)
Veremark searches, locates, retrieves credential records independently. Full data pull. Higher cost.

### Workflow B — Data Verification (OUR model)
Pilot self-submits their credentials at registration. Veremark confirms submitted data matches the issuing authority's registry. Yes/no confirmation — not a pull.

**Always negotiate Workflow B pricing with Veremark explicitly.**

---

## Cost Per Pilot — Verification Only Model

| Check | Veremark verification cost | Profit margin |
|---|---|---|
| Identity | ~$2–3 | $1 |
| Education | ~$2–3 | $1 |
| Professional Qualification | ~$3–5 | $2 |
| **Total** | **~$8** | **~$4 per check** |

---

## Unit Economics — USDC Payment (Best Case)

| | Amount |
|---|---|
| Subscription revenue | $99 |
| Veremark verification cost | -$8 |
| USDC network fee (~0.1%) | -$0.10 |
| UAE corporate tax | $0 (0% free zone) |
| **Net profit per pilot** | **~$90.90** |
| **Margin** | **91.8%** |

---

## Scale Table — USDC + Verification Model

| Pilots | Revenue | Veremark | USDC fees | **Net profit** |
|---|---|---|---|---|
| 100 | $9,900 | -$800 | -$10 | **$9,090** |
| 300 | $29,700 | -$2,400 | -$30 | **$27,270** |
| 500 | $49,500 | -$4,000 | -$50 | **$45,450** |
| 1,000 | $99,000 | -$8,000 | -$100 | **$90,900** |
| 10,000 | $990,000 | -$80,000 | -$1,000 | **$909,000** |

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

## Veremark Email Sent — May 15, 2026
Re: Pricing distinction between Workflow A (data sourcing) vs Workflow B (data verification).
Requesting confirmation pricing tier for verification-only checks.
Contact: Oliver @ Veremark
