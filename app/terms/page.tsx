import React from 'react';

export default function TermsPage() {
  return (
        {/* Coded by Benjamin Bowler */}
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Document Reference: PR-PPTS-001 · Last Updated: 20 May 2026
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Privacy Policy & Terms of Service</h1>
          <p className="text-slate-500 text-sm mb-4">
            WM Pilot Group (operating as PilotRecognition.com)
          </p>
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            Please read this document carefully before creating your account. By creating an account, you agree to these Terms
            and establish a binding legal agreement between yourself (the <em>Data Controller</em>) and WM Pilot Group (the <em>Data Processor</em>).
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          {/* 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">1</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Our Architecture: You Are in Control</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Unlike traditional platforms that collect, own, and control your data, PilotRecognition.com operates on a
                  decentralised, <strong className="text-slate-800">Self-Sovereign Identity (SSI) framework using W3C Verifiable Credentials</strong>.
                </p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-indigo-50 rounded-xl p-3 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-800 mb-1">You are the Data Controller</p>
                    <p className="text-xs text-slate-600">You retain exclusive ownership of your data. You hold the unique cryptographic keys on your device that lock, unlock, and share your records.</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 border border-slate-200">
                    <p className="text-xs font-bold text-slate-700 mb-1">We are the Data Processor</p>
                    <p className="text-xs text-slate-600">WM Pilot Group provides secure pipelines and cloud hosting. We operate under a <strong className="text-slate-700">zero-knowledge model</strong> — your data is fully encrypted on your device before it reaches us. We cannot see, read, modify, or monetize your personal information.</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">2</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">The Data We Process</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Our platform is designed to process only the information you explicitly choose to manage:
                </p>
                <ul className="space-y-2">
                  {[
                    ['Pilot Credentials', 'Licence particulars, type ratings, and medical certification status.'],
                    ['Aviation Records', 'Flight logbook hours and professional profile details.'],
                    ['Identity Verifications', 'Unencrypted source documents (e.g., passports or licences) uploaded only during the background screening process.'],
                  ].map(([title, detail]) => (
                    <li key={title} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-600">{detail}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">3</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Your Storage, Your Choice</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  We maintain two isolated cloud database environments to host your encrypted data payloads.
                  You have the <strong className="text-slate-800">absolute freedom of choice</strong> to select your preferred infrastructure:
                </p>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 mb-1">Supabase Infrastructure</p>
                    <p>Supabase Inc. — PostgreSQL-backed, globally distributed.</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                    <p className="font-bold text-slate-800 mb-1">Google Firebase Infrastructure</p>
                    <p>Google LLC — globally distributed cloud environment.</p>
                  </div>
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <strong>How it works:</strong> Both environments are secured at the baseline level by WM Pilot Group,
                  but your data is stored strictly as mathematical ciphertext (AES-256-GCM). By selecting a provider, you issue
                  a direct technical instruction to route your encrypted files to that specific cloud host.
                  Decryption without your unique device key is computationally impossible.
                </div>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">4</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">User-Initiated Background Verification</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  To issue you a trusted Verifiable Credential, your qualifications must be verified.
                </p>
                <ul className="space-y-2 mb-3">
                  {[
                    ['No Forced Providers', 'We do not choose your verifier. You have the absolute freedom to select your preferred verification authority (e.g., Veremark Ltd. or specific Civil Aviation Authorities) from our interface.'],
                    ['Direct Pass-Through', 'When you request a verification, you directly authorise the platform to route your raw, unencrypted source documents to your chosen provider.'],
                    ['Immediate Deletion', 'WM Pilot Group does not store or view these raw documents. Once your verification provider confirms and signs the digital record, all raw source documents are immediately deleted from our pipelines. We retain only an encrypted tracking hash.'],
                  ].map(([title, detail]) => (
                    <li key={title} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-600">{detail}</span></span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 5 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">5</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Accordance with Global Privacy Laws</h2>
                <p className="text-xs text-slate-500 mb-3">
                  Because you retain absolute cryptographic ownership of your identity, your rights under the EU GDPR,
                  Philippines Data Privacy Act (RA 10173), and UAE Federal Decree-Law No. 45 of 2021 are natively built into your dashboard.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { right: 'Right to Erasure', detail: 'Deleting your account instantly triggers an automated script that permanently purges your encrypted data rows from all database environments.' },
                    { right: 'Right to Portability', detail: 'Export your W3C Verifiable Credential to any compatible digital identity wallet at any time.' },
                    { right: 'Consent-First Sharing', detail: 'No airline or operator can see your credentials unless you explicitly approve a digital pull request from your dashboard. Revoke access instantly at any time.' },
                  ].map(({ right, detail }) => (
                    <div key={right} className="bg-green-50 border border-green-100 rounded-xl p-3">
                      <p className="font-bold text-green-800 text-xs mb-1">{right}</p>
                      <p className="text-xs text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">6</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Cryptographic Key Custody & Wallet Security</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Your private access keys are generated natively on your own device using your secure enclave or biometrics (Passkeys/FIDO2).
                </p>
                <ul className="space-y-2 mb-3">
                  {[
                    ['Zero Platform Access', 'We never hold, see, or back up your private keys.'],
                    ['Cloud Syncing', 'If you choose to sync via Google Password Manager or Apple iCloud Keychain, that data is secured via their independent end-to-end encryption.'],
                  ].map(([title, detail]) => (
                    <li key={title} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 mt-1.5 flex-shrink-0" />
                      <span><strong className="text-slate-800">{title}:</strong> <span className="text-slate-600">{detail}</span></span>
                    </li>
                  ))}
                </ul>
                <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-xs text-red-800">
                  <strong>Your Responsibility:</strong> If you lose your devices, local passkeys, or master seed phrases,
                  WM Pilot Group cannot recover your account. Your data will be permanently locked and inaccessible.
                </div>
              </div>
            </div>
          </section>

          {/* 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">7</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Limitation of Liability</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  WM Pilot Group accepts liability strictly for the technical maintenance of its database accounts,
                  code routing infrastructure, and the security of its public credential verification registry.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-2">
                  We explicitly accept <strong className="text-slate-800">no liability</strong> for:
                </p>
                <ul className="space-y-2">
                  {[
                    'Data loss or permanent account lockouts caused by your failure to secure your local cryptographic keys or devices.',
                    'Security breaches or mishandling of data occurring inside the independent systems of the third-party verification provider (e.g., Veremark) that you chose to hire.',
                    'Global outages or systemic technical failures originating from Google (Firebase) or Supabase Inc.',
                  ].map((item, i) => (
                    <li key={i} className="flex items-start gap-2.5 text-sm">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0" />
                      <span className="text-slate-600">{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </section>

          {/* 8 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">8</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Mandatory Safety Revocation</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  As an aviation infrastructure provider, we are legally bound to uphold global aviation safety.
                  If we receive an authenticated, legally binding notice from a competent civil aviation authority
                  (CAAP, GCAA, EASA, FAA, or equivalent) stating that your physical licence or medical certificate
                  has been suspended or cancelled, we reserve the right to publish a revocation flag on your public
                  digital credential registry. <strong className="text-slate-800">This is a safety mandate and does not
                  constitute discretionary processing on our part.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* 9 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">9</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Governing Law & Binding Arbitration</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This Agreement is governed by the laws of the <strong className="text-slate-800">United Arab Emirates</strong>.
                  Any dispute, controversy, or claim arising out of or relating to these terms, or the breach, termination,
                  or invalidity thereof, shall be settled by binding arbitration in accordance with the Arbitration Rules of
                  the Dubai International Arbitration Centre (DIAC). The administrative seat of arbitration shall be Dubai, UAE.
                </p>
              </div>
            </div>
          </section>

          {/* 10 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">10</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Contact Us</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  For any inquiries regarding your cryptographic configurations, technical setup, or to contact our
                  Data Protection Office, please reach out to:{' '}
                  <a href="mailto:privacy@pilotrecognition.com" className="text-indigo-600 hover:underline font-medium">
                    privacy@pilotrecognition.com
                  </a>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center space-y-2">
          <p className="text-xs text-slate-400">
            PR-PPTS-001 · Last Updated: 20 May 2026 · WM Pilot Group
          </p>
          <p className="text-xs text-slate-400">
            By creating an account the Registrant confirms acceptance of this instrument in its entirety.
          </p>
          <div className="flex items-center justify-center gap-4 mt-3 text-xs">
            <a href="/data-controller-agreement" className="text-indigo-600 hover:underline">
              Data Controller Agreement (PR-DCA-001) ↗
            </a>
          </div>
        </div>

      </div>
    </div>
  );
}
