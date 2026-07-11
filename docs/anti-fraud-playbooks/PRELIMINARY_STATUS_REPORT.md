# Preliminary Status Report: Internal Anti-Fraud Audit

**To:** CAAP Flight Standards Inspectorate Service (FSIS)
**From:** Aviation Pathways Consultancy — Compliance Division
**Date:** 2026-07-11
**Re:** Internal audit of PilotRecognition platform — fraud attack surface assessment
**Classification:** Confidential — Regulatory Submission

---

## 1. Scope

A code-level audit of the PilotRecognition platform was conducted to identify fraud vulnerabilities across all data-entry and storage surfaces, including: digital logbook, flight hour tracking, credential uploads, medical certificate records, examination portal, verification submissions, and the backend Worker API.

---

## 2. Key Findings

### 2.1 Critical Vulnerabilities (4)

| # | Finding | Impact |
|---|---|---|
| 1 | **No server-side JWT verification on the Worker API.** The `handleApiAction` function receives a Bearer token from the client but never validates it before executing database operations. Any caller with network access can read or modify any pilot's profile, flight hours, logbook, credentials, and medical records. | Any data in the platform can be read or written by an unauthorized party. All self-reported data is unreliable without this fix. |
| 2 | **Generic SQL write path with no authorization.** The `queryTable` action accepts any table name and any data payload for INSERT/UPDATE operations. There is no check that the caller owns the `pilot_id` in the data being written. | A pilot can write logbook entries, medical certificates, or credentials attributed to any other pilot. |
| 3 | **No server-side validation on logbook entries.** Logbook CSV uploads and individual entries are stored without any validation of time consistency (PIC + SIC ≤ total, night ≤ total, instrument ≤ total), date plausibility, or cross-reference with ATO records. | Fabricated logbook entries are indistinguishable from legitimate ones at the storage level. |
| 4 | **Examination portal is cosmetic.** Exam categories, questions, passing scores, and completion status are hardcoded in the frontend component. No server-side exam delivery, scoring, or anti-cheat exists. | Any "completed" exam status can be fabricated by modifying client-side state. |

### 2.2 High-Severity Vulnerabilities (6)

| # | Finding |
|---|---|
| 5 | Medical certificates are self-attested with no AME cross-verification. |
| 6 | No tamper-evident logging — logbook entries can be edited or deleted without audit trail. |
| 7 | `DataAccessVerifier` uses hardcoded mock data — the verification system is not real. |
| 8 | `pilot_documents` table is stubbed (returns empty array) — credential data integrity cannot be confirmed. |
| 9 | Email display name is client-controllable — enables impersonation of CAAP or PilotRecognition officials. |
| 10 | No rate limiting on logbook writes, credential uploads, or medical certificate inserts. |

### 2.3 Medium-Severity Vulnerabilities (4)

| # | Finding |
|---|---|
| 11 | CORS wildcard (`*`) allows any website to make API calls. |
| 12 | Cloudinary unsigned upload preset allows unauthenticated file uploads. |
| 13 | Email rate limiting is logged but not enforced. |
| 14 | Profile search has no rate limiting — enables reconnaissance by impersonators. |

---

## 3. Detection Capabilities (To Be Implemented)

The audit produced 23 detection heuristics across three categories:

- **Logbook anomaly detection (10 rules):** time overflow, PIC/dual conflicts, night-time computation errors, impossible flight durations, solo without endorsement, instrument time without approach, cross-country distance thresholds, duplicate entries, date impossibilities, hour rate anomalies.
- **Credential anomaly detection (5 rules):** license number format validation, date inversion, total hours mismatch, medical without AME verification, medical class inconsistency.
- **Profile anomaly detection (2 rules):** profile hours vs logbook hours mismatch, rapid hour changes.

Full rule specifications are in Playbook 01, Section 3.

---

## 4. Prevention Controls (Roadmap)

| Priority | Controls | Timeline |
|---|---|---|
| Critical | JWT verification, server-side logbook validation, tamper-evident hash chaining, remove generic write path | Immediately |
| High | ATO cross-verification, AME cross-verification, immutable audit log, CORS restriction, email display name lock, email rate limiting, remove unsigned Cloudinary preset | 30 days |
| Medium | Verification level upgrade pipeline, server-side exam engine, anomaly dashboard, DMARC enforcement, authorized representatives registry, duplicate profile prevention | 90 days |

Full control specifications are in Playbooks 01 and 02, Sections 5 and 4.

---

## 5. Whistleblower System

A secure, anonymous whistleblower reporting system has been designed (Playbook 03) with:

- AES-256-GCM encrypted report storage
- Anonymous submission capability (no login required)
- Tracking ID for status checking
- Role-based access for compliance officers
- Full audit trail of report access
- Escalation pathway to CAAP FSIS
- Anti-retaliation protections

Implementation roadmap: 8 weeks (4 phases).

---

## 6. Evidentiary Requirements Status

The CAAP FSIS request asks for flagged records containing aircraft tail numbers, chronological fuel logs, and verified examiner signatures. Current platform state:

| Requirement | Status | Gap |
|---|---|---|
| Aircraft tail numbers | Stored in logbook entries (`aircraft_registration` field) | Not cross-referenced with CAAP aircraft registry |
| Chronological fuel logs | Not stored in the platform | Must be requested from ATOs during investigation |
| Verified examiner signatures | Stored as text fields (`instructorSignature`, `caapExaminerName`, `caapExaminerLicenseNumber`) | Not verified against CAAP designated examiner registry; stored as free-text, not cryptographic signatures |

---

## 7. Immediate Actions Taken

1. Audit completed across all data-entry surfaces
2. Three Anti-Fraud Playbooks drafted (Falsified Credentials, Identity Theft & Impersonation, Whistleblower & Escalation)
3. 23 detection heuristics defined
4. 14 prevention controls specified with implementation timelines
5. Whistleblower system designed with full schema and API specification

## 8. Next Steps

1. Implement the 4 critical controls (JWT verification, server-side validation, hash chaining, remove generic write path)
2. Begin whistleblower system Phase 1 development
3. Establish ATO and AME cross-verification API connections with CAAP
4. Schedule a joint review session with CAAP FSIS to align on escalation procedures

---

## 9. Playbook Index

| Playbook | File |
|---|---|
| 01 — Falsified Credentials | `docs/anti-fraud-playbooks/PLAYBOOK_01_FALSIFIED_CREDENTIALS.md` |
| 02 — Identity Theft & Impersonation | `docs/anti-fraud-playbooks/PLAYBOOK_02_IDENTITY_THEFT_IMPERSONATION.md` |
| 03 — Whistleblower & Escalation | `docs/anti-fraud-playbooks/PLAYBOOK_03_WHISTLEBLOWERS.md` |

---

**Prepared by:** Aviation Pathways Consultancy — Compliance Division
**Audit method:** Code-level review of all frontend components, backend Worker API, database schemas, and authentication infrastructure
**Codebase audited:** `app-main/` (PilotRecognition platform)
**Audit date:** 2026-07-11
