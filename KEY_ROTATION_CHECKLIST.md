# Key Rotation Checklist
## URGENT: Secrets Exposed in Git History

**Date:** June 1, 2026
**Status:** NOT STARTED
**Risk Level:** CRITICAL

---

## Why This Is Urgent

`.env` and `.env.local` were committed to git history (5+ commits). They contain live production secrets. Anyone with repo access can checkout an old commit and read them.

**Affected secrets:**
- Supabase service_role key (full database admin)
- Supabase anon key
- Supabase management token
- Neon PostgreSQL URL (plaintext password)
- MongoDB Atlas URI (plaintext password + API secrets)
- Stripe secret key + webhook secret
- Resend API key + webhook secret
- Groq API key
- Internal encryption keys (JWT_SECRET, SESSION_SECRET, ENCRYPTION_KEY, API_SECRET, FIELD_ENCRYPTION_KEY)
- Auth0 client secret

---

## Step 1: Rotate Supabase Keys (MOST CRITICAL)

### 1a. Rotate Service Role Key
1. Go to: https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu/settings/api
2. Click **"Generate new service_role key"**
3. Update `.env.local` with new key
4. **Do NOT commit**
5. Re-deploy all edge functions (they use `SUPABASE_SERVICE_ROLE_KEY`)

### 1b. Rotate Anon Key
1. Same page as above
2. Click **"Generate new anon key"**
3. Update `.env.local` and any client code referencing the old key
4. Update Vercel/Netlify environment variables if deployed there

### 1c. Revoke Management Token
1. Go to: https://supabase.com/dashboard/account/tokens
2. Find token starting with `sbp_2780bc79...`
3. Click **Revoke**
4. Generate new token if needed for CI/CD

---

## Step 2: Rotate Neon PostgreSQL Password

1. Go to: https://console.neon.tech (project: `ep-sparkling-salad-ao6h1srb`)
2. Settings → Connection Details → Reset Password
3. Update `NEON_DATABASE_URL` in `.env.local`
4. Update Supabase Edge Function secrets if any functions connect directly to Neon

---

## Step 3: Rotate MongoDB Atlas Credentials

### 3a. Database User Password
1. Go to: https://cloud.mongodb.com → Database Access
2. Find user: `wingmentorprogram_db_user`
3. Edit → Edit Password → Generate new strong password
4. Update `MONGODB_URI` in `.env.local`

### 3b. Service Account API Key (if used)
1. Organization → Access Manager → Service Accounts
2. Find: `mdb_sa_id_6a0fea2d89fa96a95ae2926e`
3. Rotate API key

---

## Step 4: Rotate Stripe Keys

1. Go to: https://dashboard.stripe.com/test/apikeys (test) or https://dashboard.stripe.com/apikeys (live)
2. **If using live keys:** Click **"Roll key"** on secret key
3. Click **"Roll key"** on webhook secret
4. If using restricted keys, regenerate those too
5. Update `STRIPE_SECRET_KEY` and `STRIPE_WEBHOOK_SECRET` in `.env.local`
6. Update any webhook endpoints in Stripe dashboard with new secret

---

## Step 5: Rotate Resend Keys

1. Go to: https://resend.com/emails
2. Settings → API Keys → Revoke `re_2X1XHbv5...`
3. Generate new key
4. Update `RESEND_API_KEY` in `.env.local`
5. Go to Webhooks → Rotate webhook secret
6. Update `RESEND_WEBHOOK_SECRET`

---

## Step 6: Rotate Groq API Key

1. Go to: https://console.groq.com/keys
2. Revoke `gsk_5SAFX7dt...`
3. Generate new key
4. Update `GROQ_API_KEY` in `.env.local`

---

## Step 7: Rotate Internal Encryption Keys

**CRITICAL: These keys are identical in the exposed file. They MUST be different.**

Generate 5 new random keys:
```bash
# Run this in terminal to generate 5 unique 64-byte hex keys
node -e "for(let i=0;i<5;i++)console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Update these in `.env.local` — each must be unique:
- `JWT_SECRET` (for JWT signing)
- `SESSION_SECRET` (for session cookies)
- `ENCRYPTION_KEY` (for general encryption)
- `API_SECRET` (for API signing)
- `FIELD_ENCRYPTION_KEY` (for field-level encryption)

**⚠️ WARNING:** If `ENCRYPTION_KEY` or `FIELD_ENCRYPTION_KEY` were used to encrypt existing data, rotating them will make that data unreadable. Verify no existing ciphertext exists before rotating, OR implement a re-encryption migration.

---

## Step 8: Rotate Auth0 Client Secret

1. Go to: https://manage.auth0.com/dashboard/us/dev-ir828tguibp1dh5f/applications
2. Select application: PilotRecognition / pilotterminal
3. Settings → Advanced → **Rotate Secret**
4. Update `VITE_AUTH0_CLIENT_SECRET` in `.env.local` (if used server-side)

---

## Step 9: Update Supabase Edge Function Secrets

Some edge functions may read from Supabase Secrets instead of `.env.local`.

1. Go to: https://supabase.com/dashboard/project/gkbhgrozrzhalnjherfu/settings/functions
2. Update any secrets that were exposed (e.g., `GROQ_API_KEY`, `RESEND_API_KEY`, `STRIPE_SECRET_KEY`)
3. Re-deploy all edge functions after secret updates

---

## Step 10: Verify No Old Keys Left

After updating `.env.local`, run:
```bash
# Check if any old keys still exist in the file
grep -E "(eyJhbGci|sbp_|sk_live_|sk_test_|rk_test_|re_|gsk_|mongodb\+srv)" .env.local

# If you see matches, those are the NEW keys. Verify they don't match the old ones.
```

---

## Step 11: Scrub Git History

**⚠️ WARNING: This rewrites history. Coordinate with your team first.**

```bash
# Install git-filter-repo
pip install git-filter-repo

# Run the scrub script
bash scripts/scrub-secrets-from-history.sh

# After scrub, force-push
git push origin --force --all

# Clean local reflog
git reflog expire --expire=now --all
git gc --prune=now --aggressive
```

**Tell your team:** They must re-clone the repo. Do NOT `git pull` after a history rewrite.

---

## Step 12: Verify Scrub Worked

```bash
# Search for old service role key in history
git log --all -p -S "<OLD_SERVICE_ROLE_KEY>" | head -5

# Should return nothing. If it returns commits, the scrub failed.
```

---

## Post-Rotation Verification

| Check | Command / Action |
|-------|-----------------|
| Edge functions work | `npx supabase functions deploy` → check logs |
| Database connects | Run any query via MCP / dashboard |
| Stripe webhooks work | Stripe Dashboard → Webhooks → test endpoint |
| Emails send | Trigger a test email via app |
| Auth0 login works | Log out and log back in |
| Wallet still loads | Check wallet.pilotrecognition.com |

---

## Estimated Time

- **Supabase keys:** 5 minutes
- **Neon password:** 5 minutes
- **MongoDB password:** 5 minutes
- **Stripe keys:** 10 minutes
- **Resend keys:** 5 minutes
- **Groq key:** 2 minutes
- **Internal encryption keys:** 10 minutes
- **Auth0 secret:** 5 minutes
- **Git history scrub:** 15 minutes
- **Re-deployment & verification:** 20 minutes

**Total: ~1.5 hours**

---

## ⚠️ Do NOT Skip

The `service_role` key in git history gives anyone full read/write access to your entire database. This is a **P0 incident** for any audit. Rotate it immediately.

*Checklist generated June 1, 2026*
