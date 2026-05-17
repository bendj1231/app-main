# Crypto Billing — Helio Merchant of Record

## Architecture

```
[ Flight School ] ──► Pays $1,000 USDC via Helio widget
              │
              ▼
    [ HELIO SYSTEMS ] ──► Generates legal corporate invoice
              │
              ▼
    [ Fires webhook to Supabase ]
              │
              ▼
    [ account_tier flips to 'enterprise' ]
              │
              ▼
    [ Dashboard unlocks instantly ]
```

## What Helio Gives You

| Feature | Details |
|---------|---------|
| **Sign-up** | Individual developer account — no business registration |
| **Invoice** | Auto-generated corporate invoice emailed to flight school |
| **Compliance** | Helio handles tax/VAT as Merchant of Record |
| **Webhook** | Instant notification to unlock features |
| **Cost** | ~1% fee (vs Stripe's 2.9% + 0.30) |

## Setup Steps

### 1. Create Helio Account
- Go to helio.xyz
- Sign up as individual developer
- Connect your wallet (Phantom, MetaMask, etc.)
- Get your API key

### 2. Set Environment Variables

```bash
# In Supabase secrets
supabase secrets set HELIO_API_KEY=your_key
supabase secrets set HELIO_WEBHOOK_SECRET=your_webhook_secret

# Your USDC receiving wallet
# This is where Helio sends the funds
```

### 3. Configure Webhook

In Helio Dashboard:
- Webhook URL: `https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/helio-webhook`
- Event types: `payment.completed`, `payment.failed`

### 4. Deploy Edge Function

```bash
npx supabase functions deploy helio-webhook
```

## Usage in React

```tsx
import { HelioPaywall } from './components/HelioPaywall';

function EnterpriseUpgradePage() {
  const handleSuccess = (paymentId: string) => {
    console.log('Payment completed:', paymentId);
    // User will be auto-upgraded via webhook
    // Refresh page to see unlocked features
    window.location.reload();
  };

  return (
    <HelioPaywall
      amount={1000}
      recipientWallet="YOUR_USDC_WALLET_ADDRESS"
      paymentType="enterprise_monthly"
      userId={currentUser?.id}
      userEmail={currentUser?.email}
      onSuccess={handleSuccess}
    />
  );
}
```

## What the Accountant Sees

```
═══════════════════════════════════════════════════════════
  INVOICE from Helio Pay
  [Helio's registered business address]
  Tax ID: [Helio's tax ID]
───────────────────────────────────────────────────────────
  Bill To: European Flight Academy
  
  Description: Software subscription
               PilotRecognition Enterprise Access
  Amount: $1,000.00 USDC
  
  Transaction ID: helio_abc123...
  Date: May 17, 2026
───────────────────────────────────────────────────────────
```

## Comparison: Helio vs Stripe

| | Helio (Crypto) | Stripe (Traditional) |
|--|----------------|---------------------|
| Sign-up | Individual ✓ | Individual ✓ |
| Invoice | Auto-generated ✓ | Auto-generated ✓ |
| Accountant | Legal invoice ✓ | Legal invoice ✓ |
| Fee | ~1% | 2.9% + $0.30 |
| Flight school pays | USDC (crypto wallet) | Credit card / bank |
| Your payout | USDC to wallet | Bank transfer (7 days) |
| Enterprise readiness | ⚠️ Some accountants unfamiliar | ✅ Standard everywhere |

## Reality Check

**Helio works, but consider this:**

1. **Flight school crypto adoption**: Most flight school accountants have never seen a crypto invoice. They may reject it.

2. **Stripe is more familiar**: Every accountant understands "STRIPE* PILOTREC" on a statement.

3. **Best hybrid approach**:
   - **Free beta now** (SQL flip, no payments)
   - **Stripe invoices** when ready to bill (familiar to accountants)
   - **Helio as alternative** for crypto-friendly customers

## Files Created

| File | Purpose |
|------|---------|
| `src/components/HelioPaywall.tsx` | Embedded Helio payment widget |
| `supabase/functions/helio-webhook/index.ts` | Handles Helio payment webhooks |

## Recommended Path

1. **This week**: Launch free beta (SQL flip, no payments)
2. **Month 2**: Add Stripe invoicing for traditional flight schools
3. **Month 3**: Add Helio as alternative payment method

Keep it simple. Get users first. Optimize billing later.
