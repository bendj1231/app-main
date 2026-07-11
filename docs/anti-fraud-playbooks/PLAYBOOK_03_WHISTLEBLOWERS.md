# Anti-Fraud Playbook 03: Whistleblower & Escalation Pathway

**Scope:** Secure reporting mechanism for employees, contractors, and student pilots to report internal corruption, fraud, or regulatory violations
**Mandate:** CAAP FSIS Anti-Fraud Mandate — Whistleblower & Escalation Pathway
**Classification:** Internal — Compliance Use Only
**Last Updated:** 2026-07-11

---

## 1. Executive Summary

This playbook defines a secure, anonymous reporting mechanism for employees, contractors, student pilots, and mentors to report suspected internal corruption, fraud, or regulatory violations — either within PilotRecognition/Aviation Pathways Consultancy or at affiliated training organizations (ATOs).

The code audit found that no whistleblower or internal reporting system currently exists in the platform. The existing `messages` table (`worker/schema.sql` lines 224-238) supports admin-to-pilot communication but is not anonymous — messages contain `sender_id` and `recipient_id` in plaintext. A new system must be built.

---

## 2. Current State Assessment

### 2.1 What Exists

| Component | Location | Limitation |
|---|---|---|
| Messages table | `worker/schema.sql` lines 224-238 | Admin-to-pilot messaging. Not anonymous. Sender and recipient IDs stored in plaintext. Not suitable for whistleblower reports. |
| Employee access audit log | `worker/schema.sql` lines 177-190 | Logs employee actions (view_submission, download_document, update_status). Useful for post-hoc investigation but not a reporting mechanism. |
| User activity log | `cloudflare/migrations/0011_ops_audit_tables.sql` lines 24-35 | Logs user activity (activity_type, entity_type, metadata). Same limitation — audit trail, not reporting channel. |
| AI usage log | `cloudflare/migrations/0011_ops_audit_tables.sql` lines 7-19 | Logs AI chat usage. Could surface whistleblower intent if someone discusses fraud in chat, but this is surveillance, not a reporting mechanism. |

### 2.2 What Does Not Exist

- No anonymous reporting form
- No dedicated whistleblower database table
- No encryption-at-rest for sensitive reports
- No protected reporting channel to CAAP FSIS
- No anti-retaliation policy documented in the codebase
- No whistleblower anonymity guarantees in the system architecture

---

## 3. Whistleblower System Design

### 3.1 Database Schema

```sql
-- Whistleblower reports — stored separately from all other tables
-- Accessible only via a dedicated Worker endpoint with a separate secret
CREATE TABLE IF NOT EXISTS whistleblower_reports (
  id TEXT PRIMARY KEY,
  -- Reporter identity (encrypted, accessible only to Head of Compliance + CAAP liaison)
  reporter_id_encrypted TEXT,           -- AES-256-GCM encrypted auth0_id (if logged in)
  reporter_is_anonymous INTEGER DEFAULT 1,
  -- Report content (encrypted)
  category TEXT NOT NULL,               -- 'logbook_fraud', 'medical_fraud', 'license_fraud',
                                        -- 'broker_activity', 'internal_corruption',
                                        -- 'ato_violation', 'other'
  subject TEXT NOT NULL,
  description_encrypted TEXT NOT NULL,  -- AES-256-GCM encrypted report body
  -- Evidence
  evidence_paths TEXT,                  -- JSON array of R2 paths (encrypted files)
  -- Metadata (not encrypted — needed for routing)
  status TEXT DEFAULT 'new',            -- 'new', 'under_review', 'escalated', 'resolved', 'dismissed'
  priority TEXT DEFAULT 'normal',       -- 'low', 'normal', 'high', 'critical'
  assigned_to TEXT,                     -- compliance officer auth0_id
  -- Audit
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
  -- No FK to profiles — deliberately disconnected to prevent joins
);

CREATE INDEX idx_whistleblower_status ON whistleblower_reports(status);
CREATE INDEX idx_whistleblower_priority ON whistleblower_reports(priority);
CREATE INDEX idx_whistleblower_created ON whistleblower_reports(created_at);

-- Audit trail for report access (who read/modified the report)
CREATE TABLE IF NOT EXISTS whistleblower_access_log (
  id TEXT PRIMARY KEY,
  report_id TEXT NOT NULL,
  accessor_id TEXT NOT NULL,            -- compliance officer auth0_id
  action TEXT NOT NULL,                 -- 'read', 'update_status', 'assign', 'escalate', 'export'
  metadata TEXT,
  created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_wb_access_report ON whistleblower_access_log(report_id);
CREATE INDEX idx_wb_access_accessor ON whistleblower_access_log(accessor_id);
```

### 3.2 API Endpoints

#### `POST /api/whistleblower/submit`
- **Authentication:** Optional. If authenticated, reporter ID is encrypted before storage. If anonymous, no identity is recorded.
- **Rate limit:** 3 reports per IP per 24 hours (prevents abuse while allowing legitimate reports).
- **Input:**
  ```json
  {
    "category": "logbook_fraud",
    "subject": "ATO X is padding student logbooks",
    "description": "Detailed description...",
    "evidence_files": ["file1.pdf", "file2.jpg"],
    "anonymous": true,
    "contact_email": "optional@example.com"  // only if not anonymous
  }
  ```
- **Processing:**
  1. If evidence files are provided, upload to R2 with server-side encryption.
  2. Encrypt description and reporter ID with AES-256-GCM using a key stored in Cloudflare Secrets (not in D1, not in code).
  3. Insert into `whistleblower_reports`.
  4. Return a tracking ID (the report ID) that the reporter can use to check status anonymously.
  5. Send a notification to the Head of Compliance (via separate channel, not via the report submitter's email).

#### `GET /api/whistleblower/status/:tracking_id`
- **Authentication:** None required — the tracking ID itself is the authentication token.
- **Returns:** Status only (`new`, `under_review`, `escalated`, `resolved`, `dismissed`). No report content.
- **Rate limit:** 10 checks per IP per hour.

#### `GET /api/whistleblower/reports` (Compliance Officer Only)
- **Authentication:** Required. JWT must have `role: 'compliance'` or `role: 'super_admin'`.
- **Returns:** List of reports with decrypted content.
- **Audit:** Every access logged to `whistleblower_access_log`.

#### `PATCH /api/whistleblower/reports/:id` (Compliance Officer Only)
- **Authentication:** Required. JWT must have `role: 'compliance'` or `role: 'super_admin'`.
- **Input:** Status update, priority change, assignment.
- **Audit:** Every update logged to `whistleblower_access_log`.

### 3.3 Frontend Component

Create a new page at `/report-fraud` (not behind login — accessible to anonymous users):

```
Route: /report-fraud
Component: components/whistleblower/WhistleblowerReportForm.tsx
```

Key UI requirements:
- No tracking pixels or analytics on this page
- No third-party scripts loaded on this page
- Option to report anonymously or with contact email
- File upload for evidence (PDF, JPG, PNG — max 20MB per file, max 5 files)
- Clear statement of anonymity guarantees
- Clear statement of anti-retaliation policy
- Tracking ID displayed after submission
- Status check by tracking ID

---

## 4. Escalation Pathway

### 4.1 Internal Escalation Matrix

| Priority | Criteria | Escalated To | Timeline |
|---|---|---|---|
| CRITICAL | Evidence of active falsification being submitted to CAAP; internal staff complicit; broker currently soliciting candidates | Head of Compliance + CEO + CAAP FSIS | Immediately (within 1 hour) |
| HIGH | Evidence of falsified records not yet submitted; ATO systematically padding hours; medical certificate forgery | Head of Compliance | Within 4 hours |
| NORMAL | Suspicious activity without concrete evidence; single anomalous logbook entry; rumor of broker activity | Compliance Reviewer | Within 24 hours |
| LOW | Minor procedural violation; data entry error that may be intentional; policy question | Compliance Reviewer | Within 7 days |

### 4.2 Escalation to CAAP FSIS

A report is escalated to CAAP FSIS when:

1. **CRITICAL priority** is confirmed by Head of Compliance, OR
2. The report involves CAAP personnel or CAAP branding misuse, OR
3. The report involves falsification of documents intended for CAAP submission, OR
4. The report involves an ATO that is CAAP-approved and the fraud affects regulatory compliance, OR
5. Internal investigation confirms fraud and criminal prosecution is warranted

#### CAAP FSIS Submission Package

When escalating to CAAP FSIS, compile:

1. **Cover letter** from Head of Compliance
2. **Whistleblower report summary** (with reporter identity redacted unless the reporter has consented to being identified)
3. **Evidence package:**
   - Flagged logbook entries with anomaly rule violations
   - Aircraft tail numbers associated with flagged entries
   - Chronological fuel logs (if obtained from ATO)
   - Examiner signatures (if applicable)
   - Medical certificate copies with AME verification results
   - License verification results
4. **Platform audit trail:**
   - Relevant `audit_log` entries (from Control P-07, once implemented)
   - `verification_employee_access_log` entries showing who accessed the records
   - `whistleblower_access_log` entries showing review chain
5. **Impact assessment:**
   - Number of affected pilots
   - Number of affected flights
   - Regulatory implications
   - Safety risk assessment

#### Submission Channel

- **Primary:** Secure upload to CAAP FSIS designated channel (`network.admin@caap.gov.ph`)
- **Secondary:** Physical delivery to CAAP office, MIA Road, Pasay City
- **Acknowledgment:** Request receipt confirmation from CAAP FSIS within 48 hours

### 4.3 Escalation to Law Enforcement

When the report involves criminal activity (financial fraud, identity theft, forgery):

1. **Philippine DOJ Cybercrime Office:** For online fraud, identity theft, email spoofing, fake websites
2. **NBI Anti-Fraud Division:** For financial fraud, document forgery
3. **PNP Aviation Security Group:** For in-person impersonation at airports or flight schools

---

## 5. Anti-Retaliation Policy

### 5.1 Protections

PilotRecognition prohibits retaliation against any employee, contractor, mentor, or pilot who reports suspected fraud in good faith. Retaliation includes:

- Termination, demotion, or reduction in responsibilities
- Reduction in pay or benefits
- Exclusion from projects or opportunities
- Negative performance reviews not supported by documented performance issues
- Public identification of the whistleblower
- Legal threats or actual lawsuits against the whistleblower

### 5.2 Enforcement

- Any allegation of retaliation is treated as a CRITICAL priority report
- Retaliation allegations are investigated by an independent reviewer (not the person the whistleblower reported to)
- Confirmed retaliation results in immediate termination of the retaliator
- Retaliation allegations are reported to CAAP FSIS as a separate incident

### 5.3 Good Faith Standard

A report is made in good faith if the reporter believed the information was true at the time of reporting, even if subsequent investigation finds no fraud. Deliberately false reports (made with knowledge that the information is fabricated) are not protected and may result in account suspension.

---

## 6. Whistleblower Anonymity Guarantees

### 6.1 Technical Guarantees

| Guarantee | Implementation |
|---|---|
| Reporter identity is encrypted at rest | AES-256-GCM encryption with key in Cloudflare Secrets |
| Reporter identity is not logged in access logs | `whistleblower_access_log` records only the compliance officer's ID, not the reporter's |
| No IP address stored with the report | IP is used only for rate limiting (in-memory KV with 24h TTL), not persisted |
| No correlation to other platform activity | `whistleblower_reports` table has no FK to `profiles` — cannot be joined |
| Evidence files are encrypted in R2 | Server-side encryption with separate KMS key |
| Tracking ID is a random UUID | Not derived from reporter identity |

### 6.2 Operational Guarantees

| Guarantee | Implementation |
|---|---|
| Only Head of Compliance and CAAP Liaison can decrypt reporter identity | Decryption key access restricted to these two roles |
| Reporter identity is never shared with the subject of the report | Policy enforced by Head of Compliance |
| Reporter identity is shared with CAAP FSIS only if the reporter consents | Consent recorded in the report |
| Access to whistleblower reports is audited | Every read/modify logged to `whistleblower_access_log` |
| Reports are retained for 7 years | Per regulatory record retention requirements |

### 6.3 Limitations (Disclosed to Reporters)

- If the reporter is logged in, their Auth0 ID is encrypted and stored. While we cannot decrypt it without the key, a court order could compel key disclosure.
- If the reporter provides a contact email, that email is stored (encrypted) and may be used to contact them.
- If the reporter uploads evidence files, file metadata (filename, size, type) may contain identifying information.
- The platform's hosting provider (Cloudflare) and database provider (Cloudflare D1) may be subject to lawful data requests.

---

## 7. Implementation Roadmap

### 7.1 Phase 1 (Week 1-2): Minimum Viable Whistleblower Channel

- [ ] Create `whistleblower_reports` and `whistleblower_access_log` tables
- [ ] Build `POST /api/whistleblower/submit` endpoint with encryption
- [ ] Build `GET /api/whistleblower/status/:tracking_id` endpoint
- [ ] Build `/report-fraud` page with anonymous submission form
- [ ] Configure encryption key in Cloudflare Secrets
- [ ] Document anti-retaliation policy on the `/report-fraud` page

### 7.2 Phase 2 (Week 3-4): Compliance Officer Tools

- [ ] Build `GET /api/whistleblower/reports` endpoint with role-based access
- [ ] Build compliance officer dashboard for reviewing reports
- [ ] Implement `whistleblower_access_log` audit trail
- [ ] Configure Head of Compliance and CAAP Liaison roles in Auth0
- [ ] Test end-to-end: submit → review → escalate → resolve

### 7.3 Phase 3 (Week 5-6): CAAP Integration

- [ ] Build CAAP FSIS submission package generator
- [ ] Establish secure file transfer protocol with CAAP FSIS
- [ ] Document the escalation procedure in a runbook for compliance officers
- [ ] Train compliance officers on the escalation process
- [ ] Conduct a tabletop exercise simulating a CRITICAL whistleblower report

### 7.4 Phase 4 (Week 7-8): Hardening

- [ ] Penetration test the whistleblower system
- [ ] Verify anonymity guarantees with an independent security review
- [ ] Add the whistleblower page to the platform's footer and navigation
- [ ] Publish a public "Report Fraud" page explaining the system
- [ ] Integrate with the anomaly detection dashboard (Playbook 01, Control P-11)

---

## 8. Roles and Responsibilities

| Role | Responsibilities |
|---|---|
| **Reporter** (anyone) | Submits report in good faith. Provides as much detail and evidence as possible. Optionally provides contact email for follow-up. |
| **Compliance Reviewer** | Triage new reports. Assign priority. Conduct initial investigation. Escalate to Head of Compliance as needed. |
| **Head of Compliance** | Reviews HIGH and CRITICAL reports. Authorizes escalation to CAAP FSIS. Ensures anti-retaliation protections are enforced. Maintains the encryption key. |
| **CAAP Liaison** | Interfaces with CAAP FSIS. Compiles submission packages. Tracks CAAP response. Maintains communication log. |
| **CEO** | Notified of CRITICAL reports. Authorizes internal investigations. Ensures organizational support for the whistleblower program. |
| **Security Engineer** | Maintains the whistleblower system infrastructure. Ensures encryption, access controls, and audit trails are functioning. Conducts periodic security reviews. |

---

## 9. Code References

| Finding | File | Lines |
|---|---|---|
| Messages table (not anonymous) | `worker/schema.sql` | 224-238 |
| Employee access audit log | `worker/schema.sql` | 177-190 |
| User activity log | `cloudflare/migrations/0011_ops_audit_tables.sql` | 24-35 |
| AI usage log | `cloudflare/migrations/0011_ops_audit_tables.sql` | 7-19 |
| No existing whistleblower system | (entire codebase) | N/A |
| No role-based access control | `worker/src/index.ts` | 77-131 (no JWT verification, no role check) |
