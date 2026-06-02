# Domain Routing & Detection

**Technical Implementation Guide** — Hostname-Based Domain Detection

---

## Overview

The platform uses hostname-based domain detection to serve different branding, features, and content from a single codebase.

---

## Detection Algorithm

### Primary Detection Function

```typescript
// lib/domain.ts
export type DomainSource = 'recognition' | 'pathways' | 'shortage';

export function getDomainFromHostname(hostname: string): DomainSource {
  // Check for exact matches and subdomains
  if (hostname.includes('pilotcareerpathways.com')) return 'pathways';
  if (hostname.includes('pilotshortage.org')) return 'shortage';
  
  // Default to recognition for pilotrecognition.com and localhost
  return 'recognition';
}
```

### React Hook for Components

```typescript
// hooks/useDomainDetection.ts
export function useDomainDetection() {
  const [domain, setDomain] = useState<DomainSource>('recognition');
  
  useEffect(() => {
    const detected = getDomainFromHostname(window.location.hostname);
    setDomain(detected);
  }, []);
  
  return {
    domain,
    isRecognition: domain === 'recognition',
    isPathways: domain === 'pathways',
    isShortage: domain === 'shortage',
  };
}
```

---

## Middleware Implementation

### Next.js Edge Middleware

```typescript
// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || '';
  const path = request.nextUrl.pathname;
  
  // Domain detection
  const isPathways = hostname.includes('pilotcareerpathways.com');
  const isShortage = hostname.includes('pilotshortage.org');
  const domain = isPathways ? 'pathways' : isShortage ? 'shortage' : 'recognition';
  
  // Inject domain header for downstream
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set('x-domain-source', domain);
  
  // Domain-specific redirects
  if (domain === 'pathways' && path === '/') {
    return NextResponse.redirect(new URL('/pathways', request.url));
  }
  
  return NextResponse.next({
    request: { headers: requestHeaders },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
```

---

## Domain-Specific Configuration

### Environment Variables

```bash
# .env.development
VITE_DOMAIN_SOURCE=recognition  # Override for local testing

# Domain-specific API endpoints
VITE_API_PATHWAYS=https://pilotcareerpathways.com/api
VITE_API_SHORTAGE=https://pilotshortage.org/api
VITE_API_RECOGNITION=https://pilotrecognition.com/api
```

### Domain Configuration Object

```typescript
// lib/domain-config.ts
export const domainConfig = {
  recognition: {
    brandName: 'PilotRecognition',
    primaryColor: '#c41e3a', // Red
    logo: '/logos/recognition-logo.svg',
    features: ['wallet', 'verification', 'enterprise', 'full'],
    auth0ClientId: process.env.VITE_AUTH0_RECOGNITION_CLIENT_ID,
  },
  pathways: {
    brandName: 'Pilot Career Pathways',
    primaryColor: '#00b4d8', // Cyan
    logo: '/logos/pathways-logo.svg',
    features: ['wallet', 'programs', 'pathways', 'matching'],
    auth0ClientId: process.env.VITE_AUTH0_PATHWAYS_CLIENT_ID,
  },
  shortage: {
    brandName: 'Pilot Shortage Alliance',
    primaryColor: '#ff9f1c', // Amber
    logo: '/logos/shortage-logo.svg',
    features: ['stories', 'ucf', 'advocacy', 'anonymous'],
    auth0ClientId: process.env.VITE_AUTH0_SHORTAGE_CLIENT_ID,
  },
};
```

---

## Component-Level Domain Switching

### Domain-Aware Navbar

```typescript
// components/domains/BrandSwitchWrapper.tsx
export function BrandSwitchWrapper({ children }: { children: React.ReactNode }) {
  const { domain } = useDomainDetection();
  const config = domainConfig[domain];
  
  return (
    <div className="domain-wrapper" data-domain={domain}>
      <style>{`
        :root {
          --domain-primary: ${config.primaryColor};
          --domain-logo: url(${config.logo});
        }
      `}</style>
      {children}
    </div>
  );
}
```

### Feature Gating

```typescript
// components/FeatureGate.tsx
export function FeatureGate({ 
  feature, 
  children, 
  fallback = null 
}: FeatureGateProps) {
  const { domain } = useDomainDetection();
  const hasFeature = domainConfig[domain].features.includes(feature);
  
  return hasFeature ? <>{children}</> : <>{fallback}</>;
}

// Usage
<FeatureGate feature="enterprise" fallback={<UpgradePrompt />}>
  <EnterpriseDashboard />
</FeatureGate>
```

---

## Database RLS with Domain Context

### Setting Domain Context

```typescript
// lib/supabase.ts
export async function setDomainContext(supabase: SupabaseClient, domain: DomainSource) {
  await supabase.rpc('set_domain_context', { domain_source: domain });
}

// SQL function
CREATE OR REPLACE FUNCTION set_domain_context(domain_source text)
RETURNS void AS $$
BEGIN
  PERFORM set_config('app.domain_source', domain_source, true);
END;
$$ LANGUAGE plpgsql;
```

### RLS Policy Example

```sql
-- profiles table RLS
CREATE POLICY "domain_boundary" ON profiles
  FOR ALL
  USING (
    domain_source = current_setting('app.domain_source', true)
    OR domain_source IS NULL
    OR current_setting('app.is_super_admin', true) = 'true'
  );
```

---

## Testing Domain Detection

### Local Testing Override

```typescript
// hooks/useDomainDetection.ts (testing variant)
export function useDomainDetection(override?: DomainSource) {
  const [domain, setDomain] = useState<DomainSource>(override || 'recognition');
  
  useEffect(() => {
    if (override) {
      setDomain(override);
      return;
    }
    
    // Check URL param first (for testing)
    const params = new URLSearchParams(window.location.search);
    const testDomain = params.get('test_domain') as DomainSource;
    
    if (testDomain && ['recognition', 'pathways', 'shortage'].includes(testDomain)) {
      setDomain(testDomain);
    } else {
      setDomain(getDomainFromHostname(window.location.hostname));
    }
  }, [override]);
  
  return { domain, ... };
}
```

---

## Related Documents

- [01-multi-domain-architecture.md](./01-multi-domain-architecture.md) — High-level architecture
- [10-infrastructure-summary.md](./10-infrastructure-summary.md) — Complete infrastructure details

---

**Document Version:** 1.0  
**Last Updated:** June 2, 2026
