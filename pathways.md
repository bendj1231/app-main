# Pathways — Business Model, Tax Compliance & Ecosystem

> Last updated: June 25, 2026
> This document covers the tax, compliance, pricing, and ecosystem architecture for the Pilot Recognition+ platform.

---

## 1. Tax Compliance: Mauritius → Philippines

### Mauritius Business, Philippine Customers

Your company is registered in **Mauritius** and sells digital verification services to customers in the **Philippines**.

### Key Principle: No Double VAT

Because your service is an **export** from Mauritius (consumed abroad), Mauritius VAT is **0%** (Zero-Rated Export). The customer in the Philippines pays the **destination country's VAT**.

| Scenario | Mauritius VAT | Philippine VAT | Total |
|----------|-------------|----------------|-------|
| B2C Individual (tax-exclusive) | 0% | +12% | $100 + $12 = $112 |
| B2B Corporate (reverse charge) | 0% | 0% (on your invoice) | $100 |
| Under PHP 3M threshold (any) | 0% | 0% | $100 |

### Dodo Payments as Merchant of Record (MoR)

Dodo Payments handles all tax calculations, collections, and compliance automatically:

- **Tax-Exclusive Pricing**: $100 base → customer pays $112 (PH customer)
- **Tax-Inclusive Pricing**: Customer always sees $120, Dodo carves out tax from your net
- **Proforma invoicing**: Automated for enterprise procurement
- **B2B Tax ID validation**: Validates Philippine TIN, applies reverse charge
- **Final tax invoices**: Auto-generated PDF with correct cross-border line items

### Philippines VAT Threshold

You only need to register with the Philippine **BIR** if your **gross annual Philippine sales exceed PHP 3 million (~$51,000 USD)**.

Below that threshold: no Philippine registration required. Dodo still handles the tax for you.

### Invoice Layout Example

```
INVOICE FROM: Mauritius Tech Corp Ltd.
INVOICE TO  : Customer Name (Manila, Philippines)
============================================================
Item: Internet Verification Platform Access ....... $100.00

Mauritius VAT (Exported Service - 0% Rate) ........ $  0.00
Philippine VAT (Destination Consumption Tax) ...... $ 12.00*
------------------------------------------------------------
TOTAL AMOUNT DUE:                                   $112.00
============================================================
*Note: If B2B corporate client, Philippine VAT line is $0.00
and marked "Subject to local PH Reverse Charge."
```

---

## 2. Platform Value Proposition

### Why Airlines & Operators Pay

A single bad pilot hire can cost an airline **millions** in lawsuits, groundings, and brand damage.

Your platform provides:
- **Instant verified logbook ledger** — ATOs, operators, airlines dual-sign flight hours
- **Real-time license validation** — Medical, type rating, license recurrency status
- **Unified safety reports** — NTSB, CAA, ATO incident data in one profile
- **AI career pathway matching** — Pilots matched to airline expectations before applying
- **Zero-trace verification** — Airlines see "verified" status without hosting sensitive PDFs

### Verified vs Unverified

| Metric | Free Account | Verified Account |
|--------|-----------|----------------|
| Flight hours | Self-claimed | ATO/Operator signed |
| License status | Self-reported | CAA-validated |
| Medical expiry | Manual entry | Auto-tracked |
| Type rating recurrency | None | Annual verification |
| Pathway eligibility | Can submit (claim) | Priority matching |
| Employer visibility | Basic | Full verified ledger |

---

## 3. The $120 Pricing Architecture

### Financial Breakdown

**Customer pays:** $120 + 12% Philippine VAT = **$134.40 total**

**Platform receives:** $120 (tax-exclusive net)

```
$120 Net Revenue
    ├── $20.00  → Referral bounty (one-time, to scout/ATO/employee)
    ├── $10.00  → Annual verification fee (to ATO/Operator/Airline)
    ├── $13.50  → Payment processor / MoR fee (~15% of remaining $90)
    └── $76.50  → True platform margin
```

### Why $120?

The price is engineered to cover CAC (customer acquisition cost) and data upkeep while leaving a healthy margin:

- **$20 Referral Fee**: Paid to whoever brings the pilot onto the platform — employee, independent scout, ATO recruiter, or airline HR rep
- **$10 Verification Fee**: Paid to the institution that physically checks the logbook and validates the license/medical recurrency
- **~$13.50 Processor Fee**: Dodo Payments / Merchant of Record processing cost (~15% of net)
- **~$76.50 True Platform Margin**: Funds system architecture, security, team, and profit

### The Incentive Flow

```
[Pilot pays $120/year] ───► [Platform Dashboard]
                              │
                              ├──► ($20 One-Time) ──► To the Referrer
                              │
                              └──► ($10/Yearly) ────► To the Verifier (ATO/Airline/Type Center)
```

### Partner Economics

| Partner Type | Action Taken | Financial Reward | Ultimate Benefit to Platform |
|-------------|-------------|-------------------|------------------------------|
| Independent Scout / Employee | Onboards a new pilot profile | $20.00 cash bonus | Drastically lowers organic marketing costs |
| ATO / Flight Academy | Verifies logbook hours for alumni | $10.00 per pilot / year | Guarantees authentic data straight from the source |
| Type Rating Center / CAA | Confirms checkride/medical validity | $10.00 per pilot / year | Automates flagging of expired or pending licenses |
| Airline / Operator | Validates employment hours | $10.00 per pilot / year | Keeps employed pilots continuously compliant |

### ATO Math Example

An ATO with 500 alumni:
- **Sourcing Phase**: 500 pilots × $20 referral = **$10,000 upfront**
- **Yearly Maintenance**: 500 pilots × $10 verification = **$5,000/year** passive recurring revenue

An airline with 300 active pilots:
- **Yearly Verification Incentive**: 300 × $10 = **$3,000/year**
- Airlines get paid to ensure their own pilots are 100% compliant — instead of paying background screening companies

### Scalability Note

As demand scales from major international airlines, raise the platform price to $150 or $200/year. This allows scaling verification incentives to $20 or $30, making it an even more undeniable financial proposition for global airline networks.

---

## 4. The Verification Credit Token Economy

### Concept: Audit Credits as Platform Currency

You are building a **closed-loop digital utility currency** designed specifically for aviation compliance. Each pilot who pays $120 holds **1 Audit Credit** in their account — a token your system continuously monitors.

The token is the key to automating the entire workflow. By tracking the status of this credit, your system knows exactly what stage the pilot is at in their compliance journey.

### Token Lifecycle

#### Phase 1: Token Is "Minted" (Subscription Paid)

- **What happens**: Pilot pays $120 via Dodo Payments
- **Token State**: Active (Held by Pilot) — `credit_balance = 1`
- **System Action**: Platform adds the pilot's name to the end-of-month batch query list for the CAA. The token stays locked in the pilot's profile while the CAA and ATO review process begins.

#### Phase 2: Token Is "Escrowed" (In Progress)

- **What happens**: The month ends. Platform pushes the pilot's data to the CAA and the ATO for auditing.
- **Token State**: Pending / Locked
- **System Action**: Pilot's dashboard shows "Verification Pending CAA/ATO Response." The pilot cannot use or cancel the credit because the background work is actively happening.

#### Phase 3: Token Is "Burned" (Verification Complete)

- **What happens**: The ATO finishes auditing the logbook hours and logs their signature. The CAA confirms the license validity.
- **Token State**: Consumed / Burned — `credit_balance = 0`
- **System Action**: The credit is deducted from the pilot's account. This deduction event automatically alerts the database to log a +$10 cash balance to that specific ATO's payout wallet. The pilot's profile officially switches to **100% Fully Verified** for airlines to see.

#### Phase 4: The Countdown to the Next Token

- **What happens**: The pilot enjoys their verified status and matching pathways for the next 11 months.
- **Token State**: 0 Credits (Verified Status Active)
- **System Action**: At the end of the year, the subscription auto-renews via Dodo Payments, minting 1 new token, and placing them on the next annual verification list. If they cancel, the verified badge drops, and they must manually re-submit everything.

### Token Tracking Behind the Scenes

```
CREDIT BALANCE TRACKING:
[Balance: 1] ──► Subscribed ──► Added to CAA end-of-month queue.
[Balance: 1 (Locked)] ──► Audit ongoing ──► Protected from cancellation.
[Balance: 0] ──► Audit complete ──► Trigger $10 ATO payout + Grant Verified Badge.
```

By tracking this single integer (`1` or `0`) in your database, you control:
- Data visibility for airlines
- Payout triggers for flight schools
- Compliance tracking for the pilot

### Token Security Rules

- **Non-Transferable (Soulbound)**: Tokens cannot be traded between pilots. A commercial captain cannot transfer their unused verification tokens to a student pilot. A token is permanently locked to the specific user account that purchased it.
- **Expiration Protocol**: Tokens expire at the end of the pilot's 12-month billing cycle. If a pilot fails to use their annual verification token, it is burned automatically. To get a new one and stay on the CAA list, they must renew their $120 subscription.
- **Fixed Valuation**: The redemption rate stays perfectly pegged: **1 Token = $10.00 cash-out value** for the verifying ATO. This predictability gives flight schools and airlines total financial confidence to mandate your platform across all their alumni networks.

---

## 5. Human-in-the-Loop Approval Workflow

### The Problem

A human must verify the CFI-signed document before releasing funds. You cannot automate the reading of a CFI signature to avoid fraud. Instead, your backend pushes the file into a **Secure Internal Admin Dashboard** for your company team or the designated ATO auditor.

### The Reversed Token Flow (ATO-Initiated)

```
[ATO Uploads CFI PDF] ──► [Your Admin Dashboard Queue] ──► [Your Team Reviews Doc]
                                                              │
      ┌───────────────────────────────────────────────────────┘
      ▼ (If Legit: Click Approve)
[Dodo API: Consumes 1 Credit] ──► [Auto-Triggers Cash Payout API to ATO ($10)]
                               ──► [Grants 100% Verified Badge to Pilot Profile]
```

### Step-by-Step Workflow

#### Step 1: The Automated Setup (API Foundation)

1. **Define the Credit** in Dodo dashboard under Products → Credits. Create a custom unit token named **"Audit Credit"** with precision of 0. Attach this token directly to your annual $120 subscription product.
2. **Listen to Subscriptions**: When a pilot pays $120, Dodo fires a `subscription.active` webhook to your server. Your app backend catches this, reads the pilot's profile, and updates their balance to `audit_credit = 1`.

#### Step 2: The Document Collection & Token Locking (Digital Escrow)

1. The pilot uploads their logbook hours data.
2. The ATO finishes their manual logbook audit, takes the physical document signed by the **Chief Flight Instructor (CFI)**, logs into their secure corporate portal on your app, and clicks **"Submit Pilot Audit for Verification."**
3. The ATO interface forces them to upload the scanned CFI-signed document. They cannot press submit without uploading this file.
4. Your system locks the token: it sets the pilot's state to **"Pending Internal Review"**. The token stays in escrow so the pilot cannot run away or cancel the subscription while your team prepares to review the binding contract.

#### Step 3: The Human Verification Queue (The Gatekeeper)

1. Your internal company team logs into the master admin panel and opens the pending queue.
2. A human operator opens your admin dashboard, reviews the uploaded CFI document, checks for any logbook/license discrepancies, and verifies the physical signature.
3. If the document passes the check, the human admin clicks the **"Approve and Certify"** button.

#### Step 4: Triggering the Auto-Payout System

The moment the human clicks "Approve," your application script instantly calls Dodo Payments and your payment gateway to execute three actions simultaneously:

**Action A: Burn the Token via Dodo API**

```
POST /v1/credits/deduct
{
  "customer_id": "cust_pilot_12345",
  "credit_id": "cred_audit_token_99",
  "amount": 1
}
```

**Action B: Pay the ATO ($10.00 Verification Fee)**

Your backend reads the specific ATO ID linked to that CFI document and uses a mass-payout API (like **Wise Payouts API** or **Stripe Connect**) to instantly route $10.00 directly to the ATO's registered corporate bank account.

**Action C: Pay the Scout ($20.00 Referral Fee)**

If the pilot used an invite code at checkout, Dodo's affiliate tracking webhooks (via Affonso/Refgrow) log the $20 bounty. This bounty is then securely earmarked for your employee or scout's next automated monthly transfer payout.

#### Step 5: Sealing the Binding Contract

Once the code receives a successful confirmation response from Dodo and the payout APIs, your database seals the record:

- Switches the pilot's profile badge to **"100% Internationally Background Checked & Audited"**
- Saves a permanent timestamp hash linking the Pilot ID, the Verifying ATO ID, the CFI Signature PDF Metadata, and the Dodo Ledger Snapshot
- This timestamp creates an unalterable, legally binding digital paper trail that protects your platform's data trust. If an airline later challenges those logbook hours, you can pull up this exact cryptographic log proving the human-verified audit took place.

### What the ATO Submits

The ATO must provide:
- The **CFI-signed document** stating all hours are hereby not falsified
- A binding contract between pilot and ATO certifying these hours have been internationally background checked and audited for verification purposes
- Once your team reads and approves the document, the system knows it's legit and triggers the payout

---

## 6. Dodo Payments Integration

### Step 1: Set Up the Base Subscription ($120)

Configure your primary product within the Dodo dashboard:

1. Navigate to **Products** and click **Create Product**
2. Name it **"Pilot Compliance & Pathway Access"**
3. Set the price to **$120.00** and select **Yearly Recurring**
4. Turn on the **Tax-Inclusive toggle** if you want the user to pay exactly $120 globally while Dodo handles regional consumption taxes (like the 12% Philippine VAT) behind the scenes

### Step 2: Configure the Referral Code System ($20 Bounty)

To distribute unique signup/invite links to independent scouts, employees, and ATOs:

1. Activate **Affonso** or **Refgrow** directly from your Dodo integrations tab
2. Create a global reward tier: set it to a **Flat Fee of $20.00 per successful subscription**
3. The platform will automatically assign custom referral links to your scouts
4. When a pilot signs up using that code, Dodo flags the payment data and logs a $20 debt to that specific referrer
5. **The Automated Pay List**: At the end of the month, Dodo automatically processes these balances, routing the cash to your referrers via Wise or local bank transfers without manual intervention

### Step 3: Use Dodo's Credit-Based Billing for Verifications ($10)

Rather than managing verification balances manually, Dodo's Credit-Based Billing Engine can track how much you owe the auditing institutions (ATOs, Type Rating Centers, or operators).

```
DODO CREDIT MECHANISM:
[Pilot pays $120] ──► Dodo issues 1 "Verification Token" to the profile
                        │
                        └──► [ATO audits logbook] ──► Consumes Token ──► Trigger $10 payout pool
```

1. Navigate to Products → Credits inside the Dodo dashboard
2. Click **Create Credit** and configure:
   - **Credit Type**: Custom Unit
   - **Unit Name**: "Audit Token"
   - **Precision**: 0 (whole numbers only)
3. Attach this credit bundle to your annual subscription plan so that every time a pilot pays $120, their user ID is credited with exactly **1 Audit Token**
4. When an ATO logs into your platform and clicks "Verify Hours," your system calls Dodo's API to deduct 1 token from that pilot's account
5. Your backend hooks into that deduction event to log that **$10 is owed** to that specific ATO

### Step 4: Cash Out Architecture for ATOs

Dodo Payments' native Credit-Based Billing Engine is a **one-way consumer wallet system**. It is built to issue, track, and deduct usage tokens from a buyer. It does not have a "reverse banking cash-out" button built directly into the client checkout.

To execute your 10% incentive cashing-out ecosystem for ATOs smoothly, you must combine Dodo Payments' credit system with an **external programmatic payout ledger**.

#### Option A: Dynamic API Trigger (Automated Cash Out)

1. When an ATO clicks "Verify This Pilot's Hours" inside your platform, your app calls Dodo's API to deduct 1 Audit Credit from that pilot's pool
2. Dodo instantly fires a `credit.deducted` webhook back to your server
3. Your backend intercepts this webhook, parses which ATO performed the audit, and logs a **+$10.00 cash balance** to that ATO's profile database inside your app
4. Once the ATO's dashboard hits a threshold (e.g., $100 or 10 verified pilots), they click an internal **"Request Cash Out"** button, triggering a bank remittance

```
THE CASH-OUT CYCLE:
[ATO clicks Verify] ──► Dodo Deducts 1 Credit ──► Webhook fires ──► [Your App logs +$10 Cash]
                                                                        │
                                [ATO Clicks Cash Out] ◄─────────────────┘
                                        │
                                        ▼
                        [Remittance to ATO's Bank]
```

#### Option B: Internal "Prepaid Balance" Model (B2B Credit Swap)

If the ATO is also buying software licenses or corporate platform gateway packages from you to manage their students, you can use Dodo's **Prepaid Balances** feature:

1. Every time an ATO verifies a pilot, you programmatically add $10.00 to their Dodo customer wallet balance
2. When it's time for the ATO to pay their own platform access subscription, Dodo automatically draws from that prepaid balance first, bringing their software bill down to $0

### Final Cash Flow Blueprint

| Step in the Loop | Dodo Dashboard Tool | Exact Financial Result |
|-----------------|---------------------|----------------------|
| Pilot Checks Out | Tax-Inclusive Checkout | +$120.00 gross collected by Dodo |
| Referral Applied | Affiliate Snippet (Affonso) | -$20.00 auto-assigned to the scout's balance |
| Audit Completed | Credit-Based Billing Engine | -$10.00 earmarked for the verifying ATO |
| Your Safe Yield | Payout Balance Ledger | $90.00 clean profit deposited into your bank |

---

## 7. Batched Verification Ecosystem

### Eliminating the "Waiting Time" Bottleneck

Instead of a pilot waiting until they apply for a job to start the painful verification process, they are **pre-verified or actively queued**.

**Month-to-Month**: When a pilot subscribes, your platform automatically pushes their details to the CAA and the relevant ATO for the end-of-month batch query.

**The "Fast-Track" Result**: While the CAA and ATOs take their time processing the paperwork over the following months, the pilot's profile is steadily building its "Verified" score. By the time an airline views their profile, the waiting time has already happened in the background. The data is sitting there, live, trusted, and ready.

### Monthly Batch Processing

When a pilot subscribes, their details enter the **end-of-month batch query** to:

1. **CAA** — License validity, medical status, type rating records
2. **ATO** — Logbook audit, training completion, checkride history
3. **Operator** — Employment verification, flight hours confirmation
4. **NTSB/CAA** — Accident/incident report cross-check

### Timeline

| Month | Action |
|-------|--------|
| Month 1 | Pilot subscribes → enters batch queue |
| Month 2 | CAA responds with license validation |
| Month 3 | ATO completes logbook audit |
| Ongoing | Profile accumulates verified data |

### Annual Verification Queue

Pilots are placed on the **annual verification list** at year-end:
- Medical recurrency checks
- Type rating renewal tracking
- License compliance validation
- Logbook re-audit

**Retention lock**: If a pilot cancels their subscription, they lose their spot on the annual queue and their verified status degrades.

### Status Dashboard for Pilots

```
Profile Status: ▓▓▓▓▓░░░░░ 56% Verified
├── License:          ✅ Verified (CAA)
├── Medical:          ⏳ Pending (expiry in 30 days)
├── Logbook:          ✅ Verified (ATO Cebu Pacific)
├── Type Rating A320: ✅ Valid until 2027-03-15
├── Type Rating B737: ⏳ Recurrency due in 45 days
└── Total Hours:      1,200 verified / 300 unverified
```

### The Pilot's Timeline Shift

| Step | The Old Way (Without Platform) | The New Way (With Platform) |
|------|-------------------------------|----------------------------|
| Sourcing | Pilot updates a manual paper logbook and PDF resume | Pilot links their account to the automated ATO/CAA verification stream |
| Application | Pilot submits to an airline; waiting time begins | Pilot views airline expectations and matches their pre-verified profile |
| Background Check | Airline HR spends 30–60 days calling the CAA and auditing logbooks | Instant. The airline logs in, sees the pre-verified ledger, and hires |
| Maintenance | Pilot manually tracks expiry dates on a calendar | Platform automatically handles end-of-month updates and annual renewals |

---

## 8. Subscription Retention & Lapse Model

### The Perfect Retention Hook

At the end of their subscription, pilots must **submit the same verification form again** to comply. This ensures pilots never let their subscriptions lapse.

### The Cost of Inconvenience vs. The Cost of Subscription

Pilots hate paperwork. Filling out CAA verification forms, printing logbook audit requests, and chasing flight school registrars is a massive headache.

- **If they stay subscribed ($120/year)**: The platform handles everything seamlessly in the background via monthly CAA batches and annual verification queues. Completely hands-off.
- **If they cancel**: They are dropped from the automated list. The next time they need to prove their hours or license validity to an operator, they have to start from scratch, print the forms, pay local government processing fees, and wait in line.

### Guarding the "Data Trust"

If a pilot's subscription ends, you can no longer run end-of-month inquiries with the CAA or cross-verify records with ATOs for them. Because aviation data changes constantly (medicals expire, type ratings lapse), a profile that isn't actively monitored quickly becomes untrusted. Forcing a full re-submission ensures that if they come back later, every single claim is fresh and legally verified.

### Dashboard Urgency

Inside the pilot's dashboard, build a visual countdown as their renewal date approaches:

- **30 Days to Renewal**: *"Your spot on the next annual CAA batched verification list is locked. Keep your subscription active to avoid manual re-submission."*
- **Subscription Lapsed**: *"Account downgraded to Free/Unverified status. To reactivate verification, you must manually print, sign, and upload the standard compliance verification forms."*

### Subscription Status Comparison

| Feature / Benefit | Active Subscriber ($120/yr) | Lapsed / Free Account |
|-------------------|---------------------------|----------------------|
| Verification Status | 100% Verified Badge (Visible to top 10 airlines) | "Unverified Claim" (Flagged to operators) |
| Data Processing | Automated end-of-month CAA/ATO batch queue | None. Locked out of the automated stream. |
| When Applying to Pathways | Instant 87%+ AI matching based on proven data | Allowed to apply, but treated as an unproven resume |
| To Renew Compliance | Fully automatic background tracking | Must manually re-submit the entire verification form |

This creates a powerful psychological barrier to canceling. The $120 a year changes from a "software cost" into a **"bureaucracy insurance policy"** that pilots will gladly pay year after year just to keep their careers running smoothly on autopilot.

### The 3-Month Verification Window

Aviation compliance takes time. You explicitly recommend that pilots get verified **within 3 months prior to their career pathway application**.

**Driving Early Revenue**: Instead of pilots subscribing at the very last second and getting angry at waiting times, you train them to subscribe months in advance. They pay their $120 early to get their spot on the end-of-month batch queue so that their verified badge is fully active the exact day the airline pathway opens.

**Dashboard Notice**:

```
========================================================================
PILOT COMPLIANCE DASHBOARD NOTICE:
"Aviation compliance takes time. To ensure you do not miss application
deadlines for the Top 10 Airlines, we highly recommend initiating your
ATO logbook audit at least 3 MONTHS before applying to a career pathway.
Your 12-month subscription secures your spot on the automated monthly
CAA/ATO batch verification queue."
========================================================================
```

---

## 9. System Pros, Cons & Risk Mitigation

### The Pros (Advantages)

1. **Ironclad Liability Shield (Zero Legal Risk)**: If a pilot later falsifies hours and gets into an incident, your platform is completely protected. You have a signed, legally binding contract proving that the ATO audited the logbook and certified its compliance. The liability stays with the flight school.

2. **Unbeatable Data Trust for Airlines**: Major airlines and private jet charter companies will happily pay your subscription fees because your data isn't just a "digital claim." It is backed by a verified paper trail. You are providing them with pre-audited, risk-free talent pipelines.

3. **Self-Sustaining Fraud Prevention**: Because ATOs know that signing a fraudulent document can cost them their training license or tie them to an international lawsuit, they will be incredibly strict when checking pilot logbooks before uploading them to your system.

4. **Massive Growth Loop**: The $10 incentive makes the administrative paperwork highly profitable for the ATOs. They aren't just doing data entry; they are building a predictable, recurring revenue stream out of their own alumni networks.

### The Cons (Risks & Challenges)

1. **The Human Bottleneck (Scaling Limits)**: Because you refuse to fully automate the reading of the CFI document to prevent fraud, your internal company team must manually check every single upload. If you scale to 10,000 pilots globally, you will need to hire a dedicated compliance team just to review PDFs and click "Approve."

2. **Collusion / "Rubber-Stamping" Risk**: A corrupt CFI or a desperate flight school could theoretically "rubber-stamp" and sign off on fake hours just to help an alumnus get hired or to quickly claim your $10 credit payout.

   > **Aviation Reality**: This is the reality of aviation — that's why you recommend getting verified within 3 months prior to your career pathway. Your platform isn't the police; you are the ledger. The document protects your data trust, while the legal weight of aviation law keeps the ATOs honest.

3. **Friction for the Pilot**: If an ATO takes weeks to print, sign, audit, and upload the verification document, the pilot might get frustrated that their profile is stuck in the "Pending Admin Sign-off" phase, even though they already paid their $120 subscription fee.

   > **Aviation Reality**: Aviation compliance takes time. If an ATO takes weeks to print, audit, and sign the document, that is the reality of aviation. The 3-month window completely solves this problem.

### Risk Mitigation Strategies

| Identified Con | How to Fix It & Protect the Ecosystem |
|----------------|--------------------------------------|
| Human Bottleneck | Use basic AI OCR (Optical Character Recognition) to pre-screen the document for the CFI name, signature block, and date. Your human team only looks at the document for a final 5-second sanity check. |
| ATO Collusion / Fraud | Implement a **"Three-Strike Audit Policy."** If an airline reports a discrepancy on a pilot certified by a specific ATO, that ATO is immediately suspended from the platform, losing all future $10 and $20 payouts. |
| Friction & Waiting Times | Allow the pilot to access the airline "Pathway Matcher" using their unverified hours immediately upon subscribing. This keeps them engaged with the platform while the ATO processes the official paperwork in the background. |

Ultimately, the pros heavily outweigh the cons. By utilizing Dodo Payments to securely lock the credit while your team checks the validity of the CFI contract, you are building a highly defensible, elite business model that legacy background-check companies will find nearly impossible to disrupt.

---

## 10. Enterprise Features

### Airline Expectation Pages

Airlines get a branded page showing:
- Why pilots should choose them
- Career pathway requirements
- Expected flight hours, type ratings, medical class
- Top 10 bookmarked careers

Pilots can align their profile **before** pressing "Submit Interest."

### Pathway Matching

```
Airline Pathway: "A320 First Officer — Cebu Pacific"
Requirements:
  • A320 type rating (verified)
  • 1,500+ total hours (1,200 verified ✓)
  • 500+ PIC hours (verified ✓)
  • Medical Class 1 (valid ✓)

Pilot Match: 87%
├── Verified hours:     ✅ 1,200/1,500
├── Type rating:        ✅ A320 current
├── Medical:            ✅ Valid 6 months
└── Crash history:      ✅ Clean
```

### Private Jet Charter Confidentiality

- Exclusive pathways visible **only** to verified pilots
- Client confidentiality protected
- No raw data shared — only verification status

---

## 11. Compliance & Data Architecture

### Zero-Trace Verification

The airline never sees:
- License PDFs
- Medical scans
- Raw logbook files

The airline sees:
- "License: ✅ Valid (CAA verified 2026-06-15)"
- "Medical: ✅ Class 1, expires 2027-01-20"
- "Logbook: ✅ 1,200 hours verified by ATO"

### Document Retention (APC Verification System)

| Layer | What | Retention |
|-------|------|-----------|
| D1 `profiles` | Account identity, tier, status | Permanent |
| D1 `verification_submissions` | License numbers, hours, ratings | Permanent (trace record) |
| D1 `verification_employee_access_log` | Who searched what | Permanent (audit) |
| R2 `pilot-encrypted-vault` | Uploaded PDFs/PNGs | **30 days after status → terminal** |
| R2 `consents/` | Consent form JSON | **Permanent** (legal record) |

### Document Purge Flow

1. Pilot submits → `status = 'submitted'`, `document_purge_after = NULL`
2. Employee reviews → status changed to `verified`/`rejected`/`flagged`
3. Purge clock starts → `document_purge_after = now + 30 days`
4. Daily cron (00:00 UTC) → deletes expired R2 objects, clears `document_keys`
5. Consent forms in `consents/` prefix are **never deleted**

---

## 12. Revenue Projections

### Conservative Estimate (Year 1)

| Segment | Units | Price | Revenue |
|---------|-------|-------|---------|
| Pilot subscriptions | 1,000 | $120 | $120,000 |
| Enterprise (airlines) | 5 | $1,000 | $5,000 |
| Enterprise (charters) | 10 | $1,200 | $12,000 |
| Enterprise (ATOs) | 20 | $600 | $12,000 |
| **Total** | | | **$149,000** |

### At Scale (Year 3)

| Segment | Units | Price | Revenue |
|---------|-------|-------|---------|
| Pilot subscriptions | 10,000 | $150 | $1,500,000 |
| Enterprise (airlines) | 50 | $5,000 | $250,000 |
| Enterprise (charters) | 100 | $2,400 | $240,000 |
| Enterprise (ATOs) | 200 | $1,200 | $240,000 |
| **Total** | | | **$2,230,000** |

---

## 13. Key Legal References

- **Republic Act No. 12023** (Philippines) — VAT on digital services
- **BIR Revenue Regulations No. 3-2025** — Implementing rules for digital services VAT
- **BIR VDS Portal** — `https://vds.bir.gov.ph`
- **Mauritius Revenue Authority** — Zero-rated export for services consumed abroad
- **Philippine Data Privacy Act** — Compliance for pilot personal data handling

---

## 14. Next Steps

### Immediate (Week 1–2)
1. **Finalize Dodo Payments setup** — Configure tax-exclusive vs tax-inclusive pricing
2. **Create "Audit Credit" in Dodo** — Products → Credits → Custom Unit, precision 0, attach to $120 subscription
3. **Set up Affonso/Refgrow** — $20 flat fee referral tier, auto-generate referral links

### Technical Build (Week 2–4)
4. **Build credit balance tracking** — Database field `audit_credit` (0 or 1) on pilot profiles
5. **Implement token lifecycle states** — `minted` → `escrowed` → `burned` → `renewed`
6. **Build ATO corporate portal** — Secure login, pilot search, document upload, "Submit Audit" button
7. **Build internal admin queue** — Pending CFI document review, "Approve & Burn Credit" button
8. **Wire Dodo webhooks** — `subscription.active`, `credit.deducted` handlers
9. **Build ATO cash-out flow** — Threshold-based ($100 min), Wise/Stripe Connect payout trigger

### Partnerships (Week 3–6)
10. **CAA partnership** — Pitch monthly batch processing system
11. **ATO onboarding** — Sign partnership agreements for verification incentives
12. **Airline pilot program** — 3–5 launch partners for pathway matching

### Product (Week 4–8)
13. **Pilot dashboard** — Status tracking, pending verification visibility, renewal countdown
14. **3-month verification messaging** — Onboarding text, dashboard notice, email reminders
15. **Retention email sequence** — 30-day, 7-day, 1-day renewal reminders with urgency
16. **Enterprise dashboard** — Pathway creation, AI matching, verified-only filters

### Compliance & Legal (Week 6–10)
17. **CFI document template** — Standardized form with legal text and signature block
18. **ATO Terms of Service** — Three-Strike Audit Policy, penalties for falsified documents
19. **Three-Strike Audit Policy** — Implement ATO suspension logic on discrepancy reports
20. **OCR pre-screening** — AI document validation before human review

### Scale (Month 3–6)
21. **Annual verification queue** — Automated year-end re-verification workflow
22. **ATO bulk voucher system** — Unique one-time codes for graduating classes
23. **Enterprise API** — Airline pull access to verified pilot data
24. **Pricing elasticity testing** — A/B test $120 vs $150 vs $199 price points

---

> **Disclaimer**: AI-generated content. For financial, tax, and legal advice, consult a qualified professional. Tax laws change frequently — verify current rates and regulations before implementation.
