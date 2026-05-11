# Verification Provider Agreement
## PilotRecognition + Veremark Partnership

**Document Type:** Legal Addendum to Strategic Liability Protocol  
**Version:** 1.0  
**Date:** May 2026  
**Status:** Draft for Discussion

---

## 1. Purpose & Scope

This agreement defines the specific roles, responsibilities, and liability boundaries between **PilotRecognition** (Platform Provider) and **Veremark** (Verification Provider) within the aviation recognition ecosystem.

This document supplements the **Strategic Liability Protocol** and is incorporated by reference into the Commercial Framework Proposal.

---

## 2. Party Definitions

| Party | Role | Core Responsibility |
|-------|------|---------------------|
| **PilotRecognition** | Platform Provider | Recognition infrastructure, pilot profile management, consent architecture, operator interface |
| **Veremark** | Verification Provider | Background checking, credential verification, data source access, verification accuracy |
| **Pilot** | Data Subject | Credential owner, consent provider, profile controller |
| **Operator** | Data Consumer | Airlines, FTOs, cargo operators accessing verified profiles |

---

## 3. Binary Accountability Framework

### 3.1 Veremark's Independent Accountability

Veremark is **solely and independently accountable** for:

| Category | Specific Responsibilities |
|----------|---------------------------|
| **Verification Accuracy** | Accuracy of all background check results, employment verification, education verification, criminal record checks |
| **Data Source Integrity** | Reliability of connections to Philippines authorities (PRC, NBI, CAAP), maintenance of API/data source relationships |
| **Verification Timeliness** | Completion of standard checks within 24-48 hours, expedited services within SLA |
| **Data Security (Verification Phase)** | Security of pilot data during verification process, encryption in transit and at rest within Veremark systems |
| **Compliance (Verification)** | Philippines DPA 2012 compliance for data processing, adherence to aviation industry privacy standards |
| **Dispute Resolution (Initial)** | First-level review of pilot disputes regarding verification findings |

### 3.2 PilotRecognition's Accountability

PilotRecognition is **solely accountable** for:

| Category | Specific Responsibilities |
|----------|---------------------------|
| **Platform Integrity** | Accurate display of Veremark results, correct badge rendering, proper status indicators |
| **Consent Architecture** | Explicit pilot consent before verification initiation, "Visible to Airlines" toggle functionality, consent withdrawal handling |
| **Data Security (Platform)** | Security of pilot data on PilotRecognition platform, access control, encryption |
| **Compliance (Platform)** | Philippines DPA 2012 compliance for platform data handling, cross-border transfer management |
| **Dispute Facilitation** | Interface for pilots to initiate disputes, communication channel to Veremark, dispute status tracking |
| **Operator Interface** | Proper access controls for operators pulling verified profiles, audit logging of data access |

### 3.3 Shared Accountability

| Category | Shared Responsibilities |
|----------|-------------------------|
| **API Integration** | Both parties responsible for maintaining secure, reliable API connection |
| **Communication** | Coordinated communication to pilots regarding verification status |
| **Incident Response** | Joint response to data breaches or security incidents affecting both systems |
| **Compliance Updates** | Shared monitoring of regulatory changes affecting both parties |

---

## 4. Liability Boundaries

### 4.1 What Veremark is NOT Liable For

- Employment decisions made by operators based on verification results
- Pilot career outcomes (hiring, promotions, pathway access)
- Platform functionality issues (display errors, consent toggle failures)
- Data breaches occurring on PilotRecognition systems
- Misuse of verification data by operators
- Pilot consent management failures

### 4.2 What PilotRecognition is NOT Liable For

- Accuracy of verification results provided by Veremark
- Data source errors (PRC, NBI database inaccuracies)
- Verification delays caused by external authorities
- Data breaches occurring on Veremark systems
- Verification process errors outside platform control

### 4.3 Liability Cap

**Maximum Liability:** Each party's liability is capped at the greater of:
- 12 months of fees paid/payable under the Commercial Framework
- USD $100,000

**Exclusions:** Liability cap does not apply to:
- Gross negligence or willful misconduct
- Regulatory fines for DPA violations
- Intellectual property infringement

---

## 5. Data Governance & Privacy

### 5.1 Data Processing Roles

| Role | Party | Activities |
|------|-------|------------|
| **Data Controller** | PilotRecognition | Determines purposes and means of processing pilot data on platform |
| **Data Processor (Verification)** | Veremark | Processes pilot data solely for verification purposes on behalf of PilotRecognition |
| **Joint Controller (Limited)** | Both | API integration and shared verification status display |

### 5.2 Philippines DPA 2012 Compliance

**Cross-Border Transfer:**
- Pilot data may be transferred from Philippines to Veremark's Singapore processing hub
- Transfer is lawful under DPA Section 22 (adequacy determination: Singapore has adequate data protection)
- Alternative basis: Explicit consent from pilot for cross-border verification

**Data Subject Rights:**
- Pilots have right to access verification results
- Pilots have right to dispute inaccurate findings
- Pilots have right to request deletion (with 90-day retention for audit)
- Pilots have right to data portability

### 5.3 Data Retention

| Data Type | Retention Period | Responsible Party |
|-----------|------------------|-------------------|
| Verification Results | 1 year from completion | Veremark |
| Platform Display of Results | Duration of pilot's active profile | PilotRecognition |
| Audit Logs | 90 days | Both parties |
| Dispute Records | 2 years from resolution | Veremark |

---

## 6. Dispute Resolution Workflow

### 6.1 Pilot Dispute Process

```
┌─────────────────┐
│ Pilot Discovers │
│ Discrepancy     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ PilotRecognition│────▶│ "Dispute" Button│
│ Platform        │     │ (Initiates Case)│
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Case Created:   │
│ - Pilot claim   │
│ - Veremark data │
│ - Evidence      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Veremark        │◀────│ First-Level     │
│ Reviews Case    │     │ Review (7 days) │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Resolution:     │
│ - Upheld        │
│ - Amended       │
│ - Requires     │
│   Additional  │
│   Evidence    │
└─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Pilot Informed  │────▶│ If Unsatisfied: │
│ of Outcome      │     │ Escalation to   │
│                 │     │ Independent     │
│                 │     │ Arbitration     │
└─────────────────┘     └─────────────────┘
```

### 6.2 Dispute Resolution Timeline

| Stage | Timeline | Responsible Party |
|-------|----------|-------------------|
| Case Initiation | Immediate | Pilot via PilotRecognition platform |
| First-Level Review | 7 business days | Veremark |
| Evidence Request (if needed) | Additional 7 days | Veremark |
| Final Resolution | 14 days total | Veremark |
| Appeal/Escalation | 30 days | Independent arbitrator |

### 6.3 Cost Allocation

- **Standard Dispute:** No cost to pilot for first dispute per year
- **Subsequent Disputes:** USD $25 processing fee (pays for manual review)
- **Arbitration:** Costs split 50/50 between PilotRecognition and Veremark
- **Frivolous Disputes:** Pilot pays full arbitration costs if found to be gaming system

---

## 7. Indemnification

### 7.1 Mutual Indemnification

Each party agrees to indemnify the other against:
- Claims arising from the indemnifying party's breach of this agreement
- Regulatory fines resulting from the indemnifying party's violations
- Third-party claims for IP infringement by the indemnifying party

### 7.2 Indemnification Flow

```
Claim Scenario:
├─ Airline sues over bad hire based on inaccurate verification
│  ├─ Airline → PilotRecognition (operator access point)
│  ├─ PilotRecognition → Veremark (verification accuracy)
│  └─ Veremark defends claim and pays damages (if verification was wrong)
│
├─ Pilot sues for privacy breach due to consent toggle failure
│  ├─ Pilot → PilotRecognition (platform operator)
│  ├─ PilotRecognition defends claim and pays damages (if toggle malfunctioned)
│  └─ No claim against Veremark (consent is platform function)
│
├─ Regulatory fine for DPA violation during cross-border transfer
│  ├─ Depends on where violation occurred
│  ├─ Transfer authorization: PilotRecognition (consent)
│  ├─ Transfer execution: Veremark (technical)
│  └─ Shared liability if both contributed to violation
```

### 7.3 Insurance Requirements

| Party | Insurance Type | Minimum Coverage |
|-------|---------------|------------------|
| PilotRecognition | Cyber Liability | USD $1,000,000 |
| PilotRecognition | Professional Liability (E&O) | USD $2,000,000 |
| Veremark | Cyber Liability | USD $5,000,000 |
| Veremark | Professional Liability (E&O) | USD $5,000,000 |

---

## 8. Service Level Agreements (SLAs)

### 8.1 Verification Performance

| Metric | Target | Measurement |
|--------|--------|-------------|
| Standard Check Completion | < 24 hours | Time from submission to result |
| Expedited Check Completion | < 4 hours | For Recognition Plus members |
| API Uptime | 99.9% | Monthly availability |
| Webhook Delivery Success | 99.5% | Successful webhook receipt rate |
| Discrepancy Rate | < 5% | Disputes / Total verifications |

### 8.2 Remedies for SLA Breaches

| Severity | Remedy |
|----------|--------|
| Minor (< 5% deviation) | Service credit: 10% of monthly fees |
| Moderate (5-15% deviation) | Service credit: 25% of monthly fees |
| Severe (> 15% deviation or > 24h delay) | Service credit: 50% of monthly fees + root cause analysis |
| Chronic (3+ severe breaches in quarter) | Termination right by other party |

---

## 9. Incident Response

### 9.1 Security Incident Definition

- Unauthorized access to verification data
- Data breach affecting pilot PII
- API compromise or credential exposure
- Malware or ransomware affecting either system
- Insider threat or data exfiltration

### 9.2 Incident Response Timeline

| Action | Timeline | Responsible Party |
|--------|----------|-------------------|
| Detection & Initial Assessment | 1 hour | Discovering party |
| Notification to Other Party | 4 hours | Discovering party |
| Containment | 24 hours | Joint effort |
| Root Cause Analysis | 72 hours | Primary responsible party |
| Remediation | 7 days | Primary responsible party |
| Post-Incident Review | 14 days | Joint effort |

### 9.3 Regulatory Notification

- **Philippines NPC:** Notify within 72 hours if DPA violation suspected
- **Affected Pilots:** Notify within 48 hours if their data affected
- **Public Disclosure:** Follow regulatory guidance, coordinate messaging

---

## 10. Term & Termination

### 10.1 Initial Term
- 3 years from execution date
- Automatic 1-year renewals unless 90-day written notice

### 10.2 Termination for Convenience
- Either party may terminate with 6 months notice
- Complete in-flight verifications before termination effective

### 10.3 Termination for Cause
- Material breach (30-day cure period)
- Regulatory action against either party
- Insolvency or bankruptcy
- Chronic SLA failures (3+ quarters)

### 10.4 Post-Termination
- Existing verified pilots retain badge until expiry
- No new verifications initiated
- Data deletion per Section 5.3
- Transition assistance: 60 days

---

## 11. Governing Law & Dispute Resolution

### 11.1 Governing Law
- Philippines law for matters involving Philippines pilots
- Singapore law for commercial disputes between parties
- EU GDPR applies for European pilots (if applicable)

### 11.2 Dispute Resolution Between Parties

| Stage | Method | Timeline |
|-------|--------|----------|
| 1 | Executive negotiation | 30 days |
| 2 | Mediation (Singapore) | 30 days |
| 3 | Arbitration (SIAC) | Final and binding |

---

## 12. Signatures

**For PilotRecognition:**

Name: _________________________
Title: _________________________
Date: _________________________
Signature: _________________________

**For Veremark:**

Name: _________________________
Title: _________________________
Date: _________________________
Signature: _________________________

---

## Appendices

### Appendix A: Data Processing Agreement (DPA)
*[Attached separately - standard DPA template]*

### Appendix B: Technical Integration Specification
*[Reference: api-integration-architecture.md]*

### Appendix C: Commercial Terms
*[Reference: commercial-framework-proposal.md]*

### Appendix D: Insurance Certificates
*[To be provided by both parties upon execution]*

---

*This document is a draft for discussion purposes. Final terms subject to legal review and mutual agreement.*
