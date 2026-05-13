import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Airlines: Hire Pre-Cleared Pilots | PilotRecognition',
  description: 'Airlines use PilotRecognition to pull verified, pre-cleared pilots directly. Skip resume screening. 500K pilot shortage by 2030.',
};

export default function ForAirlinesPage() {
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
          <p className="text-sm text-blue-600 font-semibold">FOR AIRLINES</p>
          <h1 className="text-4xl font-bold my-4">Hire Pre-Cleared Pilots.<br/>Stop Sifting Through Resumes.</h1>
          <p className="text-xl text-slate-600">500,000 pilot shortage by 2030. Pull verified candidates instantly.</p>
        </header>

        <section className="mb-12 bg-blue-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The Problem</h2>
          <p>500+ resumes per posting. 6-12 month time-to-hire. 80% unqualified.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">The Solution: Pull System</h2>
          <p>Pilots verify once. You filter and pull. Hire immediately with zero delay.</p>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold">
            See Pre-Cleared Pilots →
          </Link>
        </div>
      </main>
    </div>
  );
}
