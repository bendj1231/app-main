# Mentorship Platform Integration

This document describes the mentorship platform integration for assisting Agent 2 with the mentorship system development.

## Overview

The mentorship platform enables experienced pilots (mentors) to guide and support less experienced pilots (mentees) through their career journey. The system includes mentor matching, session tracking, messaging, badges, analytics, and a community forum.

## Components Created

### 1. Mentor Matching System (`src/hooks/useMentorMatching.ts`)

A comprehensive mentor matching algorithm that pairs mentees with mentors based on:

- **Experience compatibility** (max 35 points): Mentors with 100+ more hours get full points
- **Aircraft type compatibility** (max 20 points): Shared aircraft expertise
- **Program/pathway interests** (max 15 points): Shared interests
- **Geographic proximity** (max 10 points): Same country for easier coordination
- **Mentor tier bonus** (max 10 points): Senior/expert mentors
- **Mentorship experience bonus** (max 10 points): Based on mentorship hours
- **Premium priority matching** (max 25 points): Premium users get priority access to top-tier mentors

**Usage:**
```tsx
import { useMentorMatching } from '@/hooks/useMentorMatching';

const { matches, loading, requestMentorship } = useMentorMatching(menteeId, isPremium);
```

### 2. Mentorship Tracking System (`src/hooks/useMentorshipTracking.ts`)

Tracks mentorship sessions, hours, and outcomes with the following features:

- Session management (video_call, in_person, observation, case_review, general)
- Duration tracking in hours
- Topic and notes recording
- Outcomes tracking
- Dual rating system (mentor_rating and mentee_rating)
- Statistics calculation (total sessions, hours, average rating, sessions by type)

**Usage:**
```tsx
import { useMentorshipTracking } from '@/hooks/useMentorshipTracking';

const { sessions, stats, addSession, rateSession } = useMentorshipTracking(userId, 'mentor');
```

### 3. Mentorship Badges System (`src/hooks/useMentorshipBadges.ts`)

Gamification system with 12 badge tiers:

**Bronze Badges:**
- First Steps (first mentee)
- Mentor to Five (5 mentees)
- Dedicated Mentor (10+ hours)

**Silver Badges:**
- Mentor to Ten (10 mentees)
- Experienced Mentor (50+ hours)
- Year of Service (1+ year active)

**Gold Badges:**
- Community Leader (25 mentees)
- Veteran Mentor (100+ hours)
- Perfect Score (5.0 rating with 10+ sessions)
- High Impact (80+ impact score)

**Platinum Badges:**
- Master Mentor (50 mentees)
- Atlas Mentor (25 mentees, 100+ hours, 4.5+ rating, 85+ impact)

**Usage:**
```tsx
import { useMentorshipBadges } from '@/hooks/useMentorshipBadges';

const { badges, availableBadges, earnBadge, toggleBadgeDisplay } = useMentorshipBadges(userId);
```

### 4. Mentorship Analytics (`src/hooks/useMentorshipAnalytics.ts`)

Comprehensive analytics for mentors including:

- Total mentees helped
- Total hours contributed
- Average session duration
- Impact score (composite metric)
- Sessions by month
- Mentee progress tracking
- Top topics
- Rating distribution

**Impact Score Calculation:**
- Mentee diversity (max 30 points): 3 points per mentee
- Hours contributed (max 30 points): 0.5 points per hour
- Session frequency (max 20 points): 0.5 points per session
- Quality rating (max 20 points): 4 points per rating point

**Usage:**
```tsx
import { useMentorshipAnalytics } from '@/hooks/useMentorshipAnalytics';

const { analytics, loading, fetchAnalytics } = useMentorshipAnalytics(mentorId);
```

### 5. Mentorship Messaging (`src/hooks/useMentorshipMessaging.ts`)

Real-time messaging system between mentors and mentees:

- Conversation list with unread counts
- Message threads per mentorship request
- Read/unread status tracking
- File attachment support
- Timestamp tracking

**Usage:**
```tsx
import { useMentorshipMessaging } from '@/hooks/useMentorshipMessaging';

const { conversations, messages, sendMessage, markMessagesAsRead } = useMentorshipMessaging(userId);
```

### 6. Mentor Profile Pages (`portal/pages/MentorProfilePage.tsx`)

Detailed mentor profile with:

- Profile information and tier badge
- Mentorship statistics (hours, sessions, rating)
- Expertise areas (aircraft, ratings, certifications)
- Program interests
- Recent sessions tab
- Reviews tab (placeholder)

### 7. Mentor Matching Card (`components/MentorMatchingCard.tsx`)

UI component for displaying mentor matches:

- Compatibility score (0-100%)
- Match reasons
- Mentor tier badge
- Aircraft expertise
- Program interests
- Mentorship stats
- Request mentorship button
- Premium priority indicator

### 8. Recognition Score Integration (`supabase/functions/recognition-score/index.ts`)

Mentorship contributes to Recognition Score calculation:

```typescript
mentorship: {
  hours: pilotData.data?.mentorship_hours || 0,
  observations: pilotData.data?.mentorship_observations || 0,
  cases: pilotData.data?.mentorship_cases || 0,
}

const mentorshipScore = Math.min((scoreInput.mentorship.hours / 100) * 150, 150);
```

Mentorship hours contribute up to 150 points out of 1000 total Recognition Score.

## Database Schema

### Tables Created

#### mentorship_requests
- Tracks mentorship requests from mentees to mentors
- Status workflow: pending → accepted → completed / rejected / cancelled
- Stores compatibility score and match reasons
- RLS enabled for privacy

#### mentorship_sessions
- Tracks individual mentorship sessions
- Session types: video_call, in_person, observation, case_review, general
- Duration tracking in hours
- Dual rating system
- Updates mentorship_hours in profiles table

#### mentorship_messages
- Real-time messaging between mentors and mentees
- Linked to mentorship_requests
- Read/unread status tracking
- File attachment support

#### mentorship_forum_categories
- Forum category definitions
- Default categories: General Discussion, Interview Preparation, Type Ratings, Career Pathways, Technical Questions, Success Stories

#### mentorship_forum_posts
- Forum posts with categories
- Tags, view count, reply count, like count
- Pinned and locked post support

#### mentorship_forum_replies
- Threaded replies to forum posts
- Parent reply support for nested replies
- Like count tracking

#### mentorship_forum_likes
- Like system for posts and replies
- Prevents duplicate likes via unique indexes
- Separate indexes for post and reply likes

#### mentorship_badges
- Already existed
- Stores earned badges for users
- Badge tier tracking (bronze, silver, gold, platinum)

### Existing Tables Used

#### profiles
- Contains mentorship-related fields:
  - `mentorship_hours`: Total mentorship hours completed
  - `mentorship_endorsement`: Endorsement rating (1-5)
  - `mentor_tier`: Mentor tier (senior, expert, standard)
  - `role`: User role (mentor_manager, mentor, mentee)
  - `aircraft_rated_on`: Aircraft expertise
  - `program_interests`: Program interests
  - `pathway_interests`: Pathway interests
  - `ratings`: Certifications and ratings

## Features Implemented

### 1. Mentor Matching System ✓
- Compatibility scoring algorithm
- Multiple matching criteria (experience, aircraft, interests, location)
- Premium priority matching
- Match reason explanations

### 2. Mentorship Tracking System ✓
- Session creation and management
- Hours tracking
- Outcome recording
- Dual rating system
- Statistics calculation

### 3. Score Boost for Mentors ✓
- Recognition Score integration
- Mentorship hours contribute up to 150 points
- Automatic score recalculation via Edge Function

### 4. Mentor Profile Pages ✓
- Detailed profile with expertise areas
- Mentorship statistics
- Session history
- Reviews (placeholder)

### 5. Mentee Request System ✓
- Request creation with message
- Status tracking (pending, accepted, rejected, completed, cancelled)
- Real-time messaging threads
- Read/unread status

### 6. Mentorship Analytics ✓
- Comprehensive metrics
- Impact score calculation
- Time-based analysis
- Progress tracking

### 7. Mentorship Badges ✓
- 12 badge definitions across 4 tiers
- Automatic badge eligibility checking
- Badge display management
- Atlas Mentor certification

### 8. Community Forum ✓
- Category-based discussions
- Post creation with tags
- Threaded replies
- Like system
- View and reply counts

### 9. Premium Integration ✓
- Priority matching for premium users
- Access to senior/expert mentors
- Enhanced matching algorithm

## RLS Policies

All mentorship tables have Row Level Security enabled:

- **mentorship_requests**: Users can view own requests, mentees can create, mentors can update status
- **mentorship_sessions**: Users can view sessions they're involved in, can create/update own sessions
- **mentorship_messages**: Users can view own messages, can send in own requests, can mark as read
- **mentorship_forum_posts**: Public read, authenticated users can create/update/delete own posts
- **mentorship_forum_replies**: Public read, authenticated users can create/update/delete own replies
- **mentorship_forum_likes**: Public read, authenticated users can create/delete own likes
- **mentorship_badges**: Users can view own badges

## Integration Points

### 1. Portal Integration

The mentorship system integrates with the existing portal:

- `portal/pages/MentorProfilePage.tsx` - Mentor profiles
- `portal/pages/MentorMatchingPage.tsx` - Mentor matching interface
- `portal/pages/MentorshipMessagingPage.tsx` - Messaging interface
- `portal/pages/MentorshipAnalyticsPage.tsx` - Analytics dashboard
- `portal/pages/MentorRecognitionSystemPage.tsx` - Recognition system

### 2. Recognition Score Integration

Mentorship hours automatically contribute to Recognition Score via the `recognition-score` Edge Function:

```typescript
const mentorshipScore = Math.min((scoreInput.mentorship.hours / 100) * 150, 150);
```

### 3. Premium Integration

Premium users get enhanced matching:

```typescript
if (isPremium) {
  if (mentor.mentor_tier === 'senior' || mentor.mentor_tier === 'expert') {
    score += 15; // Priority access to top-tier mentors
  }
  if (mentor.mentorship_hours >= 50) {
    score += 10; // Experienced mentors prioritized
  }
}
```

## User Flows

### Mentor Flow

1. User signs up and applies to become a mentor
2. Admin approves mentor application (sets role to 'mentor')
3. Mentor profile is visible in matching system
4. Mentees can request mentorship
5. Mentor accepts/rejects requests
6. Mentor conducts sessions and tracks hours
7. Mentor earns badges and Recognition Score points
8. Mentor participates in community forum

### Mentee Flow

1. User signs up as mentee
2. Mentee browses available mentors
3. System suggests compatible mentors
4. Mentee requests mentorship with message
5. Mentor accepts request
6. Mentee schedules and attends sessions
7. Mentee rates mentor sessions
8. Mentee participates in community forum

## Strategic Impact

- **Community Building**: Fosters a supportive pilot community
- **Viral Growth**: Mentors invite their network to join
- **Score Gamification**: Helping others increases Recognition Score
- **Premium Justification**: Premium users get priority mentor access
- **Knowledge Sharing**: Community forum for peer learning
- **Career Advancement**: Structured mentorship accelerates career growth

## Testing

### Test Mentor Matching
1. Create test mentee and mentor profiles
2. Set different experience levels, aircraft types, interests
3. Call `useMentorMatching` hook
4. Verify compatibility scores and match reasons
5. Test premium priority matching

### Test Mentorship Tracking
1. Create mentorship request
2. Accept request
3. Add session with duration and notes
4. Verify mentorship_hours updated in profiles
5. Rate session
6. Check statistics calculation

### Test Badges
1. Complete mentorship sessions
2. Check badge eligibility
3. Earn badge
4. Verify badge display
5. Test Atlas Mentor certification criteria

### Test Messaging
1. Create mentorship request
2. Send message
3. Verify unread count
4. Mark as read
5. Check conversation list

### Test Forum
1. Create forum post
2. Add reply
3. Like post and reply
4. Verify counts
5. Test category filtering

## Future Enhancements

- Video call integration for sessions
- Automated session scheduling
- Mentor certification verification
- Advanced forum features (search, notifications)
- Mentor-mentee pairing algorithm refinement
- Session recording and playback
- Resource sharing between mentors and mentees
- Mentor training modules
- Impact reporting for sponsors
- Mobile app notifications
- AI-powered mentor recommendations

## Troubleshooting

### Mentor Matching Not Working
- Verify user roles are set correctly
- Check profiles have required fields (hours, aircraft, interests)
- Ensure mentor status is 'active'
- Test matching algorithm with different profiles

### Sessions Not Tracking
- Verify mentorship_requests table exists
- Check RLS policies allow session creation
- Ensure mentor_id and mentee_id are correct
- Test session creation directly in database

### Badges Not Earning
- Verify badge criteria logic
- Check mentorship_sessions data
- Ensure stats calculation is correct
- Test badge eligibility checking

### Messages Not Sending
- Verify mentorship_requests status is 'accepted'
- Check RLS policies allow message creation
- Ensure sender_id and receiver_id are correct
- Test message creation directly in database

## Documentation References

- `src/hooks/useMentorMatching.ts` - Mentor matching algorithm
- `src/hooks/useMentorshipTracking.ts` - Session tracking
- `src/hooks/useMentorshipBadges.ts` - Badge system
- `src/hooks/useMentorshipAnalytics.ts` - Analytics
- `src/hooks/useMentorshipMessaging.ts` - Messaging
- `components/MentorMatchingCard.tsx` - Matching UI
- `portal/pages/MentorProfilePage.tsx` - Profile pages
- `supabase/functions/recognition-score/index.ts` - Score integration
