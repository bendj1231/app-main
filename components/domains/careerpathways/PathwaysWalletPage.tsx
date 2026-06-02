/**
 * PathwaysWalletPage - Pilot Wallet for pilotcareerpathways.com
 * 
 * Career-focused wallet that connects verified credentials to pathway applications.
 * Pilots can present their wallet to airlines when applying through pathways.
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { issueAndStoreCredentialSelfHosted, getOrCreateClientWallet, getWalletCredentials } from '../../../src/lib/wallet';
import { generateEnclaveKey, getEnclaveStatus } from '../../../lib/wallet/enclave';
import { Wallet, Plane, Briefcase, Award, Share2, CheckCircle, AlertCircle } from 'lucide-react';

interface PathwaysWalletPageProps {
  auth0Id: string;
  profileId: string;
}

interface PathwayMatch {
  id: string;
  airline: string;
  position: string;
  matchScore: number;
  requirements: string[];
  missing: string[];
}

export const PathwaysWalletPage: React.FC<PathwaysWalletPageProps> = ({ auth0Id, profileId }) => {
  const [walletState, setWalletState] = useState<'loading' | 'no-wallet' | 'ready'>('loading');
  const [did, setDid] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [pathways, setPathways] = useState<PathwayMatch[]>([]);
  const [showSetup, setShowSetup] = useState(false);
  const [setupStep, setSetupStep] = useState<'license' | 'medical' | 'hours'>('license');

  // Form data
  const [licenseData, setLicenseData] = useState({
    number: '',
    type: 'Commercial Pilot License',
    authority: '',
    expiry: ''
  });
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [totalHours, setTotalHours] = useState('');

  useEffect(() => {
    initWallet();
  }, [auth0Id]);

  const initWallet = async () => {
    try {
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_id, wallet_did')
        .eq('id', profileId)
        .single();

      if (profile?.wallet_id) {
        setDid(profile.wallet_did);
        setWalletState('ready');
        loadCredentials();
        loadPathways();
      } else {
        setWalletState('no-wallet');
      }
    } catch (err) {
      setWalletState('no-wallet');
    }
  };

  const loadCredentials = async () => {
    const creds = await getWalletCredentials(profileId);
    setCredentials(creds);
  };

  const loadPathways = async () => {
    // Load matching pathways based on credentials
    const { data } = await supabase
      .from('pathway_matches')
      .select('*')
      .eq('profile_id', profileId)
      .order('match_score', { ascending: false })
      .limit(5);
    
    if (data) {
      setPathways(data.map((m: any) => ({
        id: m.pathway_id,
        airline: m.airline_name,
        position: m.position,
        matchScore: m.match_score,
        requirements: m.requirements || [],
        missing: m.missing_requirements || []
      })));
    }
  };

  const createWallet = async () => {
    // Generate enclave key
    await generateEnclaveKey();
    
    // Create wallet
    const { did: newDid } = await getOrCreateClientWallet(profileId, auth0Id);
    setDid(newDid);

    // Issue credentials based on setup data
    if (licenseData.number) {
      await issueAndStoreCredentialSelfHosted(
        auth0Id,
        profileId,
        licenseData.number,
        licenseData.type,
        licenseData.authority,
        licenseData.expiry,
        parseFloat(totalHours) || 0
      );
    }

    setWalletState('ready');
    setShowSetup(false);
    loadCredentials();
    loadPathways();
  };

  const shareCredential = (credentialId: string) => {
    const shareUrl = `https://wallet.pilotrecognition.com/c/${credentialId}`;
    navigator.clipboard.writeText(shareUrl);
    alert('Credential link copied! Share this with airlines.');
  };

  if (walletState === 'loading') {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500"></div>
      </div>
    );
  }

  if (walletState === 'no-wallet') {
    return (
      <div className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm">
        {!showSetup ? (
          <div className="text-center">
            <div className="bg-cyan-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-cyan-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">
              Create Your Career Wallet
            </h2>
            <p className="text-slate-600 mb-6 max-w-md mx-auto">
              Store your verified credentials and apply to airline pathways with one click. 
              Your wallet proves your qualifications without repeated verification.
            </p>
            <button
              onClick={() => setShowSetup(true)}
              className="bg-cyan-600 hover:bg-cyan-700 text-white font-medium px-6 py-3 rounded-xl transition-colors"
            >
              Setup Wallet
            </button>
          </div>
        ) : (
          <div className="max-w-lg mx-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-slate-900">
                {setupStep === 'license' && 'License Information'}
                {setupStep === 'medical' && 'Medical Certificate'}
                {setupStep === 'hours' && 'Flight Hours'}
              </h3>
              <span className="text-sm text-slate-500">
                Step {setupStep === 'license' ? 1 : setupStep === 'medical' ? 2 : 3} of 3
              </span>
            </div>

            {setupStep === 'license' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    License Number
                  </label>
                  <input
                    type="text"
                    value={licenseData.number}
                    onChange={(e) => setLicenseData({...licenseData, number: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 123456-CPL"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Issuing Authority
                  </label>
                  <select
                    value={licenseData.authority}
                    onChange={(e) => setLicenseData({...licenseData, authority: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  >
                    <option value="">Select authority</option>
                    <option value="FAA">FAA (USA)</option>
                    <option value="EASA">EASA (Europe)</option>
                    <option value="CAAP">CAAP (Philippines)</option>
                    <option value="CASA">CASA (Australia)</option>
                    <option value="GCAA">GCAA (UAE)</option>
                    <option value="Other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    License Expiry
                  </label>
                  <input
                    type="date"
                    value={licenseData.expiry}
                    onChange={(e) => setLicenseData({...licenseData, expiry: e.target.value})}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <button
                  onClick={() => setSetupStep('medical')}
                  className="w-full bg-cyan-600 text-white font-medium py-2 rounded-lg"
                >
                  Continue
                </button>
              </div>
            )}

            {setupStep === 'medical' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Medical Certificate Expiry
                  </label>
                  <input
                    type="date"
                    value={medicalExpiry}
                    onChange={(e) => setMedicalExpiry(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setSetupStep('hours')}
                    className="flex-1 bg-cyan-600 text-white font-medium py-2 rounded-lg"
                  >
                    Continue
                  </button>
                  <button
                    onClick={() => setSetupStep('license')}
                    className="px-4 py-2 text-slate-600"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}

            {setupStep === 'hours' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Total Flight Hours
                  </label>
                  <input
                    type="number"
                    value={totalHours}
                    onChange={(e) => setTotalHours(e.target.value)}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2"
                    placeholder="e.g., 1500"
                  />
                </div>
                <div className="bg-cyan-50 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <CheckCircle className="w-5 h-5 text-cyan-600 mt-0.5" />
                    <p className="text-sm text-cyan-800">
                      Your credentials will be cryptographically signed and stored in your personal wallet. 
                      Airlines can verify them instantly without contacting authorities.
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={createWallet}
                    className="flex-1 bg-cyan-600 text-white font-medium py-2 rounded-lg"
                  >
                    Create Wallet & Issue Credentials
                  </button>
                  <button
                    onClick={() => setSetupStep('medical')}
                    className="px-4 py-2 text-slate-600"
                  >
                    Back
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Wallet Header */}
      <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-cyan-100 p-3 rounded-xl">
              <Wallet className="w-6 h-6 text-cyan-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Career Wallet</h2>
              <p className="text-slate-500 text-sm">DID: {did?.slice(0, 25)}...</p>
            </div>
          </div>
          <div className="flex items-center gap-2 text-green-600 bg-green-50 px-3 py-1 rounded-full text-sm">
            <CheckCircle className="w-4 h-4" />
            <span>Verified</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Credentials Section */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Award className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-900">Your Credentials</h3>
          </div>

          {credentials.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <p>No credentials issued yet.</p>
              <button
                onClick={() => setShowSetup(true)}
                className="mt-2 text-cyan-600 hover:underline text-sm"
              >
                Add credentials
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {credentials.map((cred) => (
                <div key={cred.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{cred.credential_type}</span>
                    <button
                      onClick={() => shareCredential(cred.id)}
                      className="text-cyan-600 hover:text-cyan-700"
                    >
                      <Share2 className="w-4 h-4" />
                    </button>
                  </div>
                  <div className="text-sm text-slate-600 space-y-1">
                    <p>Status: <span className="text-green-600">Active</span></p>
                    <p>Issued: {new Date(cred.issued_at).toLocaleDateString()}</p>
                    {cred.total_hours && <p>Hours: {cred.total_hours}</p>}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Matching Pathways */}
        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <Plane className="w-5 h-5 text-cyan-600" />
            <h3 className="font-semibold text-slate-900">Matching Pathways</h3>
          </div>

          {pathways.length === 0 ? (
            <div className="text-center py-8 text-slate-500">
              <Briefcase className="w-12 h-12 mx-auto mb-3 text-slate-300" />
              <p>No matching pathways yet.</p>
              <p className="text-sm mt-1">Add your credentials to see matches.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {pathways.map((pathway) => (
                <div key={pathway.id} className="border border-slate-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-slate-900">{pathway.airline}</span>
                    <span className={`text-sm px-2 py-1 rounded-full ${
                      pathway.matchScore >= 80 ? 'bg-green-100 text-green-700' :
                      pathway.matchScore >= 60 ? 'bg-amber-100 text-amber-700' :
                      'bg-slate-100 text-slate-700'
                    }`}>
                      {pathway.matchScore}% Match
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mb-2">{pathway.position}</p>
                  {pathway.missing.length > 0 && (
                    <div className="flex items-start gap-2 text-sm">
                      <AlertCircle className="w-4 h-4 text-amber-500 mt-0.5" />
                      <span className="text-slate-600">
                        Missing: {pathway.missing.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
