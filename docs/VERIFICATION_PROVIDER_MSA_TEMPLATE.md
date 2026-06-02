# MASTER SERVICES AGREEMENT
## Aviation Pathways Ltd — Verification Provider Partnership

**Document Reference:** CORP-VP-MSA-001  
**Version:** 1.0  
**Date:** 02 June 2026  
**Prepared by:** Aviation Pathways Ltd (operating as PilotRecognition.com)

---

## 1. Parties

**Service Recipient ("the Platform"):**  
Aviation Pathways Ltd  
Registered Office: 24 Avenue Le Morne, Black Rock 2, Villa 24, Tamarin, Republic of Mauritius  
Company Registration: [To be inserted]  
Data Protection Officer: Benjamin Bowler

**Service Provider ("the Verifier"):**  
[INSERT VERIFIER LEGAL NAME]  
Registered Office: [INSERT ADDRESS]  
Company Registration: [INSERT NUMBER]  
Jurisdiction: [INSERT COUNTRY]

---

## 2. Purpose and Scope

### 2.1 Objective
This Agreement governs the provision of aviation credential verification services by the Verifier to users of the Platform ("Pilots" or "Data Subjects"), facilitated through the Platform's routing infrastructure.

### 2.2 Neutral Intermediary
The Platform acts solely as a neutral digital intermediary — an "immigration gateway" — connecting Pilots with verification providers. The Platform does not:
- Choose, designate, or mandate which verifier a Pilot must use
- Store, process, or analyse raw source documents submitted by Pilots
- Guarantee, warrant, or underwrite the accuracy of verification results
- Act as a party to the direct verification transaction between the Pilot and the Verifier

### 2.3 Supported Credentials
The Verifier shall verify CAA-issued aviation credentials, including but not limited to:
- Commercial Pilot Licence (CPL) and associated type ratings
- Medical Certificate (Class 1, Class 2, Class 3)
- English Language Proficiency (ELP) certificate
- Other credentials as mutually agreed in writing

---

## 3. Verification Workflow

### 3.1 Pilot-Initiated Selection
1. The Pilot selects the Verifier from a **region-filtered list** presented in the Platform interface.
2. Only verifiers capable of serving the Pilot's jurisdiction are displayed.
3. The Pilot must review and accept the Verifier's independent terms of service and privacy policy before proceeding.

### 3.2 Direct Document Submission
1. The Pilot uploads raw source documents **directly to the Verifier's secure portal or API endpoint**.
2. The Platform initiates only a webhook ping or API call to the Verifier selected by the Pilot.
3. Documents **never transit or reside** on Platform servers under the primary routing model.

### 3.3 Confirmation and Notification
Upon successful receipt of the Pilot's documents, the Verifier shall:
1. Confirm receipt via webhook or API response to the Platform
2. Send a direct notification to the Pilot (email or in-app) stating:  
   *"Documents received. Verification in progress."*
3. Commence the verification process in accordance with the Verifier's standard operating procedures.

### 3.4 Verification Result
Upon completion, the Verifier shall:
1. Transmit the verification result (verified / flagged / rejected) to the Platform via secure webhook
2. Notify the Pilot directly of the outcome
3. In the event of a flag (fraudulent, altered, or inaccurate documents), provide specific cause to both the Platform and the Pilot

---

## 4. Financial Terms

### 4.1 Pilot Subscription
The Platform collects a **yearly verification subscription fee of USD 100** from the Pilot via Stripe.

### 4.2 Revenue Split
Of the USD 100 subscription:
- **USD 30 (30%)** — Remitted to the Verifier as the verification service fee
- **USD 70 (70%)** — Retained by the Platform as infrastructure, routing, and platform maintenance fee

### 4.3 Payment Trigger
The Verifier's USD 30 portion becomes payable **only upon**:
1. The Pilot actively selecting the Verifier from the Platform interface; **AND**
2. The Verifier confirming successful receipt of the Pilot's documents and commencing verification; **AND**
3. The Verifier transmitting a confirmation webhook or API response to the Platform.

### 4.4 Payment Method and Schedule
The Platform shall remit the Verifier's portion:
- **Method:** Bank transfer, Wise, or other mutually agreed payment channel
- **Schedule:** Aggregated monthly or quarterly, as specified in the Verifier's onboarding preferences
- **Currency:** USD unless otherwise agreed
- **Minimum threshold:** No minimum; all accrued amounts remitted per schedule

### 4.5 Invoicing
The Verifier may invoice the Platform for accrued verification fees. Invoices must reference:
- Pilot Platform ID (anonymised)
- Date of document receipt confirmation
- Number of verifications completed
- Total amount due

### 4.6 No Upfront Payment
The Verifier acknowledges that no payment is made by the Platform until the verification workflow is initiated by the Pilot and the Verifier confirms document receipt. The Verifier bears no credit risk from Pilot non-payment; the Platform collects all fees upfront from the Pilot.

---

## 5. Data Protection and Compliance

### 5.1 Independent Controller Status
The Verifier acts as an **independent Data Controller** under GDPR, RA 10173 (Philippines), UAE PDPL, and all applicable data protection laws for the personal data it receives directly from Pilots.

### 5.2 Platform's Limited Role
The Platform acts solely as a routing intermediary. It does not:
- Access, view, or process raw source documents
- Determine the purposes or means of the Verifier's verification processing
- Retain copies of documents submitted by Pilots to the Verifier

### 5.3 Pilot Consent Chain
The Verifier acknowledges that:
- The Pilot has provided explicit informed consent to share documents with the specific Verifier
- The Pilot has accepted the Verifier's independent terms of service and privacy policy
- The Platform's role is limited to consent orchestration and routing infrastructure

### 5.4 Data Security
The Verifier shall maintain:
- AES-256-GCM encryption at rest for all documents received
- TLS 1.3 encryption in transit
- SOC 2 Type II or equivalent security certification (or commitment to obtain within 12 months)
- Data breach notification to the Platform within 24 hours of discovery

### 5.5 Document Retention and Deletion
The Verifier shall:
- Retain raw source documents only for the minimum period necessary to complete verification
- Irreversibly delete raw documents within 30 days of verification completion, unless legally required to retain longer
- Provide confirmation of deletion to the Platform upon request

---

## 6. Service Level Commitments

### 6.1 Document Receipt Confirmation
The Verifier shall confirm receipt of documents within **24 hours** of submission by the Pilot.

### 6.2 Verification Turnaround Time
The Verifier shall complete verification and transmit results within:
- **Standard checks:** 5–7 business days
- **Expedited checks:** 2–3 business days (if offered as a premium service)
- **Complex checks:** 10–14 business days (e.g., cross-border employment history)

### 6.3 Uptime and Availability
The Verifier's API and document upload portal shall maintain **99.5% uptime** during business hours in the regions served.

### 6.4 Webhook Reliability
The Verifier shall ensure webhook delivery to the Platform with:
- Automatic retry on failure (minimum 3 attempts)
- Exponential backoff between retries
- Manual fallback notification within 4 hours of persistent webhook failure

---

## 7. Liability and Indemnification

### 7.1 Verifier's Liability
The Verifier accepts full liability for:
- The accuracy, completeness, and timeliness of verification results
- Any data breach, loss, or misuse of documents within the Verifier's infrastructure
- Compliance with all applicable aviation regulatory requirements (e.g., CAAP, FAA, EASA) in the jurisdictions served
- Any employment or licensing decisions made by airlines or operators based on verification results

### 7.2 Platform's Limited Liability
The Platform accepts liability **only** for:
- The technical availability of its routing infrastructure
- The accurate transmission of webhooks and API calls between the Pilot and the Verifier
- The secure handling of payment processing (Stripe)

The Platform **explicitly disclaims** liability for:
- The content, accuracy, or outcome of any verification performed by the Verifier
- Any data breach or security incident occurring within the Verifier's systems
- Any delay or failure caused by the Verifier's systems or processes

### 7.3 Indemnification
Each party shall indemnify the other against claims arising from:
- Its own breach of this Agreement
- Its own violation of applicable laws or regulations
- Its own negligence or wilful misconduct

---

## 8. Term and Termination

### 8.1 Initial Term
This Agreement shall commence on the Effective Date and continue for an initial term of **12 months**.

### 8.2 Renewal
The Agreement shall automatically renew for successive 12-month periods unless either party provides **60 days' written notice** of non-renewal.

### 8.3 Termination for Cause
Either party may terminate immediately upon written notice if:
- The other party materially breaches this Agreement and fails to cure within 30 days of notice
- The other party becomes insolvent, enters liquidation, or ceases business operations
- The other party suffers a data breach affecting 100+ Pilots and fails to remediate within 72 hours

### 8.4 Post-Termination Obligations
Upon termination:
- The Verifier shall complete all in-progress verifications initiated before termination
- The Platform shall remit all accrued and unpaid verification fees within 30 days
- The Verifier shall delete or return all raw documents received via the Platform within 60 days
- Both parties shall maintain confidentiality of proprietary information for 3 years

---

## 9. Confidentiality

### 9.1 Confidential Information
Each party shall protect the other's confidential information, including:
- API keys, webhook secrets, and integration credentials
- Pricing terms and revenue share arrangements
- Pilot data (to the extent shared for operational purposes)
- Business strategies and partnership plans

### 9.2 Permitted Disclosure
Confidential information may be disclosed:
- To employees or contractors with a need-to-know, bound by equivalent confidentiality obligations
- As required by law, regulation, or court order, with prior notice where possible
- In aggregated, anonymised form for industry benchmarking or reporting

---

## 10. Intellectual Property

### 10.1 Platform IP
All intellectual property owned by the Platform, including:
- The PilotRecognition.com platform, codebase, and algorithms
- The W3C Verifiable Credential and DID infrastructure
- The pathway matching engine and EBT scoring framework

### 10.2 Verifier IP
All intellectual property owned by the Verifier, including:
- Verification methodologies, databases, and proprietary data sources
- The Verifier's brand, trademarks, and service marks

### 10.3 Joint Use
Each party grants the other a limited, non-exclusive, non-transferable licence to use its trademarks for the purpose of:
- Displaying the Verifier's name and logo in the Platform's region-filtered verifier list
- Referencing the Platform's brand in the Verifier's marketing materials (with prior written consent)

---

## 11. Dispute Resolution

### 11.1 Good Faith Negotiation
Any dispute arising from this Agreement shall first be addressed through good faith negotiation between senior representatives of both parties.

### 11.2 Mediation
If negotiation fails within 30 days, the parties shall attempt mediation under the rules of the **London Court of International Arbitration (LCIA)** or **Singapore International Mediation Centre (SIMC)**.

### 11.3 Governing Law
This Agreement shall be governed by and construed in accordance with the laws of the **Republic of Mauritius**, without regard to conflict of law principles.

### 11.4 Jurisdiction
The parties submit to the exclusive jurisdiction of the courts of the Republic of Mauritius.

---

## 12. General Provisions

### 12.1 Entire Agreement
This Agreement constitutes the entire agreement between the parties and supersedes all prior negotiations, representations, or agreements.

### 12.2 Amendment
No amendment shall be effective unless in writing and signed by both parties.

### 12.3 Assignment
Neither party may assign this Agreement without the prior written consent of the other, except to an affiliate or in connection with a merger or acquisition.

### 12.4 Force Majeure
Neither party shall be liable for failure to perform due to causes beyond its reasonable control, including natural disasters, war, terrorism, government actions, or internet outages affecting the Verifier's region.

### 12.5 Severability
If any provision is found invalid or unenforceable, the remaining provisions shall continue in full force.

### 12.6 Notices
All notices shall be in writing and delivered by email or courier to the addresses specified above.

---

## SCHEDULE A — VERIFIER-SPECIFIC TERMS

### A.1 Verification Regions
| Region | Status | Notes |
|--------|--------|-------|
| [e.g., Philippines] | [Active / Pending] | [e.g., CAAP licence verification] |
| [e.g., United States] | [Active / Pending] | [e.g., FAA PRD compliance] |
| [e.g., Europe] | [Active / Pending] | [e.g., EASA licence verification] |

### A.2 Supported Checks
| Check Type | Standard Fee | Turnaround | Notes |
|------------|--------------|------------|-------|
| Pilot Licence Verification | USD 30 | 5–7 days | Includes type ratings |
| Medical Certificate Verification | USD 30 | 3–5 days | Class 1, 2, or 3 |
| English Language Proficiency | USD 30 | 2–3 days | ICAO Level assessment |
| Employment History | [To agree] | [To agree] | Previous operators, hours |

### A.3 API Integration Details
- **Webhook Endpoint (Platform → Verifier):** [INSERT URL]
- **Webhook Endpoint (Verifier → Platform):** [INSERT URL]
- **API Authentication:** [API Key / OAuth 2.0 / Mutual TLS]
- **Webhook Secret:** [INSERT OR TO BE EXCHANGED]
- **Retry Policy:** 3 attempts, exponential backoff

### A.4 Payout Preferences
- **Payment Method:** [Bank Transfer / Wise / Stripe Connect / Other]
- **Payment Schedule:** [Monthly / Quarterly]
- **Bank Details:** [INSERT]
- **Minimum Threshold:** [None / USD 100 / Other]

### A.5 Key Contacts
| Role | Name | Email | Phone |
|------|------|-------|-------|
| Technical Integration | [INSERT] | [INSERT] | [INSERT] |
| Account Management | [INSERT] | [INSERT] | [INSERT] |
| Data Protection / Legal | [INSERT] | [INSERT] | [INSERT] |

---

## SIGNATURE PAGE

**Signed for and on behalf of Aviation Pathways Ltd:**

Name: Benjamin Bowler  
Title: Managing Director  
Signature: _________________________  
Date: _________________________

---

**Signed for and on behalf of [INSERT VERIFIER NAME]:**

Name: [INSERT]  
Title: [INSERT]  
Signature: _________________________  
Date: _________________________

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 02 June 2026 | Benjamin Bowler | Initial draft for verification provider partnerships |
