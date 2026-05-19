# PIC/SIC Seat-Role Validation & Seat-Collision Detection

## The Final Fraud-Proof Layer

The **PIC/SIC seat-role validation** is the final fraud-proof layer in the three-way cryptographic triangulation system.

---

## Seat Hours Breakdown

The verification captures seat-role metadata in the `VerificationReceipt` component:

```
PIC Hours: 2.5 (Left Seat - Captain)
SIC Hours: 0   (Right Seat - Co-pilot)
```

---

## Seat-Collision Detection Logic

| Check | Result | Validation |
|-------|--------|------------|
| **Same tail number** | ✓ Valid | Multi-crew aircraft expected |
| **Same block time** | ✓ Valid | Shared flight (PIC + SIC) |
| **Same seat role** | ✗ **COLLISION** | Fraud detected — only one PIC per flight |

---

## Fraud Detection Example

**Scenario:** Two pilots claiming PIC on the same flight

```
Flight: RP-C1234
Date: 2025-04-15
Time: 08:00-10:30 (2.5 hours)

Pilot A Log: 2.5 PIC
Pilot B Log: 2.5 PIC
↓
SEAT COLLISION DETECTED!
↓
Operator Manifest (via Veremark API):
- Captain: Pilot A (PIC) ✓
- First Officer: Pilot B (SIC)
↓
Result:
- Pilot A: 2.5 PIC → 🟢 VERIFIED (matches manifest)
- Pilot B: 2.5 PIC → 🔴 FLAGGED (seat collision — SIC expected)
```

---

## Operator Manifest Cross-Check

The system validates against the **official flight release manifest** via Veremark API:

| Role | Logbook Claim | Manifest Record | Result |
|------|---------------|-----------------|--------|
| Captain | PIC | PIC | 🟢 Verified |
| First Officer | SIC | SIC | 🟢 Verified |
| Captain | PIC | SIC | 🔴 Flagged (False PIC Input) |
| First Officer | PIC | SIC | 🔴 Flagged (Seat Collision) |

---

## Protecting the Undervalued Pilot Pool

### Honest Co-Pilots
- Get **SIC hours verified** through three-way triangulation
- Build **transparent pathway to Captain upgrade**
- Logbook shows legitimate progression: SIC → PIC

### Fraudsters
- **Instantly exposed** before operator ever "pokes"
- Flagged for audit: 🔴 "Seat Collision Anomaly"
- Cannot sneak past the gate with padded logbooks

---

## The Apple Basket Analogy

> "Your apple basket remains perfectly accounted for. The platform knows exactly how many apples the airframe gave off, exactly who sat in the left seat, and exactly who sat in the right seat."

- **Airframe** = The apple tree (limited flight hours per tail number)
- **PIC** = Left seat pilot (primary responsibility)
- **SIC** = Right seat pilot (supporting role)
- **Two PIC claims** = Two people eating the same apple (impossible)

---

## Technical Implementation

### Data Fields Captured
```typescript
seat_hours_breakdown: {
  pic_hours: number;        // Pilot-in-Command (Left Seat)
  sic_hours: number;        // Second-in-Command (Right Seat)
  total_hours: number;      // Combined flight time
  aircraft_types: string[]; // Verified type ratings
}
```

### Collision Detection Algorithm
```
IF tail_number_1 = tail_number_2
   AND date_1 = date_2
   AND block_time_1 overlaps block_time_2
   AND seat_role_1 = seat_role_2 = "PIC"
THEN trigger_seat_collision_flag()
```

---

## Business Value

### For Operators ($1,000/yr Enterprise)
- Cannot afford to hire co-pilots with **padded logbooks**
- **Seat-Collision Engine** exposes fraud before "poke"
- Clean, verified data = safe hiring decisions

### For Pilots ($99 Verification)
- Honest progression: **SIC → PIC** fully documented
- No competition with fraudsters
- **Undervalued pool** protected from logbook cheats

### For Platform (77% Margin)
- **Fraud-free verification** = premium pricing justified
- Regulators trust the system = institutional adoption
- Core value proposition: **Elevate undervalued pilots**

---

## Integration with Three-Way Triangulation

```
[ PILOT LOGBOOK ]
       │
       ├── PIC Hours: 2.5
       ├── SIC Hours: 0
       └── Seat Role: "PIC"
       │
       ▼
[ ATO SCHEDULE DB ] ←── Manifest confirms: Pilot A = PIC, Pilot B = SIC
       │
       ▼
[ CAAP REGISTRY ] ←── Airframe RP-C1234 active, transponder logs match
       │
       ▼
┌─────────────────┐
│  HASH ALIGNMENT │
│  + SEAT MATRIX  │
│  VERIFICATION   │
└─────────────────┘
       │
   ┌───┴───┐
   ▼       ▼
🟢 Verified  🔴 Flagged
(PIC match)  (Seat Collision)
```

---

## Complete Verification Architecture

### Track A: Qualifications (via Veremark)
- License number
- Medical class/expiry
- Type ratings
- ICAO Level 5

### Track B: Flight Hours (via Flight Directive)
- Tail number validation
- Block hours
- **PIC/SIC breakdown** ← Seat-role validation
- Flight Release Certificate
- Hobbs meter readings

### Anti-Fraud Layers
1. **Three-way hash matching** — Pilot + ATO + CAAP
2. **Blind vault input** — ATO provides independent records
3. **Registry contradiction detection** — CAAP airframe logs
4. **Seat-collision detection** — PIC/SIC manifest validation ← **This document**
5. **Node slashing** — High failure rate = suspended privileges

---

## Conclusion

The **PIC/SIC seat-role validation** completes the fraud-proof architecture:

- ✓ Honest co-pilots protected
- ✓ Fraudsters instantly exposed
- ✓ Undervalued pilot pool elevated
- ✓ Operator trust maintained
- ✓ Platform liability eliminated

**Ready to wire up to real Helio payments.**
