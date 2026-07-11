# Anti-Fraud Playbook 02: Identity Theft & Impersonation

**Scope:** Third-party brokers, brand misuse, unauthorized CAAP/APC impersonation, email spoofing
**Mandate:** CAAP FSIS Anti-Fraud Mandate — Detection, Prevention, and Reporting
**Classification:** Internal — Compliance Use Only
**Last Updated:** 2026-07-11

---

## 1. Executive Summary

This playbook defines procedures to flag third-party brokers or scammers who unauthorizedly use PilotRecognition's or CAAP's branding to solicit pilot candidates. It covers impersonation via email, social media, fake websites, and in-person misrepresentation.

The code audit identified that the platform's email infrastructure (`/api/email/send`) accepts a client-provided `from_name` parameter that is injected into the `From` header. While the `from` address is locked to `noreply@pilotrecognition.com`, the display name is attacker-controllable, meaning a malicious actor with API access could send emails appearing to come from "CAAP Verification Office" or any other impersonated name.

---

## 2. Attack Surface Map

### 2.1 Email Infrastructure

| Component | Path | Risk |
|---|---|---|
| Email Send Endpoint | `worker/src/index.ts` lines 1092-1147 | Accepts `from_name` from client request body. Display name is injected into `From` header: `${from_name} <noreply@pilotrecognition.com>`. An attacker with API access (see Playbook 01, Control P-01) could set `from_name` to "CAAP FSIS" or "Aviation Pathways Compliance" to impersonate official channels. |
| Email API Secret | `worker/src/index.ts` line 1113 | Protected by `X-Email-Secret` header comparison. However, the secret is compared with `===` (non-constant-time), making it theoretically susceptible to timing attacks. |
| Rate Limiting (Email) | `worker/src/index.ts` lines 1118-1122 | Rate limiting is logged but not enforced: comment says "In production, use KV or D1 for rate limiting. For now, log and proceed." An attacker can send unlimited emails. |
| Resend API Key | `worker/src/index.ts` line 1129 | Stored as Worker secret. If leaked, an attacker can send emails from `noreply@pilotrecognition.com` directly through Resend, bypassing the Worker entirely. |
| SPF/DKIM/DMARC | DNS configuration (not in codebase) | Must be verified. If DMARC policy is not set to `reject` or `quarantine`, spoofed emails from `pilotrecognition.com` domains may be delivered. |

### 2.2 Public-Facing Surfaces

| Surface | Risk |
|---|---|
| Cloudinary unsigned uploads | `enterprise_unsigned` preset (`VerificationSubmissionForm.tsx` line 14) allows anyone to upload files to the project's Cloudinary cloud. An attacker could upload fake credential documents or impersonation materials. |
| Profile search API | `searchProfiles` (`worker/src/index.ts` line 204) returns pilot names, emails, flight hours, license IDs, and countries to any authenticated caller. No rate limiting on search. Could be used for target reconnaissance by impersonators. |
| CORS wildcard | `Access-Control-Allow-Origin: '*'` allows any website to make API calls. A fake website could proxy legitimate API calls to appear authentic. |

### 2.3 Brand Misuse Vectors (External to Codebase)

| Vector | Description |
|---|---|
| Fake social media accounts | Brokers creating Facebook/Instagram/LinkedIn accounts using PilotRecognition or CAAP logos, offering "guaranteed CAAP licensing" or "fast-track placement." |
| Fake websites | Domain typosquats (e.g., `pilotrecogntion.com`, `pilot-recognition.com`, `pilotrecognition.ph`) hosting clone sites that collect pilot PII and payment information. |
| WhatsApp/Telegram groups | Brokers operating in pilot community groups claiming to be PilotRecognition agents or CAAP representatives. |
| In-person misrepresentation | Individuals at flight schools or aviation events claiming to represent PilotRecognition or CAAP, collecting documents or payments. |
| Email spoofing | Emails sent from lookalike domains (`pilotrecognition-ph.com`, `caap-verification.org`) targeting student pilots. |

---

## 3. Detection Heuristics

### 3.1 Platform-Side Detection

#### Rule I-01: Suspicious Email Display Name
**Check:** Monitor all outbound emails for display names that impersonate official entities.
```
BLOCKED_DISPLAY_NAMES = [
  "CAAP", "Civil Aviation Authority", "FSIS", "Flight Standards",
  "Director General", "CAAP Verification", "CAAP Compliance",
  "Aviation Authority", "Philippine Aviation", "CAAP Official"
]
IF from_name matches any blocked pattern → BLOCK + ALERT
```
**Flag:** `IMPERSONATION_EMAIL_DISPLAY_NAME`
**Severity:** CRITICAL
**Implementation:** Add validation in `handleEmailSend` before constructing `fromEmail`.

#### Rule I-02: Email Volume Anomaly
**Check:** Detect bulk email sends that may indicate spam or phishing campaigns.
```
IF email_count_per_IP_per_hour > 10 → FLAG
IF email_count_per_user_per_hour > 5 → FLAG
IF identical subject sent to > 3 recipients in 1 hour → FLAG
```
**Flag:** `IMPERSONATION_EMAIL_VOLUME`
**Severity:** HIGH
**Implementation:** Enforce the rate limit that is currently only logged (line 1121).

#### Rule I-03: Unauthorized Cloudinary Uploads
**Check:** Monitor Cloudinary upload logs for files not associated with a legitimate enterprise verification flow.
```
IF upload to enterprise_unsigned preset AND no corresponding verification_submission created within 5 minutes → FLAG
IF file name contains "caap", "license", "medical", "certificate" AND uploader is not authenticated → FLAG
```
**Flag:** `IMPERSONATION_CLOUDINARY_UPLOAD`
**Severity:** MEDIUM

#### Rule I-04: Profile Scraping Detection
**Check:** Detect bulk profile searches that may indicate reconnaissance by impersonators.
```
IF search_count_per_user_per_hour > 50 → FLAG
IF search_count_per_IP_per_hour > 100 → FLAG
IF sequential searches (alphabetical name patterns) → FLAG
```
**Flag:** `IMPERSONATION_PROFILE_SCRAPING`
**Severity:** MEDIUM

#### Rule I-05: Duplicate Profile Detection
**Check:** Detect the same person creating multiple accounts with different emails (common broker pattern — broker creates accounts on behalf of pilots to control their profiles).
```
IF same phone number appears on > 1 profile → FLAG
IF same date_of_birth + similar name on > 1 profile → FLAG
IF same IP address creates > 3 profiles in 24 hours → FLAG
```
**Flag:** `IMPERSONATION_DUPLICATE_PROFILE`
**Severity:** HIGH

### 3.2 External Monitoring (Manual or Automated)

#### Rule I-06: Domain Typosquat Monitoring
**Check:** Register and monitor lookalike domains.
```
Automated weekly check: query DNS for domains matching:
  - pilotrecognition.{tld} for all common TLDs (.ph, .org, .net, .info, .biz)
  - common typos (pilotrecogntion, pilot-recognition, pilotrecognitionph)
  - caap-verification.{tld}, caapverification.{tld}
IF any domain resolves to a web server → manual review for clone site
```
**Flag:** `IMPERSONATION_DOMAIN_TYPOSQUAT`
**Severity:** HIGH

#### Rule I-07: Social Media Impersonation Monitoring
**Check:** Periodic searches on Facebook, Instagram, LinkedIn, and X for accounts using PilotRecognition or CAAP branding.
```
Search terms:
  "PilotRecognition" + "agent" / "representative" / "official" / "partner"
  "CAAP" + "fast track" / "guaranteed pass" / "license assistance"
  "Aviation Pathways" + "agent" / "broker"
IF account found using official logos AND not in authorized_representatives list → FLAG
```
**Flag:** `IMPERSONATION_SOCIAL_MEDIA`
**Severity:** HIGH

#### Rule I-08: Community Channel Monitoring
**Check:** Monitor pilot community groups (Facebook groups, WhatsApp, Telegram, Discord) for unauthorized agents.
```
Keywords to watch:
  "guaranteed CAAP", "fast track license", "PilotRecognition agent",
  "APC representative", "we can expedite", "guaranteed pass rate",
  "CAAP connection", "inside CAAP", "fix your license"
```
**Flag:** `IMPERSONATION_COMMUNITY_CHANNEL`
**Severity:** HIGH

---

## 4. Prevention Controls

### 4.1 Critical (Implement Immediately)

#### Control I-01: Lock Email Display Name
**Current state:** `from_name` is client-provided and injectable.
**Required:** Remove `from_name` from the API request. Hardcode the display name to "PilotRecognition" in the Worker. If personalized display names are needed, use a whitelist of approved names stored in D1.
**File:** `worker/src/index.ts` lines 1099, 1125-1127.

#### Control I-02: Enforce Email Rate Limiting
**Current state:** Rate limiting is logged but not enforced.
**Required:** Implement KV-based rate limiting: max 5 emails per IP per hour, max 3 per user per hour. Return 429 when exceeded.
**File:** `worker/src/index.ts` lines 1118-1122.

#### Control I-03: Remove Cloudinary Unsigned Preset
**Current state:** `enterprise_unsigned` preset allows unauthenticated uploads.
**Required:** Generate a signed upload preset or use server-side uploads via the Cloudinary API with the Worker's API key. Remove the unsigned preset from Cloudinary settings.
**File:** `components/enterprise/VerificationSubmissionForm.tsx` line 14.

#### Control I-04: Restrict CORS
**Current state:** `Access-Control-Allow-Origin: '*'`
**Required:** Set to `https://pilotrecognition.com` and approved subdomains only.
**File:** `worker/src/index.ts` line 20.

### 4.2 High Priority (Implement Within 30 Days)

#### Control I-05: DMARC Enforcement
**Required:** Ensure DNS records include:
- SPF: `v=spf1 include:_spf.resend.com ~all`
- DKIM: Resend-provided DKIM record
- DMARC: `v=DMARC1; p=reject; rua=mailto:dmarc@pilotrecognition.com; ruf=mailto:dmarc@pilotrecognition.com`
This prevents spoofed emails from `pilotrecognition.com` domains from being delivered.

#### Control I-06: Authorized Representatives Registry
**Required:** Create a `authorized_representatives` table in D1:
```sql
CREATE TABLE authorized_representatives (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  role TEXT NOT NULL,  -- 'employee', 'contractor', 'partner'
  regions TEXT,        -- JSON array of authorized regions
  status TEXT DEFAULT 'active',
  authorized_at TEXT,
  deactivated_at TEXT,
  created_at TEXT
);
```
When someone claims to be a representative, verify against this table. Publish a public "Verify Our Representatives" page where pilots can search by name or email.

#### Control I-07: Profile Search Rate Limiting
**Required:** Add rate limiting to `searchProfiles`: max 20 searches per user per hour. Add exponential backoff on repeated searches.
**File:** `worker/src/index.ts` line 204.

#### Control I-08: Duplicate Profile Prevention
**Required:** On profile creation, check for existing profiles with same phone, same DOB + similar name, or same IP. If found, require manual review before activating the new profile.

### 4.3 Medium Priority (Implement Within 90 Days)

#### Control I-09: Domain Monitoring Automation
**Required:** Set up automated DNS monitoring for typosquat domains. Use a domain monitoring service or script that checks weekly. Register defensive domains for common typos.

#### Control I-10: Social Media Monitoring
**Required:** Set up Google Alerts and social media monitoring tools for brand mentions. Weekly manual review of flagged accounts. Report impersonation accounts to platforms via their impersonation reporting channels.

#### Control I-11: Pilot Education Campaign
**Required:** Create a "Verify It's Really Us" page on PilotRecognition that:
- Lists all official communication channels (email domains, phone numbers, social media handles)
- States that PilotRecognition will never ask for payment outside the platform
- States that PilotRecognition will never guarantee CAAP licensing or pass rates
- Provides a report form for suspected impersonation
- Links to CAAP's official contact information

---

## 5. Response Protocol

### 5.1 Impersonation Incident Response

| Step | Action | Timeline |
|---|---|---|
| 1 | Document the impersonation evidence (screenshots, emails, URLs, account profiles) | Within 1 hour of detection |
| 2 | Determine the impersonation vector (email, social media, website, in-person) | Within 2 hours |
| 3 | Take immediate containment action (see 5.2) | Within 4 hours |
| 4 | Notify affected pilots if their data was exposed | Within 24 hours |
| 5 | File platform takedown requests (social media, domain registrar, hosting provider) | Within 24 hours |
| 6 | Report to CAAP FSIS if CAAP branding was impersonated | Within 24 hours |
| 7 | File a cybercrime report with the Philippine DOJ Cybercrime Office if financial fraud occurred | Within 48 hours |
| 8 | Post a public advisory on PilotRecognition.com warning pilots of the impersonation | Within 48 hours |
| 9 | Conduct post-incident review and update detection rules | Within 7 days |

### 5.2 Containment Actions by Vector

#### Email Impersonation
- If from our domain: Rotate Resend API key immediately. Check Worker logs for unauthorized `handleEmailSend` calls. Audit all emails sent in the past 30 days.
- If from lookalike domain: Report to domain registrar for suspension. Report to email providers (Gmail, Outlook) for blocklisting. Publish advisory.

#### Social Media Impersonation
- File impersonation report with the platform (Facebook: facebook.com/help/impostor, Instagram: help.instagram.com, LinkedIn: linkedin.com/help/linking/ish, X: help.twitter.com/forms/impersonation).
- Preserve evidence before the account is taken down.
- If the account is collecting payments, report to payment processor (GCash, PayPal, bank).

#### Fake Website
- Report to hosting provider for suspension.
- Report to domain registrar for suspension.
- File UDRP (Uniform Domain-Name Dispute-Resolution Policy) if domain is confusingly similar.
- Submit to Google Safe Browsing for blocklisting.

#### In-Person / Community Channel Impersonation
- Document the individual's name, contact information, and claims.
- Issue a cease and desist letter.
- Notify the flight school or venue where the impersonation occurred.
- Report to CAAP FSIS if CAAP authority was claimed.

### 5.3 CAAP FSIS Reporting for Brand Impersonation

When CAAP branding is impersonated:

1. Compile an impersonation incident report containing:
   - Impersonator's name, contact details, and platform accounts
   - Evidence of CAAP branding misuse (screenshots, emails, URLs)
   - List of affected or targeted pilots (if known)
   - Any payments solicited or received
   - Timeline of impersonation activity
2. Submit to CAAP FSIS at `publicassistance@caap.gov.ph` and `network.admin@caap.gov.ph`
3. Include a copy of the PilotRecognition advisory and takedown requests filed
4. Request CAAP to issue a public advisory on their official channels

---

## 6. Authorized Communications Register

### 6.1 Official PilotRecognition Channels

| Channel | Address | Notes |
|---|---|---|
| Email (transactional) | `noreply@pilotrecognition.com` | Sent via Resend. Display name: "PilotRecognition" |
| Email (support) | To be established | Must be on `pilotrecognition.com` domain |
| Website | `https://pilotrecognition.com` | Only official domain |
| Social media | To be verified and listed | Must be in `authorized_representatives` table |

### 6.2 What PilotRecognition Will Never Do

- Ask for payment outside the platform's official checkout (Dodo Payments)
- Guarantee CAAP licensing or pass rates
- Claim to have "inside connections" at CAAP
- Ask for a pilot's password, full credit card number, or medical records via email or chat
- Send emails from `@gmail.com`, `@yahoo.com`, or any non-`pilotrecognition.com` domain
- Authorize third-party brokers to collect documents or payments on our behalf

### 6.3 What CAAP Will Never Do (Per CAAP Advisory)

- Solicit financial favors via non-government email domains
- Use personal phone numbers for official transactions
- Process payments outside official government channels

---

## 7. Code References

| Finding | File | Lines |
|---|---|---|
| Client-controllable email display name | `worker/src/index.ts` | 1099, 1125-1127 |
| Email rate limit not enforced | `worker/src/index.ts` | 1118-1122 |
| Email API secret timing comparison | `worker/src/index.ts` | 1113-1115 |
| Cloudinary unsigned preset | `components/enterprise/VerificationSubmissionForm.tsx` | 14 |
| Profile search (no rate limit) | `worker/src/index.ts` | 204-218 |
| CORS wildcard | `worker/src/index.ts` | 20 |
| No JWT verification (enables all API abuse) | `worker/src/index.ts` | 77-131 |
