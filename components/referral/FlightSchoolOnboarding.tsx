import React, { useState } from 'react';
import { supabase } from '../../shared/lib/supabase';
import { Upload, Check, ArrowRight, ArrowLeft } from 'lucide-react';

interface FlightSchoolOnboardingProps {
  onComplete?: (flightSchoolId: string) => void;
}

interface FormData {
  // Step 1: School Information
  name: string;
  website: string;
  description: string;
  
  // Step 2: Contact Information
  contact_name: string;
  contact_email: string;
  contact_phone: string;
  
  // Step 3: Address
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  
  // Step 4: School Details
  icao_code: string;
  faa_certificate_number: string;
  school_type: 'part_141' | 'part_61' | 'both';
  
  // Step 5: Payment Information
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

export const FlightSchoolOnboarding: React.FC<FlightSchoolOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [flightSchoolId, setFlightSchoolId] = useState<string | null>(null);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<FormData>({
    name: '',
    website: '',
    description: '',
    contact_name: '',
    contact_email: '',
    contact_phone: '',
    address: '',
    city: '',
    state: '',
    country: 'USA',
    postal_code: '',
    icao_code: '',
    faa_certificate_number: '',
    school_type: 'part_141',
    payout_method: 'bank_transfer',
    payout_details: {}
  });

  const totalSteps = 5;

  const handleInputChange = (field: keyof FormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handlePayoutDetailChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      payout_details: { ...prev.payout_details, [field]: value }
    }));
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setLogoFile(file);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!(formData.name && formData.website);
      case 2:
        return !!(formData.contact_name && formData.contact_email);
      case 3:
        return !!(formData.city && formData.state);
      case 4:
        return !!(formData.school_type);
      case 5:
        return !!(formData.payout_method);
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => Math.min(prev + 1, totalSteps));
    } else {
      setError('Please fill in all required fields');
    }
  };

  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
    setError(null);
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      setError(null);

      // Upload logo if provided
      let logoUrl = formData.logo_url;
      if (logoFile) {
        const fileExt = logoFile.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `flight-school-logos/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('profile-pics')
          .upload(filePath, logoFile);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('profile-pics')
          .getPublicUrl(filePath);

        logoUrl = publicUrl;
      }

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) throw new Error('User not authenticated');

      // Generate unique referral code and slug
      const referralCode = await generateReferralCode();
      const slug = await generateSlug(formData.name);

      // Create flight school
      const { data: flightSchool, error: schoolError } = await supabase
        .from('flight_schools')
        .insert({
          name: formData.name,
          slug,
          website: formData.website,
          logo_url: logoUrl,
          description: formData.description,
          contact_name: formData.contact_name,
          contact_email: formData.contact_email,
          contact_phone: formData.contact_phone,
          address: formData.address,
          city: formData.city,
          state: formData.state,
          country: formData.country,
          postal_code: formData.postal_code,
          icao_code: formData.icao_code,
          faa_certificate_number: formData.faa_certificate_number,
          school_type: formData.school_type,
          referral_code: referralCode,
          commission_rate: 20.00,
          payout_method: formData.payout_method,
          payout_details: formData.payout_details,
          is_active: true,
          onboarding_completed: true
        })
        .select()
        .single();

      if (schoolError) throw schoolError;

      // Add user as flight school admin (owner)
      const { error: adminError } = await supabase
        .from('flight_school_admins')
        .insert({
          flight_school_id: flightSchool.id,
          user_id: user.id,
          role: 'owner'
        });

      if (adminError) throw adminError;

      setFlightSchoolId(flightSchool.id);
      setSuccess(true);
      onComplete?.(flightSchool.id);

    } catch (err) {
      console.error('Error creating flight school:', err);
      setError(err instanceof Error ? err.message : 'Failed to create flight school');
    } finally {
      setLoading(false);
    }
  };

  const generateReferralCode = async (): Promise<string> => {
    // This would typically call the Edge Function, but for now we'll generate client-side
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    return code;
  };

  const generateSlug = async (name: string): Promise<string> => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  if (success) {
    return (
      <div className="max-w-2xl mx-auto p-8 bg-white rounded-lg shadow">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <Check className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Flight School Created Successfully!
          </h2>
          <p className="text-gray-600 mb-6">
            Your flight school has been registered and is ready to start receiving referrals.
          </p>
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600 mb-2">Your Referral Code:</p>
            <p className="text-2xl font-bold text-blue-600">
              {formData.name.substring(0, 6).toUpperCase()}
            </p>
          </div>
          <button
            onClick={() => window.location.href = `/flight-school/${flightSchoolId}`}
            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-lg shadow">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Flight School Onboarding
        </h1>
        <p className="text-gray-600">
          Step {currentStep} of {totalSteps}
        </p>
        <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(currentStep / totalSteps) * 100}%` }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
          {error}
        </div>
      )}

      {renderStep()}

      <div className="flex justify-between mt-8">
        <button
          onClick={handleBack}
          disabled={currentStep === 1}
          className="flex items-center px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back
        </button>

        {currentStep === totalSteps ? (
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Creating...' : 'Complete Setup'}
            <Check className="w-5 h-5 ml-2" />
          </button>
        ) : (
          <button
            onClick={handleNext}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Next
            <ArrowRight className="w-5 h-5 ml-2" />
          </button>
        )}
      </div>
    </div>
  );

  function renderStep() {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">School Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., SkyHigh Aviation Academy"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Website *
              </label>
              <input
                type="url"
                value={formData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="https://www.yourschool.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Tell us about your flight school..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Logo
              </label>
              <div className="flex items-center space-x-4">
                <label className="flex items-center px-4 py-2 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <Upload className="w-5 h-5 mr-2" />
                  Upload Logo
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoUpload}
                    className="hidden"
                  />
                </label>
                {logoFile && <span className="text-sm text-gray-600">{logoFile.name}</span>}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Contact Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Name *
              </label>
              <input
                type="text"
                value={formData.contact_name}
                onChange={(e) => handleInputChange('contact_name', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="John Smith"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Email *
              </label>
              <input
                type="email"
                value={formData.contact_email}
                onChange={(e) => handleInputChange('contact_email', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="john@yourschool.com"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contact Phone
              </label>
              <input
                type="tel"
                value={formData.contact_phone}
                onChange={(e) => handleInputChange('contact_phone', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="+1 (555) 123-4567"
              />
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Address</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Street Address
              </label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => handleInputChange('address', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="123 Aviation Way"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City *
                </label>
                <input
                  type="text"
                  value={formData.city}
                  onChange={(e) => handleInputChange('city', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Denver"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  State *
                </label>
                <input
                  type="text"
                  value={formData.state}
                  onChange={(e) => handleInputChange('state', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="CO"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Country
                </label>
                <input
                  type="text"
                  value={formData.country}
                  onChange={(e) => handleInputChange('country', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Postal Code
                </label>
                <input
                  type="text"
                  value={formData.postal_code}
                  onChange={(e) => handleInputChange('postal_code', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="80201"
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">School Details</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ICAO Code
              </label>
              <input
                type="text"
                value={formData.icao_code}
                onChange={(e) => handleInputChange('icao_code', e.target.value.toUpperCase())}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="KDEN"
                maxLength={4}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                FAA Certificate Number
              </label>
              <input
                type="text"
                value={formData.faa_certificate_number}
                onChange={(e) => handleInputChange('faa_certificate_number', e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="XXXX1234"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                School Type *
              </label>
              <select
                value={formData.school_type}
                onChange={(e) => handleInputChange('school_type', e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="part_141">Part 141</option>
                <option value="part_61">Part 61</option>
                <option value="both">Both Part 141 and Part 61</option>
              </select>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <h2 className="text-xl font-semibold text-gray-900">Payment Information</h2>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Payout Method *
              </label>
              <select
                value={formData.payout_method}
                onChange={(e) => handleInputChange('payout_method', e.target.value as any)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="bank_transfer">Bank Transfer</option>
                <option value="check">Check</option>
                <option value="paypal">PayPal</option>
                <option value="stripe">Stripe</option>
              </select>
            </div>

            {formData.payout_method === 'bank_transfer' && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bank Name
                  </label>
                  <input
                    type="text"
                    value={formData.payout_details.bank_name || ''}
                    onChange={(e) => handlePayoutDetailChange('bank_name', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Account Number
                  </label>
                  <input
                    type="text"
                    value={formData.payout_details.account_number || ''}
                    onChange={(e) => handlePayoutDetailChange('account_number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Routing Number
                  </label>
                  <input
                    type="text"
                    value={formData.payout_details.routing_number || ''}
                    onChange={(e) => handlePayoutDetailChange('routing_number', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>
            )}

            {formData.payout_method === 'paypal' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  PayPal Email
                </label>
                <input
                  type="email"
                  value={formData.payout_details.paypal_email || ''}
                  onChange={(e) => handlePayoutDetailChange('paypal_email', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            {formData.payout_method === 'stripe' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Stripe Account ID
                </label>
                <input
                  type="text"
                  value={formData.payout_details.stripe_account_id || ''}
                  onChange={(e) => handlePayoutDetailChange('stripe_account_id', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            )}

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Commission Structure</h3>
              <p className="text-sm text-blue-700">
                You will earn <span className="font-bold">$20.00</span> for each pilot who completes the program through your referral link.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  }
};
