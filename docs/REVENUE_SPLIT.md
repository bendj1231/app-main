# Revenue Split — Automatic On-Chain Distribution

## How It Works

When a flight school pays $100 USDC for a pilot verification check:

```
[ Flight School pays $100 USDC ]
              │
              ▼
    [ Payment received by Platform ]
              │
              ├──► $23.00 → Veremark (23%)
              │      Background check fee
              │
              ├──► $5.00 → Logbook Provider (5%)
              │      Tokenized flight hour data
              │
              ├──► $5.00 → ATO / Operator (5%)
              │      Profile validation & endorsement
              │
              └──► $67.00 → Platform (~67%)
                     Minus ~1% Helio fee
                     Net: ~$66.00
```

## Split Configuration

| Recipient | % | Role |
|-----------|---|------|
| Veremark | 23% | Official credential verification |
| Logbook Provider | 5% | Flight hour tokenization |
| ATO/Operator | 5% | Training organization validation |
| Platform (You) | 67% | Software, matching, infrastructure |

## Why This Protects You

**You never hold other people's money.**

The payment splits **before** it reaches your wallet. You only ever receive your $66 share. You are not:
- Acting as a money transmitter
- Holding funds for partners
- Responsible for partner payouts

## Technical Flow

```
[ Helio Checkout ]
       │
       ▼
[ payment-splitter edge function ]
       │
       ├── Records split in payment_splits table
       ├── Triggers on-chain transfers (future)
       └── Logs audit trail
```

## Database

`payment_splits` table tracks every split:
- `payment_id` — Helio transaction ID
- `total_amount` — $100
- `splits` — JSON array of recipients
- `status` — pending → completed

## Environment Variables

```bash
# Set these in Supabase secrets
supabase secrets set VEREMARK_WALLET=0x...
supabase secrets set LOGBOOK_WALLET=0x...
supabase secrets set ATO_WALLET=0x...
supabase secrets set PLATFORM_WALLET=0x...
```

## Frontend

Show the split before payment:

```tsx
import { RevenueShare } from './components/RevenueShare';

<RevenueShare
  amount={100}
  onConfirm={() => setShowHelio(true)}
/>
```

## Edge Function

Call after Helio payment succeeds:

```ts
fetch('/api/payment-splitter', {
  method: 'POST',
  body: JSON.stringify({
    pilotId: '...',
    amount: 100,
    paymentId: 'helio_xxx',
    paymentProvider: 'helio',
  }),
});
```

## Future: Smart Contract Split

For fully automated splits, deploy a Solana/Ethereum smart contract:
- Receives full payment
- Automatically distributes to 4 wallets
- No manual intervention
- Fully transparent on-chain

## Files

| File | Purpose |
|------|---------|
| `supabase/functions/payment-splitter/index.ts` | Records and tracks splits |
| `src/components/RevenueShare.tsx` | Visual split breakdown |
| `src/components/HelioPaywall.tsx` | Crypto payment widget |
