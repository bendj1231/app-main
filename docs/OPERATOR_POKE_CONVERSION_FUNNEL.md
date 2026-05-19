# Operator Poke Conversion Funnel
## The Social Proof-Driven Upgrade Path

**Date:** May 19, 2026  
**Classification:** Core Conversion Mechanism — Free-to-Paid Upgrade Flow

---

## Executive Summary

**Operators can poke ANY pilot** — free-tier or Recognition+. The difference is what the pilot can see in response.

The **poke from an operator** becomes the **conversion trigger** that drives free pilots to upgrade through **social proof**, not feature lists.

---

## The Funnel Flow

```
[Operator searches pilot database]
    │
    ├──► Sees Recognition+ pilot with 6,000 hours, verified badge
    │       └──► POKES → Pilot gets instant Stage 2 unlock
    │
    └──► Sees free-tier pilot with 5,500 hours, potential match
            │
            └──► POKES ANYWAY (talent is talent)
                    │
                    ▼
        [Pilot notification: "🔴 NOMADIC AVIATION is interested in your profile!"]
                    │
                    ▼
        [Pilot clicks to view offer]
                    │
                    ├──► Sees: "Operator wants to discuss opportunity"
                    │
                    ├──► Sees: Stage 1 requirements (public)
                    │
                    └──► Hits paywall: "Verify credentials to unlock financial details"
                    │
                    ▼
        [Call to Action]
                    │
                    ├──► "Pay $99 to verify and view full offer"
                    │
                    └──► "Upgrade to Recognition+ for 1 year of premium access"
                    │
                    ▼
        [Pilot pays $99]
                    │
                    ▼
        [Verification triggered → Track A + Track B]
                    │
                    ▼
        [Pilot becomes Recognition+ member]
                    │
                    ▼
        [Stage 2 unlocks: "$1,200/day + Business Class"]
                    │
                    ▼
        [Pilot can now ACCEPT or DECLINE the poke]
```

---

## The Psychology: Social Proof Over Features

### Traditional SaaS Conversion
```
[Feature list] → [Pricing page] → [Hope they buy]
↓ Low conversion, high friction
```

### Your Platform Conversion
```
[Real operator interest] → [Validation & urgency] → [Immediate upgrade]
↓ High conversion, social proof driven
```

**The Key Insight:**
> "An airline is interested in YOU" is more powerful than "Here are our features."

---

## The Three-Tier Response System

| Pilot Tier | Operator Sees | When Poked | Pilot Experience |
|------------|---------------|------------|------------------|
| **Free/Unverified** | Hours, basic profile, "Upgrade to respond" badge | Gets notification: "Verify to view offer" | Stage 1 visible, Stage 2 locked until $99 paid |
| **Recognition+** | Verified badge, full history, "Preferred" status | Gets notification: "View exclusive offer now" | Immediate Stage 2 unlock, can accept/decline |
| **Recognition+ with EBT** | Video scores, behavioral ratings, "Elite" status | Gets notification: "Priority pathway invitation" | VIP treatment, operators bidding against each other |

---

## Why Operators Poke Free-Tier Pilots

### The Operator Mindset
> "I need a B737-rated captain with 5,000+ hours for a Manila-Singapore ferry. This pilot has 5,500 hours and the right type rating. I don't care if they're free-tier — I want to talk to them."

### The Platform Enables:
- **Talent-first discovery** — not paywall-gated discovery
- **Operators find matches** regardless of pilot tier
- **Conversion opportunity** created organically
- **No friction** for operator (they can poke anyone)

---

## The Win-Win-Win-Win

| Stakeholder | What They Get |
|-------------|---------------|
| **Free Pilot** | Validation that operators want them + clear path to unlock |
| **Recognition+ Pilot** | Immediate access to opportunities + preferred status |
| **Operator** | Access to ALL qualified pilots, not just paid ones |
| **Platform** | Conversion revenue + ATO credit trigger + 77% cut |
| **ATO** | $5 credit notification (from verification) |

---

## The Upgrade Message

### What Free Pilot Sees When Poked

```
┌─────────────────────────────────────────┐
│  🔴 NEW INTEREST FROM NOMADIC AVIATION  │
│                                         │
│  "We've reviewed your profile and are    │
│   interested in discussing a B737       │
│   ferry opportunity with you."          │
│                                         │
│  [ VIEW REQUIREMENTS ] ← Unlocked      │
│                                         │
│  ─────────────────────────────────     │
│                                         │
│  💰 FINANCIAL PACKAGE                    │
│                                         │
│  [ VERIFY TO UNLOCK ] ← Locked 🔒      │
│                                         │
│  "Verify your credentials to view       │
│   daily rates, per diems, and travel    │
│   class. 3-minute verification."        │
│                                         │
│  [ Pay $99 - Verify Now ]               │
│                                         │
└─────────────────────────────────────────┘
```

**The Message:**
- **Validation**: "An airline wants YOU"
- **Urgency**: "Verify to see the money"
- **Simplicity**: "3-minute verification"
- **Clear ROI**: "$99 unlocks $1,200/day opportunity"

---

## Technical Implementation

### 1. Operator Search Results

```typescript
interface PilotSearchResult {
  id: string;
  display_name: string;
  total_hours: number;
  aircraft_types: string[];
  tier: 'free' | 'recognition_plus' | 'recognition_plus_ebt';
  
  // Always visible
  basic_profile: {
    hours: number;
    ratings: string[];
    location: string;
  };
  
  // Tier indicators
  tier_badge: string; // "Verified" | "Preferred" | "Elite"
  can_poke: true;   // Operators can ALWAYS poke
  
  // CTA based on tier
  pilot_cta: string; // "Upgrade to respond" | "View offer" | "Priority invite"
}
```

### 2. Poke Mechanism (Universal)

```typescript
const pokePilot = async (pilotId: string, operatorId: string) => {
  // 1. Create poke record (works for ANY pilot tier)
  const poke = await createPoke({
    pilot_id: pilotId,
    operator_id: operatorId,
    pathway_id: pathwayId,
    status: 'sent',
    created_at: new Date().toISOString()
  });
  
  // 2. Send notification to pilot
  await notifyPilot(pilotId, {
    type: 'operator_interest',
    title: `${operatorName} is interested in your profile`,
    message: `View their requirements and unlock financial details`,
    cta: pilotTier === 'free' ? 'verify_to_unlock' : 'view_offer',
    poke_id: poke.id
  });
  
  // 3. If free pilot, queue conversion tracking
  if (pilotTier === 'free') {
    await trackConversionOpportunity(pilotId, operatorId, poke.id);
  }
};
```

### 3. Pilot Response Flow

```typescript
const handlePokeResponse = async (pokeId: string, pilotTier: string) => {
  if (pilotTier === 'free') {
    // Free pilot hits paywall
    return {
      view: 'paywall',
      message: 'Verify your credentials to view this opportunity',
      cta: 'Pay $99 - Verify Now',
      conversion_value: 99
    };
  }
  
  if (pilotTier === 'recognition_plus') {
    // Recognition+ sees full offer
    return {
      view: 'stage_2_full',
      stage_1: pathway.requirements,
      stage_2: pathway.financials, // Decrypted
      actions: ['accept', 'decline', 'negotiate']
    };
  }
};
```

### 4. Conversion Tracking

```typescript
// When free pilot pays $99 after being poked
const trackPokeDrivenConversion = async (
  pilotId: string, 
  pokeId: string, 
  verificationId: string
) => {
  // 1. Log conversion source
  await logConversion({
    pilot_id: pilotId,
    source: 'operator_poke',
    poke_id: pokeId,
    time_to_convert: minutesSincePoke,
    verification_id: verificationId
  });
  
  // 2. Notify operator that pilot upgraded
  await notifyOperator(operatorId, {
    type: 'pilot_upgraded',
    message: 'Your pilot has verified their credentials and can now view your offer',
    poke_id: pokeId
  });
  
  // 3. ATO credit triggered (from verification)
  await generateATOCredit(pilotId, verificationId, 4.95);
};
```

---

## Conversion Metrics to Track

| Metric | Target | Why It Matters |
|--------|--------|----------------|
| **Poke-to-Upgrade Rate** | 40%+ | Social proof effectiveness |
| **Time to Upgrade** | < 2 hours | Urgency of operator interest |
| **Free Pilot Poke Rate** | 30% of all pokes | Operator willingness to engage unverified |
| **Post-Upgrade Accept Rate** | 60%+ | Quality of poke-matched opportunities |

---

## The Viral Loop

```
[Operator pokes free pilot]
    │
    ▼
[Pilot upgrades to see offer]
    │
    ▼
[Pilot tells other pilots: "I got poked by [Airline] and upgraded"]
    │
    ▼
[Word spreads: "You need Recognition+ to get operator attention"]
    │
    ▼
[More free pilots upgrade proactively]
    │
    ▼
[More verified pilots in pool]
    │
    ▼
[More operators subscribe to access them]
```

**The Result:** Operator interest drives pilot upgrades → creates viral growth.

---

## Conclusion

**The Operator Poke Funnel:**

1. **Universal access** — operators can poke ANY pilot
2. **Tiered response** — free hits paywall, paid sees full offer
3. **Social proof** — "Airline wants YOU" drives conversion
4. **Organic growth** — operator interest creates viral upgrade loop
5. **Platform wins** — every poke is a conversion opportunity

**The Key Principle:**
> "Don't lock operators out of talent. Lock the talent's RESPONSE behind verification."

**Status:** Funnel design locked. Ready for implementation.
