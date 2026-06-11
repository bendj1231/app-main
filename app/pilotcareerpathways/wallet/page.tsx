/**
 * pilotcareerpathways.com/verification-status — Pilot Verification Status
 * 
 * Displays the pilot's cryptographic verification status linked from pilotrecognition.com.
 * Drives access to pathway tiers and airline gate matching.
 */

'use client';

import { VerificationStatusPage } from '../../../components/domains/careerpathways/VerificationStatusPage';
import { DataCustodyExplainer } from '../../../components/website/components/DataCustodyExplainer';

export const metadata = {
  title: 'Verification Status | Pilot Career Pathways',
  description: 'Your cryptographic verification status — powered by pilotrecognition.com. Unlocks pathway tiers and airline gate access.',
};

export default function VerificationStatusRoutePage() {
  // TODO: Wire up client-side auth check (useAuth hook + useNavigate)
  // Previously: server-side auth + redirect via Next.js
  const profile = { id: '', auth0_id: '' };
  const user = { id: '' };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Pathways Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-cyan-600 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold">
                P
              </div>
              <div>
                <h1 className="text-slate-900 font-bold">Pilot Career Pathways</h1>
                <p className="text-slate-500 text-sm">Verification Status</p>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-2 bg-cyan-50 px-3 py-1.5 rounded-lg border border-cyan-200">
              <div className="bg-cyan-600 text-white w-5 h-5 rounded flex items-center justify-center text-xs font-bold">
                PR
              </div>
              <span className="text-cyan-700 text-xs font-medium">powered by pilotrecognition.com</span>
            </div>
            <nav className="flex gap-4 text-sm">
              <a href="/" className="text-slate-600 hover:text-cyan-600">Pathways</a>
              <a href="/programs" className="text-slate-600 hover:text-cyan-600">Programs</a>
              <a href="/verification-status" className="text-cyan-600 font-medium">Verification Status</a>
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {/* Powered by badge */}
        <div className="mb-6 bg-gradient-to-r from-cyan-50 to-white border border-cyan-200 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-cyan-600 text-white w-10 h-10 rounded-lg flex items-center justify-center font-bold">
              PR
            </div>
            <div>
              <p className="text-slate-900 font-semibold">Verification Status</p>
              <p className="text-slate-500 text-sm">powered by pilotrecognition.com</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-slate-600 text-sm">Self-hosted • P-256 Signing</p>
              <p className="text-slate-500 text-xs">W3C Verifiable Credentials</p>
            </div>
            <a 
              href="https://pilotrecognition.com/wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
            >
              Explore Wallet
            </a>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Your Verification Status
          </h2>
          <p className="text-slate-600 max-w-2xl">
            Your cryptographic verification status from pilotrecognition.com controls which pathway tiers and airline gates you can access on pilotcareerpathways.com.
          </p>
        </div>

        {/* Verified Badge */}
        <div className="mb-6 bg-gradient-to-r from-green-50 to-emerald-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
          <div className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <div>
            <p className="text-green-800 font-semibold">Verified Pilot</p>
            <p className="text-green-600 text-sm">Your credentials have been verified. You have full access to career pathways.</p>
          </div>
        </div>

        {profile ? (
          <VerificationStatusPage 
            auth0Id={profile.auth0_id || user.id} 
            profileId={profile.id} 
          />
        ) : (
          <div className="bg-white border border-slate-200 rounded-2xl p-8 text-center">
            <p className="text-slate-600">Complete your profile to create a wallet.</p>
          </div>
        )}

        {/* Footer branding */}
        <div className="mt-12 pt-8 border-t border-slate-200">
          <div className="flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-lg">
              <div className="bg-cyan-600 text-white w-6 h-6 rounded flex items-center justify-center text-xs font-bold">
                PR
              </div>
              <span className="text-slate-700 font-medium">Powered by pilotrecognition.com Pilot Wallet</span>
            </div>
            <p className="text-slate-500 text-sm text-center max-w-lg">
              All credentials are cryptographically signed using PilotRecognition's self-hosted 
              <span className="font-mono text-cyan-600"> did:web:pilotrecognition.com</span> infrastructure.
            </p>
            <a 
              href="https://pilotrecognition.com/wallet" 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-cyan-600 hover:text-cyan-700 text-sm font-medium"
            >
              Learn more about Pilot Wallet →
            </a>
          </div>
        </div>

        {/* Data Custody Explanation */}
        <div className="mt-12 bg-white border border-slate-200 rounded-xl p-6">
          <h3 className="text-slate-900 font-semibold mb-4">🔐 Where Your Data Lives</h3>
          <DataCustodyExplainer compact />
          <p className="text-slate-500 text-sm mt-4">
            <strong>Career mode:</strong> Your credentials are cryptographically signed and stored 
            in your device. We keep text records (license number, expiry, hours) for verification lookup. 
            Physical documents are managed by verification authorities in your country.
          </p>
        </div>

        {/* Trust Indicators */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-1">W3C</div>
            <p className="text-slate-600 text-sm">Standard Verifiable Credentials</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-1">DID</div>
            <p className="text-slate-600 text-sm">Decentralized Identity</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-1">P-256</div>
            <p className="text-slate-600 text-sm">Military-Grade Encryption</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <div className="text-2xl font-bold text-cyan-600 mb-1">0s</div>
            <p className="text-slate-600 text-sm">Instant Verification</p>
          </div>
        </div>
      </main>
    </div>
  );
}
