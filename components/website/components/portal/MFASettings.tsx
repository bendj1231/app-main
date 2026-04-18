import React, { useState, useEffect } from 'react';
import { Shield, Lock, Key, AlertTriangle, CheckCircle2, X, RefreshCw } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/components/ui/toast';
import { MFASetup } from './MFASetup';
import { MFADisable } from './MFADisable';
import { MFABackupCodes } from './MFABackupCodes';

export const MFASettings: React.FC = () => {
  const { mfaEnabled, mfaCheckStatus } = useAuth();
  const { addToast } = useToast();
  const [loading, setLoading] = useState(true);
  const [showSetup, setShowSetup] = useState(false);
  const [showDisable, setShowDisable] = useState(false);
  const [showBackupCodes, setShowBackupCodes] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'backup'>('overview');

  useEffect(() => {
    const checkMFAStatus = async () => {
      try {
        await mfaCheckStatus();
      } catch (err) {
        console.error('Failed to check MFA status:', err);
      } finally {
        setLoading(false);
      }
    };
    checkMFAStatus();
  }, [mfaCheckStatus]);

  const handleMFASetupComplete = () => {
    setShowSetup(false);
    addToast('success', 'MFA Enabled', 'Two-factor authentication has been enabled successfully.');
    mfaCheckStatus();
  };

  const handleMFADisableComplete = () => {
    setShowDisable(false);
    addToast('success', 'MFA Disabled', 'Two-factor authentication has been disabled.');
    mfaCheckStatus();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900"></div>
      </div>
    );
  }

  if (showSetup) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full">
        <button
          onClick={() => setShowSetup(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        <MFASetup />
      </div>
    );
  }

  if (showDisable) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
        <button
          onClick={() => setShowDisable(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        <MFADisable />
      </div>
    );
  }

  if (showBackupCodes) {
    return (
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full relative">
        <button
          onClick={() => setShowBackupCodes(false)}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
        >
          <X size={20} />
        </button>
        <MFABackupCodes />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Shield className="text-slate-900" size={24} />
          <h2 className="text-2xl font-bold text-slate-900">Two-Factor Authentication</h2>
        </div>
        {mfaEnabled && (
          <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full text-sm font-medium">
            <CheckCircle2 size={16} />
            Enabled
          </div>
        )}
      </div>

      {!mfaEnabled ? (
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8">
          <div className="flex items-start gap-4 mb-6">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Lock className="text-blue-600" size={24} />
            </div>
            <div className="flex-1">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Enable 2FA for Enhanced Security</h3>
              <p className="text-slate-600 text-sm mb-4">
                Add an extra layer of security to your account by requiring a code from your authenticator app when you sign in.
              </p>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Protects against unauthorized access
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Works with Google Authenticator, Authy, and other apps
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 size={16} className="text-emerald-500" />
                  Backup codes available for account recovery
                </li>
              </ul>
            </div>
          </div>
          <button
            onClick={() => setShowSetup(true)}
            className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-xl hover:bg-blue-700 transition-all flex items-center justify-center gap-2"
          >
            <Shield size={20} />
            Enable Two-Factor Authentication
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* MFA Status Card */}
          <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <CheckCircle2 className="text-emerald-600" size={24} />
              <h3 className="text-lg font-semibold text-emerald-900">2FA is Enabled</h3>
            </div>
            <p className="text-emerald-800 text-sm mb-4">
              Your account is protected with two-factor authentication. You'll need to enter a code from your authenticator app when signing in.
            </p>
            <button
              onClick={() => setShowDisable(true)}
              className="px-4 py-2 bg-emerald-100 text-emerald-700 font-medium rounded-lg hover:bg-emerald-200 transition-all text-sm"
            >
              Disable 2FA
            </button>
          </div>

          {/* Tabs */}
          <div className="border-b border-slate-200">
            <div className="flex gap-8">
              <button
                onClick={() => setActiveTab('overview')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'overview'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Overview
              </button>
              <button
                onClick={() => setActiveTab('backup')}
                className={`pb-4 text-sm font-medium transition-colors ${
                  activeTab === 'backup'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                Backup Codes
              </button>
            </div>
          </div>

          {/* Tab Content */}
          {activeTab === 'overview' ? (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-6">
                <h4 className="font-semibold text-slate-900 mb-3">How 2FA Works</h4>
                <div className="space-y-3 text-sm text-slate-600">
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <p>Enter your email and password as usual</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <p>Enter the 6-digit code from your authenticator app</p>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-bold text-xs flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <p>Access your account securely</p>
                  </div>
                </div>
              </div>

              <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="text-yellow-600 flex-shrink-0" size={20} />
                  <div>
                    <h4 className="font-semibold text-yellow-900 mb-1">Important</h4>
                    <p className="text-sm text-yellow-800">
                      Keep your backup codes in a secure location. If you lose access to your authenticator device, you'll need these codes to recover your account.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="bg-slate-50 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Key className="text-slate-600" size={20} />
                  <h4 className="font-semibold text-slate-900">Backup Codes</h4>
                </div>
                <p className="text-sm text-slate-600 mb-4">
                  Backup codes can be used to access your account if you lose your authenticator device. Each code can only be used once.
                </p>
                <button
                  onClick={() => setShowBackupCodes(true)}
                  className="w-full px-4 py-3 bg-slate-900 text-white font-medium rounded-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
                >
                  <RefreshCw size={18} />
                  Generate New Backup Codes
                </button>
                <p className="text-xs text-slate-500 mt-2">
                  Note: Generating new codes will invalidate all existing codes.
                </p>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
