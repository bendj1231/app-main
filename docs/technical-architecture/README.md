# Technical Architecture Documentation

**PilotRecognition Platform** — Complete technical specification for domains, wallet infrastructure, and data custody.

---

## Overview

This directory contains the complete technical architecture documentation for the PilotRecognition platform, covering multi-domain infrastructure, digital wallet systems, and secure data custody models.

## Document Index

### Domain Infrastructure
- [01-multi-domain-architecture.md](./01-multi-domain-architecture.md) — Three-domain platform architecture
- [02-domain-routing-detection.md](./02-domain-routing-detection.md) — Hostname-based routing and middleware

### Wallet & Credentials
- [03-wallet-system-architecture.md](./03-wallet-system-architecture.md) — Tier 1-4 wallet infrastructure
- [04-credential-issuance-flow.md](./04-credential-issuance-flow.md) — W3C VC issuance pipeline
- [05-credential-status-management.md](./05-credential-status-management.md) — Bitstring Status List revocation

### Data & Security
- [06-data-custody-model.md](./06-data-custody-model.md) — Zero-knowledge data custody architecture
- [07-secure-enclave-architecture.md](./07-secure-enclave-architecture.md) — Tier 1 HSM key management
- [08-key-management-rotation.md](./08-key-management-rotation.md) — Cryptographic key lifecycle

### Implementation
- [09-domain-wallet-implementation.md](./09-domain-wallet-implementation.md) — Domain-specific wallet deployment
- [10-infrastructure-summary.md](./10-infrastructure-summary.md) — Complete infrastructure checklist

---

## Quick Reference

| Component | Status | Location |
|-----------|--------|----------|
| Multi-Domain Middleware | ✅ Complete | `middleware.ts` |
| Tier 1 Enclave | ✅ Complete | `lib/wallet/enclave.ts` |
| Tier 2 Storage | ✅ Complete | `lib/wallet/storage.ts` |
| Tier 3 Status List | ✅ Complete | `lib/wallet/statusList.ts` |
| Credential Issuance | ✅ Complete | `supabase/functions/issuer-sign/` |
| Domain Wallets | ✅ Complete | Domain-specific pages |

---

**Version:** 1.0  
**Last Updated:** June 2, 2026  
**Maintainer:** Platform Engineering Team
