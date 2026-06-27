# Secrets Rotation Checklist

## CRITICAL: All secrets in `.env.local` are exposed in plaintext

**Status:** All values below are currently in `/Users/bowler/Documents/apps/app-main/.env.local`
**Risk:** Any workstation compromise or accidental commit exposes entire infrastructure
**Action:** Rotate ALL keys immediately, then delete `.env.local`

---

## Step 1: Supabase (Project: gkbhgrozrzhalnjherfu)

### 1A. Rotate Service Role Key

1. Go to https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu/settings/api
2. Click "Reveal" next to `service_role` key
3. Click "Generate new secret"
4. Update Vercel env var: `SUPABASE_SERVICE_ROLE_KEY`
5. Update Supabase Edge Function secrets: `SUPABASE_SERVICE_ROLE_KEY`

### 1B. Rotate Anon Key (less critical - this is public-facing)

1. Same page as above
2. Click "Generate new secret" next to `anon` key
3. Update `.env` file: `VITE_SUPABASE_ANON_KEY`
4. Update Vercel env vars

### 1C. Rotate Management Access Token

1. Go to https://supabase.com/account/tokens
2. Revoke existing token `sbp_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`
3. Generate new token
4. Update Vercel env var: `VITE_SUPABASE_MANAGEMENT_ACCESS_TOKEN`

---

## Step 2: Encryption Keys

**Current values in `.env.local` (ALL IDENTICAL = single point of failure):**

```
ENCRYPTION_KEY=e6b2d6cd1eccafd2362005aaf66ff3e4a1be9f7cf526dcbd9260daf75b2922f6
JWT_SECRET=579791b6aeb3964fc804f9a602daf46c7ba327f4483334b44e589880eab4a70f3bf6a965d307b2e78d430fa0642c462bbfeab16167bb124bc9f0eb7a420ac1eb
SESSION_SECRET=e6b2d6cd1eccafd2362005aaf66ff3e4a1be9f7cf526dcbd9260daf75b2922f6
API_SECRET=e6b2d6cd1eccafd2362005aaf66ff3e4a1be9f7cf526dcbd9260daf75b2922f6
FIELD_ENCRYPTION_KEY=e6b2d6cd1eccafd2362005aaf66ff3e4a1be9f7cf526dcbd9260daf75b2922f6
```

**Generate new unique keys:**

```bash
# Run each line separately in terminal
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

1. Generate **5 different values** (one for each key)
2. Update in Supabase Edge Function secrets (NOT in `.env` files)
3. Set as Vercel environment variables
4. **CRITICAL:** Also update `VAULT_MASTER_SECRET` in Supabase Edge Function secrets (separate from above)

---

## Step 3: Stripe (Currently in TEST MODE)

### 3A. Activate Live Account

1. Go to https://dashboard.stripe.com/settings/account
2. Complete business verification (Mauritius entity: Aviation Pathways Ltd)
3. Activate live mode

### 3B. Replace Test Keys with Live Keys

- **Current:** `pk_test_51TTGQoIhIQpGHTt6...`
- **Replace with:** `pk_live_...` (publishable key)
- **Replace with:** `sk_live_...` (secret key - server-side only)

### 3C. Fix Webhook Secret

- **Current (INVALID FORMAT):** `mk_1TTGQoIhIQpGHTt6kBkWab8K`
- **Should be:** `whsec_...` (starts with `whsec_`)

1. Create webhook endpoint in Stripe Dashboard
2. URL: `https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/stripe-webhook`
3. Copy the signing secret (format: `whsec_xxxxxxxx`)
4. Add to Supabase Edge Function secrets: `STRIPE_WEBHOOK_SECRET`

### 3D. Create Live Price IDs

- Current test price IDs won't work in live mode
- Create new products/prices in live Stripe dashboard
- Update env vars: `VITE_STRIPE_RECOGNITION_PLUS_ANNUAL_PRICE_ID`, etc.

---

## Step 4: Auth0 Custom Domain

**Current:** Using dev tenant `dev-ir828tguibp1dh5f.eu.auth0.com`
**Target:** `auth.pilotrecognition.com`

1. Go to https://manage.auth0.com/dashboard/tenant/dev-ir828tguibp1dh5f/settings
2. Settings → Custom Domains
3. Add `auth.pilotrecognition.com`
4. Verify domain ownership via DNS CNAME record
5. Update `.env` and Vercel: `VITE_AUTH0_DOMAIN=auth.pilotrecognition.com`
6. Update allowed callback URLs for production domains

---

## Step 5: MongoDB Atlas

**Current URI exposes password:**

```
mongodb+srv://wingmentorprogram_db_user:GhvGzKrlEqkdVMMM@pilotrecognition...
```

1. Go to https://cloud.mongodb.com → Database Access
2. Rotate password for `wingmentorprogram_db_user`
3. Update `.env.local` (temp) and Vercel env vars
4. Rotate service account credentials too

---

## Step 6: Neon PostgreSQL

**Current connection string in `.env.local`:**

```
postgresql://neondb_owner:npg_nsSWVX43aqfE@ep-sparkling-salad-...
```

1. Go to https://console.neon.tech
2. Project → Roles → Reset password for `neondb_owner`
3. Update Vercel env var: `NEON_DATABASE_URL`

---

## Step 7: Resend (Email)

**Current API key:** `re_2X1XHbv5_2Tzk3ZzfcHvAxjgW9jmEBd4k`

1. Go to https://resend.com/api-keys
2. Revoke existing key
3. Generate new API key
4. Update Vercel env vars: `RESEND_API_KEY` and `VITE_RESEND_API_KEY`
5. Regenerate webhook secret: `RESEND_WEBHOOK_SECRET`

---

## Step 8: Groq AI

**Current key:** `gsk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

1. Go to https://console.groq.com/keys
2. Revoke existing key
3. Generate new key
4. Store in Supabase Edge Function secrets only (NOT client-side)

---

## Step 9: Cloudinary (If Using)

1. Go to https://cloudinary.com/console/settings/security
2. Rotate API key and API secret
3. Update Supabase Edge Function secrets

---

## Step 10: DID Signing Key

**Current:** `PLATFORM_SIGNING_KEY_JWK` should be set as Supabase Edge Function secret

1. Verify it's set: Supabase Dashboard → Edge Functions → `issuer-sign` → Secrets
2. If not set, generate new P-256 key pair:
   ```bash
   deno run --allow-all scripts/generate-issuer-keys.ts
   ```
3. Update `public/.well-known/did.json` with new public key
4. The old `.env` had `WALT_ISSUER_JWK` — migrate to `PLATFORM_SIGNING_KEY_JWK` naming

---

## Step 11: Clean Up

After ALL rotations are complete:

1. **Delete `.env.local`** from workstation
2. **Delete `.env`** from workstation (keep `.env.example` only)
3. Verify `.gitignore` excludes `.env` and `.env.*` ✅ Already done
4. Run `git status` to ensure no secrets are staged
5. Clear shell history: `history -c` (or equivalent)

---

## Where Secrets Should Live

| Secret                   | Location                                | Never In              |
| ------------------------ | --------------------------------------- | --------------------- |
| Supabase Anon Key        | `.env` (public, safe)                   | —                     |
| Supabase Service Role    | Supabase Edge Function secrets + Vercel | `.env` or client code |
| Stripe Secret Key        | Vercel (server-side only)               | Client bundle         |
| Stripe Publishable       | `.env` / Vercel                         | —                     |
| Auth0 Domain/Client      | `.env` / Vercel                         | —                     |
| Encryption Keys          | Supabase Edge Function secrets          | Any file              |
| JWT Secret               | Supabase Edge Function secrets          | Any file              |
| MongoDB URI              | Vercel (server-side)                    | Client bundle         |
| Groq API Key             | Supabase Edge Function secrets only     | Client bundle         |
| Resend API Key           | Vercel (server-side)                    | Client bundle         |
| Cloudinary Secret        | Supabase Edge Function secrets          | Client bundle         |
| PLATFORM_SIGNING_KEY_JWK | Supabase Edge Function secrets          | Any file              |

---

## Verification Steps

After rotation, verify:

1. `npm run build` still passes
2. `npm run test` passes (if tests exist)
3. Local dev still works with new `.env.local` (if needed for dev)
4. Vercel preview deployment succeeds
5. Edge functions deploy without errors
