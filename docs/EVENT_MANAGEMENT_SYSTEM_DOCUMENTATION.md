# Event Management System Documentation

## Overview

The Event Management System enables physical presence at aviation events (airshows, career fairs, pilot expos) to build brand credibility and accelerate pilot acquisition. It provides event registration, on-site signup with QR codes, kiosk mode for check-ins, event calendar, analytics dashboard, promo codes, pilot spotlights, session management, marketing materials, and notifications.

## Features

### 1. Event Registration System

**Location:** `components/events/EventRegistrationPage.tsx`

**Features:**
- User registration for events
- Ticket type selection (Standard, VIP, Student)
- Contact information collection
- Promo code validation and discount application
- Payment status tracking
- QR code generation for check-in
- Registration deadline enforcement
- Capacity management
- Event details display

**Workflow:**
1. User views event details
2. Selects ticket type
3. Enters contact information
4. Applies promo code (if available)
5. Completes registration
6. Receives QR code for event check-in

**Database:** `event_registrations` table

### 2. On-Site Signup Flow with QR Code Generation

**Location:** `components/events/OnSiteSignupPage.tsx`

**Features:**
- Kiosk-mode signup for walk-in attendees
- Contact information collection (name, email, phone, company, job title)
- Instant QR code generation
- Printable event pass
- No account required for signup
- Metadata storage for attendee info

**Workflow:**
1. Staff enters attendee information
2. System generates unique QR code
3. QR code displayed and printable
4. Attendee uses QR code for check-in

**Database:** `event_registrations` table (with `signup_method: 'onsite'` in metadata)

### 3. Mobile Kiosk Mode for Event Check-Ins

**Location:** `components/events/KioskCheckInPage.tsx`

**Features:**
- QR code scanning (manual entry, camera coming soon)
- Real-time check-in processing
- Duplicate check-in prevention
- Attendee verification
- Check-in count tracking
- Event statistics display
- Quick reset for next attendee

**Workflow:**
1. Staff scans or enters QR code
2. System verifies registration
3. System checks if already checked in
4. System marks attendee as checked in
5. System displays confirmation
6. Staff proceeds to next attendee

**Database:** Updates `event_registrations.checked_in` and `events.checkins_count`

### 4. Event Calendar with Upcoming Aviation Events

**Location:** `components/events/EventCalendarPage.tsx`

**Features:**
- Public event listing
- Event type filtering (Airshow, Career Fair, Pilot Expo)
- Status filtering (Upcoming, Ongoing, Completed)
- Search by title or location
- Featured events section
- Event cards with key information
- Event detail modal
- Quick registration access
- View mode toggle (List/Calendar)

**Event Types:**
- Airshows
- Career Fairs
- Pilot Expos
- Conferences
- Webinars

**Database:** `events` table (public events)

### 5. Event Analytics Dashboard

**Location:** `components/events/EventAnalyticsDashboard.tsx`

**Features:**
- Total events count
- Total registrations
- Total check-ins
- Total revenue
- Conversion rate (registrations/views)
- Attendance rate (check-ins/capacity)
- Top performing event highlight
- Event performance table
- Promo code performance tracking
- Time range filtering (7d, 30d, 90d, all)
- Export reports (placeholder)

**Metrics Tracked:**
- Views count
- Signups count
- Check-ins count
- Revenue
- Promo code usage
- Conversion rates

**Database:** Aggregates from `events`, `event_registrations` tables

### 6. Event-Specific Promo Codes for Subscriptions

**Location:** Integrated in `events` table and registration flow

**Features:**
- Unique promo codes per event
- Discount percentage configuration
- Usage limit tracking
- Expiration date support
- Promo code validation
- Usage analytics
- Revenue impact tracking

**Configuration:**
- `promo_code` - Unique code string
- `promo_discount_percentage` - Discount percentage (0-100)
- `promo_code_expires_at` - Expiration timestamp
- `promo_max_uses` - Maximum uses (optional)
- `promo_uses_count` - Current usage count

**Database:** `events.promo_code`, `events.promo_discount_percentage`, etc.

### 7. Pilot Spotlight Feature for Event Attendees

**Location:** `components/events/PilotSpotlightManager.tsx`

**Features:**
- Featured pilot profiles at events
- Spotlight title and description
- Featured quotes
- Achievement highlights
- Display order management
- Featured status toggle
- View tracking
- Search and filter capabilities
- Image URL support for pilot photos

**Use Cases:**
- Highlight exceptional pilots
- Showcase success stories
- Feature keynote speakers
- Highlight career fair hires

**Database:** `pilot_spotlights` table

### 8. Event Speaker/Session Management

**Location:** `components/events/SessionManager.tsx`

**Features:**
- Session creation and scheduling
- Speaker information management
- Session type categorization (Presentation, Workshop, Panel, Networking)
- Room assignment
- Virtual session URL support
- Capacity management
- Session attendance tracking
- Session order management
- Status tracking (scheduled, in_progress, completed, cancelled)
- Search and filter capabilities
- Speaker image and bio support

**Session Types:**
- Presentations
- Workshops
- Panel discussions
- Networking sessions

**Database:** `event_sessions`, `event_session_attendees` tables

### 9. Event Marketing Materials Generator

**Location:** `components/events/MarketingMaterialsGenerator.tsx`

**Features:**
- Material type selection (Banner, Flyer, Social Post, Email Template)
- Template-based generation with AI-powered content creation
- Customization options (headline, subheadline, call-to-action, colors)
- Generated content storage and editing
- Image generation (placeholder)
- Download tracking
- Status management (Draft, Generated, Published)
- Copy to clipboard functionality
- Search and filter capabilities

**Material Types:**
- Banners
- Flyers
- Social media posts
- Email templates

**Database:** `event_marketing_materials` table

### 10. Event Notification System for Pilots

**Location:** `components/events/EventNotificationManager.tsx`

**Features:**
- Notification campaigns creation
- Target audience selection (All, Registered, Nearby)
- Regional targeting with custom region list
- Notification types (Reminder, Update, Cancellation, Promo)
- Scheduled sending or immediate send
- Open tracking
- Sent count tracking
- Status management (Pending, Sent, Cancelled)
- Search and filter capabilities
- Copy message to clipboard

**Notification Types:**
- Event reminders
- Event updates
- Cancellations
- Promotional announcements

**Database:** `event_notifications` table

## Database Schema

### Tables

#### events
Stores aviation event information.

**Key Fields:**
- `id` (UUID, Primary Key)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `event_type` (VARCHAR) - airshow, career_fair, pilot_expo, conference, webinar
- `status` (VARCHAR) - upcoming, ongoing, completed, cancelled
- `start_date` (DATE, NOT NULL)
- `end_date` (DATE, NOT NULL)
- `start_time` (TIME)
- `end_time` (TIME)
- `timezone` (VARCHAR)
- `venue_name` (VARCHAR)
- `venue_address` (TEXT)
- `venue_city` (VARCHAR)
- `venue_country` (VARCHAR)
- `virtual_event_url` (TEXT)
- `registration_open` (BOOLEAN)
- `registration_deadline` (DATE)
- `max_attendees` (INTEGER)
- `current_attendees` (INTEGER)
- `registration_fee` (DECIMAL)
- `currency` (VARCHAR)
- `event_image_url` (TEXT)
- `banner_url` (TEXT)
- `logo_url` (TEXT)
- `theme_color` (VARCHAR)
- `organizer_id` (UUID, FK to auth.users)
- `enterprise_account_id` (UUID, FK to enterprise_accounts)
- `promo_code` (VARCHAR, UNIQUE)
- `promo_discount_percentage` (INTEGER)
- `promo_code_expires_at` (TIMESTAMPTZ)
- `promo_max_uses` (INTEGER)
- `promo_uses_count` (INTEGER)
- `views_count` (INTEGER)
- `signups_count` (INTEGER)
- `checkins_count` (INTEGER)
- `is_featured` (BOOLEAN)
- `featured_until` (TIMESTAMPTZ)
- `website_url` (TEXT)
- `social_links` (JSONB)
- `tags` (TEXT[])
- `is_public` (BOOLEAN)

#### event_registrations
Stores event registrations with QR codes for check-in.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `user_id` (UUID, FK to auth.users)
- `profile_id` (UUID, FK to profiles)
- `registration_type` (VARCHAR) - standard, vip, speaker, exhibitor
- `ticket_type` (VARCHAR)
- `qr_code` (TEXT, UNIQUE)
- `checked_in` (BOOLEAN)
- `checked_in_at` (TIMESTAMPTZ)
- `checked_in_by` (UUID, FK to auth.users)
- `email` (VARCHAR)
- `phone` (VARCHAR)
- `payment_status` (VARCHAR) - free, pending, paid, refunded
- `payment_amount` (DECIMAL)
- `payment_method` (VARCHAR)
- `paid_at` (TIMESTAMPTZ)
- `promo_code_used` (VARCHAR)
- `discount_amount` (DECIMAL)
- `feedback_rating` (INTEGER, 1-5)
- `feedback_text` (TEXT)
- `feedback_submitted_at` (TIMESTAMPTZ)
- `metadata` (JSONB)

#### event_sessions
Stores event sessions, workshops, and presentations.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `title` (VARCHAR, NOT NULL)
- `description` (TEXT)
- `session_type` (VARCHAR) - presentation, workshop, panel, networking
- `status` (VARCHAR) - scheduled, in_progress, completed, cancelled
- `session_date` (DATE, NOT NULL)
- `start_time` (TIME, NOT NULL)
- `end_time` (TIME, NOT NULL)
- `timezone` (VARCHAR)
- `room` (VARCHAR)
- `virtual_session_url` (TEXT)
- `speaker_id` (UUID, FK to auth.users)
- `speaker_name` (VARCHAR)
- `speaker_bio` (TEXT)
- `speaker_image_url` (TEXT)
- `speaker_title` (VARCHAR)
- `speaker_organization` (VARCHAR)
- `max_attendees` (INTEGER)
- `current_attendees` (INTEGER)
- `requires_registration` (BOOLEAN)
- `views_count` (INTEGER)
- `sort_order` (INTEGER)

#### event_session_attendees
Tracks attendance at specific event sessions.

**Key Fields:**
- `id` (UUID, Primary Key)
- `session_id` (UUID, FK to event_sessions)
- `registration_id` (UUID, FK to event_registrations)
- `attended` (BOOLEAN)
- `attended_at` (TIMESTAMPTZ)
- UNIQUE(session_id, registration_id)

#### event_sponsors
Stores event sponsor information.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `sponsor_name` (VARCHAR, NOT NULL)
- `sponsor_logo_url` (TEXT)
- `sponsor_website` (TEXT)
- `sponsor_description` (TEXT)
- `sponsor_tier` (VARCHAR) - platinum, gold, silver, bronze
- `contact_name` (VARCHAR)
- `contact_email` (VARCHAR)
- `contact_phone` (VARCHAR)
- `booth_number` (VARCHAR)
- `sponsorship_amount` (DECIMAL)
- `is_featured` (BOOLEAN)
- `display_order` (INTEGER)

#### pilot_spotlights
Stores pilot spotlights featured at events.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `profile_id` (UUID, FK to profiles)
- `spotlight_title` (VARCHAR)
- `spotlight_description` (TEXT)
- `spotlight_image_url` (TEXT)
- `featured_quote` (TEXT)
- `achievements` (TEXT[])
- `is_featured` (BOOLEAN)
- `display_order` (INTEGER)
- `views_count` (INTEGER)
- UNIQUE(event_id, profile_id)

#### event_notifications
Stores event notification campaigns.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `notification_type` (VARCHAR) - reminder, update, cancellation, promo
- `target_audience` (VARCHAR) - all, registered, nearby
- `target_regions` (TEXT[])
- `subject` (VARCHAR, NOT NULL)
- `message` (TEXT, NOT NULL)
- `scheduled_for` (TIMESTAMPTZ)
- `sent_at` (TIMESTAMPTZ)
- `sent_count` (INTEGER)
- `opened_count` (INTEGER)
- `status` (VARCHAR) - pending, sent, cancelled

#### event_marketing_materials
Stores generated marketing materials for events.

**Key Fields:**
- `id` (UUID, Primary Key)
- `event_id` (UUID, FK to events)
- `material_type` (VARCHAR) - banner, flyer, social_post, email_template
- `title` (VARCHAR)
- `description` (TEXT)
- `generated_content` (TEXT)
- `generated_image_url` (TEXT)
- `template_id` (VARCHAR)
- `customizations` (JSONB)
- `download_count` (INTEGER)
- `status` (VARCHAR) - draft, generated, published

## Security & Access Control

### Row Level Security (RLS) Policies

**events table:**
- Public can view public events
- Organizers can view their events
- Organizers can insert and update their events

**event_registrations table:**
- Users can view their registrations
- Organizers can view event registrations
- Users can insert registrations
- Organizers can update registrations

**event_sessions table:**
- Public can view sessions for public events
- Organizers can manage sessions

**event_session_attendees table:**
- Users can view their session attendance
- Organizers can view session attendance
- Users can insert their session attendance

**event_sponsors table:**
- Public can view sponsors for public events
- Organizers can manage sponsors

**pilot_spotlights table:**
- Public can view spotlights for public events
- Organizers can manage spotlights
- Users can view their spotlights

**event_notifications table:**
- Organizers can manage notifications

**event_marketing_materials table:**
- Organizers can manage marketing materials

## Integration Points

### With Existing Platform Features

1. **Pilot Profiles:** Registrations linked to pilot profiles
2. **Enterprise Portal:** Events can be organized by enterprises
3. **Recognition Score:** Event attendance can impact pilot recognition
4. **Job Listings:** Career fairs linked to job opportunities
5. **Notifications:** Event notifications integrated with platform notification system

### With External Services (Placeholders/To Be Integrated)

- **Email Service:** Firebase Cloud Functions, Resend, or SendGrid for event notifications
- **QR Code Generation:** Library integration for QR code generation
- **Camera Scanning:** Browser camera API or dedicated scanner SDK
- **Calendar Integration:** Google Calendar, Outlook Calendar
- **Payment Processing:** Stripe, PayPal for paid events
- **Marketing Tools:** Canva API, Adobe Creative Cloud for material generation

## User Workflows

### Event Organizer Workflow

1. **Create Event**
   - Navigate to Events section
   - Click "Create Event"
   - Enter event details (title, description, dates, location)
   - Set registration settings (fee, capacity, deadline)
   - Configure promo code (optional)
   - Upload event image
   - Publish event

2. **Manage Sessions**
   - Navigate to event details
   - Click "Sessions"
   - Add sessions (presentations, workshops, panels)
   - Assign speakers
   - Schedule sessions
   - Set capacity limits

3. **Manage Sponsors**
   - Navigate to event details
   - Click "Sponsors"
   - Add sponsor information
   - Set sponsor tier
   - Upload sponsor logos

4. **Generate Marketing Materials**
   - Navigate to event details
   - Click "Marketing Materials"
   - Select material type (banner, flyer, social post)
   - Customize template
   - Generate and download

5. **Send Notifications**
   - Navigate to event details
   - Click "Notifications"
   - Create notification campaign
   - Set target audience
   - Schedule or send immediately

6. **Monitor Analytics**
   - Navigate to Events Analytics
   - Select event or view all
   - Review registration metrics
   - Check conversion rates
   - Track promo code usage
   - Measure ROI

### Event Attendee Workflow

1. **Discover Events**
   - Navigate to Event Calendar
   - Filter by type or location
   - Browse upcoming events
   - View event details

2. **Register for Event**
   - Click "Register" on event
   - Select ticket type
   - Enter contact information
   - Apply promo code (if available)
   - Complete registration
   - Receive QR code

3. **Attend Event**
   - Arrive at event venue
   - Present QR code at check-in
   - Get checked in by staff
   - Attend sessions
   - Network with other attendees

4. **Provide Feedback**
   - After event, receive feedback request
   - Rate event experience
   - Provide comments
   - Submit feedback

### On-Site Staff Workflow

1. **Setup Kiosk**
   - Open Kiosk Check-In page
   - Select event
   - Verify check-in count

2. **On-Site Signups**
   - Open On-Site Signup page
   - Enter walk-in attendee information
   - Generate QR code
   - Print event pass
   - Hand to attendee

3. **Check-In Attendees**
   - Open Kiosk Check-In page
   - Scan or enter QR code
   - Verify registration
   - Confirm check-in
   - Proceed to next attendee

4. **Monitor Progress**
   - Check check-in count
   - Track attendance rate
   - Identify issues
   - Adjust as needed

## Technical Requirements

### Browser Support
- Modern browsers with WebRTC support (for camera scanning)
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Dependencies
- React 18+
- Framer Motion (animations)
- Lucide React (icons)
- Supabase (database/auth)
- Cloudinary (image storage)

### External Services (Placeholders/To Be Integrated)
- **QR Code Library:** qrcode.react or similar
- **Camera Scanning:** html5-qrcode or similar
- **Email Service:** Firebase Cloud Functions, Resend, SendGrid
- **Payment Processing:** Stripe, PayPal
- **Calendar API:** Google Calendar, Outlook Calendar
- **Marketing Tools:** Canva API, Adobe Creative Cloud

## Configuration

### Cloudinary
- Upload preset: `enterprise_unsigned`
- Folder: `events`
- Resource type: `image`

### Supabase
- Project ID: `gkbhgrozrzhalnjherfu`
- Tables: events, event_registrations, event_sessions, event_session_attendees, event_sponsors, pilot_spotlights, event_notifications, event_marketing_materials
- RLS enabled on all tables

## Future Enhancements

1. **Camera QR Scanning:** Integrate camera API for QR code scanning
2. **Payment Processing:** Integrate Stripe/PayPal for paid events
3. **Calendar Integration:** Sync events with Google/Outlook calendars
4. **Real-time Updates:** WebSocket for live event updates
5. **Mobile App:** Native mobile app for event management
6. **AI-Powered Recommendations:** Suggest events based on pilot profile
7. **Social Features:** Event networking, chat, discussion boards
8. **Advanced Analytics:** Heat maps, attendee flow tracking
9. **Lead Scoring:** Score leads based on event engagement
10. **Automated Follow-ups:** Post-event email sequences

## Troubleshooting

### Registration Issues
- Verify event registration is open
- Check registration deadline
- Ensure capacity not reached
- Validate promo code (if used)

### Check-In Issues
- Verify QR code is valid
- Check if already checked in
- Ensure registration exists
- Review RLS policies

### Analytics Issues
- Verify event organizer permissions
- Check data aggregation queries
- Review time range filters
- Ensure proper joins in queries

## Support

For issues or questions:
- Use the Support page in the portal
- Email: events@pilotrecognition.com
- Documentation: /docs/EVENT_MANAGEMENT_SYSTEM_DOCUMENTATION.md

## Strategic Impact

### Physical Presence & Brand Building
- Establishes credibility in aviation industry
- Face-to-face networking opportunities
- Brand visibility at major events
- Industry thought leadership positioning

### Pilot Acquisition Acceleration
- On-site signup captures leads immediately
- QR codes enable quick data collection
- Event promo codes track conversions
- Direct engagement with potential users

### ROI Measurement
- Analytics dashboard tracks event performance
- Conversion rates measure effectiveness
- Promo code usage tracks attribution
- Check-in data validates attendance

### Growth Phase Support
- Low priority but strategically valuable
- Foundation for physical presence strategy
- Data-driven event selection
- Scalable event management system
