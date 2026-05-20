import React, { useState, useRef } from 'react';
import { supabase } from '../../../src/lib/supabase';

interface CredentialUploadFormProps {
  onCredentialUploaded: (credentialData: any) => void;
  auth0Id: string;
}

export const CredentialUploadForm: React.FC<CredentialUploadFormProps> = ({
  onCredentialUploaded,
  auth0Id
}) => {
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState('');
  
  // Form fields
  const [licenseNumber, setLicenseNumber] = useState('');
  const [licenseType, setLicenseType] = useState('');
  const [issueDate, setIssueDate] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [issuingAuthority, setIssuingAuthority] = useState('');
  const [medicalClass, setMedicalClass] = useState('');
  const [medicalExpiry, setMedicalExpiry] = useState('');
  const [totalHours, setTotalHours] = useState('');
  
  // File uploads
  const [licenseFile, setLicenseFile] = useState<File | null>(null);
  const [medicalFile, setMedicalFile] = useState<File | null>(null);
  
  const licenseFileRef = useRef<HTMLInputElement>(null);
  const medicalFileRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File, type: 'license' | 'medical') => {
    if (!file) return null;

    const fileExt = file.name.split('.').pop();
    const fileName = `${auth0Id}_${type}_${Date.now()}.${fileExt}`;
    
    const { data, error } = await supabase.storage
      .from('pilot-documents')
      .upload(fileName, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return null;
    }

    return data.path;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError('');

    try {
      // Validate required fields
      if (!licenseNumber || !licenseType || !issueDate || !expiryDate || !issuingAuthority) {
        setError('Please fill in all license fields');
        return;
      }

      if (!licenseFile) {
        setError('Please upload your license document');
        return;
      }

      // Upload files
      setUploadProgress(25);
      const licensePath = await handleFileUpload(licenseFile, 'license');
      if (!licensePath) {
        setError('Failed to upload license document');
        return;
      }

      setUploadProgress(50);
      let medicalPath = null;
      if (medicalFile) {
        medicalPath = await handleFileUpload(medicalFile, 'medical');
        if (!medicalPath) {
          setError('Failed to upload medical document');
          return;
        }
      }

      setUploadProgress(75);

      // Save to database
      const credentialData = {
        auth0_id: auth0Id,
        license_number: licenseNumber,
        license_type: licenseType,
        issue_date: issueDate,
        expiry_date: expiryDate,
        issuing_authority: issuingAuthority,
        medical_class: medicalClass || null,
        medical_expiry: medicalExpiry || null,
        total_hours: totalHours ? parseFloat(totalHours) : null,
        license_file_path: licensePath,
        medical_file_path: medicalPath,
        status: 'pending_verification',
        submitted_at: new Date().toISOString()
      };

      const { error: dbError } = await supabase
        .from('pilot_documents')
        .insert([credentialData]);

      if (dbError) {
        setError('Failed to save credential data');
        return;
      }

      setUploadProgress(100);
      onCredentialUploaded(credentialData);

    } catch (err) {
      console.error('Submission error:', err);
      setError('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-900">Upload Your Credentials</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* License Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Pilot License</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Number *
              </label>
              <input
                type="text"
                value={licenseNumber}
                onChange={(e) => setLicenseNumber(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                License Type *
              </label>
              <select
                value={licenseType}
                onChange={(e) => setLicenseType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">Select license type</option>
                <option value="PPL">Private Pilot License (PPL)</option>
                <option value="CPL">Commercial Pilot License (CPL)</option>
                <option value="ATPL">Airline Transport Pilot License (ATPL)</option>
                <option value="Student">Student Pilot License</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issue Date *
              </label>
              <input
                type="date"
                value={issueDate}
                onChange={(e) => setIssueDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date *
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Issuing Authority *
              </label>
              <input
                type="text"
                value={issuingAuthority}
                onChange={(e) => setIssuingAuthority(e.target.value)}
                placeholder="e.g., CAAP, FAA, EASA"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload License Document *
            </label>
            <input
              ref={licenseFileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setLicenseFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, or PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Medical Information */}
        <div className="border-b pb-6">
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Medical Certificate</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Class
              </label>
              <select
                value={medicalClass}
                onChange={(e) => setMedicalClass(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select medical class</option>
                <option value="Class 1">Class 1</option>
                <option value="Class 2">Class 2</option>
                <option value="Class 3">Class 3</option>
                <option value="BasicMed">BasicMed</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Medical Expiry Date
              </label>
              <input
                type="date"
                value={medicalExpiry}
                onChange={(e) => setMedicalExpiry(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Medical Document
            </label>
            <input
              ref={medicalFileRef}
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              onChange={(e) => setMedicalFile(e.target.files?.[0] || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-xs text-gray-500 mt-1">
              PDF, JPG, or PNG (Max 10MB)
            </p>
          </div>
        </div>

        {/* Flight Hours */}
        <div>
          <h3 className="text-lg font-semibold mb-4 text-gray-800">Flight Experience</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Total Flight Hours
            </label>
            <input
              type="number"
              value={totalHours}
              onChange={(e) => setTotalHours(e.target.value)}
              placeholder="e.g., 1500"
              step="0.1"
              min="0"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {/* Progress Bar */}
        {uploading && (
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => {
              // Reset form
              setLicenseNumber('');
              setLicenseType('');
              setIssueDate('');
              setExpiryDate('');
              setIssuingAuthority('');
              setMedicalClass('');
              setMedicalExpiry('');
              setTotalHours('');
              setLicenseFile(null);
              setMedicalFile(null);
              if (licenseFileRef.current) licenseFileRef.current.value = '';
              if (medicalFileRef.current) medicalFileRef.current.value = '';
            }}
            className="px-6 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            disabled={uploading}
          >
            Clear
          </button>
          
          <button
            type="submit"
            disabled={uploading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading...' : 'Submit for Verification'}
          </button>
        </div>
      </form>
    </div>
  );
};
