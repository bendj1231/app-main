# Enterprise Billing — Corporate Invoice Solution

## The Problem

Flight school accountants need a proper commercial invoice with:
- Registered legal business name
- Corporate tax ID number
- Physical business address

Without a registered entity, "WM Pilot Group" (or individual developer names) cannot provide these.

## The Solution: Stripe Invoicing

Stripe, Inc. acts as the Merchant of Record. When a flight school pays:

1. **The invoice is FROM**: Stripe, Inc.
   - Address: 354 Oyster Point Blvd, South San Francisco, CA 94080, USA
   - Tax ID (EIN): 46-4602340
   - Registered US corporation with full legal standing

2. **The invoice is TO**: Flight School / ATO (with their tax ID, address)

3. **The description says**: "Software subscription — PilotRecognition Enterprise Access"

4. **The flight school's accountant sees**: A clean, authorized corporate software expense to a Fortune 500 company.

## How It Works

```
[ Flight School Accountant ]
           │
           │ "We need to pay $1,000 for this pilot platform"
           ▼
[ Invoice from Stripe, Inc. ]
           │
           │ Net 14 days, bank transfer or card
           ▼
[ Stripe processes payment ]
           │
           │ Stripe takes 0.5% + card fees
           ▼
[ Balance sent to your account ]
```

## Invoice Features

| Feature | Details |
|---------|---------|
| Invoice issuer | Stripe, Inc. (registered US corporation) |
| Tax ID on invoice | 46-4602340 (Stripe's EIN) |
| Address on invoice | 354 Oyster Point Blvd, South San Francisco, CA 94080 |
| Payment terms | Net 14 days (configurable) |
| Payment methods | Bank transfer (ACH), wire, credit card |
| Tax handling | Stripe auto-calculates VAT/sales tax |
| Cost to you | 0.5% of invoice amount ($5 on $1,000 invoice) |
| Invoice PDF | Auto-generated, professional, branded |
| Reminders | Auto-sent at 7 days and 1 day before due |

## Enterprise Plans

| Plan | Price | Billing | Target |
|------|-------|---------|--------|
| Enterprise Monthly | $1,000/month | Monthly invoice | Airlines, operators |
| Enterprise Annual | $10,000/year | Annual invoice (2 months free) | Flight schools, ATOs |

## Success Fee

Additional: $500 per pilot hired via pathway (billed separately upon hire confirmation).

## Technical Implementation

### Edge Function

`supabase/functions/create-enterprise-invoice/index.ts`

Accepts:
```json
{
  "flightSchoolName": "European Flight Academy",
  "billingContactName": "Finance Director",
  "flightSchoolEmail": "finance@efa.com",
  "flightSchoolAddress": { "line1": "...", "city": "...", "country": "..." },
  "flightSchoolTaxId": "VAT IE1234567X",
  "plan": "enterprise_monthly",
  "pilotCount": "50"
}
```

Returns:
```json
{
  "success": true,
  "invoiceId": "in_xxx",
  "invoiceNumber": "INV-001",
  "invoiceUrl": "https://pay.stripe.com/invoice/...",
  "pdfUrl": "https://pay.stripe.com/invoice/.../pdf",
  "amount": "$1,000.00",
  "dueDate": "2026-06-01T00:00:00Z",
  "message": "Invoice INV-001 sent to finance@efa.com. Payment due in 14 days."
}
```

### React Component

`src/components/EnterpriseInvoiceRequest.tsx`

- Plan selection ($1,000/month vs $10,000/year)
- Flight school info form
- Tax ID field for accountant compliance
- Auto-sends invoice via Stripe
- Shows success with Stripe invoice URL + PDF download

## What the Accountant Sees

```
═══════════════════════════════════════════════════════════════
  INVOICE from Stripe, Inc.
  354 Oyster Point Blvd, South San Francisco, CA 94080
  Tax ID: 46-4602340
═══════════════════════════════════════════════════════════════

  Bill To:
  European Flight Academy
  123 Aviation Blvd, Dublin, Ireland
  VAT: IE1234567X

  Description: Software subscription — PilotRecognition
               Enterprise Access — Monthly Subscription

  Amount: $1,000.00 USD
  Due: June 1, 2026

  Payment: Bank transfer to Stripe, Inc.
═══════════════════════════════════════════════════════════════
```

## Alternative: Quick Business Registration

If you want YOUR name on the invoice eventually:

### Philippines (DTI — Sole Proprietorship)
- **Time**: 3-5 business days
- **Cost**: ~₱1,500 ($25)
- **Requirements**: Valid ID, business name reservation
- **Output**: DTI Certificate of Registration, can open business bank account
- **Limitation**: You are personally liable (unlimited liability)

### UAE (Free Zone — FZE/FZC)
- **Time**: 1-2 weeks
- **Cost**: ~$3,000-5,000 (IFZA, RAKEZ, Ajman Free Zone)
- **Requirements**: Passport copy, photos, application form
- **Output**: Trade license, corporate bank account, tax residency
- **Advantage**: 0% personal/corporate tax, full legal entity shield
- **Best for**: Aviation (Dubai/UAE is aviation hub)

### Recommendation

**Phase 1 (Now)**: Use Stripe Invoicing. Collect revenue immediately.
**Phase 2 (Month 2-3)**: Register UAE Free Zone with collected revenue.
**Phase 3 (Month 4+)**: Switch to your own corporate invoicing once licensed.

## Next Steps

1. ✅ Edge function created (`create-enterprise-invoice`)
2. ✅ React component created (`EnterpriseInvoiceRequest`)
3. ⬜ Deploy edge function: `npx supabase functions deploy create-enterprise-invoice`
4. ⬜ Add route: `/enterprise/invoice` that renders `<EnterpriseInvoiceRequest />`
5. ⬜ Test with Stripe test mode + test customer email
6. ⬜ Email template for flight schools explaining the Stripe invoice
