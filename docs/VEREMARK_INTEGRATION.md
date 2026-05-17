# Veremark Integration — Credential Verification Flow

## Complete Workflow

```
[ PILOT SIGNS UP ]
      │
      ▼
[ TermsAcceptance ]
  ├─ Pilot clicks checkbox: "I authorize Veremark to verify my credentials"
  ├─ Consent recorded: verification_consent_given = true
  └─ Timestamp: verification_consent_timestamp = now()
      │
      ▼
[ PILOT PAYS $100 USDC FOR VERIFICATION ]
      │
      ▼
[ Helio splits payment ]
  ├─ 23% → Veremark
  ├─ 5% → Logbook Provider  
  ├─ 5% → ATO (if subscribed)
  └─ 67-72% → Platform
      │
      ▼
[ payment-splitter edge function ]
  ├─ Records split in payment_splits table
  ├─ Triggers Veremark API call
  └─ Creates verification case with pilot metadata
      │
      ▼
[ VEREMARK PROCESSES VERIFICATION ]
  ├─ Veremark generates Letter of Authorization (LoA)
  ├─ Veremark contacts ATO with LoA + pilot consent proof
  ├─ ATO verifies: "Yes, 1,500 hours confirmed"
  └─ Veremark updates case status
      │
      ▼
[ VEREMARK WEBHOOK FIRES ]
  ├─ check.started → veremark_status = 'in_progress'
  ├─ check.completed → veremark_status = 'verified'
  └─ check.expired → veremark_status = 'expired'
      │
      ▼
[ PILOT PROFILE UPDATED ]
  ├─ veremark_status = 'verified'
  ├─ Verified badge appears on profile
  └─ Airlines see "✓ Verified" in pull API
```

## What the ATO Sees

When Veremark contacts the flight school:

```
═══════════════════════════════════════════════════════════
FROM: Veremark Pte. Ltd.
RE: Professional Credential Verification

Dear Registrar,

[ Pilot Name ] has authorized us to verify their aviation
credentials with your institution.

PURPOSE: Pre-employment background check for
         pilotrecognition.com profile

CONSENT: Electronic consent provided on [Date] via
         Auth0 secure authentication.
         Reference: VERE-LOA-auth0|xxx-20260517

PLEASE CONFIRM:
□ License Type: [CPL] — Confirmed / Discrepancy / Not Found
□ Flight Hours: [1,500] — Confirmed / Discrepancy / Not Found  
□ Medical: [Class 1, Exp: 2027-05-02] — Confirmed / Discrepancy
□ Type Ratings: [A320] — Confirmed / Discrepancy / Not Found

Your institution is legally protected to confirm these
records under the pilot's explicit consent (Data Privacy
Act of 2012 / GDPR Article 6(1)(a)).

RESPOND: verification@veremark.com
═══════════════════════════════════════════════════════════
```

## Database Schema

### profiles table (updated)
| Column | Type | Description |
|--------|------|-------------|
| verification_consent_given | boolean | Pilot authorized verification |
| verification_consent_timestamp | timestamptz | When consent was recorded |
| veremark_verification_id | text | External Veremark case ID |
| veremark_status | text | not_started → pending → in_progress → verified |
| veremark_checked_at | timestamptz | Last verification update |

### veremark_webhook_logs table
| Column | Type | Description |
|--------|------|-------------|
| pilot_id | uuid | FK to profiles |
| veremark_check_id | text | Veremark case ID |
| event_type | text | check.started, check.completed, etc. |
| status | text | Current status from webhook |
| payload | jsonb | Full webhook payload |
| processed_at | timestamptz | When we received it |

## Webhook Events Handled

| Event | Action | Profile Update |
|-------|--------|----------------|
| check.started | Log + update | veremark_status = 'in_progress' |
| check.completed | Log + update | veremark_status = 'verified' / 'discrepancy' |
| check.expired | Log + update | veremark_status = 'expired' |
| check.cancelled | Log + update | veremark_status = 'not_started' |

## Frontend — Showing Verification Status

```tsx
import { useAccountTier } from './hooks/useAccountTier';

function PilotProfile({ userId }) {
  const { tier } = useAccountTier(userId);
  
  return (
    <div>
      {profile.veremark_status === 'verified' && (
        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-bold">
          ✓ Veremark Verified
        </span>
      )}
      {profile.veremark_status === 'in_progress' && (
        <span className="bg-amber-100 text-amber-800 px-2 py-1 rounded-full text-xs font-bold">
          ⏳ Verification in Progress
        </span>
      )}
      {profile.veremark_status === 'not_started' && (
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm">
          Verify Credentials ($100)
        </button>
      )}
    </div>
  );
}
```

## API — Trigger Verification Manually

```bash
curl -X POST https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/payment-splitter \
  -H "Content-Type: application/json" \
  -d '{
    "pilotId": "auth0|6647b19a...",
    "amount": 100,
    "paymentId": "helio_xxx",
    "paymentProvider": "helio",
    "metadata": {
      "ato_id": "ato_uuid",
      "ato_is_paid": true
    }
  }'
```

## Setup Checklist

- [x] TermsAcceptance includes Veremark authorization clause
- [x] Database has verification_consent columns
- [x] veremark_webhook_logs table for audit trail
- [x] veremark-webhook edge function handles status updates
- [x] payment-splitter triggers Veremark API call
- [x] Letter of Authorization template ready
- [ ] Set VEREMARK_WEBHOOK_SECRET in Supabase secrets
- [ ] Configure Veremark webhook URL in Veremark dashboard
- [ ] Deploy veremark-webhook edge function

## Files Created

| File | Purpose |
|------|---------|
| `docs/LETTER_OF_AUTHORIZATION.md` | Template for ATO contact |
| `supabase/functions/veremark-webhook/index.ts` | Receives Veremark status updates |
| `docs/VEREMARK_INTEGRATION.md` | This documentation |
