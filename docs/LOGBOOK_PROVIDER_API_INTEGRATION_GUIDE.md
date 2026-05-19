# Logbook Provider API Integration Guide
## Connect Your Digital Logbook to the Recognition+ Verification Network

**Version:** 1.0  
**Last Updated:** May 19, 2026  
**Contact:** partnerships@pilotrecognition.com

---

## Executive Summary

Integrate your digital logbook application with PilotRecognition and **transform your passive data hosting into an active revenue stream**.

**The Value Proposition:**
- Pilots get **instantly verified** flight hours (green badge on your app)
- You capture **5% of every $99 verification** ($4.95 per check)
- **Competitive moat**: "Verified by PilotRecognition" stamp vs. unverified competitors
- **Customer acquisition**: Pilots switch to your app for the verification badge

---

## Revenue Model

### The 5% Network Toll

For every pilot verification that touches your API:

```
[ Pilot pays $99 for Verification ]
              │
              ├──► $23.00 (23%) → Veremark (background check)
              ├──► $4.95 (5%) → YOU (Logbook Provider) 💰
              ├──► $4.95 (5%) → ATO/Airline (validator)
              └──► $65.34 (66%) → PilotRecognition (platform)
```

**Annual Opportunity:**
- 1,000 pilots verify through your app = **$4,950/year**
- 10,000 pilots verify = **$49,500/year**
- 100,000 pilots verify = **$495,000/year**

*Passive revenue from data you already host.*

---

## Integration Architecture

### The Verification Flow

```
[ Pilot initiates Verification on PilotRecognition ]
              │
              ▼
[ Veremark API pings YOUR Logbook Endpoint ]
              │
              ├──► Request: "Verify flight hours for Pilot ID #12345"
              │
              ├──► Your API returns: Hashed flight records
              │
              └──► You earn 5% when verification completes
```

**No Data Storage on Our End:**
- We request data via secure API
- You return cryptographic hashes
- We never store raw logbooks
- Session ends = data shatters

---

## API Requirements

### 1. Authentication

**OAuth 2.0 with PKCE**
```
Authorization: Bearer {pilot_access_token}
X-Logbook-Provider-ID: your_provider_id
X-Request-Signature: HMAC-SHA256
```

### 2. Required Endpoints

#### A. Pilot Verification Request

```http
POST /api/v1/pilotrecognition/verify
Content-Type: application/json
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "verification_id": "ver_7a8f9e2d4c6b5a1",
  "pilot_id": "792250be-00fc-4bbf-b4a5-8673de7484f3",
  "pilot_email_hash": "sha256:abc123...",
  "request_timestamp": "2026-05-19T08:30:00Z",
  "requested_records": {
    "date_range": {
      "from": "2025-01-01",
      "to": "2026-05-19"
    },
    "record_types": ["flight_time", "simulator_time", "duty_time"]
  }
}
```

**Response Body:**
```json
{
  "verification_id": "ver_7a8f9e2d4c6b5a1",
  "status": "verified",
  "records_hash": "sha256:def456...",
  "total_hours": {
    "pic": 1250.5,
    "sic": 750.2,
    "night": 420.3,
    "instrument": 380.7,
    "multi_engine": 890.4
  },
  "flight_segments": [
    {
      "date": "2025-04-15",
      "tail_number": "RP-C1234",
      "aircraft_type": "Cessna 172S",
      "departure": "RPLL",
      "arrival": "RPLC",
      "block_time": 2.5,
      "pic_time": 2.5,
      "sic_time": 0,
      "night_time": 0,
      "hobbs_start": "245.7",
      "hobbs_end": "248.2",
      "flight_release_number": "FRC-WCC-2025-0415-001",
      "segment_hash": "sha256:ghi789..."
    }
  ],
  "signature": "sha256:jkl012...",
  "timestamp": "2026-05-19T08:30:03Z"
}
```

#### B. Health Check

```http
GET /api/v1/pilotrecognition/health
```

**Response:**
```json
{
  "status": "healthy",
  "version": "1.0.0",
  "last_updated": "2026-05-19T00:00:00Z"
}
```

#### C. Webhook Receiver (Optional)

Receive real-time verification status:

```http
POST /webhooks/pilotrecognition/verification
Content-Type: application/json
```

**Payload:**
```json
{
  "event": "verification.completed",
  "verification_id": "ver_7a8f9e2d4c6b5a1",
  "pilot_id": "792250be-00fc-4bbf-b4a5-8673de7484f3",
  "status": "verified",
  "provider_earnings": 4.95,
  "timestamp": "2026-05-19T08:30:03Z"
}
```

---

## Data Format Requirements

### 1. Flight Record Schema

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `date` | ISO 8601 | ✓ | Flight date (YYYY-MM-DD) |
| `tail_number` | string | ✓ | Aircraft registration |
| `aircraft_type` | string | ✓ | ICAO type designator |
| `departure` | ICAO code | ✓ | Origin airport |
| `arrival` | ICAO code | ✓ | Destination airport |
| `block_time` | decimal | ✓ | Total flight time |
| `pic_time` | decimal | ✓ | PIC hours |
| `sic_time` | decimal | ✓ | SIC hours |
| `night_time` | decimal | ✗ | Night hours |
| `instrument_time` | decimal | ✗ | Instrument time |
| `hobbs_start` | string | ✓ | Hobbs meter start |
| `hobbs_end` | string | ✓ | Hobbs meter end |
| `flight_release_number` | string | ✓ | Official release cert |

### 2. Cryptographic Hashing

**Hash Algorithm:** SHA-256

**Hash Input Format:**
```
{date}:{tail_number}:{aircraft_type}:{departure}:{arrival}:{block_time}:{pic_time}:{sic_time}:{hobbs_start}:{hobbs_end}:{flight_release_number}
```

**Example:**
```
2025-04-15:RP-C1234:C172:RPLL:RPLC:2.5:2.5:0:245.7:248.2:FRC-WCC-2025-0415-001
```

**Hash Output:**
```
sha256:a3f7c8d9e2b1f5e6a4c8d7b9f3e1a2b5c6d7e8f9a1b2c3d4e5f6a7b8c9d0e1f2
```

---

## Security Requirements

### 1. TLS 1.3
All API communications must use TLS 1.3 or higher.

### 2. Request Signing
Sign all requests with HMAC-SHA256:

```python
import hmac
import hashlib

signature = hmac.new(
  key=provider_secret.encode(),
  msg=request_body.encode(),
  digestmod=hashlib.sha256
).hexdigest()
```

### 3. Rate Limiting
- **Burst:** 100 requests/minute
- **Sustained:** 1,000 requests/hour
- **Webhook retries:** 3 attempts with exponential backoff

### 4. Data Privacy
- Never return raw PII (names, addresses)
- Use pilot_id hashes only
- All data encrypted in transit and at rest

---

## Sandbox Environment

### Base URL
```
https://sandbox-api.pilotrecognition.com/v1
```

### Test Credentials
```
Provider ID: test_logbook_001
API Key: test_key_sandbox_xyz789
Secret: test_secret_sandbox_abc123
```

### Test Pilot Data
```
Pilot ID: 792250be-00fc-4bbf-b4a5-8673de7484f3
Email: test@pilotrecognition.com
Test Scenario: Philippines CPL verification
```

---

## Marketing Playbook

### 1. Pilot-Facing Messaging

**Subject:** Your Flight Hours Are Now Instantly Verifiable

**Body:**
```
[Your Logbook App] + PilotRecognition = Verified Hours

✓ Green verification badge on your profile
✓ Airlines see your hours as fraud-proof
✓ No more paper logbook printing for interviews

As a [Your Logbook App] user, your flight hours are now 
dynamically verified by the PilotRecognition network.

Verified pilots get priority access to:
• $1,200/day contract routes
• International ferry assignments
• Elite airline pathways

Upgrade to Recognition+ to activate your verification badge.
```

### 2. Competitive Differentiator

**Your Unique Selling Proposition:**
> "The only electronic logbook with blockchain-backed, ATO-verified flight hours. Switch from [Competitor] and get your hours certified instantly."

### 3. Dashboard Badge

Display a **green "Verified by PilotRecognition" badge** next to pilot hours in your app UI.

---

## Implementation Timeline

| Phase | Duration | Deliverables |
|-------|----------|--------------|
| **1. Sandbox Setup** | 1-2 days | API keys, test environment access |
| **2. Endpoint Development** | 1-2 weeks | `/verify`, `/health`, webhook endpoints |
| **3. Security Audit** | 3-5 days | HMAC signing, TLS, rate limiting |
| **4. Integration Testing** | 1 week | End-to-end verification flow |
| **5. Production Deploy** | 1 day | Live API keys, monitoring setup |
| **6. Marketing Launch** | 2 weeks | Customer communications, badge UI |

**Total: 4-6 weeks to first verified pilot**

---

## Revenue Reporting

### Real-Time Dashboard

Access your earnings at:
```
https://partners.pilotrecognition.com/dashboard
```

**Metrics Available:**
- Total verifications processed
- Revenue earned (5% per check)
- Verification success rate
- Pilot conversion funnel
- Geographic distribution

### Payout Schedule

- **Minimum payout:** $100
- **Frequency:** Monthly (1st of month)
- **Method:** USDC (crypto) or Wire (USD)
- **Reporting:** Automated tax documents (1099/Form W-8BEN)

---

## Support & Contact

### Technical Support
- **Email:** dev-support@pilotrecognition.com
- **Slack:** #logbook-integrations (invite-only)
- **Documentation:** docs.pilotrecognition.com

### Partnership Inquiries
- **Email:** partnerships@pilotrecognition.com
- **Phone:** +1 (555) REC-OGNZ

---

## Frequently Asked Questions

**Q: Do we need to build a new API from scratch?**  
A: No. Add 2-3 endpoints to your existing API infrastructure.

**Q: How much engineering effort is required?**  
A: 1 engineer, 2-3 weeks, part-time.

**Q: Can we white-label the verification?**  
A: Yes. Display "Powered by PilotRecognition" or full white-label.

**Q: What if our pilot doesn't have a Recognition+ subscription?**  
A: We redirect them to subscribe. You still earn 5% when they verify.

**Q: Is this exclusive?**  
A: No. Multiple logbook providers can integrate. Competition drives quality.

---

## Next Steps

1. **Review this guide** with your engineering team
2. **Request sandbox access** at dev-support@pilotrecognition.com
3. **Build the 3 endpoints** (`/verify`, `/health`, webhook)
4. **Pass security audit** (we provide checklist)
5. **Go live** and start earning 5% on every verification

**Welcome to the network.**
