# PilotRecognition — Partner Briefing Overview
*Last Updated: May 27, 2026*

---

## 1. What We Do

**The Problem:** Aviation has a clogged career pipeline. Four distinct groups are stuck:
- **Floor 0:** 200-hour graduates promised airline jobs that never materialize
- **Floor 1:** 5,000-hour instructors with 15 years experience, trapped because nobody's leaving Floor 2
- **Floor 2:** The collapse point — everyone fighting for recognition without knowing what's required
- **Floor 3:** 12+ year captains bored and trapped by seniority sacrifice

**Our Solution:** A recognition framework (not a job board) with three pillars:

| Pillar | Description |
|--------|-------------|
| **Programs** | Foundation ($49) and Transition ($299) programs with EBT video scoring and mentorship |
| **Pilot Recognition** | Live real-time profiles (not static CVs) with a Recognition Score as currency |
| **Pathways** | Pathway Cards showing exact requirements and what you're missing — pilots submit interest, airlines pull from database |

**Key Differentiator:** We unclog the pipeline by making pilot capabilities portable across operators, not locked to airline seniority.

---

## 2. Current Status (As of May 2026)

### ✅ Live & Operational

| Component | Status | Details |
|-----------|--------|---------|
| **Terminal 1 Onboarding** | ✅ Complete | PR-DCA-001 v1.6 implemented — clean UX, DCA agreement, Cadet Track gate, session security, AES-256-GCM vault encryption |
| **Authentication** | ✅ Live | Auth0 OAuth, idle timeout, vault key wipe on logout/tab close |
| **Pilot Profiles** | ✅ Live | Live real-time profiles with recognition scoring, document vault with Supabase Storage |
| **Wallet Infrastructure** | ✅ Built | W3C Verifiable Credentials, ECDSA P-256 HSM enclave, 4-tier storage (Tier 1-4), status list polling |
| **Admin Verification Queue** | ✅ Live | `/admin/verification` — document review, verify/reject/expire workflow |
| **Enterprise Pull API** | ✅ Deployed | JWT-secured endpoint for airlines to pull verified pilot data with filtering |
| **ATO Activation Credits** | ✅ Built | 5-day time-limited promotional credits, automatic expiry cron |
| **Multi-Database Architecture** | ✅ Live | Supabase (auth/profiles), Neon PostgreSQL (OEM/pathways), MongoDB (API payloads/telemetry) |
| **Security Layer** | ✅ Code-Complete | Rate limiting, input validation, CSRF protection, RLS policies, security event logging |

### 🔄 In Progress

| Component | Target | Status |
|-----------|--------|--------|
| **Veremark Integration** | June 2026 | API partnership confirmed, webhook schema received, Philippines PEL verification under technical assessment |
| **Walt.id Wallet** | June 2026 | Docker container ready, wallet provision edge function deployed, DID storage live |
| **Airline Dashboard** | June 2026 | Enterprise portal for pathway management and pilot pulling |
| **Terminal 2/3 Logic** | June 2026 | Cadet vs. verified track routing, Skybridge T2 notices |
| **SEO/Discoverability** | July 2026 | Content pipeline, pathway page optimization, organic acquisition |

### ⏳ Planned (Post-Launch)

| Component | Target |
|-----------|--------|
| wallet.pilotrecognition.com subdomain | Phase 2 |
| React Native mobile app | Phase 3 |
| US market FAA/PRD integration | Q3 2026 |
| Logbook provider certification tier | Q3 2026 |

---

## 3. Technical Architecture

### Three-Database Polyglot Setup

| Database | Region | Purpose |
|----------|--------|---------|
| **Supabase** | Sydney (ap-southeast-2) | Auth, profiles, RLS, credentials, wallet VCs |
| **Neon PostgreSQL** | Singapore (ap-southeast-1) | OEM data, pathway cards, IPFS CID index |
| **MongoDB Atlas** | Singapore (ap-southeast-1) | Raw aviation API payloads, flight telemetry, logbook JSON |

### Key Infrastructure

- **Frontend:** Next.js + React + TypeScript + TailwindCSS
- **Edge Functions:** Supabase Deno functions for API endpoints
- **Storage:** Supabase Storage (private buckets) + Cloudinary (public assets)
- **Wallet:** W3C VC-compliant with Tier 1 HSM enclave (ECDSA P-256)
- **Security:** CSRF tokens, AES-256-GCM encryption, 15-min idle timeout, security event logging

### Wallet Architecture (4-Tier)

| Tier | Function |
|------|----------|
| **Tier 1** | HSM enclave — ECDSA P-256 non-extractable key, did:key derivation |
| **Tier 2** | AES-256-GCM encrypted IndexedDB credential storage |
| **Tier 3** | Endpoint registry + status pointers |
| **Tier 4** | Immutable audit log |

---

## 4. Business Model & Revenue Streams

### Three-Product Structure

**1. Programs (B2C)**
- Foundation Program: $49
- Transition Program: $299 (or $149 for Foundation graduates)
- EBT Video Scoring: Bundled with Transition

**2. Recognition Profile (B2C)**
- Free Tier: Basic profile matching, 3 pathways/month
- Recognition Plus: $99/year — full comparison, unlimited pathways, priority matching

**3. Pathways (B2B + B2C)**
- Free: Public pathways (airlines, cargo, cadet programs)
- Premium: $49 each or $199/year bundle — private sector, specialized, helicopter, corporate aviation

**4. Enterprise Access (B2B)**
- $1,000/month per operator — Pull API, unlimited profile pulls, advanced filtering
- Success fee: $500 per pilot hired
- **Universal applicability:** Airlines, cargo, charter, ATOs, leasing companies, all treated identically

### ATO Dual-Nature Model

ATOs operate as both:
1. **Operator:** Pull verified CFIs and Check Airmen via pathways
2. **Validator:** Verify alumni logbooks, earn 5% kickback on each verification ($99 check = $5 to ATO)

*Financial equilibrium: Busy ATOs recoup their $1,000/year subscription through verification kickbacks.*

---

## 5. Strategic Partnerships

### Veremark (Verification Partner)
- **Status:** Active partnership negotiation
- **Coverage:** Europe/APAC (London HQ, Singapore hub, Philippines office)
- **Integration:** Real-time webhook updates, "Airside Professional" preset bundle
- **Philippines Focus:** CAAP license verification via PEL number (under technical assessment)

### Walt.id (Wallet Infrastructure)
- **Status:** Docker container deployed locally, VPS production planned
- **Function:** W3C VC issuance, DID management, credential storage
- **Security:** All calls proxied through Supabase edge functions (no direct frontend exposure)

### Campus Partners
- **Status:** 6 campuses secured for program distribution
- **Model:** Revenue share on student enrollments

### Airlines/Operators (In Principle)
- Airbus, Fly Dubai, Etihad — pathway integration agreements in progress
- Target: 3+ live pathway cards by July 2026

---

## 6. Critical Timeline

**Deadline: September 2026**

The project must achieve live status and demonstrable traction by September 2026. This is a firm deadline for organizational commitment.

### Immediate Priorities (Next 30 Days)

1. Complete Veremark API integration for Philippines verification
2. Launch airline dashboard for enterprise customers
3. Activate first live pathway cards (3+ airlines)
4. Drive pilot sign-ups through campus partnerships
5. Complete security audit and penetration testing

### Success Metrics

| Metric | Target |
|--------|--------|
| Verified pilot profiles | 500+ by September |
| Live pathway cards | 10+ airlines/operators |
| Enterprise customers | 3+ paying operators |
| Program enrollments | 100+ pilots |
| Monthly recurring revenue | $10,000+ by September |

---

## 7. Key Files & Resources

### Documentation
- `/docs/veremark-partnership/` — API integration architecture, commercial framework
- `/docs/blog/` — SEO content, CPL-to-airline bridge analysis
- `README.md` — Full project documentation

### Security
- `SECURITY_ARCHITECTURE.md` — Complete security model
- `SECURITY_FIXES_COMPLETE.md` — Code-level security status
- 27 manual configuration items remaining (external services)

### Database
- Supabase Project: `gkbhgrozrzhalnjherfu`
- Migrations in `/supabase/migrations/`

---

## 8. Contact & Access

**Supabase Dashboard:** https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu
**Staging Environment:** [Configured per partner need]
**API Documentation:** `/API_DOCUMENTATION.md`

---

*This document provides a snapshot as of May 27, 2026. For real-time status, check the TODO_30_STEPS.md file in the project root.*
