import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Cargo Operators: Pull Verified Pilots | PilotRecognition',
  description: 'Cargo and freight operators use PilotRecognition to access pre-cleared, verified pilots. Skip the screening bottleneck.',
};

export default function ForCargoOperatorsPage() {
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
          <p className="text-sm text-orange-600 font-semibold">FOR CARGO OPERATORS</p>
          <h1 className="text-4xl font-bold my-4">Pull Verified Pilots.<br/>Not Paperwork.</h1>
          <p className="text-xl text-slate-600">Cargo operators need multi-crew coordination specialists. Access pre-cleared candidates instantly.</p>
        </header>

        <section className="mb-12 bg-orange-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The Cargo Hiring Challenge</h2>
          <p>Cargo operations require specialized handling skills. Traditional hiring cannot screen for multi-crew coordination under pressure. You need verified competency data.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">What You Get</h2>
          <ul className="space-y-2">
            <li>✓ Pilots with multi-crew experience verified</li>
            <li>✓ Specialized handling competency scores</li>
            <li>✓ Night and freight operation backgrounds</li>
            <li>✓ Real-time availability status</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold">
            Access Verified Pilots →
          </Link>
        </div>
      </main>
    </div>
  );
}
