import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Flight Schools: Guarantee Graduate Recognition | PilotRecognition',
  description: 'Flight schools partner with PilotRecognition to guarantee graduates get recognized by airlines. Bridge the 200-1500 hour gap.',
};

export default function ForFlightSchoolsPage() {
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
          <p className="text-sm text-green-600 font-semibold">FOR FLIGHT SCHOOLS</p>
          <h1 className="text-4xl font-bold my-4">Guarantee Your Graduates<br/>Get Recognized</h1>
          <p className="text-xl text-slate-600">Bridge the 200-1500 hour gap. Partner with the industry recognition platform.</p>
        </header>

        <section className="mb-12 bg-green-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The Graduate Employment Problem</h2>
          <p>Graduates with 200 hours cannot get airline jobs. The instructor line is 2-3 years long. Your students need alternative pathways.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">How Schools Benefit</h2>
          <ul className="space-y-2">
            <li>✓ Guaranteed graduate recognition pathway</li>
            <li>✓ Industry-aligned curriculum validation</li>
            <li>✓ Data sharing with airline partners</li>
            <li>✓ Revenue share on verified graduates</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold">
            Partner With Us →
          </Link>
        </div>
      </main>
    </div>
  );
}
