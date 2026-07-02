---
description: Storage architecture — R2 for private pilot data, Pinata IPFS for public institutional data
---

## Architecture split

| Data type | Storage | Reason |
|---|---|---|
| Pilot credential photos, VP exports, logbook scans | **Cloudflare R2** (`pilot-encrypted-vault` bucket) | Private, AES-256-GCM encrypted, pilot-owned, never public |
| Airline info, manufacturer data (Airbus, Boeing etc), flight school profiles, operator content | **Pinata IPFS** | Public reference data we don't own — IPFS proves we don't hold or modify it |

**Pinata is NOT used for any pilot personal data.** It is only for publicly-sourced institutional content that we pin to prove immutability.

---

## Setting up Pinata for public institutional content

### Step 1 — Create a Pinata account

1. Go to https://pinata.cloud and sign up (free tier: 1 GB, 100 pins/month)
2. Verify your email

### Step 2 — Generate an API Key

1. In the Pinata dashboard, click **API Keys** in the left sidebar
2. Click **+ New Key**, toggle **Admin** on, name it `pilotrecognition-public`
3. **Copy the JWT** — you will NOT be able to see it again

### Step 3 — Add secrets to Cloudflare Workers

1. Run:

```bash
cd cloudflare
npx wrangler secret put PINATA_JWT
npx wrangler secret put PINATA_GATEWAY
```

| Secret Name | Value |
|---|---|
| `PINATA_JWT` | The JWT from Step 2 |
| `PINATA_GATEWAY` | Your gateway slug e.g. `amber-defensive-minnow-123.mypinata.cloud` |

### Step 4 — Usage (public data only)

Use Pinata only to pin **publicly-declared institutional reference data**:
- Airline cadet intake expectations & hiring rubrics (AirAsia, Scoot, PAL, Cebu Pacific etc.)
- Flight school / ATO syllabus PDFs and training stage checklists
- Type-rating checkride parameters published by manufacturers (Airbus, Boeing, Embraer)
- CAAP/FAA/ICAO public regulatory standards and advisory circulars
- Pathway programme outcome criteria published by airlines/operators

**Why IPFS for this data:**
- CID is derived from file hash — content is tamper-proof. Airlines cannot retroactively alter old hiring expectations; the old CID is a permanent record
- Zero database bloat — D1 only stores the `ipfs://Qm...` pointer string, not the PDF
- Cross-school sync — multiple ATOs across the Philippines can all reference the same CID for the same airline pathway standard

**D1 only stores the pointer:**
```sql
-- e.g. in airline_pathways or ato_programmes table
ipfs_cid TEXT -- e.g. 'bafybeihgxdzljxb26q6nf3r3eifqeedsvt2eubqtskghpme66cgjyw4fra'
```

**Never pin pilot credentials, photos, logbooks, medicals, or any PII to IPFS.**

**Never include `pilot_id` in any IPFS artifact** — identity binding (pilot_id ↔ CID) lives in D1 only.

### aviation-data-agent v7 storage split

| Action | IPFS artifact (no PII) | D1 (pointer only) |
|---|---|---|
| `gap_analysis` | Market alignment JSON: aircraft type, Weibull result, OEM data | `pilot_career_intelligence.ipfs_cid` |
| `pin_market_audit` | Same as above, explicit pin | Same |
| `seniority_risk` | Fleet snapshot: airline IATA, risk score, retirement curve | `pilot_seniority_risk.ipfs_cid` |
| `pay_projection` | Pay scale comparison: carrier tiers, 5yr projections | `pilot_pay_projections.ipfs_cid` |
| `audit_locker` | SHA-256 hash + document type only — NO document content, NO pilot_id | `pilot_audit_locker.ipfs_cid` + `pilot_id` binding |

---

## R2 for pilot private data

The `r2-presign-upload` edge function handles all pilot credential uploads:
- Issues a 5-minute presigned PUT URL scoped to `{userId}/{credentialType}/`
- Browser encrypts file AES-256-GCM client-side before uploading
- R2 never sees plaintext

No Pinata involvement in the pilot vault flow.
