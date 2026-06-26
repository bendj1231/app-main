# Notebook Management

## Architecture: Two D1 Databases

### Notebook A — `pilotrecognition-d1` (Platform)
**Worker binding:** `env.DB`
**Purpose:** Enterprise, business, and platform data

| Table | Purpose |
|-------|---------|
| `enterprise_accounts` | Airline/ATO accounts |
| `enterprise_profiles` | Business profiles |
| `enterprise_credits` | Verification credit balance |
| `credit_transactions` | Credit usage history |
| `payments` | Dodo payment records |
| `subscriptions` | Tier tracking |
| `referral_partners` | Influencer/affiliate codes |
| `referral_conversions` | Tracked signups |
| `flight_schools` | ATO directory |
| `flight_school_referrals` | Graduate tracking |
| `flight_school_payouts` | Commission payments |
| `flight_school_notifications` | School alerts |
| `bulk_voucher_batches` | ATO bulk purchases |
| `bulk_voucher_codes` | Individual voucher codes |
| `logbook_providers` | Provider directory (ForeFlight, etc.) |
| `notifications` | In-app alerts |
| `delete_intent_tokens` | GDPR delete requests |
| `forum_categories` | Forum sections |
| `forum_topics` | Forum threads |
| `forum_posts` | Forum replies |
| `forum_reactions` | Likes/hearts |
| `forum_topic_views` | View counters |
| `airlines` | Reference data |
| `verification_employee_access_log` | Audit trail |
| `d1_migrations` | Migration tracking |

---

### Notebook B — `pilotrecognition-profiles` (Pilots)
**Worker binding:** `env.PILOT_DB`
**Purpose:** Individual pilot data, credentials, verification

| Table | Rows | Purpose |
|-------|------|---------|
| `profiles` | **6** | Pilot identity + `public_token` |
| `pilot_credentials` | 0 | W3C VCs (license, medical, radio, ELP, hours, profile) |
| `pilot_dids` | 0 | Decentralized IDs |
| `pilot_logbook_connections` | 0 | ForeFlight/LogTen links |
| `verification_submissions` | 0 | Document upload queue |
| `reverification_queue` | 0 | Annual expiry alerts |
| `aircraft_type_ratings` | 0 | C152, B737, A320 reference |
| `recognition_scores` | 0 | Gamification points |
| `flight_hours` | 0 | Detailed flight logs (legacy) |
| `mentorship_badges` | 0 | Mentor badges (legacy) |
| `pilot_licensure_experience` | 0 | License history (legacy) |
| `verification_receipts` | 0 | Veremark results (legacy) |
| `d1_migrations` | -- | Migration tracking |

---

## D1 Limits & Costs

### Free Plan (Current)
- **Per database:** 500 MB max
- **Databases per account:** 10
- **Row reads:** 5 million/day
- **Row writes:** 100,000/day
- **Worker requests:** 100,000/day
- **Cost:** $0.00 (hard cap — Worker stops at limits)

### Paid Plan ($5/month)
- **Per database:** 10 GB max
- **Databases per account:** 50,000
- **Row reads:** 25 billion/month
- **Row writes:** 50 million/month
- **Worker requests:** 10 million/month
- **Overage:** Row reads $0.001/million, storage $0.75/GB/month

---

## How to Verify You're on the Free Plan

1. **Dashboard indicator:** Look for blue "Upgrade" button (top right of Workers page)
2. **Request cap:** Progress bar shows `X / 100,000` (Free) vs `X / 10,000,000` (Paid)
3. **D1 info:** `npx wrangler d1 info <database>` shows 500.00 MiB limit
4. **Billing:** Shows `$0.00` with "No billable usage incurred yet"

---

## Shared Access

- **Multiple Workers can bind to the same D1 database** — they share the same 500 MB pool
- **One Worker can bind to multiple D1 databases** — use `env.DB` and `env.PILOT_DB` simultaneously
- **Global edge network** — D1 is backed by a single Durable Object for consistency across all edges

---

## Cost Protection (Avoid Surprise Bills)

### Option 1: Stay on Free Plan (Safest)
- No credit card = no charges possible
- Hard stops at 100,000 requests/day and 5M row reads/day
- Worker returns HTTP 1015 block page when limit hit

### Option 2: WAF Rate Limiting (if on Paid)
```
Security > WAF > Rate limiting rules
If: URI Path contains /api
Rate: 100 requests per 1 minute
Action: Block
```
This drops traffic at Cloudflare's edge before it hits your Worker or queries D1.

### Option 3: Code-Level Circuit Breaker
Use Cloudflare KV to track daily usage and return HTTP 429 when limit exceeded.

---

## Hidden Cost Traps

| Trap | Why It Costs |
|------|-------------|
| Missing index | `SELECT WHERE email = ?` scans entire table = all rows counted |
| Complex JOINs | Multiplies rows during execution plan |
| Large rows | Single row > 2 MB = crash (use R2 for files) |
| Sequential queries | 50 read subrequests max per Free Worker invocation |

### Fix: Always add indexes
```sql
CREATE INDEX idx_profiles_auth0_id ON profiles(auth0_id);
CREATE INDEX idx_profiles_public_token ON profiles(public_token);
CREATE INDEX idx_credentials_user_id ON pilot_credentials(user_id);
```

---

## Worker Bindings

### `wrangler.toml`
```toml
[[d1_databases]]
binding = "DB"
database_name = "pilotrecognition-d1"
database_id = "0652ca22-adb0-4642-8658-ccc3ad74d263"

[[d1_databases]]
binding = "PILOT_DB"
database_name = "pilotrecognition-profiles"
database_id = "2a2b2862-a310-41c3-9d95-f13a85f4f6f4"
```

### Worker code
```typescript
// Platform data
const { results } = await env.DB.prepare("SELECT * FROM payments").all();

// Pilot data
const { results } = await env.PILOT_DB.prepare("SELECT * FROM profiles").all();
```

---

## Workers

| # | Worker | URL | Database | Purpose |
|---|--------|-----|----------|---------|
| 1 | **`platform-api`** | `platform-api.benjamintigerbowler.workers.dev` | `pilotrecognition-d1` | Enterprises, payments, referrals, forum, Recognition+ membership |
| 2 | **`pilot-profile-api`** | `pilot-profile-api.benjamintigerbowler.workers.dev` | `pilotrecognition-profiles` | Ordinary pilot claim data: profiles, scores, badges |
| 3 | **`pilot-public-api`** | `pilot-public-api.benjamintigerbowler.workers.dev` | `pilotrecognition-profiles` | Read-only public access: profile cards, search |
| 4 | **`recognition-plus-api`** | `recognition-plus-api.benjamintigerbowler.workers.dev` | `recognition-plus-trace` | Sensitive trace data: licenses, credentials, verification, logbook |

---

## Data Separation (Regulatory Compliance)

| Data Type | API | Database | Example Fields |
|-----------|-----|----------|----------------|
| **Ordinary claim data** | `pilot-profile-api` | `pilotrecognition-profiles` | name, email, avatar, role, nationality, pilot_stage |
| **Trace / sensitive data** | `recognition-plus-api` | `recognition-plus-trace` | license_number, medical_cert, credentials, verification_docs |
| **Commercial data** | `platform-api` | `pilotrecognition-d1` | payments, referrals, enterprise profiles, subscriptions |

> **Why this matters:** If a government authority requests data, you can cleanly separate:
> - Basic identity (pilot-profile-api)
> - Sensitive aviation records (recognition-plus-api)
> - Business transactions (platform-api)

---

## Migration Status

- ✅ 6 pilots have `public_token` in Notebook B
- ✅ Public pilot cards work: `/api/public/profile?token=pr-...`
- ✅ Pilot tables removed from Notebook A
- ✅ Four-worker architecture deployed
- ✅ Recognition+ trace database created (`recognition-plus-trace`)
- ⏳ Data migration: move trace tables from `pilotrecognition-profiles` → `recognition-plus-trace`
- ⏳ Frontend routing: update API calls to hit correct worker

---

## Public Pilot Card Example

```
https://pilot-profile-api.benjamintigerbowler.workers.dev/api/public/profile?token=pr-dea84a2e2211
```

Returns:
```json
{
  "id": "df3ddc19-1b25-422a-a770-b9471b66b022",
  "name": "benjamintigerbowler@gmail.com",
  "email": "benjamintigerbowler@gmail.com",
  "country_of_license": "GCAA (UAE)",
  "current_occupation": "Airline Pilot (ATPL)",
  "credentials": [],
  "risk_score": 0,
  "created_at": "2026-06-25T01:48:22.668Z"
}
```

---

## Links

- [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
- [Budget Alerts](https://developers.cloudflare.com/fundamentals/subscriptions-and-billing/budget-alerts/)
