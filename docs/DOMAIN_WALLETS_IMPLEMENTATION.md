# Multi-Domain Wallet Implementation

**Created:** June 2, 2026  
**Status:** Ready for Deployment

## Overview

Wallets have been implemented across all three domains:

| Domain | Wallet Type | Purpose | URL |
|--------|------------|---------|-----|
| pilotrecognition.com | Full Wallet | Enterprise + verification | `/wallet` |
| pilotcareerpathways.com | Career Wallet | Job applications | `/pilotcareerpathways/wallet` |
| pilotshortage.org | Anonymous Wallet | Story verification | `/pilotshortage/wallet` |
| pilotterminal.com | Credential Infrastructure | Issuer + DID | `pilot-terminal-issue` edge function |

---

## Domain-Specific Wallet Features

### 1. pilotshortage.org - Anonymous Wallet

**Purpose:** Allow PSA members to prove they're real pilots without revealing identity.

**Privacy Features:**
- Zero-knowledge credential issuance
- License numbers SHA-256 hashed before transmission
- No PII stored in credentials
- Domain: `AnonymousPilotVC`

**Components:**
```
components/domains/shortage/ShortageWalletPage.tsx
app/pilotshortage/wallet/page.tsx
supabase/functions/shortage-issue/index.ts
```

**Usage:**
```typescript
// Pilot creates wallet for anonymous story submission
<ShortageWalletPage 
  auth0Id={auth0_id} 
  profileId={profile_id} 
/>
```

### 2. pilotcareerpathways.com - Career Wallet

**Purpose:** Store and share verified credentials with airlines during job applications.

**Features:**
- Multi-step wallet setup (License → Medical → Hours)
- Pathway matching based on credentials
- One-click credential sharing with airlines
- Domains: `PilotLicenseVC`, `MedicalCertVC`, `FlightHoursVC`

**Components:**
```
components/domains/careerpathways/PathwaysWalletPage.tsx
app/pilotcareerpathways/wallet/page.tsx
supabase/functions/pathways-issue/index.ts
```

**Usage:**
```typescript
// Pilot manages career credentials
<PathwaysWalletPage 
  auth0Id={auth0_id} 
  profileId={profile_id} 
/>
```

### 3. pilotterminal.com - Credential Infrastructure

**Purpose:** Backend issuer infrastructure for all domains.

**Features:**
- Self-hosted OID4VCI issuer
- DID document resolution
- Cross-domain credential issuance
- `pilot-terminal-issue` edge function

---

## Shared Infrastructure

All wallets share the same core library:

```
lib/wallet/
├── enclave.ts          # P-256 key generation (Tier 1)
├── storage.ts          # Encrypted IndexedDB (Tier 2)
├── vcBuilder.ts        # W3C VC construction
├── statusList.ts       # Revocation checking (Tier 3)
└── types/
    └── schemas.ts      # TypeScript definitions
```

### Credential Issuance Flow

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   pilotshortage │────▶│  shortage-issue  │────▶│   issuer-sign   │
│  /careerpathways│     │  /pathways-issue │     │ (self-hosted)   │
│  /recognition   │     │   edge function  │     │   P-256 signing  │
└─────────────────┘     └──────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       ▼
        │                       │              ┌─────────────────┐
        │                       │              │  DID document   │
        │                       │              │  verification   │
        │                       │              └─────────────────┘
        │                       ▼
        │              ┌──────────────────┐
        │              │  pilot_credentials│
        │              │     table        │
        │              └──────────────────┘
        ▼
┌─────────────────┐
│  Encrypted      │
│  IndexedDB      │
│  (client-side)  │
└─────────────────┘
```

---

## Edge Functions

### Domain-Specific Issuers

| Function | Domain | Purpose | Endpoint |
|----------|--------|---------|----------|
| `shortage-issue` | pilotshortage.org | Anonymous credentials | `/functions/v1/shortage-issue` |
| `pathways-issue` | pilotcareerpathways.com | Career credentials | `/functions/v1/pathways-issue` |
| `pilot-terminal-issue` | pilotterminal.com | Infrastructure | `/functions/v1/pilot-terminal-issue` |
| `issuer-sign` | All | Self-hosted signing | `/functions/v1/issuer-sign` |

### Deployment Commands

```bash
# Deploy shortage issuer
supabase functions deploy shortage-issue --project-ref gkbhgrozrzhalnjherfu

# Deploy pathways issuer
supabase functions deploy pathways-issue --project-ref gkbhgrozrzhalnjherfu

# Set secrets
supabase secrets set PILOT_ISSUER_URL=https://issuer.pilotrecognition.com --project-ref gkbhgrozrzhalnjherfu
```

---

## Database Schema

### pilot_credentials table (shared)

```sql
CREATE TABLE pilot_credentials (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID REFERENCES profiles(id),
  auth0_id TEXT,
  credential_type TEXT, -- 'AnonymousPilotVC' | 'PilotLicenseVC' | 'MedicalCertVC' | 'FlightHoursVC'
  issuer_did TEXT,
  subject_did TEXT,
  credential_offer_url TEXT,
  credential_jwt TEXT,
  source_provider TEXT, -- 'pilotshortage.org' | 'pilotcareerpathways.com' | 'pilotrecognition.com'
  status TEXT DEFAULT 'active',
  issued_at TIMESTAMP,
  expires_at TIMESTAMP,
  total_hours NUMERIC,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT now()
);

-- Index for domain filtering
CREATE INDEX idx_pilot_credentials_domain ON pilot_credentials(source_provider);
CREATE INDEX idx_pilot_credentials_type ON pilot_credentials(credential_type);
```

---

## Environment Variables

### Client-Side (Vite)

```env
# All domains use these shared vars
VITE_SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_PILOT_ISSUER_URL=https://issuer.pilotrecognition.com
VITE_PILOT_WALLET_URL=https://wallet.pilotrecognition.com
```

### Server-Side (Edge Functions)

```env
# Set in Supabase dashboard
PLATFORM_SIGNING_KEY_JWK={"kty":"EC","crv":"P-256",...}
PILOT_ISSUER_URL=https://issuer.pilotrecognition.com
```

---

## Routes by Domain

### pilotshortage.org
```
/pilotshortage/wallet           → Anonymous wallet page
/pilotshortage/join             → Signup (redirects to wallet)
/pilotshortage/stories/submit   → Story form (uses wallet for verification)
```

### pilotcareerpathways.com
```
/pilotcareerpathways/wallet     → Career wallet page
/pathways/[id]/apply            → Application (uses wallet credentials)
/programs                       → Program listings
```

### pilotrecognition.com
```
/wallet                         → Full wallet (enterprise features)
/verification                   → Document upload + verification
/enterprise                     → Airline dashboard
```

---

## Testing Checklist

### pilotshortage.org Wallet
- [ ] Create anonymous wallet without license
- [ ] Create wallet with license hash
- [ ] Submit anonymous story with verification
- [ ] Verify credential is privacy-preserving

### pilotcareerpathways.com Wallet
- [ ] 3-step wallet setup flow
- [ ] Issue PilotLicenseVC
- [ ] Issue MedicalCertVC
- [ ] Issue FlightHoursVC
- [ ] Pathway matching updates after credential issuance
- [ ] Share credential with airline

### pilotterminal.com Infrastructure
- [ ] Edge function responds
- [ ] DID document resolves
- [ ] Credential signature validates

---

## Security Considerations

1. **Anonymous Wallet**
   - License numbers hashed client-side
   - No PII in credential metadata
   - Domain source tracked for RLS policies

2. **Career Wallet**
   - Full credentials stored (needed for airline verification)
   - Encrypted at rest in IndexedDB
   - Row-level security on Supabase

3. **Cross-Domain**
   - Shared auth session via cookie domain
   - JWT includes domain_source claim
   - RLS policies enforce domain boundaries

---

## Next Steps

1. **Deploy Edge Functions**
   ```bash
   npm run deploy:shortage-issue
   npm run deploy:pathways-issue
   ```

2. **Add Wallet Links to Navbars**
   - Add to `PSANavbar.tsx` (shortage)
   - Add to `PathwaysNavbar.tsx` (careerpathways)

3. **Test End-to-End**
   - Signup on each domain
   - Create wallet
   - Issue credentials
   - Verify storage

4. **Analytics**
   - Track wallet creation by domain
   - Monitor credential issuance rates
   - Measure pathway application conversion

---

**Implementation Status:** ✅ Complete  
**Deployment Status:** ⬜ Pending edge function deploy  
**Documentation:** ✅ Complete
