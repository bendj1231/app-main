import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth0 } from '@auth0/auth0-react';
import { motion } from 'framer-motion';
import { MeshGradient } from '@paper-design/shaders-react';
import { getHomepageGraphicsConfig } from '@/src/lib/device-detection';
import { useWorkerAuth } from '@/src/hooks/useWorkerAuth';
import {
  ArrowRight, ShieldCheck, Plane, Briefcase, BadgeCheck, UserCheck,
} from 'lucide-react';

const fadeUp = {
  hidden: { opacity: 0, y: 30, scale: 0.96, filter: 'blur(8px)' },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { delay: i * 0.1, duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] as [number, number, number, number] },
  }),
};

export default function VerifyApcPage() {
  const navigate = useNavigate();
  const { user: auth0User } = useAuth0();
  const { callApi } = useWorkerAuth();
  const graphicsConfig = useMemo(() => getHomepageGraphicsConfig(), []);

  const [apcEmail, setApcEmail] = useState('');
  const [apcLicenseFile, setApcLicenseFile] = useState<File | null>(null);
  const [apcRatingsFile, setApcRatingsFile] = useState<File | null>(null);
  const [apcLogbookFile, setApcLogbookFile] = useState<File | null>(null);
  const [apcMedicalFile, setApcMedicalFile] = useState<File | null>(null);
  const [apcGovIdFile, setApcGovIdFile] = useState<File | null>(null);
  const [apcConsentFile, setApcConsentFile] = useState<File | null>(null);
  const [apcConsentChecked, setApcConsentChecked] = useState(false);
  const [atoConsentChecked, setAtoConsentChecked] = useState(false);
  const [privacyConsentChecked, setPrivacyConsentChecked] = useState(false);
  const [apcFormData, setApcFormData] = useState({
    fullName: '', phone: '', licenseNumber: '', licenseType: 'PPL',
    issuingAuthority: 'CAAP', licenseIssueDate: '', licenseExpiryDate: '',
    totalHours: '', picHours: '', nightHours: '', instrumentHours: '', crossCountryHours: '',
    medicalClass: 'Class 1', medicalExpiry: '',
    atoName: '', atoLocation: '',
    atoDataNeeded: 'total_flight_hours',
  });

  // Pre-fill from D1 profile
  useEffect(() => {
    if (!auth0User?.sub) return;
    const fetchProfile = async () => {
      try {
        const profile = await callApi<Record<string, unknown>>('getProfile', { me: 1 });
        if (!profile) return;
        if (profile.email && typeof profile.email === 'string') setApcEmail(profile.email);
        setApcFormData(prev => ({
          ...prev,
          fullName: (profile.full_name as string) || (profile.display_name as string) || prev.fullName,
          phone: (profile.phone as string) || prev.phone,
          licenseNumber: (profile.license_id as string) || prev.licenseNumber,
          licenseType: (profile.license_types as string) || prev.licenseType,
          issuingAuthority: (profile.license_issuing_authority as string) || (profile.country_of_license as string) || prev.issuingAuthority,
          totalHours: (profile.total_flight_hours as number)?.toString() || prev.totalHours,
        }));
      } catch (err) {
        console.warn('[VerifyAPC] Could not fetch D1 profile:', err);
      }
    };
    fetchProfile();
  }, [auth0User?.sub, callApi]);

  const handleSubmit = () => {
    // TODO: Send form data + files to backend
    navigate('/get-started', { state: { fromApcVerification: true } });
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden" style={{ background: '#0f172a' }}>
      {/* MeshGradient Background */}
      <div className="absolute inset-0 z-0">
        {graphicsConfig.enableMeshGradient && (
          <MeshGradient
            colors={["#dbeafe","#94a3b8","#64748b","#475569","#334155","#1e3a5f","#1e3a8a","#0f172a"]}
            speed={graphicsConfig.meshGradientSpeed || 0.3}
            style={{ position: 'absolute', width: '100%', height: '100%', opacity: 0.7 }}
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-500/20 via-slate-800/35 to-slate-950/60" />
        <div className="absolute inset-0 backdrop-blur-[3px] bg-slate-900/10" />
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.6) 100%)' }} />
      </div>

      {/* Card */}
      <motion.div
        className="relative z-10 max-w-3xl w-full rounded-3xl p-6 md:p-8 max-h-[85vh] overflow-y-auto"
        style={{
          background: '#ffffff',
          border: '1px solid rgba(0,0,0,0.06)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.15), 0 0 0 1px rgba(0,0,0,0.04)',
        }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        {/* Header */}
        <div className="flex items-center gap-2 mb-6">
          <button
            onClick={() => navigate('/get-started')}
            className="text-[10px] font-bold text-gray-400 hover:text-gray-600 uppercase tracking-wider transition-colors"
          >
            ← Back to Get Started
          </button>
        </div>

        <motion.p
          className="text-center text-base font-black tracking-widest mb-3"
          style={{ color: '#dc2626' }}
          variants={fadeUp}
          custom={0}
        >
          RECOGNITION+
        </motion.p>

        <motion.h1
          className="text-2xl font-black tracking-tight text-gray-900 mb-2 text-center"
          variants={fadeUp}
          custom={1}
        >
          Verification Request
        </motion.h1>

        <motion.p
          className="text-sm text-gray-500 mb-6 text-center"
          variants={fadeUp}
          custom={2}
        >
          Complete your verification with <span className="font-bold text-gray-700">Aviation Pathways Consultancy (APC)</span>. Your profile data has been pre-filled where available.
        </motion.p>

        {/* ── Section 1: Personal Details ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={3}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">1. Personal Details</p>
          <div className="grid grid-cols-2 gap-2">
            <input type="text" placeholder="Full Name" value={apcFormData.fullName} onChange={(e) => setApcFormData(p => ({ ...p, fullName: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="email" placeholder="Email" value={apcEmail} onChange={(e) => setApcEmail(e.target.value)} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="tel" placeholder="Phone" value={apcFormData.phone} onChange={(e) => setApcFormData(p => ({ ...p, phone: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="text" placeholder="License Number" value={apcFormData.licenseNumber} onChange={(e) => setApcFormData(p => ({ ...p, licenseNumber: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
        </motion.div>

        {/* ── Section 2: License Information ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={4}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">2. License Information</p>
          <div className="grid grid-cols-2 gap-2 mb-2">
            <select value={apcFormData.licenseType} onChange={(e) => setApcFormData(p => ({ ...p, licenseType: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <option>PPL</option><option>CPL</option><option>ATPL</option><option>Student Pilot</option>
            </select>
            <select value={apcFormData.issuingAuthority} onChange={(e) => setApcFormData(p => ({ ...p, issuingAuthority: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <option>CAAP</option><option>FAA</option><option>EASA</option><option>CAA UK</option><option>GCAA</option><option>CAAS</option>
            </select>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <input type="date" value={apcFormData.licenseIssueDate} onChange={(e) => setApcFormData(p => ({ ...p, licenseIssueDate: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="date" value={apcFormData.licenseExpiryDate} onChange={(e) => setApcFormData(p => ({ ...p, licenseExpiryDate: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
        </motion.div>

        {/* ── CAAP License Verification Note ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={4}>
          <div className="rounded-xl p-3" style={{ background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.15)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">CAAP License Verification Process:</span> There is no public online database for instant CAAP license lookup. Your consultancy must submit a formal request to CAAP's Aviation Records Management Division (ARMD) with two required items:
            </p>
            <div className="space-y-1.5 mb-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-gray-600">A copy of your physical license (showing your unique PEL number)</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-gray-600">A signed consent letter authorizing APC to verify your records (provided in Section 8)</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-1">
              <span className="font-semibold text-gray-700">Option A (Fastest):</span> APC sends a formal corporate letter to CAAP Licensing / ARMD with your license copy and consent form.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Option B (eFOI Portal):</span> Submit an official verification request via the Philippines eFOI Portal directed to CAAP.
            </p>
          </div>
        </motion.div>

        {/* ── Section 3: Flight Hours Summary ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={5}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">3. Flight Hours Summary</p>
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
                    <td className="px-3 py-2">
                      <input type="number" min="0" step="0.1" placeholder="0.0"
                        value={apcFormData[row.key as keyof typeof apcFormData]}
                        onChange={(e) => setApcFormData(p => ({ ...p, [row.key]: e.target.value }))}
                        className="w-20 text-right rounded-lg px-2 py-1 text-xs text-gray-900 outline-none"
                        style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}
                      />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* ── Section 4: Medical Certificate ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={6}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">4. Medical Certificate</p>
          <div className="grid grid-cols-2 gap-2">
            <select value={apcFormData.medicalClass} onChange={(e) => setApcFormData(p => ({ ...p, medicalClass: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <option>Class 1</option><option>Class 2</option><option>Class 3</option>
            </select>
            <input type="date" value={apcFormData.medicalExpiry} onChange={(e) => setApcFormData(p => ({ ...p, medicalExpiry: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
        </motion.div>

        {/* ── Section 5: License, Ratings & Government ID ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={7}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">5. Pilot License, Ratings & Government ID</p>
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              <span className="font-bold text-gray-800">Government ID required:</span> Your ATO's Registrar must verify your signature against their internal files. We need a copy of your government-issued ID (passport, driver's license, or national ID) alongside your pilot license to match signatures.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {[
              { label: 'Pilot License', file: apcLicenseFile, setter: setApcLicenseFile, icon: ShieldCheck },
              { label: 'Type Ratings / Endorsements', file: apcRatingsFile, setter: setApcRatingsFile, icon: BadgeCheck },
              { label: 'Government-Issued ID', file: apcGovIdFile, setter: setApcGovIdFile, icon: UserCheck },
            ].map((item) => (
              <label key={item.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${item.file ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.12)'}` }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => item.setter(e.target.files?.[0] || null)} />
                {item.file ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon size={18} className="text-gray-300" />
                    <p className="text-[9px] text-gray-500">{item.label}</p>
                  </>
                )}
              </label>
            ))}
          </div>
        </motion.div>

        {/* ── Section 6: Logbook Upload — Flight Hour Verification ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={8}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">6. Logbook Upload — Flight Hour Verification</p>
          <div className="grid grid-cols-2 gap-2">
            {[
              { label: 'Pilot Logbook (All Pages)', file: apcLogbookFile, setter: setApcLogbookFile, icon: Briefcase },
              { label: 'Medical Certificate', file: apcMedicalFile, setter: setApcMedicalFile, icon: BadgeCheck },
              { label: 'Signed Consent Form', file: apcConsentFile, setter: setApcConsentFile, icon: UserCheck },
            ].map((item) => (
              <label key={item.label} className="flex flex-col items-center justify-center gap-1.5 rounded-xl p-3 cursor-pointer transition-all hover:bg-gray-50" style={{ background: 'rgba(0,0,0,0.02)', border: `1.5px dashed ${item.file ? 'rgba(34,197,94,0.4)' : 'rgba(0,0,0,0.12)'}` }}>
                <input type="file" accept=".pdf,.jpg,.jpeg,.png" className="hidden" onChange={(e) => item.setter(e.target.files?.[0] || null)} />
                {item.file ? (
                  <>
                    <BadgeCheck size={18} className="text-green-500" />
                    <p className="text-[9px] font-semibold text-gray-700 truncate max-w-full">{item.file.name}</p>
                  </>
                ) : (
                  <>
                    <item.icon size={18} className="text-gray-300" />
                    <p className="text-[9px] text-gray-500">{item.label}</p>
                  </>
                )}
              </label>
            ))}
          </div>
        </motion.div>

        {/* ── Section 7: ATO & Flight School Verification Credentials ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={9}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">7. ATO & Flight School Verification Process</p>
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(139,92,246,0.04)', border: '1px solid rgba(139,92,246,0.15)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">Release Form:</span> For now, APC will use a <span className="font-semibold">generic third-party release form</span> to request your training records. If your specific ATO requires their own institutional release form, APC will notify you immediately to arrange the additional signature.
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">Corporate Verification:</span> Most established flight academies will not release simulator profiles or ground school records via a simple email. APC will submit our official company profile, registered business license, and your signed consent form to the ATO's Records/Compliance Department.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Custom Forms Database:</span> APC maintains a database of custom institutional release forms required by major flight academies. If your ATO has a proprietary form, we will swap it out and contact you for any additional signatures needed.
            </p>
          </div>
        </motion.div>

        {/* ── Section 8: ATO Third-Party Authorization ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={10}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">8. ATO Authorization — Training Records Release</p>
          <div className="rounded-xl p-3 mb-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.15)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">Third-Party Authorization Required:</span> To legally obtain your flight training records from your Approved Training Organization (ATO), APC must submit a formal request with your signed consent. This authorization names APC as the authorized recipient of your training records.
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              The ATO's Registrar or Training Records department will require this signed waiver along with a copy of your government-issued ID before releasing any records.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">
              <span className="font-semibold text-gray-700">Note:</span> Many ATOs archive older records. Response times can range from 3 to 14 business days, and some institutions may charge a processing fee to extract logbooks or simulator profiles.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed mb-2">
              <span className="font-semibold text-gray-700">Internal forms:</span> Some ATOs may reject our consent template and require their own institutional release form. If this happens, APC will contact you immediately to arrange the additional signature.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">License validity:</span> ATOs can verify training hours and internal certificates only. Official license validity must be cross-referenced with your issuing civil aviation authority (e.g., CAAP, FAA, EASA).
            </p>
          </div>
          <div className="grid grid-cols-2 gap-2 mb-3">
            <input type="text" placeholder="ATO Name (e.g. Alpha Aviation Group)" value={apcFormData.atoName} onChange={(e) => setApcFormData(p => ({ ...p, atoName: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
            <input type="text" placeholder="ATO Location / Country" value={apcFormData.atoLocation} onChange={(e) => setApcFormData(p => ({ ...p, atoLocation: e.target.value }))} className="rounded-xl px-3 py-2 text-xs text-gray-900 placeholder-gray-400 outline-none" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }} />
          </div>
          <div className="mb-3">
            <p className="text-[10px] font-semibold text-gray-700 mb-1.5">What data should APC request from the ATO?</p>
            <select value={apcFormData.atoDataNeeded} onChange={(e) => setApcFormData(p => ({ ...p, atoDataNeeded: e.target.value }))} className="w-full rounded-xl px-3 py-2 text-xs text-gray-900 outline-none cursor-pointer" style={{ background: 'rgba(0,0,0,0.03)', border: '1px solid rgba(0,0,0,0.08)' }}>
              <option value="total_flight_hours">Total Flight Hours</option>
              <option value="rating_completion_dates">Rating Completion Dates</option>
              <option value="certificate_numbers">Certificate Numbers</option>
              <option value="simulator_profiles">Simulator Training Profiles</option>
              <option value="all_records">All Available Training Records</option>
            </select>
          </div>
          <div className="rounded-xl p-3" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid rgba(245,158,11,0.12)' }}>
            <label className="flex items-start gap-2 cursor-pointer">
              <input type="checkbox" checked={atoConsentChecked} onChange={(e) => setAtoConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-amber-500 cursor-pointer" />
              <span className="text-[10px] text-gray-700 leading-snug">
                I authorize <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to contact the ATO named above and request the release of my flight training records on my behalf. I understand this consent is required under data protection regulations and that the ATO may require additional verification of my identity before releasing records.
              </span>
            </label>
          </div>
        </motion.div>

        {/* ── Section 9: How APC Verifies Your Logbook ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={11}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">9. How APC Verifies Your Logbook</p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(16,185,129,0.04)', border: '1px solid rgba(16,185,129,0.15)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">What we need from you:</span> Your complete pilot logbook (all pages) as a PDF scan or photo upload. If you use a digital logbook app (ForeFlight, LogTen Pro, or MCC PILOTLOG), please also provide an official export or backup file — this helps us verify your records are authentic and unmodified.
            </p>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">What we do with it:</span> APC cross-references your logbook entries against your ATO's official training records and simulator logs. We check for consistency in flight hours, dates, aircraft types, and instructor signatures to ensure your records are accurate and complete.
            </p>
            <p className="text-[10px] text-gray-500 leading-relaxed">
              <span className="font-semibold text-gray-700">Why this matters:</span> Airlines and operators require verified flight hours before hiring. APC's verification gives them confidence that your logbook matches official records from your training institution.
            </p>
          </div>
        </motion.div>

        {/* ── Section 10: Privacy Notice ── */}
        <motion.div className="mb-5 text-left" variants={fadeUp} custom={12}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">10. Privacy Notice</p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(220,38,38,0.04)', border: '1px solid rgba(220,38,38,0.15)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> is registered as a Data Controller with the Data Protection Office of Mauritius. We are committed to protecting your privacy in strict compliance with the Mauritius Data Protection Act (DPA) 2017.
            </p>
            <p className="text-[10px] text-gray-700 font-semibold mb-1">1. Data We Collect & Purpose</p>
            <div className="space-y-1 mb-2">
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-gray-600"><span className="font-semibold">Identity Data:</span> Government-issued ID, passport copies, and contact information.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-gray-600"><span className="font-semibold">Professional Data:</span> Pilot licenses, type ratings, endorsements, and flight logbooks.</p>
              </div>
              <div className="flex items-start gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-red-500 flex-shrink-0 mt-1" />
                <p className="text-[10px] text-gray-600"><span className="font-semibold">Special Categories:</span> Aviation medical certificates and training/simulator records from your named ATO.</p>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              We process this data solely to perform credential validation and background checks based on your explicit written consent.
            </p>
            <p className="text-[10px] text-gray-700 font-semibold mb-1">2. Strict Data Minimization & Retention</p>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              We do not hoard your data. Your sensitive raw documents (ID scans, medical forms, full logbooks) are used strictly to generate your verification report. All raw documents are permanently deleted and purged from our systems exactly <span className="font-semibold">30 days</span> after your final verification report is delivered. Only the final, anonymized confirmation of your verification status is retained for regulatory audit purposes.
            </p>
            <p className="text-[10px] text-gray-700 font-semibold mb-1">3. Security</p>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-2">
              Your data is securely stored on enterprise-grade, encrypted cloud storage protected by multi-factor authentication (MFA). We never sell, rent, or lease your personal information to third parties.
            </p>
            <p className="text-[10px] text-gray-700 font-semibold mb-1">4. Your Rights & Contact</p>
            <p className="text-[10px] text-gray-600 leading-relaxed">
              Under the Mauritius DPA 2017, you retain the right to access, rectify, or restrict the processing of your data, or withdraw your consent at any time. For data protection inquiries, contact our designated Data Protection representative directly: <span className="font-semibold">Benjamin Bowler</span> — benjamin@pilotrecognition.com
            </p>
          </div>
        </motion.div>

        {/* ── Section 11: General Authorization & Consent ── */}
        <motion.div className="mb-6 text-left" variants={fadeUp} custom={13}>
          <p className="text-xs font-black text-gray-900 uppercase tracking-wider mb-3">11. Authorization & Consent</p>
          <div className="rounded-xl p-3" style={{ background: 'rgba(59,130,246,0.04)', border: '1px solid rgba(59,130,246,0.12)' }}>
            <p className="text-[10px] text-gray-600 leading-relaxed mb-3">
              I authorize <span className="font-bold text-gray-800">Aviation Pathways Consultancy (APC)</span> to contact my issuing aviation authority and all relevant aviation organizations to verify my pilot credentials, flight hours, training records, and license validity on my behalf.
            </p>
            <div className="space-y-2">
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={privacyConsentChecked} onChange={(e) => setPrivacyConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-blue-500 cursor-pointer" />
                <span className="text-[10px] text-gray-700 leading-snug">
                  I have read and agree to the <span className="font-semibold">Privacy Notice</span> above. I understand how APC collects, uses, and retains my data, including the 30-day purge policy for raw documents.
                </span>
              </label>
              <label className="flex items-start gap-2 cursor-pointer">
                <input type="checkbox" checked={apcConsentChecked} onChange={(e) => setApcConsentChecked(e.target.checked)} className="mt-0.5 w-3.5 h-3.5 rounded border-gray-300 text-blue-500 cursor-pointer" />
                <span className="text-[10px] text-gray-700 leading-snug">
                  I have read and agree to the above authorization. I confirm that all information provided is accurate and I consent to APC contacting relevant aviation authorities to verify my records.
                </span>
              </label>
            </div>
          </div>
        </motion.div>

        {/* Submit */}
        <motion.div className="flex justify-center pb-2" variants={fadeUp} custom={14}>
          <motion.button
            onClick={handleSubmit}
            disabled={!apcEmail || !apcLicenseFile || !apcRatingsFile || !apcGovIdFile || !apcLogbookFile || !apcConsentChecked || !atoConsentChecked || !privacyConsentChecked || !apcFormData.atoName}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-black tracking-wider text-white transition-all hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
            whileHover={apcEmail && apcLicenseFile && apcRatingsFile && apcGovIdFile && apcLogbookFile && apcConsentChecked && atoConsentChecked && privacyConsentChecked && apcFormData.atoName ? { scale: 1.03 } : {}}
            whileTap={apcEmail && apcLicenseFile && apcRatingsFile && apcGovIdFile && apcLogbookFile && apcConsentChecked && atoConsentChecked && privacyConsentChecked && apcFormData.atoName ? { scale: 0.98 } : {}}
          >
            SUBMIT & CONTINUE <ArrowRight size={14} />
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
}
