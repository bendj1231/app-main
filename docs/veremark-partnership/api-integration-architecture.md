# Veremark API Integration Architecture
## PilotRecognition Platform Technical Specification

**Document Version:** 1.0  
**Date:** May 2026  
**Status:** Development Phase

---

## 1. System Overview

### 1.1 Integration Philosophy
PilotRecognition acts as the orchestration layer between pilots, Veremark's verification engine, and aviation operators. We maintain pilot data ownership while leveraging Veremark for authoritative verification.

### 1.2 Data Flow Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   PILOT ENTRY   │────▶│  VALIDATION LAYER│────▶│ VEREMARK API    │
│                 │     │                  │     │                 │
│ - License No    │     │ - Format Check   │     │ - PRC Verify    │
│ - Medical Date  │     │ - Logic Verify   │     │ - NBI Clearance │
│ - Flight Hours  │     │ - Cross-Ref      │     │ - Employment    │
│ - Type Ratings  │     │                  │     │ - Education     │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                                                          │
                                                          ▼
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  RECOGNITION    │◀────│  WEBHOOK         │◀────│ VERIFICATION    │
│  SCORE UPDATE   │     │  HANDLER         │     │ RESULTS         │
│                 │     │                  │     │                 │
│ - Recalculate   │     │ - Parse Payload  │     │ - Status        │
│ - Badge Update  │     │ - Update DB      │     │ - Details       │
│ - Notify Pilot  │     │ - Audit Log      │     │ - Expiry        │
└─────────────────┘     └──────────────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│  PILOT PROFILE  │
│                 │
│ Verification    │
│ Badge Display   │
│ Discrepancy     │
│ Flag (if any)   │
└─────────────────┘
```

---

## 2. Data Mapping Specification

### 2.1 Philippines Verification Data Points

| Pilot Data Field | Veremark Check Type | Data Source | Update Frequency |
|------------------|---------------------|-------------|------------------|
| `prc_license_number` | PRC License Verification | Professional Regulation Commission | Annual renewal |
| `prc_license_expiry` | License Status Check | PRC Database | Real-time via API |
| `nbi_clearance_no` | Criminal Background Check | NBI Clearance | Every 6 months |
| `nbi_issue_date` | Clearance Validity | NBI Database | Per check |
| `medical_class` | Medical Certification | CAAP / Aviation Medical Examiners | Every 6-12 months |
| `medical_expiry` | Medical Status Check | CAAP Medical Records | Real-time via API |
| `employment_history` | Employment Verification | Previous Airlines | Per check |
| `education_records` | Academic Verification | Flight Schools / Universities | One-time |
| `physical_address` | Address Verification | Utility Bills / Official Docs | Annual |

### 2.2 API Data Schema

#### Request Payload (Pilot → Veremark)
```json
{
  "verification_request": {
    "request_id": "uuid-v4-string",
    "pilot_id": "pilotrecognition-internal-id",
    "check_bundle": "airside_professional_philippines",
    "data_package": {
      "personal": {
        "full_name": "Juan Dela Cruz",
        "date_of_birth": "1990-05-15",
        "nationality": "Philippines",
        "government_id": "PH-123456789"
      },
      "professional": {
        "prc_license": "PRC-2023-123456",
        "prc_category": "Airline Transport Pilot",
        "caap_license": "CAAP-ATP-78901",
        "medical_class": "Class 1",
        "medical_issued": "2024-01-15",
        "medical_expiry": "2024-07-15"
      },
      "employment": [
        {
          "employer": "Cebu Pacific",
          "position": "First Officer A320",
          "period": "2020-2024",
          "total_hours": 3500
        }
      ],
      "education": [
        {
          "institution": "Philippine State Aviation College",
          "qualification": "BS Aviation",
          "year_completed": "2018"
        }
      ]
    },
    "consent": {
      "pilot_consent_id": "consent-uuid",
      "consent_timestamp": "2026-05-10T14:30:00Z",
      "consent_expiry": "2027-05-10T14:30:00Z",
      "data_processing_agreed": true,
      "third_party_sharing": false
    }
  }
}
```

#### Response Payload (Veremark → PilotRecognition)
```json
{
  "verification_result": {
    "request_id": "uuid-v4-string",
    "pilot_id": "pilotrecognition-internal-id",
    "verification_id": "veremark-verification-reference",
    "status": "completed",
    "completed_at": "2026-05-10T16:45:00Z",
    "valid_until": "2027-05-10T16:45:00Z",
    "overall_result": "verified",
    "checks": [
      {
        "check_type": "prc_license_verification",
        "status": "verified",
        "details": {
          "license_number": "PRC-2023-123456",
          "license_status": "Active",
          "expiry_date": "2025-12-31",
          "category": "Airline Transport Pilot"
        },
        "verified_at": "2026-05-10T16:30:00Z"
      },
      {
        "check_type": "nbi_clearance",
        "status": "verified",
        "details": {
          "clearance_number": "NBI-2026-A12345",
          "issued_date": "2026-01-10",
          "valid_until": "2026-07-10",
          "findings": "No Derogatory Record"
        },
        "verified_at": "2026-05-10T16:35:00Z"
      },
      {
        "check_type": "medical_certification",
        "status": "verified",
        "details": {
          "medical_class": "Class 1",
          "examiner": "Dr. Maria Santos",
          "issued": "2024-01-15",
          "expiry": "2024-07-15",
          "restrictions": "None"
        },
        "verified_at": "2026-05-10T16:40:00Z"
      }
    ],
    "discrepancies": [],
    "confidence_score": 98.5
  }
}
```

---

## 3. Webhook Integration

### 3.1 Webhook Endpoint
```
POST https://api.pilotrecognition.com/v1/webhooks/veremark
```

### 3.2 Security
- HMAC signature verification using shared secret
- IP whitelist: Veremark production IPs
- TLS 1.3 required
- Payload encryption: AES-256-GCM

### 3.3 Webhook Events

| Event Type | Trigger | Action |
|------------|---------|--------|
| `verification.completed` | All checks finished | Update pilot profile, send notification |
| `verification.discrepancy` | Mismatch found | Flag for pilot review, hold badge |
| `verification.expiring` | 30 days to expiry | Alert pilot, initiate renewal |
| `verification.revoked` | Source data changed | Remove badge, notify pilot |

### 3.4 Discrepancy Handling Workflow

```
┌─────────────────┐
│ Discrepancy     │
│ Detected        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Pilot Profile   │────▶│ "Under Review"  │
│ Flagged         │     │ Badge Shown     │
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐
│ Email + Push    │
│ Notification    │
│ to Pilot        │
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ 14-Day Review   │────▶│ Pilot Uploads   │
│ Period          │     │ Counter-Evidence│
└────────┬────────┘     └─────────────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│ Manual Review   │────▶│ Dispute         │
│ by PR Team      │     │ Resolution      │
└─────────────────┘     └─────────────────┘
```

---

## 4. Implementation Timeline

### Phase 1: API Development (Weeks 1-2)
- [ ] Webhook endpoint development
- [ ] Payload validation schemas (Zod)
- [ ] Security layer (HMAC, encryption)
- [ ] Database schema updates for verification tracking

### Phase 2: Integration Testing (Weeks 3-4)
- [ ] Sandbox environment setup
- [ ] Test payload exchange
- [ ] Error handling verification
- [ ] Discrepancy workflow testing

### Phase 3: Alpha Deployment (Weeks 5-6)
- [ ] 50 Founding Pilots onboarding
- [ ] Manual verification fallback
- [ ] Consent flow testing
- [ ] Feedback collection

### Phase 4: Production Launch (Week 7+)
- [ ] Full API automation
- [ ] Production monitoring
- [ ] Performance optimization
- [ ] Scale to 500+ pilots

---

## 5. Consent Architecture

### 5.1 Verification Consent Flow

```
┌─────────────────┐
│ Pilot Clicks    │
│ "Get Verified"  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Consent Modal   │
│ - What we verify│
│ - Who sees it   │
│ - How long      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Explicit        │
│ Checkbox:       │
│ "I consent to   │
│ verification"   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Payment         │
│ (if applicable) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Data Submission │
│ to Veremark     │
└─────────────────┘
```

### 5.2 Visibility Toggle (Post-Verification)

**Default State:** OFF (not visible to airlines)
**Pilot Control:** Toggle in Profile Settings
**Label:** "Make Verified Profile Visible to Airlines"
**Subtext:** "When enabled, verified airlines can see your credentials in pathway searches"

---

## 6. Error Handling & Edge Cases

### 6.1 API Failure Scenarios

| Scenario | Response | Retry Logic |
|----------|----------|-------------|
| Veremark API timeout | Queue for retry | 3 attempts, exponential backoff |
| Invalid payload | Log error, alert dev | No retry, manual review |
| Pilot data mismatch | Flag discrepancy | Pilot notification, manual resolution |
| Expired verification | Remove badge | Pilot alert, renewal prompt |
| Duplicate request | Return cached result | Idempotency check |

### 6.2 Audit Trail

Every verification action logged:
```json
{
  "log_id": "uuid",
  "timestamp": "ISO-8601",
  "pilot_id": "internal-id",
  "action": "verification_requested|completed|disputed|renewed",
  "veremark_ref": "external-ref",
  "ip_address": "xxx.xxx.xxx.xxx",
  "user_agent": "string",
  "result": "success|failure|discrepancy"
}
```

---

## 7. Security & Compliance

### 7.1 Data Protection
- PII encrypted at rest (AES-256)
- TLS 1.3 for all transmissions
- Field-level encryption for sensitive data
- 90-day audit log retention

### 7.2 Philippines DPA 2012 Compliance
- Lawful basis: Consent (Article 6)
- Purpose limitation: Verification only
- Data minimization: Only necessary fields shared
- Retention: 1 year post account closure
- Cross-border: Data Processing Agreement in place

### 7.3 Pilot Rights
- Right to access verification results
- Right to dispute inaccuracies
- Right to data portability (export)
- Right to deletion (with limitations)

---

## 8. Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| API uptime | 99.9% | Monitoring dashboard |
| Verification completion time | <24 hours | Average from request to result |
| Discrepancy rate | <5% | Disputes / Total verifications |
| Pilot satisfaction | >4.5/5 | Post-verification survey |
| Badge display rate | >80% | Verified pilots who enable visibility |

---

## 9. Next Steps

1. **Veremark to provide:**
   - Sandbox API credentials
   - Webhook payload documentation
   - Philippines data source specifications

2. **PilotRecognition to complete:**
   - Webhook endpoint implementation
   - Consent flow UI updates
   - Privacy policy DPA 2012 additions
   - Alpha pilot cohort recruitment

3. **Joint activities:**
   - Technical integration kickoff
   - Legal review of data processing agreement
   - Philippines team coordination (70+ specialists)

---

*This architecture document reflects current development status and planned implementation. Subject to refinement during technical integration phase.*
