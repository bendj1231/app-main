# Privacy Policy Update: Data Custody Model

**Insert this section into your Privacy Policy (recommended: Section 2c, between Verifiable Credential Data and Usage Data)**

---

## 2c. How We Handle Your Documents

**We do not store your physical documents.**

When you upload your pilot license, medical certificate, or other credentials for verification, here is exactly what happens:

### The Three-Tier Data Model

#### **TIER 1: Your Pilot Wallet (Your Device)**
Your device stores:
- ✅ Your W3C Verifiable Credentials (VCs) — cryptographically signed proof of your qualifications
- ✅ Your private keys (P-256, military-grade encryption, non-extractable)
- ✅ Your Decentralized Identifier (DID)

**We cannot access this data.** Only you control your private keys. If you delete the app or clear your browser, these credentials are gone unless you backed them up.

**Storage:** IndexedDB in your browser (encrypted with your device keychain)

---

#### **TIER 2: PilotRecognition Platform (Our Servers)**
We store only **text claims** — no documents, no images, no PDFs:

| What We Store | Example | Why |
|---------------|---------|-----|
| License number | "REDACTED-CPL" | Verification lookup |
| License type | "Commercial Pilot License" | Credential classification |
| Medical class | "Class 1" | Airline eligibility check |
| Expiry dates | "2026-10-23" | Expiration monitoring |
| Total flight hours | "1,500" | Pathway matching |
| Credential status | "active / revoked / expired" | Revocation registry |

**What we NEVER store:**
- ❌ Physical license scans or images
- ❌ Medical certificates (PDFs/images)
- ❌ Passport copies or photos
- ❌ Logbook scans
- ❌ Biometric data (except optional voice recordings for PSA stories, with separate consent)

**Storage:** Supabase (Sydney, Australia) — AES-256-GCM encrypted at rest, TLS 1.3 in transit

**Retention:** 
- Active credentials: Life of your account + 2 years
- Expired/revoked credentials: 7 years (to comply with aviation authority audit requirements)
- Audit logs: 12 months

---

#### **TIER 3: Regional Verification Providers (Document Custodians)**
Your physical documents go directly to verification partners in your jurisdiction:

| Your Country | Document Custodian | Data Residency |
|--------------|-------------------|----------------|
| Philippines | Veremark Philippines (with CAAP integration) | Philippines |
| United States | Veremark US (with FAA verification) | United States |
| European Union | Veremark EU (GDPR-compliant infrastructure) | EU |
| UAE | Local aviation authority (GCAA) | UAE |
| Other | Veremark or local authority | Per local law |

**What they store:**
- 📄 Scanned license copies
- 📄 Medical certificates (physical or digital)
- 📄 Logbook extracts
- 📄 Verification reports

**What we receive from them:**
Only a verification result:
```
{
  "status": "verified",
  "license_type": "CPL",
  "medical_class": "1", 
  "expiry_date": "2026-10-23",
  "issuing_authority": "CAAP"
}
```

**The physical document never touches our servers.** We only receive the "verified" status and basic metadata.

---

### Why This Architecture?

1. **Privacy:** Physical documents stay in your country under local jurisdiction
2. **Security:** If we are breached, attackers get only text — not your passport or medical forms
3. **Compliance:** We minimize special category data (health data from medical certs)
4. **Control:** You hold the cryptographic proof in your wallet — we can't revoke your credentials without your knowledge

---

### Your Rights

**Right to Access:**
You can download:
- Your credentials (W3C VCs in JWT format)
- Your text profile (JSON export)

You cannot download physical documents from us — we don't have them. Request directly from:
- Veremark: [privacy@veremark.com](mailto:privacy@veremark.com)
- Your local aviation authority (CAAP, FAA, etc.)

**Right to Erasure ("Delete My Data"):**
When you request deletion:
1. ✅ We delete your text claims from our database (immediate)
2. ✅ We revoke your credentials in our status list (immediate)
3. ✅ We request deletion from Veremark/authority (within 30 days)
4. ✅ You must delete credentials from your own wallet (we cannot access your device)

**Note:** We cannot guarantee deletion from aviation authority records — they have separate legal obligations to retain pilot records per ICAO standards.

**Right to Data Portability:**
Your wallet credentials are already in standard W3C format — take them to any compatible wallet or airline system.

---

### Changes to This Model

If we ever need to store physical documents (e.g., for regulatory audit), we will:
1. Obtain your explicit consent
2. Update this privacy policy
3. Notify all affected pilots 30 days in advance

**Current status:** We have NO plans to store physical documents.

---

### Questions?

Contact our Data Protection Officer (to be appointed) at: **privacy@pilotrecognition.com**

Or contact Veremark directly for document-related inquiries: **privacy@veremark.com**

---

**Version History:**
- v1.0 (June 2, 2026): Added three-tier data custody clarification
- Previous versions: See archive at [link]

**Last Updated:** June 2, 2026
