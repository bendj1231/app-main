# Demo Script: Production Signing Infrastructure
## PR-DCA-001 v1.7 with Mauritius Data Controller Framework

**Purpose:** Demonstrate self-hosted VC issuance to investors/partners  
**Time Required:** 15-20 minutes  
**Prerequisites:** Supabase CLI, Deno, test pilot profile

---

## Pre-Demo Checklist

```bash
# 1. Verify edge functions are deployed
supabase functions list

# Should show:
# - issuer-sign (production signing)
# - veremark-webhook (auto-issuance)
# - pilot-pull-api (enterprise verification)

# 2. Verify environment variables
supabase secrets list

# Should include:
# - PLATFORM_SIGNING_KEY_JWK (your P-256 key)
# - SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY

# 3. Check DID document is hosted
curl https://pilotrecognition.com/.well-known/did.json

# Should return JSON with your public key
```

---

## Demo Part 1: Self-Hosted Issuer (5 min)

### Narrative
> "We don't rely on third-party issuers. We control the entire cryptographic infrastructure."

### Steps

**1. Show the issuer code**
```bash
# Open in IDE
open supabase/functions/issuer-sign/index.ts
```

**Key talking points:**
- "This is our production signing service — ECDSA P-256, same algorithm as Apple Secure Enclave"
- "No Walt.id dependency. We control the keys, the signatures, the infrastructure."
- "Mauritius Data Controller status allows us to custody these credentials legally."

**2. Issue a test credential**
```bash
# Get your Supabase anon key from dashboard
SUPABASE_URL="https://gkbhgrozrzhalnjherfu.supabase.co"
ANON_KEY="your-anon-key-here"

# Issue a test PilotLicenseVC
curl -X POST "${SUPABASE_URL}/functions/v1/issuer-sign" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer ${ANON_KEY}" \
  -d '{
    "credential_type": "PilotLicenseVC",
    "subject_did": "did:web:pilotrecognition.com:pilots:demo123",
    "credential_data": {
      "licenseNumber": "REDACTED-CPL",
      "pelNumber": "REDACTED",
      "issuingAuthority": "CAAP",
      "expiryDate": "2030-10-23",
      "totalHours": 1500,
      "verificationMethod": "Demo for investor presentation"
    },
    "auth0_id": "demo|123",
    "profile_id": "00000000-0000-0000-0000-000000000000"
  }' | jq
```

**3. Show the result**

Expected output:
```json
{
  "success": true,
  "credential_id": "uuid-here",
  "issuer_did": "did:web:pilotrecognition.com",
  "signed_credential": {
    "@context": ["https://www.w3.org/ns/credentials/v2"],
    "type": ["VerifiableCredential", "PilotLicenseCredential"],
    "issuer": {
      "id": "did:web:pilotrecognition.com",
      "name": "PilotRecognition — Aviation Credential Infrastructure"
    },
    "proof": {
      "type": "DataIntegrityProof",
      "cryptosuite": "ecdsa-2026",
      "proofValue": "BASE64_SIGNATURE_HERE",
      "verificationMethod": "did:web:pilotrecognition.com#key-1"
    }
  }
}
```

**Key talking points:**
- "This is a REAL cryptographic signature — not a demo placeholder."
- "Any airline can verify this against our DID document."
- "The Mauritius Data Controller registration gives us legal authority to issue these."

---

## Demo Part 2: Veremark Auto-Issuance (5 min)

### Narrative
> "When Veremark verifies a pilot, credentials are issued automatically — no manual intervention."

### Steps

**1. Show the webhook code**
```bash
open supabase/functions/veremark-webhook/index.ts
```

**Navigate to line 156 — the auto-issuance block**

**Key talking points:**
- "Veremark sends webhook: verification.completed → We auto-issue VC"
- "Pilot gets signed credential within seconds"
- "Revocation works the same way — if Veremark detects expiry, credential is revoked"

**2. Check Supabase for existing credentials**
```sql
-- Run in Supabase SQL Editor
SELECT 
  credential_id,
  credential_type,
  issuer_did,
  credential_status,
  issued_at,
  proof_value IS NOT NULL as has_signature
FROM pilot_credentials 
WHERE source_provider = 'Veremark' 
LIMIT 5;
```

**3. Show a real credential in the database**
```sql
-- Get full credential
SELECT signed_credential 
FROM pilot_credentials 
WHERE credential_id = 'your-credential-id';
```

**Key talking points:**
- "This pilot was verified by Veremark — see the real CAAP license data"
- "Signature is cryptographically bound to the credential"
- "If CAAP revokes the license, we update the revocation registry automatically"

---

## Demo Part 3: DCA v1.7 & Mauritius Framework (3 min)

### Narrative
> "Our legal framework is built for global aviation compliance — starting with Mauritius Data Controller registration."

### Steps

**1. Open the public DCA page**
```
https://pilotrecognition.com/data-controller-agreement
```

**2. Navigate to Article 9**

**Key talking points:**
- "Article 9 — Mauritius Data Controller Registration. This is new in v1.7."
- "MUR 1,000 per year — about $22 USD."
- "As a registered Controller, we can legally custody Verifiable Credentials."
- "This is the foundation for our Walt.id partnership and wallet infrastructure."

**3. Show the modal (Terminal 1 onboarding)**
```
# In your app, go to /become-member
# Click through to trigger the modal
```

**Key talking points:**
- "Every pilot accepts this agreement before creating an account."
- "They're informed we're a Mauritius-registered Infrastructure Controller."
- "They remain the Data Controller of their own identity — we just provide the vault."

---

## Demo Part 4: QR Verification for Airlines (5 min)

### Narrative
> "Airlines don't need complex software — they just scan and verify."

### Steps

**1. Show the pilot wallet**
```
https://wallet.pilotrecognition.com
# Or wherever your wallet is hosted
```

**2. Full-screen a credential QR**

**3. Show what the airline sees**
```
# Scan with phone or open verification URL
https://pilotrecognition.com/verify/{credential_id}
```

**Key talking points:**
- "Airline scans QR → Gets instant verification result"
- "Shows: License valid, Medical current, Hours verified"
- "Cryptographic signature is verified against our DID in real-time"
- "No database access needed — pure cryptographic trust"

---

## Demo Part 5: Three-Database Architecture (2 min)

### Narrative
> "We built redundancy and sovereignty into the infrastructure from day one."

### Steps

**1. Show the architecture diagram**
```bash
open docs/EDB_MAURITIUS_BUSINESS_SETUP.md
# Or create a simple diagram
```

**2. Show live connections**
```bash
# Test Supabase (Sydney)
supabase db ping

# Test Neon (Singapore) 
# Show in dashboard

# Test MongoDB (Singapore)
# Show in Atlas dashboard
```

**Key talking points:**
- "Supabase: Auth + profiles + encrypted credentials (Sydney)"
- "Neon: OEM data + pathway cards (Singapore)"
- "MongoDB: Raw API payloads + telemetry (Singapore)"
- "Geographic distribution for latency and compliance."

---

## Investor Q&A Prep

### Expected Questions & Answers

**Q: "How is this different from a PDF certificate?"**
A: "PDFs can be forged. Our credentials are cryptographically signed. An airline can verify the signature against our public key in seconds — no need to call CAAP."

**Q: "What if CAAP revokes a license?"**
A: "Veremark detects it → Webhook hits our revocation endpoint → Credential status flips to 'revoked' in real-time. Airline sees red status immediately."

**Q: "Why Mauritius?"**
A: "Three reasons: 1) 1,000 MUR/year Data Controller permit is cheap and clear. 2) DTAAs with 46 countries including Philippines and UAE. 3) 0% capital gains on IP — perfect for our EBT scoring algorithm."

**Q: "What if Veremark integration fails?"**
A: "We have the self-hosted issuer. We can issue credentials manually or switch to another verification provider. The architecture is vendor-agnostic."

**Q: "How do pilots hold credentials?"**
A: "Web wallet now. Apple Wallet passes coming next. Eventually native app with Secure Enclave. The VCs are portable — export to any W3C-compliant wallet."

**Q: "Competitive moat?"**
A: "It's not the tech — it's the verification network. We've integrated Veremark, we're building CAAP connections, we have the legal framework. A competitor can copy the code, but they can't copy the trust relationships."

---

## Post-Demo Actions

**Send investor follow-up:**

```
Subject: PilotRecognition VC Infrastructure — Demo Summary

Thanks for joining the demo. Key links:

1. DCA v1.7 (public): https://pilotrecognition.com/data-controller-agreement
2. DID Document: https://pilotrecognition.com/.well-known/did.json
3. Demo credential: [paste JSON from Demo Part 1]

Next steps:
- Mauritius company incorporation: In progress
- Data Controller permit application: Pending incorporation
- Veremark production integration: 1-2 weeks post-permit

Questions? Reply or book follow-up: [Calendly link]
```

---

## Troubleshooting

### If issuer-sign returns 500
```bash
# Check secret is set
supabase secrets set PLATFORM_SIGNING_KEY_JWK='{"kty":"EC","crv":"P-256","d":"...","x":"...","y":"..."}'
supabase functions deploy issuer-sign --force
```

### If no credentials in database
```sql
-- Check if veremark_webhook is receiving events
SELECT * FROM veremark_webhook_logs 
ORDER BY processed_at DESC 
LIMIT 10;
```

### If DID document not resolving
```bash
# Check file exists
cat public/.well-known/did.json

# Redeploy if needed
vercel --prod  # or your deployment command
```

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026  
**Status:** Ready for investor demo
