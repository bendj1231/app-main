# 🔐 Emergency Key Rotation Guide

## Status: COMPROMISED — All keys must be rotated immediately

This guide covers every API key, secret, and credential that may have been exposed.

---

## 1. RESEND (Email) — HIGHEST PRIORITY

**Why:** Attackers are actively sending spam from your account.

### Actions:
1. Go to [Resend Dashboard](https://resend.com) → API Keys
2. Delete the old API key immediately
3. Create a new key (copy it — shown only once)
4. Update these locations:
   - Cloudflare Worker secrets: `npx wrangler secret put RESEND_API_KEY` (both `worker` and `cloudflare`)
   - Any local `.env.local` files on team machines
   - The `test-env-keys.js` script references `RESEND_API_KEY` for testing

### After rotation:
- Enable **Domain Restrictions** in Resend (only send from pilotrecognition.com)
- Enable **Rate Limiting** if available
- Review sent emails log for any unauthorized sends

---

## 2. CLOUDFLARE — CRITICAL

**Why:** Cloudflare API token and Worker secrets in Git history or `.env` files give full access to D1, Workers, R2, and Pages.

### Cloudflare API Token
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. Delete the old token
3. Create a new token with limited permissions (Workers, D1, Pages, R2 as needed)
4. Update `CLOUDFLARE_API_TOKEN` in GitHub Actions secrets and `.env.local`

### Worker Secrets
1. Rotate all Worker secrets via Wrangler:
   ```bash
   cd worker
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put EMAIL_API_SECRET
   npx wrangler secret put OPENROUTER_API_KEY
   npx wrangler secret put MFA_ENCRYPTION_KEY
   npx wrangler secret put STRIPE_SECRET_KEY
   npx wrangler secret put DODO_API_KEY
   npx wrangler secret put VEREMARK_WEBHOOK_SECRET
   
   cd ../cloudflare
   npx wrangler secret put RESEND_API_KEY
   npx wrangler secret put DODO_API_KEY
   npx wrangler secret put VEREMARK_WEBHOOK_SECRET
   npx wrangler secret put CLOUDINARY_API_SECRET
   npx wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY
   ```

### After rotation:
- Check **Cloudflare Dashboard → Workers & Pages → Logs** for unauthorized Worker requests
- Check **D1 → Query logs** for unusual queries
- Review API token usage in Cloudflare audit logs

### Update these locations:
- Cloudflare Worker secrets (via `npx wrangler secret put`)
- GitHub Actions secrets (`CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`)
- Any local `.env.local` files on team machines
- The `test-env-keys.js` script references Cloudflare Worker keys for testing

---

## 3. AUTH0 — HIGH PRIORITY

**Why:** Auth0 domain + client ID exposed in `.env.example`. If client secret was also exposed, attackers can manipulate user sessions.

### Actions:
1. Go to [Auth0 Dashboard](https://manage.auth0.com) → Applications
2. Find your PilotRecognition application
3. Settings → "Rotate Secret" (or regenerate if not available)
4. Check **Logs → Monitoring** for suspicious login patterns

### After rotation:
- Update `VITE_AUTH0_CLIENT_ID` in all `.env.local` files
- If you have a client secret (backend usage), rotate that too
- Force all users to re-login (optional but recommended)

---

## 4. STRIPE — HIGH PRIORITY

**Why:** Secret keys enable payment manipulation and refunds.

### Actions:
1. Go to [Stripe Dashboard](https://dashboard.stripe.com) → Developers → API Keys
2. Delete old secret key, create new restricted key
3. If you use Webhook secrets, regenerate those too

### After rotation:
- Update `STRIPE_SECRET_KEY` in `.env.local`
- Update `STRIPE_WEBHOOK_SECRET` in webhook endpoints
- Check for unauthorized charges, refunds, or customer creation

---

## 5. CLOUDFLARE — HIGH PRIORITY

**Why:** API tokens can modify DNS, deploy workers, access R2 storage.

### Actions:
1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com) → My Profile → API Tokens
2. Review all active tokens
3. Delete any suspicious or unused tokens
4. Regenerate the API token used for Workers deployment

### After rotation:
- Update `wrangler` config or CI/CD with new token
- Check R2 bucket `pilot-encrypted-vault` for unauthorized access
- Check D1 databases for unauthorized queries
- Set `EMAIL_API_SECRET` and `RESEND_API_KEY` as Worker secrets:
  ```bash
  wrangler secret put EMAIL_API_SECRET
  wrangler secret put RESEND_API_KEY
  ```
  Generate `EMAIL_API_SECRET` with: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`

---

## 6. CLOUDINARY — MEDIUM PRIORITY

**Why:** API secret allows image uploads/deletions.

### Actions:
1. Go to [Cloudinary Dashboard](https://console.cloudinary.com) → Settings → Security
2. Regenerate API secret
3. Update `CLOUDINARY_API_SECRET` in `.env.local`

---

## 7. GROQ / GEMINI / OPENROUTER AI KEYS — MEDIUM PRIORITY

**Why:** Attackers can drain your API credits.

### Actions:
1. [Groq Console](https://console.groq.com) → Regenerate `GROQ_API_KEY`
2. [Google AI Studio](https://aistudio.google.com) → Regenerate `GEMINI_API_KEY`
3. [OpenRouter](https://openrouter.ai) → Regenerate `OPENROUTER_API_KEY`

---

## 8. WALT.ID ISSUER JWK — MEDIUM PRIORITY

**Why:** Private key for issuing verifiable credentials.

### Actions:
1. Generate a new P-256 EC key pair
2. Update `WALT_ISSUER_JWK` in Cloudflare Worker secrets (`npx wrangler secret put WALT_ISSUER_JWK`)
3. Update the public DID document at `public/.well-known/did.json`

---

## 9. MFA ENCRYPTION KEY — MEDIUM PRIORITY

**Why:** Encrypts MFA secrets. If rotated, all existing MFA setups break.

### Actions:
1. Generate new key: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
2. **CAUTION:** This invalidates all existing MFA. Only rotate if you suspect compromise.
3. Update in Cloudflare Worker secrets (`npx wrangler secret put MFA_ENCRYPTION_KEY`)

---

## 10. VEREMARK WEBHOOK SECRET — LOW PRIORITY

### Actions:
1. Generate new secret
2. Update `VEREMARK_WEBHOOK_SECRET` in Cloudflare Worker secrets (`npx wrangler secret put VEREMARK_WEBHOOK_SECRET`)
3. Update webhook URL in Veremark dashboard if needed

---

## Post-Rotation Checklist

- [ ] All old keys deleted from services
- [ ] `.env.local` on your machine updated with ALL new keys
- [ ] `.env.local` on any team members' machines updated
- [ ] CI/CD secrets updated (GitHub Actions, Cloudflare Pages, etc.)
- [ ] Cloudflare Worker secrets updated (`npx wrangler secret put`)
- [ ] Firebase secrets updated (if using Firebase functions)
- [ ] Git history still contains old keys — that's unavoidable. The keys are dead now.
- [ ] Run `test-env-keys.js` to verify new keys work

---

## Verification Commands

```bash
# Test Cloudflare Worker setup
node test-env-keys.js

# Test Resend
curl -H "Authorization: Bearer $RESEND_API_KEY" https://api.resend.com/emails?limit=1

# Test Auth0
curl https://$VITE_AUTH0_DOMAIN/.well-known/openid-configuration

# Deploy updated Worker
cd worker && npx wrangler deploy
```

---

## Incident Response

1. **Document the timeline** — when did you first notice the spam?
2. **Check Resend logs** — how many emails were sent? To whom?
3. **Check Cloudflare Worker logs** — any unauthorized data access?
4. **Notify affected users** if PII was accessed (GDPR requirement)
5. **Enable 2FA** on all service accounts (Resend, Auth0, Stripe, Cloudflare)
6. **Review access logs** on all platforms for the past 30 days

---

*Last updated: 2026-07-02*
