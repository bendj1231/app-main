import React from 'react';
import { Mail, Clock, Shield, MapPin, FileText, AlertCircle } from 'lucide-react';

export const metadata = {
  title: 'Data Protection Officer — PilotRecognition',
  description: 'Contact our Data Protection Officer for privacy enquiries, data subject access requests, and compliance matters.',
};

export default function DPOPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-4xl mx-auto px-6 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <Shield className="w-3.5 h-3.5" />
            Data Protection & Compliance
          </div>
          <h1 className="text-4xl font-black text-slate-900 mb-3">Data Protection Officer</h1>
          <p className="text-slate-600 max-w-2xl">
            For all privacy, data protection, and compliance enquiries. We respond to data subject requests
            under the Mauritius Data Protection Act 2017, GDPR, and RA 10173 (Philippines) within our published SLA.
          </p>
          <div className="mt-4 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
            <strong>Data Protection Contact:</strong> Benjamin Bowler (Non-Executive Director / Sole Shareholder) serves as the registered contact person for data protection matters with the Data Protection Office, Republic of Mauritius. This role is distinct from a GDPR Article 37 Data Protection Officer. An independent DPO under GDPR Article 37 will be appointed prior to processing personal data of data subjects within the European Economic Area at scale. The platform has not yet commenced user data processing.
          </div>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <Mail className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Primary Contact</h2>
            </div>
            <p className="text-sm text-slate-600 mb-3">
              All data protection enquiries should be directed to our designated privacy mailbox.
            </p>
            <a
              href="mailto:privacy@pilotrecognition.com"
              className="inline-flex items-center gap-2 text-indigo-600 font-semibold hover:underline"
            >
              <Mail className="w-4 h-4" />
              privacy@pilotrecognition.com
            </a>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-100 rounded-lg">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Response SLA</h2>
            </div>
            <ul className="space-y-2 text-sm text-slate-600">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span><strong>Acknowledgement:</strong> Within 48 hours</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span><strong>Initial Assessment:</strong> Within 7 calendar days</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                <span><strong>Full Resolution:</strong> Within 30 calendar days (GDPR Art. 12)</span>
              </li>
            </ul>
          </div>
        </div>

        {/* DPO Identity */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-slate-100 rounded-lg">
              <MapPin className="w-5 h-5 text-slate-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Data Controller Identity</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            <div className="bg-amber-50 rounded-xl p-4 border border-amber-200">
              <p className="font-semibold text-slate-800 mb-1">Legal Entity</p>
              <p className="text-slate-600">Aviation Pathways Ltd (pending incorporation, Republic of Mauritius)</p>
              <p className="text-xs text-amber-700 mt-1">Managed by Marie Maureen Synthia Maya (Managing Director) and Benjamin Bowler (Non-Executive Director / Sole Shareholder).</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Mauritius Registration</p>
              <p className="text-slate-600">Application for registration as Data Controller filed with the Data Protection Office, Republic of Mauritius under the Data Protection Act 2017. The platform has not commenced user data processing. The 14-day registration clock begins upon first user registration.</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Managing Director</p>
              <p className="text-slate-600">Marie Maureen Synthia Maya</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Non-Executive Director / Sole Shareholder</p>
              <p className="text-slate-600">Benjamin Bowler</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Data Protection Contact</p>
              <p className="text-slate-600">Benjamin Bowler — privacy@pilotrecognition.com</p>
              <p className="text-xs text-slate-500 mt-1">Registered contact person under Mauritius DPA 2017. Not a GDPR Article 37 DPO.</p>
            </div>
          </div>
        </div>

        {/* Data Subject Rights */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-emerald-100 rounded-lg">
              <FileText className="w-5 h-5 text-emerald-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Your Rights</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {[
              { right: 'Right of Access (Art. 15)', desc: 'Request a copy of all data we hold about you.', action: 'Use "Download My Data" in Settings' },
              { right: 'Right to Rectification (Art. 16)', desc: 'Correct inaccurate or incomplete data.', action: 'Update your profile in the Portal' },
              { right: 'Right to Erasure (Art. 17)', desc: 'Request deletion of your personal data.', action: 'Use "Delete Account" in Settings' },
              { right: 'Right to Restrict Processing (Art. 18)', desc: 'Pause processing while a dispute is resolved.', action: 'Email privacy@pilotrecognition.com' },
              { right: 'Right to Data Portability (Art. 20)', desc: 'Receive your data in a machine-readable format.', action: 'Use "Download My Data" in Settings' },
              { right: 'Right to Object (Art. 21)', desc: 'Object to processing based on legitimate interests.', action: 'Email privacy@pilotrecognition.com' },
              { right: 'Right to Withdraw Consent', desc: 'Withdraw consent at any time.', action: 'Email privacy@pilotrecognition.com' },
              { right: 'Right to Lodge a Complaint', desc: 'Complain to your national supervisory authority.', action: 'See supervisory authorities below' },
            ].map(({ right, desc, action }) => (
              <div key={right} className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                <p className="font-semibold text-slate-800 text-xs uppercase tracking-wide mb-1">{right}</p>
                <p className="text-slate-600 text-xs mb-2">{desc}</p>
                <p className="text-indigo-600 text-xs font-medium">{action}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Supervisory Authorities */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 mb-10">
          <div className="flex items-center gap-3 mb-5">
            <div className="p-2.5 bg-amber-100 rounded-lg">
              <AlertCircle className="w-5 h-5 text-amber-600" />
            </div>
            <h2 className="text-lg font-bold text-slate-900">Supervisory Authorities</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Philippines</p>
              <p className="text-slate-600 text-xs">National Privacy Commission (NPC)</p>
              <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">privacy.gov.ph</a>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">EU / EEA</p>
              <p className="text-slate-600 text-xs">Your local Data Protection Authority (DPA)</p>
              <a href="https://edpb.europa.eu/about-edpb/board/members_en" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">edpb.europa.eu</a>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">United Kingdom</p>
              <p className="text-slate-600 text-xs">Information Commissioner&apos;s Office (ICO)</p>
              <a href="https://ico.org.uk" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">ico.org.uk</a>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">United Arab Emirates</p>
              <p className="text-slate-600 text-xs">UAE Data Office</p>
              <a href="https://uaedataoffice.gov.ae" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">uaedataoffice.gov.ae</a>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Mauritius (Primary)</p>
              <p className="text-slate-600 text-xs">Data Protection Office, Republic of Mauritius</p>
              <p className="text-slate-600 text-xs">Phone: (230) 210 3434 · Email: dpo@govmu.org</p>
              <a href="https://dataprotection.govmu.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">dataprotection.govmu.org</a>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
              <p className="font-semibold text-slate-800 mb-1">Singapore</p>
              <p className="text-slate-600 text-xs">Personal Data Protection Commission (PDPC)</p>
              <a href="https://www.pdpc.gov.sg" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline text-xs">pdpc.gov.sg</a>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-xs text-slate-400">
            Last updated: 02 June 2026 · Document Reference: PR-DPO-001 v1.0 · Aviation Pathways Ltd (pending incorporation) — Managing Director: Marie Maureen Synthia Maya · Non-Executive Director: Benjamin Bowler
          </p>
        </div>
      </div>
    </div>
  );
}
