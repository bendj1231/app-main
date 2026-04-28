# Subscription Billing System Integration Guide

## Overview

The Stripe subscription billing system has been integrated into the PilotRecognition application. This document outlines the integration points and user journey.

## Integration Points

### 1. Main App Navigation (`index.tsx`)

**Route:** `/subscription`

The subscription page is accessible via the main app navigation system:
- Added `SubscriptionPage` component import
- Route handler: `currentPage === 'subscription'`
- Navigation: `navigateTo('subscription')`

### 2. Settings Directory (`SettingsDirectoryPage.tsx`)

**Location:** Settings → Account → Subscription & Billing

Added a menu item in the settings page:
- Icon: CreditCard
- Description: "Manage your subscription plan"
- Action: Navigates to subscription page

### 3. Portal Navigation (`portal/`)

**Location:** Portal sidebar

#### Sidebar (`Sidebar.tsx`)
- Added "Subscription" menu item to navigation
- Displays UpgradeCTA for free-tier users at bottom of sidebar
- Requires `userId` prop to function correctly

#### PilotRecognitionHome (`PilotRecognitionHome.tsx`)
- Added `subscription` to `MainView` type
- Route handler: `case 'subscription'` renders `SubscriptionDashboard`
- Passes `userProfile?.id` to Sidebar for upgrade CTAs

### 4. Components Created

#### SubscriptionPage (`components/website/components/SubscriptionPage.tsx`)
- Wrapper component for SubscriptionDashboard
- Handles authentication check
- Provides back navigation to settings
- Full-page layout with header

#### SubscriptionDashboard (`components/SubscriptionDashboard.tsx`)
- Main subscription management UI
- Displays current plan status
- Upgrade/downgrade flows
- Cancellation option
- Pricing cards for free-tier users

#### UpgradeCTA (`components/UpgradeCTA.tsx`)
- Reusable upgrade prompt component
- Three variants: card, banner, button
- Automatically checks subscription status
- Only shows for free-tier users

## User Journey

### Free Tier User

1. **Login** → User logs into the app
2. **Dashboard** → Sees upgrade CTA in portal sidebar (compact card)
3. **Click Upgrade** → Navigates to subscription page
4. **View Plans** → Sees pricing options (Semi-Annual $50, Annual $100)
5. **Select Plan** → Clicks upgrade button
6. **Stripe Checkout** → Redirected to Stripe checkout
7. **Payment** → Completes payment
8. **Return** → Redirected back to app as premium user

### Premium User

1. **Login** → User logs into the app
2. **Subscription Page** → Access via Settings → Subscription & Billing
3. **View Status** → Sees current plan, billing dates, status
4. **Manage** → Can switch plans or cancel subscription
5. **Cancel** → Cancels at period end if desired

## Navigation Paths

### From Main App
```
Home → Settings → Subscription & Billing → Subscription Page
```

### From Portal
```
Portal → Sidebar → Subscription → Subscription Dashboard
```

### Direct Navigation
```typescript
// Main app
navigateTo('subscription');

// Portal
setMainView('subscription');
```

## Environment Variables Required

```bash
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_ANNUAL_PRICE_ID=price_...
STRIPE_SEMI_ANNUAL_PRICE_ID=price_...
VITE_APP_URL=http://localhost:5173
```

## API Endpoints

- `POST /api/stripe/checkout` - Create checkout session
- `POST /api/stripe/webhook` - Handle Stripe webhooks
- `POST /api/stripe/cancel` - Cancel subscription
- `POST /api/stripe/upgrade` - Change subscription plan

## Feature Gating

Use the subscription gating system to control feature access:

```typescript
import { getUserSubscription, checkFeatureAccess } from '@/lib/subscription-gating';

// Get subscription status
const subscription = await getUserSubscription(userId);

// Check if user can access premium features
if (checkFeatureAccess(subscription, 'premium')) {
  // Allow premium feature
}
```

## Testing Checklist

- [ ] Free user sees upgrade CTA in portal sidebar
- [ ] Free user can navigate to subscription page
- [ ] Stripe checkout opens correctly
- [ ] Payment completes successfully
- [ ] Webhook updates subscription status
- [ ] Premium user sees subscription status
- [ ] Plan switching works (upgrade/downgrade)
- [ ] Cancellation flow works
- [ ] Upgrade CTA disappears for premium users

## Troubleshooting

### Upgrade CTA not showing
- Check that `userId` is passed to Sidebar component
- Verify subscription status in database
- Check browser console for errors

### Navigation not working
- Ensure route is added to navigation handler
- Check that component is imported correctly
- Verify page state matches expected value

### Stripe checkout failing
- Verify environment variables are set
- Check Stripe API keys are valid
- Ensure price IDs are correct
- Check webhook endpoint is configured

## Next Steps

1. Configure Stripe products and prices in Stripe Dashboard
2. Set up webhook endpoint in Stripe
3. Add environment variables to `.env.local`
4. Test full user journey in development
5. Deploy to production with live Stripe keys
