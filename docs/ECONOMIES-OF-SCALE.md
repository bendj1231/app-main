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

## Unit Economics — Philippines Baseline (Workflow B)

| | Per Pilot |
|---|---|
| Recognition+ subscription | $99/yr |
| Veremark Workflow B (3 checks) | −$8 |
| USDC payment fee | −$0.10 |
| **Net per pilot** | **~$90.90** |
| **Margin** | **91.8%** |

---

## The Scale Thresholds

### Threshold 1 — Break Even: ~50 pilots

```
50 × $90.90 = $4,545 net/yr
Fixed costs  = $4,000/yr
─────────────────────────
Net profit   = ~$545
```

Break even at **50 paying pilots**. That's the floor.

---

### Threshold 2 — Ramen Profitable (founder salary): ~300–500 pilots

```
300 pilots × $90.90 = $27,270 net
500 pilots × $90.90 = $45,450 net
```

At 300–500 pilots a single founder is covering a modest salary in a low-cost base (Philippines/UAE). This is the "prove the model" zone.

---

### Threshold 3 — True Economies of Scale: 1,000–2,000 pilots

| Pilots | Subscription Rev | Veremark Cost | Net Profit | Per-Pilot Infra Cost |
|---|---|---|---|---|
| 100 | $9,900 | $800 | $9,090 | $40 |
| 500 | $49,500 | $4,000 | $45,450 | $8 |
| 1,000 | $99,000 | $8,000 | $90,900 | $4 |
| 2,000 | $198,000 | $16,000 | $181,800 | $2 |
| 10,000 | $990,000 | $80,000 | $909,000 | $0.40 |

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

- **$50 per pull** (airline pays), **$25 to Veremark** = **$25 margin per pull**
- 10 pilots shortlisted per month per airline = **$250 passive/mo per airline**
- 10 airlines = **$2,500/mo = $30,000/yr** from zero additional work

---

## Multi-Market Multiplier

Regional pricing tiers are the real economies of scale engine:

| Market | Subscription | Veremark Cost | Net Margin |
|---|---|---|---|
| 🇵🇭 Philippines | $99 | $8 | ~$91 (91.8%) |
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
