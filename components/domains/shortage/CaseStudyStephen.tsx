'use client';

import { Users, ArrowRight, AlertCircle } from 'lucide-react';

export default function CaseStudyStephen() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 bg-red-100 border border-red-300 rounded-full px-4 py-2 mb-6">
              <AlertCircle className="w-5 h-5 text-red-600" />
              <span className="text-red-700 font-bold">Case #001 — Verified Testimony</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-bold text-[#1e3a5f] mb-4">
              user:applicant205
            </h2>
            <div className="inline-block bg-gray-100 rounded px-3 py-1 text-sm text-gray-600 mb-4">
              Commercial Pilot Applicant
            </div>
            <p className="text-xl text-gray-600">The 200:10 Bloodbath</p>
          </div>

          {/* Case Study Card */}
          <div className="bg-gray-50 rounded-2xl border-2 border-gray-200 p-8 md:p-12">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Left: Profile */}
              <div>
                <h3 className="text-2xl font-bold text-[#1e3a5f] mb-4">The Profile</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>International CPL holder</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Trained at accredited ATO</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>400+ flight hours</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-green-500">✓</span>
                    <span>Applied for CFI position</span>
                  </li>
                </ul>
              </div>

              {/* Right: The Numbers */}
              <div className="bg-[#1e3a5f] rounded-xl p-6 text-white">
                <div className="flex items-center gap-2 mb-6">
                  <Users className="w-6 h-6" />
                  <h4 className="text-xl font-bold">The Selection Gauntlet</h4>
                </div>

                <div className="space-y-4">
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Total Applicants</span>
                    <span className="text-2xl font-bold">200</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Positions Available</span>
                    <span className="text-2xl font-bold text-green-400">10</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Selection Process</span>
                    <span className="font-bold">6 months</span>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/20 pb-3">
                    <span>Application Fee</span>
                    <span className="font-bold text-red-300">Paid to Apply</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                    <span className="text-lg">Rejection Rate</span>
                    <span className="text-3xl font-bold text-[#c41e3a]">95%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* The Quote */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <blockquote className="text-xl md:text-2xl text-[#1e3a5f] font-bold text-center mb-4">
                "What about the 200 people? What about all these 200-hour pilots with their
                qualified licenses? They spent $50,000 USD.
                <span className="text-[#c41e3a]"> It's not a small amount.</span>"
              </blockquote>
              <p className="text-gray-500 text-center">
                — user:applicant205, rejected after 6-month selection process
              </p>
            </div>

            {/* The Insight */}
            <div className="mt-8 bg-red-50 border border-red-200 rounded-lg p-6">
              <div className="flex items-start gap-4">
                <ArrowRight className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                <div>
                  <h4 className="font-bold text-red-800 mb-2">
                    The Industry Claims "Pilot Shortage"
                  </h4>
                  <p className="text-red-700">
                    Yet they run <strong>200:10 selection ratios</strong> with{' '}
                    <strong>95% rejection rates</strong>. Pilots pay money to lose. 6 months wasted.
                    No placement.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-8">
            <p className="text-gray-600 mb-4">Have a similar story? Your testimony matters.</p>
            <a
              href="#share-story"
              className="inline-block bg-[#c41e3a] hover:bg-[#a31830] text-white font-bold py-3 px-8 rounded-lg transition-colors"
            >
              Share Your Verified Story →
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
