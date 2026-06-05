'use client';

import React from 'react';
import { Link } from 'react-router-dom';

export default function PilotTerminalGuidelinesPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <div className="container mx-auto px-4 py-16 max-w-4xl">
        <div className="mb-8">
          <span className="text-yellow-400 font-bold text-sm uppercase tracking-wider">PilotTerminal.com</span>
          <h1 className="text-3xl font-bold mt-2">Community Guidelines</h1>
        </div>

        <div className="space-y-8 text-slate-300">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Pilot Verification Required</h2>
            <p className="text-sm leading-relaxed">
              All members must hold a valid pilot certificate. We verify your license through our partner network.
              No recruiters, no bots, no fake accounts.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Respect & Professionalism</h2>
            <p className="text-sm leading-relaxed">
              This is a professional aviation community. Treat fellow pilots with respect. No harassment,
              discrimination, or personal attacks. Disagree professionally.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. No Recruiting</h2>
            <p className="text-sm leading-relaxed">
              Recruiters and HR representatives are not permitted. This space is for pilots to talk freely
              without corporate oversight.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Data & Privacy</h2>
            <p className="text-sm leading-relaxed">
              Messages in public channels are visible to all members. DMs are end-to-end encrypted.
              We do not sell your data. For full details, see our{' '}
              <Link to="/privacy-policy" className="text-yellow-400 hover:underline">Privacy Policy</Link>.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">5. Enforcement</h2>
            <p className="text-sm leading-relaxed">
              Violations may result in warnings, temporary suspension, or permanent ban. Moderation
              decisions are final. Appeals may be sent to{' '}
              <a href="mailto:privacy@pilotrecognition.com" className="text-yellow-400 hover:underline">privacy@pilotrecognition.com</a>.
            </p>
          </section>
        </div>

        <div className="mt-12 pt-8 border-t border-gray-800 text-sm text-slate-500">
          <p>Last updated: 02 June 2026 · Operated by Benjamin Bowler · Pending incorporation of Aviation Pathways Ltd ·{' '}
            <Link to="/dpo" className="text-yellow-400 hover:underline">Data Protection Officer</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
