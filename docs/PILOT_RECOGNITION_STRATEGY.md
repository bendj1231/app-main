# PilotRecognition.com - Strategic Vision & Roadmap

**Created:** April 25, 2026
**Status:** Active Strategic Document
**Purpose:** Persistent memory for PilotRecognition.com business strategy, product vision, and build priorities

---

## Executive Summary

PilotRecognition.com is a neutral bridge connecting pilots with the aviation industry through a multi-sided marketplace platform. The platform provides career clarity, skill validation, and industry recognition while creating win-win value for all stakeholders.

**Goal:** Convert pilots globally to a $100/year subscription model by becoming an indispensable career platform.

---

## Core Value Proposition

### The Problem
- No proper platform connects pilot profiles with actual pathways, jobs, and expectations
- Airlines and manufacturers have specific requirements that pilots don't know
- No centralized system maps career paths to outcomes
- Pilots spend $50K+ on wrong type ratings due to lack of guidance

### The Solution
- **Neutral bridge** between pilots and aviation industry (Switzerland positioning)
- **Pilot Recognition Score** - industry-validated credential
- **AI career coaching** - personalized pathway guidance
- **Multi-sided marketplace** - win-win for all stakeholders
- **Skill assessment** - interviews with critical feedback and future Airbus review
- **Social reputation** - gamified scoring and bragging rights
- **Engagement & convenience** - fills pilot downtime, does things for them automatically

---

## Business Model

### Revenue Streams

**1. Pilot Subscriptions**
- Free tier: Profile creation (lead capture)
- Premium: $100/year OR $50/6 months
  - Pilot Recognition Score
  - AI career coaching
  - Job intelligence notifications
  - Priority visibility when airlines need pilots

**2. Referral Revenue**
- Flight schools: $20 per pilot subscription referral
- Flight schools supply pilots and earn revenue

**3. Enterprise Fees**
- Airlines: Access to qualified pilot pipelines
- Manufacturers: Market intelligence and talent visibility
- Type rating centers: Qualified leads and conversion optimization
- Training organizations: Student placement data

### Pricing Psychology
- $100/year signals premium quality (not "cheap")
- Higher price filters for serious pilots
- Creates perceived value
- Free tier anchors the premium price
- Flexible payment (annual vs semi-annual)

### Value Argument to Pilots
- Pilot training cost: $50K-$200K+
- Years of investment: 5-10+ years
- $100/year = 0.05% of a $200K investment
- "You spent millions on training, $100/year to protect that investment"

### Pilot Engagement Insight
- **Pilots have significant downtime** - waiting for flights, between flights, layovers
- **Boredom factor** - pilots don't know what to do with free time
- **Convenience preference** - want things done for them automatically
- **Engagement opportunity** - platform fills downtime productively with career management
- **Investor appeal** - highly engaged user base with time to spend on platform

---

## Multi-Sided Marketplace - Win-Win for All Stakeholders

### Pilots ($100/year)
- Career clarity and direction
- Cost savings on wrong type ratings
- Access to opportunities they can't find elsewhere
- Faster career advancement
- Industry-validated recognition
- Skill assessment and feedback
- **Engagement during downtime** - fills waiting time productively
- **Convenience** - automated career management, things done for them

### Flight Schools ($20 referral per pilot)
- New revenue stream with zero effort
- Better student outcomes = better reputation
- Data on which pathways work
- Competitive advantage

### Airlines
- Pre-qualified candidate pipeline
- Reduced hiring costs/time
- Better fit candidates
- Market intelligence on pilot supply
- Access to recognition-scored pilots

### Manufacturers
- Visibility into pilot training pipeline
- Data on demand for their aircraft
- Influence on training standards
- Brand exposure

### Type Rating Centers
- Qualified leads
- Higher conversion rates
- Better utilization
- Market intelligence

### Training Organizations
- Student placement data
- Curriculum alignment with market needs
- Revenue from referrals

---

## Product Features & Layers

### Layer 1: Data Matching (Baseline)
- Profile → pathway → job matching
- Expectations alignment
- Real-time market intelligence

### Layer 2: Skill Assessment (Differentiator)
- Personalized interviews
- Critical feedback
- Airbus-backed review (future partnership)
- Actual interview experience
- Profile enhancement through assessment

### Layer 3: Multi-Sided Marketplace (Network Effects)
- Referral tracking and payouts
- Stakeholder onboarding
- Enterprise portal for airlines/providers
- Provider verification system

### Layer 4: Social Reputation (Viral Growth)
- Pilot Recognition Score (quantified reputation)
- Atlas Résumé (standardized, validated format)
- Social bragging rights and sharing
- Leaderboards and rankings
- Mentorship program (help others = boost score)
- Badge/achievement system

### Layer 5: Physical Presence (Brand Building)
- Host conventions and events
- Airshow presence
- Career fair and pilot expo attendance
- Speaking engagements
- Pilot advocacy based on profiles
- On-site signup and interviews

---

## Neutral Positioning

### Core Principle
- **Switzerland of aviation** - neutral, unbiased
- Connector layer between pilots and industry
- Platform/infrastructure, not a service provider
- Promise recognition, not jobs
- Providers are responsible for their own offerings

### Why This Works
- Liability protection (don't promise jobs)
- Trust with all stakeholders (airlines see you as neutral)
- Scalability (don't own aircraft, training centers, or hiring)
- Flexibility (can work with any airline, manufacturer, or school)
- Clear expectations (pilots know what you deliver vs what providers deliver)

### Platform Design Implications
- Clear separation between platform (recognition/matching) and provider offerings (jobs/training)
- Terms of service must reflect liability boundaries
- Enterprise section for airline/provider postings
- Pathway page shows provider opportunities with clear attribution
- No guarantee language in marketing
- Provider verification system

---

## Technical Architecture

### Current Stack
- Frontend: React/TypeScript
- Backend: Supabase (PostgreSQL, Auth, Storage)
- Edge Functions: Deno-based
- Styling: TailwindCSS
- Deployment: Vercel

### Key Technical Components to Build

1. **Subscription Billing System**
   - Stripe integration
   - Free vs premium feature gating
   - Payment flow (annual/semi-annual)
   - Subscription management

2. **Pilot Recognition Score Algorithm**
   - Score calculation logic
   - Real-time score updates
   - Leaderboards and rankings
   - Score optimization guidance

3. **AI Career Coaching System**
   - Personalized pathway recommendations
   - Score maintenance advice
   - Job shortage notifications
   - Market intelligence

4. **Referral Tracking System**
   - Flight school referral links
   - Payout tracking
   - Commission management
   - Analytics dashboard

5. **Enterprise Portal**
   - Airline/provider onboarding
   - Job posting system
   - Candidate access (recognition-scored)
   - Provider verification

6. **Interview/Assessment System**
   - Interview recording/transcription
   - Feedback delivery mechanism
   - Assessment framework
   - Airbus review workflow (future)

7. **Atlas Résumé Builder**
   - Standardized resume format
   - Industry-validated credential
   - Export/sharing capabilities

8. **Mentorship Platform**
   - Mentor matching
   - Mentorship tracking
   - Score boost for helping others
   - Community features

9. **Event Management System**
   - Event registration
   - On-site signup flow
   - Mobile kiosk mode
   - Event analytics

10. **Social Features**
    - Profile sharing
    - Badge/achievement system
    - Social media integration
    - Leaderboards

---

## Build Priorities & Roadmap

### Phase 1 - Foundation (Immediate - Months 1-2)
**Priority: HIGH**

1. **Subscription Billing System**
   - Stripe integration
   - Payment flow
   - Free vs premium gating
   - Subscription management

2. **Pilot Recognition Score Algorithm**
   - Score calculation logic
   - Profile integration
   - Score display
   - Score optimization guidance

3. **AI Career Coaching System**
   - Pathway recommendations
   - Score maintenance advice
   - Job intelligence notifications

4. **Feature Gating**
   - Free vs premium feature separation
   - Upgrade flow
   - Value demonstration

### Phase 2 - Marketplace (Months 2-3)
**Priority: MEDIUM**

5. **Referral Tracking System**
   - Flight school referral links
   - Payout tracking
   - Commission management

6. **Enterprise Portal**
   - Airline/provider onboarding
   - Job posting system
   - Candidate access

7. **Provider Verification System**
   - Verification workflow
   - Trust indicators
   - Quality control

### Phase 3 - Differentiation (Months 4-6)
**Priority: MEDIUM**

8. **Interview/Assessment System**
   - Interview recording
   - Feedback delivery
   - Assessment framework

9. **Atlas Résumé Builder**
   - Standardized format
   - Validation
   - Export capabilities

10. **Mentorship Platform**
    - Mentor matching
    - Mentorship tracking
    - Score integration

### Phase 4 - Growth (Months 7+)
**Priority: LOW**

11. **Event Management System**
    - Event registration
    - On-site signup
    - Mobile kiosk mode

12. **Mobile App**
    - On-site signup flow
    - Event check-in
    - Profile management

---

## Critical Success Factors

### #1: Airline Adoption of Recognition Score
- **Why:** Validates the entire model
- **How:** Land 2-3 major airlines using the score in hiring
- **Impact:** Unlocks enterprise revenue and network effects

### #2: AI Advice Quality
- **Why:** Must be better than generic career advice
- **How:** Leverage industry data, personalized to pilot profile
- **Impact:** Justifies $100/year subscription

### #3: Pilot Acquisition
- **Why:** Network effects require user base
- **How:** Events, referrals, content marketing, partnerships
- **Impact:** More pilots = more airlines = more pilots

### #4: Flight School Partnerships
- **Why:** Referral revenue and pilot supply
- **How:** $20 per pilot referral, win-win value
- **Impact:** Organic growth and revenue diversification

---

## Revenue Projections & Valuation

### Market Size
- Global commercial pilots: ~300,000
- Addressable market (career-focused): ~150,000
- Target capture (3-5 years): 10-20% = 15,000-30,000 pilots

### Revenue Model
- $100/year per pilot
- 15,000 pilots = $1.5M ARR
- 30,000 pilots = $3M ARR
- Plus referral revenue from flight schools

### Valuation Scenarios
- **Conservative** (15K pilots, 8x multiple): $12M
- **Base case** (25K pilots, 12x multiple): $36M
- **Optimistic** (50K pilots, 20x multiple): $100M+

### Valuation Drivers
- Airline adoption of recognition score
- Network effects (more pilots = more airlines)
- Multi-sided revenue (subscriptions + referrals + enterprise)
- Global expansion
- Proprietary aviation career data

### Key Milestone for Valuation Jump
- Land 2-3 major airlines using the recognition score in hiring
- This validates the model and unlocks enterprise revenue

---

## Investor Readiness

### Current Status
- **Seeking investors** for PilotRecognition.com
- **Strong value proposition** with multiple revenue streams
- **Engaged user base** - pilots have downtime and want engagement
- **Market opportunity** - $150K addressable pilots globally
- **Valuation potential** - $12M-$100M+ based on adoption

### Investor Pitch Highlights

**Market Opportunity**
- 300,000 global commercial pilots
- 150,000 addressable career-focused pilots
- No existing platform connecting pilots to pathways/jobs/expectations
- Multi-sided marketplace with network effects

**Business Model**
- Subscription revenue ($100/year per pilot)
- Referral revenue ($20 per pilot from flight schools)
- Enterprise revenue (airlines, manufacturers, training centers)
- Multiple revenue streams = reduced risk

**Competitive Advantages**
- Neutral positioning (Switzerland of aviation)
- Industry-validated recognition score
- AI career coaching with personalized guidance
- Skill assessment with future Airbus review
- Social reputation and gamification
- Physical presence at events

**Engagement & Retention**
- Pilots have significant downtime (waiting for flights)
- Platform fills downtime productively
- Automated career management (convenience)
- Social features create viral growth
- Mentorship program builds community

**Traction Requirements for Investors**
- MVP with subscription billing
- First 100-500 pilot subscribers
- 2-3 flight school partnerships
- 1 airline partnership (even pilot program)
- Recognition score algorithm live
- AI coaching MVP functional

**Investor-Ready Metrics**
- Pilot registration and conversion rates
- Engagement metrics (time on platform, sessions per pilot)
- Recognition score adoption
- Referral program performance
- Revenue pipeline (subscriptions + referrals)

---



## Marketing & Growth Strategy

### Online
- Content marketing (career advice, industry insights)
- Social media (pilot communities, LinkedIn)
- SEO (aviation career keywords)
- Paid advertising (targeted to pilots)

### Offline
- Airshow presence
- Career fair and pilot expo attendance
- Hosting conventions and events
- Speaking engagements
- On-site signup and interviews

### Viral Growth
- Social sharing of recognition scores
- "Look at my Pilot Recognition Score" = free marketing
- FOMO - other pilots want to compete
- Mentorship brings in new pilots organically

### Partnerships
- Flight schools (referral revenue)
- Airlines (enterprise access)
- Manufacturers (market intelligence)
- Type rating centers (qualified leads)
- Training organizations (placement data)

---

## CEO Responsibilities

As CEO of PilotRecognition.com, responsibilities include:

1. **Product Strategy**
   - Define roadmap and build priorities
   - Make feature trade-off decisions
   - Ensure product delivers on value proposition

2. **Stakeholder Management**
   - Airline partnerships and adoption
   - Flight school referral program
   - Manufacturer and type rating center relationships
   - Pilot community engagement

3. **Revenue & Growth**
   - Subscription strategy and pricing
   - Revenue diversification
   - Growth metrics and KPIs
   - Fundraising and investor relations

4. **Team Management**
   - Technical team leadership
   - Hire and manage developers
   - Set culture and priorities
   - Resource allocation

5. **Brand & Positioning**
   - Maintain neutral "Switzerland" positioning
   - Build trust with all stakeholders
   - Event and advocacy strategy
   - Industry thought leadership

---

## Key Metrics to Track

### Pilot Metrics
- Total registered pilots
- Active premium subscribers
- Free to premium conversion rate
- Churn rate
- Average recognition score
- Score improvement over time

### Marketplace Metrics
- Active flight school partners
- Referral revenue per partner
- Active airline partners
- Job postings per month
- Candidate applications per posting

### Engagement Metrics
- AI coaching sessions per pilot
- Profile completeness
- Social shares per pilot
- Mentorship participation rate
- Event attendance

### Revenue Metrics
- MRR (Monthly Recurring Revenue)
- ARR (Annual Recurring Revenue)
- Referral revenue
- Enterprise revenue
- Customer acquisition cost (CAC)
- Lifetime value (LTV)

---

## Risks & Mitigations

### Risk 1: Airlines Don't Adopt Recognition Score
- **Mitigation:** Focus on 2-3 major airlines first, prove value, expand
- **Backup:** Position score as pilot credential even without airline adoption

### Risk 2: AI Advice Not Valuable Enough
- **Mitigation:** Use real industry data, personalize heavily, iterate based on feedback
- **Backup:** Emphasize other value (recognition, connections, events)

### Risk 3: Can't Get Enough Pilots
- **Mitigation:** Aggressive event strategy, referral program, partnerships
- **Backup:** Start with specific regions/aircraft types, expand gradually

### Risk 4: Competition
- **Mitigation:** Build network effects, focus on neutral positioning, move fast
- **Backup:** Differentiate through assessment and social reputation features

---

## Next Steps

1. **Immediate (This Week)**
   - Build subscription billing system (Stripe integration)
   - Define Pilot Recognition Score algorithm
   - Set up free vs premium feature gating

2. **Short-term (Month 1)**
   - Launch subscription system
   - Implement recognition score
   - Create AI coaching MVP
   - Onboard first flight school partners

3. **Medium-term (Months 2-3)**
   - Build referral tracking system
   - Launch enterprise portal
   - Onboard first airline partners
   - Attend first airshow/event

4. **Long-term (Months 4+)**
   - Interview/assessment system
   - Atlas Résumé builder
   - Mentorship platform
   - Global expansion

---

**Document Version:** 1.0
**Last Updated:** April 25, 2026
**Next Review:** Monthly or as strategy evolves
