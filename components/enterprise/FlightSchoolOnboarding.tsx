import React, { useState } from 'react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';
import { Upload, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface Props {
  onComplete?: () => void;
}

interface FormData {
  name: string;
  website: string;
  description: string;
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  icao_code: string;
  faa_certificate_number: string;
  school_type: 'part_141' | 'part_61' | 'both';
  payout_method: 'bank_transfer' | 'check' | 'paypal' | 'stripe';
  payout_details: {
    bank_name?: string;
    account_number?: string;
    routing_number?: string;
    paypal_email?: string;
    stripe_account_id?: string;
  };
  logo_url?: string;
}

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dridtecu6/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'enterprise_unsigned';

export const FlightSchoolOnboarding: React.FC<Props> = ({ onComplete }) => {
  const { account, callApi } = useEnterprisePortal();
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '', website: '', description: '',
    contact_name: '', contact_email: '', contact_phone: '',
    address: '', city: '', state: '', country: 'USA', postal_code: '',
    icao_code: '', faa_certificate_number: '', school_type: 'part_141',
    payout_method: 'bank_transfer', payout_details: {}
  });

  const totalSteps = 5;

  const handleInput = (field: keyof FormData, value: any) =>
    setFormData(prev => ({ ...prev, [field]: value }));

  const handlePayout = (field: string, value: string) =>
    setFormData(prev => ({ ...prev, payout_details: { ...prev.payout_details, [field]: value } }));

  const validate = (step: number): boolean => {
    switch (step) {
      case 1: return !!(formData.name && formData.website);
      case 2: return !!(formData.contact_name && formData.contact_email);
      case 3: return !!(formData.city && formData.state);
      case 4: return !!formData.school_type;
      case 5: return !!formData.payout_method;
      default: return false;
    }
  };

  const uploadLogo = async (): Promise<string | undefined> => {
    if (!logoFile) return undefined;
    const fd = new FormData();
    fd.append('file', logoFile);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!account?.id) { setError('Enterprise account not loaded'); return; }
    try {
      setLoading(true);
      setError(null);
      const logoUrl = await uploadLogo();
      const referralCode = `FS${Math.random().toString(36).substring(2, 8).toUpperCase()}`;

      await callApi('createFlightSchool', {
        enterprise_id: account.id,
        name: formData.name,
        website: formData.website,
        contact_email: formData.contact_email,
        contact_phone: formData.contact_phone,
        country: formData.country,
        payout_method: formData.payout_method,
        commission_rate: 20,
        referral_code: referralCode,
        logo_url: logoUrl
      });

      setSuccess(true);
      onComplete?.();
    } catch (err: any) {
      setError(err?.message || 'Failed to create flight school');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-slate-800 rounded-2xl border border-slate-700">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-4">
            <Check className="h-8 w-8 text-emerald-400" />
          </div>
          <h2 className="text-2xl font-bold text-white mb-2">Flight School Registered!</h2>
          <p className="text-slate-400 mb-6">Your ATO profile is live. Start inviting pilots via your referral link.</p>
          <button onClick={onComplete} className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 px-4 rounded-xl font-semibold transition">
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-slate-800 rounded-2xl border border-slate-700">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-white mb-2">ATO Onboarding</h1>
        <p className="text-slate-400">Step {currentStep} of {totalSteps}</p>
        <div className="mt-4 w-full bg-slate-700 rounded-full h-2">
          <div className="bg-emerald-500 h-2 rounded-full transition-all duration-300" style={{ width: `${(currentStep / totalSteps) * 100}%` }} />
        </div>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6">{error}</div>}

      {renderStep()}

      <div className="flex justify-between mt-8">
        <button onClick={() => { setCurrentStep(s => Math.max(s - 1, 1)); setError(null); }} disabled={currentStep === 1}
          className="flex items-center px-6 py-3 border border-slate-600 rounded-xl text-slate-300 hover:bg-slate-700 disabled:opacity-50">
          <ArrowLeft className="w-5 h-5 mr-2" /> Back
        </button>
        {currentStep === totalSteps ? (
          <button onClick={handleSubmit} disabled={loading || !validate(currentStep)}
            className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl font-semibold">
            {loading ? 'Creating...' : 'Complete Setup'} <Check className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button onClick={() => validate(currentStep) ? setCurrentStep(s => Math.min(s + 1, totalSteps)) : setError('Please fill in all required fields')}
            className="flex items-center px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-semibold">
            Next <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case 1: return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">School Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">School Name *</label>
            <input type="text" value={formData.name} onChange={e => handleInput('name', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="e.g., SkyHigh Aviation Academy" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Website *</label>
            <input type="url" value={formData.website} onChange={e => handleInput('website', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="https://www.yourschool.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
            <textarea value={formData.description} onChange={e => handleInput('description', e.target.value)} rows={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Tell us about your flight school..." />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">School Logo</label>
            <label className="flex items-center px-4 py-2 border border-slate-600 rounded-lg cursor-pointer hover:bg-slate-700 text-slate-300 w-fit">
              <Upload className="w-5 h-5 mr-2" /> Upload Logo
              <input type="file" accept="image/*" onChange={e => setLogoFile(e.target.files?.[0] || null)} className="hidden" />
            </label>
            {logoFile && <span className="text-sm text-slate-400 mt-2 block">{logoFile.name}</span>}
          </div>
        </div>
      );
      case 2: return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Contact Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Name *</label>
            <input type="text" value={formData.contact_name} onChange={e => handleInput('contact_name', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="John Smith" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Email *</label>
            <input type="email" value={formData.contact_email} onChange={e => handleInput('contact_email', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="john@yourschool.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Contact Phone</label>
            <input type="tel" value={formData.contact_phone} onChange={e => handleInput('contact_phone', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="+1 (555) 123-4567" />
          </div>
        </div>
      );
      case 3: return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Address</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Street Address</label>
            <input type="text" value={formData.address} onChange={e => handleInput('address', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="123 Aviation Way" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">City *</label>
              <input type="text" value={formData.city} onChange={e => handleInput('city', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="Denver" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">State *</label>
              <input type="text" value={formData.state} onChange={e => handleInput('state', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="CO" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Country</label>
              <input type="text" value={formData.country} onChange={e => handleInput('country', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Postal Code</label>
              <input type="text" value={formData.postal_code} onChange={e => handleInput('postal_code', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="80201" />
            </div>
          </div>
        </div>
      );
      case 4: return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">School Details</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">ICAO Code</label>
            <input type="text" value={formData.icao_code} onChange={e => handleInput('icao_code', e.target.value.toUpperCase())} maxLength={4}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="KDEN" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">FAA Certificate Number</label>
            <input type="text" value={formData.faa_certificate_number} onChange={e => handleInput('faa_certificate_number', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" placeholder="XXXX1234" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">School Type *</label>
            <select value={formData.school_type} onChange={e => handleInput('school_type', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="part_141">Part 141</option>
              <option value="part_61">Part 61</option>
              <option value="both">Both Part 141 and Part 61</option>
            </select>
          </div>
        </div>
      );
      case 5: return (
        <div className="space-y-6">
          <h2 className="text-xl font-semibold text-white">Payment Information</h2>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Payout Method *</label>
            <select value={formData.payout_method} onChange={e => handleInput('payout_method', e.target.value)}
              className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent">
              <option value="bank_transfer">Bank Transfer</option>
              <option value="check">Check</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          {formData.payout_method === 'bank_transfer' && (
            <div className="space-y-4">
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Bank Name</label>
                <input type="text" value={formData.payout_details.bank_name || ''} onChange={e => handlePayout('bank_name', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Account Number</label>
                <input type="text" value={formData.payout_details.account_number || ''} onChange={e => handlePayout('account_number', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
              <div><label className="block text-sm font-medium text-slate-300 mb-2">Routing Number</label>
                <input type="text" value={formData.payout_details.routing_number || ''} onChange={e => handlePayout('routing_number', e.target.value)}
                  className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
            </div>
          )}
          {formData.payout_method === 'paypal' && (
            <div><label className="block text-sm font-medium text-slate-300 mb-2">PayPal Email</label>
              <input type="email" value={formData.payout_details.paypal_email || ''} onChange={e => handlePayout('paypal_email', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
          )}
          {formData.payout_method === 'stripe' && (
            <div><label className="block text-sm font-medium text-slate-300 mb-2">Stripe Account ID</label>
              <input type="text" value={formData.payout_details.stripe_account_id || ''} onChange={e => handlePayout('stripe_account_id', e.target.value)}
                className="w-full px-4 py-2 bg-slate-900 border border-slate-600 rounded-lg text-white focus:ring-2 focus:ring-emerald-500 focus:border-transparent" /></div>
          )}
          <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-xl p-4">
            <h3 className="font-semibold text-emerald-400 mb-2">Commission Structure</h3>
            <p className="text-sm text-emerald-300">You will earn <span className="font-bold">$20.00</span> for each pilot who completes the program through your referral link.</p>
          </div>
        </div>
      );
      default: return null;
    }
  }
};

export default FlightSchoolOnboarding;
