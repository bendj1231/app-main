# Enterprise Portal Documentation

## Overview

The Enterprise Portal for Airlines/Providers is a comprehensive system that allows airlines, training providers, recruiters, and other aviation organizations to manage their presence on PilotRecognition.com, post job opportunities, search for qualified pilots, and access analytics.

## Features

### 1. Airline/Provider Onboarding System

**Location:** `/app/enterprise-access/page.tsx`

**Features:**
- Comprehensive onboarding form for new enterprise partners
- Collects company information, contact details, business type
- Supports multiple organization types:
  - Airline Operators
  - Aircraft Manufacturers
  - ATO / Training Providers
  - Type Rating Centers
  - Airline Recruiters
  - Staffing Firms
  - Recruitment Agencies
- Partnership interest and pathway preferences
- Timeline and budget information
- Automatic email notification to admin
- Saves to `enterprise_access_requests` table in Supabase

**Access:** https://pilotrecognition.com/enterprise-access

### 2. Job Posting Interface

**Location:** `EnterprisePortalApp.tsx` - `JobListingsPage` component

**Features:**
- Create, edit, and delete job listings
- Fields include:
  - Job title, location, type (Full-time, Part-time, Contract, Wet Lease)
  - Flight hours requirements (total, PIC)
  - License requirements (ATPL, CPL, MPL, PPL)
  - ICAO ELP Level (4, 5, 6)
  - Salary range with currency selection
  - Visa sponsorship option
  - Type rating requirements
  - Application URL
  - Positions available
- Activate/deactivate job listings
- View all job postings with status indicators
- Integrated with Firebase backend (`postEnterpriseJobListing`)

**Access:** https://pilotrecognition.com/enterprise/dashboard (navigate to Job Listings)

### 3. Candidate Access (Recognition-Scored Pilots)

**Location:** `EnterprisePortalApp.tsx` - `PilotSearchPage` component

**Features:**
- Search pilot profiles by multiple criteria:
  - Min/Max flight hours
  - ICAO ELP Level
  - License type
  - Nationality (keyword search)
  - Type rating (keyword search)
  - Availability status (Available, Considering Offers, Not Looking)
- Displays pilot information:
  - Name and profile image
  - Nationality and license country
  - Total flight hours
  - ICAO English Proficiency Level
  - Availability status
  - **Recognition Score (PR Score)**
- Export search results to CSV
- Integrated with Firebase backend (`searchPilotProfiles`)

**Access:** https://pilotrecognition.com/enterprise/dashboard (navigate to Pilot Search)

### 4. Provider Verification Workflow

**Location:** `EnterprisePortalApp.tsx` - `AdminPanel` component

**Features:**
- View all enterprise access requests
- Review request details:
  - Applicant name and email
  - Company name and size
  - Role and country
  - Business type and partnership interest
  - Organization type badges (Airline, Manufacturer, ATO, etc.)
  - Custom message
- Approve requests:
  - Grants `enterprise_access` to the user's profile
  - Updates request status to 'approved'
  - Records reviewer and timestamp
- Reject requests:
  - Updates request status to 'rejected'
  - Records reviewer and timestamp
- Email applicants directly
- Manage enterprise users:
  - View all users with enterprise access
  - Revoke access
  - Grant/remove manager privileges
- Only accessible to users with `is_enterprise_manager = true`

**Access:** https://pilotrecognition.com/enterprise/dashboard (navigate to Enterprise Admin - manager only)

### 5. Enterprise Analytics Dashboard

**Location:** `EnterprisePortalApp.tsx` - `AnalyticsPage` component

**Features:**
- Performance metrics:
  - Total views across all pathway cards
  - Total applications received
  - Average Click-Through Rate (CTR)
  - Conversion rate (views to applications)
- Time range filtering (7d, 30d, 90d, All Time)
- Top performing cards ranking
- Detailed performance table:
  - Card title and publish date
  - Status (Published/Draft)
  - View count
  - Application count
  - CTR percentage
  - Conversion rate with visual progress bar
- Refresh functionality
- Integrated with Firebase backend (`getCardAnalytics`)

**Access:** https://pilotrecognition.com/enterprise/dashboard (navigate to Analytics)

## Additional Features

### Pathway Cards Management

**Location:** `EnterprisePortalApp.tsx` - `PathwayCardsPage` component

**Features:**
- Create and manage pathway cards
- Comprehensive form sections:
  - Basic Information (title, subtitle, position type, category)
  - Minimum Requirements (hours, license, medical, type rating)
  - Profile Alignment Weights (configure recognition formula weights)
  - Compensation (salary, housing, transport)
  - Application Details (URL, email, base locations, benefits, culture)
  - Visibility (publish immediately, feature card)
- Edit, publish/unpublish, delete cards
- View all cards with status indicators
- Integrated with Firebase backend (`postEnterprisePathwayCard`)

### Airline Expectations

**Location:** `EnterprisePortalApp.tsx` - `AirlineExpectationsPage` component

**Features:**
- Update airline-specific requirements and culture
- Upload airline logo (Cloudinary)
- Configure:
  - Company description and website
  - Pilot requirements (hours, type ratings, ICAO level, medical, nationalities)
  - Recruitment process (stages, timeline, assessment info)
  - Contact information (HR email, phone, careers URL)
- Restricted to updating only the user's own airline
- Integrated with Firebase backend (`updateAirlineExpectations`)

### Applications Pipeline

**Location:** `EnterprisePortalApp.tsx` - `ApplicationsPage` component

**Features:**
- Kanban-style pipeline management
- Pipeline stages:
  - Applied
  - Shortlisted
  - Interview Scheduled
  - Offer Made
  - Hired
  - Rejected
  - Withdrawn
- Filter by status
- View candidate details:
  - Name, email, PR Score
  - Total hours and type ratings
  - Nationality
  - Cover letter and internal notes
- Move candidates between stages
- Email candidates directly
- Integrated with Firebase backend (`getEnterpriseApplications`, `updateApplicationStatus`)

### Account Settings

**Location:** `EnterprisePortalApp.tsx` - `SettingsPage` component

**Features:**
- Update enterprise account information:
  - Airline name and IATA code
  - Logo upload (Cloudinary)
  - Website and country
  - Account type (airline, ATO, recruiter, manufacturer, staffing)
  - Base locations
  - Link to airline expectations (72 airline list)
  - Company description
- View current user and access status
- Integrated with Firebase backend (`upsertEnterpriseAccount`)

### Support

**Location:** `EnterprisePortalApp.tsx` - `SupportPage` component

**Features:**
- Submit support requests
- Subject and message fields
- Email notification to support team
- Confirmation message after submission

## Database Schema

### Tables

1. **enterprise_accounts**
   - Enterprise account information
   - Linked to profiles table
   - Contains airline details, fleet info, contact info

2. **enterprise_access_requests**
   - Onboarding requests from new enterprises
   - Status tracking (pending, approved, rejected)
   - Reviewer and timestamp fields

3. **enterprise_pathway_cards**
   - Pathway cards posted by enterprises
   - Published/draft status
   - Profile alignment weights
   - Compensation and benefits

4. **job_opportunities**
   - Job listings posted by enterprises
   - Active/closed status
   - Requirements and compensation

5. **pilot_applications**
   - Applications from pilots to pathway cards
   - Pipeline status tracking
   - Interview and offer details

6. **profiles**
   - User profiles with enterprise access flag
   - `enterprise_access` boolean
   - `is_enterprise_manager` boolean

7. **recognition_scores**
   - Pilot recognition scores
   - Total score and breakdown
   - Score tier (Iron, Bronze, Silver, Gold, Platinum)

## Firebase Backend Functions

Located in `/functions/index.js`

### Enterprise Functions

1. **searchPilotProfiles** - Search pilot profiles with filters
2. **postEnterprisePathwayCard** - Create new pathway card
3. **postEnterpriseJobListing** - Create new job listing
4. **upsertEnterpriseAccount** - Update/create enterprise account
5. **updateAirlineExpectations** - Update airline expectations
6. **getEnterpriseApplications** - Get applications for enterprise
7. **updateApplicationStatus** - Update application status
8. **getCardAnalytics** - Get analytics for pathway cards

## Routing

All enterprise routes are configured in `/index.tsx`:

- `/enterprise-access` - Enterprise access request form
- `/enterprise/login` - Enterprise login page
- `/enterprise/dashboard` - Main enterprise portal
- `/enterprise/*` - Catch-all for enterprise portal navigation

## Authentication

**Location:** `components/enterprise/hooks/useEnterpriseAuth.ts`

**Features:**
- Supabase authentication integration
- Enterprise access verification
- Enterprise account loading
- Manager privilege checking
- Login/logout functions

## Access Control

- **Enterprise Access:** Users must have `enterprise_access = true` in profiles table
- **Manager Access:** Admin panel requires `is_enterprise_manager = true`
- **Account Isolation:** Users can only edit their own airline's expectations
- **RLS Policies:** Supabase Row Level Security enabled on all tables

## Getting Started

### For New Enterprise Partners

1. Visit `/enterprise-access` to submit access request
2. Fill out the onboarding form
3. Wait for admin approval (1-2 business days)
4. Receive login credentials via email
5. Log in at `/enterprise/login`

### For Admins

1. Log in with manager account
2. Navigate to Enterprise Admin
3. Review pending requests
4. Approve/reject requests
5. Manage enterprise users

### For Enterprise Users

1. Log in at `/enterprise/login`
2. Complete account setup in Settings
3. Create pathway cards or job listings
4. Search for pilots using Pilot Search
5. Manage applications through the pipeline
6. View performance in Analytics

## Support

For issues or questions:
- Use the Support page in the portal
- Email: enterprise@pilotrecognition.com
