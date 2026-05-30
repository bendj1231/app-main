'use client';

import { Shield, Users, ExternalLink, CheckCircle, ArrowRight } from 'lucide-react';

export default function HowWeWork() {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-[#c41e3a]/10 border border-[#c41e3a]/20 rounded-full px-4 py-2 mb-6">
              <Users className="w-5 h-5 text-[#c41e3a]" />
              <span className="text-[#c41e3a] font-bold">Pilots Speaking For Pilots</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">How We Work</h2>
          </div>

          {/* Main Content */}
          <div className="space-y-8">
            {/* Anonymous Stories */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <Shield className="w-6 h-6 text-[#c41e3a]" />
                Anonymous Stories, Protected Voices
              </h3>
              <p className="text-gray-600 mb-4">
                We are speaking for pilots. Therefore, we welcome pilots telling their story — why
                they shifted their career, why they decided to speak about their training
                investment, their placement struggles, and how they are currently surviving in this
                industry.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  <strong>All pilots are anonymous</strong> for safety concerns against
                  whistleblowing. Your identity is protected. Your voice matters.
                </p>
              </div>
            </div>

            {/* Verification */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <CheckCircle className="w-6 h-6 text-green-600" />
                Verified For Credibility
              </h3>
              <p className="text-gray-600 mb-4">
                If you are a pilot and would like to confirm your story, we support{' '}
                <a
                  href="https://pilotrecognition.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c41e3a] hover:underline font-semibold"
                >
                  pilotrecognition.com
                </a>{' '}
                as a verification provider.
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Verify logbooks</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Verify flight hours</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500">✓</span>
                  <span>Verify licenses</span>
                </li>
              </ul>
              <p className="text-gray-600 text-sm">
                This adds another layer of credibility for pilots — part of solving the issue in the
                industry.
              </p>
            </div>

            {/* Pathways */}
            <div className="bg-white rounded-2xl border border-gray-200 p-8">
              <h3 className="text-xl font-bold text-[#1e3a5f] mb-4 flex items-center gap-2">
                <ArrowRight className="w-6 h-6 text-[#c41e3a]" />
                Career Trajectory — A First For Aviation
              </h3>
              <p className="text-gray-600 mb-4">
                We are also in collaboration with{' '}
                <a
                  href="https://pilotcareerpathways.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#c41e3a] hover:underline font-semibold"
                >
                  pilotcareerpathways.com
                </a>{' '}
                — directly working with ATOs, flight schools, manufacturers, and airlines to
                provide:
              </p>
              <ul className="space-y-2 text-gray-600 mb-4">
                <li className="flex items-start gap-2">
                  <span className="text-[#c41e3a]">•</span>
                  <span>Up-to-date requirements for each airline</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c41e3a]">•</span>
                  <span>Up-to-date expectations before you apply</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-[#c41e3a]">•</span>
                  <span>Alignment support from pilotrecognition.com</span>
                </li>
              </ul>
              <div className="bg-[#1e3a5f]/5 rounded-lg p-4">
                <p className="text-[#1e3a5f] text-sm">
                  <strong>Match your profile</strong> against an airline or manufacturer type
                  rating. See what you're missing and how to get there. A career trajectory where
                  aviation has never had before.
                </p>
              </div>
            </div>

            {/* Collaboration Welcome */}
            <div className="bg-[#1e3a5f] rounded-2xl p-8 text-white text-center">
              <h3 className="text-2xl font-bold mb-4">We Are pilotshortage.org</h3>
              <p className="text-white/90 mb-6 max-w-2xl mx-auto">
                On a mission to solve the issue in the industry through transparency and clarity. We
                are welcome to other associations to further fight the cause.
              </p>
              <a
                href="#share-story"
                className="inline-flex items-center gap-2 bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-8 rounded-lg transition-colors"
              >
                Share Your Story
                <ExternalLink className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
