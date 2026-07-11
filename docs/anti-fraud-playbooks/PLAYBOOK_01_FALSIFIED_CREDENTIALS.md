# Anti-Fraud Playbook 01: Falsified Credentials

**Scope:** Flight logbooks, training hours, medical certificates, license records
**Mandate:** CAAP FSIS Anti-Fraud Mandate — Detection, Prevention, and Reporting
**Classification:** Internal — Compliance Use Only
**Last Updated:** 2026-07-11

---

## 1. Executive Summary

This playbook defines the verification steps to cross-reference flight logbooks, training hours, and medical certificates before any CAAP submission. It is grounded in a code-level audit of the PilotRecognition platform (codebase path: `app-main/`).

The audit identified **10 critical attack surfaces** where falsified credentials can enter the system undetected. The most severe is the absence of server-side authentication on the Worker API — any caller who knows a pilot's `auth0_id` or email can read and modify their profile, flight hours, and logbook data without presenting a valid JWT.

---

## 2. Attack Surface Map

### 2.1 Logbook Entry & Storage

| Component | Path | Risk |
|---|---|---|
| Digital Logbook Page | `components/website/components/pilot-recognition/DigitalLogbookPage.tsx` | 7,194-line component with 15+ jurisdiction-specific field sets (FAA, EASA, CASA, CAAP, ANAC, QCAA, TCCA, DGAC, CAAC, HKCAD, DGCA India). All fields are optional TypeScript interfaces — no required-field enforcement. |
| CSV Upload Parser | `hooks/useLogbookUpload.ts` | Client-side CSV parsing. Writes to `logbook_hour_tokens` table with `verification_level: 1` (self-reported) and `issuer_type: 'self_reported'`. No server-side validation of parsed values. |
| Logbook CSV Storage | `worker/src/index.ts` lines 821-843 | `saveLogbookCSV` action deletes existing CSV and inserts new one. No versioning, no audit trail of what was replaced. `deleteLogbookCSV` hard-deletes with no recovery. |
| Flight Hours Table | `worker/schema.sql` lines 97-107 | `flight_hours` table stores aggregate hours (total, PIC, instrument, night, cross-country, dual). No relationship to individual log entries. Can be updated independently of logbook entries, allowing aggregate/entry mismatch. |

### 2.2 Credential & Medical Upload

| Component | Path | Risk |
|---|---|---|
| Credential Upload Form | `components/website/components/CredentialUploadForm.tsx` | User self-reports license number, type, issue/expiry dates, issuing authority, total hours. Uploads file to Cloudinary. Status set to `pending_verification` but no automated verification pipeline exists. |
| Medical Cert Upload | `components/website/components/ame/MedicalCertUploadPage.tsx` | User self-reports medical class, authority, certificate number, dates, limitations. No AME cross-verification. Status computed client-side from expiry date only. |
| Pilot Documents Table | `lib/d1-api.ts` line 82 | `pilot_documents` is in `STUBBED_TABLES` — queries return empty array `[]`. Credential data written via `queryTable insert` goes to a table that reads back as empty. Data integrity cannot be confirmed. |
| Medical Cert Records | `MedicalCertUploadPage.tsx` lines 66-81 | Inserts to `medical_certificate_records` via generic `queryTable insert`. No server-side validation of certificate number format, issuing authority legitimacy, or date consistency. |

### 2.3 Examination Portal

| Component | Path | Risk |
|---|---|---|
| Examination Portal | `components/website/components/examinations/ExaminationPortal.tsx` | Static UI only. Exam categories, questions, passing scores, and status (`locked`/`available`/`completed`) are hardcoded in component state. No server-side exam delivery, scoring, or anti-cheat. A user can mark any exam as `completed` by modifying client state. |

### 2.4 Worker API (Backend)

| Vulnerability | Location | Severity |
|---|---|---|
| **No JWT verification** | `worker/src/index.ts` `handleApiAction` (line 77) | **CRITICAL** — `handleApiAction` reads the request body and calls `executeAction` directly. The Bearer token is sent by the client but never validated. Any caller with network access can invoke any action. |
| **SQL injection via table name** | `worker/src/index.ts` `queryTable` (line 538) | **HIGH** — Table name is interpolated directly: `SELECT * FROM ${table}`. Values are parameterized, but the table name is not. |
| **No authorization on writes** | `worker/src/index.ts` `queryTable insert` (line 571) | **CRITICAL** — Any caller can insert into any table (profiles, flight_hours, medical_certificate_records, logbook_hour_tokens) with arbitrary data. No check that the caller owns the pilot_id in the data. |
| **No rate limiting on logbook/credential writes** | `worker/src/index.ts` | **MEDIUM** — Rate limiting exists for profile mutations (2/month via `checkRateLimit`) but not for logbook entries, credential uploads, or medical certificate inserts. |
| **CORS wildcard** | `worker/src/index.ts` line 20 | **MEDIUM** — `Access-Control-Allow-Origin: '*'` allows any website to make authenticated requests to the API. |

### 2.5 Data Integrity

| Vulnerability | Location | Severity |
|---|---|---|
| **No tamper-evident logging** | All logbook tables | **HIGH** — Logbook entries can be edited or deleted without leaving an audit trail. No hash chaining, no immutable append-only log. |
| **No cross-referencing pipeline** | `logbook_hour_tokens` | **HIGH** — `verification_level: 1` (self-reported) exists but no pipeline to upgrade to level 2 (ATO-verified) or level 3 (regulator-verified). |
| **DataAccessVerifier uses mock data** | `lib/data-access-verifier.ts` lines 58-91 | **HIGH** — The verification system returns hardcoded mock pilot data from an in-memory Map. Not a real verification system. |
| **Cloudinary unsigned uploads** | `VerificationSubmissionForm.tsx` line 14 | **MEDIUM** — `enterprise_unsigned` upload preset allows anyone to upload files to the Cloudinary cloud. |

---

## 3. Detection Heuristics

The following rules should be implemented as server-side validation on every logbook entry, credential upload, and medical certificate insert. Each rule includes the specific fields to check and the threshold for flagging.

### 3.1 Logbook Entry Anomaly Detection

#### Rule L-01: Time Component Overflow
**Check:** For any flight entry, the sum of time components must not exceed total flight time.
```
day_hours + night_hours <= total_hours
ifr_hours <= total_hours
pic_hours + sic_hours + dual_hours <= total_hours
instrument_actual + instrument_simulated <= total_hours
multi_engine_hours <= total_hours
```
**Flag:** Any violation → `ANOMALY_TIME_OVERFLOW`
**Severity:** HIGH — indicates fabricated or inconsistent time logging

#### Rule L-02: PIC/Dual Conflict
**Check:** A single flight entry cannot be both PIC and Dual received simultaneously.
```
IF crew_function == 'Dual' AND pic_hours > 0 → FLAG
IF crew_function == 'PIC' AND dual_hours > 0 → FLAG
```
**Flag:** `ANOMALY_PIC_DUAL_CONFLICT`
**Severity:** HIGH — common pattern in padded logbooks where pilot logs PIC for training flights

#### Rule L-03: Night Time Computation Error
**Check:** Night time must be computed from civil twilight, not sunset.
```
IF night_hours > 0 AND departure_time AND arrival_time:
  expected_night = compute_civil_twilight_night(departure_aerodrome, arrival_aerodrome, date)
  IF abs(night_hours - expected_night) > 0.3 → FLAG
```
**Flag:** `ANOMALY_NIGHT_TWILIGHT_MISMATCH`
**Severity:** MEDIUM — may indicate copy-paste from sunset tables or fabricated night time

#### Rule L-04: Impossible Flight Duration
**Check:** Flight duration must be physically possible given departure/arrival times and distance.
```
IF departure_time AND arrival_time:
  block_time = arrival_time - departure_time
  IF total_hours > block_time → FLAG (logged more than block time)
  IF total_hours > 0 AND block_time <= 0 → FLAG (impossible time reversal)
IF faaCrossCountryDistance AND total_hours:
  estimated_min_time = distance / max_cruise_speed(aircraftType)
  IF total_hours < estimated_min_time * 0.5 → FLAG (impossibly fast)
```
**Flag:** `ANOMALY_IMPOSSIBLE_DURATION`
**Severity:** CRITICAL — indicates fabricated entries

#### Rule L-05: Solo Without Endorsement
**Check:** Solo flight requires a valid solo endorsement on file.
```
IF faaIsSolo == true OR caapPilotFunction == 'Solo':
  IF no instructor_signature OR no instructor_license_number → FLAG
  IF instructor_endorsement_expiry < flight_date → FLAG
```
**Flag:** `ANOMALY_SOLO_NO_ENDORSEMENT`
**Severity:** HIGH — regulatory violation, potential falsification of solo time

#### Rule L-06: Instrument Time Without Approach
**Check:** If instrument time is logged, at least one instrument approach should be recorded.
```
IF ifr_hours > 0 OR instrument_actual > 0 OR instrument_simulated > 0:
  IF faaInstrumentApproaches == 0 AND qcaaInstrumentActual == 0 → FLAG
```
**Flag:** `ANOMALY_IFR_NO_APPROACH`
**Severity:** MEDIUM — may indicate fabricated instrument time

#### Rule L-07: Cross-Country Distance Threshold
**Check:** Cross-country time must meet minimum distance threshold per jurisdiction.
```
FAA: > 50nm total distance (with landing at a different airport)
EASA: > 3km from departure point (PPL), > 15km (CPL)
CAAP: per CAAP-CASR Part 2
IF faaIsCrossCountry == true AND faaCrossCountryDistance < 50 → FLAG
```
**Flag:** `ANOMALY_XC_DISTANCE_INSUFFICIENT`
**Severity:** MEDIUM — padding cross-country hours

#### Rule L-08: Duplicate Entry Detection
**Check:** No two entries for the same pilot should have identical date + aircraft registration + route + hours.
```
SELECT date, aircraft_registration, route, hours, COUNT(*)
FROM logbook_entries WHERE pilot_id = ?
GROUP BY date, aircraft_registration, route, hours
HAVING COUNT(*) > 1
```
**Flag:** `ANOMALY_DUPLICATE_ENTRY`
**Severity:** HIGH — copy-paste padding

#### Rule L-09: Date Sequence Impossibility
**Check:** A pilot cannot log flights on dates that overlap or are in the future.
```
IF flight_date > today → FLAG (future flight)
IF two entries have overlapping departure/arrival times → FLAG (simultaneous flights)
```
**Flag:** `ANOMALY_DATE_IMPOSSIBLE`
**Severity:** HIGH

#### Rule L-10: Hour Rate Anomaly
**Check:** A pilot's monthly hour accumulation should not exceed physically possible limits.
```
SUM(hours) per calendar month per pilot
IF monthly_hours > 100 → FLAG (exceeds realistic monthly maximum)
IF monthly_hours > 30 AND pilot is student → FLAG (students rarely exceed 30hrs/month)
```
**Flag:** `ANOMALY_HOURS_RATE`
**Severity:** MEDIUM — may indicate batch-imported fabricated data

### 3.2 Credential Anomaly Detection

#### Rule C-01: License Number Format Validation
**Check:** License number must match the format of the declared issuing authority.
```
CAAP: ^[A-Z]{2}-[A-Z]{3}-\d{4,}$ (e.g., CA-CPL-1234)
FAA: ^\d{7}$ (e.g., 1234567)
EASA: varies by member state — check against national format
IF license_number does not match format for issuing_authority → FLAG
```
**Flag:** `ANOMALY_LICENSE_FORMAT`
**Severity:** HIGH

#### Rule C-02: License Expiry Before Issue
**Check:** Expiry date must be after issue date.
```
IF expiry_date <= issue_date → FLAG
```
**Flag:** `ANOMALY_LICENSE_DATE_INVERSION`
**Severity:** CRITICAL

#### Rule C-03: Total Hours Mismatch
**Check:** Self-reported total hours on credential upload should approximately match sum of logbook entries.
```
IF abs(credential.total_hours - SUM(logbook_entries.total_hours)) > 5.0 → FLAG
```
**Flag:** `ANOMALY_HOURS_MISMATCH`
**Severity:** HIGH — indicates either padded logbook or inflated self-reported hours

#### Rule C-04: Medical Certificate Without AME Verification
**Check:** Medical certificate must be cross-referenced with an AME (Aviation Medical Examiner).
```
IF medical_certificate_record exists AND no ame_verification_record linked → FLAG
IF certificate_number not found in CAAP/FAA/EASA AME registry → FLAG
```
**Flag:** `ANOMALY_MEDICAL_NO_AME`
**Severity:** CRITICAL — falsified medical certificates are a top fraud vector

#### Rule C-05: Medical Class Inconsistency
**Check:** Medical class must be appropriate for the license type.
```
IF license_type == 'CPL' OR 'ATPL' AND medical_class != 'Class 1' → FLAG
IF license_type == 'PPL' AND medical_class == 'Class 1' → FLAG (unusual, not impossible)
```
**Flag:** `ANOMALY_MEDICAL_CLASS_MISMATCH`
**Severity:** MEDIUM

### 3.3 Aggregate Profile Anomaly Detection

#### Rule P-01: Profile Hours vs Logbook Hours
**Check:** `profiles.total_flight_hours` should match `SUM(logbook_entries.total_hours)`.
```
IF abs(profiles.total_flight_hours - SUM(logbook_entries.total_hours)) > 2.0 → FLAG
```
**Flag:** `ANOMALY_PROFILE_LOGBOOK_MISMATCH`
**Severity:** HIGH — profile hours can be set independently of logbook via `updateProfile`

#### Rule P-02: Rapid Profile Hour Changes
**Check:** Total flight hours should not increase by more than a realistic amount between profile updates.
```
IF delta(total_flight_hours) > 100 in a single update → FLAG
IF delta(total_flight_hours) < 0 (decrease without correction note) → FLAG
```
**Flag:** `ANOMALY_RAPID_HOURS_CHANGE`
**Severity:** HIGH

---

## 4. Verification Protocol (Pre-CAAP Submission)

### 4.1 Logbook Verification Steps

| Step | Action | System Reference |
|---|---|---|
| 1 | Run all L-series detection rules against the pilot's complete logbook | Rules L-01 through L-10 |
| 2 | Cross-reference each entry's aircraft registration against the CAAP aircraft registry | External API: CAAP Aircraft Registration Database |
| 3 | Cross-reference each entry's instructor license number against the CAAP licensee database | External API: CAAP Licensee Verification |
| 4 | Verify that the ATO named in training entries is a CAAP-approved training organization | External API: CAAP ATO Directory |
| 5 | Request fuel logs from the ATO for the dates of training flights and cross-reference with logged hours | Manual process — ATO cooperation required |
| 6 | Verify examiner signatures on checkride entries against CAAP designated examiner list | External API: CAAP Designated Examiner Registry |
| 7 | Run duplicate detection across the pilot's entire logbook history | Rule L-08 |
| 8 | Generate a verification report with all flagged anomalies | Output: `verification_report_{pilot_id}_{date}.pdf` |

### 4.2 Medical Certificate Verification Steps

| Step | Action | System Reference |
|---|---|---|
| 1 | Verify certificate number format matches issuing authority | Rule C-01 |
| 2 | Cross-reference certificate number against CAAP AME registry | External API: CAAP AME Registry |
| 3 | Verify the AME who signed the certificate is currently authorized | External API: CAAP AME Authorization Status |
| 4 | Verify date consistency (issue before expiry, examination date matches) | Rule C-02 |
| 5 | Verify medical class is appropriate for the license type being sought | Rule C-05 |
| 6 | Contact the AME directly to confirm examination occurred (for high-risk cases) | Manual process |
| 7 | Check for multiple active medical certificates from different authorities (red flag) | SQL: `SELECT COUNT(*) FROM medical_certificate_records WHERE pilot_id = ? AND status = 'active'` |

### 4.3 License Verification Steps

| Step | Action | System Reference |
|---|---|---|
| 1 | Verify license number format | Rule C-01 |
| 2 | Cross-reference license number against issuing authority's verification database | External API: CAAP/FAA/EASA License Verification |
| 3 | Verify license type, issue date, and expiry match the authority's records | Manual or API |
| 4 | For foreign license conversions, verify the original license through its issuing authority | External API: respective NAA |
| 5 | Verify total hours match between self-report, logbook, and authority records | Rule C-03, Rule P-01 |
| 6 | Check for multiple license numbers from different authorities for the same person | SQL: `SELECT DISTINCT license_number FROM profiles WHERE email = ? OR full_name = ?` |

---

## 5. Prevention Controls (Implementation Roadmap)

### 5.1 Critical (Implement Immediately)

#### Control P-01: Server-Side JWT Verification
**Current state:** `handleApiAction` does not verify the Bearer token.
**Required:** Extract and verify the Auth0 JWT before `executeAction`. Use Auth0's JWKS endpoint to validate the signature. Extract `sub` (auth0_id) and enforce that the caller can only read/write their own data.
**File:** `worker/src/index.ts` — add middleware before line 78.
**Acceptance criteria:** No API action executes without a valid JWT. `sub` from JWT is compared against `pilot_id` or `auth0_id` in every write operation.

#### Control P-02: Server-Side Logbook Validation
**Current state:** No validation on logbook entries.
**Required:** Implement all L-series rules as server-side validation in the `saveLogbookCSV` and `queryTable insert` paths. Reject entries that violate CRITICAL/HIGH rules. Flag but allow entries that violate MEDIUM rules.
**File:** New module `worker/src/logbook-validator.ts`, called from `worker/src/index.ts`.

#### Control P-03: Tamper-Evident Logbook (Hash Chaining)
**Current state:** Logbook entries can be edited/deleted without audit trail.
**Required:** Each logbook entry stores a `prev_hash` field computed as `SHA256(prev_entry_hash + current_entry_data)`. Any modification breaks the chain. Store the chain head hash in a separate immutable table.
**Schema change:** `ALTER TABLE pilot_logbook_csv ADD COLUMN entry_hash TEXT, prev_hash TEXT, chain_sequence INTEGER`

#### Control P-04: Remove `queryTable` Generic Write Path
**Current state:** `queryTable insert` allows writing to any table with arbitrary data.
**Required:** Replace generic `queryTable insert` with typed action handlers for each table (e.g., `insertLogbookEntry`, `insertMedicalCert`, `insertCredential`). Each handler validates the data schema and enforces ownership.
**File:** `worker/src/index.ts` — deprecate `queryTable insert`, add typed handlers.

### 5.2 High Priority (Implement Within 30 Days)

#### Control P-05: ATO Cross-Verification Integration
**Required:** Integrate with CAAP ATO Directory API. When a pilot logs training hours, the ATO named in the entry is verified to exist and be approved. Store the verification result in a new `ato_verification_cache` table.

#### Control P-06: AME Cross-Verification Integration
**Required:** Integrate with CAAP AME Registry. When a pilot uploads a medical certificate, the certificate number and AME are verified against the registry. Store the verification result in `medical_certificate_records.ame_verified_at`.

#### Control P-07: Immutable Audit Log
**Required:** Every write operation (profile update, logbook entry, credential upload, medical cert insert, verification status change) must write to an append-only `audit_log` table with: timestamp, actor auth0_id, action, table, record_id, before_hash, after_hash.
**Schema:** New table `audit_log` (append-only, no UPDATE/DELETE permissions).

#### Control P-08: CORS Restriction
**Current state:** `Access-Control-Allow-Origin: '*'`
**Required:** Restrict to `https://pilotrecognition.com` and approved subdomains.
**File:** `worker/src/index.ts` line 20.

### 5.3 Medium Priority (Implement Within 90 Days)

#### Control P-09: Verification Level Upgrade Pipeline
**Required:** Implement the pipeline to upgrade `logbook_hour_tokens.verification_level` from 1 (self-reported) to 2 (ATO-verified) to 3 (regulator-verified). Each upgrade requires evidence (ATO API confirmation, CAAP submission receipt).

#### Control P-10: Server-Side Examination Engine
**Current state:** Exam portal is cosmetic — no server-side exam delivery.
**Required:** Implement server-side exam engine with: question bank stored in D1, randomized question selection, server-side scoring, time limits enforced server-side, anti-cheat (tab switching detection, question shuffling, answer randomization).

#### Control P-11: Anomaly Dashboard for Compliance Team
**Required:** Build a dashboard that surfaces all flagged anomalies (L-series, C-series, P-series rules) in real time. Allow compliance officers to review, dismiss, or escalate flags. Track resolution status.

---

## 6. Reporting Protocol

### 6.1 Internal Escalation

| Severity | Action | Timeline |
|---|---|---|
| CRITICAL | Freeze the pilot's verification status. Notify Head of Compliance immediately. Begin manual review. | Within 1 hour of detection |
| HIGH | Flag the record. Assign to compliance reviewer. Block CAAP submission until resolved. | Within 24 hours |
| MEDIUM | Flag the record. Include in weekly anomaly report. Allow CAAP submission with footnote. | Within 7 days |

### 6.2 CAAP FSIS Reporting

When a CRITICAL or HIGH anomaly is confirmed as fraudulent (not a data entry error):

1. Compile a fraud incident report containing:
   - Pilot's name, license number, auth0_id
   - Flagged records with specific rule violations
   - Supporting evidence (logbook entries, credential records, audit trail)
   - Aircraft tail numbers associated with flagged entries
   - Chronological fuel logs (if obtained from ATO)
   - Examiner signatures (if applicable)
2. Submit the report to CAAP FSIS via the designated secure channel
3. Suspend the pilot's verification status on the platform pending CAAP review
4. Preserve all evidence in immutable storage (audit log) for the duration of the investigation

### 6.3 Documentation Retention

- All fraud incident reports: retained for 7 years
- Audit logs: retained for 7 years
- Verification submissions and supporting documents: retained per `document_purge_after` field (currently 30 days post-verification — recommend extending to 7 years for fraud investigation purposes)

---

## 7. Code References

| Finding | File | Lines |
|---|---|---|
| No JWT verification | `worker/src/index.ts` | 77-131 |
| Generic SQL write path | `worker/src/index.ts` | 538-581 |
| Table name interpolation | `worker/src/index.ts` | 544, 556, 565, 574 |
| CORS wildcard | `worker/src/index.ts` | 20 |
| Logbook CSV save (no validation) | `worker/src/index.ts` | 821-828 |
| Logbook CSV delete (no audit) | `worker/src/index.ts` | 838-842 |
| Self-reported hours token | `hooks/useLogbookUpload.ts` | 198-217 |
| Credential self-report form | `components/website/components/CredentialUploadForm.tsx` | 46-120 |
| Medical cert self-report | `components/website/components/ame/MedicalCertUploadPage.tsx` | 61-86 |
| Exam portal (static/cosmetic) | `components/website/components/examinations/ExaminationPortal.tsx` | 35-173 |
| Mock verification data | `lib/data-access-verifier.ts` | 58-91 |
| Stubbed pilot_documents table | `lib/d1-api.ts` | 79-91 |
| Cloudinary unsigned preset | `components/enterprise/VerificationSubmissionForm.tsx` | 14 |
| Rate limit (profile only) | `worker/src/index.ts` | 137-171 |
| Employee access audit log | `worker/schema.sql` | 177-190 |
