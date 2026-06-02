import { ConsentManager, type ConsentRecord } from './consent-manager';

interface DataAccessRequest {
  requester: string;
  pilotDID: string;
  dataTypes: string[];
  purpose: string;
  timestamp: Date;
}

interface DataAccessResult {
  granted: boolean;
  data: any;
  consent?: ConsentRecord;
  reason?: string;
}

interface PilotData {
  license: {
    number: string;
    type: string;
    issueDate: Date;
    expiryDate: Date;
    ratings: string[];
    status: 'valid' | 'expired' | 'suspended';
  };
  hours: {
    total: number;
    PIC: number;
    multiEngine: number;
    instrument: number;
    lastUpdated: Date;
  };
  medical: {
    class: string;
    issueDate: Date;
    expiryDate: Date;
    limitations: string[];
    status: 'valid' | 'expired';
  };
  personal: {
    name: string;
    dateOfBirth: Date;
    citizenship: string;
    contact: string;
  };
}

class DataAccessVerifier {
  private consentManager: ConsentManager;
  private pilotDataStore: Map<string, PilotData> = new Map();

  constructor() {
    this.consentManager = new ConsentManager();
    this.initializeMockData();
  }

  private initializeMockData(): void {
    // Mock pilot data for Benjamin Tiger Bowler
    const mockPilotData: PilotData = {
      license: {
        number: "REDACTED-CPL",
        type: "Commercial Pilot License",
        issueDate: new Date("2025-10-24"),
        expiryDate: new Date("2030-10-23"),
        ratings: ["Airplane Single Engine Land", "C152", "C172", "P200JF"],
        status: "valid"
      },
      hours: {
        total: 1500,
        PIC: 800,
        multiEngine: 200,
        instrument: 300,
        lastUpdated: new Date()
      },
      medical: {
        class: "Class 1",
        issueDate: new Date("2025-05-02"),
        expiryDate: new Date("2026-05-02"),
        limitations: ["Holder shall wear corrective lenses"],
        status: "expired" // Expired 13 days ago
      },
      personal: {
        name: "Benjamin Tiger Bowler",
        dateOfBirth: new Date("2003-07-30"),
        citizenship: "Mauritius",
        contact: "+971-50-123-4567"
      }
    };

    this.pilotDataStore.set("did:web:pilotrecognition.com:pilots:auth0|1234567890", mockPilotData);
  }

  // Request access to pilot data with consent verification
  async requestAccess(request: DataAccessRequest): Promise<DataAccessResult> {
    // Check if consent exists and is valid
    const hasConsent = this.consentManager.checkConsent(
      request.pilotDID,
      request.requester,
      request.dataTypes
    );

    if (!hasConsent) {
      return {
        granted: false,
        data: null,
        reason: "No valid consent found for this data access request"
      };
    }

    // Get pilot data
    const pilotData = this.pilotDataStore.get(request.pilotDID);
    if (!pilotData) {
      return {
        granted: false,
        data: null,
        reason: "Pilot data not found"
      };
    }

    // Filter data based on requested types and consent
    const filteredData = this.filterDataByConsent(pilotData, request.dataTypes, request.pilotDID, request.requester);

    // Log the access
    this.consentManager.logAccess(request.pilotDID, request.requester);

    // Get the consent record for audit trail
    const pilotConsents = this.consentManager.getPilotConsents(request.pilotDID);
    const activeConsent = pilotConsents.find(c => 
      c.requester === request.requester &&
      c.granted &&
      !c.revokedAt &&
      c.expiration > new Date() &&
      request.dataTypes.every(type => c.dataTypes.includes(type))
    );

    return {
      granted: true,
      data: filteredData,
      consent: activeConsent
    };
  }

  private filterDataByConsent(
    pilotData: PilotData,
    requestedTypes: string[],
    pilotDID: string,
    requester: string
  ): Partial<PilotData> {
    const filteredData: Partial<PilotData> = {};

    requestedTypes.forEach(dataType => {
      switch (dataType) {
        case 'license':
          filteredData.license = pilotData.license;
          break;
        case 'hours':
          filteredData.hours = pilotData.hours;
          break;
        case 'medical':
          filteredData.medical = pilotData.medical;
          break;
        case 'personal':
          filteredData.personal = pilotData.personal;
          break;
      }
    });

    return filteredData;
  }

  // Get audit trail for data access
  getAccessAuditTrail(pilotDID: string): ConsentRecord[] {
    return this.consentManager.getPilotConsents(pilotDID);
  }

  // Check if pilot has expired credentials
  checkCredentialStatus(pilotDID: string): { [key: string]: string } {
    const pilotData = this.pilotDataStore.get(pilotDID);
    if (!pilotData) {
      return {};
    }

    const status: { [key: string]: string } = {};

    if (pilotData.license) {
      status.license = pilotData.license.status;
    }

    if (pilotData.medical) {
      status.medical = pilotData.medical.status;
    }

    return status;
  }
}

export { DataAccessVerifier, type DataAccessRequest, type DataAccessResult, type PilotData };
