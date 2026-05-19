# Roster Guard: Live Duty & Simulator Currency Check
## Real-Time Operational Reality System

**Date:** May 19, 2026  
**Classification:** Core Operational Feature — Live Currency Verification

---

## The Distinction

**First Service (Credential Check):**
- Battleground: Historical data
- Pilot claims 1,500 hours
- Dispute: Who wrote the wrong number in the past

**This Service (Roster Guard):**
- Battleground: **Live operational reality**
- Plane scheduled to push back in hours
- Dispute: **Fresh data lag** — system out of sync with real world

---

## The Main Concern: "Illegal Tracking" vs. "Dead Legality"

### The Stakes Are Immediate

**Scenario:**
> Plane scheduled to push back from gate in 3 hours.

### The Airline's Concern

**The Risk:**
- System incorrectly flags pilot as "Red" (uncurrent)
- Cannot legally assign pilot to flight
- **Lose money**, flights delayed, crew schedules collapse

**The Fear:**
> "Computer says pilot is uncurrent. We can't fly. But pilot says they are current. Who is right?"

---

### The Pilot's Concern

**The Risk:**
- System shows "Red Light"
- CAE forgot to upload check-ride passing receipt from yesterday
- **Pulled from roster**, lose flight duty pay
- Mark on internal company profile

**The Fear:**
> "I just passed my sim check yesterday. System says I'm expired. I'm losing money and reputation."

---

## The Output: Live Binary Green/Red Light

### Not a Complex Report

**Cannot be:** Multi-page background report (too slow, too much data)

**Must be:** Live, binary cryptographic status flag

### The Binary Output

```json
{
  "status": "GREEN",  // or "RED"
  "legally_compliant": true,  // or false
  "parameters": {
    "landings_90_day": 4,  // ≥3 required
    "sim_check_current": true,
    "medical_valid": true,
    "type_rating_active": true
  },
  "timestamp": "2026-05-19T06:00:00Z",
  "expires_at": "2026-05-19T06:15:00Z"
}
```

### Status Meanings

| Status | Meaning | Action |
|--------|---------|--------|
| **🟢 GREEN (True)** | Legally Compliant to Fly | Clear for roster assignment |
| **🔴 RED (False)** | Non-Compliant / Action Required | Hold flight, investigate |

**All parameters must match:**
- ≥3 landings in 90 days
- Valid simulator check
- Current medical
- Active type rating

---

## What Triggers a Dispute Here?

### Fresh Data Lag

**Scenario:**
1. Pilot walks out of simulator bay at 2:00 AM after passing recurrent check-ride
2. 6:00 AM: Airline runs Roster Guard check
3. System rebounds **RED LIGHT**
4. Why? CAE database hasn't synced new passing receipt yet
5. From system's perspective: currency expired at midnight

**The Reality Gap:**
```
[Real World]                    [Digital System]
    │                                  │
    ├──► Pilot passed sim check        ├──► System shows EXPIRED
    ├──► Current as of 2:00 AM         ├──► No update received
    └──► Ready to fly                  └──► BLOCKS assignment
    │                                  │
    ▼                                  ▼
[THE TRUTH]                         [THE LAG]
```

**The Trigger:** System says RED, pilot knows they are GREEN.

---

## Dispute Resolution: The Infantry Defense

### The 3-Step Routing Rule

**Chess strategy saves your life:**
- Platform never dragged into argument
- Veremark handles verification manual override
- Domain renders final certified outcome

### The Routing Matrix

```
[Roster Guard Hits RED LIGHT]
    │
    ▼
[Pilot Clicks: "Dispute Live Status"]
    │
    ▼
[The UCF Dispute Routing Rule Matrix]
    │
    ┌───────────────────┴───────────────────┐
    ▼                                       ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│   NODE A: LOGBOOK GAP   │     │  NODE B: TRAINING GAP   │
├─────────────────────────┤     ├─────────────────────────┤
│ • Ticket → Veremark     │     │ • Ticket → Veremark     │
│ • Check device status   │     │ • Ping ATO helpdesk     │
│ • Pilot refreshes sync  │     │ • ATO uploads stamp     │
└─────────────────────────┘     └─────────────────────────┘
    │                                       │
    └───────────────────┬───────────────────┘
                        ▼
            [Veremark Overrides Webhook]
                        │
                        ▼
            [Domain Flashes True GREEN LIGHT]
```

---

### Case A: The Logbook Gap (Landings Missing)

**The Issue:**
- Electronic logbook app was offline
- Didn't sync last 3 flights
- Veremark couldn't count required 3 landings
- System shows RED

**The Resolution:**

```
Step 1: Pilot clicks "Dispute"
    │
Step 2: Interface instructs:
    │   "Open your logbook app"
    │   "Force cellular cloud sync"
    │   "Click 'Retry'"
    │
Step 3: Pilot forces sync
    │
Step 4: Veremark repings endpoint
    │
Step 5: Verifies updated landing count
    │
Step 6: Screen rebounds to GREEN ✅
```

**Time to resolve:** 2-3 minutes

---

### Case B: The Training Gap (Sim Receipt Delayed)

**The Issue:**
- ATO server hasn't updated digital account
- Passing grade not synced yet
- System shows RED
- Pilot has physical paperwork in hand

**The Resolution:**

```
Step 1: Pilot clicks "Dispute Live Status"
    │
Step 2: System creates urgent dispute ticket
    │   → Routed directly to Veremark 24/7 operational node
    │
Step 3: Pilot uploads photo
    │   → Signed physical simulator grading sheet
    │   → Paperwork examiner handed in the bay
    │   → Uploaded straight into Veremark frame
    │
Step 4: Veremark staff reviews image
    │
Step 5: Manually overrides API flag
    │   → On Veremark compliance dashboard
    │
Step 6: Veremark shoots updated certified TRUE payload
    │   → Back to platform switchboard
    │
Step 7: Domain screen instantly flashes GREEN ✅
    │
Step 8: Airline releases flight roster
    │
Step 9: Plane pushes back on time ✅
```

**Time to resolve:** 5-10 minutes (with manual verification)

---

## The Grandmaster Result

### During Entire Dispute

**Platform did NOT:**
- ❌ Audit a single landing
- ❌ Verify a single simulator stamp
- ❌ Argue with pilot or airline
- ❌ Store physical documents
- ❌ Make operational decisions

**Platform DID:**
- ✅ Provide interface for dispute signal
- ✅ Route to Veremark infantry
- ✅ Render final certified outcome
- ✅ Maintain absolute neutrality
- ✅ Protect personal liability
- ✅ Collect transaction split

**The Architecture:**
```
[Pilot] ──► [Dispute Signal] ──► [Platform Interface]
                                      │
                                      ▼
                               [Veremark Infantry]
                                      │
                                      ├──► Manual verification
                                      ├──► Override API flag
                                      └──► Certified TRUE payload
                                      │
                                      ▼
                               [Platform Render]
                                      │
                                      ▼
[Airline] ◄── [GREEN LIGHT] ◄── [Certified Outcome]
```

---

## Technical Implementation

### Live Status Check Endpoint

```typescript
interface RosterGuardCheck {
  // Input
  pilot_id: string;
  airline_id: string;
  flight_leg: {
    aircraft_type: string;
    departure: string;
    arrival: string;
    scheduled_time: string;
  };
  
  // Real-time query
  veremark_query: {
    landings_90_day: number;  // Live from ForeFlight
    sim_check_date: string;   // Live from CAE
    medical_expiry: string;   // Live from FAA/CAAP
    type_rating_status: string; // Live from registry
  };
  
  // Binary output
  result: {
    status: 'GREEN' | 'RED';
    legally_compliant: boolean;
    parameters: {
      landings_sufficient: boolean;  // ≥3
      sim_current: boolean;
      medical_valid: boolean;
      type_active: boolean;
    };
    timestamp: string;
    expires_at: string; // 15-minute window
  };
}
```

### Dispute Resolution Flow

```typescript
const resolveLiveDispute = async (dispute: RosterGuardDispute) => {
  // 1. Route to Veremark (not platform handling)
  const veremarkTicket = await createVeremarkTicket({
    type: dispute.dispute_type, // 'LOGBOOK_GAP' | 'TRAINING_GAP'
    pilot_id: dispute.pilot_id,
    current_status: dispute.system_status,
    claimed_status: dispute.pilot_claim,
    supporting_evidence: dispute.uploads // Photo of sim sheet
  });
  
  // 2. Veremark handles based on type
  if (dispute.dispute_type === 'LOGBOOK_GAP') {
    // Automated resolution
    await veremark.forceLogbookSync(dispute.pilot_id);
    const refreshed = await veremark.repingLogbook(dispute.pilot_id);
    return refreshed.landings_90_day >= 3 ? 'GREEN' : 'RED';
  }
  
  if (dispute.dispute_type === 'TRAINING_GAP') {
    // Manual resolution
    const manualVerification = await veremark.manualReview({
      photo_evidence: dispute.uploads[0],
      examiner_signature: true,
      passing_grade: true
    });
    
    if (manualVerification.validated) {
      await veremark.overrideApiFlag(dispute.pilot_id, 'SIM_CURRENT');
      return 'GREEN';
    }
  }
};
```

---

## Summary

**Roster Guard vs. Credential Check:**

| Aspect | Credential Check | Roster Guard |
|--------|------------------|--------------|
| **Timeframe** | Historical | **Live operational** |
| **Data type** | Past hours | **Current currency** |
| **Output** | Detailed report | **Binary Green/Red** |
| **Dispute trigger** | Wrong number | **Fresh data lag** |
| **Speed** | Hours/days | **Minutes** |
| **Stakes** | Hiring decision | **Flight delayed NOW** |

**The Promise:**
> "Real-time operational reality. Binary clearance status. Veremark infantry handles fresh data lag disputes. Platform maintains neutrality, collects 77%."

**Status:** Live currency check architecture complete.
