# DPO Data Controller Registration — Step-by-Step for Marie

**Form URL:** https://eform.govmu.org/forms/DataProtectionOffice/Controller/Controller.php

**Fee:** MUR 1,000 (micro company — 5 employees or less)
**Payment:** Credit card online OR cheque to "Government of Mauritius" at DPO office
**Valid for:** 3 years

---

## Section 1: Organisation Details

| Field | What to enter |
|-------|---------------|
| **Name of Organisation** | Aviation Pathways Ltd |
| **Business Registration Number** | [Will be issued by CBRD after incorporation — apply for this first, or write "pending incorporation"] |
| **Registered Address** | 24 Avenue Le Morne, Black Rock 2, Villa 24, Tamarin, Republic of Mauritius |
| **Contact Person** | Marie Maureen Synthia Maya |
| **Designation** | Managing Director |
| **Telephone** | +230 5945 3519 |
| **Email** | maureenmaya84@gmail.com |
| **Number of Employees** | 2 (Marie + Benjamin) |
| **Annual Turnover** | MUR 0 (pre-revenue / startup) |

---

## Section 2: Data Protection Officer (DPO)

| Field | What to enter |
|-------|---------------|
| **Name of DPO** | Benjamin Bowler |
| **Email** | benjamin@pilotrecognition.com |
| **Telephone** | +639670481890 |
| **Address** | Dacanay Boarding House, Apt 10, Rosario, La Union, Concepcion 2506, Philippines |
| **Is DPO resident in Mauritius?** | No |
| **Is DPO an employee?** | Yes (Non-Executive Director) |

---

## Section 3: Description of Personal Data Processed

**Categories of data subjects:**
- Pilots (individuals seeking career verification and pathway matching)
- Flight Academy / ATO representatives (enterprise users)
- Airline / operator HR personnel (enterprise users)

**Categories of personal data processed:**
1. **Identity data:** Full name, date of birth, nationality, photograph, passport/NIC number
2. **Contact data:** Email address, phone number, residential address
3. **Professional credentials:** Pilot license numbers, medical certificate details, logbook hours, training records, radio operator licence, language proficiency ratings
4. **Verification data:** Background check results, education verification, employment history, ATO training records
5. **Account data:** Login credentials, user preferences, subscription tier, platform usage logs
6. **Payment data:** Stripe transaction IDs, billing records (no card numbers stored — handled by Stripe)
7. **Technical data:** IP address, device fingerprint, browser type, geolocation (for security and fraud prevention)

**Purpose of processing:**
- To provide a pilot verification and career pathway platform
- To enable airlines and operators to verify pilot credentials
- To match pilots with appropriate training and employment pathways
- To process subscription payments and maintain accounts
- To comply with aviation regulatory requirements

---

## Section 4: Security Measures & Safeguards

**Copy and paste the following:**

```
1. Encryption: All personal data is encrypted at rest using AES-256-GCM. 
   Data in transit is protected via TLS 1.2/1.3.

2. Access Control: Role-based access control (RBAC) with Supabase 
   Row-Level Security (RLS) policies. Only authenticated users can 
   access their own data. Enterprise users can only pull anonymised 
   pilot profiles unless explicitly authorised.

3. Authentication: Multi-factor authentication (MFA) required for 
   admin accounts. OAuth 2.0 / OIDC for user login (Auth0 + Google).

4. Infrastructure: Cloud-hosted on Supabase (AWS Sydney), Neon 
   PostgreSQL (Singapore), and MongoDB Atlas (Singapore). All 
   providers are ISO 27001 certified.

5. Backups: Automated daily encrypted backups with 7-day retention 
   on Supabase. Disaster recovery plan in place.

6. Monitoring: Security event logging, rate limiting, CSRF 
   protection, and automated threat detection implemented.

7. Staff Training: DPO (Benjamin Bowler) has completed data 
   protection training. All staff bound by confidentiality 
   obligations in employment agreements.

8. Incident Response: Breach notification procedure in place. 
   Data Protection Office will be notified within 72 hours of 
   any confirmed data breach per DPA 2017 requirements.
```

---

## Section 5: Data Transfers Outside Mauritius

**Copy and paste:**

```
Personal data is transferred to and stored in the following locations:

1. Supabase (AWS Sydney, Australia) — authentication, profiles, 
   credentials database. Provider: Supabase Inc. (USA).

2. Neon PostgreSQL (Singapore) — pathway cards, OEM data, 
   IPFS index. Provider: Neon Inc. (USA).

3. MongoDB Atlas (Singapore) — raw aviation API payloads, 
   flight telemetry, logbook JSON. Provider: MongoDB Inc. (USA).

4. Cloudflare (Global CDN) — edge caching and DDoS protection. 
   Provider: Cloudflare Inc. (USA).

5. Stripe (USA) — payment processing. No card data stored on 
   our servers.

6. Auth0 / Google (USA) — identity verification and OAuth login.

All transfers are governed by standard contractual clauses (SCCs) 
or equivalent safeguards. The company does not transfer data to 
jurisdictions lacking adequate data protection standards per 
Mauritius DPA 2017.
```

---

## Section 6: Supporting Documents to Prepare

| Document | Status | Action |
|----------|--------|--------|
| Certified copy of company incorporation certificate | ⏳ **PENDING CBRD FILING** | All documents under review. Company not yet incorporated. Do NOT file DPO registration until CBRD issues certificate. |
| Production signing infrastructure | ✅ Ready | `PLATFORM_SIGNING_KEY_JWK` configured, DID document live |
| DPO appointment letter (signed by Managing Director) | ✅ Drafted | See below — sign AFTER incorporation certificate received |
| Privacy Policy (public document) | ✅ Ready | Link: pilotrecognition.com/privacy-policy |
| Data Controller Agreement | ✅ Ready | Link: pilotrecognition.com/data-controller-agreement |

---

## DPO Appointment Letter (Draft for Benjamin to Sign)

```
DPO APPOINTMENT LETTER

Date: [Date]

To: Benjamin Bowler
From: Marie Maureen Synthia Maya, Managing Director, Aviation Pathways Ltd

RE: Appointment as Data Protection Officer

Dear Benjamin,

I hereby appoint you as the Data Protection Officer (DPO) for 
Aviation Pathways Ltd, effective [date].

Your responsibilities include:
- Ensuring compliance with the Mauritius Data Protection Act 2017
- Monitoring data protection policies and procedures
- Responding to data subject requests
- Liaising with the Mauritius Data Protection Office
- Reporting data breaches within 72 hours
- Maintaining the Register of Processing Activities

You have the authority and resources necessary to fulfil these 
duties. You report directly to the Managing Director.

Signed:
_________________________
Marie Maureen Synthia Maya
Managing Director
Aviation Pathways Ltd

Accepted:
_________________________
Benjamin Bowler
Data Protection Officer
```

---

## Next Steps for Marie — FILING SEQUENCE

**⚠️ CRITICAL: Do NOT file DPO registration until Step 1 is complete.**

### Step 1: Company Incorporation (BLOCKING ALL OTHER STEPS)
- Submit **Form 1** and supporting documents to **CBRD** (`companies.govmu.org`)
- Wait for CBRD to issue incorporation certificate for Aviation Pathways Ltd
- **Without this certificate, the DPO appointment letter is legally void**

### Step 2: Sign DPO Appointment Letter
- **Date the letter:** Use the CBRD incorporation date (not before)
- **Marie signs as Managing Director**
- **Benjamin signs as appointed DPO**
- **File a versioned copy** in company records

### Step 3: File DPO Registration (only after Step 1)
1. Go to `https://eform.govmu.org/forms/DataProtectionOffice/Controller/Controller.php`
2. Fill in all sections using the answers above
3. Pay MUR 1,000 by credit card
4. Upload: **incorporation certificate** + **signed DPO appointment letter**
5. Submit

**Expected processing time:** 14 days after submission

**Contact DPO if questions:**
- Phone: (230) 210 3434
- Email: dpo@govmu.org
- Website: dataprotection.govmu.org

---

*Document prepared: June 2, 2026*
*For: Marie Maureen Synthia Maya, Managing Director, Aviation Pathways Ltd*
