/**
 * pilotshortage.org/wallet - Anonymous Wallet for PSA Pilots
 * 
 * This page allows pilots on the advocacy platform to create
 * zero-knowledge wallets for submitting verified anonymous stories.
 */

'use client';

import { ShortageWalletPage } from '../../../components/domains/shortage/ShortageWalletPage';
import { DataCustodyExplainer } from '../../../components/website/components/DataCustodyExplainer';

export const metadata = {
  title: 'Anonymous Wallet | Pilot Shortage Alliance',
  description: 'Create a zero-knowledge wallet to verify your pilot status while staying anonymous.',
};

export default function WalletPage() {
  // TODO: Wire up client-side auth check (useAuth hook + useNavigate)
  // Previously: server-side auth + redirect via Next.js
  const profile = { id: '', auth0_id: '' };
  const user = { id: '' };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* PSA Header */}
      <header className="border-b border-slate-800 bg-slate-900">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-amber-400 font-bold text-lg">Pilot Shortage Alliance</h1>
              <p className="text-slate-400 text-sm">Anonymous Story Wallet</p>
            </div>
            <div className="flex items-center gap-2">
              <div className="bg-red-500/20 text-red-400 text-xs px-2 py-1 rounded-full border border-red-500/30">
                Powered by pilotrecognition.com
              </div>
              <div className="text-slate-500 text-xs">
                Private • Secure • Verified
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8">
        {/* Powered by badge */}
        <div className="mb-6 bg-gradient-to-r from-red-900/40 to-slate-900 border border-red-500/30 rounded-xl p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="bg-red-500 text-white w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm">
              PR
            </div>
            <div>
              <p className="text-white font-medium text-sm">Pilot Wallet</p>
              <p className="text-slate-400 text-xs">powered by pilotrecognition.com</p>
            </div>
          </div>
          <a 
            href="https://pilotrecognition.com/wallet" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-red-400 text-xs hover:text-red-300 transition-colors"
          >
            Learn more →
          </a>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-2">
            Your Anonymous Identity
          </h2>
          <p className="text-slate-400">
            Create cryptographic proof that you're a real pilot without revealing who you are.
            This lets PSA verify your stories while protecting your anonymity.
          </p>
        </div>

        {profile ? (
          <ShortageWalletPage 
            auth0Id={profile.auth0_id || user.id} 
            profileId={profile.id} 
          />
        ) : (
          <div className="bg-slate-900 border border-slate-800 rounded-xl p-8 text-center">
            <p className="text-slate-400">Complete your profile to create a wallet.</p>
          </div>
        )}

        {/* Data Custody Explanation */}
        <div className="mt-12 bg-slate-900 border border-slate-800 rounded-xl p-6">
          <h3 className="text-amber-400 font-semibold mb-4">🔐 Where Your Data Lives</h3>
          <DataCustodyExplainer compact />
          <p className="text-slate-500 text-xs mt-4">
            <strong>Anonymous mode:</strong> For PSA stories, your documents stay with local authorities 
            in your country. We only receive a cryptographic proof that you're a pilot — 
            no license numbers, no personal details.
          </p>
        </div>

        {/* Footer branding */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex items-center justify-center gap-2 text-slate-500 text-sm">
            <span>🔐 Secured by</span>
            <a href="https://pilotrecognition.com" target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 font-medium">
              pilotrecognition.com Pilot Wallet
            </a>
          </div>
          <p className="text-slate-600 text-xs text-center mt-2">
            W3C Verifiable Credentials • Decentralized Identity • Zero-Knowledge Proofs
          </p>
        </div>

        {/* Info Section */}
        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-amber-400 font-medium mb-2">Zero Knowledge</h3>
            <p className="text-slate-400 text-sm">
              We verify you're a pilot without learning your identity. 
              License numbers are hashed before transmission.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-amber-400 font-medium mb-2">Story Credibility</h3>
            <p className="text-slate-400 text-sm">
              Verified pilot stories carry more weight with media and policymakers.
              Your voice matters more when proven authentic.
            </p>
          </div>
          <div className="bg-slate-900 border border-slate-800 rounded-lg p-4">
            <h3 className="text-amber-400 font-medium mb-2">Full Control</h3>
            <p className="text-slate-400 text-sm">
              You control your credentials. Delete your wallet anytime. 
              No data is retained after deletion.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
