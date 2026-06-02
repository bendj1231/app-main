# Technical Infrastructure Summary

**Complete Platform Architecture Overview**

---

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                         PILOTRECOGNITION PLATFORM                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                         CLIENT LAYER                                 │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌─────────────┐  │   │
│  │  │ pilotrecognition│ │pilotcareerpath-│ │pilotshortage │ │wallet.pilot │  │   │
│  │  │ .com          │ │ways.com        │ │.org          │ │recognition  │  │   │
│  │  │               │ │                │ │              │ │.com         │  │   │
│  │  │ • Full Wallet │ │ • Career Wallet│ │ • Anonymous  │ │ • Public    │  │   │
│  │  │ • Enterprise  │ │ • Pathways     │ │   Wallet     │ │   Share     │  │   │
│  │  │ • Verification│ │ • Programs     │ │ • Stories    │ │ • Read-only │  │   │
│  │  └──────┬───────┘ └──────┬───────┘ └──────┬───────┘ └──────┬──────┘  │   │
│  │         │                │                │                │        │   │
│  │         └────────────────┴────────────────┴────────────────┘        │   │
│  │                              │                                      │   │
│  │                    Vercel Edge Middleware                         │   │
│  │                    (Domain Detection + Routing)                   │   │
│  └──────────────────────────────┼──────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                      SUPABASE BACKEND                                │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │   │
│  │  │   Database   │ │ Edge Functions│ │   Auth       │ │  Storage   │ │   │
│  │  │              │ │              │ │              │ │            │ │   │
│  │  │ • profiles   │ │ • issuer-sign│ │ • Auth0      │ │ • R2       │ │   │
│  │  │ • credentials│ │ • verify-*   │ │   OAuth      │ │   buckets  │ │   │
│  │  │ • pathways   │ │ • veremark   │ │ • RLS        │ │ • CDN      │ │   │
│  │  │ • audit_log  │ │ • wallet-api │ │ • JWT        │ │ • Backup   │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │   │
│  │                                                                      │   │
│  │  Project ID: gkbhgrozrzhalnjherfu                                   │   │
│  │  Region: ap-southeast-2 (Sydney)                                      │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                 │                                            │
│                                 ▼                                            │
│  ┌─────────────────────────────────────────────────────────────────────┐   │
│  │                    EXTERNAL INTEGRATIONS                            │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐ ┌────────────┐ │   │
│  │  │   Veremark   │ │   Stripe     │ │   Cloudflare │ │   Auth0    │ │   │
│  │  │ Verification │ │   Payments   │ │   R2/Zero    │ │   SSO      │ │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘ └────────────┘ │   │
│  │  ┌──────────────┐ ┌──────────────┐ ┌──────────────┐               │   │
│  │  │   CAAP       │ │   GCAA       │ │   Resend     │               │   │
│  │  │   API        │ │   API        │ │   Email      │               │   │
│  │  └──────────────┘ └──────────────┘ └──────────────┘               │   │
│  └─────────────────────────────────────────────────────────────────────┘   │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Infrastructure Checklist

### Core Platform

| Component | Status | Provider | Notes |
|-----------|--------|----------|-------|
| **Database** | ✅ | Supabase | gkbhgrozrzhalnjherfu, ap-southeast-2 |
| **Authentication** | ✅ | Auth0 + Supabase | Domain-aware OAuth |
| **Edge Functions** | ✅ | Supabase | Issuer, verification, webhooks |
| **Storage** | ✅ | Cloudflare R2 | Private + public buckets |
| **CDN** | ✅ | Cloudflare | Global edge caching |
| **Hosting** | ✅ | Vercel | 3 domains, single codebase |

### Wallet Infrastructure

| Tier | Component | Status | Location |
|------|-----------|--------|----------|
| **Tier 1** | Secure Enclave | ✅ | `lib/wallet/enclave.ts` |
| **Tier 2** | Encrypted Storage | ✅ | `lib/wallet/storage.ts` |
| **Tier 3** | Status List | ✅ | `lib/wallet/statusList.ts` |
| **Tier 4** | Audit Logging | ✅ | Supabase `wallet_audit_log` |
| **Issuance** | Self-hosted Issuer | ✅ | `supabase/functions/issuer-sign/` |
| **DID** | did:web | ✅ | `/.well-known/did.json` |

### Security

| Feature | Status | Implementation |
|---------|--------|----------------|
| **RLS Policies** | ✅ | Domain-aware policies on all tables |
| **Encryption** | ✅ | AES-256-GCM for storage |
| **Key Management** | ✅ | Non-extractable P-256 |
| **Audit Logging** | ✅ | Zero-PII immutable logs |
| **CSP Headers** | ✅ | Strict policy |
| **Rate Limiting** | ✅ | Per-user + global limits |

---

## Domain Configuration

```
┌─────────────────────────────────────────────────────────────────┐
│                      DOMAIN ROUTING                             │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  pilotrecognition.com                                           │
│  ├── /                          → Main landing                  │
│  ├── /wallet                    → Full wallet                   │
│  ├── /verification              → Document upload + verify       │
│  ├── /enterprise                → Airline dashboard              │
│  ├── /pathways                  → Pathway listings               │
│  └── /ucf                       → Universal Commercial Framework │
│                                                                  │
│  pilotcareerpathways.com                                        │
│  ├── /                          → Career pathways landing       │
│  ├── /wallet                    → Career wallet (3-step)        │
│  ├── /programs                  → Training programs             │
│  └── /pathways/[id]             → Individual pathway pages     │
│                                                                  │
│  pilotshortage.org                                              │
│  ├── /                          → PSA advocacy homepage         │
│  ├── /wallet                    → Anonymous wallet              │
│  ├── /stories                   → Pilot stories                 │
│  └── /ucf                       → Framework documentation     │
│                                                                  │
│  wallet.pilotrecognition.com                                    │
│  ├── /[token]                   → Public credential share       │
│  └── /manage                    → Wallet management (auth)      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## Database Schema (Key Tables)

```sql
-- Core tables
profiles                    -- Pilot profiles with domain_source
credentials                 -- Wallet credential references (hashes, not plaintext)
pilot_documents             -- Document uploads (R2 paths)
pathways                    -- Airline/ATO pathway listings
enterprise_contracts        -- B2B operator agreements

-- Wallet tables
wallet_audit_log            -- Immutable action logs (zero PII)
credential_status_cache     -- Client status cache sync
enclave_key_registry        -- Key metadata (not actual keys)

-- Verification tables
verification_checks         -- Veremark + API check results
ato_activation_credits      -- 5-day credit system

-- RLS: All tables have domain-aware policies
-- Encryption: AES-256 for credential storage
-- Backup: Daily to R2 cold storage
```

---

## Edge Functions

```
supabase/functions/
├── _shared/
│   ├── cors.ts
│   ├── supabase.ts
│   └── response.ts
├── issuer-sign/            # W3C VC signing (core)
├── verify-license/         # CAAP/GCAA license verification
├── verify-medical/         # Medical certificate verification
├── verify-hours/           # Logbook/ATO hour verification
├── veremark-webhook/       # Background check webhooks
├── shortage-issue/         # pilotshortage.org credentials
├── pathways-issue/         # pilotcareerpathways.com credentials
├── recognition-issue/      # pilotrecognition.com credentials
├── pilot-pull-api/         # Enterprise pilot search API
├── activation-credit-expiry/ # Cron: 5-day credit expiry
└── key-rotation/           # Scheduled issuer key rotation
```

---

## Environment Variables

```bash
# Client (.env)
VITE_SUPABASE_URL=https://gkbhgrozrzhalnjherfu.supabase.co
VITE_SUPABASE_ANON_KEY=...
VITE_AUTH0_DOMAIN=dev-ir828tguibp1dh5f.eu.auth0.com
VITE_AUTH0_CLIENT_ID=...
VITE_PILOT_ISSUER_URL=https://issuer.pilotrecognition.com

# Server (Supabase Secrets)
PLATFORM_SIGNING_KEY_JWK={...}           # Issuer private key
VEREMARK_API_KEY=...
STRIPE_SECRET_KEY=...
RESEND_API_KEY=...
```

---

## Deployment Status

| Component | Status | Last Updated |
|-----------|--------|--------------|
| **Frontend** | ✅ Live | Continuous (Vercel) |
| **Edge Functions** | ✅ Deployed | June 2, 2026 |
| **DID Document** | ✅ Published | /.well-known/did.json |
| **Status List** | ✅ Active | Auto-regenerated |
| **Veremark Webhook** | ✅ Active | Processing checks |
| **Domain Wallets** | 🔄 Staged | Pending final test |
| **Enterprise API** | 🔄 In Progress | Spec complete |

---

## Next Steps

1. **Deploy Domain Wallets** — Run `./scripts/deploy-domain-wallets.sh`
2. **Enterprise API** — Complete pilot-pull-api implementation
3. **Pathway Matching** — Build matching algorithm
4. **Analytics** — Cross-domain attribution tracking

---

## Support

- **Documentation:** `/docs/technical-architecture/`
- **Issues:** GitHub Issues
- **On-Call:** Rotate through platform engineering team
- **Emergency:** Key recovery ceremony documented

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026  
**Maintainer:** Platform Engineering Team
