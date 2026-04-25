# Flight School Referral Tracking System

A comprehensive referral tracking system for flight schools to manage pilot referrals, track commissions, and monitor analytics.

## Overview

The referral tracking system enables flight schools to:
- Generate unique referral links for pilot recruitment
- Track referral clicks, sign-ups, and completions
- Earn $20 commission per pilot who completes the program
- Manage payouts and payment methods
- View analytics and performance metrics
- Onboard new flight schools

## Database Schema

### Tables

#### `flight_schools`
Stores flight school information and referral settings.
- `id` (UUID, Primary Key)
- `name`, `slug`, `website`, `logo_url`, `description`
- Contact information (name, email, phone)
- Address fields
- School details (ICAO code, FAA certificate, school type)
- Referral settings (referral code, commission rate)
- Payment information (payout method, payout details)
- Analytics totals (total referrals, total/pending payouts)
- `is_active`, `onboarding_completed`

#### `referrals`
Tracks individual pilot referrals.
- `id` (UUID, Primary Key)
- `flight_school_id` (Foreign Key)
- Pilot information (pilot_id, pilot_email, pilot_name)
- Referral tracking (referral code, referral link, status)
- Commission (amount, status)
- Timestamps (clicked, signed up, completed, paid)
- `payout_id` (Foreign Key)

#### `payouts`
Manages payout records for flight schools.
- `id` (UUID, Primary Key)
- `flight_school_id` (Foreign Key)
- Payout details (amount, currency, status)
- Payment information (method, transaction IDs)
- Dates (processed, completed, scheduled)
- Notes and rejection reasons

#### `referral_analytics`
Aggregated analytics data for reporting.
- `id` (UUID, Primary Key)
- `flight_school_id` (Foreign Key)
- Time period (start, end, type)
- Metrics (referrals, clicks, sign-ups, conversions)
- Revenue totals (total, paid, pending commission)

#### `flight_school_admins`
Manages admin access to flight schools.
- `id` (UUID, Primary Key)
- `flight_school_id` (Foreign Key)
- `user_id` (Foreign Key)
- Role (owner, admin, viewer)

## Edge Functions

### 1. Referral Link Generator
**Endpoint:** `/functions/v1/referral-link-generator`

**Methods:**
- `POST` - Generate a new referral link for a pilot email
- `GET` - Get referral link for a flight school

**Request (POST):**
```json
{
  "flight_school_id": "uuid",
  "pilot_email": "pilot@example.com",
  "pilot_name": "John Doe",
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "referral_link": "https://pilotrecognition.com/ref/ABC123",
  "referral_code": "ABC123",
  "referral_id": "uuid",
  "flight_school": {
    "id": "uuid",
    "name": "School Name",
    "commission_rate": 20.00
  }
}
```

### 2. Referral Tracker
**Endpoint:** `/functions/v1/referral-tracker`

**Methods:**
- `POST` - Track referral actions (click, sign_up, complete)
- `GET` - Get referral info by code

**Request (POST - click):**
```json
{
  "referral_code": "ABC123",
  "action": "click",
  "pilot_email": "pilot@example.com",
  "pilot_name": "John Doe",
  "user_agent": "string",
  "ip_address": "string"
}
```

**Request (POST - sign_up):**
```json
{
  "referral_code": "ABC123",
  "action": "sign_up",
  "pilot_email": "pilot@example.com",
  "pilot_id": "uuid",
  "pilot_name": "John Doe"
}
```

**Request (POST - complete):**
```json
{
  "referral_code": "ABC123",
  "action": "complete",
  "pilot_id": "uuid"
}
```

### 3. Payout Manager
**Endpoint:** `/functions/v1/payout-manager`

**Methods:**
- `POST` - Create a new payout
- `GET` - Get payouts for a flight school

**Request (POST):**
```json
{
  "flight_school_id": "uuid",
  "amount": 200.00,
  "currency": "USD",
  "payout_method": "bank_transfer",
  "scheduled_for": "2024-01-15T00:00:00Z",
  "notes": "Monthly payout",
  "referral_ids": ["uuid1", "uuid2"],
  "metadata": {}
}
```

**Response:**
```json
{
  "success": true,
  "message": "Payout created successfully",
  "payout": { ... }
}
```

### 4. Commission Manager
**Endpoint:** `/functions/v1/commission-manager`

**Methods:**
- `POST` - Calculate, mark paid, or update commission rate
- `GET` - Get commission summary for a flight school

**Request (POST - calculate):**
```json
{
  "flight_school_id": "uuid",
  "action": "calculate"
}
```

**Request (POST - mark_paid):**
```json
{
  "flight_school_id": "uuid",
  "action": "mark_paid",
  "referral_ids": ["uuid1", "uuid2"],
  "payout_id": "uuid"
}
```

**Request (POST - update_rate):**
```json
{
  "flight_school_id": "uuid",
  "action": "update_rate",
  "commission_rate": 25.00
}
```

## React Components

### FlightSchoolAnalyticsDashboard
Analytics dashboard for flight schools to view referral performance.

**Props:**
- `flightSchoolId` (string) - The flight school ID

**Features:**
- Key metrics (total referrals, conversion rate, commission, pending payouts)
- Commission breakdown (eligible, paid, total)
- Referral status distribution (pie chart)
- Recent referrals table
- Time range filtering (7d, 30d, 90d, all)

**Usage:**
```tsx
import { FlightSchoolAnalyticsDashboard } from '@/components/referral';

<FlightSchoolAnalyticsDashboard flightSchoolId="uuid" />
```

### FlightSchoolOnboarding
Multi-step onboarding flow for new flight schools.

**Props:**
- `onComplete` (function) - Callback when onboarding completes

**Steps:**
1. School Information (name, website, description, logo)
2. Contact Information (name, email, phone)
3. Address (street, city, state, country, postal code)
4. School Details (ICAO code, FAA certificate, school type)
5. Payment Information (payout method, payment details)

**Features:**
- Step validation
- Logo upload
- Multiple payout methods (bank transfer, check, PayPal, Stripe)
- Automatic referral code generation
- Creates flight school and adds user as owner

**Usage:**
```tsx
import { FlightSchoolOnboarding } from '@/components/referral';

<FlightSchoolOnboarding 
  onComplete={(flightSchoolId) => {
    console.log('Flight school created:', flightSchoolId);
  }}
/>
```

## Commission Structure

- **Default Commission:** $20.00 per pilot
- **Commission Status Flow:** pending → eligible → processing → paid
- **Referral Status Flow:** pending → clicked → signed_up → completed → paid
- Commission becomes eligible when pilot completes the program
- Flight schools can customize their commission rate

## Security

- RLS policies enabled on all tables
- Authorization checks for all Edge Functions
- Only flight school admins and super admins can access data
- Pilot users can only view their own referral data

## Deployment

### Edge Functions
Deploy the Edge Functions using the Supabase CLI:

```bash
supabase functions deploy referral-link-generator
supabase functions deploy referral-tracker
supabase functions deploy payout-manager
supabase functions deploy commission-manager
```

### Environment Variables
Required environment variables for Edge Functions:
- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_ANON_KEY`

## API Endpoints Summary

| Function | Method | Purpose |
|----------|--------|---------|
| `referral-link-generator` | POST | Generate referral links |
| `referral-link-generator` | GET | Get school referral info |
| `referral-tracker` | POST | Track referral actions |
| `referral-tracker` | GET | Get referral by code |
| `payout-manager` | POST | Create payouts |
| `payout-manager` | GET | Get payout history |
| `commission-manager` | POST | Manage commissions |
| `commission-manager` | GET | Get commission summary |

## Testing

### Test Referral Flow
1. Create a flight school via onboarding
2. Generate a referral link
3. Simulate a click (POST to referral-tracker)
4. Simulate sign-up (POST to referral-tracker)
5. Simulate completion (POST to referral-tracker)
6. Calculate commissions (POST to commission-manager)
7. Create payout (POST to payout-manager)
8. Mark referrals as paid (POST to commission-manager)
9. Verify in analytics dashboard

## Future Enhancements

- Email notifications for referral milestones
- Automated payout scheduling
- Referral link QR code generation
- Advanced analytics with export functionality
- Multi-level referral tiers
- Seasonal commission bonuses
- Integration with Stripe Connect for payouts
