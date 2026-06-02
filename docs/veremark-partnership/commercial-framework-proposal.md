# Commercial Framework Proposal
## PilotRecognition + Veremark Partnership

**Updated with Pillar 27: Sovereign Data Custody Architecture**

---

## Pillar 27: Data Custody Model (Privacy-First Architecture)

### The Three-Tier Data Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│ TIER 1: PILOT WALLET (Client-Side, Pilot Controls)               │
│ • W3C Verifiable Credentials (cryptographic proofs)              │
│ • Private keys (P-256, non-extractable)                        │
│ • Decentralized ID (DID)                                        │
│ • WE CANNOT ACCESS — Only pilot controls keys                   │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼ Sync/Verification
┌─────────────────────────────────────────────────────────────────┐
│ TIER 2: PILOTRECOGNITION PLATFORM (Text Claims Only)            │
│ • License number (encrypted at rest)                             │
│ • Medical class & expiry dates                                 │
│ • Total flight hours                                           │
│ • Credential status (active/revoked)                           │
│ • ❌ NO PHYSICAL DOCUMENTS STORED                               │
└─────────────────────────────────────────────────────────────────┘
                           │
                           ▼ Verification Request
┌─────────────────────────────────────────────────────────────────┐
│ TIER 3: VEREMARK / REGIONAL AUTHORITIES (Document Custodians)    │
│ • Physical license scans                                        │
│ • Medical certificates (PDF/images)                             │
│ • Verification reports                                          │
│ • Jurisdiction-specific (PH, US, EU, etc.)                      │
│ • WE RECEIVE: "verified" / "not verified" + basic metadata      │
└─────────────────────────────────────────────────────────────────┘
```

### Key Commercial Implications

| Stakeholder | Data Access | Liability |
|-------------|-------------|-----------|
| **Pilot** | Full control of wallet credentials | Self-custody risk |
| **PilotRecognition** | Text claims only (no docs) | Minimal GDPR exposure |
| **Veremark** | Physical documents for verification | Document processor liability |
| **Airlines** | VC cryptographic proofs | No document handling |

### Privacy Benefits

1. **Breach Impact Minimized:** Attackers get only text claims — no medical images or passport scans
2. **GDPR Art 9 Compliance:** Health data (medicals) stays with custodians; we store only "Class 1 / valid" classification
3. **Data Residency:** Physical documents remain in-country (PH, US, EU) per local law
4. **Right to Erasure:** Delete text claims instantly; request document deletion from Veremark/authority

### Partnership Alignment

- **Veremark as Tier 3 Custodian:** Veremark manages document verification but doesn't share documents with us
- **API Integration:** Veremark sends only verification result, not document images
- **Compliance Synergy:** Shared data minimization philosophy
- **Commercial Value:** Reduced compliance liability = lower insurance, faster B2B sales

### Contractual Safeguards (MSA Requirements)

**Data Processing Limitation Clause (Required in all Verification Provider MSAs):**

```
1. PURPOSE LIMITATION
   Provider shall process pilot medical certificate data SOLELY for the purpose 
   of verification status determination. Provider is PROHIBITED from:
   - Using medical data for any secondary purpose
   - Sharing medical documents with third parties
   - Retaining medical images beyond the verification period

2. DATA MINIMIZATION PROTOCOL
   Provider shall implement technical measures to ensure:
   - Only verification STATUS (verified/not verified) is transmitted to PilotRecognition
   - Medical certificate images/PDFs are NEVER transmitted to PilotRecognition
   - Only classification metadata (Class 1/2/3, expiry date) is shared

3. RETENTION AND DELETION
   Provider shall:
   - Retain medical certificate images for MAXIMUM 90 days post-verification
   - Automatically delete all medical document files after 90 days
   - Provide deletion certificates upon request
   - Certify deletion within 5 business days of pilot account closure

4. SUB-PROCESSOR RESTRICTIONS
   Provider shall NOT engage sub-processors for medical data without:
   - Prior written consent from PilotRecognition
   - Equivalent contractual safeguards
   - Evidence of sub-processor jurisdiction adequacy

5. AUDIT RIGHTS
   PilotRecognition reserves the right to audit Provider's data handling:
   - Annual third-party security assessments
   - Data retention log reviews
   - Verification that no medical images are transmitted to PilotRecognition

6. BREACH NOTIFICATION
   Provider must notify PilotRecognition within 24 hours of any:
   - Unauthorized access to medical certificate data
   - Retention beyond 90 days
   - Transmission of medical images to unauthorized parties

7. LIABILITY ALLOCATION
   - Provider bears FULL LIABILITY for medical data breaches, GDPR Art 9 violations
   - PilotRecognition liability LIMITED TO: text claims (medical class, expiry) only
   - Provider indemnifies PilotRecognition for regulatory fines arising from 
     Provider's medical data processing
```

### Technical Architecture Proof Points

**Evidence That Medical Data Never Touches Our Servers:**

| Checkpoint | Implementation | Proof |
|------------|----------------|-------|
| API Schema Validation | Webhook payload restricted to: `medical_class`, `expiry_date`, `status` | Rejects any payload containing `medical_certificate_image`, `doctor_notes`, `examination_results` |
| Supabase RLS | No storage buckets for medical documents | Database audit shows ZERO medical image storage |
| Network Layer | Firewall rules block multipart/form-data containing medical file signatures | Logs show rejection of medical document uploads |
| Verification Flow | Veremark API → Status JSON → Our Database (text only) | Architecture diagram shows no document transmission path |

**The Golden Response:**
> *"Show us the medical data in our systems. Our API rejects it. Our RLS blocks it. Our architecture prevents it. We process only classification metadata — never health data."*

### Liability Separation Framework

| Data Type | Holder | GDPR Category | Liability |
|-----------|--------|---------------|-----------|
| Medical certificate images (PDFs, scans) | **Veremark only** | Special category (Art 9) | **Veremark bears full liability** |
| Doctor notes, examination results | **Veremark only** | Special category (Art 9) | **Veremark bears full liability** |
| `medical_class: "Class 1"` (text) | PilotRecognition | Not health data | Minimal — classification metadata |
| `expiry_date: "2026-05-02"` (date) | PilotRecognition | Not health data | Minimal — administrative data |
| `status: "verified"` (enum) | PilotRecognition | Not health data | Minimal — verification status |

### Legal Basis: Operational Necessity Defense

**GDPR Article 6.1(f) — Legitimate Interest Assessment**

| Element | Assessment | Evidence |
|---------|------------|----------|
| **Legitimate Interest** | Aviation safety + airline operational integrity | EASA Part-MED, FAA Part 67, CAAP CAR Part 2, ICAO Annex 1 mandates |
| **Necessity** | Cannot assess pathway eligibility without medical currency | Airlines legally cannot employ pilots without medical verification |
| **Balancing Test** | Pilot privacy vs. public safety | Minimal data (class/expiry only), opt-in per pathway, delete anytime |

**Processing Purpose:**
> Medical status data (`medical_class`, `expiry_date`, `verification_status`) is processed SOLELY to:
> 1. Determine pilot eligibility for specific career pathways requiring medical currency
> 2. Enable airlines (data controllers) to comply with statutory medical fitness requirements
> 3. Facilitate safe employment matching between verified pilots and regulated operators

**Data Flow Architecture:**
```
Veremark (Tier 3 Custodian)
    ↓ [Medical document processing — Veremark's legal basis]
Status JSON: {"medical_class": "Class 1", "expiry": "2026-05-02", "status": "valid"}
    ↓ [API schema validation — WE ONLY RECEIVE THIS]
PilotRecognition Tier 2 Database
    ↓ [Employment eligibility status — our Art 6.1(f) legitimate interest]
Airline Data Controller
    ↓ [Contractual relationship with pilot]
Pilot Employment Decision
```

**The Key Legal Argument:**
> PilotRecognition does NOT process "data concerning health" under GDPR Article 9. We process **employment eligibility status** derived from health verification — analogous to:
> - Credit scoring: "approved/declined" (not full credit report)
> - Background checks: "cleared/not cleared" (not full criminal record)
> - Employment verification: "employed 2020-2024" (not full HR file)
>
> **GDPR Article 9.2(b) applies:** Processing necessary for "carrying out the obligations and exercising specific rights of the controller or of the data subject in the field of employment and social security and social protection law"

**Purpose Limitation Declaration:**

| Data Field | Source | Purpose | Legal Basis |
|------------|--------|---------|-------------|
| `medical_class` | Veremark | Verify pathway eligibility | Art 6.1(f) Legitimate Interest |
| `medical_expiry` | Veremark | Confirm currency for airline | Art 6.1(f) + Art 9.2(b) Employment |
| `verification_status` | Internal | Access control to premium pathways | Art 6.1(b) Contract performance |
| `pathway_eligibility` | Aggregated | Match pilots to opportunities | Art 6.1(f) Legitimate Interest |

**What We NEVER Process (Excluded by Architecture):**
- ❌ Medical diagnoses or conditions
- ❌ Medical examination details or results
- ❌ Medical images, PDFs, or scanned documents
- ❌ Health history or physician notes
- ❌ Medical limitation specifics (beyond Class 1/2/3 classification)
- ❌ Treatment information or prescriptions

**The Legal Shield:**
> *"PilotRecognition's infrastructure is architecturally incapable of receiving medical documents. Our API schema explicitly rejects medical image fields. Our RLS policies block document storage. Veremark processes the underlying medical data under their own legal basis and DPIA — we process only the employment eligibility status derived from Veremark's verification. This is contractually enforced, technically verifiable, and regulatorily defensible."*

### Regulatory Pre-Positioning Strategy

**Proactive Submissions (Before Any Challenge):**

1. **ROPA Entry** — Document clear separation: "We process zero medical certificate images"
2. **Technical Whitepaper** — Publish API schema showing rejection of medical document fields
3. **Annual Audit** — Third-party attestation that no medical data resides in our infrastructure
4. **DPIA Scope** — Explicitly exclude medical data processing (it's Veremark's DPIA, not ours)

**Response Framework (If Challenged):**

```
Question: "Do you process medical data under GDPR Article 9?"
Answer: "No. We process verification status metadata only. 
Medical certificate documents are processed by our verification partner 
under separate legal basis and contractual safeguards. 
We can provide technical proof that our systems cannot receive medical images."
```

### Commercial Insurance Implications

| Scenario | With 3-Tier Architecture | Without |
|----------|-------------------------|---------|
| Cyber liability premium | 40% lower (no medical data held) | Standard rate |
| D&O coverage | Available (clear liability separation) | Exclusions for GDPR Art 9 |
| Enterprise customer trust | Higher (demonstrable data minimization) | Lower |
| Regulatory fine exposure | Limited to text claims only | Full medical data exposure |

---

## Original Framework Below

**Document Version:** 1.1  
**Date:** June 2, 2026  
**Updates:** Added Operational Necessity Defense (GDPR Art 6.1(f) + 9.2(b)), Purpose Limitation Declaration, Data Flow Architecture  
**Confidential:** Partnership Discussion Only

---

## 1. Partnership Philosophy

This is not a vendor-client relationship. This is a strategic partnership to build the aviation industry's first comprehensive verification layer.

**PilotRecognition brings:**
- Platform infrastructure (100+ pages, full UX)
- Pilot network access (college partnerships, organic growth)
- Recognition Score algorithm
- Airline/operator relationships

**Veremark brings:**
- Verification infrastructure (API, data sources)
- Philippines ground team (70+ specialists)
- Background checking expertise
- Regional data access (PRC, NBI, etc.)

**Shared goal:** Create the standard for pilot verification in APAC aviation.

---

## 2. Revenue Model Overview

### 2.1 Three Revenue Streams

```
PilotRecognition Revenue
├── Recognition Plus Subscriptions ($99/year)
│   ├── Base tier: Profile, AI matching, pathways
│   └── Verified tier: +$30 includes Veremark check
├── Enterprise SaaS ($1,000/month)
│   ├── Operator dashboard access
│   ├── Profile pulling capabilities
│   └── Verification insights
└── Program Revenue ($49-299)
    ├── Foundation Program
    └── Transition Program

Veremark Revenue
├── Per-Check Fees (wholesale pricing)
│   ├── Co-investment phase: $0 (0-1,000 pilots)
│   ├── Growth phase: $25 (1,000-5,000)
│   └── Scale phase: $15 (5,000+)
└── Volume Commitments
    └── Exclusivity in aviation vertical
```

### 2.2 Pricing Tiers for Veremark

| Phase | Pilot Volume | Price per Check | Annual Volume (est.) | Annual Revenue to Veremark |
|-------|--------------|-----------------|---------------------|---------------------------|
| **Co-Investment** | 0-1,000 | **$0** | 1,000 | $0 (marketing investment) |
| **Growth** | 1,001-5,000 | **$25** | 4,000 | $100,000 |
| **Scale** | 5,001-10,000 | **$15** | 5,000 | $75,000 |
| **Maturity** | 10,000+ | **$12** | 10,000+ | $120,000+ |

**Note:** Prices are wholesale (Veremark to PilotRecognition). Retail pricing to pilots includes our margin.

---

## 3. Pilot-Facing Pricing

### 3.1 Recognition Plus Tiers

| Tier | Price | Veremark Check | What Pilot Gets |
|------|-------|----------------|-----------------|
| **Free** | $0 | Not included | Basic profile, 3 pathways/month |
| **Recognition Plus** | $99/year | Not included | Full profile, unlimited pathways, AI features |
| **Recognition Plus Verified** | **$129/year** | **Included** | All Plus features + Veremark badge |
| **Standalone Check** | $39 one-time | Included | One-time verification (no subscription) |

### 3.2 Airline-Facing Pricing

| Service | Price | Description |
|---------|-------|-------------|
| **Base Enterprise** | $1,000/month | Dashboard access, view public profiles |
| **Profile Pull** | $50 per verification | When airline pulls detailed verified profile |
| **Bulk Verification** | $35 per check | 50+ pilots in single batch |

### 3.3 Who Pays for Verification?

| Scenario | Payer | Amount | Flow |
|----------|-------|--------|------|
| Pilot wants badge | Pilot | $30 (in $129 sub) | Pilot → PR → Veremark ($15 wholesale) |
| Airline pulls profile | Airline | $50 | Airline → PR → Veremark ($25 wholesale) |
| Co-investment phase | Veremark waives | $0 | Veremark absorbs cost |

---

## 4. Co-Investment Model (First 1,000 Pilots)

### 4.1 Rationale

The first 1,000 pilots are about **proving the model**, not generating revenue.

- Both parties invest in market development
- De-risks the partnership for both sides
- Creates case studies and testimonials
- Establishes operational workflows
- Builds airline confidence

### 4.2 Veremark Investment

**Waived fees for:**
- 1,000 background checks
- Estimated value: $25,000-40,000 (at retail rates)
- Philippines team time (70+ specialists)
- API development support

**What Veremark gets:**
- Exclusive aviation partnership in Philippines
- Case studies for APAC expansion
- Reference customer (PilotRecognition)
- Data on aviation verification patterns
- First-mover advantage in pilot vertical

### 4.3 PilotRecognition Investment

**Platform costs absorbed:**
- 1,000 free Recognition Plus subscriptions
- Estimated value: $99,000
- API integration development ($10,000)
- Marketing to recruit Founding Pilots ($5,000)
- College partnership coordination

**What PilotRecognition gets:**
- Verified pilot base for airline demos
- Proof of concept for investors
- Case studies and testimonials
- Refined verification UX
- Market validation

### 4.4 Co-Investment Summary

| Party | Investment | Value | ROI |
|-------|-----------|-------|-----|
| Veremark | 1,000 free checks | ~$30,000 | Aviation vertical access |
| PilotRecognition | 1,000 free subscriptions + dev | ~$115,000 | Verified pilot base |

**Break-even:** At 2,000 paying pilots, both parties recover investment.

---

## 5. Volume Incentives & Scaling

### 5.1 Tiered Pricing Schedule

```
Year 1:
Q1-Q2: Co-investment (0-1,000 pilots) - $0/check
Q3: Growth phase begins (1,001-2,000) - $25/check
Q4: Scaling (2,001-5,000) - $20/check

Year 2:
Q1-Q2: Volume (5,001-10,000) - $15/check
Q3+: Maturity (10,000+) - $12/check
```

### 5.2 Volume Commitments

**PilotRecognition commits to:**
- Minimum 5,000 verified pilots by end of Year 2
- 10,000+ verified pilots by end of Year 3
- Philippines market exclusivity for Veremark in aviation

**Veremark commits to:**
- Priority API capacity for PilotRecognition
- Philippines team allocation for our volume
- Price lock for 3 years (annual adjustment capped at 5%)
- No competing aviation partnerships in Philippines

### 5.3 Exclusivity Terms

| Scope | PilotRecognition | Veremark |
|-------|------------------|----------|
| **Philippines aviation** | Exclusive use of Veremark for verification | Exclusive partnership in pilot vertical |
| **APAC expansion** | Preferred partner (not exclusive) | Preferred partner (not exclusive) |
| **Other verticals** | Can use other verification providers | Can partner with other platforms |

---

## 6. Revenue Share Scenarios

### 6.1 Conservative Scenario (Year 1)

| Quarter | Pilots Verified | Checks | Price | Revenue to Veremark |
|---------|-----------------|--------|-------|---------------------|
| Q1 | 250 | 250 | $0 | $0 (co-investment) |
| Q2 | 500 | 500 | $0 | $0 (co-investment) |
| Q3 | 750 | 750 | $0 | $0 (co-investment) |
| Q4 | 1,000 | 1,000 | $0 | $0 (co-investment) |
| **Total** | **2,500** | **2,500** | - | **$0** |

### 6.2 Moderate Scenario (Year 2)

| Quarter | Pilots Verified | Checks | Price | Revenue to Veremark |
|---------|-----------------|--------|-------|---------------------|
| Q1 | 1,500 | 1,500 | $25 | $37,500 |
| Q2 | 2,500 | 2,500 | $25 | $62,500 |
| Q3 | 4,000 | 4,000 | $20 | $80,000 |
| Q4 | 5,000 | 5,000 | $15 | $75,000 |
| **Total** | **13,500** | **13,500** | - | **$255,000** |

### 6.3 Optimistic Scenario (Year 3)

| Quarter | Pilots Verified | Checks | Price | Revenue to Veremark |
|---------|-----------------|--------|-------|---------------------|
| Q1 | 6,000 | 6,000 | $15 | $90,000 |
| Q2 | 8,000 | 8,000 | $15 | $120,000 |
| Q3 | 10,000 | 10,000 | $12 | $120,000 |
| Q4 | 12,000 | 12,000 | $12 | $144,000 |
| **Total** | **36,000** | **36,000** | - | **$474,000** |

---

## 7. Alternative Commercial Structures

### 7.1 Equity Participation

If waived fees are not acceptable, alternative proposal:
- Veremark invests $50,000 cash + $50,000 in-kind (verification services)
- Receives 2-3% equity in PilotRecognition
- Standard wholesale pricing applies from Day 1
- Board observer seat
- Information rights

### 7.2 Success Fee Model

- Base wholesale pricing: $30/check from Day 1
- No co-investment phase
- Veremark receives 10% of enterprise success fees
- Aligns incentives on quality placements

### 7.3 Revenue Share Model

- 15% of Recognition Plus Verified subscription revenue to Veremark
- Simpler than per-check accounting
- Aligns on subscriber growth
- Example: $129/year × 5,000 pilots × 15% = $96,750/year

---

## 8. Payment Terms

### 8.1 Billing Cycle

- **Pilot subscriptions:** Monthly aggregate (Net 30)
- **Enterprise pulls:** Monthly aggregate (Net 30)
- **Volume discounts:** Quarterly reconciliation

### 8.2 Currency & Settlement

- USD for all transactions
- Philippine Peso option for local teams (conversion at spot rate)
- Monthly invoicing
- Wire transfer or Stripe Connect

### 8.3 Minimums & Guarantees

- **Year 1:** No minimum (co-investment phase)
- **Year 2:** $100,000 minimum commitment from PilotRecognition
- **Year 3:** $200,000 minimum commitment

---

## 9. Success Metrics & Review

### 9.1 KPIs

| Metric | Target | Review Frequency |
|--------|--------|------------------|
| Verified pilots | 1,000 (Year 1), 5,000 (Year 2) | Quarterly |
| Verification completion time | <24 hours average | Monthly |
| Discrepancy rate | <5% | Monthly |
| Pilot satisfaction | >4.5/5 | Quarterly survey |
| Revenue to Veremark | Per scenario | Quarterly |

### 9.2 Partnership Review Schedule

- **Monthly:** Operational check-in (technical team)
- **Quarterly:** Business review (pricing, volume, issues)
- **Annually:** Strategic review (renewal, expansion, pricing)

---

## 10. Term & Termination

### 10.1 Initial Term

- 3-year initial term
- Automatic 1-year renewals unless 90-day notice

### 10.2 Termination Clauses

| Scenario | Notice Period | Obligations |
|----------|---------------|-------------|
| Convenience | 6 months | Complete in-flight verifications |
| Breach | 30 days | Cure period if possible |
| Insolvency | Immediate | Data transfer assistance |

### 10.3 Post-Termination

- Existing verified pilots retain badge until expiry
- No new verifications initiated
- Data deletion per DPA terms
- Transition assistance (60 days)

---

## 11. Discussion Points for Partnership Meeting

### 11.1 Open Questions

1. **Is the co-investment model acceptable?**
   - Waived fees for 1,000 pilots
   - Both parties invest in proving model

2. **Wholesale pricing structure**
   - $0 → $25 → $15 → $12 tiered model
   - Or flat rate alternative?

3. **Exclusivity scope**
   - Philippines: Exclusive both ways?
   - APAC: Preferred but not exclusive?

4. **API integration support**
   - Technical support level during development
   - Sandbox access timeline

5. **Philippines team allocation**
   - Capacity reserved for our volume
   - Turnaround time commitments

### 11.2 Proposed Next Steps

1. **Week 1:** Commercial terms discussion (this document)
2. **Week 2:** Legal review of data processing agreement
3. **Week 3:** Technical integration kickoff
4. **Week 4:** Alpha pilot cohort launch

---

## 12. Summary

This commercial framework is designed to:
- **De-risk both parties** through co-investment
- **Align incentives** on volume growth
- **Scale sustainably** with tiered pricing
- **Build long-term partnership** through exclusivity

**PilotRecognition asks Veremark to:**
1. Waive fees for 1,000 pilots (marketing co-investment)
2. Accept tiered wholesale pricing ($25 → $15 → $12)
3. Provide Philippines aviation exclusivity
4. Support technical integration

**PilotRecognition offers Veremark:**
1. Aviation vertical access in Philippines
2. 5,000+ verified pilots by Year 2
3. $255,000+ revenue by Year 2 (moderate scenario)
4. Platform to scale across APAC

**The ask:** Co-invest with us to prove the model, then scale together to dominate aviation verification in APAC.

---

*This proposal is for discussion purposes. Terms are negotiable. Final agreement subject to legal review and board approval on both sides.*
