# High-Value Verification Fields
## The $100 Intelligence Dashboard

**Date:** May 19, 2026  
**Classification:** Core Data Architecture — Free-View Premium Intelligence

---

## Executive Summary

**The commercial hook:** Operators get **$100 worth of premium verified intelligence for FREE** inside their dashboard.

**Justification:** The pilot already paid $100/year for Veremark to pull this data. The operator's $1,000/year subscription unlocks view access at no additional cost per pilot.

**Route Guard only triggers when booking a live flight leg.**

---

## The Four High-Value Free-View Fields

### 🌟 Recommended Undervalued Pilots

**What it is:** Algorithmic filter tag for high-hour veterans overlooked by major airline headhunters.

**Who gets tagged:**
- 15-year career flight instructors
- Regional turboprop captains
- 6,000+ hour stick-and-rudder masters
- Experienced but "undervalued" by traditional markets

**Operator Value:**
```
┌─────────────────────────────────────────┐
│  ⭐ RECOMMENDED UNDERVALUED              │
│                                         │
│  This pilot's profile indicates:        │
│  • High experience-to-recognition ratio│
│  • Available for premium contract work  │
│  • Traditionally overlooked by majors    │
│  • Potential value arbitrage opportunity│
│                                         │
│  [ VIEW FULL PROFILE ]                  │
│                                         │
└─────────────────────────────────────────┘
```

**The Signal:** Elite talent at a glance. Bypass corporate noise.

---

### 📈 Foreshadowed Experience

**What it is:** Capability projection based on current flight trends — not static history.

**How it works:**
```
┌─────────────────────────────────────────┐
│  📊 FORESHADOWED EXPERIENCE              │
│                                         │
│  Current Capability Projection:         │
│                                         │
│  • Multi-engine time (last 12 mo): 400h │
│  • Complex aircraft: Actively current   │
│  • International ops: Recent experience│
│  • Instrument currency: Current          │
│                                         │
│  Readiness Assessment:                  │
│  ✅ Ready for twin-turboprop delivery    │
│  ✅ Sharp on complex systems            │
│  ⚠️ Needs 50h for heavy jet transition  │
│                                         │
└─────────────────────────────────────────┘
```

**The Value:** Ferry company sees instructor has **400 hours multi-engine in last 12 months** — proving operational sharpness, not just historical ratings.

---

### 🌐 National Registry Status

**What it is:** Verified country of issue for primary medical and licensing authority.

**What Veremark pulls:**
```
┌─────────────────────────────────────────┐
│  🌍 NATIONAL REGISTRY STATUS             │
│                                         │
│  Primary Authority: FAA (United States)  │
│  License Status: 🟢 Active               │
│  Medical Status: 🟢 Current Class 1     │
│  Last Verified: 2026-05-15              │
│                                         │
│  Secondary Authorities:                 │
│  • EASA: 🟢 Validated (UK CAA)         │
│  • CAAP: 🟢 Active (Philippines)        │
│                                         │
│  Flag-State Compatibility:              │
│  ✅ N-registered aircraft               │
│  ✅ EASA-registered with validation      │
│  ✅ RP-registered with CAAP license     │
│                                         │
└─────────────────────────────────────────┘
```

**The Value:** Asset manager knows **baseline legal requirements match** before initiating cross-border route check.

---

### 💼 Current Occupation

**What it is:** Day-to-day active aviation employment status.

**How it displays:**
```
┌─────────────────────────────────────────┐
│  💼 CURRENT OCCUPATION                   │
│                                         │
│  Title: Chief Flight Instructor          │
│  Organization: Regional Aviation Academy │
│  Tenure: 15 years continuous             │
│  Status: 🟢 Actively Employed            │
│  Availability: Immediate                 │
│                                         │
│  Operational Context:                   │
│  • 200+ days/year flight instruction     │
│  • Multi-engine curriculum lead          │
│  • Advanced instrument training focus    │
│                                         │
│  Contract Capacity:                     │
│  ✅ Available for international ferry    │
│  ✅ Experienced in time-critical ops      │
│  ✅ Professional side-hustle ready        │
│                                         │
└─────────────────────────────────────────┘
```

**The Re-Valuation:**
- ❌ Not an "unemployed freelancer"
- ✅ **Highly active, fully current operational asset**
- ✅ Premium side-hustle availability confirmed

---

## The Commercial Math

### To the Asset Operator

**Traditional Cost:**
```
Manual background screening per pilot: $100
50 pilots checked: $5,000
```

**Your Platform Cost:**
```
Subscription: $1,000/year
Pilots viewed: Unlimited
Value received: $100 per pilot viewed
ROI: 500%+
```

**The Promise:**
> "Filter, sort, and analyze elite Undervalued Master Pilots absolutely free."

---

### To the Serious Pilot

**The Investment:**
```
Recognition+ subscription: $100/year
```

**The Return:**
```
Single 3-day international ferry: $3,000-5,000+
Subscription pays for itself: 30-50x over
```

**The Psychology:**
- $100/year forces **serious commitment**
- Funds Veremark's heavy lifting
- First delivery leg = 300-500% ROI

---

## The Stateless Data Rebound

### Even with Free $100 Views, Zero Liability

```
[Serious Pilot Pays $100/yr]
    │
    ▼
[Veremark runs heavy annual verification]
    │
    ▼
[Data rests at Veremark network]
    │
    ▼
[Operator opens dashboard]
    │
    ▼
[Platform streams to browser memory:]
    ├──► Name
    ├──► Hours
    ├──► Foreshadowed Experience
    ├──► National Registry
    └──► Current Occupation
    │
    ▼
[Tab closes]
    │
    ▼
[Memory wipes clean]
    │
    ▼
[Zero data retained on domain]
```

### Who Pays for What

| Party | Pays | Gets |
|-------|------|------|
| **Pilot** | $100/yr | Verified badge + platform access |
| **Veremark** | Covered by pilot | Heavy data processing |
| **Operator** | $1,000/yr | FREE view of $100/pilot intelligence |
| **Platform** | Stateless routing | **77% cut** on both subscriptions + Route Guard |

---

## Technical Implementation

### Database Schema

```typescript
interface PilotVerificationFields {
  profile_id: string;
  
  // 🌟 Recommended Undervalued
  undervalued_score: number; // 0-100 algorithmic score
  undervalued_tag: boolean;
  undervalued_reason: string[]; // ["High experience", "Low market recognition"]
  
  // 📈 Foreshadowed Experience
  foreshadowed: {
    recent_multi_engine_hours: number; // Last 12 months
    complex_aircraft_current: boolean;
    international_ops_recent: boolean;
    instrument_currency_current: boolean;
    readiness_assessment: string; // "Ready for turboprop" | "Needs 50h for heavy jet"
  };
  
  // 🌐 National Registry
  registry: {
    primary_authority: string; // "FAA", "EASA", "CAAP"
    license_status: 'active' | 'suspended' | 'expired';
    medical_status: 'current' | 'expired';
    last_verified: string; // ISO date
    secondary_authorities: {
      authority: string;
      status: string;
    }[];
    flag_state_compatibility: string[]; // ["N-reg", "EASA-reg", "RP-reg"]
  };
  
  // 💼 Current Occupation
  occupation: {
    title: string;
    organization: string;
    tenure_years: number;
    employment_status: 'active' | 'transitioning' | 'seeking';
    availability: 'immediate' | '30_days' | '60_days' | 'unavailable';
    operational_context: string[]; // ["200+ days/year", "Multi-engine lead"]
    contract_capacity: string[]; // ["International ferry ready"]
  };
  
  // Metadata
  verification_source: 'veremark';
  last_updated: string;
  data_value_usd: 100;
}
```

### Dashboard Display Component

```typescript
const PilotIntelligenceCard = ({ pilot }: { pilot: PilotVerificationFields }) => {
  return (
    <div className="pilot-card">
      {/* Header */}
      <div className="card-header">
        <h3>Capt. {pilot.name}</h3>
        {pilot.undervalued_tag && (
          <span className="badge-undervalued">⭐ Recommended Undervalued</span>
        )}
        <span className="badge-verified">🟢 Veremark Verified</span>
      </div>
      
      {/* Core Stats */}
      <div className="core-stats">
        <div className="stat">
          <label>Total Hours</label>
          <value>{pilot.total_hours}</value>
        </div>
        <div className="stat">
          <label>PIC Hours</label>
          <value>{pilot.pic_hours}</value>
        </div>
      </div>
      
      {/* $100 Intelligence (Free View) */}
      <div className="intelligence-panel">
        <div className="section">
          <h4>📈 Foreshadowed Experience</h4>
          <p>Multi-engine (12mo): {pilot.foreshadowed.recent_multi_engine_hours}h</p>
          <p>Status: {pilot.foreshadowed.readiness_assessment}</p>
        </div>
        
        <div className="section">
          <h4>🌐 National Registry</h4>
          <p>Primary: {pilot.registry.primary_authority}</p>
          <p>Status: {pilot.registry.license_status}</p>
          <p>Compatible with: {pilot.registry.flag_state_compatibility.join(', ')}</p>
        </div>
        
        <div className="section">
          <h4>💼 Current Occupation</h4>
          <p>{pilot.occupation.title}</p>
          <p>{pilot.occupation.organization} ({pilot.occupation.tenure_years} years)</p>
          <p>Available: {pilot.occupation.availability}</p>
        </div>
      </div>
      
      {/* Value Badge */}
      <div className="value-badge">
        💰 $100 Intelligence Value — INCLUDED
      </div>
      
      {/* Actions */}
      <div className="actions">
        <button className="poke">POKE PILOT</button>
        <button className="details">VIEW DETAILS</button>
      </div>
    </div>
  );
};
```

---

## The Perfect Commercial Loop

```
[Pilot pays $100 → Gets verified]
    │
    ▼
[Veremark pulls 4 high-value fields]
    │
    ▼
[Operator pays $1,000 → Views unlimited]
    │
    ▼
[Each pilot view = $100 value delivered FREE]
    │
    ▼
[Operator sees complete intelligence]
    │
    ▼
[Makes informed poke decision]
    │
    ▼
[Books flight leg → Route Guard triggered]
    │
    ▼
[Platform collects 77%]
    │
    ▼
[Session ends → Zero data retained]
```

**The Velvet Rope:**
- High-value data traded safely
- Ephemeral viewing
- Incredible profitability
- Zero liability

---

## Conclusion

**The Four Fields Deliver:**

1. **Recommended Undervalued** — Elite talent identification
2. **Foreshadowed Experience** — Current capability projection
3. **National Registry** — Legal baseline verification
4. **Current Occupation** — Professional status confirmation

**The Economics:**
- Pilot: $100/yr investment → 30-50x return on first leg
- Operator: $1,000/yr → Unlimited $100 value views
- Platform: 77% cut on both + Route Guard

**The Promise:**
> "A perfect digital velvet rope where high-value data is traded safely, ephemerally, and incredibly profitably."

**Status:** High-value field architecture complete.
