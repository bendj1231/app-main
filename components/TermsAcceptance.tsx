import React, { useState } from 'react';
import { ShieldCheck, Eye, Database, FileCheck } from 'lucide-react';

interface TermsAcceptanceProps {
  onAccept: (consentRecord: ConsentRecord) => void;
  buttonText?: string;
  userId?: string;
}

export interface ConsentRecord {
  consent_data_processing: boolean;
  consent_verification: boolean;
  consent_profile_display: boolean;
  consent_given_at: string;
  consent_version: string;
}

export const TermsAcceptance: React.FC<TermsAcceptanceProps> = ({
  onAccept,
  buttonText = 'Create Account',
}) => {
  const [consentDataProcessing, setConsentDataProcessing] = useState(false);
  const [consentVerification, setConsentVerification] = useState(false);
  const [consentProfileDisplay, setConsentProfileDisplay] = useState(false);

  const allAccepted = consentDataProcessing && consentVerification && consentProfileDisplay;

  const handleAccept = () => {
    if (!allAccepted) return;
    const consentRecord: ConsentRecord = {
      consent_data_processing: true,
      consent_verification: true,
      consent_profile_display: true,
      consent_given_at: new Date().toISOString(),
      consent_version: 'v2-2026',
    };
    onAccept(consentRecord);
  };

  return (
    <div className="w-full max-w-2xl mx-auto space-y-4">

      <div className="border border-slate-200 rounded-lg bg-white">
        <div className="px-4 py-3 bg-slate-50 border-b border-slate-200 rounded-t-lg">
          <h3 className="font-semibold text-slate-900">Your Consent — Read Each Item</h3>
          <p className="text-xs text-slate-500 mt-1">
            GDPR Art. 7 · PDPA (Philippines) · Electronic Commerce Act R.A. 8792 · Each consent is separate and required.
          </p>
        </div>

        <div className="divide-y divide-slate-100">

          {/* Consent 1 — Data Processing */}
          <label className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
              checked={consentDataProcessing}
              onChange={(e) => setConsentDataProcessing(e.target.checked)}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-blue-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900">Aviation Data Storage</span>
              </div>
              <p className="text-xs text-slate-600">
                I consent to <strong>pilotrecognition.com</strong> storing my aviation metadata (flight hours, license ratings, aircraft types) in encrypted form. My <strong>identity is managed exclusively by Auth0</strong> — pilotrecognition.com stores only an anonymous token, never my name, email, or password. My data is hashed into a tamper-proof profile token visible only to me.
              </p>
            </div>
          </label>

          {/* Consent 2 — Veremark Verification */}
          <label className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
              checked={consentVerification}
              onChange={(e) => setConsentVerification(e.target.checked)}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-green-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900">Credential Verification (Veremark)</span>
              </div>
              <p className="text-xs text-slate-600">
                I authorize <strong>Veremark</strong> (independent third-party) to contact my flight school, ATO, and licensing authority (CAAP/FAA/EASA) to verify my license, medical certificate, and flight hours. Veremark will present a signed Letter of Authorization on my behalf. Verified credentials are stored in my personal <strong>Verepass wallet</strong> — not on pilotrecognition.com's servers.
              </p>
            </div>
          </label>

          {/* Consent 3 — Profile Display */}
          <label className="flex items-start gap-4 p-4 cursor-pointer hover:bg-slate-50 transition-colors">
            <input
              type="checkbox"
              className="mt-1 w-5 h-5 rounded border-slate-300 text-red-600 focus:ring-red-500 cursor-pointer flex-shrink-0"
              checked={consentProfileDisplay}
              onChange={(e) => setConsentProfileDisplay(e.target.checked)}
            />
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Eye className="w-4 h-4 text-purple-600 flex-shrink-0" />
                <span className="text-sm font-semibold text-slate-900">Profile Visibility to Airlines</span>
              </div>
              <p className="text-xs text-slate-600">
                I consent to my <strong>anonymized profile token</strong> and aviation statistics (hours, ratings, verification status) being visible to registered airline and enterprise partners for hiring purposes. <strong>No PII (name, email, ID number) is shared.</strong> I can withdraw this consent and delete my profile at any time.
              </p>
            </div>
          </label>

        </div>

        <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 rounded-b-lg">
          <div className="flex items-center gap-2 text-xs text-slate-500">
            <ShieldCheck className="w-4 h-4 text-green-500 flex-shrink-0" />
            <span>
              Your consent timestamp will be cryptographically recorded. Right to erasure: contact privacy@pilotrecognition.com — data deleted within 30 days.
            </span>
          </div>
        </div>
      </div>

      <button
        onClick={handleAccept}
        disabled={!allAccepted}
        className={`w-full py-3 px-6 rounded-xl font-bold text-white transition-all ${
          allAccepted
            ? 'bg-red-600 hover:bg-red-700 hover:scale-[1.02] shadow-lg cursor-pointer'
            : 'bg-slate-300 cursor-not-allowed'
        }`}
      >
        {allAccepted ? buttonText : `Accept all 3 consents to continue`}
      </button>

    </div>
  );
};
