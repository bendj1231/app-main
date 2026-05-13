import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Aviation Background Checks: Verify Once, Hire Anywhere | PilotRecognition',
  description: 'Pre-cleared pilot status via trusted verification. Identity, license, medical, criminal, employment checks. Airlines hire with zero delay.',
  keywords: 'aviation background checks, pilot verification API, pre-cleared pilot status, PRIA compliance',
};

export default function VeremarkPartnershipPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="border-b p-4">
        <div className="max-w-4xl mx-auto flex justify-between">
          <Link href="/" className="font-bold">PilotRecognition</Link>
          <Link href="/enterprise-access">Enterprise →</Link>
        </div>
      </nav>

      <main className="max-w-4xl mx-auto px-6 py-12">
        <header className="text-center mb-12">
          <p className="text-sm text-cyan-600 font-semibold">VERIFICATION LAYER</p>
          <h1 className="text-4xl font-bold my-4">Verify Once.<br/>Hire Anywhere.</h1>
          <p className="text-xl text-slate-600">Pre-cleared pilot status. 9 background checks. Blockchain-backed. Trusted worldwide.</p>
        </header>

        <section className="mb-12 bg-cyan-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The 9-Check Verification</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-white p-4 rounded-lg">✓ Identity Verification</div>
            <div className="bg-white p-4 rounded-lg">✓ License Validation</div>
            <div className="bg-white p-4 rounded-lg">✓ Medical Certificate</div>
            <div className="bg-white p-4 rounded-lg">✓ Criminal Background</div>
            <div className="bg-white p-4 rounded-lg">✓ Employment History</div>
            <div className="bg-white p-4 rounded-lg">✓ Education Verify</div>
            <div className="bg-white p-4 rounded-lg">✓ Right to Work</div>
            <div className="bg-white p-4 rounded-lg">✓ Reference Checks</div>
            <div className="bg-white p-4 rounded-lg">✓ Insurance Status</div>
          </div>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How It Works</h2>
          <ol className="space-y-3">
            <li>1. <strong>Pilot Completes Checks:</strong> One-time verification via trusted third-party</li>
            <li>2. <strong>Blockchain Wallet:</strong> Verified credentials stored securely</li>
            <li>3. <strong>Airlines Pull:</strong> Zero additional screening required</li>
            <li>4. <strong>Real-Time Updates:</strong> Medical and license status always current</li>
          </ol>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-cyan-600 text-white px-6 py-3 rounded-lg font-semibold">
            Access Verified Pilots →
          </Link>
        </div>
      </main>
    </div>
  );
}
