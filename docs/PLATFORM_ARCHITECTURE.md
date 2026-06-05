# PilotRecognition Platform Architecture
**Document Reference: PR-ARCH-001 · Version 1.0 · Effective: 20 May 2026**

---

## The Airport Metaphor — Full Airspace Blueprint

### Terminal 1 — Aviation Pathways Ltd (The Command Center)
- Every pilot enters here. Account creation, passkeys (Google/Apple), encrypted vault (Supabase + Firebase dual-engine), payment processing.
- **Legal Role:** Independent Data Controller of the application/infrastructure layer only — not the controller of the pilot's raw credential data.
- Zero-knowledge: hosts only AES-256-GCM ciphertext. Cannot read, alter, or decrypt payloads.

**Terminal 1 Pre-Flight Checks (Legal Protection):**
1. **Age Firewall** — Minors under 18 cannot give legally binding consent (GDPR / RA 10173). Age-verification gate required at account creation.
2. **Multi-Engine Consent** — Explicit consent logged when pilot selects Firebase + Supabase dual-engine storage.
3. **Session Isolation** — Aggressive automated session timeouts (15 min inactivity). Full client-side cache flush on logout.
4. **Skybridge Signage** — Legal notice on submission button differentiating Terminal 2 (unverified self-declared data) vs Terminal 3 (Veremark verification flow initiated).
5. **Metadata Retention Limit** — System logs (IP, login timestamps, routing events) purged after maximum 12–24 months.

**Terminal 1 Construction Status — DCA v1.6 (20 May 2026):**

| Item | Status | Notes |
|---|---|---|
| DCA Modal (PR-DCA-001 v1.6) | ✅ Live | 12 articles, scroll-lock, checkbox, "Clear for Departure" button |
| Public DCA Page `/data-controller-agreement` | ✅ Live | 12 articles, Article 11 Cadet Gate, Article 12 Governing Law |
| Logout vault key flush | ✅ Built | `clearVaultKey()` in `AuthContext.logout()` |
| Cadet Track Mode gate (T3 block) | ✅ Built | `PathwaysPageModern.tsx` — blocks Student + minor DOB |
| Session expiry check (server-side) | ✅ Built | `SecurityMiddleware.isSessionExpired()` |
| CSRF protection | ✅ Built | HttpOnly cookie, validated on POST |
| AES-256-GCM client-side encryption | ✅ Built | `vault.ts`, encrypts before every Supabase write |
| Age firewall at signup (18+) | ✅ Built | DOB + occupation pre-capture in `BecomeMemberPage`; precise age calc; Cadet Track Mode alert; `cadet_track` stamped in Auth0 `appState` |
| Multi-Engine storage selector UI | ✅ Built | `StorageEngineCard` in `/settings` → `profiles.storage_preference` column; risk confirmation modal for single-engine downgrade |
| Idle session timeout (client-side) | ✅ Built | 15-min idle timer in `AuthContext` → `clearVaultKey()` + `logout()` |
| Vault key wipe on tab close | ✅ Built | `beforeunload` → `clearVaultKey()` in `AuthContext` |
| Skybridge legal notice on T2 submit | ✅ Built | `PathwaysPageModern` intercepts Submit Interest → Skybridge Clearance modal with Art. 4 legal text before `handleSubmitInterest` fires |
| Log retention cron (12-month purge) | ✅ Built | `purge_expired_logs()` pg_cron job (`dca-v16-purge-activity-logs`, daily 00:00 UTC) — hard-deletes `user_activity_log` + `security_events` rows > 12 months |

**Final Check-Ride — Implementation Backlog (from DCA v1.6 review):**

1. **Engine Check (Art. 3 — Multi-Engine):** When user selects Multi-Engine config, client must simultaneously push AES-256-GCM ciphertext to both Firebase and Supabase endpoints. Single-engine selection must log the risk acknowledgment against the pilot's profile timestamp.

2. **Age/License Intercept (Art. 11 — Cadet Gate):** Auth0 post-registration hook must read `date_of_birth` or `pilotCategory = 'Student'`. If either condition triggers, frontend blocks Terminal 3 "Submit Interest" buttons and displays Cadet Track message. Currently: DOB is collected post-Auth0 in profile wizard — minor can create account before gate fires. Fix: require DOB before Auth0 redirect or enforce in post-registration webhook.

3. **Token Timeout (Art. 5 — Session Flush):** Auth0 tokens must aggressively flush local browser memory on logout AND inactivity. Wire `window.addEventListener('beforeunload', clearVaultKey)` in `AuthContext`. Add client-side idle timer (15 min keyboard/mouse inactivity → auto-logout). Shared airport/flight school terminals are the primary threat vector.

---

### Terminal 2 — The Open/Free Lounge
- Unverified pilots with free accounts submit self-declared profiles to regional operators and flight schools that do not require pre-clearance.
- No Veremark flight triggered. No CAA/ATO polling. Pass-through corridor only.
- **Legal Role:** Pass-Through Router — liability transfers to the operator the moment they open the profile.

---

### Terminal 3 — International Standards Zone (Pathways)
- Locked premium gates for major airlines and operators ($1,000/yr Enterprise lease).
- Pilots must be Veremark-verified (5-point check) to submit interest.
- Airlines see 5 full profiles (pilot-consented) + a list of 50 restricted interest submissions as the teaser before paying.
- **Legal Role:** Platform Orchestrator — displays objective Pilot Miles Score. No algorithmic profiling.

**5-Point Verification Package (Terminal 3 entry requirement):**
1. Verified Pilot License (authenticated by CAA)
2. Current Currency Status (recency requirements met)
3. Class 1 Medical Currency (up to date and active)
4. No Falsified Hours (cross-referenced against ATO/Operator official training logs)
5. License Authenticity (zero forgery, CAA confirmation)

---

### Cadet Track Mode Gate (Terminal 1 → Terminal 3 Firewall)

Implemented in `PathwaysPageModern.tsx` via `cadетGateStatus`.

**Logic:**
```
IF Age < 18 OR License == "Student/SPL":
   → Allow view of Terminal 3 (Read-Only)
   → Block "Submit Interest" in Terminal 3
   → Display: "Gate Restricted — Cadet Track Mode"
   → Route to Terminal 2 (Open Lounge / Cadet Gates)
```

**Three restriction states:**

| Reason | Trigger | Gate Message |
|---|---|---|
| `minor+student` | Age < 18 AND student license | "minor student pilot" |
| `minor` | Age < 18 only | "minimum age of 18 required" |
| `student` | Student/PPL license, no CPL+ | "CPL/ATPL required" |

**Fields used:** `userProfile.date_of_birth` (age calc) + `userProfile.ratings[]` (license type check)

---

## The Veremark Flow (The Verification Flight)

- Pilot pays $99 → triggers two simultaneous Veremark orders
- **Check 1** ($13): CAAP single PEL lookup → License + Class 1 Medical + ICAO ELP + Aircraft Ratings
- **Check 2** ($9): ATO/Operator nominated by pilot → Graduate cert, course completion, flight hours (statutory declaration), logbook sign-off validity
- Veremark contacts CAA/ATO directly under pilot's explicit, direct consent agreement (pilot ↔ Veremark, not pilot ↔ Aviation Pathways Ltd)
- Result returns to Terminal 1 as **Pass/Fail verification status only** — no raw credential data stored on Aviation Pathways Ltd servers
- **Revenue:** $99 in, $22 out → ~$77 margin

**Multi-Operator Verification:** Each additional institution requires a separate check and consent. Pricing to be scoped after first flow is proven end-to-end.

---

## Legal Role Bifurcation — The Three-Party Architecture

| Entity | Role | Liability |
|---|---|---|
| **Aviation Pathways Ltd** | Platform Orchestrator / Infrastructure Controller | App layer, routing, payment, ecosystem governance |
| **The Pilot** | Credential Custodian / Data Controller of raw credentials | Holds private keys, sole owner of raw data |
| **Veremark / IDPs** | Independent Verification Controllers | Raw credential processing, CAA/ATO queries |
| **Airlines (Enterprise)** | Independent Data Controllers | Assume full HR/employment liability on profile access |
| **Supabase / Firebase** | Technical Sub-Processors (GDPR Art. 28) | Blind ciphertext storage only |
| **Auth0 / Okta** | Authentication Processor | Federated auth routing — zero pilot profile data |

---

## Enterprise Access Model ($1,000/yr Gate Lease)

- **Free preview:** Airline sees 5 full profiles (pilot-consented) + list of 50 restricted interest submissions
- **On Enterprise payment:** Full ground handling access — all 50 pilot profiles unlocked for review
- **At point of profile access:** Airline becomes Independent Data Controller. Enterprise Terms of Service explicitly states this handover.
- **Pilot Miles Score:** Objective, published verification completeness metric (not AI profiling). Example rubric: Verified License = 500pts, Class 1 Medical = 200pts, Verified Logbook = 300pts.
- **Free Boarding Pass:** Pilots with high score/status fast-tracked to airline interest pool.

**Enterprise TOS must state:**
> "Upon unlocking and accessing a pilot's verified profile, the Airline assumes the role of an Independent Data Controller. The Airline agrees to process this data in accordance with applicable employment and data protection laws. Aviation Pathways Ltd accepts no liability for the Airline's subsequent use, storage, or processing of the pilot's data."

---

## Data Controller Agreement Summary (PR-DCA-001 v1.5)

**Correct legal framing for Aviation Pathways Ltd:**
> "We are a Platform Orchestrator (Data Controller of the Infrastructure/Application layer). We do not act as a Joint Controller for raw data. We do not store unencrypted PII or medical data. Authentication is outsourced to Google Passkeys via Auth0. Verification is outsourced to Veremark as an Independent Controller via direct user consent. Data sharing with airlines transitions full Controller liability to the corporate subscriber at the point of access. Our storage uses a zero-knowledge, client-side encrypted active-active redundant architecture."

**Key Article revisions required in DCA:**
- **Article 1:** Replace "Data Processor" label with "Platform Orchestrator / Infrastructure Controller"
- **Article 3:** Designate Supabase/Firebase as Technical Sub-Processors (not co-controllers)
- **Article 4:** Codify Terminal 2 (Open Lounge) vs Terminal 3 (Verified Zone) tiered access
- **Article 8:** Reframe Aviation Safety Revocation as updating the "Public Credential Registry Status" — not reaching into the user's private vault

---

## ATO Dual-Node Architecture

ATOs operate as dual-nature Operator/Validator nodes under the Enterprise tier ($1,000/yr):

**As Operator (Inbound):** Posts instructor pathways, pulls verified CFIs and Check Airmen, manages fleet liability through verified crew.

**As Validator (Outbound):** Verifies alumni logbooks (Workflow 1), earns 5% activation credit on every verification check routed through them as the hour issuer.

**Financial Equilibrium:**
```
[ATO Pays $1,000/yr]
    │
    ├──→ Unlocks Instructor Gated Pathways
    │
    ▼
[Acts as Trusted Validation Node]
    │
    ├──→ Verifies past student logbooks
    │
    ▼
[Recoups 5% Network Toll on every check] → Self-funding subscription
```

---

## Revenue Model Summary

| Source | Amount | Notes |
|---|---|---|
| Pilot Verification | $99/pilot | $22 cost (Veremark), ~$77 margin |
| Enterprise Gate Lease | $1,000/yr per airline/operator | Unlocks full 50-pilot pool |
| Veremark split | $13 (Check 1) + $9 (Check 2) | CAAP + ATO/Operator |
| Logbook Provider | 5% per check | IDP fee for supplying verified data source |
| ATO Validator | 5% per check | Alumni verification kickback |
| Foundation Program | $49/pilot | Pilot development, mentorship |
| Transition Program | $299/pilot | ($149 for Foundation graduates) |

---

## Governing Law

- **Primary:** UAE Federal Decree-Law No. 45/2021
- **Supplementary:** EU GDPR (Regulation 2016/679) for EU/EEA residents
- **Supplementary:** Republic Act No. 10173 (Philippines DPA) for Philippine nationals
- **Dispute Resolution:** DIAC Arbitration, Dubai, UAE
- **Privacy contact:** privacy@pilotrecognition.com
