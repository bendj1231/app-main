# Domain Wallet Deployment Summary

**Date:** June 2, 2026  
**Status:** ✅ Code Complete, ⬜ Pending Deployment

## What Was Created

### 1. Wallet Components

| Component | File | Purpose |
|-----------|------|---------|
| ShortageWalletPage | `components/domains/shortage/ShortageWalletPage.tsx` | Anonymous wallet for PSA |
| PathwaysWalletPage | `components/domains/careerpathways/PathwaysWalletPage.tsx` | Career wallet for job apps |

### 2. Page Routes

| Route | File | Domain |
|-------|------|--------|
| `/pilotshortage/wallet` | `app/pilotshortage/wallet/page.tsx` | pilotshortage.org |
| `/pilotcareerpathways/wallet` | `app/pilotcareerpathways/wallet/page.tsx` | pilotcareerpathways.com |

### 3. Edge Functions

| Function | File | Domain | Endpoint |
|----------|------|--------|----------|
| `shortage-issue` | `supabase/functions/shortage-issue/index.ts` | pilotshortage.org | `/functions/v1/shortage-issue` |
| `pathways-issue` | `supabase/functions/pathways-issue/index.ts` | pilotcareerpathways.com | `/functions/v1/pathways-issue` |

### 4. Navigation Updates

| Navbar | Wallet Link Added |
|--------|------------------|
| CareerPathwaysNavbar | `/wallet` |
| ShortageApp | `/pilotshortage/wallet` |

### 5. Scripts & Docs

| File | Purpose |
|------|---------|
| `scripts/deploy-domain-wallets.sh` | Deployment automation |
| `docs/DOMAIN_WALLETS_IMPLEMENTATION.md` | Technical architecture |
| `docs/WALLET_DEPLOYMENT_SUMMARY.md` | This file |

---

## Wallet Features by Domain

### pilotshortage.org Wallet
- **Type:** Anonymous / Zero-knowledge
- **Credential:** `AnonymousPilotVC`
- **Privacy:** License numbers hashed (SHA-256)
- **Storage:** No PII in database
- **Use Case:** Prove pilot status for anonymous story submission

### pilotcareerpathways.com Wallet
- **Type:** Career / Professional
- **Credentials:** `PilotLicenseVC`, `MedicalCertVC`, `FlightHoursVC`
- **Features:** 
  - 3-step setup wizard
  - Pathway matching integration
  - One-click credential sharing
  - ATS-compatible formats

### pilotterminal.com (Existing)
- **Type:** Infrastructure
- **Role:** Self-hosted issuer for all domains
- **Function:** `pilot-terminal-issue` edge function

---

## Deployment Checklist

### Step 1: Deploy Edge Functions
```bash
cd /Users/bowler/Documents/apps/app-main
./scripts/deploy-domain-wallets.sh
```

Or manually:
```bash
supabase functions deploy shortage-issue --project-ref gkbhgrozrzhalnjherfu
supabase functions deploy pathways-issue --project-ref gkbhgrozrzhalnjherfu
```

### Step 2: Set Environment Variables
```bash
# Set issuer URL
supabase secrets set PILOT_ISSUER_URL="https://issuer.pilotrecognition.com" \
  --project-ref gkbhgrozrzhalnjherfu

# Set signing key (if not already set)
supabase secrets set PLATFORM_SIGNING_KEY_JWK='{"kty":"EC","crv":"P-256",...}' \
  --project-ref gkbhgrozrzhalnjherfu
```

### Step 3: Update DID Document
Ensure `public/.well-known/did.json` has the current public key:
```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:pilotrecognition.com",
  "verificationMethod": [{
    "id": "did:web:pilotrecognition.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:pilotrecognition.com",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "P-256",
      "x": "...",
      "y": "..."
    }
  }]
}
```

### Step 4: Test Wallets

**pilotshortage.org:**
1. Visit `pilotshortage.org/wallet`
2. Click "Create Anonymous Wallet"
3. Optional: Enter license number
4. Verify credential issued with privacy features

**pilotcareerpathways.com:**
1. Visit `pilotcareerpathways.com/wallet`
2. Complete 3-step setup
3. Issue License + Medical + Hours credentials
4. Check pathway matching updates

---

## Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        SHARED INFRASTRUCTURE                     │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────────────┐    │
│  │  supabase    │  │   issuer-    │  │  pilot_credentials  │    │
│  │   auth       │  │   sign        │  │      table          │    │
│  └──────┬───────┘  └──────┬───────┘  └──────────┬──────────┘    │
│         │                  │                      │              │
└─────────┼──────────────────┼──────────────────────┼──────────────┘
          │                  │                      │
          ▼                  ▼                      ▼
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────────┐
│ pilotshortage   │  │ pilotcareerpathways│ │ pilotrecognition │
│ .org/wallet     │  │ .com/wallet         │ │ .com/wallet       │
│                 │  │                     │ │                   │
│ ShortageWallet  │  │ PathwaysWallet      │ │ Full Wallet       │
│ (Anonymous)     │  │ (Career)            │ │ (Enterprise)      │
└─────────────────┘  └─────────────────────┘ └───────────────────┘
          │                  │                      │
          └──────────────────┼──────────────────────┘
                             │
                    ┌────────▼────────┐
                    │  shortage-issue  │
                    │  pathways-issue  │
                    │ pilot-terminal   │
                    └─────────────────┘
```

---

## Credential Types Issued

| Domain | Credential Type | Contains PII | Purpose |
|--------|----------------|---------------|---------|
| shortage | `AnonymousPilotVC` | ❌ No | Prove pilot status anonymously |
| pathways | `PilotLicenseVC` | ✅ Yes | Job applications |
| pathways | `MedicalCertVC` | ✅ Yes | Medical verification |
| pathways | `FlightHoursVC` | ✅ Yes | Hours verification |
| recognition | All types | ✅ Yes | Full enterprise features |

---

## Security Considerations

1. **shortage.org:** Zero-knowledge - license hashed client-side
2. **careerpathways.com:** Full credentials - encrypted at rest
3. **All domains:** Shared auth, RLS policies enforce boundaries
4. **Issuer:** Self-hosted P-256 signing, no external dependencies

---

## Post-Deployment Verification

```bash
# Test shortage endpoint
curl -X POST "$SUPABASE_URL/functions/v1/shortage-issue" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"auth0_id":"test","profile_id":"test","license_hash":"abc123"}'

# Test pathways endpoint
curl -X POST "$SUPABASE_URL/functions/v1/pathways-issue" \
  -H "Authorization: Bearer $ANON_KEY" \
  -H "Content-Type: application/json" \
  -d '{"auth0_id":"test","profile_id":"test","license_number":"12345"}'

# Test DID resolution
curl "https://pilotrecognition.com/.well-known/did.json"
```

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| Edge function 401 | Check `Authorization` header with valid JWT |
| Issuer fails | Verify `PLATFORM_SIGNING_KEY_JWK` secret is set |
| DID resolution fails | Check `public/.well-known/did.json` exists |
| Credentials not storing | Verify `pilot_credentials` table RLS policies |
| Wallet not loading | Check browser console for IndexedDB errors |

---

**Ready to deploy:** Run `./scripts/deploy-domain-wallets.sh`
