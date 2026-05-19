# The Roster Guard (Rebound Service)
## Recurrent Training & Duty-Legality Tracking

**Date:** May 19, 2026

---

## Executive Summary

**Second service using the exact same "rebound" playbook:**
- Secure, client-side handshake
- Data never settles on domain
- Both sides give 100% consent
- Both sides walk away incredibly happy

**The Service:** "The Roster Guard" — Live Duty & Simulator Currency Check

---

## The Real-World Friction

### Monthly Scheduler Headache

**To legally put a captain in the A320 tomorrow, airline must prove:**
- 3 takeoffs and landings in last 90 days
- Annual Line Check / Sim check-ride valid
- Within Flight Duty Time Limitations (FTL)

**Current pain:** Endless phone calls, emails, manual lookups for charter pilots and freelancers.

---

## The "Rebound" Workflow

```
[pilotrecognition.com] ← Stateless Roster Guard
    │
    ├─► PILOT (IDP A) ← Auth0 + Logbook + CAE
    │
    ├─► OPERATOR (IDP B) ← Requests + Receives Proof
    │
    └─► THE REBOUND OUTCOME
        • Green Light Check-Ride
        • Split Settlement Fires
        • Session Safely Destroys
```

---

## Step-by-Step Workflow

### Step 1: Operator Requests Legality

**Party B (Airline/Operator):**
- Go to domain dashboard
- Enter: "Verify Captain Karl for 4-day trip block"
- Request checks: landings, sim validity, FTL compliance

### Step 2: Pilot Grants Explicit Consent

**Party A (Pilot):**
- Receive secure notification
- Log in via Auth0
- Tap "Approve"
- Authorize temporary data link (15 minutes)

### Step 3: Multi-IDP Triangulation Handshake

**Two temporary data lines:**

| Line | Source | Data |
|------|--------|------|
| **Logbook API** | ForeFlight | Recent landings (90-day count) |
| **Sim Center API** | CAE Rise | Latest sim check-ride receipt |

### Step 4: The Clean Rebound Result

**Calculation:** `Recent Landings ≥ 3 AND Sim Check = Valid`

**Output:** "Legally Clear to Assign" green badge

### Step 5: Session Self-Destructs & Split Fires

| Action | Result |
|--------|--------|
| Close window / timeout | Data stream wiped |
| Database | Nothing written |
| Payment gateway | Transaction processed |
| Platform | 77% utility cut |
| Logbook/ATO | Micro-fees |

---

## Why Both Sides Are Happy

### Pilot Benefits

| Before | After |
|--------|-------|
| Log into training folder | Single click consent |
| Print grading sheets | Private data stays hidden |
| Argue with clerks | Instant roster security |
| Chase records | Prove readiness instantly |

**Pilot loves it:** Controls the stream, data private, single-click proof.

---

### Operator Benefits

| Before | After |
|--------|-------|
| Phone calls chasing records | Real-time proof from source |
| Manual verification | Zero compliance violation risk |
| Guesswork on currency | Immutable legal shield |

**Operator loves it:** Real-time proof from source (sim center + live logbook), zero risk of authority grounding or fines.

---

## The Value Proposition

**You keep running the ultimate neutral switchboard:**
- Rebounding flawless results
- Taking platform fee
- Keeping sky safe and organized
- **77% utility cut on every transaction**

**Status:** Rebound service architecture complete.
