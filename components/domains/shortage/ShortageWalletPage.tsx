/**
 * ShortageWalletPage - Pilot Wallet for pilotshortage.org
 * 
 * Advocacy pilots can store verified credentials to prove they're real pilots
 * when submitting anonymous stories. This creates credibility without doxxing.
 */

import React, { useState, useEffect } from 'react';
import { supabase } from '../../../src/lib/supabase';
import { issueAndStoreCredentialSelfHosted, getOrCreateClientWallet } from '../../../src/lib/wallet';
import { generateEnclaveKey, getEnclaveStatus } from '../../../lib/wallet/enclave';
import { Shield, Wallet, CheckCircle, AlertTriangle, Mic, FileText } from 'lucide-react';

interface ShortageWalletPageProps {
  auth0Id: string;
  profileId: string;
}

export const ShortageWalletPage: React.FC<ShortageWalletPageProps> = ({ auth0Id, profileId }) => {
  const [walletState, setWalletState] = useState<'loading' | 'no-wallet' | 'ready' | 'error'>('loading');
  const [did, setDid] = useState<string | null>(null);
  const [credentials, setCredentials] = useState<any[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [licenseNumber, setLicenseNumber] = useState('');
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    initWallet();
  }, [auth0Id]);

  const initWallet = async () => {
    try {
      // Check if wallet exists
      const { data: profile } = await supabase
        .from('profiles')
        .select('wallet_id, wallet_did')
        .eq('id', profileId)
        .single();

      if (profile?.wallet_id) {
        setDid(profile.wallet_did);
        setWalletState('ready');
        loadCredentials();
      } else {
        setWalletState('no-wallet');
      }
    } catch (err) {
      setWalletState('error');
    }
  };

  const loadCredentials = async () => {
    const { data } = await supabase
      .from('pilot_credentials')
      .select('*')
      .eq('profile_id', profileId)
      .eq('status', 'active')
      .order('issued_at', { ascending: false });
    setCredentials(data || []);
  };

  const createWallet = async () => {
    setIsCreating(true);
    try {
      // Generate enclave key
      await generateEnclaveKey();
      const status = await getEnclaveStatus();
      
      // Create client wallet
      const { did: newDid } = await getOrCreateClientWallet(profileId, auth0Id);
      
      // Issue anonymous verification credential
      if (licenseNumber) {
        await issueAndStoreCredentialSelfHosted(
          auth0Id,
          profileId,
          licenseNumber,
          'Commercial Pilot License',
          'Anonymous',
          null,
          0
        );
      }

      setDid(newDid);
      setWalletState('ready');
      setShowCreateModal(false);
      loadCredentials();
    } catch (err) {
      console.error('Wallet creation failed:', err);
    } finally {
      setIsCreating(false);
    }
  };

  if (walletState === 'loading') {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500"></div>
      </div>
    );
  }

  if (walletState === 'error') {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center gap-2 text-red-700">
          <AlertTriangle className="w-5 h-5" />
          <span>Failed to load wallet. Please refresh.</span>
        </div>
      </div>
    );
  }

  if (walletState === 'no-wallet') {
    return (
      <div className="bg-slate-900 border border-amber-500/30 rounded-xl p-6">
        <div className="flex items-start gap-4">
          <div className="bg-amber-500/20 p-3 rounded-lg">
            <Shield className="w-6 h-6 text-amber-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-white mb-2">
              Anonymous Story Verification
            </h3>
            <p className="text-slate-400 text-sm mb-4">
              Create a zero-knowledge wallet to prove you're a real pilot without revealing your identity. 
              This lets you submit verified stories while staying anonymous.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Create Anonymous Wallet
            </button>
          </div>
        </div>

        {showCreateModal && (
          <div className="mt-4 bg-slate-800 rounded-lg p-4 border border-slate-700">
            <h4 className="text-white font-medium mb-3">Optional: Verify Your License</h4>
            <p className="text-slate-400 text-sm mb-3">
              Enter your license number to create a verified credential. 
              This is stored as a cryptographic hash - we can't see the actual number.
            </p>
            <input
              type="text"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="License number (optional)"
              className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white mb-3"
            />
            <div className="flex gap-2">
              <button
                onClick={createWallet}
                disabled={isCreating}
                className="flex-1 bg-amber-500 hover:bg-amber-600 text-slate-900 font-medium px-4 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {isCreating ? 'Creating...' : 'Create Wallet'}
              </button>
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-400 hover:text-white transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="bg-green-500/20 p-2 rounded-lg">
            <Wallet className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-white font-semibold">Anonymous Wallet Active</h3>
            <p className="text-slate-400 text-xs">DID: {did?.slice(0, 20)}...</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-green-400 text-sm">
          <CheckCircle className="w-4 h-4" />
          <span>Verified</span>
        </div>
      </div>

      <div className="space-y-3">
        <h4 className="text-slate-300 text-sm font-medium">Credentials</h4>
        {credentials.length === 0 ? (
          <p className="text-slate-500 text-sm">No credentials yet. Submit a story to get verified.</p>
        ) : (
          credentials.map((cred) => (
            <div key={cred.id} className="bg-slate-800 rounded-lg p-3 border border-slate-700">
              <div className="flex items-center justify-between">
                <span className="text-white text-sm">{cred.credential_type}</span>
                <span className="text-green-400 text-xs">Active</span>
              </div>
              <p className="text-slate-500 text-xs mt-1">
                Issued: {new Date(cred.issued_at).toLocaleDateString()}
              </p>
            </div>
          ))
        )}
      </div>

      <div className="mt-6 pt-4 border-t border-slate-800">
        <div className="flex items-center gap-2 text-amber-400 text-sm">
          <Mic className="w-4 h-4" />
          <span>Ready to submit anonymous stories</span>
        </div>
        <p className="text-slate-500 text-xs mt-1">
          Your identity remains hidden. Only your pilot status is verified.
        </p>
      </div>
    </div>
  );
};
