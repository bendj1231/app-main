# Legal Broadcast Screen
## The Stateless Intermediary Defense

**Date:** May 19, 2026

---

## Executive Summary

**What operators see:**
- Pilot Name
- Total Hours  
- Status Badge (🟢🟡🔴)

**What operators DON'T see:**
- License PDFs, passport scans, raw logbooks, addresses, medical details

**Legal result:** Stateless intermediary status. Zero liability.

---

## The 3 Legal Output States

### 🟢 Verified

```
CAPT. BENJAMIN BOWLER
Total Hours: 4,200
Status: 🟢 VERIFIED
```

**Legal standpoint:** Veremark pre-certified. Operator proceeds with confidence.

---

### 🟡 Claimed

```
JAMES PILOT
Total Hours: 1,500 (Self-Reported)
Status: 🟡 CLAIMED
⚠️ Unverified data. Proceed with caution.
```

**Legal standpoint:** Self-attested, pending verification. Operator assumes risk. Platform insulated.

---

### 🔴 Not Current

```
CAPT. MICHAEL BROWN
Total Hours: 5,100
Status: 🔴 NOT CURRENT
❌ Assignment blocked by system.
```

**Legal standpoint:** Currency lapsed. System blocks assignment. Protects operator from impound. Platform clean.

---

## Legal Fortress Design

**GDPR / Data Privacy Act Compliance:**

```
[Pilot clicks "Match"]
    │
    ▼
[Only 3 things transmit:]
    ├──► Name
    ├──► Total Hours
    └──► Status Badge
    │
    ▼
[NO license PDFs, NO passports, NO logbooks, NO addresses, NO medicals]
```

**The Bare Cupboard:** Breach finds only names, hours, badges. No sensitive data stored.

**No Peeping Tom:** Managers cannot see addresses, medicals, contact details. Only B2B essentials.

---

## Financial Transition to Route Guard

**Operator sees:**
```
🥇 Capt. Benjamin Bowler
4,200 hours | 🟢 VERIFIED
[ASSIGN TO FLIGHT]
```

**Click triggers:**
1. Route Guard paywall
2. Funds split: 77% platform
3. Veremark live validation (3 seconds)
4. Clearance issued

**Win-Win:**
- Pilot: Elite contract
- Operator: $50M asset protected
- Veremark: Processing fee + liability
- Platform: 77% cut, zero liability

---

## Legal Defense Summary

**Three Shields:**
1. Minimal data broadcast (name, hours, badge only)
2. Explicit risk flags (CLAIMED = unverified warning)
3. Active prevention (NOT CURRENT = assignment blocked)

**Court Statements:**
> "We hold only names, hours, status badges. No sensitive PII. A breach is meaningless."

> "We flag unverified data and block non-current pilots. Operators proceed at own risk only when warned."

> "We comply with GDPR by design. Minimal exposure, risk flags, prevention."

---

## Technical Schema

```typescript
interface PilotBroadcast {
  name: string;
  total_hours: number;
  status: 'verified' | 'claimed' | 'not_current';
  // NOTHING ELSE
}

const canAssign = (pilot: PilotBroadcast): boolean => {
  if (pilot.status === 'not_current') return false; // BLOCKED
  return true;
};
```

**Status:** Legal broadcast architecture complete.
