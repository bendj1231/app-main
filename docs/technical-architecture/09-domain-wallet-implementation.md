# Domain Wallet Implementation

**Domain-Specific Wallet Deployment Guide**

---

## Overview

The PilotRecognition platform implements three domain-specific wallet variants, each tailored to the domain's unique requirements while sharing core infrastructure.

| Domain | Wallet Type | Primary Use Case | Privacy Level |
|--------|-------------|------------------|---------------|
| `pilotshortage.org` | Anonymous | PSA story verification | Zero-knowledge |
| `pilotcareerpathways.com` | Career | Job applications | Controlled disclosure |
| `pilotrecognition.com` | Full | Enterprise + full features | Pilot-controlled |

---

## Architecture

### Shared Infrastructure

```
┌─────────────────────────────────────────────────────────────────┐
│                      SHARED BACKEND                               │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐   │
│  │  Supabase    │  │   Edge       │  │   Cloudflare R2      │   │
│  │  Database    │  │  Functions   │  │   Storage            │   │
│  │              │  │              │  │                      │   │
│  │ • profiles   │  │ • issuer-sign│  │ • Pilot documents    │   │
│  │ • credentials│  │ • shortage   │  │ • Verified VCs       │   │
│  │ • audit_log  │  │ • pathways   │  │ • Status lists       │   │
│  └──────────────┘  │ • recognition│  └──────────────────────┘   │
│                    └──────────────┘                             │
└─────────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│  ShortageWallet │ │ PathwaysWallet  │ │ RecognitionWallet│
│  (Anonymous)    │ │ (Career)        │ │ (Full)          │
│                 │ │                 │ │                 │
│ • ZK proofs     │ │ • Full VCs      │ │ • All features  │
│ • No PII        │ │ • ATS sharing   │ │ • Enterprise API│
│ • Story verify  │ │ • Pathway match │ │ • Pull API      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Domain-Specific Implementations

### pilotshortage.org — Anonymous Wallet

**File:** `components/domains/shortage/ShortageWalletPage.tsx`

```typescript
// Anonymous wallet for PSA story submission
export function ShortageWalletPage({ auth0Id, profileId }: WalletProps) {
  const { createAnonymousWallet } = useAnonymousWallet();
  
  const handleCreate = async () => {
    // License number is hashed client-side before transmission
    const licenseHash = licenseNumber 
      ? await sha256(licenseNumber)
      : null;
    
    // Create wallet with zero PII
    const wallet = await createAnonymousWallet({
      auth0Id,
      profileId,
      licenseHash,  // SHA-256, not recoverable
    });
    
    // Issue AnonymousPilotVC
    const credential = await issueAnonymousCredential({
      holderDid: wallet.did,
      licenseHash,
    });
    
    return credential;
  };
  
  return (
    <WalletContainer>
      <PrivacyNotice>
        This wallet stores no personally identifiable information.
        Your license number is hashed and cannot be recovered.
      </PrivacyNotice>
      <Button onClick={handleCreate}>Create Anonymous Wallet</Button>
    </WalletContainer>
  );
}
```

**Credential Type:** `AnonymousPilotVC`

```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "AnonymousPilotVC"],
  "credentialSubject": {
    "id": "did:key:z6Mk...",
    "licenseHash": "a3f92c1d...",
    "role": "Pilot"
  }
}
```

**Privacy Features:**
- License numbers hashed client-side (SHA-256)
- No PII stored in database
- Zero-knowledge credential proofs
- Domain isolation via RLS policies

---

### pilotcareerpathways.com — Career Wallet

**File:** `components/domains/careerpathways/PathwaysWalletPage.tsx`

```typescript
// Career wallet for job applications
export function PathwaysWalletPage({ auth0Id, profileId }: WalletProps) {
  const { wallet, issueCareerCredentials } = useCareerWallet();
  const [step, setStep] = useState<'license' | 'medical' | 'hours'>('license');
  
  const handleComplete = async (data: CareerData) => {
    // 3-step setup wizard
    const credentials = await issueCareerCredentials({
      auth0Id,
      profileId,
      license: data.license,
      medical: data.medical,
      hours: data.hours,
    });
    
    // Update pathway matching
    await refreshPathwayMatches(profileId);
    
    return credentials;
  };
  
  return (
    <WalletWizard step={step} onStepChange={setStep}>
      <LicenseStep onComplete={nextStep} />
      <MedicalStep onComplete={nextStep} />
      <HoursStep onComplete={handleComplete} />
    </WalletWizard>
  );
}
```

**Credential Types:**
- `PilotLicenseVC` — License details, ratings
- `MedicalCertVC` — Medical class, examiner, expiry
- `FlightHoursVC` — Total hours, aircraft types

**Features:**
- 3-step setup wizard
- Pathway matching integration
- One-click credential sharing with airlines
- ATS-compatible export formats

---

### pilotrecognition.com — Full Wallet

**File:** `components/website/components/wallet/WalletPageWithSidebar.tsx`

```typescript
// Full enterprise wallet
export function WalletPageWithSidebar({ userId }: WalletProps) {
  const { wallet, credentials, status } = useFullWallet(userId);
  const terminalTier = calculateTerminalTier(credentials);
  
  return (
    <WalletLayout>
      <TerminalStatus tier={terminalTier} />
      <CredentialSleeve 
        type="license"
        credential={credentials.license}
        accentColor="#22c55e" // Green for license
      />
      <CredentialSleeve 
        type="medical"
        credential={credentials.medical}
        accentColor="#ef4444" // Red for medical
      />
      <EnterprisePanel />
      <AuditLog />
    </WalletLayout>
  );
}
```

**Features:**
- All credential types
- Enterprise dashboard integration
- Pull API for airlines
- Full audit trail
- Biometric authentication (FaceID/TouchID)

---

## Edge Functions

### Domain-Specific Issuers

```typescript
// supabase/functions/shortage-issue/index.ts
export async function shortageIssueHandler(req: Request): Promise<Response> {
  const { auth0Id, profileId, licenseHash } = await req.json();
  
  // Verify domain source
  const domain = req.headers.get('x-domain-source');
  if (domain !== 'shortage') {
    return new Response('Unauthorized domain', { status: 403 });
  }
  
  // Issue anonymous credential
  const credential = await buildAnonymousVC({
    holderDid: await getHolderDid(profileId),
    licenseHash,
  });
  
  const signed = await signWithIssuer(credential);
  
  return Response.json({ credential: signed });
}
```

```typescript
// supabase/functions/pathways-issue/index.ts
export async function pathwaysIssueHandler(req: Request): Promise<Response> {
  const { auth0Id, profileId, license, medical, hours } = await req.json();
  
  // Verify domain source
  const domain = req.headers.get('x-domain-source');
  if (domain !== 'pathways') {
    return new Response('Unauthorized domain', { status: 403 });
  }
  
  // Issue career credentials
  const credentials = await Promise.all([
    buildLicenseVC(license),
    buildMedicalVC(medical),
    buildHoursVC(hours),
  ]);
  
  const signed = await Promise.all(credentials.map(signWithIssuer));
  
  return Response.json({ credentials: signed });
}
```

---

## Deployment Commands

### Deploy All Wallet Functions

```bash
#!/bin/bash
# scripts/deploy-domain-wallets.sh

PROJECT_REF="gkbhgrozrzhalnjherfu"

# Deploy shortage issuer
echo "Deploying shortage-issue..."
supabase functions deploy shortage-issue --project-ref $PROJECT_REF

# Deploy pathways issuer
echo "Deploying pathways-issue..."
supabase functions deploy pathways-issue --project-ref $PROJECT_REF

# Deploy recognition issuer
echo "Deploying recognition-issue..."
supabase functions deploy recognition-issue --project-ref $PROJECT_REF

# Set environment variables
echo "Setting secrets..."
supabase secrets set PILOT_ISSUER_URL="https://issuer.pilotrecognition.com" \
  --project-ref $PROJECT_REF

echo "Deployment complete!"
```

---

## Testing Checklist

### pilotshortage.org
- [ ] Create wallet without license
- [ ] Create wallet with license hash
- [ ] Submit anonymous story with verification
- [ ] Verify credential is privacy-preserving

### pilotcareerpathways.com
- [ ] Complete 3-step wizard
- [ ] Issue License + Medical + Hours VCs
- [ ] Check pathway matching updates
- [ ] Share credential with airline

### pilotrecognition.com
- [ ] Full credential suite
- [ ] Enterprise dashboard access
- [ ] Pull API test
- [ ] Terminal tier display

---

## Related Documents

- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Four-tier wallet infrastructure
- [04-credential-issuance-flow.md](./04-credential-issuance-flow.md) — VC issuance pipeline

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
