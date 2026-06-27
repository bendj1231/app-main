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
          <p className="text-sm text-gray-500">Universal Aviation Verification — Pilot-Initiated Consent Form</p>
          <p className="text-xs text-gray-400 mt-1">Data Controller registered in Mauritius | DPA 2017 Compliant</p>
        </div>

        {/* Pilot Workflow Instruction */}
        <div className="rounded-xl p-3 mb-6" style={{ background: 'rgba(59,130,246,0.06)', border: '1px solid rgba(59,130,246,0.15)' }}>
          <p className="text-[10px] font-semibold text-blue-800 mb-1.5 uppercase tracking-wider">How to use this form — pilot-initiated verification</p>
          <ol className="text-[10px] text-blue-700 space-y-1 list-decimal list-inside leading-snug">
            <li><span className="font-semibold">Print</span> this form after completing Sections 1 and 2.</li>
            <li><span className="font-semibold">Present</span> the printed form to the authorized representative of your Approved Aviation Body (e.g., your ATO, operator, or flight school).</li>
            <li><span className="font-semibold">Obtain</span> their signature, classification tick, and consent in Section 3.</li>
            <li><span className="font-semibold">Scan</span> the fully signed form and upload it to your APC verification portal.</li>
          </ol>
          <p className="text-[9px] text-blue-600 mt-1.5 leading-snug">You do not need APC to contact the aviation body on your behalf — this form empowers you to obtain consent directly from the organization that knows your training and flight history best.</p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">1. Pilot Information</h2>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Full Name', type: 'text' },
                { label: 'License Number', type: 'text' },
                { label: 'Email Address', type: 'email' },
                { label: 'Phone Number', type: 'tel' },
                { label: 'Nationality', type: 'text' },
                { label: 'Date of Birth', type: 'text', placeholder: 'DD / MM / YYYY' },
              ].map(({ label, type, placeholder }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} placeholder={placeholder} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">2. Approved Aviation Body Information</h2>
            <p className="text-[10px] text-gray-500 mb-3 leading-snug">
              The pilot must identify the Approved Aviation Body from which authorization is being requested, print this form, and present it to the organization's authorized representative for signature. If multiple bodies are involved, a separate consent form should be completed for each.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Organization / Body Name', type: 'text' },
                { label: 'Organization Location / Country', type: 'text' },
              ].map(({ label, type }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
                </div>
              ))}
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">3. Approved Aviation Body Representative — Information, Classification & Consent</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              This section is to be completed by the authorized representative of the <span className="font-semibold text-gray-800">Approved Aviation Body</span> identified in Section 2 above. The pilot will present this printed form to the organization's representative in person. The undersigned representative provides consent and authorization for Aviation Pathways Consultancy (APC) to verify the pilot named above. The representative confirms they are authorized to act on behalf of the organization and have the authority to provide this consent. This form serves as a universal authorization — any Approved Aviation Body listed in the classification grid below may use this form.
            </p>

            {/* Classification Grid */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wider">Classification of Aviation Body — tick all that apply</p>
              <div className="grid grid-cols-3 gap-2 text-[10px]">
                {[
                  'Authorized Training Organization (ATO)',
                  'Airline / Commercial Operator',
                  'Cargo Operator',
                  'Charter Operator',
                  'Private / Business Aviation Operator',
                  'Type Rating Center',
                  'Aircraft Manufacturer — Flight Operations',
                  'Military Aviation Authority',
                  'Government / Regulatory Agency',
                  'General Aviation Corporation',
                  'Flight School / Academy',
                  'Other (specify below)',
                ].map((item) => (
                  <label key={item} className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-amber-500 cursor-pointer flex-shrink-0" />
                    <span className="text-gray-700 leading-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Organization Name Field */}
            <div className="mb-4">
              <label className="block text-xs font-semibold text-gray-700 mb-1">Organization / Operator / ATO Name</label>
              <input type="text" className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
            </div>

            {/* Representative Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Representative Full Name', type: 'text' },
                { label: 'Representative Title / Designation', type: 'text' },
                { label: 'Representative License / Certificate Number (if applicable)', type: 'text' },
                { label: 'Organization ICAO / CAA Registration Number (if applicable)', type: 'text' },
              ].map(({ label, type }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
                </div>
              ))}
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-2 gap-4 mb-4">
              {[
                { label: 'Official Email Address', type: 'email' },
                { label: 'Official Phone Number', type: 'tel' },
              ].map(({ label, type }) => (
                <div key={label}>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">{label}</label>
                  <input type={type} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
                </div>
              ))}
            </div>

            {/* Consent Checklist */}
            <div className="mb-4">
              <p className="text-[10px] font-semibold text-gray-700 mb-2 uppercase tracking-wider">Consent confirmation — tick to confirm</p>
              <div className="space-y-1.5 text-[10px]">
                {[
                  'I acknowledge that the pilot has presented this form on their own initiative and that APC may contact this organization to verify the pilot\'s flight training records, logbook hours, licenses, ratings, and endorsements.',
                  'I consent to the release of verification information to APC and the pilot as part of the PilotRecognition verification framework.',
                  'I confirm that I am authorized to act on behalf of the organization named above and have the authority to provide this consent.',
                  'I confirm that the information provided above is accurate and complete to the best of my knowledge.',
                ].map((item, i) => (
                  <label key={i} className="flex items-start gap-1.5 cursor-pointer">
                    <input type="checkbox" className="w-3 h-3 rounded border-gray-300 text-amber-500 cursor-pointer flex-shrink-0 mt-0.5" />
                    <span className="text-gray-700 leading-tight">{item}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Signature Block */}
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Representative Signature</label>
                <input type="text" placeholder="Sign here after printing or type name" className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Print Name</label>
                <input type="text" className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                <input type="text" defaultValue={today} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">4. Authorization</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-3">
              The pilot hereby confirms that they have obtained consent from the <span className="font-semibold text-gray-800">Approved Aviation Body</span> named above by presenting this signed form in person, and authorizes Aviation Pathways Consultancy (APC) to contact that body to request verification of the pilot's flight training records and logbook hours. The pilot understands that:
            </p>
            <ul className="text-xs text-gray-600 space-y-1.5 list-disc list-inside mb-3">
              <li>APC will send the pilot's uploaded documents (license, medical, ratings) and this signed consent form to the Approved Aviation Body via email.</li>
              <li>The Approved Aviation Body will verify the pilot's logbook hours and send the results directly to the pilot's email address.</li>
              <li>APC will receive only a confirmation that verification was completed, not the pilot's actual flight hours.</li>
              <li>All documents are encrypted and automatically deleted 30 days after verification.</li>
              <li>The <span className="font-semibold text-gray-800">Approved Aviation Body</span> responsible for conducting or reviewing the verification will receive a <span className="font-semibold text-gray-800">10% incentive on verification fees</span> when the pilot achieves full verification compliance across all submitted documents, as a reward for clean, accurate verification outcomes.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-sm font-bold text-gray-900 border-b border-gray-300 pb-1 mb-4">5. Declaration</h2>
            <p className="text-xs text-gray-600 leading-relaxed mb-4">
              The pilot confirms that all information provided is accurate and complete to the best of the pilot's knowledge. The pilot further confirms that they personally obtained the signature and consent of the Approved Aviation Body representative documented in Section 3 above, and that they are authorized to submit this form on behalf of that organization for verification purposes. The pilot understands that providing false or misleading information, or submitting a form with an unauthorized or falsified signature, may result in the rejection of the verification request, immediate revocation of the pilot's PilotRecognition profile, and potential legal consequences.
            </p>
          </section>

          <section className="pt-4">
            <div className="grid grid-cols-2 gap-8">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Pilot Signature</label>
                <input type="text" placeholder="Sign here after printing or type name" className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">Date</label>
                <input type="text" defaultValue={today} className="w-full text-xs text-gray-800 border-b border-gray-400 bg-transparent outline-none px-0 py-1 focus:border-amber-500 transition-colors" />
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
