import React, { useState } from 'react';
import { useAuth } from '../../../../src/contexts/AuthContext';

export const MFASetup: React.FC = () => {
  const { mfaSetup, mfaSetupData, mfaSetupStep, mfaVerify } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [backupCodes, setBackupCodes] = useState<string[]>([]);

  const handleSetup = async () => {
    try {
      setLoading(true);
      setError('');
      await mfaSetup('totp');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to setup MFA');
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await mfaVerify(code, true);
      if (result.success && result.backupCodes) {
        setBackupCodes(result.backupCodes);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  if (backupCodes.length > 0) {
    return (
      <div className="mfa-backup-codes">
        <h2 className="text-2xl font-bold mb-4">Save Your Backup Codes</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm mb-2">
            ⚠️ These codes will not be shown again. Save them in a secure location.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-4">
          {backupCodes.map((code, index) => (
            <div key={index} className="bg-gray-100 p-2 rounded text-center font-mono">
              {code}
            </div>
          ))}
        </div>
        <button
          onClick={() => setBackupCodes([])}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
        >
          I've Saved My Codes
        </button>
      </div>
    );
  }

  if (mfaSetupStep === 'qr' && mfaSetupData.qrCodeURL) {
    return (
      <div className="mfa-qr-step">
        <h2 className="text-2xl font-bold mb-4">Scan QR Code</h2>
        <div className="bg-white p-4 rounded-lg mb-4 flex justify-center">
          <img 
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(mfaSetupData.qrCodeURL)}`}
            alt="QR Code for MFA Setup"
            className="border"
          />
        </div>
        <p className="text-sm text-gray-600 mb-4">
          Scan this QR code with your authenticator app (Google Authenticator, Authy, etc.)
        </p>
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Enter 6-digit code</label>
          <input
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            maxLength={6}
            className="w-full border rounded px-3 py-2 text-center text-2xl tracking-widest"
            placeholder="000000"
          />
        </div>
        {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
        <button
          onClick={handleVerify}
          disabled={code.length !== 6 || loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Verifying...' : 'Verify & Enable MFA'}
        </button>
      </div>
    );
  }

  return (
    <div className="mfa-setup">
      <h2 className="text-2xl font-bold mb-4">Enable Two-Factor Authentication</h2>
      <p className="text-gray-600 mb-6">
        Add an extra layer of security to your account by requiring a code from your authenticator app when you sign in.
      </p>
      <button
        onClick={handleSetup}
        disabled={loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Setting up...' : 'Setup 2FA'}
      </button>
    </div>
  );
};
