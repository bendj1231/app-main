import React, { useState } from 'react';
import { supabase } from '../../../src/lib/supabase';

interface WalletFirstCredentialFlowProps {
  auth0Id: string;
  onCredentialClaimed: (credentialUrl: string) => void;
}

export const WalletFirstCredentialFlow: React.FC<WalletFirstCredentialFlowProps> = ({
  auth0Id,
  onCredentialClaimed
}) => {
  const [step, setStep] = useState<'form' | 'preview' | 'issuing' | 'ready'>('form');
  const [credentialUrl, setCredentialUrl] = useState<string | null>(null);
  const [error, setError] = useState('');
  
  // Form fields - ONLY for credential creation, NOT storage
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [medicalClass, setMedicalClass] = useState('');
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [totalHours, setTotalHours] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate required fields
    if (!licenseNumber || !licenseType || !issueDate || !expiryDate || !issuingAuthority) {
      setError('Please fill in all license fields');
      return;
    }

    // Move to preview step - don't issue credential yet
    setStep('preview');
  };

  const createCredential = async () => {
    setStep('issuing');
    setError('');

    try {
      // Issue credential directly to Pilot Wallet - NO PLATFORM STORAGE
      const PILOT_ISSUER_URL = 'https://issuer.pilotrecognition.com';
      const ISSUER_DID = 'did:web:pilotrecognition.com';
      const subjectDid = `did:web:pilotrecognition.com:pilots:${auth0Id.replace('|', '-')}`;

      const issuanceDate = new Date().toISOString();
      const expirationDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString();

      // Onboard issuer key (dev mode)
      const onboardRes = await fetch(`${PILOT_ISSUER_URL}/onboard/issuer`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: { backend: 'jwk', keyType: 'secp256r1' },
          did: { method: 'jwk' }
        })
      });
      
      if (!onboardRes.ok) throw new Error('Issuer onboard failed');
      const onboardData = await onboardRes.json();

      // Create credential with pilot-provided data
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'PilotLicenseVC'],
        issuer: { id: ISSUER_DID, name: 'PilotRecognition' },
        issuanceDate,
        expirationDate,
        credentialSubject: {
          id: subjectDid,
          licenseNumber,
          licenseType,
          issuingAuthority,
          issueDate,
          expiryDate,
          medicalClass: medicalClass || null,
          medicalExpiry: medicalExpiry || null,
          totalHours: totalHours ? parseFloat(totalHours) : null,
          verifiedAt: issuanceDate,
          verificationMethod: 'Self-Attested via PilotRecognition',
          dataSource: 'Pilot-Provided', // IMPORTANT: No platform storage
        },
      };

      // Issue credential via OID4VCI
      const issueRes = await fetch(`${PILOT_ISSUER_URL}/openid4vc/jwt/issue`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'accept': 'text/plain' },
        body: JSON.stringify({
          issuerKey: { type: 'jwk', jwk: onboardData.issuerKey.jwk },
          issuerDid: onboardData.issuerDid || ISSUER_DID,
          credentialConfigurationId: 'OpenBadgeCredential_jwt_vc_json',
          credentialData,
          mapping: {
            id: '<uuid>',
            issuer: { id: '<issuerDid>' },
            credentialSubject: { id: '<subjectDid>' },
            issuanceDate: '<timestamp>',
            expirationDate: '<timestamp-in:365d>',
          },
          authenticationMethod: 'PRE_AUTHORIZED',
          standardVersion: 'DRAFT13',
        })
      });

      if (!issueRes.ok) throw new Error('Issuer signing failed');
      const credentialOfferUrl = await issueRes.text();

      setCredentialUrl(credentialOfferUrl);
      setStep('ready');

      // Only store minimal metadata - NOT the credential data
      await supabase
        .from('profiles')
        .update({ 
          wallet_connected: true,
          credential_issued_at: new Date().toISOString()
        })
        .eq('auth0_id', auth0Id);

    } catch (err) {
      console.error('Failed to issue credential:', err);
      setError('Failed to issue credential. Please try again.');
      setStep('preview');
    }
  };

  const handleClaimCredential = () => {
    if (credentialUrl) {
      // Store that user claimed the credential
      sessionStorage.setItem('wallet_claimed_provider', 'pilot');
      sessionStorage.setItem('manual_credential_claimed', 'true');
      
      // Open Pilot Wallet
      window.open(`https://wallet.pilotrecognition.com/?offer=${encodeURIComponent(credentialUrl)}`, '_blank');
      
      onCredentialClaimed(credentialUrl);
    }
  };

  if (step === 'preview') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Review Your Credential</h2>
          <p className="text-gray-600 mb-4">
            Confirm your information before creating the digital credential.
          </p>
        </div>
        
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Pilot License Details</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">License Number:</span>
              <span className="font-medium text-gray-900">{licenseNumber}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">License Type:</span>
              <span className="font-medium text-gray-900">{licenseType}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Issuing Authority:</span>
              <span className="font-medium text-gray-900">{issuingAuthority}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Issue Date:</span>
              <span className="font-medium text-gray-900">{issueDate}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-100">
              <span className="text-gray-600">Expiry Date:</span>
              <span className="font-medium text-gray-900">{expiryDate}</span>
            </div>
            {medicalClass && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Medical Class:</span>
                <span className="font-medium text-gray-900">{medicalClass}</span>
              </div>
            )}
            {medicalExpiry && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Medical Expiry:</span>
                <span className="font-medium text-gray-900">{medicalExpiry}</span>
              </div>
            )}
            {totalHours && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Total Hours:</span>
                <span className="font-medium text-gray-900">{totalHours}h</span>
              </div>
            )}
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <div className="flex items-center gap-2 text-green-800">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="font-medium">Privacy-First Design</span>
          </div>
          <p className="text-green-700 text-sm mt-1">
            This credential will be stored only in your Pilot Wallet, not on our platform.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => setStep('form')}
            className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 font-medium"
          >
            ← Back to Edit
          </button>
          <button
            type="button"
            onClick={createCredential}
            className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
          >
            Create Digital Credential →
          </button>
        </div>
      </div>
    );
  }

  if (step === 'form') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Your Digital Credential</h2>
          <p className="text-gray-600 mb-4">
            Your data stays private - it goes directly to your wallet, not our platform.
          </p>
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-green-800">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span className="font-medium">Privacy-First Design</span>
            </div>
            <p className="text-green-700 text-sm mt-1">
              Your credentials are stored only in your Pilot Wallet
            </p>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* License Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Pilot License</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Number *
                </label>
                <input
                  type="text"
                  value={licenseNumber}
                  onChange={(e) => setLicenseNumber(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  License Type *
                </label>
                <select
                  value={licenseType}
                  onChange={(e) => setLicenseType(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select license type</option>
                  <option value="PPL">Private Pilot License (PPL)</option>
                  <option value="CPL">Commercial Pilot License (CPL)</option>
                  <option value="ATPL">Airline Transport Pilot License (ATPL)</option>
                  <option value="Student">Student Pilot License</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issue Date *
                </label>
                <input
                  type="date"
                  value={issueDate}
                  onChange={(e) => setIssueDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiry Date *
                </label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Issuing Authority *
                </label>
                <input
                  type="text"
                  value={issuingAuthority}
                  onChange={(e) => setIssuingAuthority(e.target.value)}
                  placeholder="e.g., CAAP, FAA, EASA"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
            </div>
          </div>

          {/* Medical Information */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Medical Certificate</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Class
                </label>
                <select
                  value={medicalClass}
                  onChange={(e) => setMedicalClass(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select medical class</option>
                  <option value="Class 1">Class 1</option>
                  <option value="Class 2">Class 2</option>
                  <option value="Class 3">Class 3</option>
                  <option value="BasicMed">BasicMed</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Medical Expiry Date
                </label>
                <input
                  type="date"
                  value={medicalExpiry}
                  onChange={(e) => setMedicalExpiry(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          {/* Flight Hours */}
          <div>
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Flight Experience</h3>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Total Flight Hours
              </label>
              <input
                type="number"
                value={totalHours}
                onChange={(e) => setTotalHours(e.target.value)}
                placeholder="e.g., 1500"
                step="0.1"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 font-medium"
            >
              Review Information →
            </button>
          </div>
        </form>
      </div>
    );
  }

  if (step === 'issuing') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Creating Your Digital Credential</h3>
          <p className="text-gray-600">
            Your credential is being generated and sent directly to your wallet.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>✓ Credential data prepared</p>
            <p>⏳ Signing with platform key</p>
            <p>⏳ Sending to Pilot Wallet</p>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'ready') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
            </svg>
          </div>
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Digital Credential Ready!</h3>
          <p className="text-gray-600 mb-6">
            Your pilot credential has been created and is ready to be claimed to your wallet.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Credential Details:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>License:</strong> {licenseType} - {licenseNumber}</p>
              <p><strong>Authority:</strong> {issuingAuthority}</p>
              <p><strong>Hours:</strong> {totalHours || 'Not specified'}</p>
              <p><strong>Medical:</strong> {medicalClass || 'Not provided'}</p>
            </div>
          </div>
          
          <button
            onClick={handleClaimCredential}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Claim to Pilot Wallet
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            Your credential will be stored securely in your personal wallet.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
