import React, { useState } from 'react';
import { User, Lock, ArrowRight, AlertCircle, Mail, Shield } from 'lucide-react';
import { useAuth } from '@/src/contexts/AuthContext';
import { useToast } from '@/src/components/ui/toast';
import { MFAVerify } from './website/components/portal/MFAVerify';

interface LoginScreenProps {
  onLogin: (username: string) => void;
  onNavigate: (page: string) => void;
  logoUrl: string;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ onLogin, onNavigate, logoUrl }) => {
  const [wmUser, setWmUser] = useState('');
  const [wmPass, setWmPass] = useState('');

  const { login, resetPassword, mfaEnabled, mfaCheckStatus } = useAuth();
  const { addToast } = useToast();
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [showMFAVerify, setShowMFAVerify] = useState(false);
  const [mfaPendingUser, setMfaPendingUser] = useState('');

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resetEmail) return;

    setIsLoading(true);
    setError('');

    try {
      await resetPassword(resetEmail);
      addToast('success', 'Password reset email sent!', 'Please check your inbox for the reset link.');
      setTimeout(() => {
        setShowResetModal(false);
        setResetEmail('');
      }, 3000);
    } catch (err: any) {
      console.error("Reset Password Error:", err);
      setError(err.message || 'Failed to send reset email.');
      addToast('error', 'Reset Failed', err.message || 'Failed to send reset email.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      console.log("Attempting login with:", wmUser);

      // Create a timeout promise that rejects after 15 seconds
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Login timed out. Please check your connection.')), 15000)
      );

      // Race the login against the timeout
      await Promise.race([
        login(wmUser, wmPass),
        timeoutPromise
      ]);

      console.log("Login successful, checking MFA status...");
      
      // Check if MFA is enabled for this user
      const isMFAEnabled = await mfaCheckStatus();
      
      if (isMFAEnabled) {
        console.log("MFA enabled, showing verification modal");
        setMfaPendingUser(wmUser);
        setShowMFAVerify(true);
        setIsLoading(false);
      } else {
        console.log("MFA not enabled, proceeding to login");
        addToast('success', 'Login Successful', 'Welcome back to PilotRecognition!');
        onLogin(wmUser);
        setIsLoading(false);
      }
    } catch (err: any) {
      console.error("Login Error in Component:", err);
      let errorMessage = 'Failed to log in. Please check your credentials.';
      if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email or user not found.';
      } else if (err.code === 'auth/wrong-password') {
        errorMessage = 'Incorrect password.';
      } else if (err.code === 'auth/invalid-credential') {
        errorMessage = 'Invalid credentials provided.';
      } else if (err.message) {
        errorMessage = err.message;
      }
      setError(errorMessage);
      addToast('error', 'Login Failed', errorMessage);
      setIsLoading(false);
    }
  };

  const handleMFAVerified = () => {
    setShowMFAVerify(false);
    addToast('success', 'Login Successful', 'Welcome back to PilotRecognition!');
    onLogin(mfaPendingUser);
    setMfaPendingUser('');
  };

  const handleMFACancel = () => {
    setShowMFAVerify(false);
    setMfaPendingUser('');
    setError('MFA verification cancelled. Please login again.');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      {/* MFA Verification Modal */}
      {showMFAVerify && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fadeIn relative">
            <button
              onClick={handleMFACancel}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <div className="flex items-center gap-3 mb-4">
              <Shield className="text-sky-600" size={24} />
              <h3 className="text-xl font-bold text-slate-800">Two-Factor Authentication</h3>
            </div>
            
            <MFAVerify onSuccess={handleMFAVerified} />
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showResetModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full animate-fadeIn relative">
            <button
              onClick={() => setShowResetModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-slate-800 mb-2">Reset Password</h3>
            <p className="text-slate-500 mb-6">Enter your email address and we'll send you a link to reset your password.</p>

            <form onSubmit={handlePasswordReset} className="space-y-4">
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input
                  type="email"
                  placeholder="Email Address"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
                  required
                />
              </div>

              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-slate-900 text-white font-bold py-3 rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[600px]">
        {/* Left Side: Branding */}
        <div className="md:w-5/12 bg-slate-900 p-12 text-white flex flex-col justify-center items-center relative overflow-hidden text-center">
          <div className="absolute inset-0 z-0">
            <div className="absolute -right-10 -top-10 w-80 h-80 bg-sky-500/20 rounded-full blur-3xl"></div>
            <div className="absolute -left-10 -bottom-10 w-80 h-80 bg-emerald-500/20 rounded-full blur-3xl"></div>
          </div>
          <div className="relative z-10 flex flex-col items-center">
            <img src={logoUrl} alt="PilotRecognition" className="h-40 w-auto mb-8 object-contain" />
            <h2 className="text-3xl font-bold mb-4">PilotRecognition Program Portal</h2>
            <p className="text-slate-300 leading-relaxed text-lg">
              Sign in to gain access to the Pilot apps & tools, program logbooks & progress tracking, PilotRecognition's Communications Network & groupchats.
            </p>
          </div>
          <div className="absolute bottom-8 left-0 right-0 flex flex-col items-center z-10">
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">System Status</p>
            <div className="flex items-center space-x-2 text-emerald-400">
              <div className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse"></div>
              <span className="text-sm font-medium">Operational</span>
            </div>
          </div>
        </div>

        {/* Right Side: Forms */}
        <div className="md:w-7/12 p-8 md:p-12 flex flex-col justify-center">
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-8">Please enter your credentials to continue.</p>

          <form onSubmit={handleLogin} className="space-y-8">
            <div className="grid grid-cols-1 gap-8">
              {/* PilotRecognition Login */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100 pb-2">
                  PilotRecognition Account
                </h3>
                <div className="space-y-3">
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="text"
                      placeholder="Email Address"
                      value={wmUser}
                      onChange={(e) => setWmUser(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
                      required
                    />
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input
                      type="password"
                      placeholder="Password"
                      value={wmPass}
                      onChange={(e) => setWmPass(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-sky-500 transition-all text-sm"
                      required
                    />
                  </div>
                </div>

                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => setShowResetModal(true)}
                    className="text-sm text-sky-600 hover:text-sky-700 font-medium"
                  >
                    Forgot Password?
                  </button>
                </div>
              </div>
              {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-center gap-2">
                  <AlertCircle size={16} />
                  {error}
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full bg-slate-900 text-white font-bold py-4 rounded-xl hover:bg-slate-800 transition-all transform hover:-translate-y-1 shadow-lg flex items-center justify-center space-x-2"
            >
              <span>{isLoading ? 'Accessing...' : 'Access Platform'}</span>
              <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={() => onNavigate('become-member')}
              className="text-slate-500 hover:text-slate-800 text-sm font-medium transition-colors"
            >
              Not a member? <span className="text-blue-600 font-bold">Create an account</span>
            </button>
          </div>
        </div>
      </div>
      <p className="mt-8 text-slate-400 text-xs">© {new Date().getFullYear()} PilotRecognition Inc. EBT CBTA guidance provided under advisory relationship. Authorized Personnel Only.</p>
    </div>
  );
};

export default LoginScreen;