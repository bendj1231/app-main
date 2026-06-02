# Data Architecture & Custody Clarification

**Document Purpose:** Clearly define who holds what data for compliance, privacy policy, and user communication.

**Last Updated:** June 2, 2026

---

## 🎯 Core Principle: "Wallet Holds Truth, Platform Holds Proof, Verifiers Hold Documents"

### The Three-Tier Data Model

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  TIER 1: PILOT WALLET (Client-Side, Pilot Controls)                        │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  🔐 Your Device (IndexedDB)                                            │ │
│  │  • Actual W3C Verifiable Credentials (VCs)                             │ │
│  │  • Cryptographic proofs (signatures)                                   │ │
│  │  • Private keys (P-256, non-extractable)                              │ │
│  │  • DID (decentralized identifier)                                     │ │
│  │                                                                        │ │
│  │  WE CANNOT ACCESS THIS. Only you control the private keys.             │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Sync / Reference
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  TIER 2: PILOTRECOGNITION PLATFORM (Verification Hub)                       │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  🗄️ Supabase Database (Sydney)                                        │ │
│  │                                                                        │ │
│  │  TEXT CLAIMS ONLY (No Physical Documents):                             │ │
│  │  • License number (encrypted at rest)                                   │ │
│  │  • Medical class (Class 1/2/3)                                         │ │
│  │  • Expiry dates                                                        │ │
│  │  • Issuing authority (CAAP, FAA, EASA)                                 │ │
│  │  • Total flight hours                                                  │ │
│  │  • Credential hashes (for revocation lookup)                           │ │
│  │                                                                        │ │
│  │  WE DO NOT STORE:                                                      │ │
│  │  ❌ Physical license scans                                             │ │
│  │  ❌ Medical certificates (images/PDFs)                                  │ │
│  │  ❌ Passport photos                                                     │ │
│  │  ❌ Biometric data (except voice for PSA stories - optional)           │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
                                    │ Verification Request
                                    ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  TIER 3: REGIONAL VERIFICATION PROVIDERS (Document Custodians)             │
│  ┌────────────────────────────────────────────────────────────────────────┐ │
│  │  📄 Veremark / Local Authorities (PH, US, EU, etc.)                     │ │
│  │                                                                        │ │
│  │  PHYSICAL DOCUMENTS STORED HERE:                                       │ │
│  │  • Scanned license copies                                              │ │
│  │  • Medical certificates (physical/digital)                             │ │
│  │  • Logbook extracts                                                    │ │
│  │  • Verification reports                                                │ │
│  │                                                                        │ │
│  │  JURISDICTION-SPECIFIC STORAGE:                                        │ │
│  │  • Philippines: Veremark PH infrastructure                               │ │
│  │  • EU: GDPR-compliant EU servers                                       │ │
│  │  • US: SOC 2 Type II facilities                                        │ │
│  │                                                                        │ │
│  │  WE NEVER SEE THESE DOCUMENTS.                                         │ │
│  │  We only receive: "verified" / "not verified" / "expired" status.     │ │
│  └────────────────────────────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## 📝 Detailed Breakdown by Data Type

### 1. Pilot License Data

| Data Element | Stored Where | Format | Access Control |
|--------------|--------------|--------|----------------|
| **License Number** | PilotRecognition (encrypted) | Text (AES-256-GCM) | Pilot only, RLS-protected |
| **License Type** (CPL/ATPL) | PilotRecognition | Text | Pilot + airline (if shared) |
| **Expiry Date** | PilotRecognition | Date | Pilot + airline (if shared) |
| **VC in Wallet** | Pilot's device | JWT (signed) | Pilot controls sharing |
| **Physical License Scan** | **Veremark/Authority** | PDF/Image | Local jurisdiction law |

**Key Message:** *"We store your license number like a contact book stores a phone number. The actual license document stays with the verification authority in your country."*

---

### 2. Medical Certificate Data

| Data Element | Stored Where | Format | Special Category? |
|--------------|--------------|--------|---------------------|
| **Medical Class** (1/2/3) | PilotRecognition | Text | ✅ Health data (Art 9) |
| **Medical Expiry** | PilotRecognition | Date | ✅ Health data (Art 9) |
| **Limitations** (glasses, etc.) | PilotRecognition | Text | ✅ Health data (Art 9) |
| **VC in Wallet** | Pilot's device | JWT | ✅ Health data |
| **Medical Certificate PDF/Image** | **Veremark/CAAP/FAA** | Document | ✅ Never touches our servers |

**Key Message:** *"We know you have a Class 1 medical valid until [date]. The actual medical form with your doctor's notes, test results, and physical measurements is stored by [CAAP/Veremark] in [country], not by us."*

---

### 3. Flight Hours Data

| Data Element | Stored Where | Format | Source |
|--------------|--------------|--------|--------|
| **Total Hours** | PilotRecognition + Wallet | Number | Self-attested or API sync |
| **Logbook Hash** | PilotRecognition | SHA-256 | MyFlightBook/API |
| **Detailed Flights** | **MyFlightBook / Logbook Provider** | Database | Third-party service |
| **VC in Wallet** | Pilot's device | JWT | Self-attested |

**Key Message:** *"We store your total hours (like a running total). Your detailed flight history — every leg, aircraft, route — stays in your logbook provider (MyFlightBook, etc.). We can't see where you flew yesterday."*

---

### 4. Identity Documents

| Data Element | Stored Where | Format | Retention |
|--------------|--------------|--------|-----------|
| **Passport Number** | ❌ **NOT STORED** | N/A | N/A |
| **Passport Scan** | ❌ **NOT STORED** | N/A | N/A |
| **Date of Birth** | PilotRecognition (encrypted) | Date | Account lifetime |
| **Nationality** | PilotRecognition | Text | Account lifetime |
| **Auth0 ID** | PilotRecognition | UUID | Account lifetime |

**Key Message:** *"We verify your identity through Auth0 (Google/Apple login) but we don't keep copies of your passport. We only store: 'Born [date], citizen of [country].'"*

---

## 🛡️ Compliance Benefits of This Architecture

### GDPR Article 9 (Special Categories)
**Challenge:** Medical data is health data (special category).

**Our Mitigation:**
1. **Minimization:** We only store medical class (1/2/3) and expiry, not diagnosis
2. **Purpose limitation:** Used solely for credential verification, not marketing
3. **Short retention:** Delete when credential expires or pilot deletes account
4. **Encryption:** AES-256-GCM at rest, TLS 1.3 in transit
5. **DPIA:** Required and will be documented

**The Physical Documents Problem is SOLVED:**
- Physical medical certs = stored by CAAP/FAA/EASA/Veremark
- We only receive: "Class 1, valid until 2026-05-02"
- **We are NOT a medical records processor**

---

### Data Residency Compliance

| Jurisdiction | Our Storage | Document Custodian | Compliant? |
|--------------|-------------|-------------------|------------|
| **Philippines (CAAP)** | Text claims in Sydney | Veremark PH (local) | ✅ Yes |
| **EU (EASA)** | Text claims in Sydney | Veremark EU (GDPR) | ⚠️ Need SCCs |
| **USA (FAA)** | Text claims in Sydney | Veremark US (domestic) | ✅ Yes |
| **UAE (GCAA)** | Text claims in Sydney | Local authority | ✅ Yes |

**Key Advantage:** Physical documents stay in-country with local authorities. We only hold "metadata about verification" that crosses borders.

---

### Security Architecture Proof Points

```
PILOT UPLOADS DOCUMENT → Veremark API (direct)
         ↓
   [Document analyzed in-country]
         ↓
   Veremark sends webhook: {
     "status": "verified",
     "license_class": "CPL",
     "medical_class": "1",
     "expiry": "2026-10-23"
   }
         ↓
   We store: Text claims only
         ↓
   We issue: VC to Pilot's Wallet
```

**The document never touches our infrastructure.**

---

## 📢 User-Facing Messaging

### For Privacy Policy

```markdown
## How We Handle Your Documents

**We do not store your physical documents.**

When you upload your pilot license or medical certificate:
1. The document goes directly to our verification partner (Veremark) 
   in your country
2. Veremark verifies the document with the issuing authority (CAAP, FAA, etc.)
3. We receive only: "verified / not verified" + basic facts (license number, 
   expiry date, class)
4. The physical document stays with Veremark or your local aviation authority
5. We issue you a digital credential (VC) for your personal wallet

**What we store:**
- License number (encrypted)
- License type and expiry
- Medical class and expiry
- Total flight hours

**What we NEVER store:**
- Physical license scans
- Medical certificates (images/PDFs)
- Passport copies
- Biometric data (except optional voice for PSA stories)

**Your wallet holds the proof, we hold the text, Veremark holds the document.**
```

### For UI/UX (Short Copy)

**During Upload:**
> "Your document goes directly to our verification partner in [Philippines]. We never store the file — we only receive the verification result."

**In Wallet:**
> "This credential is stored in your device. PilotRecognition keeps a text record for verification lookup, but the actual documents are held by [CAAP/Veremark]."

**In Settings/Data Export:**
> "Download your data: You get your credentials (JWTs) and text profile. Physical documents are managed by regional authorities per local law."

---

## 🔍 Audit Trail Architecture

When someone (airline, authority) requests verification:

```
Airline: "Is this pilot's medical valid?"
         ↓
Pilot: Presents VC from Wallet (cryptographic proof)
         ↓
Airline: Verifies signature against our DID
         ↓
[Optional] Airline queries our status list:
         - We return: "active / revoked / expired"
         - We do NOT return: medical details, document images
         ↓
Airline: Sees "Class 1 Medical, valid, not revoked"
```

**We are a verification status registry, not a document repository.**

---

## ⚖️ Legal Liability Shield

### Scenario: Data Breach at Veremark

**What happens:**
- Veremark (document holder) gets breached
- Pilot's medical certificate image leaks

**Our position:**
- ✅ We are NOT the data controller for documents (Veremark is)
- ✅ We have DPA with Veremark requiring breach notification
- ✅ We only hold text claims (minimal exposure)
- ⚠️ We must notify affected pilots (as joint controller for text data)

### Scenario: Pilot Requests "Delete My Medical Data"

**Our action:**
1. Delete text claims from our database (immediate)
2. Revoke VC in status list (immediate)
3. Request Veremark delete physical document (via DPA clause)
4. Notify pilot: "Document deletion request sent to [Veremark/CAAP]"
5. Pilot must delete VC from their own wallet (we can't touch it)

**Key point:** We can delete our part in 30 seconds. The document custodian (Veremark/authority) handles their part per local law.

---

## 📋 Implementation Checklist

### Technical
- [ ] Verify Supabase RLS prevents document field storage
- [ ] Add validation: Reject uploads > 0 bytes to our storage (force Veremark)
- [ ] Implement "document_custodian" field in verification_checks table
- [ ] Build status list API that returns only status (no PII)

### Legal
- [ ] Add "Document Custody" clause to Veremark DPA
- [ ] Update Privacy Policy with this three-tier model
- [ ] Create "Right to Erasure" procedure that covers both tiers
- [ ] Document retention schedules for text claims vs documents

### UX
- [ ] Add explanatory text to document upload flows
- [ ] Create "Where is my data?" page showing the three tiers
- [ ] Add "Request document deletion" button that notifies custodian
- [ ] Show data residency info: "Your documents are stored in [country]"

---

## 🎯 Summary for Stakeholders

| Audience | Key Message |
|----------|-------------|
| **Pilots** | "Your documents stay in your country. We only store the 'verified' result." |
| **Airlines** | "We provide cryptographic proof of verification, not document access." |
| **Regulators (CAAP/FAA)** | "Physical docs remain under your jurisdiction. We're just a verification status registry." |
| **DPO/Legal** | "We minimized special category data exposure by design. Documents are third-party custodied." |
| **Investors** | "Compliance-by-architecture reduces GDPR liability and enables global scaling." |

---

**Document Version:** 1.0  
**Next Review:** Quarterly or after new market entry  
**Owner:** Data Protection Officer (to be appointed)
