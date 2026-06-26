# Cloudflare Account Limits & Pricing Reference

> Last updated: 2026-06-26
> Source: Cloudflare Workers & D1 official documentation

---

## Workers Plan Limits

### Workers Free Plan

| Feature | Limit | What Happens If Exceeded |
|---------|-------|--------------------------|
| Daily Requests | 100,000 / day | Returns HTTP 1015 (Rate limited) |
| CPU Time | 10 ms / request | Execution terminates immediately |
| Memory | 128 MB / Worker | Out-of-Memory crash |
| Workers per account | 100 | Cannot create new Workers |
| Subrequests | 50 / invocation | Outgoing fetch/SQL throws errors |

### Workers Paid Plan ($5/month)

| Feature | Limit |
|---------|-------|
| Daily Requests | Unlimited |
| CPU Time | 5 minutes / invocation |
| Memory | 128 MB / Worker |
| Workers per account | 100 |
| Subrequests | 1,000 / invocation |

---

## D1 Database Limits

### D1 Free Plan

| Feature | Limit | What Happens If Exceeded |
|---------|-------|--------------------------|
| Databases per account | 10 | Cannot create new databases |
| Max database size | 500 MB / DB | INSERT/schema updates blocked |
| Total account storage | 5 GB across all DBs | Combined insertion block |
| Daily rows read | 5 million / day | Queries fail until 00:00 UTC reset |
| Daily rows written | 100,000 / day | Writes fail until 00:00 UTC reset |
| Max row/query size | 2 MB | Query rejected |

### D1 Paid Plan ($5/month base)

| Feature | Limit |
|---------|-------|
| Databases per account | 50,000 |
| Max database size | 10 GB / DB |
| Total account storage | 1 TB |
| Rows read | First 25 billion / month included |
| Rows written | First 50 million / month included |
| Max row/query size | 2 MB |

---

## Key Gotchas (Free Plan)

1. **10 ms CPU Trap**: CPU time != wall time. Complex JSON processing, crypto, or loops inside your Worker eat into the 10 ms budget. D1 query wait time does NOT count against CPU.

2. **Row Reads Accumulate Fast**: If a query scans 5,000 rows to return 10 results, you are charged for 5,000 rows read. Poorly indexed queries can burn through the 5M daily limit in minutes.

3. **Batch Operations Ceiling**: Max 50 subrequests per invocation means 50 D1 queries max in a single API call. Sequential database steps inside one request will hit this hard ceiling.

4. **500 MB Per Database**: Not 5 GB per database — it's 500 MB each, totaling 5 GB across all 10.

---

## Our Current Architecture vs Limits

| Worker | Plan | DB | Size | Status |
|--------|------|-----|------|--------|
| `platform-api` | Paid | `pilotrecognition-d1` | < 500 MB | ✅ Well within limits |
| `pilotrecognition-pilot-api` | Paid | `pilotrecognition-profiles` | < 500 MB | ✅ Well within limits |
| `pilotrecognition-legacy` | Paid | `pilotrecognition-profiles` | < 500 MB | ✅ Well within limits |

**Total databases used**: 2 out of 50,000 (Paid) or 2 out of 10 (Free)
**Total Workers used**: 3 out of 100

---

## Recommended Strategy

- **Stay on Paid plan** for production ($5/month = unlimited requests + 10 GB per DB)
- **Horizontal DB split** by domain (already done: platform vs pilot)
- **Index aggressively** to minimize row reads (critical on Free, good practice on Paid)
- **Monitor row reads** via Cloudflare dashboard to avoid surprises

---

## Official Documentation

- [Workers Limits](https://developers.cloudflare.com/workers/platform/limits/)
- [D1 Limits](https://developers.cloudflare.com/d1/platform/limits/)
- [D1 Pricing](https://developers.cloudflare.com/d1/platform/pricing/)
