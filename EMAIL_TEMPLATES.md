# Email Templates Update Guide - Step 29

## Templates Requiring URL Updates

### 1. Welcome Email (New Pilot Signup)

**Current:**
```
Welcome to PilotRecognition! 

Get started: https://pilotrecognition.com/become-member
View pathways: https://pilotrecognition.com/discover-pathways
```

**Update to:**
```
Welcome to PilotRecognition! 

Get started: https://join.pilotrecognition.com
View pathways: https://pathways.pilotrecognition.com
Upgrade to Recognition+: https://recognitionplus.pilotrecognition.com
```

---

### 2. Password Reset

**Current:**
```
Reset your password: https://pilotrecognition.com/reset-password?token=XXX
```

**Keep as:** (auth should work from any subdomain)
```
Reset your password: https://pilotrecognition.com/reset-password?token=XXX
```

---

### 3. Enterprise Inquiry Response

**Current:**
```
Thank you for your interest in PilotRecognition Enterprise.

Learn more: https://pilotrecognition.com/enterprise-access
View framework: https://pilotrecognition.com/framework/full
```

**Update to:**
```
Thank you for your interest in PilotRecognition Enterprise.

Enterprise portal: https://enterprise.pilotrecognition.com
View framework: https://enterprise.pilotrecognition.com/framework/full
Partner program: https://partners.pilotrecognition.com
```

---

### 4. Partnership Outreach (Flight Schools)

**Current:**
```
Partner with PilotRecognition to bridge the gap for your graduates.

Learn more: https://pilotrecognition.com/partners/flight-schools
```

**Update to:**
```
Partner with PilotRecognition to bridge the gap for your graduates.

Partner portal: https://partners.pilotrecognition.com
View framework: https://enterprise.pilotrecognition.com/framework/full
```

---

### 5. Recognition+ Upgrade Invitation

**Current:**
```
Unlock unlimited pathways and premium features.

Upgrade now: https://pilotrecognition.com/recognition-plus
```

**Update to:**
```
Unlock unlimited pathways and premium features.

Upgrade now: https://recognitionplus.pilotrecognition.com
```

---

### 6. Support/Help Response

**Current:**
```
For more help, visit: https://pilotrecognition.com/faq
```

**Update to:**
```
For more help, visit: https://support.pilotrecognition.com
```

---

### 7. Philippines Market Email

**Current:**
```
Get UAE-recognized credentials from the Philippines.

Learn more: https://pilotrecognition.com/philippines
```

**Keep as:** (country pages stay on main domain)
```
Learn more: https://pilotrecognition.com/philippines
```

---

## Where to Update

### Supabase Auth Templates
Location: Supabase Dashboard > Authentication > Templates
- Confirm email
- Invite user
- Magic link
- Reset password

### Marketing/Transactional Emails
Location: Your email service (SendGrid, Mailgun, Resend, etc.)
- Welcome series
- Drip campaigns
- Announcements
- Newsletters

### Automated Notifications
- Pathway alerts
- Score updates
- Verification complete
- New airline partnership

---

## URL Mapping Reference

| Old URL | New URL | Notes |
|---------|---------|-------|
| pilotrecognition.com/become-member | join.pilotrecognition.com | Signup focused |
| pilotrecognition.com/discover-pathways | pathways.pilotrecognition.com | Main pathways page |
| pilotrecognition.com/recognition-plus | recognitionplus.pilotrecognition.com | Premium membership |
| pilotrecognition.com/enterprise-access | enterprise.pilotrecognition.com | B2B portal |
| pilotrecognition.com/framework/full | enterprise.pilotrecognition.com/framework/full | Full framework |
| pilotrecognition.com/partners/flight-schools | partners.pilotrecognition.com | Partner program |
| pilotrecognition.com/faq | support.pilotrecognition.com | Support center |
| pilotrecognition.com/philippines | pilotrecognition.com/philippines | Keep on main (geographic) |

---

## Verification Checklist

After updating:

- [ ] Send test email to yourself
- [ ] Click every link in test email
- [ ] Verify redirects work correctly
- [ ] Check mobile email rendering
- [ ] Verify UTM parameters preserved (if using)

---

**Timeline:** Complete before Step 30 deployment
**Priority:** Medium (links will redirect until updated)
