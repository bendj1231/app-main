# Data Architecture & VC Separation

**Document Version:** 1.0  
**Date:** May 27, 2026  
**Purpose:** Defines data custody boundaries between PilotRecognition, Veremark, Logbook Providers, and Pilot Wallets

---

## Core Principle

**Raw PII never touches PilotRecognition servers.** Verifiable Credentials (VCs) serve as cryptographic proof of verification while the actual sensitive data remains with the originating party.

---

## Data Custody Matrix

| Data Element | Veremark | PilotRecognition | Logbook Provider | Pilot Wallet |
|--------------|----------|------------------|------------------|--------------|
| **License Number** | Full number | `verified: true` only | No access | Hash only |
| **License Scan Image** | Temporary (90 days) | Never stored | No access | No |
| **Medical Certificate Number** | Full number | No | No access | Hash only |
| **Medical Cert Image** | Temporary (90 days) | Never stored | No access | No |
| **ID/Passport Document** | Temporary (90 days) | Never stored | No access | No |
| **Flight Hours - Individual Rows** | No | No (provider stores) | **Full logbook** | No |
| **Flight Hours - Totals/Summary** | No | Cached totals only | Source of truth | Attestation hash |
| **Manual Upload Photos** | Temporary only | Never stored | No access | No |
| **Manual CSV Rows** | For verification | Temporary until verified | No access | Hash of summary |
| **Pilot Full Name** | Yes | Profile table | **Yes (account link)** | No |
| **Date of Birth** | Yes | Gating/matching | **Yes (account verification)** | No |
| **Nationality** | Yes | Matching algorithm | **Yes (account profile)** | No |
| **Phone Number** | No | Auth/payment | **Yes (account contact)** | No |
| **Email Address** | No | Auth | **Yes (account identifier)** | No |
| **DID (Wallet ID)** | Yes (VC subject) | Public key | No access | Yes |
| **Credential Hash** | Yes | Cross-reference | No access | Yes |
| **Payment Transaction ID** | No | Transak reference | No access | No |
| **USDC Wallet Address** | No | Payout routing | No access | No |
| **Cross-platform Attestation VC** | No | Copy of provider's verification | Copy of our verification | Both VCs stored |

---

## Mutual VC Attestation Architecture

### Dual-Credential Flow

```
[ForeFlight/Safelog] ──► Issues VC1: "612 hours logged in [Provider]"
                              │
                              ▼
                    [Pilot Wallet] ◄── Also holds VC2 from Veremark
                              │
                              ├──► [PilotRecognition reads VC1 + VC2]
                              │
                              └──► [Provider dashboard displays:
                                    "Verified by PilotRecognition ✓"]
```

### VC Types Issued

#### 1. Veremark VCs (Identity Verification)
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "PilotVerification"],
  "issuer": "did:web:veremark.com",
  "issuanceDate": "2026-05-27T16:30:00Z",
  "credentialSubject": {
    "id": "did:key:z6Mk...pilot_wallet",
    "verificationType": "CAAP_License_Medical",
    "credentialHash": "sha256:abc123...",
    "status": "VERIFIED",
    "verifiedAt": "2026-05-27T16:30:00Z",
    "expiresAt": "2027-05-27T16:30:00Z"
  },
  "proof": {
    "type": "Ed25519Signature2020",
    "proofValue": "z58D...signature..."
  }
}
```

#### 2. Logbook Provider VCs (Flight Hours)
```json
{
  "type": "FlightLogAttestation",
  "issuer": "did:web:foreflight.com",
  "credentialSubject": {
    "id": "did:key:pilot...",
    "totalHours": 612,
    "nightHours": 48,
    "instrumentHours": 35,
    "lastSynced": "2026-05-27T10:00:00Z",
    "dataSource": "foreflight_api"
  },
  "proof": { "signature": "foreflight_key..." }
}
```

#### 3. Cross-Attestation VCs (Mutual Verification)
```json
{
  "type": "PlatformVerification",
  "issuer": "did:web:pilotrecognition.com",
  "credentialSubject": {
    "verifies": "vc:foreflight:abc123",
    "crossChecked": true,
    "verifiedAt": "2026-05-27T16:30:00Z",
    "attestation": "ForeFlight data integrity confirmed"
  },
  "proof": { "signature": "pr_key..." }
}
```

---

## What Each Party Actually Stores

### Veremark
| Storage | Retention | Purpose |
|---------|-----------|---------|
| License numbers | 7 years (compliance) | Audit trail |
| Medical cert numbers | 7 years (compliance) | Audit trail |
| Raw document images | 90 days | Verification only, then burned |
| Verification status | 7 years | Regulatory compliance |
| VC issuance log | Permanent | Proof of verification |

### Logbook Provider (ForeFlight, Safelog, etc.)
| Storage | Retention | Purpose |
|---------|-----------|---------|
| Complete flight history | Permanent | Core product value |
| Aircraft details | Permanent | Log integrity |
| Route/duration data | Permanent | Flight records |
| Pilot name, DOB, nationality | Account lifetime | Account verification and profile |
| Pilot phone, email | Account lifetime | Account contact and identifier |
| Cross-attestation VC | Permanent | Proof of PilotRecognition verification |

### PilotRecognition
| Storage | Retention | Purpose |
|---------|-----------|---------|
| Profile (name, DOB, nationality) | Account lifetime | Matching algorithm |
| Cached hour totals | Synced from provider | Fast pathway matching |
| Credential hashes | Permanent | Cross-reference with wallet |
| Cross-attestation VC | Permanent | Provider credibility proof |
| Auth credentials | Account lifetime | Platform access |
| Payment references | 7 years | Financial compliance |
| Wallet DID | Account lifetime | VC verification |

### Pilot Wallet (Decentralized)
| Storage | Retention | Purpose |
|---------|-----------|---------|
| Veremark VCs | Permanent | Proof of identity verification |
| Provider VCs | Permanent | Proof of flight hours |
| Cross-attestation VCs | Permanent | Dual-platform credibility |
| Private keys | Permanent | Signing/ownership proof |

---

## Verification Flows

### Flow 1: Certified Logbook Provider

```
[User has ForeFlight account]
         │
         ▼
[Select "Connect ForeFlight"]
         │
         ▼
[OAuth to ForeFlight API] ──► [ForeFlight issues VC1: "612 hours"]
         │                           │
         ▼                           ▼
[PilotRecognition caches totals] [Wallet stores VC1]
         │
         ▼
[Issue cross-attestation VC2]
         │
         ▼
[Both VCs in wallet]
```

### Flow 2: Manual Upload (No Certified Provider)

```
[User has paper logbook]
         │
         ▼
[Select "Upload Logbook"]
         │
         ▼
[Download CSV template]
         │
         ▼
[Fill & upload OR take photos]
         │
         ▼
[Direct iframe to Veremark] ──► [Veremark verifies documents]
         │                           │
         ▼                           ▼
[Temporary storage of parsed] [Veremark issues VC: "Hours verified"]
rows until verification                 │
         │                              ▼
         ▼                    [Wallet stores VC]
[Delete raw data, keep totals]
         │
         ▼
[Mark verified in profile]
```

### Flow 3: Identity Verification (Veremark)

```
[Post-payment]
         │
         ▼
[Select "Verify with Veremark"]
         │
         ▼
[Open Veremark iframe] ──► [User uploads license/medical/ID]
         │                           │
         │                           ▼
         │              [Veremark verifies & burns raw images]
         │                           │
         ▼                           ▼
[Receive webhook: "verified"] [VC issued to wallet]
         │
         ▼
[Update profile: verified=true]
```

---

## Payment Flow with Data Separation

```
[User pays via GCash]
         │
         ▼
[Transak widget] ──► [USDC conversion]
         │
         ├──► 78% to PilotRecognition wallet
         │
         └──► 22% to offramp → Veremark bank
         │
         ▼
[Payment confirmation stored]
         │
         ▼
[Redirect to verification]
```

---

## Key Architectural Decisions

1. **Veremark holds raw docs temporarily** — They verify, then burn images within 90 days. We never see them.

2. **Logbook providers receive pilot PII on connection** — When pilot OAuth-links their logbook account, the provider receives name, DOB, nationality, phone, and email for their own account management. This requires explicit user consent during OAuth flow.

3. **Logbook providers hold granular data** — We cache only totals. If provider goes down, we have cached snapshot + their VC attestation.

4. **Mutual attestation VCs** — Both platforms cryptographically vouch for each other. If either is compromised, the other can prove what they verified.

5. **Wallet is source of truth** — All VCs live in pilot's wallet. Platform databases are indexes, not masters.

6. **Manual uploads are temporary** — Parsed rows stored only until Veremark verification, then deleted. Only totals + VC remain.

---

## Compliance Benefits

| Regulation | How This Architecture Helps |
|------------|----------------------------|
| **Philippine Data Privacy Act (DPA)** | Minimal PII stored locally |
| **GDPR** | Raw docs never touch EU servers unless Veremark handles |
| **Anti-Money Laundering (AMLA)** | Clear audit trail via VCs, no raw financial docs |
| **BSP E-Wallet Regs** | Transak handles GCash compliance |
| **CAAP Verification Standards** | Veremark holds audit trail, we hold proof |

---

## What's NOT Stored Anywhere

- ❌ License scan images on PilotRecognition
- ❌ Medical certificate photos on PilotRecognition
- ❌ ID/passport photos on PilotRecognition
- ❌ Logbook page images (photos) on PilotRecognition
- ❌ Full granular flight rows (if certified provider exists)
- ❌ Raw verification documents permanently (Veremark burns after 90 days)

---

## Future Considerations

1. **Threshold-based provider certification** — Providers need 50+ pilots for "Certified" badge
2. **Automated provider sync** — Daily/weekly API pulls to refresh cached totals
3. **Provider fallback** — If ForeFlight down, use cached totals + last known VC
4. **Multi-provider support** — Pilot can have VCs from multiple logbook providers
5. **VC revocation** — If provider detects fraud, they revoke VC, we update status

---

**Document Owner:** PilotRecognition Engineering  
**Review Cycle:** Quarterly or when new provider integrated  
**Related Docs:**
- `wallet-architecture.md`
- `veremark-integration-spec.md`
- `logbook-provider-thresholds.md`
