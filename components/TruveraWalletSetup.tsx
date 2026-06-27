import React, { useState } from 'react';
import { AlertCircle, CheckCircle, Wallet, Shield } from 'lucide-react';

interface TruveraWalletSetupProps {
  pilotId: string;
  pilotEmail: string;
  onWalletCreated: (walletId: string) => void;
  onSkip: () => void;
}

interface IssuerConfig {
  name: string;
  did: string;
  description: string;
  permissions: string[];
  logo: string;
}

const TRUSTED_ISSUERS: IssuerConfig[] = [
  {
    name: "PilotRecognition",
    did: "did:truvera:pilotrecognition",
    description: "Issue and manage your aviation credentials",
    permissions: ["Issue pilot licenses", "Manage medical certificates", "Connect to airlines"],
    logo: "/logos/pilotrecognition.svg"
  },
  {
    name: "Veremark",
    did: "did:truvera:veremark", 
    description: "Verify credentials for employers and background checks",
    permissions: ["Verify credentials", "Run background checks", "Issue verification results"],
    logo: "/logos/veremark.svg"
  }
];

export const TruveraWalletSetup: React.FC<TruveraWalletSetupProps> = ({
  pilotId,
  pilotEmail,
  onWalletCreated,
  onSkip
}) => {
  const [step, setStep] = useState<'intro' | 'creating' | 'issuers' | 'confirm' | 'complete' | 'error'>('intro');
  const [walletId, setWalletId] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreedToIssuers, setAgreedToIssuers] = useState<boolean[]>([true, true]);

  // Step 1: Create wallet with password
  const createWallet = async () => {
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setStep('creating');
    setError('');

    try {
      const response = await fetch('/api/wallet/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId,
          email: pilotEmail,
          password,
          issuers: TRUSTED_ISSUERS.map((issuer, index) => ({
            ...issuer,
            approved: agreedToIssuers[index]
          }))
        })
      });

      if (!response.ok) {
        throw new Error('Failed to create wallet');
      }

      const data = await response.json();
      setWalletId(data.walletId);
      setStep('issuers');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create wallet');
      setStep('error');
    }
  };

  // Step 2: Confirm issuers
  const confirmIssuers = async () => {
    setStep('confirm');
    
    try {
      // Store wallet reference in our database
      await fetch('/api/wallet/store-reference', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pilotId,
          walletId,
          truveraWalletId: walletId,
          issuers: TRUSTED_ISSUERS.filter((_, i) => agreedToIssuers[i]).map(i => i.did)
        })
      });

      setStep('complete');
      onWalletCreated(walletId);
    } catch (_err) {
      setError('Failed to store wallet reference');
      setStep('error');
    }
  };

  // Render intro step
  if (step === 'intro') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Wallet className="w-8 h-8 text-blue-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Create Your Pilot Wallet</h2>
          <p className="text-gray-600 mt-2">
            Securely store your aviation credentials with bank-grade encryption
          </p>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
          <div className="flex items-start">
            <Shield className="w-5 h-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
            <div>
              <h3 className="font-semibold text-blue-900">Powered by Truvera</h3>
              <p className="text-sm text-blue-700 mt-1">
                Your credentials are encrypted and stored securely by Truvera, 
                a Swiss-based identity provider. We never store your private data.
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Wallet Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a secure password"
            />
            <p className="text-xs text-gray-500 mt-1">
              This password encrypts your wallet. Don't lose it!
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
            />
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center">
            <AlertCircle className="w-5 h-5 text-red-600 mr-2" />
            <span className="text-sm text-red-700">{error}</span>
          </div>
        )}

        <div className="flex gap-3">
          <button
            onClick={createWallet}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Create Wallet
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  // Render creating step
  if (step === 'creating') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
        <h3 className="text-lg font-semibold text-gray-900">Creating your wallet...</h3>
        <p className="text-gray-600 mt-2">Setting up secure credential storage</p>
      </div>
    );
  }

  // Render issuers confirmation
  if (step === 'issuers') {
    return (
      <div className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900">Wallet Created!</h2>
          <p className="text-gray-600 mt-2">
            Confirm which services can access your credentials
          </p>
        </div>

        <div className="space-y-4 mb-6">
          {TRUSTED_ISSUERS.map((issuer, index) => (
            <div 
              key={issuer.did}
              className={`border rounded-lg p-4 ${agreedToIssuers[index] ? 'border-blue-500 bg-blue-50' : 'border-gray-200'}`}
            >
              <div className="flex items-start">
                <input
                  type="checkbox"
                  checked={agreedToIssuers[index]}
                  onChange={(e) => {
                    const newAgreed = [...agreedToIssuers];
                    newAgreed[index] = e.target.checked;
                    setAgreedToIssuers(newAgreed);
                  }}
                  className="mt-1 mr-3 w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{issuer.name}</h3>
                  <p className="text-sm text-gray-600">{issuer.description}</p>
                  <ul className="mt-2 text-xs text-gray-500 space-y-1">
                    {issuer.permissions.map((perm, i) => (
                      <li key={i} className="flex items-center">
                        <span className="w-1 h-1 bg-gray-400 rounded-full mr-2" />
                        {perm}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <p className="text-sm text-gray-600">
            <strong>You control access:</strong> You can revoke these permissions anytime 
            from your wallet settings. Your credentials remain encrypted and under your control.
          </p>
        </div>

        <button
          onClick={confirmIssuers}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Confirm & Continue
        </button>
      </div>
    );
  }

  // Render complete step
  if (step === 'complete') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-8 h-8 text-green-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">You're All Set!</h2>
        <p className="text-gray-600 mt-2">
          Your Pilot Wallet is ready. You can now:
        </p>
        <ul className="text-left mt-4 space-y-2 text-gray-700">
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Store your pilot license securely
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Get verified by Veremark
          </li>
          <li className="flex items-center">
            <CheckCircle className="w-4 h-4 text-green-600 mr-2" />
            Connect with airlines
          </li>
        </ul>
        <button
          onClick={() => onWalletCreated(walletId)}
          className="mt-6 w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Continue to Profile
        </button>
      </div>
    );
  }

  // Render error step
  if (step === 'error') {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-8 h-8 text-red-600" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900">Setup Failed</h2>
        <p className="text-red-600 mt-2">{error}</p>
        <div className="flex gap-3 mt-6">
          <button
            onClick={() => setStep('intro')}
            className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
          <button
            onClick={onSkip}
            className="px-4 py-3 text-gray-600 hover:text-gray-800 transition-colors"
          >
            Skip for now
          </button>
        </div>
      </div>
    );
  }

  return null;
};

export default TruveraWalletSetup;
