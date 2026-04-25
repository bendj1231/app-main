# Atlas Résumé Builder - Complete Guide

## Overview

The Atlas Résumé Builder is a premium feature that creates industry-standard aviation resumes with certification, analytics, and direct airline sharing capabilities. It's designed to differentiate WingMentor from regular resume builders by providing aviation-specific formatting, verification, and airline integration.

## Features

### 1. Aviation-Specific Resume Format
- **Flight Hours Section**: Total, PIC, SIC, Cross-Country, Night, IFR, Multi-Engine, Simulator, Dual Received
- **Aircraft Types**: Manufacturer, model, type rating status, hours, last flown date
- **Licenses & Ratings**: ATPL, CPL, PPL, Instrument, Multi-Engine, Type Ratings
- **Work Experience**: Role-specific aviation positions with aircraft types flown
- **Education & Certifications**: Aviation-specific training and credentials

### 2. Atlas Résumé Certified Badge
- Industry-validated credential badge
- Only available to premium users
- Displays certification date and recognition score
- Three variants: default badge, compact, inline

### 3. Template System
- **Modern**: Clean, contemporary design
- **Classic**: Traditional aviation format
- **Executive**: Professional and polished
- **Technical**: Detailed technical focus

### 4. Aviation Role Templates
- **Commercial Airline**: Major airline passenger operations
- **Cargo Operations**: Freight and logistics aviation
- **Private Aviation**: Personal and business aviation
- **Corporate Aviation**: Business jet operations
- **Charter Services**: On-demand charter operations

### 5. Export & Sharing
- **PDF Export**: Print-optimized ATS-friendly format
- **Shareable Links**: Generate unique share tokens
- **Access Control**: Password protection, airline whitelist, expiration dates
- **Analytics Tracking**: Views, downloads, shares, applications

### 6. Pilot Recognition Score Integration
- Displays recognition score on resume
- Shows score in certification badge
- Integrated with existing recognition system

### 7. Airline Portal Integration
- Direct sharing to enterprise portal airlines
- Application tracking (submitted, viewed, shortlisted, interview, offered, rejected, withdrawn)
- Airline-specific analytics

## Database Schema

### Tables

#### atlas_resumes
Stores user resume data in standardized Atlas format.

**Key Columns:**
- `id`: UUID primary key
- `user_id`: Reference to auth.users
- `personal_info`: JSONB (name, email, phone, location, nationality, languages, etc.)
- `flight_hours`: JSONB (total, pic, sic, crossCountry, night, ifr, multiEngine, simulator, dualReceived)
- `aircraft_types`: JSONB array (manufacturer, model, typeRating, hours, lastFlown)
- `licenses`: JSONB array (type, number, issuingAuthority, issueDate, expiryDate, status, medicalClass)
- `ratings`: JSONB array (type, aircraftType, issueDate, expiryDate)
- `work_experience`: JSONB array (title, company, location, dates, aircraftTypes, responsibilities, achievements)
- `education`: JSONB array (degree, institution, location, dates, gpa)
- `certifications`: JSONB array (name, issuingOrganization, issueDate, expiryDate, credentialNumber)
- `skills`: TEXT array
- `core_competencies`: TEXT array
- `template`: TEXT (modern, classic, executive, technical)
- `target_role`: TEXT (commercial, cargo, private, corporate, charter)
- `is_certified`: BOOLEAN
- `certification_date`: TIMESTAMPTZ

#### resume_analytics
Tracks resume engagement metrics.

**Key Columns:**
- `resume_id`: Reference to atlas_resumes
- `user_id`: Reference to auth.users
- `views`: INTEGER
- `downloads`: INTEGER
- `shares`: INTEGER
- `applications`: INTEGER
- `airlines_viewed`: TEXT array
- `last_viewed_at`: TIMESTAMPTZ
- `last_downloaded_at`: TIMESTAMPTZ
- `last_shared_at`: TIMESTAMPTZ

#### resume_shares
Manages shareable resume links.

**Key Columns:**
- `resume_id`: Reference to atlas_resumes
- `user_id`: Reference to auth.users
- `share_token`: TEXT (unique)
- `share_url`: TEXT
- `expires_at`: TIMESTAMPTZ
- `is_public`: BOOLEAN
- `allowed_airlines`: TEXT array
- `password`: TEXT
- `access_count`: INTEGER
- `last_accessed_at`: TIMESTAMPTZ

#### resume_airline_applications
Tracks applications to airlines.

**Key Columns:**
- `resume_id`: Reference to atlas_resumes
- `user_id`: Reference to auth.users
- `airline_id`: TEXT
- `airline_name`: TEXT
- `share_id`: Reference to resume_shares
- `application_status`: TEXT
- `status`: TEXT (submitted, viewed, shortlisted, interview, offered, rejected, withdrawn)
- `applied_at`: TIMESTAMPTZ
- `notes`: TEXT

## Component Architecture

### Main Components

#### AtlasResumeBuilder
Main builder component with:
- Section navigation (Personal, Flight Hours, Aircraft, Licenses, Experience, Education, Certifications, Preview)
- Premium access gating
- Recognition score display
- Save/Export/Share functionality
- Analytics sidebar
- Certification status

#### AtlasResumeCertifiedBadge
Certification badge component with:
- Three variants (default, compact, inline)
- Three sizes (small, medium, large)
- Certification date display
- Recognition score integration

#### ResumeTemplateSelector
Template and role selector with:
- Aviation role selection (5 options)
- Template selection (4 options)
- Visual cards with icons and descriptions

### Section Components

#### PersonalInfoSection
Form fields for personal information.

#### FlightHoursSection
Form fields for flight hours breakdown.

#### AircraftTypesSection
Form for adding aircraft types with ratings.

#### LicensesSection
Form for licenses and ratings.

#### ExperienceSection
Form for work experience.

#### EducationSection
Form for education history.

#### CertificationsSection
Form for certifications.

#### ResumePreview
Live preview of resume with template rendering.

## Navigation Integration

### Portal Sidebar
Added "Atlas Resume" menu item to portal sidebar navigation.

### WingMentorHome
- Added `atlas-resume` to MainView type
- Route handler renders AtlasResumeBuilder component
- Navigation via `setMainView('atlas-resume')`

## Premium Feature Gating

The Atlas Résumé Builder is a premium feature. Access is controlled via:
1. Subscription check using `getUserSubscription()`
2. Feature access check using `checkFeatureAccess(subscription, 'premium')`
3. Non-premium users see upgrade prompt with feature benefits

## API Endpoints

### Resume Operations
- **GET** `/api/resume/:id` - Get resume by ID
- **POST** `/api/resume` - Create/update resume
- **DELETE** `/api/resume/:id` - Delete resume

### Share Operations
- **POST** `/api/resume/share` - Generate share link
- **GET** `/api/resume/share/:token` - Access shared resume
- **PUT** `/api/resume/share/:token` - Update share settings

### Analytics Operations
- **GET** `/api/resume/analytics/:resumeId` - Get resume analytics
- **POST** `/api/resume/analytics/:resumeId/view` - Record view
- **POST** `/api/resume/analytics/:resumeId/download` - Record download

### Application Operations
- **POST** `/api/resume/apply` - Apply to airline
- **GET** `/api/resume/applications` - Get user applications
- **PUT** `/api/resume/applications/:id/status` - Update application status

## User Journey

### Creating a Resume
1. Navigate to Portal → Atlas Resume
2. Premium users see full builder; free users see upgrade prompt
3. Complete personal information section
4. Add flight hours breakdown
5. Add aircraft types with ratings
6. Add licenses and ratings
7. Add work experience
8. Add education
9. Add certifications
10. Select target aviation role and template
11. Preview resume
12. Save resume
13. Get certified (premium feature)
14. Export PDF or generate share link

### Sharing with Airlines
1. Click "Share" button
2. Generate shareable link
3. Set access controls (optional):
   - Password protection
   - Airline whitelist
   - Expiration date
4. Copy share link
5. Share link with airline recruiters
6. Track views and applications in analytics

### Applying to Airlines
1. Navigate to enterprise portal
2. Select target airline
3. Share resume via Atlas link
4. Application is tracked in resume_airline_applications
5. Monitor application status updates

## Enterprise Portal Integration

### Airline View
- Access certified resumes via public read policy
- View resume with Atlas certification badge
- See recognition score
- Download PDF
- Track application status

### Application Management
- Update application status (viewed, shortlisted, interview, offered, rejected)
- Add notes to applications
- Filter applications by status
- Export application reports

## Testing Checklist

- [ ] Premium users can access builder
- [ ] Free users see upgrade prompt
- [ ] All form sections save correctly
- [ ] Recognition score displays
- [ ] Template selection works
- [ ] Role selection works
- [ ] PDF export works
- [ ] Share link generation works
- [ ] Share link access control works
- [ ] Analytics track correctly
- [ ] Certification badge displays
- [ ] Certification process works
- [ ] Navigation from portal works
- [ ] Database operations work
- [ ] RLS policies enforce correctly

## Future Enhancements

1. **AI Resume Optimization**: Suggest improvements based on ATS keywords
2. **Resume Templates**: Add more aviation-specific templates
3. **Video Resume**: Integrate video introduction
4. **Portfolio Integration**: Link to flight logs and achievements
5. **Cover Letter Generator**: AI-powered cover letters
6. **Interview Preparation**: Tailored interview questions based on resume
7. **Salary Calculator**: Estimate salary based on experience and role
8. **Industry Insights**: Market trends and salary data

## Troubleshooting

### Resume not saving
- Check user authentication
- Verify database connection
- Check RLS policies
- Review console for errors

### Share link not working
- Verify share token exists
- Check expiration date
- Verify access control settings
- Check RLS policies for public access

### Analytics not updating
- Verify analytics record exists
- Check trigger functions
- Review console for errors
- Verify user permissions

### Certification not working
- Verify premium subscription
- Check recognition score exists
- Verify database update
- Review console for errors

## Security Considerations

1. **RLS Policies**: All tables have Row Level Security enabled
2. **Share Tokens**: Random tokens with minimum length validation
3. **Access Control**: Password protection, airline whitelist, expiration
4. **Public Access**: Only certified resumes can be publicly viewed
5. **Audit Trail**: created_at and updated_at timestamps track changes
6. **Cascade Deletes**: Related records cleaned up on deletion

## Performance Optimization

1. **Indexes**: Created on frequently queried columns
2. **Partial Indexes**: Conditional indexes for certified resumes and expiring shares
3. **JSONB Storage**: Flexible schema for resume data
4. **Lazy Loading**: Sections load on demand
5. **Caching**: Recognition score cached locally
