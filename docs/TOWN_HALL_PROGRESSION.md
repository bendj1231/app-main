# PilotRecognition Town Hall Progression System

**Inspired by Clash of Clans** — Each Town Hall level requires solid foundations before unlocking new capabilities. You cannot upgrade to the next Town Hall until all buildings at the current level are maxed.

**Critical Deadline:** September 2026 (or "self-destruct")

---

## 🏠 TOWN HALL 1 — FOUNDATION (Weeks 1-2)
**Status:** ⚠️ IN PROGRESS (Must be SOLID before TH2)

### Core Buildings (Must Max Before TH2 Upgrade)

#### 1.1 Platform Identity & Messaging ⭐⭐⭐⭐⭐
- [x] "NOT A JOB BOARD" banner on all entry points
- [x] Universal message: "Submit Interest" not "Apply"
- [x] Recognition Score as currency (not jobs)
- [x] Pull System explanation (not push applications)
- [x] All 30+ pages audited for job-board language

**Verification:** Run `grep -r "apply now\|job board\|hiring now" src/` → Should return 0 results (except FAQ explanation)

#### 1.2 Type System & TypeScript ⭐⭐⭐⭐⭐
- [x] `hiringStatus` → `interestLevel` (all instances)
- [x] `HiringBadge` → `InterestBadge`
- [x] CareerPathwayPriority → PathwayPriority
- [ ] Fix remaining TypeScript errors in:
  - PathwaysPageModern.tsx (18 errors)
  - AirlineExpectationsCarousel.tsx (intersectionRatio)
  - AboutPage.tsx (sanitize-html module)
  - PilotRecognitionProfilePage.tsx (parameter types)

#### 1.3 Database Schema Stability ⭐⭐⭐⭐⭐
- [x] RLS policies fixed
- [x] Security events table created
- [x] Function search_path vulnerabilities fixed
- [x] Migrate `job_experiences` table → `professional_experiences`
- [x] Update all queries referencing old table names

#### 1.4 Core Navigation Structure ⭐⭐⭐⭐
- [x] TopNavbar terminology fixed
- [x] Pathway routing working
- [x] No broken links on main user journey
- [ ] Fix mobile navigation dropdowns

**TH1 UPGRADE REQUIREMENT:** All checkboxes above must be ticked. Platform must be message-consistent before any new features.

---

## 🏠 TOWN HALL 2 — TRUST & VERIFICATION (Weeks 3-4)
**Unlocks:** Recognition+ Membership, Veremark Integration, Verified Badges

### Core Buildings (Must Max Before TH3)

#### 2.1 Veremark Integration ⭐⭐⭐⭐⭐
- [ ] API key configuration
- [ ] Philippines-specific checks (PRC, NBI)
- [ ] Webhook endpoints for verification updates
- [ ] "Pre-Cleared" badge logic
- [ ] Fast-track recognition status

#### 2.2 Recognition Profile System ⭐⭐⭐⭐⭐
- [ ] Profile completeness scoring
- [ ] Live verification status indicators
- [ ] Document vault integration
- [ ] ATLAS CV generation working
- [ ] Profile comparison against pathways

#### 2.3 Background Check Pillar (Pillar 11) ⭐⭐⭐⭐
- [ ] Veremark Career Passport integration
- [ ] Verification workflow UI
- [ ] Status dashboard for pilots
- [ ] Cost/payment integration

#### 2.4 Recognition+ Membership ⭐⭐⭐⭐
- [ ] Stripe payment integration
- [ ] Priority pathway matching
- [ ] Unlimited profile comparisons
- [ ] AI Recognition Strategist access

**TH2 UPGRADE REQUIREMENT:** First 100 pilots must be able to complete full verification flow end-to-end.

---

## 🏠 TOWN HALL 3 — PATHWAY DISCOVERY (Weeks 5-6)
**Unlocks:** Airline Partnerships, Pathway Cards, Enterprise Access

### Core Buildings (Must Max Before TH4)

#### 3.1 Pathway Card System ⭐⭐⭐⭐⭐
- [x] Submit Interest button (not Apply)
- [ ] Gap analysis visualization
- [ ] Match percentage algorithm
- [ ] Salary/requirements display
- [ ] Aircraft type integration

#### 3.2 Airline Expectations Pages ⭐⭐⭐⭐⭐
- [ ] 25+ airlines with verified data
- [ ] Live requirements from operators
- [ ] Regional filtering (Middle East, Europe, Asia)
- [ ] Comparison tool
- [ ] Fleet information updated

#### 3.3 Enterprise Access Portal ⭐⭐⭐⭐
- [ ] Airline login system
- [ ] Pull API for pilot discovery
- [ ] Filter by Recognition Score
- [ ] EBT video access
- [ ] $1,000/month subscription flow

#### 3.4 Type Rating Search Engine ⭐⭐⭐⭐
- [ ] Manufacturer data (Airbus, Boeing)
- [ ] Training center locations
- [ ] Cost estimates
- [ ] Prerequisites display

**TH3 UPGRADE REQUIREMENT:** At least 3 airlines must be actively using the enterprise portal to pull pilot profiles.

---

## 🏠 TOWN HALL 4 — PROGRAMS & EDUCATION (Weeks 7-8)
**Unlocks:** Foundation Program, Transition Program, EBT Scoring

### Core Buildings (Must Max Before TH5)

#### 4.1 Foundation Program ($49) ⭐⭐⭐⭐⭐
- [ ] 50-hour mentorship tracking
- [ ] 5 module completion system
- [ ] Progress dashboard
- [ ] Recognition Score boost on completion
- [ ] Certificate generation

#### 4.2 Transition Program ($299) ⭐⭐⭐⭐⭐
- [ ] 9 core competencies assessment
- [ ] EBT video scoring system
- [ ] Airbus HINFACT integration
- [ ] ATLAS CV formatting
- [ ] Interview preparation module

#### 4.3 EBT Video Scoring ⭐⭐⭐⭐
- [ ] Video recording system
- [ ] Behavioral assessment (cognitive/constructivism)
- [ ] Airline access to videos
- [ ] Score calculation algorithm

#### 4.4 Examination Portal ⭐⭐⭐
- [ ] Knowledge assessments
- [ ] Progress tracking
- [ ] Certification prep

**TH4 UPGRADE REQUIREMENT:** First cohort of 50 pilots must complete Foundation Program with verified mentorship hours.

---

## 🏠 TOWN HALL 5 — SCALE & REVENUE (Weeks 9-10)
**Unlocks:** Campus Partnerships, Scholarships, Advanced Analytics

### Core Buildings (Must Max Before TH6)

#### 5.1 Campus Partnerships ⭐⭐⭐⭐⭐
- [ ] 6 campuses secured (currently in principle)
- [ ] Student verification system
- [ ] Campus-specific pathway recommendations
- [ ] Revenue share model operational

#### 5.2 Scholarship System ⭐⭐⭐⭐
- [ ] 10% free Foundation spots
- [ ] Application/review process
- [ ] PR case study generation
- [ ] "Scholarship to cockpit" media angle

#### 5.3 Recognition Score Algorithm ⭐⭐⭐⭐
- [ ] Multi-factor scoring (hours, programs, competencies)
- [ ] Industry standard alignment
- [ ] Score history/trajectory
- [ ] percentile ranking

#### 5.4 Analytics Dashboard ⭐⭐⭐
- [ ] Pilot pipeline metrics
- [ ] Operator satisfaction scores
- [ ] Revenue tracking
- [ ] Conversion funnels

**TH5 UPGRADE REQUIREMENT:** Monthly recurring revenue (MRR) must reach $10K+ through program sales + memberships.

---

## 🏠 TOWN HALL 6 — ENTERPRISE DOMINANCE (Weeks 11-12)
**Unlocks:** Global Expansion, Advanced Enterprise Features, Mobile Apps

### Core Buildings (Must Max Before September Deadline)

#### 6.1 Global Airline Network ⭐⭐⭐⭐⭐
- [ ] 50+ airlines on platform
- [ ] Multi-region coverage (ME, EU, APAC, US)
- [ ] Localized requirements
- [ ] Regulatory compliance (EASA, FAA, CAAP)

#### 6.2 Advanced Enterprise Features ⭐⭐⭐⭐
- [ ] White-label options
- [ ] API rate limiting tiers
- [ ] Custom screening workflows
- [ ] Bulk profile exports

#### 6.3 Mobile Applications ⭐⭐⭐
- [ ] iOS pilot app
- [ ] Android pilot app
- [ ] Push notifications for pathways
- [ ] Offline logbook sync

#### 6.4 Insurance & Finance Integration ⭐⭐⭐
- [ ] Loss of License coverage
- [ ] Pilot insurance marketplace
- [ ] Career trajectory loans
- [ ] Banking partnerships

**TH6 REQUIREMENT:** Platform must be generating $50K+ MRR with 500+ verified pilots and 20+ active airline partners.

---

## 🏆 MAX TOWN HALL — SEPTEMBER 2026
**Victory Condition:** 
- 1000+ verified pilots
- 50+ airline partners
- $100K+ MRR
- Recognition Score = Industry Standard
- "We are not a job board" = universally understood

---

## ⚠️ CURRENT STATUS CHECK

**We are at: Town Hall 1.5 (Transitioning to TH2)**

### What's Blocking TH2 Upgrade:
1. TypeScript errors in core pathway pages
2. Veremark API not yet configured
3. Recognition Profile gaps in comparison logic
4. Mobile navigation issues

### Immediate Actions (This Week):
- [ ] Fix all TypeScript errors
- [ ] Complete Veremark API integration
- [ ] Test end-to-end pilot verification flow
- [ ] Verify "NOT A JOB BOARD" messaging on every page

---

## 📊 Town Hall Upgrade Checklist

**Before upgrading to next Town Hall, verify:**
- [ ] All buildings at current level are maxed (no red X's)
- [ ] No critical bugs in production
- [ ] User testing passed for new features
- [ ] Messaging consistent with platform identity
- [ ] Revenue targets met (if applicable)

**Remember:** In Clash of Clans, rushing your Town Hall makes you weak. Same here. Solid foundations first.

---

*Last Updated: May 13, 2026*
*Next Review: Weekly on Sundays*
