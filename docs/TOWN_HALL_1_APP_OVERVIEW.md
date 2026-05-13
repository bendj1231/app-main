# Town Hall 1: PilotRecognition App Overview

**Current State: Foundation Complete | Ready for TH2 (Verification Layer)**

---

## 🎯 What Is PilotRecognition?

**NOT a job board. A recognition and information platform.**

PilotRecognition digitizes and validates pilot reputations and logbooks. Instead of pilots "applying" for jobs and hoping, they build verified Recognition Profiles that airlines can discover and pull from.

### The Core Promise:
> "Get recognized, not just listed. Submit interest, not applications."

---

## 🏗️ Town Hall 1 Architecture (What Exists Now)

### 1. Platform Identity Layer (Complete)

**Key Message Consistency:**
- ✅ "NOT A JOB BOARD" banners on all entry points
- ✅ "Submit Interest" replaces "Apply Now" (30+ pages updated)
- ✅ "Pathway" replaces "Job" terminology
- ✅ "Recognition Score" as currency (not jobs)

**User Flows:**
```
Pilot Journey:
Visit Site → See "NOT A JOB BOARD" banner → Browse Pathways 
→ Compare Profile to Requirements → Submit Interest 
→ Get Verified → Airlines Pull From Database

Airline Journey:
Enterprise Access → Post Pathway Requirements → Pull Verified Profiles
→ View Recognition Scores → Contact Pilots Directly
```

---

### 2. Three-Pillar Structure

```
┌─────────────────────────────────────────────────────────────┐
│                    PILOTRECOGNITION.COM                    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐    │
│  │   PROGRAMS   │  │  RECOGNITION │  │   PATHWAYS   │    │
│  │              │  │              │  │              │    │
│  │ Foundation   │  │ Live Profile │  │ Airlines     │    │
│  │ $49          │  │ Recognition  │  │ Private Jet  │    │
│  │              │  │ Score        │  │ Cargo        │    │
│  │ Transition   │  │ Verification │  │ Air Taxi     │    │
│  │ $299         │  │              │  │ Military     │    │
│  │              │  │ Recognition+ │  │              │    │
│  │ EBT Scoring  │  │ $99/year     │  │ Submit       │    │
│  │              │  │              │  │ Interest     │    │
│  └──────────────┘  └──────────────┘  └──────────────┘    │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

---

## 👨‍✈️ FOR PILOTS — PROGRAMS & RECOGNITION

### 3. Programs (Education Layer)

**Programs serve BOTH individual pilots AND flight school campuses** as extra-curricular professional development activities.

> *"If a pilot graduates with a degree and shakes the hand of the person giving him the degree without any pride, empathy, or simply recognition in his efforts — that's a problem we address through flight school campus partnerships."*

Current flight training is transactional: hours logged, exams passed, certificate handed over. Programs add the **emotional validation** and **professional identity development** that's missing.

**For Individual Pilots:**

| Program | Price | What They Get |
|---------|-------|---------------|
| **Foundation Program** | $49 | 50-hour mentorship with certification, 5 EBT modules, W1000 access, initial recognition presence + accumulated score |
| **Transition Program** | $299 | **🚧 WIP — Collaboration with all 25 pillars** — 9 competencies assessment, ATLAS CV, interview prep, EBT scoring — *Coming soon once all partners established* |
| **EBT Video Scoring** | Bundled | Recorded behavioral assessment airlines can view |

**For Flight School Campuses:**

| Integration Model | Description |
|-------------------|-------------|
| **Extra-Curricular Offering** | Programs offered alongside standard flight training (not replacing it) |
| **Campus Partnership Pricing** | Volume discounts for bulk student enrollment |
| **Graduation Requirement** | Schools can mandate Foundation Program completion |
| **Recognition Ceremony** | EBT assessment replaces/supplements traditional checkrides |

**Program Status:**

- **Foundation Program:** ✅ Live — Individual enrollment open, campus partnerships accepting
- **Transition Program:** 🚧 WIP — Requires collaboration with all 25 Universal Commercial Framework pillars (airlines, ATOs, simulator centers, etc.) — *Coming soon once all partners established and onboard*

**What Programs Add Beyond Flight Training:**

1. **Professional Identity** — How pilots portray themselves to employers
2. **Emotional Intelligence** — Validation of the journey, peer mentorship
3. **Industry Alignment** — EBT/CBTA frameworks, ATLAS CV formatting
4. **Verified Portfolio** — 50-hour mentorship tracking, behavioral scores

**The "Day One Recognition" Vision:**

Graduation day where the handshake comes with:
- Verified Recognition Profile (not just a license)
- Recognition Score showing readiness (not just hours)
- Competency portfolio airlines can see (not just a resume)
- Direct pathway connections (not just "good luck")

---

### 4. Recognition Profile (Identity Layer)

**What Pilots Build:**
A live, verified profile that replaces the static CV. Updates automatically as pilots log hours and complete assessments.

**Recognition Profile Components:**

```typescript
interface RecognitionProfile {
  // Core Identity
  id: uuid
  full_name: string
  email: string
  pilot_id: string
  
  // Flight Credentials
  total_flight_hours: numeric
  ratings: string[]
  license_type: string
  license_expiry: date
  medical_class: string
  medical_expiry: date
  
  // Professional Experience (renamed from job_experiences)
  professional_experiences: {
    title: string
    company: string
    fromDate: string
    toDate: string
    description: string
  }[]
  
  // Behavioral Scores (0-100 each)
  behavioral_sjt_score: numeric           // Situational Judgment
  behavioral_psychometric_score: numeric // Psychometric Profile
  behavioral_cognitive_workload: numeric  // Cognitive Workload
  behavioral_stress_management: numeric   // Stress Management
  behavioral_decision_making: numeric     // Decision Under Pressure
  behavioral_crm_assessment: numeric      // CRM/Teamwork
  
  // Technical Skills
  technical_skills_score: numeric
  interview_score: numeric
  
  // Recognition Score (calculated)
  overall_recognition_score: numeric  // 0-100
  
  // Program Progress
  foundation_progress: integer  // 0-100
  mentorship_hours: numeric
  examination_score: integer
}
```

**Recognition Score Calculation:**
```
Recognition Score = 
  (Experience × 35%) +
  (Behavioral × 30%) +
  (Technical × 25%) +
  (Program Completion × 10%)
```

---

### 5. Pathways (Discovery Layer for Pilots)

Pilots use pathways to understand requirements and submit interest.

**7 Pathway Categories:**
1. **Airlines & Operators** - Commercial carriers, regional, flagship
2. **Private Jet & Charter** - Corporate aviation, VIP charter
3. **Air Taxi & eVTOL** - Urban air mobility, electric aircraft
4. **Cargo & Logistics** - Freight operators, express delivery
5. **Military & Defence** - Armed forces, defence contractors
6. **Flight Schools & ATOs** - Instructor pathways
7. **Type Rating Search** - Aircraft manufacturers, training centers

**Pathway Card (Pilot View):**
```
┌─────────────────────────────────────┐
│  AIRLINE: Emirates                   │
│  Location: Dubai                   │
│  Type: Wide-body Operator          │
├─────────────────────────────────────┤
│  REQUIREMENTS:                     │
│  ✓ 4,000+ hours total (YOU HAVE)   │
│  ✓ 1,500+ hours PIC (YOU HAVE)     │
│  ✓ Multi-crew experience (YOU HAVE)│
│  ✗ Type rating (MISSING)           │
│                                    │
│  Your Match: 75%                   │
│  Recognition Score Needed: 70+     │
│  Your Score: 78 ✓                  │
│                                    │
│  [SUBMIT INTEREST] ← NOT "Apply"  │
└─────────────────────────────────────┘
```

**Key Distinction from Job Boards:**
- ❌ Traditional: "Apply Now" → Wait → Hope
- ✅ PilotRecognition: "Submit Interest" → Get Verified → Airlines Pull

---

## 🏢 FOR PARTNERS — PATHWAY PUBLISHING & DISCOVERY

### 6. Pathway Management (Publishing Layer)

Partners publish pathway requirements and discover interested pilots.

**What Partners See:**

```
┌─────────────────────────────────────────┐
│  YOUR PATHWAY: Emirates Cadet           │
│  📍 Dubai                               │
│  Status: Active                         │
│                                         │
│  INTEREST TEASER:                       │
│  🔥 12 pilots have submitted interest    │
│                                         │
│  🔒 TOP 3 RECOGNITION+ (Preview):       │
│     • P**** S**** (Score: 8*)           │
│     • A**** K**** (Score: 7*)           │
│     • M**** H**** (Score: 9*)           │
│                                         │
│  [Unlock Full List - $49]              │
│  [Upgrade to Enterprise - $1K/mo]       │
└─────────────────────────────────────────┘
```

**Three-Tier Partner Model:**

| Feature | Free | Pay-Per-Pathway ($49) | Enterprise ($1K/mo) |
|---------|------|----------------------|---------------------|
| Post Pathways | ✅ | ✅ | ✅ |
| See Interest Count | ✅ ("12 interested") | ✅ | ✅ |
| Preview Top 3 | ✅ (blurred) | ✅ (full) | ✅ (unlimited) |
| Unlock Full List | ❌ | ✅ (this pathway) | ✅ (all) |
| Pull API | ❌ | ❌ | ✅ |
| EBT Video Access | ❌ | ❌ | ✅ |

**Success Fee:** $500 per pilot placed through pathway

---

## 🔧 TECHNICAL INFRASTRUCTURE

### 7. Database Structure (Supabase)

**Core Tables:**

```
public.profiles (18 rows)
├── id, email, display_name, role
├── total_flight_hours, ratings, license_type
├── professional_experiences (JSONB) ← RENAMED
├── behavioral_*_score (6 scores)
├── overall_recognition_score
├── foundation_progress, mentorship_hours
└── RLS: Enabled ✓

public.pilot_licensure_experience
├── user_id, full_legal_name
├── licenses, ratings, medical_info
├── aircraft_ratings, professional_experiences
└── RLS: Enabled ✓

public.security_events
├── id, user_id, event_type, severity
├── ip_address, user_agent, details
├── created_at
└── RLS: Enabled ✓

public.peer_validation
├── program_key, user_id, target_pathway_key
├── success_status, achievement_date
└── RLS: Enabled ✓

public.user_bookmarks
├── user_id, item_id, item_type
├── title, description, metadata
└── RLS: Enabled ✓
```

**Security Status:**
- ✅ All tables have RLS enabled
- ✅ Security events logging active
- ✅ Function search_path vulnerabilities fixed
- ✅ Rate limiting implemented (5 req/min public, 20 req/min auth)

---

### 8. Component Architecture

```
components/website/
├── components/
│   ├── TopNavbar.tsx              ← Navigation (fixed terminology)
│   ├── home/
│   │   └── HomePage.tsx           ← Entry with NOT A JOB BOARD banner
│   ├── pathways/
│   │   ├── PathwaysPageModern.tsx ← Main pathway browser
│   │   ├── PlatformAirTaxiPage.tsx
│   │   ├── AirTaxiPathwaysPage.tsx
│   │   ├── PlatformPrivateCharterPage.tsx
│   │   ├── PrivateCharterPathwaysPage.tsx
│   │   ├── EmiratesAtplPage.tsx
│   │   └── PlatformEmiratesAtplPage.tsx
│   ├── programs/
│   │   ├── FoundationalProgramPage.tsx
│   │   ├── TransitionProgramPage.tsx
│   │   ├── PlatformTransitionProgramPage.tsx
│   │   ├── ProgramsPage.tsx
│   │   ├── PilotGapModulePage.tsx
│   │   ├── PilotGapModuleChapter2.tsx
│   │   └── ProgramStages.tsx
│   ├── pilot-recognition/
│   │   ├── PilotRecognitionProfilePage.tsx
│   │   ├── PilotLicensureExperiencePage.tsx
│   │   ├── CareerPathwayPriority.tsx → PathwayPriority.tsx
│   │   ├── ScoreOptimizationPage.tsx
│   │   └── VeremarkVerifiedBadge.tsx
│   ├── AirlineExpectationsCarousel.tsx
│   ├── AirlineExpectationsPage.tsx
│   ├── PortalAirlineExpectationsPage.tsx
│   ├── AboutPage.tsx
│   ├── MissionVisionPage.tsx
│   ├── WhyRecognitionPage.tsx
│   └── BecomeMemberPage.tsx
├── pages/
│   └── (Next.js page wrappers)
└── hooks/
    └── useRecognitionScore.ts

portal/pages/
├── PathwaysPageModern.tsx      ← Portal pathway browser
├── MilitaryPathwaysPage.tsx
├── PilotRecognitionMatchPage.tsx
└── PortalAirlineExpectationsPage.tsx

functions/
└── index-all.js                ← Firebase functions, Recognition Score calc
```

---

### 9. Recognition Score Algorithm (TH1)

**Current Calculation (in functions/index-all.js):**

```javascript
function calculateRecognitionScore(profile) {
  // Experience (35% weight)
  const flightHoursScore = Math.min(100, profile.total_flight_hours / 50);
  const ratingsScore = (profile.ratings?.length || 0) * 10;
  const professionalExperiences = profile.professional_experiences || [];
  const certificationsCount = professionalExperiences
    .filter(j => j?.certifications?.length > 0).length;
  const certificationsScore = certificationsCount * 5;
  const experienceScore = Math.min(100, 
    (flightHoursScore + ratingsScore + certificationsScore) / 150 * 100
  );
  
  // Behavioral (30% weight) - 6 competencies
  const behavioralScore = (
    (profile.behavioral_sjt_score || 0) +
    (profile.behavioral_psychometric_score || 0) +
    (profile.behavioral_cognitive_workload || 0) +
    (profile.behavioral_stress_management || 0) +
    (profile.behavioral_decision_making || 0) +
    (profile.behavioral_crm_assessment || 0)
  ) / 6;
  
  // Technical (25% weight)
  const technicalScore = (
    (profile.technical_skills_score || 0) +
    (profile.interview_score || 0)
  ) / 2;
  
  // Program Completion (10% weight)
  const programScore = (
    (profile.foundation_progress || 0) * 0.5 +
    (profile.examination_score || 0) * 0.3 +
    (profile.mentorship_hours || 0) * 0.5
  );
  
  // Final Score (0-100)
  return Math.round(
    experienceScore * 0.35 +
    behavioralScore * 0.30 +
    technicalScore * 0.25 +
    programScore * 0.10
  );
}
```

---

## 🎨 UI/UX Patterns (Established)

### Color System:
- **Blue (#3b82f6)** - Primary actions, trust, enterprise
- **Amber (#f59e0b)** - Warnings, NOT A JOB BOARD banner
- **Emerald (#10b981)** - Success, verification, completion
- **Slate (#64748b)** - Secondary text, neutral elements
- **Gold (#DAA520)** - Premium, Recognition+, ATLAS CV

### Button Patterns:
- **Primary:** Blue background, white text (Submit Interest)
- **Secondary:** White/transparent, blue border (Learn More)
- **Premium:** Gold/amber accents (Recognition+)
- **Disabled:** Grayed out with explanation

### Page Templates:
1. **Landing Page** - Hero + NOT A JOB BOARD banner + 3 pillars
2. **Pathway Page** - Cards + Submit Interest + Gap analysis
3. **Program Page** - Stages + Pricing + Enrollment CTA
4. **Profile Page** - Sections + Recognition Score + Verification badges

---

## 📊 Current Metrics (May 13, 2026)

| Metric | Value |
|--------|-------|
| Database Profiles | 18 |
| Flight Schools | 50 |
| Pathway Types | 7 categories |
| Airlines in Carousel | 25+ |
| Pages with "NOT A JOB BOARD" | 30+ |
| Files Updated for TH1 | 35+ |
| TypeScript Errors (TH1) | 0 |

---

## 🔜 What's Coming (TH2 Preview)

**Town Hall 2: Trust & Verification Layer**

### New Buildings to Construct:
1. **Veremark Integration**
   - API key configuration
   - Philippines checks (PRC, NBI clearance)
   - "Pre-Cleared" badge logic
   - Fast-track recognition status

2. **Recognition+ Membership ($99/year)**
   - Stripe payment integration
   - Priority pathway matching
   - Unlimited profile comparisons
   - AI Recognition Strategist

3. **Verification System**
   - Document upload
   - Background check workflow
   - Status dashboard
   - Cost transparency

4. **First 100 Pilots Campaign**
   - "Founding Pilots" free verification
   - PR case studies
   - Social proof generation

---

## 💡 Key Insights (From 30+ File Audit)

### What Makes This Platform Different:

| Job Board | PilotRecognition |
|-----------|------------------|
| Push (apply) | Pull (interest) |
| Static CVs | Live profiles |
| 500 applications | Pre-verified shortlist |
| Spray and pray | Targeted alignment |
| Uncertainty | Competency scoring |
| One-time job | Career-long recognition |

### Terminology Mapping (For Reference):
| ❌ Old | ✅ New |
|--------|--------|
| Apply Now | Submit Interest |
| Job | Pathway |
| Hiring | Active/High Interest |
| Career | Professional |
| Job Board | Recognition Platform |
| Placement | Discovery |
| Get Hired | Get Recognized |

---

## ✅ TH1 Completion Checklist

- [x] Platform identity consistent
- [x] TypeScript errors fixed
- [x] Database schema stable
- [x] Navigation working
- [x] All code references updated
- [x] Professional terminology throughout
- [x] Recognition Score algorithm defined
- [x] Three-pillar structure clear
- [x] Enterprise access documented

---

## 🎯 Next: Town Hall 2

**Goal:** First 100 pilots complete verification end-to-end

**Key Deliverable:** Veremark integration with Pre-Cleared badge

**Success Metric:** 100 verified pilots ready for airline pulling

---

*Document Version: TH1.0*
*Last Updated: May 13, 2026*
*Ready for TH2 Upgrade: YES*
