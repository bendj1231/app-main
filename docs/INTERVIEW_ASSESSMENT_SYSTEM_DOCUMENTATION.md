# Interview/Assessment System Documentation

## Overview

The Interview/Assessment System is a comprehensive platform for conducting, evaluating, and managing pilot interviews within the Enterprise Portal. It provides video/audio recording, transcription, assessment based on aviation standards, feedback delivery, and integration with the Pilot Recognition Score.

## Features

### 1. Interview Recording/Transcription System

**Location:** `components/enterprise/InterviewRecordingPage.tsx`

**Features:**
- Real-time video/audio recording using browser MediaRecorder API
- Camera and microphone controls (toggle on/off)
- Recording duration timer
- Pause/resume recording functionality
- Automatic upload to Cloudinary
- Placeholder for transcription service integration (AWS Transcribe, Google Cloud Speech-to-Text, OpenAI Whisper, AssemblyAI)
- Secure storage with encryption
- Recording guidelines and best practices

**Technical Details:**
- Uses WebRTC MediaRecorder API
- Supports VP9 codec with fallback to WebM
- Uploads to Cloudinary `interviews` folder
- Transcription status tracking (pending, processing, completed, failed)
- Recording URL and transcription stored in database

**Access:** Available within Interviewer Dashboard when starting an interview

### 2. Assessment Framework (Aviation Standards)

**Location:** `components/enterprise/InterviewAssessmentForm.tsx`

**Features:**
- Competency-based assessment aligned with ICAO/EBT-CBTA standards
- 8 core competency areas with weighted scoring:
  - Technical Knowledge (15%)
  - Situational Awareness (15%)
  - Decision Making (15%)
  - Communication (15%)
  - Teamwork & CRM (15%)
  - Professionalism (10%)
  - Adaptability (10%)
  - Leadership (5%)
- Automatic overall score calculation
- Auto-grading (A-F based on score thresholds)
- Strengths and areas for improvement tracking
- Detailed feedback text area
- Recommendation system (Hire, Consider, Needs More Assessment, Do Not Hire)
- Recognition Score Impact configuration

**Scoring System:**
- Each competency area: 0-100 points
- Weighted overall score: 0-100 points
- Grade thresholds:
  - A: 90-100 (Exceptional)
  - B: 80-89 (Strong)
  - C: 70-79 (Satisfactory)
  - D: 60-69 (Needs Improvement)
  - F: 0-59 (Unsatisfactory)

**Access:** Available after interview recording is completed

### 3. Feedback Delivery Mechanism

**Location:** `components/enterprise/InterviewFeedbackDelivery.tsx`

**Features:**
- Comprehensive feedback summary (auto-generated from assessment)
- Key takeaways list
- Recommended actions for pilot development
- Resources and training materials (title + URL)
- Delivery method options:
  - Email only
  - Portal only
  - Both email and portal
- Feedback preview functionality
- Pilot viewing tracking
- Pilot rating and comments on feedback
- Email notification integration (placeholder for Firebase/Resend/SendGrid)

**Feedback Content:**
- Summary of assessment
- Overall grade and score
- Key strengths identified
- Areas for improvement
- Recommended actions
- Links to resources and training materials

**Access:** Available after assessment is completed

### 4. Interview Scheduling System

**Location:** Integrated within Interviewer Dashboard

**Features:**
- Interviewer availability management
- Date/time slot configuration
- Timezone support
- Calendar view (placeholder)
- Automated reminders (placeholder)
- Conflict detection (placeholder)
- Integration with enterprise calendar systems (placeholder)

**Database Table:** `interview_schedule_availability`

**Access:** Available in Interviewer Dashboard

### 5. Interviewer Dashboard

**Location:** `components/enterprise/InterviewerDashboard.tsx`

**Features:**
- Central hub for managing all interviews
- Tab-based filtering (Scheduled, In Progress, Completed, All)
- Search by pilot name or email
- Interview statistics overview:
  - Scheduled interviews count
  - In progress count
  - Completed count
  - Total interviews
- Interview list with key information:
  - Pilot name and email
  - Interview status
  - Scheduled date/time
  - Flight hours and recognition score
  - Assessment grade (if completed)
- Quick actions:
  - Start interview
  - Continue interview
  - View assessment
  - Send feedback
- Airbus review status display
- Real-time status updates

**Access:** Enterprise Portal → Interviews tab

### 6. Pilot Recognition Score Integration

**Location:** Integrated within Assessment Form

**Features:**
- Configurable recognition score impact per assessment
- Option to apply score immediately or save as draft
- Automatic score update in `recognition_scores` table
- Score history tracking in `score_history` table
- Score cap at 1000 points
- Floor at 0 points
- Integration with profile `interview_score` field

**Score Impact Logic:**
- Positive assessments can add points (typically 10-50)
- Negative assessments can subtract points (typically -10 to -50)
- Score applied when "Save & Apply to Recognition Score" is clicked
- Timestamp recorded for audit trail

**Access:** Assessment Form → Recognition Impact field

### 7. Airbus Review Workflow (Placeholder)

**Location:** `components/enterprise/AirbusReviewWorkflow.tsx`

**Features:**
- Submit assessments for Airbus partner review
- Review status tracking:
  - Not Submitted
  - Submitted
  - Under Review
  - Approved
  - Rejected
- Progress indicator showing workflow stages
- Review notes for context
- Partnership information display
- Future integration with Airbus systems

**Strategic Purpose:**
- Foundation for upcoming Airbus partnership
- Enables validation of pilot competency by Airbus
- Identifies candidates for Airbus-aligned programs
- Premium subscription differentiator

**Access:** Available for completed assessments (manager/interviewer action)

### 8. Interview History Tracking

**Location:** `components/enterprise/InterviewHistoryPage.tsx`

**Features:**
- Comprehensive interview history for pilots
- Statistics overview:
  - Total interviews
  - Completed interviews
  - Average score
  - Pending feedback count
- Detailed interview list with:
  - Interview type
  - Status
  - Date
  - Duration
  - Grade
  - Score
  - Feedback status
  - Viewing status
- Detailed view modal with:
  - Full assessment results
  - Strengths and areas for improvement
  - Complete feedback summary
  - Key takeaways
  - Recommended actions
  - Video recording playback
  - Full transcription
- Search and filter functionality

**Access:** Enterprise Portal → Interview History tab (for pilots)

## Database Schema

### Tables

#### interviews
Stores interview sessions between pilots and interviewers.

**Key Fields:**
- `id` (UUID, Primary Key)
- `pilot_profile_id` (UUID, FK to profiles)
- `interviewer_id` (UUID, FK to auth.users)
- `enterprise_account_id` (UUID, FK to enterprise_accounts)
- `scheduled_at` (TIMESTAMPTZ)
- `started_at` (TIMESTAMPTZ)
- `completed_at` (TIMESTAMPTZ)
- `duration_minutes` (INTEGER)
- `interview_type` (VARCHAR) - technical, hr, simulation, assessment
- `status` (VARCHAR) - scheduled, in_progress, completed, cancelled, no_show
- `recording_url` (TEXT) - Cloudinary URL
- `transcription` (TEXT)
- `transcription_status` (VARCHAR)
- `job_opportunity_id` (UUID, FK to job_opportunities)
- `notes` (TEXT)
- `airbus_review_status` (VARCHAR)
- `airbus_review_notes` (TEXT)
- `airbus_reviewed_at` (TIMESTAMPTZ)
- `airbus_reviewed_by` (UUID, FK to auth.users)

#### interview_assessments
Stores assessment scores and feedback for interviews.

**Key Fields:**
- `id` (UUID, Primary Key)
- `interview_id` (UUID, FK to interviews)
- `interviewer_id` (UUID, FK to auth.users)
- `overall_score` (INTEGER, 0-100)
- `overall_grade` (VARCHAR, A-F)
- Competency scores (0-100 each):
  - `technical_knowledge_score`
  - `situational_awareness_score`
  - `decision_making_score`
  - `communication_score`
  - `teamwork_score`
  - `crm_score`
  - `professionalism_score`
  - `adaptability_score`
  - `leadership_score`
  - `emergency_procedures_score`
  - `instrument_procedures_score`
  - `weather_interpretation_score`
- `strengths` (TEXT[])
- `areas_for_improvement` (TEXT[])
- `detailed_feedback` (TEXT)
- `recommendation` (VARCHAR)
- `recognition_score_impact` (INTEGER)
- `applied_to_recognition_score` (BOOLEAN)
- `applied_at` (TIMESTAMPTZ)

#### interview_feedback
Stores feedback delivered to pilots after interviews.

**Key Fields:**
- `id` (UUID, Primary Key)
- `interview_id` (UUID, FK to interviews)
- `pilot_profile_id` (UUID, FK to profiles)
- `feedback_delivered` (BOOLEAN)
- `delivered_at` (TIMESTAMPTZ)
- `delivery_method` (VARCHAR) - email, portal, both
- `viewed_by_pilot` (BOOLEAN)
- `viewed_at` (TIMESTAMPTZ)
- `summary` (TEXT)
- `key_takeaways` (TEXT[])
- `recommended_actions` (TEXT[])
- `resources` (JSONB)
- `pilot_response` (TEXT)
- `pilot_response_at` (TIMESTAMPTZ)
- `pilot_rating` (INTEGER, 1-5)
- `pilot_comments` (TEXT)

#### interview_schedule_availability
Stores interviewer availability for scheduling.

**Key Fields:**
- `id` (UUID, Primary Key)
- `interviewer_id` (UUID, FK to auth.users)
- `date` (DATE)
- `start_time` (TIME)
- `end_time` (TIME)
- `is_available` (BOOLEAN)
- `timezone` (VARCHAR)
- `notes` (TEXT)

## Security & Access Control

### Row Level Security (RLS) Policies

**interviews table:**
- Interviewers can view their own interviews
- Pilots can view their own interviews
- Enterprise users can view interviews for their enterprise
- Interviewers can insert and update their own interviews

**interview_assessments table:**
- Interviewers can view their own assessments
- Pilots can view assessments for their interviews
- Interviewers can insert and update their own assessments

**interview_feedback table:**
- Pilots can view their own feedback
- Interviewers can view feedback for their interviews
- Interviewers can insert feedback
- Pilots can update their feedback response

**interview_schedule_availability table:**
- Interviewers can view, insert, update, and delete their own availability

## Integration Points

### With Existing Enterprise Portal Features

1. **Pilot Search:** Can initiate interviews directly from pilot search results
2. **Applications:** Can convert applications to interviews
3. **Job Listings:** Interviews can be linked to specific job opportunities
4. **Analytics:** Interview metrics included in enterprise analytics
5. **Airline Expectations:** Interview expectations aligned with airline requirements

### With Pilot Recognition Score

- Assessments can boost pilot recognition scores
- Score impact configurable per assessment
- Score history tracked for audit
- Interview score field in profiles

### With Airbus Partnership (Future)

- Airbus review workflow placeholder
- Approved assessments marked for Airbus programs
- Integration with Airbus training systems (planned)

## User Workflows

### Interviewer Workflow

1. **Schedule Interview**
   - Navigate to Interviews tab
   - Click "Schedule Interview"
   - Select pilot from search or applications
   - Choose date/time from availability
   - Set interview type (technical, hr, simulation)

2. **Conduct Interview**
   - Navigate to Interviews tab
   - Find scheduled interview
   - Click "Start" to begin recording
   - Enable camera/microphone
   - Conduct interview
   - Pause/resume as needed
   - Click "Stop" when complete
   - Review recording
   - Upload and transcribe

3. **Complete Assessment**
   - After recording completes, assessment form opens
   - Rate each competency area (0-100)
   - Add strengths and areas for improvement
   - Provide detailed feedback
   - Select recommendation
   - Set recognition score impact
   - Save as draft or apply to recognition score

4. **Deliver Feedback**
   - After assessment completes, feedback form opens
   - Review auto-generated summary
   - Add key takeaways
   - Add recommended actions
   - Add resources/training materials
   - Choose delivery method (email, portal, both)
   - Preview feedback
   - Deliver to pilot

5. **Submit for Airbus Review** (Optional)
   - For high-performing assessments
   - Click "Submit for Airbus Review"
   - Add review notes
   - Track review status
   - Receive notification when review complete

### Pilot Workflow

1. **Receive Interview Invitation**
   - Email notification
   - Calendar invite
   - Portal notification

2. **Attend Interview**
   - Join at scheduled time
   - Enable camera/microphone
   - Participate in interview

3. **View Feedback**
   - Navigate to Interview History
   - Find completed interview
   - View detailed feedback
   - Review strengths and areas for improvement
   - Access recommended resources
   - Rate feedback quality
   - Provide response

4. **Track Progress**
   - View interview history
   - See average scores
   - Monitor recognition score impact
   - Identify development areas

## Technical Requirements

### Browser Support
- Modern browsers with WebRTC support
- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

### Dependencies
- React 18+
- Framer Motion (animations)
- Lucide React (icons)
- Supabase (database/auth)
- Cloudinary (video storage)

### External Services (Placeholders/To Be Integrated)
- **Transcription Service:** AWS Transcribe, Google Cloud Speech-to-Text, OpenAI Whisper, or AssemblyAI
- **Email Service:** Firebase Cloud Functions, Resend, or SendGrid
- **Calendar Integration:** Google Calendar, Outlook Calendar
- **Airbus Integration:** Partner API (future)

## Configuration

### Cloudinary
- Upload preset: `enterprise_unsigned`
- Folder: `interviews`
- Resource type: `video`

### Supabase
- Project ID: `gkbhgrozrzhalnjherfu`
- Tables: interviews, interview_assessments, interview_feedback, interview_schedule_availability
- RLS enabled on all tables

## Future Enhancements

1. **Real-time Transcription:** Integrate live transcription during recording
2. **AI-Powered Assessment:** Use AI to suggest scores based on transcription analysis
3. **Automated Scheduling:** Smart scheduling with conflict detection
4. **Video Analysis:** Computer vision for non-verbal communication analysis
5. **Multi-language Support:** Transcription and feedback in multiple languages
6. **Mobile App:** Native mobile app for on-the-go interviews
7. **Peer Review:** Allow multiple interviewers to review same interview
8. **Calibration:** Regular calibration sessions for interviewers
9. **Advanced Analytics:** Deeper insights into interview performance trends
10. **Airbus Integration:** Full integration with Airbus training and assessment systems

## Troubleshooting

### Recording Issues
- Ensure camera/microphone permissions are granted
- Check browser compatibility
- Verify network connectivity
- Test with different devices

### Transcription Issues
- Check transcription service configuration
- Verify audio quality
- Ensure sufficient audio duration
- Review transcription service logs

### Score Integration Issues
- Verify pilot profile exists
- Check recognition_scores table
- Review RLS policies
- Ensure score impact is within valid range

## Support

For issues or questions:
- Use the Support page in the portal
- Email: enterprise@pilotrecognition.com
- Documentation: /docs/INTERVIEW_ASSESSMENT_SYSTEM_DOCUMENTATION.md

## Strategic Impact

### Premium Subscription Differentiator
- Skill validation beyond hours/experience
- Personalized feedback from industry experts
- Recognition score boost through assessments
- Airbus partnership validation (future)

### Partnership Foundation
- Provides data for Airbus partnership
- Validates pilot competency standards
- Identifies high-potential candidates
- Enables exclusive program access

### Industry Leadership
- First-of-its-kind interview assessment system
- Aviation-standard competency framework
- Data-driven pilot evaluation
- Continuous improvement loop
