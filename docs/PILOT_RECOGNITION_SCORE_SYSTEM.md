# Pilot Recognition Score System

## Overview

The Pilot Recognition Score System is a comprehensive algorithm and dashboard that calculates and displays pilot recognition scores based on multiple factors including flight hours, experience, assessments, and mentorship activities.

## Score Calculation Algorithm

### Score Range: 0-1000 points

The score is calculated using weighted components:

- **Flight Hours (35%)**: 0-350 points
  - Total hours with diminishing returns
  - PIC ratio bonus
  - IFR and night hours

- **Experience (25%)**: 0-250 points
  - Years of experience
  - Achievements and certifications
  - Licenses and type ratings

- **Assessments (25%)**: 0-250 points
  - Program completion percentage
  - Performance score in evaluations

- **Mentorship (15%)**: 0-150 points
  - Mentorship hours
  - Observation sessions
  - Cases handled

### Score Tiers

- **Platinum**: 900+ points
- **Gold**: 800-899 points
- **Silver**: 700-799 points
- **Bronze**: 600-699 points
- **Copper**: 500-599 points
- **Steel**: 400-499 points
- **Iron**: 0-399 points

## Database Schema

### recognition_scores Table

```sql
CREATE TABLE recognition_scores (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  total_score INTEGER CHECK (total_score >= 0 AND total_score <= 1000),
  hours_score INTEGER CHECK (hours_score >= 0),
  experience_score INTEGER CHECK (experience_score >= 0),
  assessment_score INTEGER CHECK (assessment_score >= 0),
  mentorship_score INTEGER CHECK (mentorship_score >= 0),
  score_tier VARCHAR(20),
  breakdown JSONB,
  recommendations JSONB,
  last_calculated_at TIMESTAMP,
  created_at TIMESTAMP,
  updated_at TIMESTAMP,
  UNIQUE(user_id)
);
```

## Components

### Core Library
- `lib/pilot-recognition-score.ts` - Score calculation algorithm

### Services
- `services/recognition-score-service.ts` - Backend service for score operations

### Hooks
- `src/hooks/useRecognitionScore.ts` - React hook for real-time score updates

### UI Components
- `components/RecognitionScoreDisplay.tsx` - Detailed score breakdown display
- `components/RecognitionScoreCard.tsx` - Compact score card
- `components/LeaderboardTable.tsx` - Leaderboard with filtering
- `components/ScoreOptimizationGuide.tsx` - Personalized improvement recommendations
- `components/RecognitionDashboard.tsx` - Main dashboard integrating all features

### Edge Functions
- `supabase/functions/recognition-score/index.ts` - Backend API for score calculations

## Usage

### Calculate Score

```typescript
import { calculateRecognitionScore } from '../lib/pilot-recognition-score';

const input: PilotScoreInput = {
  stats: {
    totalHours: 500,
    picHours: 300,
    ifrHours: 100,
    nightHours: 75,
  },
  experience: {
    years: 3,
    achievements: 5,
    licenses: 3,
  },
  assessments: {
    programCompletion: 85,
    performanceScore: 90,
  },
  mentorship: {
    hours: 20,
    observations: 15,
    cases: 5,
  },
};

const result = calculateRecognitionScore(input);
console.log(result.totalScore); // e.g., 650
console.log(result.scoreTier); // e.g., "Bronze"
```

### Use in React Component

```typescript
import { useRecognitionScore } from '../src/hooks/useRecognitionScore';
import { RecognitionDashboard } from '../components/RecognitionDashboard';

function MyComponent() {
  return <RecognitionDashboard />;
}
```

### Update Score via Service

```typescript
import { updateRecognitionScore } from '../services/recognition-score-service';

await updateRecognitionScore(userId, scoreInput);
```

## Real-Time Updates

The system uses Supabase real-time subscriptions to automatically update the UI when scores change:

```typescript
const { score, loading, error, updateScore, leaderboard, rank } = useRecognitionScore();
```

## Optimization Guidance

The system provides personalized recommendations based on current score:

- Identifies areas with highest potential for improvement
- Estimates point gains for each action
- Categorizes by difficulty and time estimate
- Highlights actionable items

## Leaderboard

Features:
- Global ranking by total score
- Filter by score tier
- Real-time updates
- Shows current user's rank
- Displays pilot profiles with images

## API Endpoints (Edge Function)

### GET /functions/v1/recognition-score
Get current user's recognition score

### POST /functions/v1/recognition-score/calculate
Calculate and update score for current user

### GET /functions/v1/leaderboard
Get leaderboard with optional tier filter

## Security

- RLS policies ensure users can only view their own scores
- JWT verification required for all operations
- Admin functions restricted to super_admin role

## Performance

- Indexed queries for fast leaderboard lookups
- Efficient score calculation with O(1) complexity
- Real-time subscriptions minimize unnecessary fetches
- Breakdown stored as JSONB for efficient retrieval

## Future Enhancements

- [ ] Add historical score trends visualization
- [ ] Implement score comparison with peers
- [ ] Add badges and achievements based on milestones
- [ ] Create score prediction based on planned activities
- [ ] Add social sharing for score achievements
- [ ] Implement score-based access control for features
