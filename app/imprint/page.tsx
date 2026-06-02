import React from 'react';
import { MapPin, Mail, Phone, Building2, Globe } from 'lucide-react';

export const metadata = {
  title: 'Legal Notice / Imprint — PilotRecognition',
  description: 'Legal notice and imprint information for PilotRecognition.com, operated by Aviation Pathways Ltd.',
};

export default function ImprintPage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-full px-4 py-1.5 text-xs font-semibold text-slate-700 mb-4">
            <Globe className="w-3.5 h-3.5" />
            Legal Notice / Imprint
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Imprint</h1>
          <p className="text-slate-500 text-sm">
            Required disclosure under EU, German, and applicable international transparency laws.
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-6">

          {/* Operator Identity */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-indigo-100 rounded-lg">
                <Building2 className="w-5 h-5 text-indigo-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Platform Operator</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p><strong className="text-slate-800">Legal Name:</strong> Aviation Pathways Ltd</p>
              <p><strong className="text-slate-800">Trade Name:</strong> PilotRecognition.com</p>
              <p><strong className="text-slate-800">Jurisdiction:</strong> Republic of Mauritius</p>
              <p><strong className="text-slate-800">Company Type:</strong> Private limited company — sole director and shareholder</p>
              <p><strong className="text-slate-800">Registration:</strong> Companies and Business Registration Division (CBRD), Mauritius</p>
              <p><strong className="text-slate-800">Managing Director / DPO:</strong> Benjamin Bowler</p>
              <p><strong className="text-slate-800">Company Secretary:</strong> Benjamin Bowler</p>
              <p className="text-xs text-slate-500 pt-2 border-t border-slate-100 mt-2">
                Aviation Pathways Ltd is a single-shareholder, single-director company. Benjamin Bowler holds all shares and serves as the sole director, company secretary, and appointed Data Protection Officer. All legal authority to sign contracts, make infrastructure decisions, and represent the company rests with the Managing Director.
              </p>
            </div>
          </section>

          {/* Contact */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-emerald-100 rounded-lg">
                <MapPin className="w-5 h-5 text-emerald-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Contact Information</h2>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
              <p className="font-semibold text-slate-800 mb-1">Registered Office</p>
              <p className="text-slate-600">24 Avenue Le Morne, Black Rock 2, Villa 24, Tamarin, Republic of Mauritius</p>
              <p className="text-xs text-slate-500 mt-1">The director's personal residence in Mauritius. Used as the legal address for service of process and statutory notices.</p>
            </div>
            <div className="mt-4 space-y-2 text-sm">
              <a href="mailto:privacy@pilotrecognition.com" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <Mail className="w-4 h-4" />
                privacy@pilotrecognition.com
              </a>
              <a href="mailto:support@pilotrecognition.com" className="flex items-center gap-2 text-indigo-600 hover:underline">
                <Mail className="w-4 h-4" />
                support@pilotrecognition.com
              </a>
            </div>
          </section>

          {/* DPO */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-amber-100 rounded-lg">
                <Phone className="w-5 h-5 text-amber-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Data Protection Officer</h2>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 text-sm">
              <p className="font-semibold text-slate-800 mb-1">Benjamin Bowler</p>
              <p className="text-slate-600 mb-2">Appointed Data Protection Officer</p>
              <a href="mailto:privacy@pilotrecognition.com" className="text-indigo-600 hover:underline">
                privacy@pilotrecognition.com
              </a>
            </div>
          </section>

          {/* Regulatory */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2.5 bg-blue-100 rounded-lg">
                <Globe className="w-5 h-5 text-blue-600" />
              </div>
              <h2 className="text-lg font-bold text-slate-900">Regulatory & Complaints</h2>
            </div>
            <div className="space-y-3 text-sm text-slate-600">
              <p>
                <strong className="text-slate-800">Mauritius Data Protection Office:</strong>{' '}
                <a href="https://dataprotection.govmu.org" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  dataprotection.govmu.org
                </a>
              </p>
              <p>
                <strong className="text-slate-800">Philippines National Privacy Commission:</strong>{' '}
                <a href="https://www.privacy.gov.ph" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  privacy.gov.ph
                </a>
              </p>
              <p>
                <strong className="text-slate-800">EU Data Protection Authorities:</strong>{' '}
                <a href="https://edpb.europa.eu" target="_blank" rel="noopener noreferrer" className="text-indigo-600 hover:underline">
                  edpb.europa.eu
                </a>
              </p>
            </div>
          </section>

          {/* Dispute Resolution */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <h2 className="text-lg font-bold text-slate-900 mb-3">Dispute Resolution</h2>
            <p className="text-sm text-slate-600 leading-relaxed">
              Disputes arising from the use of this platform shall be resolved by binding arbitration under the 
              DIAC Arbitration Rules, with the administrative seat in Dubai, UAE. This does not affect your statutory 
              rights to pursue remedies before the data protection supervisory authorities in your jurisdiction.
            </p>
          </section>

        </div>

        {/* Footer */}
        <div className="text-center mt-10">
          <p className="text-xs text-slate-400">
            Last updated: 02 June 2026 · Aviation Pathways Ltd · All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
