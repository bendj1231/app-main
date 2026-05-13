import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'For Flight Instructors: You Are Not Stuck | PilotRecognition',
  description: 'Flight instructors with 5,000+ hours get recognized and pulled by operators. Break out of the instructor trap.',
};

export default function ForFlightInstructorsPage() {
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
          <p className="text-sm text-indigo-600 font-semibold">FOR FLIGHT INSTRUCTORS</p>
          <h1 className="text-4xl font-bold my-4">You Are Not Stuck.<br/>You Are Unrecognized.</h1>
          <p className="text-xl text-slate-600">5,000-hour instructors stay trapped teaching. Get verified and pulled by operators who value your skills.</p>
        </header>

        <section className="mb-12 bg-indigo-50 p-6 rounded-xl">
          <h2 className="text-2xl font-bold mb-4">The Instructor Trap</h2>
          <p>You have 5,000-6,000 hours and 15 years experience. But the line to airlines is backed up 2-3 years. Meanwhile, your skills are invisible to cargo, charter, and corporate operators.</p>
        </section>

        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-4">Get Recognized</h2>
          <ul className="space-y-2">
            <li>✓ Build a verified recognition profile</li>
            <li>✓ Showcase instructional competency</li>
            <li>✓ Get pulled by alternative operators</li>
            <li>✓ Portable recognition score</li>
          </ul>
        </section>

        <div className="text-center">
          <Link href="/professional-profile" className="bg-indigo-600 text-white px-6 py-3 rounded-lg font-semibold">
            Build Your Profile →
          </Link>
        </div>
      </main>
    </div>
  );
}
