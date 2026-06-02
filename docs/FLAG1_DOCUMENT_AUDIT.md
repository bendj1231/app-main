# Flag 1 Document Audit: What We Have vs What We Need
## Aviation Pathways Ltd Registration — Gap Analysis

**Date:** June 2, 2026  
**Auditor:** Internal Compliance Review  
**Goal:** Identify ALL missing documents for Mauritius company registration  

---

## ✅ WHAT WE HAVE (Existing Documentation)

### Business Strategy Documents
| Document | Location | Status | Completeness |
|----------|----------|--------|--------------|
| **Universal Commercial Framework (UCF)** | `/docs/UCF_*.md`, `/public/docs/PSA_UCF_27_PILLARS.md` | ✅ | 95% — Comprehensive 27-pillar framework |
| **Commercial Framework Proposal** | `/docs/veremark-partnership/commercial-framework-proposal.md` | ✅ | 90% — Partnership structure defined |
| **Revenue Model Analysis** | `/docs/profit-model.md` | ✅ | 80% — Pricing tiers documented |
| **Go-to-Market Strategy** | `/docs/GOTOMARKET_STRATEGY_DECK.md` | ✅ | 85% — Campus partnerships, airline outreach |

### Technical Documentation
| Document | Location | Status | Notes |
|----------|----------|--------|-------|
| **Domain Architecture** | `/docs/infrastructure-for-three-domains.md` | ✅ | Multi-domain setup explained |
| **Wallet Implementation** | `/docs/DOMAIN_WALLETS_IMPLEMENTATION.md` | ✅ | VC issuance, storage, security |
| **Data Architecture** | `/docs/DATA_ARCHITECTURE_CLARIFICATION.md` | ✅ | 3-tier custody model |
| **API Documentation** | `/API_DOCUMENTATION.md` | ✅ | Endpoints documented |
| **Privacy Policy Snippet** | `/docs/PRIVACY_POLICY_DATA_CUSTODY_SNIPPET.md` | ✅ | Data custody explanation |

### Legal/Compliance Documentation
| Document | Location | Status | Notes |
|----------|----------|--------|-------|
| **Terms of Service** | `/app/terms-of-service/page.tsx` | ✅ | Comprehensive ToS (1,600+ lines) |
| **Enterprise B2B Agreement** | `/docs/ENTERPRISE_B2B_AGREEMENT.md` | ✅ | Airline contract template |
| **Security Architecture** | `/SECURITY_ARCHITECTURE.md` | ✅ | RLS, encryption, audit logs |

### Founder Information
| Item | Status | Notes |
|------|--------|-------|
| **Passport (Mauritian)** | ✅ You have | Need certified copy |
| **Mauritian ID Card** | ✅ You have | National ID for domestic registration |
| **Proof of Address (Dubai)** | ✅ You have | Villa 29, Springs 3 tenancy/DEWA |
| **CPL Qualification** | ✅ You have | CAAP license (not disclosed publicly) |
| **Bank Account (UAE)** | ✅ You have | Need reference letter |

---

## ❌ WHAT WE'RE MISSING (Critical Gaps)

### 🚨 CRITICAL — Registration Blockers

| Missing Document | Why Needed | Who Prepares | ETA |
|------------------|------------|--------------|-----|
| **Memorandum & Articles of Association** | Required by CBRD for incorporation | You / Agent / Lawyer | 1-2 days |
| **Source of Funds Declaration (signed)** | Anti-money laundering compliance | You (template provided) | 1 hour |
| **Bank Reference Letter** | Proof of financial standing | Your UAE bank | 2-3 days |
| **Certified Passport Copy** | KYC for CBRD | Notary in Dubai | 1 day |
| **Business Plan (formal, 3-year)** | EDB requirement (if applying for incentives) | You | 1 day |

### 🟡 IMPORTANT — Operational/Legal Gaps

| Missing Document | Why Needed | Risk if Missing | Priority |
|------------------|------------|-----------------|----------|
| **Standard Contractual Clauses (SCCs)** | GDPR Art 44 — EU pilot data to Singapore | €20M fine exposure | 🔴 HIGH |
| **Record of Processing Activities (ROPA)** | GDPR Art 30 — Regulator audit request | Compliance violation | 🔴 HIGH |
| **Data Protection Impact Assessment (DPIA)** | GDPR — High-risk processing (medical data) | Cannot prove "necessity" | 🔴 HIGH |
| **DPO Appointment / Exemption Opinion** | GDPR Art 37 — Medical data processing | €10M fine exposure | 🔴 HIGH |
| **.env.example file** | Developer onboarding, deployment | Cannot deploy/reproduce | 🟡 MEDIUM |
| **Redis TTL Configuration Proof** | ToS Section 14.2 promise | Legal misrepresentation | 🟡 MEDIUM |
| **Veremark MSA (signed)** | Partnership legal basis | Cannot process verifications | 🔴 HIGH |
| **IP Assignment Agreement** | Founder → Company IP transfer | You may not own platform IP | 🔴 HIGH |
| **Co-Founder Agreement (with Karl)** | Equity, roles, vesting | Dispute risk | 🟡 MEDIUM |

### 🟢 NICE TO HAVE — Post-Registration

| Missing Document | Purpose | Timeline |
|------------------|---------|----------|
| **Certificate of Good Standing** | Prove company is active | After 1 year |
| **Trademark Registration** | Protect "Aviation Pathways" / "PilotRecognition" | Post-launch |
| **Insurance (Cyber Liability)** | Protect against data breach claims | Before first pilot |
| **ISO 27001 Certification** | Enterprise sales credibility | Year 2 |
| **SOC 2 Type II Report** | US airline requirement | Year 2 |

---

## 🛠️ IMMEDIATE ACTION PLAN (Next 72 Hours)

### Day 1 (Today) — Flag 1 Critical Path

| Time | Action | Document Produced |
|------|--------|-------------------|
| 30 min | Call Dubai bank for reference letter | Bank Reference Letter (2-3 days) |
| 30 min | Visit Dubai Courts Notary with passport | Certified Passport Copy (same day) |
| 1 hour | Fill in Source of Funds template | Signed Declaration (today) |
| 2 hours | Draft Memorandum & Articles | M&A draft (today) |
| 1 hour | Submit name reservation online | Name reservation confirmation (today) |

**End of Day 1:** All KYC docs ready for CBRD submission

### Day 2-3 — Submission

| Action | Document Produced |
|--------|-------------------|
| Submit to CBRD (online or in-person) | Application receipt |
| Pay government fees ($50) | Payment confirmation |
| Wait for processing | — |

**End of Day 3:** Certificate of Incorporation issued

### Day 4-5 — Compliance Gap Closure

| Action | Document Produced |
|--------|-------------------|
| Draft SCCs for Singapore databases | SCC template |
| Start ROPA draft | ROPA v0.1 |
| Draft DPIA for medical processing | DPIA framework |
| Get DPO legal opinion | DPO exemption memo OR appointment letter |

---

## 📋 DOCUMENT TEMPLATES READY TO USE

### ✅ Ready Now (In This Repo)

1. **Source of Funds Declaration** — `MAURITIUS_REGISTRATION_ACTION_PACK.md` (line 129)
2. **Business Plan Summary** — `MAURITIUS_REGISTRATION_ACTION_PACK.md` (line 143)
3. **Objects Clause for M&A** — `MAURITIUS_REGISTRATION_ACTION_PACK.md` (line 174)
4. **Share Structure** — `MAURITIUS_REGISTRATION_ACTION_PACK.md` (line 197)

### ❌ Still Need to Create

1. **Complete Memorandum & Articles** — Use templates as foundation
2. **SCCs (Standard Contractual Clauses)** — EU Commission 2021 template
3. **ROPA (Record of Processing Activities)** — GDPR template
4. **DPIA (Data Protection Impact Assessment)** — ICO template
5. **Co-Founder Agreement** — Legal review needed
6. **IP Assignment** — Lawyer needed

---

## 🎯 PRIORITY MATRIX

### DO TODAY (Flag 1 Blockers)
- [ ] Bank reference letter request
- [ ] Passport certification (notary)
- [ ] Source of Funds declaration (sign it)
- [ ] Name reservation submission
- [ ] Memorandum & Articles draft

### DO THIS WEEK (Compliance Critical)
- [ ] SCCs for Singapore (EU data protection)
- [ ] ROPA draft (Art 30 compliance)
- [ ] DPO legal opinion (Art 37 compliance)
- [ ] DPIA for medical data (high-risk processing)

### DO BEFORE LAUNCH (Operational)
- [ ] Veremark MSA signed
- [ ] .env.example created
- [ ] Redis TTL verified
- [ ] Co-Founder Agreement with Karl
- [ ] IP Assignment Agreement

---

## 📞 WHO TO CONTACT

### For Flag 1 (Business Registration)
| Need | Contact | Cost | Timeline |
|------|---------|------|----------|
| Bank reference | Your UAE bank | Free | 2-3 days |
| Passport certification | Dubai Courts Notary | ~$20 | Same day |
| Name reservation | https://onlinesearch.gov.mu/ | $2 | Same day |
| M&A drafting | Local Mauritius accountant | $50-100 | 1 day |

### For Compliance Gaps
| Need | Contact | Cost | Timeline |
|------|---------|------|----------|
| DPO legal opinion | Mauritius data protection lawyer | €500-1,000 | 3-5 days |
| SCCs template | EU Commission (free) / Lawyer review | €300-500 | 2-3 days |
| ROPA/DPIA | Data protection consultant | €1,000-2,000 | 1 week |
| Co-Founder Agreement | Startup lawyer | €500-1,500 | 1 week |
| IP Assignment | IP lawyer | €500-1,000 | 3-5 days |

---

## 💰 TOTAL COST TO FIX ALL GAPS

| Category | Cost | Timeline |
|----------|------|----------|
| **Flag 1 (Business Registration)** | $150 | 5 days |
| **Critical Compliance (SCCs, ROPA, DPO, DPIA)** | €2,000-4,000 | 2 weeks |
| **Operational (MSA, IP, Co-Founder)** | €2,000-4,000 | 2-3 weeks |
| **TOTAL** | **~$6,000-8,000** | **3-4 weeks** |

---

## ✅ SUCCESS CRITERIA

**Flag 1 = RESOLVED when:**
- [x] Certificate of Incorporation issued
- [ ] GBC License (not needed for domestic company)
- [ ] Tax Residency Certificate (can apply later)
- [ ] Mauritius bank account (optional for now)

**Red Flags = ALL RESOLVED when:**
- [ ] Business entity registered
- [ ] SCCs implemented (EU data)
- [ ] ROPA completed
- [ ] DPO appointed or exempted
- [ ] DPIA signed off
- [ ] Veremark MSA signed
- [ ] Co-Founder Agreement signed
- [ ] IP Assignment complete

---

## 🚨 REALITY CHECK

**You're further ahead than you think:**
- ✅ UCF is comprehensive (27 pillars)
- ✅ ToS is legally robust (1,600+ lines)
- ✅ Technical architecture documented
- ✅ Founder docs (passport, ID, CPL) in hand

**But these are hard blockers:**
- ❌ No legal entity (cannot sign contracts)
- ❌ No SCCs (illegal to process EU data)
- ❌ No ROPA (first thing regulator asks for)
- ❌ No DPO (GDPR violation)

**The good news:** Most can be done in parallel. Flag 1 (business reg) is 5 days. Compliance docs are 2-3 weeks.

---

**Bottom line: You have the strategy and technical docs. You need the legal entity and compliance paperwork.**

**Start with the 5 Flag 1 blockers today.**

