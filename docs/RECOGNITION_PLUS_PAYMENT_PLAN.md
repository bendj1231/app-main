# Recognition+ Payment System & Workflow Plan

## Overview
Recognition+ is the $99/year premium tier that unlocks full VC credential chain (CAAP/FAA + medical + type ratings + ELP) with Terminal 3 status. Payment triggers the verification workflow with automatic revenue splits.

---

## 1. Payment Architecture

### Primary Gateway: Xendit XenPlatform (Philippines)
**Why Xendit:**
- Native GCash/Maya support
- Automatic split payouts via API
- BSP/AMLA compliance shielding
- 2.3% transaction fee
- Next-day settlement

### Revenue Split Model

| Party | Percentage | Amount (on $99) | Destination |
|-------|-----------|-----------------|-------------|
| **Platform** | 67% | ~$65 | Platform account |
| **Veremark** | 23% | $23 | Veremark sub-account |
| **Logbook Provider** | 5% | $5 | Provider wallet (if applicable) |
| **ATO Activation Credit** | 5% | $5 | Time-limited credit for ATOs |

**Note:** If ATO credit lapses (5 days unclaimed), platform captures extra 5% = 72% total.

### Xendit API Structure
```json
{
  "external_id": "recognition_plus_{{user_id}}_{{timestamp}}",
  "amount": 4950,
  "currency": "PHP",
  "payment_method": "GCASH",
  "description": "Recognition+ Annual Subscription",
  "customer": {
    "given_names": "{{user_first_name}}",
    "surname": "{{user_last_name}}",
    "email": "{{user_email}}",
    "mobile_number": "{{user_phone}}"
  },
  "split_rule": {
    "type": "percentage",
    "splits": [
      {
        "recipient_id": "acc_platform_main",
        "percentage": 67
      },
      {
        "recipient_id": "acc_veremark_ph",
        "percentage": 23
      },
      {
        "recipient_id": "acc_logbook_provider",
        "percentage": 5
      },
      {
        "recipient_id": "acc_ato_credits_pool",
        "percentage": 5
      }
    ]
  },
  "metadata": {
    "user_id": "{{supabase_user_id}}",
    "tier": "recognition_plus",
    "verification_type": "full_credential_chain",
    "ato_referral_code": "{{optional_ato_code}}"
  }
}
```

---

## 2. Database Schema Updates

### New Tables

```sql
-- Recognition+ subscriptions tracking
CREATE TABLE recognition_plus_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) NOT NULL,
  xendit_transaction_id VARCHAR(255),
  xendit_external_id VARCHAR(255) UNIQUE,
  amount_php INTEGER NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, paid, failed, refunded
  payment_method VARCHAR(50), -- gcash, maya, card
  paid_at TIMESTAMP WITH TIME ZONE,
  expires_at TIMESTAMP WITH TIME ZONE, -- 1 year from paid_at
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Revenue splits tracking
CREATE TABLE revenue_splits (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID REFERENCES recognition_plus_subscriptions(id),
  recipient_type VARCHAR(50) NOT NULL, -- platform, veremark, logbook_provider, ato_credit
  percentage DECIMAL(5,2) NOT NULL,
  amount_php INTEGER NOT NULL,
  amount_usd DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending', -- pending, transferred, failed
  transferred_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ATO activation credits (existing table, usage tracking)
ALTER TABLE ato_activation_credits ADD COLUMN IF NOT EXISTS 
  recognition_plus_trigger_id UUID REFERENCES recognition_plus_subscriptions(id);
```

### RLS Policies
```sql
-- Users can only see their own subscriptions
CREATE POLICY "Users view own subscriptions"
  ON recognition_plus_subscriptions FOR SELECT
  USING (auth.uid() = user_id);

-- Only service role can insert/update
CREATE POLICY "Service role manages subscriptions"
  ON recognition_plus_subscriptions FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- Revenue splits - admin only
CREATE POLICY "Admin view revenue splits"
  ON revenue_splits FOR SELECT
  USING (auth.jwt() ->> 'role' IN ('service_role', 'admin'));
```

---

## 3. User Workflow: Payment → VC Issuance

### Phase 1: Checkout Initiation
```
[User clicks "Get Recognition+"]
  │
  ▼
[Frontend: Xendit Checkout Widget loads]
  │
  ▼
[User enters GCash number / selects payment method]
  │
  ▼
[POST /api/create-recognition-plus-session]
  ├── Create pending subscription record
  ├── Generate Xendit invoice/ewallet charge
  ├── Store xendit_external_id for webhook matching
  └── Return: Xendit checkout URL / ewallet payload
```

### Phase 2: Payment Processing
```
[User authenticates on GCash app (MPIN/OTP)]
  │
  ▼
[GCash confirms payment]
  │
  ▼
[Xendit executes automatic split: 67% + 23% + 5% + 5%]
  │
  ▼
[Xendit webhook → Supabase Edge Function: payment-success]
  ├── Verify webhook signature (Xendit callback token)
  ├── Update subscription status: 'paid'
  ├── Set expires_at = NOW() + 1 year
  ├── Flip profiles.account_tier = 'recognition_plus'
  ├── Insert revenue split records
  ├── Create ATO activation credit (if referral code present)
  └── Trigger: POST to Veremark verification endpoint
```

### Phase 3: Verification Trigger
```
[Edge Function: trigger-veremark-verification]
  │
  ▼
[POST https://api.veremark.com/external/v1/checks]
  ├── Headers: Authorization: Bearer {{VEREMARK_API_KEY}}
  ├── Body: {
  │     "candidate": {
  │       "first_name": "{{user.first_name}}",
  │       "last_name": "{{user.last_name}}",
  │       "email": "{{user.email}}",
  │       "phone": "{{user.phone}}"
  │     },
  │     "checks": [
  │       { "type": "caap_license", "pel_number": "{{user.license_number}}" },
  │       { "type": "caap_medical", "pel_number": "{{user.license_number}}" },
  │       { "type": "elp_verification", "pel_number": "{{user.license_number}}" }
  │     ],
  │     "callback_url": "https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/veremark-webhook",
  │     "client_reference": "{{subscription_id}}"
  │   }
  │
  ▼
[Store: veremark_check_id, status = 'initiated']
```

### Phase 4: Direct Document Upload (Zero Platform Storage)
```
[User redirected to Verification Page]
  │
  ▼
[Frontend loads: Veremark-hosted iframe OR secure upload session]
  │
  ▼
[User uploads documents DIRECTLY to Veremark]
  │
  ▼
[Platform servers NEVER touch: License scans, Medical certs, ID photos]
  │
  ▼
[Veremark processes verification → issues webhook on completion]
```

### Phase 5: Webhook → VC Issuance
```
[Veremark webhook → Supabase Edge Function: veremark-webhook]
  │
  ▼
[Parse webhook payload]
  ├── check_type: 'caap_license' | 'caap_medical' | 'elp_verification'
  ├── status: 'completed' | 'failed' | 'flagged'
  ├── result_data: { license_number, expiry_date, ratings, limitations }
  │
  ▼
[If all checks 'completed':]
  ├── Update pilot_credentials.status = 'Verified'
  ├── Update profiles.verified_account = true
  ├── Generate W3C Verifiable Credentials (via vcBuilder.ts)
  │   ├── VC 1: Commercial Pilot License
  │   ├── VC 2: Class 1 Medical Certificate  
  │   └── VC 3: ELP Certification
  ├── Sign VCs with platform DID (did:key:...)
  ├── Push VCs to user's wallet (lib/wallet/storage.ts)
  ├── Update wallet tier: Terminal 3 (green)
  └── Send notification: "Your credentials are verified and in your wallet"
  │
  ▼
[If any check 'failed' or 'expired':]
  ├── Update pilot_credentials.status = 'Revoked' | 'Expired'
  ├── Wallet tier: Terminal 1 (red) or Terminal 2 (amber)
  └── Trigger TTL zero-out of Terminal 3 token
```

---

## 4. Edge Functions Required

### 1. `create-recognition-plus-session`
**Purpose:** Initialize checkout session
**Trigger:** Frontend POST on "Get Recognition+" click
**Logic:**
- Validate user auth
- Check for existing active subscription
- Create pending subscription record
- Call Xendit API to create ewallet charge
- Return checkout URL/payload

### 2. `xendit-webhook-handler`
**Purpose:** Handle payment confirmations
**Trigger:** Xendit POST webhook
**Logic:**
- Verify Xendit callback token (security)
- Match external_id to subscription
- Update subscription status to 'paid'
- Execute revenue split inserts
- Trigger Veremark verification
- Flip user tier to 'recognition_plus'

### 3. `trigger-veremark-verification`
**Purpose:** Initiate verification checks
**Trigger:** Called internally from xendit-webhook-handler OR manual retry
**Logic:**
- Call Veremark API to start checks
- Store check IDs for tracking
- Handle API errors with retry queue

### 4. `veremark-webhook` (existing, needs update)
**Purpose:** Handle verification results
**Trigger:** Veremark POST webhook
**Logic:**
- Parse check results
- Update credential records
- Generate and issue VCs
- Update wallet tier status
- Handle revocation/expiry flows

### 5. `recognition-plus-status`
**Purpose:** Check subscription status
**Trigger:** Frontend GET on wallet page load
**Logic:**
- Return active/inactive status
- Return expiration date
- Return verification progress

---

## 5. Frontend Components

### New Components

```typescript
// components/payment/RecognitionPlusCheckout.tsx
interface Props {
  userId: string;
  onSuccess: (subscription: RecognitionPlusSubscription) => void;
  onError: (error: Error) => void;
}

// components/payment/GCashPaymentWidget.tsx
interface Props {
  amount: number; // in PHP
  externalId: string;
  onPaymentInitiated: (chargeId: string) => void;
}

// components/verification/VeremarkUploadPortal.tsx
interface Props {
  checkId: string;
  onUploadComplete: () => void;
}
// Note: This is a redirect wrapper to Veremark's hosted interface
// Platform never handles actual document bytes

// components/wallet/TerminalStatusBadge.tsx
interface Props {
  tier: 'terminal_1' | 'terminal_2' | 'terminal_3';
  drift: number; // 0-100%
  lastPoll: Date;
}
```

### Updated Components

```typescript
// components/wallet/WalletDashboard.tsx
// Add: Recognition+ upsell banner for free tier users
// Add: Expiration countdown for active subscribers
// Add: "Renew" button for expired subscriptions
```

---

## 6. ATO Activation Credits Flow

### Trigger Conditions
When user pays with ATO referral code in metadata:

```
[payment-success webhook]
  │
  ▼
[Check: metadata.ato_referral_code exists?]
  │
  ▼ YES
[Query: SELECT id FROM profiles WHERE referral_code = {{ato_referral_code}} AND account_tier = 'enterprise']
  │
  ▼
[Insert: ato_activation_credits]
  ├── ato_id: {{enterprise_profile_id}}
  ├── amount: 5% of transaction (PHP 248 on ₱4950)
  ├── triggered_by: {{user_id}}
  ├── status: 'pending'
  └── expires_at: NOW() + INTERVAL '5 days'
  │
  ▼
[Send notification to ATO:]
  Subject: "New Member Activation Credit: ₱248.00 Available — 5 Days to Claim"
  Action: Link to Enterprise signup with credit applied
```

### Claim Flow
```
[ATO clicks claim link / signs up for Enterprise]
  │
  ▼
[POST /api/claim-ato-credit]
  ├── Verify credit not expired
  ├── Update credit status: 'claimed'
  ├── Apply ₱248 credit to Enterprise subscription
  └── Mark credit as consumed
```

### Lapse Flow
```
[Cron job: activation-credit-expiry (existing)]
  │
  ▼
[Find credits where expires_at < NOW() AND status = 'pending']
  │
  ▼
[Update status: 'lapsed']
[Platform captures lapsed amount (revenue adjustment)]
```

---

## 7. Security & Compliance

### Webhook Security
```typescript
// Xendit webhook verification
const verifyXenditWebhook = (payload: string, signature: string): boolean => {
  const expectedSignature = crypto
    .createHmac('sha256', XENDIT_WEBHOOK_SECRET)
    .update(payload)
    .digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
};

// Veremark webhook verification (existing pattern)
const verifyVeremarkWebhook = (payload: string, signature: string): boolean => {
  // Use existing verification logic from veremark-webhook edge function
};
```

### Data Privacy (Zero-Storage Architecture)
- **Platform never stores:** License photos, medical certificates, ID scans
- **Veremark stores:** Raw documents for processing (their compliance scope)
- **Platform stores:** VC hashes, verification status, credential metadata
- **Wallet stores:** Encrypted VCs (user-controlled, IndexedDB + HSM enclave)

### Audit Trail
```sql
-- All subscription events logged
CREATE TABLE recognition_plus_audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  subscription_id UUID,
  event_type VARCHAR(100), -- payment_initiated, payment_success, verification_triggered, vc_issued, tier_upgraded
  event_data JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

---

## 8. Implementation Phases

### Phase 1: Core Payment (Week 1)
- [ ] Xendit account setup + KYB completion
- [ ] Database migrations (subscriptions, revenue_splits)
- [ ] `create-recognition-plus-session` edge function
- [ ] `xendit-webhook-handler` edge function
- [ ] GCash checkout widget component
- [ ] Basic tier flipping logic

### Phase 2: Verification Integration (Week 2)
- [ ] Veremark API integration (test mode)
- [ ] `trigger-veremark-verification` edge function
- [ ] Update `veremark-webhook` handler
- [ ] Direct upload portal (iframe redirect)
- [ ] VC generation on verification success
- [ ] Wallet tier status updates

### Phase 3: ATO Credits (Week 3)
- [ ] Referral code system in checkout
- [ ] ATO credit creation on payment
- [ ] Credit claim flow
- [ ] Notification system for ATOs
- [ ] Lapse handling + revenue reconciliation

### Phase 4: Wallet Integration (Week 4)
- [ ] Wallet dashboard updates (Recognition+ status)
- [ ] Terminal status badges
- [ ] Expiration reminders
- [ ] Renewal flow
- [ ] Drift gauge integration

### Phase 5: Testing & Launch (Week 5)
- [ ] End-to-end testing with test GCash accounts
- [ ] Veremark sandbox verification flow
- [ ] Load testing (webhook handling)
- [ ] Production Xendit switch
- [ ] Production Veremark switch
- [ ] Monitor + alerts setup

---

## 9. API Endpoints Summary

| Endpoint | Method | Auth | Description |
|----------|--------|------|-------------|
| `/api/create-recognition-plus-session` | POST | JWT | Initialize checkout |
| `/api/recognition-plus-status` | GET | JWT | Check subscription status |
| `/api/xendit-webhook` | POST | None (IP whitelist) | Payment confirmations |
| `/api/veremark-webhook` | POST | HMAC signature | Verification results |
| `/api/trigger-verification` | POST | Service Role | Manual retry trigger |
| `/api/claim-ato-credit` | POST | JWT (Enterprise only) | Claim activation credit |

---

## 10. Success Metrics

- **Conversion Rate:** % of Terminal 2 users upgrading to Recognition+
- **Payment Success Rate:** % of GCash transactions completing
- **Verification Completion Time:** Median time from payment → VC issuance
- **ATO Credit Claim Rate:** % of credits claimed vs. lapsed
- **Revenue per User:** Average split distribution
- **Chargeback Rate:** < 0.5% target

---

## Dependencies

- Xendit PH account (business registration required)
- Veremark API credentials
- Supabase project: `gkbhgrozrzhalnjherfu`
- Existing wallet infrastructure (`lib/wallet/*`)
- Existing VC builder (`lib/wallet/vcBuilder.ts`)

---

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| Xendit account freeze | Maintain clean KYB docs, low chargeback rate |
| Veremark webhook delay | Implement retry queue with exponential backoff |
| GCash payment failures | Offer Maya/card fallback options |
| Verification bottleneck | Set user expectations (7-14 days in UI) |
| ATO credit fraud | Validate referral codes, limit claims per ATO |
| Credential expiry | Implement 60-day renewal reminders |

---

*Plan created: May 27, 2026*
*Target launch: Phase 1 ready within 1 week*
