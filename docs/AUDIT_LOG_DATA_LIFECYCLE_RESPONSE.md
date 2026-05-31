# Audit Log Data Lifecycle: Pilot Deletion vs. Airline Records

**To:** Data Protection Officer  
**From:** Technical Architecture Team  
**Re:** Right to Erasure (GDPR Art. 17) vs. Financial Audit Trail Retention  
**Date:** May 31, 2026  
**Reference:** PR-DCA-001 v1.6 Article 6, GDPR Art. 17(3)(b), Art. 6(1)(f)

---

## Executive Summary

The system currently implements a **complete purge** of `user_activity_log` records upon pilot account deletion. This creates a legal conflict:

- **Pilot's Right:** GDPR Article 17 grants Right to Erasure
- **Airline's Right:** Financial audit trail proving Recognition Fee billing
- **Platform Risk:** Complete deletion destroys airline transaction verification

**Recommended Solution:** Implement dual-track audit architecture with pseudonymization for financial records.

---

## Current Implementation Analysis

### File: `/supabase/functions/delete-account/index.ts` (Line 110)

```typescript
await supabase.from('user_activity_log').delete().eq('user_id', userId);
```

**Problem:** This indiscriminate deletion removes ALL activity records, including:
- Login/logout events
- Profile updates
- Payment transactions
- Enterprise API pulls
- ATO commission records

**Legal Gap:** Airlines lose transaction ledger proof when pilots exercise erasure rights.

---

## Proposed Solution: Dual-Track Audit Architecture

### Architecture Overview

| Aspect | `user_activity_log` | `financial_audit_trail` |
|--------|---------------------|------------------------|
| **Contents** | Login events, UI actions, IP addresses | Payments, pulls, verifications |
| **Retention** | Deleted with pilot (GDPR Art. 17) | Retained, pseudonymized |
| **Legal Basis** | Consent (Art. 6(1)(a)) | Legitimate interest + Legal obligation (Art. 6(1)(f) + Art. 17(3)(b)) |
| **Contains PII** | Yes (user_id, IP, user_agent) | No post-anonymization |

### Pseudonymization Strategy

When pilot deletes account:

```sql
-- Transform PII into non-personal transaction token
UPDATE financial_audit_trail 
SET 
    transaction_token = SHA256(CONCAT(user_id::text, :instance_salt)),
    user_id = NULL,
    anonymized_at = NOW()
WHERE user_id = :deleting_user_id;
```

**Result:**
- Pre-deletion: `user_id = 792250be-00fc-4bbf-b4a5-8673de7484f3`
- Post-deletion: `transaction_token = txn_7a3f9c2d...` (irreversible hash)

---

## GDPR Compliance Analysis

### Article 17(3)(b) - Legal Obligation Exception

> "Paragraphs 1 and 2 shall not apply to the extent that processing is necessary for compliance with a legal obligation which requires processing by Union or Member State law to which the controller is subject, including for the performance of a task carried out in the public interest..."

**Application:**
- UAE Corporate Tax Law requires 7-year transaction retention
- Airlines require audit trail for payment reconciliation
- Platform requires billing verification for dispute resolution

### Article 6(1)(f) - Legitimate Interests

Financial record retention serves:
1. **Platform's interest:** Tax compliance, audit defense
2. **Airline's interest:** Payment verification, budget reconciliation
3. **Regulatory interest:** AML/CFT transparency

**Balancing Test:**
- ✅ Minimal data (amount, date, service type, anonymous token)
- ✅ No re-identification possible without separate escrow key
- ✅ No profiling or secondary uses
- ✅ Pilot's privacy interests protected via irreversible pseudonymization

---

## Implementation Specification

### 1. Database Migration

```sql
-- Create financial audit trail table
CREATE TABLE financial_audit_trail (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Core transaction data (non-PII after anonymization)
    transaction_token VARCHAR(64) NOT NULL,
    transaction_type VARCHAR(50) NOT NULL CHECK (transaction_type IN (
        'enterprise_pull', 'verification_fee', 'ato_commission', 
        'recognition_plus_subscription', 'pathway_access'
    )),
    amount_usd DECIMAL(10,2) NOT NULL,
    
    -- Enterprise reference (survives deletion)
    airline_enterprise_id UUID REFERENCES enterprise_accounts(id),
    
    -- Temporal data
    occurred_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now(),
    
    -- Retention classification
    retention_class VARCHAR(20) DEFAULT 'financial_7yr',
    anonymized_at TIMESTAMPTZ,
    
    -- Ephemeral PII (NULL after anonymization)
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL
);

-- Indexes for audit queries
CREATE INDEX idx_financial_audit_airline ON financial_audit_trail(airline_enterprise_id, occurred_at);
CREATE INDEX idx_financial_audit_token ON financial_audit_trail(transaction_token);
CREATE INDEX idx_financial_audit_retention ON financial_audit_trail(retention_class, anonymized_at);
```

### 2. Update Delete-Account Function

```typescript
// File: /supabase/functions/delete-account/index.ts

// BEFORE (current):
await supabase.from('user_activity_log').delete().eq('user_id', userId);

// AFTER (proposed):
// 1. Anonymize financial records
await supabase.rpc('anonymize_financial_audit_trail', { 
    deleting_user_id: userId,
    salt: crypto.randomUUID() // Per-instance salt
});

// 2. Delete privacy-bound activity logs
await supabase.from('user_activity_log').delete().eq('user_id', userId);
```

### 3. RPC Function for Anonymization

```sql
CREATE OR REPLACE FUNCTION anonymize_financial_audit_trail(
    deleting_user_id UUID,
    salt TEXT
)
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE financial_audit_trail
    SET 
        transaction_token = encode(
            digest(CONCAT(user_id::text, salt), 'sha256'), 
            'hex'
        ),
        user_id = NULL,
        anonymized_at = NOW()
    WHERE user_id = deleting_user_id;
    
    -- Log anonymization event (for compliance audit)
    INSERT INTO compliance_log (action, details, created_at)
    VALUES (
        'financial_audit_anonymized',
        jsonb_build_object(
            'records_affected', (SELECT COUNT(*) FROM financial_audit_trail WHERE user_id IS NULL AND anonymized_at > NOW() - INTERVAL '1 second'),
            'anonymized_at', NOW()
        ),
        NOW()
    );
END;
$$;
```

### 4. Update Payment-Splitter Function

```typescript
// File: /supabase/functions/payment-splitter/index.ts

// Add dual-track logging:

// Track in privacy-bound activity log (deleted with pilot)
await supabaseAdmin.from('user_activity_log').insert({
    user_id: pilotId,
    action: 'payment_split_created',
    details: { payment_id: paymentId, total: amount },
    created_at: new Date().toISOString(),
});

// Track in financial audit trail (anonymized, retained)
await supabaseAdmin.from('financial_audit_trail').insert({
    transaction_type: 'verification_fee',
    amount_usd: amount,
    user_id: pilotId, // Will be NULLed on pilot deletion
    airline_enterprise_id: atoId, // If applicable
    occurred_at: new Date().toISOString(),
});
```

---

## What Airlines See (Post-Pilot Deletion)

### Sample Billing Report

| Transaction Token | Service Type | Amount (USD) | Date | Status |
|-------------------|--------------|--------------|------|--------|
| `txn_7a3f9c2d...` | Enterprise Pull API | $71.00 | 2026-05-15 | Completed |
| `txn_b2e8d1a4...` | Verification Fee | $99.00 | 2026-05-10 | Completed |

**Airline retains:**
- ✅ Proof of billing and payment
- ✅ Transaction amounts and dates
- ✅ Service classification
- ✅ Aggregate reporting capability

**Airline cannot determine:**
- ❌ Pilot identity (name, license number, PEL)
- ❌ Pilot contact information
- ❌ Historical activity patterns
- ❌ Re-identification without court order

---

## Edge Case Handling

### 1. Refunds and Disputes

**Scenario:** Airline disputes a charge for a deleted pilot.

**Resolution Path:**
1. Airline provides `transaction_token` + `airline_enterprise_id` + date
2. Platform queries: `SELECT * FROM financial_audit_trail WHERE transaction_token = 'txn_...'`
3. Proof retrieved without re-identifying pilot
4. If re-identification legally required: Court order → access escrow key (separate split-key system)

### 2. Tax Compliance (7-Year Retention)

**Implementation:**
```sql
-- Automated retention job (pg_cron)
SELECT cron.schedule('0 0 1 * *', $$
    DELETE FROM financial_audit_trail 
    WHERE retention_class = 'financial_7yr' 
    AND occurred_at < NOW() - INTERVAL '7 years'
$$);
```

### 3. Aggregate Revenue Analytics

Deleted pilots still contribute to:
- Monthly recurring revenue (MRR) calculations
- Revenue per airline reports
- Service-type distribution analytics
- Trend analysis (no individual identification)

---

## DCA Article 6 Amendment

Proposed addition to PR-DCA-001 v1.6:

```
Article 6 — System Lifecycle & Data Subject Rights
[Existing content...]

Addendum 6.1 — Financial Record Retention Exception
Notwithstanding the Right to Erasure under Article 17 GDPR, the Platform retains 
a cryptographically anonymized transaction ledger for financial compliance 
pursuant to GDPR Article 17(3)(b). This ledger contains:
- Transaction amounts and dates
- Service classifications  
- Irreversible pseudonymous tokens (not user IDs)
- Enterprise account references (airlines, ATOs)

This retention is necessary for:
(a) Tax compliance obligations (UAE Federal Decree-Law No. 47 of 2022)
(b) Payment dispute resolution
(c) Audit defense for airlines and the Platform
(d) AML/CFT regulatory transparency

The Credential Custodian's personal identifiers are irreversibly separated 
from financial records at deletion time via SHA-256 hashing with instance salt.
```

---

## Implementation Checklist

- [ ] Create `financial_audit_trail` table migration
- [ ] Implement `anonymize_financial_audit_trail()` RPC function
- [ ] Modify `delete-account` edge function for dual-track deletion
- [ ] Update `payment-splitter` to write to both tables
- [ ] Update `pilot-pull-api` to log enterprise pulls to financial trail
- [ ] Add retention cron job for 7-year deletion
- [ ] Update DCA Article 6 with Addendum 6.1
- [ ] Create compliance monitoring dashboard for anonymization events
- [ ] Document for legal team: pseudonymization methodology
- [ ] Schedule DPO review of balancing test documentation

---

## Conclusion

The dual-track audit architecture reconciles the pilot's GDPR Right to Erasure with the airline's legitimate financial audit needs. By implementing **pseudonymization** rather than complete deletion for financial records:

1. **Pilots retain** effective erasure of personal identifiers (PII removed)
2. **Airlines retain** transaction verification capability (billing records preserved)
3. **Platform retains** tax compliance and dispute resolution capability
4. **Regulators retain** transparency into financial flows (non-personal data)

This approach is consistent with GDPR Article 17(3)(b) legal obligation exceptions and Article 6(1)(f) legitimate interests, provided the balancing test documentation is maintained.

---

**Next Steps:**
1. Legal review of balancing test documentation
2. DPO approval of pseudonymization methodology
3. Technical implementation (estimated 2-3 days)
4. Compliance testing with sample deletion/anonymization
5. DCA v1.7 release with Article 6 Addendum

**Status:** Awaiting DPO approval to proceed with implementation.
