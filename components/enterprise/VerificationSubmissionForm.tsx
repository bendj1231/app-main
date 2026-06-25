import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  FileText, Upload, CheckCircle, AlertTriangle,
  Zap, ArrowRight, Mail, User, Plane
} from 'lucide-react';
import { useEnterprisePortal } from './hooks/useEnterprisePortal';

interface Props {
  onSubmitted?: () => void;
}

const CLOUDINARY_UPLOAD_URL = 'https://api.cloudinary.com/v1_1/dridtecu6/image/upload';
const CLOUDINARY_UPLOAD_PRESET = 'enterprise_unsigned';

export function VerificationSubmissionForm({ onSubmitted }: Props) {
  const { account, callApi } = useEnterprisePortal();
  const [step, setStep] = useState<'form' | 'upload' | 'confirm' | 'success'>('form');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [pilotEmail, setPilotEmail] = useState('');
  const [pilotName, setPilotName] = useState('');
  const [docType, setDocType] = useState<'license' | 'medical' | 'radio' | 'elp' | 'logbook' | 'background_check'>('license');
  const [metadata, setMetadata] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [documentUrl, setDocumentUrl] = useState('');

  const uploadDoc = async (): Promise<string> => {
    if (!file) return documentUrl;
    const fd = new FormData();
    fd.append('file', file);
    fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    const res = await fetch(CLOUDINARY_UPLOAD_URL, { method: 'POST', body: fd });
    const data = await res.json();
    return data.secure_url;
  };

  const handleSubmit = async () => {
    if (!account?.id) { setError('Enterprise account not loaded'); return; }
    if (!pilotEmail || !docType) { setError('Pilot email and document type are required'); return; }

    try {
      setLoading(true);
      setError(null);

      // Upload document
      const url = await uploadDoc();

      // Create verification submission (does not burn yet — burn happens on admin review)
      await callApi('createVerification', {
        enterprise_id: account.id,
        pilot_email: pilotEmail,
        pilot_name: pilotName || undefined,
        document_type: docType,
        document_url: url || undefined,
        metadata: metadata ? JSON.stringify({ notes: metadata }) : undefined,
      });

      setStep('success');
      onSubmitted?.();
    } catch (e: any) {
      setError(e?.message || 'Submission failed');
    } finally {
      setLoading(false);
    }
  };

  if (step === 'success') {
    return (
      <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="max-w-xl mx-auto text-center p-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-emerald-500/20 mb-4">
          <CheckCircle className="h-8 w-8 text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-white mb-2">Submission Sent!</h2>
        <p className="text-slate-400 mb-6">Your verification request is in the admin queue. You'll be notified once it's reviewed. 1 credit will be burned on approval.</p>
        <button onClick={() => { setStep('form'); setPilotEmail(''); setPilotName(''); setDocType('license'); setMetadata(''); setFile(null); setDocumentUrl(''); }}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-semibold">
          Submit Another
        </button>
      </motion.div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileText className="w-6 h-6 text-amber-400" />
          Request Pilot Verification
        </h2>
        <p className="text-slate-400 text-sm mt-1">Submit a pilot document for verification. 1 credit will be burned when the admin approves.</p>
      </div>

      {error && (
        <div className="bg-red-500/10 border border-red-500/30 text-red-400 px-4 py-3 rounded-xl mb-6 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
        </div>
      )}

      <div className="space-y-6">
        {/* Pilot info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pilot Email *</label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="email" value={pilotEmail} onChange={e => setPilotEmail(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30"
                placeholder="pilot@example.com" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-2">Pilot Name</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
              <input type="text" value={pilotName} onChange={e => setPilotName(e.target.value)}
                className="w-full bg-slate-900 border border-slate-700 rounded-xl pl-10 pr-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30"
                placeholder="John Smith" />
            </div>
          </div>
        </div>

        {/* Document type */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Document Type *</label>
          <div className="grid grid-cols-3 gap-2">
            {(['license', 'medical', 'radio', 'elp', 'logbook', 'background_check'] as const).map(t => (
              <button key={t} onClick={() => setDocType(t)}
                className={`px-3 py-2 rounded-xl text-sm font-medium transition border ${docType === t ? 'bg-amber-600 text-white border-amber-500' : 'bg-slate-800 text-slate-400 border-slate-700 hover:text-white'}`}>
                {t === 'elp' ? 'ELP' : t.replace('_', ' ').replace(/^\w/, c => c.toUpperCase())}
              </button>
            ))}
          </div>
        </div>

        {/* Document upload */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Document Upload</label>
          <label className="flex flex-col items-center justify-center w-full h-32 bg-slate-800 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-700/50 transition">
            <div className="flex flex-col items-center justify-center pt-5 pb-6">
              <Upload className="w-8 h-8 text-slate-500 mb-2" />
              <p className="text-sm text-slate-400">{file ? file.name : 'Click to upload document'}</p>
            </div>
            <input type="file" className="hidden" onChange={e => setFile(e.target.files?.[0] || null)} />
          </label>
        </div>

        {/* Or paste URL */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Or Document URL</label>
          <input type="url" value={documentUrl} onChange={e => setDocumentUrl(e.target.value)}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30"
            placeholder="https://..." />
        </div>

        {/* Notes */}
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-2">Additional Notes</label>
          <textarea value={metadata} onChange={e => setMetadata(e.target.value)} rows={3}
            className="w-full bg-slate-900 border border-slate-700 rounded-xl px-4 py-2 text-white placeholder-slate-500 focus:ring-2 focus:ring-amber-500/30"
            placeholder="License number, ICAO code, expiry date, etc." />
        </div>

        {/* Credit warning */}
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 flex items-start gap-3">
          <Zap className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-300 text-sm font-medium">1 Credit Will Be Burned</p>
            <p className="text-amber-400/70 text-xs">When the admin approves this verification, $1.00 will be deducted from your enterprise credit balance.</p>
          </div>
        </div>

        <button onClick={handleSubmit} disabled={loading}
          className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition">
          {loading ? 'Submitting...' : 'Submit for Verification'}
          <ArrowRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default VerificationSubmissionForm;
