import express from 'express';
import cors from 'cors';
import { createHash, randomBytes, createCipheriv, createDecipheriv } from 'crypto';

interface PilotCredential {
  id: string;
  pilotId: string;
  type: 'license' | 'medical' | 'hours' | 'personal';
  data: any;
  encrypted: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsentRecord {
  id: string;
  pilotId: string;
  requester: string;
  dataTypes: string[];
  purpose: string;
  granted: boolean;
  expiresAt: Date;
  accessCount: number;
  maxAccess: number;
  createdAt: Date;
  revokedAt?: Date;
}

class PilotWalletService {
  private app: express.Application;
  private credentials: Map<string, PilotCredential[]> = new Map();
  private consents: Map<string, ConsentRecord[]> = new Map();
  private encryptionKeys: Map<string, string> = new Map();

  constructor() {
    this.app = express();
    this.setupMiddleware();
    this.setupRoutes();
  }

  private setupMiddleware(): void {
    this.app.use(cors());
    this.app.use(express.json());
  }

  private setupRoutes(): void {
    // Store credential for pilot
    this.app.post('/wallet/credentials', this.storeCredential.bind(this));
    
    // Get pilot credentials (with consent check)
    this.app.get('/wallet/credentials/:pilotId', this.getCredentials.bind(this));
    
    // Grant consent for data access
    this.app.post('/wallet/consent', this.grantConsent.bind(this));
    
    // Check consent for data access
    this.app.post('/wallet/check-consent', this.checkConsent.bind(this));
    
    // Revoke consent
    this.app.delete('/wallet/consent/:consentId', this.revokeConsent.bind(this));
    
    // Get pilot consents
    this.app.get('/wallet/consents/:pilotId', this.getConsents.bind(this));
    
    // Veremark data retrieval endpoint
    this.app.post('/veremark/retrieve', this.veremarkDataRetrieval.bind(this));
    
    // Health check
    this.app.get('/health', (req, res) => {
      res.json({ status: 'ok', service: 'pilot-wallet-service' });
    });
  }

  private encryptData(data: any, pilotId: string): { encrypted: string; iv: string } {
    const key = this.getOrCreateKey(pilotId);
    const iv = randomBytes(16);
    const cipher = createCipheriv('aes-256-cbc', Buffer.from(key, 'hex'), iv);
    
    let encrypted = cipher.update(JSON.stringify(data), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return { encrypted, iv: iv.toString('hex') };
  }

  private decryptData(encryptedData: string, iv: string, pilotId: string): any {
    const key = this.getOrCreateKey(pilotId);
    const decipher = createDecipheriv('aes-256-cbc', Buffer.from(key, 'hex'), Buffer.from(iv, 'hex'));
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return JSON.parse(decrypted);
  }

  private getOrCreateKey(pilotId: string): string {
    if (!this.encryptionKeys.has(pilotId)) {
      this.encryptionKeys.set(pilotId, randomBytes(32).toString('hex'));
    }
    return this.encryptionKeys.get(pilotId)!;
  }

  private storeCredential(req: express.Request, res: express.Response): void {
    try {
      const { pilotId, type, data } = req.body;
      
      if (!pilotId || !type || !data) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const { encrypted, iv } = this.encryptData(data, pilotId);
      
      const credential: PilotCredential = {
        id: `cred_${Date.now()}_${randomBytes(8).toString('hex')}`,
        pilotId,
        type,
        data: { encrypted, iv },
        encrypted: true,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      const pilotCredentials = this.credentials.get(pilotId) || [];
      pilotCredentials.push(credential);
      this.credentials.set(pilotId, pilotCredentials);

      res.json({ 
        success: true, 
        credentialId: credential.id,
        message: 'Credential stored securely'
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to store credential' });
    }
  }

  private getCredentials(req: express.Request, res: express.Response): void {
    try {
      const { pilotId } = req.params;
      const { requester, dataTypes } = req.query;

      if (!pilotId) {
        res.status(400).json({ error: 'Pilot ID required' });
        return;
      }

      // Check consent
      if (requester && dataTypes) {
        const requesterStr = Array.isArray(requester) ? requester[0] : requester;
        const dataTypesArray = Array.isArray(dataTypes) ? dataTypes : [dataTypes];
        const hasConsent = this.checkPilotConsent(pilotId, requesterStr, dataTypesArray);
        if (!hasConsent) {
          res.status(403).json({ error: 'No valid consent for data access' });
          return;
        }
      }

      const pilotCredentials = this.credentials.get(pilotId) || [];
      const decryptedCredentials = pilotCredentials.map(cred => ({
        ...cred,
        data: this.decryptData(cred.data.encrypted as string, cred.data.iv as string, pilotId),
        encrypted: false
      }));

      res.json({ credentials: decryptedCredentials });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve credentials' });
    }
  }

  private grantConsent(req: express.Request, res: express.Response): void {
    try {
      const { pilotId, requester, dataTypes, purpose, duration } = req.body;

      if (!pilotId || !requester || !dataTypes || !purpose) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const consent: ConsentRecord = {
        id: `consent_${Date.now()}_${randomBytes(8).toString('hex')}`,
        pilotId,
        requester,
        dataTypes,
        purpose,
        granted: true,
        expiresAt: new Date(Date.now() + (duration || 30) * 24 * 60 * 60 * 1000),
        accessCount: 0,
        maxAccess: 5,
        createdAt: new Date()
      };

      const pilotConsents = this.consents.get(pilotId) || [];
      pilotConsents.push(consent);
      this.consents.set(pilotId, pilotConsents);

      res.json({ 
        success: true, 
        consentId: consent.id,
        expiresAt: consent.expiresAt
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to grant consent' });
    }
  }

  private checkConsent(req: express.Request, res: express.Response): void {
    try {
      const { pilotId, requester, dataTypes } = req.body;

      if (!pilotId || !requester || !dataTypes) {
        res.status(400).json({ error: 'Missing required fields' });
        return;
      }

      const hasConsent = this.checkPilotConsent(pilotId, requester, dataTypes);

      res.json({ hasConsent });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check consent' });
    }
  }

  private checkPilotConsent(pilotId: string, requester: string, dataTypes: string[]): boolean {
    const pilotConsents = this.consents.get(pilotId) || [];
    
    return pilotConsents.some(consent => 
      consent.requester === requester &&
      consent.granted &&
      !consent.revokedAt &&
      consent.expiresAt > new Date() &&
      consent.accessCount < consent.maxAccess &&
      dataTypes.every(type => consent.dataTypes.includes(type))
    );
  }

  private revokeConsent(req: express.Request, res: express.Response): void {
    try {
      const { consentId } = req.params;

      if (!consentId) {
        res.status(400).json({ error: 'Consent ID required' });
        return;
      }

      // Find and revoke consent
      for (const [pilotId, consents] of this.consents.entries()) {
        const consent = consents.find(c => c.id === consentId);
        if (consent) {
          consent.revokedAt = new Date();
          this.consents.set(pilotId, consents);
          res.json({ success: true, message: 'Consent revoked' });
          return;
        }
      }

      res.status(404).json({ error: 'Consent not found' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to revoke consent' });
    }
  }

  private getConsents(req: express.Request, res: express.Response): void {
    try {
      const { pilotId } = req.params;

      if (!pilotId) {
        res.status(400).json({ error: 'Pilot ID required' });
        return;
      }

      const pilotConsents = this.consents.get(pilotId) || [];
      res.json({ consents: pilotConsents });
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve consents' });
    }
  }

  private veremarkDataRetrieval(req: express.Request, res: express.Response): void {
    try {
      const { pilotId, dataTypes, purpose, verificationId } = req.body;

      if (!pilotId || !dataTypes || !purpose) {
        res.status(400).json({ 
          error: 'Missing required fields',
          required: ['pilotId', 'dataTypes', 'purpose']
        });
        return;
      }

      // Check if Veremark has consent
      const hasConsent = this.checkPilotConsent(pilotId, 'Veremark', dataTypes);
      
      if (!hasConsent) {
        // Create pending consent request for pilot approval
        const pendingConsent: ConsentRecord = {
          id: `consent_${Date.now()}_${randomBytes(8).toString('hex')}`,
          pilotId,
          requester: 'Veremark',
          dataTypes,
          purpose: `Background verification: ${purpose}`,
          granted: false,
          expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          accessCount: 0,
          maxAccess: 1,
          createdAt: new Date()
        };

        const pilotConsents = this.consents.get(pilotId) || [];
        pilotConsents.push(pendingConsent);
        this.consents.set(pilotId, pilotConsents);

        return res.json({
          status: 'pending_consent',
          message: 'Pilot consent required for data access',
          consentId: pendingConsent.id,
          verificationId: verificationId || null,
          dataTypes: dataTypes,
          purpose: purpose
        });
      }

      // Retrieve pilot credentials
      const pilotCredentials = this.credentials.get(pilotId) || [];
      const requestedCredentials = pilotCredentials.filter(cred => 
        dataTypes.includes(cred.type)
      );

      const decryptedCredentials = requestedCredentials.map(cred => ({
        ...cred,
        data: this.decryptData(cred.data.encrypted as string, cred.data.iv as string, pilotId),
        encrypted: false
      }));

      // Log access for audit trail
      const pilotConsents = this.consents.get(pilotId) || [];
      const consent = pilotConsents.find(c => 
        c.requester === 'Veremark' &&
        c.granted &&
        !c.revokedAt &&
        c.expiresAt > new Date()
      );
      
      if (consent) {
        consent.accessCount++;
      }

      res.json({
        status: 'success',
        verificationId: verificationId || null,
        pilotId: pilotId,
        data: decryptedCredentials,
        retrievedAt: new Date(),
        auditTrail: {
          requester: 'Veremark',
          purpose: purpose,
          consentId: consent?.id,
          accessCount: consent?.accessCount
        }
      });

    } catch (error) {
      console.error('Veremark data retrieval error:', error);
      res.status(500).json({ 
        error: 'Failed to retrieve pilot data',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  }

  public start(port: number = 3001): void {
    this.app.listen(port, () => {
      console.log(`🔐 Pilot Wallet Service running on port ${port}`);
      console.log(`📊 Health check: http://localhost:${port}/health`);
    });
  }
}

export default PilotWalletService;
