# Walt.id Setup Guide for PilotRecognition

## Overview
Walt.id is used for issuing and managing verifiable credentials for pilots. This guide covers both development and production setup.

## Architecture
- **Issuer**: `https://issuer.demo.walt.id` (dev) → `https://issuer.walt.id` (prod)
- **Wallet**: `https://wallet.walt.id`
- **DID Method**: `did:web:pilotrecognition.com`
- **Credential Type**: `FlightHoursVC` (extends W3C VerifiableCredential)

## Environment Configuration

### Development (.env)
```bash
# Walt.id Configuration
WALT_ISSUER_URL=https://issuer.demo.walt.id
WALT_ISSUER_DID=did:web:pilotrecognition.com
WALT_WALLET_URL=https://wallet.walt.id
```

### Production (.env.production)
```bash
# Walt.id Production
WALT_ISSUER_URL=https://issuer.walt.id
WALT_ISSUER_DID=did:web:pilotrecognition.com
WALT_WALLET_URL=https://wallet.walt.id
```

## DID Configuration

### 1. Create DID Document
Create `https://pilotrecognition.com/.well-known/did.json`:
```json
{
  "@context": ["https://www.w3.org/ns/did/v1"],
  "id": "did:web:pilotrecognition.com",
  "verificationMethod": [{
    "id": "did:web:pilotrecognition.com#key-1",
    "type": "JsonWebKey2020",
    "controller": "did:web:pilotrecognition.com",
    "publicKeyJwk": {
      "kty": "EC",
      "crv": "secp256r1",
      "x": "...",
      "y": "..."
    }
  }],
  "assertionMethod": ["did:web:pilotrecognition.com#key-1"]
}
```

### 2. Onboard Issuer (Automated)
The system automatically onboards the issuer key when issuing first credential:
```javascript
// From BecomeMemberPage.tsx
const onboardRes = await fetch(`${WALT_ISSUER_URL}/onboard/issuer`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
        key: { backend: 'jwk', keyType: 'secp256r1' },
        did: { method: 'jwk' }
    })
});
```

## Credential Templates

### Flight Hours Credential
```json
{
  "@context": ["https://www.w3.org/2018/credentials/v1"],
  "type": ["VerifiableCredential", "FlightHoursVC"],
  "issuer": { "id": "did:web:pilotrecognition.com", "name": "PilotRecognition" },
  "issuanceDate": "2026-05-19T12:00:00Z",
  "expirationDate": "2027-05-19T12:00:00Z",
  "credentialSubject": {
    "id": "did:web:pilotrecognition.com:pilots:auth0|123456789",
    "platform": "PilotRecognition",
    "totalFlightHours": 1500,
    "sourceLogbook": "MyFlightBook",
    "verifiedAt": "2026-05-19T12:00:00Z"
  }
}
```

## User Flow

### 1. Registration & Profile Setup
- User signs up via Auth0
- Completes pilot profile (name, hours, aircraft types)
- Connects logbook provider (MyFlightBook, etc.)

### 2. Credential Issuance
- System automatically issues FlightHoursVC after logbook sync
- Credential offer URL generated via walt.id issuer
- User receives "Claim to Wallet" button

### 3. Wallet Claim
- User clicks button → opens walt.id wallet
- If no wallet: User creates walt.id wallet
- Credential stored in user's wallet
- System marks credential as claimed

## Integration Points

### Frontend (BecomeMemberPage.tsx)
```typescript
// Issue credential
const issueFlightHoursCredential = async (hours: number, auth0Id: string) => {
    const WALT_ISSUER_URL = process.env.WALT_ISSUER_URL;
    const ISSUER_DID = process.env.WALT_ISSUER_DID;
    // ... credential issuance logic
};

// Wallet integration
const CREDENTIAL_WALLETS = [
    {
        id: 'walt',
        name: 'walt.id Wallet',
        href: (url: string) => `https://wallet.walt.id/?offer=${encodeURIComponent(url)}`
    }
];
```

### Backend (Edge Functions)
```typescript
// pilot-terminal-issue/index.ts
const WALT_ISSUER_URL = 'https://issuer.demo.walt.id';
// Issue credential for terminal access
```

## Production Migration

### 1. Update Environment
```bash
# Change from demo to production
WALT_ISSUER_URL=https://issuer.walt.id
```

### 2. DID Document
- Ensure DID document is hosted at `https://pilotrecognition.com/.well-known/did.json`
- Use production keys (not demo keys)

### 3. Credential Testing
- Test issuance with production issuer
- Verify wallet claiming works
- Test credential verification

## Security Considerations

### 1. Key Management
- Production keys should be securely stored
- Consider using HSM or key management service
- Rotate keys periodically

### 2. DID Document
- Host on secure HTTPS domain
- Use proper CORS headers
- Monitor for unauthorized changes

### 3. Credential Validation
- Verify credential signatures
- Check expiration dates
- Validate issuer DID

## Troubleshooting

### Common Issues
1. **Onboard Failed**: Check issuer URL and network connectivity
2. **Credential Not Issued**: Verify DID configuration and keys
3. **Wallet Claim Failed**: Check credential offer URL format
4. **Expired Credentials**: Update issuance logic with proper expiration

### Debug Steps
1. Check browser console for errors
2. Verify network requests to walt.id endpoints
3. Check credential offer URL format
4. Test with walt.id playground

## Monitoring

### Metrics to Track
- Credential issuance success rate
- Wallet claim completion rate
- Time from issuance to claim
- Failed issuance attempts

### Logs
- Credential issuance requests
- Wallet claim events
- Error responses from walt.id
- User wallet creation events

## Future Enhancements

### Planned Features
1. **Multiple Credential Types**: License, Medical, Type Ratings
2. **Revocation**: Credential revocation list
3. **Batch Issuance**: Issue multiple credentials at once
4. **Mobile Wallet**: Apple Wallet and Google Wallet integration
5. **Verification API**: Public credential verification endpoint

### Integration Roadmap
- Q2 2026: Production issuer setup
- Q3 2026: Additional credential types
- Q4 2026: Mobile wallet support
- Q1 2027: Enterprise verification APIs
