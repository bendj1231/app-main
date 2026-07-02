# 🔐 Security Hardening — MFA + Monitoring + Rotation

## Step 1: Enable MFA on Every Account (Do This Now)

| Service | Where to Enable MFA | Link |
|---|---|---|
| **Cloudflare** | My Profile → Authentication → Two-Factor Authentication | https://dash.cloudflare.com/profile |
| **Auth0** | User Profile → MFA | https://manage.auth0.com/dashboard |
| **Stripe** | Account Settings → Security → Two-Factor Authentication | https://dashboard.stripe.com/settings/security |
| **Resend** | Account Settings → Security | https://resend.com/settings |
| **GitHub** (this repo) | Settings → Password and Authentication → Enable 2FA | https://github.com/settings/security |
| **Cloudflare Pages** | Cloudflare Dashboard → Account Settings → Two-Factor Authentication | https://dash.cloudflare.com/profile |

### Recommended: Use an Authenticator App
- Google Authenticator, Authy, or 1Password
- **NOT SMS** (SIM swapping attacks)
- Save backup codes in a password manager

---

## Step 2: Set Up Monitoring (Weekly Checks)

### A. Resend Monitoring — Check for Unauthorized Sends

```bash
# Run this weekly
curl -s -H "Authorization: Bearer $RESEND_API_KEY" \
  https://api.resend.com/emails?limit=100 | \
  jq '.data[] | {to: .to, subject: .subject, created_at: .created_at}'
```

**Look for:**
- "Order Update" subjects (the spam pattern)
- Bulk sends to Yahoo addresses
- Sends at odd hours you didn't initiate
- Unknown `from` addresses

**If you see unauthorized sends:**
1. Immediately rotate Resend key
2. Check if the Worker was bypassed
3. Review Cloudflare Worker logs

### B. Cloudflare D1 & Worker Monitoring

**D1 Database Access:**
1. https://dash.cloudflare.com → Workers & Pages → D1
2. Review query logs for unusual patterns
3. Check for unauthorized access to `profiles`, `payments`, `pilot_credentials`

**Worker Logs:**
1. https://dash.cloudflare.com → Workers & Pages → Your Worker → Logs
2. Filter for errors and high-volume requests
3. Check `CF-Connecting-IP` for unusual geographies

**Red flags:**
- Direct D1 queries from outside Worker runtime
- Bulk SELECTs on sensitive tables without authorization
- Requests at 3 AM from a country you don't operate in
- Admin operations you didn't trigger

### C. Cloudflare Worker Monitoring

```bash
# Check Worker logs for the email endpoint
cd worker
npx wrangler tail --name pilotrecognition-api
```

**Look for:**
- `/api/email/send` requests without `X-Email-Secret`
- Unusual `CF-Connecting-IP` addresses
- High volume of email sends
- Requests with forged `Origin` headers

### D. Stripe Monitoring

1. https://dashboard.stripe.com/test/events
2. Filter for: `customer.created`, `charge.succeeded`, `refund.created`
3. Check for transactions you didn't initiate

---

## Step 3: Automated Key Rotation Reminders

### Add This to Your Calendar (Repeating Every 90 Days)

```
Title: 🔐 Rotate API Keys
Description: Rotate these keys:
- Resend API Key
- Stripe Secret Key
- Cloudflare API Token
- Auth0 Client Secret
- Dodo API Key
- OpenRouter API Key
- Veremark Webhook Secret
- MFA Encryption Key

Steps:
1. Generate new key in service dashboard
2. Update wrangler secrets: npx wrangler secret put <KEY_NAME>
3. Update .env.local
4. Test with: node test-env-keys.js
5. Delete old key from service dashboard
```

### GitHub Action: Monthly Security Audit

```yaml
# .github/workflows/security-audit.yml
name: Monthly Security Audit
on:
  schedule:
    - cron: '0 9 1 * *'  # First of every month at 9 AM UTC
  workflow_dispatch:

jobs:
  audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
      - run: npm ci
      - name: Check for hardcoded secrets
        run: |
          # Scan for common secret patterns
          if grep -rE "(eyJhbGciOiJIUzI1Ni|sk_live_|sk_test_|re_[A-Za-z0-9]{20,})" \
             --include="*.ts" --include="*.tsx" --include="*.js" \
             --exclude-dir=node_modules .; then
            echo "❌ Potential secrets found in code!"
            exit 1
          fi
          echo "✅ No hardcoded secrets detected"
      - name: Check .env.example has no real keys
        run: |
          if grep -E "(eyJ[a-zA-Z0-9_-]{20,}\.[a-zA-Z0-9_-]{20,}|sk_live_|sk_test_|re_[A-Za-z0-9]{20,})" .env.example; then
            echo "❌ Real keys found in .env.example!"
            exit 1
          fi
          echo "✅ .env.example is clean"
      - name: Run npm audit
        run: npm audit --audit-level=moderate || true
```

---

## Step 4: Immediate Actions (Do These Now)

### Before You Leave Today

- [ ] **Rotate Resend key** → https://resend.com/settings/api-keys
- [ ] **Deploy patched Workers** → `cd worker && npx wrangler deploy` and `cd cloudflare && npx wrangler deploy`
- [ ] **Enable MFA** on Cloudflare, Auth0, Stripe, Resend, GitHub
- [ ] **Save backup codes** in password manager
- [ ] **Delete old keys** from all services (don't just disable — delete)

### This Week

- [ ] Set up the monthly security audit GitHub Action
- [ ] Add calendar reminder for 90-day key rotation
- [ ] Check Resend logs for the past 30 days
- [ ] Check Cloudflare Worker logs for unauthorized access
- [ ] Review GitHub repository access (Settings → Manage Access)
- [ ] Enable branch protection on `main` (require PR reviews)

---

## Emergency Contacts

If you suspect ongoing compromise:

| Service | Support / Security |
|---|---|
| Resend | security@resend.com |
| Cloudflare | support@cloudflare.com |
| Stripe | support@stripe.com |
| Auth0 | support@auth0.com |

---

*Created: 2026-07-02 | Next review: 2026-10-02 (90 days)*
