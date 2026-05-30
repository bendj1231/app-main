# PilotRecognition Workflow Overview

**End-to-End Flow: Payment → Verification → Credentials → Matching**

---

## Phase 1: Subscription & Payment

```
┌─────────────────────────────────────────────────────────────────┐
│  USER LANDS ON PLATFORM                                         │
│  ├─ Views pathway cards (public)                                │
│  └─ Clicks "Get Verified" or "Subscribe"                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PAYMENT GATEWAY (Transak Widget)                               │
│  ├─ User selects GCash                                          │
│  ├─ Enter GCash phone number                                    │
│  ├─ Authenticate with MPIN/OTP                                  │
│  └─ Confirm payment                                             │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FIAT → CRYPTO CONVERSION                                       │
│  ├─ GCash PHP converted to USDC                                 │
│  ├─ 78% → PilotRecognition wallet                               │
│  └─ 22% → Offramp (Bridge.xyz/Airwallex) → Veremark bank        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PAYMENT CONFIRMATION                                           │
│  ├─ Transaction ID stored in database                           │
│  ├─ Webhook triggers: "payment_successful"                      │
│  └─ Redirect to onboarding flow                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 2: Verification Selection

```
┌─────────────────────────────────────────────────────────────────┐
│  ONBOARDING GATE                                                │
│  ├─ "Welcome! Let's verify your credentials"                   │
│  └─ Two verification tracks:                                    │
│     1. License & Medical Only ($XX)                              │
│     2. License + Medical + Flight Hours ($XX)                    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SELECT VERIFICATION PROVIDER                                   │
│  ├─ Identity: Veremark (default)                                │
│  └─ Flight Hours: Choose provider                              │
│     ├─ ForeFlight (Certified Partner ✓)                        │
│     ├─ Safelog (Certified Partner ✓)                           │
│     ├─ LogTen Pro (Provisional)                                │
│     └─ Manual Upload (Unverified until check)                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 3: Identity Verification (Veremark)

```
┌─────────────────────────────────────────────────────────────────┐
│  VEREMARK IFRAME OPENS (Direct to Veremark - not our server)   │
│                                                                  │
│  User Uploads:                                                   │
│  ├─ CAAP License (front & back)                                │
│  ├─ Class 1 Medical Certificate                                  │
│  ├─ Government ID/Passport                                     │
│  └─ Optional: Radio License, Type Ratings                       │
│                                                                  │
│  Data flows: PILOT → VEREMARK (encrypted, temporary)            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  VEREMARK PROCESSING                                            │
│  ├─ OCR extracts license number, medical dates                 │
│  ├─ Cross-check CAAP database                                   │
│  ├─ Verify medical certificate validity                         │
│  ├─ Check expiration dates                                     │
│  ├─ CONFIRMED: All valid → Issue VC                           │
│  └─ REJECTED: Expired/mismatch → Notify pilot                   │
│                                                                  │
│  Raw images: DELETED after 90 days (retention policy)          │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  VERIFIABLE CREDENTIAL ISSUED                                   │
│                                                                  │
│  VC Type: "PilotIdentityVerification"                           │
│  ├─ Issuer: did:web:veremark.com                               │
│  ├─ Subject: did:key:[pilot_wallet]                            │
│  ├─ Claims:                                                      │
│  │   ├─ verificationStatus: "VERIFIED"                          │
│  │   ├─ credentialHash: sha256:abc123...                       │
│  │   ├─ verifiedAt: timestamp                                   │
│  │   └─ expiresAt: medical_expiry_date                        │
│  └─ Signature: Ed25519 proof                                    │
│                                                                  │
│  Delivery: Pushed directly to Pilot's Wallet                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  WEBHOOK TO PILOTRECOGNITION                                    │
│  ├─ Event: "credential.issued"                                 │
│  ├─ credentialHash: sha256:abc123...                           │
│  ├─ status: "VERIFIED"                                          │
│  ├─ provider: "veremark"                                        │
│  └─ NO PII transmitted                                         │
│                                                                  │
│  Our Database Updates:                                           │
│  ├─ profiles.verified_identity: true                             │
│  ├─ pilot_credentials.credential_hash: abc123...               │
│  └─ pilot_credentials.status: "verified"                        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 4: Flight Hours Verification

### Track A: Certified Logbook Provider

```
┌─────────────────────────────────────────────────────────────────┐
│  SELECT PROVIDER → FOREFLIGHT                                   │
│  ├─ User clicks "Connect ForeFlight"                           │
│  └─ OAuth flow initiated                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  OAUTH CONSENT SCREEN                                           │
│  "Allow ForeFlight to access:                                   │
│   - Your flight log data                                        │
│   - Your profile information (name, email, DOB)"              │
│                                                                  │
│  User clicks "Authorize"                                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  FOREFLIGHT RECEIVES:                                           │
│  ├─ Pilot name, DOB, nationality, phone, email                  │
│  ├─ Connection request from PilotRecognition                    │
│  └─ OAuth token granted (read-only access to flight logs)       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  API DATA PULL                                                  │
│  ├─ Total hours: 612                                            │
│  ├─ Night hours: 48                                             │
│  ├─ Instrument: 35                                              │
│  ├─ Cross-country: 120                                          │
│  └─ Last flight: 2026-05-20                                     │
│                                                                  │
│  Data flows: FOREFLIGHT → PILOTRECOGNITION (totals only)       │
│  Individual flight rows stay in ForeFlight database            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  DUAL VC ISSUANCE                                               │
│                                                                  │
│  ForeFlight Issues VC1:                                          │
│  ├─ Type: "FlightLogAttestation"                               │
│  ├─ Claims: { totalHours: 612, nightHours: 48, ... }            │
│  ├─ Proof: ForeFlight signature                                 │
│  └─ Pushed to: Pilot Wallet                                     │
│                                                                  │
│  PilotRecognition Issues VC2 (Cross-Attestation):                 │
│  ├─ Type: "PlatformVerification"                               │
│  ├─ Claims: { verifies: "vc:foreflight:...", crossChecked: true }│
│  ├─ Proof: PilotRecognition signature                          │
│  └─ Pushed to: Pilot Wallet + ForeFlight copy                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  MUTUAL CREDIBILITY ESTABLISHED                                 │
│                                                                  │
│  ForeFlight Dashboard Shows:                                    │
│  "Verified by PilotRecognition ✓"                              │
│                                                                  │
│  PilotRecognition Shows:                                          │
│  "ForeFlight Certified: 612 hours ✓"                             │
│                                                                  │
│  Pilot Wallet Contains:                                           │
│  ├─ VC1 (ForeFlight attestation)                               │
│  ├─ VC2 (PilotRecognition cross-verification)                  │
│  └─ VC3 (Veremark identity) - from Phase 3                     │
└─────────────────────────────────────────────────────────────────┘
```

### Track B: Manual Upload (No Certified Provider)

```
┌─────────────────────────────────────────────────────────────────┐
│  SELECT "Upload Logbook Manually"                               │
│  ├─ Download CSV template OR                                   │
│  └─ Upload logbook photos (PDF/JPG)                            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  CSV UPLOAD FLOW                                                │
│  ├─ User fills: Date, Aircraft, Registration, Route, Duration  │
│  ├─ Uploads completed CSV                                       │
│  └─ System parses into temporary structured data               │
│                                                                  │
│  PHOTO UPLOAD FLOW                                              │
│  ├─ User takes photos of logbook pages                         │
│  ├─ Photos go DIRECT to Veremark iframe (not our servers)     │
│  └─ Veremark OCR extracts data → structured format            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  TEMPORARY STORAGE (Until Verification)                        │
│  ├─ Parsed flight rows stored in database                       │
│  ├─ Status: "pending_verification"                             │
│  └─ Raw photos: NOT stored (Veremark processes & deletes)     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  VEREMARK VERIFICATION (Extra $15 fee)                          │
│  ├─ Manual review of logbook entries                            │
│  ├─ Cross-check sample entries for fraud                       │
│  ├─ CONFIRMED: Issue "FlightHoursVerified" VC                 │
│  └─ REJECTED: Request re-upload with clearer images           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  POST-VERIFICATION CLEANUP                                      │
│  ├─ Parsed flight rows: DELETED from our database              │
│  ├─ Only totals cached: "Total: 450 hours (verified)"         │
│  └─ VC issued: "FlightHoursVerified" pushed to wallet         │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 5: Wallet Consolidation

```
┌─────────────────────────────────────────────────────────────────┐
│  PILOT WALLET NOW CONTAINS:                                     │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ VEREMARK VC - Identity                                 │   │
│  │ ├─ License verified                                     │   │
│  │ ├─ Medical verified                                     │   │
│  │ └─ Expires: 2027-05-27                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ FOREFLIGHT VC - Flight Hours                           │   │
│  │ ├─ Total: 612 hours                                     │   │
│  │ ├─ Night: 48 hours                                      │   │
│  │ ├─ Instrument: 35 hours                                 │   │
│  │ └─ Signed by ForeFlight                                 │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PILOTRECOGNITION VC - Cross-Attestation                 │   │
│  │ ├─ Verifies ForeFlight data integrity                   │   │
│  │ └─ Signed by PilotRecognition                           │   │
│  └─────────────────────────────────────────────────────────┘   │
│                                                                  │
│  ┌─────────────────────────────────────────────────────────┐   │
│  │ PRESENTATION (VP) - Exportable to Airlines               │   │
│  │ ├─ Combines all VCs                                     │   │
│  │ ├─ One-time presentation nonce                          │   │
│  │ └─ QR code / deep link for airline verification        │   │
│  └─────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 6: Pathway Matching

```
┌─────────────────────────────────────────────────────────────────┐
│  PILOT BROWSES PATHWAYS                                        │
│  ├─ Views "Airline X First Officer" pathway card               │
│  └─ Requirements shown: 500+ hours, 50+ night, valid medical    │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  REAL-TIME GAP ANALYSIS                                         │
│  ├─ System queries wallet VCs                                   │
│  ├─ 612 total hours ✓ (exceeds 500 requirement)               │
│  ├─ 48 night hours ✗ (needs 2 more)                            │
│  ├─ Medical valid until 2027-05-27 ✓                           │
│  └─ Result: "94% match - Log 2 more night hours to qualify"   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  SUBMIT INTEREST (If Qualified)                                 │
│  ├─ Pilot clicks "Submit Interest"                             │
│  ├─ System packages:                                            │
│  │   ├─ VP (Verifiable Presentation)                          │
│  │   ├─ Credential hashes                                      │
│  │   └─ DID reference                                           │
│  ├─ Sent to airline dashboard                                    │
│  └─ Airline sees: "Verified pilot, credentials cryptographically confirmed"
└─────────────────────────────────────────────────────────────────┘
```

---

## Phase 7: Airline Verification (Enterprise Pull)

```
┌─────────────────────────────────────────────────────────────────┐
│  AIRLINE ENTERPRISE DASHBOARD                                   │
│  ├─ Filter: 500+ hours, valid medical, type rating              │
│  └─ Sees: 47 matched pilots                                     │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  PULL PILOT DATA                                                │
│  ├─ Airline selects pilot                                        │
│  ├─ System requests VP from pilot wallet                        │
│  ├─ Pilot receives push notification: "Allow [Airline] to view credentials?"
│  └─ Pilot approves → VP generated with one-time nonce            │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AIRLINE RECEIVES                                               │
│  ├─ VP containing:                                              │
│  │   ├─ Veremark VC (identity verified)                        │
│  │   ├─ Provider VC (612 hours attested)                       │
│  │   └─ Cross-attestation VC (data integrity confirmed)       │
│  ├─ Verification: All signatures valid ✓                       │
│  ├─ Status: Terminal 3 (all verified) ✓                        │
│  └─ Expiration: Medical valid, check again 2027-05-27           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│  AIRLINE ACTIONS                                                │
│  ├─ Download VP as compliance artifact                          │
│  ├─ Contact pilot directly                                       │
│  ├─ Schedule interview/simulator check                          │
│  └─ Optional: Physical presence oracle (FaceID confirmation)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## Data Flow Summary

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    USER      │────▶│   PAYMENT    │────▶│  VEREMARK    │
│  (Pilot)     │     │   (Transak)  │     │  (Identity)  │
└──────────────┘     └──────────────┘     └──────────────┘
       │                                            │
       │                                            │
       ▼                                            ▼
┌──────────────┐                          ┌──────────────┐
│ LOGBOOK      │◄───────────────────────────│    WALLET    │
│ PROVIDER     │    (Cross-Attestation)   │   (VCs)      │
│(Flight Hours)│                          └──────────────┘
└──────────────┘                                   │
       │                                           │
       └─────────────────────┬─────────────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │PILOTRECOGNITION│
                    │  (Matching)   │
                    └──────────────┘
                             │
                             ▼
                    ┌──────────────┐
                    │   AIRLINE    │
                    │ (Enterprise) │
                    └──────────────┘
```

---

## Key Handoffs

| Handoff | Data Transferred | Security |
|---------|------------------|----------|
| **Payment → Verification** | Transaction ID only | Firewalled |
| **User → Veremark** | Raw documents (encrypted) | Direct iframe, 90-day retention |
| **Veremark → Wallet** | Verifiable Credential | Signed, tamper-proof |
| **User → Logbook Provider** | OAuth consent + PII | Standard OAuth 2.0 |
| **Provider → Platform** | Hour totals only | API key, read-only |
| **Provider ↔ Platform** | Cross-attestation VCs | Mutual signatures |
| **Platform → Airline** | VP (credential bundle) | One-time nonce, domain-scoped |
| **Wallet → Airline** | Verifiable Presentation | User consent required |

---

## Status Indicators

| Terminal Tier | Color | Meaning | Requirements |
|---------------|-------|---------|--------------|
| **T1** | 🔴 Red | Revoked/Expired | Medical expired or license revoked |
| **T2** | 🟡 Amber | Suspended/Unverified | Pending verification or manual upload |
| **T3** | 🟢 Green | Fully Verified | Veremark VC + Provider VC active |

---

**Next Steps:**
1. Implement Transak payment widget
2. Build Veremark iframe integration
3. Develop OAuth connectors for ForeFlight/Safelog
4. Create wallet VC storage and retrieval
5. Build airline enterprise dashboard
6. Implement VP generation and verification
