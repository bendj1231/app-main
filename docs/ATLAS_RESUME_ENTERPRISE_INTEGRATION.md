# Atlas Résumé Enterprise Portal Integration

## Overview

This document describes the integration of the Atlas Résumé Builder with the Enterprise Portal for Airline Sharing, enabling pilots to share their certified resumes directly with airline recruiters and track application status.

## Features Implemented

### 1. Airline Selection Modal

**Component:** `components/AirlineSelectionModal.tsx`

**Features:**
- Search and filter airlines by name, country, and account type
- Select multiple airlines for bulk sharing
- AI-powered recommendations based on aircraft experience and target role
- Display airline logos, IATA codes, and base locations
- Real-time selection count
- Integration with enterprise_accounts table

**Usage:**
```tsx
<AirlineSelectionModal
  isOpen={showModal}
  onClose={() => setShowModal(false)}
  onShare={(selectedAirlines) => handleShare(selectedAirlines)}
  resumeData={resumeData}
/>
```

### 2. Share with Airlines Button

**Component:** `components/AtlasResumeBuilder.tsx`

**Features:**
- Premium-gated "Share with Airlines" button in header
- Opens AirlineSelectionModal on click
- Gradient styling to differentiate from regular share button
- Only visible to premium subscribers

**Implementation:**
```tsx
{hasPremiumAccess && (
  <button
    onClick={() => setShowAirlineModal(true)}
    className="px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg"
  >
    <Send className="w-4 h-4" />
    Share with Airlines
  </button>
)}
```

### 3. Resume Sharing API

**Function:** `shareWithAirlines` in AtlasResumeBuilder

**Process:**
1. Saves resume if not already saved
2. Fetches airline details for selected airlines
3. Creates application records in `resume_airline_applications` table
4. Updates analytics with application count
5. Shows success confirmation

**Database Operations:**
```sql
-- Insert applications
INSERT INTO resume_airline_applications (
  resume_id, user_id, airline_id, airline_name,
  status, application_status, applied_at, updated_at
) VALUES (...);

-- Update analytics
UPSERT INTO resume_analytics (
  user_id, resume_id, applications, updated_at
) VALUES (...);
```

### 4. Airline-Side Resume Viewer

**Component:** `components/enterprise/ResumeViewer.tsx`

**Features:**
- Full resume display with all sections
- Recognition score display with benchmark
- Application status tracking
- Status update buttons (viewed, shortlisted, interview, hired, rejected)
- Internal notes for recruiters
- PDF download
- Direct email link to pilot
- View tracking (records when airline views resume)

**Status Pipeline:**
- `submitted` → `viewed` → `shortlisted` → `interview` → `hired`
- Alternative paths: `rejected`, `withdrawn`

**View Tracking:**
```typescript
const recordView = async () => {
  await supabase
    .from('resume_analytics')
    .upsert({
      resume_id: application?.resume_id,
      user_id: application?.user_id,
      last_viewed_at: new Date(),
      updated_at: new Date(),
    });
};
```

### 5. Enterprise Applications Page Integration

**Component:** `components/enterprise/EnterprisePortalApp.tsx` - ApplicationsPage

**Integration Points:**
- Added ResumeViewer import
- Added showResumeViewer state
- Click on application card opens ResumeViewer
- "View Full Resume" button in detail modal
- Separate modal for resume viewing

**User Flow:**
1. Airline views applications in pipeline
2. Clicks on application card
3. Opens ResumeViewer with full resume
4. Can update status, add notes, contact pilot
5. View is tracked in analytics

## Database Schema

### resume_airline_applications

**Columns:**
- `id` - UUID primary key
- `resume_id` - Reference to atlas_resumes
- `user_id` - Pilot user ID
- `airline_id` - Enterprise account ID
- `airline_name` - Airline name for display
- `share_id` - Reference to resume_shares (optional)
- `application_status` - Internal status (pending, processing, etc.)
- `status` - Pipeline status (submitted, viewed, shortlisted, interview, hired, rejected, withdrawn)
- `applied_at` - Application timestamp
- `updated_at` - Last update timestamp
- `notes` - Internal recruiter notes

**Status Values:**
- `submitted` - Initial application
- `viewed` - Airline has viewed resume
- `shortlisted` - Candidate in shortlist
- `interview` - Interview scheduled
- `hired` - Candidate hired
- `rejected` - Application rejected
- `withdrawn` - Candidate withdrew

### resume_analytics Updates

**New Tracking:**
- `last_viewed_at` - Timestamp of last resume view by airline
- `airlines_viewed` - Array of airline IDs that viewed resume
- `applications` - Count of applications submitted

## API Endpoints

### Existing Firebase Functions Used

The integration uses existing Firebase backend functions from the enterprise portal:

- `getEnterpriseApplications` - Fetch applications for airline
- `updateApplicationStatus` - Update application status
- `getCardAnalytics` - Get analytics data

### Supabase Direct Operations

The Atlas Résumé integration uses direct Supabase operations:

```typescript
// Share resume with airlines
supabase.from('resume_airline_applications').insert(applications)

// Update analytics
supabase.from('resume_analytics').upsert({...})

// Record view
supabase.from('resume_analytics').upsert({
  last_viewed_at: new Date(),
  updated_at: new Date()
})
```

## Notification System

### Planned Features

1. **Email Notifications**
   - Pilot receives email when airline views resume
   - Pilot receives email when status changes
   - Airline receives email when new application received

2. **In-App Notifications**
   - Real-time status updates in pilot portal
   - Application activity feed
   - Notification center for resume activity

3. **Push Notifications** (Future)
   - Mobile push for status changes
   - Browser notifications for views

### Implementation Status

- ✅ View tracking in database
- ⏳ Email notification system (pending)
- ⏳ In-app notification center (pending)
- ⏳ Push notifications (future)

## Bulk Sharing

### Current Implementation

The AirlineSelectionModal already supports:
- Select multiple airlines at once
- "Select All" button for quick selection
- Bulk application creation in single operation

### Future Enhancements

- Share to all airlines in a region
- Share to airlines with specific aircraft fleets
- Share based on job requirements matching
- Scheduled sharing campaigns

## Application Analytics Dashboard

### Planned Features

1. **Application Overview**
   - Total applications submitted
   - Applications by status
   - Response rate (views / applications)
   - Time to first response

2. **Airline Breakdown**
   - Which airlines viewed resume
   - Which airlines shortlisted
   - Response rate by airline
   - Application status by airline

3. **Timeline**
   - Application submission dates
   - Status change timeline
   - View history
   - Response time analysis

4. **Conversion Funnel**
   - Submitted → Viewed → Shortlisted → Interview → Hired
   - Drop-off rates at each stage
   - Comparison with industry benchmarks

### Implementation Status

- ⏳ Analytics dashboard component (pending)
- ⏳ Data aggregation queries (pending)
- ⏳ Visualization components (pending)

## Resume Recommendation System

### Current Implementation

The AirlineSelectionModal includes basic recommendations:
- Matches aircraft types in resume with airline fleets
- Recommends based on target role (commercial, cargo, private)
- Shows "Recommended for you" badge

### Algorithm

```typescript
const getRecommendedAirlines = () => {
  return enterpriseAirlines.filter(airline => {
    // Match aircraft types
    const hasMatchingAircraft = resumeData.aircraftTypes.some(at =>
      airline.fleet_information?.aircraft_types?.some(fa =>
        fa.toLowerCase().includes(at.model.toLowerCase())
      )
    );
    
    // Match target role
    if (resumeData.targetRole === 'commercial' && airline.account_type === 'airline') {
      return true;
    }
    
    return hasMatchingAircraft;
  });
};
```

### Future Enhancements

- Match based on job requirements (hours, licenses, ratings)
- Score and rank airlines by fit
- Consider airline preferences and culture
- Location-based recommendations
- Salary range matching

## User Journey

### Pilot Flow

1. **Create Resume**
   - Complete all resume sections
   - Get Atlas Certified (premium)
   - Save resume

2. **Share with Airlines**
   - Click "Share with Airlines" button
   - Select airlines from list
   - View AI recommendations
   - Confirm sharing

3. **Track Applications**
   - View application analytics in sidebar
   - See which airlines viewed resume
   - Monitor status changes
   - Receive notifications

### Airline Flow

1. **View Applications**
   - Navigate to Applications page in portal
   - See pipeline view with all applications
   - Filter by status

2. **Review Resume**
   - Click on application card
   - View full resume with ResumeViewer
   - See recognition score and certification

3. **Update Status**
   - Move candidate through pipeline
   - Add internal notes
   - Contact pilot directly
   - Download PDF

## Security Considerations

### Row Level Security (RLS)

All tables have RLS policies:
- Pilots can only view their own applications
- Airlines can only view applications sent to them
- Public read access only for certified resumes

### Access Control

- Premium gating for airline sharing
- Enterprise access verification for portal
- Account isolation (airlines see only their applications)

### Data Privacy

- Resume data only shared with selected airlines
- Internal notes visible only to airline
- Contact information protected by RLS

## Testing Checklist

- [ ] Pilot can share resume with multiple airlines
- [ ] Applications appear in airline portal
- [ ] Airline can view full resume
- [ ] Status updates work correctly
- [ ] View tracking records correctly
- [ ] Analytics update on share
- [ ] Recommendations display correctly
- [ ] Bulk sharing works
- [ ] Email notifications send (when implemented)
- [ ] Premium gating enforced

## Troubleshooting

### Applications not appearing in portal

**Check:**
- Resume is saved (has resume_id)
- Application status is 'submitted'
- airline_id matches enterprise account
- RLS policies are correct

### Resume not loading in viewer

**Check:**
- resume_id exists in application record
- Resume exists in atlas_resumes table
- User has permission to view resume
- Recognition score exists in pilot_recognition_scores

### Status not updating

**Check:**
- User has enterprise access
- Application belongs to airline
- RLS policy allows update
- Status value is valid

## Future Enhancements

1. **Advanced Analytics**
   - Application success rate by airline
   - Time-to-hire analysis
   - Comparison with peer benchmarks
   - Salary negotiation insights

2. **AI-Powered Matching**
   - Smart job recommendations
   - Automatic application suggestions
   - Interview preparation tips
   - Gap analysis

3. **Communication Tools**
   - In-app messaging with recruiters
   - Video interview scheduling
   - Document sharing
   - Offer management

4. **Integration Expansion**
   - ATS integration for major airlines
   - LinkedIn profile import
   - Multi-language support
   - Mobile app

## Support

For issues or questions:
- Atlas Résumé documentation: `/docs/ATLAS_RESUME_BUILDER_GUIDE.md`
- Database schema: `/docs/ATLAS_RESUME_DATABASE_SCHEMA.md`
- Enterprise portal: `/docs/ENTERPRISE_PORTAL_DOCUMENTATION.md`
