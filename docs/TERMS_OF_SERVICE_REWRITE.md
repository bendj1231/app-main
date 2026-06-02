# Terms of Service and Privacy Agreement
## Complete Legal Rewrite — Corporate Shield & Neutral Conduit

**Date:** May 19, 2026  
**Version:** 2.0 — Aviation Pathways Ltd Operator Status  
**Effective:** Upon deployment

---

## Agreement and Operator Status

**This Agreement is entered into by and between you ("the User") and Aviation Pathways Ltd ("the Operator"), a company registered in the Republic of Mauritius and the legal entity operating the pilotrecognition.com platform.**

Pilot Recognition functions strictly as a digital aggregator and neutral software interface. All platform operations, payment processing, and legal liabilities are the responsibility of Aviation Pathways Ltd, a duly registered entity.

**The Operators:** Platform development and technical architecture maintained by authorized representatives of Aviation Pathways Ltd.

---

## PLATFORM CLASSIFICATION

### Data Controller & Infrastructure Provider

**Aviation Pathways Ltd is the Data Controller** for all personal data processed through the PilotRecognition.com platform, registered under the Mauritius Data Protection Act 2017.

**Our role:**
- ✅ **Data Controller** — We determine the purposes and means of processing personal data on the platform
- ✅ **Infrastructure Provider** — We host and secure user profiles, credential records, and verification outcomes
- ✅ **Credential Infrastructure** — We issue cryptographically signed Verifiable Credentials (VCs) under our `did:web:pilotrecognition.com` DID
- ✅ **Digital Storefront** — We connect users to third-party verification service providers

**Data ownership and control:**
1. **The User** (pilot — controls consent, owns their wallet-held VCs, can delete their profile)
2. **Aviation Pathways Ltd** (Data Controller — manages infrastructure, processes, and security)
3. **Third-Party Verification Providers** (Data Processors — execute verification checks on our behalf)
4. **Data Issuers** (aviation authorities, training organizations — source of truth for credentials)

---

## 1. Role Under Data Privacy Frameworks

### Data Controller Status

Under applicable data privacy laws, including:
- **Mauritius Data Protection Act 2017** (primary jurisdiction)
- EU General Data Protection Regulation (GDPR) (where applicable to EU data subjects)
- Philippines Data Privacy Act of 2012 (R.A. 10173) (where applicable)
- Equivalent regional frameworks

**Aviation Pathways Ltd is the Data Controller** for personal data processed through this platform. We are registered with the Data Protection Office of the Republic of Mauritius.

**The chain of responsibility:**
- **Aviation Pathways Ltd** = Data Controller (determines purposes and means of processing)
- **User** = Data Subject (provides consent, exercises data subject rights)
- **Third-Party Verification Partners** = Data Processors (execute verification checks under our instruction)

**What we store:**
- Account data (name, email, DOB, nationality, contact details — encrypted at rest)
- Aviation credential metadata (license numbers, PEL numbers, medical class and expiry, flight hours, ratings — user-declared or verifier-confirmed)
- Cryptographically signed Verifiable Credentials (VCs) issued by the platform under `did:web:pilotrecognition.com` — these are digital access tickets stored in your self-custodied wallet and retained server-side as signed records
- Verification outcomes (status, timestamps, check IDs, provider names — structured data, not documents)
- Revocation registry entries (cryptographic status lists for issued VCs)
- Payment records (Stripe transaction IDs — no card numbers stored)
- Technical data (IP address, device fingerprint, geolocation for security)
- Cryptographic key references (DIDs, public verification keys — not private keys)

**What we do NOT store:**
- Raw scanned license documents, PDFs, or images (forwarded directly to your chosen third-party verifier and deleted from our infrastructure within 24 hours)
- Payment card numbers (handled entirely by Stripe)
- User passwords (handled by Auth0)
- Private signing keys (held in secure Supabase secrets, not in application code or databases)

---

## 2. Service Fees and Third-Party Costs

### Commission-Based Aggregator Model

**Pilot Recognition operates as a neutral digital storefront.**

Payments processed through this platform are aggregate fees covering:
- Third-party credential verification API costs
- Decentralized network processing
- Platform commission for infrastructure maintenance

**We do not:**
- Issue licenses
- Conduct background checks
- Verify credentials directly
- Store verification documents

**We do:**
- Route requests to verified providers
- Display verified outcomes
- Maintain neutral infrastructure

**Liability disclaimer:**
> "Pilot Recognition disclaims liability for the outcome of any third-party verification services purchased through this interface."

---

## 3. Consent to Data Processing

### Explicit Informed Consent

By creating an account, you provide explicit, informed consent to Aviation Pathways Ltd to:
- Store your anonymous user identifier
- Display user-declared metadata
- Route verification requests to third-party providers

### Authentication Proxy

Login and account security managed independently by **Auth0 by Okta**.

**Data flow:**
1. You enter credentials → Sent directly to Auth0
2. Auth0 validates → Returns secure JWT token
3. Platform receives token only (no password storage)

**We cannot:**
- View your password
- Access your email
- Store login credentials

### Data We Collect

**Platform collects and processes:**
- Identity and contact data (full name, email, phone, address, DOB, nationality)
- Aviation credential data (license numbers, PEL numbers, medical class and expiry, flight hours, ratings, training records)
- Account and preference data (subscription tier, pathway interests, program enrollments)
- Verification data (background check results, education verification, employment history)
- Technical data (IP address, device fingerprint, browser type, geolocation for fraud prevention)
- Payment data (Stripe transaction IDs and billing records)

**How credentials are verified:**
- You initiate verification and select a third-party provider (e.g., Veremark) from a region-filtered list
- Any documents you upload are forwarded directly to the selected verifier's secure portal — the platform does not retain raw scanned documents
- The third-party provider conducts the verification and queries Data Issuers (aviation authorities, ATOs) on your behalf
- **What the verifier sends YOU (the user):** A detailed verification receipt/report delivered directly to your email or the verifier's customer portal. This contains full credential details (PEL numbers, license classes, medical dates, examiner names, etc.). The platform does **not** receive, view, or store this detailed receipt.
- **What the verifier sends the PLATFORM:** A minimal structured outcome via webhook — containing only: verification status (`verified` / `expired` / `failed`), check ID, timestamp, and high-level category results (e.g., license valid, medical expired). No detailed credential data is transmitted to the platform.
- The platform cryptographically signs a W3C Verifiable Credential (VC) under `did:web:pilotrecognition.com` based solely on the minimal structured outcome — this VC acts as your digital access ticket
- The VC is issued to your self-custodied wallet and retained server-side as a signed record for revocation purposes
- A VC in your wallet grants you access to Recognition+ features and exclusive pathway matching
- You control which airlines and operators can view your verified profile data

**What the Verifiable Credential represents:**
- A cryptographically signed statement by Aviation Pathways Ltd that a specific third-party verifier has confirmed your credential status
- NOT a copy of your original medical certificate or license — the VC is a ticket, not a document
- The VC contains only: verifier name, check status, and expiry date — not your detailed credential data
- Revocable by the platform if the verifier later reports fraud, expiration, or discrepancy

**Legal verification chain:**
- You (the user) initiate verification and consent to share data with a specific verifier
- Aviation Pathways Ltd routes the request to the authorized verification provider you selected
- The third-party provider queries Data Issuers (aviation authorities, ATOs) on your behalf and sends you the full detailed receipt directly
- The third-party provider sends the platform only a minimal structured outcome via secure webhook
- Upon receiving the structured outcome, the platform issues a signed VC to your wallet
- Verified outcomes are stored as structured data — original documents and detailed receipts are never retained by the platform

---

## 4. Dispute Resolution and Data Accuracy

### Dispute Resolution Framework

**Because Pilot Recognition routes verification through independent third-party providers:**
- We do not alter, override, or amend verified credentials from Data Issuers
- We store structured verification outcomes (status, dates, check IDs) but not original documents
- We cannot modify third-party API outputs once received

**Dispute routing:**
> "Any disputes regarding the accuracy of background checks, flight hours, or license validity must be directed exclusively to the respective Data Issuer or Third-Party Verification Provider."

**Platform liability:**
- Pilot Recognition holds **no liability** for employment outcomes
- No liability for certification results
- No liability for third-party API errors

---

## 5. Payment Processing and Financial Structure

### Decentralized Payment Gateway

All payments processed via **Helio (MoonPay Commerce)** — third-party decentralized payment gateway.

**Flow:**
1. User pays aggregate fee
2. Gateway processes on-chain
3. Automatic distribution to:
   - Third-party verification providers
   - Platform infrastructure (commission)
   - Network processing costs

**Anti-Money Laundering (AML) Compliance:**
- Transparent, immutable ledger
- Full traceability of transactions
- Auditable trail of all distributions

**Liability Attribution:**
- On-chain record = irrefutable, time-stamped receipt
- Identifies entity paid for each verification function
- Establishes attribution for disputes

---

## 6. Account Registration and Conduct

### Registration Requirements

By registering, you agree to:
- Provide accurate, current, complete information
- Maintain and update account information
- Keep authentication secure (managed by Auth0)
- Accept responsibility for activities under your account
- Accept these Terms before data submission

### Prohibited Conduct

You agree NOT to:
- Use platform for illegal purposes
- Impersonate any person or entity
- Interfere with platform operations
- Upload malicious code
- Post false/misleading credential information

---

## 7. Intellectual Property and Liability

### Ownership

All platform content, features, functionality owned by Aviation Pathways Ltd.

### Limitation of Liability

**Platform provided "as-is" without warranties.**

Aviation Pathways Ltd is not liable for:
- Indirect, incidental, special, consequential damages
- Data display errors
- Third-party API failures
- Service interruptions

**Maximum liability:** Limited to fees paid in preceding 12 months.

---

## 8. Governing Law and Jurisdiction

### Primary Jurisdiction

**Republic of Mauritius**

Governing laws:
- Data Protection Act 2017 of the Republic of Mauritius
- Civil Code of Mauritius (where applicable)
- Electronic Transactions Act 2000 (where applicable)

### Regulatory Authority

Data protection rights and complaints:
- Data Protection Office of the Republic of Mauritius
  - Phone: (230) 210 3434
  - Email: dpo@govmu.org
  - Website: dataprotection.govmu.org
- Aviation Pathways Ltd Data Protection Officer: Benjamin Bowler
  - Email: benjamin@pilotrecognition.com
  - Phone: +639670481890

---

## 9. Electronic Consent and Timestamp

### Binding Electronic Signature

Under the Mauritius Electronic Transactions Act 2000 (ETA) and, where applicable, the Philippines Electronic Commerce Act (R.A. 8792):
- Clicking "I Agree" = legally binding signature
- Equivalent to paper contract with pen

### Consent Timestamp

**System records:**
- Anonymous user ID (Auth0 token)
- Timestamp of consent (system metadata)
- **NOT personal data or SPI**

**Purpose:**
- Legal receipt of informed consent
- Proof of infrastructure authorization
- Audit trail for compliance

---

## 10. Termination and Data Deletion

### Account Deletion

Users may delete profile at any time.

Upon deletion:
- Anonymous User ID erased within 30 days
- User-declared metadata removed
- Consent timestamp retained (legal requirement)

### Platform Termination

Aviation Pathways Ltd reserves the right to terminate accounts for:
- Terms violation
- Fraudulent activity
- Platform abuse

---

## 11. Contact and Legal Notices

**Legal contact:** legal@pilotrecognition.com

**Operator entity:** Aviation Pathways Ltd

**Compliance officer:** privacy@pilotrecognition.com

---

## Summary of Legal Protections

| Risk | Protection Implemented |
|------|------------------------|
| Personal liability | Aviation Pathways Ltd corporate veil |
| Data breach | AES-256-GCM encryption, RLS policies, 72-hour breach notification |
| Dispute costs | Deflection to third-party providers |
| Regulatory action | Registered Data Controller with Mauritius DPO |
| Financial liability | Commission-based model, capped exposure |
| Privacy violations | Consent logging, DPA compliance |

---

**By using this platform, you acknowledge and agree to these terms.**

**Last updated:** June 2, 2026  
**Operator:** Aviation Pathways Ltd
