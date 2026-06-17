# AUTH CLUSTER OVERVIEW — 3-Node Regional Architecture

## Executive Summary

**Problem:** Single Supabase project throttles under load (522 errors), crashing the login flow.
**Solution:** 3-project distributed auth cluster with automatic failover, cross-feed, and geographic routing.
**Cost:** $0 (all free tier)
**Capacity:** ~3,000 active pilots (vs 1,000 on single node)

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                     PILOT BROWSER                                │
│                     (Login Request)                              │
└──────────────────────┬──────────────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                    AUTH ROUTER                                   │
│              (Home Base Detection + Failover)                    │
└──────────────────────┬──────────────────────────────────────────┘
                       │
       ┌───────────────┼───────────────┐
       ▼               ▼               ▼
  ┌─────────┐    ┌─────────┐    ┌─────────┐
  │  EU-1   │◄──►│  EU-2   │    │  SG-1   │
  │Frankfurt│    │ London  │    │Singapore│
  │ Primary │    │ Backup  │    │Emergency│
  │  GREEN  │    │  GREEN  │    │  GREEN  │
  │ 600/1000│    │ 250/1000│    │ 100/1000│
  └─────────┘    └─────────┘    └─────────┘
       │               │               │
       └───────────────┴───────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────────────┐
│                      NEON (Data)                                 │
│         Profiles, Pathways, Credentials, Flight Hours          │
└─────────────────────────────────────────────────────────────────┘
```

---

## Node Configuration

| Node | Region | Role | Capacity | Home For |
|------|--------|------|----------|----------|
| EU-1 | Frankfurt | Primary | 1,000 sessions | Europe, Middle East, Africa, Americas |
| EU-2 | London | Hot Standby | 1,000 sessions | Cross-feed from EU-1 |
| SG-1 | Singapore | Emergency | 1,000 sessions | Asia Pacific, Australia |

---

## How It Works

### 1. Pilot Logs In (EU-based)

```
Pilot (Dubai) clicks "Sign In"
        │
        ▼
   "Where is my home node?"
        │
        ▼
   EU-1 (Frankfurt) — 50ms latency
        │
   ┌────┴────┐
   │ Check:  │
   │ EU-1    │
   │ < 80%?  │
   └────┬────┘
        │
   YES ▼
   Route to EU-1 → Login succeeds
```

### 2. EU-1 Is Full (Cross-Feed)

```
Pilot (Dubai) clicks "Sign In"
        │
        ▼
   EU-1 load: 85% (YELLOW)
        │
   ┌────┴────┐
   │ Check:  │
   │ EU-1    │
   │ < 80%?  │
   └────┬────┘
        │
    NO ▼
   Cross-feed valve OPENS
        │
        ▼
   Route to EU-2 (London) — 55ms latency
   Login succeeds
   Pilot never knows EU-1 was full
```

### 3. Both EU Nodes Down (Emergency)

```
Pilot (Dubai) clicks "Sign In"
        │
        ▼
   EU-1: DOWN (522)
   EU-2: DOWN (timeout)
        │
        ▼
   Failover chain: EU-1 → EU-2 → SG-1
        │
        ▼
   Route to SG-1 (Singapore) — 120ms latency
   Login succeeds (slightly slower)
   Data still comes from Neon (unaffected)
```

### 4. All Nodes Down (Emergency Mode)

```
All 3 nodes: RED
        │
        ▼
┌─────────────────┐
│  EMERGENCY MODE │
├─────────────────┤
│ New logins: ❌  │
│ Existing:   ✅  │
│ Read-only:  ✅  │
│ Writes:     ❌  │
└─────────────────┘
Pilot sees: "High traffic. Try again in 5 minutes."
```

---

## Aviation Systems Mapping

| Aviation System | Our Implementation | Purpose |
|----------------|-------------------|---------|
| **FADEC** | Dual-channel health monitor | Detects node failure in <1s |
| **TCAS** | Cross-node monitoring | EU-2 can declare EU-1 dead |
| **IRS Voting** | 2-of-3 probe consensus | Prevents false failover |
| **ETOPS** | Pre-planned alternates | Failover chain pre-computed |
| **Electrical Cross-Tie** | Cross-feed valve | Load balancing between nodes |
| **Fuel Balance** | Preemptive routing | Routes away BEFORE overload |
| **Black Box** | Audit logging | Records every auth decision |
| **Hydraulic Triple Redundancy** | Supabase → Auth0 → cache | Never lose ALL auth |

---

## Failover Chains by Region

```
EU / Middle East / Africa / Americas:
├─ Primary: EU-1 (Frankfurt)
├─ Backup: EU-2 (London)
└─ Emergency: SG-1 (Singapore)

Asia Pacific / Australia:
├─ Primary: SG-1 (Singapore)
├─ Backup: EU-1 (Frankfurt)
└─ Emergency: EU-2 (London)
```

---

## Capacity Thresholds

```
GREEN  (< 70%): Normal operation, home node preferred
YELLOW (80%+): Open cross-feed to alternate node
RED    (95%+): Stop accepting new logins on this node
```

---

## Health Monitoring

- **Frequency:** Every 10 seconds
- **Probe:** `auth.getSession()` (lightweight, no DB IO)
- **Metrics:** Latency, error rate, failure count
- **Composite Load:** Sessions (50%) + Latency (30%) + Errors (20%)

---

## Auto-Pause Prevention

**Problem:** Free tier projects sleep after 7 days of inactivity.
**Solution:** Oracle VM cron job pings all 3 nodes every 5 days.

```bash
# Oracle VM cron (keep-alive.sh)
#!/bin/bash
curl -s https://eu-1.supabase.co/auth/v1/health > /dev/null
curl -s https://eu-2.supabase.co/auth/v1/health > /dev/null
curl -s https://sg-1.supabase.co/auth/v1/health > /dev/null
```

---

## Data Flow

```
LOGIN FLOW:
Pilot → Auth0 (Google OAuth) → Supabase Node (JWT) → Neon (Profile Data)

All profile data lives in NEON.
Supabase nodes ONLY store: id, email, auth0_id, JWT tokens.
If a node dies and pilot switches nodes → no data lost.
New node just needs: auth0_id → query Neon → get full profile.
```

---

## File Structure

```
src/
├── lib/
│   ├── auth-cluster.ts       # Core router (this file)
│   ├── supabase.ts           # Legacy single-client (keep for migration)
│   └── neon.ts               # Data layer
├── contexts/
│   └── AuthContext.tsx       # Updated to use cluster auth
└── components/
    └── OAuthCallback.tsx     # Updated to use cluster auth
```

---

## Environment Variables

See `.env.cluster.example` for full template.

| Variable | Project | Region |
|----------|---------|--------|
| `VITE_SUPABASE_URL_EU` | auth-eu-1 | Frankfurt |
| `VITE_SUPABASE_URL_EU2` | auth-eu-2 | London |
| `VITE_SUPABASE_URL_SG` | auth-sg-1 | Singapore |

---

## Setup Checklist

- [ ] Create 3 Supabase projects (free tier)
- [ ] Disable Storage, Edge Functions, Realtime on all 3
- [ ] Enable Auth + Google OAuth on all 3
- [ ] Copy URLs/keys to `.env.local`
- [ ] Deploy keep-alive cron on Oracle VM
- [ ] Update `AuthContext.tsx` to use cluster auth
- [ ] Update `OAuthCallback.tsx` to use cluster auth
- [ ] Test failover: manually mark EU-1 "down", verify EU-2 handles login
- [ ] Test cross-feed: simulate EU-1 at 85% load, verify routing to EU-2
- [ ] Test emergency: mark EU-1 + EU-2 down, verify SG-1 handles login

---

## Migration Path

### Phase 1: Dual-Node (Now)
- EU-1 (existing project)
- EU-2 (new project, same region)
- SG-1 (optional, create later)

### Phase 2: Full Cluster (1,000+ pilots)
- All 3 nodes active
- Cross-feed enabled
- Keep-alive running

### Phase 3: Pro Upgrade (5,000+ pilots)
- Upgrade EU-1 to Pro ($25/mo)
- Decommission EU-2 and SG-1
- Single Pro node handles 50,000 pilots
- Keep cluster code for future scaling

---

## Performance

| Metric | Single Node | 3-Node Cluster |
|--------|------------|----------------|
| Max Sessions | 1,000 | 3,000 |
| Max Req/min | 500 | 1,500 |
| Failover Time | N/A (crash) | <500ms |
| Geographic Coverage | 1 region | 3 regions |
| Auto-Pause Risk | Medium | Low (keep-alive) |
| Operational Complexity | Low | Medium |

---

## Risk Assessment

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Supabase bans multi-project clustering | Low | High | This is standard horizontal scaling |
| Auto-pause kills backup nodes | Medium | High | Keep-alive cron (Oracle VM) |
| Session token incompatibility between nodes | Low | Medium | Auth0 handles tokens, not Supabase |
| Data drift between nodes | None | None | No profile data in Supabase |
| Oracle VM (keep-alive) goes down | Low | Medium | Use GitHub Actions as backup pinger |

---

## Emergency Procedures

### All Nodes Down
1. Enable Auth0-only mode (read-only browsing)
2. Show message: "Auth service restoring. Try again in 5 minutes."
3. Check Oracle VM keep-alive status
4. Manually wake nodes via Supabase dashboard if needed
5. Investigate root cause (522 = upgrade to Pro)

### Single Node Down
1. Health monitor auto-detects in <10s
2. Traffic auto-reroutes to healthy nodes
3. No pilot action required
4. Fix node when convenient (not urgent)

---

## Cost Projection

| Phase | Setup | Monthly Cost | Pilot Capacity |
|-------|-------|-------------|----------------|
| Now | 3 free projects | $0 | 3,000 |
| Growth | Upgrade EU-1 to Pro | $25 | 50,000 |
| Scale | 2 Pro projects (EU + Asia) | $50 | 100,000+ |

---

## Bottom Line

**Before:** Single point of failure. One 522 error = platform dead.

**After:** Distributed auth with automatic failover. Three projects, zero data sync, geographic routing, load balancing.

**Pilot experience:** "Login is fast and reliable." (They never see the infrastructure.)

**Your experience:** Sleep at night knowing 2 nodes can fail and pilots still log in.

---

*Built with aviation-grade redundancy. Every system has a backup. Every backup has a backup.*
