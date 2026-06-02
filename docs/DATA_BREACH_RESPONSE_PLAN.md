# Data Breach Response Plan
## PilotRecognition.com — Aviation Pathways Ltd

**Document Reference:** PR-BRP-001  
**Version:** 1.0  
**Effective Date:** 02 June 2026  
**Approved By:** Benjamin Bowler, Data Protection Officer  
**Review Cycle:** Annually, or within 7 days of any breach event  

---

## 1. Purpose and Scope

This plan establishes the procedures Aviation Pathways Ltd will follow upon discovery of a personal data breach, in compliance with:
- GDPR Article 33–34 (EU/EEA residents)
- Philippines Data Privacy Act of 2012 (RA 10173), NPC Circular 2022-04
- UAE Federal Decree-Law No. 45 of 2021 on Personal Data Protection
- Mauritius Data Protection Act 2017

**Scope:** All systems, databases, edge functions, transient encrypted document storage, third-party integrations, and personnel handling personal data on behalf of PilotRecognition.com.

---

## 2. Breach Classification

| Severity | Criteria | Notification Timeline |
|----------|----------|----------------------|
| **Critical** | Unauthorised access to encrypted credential data, mass PII exfiltration, ransomware, insider threat with data export | Immediate internal; supervisory authority within 24h; affected individuals within 72h |
| **High** | Authentication bypass, API key compromise, RLS policy bypass affecting >100 users, payment data exposure | Internal within 1h; supervisory authority within 48h; individuals within 72h |
| **Medium** | Single-user credential exposure, misconfigured bucket (no mass access), failed login spike | Internal within 4h; assess if supervisory notification required |
| **Low** | Failed attack attempt, phishing email reported, anomaly with no confirmed data access | Log and review within 24h; no external notification required |

---

## 3. Response Team (BRT)

| Role | Name / Position | Contact |
|------|-----------------|---------|
| **BRT Lead / DPO / Managing Director** | Benjamin Bowler (sole director and shareholder) | privacy@pilotrecognition.com |
| **Technical Lead** | Benjamin Bowler | Same as above |
| **Legal Advisor** | [External counsel — to be appointed] | TBD |
| **Communications / Outreach** | Karl Brian Vogt (supporting team) | TBD |
| **Platform Ops / Pilot Advocacy** | Daniel / Keiv (supporting team) | TBD |
| **Finance & Accounting** | Sebastien (external service provider) | TBD |

**Escalation:** As sole director, Benjamin Bowler holds all decision-making authority. If unreachable, external legal counsel assumes interim command for Critical breaches. Supporting team members (Karl, Daniel, Keiv) assist in execution but do not hold legal authority to bind the company or make data-protection decisions.

---

## 4. Response Procedure (72-Hour Clock)

### Hour 0 — Discovery
1. **Contain:** Isolate affected systems (disable edge functions, rotate keys, revoke tokens).
2. **Document:** Timestamp of discovery, who discovered it, initial indicators.
3. **Alert:** BRT Lead notified immediately via primary channel.

### Hour 0–4 — Assessment
1. Determine **what data** was accessed, **how many individuals** affected, **what systems** involved.
2. Classify severity (Critical / High / Medium / Low).
3. Preserve evidence: Supabase logs, edge function logs, Auth0 logs, Cloudinary access logs.
4. If Critical/High: Engage external forensic support.

### Hour 4–24 — Notification Preparation
1. Draft supervisory authority notification (GDPR Art. 33 template).
2. Draft individual notification (GDPR Art. 34 template) if high risk.
3. Coordinate with Veremark / Auth0 / Stripe if their infrastructure involved.
4. Prepare holding statement for website/app if required.

### Hour 24–72 — Notification Dispatch
1. Submit to supervisory authority(ies):
   - **EU residents:** Lead DPA (to be designated — currently none)
   - **Philippines:** NPC via npc.gov.ph breach portal
   - **UAE:** UAE Data Office
   - **Mauritius:** Data Protection Office
2. Notify affected individuals via email if high risk.
3. Post website notice if >500 users affected.

### Post-Breach (72h+)
1. Root cause analysis and remediation.
2. Update RLS policies, rotate all keys, patch vulnerabilities.
3. Lessons learned document.
4. Review and update this plan.

---

## 5. Supervisory Authority Contact Matrix

| Jurisdiction | Authority | Breach Portal / Contact | Deadline |
|--------------|-----------|------------------------|----------|
| EU / EEA | Lead DPA (TBD) | TBD | 72 hours from awareness |
| Philippines | National Privacy Commission | https://www.privacy.gov.ph | As per NPC Circular 2022-04 |
| UAE | UAE Data Office | https://uaedataoffice.gov.ae | As per UAE PDPL |
| Mauritius | Data Protection Office | dataprotection.govmu.org | "Without undue delay" |
| UK | Information Commissioner's Office | ico.org.uk | 72 hours |

---

## 6. Individual Notification Template

**Subject:** Important Security Notice — Your PilotRecognition Account

> Dear [Name],
>
> We are writing to inform you of a security incident that may have affected your personal data held by PilotRecognition.com, operated by Aviation Pathways Ltd.
>
> **What happened:** [Brief factual description]
> **What data was involved:** [Specific data categories]
> **What we are doing:** [Containment and remediation steps]
> **What you can do:** [Password reset, monitor accounts, etc.]
>
> We take the security of your data extremely seriously. For questions, contact our DPO at privacy@pilotrecognition.com.
>
> Sincerely,
> Benjamin Bowler
> Data Protection Officer, Aviation Pathways Ltd

---

## 7. Evidence Preservation Checklist

- [ ] Supabase database audit logs (security_events, user_activity_log)
- [ ] Supabase Auth logs (login attempts, password resets)
- [ ] Edge function invocation logs (via Supabase Dashboard)
- [ ] Auth0 tenant logs (authentication events)
- [ ] Cloudinary / Pinata / R2 access logs
- [ ] Vercel deployment and access logs
- [ ] Stripe webhook logs (if payment data involved)
- [ ] Email delivery logs (Resend)

---

## 8. Key Rotation Triggers

Rotate ALL of the following upon any Critical or High breach:

| Secret | Rotation Method |
|--------|----------------|
| Supabase service_role key | Dashboard → API → Rotate |
| Supabase anon key | Dashboard → API → Rotate |
| Auth0 Client Secret | Applications → Advanced → Rotate |
| Stripe secret & webhook key | Developers → API Keys → Roll |
| Resend API key | Settings → Revoke & regenerate |
| Cloudinary API secret | Settings → Security → Rotate |
| Internal ENCRYPTION_KEY / JWT_SECRET / SESSION_SECRET | Generate new 64-byte hex values |
| MongoDB Atlas DB user password | Security → Database Access → Edit |
| Neon DB password | Console → Reset password |

---

## 9. Testing and Maintenance

- **Tabletop exercise:** Conduct every 6 months (first exercise: September 2026).
- **Plan review:** Annual, or within 7 days of any breach event.
- **Contact list update:** Quarterly verification of BRT contact details.
- **Log retention:** Security event logs retained for 12 months per DCA v1.7 Article 6.

---

**Document Control**

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0 | 02 June 2026 | Benjamin Bowler | Initial draft |

**Next Review Date:** 02 December 2026
