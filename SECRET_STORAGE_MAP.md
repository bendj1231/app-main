# 🔑 Where to Store Your Keys — Complete Map

## The Golden Rule

**NEVER commit real keys to Git. EVER.** Use the right storage for each environment.

---

## Quick Reference Table

| Key Type | Local Dev | Cloudflare Workers | GitHub Actions | Cloudflare Pages |
|---|---|---|---|---|
| **Resend API Key** | `.env.local` | `wrangler secret put RESEND_API_KEY` | ❌ No | ❌ No |
| **Auth0 Client ID** | `.env.local` | `[vars]` in `wrangler.toml` | `secrets.*` | ❌ No (build-time env vars) |
| **Auth0 Client Secret** | `.env.local` | `wrangler secret put` | ❌ No | ❌ No |
| **Stripe Secret Key** | `.env.local` | `wrangler secret put` | ❌ No | ❌ No |
| **Stripe Publishable** | `.env.local` | ❌ No (public) | `secrets.*` | ❌ No (build-time env vars) |
| **Cloudflare API Token** | ❌ No | ❌ No (use `wrangler login`) | `secrets.CLOUDFLARE_API_TOKEN` | ❌ No |
| **Dodo API Key** | `.env.local` | `wrangler secret put` | ❌ No | ❌ No |
| **OpenRouter API Key** | `.env.local` | `wrangler secret put OPENROUTER_API_KEY` | ❌ No | ❌ No |
| **Walt.id JWK** | ❌ No | `wrangler secret put` | ❌ No | ❌ No |
| **MFA Encryption Key** | ❌ No | `wrangler secret put MFA_ENCRYPTION_KEY` | ❌ No | ❌ No |
| **Email API Secret** | ❌ No | `wrangler secret put EMAIL_API_SECRET` | ❌ No | ❌ No |
| **Veremark Webhook** | `.env.local` | `wrangler secret put` | ❌ No | ❌ No |

---

## How to Set Each One

### 1. Local Development (`.env.local`)

Create this file in your project root. It is already in `.gitignore` (never commit it).

```bash
# Worker API endpoints (public — safe for frontend)
VITE_PILOT_API_URL=https://pilotrecognition-api.benjamintigerbowler.workers.dev
VITE_PLATFORM_API_URL=https://platform-api.benjamintigerbowler.workers.dev

# Auth0 (public config)
VITE_AUTH0_DOMAIN=dev-ir828tguibp1dh5f.eu.auth0.com
VITE_AUTH0_CLIENT_ID=your_rotated_client_id_here
VITE_AUTH0_AUDIENCE=https://dev-ir828tguibp1dh5f.eu.auth0.com/api/v2/

# Stripe (public key only)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here

# Server-side secrets (NEVER expose to frontend)
RESEND_API_KEY=your_rotated_resend_key_here
STRIPE_SECRET_KEY=sk_test_your_rotated_key_here
CLOUDFLARE_API_TOKEN=your_token_here
DODO_API_KEY=your_dodo_key_here
OPENROUTER_API_KEY=your_openrouter_key_here
VEREMARK_WEBHOOK_SECRET=your_veremark_secret_here
MFA_ENCRYPTION_KEY=your_mfa_key_here
```

### 2. Cloudflare Worker Secrets

All backend logic runs in Cloudflare Workers. Set encrypted secrets via Wrangler:

**Pilot Worker (`pilotrecognition-api`):**
```bash
cd worker
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put EMAIL_API_SECRET
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put MFA_ENCRYPTION_KEY
npx wrangler secret put STRIPE_SECRET_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET
```

**Platform Worker (`platform-api`):**
```bash
cd cloudflare
npx wrangler secret put RESEND_API_KEY
npx wrangler secret put DODO_API_KEY
npx wrangler secret put VEREMARK_WEBHOOK_SECRET
npx wrangler secret put CLOUDINARY_API_SECRET
npx wrangler secret put CLOUDFLARE_R2_SECRET_ACCESS_KEY
```

### 3. GitHub Actions Secrets

Go to: https://github.com/bendj1231/app-main/settings/secrets/actions

Add or update these repository secrets:

| Secret Name | What It Is |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Deploy Workers, manage D1/R2, deploy Pages |
| `CLOUDFLARE_ACCOUNT_ID` | Your Cloudflare account |
| `CLOUDFLARE_PAGES_STAGING_PROJECT` | Cloudflare Pages staging project name |
| `CLOUDFLARE_PAGES_PRODUCTION_PROJECT` | Cloudflare Pages production project name |
| `SNYK_TOKEN` | Security scanning |
| `SLACK_WEBHOOK_URL` | Deployment notifications |
| `TEST_EMAIL` | CI test account |
| `TEST_PASSWORD` | CI test account password |

**DO NOT** add `RESEND_API_KEY`, `STRIPE_SECRET_KEY`, or Worker API secrets to GitHub Actions unless a specific workflow absolutely needs them. Cloudflare Pages build-time variables should only contain public, browser-safe values.

### 4. Cloudflare Pages Environment Variables

Your frontend deploys to Cloudflare Pages. Public variables are injected at build time and are safe to expose to the browser:

Go to: https://dash.cloudflare.com → Pages → Your Project → Settings → Environment Variables

Add to both **Production** and **Preview** environments:
- `VITE_PILOT_API_URL`
- `VITE_PLATFORM_API_URL`
- `VITE_AUTH0_DOMAIN`
- `VITE_AUTH0_CLIENT_ID`
- `VITE_AUTH0_AUDIENCE`
- `VITE_STRIPE_PUBLISHABLE_KEY`

**DO NOT** add any `SECRET`, `SERVICE_ROLE`, or `API_KEY` variables here. Cloudflare Pages build-time variables are embedded in the client bundle.

---

## What I Already Fixed

| File | Before | After |
|---|---|---|
| `worker/src/index.ts` | Open email relay accepting any client key | Requires `EMAIL_API_SECRET` worker secret |
| `.env.example` | Real keys committed | Placeholder text |

---

## After You Rotate: Update Checklist

- [ ] `.env.local` on your machine → ALL new keys
- [ ] Cloudflare Worker secrets (`wrangler secret put`) → Resend, Email API Secret, Dodo, OpenRouter, MFA, Stripe, Veremark
- [ ] GitHub Actions secrets → Cloudflare token, Pages project names
- [ ] Cloudflare Pages env vars → Worker API URLs, Auth0 client ID, Stripe publishable
- [ ] Deploy patched Workers: `cd worker && npx wrangler deploy` and `cd cloudflare && npx wrangler deploy`
- [ ] Run `node test-env-keys.js` to verify
- [ ] Delete the old keys from all services (Resend, Auth0, Stripe)
