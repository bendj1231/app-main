# Helio Fee Breakdown — Exact Margins per $100 Transaction

## Fee Structure

| Fee Type | Rate | Cost on $100 |
|----------|------|-------------|
| Helio Standard | 2.0% | $2.00 |
| HelioX (partner) | 1.0% | $1.00 |
| On-chain swap (optional) | 0.25% | $0.25 |
| Auto-offramp (optional) | 0.50% | $0.50 |
| Solana gas | ~$0.00025 | ~$0.00 |

## Recommended Setup

Use **HelioX 1% rate** + **manual offramp** (you convert USDC yourself):
- **Total Helio cost: $1.00 per $100**
- **No swap fee, no auto-offramp fee**
- **Gas negligible on Solana**

## Net Payout Calculation

### Scenario A: ATO is Subscribed ($1,000/yr)

| Recipient | % | Amount |
|-----------|---|--------|
| Gross payment | 100% | $100.00 |
| Helio fee (1%) | -1% | -$1.00 |
| **Net to split** | **99%** | **$99.00** |
| Veremark | 23% | $22.77 |
| Logbook | 5% | $4.95 |
| ATO | 5% | $4.95 |
| **Platform (you)** | **66%** | **$65.34** |

**Your net: $65.34 per $100 verification**

### Scenario B: ATO NOT Subscribed

| Recipient | % | Amount |
|-----------|---|--------|
| Gross payment | 100% | $100.00 |
| Helio fee (1%) | -1% | -$1.00 |
| **Net to split** | **99%** | **$99.00** |
| Veremark | 23% | $22.77 |
| Logbook | 5% | $4.95 |
| ATO (held) | 5% | $4.95 |
| **Platform (you)** | **66%** | **$65.34** |
| **+ if ATO expires unclaimed** | **+5%** | **+$4.95** |

**Your net: $65.34 (immediate) + $4.95 (if expired) = $70.29**

### Scenario C: Enterprise Flight School ($1,000/mo)

| Recipient | % | Amount |
|-----------|---|--------|
| Gross payment | 100% | $1,000.00 |
| Helio fee (1%) | -1% | -$10.00 |
| **Net to platform** | **99%** | **$990.00** |

**Your net: $990.00 per enterprise subscription**

## Monthly Revenue Projections

| Volume | Type | Gross | Helio (1%) | Your Net |
|--------|------|-------|-----------|----------|
| 100 pilot verifications | $100 each | $10,000 | $100 | $6,534-$7,029 |
| 10 enterprise ATOs | $1,000/mo | $10,000 | $100 | $9,900 |
| Combined monthly | — | $20,000 | $200 | $16,434-$16,929 |
| **Annual** | — | **$240,000** | **$2,400** | **$197,208-$203,148** |

## Environment Variables to Set

```bash
# Helio / MoonPay
supabase secrets set HELIO_API_KEY=helio_live_xxx
supabase secrets set HELIO_WEBHOOK_SECRET=whsec_helio_xxx
supabase secrets set HELIO_PARTNER_TIER=heliox  # For 1% rate

# Revenue share wallets
supabase secrets set VEREMARK_WALLET=0x...
supabase secrets set LOGBOOK_WALLET=0x...
supabase secrets set ATO_WALLET=0x...
supabase secrets set PLATFORM_WALLET=0x...

# Stripe (for traditional invoices)
supabase secrets set STRIPE_SECRET_KEY=sk_live_xxx
supabase secrets set STRIPE_WEBHOOK_SECRET=whsec_stripe_xxx

# Veremark
supabase secrets set VEREMARK_API_KEY=vm_xxx
supabase secrets set VEREMARK_WEBHOOK_SECRET=whsec_vm_xxx
```

## Next Steps

1. Apply for HelioX partner rate (1%): helio.xyz/partners
2. Set all wallet addresses in Supabase secrets
3. Deploy edge functions
4. Test with $1 USDC on devnet first
