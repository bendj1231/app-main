# Two-Stage Pathway Confirmation
## The Bi-Directional Cryptographic Handshake

**Date:** May 19, 2026  
**Classification:** Core Product Feature — Secure Information Reveal System

---

## Executive Summary

The **two-stage pathway confirmation** evolves the "Pull" system into a **Bi-Directional Cryptographic Handshake**.

By splitting the pathway into:
- **Stage 1:** Requirements & Expectations (public)
- **Stage 2:** Financial Information & Perks (private, airline-controlled)

Airlines gain **total sovereignty** over proprietary financial data. Money is only revealed to exact pilots they choose to "poke."

---

## The Problem: Traditional Job Board Exposure

| Issue | Impact |
|-------|--------|
| Competitors see your rates | Rate wars, margin compression |
| Unvetted eyes on financials | Information leakage |
| Broad broadcast to all pilots | Low engagement, spam perception |
| Pilots send 100 resumes, hear silence | Demoralizing, inefficient |

---

## The Solution: Two-Stage Handshake

### Stage 1: Public Alignment (The Filter)

**Visible to All Recognition+ Members:**
```
┌─────────────────────────────────────────┐
│  PATHWAY: International Ferry Captain   │
│                                         │
│  REQUIREMENTS:                          │
│  • B737 Type Rating                     │
│  • 4,000+ Total Hours                   │
│  • EASA License                         │
│  • ICAO Level 5+                        │
│                                         │
│  [ Submit Interest ]                    │
└─────────────────────────────────────────┘
```

**What Pilots See:**
- Operational requirements
- Aircraft type
- Experience thresholds
- Regulatory needs
- **NO financial information**

**Pilot Action:**
- Reviews requirements
- Aligns profile
- Clicks **"Submit Interest"**

---

### The Poke: Airline's Direct Selection

**Airline Dashboard View:**
```
┌─────────────────────────────────────────┐
│  INTERESTED PILOTS (3 Verified)         │
│                                         │
│  1. Capt. Karl Vogt                     │
│     • 6,200 hours (PIC)                │
│     • B737, A320 Rated                   │
│     • Veremark: ✅ Verified              │
│     • [ POKE PILOT ]                     │
│                                         │
│  2. Capt. Sarah Chen                    │
│     • 5,800 hours (PIC)                │
│     • B737 Rated                       │
│     • Veremark: ✅ Verified              │
│     • [ POKE PILOT ]                     │
└─────────────────────────────────────────┘
```

**Airline Action:**
- Reviews filtered list
- Spots perfect candidate
- Hits **"Poke Pilot"**
- Creates **unique encrypted link** tied to pilot's Auth0 ID

---

### Stage 2: The Financial Unlock (The Reveal)

**Pilot Notification:**
```
┌─────────────────────────────────────────┐
│  🔴 NEW POKE FROM NOMADIC AVIATION      │
│                                         │
│  "We are highly interested in your       │
│   verified 6,200-hour profile and have   │
│   invited you to view Stage 2 of our    │
│   International Ferry Captain pathway." │
│                                         │
│  [ VIEW STAGE 2 ]                       │
└─────────────────────────────────────────┘
```

**Stage 2 Reveal (Auth0-Decrypted Only):**
```
┌─────────────────────────────────────────┐
│  STAGE 2: FINANCIAL PACKAGE             │
│  (Authorized for Capt. Karl Vogt only)  │
│                                         │
│  DAILY RATE: $1,200/day                 │
│  PER DIEM: $150/day                     │
│  BUSINESS CLASS: Included               │
│  HOTEL: 5-star, single occupancy        │
│  DURATION: 14-day rotation              │
│  ESTIMATED TOTAL: $18,900              │
│                                         │
│  [ ACCEPT CONTRACT LINE ]               │
│  [ DECLINE ]                            │
└─────────────────────────────────────────┘
```

---

## Why This Makes the Platform Indispensable

### A. Total Confidentiality for Corporate Rates

**The Problem:**
- If Jet Test knows Nomadic's rates → rate wars
- Standard corporate rate compression
- Margin erosion

**The Solution:**
- Financials locked in Stage 2
- Only hand-picked pilots see prices
- Airlines post **premium numbers confidently**
- No competitor snooping

### B. Intense Gamification for Pilots

**Traditional Job Hunting:**
```
[ Send 100 resumes ] → [ Hear silence ] → [ Depression ]
```

**Your Platform:**
```
[ Get "Poked" by elite operator ] → [ View exclusive financials ] → [ Professional validation ]
```

**Psychological Impact:**
- Direct invitation = instant validation
- "We like your verified background"
- "Come look at the money we're offering"
- Flips depressing job hunt → exciting opportunity

---

## The Stateless Security Matrix

Even with Stage 2 confirmation, architecture remains **zero-liability**:

```
[Pilot Submits Interest]
    │
    ▼
[Operator sees Name/Hours/Baseline] ← Stage 1 (Public)
    │
    ▼
[Operator Pokes Pilot]
    │
    ├──► Creates programmatic key via Auth0
    │
    ▼
[Pilot Decrypts Stage 2] ← Financial data renders in browser memory
    │
    ▼
[Session Terminated] ← Browser memory wipes. Zero data stored.
```

**Key Principles:**
1. **Airline controls access** — decides who gets Stage 2 key
2. **Auth0 passes authorization** — secure token delivery
3. **Pilot's browser decrypts** — dynamic on-the-fly rendering
4. **Platform captures 77% cut** — no data storage liability

---

## Technical Implementation

### 1. Pathway Data Structure

```typescript
interface Pathway {
  id: string;
  operator_id: string;
  
  // Stage 1: Public
  stage_1: {
    title: string;
    requirements: {
      aircraft_type: string[];
      min_hours: number;
      license_type: string[];
      language_level: string;
    };
    expectations: string; // Culture, schedule, etc.
  };
  
  // Stage 2: Private (encrypted)
  stage_2: {
    daily_rate: number;
    per_diem: number;
    travel_class: string;
    hotel_tier: string;
    duration_days: number;
    estimated_total: number;
    encrypted_payload: string; // AES-256 encrypted
  };
  
  // Access Control
  authorized_pilots: string[]; // Auth0 user IDs
  pokes_sent: PokeRecord[];
}
```

### 2. The Poke Mechanism

```typescript
interface PokeRecord {
  id: string;
  pathway_id: string;
  pilot_id: string;
  operator_id: string;
  
  created_at: string;
  expires_at: string; // 24-hour window
  
  stage_2_access_token: string; // JWT with 24h expiration
  status: 'pending' | 'viewed' | 'accepted' | 'declined' | 'expired';
}
```

### 3. Auth0 Authorization Flow

```javascript
// When operator pokes pilot
const stage2Token = await auth0.createToken({
  sub: pilot_id,
  pathway_id: pathway_id,
  poke_id: poke_id,
  scope: 'stage2:read',
  exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60), // 24 hours
});

// Pilot receives notification with token link
// On click, Auth0 validates and returns decryption key
```

### 4. Client-Side Decryption

```typescript
const decryptStage2 = async (token: string) => {
  // 1. Validate token with Auth0
  const validation = await auth0.validateToken(token);
  
  // 2. Fetch encrypted payload
  const encrypted = await fetch(`/api/pathway/stage2?token=${token}`);
  
  // 3. Decrypt in browser memory
  const decrypted = await crypto.subtle.decrypt(
    { name: 'AES-GCM', iv: encrypted.iv },
    validation.decryption_key,
    encrypted.payload
  );
  
  // 4. Render financials (never stored)
  return JSON.parse(new TextDecoder().decode(decrypted));
};
```

---

## Security Architecture

### Data Flow

| Stage | Data | Visibility | Encryption |
|-------|------|------------|------------|
| **Stage 1** | Requirements, expectations | Public | None |
| **Poke** | Pilot ID, operator ID | System only | Auth0 tokens |
| **Stage 2** | Financials, rates | Poked pilot only | AES-256 + JWT |
| **Post-Decision** | Acceptance/decline | Operator + Pilot | TLS 1.3 |

### Threat Mitigation

| Threat | Mitigation |
|--------|------------|
| Competitor sees rates | Stage 2 encrypted, poked pilots only |
| Pilot shares financials | 24-hour token, screenshot detection watermarks |
| Data breach | Stateless — no financial DB to steal |
| Man-in-the-middle | Auth0 PKCE, TLS 1.3, short-lived tokens |

---

## User Experience Flows

### Pilot Journey

```
[ Browse Pathways ]
    │
    ▼
[ See Stage 1 Requirements ]
    │
    ▼
[ Submit Interest ] ← "I'm qualified for this"
    │
    ▼
[ Wait for Poke ]
    │
    ▼
[ 🔴 NOTIFICATION: "Airline X Poked You!" ]
    │
    ▼
[ Click to View Stage 2 ]
    │
    ▼
[ Auth0 Validates Identity ]
    │
    ▼
[ Financials Decrypt & Display ]
    │
    ▼
[ 24-Hour Countdown Starts ]
    │
    ├──► [ Accept ] → Route Guard triggers
    │
    └──► [ Decline ] → Operator notified
```

### Airline Journey

```
[ Post Pathway (Stage 1) ]
    │
    ▼
[ View Interested Pilots ]
    │
    ▼
[ Review Profiles & Verifications ]
    │
    ▼
[ Click "Poke" on Best Candidate ]
    │
    ▼
[ Pilot Notified Instantly ]
    │
    ▼
[ Wait for Response (24h max) ]
    │
    ├──► [ Pilot Accepts ] → Proceed to contract
    │
    ├──► [ Pilot Declines ] → Move to next candidate
    │
    └──► [ No Response ] → Mark as "Stalled"
```

---

## Competitive Moat

### Traditional Job Boards
- Broad broadcast to all users
- No confidentiality
- Pilots spam applications
- Airlines drown in resumes
- Zero verification

### Your Platform
- **Targeted pokes** to verified pilots only
- **Total confidentiality** on financials
- **Pilots wait for invitations** (flipped dynamic)
- **Airlines review filtered, verified list**
- **Three-way cryptographic verification**

**Result:** Airlines abandon spam-based recruiting, join your network.

---

## Revenue Integration

### When Poke Triggers Revenue

| Action | Revenue Event |
|--------|---------------|
| Pilot submits interest | Free (engagement) |
| Airline pokes pilot | Free (selection) |
| Pilot accepts Stage 2 | **Route Guard fee** 💰 |
| Verification triggered | $99 split (23/5/5/67) |
| Contract finalized | **$500 success fee** 💰 |

### The 24-Hour Window Economics

- **Fast acceptance** = Route Guard triggered → immediate revenue
- **Slow response** = "Stalled" → airline moves on → next poke → more revenue
- **High velocity** = more transactions → higher platform utility cut

---

## Marketing Positioning

### For Airlines
> "Total confidentiality on your rates. Only hand-picked pilots see your financials. No competitor snooping."

### For Pilots
> "Get 'poked' by elite operators. Receive exclusive invitations to view premium contract rates. No more resume spam."

### Platform Tagline
> "The secure handshake between verified pilots and confidential operators."

---

## Conclusion

The **Two-Stage Pathway Confirmation** achieves:

1. **Total rate confidentiality** — airlines protected from competitors
2. **Maximum pilot engagement** — gamified invitation system
3. **Bi-directional verification** — both parties authenticated
4. **Stateless security** — zero data liability maintained
5. **Revenue optimization** — every poke drives toward monetization

**The perfectly balanced bi-directional gate:**
- Security ✓
- Privacy ✓
- Corporate competition protection ✓
- Platform revenue ✓

**Status:** Architecture complete. Ready for Auth0-gated Stage 2 implementation.
