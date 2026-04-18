# Pre-Deployment Checklist

This checklist must be completed before deploying to production. Each item should be verified and checked off.

## Table of Contents

1. [Security](#security)
2. [Database](#database)
3. [Edge Functions](#edge-functions)
4. [Frontend](#frontend)
5. [Environment Configuration](#environment-configuration)
6. [Testing](#testing)
7. [Monitoring](#monitoring)
8. [Documentation](#documentation)
9. [Deployment](#deployment)
10. [Post-Deployment](#post-deployment)

---

## Security

### Authentication & Authorization

- [ ] All environment variables are set in production (not development values)
- [ ] Service role keys are different from development/staging
- [ ] Service role keys are rotated and not committed to version control
- [ ] Anon keys are appropriate for production use
- [ ] JWT verification is correctly configured per function
- [ ] CSRF protection is enabled on all auth endpoints
- [ ] Rate limiting is configured and tested
- [ ] Security headers are properly configured (CSP, HSTS, X-Frame-Options)
- [ ] HTTPS is enforced (redirect HTTP to HTTPS)
- [ ] Database RLS policies are enabled and tested
- [ ] API keys are not exposed in client-side code
- [ ] Firebase config uses production credentials (if applicable)
- [ ] Password strength validation is enforced
- [ ] Session timeout is configured appropriately
- [ ] Token rotation is implemented and tested

### Security Testing

- [ ] Run Supabase Security Advisor (target: 9/10 or 10/10)
- [ ] Review and address all security advisor warnings
- [ ] Test CSRF protection on all protected endpoints
- [ ] Test rate limiting on all endpoints
- [ ] Verify security headers are present on all responses
- [ ] Test authentication flow end-to-end
- [ ] Test session expiration and refresh
- [ ] Verify logout clears all cookies
- [ ] Test error handling doesn't leak sensitive information
- [ ] Review dependencies for known vulnerabilities (`npm audit`)
- [ ] Scan code for hardcoded secrets
- [ ] Verify no debug logging in production

---

## Database

### Database Configuration

- [ ] All migrations have been applied to production database
- [ ] Migration history is reviewed and verified
- [ ] Required extensions are installed (uuid-ossp, pgcrypto)
- [ ] Database connection pooling is enabled
- [ ] Connection limits are configured appropriately
- [ ] Backup schedule is configured and tested
- [ ] Point-in-time recovery is enabled (if applicable)
- [ ] Database size is within expected limits
- [ ] Indexes are created and optimized
- [ ] Table statistics are up to date (ANALYZE run)

### Database Security

- [ ] Row-Level Security (RLS) is enabled on all tables
- [ ] RLS policies are tested and verified
- [ ] Service role key is not exposed to client-side code
- [ ] Database connections use TLS encryption
- [ ] IP whitelisting is configured (if applicable)
- [ ] Database access is restricted to necessary IPs
- [ ] Audit logging is enabled for sensitive operations
- [ ] Database users have least privilege access

### Data Integrity

- [ ] Foreign key constraints are verified
- [ ] Unique constraints are verified
- [ ] Check constraints are verified
- [ ] Data validation rules are tested
- [ ] Required fields have NOT NULL constraints
- [ ] Default values are appropriate
- [ ] Cascade delete rules are reviewed

### Rate Limiting Table

- [ ] rate_limits table is created
- [ ] upsert_rate_limit function is created
- [ ] Indexes are created on rate_limits table
- [ ] Database-backed rate limiting is tested
- [ ] Cleanup job for expired rate limits is scheduled

---

## Edge Functions

### Function Deployment

- [ ] All 8 Edge Functions are deployed successfully
- [ ] Function versions are recorded
- [ ] Function deployment logs are reviewed
- [ ] Functions are linked to correct Supabase project
- [ ] Deno.json configuration is correct
- [ ] Dependencies are up to date
- [ ] Function code is minified (if applicable)

### Function Configuration

- [ ] Environment variables are set for all functions
- [ ] JWT verification is correctly configured:
  - [ ] auth-login: Disabled (handles auth)
  - [ ] auth-signup: Disabled (handles auth)
  - [ ] auth-logout: Disabled (handles auth)
  - [ ] auth-refresh: Disabled (handles auth)
  - [ ] auth-verify: Enabled (requires valid session)
  - [ ] delete-account: Enabled (requires valid session)
  - [ ] health-check: Disabled (public endpoint)
  - [ ] send-*: Disabled (internal use)
- [ ] Function memory limits are appropriate
- [ ] Function timeout limits are appropriate
- [ ] CORS configuration is correct
- [ ] Function URLs are correct

### Function Testing

- [ ] auth-login function tested successfully
- [ ] auth-signup function tested successfully
- [ ] auth-logout function tested successfully
- [ ] auth-refresh function tested successfully
- [ ] auth-verify function tested successfully
- [ ] delete-account function tested successfully
- [ ] health-check function tested successfully
- [ ] send-account-created-email function tested successfully
- [ ] send-enrollment-email function tested successfully
- [ ] All functions return correct HTTP status codes
- [ ] All functions include security headers
- [ ] All functions include rate limit headers
- [ ] Error responses are appropriate and sanitized

---

## Frontend

### Build Configuration

- [ ] Application builds without errors
- [ ] Build warnings are reviewed and resolved
- [ ] TypeScript compilation succeeds
- [ ] ESLint passes without errors
- [ ] Prettier formatting is applied
- [ ] Source maps are disabled for production
- [ ] Console logs are removed (or disabled)
- [ ] Bundle size is optimized
- [ ] Asset optimization is enabled
- [ ] Environment variables are configured in hosting platform

### Frontend Security

- [ ] Content Security Policy is configured
- [ ] Subresource Integrity (SRI) is implemented (if applicable)
- [ ] Trusted Types are configured (if applicable)
- [ ] XSS protection is tested
- [ ] Input validation is implemented
- [ ] Output encoding is implemented
- [ ] Third-party scripts are reviewed and minimized
- [ ] No inline scripts in production
- [ ] No eval() in production code
- [ ] Dangerous functions are avoided

### Frontend Performance

- [ ] Lighthouse score is acceptable (>90)
- [ ] Core Web Vitals are within targets:
  - [ ] LCP (Largest Contentful Paint) < 2.5s
  - [ ] FID (First Input Delay) < 100ms
  - [ ] CLS (Cumulative Layout Shift) < 0.1
- [ ] Images are optimized and lazy-loaded
- [ ] Fonts are optimized and preloaded
- [ ] CSS is minified and critical path optimized
- [ ] JavaScript is minified and code-split
- [ ] Caching strategy is configured
- [ ] CDN is configured (if applicable)

### Frontend Testing

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass (if applicable)
- [ ] Manual testing completed
- [ ] Cross-browser testing completed
- [ ] Mobile responsiveness tested
- [ ] Accessibility testing completed (WCAG 2.1 AA)
- [ ] User acceptance testing completed

---

## Environment Configuration

### Production Environment

- [ ] Production environment variables are set:
  - [ ] VITE_SUPABASE_URL
  - [ ] VITE_SUPABASE_ANON_KEY
  - [ ] SUPABASE_URL
  - [ ] SUPABASE_SERVICE_ROLE_KEY
  - [ ] ENVIRONMENT=production
  - [ ] DEBUG=false
  - [ ] RESEND_API_KEY
  - [ ] Firebase config (if applicable)
- [ ] No development variables in production
- [ ] No hardcoded secrets in code
- [ ] Environment-specific configurations are verified
- [ ] Feature flags are configured appropriately

### Hosting Platform

- [ ] Custom domain is configured
- [ ] SSL certificate is valid and configured
- [ ] DNS records are correct
- [ ] CDN is configured (if applicable)
- [ ] Load balancer is configured (if applicable)
- [ ] Auto-scaling is configured (if applicable)
- [ ] Build settings are correct
- [ ] Deployment settings are correct
- [ ] Environment variables are set in hosting platform
- [ ] Build command is correct
- [ ] Output directory is correct

---

## Testing

### Automated Testing

- [ ] Unit tests pass (100%)
- [ ] Integration tests pass (100%)
- [ ] E2E tests pass (100%)
- [ ] Test coverage is acceptable (>80%)
- [ ] Tests run in CI/CD pipeline
- [ ] Tests are fast and reliable

### Manual Testing

- [ ] Signup flow works end-to-end
- [ ] Login flow works end-to-end
- [ ] Logout works and clears cookies
- [ ] Session verification works
- [ ] Token refresh works automatically
- [ ] CSRF tokens are validated
- [ ] Rate limiting prevents abuse
- [ ] Error handling returns appropriate messages
- [ ] All user-facing features work
- [ ] All admin features work

### Security Testing

- [ ] Authentication flow tested
- [ ] Authorization tested across all roles
- [ ] CSRF protection tested
- [ ] XSS vulnerabilities tested
- [ ] SQL injection tested
- [ ] Rate limiting tested
- [ ] Session management tested
- [ ] Cookie security tested
- [ ] API security tested
- [ ] Dependency vulnerabilities scanned

### Performance Testing

- [ ] Load testing completed
- [ ] Stress testing completed
- [ ] Response times are within SLA
- [ ] Database performance is acceptable
- [ ] Edge Function performance is acceptable
- [ ] Frontend performance is acceptable
- [ ] No memory leaks detected
- [ ] No resource exhaustion issues

---

## Monitoring

### Logging

- [ ] Structured logging is implemented
- [ ] Log levels are appropriate (info, warn, error)
- [ ] Request ID tracking is implemented
- [ ] Error logging includes stack traces
- [ ] Performance metrics are logged
- [ ] Security events are logged
- [ ] Log retention is configured
- [ ] Log aggregation is set up (if applicable)

### Monitoring

- [ ] Health check endpoint is configured
- [ ] Health check is monitored externally
- [ ] Uptime monitoring is configured
- [ ] Performance monitoring is configured
- [ ] Error tracking is configured (Sentry, etc.)
- [ ] Custom metrics are configured
- [ ] Alert thresholds are configured
- [ ] Dashboard is set up and tested

### Alerting

- [ ] Critical alerts are configured:
  - [ ] Health check failures
  - [ ] High error rates (>10%)
  - [ ] Database connection failures
  - [ ] All Edge Functions down
- [ ] Warning alerts are configured:
  - [ ] Health check degraded
  - [ ] Elevated error rates (>5%)
  - [ ] High response times
  - [ ] Rate limit violations
- [ ] Alert channels are configured:
  - [ ] Email
  - [ ] Slack
  - [ ] PagerDuty (if applicable)
  - [ ] SMS (for emergencies)
- [ ] Alert escalation is configured
- [ ] On-call rotation is established
- [ ] Alert testing completed

---

## Documentation

### Technical Documentation

- [ ] API documentation is complete and up to date
- [ ] Deployment guide is complete
- [ ] Monitoring setup guide is complete
- [ ] Security architecture is documented
- [ ] Troubleshooting guide is complete
- [ ] Database schema is documented
- [ ] Environment variables are documented
- [ ] Runbook is created for common issues

### Operational Documentation

- [ ] Rollback procedures are documented
- [ ] Emergency procedures are documented
- [ ] On-call procedures are documented
- [ ] Incident response plan is documented
- [ ] Backup and recovery procedures are documented
- [ ] Scaling procedures are documented
- [ ] Maintenance procedures are documented

### User Documentation

- [ ] User guide is complete
- [ ] FAQ is complete
- [ ] Release notes are prepared
- [ ] Migration guide is prepared (if applicable)
- [ ] Known issues are documented

---

## Deployment

### Pre-Deployment

- [ ] Database backup is taken immediately before deployment
- [ ] Current production state is recorded
- [ ] Rollback plan is prepared and tested
- [ ] Team is notified of deployment
- [ ] Maintenance window is scheduled (if applicable)
- [ ] Stakeholders are notified (if applicable)
- [ ] Deployment checklist is reviewed and approved

### Deployment Process

- [ ] Deployment script is tested
- [ ] Deployment environment is prepared
- [ ] Database migrations are applied
- [ ] Edge Functions are deployed
- [ ] Frontend is deployed
- [ ] CDN cache is invalidated (if applicable)
- [ ] DNS changes are propagated (if applicable)
- [ ] Deployment logs are reviewed

### Post-Deployment Verification

- [ ] Health check returns healthy status
- [ ] All Edge Functions are responding
- [ ] Frontend is accessible
- [ ] Database connectivity is verified
- [ ] Authentication flow works
- [ ] Key user flows are tested
- [ ] Error rates are normal
- [ ] Performance is acceptable
- [ ] Logs show no errors
- [ ] Alerts are not firing

---

## Post-Deployment

### Monitoring

- [ ] Monitor error rates for first hour
- [ ] Monitor performance metrics for first hour
- [ ] Review logs for any issues
- [ ] Check alert status
- [ ] Verify user activity is normal
- [ ] Monitor database performance
- [ ] Monitor Edge Function performance

### Validation

- [ ] Smoke test completed
- [ ] Critical user flows tested
- [ ] Integration with external services verified
- [ ] Email delivery verified
- [ ] Payment processing verified (if applicable)
- [ ] Third-party integrations verified

### Communication

- [ ] Team notified of successful deployment
- [ ] Stakeholders notified of successful deployment
- [ ] Users notified of new features (if applicable)
- [ ] Release notes published
- [ ] Deployment recorded in changelog

### Cleanup

- [ ] Temporary files removed
- [ ] Backup retention policy verified
- [ ] Old deployments cleaned up (if applicable)
- [ ] Monitoring alerts adjusted (if needed)
- [ ] Documentation updated with deployment details

---

## Emergency Rollback Criteria

Deploy immediately if any of these occur:

- [ ] Critical security vulnerability discovered
- [ ] Data corruption or loss
- [ ] Authentication completely broken
- [ ] Database completely inaccessible
- [ ] Error rate > 25%
- [ ] Performance degradation > 50%
- [ ] Payment processing failure (if applicable)
- [ ] Data privacy breach
- [ ] Compliance violation

---

## Sign-Off

**Deployment Lead:** _________________________ Date: _______

**Security Review:** _________________________ Date: _______

**Database Review:** _________________________ Date: _______

**Testing Review:** _________________________ Date: _______

**Operations Review:** _________________________ Date: _______

**Final Approval:** _________________________ Date: _______

---

## Notes

Add any additional notes or observations during the pre-deployment process:

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

_________________________________________________________________________

---

## Related Documentation

- [PRODUCTION_DEPLOYMENT_GUIDE.md](./PRODUCTION_DEPLOYMENT_GUIDE.md)
- [MONITORING_SETUP.md](./MONITORING_SETUP.md)
- [SECURITY_ARCHITECTURE.md](./SECURITY_ARCHITECTURE.md)
- [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)
