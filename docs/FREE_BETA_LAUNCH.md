# Free Beta Launch — $0 Path to Live

## The Strategy

Give flight schools **3 months free Enterprise access**. No payments. No registration. No legal exposure.

You manually flip their account to `enterprise` in Supabase. They test the platform. Once they love it and ask to keep it, you introduce pricing.

## How to Upgrade a Flight School (30 seconds)

### Step 1: Flight school creates a free account
They sign up on your site via Auth0. Gets a free account automatically.

### Step 2: You run one SQL command
Go to Supabase Dashboard → SQL Editor. Run:

```sql
UPDATE public.profiles
SET 
    account_tier = 'enterprise',
    account_tier_updated_at = now(),
    updated_by = 'admin_free_beta'
WHERE email = 'finance@europeanflightacademy.com';
```

Replace the email with the flight school's actual email.

Done. They instantly have enterprise features.

### Step 3: Check all beta accounts

```sql
SELECT 
    email, 
    display_name, 
    account_tier, 
    account_tier_updated_at,
    status
FROM public.profiles
WHERE account_tier = 'enterprise'
ORDER BY account_tier_updated_at DESC;
```

## What to Tell Flight Schools

> "We're offering 3 months of free Enterprise Beta access to select flight schools. You'll get full Pull API access, unlimited pilot profile pulls, and advanced filtering. No commitment. After 3 months, if you want to continue, it's $1,000/month. If not, your account reverts to free."

## Why This Works

| Problem | Free Beta Solution |
|---------|-------------------|
| No business registration | No money changing hands = no tax liability |
| No corporate bank account | No payments to process |
| No accountant compliance | Free trial = no invoice needed |
| Payment processor holds funds | No processor involved |
| Legal liability | Zero revenue = zero exposure |

## After Beta Ends (Month 4)

Flight school wants to keep it → **Now** you:
1. Collect their commitment (email saying "we want to continue")
2. Use that commitment to fund a quick DTI registration (₱1,500)
3. Set up Stripe and start billing
4. They pay the first $1,000 → you use that to register properly

## Current Status

Your database is ready. The `account_tier` column exists. The `<Paywall>` component blocks enterprise features for free users. All you need is that one SQL command per flight school.

## Files Ready

- `src/components/Paywall.tsx` — Shows "Enterprise Access Required" with upgrade button
- `src/hooks/useAccountTier.ts` — Checks if user has enterprise access
- `supabase/functions/stripe-webhook/index.ts` — Will auto-upgrade accounts when you start taking payments

## Next Action

1. Find your first flight school contact
2. Have them create a free account on pilotrecognition.com
3. Get their email
4. Run the SQL above
5. Tell them they're in the beta

That's it. No more setup. No more costs.
