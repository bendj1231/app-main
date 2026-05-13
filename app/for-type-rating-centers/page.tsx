import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Type Rating Centers: Screen Before Simulator | PilotRecognition',
  description: 'TRTOs use PilotRecognition to pre-screen candidates. Verify prerequisites and competency before they touch the simulator.',
};

export default function ForTypeRatingCentersPage() {
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
          <p className="text-sm text-teal-600 font-semibold">FOR TYPE RATING CENTERS</p>
          <h1 className="text-4xl font-bold my-4">Screen Candidates<br/>Before the Simulator</h1>
          <p className="text-xl text-slate-600">Stop wasting simulator slots on unprepared candidates. Pre-verify prerequisites and readiness.</p>
        </header>

        <section className="mb-12 bg-teal-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The Simulator Waste Problem</h2>
          <p>Candidates arrive without verified hours, expired medicals, or missing prerequisites. Every no-show costs thousands in lost simulator time.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Pre-Screening Benefits</h2>
          <ul className="space-y-2">
            <li>✓ Verified hours and currency</li>
            <li>✓ Valid medical certificates</li>
            <li>✓ English proficiency confirmed</li>
            <li>✓ Recognition scores predict success</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/enterprise-access" className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold">
            Start Pre-Screening →
          </Link>
        </div>
      </main>
    </div>
  );
}
