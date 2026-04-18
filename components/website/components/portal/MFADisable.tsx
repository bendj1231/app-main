import React, { useState } from 'react';
import { useAuth } from '../../../../src/contexts/AuthContext';

export const MFADisable: React.FC = () => {
  const { mfaDisable } = useAuth();
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleDisable = async () => {
    try {
      setLoading(true);
      setError('');
      await mfaDisable(code);
      alert('MFA has been disabled successfully');
      setCode('');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-disable">
      <h2 className="text-2xl font-bold mb-4">Disable Two-Factor Authentication</h2>
      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
        <p className="text-red-800 text-sm">
          ⚠️ Disabling MFA will reduce the security of your account. Are you sure?
        </p>
      </div>
      <p className="text-gray-600 mb-4">
        Enter your current 2FA code or a backup code to disable MFA.
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
        />
      </div>
      {error && <p className="text-red-600 text-sm mb-2">{error}</p>}
      <button
        onClick={handleDisable}
        disabled={code.length !== 6 || loading}
        className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 disabled:bg-gray-400"
      >
        {loading ? 'Disabling...' : 'Disable MFA'}
      </button>
    </div>
  );
};
