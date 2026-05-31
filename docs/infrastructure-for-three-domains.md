# Infrastructure Architecture: Three Domains, One Platform

## Overview

**The Three Domains:**
1. **pilotrecognition.com** — Main platform, verification, wallet, enterprise
2. **pilotcareerpathways.com** — Career pathways, job matching, programs
3. **pilotshortage.org** — PSA advocacy, stories, UCF framework

**Core Principle:** One backend, three front doors. Shared infrastructure with domain-specific routing.

---

## LAYER 1: Shared Core Infrastructure

### 1.1 Database (Supabase)

**Single Project:** `gkbhgrozrzhalnjherfu`

```sql
-- Domain routing column on all tables
ALTER TABLE profiles ADD COLUMN domain_source VARCHAR(50); 
-- 'recognition', 'pathways', 'shortage'

-- RLS policies enforce domain boundaries
CREATE POLICY "recognition_users" ON profiles 
  FOR SELECT USING (domain_source = 'recognition' OR domain_source IS NULL);
```

**Schema Organization:**
| Schema | Purpose | Tables |
|--------|---------|--------|
| `public` | Shared data | profiles, credentials, verification_logs |
| `recognition` | Wallet + enterprise | wallets, vc_credentials, enterprise_contracts |
| `pathways` | Career data | pathways, applications, program_enrollments |
| `shortage` | Advocacy | stories, ucf_pillars, advocacy_campaigns |
| `analytics` | Cross-domain | events, funnel_metrics, attribution |

### 1.2 Authentication (Supabase Auth)

**Single Auth System, Domain-Aware:**

```typescript
// Sign-up detects domain from hostname
const domain = getDomainFromHostname(window.location.hostname);

await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      domain_source: domain, // 'recognition' | 'pathways' | 'shortage'
      signup_path: window.location.pathname,
    }
  }
});
```

**Session Handling:**
- Cookie domain: `.pilotrecognition.com` (shared across all subdomains)
- JWT includes `domain_source` claim
- RLS policies enforce domain boundaries

### 1.3 Edge Functions (Supabase)

**Shared Functions (All Domains):**
```
supabase/functions/
├── _shared/                    # Shared utilities
│   ├── cors.ts
│   ├── supabase.ts
│   └── jwt.ts
├── auth/                       # Domain-aware auth
│   ├── register.ts
│   └── verify-domain.ts
├── verification/               # Core verification engine
│   ├── verify-license.ts
│   ├── verify-medical.ts
│   └── verify-hours.ts
├── wallet/                     # W3C credentials
│   ├── issue-credential.ts
│   ├── verify-credential.ts
│   └── status-check.ts
├── veremark-webhook/           # Background check integration
│   └── index.ts
└── analytics/                  # Cross-domain tracking
    └── track-event.ts
```

**Domain-Specific Functions:**
```
supabase/functions/
├── pathways/                   # pilotcareerpathways.com
│   ├── match-pathway.ts
│   ├── submit-application.ts
│   └── program-progress.ts
└── shortage/                   # pilotshortage.org
    ├── submit-story.ts
    ├── moderate-content.ts
    └── ucf-metrics.ts
```

### 1.4 Storage (Supabase + R2)

**Data Classification:**
| Type | Storage | Access |
|------|---------|--------|
| Pilot PII (passports, medicals) | Supabase Private Buckets | RLS-protected |
| Public profile images | Cloudinary | CDN public |
| Verified credentials | R2 (encrypted) | Wallet-only |
| UCF documents | R2 public bucket | Public read |
| Story media (PSA) | R2 private + CDN | Domain-gated |

**Bucket Structure:**
```
recognition-private/          # License scans, medical docs
  ├── {profile_id}/
  │   ├── license/
  │   ├── medical/
  │   └── logbook/

pathways-public/              # Program assets, certificates
  ├── programs/
  ├── certificates/
  └── badges/

shortage-media/               # PSA stories (anonymized)
  ├── stories/
  │   ├── {story_id}/audio/
  │   └── {story_id}/video/

ucf-public/                   # Framework documents
  ├── pillars/
  └── downloads/
```

---

## LAYER 2: Domain-Specific Infrastructure

### 2.1 pilotrecognition.com (Main Platform)

**Primary Focus:** Verification, wallet, enterprise B2B

**Unique Components:**

#### A. Wallet Infrastructure
```typescript
// lib/wallet/  (existing)
├── types/
│   └── schemas.ts           # W3C VC types
├── enclave.ts               # Tier 1: HSM key management
├── storage.ts               # Tier 2: AES-256-GCM encrypted DB
├── statusList.ts            # Tier 3: Bitstring revocation
└── vcBuilder.ts             # VC issuance logic
```

**Technical Stack:**
- **Tier 1 (Enclave):** WebCrypto non-extractable keys
- **Tier 2 (Storage):** IndexedDB + PBKDF2 encryption
- **Tier 3 (Status):** 60s polling circuit breaker
- **Tier 4 (Audit):** Immutable Supabase logs

#### B. Enterprise Dashboard
```typescript
// components/enterprise/
├── EnterprisePortalApp.tsx   # Main dashboard shell
├── AirbusReviewWorkflow.tsx  # Airline-specific flows
├── PilotSearchView.tsx       # Pull API interface
├── VerificationQueue.tsx     # Pending verifications
└── AnalyticsDashboard.tsx    # Hiring metrics
```

**Enterprise API:**
```typescript
// /api/enterprise/
├── search.ts                # POST /api/enterprise/search
│   // Query verified pilots by rating, hours, location
├── pull-profile.ts          # GET /api/enterprise/profile/{id}
│   // Full verified profile with EBT video
└── hire-webhook.ts          # POST /api/enterprise/hire
    // Success fee trigger ($500 per placement)
```

#### C. Verification Pipeline
```
┌─────────────┐    ┌──────────────┐    ┌─────────────┐    ┌─────────────┐
│   Upload    │───▶│   Queue      │───▶│   Verify    │───▶│   Issue     │
│  Document   │    │  (Supabase   │    │  (Veremark   │    │   Wallet    │
│             │    │   Queue)     │    │   + API)     │    │   VC        │
└─────────────┘    └──────────────┘    └─────────────┘    └─────────────┘
      │                  │                   │                  │
      ▼                  ▼                   ▼                  ▼
   R2 Storage      Edge Function       External APIs      Blockchain
   (encrypted)     + Background        (CAAP, FAA,        Anchors
                   Jobs                Veremark)
```

### 2.2 pilotcareerpathways.com (Career)

**Primary Focus:** Job matching, pathways, programs

**Unique Components:**

#### A. Pathway Matching Engine
```typescript
// lib/pathways/
├── matcher.ts               # Profile → Pathway scoring
├── requirements.ts          # Airline requirement parser
├── gap-analysis.ts          # Missing credentials calc
└── timeline.ts              # Career progression estimator
```

**Algorithm:**
```typescript
interface PathwayMatch {
  pathwayId: string;
  matchScore: number;        // 0-100
  missingRequirements: Requirement[];
  estimatedTimeToQualify: number; // days
  priority: 'high' | 'medium' | 'low';
}

function calculateMatch(profile: Profile, pathway: Pathway): PathwayMatch {
  const score = weightedScore([
    { hours: profile.totalHours, weight: 0.3 },
    { ratings: matchingRatings(profile.ratings, pathway.requiredRatings), weight: 0.25 },
    { medical: isMedicalValid(profile.medical), weight: 0.2 },
    { location: proximity(profile.location, pathway.baseLocation), weight: 0.15 },
    { recognition: profile.recognitionScore, weight: 0.1 },
  ]);
  
  return { pathwayId: pathway.id, matchScore: score, ... };
}
```

#### B. Program Learning Management
```typescript
// components/pathways/
├── ProgramCatalog.tsx       # Browse all programs
├── EnrollmentFlow.tsx         # Sign-up + payment
├── LearningDashboard.tsx      # Progress tracking
├── VideoModulePlayer.tsx      # Content delivery
└── AssessmentEngine.tsx       # Quizzes, EBT scoring
```

**Integration Points:**
- **Stripe:** Program payments, subscription billing
- **Vimeo/Cloudflare Stream:** Video content delivery
- **Zapier/Make:** Completion certificates → email

#### C. Job Application System
```typescript
// lib/applications/
├── builder.ts               # Application document builder
├── submitter.ts             # Multi-airline submission
├── tracker.ts               # Application status polling
└── analytics.ts             # Conversion funnel
```

**Workflow:**
1. Pilot selects 3-5 pathways
2. System pre-fills application from verified profile
3. One-click apply to all (with custom cover letter per)
4. Status tracking dashboard
5. Interview scheduling integration (Calendly API)

### 2.3 pilotshortage.org (Advocacy)

**Primary Focus:** Stories, UCF framework, community

**Unique Components:**

#### A. Anonymous Story System
```typescript
// components/shortage/
├── StorySubmission.tsx      # Anonymous upload flow
├── VoiceRecorder.tsx        # Audio story capture
├── ModerationQueue.tsx      # Admin review (PSA team)
├── StoryPlayer.tsx          # Embeddable audio player
└── StoryMap.tsx             # Geographic visualization
```

**Privacy Architecture:**
```typescript
interface AnonymousStory {
  id: string;
  storyHash: string;         // SHA-256 of content (integrity)
  audioUrl: string;          // R2 private bucket
  transcript: string;        // Whisper AI transcription
  metadata: {
    region: string;          // "APAC", "EMEA", "Americas"
    role: string;            // "CFI", "CPL", "ATPL"
    yearsExperience: number;   // 0-5, 5-10, 10+
  };
  verificationProof: string; // ZK proof: verified pilot, no identity
  status: 'pending' | 'approved' | 'rejected';
}
```

#### B. UCF Framework Portal
```typescript
// app/ucf/
├── page.tsx                 # UCF landing
├── pillars/
│   ├── [id]/
│   │   └── page.tsx         # Individual pillar detail
├── downloads/
│   └── page.tsx             # PDF resources
└── community/
    └── page.tsx             # UCF discussion forum
```

**Content Management:**
- Static markdown for UCF pillars (Git-backed)
- Version-controlled framework updates
- Multi-language support (i18n)

#### C. Advocacy Campaign Tools
```typescript
// lib/advocacy/
├── CampaignManager.ts       # Petition/email campaign builder
├── LegislatorLookup.ts      # Find reps by pilot location
├── EmailTemplateSystem.ts   # Personalized outreach
└── ImpactDashboard.ts       # Metrics: stories shared, media pickup
```

---

## LAYER 3: Cross-Cutting Infrastructure

### 3.1 Shared UI Component Library

```typescript
// components/ui/  (shadcn/ui base)
├── Button.tsx
├── Card.tsx
├── Dialog.tsx
├── Form.tsx
├── Toast.tsx
└── ...

// components/shared/  (custom shared)
├── DomainAwareNavbar.tsx    # Changes brand by domain
├── VerificationBadge.tsx    # Shows credential status
├── PilotCard.tsx            # Mini profile preview
├── PathwayCard.tsx          # Pathway listing component
└── CredentialStatus.tsx     # License/medical/ELP display
```

### 3.2 Design System Tokens

```css
/* styles/tokens.css */
:root {
  /* Primary colors by domain */
  --recognition-primary: #c41e3a;  /* Red */
  --pathways-primary: #00b4d8;    /* Cyan */
  --shortage-primary: #ff9f1c;    /* Amber */
  
  /* Shared neutrals */
  --slate-900: #0f172a;
  --slate-800: #1e293b;
  --slate-400: #94a3b8;
  --slate-100: #f1f5f9;
  
  /* Spacing scale */
  --space-1: 0.25rem;
  --space-2: 0.5rem;
  --space-4: 1rem;
  --space-8: 2rem;
  --space-16: 4rem;
}
```

### 3.3 API Gateway / Routing

**Vercel Edge Middleware:**
```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;
  
  // Domain detection
  const isPathways = hostname.includes('pilotcareerpathways.com');
  const isShortage = hostname.includes('pilotshortage.org');
  const isRecognition = !isPathways && !isShortage;
  
  // Inject domain header for downstream
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-domain-source', isPathways ? 'pathways' : isShortage ? 'shortage' : 'recognition');
  
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}
```

### 3.4 Analytics & Attribution

**Cross-Domain Tracking:**
```typescript
// lib/analytics/
├── tracker.ts               # Event tracking wrapper
├── attribution.ts           # First-touch attribution
├── funnel.ts                # Cross-domain conversion paths
└── reporting.ts             # Aggregated dashboards
```

**User Journey Tracking:**
```
1. Discovers PSA on pilotshortage.org (reads story)
2. Clicks to pilotrecognition.com to verify license
3. Gets verified, redirected to pilotcareerpathways.com
4. Applies to airline pathway
5. Hired → $500 success fee

Attribution: First touch = shortage.org, Revenue = recognition.com
```

### 3.5 DevOps & Deployment

**Vercel Project Structure:**
```
# One codebase, three deployments

vercel.json (recognition)
├── production: pilotrecognition.com
├── preview: *.vercel.app
└── env: DOMAIN=recognition

vercel.json (pathways)
├── production: pilotcareerpathways.com
└── env: DOMAIN=pathways

vercel.json (shortage)
├── production: pilotshortage.org
└── env: DOMAIN=shortage
```

**GitHub Actions:**
```yaml
# .github/workflows/deploy.yml
- name: Deploy Recognition
  run: vercel deploy --prod --scope=recognition

- name: Deploy Pathways
  run: vercel deploy --prod --scope=pathways

- name: Deploy Shortage
  run: vercel deploy --prod --scope=shortage
```

---

## LAYER 4: External Integrations

### 4.1 Verification Partners

| Partner | Purpose | Integration |
|---------|---------|-------------|
| **Veremark** | Background checks | Webhook + API |
| **CAAP** | Philippine licenses | Direct API |
| **GCAA** | UAE licenses | Direct API |
| **EASA** | EU licenses | OAuth + API |
| **FAA** | US licenses (future) | Airmen Registry API |

### 4.2 Payment & Finance

| Service | Purpose |
|---------|---------|
| **Stripe** | Subscriptions, one-time payments |
| **Helio** | USDC/crypto payments (optional) |
| **Wise** | International payouts to ATOs |

### 4.3 Communication

| Service | Purpose |
|---------|---------|
| **Resend** | Transactional email |
| **Postmark** | Marketing email (future) |
| **Twilio** | SMS verification codes |
| **Discord/Slack** | Internal alerts |

---

## Implementation Priority

### Phase 1: Foundation (Month 1-2)
1. ✅ Supabase project setup (shared)
2. ✅ Domain detection middleware
3. ✅ Shared auth system with domain routing
4. ⬜ Unified component library

### Phase 2: Core (Month 3-4)
1. ⬜ pilotrecognition.com wallet infrastructure
2. ⬜ pilotshortage.org story submission system
3. ⬜ pilotcareerpathways.com pathway matching

### Phase 3: Scale (Month 5-6)
1. ⬜ Veremark integration (cross-domain)
2. ⬜ Enterprise API (recognition.com)
3. ⬜ Analytics & attribution (cross-domain)

### Phase 4: Polish (Month 7+)
1. ⬜ ATO network integration
2. ⬜ Campus partnerships (pathways)
3. ⬜ Government relations (shortage)

---

## Summary: Infrastructure Checklist

| Component | Status | Notes |
|-----------|--------|-------|
| Supabase (shared DB) | ✅ | gkbhgrozrzhalnjherfu |
| Supabase Auth | ✅ | Domain-aware JWTs |
| Edge Functions | 🔄 | Core done, domain-specific in progress |
| R2 Storage | ✅ | Buckets created |
| Vercel Deployments | ✅ | 3 projects configured |
| Domain Middleware | ✅ | `middleware.ts` |
| Wallet (Tier 1-4) | ✅ | HSM + encryption working |
| Component Library | 🔄 | 70% complete |
| Veremark Webhook | ✅ | Credit system active |
| Stripe Integration | 🔄 | Checkout done, subscriptions pending |
| Pathway Matching | ⬜ | Algorithm designed, not built |
| Story Moderation | ⬜ | PSA team workflow needed |
| Enterprise API | ⬜ | Spec done, not implemented |

**Next Critical Build:**
1. Pathway matching engine (pathways.com)
2. Enterprise search API (recognition.com)
3. Story moderation dashboard (shortage.org)

---

*Infrastructure Architecture v1.0*
*Domains: pilotrecognition.com | pilotcareerpathways.com | pilotshortage.org*
*Backend: Supabase + Vercel + R2*
