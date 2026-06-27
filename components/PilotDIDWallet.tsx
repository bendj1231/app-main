import React, { useState, useEffect } from 'react';
import { ConsentManager, type ConsentRecord, type DataRequest } from '../lib/consent-manager';

interface PilotDIDWalletProps {
  pilotDID: string;
  onConsentGranted?: (consent: ConsentRecord) => void;
  onConsentRevoked?: (consentId: string) => void;
}

export const PilotDIDWallet: React.FC<PilotDIDWalletProps> = ({
  pilotDID,
  onConsentGranted,
  onConsentRevoked
}) => {
  const [consentManager] = useState(() => new ConsentManager());
  const [consents, setConsents] = useState<ConsentRecord[]>([]);
  const [showConsentModal, setShowConsentModal] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<DataRequest | null>(null);

  useEffect(() => {
    setConsents(consentManager.getPilotConsents(pilotDID));
  }, [pilotDID, consentManager]);

  const handleGrantConsent = (request: DataRequest) => {
    const consent = consentManager.grantConsent(request, pilotDID);
    setConsents(consentManager.getPilotConsents(pilotDID));
    onConsentGranted?.(consent);
    setShowConsentModal(false);
    setSelectedRequest(null);
  };

  const handleRevokeConsent = (consentId: string) => {
    const success = consentManager.revokeConsent(pilotDID, consentId);
    if (success) {
      setConsents(consentManager.getPilotConsents(pilotDID));
      onConsentRevoked?.(consentId);
    }
  };

  const mockDataRequests: DataRequest[] = [
    {
      requester: 'Emirates Airlines',
      pilotDID,
      dataTypes: ['license', 'hours', 'medical'],
      purpose: 'Job Application - First Officer Position',
      duration: 30
    },
    {
      requester: 'CAAP Verification',
      pilotDID,
      dataTypes: ['license'],
      purpose: 'License Status Verification',
      duration: 7
    },
    {
      requester: 'Flight School Dubai',
      pilotDID,
      dataTypes: ['hours'],
      purpose: 'Instructor Application',
      duration: 14
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🔐 Pilot DID Wallet
        </h2>
        <p className="text-gray-600">
          Your Decentralized Identity: <code className="bg-gray-100 px-2 py-1 rounded">{pilotDID}</code>
        </p>
      </div>

      {/* Data Access Requests */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">📋 Pending Access Requests</h3>
        <div className="space-y-3">
          {mockDataRequests.map((request, index) => (
            <div key={index} className="border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-semibold text-gray-900">{request.requester}</h4>
                  <p className="text-sm text-gray-600 mt-1">{request.purpose}</p>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {request.dataTypes.map((type) => (
                      <span
                        key={type}
                        className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full"
                      >
                        {type}
                      </span>
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Duration: {request.duration} days
                  </p>
                </div>
                <button
                  onClick={() => {
                    setSelectedRequest(request);
                    setShowConsentModal(true);
                  }}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Review & Grant
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Active Consents */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">✅ Active Consents</h3>
        <div className="space-y-3">
          {consents
            .filter(consent => consent.granted && !consent.revokedAt && consent.expiration > new Date())
            .map((consent) => (
              <div key={consent.id} className="border border-green-200 rounded-lg p-4 bg-green-50">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-semibold text-gray-900">{consent.requester}</h4>
                    <p className="text-sm text-gray-600 mt-1">{consent.purpose}</p>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {consent.dataTypes.map((type) => (
                        <span
                          key={type}
                          className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full"
                        >
                          {type}
                        </span>
                      ))}
                    </div>
                    <p className="text-xs text-gray-500 mt-2">
                      Expires: {consent.expiration.toLocaleDateString()} | 
                      Access: {consent.accessCount}/{consent.maxAccess}
                    </p>
                  </div>
                  <button
                    onClick={() => handleRevokeConsent(consent.id)}
                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    Revoke
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Consent Modal */}
      {showConsentModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Grant Data Access Consent</h3>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">
                <strong>Requester:</strong> {selectedRequest.requester}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Purpose:</strong> {selectedRequest.purpose}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Data Types:</strong> {selectedRequest.dataTypes.join(', ')}
              </p>
              <p className="text-sm text-gray-600 mb-2">
                <strong>Duration:</strong> {selectedRequest.duration} days
              </p>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
              <p className="text-sm text-yellow-800">
                ⚠️ By granting consent, you allow {selectedRequest.requester} to access the specified data for the stated purpose. You can revoke this consent at any time.
              </p>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => handleGrantConsent(selectedRequest)}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Grant Consent
              </button>
              <button
                onClick={() => {
                  setShowConsentModal(false);
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
