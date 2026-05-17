# Pillar 5 — ATO Network Runbook

**Version:** 1.1
**Last Updated:** May 17, 2026
**Status:** Production-ready (core flow)
**Legal Position:** Verified identity, attested hours — platform verifies regulatory credentials and background checks; ATOs attest to training hours

---

## 0. Legal Position: Verified Identity, Attested Hours

**PilotRecognition verifies credentials. ATOs attest to hours.**

- We **independently verify** pilot regulatory credentials, medical certificates, and background checks through international partners.
- We **do not** independently verify training hours — the ATO (flight school) attests to these.
- The **ATO** is solely responsible for the accuracy of hour attestations.
- Airlines get pre-verified pilots (license, medical, background) PLUS ATO-attested hours.
- All credentials, badges, and API responses include a disclaimer distinguishing platform verification from ATO attestation.

---

## 1. Overview

Pillar 5 connects Flight Training Organizations (ATOs / Flight Schools) with the PilotRecognition platform via a three-tier subscription model:

| Tier | Price | Features |
|------|-------|----------|
| **Basic** (Free) | $0 | Attestation requests, token read-only, limited graduate visibility |
| **Operator** | $1,000/yr | Graduate tracking, placement rate calculator, CSV bulk import, credential issuance, airline contact visibility. Platform keeps $500/placed success fee. |

---

## 2. End-to-End Flow

### A. ATO Onboarding
1. ATO admin visits `/ato-register` and submits institution details.
2. On submission, `ato_institutions` row created with `tier = 'basic'`.
3. If upgrading, admin clicks **Upgrade** in dashboard → Stripe checkout → `ato-stripe-checkout` edge function.
4. Webhook (`api/stripe/webhook.ts`) updates `stripe_subscription_id`, `tier`, and `subscription_status` on payment.

### B. Pilot → ATO Attestation Request
1. Pilot navigates to **Profile → ATO Attestation**.
2. Clicks **Request Attestation** → selects ATO from dropdown.
3. Enters claimed hours, PIC, period, optional message.
4. Submit inserts into `ato_verification_requests` (`status = 'pending'`).
5. `ato-notification` edge function emails ATO admin via Resend.

### C. ATO Responds
1. ATO admin opens dashboard → **Verification Requests** tab.
2. Clicks **Respond** → chooses Confirm / Amend / Reject.
3. On **Confirm**: `profiles.total_flight_hours` auto-updated + logged to `user_activity_log`.
4. On **Amend**: pilot sees Accept/Reject buttons in their profile.
5. On **Reject**: pilot can **File Appeal** with additional documentation.

### D. Enterprise Token Issuance
1. Only visible if `verified_issuer = true`.
2. Admin fills pilot ID, token type, label, hours, graduation date, ratings.
3. On issue, SHA-256 hash of payload stored in `signature_hash`.
4. **Verify** button opens public endpoint:
   `https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/verify-token?tokenId={id}`
5. Endpoint returns validity, integrity check, ATO details, pilot summary — **plus a disclaimer**.

### E. Graduate Tracking (Analytics+)
1. **Graduates** tab shows all pilots who made attestation requests.
2. **CSV Bulk Import**: drag CSV (`name,email`) → send invite emails.
3. **Placement Rate Calculator**: input placed count → auto-calculates %.

### F. Payouts
1. **Request Payout** button appears when `referral_dividend_balance_usd > 0`.
2. Opens mailto to `support@pilotrecognition.com` with institution details.

---

## 3. Database Tables

| Table | Purpose |
|-------|---------|
| `ato_institutions` | ATO profiles, subscription status, tier |
| `ato_verification_requests` | Pilot requests for ATO attestation |
| `ato_issued_tokens` | Tamper-proof credentials issued by ATOs (not by platform) |
| `ato_platform_invoices` | Stripe billing records |
| `ato_campuses` | Campus locations under parent ATO |
| `user_activity_log` | Audit trail for all attestation actions |

---

## 4. Edge Functions

| Function | Purpose | JWT |
|----------|---------|-----|
| `ato-stripe-checkout` | Create Stripe checkout for ATO upgrade | Yes |
| `ato-stripe-cancel` | Cancel ATO subscription | Yes |
| `ato-notification` | Email ATO admin on new request | Yes |
| `verify-token` | Public token verification + disclaimer | **No** |

---

## 5. Webhook Handler

**File:** `api/stripe/webhook.ts`

Routes ATO subscriptions via `session.metadata.ato_institution_id`:
- `checkout.session.completed` → activate subscription
- `invoice.payment_succeeded` → log to `ato_platform_invoices`
- `invoice.payment_failed` → set `status = 'suspended'`
- `customer.subscription.deleted` → set `status = 'cancelled'`

---

## 6. Revenue Model

| Source | Amount | Who Pays | Trigger |
|--------|--------|----------|---------|
| Operator subscription | $1,000/yr | Flight school / ATO | Upgrades from Basic |
| Operator subscription | $1,000/yr | Airline / operator | Upgrades from Basic |
| Success fee | $500 per hire | Airline (billed by PilotRecognition) | Pilot placed through platform — **kept by PilotRecognition** |
| Ecosystem dividend | ~$20 per activated graduate | PilotRecognition pays ATO | Graduate joins platform |

---

## 7. Known Limitations & Deferred Items

| Item | Status | Note |
|------|--------|------|
| QR code generation | Done | External QR API on every token row |
| Co-branded PDF credential | Done | Printable credential card with print CSS |
| CRM webhooks | Deferred | Needs webhook config UI |
| Placement rate history | Deferred | Needs time-series table |
| Pathway alignment score | Deferred | Needs curriculum keyword analysis |
| ATO payout ledger | Deferred | `referral_dividend_ledger` needs `ato_id` column |

---

## 8. Quick Commands

### Deploy Edge Functions
```bash
supabase functions deploy ato-stripe-checkout
supabase functions deploy ato-stripe-cancel
supabase functions deploy ato-notification
supabase functions deploy verify-token
```

### Test Token Verification
```bash
curl "https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/verify-token?tokenId=YOUR_TOKEN_ID"
```

---

## 9. Liability Checklist

- [x] Pilot modal: "PilotRecognition verifies regulatory credentials and background checks. Training hours are attested by your ATO."
- [x] ATO dashboard: "PilotRecognition verifies pilot regulatory credentials and background checks internationally. You attest to training hours — accuracy is your responsibility."
- [x] Credential card: "Training hours attested by [ATO]. PilotRecognition verifies regulatory credentials and background checks internationally."
- [x] API response: Disclaimer distinguishes platform verification (regulatory, medical, background) from ATO attestation (hours)
- [x] Badges say "Attested" for hours, "Verified" for regulatory credentials
- [x] Runbook documents verified identity + attested hours legal position

---

## 10. Contacts

- **Technical:** Platform team
- **Billing:** Stripe dashboard + `ato_platform_invoices`
- **Support:** `support@pilotrecognition.com`
