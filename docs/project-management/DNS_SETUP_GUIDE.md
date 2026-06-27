# DNS Setup Guide - PilotRecognition.com Subdomains

## Overview
7 subdomains need CNAME records pointing to Vercel. This enables the Boeing-style architecture.

## Required DNS Records

Add these CNAME records in your domain registrar (GoDaddy, Namecheap, Cloudflare, etc.):

| Subdomain | Type | Value | Purpose |
|-----------|------|-------|---------|
| `enterprise.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | B2B portal for airlines/ATOs |
| `pathways.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Pathway discovery for pilots |
| `recognitionplus.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Premium membership |
| `support.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Support center |
| `partners.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Flight school partners |
| `join.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Membership signup |
| `blog.pilotrecognition.com` | CNAME | `535f678ef37f1e51.vercel-dns-017.com` | Blog and content |

**Note:** Your Vercel DNS target is `535f678ef37f1e51.vercel-dns-017.com` (project-specific). Use this exact value.

**Optional:** `store.pilotrecognition.com` can be kept as an alias for `recognitionplus.pilotrecognition.com` (backwards compatibility).

## Step-by-Step Instructions

### 1. Log into Your Domain Registrar
- GoDaddy, Namecheap, Cloudflare, or wherever you manage DNS

### 2. Find DNS Management Section
- Look for "DNS Records", "DNS Management", or "Advanced DNS"

### 3. Add CNAME Records
For each subdomain above:
1. Click "Add Record" or "+"
2. Type: Select `CNAME`
3. Host/Name: Enter subdomain prefix (e.g., `enterprise`)
4. Value/Points to: Enter `cname.vercel-dns.com`
5. TTL: Leave default (usually 600 seconds or 1 hour)
6. Save

### 4. Verify Propagation
DNS propagation takes 24-48 hours. Check status:

```bash
# Test each subdomain
nslookup enterprise.pilotrecognition.com
nslookup pathways.pilotrecognition.com
nslookup recognitionplus.pilotrecognition.com
nslookup support.pilotrecognition.com
nslookup partners.pilotrecognition.com
nslookup join.pilotrecognition.com
```

Or use online tools:
- https://whatsmydns.net
- https://dnschecker.org

### 5. Verify on Vercel
Once DNS propagates:
1. Go to Vercel Dashboard
2. Select your project
3. Go to "Domains" tab
4. Vercel will auto-detect and provision SSL certificates

## Expected Behavior After Setup

| URL | Should Show |
|-----|-------------|
| https://enterprise.pilotrecognition.com | Enterprise portal with analytics, airline dashboard |
| https://pathways.pilotrecognition.com | Pathway discovery with filtering/search |
| https://recognitionplus.pilotrecognition.com | Premium membership page |
| https://support.pilotrecognition.com | FAQ and support center |
| https://partners.pilotrecognition.com | Flight school partner page |
| https://join.pilotrecognition.com | Membership signup form |

## Troubleshooting

### SSL Certificate Not Provisioning
- Wait 24 hours after DNS propagation
- Ensure no A records conflict with CNAME
- Check Vercel "Domains" tab for errors

### Subdomain Not Loading
```bash
# Check if CNAME is correct
dig enterprise.pilotrecognition.com CNAME

# Should return: 535f678ef37f1e51.vercel-dns-017.com
```

### Mixed Content Warnings
- Ensure all internal links use `https://`
- Update any hardcoded `http://` URLs

## Next Steps After DNS

1. **Test authentication** (Step 27) — Verify login works across subdomains
2. **Enable analytics** (Step 28) — Add subdomain tracking to Google Analytics
3. **Update email templates** (Step 29) — Replace URLs with subdomain versions
4. **Deploy & monitor** (Step 30) — 48-hour monitoring period

---

**Deadline Context:** September 2026 — 3-4 months remaining
**Priority:** CRITICAL — All subdomain features blocked until DNS complete
