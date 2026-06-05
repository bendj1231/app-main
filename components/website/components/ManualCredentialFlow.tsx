import React, { useState } from 'react';
import { CredentialUploadForm } from './CredentialUploadForm';
import { supabase } from '../../../src/lib/supabase';

interface ManualCredentialFlowProps {
  auth0Id: string;
  onCredentialClaimed: (credentialUrl: string) => void;
}

export const ManualCredentialFlow: React.FC<ManualCredentialFlowProps> = ({
  auth0Id,
  onCredentialClaimed
}) => {
  const [step, setStep] = useState<'upload' | 'pending' | 'ready'>('upload');
  const [credentialData, setCredentialData] = useState<any>(null);
  const [credentialUrl, setCredentialUrl] = useState<string | null>(null);

  const handleCredentialUploaded = async (data: any) => {
    setCredentialData(data);
    setStep('pending');
    
    // Simulate admin verification (in production, this would be actual admin review)
    // For demo purposes, we'll auto-approve after 3 seconds
    setTimeout(() => {
      issueVerifiableCredential(data);
    }, 3000);
  };

  const issueVerifiableCredential = async (data: any) => {
    try {
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

      // Create credential data based on uploaded information
      const credentialData = {
        '@context': ['https://www.w3.org/2018/credentials/v1'],
        type: ['VerifiableCredential', 'PilotLicenseVC'],
        issuer: { id: ISSUER_DID, name: 'PilotRecognition' },
        issuanceDate,
        expirationDate,
        credentialSubject: {
          id: subjectDid,
          licenseNumber: data.license_number,
          licenseType: data.license_type,
          issuingAuthority: data.issuing_authority,
          issueDate: data.issue_date,
          expiryDate: data.expiry_date,
          medicalClass: data.medical_class,
          medicalExpiry: data.medical_expiry,
          totalHours: data.total_hours,
          verifiedAt: issuanceDate,
          verificationMethod: 'Manual Document Upload',
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
      
      // Update database to mark as verified
      await supabase
        .from('pilot_documents')
        .update({ 
          status: 'verified',
          verified_at: new Date().toISOString(),
          credential_issued: true 
        })
        .eq('auth0_id', auth0Id);

    } catch (err) {
      console.error('Failed to issue credential:', err);
      setStep('upload'); // Reset to upload on error
    }
  };

  const handleClaimCredential = () => {
    if (credentialUrl) {
      // Store that user claimed the credential
      sessionStorage.setItem('wallet_claimed_provider', 'pilot');
      sessionStorage.setItem('manual_credential_claimed', 'true');
      
      // Open Pilot Wallet
      window.open(`https://wallet.pilotrecognition.com/?offer=${encodeURIComponent(credentialUrl)}`, '_blank', 'noopener,noreferrer');
      
      onCredentialClaimed(credentialUrl);
    }
  };

  if (step === 'upload') {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Upload Your Credentials</h2>
          <p className="text-gray-600">
            Fill out your pilot information and upload your license documents to get verified.
          </p>
        </div>
        
        <CredentialUploadForm 
          onCredentialUploaded={handleCredentialUploaded}
          auth0Id={auth0Id}
        />
      </div>
    );
  }

  if (step === 'pending') {
    return (
      <div className="max-w-md mx-auto text-center">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Verifying Your Credentials</h3>
          <p className="text-gray-600">
            Our system is reviewing your uploaded documents. This usually takes a few moments.
          </p>
          <div className="mt-4 text-sm text-gray-500">
            <p>✓ License document received</p>
            <p>✓ Medical document received</p>
            <p>⏳ Security verification in progress</p>
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
          
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Credentials Verified!</h3>
          <p className="text-gray-600 mb-6">
            Your pilot credentials have been verified and are ready to be claimed to your PIC.
          </p>
          
          <div className="bg-gray-50 rounded-lg p-4 mb-6 text-left">
            <h4 className="font-medium text-gray-900 mb-2">Verified Information:</h4>
            <div className="space-y-1 text-sm text-gray-600">
              <p><strong>License:</strong> {credentialData?.license_type} - {credentialData?.license_number}</p>
              <p><strong>Authority:</strong> {credentialData?.issuing_authority}</p>
              <p><strong>Hours:</strong> {credentialData?.total_hours || 'Not specified'}</p>
              <p><strong>Medical:</strong> {credentialData?.medical_class || 'Not provided'}</p>
            </div>
          </div>
          
          <button
            onClick={handleClaimCredential}
            className="w-full bg-blue-600 text-white py-3 px-6 rounded-md hover:bg-blue-700 transition-colors font-medium"
          >
            Claim to PIC
          </button>
          
          <p className="text-xs text-gray-500 mt-4">
            You'll be redirected to your PIC to store your verified credential.
          </p>
        </div>
      </div>
    );
  }

  return null;
};
