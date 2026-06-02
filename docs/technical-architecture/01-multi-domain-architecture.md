# Multi-Domain Architecture

**Technical Architecture Document** — PilotRecognition Platform

---

## Overview

The PilotRecognition platform operates across three primary domains, each serving a distinct purpose while sharing a unified backend infrastructure.

| Domain | Purpose | Primary Features |
|--------|---------|------------------|
| `pilotrecognition.com` | Main platform | Verification, wallet, enterprise B2B |
| `pilotcareerpathways.com` | Career pathways | Job matching, programs, pathway cards |
| `pilotshortage.org` | PSA advocacy | Anonymous stories, UCF framework |

---

## Core Principle

**One backend, three front doors.** Shared infrastructure with domain-specific routing and branding.

```
┌─────────────────────────────────────────────────────────────┐
│                    SHARED BACKEND                           │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────┐  │
│  │  Supabase   │  │   Edge      │  │   Cloudflare R2     │  │
│  │  Database   │  │  Functions  │  │   Storage           │  │
│  └─────────────┘  └─────────────┘  └─────────────────────┘  │
└─────────────────────────────────────────────────────────────┘
                              │
          ┌───────────────────┼───────────────────┐
          ▼                   ▼                   ▼
┌─────────────────┐ ┌─────────────────┐ ┌─────────────────┐
│ pilotrecognition│ │pilotcareerpath- │ │ pilotshortage   │
│     .com        │ │   ways.com      │ │    .org         │
│                 │ │                 │ │                 │
│  Full Wallet    │ │ Career Wallet   │ │ Anonymous       │
│  Enterprise     │ │ Pathway Match   │ │ Story System    │
│  Verification   │ │ Programs        │ │ UCF Portal      │
└─────────────────┘ └─────────────────┘ └─────────────────┘
```

---

## Domain Detection Strategy

### Hostname-Based Routing

```typescript
// lib/domain.ts
export type DomainSource = 'recognition' | 'pathways' | 'shortage';

export function getDomainFromHostname(hostname: string): DomainSource {
  if (hostname.includes('pilotcareerpathways.com')) return 'pathways';
  if (hostname.includes('pilotshortage.org')) return 'shortage';
  return 'recognition';
}
```

### Middleware Implementation

```typescript
// middleware.ts
export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const domain = getDomainFromHostname(hostname);
  
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-domain-source', domain);
  
  return NextResponse.next({ request: { headers: requestHeaders } });
}
```

---

## Database Schema Organization

### Domain Routing Column

All tables include `domain_source` for row-level security (RLS) enforcement:

```sql
-- Add to all domain-aware tables
ALTER TABLE profiles ADD COLUMN domain_source VARCHAR(50);

-- RLS policies enforce domain boundaries
CREATE POLICY "domain_isolation" ON profiles 
  FOR SELECT USING (
    domain_source = current_setting('app.domain_source', true) 
    OR domain_source IS NULL
  );
```

### Schema Separation

| Schema | Purpose | Tables |
|--------|---------|--------|
| `public` | Shared data | profiles, credentials, verification_logs |
| `recognition` | Wallet + enterprise | wallets, vc_credentials, enterprise_contracts |
| `pathways` | Career data | pathways, applications, program_enrollments |
| `shortage` | Advocacy | stories, ucf_pillars, advocacy_campaigns |

---

## Authentication Flow

### Domain-Aware Signup

```typescript
// Sign-up detects domain from hostname
const domain = getDomainFromHostname(window.location.hostname);

await supabase.auth.signUp({
  email,
  password,
  options: {
    data: {
      domain_source: domain,
      signup_path: window.location.pathname,
    }
  }
});
```

### Session Configuration

- **Cookie Domain:** `.pilotrecognition.com` (shared across subdomains)
- **JWT Claims:** Includes `domain_source` for RLS enforcement
- **RLS Policies:** Enforce domain boundaries at database level

---

## Cross-Domain Navigation

### Domain Linking

```typescript
// lib/domain.ts
export const domainLinks = {
  recognition: {
    base: 'https://pilotrecognition.com',
    wallet: '/wallet',
    verification: '/verification',
  },
  pathways: {
    base: 'https://pilotcareerpathways.com',
    wallet: '/wallet',
    programs: '/programs',
  },
  shortage: {
    base: 'https://pilotshortage.org',
    wallet: '/wallet',
    stories: '/stories',
  },
};
```

### Attributed Cross-Domain Links

```typescript
// Track user journey across domains
function getCrossDomainUrl(targetDomain: DomainSource, path: string, userId: string) {
  const base = domainLinks[targetDomain].base;
  const attribution = encodeURIComponent(btoa(JSON.stringify({
    source: getCurrentDomain(),
    userId,
    timestamp: Date.now(),
  })));
  return `${base}${path}?ref=${attribution}`;
}
```

---

## Implementation Status

| Component | Status | Notes |
|-----------|--------|-------|
| Domain Detection | ✅ Complete | Hostname-based middleware |
| Database RLS | ✅ Complete | Domain-aware policies |
| Shared Auth | ✅ Complete | Cookie domain `.pilotrecognition.com` |
| Cross-Domain Analytics | 🔄 In Progress | Attribution tracking |
| Component Library | 🔄 70% Complete | Domain-aware variants |

---

## Related Documents

- [02-domain-routing-detection.md](./02-domain-routing-detection.md) — Detailed routing implementation
- [09-domain-wallet-implementation.md](./09-domain-wallet-implementation.md) — Domain-specific wallets
- [10-infrastructure-summary.md](./10-infrastructure-summary.md) — Complete infrastructure overview

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
