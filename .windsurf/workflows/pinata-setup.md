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

### Step 3 — Add secrets to Supabase

1. Go to https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu/settings/edge-functions
2. Add:

| Secret Name | Value |
|---|---|
| `PINATA_JWT` | The JWT from Step 2 |
| `PINATA_GATEWAY` | Your gateway slug e.g. `amber-defensive-minnow-123.mypinata.cloud` |

### Step 4 — Usage (public data only)

Use Pinata only to pin:
- Airline/operator public profile JSON
- Manufacturer (Airbus, Boeing, Embraer) aircraft type data
- Flight school / ATO public information
- Any reference dataset sourced from public registries (CAAP, FAA, ICAO)

**Never pin pilot credentials, photos, or personal data to IPFS.**

---

## R2 for pilot private data

The `r2-presign-upload` edge function handles all pilot credential uploads:
- Issues a 5-minute presigned PUT URL scoped to `{userId}/{credentialType}/`
- Browser encrypts file AES-256-GCM client-side before uploading
- R2 never sees plaintext

No Pinata involvement in the pilot vault flow.
