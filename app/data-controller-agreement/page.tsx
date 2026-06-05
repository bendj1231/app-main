import React from 'react';

export default function DataControllerAgreementPage() {
  return (
    <div className="min-h-screen bg-slate-50">
        {/* Coded by Benjamin Bowler */}
      <div className="max-w-3xl mx-auto px-4 py-16">

        {/* Header */}
        <div className="mb-10">
          <div className="inline-flex items-center gap-2 bg-indigo-50 border border-indigo-200 rounded-full px-4 py-1.5 text-xs font-semibold text-indigo-700 mb-4">
            <span className="w-2 h-2 rounded-full bg-indigo-500" />
            Document Reference: PR-DCA-001 · Version 1.8
          </div>
          <h1 className="text-3xl font-black text-slate-900 mb-2">Data Controller Agreement</h1>
          <p className="text-slate-500 text-sm mb-4">
            Operated by Benjamin Bowler — Aviation Pathways Ltd (incorporation pending) · Effective: 02 June 2026
          </p>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-xs text-amber-800 leading-relaxed mb-4">
            <strong>Entity Disclosure:</strong> This agreement is currently entered into with Benjamin Bowler as an individual entrepreneur pending the incorporation of Aviation Pathways Ltd in the Republic of Mauritius. All obligations of the Infrastructure Controller described herein are presently vested in Benjamin Bowler and shall be novated to Aviation Pathways Ltd upon issuance of the Certificate of Incorporation by the Companies and Business Registration Division (CBRD). Until such novation occurs, Benjamin Bowler is the legal Infrastructure Controller and Data Controller for all personal data processed through this platform.
          </div>
          <div className="bg-slate-100 border border-slate-200 rounded-xl p-4 text-xs text-slate-600 leading-relaxed">
            This instrument constitutes a binding infrastructure and data governance agreement between the Data Subject
            (the Registrant, hereinafter the <em>Credential Custodian</em>) and Benjamin Bowler (hereinafter the{' '}
            <em>Infrastructure Controller</em> or <em>the Platform</em>), pending novation to Aviation Pathways Ltd upon incorporation, effective immediately upon account creation in Terminal 1.
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">

          {/* 1 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">1</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 1 — Decentralized Credential Architecture & Roles</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-4">
                  Pursuant to GDPR Art. 4(7), RA 10173 s.3(h), and UAE Federal Decree-Law No. 45/2021 Art. 1,
                  this platform operates on a <strong className="text-slate-800">Self-Sovereign Identity (SSI) framework using W3C Decentralized Identifiers (DIDs) and Verifiable Credentials (VCs)</strong>.
                  Data processing roles within this ecosystem are strictly bifurcated across independent parties:
                </p>
                <div className="space-y-3">
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <p className="text-xs font-bold text-slate-800 mb-1">1. Infrastructure Controller (The Platform) — Aviation Pathways Ltd</p>
                    <p className="text-xs text-slate-600">Aviation Pathways Ltd acts as an <strong className="text-slate-700">Independent Data Controller strictly for platform infrastructure, ecosystem routing, and gate governance</strong>. The Platform determines the purposes and means of processing only for: account creation, security session handling (Auth0), passkey synchronization, billing/payment orchestration, and the secure routing of API webhooks to third-party verifiers. The Platform stores user profile data, minimal structured verification outcomes (status, check ID, timestamp only), and cryptographically signed Verifiable Credentials (VCs) in encrypted database environments (AES-256-GCM at rest via Supabase). Detailed verification receipts containing full credential data (PEL numbers, medical dates, license classes, examiner names, etc.) are sent directly to the Credential Custodian's email by the third-party verifier and are never transmitted to, viewed by, or stored on the Platform. Raw documents uploaded by users are forwarded directly to the selected third-party verifier and are not retained by the Platform.</p>
                  </div>
                  <div className="bg-indigo-50 rounded-xl p-4 border border-indigo-100">
                    <p className="text-xs font-bold text-indigo-800 mb-1">2. Credential Custodian — The Registrant</p>
                    <p className="text-xs text-slate-600">The Registrant natively holds, owns, and controls their master cryptographic identity credential via their local device hardware. The Registrant acts as the primary Data Controller of their personal identity records, determines the lifecycle of their data, and must explicitly initiate all verification and sharing pathways.</p>
                  </div>
                  <div className="bg-violet-50 rounded-xl p-4 border border-violet-100">
                    <p className="text-xs font-bold text-violet-800 mb-1">3. Verification Controllers — Third-Party Verification Providers & Regional IDPs</p>
                    <p className="text-xs text-slate-600">When the Registrant initiates a verification flow to enter Terminal 3, they establish a direct, independent consent agreement with the selected third-party provider (e.g., Veremark Ltd.). These parties act as <strong className="text-slate-700">Independent Data Controllers</strong> for the purpose of querying and verifying raw credential data against civil aviation authorities and ATOs. The Platform merely routes the user-directed transaction and accepts no liability for these external operations.</p>
                  </div>
                  <div className="bg-amber-50 rounded-xl p-4 border border-amber-100">
                    <p className="text-xs font-bold text-amber-800 mb-1">4. Ecosystem Operators & Airlines — Destination Terminals</p>
                    <p className="text-xs text-slate-600">When the Registrant explicitly routes their profile to an operator lounge (Terminal 2) or an enterprise airline gate (Terminal 3), the receiving airline or operator assumes the role of an <strong className="text-slate-700">Independent Data Controller</strong> the instant they access the data. The Platform acts solely as the connecting skybridge and accepts no liability for subsequent employer processing, hiring decisions, or data retention by the destination terminal.</p>
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
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 2 — Cryptographic Isolation & Data Coupling</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  All personal data fields are encrypted <strong className="text-slate-800">at rest using AES-256-GCM</strong> within the Platform's
                  Supabase-hosted PostgreSQL database. Data in transit is protected via TLS 1.3. The Platform issues and signs
                  W3C Verifiable Credentials (VCs) under its <code>did:web:pilotrecognition.com</code> DID, which act as cryptographic
                  access tickets for verified pilots. These VCs are stored both in the user's self-custodied wallet and retained
                  server-side as signed records for revocation purposes.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <strong>Data Hosting:</strong> The Platform stores structured user profile data, verification outcomes, and signed VC records
                  in encrypted database environments. Raw scanned documents uploaded for verification are forwarded directly to the
                  user-selected third-party verifier and are deleted from Platform infrastructure within 24 hours. The Platform
                  does not have the technical ability to decrypt or read raw documents forwarded to external verifiers.
                </div>
              </div>
            </div>
          </section>

          {/* 3 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">3</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 3 — Multi-Engine Storage Redundancy Configuration</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  The Platform provides two isolated, independent database environments: the <strong className="text-slate-800">Supabase Inc.</strong> infrastructure environment
                  and the <strong className="text-slate-800">Google LLC (Firebase)</strong> infrastructure environment (both listed as approved technical sub-processors in Article 9).
                </p>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  To ensure system availability and disaster recovery compliance under GDPR Article 32, the Platform provides a <strong className="text-slate-800">&ldquo;Multi-Engine&rdquo; configuration</strong> enabling
                  simultaneous active-active mirroring of encrypted ciphertext to both environments. The Credential Custodian retains absolute freedom of choice
                  to select a single-engine or multi-engine configuration via their account settings.
                </p>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 text-xs text-amber-800">
                  <strong>Operational Risk Notice:</strong> If the Credential Custodian manually de-selects the recommended Multi-Engine setup and elects a
                  single-database configuration, they assume all operational risks regarding localized infrastructure vendor outages or downtime for that engine.
                </div>
              </div>
            </div>
          </section>

          {/* 4 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">4</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 4 — User-Initiated Airspace & Routing Pathways</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  <strong className="text-slate-800">The Platform does not select, mandate, or default the Credential Custodian to any specific employment or verification pipeline.</strong>{' '}
                  The platform interface is divided into two distinct destination lanes:
                </p>
                <ul className="space-y-2 mb-3">
                  {[
                    ['Terminal 2 — The Open/Free Lounge', 'A pass-through corridor where the Credential Custodian may route unverified, self-declared digital resumes and logbooks to regional operators or flight schools. The Platform does not verify this cargo; the receiving operator assumes full Independent Controller status and sole verification liability upon receipt.'],
                    ['Terminal 3 — The International Standards Zone', 'A premium, firewalled lounge restricted to candidates with fully verified compliance profiles. To open enterprise airline gates, the Credential Custodian must issue an explicit, paid instruction to launch a verification flight via Veremark Ltd. to poll designated civil aviation authorities and ATOs. The verifier sends the Credential Custodian a full detailed verification receipt directly to their email (containing PEL numbers, medical dates, license classes, examiner names, etc.). The Platform never intercepts raw data or detailed receipts; it receives only a minimal structured webhook outcome (status, check ID, timestamp) and issues a cryptographically signed Verifiable Credential (VC) as an access ticket. The user wallet displays a simplified status: last verified check date and validity period (typically 1 year).'],
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
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 5 — Passkey & Credential Custody (The Passport Issuer)</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Private cryptographic keys are generated exclusively on the Credential Custodian's local device within its Trusted Platform Module (TPM) or Secure Enclave.
                  Account access and key recovery are tethered to the user's federated ecosystem provider (Google Passkey & 2-Factor Authentication via Auth0).{' '}
                  <strong className="text-slate-800">The Platform does not, at any point in the data lifecycle, have custody of, access to, or the ability to replicate or reset any private key material.</strong>
                </p>
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 text-xs text-slate-600">
                  Google LLC acts as the Passport Issuer. If the Credential Custodian loses access to their federated Google account, recovery must be handled via the Issuer.
                  The Platform cannot override a cryptographic lockout.
                </div>
              </div>
            </div>
          </section>

          {/* 6 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">6</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 6 — System Lifecycle & Data Subject Rights</h2>
                <p className="text-xs text-slate-500 mb-3">
                  Because data is bound to a decentralised credential, rights under GDPR Chapter III,
                  RA 10173 Sections 16–18, and UAE Federal Decree-Law No. 45/2021 Art. 14 are natively
                  integrated into the user interface for self-execution.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { right: 'Right to Erasure (Art. 17 GDPR)', detail: 'Triggers a permanent, unrecoverable purge of ciphertext rows from all database environments via the user dashboard.' },
                    { right: 'Right to Portability (Art. 20 GDPR)', detail: 'Natively fulfilled via portability of the W3C Verifiable Credential — exportable to any compatible SSI wallet framework.' },
                    { right: 'Right of Access (Art. 15 GDPR)', detail: 'Real-time visibility of all data holdings and processing activity logs through the user interface.' },
                    { right: 'Right to Object (Art. 21 GDPR)', detail: 'Withdrawal of consent for non-essential processing. Objection to essential processing results in account being placed on review or hold with non-refundable status.' },
                    { right: 'Right to Restriction (Art. 18 GDPR)', detail: 'Suspension of active processing pending dispute resolution.' },
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

          {/* 7 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">7</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 7 — Infrastructure Liability Limitations</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  The Platform accepts liability solely for the server-side uptime of its routing code, the baseline security configuration of its database layers,
                  and the architectural correctness of its public credential verification registry.
                </p>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The Platform explicitly accepts <strong className="text-slate-800">no liability</strong> for:
                  (i) <strong className="text-slate-800">Infrastructure vendor breaches</strong> — global security incidents, data leaks, or outages originating within the separate networks of Supabase Inc. or Google LLC;
                  (ii) <strong className="text-slate-800">Third-party verification & IDP failures</strong> — security incidents or compliance failures within the independent networks of the user-selected third-party verification provider, civil aviation authorities, or user-nominated ATOs;
                  (iii) <strong className="text-slate-800">Employment actions</strong> — hiring decisions, data retention misconduct, or labour disputes arising after an airline or operator accesses a profile via Terminal 2 or Terminal 3.
                </p>
              </div>
            </div>
          </section>

          {/* 8 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">8</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 8 — Mandatory Aviation Safety Registry Updates</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The Platform reserves the right to publish a technical revocation or suspension status flag on its <strong className="text-slate-800">public verification registry</strong> upon receiving
                  an authenticated, legally binding directive from a competent civil aviation authority (CAAP, GCAA, EASA, FAA, or equivalent).
                  This is an automated aviation safety compliance obligation.{' '}
                  <strong className="text-slate-800">This action updates the revocation status of the affected Verifiable Credential without modifying the underlying user profile data.</strong>
                </p>
              </div>
            </div>
          </section>

          {/* 9 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">9</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 9 — Mauritius Data Controller Registration & Legal Basis</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  <strong className="text-slate-800">Aviation Pathways Ltd</strong> shall apply for registration as a <strong className="text-slate-800">Data Controller</strong> with the
                  Data Protection Office of Mauritius under the Data Protection Act 2017 (as amended) within 14 days of commencing data processing activities.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-3">
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="font-bold text-green-800 text-xs mb-1">Registration Authority</p>
                    <p className="text-xs text-slate-600">Data Protection Office, Republic of Mauritius</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="font-bold text-green-800 text-xs mb-1">Annual Registration Fee</p>
                    <p className="text-xs text-slate-600">MUR 1,000 (approximately USD 22)</p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-3">
                    <p className="font-bold text-green-800 text-xs mb-1">Legal Entity</p>
                    <p className="text-xs text-slate-600">Aviation Pathways Limited, Mauritius</p>
                  </div>
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-3">
                    <p className="font-bold text-amber-800 text-xs mb-1">Registration Status</p>
                    <p className="text-xs text-slate-600">Pending — Application to be filed within 14 days of commencing data processing activities</p>
                  </div>
                </div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Upon registration as a Data Controller under Mauritian law, Aviation Pathways Ltd shall be lawfully entitled to
                  custody Verifiable Credentials (VCs) on behalf of pilots who provide explicit consent for
                  infrastructure custody. This registration shall enable the Platform to hold encrypted credential
                  data, route verification requests, and maintain wallet infrastructure while remaining compliant
                  with Mauritius Data Protection Act obligations.
                </p>
              </div>
            </div>
          </section>

          {/* 10 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">10</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 10 — Approved Technical Sub-Processors (GDPR Art. 28(2))</h2>
                <p className="text-xs text-slate-500 mb-3">
                  To maintain the core routing infrastructure, the Platform utilises the following technical sub-processors:
                </p>
                <div className="overflow-x-auto">
                  <table className="w-full text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-50">
                        <th className="text-left px-3 py-2 border border-slate-200 font-semibold text-slate-700">Sub-Processor</th>
                        <th className="text-left px-3 py-2 border border-slate-200 font-semibold text-slate-700">Role & Data Held</th>
                      </tr>
                    </thead>
                    <tbody className="text-slate-600">
                      {[
                        ['Supabase Inc.', 'Primary database — stores encrypted user profiles, credential metadata, signed VC records, and verification outcomes. Hosted in Sydney (ap-southeast-2).'],
                        ['Neon PostgreSQL', 'Secondary database — OEM data, pathway cards, IPFS CID index. Hosted in Singapore (ap-southeast-1).'],
                        ['MongoDB Atlas', 'Document store — raw aviation API payloads, flight telemetry, logbook JSON. Hosted in Singapore (ap-southeast-1).'],
                        ['Auth0 by Okta Inc.', 'Federated authentication routing — holds zero pilot profile data.'],
                        ['walt.id GmbH', 'Verifiable Credential wallet framework — private key custody remains exclusively with the Data Controller.'],
                      ].map(([proc, data], i) => (
                        <tr key={proc} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                          <td className="px-3 py-2 border border-slate-200 font-medium">{proc}</td>
                          <td className="px-3 py-2 border border-slate-200">{data}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </section>

          {/* 11 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">11</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 11 — B2B Co-Marketplace Agreements</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  The Credential Custodian acknowledges that third-party digital logbook providers, flight schools, and operators may function as nodes within the platform network.
                  Commercial transaction structures, gate-activation fees, or affiliation credits exchanged between the Platform and external entities
                  (e.g., a 5% integration credit for verified logbook streams) are strictly <strong className="text-slate-800">operational B2B infrastructure agreements</strong>.
                  They do not grant third parties unauthorized access to the Credential Custodian's encrypted vault,
                  nor do they bypass the user-directed presentation model.
                </p>
              </div>
            </div>
          </section>

          {/* 12 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">12</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 12 — Age & Operational Gate Restrictions</h2>
                <p className="text-sm text-slate-600 leading-relaxed mb-3">
                  Pursuant to international aviation standards and jurisdictional child privacy statutory rules — including GDPR Art. 8, Republic Act No. 10173 s.12 (Philippines), and UAE Federal Decree-Law No. 45/2021 Art. 6 — special operational constraints apply to legal minors (under 18 years of age) and holders of a Student Pilot License (or equivalent Student Pilot Authorization):
                </p>
                <div className="space-y-2">
                  {[
                    { title: 'View-Only Access', detail: 'Minor and Student Pilot accounts are fully permitted to navigate Terminal 1, view available career pathways, and utilise logbook tracking infrastructure.', color: 'amber' },
                    { title: 'Terminal 3 Firewall', detail: 'Minor and Student Pilot accounts are structurally restricted from launching third-party verification flights or submitting profiles to premium international airline gates within Terminal 3.', color: 'amber' },
                    { title: 'Terminal 2 Routing', detail: 'Eligible Student Pilots may be routed exclusively to designated flight school lounges or cadet-track pathways within Terminal 2 that accept unverified or self-declared training data.', color: 'amber' },
                  ].map(({ title, detail }) => (
                    <div key={title} className="bg-amber-50 border border-amber-100 rounded-xl p-3">
                      <p className="font-bold text-amber-800 text-xs mb-1">{title}</p>
                      <p className="text-xs text-slate-600">{detail}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* 13 */}
          <section className="bg-white rounded-2xl border border-slate-200 p-6">
            <div className="flex items-start gap-4">
              <span className="text-2xl font-black text-indigo-600 leading-none">13</span>
              <div className="flex-1">
                <h2 className="text-lg font-bold text-slate-900 mb-2">Article 13 — Governing Law & Dispute Resolution</h2>
                <p className="text-sm text-slate-600 leading-relaxed">
                  This Agreement is governed by the laws of the
                  <strong className="text-slate-800"> Republic of Mauritius</strong>, with supplementary application of
                  EU Regulation 2016/679 (GDPR) for EU/EEA residents, and Republic Act No. 10173 for Philippine nationals or residents.
                  Any dispute arising from this Agreement or its technical architecture shall be referred to and finally resolved
                  by binding arbitration under the Rules of the Mauritius International Arbitration Centre (MIAC), with the administrative seat in Port Louis, Mauritius.
                </p>
                <p className="text-xs text-slate-400 mt-3">
                  Data protection enquiries: <a href="mailto:privacy@pilotrecognition.com" className="text-indigo-600 hover:underline">privacy@pilotrecognition.com</a> · <a href="/dpo" className="text-indigo-600 hover:underline">DPO Portal</a>
                </p>
              </div>
            </div>
          </section>

        </div>

        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="text-xs text-slate-400">
            PR-DCA-001 v1.8 — 02 June 2026 — Aviation Pathways Ltd
          </p>
          <p className="text-xs text-slate-400 mt-1">
            By creating an account the Registrant confirms acceptance of this instrument in its entirety.
          </p>
        </div>

      </div>
    </div>
  );
}
