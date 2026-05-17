# Held Commissions — Viral ATO Incentive System

## How It Works

When a pilot pays for verification, the ATO's 5% commission is held in escrow until the ATO subscribes to Enterprise.

```
[ Pilot pays $100 USDC ]
              │
              ▼
    [ payment-splitter checks ATO status ]
              │
              ├─ ATO is enterprise → 5% released directly
              │
              └─ ATO NOT enterprise → 5% HELD IN ESCROW
                                          │
                                          ▼
                              [ held_commissions table ]
                                          │
                                          ▼
                              [ ATO gets outreach email ]
                                          │
                                          ▼
                              [ ATO subscribes $1,000/yr ]
                                          │
                                          ▼
                              [ release-ato-commissions fires ]
                                          │
                                          ▼
                              [ Held commissions released to ATO wallet ]
```

## Split Logic

| ATO Status | Veremark | Logbook | ATO | Platform |
|------------|----------|---------|-----|----------|
| **Subscribed** | 23% | 5% | **5% released** | 67% |
| **Not Subscribed** | 23% | 5% | **5% held** | 67% |

**Key difference:** Platform ALWAYS gets 67%. ATO share is held separately, not absorbed.

## Database

### held_commissions table

| Column | Type | Description |
|--------|------|-------------|
| ato_enterprise_account_id | uuid | Which ATO owns this commission |
| pilot_id | uuid | Which pilot triggered the check |
| payment_id | text | Original payment reference |
| amount | numeric | $5.00 USDC |
| status | text | held → released → claimed → expired |
| held_at | timestamptz | When commission was held |
| released_at | timestamptz | When released to ATO |

### ato_pending_commissions view

Shows total held per ATO for sales outreach:

```sql
SELECT 
    ato_enterprise_account_id,
    COUNT(*) as total_checks,
    SUM(amount) as total_held_usdc
FROM held_commissions
WHERE status = 'held'
GROUP BY ato_enterprise_account_id;
```

## API Endpoints

### 1. Record Split (automatic)

When Helio payment succeeds:

```bash
POST /api/payment-splitter
{
  "pilotId": "...",
  "amount": 100,
  "paymentId": "helio_xxx",
  "paymentProvider": "helio"
}
```

Response:
```json
{
  "splits": { ... },
  "atoEscrow": {
    "held": true,
    "amount": 5.00,
    "message": "ATO commission held in escrow. Subscribe to claim."
  }
}
```

### 2. Release Commissions (manual or auto)

When ATO subscribes:

```bash
POST /api/release-ato-commissions
{
  "atoId": "ato_uuid"
}
```

Response:
```json
{
  "success": true,
  "totalReleased": 125.00,
  "commissionCount": 25,
  "message": "Released 25 commissions totaling $125.00 USDC"
}
```

## Automatic Triggers

1. **Stripe webhook** → When ATO pays $1,000/yr, auto-triggers release
2. **Manual dashboard** → ATO clicks "Claim Commissions" in Enterprise Dashboard
3. **Scheduled job** → Daily check for ATOs with held commissions (email reminder)

## Frontend

### Show pending commissions to ATO

```tsx
import { ATOPendingCommissions } from './components/ATOPendingCommissions';

<ATOPendingCommissions atoId={ato.id} />
```

### What the ATO sees

```
┌─────────────────────────────────────────────────────────┐
│  🎉 Pending Commissions                                    │
│  25 verification checks from your pilots                │
│                                                          │
│  $125.00 USDC held in escrow                            │
│                                                          │
│  [ Release to My Wallet ]                               │
│                                                          │
│  Subscribe to Enterprise ($1,000/yr) to claim.          │
└─────────────────────────────────────────────────────────┘
```

## Outreach Flow

### Step 1: Veremark contacts ATO

> "We verified [Pilot Name]'s credentials. You have $5.00 USDC in pending commissions. 
> Subscribe at pilotrecognition.com/enterprise to claim."

### Step 2: ATO receives email

See `docs/ATO_OUTREACH_EMAIL.md` for full template.

### Step 3: ATO subscribes

- Pays $1,000/yr
- Enters wallet address
- Commissions auto-release within 24 hours

### Step 4: Viral loop

- ATO tells other ATOs about free money
- More ATOs subscribe
- More pilots get verified
- More commissions generated

## ROI Calculation for ATO

| Metric | Value |
|--------|-------|
| Subscription cost | $1,000/year |
| Commission per verification | $5.00 |
| Pilots trained/year | 200 |
| Verification rate | 50% (100 checks) |
| **Annual commissions** | **$500** |
| **Net cost** | **$500/year** |

At 400 verifications/year, ATO profits $1,000 — subscription pays for itself.

## Files Created

| File | Purpose |
|------|---------|
| `supabase/functions/payment-splitter/index.ts` | Holds ATO commission in escrow |
| `supabase/functions/release-ato-commissions/index.ts` | Releases held commissions |
| `src/components/ATOPendingCommissions.tsx` | ATO dashboard widget |
| `docs/ATO_OUTREACH_EMAIL.md` | Email/SMS/WhatsApp templates |
| `docs/HELD_COMMISSIONS.md` | This documentation |

## Setup

1. Deploy `payment-splitter` edge function
2. Deploy `release-ato-commissions` edge function
3. Set `ATO_WALLET` environment variable
4. Configure Stripe webhook to auto-release on subscription
5. Add `<ATOPendingCommissions />` to Enterprise Dashboard

---

**This is a self-sustaining growth loop. ATOs subscribe to claim free money. Pilots get verified. You get paid. Everyone wins.**
