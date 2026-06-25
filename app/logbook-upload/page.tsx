import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, Briefcase, BadgeCheck, FileSpreadsheet } from 'lucide-react';

const VAULT_API = 'https://apc-document-vault.benjamintigerbowler.workers.dev';

const fadeUp = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.08, duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function FlightHoursLogbookPage() {
  const navigate = useNavigate();
  const { user: auth0User } = useAuth0();

  const [logbookFile, setLogbookFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [uploadStatus, setUploadStatus] = useState<Record<string, 'idle' | 'uploading' | 'done' | 'error'>>({});
  const [flightHours, setFlightHours] = useState({
    totalHours: '', picHours: '', nightHours: '', instrumentHours: '', crossCountryHours: ''
  });

  const uploadDocument = async (file: File, docType: string, setter: (f: File | null) => void) => {
    const userId = auth0User?.sub;
    if (!userId || !file) return;
    setUploadStatus(prev => ({ ...prev, [docType]: 'uploading' }));
    try {
      const res = await fetch(`${VAULT_API}/upload/${docType}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${userId}`,
          'Content-Type': file.type || 'application/octet-stream',
        },
        body: file,
      });
      if (!res.ok) throw new Error(`Upload failed: ${res.status}`);
      setter(file);
      setUploadStatus(prev => ({ ...prev, [docType]: 'done' }));
    } catch (err) {
      console.error('[Upload] Vault error:', err);
      setUploadStatus(prev => ({ ...prev, [docType]: 'error' }));
      setter(null);
    }
  };

  const handleSubmit = () => {
    navigate('/get-started/verify-apc', { state: { fromLogbookUpload: true } });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <motion.div
        className="max-w-2xl mx-auto w-full px-6 py-10 md:py-14"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <button
            onClick={() => navigate('/get-started/verify-apc')}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 backdrop-blur-md bg-white/40 border border-white/60 shadow-sm transition-all"
          >
            <ArrowLeft size={14} /> Back to Verification
          </button>
        </div>

        <motion.div className="text-center mb-8" variants={fadeUp} custom={0}>
          <h1 className="text-2xl font-black tracking-tight text-gray-900 mb-2">
            Flight Hours & Logbook
          </h1>
          <p className="text-sm text-gray-500">
            Upload your logbook and provide your flight hours summary.
          </p>
        </motion.div>

        {/* Section 1: Logbook Upload */}
        <motion.div className="mb-6" variants={fadeUp} custom={1}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">1. Logbook Upload</p>
          <p className="text-[10px] text-gray-500 mb-3">
            You can upload either a scanned photocopy (PDF/image) of your physical logbook, or a CSV export from a digital logbook app (ForeFlight, LogTen Pro, MCC PILOTLOG, etc.).
          </p>
          <div className="grid grid-cols-2 gap-2 mb-3">
            {[
              { label: 'Scanned Logbook (PDF/Image)', file: logbookFile, setter: setLogbookFile, icon: Briefcase, docType: 'logbook', accept: '.pdf,.jpg,.jpeg,.png' },
              { label: 'CSV Export (Digital Logbook)', file: csvFile, setter: setCsvFile, icon: FileSpreadsheet, docType: 'logbook-csv', accept: '.csv' },
            ].map((item) => (
              <label key={item.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${uploadStatus[item.docType] === 'done' || item.file ? 'rgba(34,197,94,0.4)' : uploadStatus[item.docType] === 'error' ? 'rgba(239,68,68,0.4)' : 'rgba(0,0,0,0.2)'}` }}>
                <input type="file" accept={item.accept} className="hidden" onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadDocument(f, item.docType, item.setter); }} />
                {uploadStatus[item.docType] === 'uploading' ? (
                  <>
                    <div className="w-4 h-4 border-2 border-gray-400 border-t-transparent rounded-full animate-spin" />
                    <p className="text-[9px] font-medium text-gray-500">Uploading securely...</p>
                  </>
                ) : item.file ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon size={18} className="text-gray-300" />
                    <p className="text-[9px] font-medium text-gray-600">{item.label}</p>
                  </>
                )}
              </label>
            ))}
          </div>
        </motion.div>

        {/* Section 2: Flight Hours Summary */}
        <motion.div className="mb-6" variants={fadeUp} custom={2}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">2. Flight Hours Summary</p>
          <div className="rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,0,0,0.08)' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: 'rgba(0,0,0,0.04)' }}>
                  <th className="text-left px-3 py-2 text-gray-600 font-semibold">Category</th>
                  <th className="text-right px-3 py-2 text-gray-600 font-semibold">Hours</th>
                </tr>
              </thead>
              <tbody>
                {[
                  { label: 'Total Flight Time', key: 'totalHours' },
                  { label: 'PIC (Pilot in Command)', key: 'picHours' },
                  { label: 'Night', key: 'nightHours' },
                  { label: 'Instrument', key: 'instrumentHours' },
                  { label: 'Cross-Country', key: 'crossCountryHours' },
                ].map((row) => (
                  <tr key={row.key} style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
                    <td className="px-3 py-2 text-gray-700">{row.label}</td>
                    <td className="px-3 py-2 text-right">
                      <input type="number" min="0" step="0.1" placeholder="0.0"
                        value={flightHours[row.key as keyof typeof flightHours]}
                        onChange={(e) => setFlightHours(p => ({ ...p, [row.key]: e.target.value }))}
                        className="w-20 text-center rounded-lg px-2 py-1 text-xs text-gray-900 outline-none"
                        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* Section 3: Notes */}
        <motion.div className="mb-8" variants={fadeUp} custom={3}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Additional Notes</p>
          <textarea
            placeholder="Any notes about your logbook, training history, or specific entries the ATO should review..."
            className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none resize-none"
            rows={3}
            style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
          />
        </motion.div>

        {/* Submit */}
        <motion.div className="flex justify-center" variants={fadeUp} custom={4}>
          <button
            onClick={handleSubmit}
            className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-sm font-black tracking-wider text-white transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Save & Continue <ArrowRight size={16} />
          </button>
        </motion.div>
      </motion.div>
    </div>
  );
}
