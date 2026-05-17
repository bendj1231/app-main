# Web Paywall — Pay-to-Access Features

## How It Works

```
[ Pilot / Flight School logs in via Auth0 ]
              │
              ▼
    [ Supabase checks account_tier ]
              │
              ├─ tier = 'free' → Show paywall
              ├─ tier = 'recognition_plus' → Show features
              └─ tier = 'enterprise' → Show everything
              │
              ▼
    [ Clicks 'Upgrade' → Stripe Checkout ]
              │
              ▼
    [ Payment complete → Stripe webhook ]
              │
              ▼
    [ Supabase updates account_tier ]
              │
              ▼
    [ Features unlock instantly ]
```

## Database Schema

### profiles.account_tier
| Tier | Features | Price |
|------|----------|-------|
| `free` | Basic profile, 2 pathway interests/month, general pool | $0 |
| `recognition_plus` | Full comparison, unlimited pathways, priority matching, badge | $100/yr |
| `enterprise` | Pull API, advanced filtering, EBT video, unlimited pulls | $1,000/mo |
| `enterprise_admin` | All enterprise + admin controls | $1,000/mo |

## Usage in React

### Wrap enterprise features with Paywall

```tsx
import { Paywall } from './components/Paywall';

function EnterpriseDashboard() {
  return (
    <Paywall
      requiredTier="enterprise"
      title="Pull API Access"
      description="Connect to our live pilot database and pull scored profiles directly into your ATS."
    >
      <PullAPIDashboard />
    </Paywall>
  );
}
```

### Wrap Recognition+ features

```tsx
function PilotProfilePage() {
  return (
    <Paywall
      requiredTier="recognition_plus"
      title="Full Profile Comparison"
    >
      <ProfileComparisonTool />
    </Paywall>
  );
}
```

### Check tier in code

```tsx
import { useAccountTier } from './hooks/useAccountTier';

function MyComponent({ userId }) {
  const { tier, isEnterprise, isRecognitionPlus, loading } = useAccountTier(userId);

  if (loading) return <div>Loading...</div>;

  if (isEnterprise) {
    return <EnterpriseView />;
  }

  if (isRecognitionPlus) {
    return <RecognitionPlusView />;
  }

  return <FreeView />;
}
```

## Webhook Flow

### Stripe Webhook Endpoint
`supabase/functions/stripe-webhook/index.ts`

Listens for:
- `checkout.session.completed` → Upgrade account_tier
- `invoice.payment_succeeded` → Keep tier active
- `invoice.payment_failed` → Downgrade to free
- `customer.subscription.deleted` → Downgrade to free

### Webhook URL
Configure in Stripe Dashboard:
```
https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/stripe-webhook
```

### Webhook Secret
Set in Supabase secrets:
```bash
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_xxx
```

## Real-Time Updates

The `useAccountTier` hook subscribes to real-time updates via Supabase's `postgres_changes` channel. When the webhook updates the profile, the UI instantly reflects the change — no page refresh needed.

## What the User Sees

### Free User → Tries to access enterprise feature
```
┌─────────────────────────────────────────────────────┐
│  [ Blurred preview of Pull API dashboard ]          │
│                                                      │
│  ┌──────────────────────────────────────────────┐   │
│  │  🔒 Enterprise Access Required                │   │
│  │                                               │   │
│  │  This feature is only available to Enterprise │   │
│  │  subscribers.                                 │   │
│  │                                               │   │
│  │  Enterprise Access Includes:                  │   │
│  │  ✓ Pull API — live pilot database access      │   │
│  │  ✓ Advanced filtering & scoring               │   │
│  │  ✓ EBT video scoring access                 │   │
│  │  ✓ Unlimited profile pulls                  │   │
│  │                                               │   │
│  │  [ Unlock Enterprise — $1,000/mo ]            │   │
│  │  [ Or $10,000/year (2 months free) ]          │   │
│  └──────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────┘
```

### After Payment
- Paywall disappears instantly
- Full dashboard is accessible
- No page refresh needed (real-time subscription)

## Security

### RLS Policies
Users can only read their own `account_tier`:
```sql
CREATE POLICY "Users can read own profile"
    ON public.profiles
    FOR SELECT TO authenticated
    USING (id::text = (auth.jwt() ->> 'sub'));
```

### Webhook Verification
The webhook function verifies the Stripe signature using `STRIPE_WEBHOOK_SECRET` to prevent spoofing.

## Files Created

| File | Purpose |
|------|---------|
| `supabase/functions/stripe-webhook/index.ts` | Handles Stripe webhooks, updates account_tier |
| `src/hooks/useAccountTier.ts` | React hook for checking tier with real-time updates |
| `src/components/Paywall.tsx` | Paywall overlay component |

## Next Steps

1. ✅ Database: `account_tier` column added
2. ✅ Webhook handler: `stripe-webhook` edge function created
3. ✅ React hook: `useAccountTier` with real-time subscription
4. ✅ Paywall component: `<Paywall>` with blurred preview
5. ⬜ Deploy webhook: `npx supabase functions deploy stripe-webhook`
6. ⬜ Configure Stripe webhook endpoint in Dashboard
7. ⬜ Wrap enterprise features with `<Paywall requiredTier="enterprise">`
8. ⬜ Wrap Recognition+ features with `<Paywall requiredTier="recognition_plus">`
