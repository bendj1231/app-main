interface ConsentRecord {
  id: string;
  pilotDID: string;
  requester: string; // Airline, recruiter, etc.
  dataTypes: string[]; // license, hours, medical, etc.
  purpose: string; // job application, verification, etc.
  granted: boolean;
  expiration: Date;
  accessCount: number;
  maxAccess: number;
  createdAt: Date;
  revokedAt?: Date;
}

interface DataRequest {
  requester: string;
  pilotDID: string;
  dataTypes: string[];
  purpose: string;
  duration: number; // days
}

class ConsentManager {
  private consents: Map<string, ConsentRecord[]> = new Map();

  // Pilot grants consent for specific data access
  grantConsent(request: DataRequest, pilotDID: string): ConsentRecord {
    const consent: ConsentRecord = {
      id: `consent_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pilotDID,
      requester: request.requester,
      dataTypes: request.dataTypes,
      purpose: request.purpose,
      granted: true,
      expiration: new Date(Date.now() + request.duration * 24 * 60 * 60 * 1000),
      accessCount: 0,
      maxAccess: 5, // Limit access attempts
      createdAt: new Date()
    };

    const pilotConsents = this.consents.get(pilotDID) || [];
    pilotConsents.push(consent);
    this.consents.set(pilotDID, pilotConsents);

    return consent;
  }

  // Check if consent exists and is valid
  checkConsent(pilotDID: string, requester: string, dataTypes: string[]): boolean {
    const pilotConsents = this.consents.get(pilotDID) || [];
    
    return pilotConsents.some(consent => 
      consent.requester === requester &&
      consent.granted &&
      !consent.revokedAt &&
      consent.expiration > new Date() &&
      consent.accessCount < consent.maxAccess &&
      dataTypes.every(type => consent.dataTypes.includes(type))
    );
  }

  // Pilot revokes consent
  revokeConsent(pilotDID: string, consentId: string): boolean {
    const pilotConsents = this.consents.get(pilotDID) || [];
    const consent = pilotConsents.find(c => c.id === consentId);
    
    if (consent) {
      consent.revokedAt = new Date();
      return true;
    }
    return false;
  }

  // Get all pilot consents
  getPilotConsents(pilotDID: string): ConsentRecord[] {
    return this.consents.get(pilotDID) || [];
  }

  // Log data access
  logAccess(pilotDID: string, requester: string): void {
    const pilotConsents = this.consents.get(pilotDID) || [];
    const activeConsent = pilotConsents.find(c => 
      c.requester === requester &&
      c.granted &&
      !c.revokedAt &&
      c.expiration > new Date()
    );
    
    if (activeConsent) {
      activeConsent.accessCount++;
    }
  }
}

export { ConsentManager, type ConsentRecord, type DataRequest };
