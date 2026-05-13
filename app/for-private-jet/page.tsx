import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Private Jet Operators: Verified Pilots in 48 Hours | PilotRecognition',
  description: 'Corporate and VIP charter operators access pre-cleared pilots with client-facing competencies. Hire verified crew fast.',
};

export default function ForPrivateJetPage() {
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
          <p className="text-sm text-purple-600 font-semibold">FOR PRIVATE JET OPERATORS</p>
          <h1 className="text-4xl font-bold my-4">Verified Pilots<br/>in 48 Hours</h1>
          <p className="text-xl text-slate-600">VIP charter needs professional versatility. Access pre-cleared pilots with proven client-facing skills.</p>
        </header>

        <section className="mb-12 bg-purple-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The VIP Challenge</h2>
          <p>Private aviation requires pilots who can handle diverse aircraft types and high-profile clients. You need verified soft skills, not just flight hours.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Specialized Access</h2>
          <ul className="space-y-2">
            <li>✓ Client service competency verified</li>
            <li>✓ Multi-aircraft type ratings</li>
            <li>✓ Discretion and professionalism scores</li>
            <li>✓ Flexible scheduling availability</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-purple-600 text-white px-6 py-3 rounded-lg font-semibold">
            Find VIP Pilots →
          </Link>
        </div>
      </main>
    </div>
  );
}
