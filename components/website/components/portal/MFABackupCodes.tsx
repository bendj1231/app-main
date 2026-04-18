import React, { useState } from 'react';
import { useAuth } from '../../../../src/contexts/AuthContext';

export const MFABackupCodes: React.FC = () => {
  const { mfaGenerateBackupCodes } = useAuth();
  const [newCodes, setNewCodes] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async () => {
    if (!confirm('Generating new backup codes will invalidate all existing codes. Continue?')) {
      return;
    }

    try {
      setLoading(true);
      setError('');
      const codes = await mfaGenerateBackupCodes();
      setNewCodes(codes);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to generate backup codes');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mfa-backup-codes">
      <h2 className="text-2xl font-bold mb-4">Backup Codes</h2>
      <p className="text-gray-600 mb-4">
        Backup codes can be used to access your account if you lose your authenticator device.
        Each code can only be used once.
      </p>

      {newCodes.length > 0 ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-yellow-800 text-sm mb-4">
            ⚠️ Save these codes now. They will not be shown again.
          </p>
          <div className="grid grid-cols-2 gap-2 mb-4">
            {newCodes.map((code, index) => (
              <div key={index} className="bg-white p-2 rounded text-center font-mono text-sm">
                {code}
              </div>
            ))}
          </div>
          <button
            onClick={() => setNewCodes([])}
            className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700"
          >
            I've Saved My Codes
          </button>
        </div>
      ) : (
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:bg-gray-400"
        >
          {loading ? 'Generating...' : 'Generate New Backup Codes'}
        </button>
      )}

      {error && <p className="text-red-600 text-sm mt-4">{error}</p>}
    </div>
  );
};
