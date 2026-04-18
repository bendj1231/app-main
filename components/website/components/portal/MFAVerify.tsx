import React, { useState } from 'react';
import { useAuth } from '../../../../src/contexts/AuthContext';

interface MFAVerifyProps {
  onSuccess: () => void;
}

export const MFAVerify: React.FC<MFAVerifyProps> = ({ onSuccess }) => {
  const { mfaVerify } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleVerify = async () => {
    try {
      setLoading(true);
      setError('');
      const result = await mfaVerify(code, false);
      if (result.success) {
        onSuccess();
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-verify">
      <h2 className="text-2xl font-bold mb-4">Enter Two-Factor Authentication Code</h2>
      <p className="text-gray-600 mb-6">
        Enter the 6-digit code from your authenticator app to complete sign in.
      </p>
      <div className="mb-4">
        <label className="block text-sm font-medium mb-2">Authentication Code</label>
        <input
          type="text"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          maxLength={6}
          className="w-full border rounded px-3 py-2 text-center text-2xl tracking-widest"
          placeholder="000000"
          autoFocus
        />
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        onClick={handleVerify}
        disabled={code.length !== 6 || loading}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
      >
        {loading ? 'Verifying...' : 'Verify'}
      </button>
      <p className="text-sm text-gray-500 mt-4 text-center">
        Lost your device? Use a backup code instead.
      </p>
    </div>
  );
};
