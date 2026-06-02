# PilotRecognition Enterprise Operator Agreement
## B2B Subscription Terms & Revenue Share Structure

**Effective Date:** June 2026  
**Platform:** PilotRecognition.com / pilotterminal.com  
**Operator Types Covered:** Flight Academy / ATO, Charter / Private Aviation, Commercial Airline, Aircraft Leasing / Asset Management, Cargo / Specialized Operations

---

## 1. Subscription Tiers

### 1.1 Enterprise Seat — $1,000 USD per year
- **Full platform access** to the Verified Pilot Recognition Database
- **Pull API** — real-time profile retrieval with advanced filtering
- **Unlimited profile pulls** (fair use: up to 10,000 requests/month)
- **EBT Video Scoring access** — view recorded behavioral interviews
- **Enterprise dashboard** — filtering by hours, ratings, medical status, language proficiency, recognition score
- **Priority support** — 48-hour response SLA

### 1.2 Free Tier (Pathway Posting Only)
- Post public pathway cards at no cost
- View pilot profiles in limited preview mode
- No Pull API access
- No EBT video access

---

## 2. The Operator Dual-Nature Model (ATO-Specific)

### 2.1 As Operator (Inbound)
You may:
- Post instructor and operational pathway cards
- Pull verified CFIs, Check Airmen, and high-hour pilots from the database
- Filter by: total hours, type ratings, medical class, ICAO English level, recognition score
- Access full pilot profiles including Veremark verification status

### 2.2 As Validator (Outbound Revenue)
If you are an ATO or flight school with training records:
- Pilots independently select their own verification provider based on regional availability and pay them directly
- When an alumni verification is processed through your connected training records, you may earn a time-limited **Activation Credit**
- Credit value is provider-dependent and calculated as a percentage of the verification fee paid by the pilot
- Credits must be claimed within 5 business days and auto-apply as a discount on your next Enterprise renewal
- High-volume ATOs can significantly offset or fully recoup their annual subscription through verification credits

**Example:** An ATO with 200 alumni verifications/year earning an average of $5 credit per verification would accumulate **$1,000** in credits — effectively a free year.

---

## 3. Pull API Usage Terms

### 3.1 Authorized Use
- Pull API may only be used for legitimate recruitment and crew management purposes
- Data retrieved via Pull API **must not** be resold, republished, or transferred to third parties
- Each pull must be logged in the `user_activity_log` for audit compliance

### 3.2 Rate Limits
- **200 requests per hour** per enterprise account
- **15-minute idle session timeout**
- Excessive usage may trigger automated throttling or account review

### 3.3 Data Privacy
- PII returned: `full_name` and `license_number` only (for enterprise members or admins)
- All other data is anonymized or scored (Recognition Score, hours buckets, verification status)
- You agree to comply with GDPR / applicable data protection laws for any pilot data pulled

---

## 4. Revenue Share & Success Fees

### 4.1 Verification Provider & Activation Credits
- Pilots independently select and pay their own verification provider based on regional availability (e.g., Veremark, First Advantage, HireRight, or local CAAP-equivalent authorities)
- If you are an ATO or flight school with training records, you may earn a time-limited **Activation Credit** when an alumni verification is processed
- Credit value and eligibility depend on the pilot's selected provider and your Enterprise subscription status
- Credits expire after 5 business days if your Enterprise subscription is not active at the time of claim
- If credit lapses, the amount reverts to the platform

### 4.2 Success Fee — Pilot Hired via Pathway
- **$500 USD** per pilot successfully hired through a posted pathway
- Billed monthly based on `pathway_card_interests` conversions tracked in-platform
- Invoice issued within 5 business days of month-end
- Payment terms: Net 15 days via Stripe or USDC (Solana)

### 4.3 Enterprise Seat Proration
- First month prorated based on signup date
- Annual billing preferred; monthly billing available at $95/month (14% premium)
- No refunds after 14 days; credit applied toward future subscription only

---

## 5. Data & Compliance

### 5.1 Pilot-Owned Data Model
- Pilots control who sees their data through the Recognition Profile privacy settings
- You may only pull profiles where the pilot has opted into enterprise visibility
- Pilots may revoke visibility at any time; previously pulled data must be deleted within 30 days

### 5.2 Verification Wallet Integration
- Verified credentials (license, medical, NTC, ELP) are issued as W3C Verifiable Credentials
- Terminal 3 (green) status = all credentials verified and current
- Terminal 2 (amber) = suspended or unverified
- Terminal 1 (red) = revoked or expired
- You agree to honor credential status at time of pull; stale data is your responsibility to refresh

### 5.3 Audit Trail
- Every Pull API request is logged with: timestamp, operator ID, filter criteria, result count
- Logs retained for 12 months per `purge_expired_logs()` retention policy
- You may request an export of your activity log at any time

---

## 6. Term & Termination

### 6.1 Term
- Minimum term: 12 months (annual billing)
- Auto-renews unless cancelled 30 days prior to renewal date
- Monthly subscribers: cancel anytime, effective end of current billing period

### 6.2 Termination for Cause
- PilotRecognition may suspend or terminate access for:
  - Unauthorized data resale or scraping
  - Repeated API rate limit violations
  - Failure to pay invoices within 30 days of due date
  - Misrepresentation of pathway requirements or hiring outcomes

### 6.3 Post-Termination
- API keys revoked within 24 hours
- Previously pulled pilot data must be deleted within 30 days
- Success fees owed for hires made during active term remain due

---

## 7. Service Level Commitments

| Metric | Commitment |
|--------|------------|
| Pull API uptime | 99.5% monthly |
| Dashboard response | < 2 seconds (p95) |
| Support response | 48 hours (Enterprise) |
| New pathway card publish | Immediate |
| Verification status refresh | Real-time via webhook |

---

## 8. Free Beta Period (Optional)

- New operators may request a **30-day free beta** with full Enterprise access
- No credit card required for beta
- Beta accounts are manually approved via `UPDATE profiles SET account_tier = 'enterprise'`
- Beta operators are eligible for Activation Credits but not obligated to subscribe

---

## 9. Governing Law & Disputes

- Governing law: United Arab Emirates (UAE) — Dubai International Financial Centre (DIFC)
- Disputes: mediation first, then DIFC-LCIA arbitration
- All fees quoted in USD; local currency conversion at Stripe's daily rate

---

## 10. Signature

By activating an Enterprise Seat or using the Pull API, you agree to these terms.

**Operator:** _________________________  
**Date:** _________________________  
**PilotRecognition Authorized Representative:** Benjamin T. Bowler, Founder  
**Platform Contact:** enterprise@pilotrecognition.com

---

*Document Version: 1.0 — June 2026*  
*Next Review: September 2026 (post-launch audit)*
