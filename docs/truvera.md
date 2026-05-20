# Truvera Integration Architecture

## Overview

**Truvera Web Wallet** serves as the credential storage and identity infrastructure for the PilotRecognition platform, enabling secure, consent-based management of aviation credentials with zero liability for data storage.

---

## Architecture Components

### 1. Truvera Web Wallet (Data Controller)
- **Provider**: Dock Labs AG (Zug, Switzerland)
- **Legal Entity**: Swiss Corporation (CHE-209.321.753)
- **Storage**: Cloud-based, encrypted credential vault
- **Access**: Browser-based (no mobile app required)
- **Cost**: Free tier available, paid for enterprise

### 2. Multi-Issuer Setup

#### PilotRecognition Issuer
```
DID: did:truvera:pilotrecognition
Permissions:
- Issue aviation credentials (licenses, medicals, flight hours)
- View pilot profiles (with consent)
- Connect pilots to airlines
- Request credential presentations
```

#### Veremark Issuer
```
DID: did:truvera:veremark
Permissions:
- Verify existing credentials
- Run background checks
- Issue verification results
- Request credential presentations
```

---

## 5-Step Consent Workflow

### Step 1: Pilot Inputs Data
Pilot enters aviation credentials:
- License Number (e.g., 155660-CPL)
- Medical Certificate details
- Flight hours and experience
- Personal information

**Storage**: Encrypted in Truvera Wallet (persist: false for zero liability)

### Step 2: Pilot Grants Consent
During wallet creation, pilot approves trusted issuers:

```javascript
{
  issuers: [
    {
      name: "PilotRecognition",
      did: "did:truvera:pilotrecognition",
      permissions: ["issue", "view", "verify"],
      approved: true
    },
    {
      name: "Veremark",
      did: "did:truvera:veremark",
      permissions: ["verify", "issue_verification"],
      approved: true
    }
  ]
}
```

### Step 3: Veremark Verification
Veremark requests credential verification:
- License validity check (CAAP, FAA, EASA)
- Medical certificate status
- Background verification
- Identity confirmation

**Result**: Verification credential issued to pilot's wallet

### Step 4: Veremark → PilotRecognition Consent
**Critical**: Veremark grants PilotRecognition access to view verification results

```javascript
{
  fromIssuer: "did:truvera:veremark",
  toIssuer: "did:truvera:pilotrecognition",
  data: "verification_results",
  purpose: "Access control for pathway enforcement",
  expires: "30 days"
}
```

### Step 5: Access Control Enforcement
PilotRecognition analyzes verification results and enforces pathway access:

**Pathway Tiers:**
- **STRICT** (Premium Airlines): All credentials valid + background clear
- **STANDARD** (Cargo/Regional): License valid + background clear
- **TRAINING** (Flight Schools): No verification required
- **PUBLIC** (Information only): No restrictions

**Example Decision Logic:**
```javascript
if (verification.medical_status === "EXPIRED") {
  blockAccess("premium_airlines", "Medical renewal required");
  allowAccess("training_pathways", "Upgrade programs available");
}
```

---

## API Integration

### Wallet Creation with Issuer Setup
```typescript
const setupPilotWallet = async (pilotId: string) => {
  // Create Truvera wallet
  const wallet = await truvera.createWallet({
    email: pilotEmail,
    password: pilotPassword
  });

  // Confirm trusted issuers
  await truvera.confirmIssuers(wallet.id, [
    {
      issuer: "PilotRecognition",
      did: "did:truvera:pilotrecognition",
      permissions: ["issue", "view", "verify"]
    },
    {
      issuer: "Veremark",
      did: "did:truvera:veremark",
      permissions: ["verify", "issue"]
    }
  ]);

  // Store wallet reference (NOT credentials)
  await supabase.from('pilot_wallets').insert({
    pilot_id: pilotId,
    truvera_wallet_id: wallet.id,
    issuers: ["did:truvera:pilotrecognition", "did:truvera:veremark"],
    created_at: new Date()
  });

  return wallet;
};
```

### Issue Aviation Credentials
```typescript
const issuePilotLicense = async (
  pilotWalletId: string, 
  licenseData: PilotLicenseData
) => {
  const credential = await truvera.issueCredential({
    issuer: "did:truvera:pilotrecognition",
    recipientWallet: pilotWalletId,
    type: "PilotLicense",
    schema: "https://pilotrecognition.com/schemas/pilot-license-v1.json",
    data: {
      licenseNumber: licenseData.number,
      licenseType: licenseData.type,
      issuingAuthority: licenseData.authority,
      issueDate: licenseData.issueDate,
      expiryDate: licenseData.expiryDate,
      ratings: licenseData.ratings,
      limitations: licenseData.limitations
    },
    persist: false, // Zero liability - don't store with Truvera
    distribute: true // Send to pilot's wallet
  });

  return credential;
};
```

### Read Verification Results (with Cross-Issuer Consent)
```typescript
const getVerificationResults = async (pilotWalletId: string) => {
  // Check if Veremark has granted us access
  const consent = await truvera.checkIssuerConsent({
    fromIssuer: "did:truvera:veremark",
    toIssuer: "did:truvera:pilotrecognition",
    subject: pilotWalletId
  });

  if (!consent.granted) {
    throw new Error("Veremark has not granted access to verification results");
  }

  // Read verification credential
  const verification = await truvera.readCredential({
    credentialType: "VerificationResult",
    issuer: "did:truvera:veremark",
    subject: pilotWalletId,
    authorizedBy: consent.id
  });

  return verification;
};
```

---

## Data Controller Analysis

### Liability Distribution

| Component | Controller | Data Stored | Liability Level |
|-----------|-----------|-------------|-----------------|
| Truvera Web Wallet | Dock Labs AG | Encrypted credentials | Medium (Swiss jurisdiction) |
| PilotRecognition | N/A (connection layer only) | Wallet references, consent logs | Low |
| Veremark | Veremark | Verification results | Medium |
| Pilot | Pilot | Private keys (if non-custodial) | User responsibility |

### Zero Liability Strategy

**We DO NOT Store:**
- ❌ Pilot license data
- ❌ Medical certificates
- ❌ Flight hours
- ❌ Personal documents
- ❌ Verification results

**We DO Store:**
- ✅ Wallet ID references
- ✅ Consent records
- ✅ Access logs (audit trail)
- ✅ Connection tokens

---

## Security & Compliance

### Swiss Data Protection
- **Framework**: Swiss Federal Act on Data Protection (nFADP)
- **EU Compliance**: GDPR adequacy (Switzerland approved)
- **Encryption**: AES-256 for data at rest
- **Transport**: TLS 1.3 for API communications

### Audit Requirements
- All consent actions logged on Truvera blockchain
- Verification results immutable and timestamped
- Access control decisions documented
- Cross-issuer consent transparent and revocable

---

## Integration Checklist

### Phase 1: Truvera Partnership Setup
- [ ] Register PilotRecognition as issuer
- [ ] Obtain API credentials (testnet)
- [ ] Configure DID (did:truvera:pilotrecognition)
- [ ] Set up webhook endpoints
- [ ] Test credential issuance (testnet)

### Phase 2: Veremark Integration
- [ ] Confirm Veremark issuer DID
- [ ] Establish cross-issuer consent protocol
- [ ] Test verification result sharing
- [ ] Integration testing with sample credentials

### Phase 3: Wallet UI Integration
- [ ] Embed Truvera Web Wallet (iframe/SDK)
- [ ] Custom aviation branding/styling
- [ ] Issuer confirmation during setup
- [ ] Consent management dashboard

### Phase 4: Access Control Implementation
- [ ] Define pathway tiers (STRICT/STANDARD/TRAINING/PUBLIC)
- [ ] Implement verification result analysis
- [ ] Build access enforcement logic
- [ ] Create pilot notification system (expired medicals, etc.)

### Phase 5: Production Deployment
- [ ] Move from testnet to mainnet
- [ ] Pilot beta testing
- [ ] Security audit
- [ ] Documentation for pilots
- [ ] Go-live

---

## API Endpoints

### Truvera API Integration

**Base URL**: `https://api.truvera.io`

**Authentication**: Bearer token (OAuth 2.0)

### Key Endpoints

#### Create Wallet
```
POST /wallets
Content-Type: application/json
Authorization: Bearer {token}

{
  "email": "pilot@example.com",
  "password": "secure_password",
  "issuers": [
    {
      "did": "did:truvera:pilotrecognition",
      "approved": true
    },
    {
      "did": "did:truvera:veremark",
      "approved": true
    }
  ]
}
```

#### Issue Credential
```
POST /credentials
Content-Type: application/json
Authorization: Bearer {token}

{
  "issuer": "did:truvera:pilotrecognition",
  "recipientWallet": "wallet_id_here",
  "type": "PilotLicense",
  "data": { ... },
  "persist": false,
  "distribute": true
}
```

#### Request Verification
```
POST /verify
Content-Type: application/json
Authorization: Bearer {token}

{
  "verifier": "did:truvera:veremark",
  "subject": "wallet_id_here",
  "credentials": ["PilotLicense", "MedicalCertificate"]
}
```

#### Read Verification Result (with Issuer Consent)
```
GET /credentials?issuer=did:truvera:veremark&subject={wallet_id}&type=VerificationResult
Authorization: Bearer {token}
X-Issuer-Consent: {consent_token}
```

---

## Error Handling

### Common Error Scenarios

**Consent Not Granted**
```json
{
  "error": "consent_required",
  "message": "Pilot has not granted access to view credentials",
  "action": "Request consent from pilot"
}
```

**Cross-Issuer Consent Missing**
```json
{
  "error": "issuer_consent_required",
  "message": "Veremark has not granted PilotRecognition access to verification results",
  "action": "Contact Veremark to establish data sharing agreement"
}
```

**Wallet Not Found**
```json
{
  "error": "wallet_not_found",
  "message": "Truvera wallet not found for this pilot",
  "action": "Guide pilot to create wallet"
}
```

---

## Support & Resources

### Truvera Documentation
- **API Docs**: https://docs.truvera.io
- **Support**: Contact Dock Labs AG
- **Status Page**: https://status.truvera.io

### PilotRecognition Integration
- **Lead Developer**: TBD
- **Integration Timeline**: 4-6 weeks
- **Testing Environment**: Truvera Testnet

### Veremark Integration
- **Contact**: Veremark Partnership Team
- **Integration Guide**: See Veremark API documentation
- **SLA**: 99.9% uptime guarantee

---

## Revision History

| Date | Version | Author | Changes |
|------|---------|--------|---------|
| 2026-05-19 | 1.0 | PilotRecognition Team | Initial architecture document |

---

## Next Steps

1. **Contact Truvera** for issuer account setup
2. **Define credential schemas** for aviation-specific data
3. **Establish Veremark partnership** for cross-issuer consent
4. **Build embedded wallet UI** with aviation branding
5. **Implement access control logic** for pathway enforcement

**Status**: Architecture complete. Ready for implementation.
