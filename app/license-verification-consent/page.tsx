import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LicenseVerificationConsentPage() {
  const navigate = useNavigate();

  const printConsentForm = () => {
    window.print();
  };

  const today = new Date().toLocaleDateString('en-GB');

  return (
    <div className="min-h-screen bg-white">
      {/* Print-only content */}
      <div className="max-w-3xl mx-auto px-8 py-12 print:px-0 print:py-0">
        {/* Header controls — hidden on print */}
        <div className="flex items-center justify-between mb-10 no-print">
          <button
            onClick={() => navigate(-1)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-wider text-gray-500 hover:text-gray-700 backdrop-blur-md bg-white/40 border border-white/60 shadow-sm transition-all"
          >
            ← Back
          </button>
          <button
            onClick={printConsentForm}
            className="inline-flex items-center gap-1 px-4 py-1.5 rounded-full text-[10px] font-bold tracking-wider text-white shadow-sm transition-all hover:brightness-110"
            style={{ background: 'linear-gradient(135deg, #dc2626, #b91c1c)' }}
          >
            Print / Save as PDF
          </button>
        </div>

        {/* Form Content */}
        <div className="text-center mb-8">
          <h1 className="text-lg font-black tracking-tight text-gray-900">AVIATION PATHWAYS CONSULTANCY (APC)</h1>
          <p className="text-sm text-gray-500">Pilot License & Type Rating Verification — Consent Form</p>
          <p className="text-xs text-gray-400 mt-1">Data Controller registered in Mauritius | DPA 2017 Compliant</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">1. Pilot Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Full Name', 'License Number', 'License Type (PPL/CPL/ATPL)', 'Issuing Authority / CAA', 'Email Address', 'Phone Number', 'Nationality', 'Date of Birth'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <div className="border-b border-gray-400 h-7" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">2. Documents Submitted for Verification</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Pilot License (Front)', 'Pilot License (Back)', 'Medical Certificate', 'Radio / NTC License', 'Type Rating Certificate', 'Type Rating Licensure'].map((label) => (
                <div key={label} className="flex items-center gap-2">
                  <div className="w-4 h-4 border border-gray-400 rounded-sm flex-shrink-0" />
                  <label className="text-xs text-gray-700">{label}</label>
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">3. Authorization for License & Type Rating Verification</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              I hereby authorize <span className="font-semibold text-gray-800">Aviation Pathways Consultancy (APC)</span> to use my pilot license, type ratings, medical certificate, and related documents for verification purposes with the designated Civil Aviation Authority (CAA) and regulatory bodies. I understand that:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-3">
              <li>APC will submit my uploaded documents to the relevant CAA for verification of authenticity and validity.</li>
              <li>Verification includes confirmation of license type, ratings, endorsements, limitations, and expiry dates.</li>
              <li>The CAA may retain my documents during the verification process as per their standard procedures.</li>
              <li>APC will receive verification results (verified / not verified / pending) but will not store my raw documents beyond the 30-day retention period.</li>
              <li>This consent is given for the sole purpose of compliance with verification, proof of claim, and ownership requirements under the PilotRecognition framework.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">4. Proof of Claim & Ownership</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              I confirm that I am the legitimate holder of the licenses, ratings, and certificates submitted above. I understand that:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-3">
              <li>Submitting falsified or fraudulent documents is a criminal offense under applicable aviation and data protection laws.</li>
              <li>APC and the verifying CAA may report suspected fraudulent documentation to the appropriate regulatory and law enforcement authorities.</li>
              <li>My PilotRecognition profile and any associated wallet credentials may be revoked if documents are found to be fraudulent.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">5. Declaration</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              I confirm that all information and documents provided are accurate, complete, and authentic to the best of my knowledge. I understand that providing false or misleading information may result in the rejection of my verification request, revocation of my PilotRecognition profile, and potential legal consequences.
            </p>
          </section>

          <section className="pt-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pilot Signature</label>
                <div className="border-b border-gray-400 h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                <div className="border-b border-gray-400 h-10 text-xs text-gray-500 pt-2">{today}</div>
              </div>
            </div>
          </section>

          <footer className="text-[10px] text-gray-400 pt-8 border-t border-gray-200 mt-8">
            <p>For data protection inquiries: Benjamin Bowler — benjamin@pilotrecognition.com</p>
            <p>This form is issued under the Mauritius Data Protection Act 2017. Documents processed: encrypted storage, 30-day retention.</p>
            <p className="mt-1">PilotRecognition® — Aviation Pathways Consultancy (APC) — Registration: Mauritius Data Protection Office</p>
          </footer>
        </div>
      </div>

      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { margin: 0; padding: 0; background: white; }
        }
      `}</style>
    </div>
  );
}
