# MCP Security Configuration

## Overview
This document describes the security architecture for AI (MCP) interactions with the Supabase database.

## Core Principle
The AI NEVER writes directly to live user profile tables. All AI-generated data goes through a **staging → approval** flow.

## Architecture

```
[ AI Model (MCP) ]
       │
       │ Restricted API Key (anon key only)
       ▼
[ SUPABASE STAGING TABLE: pending_profiles ]
       │
       │ User clicks "Approve"
       ▼
[ LIVE TABLE: profiles ]
```

## Security Rules

### 1. No service_role Key for MCP
- The MCP server connects using the **anon key** only
- The anon key respects RLS policies
- AI cannot bypass row-level security
- AI cannot read other users' data
- AI cannot delete the database

### 2. Staging Table Isolation
- Table: `public.pending_profiles`
- Anonymous sessions can INSERT (AI writes)
- Authenticated users can SELECT/UPDATE their own rows
- Data expires after 7 days if not approved
- No foreign keys to live tables (prevents cascade issues)

### 3. Audit Trail
All AI actions are tracked:
- `created_by` column: `'ai_mcp_agent'`
- `updated_by` column: `'ai_mcp_agent'` or `'user_approval'`
- `data_source` column: `'ai_staging_approved'` (when promoted)
- `ai_confidence_score`: 0-100 (AI certainty in generated data)

## Data Flow

### AI Generates Profile Data
1. AI detects user intent (e.g., "I have 1500 hours, CPL license")
2. AI INSERTs into `pending_profiles` with `session_id`
3. Frontend stores `session_id` in `localStorage`
4. AI response: "I've drafted your profile. Please review it after signing up."

### User Signs Up
1. User completes signup with Terms Acceptance
2. Dashboard checks `localStorage` for `pr_pending_session_id`
3. If found, `<AIProfileReview />` component displays the draft
4. User clicks "Approve & Sync" or "Reject & Enter Manually"

### User Approves
1. Frontend calls `promote_pending_profile(p_session_id)`
2. Function marks pending row as `approved`
3. Function copies data to `profiles` table (only null fields)
4. Function sets `data_source = 'ai_staging_approved'`
5. `localStorage` key is cleared

## Risk Mitigation

| Risk | Mitigation |
|------|-----------|
| AI hallucinates wrong flight hours | User must approve before data goes live |
| AI overwrites existing user data | Promotion only fills NULL fields (COALESCE) |
| AI leaks data to wrong user | RLS + session_id isolation |
| AI deletes data | No DELETE permissions on live tables |
| Prompt injection attack | Anon key only; cannot escalate privileges |

## Implementation

### Frontend
```tsx
import { AIProfileReview } from './components/AIProfileReview';

// In dashboard or profile page:
<AIProfileReview />
```

### Edge Function (if needed)
```ts
// Call from frontend after login:
const { data } = await supabase
  .rpc('promote_pending_profile', { p_session_id: sessionId });
```

## Database Schema

### pending_profiles
| Column | Type | Purpose |
|--------|------|---------|
| id | uuid | PK |
| session_id | text | Browser session (anonymous) |
| estimated_flight_hours | text | AI-generated hours |
| license_type | text | AI-generated license |
| license_ratings | text[] | AI-generated ratings |
| type_ratings | text[] | AI-generated type ratings |
| pathway_interests | text[] | AI-generated pathways |
| program_interests | text[] | AI-generated programs |
| source | text | `'ai_mcp_agent'` |
| confidence_score | int | 0-100 |
| created_at | timestamptz | Timestamp |
| updated_at | timestamptz | Timestamp |
| created_by | text | `'ai_mcp_agent'` |
| updated_by | text | `'ai_mcp_agent'` |
| approved_by_user_id | uuid | FK to auth.users |
| approved_at | timestamptz | Approval timestamp |
| approval_status | text | `pending/approved/rejected/expired` |

### profiles (audit columns)
| Column | Type | Purpose |
|--------|------|---------|
| created_by | text | `'user_signup'` or `'ai_staging_approved'` |
| updated_by | text | Who last updated |
| data_source | text | `'direct_user_input'` or `'ai_staging_approved'` |
| ai_confidence_score | int | Confidence if AI-generated |

## Legal Protection

By using this staging → approval flow:
1. **AI liability is isolated** — AI cannot corrupt live data
2. **User responsibility is explicit** — User clicks "Approve"
3. **Audit trail exists** — Every AI action is logged with `created_by = 'ai_mcp_agent'`
4. **Data accuracy is user-verified** — Pilot confirms their own flight hours

## Enabling Leaked Password Protection (Manual Step)

In Supabase Dashboard:
1. Go to Authentication → Settings
2. Under "Passwords"
3. Enable "Prevent using leaked passwords"
4. This checks HaveIBeenPwned.org on signup
