# 30-Step Implementation Todo List

## Phase 1: Subdomain Architecture (Steps 1-8)

1. ✅ Update vercel.json with subdomain routing rules
2. ✅ Create pathways.pilotrecognition.com subdomain routing
3. ✅ Move /framework/full to enterprise.pilotrecognition.com
4. ✅ Add DNS CNAME records for all subdomains (see DNS_SETUP_GUIDE.md)
5. ⬜ Verify SSL certificate provisioning on Vercel
6. ⬜ Test subdomain routing in development
7. ✅ Update sitemap.xml with subdomain URLs
8. ⬜ Submit updated sitemap to Google Search Console

## Phase 2: Enterprise Portal (Steps 9-14)

9. ✅ Create enterprise.pilotrecognition.com landing page
10. ✅ Add airline dashboard mockup (pull API preview)
11. ✅ Add manufacturer portal section (Airbus/Boeing)
12. ✅ Add analytics/reports page for enterprise users
13. ✅ Create enterprise pricing page ($1,000/month tier)
14. ✅ Add "Request Demo" form for airlines

## Phase 3: Pathways Subdomain (Steps 15-20)

15. ✅ Move PathwaysPageModern to pathways.pilotrecognition.com root
16. ✅ Create pathways category pages (/cargo, /charter, /corporate)
17. ✅ Add pathway filtering by location/requirements
18. ✅ Implement pathway search functionality
19. ✅ Add "Save Pathway" feature for logged-in pilots
20. ✅ Create pathway comparison tool (compare 2-3 pathways)

## Phase 4: Framework Migration (Steps 21-26)

21. ✅ Migrate /framework/full to enterprise subdomain
22. ✅ Update all internal links pointing to /framework/full
23. ✅ Add 301 redirect from old URL to new subdomain
24. ✅ Update Universal Commercial Framework to v11.0
25. ✅ Add "Download PDF" button for enterprise users
26. ✅ Create framework summary page for pilots (simplified)

## Phase 5: Integration & Testing (Steps 27-30)

27. ⬜ Test cross-subdomain authentication (shared login) — see TESTING_GUIDE.md
28. ⬜ Verify analytics tracking across all subdomains — see TESTING_GUIDE.md
29. ⬜ Update email templates with correct subdomain URLs — see EMAIL_TEMPLATES.md
30. ⬜ Deploy to production and monitor for 48 hours — see DEPLOYMENT_CHECKLIST.md

## Phase 6: Referral & Revenue Infrastructure (Steps 31-42)

### Referral / Invite Code System
31. ✅ Add `referral_code` column to `profiles` + auto-generate trigger on insert (backfilled all existing pilots)
32. ✅ Add `referred_by_code`, `referred_by_profile_id`, `referral_earnings` to `profiles`
33. ✅ Create `/ref/:code` landing page — validates code, stores `pr_ref` cookie (30-day), shows referrer name + $20 dividend explanation, redirects to signup
34. ✅ Register `/ref/:code` route in `AppRoutes.tsx`
35. ✅ Wire referral attribution into `AuthContext.tsx` signup flow — reads cookie on new profile insert, writes `referred_by_*`, upserts `referral_conversions`
36. ✅ Fix `PilotReferralShare.tsx` — live stats from `referral_conversions` + `referral_partners` (was hardcoded 0)

### Payment → Commission Pipeline
37. ✅ Deploy `stripe-webhook` edge function — listens for `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`
38. ✅ `checkout.session.completed` → marks pilot `is_recognition_plus = true`, credits $20 dividend to referrer
39. ✅ Create `referral_dividend_ledger` table — immutable audit trail of every $20 dividend (status: pending → eligible → paid)
40. ✅ Add `is_recognition_plus`, `stripe_customer_id`, `recognition_plus_started_at/ended_at` to `profiles`
41. ✅ Update `stripe-checkout` function — attaches `pilot_id` in session metadata so webhook resolves pilot reliably

### ATO 5% Issuance Fee
42. ✅ Create `issuance_fee_transactions` table — `platform_fee_amount` auto-computed as 5% of `issuance_fee_charged` via Postgres generated column
43. ✅ Create `ato_platform_invoices` table — monthly rolled-up fee invoices per ATO enterprise account
44. ✅ Deploy `ato-issuance-fee` edge function — POST records a countersign session fee, GET returns ATO fee summary
45. ⬜ Register `STRIPE_WEBHOOK_SECRET` in Supabase project secrets (manual — requires Stripe Dashboard)
46. ⬜ Register webhook URL in Stripe Dashboard: `https://gkbhgrozrzhalnjherfu.supabase.co/functions/v1/stripe-webhook` (events: `checkout.session.completed`, `invoice.paid`, `customer.subscription.deleted`)

---

## Critical Path for September Deadline

**Week 1-2 (May 13-27):**

- Steps 1-8: Infrastructure & routing
- Steps 9-14: Enterprise portal MVP

**Week 3-4 (May 28 - June 10):**

- Steps 15-20: Pathways subdomain
- Steps 21-26: Framework migration

**Week 5-6 (June 11-24):**

- Steps 27-30: Testing & deployment
- Bug fixes and optimization

---

## Current Status

- ✅ Subdomain routing configured
- 🔄 DNS pending
- ⬜ 28 steps remaining
