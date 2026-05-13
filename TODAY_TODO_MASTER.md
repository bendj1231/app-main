# MASTER TODO — May 13, 2024
## Complete "NOT A JOB BOARD" Messaging Overhaul

**Status:** In Progress | **Priority:** CRITICAL | **Deadline:** End of Day

---

## ✅ COMPLETED (This Session)

### Enterprise & Framework
- [x] Create official enterprise framework page (`/app/enterprise/framework/page.tsx`)
- [x] Create layout for enterprise framework (`/app/enterprise/framework/layout.tsx`)
- [x] Update sitemap with new framework pages
- [x] Fix pilot /framework page — 25 pillars first, stakeholder dropdowns
- [x] Add Key Distinction tables to Universal Commercial Framework document

### Core Messaging
- [x] Create Brand Messaging Guide (`/docs/BRAND_MESSAGING_GUIDE.md`)
- [x] Fix enterprise-access page — "NOT A JOB BOARD" banner + all 15 sectors
- [x] Fix About page — add prominent "NOT A JOB BOARD" banner
- [x] Partial fix PathwaysPageModern — "Apply Now" → "Submit Interest" (TypeScript errors remain)

---

## 🔴 PRIORITY 1: CRITICAL FIXES (Do First)

### PathwaysPageModern.tsx — Fix TypeScript Errors
**File:** `/portal/pages/PathwaysPageModern.tsx`
**Issue:** Changed `hiringStatus` → `interestLevel` but types don't match

- [ ] Fix type definition: `interestLevel` values must match usage
  - `'actively_hiring'` → `'high_interest'`
  - `'frozen'` → `'paused'`
  - `'hiring'` → `'active'`
- [ ] Update all hardcoded `interestLevel: 'actively_hiring'` → `interestLevel: 'high_interest'`
- [ ] Fix `positions` calculation line 1584 (was using hiringStatus)
- [ ] Add missing `interestLevel` to objects missing it
- [ ] Fix `category: 'pathway'` → valid category type
- [ ] Test build passes

### PathwaysPageModern.tsx — Change "Hiring" Badges
- [ ] Line 3708: Change "Hiring" badge → "High Interest" or "Active Pathway"
- [ ] Line 6482: Change `interestLevel === 'actively_hiring'` check
- [ ] Line 6490: Change hiring badge display text
- [ ] Line 4961: Change `'Hiring Now'` check → use new status values

---

## 🟠 PRIORITY 2: HIGH IMPACT PAGES

### HomePage.tsx — Add "NOT A JOB BOARD" Banner
**File:** `/components/website/components/home/HomePage.tsx`
- [ ] Add amber banner to hero section (similar to enterprise page)
- [ ] Change "Career" language → "Recognition" / "Pathway Discovery"
- [ ] Review carousel text for job-board terminology
- [ ] Check "Apply" or "Job" mentions in slide data

### Individual Pathway Pages — Remove "Apply" Language
**Files to check:**
- `/components/website/components/pathways/AirTaxiPathwaysPage.tsx`
- `/components/website/components/pathways/CadetProgramsPathwaysPage.tsx`
- `/components/website/components/pathways/CargoTransportationPage.tsx`
- `/components/website/components/pathways/PrivateCharterPathwaysPage.tsx`
- `/components/website/components/pathways/EmergingAirTaxiPage.tsx`

**Changes needed:**
- [ ] Find and replace "Apply" → "Submit Interest" or "Express Interest"
- [ ] Find and replace "Job" → "Pathway" (where appropriate)
- [ ] Find and replace "Hiring" → "Accepting Interest" or "Active"
- [ ] Find and replace "Career" → "Recognition" or "Professional"
- [ ] Check for "Submit application" → "Submit interest"

### Program Pages — Focus on Recognition Not Placement
**Files to check:**
- `/components/website/components/programs/FoundationalProgramPage.tsx`
- `/components/website/components/programs/TransitionProgramApplicationDirectoryPage.tsx`
- `/components/website/components/programs/ProgramsPage.tsx`
- `/components/website/components/programs/PilotGapModulePage.tsx`

**Changes needed:**
- [ ] Remove "job placement" promises
- [ ] Change "get hired" → "get recognized"
- [ ] Change "career outcome" → "recognition outcome"
- [ ] Emphasize: programs build verified competencies for Recognition Score

---

## 🟡 PRIORITY 3: PILOT RECOGNITION PAGES

### Pilot Recognition Profile Pages
**Files:**
- `/components/website/components/pilot-recognition/PilotRecognitionProfilePage.tsx`
- `/components/website/components/pilot-recognition/PilotLicensureExperiencePage.tsx`
- `/components/website/components/pilot-recognition/RecognitionCareerMatchesPage.tsx`
- `/components/website/components/pilot-recognition/RecognitionScoreInfoPage.tsx`

**Changes:**
- [ ] Remove "job matching" language → "pathway alignment"
- [ ] Change "employer" → "stakeholder" or "operator"
- [ ] Change "hiring" → "interest" or "discovery"

### Airline Expectations Pages
**Files:**
- `/components/website/components/AirlineExpectationsPage.tsx`
- `/portal/pages/PortalAirlineExpectationsPage.tsx`

**Changes:**
- [ ] Add "NOT A JOB BOARD" banner
- [ ] Change "Apply" buttons → "Submit Interest"
- [ ] Clarify: this is information, not a job application

---

## 🟢 PRIORITY 4: SUPPORTING PAGES

### TopNavbar & Navigation
**File:** `/components/website/components/TopNavbar.tsx`
- [ ] Check for "Jobs" or "Careers" in nav items
- [ ] Change to "Pathways" or "Recognition"

### Membership/Access Pages
**Files:**
- `/components/website/components/BecomeMemberPage.tsx`
- `/components/website/components/MembershipDirectoryPage.tsx`
- `/components/website/components/MembershipBenefitsDirectoryPage.tsx`

**Changes:**
- [ ] Remove job board comparisons
- [ ] Emphasize recognition benefits, not job access

### Technical/Portal Pages
**Files:**
- `/components/website/components/TechnicalIndexPage.tsx`
- `/components/website/components/AccessPortal2Page.tsx`

**Changes:**
- [ ] Check for "application" language
- [ ] Change to "profile creation" or "verification"

### Information Pages
**Files:**
- `/components/website/components/WhatIsPilotRecognitionPage.tsx`
- `/components/website/components/MissionVisionPage.tsx`
- `/components/website/components/WhyRecognitionPage.tsx`

**Changes:**
- [ ] Add "NOT A JOB BOARD" messaging
- [ ] Clarify distinction from job boards

---

## 🔵 PRIORITY 5: DATA & CONFIGURATION

### Database/API
- [ ] Check Supabase for "job" or "application" table names
- [ ] Rename if needed (maintain backward compatibility)
- [ ] Update API documentation

### URL Routes
- [ ] Check for `/apply` or `/jobs` routes
- [ ] Redirect or rename to `/interest` or `/pathways`

### Email Templates
**Files in:** `/functions/` or email templates
- [ ] Change "application received" → "interest submitted"
- [ ] Change "job alert" → "pathway update"
- [ ] Change "hiring" → "accepting interest"

### Analytics/Tracking
- [ ] Rename event: `job_application` → `pathway_interest_submitted`
- [ ] Rename event: `job_view` → `pathway_viewed`

---

## 🟣 PRIORITY 6: DOCUMENTATION & COMMUNICATION

### Update Existing Documentation
- [ ] Update `/docs/BRAND_MESSAGING_GUIDE.md` with final decisions
- [ ] Add "NOT A JOB BOARD" section to README.md
- [ ] Update API documentation
- [ ] Update partner onboarding docs

### Create New Documentation
- [ ] `/docs/PILOT_ONBOARDING.md` — "How to get recognized (not apply for jobs)"
- [ ] `/docs/AIRLINE_ONBOARDING.md` — "How to publish pathways (not post jobs)"
- [ ] `/docs/KEY_DISTINCTION.md` — Summary of job board vs. framework differences

### SEO/Sitemap Updates
- [ ] Update meta descriptions to remove "jobs" "hiring" "careers"
- [ ] Add "recognition" "verification" "pathways" to keywords
- [ ] Resubmit sitemap to search engines

---

## ⚪ PRIORITY 7: VERIFICATION & TESTING

### Visual Verification
- [ ] Screenshot hero sections showing "NOT A JOB BOARD" banners
- [ ] Verify all CTA buttons say "Submit Interest" not "Apply"
- [ ] Check no "Hiring" badges (except where accurate)

### Functional Testing
- [ ] Test "Submit Interest" flow end-to-end
- [ ] Verify airlines receive interest list correctly
- [ ] Test Recognition Plus priority in interest list
- [ ] Confirm no broken links from renaming

### Content Review
- [ ] Read through each page top-to-bottom
- [ ] Check for any remaining "job" "apply" "hiring" "career" terminology
- [ ] Verify tone is consistent: recognition-focused, not job-focused

---

## 📝 MASTER CHECKLIST BY TERM

### Terms to FIND and REPLACE:

| ❌ FIND | ✅ REPLACE WITH |
|---------|-----------------|
| Apply Now | Submit Interest |
| Apply | Submit Interest / Express Interest |
| Job | Pathway (when referring to opportunity) |
| Job Board | Information Platform |
| Hiring | Accepting Interest / Active |
| Hiring Now | High Interest / Active |
| Career | Professional / Recognition |
| Get Hired | Get Recognized / Become Discovered |
| Job Application | Pathway Interest |
| Candidate | Recognized Pilot / Interested Pilot |
| Applicant | Interested Pilot |
| Recruitment | Discovery / Recognition |
| Post a Job | List Pathway Requirements |
| Employer | Operator / Stakeholder |
| Placement | Connection / Match |
| Success Fee | Outcome Fee |
| Job Alert | Pathway Update |
| Apply Button | Interest Button |

---

## 🎯 SUCCESS CRITERIA

**When this is complete, a pilot visiting any page should understand:**
1. This is NOT a job board
2. I get verified and recognized
3. I discover pathway information
4. I submit interest (not applications)
5. Airlines pull from a list (I don't push applications)

**And an airline should understand:**
1. This is NOT a job board
2. I list pathway requirements
3. I see pilots who submitted interest
4. I pull from verified list (don't sift through applications)
5. Recognition Plus pilots are pre-cleared

---

## 📊 ESTIMATED TIME

| Priority | Tasks | Est. Time |
|----------|-------|-----------|
| P1 Critical | 6 tasks | 3 hours |
| P2 High Impact | 20 tasks | 4 hours |
| P3 Recognition | 12 tasks | 2 hours |
| P4 Supporting | 15 tasks | 2 hours |
| P5 Data | 5 tasks | 1 hour |
| P6 Documentation | 8 tasks | 1 hour |
| P7 Testing | 10 tasks | 1 hour |
| **TOTAL** | **76 tasks** | **14 hours** |

**Note:** This is more than one day. Prioritize P1-P3 first (9 hours), then continue tomorrow.

---

## 🚀 START HERE

**Next Immediate Action:**
1. Fix PathwaysPageModern.tsx TypeScript errors (P1)
2. Add banner to HomePage.tsx (P2)
3. Fix individual pathway pages (P2)

**Then continue down the list.**

---

**Document Version:** 1.0  
**Created:** May 13, 2024  
**Status:** Working Document — Check off as completed
