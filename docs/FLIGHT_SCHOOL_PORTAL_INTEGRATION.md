# Flight School Portal Integration

This document describes the integration of the referral tracking system into the enterprise portal for flight school partners.

## Overview

Flight schools can now sign up through the enterprise portal and access a dedicated referral dashboard to:
- Generate and share referral links
- Track pilot referrals through the signup process
- Monitor commission earnings
- Manage payouts
- Access marketing materials
- View performance analytics

## Components Created

### 1. FlightSchoolOnboarding (`components/referral/FlightSchoolOnboarding.tsx`)

A 5-step onboarding flow for new flight schools:
- Step 1: School Information (name, website, description, logo)
- Step 2: Contact Information (name, email, phone)
- Step 3: Address (street, city, state, country, postal code)
- Step 4: School Details (ICAO code, FAA certificate, school type)
- Step 5: Payment Information (payout method, payment details)

**Usage:**
```tsx
import { FlightSchoolOnboarding } from '@/components/referral';

<FlightSchoolOnboarding 
  onComplete={(flightSchoolId) => {
    console.log('Flight school created:', flightSchoolId);
  }}
/>
```

### 2. FlightSchoolPortal (`components/enterprise/FlightSchoolPortal.tsx`)

A comprehensive dashboard for flight school partners with the following tabs:

#### Overview Tab
- Displays FlightSchoolAnalyticsDashboard
- Key metrics (total referrals, completed, pending commission, total paid)
- Referral link card with copy and test buttons

#### Referrals Tab
- List of all referrals with status badges
- Add new referral button (opens modal)
- Pilot email, status, commission, date columns

#### Payouts Tab
- Payout history table
- Status badges (pending, processing, completed, failed, cancelled)
- Amount, method, date columns

#### Marketing Tab
- Email template (copy to clipboard)
- Social media post template (copy to clipboard)
- QR code generator (opens new tab)
- Referral card download (placeholder)

#### Pilots Tab
- Placeholder for pilot management features
- Coming soon

#### Settings Tab
- Commission rate display (read-only)
- Payout method display (read-only)
- Contact support button

**Usage:**
```tsx
import { FlightSchoolPortal } from '@/components/enterprise';

<FlightSchoolPortal flightSchoolId="uuid" user={user} />
```

### 3. FlightSchoolAnalyticsDashboard (`components/referral/FlightSchoolAnalyticsDashboard.tsx`)

Analytics dashboard component with:
- Key metrics cards (total referrals, conversion rate, commission, pending payouts)
- Commission breakdown (eligible, paid, total)
- Referral status distribution pie chart
- Recent referrals table
- Time range filtering (7d, 30d, 90d, all)

## Integration Points

### Enterprise Access Page (`app/enterprise-access/page.tsx`)

Added a toggle to switch between Enterprise/Airline access and Flight School partnership:

```tsx
const [accessType, setAccessType] = useState<'enterprise' | 'flightSchool'>('enterprise');

// Toggle buttons in UI
<button onClick={() => setAccessType('enterprise')}>Enterprise / Airline</button>
<button onClick={() => setAccessType('flightSchool')}>Flight School</button>

// Conditional rendering
{accessType === 'flightSchool' && <FlightSchoolOnboarding />}
```

### Enterprise Portal App (`components/enterprise/EnterprisePortalApp.tsx`)

Added flight school detection and navigation:

```tsx
// State
const [isFlightSchool, setIsFlightSchool] = useState(false);
const [flightSchoolId, setFlightSchoolId] = useState<string | null>(null);

// Check if user is flight school admin
useEffect(() => {
  supabase.from('flight_school_admins')
    .select('flight_school_id')
    .eq('user_id', user.id)
    .single()
    .then(({ data }) => {
      if (data) {
        setIsFlightSchool(true);
        setFlightSchoolId(data.flight_school_id);
        setPage('flight-school');
      }
    });
}, [user?.id]);

// Navigation
const FLIGHT_SCHOOL_NAV = { id: 'flight-school', label: 'Flight School', icon: GraduationCap };

// Page rendering
{page === 'flight-school' && isFlightSchool && flightSchoolId && <FlightSchoolPortal flightSchoolId={flightSchoolId} user={user} />}
```

## Database Schema

The integration uses the following tables from the referral system:

- `flight_schools` - School information and settings
- `referrals` - Individual pilot referrals
- `payouts` - Payout records
- `referral_analytics` - Aggregated analytics
- `flight_school_admins` - Admin access management

## Features Implemented

### 1. Referral Link Generation
- Automatic referral code generation during onboarding
- Unique referral link format: `https://pilotrecognition.com/ref/{code}`
- Copy to clipboard functionality
- Test link button

### 2. Referral Tracking
- Status tracking: pending → clicked → signed_up → completed → paid
- Real-time status updates via Edge Functions
- Commission calculation ($20 per pilot, configurable)

### 3. Payout Management
- Payout history view
- Status tracking: pending → processing → completed
- Multiple payout methods (bank transfer, check, PayPal, Stripe)

### 4. Marketing Materials
- Pre-written email template
- Social media post template
- QR code generation
- Referral card template (placeholder)

### 5. Analytics Dashboard
- Total referrals count
- Conversion rate calculation
- Commission breakdown
- Referral status distribution
- Time-based filtering

### 6. Admin Detection
- Automatic detection of flight school admins
- Redirects to flight school dashboard on login
- Hides enterprise navigation for flight school users

## Edge Functions Used

The integration uses the following Edge Functions:

1. **referral-link-generator** - Generate referral links for pilot emails
2. **referral-tracker** - Track referral actions (click, sign_up, complete)
3. **payout-manager** - Create and list payouts
4. **commission-manager** - Calculate commissions and mark as paid

## User Flow

### Flight School Sign-up Flow
1. User visits `/enterprise-access`
2. Selects "Flight School" toggle
3. Completes 5-step onboarding
4. Flight school record created in database
5. User added as flight school admin
6. Referral code generated automatically

### Flight School Dashboard Flow
1. Flight school admin logs into enterprise portal
2. System detects flight school admin role
3. Redirects to Flight School Portal
4. Can view overview, referrals, payouts, marketing, pilots, settings
5. Generate referral links and share with pilots
6. Track referral progress and earnings

## Commission Structure

- **Default Commission:** $20.00 per pilot
- **Commission Status Flow:** pending → eligible → processing → paid
- **Referral Status Flow:** pending → clicked → signed_up → completed → paid
- Commission becomes eligible when pilot completes the program
- Flight schools can customize commission rate via support request

## Security

- RLS policies enabled on all tables
- Authorization checks in Edge Functions
- Flight school admins can only access their own data
- Enterprise admins can view all flight school data

## Future Enhancements

- Email notifications for referral milestones
- Automated payout scheduling
- Referral link QR code download
- Advanced analytics with export
- Multi-level referral tiers
- Seasonal commission bonuses
- Stripe Connect integration for payouts
- Pilot management features

## Testing

### Test Flight School Onboarding
1. Visit `/enterprise-access`
2. Click "Flight School" button
3. Complete all 5 steps
4. Verify flight school record created in database
5. Verify user added as flight school admin

### Test Flight School Portal
1. Log in as flight school admin
2. Verify redirect to flight school dashboard
3. Generate referral link
4. Copy referral link
5. Add new referral via modal
6. View referral tracking table
7. View payout history
8. Access marketing materials
9. View analytics dashboard

## Troubleshooting

### Flight School Portal Not Showing
- Verify user is in `flight_school_admins` table
- Check `flight_school_id` is correct
- Ensure `is_active` is true in `flight_schools` table

### Referral Link Not Working
- Verify referral code exists in `flight_schools` table
- Check Edge Function is deployed
- Test referral-tracker Edge Function

### Commissions Not Calculating
- Verify referral status is 'completed'
- Check commission rate in `flight_schools` table
- Test commission-manager Edge Function
