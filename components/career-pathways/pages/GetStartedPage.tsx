import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User, Mail, Lock, ArrowRight, CheckCircle2, Plane } from 'lucide-react';

interface GetStartedPageProps {
  onNavigate?: (path: string) => void;
  onLogin?: () => void;
}

export const GetStartedPage: React.FC<GetStartedPageProps> = ({ onNavigate, onLogin }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    licenseType: '',
    totalHours: ''
  });

  const handleNavigate = (path: string) => {
    if (onNavigate) {
      onNavigate(path);
    } else {
      navigate(path);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      // Complete signup
      localStorage.setItem('auth_token', 'demo_token');
      localStorage.setItem('user_name', `${formData.firstName} ${formData.lastName}`);
      handleNavigate('/dashboard');
    }
  };

  const steps = [
    { title: 'Profile', desc: 'Basic information' },
    { title: 'Experience', desc: 'Your background' },
    { title: 'Goals', desc: 'Career targets' },
  ];

  return (
    <div className="min-h-screen bg-slate-950 py-12">
      <div className="max-w-xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => handleNavigate('/')}
            className="p-2 hover:bg-slate-800 rounded-lg transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-slate-400" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white">Get Started</h1>
            <p className="text-slate-400 text-sm">Create your CareerPathways account</p>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex items-center justify-between mb-8">
          {steps.map((s, idx) => (
            <div key={idx} className="flex items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                idx + 1 <= step 
                  ? 'bg-gradient-to-br from-indigo-500 to-violet-600 text-white' 
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {idx + 1 < step ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
              </div>
              {idx < 2 && (
                <div className={`w-12 h-0.5 mx-2 ${
                  idx + 1 < step ? 'bg-indigo-500' : 'bg-slate-800'
                }`} />
              )}
            </div>
          ))}
        </div>

        {/* Form */}
        <div className="bg-slate-900/50 border border-slate-800 rounded-2xl p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            {step === 1 && (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">First Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.firstName}
                        onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        placeholder="John"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm text-slate-400 mb-2">Last Name</label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                      <input
                        type="text"
                        value={formData.lastName}
                        onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                        className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                        placeholder="Doe"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="john@example.com"
                      required
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="password"
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="Create a password"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">License Type</label>
                  <select
                    value={formData.licenseType}
                    onChange={(e) => setFormData({...formData, licenseType: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:border-indigo-500"
                    required
                  >
                    <option value="">Select your license</option>
                    <option value="ppl">Private Pilot License (PPL)</option>
                    <option value="cpl">Commercial Pilot License (CPL)</option>
                    <option value="atpl">Airline Transport Pilot License (ATPL)</option>
                    <option value="student">Student Pilot</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm text-slate-400 mb-2">Total Flight Hours</label>
                  <div className="relative">
                    <Plane className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input
                      type="number"
                      value={formData.totalHours}
                      onChange={(e) => setFormData({...formData, totalHours: e.target.value})}
                      className="w-full pl-10 pr-4 py-3 bg-slate-800 border border-slate-700 rounded-lg text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                      placeholder="e.g. 1500"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            {step === 3 && (
              <div className="text-center py-8">
                <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mx-auto mb-4">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">Ready to launch!</h3>
                <p className="text-slate-400">Complete your registration to access your personalized career pathways.</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 bg-gradient-to-r from-indigo-500 to-violet-600 hover:from-indigo-600 hover:to-violet-700 rounded-xl text-white font-semibold transition-all"
            >
              {step === 3 ? 'Complete Registration' : 'Continue'}
              <ArrowRight className="w-5 h-5" />
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
              Already have an account?{' '}
              <button 
                onClick={onLogin}
                className="text-indigo-400 hover:text-indigo-300"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStartedPage;
