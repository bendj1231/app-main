# PilotRecognition.com — Full Production Readiness Audit
## Business Registration, DPO & Security Compliance

**Date:** June 2, 2026  
**Auditor:** Cascade AI — Automated Codebase & Infrastructure Audit  
**Project:** gkbhgrozrzhalnjherfu (Supabase)  
**Scope:** Corporate structure, data protection officer compliance, technical security, legal documentation, deployment readiness

---

## Executive Summary

| Category | Status | Critical Gaps | Action Required |
|----------|--------|--------------|-----------------|
| **Business Registration** | RED | Company NOT registered; operating as individuals | Immediate |
| **DPO & Privacy Compliance** | AMBER | Pages exist but entity conflicts; no real DPO appointed | High |
| **Technical Security** | AMBER | 3 active Supabase advisor issues; 27 manual items pending | High |
| **Legal Documentation** | RED | Three different operator names across docs | Immediate |
| **Infrastructure & Deployment** | GREEN | 47 edge functions live; data-export built; RLS enabled globally | Medium |
| **Cookie & Consent** | GREEN | Banner implemented; granular preferences; policy page live | Low |

**Overall Verdict: NOT PRODUCTION READY for registration business or DPO audit.**

The platform has strong technical architecture but critical legal and corporate governance gaps that would fail any regulatory inspection, investor due diligence, or enterprise B2B onboarding.

---

## 1. Business Registration — RED

### Current State
- **No registered corporate entity exists.**
- The privacy policy at `app/privacy-policy/page.tsx:64` explicitly states: *"We do not currently operate through a registered corporate entity. All data processing decisions are made by us as individuals and we accept personal responsibility for compliance with applicable privacy laws."*
- The EDB Mauritius guide (`docs/EDB_MAURITIUS_BUSINESS_SETUP.md`) documents the intended structure but **no incorporation has been filed**.

### Proposed vs Actual
| Item | Proposed | Actual |
|------|----------|--------|
| Entity name | Aviation Pathways Ltd | None — individuals operating platform |
| Jurisdiction | Mauritius (GBC-1 or sole trader) | Personal liability of founders |
| Registration | EDB Mauritius + Data Protection Office | Not filed |
| Bank account | MCB / AfrAsia corporate account | None |
| Tax residency certificate | MRA | None |

### Risk
- **Unlimited personal liability** for Benjamin Bowler and Karl Vogt.
- Cannot sign B2B enterprise contracts (airlines, ATOs, Veremark) as individuals.
- Cannot process payments under corporate structure.
- No corporate veil protection for IP, data breach liability, or employment disputes.
- **Registration business requirement:** To register as a business and conduct DPO checks, a legal entity is mandatory in every jurisdiction listed (Philippines, UAE, Mauritius, EU).

### Required Actions
1. **File incorporation immediately** with Companies and Business Registration Division (CBRD), Mauritius.
2. Reserve name: **Aviation Pathways Ltd** (MUR 100).
3. Prepare Memorandum & Articles of Association with aviation-specific objects clause.
4. Apply for GBC-1 license (7-10 days) or register as domestic company if staying below GBC thresholds.
5. Register with **Data Protection Office, Mauritius** (required for DCA v1.7 claims).
6. Open corporate bank account (MCB or AfrAsia).

---

## 2. DPO & Data Protection Compliance — AMBER

### What Exists (Green)
| Component | Location | Status |
|-----------|----------|--------|
| DPO Contact Page | `/app/dpo/page.tsx` | Live |
| Privacy Policy | `/app/privacy-policy/page.tsx` | Live, comprehensive |
| Cookie Policy | `/app/cookie-policy/page.tsx` | Live |
| Terms Page | `/app/terms/page.tsx` | Live |
| Data Controller Agreement Modal | `DataControllerAgreementModal.tsx` | PR-DCA-001 v1.7 |
| Cookie Consent Banner | `CookieConsent.tsx` | Granular preferences (necessary/analytics/marketing/preferences) |
| Data Export Edge Function | `data-export` (v1, JWT verified) | Built for GDPR Art. 20 portability |
| Data Erasure | `delete-account` edge function | Built for GDPR Art. 17 |
| Sub-processor table | Privacy policy Section 4 | Lists Supabase, Auth0, Veremark, Stripe, Resend, Cloudinary |
| Supervisory authorities | `/app/dpo/page.tsx` | NPC, EDPB, ICO, UAE Data Office, Mauritius DPO, Singapore PDPC |

### Critical Gaps (Red)

#### Gap 2.1 — Legal Entity Name Conflict
Three different operator names appear across legally binding documents:

| Document | Claims Operator As |
|----------|-------------------|
| `docs/TERMS_OF_SERVICE_REWRITE.md` | **AJBowler Consult** |
| `app/privacy-policy/page.tsx` | **Karl Brian Vogt & Andrew Bowler** (individuals) |
| `app/terms/page.tsx` | **WM Pilot Group** |
| `app/dpo/page.tsx` | **WM Pilot Group (Aviation Pathways Limited)** |
| `DataControllerAgreementModal.tsx` | **WM Pilot Group** |

**This is a fatal compliance flaw.** A regulator or enterprise legal team will reject the platform immediately upon seeing inconsistent contracting parties.

**Fix:** Pick ONE entity name. After Mauritius incorporation, update ALL documents to **Aviation Pathways Ltd** (or whichever name is filed). Create a migration script to update database records referencing old names.

#### Gap 2.2 — No Appointed DPO
- The `/app/dpo/page.tsx` displays contact info but **no named individual** holds the DPO role.
- GDPR Art. 37 requires a designated DPO for processing special category data (health data from medical certificates) at scale.
- `privacy@pilotrecognition.com` is listed but there is **no evidence this mailbox is configured** or monitored.

**Fix:**
1. Create and verify `privacy@pilotrecognition.com` (via Resend or Google Workspace).
2. Appoint either Benjamin Bowler or an external DPO service.
3. Publish DPO name, phone, and email on the DPO page.
4. Register DPO with Mauritius Data Protection Office.

#### Gap 2.3 — Privacy Policy Contradictions
- Privacy policy claims pilots are "Data Controller" and platform is "Data Processor" — but then states the operators are "joint personal information controllers" under RA 10173. These are conflicting legal framings.
- The DCA modal (v1.7) claims the platform is an "Infrastructure Controller" while the pilot is "Credential Custodian." The privacy policy says the platform is "Data Controller" for infrastructure. These terms create confusion under GDPR Art. 4.

**Fix:** Standardise on ONE framework:
- **Pilot = Data Subject / Credential Custodian**
- **Aviation Pathways Ltd = Data Controller (for platform infrastructure)**
- **Veremark / Auth0 / Supabase = Data Processors / Sub-processors**

#### Gap 2.4 — Missing Data Processing Agreement (DPA)
- No DPA document exists between Aviation Pathways Ltd (or current operator) and:
  - Veremark (credential verification)
  - Auth0/Okta (authentication)
  - Supabase (database hosting)
  - Stripe (payments)
- Enterprise customers (airlines) will require a signed DPA before API access.

**Fix:** Generate standard DPAs for each sub-processor. Store signed copies.

#### Gap 2.5 — Mauritius Registration Claimed But Unverified
- DCA v1.7 Article 9 claims: *"WM Pilot Group (Aviation Pathways Limited) is registered as a Data Controller with the Data Protection Office of Mauritius."*
- No registration number is provided.
- The EDB guide is a plan, not a certificate.

**Fix:** Remove this claim until registration is complete. Then add the actual registration number.

---

## 3. Technical Security — AMBER

### Active Supabase Security Advisor Issues (June 2, 2026)

| Level | Issue | Location | Remediation |
|-------|-------|----------|-------------|
| **ERROR** | Security Definer View | `public.enterprise_pilot_pulls` | Change to SECURITY INVOKER or document justification |
| **WARN** | RLS Policy Always True | `public.pathway_matches` — policy "System can manage matches" | Restrict USING/WITH CHECK to `auth.uid() = pilot_id` or service role |
| **WARN** | Leaked Password Protection Disabled | Supabase Auth settings | Enable in Dashboard → Auth → Password Security |

### Remaining 27 Manual Security Items
From `PRE_DEPLOYMENT_CHECKLIST.md`:

| Category | Items | Status |
|----------|-------|--------|
| Supabase Dashboard | Enable leaked password protection | PENDING |
| Cloudflare | WAF, DDoS, rate limiting, bot detection, geo-blocking (8 items) | PENDING |
| DNS | DNSSEC, DMARC/SPF/DKIM, CAA records (4 items) | PENDING |
| TLS | 1.3, PFS, cipher suites, OCSP (5 items) | PENDING |
| Encryption | Key rotation, HSTS, cert pinning (4 items) | PENDING |
| External | Third-party security audit | PENDING |

### Secrets in Git History — CRITICAL
From `PRE_AUDIT_REMEDIATION_REPORT.md`:
- `.env` and `.env.local` were removed from index but **git history still contains**:
  - `SUPABASE_SERVICE_ROLE_KEY` (full admin access)
  - `NEON_DATABASE_URL` (plaintext password)
  - `MONGODB_URI` (plaintext password)
  - `STRIPE_SECRET_KEY`
  - `ENCRYPTION_KEY`, `JWT_SECRET`, `SESSION_SECRET` (key reuse across all three)
  - `RESEND_API_KEY`
  - `GROQ_API_KEY`

**Required:** Rotate ALL keys + scrub history with `git-filter-repo` or BFG Repo-Cleaner.

### ToS Infrastructure Gap — Redis 72h TTL
- ToS Section 14.2 declares deterministic 72-hour TTL expiration for transient payloads.
- No Redis instance exists. Rate limiting uses ephemeral in-memory `Map()`.
- **Fix Option A (Immediate):** Update ToS to reflect actual ephemeral in-memory cache.
- **Fix Option B (Proper):** Provision Upstash Redis or Supabase KV with explicit EXPIRE.

---

## 4. Legal Documentation — RED

### Conflicting Legal Entities (Critical)
As documented in Section 2.1, the platform uses three different legal identities:
1. **AJBowler Consult** — Terms of Service Rewrite v2.0
2. **Karl Brian Vogt & Andrew Bowler** — Privacy Policy
3. **WM Pilot Group / Aviation Pathways Limited** — DCA, DPO page, Terms page

**Impact:** Any contract, privacy complaint, or regulatory inquiry will be challenged on standing. Airlines' legal teams will refuse to sign enterprise agreements.

### Missing Documents
| Document | Status | Needed For |
|----------|--------|------------|
| Imprint / Legal Notice page | MISSING | EU/DE compliance, transparency |
| Data Processing Agreement (DPA) | MISSING | Enterprise B2B, GDPR Art. 28 |
| Sub-processor list (published) | PARTIAL | Privacy policy has table but no update mechanism |
| Data Breach Response Plan | MISSING | GDPR 72-hour notification requirement |
| Records of Processing Activities (ROPA) | MISSING | GDPR Art. 30 |
| Cookie consent log (timestamped) | MISSING | ePrivacy Directive proof of consent |
| Age verification audit log | MISSING | COPPA/GDPR Art. 8 child protection |

### Terms & Privacy Pages Are Live
- `/terms` — renders combined Privacy Policy & Terms
- `/privacy-policy` — standalone privacy policy
- `/cookie-policy` — cookie policy with third-party services listed
- `/dpo` — DPO contact and rights page
- `/data-controller-agreement` — public DCA page

These are correctly routed and appear in the codebase.

---

## 5. Infrastructure & Deployment — GREEN

### Edge Functions (47 Deployed)
All critical functions are live including:
- **Auth:** auth-login, auth-signup, auth-logout, auth-refresh, auth-verify (all JWT configured)
- **MFA:** auth-mfa-setup, auth-mfa-verify, auth-mfa-disable, auth-mfa-backup-codes
- **Wallet:** create-wallet, vc-vault-key, vc-status, vc-revoke, vc-verify, issue-pilot-credential, pilot-terminal-issue
- **Verification:** veremark-initiate, veremark-webhook (v19)
- **Enterprise:** enterprise-access, pilot-pull-api (v19 with rate limiting)
- **Data Subject Rights:** data-export (v1), delete-account
- **Storage:** pinata-pin-vp, r2-presign-upload, cloudinary-upload, cloudinary-delete
- **Other:** stripe-checkout, stripe-cancel, stripe-upgrade, password-reset, health-check, ai-coaching, aviation-data-agent

### Database Security
- **RLS enabled on all public tables** — verified via `pg_tables` query.
- **origin_jurisdiction** — immutable trigger enforced (ToS 13.3 compliant).
- **pilot-pull-api** — per-user rate limiting (200/hr), session expiry validation, security events logging.
- **veremark-webhook** — auto-revocation on discrepancy/failed (ToS 11.2, 16.1 compliant).
- **Activation credit expiry** — daily cron at 2 AM UTC.
- **Log retention purge** — daily cron purges logs > 12 months.

### Wallet & Cryptography
- Tier 1: ECDSA P-256 non-extractable keys in IndexedDB
- Tier 2: AES-256-GCM encrypted credential storage
- Tier 3: Endpoint registry + status pointers
- Tier 4: Audit log
- W3C VC context: `public/contexts/v2/aviation-v2.jsonld`
- DID method: `did:key` derivation live
- Status list polling: 60s circuit breaker

### Deployment
- Vercel configuration exists (`vercel.json`)
- 9 subdomains planned in `DEPLOYMENT_CHECKLIST.md`
- DNS records documented but not confirmed propagated
- SSL auto-provision expected via Vercel

---

## 6. Recommended Action Plan

### Phase 1: Legal Foundation (Week 1 — BLOCKING)
| # | Action | Owner | Deliverable |
|---|--------|-------|-------------|
| 1.1 | File Mauritius incorporation (Aviation Pathways Ltd) | Benjamin | Certificate of Incorporation |
| 1.2 | Register with Mauritius Data Protection Office | Benjamin | DPO Registration Certificate |
| 1.3 | Open MCB or AfrAsia corporate bank account | Benjamin | Corporate account open |
| 1.4 | Standardise ALL legal docs to "Aviation Pathways Ltd" | Legal/Founder | Updated ToS, Privacy Policy, DCA |
| 1.5 | Configure `privacy@pilotrecognition.com` mailbox | Technical | Verified email inbox |
| 1.6 | Appoint named DPO and publish contact | Benjamin | DPO page updated with name |

### Phase 2: Security Hardening (Week 1-2)
| # | Action | Deliverable |
|---|--------|-------------|
| 2.1 | Enable leaked password protection in Supabase Dashboard | Dashboard setting ON |
| 2.2 | Fix `enterprise_pilot_pulls` SECURITY DEFINER view | Migration applied |
| 2.3 | Fix `pathway_matches` RLS policy | Migration applied |
| 2.4 | Rotate ALL exposed secrets + scrub git history | New keys active, history clean |
| 2.5 | Provision Upstash Redis OR update ToS Section 14.2 | Either Redis live OR ToS amended |
| 2.6 | Configure Cloudflare WAF + DNSSEC + DMARC/SPF/DKIM | Security headers verified |

### Phase 3: Compliance Documentation (Week 2)
| # | Action | Deliverable |
|---|--------|-------------|
| 3.1 | Create Imprint/Legal Notice page | `/imprint` live |
| 3.2 | Draft Data Processing Agreements (Veremark, Auth0, Supabase, Stripe) | Signed/stored copies |
| 3.3 | Create Data Breach Response Plan | Document + escalation runbook |
| 3.4 | Create Records of Processing Activities (ROPA) | Spreadsheet / doc |
| 3.5 | Add cookie consent timestamp logging | DB table + audit trail |
| 3.6 | Create age verification audit log | Minor/Student pilot gate logging |

### Phase 4: Enterprise Readiness (Week 3)
| # | Action | Deliverable |
|---|--------|-------------|
| 4.1 | Third-party security audit (penetration test) | Audit report |
| 4.2 | Complete 48-hour deployment monitoring checklist | Checked-off checklist |
| 4.3 | Test data-export end-to-end with real user data | Verified GDPR portability |
| 4.4 | Test delete-account full erasure flow | Verified GDPR erasure |

---

## Appendices

### Appendix A: File References
- Business setup: `docs/EDB_MAURITIUS_BUSINESS_SETUP.md`
- Privacy policy snippet: `docs/PRIVACY_POLICY_DATA_CUSTODY_SNIPPET.md`
- Terms rewrite: `docs/TERMS_OF_SERVICE_REWRITE.md`
- Pre-audit remediation: `PRE_AUDIT_REMEDIATION_REPORT.md`
- Security fixes: `SECURITY_FIXES_COMPLETE.md`
- Pre-deployment checklist: `PRE_DEPLOYMENT_CHECKLIST.md`
- Deployment checklist: `DEPLOYMENT_CHECKLIST.md`

### Appendix B: Live Compliance Pages
| Route | File |
|-------|------|
| `/privacy-policy` | `app/privacy-policy/page.tsx` |
| `/terms` | `app/terms/page.tsx` |
| `/cookie-policy` | `app/cookie-policy/page.tsx` |
| `/dpo` | `app/dpo/page.tsx` |
| `/data-controller-agreement` | `app/data-controller-agreement/page.tsx` |

### Appendix C: Edge Functions Relevant to Compliance
| Function | Purpose | JWT |
|----------|---------|-----|
| `data-export` | GDPR Art. 20 data portability | Required |
| `delete-account` | GDPR Art. 17 erasure | Not required (self-service) |
| `veremark-webhook` | Credential revocation automation | Required |
| `vc-revoke` | VC status revocation | Required |
| `pilot-pull-api` | Enterprise data pull with audit | Required |
| `issuer-sign` | W3C VC cryptographic signing | Required |

---

**End of Audit Report**
