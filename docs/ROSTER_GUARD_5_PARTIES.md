# Roster Guard: The 5 Parties
## Who's Involved in the Handshake

**Date:** May 19, 2026  
**Classification:** Stakeholder Map — The 5-Party Ecosystem

---

## The Complete Cast

```
┌─────────────────────────────────────────────────────────────────┐
│                    THE 5-PARTY HANDSHAKE                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│   [1] AVIATOR/PILOT          [2] AVIATION OPERATOR              │
│       (Party A)                (Party B)                        │
│       Data Owner               Enterprise Subscriber              │
│           │                           │                         │
│           │  ┌───────────────────────┐ │                         │
│           └──┤   [5] NEUTRAL DOMAIN  │─┘                         │
│              │   pilotrecognition.com  │                         │
│              │   Stateless Switchboard   │                         │
│              └───────────┬─────────────┘                         │
│                          │                                      │
│          ┌───────────────┴───────────────┐                    │
│          ▼                               ▼                    │
│   [3] FLIGHT DATA STORE         [4] AVIATION TRAINING          │
│       (IDP Endpoint 1)             ORGANISATION                │
│       Electronic Logbook           (IDP Endpoint 2)            │
│       ForeFlight/LogTen Pro        Simulator Center            │
│       CAE/FlightSafety                                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Party 1: The Aviator / Pilot

**Designation:** Party A — The Data Owner

**Who they are:**
- You
- Any captain/first officer using the platform
- The pilot wanting to prove currency

**Their role:**
- **Ultimate gatekeeper**
- Workflow cannot start without their action
- Must log in via Auth0
- Must click "Consent"
- **Holds the keys** to open temporary data lines

**Their action:**
1. Log in via Auth0
2. Click "Consent"
3. Select providers (ForeFlight, CAE)

**Why they are happy:**
- Prove legally current to fly
- Secure roster position
- Don't hand over entire logbook history
- Don't let airline dig through private files
- **100% control** over their data

---

## Party 2: The Aviation Operator

**Designation:** Party B — The Enterprise Subscriber

**Who they are:**
- Commercial Airline (Philippine Airlines, Cebu Pacific)
- Cargo Carrier (FedEx, DHL)
- Corporate Jet Charter Company
- Any company needing to assign pilots

**Their role:**
- **Initiates the request** through domain dashboard
- Needs to assign pilot to high-value flight leg
- Usually tomorrow morning's flight
- Must verify legal compliance

**Their action:**
1. Log into enterprise dashboard
2. Enter pilot identifier
3. Request Roster Guard check
4. Pay transaction fee
5. Receive Green/Red result

**Why they are happy:**
- Instant verified "Green Light"
- Confirms pilot legal to fly under aviation law
- **Protected from multi-million dollar regulatory fines**
- Eliminates scheduling errors
- No manual paperwork chase

---

## Party 3: The Flight Data Store

**Designation:** IDP Endpoint 1 — Electronic Logbook Node

**Who they are:**
- Independent digital logbook platforms
- **ForeFlight**
- **LogTen Pro**
- Other electronic logbook providers

**Their role:**
- **Live data source** for recent flight history
- Stores pilot's daily flight entries
- Counts takeoffs and landings
- Tracks 90-day currency

**Their action (automated):**
1. Receive API ping via consent token
2. Query pilot's logbook records
3. Count 90-day landings
4. Verify PIC/SIC status
5. Return data count to platform

**Why they are happy:**
- Software becomes **critical piece of airline operations**
- Receive automated micro-fee for hosting secure endpoint
- Integration increases platform value
- No manual intervention required

---

## Party 4: The Aviation Training Organisation

**Designation:** IDP Endpoint 2 — Simulator Center

**Who they are:**
- Heavy-iron training facilities
- **CAE** (Canadian Aviation Electronics)
- **FlightSafety International**
- Other approved training organizations (ATOs)

**Their role:**
- Hold official digital receipts of check-rides
- Store simulator telemetry profiles
- Confirm type rating currency status
- Answer temporary request for validation

**Their action (automated):**
1. Receive API ping via consent token
2. Query pilot's training records
3. Check simulator check-ride dates
4. Verify LPC/OPC currency
5. Return certification status

**Why they are happy:**
- **Completely removes manual administrative burden**
- No more printing/stamping/emailing physical records
- No more answering 500 phone calls/day
- Staff focuses on running simulators, not paperwork
- Automated digital receipts

---

## Party 5: The Neutral Domain Router

**Designation:** pilotrecognition.com — You and Andrew

**Who they are:**
- The stateless switchboard operator
- Platform owners and developers

**Their role:**
- **Do NOT take sides**
- **Do NOT write data**
- **Do NOT employ anyone**
- Act as secure digital cockpit
- All parties meet for split-second validation
- **Orchestrate the handshake**

**Their action:**
1. Receive consent from Pilot (Party A)
2. Receive request from Operator (Party B)
3. Route to Logbook Node (Party 3)
4. Route to ATO Node (Party 4)
5. Collect certified results
6. Display Green/Red to Operator
7. **Wipe session clean**
8. **Collect 77% platform utility cut**

**Why you are happy:**
- Provide massive operational value to global aviation
- **100% insulated from data liability**
- Zero data storage = zero breach risk
- Zero knowledge = zero legal exposure
- **77% platform utility cut** on every transaction
- **The safest board in the world to play on**

---

## The Handshake Flow

```
         ┌──────────────────────────────────────────┐
         │                                          │
    ┌────┴────┐                                ┌────┴────┐
    │ PILOT   │ ──► 1. Auth0 Login            │OPERATOR │
    │ Party A │ ──► 2. Click Consent ───────► │ Party B │
    │         │         │                      │         │
    └────┬────┘         ▼                      └────┬────┘
         │      ┌──────────────┐                     │
         │      │   DOMAIN     │                     │
         │      │   Party 5     │ ◄─────────────────┘
         │      │   Switchboard │    3. Request Check
         │      └──────┬────────┘
         │             │
         │      ┌──────┴──────┐
         │      ▼             ▼
         │  ┌────────┐   ┌────────┐
         │  │LOGBOOK │   │  ATO   │
         └──►│ Party 3│   │ Party 4│
            │(Fore)  │   │ (CAE)  │
            └────────┘   └────────┘
                 │             │
                 └──────┬──────┘
                        ▼
                 ┌──────────────┐
                 │   DOMAIN     │
                 │   Party 5     │
                 │   Collects    │
                 │   Results     │
                 └──────┬───────┘
                        ▼
                 ┌──────────────┐
                 │  OPERATOR    │
                 │  Party B      │
                 │  Sees GREEN  │
                 └──────────────┘
```

---

## Why All 5 Parties Participate

| Party | Pain | Solution | Payoff |
|-------|------|----------|--------|
| **Pilot** | Airlines digging through private files | Controlled consent | 100% data sovereignty |
| **Operator** | Regulatory fines, scheduling errors | Instant Green Light | Legal compliance, no fines |
| **Logbook** | Not integrated into ops | Critical infrastructure | Micro-fees, platform value |
| **ATO** | 500 phone calls/day, paperwork | Automated digital receipts | Focus on training, not admin |
| **Domain** | Liability exposure | Stateless design | 77% cut, zero risk |

---

## The Value Exchange

```
PILOT gives:          CONSENT
PILOT gets:           ROSTER SECURITY + DATA CONTROL

OPERATOR gives:       TRANSACTION FEE
OPERATOR gets:        LEGAL COMPLIANCE + GREEN LIGHT

LOGBOOK gives:        API ACCESS
LOGBOOK gets:         MICRO-FEE + CRITICAL STATUS

ATO gives:            DATA VERIFICATION
ATO gets:             AUTOMATION + NO PHONE CALLS

DOMAIN gives:         STATELESS SWITCHBOARD
DOMAIN gets:          77% PLATFORM UTILITY CUT
```

---

## Summary

**The 5 Parties:**

1. **Pilot** — Data owner, gatekeeper, consenter
2. **Operator** — Enterprise subscriber, requester, payer
3. **Logbook** — IDP endpoint 1, flight data source
4. **ATO** — IDP endpoint 2, training verification
5. **Domain** — Neutral router, orchestrator, revenue collector

**The Result:**
> "Five parties. One handshake. Zero liability. 77% cut."

**Status:** 5-party ecosystem mapped.
