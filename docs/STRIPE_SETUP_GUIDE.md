# Stripe Subscription Billing System - Setup Guide

## Overview

This document provides instructions for setting up the Stripe subscription billing system for the PilotRecognition application.

## Prerequisites

- Stripe account (https://stripe.com)
- Supabase project access
- Node.js and npm installed

## Setup Steps

### 1. Create Stripe Products and Prices

1. Log into your Stripe Dashboard
2. Navigate to **Products** → **Add product**
3. Create two products:

**Semi-Annual Plan:**
- Name: "PilotRecognition Semi-Annual"
- Description: "6 months of premium access"
- Price: $50 USD
- Interval: Every 6 months
- Copy the Price ID (e.g., `price_xxx`)

**Annual Plan:**
- Name: "PilotRecognition Annual"
- Description: "12 months of premium access"
- Price: $100 USD
- Interval: Every year
- Copy the Price ID (e.g., `price_xxx`)

### 2. Configure Environment Variables

Add the following to your `.env.local` file:

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
STRIPE_SECRET_KEY=sk_test_your_secret_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
STRIPE_ANNUAL_PRICE_ID=price_your_annual_price_id
STRIPE_SEMI_ANNUAL_PRICE_ID=price_your_semi_annual_price_id
```

Get your keys from Stripe Dashboard → **Developers** → **API keys**

### 3. Set Up Webhook

1. In Stripe Dashboard, go to **Developers** → **Webhooks**
2. Click **Add endpoint**
3. Endpoint URL: `https://your-domain.com/api/stripe/webhook`
4. Select events to listen for:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_succeeded`
   - `invoice.payment_failed`
5. Copy the webhook signing secret and add to `STRIPE_WEBHOOK_SECRET`

### 4. Database Setup

The database schema has been created via migration. Verify the tables:

```sql
-- Check subscriptions table
SELECT * FROM public.subscriptions;
```

The migration includes:
- `subscriptions` table with RLS policies
- Indexes for performance
- Automatic timestamp updates

### 5. API Endpoints

The following API endpoints are available:

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/cancel` - Cancel subscription
- `POST /api/stripe/upgrade` - Change subscription plan

### 6. Feature Gating

Use the subscription gating system in your code:

```typescript
import { getUserSubscription, checkFeatureAccess, getFeatureLimits } from '@/lib/subscription-gating';

// Get user subscription status
const subscription = await getUserSubscription(userId);

// Check if user can access a feature
if (checkFeatureAccess(subscription, 'premium')) {
  // Allow premium feature
}

// Get feature limits
const limits = getFeatureLimits(subscription);
if (limits.maxPathways > 5) {
  // User has unlimited pathways
}
```

### 7. Subscription Dashboard Component

Use the `SubscriptionDashboard` component in your app:

```tsx
import SubscriptionDashboard from '@/components/SubscriptionDashboard';

<SubscriptionDashboard userId={user.id} />
```

## Pricing Structure

### Free Plan
- 3 career pathways
- 10 learning hours per month
- 2 mentor sessions per month
- 5 job applications per month
- Basic analytics

### Semi-Annual Plan ($50/6 months)
- Unlimited pathways
- Unlimited learning hours
- Unlimited mentor sessions
- AI career coaching
- Advanced analytics

### Annual Plan ($100/year)
- All Semi-Annual features
- Priority support
- Best value (17% discount)

## Testing

### Test Mode

Stripe provides test mode for development:
- Use test card: `4242 4242 4242 4242`
- Expiry: Any future date
- CVC: Any 3 digits
- Zip: Any 5 digits

### Test Webhooks

In Stripe Dashboard → **Webhooks** → **Select your webhook** → **Send test webhook**

## Security Notes

- Never commit `.env.local` to version control
- Use environment-specific keys (test vs production)
- Webhook signature verification is implemented
- RLS policies protect subscription data
- All API endpoints require authentication

## Production Checklist

- [ ] Switch to live Stripe API keys
- [ ] Update webhook endpoint URL to production domain
- [ ] Test checkout flow with real payment
- [ ] Verify webhook events are received
- [ ] Test subscription upgrades/downgrades
- [ ] Test cancellation flow
- [ ] Enable Stripe Radar for fraud protection
- [ ] Set up Stripe billing alerts
- [ ] Configure tax settings if applicable

## Troubleshooting

### Webhook signature verification fails
- Ensure `STRIPE_WEBHOOK_SECRET` matches the webhook secret in Stripe Dashboard
- Check that the raw body is being passed to the webhook handler

### Checkout session creation fails
- Verify `STRIPE_SECRET_KEY` is correct
- Check that price IDs are valid
- Ensure user is authenticated

### Subscription status not updating
- Check webhook endpoint is receiving events
- Verify database connection
- Check RLS policies allow updates

## Support

For issues with:
- Stripe integration: Check Stripe Documentation (https://stripe.com/docs)
- Database: Check Supabase Dashboard
- Application code: Review implementation in `/api/stripe/` and `/lib/subscription-gating.ts`
