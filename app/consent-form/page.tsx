import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ConsentFormPage() {
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
          <p className="text-sm text-gray-500">ATO Training Records Verification — Pilot Consent Form</p>
          <p className="text-xs text-gray-400 mt-1">Data Controller registered in Mauritius | DPA 2017 Compliant</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">1. Pilot Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {['Full Name', 'License Number', 'Email Address', 'Phone Number', 'Nationality', 'Date of Birth'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <div className="border-b border-gray-400 h-7" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">2. ATO Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {['ATO Name', 'ATO Location / Country'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <div className="border-b border-gray-400 h-7" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">3. Chief Flight Instructor (CFI) Information & Consent</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              The undersigned Chief Flight Instructor (CFI) or authorized ATO representative provides consent and authorization for Aviation Pathways Consultancy (APC) to contact the ATO regarding the pilot named above. The CFI signature below confirms:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-3">
              <li>The CFI acknowledges that APC may contact the ATO to verify the pilot's flight training records, logbook hours, and endorsements.</li>
              <li>The CFI consents to the release of verification information to APC and the pilot as part of the PilotRecognition verification framework.</li>
              <li>The CFI confirms they are authorized to act on behalf of the ATO named above and have the authority to provide this consent.</li>
            </ul>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {['CFI Full Name', 'CFI License / Certificate Number'].map((label) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <div className="border-b border-gray-400 h-7" />
                </div>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">CFI Signature</label>
                <div className="border-b border-gray-400 h-10" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                <div className="border-b border-gray-400 h-10 text-xs text-gray-500 pt-2">{today}</div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">4. Authorization</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              The pilot hereby authorizes Aviation Pathways Consultancy (APC) to contact the ATO named above and request verification of the pilot's flight training records and logbook hours. The pilot understands that:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-3">
              <li>APC will send the pilot's uploaded documents (license, medical, ratings) and this consent form to the ATO via email.</li>
              <li>The ATO will verify the pilot's logbook hours and send the results directly to the pilot's email address.</li>
              <li>APC will receive only a confirmation that verification was completed, not the pilot's actual flight hours.</li>
              <li>All documents are encrypted and automatically deleted 30 days after verification.</li>
              <li>The <span className="font-semibold text-gray-800">Approved Aviation Body</span> responsible for conducting or reviewing the verification will receive a <span className="font-semibold text-gray-800">10% incentive on verification fees</span> when the pilot achieves full verification compliance across all submitted documents, as a reward for clean, accurate verification outcomes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">5. Declaration</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              The pilot confirms that all information provided is accurate and complete to the best of the pilot's knowledge. The pilot understands that providing false or misleading information may result in the rejection of the verification request.
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
