# Security Tasks Remaining — Manual Configuration

**Status:** 27 items pending external service configuration  
**Last updated:** June 2, 2026  
**Supabase Project:** gkbhgrozrzhalnjherfu

---

## ✅ Completed (Code & Database Level)

- Rate limiting, input validation (Zod), request size limits
- Security scanning, per-user rate limiting, device fingerprinting
- Security event logging, CSRF protection, enhanced headers
- Security events table, fixed permissive RLS policies
- Fixed function search_path vulnerabilities, enabled RLS on missing tables
- Moved pg_net extension, fixed security definer view

---

## ⏳ Remaining Manual Items (27)

### Supabase Dashboard
1. [ ] **Enable leaked password protection**
   - Guide: `scripts/enable-leaked-password-protection.md`

### Cloudflare
2. [ ] **Configure WAF rules**
   - Config: `scripts/cloudflare-waf-rules.json`
3. [ ] **Enable DDoS protection**
   - Guide: `scripts/cloudflare-ddos-protection-guide.md`
4. [ ] **Configure rate limiting**
5. [ ] **Enable bot detection**
6. [ ] **Configure challenge-response**
7. [ ] **Enable IP reputation**
8. [ ] **Configure geo-blocking**
9. [ ] **Enable threat intelligence**

### DNS & Email Security
10. [ ] **Enable DNSSEC**
    - Script: `scripts/dns-records-config.sh`
11. [ ] **Configure DMARC/SPF/DKIM**
    - Script: `scripts/dns-records-config.sh`
12. [ ] **Set CAA records**
    - Script: `scripts/dns-records-config.sh`

### TLS/SSL
13. [ ] **Enforce TLS 1.3**
    - Config: `scripts/tls-ssl-config-nginx.conf`
14. [ ] **Enable PFS cipher suites**
    - Config: `scripts/tls-ssl-config-nginx.conf`
15. [ ] **Disable weak ciphers**
    - Config: `scripts/tls-ssl-config-nginx.conf`
16. [ ] **Enable OCSP stapling**
    - Config: `scripts/tls-ssl-config-nginx.conf`
17. [ ] **Automate SSL certificate renewal**
    - Script: `scripts/letsencrypt-renewal.sh`

### Key Management & Hardening
18. [ ] **Rotate encryption keys**
    - Guide: `scripts/change-encryption-keys.md`
19. [ ] **Submit HSTS preloading**
    - Guide: `scripts/hsts-preload-guide.md`
20. [ ] **Implement certificate pinning**
    - Guide: `scripts/certificate-pinning-guide.md`

### Audit
21. [ ] **Commission third-party security audit**
    - Guide: `scripts/third-party-audit-guide.md`

---

## Notes

- These require access to external service dashboards (Cloudflare, DNS registrar, Supabase Dashboard).
- Scripts and guides are located in `/Users/bowler/Documents/apps/app-main/scripts/`.
- Do not delete this file until all 27 items are completed.
