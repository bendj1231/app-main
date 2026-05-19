# Invitation & Consent Workflow
## Secure On-Demand Data Viewing System

**Date:** May 19, 2026  
**Classification:** Core Security Feature — Pilot-Controlled Data Access

---

## Executive Summary

**Secure, on-demand invitation loop:** Airline manager requests → Pilot authorizes → Data streams → Ephemeral view → Auto-expires.

**Pilot-first utility:** Managers cannot browse records at will. Must request invitation. Pilot maintains 100% control.

**Addresses:** Privacy violations, audit trail compliance, session leaks.

---

## The On-Demand Invitation Workflow

### Step 1: Manager Initiates "Request to View"

**Who:** Airline operations manager or chief pilot  
**Where:** Enterprise dashboard on platform  
**Action:** Enter Pilot Identifier → Click "Send Secure Request to View"

**What they request:**
- 90-day landing logs
- Type currency verification
- Medical standing
- Recent flight block hours

```
┌─────────────────────────────────────────┐
│  REQUEST PILOT DATA                     │
│                                         │
│  Pilot ID: [______________]             │
│                                         │
│  Data requested:                        │
│  ☑ 90-day landing logs                  │
│  ☑ Type rating currency                  │
│  ☐ Medical certificate                   │
│                                         │
│  Purpose: Standard pre-flight audit       │
│                                         │
│  [ SEND SECURE REQUEST ]                │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 2: Pilot Receives Invitation

**Notification via:** Pilot-first profile link or Auth0-linked email

**What pilot sees:**
```
┌─────────────────────────────────────────┐
│  🔴 NEW DATA ACCESS REQUEST              │
│                                         │
│  From: Airline Manager [Name]             │
│  Airline: [Airline Company]             │
│                                         │
│  Requesting access to:                    │
│  • 90-day landing logs                    │
│  • Current Type Rating verification      │
│  • Aircraft Type: [B737]                │
│                                         │
│  [ VIEW DETAILS ] [ AUTHORIZE ] [ DENY ]│
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 3: Pilot Grants Cryptographic Consent

**Pilot action:**
1. Log into secure interface via Auth0
2. Review scope of request
3. Click "Authorize Temporary Access Token"

```
┌─────────────────────────────────────────┐
│  🔐 AUTHORIZE DATA ACCESS                │
│                                         │
│  You are authorizing:                   │
│  [Airline Manager Name]                 │
│                                         │
│  To view:                                 │
│  • 90-day landing logs (read-only)        │
│  • Type rating currency status           │
│                                         │
│  Access duration: 15 minutes            │
│  Expires: [Timestamp + 15min]           │
│                                         │
│  [ AUTHORIZE TEMPORARY ACCESS ]           │
│  [ DENY REQUEST ]                       │
│                                         │
└─────────────────────────────────────────┘
```

---

### Step 4: Veremark Processes the Check

**Trigger:** Consent click

**Workflow:**
```
[Platform receives consent token]
    │
    ▼
[Token dropped to Veremark]
    │
    ▼
[Veremark hooks into endpoints:]
    ├──► ForeFlight (logbook data)
    ├──► CAE (training records)
    └──► CAAP (registry status)
    │
    ▼
[Processes raw files on compliant servers]
    │
    ▼
[Compiles standard verification check]
    │
    ▼
[Passes back certified payload:]
    ├──► Verified hours
    ├──► Currency status
    └──► Compliance badge
```

---

### Step 5: Secure Rebound View

**Manager's screen refreshes:**
```
┌─────────────────────────────────────────┐
│  ✅ PILOT DATA AUTHORIZED                 │
│                                         │
│  Pilot: [Name]                           │
│  Authorization expires: 14:32 UTC       │
│                                         │
│  VERIFIED HOURS:                         │
│  • Total: 4,200 PIC                      │
│  • 90-day landings: 12                   │
│  • Type currency: CURRENT ✅             │
│  • Last check-ride: 2026-04-15 ✅        │
│                                         │
│  Status: 🟢 COMPLIANT                     │
│                                         │
│  ⚠️ This view expires in 15 minutes     │
│                                         │
└─────────────────────────────────────────┘
```

---

## Main Concern: The "Peeping Tom" Risk & Session Leaks

### The Pilot's Concern (Privacy Violation)

**Fear:**
> "I don't want airline managers constantly spying on my logbooks, flight hours, or medical details when I'm not on duty or during off-season contract negotiations."

**Requirements:**
- Data isn't being copied
- Data isn't being downloaded
- Data isn't kept in internal company files
- **100% pilot control**

**Solution:** Invitation-only, consent-required, ephemeral viewing.

---

### The Manager's Concern (Audit Trail Failure)

**Fear:**
> "I need to prove to civil aviation auditors that I had explicit, legal permission from the pilot to pull those records at that exact date and time."

**Requirements:**
- Documented consent log
- Timestamped authorization
- Audit trail for regulators
- Avoid privacy watchdog fines (National Privacy Commission)

**Solution:** Cryptographic consent tokens with full audit trail.

---

## The Output: Ephemeral "Glass Window" View

### Viewport Design

**What manager sees:**
- Clean, organized readout
- Total block hours
- Verified recent landings
- Active check-rides
- Compliance badge

### Ephemeral Bound

**Technical constraints:**
```
[Data rendered in browser memory only]
    │
    ├──► Cannot hit "Save to Server"
    ├──► Cannot download raw files
    ├──► Cannot print to PDF
    │
    ▼
[Tab closed OR 15-minute token expires]
    │
    ▼
["Glass Window" goes completely dark]
    │
    ▼
[Connection shattered]
    │
    ▼
[NO DATA REMAINS on platform OR airline server]
```

**The Promise:**
> "The moment the manager closes that tab or the 15-minute token expires, the 'Glass Window' goes completely dark. The connection is shattered, and no data remains on our domain or the airline's server."

---

## Dispute Resolution

### Scenario: Manager Views Output → Hits "Red" or Data Mismatch

```
[Manager sees red status or data mismatch]
    │
    ▼
[Pilot clicks: "Open Status Dispute"]
    │
    ▼
[Veremark handles infrastructure]
    │
    ┌────────────────────────────┴────────────────────────────┐
    ▼                                                         ▼
┌─────────────────────────────────┐       ┌─────────────────────────────────┐
│     CASE A: TIMEOUT DISPUTE     │       │     CASE B: SYNC GAP            │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ • Session expired mid-audit     │       │ • Logbook data failed to refresh│
│ • Manager distracted by call    │       │ • Cloud syncing delay            │
│ • Screen went blank             │       │ • Hours not showing correctly    │
├─────────────────────────────────┤       ├─────────────────────────────────┤
│ SOLUTION:                       │       │ SOLUTION:                       │
│ • Manager: "Request Re-Auth"    │       │ • Pilot: "Dispute Status"        │
│ • Pilot receives fresh token    │       │ • Veremark forces hard refresh   │
│ • New 15-min window opens       │       │ • Recalculates certified payload │
└─────────────────────────────────┘       └─────────────────────────────────┘
    │                                                         │
    └────────────────────────────┬────────────────────────────┘
                                 ▼
              [Clean webhook rebounds to dashboard]
```

---

### Case A: The Timeout Dispute

**The Issue:**
> Manager in middle of audit, distracted by phone call, token expired, screen went blank. Manager thinks system glitched.

**The Resolution:**
1. Manager hits "Request Re-Authorization"
2. Pilot receives fresh invitation token on phone
3. Pilot taps "Approve"
4. New, clean 15-minute window opens
5. **No data privacy rules broken**

---

### Case B: The Verification Sync Gap

**The Issue:**
> Manager looks at logbook hours, claims recent multi-engine flight block hours aren't showing up. Electronic logbook app had cloud syncing delay.

**The Resolution:**
1. Pilot hits "Dispute Status"
2. Workflow **bypasses platform code entirely**
3. Veremark automated node steps in
4. Forces hard refresh on external logbook API provider
5. Recalculates certified payload
6. Pushes corrected hour total to manager's temporary viewport

---

## The Architecture Remains Flawless

### The Perfect Digital Velvet Rope

| Stakeholder | Gets | Benefit |
|-------------|------|---------|
| **Airline Manager** | Exact validated hours & standard checks | Legal compliance |
| **Pilot** | 100% control over privacy | Pilot-first design |
| **Veremark** | Handles sync disputes & data compliance | Liability absorption |
| **Platform** | 77% commission on invitation fee | Zero data held |

---

## Technical Implementation

### Consent Token Schema

```typescript
interface DataAccessRequest {
  // Request metadata
  request_id: string;
  manager_id: string;
  airline_id: string;
  pilot_id: string;
  
  // What is requested
  requested_data: {
    landing_logs_90_day: boolean;
    type_currency: boolean;
    medical_status: boolean;
  };
  
  // Purpose
  purpose: 'standard_audit' | 'pre_flight_check' | 'contract_review';
  
  // Consent status
  status: 'pending' | 'granted' | 'denied' | 'expired';
  
  // Timestamps
  requested_at: string;
  responded_at?: string;
  expires_at?: string;
  
  // Access window
  access_token?: string;
  access_duration_minutes: 15;
  
  // Audit trail
  consent_record: {
    granted_by: string;
    ip_address: string;
    user_agent: string;
    cryptographic_signature: string;
  };
}
```

### Ephemeral View Controller

```typescript
const renderEphemeralView = (accessToken: string) => {
  // 1. Validate token
  const validation = validateAccessToken(accessToken);
  
  if (!validation.valid || validation.expired) {
    return { error: 'Access expired. Request new authorization.' };
  }
  
  // 2. Fetch certified payload from Veremark
  const payload = fetchCertifiedPayload(accessToken);
  
  // 3. Render in browser memory ONLY
  return {
    renderMode: 'client-side-only',
    data: payload,
    expiresIn: validation.remainingSeconds,
    
    // Security: Prevent storage
    allowSave: false,
    allowDownload: false,
    allowPrint: false,
    
    // Auto-destruct
    autoDestruct: true,
    destructTrigger: ['tab-close', 'timeout', 'logout']
  };
};
```

---

## Summary

**The Workflow:**

1. **Manager requests** → Must specify what, why
2. **Pilot receives** → Full transparency on who's asking
3. **Pilot authorizes** → Cryptographic consent, 15-min window
4. **Veremark processes** → Live data pull, certified payload
5. **Manager views** → Ephemeral glass window
6. **Auto-expires** → No data retained anywhere

**The Promise:**
> "You have built a perfect digital velvet rope. The airline manager gets the exact validated hours they need, the pilot maintains 100% control, Veremark handles disputes, and the platform takes 77% commission without holding a single line of raw pilot data."

**Status:** Invitation-consent workflow complete.
