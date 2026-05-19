# Roster Guard: Input Perspective
## The 5-Second Handshake (What Pilot Actually Inputs)

**Date:** May 19, 2026  
**Classification:** User Experience — Zero-Data Input Model

---

## The Key Insight

**Pilot does NOT manually type text or upload files into platform.**

**Why this matters:**
- Manual input = platform becomes data warehouse
- Ruins "Zero-Knowledge Software Utility" defense
- Forces platform to store data

**The genius:** Pilot only clicks "Consent via Third-Party Identity Token"

---

## The 5 Parties

### Party 1: The Aviator / Pilot (Data Owner)

**Who:** You or any captain/first officer

**Role:** Ultimate gatekeeper

**Action:**
1. Log in via Auth0
2. Click "Consent"
3. Select providers

**Why happy:**
- Prove legal currency to fly
- Secure roster position
- Don't hand over entire logbook history
- Don't let airline dig through private files

---

### Party 2: The Aviation Operator (Enterprise Subscriber)

**Who:** Commercial airline, cargo carrier, corporate jet charter

**Role:** Initiates request via dashboard to assign pilot to flight leg

**Why happy:**
- Instant verified "Green Light"
- Confirms pilot legal to fly
- Protected from multi-million dollar regulatory fines
- Eliminates scheduling errors

---

### Party 3: Flight Data Store / Electronic Logbook Node

**Who:** ForeFlight, LogTen Pro

**Role:** Live data source for recent flight history

**Action:** When consent fires, API securely counts 90-day takeoffs/landings

**Why happy:**
- Software becomes critical to airline operations
- Receives automated micro-fee for secure endpoint

---

### Party 4: Aviation Training Organisation / Simulator Center

**Who:** CAE, FlightSafety International

**Role:** Holds official digital receipts of check-rides and simulator telemetry

**Action:** Servers answer temporary request to confirm type rating currency active

**Why happy:**
- Removes manual administrative burden
- No more printing/stamping/emailing physical records
- Staff focuses on running simulators

---

### Party 5: Neutral Domain Router (pilotrecognition.com)

**Who:** You and Andrew

**Role:** Stateless switchboard operator

**What you DON'T do:**
- ❌ Take sides
- ❌ Write data
- ❌ Employ anyone

**What you DO:**
- ✅ Provide secure digital cockpit
- ✅ All parties meet for split-second validation
- ✅ Massive operational value
- ✅ 100% insulated from data liability
- ✅ Collect 77% platform utility cut

---

## What You "Input" on Platform (The 5-Second Handshake)

### Step 1: Auth0 Authentication

**You type:**
- Username
- Password

**Into:** Auth0 secure frame (IdP1)

**Confirms:** You are exactly who you say you are

```
┌─────────────────────────────────────────┐
│  🔐 SECURE LOGIN (Auth0)                 │
│                                         │
│  Username: [______________]             │
│  Password: [______________]             │
│                                         │
│  [ LOG IN ]                             │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 2: The Consent Click

**Window pops up:**
> "Do you authorize pilotrecognition.com to temporarily read your 90-day landing currency and latest Simulator Proficiency Check?"

**You click:** "I Consent"

```
┌─────────────────────────────────────────┐
│  📋 AUTHORIZATION REQUEST                │
│                                         │
│  Operator [Airline Name] requests:       │
│                                         │
│  • 90-day landing currency                │
│  • Latest simulator proficiency check     │
│                                         │
│  Duration: Single use, 15 minutes       │
│                                         │
│  [ ✅ I CONSENT ]  [ DECLINE ]          │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 3: Secure Node Selection

**You select from dropdown:**
- Logbook Node: ForeFlight
- Sim Node: CAE Hub

```
┌─────────────────────────────────────────┐
│  🔗 SELECT DATA SOURCES                  │
│                                         │
│  Electronic Logbook:                    │
│  ☑ ForeFlight                            │
│  ☐ LogTen Pro                            │
│                                         │
│  Simulator Center:                        │
│  ☑ CAE Hub                               │
│  ☐ FlightSafety International           │
│                                         │
│  [ CONFIRM SELECTION ]                  │
│                                         │
└─────────────────────────────────────────┘
```

**That's your ENTIRE input footprint.**

---

## The Stateless Rebound (What Happens Next)

### Domain Backend Actions

```
[Your 3-Click Input]
    │
    ├──► 1. Auth0 Login
    ├──► 2. Click Consent
    └──► 3. Select Providers
    │
    ▼
[Domain takes cryptographic consent token]
    │
    ▼
[Throws out temporary data cords]
    │
    ├──► Pings ForeFlight (reads 90-day PIC landings)
    └──► Pings CAE (reads unexpired sim check pass)
    │
    ▼
[Pulls the match]
    │
    ▼
[Displays result to operator]
    │
    ▼
[Wipes session clean]
```

---

## The Underlying Data (What Must Exist in External Accounts)

**You don't input this on platform — but it must exist in your external accounts:**

### A. Inside Your Electronic Logbook (ForeFlight/LogTen Pro)

**Required entries (last 90 days):**

| Field | Requirement | Example |
|-------|-------------|---------|
| **Date & Times** | Logged in UTC | 2026-05-19 08:30Z |
| **Aircraft Type** | Must match fleet | A320 |
| **Registration** | Tail number | RP-C1234 |
| **Pilot Function** | PIC or SIC | PIC |
| **Day Landings** | Explicit count | 8 |
| **Night Landings** | Separate count (need 3) | 4 |

**Why broken down:** Night currency rules require 3 distinct night stops

---

### B. Inside Your ATO Node (CAE/FlightSafety)

**Required digital receipt entries:**

| Field | Requirement | Example |
|-------|-------------|---------|
| **FSTD Session Date** | Last simulator evaluation | 2026-05-15 |
| **Device Qualification Number** | FAA/EASA/CAAP tracking | FFS-A320-1234 |
| **Session Duration** | Total hours in box | 4.0 |
| **Remarks & Endorsements** | Check Airman signature | OPC/LPC Pass - Capt. Smith |

---

## The Input Loop Summary

### Visual Flow

```
[YOUR INPUT ON PLATFORM]
    │
    ├──► 1. Auth0 Login
    ├──► 2. Select ForeFlight/CAE
    └──► 3. Click "Consent"
    │
    ▼
[THE STATELESS REBOUND]
    │
    ├──► Pings ForeFlight (reads 90-day PIC landings)
    └──► Pings CAE (reads unexpired sim check pass)
    │
    ▼
[THE OPERATOR'S SCREEN]
    │
    ├──► Displays "GREEN LIGHT: Legally Clear to Assign"
    └──► Wipes clean
```

---

## Why This Satisfies Everyone

### The Global Aviation Matrix

**By ensuring:**
- Daily flight entries cleanly logged in personal logbook app
- Sim checks digitally pushed by training center

**You achieve:**

| Party | Outcome |
|-------|---------|
| **Pilot** | Protected profile, 100% control |
| **Operator** | Legally compliant crew member |
| **Platform** | 77% utility cut, perfect traffic management |

---

## Technical Implementation

### Pilot Input Schema

```typescript
interface PilotInput {
  // Step 1: Auth0 (handled externally)
  auth0_session: string; // Token from IdP
  
  // Step 2: Consent (the only data created on platform)
  consent: {
    given: boolean;
    timestamp: string;
    scope: ['landings_90_day', 'sim_currency'];
    expires_at: string; // 15 minutes
  };
  
  // Step 3: Node selection (links only, no raw data)
  selected_nodes: {
    logbook: 'foreflight' | 'logten_pro';
    simulator: 'cae_hub' | 'flightsafety';
  };
  
  // CRITICAL: No manual data entry
  // No hours typed
  // No files uploaded
  // No documents stored
}
```

### The Input Rule

```typescript
const validatePilotInput = (input: PilotInput): boolean => {
  // Check 1: Auth0 session valid
  if (!input.auth0_session) return false;
  
  // Check 2: Consent given
  if (!input.consent.given) return false;
  
  // Check 3: Nodes selected
  if (!input.selected_nodes.logbook) return false;
  if (!input.selected_nodes.simulator) return false;
  
  // Check 4: NO MANUAL DATA
  if (input.manual_hours_entered) return false; // REJECT
  if (input.files_uploaded) return false; // REJECT
  
  return true; // Input valid, proceed to rebound
};
```

---

## Summary

**The 3-Click Input:**

1. **Auth0 Login** → Identity confirmed
2. **Select Providers** → Nodes chosen
3. **Click Consent** → Authorization given

**Time to complete:** 5 seconds

**Data entered on platform:** ZERO

**Result:** Green Light, 77% cut, everyone satisfied

**The Promise:**
> "You satisfy the global aviation matrix. You walk away with a protected profile, the Operator gets a legally compliant crew member, and your platform secures its 77% utility cut for managing the traffic perfectly."

**Status:** Input perspective complete.
