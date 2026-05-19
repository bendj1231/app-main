# Legal Framework: Domain-Only Operation
## Operating Without a Business Entity in the Philippines

**Date:** May 19, 2026  
**Classification:** Legal Infrastructure — Domain-Only Legal Status

---

## The Reality

**Operating purely as a domain name without SEC/DTI registration.**

**Two individuals (Karl and Andrew) launching a revenue-generating platform.**

**Legal classification under Philippine law:**

---

## What Are You Under the Law?

### A. General Partnership / Particular Partnership

**Article 1767, Civil Code of the Philippines:**
> "When two or more persons bind themselves to contribute money, property, or industry to a common fund with the intention of dividing the profits among themselves, a partnership is formed automatically by operation of law."

**Key point:** No partnership agreement or registration required. Law looks at reality of operations.

**Article 1816 — Joint and Solidary Liability:**
- Partners are **personally liable** for debts and obligations
- **Unlimited liability**
- Claimant can pursue personal bank accounts, property, professional flying assets

**The Vulnerability:**
> "If the platform gets sued or fined, your liability is unlimited."

---

### B. Unregistered Electronic Commerce Operator

**Processing automated subscription fees ($1,000/year) via decentralized gateways = e-commerce platform.**

**Operating without:**
- BIR registration (taxes)
- Business operational permits

**Classification:** Informal/unlicensed business

---

## Laws That Apply to Domain-Only Operation

### A. Data Privacy Act of 2012 (R.A. 10173)

**Enforcer:** National Privacy Commission (NPC)

**Section 6 — Extraterritorial Trap:**
> "DPA applies to any processing of personal data relating to a Philippine citizen or resident, or if the contract was entered into in the Philippines."

**Your Exposure:**
- Frontend code handles display, retrieval, transport of personal identifiers
- Names, flight hours, connection logs
- **This IS data processing under the law**

**Liability:**
- Leak from browser session = personal liability
- Administrative and criminal fines under the Act

---

### B. Cybercrime Prevention Act of 2012 (R.A. 10175)

**Classification:** System administrator of computer network

**Your Exposure:**
- Manage login gateway
- Coordinate access tokens across multiple IDPs

**Risk:**
- Hacker compromises domain
- Malicious XSS script steals Auth0 tokens
- **Investigation for "System Interference" or "Negligent Security Practices"**

---

### C. Civil Code of the Philippines

**Breach of Contract & Tort (Article 2176):**

**The Contract:**
- Airline pays $1,000/year = commercial contract formed

**Breach Scenarios:**
- Prolonged API downtime
- Malicious infiltration
- Logic errors causing misverification

**Consequence:**
- Sue for Breach of Contract
- Sue for Quasi-Delict (Negligence)

---

## Three Non-Negotiable Safeguards

**Required even without LLC:**

```
┌──────────────────────────────────────────────┐
│   DOMAIN LEVEL: pilotrecognition.com         │
└──────────────────────┬───────────────────────┘
                       │
┌──────────────────────┴───────────────────────┐
│               THE SHIELDS                    │
├─────────────────────┬────────────────────────┤
│  THE MONEY SHIELD   │   THE TECHNICAL SHIELD │
├─────────────────────┼────────────────────────┤
│ • Strict Co-Ownership │ • Mandatory SSL/DNSSEC │
│ • Corporate Wallet   │ • Immutable Consent   │
│ • Clear 50/50 Split  │ • Session Expirations  │
└─────────────────────┴────────────────────────┘
```

---

## 1. Inter-Developer Agreement (Internal Wall)

**Purpose:** Protects partners from each other

**Required clauses:**

| Clause | Specification |
|--------|---------------|
| **Ownership** | Strict 50/50 split of all platform commissions |
| **Expenses/Losses** | Split equally |
| **Modification Rights** | Neither partner can modify core routing or payment gateway without written consent |

**Status:** Must sign before code goes live

---

## 2. Strict Financial Segregation (Wallet Wall)

**The Rule:**
> "Do not route 77% platform cut into everyday personal wallets."

**Requirement:**
- Dedicated, clean crypto wallet
- **Exclusive use** for platform infrastructure costs and revenue

**The Danger:**
- Mixing platform money with personal expenses (groceries, fuel)
- Regulator audits money trail
- **Destroys "neutral software utility" defense**

**The Standard:**
> "Money trail must prove domain is treated as distinct, organized utility."

---

## 3. Hardened Technical Gatekeeping (Architecture Shield)

### Enforce Strict Content Security Policies (CSP)

**Configuration:**
- Block all scripts unless explicitly whitelisted
- Whitelist: Auth0, Veremark, Regional APIs only

**Purpose:**
- Protect from XSS attacks
- Match contract terms in court

### DNSSEC Activation

**Requirement:**
- Enable DNS Security Extensions on domain registrar

**Purpose:**
- Prevent hackers from spoofing domain name
- Prevent fake website stealing pilot logins

---

## Summary for Domain-Only Operation

### Legal Vulnerabilities

| Risk | Source | Protection |
|------|--------|------------|
| Unlimited personal liability | General Partnership (Art. 1816) | Inter-Developer Agreement |
| Data breach fines | Data Privacy Act | Technical shield + ToS |
| Cybercrime investigation | R.A. 10175 | DNSSEC + CSP |
| Breach of contract suits | Civil Code | Master Terms of Service |

### Required Establishments

| Element | Purpose | Status |
|---------|---------|--------|
| Inter-Developer Agreement | Internal liability split | **Must sign pre-launch** |
| Dedicated Platform Wallet | Financial segregation | **Must establish** |
| CSP + DNSSEC | Technical gatekeeping | **Must configure** |
| Master Terms of Service | Ultimate legal defense | **Already drafted** |

---

## The Defense

**Operating strictly as domain name:**
- Terms of Service = ultimate line of defense
- Replaces traditional corporation
- 4-point multi-IDP architecture = tech safety
- Regional providers = liability distribution

**With safeguards in place:**
> "Highest degree of defensive armor available to a private partnership."

---

## Status

**42 documentation files.**

**Legal framework for domain-only operation: MAPPED.**

**Critical pre-launch safeguards identified.**

---

## The Call

**September deadline: ~4 months. 27 security items remain.**

**Inter-Developer Agreement: Can be drafted and signed in 1 day.**

**Technical shields: Can be configured in parallel with security hardening.**

**The architecture is bulletproof. Legal safeguards identified. Time to execute.**

**Ready to implement?**
